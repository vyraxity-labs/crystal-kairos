'use client'

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import banksList from '@/data/bank-list.json'
import { RegistrationFormValues } from '@/types/register.interface'
import { Control, Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

const BankingDetails = ({
  control,
}: {
  control: Control<RegistrationFormValues>
}) => {
  const { t } = useTranslation('auth')

  return (
    <FieldGroup>
      <FieldGroup className='flex flex-col gap-1 md:flex-row'>
        <Controller
          name='bankName'
          control={control}
          render={({ field, fieldState }) => {
            return (
              <Field>
                <FieldLabel>
                  {t('register.form.banking_details.bank_name')}
                </FieldLabel>
                <Combobox
                  items={banksList}
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <ComboboxInput
                    placeholder={t('register.form.banking_details.bank_name')}
                  />
                  <ComboboxContent>
                    <ComboboxEmpty>
                      {t('register.form.banking_details.no_account_found')}
                    </ComboboxEmpty>
                    <ComboboxList>
                      {(item) => (
                        <ComboboxItem key={item.id} value={item.name}>
                          {item.name}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )
          }}
        />

        <Controller
          name='accountNumber'
          control={control}
          render={({ field, fieldState }) => {
            return (
              <Field>
                <FieldLabel>
                  {t('register.form.banking_details.account_number')}
                </FieldLabel>
                <Input
                  {...field}
                  className='rounded-sm'
                  placeholder={t(
                    'register.form.banking_details.account_number',
                  )}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )
          }}
        />
      </FieldGroup>

      <FieldGroup className='flex flex-col gap-1 md:flex-row'>
        <Controller
          name='accountName'
          control={control}
          render={({ field, fieldState }) => {
            return (
              <Field>
                <FieldLabel>
                  {t('register.form.banking_details.account_name')}
                </FieldLabel>
                <Input
                  {...field}
                  className='rounded-sm'
                  placeholder={t('register.form.banking_details.account_name')}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )
          }}
        />
      </FieldGroup>
    </FieldGroup>
  )
}

export default BankingDetails
