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
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogTitle,
} from '@/components/ui/dialog';
import React from 'react';
import Add from './add';

const DesList = () => {
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
								+ Add Designation
							</Button>
						</DialogTrigger>
						<DialogContent className='min-w-[500px] p-4 overflow-auto bg-white'>
							<DialogTitle className='hidden'></DialogTitle>
							<Add title='Designation' />
						</DialogContent>
					</Dialog>
				</span>
			</section>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Designation</TableHead>
						<TableHead>Total Employees</TableHead>
						<TableHead>Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					<TableRow>
						<TableCell>Software Developer</TableCell>
						<TableCell></TableCell>
						<TableCell></TableCell>
					</TableRow>
					<TableRow>
						<TableCell>Technical Writer</TableCell>
						<TableCell></TableCell>
						<TableCell></TableCell>
					</TableRow>
					<TableRow>
						<TableCell>Product Designer</TableCell>
						<TableCell></TableCell>
						<TableCell></TableCell>
					</TableRow>
					<TableRow>
						<TableCell>Legal Officer</TableCell>
						<TableCell></TableCell>
						<TableCell></TableCell>
					</TableRow>
					<TableRow>
						<TableCell>Project Manager</TableCell>
						<TableCell></TableCell>
						<TableCell></TableCell>
					</TableRow>
					<TableRow>
						<TableCell>Cloud Engineer</TableCell>
						<TableCell></TableCell>
						<TableCell></TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</div>
	);
};

export default DesList;
