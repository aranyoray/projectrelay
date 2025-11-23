'use client'

import { FormEvent, useState } from 'react';
import { AuthService, validateEmail } from '@/lib/auth';

export default function AuthPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [signUp, setSignUp] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    async function handleSignIn() {
        setErrMsg('');

        // Client-side validation
        const emailError = validateEmail(email);
        if (emailError) {
            setErrMsg(emailError);
            return;
        }

        if (!password) {
            setErrMsg('Password is required');
            return;
        }

        setIsLoading(true);
        try {
            const { error } = await AuthService.signIn({ email, password });
            if (error) {
                console.error(error);
                setErrMsg('Incorrect email or password. Try again or reset your password.');
                return;
            }
            // Redirect on success
            window.location.href = '/projects';
        } catch (err) {
            console.error(err);
            setErrMsg('An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }

    function handleSignUp() {
        const emailError = validateEmail(email);
        if (emailError) {
            setErrMsg(emailError === 'Email is required'
                ? 'Enter your email so we can save your progress.'
                : emailError);
            return;
        }

        window.location.href = `/auth/sign-up?e=${encodeURIComponent(email)}`;
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (signUp) {
            handleSignUp();
        } else {
            handleSignIn();
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <aside className="auth-brand-panel">
                    <div className="auth-brand">
                        <span className="auth-brand-badge">Project Relay</span>
                        <h1 className="auth-brand-title">
                            {signUp ? 'Ready to build something meaningful?' : 'Welcome back.'}
                        </h1>
                        <p className="auth-brand-copy">
                            {signUp
                                ? 'Create your login so we can personalize the projects and mentors we recommend.'
                                : 'Pick up where you left off, track project progress, and stay connected with your mentors.'}
                        </p>
                    </div>
                    <div className="auth-mode-toggle">
                        <span>{signUp ? 'Already have a Project Relay account?' : 'New to Project Relay?'}</span>
                        <button
                            type="button"
                            className="auth-mode-button"
                            onClick={() => {
                                setErrMsg('');
                                setSignUp(!signUp);
                            }}
                        >
                            {signUp ? 'Sign in' : 'Create an account'}
                        </button>
                    </div>
                </aside>
                <div className="auth-form-panel">
                    <div className="auth-form-panel-inner">
                        <div className="auth-header">
                            <h2 className="auth-title">{signUp ? 'Create your login' : 'Sign in to Project Relay'}</h2>
                            <p className="auth-subtitle">
                                {signUp
                                    ? 'We’ll pre-fill your information on the next step to speed things up.'
                                    : 'Enter your details to access projects and your personalized dashboard.'}
                            </p>
                        </div>
                        <form className="auth-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Email</label>
                                <input
                                    className="form-input"
                                    type="email"
                                    value={email}
                                    onChange={(event) => {
                                        setEmail(event.target.value);
                                        if (errMsg) {
                                            setErrMsg('');
                                        }
                                    }}
                                    placeholder="email@projectrelay.org"
                                    aria-required="true"
                                />
                            </div>

                            {!signUp && (
                                <div className="form-group">
                                    <label className="form-label">Password</label>
                                    <input
                                        className="form-input"
                                        type="password"
                                        value={password}
                                        onChange={(event) => {
                                            setPassword(event.target.value);
                                            if (errMsg) {
                                                setErrMsg('');
                                            }
                                        }}
                                        placeholder="Enter your password"
                                        aria-required="true"
                                    />
                                </div>
                            )}

                            {errMsg && <div className="auth-error">{errMsg}</div>}

                            <button
                                type="submit"
                                className="submit-button auth-submit-button"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Signing in...' : (signUp ? 'Continue to sign up' : 'Sign in')}
                            </button>
                        </form>
                        {!signUp && (
                            <div className="auth-secondary-actions">
                                <button
                                    type="button"
                                    className="link-button"
                                    onClick={() => setSignUp(true)}
                                >
                                    Need a Project Relay account? Start here
                                </button>
                            </div>
                        )}
                        <div className="auth-guest-section">
                            <div className="auth-divider">
                                <span>or</span>
                            </div>
                            <button
                                type="button"
                                className="guest-button"
                                onClick={() => {
                                    localStorage.setItem('guestMode', 'true');
                                    window.location.href = '/projects';
                                }}
                            >
                                Continue as Guest
                            </button>
                            <p className="guest-disclaimer">
                                Browse projects without an account. Some features will be limited.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
