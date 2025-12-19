import { XCircleIcon } from 'lucide-react'

import { Alert, AlertTitle } from '@/components/ui/alert'

interface AlertErrorProps {
  message: string
}

const AlertError = ({ message }: AlertErrorProps) => {
  return (
    <Alert className='rounded-md border-l-6 border-destructive bg-destructive/10 text-destructive dark:border-red-400 dark:bg-red-400/10 dark:text-red-400'>
      <XCircleIcon />
      <AlertTitle>{message}</AlertTitle>
    </Alert>
  )
}

export default AlertError
