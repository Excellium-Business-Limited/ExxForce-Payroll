import Image from 'next/image';
import CompanyForm from './main/Start_Dash/_resources/companyForm';
import LoanDetails from './main/Loan/loanDetails';

export default function Home() {
	return (
		<div className=''>
			<div className='self-center h-[603px] ml-7 gap-4'>
				<LoanDetails />
			</div>
		</div>
	);
}
