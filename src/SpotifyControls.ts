import {workspace, window, StatusBarAlignment, StatusBarItem, extensions} from 'vscode';
import {getButtonPriority, isButtonToBeShown} from './config/SpotifyConfig';

export interface Button {
	/**
	 * Id of button
	 */
	id: string,
	/**
	 * Text of button(Octicons)
	 */
	text: string,
	/**
	 * Generator of text for button(Octicons)
	 */
	dynamicText?: (cond: boolean) => string,
	/**
	 * Name of a button
	 */
	buttonName: string,
	/**
	 * Command that is executed when button is pressed
	 */
	buttonCommand: string,
	/**
	 * Priority of button (higher means closer to left side)
	 */
	buttonPriority: number,
	/**
	 * True if button is enabled in settings
	 */
	visible: boolean,
	/**
	 * vscode status bar item
	 */
	statusBarItem: StatusBarItem
}

export class SpotifyControls {
	/**
	 * All buttons of vscode-spotify
	 */
	private _buttons: Button[];
	private _playPauseButton: Button;
	private _muteUnmuteVolumeButton: Button;

	constructor() {
		var buttonsInfo = [
			{ id: 'next', text: '$(chevron-right)' },
			{ id: 'previous', text: '$(chevron-left)' },
			{ id: 'play', text: '$(triangle-right)' },
			{ id: 'pause', text: '$(primitive-square)' },
			{ id: 'playPause', text: '$(triangle-right)', dynamicText: (isPlaying?: boolean) => { return isPlaying ? '$(triangle-right)' : '$(primitive-square)' } },
			{ id: 'muteVolume', text: '$(mute)' },
			{ id: 'unmuteVolume', text: '$(unmute)' },
			{ id: 'muteUnmuteVolume', text: '$(mute)', dynamicText: (isMuted?: boolean) => { return isMuted ? '$(mute)' : '$(unmute)' } },
			{ id: 'volumeUp', text: '$(arrow-small-up)' },
			{ id: 'volumeDown', text: '$(arrow-small-down)' }
		];
		var commands: { command: string, title: string }[] = extensions.getExtension('shyykoserhiy.vscode-spotify').packageJSON.contributes.commands;
		this._buttons = buttonsInfo.map((item) => {
			const buttonName = item.id + 'Button';
			const buttonCommand = 'spotify.' + item.id;
			const buttonPriority = getButtonPriority(buttonName);
			const visible = isButtonToBeShown(buttonName);
			const statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left, buttonPriority);
			const {title} = commands.filter((command) => { return command.command === buttonCommand })[0] || { title: '' };
			statusBarItem.text = item.text;
			statusBarItem.command = buttonCommand;
			statusBarItem.tooltip = title;

			return Object.assign({}, item, { buttonName, buttonCommand, buttonPriority, statusBarItem, visible });
		});
		this._buttons.forEach((button) => {
			if (button.id === 'playPause') {
				this._playPauseButton = button;
				return;
			}
			if (button.id === 'muteUnmuteVolume') {
				this._muteUnmuteVolumeButton = button;
			}
		})
	}

	get buttons(): Button[] {
		return this._buttons;
	}
	/**
	 * Updates dynamicText buttons
	 */
	updateDynamicButtons(playing: boolean, muted: boolean):boolean {
		var changed = false;
		const playPauseDynamicText = this._playPauseButton.dynamicText(playing);
		if (playPauseDynamicText !== this._playPauseButton.statusBarItem.text) {
			this._playPauseButton.statusBarItem.text = playPauseDynamicText;
			changed = true;
		}
		const mutedDynamicText = this._muteUnmuteVolumeButton.dynamicText(muted);
		if (mutedDynamicText !== this._muteUnmuteVolumeButton.statusBarItem.text) {
			this._muteUnmuteVolumeButton.statusBarItem.text = mutedDynamicText;
			changed = true;
		}
		return changed;
    }
	/**
	* Show buttons that are visible
	*/
	showVisible() {
		this.buttons.forEach((button) => { button.visible && button.statusBarItem.show(); });
	}

	/**
	 * Hides all the buttons
	 */
	hideAll() {
		this.buttons.forEach((button) => { button.statusBarItem.hide(); });
	}
	/**
	* Disposes all the buttons
	*/
	dispose() {
		this.buttons.forEach((button) => { button.statusBarItem.dispose(); });
	}
}