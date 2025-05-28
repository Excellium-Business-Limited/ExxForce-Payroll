import Image from 'next/image';
import CompanyForm from './main/components/companyForm';
import LoanDetails from './main/Dashboard/_components/loanDetails';

export default function Home() {
	return (
		<div className=''>
			<div className='self-center h-[603px] ml-7 gap-4'>
				<LoanDetails />
			</div>
		</div>
	);
}
