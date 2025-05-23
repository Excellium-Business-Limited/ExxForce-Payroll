import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function LoanDetails() {
    const router = useRouter();
    const { loanId } = router.query;
    const [loan, setLoan] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (loanId) {
            // Fetch loan details based on loanId
            const fetchLoanDetails = async () => {
                try {
                    const response = await fetch(`/api/loans/${loanId}`);
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const data = await response.json();
                    setLoan(data);
                } catch (error) {
                    console.error('Error fetching loan details:', error);
                } finally {
                    setLoading(false);
                }
            };

            fetchLoanDetails();
        }
    }, [loanId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!loan) {
        return <div>Loan not found.</div>;
    }

    return (
        <div>
            <h1>Loan Details</h1>
            <p>Loan Number: {loan.loanNumber}</p>
            <p>Employee Name: {loan.employeeName}</p>
            <p>Loan Name: {loan.loanName}</p>
            <p>Loan Amount: {loan.loanAmount}</p>
            <p>Monthly Deduction: {loan.monthlyDeduction}</p>
            <p>Balance Remaining: {loan.balanceRemaining}</p>
            <p>Status: {loan.status}</p>
        </div>
    );
}