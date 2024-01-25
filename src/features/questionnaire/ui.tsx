import { useStoreMap, useUnit } from 'effector-react'

import { Checkbox } from '@/shared/ui/checkbox'
import { Input } from '@/shared/ui/input'
import { Select } from '@/shared/ui/select'

import { FormField } from './config'
import * as model from './model'

type CommonFieldProps = { name: string }

export function Form() {
  const formFields = useUnit(model.$staticFormFields)

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    model.submitFormClicked()
  }

  return (
    <div className="flex flex-col gap-10 p-10">
      <h1 className="text-5xl">Анкета</h1>
      <form className="flex flex-col gap-10" onSubmit={onSubmit}>
        {formFields.map(([name, field]) => {
          const Field = fields[field.type]

          return (
            <div key={name} className="flex gap-5">
              <label htmlFor={name} className="w-full max-w-56 text-lg">
                {field.label}
                {field.required && <span className="text-red-500">&#42;</span>}
              </label>
              <Field name={name} />
            </div>
          )
        })}

        <SubmitButton />
      </form>
    </div>
  )
}

function SubmitButton() {
  return (
    <div className="w-full flex  justify-center">
      <button
        type="submit"
        className="bg-amber-500 text-white text-lg font-bold p-2 rounded-md hover:bg-amber-700"
      >
        Отправить
      </button>
    </div>
  )
}

const fields: Record<FormField['type'], React.FC<CommonFieldProps>> = {
  text: InputField,
  number: (props) => <InputField {...props} type="number" />,
  select: SelectField,
  'multiple-checkbox': MultipleCheckBoxField,
  'multiple-input': MultipleTextField,
}

function InputField({ name, type }: CommonFieldProps & { type?: 'number' }) {
  const field = useStoreMap({
    store: model.$formFields,
    keys: [name],
    fn: (fields, [name]) => fields.map.get(name),
  })
  const error = useStoreMap({
    store: model.$formErrors,
    keys: [name],
    fn: (errors, [name]) => errors.map.get(name),
  })

  return (
    <div className="space-y-2">
      <Input
        value={field?.value ?? ''}
        onChange={(evt) => {
          model.fieldChanged({ name, value: evt.currentTarget.value })
        }}
        isInvalid={Boolean(error)}
        placeholder={field?.placeholder}
        type={type}
      />
      <HelperText name={name} />
    </div>
  )
}

function SelectField({ name }: CommonFieldProps) {
  const field = useStoreMap({
    store: model.$formFields,
    keys: [name],
    fn: (fields, [name]) => fields.map.get(name),
  })
  const error = useStoreMap({
    store: model.$formErrors,
    keys: [name],
    fn: (errors, [name]) => errors.map.get(name),
  })

  const selectValue = typeof field?.value === 'string' ? field.value : null

  return (
    <div className="space-y-2">
      <Select
        value={selectValue}
        options={field?.options ?? []}
        onChange={(option) => {
          if (option) {
            model.fieldChanged({ name, value: option.value })
          }
        }}
        placeholder={field?.placeholder}
        isInvalid={Boolean(error)}
        className="min-w-56"
      />
      <HelperText name={name} />
    </div>
  )
}

function MultipleTextField({ name }: CommonFieldProps) {
  const inputsCount = useStoreMap({
    store: model.$formFields,
    keys: [name],
    fn: (fields, [name]) => {
      const field = fields.map.get(name)
      if (!Array.isArray(field?.value)) return 1
      return field.value.length
    },
  })
  const inputs = Array.from({ length: inputsCount })

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-5">
        {inputs.map((_, index) => (
          <MultipleTextFieldItem key={index} name={name} index={index} />
        ))}
      </div>

      <HelperText name={name} />
    </div>
  )
}

function MultipleTextFieldItem({ name, index }: CommonFieldProps & { index: number }) {
  const value = useStoreMap({
    store: model.$formFields,
    keys: [name, index],
    fn: (fields, [name, index]) => {
      const field = fields.map.get(name)
      if (!Array.isArray(field?.value)) return ''
      return field.value[index]
    },
  })
  const placeholder = useStoreMap({
    store: model.$formFields,
    keys: [name],
    fn: ({ map }, [name]) => map.get(name)?.placeholder,
  })
  const hasError = useStoreMap({
    store: model.$formErrors,
    keys: [name, index],
    fn: (errors, [name, index]) => Boolean(errors.map.get(name)) && index === 0,
  })

  return (
    <div className="flex gap-5 items-center">
      <Input
        value={value}
        onChange={(evt) => {
          model.multipleTextInputFieldChanged({ name, value: evt.currentTarget.value, index })
        }}
        isInvalid={hasError}
        placeholder={placeholder}
      />
      {index === 0 ? (
        <button
          type="button"
          onClick={() => model.addInputToMultipleInputField({ name })}
          className="text-lg"
        >
          Добавить ещё
        </button>
      ) : (
        <button
          type="button"
          onClick={() => model.removeInputFromMultipleInputField({ name, index })}
          className="text-red-500 text-lg"
        >
          Удалить
        </button>
      )}
    </div>
  )
}

function MultipleCheckBoxField({ name }: CommonFieldProps) {
  const options = useStoreMap({
    store: model.$formFields,
    keys: [name],
    fn: (fields, [name]) => fields.map.get(name)?.options,
  })

  if (!options) return null

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col flex-wrap max-h-60 gap-5 gap-x-20">
        {options.map(({ label, value }) => (
          <MultipleCheckboxFieldItem key={value} name={name} value={value} label={label} />
        ))}

        <Checkbox
          label="Выделить все"
          onChange={(checked) => model.toggleAllMultipleCheckbox({ name, checked })}
          labelClassName="font-bold"
        />
      </div>
      <HelperText name={name} />
      <ErrorText name={name} />
    </div>
  )
}

function MultipleCheckboxFieldItem({
  name,
  value,
  label,
}: CommonFieldProps & { value: string; label: string }) {
  const isChecked = useStoreMap({
    store: model.$formFields,
    keys: [name, value],
    fn: (fields, [name, optionValue]) => {
      const field = fields.map.get(name)
      if (!Array.isArray(field?.value)) return false
      return field.value.includes(optionValue)
    },
  })

  return (
    <Checkbox
      label={label}
      value={isChecked}
      onChange={(checked) => {
        model.multipleCheckboxFieldChanged({ name, checked, value })
      }}
    />
  )
}

function ErrorText({ name }: CommonFieldProps) {
  const error = useStoreMap({
    store: model.$formErrors,
    keys: [name],
    fn: (errors, [name]) => errors.map.get(name),
    defaultValue: null,
  })

  return error ? <span className="text-body-short text-red-500">{error}</span> : null
}

function HelperText({ name }: CommonFieldProps) {
  const helperText = useStoreMap({
    store: model.$formFields,
    keys: [name],
    fn: ({ map }, [name]) => map.get(name)?.helperText,
    defaultValue: null,
  })

  return helperText ? <p className="text-gray-500 text-sm">{helperText}</p> : null
}
