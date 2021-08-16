import {
	ApplicationRef,
	ChangeDetectorRef,
	ComponentFactoryResolver,
	Directive,
	DoCheck,
	ElementRef,
	EmbeddedViewRef,
	EventEmitter,
	forwardRef,
	HostListener,
	Injector,
	Input,
	KeyValueDiffer,
	KeyValueDiffers,
	OnChanges,
	OnInit,
	Output,
	Renderer2,
	SimpleChanges,
	ViewContainerRef
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import * as _moment from 'moment';
import { DateRangePickerComponent } from '../components/date-range-picker.component';
import { LocaleConfig } from '../date-range-picker.config';
import { DateRangePreset } from '../date-range-picker.models';
import { LocaleService } from '../services/locale.service';

const moment = _moment;

@Directive({
	// tslint:disable-next-line:directive-selector
	selector: '*[ngxDateRangePickerMd]',
	// tslint:disable-next-line:no-host-metadata-property
	host: {
		'(keyup.esc)': 'hide()',
		'(blur)': 'onBlur()',
		'(click)': 'open()',
		'(keyup)': 'inputChanged($event)'
	},
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => DateRangePickerDirective),
			multi: true
		}
	]
})
export class DateRangePickerDirective implements OnInit, OnChanges, DoCheck {
	@Input() set locale(value) {
		this._locale = { ...this._localeService.config, ...value };
	}
	get locale(): any {
		return this._locale;
	}
	@Input() set startKey(value) {
		if (value !== null) {
			this._startKey = value;
		} else {
			this._startKey = 'startDate';
		}
	}
	@Input() set endKey(value) {
		if (value !== null) {
			this._endKey = value;
		} else {
			this._endKey = 'endDate';
		}
	}

	get value() {
		return this._value || null;
	}
	set value(val) {
		this._value = val;
		this._onChange(val);
		this._changeDetectorRef.markForCheck();
	}

	constructor(
		public applicationRef: ApplicationRef,
		public viewContainerRef: ViewContainerRef,
		public injector: Injector,
		public _changeDetectorRef: ChangeDetectorRef,
		private _componentFactoryResolver: ComponentFactoryResolver,
		private _el: ElementRef,
		private _renderer: Renderer2,
		private differs: KeyValueDiffers,
		private _localeService: LocaleService,
		private elementRef: ElementRef,
	) {
		this.drops = 'down';
		this.opens = 'auto';

		const applicationRoot = document.body.querySelector('*[ng-version]') as HTMLElement;
		const dateRangePickerElement = applicationRoot.querySelector('ngx-daterangepicker-material');
		const componentFactory = this._componentFactoryResolver.resolveComponentFactory(DateRangePickerComponent);
		const componentRef = componentFactory.create(injector);
		this.applicationRef.attachView(componentRef.hostView);
		const componentElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
		componentElem.classList.add('hidden');

		if (dateRangePickerElement && applicationRoot.contains(dateRangePickerElement)) {
			dateRangePickerElement.classList.add('hidden');
			applicationRoot.removeChild(dateRangePickerElement);
		}

		applicationRoot.appendChild(componentElem);

		this.picker = <DateRangePickerComponent>componentRef.instance;
		this.picker.inline = false;
	}
	public picker: DateRangePickerComponent;
	private _onChange = Function.prototype;
	private _onTouched = Function.prototype;
	private _validatorChange = Function.prototype;
	private _value: any;
	private localeDiffer: KeyValueDiffer<string, any>;
	@Input()
	minDate: _moment.Moment;
	@Input()
	maxDate: _moment.Moment;
	@Input()
	autoApply: boolean;

	@Input()
	targetElementId: string;
	@Input()
	topAdjustment: number;
	@Input()
	leftAdjustment: number;
	@Input()
	isFullScreenPicker: boolean;

	@Input()
	alwaysShowCalendars: boolean;
	@Input()
	showCustomRangeLabel: boolean;
	@Input()
	linkedCalendars: boolean;
	@Input()
	buttonClassApply: string;
	@Input()
	buttonClassReset: string;
	@Input()
	buttonClassRange: string;
	@Input()
	dateLimit: number = null;
	@Input()
	singleDatePicker: boolean;
	@Input()
	showWeekNumbers: boolean;
	@Input()
	showISOWeekNumbers: boolean;
	@Input()
	showDropdowns: boolean;
	@Input()
	isInvalidDate: Function;
	@Input()
	isCustomDate: Function;
	@Input()
	showClearButton: boolean;
	@Input()
	customRangeDirection: boolean;
	@Input()
	ranges: DateRangePreset[];
	@Input()
	opens: string;
	@Input()
	drops: string;
	firstMonthDayClass: string;
	@Input()
	lastMonthDayClass: string;
	@Input()
	emptyWeekRowClass: string;
	@Input()
	firstDayOfNextMonthClass: string;
	@Input()
	lastDayOfPreviousMonthClass: string;
	@Input()
	keepCalendarOpeningWithRange: boolean;
	@Input()
	showRangeLabelOnInput: boolean;
	@Input()
	showCancel: boolean = false;
	@Input()
	lockStartDate: boolean = false;
	// timepicker variables
	@Input()
	timePicker: Boolean = false;
	@Input()
	timePicker24Hour: Boolean = false;
	@Input()
	timePickerIncrement: number = 1;
	@Input()
	timePickerSeconds: Boolean = false;
	@Input() closeOnAutoApply = true;
	_locale: LocaleConfig = {};
	@Input()
	private _endKey: string = 'endDate';
	private _startKey: string = 'startDate';
	notForChangesProperty: Array<string> = ['locale', 'endKey', 'startKey'];

	// tslint:disable-next-line:no-output-on-prefix no-output-rename
	@Output('change') onChange: EventEmitter<Object> = new EventEmitter();
	// tslint:disable-next-line:no-output-rename
	@Output('rangeClicked') rangeClicked: EventEmitter<Object> = new EventEmitter();
	// tslint:disable-next-line:no-output-rename
	@Output('datesUpdated') datesUpdated: EventEmitter<Object> = new EventEmitter();
	@Output() startDateChanged: EventEmitter<Object> = new EventEmitter();
	@Output() endDateChanged: EventEmitter<Object> = new EventEmitter();
	$event: any;

	scrollPos = 0;

	ngOnInit() {
		this.picker.startDateChanged.asObservable().subscribe((itemChanged: any) => {
			this.startDateChanged.emit(itemChanged);
		});
		this.picker.endDateChanged.asObservable().subscribe((itemChanged: any) => {
			this.endDateChanged.emit(itemChanged);
		});
		this.picker.rangeClicked.asObservable().subscribe((range: any) => {
			this.rangeClicked.emit(range);
		});
		this.picker.datesUpdated.asObservable().subscribe((range: any) => {
			this.datesUpdated.emit(range);
		});
		this.picker.choosedDate.asObservable().subscribe((change: any) => {
			if (change) {
				const value = {};
				value[this._startKey] = change.startDate;
				value[this._endKey] = change.endDate;
				this.value = value;
				this.onChange.emit(value);
				if (typeof change.chosenLabel === 'string') {
					this._el.nativeElement.value = change.chosenLabel;
				}
			}
		});
		this.picker.firstMonthDayClass = this.firstMonthDayClass;
		this.picker.lastMonthDayClass = this.lastMonthDayClass;
		this.picker.emptyWeekRowClass = this.emptyWeekRowClass;
		this.picker.firstDayOfNextMonthClass = this.firstDayOfNextMonthClass;
		this.picker.lastDayOfPreviousMonthClass = this.lastDayOfPreviousMonthClass;
		this.picker.drops = this.drops;
		this.picker.opens = this.opens;
		this.localeDiffer = this.differs.find(this.locale).create();
		this.picker.closeOnAutoApply = this.closeOnAutoApply;
		this.picker.isFullScreenPicker = this.isFullScreenPicker;
	}

	ngOnChanges(changes: SimpleChanges): void {
		for (const change in changes) {
			if (changes.hasOwnProperty(change)) {
				if (this.notForChangesProperty.indexOf(change) === -1) {
					this.picker[change] = changes[change].currentValue;
				}
			}
		}
	}

	ngDoCheck() {
		if (this.localeDiffer) {
			const changes = this.localeDiffer.diff(this.locale);
			if (changes) {
				this.picker.updateLocale(this.locale);
			}
		}
	}

	onBlur() {
		this._onTouched();
	}

	open(event?: any) {
		this.picker.show(event);
		setTimeout(() => {
			this.setPosition();
		});
	}

	hide(e?) {
		this.picker.hide(e);
	}
	toggle(e?) {
		if (this.picker.isShown) {
			this.hide(e);
		} else {
			this.open(e);
		}
	}

	clear() {
		this.picker.clear();
	}

	writeValue(value) {
		this.setValue(value);
	}
	registerOnChange(fn) {
		this._onChange = fn;
	}
	registerOnTouched(fn) {
		this._onTouched = fn;
	}
	private setValue(val: any) {
		if (val) {
			this.value = val;
			if (val[this._startKey]) {
				this.picker.setStartDate(val[this._startKey]);
			}
			if (val[this._endKey]) {
				this.picker.setEndDate(val[this._endKey]);
			}
			this.picker.calculateChosenLabel();
			if (this.picker.chosenLabel) {
				this._el.nativeElement.value = this.picker.chosenLabel;
			}
		} else {
			this.picker.clear();
		}
	}
	/**
	 * Set position of the calendar
	 */
	setPosition() {
		let style;
		let containerTop;
		this.topAdjustment = this.topAdjustment ? +this.topAdjustment : 0;
		this.leftAdjustment = this.leftAdjustment ? +this.leftAdjustment : 0;

		// todo: revisit the offsets where when both the shared components are done and the order search rework is finished
		const container = this.picker.pickerContainer.nativeElement as HTMLElement;
		let element = this._el.nativeElement as HTMLElement;

		if (this.targetElementId) {
			element = document.getElementById(this.targetElementId);
		} else {
			element = element.parentElement;
		}

		const elementLocation = element.getBoundingClientRect();

		if (this.drops && this.drops === 'up') {
			containerTop = element.offsetTop - container.clientHeight + this.topAdjustment + 'px';
		} else {
			containerTop = elementLocation.top + this.topAdjustment + 'px';
		}
		if (this.opens === 'left') {
			style = {
				top: containerTop,
				left: ((elementLocation.left - container.clientWidth + elementLocation.width - 100)  + this.leftAdjustment) + 'px',
				right: 'auto'
			};
		} else if (this.opens === 'center') {
			style = {
				top: containerTop,
				left: ((elementLocation.left + elementLocation.width / 2 - container.clientWidth / 2)  + this.leftAdjustment) + 'px',
				right: 'auto'
			};
		} else if (this.opens === 'right') {
			style = {
				top: containerTop,
				left: (elementLocation.left + this.leftAdjustment) + 'px',
				right: 'auto'
			};
		} else {
			const position = elementLocation.left + elementLocation.width / 2 - container.clientWidth / 2;

			if (position < 0) {
				style = {
					top: containerTop,
					left: (elementLocation.left + this.leftAdjustment) + 'px',
					right: 'auto'
				};
			} else {
				style = {
					top: containerTop,
					left: (position + this.leftAdjustment) + 'px',
					right: 'auto'
				};
			}
		}

		if (!this.isFullScreenPicker && style) {
			this._renderer.setStyle(container, 'top', style.top);
			this._renderer.setStyle(container, 'left', style.left);
			this._renderer.setStyle(container, 'right', style.right);
		}
	}
	inputChanged(e) {
		if (e.target.tagName.toLowerCase() !== 'input') {
			return;
		}
		if (!e.target.value.length) {
			return;
		}
		const dateString = e.target.value.split(this.picker.locale.separator);
		let start = null,
			end = null;
		if (dateString.length === 2) {
			start = moment(dateString[0], this.picker.locale.format);
			end = moment(dateString[1], this.picker.locale.format);
		}
		if (this.singleDatePicker || start === null || end === null) {
			start = moment(e.target.value, this.picker.locale.format);
			end = start;
		}
		if (!start.isValid() || !end.isValid()) {
			return;
		}
		this.picker.setStartDate(start);
		this.picker.setEndDate(end);
		this.picker.updateView();
	}

	/**
	 * For click outside of the calendar's container
	 * @param event event object
	 */
	@HostListener('document:click', ['$event'])
	outsideClick(event): void {
		if (!event.target) {
			return;
		}

		if (event.target.classList.contains('ngx-daterangepicker-action')) {
			return;
		}

		const targetElement = document.getElementById(this.targetElementId);
		if (targetElement && targetElement.contains(event.target)) {
			this.open(event);
		}

		if (
			!this.elementRef.nativeElement.contains(event.target) &&
			(event.target as HTMLSpanElement).className.indexOf('mat-option') === -1
		) {
			this.hide();
		}
	}
}
