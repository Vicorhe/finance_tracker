export function remainingAmount(parent, splits) {
  var rem = parent.amount
  for (var i = 0; i < splits.length; i++) {
    let parsed = parseFloat(splits[i].amount)
    if (!isNaN(parsed))
      rem -= parsed
  }
  return Math.abs(rem).toFixed(2)
}

export function validForm(parent, splits) {
  if (remainingAmount(parent, splits) !== '0.00') {
    return 'Please make sure all the parent transaction amount is accounted for in splits.'
  }
  for (var i = 0; i < splits.length; i++) {
    let s = splits[i]
    if (!s.amount) {
      return 'Please make sure all splits have an `amount` set.'
    }
    if (!s.name) {
      return 'Please make sure all splits have a `name` set.'
    }
  }
  return ''
}