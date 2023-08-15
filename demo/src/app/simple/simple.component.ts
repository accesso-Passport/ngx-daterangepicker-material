import { Component, OnInit, ViewChild } from '@angular/core';
import * as dayjs from 'dayjs';
import { DateRangePickerComponent, DateRangePickerDirective, LocaleConfig } from '../../../../src/daterangepicker';

@Component({
	selector: 'app-simple',
	templateUrl: './simple.component.html',
	styleUrls: ['./simple.component.scss']
})
export class SimpleComponent implements OnInit {
	selected: { startDate: dayjs.Dayjs; endDate: dayjs.Dayjs };
	@ViewChild(DateRangePickerDirective, { static: true }) pickerDirective: DateRangePickerDirective;
	inlineDate: any;
	inlineDateTime: any;
	picker: DateRangePickerComponent;
	locale: LocaleConfig = {
		applyLabel: 'DONE',
		clearLabel: 'RESET'
	};
	constructor() {
		this.selected = {
			startDate: dayjs('2015-11-18T00:00Z'),
			endDate: dayjs('2015-11-26T00:00Z')
		};
	}

	ngOnInit() {
		this.picker = this.pickerDirective.picker;
	}
	ngModelChange(e) {
		console.log('ngModelChange', e);
	}
	change(e) {
		console.log('change', e);
	}
	choosedDate(e) {
		this.inlineDate = e;
	}

	choosedDateTime(e) {
		this.inlineDateTime = e;
	}
	open(e) {
		this.pickerDirective.open(e);
	}
	clear(e) {
		// this.picker.clear(); // we can do
		this.selected = null; // now we can do
	}
}
