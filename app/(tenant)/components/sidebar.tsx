'use client';
import Image from 'next/image';
import React from 'react';
import { usePathname } from 'next/navigation';
import img from '../resources/logo.svg';
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@/components/ui/collapsible'; // Adjust the path as needed
import { ChevronDown } from 'lucide-react';

const sidebar = ({ className }: { className?: string }) => {
	const pathname = usePathname();
	return (
		<Sidebar className='h-fill flex flex-col justify-between ${className} z-30'>
			<SidebarHeader className='bg-black'>
				<Image
					src={img}
					alt=''
					width={102}
					height={100}
				/>
			</SidebarHeader>
			<div className='space-y-5 bg-black h-full text-white flex gap-0.5 flex-col justify-between'>
				<div className='mt-8 justify-between content-between gap-5'>
					<SidebarMenu className=' content-center overflow-visible'>
						<SidebarMenuItem className='p-3 m-0.5'>
							<Link href={'/dashboard'}>
								<div
									className={`${
										pathname === '/dashboard'
											? 'bg-[#3D56A8] rounded p-1 mx-1'
											: ''
									} flex gap-1`}>
									<img
										src='/sidebar/dashboard.png'
										alt=''
										className='h-4 self-center justify-center'
									/>
									<h4>Dashboard</h4>
								</div>
							</Link>
						</SidebarMenuItem>
						<SidebarMenuItem className='p-3 m-0.5'>
							<Link href={'/Employee'}>
								<div
									className={`${
										pathname === '/Employee'
											? 'bg-[#3D56A8] rounded p-1 mx-1'
											: ''
									} flex gap-1`}>
									<img
										src='/sidebar/emp-grp-side.png'
										alt=''
										className='h-4 self-center justify-center'
									/>
									<h4>Employees</h4>
								</div>
							</Link>
						</SidebarMenuItem>
						<SidebarMenuItem className='p-3 m-0.5'>
							<Link href={'/Payrun'}>
								<div
									className={`${
										pathname === '/Payrun'
											? 'bg-[#3D56A8] rounded p-1 mx-1'
											: ''
									} flex gap-1`}>
									<img
										src='/sidebar/money-bag-side.png'
										alt=''
										className='h-4 self-center justify-center'
									/>
									Payrun
								</div>
							</Link>
						</SidebarMenuItem>
						<SidebarMenuItem className='p-3 m-0.5'>
							<Link href={'/Loan'}>
								<div
									className={`${
										pathname === '/Loan' ? 'bg-[#3D56A8] rounded p-1 mx-1' : ''
									} flex gap-1`}>
									<img
										src='/sidebar/money-linear.png'
										alt=''
										className='h-4 self-center justify-center'
									/>
									<h4>Loans</h4>
								</div>
							</Link>
						</SidebarMenuItem>
						<SidebarMenuItem className='p-3 m-0.5'>
							<Link href={'/Reports'}>
								<div
									className={`${
										pathname === '/Reports'
											? 'bg-[#3D56A8] rounded p-1 mx-1'
											: ''
									} flex gap-1`}>
									<img
										src='/sidebar/ChartBar.png'
										alt=''
										className='h-4 self-center justify-center'
									/>
									<h4>Reports</h4>
								</div>
							</Link>
						</SidebarMenuItem>
						<Collapsible className='group/collapsible'>
							<SidebarMenuItem className='p-3 m-0.5'>
								<CollapsibleTrigger className='flex justify-between items-end w-full'>
									<div className='text-white flex gap-1'>
										<img
											src='/sidebar/Gear.png'
											alt=''
											className='h-4 self-center justify-center'
										/>
										<h4>Settings</h4>
									</div>
									<ChevronDown
										className='ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180 
									group-data-[state=closed]/collapsible:opacity-0 group-data-[state=closed]/collapsible:invisible self-end align-end'
									/>
								</CollapsibleTrigger>
								<CollapsibleContent className='overflow-visible'>
									<SidebarMenuSub className='overflow-visible'>
										<SidebarMenuSubItem className='font-light text-sm'>
											<Link href={'/Setins/CompSet'}>
												<div
													className={`${
														pathname === '/Setins/CompSet'
															? 'bg-[#3D56A8] rounded p-1 mx-1'
															: ''
													}`}>
													Company Settings
												</div>
											</Link>
										</SidebarMenuSubItem>
									</SidebarMenuSub>
									<SidebarMenuSub className='overflow-visible'>
										<SidebarMenuSubItem className='font-light'>
											<Link href={'/Setins/Payset'}>
												<div
													className={`${
														pathname === '/Setins/Payset'
															? 'bg-[#3D56A8] rounded p-1 mx-1'
															: ''
													}`}>
													Payment Settings
												</div>
											</Link>
										</SidebarMenuSubItem>
									</SidebarMenuSub>
									<SidebarMenuSub className='overflow-visible'>
										<SidebarMenuSubItem className='font-light'>
											<Link href={'/Setins/Userrole'}>
												<div
													className={`${
														pathname === '/Setins/Userrole'
															? 'bg-[#3D56A8] rounded p-1 mx-1'
															: ''
													}`}>
													User Roles
												</div>
											</Link>
										</SidebarMenuSubItem>
									</SidebarMenuSub>
								</CollapsibleContent>
							</SidebarMenuItem>
						</Collapsible>
						<SidebarMenuItem className='p-3 m-0.5'>
							<Link href={'https://support.exxforce.com/portal/en/kb'}>
								<div className='flex gap-1'>
									<img
										src='/sidebar/carbon_help.png'
										alt=''
										className='h-4 self-center justify-center'
									/>
									<h4>Help</h4>
								</div>
							</Link>
						</SidebarMenuItem>
					</SidebarMenu>
				</div>
			</div>
			<SidebarFooter className='bg-black'>
				<Link href={'/Authorization/login'}>
					<div className='flex items-center gap-2 p-4 text-sm text-muted-foreground'>
						<img
							src='/sidebar/SignOut.png'
							alt=''
							className='h-4 self-center justify-center'
						/>
						<h4>Log Out</h4>
					</div>
				</Link>
			</SidebarFooter>
		</Sidebar>
	);
};

export default sidebar;
