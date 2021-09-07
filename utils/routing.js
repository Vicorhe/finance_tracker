import { formatMySQLDate } from './date-formatter'

export function getBreakdownURLObject(a, startDate, endDate) {
    return {
        pathname: '/breakdown',
        query: {
            area: a.label,
            start: formatMySQLDate(startDate),
            end: formatMySQLDate(endDate)
        }
    }
}