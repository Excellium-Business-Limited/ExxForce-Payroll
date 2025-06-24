'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import BulkUploadModal from '../components/Import';
import EmployeeForm from '../components/EmployeeForm';
import Dialogs from '../components/dialog'
import Import from '../components/Import';
import {Sheet, SheetTrigger, SheetContent, SheetTitle } from '@/components/ui/sheet';


const Page = () => {
  return (
		<div className='flex-1 flex flex-col h-[calc(100vh-64px)] overflow-auto'>
			{/* Header Section */}
			<div className='bg-[#EFF5FF] p-6 md:p-8'>
				<div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
					<div>
						<h1 className='text-2xl md:text-3xl font-bold'>Employees</h1>
						<p className='text-base md:text-lg text-muted-foreground'>
							Manage your organization's team
						</p>
					</div>
					<div className='flex gap-3 w-full md:w-auto'>
						<Button
							size='lg'
							className='w-full md:w-auto bg-[#3D56A8] hover:bg-[#2E4299] text-white'
							>
							Add Employee
						</Button>
						<Button
							size='lg'
							variant='outline'
							className='w-full md:w-auto border-[#3A1C1F] text-[#25282B] hover:bg-transparent hover:text-white bg-transparent'
							>
							Import CSV
						</Button>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<main className='flex-1 bg-[#EFF5FF] p-6 md:p-8 overflow-auto'>
				<div className='h-full flex flex-col items-center justify-center'>
					<div className='text-center max-w-2xl mx-auto'>
						<img
							src='/Employee Empty screen.jpg'
							alt='Team Illustration'
							className='w-32 h-32 md:w-40 md:h-40 mx-auto mb-8'
						/>
						<h2 className='text-2xl md:text-3xl font-bold mb-4'>
							Build Your Team
						</h2>
						<p className='text-base md:text-lg text-muted-foreground mb-8'>
							Get started by adding your first team member or importing multiple
							employees at once.
						</p>
						<div className='flex flex-col sm:flex-row gap-4 justify-center'>
							<Sheet>
							<SheetTrigger asChild>
								<Button
									variant={'outline'}
									className='bg-[#3D56A8] text-white'>
									Add Employee
								</Button>
							</SheetTrigger>
							<SheetContent className='min-w-[500px] p-4 overflow-auto bg-white'>
								<SheetTitle className='hidden'></SheetTitle>
								<EmployeeForm />
							</SheetContent>
						</Sheet>
							<Dialogs title={'Import'}>
								<Import title={''} />
							</Dialogs>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
};

export default Page;
