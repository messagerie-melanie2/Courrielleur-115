/* -*- Mode: C++; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* vim: set ts=2 sw=2 et tw=78: */
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
 * The Mozilla Foundation.
 * Portions created by the Initial Developer are Copyright (C) 2006
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Johnny Stenback <jst@mozilla.org> (original author)
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

#include "xpcprivate.h"
#include "jsdbgapi.h"
#include "jsscript.h" // for js_ScriptClass
#include "XPCWrapper.h"

JS_STATIC_DLL_CALLBACK(JSBool)
XPC_SJOW_AddProperty(JSContext *cx, JSObject *obj, jsval id, jsval *vp);

JS_STATIC_DLL_CALLBACK(JSBool)
XPC_SJOW_DelProperty(JSContext *cx, JSObject *obj, jsval id, jsval *vp);

JS_STATIC_DLL_CALLBACK(JSBool)
XPC_SJOW_GetProperty(JSContext *cx, JSObject *obj, jsval id, jsval *vp);

JS_STATIC_DLL_CALLBACK(JSBool)
XPC_SJOW_SetProperty(JSContext *cx, JSObject *obj, jsval id, jsval *vp);

JS_STATIC_DLL_CALLBACK(JSBool)
XPC_SJOW_Enumerate(JSContext *cx, JSObject *obj);

JS_STATIC_DLL_CALLBACK(JSBool)
XPC_SJOW_NewResolve(JSContext *cx, JSObject *obj, jsval id, uintN flags,
                    JSObject **objp);

JS_STATIC_DLL_CALLBACK(JSBool)
XPC_SJOW_Convert(JSContext *cx, JSObject *obj, JSType type, jsval *vp);

JS_STATIC_DLL_CALLBACK(void)
XPC_SJOW_Finalize(JSContext *cx, JSObject *obj);

JS_STATIC_DLL_CALLBACK(JSBool)
XPC_SJOW_CheckAccess(JSContext *cx, JSObject *obj, jsval id, JSAccessMode mode,
                     jsval *vp);

JS_STATIC_DLL_CALLBACK(JSBool)
XPC_SJOW_Call(JSContext *cx, JSObject *obj, uintN argc, jsval *argv,
              jsval *rval);

JSBool
XPC_SJOW_Construct(JSContext *cx, JSObject *obj, uintN argc, jsval *argv,
                   jsval *rval);

JS_STATIC_DLL_CALLBACK(JSBool)
XPC_SJOW_Equality(JSContext *cx, JSObject *obj, jsval v, JSBool *bp);

JS_STATIC_DLL_CALLBACK(JSObject *)
XPC_SJOW_Iterator(JSContext *cx, JSObject *obj, JSBool keysonly);

JS_STATIC_DLL_CALLBACK(JSObject *)
XPC_SJOW_WrappedObject(JSContext *cx, JSObject *obj);

static inline
JSBool
ThrowException(nsresult ex, JSContext *cx)
{
  XPCThrower::Throw(ex, cx);

  return JS_FALSE;
}

// Find the subject and object principal. The argument
// subjectPrincipal can be null if the caller doesn't care about the
// subject principal, and secMgr can also be null if the caller
// doesn't need the security manager.
static nsresult
FindPrincipals(JSContext *cx, JSObject *obj, nsIPrincipal **objectPrincipal,
               nsIPrincipal **subjectPrincipal,
               nsIScriptSecurityManager **secMgr)
{
  XPCCallContext ccx(JS_CALLER, cx);

  if (!ccx.IsValid()) {
    return NS_ERROR_UNEXPECTED;
  }

  nsCOMPtr<nsIXPCSecurityManager> sm = ccx.GetXPCContext()->
    GetAppropriateSecurityManager(nsIXPCSecurityManager::HOOK_CALL_METHOD);

  nsCOMPtr<nsIScriptSecurityManager> ssm(do_QueryInterface(sm));

  if (subjectPrincipal) {
    nsCOMPtr<nsIPrincipal> tmp = ssm->GetCxSubjectPrincipal(cx);

    if (!tmp) {
      return NS_ERROR_XPC_SECURITY_MANAGER_VETO;
    }

    tmp.swap(*subjectPrincipal);
  }

  ssm->GetObjectPrincipal(cx, obj, objectPrincipal);

  if (secMgr) {
    *secMgr = nsnull;
    ssm.swap(*secMgr);
  }

  return *objectPrincipal ? NS_OK : NS_ERROR_XPC_SECURITY_MANAGER_VETO;
}

static PRBool
CanCallerAccess(JSContext *cx, JSObject *unsafeObj)
{
  nsCOMPtr<nsIPrincipal> subjPrincipal, objPrincipal;
  nsCOMPtr<nsIScriptSecurityManager> ssm;
  nsresult rv = FindPrincipals(cx, unsafeObj, getter_AddRefs(objPrincipal),
                               getter_AddRefs(subjPrincipal),
                               getter_AddRefs(ssm));
  if (NS_FAILED(rv)) {
    return ThrowException(rv, cx);
  }

  PRBool subsumes;
  rv = subjPrincipal->Subsumes(objPrincipal, &subsumes);

  if (NS_FAILED(rv) || !subsumes) {
    PRBool enabled = PR_FALSE;
    rv = ssm->IsCapabilityEnabled("UniversalXPConnect", &enabled);
    if (NS_FAILED(rv)) {
      return ThrowException(rv, cx);
    }

    if (!enabled) {
      return ThrowException(NS_ERROR_XPC_SECURITY_MANAGER_VETO, cx);
    }
  }

  return PR_TRUE;
}

static JSPrincipals *
FindObjectPrincipals(JSContext *cx, JSObject *obj)
{
  nsCOMPtr<nsIPrincipal> objPrincipal;
  nsresult rv = FindPrincipals(cx, obj, getter_AddRefs(objPrincipal), nsnull,
                               nsnull);
  if (NS_FAILED(rv)) {
    return nsnull;
  }

  JSPrincipals *jsprin;
  rv = objPrincipal->GetJSPrincipals(cx, &jsprin);
  if (NS_FAILED(rv)) {
    return nsnull;
  }

  return jsprin;
}


// JS class for XPCSafeJSObjectWrapper (and this doubles as the
// constructor for XPCSafeJSObjectWrapper for the moment too...)

JSExtendedClass sXPC_SJOW_JSClass = {
  // JSClass (JSExtendedClass.base) initialization
  { "XPCSafeJSObjectWrapper",
    JSCLASS_NEW_RESOLVE | JSCLASS_IS_EXTENDED |
    JSCLASS_HAS_RESERVED_SLOTS(XPCWrapper::sNumSlots + 3),
    XPC_SJOW_AddProperty, XPC_SJOW_DelProperty,
    XPC_SJOW_GetProperty, XPC_SJOW_SetProperty,
    XPC_SJOW_Enumerate,   (JSResolveOp)XPC_SJOW_NewResolve,
    XPC_SJOW_Convert,     XPC_SJOW_Finalize,
    nsnull,               XPC_SJOW_CheckAccess,
    XPC_SJOW_Call,        XPC_SJOW_Construct,
    nsnull,               nsnull,
    nsnull,               nsnull
  },
  // JSExtendedClass initialization
  XPC_SJOW_Equality,
  nsnull, // outerObject
  nsnull, // innerObject
  XPC_SJOW_Iterator,
  XPC_SJOW_WrappedObject,
  JSCLASS_NO_RESERVED_MEMBERS
};

JS_STATIC_DLL_CALLBACK(JSBool)
XPC_SJOW_toString(JSContext *cx, JSObject *obj, uintN argc, jsval *argv,
                  jsval *rval);

// Reserved slot indexes on safe wrappers.

// Boolean value, initialized to false on object creation and true
// only while we're resolving a property on the object.
#define XPC_SJOW_SLOT_IS_RESOLVING           0

// Slot for caching a compiled scripted function for property
// get/set.
#define XPC_SJOW_SLOT_SCRIPTED_GETSET        1

// Slot for caching a compiled scripted function for function
// calling.
#define XPC_SJOW_SLOT_SCRIPTED_FUN           2

// Slot for caching a compiled scripted function for calling
// toString().
#define XPC_SJOW_SLOT_SCRIPTED_TOSTRING      3

// Slot for holding on to the principal to use if a principal other
// than that of the unsafe object is desired for this wrapper
// (nsIPrincipal, strong reference).
#define XPC_SJOW_SLOT_PRINCIPAL              4


// Wrap a JS value in a safe wrapper of a function wrapper if
// needed. Note that rval must point to something rooted when calling
// this function.
static JSBool
WrapJSValue(JSContext *cx, JSObject *obj, jsval val, jsval *rval)
{
  JSBool ok = JS_TRUE;

  if (JSVAL_IS_PRIMITIVE(val)) {
    *rval = val;
  } else {
    // Construct a new safe wrapper. Note that it doesn't matter what
    // parent we pass in here, the construct hook will ensure we get
    // the right parent for the wrapper.
    JSObject *safeObj =
      ::JS_ConstructObjectWithArguments(cx, &sXPC_SJOW_JSClass.base, nsnull,
                                        nsnull, 1, &val);
    if (!safeObj) {
      return JS_FALSE;
    }

    // Set *rval to safeObj here to ensure it doesn't get collected in
    // any of the code below.
    *rval = OBJECT_TO_JSVAL(safeObj);

    // If obj and safeObj are from the same scope, propagate cached
    // scripted functions to the new safe object.
    if (JS_GetGlobalForObject(cx, obj) == JS_GetGlobalForObject(cx, safeObj)) {
      jsval rsval;
      if (!::JS_GetReservedSlot(cx, obj, XPC_SJOW_SLOT_SCRIPTED_GETSET,
                                &rsval) ||
          !::JS_SetReservedSlot(cx, safeObj, XPC_SJOW_SLOT_SCRIPTED_GETSET,
                                rsval) ||
          !::JS_GetReservedSlot(cx, obj, XPC_SJOW_SLOT_SCRIPTED_FUN,
                                &rsval) ||
          !::JS_SetReservedSlot(cx, safeObj, XPC_SJOW_SLOT_SCRIPTED_FUN,
                                rsval)) {
        return JS_FALSE;
      }
    } else {
      // Check to see if the new object we just wrapped is accessible
      // from the unsafe object we got the new object through. If not,
      // force the new wrapper to use the principal of the unsafe
      // object we got the new object from.
      nsCOMPtr<nsIPrincipal> srcObjPrincipal;
      nsCOMPtr<nsIPrincipal> subjPrincipal;
      nsCOMPtr<nsIPrincipal> valObjPrincipal;

      nsresult rv = FindPrincipals(cx, obj, getter_AddRefs(srcObjPrincipal),
                                   getter_AddRefs(subjPrincipal), nsnull);
      if (NS_FAILED(rv)) {
        return ThrowException(rv, cx);
      }

      rv = FindPrincipals(cx, JSVAL_TO_OBJECT(val),
                          getter_AddRefs(valObjPrincipal), nsnull, nsnull);
      if (NS_FAILED(rv)) {
        return ThrowException(rv, cx);
      }

      PRBool subsumes = PR_FALSE;
      rv = srcObjPrincipal->Subsumes(valObjPrincipal, &subsumes);
      if (NS_FAILED(rv)) {
        return ThrowException(rv, cx);
      }

      // If the subject can access both the source and object principals, then
      // don't bother forcing the principal below.
      if (!subsumes) {
        PRBool subjSubsumes = PR_FALSE;
        rv = subjPrincipal->Subsumes(srcObjPrincipal, &subjSubsumes);
        if (NS_SUCCEEDED(rv) && subjSubsumes) {
          rv = subjPrincipal->Subsumes(valObjPrincipal, &subjSubsumes);
          if (NS_SUCCEEDED(rv) && subjSubsumes) {
            subsumes = PR_TRUE;
          }
        }
      }

      if (!subsumes) {
        // The unsafe object we got the new object from can not access
        // the new object, force the wrapper we just created to use
        // the principal of the unsafe object to prevent users of the
        // new object wrapper from evaluating code through the new
        // wrapper with the principal of the new object.
        if (!::JS_SetReservedSlot(cx, safeObj, XPC_SJOW_SLOT_PRINCIPAL,
                                  PRIVATE_TO_JSVAL(srcObjPrincipal.get()))) {
          return JS_FALSE;
        }

        // Pass on ownership of the new object principal to the
        // wrapper.
        nsIPrincipal *tmp = nsnull;
        srcObjPrincipal.swap(tmp);
      }
    }
  }

  return ok;
}

static inline JSObject *
FindSafeObject(JSContext *cx, JSObject *obj)
{
  while (JS_GET_CLASS(cx, obj) != &sXPC_SJOW_JSClass.base) {
    obj = ::JS_GetPrototype(cx, obj);

    if (!obj) {
      break;
    }
  }

  return obj;
}

PRBool
IsXPCSafeJSObjectWrapper(JSContext *cx, JSObject *obj)
{
  return FindSafeObject(cx, obj) != nsnull;
}

PRBool
IsXPCSafeJSObjectWrapperClass(JSClass *clazz)
{
  return clazz == &sXPC_SJOW_JSClass.base;
}

static inline JSObject *
GetUnsafeObject(JSContext *cx, JSObject *obj)
{
  obj = FindSafeObject(cx, obj);

  if (!obj) {
    return nsnull;
  }

  return ::JS_GetParent(cx, obj);
}

JSObject *
XPC_SJOW_GetUnsafeObject(JSContext *cx, JSObject *obj)
{
  return GetUnsafeObject(cx, obj);
}

static jsval
UnwrapJSValue(JSContext *cx, jsval val)
{
  if (JSVAL_IS_PRIMITIVE(val)) {
    return val;
  }

  JSObject *unsafeObj = GetUnsafeObject(cx, JSVAL_TO_OBJECT(val));
  if (unsafeObj) {
    return OBJECT_TO_JSVAL(unsafeObj);
  }

  return val;
}

// Get a scripted function for use with the safe wrapper (obj) when
// accessing an unsafe object (unsafeObj). If a scripted function
// already exists in the reserved slot slotIndex, use it, otherwise
// create a new one and cache it in that same slot. The source of the
// script is passed in funScript, and the resulting (new or cached)
// scripted function is returned through scriptedFunVal.
static JSBool
GetScriptedFunction(JSContext *cx, JSObject *obj, JSObject *unsafeObj,
                    uint32 slotIndex, const nsAFlatCString& funScript,
                    jsval *scriptedFunVal)
{
  if (!::JS_GetReservedSlot(cx, obj, slotIndex, scriptedFunVal)) {
    return JS_FALSE;
  }

  // If we either have no scripted function in the requested slot yet,
  // or if the scope of the unsafeObj changed since we compiled the
  // scripted function, re-compile to make sure the scripted function
  // is properly scoped etc.
  if (JSVAL_IS_VOID(*scriptedFunVal) ||
      JS_GetGlobalForObject(cx, unsafeObj) !=
      JS_GetGlobalForObject(cx, JSVAL_TO_OBJECT(*scriptedFunVal))) {
    // Check whether we have a cached principal or not.
    jsval pv;
    if (!::JS_GetReservedSlot(cx, obj, XPC_SJOW_SLOT_PRINCIPAL, &pv)) {
      return JS_FALSE;
    }

    JSPrincipals *jsprin = nsnull;

    if (!JSVAL_IS_VOID(pv)) {
      nsIPrincipal *principal = (nsIPrincipal *)JSVAL_TO_PRIVATE(pv);

      // Found a cached principal, use it rather than looking up the
      // principal of the unsafe object.
      principal->GetJSPrincipals(cx, &jsprin);
    } else {
      // No cached principal found, look up the principal based on the
      // unsafe object.
      jsprin = FindObjectPrincipals(cx, unsafeObj);
    }

    if (!jsprin) {
      return ThrowException(NS_ERROR_UNEXPECTED, cx);
    }

    JSFunction *scriptedFun =
      ::JS_CompileFunctionForPrincipals(cx,
                                        JS_GetGlobalForObject(cx, unsafeObj),
                                        jsprin, nsnull, 0, nsnull,
                                        funScript.get(), funScript.Length(),
                                        "XPCSafeJSObjectWrapper.cpp",
                                        __LINE__);

    JSPRINCIPALS_DROP(cx, jsprin);

    if (!scriptedFun) {
      return ThrowException(NS_ERROR_FAILURE, cx);
    }

    *scriptedFunVal = OBJECT_TO_JSVAL(::JS_GetFunctionObject(scriptedFun));

    if (*scriptedFunVal == JSVAL_NULL ||
        !::JS_SetReservedSlot(cx, obj, slotIndex, *scriptedFunVal)) {
      return JS_FALSE;
    }
  }

  return JS_TRUE;
}


JS_STATIC_DLL_CALLBACK(JSBool)
XPC_SJOW_AddProperty(JSContext *cx, JSObject *obj, jsval id, jsval *vp)
{
  // The constructor and toString properties needs to live on the safe
  // wrapper.
  if (id == GetRTStringByIndex(cx, XPCJSRuntime::IDX_CONSTRUCTOR) ||
      id == GetRTStringByIndex(cx, XPCJSRuntime::IDX_TO_STRING)) {
    return JS_TRUE;
  }

  obj = FindSafeObject(cx, obj);
  NS_ASSERTION(obj != nsnull, "FindSafeObject() returned null in class hook!");

  // Do nothing here if we're in the middle of resolving a property on
  // this safe wrapper.
  jsval isResolving;
  JSBool ok = ::JS_GetReservedSlot(cx, obj, XPC_SJOW_SLOT_IS_RESOLVING,
                                   &isResolving);
  if (!ok || JSVAL_TO_BOOLEAN(isResolving)) {
    return ok;
  }

  JSObject *unsafeObj = GetUnsafeObject(cx, obj);
  if (!unsafeObj) {
    return ThrowException(NS_ERROR_UNEXPECTED, cx);
  }

  // Check that the caller can access the unsafe object.
  if (!CanCallerAccess(cx, unsafeObj)) {
    // CanCallerAccess() already threw for us.
    return JS_FALSE;
  }

  return XPCWrapper::AddProperty(cx, unsafeObj, id, vp);
}

JS_STATIC_DLL_CALLBACK(JSBool)
XPC_SJOW_DelProperty(JSContext *cx, JSObject *obj, jsval id, jsval *vp)
{
  JSObject *unsafeObj = GetUnsafeObject(cx, obj);
  if (!unsafeObj) {
    return ThrowException(NS_ERROR_UNEXPECTED, cx);
  }

  // Check that the caller can access the unsafe object.
  if (!CanCallerAccess(cx, unsafeObj)) {
    // CanCallerAccess() already threw for us.
    return JS_FALSE;
  }

  return XPCWrapper::DelProperty(cx, unsafeObj, id, vp);
}

// Call wrapper to help with wrapping calls to functions or callable
// objects in a scripted function (see XPC_SJOW_Call()). The first
// argument passed to this method is the unsafe function to call, the
// rest are the arguments to pass to the function we're calling.
JS_STATIC_DLL_CALLBACK(JSBool)
XPC_SJOW_CallWrapper(JSContext *cx, JSObject *obj, uintN argc, jsval *argv,
                     jsval *rval)
{
  // Make sure we've got at least one argument (which may not be the
  // case if someone's monkeying with this function directly from JS).
  if (argc < 1) {
    return ThrowException(NS_ERROR_INVALID_ARG, cx);
  }

  return ::JS_CallFunctionValue(cx, obj, argv[0], argc - 1, argv + 1, rval);
}

static JSBool
XPC_SJOW_GetOrSetProperty(JSContext *cx, JSObject *obj, jsval id, jsval *vp,
                          JSBool aIsSet)
{
  // We don't deal with the following properties here.
  if (id == GetRTStringByIndex(cx, XPCJSRuntime::IDX_PROTOTYPE) ||
      id == GetRTStringByIndex(cx, XPCJSRuntime::IDX_TO_STRING)) {
    return JS_TRUE;
  }

  obj = FindSafeObject(cx, obj);
  NS_ASSERTION(obj != nsnull, "FindSafeObject() returned null in class hook!");

  JSObject *unsafeObj = GetUnsafeObject(cx, obj);
  if (!unsafeObj) {
    return ThrowException(NS_ERROR_UNEXPECTED, cx);
  }

  // Check that the caller can access the unsafe object.
  if (!CanCallerAccess(cx, unsafeObj)) {
    // CanCallerAccess() already threw for us.
    return JS_FALSE;
  }

  // Function body for wrapping property get/set in a scripted
  // caller. This scripted function's first argument is the property
  // to get/set. If the operation is a get operation, the function is
  // passed one argument. If the operation is a set operation, the
  // function gets two arguments and the second argument will be the
  // value to set the property to.
  NS_NAMED_LITERAL_CSTRING(funScript,
    "if (arguments.length == 1) return this[arguments[0]];"
    "return this[arguments[0]] = arguments[1];");

  jsval scriptedFunVal;
  if (!GetScriptedFunction(cx, obj, unsafeObj, XPC_SJOW_SLOT_SCRIPTED_GETSET,
                           funScript, &scriptedFunVal)) {
    return JS_FALSE;
  }

  // Build up our argument array per the comment above.
  jsval args[2];

  args[0] = id;

  if (aIsSet) {
    args[1] = UnwrapJSValue(cx, *vp);
  }

  jsval val;
  JSBool ok = ::JS_CallFunctionValue(cx, unsafeObj, scriptedFunVal,
                                     aIsSet ? 2 : 1, args, &val);

  return ok && WrapJSValue(cx, obj, val, vp);
}

JS_STATIC_DLL_CALLBACK(JSBool)
XPC_SJOW_GetProperty(JSContext *cx, JSObject *obj, jsval id, jsval *vp)
{
  return XPC_SJOW_GetOrSetProperty(cx, obj, id, vp, PR_FALSE);
}

JS_STATIC_DLL_CALLBACK(JSBool)
XPC_SJOW_SetProperty(JSContext *cx, JSObject *obj, jsval id, jsval *vp)
{
  return XPC_SJOW_GetOrSetProperty(cx, obj, id, vp, PR_TRUE);
}

JS_STATIC_DLL_CALLBACK(JSBool)
XPC_SJOW_Enumerate(JSContext *cx, JSObject *obj)
{
  obj = FindSafeObject(cx, obj);
  NS_ASSERTION(obj != nsnull, "FindSafeObject() returned null in class hook!");

  // We are being notified of a for-in loop or similar operation on
  // this XPCSafeJSObjectWrapper. Forward to the correct high-level
  // object hook, OBJ_ENUMERATE on the unsafe object, called via the
  // JS_Enumerate API.  Then reflect properties named by the
  // enumerated identifiers from the unsafe object to the safe
  // wrapper.

  JSObject *unsafeObj = GetUnsafeObject(cx, obj);
  if (!unsafeObj) {
    return JS_TRUE;
  }

  // Since we enumerate using JS_Enumerate() on the unsafe object here
  // we don't need to do a security check since JS_Enumerate() will
  // look up unsafeObj.__iterator__ and if we don't have permission to
  // access that, it'll throw and we'll be safe.

  return XPCWrapper::Enumerate(cx, obj, unsafeObj);
}

JS_STATIC_DLL_CALLBACK(JSBool)
XPC_SJOW_NewResolve(JSContext *cx, JSObject *obj, jsval id, uintN flags,
                    JSObject **objp)
{
  obj = FindSafeObject(cx, obj);
  NS_ASSERTION(obj != nsnull, "FindSafeObject() returned null in class hook!");

  JSObject *unsafeObj = GetUnsafeObject(cx, obj);
  if (!unsafeObj) {
    // No unsafe object, nothing to resolve here.

    return JS_TRUE;
  }

  // Check that the caller can access the unsafe object.
  if (!CanCallerAccess(cx, unsafeObj)) {
    // CanCallerAccess() already threw for us.
    return JS_FALSE;
  }

  // Resolve toString specially.
  if (id == GetRTStringByIndex(cx, XPCJSRuntime::IDX_TO_STRING)) {
    *objp = obj;
    return JS_DefineFunction(cx, obj, "toString",
                             XPC_SJOW_toString, 0, 0) != nsnull;
  }

  return XPCWrapper::NewResolve(cx, obj, unsafeObj, id, flags, objp);
}

JS_STATIC_DLL_CALLBACK(JSBool)
XPC_SJOW_Convert(JSContext *cx, JSObject *obj, JSType type, jsval *vp)
{
  NS_ASSERTION(type != JSTYPE_STRING, "toString failed us");
  return JS_TRUE;
}

JS_STATIC_DLL_CALLBACK(void)
XPC_SJOW_Finalize(JSContext *cx, JSObject *obj)
{
  // Release the reference to the cached principal if we have one.
  jsval v;
  if (::JS_GetReservedSlot(cx, obj, XPC_SJOW_SLOT_PRINCIPAL, &v) &&
      !JSVAL_IS_VOID(v)) {
    nsIPrincipal *principal = (nsIPrincipal *)JSVAL_TO_PRIVATE(v);

    NS_RELEASE(principal);
  }
}

JS_STATIC_DLL_CALLBACK(JSBool)
XPC_SJOW_CheckAccess(JSContext *cx, JSObject *obj, jsval id,
                     JSAccessMode mode, jsval *vp)
{
  // Prevent setting __proto__ on an XPCSafeJSObjectWrapper
  if ((mode & JSACC_WATCH) == JSACC_PROTO && (mode & JSACC_WRITE)) {
    return ThrowException(NS_ERROR_XPC_SECURITY_MANAGER_VETO, cx);
  }

  // Forward to the checkObjectAccess hook in the runtime, if any.
  if (cx->runtime->checkObjectAccess &&
      !cx->runtime->checkObjectAccess(cx, obj, id, mode, vp)) {
    return JS_FALSE;
  }

  JSObject *unsafeObj = GetUnsafeObject(cx, obj);
  if (!unsafeObj) {
    return JS_TRUE;
  }

  // Forward the unsafe object to the checkObjectAccess hook in the
  // runtime too, if any.
  if (cx->runtime->checkObjectAccess &&
      !cx->runtime->checkObjectAccess(cx, unsafeObj, id, mode, vp)) {
    return JS_FALSE;
  }

  JSClass *clazz = JS_GET_CLASS(cx, unsafeObj);
  return !clazz->checkAccess ||
    clazz->checkAccess(cx, unsafeObj, id, mode, vp);
}

JS_STATIC_DLL_CALLBACK(JSBool)
XPC_SJOW_Call(JSContext *cx, JSObject *obj, uintN argc, jsval *argv,
              jsval *rval)
{
  JSObject *tmp = FindSafeObject(cx, obj);
  JSObject *unsafeObj, *callThisObj = nsnull;

  if (tmp) {
    // A function wrapped in an XPCSafeJSObjectWrapper is being called
    // directly (i.e. safeObj.fun()), set obj to be the safe object
    // wrapper. In this case, the "this" object used when calling the
    // function will be the unsafe object gotten off of the safe
    // object.
    obj = tmp;
  } else {
    // A function wrapped in an XPCSafeJSObjectWrapper is being called
    // indirectly off of an object that's not a safe wrapper
    // (i.e. foo.bar = safeObj.fun; foo.bar()), set obj to be the safe
    // wrapper for the function, and use the object passed in as the
    // "this" object when calling the function.
    callThisObj = obj;

    // Check that the caller can access the object we're about to pass
    // in as "this" for the call we're about to make.
    if (!CanCallerAccess(cx, callThisObj)) {
      // CanCallerAccess() already threw for us.
      return JS_FALSE;
    }

    obj = FindSafeObject(cx, JSVAL_TO_OBJECT(argv[-2]));

    if (!obj) {
      return ThrowException(NS_ERROR_INVALID_ARG, cx);
    }
  }

  unsafeObj = GetUnsafeObject(cx, obj);
  if (!unsafeObj) {
    return ThrowException(NS_ERROR_UNEXPECTED, cx);
  }

  if (!callThisObj) {
    callThisObj = unsafeObj;
  }

  JSObject *funToCall = GetUnsafeObject(cx, JSVAL_TO_OBJECT(argv[-2]));

  if (!funToCall) {
    // Someone has called XPCSafeJSObjectWrapper.prototype() causing
    // us to find a safe object wrapper without an unsafeObject as
    // its parent. That call shouldn't do anything, so bail here.
    return JS_TRUE;
  }

  // Check that the caller can access the unsafe object on which the
  // call is being made, and the actual function we're about to call.
  if (!CanCallerAccess(cx, unsafeObj) || !CanCallerAccess(cx, funToCall)) {
    // CanCallerAccess() already threw for us.
    return JS_FALSE;
  }

  // Function body for wrapping calls to functions or callable objects
  // in a scripted caller. This scripted function's first argument is
  // a native call wrapper, and the second argument is the unsafe
  // function to call. All but the first argument are passed to the
  // call wrapper.
  NS_NAMED_LITERAL_CSTRING(funScript,
                           "var args = [];"
                           "for (var i = 1; i < arguments.length; i++)"
                           "args.push(arguments[i]);"
                           "return arguments[0].apply(this, args);");

  // Get the scripted function.
  jsval scriptedFunVal;
  if (!GetScriptedFunction(cx, obj, unsafeObj, XPC_SJOW_SLOT_SCRIPTED_FUN,
                           funScript, &scriptedFunVal)) {
    return JS_FALSE;
  }

  JSFunction *callWrapper;
  jsval cwval;

  // Check if we've cached the call wrapper on the scripted function
  // already. If so, use the cached call wrapper.
  if (!::JS_GetReservedSlot(cx, JSVAL_TO_OBJECT(scriptedFunVal), 0, &cwval)) {
    return JS_FALSE;
  }

  if (JSVAL_IS_PRIMITIVE(cwval)) {
    // No cached call wrapper found.
    callWrapper =
      ::JS_NewFunction(cx, XPC_SJOW_CallWrapper, 0, 0, callThisObj,
                       "XPC_SJOW_CallWrapper");
    if (!callWrapper) {
      return JS_FALSE;
    }

    // Cache the call wrapper function, this will also ensure it
    // doesn't get collected early. We piggy-back on one of the
    // reserved slots in JS functions here, and that's ok since we
    // know the scripted function we're storing it on is a function
    // compiled by the JS engine and the reserved slots are unused.
    JSObject *callWrapperObj = ::JS_GetFunctionObject(callWrapper);
    if (!::JS_SetReservedSlot(cx, JSVAL_TO_OBJECT(scriptedFunVal), 0,
                              OBJECT_TO_JSVAL(callWrapperObj))) {
      return JS_FALSE;
    }
  } else {
    // Found a cached call wrapper, extract the function.
    callWrapper = ::JS_ValueToFunction(cx, cwval);

    if (!callWrapper) {
      return ThrowException(NS_ERROR_UNEXPECTED, cx);
    }
  }

  // Build up our argument array per earlier comment.
  jsval argsBuf[8];
  jsval *args = argsBuf;

  if (argc > 7) {
    args = (jsval *)nsMemory::Alloc((argc + 2) * sizeof(jsval *));
    if (!args) {
      return ThrowException(NS_ERROR_OUT_OF_MEMORY, cx);
    }
  }

  args[0] = OBJECT_TO_JSVAL(::JS_GetFunctionObject(callWrapper));
  args[1] = OBJECT_TO_JSVAL(funToCall);

  if (args[0] == JSVAL_NULL) {
    return JS_FALSE;
  }

  for (uintN i = 0; i < argc; ++i) {
    args[i + 2] = UnwrapJSValue(cx, argv[i]);
  }

  jsval val;
  JSBool ok = ::JS_CallFunctionValue(cx, callThisObj, scriptedFunVal, argc + 2,
                                     args, &val);

  if (args != argsBuf) {
    nsMemory::Free(args);
  }

  return ok && WrapJSValue(cx, obj, val, rval);
}

JSBool
XPC_SJOW_Construct(JSContext *cx, JSObject *obj, uintN argc, jsval *argv,
                   jsval *rval)
{
  if (argc < 1) {
    return ThrowException(NS_ERROR_XPC_NOT_ENOUGH_ARGS, cx);
  }

  // |obj| almost always has the wrong proto and parent so we have to create
  // our own object anyway.  Set |obj| to null so we don't use it by accident.
  obj = nsnull;

  if (JSVAL_IS_PRIMITIVE(argv[0])) {
    JSStackFrame *fp = nsnull;
    if (JS_FrameIterator(cx, &fp) && JS_IsConstructorFrame(cx, fp)) {
      return ThrowException(NS_ERROR_ILLEGAL_VALUE, cx);
    }

    *rval = argv[0];
    return JS_TRUE;
  }

  JSObject *objToWrap = JSVAL_TO_OBJECT(argv[0]);

  // Prevent script created Script objects from ever being wrapped
  // with XPCSafeJSObjectWrapper, and never let the eval function
  // object be directly wrapped.

  if (JS_GET_CLASS(cx, objToWrap) == &js_ScriptClass ||
      (::JS_ObjectIsFunction(cx, objToWrap) &&
       ::JS_GetFunctionNative(cx, ::JS_ValueToFunction(cx, argv[0])) ==
       XPCWrapper::sEvalNative)) {
    return ThrowException(NS_ERROR_INVALID_ARG, cx);
  }

  if (JS_GET_CLASS(cx, objToWrap) == &sXPC_XOW_JSClass.base) {
    // We're being asked to wrap a XOW. By using XPCWrapper::Unwrap,
    // we guarantee that the wrapped object is same-origin to us. If
    // it isn't, then just wrap the XOW for an added layer of wrapping.

    JSObject *maybeInner = XPCWrapper::Unwrap(cx, objToWrap);
    if (maybeInner) {
      objToWrap = maybeInner;
    }
  }

  // Check that the caller can access the unsafe object.
  if (!CanCallerAccess(cx, objToWrap)) {
    // CanCallerAccess() already threw for us.
    return JS_FALSE;
  }

  JSObject *unsafeObj = GetUnsafeObject(cx, objToWrap);

  if (unsafeObj) {
    // We're asked to wrap an already wrapped object. Re-wrap the
    // object wrapped by the given wrapper.

    objToWrap = unsafeObj;
  }

  // Don't use the object the JS engine created for us, it is in most
  // cases incorectly parented and has a proto from the wrong scope.
  JSObject *wrapperObj = ::JS_NewObject(cx, &sXPC_SJOW_JSClass.base, nsnull,
                                        nsnull);

  if (!wrapperObj ||
      !::JS_SetPrototype(cx, wrapperObj, nsnull) ||
      !::JS_SetParent(cx, wrapperObj, objToWrap)) {
    // JS_NewObject already threw.
    return JS_FALSE;
  }

  if (!::JS_SetReservedSlot(cx, wrapperObj, XPC_SJOW_SLOT_IS_RESOLVING,
                            BOOLEAN_TO_JSVAL(JS_FALSE))) {
    return JS_FALSE;
  }

  *rval = OBJECT_TO_JSVAL(wrapperObj);

  return JS_TRUE;
}

JS_STATIC_DLL_CALLBACK(JSBool)
XPC_SJOW_Equality(JSContext *cx, JSObject *obj, jsval v, JSBool *bp)
{
  if (JSVAL_IS_PRIMITIVE(v)) {
    *bp = JS_FALSE;
  } else {
    JSObject *unsafeObj = GetUnsafeObject(cx, obj);

    JSObject *other = JSVAL_TO_OBJECT(v);
    JSObject *otherUnsafe = GetUnsafeObject(cx, other);

    *bp = (obj == other || unsafeObj == other ||
           (unsafeObj && unsafeObj == otherUnsafe) ||
           XPC_GetIdentityObject(cx, obj) == XPC_GetIdentityObject(cx, other));
  }

  return JS_TRUE;
}

JS_STATIC_DLL_CALLBACK(JSObject *)
XPC_SJOW_Iterator(JSContext *cx, JSObject *obj, JSBool keysonly)
{
  JSObject *innerObj = GetUnsafeObject(cx, obj);
  if (!innerObj) {
    ThrowException(NS_ERROR_INVALID_ARG, cx);
    return nsnull;
  }

  // Create our dummy SJOW.
  JSObject *wrapperIter = ::JS_NewObject(cx, &sXPC_SJOW_JSClass.base, nsnull,
                                         nsnull);
  if (!wrapperIter ||
      !::JS_SetParent(cx, wrapperIter, innerObj) ||
      !::JS_SetPrototype(cx, wrapperIter, nsnull)) {
    return nsnull;
  }

  if (!::JS_SetReservedSlot(cx, wrapperIter, XPC_SJOW_SLOT_IS_RESOLVING,
                            BOOLEAN_TO_JSVAL(JS_FALSE))) {
    return nsnull;
  }

  JSAutoTempValueRooter tvr(cx, OBJECT_TO_JSVAL(wrapperIter));

  // Initialize the wrapper.
  return XPCWrapper::CreateIteratorObj(cx, wrapperIter, obj, innerObj,
                                       keysonly);
}

JS_STATIC_DLL_CALLBACK(JSObject *)
XPC_SJOW_WrappedObject(JSContext *cx, JSObject *obj)
{
  return GetUnsafeObject(cx, obj);
}

JS_STATIC_DLL_CALLBACK(JSBool)
XPC_SJOW_toString(JSContext *cx, JSObject *obj, uintN argc, jsval *argv,
                  jsval *rval)
{
  obj = FindSafeObject(cx, obj);
  if (!obj) {
    return ThrowException(NS_ERROR_INVALID_ARG, cx);
  }

  JSObject *unsafeObj = GetUnsafeObject(cx, obj);

  if (!unsafeObj) {
    // No unsafe object, nothing to stringify here, return "[object
    // XPCSafeJSObjectWrapper]" so callers know what they're looking
    // at.

    JSString *str = JS_NewStringCopyZ(cx, "[object XPCSafeJSObjectWrapper]");
    if (!str) {
      return JS_FALSE;
    }

    *rval = STRING_TO_JSVAL(str);

    return JS_TRUE;
  }

  // Check that the caller can access the unsafe object.
  if (!CanCallerAccess(cx, unsafeObj)) {
    // CanCallerAccess() already threw for us.
    return JS_FALSE;
  }

  // Function body for wrapping toString() in a scripted caller.
  NS_NAMED_LITERAL_CSTRING(funScript, "return '' + this;");

  jsval scriptedFunVal;
  if (!GetScriptedFunction(cx, obj, unsafeObj, XPC_SJOW_SLOT_SCRIPTED_TOSTRING,
                           funScript, &scriptedFunVal)) {
    return JS_FALSE;
  }

  jsval val;
  JSBool ok = ::JS_CallFunctionValue(cx, unsafeObj, scriptedFunVal, 0, nsnull,
                                     &val);

  return ok && WrapJSValue(cx, obj, val, rval);
}

PRBool
XPC_SJOW_AttachNewConstructorObject(XPCCallContext &ccx,
                                    JSObject *aGlobalObject)
{
  // Initialize sEvalNative the first time we attach a constructor.
  // NB: This always happens before any cross origin wrappers are
  // created, so it's OK to do this here.
  if (!XPCWrapper::FindEval(ccx, aGlobalObject)) {
    return PR_FALSE;
  }

  JSObject *class_obj =
    ::JS_InitClass(ccx, aGlobalObject, nsnull, &sXPC_SJOW_JSClass.base,
                   XPC_SJOW_Construct, 0, nsnull, nsnull, nsnull, nsnull);
  if (!class_obj) {
    NS_WARNING("can't initialize the XPCSafeJSObjectWrapper class");
    return PR_FALSE;
  }

  if (!::JS_DefineFunction(ccx, class_obj, "toString", XPC_SJOW_toString,
                           0, 0)) {
    return PR_FALSE;
  }

  // Null out the class object's parent to prevent code in this class
  // from thinking the class object is a wrapper for the global
  // object.
  ::JS_SetParent(ccx, class_obj, nsnull);

  // Make sure our prototype chain is empty and that people can't mess
  // with XPCSafeJSObjectWrapper.prototype.
  ::JS_SetPrototype(ccx, class_obj, nsnull);
  if (!::JS_SealObject(ccx, class_obj, JS_FALSE)) {
    NS_WARNING("Failed to seal XPCSafeJSObjectWrapper.prototype");
    return PR_FALSE;
  }

  JSBool found;
  return ::JS_SetPropertyAttributes(ccx, aGlobalObject,
                                    sXPC_SJOW_JSClass.base.name,
                                    JSPROP_READONLY | JSPROP_PERMANENT,
                                    &found);
}
