/* -*- Mode: C++; tab-width: 8; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is the Feed Content Sniffer.
 *
 * The Initial Developer of the Original Code is Google Inc.
 * Portions created by the Initial Developer are Copyright (C) 2006
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Ben Goodger <beng@google.com>
 *   Robert Sayre <sayrer@gmail.com>
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

#include "nsFeedSniffer.h"

#include "prmem.h"

#include "nsNetCID.h"
#include "nsXPCOM.h"
#include "nsCOMPtr.h"
#include "nsStringStream.h"

#include "nsBrowserCompsCID.h"

#include "nsICategoryManager.h"
#include "nsIServiceManager.h"
#include "nsComponentManagerUtils.h"
#include "nsServiceManagerUtils.h"

#include "nsIStreamConverterService.h"
#include "nsIStreamConverter.h"

#include "nsIStreamListener.h"

#include "nsIHttpChannel.h"
#include "nsIMIMEHeaderParam.h"

#define TYPE_ATOM "application/atom+xml"
#define TYPE_RSS "application/rss+xml"
#define TYPE_MAYBE_FEED "application/vnd.mozilla.maybe.feed"

#define NS_RDF "http://www.w3.org/1999/02/22-rdf-syntax-ns#"
#define NS_RSS "http://purl.org/rss/1.0/"

#define MAX_BYTES 512

NS_IMPL_ISUPPORTS2(nsFeedSniffer, nsIContentSniffer, nsIStreamListener)

nsresult
nsFeedSniffer::ConvertEncodedData(nsIRequest* request,
                                  const PRUint8* data,
                                  PRUint32 length)
{
  nsresult rv = NS_OK;

 mDecodedData = "";
 nsCOMPtr<nsIHttpChannel> httpChannel(do_QueryInterface(request));
  if (!httpChannel)
    return NS_ERROR_NO_INTERFACE;

  nsCAutoString contentEncoding;
  httpChannel->GetResponseHeader(NS_LITERAL_CSTRING("Content-Encoding"), 
                                 contentEncoding);
  if (!contentEncoding.IsEmpty()) {
    nsCOMPtr<nsIStreamConverterService> converterService(do_GetService(NS_STREAMCONVERTERSERVICE_CONTRACTID));
    if (converterService) {
      ToLowerCase(contentEncoding);

      nsCOMPtr<nsIStreamListener> converter;
      rv = converterService->AsyncConvertData(contentEncoding.get(), 
                                              "uncompressed", this, nsnull, 
                                              getter_AddRefs(converter));
      NS_ENSURE_SUCCESS(rv, rv);

      converter->OnStartRequest(request, nsnull);

      nsCOMPtr<nsIStringInputStream> rawStream =
        do_CreateInstance(NS_STRINGINPUTSTREAM_CONTRACTID);
      if (!rawStream)
        return NS_ERROR_FAILURE;

      rv = rawStream->SetData((const char*)data, length);
      NS_ENSURE_SUCCESS(rv, rv);

      rv = converter->OnDataAvailable(request, nsnull, rawStream, 0, length);
      NS_ENSURE_SUCCESS(rv, rv);

      converter->OnStopRequest(request, nsnull, NS_OK);
    }
  }
  return rv;
}

template<int N>
static PRBool
StringBeginsWithLowercaseLiteral(nsAString& aString,
                                 const char (&aSubstring)[N])
{
  return StringHead(aString, N).LowerCaseEqualsLiteral(aSubstring);
}

// XXXsayrer put this in here to get on the branch with minimal delay.
// Trunk really needs to factor this out. This is the third usage.
PRBool
HasAttachmentDisposition(nsIHttpChannel* httpChannel)
{
  if (!httpChannel)
    return PR_FALSE;
  
  nsCAutoString contentDisposition;
  nsresult rv = 
    httpChannel->GetResponseHeader(NS_LITERAL_CSTRING("content-disposition"),
                                   contentDisposition);
  
  if (NS_SUCCEEDED(rv) && !contentDisposition.IsEmpty()) {
    nsCOMPtr<nsIURI> uri;
    httpChannel->GetURI(getter_AddRefs(uri));
    nsCOMPtr<nsIMIMEHeaderParam> mimehdrpar =
      do_GetService(NS_MIMEHEADERPARAM_CONTRACTID, &rv);
    if (NS_SUCCEEDED(rv))
    {
      nsCAutoString fallbackCharset;
      if (uri)
        uri->GetOriginCharset(fallbackCharset);
      nsAutoString dispToken;
      // Get the disposition type
      rv = mimehdrpar->GetParameter(contentDisposition, "", fallbackCharset,
                                    PR_TRUE, nsnull, dispToken);
      // RFC 2183, section 2.8 says that an unknown disposition
      // value should be treated as "attachment"
      // XXXbz this code is duplicated in GetFilenameAndExtensionFromChannel in
      // nsExternalHelperAppService.  Factor it out!
      if (NS_FAILED(rv) || 
          (// Some broken sites just send
           // Content-Disposition: ; filename="file"
           // screen those out here.
           !dispToken.IsEmpty() &&
           !StringBeginsWithLowercaseLiteral(dispToken, "inline") &&
           // Broken sites just send
           // Content-Disposition: filename="file"
           // without a disposition token... screen those out.
           !StringBeginsWithLowercaseLiteral(dispToken, "filename")) &&
          // Also in use is Content-Disposition: name="file"
          !StringBeginsWithLowercaseLiteral(dispToken, "name"))
        // We have a content-disposition of "attachment" or unknown
        return PR_TRUE;
    }
  } 
  
  return PR_FALSE;
}

/**
 * @return the first occurrence of a character within a string buffer,
 *         or nsnull if not found
 */
static const char*
FindChar(char c, const char *begin, const char *end)
{
  for (; begin < end; ++begin) {
    if (*begin == c)
      return begin;
  }
  return nsnull;
}

/**
 *
 * Determine if a substring is the "documentElement" in the document.
 *
 * All of our sniffed substrings: <rss, <feed, <rdf:RDF must be the "document"
 * element within the XML DOM, i.e. the root container element. Otherwise,
 * it's possible that someone embedded one of these tags inside a document of
 * another type, e.g. a HTML document, and we don't want to show the preview
 * page if the document isn't actually a feed.
 * 
 * @param   start
 *          The beginning of the data being sniffed
 * @param   end
 *          The end of the data being sniffed, right before the substring that
 *          was found.
 * @returns PR_TRUE if the found substring is the documentElement, PR_FALSE 
 *          otherwise.
 */
static PRBool
IsDocumentElement(const char *start, const char* end)
{
  // For every tag in the buffer, check to see if it's a PI, Doctype or 
  // comment, our desired substring or something invalid.
  while ( (start = FindChar('<', start, end)) ) {
    ++start;
    if (start >= end)
      return PR_FALSE;

    // Check to see if the character following the '<' is either '?' or '!'
    // (processing instruction or doctype or comment)... these are valid nodes
    // to have in the prologue. 
    if (*start != '?' && *start != '!')
      return PR_FALSE;
    
    // Now advance the iterator until the '>' (We do this because we don't want
    // to sniff indicator substrings that are embedded within other nodes, e.g.
    // comments: <!-- <rdf:RDF .. > -->
    start = FindChar('>', start, end);
    if (!start)
      return PR_FALSE;

    ++start;
  }
  return PR_TRUE;
}

/**
 * Determines whether or not a string exists as the root element in an XML data
 * string buffer.
 * @param   dataString
 *          The data being sniffed
 * @param   substring
 *          The substring being tested for existence and root-ness.
 * @returns PR_TRUE if the substring exists and is the documentElement, PR_FALSE
 *          otherwise.
 */
static PRBool
ContainsTopLevelSubstring(nsACString& dataString, const char *substring) 
{
  PRInt32 offset = dataString.Find(substring);
  if (offset == -1)
    return PR_FALSE;

  const char *begin = dataString.BeginReading();

  // Only do the validation when we find the substring.
  return IsDocumentElement(begin, begin + offset);
}

NS_IMETHODIMP
nsFeedSniffer::GetMIMETypeFromContent(nsIRequest* request, 
                                      const PRUint8* data, 
                                      PRUint32 length, 
                                      nsACString& sniffedType)
{
  nsCOMPtr<nsIHttpChannel> channel(do_QueryInterface(request));
  if (!channel)
    return NS_ERROR_NO_INTERFACE;

  // Check that this is a GET request, since you can't subscribe to a POST...
  nsCAutoString method;
  channel->GetRequestMethod(method);
  if (!method.Equals("GET")) {
    sniffedType.Truncate();
    return NS_OK;
  }

  // We need to find out if this is a load of a view-source document. In this
  // case we do not want to override the content type, since the source display
  // does not need to be converted from feed format to XUL. More importantly, 
  // we don't want to change the content type from something 
  // nsContentDLF::CreateInstance knows about (e.g. application/xml, text/html 
  // etc) to something that only the application fe knows about (maybe.feed) 
  // thus deactivating syntax highlighting.
  nsCOMPtr<nsIURI> originalURI;
  channel->GetOriginalURI(getter_AddRefs(originalURI));

  nsCAutoString scheme;
  originalURI->GetScheme(scheme);
  if (scheme.EqualsLiteral("view-source")) {
    sniffedType.Truncate();
    return NS_OK;
  }

  // Check the Content-Type to see if it is set correctly. If it is set to 
  // something specific that we think is a reliable indication of a feed, don't
  // bother sniffing since we assume the site maintainer knows what they're 
  // doing. 
  nsCAutoString contentType;
  channel->GetContentType(contentType);
  PRBool noSniff = contentType.EqualsLiteral(TYPE_RSS) ||
                   contentType.EqualsLiteral(TYPE_ATOM);

  // Check to see if this was a feed request from the location bar or from
  // the feed: protocol. This is also a reliable indication.
  // The value of the header doesn't matter.  
  if (!noSniff) {
    nsCAutoString sniffHeader;
    nsresult foundHeader =
      channel->GetRequestHeader(NS_LITERAL_CSTRING("X-Moz-Is-Feed"),
                                sniffHeader);
    noSniff = NS_SUCCEEDED(foundHeader);
  }

  if (noSniff) {
    // check for an attachment after we have a likely feed.
    if(HasAttachmentDisposition(channel)) {
      sniffedType.Truncate();
      return NS_OK;
    }

    // set the feed header as a response header, since we have good metadata
    // telling us that the feed is supposed to be RSS or Atom
    channel->SetResponseHeader(NS_LITERAL_CSTRING("X-Moz-Is-Feed"),
                               NS_LITERAL_CSTRING("1"), PR_FALSE);
    sniffedType.AssignLiteral(TYPE_MAYBE_FEED);
    return NS_OK;
  }

  // Now we need to potentially decompress data served with 
  // Content-Encoding: gzip
  nsresult rv = ConvertEncodedData(request, data, length);
  if (NS_FAILED(rv))
    return rv;
  
  const char* testData = 
    mDecodedData.IsEmpty() ? (const char*)data : mDecodedData.get();

  // The strategy here is based on that described in:
  // http://blogs.msdn.com/rssteam/articles/PublishersGuide.aspx
  // for interoperarbility purposes.

  // We cap the number of bytes to scan at MAX_BYTES to prevent picking up 
  // false positives by accidentally reading document content, e.g. a "how to
  // make a feed" page.
  if (length > MAX_BYTES)
    length = MAX_BYTES;

  // Thus begins the actual sniffing.
  nsDependentCSubstring dataString((const char*)testData, length);

  PRBool isFeed = PR_FALSE;

  // RSS 0.91/0.92/2.0
  isFeed = ContainsTopLevelSubstring(dataString, "<rss");

  // Atom 1.0
  if (!isFeed)
    isFeed = ContainsTopLevelSubstring(dataString, "<feed");

  // RSS 1.0
  if (!isFeed) {
    isFeed = ContainsTopLevelSubstring(dataString, "<rdf:RDF") &&
      dataString.Find(NS_RDF) != -1 &&
      dataString.Find(NS_RSS) != -1;
  }

  // If we sniffed a feed, coerce our internal type
  if (isFeed && !HasAttachmentDisposition(channel))
    sniffedType.AssignLiteral(TYPE_MAYBE_FEED);
  else
    sniffedType.Truncate();
  return NS_OK;
}

NS_IMETHODIMP
nsFeedSniffer::OnStartRequest(nsIRequest* request, nsISupports* context)
{
  return NS_OK;
}

NS_METHOD
nsFeedSniffer::AppendSegmentToString(nsIInputStream* inputStream,
                                     void* closure,
                                     const char* rawSegment,
                                     PRUint32 toOffset,
                                     PRUint32 count,
                                     PRUint32* writeCount)
{
  nsCString* decodedData = static_cast<nsCString*>(closure);
  decodedData->Append(rawSegment, count);
  *writeCount = count;
  return NS_OK;
}

NS_IMETHODIMP
nsFeedSniffer::OnDataAvailable(nsIRequest* request, nsISupports* context,
                               nsIInputStream* stream, PRUint32 offset, 
                               PRUint32 count)
{
  PRUint32 read;
  return stream->ReadSegments(AppendSegmentToString, &mDecodedData, count, 
                              &read);
}

NS_IMETHODIMP
nsFeedSniffer::OnStopRequest(nsIRequest* request, nsISupports* context, 
                             nsresult status)
{
  return NS_OK; 
}

NS_METHOD
nsFeedSniffer::Register(nsIComponentManager *compMgr, nsIFile *path, 
                        const char *registryLocation,
                        const char *componentType, 
                        const nsModuleComponentInfo *info)
{
  nsresult rv;
  nsCOMPtr<nsICategoryManager> catman = do_GetService(NS_CATEGORYMANAGER_CONTRACTID, &rv);
  if (NS_FAILED(rv)) 
    return rv;

  return catman->AddCategoryEntry(NS_CONTENT_SNIFFER_CATEGORY, "Feed Sniffer", 
                                  NS_FEEDSNIFFER_CONTRACTID, PR_TRUE, PR_TRUE, 
                                  nsnull);
}
