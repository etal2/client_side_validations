import $ from 'jquery'
import ClientSideValidations from '../../ClientSideValidations'

ClientSideValidations.validators.local.uniqueness = function (element, options) {
  let form, matches, name, namePrefix, nameSuffix, valid, value
  name = element.attr('name')

  if (!/_attributes\]\[\d/.test(name)) {
    return
  }

  matches = name.match(/^(.+_attributes\])\[\d+\](.+)$/)
  namePrefix = matches[1]
  nameSuffix = matches[2]
  value = element.val()

  if (!(namePrefix && nameSuffix)) {
    return
  }

  form = element.closest('form')
  valid = true

  form.find(':input[name^="' + namePrefix + '"][name$="' + nameSuffix + '"]').each(function () {
    if ($(this).attr('name') !== name) {
      if ($(this).val() === value) {
        valid = false
        return $(this).data('notLocallyUnique', true)
      } else {
        if ($(this).data('notLocallyUnique')) {
          return $(this).removeData('notLocallyUnique').data('changed', true)
        }
      }
    }
  })

  if (!valid) {
    return options.message
  }
}
