/* -*- Mode: C++; tab-width: 4; indent-tabs-mode: nil; c-basic-offset: 4 -*- */
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
 *   John Bandhauer <jband@netscape.com>
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


#if defined(_WIN32) && defined(_M_IX86)
// This is the .cpp file where the globals live
#define DHW_IMPLEMENT_GLOBALS
#include <stdio.h>
#include "prtypes.h"
#include "prprf.h"
#include "prlog.h"
#include "plstr.h"
#include "prlock.h"
#include "nscore.h"
#include "nsDebugHelpWin32.h"
#else
#error "nsDebugHelpWin32.cpp should only be built in Win32 x86 builds"
#endif



/***************************************************************************/


PRLock*           DHWImportHooker::gLock  = nsnull;
DHWImportHooker*  DHWImportHooker::gHooks = nsnull;
GETPROCADDRESS    DHWImportHooker::gRealGetProcAddress = nsnull;


static PRBool
dhwEnsureImageHlpInitialized()
{
  static PRBool gInitialized = PR_FALSE;
  static PRBool gTried       = PR_FALSE;

  if (!gInitialized && !gTried) {
    gTried = PR_TRUE;
    HMODULE module = ::LoadLibrary("DBGHELP.DLL");
    if (!module) {
      DWORD dw = GetLastError();
      printf("DumpStack Error: DBGHELP.DLL wasn't found. GetLastError() returned 0x%8.8X\n"
             "                 This DLL is needed for succeessfully implementing trace-malloc.\n"
             "                 This dll ships by default on Win2k. Disabling trace-malloc functionality.\n"
             , dw);
      return PR_FALSE;
    }

#define INIT_PROC(typename_, name_) \
    dhw##name_ = (typename_) ::GetProcAddress(module, #name_); \
    if(!dhw##name_) return PR_FALSE;

    INIT_PROC(ENUMERATELOADEDMODULES, EnumerateLoadedModules);
    INIT_PROC(IMAGEDIRECTORYENTRYTODATA, ImageDirectoryEntryToData);

#undef INIT_PROC

    gInitialized = PR_TRUE;
  }

  return gInitialized;
} 


DHWImportHooker&
DHWImportHooker::getGetProcAddressHooker()
{
  static DHWImportHooker gGetProcAddress("Kernel32.dll", "GetProcAddress",
                                           (PROC)DHWImportHooker::GetProcAddress);
  return gGetProcAddress;
}
 

DHWImportHooker&
DHWImportHooker::getLoadLibraryWHooker()
{
  static DHWImportHooker gLoadLibraryW("Kernel32.dll", "LoadLibraryW",
                                         (PROC)DHWImportHooker::LoadLibraryW);
  return gLoadLibraryW;
}

DHWImportHooker&
DHWImportHooker::getLoadLibraryExWHooker()
{
  static DHWImportHooker gLoadLibraryExW("Kernel32.dll", "LoadLibraryExW",
                                         (PROC)DHWImportHooker::LoadLibraryExW);
  return gLoadLibraryExW;
}

DHWImportHooker&
DHWImportHooker::getLoadLibraryAHooker()
{
  static DHWImportHooker gLoadLibraryA("Kernel32.dll", "LoadLibraryA",
                                         (PROC)DHWImportHooker::LoadLibraryA);
  return gLoadLibraryA;
}

DHWImportHooker&
DHWImportHooker::getLoadLibraryExAHooker()
{
  static DHWImportHooker gLoadLibraryExA("Kernel32.dll", "LoadLibraryExA",
                                           (PROC)DHWImportHooker::LoadLibraryExA);
  return gLoadLibraryExA;
}


static HMODULE ThisModule()
{
    MEMORY_BASIC_INFORMATION info;
    return VirtualQuery(ThisModule, &info, sizeof(info)) ? 
                            (HMODULE) info.AllocationBase : nsnull;
}

DHWImportHooker::DHWImportHooker(const char* aModuleName,
                                 const char* aFunctionName,
                                 PROC aHook,
                                 PRBool aExcludeOurModule /* = PR_FALSE */)
    :   mNext(nsnull),
        mModuleName(aModuleName),
        mFunctionName(aFunctionName),
        mOriginal(nsnull),
        mHook(aHook),
        mIgnoreModule(aExcludeOurModule ? ThisModule() : nsnull),
        mHooking(PR_TRUE)
{
    //printf("DHWImportHooker hooking %s, function %s\n",aModuleName, aFunctionName);

    if(!gLock)
        gLock = PR_NewLock();
    PR_Lock(gLock);

    dhwEnsureImageHlpInitialized(); // for the extra ones we care about.

    if(!gRealGetProcAddress)
        gRealGetProcAddress = ::GetProcAddress;

    mOriginal = gRealGetProcAddress(::GetModuleHandleA(aModuleName), 
                                    aFunctionName),
 
    mNext = gHooks;
    gHooks = this;

    PatchAllModules();

    PR_Unlock(gLock);
}   

DHWImportHooker::~DHWImportHooker()
{
    PR_Lock(gLock);

    mHooking = PR_FALSE;
    PatchAllModules();

    for (DHWImportHooker **cur = &gHooks;
         (PR_ASSERT(*cur), *cur); /* assert that we find this */
         cur = &(*cur)->mNext)
    {
        if (*cur == this)
        {
            *cur = mNext;
            break;
        }
    }

    if(!gHooks)
    {
        PRLock* theLock = gLock;
        gLock = nsnull;
        PR_Unlock(theLock);
        PR_DestroyLock(theLock);
    }
    if (gLock)
        PR_Unlock(gLock);
}    

static BOOL CALLBACK ModuleEnumCallback(LPSTR ModuleName,
                                        ULONG ModuleBase,
                                        ULONG ModuleSize,
                                        PVOID UserContext)
{
    //printf("Module Name %s\n",ModuleName);
    DHWImportHooker* self = (DHWImportHooker*) UserContext;
    HMODULE aModule = (HMODULE) ModuleBase;
    return self->PatchOneModule(aModule, ModuleName);
}

PRBool 
DHWImportHooker::PatchAllModules()
{
    return dhwEnumerateLoadedModules(::GetCurrentProcess(), 
                                     ModuleEnumCallback, this);
}    
                                
PRBool 
DHWImportHooker::PatchOneModule(HMODULE aModule, const char* name)
{
    if(aModule == mIgnoreModule)
    {
        return PR_TRUE;
    }

    // do the fun stuff...

    PIMAGE_IMPORT_DESCRIPTOR desc;
    uint32 size;

    desc = (PIMAGE_IMPORT_DESCRIPTOR) 
        dhwImageDirectoryEntryToData(aModule, PR_TRUE, 
                                     IMAGE_DIRECTORY_ENTRY_IMPORT, &size);

    if(!desc)
    {
        return PR_TRUE;
    }

    for(; desc->Name; desc++)
    {
        const char* entryModuleName = (const char*)
            ((char*)aModule + desc->Name);
        if(!lstrcmpi(entryModuleName, mModuleName))
            break;
    }

    if(!desc->Name)
    {
        return PR_TRUE;
    }

    PIMAGE_THUNK_DATA thunk = (PIMAGE_THUNK_DATA)
        ((char*) aModule + desc->FirstThunk);

    for(; thunk->u1.Function; thunk++)
    {
        PROC original;
        PROC replacement;
        
        if(mHooking)
        {
            original = mOriginal;
            replacement = mHook;  
        } 
        else
        {
            original = mHook;  
            replacement = mOriginal;
        }   

        PROC* ppfn = (PROC*) &thunk->u1.Function;
        if(*ppfn == original)
        {
            DWORD dwDummy;
            VirtualProtect(ppfn, sizeof(ppfn), PAGE_EXECUTE_READWRITE, &dwDummy);
            BOOL result = WriteProcessMemory(GetCurrentProcess(), 
                               ppfn, &replacement, sizeof(replacement), nsnull);
            if (!result) //failure
            {
              printf("failure name %s  func %x\n",name,*ppfn);
              DWORD error = GetLastError();
              return PR_TRUE;
            }
            else
            {
              // printf("success name %s  func %x\n",name,*ppfn);
              DWORD filler = result+1;
              return result;
            }
        }

    }
    return PR_TRUE;
}

PRBool 
DHWImportHooker::ModuleLoaded(HMODULE aModule, DWORD flags)
{
    //printf("ModuleLoaded\n");
    if(aModule && !(flags & LOAD_LIBRARY_AS_DATAFILE))
    {
        PR_Lock(gLock);
        // We don't know that the newly loaded module didn't drag in implicitly
        // linked modules, so we patch everything in sight.
        for(DHWImportHooker* cur = gHooks; cur; cur = cur->mNext)
            cur->PatchAllModules();
        PR_Unlock(gLock);
    }
    return PR_TRUE;
}

// static 
HMODULE WINAPI 
DHWImportHooker::LoadLibraryW(PCWSTR path)
{
    //wprintf(L"LoadLibraryW %s\n",path);
    DHW_DECLARE_FUN_TYPE(HMODULE, __stdcall, LOADLIBRARYW_, (PCWSTR));
    HMODULE hmod = DHW_ORIGINAL(LOADLIBRARYW_, getLoadLibraryWHooker())(path);
    ModuleLoaded(hmod, 0);
    return hmod;
}


// static 
HMODULE WINAPI 
DHWImportHooker::LoadLibraryExW(PCWSTR path, HANDLE file, DWORD flags)
{
    //wprintf(L"LoadLibraryExW %s\n",path);
    DHW_DECLARE_FUN_TYPE(HMODULE, __stdcall, LOADLIBRARYEXW_, (PCWSTR, HANDLE, DWORD));
    HMODULE hmod = DHW_ORIGINAL(LOADLIBRARYEXW_, getLoadLibraryExWHooker())(path, file, flags);
    ModuleLoaded(hmod, flags);
    return hmod;
}    

// static 
HMODULE WINAPI 
DHWImportHooker::LoadLibraryA(PCSTR path)
{
    //printf("LoadLibraryA %s\n",path);

    DHW_DECLARE_FUN_TYPE(HMODULE, __stdcall, LOADLIBRARYA_, (PCSTR));
    HMODULE hmod = DHW_ORIGINAL(LOADLIBRARYA_, getLoadLibraryAHooker())(path);
    ModuleLoaded(hmod, 0);
    return hmod;
}

// static 
HMODULE WINAPI 
DHWImportHooker::LoadLibraryExA(PCSTR path, HANDLE file, DWORD flags)
{
    //printf("LoadLibraryExA %s\n",path);
    DHW_DECLARE_FUN_TYPE(HMODULE, __stdcall, LOADLIBRARYEXA_, (PCSTR, HANDLE, DWORD));
    HMODULE hmod = DHW_ORIGINAL(LOADLIBRARYEXA_, getLoadLibraryExAHooker())(path, file, flags);
    ModuleLoaded(hmod, flags);
    return hmod;
}     
// static 
FARPROC WINAPI 
DHWImportHooker::GetProcAddress(HMODULE aModule, PCSTR aFunctionName)
{
    FARPROC pfn = gRealGetProcAddress(aModule, aFunctionName);
    
    if(pfn)
    {
        PR_Lock(gLock);
        for(DHWImportHooker* cur = gHooks; cur; cur = cur->mNext)
        {
            if(pfn == cur->mOriginal)
            {
                pfn = cur->mHook;
                break;
            }    
        }
        PR_Unlock(gLock);
    }
    return pfn;
}


