import { Component, OnInit } from '@angular/core';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
dayjs.extend(weekday);

@Component({
    selector: 'single-datepicker',
    templateUrl: './single-datepicker.component.html',
    styleUrls: ['./single-datepicker.component.scss'],
    standalone: false
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
