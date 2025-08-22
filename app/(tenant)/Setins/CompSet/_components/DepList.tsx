'use client';
import LoanForm from '@/app/(tenant)/Loan/loanForm';
import { Button } from '@/components/ui/button';
import {
	Sheet,
	SheetContent,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';
import {
	Table,
	TableHeader,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
} from '@/components/ui/table';
import Dialogs from '@/app/(tenant)/components/dialog';
import React, { use, useEffect } from 'react';
import Add from './add';
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';

interface Department {
	id: number;	
	name: string;
	totalEmployees: number;
	}

const DepList = () => {
	const [departments, setDepartments] = React.useState<[]>([]);
	useEffect(() => {
		const tenant = localStorage.getItem('tenant');
		if (!tenant) {
			console.error('Tenant not found in localStorage');
			return;
		}
		const baseUrl = `http://${tenant}.localhost:8000`;
		const fetchDepartments = async () => {
			try {
				const res = await fetch(`${baseUrl}/tenant/employee/departments`, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem('access_token')}`,
					},
				});
				;
				// if (res.ok) setDepartments(res.data)
				if (!res.ok) throw new Error('Failed to fetch departments');
				const data = await res.json();
				setDepartments(data);
				
			} catch (error) {
				console.error(error);
			}
		};
		fetchDepartments();
	}, []);
	setTimeout(() => {
		console.log(departments);
		
	}, 3000);
	return (
		<div>
			<section className='flex justify-between align-middle px-4 py-2'>
				<h4>Designation</h4>
				<span className='items-end self-end justify-between flex gap-4'>
					<Dialog>
						<DialogTrigger asChild>
							<Button
								variant={'outline'}
								className='bg-[#3D56A8] text-white'>
								+ Add Department
							</Button>
						</DialogTrigger>
						<DialogContent className='min-w-[500px] p-4 overflow-auto bg-white'>
							<DialogTitle className='hidden'></DialogTitle>
							<Add title='Department' />
						</DialogContent>
					</Dialog>
				</span>
			</section>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Department</TableHead>
						<TableHead>Total Employees</TableHead>
						<TableHead>Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{departments.map((department:Department) => {
						return (
							<TableRow key={department.id}>
								<TableCell className='font-medium'>
									{department.name}
								</TableCell>
								<TableCell>{department.totalEmployees}</TableCell>
								<TableCell>
								</TableCell>
							</TableRow>
						)
					})}
				</TableBody>
			</Table>
		</div>
	);
};

export default DepList;
