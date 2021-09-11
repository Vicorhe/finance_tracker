import { formatMySQLDate } from './date-formatter'
import moment from 'moment'

export function setBreakdownState(areaId, breakdownStartDate, breakDownEndDate) {
  localStorage.setItem("breakdown-start-date", formatMySQLDate(breakdownStartDate))
  localStorage.setItem("breakdown-end-date", formatMySQLDate(breakDownEndDate))
  localStorage.setItem("area-id", JSON.stringify(areaId))
}

export function fetchDate(dateKey, defaultDate) {
  if (typeof window !== 'undefined') {
    const dateString = window.localStorage.getItem(dateKey)
    if (!!dateString) return moment(dateString).toDate()
  }
  return defaultDate
}