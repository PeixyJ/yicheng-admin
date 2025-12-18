const Dashboard = () => {
  return (
    <div className='flex flex-1 flex-col gap-4'>
      <h1 className='text-2xl font-semibold'>Dashboard</h1>
      <div className='bg-muted/50 flex min-h-[50vh] flex-1 items-center justify-center rounded-xl border border-dashed'>
        <p className='text-muted-foreground'>Dashboard content goes here</p>
      </div>
    </div>
  )
}

export default Dashboard
