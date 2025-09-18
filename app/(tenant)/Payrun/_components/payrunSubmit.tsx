import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import DatePicker from '../../components/datepicker';
import React, { use, useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import {
	Check,
	CheckIcon,
	CircleCheck,
	CircleX,
	Edit,
	EllipsisVertical,
	Eye,
} from 'lucide-react';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getTenant, getAccessToken } from '@/lib/auth';
import axios from 'axios';
import {
	Sheet,
	SheetContent,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';
import PayrunForm from './PayrunForm';
import FilterSort, { FilterOption, SortOption } from '../../components/FilterSort';
import { Pagination, PageSizeSelector } from '../../components/pagination';

interface payrun {
	id: number;
	PAY_PERIOD: string;
	NAME: string;
	TOTAL_EMPLOYEES: number;
	PAYMENT_DATE: string;
	START_DATE: string;
	STATUS: string;
}

interface MonthlyProps {
	payruns: payrun[];
}

const monthly = ({ payruns, value }: MonthlyProps & { value: string }) => {
	const [currentApprovalId, setCurrentApprovalId] = React.useState<
		number | null
	>(null);
	const router = useRouter();
	const [isPayrun, setIsPayrun] = React.useState(true);
	const [isSheetOpen, setIsSheetOpen] = React.useState(false);
	const [currentPage, setCurrentPage] = React.useState(1);
	const [pageSize, setPageSize] = React.useState(10);

	// Filter and search states
	const [searchValue, setSearchValue] = React.useState('');
	const [filters, setFilters] = React.useState<Record<string, string>>({
		status: 'All',
	});
	const [sortBy, setSortBy] = React.useState('NAME');
	const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('asc');

	// Filter options
	const filterOptions: Record<string, FilterOption[]> = {
		status: [
			{ value: 'APPROVED', label: 'Approved' },
			{ value: 'PENDING', label: 'Pending Approval' },
			{ value: 'DRAFT', label: 'Draft' },
			{ value: 'SCHEDULED', label: 'Scheduled' },
		],
	};

	// Sort options
	const sortOptions: SortOption[] = [
		{ value: 'NAME', label: 'Name' },
		{ value: 'PAY_PERIOD', label: 'Pay Period' },
		{ value: 'TOTAL_EMPLOYEES', label: 'Total Employees' },
		{ value: 'PAYMENT_DATE', label: 'Payment Date' },
		{ value: 'START_DATE', label: 'Start Date' },
		{ value: 'STATUS', label: 'Status' },
	];

	// Filter and sort logic
	const filteredAndSortedPayruns = useMemo(() => {
		let filtered = payruns.filter((payrun) => {
			// Search filter
			const searchMatch =
				searchValue === '' ||
				payrun.NAME.toLowerCase().includes(searchValue.toLowerCase()) ||
				payrun.PAY_PERIOD.toLowerCase().includes(searchValue.toLowerCase()) ||
				payrun.STATUS.toLowerCase().includes(searchValue.toLowerCase());

			// Status filter
			const statusMatch =
				filters.status === 'All' || payrun.STATUS === filters.status;

			return searchMatch && statusMatch;
		});

		// Sort
		filtered.sort((a, b) => {
			let aValue = a[sortBy as keyof payrun];
			let bValue = b[sortBy as keyof payrun];

			// Handle numeric sorting
			if (sortBy === 'TOTAL_EMPLOYEES') {
				aValue = Number(aValue);
				bValue = Number(bValue);
			}

			// Handle date sorting
			if (sortBy === 'PAYMENT_DATE' || sortBy === 'START_DATE') {
				aValue = new Date(aValue as string).getTime();
				bValue = new Date(bValue as string).getTime();
			}

			if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
			if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
			return 0;
		});

		return filtered;
	}, [payruns, searchValue, filters, sortBy, sortOrder]);

	// Pagination logic
	const paginatedPayruns = useMemo(() => {
		const startIndex = (currentPage - 1) * pageSize;
		return filteredAndSortedPayruns.slice(startIndex, startIndex + pageSize);
	}, [filteredAndSortedPayruns, currentPage, pageSize]);

	// Reset page when filters change
	useEffect(() => {
		setCurrentPage(1);
	}, [searchValue, filters, sortBy, sortOrder]);

	const handleFilterChange = (filterKey: string, value: string) => {
		setFilters((prev) => ({
			...prev,
			[filterKey]: value,
		}));
	};

	useEffect(() => {
		const tenant = localStorage.getItem('tenant');
		const accessToken = localStorage.getItem('access_token');
	}, []);

	const handleDraftSubmit = async (id: string) => {
		const tenant = getTenant();
		const baseURL = `http://${tenant}.localhost:8000`;
		const accessToken = getAccessToken();

		try {
			const res = await axios.post(
				`http://${tenant}.localhost:8000/tenant/payrun/${id}/submit`,
				{}, // empty request body
				{ headers: { Authorization: `Bearer ${accessToken}` } }
			);

			if (res.status === 200) {
				console.log(res);
			}
			setCurrentApprovalId(null);
			router.refresh();
		} catch (err: any) {
			console.log(err);
			if (err.response?.status === 401) {
				router.push('/login');
			}
		} finally {
			// Don't forget to reset loading state
		}
	};

	const handleApproval = async (id: number) => {
		const Url = `tenant/payrun/${id}/approve`;
		const accessToken = getAccessToken();
		const tenant = getTenant();
		try {
			const res = await axios.post(
				`http://${tenant}.localhost:8000/${Url}`,
				{}, // empty request body
				{ headers: { Authorization: `Bearer ${accessToken}` } }
			);

			if (res.status === 200) {
				console.log(res);
				alert('PayRun Approved');
				setCurrentApprovalId(null);
			}
			router.refresh();
		} catch (err: any) {
			console.log(err);
			if (err.response?.status === 401) {
				router.push('/login');
			}
		} finally {
			// Don't forget to reset loading state
			window.location.href = '/Payrun';
		}
	};

	if (payruns.length === 0) {
		return (
			<div>
				<div className='h-[680px] m-7 gap-4 '>
					<section className='text-center flex flex-col items-center max-w-2xl mx-auto mt-[120px]'>
						<img
							src='/payrun.jpg'
							alt='Team Illustration'
							className='w-32 h-32 md:w-40 md:h-40 mx-auto mb-8'
						/>
						<h2 className='text-2xl md:text-3xl  mb-4'>
							Start Your First{' '}
							{`${value.charAt(0).toUpperCase()}${value
								.slice(1)
								.toLowerCase()}`}{' '}
							Payroll{' '}
						</h2>
						<p className='text-base text-muted-foreground self mb-8 w-[460px]'>
							Easily create and manage payruns for your employees. Select the
							pay period, add employee data, and process salaries quickly.
						</p>
						<article className='flex flex-col sm:flex-row gap-4 justify-center'>
							<Sheet
								open={isSheetOpen}
								onOpenChange={setIsSheetOpen}>
								<SheetTrigger asChild>
									<Button
										variant={'outline'}
										className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2'>
										Create Payrun
									</Button>
								</SheetTrigger>
								<SheetContent className='min-w-[500px] p-4'>
									<SheetTitle className='hidden'></SheetTitle>
									<PayrunForm
										className='absolute'
										setIsSheetOpen={setIsSheetOpen}
										setIsPayrun={setIsPayrun}
									/>
								</SheetContent>
							</Sheet>
						</article>
					</section>
				</div>
			</div>
		);
	}

	return (
		<div>
			<Card>
				<CardHeader className='flex justify-between content-center align-middle '>
					<h3>PAYRUN OVERVIEW</h3>
				</CardHeader>
				<CardContent className='space-y-4'>
					{/* Filter and Search Component */}
					<FilterSort
						searchValue={searchValue}
						onSearchChange={setSearchValue}
						searchPlaceholder='Search payruns...'
						filters={filters}
						filterOptions={filterOptions}
						onFilterChange={handleFilterChange}
						sortBy={sortBy}
						sortOrder={sortOrder}
						sortOptions={sortOptions}
						onSortChange={setSortBy}
						onSortOrderChange={setSortOrder}
					/>

					{/* Page Size Selector */}
					<div className='flex justify-between items-center'>
						<PageSizeSelector
							pageSize={pageSize}
							onChange={setPageSize}
							options={[5, 10, 25, 50]}
						/>
						<div className='text-sm text-gray-600'>
							Showing {filteredAndSortedPayruns.length} of {payruns.length}{' '}
							payruns
						</div>
					</div>

					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
									PAY FREQUENCY
								</TableHead>
								<TableHead className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
									Name
								</TableHead>
								<TableHead className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
									TOTAL EMPLOYEES
								</TableHead>
								<TableHead className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
									PAYMENT DATE
								</TableHead>
								<TableHead className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
									START DATE
								</TableHead>
								<TableHead className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
									STATUS
								</TableHead>
								<TableHead className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
									MORE
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{paginatedPayruns.map((payrun) => {
								return (
									<TableRow key={payrun.id}>
										<TableCell className='px-6 py-3 text-left text-xs font-medium b tracking-wider'>
											{payrun.PAY_PERIOD}
										</TableCell>
										<TableCell className='px-6 py-3 text-left text-xs font-medium b tracking-wider'>
											{payrun.NAME}
										</TableCell>
										<TableCell className='px-6 py-3 text-left text-xs font-medium b tracking-wider'>
											{payrun.TOTAL_EMPLOYEES}
										</TableCell>
										<TableCell className='px-6 py-3 text-left text-xs font-medium b tracking-wider'>
											{payrun.PAYMENT_DATE}
										</TableCell>
										<TableCell className='px-6 py-3 text-left text-xs font-medium b tracking-wider'>
											{payrun.START_DATE}
										</TableCell>
										<TableCell className='px-6 py-3 text-left text-xs font-medium b tracking-wider'>
											{payrun.STATUS}
										</TableCell>
										<TableCell className='px-6 py-3 text-left text-xs font-medium bg-white tracking-wider'>
											<Popover>
												<PopoverTrigger>
													<EllipsisVertical />
												</PopoverTrigger>
												<PopoverContent
													className={`grid grid-cols-1  !m-0 w-fit  bg-white ${
														payrun.id === 1 ? 'text-black' : 'text-grey'
													}
													`}>
													{payrun.STATUS === 'PENDING' ? (
														<Button
															variant={'default'}
															className='flex bg-white text-black hover:bg-secondary w-fit p-0.5  justify-start'
															asChild>
															<Dialog
																open={currentApprovalId === payrun.id}
																onOpenChange={(open) =>
																	setCurrentApprovalId(open ? payrun.id : null)
																}>
																<DialogTrigger className='flex bg-white text-black hover:bg-secondary w-fit !text-sm  p-0.5 justify-start'>
																	<Check
																		size={18}
																		color='#20b49f'
																	/>{' '}
																	<p className=' font-light text-[#20b49f] text-sm '>
																		Approve Payrun
																	</p>
																</DialogTrigger>
																<DialogContent className='w-[500px] bg-white'>
																	<DialogTitle className='text-center text-lg font-semibold '>
																		Approve Payrun
																	</DialogTitle>
																	<div>
																		<p>
																			You are about to approve the payrun â€œ
																			{`${payrun.NAME} ${payrun.PAY_PERIOD}`}
																			â€. This action cannot be undone
																		</p>
																	</div>
																	<div>
																		<section className='flex justify-between my-4'>
																			<p>Pay Date:</p>
																			<p>{payrun.PAYMENT_DATE}</p>
																		</section>
																		<section className='flex justify-between my-4'>
																			<p>Total Employees</p>
																			<p>{payrun.TOTAL_EMPLOYEES}</p>
																		</section>
																		<section className='flex justify-between my-4'>
																			<p>Total Net Pay</p>
																			<p>â‚¦147,000.00</p>
																		</section>
																	</div>
																	<div className='flex gap-3 right-0 bottom-0 self-end justify-end'>
																		<Button
																			variant={'default'}
																			className='bg-white border border-2-[#969393] text-[#969393]'
																			asChild>
																			<DialogClose className='text-[#969393] hover:text-black'>
																				Close
																			</DialogClose>
																		</Button>
																		<Button
																			variant={'default'}
																			className='bg-blue-600 text-white hover:bg-[#20b49f]'
																			onClick={() => handleApproval(payrun.id)}>
																			<Check className='text-white' />
																			Approve Payrun
																		</Button>
																	</div>
																</DialogContent>
															</Dialog>
														</Button>
													) : null}
													{payrun.STATUS === 'DRAFT' ? (
														<div className='flex flex-col gap-1 p-0.5 ml-2'>
															<Button
																variant={'default'}
																className='flex bg-white text-black hover:bg-secondary w-fit p-0.5  justify-start shadow-none'
																onClick={() =>
																	handleDraftSubmit(payrun.id.toString())
																}>
																<p className='font-light'>
																	Submit for Approval
																</p>
															</Button>
															<Button
																variant={'default'}
																className='flex bg-white text-black hover:bg-secondary w-fit p-0.5  justify-start'>
																<p className='text-red-600'>Delete Payrun</p>
															</Button>
														</div>
													) : null}
													<Button
														variant={'default'}
														className='flex bg-white text-black hover:bg-secondary w-fit p-0.5  justify-start'
														asChild>
														<Link href={`./Payrun/${payrun.id}`}>
															<Eye />{' '}
															<p className=' font-light'>View Details</p>
														</Link>
													</Button>
													<Button
														variant={'default'}
														className='flex bg-white text-black hover:bg-secondary w-fit p-0.5  justify-start'>
														<Edit /> <p className='font-light'>Edit Schedule</p>
													</Button>
													<Button
														variant={'default'}
														className='flex bg-white text-black hover:bg-secondary w-fit p-0.5  justify-start'>
														<CircleX className='text-[#bf2821]' />{' '}
														<p className='font-light text-[#bf2821]'>
															Reject Payrun
														</p>
													</Button>
												</PopoverContent>
											</Popover>
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>

					{/* Pagination */}
					<Pagination
						currentPage={currentPage}
						pageSize={pageSize}
						totalItems={filteredAndSortedPayruns.length}
						onPageChange={setCurrentPage}
					/>
				</CardContent>
			</Card>
		</div>
	);
};

export default monthly;
