import ClientSideValidations from '../../ClientSideValidations'

ClientSideValidations.validators.local.presence = function (element, options) {
  if (/^\s*$/.test(element.val() || '')) {
    return options.message
  }
}
