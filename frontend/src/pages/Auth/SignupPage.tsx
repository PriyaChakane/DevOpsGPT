import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, GitFork, Mail, Loader2 } from 'lucide-react';
import { AuthLayout } from './AuthLayout';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';

const signupSchema = z
  .object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Please confirm your password'),
    acceptTerms: z.boolean().refine((val) => val === true, { message: 'You must accept the terms to continue' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { signup } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { fullName: '', email: '', password: '', confirmPassword: '', acceptTerms: false },
  });

  const onSubmit = async (values: SignupFormValues) => {
    try {
      await signup(values);
      showToast({ variant: 'success', title: 'Account created', description: 'Welcome to DevOpsGPT!' });
      navigate('/dashboard', { replace: true });
    } catch {
      showToast({ variant: 'error', title: 'Signup failed', description: 'Please try again.' });
    }
  };

  return (
    <AuthLayout title="Create your account" subtitle="Start debugging with AI-powered root cause analysis">
      <div className="mb-5 grid grid-cols-2 gap-3">
        <button type="button" className="btn-secondary text-sm">
          <Mail size={15} />
          Google
        </button>
        <button type="button" className="btn-secondary text-sm">
          <GitFork size={15} />
          GitHub
        </button>
      </div>

      <div className="mb-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-text-muted">or continue with email</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <label htmlFor="fullName" className="mb-1.5 block text-xs font-medium text-text-secondary">
            Full name
          </label>
          <input
            id="fullName"
            type="text"
            autoComplete="name"
            placeholder="Jordan Rivera"
            className="input-field"
            aria-invalid={!!errors.fullName}
            {...register('fullName')}
          />
          {errors.fullName && <p className="mt-1.5 text-xs text-danger">{errors.fullName.message}</p>}
        </div>

        <div>
          <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-text-secondary">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            className="input-field"
            aria-invalid={!!errors.email}
            {...register('email')}
          />
          {errors.email && <p className="mt-1.5 text-xs text-danger">{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-text-secondary">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="••••••••"
              className="input-field pr-10"
              aria-invalid={!!errors.password}
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <p className="mt-1.5 text-xs text-danger">{errors.password.message}</p>}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="mb-1.5 block text-xs font-medium text-text-secondary">
            Confirm password
          </label>
          <input
            id="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="••••••••"
            className="input-field"
            aria-invalid={!!errors.confirmPassword}
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && <p className="mt-1.5 text-xs text-danger">{errors.confirmPassword.message}</p>}
        </div>

        <div>
          <label className="flex items-start gap-2 text-sm text-text-secondary">
            <input type="checkbox" className="mt-0.5 h-4 w-4 rounded border-border bg-bg-elevated accent-primary" {...register('acceptTerms')} />
            I agree to the Terms of Service and Privacy Policy
          </label>
          {errors.acceptTerms && <p className="mt-1.5 text-xs text-danger">{errors.acceptTerms.message}</p>}
        </div>

        <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
          {isSubmitting && <Loader2 size={16} className="animate-spin" />}
          {isSubmitting ? 'Creating account...' : 'Sign up'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-text-secondary">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-primary hover:underline">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}
