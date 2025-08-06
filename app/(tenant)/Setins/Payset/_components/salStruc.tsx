'use client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { set } from 'date-fns';

import Image from 'next/image';
import React from 'react';

const salStruc = () => {
	const [isOpen, setIsOpen] = React.useState(false);
	const [add, setAdd] = React.useState(true);
	const [value, setValue] = React.useState('');


	const ShowAdd = () => {
		setAdd(true);
		if (add) {
			return (
				<div className='flex flex-col items-center justify-center h-full'>
					<h1 className='text-2xl font-bold mb-4'>Add Salary Structure</h1>
					{/* Add your form or content for adding salary structure here */}
				</div>
			);
		}
		setIsOpen(false);
	};

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
								<div className='flex justify-between m-5'>
									<span>
										<Label htmlFor='Structure'>Structure name</Label>
										<Input
											type='text'
											id='Structure'
											placeholder='Structure name'
											className='w-[200px] my-3'
										/>
									</span>
									<span>
										<Label htmlFor='Currency'>Currency</Label>
										<Input
											id='currency'
											type='text'
											list='currencies'
											placeholder='Nigerian Naira(NGN)'
											className='w-[200px] my-3'
										/>
										<datalist id='currencies'>
											<option value='USD' />
											<option value='EUR' />
											<option value='GBP' />
											<option value='NGN' />
										</datalist>
									</span>
									<span>
										<Label htmlFor='Description'>Description(Optional)</Label>
										<Input
											id='Description'
											type='text'
											placeholder='Enter Structure Description'
											className='w-[200px] my-3'
										/>
									</span>
								</div>
								<Card>
									<div
										className='flex items-center mx-5 justify-between
									'>
										<h6 className='text-md font-bold mb-4 flex text-center items-center mt-3.5'>
											Salary Component
										</h6>
										<Button
											variant={'outline'}
											className='bg-[#3D56A8] text-white'
											onClick={() => ShowAdd}>
											+ Add Salary Component
										</Button>
									</div>
									<Table className='p-3 m-3 w-fit gap-5'>
										<TableHeader>
											<TableRow className='text-[#3D56A8]'>
												<TableHead className='text-[#3D56A8] px-6'>
													COMPONENT NAME
												</TableHead>
												<TableHead className='text-[#3D56A8] px-6'>
													CALCULATION TYPE
												</TableHead>
												<TableHead className='text-[#3D56A8] px-6'>
													VALUE
												</TableHead>
												<TableHead className='text-[#3D56A8] px-6'>
													TAXABLE
												</TableHead>
												<TableHead className='text-[#3D56A8] px-6'>
													RECURRING
												</TableHead>
												<TableHead className='text-[#3D56A8] px-6'>
													ACTIONS
												</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											<TableRow>
												<TableCell>
													<div className='text-center items-center justify-center flex'>
														<Select>
															<SelectTrigger className='w-[200px] z-[1050] bg-[#FAFAFA] border-[#A8A8A8] text-[#393939]'>
																<SelectValue placeholder='Housing Allowance' />
															</SelectTrigger>
															<SelectContent
																position='popper'
																className='z-[1050] bg-[#FAFAFA] border-[#A8A8A8] text-[#393939]'
																defaultValue={'allow-1'}>
																<SelectItem
																	value='allow-1'
																	className='z-[1050] bg-[#FAFAFA] border-[#A8A8A8] text-[#393939]'>
																	Housing Allowance
																</SelectItem>
																<SelectSeparator />
																<SelectItem
																	value='allow-2'
																	className='z-[1050] bg-[#FAFAFA] border-[#A8A8A8] text-[#393939]'>
																	Transport Allowance
																</SelectItem>
																<SelectItem
																	value='allow-3'
																	className='z-[1050] bg-[#FAFAFA] border-[#A8A8A8] text-[#393939]'>
																	Medical Allowance
																</SelectItem>
															</SelectContent>
														</Select>
													</div>
												</TableCell>
												<TableCell className='flex justify-center'>
													<div className=' bg-[#FAFAFA] border-[#A8A8A8] text-[#393939] w-[60px] flex justify-center border-solid border-1 rounded-md p-1'>
														<h5 className='text-center self-center'>Fixed</h5>
													</div>
												</TableCell>
												<TableCell>
													<div className='w-[80px] bg-[#FAFAFA] border-[#A8A8A8] text-[#393939]'>
														<Input
															type='number'
															placeholder='20000'
															defaultValue={20000}
															className=''
														/>
													</div>
												</TableCell>
												<TableCell>
													<div className='text-center items-center justify-center  flex'>
														<Input
															type='checkbox'
															className='w-4 h-4'
														/>
													</div>
												</TableCell>
												<TableCell>
													<div className='text-center items-center justify-center  flex'>
														<Input
															type='checkbox'
															className='w-4 h-4'
														/>
													</div>
												</TableCell>
												<TableCell>
													<div className='text-center items-center justify-center flex'>
														<button>
															<Image
																src='/icons/delete-icon.png'
																className='self-center'
																alt='Delete Icon'
																width={20}
																height={20}
															/>
														</button>
													</div>
												</TableCell>
											</TableRow>
											<TableRow>
												<TableCell>
													<Select>
														<SelectTrigger className='w-[200px] z-[1050] bg-[#FAFAFA] border-[#A8A8A8] text-[#393939]'>
															<SelectValue placeholder='Transport Allowance' />
														</SelectTrigger>
														<SelectContent
															position='popper'
															className='z-[1050] bg-[#FAFAFA] border-[#A8A8A8] text-[#393939]'
															defaultValue={'allow-2'}>
															<SelectItem
																value='allow-1'
																className=''>
																Housing Allowance
															</SelectItem>
															<SelectSeparator />
															<SelectItem value='allow-2'>
																Transport Allowance
															</SelectItem>
															<SelectItem value='allow-3'>
																Medical Allowance
															</SelectItem>
														</SelectContent>
													</Select>
												</TableCell>
												<TableCell className='flex justify-center'>
													<div className=' bg-[#FAFAFA] border-[#A8A8A8] text-[#393939] w-[60px] flex justify-center border-solid border-1 rounded-md p-1'>
														<h5 className='text-center self-center'>Fixed</h5>
													</div>
												</TableCell>
												<TableCell>
													<div className=' w-[80px] bg-[#FAFAFA] border-[#A8A8A8] text-[#393939]'>
														<Input
															type='number'
															placeholder='20000'
															defaultValue={20000}
														/>
													</div>
												</TableCell>
												<TableCell>
													<div className='text-center items-center justify-center flex'>
														<Input
															type='checkbox'
															className='w-4 h-4'
														/>
													</div>
												</TableCell>
												<TableCell>
													<div className='text-center items-center justify-center  flex'>
														<Input
															type='checkbox'
															className='w-4 h-4'
														/>
													</div>
												</TableCell>
												<TableCell>
													<div className='text-center items-center justify-center flex'>
														<button>
															<Image
																src='/icons/delete-icon.png'
																alt='Delete Icon'
																width={20}
																height={20}
															/>
														</button>
													</div>
												</TableCell>
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
};

export default salStruc;
