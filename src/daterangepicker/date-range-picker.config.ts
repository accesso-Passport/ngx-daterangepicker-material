import { InjectionToken } from '@angular/core';
import { dayjs } from './dayjs.lib';

export const LOCALE_CONFIG = new InjectionToken<LocaleConfig>('daterangepicker.config');
/**
 *  LocaleConfig Interface
 */
export interface LocaleConfig {
	direction?: string;
	separator?: string;
	weekLabel?: string;
	applyLabel?: string;
	cancelLabel?: string;
	clearLabel?: string;
	customRangeLabel?: string;
	startDateLabel?: string;
	endDateLabel?: string;
	daysOfWeek?: string[];
	monthNames?: string[];
	firstDay?: number;
	format?: string;
	displayFormat?: string;
	localeId?: string;
}
/**
 *  DefaultLocaleConfig
 */
export const DefaultLocaleConfig: LocaleConfig = {
	direction: 'ltr',
	separator: ' - ',
	weekLabel: 'W',
	applyLabel: 'Done',
	cancelLabel: 'Reset',
	clearLabel: 'Clear',
	startDateLabel: 'Start Date',
	endDateLabel: 'End Date',
	customRangeLabel: 'Presets',
	daysOfWeek: dayjs.weekdaysMin(),
	monthNames: dayjs.months(),
	firstDay: dayjs.localeData().firstDayOfWeek()
};
