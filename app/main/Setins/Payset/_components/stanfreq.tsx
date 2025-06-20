import {
	Table,
	TableHeader,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
} from '@/components/ui/table';
import React from 'react';

const stanfreq = () => {
	return (
		<div>
			<Table>
				<TableHeader>
					<TableRow className='gap-5 text-[#3b54a4]'>
						<TableHead className='pr-4 text-[#3b54a4]'>
							Frequency Name
						</TableHead>
						<TableHead className='px-10 text-[#3b54a4]'>Description</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					<TableRow>
						<TableCell>Weekly</TableCell>
						<TableCell>Payment are made once every week</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>Bi-Weekly</TableCell>
						<TableCell>Payments are made once every 2 weeks</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>Monthly</TableCell>
						<TableCell>Payment are made once every month</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>Quaterly</TableCell>
						<TableCell>Payments are made once every 3 months</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>Annually</TableCell>
						<TableCell>Payments are made once every year</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</div>
	);
};

export default stanfreq;
