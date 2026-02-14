import type { RegistrationFormData } from '@/types/registration.interface'
import { initialRegistrationForm } from '@/types/registration.interface'
import { createSlice } from '@reduxjs/toolkit'

const MAX_STEP_INDEX = 4

interface RegistrationState {
  currentStep: number
  formData: RegistrationFormData
}

const initialState: RegistrationState = {
  currentStep: 0,
  formData: initialRegistrationForm,
}

const registrationSlice = createSlice({
  name: 'registration',
  initialState,
  reducers: {
    setStep: (state, { payload }: { payload: number }) => {
      state.currentStep = payload
    },
    nextStep: (state) => {
      if (state.currentStep < MAX_STEP_INDEX) state.currentStep += 1
    },
    prevStep: (state) => {
      if (state.currentStep > 0) state.currentStep -= 1
    },
    updateForm: (
      state,
      { payload }: { payload: Partial<RegistrationFormData> },
    ) => {
      state.formData = { ...state.formData, ...payload }
    },
    resetForm: (state) => {
      state.currentStep = 0
      state.formData = initialRegistrationForm
    },
  },
})

export const { setStep, nextStep, prevStep, updateForm, resetForm } =
  registrationSlice.actions

export default registrationSlice.reducer
