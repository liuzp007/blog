import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import mainReducer from './main'
import uiReducer from './ui'
import userPreferencesReducer, { PERSISTED_USER_PREFERENCE_KEYS } from './userPreferences'

const userPreferencesPersistConfig = {
  key: 'blog-user-preferences',
  storage,
  whitelist: PERSISTED_USER_PREFERENCE_KEYS
}

// Root reducer
const rootReducer = combineReducers({
  main: mainReducer,
  ui: uiReducer,
  userPreferences: persistReducer(userPreferencesPersistConfig, userPreferencesReducer)
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
export const persistor = persistStore(store)

// Typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: AppSelector = useSelector

// 导出
export default store
