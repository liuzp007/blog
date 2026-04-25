import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { MenuItem } from '../../data'

interface MainState {
  menu: MenuItem[]
  selectedKeys: string[]
  openKeys: string[]
}

const initialState: MainState = {
  menu: [],
  selectedKeys: [],
  openKeys: []
}

const mainSlice = createSlice({
  name: 'main',
  initialState,
  reducers: {
    setMenu: (state, action: PayloadAction<MenuItem[]>) => {
      state.menu = action.payload
    },
    setSelectedKeys: (state, action: PayloadAction<string[]>) => {
      state.selectedKeys = action.payload
    },
    setOpenKeys: (state, action: PayloadAction<string[]>) => {
      state.openKeys = action.payload
    }
  }
})

export const mainReducer = mainSlice.reducer
export const { setMenu, setSelectedKeys, setOpenKeys } = mainSlice.actions

export default mainReducer
