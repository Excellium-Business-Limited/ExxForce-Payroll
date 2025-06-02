import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CompList from './_components/compList';
import React from 'react';
import { Card } from '@/components/ui/card';

const page = () => {
	return (
		<div className='h-[680px]'>
			<div className='mx-4'>
				<h1>Company Settings</h1>
				<h5 className='text-sm'>Manage your organization settings and preferences</h5>
			</div>
			<div className=' bg-white rounded-lg h-[433px] m-5'>
				<Tabs className='self-center' defaultValue='Company'>
					<TabsList className='no-design'>
						<div className='m-2'>
				<TabsTrigger
					value='Company'
					className='data-[state=active]:text-[#3d56a8] data-[state=active]:underline text-muted-foreground'>
					Company
				</TabsTrigger>
							<TabsTrigger
								value='Department'
								className='data-[state=active]:text-[#3D56A8] data-[state=active]:underline text-muted-foreground'>
								Department
							</TabsTrigger>
						</div>
						<hr className=' h-[2px]' />
					</TabsList>
					<TabsContent value='Company'>
						<CompList />
					</TabsContent>
					<TabsContent value='Department'></TabsContent>
				</Tabs>
			</div>
		</div>
	);
};

export default page;
