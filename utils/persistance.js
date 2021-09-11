import { formatMySQLDate } from './date-formatter'
import { breakdownStartDateKey, breakdownEndDateKey, areaKey } from '../static/constants'
import moment from 'moment'

export function setBreakdownState(areaId, breakdownStartDate, breakDownEndDate) {
  localStorage.setItem(breakdownStartDateKey, formatMySQLDate(breakdownStartDate))
  localStorage.setItem(breakdownEndDateKey, formatMySQLDate(breakDownEndDate))
  localStorage.setItem(areaKey, JSON.stringify(areaId))
}

export function fetchDate(dateKey, defaultDate) {
  if (typeof window !== 'undefined') {
    const dateString = window.localStorage.getItem(dateKey)
    if (!!dateString) return moment(dateString).toDate()
  }
  return defaultDate
}

export function fetchArea() {
  if (typeof window !== 'undefined') {
    const areaString = window.localStorage.getItem(areaKey)
    if (!!areaString) return parseInt(areaString)
  }
  return 1
}