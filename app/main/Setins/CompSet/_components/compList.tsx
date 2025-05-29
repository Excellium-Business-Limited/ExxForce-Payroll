import CompanyForm from '../../../components/companyForm';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
	Sheet,
	SheetContent,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Link from 'next/link';
import React from 'react';

const companyList = () => {
	return (
		<Card className='mx-4'>
			<div className='flex justify-between align-middle px-4 py-2'>
				<h4>Company List</h4>
				<Sheet>
					<SheetTrigger
						asChild
						className='self-end'>
						<Button
							variant='outline'
							className=' rounded-[7px] px-[24px]  bg-[#3a56b8] text-white'>
							+ Add Company
						</Button>
					</SheetTrigger>
					<SheetContent className=' bg-white min-w-[500px] p-4 overflow-auto'>
						<SheetTitle className='hidden'></SheetTitle>
						<CompanyForm />
					</SheetContent>
				</Sheet>
			</div>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Company Name</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>View</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					<TableRow
						className='h-[50px]'>
						<TableCell>Excellcium Buisness</TableCell>
						<TableCell className=''>
							<p className='rounded-4xl bg-[#B0E4DD] text-[#008774] w-[87px] h-[24px] align-middle px-4 items-center'>
								Active
							</p>
						</TableCell>
						<TableCell>
							{' '}
							<img
								src='/iconamoon_eye-light.png'
								alt=''
							/>
						</TableCell>
						<TableCell className='hidden'>
							<Link href={`/main/Setins/CompSet/comp1`}></Link>
						</TableCell>
					</TableRow>
					<TableRow className='h-[50px]'>
						<TableCell>Excellcium Buisness</TableCell>
						<TableCell className=''>
							<p className='rounded-4xl bg-[#B0E4DD] text-[#008774] w-[87px] h-[24px] align-middle px-4 items-center'>
								Active
							</p>
						</TableCell>
						<TableCell>
							{' '}
							<img
								src='/iconamoon_eye-light.png'
								alt=''
							/>
						</TableCell>
					</TableRow>
					<TableRow className='h-[50px]'>
						<TableCell>Excellcium Buisness</TableCell>
						<TableCell className=''>
							<p className='rounded-4xl bg-[#B0E4DD] text-[#008774] w-[87px] h-[24px] align-middle px-4 items-center'>
								Active
							</p>
						</TableCell>
						<TableCell>
							{' '}
							<img
								src='/iconamoon_eye-light.png'
								alt=''
							/>
						</TableCell>
					</TableRow>
					<TableRow></TableRow>
				</TableBody>
			</Table>
		</Card>
	);
};

export default companyList;
