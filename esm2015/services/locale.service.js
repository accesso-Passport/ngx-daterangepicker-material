import * as tslib_1 from "tslib";
import { Injectable, Inject } from '@angular/core';
import { LOCALE_CONFIG, DefaultLocaleConfig } from '../date-range-picker.config';
let LocaleService = class LocaleService {
    constructor(_config) {
        this._config = _config;
    }
    get config() {
        return Object.assign({}, DefaultLocaleConfig, this._config);
    }
};
LocaleService.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [LOCALE_CONFIG,] }] }
];
LocaleService = tslib_1.__decorate([
    Injectable(),
    tslib_1.__param(0, Inject(LOCALE_CONFIG))
], LocaleService);
export { LocaleService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYWxlLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtZGF0ZXJhbmdlcGlja2VyLW1hdGVyaWFsLyIsInNvdXJjZXMiOlsic2VydmljZXMvbG9jYWxlLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ25ELE9BQU8sRUFBRSxhQUFhLEVBQUUsbUJBQW1CLEVBQWdCLE1BQU0sNkJBQTZCLENBQUM7QUFHL0YsSUFBYSxhQUFhLEdBQTFCLE1BQWEsYUFBYTtJQUN6QixZQUEyQyxPQUFxQjtRQUFyQixZQUFPLEdBQVAsT0FBTyxDQUFjO0lBQUcsQ0FBQztJQUVwRSxJQUFJLE1BQU07UUFDVCx5QkFBWSxtQkFBbUIsRUFBSyxJQUFJLENBQUMsT0FBTyxFQUFHO0lBQ3BELENBQUM7Q0FDRCxDQUFBOzs0Q0FMYSxNQUFNLFNBQUMsYUFBYTs7QUFEckIsYUFBYTtJQUR6QixVQUFVLEVBQUU7SUFFQyxtQkFBQSxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUE7R0FEdEIsYUFBYSxDQU16QjtTQU5ZLGFBQWEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3QgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IExPQ0FMRV9DT05GSUcsIERlZmF1bHRMb2NhbGVDb25maWcsIExvY2FsZUNvbmZpZyB9IGZyb20gJy4uL2RhdGUtcmFuZ2UtcGlja2VyLmNvbmZpZyc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBMb2NhbGVTZXJ2aWNlIHtcblx0Y29uc3RydWN0b3IoQEluamVjdChMT0NBTEVfQ09ORklHKSBwcml2YXRlIF9jb25maWc6IExvY2FsZUNvbmZpZykge31cblxuXHRnZXQgY29uZmlnKCkge1xuXHRcdHJldHVybiB7IC4uLkRlZmF1bHRMb2NhbGVDb25maWcsIC4uLnRoaXMuX2NvbmZpZyB9O1xuXHR9XG59XG4iXX0=