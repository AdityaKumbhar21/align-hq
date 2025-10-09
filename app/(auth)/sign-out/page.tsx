import { Button } from '@/components/ui/button'
import { SignOutButton } from '@clerk/nextjs'
import React from 'react'

const page = () => {
  return (
    <div>
        <Button><SignOutButton /></Button>
    </div>
  )
}

export default page