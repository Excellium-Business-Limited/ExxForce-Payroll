import { Button } from '@/components/ui/button';
import { Plus, PlusSquare } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

const page = () => {
	return (
		<div>
			<div className=' flex justify-center items-center mb-8'>
				<div>
					<h3>Employees</h3>
					<span>Manage your Employees</span>
				</div>
				<div>
					<Button variant='outline'>
						{' '}
						<Plus />
						Add Employee
					</Button>
					<Button variant='outline'>Import Employee</Button>
				</div>
			</div>
			<div>
        <Image src={''} alt={''}/>
				<h4>Add employees</h4>
				<p>
					Add employees and contractors you want to pay. Once added, you can
					assign them to pay grade and process their payments in batches
				</p>
				<div>
					<Button variant='outline'>
						{' '}
						<Plus />
						Add Employee
					</Button>
					<Button variant='outline'>Import Employee</Button>
				</div>
			</div>
		</div>
	);
};

export default page;
