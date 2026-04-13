import {
  InitialState,
  Step1State,
  Step2State,
  Step3State,
  Step4State,
  Step5State,
} from '@/types/register.interface'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState: InitialState = {
  currentStep: 1,
  step1: {
    data: {
      name: '',
      email: '',
      phoneNumber: '',
      dateOfBirth: new Date().toISOString(),
      gender: 'male',
      address: '',
      occupation: '',
    },
    hasErrors: true,
  },
  step2: {
    data: {
      bankName: '',
      accountNumber: '',
      accountName: '',
    },
    hasErrors: true,
  },
  step3: {
    data: {
      name: '',
      phoneNumber: '',
      relationship: '',
      occupation: '',
      address: '',
      bankName: '',
      accountNumber: '',
      accountName: '',
    },
    hasErrors: true,
  },
  step4: {
    data: {
      interests: [],
      referralName: '',
      referralPhoneNumber: '',
      assumptions: [],
    },
    hasErrors: true,
  },
  step5: {
    data: {
      termsAndConditions: false,
    },
    hasErrors: true,
  },
  stepsState: {
    1: { hasErrors: true },
    2: { hasErrors: true },
    3: { hasErrors: true },
    4: { hasErrors: true },
    5: { hasErrors: true },
  },
}

const registerSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload
    },
    setStepsState: (
      state,
      action: PayloadAction<Record<number, { hasErrors: boolean }>>,
    ) => {
      state.stepsState = action.payload
    },
    setStep1: (state, action: PayloadAction<Step1State>) => {
      state.step1 = action.payload
    },
    setStep2: (state, action: PayloadAction<Step2State>) => {
      state.step2 = action.payload
    },
    setStep3: (state, action: PayloadAction<Step3State>) => {
      state.step3 = action.payload
    },
    setStep4: (state, action: PayloadAction<Step4State>) => {
      state.step4 = action.payload
    },
    setStep5: (state, action: PayloadAction<Step5State>) => {
      state.step5 = action.payload
    },
  },
})

export const {
  setCurrentStep,
  setStep1,
  setStep2,
  setStep3,
  setStep4,
  setStep5,
  setStepsState,
} = registerSlice.actions

export default registerSlice.reducer
