import { Component, OnInit } from '@angular/core';
import * as dayjs from 'dayjs';
import * as weekday from 'dayjs/plugin/weekday';
dayjs.extend(weekday);

@Component({
	selector: 'single-datepicker',
	templateUrl: './single-datepicker.component.html',
	styleUrls: ['./single-datepicker.component.scss']
})
export class SingleDatepickerComponent implements OnInit {
	selected = dayjs();

	constructor() {}
	ngOnInit() {}
	isInvalidDate(date: dayjs.Dayjs) {
		return date.weekday() === 0;
	}
	isCustomDate(date: dayjs.Dayjs) {
		return date.weekday() === 0 || date.weekday() === 6 ? 'mycustomdate' : false;
	}
}
