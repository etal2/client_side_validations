import ClientSideValidations from '../../ClientSideValidations'

ClientSideValidations.validators.local.length = function (element, options) {
  let blankOptions, check, fn, message, operator, tokenizedLength, tokenizer

  const CHECKS = {
    is: '==',
    minimum: '>=',
    maximum: '<='
  }

  tokenizer = options.js_tokenizer || "split('')"

  tokenizedLength = new Function('element', 'return (element.val().' + tokenizer + " || '').length")(element) // eslint-disable-line no-new-func

  blankOptions = {}
  blankOptions.message = options.is ? options.messages.is : options.minimum ? options.messages.minimum : void 0
  message = this.presence(element, blankOptions)

  if (message) {
    if (options.allow_blank === true) {
      return
    }

    return message
  }

  for (check in CHECKS) {
    if (!options[check]) {
      continue
    }

    operator = CHECKS[check]
    fn = new Function('return ' + tokenizedLength + ' ' + operator + ' ' + options[check]) // eslint-disable-line no-new-func

    if (!fn()) {
      return options.messages[check]
    }
  }
}
