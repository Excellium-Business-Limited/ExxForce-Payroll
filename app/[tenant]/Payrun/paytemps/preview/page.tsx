import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from '@/components/ui/card';
import {
	Sheet,
	SheetContent,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';
import {
	Table,
	TableBody,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import React from 'react';
import Preview from './preview';

const page = () => {
	return (
		<div className='w-fit bg-white my-5 rounded-xl p-5 ml-3'>
			<article className='bg-white'>
				<div className='relative bg-white'>
					<section className='ml-2'>
						<h2>Preview Payslip</h2>
						<p className='font-light text-sm text-muted-foreground w-[470px] m-2.5'>
							These fields are populated with data from your completed pay run.
							Preview payslips to print or save them.
						</p>
					</section>
					<section className='grid grid-cols-3 grid-rows-3 my-2'>
						<p className='text-sm m-2'>Employee Name: John Smith</p>
						<p className='text-sm m-2'>Company Name: Excellium Business LTD </p>
						<p className='text-sm m-2'>Pay Frequency: Monthly</p>
						<p className='text-sm m-2'>Employee ID: 23561</p>
						<p className='text-sm m-2'>Company Address: Lagos, Nigeria</p>
						<p className='text-sm m-2'>Payment Date: April 30,2025</p>
						<p className='text-sm m-2'>Position: Software Engineer</p>
						<p> </p>
						<p className='text-sm '>Pay Period: April 2- April 30, 2025 </p>
					</section>
					<hr />
					<Card className='my-3 !p-0 h-fit'>
						<CardHeader className='bg-[#f3f4f5]'>Earnings</CardHeader>
						<Table>
							<TableHeader>
								<TableRow className='flex justify-between'>
									<TableHead>DESCRIPTION</TableHead>
									<TableHead>AMOUNT(NGN)</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								<TableRow className='text-muted-foreground flex justify-between'>
									<TableCell>Basic Salary</TableCell>
									<TableCell>₦250,000.00</TableCell>
								</TableRow>
								<TableRow className='text-muted-foreground flex justify-between'>
									<TableCell>Housing Allowance</TableCell>
									<TableCell>₦50,000.00</TableCell>
								</TableRow>
								<TableRow className='text-muted-foreground flex justify-between'>
									<TableCell>Transport Allowance</TableCell>
									<TableCell>₦30,000.00</TableCell>
								</TableRow>
							</TableBody>
							<TableFooter className='bg-[#f3f4f5] flex justify-between w-full h-full'>
								<TableHead>Total Earnings</TableHead>
								<TableHead>₦270,000.00</TableHead>
							</TableFooter>
						</Table>
					</Card>
					<Card className='my-3 !p-0 h-fit'>
						<CardHeader className='bg-[#f3f4f5] h-fit'>Deductions</CardHeader>

						<Table>
							<TableHeader>
								<TableRow className='flex justify-between'>
									<TableHead>DESCRIPTION</TableHead>
									<TableHead>AMOUNT(NGN)</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								<TableRow className='text-muted-foreground flex justify-between'>
									<TableCell>PAYE Tax</TableCell>
									<TableCell>₦20,000.00</TableCell>
								</TableRow>
								<TableRow className='text-muted-foreground flex justify-between'>
									<TableCell>Pension Contribution</TableCell>
									<TableCell>₦18,000.00</TableCell>
								</TableRow>
								<TableRow className='text-muted-foreground flex justify-between'>
									<TableCell>Loan Repayment</TableCell>
									<TableCell>₦5,000.00</TableCell>
								</TableRow>
								<TableRow className='text-muted-foreground flex justify-between'>
									<TableCell>Industrial Training Fund(ITF)</TableCell>
									<TableCell>₦2,000.00</TableCell>
								</TableRow>
							</TableBody>
							<TableFooter className='bg-[#f3f4f5] flex justify-between w-full h-full'>
								<TableHead>Total Deductions</TableHead>
								<TableHead>₦270,000:00</TableHead>
							</TableFooter>
						</Table>
					</Card>
					<Card className='my-3 !p-0 h-[50px] rounded-xl bg-[#f3f4f5]'>
						<CardContent className='flex pt-4 justify-between bg-[#f3f4f5]'>
							<h4 className='font-bold '>Net Pay</h4>
							<h4 className='font-bold'>₦225,000.00</h4>
						</CardContent>
					</Card>
					<Card className='my-3 !p-0'>
						<CardHeader className='bg-[#f3f4f5] h-fit'>
							Company Benefit
						</CardHeader>
						<Table>
							<TableHeader>
								<TableRow className='flex justify-between'>
									<TableHead>DESCRIPTION</TableHead>
									<TableHead>AMOUNT(NGN)</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								<TableRow className='text-muted-foreground flex justify-between'>
									<TableCell>HMO Insurance</TableCell>
									<TableCell>₦50,000.00</TableCell>
								</TableRow>
							</TableBody>
							<TableFooter className='bg-[#f3f4f5]  mb-8'>
								<TableRow className='flex justify-between'>
									<TableHead>Total</TableHead>
									<TableHead>₦50,000:00</TableHead>
								</TableRow>
							</TableFooter>
						</Table>
					</Card>
					<div>
						<span className=' absolute right-0 mt-8 '>
							Generated Report by Exxforce LTD
						</span>
					</div>
				</div>
			</article>
		</div>
	);
};

export default page;
