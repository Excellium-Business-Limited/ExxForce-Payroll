import { Card } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table'
import React from 'react'

const page = () => {
  return (
		<div>
			<section className='grid grid-rows-1 grid-cols-4 gap-4 m-3'>
				<Card>
					<img
						src=''
						alt=''
					/>
					<h5>Total Employees </h5>
					<hr />
					<span>
						<h4>50</h4>
						<p>90% of employees are regular staff</p>
					</span>
				</Card>
				<Card>
					<img
						src=''
						alt=''
					/>
					<h5>Total Net Salary</h5>
					<hr />
					<span>
						<h4>₦3,500,000.00</h4>
						<p>Total payroll after deductions</p>
					</span>
				</Card>
				<Card>
					<img
						src=''
						alt=''
					/>
					<h5>Total Deduction</h5>
					<hr />
					<span>
						<h4>₦3,500,000.00</h4>
						<p>Deduction from all employees in this run</p>
					</span>
				</Card>
				<Card>
					<img
						src=''
						alt=''
					/>
					<h5>Prorated Salaries</h5>
					<hr />
					<span>
						<h4>15 Employees</h4>
						<p>30% of employees had prorated pay</p>
					</span>
				</Card>
			</section>
			<section>
				<Card>
					<Table>
						<TableHeader>
							<TableRow>
								<TableCell>EMPLOYEE NAME </TableCell>
								<TableCell>PAY GRADE</TableCell>
								<TableCell>GROSS SALARY</TableCell>
								<TableCell> DEDUCTIONS </TableCell>
								<TableCell>BENEFITS</TableCell>
								<TableCell>DAYS WORKED</TableCell>
								<TableCell>NET SALARY</TableCell>
								<TableCell>STATUS</TableCell>
								<TableCell>MORE</TableCell>
							</TableRow>
						</TableHeader>
						<TableBody>
							<TableRow>
								<TableCell></TableCell>
								<TableCell></TableCell>
								<TableCell></TableCell>
								<TableCell></TableCell>
								<TableCell></TableCell>
								<TableCell></TableCell>
								<TableCell></TableCell>
								<TableCell></TableCell>
								<TableCell></TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</Card>
			</section>
		</div>
	);
}

export default page
