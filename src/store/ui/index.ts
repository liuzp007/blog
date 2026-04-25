import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UIState {
  sidebarCollapsed: boolean
}

const initialState: UIState = {
  sidebarCollapsed: false
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload
    },
    toggleSidebar: state => {
      state.sidebarCollapsed = !state.sidebarCollapsed
    }
  }
})

export const uiReducer = uiSlice.reducer
export const { setSidebarCollapsed, toggleSidebar } = uiSlice.actions

export default uiReducer
