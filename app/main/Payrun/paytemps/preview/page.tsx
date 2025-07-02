import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import React from 'react';

const page = () => {
	return (
		<div>
			<section>
				<h2>Preview Payslip</h2>
				<p>
					These fields are populated with data from your completed pay run.
					Preview payslips to print or save them.
				</p>
			</section>
			<section className='grid grid-cols-3 grid-rows-3'>
				<p>Employee Name: John Smith</p>
				<p>Company Name: Excellium Business LTD Pay</p>
				<p>Frequency: Monthly</p>
				<p>Employee ID: 23561</p>
				<p>Company Address: Lagos, Nigeria</p>
				<p>Payment Date: April 30,2025</p>
				<p>Position: Software Engineer</p>
				<p> </p>
				<p>Pay Period: April 2- April 30, 2025 </p>
			</section>
			<hr />
			<Card>
				<CardHeader className='bg-[#f3f4f5]'>Earnings</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow className='flex justify-between'>
								<TableHead>DESCRIPTION</TableHead>
								<TableHead>AMOUNT(NGN)</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							<TableRow className='text-muted-foreground'>
								<TableCell>Basic Salary</TableCell>
								<TableCell>₦250,000.00</TableCell>
							</TableRow>
							<TableRow className='text-muted-foreground'>
								<TableCell>Housing Allowance</TableCell>
								<TableCell>₦50,000.00</TableCell>
							</TableRow>
							<TableRow className='text-muted-foreground'>
								<TableCell>Transport Allowance</TableCell>
								<TableCell>₦30,000.00</TableCell>
							</TableRow>
						</TableBody>
						<TableFooter className='bg-[#f3f4f5]'>
							<TableRow>
								<TableHead>Total Earnings</TableHead>
								<TableHead>₦270,000:00</TableHead>
							</TableRow>
						</TableFooter>
					</Table>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className='bg-[#f3f4f5]'>Deductions</CardHeader>
				<CardContent>
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
						<TableFooter className='bg-[#f3f4f5]'>
							<TableRow className='flex justify-between'>
								<TableHead>Total Deductions</TableHead>
								<TableHead>₦270,000:00</TableHead>
							</TableRow>
						</TableFooter>
					</Table>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className='flex justify-between bg-[#f3f4f5]'>
					<div>Net Pay</div>
					<div>₦225,000.00</div>
				</CardHeader>
			</Card>
			<Card>
				<CardHeader>Company Benefit</CardHeader>
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
					<TableFooter className='bg-[#f3f4f5]'>
						<TableRow className='flex justify-between'>
							<TableHead>Total</TableHead>
							<TableHead>₦50,000:00</TableHead>
						</TableRow>
					</TableFooter>
				</Table>
			</Card>
		</div>
	);
};

export default page;
