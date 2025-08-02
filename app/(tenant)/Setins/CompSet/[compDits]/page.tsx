'use client';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

export default function CompanyDetails({
	params,
}: {
	params: Promise<{ compDits: string }>;
}): React.JSX.Element {
	const { compDits } = React.use(params);

	const companies = [
		{ id: 1, compname: 'Excellcium Buisness', status: 'Active' },
		{ id: 2, compname: 'Fiancies Co.', status: 'Inactive' },
		{ id: 3, compname: 'Dom Registration Ltd.', status: 'Active' },
		{ id: 4, compname: 'Excel Counts ', status: 'Inactive' },
		{ id: 5, compname: 'Excellcium Constructions', status: 'Active' },
	];
	const [loading, setLoading] = useState(true);
	const [comp, setComp] = useState<{
		id: number;
		compname: string;
		status: string;
	} | null>(null);
	useEffect(() => {
		if (compDits) {
			const foundCompany = companies.find(
				(item) => String(item.id) === compDits
			);
			setComp(foundCompany || null);
			setLoading(false);
			console.log(compDits);
		}
	}, [compDits]);
	if (loading) {
		return <div>Loading...</div>;
	}

	if (!comp) {
		return <div>Company Details not found.</div>;
	}

	return (
		<div className='h-full'>
			<div className='mx-4'>
				<h1>Company Settings</h1>
				<h5 className='text-sm'>
					Manage your organization settings and preferences
				</h5>
				<div className=' bg-white rounded-lg h-[433px] m-5'>
					<Tabs
						className='self-center'
						defaultValue='Company'>
						<TabsList className='no-design'>
							<div className='m-2'>
								<TabsTrigger
									value='Company'
									className='data-[state=active]:text-[#3d56a8] data-[state=active]:underline text-muted-foreground'>
									Company
								</TabsTrigger>
								<TabsTrigger
									value='Department'
									className='data-[state=active]:text-[#3D56A8] data-[state=active]:underline text-muted-foreground'
									disabled>
									Department
								</TabsTrigger>
							</div>
							<hr className=' h-[2px]' />
						</TabsList>
					</Tabs>
					<div>
						<section className='my-3 px-4'>
							<h3>Company Logo</h3>
							<figure>
								<p>upload file</p>
								<figcaption>Company logo will be used on payslips</figcaption>
							</figure>
						</section>
						<hr className=' h-[2px]' />
						<div key={comp.id}>
							<section className='flex justify-between my-3 px-4'>
								<article className='grid grid-cols-2 '>
									<b className='my-2'>Company Details</b>
									<h1 className='my-2'>{comp.compname}</h1>
									<p className='my-2'>Status: {comp.status}</p>
								</article>
								<span className='items-center justify-center align-middle'>
								<img
									src='/icons/mage_edit.png'
									alt=''
									className='self-end align-middle items-center justify-self-center'
									/>
									</span>
							</section>
							<div className='grid grid-cols-3 grid-rows-3 my-3 px-4'>
								<article>
									<h6>Industry</h6>
									<p></p>
								</article>
								<article>
									<h6>Company email</h6>
								</article>
								<article>
									<h6>Phone number</h6>
								</article>
								<article>
									<h6>Address Line</h6>
								</article>
								<article>
									<h6>City</h6>
								</article>
								<article>
									<h6>State</h6>
								</article>
								<article>
									<h6>Country</h6>
								</article>
								<article>
									<h6>Website</h6>
								</article>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
