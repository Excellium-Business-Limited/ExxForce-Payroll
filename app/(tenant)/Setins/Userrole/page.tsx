import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import React from 'react'


const Log = () =>{
  return (
		<div className='bg-white w-[450px]'>
			<form action=''>
				<span className='m-5'>
					<Label
						htmlFor='name'
						className='m-4'>
						Enter Name
					</Label>
					<Input
						type='text'
						id='name'
					/>
				</span>
				<span className='m-5'>
					<Label
						htmlFor='name'
						className='m-4'>
						Enter Email
					</Label>
					<Input
						type='email'
						id='email'
					/>
				</span>
				<span className='m-5'>
					<Label
						htmlFor='name'
						className='m-4'>
						Choose Role
					</Label>
					<Select>
						<SelectTrigger className='w-full'>
							<SelectValue placeholder='' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='Admin'>Admin</SelectItem>
							<SelectItem value='HR'>HR</SelectItem>
							<SelectItem value='Manager'>Manager</SelectItem>
							<SelectItem value='Accountant'>Accountant</SelectItem>
						</SelectContent>
					</Select>
				</span>
			</form>
		</div>
	);
}


const page = () => {
  return (
		<div className='h-[1080px]'>
			<article className='m-4 w-[400px]'>
				<h4 className='font-bold'>Mange Roles</h4>
				<p className='text-sm font-light'>
					Manage your organization settings and preference
				</p>
			</article>

			<Card className='w-[950px] m-4 h-[500px]'>
				<CardHeader className='flex justify-between mb-4'>
					<h4>User History</h4>

					<Dialog>
						<DialogTrigger asChild>
							<Button
								variant={'outline'}
								className='bg-[#3d56a8] text-white'
								>
								+ New User
							</Button>
						</DialogTrigger>
						<DialogContent className=' bg-white'>
							<DialogTitle >Invite User</DialogTitle>
							<Log />
						</DialogContent>
					</Dialog>
				</CardHeader>
				<CardContent>
					<Table className='w-full'>
						<TableHeader>
							<TableRow>
								<TableHead>NAME</TableHead>
								<TableHead>EMAIL</TableHead>
								<TableHead>ROLE</TableHead>
								<TableHead>STATUS</TableHead>
								<TableHead>ACTION</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							<TableRow>
								<TableCell>Fifun</TableCell>
								<TableCell>fi@mail.com</TableCell>
								<TableCell>admin</TableCell>
								<TableCell>active</TableCell>
								<TableCell>more</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	);
}

export default page
