import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import React from 'react';

const page = () => {
	return (
		<div className='h-[680px]'>
			<Tabs className='self-center'>
				<TabsList className='no-design'>
					<TabsTrigger value='salaryst'>Salary Structure</TabsTrigger>
					<TabsTrigger value='payG'>Pay Grade</TabsTrigger>
					<TabsTrigger value='workSch'>Work Schedule</TabsTrigger>
					<TabsTrigger value='payComp'>Pay Component</TabsTrigger>
					<TabsTrigger value='payFreq'>Pay Frequency</TabsTrigger>
				</TabsList>
				<TabsContent value='salaryst'></TabsContent>
				<TabsContent value='payG'></TabsContent>
				<TabsContent value='workSch'></TabsContent>
				<TabsContent value='payComp'></TabsContent>
				<TabsContent value='payFreq'></TabsContent>
			</Tabs>
		</div>
	);
};

export default page;
