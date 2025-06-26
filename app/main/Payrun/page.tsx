'use client'
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import React from 'react'
import Import from '../components/Import';
import Dialogs from '../components/dialog'
import PayrunForm from './_components/PayrunForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const page = () => {
  const [isPayrun, setIsPayrun] = React.useState(true)
   const [isSheetOpen, setIsSheetOpen] = React.useState(false);
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
								className='bg-[#3D56A8] text-white'>
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
						<Import title='Pay Runs' />
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
											className='bg-[#3D56A8] text-white'>
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
									<Import title='Pay Runs' />
								</Dialogs>
							</article>
						</section>
					</div>
				</div>
			) : (
				<div>
					<div className='m-3'>
						<Tabs className='rounded-lg bg-transparent'>
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
							<TabsContent value='monthly'></TabsContent>
							<TabsContent value='bi-weekly'></TabsContent>
							<TabsContent value='weekly'></TabsContent>
						</Tabs>
					</div>
				</div>
			)}
		</div>
	);
}

export default page
