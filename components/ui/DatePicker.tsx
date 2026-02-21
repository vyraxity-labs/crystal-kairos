import { FC } from 'react'
import {
  DatePicker as MuiDatePicker,
  DatePickerProps as MuiDatePickerProps,
} from '@mui/x-date-pickers/DatePicker'
import { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import 'dayjs/locale/en'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import EventNoteIcon from '@mui/icons-material/EventNote'
import KeyboardArrowDownSharpIcon from '@mui/icons-material/KeyboardArrowDownSharp'

export type DatePickerGranularity = 'day' | 'month' | 'year'

export type DatePickerLocale = 'en'

export interface DatePickerProps {
  /**
   * Selected date value (controlled)
   */
  value?: Date | Dayjs | string | null
  /**
   * Callback when date changes
   */
  onChange?: (value: Date | null) => void
  /**
   * Label for the input field
   */
  label?: string
  /**
   * Granularity of date selection
   * - 'day': Full date (year, month, day)
   * - 'month': Year and month only
   * - 'year': Year only
   * @default 'day'
   */
  granularity?: DatePickerGranularity
  /**
   * Date format for display
   * Uses dayjs format tokens
   * @default 'MM/DD/YYYY' for day, 'MMMM YYYY' for month, 'YYYY' for year
   */
  format?: string
  /**
   * Locale/language for the calendar
   * @default 'en'
   */
  locale?: DatePickerLocale
  /**
   * Disable past dates
   */
  disablePast?: boolean
  /**
   * Disable future dates
   */
  disableFuture?: boolean
  /**
   * Minimum selectable date
   */
  minDate?: Date | Dayjs | string
  /**
   * Maximum selectable date
   */
  maxDate?: Date | Dayjs | string
  /**
   * Disable the component
   */
  disabled?: boolean
  /**
   * Show error state
   */
  error?: boolean
  /**
   * Error message
   */
  helperText?: string
  /**
   * Additional CSS classes
   */
  className?: string
  /**
   * Additional props passed to underlying MUI DatePicker
   */
  slotProps?: MuiDatePickerProps['slotProps']
}

const getDefaultFormat = (granularity: DatePickerGranularity): string => {
  switch (granularity) {
    case 'month':
      return 'MMMM YYYY'
    case 'year':
      return 'YYYY'
    case 'day':
    default:
      return 'MM/DD/YYYY'
  }
}

const normalizeValue = (
  value: Date | Dayjs | string | null | undefined,
): Dayjs | null => {
  if (!value) return null
  if (dayjs.isDayjs(value)) return value
  return dayjs(value)
}

const normalizeDate = (value: Dayjs | null): Date | null => {
  if (!value) return null
  return value.toDate()
}

/**
 * DatePicker component with customizable granularity, format, and localization.
 *
 * Supports full date, month+year, or year-only selection with controlled state.
 *
 * @example
 * // Basic date picker
 * <DatePicker
 *   value={date}
 *   onChange={setDate}
 *   label="Select Date"
 * />
 *
 * @example
 * // Month and year only
 * <DatePicker
 *   value={date}
 *   onChange={setDate}
 *   granularity="month"
 *   format="MM/YYYY"
 *   locale="en"
 * />
 *
 * @example
 * // Year only
 * <DatePicker
 *   value={date}
 *   onChange={setDate}
 *   granularity="year"
 *   format="YYYY"
 * />
 */
export const DatePicker: FC<DatePickerProps> = ({
  value,
  onChange,
  label = 'Select Date',
  granularity = 'day',
  format,
  locale = 'en',
  disablePast = false,
  disableFuture = false,
  minDate,
  maxDate,
  disabled = false,
  error = false,
  helperText,
  className,
  slotProps,
}) => {
  const displayFormat = format || getDefaultFormat(granularity)
  const normalizedValue = normalizeValue(value)
  const normalizedMinDate = normalizeValue(minDate)
  const normalizedMaxDate = normalizeValue(maxDate)

  // Convert null to undefined for MUI DatePicker compatibility
  const minDateValue = normalizedMinDate ?? undefined
  const maxDateValue = normalizedMaxDate ?? undefined

  const handleChange = (newValue: Dayjs | null) => {
    onChange?.(normalizeDate(newValue))
  }

  // Determine views based on granularity
  const getViews = (): Array<'year' | 'month' | 'day'> => {
    switch (granularity) {
      case 'year':
        return ['year']
      case 'month':
        return ['year', 'month']
      case 'day':
      default:
        return ['year', 'month', 'day']
    }
  }

  const views = getViews()
  const openTo = views[views.length - 1]

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={locale}>
      <MuiDatePicker
        value={normalizedValue}
        onChange={handleChange}
        disabled={disabled}
        format={displayFormat}
        views={views}
        openTo={openTo}
        disablePast={disablePast}
        disableFuture={disableFuture}
        minDate={minDateValue}
        maxDate={maxDateValue}
        label={label}
        slotProps={{
          ...slotProps,
          textField: {
            error,
            helperText,
            className,
            sx: {
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'grey.300',
                  borderRadius: '8px',
                },
              },
            },
            ...slotProps?.textField,
          },
          popper: {
            sx: {
              '& .MuiPaper-root': {
                borderRadius: '15px',
                boxShadow: '0px 5px 10px #bfbfbf',
              },
            },
          },
          day: {
            sx: {
              '&.Mui-selected': {
                '&.MuiPickersDay-root.Mui-selected': {
                  backgroundColor: 'secondary.main',
                },
              },
            },
          },
        }}
        slots={{
          openPickerIcon: EventNoteIcon,
          switchViewIcon: KeyboardArrowDownSharpIcon,
        }}
      />
    </LocalizationProvider>
  )
}
