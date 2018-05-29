import ClientSideValidations from '../../ClientSideValidations'

ClientSideValidations.validators.local.inclusion = function (element, options) {
  let lower, message, option, upper
  message = this.presence(element, options)
  if (message) {
    if (options.allow_blank === true) {
      return
    }
    return message
  }
  if (options['in']) {
    const results = []
    for (let i = 0, len = options['in'].length; i < len; i++) {
      option = options['in'][i]
      results.push(option.toString())
    }

    if (results.indexOf(element.val()) >= 0) return

    return options.message
  }
  if (options.range) {
    lower = options.range[0]
    upper = options.range[1]
    if (element.val() >= lower && element.val() <= upper) {
      return
    }
    return options.message
  }
}
