'use client'
import React, { use } from 'react'

export default function ReportPage({
	params,
}: {
	params: Promise<{ reportType: string; slug: string }>;
}) {
	// ✅ Use React's 'use' hook to unwrap the promise
	const { reportType, slug } = use(params);

	// Rest of your component...
	return (
		<div>
			<h1>Report: {reportType}</h1>
			<p>Slug: {slug}</p>
		</div>
	);
}