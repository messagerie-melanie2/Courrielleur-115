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
 * The Original Code is Places code.
 *
 * The Initial Developer of the Original Code is
 * Google Inc.
 * Portions created by the Initial Developer are Copyright (C) 2005
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Brett Wilson <brettw@gmail.com> (original author)
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

#ifndef nsNavHistory_h_
#define nsNavHistory_h_

#include "mozIStorageService.h"
#include "mozIStorageConnection.h"
#include "mozIStorageValueArray.h"
#include "mozIStorageStatement.h"
#include "nsAutoPtr.h"
#include "nsCOMArray.h"
#include "nsCOMPtr.h"
#include "nsDataHashtable.h"
#include "nsINavHistoryService.h"
#include "nsIAutoCompleteSearch.h"
#include "nsIAutoCompleteResult.h"
#include "nsIAutoCompleteSimpleResult.h"
#include "nsIBrowserHistory.h"
#include "nsICollation.h"
#include "nsIDateTimeFormat.h"
#include "nsIGlobalHistory.h"
#include "nsIGlobalHistory3.h"
#include "nsIDownloadHistory.h"
#include "nsIPrefService.h"
#include "nsIPrefBranch.h"
#include "nsIObserver.h"
#include "nsIObserverService.h"
#include "nsServiceManagerUtils.h"
#include "nsIStringBundle.h"
#include "nsITimer.h"
#include "nsITreeSelection.h"
#include "nsITreeView.h"
#include "nsString.h"
#include "nsVoidArray.h"
#include "nsWeakReference.h"
#include "nsTArray.h"
#include "nsINavBookmarksService.h"
#include "nsMaybeWeakPtr.h"

#include "nsNavHistoryExpire.h"
#include "nsNavHistoryResult.h"
#include "nsNavHistoryQuery.h"

// set to use more optimized (in-memory database) link coloring
//#define IN_MEMORY_LINKS

// define to enable lazy link adding
#define LAZY_ADD

#define QUERYUPDATE_TIME 0
#define QUERYUPDATE_SIMPLE 1
#define QUERYUPDATE_COMPLEX 2
#define QUERYUPDATE_COMPLEX_WITH_BOOKMARKS 3

// this is a work-around for a problem with the optimizer of sqlite
// A sub-select on MAX(visit_date) is slower than this query with our indexes
// see Bug #392399 for more details
#define SQL_STR_FRAGMENT_MAX_VISIT_DATE( place_relation ) \
  "(SELECT visit_date FROM moz_historyvisits WHERE place_id = " place_relation \
  " AND visit_type NOT IN (0,4) ORDER BY visit_date DESC LIMIT 1)"

struct AutoCompleteIntermediateResult;
class AutoCompleteResultComparator;
class mozIAnnotationService;
class nsNavHistory;
class nsNavBookmarks;
class QueryKeyValuePair;

// nsNavHistory

class nsNavHistory : public nsSupportsWeakReference,
                     public nsINavHistoryService,
                     public nsIObserver,
                     public nsIBrowserHistory,
                     public nsIGlobalHistory3,
                     public nsIDownloadHistory,
                     public nsIAutoCompleteSearch,
                     public nsIAutoCompleteSimpleResultListener
{
  friend class AutoCompleteIntermediateResultSet;
  friend class AutoCompleteResultComparator;
public:
  nsNavHistory();

  NS_DECL_ISUPPORTS

  NS_DECL_NSINAVHISTORYSERVICE
  NS_DECL_NSIGLOBALHISTORY2
  NS_DECL_NSIGLOBALHISTORY3
  NS_DECL_NSIDOWNLOADHISTORY
  NS_DECL_NSIBROWSERHISTORY
  NS_DECL_NSIOBSERVER
  NS_DECL_NSIAUTOCOMPLETESEARCH
  NS_DECL_NSIAUTOCOMPLETESIMPLERESULTLISTENER

  nsresult Init();

  /**
   * Used by other components in the places directory such as the annotation
   * service to get a reference to this history object. Returns a pointer to
   * the service if it exists. Otherwise creates one. Returns NULL on error.
   */
  static nsNavHistory* GetHistoryService()
  {
    if (! gHistoryService) {
      nsresult rv;
      nsCOMPtr<nsINavHistoryService> serv(do_GetService("@mozilla.org/browser/nav-history-service;1", &rv));
      NS_ENSURE_SUCCESS(rv, nsnull);

      // our constructor should have set the static variable. If it didn't,
      // something is wrong.
      NS_ASSERTION(gHistoryService, "History service creation failed");
    }
    return gHistoryService;
  }

  /**
   * Call this function before doing any database reads. It will ensure that
   * any data not flushed to the DB yet is flushed.
   */
  void SyncDB()
  {
    #ifdef LAZY_ADD
      CommitLazyMessages();
    #endif
  }

#ifdef LAZY_ADD
  /**
   * Adds a lazy message for adding a favicon. Used by the favicon service so
   * that favicons are handled lazily just like page adds.
   */
  nsresult AddLazyLoadFaviconMessage(nsIURI* aPage, nsIURI* aFavicon,
                                     PRBool aForceReload);
#endif

  /**
   * Returns the database ID for the given URI, or 0 if not found and autoCreate
   * is false.
   */
  nsresult GetUrlIdFor(nsIURI* aURI, PRInt64* aEntryID,
                       PRBool aAutoCreate);

  /**
   * Returns a pointer to the storage connection used by history. This
   * connection object is also used by the annotation service and bookmarks, so
   * that things can be grouped into transactions across these components.
   *
   * NOT ADDREFed.
   *
   * This connection can only be used in the thread that created it the
   * history service!
   */
  mozIStorageConnection* GetStorageConnection()
  {
    return mDBConn;
  }

#ifdef IN_MEMORY_LINKS
  mozIStorageConnection* GetMemoryStorageConnection()
  {
    return mMemDBConn;
  }
#endif

  /**
   * These functions return non-owning references to the locale-specific
   * objects for places components. Guaranteed to return non-NULL.
   */
  nsIStringBundle* GetBundle()
    { return mBundle; }
  nsILocale* GetLocale()
    { return mLocale; }
  nsICollation* GetCollation()
    { return mCollation; }
  nsIDateTimeFormat* GetDateFormatter()
    { return mDateFormatter; }

  // returns true if history has been disabled
  PRBool IsHistoryDisabled() { return mExpireDaysMax == 0; }

  // get the statement for selecting a history row by URL
  mozIStorageStatement* DBGetURLPageInfo() { return mDBGetURLPageInfo; }

  // Constants for the columns returned by the above statement.
  static const PRInt32 kGetInfoIndex_PageID;
  static const PRInt32 kGetInfoIndex_URL;
  static const PRInt32 kGetInfoIndex_Title;
  static const PRInt32 kGetInfoIndex_RevHost;
  static const PRInt32 kGetInfoIndex_VisitCount;
  static const PRInt32 kGetInfoIndex_ItemId;
  static const PRInt32 kGetInfoIndex_ItemDateAdded;
  static const PRInt32 kGetInfoIndex_ItemLastModified;

  // select a history row by id
  mozIStorageStatement* DBGetIdPageInfo() { return mDBGetIdPageInfo; }

  // Constants for the columns returned by the above statement
  // (in addition to the ones above).
  static const PRInt32 kGetInfoIndex_VisitDate;
  static const PRInt32 kGetInfoIndex_FaviconURL;

  // used in execute queries to get session ID info (only for visits)
  static const PRInt32 kGetInfoIndex_SessionId;

  // this actually executes a query and gives you results, it is used by
  // nsNavHistoryQueryResultNode
  nsresult GetQueryResults(nsNavHistoryQueryResultNode *aResultNode,
                           const nsCOMArray<nsNavHistoryQuery>& aQueries,
                           nsNavHistoryQueryOptions *aOptions,
                           nsCOMArray<nsNavHistoryResultNode>* aResults);

  // Take a row of kGetInfoIndex_* columns and construct a ResultNode.
  // The row must contain the full set of columns.
  nsresult RowToResult(mozIStorageValueArray* aRow,
                       nsNavHistoryQueryOptions* aOptions,
                       nsNavHistoryResultNode** aResult);
  nsresult QueryRowToResult(PRInt64 aItemId, const nsACString& aURI,
                            const nsACString& aTitle,
                            PRUint32 aAccessCount, PRTime aTime,
                            const nsACString& aFavicon,
                            nsNavHistoryResultNode** aNode);

  nsresult VisitIdToResultNode(PRInt64 visitId,
                               nsNavHistoryQueryOptions* aOptions,
                               nsNavHistoryResultNode** aResult);

  nsresult BookmarkIdToResultNode(PRInt64 aBookmarkId,
                                  nsNavHistoryQueryOptions* aOptions,
                                  nsNavHistoryResultNode** aResult);

  // used by other places components to send history notifications (for example,
  // when the favicon has changed)
  void SendPageChangedNotification(nsIURI* aURI, PRUint32 aWhat,
                                   const nsAString& aValue)
  {
    ENUMERATE_WEAKARRAY(mObservers, nsINavHistoryObserver,
                        OnPageChanged(aURI, aWhat, aValue));
  }

  // current time optimization
  PRTime GetNow();

  // well-known annotations used by the history and bookmarks systems
  static const char kAnnotationPreviousEncoding[];

  // used by query result nodes to update: see comment on body of CanLiveUpdateQuery
  static PRUint32 GetUpdateRequirements(const nsCOMArray<nsNavHistoryQuery>& aQueries,
                                        nsNavHistoryQueryOptions* aOptions,
                                        PRBool* aHasSearchTerms);
  PRBool EvaluateQueryForNode(const nsCOMArray<nsNavHistoryQuery>& aQueries,
                              nsNavHistoryQueryOptions* aOptions,
                              nsNavHistoryResultNode* aNode);

  static nsresult AsciiHostNameFromHostString(const nsACString& aHostName,
                                              nsACString& aAscii);
  static void DomainNameFromHostName(const nsCString& aHostName,
                                     nsACString& aDomainName);
  static PRTime NormalizeTime(PRUint32 aRelative, PRTime aOffset);
  nsresult RecursiveGroup(nsNavHistoryQueryResultNode *aResultNode,
                          const nsCOMArray<nsNavHistoryResultNode>& aSource,
                          const PRUint16* aGroupingMode, PRUint32 aGroupCount,
                          nsCOMArray<nsNavHistoryResultNode>* aDest);

  // Don't use these directly, inside nsNavHistory use UpdateBatchScoper,
  // else use nsINavHistoryService::RunInBatchMode
  nsresult BeginUpdateBatch();
  nsresult EndUpdateBatch();

  // the level of nesting of batches, 0 when no batches are open
  PRInt32 mBatchLevel;

  // lock for RunInBatchMode
  PRLock* mLock;

  // true if the outermost batch has an associated transaction that should
  // be committed when our batch level reaches 0 again.
  PRBool mBatchHasTransaction;

  // better alternative to QueryStringToQueries (in nsNavHistoryQuery.cpp)
  nsresult QueryStringToQueryArray(const nsACString& aQueryString,
                                   nsCOMArray<nsNavHistoryQuery>* aQueries,
                                   nsNavHistoryQueryOptions** aOptions);

  // Import-friendly version of SetPageDetails + AddVisit.
  // This method adds a page to history along with a single last visit.
  // It is an error to call this method if aURI might already be in history.
  // The given aVisitCount should include the given last-visit date.
  // aLastVisitDate can be -1 if there is no last visit date to record.
  //
  // NOTE: This will *replace* existing records for a given URI, creating a
  // new place id, and breaking all existing relationships with for that
  // id, eg: bookmarks, annotations, tags, etc. This is only for use by
  // the import of history.dat on first-run of Places, which currently occurs
  // if no places.sqlite file previously exists.
  nsresult AddPageWithVisit(nsIURI *aURI,
                            const nsString &aTitle,
                            PRBool aHidden, PRBool aTyped,
                            PRInt32 aVisitCount,
                            PRInt32 aLastVisitTransition,
                            PRTime aLastVisitDate);

  // Checks the database for any duplicate URLs.  If any are found,
  // all but the first are removed.  This must be called after using
  // AddPageWithVisit, to ensure that the database is in a consistent state.
  nsresult RemoveDuplicateURIs();

  // sets the schema version in the database to match SCHEMA_VERSION
  nsresult UpdateSchemaVersion();

 private:
  ~nsNavHistory();

  // used by GetHistoryService
  static nsNavHistory* gHistoryService;

protected:

  //
  // Constants
  //
  nsCOMPtr<nsIPrefBranch> mPrefBranch; // MAY BE NULL when we are shutting down
  nsDataHashtable<nsStringHashKey, int> gExpandedItems;

  //
  // Database stuff
  //
  nsCOMPtr<mozIStorageService> mDBService;
  nsCOMPtr<mozIStorageConnection> mDBConn;
  nsCOMPtr<nsIFile> mDBFile;

  nsCOMPtr<mozIStorageStatement> mDBGetURLPageInfo;   // kGetInfoIndex_* results
  nsCOMPtr<mozIStorageStatement> mDBGetIdPageInfo;     // kGetInfoIndex_* results

  nsCOMPtr<mozIStorageStatement> mDBRecentVisitOfURL; // converts URL into most recent visit ID/session ID
  nsCOMPtr<mozIStorageStatement> mDBInsertVisit; // used by AddVisit
  nsCOMPtr<mozIStorageStatement> mDBGetPageVisitStats; // used by AddVisit
  nsCOMPtr<mozIStorageStatement> mDBUpdatePageVisitStats; // used by AddVisit
  nsCOMPtr<mozIStorageStatement> mDBAddNewPage; // used by InternalAddNewPage
  nsCOMPtr<mozIStorageStatement> mDBURIHasTag; // used by UriHasTag
  nsCOMPtr<mozIStorageStatement> mFoldersWithAnnotationQuery;  // used by StartSearch and FilterResultSet

  // these are used by VisitIdToResultNode for making new result nodes from IDs
  nsCOMPtr<mozIStorageStatement> mDBVisitToURLResult; // kGetInfoIndex_* results
  nsCOMPtr<mozIStorageStatement> mDBVisitToVisitResult; // kGetInfoIndex_* results
  nsCOMPtr<mozIStorageStatement> mDBUrlToUrlResult; // kGetInfoIndex_* results
  nsCOMPtr<mozIStorageStatement> mDBBookmarkToUrlResult; // kGetInfoIndex_* results

  nsresult InitDBFile(PRBool aForceInit);
  nsresult BackupDBFile();
  nsresult InitDB(PRBool *aDoImport);
  nsresult InitStatements();
  nsresult ForceMigrateBookmarksDB(mozIStorageConnection *aDBConn);
  nsresult MigrateV3Up(mozIStorageConnection *aDBConn);
  nsresult MigrateV6Up(mozIStorageConnection *aDBConn);
  nsresult EnsureCurrentSchema(mozIStorageConnection* aDBConn);
  nsresult CleanUpOnQuit();

#ifdef IN_MEMORY_LINKS
  // this is the cache DB in memory used for storing visited URLs
  nsCOMPtr<mozIStorageConnection> mMemDBConn;
  nsCOMPtr<mozIStorageStatement> mMemDBAddPage;
  nsCOMPtr<mozIStorageStatement> mMemDBGetPage;

  nsresult InitMemDB();
#endif

  nsresult AddURIInternal(nsIURI* aURI, PRTime aTime, PRBool aRedirect,
                          PRBool aToplevel, nsIURI* aReferrer);

  nsresult AddVisitChain(nsIURI* aURI, PRTime aTime,
                         PRBool aToplevel, PRBool aRedirect,
                         nsIURI* aReferrer, PRInt64* aVisitID,
                         PRInt64* aSessionID, PRInt64* aRedirectBookmark);
  nsresult InternalAddNewPage(nsIURI* aURI, const nsAString& aTitle,
                              PRBool aHidden, PRBool aTyped,
                              PRInt32 aVisitCount, PRInt64* aPageID);
  nsresult InternalAddVisit(PRInt64 aPageID, PRInt64 aReferringVisit,
                            PRInt64 aSessionID, PRTime aTime,
                            PRInt32 aTransitionType, PRInt64* aVisitID);
  PRBool FindLastVisit(nsIURI* aURI, PRInt64* aVisitID,
                       PRInt64* aSessionID);
  PRBool IsURIStringVisited(const nsACString& url);
  nsresult LoadPrefs();

  // Current time optimization
  PRTime mLastNow;
  PRBool mNowValid;
  nsCOMPtr<nsITimer> mExpireNowTimer;
  static void expireNowTimerCallback(nsITimer* aTimer, void* aClosure);

  // expiration
  friend class nsNavHistoryExpire;
  nsNavHistoryExpire mExpire;

#ifdef LAZY_ADD
  // lazy add committing
  struct LazyMessage {
    enum MessageType { Type_Invalid, Type_AddURI, Type_Title, Type_Favicon };
    LazyMessage()
    {
      type = Type_Invalid;
      isRedirect = PR_FALSE;
      isToplevel = PR_FALSE;
      time = 0;
      alwaysLoadFavicon = PR_FALSE;
    }

    // call this with common parms to initialize. Caller is responsible for
    // setting other elements manually depending on type.
    nsresult Init(MessageType aType, nsIURI* aURI)
    {
      NS_ENSURE_ARG_POINTER(aURI);
      type = aType;
      nsresult rv = aURI->Clone(getter_AddRefs(uri));
      NS_ENSURE_SUCCESS(rv, rv);
      return uri->GetSpec(uriSpec);
    }

    // common elements
    MessageType type;
    nsCOMPtr<nsIURI> uri;
    nsCString uriSpec; // stringified version of URI, for quick isVisited

    // valid when type == Type_AddURI
    nsCOMPtr<nsIURI> referrer;
    PRBool isRedirect;
    PRBool isToplevel;
    PRTime time;

    // valid when type == Type_Title
    nsString title;

    // valid when type == LAZY_FAVICON
    nsCOMPtr<nsIURI> favicon;
    PRBool alwaysLoadFavicon;
  };
  nsTArray<LazyMessage> mLazyMessages;
  nsCOMPtr<nsITimer> mLazyTimer;
  PRBool mLazyTimerSet;
  PRUint32 mLazyTimerDeferments; // see StartLazyTimer
  nsresult StartLazyTimer();
  nsresult AddLazyMessage(const LazyMessage& aMessage);
  static void LazyTimerCallback(nsITimer* aTimer, void* aClosure);
  void CommitLazyMessages();
#endif

  nsresult ConstructQueryString(const nsCOMArray<nsNavHistoryQuery>& aQueries, 
                                nsNavHistoryQueryOptions *aOptions,
                                nsCString &queryString);

  nsresult QueryToSelectClause(nsNavHistoryQuery* aQuery,
                               nsNavHistoryQueryOptions* aOptions,
                               PRInt32 aStartParameter,
                               nsCString* aClause,
                               PRInt32* aParamCount,
                               const nsACString& aCommonConditions);
  nsresult BindQueryClauseParameters(mozIStorageStatement* statement,
                                     PRInt32 aStartParameter,
                                     nsNavHistoryQuery* aQuery,
                                     nsNavHistoryQueryOptions* aOptions,
                                     PRInt32* aParamCount);

  nsresult ResultsAsList(mozIStorageStatement* statement,
                         nsNavHistoryQueryOptions* aOptions,
                         nsCOMArray<nsNavHistoryResultNode>* aResults);

  void GetAgeInDaysString(PRInt32 aInt, const PRUnichar *aName, 
                          nsACString& aResult);

  void GetStringFromName(const PRUnichar *aName, nsACString& aResult);

  void TitleForDomain(const nsCString& domain, nsACString& aTitle);

  nsresult SetPageTitleInternal(nsIURI* aURI, const nsAString& aTitle);

  nsresult GroupByDay(nsNavHistoryQueryResultNode *aResultNode,
                      const nsCOMArray<nsNavHistoryResultNode>& aSource,
                      nsCOMArray<nsNavHistoryResultNode>* aDest);

  nsresult GroupByHost(nsNavHistoryQueryResultNode *aResultNode,
                       const nsCOMArray<nsNavHistoryResultNode>& aSource,
                       nsCOMArray<nsNavHistoryResultNode>* aDest,
                       PRBool aIsDomain);

  nsresult GroupByFolder(nsNavHistoryQueryResultNode *aResultNode,
                         const nsCOMArray<nsNavHistoryResultNode>& aSource,
                         nsCOMArray<nsNavHistoryResultNode>* aDest);

  PRBool URIHasTag(const nsACString& aURISpec, const nsAString& aTag);
  PRBool URIHasAnyTagFromTerms(const nsACString& aURISpec, const nsStringArray& aTerms);
  void CreateTermsFromTokens(const nsStringArray& aTagTokens, nsStringArray& aTerms);

  nsresult FilterResultSet(nsNavHistoryQueryResultNode *aParentNode,
                           const nsCOMArray<nsNavHistoryResultNode>& aSet,
                           nsCOMArray<nsNavHistoryResultNode>* aFiltered,
                           const nsCOMArray<nsNavHistoryQuery>& aQueries,
                           nsNavHistoryQueryOptions* aOptions);

  // observers
  nsMaybeWeakPtrArray<nsINavHistoryObserver> mObservers;

  // localization
  nsCOMPtr<nsIStringBundle> mBundle;
  nsCOMPtr<nsILocale> mLocale;
  nsCOMPtr<nsICollation> mCollation;
  nsCOMPtr<nsIDateTimeFormat> mDateFormatter;

  // annotation service : MAY BE NULL!
  //nsCOMPtr<mozIAnnotationService> mAnnotationService;

  // recent events
  typedef nsDataHashtable<nsCStringHashKey, PRInt64> RecentEventHash;
  RecentEventHash mRecentTyped;
  RecentEventHash mRecentBookmark;

  PRBool CheckIsRecentEvent(RecentEventHash* hashTable,
                            const nsACString& url);
  void ExpireNonrecentEvents(RecentEventHash* hashTable);

  // redirect tracking. See GetRedirectFor for a description of how this works.
  struct RedirectInfo {
    nsCString mSourceURI;
    PRTime mTimeCreated;
    PRUint32 mType; // one of TRANSITION_REDIRECT_[TEMPORARY,PERMANENT]
  };
  typedef nsDataHashtable<nsCStringHashKey, RedirectInfo> RedirectHash;
  RedirectHash mRecentRedirects;
  PR_STATIC_CALLBACK(PLDHashOperator) ExpireNonrecentRedirects(
      nsCStringHashKey::KeyType aKey, RedirectInfo& aData, void* aUserArg);
  PRBool GetRedirectFor(const nsACString& aDestination, nsACString& aSource,
                        PRTime* aTime, PRUint32* aRedirectType);

  // session tracking
  PRInt64 mLastSessionID;
  PRInt64 GetNewSessionID() { mLastSessionID ++; return mLastSessionID; }

  //
  // AutoComplete stuff
  //
  static const PRInt32 kAutoCompleteIndex_URL;
  static const PRInt32 kAutoCompleteIndex_Title;
  static const PRInt32 kAutoCompleteIndex_FaviconURL;
  static const PRInt32 kAutoCompleteIndex_ItemId;
  static const PRInt32 kAutoCompleteIndex_ParentId;
  nsCOMPtr<mozIStorageStatement> mDBAutoCompleteQuery; //  kAutoCompleteIndex_* results
  nsCOMPtr<mozIStorageStatement> mDBTagAutoCompleteQuery; //  kAutoCompleteIndex_* results

  nsresult InitAutoComplete();
  nsresult CreateAutoCompleteQueries();
  PRBool mAutoCompleteOnlyTyped;
  nsCOMPtr<nsITimer> mAutoCompleteTimer;

  nsString mCurrentSearchString;
  nsCOMPtr<nsIAutoCompleteObserver> mCurrentListener;
  nsCOMPtr<nsIAutoCompleteSimpleResult> mCurrentResult;
  nsDataHashtable<nsStringHashKey, PRBool> mCurrentResultURLs;
  PRTime mCurrentChunkEndTime;
  PRTime mCurrentOldestVisit;
  PRBool mFirstChunk;

  nsDataHashtable<nsTrimInt64HashKey, PRBool> mLivemarkFeedItemIds;
  nsDataHashtable<nsStringHashKey, PRBool> mLivemarkFeedURIs;

  nsresult AutoCompleteTypedSearch();
  nsresult AutoCompleteFullHistorySearch();
  nsresult AutoCompleteTagsSearch();

  nsresult PerformAutoComplete();
  nsresult StartAutoCompleteTimer(PRUint32 aMilliseconds);
  static void AutoCompleteTimerCallback(nsITimer* aTimer, void* aClosure);
  void DoneSearching();

  PRInt32 mExpireDaysMin;
  PRInt32 mExpireDaysMax;
  PRInt32 mExpireSites;

  // in nsNavHistoryQuery.cpp
  nsresult TokensToQueries(const nsTArray<QueryKeyValuePair>& aTokens,
                           nsCOMArray<nsNavHistoryQuery>* aQueries,
                           nsNavHistoryQueryOptions* aOptions);

  nsCOMPtr<nsITimer> mIdleTimer;
  static void IdleTimerCallback(nsITimer* aTimer, void* aClosure);
  nsresult OnIdle();

  PRInt64 mTagsFolder;
  PRInt64 GetTagsFolder();
};

/**
 * Shared between the places components, this function binds the given URI as
 * UTF8 to the given parameter for the statement.
 */
nsresult BindStatementURI(mozIStorageStatement* statement, PRInt32 index,
                          nsIURI* aURI);

#define PLACES_URI_PREFIX "place:"

/* Returns true if the given URI represents a history query. */
inline PRBool IsQueryURI(const nsCString &uri)
{
  return StringBeginsWith(uri, NS_LITERAL_CSTRING(PLACES_URI_PREFIX));
}

/* Extracts the query string from a query URI. */
inline const nsDependentCSubstring QueryURIToQuery(const nsCString &uri)
{
  NS_ASSERTION(IsQueryURI(uri), "should only be called for query URIs");
  return Substring(uri, NS_LITERAL_CSTRING(PLACES_URI_PREFIX).Length());
}

#endif // nsNavHistory_h_
