import {
  Autocomplete,
  AutocompleteProps,
  CircularProgress,
  TextField,
  UseAutocompleteProps,
} from '@mui/material'

export interface FormSelectProps<
  T,
  Multiple extends boolean = false,
  DisableClearable extends boolean = false,
  FreeSolo extends boolean = false,
> {
  options: T[]
  /**
   * Component's ID
   */
  id?: string
  /**
   * Label for the select field
   */
  label?: string
  /**
   * Placeholder text
   */
  placeholder?: string
  /**
   * Error state
   */
  error?: boolean
  /**
   * Error message
   */
  errorMessage?: string
  /**
   * Loading state
   */
  loading?: boolean
  /**
   * Selected value
   */
  value?: UseAutocompleteProps<T, Multiple, DisableClearable, FreeSolo>['value']
  /**
   * Change handler
   */
  onChange?: UseAutocompleteProps<
    T,
    Multiple,
    DisableClearable,
    FreeSolo
  >['onChange']
  /**
   * Custom option renderer
   */
  renderOption?: AutocompleteProps<
    T,
    Multiple,
    DisableClearable,
    FreeSolo
  >['renderOption']
  /**
   * Function to get option label
   */
  getOptionLabel?: AutocompleteProps<
    T,
    Multiple,
    DisableClearable,
    FreeSolo
  >['getOptionLabel']
  /**
   * Additional CSS classes
   */
  className?: string
  /**
   * Additional props for Autocomplete component
   */
  props?: Omit<
    AutocompleteProps<T, Multiple, DisableClearable, FreeSolo>,
    'options' | 'value' | 'onChange' | 'renderInput'
  >
}

const FormSelect = <
  T,
  Multiple extends boolean = false,
  DisableClearable extends boolean = false,
  FreeSolo extends boolean = false,
>({
  options,
  id,
  label,
  placeholder,
  error,
  errorMessage,
  loading,
  value,
  onChange,
  renderOption,
  getOptionLabel,
  className,
  props,
}: FormSelectProps<T, Multiple, DisableClearable, FreeSolo>) => {
  return (
    <Autocomplete
      id={id}
      className={className}
      options={options}
      value={value}
      onChange={onChange}
      renderOption={renderOption}
      getOptionLabel={getOptionLabel}
      popupIcon={
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width={24}
          height={24}
          viewBox='0 0 24 24'
        >
          <path
            fill='none'
            stroke='currentColor'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='m6 9l6 6l6-6'
          ></path>
        </svg>
      }
      {...props}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder || label}
          error={error}
          helperText={errorMessage}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color='inherit' size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              '& fieldset': {
                borderColor: error ? undefined : 'grey.300',
              },
              '&:hover fieldset': {
                borderColor: error ? undefined : 'grey.400',
              },
              '&.Mui-focused fieldset': {
                borderColor: error ? undefined : 'primary.main',
                borderWidth: '1.5px',
              },
            },
          }}
        />
      )}
      ListboxProps={{
        sx: {
          '& .MuiAutocomplete-option': {
            margin: '4px 4px',
            borderRadius: '6px',
            padding: '8px 10px',
            minHeight: 'unset',
            lineHeight: '20px',
          },
          scrollbarWidth: 'thin', // Firefox
          '&::-webkit-scrollbar': {
            width: 6, // Chrome / Edge / Safari
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#bbb',
            borderRadius: 8,
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'transparent',
          },
        },
      }}
      slotProps={{
        popper: {
          sx: {
            '& .MuiPaper-root': {
              borderRadius: '10px',
              ul: {
                padding: '0',
              },
            },
          },
        },
        paper: {
          elevation: 10,
        },
      }}
    />
  )
}

export default FormSelect
