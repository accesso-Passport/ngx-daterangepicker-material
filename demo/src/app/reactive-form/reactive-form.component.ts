import { Component, OnInit } from '@angular/core';
import * as dayjs from 'dayjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
	selector: 'reactive-form',
	templateUrl: './reactive-form.component.html',
	styleUrls: ['./reactive-form.component.scss']
})
export class ReactiveFormComponent implements OnInit {
	form: FormGroup;
	constructor(private fb: FormBuilder) {
		this.form = this.fb.group({
			selected: [
				{
					startDate: dayjs('2015-11-24T00:00Z'),
					endDate: dayjs('2015-11-26T00:00Z')
				},
				Validators.required
			]
		});
	}

	ngOnInit() {}
	submit() {
		console.log(this.form.value);
	}
}
