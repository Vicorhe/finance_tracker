import { formatMySQLDate } from './date-formatter'

export function getBreakdownURLObject(a, startDate, endDate) {
    return {
        pathname: '/breakdown',
        query: {
            area: extractAreaId(a),
            start: formatMySQLDate(startDate),
            end: formatMySQLDate(endDate)
        }
    }
}

function extractAreaId(a) {
    if ('label' in a) return a.label
    if ('data' in a) {
        if ('id' in a.data) return a.data.id
    }
    if ('id' in a) return a.id
}