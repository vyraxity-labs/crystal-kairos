import { configureStore } from '@reduxjs/toolkit'
import navReducer from '@/store/nav.store'
import registerReducer from '@/store/register.store'

const store = configureStore({
  reducer: {
    nav: navReducer,
    register: registerReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
