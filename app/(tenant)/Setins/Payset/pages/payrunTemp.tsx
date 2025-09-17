'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Edit, Info, Plus } from 'lucide-react';
import PayTemDetails from '../components/payTemDetails';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import PayTempForm from '../components/payTempForm';
import axios from 'axios';
import { getAccessToken, getTenant } from '@/lib/auth';

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
	name: string;
	pay_period: string;
	start_day: number;
	payment_rule: string;
	payment_day: number;
	week_start_day: number;
	is_active: boolean;
}

// const PayScheduleDetails = ({
// 	paySchedule,
// 	upcomingPayrolls,
// 	onEdit,
// }: {
// 	paySchedule: PaySchedule;
// 	upcomingPayrolls: PayrollPeriod[];
// 	onEdit: () => void;
// }) => {
// 	// const paySchedule = {
// 	// 	frequency: 'Every month',
// 	// 	workingDays: 'Mon, Tue, Wed, Thu, Fri',
// 	// 	payDay: 'Last day of every month',
// 	// 	firstPayPeriod: 'January 2025',
// 	// };

// 	// const upcomingPayrolls: PayrollPeriod[] = [
// 	// 	{
// 	// 		month: 'February-2025',
// 	// 		payDate: '28 Feb 2025',
// 	// 	},
// 	// 	{
// 	// 		month: 'March-2025',
// 	// 		payDate: '31 Mar 2025',
// 	// 	},
// 	// ];

// 	const handleChangePayDay = () => {
// 		// Handle pay day change logic
// 		console.log('Change pay day clicked');
// 	};

// 	const handleClick = () => {
// 		return (
// 			<Dialog>
// 				<DialogContent></DialogContent>
// 			</Dialog>
// 		);
// 	};

// 	return (
// 		<div className='p-6 max-w-4xl mx-auto'>
// 			<h1 className='text-2xl font-semibold mb-6'>Pay Schedule</h1>

// 			<Alert className='mb-6 bg-orange-50 border-orange-200'>
// 				<Info className='h-4 w-4 text-orange-600' />
// 				<AlertDescription className='text-orange-800'>
// 					<strong>Note:</strong> Pay Schedule cannot be edited once you process
// 					the first pay run.
// 				</AlertDescription>
// 			</Alert>
// 			<Table>
// 				<TableHeader>
// 					<TableRow>
// 						<TableHead>Pay Period</TableHead>
// 						<TableHead>PayDay</TableHead>
// 						<TableHead>Initial</TableHead>
// 					</TableRow>
// 				</TableHeader>
// 				<TableBody>
// 					<Dialog>
// 						<DialogTrigger asChild>
// 							<TableRow
// 								id=''
// 								onClick={handleClick}>
// 								<TableCell>{paySchedule.frequency}</TableCell>
// 								<TableCell>{paySchedule.payDay}</TableCell>
// 								<TableCell>{paySchedule.firstPayPeriod}</TableCell>
// 							</TableRow>
// 						</DialogTrigger>
// 						<DialogContent>
// 							<DialogTitle hidden></DialogTitle>
// 							<PayTemDetails
// 								paySchedule={paySchedule}
// 								upcomingPayrolls={upcomingPayrolls}
// 							/>
// 						</DialogContent>
// 					</Dialog>
// 				</TableBody>
// 			</Table>
// 		</div>
// 	);
// };
const PayScheduleTemplates = () => {
	const [paySchedules, setPaySchedules] = useState<PaySchedule[]>([
		{
			id: '1',
			name: 'Monthly Payroll',
			frequency: 'Monthly',
			workingDays: 'Mon, Tue, Wed, Thu, Fri',
			payDay: 'Last day of every month',
			firstPayPeriod: 'January 2025',
			isActive: true,
		},
		{
			id: '2',
			name: 'Weekly Payroll',
			frequency: 'Weekly',
			workingDays: 'Mon, Tue, Wed, Thu, Fri',
			payDay: 'Every Friday',
			firstPayPeriod: 'Week of Jan 6, 2025',
			isActive: false,
		},
		{
			id: '3',
			name: 'Bi-Weekly Payroll',
			frequency: 'Bi-Weekly',
			workingDays: 'Mon, Tue, Wed, Thu, Fri',
			payDay: 'Every other Friday',
			firstPayPeriod: 'Week of Jan 6, 2025',
			isActive: false,
		},
	]);
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

	const [editingSchedule, setEditingSchedule] = useState<PaySchedule | null>(
		null
	);
	const [showForm, setShowForm] = useState(false);
	const [showDetails, setShowDetails] = useState(false);
	const [selectedSchedule, setSelectedSchedule] = useState<PaySchedule | null>(
		null
	);

	// Generate upcoming payrolls based on frequency
	const generateUpcomingPayrolls = (schedule: PaySchedule): PayrollPeriod[] => {
		const currentDate = new Date();
		const payrolls: PayrollPeriod[] = [];

		if (schedule.frequency === 'Monthly') {
			for (let i = 1; i <= 3; i++) {
				const date = new Date(
					currentDate.getFullYear(),
					currentDate.getMonth() + i,
					0
				);
				payrolls.push({
					month: `${date.toLocaleString('default', {
						month: 'long',
					})}-${date.getFullYear()}`,
					payDate: `${date.getDate()} ${date.toLocaleString('default', {
						month: 'short',
					})} ${date.getFullYear()}`,
				});
			}
		} else if (schedule.frequency === 'Weekly') {
			for (let i = 1; i <= 4; i++) {
				const date = new Date();
				date.setDate(date.getDate() + i * 7);
				payrolls.push({
					month: `Week ${i} - ${date.toLocaleString('default', {
						month: 'long',
					})}`,
					payDate: `${date.getDate()} ${date.toLocaleString('default', {
						month: 'short',
					})} ${date.getFullYear()}`,
				});
			}
		} else if (schedule.frequency === 'Bi-Weekly') {
			for (let i = 1; i <= 3; i++) {
				const date = new Date();
				date.setDate(date.getDate() + i * 14);
				payrolls.push({
					month: `Bi-Week ${i} - ${date.toLocaleString('default', {
						month: 'long',
					})}`,
					payDate: `${date.getDate()} ${date.toLocaleString('default', {
						month: 'short',
					})} ${date.getFullYear()}`,
				});
			}
		}

		return payrolls;
	};

	const handleRowClick = (schedule: PaySchedule) => {
		setSelectedSchedule(schedule);
		setShowDetails(true);
	};

	const handleEdit = (schedule?: PaySchedule) => {
		if (schedule) {
			setEditingSchedule(schedule);
		} else {
			setEditingSchedule(null);
		}
		setShowForm(true);
		setShowDetails(false);
	};

	const handleFormSubmit = (data: PayScheduleData) => {
		if (editingSchedule) {
			// Update existing schedule
			setPaySchedules((prev) =>
				prev.map((schedule) =>
					schedule.id === editingSchedule.id
						? {
								...schedule,
								name: data.name,
								frequency: data.pay_period,
								payDay:
									data.payment_rule === 'LAST_DAY'
										? 'Last day of period'
										: `Day ${data.payment_day}`,
								isActive: data.is_active,
						  }
						: schedule
				)
			);
		} else {
			// Create new schedule
			const newSchedule: PaySchedule = {
				id: Date.now().toString(),
				name: data.name,
				frequency: data.pay_period,
				workingDays: 'Mon, Tue, Wed, Thu, Fri',
				payDay:
					data.payment_rule === 'LAST_DAY'
						? 'Last day of period'
						: `Day ${data.payment_day}`,
				firstPayPeriod: 'January 2025',
				isActive: data.is_active,
			};
			setPaySchedules((prev: any) => [...prev, newSchedule]);
		}

		setShowForm(false);
		setEditingSchedule(null);
	};

	const handleFormCancel = () => {
		setShowForm(false);
		setEditingSchedule(null);
		setShowDetails(selectedSchedule !== null);
	};

	return (
		<div className='p-6 max-w-6xl mx-auto'>
			<div className='flex justify-between items-center mb-6'>
				<h1 className='text-2xl font-semibold'>Pay Schedule Templates</h1>
				<Button
					onClick={() => handleEdit()}
					className='flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700'>
					<Plus className='h-4 w-4' />
					Create New Template
				</Button>
			</div>

			<Alert className='mb-6 bg-orange-50 border-orange-200'>
				<Info className='h-4 w-4 text-orange-600' />
				<AlertDescription className='text-orange-800'>
					<strong>Note:</strong> Pay Schedule cannot be edited once you process
					the first pay run. Templates can be activated/deactivated as needed.
				</AlertDescription>
			</Alert>

			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Template Name</TableHead>
						<TableHead>Pay Frequency</TableHead>
						<TableHead>Pay Day</TableHead>
						<TableHead>First Pay Period</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{paySchedules.map((schedule: PaySchedule ) => (
						<TableRow
							key={schedule.id}
							className='cursor-pointer hover:bg-gray-50'
							onClick={() => handleRowClick(schedule)}>
							<TableCell className='font-medium'>{schedule.name}</TableCell>
							<TableCell>{schedule.frequency}</TableCell>
							<TableCell>{schedule.payDay}</TableCell>
							<TableCell>{schedule.firstPayPeriod}</TableCell>
							<TableCell>
								<span
									className={`px-2 py-1 rounded text-sm ${
										schedule.isActive
											? 'bg-green-100 text-green-800'
											: 'bg-gray-100 text-gray-800'
									}`}>
									{schedule.isActive ? 'Active' : 'Inactive'}
								</span>
							</TableCell>
							<TableCell>
								<Button
									variant='outline'
									size='sm'
									onClick={(e) => {
										e.stopPropagation();
										handleEdit(schedule);
									}}
									className='flex items-center gap-1'>
									<Edit className='h-3 w-3' />
									Edit
								</Button>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>

			{/* Details Dialog */}
			<Dialog
				open={showDetails}
				onOpenChange={setShowDetails}>
				<DialogContent className='max-w-4xl max-h-[80vh] overflow-y-auto'>
					<DialogTitle hidden></DialogTitle>
					{selectedSchedule && (
						<PayTemDetails
							paySchedule={selectedSchedule}
							upcomingPayrolls={generateUpcomingPayrolls(selectedSchedule)}
							onEdit={() => handleEdit(selectedSchedule)}
						/>
					)}
				</DialogContent>
			</Dialog>

			{/* Form Dialog */}
			<Dialog
				open={showForm}
				onOpenChange={setShowForm}>
					<DialogTrigger hidden></DialogTrigger>
				<DialogContent className='max-w-3xl max-h-[80vh] overflow-y-auto bg-white' aria-describedby=''>
					<DialogTitle hidden></DialogTitle>
					<PayTempForm
						initialData={
							editingSchedule
								? {
										name: editingSchedule.name,
										pay_period: editingSchedule.frequency,
										start_day: 1,
										payment_rule: 'LAST_DAY',
										payment_day: 0,
										week_start_day: 1,
										is_active: editingSchedule.isActive,
								  }
								: undefined
						}
						onSubmit={handleFormSubmit}
						onCancel={handleFormCancel}
						isEditing={!!editingSchedule}
					/>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default PayScheduleTemplates;
