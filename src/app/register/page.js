'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from '../../i18n/useTranslation';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    setError('');
    setSuccess('');

    if (password !== passwordConfirmation) {
      setError(t('auth.passwordsDoNotMatch'));
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/sign_up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          password_confirmation: passwordConfirmation,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || t('auth.registrationFailed'));
      }

      const data = await response.json();

      setSuccess(t('auth.accountCreated'));
      setEmail('');
      setPassword('');
      setPasswordConfirmation('');

      setTimeout(() => {
        router.push('/login');
      }, 2000);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="card w-full max-w-md bg-base-100 shadow-2xl border border-base-300">
        <div className="card-body p-8">
          <div className="text-center mb-6">
            <div className="avatar placeholder mb-4">
              <div className="bg-secondary text-secondary-content rounded-full w-16">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold">{t('auth.createAccount')}</h1>
            <p className="text-base-content/70">{t('auth.joinUsToExplore')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="alert alert-error">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="alert alert-success">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{success}</span>
              </div>
            )}

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">{t('auth.email')}</span>
              </label>
              <input
                type="email"
                placeholder={t('auth.enterEmail')}
                className="input input-bordered w-full focus:input-primary transition-colors"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">{t('auth.password')}</span>
              </label>
              <input
                type="password"
                placeholder={t('auth.enterPassword')}
                className="input input-bordered w-full focus:input-primary transition-colors"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength="6"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">{t('auth.confirmPassword')}</span>
              </label>
              <input
                type="password"
                placeholder={t('auth.confirmYourPassword')}
                className="input input-bordered w-full focus:input-primary transition-colors"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                required
                minLength="6"
              />
            </div>

            <div className="form-control mt-8">
              <button
                type="submit"
                className={`btn btn-secondary w-full ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? t('auth.creatingAccount') : t('auth.createAccount')}
              </button>
            </div>
          </form>

          <div className="divider">OR</div>

          <div className="text-center">
            <p className="text-sm text-base-content/70 mb-2">
              {t('auth.alreadyHaveAccount')}
            </p>
            <Link href="/login" className="btn btn-outline btn-sm">
              {t('auth.signIn')}
            </Link>
          </div>

          <div className="text-center mt-4">
            <Link href="/" className="link link-primary text-sm">
              {t('auth.backToHome')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
