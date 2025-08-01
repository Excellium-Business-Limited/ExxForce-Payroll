'use client';
import { Button } from '@/components/ui/button';
import React from 'react';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
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
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import Image from 'next/image';
import LoanForm from './loanForm';
import Link from 'next/link';
import LoanDetails from './components/loanDetails';
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogTitle,
} from '@/components/ui/dialog';
import Dialogs from '../components/dialog';
import Import from '../components/Import';
import UpdateRepay from '../components/updateRepay';
import { Card } from '@/components/ui/card';
const items = [
	{ id: '1', name: 'Item One' },
	{ id: '2', name: 'Item Two' },
	{ id: '3', name: 'Item Three' },
];

export default function Home() {
	const [isloan, setisLoan] = React.useState(true);
	const loanData = [
		{
			loanNumber: '45623-05',
			employeeName: 'Ifunanya Johnson',
			loanName: 'Car Loan',
			loanAmount: '₦600,000.00',
			deduction: '₦60,000.00',
			balanceRemaining: '₦540,000.00',
			status: 'Ongoing',
			id: '1',
		},
		{
			loanNumber: '45623-05',
			employeeName: 'Ifunanya Johnson',
			loanName: 'Car Loan',
			loanAmount: '₦600,000.00',
			deduction: '₦60,000.00',
			balanceRemaining: '₦540,000.00',
			status: 'Ongoing',
			id: '2',
		},
		{
			loanNumber: '45623-05',
			employeeName: 'Ifunanya Johnson',
			loanName: 'Car Loan',
			loanAmount: '₦600,000.00',
			deduction: '₦60,000.00',
			balanceRemaining: '₦540,000.00',
			status: 'Ongoing',
			id: '3',
		},
		{
			loanNumber: '45623-05',
			employeeName: 'Ifunanya Johnson',
			loanName: 'Car Loan',
			loanAmount: '₦600,000.00',
			deduction: '₦60,000.00',
			balanceRemaining: '₦540,000.00',
			status: 'Ongoing',
			id: '4',
		},
		{
			loanNumber: '45623-05',
			employeeName: 'Ifunanya Johnson',
			loanName: 'Car Loan',
			loanAmount: '₦600,000.00',
			deduction: '₦60,000.00',
			balanceRemaining: '₦540,000.00',
			status: 'Ongoing',
			id: '5',
		},
		{
			loanNumber: '45623-05',
			employeeName: 'Ifunanya Johnson',
			loanName: 'Car Loan',
			loanAmount: '₦600,000.00',
			deduction: '₦60,000.00',
			balanceRemaining: '₦540,000.00',
			status: 'Ongoing',
			id: '6',
		},
	];

	if (!isloan) {
		return (
			<div className='h-[680px] m-7 gap-4 '>
				<div className='flex flex-row items-center justify-between w-full'>
					<span>
						<h1>Loan</h1>
						<p className='text-xs'>Create and Mange Loans</p>
					</span>
					<span className='items-end self-end justify-between flex gap-4'>
						<Sheet>
							<Button
								variant={'outline'}
								className='bg-[#3D56A8] text-white'
								asChild>
								<SheetTrigger>Add Loan</SheetTrigger>
							</Button>
							<SheetContent className='min-w-[500px] p-4 overflow-auto bg-white'>
								<SheetTitle className='hidden'></SheetTitle>
								<LoanForm />
							</SheetContent>
						</Sheet>
						<Dialogs title={'Import'}>
							<Import title='Loans' />
						</Dialogs>
					</span>
				</div>
				<div className='text-center max-w-2xl mx-auto mt-[120px]'>
					<img
						src='/empty.jpg'
						alt='Team Illustration'
						className='w-32 h-32 md:w-40 md:h-40 mx-auto mb-8'
					/>
					<h2 className='text-2xl md:text-3xl  mb-4'>No Loans Yet</h2>
					<pre className='text-base text-muted-foreground mb-8'>
						You haven’t added any employee loans.Manage staff
						<br />
						loans easily by adding new loan records or importing
						<br />
						from a file.
					</pre>
					<div className='flex flex-col sm:flex-row gap-4 justify-center'>
						<Sheet>
							<SheetTrigger>
								<Button
									variant={'outline'}
									className='bg-[#3D56A8] text-white'>
									Add Loan
								</Button>
							</SheetTrigger>
							<SheetContent className='min-w-[500px] p-4 '>
								<SheetTitle className='hidden'></SheetTitle>
								<LoanForm />
							</SheetContent>
						</Sheet>
						<Dialogs title={'Import'}>
							<Import title='Loans' />
						</Dialogs>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className='w-full'>
			<div className='self-center h-[603px] ml-7 gap-4'>
				<div className='flex flex-row items-center justify-between w-full'>
					<span>
						<h1>Loan</h1>
						<p className='text-xs'>Create and Mange Loans</p>
					</span>
					<span className='items-end self-end justify-between flex gap-4'>
						<Sheet>
							<SheetTrigger asChild>
								<Button
									variant={'outline'}
									className='bg-[#3D56A8] text-white'>
									Add Loan
								</Button>
							</SheetTrigger>
							<SheetContent className='min-w-[500px] p-4 overflow-auto'>
								<SheetTitle className='hidden'></SheetTitle>
								<LoanForm />
							</SheetContent>
						</Sheet>
						<Dialogs title={'Import'}>
							<Import title='Loans' />
						</Dialogs>
					</span>
				</div>
				<Card className='mt-12 ml-auto w-full h-[750px] p-3'>
					<div className='flex flex-row items-center justify-between w-full'>
						<span>
							<h1>Loan List</h1>
						</span>
						<span className='items-end self-end justify-between flex gap-4'>
							<Button
								variant={'outline'}
								className='bg-[#3D56A8] text-white'>
								Export
							</Button>
							<Select>
								<SelectTrigger className=''>
									Status:
									<SelectValue placeholder='All' />
								</SelectTrigger>
								<SelectContent position='popper'>
									<SelectItem value={'All'}>All</SelectItem>
									<SelectItem value={'Ongoing'}>Ongoing</SelectItem>
									<SelectItem value={'Paid'}>Paid</SelectItem>
								</SelectContent>
							</Select>
							<Button
								variant={'outline'}
								className='bg-[#3D56A8] text-white'>
								Filter
							</Button>
						</span>
					</div>
					<Table border={4}>
						<TableHeader>
							<TableRow>
								<TableHead className='text-[#3D56A8]'>Loan Number</TableHead>
								<TableHead className='text-[#3D56A8]'>
									Employee Number
								</TableHead>
								<TableHead className='text-[#3D56A8]'>Loan Name</TableHead>
								<TableHead className='text-[#3D56A8]'>Loan Amount</TableHead>
								<TableHead className='text-[#3D56A8]'>Deduction</TableHead>
								<TableHead className='text-[#3D56A8]'>
									Balance Remaining
								</TableHead>
								<TableHead className='text-[#3D56A8]'>Status</TableHead>
								<TableHead className='text-[#3D56A8]'>View</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{loanData.map((loan) => {
								return (
									<TableRow key={loan.id}>
										<TableCell>{loan.loanNumber}</TableCell>
										<TableCell>{loan.employeeName}</TableCell>
										<TableCell>{loan.loanName}</TableCell>
										<TableCell>{loan.loanAmount}</TableCell>
										<TableCell>{loan.deduction}</TableCell>
										<TableCell>{loan.balanceRemaining}</TableCell>
										<TableCell>
											<h4 className='border justify-center flex rounded-4xl'>
												{loan.status}
											</h4>
										</TableCell>
										<TableCell>
											<Link href={`/main/Loan/${loan.id}`}>
												<Image
													width={25}
													height={25}
													src='/iconamoon_eye-light.png'
													alt=''
												/>
											</Link>
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</Card>
			</div>
		</div>
	);
}
