import React from 'react';
import {
	Table,
	TableHeader,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
} from '@/components/ui/table';

const custfreq = () => {
	return (
		<div>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className='pr-4 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
							Frequency Name
						</TableHead>
						<TableHead className=' px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Pay Circle</TableHead>
						<TableHead className=' px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Start Date</TableHead>
						<TableHead className=' px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Tax Year</TableHead>
						<TableHead className=' px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Action</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					<TableRow>
						<TableCell>Contract Staffs</TableCell>
						<TableCell>Every 3 Weeks</TableCell>
						<TableCell>01/01/2023</TableCell>
						<TableCell>2023</TableCell>
						<TableCell>
							<div className='flex'>
								<img
									src='/icons/mage_edit.png'
									alt=''
                                    className='pl-3'
								/>
								<img
									src='/icons/delete-icon.png'
									alt=''
                                    className='pl-3'
								/>
							</div>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>Contract Staffs</TableCell>
						<TableCell>Every 3 Weeks</TableCell>
						<TableCell>01/01/2023</TableCell>
						<TableCell>2023</TableCell>
						<TableCell>
							<div className='flex'>
								<img
									src='/icons/mage_edit.png'
									alt=''
                                    className='pl-3'
								/>
								<img
									src='/icons/delete-icon.png'
									alt=''
                                    className='pl-3'
								/>
							</div>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>Contract Staff</TableCell>
						<TableCell>Every 3 Weeks</TableCell>
						<TableCell>01/01/2023</TableCell>
						<TableCell>2023</TableCell>
						<TableCell>
							<div className='flex'>
								<img
									src='/icons/mage_edit.png'
									alt=''
                                    className='pl-3'
								/>
								<img
									src='/icons/delete-icon.png'
									alt=''
                                    className='pl-3'
								/>
							</div>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>Contract Staff</TableCell>
						<TableCell>Quarterly</TableCell>
						<TableCell>01/01/2023</TableCell>
						<TableCell>2023</TableCell>
						<TableCell>
							{' '}
							<div className='flex'>
								<img
									src='/icons/mage_edit.png'
									alt=''
                                    className='pl-3'
								/>
								<img
									src='/icons/delete-icon.png'
									alt=''
                                    className='pl-3'
								/>
							</div>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>Contract Staff</TableCell>
						<TableCell>Annually</TableCell>
						<TableCell>01/01/2023</TableCell>
						<TableCell>2023</TableCell>
						<TableCell>
							<div className='flex'>
								<img
									src='/icons/mage_edit.png'
									alt=''
                                    className='pl-3'
								/>
								<img
									src='/icons/delete-icon.png'
									alt=''
                                    className='pl-3'
								/>
							</div>
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</div>
	);
};

export default custfreq;
