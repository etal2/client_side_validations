import ClientSideValidations from '../../ClientSideValidations'

ClientSideValidations.validators.local.exclusion = function (element, options) {
  let lower, message, upper

  message = this.presence(element, options)

  if (message) {
    if (options.allow_blank === true) {
      return
    }

    return message
  }

  if (options['in']) {
    const results = []

    for (let i in options['in']) {
      results.push(options['in'][i].toString())
    }

    if (results.indexOf(element.val()) >= 0) {
      return options.message
    }
  }

  if (options.range) {
    lower = options.range[0]
    upper = options.range[1]

    if (element.val() >= lower && element.val() <= upper) {
      return options.message
    }
  }
}
