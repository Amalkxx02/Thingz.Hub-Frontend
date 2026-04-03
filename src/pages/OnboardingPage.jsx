import React, { useState } from 'react';
import Logo from '../components/Logo';
import { useAuth, useTheme } from '../context';

const OnboardingPage = () => {
  const { onboard, loading } = useAuth();
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    profile_image_url: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) return;
    await onboard(formData);
  };

  const bgColor = theme === 'dark' ? 'bg-[#080808] text-white' : 'bg-[#F9FAFB] text-neutral-900';
  const inputBg = theme === 'dark' ? 'bg-neutral-900' : 'bg-white';
  const inputBorder = theme === 'dark' ? 'border-neutral-800' : 'border-neutral-200';
  const buttonBg = theme === 'dark' ? 'bg-white text-neutral-900' : 'bg-black text-white';

  return (
    <div className={`min-h-screen w-full flex flex-col items-center justify-center p-6 transition-colors duration-500 ${bgColor}`}>
      <div className="absolute top-8 left-8">
        <Logo />
      </div>

      <div className="max-w-md w-full animate-robotic-mid">
        <div className="mb-8 overflow-hidden">
          <div className="bg-emerald-500/10 text-emerald-500 text-[10px] font-black tracking-widest uppercase py-1 px-3 rounded inline-block mb-4">
            Account_Setup
          </div>
          <h1 className="text-4xl font-black tracking-tighter mb-2">Build Profile.</h1>
          <p className="opacity-40 text-sm font-mono">USER_AUTHENTICATION_SUCCESSFUL. PLEASE_PROVIDE_PROFILE_METADATA.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30 px-1">Full_Name</label>
            <input 
              type="text" 
              required
              placeholder="Enter your system name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className={`w-full px-5 py-4 ${inputBg} ${inputBorder} rounded-xl border-2 outline-none focus:border-emerald-500 transition-all text-sm`}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30 px-1">Profile_Image_URL</label>
            <input 
              type="url" 
              placeholder="https://example.com/avatar.png"
              value={formData.profile_image_url}
              onChange={(e) => setFormData({...formData, profile_image_url: e.target.value})}
              className={`w-full px-5 py-4 ${inputBg} ${inputBorder} rounded-xl border-2 outline-none focus:border-emerald-500 transition-all text-sm`}
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className={`w-full py-5 ${buttonBg} rounded-xl font-black uppercase tracking-widest text-xs hover:opacity-90 transition-all shadow-xl disabled:opacity-50`}
          >
            {loading ? 'SYNCHRONIZING...' : 'Verify_Profile'}
          </button>
        </form>
      </div>

      <div className="iot-dots absolute inset-0 opacity-5 pointer-events-none" />
    </div>
  );
};

export default OnboardingPage;
