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
        type={type}
      />
      {field?.helperText && <p className="text-gray-500 text-sm">{field.helperText}</p>}
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
        isInvalid={Boolean(error)}
        className="min-w-56"
      />
      {field?.helperText && <p className="text-gray-500 text-sm">{field.helperText}</p>}
    </div>
  )
}

function MultipleTextField({ name }: CommonFieldProps) {
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

  const allValues = Array.isArray(field?.value) ? field.value : ['']

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-5">
        {allValues.map((value, index) => (
          <div key={index} className="flex gap-5 items-center">
            <Input
              value={value}
              onChange={(evt) => {
                model.multipleTextInputFieldChanged({
                  name,
                  value: evt.currentTarget.value,
                  index,
                })
              }}
              isInvalid={Boolean(error)}
              placeholder={field?.placeholder}
            />
            {index === 0 ? (
              <button
                type="button"
                onClick={() => {
                  model.addInputToMultipleInputField({ name })
                }}
                className="text-lg"
              >
                Добавить ещё
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  model.removeInputFromMultipleInputField({ name, index })
                }}
                className="text-red-500 text-lg"
              >
                Удалить
              </button>
            )}
          </div>
        ))}
      </div>

      {field?.helperText && <p className="text-gray-500 text-sm">{field.helperText}</p>}
    </div>
  )
}

function MultipleCheckBoxField({ name }: CommonFieldProps) {
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

  const options = field?.options ?? []
  const allValues = Array.isArray(field?.value) ? field.value : []

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col flex-wrap max-h-60 gap-5 gap-x-20">
        {options.map(({ label, value }) => {
          const isChecked = allValues.includes(value)

          return (
            <Checkbox
              key={value}
              label={label}
              value={isChecked}
              onChange={(checked) => {
                model.multipleCheckboxFieldChanged({ name, checked, value })
              }}
            />
          )
        })}

        <Checkbox
          label="Выделить все"
          onChange={(checked) => model.toggleAllMultipleCheckbox({ name, checked })}
          labelClassName="font-bold"
        />
      </div>

      {field?.helperText && <p className="text-gray-500 text-sm">{field.helperText}</p>}

      {error && <span className="text-body-short text-red-500">{error}</span>}
    </div>
  )
}
