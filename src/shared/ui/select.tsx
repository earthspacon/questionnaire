import { Listbox, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import cn from 'classnames'
import { Fragment, useMemo } from 'react'

type Option = { value: string; label: string }

export type SelectProps = {
  options: Option[]
  value: string | null
  onChange?: (option: Option | null) => void
  className?: string
  isInvalid?: boolean
  isDisabled?: boolean
}

export const Select = (props: SelectProps) => {
  const { className, options, value, isInvalid, isDisabled, onChange } = props
  const optionsRecord = useMemo(() => {
    return options?.reduce((acc, item) => {
      acc[item.value] = item
      return acc
    }, {} as Record<string, Option>)
  }, [options])
  const selected = value ? optionsRecord[value] : null

  return (
    <Listbox value={selected} onChange={onChange} disabled={isDisabled}>
      {({ open }) => (
        <div className="relative mt-1">
          <Listbox.Button
            className={cn(
              'relative w-full h-12 border-2 cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm',
              { 'border-red-500': isInvalid },
              className
            )}
          >
            <span className="block truncate">{selected?.label}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronDownIcon
                className={cn('h-5 w-5 text-gray-400', { 'rotate-180': open })}
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
              {options.map((option) => (
                <Listbox.Option
                  key={option.value}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                    }`
                  }
                  value={option}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}
                      >
                        {option.label}
                      </span>
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      )}
    </Listbox>
  )
}
