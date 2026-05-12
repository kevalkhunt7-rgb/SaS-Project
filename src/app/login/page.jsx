"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  FaGithub,
  FaGoogle,
  FaRegEnvelope,
  FaLock,
  FaUser,
} from "react-icons/fa";
import { RiRobot2Line } from "react-icons/ri";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { authApi } from "@/lib/api";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotStep, setForgotStep] = useState(1);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotCode, setForgotCode] = useState("");

  const variants = {
    enter: (direction) => ({ x: direction > 0 ? 100 : -100, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction) => ({ x: direction < 0 ? 100 : -100, opacity: 0 }),
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100/50 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-violet-100/50 blur-[120px]" />

      <div className="w-full max-w-5xl bg-white rounded-[2.5rem] shadow-2xl flex overflow-hidden border border-white/20 relative z-10 min-h-[600px]">
        {/* Left Side */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-violet-700 p-12 flex-col justify-between relative">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-12">
              <RiRobot2Line className="text-white text-3xl" />
              <span className="text-2xl font-bold text-white uppercase tracking-tighter">SupportAI</span>
            </div>
            <h2 className="text-4xl font-black text-white leading-tight">
              {isForgotPassword 
                ? "Secure your account with a new password."
                : isLogin ? "Welcome back to the future of support." : "Start your 14-day free trial today."}
            </h2>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 text-white text-sm">
            Verified AI resolutions are up 85% this quarter.
          </div>
        </div>

        {/* Right Side */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12 flex flex-col justify-center relative">
          <AnimatePresence mode="wait" custom={isLogin ? 1 : -1}>
            {isForgotPassword ? (
              <motion.div key="forgot" custom={1} variants={variants} initial="enter" animate="center" exit="exit" className="w-full max-w-md mx-auto">
                <h1 className="text-3xl font-black text-slate-900 mb-2">
                  {forgotStep === 1 ? "Forgot Password" : forgotStep === 2 ? "Verify Code" : "Reset Password"}
                </h1>
                <p className="text-slate-500 mb-8">
                  {forgotStep === 1 
                    ? "Enter your email to receive a reset code." 
                    : forgotStep === 2 ? `Enter the 6-digit code sent to ${forgotEmail}` : "Create a strong new password."}
                </p>
                <ForgotPasswordFlow 
                  step={forgotStep} setStep={setForgotStep} 
                  email={forgotEmail} setEmail={setForgotEmail}
                  code={forgotCode} setCode={setForgotCode}
                  onBack={() => { setIsForgotPassword(false); setForgotStep(1); }}
                />
              </motion.div>
            ) : isLogin ? (
              <motion.div key="login" custom={1} variants={variants} initial="enter" animate="center" exit="exit" className="w-full max-w-md mx-auto">
                <h1 className="text-3xl font-black text-slate-900 mb-2">Log In</h1>
                <p className="text-slate-500 mb-8">Access your dashboard</p>
                <LoginForm onForgotPassword={() => setIsForgotPassword(true)} />
                <p className="text-center mt-8 text-slate-500 text-sm font-medium">
                  Don't have an account? <button onClick={() => setIsLogin(false)} className="text-blue-600 font-bold hover:underline">Sign up for free</button>
                </p>
              </motion.div>
            ) : (
              <motion.div key="register" custom={-1} variants={variants} initial="enter" animate="center" exit="exit" className="w-full max-w-md mx-auto">
                <h1 className="text-3xl font-black text-slate-900 mb-2">Create Account</h1>
                <p className="text-slate-500 mb-8">Get started with SupportAI</p>
                <RegisterForm />
                <p className="text-center mt-8 text-slate-500 text-sm font-medium">
                  Already have an account? <button onClick={() => setIsLogin(true)} className="text-blue-600 font-bold hover:underline">Log in</button>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

// ================= VERIFICATION CODE COMPONENT =================

const VerificationInput = ({ setFieldValue }) => {
  const inputRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (isNaN(value)) return;

    if (value.length > 0) {
      setFieldValue(`code[${index}]`, value.substring(value.length - 1));
      if (index < 5) inputRefs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  return (
    <div className="flex justify-between gap-2 mb-6">
      {[0, 1, 2, 3, 4, 5].map((index) => (
        <input
          key={index}
          ref={inputRefs[index]}
          type="text"
          maxLength={1}
          className="w-12 h-14 text-center text-2xl font-bold bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
        />
      ))}
    </div>
  );
};

// ================= FORGOT PASSWORD FLOW =================

const ForgotPasswordFlow = ({ step, setStep, email, setEmail, code, setCode, onBack }) => {
  
  const handleSendCode = async (values, { setSubmitting, setStatus }) => {
    try {
      await authApi.forgotPassword({ email: values.email });
      setEmail(values.email);
      setStep(2);
    } catch (error) {
      setStatus({ type: "error", message: error.response?.data?.message || "Failed to send code" });
    } finally { setSubmitting(false); }
  };

  const handleVerifyCode = async (values, { setSubmitting, setStatus }) => {
    try {
      const fullCode = values.code.join("");
      await authApi.verifyResetCode({ email, code: fullCode });
      setCode(fullCode);
      setStep(3);
    } catch (error) {
      setStatus({ type: "error", message: error.response?.data?.message || "Invalid code" });
    } finally { setSubmitting(false); }
  };

  const handleResetPassword = async (values, { setSubmitting, setStatus }) => {
    try {
      await authApi.resetPasswordWithCode({ email, code, password: values.password });
      alert("Password reset successful!");
      onBack();
    } catch (error) {
      setStatus({ type: "error", message: error.response?.data?.message || "Failed" });
    } finally { setSubmitting(false); }
  };

  if (step === 1) {
    return (
      <Formik key="step1" initialValues={{ email: "" }} onSubmit={handleSendCode}>
        {({ status, isSubmitting }) => (
          <Form className="space-y-5">
            {status && <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold">{status.message}</div>}
            <InputGroup name="email" icon={<FaRegEnvelope />} label="Work Email" placeholder="name@company.com" type="email" />
            <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg transition-all">
              {isSubmitting ? "Sending..." : "Send Reset Code"}
            </button>
            <button type="button" onClick={onBack} className="w-full text-slate-500 font-bold text-sm">Back to Login</button>
          </Form>
        )}
      </Formik>
    );
  }

  if (step === 2) {
    return (
      <Formik key="step2" initialValues={{ code: ["", "", "", "", "", ""] }} onSubmit={handleVerifyCode}>
        {({ status, isSubmitting, setFieldValue }) => (
          <Form className="space-y-5">
            {status && <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold">{status.message}</div>}
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Verification Code</label>
            <VerificationInput setFieldValue={setFieldValue} />
            <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg">
              {isSubmitting ? "Verifying..." : "Verify Code"}
            </button>
            <button type="button" onClick={() => setStep(1)} className="w-full text-slate-500 font-bold text-sm">Resend Code</button>
          </Form>
        )}
      </Formik>
    );
  }

  return (
    <Formik key="step3" initialValues={{ password: "", confirmPassword: "" }} onSubmit={handleResetPassword}>
      {({ status, isSubmitting }) => (
        <Form className="space-y-5">
          {status && <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold">{status.message}</div>}
          <InputGroup name="password" icon={<FaLock />} label="New Password" placeholder="••••••••" type="password" />
          <InputGroup name="confirmPassword" icon={<FaLock />} label="Confirm Password" placeholder="••••••••" type="password" />
          <button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-blue-600 to-violet-600 text-white py-4 rounded-2xl font-bold shadow-lg">
            {isSubmitting ? "Resetting..." : "Reset Password"}
          </button>
        </Form>
      )}
    </Formik>
  );
};

// ================= REMAINING COMPONENTS (Login/Register/InputGroup) =================

const LoginForm = ({ onForgotPassword }) => {
  const router = useRouter();
  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      const res = await authApi.login(values);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      router.push("/");
    } catch (error) {
      setStatus({ type: "error", message: "Login failed" });
    } finally { setSubmitting(false); }
  };

  return (
    <Formik initialValues={{ email: "", password: "" }} onSubmit={handleSubmit}>
      {({ status, isSubmitting }) => (
        <Form className="space-y-5">
          {status && <div className="p-4 rounded-xl text-sm font-bold bg-red-50 text-red-600">{status.message}</div>}
          <InputGroup name="email" icon={<FaRegEnvelope />} label="Email" placeholder="name@company.com" type="email" />
          <div className="space-y-1">
            <div className="flex justify-between items-center px-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Password</label>
              <button type="button" onClick={onForgotPassword} className="text-xs font-bold text-blue-600 hover:underline">Forgot Password?</button>
            </div>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600"><FaLock /></div>
              <Field name="password" type="password" placeholder="••••••••" className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>
          <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg">Login</button>
          <SocialLogins />
        </Form>
      )}
    </Formik>
  );
};

const RegisterForm = () => {
  const router = useRouter();
  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      const res = await authApi.register(values);
      localStorage.setItem("token", res.data.token);
      router.push("/");
    } catch (error) {
      setStatus({ type: "error", message: "Failed" });
    } finally { setSubmitting(false); }
  };

  return (
    <Formik initialValues={{ name: "", email: "", password: "" }} onSubmit={handleSubmit}>
      {({ status, isSubmitting }) => (
        <Form className="space-y-5">
          {status && <div className="p-4 rounded-xl text-sm font-bold bg-red-50 text-red-600">{status.message}</div>}
          <InputGroup name="name" icon={<FaUser />} label="Full Name" placeholder="John Doe" />
          <InputGroup name="email" icon={<FaRegEnvelope />} label="Work Email" placeholder="name@company.com" type="email" />
          <InputGroup name="password" icon={<FaLock />} label="Create Password" placeholder="••••••••" type="password" />
          <button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-blue-600 to-violet-600 text-white py-4 rounded-2xl font-bold shadow-lg">Create Account</button>
          <SocialLogins />
        </Form>
      )}
    </Formik>
  );
};

const InputGroup = ({ name, icon, label, placeholder, type = "text" }) => (
  <div className="space-y-1">
    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">{label}</label>
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600">{icon}</div>
      <Field name={name} type={type} placeholder={placeholder} className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-blue-500 outline-none" />
    </div>
    <ErrorMessage name={name} component="p" className="text-red-500 text-sm ml-1" />
  </div>
);

const SocialLogins = () => (
  <div className="pt-4 space-y-4">
    <div className="relative">
      <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
      <div className="relative flex justify-center text-xs font-bold text-slate-400"><span className="bg-white px-2">OR</span></div>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <button type="button" className="flex items-center justify-center gap-2 py-3 border border-slate-200 rounded-xl font-bold text-slate-600"><FaGoogle className="text-red-500" /> Google</button>
      <button type="button" className="flex items-center justify-center gap-2 py-3 border border-slate-200 rounded-xl font-bold text-slate-600"><FaGithub /> GitHub</button>
    </div>
  </div>
);

export default AuthPage;