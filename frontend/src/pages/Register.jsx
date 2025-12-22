import React, { useState } from "react";
import API from "../services/api";
import { Eye, EyeOff, Lock, Mail, User, Shield } from "lucide-react";

const Register = () => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "teacher"
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (form.fullName.length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters";
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      await API.post("/auth/register", form);
      alert("Registration successful! Welcome aboard!");
      // Reset form after successful registration
      setForm({
        fullName: "",
        email: "",
        password: "",
        role: "teacher"
      });
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Registration failed. Please try again.";
      alert(errorMsg);
      
      // Handle specific backend errors
      if (err.response?.data?.error?.includes("email")) {
        setErrors({ ...errors, email: "This email is already registered" });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-blue-100">
          {/* Header with gradient */}
          <div 
            className="bg-gradient-to-r from-[#2B3990] to-[#8BBEEE] p-6 text-center relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #2B3990 0%, #5A6CC4 50%, #8BBEEE 100%)"
            }}
          >
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-24 h-24 bg-white/10 rounded-full -translate-x-12 -translate-y-12"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-16 translate-y-16"></div>
            
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
              <p className="text-blue-100">Join our educational community</p>
            </div>
          </div>

          {/* Form Section */}
          <div className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name Input */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name
                </label>
                <div className={`relative rounded-lg border transition-all duration-300 ${
                  errors.fullName ? "border-red-500" : "border-gray-300 focus-within:border-[#8BBEEE]"
                }`}>
                  <input
                    name="fullName"
                    placeholder="John Doe"
                    onChange={handleChange}
                    value={form.fullName}
                    required
                    className="w-full p-3 pl-10 text-gray-700 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BBEEE]/30"
                  />
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                {errors.fullName && (
                  <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                )}
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </label>
                <div className={`relative rounded-lg border transition-all duration-300 ${
                  errors.email ? "border-red-500" : "border-gray-300 focus-within:border-[#8BBEEE]"
                }`}>
                  <input
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    onChange={handleChange}
                    value={form.email}
                    required
                    className="w-full p-3 pl-10 text-gray-700 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BBEEE]/30"
                  />
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Password
                </label>
                <div className={`relative rounded-lg border transition-all duration-300 ${
                  errors.password ? "border-red-500" : "border-gray-300 focus-within:border-[#8BBEEE]"
                }`}>
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    onChange={handleChange}
                    value={form.password}
                    required
                    className="w-full p-3 pl-10 pr-10 text-gray-700 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BBEEE]/30"
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#2B3990] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              {/* Role Selection */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Select Role
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, role: "teacher" })}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center justify-center ${
                      form.role === "teacher" 
                        ? "border-[#2B3990] bg-blue-50" 
                        : "border-gray-300 hover:border-[#8BBEEE]"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                      form.role === "teacher" ? "bg-[#2B3990]" : "bg-gray-300"
                    }`}>
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className={`font-medium ${
                      form.role === "teacher" ? "text-[#2B3990]" : "text-gray-600"
                    }`}>Teacher</span>
                    <span className="text-xs text-gray-500 mt-1">Educator Access</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, role: "admin" })}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center justify-center ${
                      form.role === "admin" 
                        ? "border-[#2B3990] bg-blue-50" 
                        : "border-gray-300 hover:border-[#8BBEEE]"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                      form.role === "admin" ? "bg-[#2B3990]" : "bg-gray-300"
                    }`}>
                      <Shield className="w-4 h-4 text-white" />
                    </div>
                    <span className={`font-medium ${
                      form.role === "admin" ? "text-[#2B3990]" : "text-gray-600"
                    }`}>Admin</span>
                    <span className="text-xs text-gray-500 mt-1">Full Access</span>
                  </button>
                </div>
                
                {/* Hidden select for form submission */}
                <select 
                  name="role" 
                  onChange={handleChange} 
                  value={form.role}
                  className="hidden"
                >
                  <option value="teacher">Teacher</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="w-4 h-4 text-[#2B3990] rounded focus:ring-[#8BBEEE]"
                />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  I agree to the{" "}
                  <a href="#" className="text-[#2B3990] hover:text-[#8BBEEE] font-semibold">
                    Terms & Conditions
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-[#2B3990] hover:text-[#8BBEEE] font-semibold">
                    Privacy Policy
                  </a>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  background: `linear-gradient(135deg, #2B3990 0%, #5A6CC4 50%, #8BBEEE 100%)`
                }}
                className="w-full p-4 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </span>
                ) : (
                  "Create Account"
                )}
              </button>

              {/* Login Link */}
              <div className="text-center pt-4 border-t border-gray-200">
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <a href="/login" className="text-[#2B3990] hover:text-[#8BBEEE] font-semibold transition-colors">
                    Sign In
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Security Note */}
        <div className="mt-6 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-blue-100">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <Shield className="w-4 h-4 text-[#2B3990]" />
            <span>Your data is protected with 256-bit SSL encryption</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;