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
import { set } from 'date-fns';

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
	const [payTemplates, setPayTemplates] = useState<PayScheduleData[]>([]);
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
				setPayTemplates(res.data)
			}catch(err:any){
				console.log(err)
			}
		}
		useEffect(()=>{
			fetchTemplates()
		},[])

	const [editingSchedule, setEditingSchedule] = useState<PayScheduleData | null>(
		null
	);
	const [showForm, setShowForm] = useState(false);
	const [showDetails, setShowDetails] = useState(false);
	const [selectedSchedule, setSelectedSchedule] = useState<PayScheduleData | null>(
		null
	);

	// Generate upcoming payrolls based on frequency

	const handleRowClick = (schedule: PayScheduleData) => {
		setSelectedSchedule(schedule);
		setShowDetails(true);
	};

	const handleEdit = (schedule?: PayScheduleData) => {
		if (schedule) {
			setEditingSchedule(schedule);
		} else {
			setEditingSchedule(null);
		}
		setShowForm(true);
		setShowDetails(false);
	};

	const handleFormSubmit = (data: PayScheduleData) => {
		// if (editingSchedule) {
		// 	// Update existing schedule
		// 	setPaySchedules((prev) =>
		// 		prev.map((schedule) =>
		// 			schedule.id === editingSchedule.id
		// 				? {
		// 						...schedule,
		// 						name: data.name,
		// 						frequency: data.pay_period,
		// 						payDay:
		// 							data.payment_rule === 'LAST_DAY'
		// 								? 'Last day of period'
		// 								: `Day ${data.payment_day}`,
		// 						isActive: data.is_active,
		// 				  }
		// 				: schedule
		// 		)
		// 	);
		// } else {
		// 	// Create new schedule
		// 	const newSchedule: PaySchedule = {
		// 		id: Date.now().toString(),
		// 		name: data.name,
		// 		frequency: data.pay_period,
		// 		workingDays: 'Mon, Tue, Wed, Thu, Fri',
		// 		payDay:
		// 			data.payment_rule === 'LAST_DAY'
		// 				? 'Last day of period'
		// 				: `Day ${data.payment_day}`,
		// 		firstPayPeriod: 'January 2025',
		// 		isActive: data.is_active,
		// 	};
		// 	setPaySchedules((prev: any) => [...prev, newSchedule]);
		// }

		// setShowForm(false);
		// setEditingSchedule(null);
	};

	const handleFormCancel = () => {
		setShowForm(false);
		setEditingSchedule(null);
		setShowDetails(selectedSchedule !== null);
	};

	return (
		<div className='p-6 max-w-6xl mx-auto'>

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
						<TableHead>Updated at</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{payTemplates.map((schedule) => (
						<TableRow
							key={schedule.id}
							className='cursor-pointer hover:bg-gray-50'
							onClick={() => handleRowClick(schedule)}>
							<TableCell className='font-medium'>{schedule.name}</TableCell>
							<TableCell>{schedule.pay_period}</TableCell>
							<TableCell>{schedule.payment_day}</TableCell>
							<TableCell>{schedule.updated_at}</TableCell>
							<TableCell>
								<span
									className={`px-2 py-1 rounded text-sm ${
										schedule.is_active
											? 'bg-green-100 text-green-800'
											: 'bg-gray-100 text-gray-800'
									}`}>
									{schedule.is_active ? 'Active' : 'Inactive'}
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
				<DialogContent className='max-w-4xl max-h-[80vh] overflow-y-auto bg-white' aria-describedby=''>
					<DialogTitle hidden></DialogTitle>
					{selectedSchedule && (
						<PayTemDetails
							paySchedule={selectedSchedule}
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
										pay_period: editingSchedule.pay_period,
										start_day: editingSchedule.start_day,
										payment_rule: editingSchedule.payment_rule,
										payment_day: editingSchedule.payment_day,
										week_start_day: editingSchedule.week_start_day,
										is_active: editingSchedule.is_active,
								  }
								: undefined
						}
						onSubmit={handleFormSubmit}
						isEditing={!!editingSchedule}
					/>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default PayScheduleTemplates;
