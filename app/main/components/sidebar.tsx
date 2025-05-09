import Image from 'next/image';
import React from 'react';
import img from '../resources/logo.svg';
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
} from '@/components/ui/sidebar';

const sidebar = ({className} : {className?: string}) => {
	return (
		<Sidebar className='h-fill flex flex-col justify-between ${className}'>
				<SidebarHeader className='bg-black'>
					<Image
						src={img}
						alt=''
						width={102}
						height={100}
					/>
				</SidebarHeader>
				<div className='space-y-5 bg-black h-full text-white flex gap-0.5 flex-col justify-between'>
					<SidebarContent className='p-0'>
						<div className=''>Dashboard</div>
					</SidebarContent>
					<SidebarContent>
						<div className=''>Employees</div>
					</SidebarContent>
					<SidebarContent>
						<div className=''>Payrun</div>
					</SidebarContent>
					<SidebarContent>
						<div className=''>Loans</div>
					</SidebarContent>
					<SidebarContent>
						<div className=''>Reports</div>
					</SidebarContent>
					<SidebarContent>
						<div className=''>Settings</div>
					</SidebarContent>
					<SidebarContent>
						<div className=''>Help</div>
					</SidebarContent>
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
