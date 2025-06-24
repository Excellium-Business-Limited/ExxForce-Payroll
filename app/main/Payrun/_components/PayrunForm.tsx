import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Label } from '@radix-ui/react-label';
import React from 'react';
import DatePicker from 'react-datepicker';
const PayrunForm = ({className}:{className? : string}) => {
	return (
		<div className={`h screen ${className}`}>
			<form action=''>
				<article>
					<Label htmlFor='payfreq'>Choose Pay Frequency</Label>
					<Select>
                        <SelectTrigger>
                            <SelectValue/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value='bi'>Bi-Weekly</SelectItem>
                                <SelectItem value='mont'>Monthly</SelectItem>
                                <SelectItem value='quat'>Quaterly</SelectItem>
                                <SelectItem value='ann'>Annually</SelectItem>
                                <SelectItem value='week'>Every Week</SelectItem>
                                <SelectItem value='3week'>Every 3 Weeks</SelectItem>
                                <SelectItem value='3mont'>Every 3 Months</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
				</article>
				<article className='flex'>
					<span>
                        <Label htmlFor='first'>First Payrun Date</Label>
                        <DatePicker id='first' />
                    </span>
					<span>
                        <Label htmlFor='payme'>Payment Date</Label>
                        <DatePicker/>
                    </span>
				</article>
				<article>
                    <Label htmlFor='taxyr'>Tax Year</Label>
                    <DatePicker />
                </article>
			</form>
		</div>
	);
};

export default PayrunForm;
