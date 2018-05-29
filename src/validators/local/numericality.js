import $ from 'jquery'
import ClientSideValidations from '../../ClientSideValidations'

ClientSideValidations.validators.local.numericality = function (element, options) {
  let $form, check, checkValue, fn, numberFormat, operator, val

  const CHECKS = {
    greater_than: '>',
    greater_than_or_equal_to: '>=',
    equal_to: '==',
    less_than: '<',
    less_than_or_equal_to: '<='
  }

  if (options.allow_blank === true && this.presence(element, {
    message: options.messages.numericality
  })) {
    return
  }

  $form = $(element[0].form)
  numberFormat = $form[0].ClientSideValidations.settings.number_format
  val = $.trim(element.val()).replace(new RegExp('\\' + numberFormat.separator, 'g'), '.')

  if (options.only_integer && !ClientSideValidations.patterns.numericality.only_integer.test(val)) {
    return options.messages.only_integer
  }

  if (!ClientSideValidations.patterns.numericality['default'].test(val)) {
    return options.messages.numericality
  }

  for (check in CHECKS) {
    if (options[check] == null) {
      continue
    }

    checkValue = !isNaN(parseFloat(options[check])) && isFinite(options[check]) ? options[check] : $form.find('[name*=' + options[check] + ']').length === 1 ? $form.find('[name*=' + options[check] + ']').val() : void 0

    if ((checkValue == null) || checkValue === '') {
      return
    }

    operator = CHECKS[check]
    fn = new Function('return ' + val + ' ' + operator + ' ' + checkValue) // eslint-disable-line no-new-func

    if (!fn()) {
      return options.messages[check]
    }
  }

  if (options.odd && !(parseInt(val, 10) % 2)) {
    return options.messages.odd
  }

  if (options.even && (parseInt(val, 10) % 2)) {
    return options.messages.even
  }
}
