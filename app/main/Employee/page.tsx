import React from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card';

const page = () => {
  return (
		<div>
			<div className='self-center h-[603px] ml-7 gap-4'>
				<div>
					<h3 className='text-2xl font-bold, top-0.5, left-0.5'>Employee</h3>

					<p className='text-sm text-muted-foreground'>Manage your employees</p>
					<Button variant='outline'>Add Employee</Button>
					<Button variant='outline'>Import Employees</Button>
				</div>
				<div>
					<h2>Add employees</h2>
					<p>
						Add employees to your company. You can add employees one by one or
						import them in bulk.
					</p>
					<Button variant='outline'>Add Employee</Button>
					<Button variant='outline'>Import Employees</Button>
				</div>
			</div>
		</div>
	);
}

export default page
