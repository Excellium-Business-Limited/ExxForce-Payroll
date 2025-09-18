import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogTitle,
	DialogTrigger,
	DialogContent,
	DialogClose,
} from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import React, { useEffect } from 'react';
import Add from '../../Setins/CompSet/_components/add';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import axios from 'axios';
import router from 'next/router';
import { set } from 'date-fns';

const loanType = () => {
	const [loanType, setLoanType] = React.useState('');
	const [loanTypes, setLoanTypes] = React.useState<any[]>([]);
	const [isInterest, setIsIntrest] = React.useState(false);
	const [interestMethod, setInterestMethod] = React.useState('');
	const [rate, setRate] = React.useState('');
    useEffect(()=>{
        const tenant = localStorage.getItem('tenant');
        const accessToken = localStorage.getItem('access_token');
        const baseURL = `https://${tenant}.exxforce.com`;
        const fetchLoanTypes = async () => {
            try {
                const response = await fetch(
									`${baseURL}/tenant/loans/loan-types`,
									{
										headers: {
											Authorization: `Bearer ${accessToken}`,
										},
									}
								);
                if (!response.ok) throw new Error('Failed to fetch loan types');
                const data = await response.json();
				console.log(data)
               setLoanTypes(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchLoanTypes();
    }, []);
	const handleAdd = async () => {
		const tenant = localStorage.getItem('tenant');
		const accessToken = localStorage.getItem('access_token');
		const baseURL = `https://${tenant}.exxforce.com`;
		try {
			const response = await axios.post(
				`${baseURL}/tenant/loans/loan-types/create`,
				{
					name: loanType,
					interest_rate: parseInt(rate),
					is_interest_applied: isInterest,
					interest_method: interestMethod,
				},
				{
					headers: { Authorization: `Bearer ${accessToken}` },
				}
			);

			alert('Loan created!');
			router.push(`/Loan`);
		} catch (err: any) {
			console.error(err);
			const details = err.response?.data?.detail;
			// alert(`Error: ${details}`);
			console.log(err.response)
			console.log(details)
		}
	};

	return (
		<div className='m-4'>
			<div className='flex flex-row items-center justify-between w-full m-2'>
				<span>
					<h1>Loan Type</h1>
				</span>
				<span className='items-end self-end justify-between flex gap-2'>
					<Dialog>
						<DialogTrigger asChild>
							<Button
								variant={'outline'}
								className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2'>
								Add Loan Type
							</Button>
						</DialogTrigger>
						<DialogContent className='w-[400px] bg-white'>
							<DialogTitle className='text-lg font-semibold'>
								Add Loan Type
							</DialogTitle>
							<form action=''>
								<span className='mt-2 ml-2'>
									<Label htmlFor='name' className='m-1.5'>Loan Type Name</Label>
									<Input
										type='text'
										id='name'
										onChange={e => setLoanType(e.target.value)}
										required
									/>
								</span>
								<span className='m-2'> 
									<Label htmlFor='interestRate' className='m-1.5'>Interest Rate</Label>
									<Input
										type='number'
										id='interestRate'
										onChange={e => setRate(e.target.value)}
										disabled={!isInterest}
										required
									/>
								</span>
								<span className='flex items-center gap-2 m-2'>
									<Checkbox onClick={()=> setIsIntrest(!isInterest)}  disabled={interestMethod !== 'simple interest'}/>
									<Label htmlFor='interestRate'>Interest Applied</Label>
								</span>
								<span className='flex items-center m-2'>
									<Label htmlFor='interestMethod' className='m-1.5'>Interest Type</Label>
									<Select
										value={interestMethod}
										onValueChange={setInterestMethod}
									>
										<SelectTrigger>
											<SelectValue placeholder='Select Value'/>
										</SelectTrigger>
										<SelectContent>
											<SelectItem value='simple interest'>Simple Interest</SelectItem>
											<SelectItem value='reducing'>Reducing Balance</SelectItem>
										</SelectContent>
									</Select>
								</span>
							</form>
							<span className='self-end gap-4 flex justify-between'>
								<Button
									className='rounded-lg p-2 text-[#3D56A8] w-[80px] border h-[38px] bg-white'
									asChild>
									<DialogClose>Close</DialogClose>
								</Button>
								<Button
									onClick={handleAdd}
									type='submit'
									className='bg-[#3D56A8] text-white'>
									Submit
								</Button>
							</span>
						</DialogContent>
					</Dialog>
				</span>
			</div>
			<Table border={4} className='w-full'>
				<TableHeader>
					<TableRow>
						<TableHead className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
							Loan Type
						</TableHead>
						<TableHead className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
							Interest Rate</TableHead>
						
					</TableRow>
				</TableHeader>
				<TableBody>
					{loanTypes.map((loanType: any) => {
						return(
							<TableRow key={loanType.id}>
								<TableCell className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
									{loanType.name}
								</TableCell>
								<TableCell className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
									{loanType.interest_rate ? `${loanType.interest_rate}%` : '--'}
								</TableCell>
								
							</TableRow>
						)
					})}
				</TableBody>
			</Table>
		</div>
	);
};

export default loanType;
