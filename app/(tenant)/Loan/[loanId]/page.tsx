'use client';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Loans from '../components/loanDetails';
const items = [
	{ id: '1', name: 'Item One', description: 'Details for item one' },
	{ id: '2', name: 'Item Two', description: 'Details for item two' },
	{ id: '3', name: 'Item Three', description: 'Details for item three' },
];

export default function LoanDetails({ params }: { params: Promise<{ loanId: string }> }) {
	const {loanId} = React.use(params);
	const [loading, setLoading] = useState(false);

		const item = items.find((item) => item.id === loanId); // Use params.loanId

		if (!item) {
			return (<div className=' ml-[470px] flex self-center items-center text-2xl font-bold text-[#3d56a8]'>Loan Not 
			Found</div>)
		}

		return (
		<div>
			<h1>{item.name}</h1>
			<p>ID: {item.id}</p>
			<p>{item.description}</p>
			<Loans item ={null}/> //item will become the details of the loan instead of null
		</div>
	);
}
