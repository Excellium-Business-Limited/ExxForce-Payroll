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
						<TableHead className='pr-4 text-[#3b54a4]'>
							Frequency Name
						</TableHead>
						<TableHead className=' text-[#3b54a4]'>Pay Circle</TableHead>
						<TableHead className=' text-[#3b54a4]'>Start Date</TableHead>
						<TableHead className=' text-[#3b54a4]'>Tax Year</TableHead>
						<TableHead className=' text-[#3b54a4]'>Action</TableHead>
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
