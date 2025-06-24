import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React from 'react';
import DatePicker from 'react-datepicker';

const HolidayForm = () => {
	const [select, setSelect] = React.useState<Date | null>(null);
	return (
		<div className='flex flex-col'>
			<form
				action=''
				className='grid'>
				<span className='my-1'>
					<Label
						htmlFor='holiname'
						className='font-mono my-1'>
						Holiday Name
					</Label>
					<Input
						type='text'
						id='holiname'
					/>
				</span>
				<span className='my-1'>
					<Label
						htmlFor='holidate'
						className='font-mono my-1'>
						Date
					</Label>
					<DatePicker
						selected={select}
						id='holidate'
						onChange={(date) => setSelect(date)}
                        className='w-[460px] h-[36px] rounded-lg border border-[#efefef] shadow'
					/>
				</span>
				<span className='my-1'>
					<Label
						htmlFor='type'
						className='font-mono my-1'>
						Holiday Type
					</Label>
					<Input
						id='type'
						list='types'
					/>
					<datalist id='types'>
						<option value={'Full Day'} />
						<option value={'Half Day'} />
						<option value={'Entire Week'} />
					</datalist>
				</span>
				<span className='flex flex-col my-2'>
					<article className='flex gap-1.5 mt-2 mb-0'>
						<Checkbox id='recurring' />
						<Label
							htmlFor='recurring'
							className='my-1 font-mono'>
							Recurring
						</Label>
					</article>
                    <p className='text-muted-foreground'>Repeat this holiday anually</p>
				</span>
			</form>
			<div className='self-end'>
				<DialogClose asChild>
					<Button
						className='m-3 text-muted-foreground'
						variant='outline'>
						{' '}
						Close{' '}
					</Button>
				</DialogClose>
				<Button
					className='m-3 bg-[#3D56A8] text-white '
					variant='outline'
					type='submit'>
					{' '}
					Save{' '}
				</Button>
			</div>
		</div>
	);
};

export default HolidayForm;
