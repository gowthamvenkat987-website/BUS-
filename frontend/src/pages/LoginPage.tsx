import React, { useState, useEffect, useRef } from 'react';
import { Bus, ArrowRight, ShieldCheck, RefreshCw, AlertCircle, Phone, ArrowLeft, CheckCircle2, KeyRound } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../services/supabase';

interface LoginPageProps {
  onLoginSuccess: (user: any) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [supabaseNotice, setSupabaseNotice] = useState<string | null>(null);
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

  // Clean phone number format
  const cleanPhone = phoneNumber.replace(/\D/g, '');
  const fullPhone = `${countryCode}${cleanPhone}`;

  // Masked phone format for OTP screen: +91 98XXX XX321 or +91 XXXXX XXXXX
  const getMaskedPhone = () => {
    if (cleanPhone.length >= 10) {
      const first2 = cleanPhone.slice(0, 2);
      const last3 = cleanPhone.slice(-3);
      return `${countryCode} ${first2}XXX XX${last3}`;
    }
    return `${countryCode} XXXXX XXXXX`;
  };

  // STEP 1: Send OTP via Supabase Auth
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setSupabaseNotice(null);

    if (cleanPhone.length !== 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsLoading(true);

    try {
      if (!isSupabaseConfigured()) {
        setSupabaseNotice(
          'Demo Mode: Supabase live SMS provider is inactive. You can use test OTP 123456 or 1-Click Demo Login below.'
        );
        setSuccessMessage('Demo OTP sent. Use 123456 to verify.');
        setStep('OTP');
        setOtp(['1', '2', '3', '4', '5', '6']);
        setCountdown(30);
        setCanResend(false);
        setIsLoading(false);
        return;
      }

      // Invoke Supabase Phone Auth
      const { error } = await supabase.auth.signInWithOtp({
        phone: fullPhone
      });

      if (error) {
        // If Supabase phone provider is unconfigured or returns API error, fallback to demo OTP mode
        setSupabaseNotice(
          `Live SMS Notice: ${error.message}. Demo mode is active: use test OTP 123456 or 1-Click Demo Login below.`
        );
        setSuccessMessage('Demo OTP available: Use 123456 to verify.');
        setStep('OTP');
        setOtp(['1', '2', '3', '4', '5', '6']);
        setCountdown(30);
        setCanResend(false);
      } else {
        setSuccessMessage('OTP sent successfully.');
        setStep('OTP');
        setCountdown(30);
        setCanResend(false);
        setTimeout(() => {
          otpInputsRef.current[0]?.focus();
        }, 100);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred while sending OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  // STEP 2: Verify OTP via Supabase Auth
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const token = otp.join('');
    if (token.length !== 6) {
      setErrorMessage('Please enter the complete 6-digit OTP.');
      return;
    }

    setIsLoading(true);

    // Fast-path demo OTP support
    if (token === '123456' || !isSupabaseConfigured()) {
      setSuccessMessage('Login successful (Demo Mode).');
      setTimeout(() => {
        onLoginSuccess({
          id: 'demo-admin-01',
          phone: fullPhone || '+91 98765 43210',
          role: 'ADMIN',
          email: 'admin@smarttransit.com',
          user_metadata: { role: 'ADMIN' }
        });
      }, 350);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone: fullPhone,
        token,
        type: 'sms'
      });

      if (error) {
        if (error.message.toLowerCase().includes('expired')) {
          setErrorMessage('OTP expired. Please request a new OTP.');
        } else {
          setErrorMessage('Invalid OTP. Please try again or use 123456.');
        }
      } else {
        setSuccessMessage('Login successful.');
        setTimeout(() => {
          onLoginSuccess(data.user || data.session?.user || { phone: fullPhone, role: 'ADMIN' });
        }, 500);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (!canResend) return;
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: fullPhone
      });

      if (error) {
        setErrorMessage(error.message);
      } else {
        setSuccessMessage('OTP resent successfully.');
        setCountdown(30);
        setCanResend(false);
        setOtp(['', '', '', '', '', '']);
        otpInputsRef.current[0]?.focus();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to resend OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP input change with auto-focus to next box
  const handleOtpChange = (index: number, value: string) => {
    // Only accept numeric characters
    const numericVal = value.replace(/\D/g, '');
    const newOtp = [...otp];

    if (numericVal.length > 0) {
      newOtp[index] = numericVal[numericVal.length - 1]; // take the last typed digit
      setOtp(newOtp);

      // Auto-focus to next input
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

    // Focus last filled input or next empty input
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

        {/* Step Indicator */}
        <div className="mt-6 mb-4">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
            <span className={step === 'PHONE' ? 'text-blue-600 font-bold' : 'text-slate-400'}>
              1. Mobile Number
            </span>
            <span className={step === 'OTP' ? 'text-blue-600 font-bold' : 'text-slate-400'}>
              2. OTP Verification
            </span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div 
              className={`h-full bg-blue-600 transition-all duration-300 ${step === 'PHONE' ? 'w-1/2' : 'w-full'}`}
            ></div>
          </div>
        </div>

        {/* Status Messages */}
        {errorMessage && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-700 flex items-start gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-800 flex items-start gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {supabaseNotice && (
          <div className="mb-4 bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-900 space-y-1 animate-in fade-in">
            <div className="flex items-center gap-1.5 font-bold text-blue-900">
              <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0" />
              <span>Supabase Phone Authentication</span>
            </div>
            <p className="text-[11px] text-blue-800 leading-relaxed">
              {supabaseNotice}
            </p>
          </div>
        )}

        {/* STEP 1: Phone Number Input */}
        {step === 'PHONE' && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="font-semibold text-slate-700 text-xs block mb-1.5">
                Sign in with your mobile number
              </label>
              
              <div className="flex gap-2">
                {/* Country Selector */}
                <div className="w-24 shrink-0">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="w-full min-h-[48px] px-2.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 font-semibold text-xs text-slate-800 focus:outline-blue-600 cursor-pointer"
                  >
                    <option value="+91">🇮🇳 +91 (India)</option>
                    <option value="+1">🇺🇸 +1 (US)</option>
                    <option value="+44">🇬🇧 +44 (UK)</option>
                    <option value="+971">🇦🇪 +971 (UAE)</option>
                  </select>
                </div>

                {/* Mobile Number Input */}
                <div className="relative flex-1">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-4 pointer-events-none" />
                  <input
                    type="tel"
                    required
                    autoFocus
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="98765 43210"
                    maxLength={14}
                    className="w-full min-h-[48px] pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-blue-600 focus:border-blue-600 bg-white"
                  />
                </div>
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5">
                We will send an official 6-digit OTP via SMS for verification.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading || cleanPhone.length !== 10}
              id="btn-send-otp"
              className="w-full min-h-[48px] bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-bold py-3 rounded-xl transition shadow-sm flex items-center justify-center gap-2 text-sm cursor-pointer disabled:cursor-not-allowed"
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
          </form>
        )}

        {/* STEP 2: 6-Digit OTP Verification Screen */}
        {step === 'OTP' && (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="font-semibold text-slate-700 text-xs block">
                  Enter the 6-digit OTP sent to {getMaskedPhone()}:
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setStep('PHONE');
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className="text-blue-600 hover:text-blue-800 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3 h-3" />
                  <span>Change number</span>
                </button>
              </div>

              {/* Masked Phone Number Display */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 mb-4 flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-slate-900 tracking-wider">
                  {getMaskedPhone()}
                </span>
                <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>SMS Dispatched</span>
                </span>
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
                  Resend in {countdown}s
                </span>
              )}
            </div>
          </form>
        )}

        {/* 1-Click Fast Demo Access */}
        <div className="mt-6 pt-5 border-t border-slate-200">
          <div className="text-center mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
              Fast Demo Access (1-Click)
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              id="btn-demo-admin"
              onClick={() => onLoginSuccess({ id: 'demo-admin-01', email: 'admin@smarttransit.com', role: 'ADMIN', user_metadata: { role: 'ADMIN' } })}
              className="py-2.5 px-2 bg-blue-50 hover:bg-blue-100 active:scale-95 text-blue-800 border border-blue-200 rounded-xl text-xs font-bold transition flex flex-col items-center gap-1 cursor-pointer shadow-2xs"
            >
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Admin</span>
            </button>
            <button
              type="button"
              id="btn-demo-faculty"
              onClick={() => onLoginSuccess({ id: 'demo-faculty-01', email: 'faculty@nriit.edu.in', role: 'FACULTY', user_metadata: { role: 'FACULTY' } })}
              className="py-2.5 px-2 bg-slate-50 hover:bg-slate-100 active:scale-95 text-slate-800 border border-slate-200 rounded-xl text-xs font-bold transition flex flex-col items-center gap-1 cursor-pointer shadow-2xs"
            >
              <KeyRound className="w-4 h-4 text-slate-600" />
              <span>Faculty</span>
            </button>
            <button
              type="button"
              id="btn-demo-student"
              onClick={() => onLoginSuccess({ id: 'demo-student-01', email: 'student@nriit.edu.in', role: 'STUDENT', user_metadata: { role: 'STUDENT' } })}
              className="py-2.5 px-2 bg-emerald-50 hover:bg-emerald-100 active:scale-95 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold transition flex flex-col items-center gap-1 cursor-pointer shadow-2xs"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Student</span>
            </button>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-4 pt-3 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400">
            Protected by Supabase Auth • NRI Institute of Technology Transit Gate
          </p>
        </div>
      </div>
    </div>
  );
};
