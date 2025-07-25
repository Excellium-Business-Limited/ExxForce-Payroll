'use client';
import CompanyForm from '../../../components/companyForm';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
import Link from 'next/link';
import React from 'react';
import { string } from 'zod';

const companyList = () => {
	const [comp, setComp] = React.useState({
		id: null, // Initialize id with a default value, e.g., null
	});
	const companies = [
		{ id: 1, compname: 'Excellcium Buisness', status: 'Active' },
		{ id: 2, compname: 'Fiancies Co.', status: 'Inactive' },
		{ id: 3, compname: 'Dom Registration Ltd.', status: 'Active' },
		{ id: 4, compname: 'Excel Counts ', status: 'Inactive' },
		{ id: 5, compname: 'Excellcium Constructions', status: 'Active' },
	];
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
					<TableRow className='text-[#3D56A8] font-light'>
						<TableHead className='text-[#3D56A8] font-normal'>
							Company Name
						</TableHead>
						<TableHead className='text-[#3D56A8] font-normal'>Status</TableHead>
						<TableHead className='text-[#3D56A8] font-normal'>View</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{companies.map((comp) => {
						return (
							<TableRow key={comp.id}>
								<TableCell>{comp.compname}</TableCell>
								<TableCell className=''>
									<p
										className={`rounded-4xl w-[87px] h-[24px] align-middle px-4 items-center ${
											comp.status === 'Active'
												? 'bg-[#B0E4DD] text-[#008774]'
												: 'bg-[#F5C6C6] text-[#D80000]'
										}`}>
										{comp.status}
									</p>
								</TableCell>
								<TableCell>
									<Link href={`/main/Setins/CompSet/${comp.id}`}>
										{' '}
										<img
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
	);
};

export default companyList;
