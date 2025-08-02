import { Card } from '@/components/ui/card';
import Dialogs from '@/app/(tenant)/components/dialog';
import DeleteMod from '@/app/(tenant)/components/deleteMod';
import React from 'react';
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';

const paygrade = () => {
	const data = [
		{
			Level: 'Entry Level',
			Salary: '₦200,000',
			Components: ['Basic Salary', 'Allowance', 'Bonuses'],
			Description: 'Entry level position with basic responsibilities',
			Employees: '10',
		},
		{
			Level: 'Entry Level',
			Salary: '₦200,000',
			Components: ['Basic Salary', 'Allowance', 'Bonuses'],
			Description: 'Entry level position with basic responsibilities',
			Employees: '12',
		},
		{
			Level: 'Entry Level',
			Salary: '₦200,000',
			Components: ['Basic Salary', 'Allowance', 'Bonuses'],
			Description: 'Entry level position with basic responsibilities',
			Employees: '10',
		},
		{
			Level: 'Entry Level',
			Salary: '₦200,000',
			Components: ['Basic Salary', 'Allowance', 'Bonuses'],
			Description: 'Entry level position with basic responsibilities',
			Employees: '5',
		},
		{
			Level: 'Entry Level',
			Salary: '₦200,000',
			Components: ['Basic Salary', 'Allowance', 'Bonuses'],
			Description: 'Entry level position with basic responsibilities',
			Employees: '20',
		},
		{
			Level: 'Entry Level',
			Salary: '₦200,000',
			Components: ['Basic Salary', 'Allowance', 'Bonuses'],
			Description: 'Entry level position with basic responsibilities',
			Employees: '40',
		},
	];
	return (
		<div>
			<section className='grid grid-cols-3 grid-rows-3'>
				{data.map((item, index) => {
					item = {
						Level: item.Level,
						Salary: item.Salary,
						Components: item.Components,
						Description: item.Description,
						Employees: item.Employees,
					};
					return (
						<Card
							key={index}
							className='m-2 p-4 '>
							<div className='flex justify-between'>
								<h3 className='text-lg font-semibold'>{item.Level}</h3>
								<span className='grid-cols-2 grid-rows-1 grid'>
									<img
										src='/icons/mage_edit.png'
										alt='#'
									/>
									<Dialog>
										<DialogTrigger className=''>
											<img
												src='/icons/delete-icon.png'
												alt=''
											/>
										</DialogTrigger>
										<DialogContent className='bg-white'>
											<DialogTitle className='hidden '></DialogTitle>
											<DeleteMod emp={item.Employees} />
										</DialogContent>
									</Dialog>
								</span>
							</div>
							<section className='grid-rows-2'>
								<h5 className='text-sm text-gray-600'>Salary</h5>
								<p className='text-muted-foreground'>{item.Salary}</p>
							</section>
							<span className='text-sm flex flex-col'>
								<h5 className='text-sm text-gray-600'>Components: </h5>
								<span className='flex flex-row mt-2'>
									{item.Components.map((comp, index) => {
										return (
											<p
												key={index}
												className='bg-[#dee7f6] text-[#3D56A8] rounded-lg mx-2 px-2 text-xs'>
												{comp}
											</p>
										);
									})}
								</span>
							</span>
							<section className='grid-rows-2'>
								<h5 className='text-sm text-gray-600'>Description:</h5>
								<p>{item.Description}</p>
							</section>
							<h5 className='text-sm text-gray-600 flex'>
								<img
									src='/icons/employee-line.png'
									alt=''
								/>
								{`${item.Employees} employees`}
							</h5>
						</Card>
					);
				})}
			</section>
		</div>
	);
};

export default paygrade;
