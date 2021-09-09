import { formatMySQLDate } from './date-formatter'

export function setBreakdownState(areaId, breakdownStartDate, breakDownEndDate) {
    localStorage.setItem("breakdown-start-date", formatMySQLDate(breakdownStartDate))
    localStorage.setItem("breakdown-end-date", formatMySQLDate(breakDownEndDate))
    localStorage.setItem("area-id", JSON.stringify(areaId))
}