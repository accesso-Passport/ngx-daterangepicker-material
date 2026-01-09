import { Component, OnInit } from '@angular/core';
import dayjs from 'dayjs';
import { DateRangePreset } from '../../../../src/daterangepicker/date-range-picker.models';

@Component({
	selector: 'custom-ranges',
	templateUrl: './custom-ranges.component.html',
	styleUrls: ['./custom-ranges.component.scss'],
	standalone: false
})
export class CustomRangesComponent implements OnInit {
	selected: any;
	alwaysShowCalendars: boolean;
	showRangeLabelOnInput: boolean;
	keepCalendarOpeningWithRange: boolean;
	maxDate: dayjs.Dayjs;
	minDate: dayjs.Dayjs;
	invalidDates: dayjs.Dayjs[] = [dayjs().add(2, 'days'), dayjs().add(3, 'days'), dayjs().add(5, 'days')];
	ranges: DateRangePreset[] = [
		{
			key: 'today',
			label: 'Today',
			range: {start: dayjs(), end: dayjs()}
		},
		{
			key: 'yesterday',
			label: 'Yesterday!',
			range: {start: dayjs().subtract(1, 'days'), end: dayjs().subtract(1, 'days')}
		},
		{
			key: 'last-seven-days',
			label: 'Last 7 Days',
			range: {start: dayjs().subtract(6, 'days'), end: dayjs()}
		},
		{
			key: 'last-thirty-days',
			label: 'Last 30 Days',
			range: {start: dayjs().subtract(29, 'days'), end: dayjs()}
		}
	];

	isInvalidDate = (m: dayjs.Dayjs) => {
		return this.invalidDates.some(d => d.isSame(m, 'day'));
	}

	constructor() {
		this.maxDate = dayjs().add(2, 'weeks');
		this.minDate = dayjs().subtract(3, 'days');

		this.alwaysShowCalendars = true;
		this.keepCalendarOpeningWithRange = true;
		this.showRangeLabelOnInput = true;
		this.selected = { startDate: dayjs().subtract(1, 'days'), endDate: dayjs().subtract(1, 'days') };
	}
	rangeClicked(range) {
		console.log('[rangeClicked] range is : ', range);
	}
	datesUpdated(range) {
		console.log('[datesUpdated] range is : ', range);
	}

	ngOnInit() {}
}
