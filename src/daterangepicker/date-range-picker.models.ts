import * as dayjs from 'dayjs';

export interface DateRangePreset {
	key: string;
	label: string;
	range: {
		start: dayjs.Dayjs,
		end: dayjs.Dayjs
	};
}
