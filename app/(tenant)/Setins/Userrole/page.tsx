'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogTrigger,
	DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import React, { useEffect, useMemo, useState } from 'react';
import FilterSort, {
	FilterOption,
	SortOption,
} from '../../components/FilterSort';
import { Pagination, PageSizeSelector } from '../../components/pagination';
import Loading from '@/components/ui/Loading';
import { getAccessToken, getTenant } from '@/lib/auth';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface Role {
	id: number;
	name: string;
	permissions: [];
}

const Log = () => {
	const router = useRouter();
	const [roles, setRoles] = useState<Role[]>([]);
	const fetchRoleGroups = async () => {
		const tenant = getTenant();
		const token = getAccessToken();
		const baseURL = `https://${tenant}.exxforce.com`;
		try {
			const res = await axios.get(`${baseURL}/tenant/staff/roles`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			if (res.status === 200) {
				setRoles(res.data);
			}
			console.log(res.data);
		} catch (err: any) {
			console.log(err.message);
			if (err.status === 401) {
				router.push('/login');
			}
		} finally {
			console.log(roles);
		}
	};
	useEffect(() => {
		fetchRoleGroups();
	}, []);
	return (
		<div className='bg-white w-[450px]'>
			<form
				action=''
				className='flex flex-col'>
				<span className='m-3'>
					<Label
						htmlFor='name'
						className='mb-2'>
						Enter Name
					</Label>
					<Input
						type='text'
						id='name'
					/>
				</span>
				<span className='m-3'>
					<Label
						htmlFor='name'
						className='mb-2'>
						Enter Email
					</Label>
					<Input
						type='email'
						id='email'
					/>
				</span>
				<span className='m-3'>
					<Label
						htmlFor='name'
						className='mb-2'>
						Choose Role
					</Label>
					<Select>
						<SelectTrigger className='w-full'>
							<SelectValue placeholder='' />
						</SelectTrigger>
						<SelectContent>
							{roles.map((role) => {
								return (
									<SelectItem
										value={role.name}
										key={role.id}>{`${role.name
										.charAt(0)
										.toUpperCase()}${role.name.slice(1)}`}</SelectItem>
								);
							})}
						</SelectContent>
					</Select>
				</span>
				<span className='flex gap-1 self-end'>
					<Button
						variant={'default'}
						className='bg-blue-600 text-white hover:bg-blue-700 p-1.5'>
						Submit
					</Button>
					<DialogClose asChild>
						<Button
							variant={'default'}
							className='bg-white text-black'>
							Cancel
						</Button>
					</DialogClose>
				</span>
			</form>
		</div>
	);
};

const page = () => {
	const [users, setUsers] = React.useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [searchValue, setSearchValue] = useState('');
	const [filters, setFilters] = useState<Record<string, string>>({
		department: 'All',
		position: 'All',
		role_group: 'All',
	});
	const [sortBy, setSortBy] = useState('full_name');
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

	const filterOptions: Record<string, FilterOption[]> = useMemo(() => {
		const uniqueDepartments = [
			...new Set(users.map((user) => user.department).filter(Boolean)),
		];
		const uniqueRoleGroup = [
			...new Set(users.map((user) => user.role_group).filter(Boolean)),
		];
		return {
			department: uniqueDepartments.map((dept) => ({
				value: dept || 'Unknown',
				label: dept || 'Unknown',
			})),
			role_group: uniqueRoleGroup.map((role) => ({
				value: role || 'Unknown',
				label: role || 'Unknown',
			})),
		};
	}, [users]);

	const sortOptions: SortOption[] = [
		{ value: 'department', label: 'Department' },
		{ value: 'email', label: 'Email' },
		{ value: 'full_name', label: 'Full Name' },
		{ value: 'position', label: 'Position' },
		{ value: 'role_group', label: 'Role Group' },
	];

	// Filter and sort users
	const filteredAndSortedUsers = useMemo(() => {
		let filtered = users.filter((user) => {
			const matchesSearch =
				(user.full_name || '')
					.toLowerCase()
					.includes(searchValue.toLowerCase()) ||
				(user.email || '').toLowerCase().includes(searchValue.toLowerCase()) ||
				(user.department || '')
					.toLowerCase()
					.includes(searchValue.toLowerCase()) ||
				(user.role_group || '')
					.toLowerCase()
					.includes(searchValue.toLowerCase());

			const matchesFilters = Object.entries(filters).every(([key, value]) => {
				if (value === 'All') return true;
				return (user[key] || 'Unknown') === value;
			});

			return matchesSearch && matchesFilters;
		});

		// Sort the filtered results
		filtered.sort((a, b) => {
			const aValue = (a[sortBy] || '').toString();
			const bValue = (b[sortBy] || '').toString();

			if (sortOrder === 'asc') {
				return aValue.localeCompare(bValue);
			} else {
				return bValue.localeCompare(aValue);
			}
		});

		return filtered;
	}, [users, searchValue, filters, sortBy, sortOrder]);

	// Paginate the filtered and sorted users
	const paginatedUsers = useMemo(() => {
		const startIndex = (currentPage - 1) * pageSize;
		return filteredAndSortedUsers.slice(startIndex, startIndex + pageSize);
	}, [filteredAndSortedUsers, currentPage, pageSize]);

	// Handle filter changes
	const handleFilterChange = (filterKey: string, value: string) => {
		setFilters((prev) => ({ ...prev, [filterKey]: value }));
		setCurrentPage(1); // Reset to first page when filtering
	};

	// Handle search changes
	const handleSearchChange = (value: string) => {
		setSearchValue(value);
		setCurrentPage(1); // Reset to first page when searching
	};

	// Handle sort changes
	const handleSortChange = (value: string) => {
		setSortBy(value);
		setCurrentPage(1); // Reset to first page when sorting
	};

	const handleSortOrderChange = (order: 'asc' | 'desc') => {
		setSortOrder(order);
		setCurrentPage(1); // Reset to first page when changing sort order
	};

	// Handle page changes
	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	const handlePageSizeChange = (newSize: number) => {
		setPageSize(newSize);
		setCurrentPage(1); // Reset to first page when changing page size
	};

	const fetchUsers = async () => {
		const token = localStorage.getItem('access_token') || '';
		const tenant = localStorage.getItem('tenant') || '';
		setLoading(true);
		try {
			const res = await fetch(
				`https://${tenant}.exxforce.com/tenant/staff/users`,
				{
					method: 'GET',
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			if (!res.ok) throw new Error('Failed to fetch users');
			const data = await res.json();
			setUsers(data);
			console.log(data);
		} catch (error) {
			console.error('Error fetching users:', error);
			return [];
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	if (loading) {
		return (
			<Loading
				variant='pulse'
				overlay={false}
				className='my-4'
				message='Fetching Users...'
			/>
		);
	}

	return (
		<div className='h-[1080px]'>
			<article className='m-4 w-[400px]'>
				<h4 className='font-bold'>Mange Roles</h4>
				<p className='text-sm font-light'>
					Manage your organization settings and preference
				</p>
			</article>

			{/* Filter and Sort Component */}
			<div className='m-4 '>
				<FilterSort
					searchValue={searchValue}
					onSearchChange={handleSearchChange}
					searchPlaceholder='Search users...'
					filters={filters}
					filterOptions={filterOptions}
					onFilterChange={handleFilterChange}
					sortBy={sortBy}
					sortOrder={sortOrder}
					sortOptions={sortOptions}
					onSortChange={handleSortChange}
					onSortOrderChange={handleSortOrderChange}
				/>
			</div>

			<Card className='w-[950px] m-4 h-auto'>
				<CardHeader className=' mb-4'>
					<div className='flex justify-between items-center'>
						<h4>User History</h4>
						<Dialog>
							<DialogTrigger asChild>
								<Button
									variant={'default'}
									className='bg-blue-600 hover:bg-blue-700 text-white'>
									+ New User
								</Button>
							</DialogTrigger>
							<DialogContent className=' bg-white'>
								<DialogTitle>Invite User</DialogTitle>
								<Log />
							</DialogContent>
						</Dialog>
					</div>
				</CardHeader>
					<CardContent>
				{/* Page Size Selector */}
				<div className='mt-4 ml-3'>
					<PageSizeSelector
						pageSize={pageSize}
						onChange={handlePageSizeChange}
						options={[5, 10, 25, 50]}
					/>
				</div>
					<Table className='w-full'>
						<TableHeader>
							<TableRow>
								<TableHead>NAME</TableHead>
								<TableHead>EMAIL</TableHead>
								<TableHead>ROLE</TableHead>
								<TableHead>DEPT.</TableHead>
								<TableHead>ACTION</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{paginatedUsers.length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={5}
										className='text-center py-8 text-gray-500'>
										No users found matching your criteria
									</TableCell>
								</TableRow>
							) : (
								paginatedUsers.map((user) => (
									<TableRow key={user.id}>
										<TableCell>{user.full_name || 'N/A'}</TableCell>
										<TableCell>{user.email || 'N/A'}</TableCell>
										<TableCell>{user.role_group || 'N/A'}</TableCell>
										<TableCell>{user.department || 'N/A'}</TableCell>
										<TableCell>
											<div className='flex gap-4'>
												<span>
													<img
														src='/icons/mage_edit.png'
														alt='edit'
														className='h-4 w-4 cursor-pointer'
													/>
												</span>
												<span>
													<img
														src='/icons/delete-icon.png'
														alt='delete'
														className='h-4 w-4 cursor-pointer'
													/>
												</span>
											</div>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>

					{/* Pagination Component */}
					{filteredAndSortedUsers.length > 0 && (
						<div className='mt-6 border-t pt-4'>
							<Pagination
								currentPage={currentPage}
								pageSize={pageSize}
								totalItems={filteredAndSortedUsers.length}
								onPageChange={handlePageChange}
								showSummary={true}
								showGoTo={true}
							/>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
};

export default page;
