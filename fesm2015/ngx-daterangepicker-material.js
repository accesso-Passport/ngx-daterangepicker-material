import { CommonModule } from '@angular/common';
import { InjectionToken, Injectable, Inject, EventEmitter, Component, ViewEncapsulation, forwardRef, ElementRef, ChangeDetectorRef, Input, Output, ViewChild, Directive, ApplicationRef, ViewContainerRef, Injector, ComponentFactoryResolver, Renderer2, KeyValueDiffers, HostListener, NgModule } from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import * as _moment from 'moment';

const moment = _moment;
const LOCALE_CONFIG = new InjectionToken('daterangepicker.config');
/**
 *  DefaultLocaleConfig
 */
const DefaultLocaleConfig = {
    direction: 'ltr',
    separator: ' - ',
    weekLabel: 'W',
    applyLabel: 'Done',
    cancelLabel: 'Reset',
    clearLabel: 'Clear',
    startDateLabel: 'Start Date',
    endDateLabel: 'End Date',
    customRangeLabel: 'Presets',
    daysOfWeek: moment.weekdaysMin(),
    monthNames: moment.months(),
    firstDay: moment.localeData().firstDayOfWeek()
};

class LocaleService {
    constructor(_config) {
        this._config = _config;
    }
    get config() {
        return Object.assign(Object.assign({}, DefaultLocaleConfig), this._config);
    }
}
LocaleService.decorators = [
    { type: Injectable }
];
LocaleService.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [LOCALE_CONFIG,] }] }
];

const moment$1 = _moment;
var SideEnum;
(function (SideEnum) {
    SideEnum["left"] = "left";
    SideEnum["right"] = "right";
})(SideEnum || (SideEnum = {}));
class DateRangePickerComponent {
    constructor(el, _ref, _localeService) {
        this.el = el;
        this._ref = _ref;
        this._localeService = _localeService;
        this._old = { start: null, end: null };
        this.calendarVariables = { left: {}, right: {} };
        this.timepickerVariables = { left: {}, right: {} };
        this.daterangepicker = { start: new FormControl(), end: new FormControl() };
        this.applyBtn = { disabled: false };
        this.startDate = moment$1().startOf('day');
        this.endDate = moment$1().endOf('day');
        this.dateLimit = null;
        // used in template for compile time support of enum values.
        this.sideEnum = SideEnum;
        this.minDate = null;
        this.maxDate = null;
        this.autoApply = false;
        this.singleDatePicker = false;
        this.showDropdowns = false;
        this.showWeekNumbers = false;
        this.showISOWeekNumbers = false;
        this.linkedCalendars = !this.singleDatePicker;
        this.autoUpdateInput = true;
        this.alwaysShowCalendars = false;
        this.lockStartDate = false;
        // timepicker variables
        this.timePicker = false;
        this.timePicker24Hour = false;
        this.timePickerIncrement = 1;
        this.timePickerSeconds = false;
        // end of timepicker variables
        this.showClearButton = false;
        this.firstMonthDayClass = null;
        this.lastMonthDayClass = null;
        this.emptyWeekRowClass = null;
        this.firstDayOfNextMonthClass = null;
        this.lastDayOfPreviousMonthClass = null;
        this.buttonClassApply = null;
        this.buttonClassReset = null;
        this.buttonClassRange = null;
        this._locale = {};
        // custom ranges
        this._ranges = [];
        this.showCancel = false;
        this.keepCalendarOpeningWithRange = false;
        this.showRangeLabelOnInput = false;
        this.customRangeDirection = false;
        // some state information
        this.isShown = false;
        this.inline = true;
        this.leftCalendar = { month: moment$1() };
        this.rightCalendar = { month: moment$1().add(1, 'month') };
        this.showCalInRanges = false;
        this.options = {}; // should get some opt from user
        this.closeOnAutoApply = true;
        this.choosedDate = new EventEmitter();
        this.rangeClicked = new EventEmitter();
        this.datesUpdated = new EventEmitter();
        this.startDateChanged = new EventEmitter();
        this.endDateChanged = new EventEmitter();
    }
    set locale(value) {
        this._locale = Object.assign(Object.assign({}, this._localeService.config), value);
    }
    get locale() {
        return this._locale;
    }
    set ranges(value) {
        this._ranges = value;
        this.renderRanges();
    }
    get ranges() {
        return this._ranges;
    }
    ngOnInit() {
        this._buildLocale();
        const daysOfWeek = [...this.locale.daysOfWeek];
        if (this.locale.firstDay !== 0) {
            let iterator = this.locale.firstDay;
            while (iterator > 0) {
                daysOfWeek.push(daysOfWeek.shift());
                iterator--;
            }
        }
        this.locale.daysOfWeek = daysOfWeek;
        if (this.inline) {
            this._old.start = this.startDate.clone();
            this._old.end = this.endDate.clone();
        }
        if (this.startDate && this.timePicker) {
            this.setStartDate(this.startDate);
            this.renderTimePicker(SideEnum.left);
        }
        if (this.endDate && this.timePicker) {
            this.setEndDate(this.endDate);
            this.renderTimePicker(SideEnum.right);
        }
        this.updateMonthsInView();
        this.renderCalendar(SideEnum.left);
        this.renderCalendar(SideEnum.right);
        this.renderRanges();
    }
    renderRanges() {
        let start, end;
        this.ranges.forEach(preset => {
            start = preset.range.start;
            end = preset.range.end;
            // If the start or end date exceed those allowed by the minDate
            // option, shorten the range to the allowable period.
            if (this.minDate && start.isBefore(this.minDate)) {
                start = this.minDate.clone();
            }
            const maxDate = this.maxDate;
            if (maxDate && end.isAfter(maxDate)) {
                end = maxDate.clone();
            }
            // If the end of the range is before the minimum or the start of the range is
            // after the maximum, don't display this range option at all.
            if ((this.minDate && end.isBefore(this.minDate, this.timePicker ? 'minute' : 'day')) ||
                (maxDate && end.isAfter(maxDate, this.timePicker ? 'minute' : 'day'))) {
                // continue;
            }
            else {
                // Support unicode chars in the range names.
                const elem = document.createElement('textarea');
                elem.innerHTML = preset.label;
                preset.label = elem.value;
            }
        });
        this.showCalInRanges = true;
        if (!this.timePicker) {
            this.startDate = this.startDate.startOf('day');
            this.endDate = this.endDate.endOf('day');
        }
    }
    renderTimePicker(side) {
        if (side === SideEnum.right && !this.endDate) {
            return;
        }
        let selected, minDate;
        const maxDate = this.maxDate;
        if (side === SideEnum.left) {
            (selected = this.startDate.clone()), (minDate = this.minDate);
        }
        else if (side === SideEnum.right) {
            (selected = this.endDate.clone()), (minDate = this.startDate);
        }
        const start = this.timePicker24Hour ? 0 : 1;
        const end = this.timePicker24Hour ? 23 : 12;
        this.timepickerVariables[side] = {
            hours: [],
            minutes: [],
            minutesLabel: [],
            seconds: [],
            secondsLabel: [],
            disabledHours: [],
            disabledMinutes: [],
            disabledSeconds: [],
            selectedHour: 0,
            selectedMinute: 0,
            selectedSecond: 0
        };
        // generate hours
        for (let i = start; i <= end; i++) {
            let i_in_24 = i;
            if (!this.timePicker24Hour) {
                i_in_24 = selected.hour() >= 12 ? (i === 12 ? 12 : i + 12) : i === 12 ? 0 : i;
            }
            const time = selected.clone().hour(i_in_24);
            let disabled = false;
            if (minDate && time.minute(59).isBefore(minDate)) {
                disabled = true;
            }
            if (maxDate && time.minute(0).isAfter(maxDate)) {
                disabled = true;
            }
            this.timepickerVariables[side].hours.push(i);
            if (i_in_24 === selected.hour() && !disabled) {
                this.timepickerVariables[side].selectedHour = i;
            }
            else if (disabled) {
                this.timepickerVariables[side].disabledHours.push(i);
            }
        }
        // generate minutes
        for (let i = 0; i < 60; i += this.timePickerIncrement) {
            const padded = i < 10 ? '0' + i : i;
            const time = selected.clone().minute(i);
            let disabled = false;
            if (minDate && time.second(59).isBefore(minDate)) {
                disabled = true;
            }
            if (maxDate && time.second(0).isAfter(maxDate)) {
                disabled = true;
            }
            this.timepickerVariables[side].minutes.push(i);
            this.timepickerVariables[side].minutesLabel.push(padded);
            if (selected.minute() === i && !disabled) {
                this.timepickerVariables[side].selectedMinute = i;
            }
            else if (disabled) {
                this.timepickerVariables[side].disabledMinutes.push(i);
            }
        }
        // generate seconds
        if (this.timePickerSeconds) {
            for (let i = 0; i < 60; i++) {
                const padded = i < 10 ? '0' + i : i;
                const time = selected.clone().second(i);
                let disabled = false;
                if (minDate && time.isBefore(minDate)) {
                    disabled = true;
                }
                if (maxDate && time.isAfter(maxDate)) {
                    disabled = true;
                }
                this.timepickerVariables[side].seconds.push(i);
                this.timepickerVariables[side].secondsLabel.push(padded);
                if (selected.second() === i && !disabled) {
                    this.timepickerVariables[side].selectedSecond = i;
                }
                else if (disabled) {
                    this.timepickerVariables[side].disabledSeconds.push(i);
                }
            }
        }
        // generate AM/PM
        if (!this.timePicker24Hour) {
            if (minDate &&
                selected
                    .clone()
                    .hour(12)
                    .minute(0)
                    .second(0)
                    .isBefore(minDate)) {
                this.timepickerVariables[side].amDisabled = true;
            }
            if (maxDate &&
                selected
                    .clone()
                    .hour(0)
                    .minute(0)
                    .second(0)
                    .isAfter(maxDate)) {
                this.timepickerVariables[side].pmDisabled = true;
            }
            if (selected.hour() >= 12) {
                this.timepickerVariables[side].ampmModel = 'PM';
            }
            else {
                this.timepickerVariables[side].ampmModel = 'AM';
            }
        }
        this.timepickerVariables[side].selected = selected;
    }
    renderCalendar(side) {
        const mainCalendar = side === SideEnum.left ? this.leftCalendar : this.rightCalendar;
        const month = mainCalendar.month.month();
        const year = mainCalendar.month.year();
        const hour = mainCalendar.month.hour();
        const minute = mainCalendar.month.minute();
        const second = mainCalendar.month.second();
        const daysInMonth = moment$1([year, month]).daysInMonth();
        const firstDay = moment$1([year, month, 1]);
        const lastDay = moment$1([year, month, daysInMonth]);
        const lastMonth = moment$1(firstDay)
            .subtract(1, 'month')
            .month();
        const lastYear = moment$1(firstDay)
            .subtract(1, 'month')
            .year();
        const daysInLastMonth = moment$1([lastYear, lastMonth]).daysInMonth();
        const dayOfWeek = firstDay.day();
        // initialize a 6 rows x 7 columns array for the calendar
        const calendar = [];
        calendar.firstDay = firstDay;
        calendar.lastDay = lastDay;
        for (let i = 0; i < 6; i++) {
            calendar[i] = [];
        }
        // populate the calendar with date objects
        let startDay = daysInLastMonth - dayOfWeek + this.locale.firstDay + 1;
        if (startDay > daysInLastMonth) {
            startDay -= 7;
        }
        if (dayOfWeek === this.locale.firstDay) {
            startDay = daysInLastMonth - 6;
        }
        let curDate = moment$1([lastYear, lastMonth, startDay, 12, minute, second]);
        for (let i = 0, col = 0, row = 0; i < 42; i++, col++, curDate = moment$1(curDate).add(24, 'hour')) {
            if (i > 0 && col % 7 === 0) {
                col = 0;
                row++;
            }
            calendar[row][col] = curDate
                .clone()
                .hour(hour)
                .minute(minute)
                .second(second);
            curDate.hour(12);
            if (this.minDate &&
                calendar[row][col].format('YYYY-MM-DD') === this.minDate.format('YYYY-MM-DD') &&
                calendar[row][col].isBefore(this.minDate) &&
                side === 'left') {
                calendar[row][col] = this.minDate.clone();
            }
            if (this.maxDate &&
                calendar[row][col].format('YYYY-MM-DD') === this.maxDate.format('YYYY-MM-DD') &&
                calendar[row][col].isAfter(this.maxDate) &&
                side === 'right') {
                calendar[row][col] = this.maxDate.clone();
            }
        }
        // make the calendar object available to hoverDate/clickDate
        if (side === SideEnum.left) {
            this.leftCalendar.calendar = calendar;
        }
        else {
            this.rightCalendar.calendar = calendar;
        }
        //
        // Display the calendar
        //
        const minDate = side === 'left' ? this.minDate : this.startDate.clone();
        if (this.leftCalendar.month && minDate && this.leftCalendar.month.year() < minDate.year()) {
            minDate.year(this.leftCalendar.month.year());
        }
        let maxDate = this.maxDate;
        // adjust maxDate to reflect the dateLimit setting in order to
        // grey out end dates beyond the dateLimit
        if (this.endDate === null && this.dateLimit) {
            const maxLimit = this.startDate
                .clone()
                .add(this.dateLimit, 'day')
                .endOf('day');
            if (!maxDate || maxLimit.isBefore(maxDate)) {
                maxDate = maxLimit;
            }
        }
        this.calendarVariables[side] = {
            month: month,
            year: year,
            hour: hour,
            minute: minute,
            second: second,
            daysInMonth: daysInMonth,
            firstDay: firstDay,
            lastDay: lastDay,
            lastMonth: lastMonth,
            lastYear: lastYear,
            daysInLastMonth: daysInLastMonth,
            dayOfWeek: dayOfWeek,
            // other vars
            calRows: Array.from(Array(6).keys()),
            calCols: Array.from(Array(7).keys()),
            classes: {},
            minDate: minDate,
            maxDate: maxDate,
            calendar: calendar
        };
        if (this.showDropdowns) {
            const currentMonth = calendar[1][1].month();
            const currentYear = calendar[1][1].year();
            const realCurrentYear = moment$1().year();
            const maxYear = (maxDate && maxDate.year()) || realCurrentYear + 5;
            const minYear = (minDate && minDate.year()) || realCurrentYear - 100;
            const inMinYear = currentYear === minYear;
            const inMaxYear = currentYear === maxYear;
            const years = [];
            for (let y = minYear; y <= maxYear; y++) {
                years.push(y);
            }
            this.calendarVariables[side].dropdowns = {
                currentMonth: currentMonth,
                currentYear: currentYear,
                maxYear: maxYear,
                minYear: minYear,
                inMinYear: inMinYear,
                inMaxYear: inMaxYear,
                monthArrays: Array.from(Array(12).keys()),
                yearArrays: years
            };
        }
        this._buildCells(calendar, side);
    }
    setStartDate(startDate) {
        if (typeof startDate === 'string') {
            this.startDate = moment$1(startDate, this.locale.format);
        }
        if (typeof startDate === 'object') {
            this.startDate = moment$1(startDate);
        }
        if (!this.timePicker) {
            this.startDate = this.startDate.startOf('day');
        }
        if (this.timePicker && this.timePickerIncrement) {
            this.startDate.minute(Math.round(this.startDate.minute() / this.timePickerIncrement) * this.timePickerIncrement);
        }
        if (this.minDate && this.startDate.isBefore(this.minDate)) {
            this.startDate = this.minDate.clone();
            if (this.timePicker && this.timePickerIncrement) {
                this.startDate.minute(Math.round(this.startDate.minute() / this.timePickerIncrement) * this.timePickerIncrement);
            }
        }
        if (this.maxDate && this.startDate.isAfter(this.maxDate)) {
            this.startDate = this.maxDate.clone();
            if (this.timePicker && this.timePickerIncrement) {
                this.startDate.minute(Math.floor(this.startDate.minute() / this.timePickerIncrement) * this.timePickerIncrement);
            }
        }
        if (!this.isShown) {
            this.updateElement();
        }
        this.startDateChanged.emit({ startDate: this.startDate });
        this.updateMonthsInView();
    }
    setEndDate(endDate) {
        if (typeof endDate === 'string') {
            this.endDate = moment$1(endDate, this.locale.format);
        }
        if (typeof endDate === 'object') {
            this.endDate = moment$1(endDate);
        }
        if (!this.timePicker) {
            this.endDate = this.endDate
                .add(1, 'd')
                .startOf('day')
                .subtract(1, 'second');
        }
        if (this.timePicker && this.timePickerIncrement) {
            this.endDate.minute(Math.round(this.endDate.minute() / this.timePickerIncrement) * this.timePickerIncrement);
        }
        if (this.endDate.isBefore(this.startDate)) {
            this.endDate = this.startDate.clone();
        }
        if (this.maxDate && this.endDate.isAfter(this.maxDate)) {
            this.endDate = this.maxDate.clone();
        }
        if (this.dateLimit &&
            this.startDate
                .clone()
                .add(this.dateLimit, 'day')
                .isBefore(this.endDate)) {
            this.endDate = this.startDate.clone().add(this.dateLimit, 'day');
        }
        if (!this.isShown) {
            // this.updateElement();
        }
        this.endDateChanged.emit({ endDate: this.endDate });
        this.updateMonthsInView();
    }
    isInvalidDate(date) {
        return false;
    }
    isCustomDate(date) {
        return false;
    }
    updateView() {
        if (this.timePicker) {
            this.renderTimePicker(SideEnum.left);
            this.renderTimePicker(SideEnum.right);
        }
        this.updateMonthsInView();
        this.updateCalendars();
    }
    updateMonthsInView() {
        if (this.endDate) {
            // if both dates are visible already, do nothing
            if (!this.singleDatePicker &&
                this.leftCalendar.month &&
                this.rightCalendar.month &&
                ((this.startDate &&
                    this.leftCalendar &&
                    this.startDate.format('YYYY-MM') === this.leftCalendar.month.format('YYYY-MM')) ||
                    (this.startDate &&
                        this.rightCalendar &&
                        this.startDate.format('YYYY-MM') === this.rightCalendar.month.format('YYYY-MM'))) &&
                (this.endDate.format('YYYY-MM') === this.leftCalendar.month.format('YYYY-MM') ||
                    this.endDate.format('YYYY-MM') === this.rightCalendar.month.format('YYYY-MM'))) {
                return;
            }
            if (this.startDate) {
                this.leftCalendar.month = this.startDate.clone().date(2);
                if (!this.linkedCalendars &&
                    (this.endDate.month() !== this.startDate.month() || this.endDate.year() !== this.startDate.year())) {
                    this.rightCalendar.month = this.endDate.clone().date(2);
                }
                else {
                    this.rightCalendar.month = this.startDate
                        .clone()
                        .date(2)
                        .add(1, 'month');
                }
            }
        }
        else {
            if (this.leftCalendar.month.format('YYYY-MM') !== this.startDate.format('YYYY-MM') &&
                this.rightCalendar.month.format('YYYY-MM') !== this.startDate.format('YYYY-MM')) {
                this.leftCalendar.month = this.startDate.clone().date(2);
                this.rightCalendar.month = this.startDate
                    .clone()
                    .date(2)
                    .add(1, 'month');
            }
        }
        if (this.maxDate && this.linkedCalendars && !this.singleDatePicker && this.rightCalendar.month > this.maxDate) {
            this.rightCalendar.month = this.maxDate.clone().date(2);
            this.leftCalendar.month = this.maxDate
                .clone()
                .date(2)
                .subtract(1, 'month');
        }
    }
    /**
     *  This is responsible for updating the calendars
     */
    updateCalendars() {
        this.renderCalendar(SideEnum.left);
        this.renderCalendar(SideEnum.right);
        if (this.endDate === null) {
            return;
        }
        this.calculateChosenLabel();
    }
    updateElement() {
        const format = this.locale.displayFormat ? this.locale.displayFormat : this.locale.format;
        if (!this.singleDatePicker && this.autoUpdateInput) {
            if (this.startDate && this.endDate) {
                // if we use ranges and should show range label on input
                if (this.ranges.length &&
                    this.showRangeLabelOnInput === true &&
                    this.chosenRange /*&&
                this.locale.customRangeLabel !== this.chosenRange.label*/) {
                    this.chosenLabel = this.chosenRange.label;
                }
                else {
                    this.chosenLabel =
                        this.startDate.format(format) +
                            this.locale.separator +
                            this.endDate.format(format);
                }
            }
        }
        else if (this.autoUpdateInput) {
            this.chosenLabel = this.startDate.format(format);
        }
    }
    remove() {
        this.isShown = false;
    }
    /**
     * this should calculate the label
     */
    calculateChosenLabel() {
        if (!this.locale || !this.locale.separator) {
            this._buildLocale();
        }
        let customRange = true;
        let i = 0;
        this.ranges.forEach(preset => {
            if (this.timePicker) {
                const format = this.timePickerSeconds ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD HH:mm';
                // ignore times when comparing dates if time picker seconds is not enabled
                if (this.startDate.format(format) === preset.range.start.format(format) &&
                    this.endDate.format(format) === preset.range.end.format(format)) {
                    customRange = false;
                    this.chosenRange = preset;
                }
            }
            else {
                // ignore times when comparing dates if time picker is not enabled
                if (this.startDate.format('YYYY-MM-DD') === preset.range.start.format('YYYY-MM-DD') &&
                    this.endDate.format('YYYY-MM-DD') === preset.range.end.format('YYYY-MM-DD')) {
                    customRange = false;
                    this.chosenRange = preset;
                }
            }
            i++;
        });
        if (customRange) {
            if (this.showCustomRangeLabel) {
                // this.chosenRange.label = this.locale.customRangeLabel;
            }
            else {
                this.chosenRange = null;
            }
            // if custom label: show calendar
            this.showCalInRanges = true;
        }
        this.updateElement();
    }
    clickApply(e) {
        if (!this.singleDatePicker && this.startDate && !this.endDate) {
            this.endDate = this.startDate.clone();
            this.calculateChosenLabel();
        }
        if (this.isInvalidDate && this.startDate && this.endDate) {
            // get if there are invalid date between range
            const d = this.startDate.clone();
            while (d.isBefore(this.endDate)) {
                if (this.isInvalidDate(d)) {
                    this.endDate = d.subtract(1, 'days');
                    this.calculateChosenLabel();
                    break;
                }
                d.add(1, 'days');
            }
        }
        if (this.chosenLabel) {
            this.choosedDate.emit({ chosenLabel: this.chosenLabel, startDate: this.startDate, endDate: this.endDate });
        }
        this.datesUpdated.emit({ startDate: this.startDate, endDate: this.endDate });
        if (e || (this.closeOnAutoApply && !e)) {
            this.hide();
        }
    }
    clickCancel(e) {
        this.startDate = this._old.start;
        this.endDate = this._old.end;
        if (this.inline) {
            this.updateView();
        }
        this.hide();
    }
    /**
     * called when month is changed
     * @param monthEvent get value in event.target.value
     * @param side left or right
     */
    monthChanged(monthEvent, side) {
        const year = this.calendarVariables[side].dropdowns.currentYear;
        const month = parseInt(monthEvent.value, 10);
        this.monthOrYearChanged(month, year, side);
    }
    /**
     * called when year is changed
     * @param yearEvent get value in event.target.value
     * @param side left or right
     */
    yearChanged(yearEvent, side) {
        const month = this.calendarVariables[side].dropdowns.currentMonth;
        const year = parseInt(yearEvent.value, 10);
        this.monthOrYearChanged(month, year, side);
    }
    /**
     * called when time is changed
     * @param timeEvent  an event
     * @param side left or right
     */
    timeChanged(timeEvent, side) {
        let hour = parseInt(this.timepickerVariables[side].selectedHour, 10);
        const minute = parseInt(this.timepickerVariables[side].selectedMinute, 10);
        const second = this.timePickerSeconds ? parseInt(this.timepickerVariables[side].selectedSecond, 10) : 0;
        if (!this.timePicker24Hour) {
            const ampm = this.timepickerVariables[side].ampmModel;
            if (ampm === 'PM' && hour < 12) {
                hour += 12;
            }
            if (ampm === 'AM' && hour === 12) {
                hour = 0;
            }
        }
        if (side === SideEnum.left) {
            const start = this.startDate.clone();
            start.hour(hour);
            start.minute(minute);
            start.second(second);
            this.setStartDate(start);
            if (this.singleDatePicker) {
                this.endDate = this.startDate.clone();
            }
            else if (this.endDate &&
                this.endDate.format('YYYY-MM-DD') === start.format('YYYY-MM-DD') &&
                this.endDate.isBefore(start)) {
                this.setEndDate(start.clone());
            }
        }
        else if (this.endDate) {
            const end = this.endDate.clone();
            end.hour(hour);
            end.minute(minute);
            end.second(second);
            this.setEndDate(end);
        }
        // update the calendars so all clickable dates reflect the new time component
        this.updateCalendars();
        // re-render the time pickers because changing one selection can affect what's enabled in another
        this.renderTimePicker(SideEnum.left);
        this.renderTimePicker(SideEnum.right);
        if (this.autoApply) {
            this.clickApply();
        }
    }
    /**
     *  call when month or year changed
     * @param month month number 0 -11
     * @param year year eg: 1995
     * @param side left or right
     */
    monthOrYearChanged(month, year, side) {
        const isLeft = side === SideEnum.left;
        if (!isLeft) {
            if (year < this.startDate.year() || (year === this.startDate.year() && month < this.startDate.month())) {
                month = this.startDate.month();
                year = this.startDate.year();
            }
        }
        if (this.minDate) {
            if (year < this.minDate.year() || (year === this.minDate.year() && month < this.minDate.month())) {
                month = this.minDate.month();
                year = this.minDate.year();
            }
        }
        if (this.maxDate) {
            if (year > this.maxDate.year() || (year === this.maxDate.year() && month > this.maxDate.month())) {
                month = this.maxDate.month();
                year = this.maxDate.year();
            }
        }
        this.calendarVariables[side].dropdowns.currentYear = year;
        this.calendarVariables[side].dropdowns.currentMonth = month;
        if (isLeft) {
            this.leftCalendar.month.month(month).year(year);
            if (this.linkedCalendars) {
                this.rightCalendar.month = this.leftCalendar.month.clone().add(1, 'month');
            }
        }
        else {
            this.rightCalendar.month.month(month).year(year);
            if (this.linkedCalendars) {
                this.leftCalendar.month = this.rightCalendar.month.clone().subtract(1, 'month');
            }
        }
        this.updateCalendars();
    }
    /**
     * Click on previous month
     * @param side left or right calendar
     */
    clickPrev(side) {
        if (side === SideEnum.left) {
            this.leftCalendar.month.subtract(1, 'month');
            if (this.linkedCalendars) {
                this.rightCalendar.month.subtract(1, 'month');
            }
        }
        else {
            this.rightCalendar.month.subtract(1, 'month');
        }
        this.updateCalendars();
    }
    /**
     * Click on next month
     * @param side left or right calendar
     */
    clickNext(side) {
        if (side === SideEnum.left) {
            this.leftCalendar.month.add(1, 'month');
        }
        else {
            this.rightCalendar.month.add(1, 'month');
            if (this.linkedCalendars) {
                this.leftCalendar.month.add(1, 'month');
            }
        }
        this.updateCalendars();
    }
    /**
     * When selecting a date
     * @param e event: get value by e.target.value
     * @param side left or right
     * @param row row position of the current date clicked
     * @param col col position of the current date clicked
     */
    clickDate(e, side, row, col) {
        if (e.target.tagName === 'TD') {
            if (!e.target.classList.contains('available')) {
                return;
            }
        }
        else if (e.target.tagName === 'SPAN') {
            if (!e.target.parentElement.classList.contains('available')) {
                return;
            }
        }
        let date = side === SideEnum.left ? this.leftCalendar.calendar[row][col] : this.rightCalendar.calendar[row][col];
        if ((this.endDate || (date.isBefore(this.startDate, 'day') && this.customRangeDirection === false)) &&
            this.lockStartDate === false) {
            // picking start
            if (this.timePicker) {
                date = this._getDateWithTime(date, SideEnum.left);
            }
            this.endDate = null;
            this.setStartDate(date.clone());
        }
        else if (!this.endDate && date.isBefore(this.startDate) && this.customRangeDirection === false) {
            // special case: clicking the same date for start/end,
            // but the time of the end date is before the start date
            this.setEndDate(this.startDate.clone());
        }
        else {
            // picking end
            if (this.timePicker) {
                date = this._getDateWithTime(date, SideEnum.right);
            }
            if (date.isBefore(this.startDate, 'day') === true && this.customRangeDirection === true) {
                this.setEndDate(this.startDate);
                this.setStartDate(date.clone());
            }
            else {
                this.setEndDate(date.clone());
            }
            if (this.autoApply) {
                this.calculateChosenLabel();
                this.clickApply();
            }
        }
        if (this.singleDatePicker) {
            this.setEndDate(this.startDate);
            this.updateElement();
            if (this.autoApply) {
                this.clickApply();
            }
        }
        this.updateView();
        if (this.autoApply && this.startDate && this.endDate) {
            this.clickApply();
        }
        // This is to cancel the blur event handler if the mouse was in one of the inputs
        e.stopPropagation();
    }
    /**
     *  Click on the custom range
     * @param e: Event
     * @param preset
     */
    clickRange(e, preset) {
        this.chosenRange = preset;
        this.startDate = preset.range.start.clone();
        this.endDate = preset.range.end.clone();
        if (this.showRangeLabelOnInput) {
            this.chosenLabel = preset.label;
        }
        else {
            this.calculateChosenLabel();
        }
        this.showCalInRanges = true;
        if (!this.timePicker) {
            this.startDate.startOf('day');
            this.endDate.endOf('day');
        }
        if (!this.alwaysShowCalendars) {
            this.isShown = false; // hide calendars
        }
        this.rangeClicked.emit({ label: preset.label, dates: preset.range });
        if (!this.keepCalendarOpeningWithRange) {
            this.clickApply();
        }
        else {
            if (!this.alwaysShowCalendars) {
                return this.clickApply();
            }
            if (this.maxDate && this.maxDate.isSame(preset.range.start, 'month')) {
                this.rightCalendar.month.month(preset.range.start.month());
                this.rightCalendar.month.year(preset.range.start.year());
                this.leftCalendar.month.month(preset.range.start.month() - 1);
                this.leftCalendar.month.year(preset.range.end.year());
            }
            else {
                this.leftCalendar.month.month(preset.range.start.month());
                this.leftCalendar.month.year(preset.range.start.year());
                // get the next year
                const nextMonth = preset.range.start.clone().add(1, 'month');
                this.rightCalendar.month.month(nextMonth.month());
                this.rightCalendar.month.year(nextMonth.year());
            }
            this.updateCalendars();
            if (this.timePicker) {
                this.renderTimePicker(SideEnum.left);
                this.renderTimePicker(SideEnum.right);
            }
        }
    }
    show(e) {
        if (this.isShown) {
            return;
        }
        this._old.start = this.startDate.clone();
        this._old.end = this.endDate.clone();
        this.isShown = true;
        if (this.isFullScreenPicker) {
            setTimeout(() => {
                document.getElementById('scroll-body').scrollTo({ top: 150 });
            });
        }
        this.updateView();
    }
    hide(e) {
        if (!this.isShown) {
            return;
        }
        // incomplete date selection, revert to last values
        if (!this.endDate) {
            if (this._old.start) {
                this.startDate = this._old.start.clone();
            }
            if (this._old.end) {
                this.endDate = this._old.end.clone();
            }
        }
        // if a new date range was selected, invoke the user callback function
        if (!this.startDate.isSame(this._old.start) || !this.endDate.isSame(this._old.end)) {
            // this.callback(this.startDate, this.endDate, this.chosenLabel);
        }
        // if picker is attached to a text input, update it
        this.updateElement();
        this.isShown = false;
        this._ref.detectChanges();
    }
    /**
     * handle click on all element in the component, useful for outside of click
     * @param e event
     */
    handleInternalClick(e) {
        e.stopPropagation();
    }
    /**
     * update the locale options
     * @param locale
     */
    updateLocale(locale) {
        for (const key in locale) {
            if (locale.hasOwnProperty(key)) {
                this.locale[key] = locale[key];
                if (key === 'customRangeLabel') {
                    this.renderRanges();
                }
            }
        }
    }
    /**
     *  clear the daterange picker
     */
    clear() {
        this.startDate = moment$1().startOf('day');
        this.endDate = moment$1().endOf('day');
        this.updateCalendars();
        this.updateView();
    }
    /**
     * Find out if the selected range should be disabled if it doesn't
     * fit into minDate and maxDate limitations.
     */
    disableRange(preset) {
        if (preset.label === this.locale.customRangeLabel) {
            return false;
        }
        const areBothBefore = this.minDate
            && preset.range.start.isBefore(this.minDate)
            && preset.range.end.isBefore(this.minDate);
        const areBothAfter = this.maxDate
            && preset.range.start.isAfter(this.maxDate)
            && preset.range.end.isAfter(this.maxDate);
        return areBothBefore || areBothAfter;
    }
    /**
     *
     * @param date the date to add time
     * @param side left or right
     */
    _getDateWithTime(date, side) {
        let hour = parseInt(this.timepickerVariables[side].selectedHour, 10);
        if (!this.timePicker24Hour) {
            const ampm = this.timepickerVariables[side].ampmModel;
            if (ampm === 'PM' && hour < 12) {
                hour += 12;
            }
            if (ampm === 'AM' && hour === 12) {
                hour = 0;
            }
        }
        const minute = parseInt(this.timepickerVariables[side].selectedMinute, 10);
        const second = this.timePickerSeconds ? parseInt(this.timepickerVariables[side].selectedSecond, 10) : 0;
        return date
            .clone()
            .hour(hour)
            .minute(minute)
            .second(second);
    }
    /**
     *  build the locale config
     */
    _buildLocale() {
        this.locale = Object.assign(Object.assign({}, this._localeService.config), this.locale);
        if (!this.locale.format) {
            if (this.timePicker) {
                this.locale.format = moment$1.localeData().longDateFormat('lll');
            }
            else {
                this.locale.format = moment$1.localeData().longDateFormat('L');
            }
        }
    }
    _buildCells(calendar, side) {
        for (let row = 0; row < 6; row++) {
            this.calendarVariables[side].classes[row] = {};
            let colOffCount = 0;
            const rowClasses = [];
            if (this.emptyWeekRowClass &&
                !this.hasCurrentMonthDays(this.calendarVariables[side].month, calendar[row])) {
                rowClasses.push(this.emptyWeekRowClass);
            }
            for (let col = 0; col < 7; col++) {
                const classes = [];
                // highlight today's date
                if (calendar[row][col].isSame(new Date(), 'day')) {
                    classes.push('today');
                }
                // highlight weekends
                if (calendar[row][col].isoWeekday() > 5) {
                    classes.push('weekend');
                }
                // grey out the dates in other months displayed at beginning and end of this calendar
                if (calendar[row][col].month() !== calendar[1][1].month()) {
                    classes.push('off', 'disabled', 'hidden');
                    colOffCount++;
                    // mark the last day of the previous month in this calendar
                    if (this.lastDayOfPreviousMonthClass &&
                        (calendar[row][col].month() < calendar[1][1].month() || calendar[1][1].month() === 0) &&
                        calendar[row][col].date() === this.calendarVariables[side].daysInLastMonth) {
                        classes.push(this.lastDayOfPreviousMonthClass);
                    }
                    // mark the first day of the next month in this calendar
                    if (this.firstDayOfNextMonthClass &&
                        (calendar[row][col].month() > calendar[1][1].month() || calendar[row][col].month() === 0) &&
                        calendar[row][col].date() === 1) {
                        classes.push(this.firstDayOfNextMonthClass);
                    }
                }
                // mark the first day of the current month with a custom class
                if (this.firstMonthDayClass &&
                    calendar[row][col].month() === calendar[1][1].month() &&
                    calendar[row][col].date() === calendar.firstDay.date()) {
                    classes.push(this.firstMonthDayClass);
                }
                // mark the last day of the current month with a custom class
                if (this.lastMonthDayClass &&
                    calendar[row][col].month() === calendar[1][1].month() &&
                    calendar[row][col].date() === calendar.lastDay.date()) {
                    classes.push(this.lastMonthDayClass);
                }
                // don't allow selection of dates before the minimum date
                if (this.minDate && calendar[row][col].isBefore(this.minDate, 'day')) {
                    classes.push('off', 'disabled');
                }
                // don't allow selection of dates after the maximum date
                if (this.calendarVariables[side].maxDate &&
                    calendar[row][col].isAfter(this.calendarVariables[side].maxDate, 'day')) {
                    classes.push('off', 'disabled');
                }
                // don't allow selection of date if a custom function decides it's invalid
                if (this.isInvalidDate(calendar[row][col])) {
                    classes.push('off', 'disabled', 'invalid');
                }
                // highlight the currently selected start date
                if (this.startDate && calendar[row][col].format('YYYY-MM-DD') === this.startDate.format('YYYY-MM-DD')) {
                    classes.push('active', 'start-date');
                }
                // highlight the currently selected end date
                if (this.endDate != null &&
                    calendar[row][col].format('YYYY-MM-DD') === this.endDate.format('YYYY-MM-DD')) {
                    classes.push('active', 'end-date');
                }
                // highlight dates in-between the selected dates
                if (this.endDate != null &&
                    calendar[row][col].isAfter(this.startDate, 'day') &&
                    calendar[row][col].isBefore(this.endDate, 'day')) {
                    classes.push('in-range');
                }
                // apply custom classes for this date
                const isCustom = this.isCustomDate(calendar[row][col]);
                if (isCustom !== false) {
                    if (typeof isCustom === 'string') {
                        classes.push(isCustom);
                    }
                    else {
                        Array.prototype.push.apply(classes, isCustom);
                    }
                }
                // store classes var
                let cname = '', disabled = false;
                for (let i = 0; i < classes.length; i++) {
                    cname += classes[i] + ' ';
                    if (classes[i] === 'disabled') {
                        disabled = true;
                    }
                }
                if (!disabled) {
                    cname += 'available';
                }
                this.calendarVariables[side].classes[row][col] = cname.replace(/^\s+|\s+$/g, '');
            }
            if (colOffCount === 7) {
                rowClasses.push('off');
                rowClasses.push('disabled');
                rowClasses.push('hidden');
            }
            this.calendarVariables[side].classes[row].classList = rowClasses.join(' ');
        }
    }
    /**
     * Find out if the current calendar row has current month days
     * (as opposed to consisting of only previous/next month days)
     */
    hasCurrentMonthDays(currentMonth, row) {
        for (let day = 0; day < 7; day++) {
            if (row[day].month() === currentMonth) {
                return true;
            }
        }
        return false;
    }
    scrollDetection(event) {
        const scrollBodyTop = event.target.scrollTop;
        const scrollBodyBottom = scrollBodyTop + event.target.clientHeight + 1;
        if (scrollBodyTop <= 0) {
            this.clickPrev(SideEnum.left);
            event.target.scrollTop = 150;
        }
        if (scrollBodyBottom >= event.target.scrollHeight) {
            this.clickNext(SideEnum.right);
            event.target.scrollTop = event.target.scrollTop - 150;
        }
    }
}
DateRangePickerComponent.decorators = [
    { type: Component, args: [{
                // tslint:disable-next-line:component-selector
                selector: 'ngx-daterangepicker-material',
                template: "<div\r\n\tclass=\"md-drppicker\"\r\n\t#pickerContainer\r\n\t[ngClass]=\"{\r\n\t\tltr: locale.direction === 'ltr',\r\n\t\trtl: this.locale.direction === 'rtl',\r\n\t\tshown: isShown || inline,\r\n\t\tsingle: singleDatePicker,\r\n\t\thidden: !isShown && !inline,\r\n\t\tinline: inline,\r\n\t\tdouble: !isFullScreenPicker && !singleDatePicker && showCalInRanges,\r\n\t\t'show-ranges': ranges.length > 0,\r\n\t\t'full-screen': isFullScreenPicker\r\n\t}\"\r\n\t[class]=\"'drops-' + drops + '-' + opens\"\r\n\t[attr.data-cy]=\"'date-range-picker__content--' + (isFullScreenPicker ? 'full-screen' : 'modal')\"\r\n>\r\n\t<div *ngIf=\"!isFullScreenPicker; else fullScreenView;\">\r\n\t\t<div class=\"dp-header\" *ngIf=\"!singleDatePicker\">\r\n\t\t\t<button mat-button *ngIf=\"showClearButton\" class=\"cal-reset-btn\" (click)=\"clear()\" data-cy=\"date-range-picker-clear__button\">\r\n\t\t\t\t{{ _locale.clearLabel }}\r\n\t\t\t</button>\r\n\t\t\t<mat-form-field class=\"cal-start-date\">\r\n\t\t\t\t<button mat-icon-button matPrefix>\r\n\t\t\t\t\t<mat-icon>date_range</mat-icon>\r\n\t\t\t\t</button>\r\n\t\t\t\t<input\r\n\t\t\t\t\tmatInput\r\n\t\t\t\t\t[value]=\"startDate | date: locale.displayFormat:undefined:locale.localeId\"\r\n\t\t\t\t\treadonly\r\n\t\t\t\t\tdata-cy=\"date-range-picker-start-date__input\"\r\n\t\t\t\t/>\r\n\t\t\t</mat-form-field>\r\n\t\t\t<mat-form-field color=\"primary\">\r\n\t\t\t\t<button mat-icon-button matPrefix>\r\n\t\t\t\t\t<mat-icon>date_range</mat-icon>\r\n\t\t\t\t</button>\r\n\t\t\t\t<input\r\n\t\t\t\t\tmatInput\r\n\t\t\t\t\t[value]=\"endDate | date: locale.displayFormat:undefined:locale.localeId\"\r\n\t\t\t\t\treadonly\r\n\t\t\t\t\tdata-cy=\"date-range-picker-end-date__input\"\r\n\t\t\t\t/>\r\n\t\t\t</mat-form-field>\r\n\t\t</div>\r\n\t\t<div class=\"dp-body\">\r\n\t\t\t<div class=\"calendar\" [ngClass]=\"{ right: singleDatePicker, left: !singleDatePicker }\" *ngIf=\"showCalInRanges\">\r\n\t\t\t\t<button color=\"primary\" mat-mini-fab class=\"prev available\" (click)=\"clickPrev(sideEnum.left)\" data-cy=\"date-range-picker-previous__button\">\r\n\t\t\t\t\t<mat-icon>arrow_forward_ios</mat-icon>\r\n\t\t\t\t</button>\r\n\t\t\t\t<div class=\"calendar-table\">\r\n\t\t\t\t\t<table class=\"table-condensed\" *ngIf=\"calendarVariables\">\r\n\t\t\t\t\t\t<thead>\r\n\t\t\t\t\t\t\t<tr>\r\n\t\t\t\t\t\t\t\t<th *ngIf=\"showWeekNumbers || showISOWeekNumbers\"></th>\r\n\t\t\t\t\t\t\t\t<th [colSpan]=\"!showDropdowns ? 7 : 5\" class=\"month drp-animate\">\r\n\t\t\t\t\t\t\t\t\t<ng-container *ngIf=\"showDropdowns && calendarVariables.left.dropdowns\">\r\n\t\t\t\t\t\t\t\t\t\t<mat-form-field>\r\n\t\t\t\t\t\t\t\t\t\t\t<mat-select\r\n\t\t\t\t\t\t\t\t\t\t\t\t[(ngModel)]=\"calendarVariables.left.dropdowns.currentMonth\"\r\n\t\t\t\t\t\t\t\t\t\t\t\t(selectionChange)=\"monthChanged($event, sideEnum.left)\"\r\n\t\t\t\t\t\t\t\t\t\t\t>\r\n\t\t\t\t\t\t\t\t\t\t\t\t<mat-option\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t*ngFor=\"let m of calendarVariables.left.dropdowns.monthArrays\"\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t[disabled]=\"\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t(calendarVariables.left.dropdowns.inMinYear &&\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tm < calendarVariables.left.minDate.month()) ||\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t(calendarVariables.left.dropdowns.inMaxYear &&\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tm > calendarVariables.left.maxDate.month())\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\"\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t[value]=\"m\"\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t>{{ locale.monthNames[m] }}</mat-option\r\n\t\t\t\t\t\t\t\t\t\t\t\t>\r\n\t\t\t\t\t\t\t\t\t\t\t</mat-select>\r\n\t\t\t\t\t\t\t\t\t\t</mat-form-field>\r\n\t\t\t\t\t\t\t\t\t</ng-container>\r\n\t\t\t\t\t\t\t\t\t<ng-container *ngIf=\"!showDropdowns || !calendarVariables.left.dropdowns\">\r\n\t\t\t\t\t\t\t\t\t\t{{ this.locale.monthNames[calendarVariables?.left?.calendar[1][1].month()] }}\r\n\t\t\t\t\t\t\t\t\t\t{{ calendarVariables?.left?.calendar[1][1].format(' YYYY') }}\r\n\t\t\t\t\t\t\t\t\t</ng-container>\r\n\t\t\t\t\t\t\t\t</th>\r\n\t\t\t\t\t\t\t\t<th *ngIf=\"showDropdowns && calendarVariables.left.dropdowns\" colspan=\"2\" class=\"year\">\r\n\t\t\t\t\t\t\t\t\t<ng-container>\r\n\t\t\t\t\t\t\t\t\t\t<mat-form-field>\r\n\t\t\t\t\t\t\t\t\t\t\t<mat-select\r\n\t\t\t\t\t\t\t\t\t\t\t\t[(ngModel)]=\"calendarVariables.left.dropdowns.currentYear\"\r\n\t\t\t\t\t\t\t\t\t\t\t\t(selectionChange)=\"yearChanged($event, sideEnum.left)\"\r\n\t\t\t\t\t\t\t\t\t\t\t>\r\n\t\t\t\t\t\t\t\t\t\t\t\t<mat-option\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t*ngFor=\"let y of calendarVariables.left.dropdowns.yearArrays\"\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t[value]=\"y\"\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t>{{ y }}</mat-option\r\n\t\t\t\t\t\t\t\t\t\t\t\t>\r\n\t\t\t\t\t\t\t\t\t\t\t</mat-select>\r\n\t\t\t\t\t\t\t\t\t\t</mat-form-field>\r\n\t\t\t\t\t\t\t\t\t</ng-container>\r\n\t\t\t\t\t\t\t\t</th>\r\n\t\t\t\t\t\t\t\t<ng-container\r\n\t\t\t\t\t\t\t\t\t*ngIf=\"\r\n\t\t\t\t\t\t\t\t\t\t(!calendarVariables.left.maxDate ||\r\n\t\t\t\t\t\t\t\t\t\t\tcalendarVariables.left.maxDate.isAfter(\r\n\t\t\t\t\t\t\t\t\t\t\t\tcalendarVariables.left.calendar.lastDay\r\n\t\t\t\t\t\t\t\t\t\t\t)) &&\r\n\t\t\t\t\t\t\t\t\t\t(!linkedCalendars || singleDatePicker)\r\n\t\t\t\t\t\t\t\t\t\"\r\n\t\t\t\t\t\t\t\t>\r\n\t\t\t\t\t\t\t\t\t<button\r\n\t\t\t\t\t\t\t\t\t\tcolor=\"primary\"\r\n\t\t\t\t\t\t\t\t\t\tmat-mini-fab\r\n\t\t\t\t\t\t\t\t\t\tclass=\"next available\"\r\n\t\t\t\t\t\t\t\t\t\t(click)=\"clickNext(sideEnum.left)\"\r\n\t\t\t\t\t\t\t\t\t\tdata-cy=\"date-range-picker-next__button--single-calendar\"\r\n\t\t\t\t\t\t\t\t\t>\r\n\t\t\t\t\t\t\t\t\t\t<mat-icon>arrow_forward_ios</mat-icon>\r\n\t\t\t\t\t\t\t\t\t</button>\r\n\t\t\t\t\t\t\t\t</ng-container>\r\n\t\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t\t\t<tr class=\"week-days\">\r\n\t\t\t\t\t\t\t\t<th *ngIf=\"showWeekNumbers || showISOWeekNumbers\" class=\"week\">\r\n\t\t\t\t\t\t\t\t\t<span>{{ this.locale.weekLabel }}</span>\r\n\t\t\t\t\t\t\t\t</th>\r\n\t\t\t\t\t\t\t\t<th *ngFor=\"let dayofweek of locale.daysOfWeek\">\r\n\t\t\t\t\t\t\t\t\t<span>{{ dayofweek[0] }}</span>\r\n\t\t\t\t\t\t\t\t</th>\r\n\t\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t\t</thead>\r\n\t\t\t\t\t\t<tbody class=\"drp-animate\">\r\n\t\t\t\t\t\t\t<tr\r\n\t\t\t\t\t\t\t\t*ngFor=\"let row of calendarVariables.left.calRows; let rowIndex = index;\"\r\n\t\t\t\t\t\t\t\t[class]=\"calendarVariables.left.classes[row].classList\"\r\n\t\t\t\t\t\t\t>\r\n\t\t\t\t\t\t\t\t<!-- add week number -->\r\n\t\t\t\t\t\t\t\t<td class=\"week\" *ngIf=\"showWeekNumbers\">\r\n\t\t\t\t\t\t\t\t\t<span>{{ calendarVariables.left.calendar[row][0].week() }}</span>\r\n\t\t\t\t\t\t\t\t</td>\r\n\t\t\t\t\t\t\t\t<td class=\"week\" *ngIf=\"showISOWeekNumbers\">\r\n\t\t\t\t\t\t\t\t\t<span>{{ calendarVariables.left.calendar[row][0].isoWeek() }}</span>\r\n\t\t\t\t\t\t\t\t</td>\r\n\t\t\t\t\t\t\t\t<!-- cal -->\r\n\t\t\t\t\t\t\t\t<td\r\n\t\t\t\t\t\t\t\t\t*ngFor=\"let col of calendarVariables.left.calCols; let colIndex = index\"\r\n\t\t\t\t\t\t\t\t\t[class]=\"calendarVariables.left.classes[row][col]\"\r\n\t\t\t\t\t\t\t\t\t(click)=\"clickDate($event, sideEnum.left, row, col)\"\r\n\t\t\t\t\t\t\t\t\t[attr.data-cy]=\"'date-range-picker-row-' + rowIndex + '-col-' + colIndex + '__button'\"\r\n\t\t\t\t\t\t\t\t>\r\n\t\t\t\t\t\t\t\t\t<span>{{ calendarVariables.left.calendar[row][col].date() }}</span>\r\n\t\t\t\t\t\t\t\t</td>\r\n\t\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t\t</tbody>\r\n\t\t\t\t\t</table>\r\n\t\t\t\t</div>\r\n\t\t\t\t<div class=\"calendar-time\" *ngIf=\"timePicker\">\r\n\t\t\t\t\t<div class=\"select\">\r\n\t\t\t\t\t\t<select\r\n\t\t\t\t\t\t\tclass=\"hourselect select-item\"\r\n\t\t\t\t\t\t\t[disabled]=\"!endDate\"\r\n\t\t\t\t\t\t\t[(ngModel)]=\"timepickerVariables.left.selectedHour\"\r\n\t\t\t\t\t\t\t(ngModelChange)=\"timeChanged($event, sideEnum.left)\"\r\n\t\t\t\t\t\t>\r\n\t\t\t\t\t\t\t<option\r\n\t\t\t\t\t\t\t\t*ngFor=\"let i of timepickerVariables.left.hours\"\r\n\t\t\t\t\t\t\t\t[value]=\"i\"\r\n\t\t\t\t\t\t\t\t[disabled]=\"timepickerVariables.left.disabledHours.indexOf(i) > -1\"\r\n\t\t\t\t\t\t\t\t>{{ i }}</option\r\n\t\t\t\t\t\t\t>\r\n\t\t\t\t\t\t</select>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t\t<div class=\"select\">\r\n\t\t\t\t\t\t<select\r\n\t\t\t\t\t\t\tclass=\"select-item minuteselect\"\r\n\t\t\t\t\t\t\t[disabled]=\"!endDate\"\r\n\t\t\t\t\t\t\t[(ngModel)]=\"timepickerVariables.left.selectedMinute\"\r\n\t\t\t\t\t\t\t(ngModelChange)=\"timeChanged($event, sideEnum.left)\"\r\n\t\t\t\t\t\t>\r\n\t\t\t\t\t\t\t<option\r\n\t\t\t\t\t\t\t\t*ngFor=\"let i of timepickerVariables.left.minutes; let index = index\"\r\n\t\t\t\t\t\t\t\t[value]=\"i\"\r\n\t\t\t\t\t\t\t\t[disabled]=\"timepickerVariables.left.disabledMinutes.indexOf(i) > -1\"\r\n\t\t\t\t\t\t\t\t>{{ timepickerVariables.left.minutesLabel[index] }}</option\r\n\t\t\t\t\t\t\t>\r\n\t\t\t\t\t\t</select>\r\n\t\t\t\t\t\t<span class=\"select-highlight\"></span>\r\n\t\t\t\t\t\t<span class=\"select-bar\"></span>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t\t<div class=\"select\">\r\n\t\t\t\t\t\t<select\r\n\t\t\t\t\t\t\tclass=\"select-item secondselect\"\r\n\t\t\t\t\t\t\t*ngIf=\"timePickerSeconds\"\r\n\t\t\t\t\t\t\t[disabled]=\"!endDate\"\r\n\t\t\t\t\t\t\t[(ngModel)]=\"timepickerVariables.left.selectedSecond\"\r\n\t\t\t\t\t\t\t(ngModelChange)=\"timeChanged($event, sideEnum.left)\"\r\n\t\t\t\t\t\t>\r\n\t\t\t\t\t\t\t<option\r\n\t\t\t\t\t\t\t\t*ngFor=\"let i of timepickerVariables.left.seconds; let index = index\"\r\n\t\t\t\t\t\t\t\t[value]=\"i\"\r\n\t\t\t\t\t\t\t\t[disabled]=\"timepickerVariables.left.disabledSeconds.indexOf(i) > -1\"\r\n\t\t\t\t\t\t\t\t>{{ timepickerVariables.left.secondsLabel[index] }}</option\r\n\t\t\t\t\t\t\t>\r\n\t\t\t\t\t\t</select>\r\n\t\t\t\t\t\t<span class=\"select-highlight\"></span>\r\n\t\t\t\t\t\t<span class=\"select-bar\"></span>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t\t<div class=\"select\">\r\n\t\t\t\t\t\t<select\r\n\t\t\t\t\t\t\tclass=\"select-item ampmselect\"\r\n\t\t\t\t\t\t\t*ngIf=\"!timePicker24Hour\"\r\n\t\t\t\t\t\t\t[(ngModel)]=\"timepickerVariables.left.ampmModel\"\r\n\t\t\t\t\t\t\t(ngModelChange)=\"timeChanged($event, sideEnum.left)\"\r\n\t\t\t\t\t\t>\r\n\t\t\t\t\t\t\t<option value=\"AM\" [disabled]=\"timepickerVariables.left.amDisabled\">AM</option>\r\n\t\t\t\t\t\t\t<option value=\"PM\" [disabled]=\"timepickerVariables.left.pmDisabled\">PM</option>\r\n\t\t\t\t\t\t</select>\r\n\t\t\t\t\t\t<span class=\"select-highlight\"></span>\r\n\t\t\t\t\t\t<span class=\"select-bar\"></span>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t\t<div class=\"calendar right\" *ngIf=\"showCalInRanges && !singleDatePicker\">\r\n\t\t\t\t<button color=\"primary\" mat-mini-fab class=\"next available\" (click)=\"clickNext(sideEnum.right)\" data-cy=\"date-range-picker-next__button\">\r\n\t\t\t\t\t<mat-icon>arrow_forward_ios</mat-icon>\r\n\t\t\t\t</button>\r\n\t\t\t\t<div class=\"calendar-table\">\r\n\t\t\t\t\t<table class=\"table-condensed\" *ngIf=\"calendarVariables\">\r\n\t\t\t\t\t\t<thead>\r\n\t\t\t\t\t\t\t<tr>\r\n\t\t\t\t\t\t\t\t<th *ngIf=\"showWeekNumbers || showISOWeekNumbers\"></th>\r\n\t\t\t\t\t\t\t\t<th [colSpan]=\"!showDropdowns ? 7 : 5\" class=\"month\">\r\n\t\t\t\t\t\t\t\t\t<ng-container *ngIf=\"showDropdowns && calendarVariables.right.dropdowns\">\r\n\t\t\t\t\t\t\t\t\t\t<mat-form-field>\r\n\t\t\t\t\t\t\t\t\t\t\t<mat-select\r\n\t\t\t\t\t\t\t\t\t\t\t\t[(ngModel)]=\"calendarVariables.right.dropdowns.currentMonth\"\r\n\t\t\t\t\t\t\t\t\t\t\t\t(selectionChange)=\"monthChanged($event, sideEnum.right)\"\r\n\t\t\t\t\t\t\t\t\t\t\t>\r\n\t\t\t\t\t\t\t\t\t\t\t\t<mat-option\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t[disabled]=\"\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t(calendarVariables.right.dropdowns.inMinYear &&\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tm < calendarVariables.right.minDate.month()) ||\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t(calendarVariables.right.dropdowns.inMaxYear &&\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tm > calendarVariables.right.maxDate.month())\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\"\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t*ngFor=\"let m of calendarVariables.right.dropdowns.monthArrays\"\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t[value]=\"m\"\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t>{{ locale.monthNames[m] }}</mat-option\r\n\t\t\t\t\t\t\t\t\t\t\t\t>\r\n\t\t\t\t\t\t\t\t\t\t\t</mat-select>\r\n\t\t\t\t\t\t\t\t\t\t</mat-form-field>\r\n\t\t\t\t\t\t\t\t\t</ng-container>\r\n\t\t\t\t\t\t\t\t\t<ng-container *ngIf=\"!showDropdowns || !calendarVariables.right.dropdowns\">\r\n\t\t\t\t\t\t\t\t\t\t{{ this.locale.monthNames[calendarVariables?.right?.calendar[1][1].month()] }}\r\n\t\t\t\t\t\t\t\t\t\t{{ calendarVariables?.right?.calendar[1][1].format(' YYYY') }}\r\n\t\t\t\t\t\t\t\t\t</ng-container>\r\n\t\t\t\t\t\t\t\t</th>\r\n\t\t\t\t\t\t\t\t<th *ngIf=\"showDropdowns && calendarVariables.right.dropdowns\" colspan=\"2\" class=\"year\">\r\n\t\t\t\t\t\t\t\t\t<ng-container>\r\n\t\t\t\t\t\t\t\t\t\t<mat-form-field>\r\n\t\t\t\t\t\t\t\t\t\t\t<mat-select\r\n\t\t\t\t\t\t\t\t\t\t\t\t[(ngModel)]=\"calendarVariables.right.dropdowns.currentYear\"\r\n\t\t\t\t\t\t\t\t\t\t\t\t(selectionChange)=\"yearChanged($event, sideEnum.right)\"\r\n\t\t\t\t\t\t\t\t\t\t\t>\r\n\t\t\t\t\t\t\t\t\t\t\t\t<mat-option\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t*ngFor=\"let y of calendarVariables.right.dropdowns.yearArrays\"\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t[value]=\"y\"\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t>{{ y }}</mat-option\r\n\t\t\t\t\t\t\t\t\t\t\t\t>\r\n\t\t\t\t\t\t\t\t\t\t\t</mat-select>\r\n\t\t\t\t\t\t\t\t\t\t</mat-form-field>\r\n\t\t\t\t\t\t\t\t\t</ng-container>\r\n\t\t\t\t\t\t\t\t</th>\r\n\t\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t\t\t<tr class=\"week-days\">\r\n\t\t\t\t\t\t\t\t<th *ngIf=\"showWeekNumbers || showISOWeekNumbers\" class=\"week\">\r\n\t\t\t\t\t\t\t\t\t<span>{{ this.locale.weekLabel }}</span>\r\n\t\t\t\t\t\t\t\t</th>\r\n\t\t\t\t\t\t\t\t<th *ngFor=\"let dayofweek of locale.daysOfWeek\">\r\n\t\t\t\t\t\t\t\t\t<span>{{ dayofweek[0] }}</span>\r\n\t\t\t\t\t\t\t\t</th>\r\n\t\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t\t</thead>\r\n\t\t\t\t\t\t<tbody>\r\n\t\t\t\t\t\t\t<tr\r\n\t\t\t\t\t\t\t\t*ngFor=\"let row of calendarVariables.right.calRows; let rowIndex = index;\"\r\n\t\t\t\t\t\t\t\t[class]=\"calendarVariables.right.classes[row].classList\"\r\n\t\t\t\t\t\t\t>\r\n\t\t\t\t\t\t\t\t<td class=\"week\" *ngIf=\"showWeekNumbers\">\r\n\t\t\t\t\t\t\t\t\t<span>{{ calendarVariables.right.calendar[row][0].week() }}</span>\r\n\t\t\t\t\t\t\t\t</td>\r\n\t\t\t\t\t\t\t\t<td class=\"week\" *ngIf=\"showISOWeekNumbers\">\r\n\t\t\t\t\t\t\t\t\t<span>{{ calendarVariables.right.calendar[row][0].isoWeek() }}</span>\r\n\t\t\t\t\t\t\t\t</td>\r\n\t\t\t\t\t\t\t\t<td\r\n\t\t\t\t\t\t\t\t\t*ngFor=\"let col of calendarVariables.right.calCols; let colIndex = index;\"\r\n\t\t\t\t\t\t\t\t\t[class]=\"calendarVariables.right.classes[row][col]\"\r\n\t\t\t\t\t\t\t\t\t(click)=\"clickDate($event, sideEnum.right, row, col)\"\r\n\t\t\t\t\t\t\t\t\t[attr.data-cy]=\"'date-range-picker-row-' + rowIndex + '-col-' + colIndex + '__button'\"\r\n\t\t\t\t\t\t\t\t>\r\n\t\t\t\t\t\t\t\t\t<span>{{ calendarVariables.right.calendar[row][col].date() }}</span>\r\n\t\t\t\t\t\t\t\t</td>\r\n\t\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t\t</tbody>\r\n\t\t\t\t\t</table>\r\n\t\t\t\t</div>\r\n\t\t\t\t<div class=\"calendar-time\" *ngIf=\"timePicker\">\r\n\t\t\t\t\t<div class=\"select\">\r\n\t\t\t\t\t\t<select\r\n\t\t\t\t\t\t\tclass=\"select-item hourselect\"\r\n\t\t\t\t\t\t\t[disabled]=\"!endDate\"\r\n\t\t\t\t\t\t\t[(ngModel)]=\"timepickerVariables.right.selectedHour\"\r\n\t\t\t\t\t\t\t(ngModelChange)=\"timeChanged($event, sideEnum.right)\"\r\n\t\t\t\t\t\t>\r\n\t\t\t\t\t\t\t<option\r\n\t\t\t\t\t\t\t\t*ngFor=\"let i of timepickerVariables.right.hours\"\r\n\t\t\t\t\t\t\t\t[value]=\"i\"\r\n\t\t\t\t\t\t\t\t[disabled]=\"timepickerVariables.right.disabledHours.indexOf(i) > -1\"\r\n\t\t\t\t\t\t\t\t>{{ i }}</option\r\n\t\t\t\t\t\t\t>\r\n\t\t\t\t\t\t</select>\r\n\t\t\t\t\t\t<span class=\"select-highlight\"></span>\r\n\t\t\t\t\t\t<span class=\"select-bar\"></span>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t\t<div class=\"select\">\r\n\t\t\t\t\t\t<select\r\n\t\t\t\t\t\t\tclass=\"select-item minuteselect\"\r\n\t\t\t\t\t\t\t[disabled]=\"!endDate\"\r\n\t\t\t\t\t\t\t[(ngModel)]=\"timepickerVariables.right.selectedMinute\"\r\n\t\t\t\t\t\t\t(ngModelChange)=\"timeChanged($event, sideEnum.right)\"\r\n\t\t\t\t\t\t>\r\n\t\t\t\t\t\t\t<option\r\n\t\t\t\t\t\t\t\t*ngFor=\"let i of timepickerVariables.right.minutes; let index = index\"\r\n\t\t\t\t\t\t\t\t[value]=\"i\"\r\n\t\t\t\t\t\t\t\t[disabled]=\"timepickerVariables.right.disabledMinutes.indexOf(i) > -1\"\r\n\t\t\t\t\t\t\t\t>{{ timepickerVariables.right.minutesLabel[index] }}</option\r\n\t\t\t\t\t\t\t>\r\n\t\t\t\t\t\t</select>\r\n\t\t\t\t\t\t<span class=\"select-highlight\"></span>\r\n\t\t\t\t\t\t<span class=\"select-bar\"></span>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t\t<div class=\"select\">\r\n\t\t\t\t\t\t<select\r\n\t\t\t\t\t\t\t*ngIf=\"timePickerSeconds\"\r\n\t\t\t\t\t\t\tclass=\"select-item secondselect\"\r\n\t\t\t\t\t\t\t[disabled]=\"!endDate\"\r\n\t\t\t\t\t\t\t[(ngModel)]=\"timepickerVariables.right.selectedSecond\"\r\n\t\t\t\t\t\t\t(ngModelChange)=\"timeChanged($event, sideEnum.right)\"\r\n\t\t\t\t\t\t>\r\n\t\t\t\t\t\t\t<option\r\n\t\t\t\t\t\t\t\t*ngFor=\"let i of timepickerVariables.right.seconds; let index = index\"\r\n\t\t\t\t\t\t\t\t[value]=\"i\"\r\n\t\t\t\t\t\t\t\t[disabled]=\"timepickerVariables.right.disabledSeconds.indexOf(i) > -1\"\r\n\t\t\t\t\t\t\t\t>{{ timepickerVariables.right.secondsLabel[index] }}</option\r\n\t\t\t\t\t\t\t>\r\n\t\t\t\t\t\t</select>\r\n\t\t\t\t\t\t<span class=\"select-highlight\"></span>\r\n\t\t\t\t\t\t<span class=\"select-bar\"></span>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t\t<div class=\"select\">\r\n\t\t\t\t\t\t<select\r\n\t\t\t\t\t\t\t*ngIf=\"!timePicker24Hour\"\r\n\t\t\t\t\t\t\tclass=\"select-item ampmselect\"\r\n\t\t\t\t\t\t\t[(ngModel)]=\"timepickerVariables.right.ampmModel\"\r\n\t\t\t\t\t\t\t(ngModelChange)=\"timeChanged($event, sideEnum.right)\"\r\n\t\t\t\t\t\t>\r\n\t\t\t\t\t\t\t<option value=\"AM\" [disabled]=\"timepickerVariables.right.amDisabled\">AM</option>\r\n\t\t\t\t\t\t\t<option value=\"PM\" [disabled]=\"timepickerVariables.right.pmDisabled\">PM</option>\r\n\t\t\t\t\t\t</select>\r\n\t\t\t\t\t\t<span class=\"select-highlight\"></span>\r\n\t\t\t\t\t\t<span class=\"select-bar\"></span>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t\t<div class=\"dp-footer\" *ngIf=\"!autoApply && (!ranges.length || (showCalInRanges && !singleDatePicker))\">\r\n\t\t\t<div class=\"range-buttons\">\r\n\t\t\t\t<div class=\"custom-range-label\" *ngIf=\"showCustomRangeLabel\">\r\n\t\t\t\t\t<strong>{{ _locale.customRangeLabel }}:</strong>\r\n\t\t\t\t</div>\r\n\t\t\t\t<button\r\n\t\t\t\t\t*ngFor=\"let range of ranges\"\r\n\t\t\t\t\tmat-stroked-button\r\n\t\t\t\t\tcolor=\"primary\"\r\n\t\t\t\t\tclass=\"{{ buttonClassRange }}\"\r\n\t\t\t\t\t(click)=\"clickRange($event, range)\"\r\n\t\t\t\t\t[disabled]=\"disableRange(range)\"\r\n\t\t\t\t\t[ngClass]=\"{ active: range.label === chosenLabel }\"\r\n\t\t\t\t\t[attr.data-cy]=\"'date-range-picker-range-' + range.key + '__button'\"\r\n\t\t\t\t>\r\n\t\t\t\t\t{{ range.label }}\r\n\t\t\t\t</button>\r\n\t\t\t</div>\r\n\t\t\t<div class=\"control-buttons\">\r\n\t\t\t\t<button mat-flat-button color=\"primary\" (click)=\"clickApply($event)\" data-cy=\"date-range-picker-apply__button\">\r\n\t\t\t\t\t{{ _locale.applyLabel }}\r\n\t\t\t\t</button>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t</div>\r\n\t<ng-template #fullScreenView>\r\n\t\t<div class=\"dp-header\" id=\"scroll-top\">\r\n\t\t\t<button mat-icon-button (click)=\"clickCancel($event)\" data-cy=\"date-range-picker-close__button\">\r\n\t\t\t\t<mat-icon>close</mat-icon>\r\n\t\t\t</button>\r\n\t\t\t<div class=\"selected-range\">\r\n\t\t\t\t{{startDate | date: locale.displayFormat:undefined:locale.localeId}} - {{endDate | date: locale.displayFormat:undefined:locale.localeId}}\r\n\t\t\t</div>\r\n\t\t\t<div class=\"header-icon\">\r\n\t\t\t\t<mat-icon>date_range</mat-icon>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t\t<div class=\"dp-body\" id=\"scroll-body\" (scroll)=\"scrollDetection($event)\">\r\n\t\t\t<div class=\"calendar\" [ngClass]=\"{ right: singleDatePicker, left: !singleDatePicker }\" *ngIf=\"showCalInRanges\">\r\n\t\t\t\t<div class=\"calendar-table\">\r\n\t\t\t\t\t<table class=\"table-condensed\" *ngIf=\"calendarVariables\">\r\n\t\t\t\t\t\t<thead>\r\n\t\t\t\t\t\t<tr>\r\n\t\t\t\t\t\t\t<th *ngIf=\"showWeekNumbers || showISOWeekNumbers\"></th>\r\n\t\t\t\t\t\t\t<th [colSpan]=\"!showDropdowns ? 7 : 5\" class=\"month drp-animate\">\r\n\t\t\t\t\t\t\t\t<ng-container *ngIf=\"showDropdowns && calendarVariables.left.dropdowns\">\r\n\t\t\t\t\t\t\t\t\t<mat-form-field>\r\n\t\t\t\t\t\t\t\t\t\t<mat-select [(ngModel)]=\"calendarVariables.left.dropdowns.currentMonth\" (selectionChange)=\"monthChanged($event, sideEnum.left)\">\r\n\t\t\t\t\t\t\t\t\t\t\t<mat-option *ngFor=\"let m of calendarVariables.left.dropdowns.monthArrays\" [disabled]=\"\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t(calendarVariables.left.dropdowns.inMinYear &&\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tm < calendarVariables.left.minDate.month()) ||\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t(calendarVariables.left.dropdowns.inMaxYear &&\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tm > calendarVariables.left.maxDate.month())\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\" [value]=\"m\">{{ locale.monthNames[m] }}</mat-option>\r\n\t\t\t\t\t\t\t\t\t\t\t<mat-option *ngFor=\"let m of calendarVariables.left.dropdowns.monthArrays\" [disabled]=\"\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t(calendarVariables.left.dropdowns.inMinYear &&\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tm < calendarVariables.left.minDate.month()) ||\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t(calendarVariables.left.dropdowns.inMaxYear &&\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tm > calendarVariables.left.maxDate.month())\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\" [value]=\"m\">{{ locale.monthNames[m] }}</mat-option>\r\n\t\t\t\t\t\t\t\t\t\t</mat-select>\r\n\t\t\t\t\t\t\t\t\t</mat-form-field>\r\n\t\t\t\t\t\t\t\t</ng-container>\r\n\t\t\t\t\t\t\t\t<ng-container *ngIf=\"!showDropdowns || !calendarVariables.left.dropdowns\">\r\n\t\t\t\t\t\t\t\t\t{{ this.locale.monthNames[calendarVariables?.left?.calendar[1][1].month()] }}\r\n\t\t\t\t\t\t\t\t\t{{ calendarVariables?.left?.calendar[1][1].format(' YYYY') }}\r\n\t\t\t\t\t\t\t\t</ng-container>\r\n\t\t\t\t\t\t\t</th>\r\n\t\t\t\t\t\t\t<th *ngIf=\"showDropdowns && calendarVariables.left.dropdowns\" colspan=\"2\" class=\"year\">\r\n\t\t\t\t\t\t\t\t<ng-container>\r\n\t\t\t\t\t\t\t\t\t<mat-form-field>\r\n\t\t\t\t\t\t\t\t\t\t<mat-select [(ngModel)]=\"calendarVariables.left.dropdowns.currentYear\" (selectionChange)=\"yearChanged($event, sideEnum.left)\">\r\n\t\t\t\t\t\t\t\t\t\t\t<mat-option *ngFor=\"let y of calendarVariables.left.dropdowns.yearArrays\" [value]=\"y\">{{ y }}</mat-option>\r\n\t\t\t\t\t\t\t\t\t\t</mat-select>\r\n\t\t\t\t\t\t\t\t\t</mat-form-field>\r\n\t\t\t\t\t\t\t\t</ng-container>\r\n\t\t\t\t\t\t\t</th>\r\n\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t\t<tr class=\"week-days\">\r\n\t\t\t\t\t\t\t<th *ngIf=\"showWeekNumbers || showISOWeekNumbers\" class=\"week\">\r\n\t\t\t\t\t\t\t\t<span>{{ this.locale.weekLabel }}</span>\r\n\t\t\t\t\t\t\t</th>\r\n\t\t\t\t\t\t\t<th *ngFor=\"let dayofweek of locale.daysOfWeek\">\r\n\t\t\t\t\t\t\t\t<span>{{ dayofweek[0] }}</span>\r\n\t\t\t\t\t\t\t</th>\r\n\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t\t</thead>\r\n\t\t\t\t\t\t<tbody class=\"drp-animate\">\r\n\t\t\t\t\t\t<tr *ngFor=\"let row of calendarVariables.left.calRows; let rowIndex = index;\" [class]=\"calendarVariables.left.classes[row].classList\">\r\n\t\t\t\t\t\t\t<!-- add week number -->\r\n\t\t\t\t\t\t\t<td class=\"week\" *ngIf=\"showWeekNumbers\">\r\n\t\t\t\t\t\t\t\t<span>{{ calendarVariables.left.calendar[row][0].week() }}</span>\r\n\t\t\t\t\t\t\t</td>\r\n\t\t\t\t\t\t\t<td class=\"week\" *ngIf=\"showISOWeekNumbers\">\r\n\t\t\t\t\t\t\t\t<span>{{ calendarVariables.left.calendar[row][0].isoWeek() }}</span>\r\n\t\t\t\t\t\t\t</td>\r\n\t\t\t\t\t\t\t<!-- cal -->\r\n\t\t\t\t\t\t\t<td *ngFor=\"let col of calendarVariables.left.calCols; let colIndex = index\" [class]=\"calendarVariables.left.classes[row][col]\" (click)=\"clickDate($event, sideEnum.left, row, col)\" [attr.data-cy]=\"'date-range-picker-row-' + rowIndex + '-col-' + colIndex + '__button'\">\r\n\t\t\t\t\t\t\t\t<span>{{ calendarVariables.left.calendar[row][col].date() }}</span>\r\n\t\t\t\t\t\t\t</td>\r\n\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t\t</tbody>\r\n\t\t\t\t\t</table>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t\t<div class=\"calendar right\" *ngIf=\"showCalInRanges && !singleDatePicker\">\r\n\t\t\t\t<div class=\"calendar-table\">\r\n\t\t\t\t\t<table class=\"table-condensed\" *ngIf=\"calendarVariables\">\r\n\t\t\t\t\t\t<thead>\r\n\t\t\t\t\t\t<tr>\r\n\t\t\t\t\t\t\t<th *ngIf=\"showWeekNumbers || showISOWeekNumbers\"></th>\r\n\t\t\t\t\t\t\t<th [colSpan]=\"!showDropdowns ? 7 : 5\" class=\"month\">\r\n\t\t\t\t\t\t\t\t<ng-container *ngIf=\"showDropdowns && calendarVariables.right.dropdowns\">\r\n\t\t\t\t\t\t\t\t\t<mat-form-field>\r\n\t\t\t\t\t\t\t\t\t\t<mat-select [(ngModel)]=\"calendarVariables.right.dropdowns.currentMonth\" (selectionChange)=\"monthChanged($event, sideEnum.right)\">\r\n\t\t\t\t\t\t\t\t\t\t\t<mat-option [disabled]=\"\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t(calendarVariables.right.dropdowns.inMinYear &&\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tm < calendarVariables.right.minDate.month()) ||\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t(calendarVariables.right.dropdowns.inMaxYear &&\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tm > calendarVariables.right.maxDate.month())\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\" *ngFor=\"let m of calendarVariables.right.dropdowns.monthArrays\" [value]=\"m\">{{ locale.monthNames[m] }}</mat-option>\r\n\t\t\t\t\t\t\t\t\t\t\t<mat-option [disabled]=\"\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t(calendarVariables.right.dropdowns.inMinYear &&\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tm < calendarVariables.right.minDate.month()) ||\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t(calendarVariables.right.dropdowns.inMaxYear &&\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tm > calendarVariables.right.maxDate.month())\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\" *ngFor=\"let m of calendarVariables.right.dropdowns.monthArrays\" [value]=\"m\">{{ locale.monthNames[m] }}</mat-option>\r\n\t\t\t\t\t\t\t\t\t\t</mat-select>\r\n\t\t\t\t\t\t\t\t\t</mat-form-field>\r\n\t\t\t\t\t\t\t\t</ng-container>\r\n\t\t\t\t\t\t\t\t<ng-container *ngIf=\"!showDropdowns || !calendarVariables.right.dropdowns\">\r\n\t\t\t\t\t\t\t\t\t{{ this.locale.monthNames[calendarVariables?.right?.calendar[1][1].month()] }}\r\n\t\t\t\t\t\t\t\t\t{{ calendarVariables?.right?.calendar[1][1].format(' YYYY') }}\r\n\t\t\t\t\t\t\t\t</ng-container>\r\n\t\t\t\t\t\t\t</th>\r\n\t\t\t\t\t\t\t<th *ngIf=\"showDropdowns && calendarVariables.right.dropdowns\" colspan=\"2\" class=\"year\">\r\n\t\t\t\t\t\t\t\t<ng-container>\r\n\t\t\t\t\t\t\t\t\t<mat-form-field>\r\n\t\t\t\t\t\t\t\t\t\t<mat-select [(ngModel)]=\"calendarVariables.right.dropdowns.currentYear\" (selectionChange)=\"yearChanged($event, sideEnum.right)\">\r\n\t\t\t\t\t\t\t\t\t\t\t<mat-option *ngFor=\"let y of calendarVariables.right.dropdowns.yearArrays\" [value]=\"y\">{{ y }}</mat-option>\r\n\t\t\t\t\t\t\t\t\t\t</mat-select>\r\n\t\t\t\t\t\t\t\t\t</mat-form-field>\r\n\t\t\t\t\t\t\t\t</ng-container>\r\n\t\t\t\t\t\t\t</th>\r\n\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t\t<tr class=\"week-days\">\r\n\t\t\t\t\t\t\t<th *ngIf=\"showWeekNumbers || showISOWeekNumbers\" class=\"week\">\r\n\t\t\t\t\t\t\t\t<span>{{ this.locale.weekLabel }}</span>\r\n\t\t\t\t\t\t\t</th>\r\n\t\t\t\t\t\t\t<th *ngFor=\"let dayofweek of locale.daysOfWeek\">\r\n\t\t\t\t\t\t\t\t<span>{{ dayofweek[0] }}</span>\r\n\t\t\t\t\t\t\t</th>\r\n\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t\t</thead>\r\n\t\t\t\t\t\t<tbody>\r\n\t\t\t\t\t\t<tr *ngFor=\"let row of calendarVariables.right.calRows; let rowIndex = index;\" [class]=\"calendarVariables.right.classes[row].classList\">\r\n\t\t\t\t\t\t\t<td class=\"week\" *ngIf=\"showWeekNumbers\">\r\n\t\t\t\t\t\t\t\t<span>{{ calendarVariables.right.calendar[row][0].week() }}</span>\r\n\t\t\t\t\t\t\t</td>\r\n\t\t\t\t\t\t\t<td class=\"week\" *ngIf=\"showISOWeekNumbers\">\r\n\t\t\t\t\t\t\t\t<span>{{ calendarVariables.right.calendar[row][0].isoWeek() }}</span>\r\n\t\t\t\t\t\t\t</td>\r\n\t\t\t\t\t\t\t<td *ngFor=\"let col of calendarVariables.right.calCols; let colIndex = index;\" [class]=\"calendarVariables.right.classes[row][col]\" (click)=\"clickDate($event, sideEnum.right, row, col)\" [attr.data-cy]=\"'date-range-picker-row-' + rowIndex + '-col-' + colIndex + '__button'\">\r\n\t\t\t\t\t\t\t\t<span>{{ calendarVariables.right.calendar[row][col].date() }}</span>\r\n\t\t\t\t\t\t\t</td>\r\n\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t\t</tbody>\r\n\t\t\t\t\t</table>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t\t<div class=\"dp-footer\">\r\n\t\t\t<div class=\"control-buttons\" id=\"scroll-bottom\">\r\n\t\t\t\t<button mat-button *ngIf=\"showClearButton\" class=\"cal-reset-btn\" (click)=\"clear()\" data-cy=\"date-range-picker-clear__button\">\r\n\t\t\t\t\t{{ _locale.clearLabel }}\r\n\t\t\t\t</button>\r\n\t\t\t\t<button mat-flat-button color=\"primary\" (click)=\"clickApply($event)\" data-cy=\"date-range-picker-apply__button\">\r\n\t\t\t\t\t{{ _locale.applyLabel }}\r\n\t\t\t\t</button>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t</ng-template>\r\n</div>\r\n",
                // tslint:disable-next-line:no-host-metadata-property
                host: {
                    '(click)': 'handleInternalClick($event)'
                },
                encapsulation: ViewEncapsulation.None,
                providers: [
                    {
                        provide: NG_VALUE_ACCESSOR,
                        useExisting: forwardRef(() => DateRangePickerComponent),
                        multi: true
                    }
                ],
                styles: [":host{left:0;position:absolute;top:0}td.hidden span,tr.hidden{cursor:default;display:none}td.available:not(.off):hover{border:2px solid #42a5f5}.ranges li{display:inline-block}button.available.prev{background-color:#fff;border-radius:2em;color:#000;display:block;height:40px;left:-20px;opacity:1;position:fixed;top:calc(50% - 20px);width:40px}button.available.prev mat-icon{transform:rotateY(180deg)}button.available.next{background-color:#fff;border-radius:2em;color:#000;display:block;height:40px;opacity:1;position:fixed;right:-20px;top:calc(50% - 20px);width:40px}.md-drppicker{background-color:#fff;color:inherit;display:flex;flex-direction:column;height:555px;justify-content:space-between;margin:0;padding:0;position:absolute;width:420px;z-index:1000}.md-drppicker .dp-header{align-items:center;border-bottom:1px solid #eee;display:flex;flex-direction:row;justify-content:flex-end;padding:16px}.md-drppicker .dp-header .mat-form-field{max-width:214px}.md-drppicker .dp-header .cal-reset-btn,.md-drppicker .dp-header .cal-start-date{margin-right:16px}.md-drppicker .dp-header .mat-form-field-type-mat-input .mat-form-field-flex:after,.md-drppicker .dp-header .mat-form-field-type-mat-input .mat-form-field-flex:before{margin-top:0}.md-drppicker .dp-header .mat-form-field-prefix,.md-drppicker .dp-header .mat-form-field-suffix{top:0}.md-drppicker .dp-body{display:flex;flex-direction:row;margin-bottom:auto}.md-drppicker .dp-footer{border-top:1px solid #eee;display:flex;flex-direction:row;justify-content:space-between;padding:16px}.md-drppicker.single{height:395px}.md-drppicker.single .calendar.right{margin:0}.md-drppicker *,.md-drppicker :after,.md-drppicker :before{box-sizing:border-box}.md-drppicker .mat-form-field-flex:before{margin-top:0!important}.md-drppicker .mat-form-field-appearance-standard .mat-form-field-flex,.md-drppicker .mat-form-field-flex{align-items:center;padding:0}.md-drppicker .mat-form-field-infix,.md-drppicker .mat-form-field-wrapper{border-top:none;line-height:44px;margin:0;padding:0}.md-drppicker .mat-select{border:none}.md-drppicker .mat-select .mat-select-trigger{margin:0}.md-drppicker .mat-select-value{font-size:16px;font-weight:500}.md-drppicker .year{max-width:88px}.md-drppicker .year mat-form-field{width:100%}.md-drppicker .mat-form-field-appearance-legacy .mat-form-field-infix{padding:.4375em 0}.md-drppicker .custom-range-label{display:inline-flex}.md-drppicker .range-buttons{display:flex;flex-direction:row;justify-content:flex-start;width:100%}.md-drppicker .range-buttons button:not(:last-child){margin-right:15px}.md-drppicker.double{width:auto}.md-drppicker.inline{position:relative}.md-drppicker:after,.md-drppicker:before{border-bottom-color:rgba(0,0,0,.2);content:\"\";display:inline-block;position:absolute}.md-drppicker.openscenter:after,.md-drppicker.openscenter:before{left:0;margin-left:auto;margin-right:auto;right:0;width:0}.md-drppicker.single .calendar,.md-drppicker.single .ranges{float:none}.md-drppicker.shown{-moz-user-select:none;-ms-user-select:none;-webkit-touch-callout:none;-webkit-user-select:none;transform:scale(1);transform-origin:0 0;transition:all .1s ease-in-out;user-select:none}.md-drppicker.shown.drops-up-left{transform-origin:100% 100%}.md-drppicker.shown.drops-up-right{transform-origin:0 100%}.md-drppicker.shown.drops-down-left{transform-origin:100% 0}.md-drppicker.shown.drops-down-right{transform-origin:0 0}.md-drppicker.shown.drops-down-center{transform-origin:NaN%}.md-drppicker.shown.drops-up-center{transform-origin:50%}.md-drppicker.shown .calendar{-ms-grid-row-align:start;align-self:start;display:flex}.md-drppicker.hidden{-moz-user-select:none;-ms-user-select:none;-webkit-touch-callout:none;-webkit-user-select:none;cursor:default;transform:scale(0);transform-origin:0 0;transition:all .1s ease;user-select:none}.md-drppicker.hidden.drops-up-left{transform-origin:100% 100%}.md-drppicker.hidden.drops-up-right{transform-origin:0 100%}.md-drppicker.hidden.drops-down-left{transform-origin:100% 0}.md-drppicker.hidden.drops-down-right{transform-origin:0 0}.md-drppicker.hidden.drops-down-center{transform-origin:NaN%}.md-drppicker.hidden.drops-up-center{transform-origin:50%}.md-drppicker.hidden .calendar{display:none}.md-drppicker .calendar{margin:0 15px;max-width:390px}.md-drppicker .calendar .week-days th{color:#424242;line-height:28px;width:15px}.md-drppicker .calendar .month,.md-drppicker .calendar .week-days th{font-size:16px;font-weight:500;height:28px;letter-spacing:.44px;text-align:center}.md-drppicker .calendar .month{color:#000;line-height:48px;width:103px}.md-drppicker .calendar.single .calendar-table{border:none}.md-drppicker .calendar td,.md-drppicker .calendar th{height:44px;min-width:44px;padding:0;text-align:center;white-space:nowrap}.md-drppicker .calendar td span,.md-drppicker .calendar th span{pointer-events:none}.md-drppicker .calendar-table{background-color:#fff;border:1px solid #fff;border-radius:25px;padding:15px}.md-drppicker table{border-collapse:separate;margin:0;width:100%}.md-drppicker th{color:#988c8c}.md-drppicker td,.md-drppicker th{border:2px solid transparent;border-radius:25px;cursor:pointer;height:2em;text-align:center;white-space:nowrap;width:2em}.md-drppicker td.week,.md-drppicker th.week{color:#ccc;font-size:80%}.md-drppicker td{border-radius:2em;margin:.25em 0;opacity:.8;transform:scale(1);transition:background-color .2s ease}.md-drppicker td.off,.md-drppicker td.off.end-date,.md-drppicker td.off.in-range,.md-drppicker td.off.start-date{background-color:#fff;border-color:transparent;color:#999}.md-drppicker td.in-range{background-color:#e3f2fd;border-color:#e3f2fd;border-radius:0;color:#000;opacity:1}.md-drppicker td.start-date{border-radius:2em 0 0 2em}.md-drppicker td.end-date{border-radius:0 2em 2em 0}.md-drppicker td.start-date.end-date{border-radius:25px}.md-drppicker td.active{background-color:#42a5f5;border-color:#42a5f5;box-sizing:border-box;color:#fff;height:44px;transition:background .3s ease-out;width:44px}.md-drppicker td.active:hover{border-color:#e3f2fd}.md-drppicker th.month{width:auto}.md-drppicker option.disabled,.md-drppicker td.disabled{color:#999;cursor:not-allowed;text-decoration:line-through}.md-drppicker .dropdowns{background-image:url(data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjE2cHgiIGhlaWdodD0iMTZweCIgdmlld0JveD0iMCAwIDI1NSAyNTUiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDI1NSAyNTU7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPGc+Cgk8ZyBpZD0iYXJyb3ctZHJvcC1kb3duIj4KCQk8cG9seWdvbiBwb2ludHM9IjAsNjMuNzUgMTI3LjUsMTkxLjI1IDI1NSw2My43NSAgICIgZmlsbD0iIzk4OGM4YyIvPgoJPC9nPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=);background-position-x:right;background-position-y:center;background-repeat:no-repeat;background-size:10px;width:108px}.md-drppicker .dropdowns select{background-color:hsla(0,0%,100%,.9);border:1px solid #f2f2f2;border-radius:2px;display:inline-block;height:3rem;padding:5px;width:100%}.md-drppicker .dropdowns select.monthselect,.md-drppicker .dropdowns select.yearselect{cursor:default;font-size:12px;height:auto;padding:1px}.md-drppicker .dropdowns select.ampmselect,.md-drppicker .dropdowns select.hourselect,.md-drppicker .dropdowns select.minuteselect,.md-drppicker .dropdowns select.secondselect{background:#eee;border:1px solid #eee;font-size:12px;margin:0 auto;outline:0;padding:2px;width:50px}.md-drppicker .dropdowns select.monthselect,.md-drppicker .dropdowns select.yearselect{cursor:pointer;left:0;margin:0;opacity:0;padding:0;position:absolute;top:0}.md-drppicker th.month>div{display:inline-block;position:relative}.md-drppicker .calendar-time{line-height:30px;margin:4px auto 0;position:relative;text-align:center}.md-drppicker .calendar-time .select{display:inline}.md-drppicker .calendar-time .select .select-item{background-color:transparent;border:none;border-bottom:1px solid rgba(0,0,0,.12);border-radius:0;display:inline-block;font-family:inherit;font-size:18px;padding:10px 10px 10px 0;position:relative;width:auto}.md-drppicker .calendar-time .select .select-item:after{border-left:6px solid transparent;border-right:6px solid transparent;border-top:6px solid rgba(0,0,0,.12);content:\"\";height:0;padding:0;pointer-events:none;position:absolute;right:10px;top:18px;width:0}.md-drppicker .calendar-time .select .select-item:focus{outline:none}.md-drppicker .calendar-time .select .select-item .select-label{color:rgba(0,0,0,.26);font-size:16px;font-weight:400;left:0;pointer-events:none;position:absolute;top:10px;transition:all .2s ease}.md-drppicker .calendar-time select.disabled{color:#ccc;cursor:not-allowed}.md-drppicker .label-input{border:1px solid #ccc;border-radius:25px;color:#555;display:block;height:30px;line-height:30px;margin:0 auto 5px;padding:0 0 0 28px;vertical-align:middle;width:100%}.md-drppicker .label-input.active{border:1px solid #42a5f5;border-radius:25px}.md-drppicker .md-drppicker_input{padding:0 30px 0 0;position:relative}.md-drppicker .md-drppicker_input i,.md-drppicker .md-drppicker_input svg{left:8px;position:absolute;top:8px}.md-drppicker.rtl .label-input{padding-left:6px;padding-right:28px}.md-drppicker.rtl .md-drppicker_input i,.md-drppicker.rtl .md-drppicker_input svg{left:auto;right:8px}.md-drppicker .show-ranges .drp-calendar.left{border-left:1px solid #ddd}.md-drppicker .ranges{float:none;margin:0;text-align:left}.md-drppicker .ranges ul{list-style:none;margin:0 auto;padding:0;width:100%}.md-drppicker .ranges ul li{font-size:12px;margin-right:20px}.md-drppicker .ranges ul li button{background:none;border:none;cursor:pointer;padding:8px 12px;text-align:left;width:100%}.md-drppicker .ranges ul li button[disabled]{opacity:.3}.md-drppicker .show-calendar .ranges{margin-top:8px}.md-drppicker [hidden]{display:none}.md-drppicker .buttons{margin:0 5px 5px 0;text-align:right}.md-drppicker .btn{border:none;border-radius:2px;box-shadow:0 1px 4px rgba(0,0,0,.6);color:#ecf0f1;cursor:pointer;height:auto;line-height:36px;outline:none;overflow:hidden;padding:0 6px;position:relative;text-transform:uppercase;transition:background-color .4s}.md-drppicker .btn,.md-drppicker .btn:focus,.md-drppicker .btn:hover{background-color:#3f51b5}.md-drppicker .btn>*{position:relative}.md-drppicker .btn span{display:block;padding:12px 24px}.md-drppicker .btn:before{background-color:rgba(236,240,241,.3);border-radius:100%;content:\"\";display:block;left:50%;padding-top:0;position:absolute;top:50%;transform:translate(-50%,-50%);width:0}.md-drppicker .btn:active:before{padding-top:120%;transition:width .2s ease-out,padding-top .2s ease-out;width:120%}.md-drppicker .btn:disabled{opacity:.5}.md-drppicker .btn.btn-default{background-color:#dcdcdc;color:#000}.md-drppicker .clear{background-color:#fff!important;box-shadow:none}.md-drppicker .clear svg{color:#eb3232;fill:currentColor}.field-row{border-bottom:1px solid #eee;height:65px;width:100%}.field-row mat-form-field{float:right;margin-right:15px}.field-row .mat-form-field-flex{height:55px;padding-top:10px}.cal-reset-btn{margin-right:15px}td.available:hover{border:2px solid #42a5f5}.full-screen{flex-direction:column;height:100%;left:0;position:fixed;top:0}.full-screen,.full-screen .dp-header{display:flex;justify-content:space-between;width:100%}.full-screen .dp-header{align-items:center;background-color:#1565c0;color:#fff;flex:0 0 56px;flex-direction:row;padding:0 16px}.full-screen .dp-header .header-icon{height:40px;line-height:40px;text-align:center;vertical-align:middle;width:40px}.full-screen .dp-header .header-icon mat-icon{vertical-align:middle}.full-screen .body-container{display:flex;flex-direction:column;height:100%;justify-content:space-between;overflow:hidden}.full-screen .dp-body{flex:1 1 auto;flex-direction:column;margin-bottom:auto;overflow-y:auto;overflow-y:scroll;padding:150px 0}.full-screen .dp-body .calendar{flex:1 1 100%;height:auto;margin:0 auto;max-width:616px;width:100%}.full-screen .dp-body .calendar-table{flex:1 0 100%}.full-screen .dp-body .available{z-index:999}.full-screen .dp-body .available.next{right:10px}.full-screen .dp-body .available.prev{left:10px}.full-screen .dp-footer{align-items:center;display:flex;flex:0 0 56px;flex-direction:row;justify-content:flex-end}.full-screen .dp-footer .control-buttons{display:flex;flex-direction:row;justify-content:space-between;width:166px}"]
            },] }
];
DateRangePickerComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: ChangeDetectorRef },
    { type: LocaleService }
];
DateRangePickerComponent.propDecorators = {
    locale: [{ type: Input }],
    ranges: [{ type: Input }],
    startDate: [{ type: Input }],
    endDate: [{ type: Input }],
    dateLimit: [{ type: Input }],
    minDate: [{ type: Input }],
    maxDate: [{ type: Input }],
    autoApply: [{ type: Input }],
    singleDatePicker: [{ type: Input }],
    showDropdowns: [{ type: Input }],
    showWeekNumbers: [{ type: Input }],
    showISOWeekNumbers: [{ type: Input }],
    linkedCalendars: [{ type: Input }],
    autoUpdateInput: [{ type: Input }],
    alwaysShowCalendars: [{ type: Input }],
    lockStartDate: [{ type: Input }],
    timePicker: [{ type: Input }],
    timePicker24Hour: [{ type: Input }],
    timePickerIncrement: [{ type: Input }],
    timePickerSeconds: [{ type: Input }],
    showClearButton: [{ type: Input }],
    firstMonthDayClass: [{ type: Input }],
    lastMonthDayClass: [{ type: Input }],
    emptyWeekRowClass: [{ type: Input }],
    firstDayOfNextMonthClass: [{ type: Input }],
    lastDayOfPreviousMonthClass: [{ type: Input }],
    buttonClassApply: [{ type: Input }],
    buttonClassReset: [{ type: Input }],
    buttonClassRange: [{ type: Input }],
    isFullScreenPicker: [{ type: Input }],
    showCustomRangeLabel: [{ type: Input }],
    showCancel: [{ type: Input }],
    keepCalendarOpeningWithRange: [{ type: Input }],
    showRangeLabelOnInput: [{ type: Input }],
    customRangeDirection: [{ type: Input }],
    drops: [{ type: Input }],
    opens: [{ type: Input }],
    closeOnAutoApply: [{ type: Input }],
    choosedDate: [{ type: Output }],
    rangeClicked: [{ type: Output }],
    datesUpdated: [{ type: Output }],
    startDateChanged: [{ type: Output }],
    endDateChanged: [{ type: Output }],
    pickerContainer: [{ type: ViewChild, args: ['pickerContainer', { static: true },] }],
    isInvalidDate: [{ type: Input }],
    isCustomDate: [{ type: Input }]
};

const moment$2 = _moment;
class DateRangePickerDirective {
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
            start = moment$2(dateString[0], this.picker.locale.format);
            end = moment$2(dateString[1], this.picker.locale.format);
        }
        if (this.singleDatePicker || start === null || end === null) {
            start = moment$2(e.target.value, this.picker.locale.format);
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

class NgxDateRangePickerMd {
    constructor() { }
    static forRoot(config = {}) {
        return {
            ngModule: NgxDateRangePickerMd,
            providers: [
                { provide: LOCALE_CONFIG, useValue: config },
                { provide: LocaleService, useClass: LocaleService, deps: [LOCALE_CONFIG] }
            ]
        };
    }
}
NgxDateRangePickerMd.decorators = [
    { type: NgModule, args: [{
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
                exports: [DateRangePickerComponent, DateRangePickerDirective],
                entryComponents: [DateRangePickerComponent]
            },] }
];
NgxDateRangePickerMd.ctorParameters = () => [];

/**
 * Generated bundle index. Do not edit.
 */

export { DateRangePickerComponent, DateRangePickerDirective, DefaultLocaleConfig, LOCALE_CONFIG, LocaleService, NgxDateRangePickerMd };
//# sourceMappingURL=ngx-daterangepicker-material.js.map
