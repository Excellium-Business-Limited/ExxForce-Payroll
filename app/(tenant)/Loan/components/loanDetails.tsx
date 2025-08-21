import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { DialogContent, DialogTitle } from '@radix-ui/react-dialog';
import { MoreHorizontalIcon } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import UpdateRepay from '../../components/updateRepay';
import Dialogs from '../../components/dialog';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectValue,
} from '@/components/ui/select';
import { SelectTrigger } from '@radix-ui/react-select';
import { getAccessToken, getTenant } from '@/lib/auth';
import axios from 'axios';
import { useGlobal } from '@/app/Context/page';
import { se } from 'date-fns/locale';
interface Employee {
	id?: number;
	employee_id: string;
	first_name: string;
	last_name: string;
	email: string;
	phone_number: string;
	gender: 'MALE' | 'FEMALE';
	date_of_birth: string;
	address: string;
	employment_type: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERN';
	start_date: string;
	tax_start_date: string;
	job_title: string;
	department_name: string;
	pay_grade_name: string;
	custom_salary: number;
	bank_name: string;
	account_number: string;
	account_name: string;
	pay_frequency: 'MONTHLY' | 'WEEKLY' | 'BIWEEKLY';
	is_paye_applicable: boolean;
	is_pension_applicable: boolean;
	is_nhf_applicable: boolean;
	is_nsitf_applicable: boolean;
}

export default function LoanDetails({ item, id }: { item: any, id: string }) {
	const details = {
		employeeDetails: {
			fullName: 'John Smith',
			employeeId: 'EMP-1233',
			emailAddress: 'johnsmith@example.com',
			monthlySalary: '600,000.00',
			jobPosition: 'Software Engineer',
		},
		loan: {
			loanSummary: {
				status: 'Ongoing',
				loanAmount: '600,000.00',
				startDate: 'May 25th 2025',
				duration: '6 Months',
				monthlyDeductions: '60,000.00',
				endDate: 'October 29, 2025',
			},
			paymentDetails: {
				amountPaid: '600,000',
				balanceRemaining: '600,000',
				nextDeduction: 'July 2nd, 2025',
			},
			previousPayments: [
				{
					month: 'May',
					amountDeducted: '₦60,000.00',
					balanceRemaining: '₦540,000.00',
					dateOfDeduction: 'May 29, 2025',
					status: 'Paid',
				},
				{
					month: 'June',
					amountDeducted: '₦60,000.00',
					balanceRemaining: '₦480,000.00',
					dateOfDeduction: 'June 29, 2025',
					status: 'Paid',
				},
				{
					month: 'July',
					amountDeducted: '₦60,000.00',
					balanceRemaining: '₦420,000.00',
					dateOfDeduction: 'July 29, 2025',
					status: 'Paid',
				},
			],
		},
	};
	const { employeeDetails, loan } = details;
	const { fullName, employeeId, emailAddress, monthlySalary, jobPosition } =
		employeeDetails;
	const { loanSummary, paymentDetails, previousPayments } = loan;
	const progressValue =
		(previousPayments.length /
			(loanSummary.duration ? parseInt(loanSummary.duration) : 1)) *
		100;

	const [employees, setEmployees] = React.useState<Employee[]>();

	const [error, setError] = React.useState<string | null>(null);
	const [currEmp, setCurrEmp] = React.useState<Employee | undefined>();
	const { globalState } = useGlobal();
	const fetchEmployees = async (): Promise<void> => {
		const tenant = getTenant();
		try {
			console.log(tenant);
			const response = await axios.get<Employee[]>(
				`http://${tenant}.localhost:8000/tenant/employee/list`,
				{
					headers: {
						Authorization: `Bearer ${getAccessToken()}`,
					},
				}
			);

			console.log('Raw employee data from API:', response.data);

			setEmployees(response.data);
			setError(null);
			
		} catch (err) {
			console.error('Error fetching employees:', err);
		}
	};

	React.useEffect(() => {
		fetchEmployees();
		
	},[]);
	React.useEffect(() => {
		if (employees) {
			console.log('Updated employees:', employees);
			setCurrEmp(employees.find((emp) => `${emp.first_name} ${emp.last_name}` ===item.employee_name ));
			console.log('Current Employee:', currEmp);
		}

	}, [employees, currEmp]);

	return (
		<div className='w-full'>
			<div className=' h-[603px] w-full p-3'>
				<div className='flex flex-row items-center justify-between w-full'>
					<span className='flex flex-row items-center'>
						<h1 className='text-muted-foreground'>Loan</h1> /{' '}
						<h1>Loan Details</h1>
					</span>
					<div className='items-center self-end justify-between flex gap-4'>
						<Dialogs
							title={'Update Repayment'}
							className='bg-[#3D56A8] text-white'>
							<pre className='rounded-md p-2'>
								<UpdateRepay id={id} />
							</pre>
						</Dialogs>
						<Select>
							<SelectTrigger className=''>
								<SelectValue></SelectValue>
								<MoreHorizontalIcon className='border-2 rounded-4xl border-black h-[30px] w-[30px]' />
							</SelectTrigger>
							<SelectContent position='popper'>
								<SelectItem value='edit'>Edit Loan</SelectItem>
								<SelectItem value='pause'>Pause Loan</SelectItem>
								<SelectItem value='reschedule'>Reschedule Loan</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
				<div className='flex justify-between gap-4 my-4'>
					<Card className='border grid-cols-1 grid-rows-3 p-4 w-1/2 mb-4 h-[256px]'>
						<div className='grid gap-9 grid-cols-2 mb-4'>
							<span>
								<h6 className='text-xs text-muted-foreground'>Full Name</h6>
								<h6>
									{currEmp?.first_name} {currEmp?.last_name}
								</h6>
							</span>
							<span>
								<h6 className='text-xs text-muted-foreground'>Employee ID</h6>
								<h6>{currEmp?.employee_id}</h6>
							</span>
						</div>
						<div className='grid gap-9 grid-cols-2 mb-4'>
							<span>
								<h6 className='text-xs text-muted-foreground'>Email Address</h6>
								<h6>{currEmp?.email}</h6>
							</span>
							<span>
								<h6 className='text-xs text-muted-foreground'>
									Monthly Salary
								</h6>
								<h6>
									₦
									{currEmp?.custom_salary.toLocaleString(
										'en-NG', {
											maximumFractionDigits: 2,
											useGrouping: true,
										}
									)}
								</h6>
							</span>
						</div>
						<span>
							<h6 className='text-xs text-muted-foreground'>Job Position</h6>
							<h6>{currEmp?.job_title}</h6>
						</span>
					</Card>
					<Card className='border w-1/2 h-[256px] p-4'>
						<div className='px-2 flex justify-between'>
							<h6 className='text-md'>Loan Summary</h6>
							<p className='rounded-[10px] bg-[#e9eff9] w-[69px] h-[24px] text-xs p-1 border self-end'>
								{/* {item.status.charAt(0).toUpperCase() + item.status.slice(1)} */}
								{item.status}
							</p>
						</div>
						<div className='grid grid-rows-2 grid-cols-3 gap-2.5 m-2.5'>
							<span className='my-2'>
								<div className='flex gap-1.5'>
									<Image
										src={'/icons/solar_card-outline.png'}
										alt={''}
										width={20}
										height={20}
									/>
									<h6 className='text-xs text-muted-foreground'>Loan Amount</h6>
								</div>
								<h4>₦{item.amount}</h4>
							</span>
							<span className='my-2'>
								<div className='flex gap-1.5'>
									<Image
										src={'/icons/CalendarDots.png'}
										alt={''}
										width={20}
										height={20}
									/>
									<h6 className='text-xs text-muted-foreground'>Start Date</h6>
								</div>
								<h4>{item.start_date}</h4>
							</span>
							<span className='my-2'>
								<div className='flex gap-1.5'>
									<Image
										src={'/icons/formkit_time.png'}
										alt={''}
										width={20}
										height={20}
									/>
									<h6 className='text-xs text-muted-foreground'>Duration</h6>
								</div>
								<h4>{`${item.repayment_months} Months`}</h4>
							</span>
							<span className='my-2'>
								<div className='flex gap-1.5'>
									<Image
										src={'/icons/iconoir_percentage.png'}
										alt={''}
										width={20}
										height={20}
									/>
									<h6 className='text-xs text-muted-foreground'>
										Monthly Deductions
									</h6>
								</div>
								<h4>₦{item.monthly_deduction}</h4>
							</span>
							<span className='my-2'>
								<div className='flex gap-1.5'>
									<Image
										src={'/icons/Vector.png'}
										alt={''}
										width={20}
										height={20}
									/>
									<h6 className='text-xs text-muted-foreground'>End Date</h6>
								</div>
								<h4>{item.completed_at ? item.completed_at : 'Loan Ongoing'}</h4>
							</span>
						</div>
					</Card>
				</div>
				<div>
					<dl className='flex justify-between w-full my-6'>
						<div className='flex'>
							{(() => {
								const amount = Number(item.amount) || 0;
								const balance = Number(item.balance) || 0;
								const progressValue = amount > 0 ? ((balance - amount) / balance) * 100 : 0;
								return (
									<>
										<Progress
											value={progressValue}
											className='flex self-center w-[350px]'
										/>
										<p className='text-xs self-center ml-2'>{`${progressValue.toFixed(2)} Percent`}</p>
									</>
								);
							})()}
						</div>
						<div className='grid grid-cols-3 gap-6 justify-between divide-x-4 divide-[#E8F1FF]'>
							<span>
								<h5 className='text-muted-foreground'>Amount Paid</h5>
								<p>₦{item.amount_paid ? item.amount_paid : 0}</p>
							</span>
							<span>
								<h5 className='text-muted-foreground'>Balance Remaining</h5>
								<p>₦{item.balance}</p>
							</span>
							<span>
								<h5 className='text-muted-foreground'>Next Deduction</h5>
								<p>{item.paymentDetails.nextDeduction}</p>
							</span>
						</div>
					</dl>

					<Table>
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
							{item.previousPayments.map((payment : { month: string; amountDeducted: string; balanceRemaining: string; dateOfDeduction: string; status: string; }, index : number) => (
								<TableRow key={index}>
									<TableCell>{payment.month}</TableCell>
									<TableCell>{payment.amountDeducted}</TableCell>
									<TableCell>{payment.balanceRemaining}</TableCell>
									<TableCell>{payment.dateOfDeduction}</TableCell>
									<TableCell>
										<h6 className='text-xs border border-[#0ac743] px-2 py-1 rounded-lg bg-[#c2eccd] text-[#0ac743] w-fit'>
											{payment.status}
										</h6>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</div>
		</div>
	);
}
