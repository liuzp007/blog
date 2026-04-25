import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux'

// Import slices
import mainReducer from './main'
import uiReducer from './ui'
import userPreferencesReducer from './userPreferences'

// Root reducer
const rootReducer = combineReducers({
  main: mainReducer,
  ui: uiReducer,
  userPreferences: userPreferencesReducer
})

// Store 配置
export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
})

// Types
export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppSelector = TypedUseSelectorHook<RootState>

// Typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: AppSelector = useSelector

// 导出
export default store
