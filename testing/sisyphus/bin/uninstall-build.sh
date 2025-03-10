#!/bin/bash -e
# -*- Mode: Shell-script; tab-width: 4; indent-tabs-mode: nil; -*-
# ***** BEGIN LICENSE BLOCK *****
# Version: MPL 1.1/GPL 2.0/LGPL 2.1
#
# The contents of this file are subject to the Mozilla Public License Version
# 1.1 (the "License"); you may not use this file except in compliance with
# the License. You may obtain a copy of the License at
# http://www.mozilla.org/MPL/
#
# Software distributed under the License is distributed on an "AS IS" basis,
# WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
# for the specific language governing rights and limitations under the
# License.
#
# The Original Code is mozilla.org code.
#
# The Initial Developer of the Original Code is
# Mozilla Corporation.
# Portions created by the Initial Developer are Copyright (C) 2006.
# the Initial Developer. All Rights Reserved.
#
# Contributor(s):
#  Bob Clary <bob@bclary.com>
#
# Alternatively, the contents of this file may be used under the terms of
# either the GNU General Public License Version 2 or later (the "GPL"), or
# the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
# in which case the provisions of the GPL or the LGPL are applicable instead
# of those above. If you wish to allow use of your version of this file only
# under the terms of either the GPL or the LGPL, and not to allow others to
# use your version of this file under the terms of the MPL, indicate your
# decision by deleting the provisions above and replace them with the notice
# and other provisions required by the GPL or the LGPL. If you do not delete
# the provisions above, a recipient may use your version of this file under
# the terms of any one of the MPL, the GPL or the LGPL.
#
# ***** END LICENSE BLOCK *****

TEST_DIR=${TEST_DIR:-/work/mozilla/mozilla.com/test.mozilla.com/www}
TEST_BIN=${TEST_BIN:-$TEST_DIR/bin}
source ${TEST_BIN}/library.sh

#
# options processing
#
options="p:b:x:d:"
function usage()
{
    cat <<EOF
usage: 
$SCRIPT -p product -b branch  -x executablepath [-d datafiles]

variable            description
===============     ============================================================
-p product          required. firefox|thunderbird
-b branch           required. 1.8.0|1.8.1|1.9.0
-x executablepath   required. directory where build is installed
-d datafiles        optional. one or more filenames of files containing 
                    environment variable definitions to be included.

note that the environment variables should have the same names as in the 
"variable" column.

Uninstalls build located in directory-tree 'executablepath'
then removes the directory upon completion.

EOF
    exit 1
}

unset product branch executablepath datafiles

while getopts $options optname ; 
  do 
  case $optname in
      p) product=$OPTARG;;
      b) branch=$OPTARG;;
      x) executablepath=$OPTARG;;
      d) datafiles=$OPTARG;;
  esac
done

# include environment variables
if [[ -n "$datafiles" ]]; then
    for datafile in $datafiles; do 
        cat $datafile | sed 's|^|data: |'
        source $datafile
    done
fi

if [[ -z "$product" || -z "$branch" || -z "$executablepath" ]]
    then
    usage
fi


if [[ ! -d "$executablepath" ]]; then
    exit 0
fi

executable=`get_executable $product $branch $executablepath`

if [[ -z "$executable" ]]; then
    exit 0
fi

executabledir=`dirname $executable`

if [[ $OSID == "win32" ]]; then
    # see http://nsis.sourceforge.net/Docs/Chapter3.html

    # if the directory already exists, attempt to uninstall
    # any existing installation.

    if [[ -d "$executabledir/uninstall" ]]; then

        if [[ $branch == "1.8.0" ]]; then
            uninstallexe="$executabledir/uninstall/uninstall.exe"
            uninstallini="$executabledir/uninstall/uninstall.ini"
            if [[ -n "$uninstallexe"  && -e "$uninstallexe" ]]; then
                if sed -i.bak 's/Run Mode=Normal/Run Mode=Silent/' $uninstallini; 
                    then
                    # uninstall.exe will return non zero exit codes 
                    # for no damn reason.
                    if $uninstallexe; then
                        true
                    fi
                fi
            fi
        elif [[ $branch == "1.8.1" || $branch == "1.9.0" ]]; then
            uninstalloldexe="$executabledir/uninstall/uninst.exe"
            uninstallnewexe="$executabledir/uninstall/helper.exe"
            if [[ -n "$uninstallnewexe" && -e "$uninstallnewexe" ]]; then
                $uninstallnewexe /S /D=`cygpath -a -w $executabledir | sed 's@\\\\@\\\\\\\\@g'`
            elif [[ -n "$uninstalloldexe" && -e "$uninstalloldexe" ]]; then
                $uninstalloldexe /S /D=`cygpath -a -w $executabledir | sed 's@\\\\@\\\\\\\\@g'`
            else
                uninstallexe="$executabledir/$product/uninstall/uninstaller.exe"
                if [[ -n "$uninstallexe" && -e "$uninstallexe" ]]; then
                    $uninstallexe /S /D=`cygpath -a -w "$executabledir"  | sed 's@\\\\@\\\\\\\\@g'`
                fi
            fi
        else
            error "Unknown branch $branch"
        fi
        # the NSIS uninstaller will copy itself, then fork to the new
        # copy so that it can delete itself. This causes a race condition
        # between the uninstaller deleting the files and the rm command below
        # sleep for 10 seconds to give the uninstaller time to complete before
        # the installation directory is removed.
        sleep 10
    fi
fi


# safely creates/deletes a directory. If we pass this,
# then we know it is safe to remove the directory.

${TEST_BIN}/create-directory.sh -d "$executablepath" -n

rm -fR "$executablepath"

