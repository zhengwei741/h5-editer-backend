import userErrorMessage from './user'
import workErrorMessage from './work'
import utilsErrorMessage from './utils'

export type GlobalErrorTypes = (
  keyof (
    typeof userErrorMessage &
    typeof workErrorMessage &
    typeof utilsErrorMessage
  )
)

export const globalErrorMessages = {
  ...userErrorMessage,
  ...workErrorMessage,
  ...utilsErrorMessage
}
