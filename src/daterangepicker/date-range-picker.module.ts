import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';

import { DateRangePickerComponent } from './components/date-range-picker.component';
import { LOCALE_CONFIG, LocaleConfig } from './date-range-picker.config';
import { DateRangePickerDirective } from './directives/date-range-picker.directive';
import { LocaleService } from './services/locale.service';

@NgModule({
    declarations: [DateRangePickerComponent, DateRangePickerDirective],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatIconModule,
        MatButtonModule,
        MatCardModule,
        MatDividerModule,
        MatSelectModule
    ],
    providers: [],
    exports: [DateRangePickerComponent, DateRangePickerDirective]
})
export class NgxDateRangePickerMd {
	constructor() {
	}
	static forRoot(config: LocaleConfig = {}): ModuleWithProviders<NgxDateRangePickerMd> {
		return {
			ngModule: NgxDateRangePickerMd,
			providers: [
				{ provide: LOCALE_CONFIG, useValue: config },
				{ provide: LocaleService, useClass: LocaleService, deps: [LOCALE_CONFIG] }
			]
		};
	}
}
