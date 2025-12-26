"use client";
import Link from "next/link";
import { Users, ShieldCheck, ArrowRight, Briefcase, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";

export default function HRMSLandingPage() {
  return (
    <div className="min-h-screen bg-[#05070a] text-white overflow-hidden relative font-sans">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full"></div>

      {/* Navigation */}
      <nav className="relative z-50 flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
            <Briefcase size={22} className="text-white" />
          </div>
          <span className="text-xl font-black tracking-tighter uppercase">Novotion <span className="text-blue-500">ERP</span></span>
        </div>
        <div className="flex gap-6 items-center">
          <Link href="/" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Support</Link>
          <Link href="/signin" className="px-5 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-bold hover:bg-white/10 transition-all">Sign In</Link>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-12 pb-24 flex flex-col items-center justify-center min-h-[calc(100-80px)]">
        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Next-Gen HRMS
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-4 leading-[1.1]">
            Management <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Simplified.</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto font-medium">
            Choose your portal to continue. Experience a seamless workflow designed for modern enterprises.
          </p>
        </motion.div>

        {/* Portal Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8 w-full max-w-5xl">
          {/* Employee Portal Card */}
          <motion.div
            whileHover={{ y: -10 }}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link href="/hrms/employee/dashboard">
              <div className="group relative h-full bg-white/[0.03] border border-white/10 p-10 rounded-[40px] hover:border-blue-500/50 hover:bg-white/[0.05] transition-all duration-500 overflow-hidden">
                {/* Glow Effect */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[60px] rounded-full group-hover:bg-blue-500/20 transition-colors"></div>

                <div className="relative z-10 space-y-6">
                  <div className="w-16 h-16 bg-blue-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/40 group-hover:scale-110 transition-transform duration-500">
                    <Users size={32} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black mb-2">Employee Portal</h3>
                    <p className="text-gray-400 leading-relaxed font-medium">
                      Check attendance, apply for leaves, view payslips, and manage your personal professional profile.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-blue-400 font-bold group-hover:gap-4 transition-all">
                    Access My Portal <ArrowRight size={20} />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* HR Administration Card */}
          <motion.div
            whileHover={{ y: -10 }}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link href="/hrms/hr/dashboard">
              <div className="group relative h-full bg-white/[0.03] border border-white/10 p-10 rounded-[40px] hover:border-indigo-500/50 hover:bg-white/[0.05] transition-all duration-500 overflow-hidden">
                {/* Glow Effect */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[60px] rounded-full group-hover:bg-indigo-500/20 transition-colors"></div>

                <div className="relative z-10 space-y-6">
                  <div className="w-16 h-16 bg-indigo-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-500/40 group-hover:scale-110 transition-transform duration-500">
                    <ShieldCheck size={32} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black mb-2">HR Management</h3>
                    <p className="text-gray-400 leading-relaxed font-medium">
                      Manage workforce, approve requests, handle payroll, and generate comprehensive HR reports.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-indigo-400 font-bold group-hover:gap-4 transition-all">
                    Admin Access <ArrowRight size={20} />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>

        {/* Feature Tags */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-wrap justify-center gap-4 mt-16"
        >
          {['Attendance', 'Recruitment', 'Payroll', 'Appraisal', 'Analytics'].map((tag) => (
            <span key={tag} className="px-4 py-1.5 bg-white/5 border border-white/5 rounded-full text-xs font-bold text-gray-400 hover:text-white hover:bg-white/10 transition-all cursor-default">
              {tag}
            </span>
          ))}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-8 text-center bg-transparent">
        <p className="text-gray-500 text-sm font-medium">
          © 2025 <span className="text-white font-bold">Novotion ERP</span>. Advanced HRMS Engine.
        </p>
      </footer>
    </div>
  );
}