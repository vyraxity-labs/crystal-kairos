'use client'

import { useState } from 'react'
import {
  TextField,
  TextFieldProps,
  InputAdornment,
  MenuItem,
  IconButton,
  type SelectChangeEvent,
} from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form'

export type FormInputOption = {
  value: string
  label: string
}

/** Props when used with react-hook-form (Controller) */
type FormInputWithControlProps<T extends FieldValues> = {
  control: Control<T>
  name: FieldPath<T>
  /** Validation rules - use with zodResolver for schema validation */
  rules?: Parameters<typeof Controller<T>>[0]['rules']
  /** Options for select inputs */
  options?: FormInputOption[]
  /** Omit when using Controller - value comes from form state */
  value?: never
  onChange?: never
}

/** Props when used standalone (controlled) */
type FormInputStandaloneProps = {
  control?: never
  name?: never
  rules?: never
  options?: FormInputOption[]
  value?: string
  onChange?: (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent,
  ) => void
}

type BaseFormInputProps = Omit<
  TextFieldProps,
  'value' | 'onChange' | 'name' | 'error' | 'helperText'
> & {
  /** Error message - from formState.errors when using RHF, or pass directly when standalone */
  error?: string
  /** Helper text shown below input */
  helperText?: string
  /** Start adornment (e.g. icon) */
  startAdornment?: React.ReactNode
  /** End adornment (e.g. icon) */
  endAdornment?: React.ReactNode
  /** Placeholder option for select (e.g. "Choose...") */
  selectPlaceholder?: string
}

export type FormInputProps<T extends FieldValues = FieldValues> =
  BaseFormInputProps & (FormInputWithControlProps<T> | FormInputStandaloneProps)

type InputChangeEvent =
  | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  | SelectChangeEvent

function FormInputInner<T extends FieldValues>(
  props: FormInputProps<T> & {
    value?: string
    onChange?: (e: InputChangeEvent) => void
    onBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>
    error?: string
    helperText?: string
    inputRef?: React.Ref<HTMLInputElement | HTMLTextAreaElement>
  },
) {
  const {
    label,
    placeholder,
    type = 'text',
    disabled,
    required,
    fullWidth = true,
    multiline,
    rows,
    select,
    options = [],
    selectPlaceholder,
    startAdornment,
    endAdornment,
    error,
    helperText,
    value,
    onChange,
    onBlur,
    inputRef,
    className,
    ...rest
  } = props

  const isPasswordType = type === 'password'
  const [showPassword, setShowPassword] = useState(false)
  const inputType = isPasswordType && showPassword ? 'text' : type

  const inputProps: TextFieldProps['InputProps'] = {}
  if (startAdornment) {
    inputProps.startAdornment = (
      <InputAdornment position='start'>{startAdornment}</InputAdornment>
    )
  }
  if (endAdornment || isPasswordType) {
    inputProps.endAdornment = (
      <InputAdornment position='end'>
        {endAdornment}
        {isPasswordType && (
          <IconButton
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            onClick={() => setShowPassword((prev) => !prev)}
            onMouseDown={(e) => e.preventDefault()}
            edge='end'
            size='small'
            disabled={disabled}
          >
            {showPassword ? (
              <VisibilityOffIcon fontSize='small' />
            ) : (
              <VisibilityIcon fontSize='small' />
            )}
          </IconButton>
        )}
      </InputAdornment>
    )
  }

  return (
    <TextField
      label={label}
      placeholder={placeholder}
      type={inputType}
      disabled={disabled}
      required={required}
      fullWidth={fullWidth}
      multiline={multiline}
      rows={rows}
      select={select}
      value={value ?? ''}
      onChange={onChange as any}
      onBlur={onBlur}
      inputRef={inputRef}
      error={!!error}
      helperText={error ?? helperText}
      InputProps={Object.keys(inputProps).length > 0 ? inputProps : undefined}
      className={className}
      {...rest}
    >
      {select && (
        <>
          {selectPlaceholder && (
            <MenuItem value=''>
              <em>{selectPlaceholder}</em>
            </MenuItem>
          )}
          {options.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </>
      )}
    </TextField>
  )
}

function FormInput<T extends FieldValues>(props: FormInputProps<T>) {
  if (props.control && props.name) {
    return (
      <Controller
        control={props.control}
        name={props.name}
        rules={props.rules}
        render={({ field, fieldState }) => {
          const { control: _c, name: _n, rules, ...rest } = props
          return (
            <FormInputInner
              {...rest}
              value={field.value ?? ''}
              onChange={(e) => field.onChange(e)}
              onBlur={() => field.onBlur()}
              inputRef={field.ref}
              error={fieldState.error?.message}
              helperText={props.helperText}
            />
          )
        }}
      />
    )
  }

  return <FormInputInner {...props} />
}

export default FormInput
