import * as dayjs from 'dayjs';
import * as arraySupport from 'dayjs/plugin/arraySupport';
import * as isoWeek from 'dayjs/plugin/isoWeek';
import * as localeData from 'dayjs/plugin/localeData';
import * as LocalizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(localeData);
dayjs.extend(arraySupport);
dayjs.extend(LocalizedFormat);
dayjs.extend(isoWeek);

export default dayjs;
