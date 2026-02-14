import { configureStore } from '@reduxjs/toolkit'
import navReducer from '@/store/nav.store'
import registrationReducer from '@/store/registration.store'

const store = configureStore({
  reducer: {
    nav: navReducer,
    registration: registrationReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
