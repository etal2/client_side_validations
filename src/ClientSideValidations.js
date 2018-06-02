import $ from 'jquery'

const ClientSideValidations = {
  callbacks: {
    element: {
      after: (element, eventData) => {},
      before: (element, eventData) => {},
      fail: (element, message, addError, eventData) => addError(),
      pass: (element, removeError, eventData) => removeError()
    },
    form: {
      after: (form, eventData) => {},
      before: (form, eventData) => {},
      fail: (form, eventData) => {},
      pass: (form, eventData) => {}
    }
  },
  enablers: {
    form: (form) => {
      let $form, binding, ref

      $form = $(form)

      form.ClientSideValidations = {
        settings: $form.data('clientSideValidations'),
        addError: (element, message) => ClientSideValidations
          .formBuilders[form.ClientSideValidations.settings.html_settings.type]
          .add(element, form.ClientSideValidations.settings.html_settings, message),
        removeError: (element) => ClientSideValidations
          .formBuilders[form.ClientSideValidations.settings.html_settings.type]
          .remove(element, form.ClientSideValidations.settings.html_settings)
      }

      ref = {
        'submit.ClientSideValidations': (eventData) => {
          if (!$form.isValid(form.ClientSideValidations.settings.validators)) {
            eventData.preventDefault()
            eventData.stopImmediatePropagation()
          }
        },
        'ajax:beforeSend.ClientSideValidations': function (eventData) {
          if (eventData.target === this) {
            $form.isValid(form.ClientSideValidations.settings.validators)
          }
        },
        'form:validate:after.ClientSideValidations': (eventData) => {
          ClientSideValidations.callbacks.form.after($form, eventData)
        },
        'form:validate:before.ClientSideValidations': (eventData) => {
          ClientSideValidations.callbacks.form.before($form, eventData)
        },
        'form:validate:fail.ClientSideValidations': (eventData) => {
          ClientSideValidations.callbacks.form.fail($form, eventData)
        },
        'form:validate:pass.ClientSideValidations': (eventData) => {
          ClientSideValidations.callbacks.form.pass($form, eventData)
        }
      }

      for (const event in ref) {
        binding = ref[event]
        $form.on(event, binding)
      }

      return $form.find(ClientSideValidations.selectors.inputs).each(function () {
        return ClientSideValidations.enablers.input(this)
      })
    },
    input: function (input) {
      let $form, $input, binding, form, ref
      $input = $(input)
      form = input.form
      $form = $(form)

      ref = {
        'focusout.ClientSideValidations': function () {
          $(this).isValid(form.ClientSideValidations.settings.validators)
        },
        'change.ClientSideValidations': function () {
          $(this).data('changed', true)
        },
        'element:validate:after.ClientSideValidations': function (eventData) {
          ClientSideValidations.callbacks.element.after($(this), eventData)
        },
        'element:validate:before.ClientSideValidations': function (eventData) {
          ClientSideValidations.callbacks.element.before($(this), eventData)
        },
        'element:validate:fail.ClientSideValidations': function (eventData, message) {
          let $element = $(this)

          ClientSideValidations.callbacks.element.fail($element, message, function () {
            return form.ClientSideValidations.addError($element, message)
          }, eventData)
        },
        'element:validate:pass.ClientSideValidations': function (eventData) {
          let $element = $(this)

          ClientSideValidations.callbacks.element.pass($element, function () {
            return form.ClientSideValidations.removeError($element)
          }, eventData)
        }
      }

      for (const event in ref) {
        binding = ref[event]
        $input.filter(':not(:radio):not([id$=_confirmation])').each(function () {
          return $(this).attr('data-validate', true)
        }).on(event, binding)
      }

      $input.filter(':checkbox').on('change.ClientSideValidations', function () {
        $(this).isValid(form.ClientSideValidations.settings.validators)
      })

      return $input.filter('[id$=_confirmation]').each(function () {
        let confirmationElement, element, ref1, results
        confirmationElement = $(this)
        element = $form.find('#' + (this.id.match(/(.+)_confirmation/)[1]) + ':input')

        if (element[0]) {
          ref1 = {
            'focusout.ClientSideValidations': () => {
              element.data('changed', true).isValid(form.ClientSideValidations.settings.validators)
            },
            'keyup.ClientSideValidations': () => {
              element.data('changed', true).isValid(form.ClientSideValidations.settings.validators)
            }
          }

          results = []

          for (const event in ref1) {
            binding = ref1[event]
            results.push($('#' + (confirmationElement.attr('id'))).on(event, binding))
          }

          return results
        }
      })
    }
  },
  formBuilders: {
    'ActionView::Helpers::FormBuilder': {
      add: (element, settings, message) => {
        let form, inputErrorField, label, labelErrorField

        form = $(element[0].form)

        if (element.data('valid') !== false && (form.find("label.message[for='" + (element.attr('id')) + "']")[0] == null)) {
          inputErrorField = $(settings.input_tag)
          labelErrorField = $(settings.label_tag)
          label = form.find("label[for='" + (element.attr('id')) + "']:not(.message)")
          if (element.attr('autofocus')) {
            element.attr('autofocus', false)
          }
          element.before(inputErrorField)
          inputErrorField.find('span#input_tag').replaceWith(element)
          inputErrorField.find('label.message').attr('for', element.attr('id'))
          labelErrorField.find('label.message').attr('for', element.attr('id'))
          labelErrorField.insertAfter(label)
          labelErrorField.find('label#label_tag').replaceWith(label)
        }
        return form.find("label.message[for='" + (element.attr('id')) + "']").text(message)
      },
      remove: (element, settings) => {
        let errorFieldClass, form, inputErrorField, label, labelErrorField

        form = $(element[0].form)
        errorFieldClass = $(settings.input_tag).attr('class')
        inputErrorField = element.closest('.' + (errorFieldClass.replace(/ /g, '.')))
        label = form.find("label[for='" + (element.attr('id')) + "']:not(.message)")
        labelErrorField = label.closest('.' + errorFieldClass)

        if (inputErrorField[0]) {
          inputErrorField.find('#' + (element.attr('id'))).detach()
          inputErrorField.replaceWith(element)
          label.detach()
          return labelErrorField.replaceWith(label)
        }
      }
    }
  },
  patterns: {
    numericality: {
      'default': new RegExp('^[-+]?[0-9]*\\.?[0-9]+([eE][-+]?[0-9]+)?$'),
      only_integer: new RegExp('^[+-]?\\d+$')
    }
  },
  selectors: {
    inputs: ':input:not(button):not([type="submit"])[name]:visible:enabled',
    validate_inputs: ':input:enabled:visible[data-validate]',
    forms: 'form[data-client-side-validations]'
  },
  validators: {
    all: () => $.extend({}),
    local: {},
    remote: {}
  },
  disable: (target) => {
    let $target = $(target)

    $target.off('.ClientSideValidations')

    if ($target.is('form')) {
      return ClientSideValidations.disable($target.find(':input'))
    } else {
      $target.removeData('valid')
      $target.removeData('changed')
      return $target.filter(':input').each(function () {
        return $(this).removeAttr('data-validate')
      })
    }
  },
  reset: (form) => {
    let $form = $(form)

    ClientSideValidations.disable(form)

    for (const key in form.ClientSideValidations.settings.validators) {
      form.ClientSideValidations.removeError($form.find("[name='" + key + "']"))
    }

    return ClientSideValidations.enablers.form(form)
  }
}

export default ClientSideValidations