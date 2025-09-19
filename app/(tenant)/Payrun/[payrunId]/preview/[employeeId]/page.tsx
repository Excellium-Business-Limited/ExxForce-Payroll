'use client'
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from '@/components/ui/card';
import {
	Sheet,
	SheetContent,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';
import {
	Table,
	TableBody,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { getAccessToken, getTenant } from '@/lib/auth';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { number } from 'zod';

interface Earnings{
	name:string;
	amount: number;
	type: string
}

interface EmployeeData {
	id: number;
	employee_id: string;
	employee_name: string;
	gross_pay: number;
	total_deductions: number;
	net_pay: number;
	payment_date: string;
	status: string;
	earnings:Earnings[]
	deductions: Earnings[]
};




const page = ({ params }: { params: Promise<{ payrunId: string, employeeId: string }> }) => {
	const [currEmployee, setCurrEmployee] = useState<EmployeeData>();
	const { payrunId, employeeId } = React.use(params);
	const [loading, setLoading] = useState(true)
	const router = useRouter()

	const fetchPayslipData = async () =>{

		const tenant = getTenant()
		const token = getAccessToken();
		try {
			setLoading(true)
			const res = await axios.get(
				`https://${tenant}.exxforce.com/tenant/employee/${employeeId}/payrun/${payrunId}`,
				{
					headers:{
						Authorization: `Bearer ${token}`
					}
				}
			);

			console.log(res.data)
			setCurrEmployee(res.data)

		}catch (err:any){
			if(err.status === 401){
				router.push('./login')
			}
		}finally{
			setLoading(false)
		}
	}

	React.useEffect(() => {
		console.log(payrunId, employeeId)
		fetchPayslipData()
	}, [payrunId,employeeId]);

	return (
		<div className='w-fit bg-white my-5 rounded-xl p-5 ml-3'>
			<article className='bg-white'>
				<div className='relative bg-white'>
					<section className='ml-2'>
						<h2>Preview Payslip</h2>
						<p className='font-light text-sm text-muted-foreground w-[470px] m-2.5'>
							These fields are populated with data from your pay run. Preview
							payslips to print or save them.
						</p>
					</section>
					<section className='grid grid-cols-3 grid-rows-3 my-2'>
						<p className='text-sm m-2'>
							Employee Name: {currEmployee?.employee_name || '--'}
						</p>
						<p className='text-sm m-2'>
							Employee ID: {currEmployee?.employee_id || '--'}
						</p>
						<p className='text-sm m-2'>
							Company Address: {currEmployee?.status || '--'}
						</p>
						<p className='text-sm m-2'>
							Payment Date: {currEmployee?.payment_date || '--'}
						</p>
						<p className='text-sm m-2'>
							Status: {currEmployee?.status || '--'}
						</p>
					</section>
					<hr />
					<Card className='my-3 !p-0 h-fit'>
						<CardHeader className='bg-[#f3f4f5]'>Earnings</CardHeader>
						<Table>
							<TableHeader>
								<TableRow className='flex justify-between p-4'>
									<TableHead>DESCRIPTION</TableHead>
									<TableHead>AMOUNT(NGN)</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{currEmployee
									? currEmployee.earnings.map((item, index) => {
											item = item as {
												name: string;
												amount: number;
												type: string;
											};
											return (
												<TableRow
													key={index}
													className='text-muted-foreground flex justify-between p-4'>
													<TableCell>{item.name}</TableCell>
													<TableCell>₦{item.amount}</TableCell>
												</TableRow>
											);
									  })
									: null}
								<TableRow className='bg-[#f3f4f5] flex justify-between w-full h-full p-4'>
									<td className='font-bold'>Earnings</td>
									<td>
										₦
										{currEmployee?.earnings
											.map((e) => e.amount)
											.reduce((acc, curr) => curr + acc)}
									</td>
								</TableRow>
							</TableBody>
						</Table>
					</Card>
					<Card className='my-3 !p-0 h-fit'>
						<CardHeader className='bg-[#f3f4f5] h-fit'>Deductions</CardHeader>

						<Table>
							<TableHeader>
								<TableRow className='flex justify-between p-4'>
									<TableHead>DESCRIPTION</TableHead>
									<TableHead>AMOUNT(NGN)</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{currEmployee
									? currEmployee.deductions.map((item, index) => {
											item = item as {
												name: string;
												amount: number;
												type: string;
											};
											return (
												<TableRow
													key={index}
													className='text-muted-foreground flex justify-between p-4'>
													<TableCell>{item.name}</TableCell>
													<TableCell>₦{item.amount}</TableCell>
												</TableRow>
											);
									  })
									: null}
								<TableRow className='bg-[#f3f4f5] flex justify-between w-full h-full p-4'>
									<td className='font-bold'>Total Deductions</td>
									<td>₦{currEmployee?.total_deductions}</td>
									
								</TableRow>
							</TableBody>
						</Table>
					</Card>
					<Card className='my-3 !p-0 h-[50px] rounded-xl bg-[#f3f4f5]'>
						<CardContent className='flex pt-4 justify-between bg-[#f3f4f5]'>
							<h4 className='font-bold '>Net Pay</h4>
							<h4 className='font-bold'>₦{currEmployee?.net_pay}</h4>
						</CardContent>
					</Card>
					<div>
						<span className=' absolute right-0 mt-8 '>
							Generated Report by Exxforce LTD
						</span>
					</div>
				</div>
			</article>
		</div>
	);
};

export default page;
