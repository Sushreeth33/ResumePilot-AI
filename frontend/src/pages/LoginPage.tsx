import { useState, type FormEvent } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthShell } from '../components/AuthShell';
import { FormField } from '../components/FormField';
import { useAuth } from '../hooks/useAuth';
import { parseApiError, type FormErrors } from '../services/apiError';
import type { LoginCredentials } from '../types/auth.types';

const initialForm: LoginCredentials = {
  email: '',
  password: '',
};

function validateLoginForm(form: LoginCredentials) {
  const errors: FormErrors = {};

  if (!form.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
    errors.email = 'Enter a valid email address.';
  }

  if (!form.password) {
    errors.password = 'Password is required.';
  }

  return errors;
}

export function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState(initialForm);
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = (location.state as { from?: Location } | null)?.from?.pathname ?? '/dashboard';

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError('');

    const errors = validateLoginForm(form);
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      setIsSubmitting(true);
      await login({
        email: form.email.trim(),
        password: form.password,
      });
      navigate(from, { replace: true });
    } catch (error) {
      const parsedError = parseApiError(error);
      setFormError(parsedError.message);
      setFieldErrors(parsedError.fieldErrors);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthShell title="Welcome back" subtitle="Log in to continue to your ResumePilot dashboard.">
      <form className="space-y-5" onSubmit={handleSubmit}>
        {formError ? (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {formError}
          </div>
        ) : null}

        <FormField
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          value={form.email}
          error={fieldErrors.email}
          onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
        />

        <FormField
          id="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          value={form.password}
          error={fieldErrors.password}
          onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Logging in...' : 'Login'}
        </button>

        <p className="text-center text-sm text-slate-600">
          New to ResumePilot AI?{' '}
          <Link className="font-semibold text-cyan-700 hover:text-cyan-800" to="/register">
            Create an account
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
