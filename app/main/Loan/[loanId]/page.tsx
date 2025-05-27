'use client';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Loans from '../loanDetails';
const items = [
	{ id: '1', name: 'Item One', description: 'Details for item one' },
	{ id: '2', name: 'Item Two', description: 'Details for item two' },
	{ id: '3', name: 'Item Three', description: 'Details for item three' },
];

export default function LoanDetails({
	params,
}: {
	params: { loanId: string };
}) {
	// const router = useRouter();
	// const { loanId } = router.query;
	// const [loan, setLoan] = useState(null);
	const [loading, setLoading] = useState(false);

	// useEffect(() => {
	// 	if (loanId) {
	// 		// Fetch loan details based on loanId
	// 		const fetchLoanDetails = async () => {
	// 			try {
	// 				const response = await fetch(`/api/loans/${loanId}`);
	// 				if (!response.ok) {
	// 					throw new Error(`HTTP error! status: ${response.status}`);
	// 				}
	// 				const data = await response.json();
	// 				setLoan(data);
	// 			} catch (error) {
	// 				console.error('Error fetching loan details:', error);
	// 			} finally {
	// 				setLoading(false);
	// 			}
	// 		};

	// 		fetchLoanDetails();
	// 	}
	// }, [loanId]);

	const item = items.find((item) => item.id === params.loanId); // Use params.loanId

	if (!item) {
		return <div>Item not found.</div>;
	}

	return (
		<div>
			<h1>{item.name}</h1>
			<p>ID: {item.id}</p>
			<p>{item.description}</p>
		</div>
	);
}
