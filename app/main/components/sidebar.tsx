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
							<Link href={'/main/Dashboard'}>
								<div
									className={`${
										pathname === '/main/Dashboard'
											? 'bg-[#3D56A8] rounded p-1 mx-1'
											: ''
									}`}>
									Dashboard
								</div>
							</Link>
						</SidebarMenuItem>
						<SidebarMenuItem className='p-3 m-0.5'>
							<Link href={'/main/Employee'}>
								<div
									className={`${
										pathname === '/main/Employee'
											? 'bg-[#3D56A8] rounded p-1 mx-1'
											: ''
									}`}>
									Employees
								</div>
							</Link>
						</SidebarMenuItem>
						<SidebarMenuItem className='p-3 m-0.5'>
							<Link href={'/main/Payrun'}>
								<div
									className={`${
										pathname === '/main/Payrun'
											? 'bg-[#3D56A8] rounded p-1 mx-1'
											: ''
									}`}>
									Payrun
								</div>
							</Link>
						</SidebarMenuItem>
						<SidebarMenuItem className='p-3 m-0.5'>
							<Link href={'/main/Loan'}>
								<div
									className={`${
										pathname === '/main/Loan'
											? 'bg-[#3D56A8] rounded p-1 mx-1'
											: ''
									}`}>
									Loans
								</div>
							</Link>
						</SidebarMenuItem>
						<SidebarMenuItem className='p-3 m-0.5'>
							<Link href={'/main/Reports'}>
								<div
									className={`${
										pathname === '/main/Reports'
											? 'bg-[#3D56A8] rounded p-1 mx-1'
											: ''
									}`}>
									Reports
								</div>
							</Link>
						</SidebarMenuItem>
						<Collapsible className='group/collapsible'>
							<SidebarMenuItem className='p-3 m-0.5'>
								<CollapsibleTrigger
									className='flex justify-between items-end w-full'
									asChild>
									<SidebarMenuButton className='overflow-visible'>
										<div className='text-white'>Settings</div>
										<ChevronDown
											className='ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180 
									group-data-[state=closed]/collapsible:opacity-0 group-data-[state=closed]/collapsible:invisible self-end align-end'
										/>
									</SidebarMenuButton>
								</CollapsibleTrigger>
								<CollapsibleContent className='overflow-visible'>
									<SidebarMenuSub className='overflow-visible'>
										<SidebarMenuSubItem>
											<Link href={'/main/Setins/CompSet'}>
												<div
													className={`${
														pathname === '/main/Setins/CompSet'
															? 'bg-[#3D56A8] rounded p-1 mx-1'
															: ''
													}`}>
													Company Settings
												</div>
											</Link>
										</SidebarMenuSubItem>
									</SidebarMenuSub>
									<SidebarMenuSub className='overflow-visible'>
										<SidebarMenuSubItem>
											<Link href={'/main/Setins/Payset'}>
												<div
													className={`${
														pathname === '/main/Setins/Payset'
															? 'bg-[#3D56A8] rounded p-1 mx-1'
															: ''
													}`}>
													Payment Settings
												</div>
											</Link>
										</SidebarMenuSubItem>
									</SidebarMenuSub>
									<SidebarMenuSub className='overflow-visible'>
										<SidebarMenuSubItem>
											<Link href={'/main/Setins/Userrole'}>
												<div
													className={`${
														pathname === '/main/Setins/Userrole'
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
							<Link href={''}></Link>

							<div className=''>Help</div>
						</SidebarMenuItem>
					</SidebarMenu>
				</div>
			</div>
			<SidebarFooter className='bg-black'>
				<div className='flex items-center justify-between p-4 text-sm text-muted-foreground'>
					Log Out
				</div>
			</SidebarFooter>
		</Sidebar>
	);
};

export default sidebar;
