import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import React from 'react'

const page = () => {
  return (
    <div className='h-[680px]'> 
      <Tabs className='self-center'>
        <TabsList className='no-design'>
          <TabsTrigger value='Company'>Company</TabsTrigger>
          <TabsTrigger value='Department'>Department</TabsTrigger>
        </TabsList>
          <TabsContent value='Company'></TabsContent>
          <TabsContent value='Department'></TabsContent>
      </Tabs>
    </div>
  )
}

export default page
