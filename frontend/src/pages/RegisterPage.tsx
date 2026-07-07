import { useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { AuthShell } from '../components/AuthShell';
import { FormField } from '../components/FormField';
import { useAuth } from '../hooks/useAuth';
import { parseApiError, type FormErrors } from '../services/apiError';
import type { RegisterCredentials } from '../types/auth.types';

const initialForm: RegisterCredentials = {
  name: '',
  email: '',
  password: '',
};

function validateRegisterForm(form: RegisterCredentials) {
  const errors: FormErrors = {};

  if (!form.name.trim()) {
    errors.name = 'Name is required.';
  }

  if (!form.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
    errors.email = 'Enter a valid email address.';
  }

  if (!form.password) {
    errors.password = 'Password is required.';
  } else if (form.password.length < 8) {
    errors.password = 'Password must be at least 8 characters long.';
  }

  return errors;
}

export function RegisterPage() {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError('');

    const errors = validateRegisterForm(form);
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      setIsSubmitting(true);
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      navigate('/dashboard', { replace: true });
    } catch (error) {
      const parsedError = parseApiError(error);
      setFormError(parsedError.message);
      setFieldErrors(parsedError.fieldErrors);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Start improving your resume and interview readiness from one clean workspace."
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        {formError ? (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {formError}
          </div>
        ) : null}

        <FormField
          id="name"
          label="Name"
          type="text"
          autoComplete="name"
          value={form.name}
          error={fieldErrors.name}
          onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
        />

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
          autoComplete="new-password"
          value={form.password}
          error={fieldErrors.password}
          onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Creating account...' : 'Register'}
        </button>

        <p className="text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link className="font-semibold text-cyan-700 hover:text-cyan-800" to="/login">
            Log in
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
