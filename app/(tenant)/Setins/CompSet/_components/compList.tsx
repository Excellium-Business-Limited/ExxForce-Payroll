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
import { redirect } from 'next/navigation';
import React, { useEffect } from 'react';
import { string } from 'zod';

const companyList = () => {
	const [comp, setComp] = React.useState({
		tenant_name: null,
		departments: [] // Initialize id with a default value, e.g., null
	});
	const companies = [
		{ id: 1, compname: 'Excellcium Buisness', status: 'Active' },
		{ id: 2, compname: 'Fiancies Co.', status: 'Inactive' },
		{ id: 3, compname: 'Dom Registration Ltd.', status: 'Active' },
		{ id: 4, compname: 'Excel Counts ', status: 'Inactive' },
		{ id: 5, compname: 'Excellcium Constructions', status: 'Active' },
	];
	useEffect(()=>{
		const tenant = localStorage.getItem('tenant');
		if (!tenant) {
			console.error('Tenant not found in localStorage');
			return;
		}
		
			const baseUrl = `https://${tenant}.exxforce.com`;
			const fetchCompanies = async () => {
			try{
			const res = await fetch(`${baseUrl}/tenant/employee/tenant-info `, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('access_token')}`,
				},
			});
				;
				// if (res.ok) setDepartments(res.data)
				if (!res.ok) throw new Error('Failed to fetch departments');
				const data = await res.json();
				data && console.log(data)
				setComp(data);
				}
				catch (error:any){
					if(error.status === 401){
						//redirect to login
						setTimeout(() => {
							redirect('/login');
						}, 2000);
					}
				}
			}
			fetchCompanies()
	}, [])
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
							className=' rounded-[7px] px-[24px]  bg-blue-600 text-white'>
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
						<TableHead className='text-[#3D56A8] font-normal m-8'>
							Status
						</TableHead>
						<TableHead className='text-[#3D56A8] font-normal'>View</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					<TableRow>
						<TableCell className='font-medium'>{comp.tenant_name}</TableCell>
						<TableCell>
							<p className='rounded-xl m-1.5 w-[50px] h-fit align-middle p-0.5 bg-[#B0E4DD] text-[#008774]'>
								Active
							</p>
						</TableCell>
						<TableCell>
							<img
								src='/iconamoon_eye-light.png'
								alt=''
							/>
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</Card>
	);
};

export default companyList;
