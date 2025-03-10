/* -*- Mode: C++; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
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
 * The Original Code is mozilla.org code.
 *
 * The Initial Developer of the Original Code is
 * Netscape Communications Corporation.
 * Portions created by the Initial Developer are Copyright (C) 1998
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either of the GNU General Public License Version 2 or later (the "GPL"),
 * or the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
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

/*
 * A class for handing out nodeinfos and ensuring sharing of them as needed.
 */

#include "nsNodeInfoManager.h"
#include "nsNodeInfo.h"
#include "nsCOMPtr.h"
#include "nsString.h"
#include "nsIAtom.h"
#include "nsIDocument.h"
#include "nsIPrincipal.h"
#include "nsIURI.h"
#include "nsContentUtils.h"
#include "nsReadableUtils.h"
#include "nsGkAtoms.h"
#include "nsComponentManagerUtils.h"
#include "prbit.h"
#include "plarena.h"
#include "nsMemory.h"

#define NS_MAX_NODE_RECYCLE_SIZE \
  (NS_NODE_RECYCLER_SIZE * sizeof(void*))

#ifdef DEBUG
static PRUint32 gDOMNodeAllocators = 0;
// Counts the number of non-freed allocations.
static size_t   gDOMNodeAllocations = 0;
static PRUint32 gDOMNodeRecyclerCounters[NS_NODE_RECYCLER_SIZE];
static PRUint32 gDOMNodeNormalAllocations = 0;
class nsDOMNodeAllocatorTester
{
public:
  nsDOMNodeAllocatorTester()
  {
    memset(gDOMNodeRecyclerCounters, 0, sizeof(gDOMNodeRecyclerCounters));
  }
  ~nsDOMNodeAllocatorTester()
  {
#ifdef DEBUG_smaug
    for (PRInt32 i = 0 ; i < NS_NODE_RECYCLER_SIZE; ++i) {
      if (gDOMNodeRecyclerCounters[i]) {
        printf("DOMNodeAllocator, arena allocation: %u bytes %u times\n",
               static_cast<unsigned int>((i + 1) * sizeof(void*)),
               gDOMNodeRecyclerCounters[i]);
      }
    }
    if (gDOMNodeNormalAllocations) {
      printf("DOMNodeAllocator, normal allocations: %i times \n",
             gDOMNodeNormalAllocations);
    }
#endif
    if (gDOMNodeAllocations != 0) {
      printf("nsDOMNodeAllocator leaked %u bytes \n",
             static_cast<unsigned int>(gDOMNodeAllocations));
    }
  }
};
nsDOMNodeAllocatorTester gDOMAllocatorTester;
#endif

nsDOMNodeAllocator::~nsDOMNodeAllocator()
{
  if (mPool) {
    PL_FinishArenaPool(mPool);
    delete mPool;
  }
#ifdef DEBUG
  --gDOMNodeAllocators;
#endif
}

nsresult
nsDOMNodeAllocator::Init()
{
#ifdef DEBUG
  ++gDOMNodeAllocators;
#endif
  memset(mRecyclers, 0, sizeof(mRecyclers));
  return NS_OK;
}

nsrefcnt
nsDOMNodeAllocator::Release()
{
  NS_PRECONDITION(0 != mRefCnt, "dup release");
  --mRefCnt;
  NS_LOG_RELEASE(this, mRefCnt, "nsDOMNodeAllocator");
  if (mRefCnt == 0) {
    mRefCnt = 1; /* stabilize */
    delete this;
    return 0;
  }
  return mRefCnt;
}

void*
nsDOMNodeAllocator::Alloc(size_t aSize)
{
  void* result = nsnull;

  // Ensure we have correct alignment for pointers.
  aSize = aSize ? PR_ROUNDUP(aSize, sizeof(void*)) : sizeof(void*);
  // Check recyclers first
  if (aSize <= NS_MAX_NODE_RECYCLE_SIZE) {
    const PRInt32 index = (aSize / sizeof(void*)) - 1;
    result = mRecyclers[index];
    if (result) {
      // Need to move to the next object
      void* next = *((void**)result);
      mRecyclers[index] = next;
    }
    if (!result) {
      if (!mPool) {
        mPool = new PLArenaPool();
        NS_ENSURE_TRUE(mPool, nsnull);
        PL_InitArenaPool(mPool, "nsDOMNodeAllocator",
                         4096 * (sizeof(void*)/4), 0);
      }
      // Allocate a new chunk from the arena
      PL_ARENA_ALLOCATE(result, mPool, aSize);
    }
#ifdef DEBUG
    ++gDOMNodeRecyclerCounters[index];
#endif
  } else {
    result = nsMemory::Alloc(aSize);
#ifdef DEBUG
    ++gDOMNodeNormalAllocations;
#endif
  }

#ifdef DEBUG
  gDOMNodeAllocations += aSize;
#endif
  return result;
}

void
nsDOMNodeAllocator::Free(size_t aSize, void* aPtr)
{
  if (!aPtr) {
    return;
  }
  // Ensure we have correct alignment for pointers.
  aSize = aSize ? PR_ROUNDUP(aSize, sizeof(void*)) : sizeof(void*);
  // See if it's a size that we recycle
  if (aSize <= NS_MAX_NODE_RECYCLE_SIZE) {
    const PRInt32 index = (aSize / sizeof(void*)) - 1;
    void* currentTop = mRecyclers[index];
    mRecyclers[index] = aPtr;
    *((void**)aPtr) = currentTop;
  } else {
    nsMemory::Free(aPtr);
  }

#ifdef DEBUG
  gDOMNodeAllocations -= aSize;
#endif
}

PRUint32 nsNodeInfoManager::gNodeManagerCount;

PLHashNumber
nsNodeInfoManager::GetNodeInfoInnerHashValue(const void *key)
{
  NS_ASSERTION(key, "Null key passed to nsNodeInfo::GetHashValue!");

  const nsINodeInfo::nsNodeInfoInner *node =
    reinterpret_cast<const nsINodeInfo::nsNodeInfoInner *>(key);

  // Is this an acceptable hash value?
  return (PLHashNumber(NS_PTR_TO_INT32(node->mName)) & 0xffff) >> 8;
}


PRIntn
nsNodeInfoManager::NodeInfoInnerKeyCompare(const void *key1, const void *key2)
{
  NS_ASSERTION(key1 && key2, "Null key passed to NodeInfoInnerKeyCompare!");

  const nsINodeInfo::nsNodeInfoInner *node1 =
    reinterpret_cast<const nsINodeInfo::nsNodeInfoInner *>(key1);
  const nsINodeInfo::nsNodeInfoInner *node2 =
    reinterpret_cast<const nsINodeInfo::nsNodeInfoInner *>(key2);

  return (node1->mName == node2->mName &&
          node1->mPrefix == node2->mPrefix &&
          node1->mNamespaceID == node2->mNamespaceID);
}


nsNodeInfoManager::nsNodeInfoManager()
  : mDocument(nsnull),
    mPrincipal(nsnull),
    mTextNodeInfo(nsnull),
    mCommentNodeInfo(nsnull),
    mDocumentNodeInfo(nsnull)
{
  ++gNodeManagerCount;

  mNodeInfoHash = PL_NewHashTable(32, GetNodeInfoInnerHashValue,
                                  NodeInfoInnerKeyCompare,
                                  PL_CompareValues, nsnull, nsnull);

#ifdef DEBUG_jst
  printf ("Creating NodeInfoManager, gcount = %d\n", gNodeManagerCount);
#endif
}


nsNodeInfoManager::~nsNodeInfoManager()
{
  --gNodeManagerCount;

  if (mNodeInfoHash)
    PL_HashTableDestroy(mNodeInfoHash);


  if (gNodeManagerCount == 0) {
    nsNodeInfo::ClearCache();
  }

  // Note: mPrincipal may be null here if we never got inited correctly
  NS_IF_RELEASE(mPrincipal);

#ifdef DEBUG_jst
  printf ("Removing NodeInfoManager, gcount = %d\n", gNodeManagerCount);
#endif
}


nsrefcnt
nsNodeInfoManager::AddRef()
{
  NS_PRECONDITION(PRInt32(mRefCnt) >= 0, "illegal refcnt");

  nsrefcnt count = PR_AtomicIncrement((PRInt32*)&mRefCnt);
  NS_LOG_ADDREF(this, count, "nsNodeInfoManager", sizeof(*this));

  return count;
}

nsrefcnt
nsNodeInfoManager::Release()
{
  NS_PRECONDITION(0 != mRefCnt, "dup release");

  nsrefcnt count = PR_AtomicDecrement((PRInt32 *)&mRefCnt);
  NS_LOG_RELEASE(this, count, "nsNodeInfoManager");
  if (count == 0) {
    mRefCnt = 1; /* stabilize */
    delete this;
  }

  return count;
}

nsresult
nsNodeInfoManager::Init(nsIDocument *aDocument)
{
  NS_ENSURE_TRUE(mNodeInfoHash, NS_ERROR_OUT_OF_MEMORY);

  mNodeAllocator = new nsDOMNodeAllocator();
  NS_ENSURE_TRUE(mNodeAllocator && NS_SUCCEEDED(mNodeAllocator->Init()),
                 NS_ERROR_OUT_OF_MEMORY);

  NS_PRECONDITION(!mPrincipal,
                  "Being inited when we already have a principal?");
  nsresult rv = CallCreateInstance("@mozilla.org/nullprincipal;1",
                                   &mPrincipal);
  NS_ENSURE_TRUE(mPrincipal, rv);

  mDefaultPrincipal = mPrincipal;

  mDocument = aDocument;

  return NS_OK;
}

void
nsNodeInfoManager::DropDocumentReference()
{
  mDocument = nsnull;
}


nsresult
nsNodeInfoManager::GetNodeInfo(nsIAtom *aName, nsIAtom *aPrefix,
                               PRInt32 aNamespaceID, nsINodeInfo** aNodeInfo)
{
  NS_ENSURE_ARG_POINTER(aName);
  NS_ASSERTION(!aName->Equals(EmptyString()),
               "Don't pass an empty string to GetNodeInfo, fix caller.");

  nsINodeInfo::nsNodeInfoInner tmpKey(aName, aPrefix, aNamespaceID);

  void *node = PL_HashTableLookup(mNodeInfoHash, &tmpKey);

  if (node) {
    *aNodeInfo = static_cast<nsINodeInfo *>(node);

    NS_ADDREF(*aNodeInfo);

    return NS_OK;
  }

  nsNodeInfo *newNodeInfo = nsNodeInfo::Create();
  NS_ENSURE_TRUE(newNodeInfo, NS_ERROR_OUT_OF_MEMORY);

  NS_ADDREF(newNodeInfo);

  nsresult rv = newNodeInfo->Init(aName, aPrefix, aNamespaceID, this);
  NS_ENSURE_SUCCESS(rv, rv);

  PLHashEntry *he;
  he = PL_HashTableAdd(mNodeInfoHash, &newNodeInfo->mInner, newNodeInfo);
  NS_ENSURE_TRUE(he, NS_ERROR_OUT_OF_MEMORY);

  *aNodeInfo = newNodeInfo;

  return NS_OK;
}


nsresult
nsNodeInfoManager::GetNodeInfo(const nsAString& aName, nsIAtom *aPrefix,
                               PRInt32 aNamespaceID, nsINodeInfo** aNodeInfo)
{
  nsCOMPtr<nsIAtom> name = do_GetAtom(aName);
  return nsNodeInfoManager::GetNodeInfo(name, aPrefix, aNamespaceID,
                                        aNodeInfo);
}


nsresult
nsNodeInfoManager::GetNodeInfo(const nsAString& aQualifiedName,
                               const nsAString& aNamespaceURI,
                               nsINodeInfo** aNodeInfo)
{
  NS_ENSURE_ARG(!aQualifiedName.IsEmpty());

  nsAString::const_iterator start, end;
  aQualifiedName.BeginReading(start);
  aQualifiedName.EndReading(end);

  nsCOMPtr<nsIAtom> prefixAtom;

  nsAString::const_iterator iter(start);

  if (FindCharInReadable(':', iter, end)) {
    prefixAtom = do_GetAtom(Substring(start, iter));
    NS_ENSURE_TRUE(prefixAtom, NS_ERROR_OUT_OF_MEMORY);

    start = ++iter; // step over the ':'

    if (iter == end) {
      // No data after the ':'.

      return NS_ERROR_INVALID_ARG;
    }
  }

  nsCOMPtr<nsIAtom> nameAtom = do_GetAtom(Substring(start, end));
  NS_ENSURE_TRUE(nameAtom, NS_ERROR_OUT_OF_MEMORY);

  PRInt32 nsid = kNameSpaceID_None;

  if (!aNamespaceURI.IsEmpty()) {
    nsresult rv = nsContentUtils::NameSpaceManager()->
      RegisterNameSpace(aNamespaceURI, nsid);
    NS_ENSURE_SUCCESS(rv, rv);
  }

  return GetNodeInfo(nameAtom, prefixAtom, nsid, aNodeInfo);
}

already_AddRefed<nsINodeInfo>
nsNodeInfoManager::GetTextNodeInfo()
{
  if (!mTextNodeInfo) {
    GetNodeInfo(nsGkAtoms::textTagName, nsnull, kNameSpaceID_None,
                &mTextNodeInfo);
  }
  else {
    NS_ADDREF(mTextNodeInfo);
  }

  return mTextNodeInfo;
}

already_AddRefed<nsINodeInfo>
nsNodeInfoManager::GetCommentNodeInfo()
{
  if (!mCommentNodeInfo) {
    GetNodeInfo(nsGkAtoms::commentTagName, nsnull, kNameSpaceID_None,
                &mCommentNodeInfo);
  }
  else {
    NS_ADDREF(mCommentNodeInfo);
  }

  return mCommentNodeInfo;
}

already_AddRefed<nsINodeInfo>
nsNodeInfoManager::GetDocumentNodeInfo()
{
  if (!mDocumentNodeInfo) {
    GetNodeInfo(nsGkAtoms::documentNodeName, nsnull, kNameSpaceID_None,
                &mDocumentNodeInfo);
  }
  else {
    NS_ADDREF(mDocumentNodeInfo);
  }

  return mDocumentNodeInfo;
}

void
nsNodeInfoManager::SetDocumentPrincipal(nsIPrincipal *aPrincipal)
{
  NS_RELEASE(mPrincipal);
  if (!aPrincipal) {
    aPrincipal = mDefaultPrincipal;
  }

  NS_ASSERTION(aPrincipal, "Must have principal by this point!");
  
  NS_ADDREF(mPrincipal = aPrincipal);
}

void
nsNodeInfoManager::RemoveNodeInfo(nsNodeInfo *aNodeInfo)
{
  NS_PRECONDITION(aNodeInfo, "Trying to remove null nodeinfo from manager!");

  // Drop weak reference if needed
  if (aNodeInfo == mTextNodeInfo) {
    mTextNodeInfo = nsnull;
  }
  else if (aNodeInfo == mCommentNodeInfo) {
    mCommentNodeInfo = nsnull;
  }
  else if (aNodeInfo == mDocumentNodeInfo) {
    mDocumentNodeInfo = nsnull;
  }

#ifdef DEBUG
  PRBool ret =
#endif
  PL_HashTableRemove(mNodeInfoHash, &aNodeInfo->mInner);

  NS_POSTCONDITION(ret, "Can't find nsINodeInfo to remove!!!");
}
