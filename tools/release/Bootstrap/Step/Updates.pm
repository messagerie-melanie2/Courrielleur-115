#
# Updates step. Generates binary update (MAR) files as well as AUS config
# snippets.
# 
package Bootstrap::Step::Updates;

use Bootstrap::Step;
use Bootstrap::Config;
use Bootstrap::Util qw(CvsCatfile SyncToStaging GetLocaleManifest);

use File::Find qw(find);
use POSIX qw(strftime);

use MozBuild::Util qw(MkdirWithPath);

@ISA = ("Bootstrap::Step");

sub Execute {
    my $this = shift;

    my $config = new Bootstrap::Config();
    my $product = $config->Get(var => 'product');
    my $logDir = $config->Get(sysvar => 'logDir');
    my $oldVersion = $config->Get(var => 'oldVersion');
    my $version = $config->Get(var => 'version');
    my $mozillaCvsroot = $config->Get(var => 'mozillaCvsroot');
    my $updateDir = $config->Get(var => 'updateDir');
    my $patcherConfig = $config->Get(var => 'patcherConfig');
    my $patcherToolsRev = $config->Get(var => 'patcherToolsRev');

    my $versionedUpdateDir = catfile($updateDir, $product . '-' . $version);

    # Create updates area.
    if (not -d $versionedUpdateDir) {
        MkdirWithPath(dir => $versionedUpdateDir) 
          or die("Cannot mkdir $versionedUpdateDir: $!");
    }

    # check out patcher
    $this->CvsCo(cvsroot => $mozillaCvsroot,
                 checkoutDir => 'patcher',
                 modules => [CvsCatfile('mozilla', 'tools', 'patcher')],
                 logFile => catfile($logDir, 'updates_patcher-checkout.log'),
                 workDir => $versionedUpdateDir
    );
          
    # check out utilities
    $this->CvsCo(cvsroot => $mozillaCvsroot,
                 checkoutDir => 'MozBuild',
                 modules => [CvsCatfile('mozilla', 'tools', 'release',
                                        'MozBuild')],
                 logFile => catfile($logDir,
                                    'updates_patcher-utils-checkout.log'),
                 workDir => catfile($versionedUpdateDir, 'patcher')
    );

    # this config lives in the public repo since bug 408849 was checked in
    $this->CvsCo(cvsroot => $mozillaCvsroot,
                 checkoutDir => 'config',
                 modules => [CvsCatfile('mozilla', 'tools', 'patcher-configs',
                                        $patcherConfig)],
                 logFile => catfile($logDir,
                                    'updates_patcher-config-checkout.log'),
                 workDir => $versionedUpdateDir
    );

    # build tools
    my $originalCvsrootEnv = $ENV{'CVSROOT'};
    $ENV{'CVSROOT'} = $mozillaCvsroot;
    $this->Shell(
      cmd => './patcher2.pl',
      cmdArgs => ['--build-tools', '--tools-revision=' . $patcherToolsRev,
                  '--app=' . $product, 
                  '--config=../config/' . $patcherConfig],
      logFile => catfile($logDir, 'updates_patcher-build-tools.log'),
      dir => catfile($versionedUpdateDir, 'patcher'),
    );
    if ($originalCvsrootEnv) {
        $ENV{'CVSROOT'} = $originalCvsrootEnv;
    }
    
    # download complete MARs
    $this->Shell(
      cmd => './patcher2.pl',
      cmdArgs => ['--download', '--app=' . $product,
                    '--config=../config/' . $patcherConfig],
      logFile => catfile($logDir, 'updates_patcher-download.log'),
      dir => catfile($versionedUpdateDir, 'patcher'),
    );

    # Create partial patches and snippets
    $this->Shell(
      cmd => './patcher2.pl',
      cmdArgs => ['--create-patches', '--app=' . $product, 
                    '--config=../config/' . $patcherConfig],
      logFile => catfile($logDir, 'updates_patcher-create-patches.log'),
      dir => catfile($versionedUpdateDir, 'patcher'),
      timeout => 18000,
    );
    
    ### quick verification
    my $fullUpdateDir = catfile($versionedUpdateDir, 'patcher', 'temp', 
                          $product, $oldVersion . '-' . $version);
    $snippetErrors = undef;   # evil (??) global to get results from callbacks
    
    # ensure that there are only test channels in aus2.test dir
    File::Find::find(\&TestAusCallback, catfile($fullUpdateDir,"aus2.test"));

    # ensure that there are only beta channels in beta dir (if that exists)
    if (-d catfile($fullUpdateDir, "aus2.beta")) {
      File::Find::find(\&BetaAusCallback, catfile($fullUpdateDir,"aus2.beta"));
      File::Find::find(\&ReleaseAusCallback, catfile($fullUpdateDir,"aus2"));
    } 
    # otherwise allow beta and release in aus2 dir
    else {
      File::Find::find(\&ReleaseBetaAusCallback, catfile($fullUpdateDir,"aus2"));
    }    

    if ($snippetErrors) {
        $snippetErrors =~ s!$fullUpdateDir/!!g;
	die("Execute: Snippets failed location checks: $snippetErrors\n");
    }
}

sub Verify {
    my $this = shift;

    my $config = new Bootstrap::Config();
    my $logDir = $config->Get(sysvar => 'logDir');
    my $version = $config->Get(var => 'version');
    my $mozillaCvsroot = $config->Get(var => 'mozillaCvsroot');
    my $verifyDir = $config->Get(var => 'verifyDir');
    my $product = $config->Get(var => 'product');
    my $verifyConfig = $config->Get(sysvar => 'verifyConfig');

    # Create verification area.
    my $verifyDirVersion = catfile($verifyDir, $product . '-' . $version);
    MkdirWithPath(dir => $verifyDirVersion) 
      or die("Could not mkdir $verifyDirVersion: $!");

    foreach my $dir ('updates', 'common') {
        $this->CvsCo(cvsroot => $mozillaCvsroot,
                     checkoutDir => $dir,
                     modules => [CvsCatfile('mozilla', 'testing', 'release',
                                            $dir)],
                     logFile => catfile($logDir,
                                 'updates_verify_checkout-' . $dir . '.log'),
                     workDir => $verifyDirVersion
        );
    }

    $this->BumpVerifyConfig();
    
    # Customize updates.cfg to contain the channels you are interested in 
    # testing.
    
    my $verifyLog = catfile($logDir, 'updates_verify.log');
    $this->Shell(
      cmd => './verify.sh', 
      cmdArgs => ['-c', $verifyConfig],
      logFile => $verifyLog,
      dir => catfile($verifyDirVersion, 'updates'),
      timeout => 36000,
    );

    $this->CheckLog(
        log => $verifyLog,
        notAllowed => '^FAIL',
    );
}

# locate snippets for which the channel doesn't end in test
sub TestAusCallback { 
    my $dir = $File::Find::name;
    if ( ($dir =~ /\.txt/) and 
         (not $dir =~ /\/\w*test\/(partial|complete)\.txt$/)) {
           $snippetErrors .= "\nNon-test: $dir";
    }
}

# locate snippets for which the channel isn't beta
sub BetaAusCallback { 
    my $dir = $File::Find::name;
    if ( ($dir =~ /\.txt/) and 
         (not $dir =~ /\/beta\/(partial|complete)\.txt$/)) {
           $snippetErrors .= "\nNon-beta: $dir";
    }
}

# locate snippets for which the channel isn't release
sub ReleaseAusCallback { 
    my $dir = $File::Find::name;
    if ( ($dir =~ /\.txt/) and 
         (not $dir =~ /\/release\/(partial|complete)\.txt$/)) {
           $snippetErrors .= "\nNon-release: $dir";
    }
}

# locate snippets for which the channel isn't release or beta
sub ReleaseBetaAusCallback { 
    my $dir = $File::Find::name;
    if ( ($dir =~ /\.txt/) and 
         (not $dir =~ /\/(release|beta)\/(partial|complete)\.txt$/)) {
           $snippetErrors .= "\nNon-release: $dir";
    }
}

sub PermissionsAusCallback {
    my $dir = $File::Find::name;

    if (-f $dir) {
	chmod(0644, $dir) or die("Couldn't chmod $dir to 644: $!");
    } elsif (-d $dir) {
	chmod(0775, $dir) or die("Couldn't chmod $dir to 775: $!");
    }
}

sub BumpVerifyConfig {
    my $this = shift;

    my $config = new Bootstrap::Config();
    my $osname = $config->SystemInfo(var => 'osname');
    my $product = $config->Get(var => 'product');
    my $oldVersion = $config->Get(var => 'oldVersion');
    my $version = $config->Get(var => 'version');
    my $rc = $config->Get(var => 'rc');
    my $oldRc = $config->Get(var => 'oldRc');
    my $appName = $config->Get(var => 'appName');
    my $mozillaCvsroot = $config->Get(var => 'mozillaCvsroot');
    my $verifyDir = $config->Get(var => 'verifyDir');
    my $ausServerUrl = $config->Get(var => 'ausServerUrl');
    my $externalStagingServer = $config->Get(var => 'externalStagingServer');
    my $verifyConfig = $config->Get(sysvar => 'verifyConfig');
    my $logDir = $config->Get(sysvar => 'logDir');
    my $linuxExtension = $config->GetLinuxExtension();

    my $verifyDirVersion = catfile($verifyDir, $product . '-' . $version);
    my $configFile = catfile($verifyDirVersion, 'updates', $verifyConfig);

    # NOTE - channel is hardcoded to betatest
    my $channel = 'betatest';

    # grab os-specific buildID file on FTP
    my $candidateDir = CvsCatfile($config->GetFtpNightlyDir(), $oldVersion . '-candidates', 'rc' . $oldRc ) . '/';

    my $buildID = $this->GetBuildIDFromFTP(os => $osname, releaseDir => $candidateDir);

    my $buildTarget = undef;
    my $releaseFile = undef;
    my $nightlyFile = undef;
    my $ftpOsname = undef;

    if ($osname eq 'linux') {
        $buildTarget = 'Linux_x86-gcc3';
        $platform = 'linux';
        $ftpOsname = 'linux-i686';
        $releaseFile = $product.'-'.$oldVersion.'.tar.'.$linuxExtension;
        $nightlyFile = $product.'-'.$version.'.%locale%.linux-i686.tar.'.
         $linuxExtension;
    } elsif ($osname eq 'macosx') {
        $buildTarget = 'Darwin_Universal-gcc3';
        $platform = 'osx';
        $ftpOsname = 'mac';
        $releaseFile = ucfirst($product).' '.$oldVersion.'.dmg';
        $nightlyFile = $product.'-'.$version.'.%locale%.mac.dmg';
    } elsif ($osname eq 'win32') {
        $buildTarget = 'WINNT_x86-msvc';
        $platform = 'win32';
        $ftpOsname = 'win32';
        $releaseFile = ucfirst($product).' Setup '.$oldVersion.'.exe';
        $nightlyFile = $product.'-'.$version.'.%locale%.win32.installer.exe';
    } else {
        die("ASSERT: unknown OS $osname");
    }

    open(FILE, "< $configFile") or die ("Could not open file $configFile: $!");
    my @origFile = <FILE>;
    close(FILE) or die ("Could not close file $configFile: $!");

    if ($origFile[0] =~ $oldVersion) {
            $this->Log('msg' => "verifyConfig $configFile already bumped");
            return;
    }

    # remove "from" and "to" vars from @origFile
    my @strippedFile = ();
    for(my $i=0; $i < scalar(@origFile); $i++) {
        my $line = $origFile[$i];
        $line =~ s/from.*$//;
        $strippedFile[$i] = $line;
    }

    my $localeFileTag = uc($product).'_'.$oldVersion.'_RELEASE';
    $localeFileTag =~ s/\./_/g;
    my $localeManifest = GetLocaleManifest(app => $appName,
                                           cvsroot => $mozillaCvsroot,
                                           tag => $localeFileTag);

    my @locales = ();
    foreach my $locale (keys(%{$localeManifest})) {
        foreach my $allowedPlatform (@{$localeManifest->{$locale}}) {
            if ($allowedPlatform eq $platform) {
                push(@locales, $locale);
            }
        }
    }

    # add data for latest release
    my @data = ("# $oldVersion $osname\n",
                'release="' . $oldVersion . '" product="' . ucfirst($product) . 
                '" platform="' .$buildTarget . '" build_id="' . $buildID . 
                '" locales="' . join(' ', sort(@locales)) . '" channel="' . 
                $channel . '" from="/' . $product . '/releases/' . 
                $oldVersion . '/' . $ftpOsname . '/%locale%/' . $releaseFile .
                '" aus_server="' . $ausServerUrl . '" ftp_server="' .
                $externalStagingServer . '/pub/mozilla.org" to="/' . 
                $product . '/nightly/' .  $version .  '-candidates/rc' . 
                $rc . '/' . $nightlyFile . '"' .  "\n");

    open(FILE, "> $configFile") or die ("Could not open file $configFile: $!");
    print FILE @data;
    print FILE @strippedFile;
    close(FILE) or die ("Could not close file $configFile: $!");

    $this->Shell(
      cmd => 'cvs',
      cmdArgs => ['-d', $mozillaCvsroot,
                  'ci', '-m',
                  '"Automated configuration bump, release for '
                  . $product  . ' ' . $version . "rc$rc" . '"',
                  $verifyConfig],
      logFile => catfile($logDir, 'update_verify-checkin.log'),
      dir => catfile($verifyDirVersion, 'updates')
    );
}

sub Push {
    my $this = shift;

    my $config = new Bootstrap::Config();
    my $logDir = $config->Get(sysvar => 'logDir');
    my $product = $config->Get(var => 'product');
    my $version = $config->Get(var => 'version');
    my $rc = $config->Get(var => 'rc');
    my $oldVersion = $config->Get(var => 'oldVersion');
    my $stagingUser = $config->Get(var => 'stagingUser');
    my $stagingServer = $config->Get(var => 'stagingServer');
    my $ausUser = $config->Get(var => 'ausUser');
    my $ausServer = $config->Get(var => 'ausServer');
    my $updateDir = $config->Get(var => 'updateDir');

    my $pushLog = catfile($logDir, 'updates_push.log');
    my $fullUpdateDir = catfile($updateDir, $product . '-' . $version,
                                 'patcher', 'temp', $product, 
                                  $oldVersion . '-' . $version);
    my $candidateDir = $config->GetFtpCandidateDir(bitsUnsigned => 0);

    # push partial mar files up to ftp server
    my $marsDir = catfile('ftp', $product, 'nightly', 
                            $version . '-candidates', 'rc' . $rc) . '/';

    chmod(0644, glob(catfile($fullUpdateDir,$marsDir,"*partial.mar")))
	or die("Couldn't chmod a partial mar to 644: $!");
    $this->Shell(
     cmd => 'rsync',
     cmdArgs => ['-av', '-e', 'ssh',
                 '--include=*partial.mar', 
                 '--exclude=*',
                 $marsDir,
                 $stagingUser . '@' . $stagingServer . ':' . $candidateDir],
     dir => $fullUpdateDir,
     logFile => $pushLog,
   );

    # push update snippets to AUS server
    my $pushDir = strftime("%Y%m%d", localtime) . '-' . ucfirst($product) . 
                           '-' . $version;
    my $targetPrefix =  CvsCatfile('/opt','aus2','snippets','staging',
                                   $pushDir);
    $config->Set(var => 'ausDeliveryDir', value => $targetPrefix);

    my @snippetDirs = glob(catfile($fullUpdateDir, "aus2*"));

    File::Find::find(\&PermissionsAusCallback, @snippetDirs);

    foreach $dir (@snippetDirs) {
      my $targetDir = $targetPrefix;
      if ($dir =~ /aus2\.(.*)$/) {
        $targetDir .= '-' . $1;
      }

      $this->Shell(
        cmd => 'rsync',
        cmdArgs => ['-av', 
                    '-e', 'ssh -i ' . catfile($ENV{'HOME'},'.ssh','aus'),
                    $dir . '/', 
                    $ausUser . '@' . $ausServer . ':' . $targetDir],
        logFile => $pushLog,
      );
    }

    SyncToStaging();

    # Push test channels live
    $this->Shell(
      cmd => 'ssh', 
      cmdArgs => ['-i ' . catfile($ENV{'HOME'},'.ssh','aus'),
                  $ausUser . '@' . $ausServer,
                  '/home/cltbld/bin/pushsnip', $pushDir . '-test'],
      logFile => $pushLog,
    );
}

sub Announce {
    my $this = shift;

    my $config = new Bootstrap::Config();
    my $product = $config->Get(var => 'product');
    my $version = $config->Get(var => 'version');

    $this->SendAnnouncement(
      subject => "$product $version update step finished",
      message => "$product $version updates finished. Partial mars were copied to the candidates dir, and the test snippets were pushed live.",
    );
}

1;
