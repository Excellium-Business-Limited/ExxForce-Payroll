import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CompList from './_components/compList';
import React from 'react';
import DesList from './_components/DesList'
import { Card } from '@/components/ui/card';
import DepList from './_components/DepList';

const page = () => {
	return (
		<div className='min-h-screen bg-gray-50'>
			<div className='mx-6 p-6'>
				<h1>Company Settings</h1>
				<p className='text-gray-600'>
					Manage your organization settings and preferences
				</p>
			</div>
			<div className='bg-white rounded-lg shadow-sm'>
				<Tabs
					className='w-full'
					defaultValue='Company'>
					<TabsList className='w-full justify-start border-b bg-transparent h-auto p-0 rounded-none'>
						<div className='flex gap-8 px-6 py-4'>
							<TabsTrigger
								value='Company'
								className='data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:bg-transparent text-gray-600 hover:text-gray-900 border-b-2 border-transparent pb-4 pt-2 px-0 rounded-none font-medium'>
								Company
							</TabsTrigger>
							<TabsTrigger
								value='Designation'
								className='data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:bg-transparent text-gray-600 hover:text-gray-900 border-b-2 border-transparent pb-4 pt-2 px-0 rounded-none font-medium'>
								Designation
							</TabsTrigger>
							<TabsTrigger
								value='Department'
								className='data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:bg-transparent text-gray-600 hover:text-gray-900 border-b-2 border-transparent pb-4 pt-2 px-0 rounded-none font-medium'>
								Department
							</TabsTrigger>
						</div>
						<hr className=' h-[2px]' />
					</TabsList>
					<TabsContent value='Company'>
						<CompList />
					</TabsContent>
					<TabsContent value='Designation'>
						<DesList />
					</TabsContent>
					<TabsContent value='Department'>
						<DepList />
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
};

export default page;
