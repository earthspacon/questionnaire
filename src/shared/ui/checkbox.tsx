import cn from 'classnames'

type CheckboxInputProps = {
  label: string
  error?: string
  value?: boolean
  onChange: (value: boolean) => void
  labelClassName?: string
}

export const Checkbox = ({ label, onChange, error, value, labelClassName }: CheckboxInputProps) => {
  return (
    <div className="flex flex-col space-y-1 w-max">
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={value}
          onChange={(ev) => onChange(ev.currentTarget.checked)}
          className="w-5 h-5 border-gray-500"
        />
        <span className={cn('text-base', labelClassName)}>{label}</span>
      </label>
      {error && <span className="text-body-short text-red-500">{error}</span>}
    </div>
  )
}
