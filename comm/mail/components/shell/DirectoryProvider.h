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
 * The Original Code is the Mozilla Firefox browser.
 *
 * The Initial Developer of the Original Code is
 * Benjamin Smedberg <benjamin@smedbergs.us>
 *
 * Portions created by the Initial Developer are Copyright (C) 2005
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
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

#ifndef DirectoryProvider_h__
#define DirectoryProvider_h__

#include "nsIDirectoryService.h"
#include "nsComponentManagerUtils.h"
#include "nsISimpleEnumerator.h"
#include "nsIFile.h"

#define NS_MAILDIRECTORYPROVIDER_CONTRACTID \
  "@mozilla.org/mail/directory-provider;1"

#define NS_MAILDIRECTORYPROVIDER_CID \
  { 0xa7e8e047, 0xd36e, 0x4605, { 0xa5, 0xab, 0x1a, 0x62, 0x29, 0x03, 0x85, 0x99 }}

namespace mozilla {
namespace mail {

/**
 * Ideally this would be a javascript class, however, when we do so, this somehow breaks
 * our xpcshell-tests due to various errors probably because of the xpconnect process.
 * For now, we'll work around it with c++ until we can fix those issues. See bug 733802
 * for more details.
 */
class DirectoryProvider : public nsIDirectoryServiceProvider2
{
public:
  NS_DECL_ISUPPORTS
  NS_DECL_NSIDIRECTORYSERVICEPROVIDER
  NS_DECL_NSIDIRECTORYSERVICEPROVIDER2

  DirectoryProvider() {}
  virtual ~DirectoryProvider() {}

private:
  class AppendingEnumerator : public nsISimpleEnumerator
  {
  public:
    NS_DECL_ISUPPORTS
    NS_DECL_NSISIMPLEENUMERATOR

    AppendingEnumerator(nsISimpleEnumerator* aBase,
                        char const *const *aAppendList);
    virtual ~AppendingEnumerator() {}

  private:
    nsCOMPtr<nsISimpleEnumerator> mBase;
    char const *const *const      mAppendList;
    nsCOMPtr<nsIFile>             mNext;
  };
};

} // namespace mail
} // namespace mozilla

#endif // DirectoryProvider_h__
