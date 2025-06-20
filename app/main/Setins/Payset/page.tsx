import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import React from 'react';
import SalStruc from './_components/salStruc';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import Stanfreq from './_components/stanfreq';
import { Button } from '@/components/ui/button';

const page = () => {
	return (
		<div className='h-[680px]'>
			<div className='mx-4'>
				<h1>Payroll Settings</h1>
				<h5 className='text-sm'>
					Configure all payroll-related settings for your <br /> organization.
				</h5>
			</div>
			<div className=' bg-white rounded-lg h-screen m-5'>
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
					<TabsContent value='payFreq'>
						<Card className='m-3 p-4'>
							<Tabs
								defaultValue='stanfreq'
								className='rounded-lg'>
								<div className='flex'>
									<TabsList>
										<TabsTrigger
											value='stanfreq'
											className='data-[state=active]:text-[#3d56a8] text-muted-foreground'>
											Standard Frequencies
										</TabsTrigger>
										<TabsTrigger
											value='custoFreq'
											className='data-[state=active]:text-[#3d56a8] text-muted-foreground'>
											Custom Frequencies
										</TabsTrigger>
									</TabsList>
									{ (
										<div>
											{/* Add your content here */}
										</div>
									)}
									<article className='self-end ml-auto'>
										<Button variant={'default'} className=' bg-[#3d56a8] self-end hover:bg-white hover:text-[#3d56a8]'>
											<span className='text-xs'> +Add Custom Frequency</span>
										</Button>
									</article>
								</div>
								<TabsContent value='stanfreq'>
									<Stanfreq />
								</TabsContent>
								<TabsContent value='custoFreq'>
									<div className='p-4'>
										<h3>Custom Pay Frequencies</h3>
										<p>
											List of custom pay frequencies will be displayed here.
										</p>
									</div>
								</TabsContent>
							</Tabs>
						</Card>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
};

export default page;
