'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface IntegrationForm {
  zohoBooksApiKey?: string;
  zohoPeopleClientId?: string;
  zohoPeopleClientSecret?: string;
  businessCentralTenantId?: string;
  businessCentralClientId?: string;
  businessCentralClientSecret?: string;
}

export default function IntegrationsPage() {
  const [form, setForm] = useState<IntegrationForm>({});
  const tenant = typeof window !== 'undefined' ? localStorage.getItem('tenant') : null;
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

  const handleChange = (key: keyof IntegrationForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!tenant || !token) return alert('Missing tenant/auth');
    const res = await fetch(`https://${tenant}.exxforce.com/tenant/integrations/credentials`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(form),
    });
    if (!res.ok) return alert('Failed to save');
    alert('Saved');
  };

  return (
    <div className='p-6 space-y-4'>
      <h1 className='text-2xl font-semibold'>Integrations</h1>
      <p className='text-sm text-muted-foreground'>Configure Zoho Books, Zoho People, and Business Central.</p>

      <div className='grid gap-6 md:grid-cols-2'>
        <Card className='p-4 space-y-2'>
          <h3 className='font-medium'>Zoho Books</h3>
          <Input placeholder='API Key' onChange={(e) => handleChange('zohoBooksApiKey', e.target.value)} />
        </Card>

        <Card className='p-4 space-y-2'>
          <h3 className='font-medium'>Zoho People</h3>
          <Input placeholder='Client ID' onChange={(e) => handleChange('zohoPeopleClientId', e.target.value)} />
          <Input placeholder='Client Secret' type='password' onChange={(e) => handleChange('zohoPeopleClientSecret', e.target.value)} />
        </Card>

        <Card className='p-4 space-y-2'>
          <h3 className='font-medium'>Business Central</h3>
          <Input placeholder='Tenant ID' onChange={(e) => handleChange('businessCentralTenantId', e.target.value)} />
          <Input placeholder='Client ID' onChange={(e) => handleChange('businessCentralClientId', e.target.value)} />
          <Input placeholder='Client Secret' type='password' onChange={(e) => handleChange('businessCentralClientSecret', e.target.value)} />
        </Card>
      </div>

      <div>
        <Button onClick={handleSave}>Save</Button>
      </div>
    </div>
  );
}
