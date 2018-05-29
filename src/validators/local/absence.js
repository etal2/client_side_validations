import ClientSideValidations from '../../ClientSideValidations'

ClientSideValidations.validators.local.absence = function (element, options) {
  if (!/^\s*$/.test(element.val() || '')) {
    return options.message
  }
}
