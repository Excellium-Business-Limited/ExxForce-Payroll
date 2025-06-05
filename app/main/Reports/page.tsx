'use client'
import { Button } from '@/components/ui/button';
import {
	Sheet, SheetTrigger,
	SheetContent,
	SheetTitle,
} from '@/components/ui/sheet';
import Dialogs from '../components/dialog';
import Import from '../components/Import';
import React from 'react'
import LoanForm from '../Loan/loanForm';
import { Card } from '@/components/ui/card';

const page = () => {
  const [report, setReport] = React.useState(true)
  if(!report){
    return (
			<div className='h-[680px] m-7 gap-4 '>
				<div className='flex flex-row items-center justify-between w-full'>
					<span>
						<h1>Reports</h1>
						<p className='text-xs'>
							Access and analyze detailed reports for your <br /> payroll data.
						</p>
					</span>
				</div>
				<div className='text-center max-w-2xl mx-auto mt-[120px]'>
					<img
						src='/notdata.png'
						alt='Team Illustration'
						className='w-32 h-32 md:w-40 md:h-40 mx-auto mb-8'
					/>
					<h2 className='text-2xl md:text-3xl  mb-4'>No Reports Yet</h2>
					<pre className='text-base text-muted-foreground mb-8'>
						Run payroll to start generating reports for employee
            <br /> payments,
						taxes, and more
					</pre>
				</div>
			</div>
		);
  }
  return (
		<div className='w-full'>
			<div className='self-center h-[603px] ml-4 gap-4'>
				<div className='flex flex-row items-center justify-between w-full'>
					<span className='my-3'>
						<h1>Reports</h1>
						<p className='text-xs'>
							Access and analyze detailed reports for your <br /> payroll data.
						</p>
					</span>
				</div>
				<Card className='bg-white m-4 h-[780px] p-4'>
					<div className='grid grid-cols-3 grid-rows-2 gap-3 content-between justify-between'>
						<Card>
              <article>
                <h3>
              Payroll Summary
                </h3>
              </article>
              </Card>
						<Card>
              <article>
                <h3>
              Tax Summary
                </h3>
              </article>
              </Card>
						<Card><article>
              <h3>
              Payroll Journal Summary
                </h3>
               </article>
              </Card>
						<Card>
              <article>
                <h3>
                  Activity Logs/ Audit Trail
                  </h3>
                </article>
                </Card>
						<Card>
              <article>
                <h3>
                  Loan & Repayment Report
                  </h3>
                </article>
                  </Card>
						<Card><article>
              <h3>
                Employees' Pay Summary
                </h3>
              </article>
                </Card>
					</div>
				</Card>
			</div>
		</div>
	);
}

export default page
