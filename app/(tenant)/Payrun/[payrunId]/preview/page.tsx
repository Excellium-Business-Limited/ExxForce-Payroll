'use client'
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

const employeeData = {
	employeeName: 'John Smith',
	companyName: 'Excellium Business LTD',
	payFrequency: 'Monthly',
	employeeID: '23561',
	companyAddress: 'Lagos, Nigeria',
	paymentDate: 'April 30, 2025',
	position: 'Software Engineer',
	payPeriod: 'April 2 - April 30, 2025',
	earnings: {
		header: 'Earnings',
		items: [
			{
				description: 'Basic Salary',
				amount: '250000.00',
			},
			{
				description: 'Housing Allowance',
				amount: '50000.00',
			},
			{
				description: 'Transport Allowance',
				amount: '30000.00',
			},
		],
		totalEarnings: '270000.00',
	},
	deductions: {
		header: 'Deductions',
		items: [
			{
				description: 'PAYE Tax',
				amount: '20000.00',
			},
			{
				description: 'Pension Contribution',
				amount: '18000.00',
			},
			{
				description: 'Loan Repayment',
				amount: '5000.00',
			},
			{
				description: 'Industrial Training Fund(ITF)',
				amount: '2000.00',
			},
		],
		totalDeductions: '270000.00',
	},
	netPay: '225000.00',
	companyBenefit: {
		header: 'Company Benefit',
		items: [
			{
				description: 'HMO Insurance',
				amount: '50000.00',
			},
		],
		totalCompanyBenefit: '50000.00',
	},
};

// const employee = [Object.entries(employeeData)];


const page = () => {
	React.useEffect(() => {
			add(earnings);
		}, []);
	const {employeeName, employeeID, companyName, payFrequency, companyAddress, paymentDate, position, payPeriod, earnings, deductions, netPay, companyBenefit} = employeeData;

	interface financials{
		header: string;
		items: Array<Items>;
		totalEarnings?: string;
	}

	interface Items {
  description: string;
  amount: string;
}

	const add = (element : financials) =>{
		const itemsarray : Items[] = element.items;
		const constant : string[] = itemsarray.map(item => item.amount)
		const num : number = constant.map(item => parseFloat(item)).reduce((acc, curr) => acc + curr, 0);
		return(num);
	}
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
						<p className='text-sm m-2'>Employee Name: {employeeName}</p>
						<p className='text-sm m-2'>Company Name: {companyName} </p>
						<p className='text-sm m-2'>Pay Frequency: {payFrequency}</p>
						<p className='text-sm m-2'>Employee ID: {employeeID}</p>
						<p className='text-sm m-2'>Company Address: {companyAddress}</p>
						<p className='text-sm m-2'>Payment Date: {paymentDate}</p>
						<p className='text-sm m-2'>Position: {position}</p>
						<p> </p>
						<p className='text-sm '>Pay Period: {payPeriod}</p>
					</section>
					<hr />
					<Card className='my-3 !p-0 h-fit'>
						<CardHeader className='bg-[#f3f4f5]'>Earnings</CardHeader>
						<Table>
							<TableHeader>
								<TableRow className='flex justify-between'>
									<TableHead>DESCRIPTION</TableHead>
									<TableHead>AMOUNT(₦)</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{earnings.items.map((item, index) => {
									item = item as { description: string; amount: string };
									return (
										<TableRow
											key={index}
											className='text-muted-foreground flex justify-between'>
											<TableCell>{item.description}</TableCell>
											<TableCell>₦{item.amount}</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
							<TableFooter className='bg-[#f3f4f5] flex justify-between w-full h-full'>
								<TableHead>Total Earnings</TableHead>
								<TableHead>₦{`${add(earnings)}.00`}</TableHead>
							</TableFooter>
						</Table>
					</Card>
					<Card className='my-3 !p-0 h-fit'>
						<CardHeader className='bg-[#f3f4f5] h-fit'>Deductions</CardHeader>

						<Table>
							<TableHeader>
								<TableRow className='flex justify-between'>
									<TableHead>DESCRIPTION</TableHead>
									<TableHead>AMOUNT(₦)</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{deductions.items.map((item, index) => {
									item = item as { description: string; amount: string };
									return (
										<TableRow
											key={index}
											className='text-muted-foreground flex justify-between'>
											<TableCell>{item.description}</TableCell>
											<TableCell>₦{item.amount}</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
							<TableFooter className='bg-[#f3f4f5] flex justify-between w-full h-full'>
								<TableHead>Total Deductions</TableHead>
								<TableHead>₦{`${add(deductions)}.00`}</TableHead>
							</TableFooter>
						</Table>
					</Card>
					<Card className='my-3 !p-0 h-[50px] rounded-xl bg-[#f3f4f5]'>
						<CardContent className='flex pt-4 justify-between bg-[#f3f4f5]'>
							<h4 className='font-bold '>Net Pay</h4>
							<h4 className='font-bold'>{netPay}</h4>
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
									<TableHead>AMOUNT(₦)</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{companyBenefit.items.map((item, index) => {
									item = item as { description: string; amount: string };
									return (
										<TableRow
											key={index}
											className='text-muted-foreground flex justify-between'>
											<TableCell>{item.description}</TableCell>
											<TableCell>₦{item.amount}</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
							<TableFooter className='bg-[#f3f4f5] flex justify-between w-full h-full mb-8'>
								<TableHead>Total</TableHead>
								<TableHead>₦{`${add(companyBenefit)}.00`}</TableHead>
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
