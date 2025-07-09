import Image from 'next/image';
import CompanyForm from './main/components/companyForm';
import LoanDetails from './main/Loan/components/loanDetails';
import img from './main/resources/logo.svg';
import imagen from '../public/home1.png'

export default function Home() {
	return (
		<div className='bg-cover bg-center ml-0'>
			<div
				className='self-center h-[603px] ml-7 gap-4 '
				style={{
					backgroundImage: `url(${imagen.src})`,
				}}>
				<nav className='flex flex-row items-center justify-between w-full bg-[#111623] text-white'>
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
							className='text-blue-500 hover:underline'>
							Login
						</a>
						<a
							href='/Authorization/signup'
							className='text-blue-500 hover:underline'>
							Get Started
						</a>
					</div>
				</nav>
			</div>
		</div>
	);
}
