import { extensions, StatusBarAlignment, StatusBarItem, window } from 'vscode';

import { getButtonPriority, isButtonToBeShown } from '../config/spotify-config';
import { BUTTON_ID_SIGN_IN, BUTTON_ID_SIGN_OUT } from '../consts/consts';

export interface Button {
    /**
     * Id of button
     */
    id: string;
    /**
     * Text of button(Octicons)
     */
    text: string;
    /**
     * Generator of text for button(Octicons)
     */
    dynamicText?: (cond: boolean) => string;
    /**
     * Generator of color for button
     */
    dynamicColor?: (cond: boolean) => string;
    /**
     * Name of a button
     */
    buttonName: string;
    /**
     * Command that is executed when button is pressed
     */
    buttonCommand: string;
    /**
     * Priority of button (higher means closer to left side)
     */
    buttonPriority: number;
    /**
     * True if button is enabled in settings
     */
    visible: boolean;
    /**
     * vscode status bar item
     */
    statusBarItem: StatusBarItem;
}

export interface ButtonWithDynamicText extends Button {
    /**
     * Generator of text for button(Octicons)
     */
    dynamicText: (cond: boolean) => string;
}

export interface ButtonWithDynamicColor extends Button {
    /**
     * Generator of color for button
     */
    dynamicColor: (cond: boolean) => string;
}

export class SpotifyControls {
    get buttons(): Button[] {
        return this._buttons;
    }

    /**
     * All buttons of vscode-spotify
     */
    private _buttons: Button[];
    private _playPauseButton!: ButtonWithDynamicText;
    private _muteUnmuteVolumeButton!: ButtonWithDynamicText;
    private _toggleRepeatingButton!: ButtonWithDynamicColor;
    private _toggleShufflingButton!: ButtonWithDynamicColor;
    private _signInButton!: Button;
    private _signOutButton!: Button;

    constructor() {
        const buttonsInfo = [
            { id: 'next', text: '$(chevron-right)' },
            { id: 'previous', text: '$(chevron-left)' },
            { id: 'play', text: '$(play)' },
            { id: 'pause', text: '$(debug-pause)' },
            {
                id: 'playPause',
                text: '$(play)',
                dynamicText: (isPlaying?: boolean) => isPlaying ? '$(debug-pause)' : '$(play)'
            },
            { id: 'muteVolume', text: '$(mute)' },
            { id: 'unmuteVolume', text: '$(unmute)' },
            { id: 'muteUnmuteVolume', text: '$(mute)', dynamicText: (isMuted?: boolean) => isMuted ? '$(mute)' : '$(unmute)' },
            { id: 'volumeUp', text: '$(arrow-up)' },
            { id: 'volumeDown', text: '$(arrow-down)' },
            { id: 'toggleRepeating', text: '$(sync)', dynamicColor: (isRepeating?: boolean) => isRepeating ? 'white' : 'darkgrey' },
            { id: 'toggleShuffling', text: '$(source-control)', dynamicColor: (isShuffling?: boolean) => isShuffling ? 'white' : 'darkgrey' },
            { id: 'lyrics', text: '$(book)' },
            { id: BUTTON_ID_SIGN_IN, text: '$(sign-in)' },
            { id: BUTTON_ID_SIGN_OUT, text: '$(sign-out)' }
        ];
        const extension = extensions.getExtension('shyykoserhiy.vscode-spotify');
        if (!extension) {
            this._buttons = [];
            return;
        }
        const commands: { command: string, title: string }[] = extension.packageJSON.contributes.commands;
        this._buttons = buttonsInfo.map(item => {
            const buttonName = item.id + 'Button';
            const buttonCommand = 'spotify.' + item.id;
            const buttonPriority = getButtonPriority(buttonName);
            const visible = isButtonToBeShown(buttonName);
            const statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left, buttonPriority);
            const {title} = commands.filter(command => command.command === buttonCommand)[0] || { title: '' };
            statusBarItem.text = item.text;
            statusBarItem.command = buttonCommand;
            statusBarItem.tooltip = title;

            return Object.assign({}, item, { buttonName, buttonCommand, buttonPriority, statusBarItem, visible });
        });
        this._buttons.forEach(button => {
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
                return;
            }
            if (button.id === BUTTON_ID_SIGN_IN) {
                this._signInButton = button;
                return;
            }
            if (button.id === BUTTON_ID_SIGN_OUT) {
                this._signOutButton = button;
            }
        });
    }

    /**
     * Updates dynamicText buttons
     */
    updateDynamicButtons(playing: boolean, muted: boolean, repeating: boolean, shuffling: boolean): boolean {
        let changed = false;
        changed = this._updateText(this._playPauseButton, playing) || changed;
        changed = this._updateText(this._muteUnmuteVolumeButton, muted) || changed;
        changed = this._updateColor(this._toggleRepeatingButton, repeating) || changed;
        changed = this._updateColor(this._toggleShufflingButton, shuffling) || changed;
        return changed;
    }

    showHideAuthButtons() {
        this._hideShowButton(this._signInButton);
        this._hideShowButton(this._signOutButton);
    }

    /**
    * Show buttons that are visible
    */
    showVisible() {
        this.buttons.forEach(button => button.visible && button.statusBarItem.show());
    }

    /**
     * Hides all the buttons except auth buttons
     */
    hideAll() {
        this.buttons.forEach(button => {
            if (button === this._signInButton || button === this._signOutButton) {
                return;
            }
            button.statusBarItem.hide();
        });
    }

    /**
    * Disposes all the buttons
    */
    dispose() {
        this.buttons.forEach(button => { button.statusBarItem.dispose(); });
    }
    private _hideShowButton(button: Button) {
        button.visible = isButtonToBeShown(button.buttonName);
        button.visible ? button.statusBarItem.show() : button.statusBarItem.hide();
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
