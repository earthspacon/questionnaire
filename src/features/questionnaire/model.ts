import { createEffect, createEvent, createStore, sample } from 'effector'

import { FormField, formFieldsMock } from './config'

const fieldsEntries: [string, FormField][] = formFieldsMock.map((field) => [field.name, field])

// I put this to the store, since in real app data can come from the server
export const $staticFormFields = createStore(fieldsEntries)
export const $formFields = createStore({ map: new Map(fieldsEntries) })
export const $formErrors = createStore({ map: new Map<string, string>() })

const changeFormField = createEvent<{ name: string; field: FormField } | null>()
export const fieldChanged = createEvent<Pick<FormField, 'name' | 'value'>>()
export const multipleTextInputFieldChanged = createEvent<{
  name: string
  index: number
  value: string
}>()
export const multipleCheckboxFieldChanged = createEvent<{
  name: string
  checked: boolean
  value: string
}>()
export const toggleAllMultipleCheckbox = createEvent<{ name: string; checked: boolean }>()
export const addInputToMultipleInputField = createEvent<{ name: string }>()
export const removeInputFromMultipleInputField = createEvent<{ name: string; index: number }>()
export const submitFormClicked = createEvent()

const validateFieldsFx = createEffect<
  Map<string, FormField>,
  { fieldsMap: Map<string, FormField>; errorsMap: Map<string, string> },
  Map<string, string>
>((fieldsMap) => {
  const errorsMap = new Map<string, string>()

  fieldsMap.forEach((field, name) => {
    if (field.required && !field.value) {
      errorsMap.set(name, 'Поле обязательно для заполнения')
    } else {
      errorsMap.set(name, '')
    }
  })

  if (Array.from(errorsMap.values()).every((error) => !error)) {
    return { fieldsMap, errorsMap }
  }

  throw errorsMap
})

sample({
  clock: changeFormField,
  source: $formFields,
  fn: (fields, payload) => {
    if (payload) {
      fields.map.set(payload.name, payload.field)
      return { map: fields.map }
    }
    return fields
  },
  target: $formFields,
})

sample({
  clock: fieldChanged,
  source: $formFields,
  fn: (fields, { name, value }) => {
    const field = fields.map.get(name)
    if (!field) return null
    return { name, field: { ...field, value } }
  },
  target: changeFormField,
})

sample({
  clock: multipleTextInputFieldChanged,
  source: $formFields,
  fn: (fields, payload) => {
    const field = fields.map.get(payload.name)
    if (!field) return null

    const allValues = Array.isArray(field.value) ? [...field.value] : []
    allValues[payload.index] = payload.value

    return {
      name: payload.name,
      field: { ...field, value: allValues },
    }
  },
  target: changeFormField,
})

sample({
  clock: multipleCheckboxFieldChanged,
  source: $formFields,
  fn: (fields, payload) => {
    const field = fields.map.get(payload.name)
    if (!field) return null

    const allValues = Array.isArray(field.value) ? [...field.value] : []
    if (payload.checked) {
      allValues.push(payload.value)
    } else {
      const index = allValues.indexOf(payload.value)
      if (index !== -1) {
        allValues.splice(index, 1)
      }
    }

    return {
      name: payload.name,
      field: { ...field, value: allValues },
    }
  },
  target: changeFormField,
})

sample({
  clock: toggleAllMultipleCheckbox,
  source: $formFields,
  fn: (fields, payload) => {
    const field = fields.map.get(payload.name)
    if (!field || !field.options) return null

    const allValues = payload.checked ? field.options.map((option) => option.value) : []

    return {
      name: payload.name,
      field: { ...field, value: allValues },
    }
  },
  target: changeFormField,
})

sample({
  clock: addInputToMultipleInputField,
  source: $formFields,
  fn: (fields, payload) => {
    const field = fields.map.get(payload.name)
    if (!field) return null

    const allValues = Array.isArray(field.value) ? [...field.value] : []
    allValues.push('')

    return {
      name: payload.name,
      field: { ...field, value: allValues },
    }
  },
  target: changeFormField,
})

sample({
  clock: removeInputFromMultipleInputField,
  source: $formFields,
  fn: (fields, payload) => {
    const field = fields.map.get(payload.name)
    if (!field) return null

    const allValues = Array.isArray(field.value) ? [...field.value] : []
    allValues.splice(payload.index, 1)

    return {
      name: payload.name,
      field: { ...field, value: allValues },
    }
  },
  target: changeFormField,
})

sample({
  clock: submitFormClicked,
  source: $formFields,
  fn: ({ map }) => map,
  target: validateFieldsFx,
})

sample({
  clock: validateFieldsFx.failData,
  fn: (errorsMap) => ({ map: errorsMap }),
  target: $formErrors,
})

sample({
  clock: validateFieldsFx.doneData,
  fn: ({ errorsMap }) => ({ map: errorsMap }),
  target: $formErrors,
})

sample({
  clock: validateFieldsFx.doneData,
  fn: (fieldsMap) => {
    console.log('Form validated', fieldsMap)
  },
})
