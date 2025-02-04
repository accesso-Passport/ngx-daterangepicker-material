import { Component, OnInit } from '@angular/core';
import dayjs from 'dayjs';

@Component({
	selector: 'app-timepicker',
	templateUrl: './timepicker.component.html'
})
export class TimepickerComponent implements OnInit {
	selected: { startDate: dayjs.Dayjs; endDate: dayjs.Dayjs };
	constructor() {
		this.selected = {
			startDate: dayjs('2015-11-18T00:00Z'),
			endDate: dayjs('2015-11-26T00:00Z')
		};
	}

	ngOnInit() {}
}
