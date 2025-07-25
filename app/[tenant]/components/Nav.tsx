'use client';
import { Button } from '@/components/ui/button';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuItem,
} from '@radix-ui/react-dropdown-menu';
import {
	Package2,
	Menu,
	Search,
	CircleUser,
	Bell,
	LucideMessageCircleQuestion,
} from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';

const Navigation = () => {
	return (
		<div className='sticky top-0 bg-blend-overlay z-10 w-full '>
			<Card className='flex flex-row items-center bg-blend-overlay rounded-none p-3 border-0 !border-r-0 w-full'>
				<nav className=''>
					<form className='ml-auto flex-1 sm:flex-initial'>
						<div className='relative'>
							<Search className='absolute left-2.5 top-2.5 h-4 w-4' />
							<Input
								type='search'
								placeholder='Search...'
								className='pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px] bg-[#E8F1FF] text-[#3D56A8]'
							/>
						</div>
					</form>
				</nav>
				<div className='flex ml-auto justify-end self-end items-center gap-0.5 mr-4'>
					<Button className='rounded-full flex bg-white text-[#3D56A8]'>
						<Bell className='h-5 w-5' />
					</Button>
					<Button className='rounded-full flex bg-white text-[#3D56A8]'>
						<LucideMessageCircleQuestion className='h-5 w-5' />
					</Button>
					<Button className='rounded-full flex bg-white text-[#3D56A8]'>
						<Avatar>
							<AvatarImage
								src={'your_image_source_here'}
								alt=''
							/>
							<AvatarFallback>
								<CircleUser className='h-5 w-5' />
							</AvatarFallback>
						</Avatar>
					</Button>
				</div>
			</Card>
		</div>
	);
};

export default Navigation;
