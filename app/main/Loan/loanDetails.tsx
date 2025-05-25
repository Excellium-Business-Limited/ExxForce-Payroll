import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Image from 'next/image';
import React from 'react';

export default function LoanDetails() {
	return (
		<div className=''>
			<div className='self-center w-[688px] h-[603px] ml-7 gap-4'>
				<div>
					<pre className='flex flex-row items-center'>
						<h1 className='text-muted-foreground'>Loan</h1> /{' '}
						<h1>Loan Details</h1>
					</pre>
					{/* <Button className='flex self-end bg-[#3D56A8]'></Button> */}
					<div>
						<Card></Card>
						<Card></Card>
					</div>
					<div>
						<Table>
							<TableHeader>
								<div>
									<Progress /> 2/6 months
								</div>
								<div>
									<span>
										<h5 className='text-muted-foreground'>Amount Paid</h5>
										<p></p>
									</span>
									<span>
										<h5 className='text-muted-foreground'>Balance Remaining</h5>
										<p></p>
									</span>
									<span>
										<h5 className='text-muted-foreground'>Next Deduction</h5>
										<p></p>
									</span>
								</div>
							</TableHeader>
							<TableHeader>
								<TableRow>
									<TableHead>Month</TableHead>
									<TableHead>Amount Deducted</TableHead>
									<TableHead>Balance Remaining</TableHead>
									<TableHead>Date of Deduction</TableHead>
									<TableHead>Status</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								<TableRow>
									<TableCell></TableCell>
									<TableCell></TableCell>
									<TableCell></TableCell>
									<TableCell></TableCell>
									<TableCell></TableCell>
								</TableRow>
								<TableRow>
									<TableCell></TableCell>
									<TableCell></TableCell>
									<TableCell></TableCell>
									<TableCell></TableCell>
									<TableCell></TableCell>
								</TableRow>
								<TableRow>
									<TableCell></TableCell>
									<TableCell></TableCell>
									<TableCell></TableCell>
									<TableCell></TableCell>
									<TableCell></TableCell>
								</TableRow>
								<TableRow>
									<TableCell></TableCell>
									<TableCell></TableCell>
									<TableCell></TableCell>
									<TableCell></TableCell>
									<TableCell></TableCell>
								</TableRow>
								<TableRow>
									<TableCell></TableCell>
									<TableCell></TableCell>
									<TableCell></TableCell>
									<TableCell></TableCell>
									<TableCell></TableCell>
								</TableRow>
								<TableRow>
									<TableCell></TableCell>
									<TableCell></TableCell>
									<TableCell></TableCell>
									<TableCell></TableCell>
									<TableCell></TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</div>
				</div>
			</div>
		</div>
	);
}
