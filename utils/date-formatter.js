import moment from 'moment'

export function formatMySQLDate(d) {
  return moment(d).format('YYYY-MM-DD')
}

export function formatDisplayDate(d) {
  return moment(d).format("MMM DD, YYYY")
}