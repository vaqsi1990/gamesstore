import React, { useState } from "react";
import Select from "react-select";
import countryList from "react-select-country-list";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:3001";

const AuthPage = () => {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [referralCode, setReferralCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errorArray, setErrorArray] = useState([]);
  const [message, setMessage] = useState("");
  const countryOptions = countryList().getData();
  const [country, setCountry] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [termsAgreed, setTermsAgreed] = useState(false);

  const getPasswordStrength = () => {
    if (!password.length) return { label: "", color: "" };
    let score = 0;
    if (password.length >= 6) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    if (password.length >= 10) score++;
    if (score <= 2) return { label: "Weak", color: "text-[#e3c5ab]" };
    if (score <= 4) return { label: "Good", color: "text-[#e3c5ab]" };
    return { label: "Strong", color: "text-[#e3c5ab]" };
  };
  const passwordStrength = getPasswordStrength();

  const resetMessages = () => {
    setError("");
    setErrorArray([]);
    setMessage("");
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    resetMessages();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/verify-registration`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data.message && Array.isArray(data.message)) {
          setErrorArray(data.message);
          setError("");
          setLoading(false);
          return;
        }
        throw new Error(data.message || data.error || "Verification failed");
      }
      const data = await res.json();
      if (data.accessToken) localStorage.setItem("accessToken", data.accessToken);
      setMessage("Registration successful! You are now logged in.");
      setTimeout(() => { window.location.href = "/"; }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    resetMessages();
    if (mode === "register" && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (mode === "register" && !country) {
      setError("Please select a country");
      return;
    }
    if (mode === "register" && !termsAgreed) {
      setError("You must agree to the Terms of Service, Privacy Policy, and Tournament Rules");
      return;
    }
    setLoading(true);
    try {
      const endpoint = mode === "register" ? "/auth/register" : "/auth/login";
      const body = mode === "register"
        ? { name, email, password, country: country?.label ?? country, referralCode: referralCode || undefined }
        : { email, password };
      let res;
      try {
        res = await fetch(`${API_BASE_URL}${endpoint}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } catch {
        throw new Error("Cannot connect to server. Please try again.");
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data.message && Array.isArray(data.message)) {
          setErrorArray(data.message.map((m) => (typeof m === "string" ? m : JSON.stringify(m))));
          setError("");
          setLoading(false);
          return;
        }
        throw new Error(data.message || data.error || `Request failed: ${res.status}`);
      }
      const data = await res.json();
      if (mode === "register") {
        setOtpSent(true);
        setMessage("Verification code sent! Check your email and enter the code below.");
      } else {
        if (data.accessToken) localStorage.setItem("accessToken", data.accessToken);
        setMessage("Logged in successfully.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full rounded-md bg-neutral-900/80 border border-amber-700/50 px-3 py-2.5 text-sm text-[#e3c5ab] placeholder-[#e3c5ab]/60 outline-none focus:border-amber-500 transition-colors";
  const labelClass = "block text-sm font-medium text-[#e3c5ab] mb-1.5";

  const EyeIcon = ({ show }) =>
    show ? (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </svg>
    ) : (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );

  return (
    <main
      className="min-h-screen flex bg-cover bg-center bg-no-repeat items-center justify-center px-4 py-12"
      style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/img/regbg.jpg)` }}
    >
      <div className="w-full max-w-md rounded-xl p-8 ">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-10 h-10 text-[#e3c5ab]" viewBox="0 0 40 40" fill="currentColor">
              <path d="M8 28 L12 14 L16 22 L20 10 L24 18 L28 14 L32 26 L28 22 L24 26 L20 22 L16 28 L12 24 Z" />
            </svg>
            <span className="text-2xl font-bold tracking-tight text-[#e3c5ab]">WAVEHUB</span>
          </div>
          <h1 className="text-xl font-semibold text-[#e3c5ab] tracking-wide">
            {mode === "register" ? "Create an Account" : "Log in"}
          </h1>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {mode === "register" && !otpSent && (
            <>
              <div>
                <label className={labelClass}>Username</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className={inputClass} placeholder="Username will be visible to other users" />
              </div>
              <div>
                <label className={labelClass}>Email Address</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputClass} placeholder="Enter your email" />
              </div>
              <div>
                <label className={labelClass}>Country</label>
                <Select options={countryOptions} value={country} onChange={(val) => setCountry(val)} isClearable={false} placeholder="Select Country" classNamePrefix="wavehub-select"
                  styles={{ control: (b) => ({ ...b, backgroundColor: "rgba(23,23,23,0.9)", borderColor: "rgba(180,83,9,0.5)", minHeight: 42 }), singleValue: (b) => ({ ...b, color: "#e3c5ab" }), input: (b) => ({ ...b, color: "#e3c5ab" }), placeholder: (b) => ({ ...b, color: "rgba(227,197,171,0.6)" }), menu: (b) => ({ ...b, backgroundColor: "#1c1917", border: "1px solid rgba(180,83,9,0.5)" }), option: (b, s) => ({ ...b, backgroundColor: s.isFocused ? "rgba(217,119,6,0.2)" : "transparent", color: "#e3c5ab" }) }}
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className={labelClass}>Password</label>
                  {password && <span className={`text-xs font-medium ${passwordStrength.color}`}>{passwordStrength.label}</span>}
                </div>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required className={inputClass + " pr-10"} placeholder="Enter password" />
                  <button type="button" onClick={() => setShowPassword((p) => !p)} className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#e3c5ab] hover:opacity-80" aria-label={showPassword ? "Hide password" : "Show password"}><EyeIcon show={showPassword} /></button>
                </div>
              </div>
              <div>
                <label className={labelClass}>Confirm Password</label>
                <div className="relative">
                  <input type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className={inputClass + " pr-10"} placeholder="Re-enter password" />
                  <button type="button" onClick={() => setShowConfirmPassword((p) => !p)} className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#e3c5ab] hover:opacity-80" aria-label={showConfirmPassword ? "Hide password" : "Show password"}><EyeIcon show={showConfirmPassword} /></button>
                </div>
              </div>
              <div>
                <label className={labelClass}>Referral Code (optional)</label>
                <input type="text" value={referralCode} onChange={(e) => setReferralCode(e.target.value)} className={inputClass} placeholder="Enter referral code if you have one" />
              </div>
              <div className="flex items-start gap-2">
                <input type="checkbox" id="terms" checked={termsAgreed} onChange={(e) => setTermsAgreed(e.target.checked)} className="mt-1 rounded border-amber-600 bg-neutral-800 text-[#e3c5ab] focus:ring-amber-500" />
                <label htmlFor="terms" className="text-sm text-[#e3c5ab] leading-relaxed">
                  I agree to the <a href="/terms" className="text-[#e3c5ab] underline hover:opacity-80">Terms of Service</a>, <a href="/privacy" className="text-[#e3c5ab] underline hover:opacity-80">Privacy Policy</a>, and <a href="/tournament-rules" className="text-[#e3c5ab] underline hover:opacity-80">Tournament Rules</a>.
                </label>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#e3c5ab]">
                <svg className="w-4 h-4 text-[#e3c5ab] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                <span>Email verification required after registration.</span>
              </div>
            </>
          )}

          {mode === "login" && (
            <>
              <div>
                <label className={labelClass}>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputClass} placeholder="Enter your email" />
              </div>
              <div>
                <label className={labelClass}>Password</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required className={inputClass + " pr-10"} />
                  <button type="button" onClick={() => setShowPassword((p) => !p)} className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#e3c5ab] hover:opacity-80" aria-label={showPassword ? "Hide password" : "Show password"}><EyeIcon show={showPassword} /></button>
                </div>
              </div>
            </>
          )}

          {mode === "register" && otpSent && (
            <div>
              <label className={labelClass}>Verification code</label>
              <input type="text" value={otp} onChange={(e) => setOtp(e.target.value.toUpperCase())} required maxLength={5} className={inputClass + " text-center text-lg tracking-widest"} placeholder="Enter 5-letter code" />
              <button type="button" onClick={handleVerifyOtp} disabled={loading || otp.length !== 5} className="mt-3 w-full rounded-md bg-gradient-to-r from-emerald-700 to-amber-700 hover:from-emerald-600 hover:to-amber-600 text-[#e3c5ab] font-semibold py-2.5 text-sm border border-amber-600/50 disabled:opacity-60 disabled:cursor-not-allowed transition-all">
                {loading ? "Verifying..." : "Verify code"}
              </button>
            </div>
          )}

          {(error || errorArray.length > 0) && (
            <div className="text-sm text-[#e3c5ab] bg-red-950/50 border border-red-600/50 rounded px-3 py-2">
              {errorArray.length > 0 ? <ul className="list-disc list-inside space-y-1">{errorArray.map((err, idx) => <li key={idx}>{err}</li>)}</ul> : <p>{error}</p>}
            </div>
          )}
          {message && <p className="text-sm text-[#e3c5ab] bg-emerald-950/40 border border-emerald-600/40 rounded px-3 py-2">{message}</p>}

          {!(mode === "register" && otpSent) && (
            <button type="submit" disabled={loading} className="bg-transparent border-2 border-[#e3c5ab] hover:bg-[#e3c5ab]/10 text-[#e3c5ab] font-semibold py-3 px-6 rounded-lg w-full disabled:opacity-60 disabled:cursor-not-allowed transition-all">
              {loading ? "Please wait..." : mode === "register" ? "Create Account" : "Log in"}
            </button>
          )}
        </form>

        <div className="mt-6 text-center space-y-2">
          <p className="flex items-center justify-center gap-2 text-xs text-[#e3c5ab]">
            <svg className="w-4 h-4 text-[#e3c5ab]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            Your account is protected with secure authentication.
          </p>
          <button type="button" onClick={() => { resetMessages(); setOtpSent(false); setOtp(""); setMode(mode === "register" ? "login" : "register"); }} className="text-sm text-[#e3c5ab] hover:opacity-80 underline">
            {mode === "register" ? "Already have an account? Log In" : "Need an account? Register"}
          </button>
        </div>
      </div>
    </main>
  );
};

export default AuthPage;
