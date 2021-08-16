import { ChangeDetectorRef, Component, ElementRef, EventEmitter, forwardRef, Input, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as _moment from 'moment';
import { LocaleService } from '../services/locale.service';
const moment = _moment;
export var SideEnum;
(function (SideEnum) {
    SideEnum["left"] = "left";
    SideEnum["right"] = "right";
})(SideEnum || (SideEnum = {}));
export class DateRangePickerComponent {
    constructor(el, _ref, _localeService) {
        this.el = el;
        this._ref = _ref;
        this._localeService = _localeService;
        this._old = { start: null, end: null };
        this.calendarVariables = { left: {}, right: {} };
        this.timepickerVariables = { left: {}, right: {} };
        this.daterangepicker = { start: new FormControl(), end: new FormControl() };
        this.applyBtn = { disabled: false };
        this.startDate = moment().startOf('day');
        this.endDate = moment().endOf('day');
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
        this.leftCalendar = { month: moment() };
        this.rightCalendar = { month: moment().add(1, 'month') };
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
        const daysInMonth = moment([year, month]).daysInMonth();
        const firstDay = moment([year, month, 1]);
        const lastDay = moment([year, month, daysInMonth]);
        const lastMonth = moment(firstDay)
            .subtract(1, 'month')
            .month();
        const lastYear = moment(firstDay)
            .subtract(1, 'month')
            .year();
        const daysInLastMonth = moment([lastYear, lastMonth]).daysInMonth();
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
        let curDate = moment([lastYear, lastMonth, startDay, 12, minute, second]);
        for (let i = 0, col = 0, row = 0; i < 42; i++, col++, curDate = moment(curDate).add(24, 'hour')) {
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
            const realCurrentYear = moment().year();
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
            this.startDate = moment(startDate, this.locale.format);
        }
        if (typeof startDate === 'object') {
            this.startDate = moment(startDate);
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
            this.endDate = moment(endDate, this.locale.format);
        }
        if (typeof endDate === 'object') {
            this.endDate = moment(endDate);
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
        this.startDate = moment().startOf('day');
        this.endDate = moment().endOf('day');
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
                this.locale.format = moment.localeData().longDateFormat('lll');
            }
            else {
                this.locale.format = moment.localeData().longDateFormat('L');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1yYW5nZS1waWNrZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IkQ6L2RldmVsb3BtZW50L2FjY2Vzc28vYXBwbGljYXRpb25zL25neC1kYXRlcmFuZ2VwaWNrZXItbWF0ZXJpYWwvc3JjL2RhdGVyYW5nZXBpY2tlci8iLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvZGF0ZS1yYW5nZS1waWNrZXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTixpQkFBaUIsRUFDakIsU0FBUyxFQUNULFVBQVUsRUFDVixZQUFZLEVBQ1osVUFBVSxFQUNWLEtBQUssRUFFTCxNQUFNLEVBQ04sU0FBUyxFQUNULGlCQUFpQixFQUNqQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsV0FBVyxFQUFFLGlCQUFpQixFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFFOUQsT0FBTyxLQUFLLE9BQU8sTUFBTSxRQUFRLENBQUM7QUFHbEMsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLDRCQUE0QixDQUFDO0FBRXpELE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQztBQUV2QixNQUFNLENBQU4sSUFBWSxRQUdYO0FBSEQsV0FBWSxRQUFRO0lBQ25CLHlCQUFhLENBQUE7SUFDYiwyQkFBZSxDQUFBO0FBQ2hCLENBQUMsRUFIVyxRQUFRLEtBQVIsUUFBUSxRQUduQjtBQW9CRCxNQUFNLE9BQU8sd0JBQXdCO0lBZ0JwQyxZQUFvQixFQUFjLEVBQVUsSUFBdUIsRUFBVSxjQUE2QjtRQUF0RixPQUFFLEdBQUYsRUFBRSxDQUFZO1FBQVUsU0FBSSxHQUFKLElBQUksQ0FBbUI7UUFBVSxtQkFBYyxHQUFkLGNBQWMsQ0FBZTtRQU9sRyxTQUFJLEdBQTZCLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLENBQUM7UUFFcEUsc0JBQWlCLEdBQThCLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsRUFB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QWlCLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFOzRCQXlhN0MsS0FBSzsyQkFJTCxLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcclxuXHRDaGFuZ2VEZXRlY3RvclJlZixcclxuXHRDb21wb25lbnQsXHJcblx0RWxlbWVudFJlZixcclxuXHRFdmVudEVtaXR0ZXIsXHJcblx0Zm9yd2FyZFJlZixcclxuXHRJbnB1dCxcclxuXHRPbkluaXQsXHJcblx0T3V0cHV0LFxyXG5cdFZpZXdDaGlsZCxcclxuXHRWaWV3RW5jYXBzdWxhdGlvblxyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge0Zvcm1Db250cm9sLCBOR19WQUxVRV9BQ0NFU1NPUn0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xyXG5cclxuaW1wb3J0ICogYXMgX21vbWVudCBmcm9tICdtb21lbnQnO1xyXG5pbXBvcnQgeyBEYXRlUmFuZ2VQcmVzZXQgfSBmcm9tICcuLi9kYXRlLXJhbmdlLXBpY2tlci5tb2RlbHMnO1xyXG5pbXBvcnQge0xvY2FsZUNvbmZpZ30gZnJvbSAnLi4vZGF0ZS1yYW5nZS1waWNrZXIuY29uZmlnJztcclxuaW1wb3J0IHtMb2NhbGVTZXJ2aWNlfSBmcm9tICcuLi9zZXJ2aWNlcy9sb2NhbGUuc2VydmljZSc7XHJcblxyXG5jb25zdCBtb21lbnQgPSBfbW9tZW50O1xyXG5cclxuZXhwb3J0IGVudW0gU2lkZUVudW0ge1xyXG5cdGxlZnQgPSAnbGVmdCcsXHJcblx0cmlnaHQgPSAncmlnaHQnXHJcbn1cclxuXHJcbkBDb21wb25lbnQoe1xyXG5cdC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpjb21wb25lbnQtc2VsZWN0b3JcclxuXHRzZWxlY3RvcjogJ25neC1kYXRlcmFuZ2VwaWNrZXItbWF0ZXJpYWwnLFxyXG5cdHN0eWxlVXJsczogWycuL2RhdGUtcmFuZ2UtcGlja2VyLmNvbXBvbmVudC5zY3NzJ10sXHJcblx0dGVtcGxhdGVVcmw6ICcuL2RhdGUtcmFuZ2UtcGlja2VyLmNvbXBvbmVudC5odG1sJyxcclxuXHQvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8taG9zdC1tZXRhZGF0YS1wcm9wZXJ0eVxyXG5cdGhvc3Q6IHtcclxuXHRcdCcoY2xpY2spJzogJ2hhbmRsZUludGVybmFsQ2xpY2soJGV2ZW50KSdcclxuXHR9LFxyXG5cdGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXHJcblx0cHJvdmlkZXJzOiBbXHJcblx0XHR7XHJcblx0XHRcdHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxyXG5cdFx0XHR1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBEYXRlUmFuZ2VQaWNrZXJDb21wb25lbnQpLFxyXG5cdFx0XHRtdWx0aTogdHJ1ZVxyXG5cdFx0fVxyXG5cdF1cclxufSlcclxuZXhwb3J0IGNsYXNzIERhdGVSYW5nZVBpY2tlckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcblx0QElucHV0KCkgc2V0IGxvY2FsZSh2YWx1ZSkge1xyXG5cdFx0dGhpcy5fbG9jYWxlID0geyAuLi50aGlzLl9sb2NhbGVTZXJ2aWNlLmNvbmZpZywgLi4udmFsdWUgfTtcclxuXHR9XHJcblx0Z2V0IGxvY2FsZSgpOiBMb2NhbGVDb25maWcge1xyXG5cdFx0cmV0dXJuIHRoaXMuX2xvY2FsZTtcclxuXHR9XHJcblxyXG5cdEBJbnB1dCgpIHNldCByYW5nZXModmFsdWU6IERhdGVSYW5nZVByZXNldFtdKSB7XHJcblx0XHR0aGlzLl9yYW5nZXMgPSB2YWx1ZTtcclxuXHRcdHRoaXMucmVuZGVyUmFuZ2VzKCk7XHJcblx0fVxyXG5cdGdldCByYW5nZXMoKTogRGF0ZVJhbmdlUHJlc2V0W10ge1xyXG5cdFx0cmV0dXJuIHRoaXMuX3JhbmdlcztcclxuXHR9XHJcblxyXG5cdGNvbnN0cnVjdG9yKHByaXZhdGUgZWw6IEVsZW1lbnRSZWYsIHByaXZhdGUgX3JlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsIHByaXZhdGUgX2xvY2FsZVNlcnZpY2U6IExvY2FsZVNlcnZpY2UpIHtcclxuXHRcdHRoaXMuY2hvb3NlZERhdGUgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblx0XHR0aGlzLnJhbmdlQ2xpY2tlZCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHRcdHRoaXMuZGF0ZXNVcGRhdGVkID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cdFx0dGhpcy5zdGFydERhdGVDaGFuZ2VkID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cdFx0dGhpcy5lbmREYXRlQ2hhbmdlZCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHR9XHJcblx0cHJpdmF0ZSBfb2xkOiB7IHN0YXJ0OiBhbnk7IGVuZDogYW55IH0gPSB7IHN0YXJ0OiBudWxsLCBlbmQ6IG51bGwgfTtcclxuXHRjaG9zZW5MYWJlbDogc3RyaW5nO1xyXG5cdGNhbGVuZGFyVmFyaWFibGVzOiB7IGxlZnQ6IGFueTsgcmlnaHQ6IGFueSB9ID0geyBsZWZ0OiB7fSwgcmlnaHQ6IHt9IH07XHJcblx0dGltZXBpY2tlclZhcmlhYmxlczogeyBsZWZ0OiBhbnk7IHJpZ2h0OiBhbnkgfSA9IHsgbGVmdDoge30sIHJpZ2h0OiB7fSB9O1xyXG5cdGRhdGVyYW5nZXBpY2tlcjogeyBzdGFydDogRm9ybUNvbnRyb2w7IGVuZDogRm9ybUNvbnRyb2wgfSA9IHsgc3RhcnQ6IG5ldyBGb3JtQ29udHJvbCgpLCBlbmQ6IG5ldyBGb3JtQ29udHJvbCgpIH07XHJcblx0YXBwbHlCdG46IHsgZGlzYWJsZWQ6IGJvb2xlYW4gfSA9IHsgZGlzYWJsZWQ6IGZhbHNlIH07XHJcblx0QElucHV0KClcclxuXHRzdGFydERhdGUgPSBtb21lbnQoKS5zdGFydE9mKCdkYXknKTtcclxuXHRASW5wdXQoKVxyXG5cdGVuZERhdGUgPSBtb21lbnQoKS5lbmRPZignZGF5Jyk7XHJcblxyXG5cdEBJbnB1dCgpXHJcblx0ZGF0ZUxpbWl0OiBudW1iZXIgPSBudWxsO1xyXG5cdC8vIHVzZWQgaW4gdGVtcGxhdGUgZm9yIGNvbXBpbGUgdGltZSBzdXBwb3J0IG9mIGVudW0gdmFsdWVzLlxyXG5cdHNpZGVFbnVtID0gU2lkZUVudW07XHJcblx0QElucHV0KClcclxuXHRtaW5EYXRlOiBfbW9tZW50Lk1vbWVudCA9IG51bGw7XHJcblx0QElucHV0KClcclxuXHRtYXhEYXRlOiBfbW9tZW50Lk1vbWVudCA9IG51bGw7XHJcblx0QElucHV0KClcclxuXHRhdXRvQXBwbHk6IEJvb2xlYW4gPSBmYWxzZTtcclxuXHRASW5wdXQoKVxyXG5cdHNpbmdsZURhdGVQaWNrZXI6IEJvb2xlYW4gPSBmYWxzZTtcclxuXHRASW5wdXQoKVxyXG5cdHNob3dEcm9wZG93bnM6IEJvb2xlYW4gPSBmYWxzZTtcclxuXHRASW5wdXQoKVxyXG5cdHNob3dXZWVrTnVtYmVyczogQm9vbGVhbiA9IGZhbHNlO1xyXG5cdEBJbnB1dCgpXHJcblx0c2hvd0lTT1dlZWtOdW1iZXJzOiBCb29sZWFuID0gZmFsc2U7XHJcblx0QElucHV0KClcclxuXHRsaW5rZWRDYWxlbmRhcnM6IEJvb2xlYW4gPSAhdGhpcy5zaW5nbGVEYXRlUGlja2VyO1xyXG5cdEBJbnB1dCgpXHJcblx0YXV0b1VwZGF0ZUlucHV0OiBCb29sZWFuID0gdHJ1ZTtcclxuXHRASW5wdXQoKVxyXG5cdGFsd2F5c1Nob3dDYWxlbmRhcnM6IEJvb2xlYW4gPSBmYWxzZTtcclxuXHRASW5wdXQoKVxyXG5cdGxvY2tTdGFydERhdGU6IEJvb2xlYW4gPSBmYWxzZTtcclxuXHQvLyB0aW1lcGlja2VyIHZhcmlhYmxlc1xyXG5cdEBJbnB1dCgpXHJcblx0dGltZVBpY2tlcjogQm9vbGVhbiA9IGZhbHNlO1xyXG5cdEBJbnB1dCgpXHJcblx0dGltZVBpY2tlcjI0SG91cjogQm9vbGVhbiA9IGZhbHNlO1xyXG5cdEBJbnB1dCgpXHJcblx0dGltZVBpY2tlckluY3JlbWVudCA9IDE7XHJcblx0QElucHV0KClcclxuXHR0aW1lUGlja2VyU2Vjb25kczogQm9vbGVhbiA9IGZhbHNlO1xyXG5cdC8vIGVuZCBvZiB0aW1lcGlja2VyIHZhcmlhYmxlc1xyXG5cdEBJbnB1dCgpXHJcblx0c2hvd0NsZWFyQnV0dG9uOiBCb29sZWFuID0gZmFsc2U7XHJcblx0QElucHV0KClcclxuXHRmaXJzdE1vbnRoRGF5Q2xhc3M6IHN0cmluZyA9IG51bGw7XHJcblx0QElucHV0KClcclxuXHRsYXN0TW9udGhEYXlDbGFzczogc3RyaW5nID0gbnVsbDtcclxuXHRASW5wdXQoKVxyXG5cdGVtcHR5V2Vla1Jvd0NsYXNzOiBzdHJpbmcgPSBudWxsO1xyXG5cdEBJbnB1dCgpXHJcblx0Zmlyc3REYXlPZk5leHRNb250aENsYXNzOiBzdHJpbmcgPSBudWxsO1xyXG5cdEBJbnB1dCgpXHJcblx0bGFzdERheU9mUHJldmlvdXNNb250aENsYXNzOiBzdHJpbmcgPSBudWxsO1xyXG5cdEBJbnB1dCgpXHJcblx0YnV0dG9uQ2xhc3NBcHBseTogc3RyaW5nID0gbnVsbDtcclxuXHRASW5wdXQoKVxyXG5cdGJ1dHRvbkNsYXNzUmVzZXQ6IHN0cmluZyA9IG51bGw7XHJcblx0QElucHV0KClcclxuXHRidXR0b25DbGFzc1JhbmdlOiBzdHJpbmcgPSBudWxsO1xyXG5cdEBJbnB1dCgpXHJcblx0aXNGdWxsU2NyZWVuUGlja2VyOiBib29sZWFuO1xyXG5cclxuXHRfbG9jYWxlOiBMb2NhbGVDb25maWcgPSB7fTtcclxuXHQvLyBjdXN0b20gcmFuZ2VzXHJcblx0X3JhbmdlczogRGF0ZVJhbmdlUHJlc2V0W10gPSBbXTtcclxuXHJcblx0QElucHV0KClcclxuXHRzaG93Q3VzdG9tUmFuZ2VMYWJlbDogYm9vbGVhbjtcclxuXHRASW5wdXQoKVxyXG5cdHNob3dDYW5jZWwgPSBmYWxzZTtcclxuXHRASW5wdXQoKVxyXG5cdGtlZXBDYWxlbmRhck9wZW5pbmdXaXRoUmFuZ2UgPSBmYWxzZTtcclxuXHRASW5wdXQoKVxyXG5cdHNob3dSYW5nZUxhYmVsT25JbnB1dCA9IGZhbHNlO1xyXG5cdEBJbnB1dCgpXHJcblx0Y3VzdG9tUmFuZ2VEaXJlY3Rpb24gPSBmYWxzZTtcclxuXHRjaG9zZW5SYW5nZTogRGF0ZVJhbmdlUHJlc2V0O1xyXG5cclxuXHQvLyBzb21lIHN0YXRlIGluZm9ybWF0aW9uXHJcblx0aXNTaG93bjogQm9vbGVhbiA9IGZhbHNlO1xyXG5cdGlubGluZSA9IHRydWU7XHJcblx0bGVmdENhbGVuZGFyOiBhbnkgPSB7IG1vbnRoOiBtb21lbnQoKSB9O1xyXG5cdHJpZ2h0Q2FsZW5kYXI6IGFueSA9IHsgbW9udGg6IG1vbWVudCgpLmFkZCgxLCAnbW9udGgnKSB9O1xyXG5cdHNob3dDYWxJblJhbmdlczogQm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuXHRvcHRpb25zOiBhbnkgPSB7fTsgLy8gc2hvdWxkIGdldCBzb21lIG9wdCBmcm9tIHVzZXJcclxuXHRASW5wdXQoKSBkcm9wczogc3RyaW5nO1xyXG5cdEBJbnB1dCgpIG9wZW5zOiBzdHJpbmc7XHJcblx0QElucHV0KCkgY2xvc2VPbkF1dG9BcHBseSA9IHRydWU7XHJcblx0QE91dHB1dCgpIGNob29zZWREYXRlOiBFdmVudEVtaXR0ZXI8T2JqZWN0PjtcclxuXHRAT3V0cHV0KCkgcmFuZ2VDbGlja2VkOiBFdmVudEVtaXR0ZXI8T2JqZWN0PjtcclxuXHRAT3V0cHV0KCkgZGF0ZXNVcGRhdGVkOiBFdmVudEVtaXR0ZXI8T2JqZWN0PjtcclxuXHRAT3V0cHV0KCkgc3RhcnREYXRlQ2hhbmdlZDogRXZlbnRFbWl0dGVyPE9iamVjdD47XHJcblx0QE91dHB1dCgpIGVuZERhdGVDaGFuZ2VkOiBFdmVudEVtaXR0ZXI8T2JqZWN0PjtcclxuXHQvLyBAdHMtaWdub3JlXHJcblx0QFZpZXdDaGlsZCgncGlja2VyQ29udGFpbmVyJywgeyBzdGF0aWM6IHRydWUgfSkgcGlja2VyQ29udGFpbmVyOiBFbGVtZW50UmVmO1xyXG5cdCRldmVudDogYW55O1xyXG5cclxuXHRuZ09uSW5pdCgpIHtcclxuXHRcdHRoaXMuX2J1aWxkTG9jYWxlKCk7XHJcblx0XHRjb25zdCBkYXlzT2ZXZWVrID0gWy4uLnRoaXMubG9jYWxlLmRheXNPZldlZWtdO1xyXG5cdFx0aWYgKHRoaXMubG9jYWxlLmZpcnN0RGF5ICE9PSAwKSB7XHJcblx0XHRcdGxldCBpdGVyYXRvciA9IHRoaXMubG9jYWxlLmZpcnN0RGF5O1xyXG5cclxuXHRcdFx0d2hpbGUgKGl0ZXJhdG9yID4gMCkge1xyXG5cdFx0XHRcdGRheXNPZldlZWsucHVzaChkYXlzT2ZXZWVrLnNoaWZ0KCkpO1xyXG5cdFx0XHRcdGl0ZXJhdG9yLS07XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHRoaXMubG9jYWxlLmRheXNPZldlZWsgPSBkYXlzT2ZXZWVrO1xyXG5cdFx0aWYgKHRoaXMuaW5saW5lKSB7XHJcblx0XHRcdHRoaXMuX29sZC5zdGFydCA9IHRoaXMuc3RhcnREYXRlLmNsb25lKCk7XHJcblx0XHRcdHRoaXMuX29sZC5lbmQgPSB0aGlzLmVuZERhdGUuY2xvbmUoKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAodGhpcy5zdGFydERhdGUgJiYgdGhpcy50aW1lUGlja2VyKSB7XHJcblx0XHRcdHRoaXMuc2V0U3RhcnREYXRlKHRoaXMuc3RhcnREYXRlKTtcclxuXHRcdFx0dGhpcy5yZW5kZXJUaW1lUGlja2VyKFNpZGVFbnVtLmxlZnQpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICh0aGlzLmVuZERhdGUgJiYgdGhpcy50aW1lUGlja2VyKSB7XHJcblx0XHRcdHRoaXMuc2V0RW5kRGF0ZSh0aGlzLmVuZERhdGUpO1xyXG5cdFx0XHR0aGlzLnJlbmRlclRpbWVQaWNrZXIoU2lkZUVudW0ucmlnaHQpO1xyXG5cdFx0fVxyXG5cdFx0dGhpcy51cGRhdGVNb250aHNJblZpZXcoKTtcclxuXHRcdHRoaXMucmVuZGVyQ2FsZW5kYXIoU2lkZUVudW0ubGVmdCk7XHJcblx0XHR0aGlzLnJlbmRlckNhbGVuZGFyKFNpZGVFbnVtLnJpZ2h0KTtcclxuXHRcdHRoaXMucmVuZGVyUmFuZ2VzKCk7XHJcblx0fVxyXG5cclxuXHRyZW5kZXJSYW5nZXMoKSB7XHJcblx0XHRsZXQgc3RhcnQsIGVuZDtcclxuXHRcdHRoaXMucmFuZ2VzLmZvckVhY2gocHJlc2V0ID0+IHtcclxuXHRcdFx0c3RhcnQgPSBwcmVzZXQucmFuZ2Uuc3RhcnQ7XHJcblx0XHRcdGVuZCA9IHByZXNldC5yYW5nZS5lbmQ7XHJcblx0XHRcdC8vIElmIHRoZSBzdGFydCBvciBlbmQgZGF0ZSBleGNlZWQgdGhvc2UgYWxsb3dlZCBieSB0aGUgbWluRGF0ZVxyXG5cdFx0XHQvLyBvcHRpb24sIHNob3J0ZW4gdGhlIHJhbmdlIHRvIHRoZSBhbGxvd2FibGUgcGVyaW9kLlxyXG5cdFx0XHRpZiAodGhpcy5taW5EYXRlICYmIHN0YXJ0LmlzQmVmb3JlKHRoaXMubWluRGF0ZSkpIHtcclxuXHRcdFx0XHRzdGFydCA9IHRoaXMubWluRGF0ZS5jbG9uZSgpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGNvbnN0IG1heERhdGUgPSB0aGlzLm1heERhdGU7XHJcblx0XHRcdGlmIChtYXhEYXRlICYmIGVuZC5pc0FmdGVyKG1heERhdGUpKSB7XHJcblx0XHRcdFx0ZW5kID0gbWF4RGF0ZS5jbG9uZSgpO1xyXG5cdFx0XHR9XHJcblx0XHRcdC8vIElmIHRoZSBlbmQgb2YgdGhlIHJhbmdlIGlzIGJlZm9yZSB0aGUgbWluaW11bSBvciB0aGUgc3RhcnQgb2YgdGhlIHJhbmdlIGlzXHJcblx0XHRcdC8vIGFmdGVyIHRoZSBtYXhpbXVtLCBkb24ndCBkaXNwbGF5IHRoaXMgcmFuZ2Ugb3B0aW9uIGF0IGFsbC5cclxuXHRcdFx0aWYgKFxyXG5cdFx0XHRcdCh0aGlzLm1pbkRhdGUgJiYgZW5kLmlzQmVmb3JlKHRoaXMubWluRGF0ZSwgdGhpcy50aW1lUGlja2VyID8gJ21pbnV0ZScgOiAnZGF5JykpIHx8XHJcblx0XHRcdFx0KG1heERhdGUgJiYgZW5kLmlzQWZ0ZXIobWF4RGF0ZSwgdGhpcy50aW1lUGlja2VyID8gJ21pbnV0ZScgOiAnZGF5JykpXHJcblx0XHRcdCkge1xyXG5cdFx0XHRcdC8vIGNvbnRpbnVlO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdC8vIFN1cHBvcnQgdW5pY29kZSBjaGFycyBpbiB0aGUgcmFuZ2UgbmFtZXMuXHJcblx0XHRcdFx0Y29uc3QgZWxlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RleHRhcmVhJyk7XHJcblx0XHRcdFx0ZWxlbS5pbm5lckhUTUwgPSBwcmVzZXQubGFiZWw7XHJcblx0XHRcdFx0cHJlc2V0LmxhYmVsID0gIGVsZW0udmFsdWU7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cclxuXHRcdHRoaXMuc2hvd0NhbEluUmFuZ2VzID0gdHJ1ZTtcclxuXHRcdGlmICghdGhpcy50aW1lUGlja2VyKSB7XHJcblx0XHRcdHRoaXMuc3RhcnREYXRlID0gdGhpcy5zdGFydERhdGUuc3RhcnRPZignZGF5Jyk7XHJcblx0XHRcdHRoaXMuZW5kRGF0ZSA9IHRoaXMuZW5kRGF0ZS5lbmRPZignZGF5Jyk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRyZW5kZXJUaW1lUGlja2VyKHNpZGU6IFNpZGVFbnVtKSB7XHJcblx0XHRpZiAoc2lkZSA9PT0gU2lkZUVudW0ucmlnaHQgJiYgIXRoaXMuZW5kRGF0ZSkge1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblx0XHRsZXQgc2VsZWN0ZWQsIG1pbkRhdGU7XHJcblx0XHRjb25zdCBtYXhEYXRlID0gdGhpcy5tYXhEYXRlO1xyXG5cdFx0aWYgKHNpZGUgPT09IFNpZGVFbnVtLmxlZnQpIHtcclxuXHRcdFx0KHNlbGVjdGVkID0gdGhpcy5zdGFydERhdGUuY2xvbmUoKSksIChtaW5EYXRlID0gdGhpcy5taW5EYXRlKTtcclxuXHRcdH0gZWxzZSBpZiAoc2lkZSA9PT0gU2lkZUVudW0ucmlnaHQpIHtcclxuXHRcdFx0KHNlbGVjdGVkID0gdGhpcy5lbmREYXRlLmNsb25lKCkpLCAobWluRGF0ZSA9IHRoaXMuc3RhcnREYXRlKTtcclxuXHRcdH1cclxuXHRcdGNvbnN0IHN0YXJ0ID0gdGhpcy50aW1lUGlja2VyMjRIb3VyID8gMCA6IDE7XHJcblx0XHRjb25zdCBlbmQgPSB0aGlzLnRpbWVQaWNrZXIyNEhvdXIgPyAyMyA6IDEyO1xyXG5cdFx0dGhpcy50aW1lcGlja2VyVmFyaWFibGVzW3NpZGVdID0ge1xyXG5cdFx0XHRob3VyczogW10sXHJcblx0XHRcdG1pbnV0ZXM6IFtdLFxyXG5cdFx0XHRtaW51dGVzTGFiZWw6IFtdLFxyXG5cdFx0XHRzZWNvbmRzOiBbXSxcclxuXHRcdFx0c2Vjb25kc0xhYmVsOiBbXSxcclxuXHRcdFx0ZGlzYWJsZWRIb3VyczogW10sXHJcblx0XHRcdGRpc2FibGVkTWludXRlczogW10sXHJcblx0XHRcdGRpc2FibGVkU2Vjb25kczogW10sXHJcblx0XHRcdHNlbGVjdGVkSG91cjogMCxcclxuXHRcdFx0c2VsZWN0ZWRNaW51dGU6IDAsXHJcblx0XHRcdHNlbGVjdGVkU2Vjb25kOiAwXHJcblx0XHR9O1xyXG5cdFx0Ly8gZ2VuZXJhdGUgaG91cnNcclxuXHRcdGZvciAobGV0IGkgPSBzdGFydDsgaSA8PSBlbmQ7IGkrKykge1xyXG5cdFx0XHRsZXQgaV9pbl8yNCA9IGk7XHJcblx0XHRcdGlmICghdGhpcy50aW1lUGlja2VyMjRIb3VyKSB7XHJcblx0XHRcdFx0aV9pbl8yNCA9IHNlbGVjdGVkLmhvdXIoKSA+PSAxMiA/IChpID09PSAxMiA/IDEyIDogaSArIDEyKSA6IGkgPT09IDEyID8gMCA6IGk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGNvbnN0IHRpbWUgPSBzZWxlY3RlZC5jbG9uZSgpLmhvdXIoaV9pbl8yNCk7XHJcblx0XHRcdGxldCBkaXNhYmxlZCA9IGZhbHNlO1xyXG5cdFx0XHRpZiAobWluRGF0ZSAmJiB0aW1lLm1pbnV0ZSg1OSkuaXNCZWZvcmUobWluRGF0ZSkpIHtcclxuXHRcdFx0XHRkaXNhYmxlZCA9IHRydWU7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKG1heERhdGUgJiYgdGltZS5taW51dGUoMCkuaXNBZnRlcihtYXhEYXRlKSkge1xyXG5cdFx0XHRcdGRpc2FibGVkID0gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy50aW1lcGlja2VyVmFyaWFibGVzW3NpZGVdLmhvdXJzLnB1c2goaSk7XHJcblx0XHRcdGlmIChpX2luXzI0ID09PSBzZWxlY3RlZC5ob3VyKCkgJiYgIWRpc2FibGVkKSB7XHJcblx0XHRcdFx0dGhpcy50aW1lcGlja2VyVmFyaWFibGVzW3NpZGVdLnNlbGVjdGVkSG91ciA9IGk7XHJcblx0XHRcdH0gZWxzZSBpZiAoZGlzYWJsZWQpIHtcclxuXHRcdFx0XHR0aGlzLnRpbWVwaWNrZXJWYXJpYWJsZXNbc2lkZV0uZGlzYWJsZWRIb3Vycy5wdXNoKGkpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHQvLyBnZW5lcmF0ZSBtaW51dGVzXHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IDYwOyBpICs9IHRoaXMudGltZVBpY2tlckluY3JlbWVudCkge1xyXG5cdFx0XHRjb25zdCBwYWRkZWQgPSBpIDwgMTAgPyAnMCcgKyBpIDogaTtcclxuXHRcdFx0Y29uc3QgdGltZSA9IHNlbGVjdGVkLmNsb25lKCkubWludXRlKGkpO1xyXG5cclxuXHRcdFx0bGV0IGRpc2FibGVkID0gZmFsc2U7XHJcblx0XHRcdGlmIChtaW5EYXRlICYmIHRpbWUuc2Vjb25kKDU5KS5pc0JlZm9yZShtaW5EYXRlKSkge1xyXG5cdFx0XHRcdGRpc2FibGVkID0gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAobWF4RGF0ZSAmJiB0aW1lLnNlY29uZCgwKS5pc0FmdGVyKG1heERhdGUpKSB7XHJcblx0XHRcdFx0ZGlzYWJsZWQgPSB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHRcdHRoaXMudGltZXBpY2tlclZhcmlhYmxlc1tzaWRlXS5taW51dGVzLnB1c2goaSk7XHJcblx0XHRcdHRoaXMudGltZXBpY2tlclZhcmlhYmxlc1tzaWRlXS5taW51dGVzTGFiZWwucHVzaChwYWRkZWQpO1xyXG5cdFx0XHRpZiAoc2VsZWN0ZWQubWludXRlKCkgPT09IGkgJiYgIWRpc2FibGVkKSB7XHJcblx0XHRcdFx0dGhpcy50aW1lcGlja2VyVmFyaWFibGVzW3NpZGVdLnNlbGVjdGVkTWludXRlID0gaTtcclxuXHRcdFx0fSBlbHNlIGlmIChkaXNhYmxlZCkge1xyXG5cdFx0XHRcdHRoaXMudGltZXBpY2tlclZhcmlhYmxlc1tzaWRlXS5kaXNhYmxlZE1pbnV0ZXMucHVzaChpKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0Ly8gZ2VuZXJhdGUgc2Vjb25kc1xyXG5cdFx0aWYgKHRoaXMudGltZVBpY2tlclNlY29uZHMpIHtcclxuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCA2MDsgaSsrKSB7XHJcblx0XHRcdFx0Y29uc3QgcGFkZGVkID0gaSA8IDEwID8gJzAnICsgaSA6IGk7XHJcblx0XHRcdFx0Y29uc3QgdGltZSA9IHNlbGVjdGVkLmNsb25lKCkuc2Vjb25kKGkpO1xyXG5cclxuXHRcdFx0XHRsZXQgZGlzYWJsZWQgPSBmYWxzZTtcclxuXHRcdFx0XHRpZiAobWluRGF0ZSAmJiB0aW1lLmlzQmVmb3JlKG1pbkRhdGUpKSB7XHJcblx0XHRcdFx0XHRkaXNhYmxlZCA9IHRydWU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmIChtYXhEYXRlICYmIHRpbWUuaXNBZnRlcihtYXhEYXRlKSkge1xyXG5cdFx0XHRcdFx0ZGlzYWJsZWQgPSB0cnVlO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0dGhpcy50aW1lcGlja2VyVmFyaWFibGVzW3NpZGVdLnNlY29uZHMucHVzaChpKTtcclxuXHRcdFx0XHR0aGlzLnRpbWVwaWNrZXJWYXJpYWJsZXNbc2lkZV0uc2Vjb25kc0xhYmVsLnB1c2gocGFkZGVkKTtcclxuXHRcdFx0XHRpZiAoc2VsZWN0ZWQuc2Vjb25kKCkgPT09IGkgJiYgIWRpc2FibGVkKSB7XHJcblx0XHRcdFx0XHR0aGlzLnRpbWVwaWNrZXJWYXJpYWJsZXNbc2lkZV0uc2VsZWN0ZWRTZWNvbmQgPSBpO1xyXG5cdFx0XHRcdH0gZWxzZSBpZiAoZGlzYWJsZWQpIHtcclxuXHRcdFx0XHRcdHRoaXMudGltZXBpY2tlclZhcmlhYmxlc1tzaWRlXS5kaXNhYmxlZFNlY29uZHMucHVzaChpKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdC8vIGdlbmVyYXRlIEFNL1BNXHJcblx0XHRpZiAoIXRoaXMudGltZVBpY2tlcjI0SG91cikge1xyXG5cdFx0XHRpZiAoXHJcblx0XHRcdFx0bWluRGF0ZSAmJlxyXG5cdFx0XHRcdHNlbGVjdGVkXHJcblx0XHRcdFx0XHQuY2xvbmUoKVxyXG5cdFx0XHRcdFx0LmhvdXIoMTIpXHJcblx0XHRcdFx0XHQubWludXRlKDApXHJcblx0XHRcdFx0XHQuc2Vjb25kKDApXHJcblx0XHRcdFx0XHQuaXNCZWZvcmUobWluRGF0ZSlcclxuXHRcdFx0KSB7XHJcblx0XHRcdFx0dGhpcy50aW1lcGlja2VyVmFyaWFibGVzW3NpZGVdLmFtRGlzYWJsZWQgPSB0cnVlO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoXHJcblx0XHRcdFx0bWF4RGF0ZSAmJlxyXG5cdFx0XHRcdHNlbGVjdGVkXHJcblx0XHRcdFx0XHQuY2xvbmUoKVxyXG5cdFx0XHRcdFx0LmhvdXIoMClcclxuXHRcdFx0XHRcdC5taW51dGUoMClcclxuXHRcdFx0XHRcdC5zZWNvbmQoMClcclxuXHRcdFx0XHRcdC5pc0FmdGVyKG1heERhdGUpXHJcblx0XHRcdCkge1xyXG5cdFx0XHRcdHRoaXMudGltZXBpY2tlclZhcmlhYmxlc1tzaWRlXS5wbURpc2FibGVkID0gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoc2VsZWN0ZWQuaG91cigpID49IDEyKSB7XHJcblx0XHRcdFx0dGhpcy50aW1lcGlja2VyVmFyaWFibGVzW3NpZGVdLmFtcG1Nb2RlbCA9ICdQTSc7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dGhpcy50aW1lcGlja2VyVmFyaWFibGVzW3NpZGVdLmFtcG1Nb2RlbCA9ICdBTSc7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHRoaXMudGltZXBpY2tlclZhcmlhYmxlc1tzaWRlXS5zZWxlY3RlZCA9IHNlbGVjdGVkO1xyXG5cdH1cclxuXHRyZW5kZXJDYWxlbmRhcihzaWRlOiBTaWRlRW51bSkge1xyXG5cdFx0Y29uc3QgbWFpbkNhbGVuZGFyOiBhbnkgPSBzaWRlID09PSBTaWRlRW51bS5sZWZ0ID8gdGhpcy5sZWZ0Q2FsZW5kYXIgOiB0aGlzLnJpZ2h0Q2FsZW5kYXI7XHJcblx0XHRjb25zdCBtb250aCA9IG1haW5DYWxlbmRhci5tb250aC5tb250aCgpO1xyXG5cdFx0Y29uc3QgeWVhciA9IG1haW5DYWxlbmRhci5tb250aC55ZWFyKCk7XHJcblx0XHRjb25zdCBob3VyID0gbWFpbkNhbGVuZGFyLm1vbnRoLmhvdXIoKTtcclxuXHRcdGNvbnN0IG1pbnV0ZSA9IG1haW5DYWxlbmRhci5tb250aC5taW51dGUoKTtcclxuXHRcdGNvbnN0IHNlY29uZCA9IG1haW5DYWxlbmRhci5tb250aC5zZWNvbmQoKTtcclxuXHRcdGNvbnN0IGRheXNJbk1vbnRoID0gbW9tZW50KFt5ZWFyLCBtb250aF0pLmRheXNJbk1vbnRoKCk7XHJcblx0XHRjb25zdCBmaXJzdERheSA9IG1vbWVudChbeWVhciwgbW9udGgsIDFdKTtcclxuXHRcdGNvbnN0IGxhc3REYXkgPSBtb21lbnQoW3llYXIsIG1vbnRoLCBkYXlzSW5Nb250aF0pO1xyXG5cdFx0Y29uc3QgbGFzdE1vbnRoID0gbW9tZW50KGZpcnN0RGF5KVxyXG5cdFx0XHQuc3VidHJhY3QoMSwgJ21vbnRoJylcclxuXHRcdFx0Lm1vbnRoKCk7XHJcblx0XHRjb25zdCBsYXN0WWVhciA9IG1vbWVudChmaXJzdERheSlcclxuXHRcdFx0LnN1YnRyYWN0KDEsICdtb250aCcpXHJcblx0XHRcdC55ZWFyKCk7XHJcblx0XHRjb25zdCBkYXlzSW5MYXN0TW9udGggPSBtb21lbnQoW2xhc3RZZWFyLCBsYXN0TW9udGhdKS5kYXlzSW5Nb250aCgpO1xyXG5cdFx0Y29uc3QgZGF5T2ZXZWVrID0gZmlyc3REYXkuZGF5KCk7XHJcblx0XHQvLyBpbml0aWFsaXplIGEgNiByb3dzIHggNyBjb2x1bW5zIGFycmF5IGZvciB0aGUgY2FsZW5kYXJcclxuXHRcdGNvbnN0IGNhbGVuZGFyOiBhbnkgPSBbXTtcclxuXHRcdGNhbGVuZGFyLmZpcnN0RGF5ID0gZmlyc3REYXk7XHJcblx0XHRjYWxlbmRhci5sYXN0RGF5ID0gbGFzdERheTtcclxuXHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IDY7IGkrKykge1xyXG5cdFx0XHRjYWxlbmRhcltpXSA9IFtdO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHBvcHVsYXRlIHRoZSBjYWxlbmRhciB3aXRoIGRhdGUgb2JqZWN0c1xyXG5cdFx0bGV0IHN0YXJ0RGF5ID0gZGF5c0luTGFzdE1vbnRoIC0gZGF5T2ZXZWVrICsgdGhpcy5sb2NhbGUuZmlyc3REYXkgKyAxO1xyXG5cdFx0aWYgKHN0YXJ0RGF5ID4gZGF5c0luTGFzdE1vbnRoKSB7XHJcblx0XHRcdHN0YXJ0RGF5IC09IDc7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGRheU9mV2VlayA9PT0gdGhpcy5sb2NhbGUuZmlyc3REYXkpIHtcclxuXHRcdFx0c3RhcnREYXkgPSBkYXlzSW5MYXN0TW9udGggLSA2O1xyXG5cdFx0fVxyXG5cclxuXHRcdGxldCBjdXJEYXRlID0gbW9tZW50KFtsYXN0WWVhciwgbGFzdE1vbnRoLCBzdGFydERheSwgMTIsIG1pbnV0ZSwgc2Vjb25kXSk7XHJcblxyXG5cdFx0Zm9yIChsZXQgaSA9IDAsIGNvbCA9IDAsIHJvdyA9IDA7IGkgPCA0MjsgaSsrLCBjb2wrKywgY3VyRGF0ZSA9IG1vbWVudChjdXJEYXRlKS5hZGQoMjQsICdob3VyJykpIHtcclxuXHRcdFx0aWYgKGkgPiAwICYmIGNvbCAlIDcgPT09IDApIHtcclxuXHRcdFx0XHRjb2wgPSAwO1xyXG5cdFx0XHRcdHJvdysrO1xyXG5cdFx0XHR9XHJcblx0XHRcdGNhbGVuZGFyW3Jvd11bY29sXSA9IGN1ckRhdGVcclxuXHRcdFx0XHQuY2xvbmUoKVxyXG5cdFx0XHRcdC5ob3VyKGhvdXIpXHJcblx0XHRcdFx0Lm1pbnV0ZShtaW51dGUpXHJcblx0XHRcdFx0LnNlY29uZChzZWNvbmQpO1xyXG5cdFx0XHRjdXJEYXRlLmhvdXIoMTIpO1xyXG5cclxuXHRcdFx0aWYgKFxyXG5cdFx0XHRcdHRoaXMubWluRGF0ZSAmJlxyXG5cdFx0XHRcdGNhbGVuZGFyW3Jvd11bY29sXS5mb3JtYXQoJ1lZWVktTU0tREQnKSA9PT0gdGhpcy5taW5EYXRlLmZvcm1hdCgnWVlZWS1NTS1ERCcpICYmXHJcblx0XHRcdFx0Y2FsZW5kYXJbcm93XVtjb2xdLmlzQmVmb3JlKHRoaXMubWluRGF0ZSkgJiZcclxuXHRcdFx0XHRzaWRlID09PSAnbGVmdCdcclxuXHRcdFx0KSB7XHJcblx0XHRcdFx0Y2FsZW5kYXJbcm93XVtjb2xdID0gdGhpcy5taW5EYXRlLmNsb25lKCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmIChcclxuXHRcdFx0XHR0aGlzLm1heERhdGUgJiZcclxuXHRcdFx0XHRjYWxlbmRhcltyb3ddW2NvbF0uZm9ybWF0KCdZWVlZLU1NLUREJykgPT09IHRoaXMubWF4RGF0ZS5mb3JtYXQoJ1lZWVktTU0tREQnKSAmJlxyXG5cdFx0XHRcdGNhbGVuZGFyW3Jvd11bY29sXS5pc0FmdGVyKHRoaXMubWF4RGF0ZSkgJiZcclxuXHRcdFx0XHRzaWRlID09PSAncmlnaHQnXHJcblx0XHRcdCkge1xyXG5cdFx0XHRcdGNhbGVuZGFyW3Jvd11bY29sXSA9IHRoaXMubWF4RGF0ZS5jbG9uZSgpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gbWFrZSB0aGUgY2FsZW5kYXIgb2JqZWN0IGF2YWlsYWJsZSB0byBob3ZlckRhdGUvY2xpY2tEYXRlXHJcblx0XHRpZiAoc2lkZSA9PT0gU2lkZUVudW0ubGVmdCkge1xyXG5cdFx0XHR0aGlzLmxlZnRDYWxlbmRhci5jYWxlbmRhciA9IGNhbGVuZGFyO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGhpcy5yaWdodENhbGVuZGFyLmNhbGVuZGFyID0gY2FsZW5kYXI7XHJcblx0XHR9XHJcblx0XHQvL1xyXG5cdFx0Ly8gRGlzcGxheSB0aGUgY2FsZW5kYXJcclxuXHRcdC8vXHJcblx0XHRjb25zdCBtaW5EYXRlID0gc2lkZSA9PT0gJ2xlZnQnID8gdGhpcy5taW5EYXRlIDogdGhpcy5zdGFydERhdGUuY2xvbmUoKTtcclxuXHRcdGlmICh0aGlzLmxlZnRDYWxlbmRhci5tb250aCAmJiBtaW5EYXRlICYmIHRoaXMubGVmdENhbGVuZGFyLm1vbnRoLnllYXIoKSA8IG1pbkRhdGUueWVhcigpKSB7XHJcblx0XHRcdG1pbkRhdGUueWVhcih0aGlzLmxlZnRDYWxlbmRhci5tb250aC55ZWFyKCkpO1xyXG5cdFx0fVxyXG5cdFx0bGV0IG1heERhdGUgPSB0aGlzLm1heERhdGU7XHJcblx0XHQvLyBhZGp1c3QgbWF4RGF0ZSB0byByZWZsZWN0IHRoZSBkYXRlTGltaXQgc2V0dGluZyBpbiBvcmRlciB0b1xyXG5cdFx0Ly8gZ3JleSBvdXQgZW5kIGRhdGVzIGJleW9uZCB0aGUgZGF0ZUxpbWl0XHJcblx0XHRpZiAodGhpcy5lbmREYXRlID09PSBudWxsICYmIHRoaXMuZGF0ZUxpbWl0KSB7XHJcblx0XHRcdGNvbnN0IG1heExpbWl0ID0gdGhpcy5zdGFydERhdGVcclxuXHRcdFx0XHQuY2xvbmUoKVxyXG5cdFx0XHRcdC5hZGQodGhpcy5kYXRlTGltaXQsICdkYXknKVxyXG5cdFx0XHRcdC5lbmRPZignZGF5Jyk7XHJcblx0XHRcdGlmICghbWF4RGF0ZSB8fCBtYXhMaW1pdC5pc0JlZm9yZShtYXhEYXRlKSkge1xyXG5cdFx0XHRcdG1heERhdGUgPSBtYXhMaW1pdDtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0dGhpcy5jYWxlbmRhclZhcmlhYmxlc1tzaWRlXSA9IHtcclxuXHRcdFx0bW9udGg6IG1vbnRoLFxyXG5cdFx0XHR5ZWFyOiB5ZWFyLFxyXG5cdFx0XHRob3VyOiBob3VyLFxyXG5cdFx0XHRtaW51dGU6IG1pbnV0ZSxcclxuXHRcdFx0c2Vjb25kOiBzZWNvbmQsXHJcblx0XHRcdGRheXNJbk1vbnRoOiBkYXlzSW5Nb250aCxcclxuXHRcdFx0Zmlyc3REYXk6IGZpcnN0RGF5LFxyXG5cdFx0XHRsYXN0RGF5OiBsYXN0RGF5LFxyXG5cdFx0XHRsYXN0TW9udGg6IGxhc3RNb250aCxcclxuXHRcdFx0bGFzdFllYXI6IGxhc3RZZWFyLFxyXG5cdFx0XHRkYXlzSW5MYXN0TW9udGg6IGRheXNJbkxhc3RNb250aCxcclxuXHRcdFx0ZGF5T2ZXZWVrOiBkYXlPZldlZWssXHJcblx0XHRcdC8vIG90aGVyIHZhcnNcclxuXHRcdFx0Y2FsUm93czogQXJyYXkuZnJvbShBcnJheSg2KS5rZXlzKCkpLFxyXG5cdFx0XHRjYWxDb2xzOiBBcnJheS5mcm9tKEFycmF5KDcpLmtleXMoKSksXHJcblx0XHRcdGNsYXNzZXM6IHt9LFxyXG5cdFx0XHRtaW5EYXRlOiBtaW5EYXRlLFxyXG5cdFx0XHRtYXhEYXRlOiBtYXhEYXRlLFxyXG5cdFx0XHRjYWxlbmRhcjogY2FsZW5kYXJcclxuXHRcdH07XHJcblx0XHRpZiAodGhpcy5zaG93RHJvcGRvd25zKSB7XHJcblx0XHRcdGNvbnN0IGN1cnJlbnRNb250aCA9IGNhbGVuZGFyWzFdWzFdLm1vbnRoKCk7XHJcblx0XHRcdGNvbnN0IGN1cnJlbnRZZWFyID0gY2FsZW5kYXJbMV1bMV0ueWVhcigpO1xyXG5cdFx0XHRjb25zdCByZWFsQ3VycmVudFllYXIgPSBtb21lbnQoKS55ZWFyKCk7XHJcblx0XHRcdGNvbnN0IG1heFllYXIgPSAobWF4RGF0ZSAmJiBtYXhEYXRlLnllYXIoKSkgfHwgcmVhbEN1cnJlbnRZZWFyICsgNTtcclxuXHRcdFx0Y29uc3QgbWluWWVhciA9IChtaW5EYXRlICYmIG1pbkRhdGUueWVhcigpKSB8fCByZWFsQ3VycmVudFllYXIgLSAxMDA7XHJcblx0XHRcdGNvbnN0IGluTWluWWVhciA9IGN1cnJlbnRZZWFyID09PSBtaW5ZZWFyO1xyXG5cdFx0XHRjb25zdCBpbk1heFllYXIgPSBjdXJyZW50WWVhciA9PT0gbWF4WWVhcjtcclxuXHRcdFx0Y29uc3QgeWVhcnMgPSBbXTtcclxuXHRcdFx0Zm9yIChsZXQgeSA9IG1pblllYXI7IHkgPD0gbWF4WWVhcjsgeSsrKSB7XHJcblx0XHRcdFx0eWVhcnMucHVzaCh5KTtcclxuXHRcdFx0fVxyXG5cdFx0XHR0aGlzLmNhbGVuZGFyVmFyaWFibGVzW3NpZGVdLmRyb3Bkb3ducyA9IHtcclxuXHRcdFx0XHRjdXJyZW50TW9udGg6IGN1cnJlbnRNb250aCxcclxuXHRcdFx0XHRjdXJyZW50WWVhcjogY3VycmVudFllYXIsXHJcblx0XHRcdFx0bWF4WWVhcjogbWF4WWVhcixcclxuXHRcdFx0XHRtaW5ZZWFyOiBtaW5ZZWFyLFxyXG5cdFx0XHRcdGluTWluWWVhcjogaW5NaW5ZZWFyLFxyXG5cdFx0XHRcdGluTWF4WWVhcjogaW5NYXhZZWFyLFxyXG5cdFx0XHRcdG1vbnRoQXJyYXlzOiBBcnJheS5mcm9tKEFycmF5KDEyKS5rZXlzKCkpLFxyXG5cdFx0XHRcdHllYXJBcnJheXM6IHllYXJzXHJcblx0XHRcdH07XHJcblx0XHR9XHJcblx0XHR0aGlzLl9idWlsZENlbGxzKGNhbGVuZGFyLCBzaWRlKTtcclxuXHR9XHJcblx0c2V0U3RhcnREYXRlKHN0YXJ0RGF0ZSkge1xyXG5cdFx0aWYgKHR5cGVvZiBzdGFydERhdGUgPT09ICdzdHJpbmcnKSB7XHJcblx0XHRcdHRoaXMuc3RhcnREYXRlID0gbW9tZW50KHN0YXJ0RGF0ZSwgdGhpcy5sb2NhbGUuZm9ybWF0KTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAodHlwZW9mIHN0YXJ0RGF0ZSA9PT0gJ29iamVjdCcpIHtcclxuXHRcdFx0dGhpcy5zdGFydERhdGUgPSBtb21lbnQoc3RhcnREYXRlKTtcclxuXHRcdH1cclxuXHRcdGlmICghdGhpcy50aW1lUGlja2VyKSB7XHJcblx0XHRcdHRoaXMuc3RhcnREYXRlID0gdGhpcy5zdGFydERhdGUuc3RhcnRPZignZGF5Jyk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHRoaXMudGltZVBpY2tlciAmJiB0aGlzLnRpbWVQaWNrZXJJbmNyZW1lbnQpIHtcclxuXHRcdFx0dGhpcy5zdGFydERhdGUubWludXRlKFxyXG5cdFx0XHRcdE1hdGgucm91bmQodGhpcy5zdGFydERhdGUubWludXRlKCkgLyB0aGlzLnRpbWVQaWNrZXJJbmNyZW1lbnQpICogdGhpcy50aW1lUGlja2VySW5jcmVtZW50XHJcblx0XHRcdCk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHRoaXMubWluRGF0ZSAmJiB0aGlzLnN0YXJ0RGF0ZS5pc0JlZm9yZSh0aGlzLm1pbkRhdGUpKSB7XHJcblx0XHRcdHRoaXMuc3RhcnREYXRlID0gdGhpcy5taW5EYXRlLmNsb25lKCk7XHJcblx0XHRcdGlmICh0aGlzLnRpbWVQaWNrZXIgJiYgdGhpcy50aW1lUGlja2VySW5jcmVtZW50KSB7XHJcblx0XHRcdFx0dGhpcy5zdGFydERhdGUubWludXRlKFxyXG5cdFx0XHRcdFx0TWF0aC5yb3VuZCh0aGlzLnN0YXJ0RGF0ZS5taW51dGUoKSAvIHRoaXMudGltZVBpY2tlckluY3JlbWVudCkgKiB0aGlzLnRpbWVQaWNrZXJJbmNyZW1lbnRcclxuXHRcdFx0XHQpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHRoaXMubWF4RGF0ZSAmJiB0aGlzLnN0YXJ0RGF0ZS5pc0FmdGVyKHRoaXMubWF4RGF0ZSkpIHtcclxuXHRcdFx0dGhpcy5zdGFydERhdGUgPSB0aGlzLm1heERhdGUuY2xvbmUoKTtcclxuXHRcdFx0aWYgKHRoaXMudGltZVBpY2tlciAmJiB0aGlzLnRpbWVQaWNrZXJJbmNyZW1lbnQpIHtcclxuXHRcdFx0XHR0aGlzLnN0YXJ0RGF0ZS5taW51dGUoXHJcblx0XHRcdFx0XHRNYXRoLmZsb29yKHRoaXMuc3RhcnREYXRlLm1pbnV0ZSgpIC8gdGhpcy50aW1lUGlja2VySW5jcmVtZW50KSAqIHRoaXMudGltZVBpY2tlckluY3JlbWVudFxyXG5cdFx0XHRcdCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRpZiAoIXRoaXMuaXNTaG93bikge1xyXG5cdFx0XHR0aGlzLnVwZGF0ZUVsZW1lbnQoKTtcclxuXHRcdH1cclxuXHRcdHRoaXMuc3RhcnREYXRlQ2hhbmdlZC5lbWl0KHsgc3RhcnREYXRlOiB0aGlzLnN0YXJ0RGF0ZSB9KTtcclxuXHRcdHRoaXMudXBkYXRlTW9udGhzSW5WaWV3KCk7XHJcblx0fVxyXG5cclxuXHRzZXRFbmREYXRlKGVuZERhdGUpIHtcclxuXHRcdGlmICh0eXBlb2YgZW5kRGF0ZSA9PT0gJ3N0cmluZycpIHtcclxuXHRcdFx0dGhpcy5lbmREYXRlID0gbW9tZW50KGVuZERhdGUsIHRoaXMubG9jYWxlLmZvcm1hdCk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHR5cGVvZiBlbmREYXRlID09PSAnb2JqZWN0Jykge1xyXG5cdFx0XHR0aGlzLmVuZERhdGUgPSBtb21lbnQoZW5kRGF0ZSk7XHJcblx0XHR9XHJcblx0XHRpZiAoIXRoaXMudGltZVBpY2tlcikge1xyXG5cdFx0XHR0aGlzLmVuZERhdGUgPSB0aGlzLmVuZERhdGVcclxuXHRcdFx0XHQuYWRkKDEsICdkJylcclxuXHRcdFx0XHQuc3RhcnRPZignZGF5JylcclxuXHRcdFx0XHQuc3VidHJhY3QoMSwgJ3NlY29uZCcpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICh0aGlzLnRpbWVQaWNrZXIgJiYgdGhpcy50aW1lUGlja2VySW5jcmVtZW50KSB7XHJcblx0XHRcdHRoaXMuZW5kRGF0ZS5taW51dGUoXHJcblx0XHRcdFx0TWF0aC5yb3VuZCh0aGlzLmVuZERhdGUubWludXRlKCkgLyB0aGlzLnRpbWVQaWNrZXJJbmNyZW1lbnQpICogdGhpcy50aW1lUGlja2VySW5jcmVtZW50XHJcblx0XHRcdCk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHRoaXMuZW5kRGF0ZS5pc0JlZm9yZSh0aGlzLnN0YXJ0RGF0ZSkpIHtcclxuXHRcdFx0dGhpcy5lbmREYXRlID0gdGhpcy5zdGFydERhdGUuY2xvbmUoKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAodGhpcy5tYXhEYXRlICYmIHRoaXMuZW5kRGF0ZS5pc0FmdGVyKHRoaXMubWF4RGF0ZSkpIHtcclxuXHRcdFx0dGhpcy5lbmREYXRlID0gdGhpcy5tYXhEYXRlLmNsb25lKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKFxyXG5cdFx0XHR0aGlzLmRhdGVMaW1pdCAmJlxyXG5cdFx0XHR0aGlzLnN0YXJ0RGF0ZVxyXG5cdFx0XHRcdC5jbG9uZSgpXHJcblx0XHRcdFx0LmFkZCh0aGlzLmRhdGVMaW1pdCwgJ2RheScpXHJcblx0XHRcdFx0LmlzQmVmb3JlKHRoaXMuZW5kRGF0ZSlcclxuXHRcdCkge1xyXG5cdFx0XHR0aGlzLmVuZERhdGUgPSB0aGlzLnN0YXJ0RGF0ZS5jbG9uZSgpLmFkZCh0aGlzLmRhdGVMaW1pdCwgJ2RheScpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICghdGhpcy5pc1Nob3duKSB7XHJcblx0XHRcdC8vIHRoaXMudXBkYXRlRWxlbWVudCgpO1xyXG5cdFx0fVxyXG5cdFx0dGhpcy5lbmREYXRlQ2hhbmdlZC5lbWl0KHsgZW5kRGF0ZTogdGhpcy5lbmREYXRlIH0pO1xyXG5cdFx0dGhpcy51cGRhdGVNb250aHNJblZpZXcoKTtcclxuXHR9XHJcblx0QElucHV0KClcclxuXHRpc0ludmFsaWREYXRlKGRhdGUpIHtcclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9XHJcblx0QElucHV0KClcclxuXHRpc0N1c3RvbURhdGUoZGF0ZSkge1xyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH1cclxuXHJcblx0dXBkYXRlVmlldygpIHtcclxuXHRcdGlmICh0aGlzLnRpbWVQaWNrZXIpIHtcclxuXHRcdFx0dGhpcy5yZW5kZXJUaW1lUGlja2VyKFNpZGVFbnVtLmxlZnQpO1xyXG5cdFx0XHR0aGlzLnJlbmRlclRpbWVQaWNrZXIoU2lkZUVudW0ucmlnaHQpO1xyXG5cdFx0fVxyXG5cdFx0dGhpcy51cGRhdGVNb250aHNJblZpZXcoKTtcclxuXHRcdHRoaXMudXBkYXRlQ2FsZW5kYXJzKCk7XHJcblx0fVxyXG5cclxuXHR1cGRhdGVNb250aHNJblZpZXcoKSB7XHJcblx0XHRpZiAodGhpcy5lbmREYXRlKSB7XHJcblx0XHRcdC8vIGlmIGJvdGggZGF0ZXMgYXJlIHZpc2libGUgYWxyZWFkeSwgZG8gbm90aGluZ1xyXG5cdFx0XHRpZiAoXHJcblx0XHRcdFx0IXRoaXMuc2luZ2xlRGF0ZVBpY2tlciAmJlxyXG5cdFx0XHRcdHRoaXMubGVmdENhbGVuZGFyLm1vbnRoICYmXHJcblx0XHRcdFx0dGhpcy5yaWdodENhbGVuZGFyLm1vbnRoICYmXHJcblx0XHRcdFx0KCh0aGlzLnN0YXJ0RGF0ZSAmJlxyXG5cdFx0XHRcdFx0dGhpcy5sZWZ0Q2FsZW5kYXIgJiZcclxuXHRcdFx0XHRcdHRoaXMuc3RhcnREYXRlLmZvcm1hdCgnWVlZWS1NTScpID09PSB0aGlzLmxlZnRDYWxlbmRhci5tb250aC5mb3JtYXQoJ1lZWVktTU0nKSkgfHxcclxuXHRcdFx0XHRcdCh0aGlzLnN0YXJ0RGF0ZSAmJlxyXG5cdFx0XHRcdFx0XHR0aGlzLnJpZ2h0Q2FsZW5kYXIgJiZcclxuXHRcdFx0XHRcdFx0dGhpcy5zdGFydERhdGUuZm9ybWF0KCdZWVlZLU1NJykgPT09IHRoaXMucmlnaHRDYWxlbmRhci5tb250aC5mb3JtYXQoJ1lZWVktTU0nKSkpICYmXHJcblx0XHRcdFx0KHRoaXMuZW5kRGF0ZS5mb3JtYXQoJ1lZWVktTU0nKSA9PT0gdGhpcy5sZWZ0Q2FsZW5kYXIubW9udGguZm9ybWF0KCdZWVlZLU1NJykgfHxcclxuXHRcdFx0XHRcdHRoaXMuZW5kRGF0ZS5mb3JtYXQoJ1lZWVktTU0nKSA9PT0gdGhpcy5yaWdodENhbGVuZGFyLm1vbnRoLmZvcm1hdCgnWVlZWS1NTScpKVxyXG5cdFx0XHQpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKHRoaXMuc3RhcnREYXRlKSB7XHJcblx0XHRcdFx0dGhpcy5sZWZ0Q2FsZW5kYXIubW9udGggPSB0aGlzLnN0YXJ0RGF0ZS5jbG9uZSgpLmRhdGUoMik7XHJcblx0XHRcdFx0aWYgKFxyXG5cdFx0XHRcdFx0IXRoaXMubGlua2VkQ2FsZW5kYXJzICYmXHJcblx0XHRcdFx0XHQodGhpcy5lbmREYXRlLm1vbnRoKCkgIT09IHRoaXMuc3RhcnREYXRlLm1vbnRoKCkgfHwgdGhpcy5lbmREYXRlLnllYXIoKSAhPT0gdGhpcy5zdGFydERhdGUueWVhcigpKVxyXG5cdFx0XHRcdCkge1xyXG5cdFx0XHRcdFx0dGhpcy5yaWdodENhbGVuZGFyLm1vbnRoID0gdGhpcy5lbmREYXRlLmNsb25lKCkuZGF0ZSgyKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy5yaWdodENhbGVuZGFyLm1vbnRoID0gdGhpcy5zdGFydERhdGVcclxuXHRcdFx0XHRcdFx0LmNsb25lKClcclxuXHRcdFx0XHRcdFx0LmRhdGUoMilcclxuXHRcdFx0XHRcdFx0LmFkZCgxLCAnbW9udGgnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGlmIChcclxuXHRcdFx0XHR0aGlzLmxlZnRDYWxlbmRhci5tb250aC5mb3JtYXQoJ1lZWVktTU0nKSAhPT0gdGhpcy5zdGFydERhdGUuZm9ybWF0KCdZWVlZLU1NJykgJiZcclxuXHRcdFx0XHR0aGlzLnJpZ2h0Q2FsZW5kYXIubW9udGguZm9ybWF0KCdZWVlZLU1NJykgIT09IHRoaXMuc3RhcnREYXRlLmZvcm1hdCgnWVlZWS1NTScpXHJcblx0XHRcdCkge1xyXG5cdFx0XHRcdHRoaXMubGVmdENhbGVuZGFyLm1vbnRoID0gdGhpcy5zdGFydERhdGUuY2xvbmUoKS5kYXRlKDIpO1xyXG5cdFx0XHRcdHRoaXMucmlnaHRDYWxlbmRhci5tb250aCA9IHRoaXMuc3RhcnREYXRlXHJcblx0XHRcdFx0XHQuY2xvbmUoKVxyXG5cdFx0XHRcdFx0LmRhdGUoMilcclxuXHRcdFx0XHRcdC5hZGQoMSwgJ21vbnRoJyk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGlmICh0aGlzLm1heERhdGUgJiYgdGhpcy5saW5rZWRDYWxlbmRhcnMgJiYgIXRoaXMuc2luZ2xlRGF0ZVBpY2tlciAmJiB0aGlzLnJpZ2h0Q2FsZW5kYXIubW9udGggPiB0aGlzLm1heERhdGUpIHtcclxuXHRcdFx0dGhpcy5yaWdodENhbGVuZGFyLm1vbnRoID0gdGhpcy5tYXhEYXRlLmNsb25lKCkuZGF0ZSgyKTtcclxuXHRcdFx0dGhpcy5sZWZ0Q2FsZW5kYXIubW9udGggPSB0aGlzLm1heERhdGVcclxuXHRcdFx0XHQuY2xvbmUoKVxyXG5cdFx0XHRcdC5kYXRlKDIpXHJcblx0XHRcdFx0LnN1YnRyYWN0KDEsICdtb250aCcpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHQvKipcclxuXHQgKiAgVGhpcyBpcyByZXNwb25zaWJsZSBmb3IgdXBkYXRpbmcgdGhlIGNhbGVuZGFyc1xyXG5cdCAqL1xyXG5cdHVwZGF0ZUNhbGVuZGFycygpIHtcclxuXHRcdHRoaXMucmVuZGVyQ2FsZW5kYXIoU2lkZUVudW0ubGVmdCk7XHJcblx0XHR0aGlzLnJlbmRlckNhbGVuZGFyKFNpZGVFbnVtLnJpZ2h0KTtcclxuXHJcblx0XHRpZiAodGhpcy5lbmREYXRlID09PSBudWxsKSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHRcdHRoaXMuY2FsY3VsYXRlQ2hvc2VuTGFiZWwoKTtcclxuXHR9XHJcblx0dXBkYXRlRWxlbWVudCgpIHtcclxuXHRcdGNvbnN0IGZvcm1hdCA9IHRoaXMubG9jYWxlLmRpc3BsYXlGb3JtYXQgPyB0aGlzLmxvY2FsZS5kaXNwbGF5Rm9ybWF0IDogdGhpcy5sb2NhbGUuZm9ybWF0O1xyXG5cclxuXHRcdGlmICghdGhpcy5zaW5nbGVEYXRlUGlja2VyICYmIHRoaXMuYXV0b1VwZGF0ZUlucHV0KSB7XHJcblx0XHRcdGlmICh0aGlzLnN0YXJ0RGF0ZSAmJiB0aGlzLmVuZERhdGUpIHtcclxuXHRcdFx0XHQvLyBpZiB3ZSB1c2UgcmFuZ2VzIGFuZCBzaG91bGQgc2hvdyByYW5nZSBsYWJlbCBvbiBpbnB1dFxyXG5cdFx0XHRcdGlmIChcclxuXHRcdFx0XHRcdHRoaXMucmFuZ2VzLmxlbmd0aCAmJlxyXG5cdFx0XHRcdFx0dGhpcy5zaG93UmFuZ2VMYWJlbE9uSW5wdXQgPT09IHRydWUgJiZcclxuXHRcdFx0XHRcdHRoaXMuY2hvc2VuUmFuZ2UgLyomJlxyXG5cdFx0XHRcdFx0dGhpcy5sb2NhbGUuY3VzdG9tUmFuZ2VMYWJlbCAhPT0gdGhpcy5jaG9zZW5SYW5nZS5sYWJlbCovXHJcblx0XHRcdFx0KSB7XHJcblx0XHRcdFx0XHR0aGlzLmNob3NlbkxhYmVsID0gdGhpcy5jaG9zZW5SYW5nZS5sYWJlbDtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy5jaG9zZW5MYWJlbCA9XHJcblx0XHRcdFx0XHRcdHRoaXMuc3RhcnREYXRlLmZvcm1hdChmb3JtYXQpICtcclxuXHRcdFx0XHRcdFx0dGhpcy5sb2NhbGUuc2VwYXJhdG9yICtcclxuXHRcdFx0XHRcdFx0dGhpcy5lbmREYXRlLmZvcm1hdChmb3JtYXQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIGlmICh0aGlzLmF1dG9VcGRhdGVJbnB1dCkge1xyXG5cdFx0XHR0aGlzLmNob3NlbkxhYmVsID0gdGhpcy5zdGFydERhdGUuZm9ybWF0KGZvcm1hdCk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRyZW1vdmUoKSB7XHJcblx0XHR0aGlzLmlzU2hvd24gPSBmYWxzZTtcclxuXHR9XHJcblx0LyoqXHJcblx0ICogdGhpcyBzaG91bGQgY2FsY3VsYXRlIHRoZSBsYWJlbFxyXG5cdCAqL1xyXG5cdGNhbGN1bGF0ZUNob3NlbkxhYmVsKCkge1xyXG5cdFx0aWYgKCF0aGlzLmxvY2FsZSB8fCAhdGhpcy5sb2NhbGUuc2VwYXJhdG9yKSB7XHJcblx0XHRcdHRoaXMuX2J1aWxkTG9jYWxlKCk7XHJcblx0XHR9XHJcblx0XHRsZXQgY3VzdG9tUmFuZ2UgPSB0cnVlO1xyXG5cdFx0bGV0IGkgPSAwO1xyXG5cclxuXHRcdHRoaXMucmFuZ2VzLmZvckVhY2gocHJlc2V0ID0+IHtcclxuXHRcdFx0aWYgKHRoaXMudGltZVBpY2tlcikge1xyXG5cdFx0XHRcdGNvbnN0IGZvcm1hdCA9IHRoaXMudGltZVBpY2tlclNlY29uZHMgPyAnWVlZWS1NTS1ERCBISDptbTpzcycgOiAnWVlZWS1NTS1ERCBISDptbSc7XHJcblx0XHRcdFx0Ly8gaWdub3JlIHRpbWVzIHdoZW4gY29tcGFyaW5nIGRhdGVzIGlmIHRpbWUgcGlja2VyIHNlY29uZHMgaXMgbm90IGVuYWJsZWRcclxuXHRcdFx0XHRpZiAoXHJcblx0XHRcdFx0XHR0aGlzLnN0YXJ0RGF0ZS5mb3JtYXQoZm9ybWF0KSA9PT0gcHJlc2V0LnJhbmdlLnN0YXJ0LmZvcm1hdChmb3JtYXQpICYmXHJcblx0XHRcdFx0XHR0aGlzLmVuZERhdGUuZm9ybWF0KGZvcm1hdCkgPT09IHByZXNldC5yYW5nZS5lbmQuZm9ybWF0KGZvcm1hdClcclxuXHRcdFx0XHQpIHtcclxuXHRcdFx0XHRcdGN1c3RvbVJhbmdlID0gZmFsc2U7XHJcblx0XHRcdFx0XHR0aGlzLmNob3NlblJhbmdlID0gcHJlc2V0O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHQvLyBpZ25vcmUgdGltZXMgd2hlbiBjb21wYXJpbmcgZGF0ZXMgaWYgdGltZSBwaWNrZXIgaXMgbm90IGVuYWJsZWRcclxuXHRcdFx0XHRpZiAoXHJcblx0XHRcdFx0XHR0aGlzLnN0YXJ0RGF0ZS5mb3JtYXQoJ1lZWVktTU0tREQnKSA9PT0gcHJlc2V0LnJhbmdlLnN0YXJ0LmZvcm1hdCgnWVlZWS1NTS1ERCcpICYmXHJcblx0XHRcdFx0XHR0aGlzLmVuZERhdGUuZm9ybWF0KCdZWVlZLU1NLUREJykgPT09IHByZXNldC5yYW5nZS5lbmQuZm9ybWF0KCdZWVlZLU1NLUREJylcclxuXHRcdFx0XHQpIHtcclxuXHRcdFx0XHRcdGN1c3RvbVJhbmdlID0gZmFsc2U7XHJcblx0XHRcdFx0XHR0aGlzLmNob3NlblJhbmdlID0gcHJlc2V0O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRpKys7XHJcblx0XHR9KTtcclxuXHJcblx0XHRpZiAoY3VzdG9tUmFuZ2UpIHtcclxuXHRcdFx0aWYgKHRoaXMuc2hvd0N1c3RvbVJhbmdlTGFiZWwpIHtcclxuXHRcdFx0XHQvLyB0aGlzLmNob3NlblJhbmdlLmxhYmVsID0gdGhpcy5sb2NhbGUuY3VzdG9tUmFuZ2VMYWJlbDtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR0aGlzLmNob3NlblJhbmdlID0gbnVsbDtcclxuXHRcdFx0fVxyXG5cdFx0XHQvLyBpZiBjdXN0b20gbGFiZWw6IHNob3cgY2FsZW5kYXJcclxuXHRcdFx0dGhpcy5zaG93Q2FsSW5SYW5nZXMgPSB0cnVlO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMudXBkYXRlRWxlbWVudCgpO1xyXG5cdH1cclxuXHJcblx0Y2xpY2tBcHBseShlPykge1xyXG5cdFx0aWYgKCF0aGlzLnNpbmdsZURhdGVQaWNrZXIgJiYgdGhpcy5zdGFydERhdGUgJiYgIXRoaXMuZW5kRGF0ZSkge1xyXG5cdFx0XHR0aGlzLmVuZERhdGUgPSB0aGlzLnN0YXJ0RGF0ZS5jbG9uZSgpO1xyXG5cdFx0XHR0aGlzLmNhbGN1bGF0ZUNob3NlbkxhYmVsKCk7XHJcblx0XHR9XHJcblx0XHRpZiAodGhpcy5pc0ludmFsaWREYXRlICYmIHRoaXMuc3RhcnREYXRlICYmIHRoaXMuZW5kRGF0ZSkge1xyXG5cdFx0XHQvLyBnZXQgaWYgdGhlcmUgYXJlIGludmFsaWQgZGF0ZSBiZXR3ZWVuIHJhbmdlXHJcblx0XHRcdGNvbnN0IGQgPSB0aGlzLnN0YXJ0RGF0ZS5jbG9uZSgpO1xyXG5cdFx0XHR3aGlsZSAoZC5pc0JlZm9yZSh0aGlzLmVuZERhdGUpKSB7XHJcblx0XHRcdFx0aWYgKHRoaXMuaXNJbnZhbGlkRGF0ZShkKSkge1xyXG5cdFx0XHRcdFx0dGhpcy5lbmREYXRlID0gZC5zdWJ0cmFjdCgxLCAnZGF5cycpO1xyXG5cdFx0XHRcdFx0dGhpcy5jYWxjdWxhdGVDaG9zZW5MYWJlbCgpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGQuYWRkKDEsICdkYXlzJyk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGlmICh0aGlzLmNob3NlbkxhYmVsKSB7XHJcblx0XHRcdHRoaXMuY2hvb3NlZERhdGUuZW1pdCh7IGNob3NlbkxhYmVsOiB0aGlzLmNob3NlbkxhYmVsLCBzdGFydERhdGU6IHRoaXMuc3RhcnREYXRlLCBlbmREYXRlOiB0aGlzLmVuZERhdGUgfSk7XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5kYXRlc1VwZGF0ZWQuZW1pdCh7IHN0YXJ0RGF0ZTogdGhpcy5zdGFydERhdGUsIGVuZERhdGU6IHRoaXMuZW5kRGF0ZSB9KTtcclxuXHRcdGlmIChlIHx8ICh0aGlzLmNsb3NlT25BdXRvQXBwbHkgJiYgIWUpKSB7XHJcblx0XHRcdHRoaXMuaGlkZSgpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Y2xpY2tDYW5jZWwoZSkge1xyXG5cdFx0dGhpcy5zdGFydERhdGUgPSB0aGlzLl9vbGQuc3RhcnQ7XHJcblx0XHR0aGlzLmVuZERhdGUgPSB0aGlzLl9vbGQuZW5kO1xyXG5cdFx0aWYgKHRoaXMuaW5saW5lKSB7XHJcblx0XHRcdHRoaXMudXBkYXRlVmlldygpO1xyXG5cdFx0fVxyXG5cdFx0dGhpcy5oaWRlKCk7XHJcblx0fVxyXG5cdC8qKlxyXG5cdCAqIGNhbGxlZCB3aGVuIG1vbnRoIGlzIGNoYW5nZWRcclxuXHQgKiBAcGFyYW0gbW9udGhFdmVudCBnZXQgdmFsdWUgaW4gZXZlbnQudGFyZ2V0LnZhbHVlXHJcblx0ICogQHBhcmFtIHNpZGUgbGVmdCBvciByaWdodFxyXG5cdCAqL1xyXG5cdG1vbnRoQ2hhbmdlZChtb250aEV2ZW50OiBhbnksIHNpZGU6IFNpZGVFbnVtKSB7XHJcblx0XHRjb25zdCB5ZWFyID0gdGhpcy5jYWxlbmRhclZhcmlhYmxlc1tzaWRlXS5kcm9wZG93bnMuY3VycmVudFllYXI7XHJcblx0XHRjb25zdCBtb250aCA9IHBhcnNlSW50KG1vbnRoRXZlbnQudmFsdWUsIDEwKTtcclxuXHRcdHRoaXMubW9udGhPclllYXJDaGFuZ2VkKG1vbnRoLCB5ZWFyLCBzaWRlKTtcclxuXHR9XHJcblx0LyoqXHJcblx0ICogY2FsbGVkIHdoZW4geWVhciBpcyBjaGFuZ2VkXHJcblx0ICogQHBhcmFtIHllYXJFdmVudCBnZXQgdmFsdWUgaW4gZXZlbnQudGFyZ2V0LnZhbHVlXHJcblx0ICogQHBhcmFtIHNpZGUgbGVmdCBvciByaWdodFxyXG5cdCAqL1xyXG5cdHllYXJDaGFuZ2VkKHllYXJFdmVudDogYW55LCBzaWRlOiBTaWRlRW51bSkge1xyXG5cdFx0Y29uc3QgbW9udGggPSB0aGlzLmNhbGVuZGFyVmFyaWFibGVzW3NpZGVdLmRyb3Bkb3ducy5jdXJyZW50TW9udGg7XHJcblx0XHRjb25zdCB5ZWFyID0gcGFyc2VJbnQoeWVhckV2ZW50LnZhbHVlLCAxMCk7XHJcblx0XHR0aGlzLm1vbnRoT3JZZWFyQ2hhbmdlZChtb250aCwgeWVhciwgc2lkZSk7XHJcblx0fVxyXG5cdC8qKlxyXG5cdCAqIGNhbGxlZCB3aGVuIHRpbWUgaXMgY2hhbmdlZFxyXG5cdCAqIEBwYXJhbSB0aW1lRXZlbnQgIGFuIGV2ZW50XHJcblx0ICogQHBhcmFtIHNpZGUgbGVmdCBvciByaWdodFxyXG5cdCAqL1xyXG5cdHRpbWVDaGFuZ2VkKHRpbWVFdmVudDogYW55LCBzaWRlOiBTaWRlRW51bSkge1xyXG5cdFx0bGV0IGhvdXIgPSBwYXJzZUludCh0aGlzLnRpbWVwaWNrZXJWYXJpYWJsZXNbc2lkZV0uc2VsZWN0ZWRIb3VyLCAxMCk7XHJcblx0XHRjb25zdCBtaW51dGUgPSBwYXJzZUludCh0aGlzLnRpbWVwaWNrZXJWYXJpYWJsZXNbc2lkZV0uc2VsZWN0ZWRNaW51dGUsIDEwKTtcclxuXHRcdGNvbnN0IHNlY29uZCA9IHRoaXMudGltZVBpY2tlclNlY29uZHMgPyBwYXJzZUludCh0aGlzLnRpbWVwaWNrZXJWYXJpYWJsZXNbc2lkZV0uc2VsZWN0ZWRTZWNvbmQsIDEwKSA6IDA7XHJcblxyXG5cdFx0aWYgKCF0aGlzLnRpbWVQaWNrZXIyNEhvdXIpIHtcclxuXHRcdFx0Y29uc3QgYW1wbSA9IHRoaXMudGltZXBpY2tlclZhcmlhYmxlc1tzaWRlXS5hbXBtTW9kZWw7XHJcblx0XHRcdGlmIChhbXBtID09PSAnUE0nICYmIGhvdXIgPCAxMikge1xyXG5cdFx0XHRcdGhvdXIgKz0gMTI7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKGFtcG0gPT09ICdBTScgJiYgaG91ciA9PT0gMTIpIHtcclxuXHRcdFx0XHRob3VyID0gMDtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChzaWRlID09PSBTaWRlRW51bS5sZWZ0KSB7XHJcblx0XHRcdGNvbnN0IHN0YXJ0ID0gdGhpcy5zdGFydERhdGUuY2xvbmUoKTtcclxuXHRcdFx0c3RhcnQuaG91cihob3VyKTtcclxuXHRcdFx0c3RhcnQubWludXRlKG1pbnV0ZSk7XHJcblx0XHRcdHN0YXJ0LnNlY29uZChzZWNvbmQpO1xyXG5cdFx0XHR0aGlzLnNldFN0YXJ0RGF0ZShzdGFydCk7XHJcblx0XHRcdGlmICh0aGlzLnNpbmdsZURhdGVQaWNrZXIpIHtcclxuXHRcdFx0XHR0aGlzLmVuZERhdGUgPSB0aGlzLnN0YXJ0RGF0ZS5jbG9uZSgpO1xyXG5cdFx0XHR9IGVsc2UgaWYgKFxyXG5cdFx0XHRcdHRoaXMuZW5kRGF0ZSAmJlxyXG5cdFx0XHRcdHRoaXMuZW5kRGF0ZS5mb3JtYXQoJ1lZWVktTU0tREQnKSA9PT0gc3RhcnQuZm9ybWF0KCdZWVlZLU1NLUREJykgJiZcclxuXHRcdFx0XHR0aGlzLmVuZERhdGUuaXNCZWZvcmUoc3RhcnQpXHJcblx0XHRcdCkge1xyXG5cdFx0XHRcdHRoaXMuc2V0RW5kRGF0ZShzdGFydC5jbG9uZSgpKTtcclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIGlmICh0aGlzLmVuZERhdGUpIHtcclxuXHRcdFx0Y29uc3QgZW5kID0gdGhpcy5lbmREYXRlLmNsb25lKCk7XHJcblx0XHRcdGVuZC5ob3VyKGhvdXIpO1xyXG5cdFx0XHRlbmQubWludXRlKG1pbnV0ZSk7XHJcblx0XHRcdGVuZC5zZWNvbmQoc2Vjb25kKTtcclxuXHRcdFx0dGhpcy5zZXRFbmREYXRlKGVuZCk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gdXBkYXRlIHRoZSBjYWxlbmRhcnMgc28gYWxsIGNsaWNrYWJsZSBkYXRlcyByZWZsZWN0IHRoZSBuZXcgdGltZSBjb21wb25lbnRcclxuXHRcdHRoaXMudXBkYXRlQ2FsZW5kYXJzKCk7XHJcblxyXG5cdFx0Ly8gcmUtcmVuZGVyIHRoZSB0aW1lIHBpY2tlcnMgYmVjYXVzZSBjaGFuZ2luZyBvbmUgc2VsZWN0aW9uIGNhbiBhZmZlY3Qgd2hhdCdzIGVuYWJsZWQgaW4gYW5vdGhlclxyXG5cdFx0dGhpcy5yZW5kZXJUaW1lUGlja2VyKFNpZGVFbnVtLmxlZnQpO1xyXG5cdFx0dGhpcy5yZW5kZXJUaW1lUGlja2VyKFNpZGVFbnVtLnJpZ2h0KTtcclxuXHJcblx0XHRpZiAodGhpcy5hdXRvQXBwbHkpIHtcclxuXHRcdFx0dGhpcy5jbGlja0FwcGx5KCk7XHJcblx0XHR9XHJcblx0fVxyXG5cdC8qKlxyXG5cdCAqICBjYWxsIHdoZW4gbW9udGggb3IgeWVhciBjaGFuZ2VkXHJcblx0ICogQHBhcmFtIG1vbnRoIG1vbnRoIG51bWJlciAwIC0xMVxyXG5cdCAqIEBwYXJhbSB5ZWFyIHllYXIgZWc6IDE5OTVcclxuXHQgKiBAcGFyYW0gc2lkZSBsZWZ0IG9yIHJpZ2h0XHJcblx0ICovXHJcblx0bW9udGhPclllYXJDaGFuZ2VkKG1vbnRoOiBudW1iZXIsIHllYXI6IG51bWJlciwgc2lkZTogU2lkZUVudW0pIHtcclxuXHRcdGNvbnN0IGlzTGVmdCA9IHNpZGUgPT09IFNpZGVFbnVtLmxlZnQ7XHJcblxyXG5cdFx0aWYgKCFpc0xlZnQpIHtcclxuXHRcdFx0aWYgKHllYXIgPCB0aGlzLnN0YXJ0RGF0ZS55ZWFyKCkgfHwgKHllYXIgPT09IHRoaXMuc3RhcnREYXRlLnllYXIoKSAmJiBtb250aCA8IHRoaXMuc3RhcnREYXRlLm1vbnRoKCkpKSB7XHJcblx0XHRcdFx0bW9udGggPSB0aGlzLnN0YXJ0RGF0ZS5tb250aCgpO1xyXG5cdFx0XHRcdHllYXIgPSB0aGlzLnN0YXJ0RGF0ZS55ZWFyKCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRpZiAodGhpcy5taW5EYXRlKSB7XHJcblx0XHRcdGlmICh5ZWFyIDwgdGhpcy5taW5EYXRlLnllYXIoKSB8fCAoeWVhciA9PT0gdGhpcy5taW5EYXRlLnllYXIoKSAmJiBtb250aCA8IHRoaXMubWluRGF0ZS5tb250aCgpKSkge1xyXG5cdFx0XHRcdG1vbnRoID0gdGhpcy5taW5EYXRlLm1vbnRoKCk7XHJcblx0XHRcdFx0eWVhciA9IHRoaXMubWluRGF0ZS55ZWFyKCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRpZiAodGhpcy5tYXhEYXRlKSB7XHJcblx0XHRcdGlmICh5ZWFyID4gdGhpcy5tYXhEYXRlLnllYXIoKSB8fCAoeWVhciA9PT0gdGhpcy5tYXhEYXRlLnllYXIoKSAmJiBtb250aCA+IHRoaXMubWF4RGF0ZS5tb250aCgpKSkge1xyXG5cdFx0XHRcdG1vbnRoID0gdGhpcy5tYXhEYXRlLm1vbnRoKCk7XHJcblx0XHRcdFx0eWVhciA9IHRoaXMubWF4RGF0ZS55ZWFyKCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLmNhbGVuZGFyVmFyaWFibGVzW3NpZGVdLmRyb3Bkb3ducy5jdXJyZW50WWVhciA9IHllYXI7XHJcblx0XHR0aGlzLmNhbGVuZGFyVmFyaWFibGVzW3NpZGVdLmRyb3Bkb3ducy5jdXJyZW50TW9udGggPSBtb250aDtcclxuXHJcblx0XHRpZiAoaXNMZWZ0KSB7XHJcblx0XHRcdHRoaXMubGVmdENhbGVuZGFyLm1vbnRoLm1vbnRoKG1vbnRoKS55ZWFyKHllYXIpO1xyXG5cdFx0XHRpZiAodGhpcy5saW5rZWRDYWxlbmRhcnMpIHtcclxuXHRcdFx0XHR0aGlzLnJpZ2h0Q2FsZW5kYXIubW9udGggPSB0aGlzLmxlZnRDYWxlbmRhci5tb250aC5jbG9uZSgpLmFkZCgxLCAnbW9udGgnKTtcclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGhpcy5yaWdodENhbGVuZGFyLm1vbnRoLm1vbnRoKG1vbnRoKS55ZWFyKHllYXIpO1xyXG5cdFx0XHRpZiAodGhpcy5saW5rZWRDYWxlbmRhcnMpIHtcclxuXHRcdFx0XHR0aGlzLmxlZnRDYWxlbmRhci5tb250aCA9IHRoaXMucmlnaHRDYWxlbmRhci5tb250aC5jbG9uZSgpLnN1YnRyYWN0KDEsICdtb250aCcpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHR0aGlzLnVwZGF0ZUNhbGVuZGFycygpO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogQ2xpY2sgb24gcHJldmlvdXMgbW9udGhcclxuXHQgKiBAcGFyYW0gc2lkZSBsZWZ0IG9yIHJpZ2h0IGNhbGVuZGFyXHJcblx0ICovXHJcblx0Y2xpY2tQcmV2KHNpZGU6IFNpZGVFbnVtKSB7XHJcblx0XHRpZiAoc2lkZSA9PT0gU2lkZUVudW0ubGVmdCkge1xyXG5cdFx0XHR0aGlzLmxlZnRDYWxlbmRhci5tb250aC5zdWJ0cmFjdCgxLCAnbW9udGgnKTtcclxuXHRcdFx0aWYgKHRoaXMubGlua2VkQ2FsZW5kYXJzKSB7XHJcblx0XHRcdFx0dGhpcy5yaWdodENhbGVuZGFyLm1vbnRoLnN1YnRyYWN0KDEsICdtb250aCcpO1xyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aGlzLnJpZ2h0Q2FsZW5kYXIubW9udGguc3VidHJhY3QoMSwgJ21vbnRoJyk7XHJcblx0XHR9XHJcblx0XHR0aGlzLnVwZGF0ZUNhbGVuZGFycygpO1xyXG5cdH1cclxuXHQvKipcclxuXHQgKiBDbGljayBvbiBuZXh0IG1vbnRoXHJcblx0ICogQHBhcmFtIHNpZGUgbGVmdCBvciByaWdodCBjYWxlbmRhclxyXG5cdCAqL1xyXG5cdGNsaWNrTmV4dChzaWRlOiBTaWRlRW51bSkge1xyXG5cdFx0aWYgKHNpZGUgPT09IFNpZGVFbnVtLmxlZnQpIHtcclxuXHRcdFx0dGhpcy5sZWZ0Q2FsZW5kYXIubW9udGguYWRkKDEsICdtb250aCcpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGhpcy5yaWdodENhbGVuZGFyLm1vbnRoLmFkZCgxLCAnbW9udGgnKTtcclxuXHRcdFx0aWYgKHRoaXMubGlua2VkQ2FsZW5kYXJzKSB7XHJcblx0XHRcdFx0dGhpcy5sZWZ0Q2FsZW5kYXIubW9udGguYWRkKDEsICdtb250aCcpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHR0aGlzLnVwZGF0ZUNhbGVuZGFycygpO1xyXG5cdH1cclxuXHQvKipcclxuXHQgKiBXaGVuIHNlbGVjdGluZyBhIGRhdGVcclxuXHQgKiBAcGFyYW0gZSBldmVudDogZ2V0IHZhbHVlIGJ5IGUudGFyZ2V0LnZhbHVlXHJcblx0ICogQHBhcmFtIHNpZGUgbGVmdCBvciByaWdodFxyXG5cdCAqIEBwYXJhbSByb3cgcm93IHBvc2l0aW9uIG9mIHRoZSBjdXJyZW50IGRhdGUgY2xpY2tlZFxyXG5cdCAqIEBwYXJhbSBjb2wgY29sIHBvc2l0aW9uIG9mIHRoZSBjdXJyZW50IGRhdGUgY2xpY2tlZFxyXG5cdCAqL1xyXG5cdGNsaWNrRGF0ZShlLCBzaWRlOiBTaWRlRW51bSwgcm93OiBudW1iZXIsIGNvbDogbnVtYmVyKSB7XHJcblx0XHRpZiAoZS50YXJnZXQudGFnTmFtZSA9PT0gJ1REJykge1xyXG5cdFx0XHRpZiAoIWUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnYXZhaWxhYmxlJykpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSBpZiAoZS50YXJnZXQudGFnTmFtZSA9PT0gJ1NQQU4nKSB7XHJcblx0XHRcdGlmICghZS50YXJnZXQucGFyZW50RWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2F2YWlsYWJsZScpKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0bGV0IGRhdGUgPVxyXG5cdFx0XHRzaWRlID09PSBTaWRlRW51bS5sZWZ0ID8gdGhpcy5sZWZ0Q2FsZW5kYXIuY2FsZW5kYXJbcm93XVtjb2xdIDogdGhpcy5yaWdodENhbGVuZGFyLmNhbGVuZGFyW3Jvd11bY29sXTtcclxuXHJcblx0XHRpZiAoXHJcblx0XHRcdCh0aGlzLmVuZERhdGUgfHwgKGRhdGUuaXNCZWZvcmUodGhpcy5zdGFydERhdGUsICdkYXknKSAmJiB0aGlzLmN1c3RvbVJhbmdlRGlyZWN0aW9uID09PSBmYWxzZSkpICYmXHJcblx0XHRcdHRoaXMubG9ja1N0YXJ0RGF0ZSA9PT0gZmFsc2VcclxuXHRcdCkge1xyXG5cdFx0XHQvLyBwaWNraW5nIHN0YXJ0XHJcblx0XHRcdGlmICh0aGlzLnRpbWVQaWNrZXIpIHtcclxuXHRcdFx0XHRkYXRlID0gdGhpcy5fZ2V0RGF0ZVdpdGhUaW1lKGRhdGUsIFNpZGVFbnVtLmxlZnQpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHRoaXMuZW5kRGF0ZSA9IG51bGw7XHJcblx0XHRcdHRoaXMuc2V0U3RhcnREYXRlKGRhdGUuY2xvbmUoKSk7XHJcblx0XHR9IGVsc2UgaWYgKCF0aGlzLmVuZERhdGUgJiYgZGF0ZS5pc0JlZm9yZSh0aGlzLnN0YXJ0RGF0ZSkgJiYgdGhpcy5jdXN0b21SYW5nZURpcmVjdGlvbiA9PT0gZmFsc2UpIHtcclxuXHRcdFx0Ly8gc3BlY2lhbCBjYXNlOiBjbGlja2luZyB0aGUgc2FtZSBkYXRlIGZvciBzdGFydC9lbmQsXHJcblx0XHRcdC8vIGJ1dCB0aGUgdGltZSBvZiB0aGUgZW5kIGRhdGUgaXMgYmVmb3JlIHRoZSBzdGFydCBkYXRlXHJcblx0XHRcdHRoaXMuc2V0RW5kRGF0ZSh0aGlzLnN0YXJ0RGF0ZS5jbG9uZSgpKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdC8vIHBpY2tpbmcgZW5kXHJcblx0XHRcdGlmICh0aGlzLnRpbWVQaWNrZXIpIHtcclxuXHRcdFx0XHRkYXRlID0gdGhpcy5fZ2V0RGF0ZVdpdGhUaW1lKGRhdGUsIFNpZGVFbnVtLnJpZ2h0KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoZGF0ZS5pc0JlZm9yZSh0aGlzLnN0YXJ0RGF0ZSwgJ2RheScpID09PSB0cnVlICYmIHRoaXMuY3VzdG9tUmFuZ2VEaXJlY3Rpb24gPT09IHRydWUpIHtcclxuXHRcdFx0XHR0aGlzLnNldEVuZERhdGUodGhpcy5zdGFydERhdGUpO1xyXG5cdFx0XHRcdHRoaXMuc2V0U3RhcnREYXRlKGRhdGUuY2xvbmUoKSk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dGhpcy5zZXRFbmREYXRlKGRhdGUuY2xvbmUoKSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICh0aGlzLmF1dG9BcHBseSkge1xyXG5cdFx0XHRcdHRoaXMuY2FsY3VsYXRlQ2hvc2VuTGFiZWwoKTtcclxuXHRcdFx0XHR0aGlzLmNsaWNrQXBwbHkoKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmICh0aGlzLnNpbmdsZURhdGVQaWNrZXIpIHtcclxuXHRcdFx0dGhpcy5zZXRFbmREYXRlKHRoaXMuc3RhcnREYXRlKTtcclxuXHRcdFx0dGhpcy51cGRhdGVFbGVtZW50KCk7XHJcblx0XHRcdGlmICh0aGlzLmF1dG9BcHBseSkge1xyXG5cdFx0XHRcdHRoaXMuY2xpY2tBcHBseSgpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy51cGRhdGVWaWV3KCk7XHJcblxyXG5cdFx0aWYgKHRoaXMuYXV0b0FwcGx5ICYmIHRoaXMuc3RhcnREYXRlICYmIHRoaXMuZW5kRGF0ZSkge1xyXG5cdFx0XHR0aGlzLmNsaWNrQXBwbHkoKTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBUaGlzIGlzIHRvIGNhbmNlbCB0aGUgYmx1ciBldmVudCBoYW5kbGVyIGlmIHRoZSBtb3VzZSB3YXMgaW4gb25lIG9mIHRoZSBpbnB1dHNcclxuXHRcdGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblx0fVxyXG5cdC8qKlxyXG5cdCAqICBDbGljayBvbiB0aGUgY3VzdG9tIHJhbmdlXHJcblx0ICogQHBhcmFtIGU6IEV2ZW50XHJcblx0ICogQHBhcmFtIHByZXNldFxyXG5cdCAqL1xyXG5cdGNsaWNrUmFuZ2UoZSwgcHJlc2V0OiBEYXRlUmFuZ2VQcmVzZXQpIHtcclxuXHRcdHRoaXMuY2hvc2VuUmFuZ2UgPSBwcmVzZXQ7XHJcblx0XHR0aGlzLnN0YXJ0RGF0ZSA9IHByZXNldC5yYW5nZS5zdGFydC5jbG9uZSgpO1xyXG5cdFx0dGhpcy5lbmREYXRlID0gcHJlc2V0LnJhbmdlLmVuZC5jbG9uZSgpO1xyXG5cclxuXHRcdGlmICh0aGlzLnNob3dSYW5nZUxhYmVsT25JbnB1dCkge1xyXG5cdFx0XHR0aGlzLmNob3NlbkxhYmVsID0gcHJlc2V0LmxhYmVsO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGhpcy5jYWxjdWxhdGVDaG9zZW5MYWJlbCgpO1xyXG5cdFx0fVxyXG5cdFx0dGhpcy5zaG93Q2FsSW5SYW5nZXMgPSB0cnVlO1xyXG5cclxuXHRcdGlmICghdGhpcy50aW1lUGlja2VyKSB7XHJcblx0XHRcdHRoaXMuc3RhcnREYXRlLnN0YXJ0T2YoJ2RheScpO1xyXG5cdFx0XHR0aGlzLmVuZERhdGUuZW5kT2YoJ2RheScpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICghdGhpcy5hbHdheXNTaG93Q2FsZW5kYXJzKSB7XHJcblx0XHRcdHRoaXMuaXNTaG93biA9IGZhbHNlOyAvLyBoaWRlIGNhbGVuZGFyc1xyXG5cdFx0fVxyXG5cdFx0dGhpcy5yYW5nZUNsaWNrZWQuZW1pdCh7IGxhYmVsOiBwcmVzZXQubGFiZWwsIGRhdGVzOiBwcmVzZXQucmFuZ2UgfSk7XHJcblx0XHRpZiAoIXRoaXMua2VlcENhbGVuZGFyT3BlbmluZ1dpdGhSYW5nZSkge1xyXG5cdFx0XHR0aGlzLmNsaWNrQXBwbHkoKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGlmICghdGhpcy5hbHdheXNTaG93Q2FsZW5kYXJzKSB7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMuY2xpY2tBcHBseSgpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmICh0aGlzLm1heERhdGUgJiYgdGhpcy5tYXhEYXRlLmlzU2FtZShwcmVzZXQucmFuZ2Uuc3RhcnQsICdtb250aCcpKSB7XHJcblx0XHRcdFx0dGhpcy5yaWdodENhbGVuZGFyLm1vbnRoLm1vbnRoKHByZXNldC5yYW5nZS5zdGFydC5tb250aCgpKTtcclxuXHRcdFx0XHR0aGlzLnJpZ2h0Q2FsZW5kYXIubW9udGgueWVhcihwcmVzZXQucmFuZ2Uuc3RhcnQueWVhcigpKTtcclxuXHRcdFx0XHR0aGlzLmxlZnRDYWxlbmRhci5tb250aC5tb250aChwcmVzZXQucmFuZ2Uuc3RhcnQubW9udGgoKSAtIDEpO1xyXG5cdFx0XHRcdHRoaXMubGVmdENhbGVuZGFyLm1vbnRoLnllYXIocHJlc2V0LnJhbmdlLmVuZC55ZWFyKCkpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHRoaXMubGVmdENhbGVuZGFyLm1vbnRoLm1vbnRoKHByZXNldC5yYW5nZS5zdGFydC5tb250aCgpKTtcclxuXHRcdFx0XHR0aGlzLmxlZnRDYWxlbmRhci5tb250aC55ZWFyKHByZXNldC5yYW5nZS5zdGFydC55ZWFyKCkpO1xyXG5cdFx0XHRcdC8vIGdldCB0aGUgbmV4dCB5ZWFyXHJcblx0XHRcdFx0Y29uc3QgbmV4dE1vbnRoID0gcHJlc2V0LnJhbmdlLnN0YXJ0LmNsb25lKCkuYWRkKDEsICdtb250aCcpO1xyXG5cdFx0XHRcdHRoaXMucmlnaHRDYWxlbmRhci5tb250aC5tb250aChuZXh0TW9udGgubW9udGgoKSk7XHJcblx0XHRcdFx0dGhpcy5yaWdodENhbGVuZGFyLm1vbnRoLnllYXIobmV4dE1vbnRoLnllYXIoKSk7XHJcblx0XHRcdH1cclxuXHRcdFx0dGhpcy51cGRhdGVDYWxlbmRhcnMoKTtcclxuXHRcdFx0aWYgKHRoaXMudGltZVBpY2tlcikge1xyXG5cdFx0XHRcdHRoaXMucmVuZGVyVGltZVBpY2tlcihTaWRlRW51bS5sZWZ0KTtcclxuXHRcdFx0XHR0aGlzLnJlbmRlclRpbWVQaWNrZXIoU2lkZUVudW0ucmlnaHQpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRzaG93KGU/KSB7XHJcblx0XHRpZiAodGhpcy5pc1Nob3duKSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHRcdHRoaXMuX29sZC5zdGFydCA9IHRoaXMuc3RhcnREYXRlLmNsb25lKCk7XHJcblx0XHR0aGlzLl9vbGQuZW5kID0gdGhpcy5lbmREYXRlLmNsb25lKCk7XHJcblx0XHR0aGlzLmlzU2hvd24gPSB0cnVlO1xyXG5cdFx0aWYgKHRoaXMuaXNGdWxsU2NyZWVuUGlja2VyKSB7XHJcblx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xyXG5cdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzY3JvbGwtYm9keScpLnNjcm9sbFRvKHsgdG9wOiAxNTAgfSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdFx0dGhpcy51cGRhdGVWaWV3KCk7XHJcblx0fVxyXG5cclxuXHRoaWRlKGU/KSB7XHJcblx0XHRpZiAoIXRoaXMuaXNTaG93bikge1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblx0XHQvLyBpbmNvbXBsZXRlIGRhdGUgc2VsZWN0aW9uLCByZXZlcnQgdG8gbGFzdCB2YWx1ZXNcclxuXHRcdGlmICghdGhpcy5lbmREYXRlKSB7XHJcblx0XHRcdGlmICh0aGlzLl9vbGQuc3RhcnQpIHtcclxuXHRcdFx0XHR0aGlzLnN0YXJ0RGF0ZSA9IHRoaXMuX29sZC5zdGFydC5jbG9uZSgpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmICh0aGlzLl9vbGQuZW5kKSB7XHJcblx0XHRcdFx0dGhpcy5lbmREYXRlID0gdGhpcy5fb2xkLmVuZC5jbG9uZSgpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gaWYgYSBuZXcgZGF0ZSByYW5nZSB3YXMgc2VsZWN0ZWQsIGludm9rZSB0aGUgdXNlciBjYWxsYmFjayBmdW5jdGlvblxyXG5cdFx0aWYgKCF0aGlzLnN0YXJ0RGF0ZS5pc1NhbWUodGhpcy5fb2xkLnN0YXJ0KSB8fCAhdGhpcy5lbmREYXRlLmlzU2FtZSh0aGlzLl9vbGQuZW5kKSkge1xyXG5cdFx0XHQvLyB0aGlzLmNhbGxiYWNrKHRoaXMuc3RhcnREYXRlLCB0aGlzLmVuZERhdGUsIHRoaXMuY2hvc2VuTGFiZWwpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGlmIHBpY2tlciBpcyBhdHRhY2hlZCB0byBhIHRleHQgaW5wdXQsIHVwZGF0ZSBpdFxyXG5cdFx0dGhpcy51cGRhdGVFbGVtZW50KCk7XHJcblx0XHR0aGlzLmlzU2hvd24gPSBmYWxzZTtcclxuXHRcdHRoaXMuX3JlZi5kZXRlY3RDaGFuZ2VzKCk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBoYW5kbGUgY2xpY2sgb24gYWxsIGVsZW1lbnQgaW4gdGhlIGNvbXBvbmVudCwgdXNlZnVsIGZvciBvdXRzaWRlIG9mIGNsaWNrXHJcblx0ICogQHBhcmFtIGUgZXZlbnRcclxuXHQgKi9cclxuXHRoYW5kbGVJbnRlcm5hbENsaWNrKGUpIHtcclxuXHRcdGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblx0fVxyXG5cdC8qKlxyXG5cdCAqIHVwZGF0ZSB0aGUgbG9jYWxlIG9wdGlvbnNcclxuXHQgKiBAcGFyYW0gbG9jYWxlXHJcblx0ICovXHJcblx0dXBkYXRlTG9jYWxlKGxvY2FsZSkge1xyXG5cdFx0Zm9yIChjb25zdCBrZXkgaW4gbG9jYWxlKSB7XHJcblx0XHRcdGlmIChsb2NhbGUuaGFzT3duUHJvcGVydHkoa2V5KSkge1xyXG5cdFx0XHRcdHRoaXMubG9jYWxlW2tleV0gPSBsb2NhbGVba2V5XTtcclxuXHRcdFx0XHRpZiAoa2V5ID09PSAnY3VzdG9tUmFuZ2VMYWJlbCcpIHtcclxuXHRcdFx0XHRcdHRoaXMucmVuZGVyUmFuZ2VzKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cdC8qKlxyXG5cdCAqICBjbGVhciB0aGUgZGF0ZXJhbmdlIHBpY2tlclxyXG5cdCAqL1xyXG5cdGNsZWFyKCkge1xyXG5cdFx0dGhpcy5zdGFydERhdGUgPSBtb21lbnQoKS5zdGFydE9mKCdkYXknKTtcclxuXHRcdHRoaXMuZW5kRGF0ZSA9IG1vbWVudCgpLmVuZE9mKCdkYXknKTtcclxuXHRcdHRoaXMudXBkYXRlQ2FsZW5kYXJzKCk7XHJcblx0XHR0aGlzLnVwZGF0ZVZpZXcoKTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIEZpbmQgb3V0IGlmIHRoZSBzZWxlY3RlZCByYW5nZSBzaG91bGQgYmUgZGlzYWJsZWQgaWYgaXQgZG9lc24ndFxyXG5cdCAqIGZpdCBpbnRvIG1pbkRhdGUgYW5kIG1heERhdGUgbGltaXRhdGlvbnMuXHJcblx0ICovXHJcblx0ZGlzYWJsZVJhbmdlKHByZXNldCkge1xyXG5cdFx0aWYgKHByZXNldC5sYWJlbCA9PT0gdGhpcy5sb2NhbGUuY3VzdG9tUmFuZ2VMYWJlbCkge1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc3QgYXJlQm90aEJlZm9yZSA9IHRoaXMubWluRGF0ZVxyXG5cdFx0XHQmJiBwcmVzZXQucmFuZ2Uuc3RhcnQuaXNCZWZvcmUodGhpcy5taW5EYXRlKVxyXG5cdFx0XHQmJiBwcmVzZXQucmFuZ2UuZW5kLmlzQmVmb3JlKHRoaXMubWluRGF0ZSk7XHJcblxyXG5cdFx0Y29uc3QgYXJlQm90aEFmdGVyID0gdGhpcy5tYXhEYXRlXHJcblx0XHRcdCYmIHByZXNldC5yYW5nZS5zdGFydC5pc0FmdGVyKHRoaXMubWF4RGF0ZSlcclxuXHRcdFx0JiYgcHJlc2V0LnJhbmdlLmVuZC5pc0FmdGVyKHRoaXMubWF4RGF0ZSk7XHJcblxyXG5cdFx0cmV0dXJuIGFyZUJvdGhCZWZvcmUgfHwgYXJlQm90aEFmdGVyO1xyXG5cdH1cclxuXHQvKipcclxuXHQgKlxyXG5cdCAqIEBwYXJhbSBkYXRlIHRoZSBkYXRlIHRvIGFkZCB0aW1lXHJcblx0ICogQHBhcmFtIHNpZGUgbGVmdCBvciByaWdodFxyXG5cdCAqL1xyXG5cdHByaXZhdGUgX2dldERhdGVXaXRoVGltZShkYXRlLCBzaWRlOiBTaWRlRW51bSk6IF9tb21lbnQuTW9tZW50IHtcclxuXHRcdGxldCBob3VyID0gcGFyc2VJbnQodGhpcy50aW1lcGlja2VyVmFyaWFibGVzW3NpZGVdLnNlbGVjdGVkSG91ciwgMTApO1xyXG5cdFx0aWYgKCF0aGlzLnRpbWVQaWNrZXIyNEhvdXIpIHtcclxuXHRcdFx0Y29uc3QgYW1wbSA9IHRoaXMudGltZXBpY2tlclZhcmlhYmxlc1tzaWRlXS5hbXBtTW9kZWw7XHJcblx0XHRcdGlmIChhbXBtID09PSAnUE0nICYmIGhvdXIgPCAxMikge1xyXG5cdFx0XHRcdGhvdXIgKz0gMTI7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKGFtcG0gPT09ICdBTScgJiYgaG91ciA9PT0gMTIpIHtcclxuXHRcdFx0XHRob3VyID0gMDtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0Y29uc3QgbWludXRlID0gcGFyc2VJbnQodGhpcy50aW1lcGlja2VyVmFyaWFibGVzW3NpZGVdLnNlbGVjdGVkTWludXRlLCAxMCk7XHJcblx0XHRjb25zdCBzZWNvbmQgPSB0aGlzLnRpbWVQaWNrZXJTZWNvbmRzID8gcGFyc2VJbnQodGhpcy50aW1lcGlja2VyVmFyaWFibGVzW3NpZGVdLnNlbGVjdGVkU2Vjb25kLCAxMCkgOiAwO1xyXG5cdFx0cmV0dXJuIGRhdGVcclxuXHRcdFx0LmNsb25lKClcclxuXHRcdFx0LmhvdXIoaG91cilcclxuXHRcdFx0Lm1pbnV0ZShtaW51dGUpXHJcblx0XHRcdC5zZWNvbmQoc2Vjb25kKTtcclxuXHR9XHJcblx0LyoqXHJcblx0ICogIGJ1aWxkIHRoZSBsb2NhbGUgY29uZmlnXHJcblx0ICovXHJcblx0cHJpdmF0ZSBfYnVpbGRMb2NhbGUoKSB7XHJcblx0XHR0aGlzLmxvY2FsZSA9IHsgLi4udGhpcy5fbG9jYWxlU2VydmljZS5jb25maWcsIC4uLnRoaXMubG9jYWxlIH07XHJcblx0XHRpZiAoIXRoaXMubG9jYWxlLmZvcm1hdCkge1xyXG5cdFx0XHRpZiAodGhpcy50aW1lUGlja2VyKSB7XHJcblx0XHRcdFx0dGhpcy5sb2NhbGUuZm9ybWF0ID0gbW9tZW50LmxvY2FsZURhdGEoKS5sb25nRGF0ZUZvcm1hdCgnbGxsJyk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dGhpcy5sb2NhbGUuZm9ybWF0ID0gbW9tZW50LmxvY2FsZURhdGEoKS5sb25nRGF0ZUZvcm1hdCgnTCcpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cdHByaXZhdGUgX2J1aWxkQ2VsbHMoY2FsZW5kYXIsIHNpZGU6IFNpZGVFbnVtKSB7XHJcblx0XHRmb3IgKGxldCByb3cgPSAwOyByb3cgPCA2OyByb3crKykge1xyXG5cdFx0XHR0aGlzLmNhbGVuZGFyVmFyaWFibGVzW3NpZGVdLmNsYXNzZXNbcm93XSA9IHt9O1xyXG5cdFx0XHRsZXQgY29sT2ZmQ291bnQgPSAwO1xyXG5cdFx0XHRjb25zdCByb3dDbGFzc2VzID0gW107XHJcblx0XHRcdGlmIChcclxuXHRcdFx0XHR0aGlzLmVtcHR5V2Vla1Jvd0NsYXNzICYmXHJcblx0XHRcdFx0IXRoaXMuaGFzQ3VycmVudE1vbnRoRGF5cyh0aGlzLmNhbGVuZGFyVmFyaWFibGVzW3NpZGVdLm1vbnRoLCBjYWxlbmRhcltyb3ddKVxyXG5cdFx0XHQpIHtcclxuXHRcdFx0XHRyb3dDbGFzc2VzLnB1c2godGhpcy5lbXB0eVdlZWtSb3dDbGFzcyk7XHJcblx0XHRcdH1cclxuXHRcdFx0Zm9yIChsZXQgY29sID0gMDsgY29sIDwgNzsgY29sKyspIHtcclxuXHRcdFx0XHRjb25zdCBjbGFzc2VzID0gW107XHJcblx0XHRcdFx0Ly8gaGlnaGxpZ2h0IHRvZGF5J3MgZGF0ZVxyXG5cdFx0XHRcdGlmIChjYWxlbmRhcltyb3ddW2NvbF0uaXNTYW1lKG5ldyBEYXRlKCksICdkYXknKSkge1xyXG5cdFx0XHRcdFx0Y2xhc3Nlcy5wdXNoKCd0b2RheScpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQvLyBoaWdobGlnaHQgd2Vla2VuZHNcclxuXHRcdFx0XHRpZiAoY2FsZW5kYXJbcm93XVtjb2xdLmlzb1dlZWtkYXkoKSA+IDUpIHtcclxuXHRcdFx0XHRcdGNsYXNzZXMucHVzaCgnd2Vla2VuZCcpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQvLyBncmV5IG91dCB0aGUgZGF0ZXMgaW4gb3RoZXIgbW9udGhzIGRpc3BsYXllZCBhdCBiZWdpbm5pbmcgYW5kIGVuZCBvZiB0aGlzIGNhbGVuZGFyXHJcblx0XHRcdFx0aWYgKGNhbGVuZGFyW3Jvd11bY29sXS5tb250aCgpICE9PSBjYWxlbmRhclsxXVsxXS5tb250aCgpKSB7XHJcblx0XHRcdFx0XHRjbGFzc2VzLnB1c2goJ29mZicsICdkaXNhYmxlZCcsICdoaWRkZW4nKTtcclxuXHRcdFx0XHRcdGNvbE9mZkNvdW50Kys7XHJcblxyXG5cdFx0XHRcdFx0Ly8gbWFyayB0aGUgbGFzdCBkYXkgb2YgdGhlIHByZXZpb3VzIG1vbnRoIGluIHRoaXMgY2FsZW5kYXJcclxuXHRcdFx0XHRcdGlmIChcclxuXHRcdFx0XHRcdFx0dGhpcy5sYXN0RGF5T2ZQcmV2aW91c01vbnRoQ2xhc3MgJiZcclxuXHRcdFx0XHRcdFx0KGNhbGVuZGFyW3Jvd11bY29sXS5tb250aCgpIDwgY2FsZW5kYXJbMV1bMV0ubW9udGgoKSB8fCBjYWxlbmRhclsxXVsxXS5tb250aCgpID09PSAwKSAmJlxyXG5cdFx0XHRcdFx0XHRjYWxlbmRhcltyb3ddW2NvbF0uZGF0ZSgpID09PSB0aGlzLmNhbGVuZGFyVmFyaWFibGVzW3NpZGVdLmRheXNJbkxhc3RNb250aFxyXG5cdFx0XHRcdFx0KSB7XHJcblx0XHRcdFx0XHRcdGNsYXNzZXMucHVzaCh0aGlzLmxhc3REYXlPZlByZXZpb3VzTW9udGhDbGFzcyk7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0Ly8gbWFyayB0aGUgZmlyc3QgZGF5IG9mIHRoZSBuZXh0IG1vbnRoIGluIHRoaXMgY2FsZW5kYXJcclxuXHRcdFx0XHRcdGlmIChcclxuXHRcdFx0XHRcdFx0dGhpcy5maXJzdERheU9mTmV4dE1vbnRoQ2xhc3MgJiZcclxuXHRcdFx0XHRcdFx0KGNhbGVuZGFyW3Jvd11bY29sXS5tb250aCgpID4gY2FsZW5kYXJbMV1bMV0ubW9udGgoKSB8fCBjYWxlbmRhcltyb3ddW2NvbF0ubW9udGgoKSA9PT0gMCkgJiZcclxuXHRcdFx0XHRcdFx0Y2FsZW5kYXJbcm93XVtjb2xdLmRhdGUoKSA9PT0gMVxyXG5cdFx0XHRcdFx0KSB7XHJcblx0XHRcdFx0XHRcdGNsYXNzZXMucHVzaCh0aGlzLmZpcnN0RGF5T2ZOZXh0TW9udGhDbGFzcyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdC8vIG1hcmsgdGhlIGZpcnN0IGRheSBvZiB0aGUgY3VycmVudCBtb250aCB3aXRoIGEgY3VzdG9tIGNsYXNzXHJcblx0XHRcdFx0aWYgKFxyXG5cdFx0XHRcdFx0dGhpcy5maXJzdE1vbnRoRGF5Q2xhc3MgJiZcclxuXHRcdFx0XHRcdGNhbGVuZGFyW3Jvd11bY29sXS5tb250aCgpID09PSBjYWxlbmRhclsxXVsxXS5tb250aCgpICYmXHJcblx0XHRcdFx0XHRjYWxlbmRhcltyb3ddW2NvbF0uZGF0ZSgpID09PSBjYWxlbmRhci5maXJzdERheS5kYXRlKClcclxuXHRcdFx0XHQpIHtcclxuXHRcdFx0XHRcdGNsYXNzZXMucHVzaCh0aGlzLmZpcnN0TW9udGhEYXlDbGFzcyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdC8vIG1hcmsgdGhlIGxhc3QgZGF5IG9mIHRoZSBjdXJyZW50IG1vbnRoIHdpdGggYSBjdXN0b20gY2xhc3NcclxuXHRcdFx0XHRpZiAoXHJcblx0XHRcdFx0XHR0aGlzLmxhc3RNb250aERheUNsYXNzICYmXHJcblx0XHRcdFx0XHRjYWxlbmRhcltyb3ddW2NvbF0ubW9udGgoKSA9PT0gY2FsZW5kYXJbMV1bMV0ubW9udGgoKSAmJlxyXG5cdFx0XHRcdFx0Y2FsZW5kYXJbcm93XVtjb2xdLmRhdGUoKSA9PT0gY2FsZW5kYXIubGFzdERheS5kYXRlKClcclxuXHRcdFx0XHQpIHtcclxuXHRcdFx0XHRcdGNsYXNzZXMucHVzaCh0aGlzLmxhc3RNb250aERheUNsYXNzKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Ly8gZG9uJ3QgYWxsb3cgc2VsZWN0aW9uIG9mIGRhdGVzIGJlZm9yZSB0aGUgbWluaW11bSBkYXRlXHJcblx0XHRcdFx0aWYgKHRoaXMubWluRGF0ZSAmJiBjYWxlbmRhcltyb3ddW2NvbF0uaXNCZWZvcmUodGhpcy5taW5EYXRlLCAnZGF5JykpIHtcclxuXHRcdFx0XHRcdGNsYXNzZXMucHVzaCgnb2ZmJywgJ2Rpc2FibGVkJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdC8vIGRvbid0IGFsbG93IHNlbGVjdGlvbiBvZiBkYXRlcyBhZnRlciB0aGUgbWF4aW11bSBkYXRlXHJcblx0XHRcdFx0aWYgKFxyXG5cdFx0XHRcdFx0dGhpcy5jYWxlbmRhclZhcmlhYmxlc1tzaWRlXS5tYXhEYXRlICYmXHJcblx0XHRcdFx0XHRjYWxlbmRhcltyb3ddW2NvbF0uaXNBZnRlcih0aGlzLmNhbGVuZGFyVmFyaWFibGVzW3NpZGVdLm1heERhdGUsICdkYXknKVxyXG5cdFx0XHRcdCkge1xyXG5cdFx0XHRcdFx0Y2xhc3Nlcy5wdXNoKCdvZmYnLCAnZGlzYWJsZWQnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Ly8gZG9uJ3QgYWxsb3cgc2VsZWN0aW9uIG9mIGRhdGUgaWYgYSBjdXN0b20gZnVuY3Rpb24gZGVjaWRlcyBpdCdzIGludmFsaWRcclxuXHRcdFx0XHRpZiAodGhpcy5pc0ludmFsaWREYXRlKGNhbGVuZGFyW3Jvd11bY29sXSkpIHtcclxuXHRcdFx0XHRcdGNsYXNzZXMucHVzaCgnb2ZmJywgJ2Rpc2FibGVkJywgJ2ludmFsaWQnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Ly8gaGlnaGxpZ2h0IHRoZSBjdXJyZW50bHkgc2VsZWN0ZWQgc3RhcnQgZGF0ZVxyXG5cdFx0XHRcdGlmICh0aGlzLnN0YXJ0RGF0ZSAmJiBjYWxlbmRhcltyb3ddW2NvbF0uZm9ybWF0KCdZWVlZLU1NLUREJykgPT09IHRoaXMuc3RhcnREYXRlLmZvcm1hdCgnWVlZWS1NTS1ERCcpKSB7XHJcblx0XHRcdFx0XHRjbGFzc2VzLnB1c2goJ2FjdGl2ZScsICdzdGFydC1kYXRlJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdC8vIGhpZ2hsaWdodCB0aGUgY3VycmVudGx5IHNlbGVjdGVkIGVuZCBkYXRlXHJcblx0XHRcdFx0aWYgKFxyXG5cdFx0XHRcdFx0dGhpcy5lbmREYXRlICE9IG51bGwgJiZcclxuXHRcdFx0XHRcdGNhbGVuZGFyW3Jvd11bY29sXS5mb3JtYXQoJ1lZWVktTU0tREQnKSA9PT0gdGhpcy5lbmREYXRlLmZvcm1hdCgnWVlZWS1NTS1ERCcpXHJcblx0XHRcdFx0KSB7XHJcblx0XHRcdFx0XHRjbGFzc2VzLnB1c2goJ2FjdGl2ZScsICdlbmQtZGF0ZScpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQvLyBoaWdobGlnaHQgZGF0ZXMgaW4tYmV0d2VlbiB0aGUgc2VsZWN0ZWQgZGF0ZXNcclxuXHRcdFx0XHRpZiAoXHJcblx0XHRcdFx0XHR0aGlzLmVuZERhdGUgIT0gbnVsbCAmJlxyXG5cdFx0XHRcdFx0Y2FsZW5kYXJbcm93XVtjb2xdLmlzQWZ0ZXIodGhpcy5zdGFydERhdGUsICdkYXknKSAmJlxyXG5cdFx0XHRcdFx0Y2FsZW5kYXJbcm93XVtjb2xdLmlzQmVmb3JlKHRoaXMuZW5kRGF0ZSwgJ2RheScpXHJcblx0XHRcdFx0KSB7XHJcblx0XHRcdFx0XHRjbGFzc2VzLnB1c2goJ2luLXJhbmdlJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdC8vIGFwcGx5IGN1c3RvbSBjbGFzc2VzIGZvciB0aGlzIGRhdGVcclxuXHRcdFx0XHRjb25zdCBpc0N1c3RvbSA9IHRoaXMuaXNDdXN0b21EYXRlKGNhbGVuZGFyW3Jvd11bY29sXSk7XHJcblx0XHRcdFx0aWYgKGlzQ3VzdG9tICE9PSBmYWxzZSkge1xyXG5cdFx0XHRcdFx0aWYgKHR5cGVvZiBpc0N1c3RvbSA9PT0gJ3N0cmluZycpIHtcclxuXHRcdFx0XHRcdFx0Y2xhc3Nlcy5wdXNoKGlzQ3VzdG9tKTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KGNsYXNzZXMsIGlzQ3VzdG9tKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Ly8gc3RvcmUgY2xhc3NlcyB2YXJcclxuXHRcdFx0XHRsZXQgY25hbWUgPSAnJyxcclxuXHRcdFx0XHRcdGRpc2FibGVkID0gZmFsc2U7XHJcblx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBjbGFzc2VzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0XHRjbmFtZSArPSBjbGFzc2VzW2ldICsgJyAnO1xyXG5cdFx0XHRcdFx0aWYgKGNsYXNzZXNbaV0gPT09ICdkaXNhYmxlZCcpIHtcclxuXHRcdFx0XHRcdFx0ZGlzYWJsZWQgPSB0cnVlO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAoIWRpc2FibGVkKSB7XHJcblx0XHRcdFx0XHRjbmFtZSArPSAnYXZhaWxhYmxlJztcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dGhpcy5jYWxlbmRhclZhcmlhYmxlc1tzaWRlXS5jbGFzc2VzW3Jvd11bY29sXSA9IGNuYW1lLnJlcGxhY2UoL15cXHMrfFxccyskL2csICcnKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoY29sT2ZmQ291bnQgPT09IDcpIHtcclxuXHRcdFx0XHRyb3dDbGFzc2VzLnB1c2goJ29mZicpO1xyXG5cdFx0XHRcdHJvd0NsYXNzZXMucHVzaCgnZGlzYWJsZWQnKTtcclxuXHRcdFx0XHRyb3dDbGFzc2VzLnB1c2goJ2hpZGRlbicpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHRoaXMuY2FsZW5kYXJWYXJpYWJsZXNbc2lkZV0uY2xhc3Nlc1tyb3ddLmNsYXNzTGlzdCA9IHJvd0NsYXNzZXMuam9pbignICcpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogRmluZCBvdXQgaWYgdGhlIGN1cnJlbnQgY2FsZW5kYXIgcm93IGhhcyBjdXJyZW50IG1vbnRoIGRheXNcclxuXHQgKiAoYXMgb3Bwb3NlZCB0byBjb25zaXN0aW5nIG9mIG9ubHkgcHJldmlvdXMvbmV4dCBtb250aCBkYXlzKVxyXG5cdCAqL1xyXG5cdGhhc0N1cnJlbnRNb250aERheXMoY3VycmVudE1vbnRoLCByb3cpIHtcclxuXHRcdGZvciAobGV0IGRheSA9IDA7IGRheSA8IDc7IGRheSsrKSB7XHJcblx0XHRcdGlmIChyb3dbZGF5XS5tb250aCgpID09PSBjdXJyZW50TW9udGgpIHtcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH1cclxuXHRzY3JvbGxEZXRlY3Rpb24oZXZlbnQpOiB2b2lkIHtcclxuXHRcdGNvbnN0IHNjcm9sbEJvZHlUb3AgPSBldmVudC50YXJnZXQuc2Nyb2xsVG9wO1xyXG5cdFx0Y29uc3Qgc2Nyb2xsQm9keUJvdHRvbSA9IHNjcm9sbEJvZHlUb3AgKyBldmVudC50YXJnZXQuY2xpZW50SGVpZ2h0ICsgMTtcclxuXHJcblx0XHRpZiAoc2Nyb2xsQm9keVRvcCA8PSAwKSB7XHJcblx0XHRcdHRoaXMuY2xpY2tQcmV2KFNpZGVFbnVtLmxlZnQpO1xyXG5cdFx0XHRldmVudC50YXJnZXQuc2Nyb2xsVG9wID0gMTUwO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChzY3JvbGxCb2R5Qm90dG9tID49IGV2ZW50LnRhcmdldC5zY3JvbGxIZWlnaHQpIHtcclxuXHRcdFx0dGhpcy5jbGlja05leHQoU2lkZUVudW0ucmlnaHQpO1xyXG5cdFx0XHRldmVudC50YXJnZXQuc2Nyb2xsVG9wID0gZXZlbnQudGFyZ2V0LnNjcm9sbFRvcCAtIDE1MDtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuIl19