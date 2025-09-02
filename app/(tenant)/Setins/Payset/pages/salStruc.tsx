'use client';
import React, { useEffect, useState } from 'react';
import { useGlobal } from '@/app/Context/page';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Plus } from 'lucide-react';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import AddSs from '../components/addSalaryStruc';
import CrtDed from '../components/createDeduction';
import Loading from '@/components/ui/Loading';

interface SalaryComponent {
	id: string;
	name: string;
	calculation_type: string;
	is_taxable: boolean;
	is_pensionable: boolean;
}

const SalaryStructure = () => {
	const [isEmpty, setIsEmpty] = useState(true);
	const [components, setComponents] = useState<SalaryComponent[]>([]);
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(true);
	const { tenant } = useGlobal();

	useEffect(() => {
		const fetchComponents = async () => {
			try {
				const res = await fetch(
					`http://${tenant}.localhost:8000/tenant/payroll-settings/salary-components`,
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem('access_token')}`,
						},
					}
				);

				if (!res.ok) throw new Error('Failed to load salary components');

				const data = await res.json();
				setComponents(data);
				setIsEmpty(data.length === 0);
			} catch (err: any) {
				console.error(err);
				setError(err.message || 'Something went wrong');
			} finally {
				setIsLoading(false);
			}
		};

		fetchComponents();
	}, [tenant]);

	if (isLoading) {
		return (
			<div className='p-6'>
				<Loading
					message='Loading Salary Components...'
					size='medium'
					variant='spinner'
					overlay={false}
				/>
			</div>
		);
	}

	if (isEmpty) {
		return (
			<div className='p-6 max-w-6xl mx-auto'>
				<div className='flex justify-between items-center mb-6'>
					<h1 className='text-2xl font-semibold'>Salary Structure</h1>
					<Button
						onClick={() => setIsEmpty(false)}
						className='flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700'>
						<Plus className='h-4 w-4' />
						Create Salary Structure
					</Button>
				</div>

				<div className='text-center max-w-2xl mx-auto mt-20'>
					<img
						src='/Salary-img.jpg'
						alt='Salary Structure Illustration'
						className='w-32 h-32 md:w-40 md:h-40 mx-auto mb-8'
					/>
					<h2 className='text-2xl md:text-3xl font-medium mb-4'>
						No Salary Structure Yet
					</h2>
					<p className='text-base text-gray-600 mb-8'>
						Create and manage reusable salary structure templates.
					</p>
					<Button
						onClick={() => setIsEmpty(false)}
						className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto'>
						<Plus className='h-4 w-4' />
						Create Salary Structure
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className='p-6 max-w-6xl mx-auto'>
			<div className='flex justify-between items-center mb-6'>
				<div>
					<h1 className='text-2xl font-semibold mb-2'>Salary Components</h1>
					<p className='text-gray-600'>
						Manage salary components and deductions for your organization.
					</p>
				</div>
				<div className='flex gap-3'>
					<Dialog>
						<DialogTrigger asChild>
							<Button className='flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700'>
								<Plus className='h-4 w-4' />
								Add New Component
							</Button>
						</DialogTrigger>
						<DialogContent className='bg-white w-fit h-[500px] scroll-auto'>
							<DialogTitle hidden>Add Salary Component</DialogTitle>
							<AddSs />
						</DialogContent>
					</Dialog>
					<Dialog>
						<DialogTrigger asChild>
							<Button className='flex items-center gap-2 bg-green-600 text-white hover:bg-green-700'>
								<Plus className='h-4 w-4' />
								Add New Deduction
							</Button>
						</DialogTrigger>
						<DialogContent className='bg-white w-fit h-[500px] scroll-auto	'>
							<DialogTitle>Add Deduction</DialogTitle>
							<CrtDed />
						</DialogContent>
					</Dialog>
				</div>
			</div>

			{error && (
				<Alert className='mb-6 bg-red-50 border-red-200'>
					<AlertDescription className='text-red-800'>{error}</AlertDescription>
				</Alert>
			)}

			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
							Name
						</TableHead>
						<TableHead className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
							Calculation Type
						</TableHead>
						<TableHead className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
							Taxable
						</TableHead>
						<TableHead className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
							Pensionable
						</TableHead>
						<TableHead className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
							Status
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{components.map((component) => (
						<TableRow
							key={component.id}
							className='hover:bg-gray-50'>
							<TableCell className='px-6 py-4 font-medium'>
								{component.name}
							</TableCell>
							<TableCell className='px-6 py-4 capitalize'>
								{component.calculation_type}
							</TableCell>
							<TableCell className='px-6 py-4'>
								<span
									className={`px-2 py-1 rounded text-sm ${
										component.is_taxable
											? 'bg-green-100 text-green-800'
											: 'bg-gray-100 text-gray-800'
									}`}>
									{component.is_taxable ? 'Taxable' : 'Not Taxable'}
								</span>
							</TableCell>
							<TableCell className='px-6 py-4'>
								<span
									className={`px-2 py-1 rounded text-sm ${
										component.is_pensionable
											? 'bg-green-100 text-green-800'
											: 'bg-gray-100 text-gray-800'
									}`}>
									{component.is_pensionable ? 'Pensionable' : 'Not Pensionable'}
								</span>
							</TableCell>
							<TableCell className='px-6 py-4'>
								<span className='px-2 py-1 rounded text-sm bg-green-100 text-green-800'>
									Active
								</span>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
};

export default SalaryStructure;
