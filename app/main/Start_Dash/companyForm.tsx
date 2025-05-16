import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React from 'react';

const companyForm = () => {
	return (
		<div>
			<Card>
				<form>
					<span>
						<Label htmlFor='Industry'>Industry</Label>
						<Input
							type='text'
							id='Industry'
							required
						/>
					</span>
					<div className='grid grid-cols-2 gap-4'>
						<span>
							<Label htmlFor='CompanyEmail'>Company Email</Label>
							<Input
								type='text'
								id='CompanyEmail'
								required
							/>
						</span>
						<span>
							<Label htmlFor='Companyphone'>Company phone number</Label>
							<Input
								type='text'
								id='Companyphone'
								required
							/>
						</span>
					</div>

					<span>
						<Label htmlFor='Address1'> Address1</Label>
						<Input
							type='text'
							id='Address1'
							required
						/>
					</span>
					<span>
						<Label htmlFor='Address1'> Address1</Label>
						<Input
							type='text'
							id='Address1'
							required
						/>
					</span>
					<span></span>
				</form>
			</Card>
		</div>
	);
};

export default companyForm;
