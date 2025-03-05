import dayjs from 'dayjs';
import localeData from 'dayjs/plugin/localeData';
import arraySupport from 'dayjs/plugin/arraySupport';
import isoWeek from 'dayjs/plugin/isoWeek';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(localeData);
dayjs.extend(LocalizedFormat);
dayjs.extend(isoWeek);
dayjs.extend(arraySupport);

export { dayjs, localeData, LocalizedFormat, isoWeek, arraySupport };
