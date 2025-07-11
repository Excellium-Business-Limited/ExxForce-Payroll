import Image from 'next/image';
import CompanyForm from './main/components/companyForm';
import LoanDetails from './main/Loan/components/loanDetails';
import img from './main/resources/logo.svg';
import imagen from '../public/Payroll Dashboard.png';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function Home() {
	//bg-gradient-to-bl from-[#111621] to-[#1e2b4d]
	return (
		<div className=' bg-center ml-0 bg-white'>
			<nav className="flex bg-cover flex-row items-center bg-transparent sticky px-4 py-3 justify-between w-full text-white  border-b-0  bg-[url('/bg.png')]">
				<div className='flex self-start flex-row items-center gap-2'>
					<Image
						src={img}
						alt='Company Logo'
						// width={50}
						// height={50}
					/>
				</div>
				<div className='flex self-start flex-row items-center gap-8'>
					<article>Features</article>
					<article>Pricing</article>
					<article>How It Works</article>
					<article>Resources</article>
					<article>Contact</article>
				</div>
				<div className='flex self-end flex-row items-center gap-4'>
					<a
						href='/Authorization/login'
						className='hover:underline'>
						Login
					</a>
					<Button
						variant={'outline'}
						className='bg-[#3d56a8] text-white'>
						<a
							href='/Authorization/signup'
							className=' hover:underline'>
							Get Started
						</a>
					</Button>
				</div>
			</nav>
			{/* <Image
				src={imagen}
				alt='Company Logo'
				// width={50}
				// height={50}
			/> */}
			<div className="bg-[url('/bg.png')] bg-cover  justify-center flex flex-col text-white items-center bg-center">
				<span className='w-[760px] pt-14 self-center text-6xl text-center font-semibold text-white'>
					Effortless Payroll for Every Pay Circle
				</span>
				<p className='w-[760px] pt-4 self-center text-lg text-center font-normal'>
					Streamline your payroll process with automation, real-time
					calculations, and powerful reporting tools that save your HR team time
					and reduce errors.
				</p>
				<section className='flex items-center justify-center gap-4 mt-10'>
					<Button
						variant={'default'}
						className='bg-[#3d56a8] text-white mt-6'>
						Get Started
					</Button>
					<Button
						variant={'default'}
						className='bg-[#282c3c] text-white mt-6'>
						Resquest a Demo
					</Button>
				</section>
				<section className='flex items-center justify-center mt-14'>
					<Image
						src={imagen}
						alt='Company Logo'
						// width={50}
						// height={50}
					/>
				</section>
			</div>
			<section>
				<div className='flex flex-col items-center justify-center gap-4 mt-10 bg-white/80 p-8 rounded-lg'>
					<h1 className='text-[#3d56a8] font-semibold text-4xl'>
						Features That Simplify Payroll
					</h1>
					<p className='self-center max-w-2xl text-center text-[#707478]'>
						Everything you need to manage payroll efficiently, accurately, and
						<br /> with less effort.
					</p>
				</div>
				<article className='grid grid-cols-3 grid-rows-2 gap-4 p-8'>
					<Card className='p-4'>
						<span className=' bg-[#e9eff9] w-fit rounded-xl p-1.5 '>
							<img
								src='/dashboard/date-time.png'
								alt=''
							/>
						</span>
						<div>
							<h4>Automated Pay</h4>
							<p>
								Runs Create monthly, bi-weekly, or custom pay schedules that run
								automatically.
							</p>
						</div>
					</Card>
					<Card className='p-4'>
						<span className=' bg-[#e9eff9] w-fit rounded-xl p-1.5 '>
							<img
								src='/dashboard/money-16.png'
								alt=''
							/>
						</span>
						<div>
							<h4>Earnings Management</h4>
							<p>
								Simplified interface for editing and managing employee earnings.
							</p>
						</div>
					</Card>
					<Card className='p-4'>
						<span className=' bg-[#e9eff9] w-fit rounded-xl p-1.5 '>
							<img
								src='/dashboard/calculator.png'
								alt=''
							/>
						</span>
						<div>
							<h4>Real time Calculation</h4>
							<p>
								Instant previews of payroll totals, taxes, and deductions as you
								work.
							</p>
						</div>
					</Card>
					<Card className='p-4'>
						<span className=' bg-[#e9eff9] w-fit rounded-xl p-1.5 '>
							<img
								src='/dashboard/employee-line.png'
								alt=''
							/>
						</span>
						<div>
							<h4>Employee Salary</h4>
							<p>
								Breakdown View & edit earnings, deductions, benefits for
								complete transparency.
							</p>
						</div>
					</Card>
					<Card className='p-4'>
						<span className=' bg-[#e9eff9] w-fit rounded-xl p-1.5 '>
							<img
								src='/dashboard/list.png'
								alt=''
							/>
						</span>
						<div>
							<h4>Payslips Generation</h4>
							<p>
								Auto-generate detailed payslips for each cycle with complete
								breakdowns.
							</p>
						</div>
					</Card>
					<Card className='p-4'>
						<span className=' bg-[#e9eff9] w-fit rounded-xl p-1.5 '>
							<img
								src='/dashboard/good-arrow.png'
								alt=''
							/>
						</span>
						<div>
							<h4>Approval Workflow</h4>
							<p>
								Submit payroll for manager or finance team review with
								customizable approval chains and audit trails.
							</p>
						</div>
					</Card>
				</article>
			</section>
		</div>
	);
}
