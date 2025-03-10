/* -*- Mode: C; tab-width: 8; indent-tabs-mode: nil; c-basic-offset: 4 -*-
 * vim: set ts=8 sw=4 et tw=78:
 *
 * ***** BEGIN LICENSE BLOCK *****
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
 * The Original Code is Mozilla Communicator client code, released
 * March 31, 1998.
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
 * JavaScript bytecode interpreter.
 */
#include "jsstddef.h"
#include <stdio.h>
#include <string.h>
#include <math.h>
#include "jstypes.h"
#include "jsarena.h" /* Added by JSIFY */
#include "jsutil.h" /* Added by JSIFY */
#include "jsprf.h"
#include "jsapi.h"
#include "jsarray.h"
#include "jsatom.h"
#include "jsbool.h"
#include "jscntxt.h"
#include "jsconfig.h"
#include "jsdbgapi.h"
#include "jsfun.h"
#include "jsgc.h"
#include "jsinterp.h"
#include "jsiter.h"
#include "jslock.h"
#include "jsnum.h"
#include "jsobj.h"
#include "jsopcode.h"
#include "jsscan.h"
#include "jsscope.h"
#include "jsscript.h"
#include "jsstr.h"

#ifdef INCLUDE_MOZILLA_DTRACE
#include "jsdtracef.h"
#endif

#if JS_HAS_XML_SUPPORT
#include "jsxml.h"
#endif

/*
 * Stack macros and functions.  These all use a local variable, jsval *sp, to
 * point to the next free stack slot.  SAVE_SP must be called before any call
 * to a function that may invoke the interpreter.  RESTORE_SP must be called
 * only after return from js_Invoke, because only js_Invoke changes fp->sp.
 */
#define PUSH(v)         (*sp++ = (v))
#define POP()           (*--sp)
#define SAVE_SP(fp)                                                           \
    (JS_ASSERT((fp)->script || !(fp)->spbase || (sp) == (fp)->spbase),        \
     (fp)->sp = sp)
#define RESTORE_SP(fp)  (sp = (fp)->sp)

/*
 * SAVE_SP_AND_PC commits deferred stores of interpreter registers to their
 * homes in fp, when calling out of the interpreter loop or threaded code.
 * RESTORE_SP_AND_PC copies the other way, to update registers after a call
 * to a subroutine that interprets a piece of the current script.
 * ASSERT_SAVED_SP_AND_PC checks that SAVE_SP_AND_PC was called.
 */
#define SAVE_SP_AND_PC(fp)      (SAVE_SP(fp), (fp)->pc = pc)
#define RESTORE_SP_AND_PC(fp)   (RESTORE_SP(fp), pc = (fp)->pc)
#define ASSERT_SAVED_SP_AND_PC(fp) JS_ASSERT((fp)->sp == sp && (fp)->pc == pc);

/*
 * Push the generating bytecode's pc onto the parallel pc stack that runs
 * depth slots below the operands.
 *
 * NB: PUSH_OPND uses sp, depth, and pc from its lexical environment.  See
 * js_Interpret for these local variables' declarations and uses.
 */
#define PUSH_OPND(v)    (sp[-depth] = (jsval)pc, PUSH(v))
#define STORE_OPND(n,v) (sp[(n)-depth] = (jsval)pc, sp[n] = (v))
#define POP_OPND()      POP()
#define FETCH_OPND(n)   (sp[n])

/*
 * Push the jsdouble d using sp, depth, and pc from the lexical environment.
 * Try to convert d to a jsint that fits in a jsval, otherwise GC-alloc space
 * for it and push a reference.
 */
#define STORE_NUMBER(cx, n, d)                                                \
    JS_BEGIN_MACRO                                                            \
        jsint i_;                                                             \
        jsval v_;                                                             \
                                                                              \
        if (JSDOUBLE_IS_INT(d, i_) && INT_FITS_IN_JSVAL(i_)) {                \
            v_ = INT_TO_JSVAL(i_);                                            \
        } else {                                                              \
            ok = js_NewDoubleValue(cx, d, &v_);                               \
            if (!ok)                                                          \
                goto out;                                                     \
        }                                                                     \
        STORE_OPND(n, v_);                                                    \
    JS_END_MACRO

#define STORE_INT(cx, n, i)                                                   \
    JS_BEGIN_MACRO                                                            \
        jsval v_;                                                             \
                                                                              \
        if (INT_FITS_IN_JSVAL(i)) {                                           \
            v_ = INT_TO_JSVAL(i);                                             \
        } else {                                                              \
            ok = js_NewDoubleValue(cx, (jsdouble)(i), &v_);                   \
            if (!ok)                                                          \
                goto out;                                                     \
        }                                                                     \
        STORE_OPND(n, v_);                                                    \
    JS_END_MACRO

#define STORE_UINT(cx, n, u)                                                  \
    JS_BEGIN_MACRO                                                            \
        jsval v_;                                                             \
                                                                              \
        if ((u) <= JSVAL_INT_MAX) {                                           \
            v_ = INT_TO_JSVAL(u);                                             \
        } else {                                                              \
            ok = js_NewDoubleValue(cx, (jsdouble)(u), &v_);                   \
            if (!ok)                                                          \
                goto out;                                                     \
        }                                                                     \
        STORE_OPND(n, v_);                                                    \
    JS_END_MACRO

#define FETCH_NUMBER(cx, n, d)                                                \
    JS_BEGIN_MACRO                                                            \
        jsval v_;                                                             \
                                                                              \
        v_ = FETCH_OPND(n);                                                   \
        VALUE_TO_NUMBER(cx, v_, d);                                           \
    JS_END_MACRO

#define FETCH_INT(cx, n, i)                                                   \
    JS_BEGIN_MACRO                                                            \
        jsval v_ = FETCH_OPND(n);                                             \
        if (JSVAL_IS_INT(v_)) {                                               \
            i = JSVAL_TO_INT(v_);                                             \
        } else {                                                              \
            SAVE_SP_AND_PC(fp);                                               \
            ok = js_ValueToECMAInt32(cx, v_, &i);                             \
            if (!ok)                                                          \
                goto out;                                                     \
        }                                                                     \
    JS_END_MACRO

#define FETCH_UINT(cx, n, ui)                                                 \
    JS_BEGIN_MACRO                                                            \
        jsval v_ = FETCH_OPND(n);                                             \
        jsint i_;                                                             \
        if (JSVAL_IS_INT(v_) && (i_ = JSVAL_TO_INT(v_)) >= 0) {               \
            ui = (uint32) i_;                                                 \
        } else {                                                              \
            SAVE_SP_AND_PC(fp);                                               \
            ok = js_ValueToECMAUint32(cx, v_, &ui);                           \
            if (!ok)                                                          \
                goto out;                                                     \
        }                                                                     \
    JS_END_MACRO

/*
 * Optimized conversion macros that test for the desired type in v before
 * homing sp and calling a conversion function.
 */
#define VALUE_TO_NUMBER(cx, v, d)                                             \
    JS_BEGIN_MACRO                                                            \
        if (JSVAL_IS_INT(v)) {                                                \
            d = (jsdouble)JSVAL_TO_INT(v);                                    \
        } else if (JSVAL_IS_DOUBLE(v)) {                                      \
            d = *JSVAL_TO_DOUBLE(v);                                          \
        } else {                                                              \
            SAVE_SP_AND_PC(fp);                                               \
            ok = js_ValueToNumber(cx, v, &d);                                 \
            if (!ok)                                                          \
                goto out;                                                     \
        }                                                                     \
    JS_END_MACRO

#define POP_BOOLEAN(cx, v, b)                                                 \
    JS_BEGIN_MACRO                                                            \
        v = FETCH_OPND(-1);                                                   \
        if (v == JSVAL_NULL) {                                                \
            b = JS_FALSE;                                                     \
        } else if (JSVAL_IS_BOOLEAN(v)) {                                     \
            b = JSVAL_TO_BOOLEAN(v);                                          \
        } else {                                                              \
            SAVE_SP_AND_PC(fp);                                               \
            ok = js_ValueToBoolean(cx, v, &b);                                \
            if (!ok)                                                          \
                goto out;                                                     \
        }                                                                     \
        sp--;                                                                 \
    JS_END_MACRO

/* SAVE_SP_AND_PC must be already called. */
#define VALUE_TO_OBJECT(cx, n, v, obj)                                        \
    JS_BEGIN_MACRO                                                            \
        ASSERT_SAVED_SP_AND_PC(fp);                                           \
        if (!JSVAL_IS_PRIMITIVE(v)) {                                         \
            obj = JSVAL_TO_OBJECT(v);                                         \
        } else {                                                              \
            obj = js_ValueToNonNullObject(cx, v);                             \
            if (!obj) {                                                       \
                ok = JS_FALSE;                                                \
                goto out;                                                     \
            }                                                                 \
            STORE_OPND(n, OBJECT_TO_JSVAL(obj));                              \
        }                                                                     \
    JS_END_MACRO

/* SAVE_SP_AND_PC must be already called. */
#define FETCH_OBJECT(cx, n, v, obj)                                           \
    JS_BEGIN_MACRO                                                            \
        ASSERT_SAVED_SP_AND_PC(fp);                                           \
        v = FETCH_OPND(n);                                                    \
        VALUE_TO_OBJECT(cx, n, v, obj);                                       \
    JS_END_MACRO

#define DEFAULT_VALUE(cx, n, hint, v)                                         \
    JS_BEGIN_MACRO                                                            \
        JS_ASSERT(!JSVAL_IS_PRIMITIVE(v));                                    \
        JS_ASSERT(v == sp[n]);                                                \
        SAVE_SP_AND_PC(fp);                                                   \
        ok = OBJ_DEFAULT_VALUE(cx, JSVAL_TO_OBJECT(v), hint, &sp[n]);         \
        if (!ok)                                                              \
            goto out;                                                         \
        v = sp[n];                                                            \
    JS_END_MACRO

/*
 * Check if the current arena has enough space to fit nslots after sp and, if
 * so, reserve the necessary space.
 */
static JSBool
AllocateAfterSP(JSContext *cx, jsval *sp, uintN nslots)
{
    uintN surplus;
    jsval *sp2;

    JS_ASSERT((jsval *) cx->stackPool.current->base <= sp);
    JS_ASSERT(sp <= (jsval *) cx->stackPool.current->avail);
    surplus = (jsval *) cx->stackPool.current->avail - sp;
    if (nslots <= surplus)
        return JS_TRUE;

    /*
     * No room before current->avail, check if the arena has enough space to
     * fit the missing slots before the limit.
     */
    if (nslots > (size_t) ((jsval *) cx->stackPool.current->limit - sp))
        return JS_FALSE;

    JS_ARENA_ALLOCATE_CAST(sp2, jsval *, &cx->stackPool,
                           (nslots - surplus) * sizeof(jsval));
    JS_ASSERT(sp2 == sp + surplus);
    return JS_TRUE;
}

JS_FRIEND_API(jsval *)
js_AllocRawStack(JSContext *cx, uintN nslots, void **markp)
{
    jsval *sp;

    if (markp)
        *markp = JS_ARENA_MARK(&cx->stackPool);
    JS_ARENA_ALLOCATE_CAST(sp, jsval *, &cx->stackPool, nslots * sizeof(jsval));
    if (!sp)
        js_ReportOutOfScriptQuota(cx);
    return sp;
}

JS_FRIEND_API(void)
js_FreeRawStack(JSContext *cx, void *mark)
{
    JS_ARENA_RELEASE(&cx->stackPool, mark);
}

JS_FRIEND_API(jsval *)
js_AllocStack(JSContext *cx, uintN nslots, void **markp)
{
    jsval *sp;
    JSArena *a;
    JSStackHeader *sh;

    /* Callers don't check for zero nslots: we do to avoid empty segments. */
    if (nslots == 0) {
        *markp = NULL;
        return (jsval *) JS_ARENA_MARK(&cx->stackPool);
    }

    /* Allocate 2 extra slots for the stack segment header we'll likely need. */
    sp = js_AllocRawStack(cx, 2 + nslots, markp);
    if (!sp)
        return NULL;

    /* Try to avoid another header if we can piggyback on the last segment. */
    a = cx->stackPool.current;
    sh = cx->stackHeaders;
    if (sh && JS_STACK_SEGMENT(sh) + sh->nslots == sp) {
        /* Extend the last stack segment, give back the 2 header slots. */
        sh->nslots += nslots;
        a->avail -= 2 * sizeof(jsval);
    } else {
        /*
         * Need a new stack segment, so allocate and push a stack segment
         * header from the 2 extra slots.
         */
        sh = (JSStackHeader *)sp;
        sh->nslots = nslots;
        sh->down = cx->stackHeaders;
        cx->stackHeaders = sh;
        sp += 2;
    }

    /*
     * Store JSVAL_NULL using memset, to let compilers optimize as they see
     * fit, in case a caller allocates and pushes GC-things one by one, which
     * could nest a last-ditch GC that will scan this segment.
     */
    memset(sp, 0, nslots * sizeof(jsval));
    return sp;
}

JS_FRIEND_API(void)
js_FreeStack(JSContext *cx, void *mark)
{
    JSStackHeader *sh;
    jsuword slotdiff;

    /* Check for zero nslots allocation special case. */
    if (!mark)
        return;

    /* We can assert because js_FreeStack always balances js_AllocStack. */
    sh = cx->stackHeaders;
    JS_ASSERT(sh);

    /* If mark is in the current segment, reduce sh->nslots, else pop sh. */
    slotdiff = JS_UPTRDIFF(mark, JS_STACK_SEGMENT(sh)) / sizeof(jsval);
    if (slotdiff < (jsuword)sh->nslots)
        sh->nslots = slotdiff;
    else
        cx->stackHeaders = sh->down;

    /* Release the stackPool space allocated since mark was set. */
    JS_ARENA_RELEASE(&cx->stackPool, mark);
}

JSObject *
js_GetScopeChain(JSContext *cx, JSStackFrame *fp)
{
    JSObject *obj, *cursor, *clonedChild, *parent;
    JSTempValueRooter tvr;

    obj = fp->blockChain;
    if (!obj) {
        /*
         * Don't force a call object for a lightweight function call, but do
         * insist that there is a call object for a heavyweight function call.
         */
        JS_ASSERT(!fp->fun ||
                  !(fp->fun->flags & JSFUN_HEAVYWEIGHT) ||
                  fp->callobj);
        JS_ASSERT(fp->scopeChain);
        return fp->scopeChain;
    }

    /*
     * We have one or more lexical scopes to reflect into fp->scopeChain, so
     * make sure there's a call object at the current head of the scope chain,
     * if this frame is a call frame.
     */
    if (fp->fun && !fp->callobj) {
        JS_ASSERT(OBJ_GET_CLASS(cx, fp->scopeChain) != &js_BlockClass ||
                  JS_GetPrivate(cx, fp->scopeChain) != fp);
        if (!js_GetCallObject(cx, fp, fp->scopeChain))
            return NULL;
    }

    /*
     * Clone the block chain. To avoid recursive cloning we set the parent of
     * the cloned child after we clone the parent. In the following loop when
     * clonedChild is null it indicates the first iteration when no special GC
     * rooting is necessary. On the second and the following iterations we
     * have to protect cloned so far chain against the GC during cloning of
     * the cursor object.
     */
    cursor = obj;
    clonedChild = NULL;
    for (;;) {
        parent = OBJ_GET_PARENT(cx, cursor);

        /*
         * We pass fp->scopeChain and not null even if we override the parent
         * slot later as null triggers useless calculations of slot's value in
         * js_NewObject that js_CloneBlockObject calls.
         */
        cursor = js_CloneBlockObject(cx, cursor, fp->scopeChain, fp);
        if (!cursor) {
            if (clonedChild)
                JS_POP_TEMP_ROOT(cx, &tvr);
            return NULL;
        }
        if (!clonedChild) {
            /*
             * The first iteration. Check if other follow and root obj if so
             * to protect the whole cloned chain against GC.
             */
            obj = cursor;
            if (!parent)
                break;
            JS_PUSH_TEMP_ROOT_OBJECT(cx, obj, &tvr);
        } else {
            /*
             * Avoid OBJ_SET_PARENT overhead as clonedChild cannot escape to
             * other threads.
             */
            STOBJ_SET_PARENT(clonedChild, cursor);
            if (!parent) {
                JS_ASSERT(tvr.u.value == OBJECT_TO_JSVAL(obj));
                JS_POP_TEMP_ROOT(cx, &tvr);
                break;
            }
        }
        clonedChild = cursor;
        cursor = parent;
    }
    fp->flags |= JSFRAME_POP_BLOCKS;
    fp->scopeChain = obj;
    fp->blockChain = NULL;
    return obj;
}

/*
 * Walk the scope chain looking for block scopes whose locals need to be
 * copied from stack slots into object slots before fp goes away.
 */
static JSBool
PutBlockObjects(JSContext *cx, JSStackFrame *fp)
{
    JSBool ok;
    JSObject *obj;

    ok = JS_TRUE;
    for (obj = fp->scopeChain; obj; obj = OBJ_GET_PARENT(cx, obj)) {
        if (OBJ_GET_CLASS(cx, obj) == &js_BlockClass) {
            if (JS_GetPrivate(cx, obj) != fp)
                break;
            ok &= js_PutBlockObject(cx, obj);
        }
    }
    return ok;
}

JSBool
js_GetPrimitiveThis(JSContext *cx, jsval *vp, JSClass *clasp, jsval *thisvp)
{
    jsval v;
    JSObject *obj;

    v = vp[1];
    if (JSVAL_IS_OBJECT(v)) {
        obj = JSVAL_TO_OBJECT(v);
        if (!JS_InstanceOf(cx, obj, clasp, vp + 2))
            return JS_FALSE;
        v = OBJ_GET_SLOT(cx, obj, JSSLOT_PRIVATE);
    }
    *thisvp = v;
    return JS_TRUE;
}

/*
 * ECMA requires "the global object", but in embeddings such as the browser,
 * which have multiple top-level objects (windows, frames, etc. in the DOM),
 * we prefer fun's parent.  An example that causes this code to run:
 *
 *   // in window w1
 *   function f() { return this }
 *   function g() { return f }
 *
 *   // in window w2
 *   var h = w1.g()
 *   alert(h() == w1)
 *
 * The alert should display "true".
 */
static JSBool
ComputeGlobalThis(JSContext *cx, jsval *argv)
{
    JSObject *thisp;

    if (JSVAL_IS_PRIMITIVE(argv[-2]) ||
        !OBJ_GET_PARENT(cx, JSVAL_TO_OBJECT(argv[-2]))) {
        thisp = cx->globalObject;
    } else {
        jsid id;
        jsval v;
        uintN attrs;
        JSObject *parent;

        /* Walk up the parent chain. */
        thisp = JSVAL_TO_OBJECT(argv[-2]);
        id = ATOM_TO_JSID(cx->runtime->atomState.parentAtom);
        for (;;) {
            if (!OBJ_CHECK_ACCESS(cx, thisp, id, JSACC_PARENT, &v, &attrs))
                return JS_FALSE;
            parent = JSVAL_IS_VOID(v)
                     ? OBJ_GET_PARENT(cx, thisp)
                     : JSVAL_TO_OBJECT(v);
            if (!parent)
                break;
            thisp = parent;
        }
    }
    argv[-1] = OBJECT_TO_JSVAL(thisp);
    return JS_TRUE;
}

static JSBool
ComputeThis(JSContext *cx, jsval *argv)
{
    JSObject *thisp;

    JS_ASSERT(!JSVAL_IS_NULL(argv[-1]));
    if (!JSVAL_IS_OBJECT(argv[-1]))
        return js_PrimitiveToObject(cx, &argv[-1]);

    thisp = JSVAL_TO_OBJECT(argv[-1]);
    if (OBJ_GET_CLASS(cx, thisp) == &js_CallClass)
        return ComputeGlobalThis(cx, argv);

    if (!thisp->map->ops->thisObject)
        return JS_TRUE;

    /* Some objects (e.g., With) delegate 'this' to another object. */
    thisp = thisp->map->ops->thisObject(cx, thisp);
    if (!thisp)
        return JS_FALSE;
    argv[-1] = OBJECT_TO_JSVAL(thisp);
    return JS_TRUE;
}

JSBool
js_ComputeThis(JSContext *cx, jsval *argv)
{
    if (JSVAL_IS_NULL(argv[-1]))
        return ComputeGlobalThis(cx, argv);
    return ComputeThis(cx, argv);
}

#if JS_HAS_NO_SUCH_METHOD

static JSBool
NoSuchMethod(JSContext *cx, uintN argc, jsval *vp, uint32 flags)
{
    JSStackFrame *fp;
    JSObject *thisp, *argsobj;
    JSAtom *atom;
    jsval *sp, roots[3];
    JSTempValueRooter tvr;
    jsid id;
    JSBool ok;
    jsbytecode *pc;

    /* NB: js_ComputeThis or equivalent must have been called already. */
    JS_ASSERT(JSVAL_IS_PRIMITIVE(vp[0]));
    JS_ASSERT(!JSVAL_IS_PRIMITIVE(vp[1]));
    fp = cx->fp;
    RESTORE_SP(fp);

    /* From here on, control must flow through label out: to return. */
    memset(roots, 0, sizeof roots);
    JS_PUSH_TEMP_ROOT(cx, JS_ARRAY_LENGTH(roots), roots, &tvr);

    id = ATOM_TO_JSID(cx->runtime->atomState.noSuchMethodAtom);
    thisp = JSVAL_TO_OBJECT(vp[1]);
#if JS_HAS_XML_SUPPORT
    if (OBJECT_IS_XML(cx, thisp)) {
        JSXMLObjectOps *ops;

        ops = (JSXMLObjectOps *) thisp->map->ops;
        thisp = ops->getMethod(cx, thisp, id, &roots[2]);
        if (!thisp) {
            ok = JS_FALSE;
            goto out;
        }
        vp[1] = OBJECT_TO_JSVAL(thisp);
    } else
#endif
    {
        ok = OBJ_GET_PROPERTY(cx, thisp, id, &roots[2]);
        if (!ok)
            goto out;
    }
    if (JSVAL_IS_PRIMITIVE(roots[2]))
        goto not_function;

    pc = (jsbytecode *) vp[-(intN)fp->script->depth];
    switch ((JSOp) *pc) {
      case JSOP_NAME:
      case JSOP_GETPROP:
      case JSOP_CALLPROP:
        GET_ATOM_FROM_BYTECODE(fp->script, pc, 0, atom);
        roots[0] = ATOM_KEY(atom);
        argsobj = js_NewArrayObject(cx, argc, vp + 2);
        if (!argsobj) {
            ok = JS_FALSE;
            goto out;
        }
        roots[1] = OBJECT_TO_JSVAL(argsobj);
        ok = js_InternalInvoke(cx, thisp, roots[2], flags | JSINVOKE_INTERNAL,
                               2, roots, &vp[0]);
        break;

      default:
        goto not_function;
    }

  out:
    JS_POP_TEMP_ROOT(cx, &tvr);
    return ok;

  not_function:
    js_ReportIsNotFunction(cx, vp, flags & JSINVOKE_FUNFLAGS);
    ok = JS_FALSE;
    goto out;
}

#endif /* JS_HAS_NO_SUCH_METHOD */

/*
 * Conditional assert to detect failure to clear a pending exception that is
 * suppressed (or unintentional suppression of a wanted exception).
 */
#if defined DEBUG_brendan || defined DEBUG_mrbkap || defined DEBUG_shaver
# define DEBUG_NOT_THROWING 1
#endif

#ifdef DEBUG_NOT_THROWING
# define ASSERT_NOT_THROWING(cx) JS_ASSERT(!(cx)->throwing)
#else
# define ASSERT_NOT_THROWING(cx) /* nothing */
#endif

/*
 * We check if the function accepts a primitive value as |this|. For that we
 * use a table that maps value's tag into the corresponding function flag.
 */
JS_STATIC_ASSERT(JSVAL_INT == 1);
JS_STATIC_ASSERT(JSVAL_DOUBLE == 2);
JS_STATIC_ASSERT(JSVAL_STRING == 4);
JS_STATIC_ASSERT(JSVAL_BOOLEAN == 6);

static const uint16 PrimitiveTestFlags[] = {
    JSFUN_THISP_NUMBER,     /* INT     */
    JSFUN_THISP_NUMBER,     /* DOUBLE  */
    JSFUN_THISP_NUMBER,     /* INT     */
    JSFUN_THISP_STRING,     /* STRING  */
    JSFUN_THISP_NUMBER,     /* INT     */
    JSFUN_THISP_BOOLEAN,    /* BOOLEAN */
    JSFUN_THISP_NUMBER      /* INT     */
};

#define PRIMITIVE_THIS_TEST(fun,thisv)                                        \
    (JS_ASSERT(thisv != JSVAL_VOID),                                          \
     JSFUN_THISP_TEST(JSFUN_THISP_FLAGS((fun)->flags),                        \
                      PrimitiveTestFlags[JSVAL_TAG(thisv) - 1]))

/*
 * Find a function reference and its 'this' object implicit first parameter
 * under argc arguments on cx's stack, and call the function.  Push missing
 * required arguments, allocate declared local variables, and pop everything
 * when done.  Then push the return value.
 */
JS_FRIEND_API(JSBool)
js_Invoke(JSContext *cx, uintN argc, jsval *vp, uintN flags)
{
    void *mark;
    JSStackFrame frame;
    jsval *sp, *argv, *newvp;
    jsval v;
    JSObject *funobj, *parent;
    JSBool ok;
    JSClass *clasp;
    JSObjectOps *ops;
    JSNative native;
    JSFunction *fun;
    JSScript *script;
    uintN nslots, nvars, i, skip;
    uint32 rootedArgsFlag;
    JSInterpreterHook hook;
    void *hookData;

    /* [vp .. vp + 2 + argc) must belong to the last JS stack arena. */
    JS_ASSERT((jsval *) cx->stackPool.current->base <= vp);
    JS_ASSERT(vp + 2 + argc <= (jsval *) cx->stackPool.current->avail);

    /*
     * Mark the top of stack and load frequently-used registers. After this
     * point the control should flow through label out2: to return.
     */
    mark = JS_ARENA_MARK(&cx->stackPool);
    v = *vp;

    /*
     * A callee must be an object reference, unless its 'this' parameter
     * implements the __noSuchMethod__ method, in which case that method will
     * be called like so:
     *
     *   this.__noSuchMethod__(id, args)
     *
     * where id is the name of the method that this invocation attempted to
     * call by name, and args is an Array containing this invocation's actual
     * parameters.
     */
    if (JSVAL_IS_PRIMITIVE(v)) {
#if JS_HAS_NO_SUCH_METHOD
        if (cx->fp && cx->fp->script && !(flags & JSINVOKE_INTERNAL)) {
            ok = NoSuchMethod(cx, argc, vp, flags);
            goto out2;
        }
#endif
        goto bad;
    }

    funobj = JSVAL_TO_OBJECT(v);
    parent = OBJ_GET_PARENT(cx, funobj);
    clasp = OBJ_GET_CLASS(cx, funobj);
    if (clasp != &js_FunctionClass) {
        /* Function is inlined, all other classes use object ops. */
        ops = funobj->map->ops;

        /*
         * XXX this makes no sense -- why convert to function if clasp->call?
         * XXX better to call that hook without converting
         * XXX the only thing that needs fixing is liveconnect
         *
         * Try converting to function, for closure and API compatibility.
         * We attempt the conversion under all circumstances for 1.2, but
         * only if there is a call op defined otherwise.
         */
        if ((ops == &js_ObjectOps) ? clasp->call : ops->call) {
            ok = clasp->convert(cx, funobj, JSTYPE_FUNCTION, &v);
            if (!ok)
                goto out2;

            if (VALUE_IS_FUNCTION(cx, v)) {
                /* Make vp refer to funobj to keep it available as argv[-2]. */
                *vp = v;
                funobj = JSVAL_TO_OBJECT(v);
                parent = OBJ_GET_PARENT(cx, funobj);
                goto have_fun;
            }
        }
        fun = NULL;
        script = NULL;
        nslots = nvars = 0;

        /* Try a call or construct native object op. */
        if (flags & JSINVOKE_CONSTRUCT) {
            if (!JSVAL_IS_OBJECT(vp[1])) {
                ok = js_PrimitiveToObject(cx, &vp[1]);
                if (!ok)
                    goto out2;
            }
            native = ops->construct;
        } else {
            native = ops->call;
        }
        if (!native)
            goto bad;
    } else {
have_fun:
        /* Get private data and set derived locals from it. */
        fun = GET_FUNCTION_PRIVATE(cx, funobj);
        nslots = FUN_MINARGS(fun);
        nslots = (nslots > argc) ? nslots - argc : 0;
        if (FUN_INTERPRETED(fun)) {
            native = NULL;
            script = fun->u.i.script;
            nvars = fun->u.i.nvars;
        } else {
            native = fun->u.n.native;
            script = NULL;
            nvars = 0;
            nslots += fun->u.n.extra;
        }

        if (JSFUN_BOUND_METHOD_TEST(fun->flags)) {
            /* Handle bound method special case. */
            vp[1] = OBJECT_TO_JSVAL(parent);
        } else if (!JSVAL_IS_OBJECT(vp[1])) {
            JS_ASSERT(!(flags & JSINVOKE_CONSTRUCT));
            if (PRIMITIVE_THIS_TEST(fun, vp[1]))
                goto init_slots;
        }
    }

    if (flags & JSINVOKE_CONSTRUCT) {
        JS_ASSERT(!JSVAL_IS_PRIMITIVE(vp[1]));
    } else {
        /*
         * We must call js_ComputeThis in case we are not called from the
         * interpreter, where a prior bytecode has computed an appropriate
         * |this| already.
         */
        ok = js_ComputeThis(cx, vp + 2);
        if (!ok)
            goto out2;
    }

  init_slots:
    argv = vp + 2;
    sp = argv + argc;

    rootedArgsFlag = JSFRAME_ROOTED_ARGV;
    if (nslots != 0) {
        /*
         * The extra slots required by the function must be continues with the
         * arguments. Thus, when the last arena does not have room to fit
         * nslots right after sp and AllocateAfterSP fails, we have to copy
         * [vp..vp+2+argc) slots and clear rootedArgsFlag to root the copy.
         */
        if (!AllocateAfterSP(cx, sp, nslots)) {
            rootedArgsFlag = 0;
            newvp = js_AllocRawStack(cx, 2 + argc + nslots, NULL);
            if (!newvp) {
                ok = JS_FALSE;
                goto out2;
            }
            memcpy(newvp, vp, (2 + argc) * sizeof(jsval));
            argv = newvp + 2;
            sp = argv + argc;
        }

        /* Push void to initialize missing args. */
        i = nslots;
        do {
            PUSH(JSVAL_VOID);
        } while (--i != 0);
    }

    if (native && fun && (fun->flags & JSFUN_FAST_NATIVE)) {
        JSTempValueRooter tvr;
#ifdef DEBUG_NOT_THROWING
        JSBool alreadyThrowing = cx->throwing;
#endif
#if JS_HAS_LVALUE_RETURN
        /* Set by JS_SetCallReturnValue2, used to return reference types. */
        cx->rval2set = JS_FALSE;
#endif
        /* Root the slots that are not covered by [vp..vp+2+argc). */
        skip = rootedArgsFlag ? 2 + argc : 0;
        JS_PUSH_TEMP_ROOT(cx, 2 + argc + nslots - skip, argv - 2 + skip, &tvr);
        ok = ((JSFastNative) native)(cx, argc, argv - 2);

        /*
         * To avoid extra checks we always copy the result to *vp even if we
         * have not copied argv and vp == argv - 2.
         */
        *vp = argv[-2];
        JS_POP_TEMP_ROOT(cx, &tvr);

        JS_RUNTIME_METER(cx->runtime, nativeCalls);
#ifdef DEBUG_NOT_THROWING
        if (ok && !alreadyThrowing)
            ASSERT_NOT_THROWING(cx);
#endif
        goto out2;
    }

    /* Now allocate stack space for local variables of interpreted function. */
    if (nvars) {
        if (!AllocateAfterSP(cx, sp, nvars)) {
            /* NB: Discontinuity between argv and vars. */
            sp = js_AllocRawStack(cx, nvars, NULL);
            if (!sp) {
                ok = JS_FALSE;
                goto out2;
            }
        }

        /* Push void to initialize local variables. */
        i = nvars;
        do {
            PUSH(JSVAL_VOID);
        } while (--i != 0);
    }

    /*
     * Initialize the frame, except for sp (set by SAVE_SP later).
     *
     * To set thisp we use an explicit cast and not JSVAL_TO_OBJECT, as vp[1]
     * can be a primitive value here for those native functions specified with
     * JSFUN_THISP_(NUMBER|STRING|BOOLEAN) flags.
     */
    frame.thisp = (JSObject *)vp[1];
    frame.varobj = NULL;
    frame.callobj = frame.argsobj = NULL;
    frame.script = script;
    frame.callee = funobj;
    frame.fun = fun;
    frame.argc = argc;
    frame.argv = argv;

    /* Default return value for a constructor is the new object. */
    frame.rval = (flags & JSINVOKE_CONSTRUCT) ? vp[1] : JSVAL_VOID;
    frame.nvars = nvars;
    frame.vars = sp - nvars;
    frame.down = cx->fp;
    frame.annotation = NULL;
    frame.scopeChain = NULL;    /* set below for real, after cx->fp is set */
    frame.pc = NULL;
    frame.spbase = NULL;
    frame.sharpDepth = 0;
    frame.sharpArray = NULL;
    frame.flags = flags | rootedArgsFlag;
    frame.dormantNext = NULL;
    frame.xmlNamespace = NULL;
    frame.blockChain = NULL;

    /* From here on, control must flow through label out: to return. */
    cx->fp = &frame;

    /* Init these now in case we goto out before first hook call. */
    hook = cx->debugHooks->callHook;
    hookData = NULL;

    /* Store the current sp in frame before calling fun. */
    SAVE_SP(&frame);

    /* call the hook if present */
    if (hook && (native || script))
        hookData = hook(cx, &frame, JS_TRUE, 0, cx->debugHooks->callHookData);

    /* Call the function, either a native method or an interpreted script. */
    if (native) {
#ifdef DEBUG_NOT_THROWING
        JSBool alreadyThrowing = cx->throwing;
#endif

#if JS_HAS_LVALUE_RETURN
        /* Set by JS_SetCallReturnValue2, used to return reference types. */
        cx->rval2set = JS_FALSE;
#endif

        /* If native, use caller varobj and scopeChain for eval. */
        JS_ASSERT(!frame.varobj);
        JS_ASSERT(!frame.scopeChain);
        if (frame.down) {
            frame.varobj = frame.down->varobj;
            frame.scopeChain = frame.down->scopeChain;
        }

        /* But ensure that we have a scope chain. */
        if (!frame.scopeChain)
            frame.scopeChain = parent;

#ifdef DEBUG_brendan
        {
            static FILE *fp;
            if (!fp) {
                fp = fopen("/tmp/slow-natives.dump", "w");
                if (fp)
                    setlinebuf(fp);
            }
            if (fp) {
                fprintf(fp, "%p %s.%s\n",
                        native,
                        JSVAL_IS_OBJECT(vp[1])
                        ? ((OBJ_GET_CLASS(cx, frame.thisp) == &js_FunctionClass)
                           ? JS_GetFunctionName(JS_GetPrivate(cx, frame.thisp))
                           : OBJ_GET_CLASS(cx, frame.thisp)->name)
                        : JSVAL_IS_BOOLEAN(vp[1])
                        ? js_BooleanClass.name
                        : JSVAL_IS_STRING(vp[1])
                        ? js_StringClass.name
                        : js_NumberClass.name,
                        fun && fun->atom
                        ? JS_GetFunctionName(fun)
                        : "???");
            }
        }
#endif
        ok = native(cx, frame.thisp, argc, frame.argv, &frame.rval);

        JS_RUNTIME_METER(cx->runtime, nativeCalls);
#ifdef DEBUG_NOT_THROWING
        if (ok && !alreadyThrowing)
            ASSERT_NOT_THROWING(cx);
#endif
    } else if (script) {
        /* Use parent scope so js_GetCallObject can find the right "Call". */
        frame.scopeChain = parent;
        if (JSFUN_HEAVYWEIGHT_TEST(fun->flags)) {
            /* Scope with a call object parented by the callee's parent. */
            if (!js_GetCallObject(cx, &frame, parent)) {
                ok = JS_FALSE;
                goto out;
            }
        }
        ok = js_Interpret(cx, script->code, &v);
    } else {
        /* fun might be onerror trying to report a syntax error in itself. */
        frame.scopeChain = NULL;
        ok = JS_TRUE;
    }

out:
    if (hookData) {
        hook = cx->debugHooks->callHook;
        if (hook)
            hook(cx, &frame, JS_FALSE, &ok, hookData);
    }

    /* If frame has a call object, sync values and clear back-pointer. */
    if (frame.callobj)
        ok &= js_PutCallObject(cx, &frame);

    /* If frame has an arguments object, sync values and clear back-pointer. */
    if (frame.argsobj)
        ok &= js_PutArgsObject(cx, &frame);

    *vp = frame.rval;

    /* Restore cx->fp now that we're done releasing frame objects. */
    cx->fp = frame.down;

out2:
    /* Pop everything we may have allocated off the stack. */
    JS_ARENA_RELEASE(&cx->stackPool, mark);
    if (!ok)
        *vp = JSVAL_NULL;
    return ok;

bad:
    js_ReportIsNotFunction(cx, vp, flags & JSINVOKE_FUNFLAGS);
    ok = JS_FALSE;
    goto out2;
}

JSBool
js_InternalInvoke(JSContext *cx, JSObject *obj, jsval fval, uintN flags,
                  uintN argc, jsval *argv, jsval *rval)
{
    jsval *invokevp;
    void *mark;
    JSBool ok;

    invokevp = js_AllocStack(cx, 2 + argc, &mark);
    if (!invokevp)
        return JS_FALSE;

    invokevp[0] = fval;
    invokevp[1] = OBJECT_TO_JSVAL(obj);
    memcpy(invokevp + 2, argv, argc * sizeof *argv);

    ok = js_Invoke(cx, argc, invokevp, flags | JSINVOKE_INTERNAL);
    if (ok) {
        /*
         * Store *rval in the a scoped local root if a scope is open, else in
         * the lastInternalResult pigeon-hole GC root, solely so users of
         * js_InternalInvoke and its direct and indirect (js_ValueToString for
         * example) callers do not need to manage roots for local, temporary
         * references to such results.
         */
        *rval = *invokevp;
        if (JSVAL_IS_GCTHING(*rval) && *rval != JSVAL_NULL) {
            if (cx->localRootStack) {
                if (js_PushLocalRoot(cx, cx->localRootStack, *rval) < 0)
                    ok = JS_FALSE;
            } else {
                cx->weakRoots.lastInternalResult = *rval;
            }
        }
    }

    js_FreeStack(cx, mark);
    return ok;
}

JSBool
js_InternalGetOrSet(JSContext *cx, JSObject *obj, jsid id, jsval fval,
                    JSAccessMode mode, uintN argc, jsval *argv, jsval *rval)
{
    int stackDummy;

    /*
     * js_InternalInvoke could result in another try to get or set the same id
     * again, see bug 355497.
     */
    if (!JS_CHECK_STACK_SIZE(cx, stackDummy)) {
        js_ReportOverRecursed(cx);
        return JS_FALSE;
    }

    /*
     * Check general (not object-ops/class-specific) access from the running
     * script to obj.id only if id has a scripted getter or setter that we're
     * about to invoke.  If we don't check this case, nothing else will -- no
     * other native code has the chance to check.
     *
     * Contrast this non-native (scripted) case with native getter and setter
     * accesses, where the native itself must do an access check, if security
     * policies requires it.  We make a checkAccess or checkObjectAccess call
     * back to the embedding program only in those cases where we're not going
     * to call an embedding-defined native function, getter, setter, or class
     * hook anyway.  Where we do call such a native, there's no need for the
     * engine to impose a separate access check callback on all embeddings --
     * many embeddings have no security policy at all.
     */
    JS_ASSERT(mode == JSACC_READ || mode == JSACC_WRITE);
    if (cx->runtime->checkObjectAccess &&
        VALUE_IS_FUNCTION(cx, fval) &&
        FUN_INTERPRETED(GET_FUNCTION_PRIVATE(cx, JSVAL_TO_OBJECT(fval))) &&
        !cx->runtime->checkObjectAccess(cx, obj, ID_TO_VALUE(id), mode,
                                        &fval)) {
        return JS_FALSE;
    }

    return js_InternalCall(cx, obj, fval, argc, argv, rval);
}

JSBool
js_Execute(JSContext *cx, JSObject *chain, JSScript *script,
           JSStackFrame *down, uintN flags, jsval *result)
{
    JSInterpreterHook hook;
    void *hookData, *mark;
    JSStackFrame *oldfp, frame;
    JSObject *obj, *tmp;
    JSBool ok;

#ifdef INCLUDE_MOZILLA_DTRACE
    if (JAVASCRIPT_EXECUTE_START_ENABLED())
        jsdtrace_execute_start(script);
#endif

    hook = cx->debugHooks->executeHook;
    hookData = mark = NULL;
    oldfp = cx->fp;
    frame.script = script;
    if (down) {
        /* Propagate arg/var state for eval and the debugger API. */
        frame.callobj = down->callobj;
        frame.argsobj = down->argsobj;
        frame.varobj = down->varobj;
        frame.callee = down->callee;
        frame.fun = down->fun;
        frame.thisp = down->thisp;
        frame.argc = down->argc;
        frame.argv = down->argv;
        frame.nvars = down->nvars;
        frame.vars = down->vars;
        frame.annotation = down->annotation;
        frame.sharpArray = down->sharpArray;
    } else {
        frame.callobj = frame.argsobj = NULL;
        obj = chain;
        if (cx->options & JSOPTION_VAROBJFIX) {
            while ((tmp = OBJ_GET_PARENT(cx, obj)) != NULL)
                obj = tmp;
        }
        frame.varobj = obj;
        frame.callee = NULL;
        frame.fun = NULL;
        frame.thisp = chain;
        frame.argc = 0;
        frame.argv = NULL;
        frame.nvars = script->ngvars;
        if (script->regexpsOffset != 0)
            frame.nvars += JS_SCRIPT_REGEXPS(script)->length;
        if (frame.nvars != 0) {
            frame.vars = js_AllocRawStack(cx, frame.nvars, &mark);
            if (!frame.vars) {
                ok = JS_FALSE;
                goto out;
            }
            memset(frame.vars, 0, frame.nvars * sizeof(jsval));
        } else {
            frame.vars = NULL;
        }
        frame.annotation = NULL;
        frame.sharpArray = NULL;
    }
    frame.rval = JSVAL_VOID;
    frame.down = down;
    frame.scopeChain = chain;
    frame.pc = NULL;
    frame.sp = oldfp ? oldfp->sp : NULL;
    frame.spbase = NULL;
    frame.sharpDepth = 0;
    frame.flags = flags;
    frame.dormantNext = NULL;
    frame.xmlNamespace = NULL;
    frame.blockChain = NULL;

    /*
     * Here we wrap the call to js_Interpret with code to (conditionally)
     * save and restore the old stack frame chain into a chain of 'dormant'
     * frame chains.  Since we are replacing cx->fp, we were running into
     * the problem that if GC was called under this frame, some of the GC
     * things associated with the old frame chain (available here only in
     * the C variable 'oldfp') were not rooted and were being collected.
     *
     * So, now we preserve the links to these 'dormant' frame chains in cx
     * before calling js_Interpret and cleanup afterwards.  The GC walks
     * these dormant chains and marks objects in the same way that it marks
     * objects in the primary cx->fp chain.
     */
    if (oldfp && oldfp != down) {
        JS_ASSERT(!oldfp->dormantNext);
        oldfp->dormantNext = cx->dormantFrameChain;
        cx->dormantFrameChain = oldfp;
    }

    cx->fp = &frame;
    if (hook) {
        hookData = hook(cx, &frame, JS_TRUE, 0,
                        cx->debugHooks->executeHookData);
    }

    /*
     * Use frame.rval, not result, so the last result stays rooted across any
     * GC activations nested within this js_Interpret.
     */
    ok = js_Interpret(cx, script->code, &frame.rval);
    *result = frame.rval;

    if (hookData) {
        hook = cx->debugHooks->executeHook;
        if (hook)
            hook(cx, &frame, JS_FALSE, &ok, hookData);
    }
    if (mark)
        js_FreeRawStack(cx, mark);
    cx->fp = oldfp;

    if (oldfp && oldfp != down) {
        JS_ASSERT(cx->dormantFrameChain == oldfp);
        cx->dormantFrameChain = oldfp->dormantNext;
        oldfp->dormantNext = NULL;
    }

out:
#ifdef INCLUDE_MOZILLA_DTRACE
    if (JAVASCRIPT_EXECUTE_DONE_ENABLED())
        jsdtrace_execute_done(script);
#endif
    return ok;
}

#if JS_HAS_EXPORT_IMPORT
/*
 * If id is JSVAL_VOID, import all exported properties from obj.
 */
static JSBool
ImportProperty(JSContext *cx, JSObject *obj, jsid id)
{
    JSBool ok;
    JSIdArray *ida;
    JSProperty *prop;
    JSObject *obj2, *target, *funobj, *closure;
    uintN attrs;
    jsint i;
    jsval value;

    if (JSVAL_IS_VOID(id)) {
        ida = JS_Enumerate(cx, obj);
        if (!ida)
            return JS_FALSE;
        ok = JS_TRUE;
        if (ida->length == 0)
            goto out;
    } else {
        ida = NULL;
        if (!OBJ_LOOKUP_PROPERTY(cx, obj, id, &obj2, &prop))
            return JS_FALSE;
        if (!prop) {
            js_ReportValueError(cx, JSMSG_NOT_DEFINED,
                                JSDVG_IGNORE_STACK, ID_TO_VALUE(id), NULL);
            return JS_FALSE;
        }
        ok = OBJ_GET_ATTRIBUTES(cx, obj, id, prop, &attrs);
        OBJ_DROP_PROPERTY(cx, obj2, prop);
        if (!ok)
            return JS_FALSE;
        if (!(attrs & JSPROP_EXPORTED)) {
            js_ReportValueError(cx, JSMSG_NOT_EXPORTED,
                                JSDVG_IGNORE_STACK, ID_TO_VALUE(id), NULL);
            return JS_FALSE;
        }
    }

    target = cx->fp->varobj;
    i = 0;
    do {
        if (ida) {
            id = ida->vector[i];
            ok = OBJ_GET_ATTRIBUTES(cx, obj, id, NULL, &attrs);
            if (!ok)
                goto out;
            if (!(attrs & JSPROP_EXPORTED))
                continue;
        }
        ok = OBJ_CHECK_ACCESS(cx, obj, id, JSACC_IMPORT, &value, &attrs);
        if (!ok)
            goto out;
        if (VALUE_IS_FUNCTION(cx, value)) {
            funobj = JSVAL_TO_OBJECT(value);
            closure = js_CloneFunctionObject(cx, funobj, obj);
            if (!closure) {
                ok = JS_FALSE;
                goto out;
            }
            value = OBJECT_TO_JSVAL(closure);
        }

        /*
         * Handle the case of importing a property that refers to a local
         * variable or formal parameter of a function activation.  These
         * properties are accessed by opcodes using stack slot numbers
         * generated by the compiler rather than runtime name-lookup.  These
         * local references, therefore, bypass the normal scope chain lookup.
         * So, instead of defining a new property in the activation object,
         * modify the existing value in the stack slot.
         */
        if (OBJ_GET_CLASS(cx, target) == &js_CallClass) {
            ok = OBJ_LOOKUP_PROPERTY(cx, target, id, &obj2, &prop);
            if (!ok)
                goto out;
        } else {
            prop = NULL;
        }
        if (prop && target == obj2) {
            ok = OBJ_SET_PROPERTY(cx, target, id, &value);
        } else {
            ok = OBJ_DEFINE_PROPERTY(cx, target, id, value, NULL, NULL,
                                     attrs & ~(JSPROP_EXPORTED |
                                               JSPROP_GETTER |
                                               JSPROP_SETTER),
                                     NULL);
        }
        if (prop)
            OBJ_DROP_PROPERTY(cx, obj2, prop);
        if (!ok)
            goto out;
    } while (ida && ++i < ida->length);

out:
    if (ida)
        JS_DestroyIdArray(cx, ida);
    return ok;
}
#endif /* JS_HAS_EXPORT_IMPORT */

#define JSPROP_INITIALIZER 0x100   /* NB: Not a valid property attribute. */

JSBool
js_CheckRedeclaration(JSContext *cx, JSObject *obj, jsid id, uintN attrs,
                      JSObject **objp, JSProperty **propp)
{
    JSObject *obj2;
    JSProperty *prop;
    uintN oldAttrs, report;
    JSBool isFunction;
    jsval value;
    const char *type, *name;

    if (!OBJ_LOOKUP_PROPERTY(cx, obj, id, &obj2, &prop))
        return JS_FALSE;
    if (propp) {
        *objp = obj2;
        *propp = prop;
    }
    if (!prop)
        return JS_TRUE;

    /*
     * Use prop as a speedup hint to OBJ_GET_ATTRIBUTES, but drop it on error.
     * An assertion at label bad: will insist that it is null.
     */
    if (!OBJ_GET_ATTRIBUTES(cx, obj2, id, prop, &oldAttrs)) {
        OBJ_DROP_PROPERTY(cx, obj2, prop);
#ifdef DEBUG
        prop = NULL;
#endif
        goto bad;
    }

    /*
     * From here, return true, or else goto bad on failure to null out params.
     * If our caller doesn't want prop, drop it (we don't need it any longer).
     */
    if (!propp) {
        OBJ_DROP_PROPERTY(cx, obj2, prop);
        prop = NULL;
    }

    if (attrs == JSPROP_INITIALIZER) {
        /* Allow the new object to override properties. */
        if (obj2 != obj)
            return JS_TRUE;
        report = JSREPORT_WARNING | JSREPORT_STRICT;
    } else {
        /* We allow redeclaring some non-readonly properties. */
        if (((oldAttrs | attrs) & JSPROP_READONLY) == 0) {
            /*
             * Allow redeclaration of variables and functions, but insist that
             * the new value is not a getter if the old value was, ditto for
             * setters -- unless prop is impermanent (in which case anyone
             * could delete it and redefine it, willy-nilly).
             */
            if (!(attrs & (JSPROP_GETTER | JSPROP_SETTER)))
                return JS_TRUE;
            if ((~(oldAttrs ^ attrs) & (JSPROP_GETTER | JSPROP_SETTER)) == 0)
                return JS_TRUE;
            if (!(oldAttrs & JSPROP_PERMANENT))
                return JS_TRUE;
        }

        report = JSREPORT_ERROR;
        isFunction = (oldAttrs & (JSPROP_GETTER | JSPROP_SETTER)) != 0;
        if (!isFunction) {
            if (!OBJ_GET_PROPERTY(cx, obj, id, &value))
                goto bad;
            isFunction = VALUE_IS_FUNCTION(cx, value);
        }
    }

    type = (attrs == JSPROP_INITIALIZER)
           ? "property"
           : (oldAttrs & attrs & JSPROP_GETTER)
           ? js_getter_str
           : (oldAttrs & attrs & JSPROP_SETTER)
           ? js_setter_str
           : (oldAttrs & JSPROP_READONLY)
           ? js_const_str
           : isFunction
           ? js_function_str
           : js_var_str;
    name = js_ValueToPrintableString(cx, ID_TO_VALUE(id));
    if (!name)
        goto bad;
    return JS_ReportErrorFlagsAndNumber(cx, report,
                                        js_GetErrorMessage, NULL,
                                        JSMSG_REDECLARED_VAR,
                                        type, name);

bad:
    if (propp) {
        *objp = NULL;
        *propp = NULL;
    }
    JS_ASSERT(!prop);
    return JS_FALSE;
}

JSBool
js_StrictlyEqual(JSContext *cx, jsval lval, jsval rval)
{
    jsval ltag = JSVAL_TAG(lval), rtag = JSVAL_TAG(rval);
    jsdouble ld, rd;

    if (ltag == rtag) {
        if (ltag == JSVAL_STRING) {
            JSString *lstr = JSVAL_TO_STRING(lval),
                     *rstr = JSVAL_TO_STRING(rval);
            return js_EqualStrings(lstr, rstr);
        }
        if (ltag == JSVAL_DOUBLE) {
            ld = *JSVAL_TO_DOUBLE(lval);
            rd = *JSVAL_TO_DOUBLE(rval);
            return JSDOUBLE_COMPARE(ld, ==, rd, JS_FALSE);
        }
        if (ltag == JSVAL_OBJECT &&
            lval != rval &&
            !JSVAL_IS_NULL(lval) &&
            !JSVAL_IS_NULL(rval)) {
            JSObject *lobj, *robj;
            JSClass *lclasp, *rclasp;

            lobj = JSVAL_TO_OBJECT(lval);
            robj = JSVAL_TO_OBJECT(rval);
            lclasp = OBJ_GET_CLASS(cx, lobj);
            rclasp = OBJ_GET_CLASS(cx, robj);
            if (lclasp->flags & JSCLASS_IS_EXTENDED) {
                JSExtendedClass *xclasp = (JSExtendedClass *) lclasp;
                if (xclasp->wrappedObject &&
                    (lobj = xclasp->wrappedObject(cx, lobj))) {
                    lval = OBJECT_TO_JSVAL(lobj);
                }
            }
            if (rclasp->flags & JSCLASS_IS_EXTENDED) {
                JSExtendedClass *xclasp = (JSExtendedClass *) rclasp;
                if (xclasp->wrappedObject &&
                    (robj = xclasp->wrappedObject(cx, robj))) {
                    rval = OBJECT_TO_JSVAL(robj);
                }
            }
        }
        return lval == rval;
    }
    if (ltag == JSVAL_DOUBLE && JSVAL_IS_INT(rval)) {
        ld = *JSVAL_TO_DOUBLE(lval);
        rd = JSVAL_TO_INT(rval);
        return JSDOUBLE_COMPARE(ld, ==, rd, JS_FALSE);
    }
    if (JSVAL_IS_INT(lval) && rtag == JSVAL_DOUBLE) {
        ld = JSVAL_TO_INT(lval);
        rd = *JSVAL_TO_DOUBLE(rval);
        return JSDOUBLE_COMPARE(ld, ==, rd, JS_FALSE);
    }
    return lval == rval;
}

JSBool
js_InvokeConstructor(JSContext *cx, jsval *vp, uintN argc)
{
    JSFunction *fun, *fun2;
    JSObject *obj, *obj2, *proto, *parent;
    jsval lval, rval;
    JSClass *clasp;

    fun = NULL;
    obj2 = NULL;
    lval = *vp;
    if (!JSVAL_IS_OBJECT(lval) ||
        (obj2 = JSVAL_TO_OBJECT(lval)) == NULL ||
        /* XXX clean up to avoid special cases above ObjectOps layer */
        OBJ_GET_CLASS(cx, obj2) == &js_FunctionClass ||
        !obj2->map->ops->construct)
    {
        fun = js_ValueToFunction(cx, vp, JSV2F_CONSTRUCT);
        if (!fun)
            return JS_FALSE;
    }

    clasp = &js_ObjectClass;
    if (!obj2) {
        proto = parent = NULL;
        fun = NULL;
    } else {
        /*
         * Get the constructor prototype object for this function.
         * Use the nominal 'this' parameter slot, vp[1], as a local
         * root to protect this prototype, in case it has no other
         * strong refs.
         */
        if (!OBJ_GET_PROPERTY(cx, obj2,
                              ATOM_TO_JSID(cx->runtime->atomState
                                           .classPrototypeAtom),
                              &vp[1])) {
            return JS_FALSE;
        }
        rval = vp[1];
        proto = JSVAL_IS_OBJECT(rval) ? JSVAL_TO_OBJECT(rval) : NULL;
        parent = OBJ_GET_PARENT(cx, obj2);

        if (OBJ_GET_CLASS(cx, obj2) == &js_FunctionClass) {
            fun2 = GET_FUNCTION_PRIVATE(cx, obj2);
            if (!FUN_INTERPRETED(fun2) && fun2->u.n.clasp)
                clasp = fun2->u.n.clasp;
        }
    }
    obj = js_NewObject(cx, clasp, proto, parent);
    if (!obj)
        return JS_FALSE;

    /* Now we have an object with a constructor method; call it. */
    vp[1] = OBJECT_TO_JSVAL(obj);
    if (!js_Invoke(cx, argc, vp, JSINVOKE_CONSTRUCT)) {
        cx->weakRoots.newborn[GCX_OBJECT] = NULL;
        return JS_FALSE;
    }

    /* Check the return value and if it's primitive, force it to be obj. */
    rval = *vp;
    if (JSVAL_IS_PRIMITIVE(rval)) {
        if (!fun) {
            /* native [[Construct]] returning primitive is error */
            JS_ReportErrorNumber(cx, js_GetErrorMessage, NULL,
                                 JSMSG_BAD_NEW_RESULT,
                                 js_ValueToPrintableString(cx, rval));
            return JS_FALSE;
        }
        *vp = OBJECT_TO_JSVAL(obj);
    }

    JS_RUNTIME_METER(cx->runtime, constructs);
    return JS_TRUE;
}

static JSBool
InternNonIntElementId(JSContext *cx, JSObject *obj, jsval idval, jsid *idp)
{
    JSAtom *atom;

    JS_ASSERT(!JSVAL_IS_INT(idval));

#if JS_HAS_XML_SUPPORT
    if (!JSVAL_IS_PRIMITIVE(idval)) {
        if (OBJECT_IS_XML(cx, obj)) {
            *idp = OBJECT_JSVAL_TO_JSID(idval);
            return JS_TRUE;
        }
        if (!js_IsFunctionQName(cx, JSVAL_TO_OBJECT(idval), idp))
            return JS_FALSE;
        if (*idp != 0)
            return JS_TRUE;
    }
#endif

    atom = js_ValueToStringAtom(cx, idval);
    if (!atom)
        return JS_FALSE;
    *idp = ATOM_TO_JSID(atom);
    return JS_TRUE;
}

/*
 * Threaded interpretation via computed goto appears to be well-supported by
 * GCC 3 and higher.  IBM's C compiler when run with the right options (e.g.,
 * -qlanglvl=extended) also supports threading.  Ditto the SunPro C compiler.
 * Currently it's broken for JS_VERSION < 160, though this isn't worth fixing.
 * Add your compiler support macros here.
 */
#ifndef JS_THREADED_INTERP
# if JS_VERSION >= 160 && (                                                   \
    __GNUC__ >= 3 ||                                                          \
    (__IBMC__ >= 700 && defined __IBM_COMPUTED_GOTO) ||                       \
    __SUNPRO_C >= 0x570)
#  define JS_THREADED_INTERP 1
# else
#  define JS_THREADED_INTERP 0
# endif
#endif

/*
 * Define JS_OPMETER to instrument bytecode succession, generating a .dot file
 * on shutdown that shows the graph of significant predecessor/successor pairs
 * executed, where the edge labels give the succession counts.  The .dot file
 * is named by the JS_OPMETER_FILE envariable, and defaults to /tmp/ops.dot.
 *
 * Bonus feature: JS_OPMETER also enables counters for stack-addressing ops
 * such as JSOP_GETVAR, JSOP_INCARG, via METER_SLOT_OP.  The resulting counts
 * are written to JS_OPMETER_HIST, defaulting to /tmp/ops.hist.
 */
#ifndef JS_OPMETER
# define METER_OP_INIT(op)      /* nothing */
# define METER_OP_PAIR(op1,op2) /* nothing */
# define METER_SLOT_OP(op,slot) /* nothing */
#else

# include <stdlib.h>

/*
 * The second dimension is hardcoded at 256 because we know that many bits fit
 * in a byte, and mainly to optimize away multiplying by JSOP_LIMIT to address
 * any particular row.
 */
# define METER_OP_INIT(op)      ((op) = JSOP_STOP)
# define METER_OP_PAIR(op1,op2) ((op1) != JSOP_STOP && ++succeeds[op1][op2])
# define HIST_NSLOTS            8
# define METER_SLOT_OP(op,slot) ((slot) < HIST_NSLOTS && ++slot_ops[op][slot])

static uint32 succeeds[JSOP_LIMIT][256];
static uint32 slot_ops[JSOP_LIMIT][HIST_NSLOTS];

typedef struct Edge {
    const char  *from;
    const char  *to;
    uint32      count;
} Edge;

static int
compare_edges(const void *a, const void *b)
{
    const Edge *ea = (const Edge *) a;
    const Edge *eb = (const Edge *) b;

    return (int32)eb->count - (int32)ea->count;
}

void
js_DumpOpMeters()
{
    const char *name, *from, *style;
    FILE *fp;
    uint32 total, count;
    uint32 i, j, nedges;
    Edge *graph;

    name = getenv("JS_OPMETER_FILE");
    if (!name)
        name = "/tmp/ops.dot";
    fp = fopen(name, "w");
    if (!fp) {
        perror(name);
        return;
    }

    total = nedges = 0;
    for (i = 0; i < JSOP_LIMIT; i++) {
        for (j = 0; j < JSOP_LIMIT; j++) {
            count = succeeds[i][j];
            if (count != 0) {
                total += count;
                ++nedges;
            }
        }
    }

# define SIGNIFICANT(count,total) (200. * (count) >= (total))

    graph = (Edge *) calloc(nedges, sizeof graph[0]);
    for (i = nedges = 0; i < JSOP_LIMIT; i++) {
        from = js_CodeSpec[i].name;
        for (j = 0; j < JSOP_LIMIT; j++) {
            count = succeeds[i][j];
            if (count != 0 && SIGNIFICANT(count, total)) {
                graph[nedges].from = from;
                graph[nedges].to = js_CodeSpec[j].name;
                graph[nedges].count = count;
                ++nedges;
            }
        }
    }
    qsort(graph, nedges, sizeof(Edge), compare_edges);

# undef SIGNIFICANT

    fputs("digraph {\n", fp);
    for (i = 0, style = NULL; i < nedges; i++) {
        JS_ASSERT(i == 0 || graph[i-1].count >= graph[i].count);
        if (!style || graph[i-1].count != graph[i].count) {
            style = (i > nedges * .75) ? "dotted" :
                    (i > nedges * .50) ? "dashed" :
                    (i > nedges * .25) ? "solid" : "bold";
        }
        fprintf(fp, "  %s -> %s [label=\"%lu\" style=%s]\n",
                graph[i].from, graph[i].to,
                (unsigned long)graph[i].count, style);
    }
    free(graph);
    fputs("}\n", fp);
    fclose(fp);

    name = getenv("JS_OPMETER_HIST");
    if (!name)
        name = "/tmp/ops.hist";
    fp = fopen(name, "w");
    if (!fp) {
        perror(name);
        return;
    }
    fputs("bytecode", fp);
    for (j = 0; j < HIST_NSLOTS; j++)
        fprintf(fp, "  slot %1u", (unsigned)j);
    putc('\n', fp);
    fputs("========", fp);
    for (j = 0; j < HIST_NSLOTS; j++)
        fputs(" =======", fp);
    putc('\n', fp);
    for (i = 0; i < JSOP_LIMIT; i++) {
        for (j = 0; j < HIST_NSLOTS; j++) {
            if (slot_ops[i][j] != 0) {
                /* Reuse j in the next loop, since we break after. */
                fprintf(fp, "%-8.8s", js_CodeSpec[i].name);
                for (j = 0; j < HIST_NSLOTS; j++)
                    fprintf(fp, " %7lu", (unsigned long)slot_ops[i][j]);
                putc('\n', fp);
                break;
            }
        }
    }
    fclose(fp);
}

#endif /* JS_OPSMETER */

/*
 * Ensure that the intrepreter switch can close call-bytecode cases in the
 * same way as non-call bytecodes.
 */
JS_STATIC_ASSERT(JSOP_NAME_LENGTH == JSOP_CALLNAME_LENGTH);
JS_STATIC_ASSERT(JSOP_GETGVAR_LENGTH == JSOP_CALLGVAR_LENGTH);
JS_STATIC_ASSERT(JSOP_GETVAR_LENGTH == JSOP_CALLVAR_LENGTH);
JS_STATIC_ASSERT(JSOP_GETARG_LENGTH == JSOP_CALLARG_LENGTH);
JS_STATIC_ASSERT(JSOP_GETLOCAL_LENGTH == JSOP_CALLLOCAL_LENGTH);
JS_STATIC_ASSERT(JSOP_XMLNAME_LENGTH == JSOP_CALLXMLNAME_LENGTH);

/* Ensure we can share deffun and closure code. */
JS_STATIC_ASSERT(JSOP_DEFFUN_LENGTH == JSOP_CLOSURE_LENGTH);

JSBool
js_Interpret(JSContext *cx, jsbytecode *pc, jsval *result)
{
    JSRuntime *rt;
    JSStackFrame *fp;
    JSScript *script;
    uintN inlineCallCount;
    JSAtom **atoms;
    JSObject *obj, *obj2, *parent;
    JSVersion currentVersion, originalVersion;
    JSBool ok, cond;
    JSTrapHandler interruptHandler;
    jsint depth, len;
    jsval *sp, *newsp;
    void *mark;
    jsbytecode *endpc, *pc2;
    JSOp op, op2;
    jsatomid index;
    JSAtom *atom;
    uintN argc, attrs, flags, slot;
    jsval *vp, lval, rval, ltmp, rtmp;
    jsid id;
    JSObject *withobj, *iterobj;
    JSProperty *prop;
    JSScopeProperty *sprop;
    JSString *str, *str2;
    jsint i, j;
    jsdouble d, d2;
    JSClass *clasp;
    JSFunction *fun;
    JSType type;
#if !JS_THREADED_INTERP && defined DEBUG
    FILE *tracefp = NULL;
#endif
#if JS_HAS_EXPORT_IMPORT
    JSIdArray *ida;
#endif
    jsint low, high, off, npairs;
    JSBool match;
#if JS_HAS_GETTER_SETTER
    JSPropertyOp getter, setter;
#endif
    int stackDummy;

#ifdef __GNUC__
# define JS_EXTENSION __extension__
# define JS_EXTENSION_(s) __extension__ ({ s; })
#else
# define JS_EXTENSION
# define JS_EXTENSION_(s) s
#endif

#if JS_THREADED_INTERP
    static void *normalJumpTable[] = {
# define OPDEF(op,val,name,token,length,nuses,ndefs,prec,format) \
        JS_EXTENSION &&L_##op,
# include "jsopcode.tbl"
# undef OPDEF
    };

    static void *interruptJumpTable[] = {
# define OPDEF(op,val,name,token,length,nuses,ndefs,prec,format)              \
        JS_EXTENSION &&interrupt,
# include "jsopcode.tbl"
# undef OPDEF
    };

    register void **jumpTable = normalJumpTable;

    METER_OP_INIT(op);      /* to nullify first METER_OP_PAIR */

# define DO_OP()            JS_EXTENSION_(goto *jumpTable[op])
# define DO_NEXT_OP(n)      do { METER_OP_PAIR(op, pc[n]);                    \
                                 op = (JSOp) *(pc += (n));                    \
                                 DO_OP(); } while (0)
# define BEGIN_CASE(OP)     L_##OP:
# define END_CASE(OP)       DO_NEXT_OP(OP##_LENGTH);
# define END_VARLEN_CASE    DO_NEXT_OP(len);
# define EMPTY_CASE(OP)     BEGIN_CASE(OP) op = (JSOp) *++pc; DO_OP();
#else
# define DO_OP()            goto do_op
# define DO_NEXT_OP(n)      goto advance_pc
# define BEGIN_CASE(OP)     case OP:
# define END_CASE(OP)       break;
# define END_VARLEN_CASE    break;
# define EMPTY_CASE(OP)     BEGIN_CASE(OP) END_CASE(OP)
#endif

    *result = JSVAL_VOID;
    rt = cx->runtime;

    /* Set registerized frame pointer and derived script pointer. */
    fp = cx->fp;
    script = fp->script;
    JS_ASSERT(script->length != 0);

    /* Count of JS function calls that nest in this C js_Interpret frame. */
    inlineCallCount = 0;

    /*
     * Initialize the index segment register used by LOAD_ATOM and
     * GET_FULL_INDEX macros bellow. As a register we use a pointer based on
     * the atom map to turn frequently executed LOAD_ATOM into simple array
     * access. For less frequent object and regexp loads we have to recover
     * the segment from atoms pointer first.
     */
    atoms = script->atomMap.vector;

#define LOAD_ATOM(PCOFF)                                                      \
    JS_BEGIN_MACRO                                                            \
        JS_ASSERT((size_t)(atoms - script->atomMap.vector) <                  \
                  (size_t)(script->atomMap.length - GET_INDEX(pc + PCOFF)));  \
        atom = atoms[GET_INDEX(pc + PCOFF)];                                  \
    JS_END_MACRO

#define GET_FULL_INDEX(PCOFF)                                                 \
    (atoms - script->atomMap.vector + GET_INDEX(pc + PCOFF))

#define LOAD_OBJECT(PCOFF)                                                    \
    JS_GET_SCRIPT_OBJECT(script, GET_FULL_INDEX(PCOFF), obj)

#define LOAD_FUNCTION(PCOFF)                                                  \
    JS_BEGIN_MACRO                                                            \
        LOAD_OBJECT(PCOFF);                                                   \
        JS_ASSERT(OBJ_GET_CLASS(cx, obj) == &js_FunctionClass);               \
    JS_END_MACRO

    /*
     * Optimized Get and SetVersion for proper script language versioning.
     *
     * If any native method or JSClass/JSObjectOps hook calls js_SetVersion
     * and changes cx->version, the effect will "stick" and we will stop
     * maintaining currentVersion.  This is relied upon by testsuites, for
     * the most part -- web browsers select version before compiling and not
     * at run-time.
     */
    currentVersion = (JSVersion) script->version;
    originalVersion = (JSVersion) cx->version;
    if (currentVersion != originalVersion)
        js_SetVersion(cx, currentVersion);

#ifdef __GNUC__
    flags = 0;  /* suppress gcc warnings */
    id = 0;
#endif

    /*
     * Prepare to call a user-supplied branch handler, and abort the script
     * if it returns false.
     */
#define CHECK_BRANCH(len)                                                     \
    JS_BEGIN_MACRO                                                            \
        if (len <= 0 && (cx->operationCount -= JSOW_SCRIPT_JUMP) <= 0) {      \
            SAVE_SP_AND_PC(fp);                                               \
            ok = js_ResetOperationCount(cx);                                  \
            if (!ok)                                                          \
                goto out;                                                     \
        }                                                                     \
    JS_END_MACRO

    /*
     * Load the debugger's interrupt hook here and after calling out to native
     * functions (but not to getters, setters, or other native hooks), so we do
     * not have to reload it each time through the interpreter loop -- we hope
     * the compiler can keep it in a register when it is non-null.
     */
#if JS_THREADED_INTERP
# define LOAD_JUMP_TABLE()                                                    \
    (jumpTable = interruptHandler ? interruptJumpTable : normalJumpTable)
#else
# define LOAD_JUMP_TABLE()      /* nothing */
#endif

#define LOAD_INTERRUPT_HANDLER(cx)                                            \
    JS_BEGIN_MACRO                                                            \
        interruptHandler = (cx)->debugHooks->interruptHandler;                \
        LOAD_JUMP_TABLE();                                                    \
    JS_END_MACRO

    LOAD_INTERRUPT_HANDLER(cx);

    /* Check for too much js_Interpret nesting, or too deep a C stack. */
    ++cx->interpLevel;
    if (!JS_CHECK_STACK_SIZE(cx, stackDummy)) {
        js_ReportOverRecursed(cx);
        ok = JS_FALSE;
        goto out2;
    }

    /*
     * Allocate operand and pc stack slots for the script's worst-case depth,
     * unless we're called to interpret a part of an already active script, a
     * filtering predicate expression for example.
     */
    depth = (jsint) script->depth;
    if (JS_LIKELY(!fp->spbase)) {
        newsp = js_AllocRawStack(cx, (uintN)(2 * depth), &mark);
        if (!newsp) {
            ok = JS_FALSE;
            goto out2;
        }
        sp = newsp + depth;
        fp->spbase = sp;
        SAVE_SP(fp);
    } else {
        sp = fp->sp;
        JS_ASSERT(JS_UPTRDIFF(sp, fp->spbase) <= depth * sizeof(jsval));
        newsp = fp->spbase - depth;
        mark = NULL;
    }

    /*
     * To support generator_throw and to catch ignored exceptions, fail right
     * away if cx->throwing is set.  If no exception is pending, null obj in
     * case a callable object is being sent into a yield expression, and the
     * yield's result is invoked.
     */
    ok = !cx->throwing;
    if (!ok) {
#ifdef DEBUG_NOT_THROWING
        printf("JS INTERPRETER CALLED WITH PENDING EXCEPTION %lx\n",
               (unsigned long) cx->exception);
#endif
        goto out;
    }

#if JS_THREADED_INTERP

    /*
     * This is a loop, but it does not look like a loop.  The loop-closing
     * jump is distributed throughout interruptJumpTable, and comes back to
     * the interrupt label.  The dispatch on op is through normalJumpTable.
     * The trick is LOAD_INTERRUPT_HANDLER setting jumpTable appropriately.
     *
     * It is important that "op" be initialized before the interrupt label
     * because it is possible for "op" to be specially assigned during the
     * normally processing of an opcode while looping (in particular, this
     * happens in JSOP_TRAP while debugging).  We rely on DO_NEXT_OP to
     * correctly manage "op" in all other cases.
     */
    op = (JSOp) *pc;
    if (interruptHandler) {
interrupt:
        SAVE_SP_AND_PC(fp);
        switch (interruptHandler(cx, script, pc, &rval,
                                 cx->debugHooks->interruptHandlerData)) {
          case JSTRAP_ERROR:
            ok = JS_FALSE;
            goto out;
          case JSTRAP_CONTINUE:
            break;
          case JSTRAP_RETURN:
            fp->rval = rval;
            goto out;
          case JSTRAP_THROW:
            cx->throwing = JS_TRUE;
            cx->exception = rval;
            ok = JS_FALSE;
            goto out;
          default:;
        }
        LOAD_INTERRUPT_HANDLER(cx);
    }

    JS_ASSERT((uintN)op < (uintN)JSOP_LIMIT);
    JS_EXTENSION_(goto *normalJumpTable[op]);

#else  /* !JS_THREADED_INTERP */

    for (;;) {
        op = (JSOp) *pc;
      do_op:
        len = js_CodeSpec[op].length;

#ifdef DEBUG
        tracefp = (FILE *) cx->tracefp;
        if (tracefp) {
            intN nuses, n;

            fprintf(tracefp, "%4u: ", js_PCToLineNumber(cx, script, pc));
            js_Disassemble1(cx, script, pc,
                            PTRDIFF(pc, script->code, jsbytecode), JS_FALSE,
                            tracefp);
            nuses = js_CodeSpec[op].nuses;
            if (nuses) {
                SAVE_SP_AND_PC(fp);
                for (n = -nuses; n < 0; n++) {
                    char *bytes = js_DecompileValueGenerator(cx, n, sp[n],
                                                             NULL);
                    if (bytes) {
                        fprintf(tracefp, "%s %s",
                                (n == -nuses) ? "  inputs:" : ",",
                                bytes);
                        JS_free(cx, bytes);
                    }
                }
                fprintf(tracefp, " @ %d\n", sp - fp->spbase);
            }
        }
#endif /* DEBUG */

        if (interruptHandler) {
            SAVE_SP_AND_PC(fp);
            switch (interruptHandler(cx, script, pc, &rval,
                                     cx->debugHooks->interruptHandlerData)) {
              case JSTRAP_ERROR:
                ok = JS_FALSE;
                goto out;
              case JSTRAP_CONTINUE:
                break;
              case JSTRAP_RETURN:
                fp->rval = rval;
                goto out;
              case JSTRAP_THROW:
                cx->throwing = JS_TRUE;
                cx->exception = rval;
                ok = JS_FALSE;
                goto out;
              default:;
            }
            LOAD_INTERRUPT_HANDLER(cx);
        }

        switch (op) {

#endif /* !JS_THREADED_INTERP */

          BEGIN_CASE(JSOP_STOP)
            goto out;

          EMPTY_CASE(JSOP_NOP)

          EMPTY_CASE(JSOP_GROUP)

          BEGIN_CASE(JSOP_PUSH)
            PUSH_OPND(JSVAL_VOID);
          END_CASE(JSOP_PUSH)

          BEGIN_CASE(JSOP_POP)
            sp--;
          END_CASE(JSOP_POP)

          BEGIN_CASE(JSOP_POPN)
            sp -= GET_UINT16(pc);
#ifdef DEBUG
            JS_ASSERT(fp->spbase <= sp);
            obj = fp->blockChain;
            JS_ASSERT(!obj ||
                      fp->spbase + OBJ_BLOCK_DEPTH(cx, obj)
                                 + OBJ_BLOCK_COUNT(cx, obj)
                      <= sp);
            for (obj = fp->scopeChain; obj; obj = OBJ_GET_PARENT(cx, obj)) {
                clasp = OBJ_GET_CLASS(cx, obj);
                if (clasp != &js_BlockClass && clasp != &js_WithClass)
                    continue;
                if (JS_GetPrivate(cx, obj) != fp)
                    break;
                JS_ASSERT(fp->spbase + OBJ_BLOCK_DEPTH(cx, obj)
                                     + ((clasp == &js_BlockClass)
                                         ? OBJ_BLOCK_COUNT(cx, obj)
                                         : 1)
                          <= sp);
            }
#endif
          END_CASE(JSOP_POPN)

          BEGIN_CASE(JSOP_SWAP)
            vp = sp - depth;    /* swap generating pc's for the decompiler */
            ltmp = vp[-1];
            vp[-1] = vp[-2];
            sp[-2] = ltmp;
            rtmp = sp[-1];
            sp[-1] = sp[-2];
            sp[-2] = rtmp;
          END_CASE(JSOP_SWAP)

          BEGIN_CASE(JSOP_POPV)
            *result = POP_OPND();
          END_CASE(JSOP_POPV)

          BEGIN_CASE(JSOP_ENTERWITH)
            SAVE_SP_AND_PC(fp);
            FETCH_OBJECT(cx, -1, rval, obj);
            OBJ_TO_INNER_OBJECT(cx, obj);
            if (!obj || !(obj2 = js_GetScopeChain(cx, fp))) {
                ok = JS_FALSE;
                goto out;
            }
            withobj = js_NewWithObject(cx, obj, obj2, sp - fp->spbase - 1);
            if (!withobj) {
                ok = JS_FALSE;
                goto out;
            }
            fp->scopeChain = withobj;
            STORE_OPND(-1, OBJECT_TO_JSVAL(withobj));
          END_CASE(JSOP_ENTERWITH)

          BEGIN_CASE(JSOP_LEAVEWITH)
            rval = POP_OPND();
            JS_ASSERT(JSVAL_IS_OBJECT(rval));
            withobj = JSVAL_TO_OBJECT(rval);
            JS_ASSERT(OBJ_GET_CLASS(cx, withobj) == &js_WithClass);
            fp->scopeChain = OBJ_GET_PARENT(cx, withobj);
            JS_SetPrivate(cx, withobj, NULL);
          END_CASE(JSOP_LEAVEWITH)

          BEGIN_CASE(JSOP_SETRVAL)
            ASSERT_NOT_THROWING(cx);
            fp->rval = POP_OPND();
          END_CASE(JSOP_SETRVAL)

          BEGIN_CASE(JSOP_RETURN)
            CHECK_BRANCH(-1);
            fp->rval = POP_OPND();
            /* FALL THROUGH */

          BEGIN_CASE(JSOP_RETRVAL)    /* fp->rval already set */
            ASSERT_NOT_THROWING(cx);
            if (inlineCallCount)
          inline_return:
            {
                JSInlineFrame *ifp = (JSInlineFrame *) fp;
                void *hookData = ifp->hookData;

                /*
                 * If fp has blocks on its scope chain, home their locals now,
                 * before calling any debugger hook, and before freeing stack.
                 * This matches the order of block putting and hook calling in
                 * the "out-of-line" return code at the bottom of js_Interpret
                 * and in js_Invoke.
                 */
                if (fp->flags & JSFRAME_POP_BLOCKS) {
                    SAVE_SP_AND_PC(fp);
                    ok &= PutBlockObjects(cx, fp);
                }

                if (hookData) {
                    JSInterpreterHook hook = cx->debugHooks->callHook;
                    if (hook) {
                        SAVE_SP_AND_PC(fp);
                        hook(cx, fp, JS_FALSE, &ok, hookData);
                        LOAD_INTERRUPT_HANDLER(cx);
                    }
                }

                /*
                 * If fp has a call object, sync values and clear the back-
                 * pointer. This can happen for a lightweight function if it
                 * calls eval unexpectedly (in a way that is hidden from the
                 * compiler). See bug 325540.
                 */
                if (fp->callobj) {
                    SAVE_SP_AND_PC(fp);
                    ok &= js_PutCallObject(cx, fp);
                }

                if (fp->argsobj) {
                    SAVE_SP_AND_PC(fp);
                    ok &= js_PutArgsObject(cx, fp);
                }

#ifdef INCLUDE_MOZILLA_DTRACE
                /* DTrace function return, inlines */
                if (JAVASCRIPT_FUNCTION_RVAL_ENABLED())
                    jsdtrace_function_rval(cx, fp, fp->fun);
                if (JAVASCRIPT_FUNCTION_RETURN_ENABLED())
                    jsdtrace_function_return(cx, fp, fp->fun);
#endif

                /* Restore context version only if callee hasn't set version. */
                if (JS_LIKELY(cx->version == currentVersion)) {
                    currentVersion = ifp->callerVersion;
                    if (currentVersion != cx->version)
                        js_SetVersion(cx, currentVersion);
                }

                /* Store the return value in the caller's operand frame. */
                vp = ifp->rvp;
                *vp = fp->rval;

                /* Restore cx->fp and release the inline frame's space. */
                cx->fp = fp = fp->down;
                JS_ARENA_RELEASE(&cx->stackPool, ifp->mark);

                /* Restore sp to point just above the return value. */
                fp->sp = vp + 1;
                RESTORE_SP(fp);

                /* Restore the calling script's interpreter registers. */
                script = fp->script;
                depth = (jsint) script->depth;
                atoms = script->atomMap.vector;
                pc = fp->pc;

                /* Store the generating pc for the return value. */
                vp[-depth] = (jsval)pc;

                /* Resume execution in the calling frame. */
                inlineCallCount--;
                if (JS_LIKELY(ok)) {
                    JS_ASSERT(js_CodeSpec[*pc].length == JSOP_CALL_LENGTH);
                    len = JSOP_CALL_LENGTH;
                    DO_NEXT_OP(len);
                }
            }
            goto out;

          BEGIN_CASE(JSOP_DEFAULT)
            (void) POP();
            /* FALL THROUGH */
          BEGIN_CASE(JSOP_GOTO)
            len = GET_JUMP_OFFSET(pc);
            CHECK_BRANCH(len);
          END_VARLEN_CASE

          BEGIN_CASE(JSOP_IFEQ)
            POP_BOOLEAN(cx, rval, cond);
            if (cond == JS_FALSE) {
                len = GET_JUMP_OFFSET(pc);
                CHECK_BRANCH(len);
                DO_NEXT_OP(len);
            }
          END_CASE(JSOP_IFEQ)

          BEGIN_CASE(JSOP_IFNE)
            POP_BOOLEAN(cx, rval, cond);
            if (cond != JS_FALSE) {
                len = GET_JUMP_OFFSET(pc);
                CHECK_BRANCH(len);
                DO_NEXT_OP(len);
            }
          END_CASE(JSOP_IFNE)

          BEGIN_CASE(JSOP_OR)
            POP_BOOLEAN(cx, rval, cond);
            if (cond == JS_TRUE) {
                len = GET_JUMP_OFFSET(pc);
                PUSH_OPND(rval);
                DO_NEXT_OP(len);
            }
          END_CASE(JSOP_OR)

          BEGIN_CASE(JSOP_AND)
            POP_BOOLEAN(cx, rval, cond);
            if (cond == JS_FALSE) {
                len = GET_JUMP_OFFSET(pc);
                PUSH_OPND(rval);
                DO_NEXT_OP(len);
            }
          END_CASE(JSOP_AND)

          BEGIN_CASE(JSOP_DEFAULTX)
            (void) POP();
            /* FALL THROUGH */
          BEGIN_CASE(JSOP_GOTOX)
            len = GET_JUMPX_OFFSET(pc);
            CHECK_BRANCH(len);
          END_VARLEN_CASE

          BEGIN_CASE(JSOP_IFEQX)
            POP_BOOLEAN(cx, rval, cond);
            if (cond == JS_FALSE) {
                len = GET_JUMPX_OFFSET(pc);
                CHECK_BRANCH(len);
                DO_NEXT_OP(len);
            }
          END_CASE(JSOP_IFEQX)

          BEGIN_CASE(JSOP_IFNEX)
            POP_BOOLEAN(cx, rval, cond);
            if (cond != JS_FALSE) {
                len = GET_JUMPX_OFFSET(pc);
                CHECK_BRANCH(len);
                DO_NEXT_OP(len);
            }
          END_CASE(JSOP_IFNEX)

          BEGIN_CASE(JSOP_ORX)
            POP_BOOLEAN(cx, rval, cond);
            if (cond == JS_TRUE) {
                len = GET_JUMPX_OFFSET(pc);
                PUSH_OPND(rval);
                DO_NEXT_OP(len);
            }
          END_CASE(JSOP_ORX)

          BEGIN_CASE(JSOP_ANDX)
            POP_BOOLEAN(cx, rval, cond);
            if (cond == JS_FALSE) {
                len = GET_JUMPX_OFFSET(pc);
                PUSH_OPND(rval);
                DO_NEXT_OP(len);
            }
          END_CASE(JSOP_ANDX)

/*
 * If the index value at sp[n] is not an int that fits in a jsval, it could
 * be an object (an XML QName, AttributeName, or AnyName), but only if we are
 * compiling with JS_HAS_XML_SUPPORT.  Otherwise convert the index value to a
 * string atom id.
 *
 * SAVE_SP_AND_PC must be already called.
 */
#define FETCH_ELEMENT_ID(obj, n, id)                                          \
    JS_BEGIN_MACRO                                                            \
        jsval idval_ = FETCH_OPND(n);                                         \
        if (JSVAL_IS_INT(idval_)) {                                           \
            id = INT_JSVAL_TO_JSID(idval_);                                   \
        } else {                                                              \
            ok = InternNonIntElementId(cx, obj, idval_, &id);                 \
            if (!ok)                                                          \
                goto out;                                                     \
        }                                                                     \
    JS_END_MACRO

          BEGIN_CASE(JSOP_IN)
            rval = FETCH_OPND(-1);
            SAVE_SP_AND_PC(fp);
            if (JSVAL_IS_PRIMITIVE(rval)) {
                js_ReportValueError(cx, JSMSG_IN_NOT_OBJECT, -1, rval, NULL);
                ok = JS_FALSE;
                goto out;
            }
            obj = JSVAL_TO_OBJECT(rval);
            FETCH_ELEMENT_ID(obj, -2, id);
            ok = OBJ_LOOKUP_PROPERTY(cx, obj, id, &obj2, &prop);
            if (!ok)
                goto out;
            sp--;
            STORE_OPND(-1, BOOLEAN_TO_JSVAL(prop != NULL));
            if (prop)
                OBJ_DROP_PROPERTY(cx, obj2, prop);
          END_CASE(JSOP_IN)

          BEGIN_CASE(JSOP_FOREACH)
            flags = JSITER_ENUMERATE | JSITER_FOREACH;
            goto value_to_iter;

#if JS_HAS_DESTRUCTURING
          BEGIN_CASE(JSOP_FOREACHKEYVAL)
            flags = JSITER_ENUMERATE | JSITER_FOREACH | JSITER_KEYVALUE;
            goto value_to_iter;
#endif

          BEGIN_CASE(JSOP_FORIN)
            /*
             * Set JSITER_ENUMERATE to indicate that for-in loop should use
             * the enumeration protocol's iterator for compatibility if an
             * explicit iterator is not given via the optional __iterator__
             * method.
             */
            flags = JSITER_ENUMERATE;

          value_to_iter:
            JS_ASSERT(sp > fp->spbase);
            SAVE_SP_AND_PC(fp);
            ok = js_ValueToIterator(cx, flags, &sp[-1]);
            if (!ok)
                goto out;
            JS_ASSERT(!JSVAL_IS_PRIMITIVE(sp[-1]));
            JS_ASSERT(JSOP_FORIN_LENGTH == js_CodeSpec[op].length);
          END_CASE(JSOP_FORIN)

          BEGIN_CASE(JSOP_FORPROP)
            /*
             * Handle JSOP_FORPROP first, so the cost of the goto do_forinloop
             * is not paid for the more common cases.
             */
            LOAD_ATOM(0);
            id = ATOM_TO_JSID(atom);
            i = -2;
            goto do_forinloop;

          BEGIN_CASE(JSOP_FORNAME)
            LOAD_ATOM(0);
            id = ATOM_TO_JSID(atom);
            /* FALL THROUGH */

          BEGIN_CASE(JSOP_FORARG)
          BEGIN_CASE(JSOP_FORVAR)
          BEGIN_CASE(JSOP_FORCONST)
          BEGIN_CASE(JSOP_FORLOCAL)
            /*
             * JSOP_FORARG and JSOP_FORVAR don't require any lval computation
             * here, because they address slots on the stack (in fp->args and
             * fp->vars, respectively).  Same applies to JSOP_FORLOCAL, which
             * addresses fp->spbase.
             */
            /* FALL THROUGH */

          BEGIN_CASE(JSOP_FORELEM)
            /*
             * JSOP_FORELEM simply initializes or updates the iteration state
             * and leaves the index expression evaluation and assignment to the
             * enumerator until after the next property has been acquired, via
             * a JSOP_ENUMELEM bytecode.
             */
            i = -1;

          do_forinloop:
            /*
             * Reach under the top of stack to find our property iterator, a
             * JSObject that contains the iteration state.
             */
            JS_ASSERT(!JSVAL_IS_PRIMITIVE(sp[i]));
            iterobj = JSVAL_TO_OBJECT(sp[i]);

            SAVE_SP_AND_PC(fp);
            ok = js_CallIteratorNext(cx, iterobj, &rval);
            if (!ok)
                goto out;
            if (rval == JSVAL_HOLE) {
                rval = JSVAL_FALSE;
                goto end_forinloop;
            }

            switch (op) {
              case JSOP_FORARG:
                slot = GET_ARGNO(pc);
                JS_ASSERT(slot < fp->fun->nargs);
                fp->argv[slot] = rval;
                break;

              case JSOP_FORVAR:
                slot = GET_VARNO(pc);
                JS_ASSERT(slot < fp->fun->u.i.nvars);
                fp->vars[slot] = rval;
                break;

              case JSOP_FORCONST:
                /* Don't update the const slot. */
                break;

              case JSOP_FORLOCAL:
                slot = GET_UINT16(pc);
                JS_ASSERT(slot < (uintN)depth);
                vp = &fp->spbase[slot];
                GC_POKE(cx, *vp);
                *vp = rval;
                break;

              case JSOP_FORELEM:
                /* FORELEM is not a SET operation, it's more like BINDNAME. */
                PUSH_OPND(rval);
                break;

              case JSOP_FORPROP:
                /*
                 * We fetch object here to ensure that the iterator is called
                 * even if lval is null or undefined that throws in
                 * FETCH_OBJECT. See bug 372331.
                 */
                FETCH_OBJECT(cx, -1, lval, obj);
                goto set_for_property;

              case JSOP_FORNAME:
                /*
                 * We find property here after the iterator call to ensure
                 * that we take into account side effects of the iterator
                 * call. See bug 372331.
                 */

                ok = js_FindProperty(cx, id, &obj, &obj2, &prop);
                if (!ok)
                    goto out;
                if (prop)
                    OBJ_DROP_PROPERTY(cx, obj2, prop);

              set_for_property:
                /* Set the variable obj[id] to refer to rval. */
                fp->flags |= JSFRAME_ASSIGNING;
                ok = OBJ_SET_PROPERTY(cx, obj, id, &rval);
                fp->flags &= ~JSFRAME_ASSIGNING;
                if (!ok)
                    goto out;
                break;

              default:
                JS_ASSERT(0);
                break;
            }

            /* Push true to keep looping through properties. */
            rval = JSVAL_TRUE;

          end_forinloop:
            sp += i + 1;
            PUSH_OPND(rval);
            len = js_CodeSpec[op].length;
            DO_NEXT_OP(len);

          BEGIN_CASE(JSOP_DUP)
            JS_ASSERT(sp > fp->spbase);
            vp = sp - 1;                /* address top of stack */
            rval = *vp;
            vp -= depth;                /* address generating pc */
            vp[1] = *vp;
            PUSH(rval);
          END_CASE(JSOP_DUP)

          BEGIN_CASE(JSOP_DUP2)
            JS_ASSERT(sp - 2 >= fp->spbase);
            vp = sp - 1;                /* address top of stack */
            lval = vp[-1];
            rval = *vp;
            vp -= depth;                /* address generating pc */
            vp[1] = vp[2] = *vp;
            PUSH(lval);
            PUSH(rval);
          END_CASE(JSOP_DUP2)

#define PROPERTY_OP(n, call)                                                  \
    JS_BEGIN_MACRO                                                            \
        /* Fetch the left part and resolve it to a non-null object. */        \
        SAVE_SP_AND_PC(fp);                                                   \
        FETCH_OBJECT(cx, n, lval, obj);                                       \
                                                                              \
        /* Get or set the property, set ok false if error, true if success. */\
        call;                                                                 \
        if (!ok)                                                              \
            goto out;                                                         \
    JS_END_MACRO

#define ELEMENT_OP(n, call)                                                   \
    JS_BEGIN_MACRO                                                            \
        /* Fetch the left part and resolve it to a non-null object. */        \
        SAVE_SP_AND_PC(fp);                                                   \
        FETCH_OBJECT(cx, n - 1, lval, obj);                                   \
                                                                              \
        /* Fetch index and convert it to id suitable for use with obj. */     \
        FETCH_ELEMENT_ID(obj, n, id);                                         \
                                                                              \
        /* Get or set the element, set ok false if error, true if success. */ \
        call;                                                                 \
        if (!ok)                                                              \
            goto out;                                                         \
    JS_END_MACRO

#define NATIVE_GET(cx,obj,pobj,sprop,vp)                                      \
    JS_BEGIN_MACRO                                                            \
        if (SPROP_HAS_STUB_GETTER(sprop)) {                                   \
            /* Fast path for Object instance properties. */                   \
            JS_ASSERT((sprop)->slot != SPROP_INVALID_SLOT ||                  \
                      !SPROP_HAS_STUB_SETTER(sprop));                         \
            *vp = ((sprop)->slot != SPROP_INVALID_SLOT)                       \
                  ? LOCKED_OBJ_GET_SLOT(pobj, (sprop)->slot)                  \
                  : JSVAL_VOID;                                               \
        } else {                                                              \
            SAVE_SP_AND_PC(fp);                                               \
            ok = js_NativeGet(cx, obj, pobj, sprop, vp);                      \
            if (!ok)                                                          \
                goto out;                                                     \
        }                                                                     \
    JS_END_MACRO

          BEGIN_CASE(JSOP_SETCONST)
            LOAD_ATOM(0);
            obj = fp->varobj;
            rval = FETCH_OPND(-1);
            SAVE_SP_AND_PC(fp);
            ok = OBJ_DEFINE_PROPERTY(cx, obj, ATOM_TO_JSID(atom), rval,
                                     NULL, NULL,
                                     JSPROP_ENUMERATE | JSPROP_PERMANENT |
                                     JSPROP_READONLY,
                                     NULL);
            if (!ok)
                goto out;
            STORE_OPND(-1, rval);
          END_CASE(JSOP_SETCONST)

#if JS_HAS_DESTRUCTURING
          BEGIN_CASE(JSOP_ENUMCONSTELEM)
            rval = FETCH_OPND(-3);
            SAVE_SP_AND_PC(fp);
            FETCH_OBJECT(cx, -2, lval, obj);
            FETCH_ELEMENT_ID(obj, -1, id);
            ok = OBJ_DEFINE_PROPERTY(cx, obj, id, rval, NULL, NULL,
                                     JSPROP_ENUMERATE | JSPROP_PERMANENT |
                                     JSPROP_READONLY,
                                     NULL);
            if (!ok)
                goto out;
            sp -= 3;
          END_CASE(JSOP_ENUMCONSTELEM)
#endif

          BEGIN_CASE(JSOP_BINDNAME)
            LOAD_ATOM(0);
            id = ATOM_TO_JSID(atom);
            SAVE_SP_AND_PC(fp);
            obj = js_FindIdentifierBase(cx, id);
            if (!obj) {
                ok = JS_FALSE;
                goto out;
            }
            PUSH_OPND(OBJECT_TO_JSVAL(obj));
          END_CASE(JSOP_BINDNAME)

          BEGIN_CASE(JSOP_SETNAME)
            LOAD_ATOM(0);
            id = ATOM_TO_JSID(atom);
            rval = FETCH_OPND(-1);
            lval = FETCH_OPND(-2);
            JS_ASSERT(!JSVAL_IS_PRIMITIVE(lval));
            obj  = JSVAL_TO_OBJECT(lval);
            SAVE_SP_AND_PC(fp);
            ok = OBJ_SET_PROPERTY(cx, obj, id, &rval);
            if (!ok)
                goto out;
            sp--;
            STORE_OPND(-1, rval);
          END_CASE(JSOP_SETNAME)

#define INTEGER_OP(OP, EXTRA_CODE)                                            \
    JS_BEGIN_MACRO                                                            \
        FETCH_INT(cx, -2, i);                                                 \
        FETCH_INT(cx, -1, j);                                                 \
        EXTRA_CODE                                                            \
        i = i OP j;                                                           \
        sp--;                                                                 \
        STORE_INT(cx, -1, i);                                                 \
    JS_END_MACRO

#define BITWISE_OP(OP)          INTEGER_OP(OP, (void) 0;)
#define SIGNED_SHIFT_OP(OP)     INTEGER_OP(OP, j &= 31;)

          BEGIN_CASE(JSOP_BITOR)
            BITWISE_OP(|);
          END_CASE(JSOP_BITOR)

          BEGIN_CASE(JSOP_BITXOR)
            BITWISE_OP(^);
          END_CASE(JSOP_BITXOR)

          BEGIN_CASE(JSOP_BITAND)
            BITWISE_OP(&);
          END_CASE(JSOP_BITAND)

#define RELATIONAL_OP(OP)                                                     \
    JS_BEGIN_MACRO                                                            \
        rval = FETCH_OPND(-1);                                                \
        lval = FETCH_OPND(-2);                                                \
        /* Optimize for two int-tagged operands (typical loop control). */    \
        if ((lval & rval) & JSVAL_INT) {                                      \
            ltmp = lval ^ JSVAL_VOID;                                         \
            rtmp = rval ^ JSVAL_VOID;                                         \
            if (ltmp && rtmp) {                                               \
                cond = JSVAL_TO_INT(lval) OP JSVAL_TO_INT(rval);              \
            } else {                                                          \
                d  = ltmp ? JSVAL_TO_INT(lval) : *rt->jsNaN;                  \
                d2 = rtmp ? JSVAL_TO_INT(rval) : *rt->jsNaN;                  \
                cond = JSDOUBLE_COMPARE(d, OP, d2, JS_FALSE);                 \
            }                                                                 \
        } else {                                                              \
            if (!JSVAL_IS_PRIMITIVE(lval))                                    \
                DEFAULT_VALUE(cx, -2, JSTYPE_NUMBER, lval);                   \
            if (!JSVAL_IS_PRIMITIVE(rval))                                    \
                DEFAULT_VALUE(cx, -1, JSTYPE_NUMBER, rval);                   \
            if (JSVAL_IS_STRING(lval) && JSVAL_IS_STRING(rval)) {             \
                str  = JSVAL_TO_STRING(lval);                                 \
                str2 = JSVAL_TO_STRING(rval);                                 \
                cond = js_CompareStrings(str, str2) OP 0;                     \
            } else {                                                          \
                VALUE_TO_NUMBER(cx, lval, d);                                 \
                VALUE_TO_NUMBER(cx, rval, d2);                                \
                cond = JSDOUBLE_COMPARE(d, OP, d2, JS_FALSE);                 \
            }                                                                 \
        }                                                                     \
        sp--;                                                                 \
        STORE_OPND(-1, BOOLEAN_TO_JSVAL(cond));                               \
    JS_END_MACRO

/*
 * NB: These macros can't use JS_BEGIN_MACRO/JS_END_MACRO around their bodies
 * because they begin if/else chains, so callers must not put semicolons after
 * the call expressions!
 */
#if JS_HAS_XML_SUPPORT
#define XML_EQUALITY_OP(OP)                                                   \
    if ((ltmp == JSVAL_OBJECT &&                                              \
         (obj2 = JSVAL_TO_OBJECT(lval)) &&                                    \
         OBJECT_IS_XML(cx, obj2)) ||                                          \
        (rtmp == JSVAL_OBJECT &&                                              \
         (obj2 = JSVAL_TO_OBJECT(rval)) &&                                    \
         OBJECT_IS_XML(cx, obj2))) {                                          \
        JSXMLObjectOps *ops;                                                  \
                                                                              \
        ops = (JSXMLObjectOps *) obj2->map->ops;                              \
        if (obj2 == JSVAL_TO_OBJECT(rval))                                    \
            rval = lval;                                                      \
        SAVE_SP_AND_PC(fp);                                                   \
        ok = ops->equality(cx, obj2, rval, &cond);                            \
        if (!ok)                                                              \
            goto out;                                                         \
        cond = cond OP JS_TRUE;                                               \
    } else

#define EXTENDED_EQUALITY_OP(OP)                                              \
    if (ltmp == JSVAL_OBJECT &&                                               \
        (obj2 = JSVAL_TO_OBJECT(lval)) &&                                     \
        ((clasp = OBJ_GET_CLASS(cx, obj2))->flags & JSCLASS_IS_EXTENDED)) {   \
        JSExtendedClass *xclasp;                                              \
                                                                              \
        xclasp = (JSExtendedClass *) clasp;                                   \
        SAVE_SP_AND_PC(fp);                                                   \
        ok = xclasp->equality(cx, obj2, rval, &cond);                         \
        if (!ok)                                                              \
            goto out;                                                         \
        cond = cond OP JS_TRUE;                                               \
    } else
#else
#define XML_EQUALITY_OP(OP)             /* nothing */
#define EXTENDED_EQUALITY_OP(OP)        /* nothing */
#endif

#define EQUALITY_OP(OP, IFNAN)                                                \
    JS_BEGIN_MACRO                                                            \
        rval = FETCH_OPND(-1);                                                \
        lval = FETCH_OPND(-2);                                                \
        ltmp = JSVAL_TAG(lval);                                               \
        rtmp = JSVAL_TAG(rval);                                               \
        XML_EQUALITY_OP(OP)                                                   \
        if (ltmp == rtmp) {                                                   \
            if (ltmp == JSVAL_STRING) {                                       \
                str  = JSVAL_TO_STRING(lval);                                 \
                str2 = JSVAL_TO_STRING(rval);                                 \
                cond = js_EqualStrings(str, str2) OP JS_TRUE;                 \
            } else if (ltmp == JSVAL_DOUBLE) {                                \
                d  = *JSVAL_TO_DOUBLE(lval);                                  \
                d2 = *JSVAL_TO_DOUBLE(rval);                                  \
                cond = JSDOUBLE_COMPARE(d, OP, d2, IFNAN);                    \
            } else {                                                          \
                EXTENDED_EQUALITY_OP(OP)                                      \
                /* Handle all undefined (=>NaN) and int combinations. */      \
                cond = lval OP rval;                                          \
            }                                                                 \
        } else {                                                              \
            if (JSVAL_IS_NULL(lval) || JSVAL_IS_VOID(lval)) {                 \
                cond = (JSVAL_IS_NULL(rval) || JSVAL_IS_VOID(rval)) OP 1;     \
            } else if (JSVAL_IS_NULL(rval) || JSVAL_IS_VOID(rval)) {          \
                cond = 1 OP 0;                                                \
            } else {                                                          \
                if (ltmp == JSVAL_OBJECT) {                                   \
                    DEFAULT_VALUE(cx, -2, JSTYPE_VOID, lval);                 \
                    ltmp = JSVAL_TAG(lval);                                   \
                } else if (rtmp == JSVAL_OBJECT) {                            \
                    DEFAULT_VALUE(cx, -1, JSTYPE_VOID, rval);                 \
                    rtmp = JSVAL_TAG(rval);                                   \
                }                                                             \
                if (ltmp == JSVAL_STRING && rtmp == JSVAL_STRING) {           \
                    str  = JSVAL_TO_STRING(lval);                             \
                    str2 = JSVAL_TO_STRING(rval);                             \
                    cond = js_EqualStrings(str, str2) OP JS_TRUE;             \
                } else {                                                      \
                    VALUE_TO_NUMBER(cx, lval, d);                             \
                    VALUE_TO_NUMBER(cx, rval, d2);                            \
                    cond = JSDOUBLE_COMPARE(d, OP, d2, IFNAN);                \
                }                                                             \
            }                                                                 \
        }                                                                     \
        sp--;                                                                 \
        STORE_OPND(-1, BOOLEAN_TO_JSVAL(cond));                               \
    JS_END_MACRO

          BEGIN_CASE(JSOP_EQ)
            EQUALITY_OP(==, JS_FALSE);
          END_CASE(JSOP_EQ)

          BEGIN_CASE(JSOP_NE)
            EQUALITY_OP(!=, JS_TRUE);
          END_CASE(JSOP_NE)

#define STRICT_EQUALITY_OP(OP)                                                \
    JS_BEGIN_MACRO                                                            \
        rval = FETCH_OPND(-1);                                                \
        lval = FETCH_OPND(-2);                                                \
        cond = js_StrictlyEqual(cx, lval, rval) OP JS_TRUE;                   \
        sp--;                                                                 \
        STORE_OPND(-1, BOOLEAN_TO_JSVAL(cond));                               \
    JS_END_MACRO

          BEGIN_CASE(JSOP_STRICTEQ)
            STRICT_EQUALITY_OP(==);
          END_CASE(JSOP_STRICTEQ)

          BEGIN_CASE(JSOP_STRICTNE)
            STRICT_EQUALITY_OP(!=);
          END_CASE(JSOP_STRICTNE)

          BEGIN_CASE(JSOP_CASE)
            pc2 = (jsbytecode *) sp[-2-depth];
            STRICT_EQUALITY_OP(==);
            (void) POP();
            if (cond) {
                len = GET_JUMP_OFFSET(pc);
                CHECK_BRANCH(len);
                DO_NEXT_OP(len);
            }
            sp[-depth] = (jsval)pc2;
            PUSH(lval);
          END_CASE(JSOP_CASE)

          BEGIN_CASE(JSOP_CASEX)
            pc2 = (jsbytecode *) sp[-2-depth];
            STRICT_EQUALITY_OP(==);
            (void) POP();
            if (cond) {
                len = GET_JUMPX_OFFSET(pc);
                CHECK_BRANCH(len);
                DO_NEXT_OP(len);
            }
            sp[-depth] = (jsval)pc2;
            PUSH(lval);
          END_CASE(JSOP_CASEX)

          BEGIN_CASE(JSOP_LT)
            RELATIONAL_OP(<);
          END_CASE(JSOP_LT)

          BEGIN_CASE(JSOP_LE)
            RELATIONAL_OP(<=);
          END_CASE(JSOP_LE)

          BEGIN_CASE(JSOP_GT)
            RELATIONAL_OP(>);
          END_CASE(JSOP_GT)

          BEGIN_CASE(JSOP_GE)
            RELATIONAL_OP(>=);
          END_CASE(JSOP_GE)

#undef EQUALITY_OP
#undef RELATIONAL_OP

          BEGIN_CASE(JSOP_LSH)
            SIGNED_SHIFT_OP(<<);
          END_CASE(JSOP_LSH)

          BEGIN_CASE(JSOP_RSH)
            SIGNED_SHIFT_OP(>>);
          END_CASE(JSOP_RSH)

          BEGIN_CASE(JSOP_URSH)
          {
            uint32 u;

            FETCH_UINT(cx, -2, u);
            FETCH_INT(cx, -1, j);
            u >>= j & 31;
            sp--;
            STORE_UINT(cx, -1, u);
          }
          END_CASE(JSOP_URSH)

#undef INTEGER_OP
#undef BITWISE_OP
#undef SIGNED_SHIFT_OP

          BEGIN_CASE(JSOP_ADD)
            rval = FETCH_OPND(-1);
            lval = FETCH_OPND(-2);
#if JS_HAS_XML_SUPPORT
            if (!JSVAL_IS_PRIMITIVE(lval) &&
                (obj2 = JSVAL_TO_OBJECT(lval), OBJECT_IS_XML(cx, obj2)) &&
                VALUE_IS_XML(cx, rval)) {
                JSXMLObjectOps *ops;

                ops = (JSXMLObjectOps *) obj2->map->ops;
                SAVE_SP_AND_PC(fp);
                ok = ops->concatenate(cx, obj2, rval, &rval);
                if (!ok)
                    goto out;
                sp--;
                STORE_OPND(-1, rval);
            } else
#endif
            {
                if (!JSVAL_IS_PRIMITIVE(lval))
                    DEFAULT_VALUE(cx, -2, JSTYPE_VOID, lval);
                if (!JSVAL_IS_PRIMITIVE(rval))
                    DEFAULT_VALUE(cx, -1, JSTYPE_VOID, rval);
                if ((cond = JSVAL_IS_STRING(lval)) || JSVAL_IS_STRING(rval)) {
                    SAVE_SP_AND_PC(fp);
                    if (cond) {
                        str = JSVAL_TO_STRING(lval);
                        ok = (str2 = js_ValueToString(cx, rval)) != NULL;
                        if (!ok)
                            goto out;
                        sp[-1] = STRING_TO_JSVAL(str2);
                    } else {
                        str2 = JSVAL_TO_STRING(rval);
                        ok = (str = js_ValueToString(cx, lval)) != NULL;
                        if (!ok)
                            goto out;
                        sp[-2] = STRING_TO_JSVAL(str);
                    }
                    str = js_ConcatStrings(cx, str, str2);
                    if (!str) {
                        ok = JS_FALSE;
                        goto out;
                    }
                    sp--;
                    STORE_OPND(-1, STRING_TO_JSVAL(str));
                } else {
                    VALUE_TO_NUMBER(cx, lval, d);
                    VALUE_TO_NUMBER(cx, rval, d2);
                    d += d2;
                    sp--;
                    STORE_NUMBER(cx, -1, d);
                }
            }
          END_CASE(JSOP_ADD)

#define BINARY_OP(OP)                                                         \
    JS_BEGIN_MACRO                                                            \
        FETCH_NUMBER(cx, -1, d2);                                             \
        FETCH_NUMBER(cx, -2, d);                                              \
        d = d OP d2;                                                          \
        sp--;                                                                 \
        STORE_NUMBER(cx, -1, d);                                              \
    JS_END_MACRO

          BEGIN_CASE(JSOP_SUB)
            BINARY_OP(-);
          END_CASE(JSOP_SUB)

          BEGIN_CASE(JSOP_MUL)
            BINARY_OP(*);
          END_CASE(JSOP_MUL)

          BEGIN_CASE(JSOP_DIV)
            FETCH_NUMBER(cx, -1, d2);
            FETCH_NUMBER(cx, -2, d);
            sp--;
            if (d2 == 0) {
#ifdef XP_WIN
                /* XXX MSVC miscompiles such that (NaN == 0) */
                if (JSDOUBLE_IS_NaN(d2))
                    rval = DOUBLE_TO_JSVAL(rt->jsNaN);
                else
#endif
                if (d == 0 || JSDOUBLE_IS_NaN(d))
                    rval = DOUBLE_TO_JSVAL(rt->jsNaN);
                else if ((JSDOUBLE_HI32(d) ^ JSDOUBLE_HI32(d2)) >> 31)
                    rval = DOUBLE_TO_JSVAL(rt->jsNegativeInfinity);
                else
                    rval = DOUBLE_TO_JSVAL(rt->jsPositiveInfinity);
                STORE_OPND(-1, rval);
            } else {
                d /= d2;
                STORE_NUMBER(cx, -1, d);
            }
          END_CASE(JSOP_DIV)

          BEGIN_CASE(JSOP_MOD)
            FETCH_NUMBER(cx, -1, d2);
            FETCH_NUMBER(cx, -2, d);
            sp--;
            if (d2 == 0) {
                STORE_OPND(-1, DOUBLE_TO_JSVAL(rt->jsNaN));
            } else {
#ifdef XP_WIN
              /* Workaround MS fmod bug where 42 % (1/0) => NaN, not 42. */
              if (!(JSDOUBLE_IS_FINITE(d) && JSDOUBLE_IS_INFINITE(d2)))
#endif
                d = fmod(d, d2);
                STORE_NUMBER(cx, -1, d);
            }
          END_CASE(JSOP_MOD)

          BEGIN_CASE(JSOP_NOT)
            POP_BOOLEAN(cx, rval, cond);
            PUSH_OPND(BOOLEAN_TO_JSVAL(!cond));
          END_CASE(JSOP_NOT)

          BEGIN_CASE(JSOP_BITNOT)
            FETCH_INT(cx, -1, i);
            i = ~i;
            STORE_INT(cx, -1, i);
          END_CASE(JSOP_BITNOT)

          BEGIN_CASE(JSOP_NEG)
            /*
             * Optimize the case of an int-tagged operand by noting that
             * INT_FITS_IN_JSVAL(i) => INT_FITS_IN_JSVAL(-i) unless i is 0
             * when -i is the negative zero which is jsdouble.
             */
            rval = FETCH_OPND(-1);
            if (JSVAL_IS_INT(rval) && (i = JSVAL_TO_INT(rval)) != 0) {
                i = -i;
                JS_ASSERT(INT_FITS_IN_JSVAL(i));
                rval = INT_TO_JSVAL(i);
            } else {
                if (JSVAL_IS_DOUBLE(rval)) {
                    d = *JSVAL_TO_DOUBLE(rval);
                } else {
                    SAVE_SP_AND_PC(fp);
                    ok = js_ValueToNumber(cx, rval, &d);
                    if (!ok)
                        goto out;
                }
#ifdef HPUX
                /*
                 * Negation of a zero doesn't produce a negative
                 * zero on HPUX. Perform the operation by bit
                 * twiddling.
                 */
                JSDOUBLE_HI32(d) ^= JSDOUBLE_HI32_SIGNBIT;
#else
                d = -d;
#endif
                ok = js_NewNumberValue(cx, d, &rval);
                if (!ok)
                    goto out;
            }
            STORE_OPND(-1, rval);
          END_CASE(JSOP_NEG)

          BEGIN_CASE(JSOP_POS)
            rval = FETCH_OPND(-1);
            if (!JSVAL_IS_NUMBER(rval)) {
                SAVE_SP_AND_PC(fp);
                ok = js_ValueToNumber(cx, rval, &d);
                if (!ok)
                    goto out;
                ok = js_NewNumberValue(cx, d, &rval);
                if (!ok)
                    goto out;
                sp[-1] = rval;
            }
            sp[-1-depth] = (jsval)pc;
          END_CASE(JSOP_POS)

          BEGIN_CASE(JSOP_NEW)
            /* Get immediate argc and find the constructor function. */
            argc = GET_ARGC(pc);
            SAVE_SP_AND_PC(fp);
            vp = sp - (2 + argc);
            JS_ASSERT(vp >= fp->spbase);

            ok = js_InvokeConstructor(cx, vp, argc);
            if (!ok)
                goto out;
            sp = vp + 1;
            vp[-depth] = (jsval)pc;
            LOAD_INTERRUPT_HANDLER(cx);
          END_CASE(JSOP_NEW)

          BEGIN_CASE(JSOP_DELNAME)
            LOAD_ATOM(0);
            id = ATOM_TO_JSID(atom);

            SAVE_SP_AND_PC(fp);
            ok = js_FindProperty(cx, id, &obj, &obj2, &prop);
            if (!ok)
                goto out;

            /* ECMA says to return true if name is undefined or inherited. */
            rval = JSVAL_TRUE;
            if (prop) {
                OBJ_DROP_PROPERTY(cx, obj2, prop);
                ok = OBJ_DELETE_PROPERTY(cx, obj, id, &rval);
                if (!ok)
                    goto out;
            }
            PUSH_OPND(rval);
          END_CASE(JSOP_DELNAME)

          BEGIN_CASE(JSOP_DELPROP)
            LOAD_ATOM(0);
            id = ATOM_TO_JSID(atom);
            PROPERTY_OP(-1, ok = OBJ_DELETE_PROPERTY(cx, obj, id, &rval));
            STORE_OPND(-1, rval);
          END_CASE(JSOP_DELPROP)

          BEGIN_CASE(JSOP_DELELEM)
            ELEMENT_OP(-1, ok = OBJ_DELETE_PROPERTY(cx, obj, id, &rval));
            sp--;
            STORE_OPND(-1, rval);
          END_CASE(JSOP_DELELEM)

          BEGIN_CASE(JSOP_TYPEOFEXPR)
          BEGIN_CASE(JSOP_TYPEOF)
            rval = FETCH_OPND(-1);
            SAVE_SP_AND_PC(fp);
            type = JS_TypeOfValue(cx, rval);
            atom = rt->atomState.typeAtoms[type];
            STORE_OPND(-1, ATOM_KEY(atom));
          END_CASE(JSOP_TYPEOF)

          BEGIN_CASE(JSOP_VOID)
            (void) POP_OPND();
            PUSH_OPND(JSVAL_VOID);
          END_CASE(JSOP_VOID)

          BEGIN_CASE(JSOP_INCELEM)
          BEGIN_CASE(JSOP_DECELEM)
          BEGIN_CASE(JSOP_ELEMINC)
          BEGIN_CASE(JSOP_ELEMDEC)
            /*
             * Delay fetching of id until we have the object to ensure
             * the proper evaluation order. See bug 372331.
             */
            id = 0;
            i = -2;
            goto fetch_incop_obj;

          BEGIN_CASE(JSOP_INCPROP)
          BEGIN_CASE(JSOP_DECPROP)
          BEGIN_CASE(JSOP_PROPINC)
          BEGIN_CASE(JSOP_PROPDEC)
            LOAD_ATOM(0);
            id = ATOM_TO_JSID(atom);
            i = -1;

          fetch_incop_obj:
            SAVE_SP_AND_PC(fp);
            FETCH_OBJECT(cx, i, lval, obj);
            STORE_OPND(i, OBJECT_TO_JSVAL(obj));
            if (id == 0)
                FETCH_ELEMENT_ID(obj, -1, id);
            goto do_incop;

          BEGIN_CASE(JSOP_INCNAME)
          BEGIN_CASE(JSOP_DECNAME)
          BEGIN_CASE(JSOP_NAMEINC)
          BEGIN_CASE(JSOP_NAMEDEC)
            LOAD_ATOM(0);
            id = ATOM_TO_JSID(atom);

            SAVE_SP_AND_PC(fp);
            ok = js_FindProperty(cx, id, &obj, &obj2, &prop);
            if (!ok)
                goto out;
            if (!prop)
                goto atom_not_defined;

            OBJ_DROP_PROPERTY(cx, obj2, prop);
            lval = OBJECT_TO_JSVAL(obj);
            i = 0;

          do_incop:
          {
            const JSCodeSpec *cs;

            /* The operand must contain a number. */
            ok = OBJ_GET_PROPERTY(cx, obj, id, &rval);
            if (!ok)
                goto out;

            /* Preload for use in the if/else immediately below. */
            cs = &js_CodeSpec[op];

            /* The expression result goes in rtmp, the updated value in rval. */
            if (JSVAL_IS_INT(rval) &&
                rval != INT_TO_JSVAL(JSVAL_INT_MIN) &&
                rval != INT_TO_JSVAL(JSVAL_INT_MAX)) {
                if (cs->format & JOF_POST) {
                    rtmp = rval;
                    (cs->format & JOF_INC) ? (rval += 2) : (rval -= 2);
                } else {
                    (cs->format & JOF_INC) ? (rval += 2) : (rval -= 2);
                    rtmp = rval;
                }
            } else {

/*
 * Initially, rval contains the value to increment or decrement, which is not
 * yet converted.  As above, the expression result goes in rtmp, the updated
 * value goes in rval.  Our caller must set vp to point at a GC-rooted jsval
 * in which we home rtmp, to protect it from GC in case the unconverted rval
 * is not a number.
 */
#define NONINT_INCREMENT_OP_MIDDLE()                                          \
    JS_BEGIN_MACRO                                                            \
        VALUE_TO_NUMBER(cx, rval, d);                                         \
        if (cs->format & JOF_POST) {                                          \
            rtmp = rval;                                                      \
            if (!JSVAL_IS_NUMBER(rtmp)) {                                     \
                ok = js_NewNumberValue(cx, d, &rtmp);                         \
                if (!ok)                                                      \
                    goto out;                                                 \
            }                                                                 \
            *vp = rtmp;                                                       \
            (cs->format & JOF_INC) ? d++ : d--;                               \
            ok = js_NewNumberValue(cx, d, &rval);                             \
        } else {                                                              \
            (cs->format & JOF_INC) ? ++d : --d;                               \
            ok = js_NewNumberValue(cx, d, &rval);                             \
            rtmp = rval;                                                      \
        }                                                                     \
        if (!ok)                                                              \
            goto out;                                                         \
    JS_END_MACRO

                if (cs->format & JOF_POST) {
                    /*
                     * We must push early to protect the postfix increment
                     * or decrement result, if converted to a jsdouble from
                     * a non-number value, from GC nesting in the setter.
                     */
                    vp = sp;
                    PUSH(JSVAL_VOID);
                    SAVE_SP(fp);
                    --i;
                }
#ifdef __GNUC__
                else vp = NULL; /* suppress bogus gcc warnings */
#endif

                NONINT_INCREMENT_OP_MIDDLE();
            }

            fp->flags |= JSFRAME_ASSIGNING;
            ok = OBJ_SET_PROPERTY(cx, obj, id, &rval);
            fp->flags &= ~JSFRAME_ASSIGNING;
            if (!ok)
                goto out;
            sp += i;
            PUSH_OPND(rtmp);
            len = js_CodeSpec[op].length;
            DO_NEXT_OP(len);
          }

/* NB: This macro doesn't use JS_BEGIN_MACRO/JS_END_MACRO around its body. */
#define FAST_INCREMENT_OP(SLOT,COUNT,BASE,PRE,OPEQ,MINMAX)                    \
    slot = SLOT;                                                              \
    JS_ASSERT(slot < fp->fun->COUNT);                                         \
    METER_SLOT_OP(op, slot);                                                  \
    vp = fp->BASE + slot;                                                     \
    rval = *vp;                                                               \
    if (!JSVAL_IS_INT(rval) || rval == INT_TO_JSVAL(JSVAL_INT_##MINMAX))      \
        goto do_nonint_fast_incop;                                            \
    PRE = rval;                                                               \
    rval OPEQ 2;                                                              \
    *vp = rval;                                                               \
    PUSH_OPND(PRE);                                                           \
    goto end_nonint_fast_incop

          BEGIN_CASE(JSOP_INCARG)
            FAST_INCREMENT_OP(GET_ARGNO(pc), nargs, argv, rval, +=, MAX);
          BEGIN_CASE(JSOP_DECARG)
            FAST_INCREMENT_OP(GET_ARGNO(pc), nargs, argv, rval, -=, MIN);
          BEGIN_CASE(JSOP_ARGINC)
            FAST_INCREMENT_OP(GET_ARGNO(pc), nargs, argv, rtmp, +=, MAX);
          BEGIN_CASE(JSOP_ARGDEC)
            FAST_INCREMENT_OP(GET_ARGNO(pc), nargs, argv, rtmp, -=, MIN);

          BEGIN_CASE(JSOP_INCVAR)
            FAST_INCREMENT_OP(GET_VARNO(pc), u.i.nvars, vars, rval, +=, MAX);
          BEGIN_CASE(JSOP_DECVAR)
            FAST_INCREMENT_OP(GET_VARNO(pc), u.i.nvars, vars, rval, -=, MIN);
          BEGIN_CASE(JSOP_VARINC)
            FAST_INCREMENT_OP(GET_VARNO(pc), u.i.nvars, vars, rtmp, +=, MAX);
          BEGIN_CASE(JSOP_VARDEC)
            FAST_INCREMENT_OP(GET_VARNO(pc), u.i.nvars, vars, rtmp, -=, MIN);

          end_nonint_fast_incop:
            len = JSOP_INCARG_LENGTH;   /* all fast incops are same length */
            DO_NEXT_OP(len);

#undef FAST_INCREMENT_OP

          do_nonint_fast_incop:
          {
            const JSCodeSpec *cs = &js_CodeSpec[op];

            NONINT_INCREMENT_OP_MIDDLE();
            *vp = rval;
            PUSH_OPND(rtmp);
            len = cs->length;
            DO_NEXT_OP(len);
          }

/* NB: This macro doesn't use JS_BEGIN_MACRO/JS_END_MACRO around its body. */
#define FAST_GLOBAL_INCREMENT_OP(SLOWOP,PRE,OPEQ,MINMAX)                      \
    slot = GET_VARNO(pc);                                                     \
    JS_ASSERT(slot < fp->nvars);                                              \
    METER_SLOT_OP(op, slot);                                                  \
    lval = fp->vars[slot];                                                    \
    if (JSVAL_IS_NULL(lval)) {                                                \
        op = SLOWOP;                                                          \
        DO_OP();                                                              \
    }                                                                         \
    slot = JSVAL_TO_INT(lval);                                                \
    obj = fp->varobj;                                                         \
    rval = OBJ_GET_SLOT(cx, obj, slot);                                       \
    if (!JSVAL_IS_INT(rval) || rval == INT_TO_JSVAL(JSVAL_INT_##MINMAX))      \
        goto do_nonint_fast_global_incop;                                     \
    PRE = rval;                                                               \
    rval OPEQ 2;                                                              \
    OBJ_SET_SLOT(cx, obj, slot, rval);                                        \
    PUSH_OPND(PRE);                                                           \
    goto end_nonint_fast_global_incop

          BEGIN_CASE(JSOP_INCGVAR)
            FAST_GLOBAL_INCREMENT_OP(JSOP_INCNAME, rval, +=, MAX);
          BEGIN_CASE(JSOP_DECGVAR)
            FAST_GLOBAL_INCREMENT_OP(JSOP_DECNAME, rval, -=, MIN);
          BEGIN_CASE(JSOP_GVARINC)
            FAST_GLOBAL_INCREMENT_OP(JSOP_NAMEINC, rtmp, +=, MAX);
          BEGIN_CASE(JSOP_GVARDEC)
            FAST_GLOBAL_INCREMENT_OP(JSOP_NAMEDEC, rtmp, -=, MIN);

          end_nonint_fast_global_incop:
            len = JSOP_INCGVAR_LENGTH;  /* all gvar incops are same length */
            JS_ASSERT(len == js_CodeSpec[op].length);
            DO_NEXT_OP(len);

#undef FAST_GLOBAL_INCREMENT_OP

          do_nonint_fast_global_incop:
          {
            const JSCodeSpec *cs = &js_CodeSpec[op];

            vp = sp++;
            SAVE_SP(fp);
            NONINT_INCREMENT_OP_MIDDLE();
            OBJ_SET_SLOT(cx, obj, slot, rval);
            STORE_OPND(-1, rtmp);
            len = cs->length;
            DO_NEXT_OP(len);
          }

          BEGIN_CASE(JSOP_GETTHISPROP)
            LOAD_ATOM(0);
            id = ATOM_TO_JSID(atom);
            obj = fp->thisp;
            SAVE_SP_AND_PC(fp);
            ok = OBJ_GET_PROPERTY(cx, obj, id, &rval);
            if (!ok)
                goto out;
            PUSH_OPND(rval);
          END_CASE(JSOP_GETTHISPROP)

          BEGIN_CASE(JSOP_GETARGPROP)
            LOAD_ATOM(ARGNO_LEN);
            slot = GET_ARGNO(pc);
            JS_ASSERT(slot < fp->fun->nargs);
            PUSH_OPND(fp->argv[slot]);
            len = JSOP_GETARGPROP_LENGTH;
            goto do_getprop_body;

          BEGIN_CASE(JSOP_GETVARPROP)
            LOAD_ATOM(VARNO_LEN);
            slot = GET_VARNO(pc);
            JS_ASSERT(slot < fp->fun->u.i.nvars);
            PUSH_OPND(fp->vars[slot]);
            len = JSOP_GETVARPROP_LENGTH;
            goto do_getprop_body;

          BEGIN_CASE(JSOP_GETLOCALPROP)
            LOAD_ATOM(2);
            slot = GET_UINT16(pc);
            JS_ASSERT(slot < (uintN)depth);
            PUSH_OPND(fp->spbase[slot]);
            len = JSOP_GETLOCALPROP_LENGTH;
            goto do_getprop_body;

          BEGIN_CASE(JSOP_GETPROP)
          BEGIN_CASE(JSOP_GETXPROP)
            /* Get an immediate atom naming the property. */
            LOAD_ATOM(0);
            len = JSOP_GETPROP_LENGTH;

          do_getprop_body:
            lval = FETCH_OPND(-1);
            if (JSVAL_IS_STRING(lval) && atom == rt->atomState.lengthAtom) {
                str = JSVAL_TO_STRING(lval);
                rval = INT_TO_JSVAL(JSSTRING_LENGTH(str));
            } else {
                id = ATOM_TO_JSID(atom);
                SAVE_SP_AND_PC(fp);
                VALUE_TO_OBJECT(cx, -1, lval, obj);
                ok = OBJ_GET_PROPERTY(cx, obj, id, &rval);
                if (!ok)
                    goto out;
            }
            STORE_OPND(-1, rval);
          END_VARLEN_CASE

          BEGIN_CASE(JSOP_CALLPROP)
            /* Get an immediate atom naming the property. */
            LOAD_ATOM(0);
            id = ATOM_TO_JSID(atom);
            PUSH(JSVAL_NULL);
            SAVE_SP_AND_PC(fp);
            lval = FETCH_OPND(-2);
            if (!JSVAL_IS_PRIMITIVE(lval)) {
                obj = JSVAL_TO_OBJECT(lval);

#if JS_HAS_XML_SUPPORT
                /* Special-case XML object method lookup, per ECMA-357. */
                if (OBJECT_IS_XML(cx, obj)) {
                    JSXMLObjectOps *ops;

                    ops = (JSXMLObjectOps *) obj->map->ops;
                    obj = ops->getMethod(cx, obj, id, &rval);
                    if (!obj)
                        ok = JS_FALSE;
                } else
#endif
                {
                    ok = OBJ_GET_PROPERTY(cx, obj, id, &rval);
                }
                if (!ok)
                    goto out;
                STORE_OPND(-1, OBJECT_TO_JSVAL(obj));
                STORE_OPND(-2, rval);
                ok = ComputeThis(cx, sp);
                if (!ok)
                    goto out;
            } else {
                if (JSVAL_IS_STRING(lval)) {
                    i = JSProto_String;
                } else if (JSVAL_IS_NUMBER(lval)) {
                    i = JSProto_Number;
                } else if (JSVAL_IS_BOOLEAN(lval)) {
                    i = JSProto_Boolean;
                } else {
                    JS_ASSERT(JSVAL_IS_NULL(lval) || JSVAL_IS_VOID(lval));
                    js_ReportIsNullOrUndefined(cx, -2, lval, NULL);
                    ok = JS_FALSE;
                    goto out;
                }

                ok = js_GetClassPrototype(cx, NULL, INT_TO_JSID(i), &obj);
                if (!ok)
                    goto out;
                JS_ASSERT(obj);
                ok = OBJ_GET_PROPERTY(cx, obj, id, &rval);
                if (!ok)
                    goto out;
                STORE_OPND(-1, lval);
                STORE_OPND(-2, rval);

                /* Wrap primitive lval in object clothing if necessary. */
                if (!VALUE_IS_FUNCTION(cx, rval) ||
                    (obj = JSVAL_TO_OBJECT(rval),
                     fun = GET_FUNCTION_PRIVATE(cx, obj),
                     !PRIMITIVE_THIS_TEST(fun, lval))) {
                    ok = js_PrimitiveToObject(cx, &sp[-1]);
                    if (!ok)
                        goto out;
                }
            }
          END_CASE(JSOP_CALLPROP)

          BEGIN_CASE(JSOP_SETPROP)
            /* Get an immediate atom naming the property. */
            LOAD_ATOM(0);
            id = ATOM_TO_JSID(atom);

            /* Pop the right-hand side into rval for OBJ_SET_PROPERTY. */
            rval = FETCH_OPND(-1);
            PROPERTY_OP(-2, ok = OBJ_SET_PROPERTY(cx, obj, id, &rval));
            sp--;
            STORE_OPND(-1, rval);
          END_CASE(JSOP_SETPROP)

          BEGIN_CASE(JSOP_GETELEM)
            ELEMENT_OP(-1, ok = OBJ_GET_PROPERTY(cx, obj, id, &rval));
            sp--;
            STORE_OPND(-1, rval);
          END_CASE(JSOP_GETELEM)

          BEGIN_CASE(JSOP_CALLELEM)
            /*
             * FIXME: JSOP_CALLELEM should call getMethod on XML objects as
             * CALLPROP does. See bug 362910.
             */
            ELEMENT_OP(-1, ok = OBJ_GET_PROPERTY(cx, obj, id, &rval));
            STORE_OPND(-2, rval);
            STORE_OPND(-1, OBJECT_TO_JSVAL(obj));
          END_CASE(JSOP_CALLELEM)

          BEGIN_CASE(JSOP_SETELEM)
            rval = FETCH_OPND(-1);
            ELEMENT_OP(-2, ok = OBJ_SET_PROPERTY(cx, obj, id, &rval));
            sp -= 2;
            STORE_OPND(-1, rval);
          END_CASE(JSOP_SETELEM)

          BEGIN_CASE(JSOP_ENUMELEM)
            /* Funky: the value to set is under the [obj, id] pair. */
            rval = FETCH_OPND(-3);
            SAVE_SP_AND_PC(fp);
            FETCH_OBJECT(cx, -2, lval, obj);
            FETCH_ELEMENT_ID(obj, -1, id);
            ok = OBJ_SET_PROPERTY(cx, obj, id, &rval);
            if (!ok)
                goto out;
            sp -= 3;
          END_CASE(JSOP_ENUMELEM)

          BEGIN_CASE(JSOP_CALL)
          BEGIN_CASE(JSOP_EVAL)
            argc = GET_ARGC(pc);
            vp = sp - (argc + 2);
            lval = *vp;
            SAVE_SP_AND_PC(fp);
            if (VALUE_IS_FUNCTION(cx, lval)) {
                obj = JSVAL_TO_OBJECT(lval);
                fun = GET_FUNCTION_PRIVATE(cx, obj);

                if (FUN_INTERPRETED(fun)) {
                    uintN nframeslots, nvars, nslots, missing;
                    JSArena *a;
                    jsuword avail, nbytes;
                    JSBool overflow;
                    void *newmark;
                    jsval *rvp;
                    JSInlineFrame *newifp;
                    JSInterpreterHook hook;

                    /* Compute the total number of stack slots needed by fun. */
                    nframeslots = JS_HOWMANY(sizeof(JSInlineFrame),
                                             sizeof(jsval));
                    nvars = fun->u.i.nvars;
                    script = fun->u.i.script;
                    depth = (jsint) script->depth;
                    atoms = script->atomMap.vector;
                    nslots = nframeslots + nvars + 2 * depth;

                    /* Allocate missing expected args adjacent to actuals. */
                    missing = (fun->nargs > argc) ? fun->nargs - argc : 0;
                    a = cx->stackPool.current;
                    avail = a->avail;
                    newmark = (void *) avail;
                    if (missing) {
                        newsp = sp + missing;
                        overflow = (jsuword) newsp > a->limit;
                        if (overflow)
                            nslots += 2 + argc + missing;
                        else if ((jsuword) newsp > avail)
                            avail = a->avail = (jsuword) newsp;
                    }
#ifdef __GNUC__
                    else overflow = JS_FALSE; /* suppress bogus gcc warnings */
#endif

                    /* Allocate the inline frame with its vars and operands. */
                    newsp = (jsval *) avail;
                    nbytes = nslots * sizeof(jsval);
                    avail += nbytes;
                    if (avail <= a->limit) {
                        a->avail = avail;
                    } else {
                        JS_ARENA_ALLOCATE_CAST(newsp, jsval *, &cx->stackPool,
                                               nbytes);
                        if (!newsp) {
                            js_ReportOutOfScriptQuota(cx);
                            goto bad_inline_call;
                        }
                    }

                    /*
                     * Move args if missing overflow arena a, then push any
                     * missing args.
                     */
                    rvp = vp;
                    if (missing) {
                        if (overflow) {
                            memcpy(newsp, vp, (2 + argc) * sizeof(jsval));
                            vp = newsp;
                            sp = vp + 2 + argc;
                            newsp = sp + missing;
                        }
                        do {
                            PUSH(JSVAL_VOID);
                        } while (--missing != 0);
                    }

                    /* Claim space for the stack frame and initialize it. */
                    newifp = (JSInlineFrame *) newsp;
                    newsp += nframeslots;
                    newifp->frame.callobj = NULL;
                    newifp->frame.argsobj = NULL;
                    newifp->frame.varobj = NULL;
                    newifp->frame.script = script;
                    newifp->frame.callee = obj;
                    newifp->frame.fun = fun;
                    newifp->frame.argc = argc;
                    newifp->frame.argv = vp + 2;
                    newifp->frame.rval = JSVAL_VOID;
                    newifp->frame.nvars = nvars;
                    newifp->frame.vars = newsp;
                    newifp->frame.down = fp;
                    newifp->frame.annotation = NULL;
                    newifp->frame.scopeChain = parent = OBJ_GET_PARENT(cx, obj);
                    newifp->frame.sharpDepth = 0;
                    newifp->frame.sharpArray = NULL;
                    newifp->frame.flags = 0;
                    newifp->frame.dormantNext = NULL;
                    newifp->frame.xmlNamespace = NULL;
                    newifp->frame.blockChain = NULL;
                    newifp->rvp = rvp;
                    newifp->mark = newmark;

                    /* Compute the 'this' parameter now that argv is set. */
                    JS_ASSERT(!JSFUN_BOUND_METHOD_TEST(fun->flags));
                    JS_ASSERT(!JSVAL_IS_PRIMITIVE(vp[1]));
                    newifp->frame.thisp = (JSObject *)vp[1];

                    /* Push void to initialize local variables. */
                    sp = newsp;
                    while (nvars--)
                        PUSH(JSVAL_VOID);
                    sp += depth;
                    newifp->frame.spbase = sp;
                    SAVE_SP(&newifp->frame);

                    /* Call the debugger hook if present. */
                    hook = cx->debugHooks->callHook;
                    if (hook) {
                        newifp->frame.pc = NULL;
                        newifp->hookData = hook(cx, &newifp->frame, JS_TRUE, 0,
                                                cx->debugHooks->callHookData);
                        LOAD_INTERRUPT_HANDLER(cx);
                    } else {
                        newifp->hookData = NULL;
                    }

                    /* Scope with a call object parented by callee's parent. */
                    if (JSFUN_HEAVYWEIGHT_TEST(fun->flags) &&
                        !js_GetCallObject(cx, &newifp->frame, parent)) {
                        goto bad_inline_call;
                    }

                    /* Switch version if currentVersion wasn't overridden. */
                    newifp->callerVersion = (JSVersion) cx->version;
                    if (JS_LIKELY(cx->version == currentVersion)) {
                        currentVersion = (JSVersion) script->version;
                        if (currentVersion != cx->version)
                            js_SetVersion(cx, currentVersion);
                    }

                    /* Push the frame and set interpreter registers. */
                    cx->fp = fp = &newifp->frame;
                    pc = script->code;
                    inlineCallCount++;
                    JS_RUNTIME_METER(rt, inlineCalls);

#ifdef INCLUDE_MOZILLA_DTRACE
                    /* DTrace function entry, inlines */
                    if (JAVASCRIPT_FUNCTION_ENTRY_ENABLED())
                        jsdtrace_function_entry(cx, fp, fun);
                    if (JAVASCRIPT_FUNCTION_INFO_ENABLED())
                        jsdtrace_function_info(cx, fp, fp->down, fun);
                    if (JAVASCRIPT_FUNCTION_ARGS_ENABLED())
                        jsdtrace_function_args(cx, fp, fun);
#endif

                    /* Load first op and dispatch it (safe since JSOP_STOP). */
                    op = (JSOp) *pc;
                    DO_OP();

                  bad_inline_call:
                    RESTORE_SP(fp);
                    JS_ASSERT(fp->pc == pc);
                    script = fp->script;
                    depth = (jsint) script->depth;
                    atoms = script->atomMap.vector;
                    js_FreeRawStack(cx, newmark);
                    ok = JS_FALSE;
                    goto out;
                }

#ifdef INCLUDE_MOZILLA_DTRACE
                /* DTrace function entry, non-inlines */
                if (VALUE_IS_FUNCTION(cx, lval)) {
                    if (JAVASCRIPT_FUNCTION_ENTRY_ENABLED())
                        jsdtrace_function_entry(cx, fp, fun);
                    if (JAVASCRIPT_FUNCTION_INFO_ENABLED())
                        jsdtrace_function_info(cx, fp, fp, fun);
                    if (JAVASCRIPT_FUNCTION_ARGS_ENABLED())
                        jsdtrace_function_args(cx, fp, fun);
                }
#endif

                if (fun->flags & JSFUN_FAST_NATIVE) {
                    JS_ASSERT(fun->u.n.extra == 0);
                    if (argc < fun->u.n.minargs) {
                        uintN nargs;

                        /*
                         * If we can't fit missing args and local roots in
                         * this frame's operand stack, take the slow path.
                         */
                        nargs = fun->u.n.minargs - argc;
                        if (sp + nargs > fp->spbase + depth)
                            goto do_invoke;
                        do {
                            /*
                             * Use PUSH_OPND to set the proper pc values for
                             * the extra arguments. The decompiler relies on
                             * this.
                             */
                            PUSH_OPND(JSVAL_VOID);
                        } while (--nargs != 0);
                        SAVE_SP(fp);
                    }

                    JS_ASSERT(!JSVAL_IS_PRIMITIVE(vp[1]) ||
                              PRIMITIVE_THIS_TEST(fun, vp[1]));

                    ok = ((JSFastNative) fun->u.n.native)(cx, argc, vp);
#ifdef INCLUDE_MOZILLA_DTRACE
                    if (VALUE_IS_FUNCTION(cx, lval)) {
                        if (JAVASCRIPT_FUNCTION_RVAL_ENABLED())
                            jsdtrace_function_rval(cx, fp, fun);
                        if (JAVASCRIPT_FUNCTION_RETURN_ENABLED())
                            jsdtrace_function_return(cx, fp, fun);
                    }
#endif
                    if (!ok)
                        goto out;
                    sp = vp + 1;
                    vp[-depth] = (jsval)pc;
                    goto end_call;
                }
            }

          do_invoke:
            ok = js_Invoke(cx, argc, vp, 0);
#ifdef INCLUDE_MOZILLA_DTRACE
            /* DTrace function return, non-inlines */
            if (VALUE_IS_FUNCTION(cx, lval)) {
                if (JAVASCRIPT_FUNCTION_RVAL_ENABLED())
                    jsdtrace_function_rval(cx, fp, fun);
                if (JAVASCRIPT_FUNCTION_RETURN_ENABLED())
                    jsdtrace_function_return(cx, fp, fun);
            }
#endif
            sp = vp + 1;
            vp[-depth] = (jsval)pc;
            LOAD_INTERRUPT_HANDLER(cx);
            if (!ok)
                goto out;
            JS_RUNTIME_METER(rt, nonInlineCalls);

          end_call:
#if JS_HAS_LVALUE_RETURN
            if (cx->rval2set) {
                /*
                 * Use the stack depth we didn't claim in our budget, but that
                 * we know is there on account of [fun, this] already having
                 * been pushed, at a minimum (if no args).  Those two slots
                 * have been popped and [rval] has been pushed, which leaves
                 * one more slot for rval2 before we might overflow.
                 *
                 * NB: rval2 must be the property identifier, and rval the
                 * object from which to get the property.  The pair form an
                 * ECMA "reference type", which can be used on the right- or
                 * left-hand side of assignment ops.  Note well: only native
                 * methods can return reference types.  See JSOP_SETCALL just
                 * below for the left-hand-side case.
                 */
                PUSH_OPND(cx->rval2);
                ELEMENT_OP(-1, ok = OBJ_GET_PROPERTY(cx, obj, id, &rval));

                sp--;
                STORE_OPND(-1, rval);
                cx->rval2set = JS_FALSE;
            }
#endif /* JS_HAS_LVALUE_RETURN */
          END_CASE(JSOP_CALL)

#if JS_HAS_LVALUE_RETURN
          BEGIN_CASE(JSOP_SETCALL)
            argc = GET_ARGC(pc);
            SAVE_SP_AND_PC(fp);
            vp = sp - argc - 2;
            ok = js_Invoke(cx, argc, vp, 0);
            sp = vp + 1;
            vp[-depth] = (jsval)pc;
            LOAD_INTERRUPT_HANDLER(cx);
            if (!ok)
                goto out;
            if (!cx->rval2set) {
                JS_ReportErrorNumber(cx, js_GetErrorMessage, NULL,
                                     JSMSG_BAD_LEFTSIDE_OF_ASS);
                ok = JS_FALSE;
                goto out;
            }
            PUSH_OPND(cx->rval2);
            cx->rval2set = JS_FALSE;
          END_CASE(JSOP_SETCALL)
#endif

          BEGIN_CASE(JSOP_NAME)
          BEGIN_CASE(JSOP_CALLNAME)
            LOAD_ATOM(0);
            id = ATOM_TO_JSID(atom);

            SAVE_SP_AND_PC(fp);
            ok = js_FindProperty(cx, id, &obj, &obj2, &prop);
            if (!ok)
                goto out;
            if (!prop) {
                /* Kludge to allow (typeof foo == "undefined") tests. */
                len = JSOP_NAME_LENGTH;
                endpc = script->code + script->length;
                for (pc2 = pc + len; pc2 < endpc; pc2++) {
                    op2 = (JSOp)*pc2;
                    if (op2 == JSOP_TYPEOF) {
                        PUSH_OPND(JSVAL_VOID);
                        DO_NEXT_OP(len);
                    }
                    if (op2 != JSOP_GROUP)
                        break;
                }
                goto atom_not_defined;
            }

            /* Take the slow path if prop was not found in a native object. */
            if (!OBJ_IS_NATIVE(obj) || !OBJ_IS_NATIVE(obj2)) {
                OBJ_DROP_PROPERTY(cx, obj2, prop);
                ok = OBJ_GET_PROPERTY(cx, obj, id, &rval);
                if (!ok)
                    goto out;
            } else {
                sprop = (JSScopeProperty *)prop;
                NATIVE_GET(cx, obj, obj2, sprop, &rval);
                OBJ_DROP_PROPERTY(cx, obj2, prop);
            }
            PUSH_OPND(rval);
            if (op == JSOP_CALLNAME) {
                PUSH_OPND(OBJECT_TO_JSVAL(obj));
                SAVE_SP(fp);
                ok = ComputeThis(cx, sp);
                if (!ok)
                    goto out;
            }
          END_CASE(JSOP_NAME)

          BEGIN_CASE(JSOP_UINT16)
            i = (jsint) GET_UINT16(pc);
            rval = INT_TO_JSVAL(i);
            PUSH_OPND(rval);
          END_CASE(JSOP_UINT16)

          BEGIN_CASE(JSOP_UINT24)
            i = (jsint) GET_UINT24(pc);
            rval = INT_TO_JSVAL(i);
            PUSH_OPND(rval);
          END_CASE(JSOP_UINT24)

          BEGIN_CASE(JSOP_INT8)
            i = GET_INT8(pc);
            rval = INT_TO_JSVAL(i);
            PUSH_OPND(rval);
          END_CASE(JSOP_INT8)

          BEGIN_CASE(JSOP_INT32)
            i = GET_INT32(pc);
            rval = INT_TO_JSVAL(i);
            PUSH_OPND(rval);
          END_CASE(JSOP_INT32)

          BEGIN_CASE(JSOP_INDEXBASE)
            /*
             * Here atoms can exceed script->atomMap.length as we use atoms
             * as a segment register for object literals as well.
             */
            atoms += GET_INDEXBASE(pc);
          END_CASE(JSOP_INDEXBASE)

          BEGIN_CASE(JSOP_INDEXBASE1)
          BEGIN_CASE(JSOP_INDEXBASE2)
          BEGIN_CASE(JSOP_INDEXBASE3)
            atoms += (op - JSOP_INDEXBASE1 + 1) << 16;
          END_CASE(JSOP_INDEXBASE3)

          BEGIN_CASE(JSOP_RESETBASE0)
          BEGIN_CASE(JSOP_RESETBASE)
            atoms = script->atomMap.vector;
          END_CASE(JSOP_RESETBASE)

          BEGIN_CASE(JSOP_DOUBLE)
          BEGIN_CASE(JSOP_STRING)
            LOAD_ATOM(0);
            PUSH_OPND(ATOM_KEY(atom));
          END_CASE(JSOP_DOUBLE)

          BEGIN_CASE(JSOP_OBJECT)
            LOAD_OBJECT(0);
            PUSH_OPND(OBJECT_TO_JSVAL(obj));
          END_CASE(JSOP_OBJECT)

          BEGIN_CASE(JSOP_REGEXP)
          {
            JSObject *funobj;

            /*
             * Push a regexp object for the atom mapped by the bytecode at pc,
             * cloning the literal's regexp object if necessary, to simulate in
             * the pre-compile/execute-later case what ECMA specifies for the
             * compile-and-go case: that scanning each regexp literal creates
             * a single corresponding RegExp object.
             *
             * To support pre-compilation transparently, we must handle the
             * case where a regexp object literal is used in a different global
             * at execution time from the global with which it was scanned at
             * compile time.  We do this by re-wrapping the JSRegExp private
             * data struct with a cloned object having the right prototype and
             * parent, and having its own lastIndex property value storage.
             *
             * Unlike JSOP_DEFFUN and other prolog bytecodes that may clone
             * literal objects, we don't want to pay a script prolog execution
             * price for all regexp literals in a script (many may not be used
             * by a particular execution of that script, depending on control
             * flow), so we initialize lazily here.
             *
             * XXX This code is specific to regular expression objects.  If we
             * need a similar op for other kinds of object literals, we should
             * push cloning down under JSObjectOps and reuse code here.
             */
            index = GET_FULL_INDEX(0);
            JS_ASSERT(index < JS_SCRIPT_REGEXPS(script)->length);

            slot = index;
            if (fp->fun) {
                /*
                 * We're in function code, not global or eval code (in eval
                 * code, JSOP_REGEXP is never emitted). The cloned funobj
                 * contains script->regexps->nregexps reserved slot for the
                 * cloned regexps, see fun_reserveSlots, jsfun.c.
                 */
                funobj = fp->callee;
                slot += JSCLASS_RESERVED_SLOTS(&js_FunctionClass);
                if (!JS_GetReservedSlot(cx, funobj, slot, &rval))
                    return JS_FALSE;
                if (JSVAL_IS_VOID(rval))
                    rval = JSVAL_NULL;
            } else {
                /*
                 * We're in global code.  The code generator already arranged
                 * via script->nregexps to reserve a global variable slot
                 * at cloneIndex.  All global variable slots are initialized
                 * to null, not void, for faster testing in JSOP_*GVAR cases.
                 */
                slot += script->ngvars;
                rval = fp->vars[slot];
#ifdef __GNUC__
                funobj = NULL;  /* suppress bogus gcc warnings */
#endif
            }

            if (JSVAL_IS_NULL(rval)) {
                /* Compute the current global object in obj2. */
                obj2 = fp->scopeChain;
                while ((parent = OBJ_GET_PARENT(cx, obj2)) != NULL)
                    obj2 = parent;

                /*
                 * We must home sp here, because either js_CloneRegExpObject
                 * or JS_SetReservedSlot could nest a last-ditch GC.  We home
                 * pc as well, in case js_CloneRegExpObject has to lookup the
                 * "RegExp" class in the global object, which could entail a
                 * JSNewResolveOp call.
                 */
                SAVE_SP_AND_PC(fp);

                /*
                 * If obj's parent is not obj2, we must clone obj so that it
                 * has the right parent, and therefore, the right prototype.
                 *
                 * Yes, this means we assume that the correct RegExp.prototype
                 * to which regexp instances (including literals) delegate can
                 * be distinguished solely by the instance's parent, which was
                 * set to the parent of the RegExp constructor function object
                 * when the instance was created.  In other words,
                 *
                 *   (/x/.__parent__ == RegExp.__parent__) implies
                 *   (/x/.__proto__ == RegExp.prototype)
                 *
                 * (unless you assign a different object to RegExp.prototype
                 * at runtime, in which case, ECMA doesn't specify operation,
                 * and you get what you deserve).
                 *
                 * This same coupling between instance parent and constructor
                 * parent turns up everywhere (see jsobj.c's FindClassObject,
                 * js_ConstructObject, and js_NewObject).  It's fundamental to
                 * the design of the language when you consider multiple global
                 * objects and separate compilation and execution, even though
                 * it is not specified fully in ECMA.
                 */
                JS_GET_SCRIPT_REGEXP(script, index, obj);
                if (OBJ_GET_PARENT(cx, obj) != obj2) {
                    obj = js_CloneRegExpObject(cx, obj, obj2);
                    if (!obj) {
                        ok = JS_FALSE;
                        goto out;
                    }
                }
                rval = OBJECT_TO_JSVAL(obj);

                /* Store the regexp object value in its cloneIndex slot. */
                if (fp->fun) {
                    if (!JS_SetReservedSlot(cx, funobj, slot, rval))
                        return JS_FALSE;
                } else {
                    fp->vars[slot] = rval;
                }
            }

            PUSH_OPND(rval);
          }
          END_CASE(JSOP_REGEXP)

          BEGIN_CASE(JSOP_ZERO)
            PUSH_OPND(JSVAL_ZERO);
          END_CASE(JSOP_ZERO)

          BEGIN_CASE(JSOP_ONE)
            PUSH_OPND(JSVAL_ONE);
          END_CASE(JSOP_ONE)

          BEGIN_CASE(JSOP_NULL)
            PUSH_OPND(JSVAL_NULL);
          END_CASE(JSOP_NULL)

          BEGIN_CASE(JSOP_THIS)
            obj = fp->thisp;
            clasp = OBJ_GET_CLASS(cx, obj);
            if (clasp->flags & JSCLASS_IS_EXTENDED) {
                JSExtendedClass *xclasp;

                xclasp = (JSExtendedClass *) clasp;
                if (xclasp->outerObject) {
                    obj = xclasp->outerObject(cx, obj);
                    if (!obj) {
                        ok = JS_FALSE;
                        goto out;
                    }
                }
            }

            PUSH_OPND(OBJECT_TO_JSVAL(obj));
          END_CASE(JSOP_THIS)

          BEGIN_CASE(JSOP_FALSE)
            PUSH_OPND(JSVAL_FALSE);
          END_CASE(JSOP_FALSE)

          BEGIN_CASE(JSOP_TRUE)
            PUSH_OPND(JSVAL_TRUE);
          END_CASE(JSOP_TRUE)

          BEGIN_CASE(JSOP_TABLESWITCH)
            pc2 = pc;
            len = GET_JUMP_OFFSET(pc2);

            /*
             * ECMAv2+ forbids conversion of discriminant, so we will skip to
             * the default case if the discriminant isn't already an int jsval.
             * (This opcode is emitted only for dense jsint-domain switches.)
             */
            rval = POP_OPND();
            if (!JSVAL_IS_INT(rval))
                DO_NEXT_OP(len);
            i = JSVAL_TO_INT(rval);

            pc2 += JUMP_OFFSET_LEN;
            low = GET_JUMP_OFFSET(pc2);
            pc2 += JUMP_OFFSET_LEN;
            high = GET_JUMP_OFFSET(pc2);

            i -= low;
            if ((jsuint)i < (jsuint)(high - low + 1)) {
                pc2 += JUMP_OFFSET_LEN + JUMP_OFFSET_LEN * i;
                off = (jsint) GET_JUMP_OFFSET(pc2);
                if (off)
                    len = off;
            }
          END_VARLEN_CASE

          BEGIN_CASE(JSOP_TABLESWITCHX)
            pc2 = pc;
            len = GET_JUMPX_OFFSET(pc2);

            /*
             * ECMAv2+ forbids conversion of discriminant, so we will skip to
             * the default case if the discriminant isn't already an int jsval.
             * (This opcode is emitted only for dense jsint-domain switches.)
             */
            rval = POP_OPND();
            if (!JSVAL_IS_INT(rval))
                DO_NEXT_OP(len);
            i = JSVAL_TO_INT(rval);

            pc2 += JUMPX_OFFSET_LEN;
            low = GET_JUMP_OFFSET(pc2);
            pc2 += JUMP_OFFSET_LEN;
            high = GET_JUMP_OFFSET(pc2);

            i -= low;
            if ((jsuint)i < (jsuint)(high - low + 1)) {
                pc2 += JUMP_OFFSET_LEN + JUMPX_OFFSET_LEN * i;
                off = (jsint) GET_JUMPX_OFFSET(pc2);
                if (off)
                    len = off;
            }
          END_VARLEN_CASE

          BEGIN_CASE(JSOP_LOOKUPSWITCHX)
            off = JUMPX_OFFSET_LEN;
            goto do_lookup_switch;

          BEGIN_CASE(JSOP_LOOKUPSWITCH)
            off = JUMP_OFFSET_LEN;

          do_lookup_switch:
            /*
             * JSOP_LOOKUPSWITCH and JSOP_LOOKUPSWITCHX are never used if
             * any atom index in it would exceed 64K limit.
             */
            JS_ASSERT(atoms == script->atomMap.vector);
            pc2 = pc;
            lval = POP_OPND();

            if (!JSVAL_IS_NUMBER(lval) &&
                !JSVAL_IS_STRING(lval) &&
                !JSVAL_IS_BOOLEAN(lval)) {
                goto end_lookup_switch;
            }

            pc2 += off;
            npairs = (jsint) GET_UINT16(pc2);
            pc2 += UINT16_LEN;
            JS_ASSERT(npairs);  /* empty switch uses JSOP_TABLESWITCH */

#define SEARCH_PAIRS(MATCH_CODE)                                              \
    for (;;) {                                                                \
        JS_ASSERT(GET_INDEX(pc2) < script->atomMap.length);                   \
        atom = atoms[GET_INDEX(pc2)];                                         \
        rval = ATOM_KEY(atom);                                                \
        MATCH_CODE                                                            \
        pc2 += INDEX_LEN;                                                     \
        if (match)                                                            \
            break;                                                            \
        pc2 += off;                                                           \
        if (--npairs == 0) {                                                  \
            pc2 = pc;                                                         \
            break;                                                            \
        }                                                                     \
    }
            if (JSVAL_IS_STRING(lval)) {
                str = JSVAL_TO_STRING(lval);
                SEARCH_PAIRS(
                    match = (JSVAL_IS_STRING(rval) &&
                             ((str2 = JSVAL_TO_STRING(rval)) == str ||
                              js_EqualStrings(str2, str)));
                )
            } else if (JSVAL_IS_DOUBLE(lval)) {
                d = *JSVAL_TO_DOUBLE(lval);
                SEARCH_PAIRS(
                    match = (JSVAL_IS_DOUBLE(rval) &&
                             *JSVAL_TO_DOUBLE(rval) == d);
                )
            } else {
                SEARCH_PAIRS(
                    match = (lval == rval);
                )
            }
#undef SEARCH_PAIRS

          end_lookup_switch:
            len = (op == JSOP_LOOKUPSWITCH)
                  ? GET_JUMP_OFFSET(pc2)
                  : GET_JUMPX_OFFSET(pc2);
          END_VARLEN_CASE

          EMPTY_CASE(JSOP_CONDSWITCH)

#if JS_HAS_EXPORT_IMPORT
          BEGIN_CASE(JSOP_EXPORTALL)
            obj = fp->varobj;
            SAVE_SP_AND_PC(fp);
            ida = JS_Enumerate(cx, obj);
            if (!ida) {
                ok = JS_FALSE;
            } else {
                for (i = 0, j = ida->length; i < j; i++) {
                    id = ida->vector[i];
                    ok = OBJ_LOOKUP_PROPERTY(cx, obj, id, &obj2, &prop);
                    if (!ok)
                        break;
                    if (!prop)
                        continue;
                    ok = OBJ_GET_ATTRIBUTES(cx, obj, id, prop, &attrs);
                    if (ok) {
                        attrs |= JSPROP_EXPORTED;
                        ok = OBJ_SET_ATTRIBUTES(cx, obj, id, prop, &attrs);
                    }
                    OBJ_DROP_PROPERTY(cx, obj2, prop);
                    if (!ok)
                        break;
                }
                JS_DestroyIdArray(cx, ida);
            }
          END_CASE(JSOP_EXPORTALL)

          BEGIN_CASE(JSOP_EXPORTNAME)
            LOAD_ATOM(0);
            id = ATOM_TO_JSID(atom);
            obj = fp->varobj;
            SAVE_SP_AND_PC(fp);
            ok = OBJ_LOOKUP_PROPERTY(cx, obj, id, &obj2, &prop);
            if (!ok)
                goto out;
            if (!prop) {
                ok = OBJ_DEFINE_PROPERTY(cx, obj, id, JSVAL_VOID, NULL, NULL,
                                         JSPROP_EXPORTED, NULL);
            } else {
                ok = OBJ_GET_ATTRIBUTES(cx, obj, id, prop, &attrs);
                if (ok) {
                    attrs |= JSPROP_EXPORTED;
                    ok = OBJ_SET_ATTRIBUTES(cx, obj, id, prop, &attrs);
                }
                OBJ_DROP_PROPERTY(cx, obj2, prop);
            }
            if (!ok)
                goto out;
          END_CASE(JSOP_EXPORTNAME)

          BEGIN_CASE(JSOP_IMPORTALL)
            id = (jsid) JSVAL_VOID;
            PROPERTY_OP(-1, ok = ImportProperty(cx, obj, id));
            sp--;
          END_CASE(JSOP_IMPORTALL)

          BEGIN_CASE(JSOP_IMPORTPROP)
            /* Get an immediate atom naming the property. */
            LOAD_ATOM(0);
            id = ATOM_TO_JSID(atom);
            PROPERTY_OP(-1, ok = ImportProperty(cx, obj, id));
            sp--;
          END_CASE(JSOP_IMPORTPROP)

          BEGIN_CASE(JSOP_IMPORTELEM)
            ELEMENT_OP(-1, ok = ImportProperty(cx, obj, id));
            sp -= 2;
          END_CASE(JSOP_IMPORTELEM)
#endif /* JS_HAS_EXPORT_IMPORT */

          BEGIN_CASE(JSOP_TRAP)
            SAVE_SP_AND_PC(fp);
            switch (JS_HandleTrap(cx, script, pc, &rval)) {
              case JSTRAP_ERROR:
                ok = JS_FALSE;
                goto out;
              case JSTRAP_CONTINUE:
                JS_ASSERT(JSVAL_IS_INT(rval));
                op = (JSOp) JSVAL_TO_INT(rval);
                JS_ASSERT((uintN)op < (uintN)JSOP_LIMIT);
                LOAD_INTERRUPT_HANDLER(cx);
                DO_OP();
              case JSTRAP_RETURN:
                fp->rval = rval;
                goto out;
              case JSTRAP_THROW:
                cx->throwing = JS_TRUE;
                cx->exception = rval;
                ok = JS_FALSE;
                goto out;
              default:;
            }
            LOAD_INTERRUPT_HANDLER(cx);
          END_CASE(JSOP_TRAP)

          BEGIN_CASE(JSOP_ARGUMENTS)
            SAVE_SP_AND_PC(fp);
            ok = js_GetArgsValue(cx, fp, &rval);
            if (!ok)
                goto out;
            PUSH_OPND(rval);
          END_CASE(JSOP_ARGUMENTS)

          BEGIN_CASE(JSOP_ARGSUB)
            id = INT_TO_JSID(GET_ARGNO(pc));
            SAVE_SP_AND_PC(fp);
            ok = js_GetArgsProperty(cx, fp, id, &rval);
            if (!ok)
                goto out;
            PUSH_OPND(rval);
          END_CASE(JSOP_ARGSUB)

          BEGIN_CASE(JSOP_ARGCNT)
            id = ATOM_TO_JSID(rt->atomState.lengthAtom);
            SAVE_SP_AND_PC(fp);
            ok = js_GetArgsProperty(cx, fp, id, &rval);
            if (!ok)
                goto out;
            PUSH_OPND(rval);
          END_CASE(JSOP_ARGCNT)

#define PUSH_GLOBAL_THIS(cx,sp)                                               \
    JS_BEGIN_MACRO                                                            \
        PUSH_OPND(JSVAL_NULL);                                                \
        SAVE_SP_AND_PC(fp);                                                   \
        ok = ComputeGlobalThis(cx, sp);                                       \
        if (!ok)                                                              \
            goto out;                                                         \
        JS_ASSERT(!JSVAL_IS_NULL(sp[-1]) && !JSVAL_IS_VOID(sp[-1]));          \
    JS_END_MACRO

          BEGIN_CASE(JSOP_GLOBALTHIS)
            PUSH_GLOBAL_THIS(cx, sp);
          END_CASE(JSOP_GLOBALTHIS)

          BEGIN_CASE(JSOP_GETARG)
          BEGIN_CASE(JSOP_CALLARG)
            slot = GET_ARGNO(pc);
            JS_ASSERT(slot < fp->fun->nargs);
            METER_SLOT_OP(op, slot);
            PUSH_OPND(fp->argv[slot]);
            if (op == JSOP_CALLARG)
                PUSH_GLOBAL_THIS(cx, sp);
          END_CASE(JSOP_GETARG)

          BEGIN_CASE(JSOP_SETARG)
            slot = GET_ARGNO(pc);
            JS_ASSERT(slot < fp->fun->nargs);
            METER_SLOT_OP(op, slot);
            vp = &fp->argv[slot];
            GC_POKE(cx, *vp);
            *vp = FETCH_OPND(-1);
          END_CASE(JSOP_SETARG)

          BEGIN_CASE(JSOP_GETVAR)
          BEGIN_CASE(JSOP_CALLVAR)
            slot = GET_VARNO(pc);
            JS_ASSERT(slot < fp->fun->u.i.nvars);
            METER_SLOT_OP(op, slot);
            PUSH_OPND(fp->vars[slot]);
            if (op == JSOP_CALLVAR)
                PUSH_GLOBAL_THIS(cx, sp);
          END_CASE(JSOP_GETVAR)

          BEGIN_CASE(JSOP_SETVAR)
            slot = GET_VARNO(pc);
            JS_ASSERT(slot < fp->fun->u.i.nvars);
            METER_SLOT_OP(op, slot);
            vp = &fp->vars[slot];
            GC_POKE(cx, *vp);
            *vp = FETCH_OPND(-1);
          END_CASE(JSOP_SETVAR)

          BEGIN_CASE(JSOP_GETGVAR)
          BEGIN_CASE(JSOP_CALLGVAR)
            slot = GET_VARNO(pc);
            JS_ASSERT(slot < fp->nvars);
            METER_SLOT_OP(op, slot);
            lval = fp->vars[slot];
            if (JSVAL_IS_NULL(lval)) {
                op = (op == JSOP_GETGVAR) ? JSOP_NAME : JSOP_CALLNAME;
                DO_OP();
            }
            slot = JSVAL_TO_INT(lval);
            obj = fp->varobj;
            rval = OBJ_GET_SLOT(cx, obj, slot);
            PUSH_OPND(rval);
            if (op == JSOP_CALLGVAR)
                PUSH_OPND(OBJECT_TO_JSVAL(obj));
          END_CASE(JSOP_GETGVAR)

          BEGIN_CASE(JSOP_SETGVAR)
            slot = GET_VARNO(pc);
            JS_ASSERT(slot < fp->nvars);
            METER_SLOT_OP(op, slot);
            rval = FETCH_OPND(-1);
            lval = fp->vars[slot];
            obj = fp->varobj;
            if (JSVAL_IS_NULL(lval)) {
                /*
                 * Inline-clone and specialize JSOP_SETNAME code here because
                 * JSOP_SETGVAR has arity 1: [rval], not arity 2: [obj, rval]
                 * as JSOP_SETNAME does, where [obj] is due to JSOP_BINDNAME.
                 */
                LOAD_ATOM(0);
                id = ATOM_TO_JSID(atom);
                SAVE_SP_AND_PC(fp);
                ok = OBJ_SET_PROPERTY(cx, obj, id, &rval);
                if (!ok)
                    goto out;
                STORE_OPND(-1, rval);
            } else {
                slot = JSVAL_TO_INT(lval);
                GC_POKE(cx, STOBJ_GET_SLOT(obj, slot));
                OBJ_SET_SLOT(cx, obj, slot, rval);
            }
          END_CASE(JSOP_SETGVAR)

          BEGIN_CASE(JSOP_DEFCONST)
          BEGIN_CASE(JSOP_DEFVAR)
            index = GET_INDEX(pc);
            atom = atoms[index];

            /*
             * index is relative to atoms at this point but for global var
             * code below we need the absolute value.
             */
            index += atoms - script->atomMap.vector;
            obj = fp->varobj;
            attrs = JSPROP_ENUMERATE;
            if (!(fp->flags & JSFRAME_EVAL))
                attrs |= JSPROP_PERMANENT;
            if (op == JSOP_DEFCONST)
                attrs |= JSPROP_READONLY;

            /* Lookup id in order to check for redeclaration problems. */
            id = ATOM_TO_JSID(atom);
            SAVE_SP_AND_PC(fp);
            ok = js_CheckRedeclaration(cx, obj, id, attrs, &obj2, &prop);
            if (!ok)
                goto out;

            /* Bind a variable only if it's not yet defined. */
            if (!prop) {
                ok = OBJ_DEFINE_PROPERTY(cx, obj, id, JSVAL_VOID, NULL, NULL,
                                         attrs, &prop);
                if (!ok)
                    goto out;
                JS_ASSERT(prop);
                obj2 = obj;
            }

            /*
             * Try to optimize a property we either just created, or found
             * directly in the global object, that is permanent, has a slot,
             * and has stub getter and setter, into a "fast global" accessed
             * by the JSOP_*GVAR opcodes.
             */
            if (index < script->ngvars &&
                (attrs & JSPROP_PERMANENT) &&
                obj2 == obj &&
                OBJ_IS_NATIVE(obj)) {
                sprop = (JSScopeProperty *) prop;
                if (SPROP_HAS_VALID_SLOT(sprop, OBJ_SCOPE(obj)) &&
                    SPROP_HAS_STUB_GETTER(sprop) &&
                    SPROP_HAS_STUB_SETTER(sprop)) {
                    /*
                     * Fast globals use fp->vars to map the global name's
                     * atom index to the permanent fp->varobj slot number,
                     * tagged as a jsval.  The atom index for the global's
                     * name literal is identical to its fp->vars index.
                     */
                    fp->vars[index] = INT_TO_JSVAL(sprop->slot);
                }
            }

            OBJ_DROP_PROPERTY(cx, obj2, prop);
          END_CASE(JSOP_DEFVAR)

          BEGIN_CASE(JSOP_DEFFUN)
            LOAD_FUNCTION(0);

            /*
             * We must be at top-level (either outermost block that forms a
             * function's body, or a global) scope, not inside an expression
             * (JSOP_{ANON,NAMED}FUNOBJ) or compound statement (JSOP_CLOSURE)
             * in the same compilation unit (ECMA Program). We also not inside
             * an eval script.
             *
             * If static link is not current scope, clone fun's object to link
             * to the current scope via parent.  This clause exists to enable
             * sharing of compiled functions among multiple equivalent scopes,
             * splitting the cost of compilation evenly among the scopes and
             * amortizing it over a number of executions.  Examples include XUL
             * scripts and event handlers shared among Mozilla chrome windows,
             * and server-side JS user-defined functions shared among requests.
             *
             * NB: The Script object exposes compile and exec in the language,
             * such that this clause introduces an incompatible change from old
             * JS versions that supported Script.  Such a JS version supported
             * executing a script that defined and called functions scoped by
             * the compile-time static link, not by the exec-time scope chain.
             *
             * We sacrifice compatibility, breaking such scripts, in order to
             * promote compile-cost sharing and amortizing, and because Script
             * is not and will not be standardized.
             */
            JS_ASSERT(!fp->blockChain);
            JS_ASSERT((fp->flags & JSFRAME_EVAL) == 0);
            JS_ASSERT(fp->scopeChain == fp->varobj);
            obj2 = fp->scopeChain;

            /*
             * ECMA requires functions defined when entering Global code to be
             * permanent.
             */
            attrs = JSPROP_ENUMERATE | JSPROP_PERMANENT;
            SAVE_SP_AND_PC(fp);

          do_deffun:
            /* The common code for JSOP_DEFFUN and JSOP_CLOSURE. */
            ASSERT_SAVED_SP_AND_PC(fp);

            /*
             * Clone the function object with the current scope chain as the
             * clone's parent.  The original function object is the prototype
             * of the clone.  Do this only if re-parenting; the compiler may
             * have seen the right parent already and created a sufficiently
             * well-scoped function object.
             */
            if (OBJ_GET_PARENT(cx, obj) != obj2) {
                obj = js_CloneFunctionObject(cx, obj, obj2);
                if (!obj) {
                    ok = JS_FALSE;
                    goto out;
                }
            }

            /*
             * Protect obj from any GC hiding below OBJ_DEFINE_PROPERTY.  All
             * paths from here must flow through the "Restore fp->scopeChain"
             * code below the OBJ_DEFINE_PROPERTY call.
             */
            fp->scopeChain = obj;
            rval = OBJECT_TO_JSVAL(obj);

            /*
             * Load function flags that are also property attributes.  Getters
             * and setters do not need a slot, their value is stored elsewhere
             * in the property itself, not in obj slots.
             */
            fun = GET_FUNCTION_PRIVATE(cx, obj);
            flags = JSFUN_GSFLAG2ATTR(fun->flags);
            if (flags) {
                attrs |= flags | JSPROP_SHARED;
                rval = JSVAL_VOID;
            }

            /*
             * We define the function as a property of the variable object and
             * not the current scope chain even for the case of function
             * expression statements and functions defined by eval inside let
             * or with blocks.
             */
            parent = fp->varobj;

            /*
             * Check for a const property of the same name -- or any kind
             * of property if executing with the strict option.  We check
             * here at runtime as well as at compile-time, to handle eval
             * as well as multiple HTML script tags.
             */
            id = ATOM_TO_JSID(fun->atom);
            ok = js_CheckRedeclaration(cx, parent, id, attrs, NULL, NULL);
            if (ok) {
                if (attrs == JSPROP_ENUMERATE) {
                    JS_ASSERT(fp->flags & JSFRAME_EVAL);
                    JS_ASSERT(op == JSOP_CLOSURE);
                    ok = OBJ_SET_PROPERTY(cx, parent, id, &rval);
                } else {
                    ok = OBJ_DEFINE_PROPERTY(cx, parent, id, rval,
                                             (flags & JSPROP_GETTER)
                                             ? JS_EXTENSION (JSPropertyOp) obj
                                             : NULL,
                                             (flags & JSPROP_SETTER)
                                             ? JS_EXTENSION (JSPropertyOp) obj
                                             : NULL,
                                             attrs,
                                             NULL);
                }
            }

            /* Restore fp->scopeChain now that obj is defined in fp->varobj. */
            fp->scopeChain = obj2;
            if (!ok) {
                cx->weakRoots.newborn[GCX_OBJECT] = NULL;
                goto out;
            }
          END_CASE(JSOP_DEFFUN)

          BEGIN_CASE(JSOP_DEFLOCALFUN)
            LOAD_FUNCTION(VARNO_LEN);

            /*
             * Define a local function (i.e., one nested at the top level of
             * another function), parented by the current scope chain, and
             * stored in a local variable slot that the compiler allocated.
             * This is an optimization over JSOP_DEFFUN that avoids requiring
             * a call object for the outer function's activation.
             */
            slot = GET_VARNO(pc);

            JS_ASSERT(!fp->blockChain);
            if (!(fp->flags & JSFRAME_POP_BLOCKS)) {
                /*
                 * If the compiler-created function object (obj) is scoped by a
                 * let-induced body block, temporarily update fp->blockChain so
                 * that js_GetScopeChain will clone the block into the runtime
                 * scope needed to parent the function object's clone.
                 */
                parent = OBJ_GET_PARENT(cx, obj);
                if (parent && OBJ_GET_CLASS(cx, parent) == &js_BlockClass)
                    fp->blockChain = parent;
                parent = js_GetScopeChain(cx, fp);
            } else {
                /*
                 * We have already emulated JSOP_ENTERBLOCK for the enclosing
                 * body block, for a prior JSOP_DEFLOCALFUN in the prolog,  so
                 * we just load fp->scopeChain into parent.
                 *
                 * In typical execution scenarios, the prolog bytecodes that
                 * include this JSOP_DEFLOCALFUN run, then come main bytecodes
                 * including JSOP_ENTERBLOCK for the outermost (body) block.
                 * JSOP_ENTERBLOCK will detect that it need not do anything if
                 * the body block was entered above due to a local function.
                 * Finally the matching JSOP_LEAVEBLOCK runs.
                 *
                 * If the matching JSOP_LEAVEBLOCK for the body block does not
                 * run for some reason, the body block will be properly "put"
                 * (via js_PutBlockObject) by the PutBlockObjects call at the
                 * bottom of js_Interpret.
                 */
                parent = fp->scopeChain;
                JS_ASSERT(OBJ_GET_CLASS(cx, parent) == &js_BlockClass);
                JS_ASSERT(OBJ_GET_PROTO(cx, parent) == OBJ_GET_PARENT(cx, obj));
                JS_ASSERT(OBJ_GET_CLASS(cx, OBJ_GET_PARENT(cx, parent))
                          == &js_CallClass);
            }

            /* If re-parenting, store a clone of the function object. */
            if (OBJ_GET_PARENT(cx, obj) != parent) {
                SAVE_SP_AND_PC(fp);
                obj = js_CloneFunctionObject(cx, obj, parent);
                if (!obj) {
                    ok = JS_FALSE;
                    goto out;
                }
            }

            fp->vars[slot] = OBJECT_TO_JSVAL(obj);
          END_CASE(JSOP_DEFLOCALFUN)

          BEGIN_CASE(JSOP_ANONFUNOBJ)
            /* Load the specified function object literal. */
            LOAD_FUNCTION(0);

            /* If re-parenting, push a clone of the function object. */
            SAVE_SP_AND_PC(fp);
            parent = js_GetScopeChain(cx, fp);
            if (!parent) {
                ok = JS_FALSE;
                goto out;
            }
            if (OBJ_GET_PARENT(cx, obj) != parent) {
                obj = js_CloneFunctionObject(cx, obj, parent);
                if (!obj) {
                    ok = JS_FALSE;
                    goto out;
                }
            }
            PUSH_OPND(OBJECT_TO_JSVAL(obj));
          END_CASE(JSOP_ANONFUNOBJ)

          BEGIN_CASE(JSOP_NAMEDFUNOBJ)
            /* ECMA ed. 3 FunctionExpression: function Identifier [etc.]. */
            LOAD_FUNCTION(0);
            rval = OBJECT_TO_JSVAL(obj);

            /*
             * 1. Create a new object as if by the expression new Object().
             * 2. Add Result(1) to the front of the scope chain.
             *
             * Step 2 is achieved by making the new object's parent be the
             * current scope chain, and then making the new object the parent
             * of the Function object clone.
             */
            SAVE_SP_AND_PC(fp);
            obj2 = js_GetScopeChain(cx, fp);
            if (!obj2) {
                ok = JS_FALSE;
                goto out;
            }
            parent = js_NewObject(cx, &js_ObjectClass, NULL, obj2);
            if (!parent) {
                ok = JS_FALSE;
                goto out;
            }

            /*
             * 3. Create a new Function object as specified in section 13.2
             * with [parameters and body specified by the function expression
             * that was parsed by the compiler into a Function object, and
             * saved in the script's atom map].
             *
             * Protect parent from GC after js_CloneFunctionObject calls into
             * js_NewObject, which displaces the newborn object root in cx by
             * allocating the clone, then runs a last-ditch GC while trying
             * to allocate the clone's slots vector.  Another, multi-threaded
             * path: js_CloneFunctionObject => js_NewObject => OBJ_GET_CLASS
             * which may suspend the current request in ClaimScope, with the
             * newborn displaced as in the first scenario.
             */
            fp->scopeChain = parent;
            obj = js_CloneFunctionObject(cx, JSVAL_TO_OBJECT(rval), parent);
            if (!obj) {
                ok = JS_FALSE;
                goto out;
            }

            /*
             * Protect obj from any GC hiding below OBJ_DEFINE_PROPERTY.  All
             * paths from here must flow through the "Restore fp->scopeChain"
             * code below the OBJ_DEFINE_PROPERTY call.
             */
            fp->scopeChain = obj;
            rval = OBJECT_TO_JSVAL(obj);

            /*
             * 4. Create a property in the object Result(1).  The property's
             * name is [fun->atom, the identifier parsed by the compiler],
             * value is Result(3), and attributes are { DontDelete, ReadOnly }.
             */
            fun = GET_FUNCTION_PRIVATE(cx, obj);
            attrs = JSFUN_GSFLAG2ATTR(fun->flags);
            if (attrs) {
                attrs |= JSPROP_SHARED;
                rval = JSVAL_VOID;
            }
            ok = OBJ_DEFINE_PROPERTY(cx, parent, ATOM_TO_JSID(fun->atom), rval,
                                     (attrs & JSPROP_GETTER)
                                     ? JS_EXTENSION (JSPropertyOp) obj
                                     : NULL,
                                     (attrs & JSPROP_SETTER)
                                     ? JS_EXTENSION (JSPropertyOp) obj
                                     : NULL,
                                     attrs |
                                     JSPROP_ENUMERATE | JSPROP_PERMANENT |
                                     JSPROP_READONLY,
                                     NULL);

            /* Restore fp->scopeChain now that obj is defined in parent. */
            fp->scopeChain = obj2;
            if (!ok) {
                cx->weakRoots.newborn[GCX_OBJECT] = NULL;
                goto out;
            }

            /*
             * 5. Remove Result(1) from the front of the scope chain [no-op].
             * 6. Return Result(3).
             */
            PUSH_OPND(OBJECT_TO_JSVAL(obj));
          END_CASE(JSOP_NAMEDFUNOBJ)

          BEGIN_CASE(JSOP_CLOSURE)
            /*
             * A top-level function inside eval or ECMA ed. 3 extension: a
             * named function expression statement in a compound statement
             * (not at the top statement level of global code, or at the top
             * level of a function body).
             */
            LOAD_FUNCTION(0);

            /*
             * Clone the function object with the current scope chain as the
             * clone's parent. Do this only if re-parenting; the compiler may
             * have seen the right parent already and created a sufficiently
             * well-scoped function object.
             */
            SAVE_SP_AND_PC(fp);
            obj2 = js_GetScopeChain(cx, fp);
            if (!obj2) {
                ok = JS_FALSE;
                goto out;
            }

            /*
             * ECMA requires that functions defined when entering Eval code to
             * be impermanent.
             */
            attrs = JSPROP_ENUMERATE;
            if (!(fp->flags & JSFRAME_EVAL))
                attrs |= JSPROP_PERMANENT;

            goto do_deffun;

#if JS_HAS_GETTER_SETTER
          BEGIN_CASE(JSOP_GETTER)
          BEGIN_CASE(JSOP_SETTER)
          do_getter_setter:
            op2 = (JSOp) *++pc;
            switch (op2) {
              case JSOP_INDEXBASE:
                atoms += GET_INDEXBASE(pc);
                pc += JSOP_INDEXBASE_LENGTH - 1;
                goto do_getter_setter;
              case JSOP_INDEXBASE1:
              case JSOP_INDEXBASE2:
              case JSOP_INDEXBASE3:
                atoms += (op2 - JSOP_INDEXBASE1 + 1) << 16;
                goto do_getter_setter;

              case JSOP_SETNAME:
              case JSOP_SETPROP:
                LOAD_ATOM(0);
                id = ATOM_TO_JSID(atom);
                rval = FETCH_OPND(-1);
                i = -1;
                goto gs_pop_lval;

              case JSOP_SETELEM:
                rval = FETCH_OPND(-1);
                id = 0;
                i = -2;
              gs_pop_lval:
                SAVE_SP_AND_PC(fp);
                FETCH_OBJECT(cx, i - 1, lval, obj);
                break;

              case JSOP_INITPROP:
                JS_ASSERT(sp - fp->spbase >= 2);
                rval = FETCH_OPND(-1);
                i = -1;
                LOAD_ATOM(0);
                id = ATOM_TO_JSID(atom);
                goto gs_get_lval;

              case JSOP_INITELEM:
                JS_ASSERT(sp - fp->spbase >= 3);
                rval = FETCH_OPND(-1);
                id = 0;
                i = -2;
              gs_get_lval:
                lval = FETCH_OPND(i-1);
                JS_ASSERT(JSVAL_IS_OBJECT(lval));
                obj = JSVAL_TO_OBJECT(lval);
                SAVE_SP_AND_PC(fp);
                break;

              default:
                JS_ASSERT(0);
            }

            /* Ensure that id has a type suitable for use with obj. */
            if (id == 0)
                FETCH_ELEMENT_ID(obj, i, id);

            if (JS_TypeOfValue(cx, rval) != JSTYPE_FUNCTION) {
                JS_ReportErrorNumber(cx, js_GetErrorMessage, NULL,
                                     JSMSG_BAD_GETTER_OR_SETTER,
                                     (op == JSOP_GETTER)
                                     ? js_getter_str
                                     : js_setter_str);
                ok = JS_FALSE;
                goto out;
            }

            /*
             * Getters and setters are just like watchpoints from an access
             * control point of view.
             */
            ok = OBJ_CHECK_ACCESS(cx, obj, id, JSACC_WATCH, &rtmp, &attrs);
            if (!ok)
                goto out;

            if (op == JSOP_GETTER) {
                getter = JS_EXTENSION (JSPropertyOp) JSVAL_TO_OBJECT(rval);
                setter = NULL;
                attrs = JSPROP_GETTER;
            } else {
                getter = NULL;
                setter = JS_EXTENSION (JSPropertyOp) JSVAL_TO_OBJECT(rval);
                attrs = JSPROP_SETTER;
            }
            attrs |= JSPROP_ENUMERATE | JSPROP_SHARED;

            /* Check for a readonly or permanent property of the same name. */
            ok = js_CheckRedeclaration(cx, obj, id, attrs, NULL, NULL);
            if (!ok)
                goto out;

            ok = OBJ_DEFINE_PROPERTY(cx, obj, id, JSVAL_VOID, getter, setter,
                                     attrs, NULL);
            if (!ok)
                goto out;

            sp += i;
            if (js_CodeSpec[op2].ndefs)
                STORE_OPND(-1, rval);
            len = js_CodeSpec[op2].length;
            DO_NEXT_OP(len);
#endif /* JS_HAS_GETTER_SETTER */

          BEGIN_CASE(JSOP_NEWINIT)
            i = GET_INT8(pc);
            JS_ASSERT(i == JSProto_Array || i == JSProto_Object);
            SAVE_SP_AND_PC(fp);
            obj = (i == JSProto_Array)
                  ? js_NewArrayObject(cx, 0, NULL)
                  : js_NewObject(cx, &js_ObjectClass, NULL, NULL);
            if (!obj)
                goto out;
            PUSH_OPND(OBJECT_TO_JSVAL(obj));
            fp->sharpDepth++;
            LOAD_INTERRUPT_HANDLER(cx);
          END_CASE(JSOP_NEWINIT)

          BEGIN_CASE(JSOP_ENDINIT)
            if (--fp->sharpDepth == 0)
                fp->sharpArray = NULL;

            /* Re-set the newborn root to the top of this object tree. */
            JS_ASSERT(sp - fp->spbase >= 1);
            lval = FETCH_OPND(-1);
            JS_ASSERT(JSVAL_IS_OBJECT(lval));
            cx->weakRoots.newborn[GCX_OBJECT] = JSVAL_TO_GCTHING(lval);
          END_CASE(JSOP_ENDINIT)

          BEGIN_CASE(JSOP_INITPROP)
            /* Get the immediate property name into id. */
            LOAD_ATOM(0);
            id = ATOM_TO_JSID(atom);
            /* Pop the property's value into rval. */
            JS_ASSERT(sp - fp->spbase >= 2);
            rval = FETCH_OPND(-1);
            i = -1;
            SAVE_SP_AND_PC(fp);
            goto do_init;

          BEGIN_CASE(JSOP_INITELEM)
            /* Pop the element's value into rval. */
            JS_ASSERT(sp - fp->spbase >= 3);
            rval = FETCH_OPND(-1);
            i = -2;
            SAVE_SP_AND_PC(fp);
            FETCH_ELEMENT_ID(obj, -2, id);

          do_init:
            /* Find the object being initialized at top of stack. */
            lval = FETCH_OPND(i-1);
            JS_ASSERT(JSVAL_IS_OBJECT(lval));
            obj = JSVAL_TO_OBJECT(lval);

            /* Set the property named by obj[id] to rval. */
            ok = js_CheckRedeclaration(cx, obj, id, JSPROP_INITIALIZER, NULL,
                                       NULL);
            if (!ok)
                goto out;
            ok = OBJ_SET_PROPERTY(cx, obj, id, &rval);
            if (!ok)
                goto out;
            sp += i;
            len = js_CodeSpec[op].length;
            DO_NEXT_OP(len);

#if JS_HAS_SHARP_VARS
          BEGIN_CASE(JSOP_DEFSHARP)
            SAVE_SP_AND_PC(fp);
            obj = fp->sharpArray;
            if (!obj) {
                obj = js_NewArrayObject(cx, 0, NULL);
                if (!obj) {
                    ok = JS_FALSE;
                    goto out;
                }
                fp->sharpArray = obj;
            }
            i = (jsint) GET_UINT16(pc);
            id = INT_TO_JSID(i);
            rval = FETCH_OPND(-1);
            if (JSVAL_IS_PRIMITIVE(rval)) {
                char numBuf[12];
                JS_snprintf(numBuf, sizeof numBuf, "%u", (unsigned) i);
                JS_ReportErrorNumber(cx, js_GetErrorMessage, NULL,
                                     JSMSG_BAD_SHARP_DEF, numBuf);
                ok = JS_FALSE;
                goto out;
            }
            ok = OBJ_SET_PROPERTY(cx, obj, id, &rval);
            if (!ok)
                goto out;
          END_CASE(JSOP_DEFSHARP)

          BEGIN_CASE(JSOP_USESHARP)
            i = (jsint) GET_UINT16(pc);
            id = INT_TO_JSID(i);
            obj = fp->sharpArray;
            if (!obj) {
                rval = JSVAL_VOID;
            } else {
                SAVE_SP_AND_PC(fp);
                ok = OBJ_GET_PROPERTY(cx, obj, id, &rval);
                if (!ok)
                    goto out;
            }
            if (!JSVAL_IS_OBJECT(rval)) {
                char numBuf[12];
                JS_snprintf(numBuf, sizeof numBuf, "%u", (unsigned) i);

                SAVE_SP_AND_PC(fp);
                JS_ReportErrorNumber(cx, js_GetErrorMessage, NULL,
                                     JSMSG_BAD_SHARP_USE, numBuf);
                ok = JS_FALSE;
                goto out;
            }
            PUSH_OPND(rval);
          END_CASE(JSOP_USESHARP)
#endif /* JS_HAS_SHARP_VARS */

          /* No-ops for ease of decompilation and jit'ing. */
          EMPTY_CASE(JSOP_TRY)
          EMPTY_CASE(JSOP_FINALLY)

          BEGIN_CASE(JSOP_GOSUB)
            PUSH(JSVAL_FALSE);
            i = PTRDIFF(pc, script->main, jsbytecode) + JSOP_GOSUB_LENGTH;
            len = GET_JUMP_OFFSET(pc);
            PUSH(INT_TO_JSVAL(i));
          END_VARLEN_CASE

          BEGIN_CASE(JSOP_GOSUBX)
            PUSH(JSVAL_FALSE);
            i = PTRDIFF(pc, script->main, jsbytecode) + JSOP_GOSUBX_LENGTH;
            len = GET_JUMPX_OFFSET(pc);
            PUSH(INT_TO_JSVAL(i));
          END_VARLEN_CASE

          BEGIN_CASE(JSOP_RETSUB)
            rval = POP();
            lval = POP();
            JS_ASSERT(JSVAL_IS_BOOLEAN(lval));
            if (JSVAL_TO_BOOLEAN(lval)) {
                /*
                 * Exception was pending during finally, throw it *before* we
                 * adjust pc, because pc indexes into script->trynotes.  This
                 * turns out not to be necessary, but it seems clearer.  And
                 * it points out a FIXME: 350509, due to Igor Bukanov.
                 */
                cx->throwing = JS_TRUE;
                cx->exception = rval;
                ok = JS_FALSE;
                goto out;
            }
            JS_ASSERT(JSVAL_IS_INT(rval));
            len = JSVAL_TO_INT(rval);
            pc = script->main;
          END_VARLEN_CASE

          BEGIN_CASE(JSOP_EXCEPTION)
            JS_ASSERT(cx->throwing);
            PUSH(cx->exception);
            cx->throwing = JS_FALSE;
          END_CASE(JSOP_EXCEPTION)

          BEGIN_CASE(JSOP_THROWING)
            JS_ASSERT(!cx->throwing);
            cx->throwing = JS_TRUE;
            cx->exception = POP_OPND();
          END_CASE(JSOP_THROWING)

          BEGIN_CASE(JSOP_THROW)
            JS_ASSERT(!cx->throwing);
            cx->throwing = JS_TRUE;
            cx->exception = POP_OPND();
            ok = JS_FALSE;
            /* let the code at out try to catch the exception. */
            goto out;

          BEGIN_CASE(JSOP_SETLOCALPOP)
            /*
             * The stack must have a block with at least one local slot below
             * the exception object.
             */
            JS_ASSERT(sp - fp->spbase >= 2);
            slot = GET_UINT16(pc);
            JS_ASSERT(slot + 1 < (uintN)depth);
            fp->spbase[slot] = POP_OPND();
          END_CASE(JSOP_SETLOCALPOP)

          BEGIN_CASE(JSOP_INSTANCEOF)
            SAVE_SP_AND_PC(fp);
            rval = FETCH_OPND(-1);
            if (JSVAL_IS_PRIMITIVE(rval) ||
                !(obj = JSVAL_TO_OBJECT(rval))->map->ops->hasInstance) {
                js_ReportValueError(cx, JSMSG_BAD_INSTANCEOF_RHS,
                                    -1, rval, NULL);
                ok = JS_FALSE;
                goto out;
            }
            lval = FETCH_OPND(-2);
            cond = JS_FALSE;
            ok = obj->map->ops->hasInstance(cx, obj, lval, &cond);
            if (!ok)
                goto out;
            sp--;
            STORE_OPND(-1, BOOLEAN_TO_JSVAL(cond));
          END_CASE(JSOP_INSTANCEOF)

#if JS_HAS_DEBUGGER_KEYWORD
          BEGIN_CASE(JSOP_DEBUGGER)
          {
            JSTrapHandler handler = cx->debugHooks->debuggerHandler;
            if (handler) {
                SAVE_SP_AND_PC(fp);
                switch (handler(cx, script, pc, &rval,
                                cx->debugHooks->debuggerHandlerData)) {
                  case JSTRAP_ERROR:
                    ok = JS_FALSE;
                    goto out;
                  case JSTRAP_CONTINUE:
                    break;
                  case JSTRAP_RETURN:
                    fp->rval = rval;
                    goto out;
                  case JSTRAP_THROW:
                    cx->throwing = JS_TRUE;
                    cx->exception = rval;
                    ok = JS_FALSE;
                    goto out;
                  default:;
                }
                LOAD_INTERRUPT_HANDLER(cx);
            }
          }
          END_CASE(JSOP_DEBUGGER)
#endif /* JS_HAS_DEBUGGER_KEYWORD */

#if JS_HAS_XML_SUPPORT
          BEGIN_CASE(JSOP_DEFXMLNS)
            rval = POP();
            SAVE_SP_AND_PC(fp);
            ok = js_SetDefaultXMLNamespace(cx, rval);
            if (!ok)
                goto out;
          END_CASE(JSOP_DEFXMLNS)

          BEGIN_CASE(JSOP_ANYNAME)
            SAVE_SP_AND_PC(fp);
            ok = js_GetAnyName(cx, &rval);
            if (!ok)
                goto out;
            PUSH_OPND(rval);
          END_CASE(JSOP_ANYNAME)

          BEGIN_CASE(JSOP_QNAMEPART)
            LOAD_ATOM(0);
            PUSH_OPND(ATOM_KEY(atom));
          END_CASE(JSOP_QNAMEPART)

          BEGIN_CASE(JSOP_QNAMECONST)
            LOAD_ATOM(0);
            rval = ATOM_KEY(atom);
            lval = FETCH_OPND(-1);
            SAVE_SP_AND_PC(fp);
            obj = js_ConstructXMLQNameObject(cx, lval, rval);
            if (!obj) {
                ok = JS_FALSE;
                goto out;
            }
            STORE_OPND(-1, OBJECT_TO_JSVAL(obj));
          END_CASE(JSOP_QNAMECONST)

          BEGIN_CASE(JSOP_QNAME)
            rval = FETCH_OPND(-1);
            lval = FETCH_OPND(-2);
            SAVE_SP_AND_PC(fp);
            obj = js_ConstructXMLQNameObject(cx, lval, rval);
            if (!obj) {
                ok = JS_FALSE;
                goto out;
            }
            sp--;
            STORE_OPND(-1, OBJECT_TO_JSVAL(obj));
          END_CASE(JSOP_QNAME)

          BEGIN_CASE(JSOP_TOATTRNAME)
            rval = FETCH_OPND(-1);
            SAVE_SP_AND_PC(fp);
            ok = js_ToAttributeName(cx, &rval);
            if (!ok)
                goto out;
            STORE_OPND(-1, rval);
          END_CASE(JSOP_TOATTRNAME)

          BEGIN_CASE(JSOP_TOATTRVAL)
            rval = FETCH_OPND(-1);
            JS_ASSERT(JSVAL_IS_STRING(rval));
            SAVE_SP_AND_PC(fp);
            str = js_EscapeAttributeValue(cx, JSVAL_TO_STRING(rval), JS_FALSE);
            if (!str) {
                ok = JS_FALSE;
                goto out;
            }
            STORE_OPND(-1, STRING_TO_JSVAL(str));
          END_CASE(JSOP_TOATTRVAL)

          BEGIN_CASE(JSOP_ADDATTRNAME)
          BEGIN_CASE(JSOP_ADDATTRVAL)
            rval = FETCH_OPND(-1);
            lval = FETCH_OPND(-2);
            str = JSVAL_TO_STRING(lval);
            str2 = JSVAL_TO_STRING(rval);
            SAVE_SP_AND_PC(fp);
            str = js_AddAttributePart(cx, op == JSOP_ADDATTRNAME, str, str2);
            if (!str) {
                ok = JS_FALSE;
                goto out;
            }
            sp--;
            STORE_OPND(-1, STRING_TO_JSVAL(str));
          END_CASE(JSOP_ADDATTRNAME)

          BEGIN_CASE(JSOP_BINDXMLNAME)
            lval = FETCH_OPND(-1);
            SAVE_SP_AND_PC(fp);
            ok = js_FindXMLProperty(cx, lval, &obj, &id);
            if (!ok)
                goto out;
            STORE_OPND(-1, OBJECT_TO_JSVAL(obj));
            PUSH_OPND(ID_TO_VALUE(id));
          END_CASE(JSOP_BINDXMLNAME)

          BEGIN_CASE(JSOP_SETXMLNAME)
            obj = JSVAL_TO_OBJECT(FETCH_OPND(-3));
            rval = FETCH_OPND(-1);
            SAVE_SP_AND_PC(fp);
            FETCH_ELEMENT_ID(obj, -2, id);
            ok = OBJ_SET_PROPERTY(cx, obj, id, &rval);
            if (!ok)
                goto out;
            sp -= 2;
            STORE_OPND(-1, rval);
          END_CASE(JSOP_SETXMLNAME)

          BEGIN_CASE(JSOP_CALLXMLNAME)
          BEGIN_CASE(JSOP_XMLNAME)
            lval = FETCH_OPND(-1);
            SAVE_SP_AND_PC(fp);
            ok = js_FindXMLProperty(cx, lval, &obj, &id);
            if (!ok)
                goto out;
            ok = OBJ_GET_PROPERTY(cx, obj, id, &rval);
            if (!ok)
                goto out;
            STORE_OPND(-1, rval);
            if (op == JSOP_CALLXMLNAME) {
                PUSH_OPND(OBJECT_TO_JSVAL(obj));
                SAVE_SP(fp);
                ok = ComputeThis(cx, sp);
                if (!ok)
                    goto out;
            }
          END_CASE(JSOP_XMLNAME)

          BEGIN_CASE(JSOP_DESCENDANTS)
          BEGIN_CASE(JSOP_DELDESC)
            SAVE_SP_AND_PC(fp);
            FETCH_OBJECT(cx, -2, lval, obj);
            rval = FETCH_OPND(-1);
            ok = js_GetXMLDescendants(cx, obj, rval, &rval);
            if (!ok)
                goto out;

            if (op == JSOP_DELDESC) {
                sp[-1] = rval;          /* set local root */
                ok = js_DeleteXMLListElements(cx, JSVAL_TO_OBJECT(rval));
                if (!ok)
                    goto out;
                rval = JSVAL_TRUE;      /* always succeed */
            }

            sp--;
            STORE_OPND(-1, rval);
          END_CASE(JSOP_DESCENDANTS)

          BEGIN_CASE(JSOP_FILTER)
            len = GET_JUMP_OFFSET(pc);
            SAVE_SP_AND_PC(fp);
            FETCH_OBJECT(cx, -1, lval, obj);
            ok = js_FilterXMLList(cx, obj, pc + js_CodeSpec[op].length, &rval);
            if (!ok)
                goto out;
            JS_ASSERT(fp->sp == sp);
            STORE_OPND(-1, rval);
          END_VARLEN_CASE

          BEGIN_CASE(JSOP_ENDFILTER)
            *result = POP_OPND();
            goto out;

          EMPTY_CASE(JSOP_STARTXML)
          EMPTY_CASE(JSOP_STARTXMLEXPR)

          BEGIN_CASE(JSOP_TOXML)
            rval = FETCH_OPND(-1);
            SAVE_SP_AND_PC(fp);
            obj = js_ValueToXMLObject(cx, rval);
            if (!obj) {
                ok = JS_FALSE;
                goto out;
            }
            STORE_OPND(-1, OBJECT_TO_JSVAL(obj));
          END_CASE(JSOP_TOXML)

          BEGIN_CASE(JSOP_TOXMLLIST)
            rval = FETCH_OPND(-1);
            SAVE_SP_AND_PC(fp);
            obj = js_ValueToXMLListObject(cx, rval);
            if (!obj) {
                ok = JS_FALSE;
                goto out;
            }
            STORE_OPND(-1, OBJECT_TO_JSVAL(obj));
          END_CASE(JSOP_TOXMLLIST)

          BEGIN_CASE(JSOP_XMLTAGEXPR)
            rval = FETCH_OPND(-1);
            SAVE_SP_AND_PC(fp);
            str = js_ValueToString(cx, rval);
            if (!str) {
                ok = JS_FALSE;
                goto out;
            }
            STORE_OPND(-1, STRING_TO_JSVAL(str));
          END_CASE(JSOP_XMLTAGEXPR)

          BEGIN_CASE(JSOP_XMLELTEXPR)
            rval = FETCH_OPND(-1);
            SAVE_SP_AND_PC(fp);
            if (VALUE_IS_XML(cx, rval)) {
                str = js_ValueToXMLString(cx, rval);
            } else {
                str = js_ValueToString(cx, rval);
                if (str)
                    str = js_EscapeElementValue(cx, str);
            }
            if (!str) {
                ok = JS_FALSE;
                goto out;
            }
            STORE_OPND(-1, STRING_TO_JSVAL(str));
          END_CASE(JSOP_XMLELTEXPR)

          BEGIN_CASE(JSOP_XMLOBJECT)
            LOAD_OBJECT(0);
            SAVE_SP_AND_PC(fp);
            obj = js_CloneXMLObject(cx, obj);
            if (!obj) {
                ok = JS_FALSE;
                goto out;
            }
            PUSH_OPND(OBJECT_TO_JSVAL(obj));
          END_CASE(JSOP_XMLOBJECT)

          BEGIN_CASE(JSOP_XMLCDATA)
            LOAD_ATOM(0);
            str = ATOM_TO_STRING(atom);
            obj = js_NewXMLSpecialObject(cx, JSXML_CLASS_TEXT, NULL, str);
            if (!obj) {
                ok = JS_FALSE;
                goto out;
            }
            PUSH_OPND(OBJECT_TO_JSVAL(obj));
          END_CASE(JSOP_XMLCDATA)

          BEGIN_CASE(JSOP_XMLCOMMENT)
            LOAD_ATOM(0);
            str = ATOM_TO_STRING(atom);
            obj = js_NewXMLSpecialObject(cx, JSXML_CLASS_COMMENT, NULL, str);
            if (!obj) {
                ok = JS_FALSE;
                goto out;
            }
            PUSH_OPND(OBJECT_TO_JSVAL(obj));
          END_CASE(JSOP_XMLCOMMENT)

          BEGIN_CASE(JSOP_XMLPI)
            LOAD_ATOM(0);
            str = ATOM_TO_STRING(atom);
            rval = FETCH_OPND(-1);
            str2 = JSVAL_TO_STRING(rval);
            SAVE_SP_AND_PC(fp);
            obj = js_NewXMLSpecialObject(cx,
                                         JSXML_CLASS_PROCESSING_INSTRUCTION,
                                         str, str2);
            if (!obj) {
                ok = JS_FALSE;
                goto out;
            }
            STORE_OPND(-1, OBJECT_TO_JSVAL(obj));
          END_CASE(JSOP_XMLPI)

          BEGIN_CASE(JSOP_GETFUNNS)
            SAVE_SP_AND_PC(fp);
            ok = js_GetFunctionNamespace(cx, &rval);
            if (!ok)
                goto out;
            PUSH_OPND(rval);
          END_CASE(JSOP_GETFUNNS)
#endif /* JS_HAS_XML_SUPPORT */

          BEGIN_CASE(JSOP_ENTERBLOCK)
            LOAD_OBJECT(0);
            JS_ASSERT(fp->spbase + OBJ_BLOCK_DEPTH(cx, obj) == sp);
            vp = sp + OBJ_BLOCK_COUNT(cx, obj);
            JS_ASSERT(vp <= fp->spbase + depth);
            while (sp < vp) {
                STORE_OPND(0, JSVAL_VOID);
                sp++;
            }

            /*
             * If this frame had to reflect the compile-time block chain into
             * the runtime scope chain, we can't optimize block scopes out of
             * runtime any longer, because an outer block that parents obj has
             * been cloned onto the scope chain.  To avoid re-cloning such a
             * parent and accumulating redundant clones via js_GetScopeChain,
             * we must clone each block eagerly on entry, and push it on the
             * scope chain, until this frame pops.
             */
            if (fp->flags & JSFRAME_POP_BLOCKS) {
                JS_ASSERT(!fp->blockChain);

                /*
                 * Check whether JSOP_DEFLOCALFUN emulated JSOP_ENTERBLOCK for
                 * the body block in order to correctly scope the local cloned
                 * function object it creates.
                 */
                parent = fp->scopeChain;
                if (OBJ_GET_PROTO(cx, parent) == obj) {
                    JS_ASSERT(OBJ_GET_CLASS(cx, parent) == &js_BlockClass);
                } else {
                    obj = js_CloneBlockObject(cx, obj, parent, fp);
                    if (!obj) {
                        ok = JS_FALSE;
                        goto out;
                    }
                    fp->scopeChain = obj;
                }
            } else {
                JS_ASSERT(!fp->blockChain ||
                          OBJ_GET_PARENT(cx, obj) == fp->blockChain);
                fp->blockChain = obj;
            }
          END_CASE(JSOP_ENTERBLOCK)

          BEGIN_CASE(JSOP_LEAVEBLOCKEXPR)
          BEGIN_CASE(JSOP_LEAVEBLOCK)
          {
            JSObject **chainp;

            /* Grab the result of the expression. */
            if (op == JSOP_LEAVEBLOCKEXPR)
                rval = FETCH_OPND(-1);

            chainp = &fp->blockChain;
            obj = *chainp;
            if (!obj) {
                chainp = &fp->scopeChain;
                obj = *chainp;

                /*
                 * This block was cloned, so clear its private data and sync
                 * its locals to their property slots.
                 */
                SAVE_SP_AND_PC(fp);
                ok = js_PutBlockObject(cx, obj);
                if (!ok)
                    goto out;
            }

            sp -= GET_UINT16(pc);
            JS_ASSERT(fp->spbase <= sp && sp <= fp->spbase + depth);

            /* Store the result into the topmost stack slot. */
            if (op == JSOP_LEAVEBLOCKEXPR)
                STORE_OPND(-1, rval);

            JS_ASSERT(OBJ_GET_CLASS(cx, obj) == &js_BlockClass);
            JS_ASSERT(op == JSOP_LEAVEBLOCKEXPR
                      ? fp->spbase + OBJ_BLOCK_DEPTH(cx, obj) == sp - 1
                      : fp->spbase + OBJ_BLOCK_DEPTH(cx, obj) == sp);

            *chainp = OBJ_GET_PARENT(cx, obj);
            JS_ASSERT(chainp != &fp->blockChain ||
                      !*chainp ||
                      OBJ_GET_CLASS(cx, *chainp) == &js_BlockClass);
          }
          END_CASE(JSOP_LEAVEBLOCK)

          BEGIN_CASE(JSOP_GETLOCAL)
          BEGIN_CASE(JSOP_CALLLOCAL)
            slot = GET_UINT16(pc);
            JS_ASSERT(slot < (uintN)depth);
            PUSH_OPND(fp->spbase[slot]);
            if (op == JSOP_CALLLOCAL)
                PUSH_GLOBAL_THIS(cx, sp);
          END_CASE(JSOP_GETLOCAL)

          BEGIN_CASE(JSOP_SETLOCAL)
            slot = GET_UINT16(pc);
            JS_ASSERT(slot < (uintN)depth);
            vp = &fp->spbase[slot];
            GC_POKE(cx, *vp);
            *vp = FETCH_OPND(-1);
          END_CASE(JSOP_SETLOCAL)

/* NB: This macro doesn't use JS_BEGIN_MACRO/JS_END_MACRO around its body. */
#define FAST_LOCAL_INCREMENT_OP(PRE,OPEQ,MINMAX)                              \
    slot = GET_UINT16(pc);                                                    \
    JS_ASSERT(slot < (uintN)depth);                                           \
    vp = fp->spbase + slot;                                                   \
    rval = *vp;                                                               \
    if (!JSVAL_IS_INT(rval) || rval == INT_TO_JSVAL(JSVAL_INT_##MINMAX))      \
        goto do_nonint_fast_incop;                                            \
    PRE = rval;                                                               \
    rval OPEQ 2;                                                              \
    *vp = rval;                                                               \
    PUSH_OPND(PRE)

          BEGIN_CASE(JSOP_INCLOCAL)
            FAST_LOCAL_INCREMENT_OP(rval, +=, MAX);
          END_CASE(JSOP_INCLOCAL)

          BEGIN_CASE(JSOP_DECLOCAL)
            FAST_LOCAL_INCREMENT_OP(rval, -=, MIN);
          END_CASE(JSOP_DECLOCAL)

          BEGIN_CASE(JSOP_LOCALINC)
            FAST_LOCAL_INCREMENT_OP(rtmp, +=, MAX);
          END_CASE(JSOP_LOCALINC)

          BEGIN_CASE(JSOP_LOCALDEC)
            FAST_LOCAL_INCREMENT_OP(rtmp, -=, MIN);
          END_CASE(JSOP_LOCALDEC)

#undef FAST_LOCAL_INCREMENT_OP

          BEGIN_CASE(JSOP_ENDITER)
            /*
             * Decrease the stack pointer even when !ok, see comments in the
             * exception capturing code for details.
             */
            SAVE_SP_AND_PC(fp);
            ok = js_CloseIterator(cx, sp[-1]);
            --sp;
            if (!ok)
                goto out;
          END_CASE(JSOP_ENDITER)

#if JS_HAS_GENERATORS
          BEGIN_CASE(JSOP_GENERATOR)
            pc += JSOP_GENERATOR_LENGTH;
            SAVE_SP_AND_PC(fp);
            obj = js_NewGenerator(cx, fp);
            if (!obj) {
                ok = JS_FALSE;
            } else {
                JS_ASSERT(!fp->callobj && !fp->argsobj);
                fp->rval = OBJECT_TO_JSVAL(obj);
            }
            goto out;

          BEGIN_CASE(JSOP_YIELD)
            ASSERT_NOT_THROWING(cx);
            if (fp->flags & JSFRAME_FILTERING) {
                /* FIXME: bug 309894 -- fix to eliminate this error. */
                JS_ReportErrorNumberUC(cx, js_GetErrorMessage, NULL,
                                       JSMSG_YIELD_FROM_FILTER);
                ok = JS_FALSE;
                goto out;
            }
            if (FRAME_TO_GENERATOR(fp)->state == JSGEN_CLOSING) {
                js_ReportValueError(cx, JSMSG_BAD_GENERATOR_YIELD,
                                    JSDVG_SEARCH_STACK, fp->argv[-2], NULL);
                ok = JS_FALSE;
                goto out;
            }
            fp->rval = FETCH_OPND(-1);
            fp->flags |= JSFRAME_YIELDING;
            pc += JSOP_YIELD_LENGTH;
            SAVE_SP_AND_PC(fp);
            goto out;

          BEGIN_CASE(JSOP_ARRAYPUSH)
            slot = GET_UINT16(pc);
            JS_ASSERT(slot < (uintN)depth);
            lval = fp->spbase[slot];
            obj  = JSVAL_TO_OBJECT(lval);
            JS_ASSERT(OBJ_GET_CLASS(cx, obj) == &js_ArrayClass);
            rval = FETCH_OPND(-1);

            /*
             * We know that the array is created with only a 'length' private
             * data slot at JSSLOT_ARRAY_LENGTH, and that previous iterations
             * of the comprehension have added the only properties directly in
             * the array object.
             */
            lval = obj->fslots[JSSLOT_ARRAY_LENGTH];
            JS_ASSERT(JSVAL_IS_INT(lval));
            i = JSVAL_TO_INT(lval);
            if (i == ARRAY_INIT_LIMIT) {
                JS_ReportErrorNumberUC(cx, js_GetErrorMessage, NULL,
                                       JSMSG_ARRAY_INIT_TOO_BIG);
                ok = JS_FALSE;
                goto out;
            }
            id = INT_TO_JSID(i);

            SAVE_SP_AND_PC(fp);
            ok = OBJ_SET_PROPERTY(cx, obj, id, &rval);
            if (!ok)
                goto out;
            --sp;
          END_CASE(JSOP_ARRAYPUSH)
#endif /* JS_HAS_GENERATORS */

#if JS_THREADED_INTERP
          L_JSOP_BACKPATCH:
          L_JSOP_BACKPATCH_POP:

# if !JS_HAS_GENERATORS
          L_JSOP_GENERATOR:
          L_JSOP_YIELD:
          L_JSOP_ARRAYPUSH:
# endif

# if !JS_HAS_DESTRUCTURING
          L_JSOP_FOREACHKEYVAL:
          L_JSOP_ENUMCONSTELEM:
# endif

# if !JS_HAS_XML_SUPPORT
          L_JSOP_CALLXMLNAME:
          L_JSOP_STARTXMLEXPR:
          L_JSOP_STARTXML:
          L_JSOP_DELDESC:
          L_JSOP_GETFUNNS:
          L_JSOP_XMLPI:
          L_JSOP_XMLCOMMENT:
          L_JSOP_XMLCDATA:
          L_JSOP_XMLOBJECT:
          L_JSOP_XMLELTEXPR:
          L_JSOP_XMLTAGEXPR:
          L_JSOP_TOXMLLIST:
          L_JSOP_TOXML:
          L_JSOP_ENDFILTER:
          L_JSOP_FILTER:
          L_JSOP_DESCENDANTS:
          L_JSOP_XMLNAME:
          L_JSOP_SETXMLNAME:
          L_JSOP_BINDXMLNAME:
          L_JSOP_ADDATTRVAL:
          L_JSOP_ADDATTRNAME:
          L_JSOP_TOATTRVAL:
          L_JSOP_TOATTRNAME:
          L_JSOP_QNAME:
          L_JSOP_QNAMECONST:
          L_JSOP_QNAMEPART:
          L_JSOP_ANYNAME:
          L_JSOP_DEFXMLNS:
# endif

#else /* !JS_THREADED_INTERP */
          default:
#endif
          {
            char numBuf[12];
            JS_snprintf(numBuf, sizeof numBuf, "%d", op);
            JS_ReportErrorNumber(cx, js_GetErrorMessage, NULL,
                                 JSMSG_BAD_BYTECODE, numBuf);
            ok = JS_FALSE;
            goto out;
          }

#if !JS_THREADED_INTERP

        } /* switch (op) */

    advance_pc:
        pc += len;

#ifdef DEBUG
        if (tracefp) {
            intN ndefs, n;
            jsval *siter;

            ndefs = js_CodeSpec[op].ndefs;
            if (ndefs) {
                SAVE_SP_AND_PC(fp);
                if (op == JSOP_FORELEM && sp[-1] == JSVAL_FALSE)
                    --ndefs;
                for (n = -ndefs; n < 0; n++) {
                    char *bytes = js_DecompileValueGenerator(cx, n, sp[n],
                                                             NULL);
                    if (bytes) {
                        fprintf(tracefp, "%s %s",
                                (n == -ndefs) ? "  output:" : ",",
                                bytes);
                        JS_free(cx, bytes);
                    }
                }
                fprintf(tracefp, " @ %d\n", sp - fp->spbase);
            }
            fprintf(tracefp, "  stack: ");
            for (siter = fp->spbase; siter < sp; siter++) {
                str = js_ValueToString(cx, *siter);
                if (!str)
                    fputs("<null>", tracefp);
                else
                    js_FileEscapedString(tracefp, str, 0);
                fputc(' ', tracefp);
            }
            fputc('\n', tracefp);
        }
#endif /* DEBUG */
    }
#endif /* !JS_THREADED_INTERP */

out:
    JS_ASSERT((size_t)(pc - script->code) < script->length);
    if (!ok && cx->throwing && !(fp->flags & JSFRAME_FILTERING)) {
        /*
         * An exception has been raised and we are not in an XML filtering
         * predicate expression. The latter check is necessary to avoid
         * catching exceptions within the filtering predicate, such as this
         * example taken from tests/e4x/Regress/regress-301596.js:
         *
         *    try {
         *        <xml/>.(@a == 1);
         *        throw 5;
         *    } catch (e) {
         *    }
         *
         * The inner interpreter activation executing the predicate bytecode
         * will throw "reference to undefined XML name @a" (or 5, in older
         * versions that followed the first edition of ECMA-357 and evaluated
         * unbound identifiers to undefined), and the exception must not be
         * caught until control unwinds to the outer interpreter activation.
         *
         * Otherwise, the wrong stack depth will be restored by JSOP_SETSP,
         * and the catch will move into the filtering predicate expression,
         * leading to double catch execution if it rethrows.
         *
         * FIXME: https://bugzilla.mozilla.org/show_bug.cgi?id=309894
         */
         JSTrapHandler handler;
         JSTryNote *tn, *tnlimit;
         uint32 offset;

         /*
          * Call debugger throw hook if set (XXX thread safety?).
          */
         handler = cx->debugHooks->throwHook;
         if (handler) {
             SAVE_SP_AND_PC(fp);
             switch (handler(cx, script, pc, &rval,
                             cx->debugHooks->throwHookData)) {
               case JSTRAP_ERROR:
                 cx->throwing = JS_FALSE;
                 goto no_catch;
               case JSTRAP_RETURN:
                 ok = JS_TRUE;
                 cx->throwing = JS_FALSE;
                 fp->rval = rval;
                 goto no_catch;
               case JSTRAP_THROW:
                 cx->exception = rval;
               case JSTRAP_CONTINUE:
               default:;
             }
             LOAD_INTERRUPT_HANDLER(cx);
         }

         /*
          * Look for a try block in script that can catch this exception.
          */
         if (script->trynotesOffset == 0)
             goto no_catch;

         offset = (uint32)(pc - script->main);
         tn = JS_SCRIPT_TRYNOTES(script)->vector;
         tnlimit = tn + JS_SCRIPT_TRYNOTES(script)->length;
         do {
             if (offset - tn->start >= tn->length)
                 continue;

             /*
              * We have a note that covers the exception pc but we must check
              * whether the interpreter has already executed the corresponding
              * handler. This is possible when the executed bytecode
              * implements break or return from inside a for-in loop.
              *
              * In this case the emitter generates additional [enditer] and
              * [gosub] opcodes to close all outstanding iterators and execute
              * the finally blocks. If such an [enditer] throws an exception,
              * its pc can still be inside several nested for-in loops and
              * try-finally statements even if we have already closed the
              * corresponding iterators and invoked the finally blocks.
              *
              * To address this, we make [enditer] always decrease the stack
              * even when its implementation throws an exception. Thus already
              * executed [enditer] and [gosub] opcodes will have try notes
              * with the stack depth exceeding the current one and this
              * condition is what we use to filter them out.
              */
             if (tn->stackDepth > sp - fp->spbase)
                 continue;

             /*
              * Prepare to execute the try note handler and unwind the block
              * and scope chains until we match the stack depth of the try
              * note. Note that we set sp after we call js_PutBlockObject to
              * avoid potential GC hazards.
              */
             ok = JS_TRUE;
             i = tn->stackDepth;
             for (obj = fp->blockChain; obj; obj = OBJ_GET_PARENT(cx, obj)) {
                 JS_ASSERT(OBJ_GET_CLASS(cx, obj) == &js_BlockClass);
                 if (OBJ_BLOCK_DEPTH(cx, obj) < i)
                     break;
             }
             fp->blockChain = obj;

             JS_ASSERT(ok);
             for (obj = fp->scopeChain; ; obj = OBJ_GET_PARENT(cx, obj)) {
                 clasp = OBJ_GET_CLASS(cx, obj);
                 if (clasp != &js_WithClass && clasp != &js_BlockClass)
                     break;
                 if (JS_GetPrivate(cx, obj) != fp ||
                     OBJ_BLOCK_DEPTH(cx, obj) < i) {
                     break;
                 }
                 if (clasp == &js_BlockClass) {
                     /* Don't fail until after we've updated all stacks. */
                     ok &= js_PutBlockObject(cx, obj);
                 } else {
                     JS_SetPrivate(cx, obj, NULL);
                 }
             }

             fp->scopeChain = obj;
             sp = fp->spbase + i;

             /*
              * Set pc to the first bytecode after the the try note to point
              * to the beginning of catch or finally or to [enditer] closing
              * the for-in loop.
              *
              * We do it before checking for ok so, when failing during the
              * scope recovery, we restart the exception search with the
              * updated stack and pc avoiding calling the handler again.
              */
             offset = tn->start + tn->length;
             pc = (script)->main + offset;
             if (!ok)
                 goto out;

             switch (tn->kind) {
               case JSTN_CATCH:
                 JS_ASSERT(*pc == JSOP_ENTERBLOCK);

#if JS_HAS_GENERATORS
                 /* Catch cannot intercept the closing of a generator. */
                 if (JS_UNLIKELY(cx->exception == JSVAL_ARETURN))
                     break;
#endif

                 /*
                  * Don't clear cx->throwing to save cx->exception from GC
                  * until it is pushed to the stack via [exception] in the
                  * catch block.
                  */
                 len = 0;
                 DO_NEXT_OP(len);

               case JSTN_FINALLY:
                 /*
                  * Push (true, exception) pair for finally to indicate that
                  * [retsub] should rethrow the exception.
                  */
                 PUSH(JSVAL_TRUE);
                 PUSH(cx->exception);
                 cx->throwing = JS_FALSE;
                 len = 0;
                 DO_NEXT_OP(len);

               case JSTN_ITER:
                 /*
                  * This is similar to JSOP_ENDITER in the interpreter loop
                  * except the code now uses a reserved stack slot to save and
                  * restore the exception.
                  */
                 JS_ASSERT(*pc == JSOP_ENDITER);
                 PUSH(cx->exception);
                 cx->throwing = JS_FALSE;
                 SAVE_SP_AND_PC(fp);
                 ok = js_CloseIterator(cx, sp[-2]);
                 sp -= 2;
                 if (!ok) {
                     /*
                      * close generated a new exception error or an error,
                      * restart the handler search to properly notify the
                      * debugger.
                      */
                     goto out;
                 }
                 cx->throwing = JS_TRUE;
                 cx->exception = sp[1];

                 /*
                  * Reset ok to false so, if this is the last try note, the
                  * exception will be propagated outside the function or
                  * script.
                  */
                 ok = JS_FALSE;
                 break;
             }
         } while (++tn != tnlimit);

       no_catch:;
#if JS_HAS_GENERATORS
         if (JS_UNLIKELY(cx->throwing && cx->exception == JSVAL_ARETURN)) {
            cx->throwing = JS_FALSE;
            ok = JS_TRUE;
            fp->rval = JSVAL_VOID;
        }
#endif
    }

    /*
     * Check whether control fell off the end of a lightweight function, or an
     * exception thrown under such a function was not caught by it.  If so, go
     * to the inline code under JSOP_RETURN.
     */
    if (inlineCallCount)
        goto inline_return;

    /*
     * Reset sp before freeing stack slots, because our caller may GC soon.
     * Clear spbase to indicate that we've popped the 2 * depth operand slots.
     * Restore the previous frame's execution state.
     */
    if (JS_LIKELY(mark != NULL)) {
        /* If fp has blocks on its scope chain, home their locals now. */
        if (fp->flags & JSFRAME_POP_BLOCKS) {
            SAVE_SP_AND_PC(fp);
            ok &= PutBlockObjects(cx, fp);
        }

        fp->sp = fp->spbase;
        fp->spbase = NULL;
        js_FreeRawStack(cx, mark);
    } else {
        SAVE_SP(fp);
    }

out2:
    if (cx->version == currentVersion && currentVersion != originalVersion)
        js_SetVersion(cx, originalVersion);
    cx->interpLevel--;
    return ok;

atom_not_defined:
    {
        const char *printable = js_AtomToPrintableString(cx, atom);
        if (printable)
            js_ReportIsNotDefined(cx, printable);
        ok = JS_FALSE;
        goto out;
    }
}
