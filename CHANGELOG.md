# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) 
and this project adheres to [Semantic Versioning](http://semver.org/).

## [3.0.2] - 2018-10-07
### Fixed
- Missing option for show signIn and signOut button #54 (kudos to negebauer(Nicolás Gebauer))

## [3.0.1] - 2018-10-07
### Fixed
- Tooltip Missing Album Name in Tree Track. #52 (kudos to mikqi(Muhammad Rivki))

## [3.0.0] - 2018-10-05
### Added
- Spotify Web Api implementation to enable this extension on Windows.
- Playlist/tracks custom view TreeDataProviders.
### Refactored
- Refactored state to use Redux.
### Fixed
- Spotilocal is not initialized. #46
- Installed vscode-spotify extension but not working #43
- Status Bar Icons Disappeared #42
- Utilize the new Spotify Player API #27

## [2.6.1] - 2018-08-30
### Fixed
- Fixed Play, Pause, PlayPause, Volume controlls on linux. ONLY on Linux(dbus)
- Fixed performance issue on MacOs(to manny querys)

## [2.6.0] - 2018-08-27
### Fixed
- Fix for Status Bar Icons Disappeared (#42). ONLY on Linux(dbus)

## [2.5.1] - 2018-07-23
### Fixed
- Emergency fix for Status Bar Icons Disappeared (#42). ONLY on MacOS

## [2.5.0] - 2018-06-26
### Fixed
- Use dbus on Linux (improved linux support) (#14) (kudos to audstanley(Richard Stanley)(https://github.com/audstanley))

## [2.4.0] - 2018-03-25
### Fixed
- Change default mac keybindings for play previous/next (#34) (kudos to ecbrodie(Evan Brodie)(https://github.com/ecbrodie)) @see the reasoning behind this at https://github.com/ShyykoSerhiy/vscode-spotify/pull/34

## [2.3.2] - 2018-02-23
### Fixed
- `trackInfoPriority` setting has no effect (#30) (kudos to realbizkit(András Szepes)(https://github.com/realbizkit))

## [2.3.1] - 2018-02-09
### Fixed
- Increasing volume at max makes it go to 0 (#15)

## [2.3.0] - 2018-02-06
### Added
- Show album title (via config spotify.trackInfoFormat) #28 (kudos to @mrcasals(Marc Riera) (https://github.com/mrcasals))
- Lyrics in split panel window (via spotify.openPanelLyrics) #22 (kudos to @xeBuz(Jesús Roldán) (https://github.com/xeBuz))

## [2.2.1] - 2017-10-10
### Fixed
- Remember last successfully used port (initialize speed up) #21 (kudos to @levrik(Levin Rickert) (https://github.com/levrik))

## [2.2.0] - 2017-09-30
### Fixed
- When Spotify is not open: "Failed to initialize vscode-spotify. We'll keep trying every 20 seconds." #20
### Changed
- useCombinedApproachOnMacOS is now true by default.

## [2.1.1] - 2017-09-24
### Fixed
- Updated info in Readme.md

## [2.1.0] - 2017-09-24
### Added 
- Implemented status long-polling on Windows and Linux #19 (kudos to @levrik(Levin Rickert) (https://github.com/levrik))
- Experimental applescript + http implementation of spotify client to reduce CPU usage on MacOs and improve status updating. Set spotify.useCombinedApproachOnMacOS to true to try out! (fixes https://github.com/ShyykoSerhiy/vscode-spotify/issues/12)
### Fixed
- High CPU usage on MacOS #12 (via spotify.useCombinedApproachOnMacOS)

## [2.0.1] - 2017-09-23
### Fixed
- Failed to initialize vscode-spotify. We'll keep trying every 20 seconds. (New VSCode Insiders / New Spotify ?) #17

## [2.0.0] - 2017-05-22
### Added
- Added lyrics button(via Genius API). @see https://github.com/shyykoserhiy/vscode-spotify-lyrics
- Added prefix 'vscode-spotify' for all messages from this extension. 

## [1.1.0] - 2017-02-27
### Added
- Added statusCheckInterval param.

## [1.0.0] - 2016-09-14
### Added
- initial implementation of windows & linux support.

## [0.0.5] - 2015-12-08
### Added
- added dynamic colors for buttons
- added spotify.toggleRepeating and spotify.toggleShuffling commands
- added buttons to status bar

### Fixed
- Extension reopens Spotify if it gets closed. #4
- Sometimes there is error (unexpected tocken u), that hides all the buttons. #3
- Wrong stopped/playing state #2

## [0.0.2] - 2015-11-25
### Added
- initial release
