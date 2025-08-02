'use client';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import axios from 'axios';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Label } from '@radix-ui/react-label';
import React from 'react';
import DatePicker from '../../components/datepicker';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
const PayrunForm = ({
	className,
	setIsSheetOpen,
	setIsPayrun,
}: {
	className?: string;
	setIsSheetOpen: React.Dispatch<React.SetStateAction<boolean>>;
	setIsPayrun: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
	 const pathname = usePathname();
		const router = useRouter();
		const segments = pathname.split('/');
		const tenant = segments[1];

		const [name, setName] = useState('');
		const [payPeriod, setPayPeriod] = useState('MONTHLY');
		const [startDate, setStartDate] = useState('');
		const [endDate, setEndDate] = useState('');
		const [paymentDate, setPaymentDate] = useState('');
		const [error, setError] = useState('');
		const [isSubmitting, setIsSubmitting] = useState(false);

	const [isDialogOpen, setIsDialogOpen] = React.useState(false);
	const handleButtonClick = () => {
		setIsSheetOpen(false);
		setIsPayrun(true); // Close the sheet;
		// Open the dialog
	};
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		try {
			const token = localStorage.getItem('access_token');
			await axios.post(
				`http://${tenant}.localhost:8000/tenant/payrun/create`,
				{
					name,
					pay_period: payPeriod,
					start_date: startDate,
					end_date: endDate,
					payment_date: paymentDate,
				},
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			alert('PayRun created successfully!');
			router.push(`/${tenant}/payroll_payrun`);
		} catch (err: any) {
			console.error('Error creating payrun', err);
			setError(
				Array.isArray(err.response?.data?.detail)
					? err.response.data.detail.map((e: any) => e.msg).join(', ')
					: err.response?.data?.detail || 'Failed to create payrun'
			);
		} finally {
			setIsSubmitting(false);
		}
	};
	return (
		<div className={`h screen ${className} flex flex-col`}>
			<h4>Start Payrun</h4>
			<form
				action=''
				className='flex flex-col'>
				<article className='mb-3'>
					<Label
						htmlFor='payfreq'
						className='mt-3'>
						Choose Pay Frequency
					</Label>
					<Select>
						<SelectTrigger
							id='payfreq'
							className='my-3 w-full'>
							<SelectValue
								className=''
								placeholder='Select Frequency'
							/>
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectItem value='bi'>Bi-Weekly</SelectItem>
								<SelectItem value='mont'>Monthly</SelectItem>
								<SelectItem value='quat'>Quaterly</SelectItem>
								<SelectItem value='ann'>Annually</SelectItem>
								<SelectItem value='week'>Every Week</SelectItem>
								<SelectItem value='3week'>Every 3 Weeks</SelectItem>
								<SelectItem value='3mont'>Every 3 Months</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
				</article>
				<article className='flex gap-6 my-4'>
					<span>
						<DatePicker title='First Payrun Date' />
					</span>
					<span>
						<DatePicker title='Payment Date' />
					</span>
				</article>
				<article className='w-3/6'>
					<DatePicker title='Tax Year' />
				</article>
				<span className='w-full border-[#f8edda] bg-[#faf3e6] rounded-md flex gap-1.5 p-3 my-5'>
					<img
						src='/icons/proicons_info.png'
						alt=''
					/>
					<h4 className='text-[10px]/6 '>
						Heads up! Once you approve your first payroll, you cannot chage the
						payroll frequency
					</h4>
				</span>
			</form>
			<section className=' fixed bottom-0 flex self-end align-bottom content-end'>
				<DialogClose asChild>
					<Button
						className='m-3 text-muted-foreground'
						variant='outline'>
						{' '}
						Close{' '}
					</Button>
				</DialogClose>
				<Button
					className='m-3 bg-[#3D56A8] text-white '
					variant='outline'
					type='submit'
					onClick={() => setIsDialogOpen(true)}>
					{' '}
					Save{' '}
				</Button>
			</section>
			<Dialog open={isDialogOpen}>
				<DialogContent className='bg-white flex flex-col content-center items-center px-5 z-[5000]'>
					<img
						src='/icons/check2.png'
						alt=''
					/>
					<DialogTitle>
						<p>Payrun Created</p>
					</DialogTitle>
					<p>This setup has also been saved as a template for future runs.</p>
					<span className='flex gap-4'>
						<DialogClose asChild>
							<Button
								className='bg-[#d9d9d9]'
								onClick={handleButtonClick}>
								Close
							</Button>
						</DialogClose>
						<Button
							asChild
							className='bg-[#3d56a8] text-white'>
							<Link href='./Payrun/paytemps'>View Templates</Link>
						</Button>
					</span>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default PayrunForm;
