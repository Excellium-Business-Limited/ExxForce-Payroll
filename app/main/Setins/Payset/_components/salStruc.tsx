'use client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { set } from 'date-fns'

import Image from 'next/image'
import React from 'react'

const salStruc = () => {
    const [isOpen, setIsOpen] = React.useState(true)
    const [add, setAdd] = React.useState(false)
      const [value, setValue] = React.useState('');

			const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
				// Format the input value as currency
				const formattedValue = e.target.value.replace(/[^0-9.]/g, ''); // Allow only numbers and dots
				setValue(formattedValue);
			};
    
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
			<Card className='border-none shadow-none m-3 p-4'>
				{isOpen ? (
					<div>
						<div className='flex flex-row items-center justify-between h-full'>
							<h1 className='text-2xl font-bold mb-4'>Salary Structure</h1>
							<Button
								onClick={() => {
									setIsOpen(false);
									setAdd(true);
								}}
								variant={'outline'}
								className='bg-[#3D56A8] text-white'>
								+ Create Salary Structure
							</Button>
						</div>
						<div className='text-center max-w-2xl mx-auto mt-[120px]'>
							<img
								src='/Salary-img.jpg'
								alt='Team Illustration'
								className='w-32 h-32 md:w-40 md:h-40 mx-auto mb-8'
							/>
							<h2 className='text-2xl md:text-3xl  mb-4'>
								No Salary Structure Yet
							</h2>
							<pre className='text-base text-muted-foreground mb-8'>
								Create and Manage reusable salary structure <br /> templates.
							</pre>
							<Button
								onClick={() => {
									setIsOpen(false);
									setAdd(true);
								}}
								variant={'outline'}
								className='bg-[#3D56A8] text-white'>
								+ Create Salary Structure
							</Button>
						</div>
					</div>
				) : (
					add && (
						<div className='flex flex-col items-center justify-center h-full'>
							<h5 className='text-2xl font-bold mb-4'>
								Create Salary Structure
							</h5>
							<form action='submit'>
								<div className='flex justify-between'>
									<span>
										<Label htmlFor='Structure'>Structure name</Label>
										<Input
											type='text'
											id='Structure'
											placeholder='Structure name'
											className='w-[300px]'
											required
										/>
									</span>
									<span>
										<Label htmlFor='Currency'>Currency</Label>
										<Input
											id='currency'
											type='text'
											value={value}
											onChange={handleChange}
											placeholder='Nigerian Naira(NGN)'
											className='w-[300px]'
											required
										/>
									</span>
									<span>
										<Label htmlFor='Description'>Description(Optional)</Label>
										<Input
											id='Description'
											type='text'
											placeholder='Enter Structure Description'
											className='w-[300px]'
										/>
									</span>
								</div>
								<Card>
									<Table>
										<TableHeader>
											<TableRow className='text-[#3D56A8]'>
												<TableHead className='text-[#3D56A8]'>
													COMPONENT NAME
												</TableHead>
												<TableHead className='text-[#3D56A8]'>
													CALCULATION TYPE
												</TableHead>
												<TableHead className='text-[#3D56A8]'>VALUE</TableHead>
												<TableHead className='text-[#3D56A8]'>
													TAXABLE
												</TableHead>
												<TableHead className='text-[#3D56A8]'>
													RECURRING
												</TableHead>
												<TableHead className='text-[#3D56A8]'>ACTIONS</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											<TableRow>
												<TableCell></TableCell>
												<TableCell></TableCell>
												<TableCell></TableCell>
												<TableCell></TableCell>
												<TableCell></TableCell>
												<TableCell></TableCell>
												<TableCell></TableCell>
											</TableRow>
											<TableRow>
												<TableCell></TableCell>
												<TableCell></TableCell>
												<TableCell></TableCell>
												<TableCell></TableCell>
												<TableCell></TableCell>
												<TableCell></TableCell>
												<TableCell></TableCell>
											</TableRow>
											<TableRow>
												<TableCell></TableCell>
												<TableCell></TableCell>
												<TableCell></TableCell>
												<TableCell></TableCell>
												<TableCell></TableCell>
												<TableCell></TableCell>
												<TableCell></TableCell>
											</TableRow>
										</TableBody>
									</Table>
								</Card>
							</form>
						</div>
					)
				)}
			</Card>
		</div>
	);
}

export default salStruc
