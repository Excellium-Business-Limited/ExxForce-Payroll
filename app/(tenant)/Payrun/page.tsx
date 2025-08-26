'use client'
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import React, { useEffect, useState } from 'react'
import Import from '../components/Import';
import Dialogs from '../components/dialog'
import PayrunForm from './_components/PayrunForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Submit from './_components/payrunSubmit';
import {payrans} from './_components/payrunData'
import { redirect, usePathname, useRouter } from 'next/navigation';
import axios from 'axios';
import  { useGlobal } from '@/app/Context/page';
import { getAccessToken, getTenant } from '@/lib/auth';
import { ST } from 'next/dist/shared/lib/utils';


interface PayRun {
	id: number;
	name: string;
	pay_period: string;
	total_employees: number;
	pay_frequency: string;
	start_date: string;
	end_date: string;
	payment_date: string;
	status: string;
}

const page = () => {
  const [isPayrun, setIsPayrun] = React.useState(true)
   const [isSheetOpen, setIsSheetOpen] = React.useState(false);
	const [isLoading, setIsLoading] = useState(false);
   const router = useRouter();
		const pathname = usePathname();
		
		// const tenantName = tenant ? tenant : pathname.split('/')[1];

		const [payruns, setPayruns] = useState<PayRun[]>([]);
		const [error, setError] = useState('');
		
		useEffect(() => {
			const tenant = getTenant();
			const fetchPayRuns = async () => {
				try {
					setIsLoading(true);
						const token = getAccessToken()
						const res = await axios.get<PayRun[]>(
							`http://${tenant}.localhost:8000/tenant/payrun/list`,
							{ headers: { Authorization: `Bearer ${token}` } }
						);
					setPayruns(res.data);
					
					setIsLoading(false);
					console.log(res.data);
				} catch (err: any) {
					console.error(err);
					setError(err.response?.data?.detail || 'Failed to load pay runs');
					if (err.response?.status === 401) {
						// Redirect to login if unauthorized
						setTimeout(()=>{
							redirect('/login')
						}, 2000)
					}
				}
			};
			fetchPayRuns();
			
		}, []);
	
		useEffect(() => {
			
		}, [])
		if (error) return <p >{error}</p>;

		if (isLoading) return <div className='self-center font-extrabold'>Loading...</div>;

		

  return (
		<div className='h-[2000px]'>
			<div className='flex flex-row items-center justify-between w-full my-7 px-3 gap-4'>
				<span>
					<h1>Pay Runs</h1>
					<p className='text-xs'>Create and Mange your Payruns</p>
				</span>
				<span className='items-end self-end justify-between flex gap-4'>
					<Sheet
						open={isSheetOpen}
						onOpenChange={setIsSheetOpen}>
						<SheetTrigger asChild>
							<Button
								variant={'outline'}
								className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2'>
								Create Payrun
							</Button>
						</SheetTrigger>
						<SheetContent className='min-w-[500px] p-4 overflow-auto bg-white'>
							<SheetTitle className='hidden'></SheetTitle>
							<PayrunForm
								setIsSheetOpen={setIsSheetOpen}
								setIsPayrun={setIsPayrun}
							/>
						</SheetContent>
					</Sheet>
					<Dialogs
						title={'Import'}
						className='border-[#d4d8de] border-2 px-7'>
						<Import
							title='Pay Runs'
							isOpen={false}
							onClose={function (): void {
								throw new Error('Function not implemented.');
							}}
							onSubmit={function (importData: any): Promise<void> {
								throw new Error('Function not implemented.');
							}}
						/>
					</Dialogs>
				</span>
			</div>
			{isPayrun === false ? (
				<div>
					<div className='h-[680px] m-7 gap-4 '>
						<section className='text-center flex flex-col items-center max-w-2xl mx-auto mt-[120px]'>
							<img
								src='/payrun.jpg'
								alt='Team Illustration'
								className='w-32 h-32 md:w-40 md:h-40 mx-auto mb-8'
							/>
							<h2 className='text-2xl md:text-3xl  mb-4'>
								Start Your First Payroll{' '}
							</h2>
							<p className='text-base text-muted-foreground border-2 self mb-8 w-[460px]'>
								Easily create and manage payruns for your employees. Select the
								pay period, add employee data, and process salaries quickly.
							</p>
							<article className='flex flex-col sm:flex-row gap-4 justify-center'>
								<Sheet
									open={isSheetOpen}
									onOpenChange={setIsSheetOpen}>
									<SheetTrigger asChild>
										<Button
											variant={'outline'}
											className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2'>
											Create Payrun
										</Button>
									</SheetTrigger>
									<SheetContent className='min-w-[500px] p-4 z-[1000]'>
										<SheetTitle className='hidden'></SheetTitle>
										<PayrunForm
											className='absolute'
											setIsSheetOpen={setIsSheetOpen}
											setIsPayrun={setIsPayrun}
										/>
									</SheetContent>
								</Sheet>
								<Dialogs
									title={'Import'}
									className='border-[#d4d8de] border-2 px-7'>
									<Import
										title='Pay Runs'
										isOpen={false}
										onClose={function (): void {
											throw new Error('Function not implemented.');
										}}
										onSubmit={function (importData: any): Promise<void> {
											throw new Error('Function not implemented.');
										}}
									/>
								</Dialogs>
							</article>
						</section>
					</div>
				</div>
			) : (
				<div>
					<div className='m-3'>
						<Tabs
							className='rounded-lg bg-transparent'
							defaultValue='monthly'>
							<TabsList className='bg-white w-[500px]'>
								<TabsTrigger
									value='monthly'
									className='data-[state=active]:text-[#3d56a8] text-muted-foreground'>
									Monthly
								</TabsTrigger>
								<TabsTrigger
									value='bi-weekly'
									className='data-[state=active]:text-[#3d56a8] text-muted-foreground'>
									Bi-Weekly
								</TabsTrigger>
								<TabsTrigger
									value='weekly'
									className='data-[state=active]:text-[#3d56a8] text-muted-foreground'>
									Weekly
								</TabsTrigger>
							</TabsList>
							<TabsContent value='monthly'>
								<Submit
									payruns={payruns
										.filter((payrun: any) => payrun.pay_period === 'MONTHLY')
										.map((payrun: any) => ({
											...payrun,
											PAY_PERIOD: payrun.pay_period || '',
											NAME: payrun.name || '',
											TOTAL_EMPLOYEES: payrun.total_employees || 0, //Ask Daniel to add this to the response for this fetch
											PAYMENT_DATE: payrun.payment_date || '',
											START_DATE: payrun.start_date || '',
											STATUS: payrun.status,
											// Add any other required fields with default values if missing
										}))}
									nexts='24th, April 2025'
								/>
							</TabsContent>
							<TabsContent value='bi-weekly'>
								<Submit
									payruns={payruns
										.filter(
											(payrun: any) => payrun.pay_period === 'BI-WEEKLY'
										)
										.map((payrun: any) => ({
											...payrun,
											PAY_PERIOD: payrun.pay_period || '',
											NAME: payrun.name || '',
											TOTAL_EMPLOYEES: payrun.total_employees || 0, //Ask Daniel to add this to the response for this fetch
											PAYMENT_DATE: payrun.payment_date || '',
											START_DATE: payrun.start_date || '',
											STATUS: payrun.status,
											// Add any other required fields with default values if missing
										}))}
									nexts='15th, April 2025'
								/>
							</TabsContent>
							<TabsContent value='weekly'>
								<Submit
									payruns={payruns
										.filter((payrun: any) => payrun.pay_period === 'WEEKLY')
										.map((payrun: any) => ({
											...payrun,
											PAY_PERIOD: payrun.pay_period || '',
											NAME: payrun.name || '',
											TOTAL_EMPLOYEES: payrun.total_employees || 0, //Ask Daniel to add this to the response for this fetch
											PAYMENT_DATE: payrun.payment_date || '',
											START_DATE: payrun.start_date || '',
											STATUS: payrun.status,
											// Add any other required fields with default values if missing
										}))}
									nexts='5th, April 2025'
								/>
							</TabsContent>
						</Tabs>
					</div>
				</div>
			)}
		</div>
	);
}

export default page
