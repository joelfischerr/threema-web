/**
 * This file is part of Threema Web.
 *
 * Threema Web is free software: you can redistribute it and/or modify it
 * under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or (at
 * your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero
 * General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Threema Web. If not, see <http://www.gnu.org/licenses/>.
 */
import {SettingsService} from './settings';

export class ThemeService {

    private $log: ng.ILogService;

    private settingsService: SettingsService;
    private logTag = '[ThemeService]';

    public currentTheme = '';
    public themeOptions = ['Light (White)', 'Dark (Black)'];

    public static $inject = ['$log', 'SettingsService'];

    constructor($log: ng.ILogService, settingsService: SettingsService) {
        this.$log = $log;
        this.settingsService = settingsService;
    }

    public init(): void {
        this.currentTheme = this.getTheme();
    }

    /**
     * Sets the theme to themeName
     */
    public setTheme(themeName: string): void {
        this.storeSetting('ThemeService.THEME_SETTING', themeName);
        this.loadTheme();
    }

    /**
     * Retrieves the theme from settings
     */
    public getTheme(): string {
        const theme = this.retrieveSetting('ThemeService.THEME_SETTING');
        return theme ? theme : 'Light (White)';
    }

    /*
    * Returns false if the original icon should be used
    * and true if the _dark icon should be usedl
    */
    private iconColor(): boolean {
        return (this.getTheme() === 'Dark (Black)');
    }

    public imageFilename(fn: string): string {
        if (fn == null) {
            return null;
        }
        const ext = this.iconColor() ? '_dark' : '';
        const fnl = fn.length;
        return fn.substring(0, fnl - 4) + ext + fn.substring(fnl - 4, fnl);
    }

    /**
     * Changes the theme to the one currently stored in the settings
     */
    public loadTheme() {
        let themeName = this.getTheme();

        if (themeName === 'Dark (Black)') {
            themeName = 'app-dark.css';
        } else if (themeName === 'Light (White)') {
            themeName = 'app-light.css';
        } else {
            themeName = 'app-light.css';
        }
        this.switchTheme(themeName);
    }

    private switchTheme(themeName: string) {
        const cssId = 'themeID';
        const head = document.getElementsByTagName('head')[0];
        const oldTheme = document.getElementById(cssId);
        const link = document.createElement('link');
        link.id = cssId;
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = '/css/' + themeName;
        link.media = 'all';
        head.appendChild(link);
        head.removeChild(oldTheme);
    }

    /**
     * Stores the given key/value pair in local storage
     */
    private storeSetting(key: string, value: string): void {
        this.settingsService.storeUntrustedKeyValuePair(key, value);
    }

    /**
     * Retrieves the value for the given key from local storage
     */
    private retrieveSetting(key: string): string {
        return this.settingsService.retrieveUntrustedKeyValuePair(key);
    }
}
