export enum FolderEnum {
  US = 'us'
}

export interface UploadFileResult {
  fpName: string
  mediaType: string
  isMock?: boolean
}

import errorLogger from '@/utils/errorLogger'
import { checkBoundaryConditions, isSafeValue } from '@/utils/inputValidation'

export const uploadFile = async (data: FormData): Promise<UploadFileResult> => {
  try {
    if (!data) {
      throw new Error('FormData is required')
    }

    const file = data.get('file')

    if (!file) {
      throw new Error('No file provided')
    }

    if (!isSafeValue(file)) {
      throw new Error('Invalid file data')
    }

    if (typeof File !== 'undefined' && file instanceof File) {
      const mediaType = checkBoundaryConditions(file.type.split('/')[1], 'jpg', {
        allowNull: false
      }) as string

      const url = URL.createObjectURL(file)

      return {
        fpName: url,
        mediaType,
        isMock: true
      }
    }

    return {
      fpName: 'mock_url',
      mediaType: 'jpg',
      isMock: true
    }
  } catch (error) {
    errorLogger.log(error instanceof Error ? error : new Error(String(error)), {
      component: 'uploadFile'
    })

    throw error
  }
}
