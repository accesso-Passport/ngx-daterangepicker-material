import dayjs from 'dayjs';
import arraySupport from 'dayjs/plugin/arraySupport';
import isoWeek from 'dayjs/plugin/isoWeek';
import localeData from 'dayjs/plugin/localeData';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(localeData);
dayjs.extend(arraySupport);
dayjs.extend(LocalizedFormat);
dayjs.extend(isoWeek);

export default dayjs;
