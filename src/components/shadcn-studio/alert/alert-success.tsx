import { CheckCircleIcon } from 'lucide-react'

import { Alert, AlertTitle } from '@/components/ui/alert'

interface AlertSuccessProps {
  message: string
}

const AlertSuccess = ({ message }: AlertSuccessProps) => {
  return (
    <Alert className='rounded-md border-l-6 border-green-600 bg-green-600/10 text-green-600 dark:border-green-400 dark:bg-green-400/10 dark:text-green-400'>
      <CheckCircleIcon />
      <AlertTitle>{message}</AlertTitle>
    </Alert>
  )
}

export default AlertSuccess
