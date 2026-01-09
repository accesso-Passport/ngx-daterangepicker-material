import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'date',
    standalone: false
})
export class DynamicDatePipe implements PipeTransform {
	constructor(private datePipe: DatePipe) {}

	transform(
		value: any,
		format?: string,
		timezone?: string,
		locale?: string
	): string | null {
		return this.datePipe.transform(value, format, timezone, locale);
	}
}
