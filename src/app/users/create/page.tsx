'use client';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { TextField, Button, Select, MenuItem, Checkbox, FormControlLabel, Typography, SelectChangeEvent } from '@mui/material';
import { IUserForm } from 'database/models/User';

const CreateUserPage: React.FC = () => {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();

  const [formData, setFormData] = useState<IUserForm>({
    username: '',
    email: '',
    password: '',
    roles: [],
    account: '',  // Initial value set to empty string to match IUserForm type
    suspended: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Update form data only if account ID exists in the session
    if (sessionStatus === 'authenticated' && session?.user?.account) {
      setFormData(f => ({ ...f, account: session.user.account as string }));  // Cast to string if absolutely sure it's never undefined
    }
  }, [session, sessionStatus]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (event: SelectChangeEvent<string[]>) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/users/new', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }, // Ensure content type is set
        body: JSON.stringify(formData), // Ensure body is stringified
      });

      if (!response.ok) {
        throw new Error(`Failed to create user: ${await response.text()}`);
      }

      router.push('/users'); // Redirect to the users list page on success
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
};


  return (
    <div>
      <Typography variant="h4">Create New User</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
          fullWidth
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          fullWidth
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
          fullWidth
        />
        {/* Assuming roles are predefined, you can use Select or other component */}
        <Select
  name="roles"
  value={formData.roles}
  onChange={handleSelectChange} // Use the new handler here
  multiple
  fullWidth
>
  <MenuItem value="admin">Admin</MenuItem>
  <MenuItem value="product">Product</MenuItem>
  <MenuItem value="qa">QA</MenuItem>
  <MenuItem value="dev">Developer</MenuItem>
</Select>
        <FormControlLabel
          control={<Checkbox checked={formData.suspended} onChange={handleChange} name="suspended" />}
          label="Suspended"
        />
        <Button type="submit" disabled={loading}>
          Create User
        </Button>
      </form>
      {error && <Typography color="error">{error}</Typography>}
    </div>
  );
};

export default CreateUserPage;
