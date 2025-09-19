// _components/activityLogs.tsx
import React, { useState } from 'react';
import { Clock, User, FileText, Filter, Search, Calendar } from 'lucide-react';

// Interface definitions for Activity Logs
interface ActivityLog {
	id: string;
	action: string;
	model: string;
	object_id: string;
	timestamp: string;
	user: string;
}

interface ActivityLogsData {
	activities: ActivityLog[];
	length: number;
	map: any;

	// Add other fields if needed, e.g. period, total_activities, users, activity_types, etc.
}

interface ActivityLogsReportProps {
	data: ActivityLogsData;
}

const ActivityLogsReport: React.FC<ActivityLogsReportProps> = ({ data }) => {
	const [searchTerm, setSearchTerm] = useState('');
	const [filterUser, setFilterUser] = useState('all');
	const [filterAction, setFilterAction] = useState('all');
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;

	console.log(data);

	// Format date function
	const formatDate = (dateString: string): string => {
		return new Date(dateString).toLocaleString('en-NG', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});
	};

	// Format number with commas
	const formatNumber = (num: number): string => {
		return new Intl.NumberFormat().format(num);
	};

	// Get action color
	const getActionColor = (action: string): string => {
		switch (action.toLowerCase()) {
			case 'create':
			case 'created':
				return 'text-green-600 bg-green-100';
			case 'update':
			case 'updated':
				return 'text-blue-600 bg-blue-100';
			case 'delete':
			case 'deleted':
				return 'text-red-600 bg-red-100';
			case 'login':
			case 'logout':
				return 'text-purple-600 bg-purple-100';
			case 'view':
			case 'viewed':
				return 'text-gray-600 bg-gray-100';
			default:
				return 'text-yellow-600 bg-yellow-100';
		}
	};

	// Filter activities
	const filteredActivities = () => {
		// const matchesSearch =
		// 	activity.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
		// 	activity.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
		// 	activity.resource.toLowerCase().includes(searchTerm.toLowerCase());
		// const matchesUser = filterUser === 'all' || activity.user === filterUser;
		// const matchesAction = filterAction === 'all' || activity.action === filterAction;
		// return matchesSearch && matchesUser && matchesAction;
	};

	// Paginate activities
	// const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
	// const startIndex = (currentPage - 1) * itemsPerPage;
	// const paginatedActivities = filteredActivities.slice(startIndex, startIndex + itemsPerPage);

	// Get unique users and actions for filter dropdowns
	// const uniqueUsers = Array.from(new Set(data.activities.map(a => a.user)));
	// const uniqueActions = Array.from(new Set(data.activities.map(a => a.action)));

	return (
		<div className='min-h-screen bg-gray-50 p-6'>
			<div className='max-w-7xl mx-auto'>
				{/* Header */}
				<div className='mb-8'>
					<h1 className='text-3xl font-bold text-gray-900 mb-2'>
						Activity Logs Report
					</h1>
				</div>

				{/* Summary Cards */}
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
					{/* Total Activities Card */}
					<div className='bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500'>
						<div className='flex items-center justify-between'>
							<div>
								<p className='text-sm font-medium text-gray-600 mb-1'>
									Total Activities
								</p>
								<p className='text-2xl font-bold text-blue-600'>
									{data.length}
								</p>
							</div>
							<div className='p-3 bg-blue-100 rounded-full'>
								<Clock className='h-6 w-6 text-blue-600' />
							</div>
						</div>
					</div>

					{/* Active Users Card */}
					<div className='bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500'>
						<div className='flex items-center justify-between'>
							<div>
								<p className='text-sm font-medium text-gray-600 mb-1'>
									Active Users
								</p>
								<p className='text-2xl font-bold text-blue-600'>
									{[...new Set(data.map((i: ActivityLog) => i.user))].length}
								</p>
							</div>
							<div className='p-3 bg-blue-100 rounded-full'>
								<User className='h-6 w-6 text-blue-600' />
							</div>
						</div>
					</div>

					{/* Activity Types Card */}
					<div className='bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500'>
						<div className='flex items-center justify-between'>
							<div>
								<p className='text-sm font-medium text-gray-600 mb-1'>
									Total Models
								</p>
								<p className='text-2xl font-bold text-blue-600'>
									{[...new Set(data.map((i: ActivityLog) => i.model))].length}
								</p>
							</div>
							<div className='p-3 bg-blue-100 rounded-full'>
								<FileText className='h-6 w-6 text-blue-600' />
							</div>
						</div>
					</div>
				</div>

				{/* Activity Breakdown */}
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
					{/* Activity Types Breakdown */}
					<div className='bg-white rounded-lg shadow-md overflow-hidden'>
						<div className='px-6 py-4 bg-gray-50 border-b'>
							<h3 className='text-lg font-semibold text-gray-900'>
								Activity Types
							</h3>
						</div>
						<div className='p-6'>
							<div className='space-y-4'>
								{Array.from(
									new Set(data.map((item: ActivityLog) => item.action))
								).map((action) => (
									<div
										key={String(action)}
										className='flex items-center justify-between'>
										<span className='text-sm text-gray-700'>
											{String(action)}
										</span>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>

				{/* Filters and Search */}
				<div className='bg-white rounded-lg shadow-md p-6 mb-8'>
					<div className='flex flex-col lg:flex-row gap-4 items-center'>
						<div className='flex items-center gap-2 text-gray-700'>
							<Filter className='h-5 w-5' />
							<span className='font-medium'>Filters:</span>
						</div>

						<div className='flex flex-col sm:flex-row gap-4 flex-1'>
							{/* Search */}
							<div className='relative flex-1'>
								<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
								<input
									type='text'
									placeholder='Search activities...'
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
								/>
							</div>

							{/* User Filter */}
							<select
								value={filterUser}
								onChange={(e) => setFilterUser(e.target.value)}
								className='px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'>
								<option value='all'>All Users</option>
							</select>

							{/* Action Filter */}
							<select
								value={filterAction}
								onChange={(e) => setFilterAction(e.target.value)}
								className='px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'>
								<option value='all'>All Actions</option>
							</select>
						</div>

						<div className='text-sm text-gray-500'></div>
					</div>
				</div>

				{/* Activities Table */}
				<div className='bg-white rounded-lg shadow-md overflow-hidden'>
					<div className='px-6 py-4 bg-gray-50 border-b'>
						<h3 className='text-xl font-semibold text-gray-900'>
							Activity Log Details
						</h3>
					</div>
					<div className='overflow-x-auto'>
						<table className='min-w-full divide-y divide-gray-200'>
							<thead className='bg-gray-50'>
								<tr>
									<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
										Timestamp
									</th>
									<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
										User
									</th>
									<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
										Action
									</th>
									<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
										Models
									</th>
									<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
										Object ID
									</th>
								</tr>
							</thead>
							<tbody className='bg-white divide-y divide-gray-200'>
								{data.map((activity: ActivityLog) => (
									<tr key={activity.object_id}>
										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
											{formatDate(activity.timestamp)}
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
											{activity.user}
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
											{activity.action}
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
											{activity.model}
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
											{activity.object_id}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					{/* Pagination */}
					{/* {totalPages > 1 && (
						<div className='bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200'>
							<div className='text-sm text-gray-500'>
								Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredActivities.length)} of {filteredActivities.length} results
							</div>
							<div className='flex items-center gap-2'>
								<button
									onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
									disabled={currentPage === 1}
									className='px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100'>
									Previous
								</button>
								<span className='text-sm text-gray-600'>
									Page {currentPage} of {totalPages}
								</span>
								<button
									onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
									disabled={currentPage === totalPages}
									className='px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100'>
									Next
								</button>
							</div>
						</div>
					)} */}
				</div>

				{/* Summary Footer */}
				<div className='mt-8 text-center text-sm text-gray-500'>
					<p>
						Generated on{' '}
						{new Date().toLocaleDateString('en-NG', {
							year: 'numeric',
							month: 'long',
							day: 'numeric',
							hour: '2-digit',
							minute: '2-digit',
						})}
					</p>
				</div>
			</div>
		</div>
	);
};

export default ActivityLogsReport;
