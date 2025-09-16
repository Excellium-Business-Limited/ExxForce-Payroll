'use client';
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SalaryStructure from './pages/salStruc';
import StandardFrequencies from './pages/stanfreq';
import CustomFrequencies from './pages/custfreq';
import PayGrades from './pages/paygrade';
import PayScheduleTemplates from './pages/payrunTemp';
import WorkSchedule from './pages/wrkSched';

const PayrollSettingsPage = () => {
	return (
		<div className='min-h-screen bg-gray-50'>
			<div className='p-6'>
				<div className='mb-6'>
					<h1 className='text-3xl font-bold text-gray-900 mb-2'>
						Payroll Settings
					</h1>
					<p className='text-gray-600'>
						Configure all payroll-related settings for your organization.
					</p>
				</div>

				<div className='bg-white rounded-lg shadow-sm'>
					<Tabs
						defaultValue='payG'
						className='w-full'>
						<TabsList className='w-full justify-start border-b bg-transparent h-auto p-0 rounded-none'>
							<div className='flex gap-8 px-6 py-4'>
								<TabsTrigger
									value='salaryst'
									className='data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-b-blue-600 data-[state=active]:bg-transparent text-gray-600 hover:text-gray-900 border-b-2 border-transparent pb-4 pt-2 px-0 rounded-none font-medium'>
									Salary Structure
								</TabsTrigger>
								<TabsTrigger
									value='payG'
									className='data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-b-blue-600  data-[state=active]:bg-transparent text-gray-600 hover:text-gray-900 border-b-2 border-transparent pb-4 pt-2 px-0 rounded-none font-medium'>
									Pay Grade
								</TabsTrigger>
								<TabsTrigger
									value='workSch'
									className='data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-b-blue-600 data-[state=active]:bg-transparent text-gray-600 hover:text-gray-900 border-b-2 border-transparent pb-4 pt-2 px-0 rounded-none font-medium'>
									Work Schedule
								</TabsTrigger>
								<TabsTrigger
									value='payComp'
									className='data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-b-blue-600 data-[state=active]:bg-transparent text-gray-600 hover:text-gray-900 border-b-2 border-transparent pb-4 pt-2 px-0 rounded-none font-medium'>
									Pay Schedule
								</TabsTrigger>
								<TabsTrigger
									value='payFreq'
									className='data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-b-blue-600 data-[state=active]:bg-transparent text-gray-600 hover:text-gray-900 border-b-2 border-transparent pb-4 pt-2 px-0 rounded-none font-medium'>
									Pay Frequencies
								</TabsTrigger>
							</div>
						</TabsList>

						<div className='min-h-[600px]'>
							<TabsContent
								value='salaryst'
								className='mt-0'>
								<SalaryStructure />
							</TabsContent>

							<TabsContent
								value='payG'
								className='mt-0'>
								<PayGrades />
							</TabsContent>

							<TabsContent
								value='workSch'
								className='mt-0'>
								<WorkSchedule />
							</TabsContent>

							<TabsContent
								value='payComp'
								className='mt-0'>
								<PayScheduleTemplates />
							</TabsContent>

							<TabsContent
								value='payFreq'
								className='mt-0'>
								<div className='p-6'>
									<Tabs
										defaultValue='stanfreq'
										className='w-full'>
										<div className='flex justify-between items-center mb-6'>
											<TabsList className='bg-gray-100'>
												<TabsTrigger
													value='stanfreq'
													className='data-[state=active]:bg-white data-[state=active]:text-blue-600 text-gray-600'>
													Standard Frequencies
												</TabsTrigger>
												<TabsTrigger
													value='custoFreq'
													className='data-[state=active]:bg-white data-[state=active]:text-blue-600 text-gray-600'>
													Custom Frequencies
												</TabsTrigger>
											</TabsList>
										</div>

										<TabsContent
											value='stanfreq'
											className='mt-0'>
											<StandardFrequencies />
										</TabsContent>

										<TabsContent
											value='custoFreq'
											className='mt-0'>
											<CustomFrequencies />
										</TabsContent>
									</Tabs>
								</div>
							</TabsContent>
						</div>
					</Tabs>
				</div>
			</div>
		</div>
	);
};

export default PayrollSettingsPage;
