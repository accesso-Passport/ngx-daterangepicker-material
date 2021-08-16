(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/common'), require('@angular/core'), require('@angular/forms'), require('@angular/material/divider'), require('@angular/material/select'), require('@angular/material/button'), require('@angular/material/card'), require('@angular/material/datepicker'), require('@angular/material/form-field'), require('@angular/material/icon'), require('@angular/material/input'), require('moment')) :
    typeof define === 'function' && define.amd ? define('ngx-daterangepicker-material', ['exports', '@angular/common', '@angular/core', '@angular/forms', '@angular/material/divider', '@angular/material/select', '@angular/material/button', '@angular/material/card', '@angular/material/datepicker', '@angular/material/form-field', '@angular/material/icon', '@angular/material/input', 'moment'], factory) :
    (global = global || self, factory(global['ngx-daterangepicker-material'] = {}, global.ng.common, global.ng.core, global.ng.forms, global.ng.material.divider, global.ng.material.select, global.ng.material.button, global.ng.material.card, global.ng.material.datepicker, global.ng.material['form-field'], global.ng.material.icon, global.ng.material.input, global.moment));
}(this, (function (exports, common, core, forms, divider, select, button, card, datepicker, formField, icon, input, _moment) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __rest(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }

    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }

    function __param(paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    }

    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
    }

    function __awaiter(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    function __exportStar(m, exports) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }

    function __values(o) {
        var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
        if (m) return m.call(o);
        return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
    }

    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    }

    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }

    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    };

    function __await(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    }

    function __asyncGenerator(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
    }

    function __asyncDelegator(o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    }

    function __asyncValues(o) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
    }

    function __makeTemplateObject(cooked, raw) {
        if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
        return cooked;
    };

    function __importStar(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
        result.default = mod;
        return result;
    }

    function __importDefault(mod) {
        return (mod && mod.__esModule) ? mod : { default: mod };
    }

    var moment = _moment;
    var LOCALE_CONFIG = new core.InjectionToken('daterangepicker.config');
    /**
     *  DefaultLocaleConfig
     */
    var DefaultLocaleConfig = {
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

    var LocaleService = /** @class */ (function () {
        function LocaleService(_config) {
            this._config = _config;
        }
        Object.defineProperty(LocaleService.prototype, "config", {
            get: function () {
                return __assign({}, DefaultLocaleConfig, this._config);
            },
            enumerable: true,
            configurable: true
        });
        LocaleService.ctorParameters = function () { return [
            { type: undefined, decorators: [{ type: core.Inject, args: [LOCALE_CONFIG,] }] }
        ]; };
        LocaleService = __decorate([
            core.Injectable(),
            __param(0, core.Inject(LOCALE_CONFIG))
        ], LocaleService);
        return LocaleService;
    }());

    var moment$1 = _moment;
    var SideEnum;
    (function (SideEnum) {
        SideEnum["left"] = "left";
        SideEnum["right"] = "right";
    })(SideEnum || (SideEnum = {}));
    var DateRangePickerComponent = /** @class */ (function () {
        function DateRangePickerComponent(el, _ref, _localeService) {
            this.el = el;
            this._ref = _ref;
            this._localeService = _localeService;
            this._old = { start: null, end: null };
            this.calendarVariables = { left: {}, right: {} };
            this.timepickerVariables = { left: {}, right: {} };
            this.daterangepicker = { start: new forms.FormControl(), end: new forms.FormControl() };
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
            this.choosedDate = new core.EventEmitter();
            this.rangeClicked = new core.EventEmitter();
            this.datesUpdated = new core.EventEmitter();
            this.startDateChanged = new core.EventEmitter();
            this.endDateChanged = new core.EventEmitter();
        }
        DateRangePickerComponent_1 = DateRangePickerComponent;
        Object.defineProperty(DateRangePickerComponent.prototype, "locale", {
            get: function () {
                return this._locale;
            },
            set: function (value) {
                this._locale = __assign({}, this._localeService.config, value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DateRangePickerComponent.prototype, "ranges", {
            get: function () {
                return this._ranges;
            },
            set: function (value) {
                this._ranges = value;
                this.renderRanges();
            },
            enumerable: true,
            configurable: true
        });
        DateRangePickerComponent.prototype.ngOnInit = function () {
            this._buildLocale();
            var daysOfWeek = __spread(this.locale.daysOfWeek);
            if (this.locale.firstDay !== 0) {
                var iterator = this.locale.firstDay;
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
        };
        DateRangePickerComponent.prototype.renderRanges = function () {
            var _this = this;
            var start, end;
            this.ranges.forEach(function (preset) {
                start = preset.range.start;
                end = preset.range.end;
                // If the start or end date exceed those allowed by the minDate
                // option, shorten the range to the allowable period.
                if (_this.minDate && start.isBefore(_this.minDate)) {
                    start = _this.minDate.clone();
                }
                var maxDate = _this.maxDate;
                if (maxDate && end.isAfter(maxDate)) {
                    end = maxDate.clone();
                }
                // If the end of the range is before the minimum or the start of the range is
                // after the maximum, don't display this range option at all.
                if ((_this.minDate && end.isBefore(_this.minDate, _this.timePicker ? 'minute' : 'day')) ||
                    (maxDate && end.isAfter(maxDate, _this.timePicker ? 'minute' : 'day'))) {
                    // continue;
                }
                else {
                    // Support unicode chars in the range names.
                    var elem = document.createElement('textarea');
                    elem.innerHTML = preset.label;
                    preset.label = elem.value;
                }
            });
            this.showCalInRanges = true;
            if (!this.timePicker) {
                this.startDate = this.startDate.startOf('day');
                this.endDate = this.endDate.endOf('day');
            }
        };
        DateRangePickerComponent.prototype.renderTimePicker = function (side) {
            if (side === SideEnum.right && !this.endDate) {
                return;
            }
            var selected, minDate;
            var maxDate = this.maxDate;
            if (side === SideEnum.left) {
                (selected = this.startDate.clone()), (minDate = this.minDate);
            }
            else if (side === SideEnum.right) {
                (selected = this.endDate.clone()), (minDate = this.startDate);
            }
            var start = this.timePicker24Hour ? 0 : 1;
            var end = this.timePicker24Hour ? 23 : 12;
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
            for (var i = start; i <= end; i++) {
                var i_in_24 = i;
                if (!this.timePicker24Hour) {
                    i_in_24 = selected.hour() >= 12 ? (i === 12 ? 12 : i + 12) : i === 12 ? 0 : i;
                }
                var time = selected.clone().hour(i_in_24);
                var disabled = false;
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
            for (var i = 0; i < 60; i += this.timePickerIncrement) {
                var padded = i < 10 ? '0' + i : i;
                var time = selected.clone().minute(i);
                var disabled = false;
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
                for (var i = 0; i < 60; i++) {
                    var padded = i < 10 ? '0' + i : i;
                    var time = selected.clone().second(i);
                    var disabled = false;
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
        };
        DateRangePickerComponent.prototype.renderCalendar = function (side) {
            var mainCalendar = side === SideEnum.left ? this.leftCalendar : this.rightCalendar;
            var month = mainCalendar.month.month();
            var year = mainCalendar.month.year();
            var hour = mainCalendar.month.hour();
            var minute = mainCalendar.month.minute();
            var second = mainCalendar.month.second();
            var daysInMonth = moment$1([year, month]).daysInMonth();
            var firstDay = moment$1([year, month, 1]);
            var lastDay = moment$1([year, month, daysInMonth]);
            var lastMonth = moment$1(firstDay)
                .subtract(1, 'month')
                .month();
            var lastYear = moment$1(firstDay)
                .subtract(1, 'month')
                .year();
            var daysInLastMonth = moment$1([lastYear, lastMonth]).daysInMonth();
            var dayOfWeek = firstDay.day();
            // initialize a 6 rows x 7 columns array for the calendar
            var calendar = [];
            calendar.firstDay = firstDay;
            calendar.lastDay = lastDay;
            for (var i = 0; i < 6; i++) {
                calendar[i] = [];
            }
            // populate the calendar with date objects
            var startDay = daysInLastMonth - dayOfWeek + this.locale.firstDay + 1;
            if (startDay > daysInLastMonth) {
                startDay -= 7;
            }
            if (dayOfWeek === this.locale.firstDay) {
                startDay = daysInLastMonth - 6;
            }
            var curDate = moment$1([lastYear, lastMonth, startDay, 12, minute, second]);
            for (var i = 0, col = 0, row = 0; i < 42; i++, col++, curDate = moment$1(curDate).add(24, 'hour')) {
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
            var minDate = side === 'left' ? this.minDate : this.startDate.clone();
            if (this.leftCalendar.month && minDate && this.leftCalendar.month.year() < minDate.year()) {
                minDate.year(this.leftCalendar.month.year());
            }
            var maxDate = this.maxDate;
            // adjust maxDate to reflect the dateLimit setting in order to
            // grey out end dates beyond the dateLimit
            if (this.endDate === null && this.dateLimit) {
                var maxLimit = this.startDate
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
                var currentMonth = calendar[1][1].month();
                var currentYear = calendar[1][1].year();
                var realCurrentYear = moment$1().year();
                var maxYear = (maxDate && maxDate.year()) || realCurrentYear + 5;
                var minYear = (minDate && minDate.year()) || realCurrentYear - 100;
                var inMinYear = currentYear === minYear;
                var inMaxYear = currentYear === maxYear;
                var years = [];
                for (var y = minYear; y <= maxYear; y++) {
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
        };
        DateRangePickerComponent.prototype.setStartDate = function (startDate) {
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
        };
        DateRangePickerComponent.prototype.setEndDate = function (endDate) {
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
        };
        DateRangePickerComponent.prototype.isInvalidDate = function (date) {
            return false;
        };
        DateRangePickerComponent.prototype.isCustomDate = function (date) {
            return false;
        };
        DateRangePickerComponent.prototype.updateView = function () {
            if (this.timePicker) {
                this.renderTimePicker(SideEnum.left);
                this.renderTimePicker(SideEnum.right);
            }
            this.updateMonthsInView();
            this.updateCalendars();
        };
        DateRangePickerComponent.prototype.updateMonthsInView = function () {
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
        };
        /**
         *  This is responsible for updating the calendars
         */
        DateRangePickerComponent.prototype.updateCalendars = function () {
            this.renderCalendar(SideEnum.left);
            this.renderCalendar(SideEnum.right);
            if (this.endDate === null) {
                return;
            }
            this.calculateChosenLabel();
        };
        DateRangePickerComponent.prototype.updateElement = function () {
            var format = this.locale.displayFormat ? this.locale.displayFormat : this.locale.format;
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
        };
        DateRangePickerComponent.prototype.remove = function () {
            this.isShown = false;
        };
        /**
         * this should calculate the label
         */
        DateRangePickerComponent.prototype.calculateChosenLabel = function () {
            var _this = this;
            if (!this.locale || !this.locale.separator) {
                this._buildLocale();
            }
            var customRange = true;
            var i = 0;
            this.ranges.forEach(function (preset) {
                if (_this.timePicker) {
                    var format = _this.timePickerSeconds ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD HH:mm';
                    // ignore times when comparing dates if time picker seconds is not enabled
                    if (_this.startDate.format(format) === preset.range.start.format(format) &&
                        _this.endDate.format(format) === preset.range.end.format(format)) {
                        customRange = false;
                        _this.chosenRange = preset;
                    }
                }
                else {
                    // ignore times when comparing dates if time picker is not enabled
                    if (_this.startDate.format('YYYY-MM-DD') === preset.range.start.format('YYYY-MM-DD') &&
                        _this.endDate.format('YYYY-MM-DD') === preset.range.end.format('YYYY-MM-DD')) {
                        customRange = false;
                        _this.chosenRange = preset;
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
        };
        DateRangePickerComponent.prototype.clickApply = function (e) {
            if (!this.singleDatePicker && this.startDate && !this.endDate) {
                this.endDate = this.startDate.clone();
                this.calculateChosenLabel();
            }
            if (this.isInvalidDate && this.startDate && this.endDate) {
                // get if there are invalid date between range
                var d = this.startDate.clone();
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
        };
        DateRangePickerComponent.prototype.clickCancel = function (e) {
            this.startDate = this._old.start;
            this.endDate = this._old.end;
            if (this.inline) {
                this.updateView();
            }
            this.hide();
        };
        /**
         * called when month is changed
         * @param monthEvent get value in event.target.value
         * @param side left or right
         */
        DateRangePickerComponent.prototype.monthChanged = function (monthEvent, side) {
            var year = this.calendarVariables[side].dropdowns.currentYear;
            var month = parseInt(monthEvent.value, 10);
            this.monthOrYearChanged(month, year, side);
        };
        /**
         * called when year is changed
         * @param yearEvent get value in event.target.value
         * @param side left or right
         */
        DateRangePickerComponent.prototype.yearChanged = function (yearEvent, side) {
            var month = this.calendarVariables[side].dropdowns.currentMonth;
            var year = parseInt(yearEvent.value, 10);
            this.monthOrYearChanged(month, year, side);
        };
        /**
         * called when time is changed
         * @param timeEvent  an event
         * @param side left or right
         */
        DateRangePickerComponent.prototype.timeChanged = function (timeEvent, side) {
            var hour = parseInt(this.timepickerVariables[side].selectedHour, 10);
            var minute = parseInt(this.timepickerVariables[side].selectedMinute, 10);
            var second = this.timePickerSeconds ? parseInt(this.timepickerVariables[side].selectedSecond, 10) : 0;
            if (!this.timePicker24Hour) {
                var ampm = this.timepickerVariables[side].ampmModel;
                if (ampm === 'PM' && hour < 12) {
                    hour += 12;
                }
                if (ampm === 'AM' && hour === 12) {
                    hour = 0;
                }
            }
            if (side === SideEnum.left) {
                var start = this.startDate.clone();
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
                var end = this.endDate.clone();
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
        };
        /**
         *  call when month or year changed
         * @param month month number 0 -11
         * @param year year eg: 1995
         * @param side left or right
         */
        DateRangePickerComponent.prototype.monthOrYearChanged = function (month, year, side) {
            var isLeft = side === SideEnum.left;
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
        };
        /**
         * Click on previous month
         * @param side left or right calendar
         */
        DateRangePickerComponent.prototype.clickPrev = function (side) {
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
        };
        /**
         * Click on next month
         * @param side left or right calendar
         */
        DateRangePickerComponent.prototype.clickNext = function (side) {
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
        };
        /**
         * When selecting a date
         * @param e event: get value by e.target.value
         * @param side left or right
         * @param row row position of the current date clicked
         * @param col col position of the current date clicked
         */
        DateRangePickerComponent.prototype.clickDate = function (e, side, row, col) {
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
            var date = side === SideEnum.left ? this.leftCalendar.calendar[row][col] : this.rightCalendar.calendar[row][col];
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
        };
        /**
         *  Click on the custom range
         * @param e: Event
         * @param preset
         */
        DateRangePickerComponent.prototype.clickRange = function (e, preset) {
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
                    var nextMonth = preset.range.start.clone().add(1, 'month');
                    this.rightCalendar.month.month(nextMonth.month());
                    this.rightCalendar.month.year(nextMonth.year());
                }
                this.updateCalendars();
                if (this.timePicker) {
                    this.renderTimePicker(SideEnum.left);
                    this.renderTimePicker(SideEnum.right);
                }
            }
        };
        DateRangePickerComponent.prototype.show = function (e) {
            if (this.isShown) {
                return;
            }
            this._old.start = this.startDate.clone();
            this._old.end = this.endDate.clone();
            this.isShown = true;
            if (this.isFullScreenPicker) {
                setTimeout(function () {
                    document.getElementById('scroll-body').scrollTo({ top: 150 });
                });
            }
            this.updateView();
        };
        DateRangePickerComponent.prototype.hide = function (e) {
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
        };
        /**
         * handle click on all element in the component, useful for outside of click
         * @param e event
         */
        DateRangePickerComponent.prototype.handleInternalClick = function (e) {
            e.stopPropagation();
        };
        /**
         * update the locale options
         * @param locale
         */
        DateRangePickerComponent.prototype.updateLocale = function (locale) {
            for (var key in locale) {
                if (locale.hasOwnProperty(key)) {
                    this.locale[key] = locale[key];
                    if (key === 'customRangeLabel') {
                        this.renderRanges();
                    }
                }
            }
        };
        /**
         *  clear the daterange picker
         */
        DateRangePickerComponent.prototype.clear = function () {
            this.startDate = moment$1().startOf('day');
            this.endDate = moment$1().endOf('day');
            this.updateCalendars();
            this.updateView();
        };
        /**
         * Find out if the selected range should be disabled if it doesn't
         * fit into minDate and maxDate limitations.
         */
        DateRangePickerComponent.prototype.disableRange = function (preset) {
            if (preset.label === this.locale.customRangeLabel) {
                return false;
            }
            var areBothBefore = this.minDate
                && preset.range.start.isBefore(this.minDate)
                && preset.range.end.isBefore(this.minDate);
            var areBothAfter = this.maxDate
                && preset.range.start.isAfter(this.maxDate)
                && preset.range.end.isAfter(this.maxDate);
            return areBothBefore || areBothAfter;
        };
        /**
         *
         * @param date the date to add time
         * @param side left or right
         */
        DateRangePickerComponent.prototype._getDateWithTime = function (date, side) {
            var hour = parseInt(this.timepickerVariables[side].selectedHour, 10);
            if (!this.timePicker24Hour) {
                var ampm = this.timepickerVariables[side].ampmModel;
                if (ampm === 'PM' && hour < 12) {
                    hour += 12;
                }
                if (ampm === 'AM' && hour === 12) {
                    hour = 0;
                }
            }
            var minute = parseInt(this.timepickerVariables[side].selectedMinute, 10);
            var second = this.timePickerSeconds ? parseInt(this.timepickerVariables[side].selectedSecond, 10) : 0;
            return date
                .clone()
                .hour(hour)
                .minute(minute)
                .second(second);
        };
        /**
         *  build the locale config
         */
        DateRangePickerComponent.prototype._buildLocale = function () {
            this.locale = __assign({}, this._localeService.config, this.locale);
            if (!this.locale.format) {
                if (this.timePicker) {
                    this.locale.format = moment$1.localeData().longDateFormat('lll');
                }
                else {
                    this.locale.format = moment$1.localeData().longDateFormat('L');
                }
            }
        };
        DateRangePickerComponent.prototype._buildCells = function (calendar, side) {
            for (var row = 0; row < 6; row++) {
                this.calendarVariables[side].classes[row] = {};
                var colOffCount = 0;
                var rowClasses = [];
                if (this.emptyWeekRowClass &&
                    !this.hasCurrentMonthDays(this.calendarVariables[side].month, calendar[row])) {
                    rowClasses.push(this.emptyWeekRowClass);
                }
                for (var col = 0; col < 7; col++) {
                    var classes = [];
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
                    var isCustom = this.isCustomDate(calendar[row][col]);
                    if (isCustom !== false) {
                        if (typeof isCustom === 'string') {
                            classes.push(isCustom);
                        }
                        else {
                            Array.prototype.push.apply(classes, isCustom);
                        }
                    }
                    // store classes var
                    var cname = '', disabled = false;
                    for (var i = 0; i < classes.length; i++) {
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
        };
        /**
         * Find out if the current calendar row has current month days
         * (as opposed to consisting of only previous/next month days)
         */
        DateRangePickerComponent.prototype.hasCurrentMonthDays = function (currentMonth, row) {
            for (var day = 0; day < 7; day++) {
                if (row[day].month() === currentMonth) {
                    return true;
                }
            }
            return false;
        };
        DateRangePickerComponent.prototype.scrollDetection = function (event) {
            var scrollBodyTop = event.target.scrollTop;
            var scrollBodyBottom = scrollBodyTop + event.target.clientHeight + 1;
            if (scrollBodyTop <= 0) {
                this.clickPrev(SideEnum.left);
                event.target.scrollTop = 150;
            }
            if (scrollBodyBottom >= event.target.scrollHeight) {
                this.clickNext(SideEnum.right);
                event.target.scrollTop = event.target.scrollTop - 150;
            }
        };
        var DateRangePickerComponent_1;
        DateRangePickerComponent.ctorParameters = function () { return [
            { type: core.ElementRef },
            { type: core.ChangeDetectorRef },
            { type: LocaleService }
        ]; };
        __decorate([
            core.Input()
        ], DateRangePickerComponent.prototype, "locale", null);
        __decorate([
            core.Input()
        ], DateRangePickerComponent.prototype, "ranges", null);
        __decorate([
            core.Input()
        ], DateRangePickerComponent.prototype, "startDate", void 0);
        __decorate([
            core.Input()
        ], DateRangePickerComponent.prototype, "endDate", void 0);
        __decorate([
            core.Input()
        ], DateRangePickerComponent.prototype, "dateLimit", void 0);
        __decorate([
            core.Input()
        ], DateRangePickerComponent.prototype, "minDate", void 0);
        __decorate([
            core.Input()
        ], DateRangePickerComponent.prototype, "maxDate", void 0);
        __decorate([
            core.Input()
        ], DateRangePickerComponent.prototype, "autoApply", void 0);
        __decorate([
            core.Input()
        ], DateRangePickerComponent.prototype, "singleDatePicker", void 0);
        __decorate([
            core.Input()
        ], DateRangePickerComponent.prototype, "showDropdowns", void 0);
        __decorate([
            core.Input()
        ], DateRangePickerComponent.prototype, "showWeekNumbers", void 0);
        __decorate([
            core.Input()
        ], DateRangePickerComponent.prototype, "showISOWeekNumbers", void 0);
        __decorate([
            core.Input()
        ], DateRangePickerComponent.prototype, "linkedCalendars", void 0);
        __decorate([
            core.Input()
        ], DateRangePickerComponent.prototype, "autoUpdateInput", void 0);
        __decorate([
            core.Input()
        ], DateRangePickerComponent.prototype, "alwaysShowCalendars", void 0);
        __decorate([
            core.Input()
        ], DateRangePickerComponent.prototype, "lockStartDate", void 0);
        __decorate([
            core.Input()
        ], DateRangePickerComponent.prototype, "timePicker", void 0);
        __decorate([
            core.Input()
        ], DateRangePickerComponent.prototype, "timePicker24Hour", void 0);
        __decorate([
            core.Input()
        ], DateRangePickerComponent.prototype, "timePickerIncrement", void 0);
        __decorate([
            core.Input()
        ], DateRangePickerComponent.prototype, "timePickerSeconds", void 0);
        __decorate([
            core.Input()
        ], DateRangePickerComponent.prototype, "showClearButton", void 0);
        __decorate([
            core.Input()
        ], DateRangePickerComponent.prototype, "firstMonthDayClass", void 0);
        __decorate([
            core.Input()
        ], DateRangePickerComponent.prototype, "lastMonthDayClass", void 0);
        __decorate([
            core.Input()
        ], DateRangePickerComponent.prototype, "emptyWeekRowClass", void 0);
        __decorate([
            core.Input()
        ], DateRangePickerComponent.prototype, "firstDayOfNextMonthClass", void 0);
        __decorate([
            core.Input()
        ], DateRangePickerComponent.prototype, "lastDayOfPreviousMonthClass", void 0);
        __decorate([
            core.Input()
        ], DateRangePickerComponent.prototype, "buttonClassApply", void 0);
        __decorate([
            core.Input()
        ], DateRangePickerComponent.prototype, "buttonClassReset", void 0);
        __decorate([
            core.Input()
        ], DateRangePickerComponent.prototype, "buttonClassRange", void 0);
        __decorate([
            core.Input()
        ], DateRangePickerComponent.prototype, "isFullScreenPicker", void 0);
        __decorate([
            core.Input()
        ], DateRangePickerComponent.prototype, "showCustomRangeLabel", void 0);
        __decorate([
            core.Input()
        ], DateRangePickerComponent.prototype, "showCancel", void 0);
        __decorate([
            core.Input()
        ], DateRangePickerComponent.prototype, "keepCalendarOpeningWithRange", void 0);
        __decorate([
            core.Input()
        ], DateRangePickerComponent.prototype, "showRangeLabelOnInput", void 0);
        __decorate([
            core.Input()
        ], DateRangePickerComponent.prototype, "customRangeDirection", void 0);
        __decorate([
            core.Input()
        ], DateRangePickerComponent.prototype, "drops", void 0);
        __decorate([
            core.Input()
        ], DateRangePickerComponent.prototype, "opens", void 0);
        __decorate([
            core.Input()
        ], DateRangePickerComponent.prototype, "closeOnAutoApply", void 0);
        __decorate([
            core.Output()
        ], DateRangePickerComponent.prototype, "choosedDate", void 0);
        __decorate([
            core.Output()
        ], DateRangePickerComponent.prototype, "rangeClicked", void 0);
        __decorate([
            core.Output()
        ], DateRangePickerComponent.prototype, "datesUpdated", void 0);
        __decorate([
            core.Output()
        ], DateRangePickerComponent.prototype, "startDateChanged", void 0);
        __decorate([
            core.Output()
        ], DateRangePickerComponent.prototype, "endDateChanged", void 0);
        __decorate([
            core.ViewChild('pickerContainer', { static: true })
        ], DateRangePickerComponent.prototype, "pickerContainer", void 0);
        __decorate([
            core.Input()
        ], DateRangePickerComponent.prototype, "isInvalidDate", null);
        __decorate([
            core.Input()
        ], DateRangePickerComponent.prototype, "isCustomDate", null);
        DateRangePickerComponent = DateRangePickerComponent_1 = __decorate([
            core.Component({
                // tslint:disable-next-line:component-selector
                selector: 'ngx-daterangepicker-material',
                template: "<div\n\tclass=\"md-drppicker\"\n\t#pickerContainer\n\t[ngClass]=\"{\n\t\tltr: locale.direction === 'ltr',\n\t\trtl: this.locale.direction === 'rtl',\n\t\tshown: isShown || inline,\n\t\tsingle: singleDatePicker,\n\t\thidden: !isShown && !inline,\n\t\tinline: inline,\n\t\tdouble: !isFullScreenPicker && !singleDatePicker && showCalInRanges,\n\t\t'show-ranges': ranges.length > 0,\n\t\t'full-screen': isFullScreenPicker\n\t}\"\n\t[class]=\"'drops-' + drops + '-' + opens\"\n\t[attr.data-cy]=\"'date-range-picker__content--' + (isFullScreenPicker ? 'full-screen' : 'modal')\"\n>\n\t<div *ngIf=\"!isFullScreenPicker; else fullScreenView;\">\n\t\t<div class=\"dp-header\" *ngIf=\"!singleDatePicker\">\n\t\t\t<button mat-button *ngIf=\"showClearButton\" class=\"cal-reset-btn\" (click)=\"clear()\" data-cy=\"date-range-picker-clear__button\">\n\t\t\t\t{{ _locale.clearLabel }}\n\t\t\t</button>\n\t\t\t<mat-form-field class=\"cal-start-date\">\n\t\t\t\t<button mat-icon-button matPrefix>\n\t\t\t\t\t<mat-icon>date_range</mat-icon>\n\t\t\t\t</button>\n\t\t\t\t<input\n\t\t\t\t\tmatInput\n\t\t\t\t\t[value]=\"startDate | date: locale.displayFormat:undefined:locale.localeId\"\n\t\t\t\t\treadonly\n\t\t\t\t\tdata-cy=\"date-range-picker-start-date__input\"\n\t\t\t\t/>\n\t\t\t</mat-form-field>\n\t\t\t<mat-form-field color=\"primary\">\n\t\t\t\t<button mat-icon-button matPrefix>\n\t\t\t\t\t<mat-icon>date_range</mat-icon>\n\t\t\t\t</button>\n\t\t\t\t<input\n\t\t\t\t\tmatInput\n\t\t\t\t\t[value]=\"endDate | date: locale.displayFormat:undefined:locale.localeId\"\n\t\t\t\t\treadonly\n\t\t\t\t\tdata-cy=\"date-range-picker-end-date__input\"\n\t\t\t\t/>\n\t\t\t</mat-form-field>\n\t\t</div>\n\t\t<div class=\"dp-body\">\n\t\t\t<div class=\"calendar\" [ngClass]=\"{ right: singleDatePicker, left: !singleDatePicker }\" *ngIf=\"showCalInRanges\">\n\t\t\t\t<button color=\"primary\" mat-mini-fab class=\"prev available\" (click)=\"clickPrev(sideEnum.left)\" data-cy=\"date-range-picker-previous__button\">\n\t\t\t\t\t<mat-icon>arrow_forward_ios</mat-icon>\n\t\t\t\t</button>\n\t\t\t\t<div class=\"calendar-table\">\n\t\t\t\t\t<table class=\"table-condensed\" *ngIf=\"calendarVariables\">\n\t\t\t\t\t\t<thead>\n\t\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t\t<th *ngIf=\"showWeekNumbers || showISOWeekNumbers\"></th>\n\t\t\t\t\t\t\t\t<th [colSpan]=\"!showDropdowns ? 7 : 5\" class=\"month drp-animate\">\n\t\t\t\t\t\t\t\t\t<ng-container *ngIf=\"showDropdowns && calendarVariables.left.dropdowns\">\n\t\t\t\t\t\t\t\t\t\t<mat-form-field>\n\t\t\t\t\t\t\t\t\t\t\t<mat-select\n\t\t\t\t\t\t\t\t\t\t\t\t[(ngModel)]=\"calendarVariables.left.dropdowns.currentMonth\"\n\t\t\t\t\t\t\t\t\t\t\t\t(selectionChange)=\"monthChanged($event, sideEnum.left)\"\n\t\t\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t\t\t\t<mat-option\n\t\t\t\t\t\t\t\t\t\t\t\t\t*ngFor=\"let m of calendarVariables.left.dropdowns.monthArrays\"\n\t\t\t\t\t\t\t\t\t\t\t\t\t[disabled]=\"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t(calendarVariables.left.dropdowns.inMinYear &&\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tm < calendarVariables.left.minDate.month()) ||\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t(calendarVariables.left.dropdowns.inMaxYear &&\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tm > calendarVariables.left.maxDate.month())\n\t\t\t\t\t\t\t\t\t\t\t\t\t\"\n\t\t\t\t\t\t\t\t\t\t\t\t\t[value]=\"m\"\n\t\t\t\t\t\t\t\t\t\t\t\t\t>{{ locale.monthNames[m] }}</mat-option\n\t\t\t\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t\t\t</mat-select>\n\t\t\t\t\t\t\t\t\t\t</mat-form-field>\n\t\t\t\t\t\t\t\t\t</ng-container>\n\t\t\t\t\t\t\t\t\t<ng-container *ngIf=\"!showDropdowns || !calendarVariables.left.dropdowns\">\n\t\t\t\t\t\t\t\t\t\t{{ this.locale.monthNames[calendarVariables?.left?.calendar[1][1].month()] }}\n\t\t\t\t\t\t\t\t\t\t{{ calendarVariables?.left?.calendar[1][1].format(' YYYY') }}\n\t\t\t\t\t\t\t\t\t</ng-container>\n\t\t\t\t\t\t\t\t</th>\n\t\t\t\t\t\t\t\t<th *ngIf=\"showDropdowns && calendarVariables.left.dropdowns\" colspan=\"2\" class=\"year\">\n\t\t\t\t\t\t\t\t\t<ng-container>\n\t\t\t\t\t\t\t\t\t\t<mat-form-field>\n\t\t\t\t\t\t\t\t\t\t\t<mat-select\n\t\t\t\t\t\t\t\t\t\t\t\t[(ngModel)]=\"calendarVariables.left.dropdowns.currentYear\"\n\t\t\t\t\t\t\t\t\t\t\t\t(selectionChange)=\"yearChanged($event, sideEnum.left)\"\n\t\t\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t\t\t\t<mat-option\n\t\t\t\t\t\t\t\t\t\t\t\t\t*ngFor=\"let y of calendarVariables.left.dropdowns.yearArrays\"\n\t\t\t\t\t\t\t\t\t\t\t\t\t[value]=\"y\"\n\t\t\t\t\t\t\t\t\t\t\t\t\t>{{ y }}</mat-option\n\t\t\t\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t\t\t</mat-select>\n\t\t\t\t\t\t\t\t\t\t</mat-form-field>\n\t\t\t\t\t\t\t\t\t</ng-container>\n\t\t\t\t\t\t\t\t</th>\n\t\t\t\t\t\t\t\t<ng-container\n\t\t\t\t\t\t\t\t\t*ngIf=\"\n\t\t\t\t\t\t\t\t\t\t(!calendarVariables.left.maxDate ||\n\t\t\t\t\t\t\t\t\t\t\tcalendarVariables.left.maxDate.isAfter(\n\t\t\t\t\t\t\t\t\t\t\t\tcalendarVariables.left.calendar.lastDay\n\t\t\t\t\t\t\t\t\t\t\t)) &&\n\t\t\t\t\t\t\t\t\t\t(!linkedCalendars || singleDatePicker)\n\t\t\t\t\t\t\t\t\t\"\n\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t<button\n\t\t\t\t\t\t\t\t\t\tcolor=\"primary\"\n\t\t\t\t\t\t\t\t\t\tmat-mini-fab\n\t\t\t\t\t\t\t\t\t\tclass=\"next available\"\n\t\t\t\t\t\t\t\t\t\t(click)=\"clickNext(sideEnum.left)\"\n\t\t\t\t\t\t\t\t\t\tdata-cy=\"date-range-picker-next__button--single-calendar\"\n\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t\t<mat-icon>arrow_forward_ios</mat-icon>\n\t\t\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t\t</ng-container>\n\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t\t<tr class=\"week-days\">\n\t\t\t\t\t\t\t\t<th *ngIf=\"showWeekNumbers || showISOWeekNumbers\" class=\"week\">\n\t\t\t\t\t\t\t\t\t<span>{{ this.locale.weekLabel }}</span>\n\t\t\t\t\t\t\t\t</th>\n\t\t\t\t\t\t\t\t<th *ngFor=\"let dayofweek of locale.daysOfWeek\">\n\t\t\t\t\t\t\t\t\t<span>{{ dayofweek[0] }}</span>\n\t\t\t\t\t\t\t\t</th>\n\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t</thead>\n\t\t\t\t\t\t<tbody class=\"drp-animate\">\n\t\t\t\t\t\t\t<tr\n\t\t\t\t\t\t\t\t*ngFor=\"let row of calendarVariables.left.calRows; let rowIndex = index;\"\n\t\t\t\t\t\t\t\t[class]=\"calendarVariables.left.classes[row].classList\"\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t<!-- add week number -->\n\t\t\t\t\t\t\t\t<td class=\"week\" *ngIf=\"showWeekNumbers\">\n\t\t\t\t\t\t\t\t\t<span>{{ calendarVariables.left.calendar[row][0].week() }}</span>\n\t\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t\t<td class=\"week\" *ngIf=\"showISOWeekNumbers\">\n\t\t\t\t\t\t\t\t\t<span>{{ calendarVariables.left.calendar[row][0].isoWeek() }}</span>\n\t\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t\t<!-- cal -->\n\t\t\t\t\t\t\t\t<td\n\t\t\t\t\t\t\t\t\t*ngFor=\"let col of calendarVariables.left.calCols; let colIndex = index\"\n\t\t\t\t\t\t\t\t\t[class]=\"calendarVariables.left.classes[row][col]\"\n\t\t\t\t\t\t\t\t\t(click)=\"clickDate($event, sideEnum.left, row, col)\"\n\t\t\t\t\t\t\t\t\t[attr.data-cy]=\"'date-range-picker-row-' + rowIndex + '-col-' + colIndex + '__button'\"\n\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t<span>{{ calendarVariables.left.calendar[row][col].date() }}</span>\n\t\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t</tbody>\n\t\t\t\t\t</table>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"calendar-time\" *ngIf=\"timePicker\">\n\t\t\t\t\t<div class=\"select\">\n\t\t\t\t\t\t<select\n\t\t\t\t\t\t\tclass=\"hourselect select-item\"\n\t\t\t\t\t\t\t[disabled]=\"!endDate\"\n\t\t\t\t\t\t\t[(ngModel)]=\"timepickerVariables.left.selectedHour\"\n\t\t\t\t\t\t\t(ngModelChange)=\"timeChanged($event, sideEnum.left)\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t<option\n\t\t\t\t\t\t\t\t*ngFor=\"let i of timepickerVariables.left.hours\"\n\t\t\t\t\t\t\t\t[value]=\"i\"\n\t\t\t\t\t\t\t\t[disabled]=\"timepickerVariables.left.disabledHours.indexOf(i) > -1\"\n\t\t\t\t\t\t\t\t>{{ i }}</option\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t</select>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"select\">\n\t\t\t\t\t\t<select\n\t\t\t\t\t\t\tclass=\"select-item minuteselect\"\n\t\t\t\t\t\t\t[disabled]=\"!endDate\"\n\t\t\t\t\t\t\t[(ngModel)]=\"timepickerVariables.left.selectedMinute\"\n\t\t\t\t\t\t\t(ngModelChange)=\"timeChanged($event, sideEnum.left)\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t<option\n\t\t\t\t\t\t\t\t*ngFor=\"let i of timepickerVariables.left.minutes; let index = index\"\n\t\t\t\t\t\t\t\t[value]=\"i\"\n\t\t\t\t\t\t\t\t[disabled]=\"timepickerVariables.left.disabledMinutes.indexOf(i) > -1\"\n\t\t\t\t\t\t\t\t>{{ timepickerVariables.left.minutesLabel[index] }}</option\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t</select>\n\t\t\t\t\t\t<span class=\"select-highlight\"></span>\n\t\t\t\t\t\t<span class=\"select-bar\"></span>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"select\">\n\t\t\t\t\t\t<select\n\t\t\t\t\t\t\tclass=\"select-item secondselect\"\n\t\t\t\t\t\t\t*ngIf=\"timePickerSeconds\"\n\t\t\t\t\t\t\t[disabled]=\"!endDate\"\n\t\t\t\t\t\t\t[(ngModel)]=\"timepickerVariables.left.selectedSecond\"\n\t\t\t\t\t\t\t(ngModelChange)=\"timeChanged($event, sideEnum.left)\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t<option\n\t\t\t\t\t\t\t\t*ngFor=\"let i of timepickerVariables.left.seconds; let index = index\"\n\t\t\t\t\t\t\t\t[value]=\"i\"\n\t\t\t\t\t\t\t\t[disabled]=\"timepickerVariables.left.disabledSeconds.indexOf(i) > -1\"\n\t\t\t\t\t\t\t\t>{{ timepickerVariables.left.secondsLabel[index] }}</option\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t</select>\n\t\t\t\t\t\t<span class=\"select-highlight\"></span>\n\t\t\t\t\t\t<span class=\"select-bar\"></span>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"select\">\n\t\t\t\t\t\t<select\n\t\t\t\t\t\t\tclass=\"select-item ampmselect\"\n\t\t\t\t\t\t\t*ngIf=\"!timePicker24Hour\"\n\t\t\t\t\t\t\t[(ngModel)]=\"timepickerVariables.left.ampmModel\"\n\t\t\t\t\t\t\t(ngModelChange)=\"timeChanged($event, sideEnum.left)\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t<option value=\"AM\" [disabled]=\"timepickerVariables.left.amDisabled\">AM</option>\n\t\t\t\t\t\t\t<option value=\"PM\" [disabled]=\"timepickerVariables.left.pmDisabled\">PM</option>\n\t\t\t\t\t\t</select>\n\t\t\t\t\t\t<span class=\"select-highlight\"></span>\n\t\t\t\t\t\t<span class=\"select-bar\"></span>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"calendar right\" *ngIf=\"showCalInRanges && !singleDatePicker\">\n\t\t\t\t<button color=\"primary\" mat-mini-fab class=\"next available\" (click)=\"clickNext(sideEnum.right)\" data-cy=\"date-range-picker-next__button\">\n\t\t\t\t\t<mat-icon>arrow_forward_ios</mat-icon>\n\t\t\t\t</button>\n\t\t\t\t<div class=\"calendar-table\">\n\t\t\t\t\t<table class=\"table-condensed\" *ngIf=\"calendarVariables\">\n\t\t\t\t\t\t<thead>\n\t\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t\t<th *ngIf=\"showWeekNumbers || showISOWeekNumbers\"></th>\n\t\t\t\t\t\t\t\t<th [colSpan]=\"!showDropdowns ? 7 : 5\" class=\"month\">\n\t\t\t\t\t\t\t\t\t<ng-container *ngIf=\"showDropdowns && calendarVariables.right.dropdowns\">\n\t\t\t\t\t\t\t\t\t\t<mat-form-field>\n\t\t\t\t\t\t\t\t\t\t\t<mat-select\n\t\t\t\t\t\t\t\t\t\t\t\t[(ngModel)]=\"calendarVariables.right.dropdowns.currentMonth\"\n\t\t\t\t\t\t\t\t\t\t\t\t(selectionChange)=\"monthChanged($event, sideEnum.right)\"\n\t\t\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t\t\t\t<mat-option\n\t\t\t\t\t\t\t\t\t\t\t\t\t[disabled]=\"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t(calendarVariables.right.dropdowns.inMinYear &&\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tm < calendarVariables.right.minDate.month()) ||\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t(calendarVariables.right.dropdowns.inMaxYear &&\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tm > calendarVariables.right.maxDate.month())\n\t\t\t\t\t\t\t\t\t\t\t\t\t\"\n\t\t\t\t\t\t\t\t\t\t\t\t\t*ngFor=\"let m of calendarVariables.right.dropdowns.monthArrays\"\n\t\t\t\t\t\t\t\t\t\t\t\t\t[value]=\"m\"\n\t\t\t\t\t\t\t\t\t\t\t\t\t>{{ locale.monthNames[m] }}</mat-option\n\t\t\t\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t\t\t</mat-select>\n\t\t\t\t\t\t\t\t\t\t</mat-form-field>\n\t\t\t\t\t\t\t\t\t</ng-container>\n\t\t\t\t\t\t\t\t\t<ng-container *ngIf=\"!showDropdowns || !calendarVariables.right.dropdowns\">\n\t\t\t\t\t\t\t\t\t\t{{ this.locale.monthNames[calendarVariables?.right?.calendar[1][1].month()] }}\n\t\t\t\t\t\t\t\t\t\t{{ calendarVariables?.right?.calendar[1][1].format(' YYYY') }}\n\t\t\t\t\t\t\t\t\t</ng-container>\n\t\t\t\t\t\t\t\t</th>\n\t\t\t\t\t\t\t\t<th *ngIf=\"showDropdowns && calendarVariables.right.dropdowns\" colspan=\"2\" class=\"year\">\n\t\t\t\t\t\t\t\t\t<ng-container>\n\t\t\t\t\t\t\t\t\t\t<mat-form-field>\n\t\t\t\t\t\t\t\t\t\t\t<mat-select\n\t\t\t\t\t\t\t\t\t\t\t\t[(ngModel)]=\"calendarVariables.right.dropdowns.currentYear\"\n\t\t\t\t\t\t\t\t\t\t\t\t(selectionChange)=\"yearChanged($event, sideEnum.right)\"\n\t\t\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t\t\t\t<mat-option\n\t\t\t\t\t\t\t\t\t\t\t\t\t*ngFor=\"let y of calendarVariables.right.dropdowns.yearArrays\"\n\t\t\t\t\t\t\t\t\t\t\t\t\t[value]=\"y\"\n\t\t\t\t\t\t\t\t\t\t\t\t\t>{{ y }}</mat-option\n\t\t\t\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t\t\t</mat-select>\n\t\t\t\t\t\t\t\t\t\t</mat-form-field>\n\t\t\t\t\t\t\t\t\t</ng-container>\n\t\t\t\t\t\t\t\t</th>\n\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t\t<tr class=\"week-days\">\n\t\t\t\t\t\t\t\t<th *ngIf=\"showWeekNumbers || showISOWeekNumbers\" class=\"week\">\n\t\t\t\t\t\t\t\t\t<span>{{ this.locale.weekLabel }}</span>\n\t\t\t\t\t\t\t\t</th>\n\t\t\t\t\t\t\t\t<th *ngFor=\"let dayofweek of locale.daysOfWeek\">\n\t\t\t\t\t\t\t\t\t<span>{{ dayofweek[0] }}</span>\n\t\t\t\t\t\t\t\t</th>\n\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t</thead>\n\t\t\t\t\t\t<tbody>\n\t\t\t\t\t\t\t<tr\n\t\t\t\t\t\t\t\t*ngFor=\"let row of calendarVariables.right.calRows; let rowIndex = index;\"\n\t\t\t\t\t\t\t\t[class]=\"calendarVariables.right.classes[row].classList\"\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t<td class=\"week\" *ngIf=\"showWeekNumbers\">\n\t\t\t\t\t\t\t\t\t<span>{{ calendarVariables.right.calendar[row][0].week() }}</span>\n\t\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t\t<td class=\"week\" *ngIf=\"showISOWeekNumbers\">\n\t\t\t\t\t\t\t\t\t<span>{{ calendarVariables.right.calendar[row][0].isoWeek() }}</span>\n\t\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t\t<td\n\t\t\t\t\t\t\t\t\t*ngFor=\"let col of calendarVariables.right.calCols; let colIndex = index;\"\n\t\t\t\t\t\t\t\t\t[class]=\"calendarVariables.right.classes[row][col]\"\n\t\t\t\t\t\t\t\t\t(click)=\"clickDate($event, sideEnum.right, row, col)\"\n\t\t\t\t\t\t\t\t\t[attr.data-cy]=\"'date-range-picker-row-' + rowIndex + '-col-' + colIndex + '__button'\"\n\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t<span>{{ calendarVariables.right.calendar[row][col].date() }}</span>\n\t\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t</tbody>\n\t\t\t\t\t</table>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"calendar-time\" *ngIf=\"timePicker\">\n\t\t\t\t\t<div class=\"select\">\n\t\t\t\t\t\t<select\n\t\t\t\t\t\t\tclass=\"select-item hourselect\"\n\t\t\t\t\t\t\t[disabled]=\"!endDate\"\n\t\t\t\t\t\t\t[(ngModel)]=\"timepickerVariables.right.selectedHour\"\n\t\t\t\t\t\t\t(ngModelChange)=\"timeChanged($event, sideEnum.right)\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t<option\n\t\t\t\t\t\t\t\t*ngFor=\"let i of timepickerVariables.right.hours\"\n\t\t\t\t\t\t\t\t[value]=\"i\"\n\t\t\t\t\t\t\t\t[disabled]=\"timepickerVariables.right.disabledHours.indexOf(i) > -1\"\n\t\t\t\t\t\t\t\t>{{ i }}</option\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t</select>\n\t\t\t\t\t\t<span class=\"select-highlight\"></span>\n\t\t\t\t\t\t<span class=\"select-bar\"></span>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"select\">\n\t\t\t\t\t\t<select\n\t\t\t\t\t\t\tclass=\"select-item minuteselect\"\n\t\t\t\t\t\t\t[disabled]=\"!endDate\"\n\t\t\t\t\t\t\t[(ngModel)]=\"timepickerVariables.right.selectedMinute\"\n\t\t\t\t\t\t\t(ngModelChange)=\"timeChanged($event, sideEnum.right)\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t<option\n\t\t\t\t\t\t\t\t*ngFor=\"let i of timepickerVariables.right.minutes; let index = index\"\n\t\t\t\t\t\t\t\t[value]=\"i\"\n\t\t\t\t\t\t\t\t[disabled]=\"timepickerVariables.right.disabledMinutes.indexOf(i) > -1\"\n\t\t\t\t\t\t\t\t>{{ timepickerVariables.right.minutesLabel[index] }}</option\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t</select>\n\t\t\t\t\t\t<span class=\"select-highlight\"></span>\n\t\t\t\t\t\t<span class=\"select-bar\"></span>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"select\">\n\t\t\t\t\t\t<select\n\t\t\t\t\t\t\t*ngIf=\"timePickerSeconds\"\n\t\t\t\t\t\t\tclass=\"select-item secondselect\"\n\t\t\t\t\t\t\t[disabled]=\"!endDate\"\n\t\t\t\t\t\t\t[(ngModel)]=\"timepickerVariables.right.selectedSecond\"\n\t\t\t\t\t\t\t(ngModelChange)=\"timeChanged($event, sideEnum.right)\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t<option\n\t\t\t\t\t\t\t\t*ngFor=\"let i of timepickerVariables.right.seconds; let index = index\"\n\t\t\t\t\t\t\t\t[value]=\"i\"\n\t\t\t\t\t\t\t\t[disabled]=\"timepickerVariables.right.disabledSeconds.indexOf(i) > -1\"\n\t\t\t\t\t\t\t\t>{{ timepickerVariables.right.secondsLabel[index] }}</option\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t</select>\n\t\t\t\t\t\t<span class=\"select-highlight\"></span>\n\t\t\t\t\t\t<span class=\"select-bar\"></span>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"select\">\n\t\t\t\t\t\t<select\n\t\t\t\t\t\t\t*ngIf=\"!timePicker24Hour\"\n\t\t\t\t\t\t\tclass=\"select-item ampmselect\"\n\t\t\t\t\t\t\t[(ngModel)]=\"timepickerVariables.right.ampmModel\"\n\t\t\t\t\t\t\t(ngModelChange)=\"timeChanged($event, sideEnum.right)\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t<option value=\"AM\" [disabled]=\"timepickerVariables.right.amDisabled\">AM</option>\n\t\t\t\t\t\t\t<option value=\"PM\" [disabled]=\"timepickerVariables.right.pmDisabled\">PM</option>\n\t\t\t\t\t\t</select>\n\t\t\t\t\t\t<span class=\"select-highlight\"></span>\n\t\t\t\t\t\t<span class=\"select-bar\"></span>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t\t<div class=\"dp-footer\" *ngIf=\"!autoApply && (!ranges.length || (showCalInRanges && !singleDatePicker))\">\n\t\t\t<div class=\"range-buttons\">\n\t\t\t\t<div class=\"custom-range-label\" *ngIf=\"showCustomRangeLabel\">\n\t\t\t\t\t<strong>{{ _locale.customRangeLabel }}:</strong>\n\t\t\t\t</div>\n\t\t\t\t<button\n\t\t\t\t\t*ngFor=\"let range of ranges\"\n\t\t\t\t\tmat-stroked-button\n\t\t\t\t\tcolor=\"primary\"\n\t\t\t\t\tclass=\"{{ buttonClassRange }}\"\n\t\t\t\t\t(click)=\"clickRange($event, range)\"\n\t\t\t\t\t[disabled]=\"disableRange(range)\"\n\t\t\t\t\t[ngClass]=\"{ active: range.label === chosenLabel }\"\n\t\t\t\t\t[attr.data-cy]=\"'date-range-picker-range-' + range.key + '__button'\"\n\t\t\t\t>\n\t\t\t\t\t{{ range.label }}\n\t\t\t\t</button>\n\t\t\t</div>\n\t\t\t<div class=\"control-buttons\">\n\t\t\t\t<button mat-flat-button color=\"primary\" (click)=\"clickApply($event)\" data-cy=\"date-range-picker-apply__button\">\n\t\t\t\t\t{{ _locale.applyLabel }}\n\t\t\t\t</button>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n\t<ng-template #fullScreenView>\n\t\t<div class=\"dp-header\" id=\"scroll-top\">\n\t\t\t<button mat-icon-button (click)=\"clickCancel($event)\" data-cy=\"date-range-picker-close__button\">\n\t\t\t\t<mat-icon>close</mat-icon>\n\t\t\t</button>\n\t\t\t<div class=\"selected-range\">\n\t\t\t\t{{startDate | date: locale.displayFormat:undefined:locale.localeId}} - {{endDate | date: locale.displayFormat:undefined:locale.localeId}}\n\t\t\t</div>\n\t\t\t<div class=\"header-icon\">\n\t\t\t\t<mat-icon>date_range</mat-icon>\n\t\t\t</div>\n\t\t</div>\n\t\t<div class=\"dp-body\" id=\"scroll-body\" (scroll)=\"scrollDetection($event)\">\n\t\t\t<div class=\"calendar\" [ngClass]=\"{ right: singleDatePicker, left: !singleDatePicker }\" *ngIf=\"showCalInRanges\">\n\t\t\t\t<div class=\"calendar-table\">\n\t\t\t\t\t<table class=\"table-condensed\" *ngIf=\"calendarVariables\">\n\t\t\t\t\t\t<thead>\n\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t<th *ngIf=\"showWeekNumbers || showISOWeekNumbers\"></th>\n\t\t\t\t\t\t\t<th [colSpan]=\"!showDropdowns ? 7 : 5\" class=\"month drp-animate\">\n\t\t\t\t\t\t\t\t<ng-container *ngIf=\"showDropdowns && calendarVariables.left.dropdowns\">\n\t\t\t\t\t\t\t\t\t<mat-form-field>\n\t\t\t\t\t\t\t\t\t\t<mat-select [(ngModel)]=\"calendarVariables.left.dropdowns.currentMonth\" (selectionChange)=\"monthChanged($event, sideEnum.left)\">\n\t\t\t\t\t\t\t\t\t\t\t<mat-option *ngFor=\"let m of calendarVariables.left.dropdowns.monthArrays\" [disabled]=\"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t(calendarVariables.left.dropdowns.inMinYear &&\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tm < calendarVariables.left.minDate.month()) ||\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t(calendarVariables.left.dropdowns.inMaxYear &&\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tm > calendarVariables.left.maxDate.month())\n\t\t\t\t\t\t\t\t\t\t\t\t\t\" [value]=\"m\">{{ locale.monthNames[m] }}</mat-option>\n\t\t\t\t\t\t\t\t\t\t\t<mat-option *ngFor=\"let m of calendarVariables.left.dropdowns.monthArrays\" [disabled]=\"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t(calendarVariables.left.dropdowns.inMinYear &&\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tm < calendarVariables.left.minDate.month()) ||\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t(calendarVariables.left.dropdowns.inMaxYear &&\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tm > calendarVariables.left.maxDate.month())\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\" [value]=\"m\">{{ locale.monthNames[m] }}</mat-option>\n\t\t\t\t\t\t\t\t\t\t</mat-select>\n\t\t\t\t\t\t\t\t\t</mat-form-field>\n\t\t\t\t\t\t\t\t</ng-container>\n\t\t\t\t\t\t\t\t<ng-container *ngIf=\"!showDropdowns || !calendarVariables.left.dropdowns\">\n\t\t\t\t\t\t\t\t\t{{ this.locale.monthNames[calendarVariables?.left?.calendar[1][1].month()] }}\n\t\t\t\t\t\t\t\t\t{{ calendarVariables?.left?.calendar[1][1].format(' YYYY') }}\n\t\t\t\t\t\t\t\t</ng-container>\n\t\t\t\t\t\t\t</th>\n\t\t\t\t\t\t\t<th *ngIf=\"showDropdowns && calendarVariables.left.dropdowns\" colspan=\"2\" class=\"year\">\n\t\t\t\t\t\t\t\t<ng-container>\n\t\t\t\t\t\t\t\t\t<mat-form-field>\n\t\t\t\t\t\t\t\t\t\t<mat-select [(ngModel)]=\"calendarVariables.left.dropdowns.currentYear\" (selectionChange)=\"yearChanged($event, sideEnum.left)\">\n\t\t\t\t\t\t\t\t\t\t\t<mat-option *ngFor=\"let y of calendarVariables.left.dropdowns.yearArrays\" [value]=\"y\">{{ y }}</mat-option>\n\t\t\t\t\t\t\t\t\t\t</mat-select>\n\t\t\t\t\t\t\t\t\t</mat-form-field>\n\t\t\t\t\t\t\t\t</ng-container>\n\t\t\t\t\t\t\t</th>\n\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t<tr class=\"week-days\">\n\t\t\t\t\t\t\t<th *ngIf=\"showWeekNumbers || showISOWeekNumbers\" class=\"week\">\n\t\t\t\t\t\t\t\t<span>{{ this.locale.weekLabel }}</span>\n\t\t\t\t\t\t\t</th>\n\t\t\t\t\t\t\t<th *ngFor=\"let dayofweek of locale.daysOfWeek\">\n\t\t\t\t\t\t\t\t<span>{{ dayofweek[0] }}</span>\n\t\t\t\t\t\t\t</th>\n\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t</thead>\n\t\t\t\t\t\t<tbody class=\"drp-animate\">\n\t\t\t\t\t\t<tr *ngFor=\"let row of calendarVariables.left.calRows; let rowIndex = index;\" [class]=\"calendarVariables.left.classes[row].classList\">\n\t\t\t\t\t\t\t<!-- add week number -->\n\t\t\t\t\t\t\t<td class=\"week\" *ngIf=\"showWeekNumbers\">\n\t\t\t\t\t\t\t\t<span>{{ calendarVariables.left.calendar[row][0].week() }}</span>\n\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t<td class=\"week\" *ngIf=\"showISOWeekNumbers\">\n\t\t\t\t\t\t\t\t<span>{{ calendarVariables.left.calendar[row][0].isoWeek() }}</span>\n\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t<!-- cal -->\n\t\t\t\t\t\t\t<td *ngFor=\"let col of calendarVariables.left.calCols; let colIndex = index\" [class]=\"calendarVariables.left.classes[row][col]\" (click)=\"clickDate($event, sideEnum.left, row, col)\" [attr.data-cy]=\"'date-range-picker-row-' + rowIndex + '-col-' + colIndex + '__button'\">\n\t\t\t\t\t\t\t\t<span>{{ calendarVariables.left.calendar[row][col].date() }}</span>\n\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t</tbody>\n\t\t\t\t\t</table>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"calendar right\" *ngIf=\"showCalInRanges && !singleDatePicker\">\n\t\t\t\t<div class=\"calendar-table\">\n\t\t\t\t\t<table class=\"table-condensed\" *ngIf=\"calendarVariables\">\n\t\t\t\t\t\t<thead>\n\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t<th *ngIf=\"showWeekNumbers || showISOWeekNumbers\"></th>\n\t\t\t\t\t\t\t<th [colSpan]=\"!showDropdowns ? 7 : 5\" class=\"month\">\n\t\t\t\t\t\t\t\t<ng-container *ngIf=\"showDropdowns && calendarVariables.right.dropdowns\">\n\t\t\t\t\t\t\t\t\t<mat-form-field>\n\t\t\t\t\t\t\t\t\t\t<mat-select [(ngModel)]=\"calendarVariables.right.dropdowns.currentMonth\" (selectionChange)=\"monthChanged($event, sideEnum.right)\">\n\t\t\t\t\t\t\t\t\t\t\t<mat-option [disabled]=\"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t(calendarVariables.right.dropdowns.inMinYear &&\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tm < calendarVariables.right.minDate.month()) ||\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t(calendarVariables.right.dropdowns.inMaxYear &&\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tm > calendarVariables.right.maxDate.month())\n\t\t\t\t\t\t\t\t\t\t\t\t\t\" *ngFor=\"let m of calendarVariables.right.dropdowns.monthArrays\" [value]=\"m\">{{ locale.monthNames[m] }}</mat-option>\n\t\t\t\t\t\t\t\t\t\t\t<mat-option [disabled]=\"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t(calendarVariables.right.dropdowns.inMinYear &&\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tm < calendarVariables.right.minDate.month()) ||\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t(calendarVariables.right.dropdowns.inMaxYear &&\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tm > calendarVariables.right.maxDate.month())\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\" *ngFor=\"let m of calendarVariables.right.dropdowns.monthArrays\" [value]=\"m\">{{ locale.monthNames[m] }}</mat-option>\n\t\t\t\t\t\t\t\t\t\t</mat-select>\n\t\t\t\t\t\t\t\t\t</mat-form-field>\n\t\t\t\t\t\t\t\t</ng-container>\n\t\t\t\t\t\t\t\t<ng-container *ngIf=\"!showDropdowns || !calendarVariables.right.dropdowns\">\n\t\t\t\t\t\t\t\t\t{{ this.locale.monthNames[calendarVariables?.right?.calendar[1][1].month()] }}\n\t\t\t\t\t\t\t\t\t{{ calendarVariables?.right?.calendar[1][1].format(' YYYY') }}\n\t\t\t\t\t\t\t\t</ng-container>\n\t\t\t\t\t\t\t</th>\n\t\t\t\t\t\t\t<th *ngIf=\"showDropdowns && calendarVariables.right.dropdowns\" colspan=\"2\" class=\"year\">\n\t\t\t\t\t\t\t\t<ng-container>\n\t\t\t\t\t\t\t\t\t<mat-form-field>\n\t\t\t\t\t\t\t\t\t\t<mat-select [(ngModel)]=\"calendarVariables.right.dropdowns.currentYear\" (selectionChange)=\"yearChanged($event, sideEnum.right)\">\n\t\t\t\t\t\t\t\t\t\t\t<mat-option *ngFor=\"let y of calendarVariables.right.dropdowns.yearArrays\" [value]=\"y\">{{ y }}</mat-option>\n\t\t\t\t\t\t\t\t\t\t</mat-select>\n\t\t\t\t\t\t\t\t\t</mat-form-field>\n\t\t\t\t\t\t\t\t</ng-container>\n\t\t\t\t\t\t\t</th>\n\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t<tr class=\"week-days\">\n\t\t\t\t\t\t\t<th *ngIf=\"showWeekNumbers || showISOWeekNumbers\" class=\"week\">\n\t\t\t\t\t\t\t\t<span>{{ this.locale.weekLabel }}</span>\n\t\t\t\t\t\t\t</th>\n\t\t\t\t\t\t\t<th *ngFor=\"let dayofweek of locale.daysOfWeek\">\n\t\t\t\t\t\t\t\t<span>{{ dayofweek[0] }}</span>\n\t\t\t\t\t\t\t</th>\n\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t</thead>\n\t\t\t\t\t\t<tbody>\n\t\t\t\t\t\t<tr *ngFor=\"let row of calendarVariables.right.calRows; let rowIndex = index;\" [class]=\"calendarVariables.right.classes[row].classList\">\n\t\t\t\t\t\t\t<td class=\"week\" *ngIf=\"showWeekNumbers\">\n\t\t\t\t\t\t\t\t<span>{{ calendarVariables.right.calendar[row][0].week() }}</span>\n\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t<td class=\"week\" *ngIf=\"showISOWeekNumbers\">\n\t\t\t\t\t\t\t\t<span>{{ calendarVariables.right.calendar[row][0].isoWeek() }}</span>\n\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t<td *ngFor=\"let col of calendarVariables.right.calCols; let colIndex = index;\" [class]=\"calendarVariables.right.classes[row][col]\" (click)=\"clickDate($event, sideEnum.right, row, col)\" [attr.data-cy]=\"'date-range-picker-row-' + rowIndex + '-col-' + colIndex + '__button'\">\n\t\t\t\t\t\t\t\t<span>{{ calendarVariables.right.calendar[row][col].date() }}</span>\n\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t</tbody>\n\t\t\t\t\t</table>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t\t<div class=\"dp-footer\">\n\t\t\t<div class=\"control-buttons\" id=\"scroll-bottom\">\n\t\t\t\t<button mat-button *ngIf=\"showClearButton\" class=\"cal-reset-btn\" (click)=\"clear()\" data-cy=\"date-range-picker-clear__button\">\n\t\t\t\t\t{{ _locale.clearLabel }}\n\t\t\t\t</button>\n\t\t\t\t<button mat-flat-button color=\"primary\" (click)=\"clickApply($event)\" data-cy=\"date-range-picker-apply__button\">\n\t\t\t\t\t{{ _locale.applyLabel }}\n\t\t\t\t</button>\n\t\t\t</div>\n\t\t</div>\n\t</ng-template>\n</div>\n",
                // tslint:disable-next-line:no-host-metadata-property
                host: {
                    '(click)': 'handleInternalClick($event)'
                },
                encapsulation: core.ViewEncapsulation.None,
                providers: [
                    {
                        provide: forms.NG_VALUE_ACCESSOR,
                        useExisting: core.forwardRef(function () { return DateRangePickerComponent_1; }),
                        multi: true
                    }
                ],
                styles: [":host{position:absolute;top:0;left:0}td.hidden span,tr.hidden{display:none;cursor:default}td.available:not(.off):hover{border:2px solid #42a5f5}.ranges li{display:inline-block}button.available.prev{display:block;opacity:1;border-radius:2em;height:40px;width:40px;position:fixed;top:calc(50% - 20px);left:-20px;background-color:#fff;color:#000}button.available.prev mat-icon{transform:rotateY(180deg)}button.available.next{display:block;opacity:1;border-radius:2em;height:40px;width:40px;position:fixed;top:calc(50% - 20px);right:-20px;background-color:#fff;color:#000}.md-drppicker{display:flex;flex-direction:column;justify-content:space-between;position:absolute;height:555px;padding:0;margin:0;color:inherit;background-color:#fff;width:420px;z-index:1000}.md-drppicker .dp-header{display:flex;flex-direction:row;justify-content:flex-end;align-items:center;padding:16px;border-bottom:1px solid #eee}.md-drppicker .dp-header .mat-form-field{max-width:214px}.md-drppicker .dp-header .cal-reset-btn,.md-drppicker .dp-header .cal-start-date{margin-right:16px}.md-drppicker .dp-header .mat-form-field-type-mat-input .mat-form-field-flex::after,.md-drppicker .dp-header .mat-form-field-type-mat-input .mat-form-field-flex::before{margin-top:0}.md-drppicker .dp-header .mat-form-field-prefix,.md-drppicker .dp-header .mat-form-field-suffix{top:0}.md-drppicker .dp-body{display:flex;flex-direction:row;margin-bottom:auto}.md-drppicker .dp-footer{display:flex;flex-direction:row;justify-content:space-between;padding:16px;border-top:1px solid #eee}.md-drppicker.single{height:395px}.md-drppicker.single .calendar.right{margin:0}.md-drppicker *,.md-drppicker :after,.md-drppicker :before{box-sizing:border-box}.md-drppicker .mat-form-field-flex::before{margin-top:0!important}.md-drppicker .mat-form-field-appearance-standard .mat-form-field-flex,.md-drppicker .mat-form-field-flex{align-items:center;padding:0}.md-drppicker .mat-form-field-infix,.md-drppicker .mat-form-field-wrapper{border-top:none;margin:0;padding:0;line-height:44px}.md-drppicker .mat-select{border:none}.md-drppicker .mat-select .mat-select-trigger{margin:0}.md-drppicker .mat-select-value{font-weight:500;font-size:16px}.md-drppicker .year{max-width:88px}.md-drppicker .year mat-form-field{width:100%}.md-drppicker .mat-form-field-appearance-legacy .mat-form-field-infix{padding:.4375em 0}.md-drppicker .custom-range-label{display:inline-flex}.md-drppicker .range-buttons{display:flex;flex-direction:row;justify-content:flex-start;width:100%}.md-drppicker .range-buttons button:not(:last-child){margin-right:15px}.md-drppicker.double{width:auto}.md-drppicker.inline{position:relative}.md-drppicker:after,.md-drppicker:before{position:absolute;display:inline-block;border-bottom-color:rgba(0,0,0,.2);content:\"\"}.md-drppicker.openscenter:after,.md-drppicker.openscenter:before{left:0;right:0;width:0;margin-left:auto;margin-right:auto}.md-drppicker.single .calendar,.md-drppicker.single .ranges{float:none}.md-drppicker.shown{transform:scale(1);transition:.1s ease-in-out;transform-origin:0 0;-webkit-touch-callout:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.md-drppicker.shown.drops-up-left{transform-origin:100% 100%}.md-drppicker.shown.drops-up-right{transform-origin:0 100%}.md-drppicker.shown.drops-down-left{transform-origin:100% 0}.md-drppicker.shown.drops-down-right{transform-origin:0 0}.md-drppicker.shown.drops-down-center{transform-origin:NaN%}.md-drppicker.shown.drops-up-center{transform-origin:50%}.md-drppicker.shown .calendar{display:flex;align-self:start}.md-drppicker.hidden{transition:.1s;transform:scale(0);transform-origin:0 0;cursor:default;-webkit-touch-callout:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.md-drppicker.hidden.drops-up-left{transform-origin:100% 100%}.md-drppicker.hidden.drops-up-right{transform-origin:0 100%}.md-drppicker.hidden.drops-down-left{transform-origin:100% 0}.md-drppicker.hidden.drops-down-right{transform-origin:0 0}.md-drppicker.hidden.drops-down-center{transform-origin:NaN%}.md-drppicker.hidden.drops-up-center{transform-origin:50%}.md-drppicker.hidden .calendar{display:none}.md-drppicker .calendar{max-width:390px;margin:0 15px}.md-drppicker .calendar .week-days th{height:28px;width:15px;color:#424242;font-size:16px;letter-spacing:.44px;line-height:28px;text-align:center;font-weight:500}.md-drppicker .calendar .month{height:28px;width:103px;color:#000;font-size:16px;letter-spacing:.44px;line-height:48px;text-align:center;font-weight:500}.md-drppicker .calendar.single .calendar-table{border:none}.md-drppicker .calendar td,.md-drppicker .calendar th{padding:0;white-space:nowrap;text-align:center;min-width:44px;height:44px}.md-drppicker .calendar td span,.md-drppicker .calendar th span{pointer-events:none}.md-drppicker .calendar-table{border:1px solid #fff;padding:15px;border-radius:25px;background-color:#fff}.md-drppicker table{width:100%;margin:0;border-collapse:separate}.md-drppicker th{color:#988c8c}.md-drppicker td,.md-drppicker th{text-align:center;border-radius:25px;border:2px solid transparent;white-space:nowrap;cursor:pointer;height:2em;width:2em}.md-drppicker td.week,.md-drppicker th.week{font-size:80%;color:#ccc}.md-drppicker td{margin:.25em 0;opacity:.8;transition:background-color .2s;border-radius:2em;transform:scale(1)}.md-drppicker td.off,.md-drppicker td.off.end-date,.md-drppicker td.off.in-range,.md-drppicker td.off.start-date{background-color:#fff;border-color:transparent;color:#999}.md-drppicker td.in-range{background-color:#e3f2fd;border-color:#e3f2fd;color:#000;opacity:1;border-radius:0}.md-drppicker td.start-date{border-radius:2em 0 0 2em}.md-drppicker td.end-date{border-radius:0 2em 2em 0}.md-drppicker td.start-date.end-date{border-radius:25px}.md-drppicker td.active{transition:background .3s ease-out;color:#fff;box-sizing:border-box;height:44px;width:44px;background-color:#42a5f5;border-color:#42a5f5}.md-drppicker td.active:hover{border-color:#e3f2fd}.md-drppicker th.month{width:auto}.md-drppicker option.disabled,.md-drppicker td.disabled{color:#999;cursor:not-allowed;text-decoration:line-through}.md-drppicker .dropdowns{background-repeat:no-repeat;background-size:10px;background-position-y:center;background-position-x:right;width:108px;background-image:url(data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjE2cHgiIGhlaWdodD0iMTZweCIgdmlld0JveD0iMCAwIDI1NSAyNTUiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDI1NSAyNTU7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPGc+Cgk8ZyBpZD0iYXJyb3ctZHJvcC1kb3duIj4KCQk8cG9seWdvbiBwb2ludHM9IjAsNjMuNzUgMTI3LjUsMTkxLjI1IDI1NSw2My43NSAgICIgZmlsbD0iIzk4OGM4YyIvPgoJPC9nPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=)}.md-drppicker .dropdowns select{display:inline-block;background-color:rgba(255,255,255,.9);width:100%;padding:5px;border:1px solid #f2f2f2;border-radius:2px;height:3rem}.md-drppicker .dropdowns select.ampmselect,.md-drppicker .dropdowns select.hourselect,.md-drppicker .dropdowns select.minuteselect,.md-drppicker .dropdowns select.secondselect{width:50px;margin:0 auto;background:#eee;border:1px solid #eee;padding:2px;outline:0;font-size:12px}.md-drppicker .dropdowns select.monthselect,.md-drppicker .dropdowns select.yearselect{font-size:12px;height:auto;cursor:pointer;opacity:0;position:absolute;top:0;left:0;margin:0;padding:0}.md-drppicker th.month>div{position:relative;display:inline-block}.md-drppicker .calendar-time{text-align:center;margin:4px auto 0;line-height:30px;position:relative}.md-drppicker .calendar-time .select{display:inline}.md-drppicker .calendar-time .select .select-item{display:inline-block;width:auto;position:relative;font-family:inherit;background-color:transparent;padding:10px 10px 10px 0;font-size:18px;border-radius:0;border:none;border-bottom:1px solid rgba(0,0,0,.12)}.md-drppicker .calendar-time .select .select-item:after{position:absolute;top:18px;right:10px;width:0;height:0;padding:0;content:\"\";border-left:6px solid transparent;border-right:6px solid transparent;border-top:6px solid rgba(0,0,0,.12);pointer-events:none}.md-drppicker .calendar-time .select .select-item:focus{outline:0}.md-drppicker .calendar-time .select .select-item .select-label{color:rgba(0,0,0,.26);font-size:16px;font-weight:400;position:absolute;pointer-events:none;left:0;top:10px;transition:.2s}.md-drppicker .calendar-time select.disabled{color:#ccc;cursor:not-allowed}.md-drppicker .label-input{border:1px solid #ccc;border-radius:25px;color:#555;height:30px;line-height:30px;display:block;vertical-align:middle;margin:0 auto 5px;padding:0 0 0 28px;width:100%}.md-drppicker .label-input.active{border:1px solid #42a5f5;border-radius:25px}.md-drppicker .md-drppicker_input{position:relative;padding:0 30px 0 0}.md-drppicker .md-drppicker_input i,.md-drppicker .md-drppicker_input svg{position:absolute;left:8px;top:8px}.md-drppicker.rtl .label-input{padding-right:28px;padding-left:6px}.md-drppicker.rtl .md-drppicker_input i,.md-drppicker.rtl .md-drppicker_input svg{left:auto;right:8px}.md-drppicker .show-ranges .drp-calendar.left{border-left:1px solid #ddd}.md-drppicker .ranges{float:none;text-align:left;margin:0}.md-drppicker .ranges ul{list-style:none;margin:0 auto;padding:0;width:100%}.md-drppicker .ranges ul li{font-size:12px;margin-right:20px}.md-drppicker .ranges ul li button{padding:8px 12px;width:100%;background:0 0;border:none;text-align:left;cursor:pointer}.md-drppicker .ranges ul li button[disabled]{opacity:.3}.md-drppicker .show-calendar .ranges{margin-top:8px}.md-drppicker [hidden]{display:none}.md-drppicker .buttons{text-align:right;margin:0 5px 5px 0}.md-drppicker .btn{position:relative;overflow:hidden;border-width:0;outline:0;padding:0 6px;cursor:pointer;border-radius:2px;box-shadow:0 1px 4px rgba(0,0,0,.6);background-color:#3f51b5;color:#ecf0f1;transition:background-color .4s;height:auto;text-transform:uppercase;line-height:36px;border:none}.md-drppicker .btn:focus,.md-drppicker .btn:hover{background-color:#3f51b5}.md-drppicker .btn>*{position:relative}.md-drppicker .btn span{display:block;padding:12px 24px}.md-drppicker .btn:before{content:\"\";position:absolute;top:50%;left:50%;display:block;width:0;padding-top:0;border-radius:100%;background-color:rgba(236,240,241,.3);transform:translate(-50%,-50%)}.md-drppicker .btn:active:before{width:120%;padding-top:120%;transition:width .2s ease-out,padding-top .2s ease-out}.md-drppicker .btn:disabled{opacity:.5}.md-drppicker .btn.btn-default{color:#000;background-color:#dcdcdc}.md-drppicker .clear{box-shadow:none;background-color:#fff!important}.md-drppicker .clear svg{color:#eb3232;fill:currentColor}.field-row{width:100%;height:65px;border-bottom:1px solid #eee}.field-row mat-form-field{float:right;margin-right:15px}.field-row .mat-form-field-flex{height:55px;padding-top:10px}.cal-reset-btn{margin-right:15px}td.available:hover{border:2px solid #42a5f5}.full-screen{position:fixed;top:0;left:0;width:100%;height:100%;display:flex;flex-direction:column;justify-content:space-between}.full-screen .dp-header{background-color:#1565c0;color:#fff;width:100%;padding:0 16px;flex:0 0 56px;display:flex;flex-direction:row;justify-content:space-between;align-items:center}.full-screen .dp-header .header-icon{height:40px;width:40px;line-height:40px;vertical-align:middle;text-align:center}.full-screen .dp-header .header-icon mat-icon{vertical-align:middle}.full-screen .body-container{height:100%;overflow:hidden;display:flex;flex-direction:column;justify-content:space-between}.full-screen .dp-body{margin-bottom:auto;flex:1 1 auto;flex-direction:column;padding:150px 0;overflow-y:scroll}.full-screen .dp-body .calendar{flex:1 1 100%;max-width:616px;width:100%;height:auto;margin:0 auto}.full-screen .dp-body .calendar-table{flex:1 0 100%}.full-screen .dp-body .available{z-index:999}.full-screen .dp-body .available.next{right:10px}.full-screen .dp-body .available.prev{left:10px}.full-screen .dp-footer{flex:0 0 56px;display:flex;flex-direction:row;justify-content:flex-end;align-items:center}.full-screen .dp-footer .control-buttons{display:flex;flex-direction:row;justify-content:space-between;width:166px}"]
            })
        ], DateRangePickerComponent);
        return DateRangePickerComponent;
    }());

    var moment$2 = _moment;
    var DateRangePickerDirective = /** @class */ (function () {
        function DateRangePickerDirective(applicationRef, viewContainerRef, injector, _changeDetectorRef, _componentFactoryResolver, _el, _renderer, differs, _localeService, elementRef) {
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
            this.onChange = new core.EventEmitter();
            // tslint:disable-next-line:no-output-rename
            this.rangeClicked = new core.EventEmitter();
            // tslint:disable-next-line:no-output-rename
            this.datesUpdated = new core.EventEmitter();
            this.startDateChanged = new core.EventEmitter();
            this.endDateChanged = new core.EventEmitter();
            this.scrollPos = 0;
            this.drops = 'down';
            this.opens = 'auto';
            var applicationRoot = document.body.querySelector('*[ng-version]');
            var dateRangePickerElement = applicationRoot.querySelector('ngx-daterangepicker-material');
            var componentFactory = this._componentFactoryResolver.resolveComponentFactory(DateRangePickerComponent);
            var componentRef = componentFactory.create(injector);
            this.applicationRef.attachView(componentRef.hostView);
            var componentElem = componentRef.hostView.rootNodes[0];
            componentElem.classList.add('hidden');
            if (dateRangePickerElement && applicationRoot.contains(dateRangePickerElement)) {
                dateRangePickerElement.classList.add('hidden');
                applicationRoot.removeChild(dateRangePickerElement);
            }
            applicationRoot.appendChild(componentElem);
            this.picker = componentRef.instance;
            this.picker.inline = false;
        }
        DateRangePickerDirective_1 = DateRangePickerDirective;
        Object.defineProperty(DateRangePickerDirective.prototype, "locale", {
            get: function () {
                return this._locale;
            },
            set: function (value) {
                this._locale = __assign({}, this._localeService.config, value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DateRangePickerDirective.prototype, "startKey", {
            set: function (value) {
                if (value !== null) {
                    this._startKey = value;
                }
                else {
                    this._startKey = 'startDate';
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DateRangePickerDirective.prototype, "endKey", {
            set: function (value) {
                if (value !== null) {
                    this._endKey = value;
                }
                else {
                    this._endKey = 'endDate';
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DateRangePickerDirective.prototype, "value", {
            get: function () {
                return this._value || null;
            },
            set: function (val) {
                this._value = val;
                this._onChange(val);
                this._changeDetectorRef.markForCheck();
            },
            enumerable: true,
            configurable: true
        });
        DateRangePickerDirective.prototype.ngOnInit = function () {
            var _this = this;
            this.picker.startDateChanged.asObservable().subscribe(function (itemChanged) {
                _this.startDateChanged.emit(itemChanged);
            });
            this.picker.endDateChanged.asObservable().subscribe(function (itemChanged) {
                _this.endDateChanged.emit(itemChanged);
            });
            this.picker.rangeClicked.asObservable().subscribe(function (range) {
                _this.rangeClicked.emit(range);
            });
            this.picker.datesUpdated.asObservable().subscribe(function (range) {
                _this.datesUpdated.emit(range);
            });
            this.picker.choosedDate.asObservable().subscribe(function (change) {
                if (change) {
                    var value = {};
                    value[_this._startKey] = change.startDate;
                    value[_this._endKey] = change.endDate;
                    _this.value = value;
                    _this.onChange.emit(value);
                    if (typeof change.chosenLabel === 'string') {
                        _this._el.nativeElement.value = change.chosenLabel;
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
        };
        DateRangePickerDirective.prototype.ngOnChanges = function (changes) {
            for (var change in changes) {
                if (changes.hasOwnProperty(change)) {
                    if (this.notForChangesProperty.indexOf(change) === -1) {
                        this.picker[change] = changes[change].currentValue;
                    }
                }
            }
        };
        DateRangePickerDirective.prototype.ngDoCheck = function () {
            if (this.localeDiffer) {
                var changes = this.localeDiffer.diff(this.locale);
                if (changes) {
                    this.picker.updateLocale(this.locale);
                }
            }
        };
        DateRangePickerDirective.prototype.onBlur = function () {
            this._onTouched();
        };
        DateRangePickerDirective.prototype.open = function (event) {
            var _this = this;
            this.picker.show(event);
            setTimeout(function () {
                _this.setPosition();
            });
        };
        DateRangePickerDirective.prototype.hide = function (e) {
            this.picker.hide(e);
        };
        DateRangePickerDirective.prototype.toggle = function (e) {
            if (this.picker.isShown) {
                this.hide(e);
            }
            else {
                this.open(e);
            }
        };
        DateRangePickerDirective.prototype.clear = function () {
            this.picker.clear();
        };
        DateRangePickerDirective.prototype.writeValue = function (value) {
            this.setValue(value);
        };
        DateRangePickerDirective.prototype.registerOnChange = function (fn) {
            this._onChange = fn;
        };
        DateRangePickerDirective.prototype.registerOnTouched = function (fn) {
            this._onTouched = fn;
        };
        DateRangePickerDirective.prototype.setValue = function (val) {
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
        };
        /**
         * Set position of the calendar
         */
        DateRangePickerDirective.prototype.setPosition = function () {
            var style;
            var containerTop;
            this.topAdjustment = this.topAdjustment ? +this.topAdjustment : 0;
            this.leftAdjustment = this.leftAdjustment ? +this.leftAdjustment : 0;
            // todo: revisit the offsets where when both the shared components are done and the order search rework is finished
            var container = this.picker.pickerContainer.nativeElement;
            var element = this._el.nativeElement;
            if (this.targetElementId) {
                element = document.getElementById(this.targetElementId);
            }
            else {
                element = element.parentElement;
            }
            var elementLocation = element.getBoundingClientRect();
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
                var position = elementLocation.left + elementLocation.width / 2 - container.clientWidth / 2;
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
        };
        DateRangePickerDirective.prototype.inputChanged = function (e) {
            if (e.target.tagName.toLowerCase() !== 'input') {
                return;
            }
            if (!e.target.value.length) {
                return;
            }
            var dateString = e.target.value.split(this.picker.locale.separator);
            var start = null, end = null;
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
        };
        /**
         * For click outside of the calendar's container
         * @param event event object
         */
        DateRangePickerDirective.prototype.outsideClick = function (event) {
            if (!event.target) {
                return;
            }
            if (event.target.classList.contains('ngx-daterangepicker-action')) {
                return;
            }
            var targetElement = document.getElementById(this.targetElementId);
            if (targetElement && targetElement.contains(event.target)) {
                this.open(event);
            }
            if (!this.elementRef.nativeElement.contains(event.target) &&
                event.target.className.indexOf('mat-option') === -1) {
                this.hide();
            }
        };
        var DateRangePickerDirective_1;
        DateRangePickerDirective.ctorParameters = function () { return [
            { type: core.ApplicationRef },
            { type: core.ViewContainerRef },
            { type: core.Injector },
            { type: core.ChangeDetectorRef },
            { type: core.ComponentFactoryResolver },
            { type: core.ElementRef },
            { type: core.Renderer2 },
            { type: core.KeyValueDiffers },
            { type: LocaleService },
            { type: core.ElementRef }
        ]; };
        __decorate([
            core.Input()
        ], DateRangePickerDirective.prototype, "locale", null);
        __decorate([
            core.Input()
        ], DateRangePickerDirective.prototype, "startKey", null);
        __decorate([
            core.Input()
        ], DateRangePickerDirective.prototype, "endKey", null);
        __decorate([
            core.Input()
        ], DateRangePickerDirective.prototype, "minDate", void 0);
        __decorate([
            core.Input()
        ], DateRangePickerDirective.prototype, "maxDate", void 0);
        __decorate([
            core.Input()
        ], DateRangePickerDirective.prototype, "autoApply", void 0);
        __decorate([
            core.Input()
        ], DateRangePickerDirective.prototype, "targetElementId", void 0);
        __decorate([
            core.Input()
        ], DateRangePickerDirective.prototype, "topAdjustment", void 0);
        __decorate([
            core.Input()
        ], DateRangePickerDirective.prototype, "leftAdjustment", void 0);
        __decorate([
            core.Input()
        ], DateRangePickerDirective.prototype, "isFullScreenPicker", void 0);
        __decorate([
            core.Input()
        ], DateRangePickerDirective.prototype, "alwaysShowCalendars", void 0);
        __decorate([
            core.Input()
        ], DateRangePickerDirective.prototype, "showCustomRangeLabel", void 0);
        __decorate([
            core.Input()
        ], DateRangePickerDirective.prototype, "linkedCalendars", void 0);
        __decorate([
            core.Input()
        ], DateRangePickerDirective.prototype, "buttonClassApply", void 0);
        __decorate([
            core.Input()
        ], DateRangePickerDirective.prototype, "buttonClassReset", void 0);
        __decorate([
            core.Input()
        ], DateRangePickerDirective.prototype, "buttonClassRange", void 0);
        __decorate([
            core.Input()
        ], DateRangePickerDirective.prototype, "dateLimit", void 0);
        __decorate([
            core.Input()
        ], DateRangePickerDirective.prototype, "singleDatePicker", void 0);
        __decorate([
            core.Input()
        ], DateRangePickerDirective.prototype, "showWeekNumbers", void 0);
        __decorate([
            core.Input()
        ], DateRangePickerDirective.prototype, "showISOWeekNumbers", void 0);
        __decorate([
            core.Input()
        ], DateRangePickerDirective.prototype, "showDropdowns", void 0);
        __decorate([
            core.Input()
        ], DateRangePickerDirective.prototype, "isInvalidDate", void 0);
        __decorate([
            core.Input()
        ], DateRangePickerDirective.prototype, "isCustomDate", void 0);
        __decorate([
            core.Input()
        ], DateRangePickerDirective.prototype, "showClearButton", void 0);
        __decorate([
            core.Input()
        ], DateRangePickerDirective.prototype, "customRangeDirection", void 0);
        __decorate([
            core.Input()
        ], DateRangePickerDirective.prototype, "ranges", void 0);
        __decorate([
            core.Input()
        ], DateRangePickerDirective.prototype, "opens", void 0);
        __decorate([
            core.Input()
        ], DateRangePickerDirective.prototype, "drops", void 0);
        __decorate([
            core.Input()
        ], DateRangePickerDirective.prototype, "lastMonthDayClass", void 0);
        __decorate([
            core.Input()
        ], DateRangePickerDirective.prototype, "emptyWeekRowClass", void 0);
        __decorate([
            core.Input()
        ], DateRangePickerDirective.prototype, "firstDayOfNextMonthClass", void 0);
        __decorate([
            core.Input()
        ], DateRangePickerDirective.prototype, "lastDayOfPreviousMonthClass", void 0);
        __decorate([
            core.Input()
        ], DateRangePickerDirective.prototype, "keepCalendarOpeningWithRange", void 0);
        __decorate([
            core.Input()
        ], DateRangePickerDirective.prototype, "showRangeLabelOnInput", void 0);
        __decorate([
            core.Input()
        ], DateRangePickerDirective.prototype, "showCancel", void 0);
        __decorate([
            core.Input()
        ], DateRangePickerDirective.prototype, "lockStartDate", void 0);
        __decorate([
            core.Input()
        ], DateRangePickerDirective.prototype, "timePicker", void 0);
        __decorate([
            core.Input()
        ], DateRangePickerDirective.prototype, "timePicker24Hour", void 0);
        __decorate([
            core.Input()
        ], DateRangePickerDirective.prototype, "timePickerIncrement", void 0);
        __decorate([
            core.Input()
        ], DateRangePickerDirective.prototype, "timePickerSeconds", void 0);
        __decorate([
            core.Input()
        ], DateRangePickerDirective.prototype, "closeOnAutoApply", void 0);
        __decorate([
            core.Input()
        ], DateRangePickerDirective.prototype, "_endKey", void 0);
        __decorate([
            core.Output('change')
        ], DateRangePickerDirective.prototype, "onChange", void 0);
        __decorate([
            core.Output('rangeClicked')
        ], DateRangePickerDirective.prototype, "rangeClicked", void 0);
        __decorate([
            core.Output('datesUpdated')
        ], DateRangePickerDirective.prototype, "datesUpdated", void 0);
        __decorate([
            core.Output()
        ], DateRangePickerDirective.prototype, "startDateChanged", void 0);
        __decorate([
            core.Output()
        ], DateRangePickerDirective.prototype, "endDateChanged", void 0);
        __decorate([
            core.HostListener('document:click', ['$event'])
        ], DateRangePickerDirective.prototype, "outsideClick", null);
        DateRangePickerDirective = DateRangePickerDirective_1 = __decorate([
            core.Directive({
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
                        provide: forms.NG_VALUE_ACCESSOR,
                        useExisting: core.forwardRef(function () { return DateRangePickerDirective_1; }),
                        multi: true
                    }
                ]
            })
        ], DateRangePickerDirective);
        return DateRangePickerDirective;
    }());

    var NgxDateRangePickerMd = /** @class */ (function () {
        function NgxDateRangePickerMd() {
        }
        NgxDateRangePickerMd_1 = NgxDateRangePickerMd;
        NgxDateRangePickerMd.forRoot = function (config) {
            if (config === void 0) { config = {}; }
            return {
                ngModule: NgxDateRangePickerMd_1,
                providers: [
                    { provide: LOCALE_CONFIG, useValue: config },
                    { provide: LocaleService, useClass: LocaleService, deps: [LOCALE_CONFIG] }
                ]
            };
        };
        var NgxDateRangePickerMd_1;
        NgxDateRangePickerMd = NgxDateRangePickerMd_1 = __decorate([
            core.NgModule({
                declarations: [DateRangePickerComponent, DateRangePickerDirective],
                imports: [
                    common.CommonModule,
                    forms.FormsModule,
                    forms.ReactiveFormsModule,
                    formField.MatFormFieldModule,
                    input.MatInputModule,
                    datepicker.MatDatepickerModule,
                    icon.MatIconModule,
                    button.MatButtonModule,
                    card.MatCardModule,
                    divider.MatDividerModule,
                    select.MatSelectModule
                ],
                providers: [],
                exports: [DateRangePickerComponent, DateRangePickerDirective],
                entryComponents: [DateRangePickerComponent]
            })
        ], NgxDateRangePickerMd);
        return NgxDateRangePickerMd;
    }());

    exports.DateRangePickerComponent = DateRangePickerComponent;
    exports.DateRangePickerDirective = DateRangePickerDirective;
    exports.DefaultLocaleConfig = DefaultLocaleConfig;
    exports.LOCALE_CONFIG = LOCALE_CONFIG;
    exports.LocaleService = LocaleService;
    exports.NgxDateRangePickerMd = NgxDateRangePickerMd;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=ngx-daterangepicker-material.umd.js.map
