import $ from 'jquery'
import ClientSideValidations from '../../ClientSideValidations'

ClientSideValidations.validators.local.confirmation = function (element, options) {
  let confirmationValue, value
  value = element.val()
  confirmationValue = $('#' + (element.attr('id')) + '_confirmation').val()

  if (!options.case_sensitive) {
    value = value.toLowerCase()
    confirmationValue = confirmationValue.toLowerCase()
  }

  if (value !== confirmationValue) {
    return options.message
  }
}
