import cn from 'classnames'
import { forwardRef } from 'react'

type NativeInputProps = React.InputHTMLAttributes<HTMLInputElement>

type InputProps = NativeInputProps & {
  className?: string
  isDisabled?: boolean
  isInvalid?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function InputComponent(
  { className = '', type = 'text', isDisabled = false, isInvalid, ...rest },
  ref
) {
  return (
    <input
      ref={ref}
      className={cn(
        'h-12 p-4 pl-3',
        'rounded',
        'border-2',
        { 'border-red-500': isInvalid },
        'focus:outline-none focus-visible:ring',
        className
      )}
      disabled={isDisabled}
      type={type}
      {...rest}
    />
  )
})
