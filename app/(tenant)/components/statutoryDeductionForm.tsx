'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectTrigger,
	SelectValue,
	SelectItem,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

export default function StatutoryBenefitsForm() {
	const [statutoryEnabled, setStatutoryEnabled] = useState(true);
	const [benefitsEnabled, setBenefitsEnabled] = useState(true);
	const [deductions, setDeductions] = useState({
		paye: false,
		pension: false,
		nhsif: false,
		nhf: false,
	});
	const [benefits, setBenefits] = useState({
		nhis: false,
		housing: false,
	});

	const toggleDeduction = (key: string) => {
		setDeductions({ ...deductions, [key]: !deductions[key as keyof typeof deductions] });
	};

	const toggleBenefit = (key: string) => {
		setBenefits({ ...benefits, [key]: !benefits[key as keyof typeof benefits] });
	};

	return (
		<div className='ml-auto h-full w-full max-w-2xl bg-white p-6 overflow-y-auto'>
			<div className='mb-8'>
				<h1 className='text-2xl font-bold'>Statutory & Benefits</h1>
				<p className='text-sm text-muted-foreground'>Configure employee deductions and benefits</p>
			</div>

			<form className='space-y-8'>
				<div className='space-y-4'>
					<h2 className='text-lg font-semibold'>Statutory Deduction</h2>
					<div className='bg-gray-100 p-4 rounded-lg space-y-4'>
						<div className='flex items-center justify-between'>
							<span className='font-medium'>Enable Statutory Deduction</span>
							<Switch checked={statutoryEnabled} onCheckedChange={setStatutoryEnabled} />
						</div>
						<div className='grid grid-cols-3 text-sm font-medium text-gray-600 border-b pb-2'>
							<span>Deduction</span>
							<span>Apply</span>
							<span>Amount (NGN)</span>
						</div>
						{[
							{ key: 'paye', label: 'PAYE (Tax)' },
							{ key: 'pension', label: 'Pension' },
							{ key: 'nhsif', label: 'NHSIF' },
							{ key: 'nhf', label: 'NHF' },
						].map((item) => (
							<div key={item.key} className='grid grid-cols-3 items-center py-2 border-t'>
								<span>{item.label}</span>
								<input type='checkbox' checked={deductions[item.key as keyof typeof deductions]} onChange={() => toggleDeduction(item.key)} disabled={!statutoryEnabled} />
								<span>₦5,000.00</span>
							</div>
						))}
					</div>
				</div>

				<div className='space-y-4'>
					<h2 className='text-lg font-semibold'>Benefits</h2>
					<div className='bg-gray-100 p-4 rounded-lg space-y-4'>
						<div className='flex items-center justify-between'>
							<span className='font-medium'>Enable Benefits</span>
							<Switch checked={benefitsEnabled} onCheckedChange={setBenefitsEnabled} />
						</div>
						<div className='grid grid-cols-3 text-sm font-medium text-gray-600 border-b pb-2'>
							<span>Benefits</span>
							<span>Apply</span>
							<span>Amount (NGN)</span>
						</div>
						{[
							{ key: 'nhis', label: 'NHIS' },
							{ key: 'housing', label: 'Housing Allowance' },
						].map((item) => (
							<div key={item.key} className='grid grid-cols-3 items-center py-2 border-t'>
								<span>{item.label}</span>
								<input type='checkbox' checked={benefits[item.key as keyof typeof benefits]} onChange={() => toggleBenefit(item.key)} disabled={!benefitsEnabled} />
								<span>₦5,000.00</span>
							</div>
						))}
					</div>
				</div>

				<div className='flex justify-end gap-4 pt-4'>
					<Button variant='outline' type='button' className='text-muted-foreground'>
						Close
					</Button>
					<Button type='submit' className='bg-[#3D56A8] hover:bg-[#2E4299]'>
						Save & Continue
					</Button>
				</div>
			</form>
		</div>
	);
}
