'use client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { set } from 'date-fns'
import React from 'react'

const salStruc = () => {
    const [isOpen, setIsOpen] = React.useState(true)
    const [add, setAdd] = React.useState(false)
    const ShowAdd = () => {
        setAdd(true)
        if (add) {
            return (
                <div className='flex flex-col items-center justify-center h-full'>
                    <h1 className='text-2xl font-bold mb-4'>Add Salary Structure</h1>
                    {/* Add your form or content for adding salary structure here */}
                </div>
            )
        }
        setIsOpen(false)
    }


  return (
    <div>
      <Card>
        {isOpen ? (
          <div className='flex flex-col items-center justify-between h-full'>
            <h1 className='text-2xl font-bold mb-4'>Salary Structure</h1>
            <Button onClick={() => { setIsOpen(false); setAdd(true); }}>+ Create Salary Structure</Button>
          </div>
        ) : (
          add && (
            <div className='flex flex-col items-center justify-center h-full'>
              <h1 className='text-2xl font-bold mb-4'>Add Salary Structure</h1>
              {/* Add your form or content for adding salary structure here */}
            </div>
          )
        )}
      </Card>
    </div>
  )
}

export default salStruc
