import { Injectable, Inject } from '@angular/core';
import { DefaultLocaleConfig, LOCALE_CONFIG, LocaleConfig } from '../date-range-picker.config';

@Injectable()
export class LocaleService {
	constructor(@Inject(LOCALE_CONFIG) private _config: LocaleConfig) {}

	get config() {
		return { ...DefaultLocaleConfig, ...this._config };
	}
}
