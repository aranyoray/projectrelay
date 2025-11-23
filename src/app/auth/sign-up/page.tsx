'use client'

import { useEffect, useState } from 'react';
import { AuthService, validateEmail, validatePassword, validateUsername, validateZipCode } from '@/lib/auth';

// US States and Territories
const US_STATES_AND_TERRITORIES = [
    { value: '', label: 'Select State' },
    { value: 'AL', label: 'Alabama' },
    { value: 'AK', label: 'Alaska' },
    { value: 'AZ', label: 'Arizona' },
    { value: 'AR', label: 'Arkansas' },
    { value: 'CA', label: 'California' },
    { value: 'CO', label: 'Colorado' },
    { value: 'CT', label: 'Connecticut' },
    { value: 'DE', label: 'Delaware' },
    { value: 'FL', label: 'Florida' },
    { value: 'GA', label: 'Georgia' },
    { value: 'HI', label: 'Hawaii' },
    { value: 'ID', label: 'Idaho' },
    { value: 'IL', label: 'Illinois' },
    { value: 'IN', label: 'Indiana' },
    { value: 'IA', label: 'Iowa' },
    { value: 'KS', label: 'Kansas' },
    { value: 'KY', label: 'Kentucky' },
    { value: 'LA', label: 'Louisiana' },
    { value: 'ME', label: 'Maine' },
    { value: 'MD', label: 'Maryland' },
    { value: 'MA', label: 'Massachusetts' },
    { value: 'MI', label: 'Michigan' },
    { value: 'MN', label: 'Minnesota' },
    { value: 'MS', label: 'Mississippi' },
    { value: 'MO', label: 'Missouri' },
    { value: 'MT', label: 'Montana' },
    { value: 'NE', label: 'Nebraska' },
    { value: 'NV', label: 'Nevada' },
    { value: 'NH', label: 'New Hampshire' },
    { value: 'NJ', label: 'New Jersey' },
    { value: 'NM', label: 'New Mexico' },
    { value: 'NY', label: 'New York' },
    { value: 'NC', label: 'North Carolina' },
    { value: 'ND', label: 'North Dakota' },
    { value: 'OH', label: 'Ohio' },
    { value: 'OK', label: 'Oklahoma' },
    { value: 'OR', label: 'Oregon' },
    { value: 'PA', label: 'Pennsylvania' },
    { value: 'RI', label: 'Rhode Island' },
    { value: 'SC', label: 'South Carolina' },
    { value: 'SD', label: 'South Dakota' },
    { value: 'TN', label: 'Tennessee' },
    { value: 'TX', label: 'Texas' },
    { value: 'UT', label: 'Utah' },
    { value: 'VT', label: 'Vermont' },
    { value: 'VA', label: 'Virginia' },
    { value: 'WA', label: 'Washington' },
    { value: 'WV', label: 'West Virginia' },
    { value: 'WI', label: 'Wisconsin' },
    { value: 'WY', label: 'Wyoming' },
    { value: 'DC', label: 'District of Columbia' },
    { value: 'AS', label: 'American Samoa' },
    { value: 'GU', label: 'Guam' },
    { value: 'MP', label: 'Northern Mariana Islands' },
    { value: 'PR', label: 'Puerto Rico' },
    { value: 'VI', label: 'U.S. Virgin Islands' }
];

// Education Status
const EDUCATION_STATUS = [
    { value: '', label: 'Select Education Status' },
    { value: 'K', label: 'Kindergarten' },
    { value: '1', label: '1st Grade' },
    { value: '2', label: '2nd Grade' },
    { value: '3', label: '3rd Grade' },
    { value: '4', label: '4th Grade' },
    { value: '5', label: '5th Grade' },
    { value: '6', label: '6th Grade' },
    { value: '7', label: '7th Grade' },
    { value: '8', label: '8th Grade' },
    { value: '9', label: '9th Grade' },
    { value: '10', label: '10th Grade' },
    { value: '11', label: '11th Grade' },
    { value: '12', label: '12th Grade' },
    { value: 'college_freshman', label: 'College Freshman' },
    { value: 'college_sophomore', label: 'College Sophomore' },
    { value: 'college_junior', label: 'College Junior' },
    { value: 'college_senior', label: 'College Senior' },
    { value: 'graduate_student', label: 'Graduate Student' },
    { value: 'postgraduate', label: 'Postgraduate' },
    { value: 'alumni', label: 'Alumni' }
];

export default function SignUpPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [grade, setGrade] = useState('');
    const [zip, setZip] = useState('');
    const [state, setState] = useState('');
    const [highSchool, setHighSchool] = useState('');
    const [username, setUsername] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isDetectingLocation, setIsDetectingLocation] = useState(false);
    const [lookingForProject, setLookingForProject] = useState(false);
    const [manualEntryMode, setManualEntryMode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Auto-fill email from URL search params
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const emailParam = params.get('e');
            if (emailParam) {
                setEmail(decodeURIComponent(emailParam));
            }
        }
    }, []);

    async function detectLocation() {
        setIsDetectingLocation(true);
        setErrMsg('');

        if (!navigator.geolocation) {
            setErrMsg('Geolocation is not supported by your browser.');
            setIsDetectingLocation(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;

                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
                        {
                            headers: {
                                'User-Agent': 'ProjectRelay/1.0'
                            }
                        }
                    );

                    if (!response.ok) {
                        throw new Error('Failed to fetch location data');
                    }

                    const data = await response.json();
                    const address = data.address;

                    if (address.postcode) {
                        setZip(address.postcode);
                    }

                    const stateName = address.state || address.region;
                    if (stateName) {
                        const stateMatch = US_STATES_AND_TERRITORIES.find(
                            (s) =>
                                s.label.toLowerCase() === stateName.toLowerCase() ||
                                s.value.toLowerCase() === stateName.toLowerCase()
                        );

                        if (stateMatch && stateMatch.value) {
                            setState(stateMatch.value);
                        } else {
                            const partialMatch = US_STATES_AND_TERRITORIES.find(
                                (s) =>
                                    stateName.toLowerCase().includes(s.label.toLowerCase()) ||
                                    s.label.toLowerCase().includes(stateName.toLowerCase())
                            );
                            if (partialMatch && partialMatch.value) {
                                setState(partialMatch.value);
                            }
                        }
                    }
                } catch (error) {
                    console.error('Error reverse geocoding:', error);
                    setErrMsg('We could not detect your location. Please enter it manually.');
                } finally {
                    setIsDetectingLocation(false);
                }
            },
            (error) => {
                console.error('Geolocation error:', error);
                setErrMsg('Enable location permissions or enter your details manually.');
                setIsDetectingLocation(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    }

    async function handleSignUp() {
        setErrMsg('');

        const newErrors: Record<string, string> = {};

        // Use validation functions
        const emailError = validateEmail(email);
        if (emailError) newErrors.email = emailError;

        const passwordError = validatePassword(password);
        if (passwordError) newErrors.password = passwordError;

        if (!firstName) newErrors.firstName = 'First name is required.';
        if (!lastName) newErrors.lastName = 'Last name is required.';
        if (!grade) newErrors.grade = 'Education status is required.';

        const usernameError = validateUsername(username);
        if (usernameError) newErrors.username = usernameError;

        const zipError = validateZipCode(zip);
        if (zipError) newErrors.zip = zipError;

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setErrMsg('Please complete the highlighted fields to continue.');
            return;
        }

        setErrors({});
        setIsLoading(true);

        try {
            const metadata: Record<string, any> = {
                firstname: firstName,
                lastname: lastName,
                grade: grade,
                username: username,
                looking_for_project: lookingForProject
            };

            if (zip) metadata.zip = zip;
            if (state) metadata.state = state;
            if (highSchool) metadata.high_school = highSchool;

            const { user, error } = await AuthService.signUp({
                email,
                password,
                metadata
            });

            if (error) {
                console.error(error);
                const errorMessage = error instanceof Error ? error.message : 'Failed to create account. Please try again.';
                setErrMsg(errorMessage);
                return;
            }

            if (user) {
                // Redirect to projects page since user is now signed up
                window.location.href = '/projects';
            }
        } catch (err) {
            console.error(err);
            setErrMsg('An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="signup-container">
            <div className="signup-card">
                <aside className="signup-brand-panel">
                    <div className="signup-brand-inner">
                        <div className="signup-brand-header">
                            <span className="signup-brand-badge">Project Relay</span>
                            <h1 className="signup-brand-title">Build your next chapter with Project Relay</h1>
                            <p className="signup-brand-copy">
                                Discover your passion through community-sourced projects fit for any interest.
                            </p>
                        </div>
                    </div>
                </aside>
                <div className="signup-form-panel">
                    <div className="signup-form-panel-inner">
                        <div className="signup-header">
                            <h2 className="signup-title">Create your account</h2>
                            <p className="signup-subtitle">Answer a few quick questions to personalize your experience.</p>
                        </div>
                        <form className="signup-form" onSubmit={(e) => { e.preventDefault(); handleSignUp(); }}>
                            <div className="form-group">
                                <label className="form-label">Email *</label>
                                <input
                                    className={`form-input${errors.email ? ' form-input-error' : ''}`}
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="email@projectrelay.org"
                                    aria-invalid={!!errors.email}
                                />
                                {errors.email && (<div className="field-error">{errors.email}</div>)}
                            </div>

                            <div className="form-group">
                                <label className="form-label">Password *</label>
                                <input
                                    className={`form-input${errors.password ? ' form-input-error' : ''}`}
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Create a secure password"
                                    aria-invalid={!!errors.password}
                                />
                                {errors.password && (<div className="field-error">{errors.password}</div>)}
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">First Name *</label>
                                    <input
                                        className={`form-input${errors.firstName ? ' form-input-error' : ''}`}
                                        type="text"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        placeholder="First name"
                                        aria-invalid={!!errors.firstName}
                                    />
                                    {errors.firstName && (<div className="field-error">{errors.firstName}</div>)}
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Last Name *</label>
                                    <input
                                        className={`form-input${errors.lastName ? ' form-input-error' : ''}`}
                                        type="text"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        placeholder="Last name"
                                        aria-invalid={!!errors.lastName}
                                    />
                                    {errors.lastName && (<div className="field-error">{errors.lastName}</div>)}
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Username *</label>
                                <input
                                    className={`form-input${errors.username ? ' form-input-error' : ''}`}
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Choose a username"
                                    aria-invalid={!!errors.username}
                                />
                                {errors.username && (<div className="field-error">{errors.username}</div>)}
                            </div>

                            <div className="form-group">
                                <label className="form-label">Education Status *</label>
                                <select
                                    className={`form-input${errors.grade ? ' form-input-error' : ''}`}
                                    value={grade}
                                    onChange={(e) => setGrade(e.target.value)}
                                    aria-invalid={!!errors.grade}
                                >
                                    {EDUCATION_STATUS.map((statusOption) => (
                                        <option key={statusOption.value} value={statusOption.value}>
                                            {statusOption.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {!manualEntryMode && (
                                <div className="form-group">
                                    <button
                                        type="button"
                                        className="location-button"
                                        onClick={detectLocation}
                                        disabled={isDetectingLocation}
                                    >
                                        {isDetectingLocation ? 'Detecting location...' : 'Detect my location'}
                                    </button>
                                    <div className="signup-inline-link">
                                        <button
                                            type="button"
                                            className="link-button"
                                            onClick={() => setManualEntryMode(true)}
                                        >
                                            Enter location manually
                                        </button>
                                    </div>
                                </div>
                            )}

                            {(manualEntryMode || zip) && (
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">ZIP Code</label>
                                        <input
                                            className={`form-input${errors.zip ? ' form-input-error' : ''}`}
                                            type="text"
                                            value={zip}
                                            onChange={(e) => setZip(e.target.value)}
                                            placeholder="ZIP code"
                                            aria-invalid={!!errors.zip}
                                        />
                                        {errors.zip && (<div className="field-error">{errors.zip}</div>)}
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">State</label>
                                        <select
                                            className="form-input"
                                            value={state}
                                            onChange={(e) => setState(e.target.value)}
                                        >
                                            {US_STATES_AND_TERRITORIES.map((stateOption) => (
                                                <option key={stateOption.value} value={stateOption.value}>
                                                    {stateOption.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            )}

                            <div className="form-group">
                                <label className="form-label">High School</label>
                                <input
                                    className="form-input"
                                    type="text"
                                    value={highSchool}
                                    onChange={(e) => setHighSchool(e.target.value)}
                                    placeholder="High school name (optional)"
                                />
                            </div>

                            <div className="form-group checkbox-group">
                                <label className="checkbox-label-signup">
                                    <input
                                        type="checkbox"
                                        checked={lookingForProject}
                                        onChange={(e) => setLookingForProject(e.target.checked)}
                                    />
                                    <span>I am currently looking for a project</span>
                                </label>
                            </div>

                            {errMsg && (
                                <div className="error-message">{errMsg}</div>
                            )}

                            <button type="submit" className="submit-button" disabled={isLoading}>
                                {isLoading ? 'Creating account...' : 'Create account'}
                            </button>

                            <div className="signup-footer">
                                <button
                                    type="button"
                                    className="link-button"
                                    onClick={() => { window.location.href = '/auth'; }}
                                >
                                    Already have an account? Sign in
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
