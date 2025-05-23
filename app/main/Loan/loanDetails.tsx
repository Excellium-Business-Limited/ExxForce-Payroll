import { Button } from '@/components/ui/button';
import Image from 'next/image';
import React from 'react';

export default function LoanDetails() {
    return (
			<div className=''>
				<div className='self-center w-[688px] h-[603px] ml-7 gap-4'>
					<div>
						<pre className='flex flex-row items-center'>
							<h1 className='text-muted-foreground'>Loan</h1> /{' '}
							<h1>Loan Details</h1>
						</pre>
						<Button className='flex self-end bg-[#3D56A8]'></Button>
					</div>
				</div>
			</div>
		);
}
