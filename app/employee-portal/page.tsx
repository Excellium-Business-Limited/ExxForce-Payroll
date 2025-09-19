"use client";
import React, { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { useGlobal } from '@/app/Context/context';
// Reuse EmployeeDetails components where possible
import TopBar from '../(tenant)/EmployeeDetails/components/TopBar';
import ProfileHeader from '../(tenant)/EmployeeDetails/components/ProfileHeader';
// import TabsNav from '../(tenant)/EmployeeDetails/components/TabsNav'; // removed: we'll use a portal-specific tabs nav
import GeneralTab from '../(tenant)/EmployeeDetails/components/tabs/GeneralTab';
import DocumentsList from '../(tenant)/components/DocumentsList';
import LoansTab from '../(tenant)/EmployeeDetails/components/tabs/LoansTab';
import LeaveTab from '../(tenant)/EmployeeDetails/components/tabs/LeaveTab';
import PaymentHistoryDisplay, { PaymentRecord } from '../(tenant)/components/PaymentHistoryDisplay';
import LeaveRequestPanel from '../(tenant)/EmployeeDetails/components/panels/LeaveRequestPanel';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Loading from '@/components/ui/Loading';
import LoanForm from '../(tenant)/Loan/loanForm';

type TabId = 'general' | 'document' | 'loan' | 'leave' | 'payment-history';

// New: Portal-specific TabsNav (payroll excluded)
function PortalTabsNav({
  active,
  onChange,
  disabled,
}: {
  active: TabId;
  onChange: (t: TabId) => void;
  disabled?: boolean;
}) {
  const tabs: { id: TabId; label: string }[] = [
    { id: 'general', label: 'General' },
    { id: 'document', label: 'Document' },
    { id: 'loan', label: 'Loan' },
    { id: 'leave', label: 'Leave' },
    { id: 'payment-history', label: 'Payment History' },
  ];
  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto">
        <nav className="flex space-x-8 px-6" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                active === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
              disabled={disabled}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}

export default function EmployeePortalPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const employeeId = searchParams.get('id');
  const { tenant, globalState } = useGlobal();

  const [activeTab, setActiveTab] = useState<TabId>('general');
  const [employee, setEmployee] = useState<any | null>(null);
  const [isLoadingEmployeeDetail, setIsLoadingEmployeeDetail] = useState<boolean>(true);

  // Leave-related state
  const [leaveRequests, setLeaveRequests] = useState<any[]>([]);
  const [showLeaveRequestForm, setShowLeaveRequestForm] = useState<boolean>(false);
  const [isLoadingLeaveRequests, setIsLoadingLeaveRequests] = useState<boolean>(false);

  // Loan-related state
  const [loans, setLoans] = useState<any[]>([]);
  const [isLoadingLoans, setIsLoadingLoans] = useState<boolean>(false);
  const [showLoanForm, setShowLoanForm] = useState<boolean>(false);

  const formatCurrency = (amount: number | undefined | null) => {
    if (amount === null || amount === undefined || isNaN(amount)) return '--';
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 2 }).format(amount).replace('NGN', '\u20a6');
  };

  const formatDate = (dateString?: string) => {
    if (!dateString || dateString === 'null' || dateString === 'undefined') return '--';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '--';
      return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch {
      return '--';
    }
  };

  const getEmployeeType = (employmentType: string) => {
    switch (employmentType) {
      case 'FULL_TIME':
        return 'Full Time';
      case 'PART_TIME':
        return 'Part Time';
      case 'CONTRACT':
        return 'Contract';
      case 'INTERN':
        return 'Intern';
      default:
        return employmentType;
    }
  };

  const getPayFrequency = (frequency: string) => {
    switch (frequency) {
      case 'MONTHLY':
        return 'Monthly';
      case 'WEEKLY':
        return 'Weekly';
      case 'BIWEEKLY':
        return 'Biweekly';
      default:
        return frequency;
    }
  };

  const getDepartmentValue = (emp: any): string => {
    if (!emp) return '';
    return emp.department || emp.department_name || '';
  };

  const getSalaryValue = (emp: any): number => {
    if (!emp) return 0;
    return emp.effective_gross ?? emp.gross_salary ?? emp.custom_salary ?? 0;
  };

  const getLoanStatus = (status: string) => {
    const s = (status || '').toLowerCase();
    return { label: s.charAt(0).toUpperCase() + s.slice(1), color: 'bg-blue-100 text-blue-800' };
  };

  const isAnyFormOpen = showLeaveRequestForm || showLoanForm; // view-only elsewhere

  const handleTabChange = (newTab: TabId) => {
    if (isAnyFormOpen) {
      alert('Please save or cancel the current form before switching tabs.');
      return;
    }
    setActiveTab(newTab);
  };

  const fetchEmployeeDetail = async () => {
    if (!employeeId || !tenant || !globalState.accessToken) return;
    try {
      setIsLoadingEmployeeDetail(true);
      const baseURL = `${tenant}.exxforce.com`;
      const response = await axios.get(
        `https://${baseURL}/tenant/employee/detail/${employeeId}`,
        { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${globalState.accessToken}` } }
      );
      if (response.data) setEmployee(response.data);
    } catch (e) {
      console.error('Error fetching employee detail:', e);
      setEmployee(null);
    } finally {
      setIsLoadingEmployeeDetail(false);
    }
  };

  const fetchLeaveRequests = async () => {
    if (!employeeId) return;
    try {
      setIsLoadingLeaveRequests(true);
      const response = await axios.get(
        `https://${tenant}.exxforce.com/tenant/leave/employee/${employeeId}/leaves`,
        { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${globalState.accessToken}` } }
      );
      const d = response.data;
      const list = Array.isArray(d) ? d : d?.data || d?.leaves || [];
      setLeaveRequests(list);
    } catch (e) {
      console.error('Error fetching leave requests:', e);
      setLeaveRequests([]);
    } finally {
      setIsLoadingLeaveRequests(false);
    }
  };

  const fetchLoans = async () => {
    if (!employeeId) return;
    try {
      setIsLoadingLoans(true);
      const response = await axios.get(
        `https://${tenant}.exxforce.com/tenant/loans/${employeeId}/loans`,
        { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${globalState.accessToken}` } }
      );
      const d = response.data;
      const list = d?.loans && Array.isArray(d.loans) ? d.loans : Array.isArray(d) ? d : d?.data || [];
      setLoans(list);
    } catch (e) {
      console.error('Error fetching loans:', e);
      setLoans([]);
    } finally {
      setIsLoadingLoans(false);
    }
  };

  // View-only: disable edit handlers
  const noop = () => {};

  const handleRequestLeave = () => setShowLeaveRequestForm(true);
  const handleCloseLeaveRequestForm = () => setShowLeaveRequestForm(false);
  const handleLeaveRequestSubmit = async (_data: any) => {
    try {
      await fetchLeaveRequests();
      setShowLeaveRequestForm(false);
    } catch (e) {
      console.error('Error submitting leave request:', e);
    }
  };

  // Add Loan should open LoanForm overlay instead of redirect
  const handleAddLoan = () => setShowLoanForm(true);
  const handleCloseLoanForm = () => setShowLoanForm(false);

  // Back navigates out of portal to home/dashboard
  const onBack = () => router.push('/');
  const handleEndEmployment = () => {};

  useEffect(() => {
    if (employeeId) fetchEmployeeDetail();
  }, [employeeId, tenant, globalState.accessToken]);

  useEffect(() => {
    if (activeTab === 'leave' && employee?.employee_id) fetchLeaveRequests();
  }, [activeTab, employee?.employee_id]);

  useEffect(() => {
    if (activeTab === 'loan' && employee?.employee_id) fetchLoans();
  }, [activeTab, employee?.employee_id]);

  // Normalize for PaymentHistoryDisplay
  const payrollEmployee = useMemo(() => {
    if (!employee) return null;
    const eg = (employee as any).effective_gross ?? (employee as any).payroll_data?.gross_salary ?? (employee as any).gross_salary ?? (employee as any).custom_salary ?? '0';
    const salary_components = (employee as any).salary_components ?? (employee as any).payroll_data?.earnings ?? [];
    const deduction_components = (employee as any).deduction_components ?? (employee as any).payroll_data?.deductions ?? [];
    const benefits = (employee as any).benefits ?? (employee as any).payroll_data?.benefits ?? [];
    return {
      ...employee,
      effective_gross: String(eg),
      salary_components,
      deduction_components,
      benefits,
      payroll_data: employee.payroll_data ?? {
        earnings: salary_components,
        deductions: deduction_components,
        benefits,
        gross_salary: Number(eg) || 0,
      },
    } as any;
  }, [employee]);

  if (isLoadingEmployeeDetail) {
    return (
      <div className='bg-white w-full h-full overflow-hidden flex flex-col'>
        <div className='flex items-center justify-center min-h-[400px]'>
          <Loading message='Loading Employee...' size='medium' variant='spinner' overlay={false} />
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className='bg-white w-full h-full overflow-hidden flex flex-col'>
        <div className='flex items-center justify-center min-h-[400px]'>
          <div className='text-center'>
            <h2 className='text-2xl font-semibold text-red-600'>Employee Not Found</h2>
            <button className='mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700' onClick={onBack}>Back</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-white w-full h-full overflow-hidden flex flex-col'>
      <TopBar isLoading={isLoadingEmployeeDetail} onBack={onBack} onEndEmployment={handleEndEmployment} />

      <ProfileHeader firstName={employee.first_name} lastName={employee.last_name} jobTitle={employee.job_title} employeeId={employee.employee_id} />

      {/* Payroll tab excluded: use portal tabs */}
      <PortalTabsNav active={activeTab} onChange={(t) => handleTabChange(t)} disabled={isAnyFormOpen} />

      <div className='flex-1 overflow-hidden relative'>
        <div className={`${isAnyFormOpen ? 'w-1/2' : 'w-full'} h-full overflow-y-auto bg-gray-50 transition-all duration-300`}>
          <div className='max-w-7xl mx-auto p-6'>
            {activeTab === 'general' && (
              <div className="portal-readonly">
                <GeneralTab
                  employee={employee}
                  formatDate={formatDate as any}
                  getDepartmentValue={getDepartmentValue}
                  getEmployeeType={getEmployeeType as any}
                  getPayFrequency={getPayFrequency as any}
                  onEditGeneral={noop}
                  onEditSalary={noop}
                  formatCurrency={formatCurrency as any}
                  getSalaryValue={getSalaryValue}
                />
              </div>
            )}

            {activeTab === 'document' && (
              <div className="portal-readonly">
                <DocumentsList employee={employee} onUploadDocument={() => { /* view-only */ }} />
              </div>
            )}

            {activeTab === 'loan' && (
              <LoansTab
                employee={employee as any}
                loans={loans as any}
                isLoading={isLoadingLoans}
                getLoanStatus={getLoanStatus}
                formatCurrency={(n) => formatCurrency(n) as any}
                formatDate={formatDate}
                onAddLoan={handleAddLoan}
              />
            )}

            {activeTab === 'leave' && (
              <LeaveTab employee={employee as any} leaveRequests={leaveRequests} isLoading={isLoadingLeaveRequests} onRequestLeave={handleRequestLeave} />
            )}

            {activeTab === 'payment-history' && (
              <div className="portal-readonly">
                <PaymentHistoryDisplay employee={payrollEmployee} onGeneratePayslip={() => {}} />
              </div>
            )}
          </div>
        </div>

        {/* Loan form inside Dialog to satisfy DialogClose context */}
        <Dialog open={showLoanForm} onOpenChange={(open) => setShowLoanForm(open)}>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Add Loan - {employee.first_name} {employee.last_name}</DialogTitle>
            </DialogHeader>
            <LoanForm />
          </DialogContent>
        </Dialog>

        {/* Right overlay: Leave Request (kept as is) */}
        {showLeaveRequestForm && (
          <LeaveRequestPanel employee={employee} onClose={handleCloseLeaveRequestForm} onSubmit={handleLeaveRequestSubmit} />
        )}
      </div>

      {/* Hide all action buttons in read-only sections */}
      <style jsx global>{`
        .portal-readonly button,
        .portal-readonly [role="button"],
        .portal-readonly a[role="button"],
        .portal-readonly a[class*="btn"],
        .portal-readonly .btn,
        .portal-readonly .Button,
        .portal-readonly [data-portal-action] {
          display: none !important;
        }
      `}</style>
    </div>
  );
}
