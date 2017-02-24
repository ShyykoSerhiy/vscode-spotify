import {window, StatusBarAlignment, StatusBarItem, extensions} from 'vscode';
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
	 * Generator of color for button
	 */
	dynamicColor?: (cond: boolean) => string,
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

export interface ButtonWithDynamicText extends Button {
	/**
	 * Generator of text for button(Octicons)
	 */
	dynamicText: (cond: boolean) => string
}

export interface ButtonWithDynamicColor extends Button {
	/**
	 * Generator of color for button
	 */
	dynamicColor: (cond: boolean) => string
}

export class SpotifyControls {
	/**
	 * All buttons of vscode-spotify
	 */
	private _buttons: Button[];
	private _playPauseButton: ButtonWithDynamicText;
	private _muteUnmuteVolumeButton: ButtonWithDynamicText;
	private _toggleRepeatingButton: ButtonWithDynamicColor;
	private _toggleShufflingButton: ButtonWithDynamicColor;

	constructor() {
		var buttonsInfo = [
			{ id: 'next', text: '$(chevron-right)' },
			{ id: 'previous', text: '$(chevron-left)' },
			{ id: 'play', text: '$(triangle-right)' },
			{ id: 'pause', text: '$(primitive-square)' },
			{ id: 'playPause', text: '$(triangle-right)', dynamicText: (isPlaying?: boolean) => { return isPlaying ? '$(primitive-square)' : '$(triangle-right)' } },
			{ id: 'muteVolume', text: '$(mute)' },
			{ id: 'unmuteVolume', text: '$(unmute)' },
			{ id: 'muteUnmuteVolume', text: '$(mute)', dynamicText: (isMuted?: boolean) => { return isMuted ? '$(mute)' : '$(unmute)' } },
			{ id: 'volumeUp', text: '$(arrow-small-up)' },
			{ id: 'volumeDown', text: '$(arrow-small-down)' },
			{ id: 'toggleRepeating', text: '$(sync)', dynamicColor: (isRepeating?: boolean) => { return isRepeating ? 'white' : 'darkgrey' } },
			{ id: 'toggleShuffling', text: '$(git-branch)', dynamicColor: (isShuffling?: boolean) => { return isShuffling ? 'white' : 'darkgrey' } }
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
				this._playPauseButton = button as ButtonWithDynamicText;
				return;
			}
			if (button.id === 'muteUnmuteVolume') {
				this._muteUnmuteVolumeButton = button as ButtonWithDynamicText;
				return;
			}
			if (button.id === 'toggleRepeating') {
				this._toggleRepeatingButton = button as ButtonWithDynamicColor;
				return;
			}
			if (button.id === 'toggleShuffling') {
				this._toggleShufflingButton = button as ButtonWithDynamicColor;
			}
		})
	}

	get buttons(): Button[] {
		return this._buttons;
	}
	/**
	 * Updates dynamicText buttons
	 */
	updateDynamicButtons(playing: boolean, muted: boolean, repeating:boolean, shuffling: boolean):boolean {
		var changed = false;
		changed = this._updateText(this._playPauseButton, playing) || changed;
		changed = this._updateText(this._muteUnmuteVolumeButton, muted) || changed;
		changed = this._updateColor(this._toggleRepeatingButton, repeating) || changed;
		changed = this._updateColor(this._toggleShufflingButton, shuffling) || changed; 
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
	
	private _updateText(button: ButtonWithDynamicText, condition: boolean): boolean {
		if (!isButtonToBeShown(button.buttonName)) {
			return false;
		}
		const dynamicText = button.dynamicText(condition);
		if (dynamicText !== button.statusBarItem.text) {
			button.statusBarItem.text = dynamicText;
			return true;
		}
		return false;
	}

	private _updateColor(button: ButtonWithDynamicColor, condition: boolean): boolean {
		if (!isButtonToBeShown(button.buttonName)) {
			return false;
		}
		const dynamicColor = button.dynamicColor(condition);
		if (dynamicColor !== button.statusBarItem.color) {
			button.statusBarItem.color = dynamicColor;
			return true;
		}
		return false;
	}
}