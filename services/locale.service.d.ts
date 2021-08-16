import { LocaleConfig } from '../date-range-picker.config';
export declare class LocaleService {
    private _config;
    constructor(_config: LocaleConfig);
    readonly config: {
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
    };
}
