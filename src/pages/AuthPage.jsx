import React, { useState } from 'react'
import Logo from '../components/Logo'
import ThemeToggle from '../components/ThemeToggle'
import { useTheme, useAuth } from '../context'
import './AuthPage.css'

const AuthPage = () => {
  const { theme } = useTheme()
  const { login, register, loading } = useAuth()
  const [authMode, setAuthMode] = useState('login') // 'login', 'register', 'recovery'

  // Form State
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const bgColor = theme === 'dark' ? 'bg-[#080808]' : 'bg-[#F9FAFB]'
  const textColor = theme === 'dark' ? 'text-white' : 'text-neutral-900'
  const inputBg = theme === 'dark' ? 'bg-neutral-900' : 'bg-white'
  const inputBorder = theme === 'dark' ? 'border-neutral-800' : 'border-neutral-200'
  const buttonBg = theme === 'dark' ? 'bg-white text-neutral-900' : 'bg-black text-white'

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAuth = async (e) => {
    e.preventDefault()
    if (!formData.email) return
    if (authMode !== 'recovery' && !formData.password) return

    try {
      if (authMode === 'login') {
        await login(formData.email, formData.password)
      } else if (authMode === 'register') {
        await register(formData.email, formData.password)
      } else {
        // Recovery logic will go here
        console.log("Recovery requested for:", formData.email)
      }
    } catch (err) {
      // Errors are already handled by the context toasts
    }
  }

  // Refined Color Schemes for Badges
  const statusBadgeColor = theme === 'dark'
    ? 'bg-neutral-900 border-neutral-800 text-white/60'
    : 'bg-neutral-200 border-neutral-300 text-black/70'

  const terminalBadgeColor = theme === 'dark'
    ? 'bg-emerald-900/40 text-emerald-400'
    : 'bg-black text-emerald-400'

  const getPageContent = () => {
    switch(authMode) {
      case 'register': return { badge: 'Account_Setup', h1: 'Join the hub.', desc: 'Initialize a new user identity' };
      case 'recovery': return { badge: 'Recovery_Portal', h1: 'Lost access?', desc: 'Initialize a recovery sequence' };
      default: return { badge: 'Access_Portal', h1: 'Welcome back.', desc: 'Authenticate to access your system' };
    }
  }

  const content = getPageContent();

  return (
    <div className={`relative flex h-screen w-full transition-colors duration-500 overflow-hidden ${bgColor} ${textColor}`}>
      {/* Global Header */}
      <header className="absolute top-0 left-0 w-full p-6 md:p-8 z-50 flex items-center justify-between pointer-events-none">
        <Logo className="pointer-events-auto" />

        <div className="flex items-center gap-4 md:gap-6 pointer-events-auto">
          {/* IoT Status Indicator */}
          <div className={`hidden xs:flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${statusBadgeColor}`}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-tighter">Connected.Local</span>
          </div>
          <ThemeToggle className="shadow-sm dark:shadow-none" />
        </div>
      </header>

      {/* IoT Sidebar (70%) */}
      <div className={`hidden lg:flex flex-[7] relative items-center justify-center border-r transition-all duration-500 overflow-hidden h-full ${theme === 'dark' ? 'border-neutral-900' : 'border-neutral-200'}`}>
        <div className="animate-scan-line" style={{ animationDelay: 's' }} />

        {/* The Connection Grid */}
        <div className={`absolute inset-0 iot-dots transition-opacity duration-500 ${theme === 'dark' ? 'text-white opacity-[0.1]' : 'text-black opacity-[0.2]'}`} />

        <div className="relative group">
          <div className={`absolute -inset-20 blur-3xl opacity-20 dark:opacity-10 rounded-full transition-colors duration-500 ${theme === 'dark' ? 'bg-blue-500' : 'bg-emerald-500'}`} />
          <Logo className={`opacity-5 dark:opacity-10 scale-[3] grayscale transition-all duration-700 group-hover:scale-[3.2]`} />
        </div>

        <div className="absolute bottom-12 left-12 space-y-1 font-black text-[10px] uppercase tracking-widest opacity-10 select-none">
          <p>Dev_ID: 0xFDH-291-K</p>
          <p>Signal: -42dbm (EXCEL)</p>
          <p>Protocol: MQTT_V5</p>
        </div>
      </div>

      {/* Auth Panel (30%) */}
      <div className={`flex-[10] lg:flex-[3] relative h-full overflow-y-auto w-full md:min-w-[400px] custom-scrollbar`}>
        <div className="min-h-full flex flex-col w-full">
          {/* Centered Content Wrapper */}
          <div className="flex-grow flex flex-col items-center justify-center p-6 md:p-10 w-full">
            <div className="max-w-sm w-full mx-auto flex flex-col gap-y-[4vh]">
              {/* Staggered Content Switch */}
              <div className="flex flex-col">
                <div key={authMode + '_bdg'} className={`mb-3 self-start px-2 py-0.5 rounded text-[9px] font-black tracking-widest uppercase animate-robotic-fast ${terminalBadgeColor}`}>
                  {content.badge}
                </div>
                <h1 key={authMode + '_h1'} className="text-3xl md:text-4xl font-black tracking-tighter mb-1 leading-tight animate-robotic-mid">
                  {content.h1}
                </h1>
                <div key={authMode + '_desc'} className="opacity-40 text-[11px] font-medium tracking-tight h-auto animate-robotic-slow">
                  {content.desc}
                </div>
              </div>

              <form className="space-y-4 w-full" onSubmit={handleAuth}>
                <div className="space-y-1">
                  <div className="flex justify-between items-end px-1">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30">User_Identity</label>
                    <span className="text-[9px] font-bold opacity-10 uppercase tracking-widest">Required</span>
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="u@thingz.hub"
                    disabled={loading}
                    className={`w-full px-5 py-3 ${inputBg} ${inputBorder} rounded-xl border-2 outline-none focus:border-black dark:focus:border-white transition-all text-sm placeholder:opacity-20 disabled:opacity-50`}
                  />
                </div>

                {authMode !== 'recovery' && (
                  <div className="space-y-1">
                    <div className="flex justify-between items-end px-1">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30">Pass_Sequence</label>
                      <span className="text-[9px] font-bold opacity-10 uppercase tracking-widest text-emerald-500">Encrypted</span>
                    </div>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      disabled={loading}
                      className={`w-full px-5 py-3 ${inputBg} ${inputBorder} rounded-xl border-2 outline-none focus:border-black dark:focus:border-white transition-all text-sm placeholder:opacity-20 disabled:opacity-50`}
                    />
                  </div>
                )}

                <button
                  disabled={loading}
                  className={`w-full py-4 ${buttonBg} rounded-xl font-black uppercase tracking-widest text-xs hover:opacity-90 hover:-translate-y-0.5 active:translate-y-0 transition-all mt-2 shadow-xl shadow-black/5 disabled:opacity-50 disabled:translate-y-0`}
                >
                  <span key={authMode + '_btn_txt'} className="animate-robotic-fast block text-center w-full">
                    {loading ? 'AUTH_SEQUENCE_RUNNING...' : (
                      authMode === 'login' ? 'Authorize_Login' : 
                      authMode === 'register' ? 'Setup_Account' : 'Initiate_Recovery'
                    )}
                  </span>
                </button>
              </form>

              <div className="text-center mt-2 flex items-center justify-center gap-x-3">
                <button
                  onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                  disabled={loading}
                  className={`text-[10px] font-black uppercase border-b-2 hover:border-black dark:hover:border-white transition-all pb-1 tracking-widest opacity-40 hover:opacity-100 disabled:opacity-20 ${theme === 'dark' ? 'border-neutral-800' : 'border-neutral-200'}`}
                >
                  {authMode === 'register' ? 'EXISTING USER? LOGIN' : 
                   authMode === 'recovery' ? 'RETURN TO PORTAL' : 'NEW USER? REGISTER'}
                </button>

                {authMode === 'login' && (
                  <>
                    <span className="opacity-20 text-[10px] select-none translate-y-[-1px]">/</span>
                    <button
                      onClick={() => setAuthMode('recovery')}
                      disabled={loading}
                      className={`text-[10px] font-black uppercase border-b-2 hover:border-black dark:hover:border-white transition-all pb-1 tracking-widest opacity-40 hover:opacity-100 disabled:opacity-20 ${theme === 'dark' ? 'border-neutral-800' : 'border-neutral-200'}`}
                    >
                      Forget_Sequence?
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          <footer className="p-4 px-8 flex items-center justify-between opacity-10 select-none mt-auto">
            <span className="text-[9px] font-black tracking-[0.3em] uppercase">Thingz.Hub &copy; 2026</span>
            <span className="text-[9px] font-black tracking-[0.3em] uppercase">v2.0-STABLE</span>
          </footer>
        </div>
      </div>
    </div>
  )
}

export default AuthPage
