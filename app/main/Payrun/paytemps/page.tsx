import { Card } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table'
import React from 'react'

const page = () => {
  return (
		<div>
			<section>
				<Card></Card>
				<Card></Card>
				<Card></Card>
				<Card></Card>
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
