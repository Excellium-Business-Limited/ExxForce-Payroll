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
import LoanDetails from '../Dashboard/_components/loanDetails';
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogTitle,
} from '@/components/ui/dialog';
import UpdateRepay from '../components/updateRepay';
const items = [
	{ id: '1', name: 'Item One' },
	{ id: '2', name: 'Item Two' },
	{ id: '3', name: 'Item Three' },
];

export default function Home() {
	const [isloan, setisLoan] = React.useState(false);

	if (!isloan) {
		return (
			<div className='h-[680px] '>
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
						<Button
							variant={'outline'}
							className='text-[#3D56A8]'>
							Import
						</Button>
					</span>
				</div>
				<div className='text-center max-w-2xl mx-auto mt-[120px]'>
					<img
						src='/empty.jpg'
						alt='Team Illustration'
						className='w-32 h-32 md:w-40 md:h-40 mx-auto mb-8'
					/>
					<h2 className='text-2xl md:text-3xl  mb-4'>
						No Loans Yet</h2>
					<pre className='text-base md:text-lg text-muted-foreground mb-8'>
						You haven’t added any employee loans.Manage staff<br/>
						 loans easily by adding new loan records or importing<br/> 
						 from a file.
					</pre>
					<div className='flex flex-col sm:flex-row gap-4 justify-center'>
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
						<Button
							variant={'outline'}
							className='text-[#3D56A8]'>
							Import
						</Button>
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
						<Button
							variant={'outline'}
							className='text-[#3D56A8]'>
							Import
						</Button>
					</span>
				</div>
				<div className='mt-12'>
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
								<TableHead>Loan Number</TableHead>
								<TableHead>Employee Number</TableHead>
								<TableHead>Loan Name</TableHead>
								<TableHead>Loan Amount</TableHead>
								<TableHead>Deduction</TableHead>
								<TableHead>Balance Remaining</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>View</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							<TableRow id='1'>
								<TableCell>45623-05</TableCell>
								<TableCell>Ifunanya Johnson</TableCell>
								<TableCell>Car Loan</TableCell>
								<TableCell>₦600,000.00</TableCell>
								<TableCell>₦60,000.00</TableCell>
								<TableCell>₦540,000.00</TableCell>
								<TableCell>
									<h4 className='border justify-center flex rounded-4xl'>
										Ongoing
									</h4>
								</TableCell>
								<TableCell>
									<Link href={`/main/Loan/1`}>
										<Image
											width={25}
											height={25}
											src='/iconamoon_eye-light.png'
											alt=''
										/>
									</Link>
								</TableCell>
							</TableRow>

							<TableRow>
								<TableCell>45623-05</TableCell>
								<TableCell>Ifunanya Johnson</TableCell>
								<TableCell>Car Loan</TableCell>
								<TableCell>₦600,000.00</TableCell>
								<TableCell>₦60,000.00</TableCell>
								<TableCell>₦540,000.00</TableCell>
								<TableCell>
									<h4 className='border justify-center flex rounded-4xl'>
										Ongoing
									</h4>
								</TableCell>
								<TableCell>
									<Image
										width={25}
										height={25}
										src='/iconamoon_eye-light.png'
										alt=''
									/>
								</TableCell>
							</TableRow>

							<TableRow>
								<TableCell>45623-05</TableCell>
								<TableCell>Ifunanya Johnson</TableCell>
								<TableCell>Car Loan</TableCell>
								<TableCell>₦600,000.00</TableCell>
								<TableCell>₦60,000.00</TableCell>
								<TableCell>₦540,000.00</TableCell>
								<TableCell>
									<h4 className='border justify-center flex rounded-4xl'>
										Ongoing
									</h4>
								</TableCell>
								<TableCell>
									<Image
										width={25}
										height={25}
										src='/iconamoon_eye-light.png'
										alt=''
									/>
								</TableCell>
							</TableRow>

							<TableRow>
								<TableCell>45623-05</TableCell>
								<TableCell>Ifunanya Johnson</TableCell>
								<TableCell>Car Loan</TableCell>
								<TableCell>₦600,000.00</TableCell>
								<TableCell>₦60,000.00</TableCell>
								<TableCell>₦540,000.00</TableCell>
								<TableCell>
									<h4 className='border justify-center flex rounded-4xl'>
										Ongoing
									</h4>
								</TableCell>
								<TableCell>
									<Image
										width={25}
										height={25}
										src='/iconamoon_eye-light.png'
										alt=''
									/>
								</TableCell>
							</TableRow>

							<TableRow>
								<TableCell>45623-05</TableCell>
								<TableCell>Ifunanya Johnson</TableCell>
								<TableCell>Car Loan</TableCell>
								<TableCell>₦600,000.00</TableCell>
								<TableCell>₦60,000.00</TableCell>
								<TableCell>₦540,000.00</TableCell>
								<TableCell>
									<h4 className='border justify-center flex rounded-4xl'>
										Ongoing
									</h4>
								</TableCell>
								<TableCell>
									<Image
										width={25}
										height={25}
										src='/iconamoon_eye-light.png'
										alt=''
									/>
								</TableCell>
							</TableRow>

							<TableRow>
								<TableCell>45623-05</TableCell>
								<TableCell>Ifunanya Johnson</TableCell>
								<TableCell>Car Loan</TableCell>
								<TableCell>₦600,000.00</TableCell>
								<TableCell>₦60,000.00</TableCell>
								<TableCell>₦540,000.00</TableCell>
								<TableCell>
									<h4 className='border justify-center flex rounded-4xl'>
										Ongoing
									</h4>
								</TableCell>
								<TableCell>
									<Image
										width={25}
										height={25}
										src='/iconamoon_eye-light.png'
										alt=''
									/>
								</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</div>
				<ul>
					{items.map((item) => (
						<li key={item.id}>
							<Link href={`/main/Loan/${item.id}`}>{item.name}</Link>
						</li>
					))}
				</ul>

				<LoanDetails />
			</div>
		</div>
	);
}
