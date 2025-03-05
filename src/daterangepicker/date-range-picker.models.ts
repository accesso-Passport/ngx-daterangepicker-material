import { dayjs } from './dayjs.lib';

export interface DateRangePreset {
	key: string;
	label: string;
	range: {
		start: dayjs.Dayjs,
		end: dayjs.Dayjs
	};
}
