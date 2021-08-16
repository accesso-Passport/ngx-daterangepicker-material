import { ApplicationRef, ChangeDetectorRef, ComponentFactoryResolver, Directive, ElementRef, EventEmitter, forwardRef, HostListener, Injector, Input, KeyValueDiffers, Output, Renderer2, ViewContainerRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import * as _moment from 'moment';
import { DateRangePickerComponent } from '../components/date-range-picker.component';
import { LocaleService } from '../services/locale.service';
const moment = _moment;
export class DateRangePickerDirective {
    constructor(applicationRef, viewContainerRef, injector, _changeDetectorRef, _componentFactoryResolver, _el, _renderer, differs, _localeService, elementRef) {
        this.applicationRef = applicationRef;
        this.viewContainerRef = viewContainerRef;
        this.injector = injector;
        this._changeDetectorRef = _changeDetectorRef;
        this._componentFactoryResolver = _componentFactoryResolver;
        this._el = _el;
        this._renderer = _renderer;
        this.differs = differs;
        this._localeService = _localeService;
        this.elementRef = elementRef;
        this._onChange = Function.prototype;
        this._onTouched = Function.prototype;
        this._validatorChange = Function.prototype;
        this.dateLimit = null;
        this.showCancel = false;
        this.lockStartDate = false;
        // timepicker variables
        this.timePicker = false;
        this.timePicker24Hour = false;
        this.timePickerIncrement = 1;
        this.timePickerSeconds = false;
        this.closeOnAutoApply = true;
        this._locale = {};
        this._endKey = 'endDate';
        this._startKey = 'startDate';
        this.notForChangesProperty = ['locale', 'endKey', 'startKey'];
        // tslint:disable-next-line:no-output-on-prefix no-output-rename
        this.onChange = new EventEmitter();
        // tslint:disable-next-line:no-output-rename
        this.rangeClicked = new EventEmitter();
        // tslint:disable-next-line:no-output-rename
        this.datesUpdated = new EventEmitter();
        this.startDateChanged = new EventEmitter();
        this.endDateChanged = new EventEmitter();
        this.scrollPos = 0;
        this.drops = 'down';
        this.opens = 'auto';
        const applicationRoot = document.body.querySelector('*[ng-version]');
        const dateRangePickerElement = applicationRoot.querySelector('ngx-daterangepicker-material');
        const componentFactory = this._componentFactoryResolver.resolveComponentFactory(DateRangePickerComponent);
        const componentRef = componentFactory.create(injector);
        this.applicationRef.attachView(componentRef.hostView);
        const componentElem = componentRef.hostView.rootNodes[0];
        componentElem.classList.add('hidden');
        if (dateRangePickerElement && applicationRoot.contains(dateRangePickerElement)) {
            dateRangePickerElement.classList.add('hidden');
            applicationRoot.removeChild(dateRangePickerElement);
        }
        applicationRoot.appendChild(componentElem);
        this.picker = componentRef.instance;
        this.picker.inline = false;
    }
    set locale(value) {
        this._locale = Object.assign(Object.assign({}, this._localeService.config), value);
    }
    get locale() {
        return this._locale;
    }
    set startKey(value) {
        if (value !== null) {
            this._startKey = value;
        }
        else {
            this._startKey = 'startDate';
        }
    }
    set endKey(value) {
        if (value !== null) {
            this._endKey = value;
        }
        else {
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
    ngOnInit() {
        this.picker.startDateChanged.asObservable().subscribe((itemChanged) => {
            this.startDateChanged.emit(itemChanged);
        });
        this.picker.endDateChanged.asObservable().subscribe((itemChanged) => {
            this.endDateChanged.emit(itemChanged);
        });
        this.picker.rangeClicked.asObservable().subscribe((range) => {
            this.rangeClicked.emit(range);
        });
        this.picker.datesUpdated.asObservable().subscribe((range) => {
            this.datesUpdated.emit(range);
        });
        this.picker.choosedDate.asObservable().subscribe((change) => {
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
    ngOnChanges(changes) {
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
    open(event) {
        this.picker.show(event);
        setTimeout(() => {
            this.setPosition();
        });
    }
    hide(e) {
        this.picker.hide(e);
    }
    toggle(e) {
        if (this.picker.isShown) {
            this.hide(e);
        }
        else {
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
    setValue(val) {
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
        }
        else {
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
        const container = this.picker.pickerContainer.nativeElement;
        let element = this._el.nativeElement;
        if (this.targetElementId) {
            element = document.getElementById(this.targetElementId);
        }
        else {
            element = element.parentElement;
        }
        const elementLocation = element.getBoundingClientRect();
        if (this.drops && this.drops === 'up') {
            containerTop = element.offsetTop - container.clientHeight + this.topAdjustment + 'px';
        }
        else {
            containerTop = elementLocation.top + this.topAdjustment + 'px';
        }
        if (this.opens === 'left') {
            style = {
                top: containerTop,
                left: ((elementLocation.left - container.clientWidth + elementLocation.width - 100) + this.leftAdjustment) + 'px',
                right: 'auto'
            };
        }
        else if (this.opens === 'center') {
            style = {
                top: containerTop,
                left: ((elementLocation.left + elementLocation.width / 2 - container.clientWidth / 2) + this.leftAdjustment) + 'px',
                right: 'auto'
            };
        }
        else if (this.opens === 'right') {
            style = {
                top: containerTop,
                left: (elementLocation.left + this.leftAdjustment) + 'px',
                right: 'auto'
            };
        }
        else {
            const position = elementLocation.left + elementLocation.width / 2 - container.clientWidth / 2;
            if (position < 0) {
                style = {
                    top: containerTop,
                    left: (elementLocation.left + this.leftAdjustment) + 'px',
                    right: 'auto'
                };
            }
            else {
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
        let start = null, end = null;
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
    outsideClick(event) {
        var _a, _b, _c, _d;
        if (!event.target) {
            return;
        }
        if ((_b = (_a = event.target) === null || _a === void 0 ? void 0 : _a.classList) === null || _b === void 0 ? void 0 : _b.contains('ngx-daterangepicker-action')) {
            return;
        }
        const targetElement = document.getElementById(this.targetElementId);
        if (targetElement === null || targetElement === void 0 ? void 0 : targetElement.contains(event.target)) {
            this.open(event);
        }
        if (!this.elementRef.nativeElement.contains(event.target) &&
            ((_d = (_c = event.target) === null || _c === void 0 ? void 0 : _c.className) === null || _d === void 0 ? void 0 : _d.indexOf('mat-option')) === -1) {
            this.hide();
        }
    }
}
DateRangePickerDirective.decorators = [
    { type: Directive, args: [{
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
            },] }
];
DateRangePickerDirective.ctorParameters = () => [
    { type: ApplicationRef },
    { type: ViewContainerRef },
    { type: Injector },
    { type: ChangeDetectorRef },
    { type: ComponentFactoryResolver },
    { type: ElementRef },
    { type: Renderer2 },
    { type: KeyValueDiffers },
    { type: LocaleService },
    { type: ElementRef }
];
DateRangePickerDirective.propDecorators = {
    locale: [{ type: Input }],
    startKey: [{ type: Input }],
    endKey: [{ type: Input }],
    minDate: [{ type: Input }],
    maxDate: [{ type: Input }],
    autoApply: [{ type: Input }],
    targetElementId: [{ type: Input }],
    topAdjustment: [{ type: Input }],
    leftAdjustment: [{ type: Input }],
    isFullScreenPicker: [{ type: Input }],
    alwaysShowCalendars: [{ type: Input }],
    showCustomRangeLabel: [{ type: Input }],
    linkedCalendars: [{ type: Input }],
    buttonClassApply: [{ type: Input }],
    buttonClassReset: [{ type: Input }],
    buttonClassRange: [{ type: Input }],
    dateLimit: [{ type: Input }],
    singleDatePicker: [{ type: Input }],
    showWeekNumbers: [{ type: Input }],
    showISOWeekNumbers: [{ type: Input }],
    showDropdowns: [{ type: Input }],
    isInvalidDate: [{ type: Input }],
    isCustomDate: [{ type: Input }],
    showClearButton: [{ type: Input }],
    customRangeDirection: [{ type: Input }],
    ranges: [{ type: Input }],
    opens: [{ type: Input }],
    drops: [{ type: Input }],
    lastMonthDayClass: [{ type: Input }],
    emptyWeekRowClass: [{ type: Input }],
    firstDayOfNextMonthClass: [{ type: Input }],
    lastDayOfPreviousMonthClass: [{ type: Input }],
    keepCalendarOpeningWithRange: [{ type: Input }],
    showRangeLabelOnInput: [{ type: Input }],
    showCancel: [{ type: Input }],
    lockStartDate: [{ type: Input }],
    timePicker: [{ type: Input }],
    timePicker24Hour: [{ type: Input }],
    timePickerIncrement: [{ type: Input }],
    timePickerSeconds: [{ type: Input }],
    closeOnAutoApply: [{ type: Input }],
    _endKey: [{ type: Input }],
    onChange: [{ type: Output, args: ['change',] }],
    rangeClicked: [{ type: Output, args: ['rangeClicked',] }],
    datesUpdated: [{ type: Output, args: ['datesUpdated',] }],
    startDateChanged: [{ type: Output }],
    endDateChanged: [{ type: Output }],
    outsideClick: [{ type: HostListener, args: ['document:click', ['$event'],] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1yYW5nZS1waWNrZXIuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IkQ6L2RldmVsb3BtZW50L2FjY2Vzc28vYXBwbGljYXRpb25zL25neC1kYXRlcmFuZ2VwaWNrZXItbWF0ZXJpYWwvc3JjL2RhdGVyYW5nZXBpY2tlci8iLCJzb3VyY2VzIjpbImRpcmVjdGl2ZXMvZGF0ZS1yYW5nZS1waWNrZXIuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTixjQUFjLEVBQ2QsaUJBQWlCLEVBQ2pCLHdCQUF3QixFQUN4QixTQUFTLEVBRVQsVUFBVSxFQUVWLFlBQVksRUFDWixVQUFVLEVBQ1YsWUFBWSxFQUNaLFFBQVEsRUFDUixLQUFLLEVBRUwsZUFBZSxFQUdmLE1BQU0sRUFDTixTQUFTLEVBRVQsZ0JBQWdCLEVBQ2hCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ25ELE9BQU8sS0FBSyxPQUFPLE1BQU0sUUFBUSxDQUFDO0FBQ2xDLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLDJDQUEyQyxDQUFDO0FBR3JGLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUUzRCxNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUM7QUFvQnZCLE1BQU0sT0FBTyx3QkFBd0I7SUErQnBDLFlBQ1EsY0FBOEIsRUFDOUIsZ0JBQWtDLEVBQ2xDLFFBQWtCLEVBQ2xCLGtCQUFxQyxFQUNwQyx5QkFBbUQsRUFDbkQsR0FBZSxFQUNmLFNBQW9CLEVBQ3BCLE9BQXdCLEVBQ3hCLGNBQTZCLEVBQzdCLFVBQXNCO1FBVHZCLG1CQUFjLEdBQWQsY0FBYyxDQUFnQjtRQUM5QixxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBQ2xDLGFBQVEsR0FBUixRQUFRLENBQVU7UUFDbEIsdUJBQWtCLEdBQWxCLGtCQUFrQixDQUFtQjtRQUNwQyw4QkFBeUIsR0FBekIs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aWNhdGlvblJlZixcclxuXHRDaGFuZ2VEZXRlY3RvclJlZixcclxuXHRDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXHJcblx0RGlyZWN0aXZlLFxyXG5cdERvQ2hlY2ssXHJcblx0RWxlbWVudFJlZixcclxuXHRFbWJlZGRlZFZpZXdSZWYsXHJcblx0RXZlbnRFbWl0dGVyLFxyXG5cdGZvcndhcmRSZWYsXHJcblx0SG9zdExpc3RlbmVyLFxyXG5cdEluamVjdG9yLFxyXG5cdElucHV0LFxyXG5cdEtleVZhbHVlRGlmZmVyLFxyXG5cdEtleVZhbHVlRGlmZmVycyxcclxuXHRPbkNoYW5nZXMsXHJcblx0T25Jbml0LFxyXG5cdE91dHB1dCxcclxuXHRSZW5kZXJlcjIsXHJcblx0U2ltcGxlQ2hhbmdlcyxcclxuXHRWaWV3Q29udGFpbmVyUmVmXHJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IE5HX1ZBTFVFX0FDQ0VTU09SIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xyXG5pbXBvcnQgKiBhcyBfbW9tZW50IGZyb20gJ21vbWVudCc7XHJcbmltcG9ydCB7IERhdGVSYW5nZVBpY2tlckNvbXBvbmVudCB9IGZyb20gJy4uL2NvbXBvbmVudHMvZGF0ZS1yYW5nZS1waWNrZXIuY29tcG9uZW50JztcclxuaW1wb3J0IHsgTG9jYWxlQ29uZmlnIH0gZnJvbSAnLi4vZGF0ZS1yYW5nZS1waWNrZXIuY29uZmlnJztcclxuaW1wb3J0IHsgRGF0ZVJhbmdlUHJlc2V0IH0gZnJvbSAnLi4vZGF0ZS1yYW5nZS1waWNrZXIubW9kZWxzJztcclxuaW1wb3J0IHsgTG9jYWxlU2VydmljZSB9IGZyb20gJy4uL3NlcnZpY2VzL2xvY2FsZS5zZXJ2aWNlJztcclxuXHJcbmNvbnN0IG1vbWVudCA9IF9tb21lbnQ7XHJcblxyXG5ARGlyZWN0aXZlKHtcclxuXHQvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6ZGlyZWN0aXZlLXNlbGVjdG9yXHJcblx0c2VsZWN0b3I6ICcqW25neERhdGVSYW5nZVBpY2tlck1kXScsXHJcblx0Ly8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWhvc3QtbWV0YWRhdGEtcHJvcGVydHlcclxuXHRob3N0OiB7XHJcblx0XHQnKGtleXVwLmVzYyknOiAnaGlkZSgpJyxcclxuXHRcdCcoYmx1ciknOiAnb25CbHVyKCknLFxyXG5cdFx0JyhjbGljayknOiAnb3BlbigpJyxcclxuXHRcdCcoa2V5dXApJzogJ2lucHV0Q2hhbmdlZCgkZXZlbnQpJ1xyXG5cdH0sXHJcblx0cHJvdmlkZXJzOiBbXHJcblx0XHR7XHJcblx0XHRcdHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxyXG5cdFx0XHR1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBEYXRlUmFuZ2VQaWNrZXJEaXJlY3RpdmUpLFxyXG5cdFx0XHRtdWx0aTogdHJ1ZVxyXG5cdFx0fVxyXG5cdF1cclxufSlcclxuZXhwb3J0IGNsYXNzIERhdGVSYW5nZVBpY2tlckRpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzLCBEb0NoZWNrIHtcclxuXHRASW5wdXQoKSBzZXQgbG9jYWxlKHZhbHVlKSB7XHJcblx0XHR0aGlzLl9sb2NhbGUgPSB7IC4uLnRoaXMuX2xvY2FsZVNlcnZpY2UuY29uZmlnLCAuLi52YWx1ZSB9O1xyXG5cdH1cclxuXHRnZXQgbG9jYWxlKCk6IGFueSB7XHJcblx0XHRyZXR1cm4gdGhpcy5fbG9jYWxlO1xyXG5cdH1cclxuXHRASW5wdXQoKSBzZXQgc3RhcnRLZXkodmFsdWUpIHtcclxuXHRcdGlmICh2YWx1ZSAhPT0gbnVsbCkge1xyXG5cdFx0XHR0aGlzLl9zdGFydEtleSA9IHZhbHVlO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGhpcy5fc3RhcnRLZXkgPSAnc3RhcnREYXRlJztcclxuXHRcdH1cclxuXHR9XHJcblx0QElucHV0KCkgc2V0IGVuZEtleSh2YWx1ZSkge1xyXG5cdFx0aWYgKHZhbHVlICE9PSBudWxsKSB7XHJcblx0XHRcdHRoaXMuX2VuZEtleSA9IHZhbHVlO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGhpcy5fZW5kS2V5ID0gJ2VuZERhdGUnO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Z2V0IHZhbHVlKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMuX3ZhbHVlIHx8IG51bGw7XHJcblx0fVxyXG5cdHNldCB2YWx1ZSh2YWwpIHtcclxuXHRcdHRoaXMuX3ZhbHVlID0gdmFsO1xyXG5cdFx0dGhpcy5fb25DaGFuZ2UodmFsKTtcclxuXHRcdHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xyXG5cdH1cclxuXHJcblx0Y29uc3RydWN0b3IoXHJcblx0XHRwdWJsaWMgYXBwbGljYXRpb25SZWY6IEFwcGxpY2F0aW9uUmVmLFxyXG5cdFx0cHVibGljIHZpZXdDb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWYsXHJcblx0XHRwdWJsaWMgaW5qZWN0b3I6IEluamVjdG9yLFxyXG5cdFx0cHVibGljIF9jaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXHJcblx0XHRwcml2YXRlIF9jb21wb25lbnRGYWN0b3J5UmVzb2x2ZXI6IENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcixcclxuXHRcdHByaXZhdGUgX2VsOiBFbGVtZW50UmVmLFxyXG5cdFx0cHJpdmF0ZSBfcmVuZGVyZXI6IFJlbmRlcmVyMixcclxuXHRcdHByaXZhdGUgZGlmZmVyczogS2V5VmFsdWVEaWZmZXJzLFxyXG5cdFx0cHJpdmF0ZSBfbG9jYWxlU2VydmljZTogTG9jYWxlU2VydmljZSxcclxuXHRcdHByaXZhdGUgZWxlbWVudFJlZjogRWxlbWVudFJlZixcclxuXHQpIHtcclxuXHRcdHRoaXMuZHJvcHMgPSAnZG93bic7XHJcblx0XHR0aGlzLm9wZW5zID0gJ2F1dG8nO1xyXG5cclxuXHRcdGNvbnN0IGFwcGxpY2F0aW9uUm9vdCA9IGRvY3VtZW50LmJvZHkucXVlcnlTZWxlY3RvcignKltuZy12ZXJzaW9uXScpIGFzIEhUTUxFbGVtZW50O1xyXG5cdFx0Y29uc3QgZGF0ZVJhbmdlUGlja2VyRWxlbWVudCA9IGFwcGxpY2F0aW9uUm9vdC5xdWVyeVNlbGVjdG9yKCduZ3gtZGF0ZXJhbmdlcGlja2VyLW1hdGVyaWFsJyk7XHJcblx0XHRjb25zdCBjb21wb25lbnRGYWN0b3J5ID0gdGhpcy5fY29tcG9uZW50RmFjdG9yeVJlc29sdmVyLnJlc29sdmVDb21wb25lbnRGYWN0b3J5KERhdGVSYW5nZVBpY2tlckNvbXBvbmVudCk7XHJcblx0XHRjb25zdCBjb21wb25lbnRSZWYgPSBjb21wb25lbnRGYWN0b3J5LmNyZWF0ZShpbmplY3Rvcik7XHJcblx0XHR0aGlzLmFwcGxpY2F0aW9uUmVmLmF0dGFjaFZpZXcoY29tcG9uZW50UmVmLmhvc3RWaWV3KTtcclxuXHRcdGNvbnN0IGNvbXBvbmVudEVsZW0gPSAoY29tcG9uZW50UmVmLmhvc3RWaWV3IGFzIEVtYmVkZGVkVmlld1JlZjxhbnk+KS5yb290Tm9kZXNbMF0gYXMgSFRNTEVsZW1lbnQ7XHJcblx0XHRjb21wb25lbnRFbGVtLmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpO1xyXG5cclxuXHRcdGlmIChkYXRlUmFuZ2VQaWNrZXJFbGVtZW50ICYmIGFwcGxpY2F0aW9uUm9vdC5jb250YWlucyhkYXRlUmFuZ2VQaWNrZXJFbGVtZW50KSkge1xyXG5cdFx0XHRkYXRlUmFuZ2VQaWNrZXJFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpO1xyXG5cdFx0XHRhcHBsaWNhdGlvblJvb3QucmVtb3ZlQ2hpbGQoZGF0ZVJhbmdlUGlja2VyRWxlbWVudCk7XHJcblx0XHR9XHJcblxyXG5cdFx0YXBwbGljYXRpb25Sb290LmFwcGVuZENoaWxkKGNvbXBvbmVudEVsZW0pO1xyXG5cclxuXHRcdHRoaXMucGlja2VyID0gPERhdGVSYW5nZVBpY2tlckNvbXBvbmVudD5jb21wb25lbnRSZWYuaW5zdGFuY2U7XHJcblx0XHR0aGlzLnBpY2tlci5pbmxpbmUgPSBmYWxzZTtcclxuXHR9XHJcblx0cHVibGljIHBpY2tlcjogRGF0ZVJhbmdlUGlja2VyQ29tcG9uZW50O1xyXG5cdHByaXZhdGUgX29uQ2hhbmdlID0gRnVuY3Rpb24ucHJvdG90eXBlO1xyXG5cdHByaXZhdGUgX29uVG91Y2hlZCA9IEZ1bmN0aW9uLnByb3RvdHlwZTtcclxuXHRwcml2YXRlIF92YWxpZGF0b3JDaGFuZ2UgPSBGdW5jdGlvbi5wcm90b3R5cGU7XHJcblx0cHJpdmF0ZSBfdmFsdWU6IGFueTtcclxuXHRwcml2YXRlIGxvY2FsZURpZmZlcjogS2V5VmFsdWVEaWZmZXI8c3RyaW5nLCBhbnk+O1xyXG5cdEBJbnB1dCgpXHJcblx0bWluRGF0ZTogX21vbWVudC5Nb21lbnQ7XHJcblx0QElucHV0KClcclxuXHRtYXhEYXRlOiBfbW9tZW50Lk1vbWVudDtcclxuXHRASW5wdXQoKVxyXG5cdGF1dG9BcHBseTogYm9vbGVhbjtcclxuXHJcblx0QElucHV0KClcclxuXHR0YXJnZXRFbGVtZW50SWQ6IHN0cmluZztcclxuXHRASW5wdXQoKVxyXG5cdHRvcEFkanVzdG1lbnQ6IG51bWJlcjtcclxuXHRASW5wdXQoKVxyXG5cdGxlZnRBZGp1c3RtZW50OiBudW1iZXI7XHJcblx0QElucHV0KClcclxuXHRpc0Z1bGxTY3JlZW5QaWNrZXI6IGJvb2xlYW47XHJcblxyXG5cdEBJbnB1dCgpXHJcblx0YWx3YXlzU2hvd0NhbGVuZGFyczogYm9vbGVhbjtcclxuXHRASW5wdXQoKVxyXG5cdHNob3dDdXN0b21SYW5nZUxhYmVsOiBib29sZWFuO1xyXG5cdEBJbnB1dCgpXHJcblx0bGlua2VkQ2FsZW5kYXJzOiBib29sZWFuO1xyXG5cdEBJbnB1dCgpXHJcblx0YnV0dG9uQ2xhc3NBcHBseTogc3RyaW5nO1xyXG5cdEBJbnB1dCgpXHJcblx0YnV0dG9uQ2xhc3NSZXNldDogc3RyaW5nO1xyXG5cdEBJbnB1dCgpXHJcblx0YnV0dG9uQ2xhc3NSYW5nZTogc3RyaW5nO1xyXG5cdEBJbnB1dCgpXHJcblx0ZGF0ZUxpbWl0OiBudW1iZXIgPSBudWxsO1xyXG5cdEBJbnB1dCgpXHJcblx0c2luZ2xlRGF0ZVBpY2tlcjogYm9vbGVhbjtcclxuXHRASW5wdXQoKVxyXG5cdHNob3dXZWVrTnVtYmVyczogYm9vbGVhbjtcclxuXHRASW5wdXQoKVxyXG5cdHNob3dJU09XZWVrTnVtYmVyczogYm9vbGVhbjtcclxuXHRASW5wdXQoKVxyXG5cdHNob3dEcm9wZG93bnM6IGJvb2xlYW47XHJcblx0QElucHV0KClcclxuXHRpc0ludmFsaWREYXRlOiBGdW5jdGlvbjtcclxuXHRASW5wdXQoKVxyXG5cdGlzQ3VzdG9tRGF0ZTogRnVuY3Rpb247XHJcblx0QElucHV0KClcclxuXHRzaG93Q2xlYXJCdXR0b246IGJvb2xlYW47XHJcblx0QElucHV0KClcclxuXHRjdXN0b21SYW5nZURpcmVjdGlvbjogYm9vbGVhbjtcclxuXHRASW5wdXQoKVxyXG5cdHJhbmdlczogRGF0ZVJhbmdlUHJlc2V0W107XHJcblx0QElucHV0KClcclxuXHRvcGVuczogc3RyaW5nO1xyXG5cdEBJbnB1dCgpXHJcblx0ZHJvcHM6IHN0cmluZztcclxuXHRmaXJzdE1vbnRoRGF5Q2xhc3M6IHN0cmluZztcclxuXHRASW5wdXQoKVxyXG5cdGxhc3RNb250aERheUNsYXNzOiBzdHJpbmc7XHJcblx0QElucHV0KClcclxuXHRlbXB0eVdlZWtSb3dDbGFzczogc3RyaW5nO1xyXG5cdEBJbnB1dCgpXHJcblx0Zmlyc3REYXlPZk5leHRNb250aENsYXNzOiBzdHJpbmc7XHJcblx0QElucHV0KClcclxuXHRsYXN0RGF5T2ZQcmV2aW91c01vbnRoQ2xhc3M6IHN0cmluZztcclxuXHRASW5wdXQoKVxyXG5cdGtlZXBDYWxlbmRhck9wZW5pbmdXaXRoUmFuZ2U6IGJvb2xlYW47XHJcblx0QElucHV0KClcclxuXHRzaG93UmFuZ2VMYWJlbE9uSW5wdXQ6IGJvb2xlYW47XHJcblx0QElucHV0KClcclxuXHRzaG93Q2FuY2VsOiBib29sZWFuID0gZmFsc2U7XHJcblx0QElucHV0KClcclxuXHRsb2NrU3RhcnREYXRlOiBib29sZWFuID0gZmFsc2U7XHJcblx0Ly8gdGltZXBpY2tlciB2YXJpYWJsZXNcclxuXHRASW5wdXQoKVxyXG5cdHRpbWVQaWNrZXI6IEJvb2xlYW4gPSBmYWxzZTtcclxuXHRASW5wdXQoKVxyXG5cdHRpbWVQaWNrZXIyNEhvdXI6IEJvb2xlYW4gPSBmYWxzZTtcclxuXHRASW5wdXQoKVxyXG5cdHRpbWVQaWNrZXJJbmNyZW1lbnQ6IG51bWJlciA9IDE7XHJcblx0QElucHV0KClcclxuXHR0aW1lUGlja2VyU2Vjb25kczogQm9vbGVhbiA9IGZhbHNlO1xyXG5cdEBJbnB1dCgpIGNsb3NlT25BdXRvQXBwbHkgPSB0cnVlO1xyXG5cdF9sb2NhbGU6IExvY2FsZUNvbmZpZyA9IHt9O1xyXG5cdEBJbnB1dCgpXHJcblx0cHJpdmF0ZSBfZW5kS2V5OiBzdHJpbmcgPSAnZW5kRGF0ZSc7XHJcblx0cHJpdmF0ZSBfc3RhcnRLZXk6IHN0cmluZyA9ICdzdGFydERhdGUnO1xyXG5cdG5vdEZvckNoYW5nZXNQcm9wZXJ0eTogQXJyYXk8c3RyaW5nPiA9IFsnbG9jYWxlJywgJ2VuZEtleScsICdzdGFydEtleSddO1xyXG5cclxuXHQvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tb3V0cHV0LW9uLXByZWZpeCBuby1vdXRwdXQtcmVuYW1lXHJcblx0QE91dHB1dCgnY2hhbmdlJykgb25DaGFuZ2U6IEV2ZW50RW1pdHRlcjxPYmplY3Q+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cdC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1vdXRwdXQtcmVuYW1lXHJcblx0QE91dHB1dCgncmFuZ2VDbGlja2VkJykgcmFuZ2VDbGlja2VkOiBFdmVudEVtaXR0ZXI8T2JqZWN0PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHQvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tb3V0cHV0LXJlbmFtZVxyXG5cdEBPdXRwdXQoJ2RhdGVzVXBkYXRlZCcpIGRhdGVzVXBkYXRlZDogRXZlbnRFbWl0dGVyPE9iamVjdD4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblx0QE91dHB1dCgpIHN0YXJ0RGF0ZUNoYW5nZWQ6IEV2ZW50RW1pdHRlcjxPYmplY3Q+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cdEBPdXRwdXQoKSBlbmREYXRlQ2hhbmdlZDogRXZlbnRFbWl0dGVyPE9iamVjdD4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblx0JGV2ZW50OiBhbnk7XHJcblxyXG5cdHNjcm9sbFBvcyA9IDA7XHJcblxyXG5cdG5nT25Jbml0KCkge1xyXG5cdFx0dGhpcy5waWNrZXIuc3RhcnREYXRlQ2hhbmdlZC5hc09ic2VydmFibGUoKS5zdWJzY3JpYmUoKGl0ZW1DaGFuZ2VkOiBhbnkpID0+IHtcclxuXHRcdFx0dGhpcy5zdGFydERhdGVDaGFuZ2VkLmVtaXQoaXRlbUNoYW5nZWQpO1xyXG5cdFx0fSk7XHJcblx0XHR0aGlzLnBpY2tlci5lbmREYXRlQ2hhbmdlZC5hc09ic2VydmFibGUoKS5zdWJzY3JpYmUoKGl0ZW1DaGFuZ2VkOiBhbnkpID0+IHtcclxuXHRcdFx0dGhpcy5lbmREYXRlQ2hhbmdlZC5lbWl0KGl0ZW1DaGFuZ2VkKTtcclxuXHRcdH0pO1xyXG5cdFx0dGhpcy5waWNrZXIucmFuZ2VDbGlja2VkLmFzT2JzZXJ2YWJsZSgpLnN1YnNjcmliZSgocmFuZ2U6IGFueSkgPT4ge1xyXG5cdFx0XHR0aGlzLnJhbmdlQ2xpY2tlZC5lbWl0KHJhbmdlKTtcclxuXHRcdH0pO1xyXG5cdFx0dGhpcy5waWNrZXIuZGF0ZXNVcGRhdGVkLmFzT2JzZXJ2YWJsZSgpLnN1YnNjcmliZSgocmFuZ2U6IGFueSkgPT4ge1xyXG5cdFx0XHR0aGlzLmRhdGVzVXBkYXRlZC5lbWl0KHJhbmdlKTtcclxuXHRcdH0pO1xyXG5cdFx0dGhpcy5waWNrZXIuY2hvb3NlZERhdGUuYXNPYnNlcnZhYmxlKCkuc3Vic2NyaWJlKChjaGFuZ2U6IGFueSkgPT4ge1xyXG5cdFx0XHRpZiAoY2hhbmdlKSB7XHJcblx0XHRcdFx0Y29uc3QgdmFsdWUgPSB7fTtcclxuXHRcdFx0XHR2YWx1ZVt0aGlzLl9zdGFydEtleV0gPSBjaGFuZ2Uuc3RhcnREYXRlO1xyXG5cdFx0XHRcdHZhbHVlW3RoaXMuX2VuZEtleV0gPSBjaGFuZ2UuZW5kRGF0ZTtcclxuXHRcdFx0XHR0aGlzLnZhbHVlID0gdmFsdWU7XHJcblx0XHRcdFx0dGhpcy5vbkNoYW5nZS5lbWl0KHZhbHVlKTtcclxuXHRcdFx0XHRpZiAodHlwZW9mIGNoYW5nZS5jaG9zZW5MYWJlbCA9PT0gJ3N0cmluZycpIHtcclxuXHRcdFx0XHRcdHRoaXMuX2VsLm5hdGl2ZUVsZW1lbnQudmFsdWUgPSBjaGFuZ2UuY2hvc2VuTGFiZWw7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdHRoaXMucGlja2VyLmZpcnN0TW9udGhEYXlDbGFzcyA9IHRoaXMuZmlyc3RNb250aERheUNsYXNzO1xyXG5cdFx0dGhpcy5waWNrZXIubGFzdE1vbnRoRGF5Q2xhc3MgPSB0aGlzLmxhc3RNb250aERheUNsYXNzO1xyXG5cdFx0dGhpcy5waWNrZXIuZW1wdHlXZWVrUm93Q2xhc3MgPSB0aGlzLmVtcHR5V2Vla1Jvd0NsYXNzO1xyXG5cdFx0dGhpcy5waWNrZXIuZmlyc3REYXlPZk5leHRNb250aENsYXNzID0gdGhpcy5maXJzdERheU9mTmV4dE1vbnRoQ2xhc3M7XHJcblx0XHR0aGlzLnBpY2tlci5sYXN0RGF5T2ZQcmV2aW91c01vbnRoQ2xhc3MgPSB0aGlzLmxhc3REYXlPZlByZXZpb3VzTW9udGhDbGFzcztcclxuXHRcdHRoaXMucGlja2VyLmRyb3BzID0gdGhpcy5kcm9wcztcclxuXHRcdHRoaXMucGlja2VyLm9wZW5zID0gdGhpcy5vcGVucztcclxuXHRcdHRoaXMubG9jYWxlRGlmZmVyID0gdGhpcy5kaWZmZXJzLmZpbmQodGhpcy5sb2NhbGUpLmNyZWF0ZSgpO1xyXG5cdFx0dGhpcy5waWNrZXIuY2xvc2VPbkF1dG9BcHBseSA9IHRoaXMuY2xvc2VPbkF1dG9BcHBseTtcclxuXHRcdHRoaXMucGlja2VyLmlzRnVsbFNjcmVlblBpY2tlciA9IHRoaXMuaXNGdWxsU2NyZWVuUGlja2VyO1xyXG5cdH1cclxuXHJcblx0bmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xyXG5cdFx0Zm9yIChjb25zdCBjaGFuZ2UgaW4gY2hhbmdlcykge1xyXG5cdFx0XHRpZiAoY2hhbmdlcy5oYXNPd25Qcm9wZXJ0eShjaGFuZ2UpKSB7XHJcblx0XHRcdFx0aWYgKHRoaXMubm90Rm9yQ2hhbmdlc1Byb3BlcnR5LmluZGV4T2YoY2hhbmdlKSA9PT0gLTEpIHtcclxuXHRcdFx0XHRcdHRoaXMucGlja2VyW2NoYW5nZV0gPSBjaGFuZ2VzW2NoYW5nZV0uY3VycmVudFZhbHVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0bmdEb0NoZWNrKCkge1xyXG5cdFx0aWYgKHRoaXMubG9jYWxlRGlmZmVyKSB7XHJcblx0XHRcdGNvbnN0IGNoYW5nZXMgPSB0aGlzLmxvY2FsZURpZmZlci5kaWZmKHRoaXMubG9jYWxlKTtcclxuXHRcdFx0aWYgKGNoYW5nZXMpIHtcclxuXHRcdFx0XHR0aGlzLnBpY2tlci51cGRhdGVMb2NhbGUodGhpcy5sb2NhbGUpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRvbkJsdXIoKSB7XHJcblx0XHR0aGlzLl9vblRvdWNoZWQoKTtcclxuXHR9XHJcblxyXG5cdG9wZW4oZXZlbnQ/OiBhbnkpIHtcclxuXHRcdHRoaXMucGlja2VyLnNob3coZXZlbnQpO1xyXG5cdFx0c2V0VGltZW91dCgoKSA9PiB7XHJcblx0XHRcdHRoaXMuc2V0UG9zaXRpb24oKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0aGlkZShlPykge1xyXG5cdFx0dGhpcy5waWNrZXIuaGlkZShlKTtcclxuXHR9XHJcblx0dG9nZ2xlKGU/KSB7XHJcblx0XHRpZiAodGhpcy5waWNrZXIuaXNTaG93bikge1xyXG5cdFx0XHR0aGlzLmhpZGUoZSk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aGlzLm9wZW4oZSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRjbGVhcigpIHtcclxuXHRcdHRoaXMucGlja2VyLmNsZWFyKCk7XHJcblx0fVxyXG5cclxuXHR3cml0ZVZhbHVlKHZhbHVlKSB7XHJcblx0XHR0aGlzLnNldFZhbHVlKHZhbHVlKTtcclxuXHR9XHJcblx0cmVnaXN0ZXJPbkNoYW5nZShmbikge1xyXG5cdFx0dGhpcy5fb25DaGFuZ2UgPSBmbjtcclxuXHR9XHJcblx0cmVnaXN0ZXJPblRvdWNoZWQoZm4pIHtcclxuXHRcdHRoaXMuX29uVG91Y2hlZCA9IGZuO1xyXG5cdH1cclxuXHRwcml2YXRlIHNldFZhbHVlKHZhbDogYW55KSB7XHJcblx0XHRpZiAodmFsKSB7XHJcblx0XHRcdHRoaXMudmFsdWUgPSB2YWw7XHJcblx0XHRcdGlmICh2YWxbdGhpcy5fc3RhcnRLZXldKSB7XHJcblx0XHRcdFx0dGhpcy5waWNrZXIuc2V0U3RhcnREYXRlKHZhbFt0aGlzLl9zdGFydEtleV0pO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmICh2YWxbdGhpcy5fZW5kS2V5XSkge1xyXG5cdFx0XHRcdHRoaXMucGlja2VyLnNldEVuZERhdGUodmFsW3RoaXMuX2VuZEtleV0pO1xyXG5cdFx0XHR9XHJcblx0XHRcdHRoaXMucGlja2VyLmNhbGN1bGF0ZUNob3NlbkxhYmVsKCk7XHJcblx0XHRcdGlmICh0aGlzLnBpY2tlci5jaG9zZW5MYWJlbCkge1xyXG5cdFx0XHRcdHRoaXMuX2VsLm5hdGl2ZUVsZW1lbnQudmFsdWUgPSB0aGlzLnBpY2tlci5jaG9zZW5MYWJlbDtcclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGhpcy5waWNrZXIuY2xlYXIoKTtcclxuXHRcdH1cclxuXHR9XHJcblx0LyoqXHJcblx0ICogU2V0IHBvc2l0aW9uIG9mIHRoZSBjYWxlbmRhclxyXG5cdCAqL1xyXG5cdHNldFBvc2l0aW9uKCkge1xyXG5cdFx0bGV0IHN0eWxlO1xyXG5cdFx0bGV0IGNvbnRhaW5lclRvcDtcclxuXHRcdHRoaXMudG9wQWRqdXN0bWVudCA9IHRoaXMudG9wQWRqdXN0bWVudCA/ICt0aGlzLnRvcEFkanVzdG1lbnQgOiAwO1xyXG5cdFx0dGhpcy5sZWZ0QWRqdXN0bWVudCA9IHRoaXMubGVmdEFkanVzdG1lbnQgPyArdGhpcy5sZWZ0QWRqdXN0bWVudCA6IDA7XHJcblxyXG5cdFx0Ly8gdG9kbzogcmV2aXNpdCB0aGUgb2Zmc2V0cyB3aGVyZSB3aGVuIGJvdGggdGhlIHNoYXJlZCBjb21wb25lbnRzIGFyZSBkb25lIGFuZCB0aGUgb3JkZXIgc2VhcmNoIHJld29yayBpcyBmaW5pc2hlZFxyXG5cdFx0Y29uc3QgY29udGFpbmVyID0gdGhpcy5waWNrZXIucGlja2VyQ29udGFpbmVyLm5hdGl2ZUVsZW1lbnQgYXMgSFRNTEVsZW1lbnQ7XHJcblx0XHRsZXQgZWxlbWVudCA9IHRoaXMuX2VsLm5hdGl2ZUVsZW1lbnQgYXMgSFRNTEVsZW1lbnQ7XHJcblxyXG5cdFx0aWYgKHRoaXMudGFyZ2V0RWxlbWVudElkKSB7XHJcblx0XHRcdGVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLnRhcmdldEVsZW1lbnRJZCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRlbGVtZW50ID0gZWxlbWVudC5wYXJlbnRFbGVtZW50O1xyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IGVsZW1lbnRMb2NhdGlvbiA9IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcblxyXG5cdFx0aWYgKHRoaXMuZHJvcHMgJiYgdGhpcy5kcm9wcyA9PT0gJ3VwJykge1xyXG5cdFx0XHRjb250YWluZXJUb3AgPSBlbGVtZW50Lm9mZnNldFRvcCAtIGNvbnRhaW5lci5jbGllbnRIZWlnaHQgKyB0aGlzLnRvcEFkanVzdG1lbnQgKyAncHgnO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0Y29udGFpbmVyVG9wID0gZWxlbWVudExvY2F0aW9uLnRvcCArIHRoaXMudG9wQWRqdXN0bWVudCArICdweCc7XHJcblx0XHR9XHJcblx0XHRpZiAodGhpcy5vcGVucyA9PT0gJ2xlZnQnKSB7XHJcblx0XHRcdHN0eWxlID0ge1xyXG5cdFx0XHRcdHRvcDogY29udGFpbmVyVG9wLFxyXG5cdFx0XHRcdGxlZnQ6ICgoZWxlbWVudExvY2F0aW9uLmxlZnQgLSBjb250YWluZXIuY2xpZW50V2lkdGggKyBlbGVtZW50TG9jYXRpb24ud2lkdGggLSAxMDApICArIHRoaXMubGVmdEFkanVzdG1lbnQpICsgJ3B4JyxcclxuXHRcdFx0XHRyaWdodDogJ2F1dG8nXHJcblx0XHRcdH07XHJcblx0XHR9IGVsc2UgaWYgKHRoaXMub3BlbnMgPT09ICdjZW50ZXInKSB7XHJcblx0XHRcdHN0eWxlID0ge1xyXG5cdFx0XHRcdHRvcDogY29udGFpbmVyVG9wLFxyXG5cdFx0XHRcdGxlZnQ6ICgoZWxlbWVudExvY2F0aW9uLmxlZnQgKyBlbGVtZW50TG9jYXRpb24ud2lkdGggLyAyIC0gY29udGFpbmVyLmNsaWVudFdpZHRoIC8gMikgICsgdGhpcy5sZWZ0QWRqdXN0bWVudCkgKyAncHgnLFxyXG5cdFx0XHRcdHJpZ2h0OiAnYXV0bydcclxuXHRcdFx0fTtcclxuXHRcdH0gZWxzZSBpZiAodGhpcy5vcGVucyA9PT0gJ3JpZ2h0Jykge1xyXG5cdFx0XHRzdHlsZSA9IHtcclxuXHRcdFx0XHR0b3A6IGNvbnRhaW5lclRvcCxcclxuXHRcdFx0XHRsZWZ0OiAoZWxlbWVudExvY2F0aW9uLmxlZnQgKyB0aGlzLmxlZnRBZGp1c3RtZW50KSArICdweCcsXHJcblx0XHRcdFx0cmlnaHQ6ICdhdXRvJ1xyXG5cdFx0XHR9O1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0Y29uc3QgcG9zaXRpb24gPSBlbGVtZW50TG9jYXRpb24ubGVmdCArIGVsZW1lbnRMb2NhdGlvbi53aWR0aCAvIDIgLSBjb250YWluZXIuY2xpZW50V2lkdGggLyAyO1xyXG5cclxuXHRcdFx0aWYgKHBvc2l0aW9uIDwgMCkge1xyXG5cdFx0XHRcdHN0eWxlID0ge1xyXG5cdFx0XHRcdFx0dG9wOiBjb250YWluZXJUb3AsXHJcblx0XHRcdFx0XHRsZWZ0OiAoZWxlbWVudExvY2F0aW9uLmxlZnQgKyB0aGlzLmxlZnRBZGp1c3RtZW50KSArICdweCcsXHJcblx0XHRcdFx0XHRyaWdodDogJ2F1dG8nXHJcblx0XHRcdFx0fTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRzdHlsZSA9IHtcclxuXHRcdFx0XHRcdHRvcDogY29udGFpbmVyVG9wLFxyXG5cdFx0XHRcdFx0bGVmdDogKHBvc2l0aW9uICsgdGhpcy5sZWZ0QWRqdXN0bWVudCkgKyAncHgnLFxyXG5cdFx0XHRcdFx0cmlnaHQ6ICdhdXRvJ1xyXG5cdFx0XHRcdH07XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRpZiAoIXRoaXMuaXNGdWxsU2NyZWVuUGlja2VyICYmIHN0eWxlKSB7XHJcblx0XHRcdHRoaXMuX3JlbmRlcmVyLnNldFN0eWxlKGNvbnRhaW5lciwgJ3RvcCcsIHN0eWxlLnRvcCk7XHJcblx0XHRcdHRoaXMuX3JlbmRlcmVyLnNldFN0eWxlKGNvbnRhaW5lciwgJ2xlZnQnLCBzdHlsZS5sZWZ0KTtcclxuXHRcdFx0dGhpcy5fcmVuZGVyZXIuc2V0U3R5bGUoY29udGFpbmVyLCAncmlnaHQnLCBzdHlsZS5yaWdodCk7XHJcblx0XHR9XHJcblx0fVxyXG5cdGlucHV0Q2hhbmdlZChlKSB7XHJcblx0XHRpZiAoZS50YXJnZXQudGFnTmFtZS50b0xvd2VyQ2FzZSgpICE9PSAnaW5wdXQnKSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHRcdGlmICghZS50YXJnZXQudmFsdWUubGVuZ3RoKSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHRcdGNvbnN0IGRhdGVTdHJpbmcgPSBlLnRhcmdldC52YWx1ZS5zcGxpdCh0aGlzLnBpY2tlci5sb2NhbGUuc2VwYXJhdG9yKTtcclxuXHRcdGxldCBzdGFydCA9IG51bGwsXHJcblx0XHRcdGVuZCA9IG51bGw7XHJcblx0XHRpZiAoZGF0ZVN0cmluZy5sZW5ndGggPT09IDIpIHtcclxuXHRcdFx0c3RhcnQgPSBtb21lbnQoZGF0ZVN0cmluZ1swXSwgdGhpcy5waWNrZXIubG9jYWxlLmZvcm1hdCk7XHJcblx0XHRcdGVuZCA9IG1vbWVudChkYXRlU3RyaW5nWzFdLCB0aGlzLnBpY2tlci5sb2NhbGUuZm9ybWF0KTtcclxuXHRcdH1cclxuXHRcdGlmICh0aGlzLnNpbmdsZURhdGVQaWNrZXIgfHwgc3RhcnQgPT09IG51bGwgfHwgZW5kID09PSBudWxsKSB7XHJcblx0XHRcdHN0YXJ0ID0gbW9tZW50KGUudGFyZ2V0LnZhbHVlLCB0aGlzLnBpY2tlci5sb2NhbGUuZm9ybWF0KTtcclxuXHRcdFx0ZW5kID0gc3RhcnQ7XHJcblx0XHR9XHJcblx0XHRpZiAoIXN0YXJ0LmlzVmFsaWQoKSB8fCAhZW5kLmlzVmFsaWQoKSkge1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblx0XHR0aGlzLnBpY2tlci5zZXRTdGFydERhdGUoc3RhcnQpO1xyXG5cdFx0dGhpcy5waWNrZXIuc2V0RW5kRGF0ZShlbmQpO1xyXG5cdFx0dGhpcy5waWNrZXIudXBkYXRlVmlldygpO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogRm9yIGNsaWNrIG91dHNpZGUgb2YgdGhlIGNhbGVuZGFyJ3MgY29udGFpbmVyXHJcblx0ICogQHBhcmFtIGV2ZW50IGV2ZW50IG9iamVjdFxyXG5cdCAqL1xyXG5cdEBIb3N0TGlzdGVuZXIoJ2RvY3VtZW50OmNsaWNrJywgWyckZXZlbnQnXSlcclxuXHRvdXRzaWRlQ2xpY2soZXZlbnQpOiB2b2lkIHtcclxuXHRcdGlmICghZXZlbnQudGFyZ2V0KSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoZXZlbnQudGFyZ2V0Py5jbGFzc0xpc3Q/LmNvbnRhaW5zKCduZ3gtZGF0ZXJhbmdlcGlja2VyLWFjdGlvbicpKSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRjb25zdCB0YXJnZXRFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy50YXJnZXRFbGVtZW50SWQpO1xyXG5cdFx0aWYgKHRhcmdldEVsZW1lbnQ/LmNvbnRhaW5zKGV2ZW50LnRhcmdldCkpIHtcclxuXHRcdFx0dGhpcy5vcGVuKGV2ZW50KTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoXHJcblx0XHRcdCF0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5jb250YWlucyhldmVudC50YXJnZXQpICYmXHJcblx0XHRcdChldmVudC50YXJnZXQgYXMgSFRNTFNwYW5FbGVtZW50KT8uY2xhc3NOYW1lPy5pbmRleE9mKCdtYXQtb3B0aW9uJykgPT09IC0xXHJcblx0XHQpIHtcclxuXHRcdFx0dGhpcy5oaWRlKCk7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcbiJdfQ==