// src/Pages/Home.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import {
  FiShield,
  FiArrowRight,
  FiPhoneCall,
  FiBookOpen,
  FiHeart,
  FiLock,
  FiSearch,
  FiCheckCircle,
  FiHelpCircle,
  FiMapPin,
  FiUsers,
  FiFileText,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Home = () => {
  const navigate = useNavigate();
  const { victim } = useAuth();
  const [selectedDistrict, setSelectedDistrict] = useState("Darbhanga");

  const districtHelplines = {
    Darbhanga: {
      dlsa: "06272-245123",
      spOffice: "+91 94318 18345",
      protectionOfficer: "Smt. Anjali Sharma (SC/ST Cell)",
      status: "Active & Ready",
    },
    Patna: {
      dlsa: "0612-2219456",
      spOffice: "+91 94318 00001",
      protectionOfficer: "Shri Rajesh Verma (Victim Welfare)",
      status: "Active & Ready",
    },
    Gaya: {
      dlsa: "0631-2223100",
      spOffice: "+91 94318 18200",
      protectionOfficer: "Shri Alok Nath (Legal Relief)",
      status: "Active & Ready",
    },
    Muzaffarpur: {
      dlsa: "0621-2244500",
      spOffice: "+91 94318 18450",
      protectionOfficer: "Smt. Priyanka Roy (SC/ST Welfare)",
      status: "Active & Ready",
    },
  };

  const currentInfo = districtHelplines[selectedDistrict] || districtHelplines["Darbhanga"];

  return (
    <div className="min-h-screen bg-stone-100 text-stone-800 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* 🌿 Emergency Top Banner (Warm Neutral & Amber) */}
      <div className="bg-amber-100/90 text-amber-950 py-2.5 px-4 text-center text-xs sm:text-sm font-semibold border-b border-amber-200/90 shadow-xs flex items-center justify-center gap-2 flex-wrap">
        <span className="bg-amber-800 text-amber-50 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider">
          24/7 Helpline Support
        </span>
        <span>Need Immediate Legal Guidance or Emergency Protection? Call Toll-Free:</span>
        <a
          href="tel:18001234567"
          className="underline font-extrabold hover:text-emerald-900 flex items-center gap-1"
        >
          <FiPhoneCall className="h-3.5 w-3.5" /> 1800-SARTHI-HELP (1800-123-4567)
        </a>
      </div>

      {/* 🍃 Hero Section (Soothing Sage Green & Warm Ocean Blue Gradient) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/80 via-teal-50/40 to-stone-50 py-16 sm:py-24 border-b border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/90 text-emerald-900 border border-emerald-200 text-xs font-bold uppercase tracking-wider mb-6 shadow-xs"
            >
              <FiShield className="h-4 w-4 text-emerald-700" />
              Compassionate Victim Protection & Legal Aid Portal
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-stone-900 tracking-tight leading-tight"
            >
              Standing With You in{" "}
              <span className="bg-gradient-to-r from-emerald-800 via-teal-700 to-amber-700 bg-clip-text text-transparent">
                Safety, Dignity & Peace
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mt-6 text-lg sm:text-xl text-stone-600 leading-relaxed font-normal"
            >
              Sarthi is a gentle, confidential portal dedicated to offering immediate
              legal aid, security coordination, case status tracking, and holistic
              rehabilitation for victims of violence and atrocities.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <button
                onClick={() =>
                  victim ? navigate("/dashboard") : navigate("/auth/login")
                }
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-800 hover:to-teal-800 text-white font-bold rounded-2xl shadow-lg shadow-emerald-700/20 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
              >
                {victim ? "Access Your Portal Dashboard" : "Access Victim Portal"}{" "}
                <FiArrowRight className="h-5 w-5" />
              </button>

              <a
                href="#services"
                className="w-full sm:w-auto px-8 py-4 bg-white text-stone-700 font-bold rounded-2xl border border-stone-300 hover:bg-stone-100 hover:text-stone-900 flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                Explore Support Services
              </a>
            </motion.div>

            {/* Trust Badges */}
            <div className="mt-12 pt-8 border-t border-stone-200/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-semibold text-stone-600">
              <div className="flex items-center justify-center gap-2">
                <FiLock className="text-emerald-700 h-4 w-4" />
                <span>100% Confidential</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <FiBookOpen className="text-emerald-700 h-4 w-4" />
                <span>Free Legal Assistance</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <FiShield className="text-emerald-700 h-4 w-4" />
                <span>Protection Officers Assigned</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <FiCheckCircle className="text-emerald-700 h-4 w-4" />
                <span>Transparent Case Tracker</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🌾 Core Support Services (Muted Greens & Warm Blues) */}
      <section id="services" className="py-16 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
              Pillars of Care
            </span>
            <h2 className="text-3xl font-extrabold text-stone-900 tracking-tight mt-2">
              Comprehensive Protection & Healing Services
            </h2>
            <p className="mt-2 text-stone-600 text-base">
              Designed with care to foster peace, safety, and swift legal justice.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Legal Aid */}
            <motion.div
              whileHover={{ y: -4 }}
              className="p-6 rounded-3xl bg-stone-50 border border-stone-200/90 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4 text-xl font-bold">
                  <FiBookOpen className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-stone-900 mb-2">
                  Free Legal Counsel
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed">
                  Confidential legal representation, FIR filing assistance, and court
                  proceeding updates.
                </p>
              </div>
              <span className="mt-6 text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                Legal Aid <FiArrowRight className="h-3 w-3" />
              </span>
            </motion.div>

            {/* Card 2: Security */}
            <motion.div
              whileHover={{ y: -4 }}
              className="p-6 rounded-3xl bg-stone-50 border border-stone-200/90 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center mb-4 text-xl font-bold">
                  <FiShield className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-stone-900 mb-2">
                  Safety & Protection
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed">
                  Direct coordination with District Police Superintendents and assigned
                  Welfare Protection Officers.
                </p>
              </div>
              <span className="mt-6 text-xs font-bold text-teal-800 uppercase tracking-wider flex items-center gap-1">
                Security Protocol <FiArrowRight className="h-3 w-3" />
              </span>
            </motion.div>

            {/* Card 3: Relief */}
            <motion.div
              whileHover={{ y: -4 }}
              className="p-6 rounded-3xl bg-stone-50 border border-stone-200/90 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center mb-4 text-xl font-bold">
                  <FiFileText className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-stone-900 mb-2">
                  Financial Relief Schemes
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed">
                  Support in processing relief compensation under the SC/ST Prevention of Atrocities Act.
                </p>
              </div>
              <span className="mt-6 text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1">
                Relief Funds <FiArrowRight className="h-3 w-3" />
              </span>
            </motion.div>

            {/* Card 4: Rehabilitation */}
            <motion.div
              whileHover={{ y: -4 }}
              className="p-6 rounded-3xl bg-stone-50 border border-stone-200/90 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-800 flex items-center justify-center mb-4 text-xl font-bold">
                  <FiHeart className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-stone-900 mb-2">
                  Psychological & Care Space
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed">
                  Empathetic space to record daily thoughts, request officer callbacks,
                  and access medical aid.
                </p>
              </div>
              <span className="mt-6 text-xs font-bold text-sky-800 uppercase tracking-wider flex items-center gap-1">
                Care & Healing <FiArrowRight className="h-3 w-3" />
              </span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 📍 District Support Search (Warm Neutrals & Slate) */}
      <section className="py-16 bg-stone-100/70 border-b border-stone-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-lg border border-stone-200">
            <div className="text-center max-w-xl mx-auto mb-8">
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                District Officer Directory
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-2">
                Locate District Support Contacts
              </h2>
              <p className="text-stone-600 text-sm mt-1">
                Select your district to view assigned District Legal Services Authority
                (DLSA) contacts & Welfare Officers.
              </p>
            </div>

            {/* District Selector */}
            <div className="max-w-md mx-auto mb-8">
              <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
                Select District
              </label>
              <div className="relative">
                <FiMapPin className="absolute left-4 top-3.5 text-emerald-700 h-5 w-5" />
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-300 rounded-2xl text-stone-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-700"
                >
                  <option value="Darbhanga">Darbhanga</option>
                  <option value="Patna">Patna</option>
                  <option value="Gaya">Gaya</option>
                  <option value="Muzaffarpur">Muzaffarpur</option>
                </select>
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-stone-50 p-6 rounded-2xl border border-stone-200">
              <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs">
                <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block mb-1">
                  DLSA Legal Helpline
                </span>
                <p className="text-lg font-extrabold text-stone-900">
                  {currentInfo.dlsa}
                </p>
              </div>

              <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  SP Office / SC-ST Cell
                </span>
                <p className="text-lg font-extrabold text-stone-900">
                  {currentInfo.spOffice}
                </p>
              </div>

              <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Assigned Protection Officer
                </span>
                <p className="text-sm font-bold text-stone-900">
                  {currentInfo.protectionOfficer}
                </p>
              </div>

              <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Support Desk Status
                </span>
                <p className="text-sm font-bold text-emerald-700 flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  {currentInfo.status}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 💚 Peace & Courage Quote Section (Deep Forest Emerald & Slate) */}
      <section className="py-16 bg-gradient-to-r from-emerald-950 via-teal-950 to-stone-900 text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <FiShield className="h-12 w-12 text-emerald-400 mx-auto mb-4 opacity-90" />
          <blockquote className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-relaxed italic">
            "Justice is a constitutional guarantee. Sarthi stands beside you to restore
            peace, safety, and dignity at every step of your journey."
          </blockquote>
          <p className="mt-4 text-emerald-300 text-sm font-bold uppercase tracking-wider">
            — Sarthi Victim Protection & Welfare Initiative
          </p>
        </div>
        <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* 📜 Footer (Earth Tone Dark Footer) */}
      <footer className="bg-stone-900 text-stone-400 py-12 border-t border-stone-800 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 text-white font-extrabold text-xl mb-3">
              <FiShield className="text-emerald-400" />
              <span>SARTHI</span>
            </div>
            <p className="text-xs leading-relaxed text-stone-400">
              An official victim protection & legal assistance portal ensuring safety,
              justice, and complete rehabilitation.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm mb-3 uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() =>
                    victim ? navigate("/dashboard") : navigate("/auth/login")
                  }
                  className="hover:text-white transition-colors"
                >
                  Victim Portal Login
                </button>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  Protection & Compensation Services
                </a>
              </li>
              <li>
                <a href="tel:18001234567" className="hover:text-white transition-colors">
                  24/7 Helpline Support
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm mb-3 uppercase tracking-wider">
              Emergency Contact
            </h4>
            <p className="text-xs leading-relaxed text-stone-400">
              Toll-Free Helpline: <strong className="text-white">1800-SARTHI-HELP</strong>
              <br />
              Email: support@sarthi.gov.in
              <br />
              District Legal Services Authority (DLSA) Dedicated Cell
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-8 border-t border-stone-800 text-center text-xs text-stone-500">
          © {new Date().getFullYear()} Sarthi Portal. Built for Victim Rights, Protection & Peace. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;
