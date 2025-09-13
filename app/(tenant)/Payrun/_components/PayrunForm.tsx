'use client';
import { use, useEffect, useState } from 'react';
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
import { Input } from '@/components/ui/input';
import { useGlobal } from '@/app/Context/context';
// import { formatDate } from 'date-fns';
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
	const {tenant} = useGlobal();

	const [form, setForm] = useState({
		name: '',
		payPeriod: '',
		startDate: '',
		endDate: '',
		paymentDate: '',
	});
	const { name, payPeriod, startDate, endDate, paymentDate } = form;
	const [error, setError] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);

	const [isDialogOpen, setIsDialogOpen] = React.useState(false);
	const handleButtonClick = () => {
		setIsSheetOpen(false);
		setIsPayrun(true); // Close the sheet;
		// Open the dialog
	};
	useEffect(() => {
		console.log('Form state:', form);
	}, [form]);
	const formatDate = (date: string) => {
		if (!date) return '';
		const d = new Date(date);
		const year = d.getFullYear();
		const month = String(d.getMonth() + 1).padStart(2, '0');
		const day = String(d.getDate()).padStart(2, '0');
		return `${year}-${month}-${day}`;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		try {
			const token = localStorage.getItem('access_token');
			// Format dates to YYYY-MM-DD
			const baseURL =`${tenant}.exxforce.com`

			await axios.post(
				`https://${baseURL}/tenant/payrun/create`,
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
			// router.push(`/${tenant}/payroll_payrun`);
		} catch (err: any) {
			console.error('Error creating payrun', err);
			setError(
				Array.isArray(err.response?.data?.detail)
					? err.response.data.detail.map((e: any) => e.msg).join(', ')
					: err.response?.data?.detail || 'Failed to create payrun'
			);
		} finally {
			setIsSubmitting(false);
			window.location.href = `/Payrun`
		}
		
	};
	return (
		<div className={`h screen ${className} flex flex-col`}>
			<h4>Start Payrun</h4>
			<form
				onSubmit={handleSubmit}
				className='flex flex-col'>
				<article className='mb-3'>
					<span className=''>
						<Label
							htmlFor='name'>Name</Label>
							<Input
								type='text'
								id='name'
								value={name}
								onChange={(e) => setForm({ ...form, name: e.target.value })}
							/>
					</span>
					<Label
						htmlFor='payfreq'
						className='mt-3'>
						Choose Pay Frequency
					</Label>
					<Select
						value={payPeriod}
						onValueChange={(value) => setForm({ ...form, payPeriod: value.toUpperCase() })}>
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
								<SelectItem value='BIWEEKLY'>Bi-Weekly</SelectItem>
								<SelectItem value='MONTHLY'>Monthly</SelectItem>
								<SelectItem value='WEEKLY'>Weekly</SelectItem>
								
							</SelectGroup>
						</SelectContent>
					</Select>
				</article>
				<article className='flex gap-6 my-4'>
					<span>
						<DatePicker
							title='First Payrun Date'
							onChange={(date: any) =>
								setForm({ ...form, startDate: formatDate(date) })
							}
						/>
					</span>
					<span>
						<DatePicker
							title='Payment Date'
							onChange={(date: any) =>
								setForm({ ...form, paymentDate: formatDate(date) })
							}
						/>
					</span>
				</article>
				<article className='w-3/6'>
					<DatePicker
						title='End Date'
						onChange={(date: any) =>
							setForm({ ...form, endDate: formatDate(date) })
						}
					/>
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
			</form>
			{/* <Dialog open={isDialogOpen}>
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
			</Dialog> */}
		</div>
	);
};

export default PayrunForm;
