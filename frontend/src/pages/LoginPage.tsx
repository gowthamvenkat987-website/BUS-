import React, { useState, useEffect, useRef } from 'react';
import { Bus, ArrowRight, ShieldCheck, RefreshCw, AlertCircle, Phone, Mail, ArrowLeft, CheckCircle2, KeyRound } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../services/supabase';

type AuthMethod = 'EMAIL' | 'PHONE';
type AuthStep = 'INPUT' | 'OTP';

interface LoginPageProps {
  onLoginSuccess: (user: any) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  // EMAIL OTP is primary working authentication method
  const [authMethod, setAuthMethod] = useState<AuthMethod>('EMAIL');
  const [step, setStep] = useState<AuthStep>('INPUT');
  const [countryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showDirectOtpEntry, setShowDirectOtpEntry] = useState(false);
  const [countdown, setCountdown] = useState<number>(30);
  const [canResend, setCanResend] = useState<boolean>(false);

  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (step === 'OTP' && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [step, countdown]);

  // Clean phone and email formats
  const cleanPhone = phoneNumber.replace(/\D/g, '');
  const fullPhone = `${countryCode}${cleanPhone}`;
  const cleanEmail = email.trim().toLowerCase();

  // Masked phone format for OTP screen: +91 98XXX XX321
  const getMaskedPhone = () => {
    if (cleanPhone.length >= 10) {
      const first2 = cleanPhone.slice(0, 2);
      const last3 = cleanPhone.slice(-3);
      return `${countryCode} ${first2}XXX XX${last3}`;
    }
    return `${countryCode} XXXXX XXXXX`;
  };

  // Switch authentication method
  const handleSelectAuthMethod = (method: AuthMethod) => {
    setAuthMethod(method);
    setStep('INPUT');
    setErrorMessage(null);
    setSuccessMessage(null);
    setShowDirectOtpEntry(false);
    setOtp(['', '', '', '', '', '']);
  };

  // STEP 1: Send Real Email OTP via Supabase Auth
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setShowDirectOtpEntry(false);

    if (authMethod === 'PHONE') {
      setErrorMessage('Phone OTP is currently unavailable. Please use Email OTP.');
      return;
    }

    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!isSupabaseConfigured()) {
      setErrorMessage('Supabase authentication is not configured. Please check the environment variables.');
      return;
    }

    setIsLoading(true);

    try {
      // 8-second timeout safeguard so requests never hang or time out silently
      const timeoutPromise = new Promise<{ data: null; error: Error }>((_, reject) =>
        setTimeout(() => reject(new Error('Connection timed out. Please check your network and try again.')), 8000)
      );

      const res = await Promise.race([
        supabase.auth.signInWithOtp({
          email: cleanEmail
        }),
        timeoutPromise
      ]);

      const { error } = res;

      if (error) {
        const msg = error.message.toLowerCase();
        if (msg.includes('rate limit') || msg.includes('over_email_send_rate_limit')) {
          setErrorMessage('Supabase email OTP rate limit reached. If a 6-digit code was already sent to your email, you can enter it below.');
          setShowDirectOtpEntry(true);
        } else if (msg.includes('email_address_invalid') || msg.includes('is invalid')) {
          setErrorMessage('Email address is invalid. Please enter a valid email address.');
        } else if (msg.includes('provider') || msg.includes('disabled')) {
          setErrorMessage('Email provider is disabled in your Supabase project. Enable Email under Authentication > Providers > Email.');
        } else {
          setErrorMessage(error.message || 'Unable to send OTP. Please check your email address.');
        }
      } else {
        setSuccessMessage('OTP sent successfully. Please check your email inbox.');
        setStep('OTP');
        setCountdown(30);
        setCanResend(false);
        setOtp(['', '', '', '', '', '']);
        setTimeout(() => {
          otpInputsRef.current[0]?.focus();
        }, 100);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to send OTP. Please check your network connection.');
    } finally {
      setIsLoading(false);
    }
  };

  // STEP 2: Verify Real Email OTP via Supabase Auth
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const token = otp.join('').trim();
    if (token.length !== 6) {
      setErrorMessage('Please enter the complete 6-digit OTP.');
      return;
    }

    setIsLoading(true);

    try {
      // 8-second timeout safeguard
      const timeoutPromise = new Promise<{ data: null; error: Error }>((_, reject) =>
        setTimeout(() => reject(new Error('Verification timed out. Please try again.')), 8000)
      );

      const res = await Promise.race([
        supabase.auth.verifyOtp({
          email: cleanEmail,
          token,
          type: 'email'
        }),
        timeoutPromise
      ]);

      const { data, error } = res;

      if (error) {
        if (error.message.toLowerCase().includes('expired')) {
          setErrorMessage('OTP expired. Please request a new OTP.');
        } else {
          setErrorMessage('Invalid OTP. Please try again.');
        }
      } else if (data?.session?.user || data?.user) {
        setSuccessMessage('Authentication successful. Opening Dashboard...');
        const authenticatedUser = data.session?.user || data.user;
        setTimeout(() => {
          onLoginSuccess(authenticatedUser);
        }, 400);
      } else {
        setErrorMessage('Invalid OTP. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Resend Real Email OTP via Supabase Auth
  const handleResendOtp = async () => {
    if (!canResend || isLoading) return;
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      const res = await supabase.auth.signInWithOtp({
        email: cleanEmail
      });

      if (res.error) {
        const msg = res.error.message.toLowerCase();
        if (msg.includes('rate limit') || msg.includes('over_email_send_rate_limit')) {
          setErrorMessage('Supabase email OTP rate limit reached. Please check your inbox for the previous code.');
        } else {
          setErrorMessage(res.error.message || 'Unable to resend OTP.');
        }
      } else {
        setSuccessMessage('New OTP sent successfully. Please check your email.');
        setCountdown(30);
        setCanResend(false);
        setOtp(['', '', '', '', '', '']);
        otpInputsRef.current[0]?.focus();
      }
    } catch (err: any) {
      setErrorMessage('Failed to resend OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP input change with auto-focus to next box
  const handleOtpChange = (index: number, value: string) => {
    const numericVal = value.replace(/\D/g, '');
    const newOtp = [...otp];

    if (numericVal.length > 0) {
      newOtp[index] = numericVal[numericVal.length - 1];
      setOtp(newOtp);

      if (index < 5) {
        otpInputsRef.current[index + 1]?.focus();
      }
    } else {
      newOtp[index] = '';
      setOtp(newOtp);
    }
  };

  // Handle Backspace navigation
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        otpInputsRef.current[index - 1]?.focus();
      }
    }
  };

  // Handle Paste event for 6-digit OTP
  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pastedData) return;

    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);

    const nextIndex = Math.min(pastedData.length, 5);
    otpInputsRef.current[nextIndex]?.focus();
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 text-slate-800 antialiased selection:bg-blue-600 selection:text-white">
      {/* Top Header Pill */}
      <div className="mb-6 flex items-center gap-2 bg-white px-4 py-1.5 rounded-full border border-slate-200 shadow-xs">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span className="text-xs font-semibold text-slate-600">NRI Institute of Technology • Vijayawada</span>
      </div>

      {/* Main Login Card */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 w-full max-w-md p-6 sm:p-8 relative">
        {/* Brand Header */}
        <div className="text-center space-y-2 pb-6 border-b border-slate-100">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center mx-auto shadow-md border border-slate-800">
            <Bus className="w-7 h-7 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 font-['Outfit'] tracking-tight">
              NRI <span className="text-blue-700">University Bus</span>
            </h1>
            <p className="text-xs font-medium text-slate-500 mt-1">
              Welcome to NRI University Bus
            </p>
          </div>
        </div>

        {/* Authentication Method Selector (Only in INPUT step) */}
        {step === 'INPUT' && (
          <div className="mt-6 mb-5">
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                id="tab-auth-email"
                onClick={() => handleSelectAuthMethod('EMAIL')}
                className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  authMethod === 'EMAIL'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Email</span>
              </button>
              <button
                type="button"
                id="tab-auth-phone"
                onClick={() => handleSelectAuthMethod('PHONE')}
                className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  authMethod === 'PHONE'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Mobile Number</span>
              </button>
            </div>
          </div>
        )}

        {/* Step Indicator */}
        <div className={step === 'INPUT' ? 'mb-4' : 'mt-6 mb-4'}>
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
            <span className={step === 'INPUT' ? 'text-blue-600 font-bold' : 'text-slate-400'}>
              1. {authMethod === 'EMAIL' ? 'Email Address' : 'Mobile Number'}
            </span>
            <span className={step === 'OTP' ? 'text-blue-600 font-bold' : 'text-slate-400'}>
              2. OTP Verification
            </span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div 
              className={`h-full bg-blue-600 transition-all duration-300 ${step === 'INPUT' ? 'w-1/2' : 'w-full'}`}
            ></div>
          </div>
        </div>

        {/* Status Messages */}
        {errorMessage && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-700 flex flex-col gap-2 animate-in fade-in">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{errorMessage}</span>
            </div>
            {showDirectOtpEntry && step === 'INPUT' && (
              <button
                type="button"
                onClick={() => {
                  setStep('OTP');
                  setCountdown(30);
                  setCanResend(false);
                  setTimeout(() => otpInputsRef.current[0]?.focus(), 100);
                }}
                className="mt-1 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded-lg text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Enter 6-Digit Code from Email →</span>
              </button>
            )}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-800 flex items-start gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* STEP 1: Input Screen (Email or Mobile Number) */}
        {step === 'INPUT' && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            {authMethod === 'EMAIL' ? (
              <div>
                <label className="font-semibold text-slate-700 text-xs block mb-1.5">
                  College / Institutional Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-4 pointer-events-none" />
                  <input
                    type="email"
                    required
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your college/email address"
                    className="w-full min-h-[48px] pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-blue-600 focus:border-blue-600 bg-white"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5">
                  We’ll send a 6-digit OTP to your email address.
                </p>

                <button
                  type="submit"
                  disabled={isLoading || !cleanEmail || !cleanEmail.includes('@')}
                  id="btn-send-otp"
                  className="mt-4 w-full min-h-[48px] bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-bold py-3 rounded-xl transition shadow-sm flex items-center justify-center gap-2 text-sm cursor-pointer disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Sending OTP...</span>
                    </>
                  ) : (
                    <>
                      <span>Send OTP</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div>
                <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-3 text-xs flex items-start gap-2 mb-3">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>Phone OTP is currently unavailable. Please use Email OTP.</span>
                </div>

                <label className="font-semibold text-slate-700 text-xs block mb-1.5 opacity-70">
                  Country & Mobile Number
                </label>
                
                <div className="flex gap-2 opacity-70">
                  <div className="w-24 shrink-0">
                    <div className="w-full min-h-[48px] px-2 py-2.5 rounded-xl border border-slate-300 bg-slate-50 font-bold text-xs text-slate-800 flex items-center justify-center gap-1">
                      <span>🇮🇳 +91</span>
                    </div>
                  </div>

                  <div className="relative flex-1">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-4 pointer-events-none" />
                    <input
                      type="tel"
                      disabled
                      value={phoneNumber}
                      placeholder="Enter mobile number"
                      className="w-full min-h-[48px] pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-500 bg-slate-50 cursor-not-allowed"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleSelectAuthMethod('EMAIL')}
                  className="mt-4 w-full min-h-[48px] bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition shadow-sm flex items-center justify-center gap-2 text-sm cursor-pointer"
                >
                  <Mail className="w-4 h-4" />
                  <span>Continue with Email OTP</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </form>
        )}

        {/* STEP 2: 6-Digit Real OTP Verification Screen */}
        {step === 'OTP' && (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-slate-800 text-sm">
                  Verify your OTP
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setStep('INPUT');
                    setErrorMessage(null);
                    setSuccessMessage(null);
                    setShowDirectOtpEntry(false);
                    setOtp(['', '', '', '', '', '']);
                  }}
                  className="text-blue-600 hover:text-blue-800 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3 h-3" />
                  <span>Change Email</span>
                </button>
              </div>

              {/* Destination Display */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 mb-4 text-xs">
                <p className="text-slate-500 text-[11px] mb-0.5">
                  We sent a 6-digit verification code to:
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-slate-900 tracking-wider text-xs">
                    {cleanEmail || (authMethod === 'PHONE' ? getMaskedPhone() : 'your email')}
                  </span>
                  <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Email Dispatched</span>
                  </span>
                </div>
              </div>

              {/* 6 Separate OTP Boxes */}
              <div className="flex justify-between gap-1.5 sm:gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { otpInputsRef.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    onPaste={handleOtpPaste}
                    className="w-11 h-12 sm:w-12 sm:h-14 text-center font-mono text-lg font-bold rounded-xl border-2 border-slate-300 text-slate-900 focus:border-blue-600 focus:outline-none bg-white transition shadow-2xs"
                  />
                ))}
              </div>
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              disabled={isLoading || otp.join('').length !== 6}
              id="btn-verify-otp"
              className="w-full min-h-[48px] bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold py-3 rounded-xl transition shadow-md flex items-center justify-center gap-2 text-sm cursor-pointer disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying OTP...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Verify OTP</span>
                </>
              )}
            </button>

            {/* Resend OTP & Countdown */}
            <div className="pt-2 text-center text-xs text-slate-500 flex items-center justify-between">
              <span>Didn't receive the OTP?</span>
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isLoading}
                  className="text-blue-600 hover:text-blue-800 font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Resend OTP</span>
                </button>
              ) : (
                <span className="font-mono text-slate-400 font-semibold">
                  Resend OTP in {countdown}s
                </span>
              )}
            </div>
          </form>
        )}

        {/* Footer Info */}
        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400">
            Protected by Supabase Auth • NRI Institute of Technology Transit Gate
          </p>
        </div>
      </div>
    </div>
  );
};
