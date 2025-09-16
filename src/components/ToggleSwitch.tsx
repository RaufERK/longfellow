'use client'

interface ToggleSwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  label?: string
}

export default function ToggleSwitch({
  checked,
  onChange,
  disabled = false,
  size = 'md',
  label,
}: ToggleSwitchProps) {
  const sizeClasses = {
    sm: 'w-8 h-4',
    md: 'w-12 h-6',
    lg: 'w-16 h-8',
  }

  const thumbSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
  }

  const translateClasses = {
    sm: checked ? 'translate-x-4' : 'translate-x-0',
    md: checked ? 'translate-x-6' : 'translate-x-0',
    lg: checked ? 'translate-x-8' : 'translate-x-0',
  }

  return (
    <div className='flex items-center gap-2'>
      <button
        type='button'
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        className={`
          ${sizeClasses[size]}
          relative inline-flex items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
          ${
            checked
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-gray-300 hover:bg-gray-400'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <span
          className={`
            ${thumbSizeClasses[size]}
            ${translateClasses[size]}
            inline-block transform rounded-full bg-white transition-transform duration-200 ease-in-out
            ${checked ? 'shadow-lg' : 'shadow-md'}
          `}
        />
      </button>
      {label && (
        <span
          className={`font-medium ${
            checked ? 'text-green-800' : 'text-gray-600'
          }`}
          style={{ fontSize: '18px' }}
        >
          {label}
        </span>
      )}
    </div>
  )
}
