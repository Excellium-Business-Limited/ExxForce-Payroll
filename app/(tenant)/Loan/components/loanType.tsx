import { Button } from '@/components/ui/button';
import { Table, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import React, { useEffect } from 'react';

const loanType = () => {

    useEffect(()=>{
        const tenant = localStorage.getItem('tenant');
        const accessToken = localStorage.getItem('access_token');
        const baseURL = `http://${tenant}.localhost:8000`;
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
                console.log(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchLoanTypes();
    }, []);
	return (
		<div>
			<div className='flex flex-row items-center justify-between w-full'>
				<span>
					<h1>Loan Type</h1>
				</span>
				<span className='items-end self-end justify-between flex gap-4'>
					<Button
						variant={'outline'}
						className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2'>
						Add Loan Type
					</Button>
				</span>
			</div>
			<Table border={4}>
				<TableHeader>
					<TableRow>
						<TableHead className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
							Loan Type
						</TableHead>
						<TableHead className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
							Interest Rate
						</TableHead>
						<TableHead className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
							Loan Category
						</TableHead>
						<TableHead className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
							Maximum Duration
						</TableHead>
						<TableHead className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
							Status
						</TableHead>
						<TableHead className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
							Created
						</TableHead>
						<TableHead className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
							Action
						</TableHead>
					</TableRow>
				</TableHeader>
			</Table>
		</div>
	);
};

export default loanType;
