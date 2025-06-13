import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import React from 'react';
import SalStruc from './_components/salStruc';

const page = () => {
	return (
		<div className='h-[680px]'>
			<div className='mx-4'>
				<h1>Payroll Settings</h1>
				<h5 className='text-sm'>
					Configure all payroll-related settings for your <br /> organization.
				</h5>
			</div>
			<div className=' bg-white rounded-lg h-[433px] m-5'>
				<Tabs
					className='self-center'
					defaultValue='salaryst'>
					<TabsList className='no-design'>
						<div className='m-2'>
							<TabsTrigger
								value='salaryst'
								className='data-[state=active]:text-[#3d56a8] data-[state=active]:underline text-muted-foreground'>
								Salary Structure
							</TabsTrigger>
							<TabsTrigger
								value='payG'
								className='data-[state=active]:text-[#3d56a8] data-[state=active]:underline text-muted-foreground'>
								Pay Grade
							</TabsTrigger>
							<TabsTrigger
								value='workSch'
								className='data-[state=active]:text-[#3d56a8] data-[state=active]:underline text-muted-foreground'>
								Work Schedule
							</TabsTrigger>
							<TabsTrigger
								value='payComp'
								className='data-[state=active]:text-[#3d56a8] data-[state=active]:underline text-muted-foreground'>
								Pay Component
							</TabsTrigger>
							<TabsTrigger
								value='payFreq'
								className='data-[state=active]:text-[#3d56a8] data-[state=active]:underline text-muted-foreground'>
								Pay Frequency
							</TabsTrigger>
						</div>
					</TabsList>
					<hr className=' h-[2px]' />
					<TabsContent value='salaryst'>
						<SalStruc />
					</TabsContent>
					<TabsContent value='payG'></TabsContent>
					<TabsContent value='workSch'></TabsContent>
					<TabsContent value='payComp'></TabsContent>
					<TabsContent value='payFreq'></TabsContent>
				</Tabs>
			</div>
		</div>
	);
};

export default page;
