import { Injectable, Inject } from '@angular/core';
import { LOCALE_CONFIG, DefaultLocaleConfig } from '../date-range-picker.config';
export class LocaleService {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYWxlLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiRDovZGV2ZWxvcG1lbnQvYWNjZXNzby9hcHBsaWNhdGlvbnMvbmd4LWRhdGVyYW5nZXBpY2tlci1tYXRlcmlhbC9zcmMvZGF0ZXJhbmdlcGlja2VyLyIsInNvdXJjZXMiOlsic2VydmljZXMvbG9jYWxlLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDbkQsT0FBTyxFQUFFLGFBQWEsRUFBRSxtQkFBbUIsRUFBZ0IsTUFBTSw2QkFBNkIsQ0FBQztBQUcvRixNQUFNLE9BQU8sYUFBYTtJQUN6QixZQUEyQyxPQUFxQjtRQUFyQixZQUFPLEdBQVAsT0FBTyxDQUFjO0lBQUcsQ0FBQztJQUVwRSxJQUFJLE1BQU07UUFDVCx1Q0FBWSxtQkFBbUIsR0FBSyxJQUFJLENBQUMsT0FBTyxFQUFHO0lBQ3BELENBQUM7OztZQU5ELFVBQVU7Ozs0Q0FFRyxNQUFNLFNBQUMsYUFBYSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUsIEluamVjdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBMT0NBTEVfQ09ORklHLCBEZWZhdWx0TG9jYWxlQ29uZmlnLCBMb2NhbGVDb25maWcgfSBmcm9tICcuLi9kYXRlLXJhbmdlLXBpY2tlci5jb25maWcnO1xyXG5cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgTG9jYWxlU2VydmljZSB7XHJcblx0Y29uc3RydWN0b3IoQEluamVjdChMT0NBTEVfQ09ORklHKSBwcml2YXRlIF9jb25maWc6IExvY2FsZUNvbmZpZykge31cclxuXHJcblx0Z2V0IGNvbmZpZygpIHtcclxuXHRcdHJldHVybiB7IC4uLkRlZmF1bHRMb2NhbGVDb25maWcsIC4uLnRoaXMuX2NvbmZpZyB9O1xyXG5cdH1cclxufVxyXG4iXX0=