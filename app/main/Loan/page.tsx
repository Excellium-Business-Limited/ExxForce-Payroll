import { Button } from '@/components/ui/button';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
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

export default function Home() {
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
			</div>
		</div>
	);
}
