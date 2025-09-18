import { Button } from '@/components/ui/button';
import { getAccessToken, getTenant } from '@/lib/auth';
import axios from 'axios';
import { Edit } from 'lucide-react';
import React, { useEffect } from 'react';

interface PayrollPeriod {
	month: string;
	payDate: string;
}

interface PaySchedule {
	id: string;
	name: string;
	frequency: string;
	workingDays: string;
	payDay: string;
	firstPayPeriod: string;
	isActive: boolean;
}

interface PayScheduleData {
	created_at: string;
	id: number;
	updated_at: string;
	test: string;
	name: string;
	pay_period: string;
	start_day: number;
	payment_rule: string;
	payment_day: number;
	week_start_day: number;
	is_active: boolean;

}

// Pay Template Details Component
const PayTemDetails = ({
	paySchedule,
	upcomingPayrolls,
	onEdit,
}: {
	paySchedule: PayScheduleData[];
	upcomingPayrolls: PayrollPeriod[];
	onEdit: () => void;
}) => {
	const fetchTemplates = async () =>{
		const tenant = getTenant()
		const token = getAccessToken()
		try{
			const res = await axios.get(
				`https://${tenant}.exxforce.com/tenant/payrun/list-templates`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			); 
			console.log(res.data)
		}catch(err:any){
			console.log(err)
		}
	}
	useEffect(()=>{
		fetchTemplates()
	},[])
	return (
		<div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
			<div className='lg:col-span-2'>
				{/* <div className='flex justify-between items-center mb-6'>
					<h2 className='text-lg font-medium'>
						{paySchedule.name} Template Details
					</h2>
					<Button
						variant='outline'
						size='sm'
						onClick={onEdit}
						className='flex items-center gap-2'>
						<Edit className='h-4 w-4' />
						Edit Template
					</Button>
				</div> */}
				

				{paySchedule.map((schedule) => {
					return (
						<div className='space-y-6' key={schedule.id}>
							<div className='flex justify-between items-center py-3 border-b border-gray-200'>
								<span className='text-gray-600 font-medium'>Pay Frequency</span>
								<span className='text-gray-900'>{schedule.pay_period}</span>
							</div>

							<div className='flex justify-between items-center py-3 border-b border-gray-200'>
								<span className='text-gray-600 font-medium'>Rule</span>
								<span className='text-gray-900'>
									{schedule.payment_rule}
								</span>
							</div>

							<div className='flex justify-between items-center py-3 border-b border-gray-200'>
								<span className='text-gray-600 font-medium'>Pay Day</span>
								<span className='text-gray-900'>{schedule.payment_day}</span>
							</div>

							<div className='flex justify-between items-center py-3 border-b border-gray-200'>
								<span className='text-gray-600 font-medium'>Start Day</span>
								<span className='text-gray-900'>{schedule.start_day}</span>
							</div>

							<div className='flex justify-between items-center py-3'>
								<span className='text-gray-600 font-medium'>Status</span>
								<span
									className={`px-2 py-1 rounded text-sm ${
										schedule.is_active
											? 'bg-green-100 text-green-800'
											: 'bg-gray-100 text-gray-800'
									}`}>
									{schedule.is_active ? 'Active' : 'Inactive'}
								</span>
							</div>
						</div>
					);
				})}
			</div>

			<div className='lg:col-span-1'>
				<h3 className='text-lg font-medium mb-4'>Upcoming Payrolls</h3>

				<div className='space-y-4'>
					{upcomingPayrolls.map((payroll, index) => (
						<div
							key={index}
							className='bg-gray-50 p-4 rounded-lg'>
							<div className='flex items-center gap-2 mb-2'>
								<div className='w-2 h-2 bg-gray-400 rounded-full'></div>
								<h4 className='font-medium text-gray-900'>{payroll.month}</h4>
							</div>
							<p className='text-sm text-gray-600 ml-4'>
								Pay Date: {payroll.payDate}
							</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};
export default PayTemDetails
