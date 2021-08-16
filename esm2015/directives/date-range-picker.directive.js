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
        if (event.target.closest('.ngx-daterangepicker-action')) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1yYW5nZS1waWNrZXIuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IkQ6L2RldmVsb3BtZW50L2FjY2Vzc28vYXBwbGljYXRpb25zL25neC1kYXRlcmFuZ2VwaWNrZXItbWF0ZXJpYWwvc3JjL2RhdGVyYW5nZXBpY2tlci8iLCJzb3VyY2VzIjpbImRpcmVjdGl2ZXMvZGF0ZS1yYW5nZS1waWNrZXIuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTixjQUFjLEVBQ2QsaUJBQWlCLEVBQ2pCLHdCQUF3QixFQUN4QixTQUFTLEVBRVQsVUFBVSxFQUVWLFlBQVksRUFDWixVQUFVLEVBQ1YsWUFBWSxFQUNaLFFBQVEsRUFDUixLQUFLLEVBRUwsZUFBZSxFQUdmLE1BQU0sRUFDTixTQUFTLEVBRVQsZ0JBQWdCLEVBQ2hCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ25ELE9BQU8sS0FBSyxPQUFPLE1BQU0sUUFBUSxDQUFDO0FBQ2xDLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLDJDQUEyQyxDQUFDO0FBR3JGLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUUzRCxNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUM7QUFvQnZCLE1BQU0sT0FBTyx3QkFBd0I7SUErQnBDLFlBQ1EsY0FBOEIsRUFDOUIsZ0JBQWtDLEVBQ2xDLFFBQWtCLEVBQ2xCLGtCQUFxQyxFQUNwQyx5QkFBbUQsRUFDbkQsR0FBZSxFQUNmLFNBQW9CLEVBQ3BCLE9BQXdCLEVBQ3hCLGNBQTZCLEVBQzdCLFVBQXNCO1FBVHZCLG1CQUFjLEdBQWQsY0FBYyxDQUFnQjtRQUM5QixxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBQ2xDLGFBQVEsR0FBUixRQUFRLENBQVU7UUFDbEIsdUJBQWtCLEdBQWxCLGtCQUFrQixDQUFtQjtRQUNwQyw4QkFBeUIsR0FBekIs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QUFZLFNBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxRQUFRLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xyXG5cdEFwcGxpY2F0aW9uUmVmLFxyXG5cdENoYW5nZURldGVjdG9yUmVmLFxyXG5cdENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcixcclxuXHREaXJlY3RpdmUsXHJcblx0RG9DaGVjayxcclxuXHRFbGVtZW50UmVmLFxyXG5cdEVtYmVkZGVkVmlld1JlZixcclxuXHRFdmVudEVtaXR0ZXIsXHJcblx0Zm9yd2FyZFJlZixcclxuXHRIb3N0TGlzdGVuZXIsXHJcblx0SW5qZWN0b3IsXHJcblx0SW5wdXQsXHJcblx0S2V5VmFsdWVEaWZmZXIsXHJcblx0S2V5VmFsdWVEaWZmZXJzLFxyXG5cdE9uQ2hhbmdlcyxcclxuXHRPbkluaXQsXHJcblx0T3V0cHV0LFxyXG5cdFJlbmRlcmVyMixcclxuXHRTaW1wbGVDaGFuZ2VzLFxyXG5cdFZpZXdDb250YWluZXJSZWZcclxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgTkdfVkFMVUVfQUNDRVNTT1IgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XHJcbmltcG9ydCAqIGFzIF9tb21lbnQgZnJvbSAnbW9tZW50JztcclxuaW1wb3J0IHsgRGF0ZVJhbmdlUGlja2VyQ29tcG9uZW50IH0gZnJvbSAnLi4vY29tcG9uZW50cy9kYXRlLXJhbmdlLXBpY2tlci5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBMb2NhbGVDb25maWcgfSBmcm9tICcuLi9kYXRlLXJhbmdlLXBpY2tlci5jb25maWcnO1xyXG5pbXBvcnQgeyBEYXRlUmFuZ2VQcmVzZXQgfSBmcm9tICcuLi9kYXRlLXJhbmdlLXBpY2tlci5tb2RlbHMnO1xyXG5pbXBvcnQgeyBMb2NhbGVTZXJ2aWNlIH0gZnJvbSAnLi4vc2VydmljZXMvbG9jYWxlLnNlcnZpY2UnO1xyXG5cclxuY29uc3QgbW9tZW50ID0gX21vbWVudDtcclxuXHJcbkBEaXJlY3RpdmUoe1xyXG5cdC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpkaXJlY3RpdmUtc2VsZWN0b3JcclxuXHRzZWxlY3RvcjogJypbbmd4RGF0ZVJhbmdlUGlja2VyTWRdJyxcclxuXHQvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8taG9zdC1tZXRhZGF0YS1wcm9wZXJ0eVxyXG5cdGhvc3Q6IHtcclxuXHRcdCcoa2V5dXAuZXNjKSc6ICdoaWRlKCknLFxyXG5cdFx0JyhibHVyKSc6ICdvbkJsdXIoKScsXHJcblx0XHQnKGNsaWNrKSc6ICdvcGVuKCknLFxyXG5cdFx0JyhrZXl1cCknOiAnaW5wdXRDaGFuZ2VkKCRldmVudCknXHJcblx0fSxcclxuXHRwcm92aWRlcnM6IFtcclxuXHRcdHtcclxuXHRcdFx0cHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXHJcblx0XHRcdHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IERhdGVSYW5nZVBpY2tlckRpcmVjdGl2ZSksXHJcblx0XHRcdG11bHRpOiB0cnVlXHJcblx0XHR9XHJcblx0XVxyXG59KVxyXG5leHBvcnQgY2xhc3MgRGF0ZVJhbmdlUGlja2VyRGlyZWN0aXZlIGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMsIERvQ2hlY2sge1xyXG5cdEBJbnB1dCgpIHNldCBsb2NhbGUodmFsdWUpIHtcclxuXHRcdHRoaXMuX2xvY2FsZSA9IHsgLi4udGhpcy5fbG9jYWxlU2VydmljZS5jb25maWcsIC4uLnZhbHVlIH07XHJcblx0fVxyXG5cdGdldCBsb2NhbGUoKTogYW55IHtcclxuXHRcdHJldHVybiB0aGlzLl9sb2NhbGU7XHJcblx0fVxyXG5cdEBJbnB1dCgpIHNldCBzdGFydEtleSh2YWx1ZSkge1xyXG5cdFx0aWYgKHZhbHVlICE9PSBudWxsKSB7XHJcblx0XHRcdHRoaXMuX3N0YXJ0S2V5ID0gdmFsdWU7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aGlzLl9zdGFydEtleSA9ICdzdGFydERhdGUnO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRASW5wdXQoKSBzZXQgZW5kS2V5KHZhbHVlKSB7XHJcblx0XHRpZiAodmFsdWUgIT09IG51bGwpIHtcclxuXHRcdFx0dGhpcy5fZW5kS2V5ID0gdmFsdWU7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aGlzLl9lbmRLZXkgPSAnZW5kRGF0ZSc7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRnZXQgdmFsdWUoKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5fdmFsdWUgfHwgbnVsbDtcclxuXHR9XHJcblx0c2V0IHZhbHVlKHZhbCkge1xyXG5cdFx0dGhpcy5fdmFsdWUgPSB2YWw7XHJcblx0XHR0aGlzLl9vbkNoYW5nZSh2YWwpO1xyXG5cdFx0dGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XHJcblx0fVxyXG5cclxuXHRjb25zdHJ1Y3RvcihcclxuXHRcdHB1YmxpYyBhcHBsaWNhdGlvblJlZjogQXBwbGljYXRpb25SZWYsXHJcblx0XHRwdWJsaWMgdmlld0NvbnRhaW5lclJlZjogVmlld0NvbnRhaW5lclJlZixcclxuXHRcdHB1YmxpYyBpbmplY3RvcjogSW5qZWN0b3IsXHJcblx0XHRwdWJsaWMgX2NoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcclxuXHRcdHByaXZhdGUgX2NvbXBvbmVudEZhY3RvcnlSZXNvbHZlcjogQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLFxyXG5cdFx0cHJpdmF0ZSBfZWw6IEVsZW1lbnRSZWYsXHJcblx0XHRwcml2YXRlIF9yZW5kZXJlcjogUmVuZGVyZXIyLFxyXG5cdFx0cHJpdmF0ZSBkaWZmZXJzOiBLZXlWYWx1ZURpZmZlcnMsXHJcblx0XHRwcml2YXRlIF9sb2NhbGVTZXJ2aWNlOiBMb2NhbGVTZXJ2aWNlLFxyXG5cdFx0cHJpdmF0ZSBlbGVtZW50UmVmOiBFbGVtZW50UmVmLFxyXG5cdCkge1xyXG5cdFx0dGhpcy5kcm9wcyA9ICdkb3duJztcclxuXHRcdHRoaXMub3BlbnMgPSAnYXV0byc7XHJcblxyXG5cdFx0Y29uc3QgYXBwbGljYXRpb25Sb290ID0gZG9jdW1lbnQuYm9keS5xdWVyeVNlbGVjdG9yKCcqW25nLXZlcnNpb25dJykgYXMgSFRNTEVsZW1lbnQ7XHJcblx0XHRjb25zdCBkYXRlUmFuZ2VQaWNrZXJFbGVtZW50ID0gYXBwbGljYXRpb25Sb290LnF1ZXJ5U2VsZWN0b3IoJ25neC1kYXRlcmFuZ2VwaWNrZXItbWF0ZXJpYWwnKTtcclxuXHRcdGNvbnN0IGNvbXBvbmVudEZhY3RvcnkgPSB0aGlzLl9jb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIucmVzb2x2ZUNvbXBvbmVudEZhY3RvcnkoRGF0ZVJhbmdlUGlja2VyQ29tcG9uZW50KTtcclxuXHRcdGNvbnN0IGNvbXBvbmVudFJlZiA9IGNvbXBvbmVudEZhY3RvcnkuY3JlYXRlKGluamVjdG9yKTtcclxuXHRcdHRoaXMuYXBwbGljYXRpb25SZWYuYXR0YWNoVmlldyhjb21wb25lbnRSZWYuaG9zdFZpZXcpO1xyXG5cdFx0Y29uc3QgY29tcG9uZW50RWxlbSA9IChjb21wb25lbnRSZWYuaG9zdFZpZXcgYXMgRW1iZWRkZWRWaWV3UmVmPGFueT4pLnJvb3ROb2Rlc1swXSBhcyBIVE1MRWxlbWVudDtcclxuXHRcdGNvbXBvbmVudEVsZW0uY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XHJcblxyXG5cdFx0aWYgKGRhdGVSYW5nZVBpY2tlckVsZW1lbnQgJiYgYXBwbGljYXRpb25Sb290LmNvbnRhaW5zKGRhdGVSYW5nZVBpY2tlckVsZW1lbnQpKSB7XHJcblx0XHRcdGRhdGVSYW5nZVBpY2tlckVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XHJcblx0XHRcdGFwcGxpY2F0aW9uUm9vdC5yZW1vdmVDaGlsZChkYXRlUmFuZ2VQaWNrZXJFbGVtZW50KTtcclxuXHRcdH1cclxuXHJcblx0XHRhcHBsaWNhdGlvblJvb3QuYXBwZW5kQ2hpbGQoY29tcG9uZW50RWxlbSk7XHJcblxyXG5cdFx0dGhpcy5waWNrZXIgPSA8RGF0ZVJhbmdlUGlja2VyQ29tcG9uZW50PmNvbXBvbmVudFJlZi5pbnN0YW5jZTtcclxuXHRcdHRoaXMucGlja2VyLmlubGluZSA9IGZhbHNlO1xyXG5cdH1cclxuXHRwdWJsaWMgcGlja2VyOiBEYXRlUmFuZ2VQaWNrZXJDb21wb25lbnQ7XHJcblx0cHJpdmF0ZSBfb25DaGFuZ2UgPSBGdW5jdGlvbi5wcm90b3R5cGU7XHJcblx0cHJpdmF0ZSBfb25Ub3VjaGVkID0gRnVuY3Rpb24ucHJvdG90eXBlO1xyXG5cdHByaXZhdGUgX3ZhbGlkYXRvckNoYW5nZSA9IEZ1bmN0aW9uLnByb3RvdHlwZTtcclxuXHRwcml2YXRlIF92YWx1ZTogYW55O1xyXG5cdHByaXZhdGUgbG9jYWxlRGlmZmVyOiBLZXlWYWx1ZURpZmZlcjxzdHJpbmcsIGFueT47XHJcblx0QElucHV0KClcclxuXHRtaW5EYXRlOiBfbW9tZW50Lk1vbWVudDtcclxuXHRASW5wdXQoKVxyXG5cdG1heERhdGU6IF9tb21lbnQuTW9tZW50O1xyXG5cdEBJbnB1dCgpXHJcblx0YXV0b0FwcGx5OiBib29sZWFuO1xyXG5cclxuXHRASW5wdXQoKVxyXG5cdHRhcmdldEVsZW1lbnRJZDogc3RyaW5nO1xyXG5cdEBJbnB1dCgpXHJcblx0dG9wQWRqdXN0bWVudDogbnVtYmVyO1xyXG5cdEBJbnB1dCgpXHJcblx0bGVmdEFkanVzdG1lbnQ6IG51bWJlcjtcclxuXHRASW5wdXQoKVxyXG5cdGlzRnVsbFNjcmVlblBpY2tlcjogYm9vbGVhbjtcclxuXHJcblx0QElucHV0KClcclxuXHRhbHdheXNTaG93Q2FsZW5kYXJzOiBib29sZWFuO1xyXG5cdEBJbnB1dCgpXHJcblx0c2hvd0N1c3RvbVJhbmdlTGFiZWw6IGJvb2xlYW47XHJcblx0QElucHV0KClcclxuXHRsaW5rZWRDYWxlbmRhcnM6IGJvb2xlYW47XHJcblx0QElucHV0KClcclxuXHRidXR0b25DbGFzc0FwcGx5OiBzdHJpbmc7XHJcblx0QElucHV0KClcclxuXHRidXR0b25DbGFzc1Jlc2V0OiBzdHJpbmc7XHJcblx0QElucHV0KClcclxuXHRidXR0b25DbGFzc1JhbmdlOiBzdHJpbmc7XHJcblx0QElucHV0KClcclxuXHRkYXRlTGltaXQ6IG51bWJlciA9IG51bGw7XHJcblx0QElucHV0KClcclxuXHRzaW5nbGVEYXRlUGlja2VyOiBib29sZWFuO1xyXG5cdEBJbnB1dCgpXHJcblx0c2hvd1dlZWtOdW1iZXJzOiBib29sZWFuO1xyXG5cdEBJbnB1dCgpXHJcblx0c2hvd0lTT1dlZWtOdW1iZXJzOiBib29sZWFuO1xyXG5cdEBJbnB1dCgpXHJcblx0c2hvd0Ryb3Bkb3duczogYm9vbGVhbjtcclxuXHRASW5wdXQoKVxyXG5cdGlzSW52YWxpZERhdGU6IEZ1bmN0aW9uO1xyXG5cdEBJbnB1dCgpXHJcblx0aXNDdXN0b21EYXRlOiBGdW5jdGlvbjtcclxuXHRASW5wdXQoKVxyXG5cdHNob3dDbGVhckJ1dHRvbjogYm9vbGVhbjtcclxuXHRASW5wdXQoKVxyXG5cdGN1c3RvbVJhbmdlRGlyZWN0aW9uOiBib29sZWFuO1xyXG5cdEBJbnB1dCgpXHJcblx0cmFuZ2VzOiBEYXRlUmFuZ2VQcmVzZXRbXTtcclxuXHRASW5wdXQoKVxyXG5cdG9wZW5zOiBzdHJpbmc7XHJcblx0QElucHV0KClcclxuXHRkcm9wczogc3RyaW5nO1xyXG5cdGZpcnN0TW9udGhEYXlDbGFzczogc3RyaW5nO1xyXG5cdEBJbnB1dCgpXHJcblx0bGFzdE1vbnRoRGF5Q2xhc3M6IHN0cmluZztcclxuXHRASW5wdXQoKVxyXG5cdGVtcHR5V2Vla1Jvd0NsYXNzOiBzdHJpbmc7XHJcblx0QElucHV0KClcclxuXHRmaXJzdERheU9mTmV4dE1vbnRoQ2xhc3M6IHN0cmluZztcclxuXHRASW5wdXQoKVxyXG5cdGxhc3REYXlPZlByZXZpb3VzTW9udGhDbGFzczogc3RyaW5nO1xyXG5cdEBJbnB1dCgpXHJcblx0a2VlcENhbGVuZGFyT3BlbmluZ1dpdGhSYW5nZTogYm9vbGVhbjtcclxuXHRASW5wdXQoKVxyXG5cdHNob3dSYW5nZUxhYmVsT25JbnB1dDogYm9vbGVhbjtcclxuXHRASW5wdXQoKVxyXG5cdHNob3dDYW5jZWw6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHRASW5wdXQoKVxyXG5cdGxvY2tTdGFydERhdGU6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHQvLyB0aW1lcGlja2VyIHZhcmlhYmxlc1xyXG5cdEBJbnB1dCgpXHJcblx0dGltZVBpY2tlcjogQm9vbGVhbiA9IGZhbHNlO1xyXG5cdEBJbnB1dCgpXHJcblx0dGltZVBpY2tlcjI0SG91cjogQm9vbGVhbiA9IGZhbHNlO1xyXG5cdEBJbnB1dCgpXHJcblx0dGltZVBpY2tlckluY3JlbWVudDogbnVtYmVyID0gMTtcclxuXHRASW5wdXQoKVxyXG5cdHRpbWVQaWNrZXJTZWNvbmRzOiBCb29sZWFuID0gZmFsc2U7XHJcblx0QElucHV0KCkgY2xvc2VPbkF1dG9BcHBseSA9IHRydWU7XHJcblx0X2xvY2FsZTogTG9jYWxlQ29uZmlnID0ge307XHJcblx0QElucHV0KClcclxuXHRwcml2YXRlIF9lbmRLZXk6IHN0cmluZyA9ICdlbmREYXRlJztcclxuXHRwcml2YXRlIF9zdGFydEtleTogc3RyaW5nID0gJ3N0YXJ0RGF0ZSc7XHJcblx0bm90Rm9yQ2hhbmdlc1Byb3BlcnR5OiBBcnJheTxzdHJpbmc+ID0gWydsb2NhbGUnLCAnZW5kS2V5JywgJ3N0YXJ0S2V5J107XHJcblxyXG5cdC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1vdXRwdXQtb24tcHJlZml4IG5vLW91dHB1dC1yZW5hbWVcclxuXHRAT3V0cHV0KCdjaGFuZ2UnKSBvbkNoYW5nZTogRXZlbnRFbWl0dGVyPE9iamVjdD4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblx0Ly8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLW91dHB1dC1yZW5hbWVcclxuXHRAT3V0cHV0KCdyYW5nZUNsaWNrZWQnKSByYW5nZUNsaWNrZWQ6IEV2ZW50RW1pdHRlcjxPYmplY3Q+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cdC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1vdXRwdXQtcmVuYW1lXHJcblx0QE91dHB1dCgnZGF0ZXNVcGRhdGVkJykgZGF0ZXNVcGRhdGVkOiBFdmVudEVtaXR0ZXI8T2JqZWN0PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHRAT3V0cHV0KCkgc3RhcnREYXRlQ2hhbmdlZDogRXZlbnRFbWl0dGVyPE9iamVjdD4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblx0QE91dHB1dCgpIGVuZERhdGVDaGFuZ2VkOiBFdmVudEVtaXR0ZXI8T2JqZWN0PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHQkZXZlbnQ6IGFueTtcclxuXHJcblx0c2Nyb2xsUG9zID0gMDtcclxuXHJcblx0bmdPbkluaXQoKSB7XHJcblx0XHR0aGlzLnBpY2tlci5zdGFydERhdGVDaGFuZ2VkLmFzT2JzZXJ2YWJsZSgpLnN1YnNjcmliZSgoaXRlbUNoYW5nZWQ6IGFueSkgPT4ge1xyXG5cdFx0XHR0aGlzLnN0YXJ0RGF0ZUNoYW5nZWQuZW1pdChpdGVtQ2hhbmdlZCk7XHJcblx0XHR9KTtcclxuXHRcdHRoaXMucGlja2VyLmVuZERhdGVDaGFuZ2VkLmFzT2JzZXJ2YWJsZSgpLnN1YnNjcmliZSgoaXRlbUNoYW5nZWQ6IGFueSkgPT4ge1xyXG5cdFx0XHR0aGlzLmVuZERhdGVDaGFuZ2VkLmVtaXQoaXRlbUNoYW5nZWQpO1xyXG5cdFx0fSk7XHJcblx0XHR0aGlzLnBpY2tlci5yYW5nZUNsaWNrZWQuYXNPYnNlcnZhYmxlKCkuc3Vic2NyaWJlKChyYW5nZTogYW55KSA9PiB7XHJcblx0XHRcdHRoaXMucmFuZ2VDbGlja2VkLmVtaXQocmFuZ2UpO1xyXG5cdFx0fSk7XHJcblx0XHR0aGlzLnBpY2tlci5kYXRlc1VwZGF0ZWQuYXNPYnNlcnZhYmxlKCkuc3Vic2NyaWJlKChyYW5nZTogYW55KSA9PiB7XHJcblx0XHRcdHRoaXMuZGF0ZXNVcGRhdGVkLmVtaXQocmFuZ2UpO1xyXG5cdFx0fSk7XHJcblx0XHR0aGlzLnBpY2tlci5jaG9vc2VkRGF0ZS5hc09ic2VydmFibGUoKS5zdWJzY3JpYmUoKGNoYW5nZTogYW55KSA9PiB7XHJcblx0XHRcdGlmIChjaGFuZ2UpIHtcclxuXHRcdFx0XHRjb25zdCB2YWx1ZSA9IHt9O1xyXG5cdFx0XHRcdHZhbHVlW3RoaXMuX3N0YXJ0S2V5XSA9IGNoYW5nZS5zdGFydERhdGU7XHJcblx0XHRcdFx0dmFsdWVbdGhpcy5fZW5kS2V5XSA9IGNoYW5nZS5lbmREYXRlO1xyXG5cdFx0XHRcdHRoaXMudmFsdWUgPSB2YWx1ZTtcclxuXHRcdFx0XHR0aGlzLm9uQ2hhbmdlLmVtaXQodmFsdWUpO1xyXG5cdFx0XHRcdGlmICh0eXBlb2YgY2hhbmdlLmNob3NlbkxhYmVsID09PSAnc3RyaW5nJykge1xyXG5cdFx0XHRcdFx0dGhpcy5fZWwubmF0aXZlRWxlbWVudC52YWx1ZSA9IGNoYW5nZS5jaG9zZW5MYWJlbDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0dGhpcy5waWNrZXIuZmlyc3RNb250aERheUNsYXNzID0gdGhpcy5maXJzdE1vbnRoRGF5Q2xhc3M7XHJcblx0XHR0aGlzLnBpY2tlci5sYXN0TW9udGhEYXlDbGFzcyA9IHRoaXMubGFzdE1vbnRoRGF5Q2xhc3M7XHJcblx0XHR0aGlzLnBpY2tlci5lbXB0eVdlZWtSb3dDbGFzcyA9IHRoaXMuZW1wdHlXZWVrUm93Q2xhc3M7XHJcblx0XHR0aGlzLnBpY2tlci5maXJzdERheU9mTmV4dE1vbnRoQ2xhc3MgPSB0aGlzLmZpcnN0RGF5T2ZOZXh0TW9udGhDbGFzcztcclxuXHRcdHRoaXMucGlja2VyLmxhc3REYXlPZlByZXZpb3VzTW9udGhDbGFzcyA9IHRoaXMubGFzdERheU9mUHJldmlvdXNNb250aENsYXNzO1xyXG5cdFx0dGhpcy5waWNrZXIuZHJvcHMgPSB0aGlzLmRyb3BzO1xyXG5cdFx0dGhpcy5waWNrZXIub3BlbnMgPSB0aGlzLm9wZW5zO1xyXG5cdFx0dGhpcy5sb2NhbGVEaWZmZXIgPSB0aGlzLmRpZmZlcnMuZmluZCh0aGlzLmxvY2FsZSkuY3JlYXRlKCk7XHJcblx0XHR0aGlzLnBpY2tlci5jbG9zZU9uQXV0b0FwcGx5ID0gdGhpcy5jbG9zZU9uQXV0b0FwcGx5O1xyXG5cdFx0dGhpcy5waWNrZXIuaXNGdWxsU2NyZWVuUGlja2VyID0gdGhpcy5pc0Z1bGxTY3JlZW5QaWNrZXI7XHJcblx0fVxyXG5cclxuXHRuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XHJcblx0XHRmb3IgKGNvbnN0IGNoYW5nZSBpbiBjaGFuZ2VzKSB7XHJcblx0XHRcdGlmIChjaGFuZ2VzLmhhc093blByb3BlcnR5KGNoYW5nZSkpIHtcclxuXHRcdFx0XHRpZiAodGhpcy5ub3RGb3JDaGFuZ2VzUHJvcGVydHkuaW5kZXhPZihjaGFuZ2UpID09PSAtMSkge1xyXG5cdFx0XHRcdFx0dGhpcy5waWNrZXJbY2hhbmdlXSA9IGNoYW5nZXNbY2hhbmdlXS5jdXJyZW50VmFsdWU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRuZ0RvQ2hlY2soKSB7XHJcblx0XHRpZiAodGhpcy5sb2NhbGVEaWZmZXIpIHtcclxuXHRcdFx0Y29uc3QgY2hhbmdlcyA9IHRoaXMubG9jYWxlRGlmZmVyLmRpZmYodGhpcy5sb2NhbGUpO1xyXG5cdFx0XHRpZiAoY2hhbmdlcykge1xyXG5cdFx0XHRcdHRoaXMucGlja2VyLnVwZGF0ZUxvY2FsZSh0aGlzLmxvY2FsZSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdG9uQmx1cigpIHtcclxuXHRcdHRoaXMuX29uVG91Y2hlZCgpO1xyXG5cdH1cclxuXHJcblx0b3BlbihldmVudD86IGFueSkge1xyXG5cdFx0dGhpcy5waWNrZXIuc2hvdyhldmVudCk7XHJcblx0XHRzZXRUaW1lb3V0KCgpID0+IHtcclxuXHRcdFx0dGhpcy5zZXRQb3NpdGlvbigpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRoaWRlKGU/KSB7XHJcblx0XHR0aGlzLnBpY2tlci5oaWRlKGUpO1xyXG5cdH1cclxuXHR0b2dnbGUoZT8pIHtcclxuXHRcdGlmICh0aGlzLnBpY2tlci5pc1Nob3duKSB7XHJcblx0XHRcdHRoaXMuaGlkZShlKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoaXMub3BlbihlKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGNsZWFyKCkge1xyXG5cdFx0dGhpcy5waWNrZXIuY2xlYXIoKTtcclxuXHR9XHJcblxyXG5cdHdyaXRlVmFsdWUodmFsdWUpIHtcclxuXHRcdHRoaXMuc2V0VmFsdWUodmFsdWUpO1xyXG5cdH1cclxuXHRyZWdpc3Rlck9uQ2hhbmdlKGZuKSB7XHJcblx0XHR0aGlzLl9vbkNoYW5nZSA9IGZuO1xyXG5cdH1cclxuXHRyZWdpc3Rlck9uVG91Y2hlZChmbikge1xyXG5cdFx0dGhpcy5fb25Ub3VjaGVkID0gZm47XHJcblx0fVxyXG5cdHByaXZhdGUgc2V0VmFsdWUodmFsOiBhbnkpIHtcclxuXHRcdGlmICh2YWwpIHtcclxuXHRcdFx0dGhpcy52YWx1ZSA9IHZhbDtcclxuXHRcdFx0aWYgKHZhbFt0aGlzLl9zdGFydEtleV0pIHtcclxuXHRcdFx0XHR0aGlzLnBpY2tlci5zZXRTdGFydERhdGUodmFsW3RoaXMuX3N0YXJ0S2V5XSk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKHZhbFt0aGlzLl9lbmRLZXldKSB7XHJcblx0XHRcdFx0dGhpcy5waWNrZXIuc2V0RW5kRGF0ZSh2YWxbdGhpcy5fZW5kS2V5XSk7XHJcblx0XHRcdH1cclxuXHRcdFx0dGhpcy5waWNrZXIuY2FsY3VsYXRlQ2hvc2VuTGFiZWwoKTtcclxuXHRcdFx0aWYgKHRoaXMucGlja2VyLmNob3NlbkxhYmVsKSB7XHJcblx0XHRcdFx0dGhpcy5fZWwubmF0aXZlRWxlbWVudC52YWx1ZSA9IHRoaXMucGlja2VyLmNob3NlbkxhYmVsO1xyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aGlzLnBpY2tlci5jbGVhcigpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHQvKipcclxuXHQgKiBTZXQgcG9zaXRpb24gb2YgdGhlIGNhbGVuZGFyXHJcblx0ICovXHJcblx0c2V0UG9zaXRpb24oKSB7XHJcblx0XHRsZXQgc3R5bGU7XHJcblx0XHRsZXQgY29udGFpbmVyVG9wO1xyXG5cdFx0dGhpcy50b3BBZGp1c3RtZW50ID0gdGhpcy50b3BBZGp1c3RtZW50ID8gK3RoaXMudG9wQWRqdXN0bWVudCA6IDA7XHJcblx0XHR0aGlzLmxlZnRBZGp1c3RtZW50ID0gdGhpcy5sZWZ0QWRqdXN0bWVudCA/ICt0aGlzLmxlZnRBZGp1c3RtZW50IDogMDtcclxuXHJcblx0XHQvLyB0b2RvOiByZXZpc2l0IHRoZSBvZmZzZXRzIHdoZXJlIHdoZW4gYm90aCB0aGUgc2hhcmVkIGNvbXBvbmVudHMgYXJlIGRvbmUgYW5kIHRoZSBvcmRlciBzZWFyY2ggcmV3b3JrIGlzIGZpbmlzaGVkXHJcblx0XHRjb25zdCBjb250YWluZXIgPSB0aGlzLnBpY2tlci5waWNrZXJDb250YWluZXIubmF0aXZlRWxlbWVudCBhcyBIVE1MRWxlbWVudDtcclxuXHRcdGxldCBlbGVtZW50ID0gdGhpcy5fZWwubmF0aXZlRWxlbWVudCBhcyBIVE1MRWxlbWVudDtcclxuXHJcblx0XHRpZiAodGhpcy50YXJnZXRFbGVtZW50SWQpIHtcclxuXHRcdFx0ZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMudGFyZ2V0RWxlbWVudElkKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudEVsZW1lbnQ7XHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc3QgZWxlbWVudExvY2F0aW9uID0gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuXHJcblx0XHRpZiAodGhpcy5kcm9wcyAmJiB0aGlzLmRyb3BzID09PSAndXAnKSB7XHJcblx0XHRcdGNvbnRhaW5lclRvcCA9IGVsZW1lbnQub2Zmc2V0VG9wIC0gY29udGFpbmVyLmNsaWVudEhlaWdodCArIHRoaXMudG9wQWRqdXN0bWVudCArICdweCc7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRjb250YWluZXJUb3AgPSBlbGVtZW50TG9jYXRpb24udG9wICsgdGhpcy50b3BBZGp1c3RtZW50ICsgJ3B4JztcclxuXHRcdH1cclxuXHRcdGlmICh0aGlzLm9wZW5zID09PSAnbGVmdCcpIHtcclxuXHRcdFx0c3R5bGUgPSB7XHJcblx0XHRcdFx0dG9wOiBjb250YWluZXJUb3AsXHJcblx0XHRcdFx0bGVmdDogKChlbGVtZW50TG9jYXRpb24ubGVmdCAtIGNvbnRhaW5lci5jbGllbnRXaWR0aCArIGVsZW1lbnRMb2NhdGlvbi53aWR0aCAtIDEwMCkgICsgdGhpcy5sZWZ0QWRqdXN0bWVudCkgKyAncHgnLFxyXG5cdFx0XHRcdHJpZ2h0OiAnYXV0bydcclxuXHRcdFx0fTtcclxuXHRcdH0gZWxzZSBpZiAodGhpcy5vcGVucyA9PT0gJ2NlbnRlcicpIHtcclxuXHRcdFx0c3R5bGUgPSB7XHJcblx0XHRcdFx0dG9wOiBjb250YWluZXJUb3AsXHJcblx0XHRcdFx0bGVmdDogKChlbGVtZW50TG9jYXRpb24ubGVmdCArIGVsZW1lbnRMb2NhdGlvbi53aWR0aCAvIDIgLSBjb250YWluZXIuY2xpZW50V2lkdGggLyAyKSAgKyB0aGlzLmxlZnRBZGp1c3RtZW50KSArICdweCcsXHJcblx0XHRcdFx0cmlnaHQ6ICdhdXRvJ1xyXG5cdFx0XHR9O1xyXG5cdFx0fSBlbHNlIGlmICh0aGlzLm9wZW5zID09PSAncmlnaHQnKSB7XHJcblx0XHRcdHN0eWxlID0ge1xyXG5cdFx0XHRcdHRvcDogY29udGFpbmVyVG9wLFxyXG5cdFx0XHRcdGxlZnQ6IChlbGVtZW50TG9jYXRpb24ubGVmdCArIHRoaXMubGVmdEFkanVzdG1lbnQpICsgJ3B4JyxcclxuXHRcdFx0XHRyaWdodDogJ2F1dG8nXHJcblx0XHRcdH07XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRjb25zdCBwb3NpdGlvbiA9IGVsZW1lbnRMb2NhdGlvbi5sZWZ0ICsgZWxlbWVudExvY2F0aW9uLndpZHRoIC8gMiAtIGNvbnRhaW5lci5jbGllbnRXaWR0aCAvIDI7XHJcblxyXG5cdFx0XHRpZiAocG9zaXRpb24gPCAwKSB7XHJcblx0XHRcdFx0c3R5bGUgPSB7XHJcblx0XHRcdFx0XHR0b3A6IGNvbnRhaW5lclRvcCxcclxuXHRcdFx0XHRcdGxlZnQ6IChlbGVtZW50TG9jYXRpb24ubGVmdCArIHRoaXMubGVmdEFkanVzdG1lbnQpICsgJ3B4JyxcclxuXHRcdFx0XHRcdHJpZ2h0OiAnYXV0bydcclxuXHRcdFx0XHR9O1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHN0eWxlID0ge1xyXG5cdFx0XHRcdFx0dG9wOiBjb250YWluZXJUb3AsXHJcblx0XHRcdFx0XHRsZWZ0OiAocG9zaXRpb24gKyB0aGlzLmxlZnRBZGp1c3RtZW50KSArICdweCcsXHJcblx0XHRcdFx0XHRyaWdodDogJ2F1dG8nXHJcblx0XHRcdFx0fTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmICghdGhpcy5pc0Z1bGxTY3JlZW5QaWNrZXIgJiYgc3R5bGUpIHtcclxuXHRcdFx0dGhpcy5fcmVuZGVyZXIuc2V0U3R5bGUoY29udGFpbmVyLCAndG9wJywgc3R5bGUudG9wKTtcclxuXHRcdFx0dGhpcy5fcmVuZGVyZXIuc2V0U3R5bGUoY29udGFpbmVyLCAnbGVmdCcsIHN0eWxlLmxlZnQpO1xyXG5cdFx0XHR0aGlzLl9yZW5kZXJlci5zZXRTdHlsZShjb250YWluZXIsICdyaWdodCcsIHN0eWxlLnJpZ2h0KTtcclxuXHRcdH1cclxuXHR9XHJcblx0aW5wdXRDaGFuZ2VkKGUpIHtcclxuXHRcdGlmIChlLnRhcmdldC50YWdOYW1lLnRvTG93ZXJDYXNlKCkgIT09ICdpbnB1dCcpIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cdFx0aWYgKCFlLnRhcmdldC52YWx1ZS5sZW5ndGgpIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cdFx0Y29uc3QgZGF0ZVN0cmluZyA9IGUudGFyZ2V0LnZhbHVlLnNwbGl0KHRoaXMucGlja2VyLmxvY2FsZS5zZXBhcmF0b3IpO1xyXG5cdFx0bGV0IHN0YXJ0ID0gbnVsbCxcclxuXHRcdFx0ZW5kID0gbnVsbDtcclxuXHRcdGlmIChkYXRlU3RyaW5nLmxlbmd0aCA9PT0gMikge1xyXG5cdFx0XHRzdGFydCA9IG1vbWVudChkYXRlU3RyaW5nWzBdLCB0aGlzLnBpY2tlci5sb2NhbGUuZm9ybWF0KTtcclxuXHRcdFx0ZW5kID0gbW9tZW50KGRhdGVTdHJpbmdbMV0sIHRoaXMucGlja2VyLmxvY2FsZS5mb3JtYXQpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKHRoaXMuc2luZ2xlRGF0ZVBpY2tlciB8fCBzdGFydCA9PT0gbnVsbCB8fCBlbmQgPT09IG51bGwpIHtcclxuXHRcdFx0c3RhcnQgPSBtb21lbnQoZS50YXJnZXQudmFsdWUsIHRoaXMucGlja2VyLmxvY2FsZS5mb3JtYXQpO1xyXG5cdFx0XHRlbmQgPSBzdGFydDtcclxuXHRcdH1cclxuXHRcdGlmICghc3RhcnQuaXNWYWxpZCgpIHx8ICFlbmQuaXNWYWxpZCgpKSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHRcdHRoaXMucGlja2VyLnNldFN0YXJ0RGF0ZShzdGFydCk7XHJcblx0XHR0aGlzLnBpY2tlci5zZXRFbmREYXRlKGVuZCk7XHJcblx0XHR0aGlzLnBpY2tlci51cGRhdGVWaWV3KCk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBGb3IgY2xpY2sgb3V0c2lkZSBvZiB0aGUgY2FsZW5kYXIncyBjb250YWluZXJcclxuXHQgKiBAcGFyYW0gZXZlbnQgZXZlbnQgb2JqZWN0XHJcblx0ICovXHJcblx0QEhvc3RMaXN0ZW5lcignZG9jdW1lbnQ6Y2xpY2snLCBbJyRldmVudCddKVxyXG5cdG91dHNpZGVDbGljayhldmVudCk6IHZvaWQge1xyXG5cdFx0aWYgKCFldmVudC50YXJnZXQpIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICgoZXZlbnQudGFyZ2V0IGFzIEhUTUxFbGVtZW50KS5jbG9zZXN0KCcubmd4LWRhdGVyYW5nZXBpY2tlci1hY3Rpb24nKSkge1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGV2ZW50LnRhcmdldD8uY2xhc3NMaXN0Py5jb250YWlucygnbmd4LWRhdGVyYW5nZXBpY2tlci1hY3Rpb24nKSkge1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc3QgdGFyZ2V0RWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMudGFyZ2V0RWxlbWVudElkKTtcclxuXHRcdGlmICh0YXJnZXRFbGVtZW50Py5jb250YWlucyhldmVudC50YXJnZXQpKSB7XHJcblx0XHRcdHRoaXMub3BlbihldmVudCk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKFxyXG5cdFx0XHQhdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuY29udGFpbnMoZXZlbnQudGFyZ2V0KSAmJlxyXG5cdFx0XHQoZXZlbnQudGFyZ2V0IGFzIEhUTUxTcGFuRWxlbWVudCk/LmNsYXNzTmFtZT8uaW5kZXhPZignbWF0LW9wdGlvbicpID09PSAtMVxyXG5cdFx0KSB7XHJcblx0XHRcdHRoaXMuaGlkZSgpO1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG4iXX0=