'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectTrigger,
    SelectValue,
    SelectItem,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useGlobal } from '@/app/Context/page';
import axios from 'axios';

interface SalarySetupFormProps {
    employeeData: any;
    isEdit?: boolean;
    existingEmployeeId?: number;
    onClose: () => void;
    onSubmit: (salaryData: any) => Promise<void>;
    onBack: () => void;
    parentOnSubmit: (employeeFormData: any) => Promise<void>;
}

interface SalaryFormData {
    payGradeName: string;
    payFrequency: 'MONTHLY' | 'WEEKLY' | 'BIWEEKLY';
    customSalary: number;
    bankName: string;
    accountNumber: string;
    accountName: string;
    isPayeApplicable: boolean;
    isPensionApplicable: boolean;
    isNhfApplicable: boolean;
    isNsitfApplicable: boolean;
}

const SalarySetupForm: React.FC<SalarySetupFormProps> = ({
    employeeData,
    isEdit = false,
    existingEmployeeId,
    onClose,
    onSubmit,
    onBack,
    parentOnSubmit
}) => {
    const { tenant } = useGlobal();
    const [formData, setFormData] = useState<SalaryFormData>({
        payGradeName: 'Entry Level Staff',
        payFrequency: 'MONTHLY',
        customSalary: 200000,
        bankName: '',
        accountNumber: '',
        accountName: '',
        isPayeApplicable: true,
        isPensionApplicable: true,
        isNhfApplicable: true,
        isNsitfApplicable: true,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [banks, setBanks] = useState<{ code: string; name: string }[]>([]);
    const [loadingBanks, setLoadingBanks] = useState(false);

    // Popular Nigerian banks for fallback
    const fallbackBanks = [
        { code: 'ACCESS', name: 'Access Bank' },
        { code: 'ZENITH', name: 'Zenith Bank' },
        { code: 'GTB', name: 'Guaranty Trust Bank' },
        { code: 'FIRSTBANK', name: 'First Bank of Nigeria' },
        { code: 'UBA', name: 'United Bank for Africa' },
        { code: 'FCMB', name: 'First City Monument Bank' },
        { code: 'FIDELITY', name: 'Fidelity Bank' },
        { code: 'UNION', name: 'Union Bank' },
        { code: 'STANBIC', name: 'Stanbic IBTC Bank' },
        { code: 'STERLING', name: 'Sterling Bank' }
    ];

    // Fetch banks list
    useEffect(() => {
        const fetchBanks = async () => {
            setLoadingBanks(true);
            try {
                // Try different possible API endpoints
                const possibleEndpoints = [
                    `http://${tenant}.localhost:8000/tenant/banks`,
                    `http://${tenant}.localhost:8000/api/banks`,
                    `http://${tenant}.localhost:8000/banks`,
                    'http://excellium.localhost:8000/tenant/banks',
                    'http://excellium.localhost:8000/api/banks',
                    'http://excellium.localhost:8000/banks'
                ];

                let banksData = null;
                
                for (const endpoint of possibleEndpoints) {
                    try {
                        console.log('Trying banks endpoint:', endpoint);
                        const response = await axios.get(endpoint);
                        
                        if (response.data && Array.isArray(response.data)) {
                            banksData = response.data;
                            console.log('Successfully fetched banks from:', endpoint);
                            break;
                        } else if (response.data?.data && Array.isArray(response.data.data)) {
                            banksData = response.data.data;
                            console.log('Successfully fetched banks from:', endpoint);
                            break;
                        } else if (response.data?.banks && Array.isArray(response.data.banks)) {
                            banksData = response.data.banks;
                            console.log('Successfully fetched banks from:', endpoint);
                            break;
                        }
                    } catch (endpointError) {
                        console.log('Failed to fetch from:', endpoint, endpointError.response?.status);
                        continue; // Try next endpoint
                    }
                }
                
                if (banksData && banksData.length > 0) {
                    setBanks(banksData);
                    console.log('Using API banks data:', banksData.length, 'banks');
                } else {
                    console.log('No banks data from API, using fallback');
                    setBanks(fallbackBanks);
                }
            } catch (error) {
                console.error('Error fetching banks:', error);
                console.log('Using fallback banks due to error');
                setBanks(fallbackBanks);
            } finally {
                setLoadingBanks(false);
            }
        };

        fetchBanks();
    }, []);

    // Pre-populate account name with employee's full name
    useEffect(() => {
        if (employeeData) {
            setFormData(prev => ({
                ...prev,
                accountName: `${employeeData.first_name} ${employeeData.last_name}`.trim()
            }));
        }
    }, [employeeData]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: type === 'number' ? parseFloat(value) || 0 : value
        }));
    };

    const handleSelectChange = (key: keyof SalaryFormData, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleCheckboxChange = (key: keyof SalaryFormData, checked: boolean) => {
        setFormData(prev => ({ ...prev, [key]: checked }));
    };

    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const getEmploymentTypeDisplay = (type: string): string => {
        switch (type) {
            case 'FULL_TIME': return 'Full Time';
            case 'PART_TIME': return 'Part Time';
            case 'CONTRACT': return 'Contract';
            case 'INTERN': return 'Intern';
            default: return type;
        }
    };

    const getDeductionsText = (): string => {
        const deductions = [];
        if (formData.isPayeApplicable) deductions.push('PAYE');
        if (formData.isPensionApplicable) deductions.push('Pension');
        if (formData.isNhfApplicable) deductions.push('NHF');
        if (formData.isNsitfApplicable) deductions.push('NSITF');
        return deductions.length > 0 ? deductions.join(', ') : 'None';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Basic validation
        const requiredFields = ['payGradeName', 'payFrequency', 'customSalary', 'bankName', 'accountNumber', 'accountName'];
        const missingFields = requiredFields.filter(field => {
            const value = formData[field as keyof SalaryFormData];
            return !value || (typeof value === 'string' && value.trim() === '');
        });

        if (missingFields.length > 0) {
            alert(`Please fill in the following required fields: ${missingFields.join(', ')}`);
            return;
        }

        if (formData.customSalary <= 0) {
            alert('Please enter a valid salary amount');
            return;
        }

        setIsSubmitting(true);

        try {
            // Use tenant-based URL similar to the employee endpoints
            const baseUrl = `http://${tenant}.localhost:8000`;
            
            // Prepare combined employee and salary data for API
            const combinedData = {
                // Employee data
                ...employeeData,
                // Salary data
                pay_grade_name: formData.payGradeName,
                pay_frequency: formData.payFrequency,
                custom_salary: formData.customSalary,
                bank_name: formData.bankName,
                account_number: formData.accountNumber,
                account_name: formData.accountName,
                is_paye_applicable: formData.isPayeApplicable,
                is_pension_applicable: formData.isPensionApplicable,
                is_nhf_applicable: formData.isNhfApplicable,
                is_nsitf_applicable: formData.isNsitfApplicable
            };

            console.log('Submitting combined employee and salary data:', combinedData);

            let response;
            
            if (isEdit && existingEmployeeId) {
                // Update existing employee with salary data
                console.log('Updating employee with ID:', existingEmployeeId);
                response = await axios.put(
                    `${baseUrl}/tenant/employee/update/${existingEmployeeId}`,
                    combinedData,
                    { headers: { 'Content-Type': 'application/json' } }
                );
                console.log('Employee updated with salary data:', response.data);
                alert('Employee updated successfully with salary information!');
            } else {
                // Create new employee with salary data
                console.log('Creating new employee with salary data...');
                response = await axios.post(
                    `${baseUrl}/tenant/employee/create`,
                    combinedData,
                    { headers: { 'Content-Type': 'application/json' } }
                );
                console.log('Employee created with salary data:', response.data);
                alert('Employee created successfully with salary information!');
            }

            // Call parent's onSubmit handler
            console.log('Calling parent onSubmit...');
            await parentOnSubmit(combinedData);
            
            // Call the salary form's onSubmit
            await onSubmit(combinedData);

            console.log('Success! Employee and salary data saved.');
            onClose();

        } catch (error) {
            console.error('Error saving employee and salary data:', error);
            
            if (axios.isAxiosError(error)) {
                console.error('Response status:', error.response?.status);
                console.error('Response data:', error.response?.data);
                
                if (error.response?.status === 422) {
                    alert(`Validation Error: ${JSON.stringify(error.response.data, null, 2)}`);
                } else {
                    alert(`Failed to save employee and salary data: ${error.response?.data?.message || error.message}`);
                }
            } else {
                alert('Failed to save employee and salary data: Unknown error');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className='ml-auto h-full w-full max-w-2xl bg-white p-6 overflow-y-auto'>
            <div className='mb-8'>
                <div className='flex items-center gap-4 mb-4'>
                    <Button
                        type='button'
                        variant='ghost'
                        onClick={onBack}
                        className='p-2 hover:bg-gray-100 rounded-full'
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </Button>
                    <div>
                        <h1 className='text-2xl font-bold'>Salary Setup</h1>
                        <p className='text-sm text-muted-foreground'>
                            Configure salary and bank details for {employeeData?.first_name} {employeeData?.last_name}
                        </p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className='space-y-8'>
                <div className='space-y-4'>
                    <Label htmlFor='payGradeName'>Pay grade</Label>
                    <Input 
                        id='payGradeName' 
                        value={formData.payGradeName}
                        onChange={handleInputChange}
                        required
                    />
                    <p className='text-xs text-muted-foreground'>
                        Pay grades are templates for employees with the same pay components. Default ones exist by pay frequency, but you can also create custom grades.
                    </p>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div className='space-y-2'>
                        <Label>Pay Frequency</Label>
                        <Select 
                            value={formData.payFrequency}
                            onValueChange={(val) => handleSelectChange('payFrequency', val as 'MONTHLY' | 'WEEKLY' | 'BIWEEKLY')}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder='Select pay frequency' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='MONTHLY'>Monthly</SelectItem>
                                <SelectItem value='BIWEEKLY'>Bi-weekly</SelectItem>
                                <SelectItem value='WEEKLY'>Weekly</SelectItem>
                            </SelectContent>
                        </Select>
                        <p className='text-xs text-muted-foreground'>
                            Pay frequency determines how the salary is split and paid out.
                        </p>
                    </div>

                    <div className='space-y-2'>
                        <Label htmlFor='customSalary'>Salary amount</Label>
                        <Input 
                            id='customSalary' 
                            type='number'
                            value={formData.customSalary}
                            onChange={handleInputChange}
                            min="0"
                            step="1000"
                            required
                        />
                        <p className='text-xs text-muted-foreground'>
                            Amount: {formatCurrency(formData.customSalary)}
                        </p>
                    </div>
                </div>

                <div className='space-y-4'>
                    <h2 className='text-lg font-semibold'>Bank Details</h2>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <div className='space-y-2'>
                            <Label>Bank name</Label>
                            <Select 
                                value={formData.bankName}
                                onValueChange={(val) => handleSelectChange('bankName', val)}
                                disabled={loadingBanks}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={loadingBanks ? 'Loading banks...' : 'Select bank'} />
                                </SelectTrigger>
                                <SelectContent>
                                    {banks.map((bank) => (
                                        <SelectItem key={bank.code} value={bank.name}>
                                            {bank.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className='space-y-2'>
                            <Label htmlFor='accountNumber'>Account number</Label>
                            <Input 
                                id='accountNumber' 
                                value={formData.accountNumber}
                                onChange={handleInputChange}
                                maxLength={10}
                                pattern="[0-9]{10}"
                                placeholder="Enter 10-digit account number"
                                required 
                            />
                        </div>

                        <div className='space-y-2 md:col-span-2'>
                            <Label htmlFor='accountName'>Account name</Label>
                            <Input 
                                id='accountName' 
                                value={formData.accountName}
                                onChange={handleInputChange}
                                required 
                            />
                        </div>
                    </div>
                </div>

                <div className='space-y-4'>
                    <h2 className='text-lg font-semibold'>Tax & Deductions</h2>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div className='flex items-center space-x-2'>
                            <Checkbox 
                                id='isPayeApplicable'
                                checked={formData.isPayeApplicable}
                                onCheckedChange={(checked) => handleCheckboxChange('isPayeApplicable', checked as boolean)}
                            />
                            <Label htmlFor='isPayeApplicable'>PAYE (Pay As You Earn)</Label>
                        </div>

                        <div className='flex items-center space-x-2'>
                            <Checkbox 
                                id='isPensionApplicable'
                                checked={formData.isPensionApplicable}
                                onCheckedChange={(checked) => handleCheckboxChange('isPensionApplicable', checked as boolean)}
                            />
                            <Label htmlFor='isPensionApplicable'>Pension Contribution</Label>
                        </div>

                        <div className='flex items-center space-x-2'>
                            <Checkbox 
                                id='isNhfApplicable'
                                checked={formData.isNhfApplicable}
                                onCheckedChange={(checked) => handleCheckboxChange('isNhfApplicable', checked as boolean)}
                            />
                            <Label htmlFor='isNhfApplicable'>NHF (National Housing Fund)</Label>
                        </div>

                        <div className='flex items-center space-x-2'>
                            <Checkbox 
                                id='isNsitfApplicable'
                                checked={formData.isNsitfApplicable}
                                onCheckedChange={(checked) => handleCheckboxChange('isNsitfApplicable', checked as boolean)}
                            />
                            <Label htmlFor='isNsitfApplicable'>NSITF (Industrial Training Fund)</Label>
                        </div>
                    </div>
                </div>

                <div className='rounded-md bg-blue-50 p-4 space-y-1 text-sm'>
                    <h3 className='font-semibold text-blue-700'>Summary</h3>
                    <p><span className='font-medium'>Employee</span>: {employeeData?.first_name} {employeeData?.last_name}</p>
                    <p><span className='font-medium'>Position</span>: {employeeData?.job_title}</p>
                    <p><span className='font-medium'>Employment Type</span>: {getEmploymentTypeDisplay(employeeData?.employment_type)}</p>
                    <p><span className='font-medium'>Salary</span>: {formatCurrency(formData.customSalary)}</p>
                    <p><span className='font-medium'>Pay Frequency</span>: {formData.payFrequency.charAt(0) + formData.payFrequency.slice(1).toLowerCase().replace('_', '-')}</p>
                    <p><span className='font-medium'>Deductions</span>: {getDeductionsText()}</p>
                    <p><span className='font-medium'>Bank</span>: {formData.bankName}</p>
                    <p><span className='font-medium'>Account</span>: {formData.accountNumber} - {formData.accountName}</p>
                </div>

                <div className='flex justify-end gap-4 pt-4'>
                    <Button 
                        variant='outline' 
                        type='button' 
                        onClick={onClose}
                        disabled={isSubmitting}
                        className='text-muted-foreground'
                    >
                        Close
                    </Button>
                    <Button 
                        type='submit' 
                        disabled={isSubmitting}
                        className='bg-[#3D56A8] hover:bg-[#2E4299]'
                    >
                        {isSubmitting ? 'Saving...' : 'Save'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default SalarySetupForm;