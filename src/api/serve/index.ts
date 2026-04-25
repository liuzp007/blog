import { Menu } from '../../data'
import errorLogger from '@/utils/errorLogger'

export const getMenu = async () => {
  try {
    return Promise.resolve(Menu)
  } catch (error) {
    errorLogger.log(error instanceof Error ? error : new Error(String(error)), {
      component: 'getMenu'
    })

    throw error
  }
}
