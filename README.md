# vscode-spotify
Use Spotify inside vscode(on Mac).
Provides integration with Spotify on **Mac ONLY**.

## How it works
This extension uses https://github.com/andrehaveman/spotify-node-applescript to communicate with Spotify.

## Features
* Shows the currently playing song in status bar of vscode.
![status bar](media/screenshot.png)
* Provides commands for controlling Spotify from vscode. List of commands:
```json
"commands": [
	{
		"command": "spotify.next",
		"title": "Spotify Play Next Song"
	},
	{
		"command": "spotify.previous",
		"title": "Spotify Play Previous Song"
	},
	{
		"command": "spotify.play",
		"title": "Spotify Play"
	},
	{
		"command": "spotify.pause",
		"title": "Spotify Pause"
	},
	{
		"command": "spotify.playPause",
		"title": "Spotify Play|Pause"
	},
	{
		"command": "spotify.muteVolume",
		"title": "Spotify Mute Volume"
	},
	{
		"command": "spotify.unmuteVolume",
		"title": "Spotify Unmute Volume"
	},
	{
		"command": "spotify.volumeUp",
		"title": "Spotify Volume Up"
	},
	{
		"command": "spotify.volumeDown",
		"title": "Spotify Volume Down"
	}
]
```

* Provides hotkeys:
```json
"keybindings": [
	{
		"command": "spotify.next",
		"key": "ctrl+shift+]",
		"mac": "cmd+shift+]"
	},
	{
		"command": "spotify.previous",
		"key": "ctrl+shift+[",
		"mac": "cmd+shift+["
	},
	{
		"command": "spotify.volumeUp",
		"key": "ctrl+shift+'",
		"mac": "cmd+shift+'"
	},
	{
		"command": "spotify.volumeDown",
		"key": "ctrl+shift+;",
		"mac": "cmd+shift+;"
	}
]
```

Note that out of the box hotkeys are only provided for those four commands. If you want to assign hotkeys to  other commands(or change existing) look at
[Adding or changing hotkeys](#adding-or-changing-hotkeys) section below.

##Adding or changing hotkeys:
All keyboard shortcuts in VS Code can be customized via the User/keybindings.json file.

To configure keyboard shortcuts the way you want, go to the menu under File , Preferences , Keyboard Shortcuts.
This will open the Default Keyboard Shortcuts on the left and your User/keybindings.json file where you can overwrite the default bindings on the right.

Example :
```json
{
		"command": "spotify.volumeDown",
		"key": "cmd+shift+g"
}
```

For more info on hotkeys please look at https://code.visualstudio.com/docs/customization/keybindings

[MIT](LICENSE)