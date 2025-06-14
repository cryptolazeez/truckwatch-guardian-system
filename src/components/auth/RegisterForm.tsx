import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const registerSchema = z.object({
  companyName: z.string().optional(),
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters." }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match.",
  path: ["confirmPassword"],
});

export type RegisterFormValues = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  isLoading: boolean;
  onSubmit: (values: RegisterFormValues) => Promise<void>;
}

const RegisterForm: React.FC<RegisterFormProps> = () => {
  return (
    <div className="text-center p-4 border rounded-lg bg-muted">
      <h3 className="text-lg font-semibold">Registration Disabled</h3>
      <p className="text-sm text-muted-foreground mt-2">
        Public registration is not available at this time.
        <br />
        To get an account, please contact an administrator.
      </p>
    </div>
  );
};

export default RegisterForm;
