import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAdminAuth } from "../contexts/AdminAuthContext";
import { motion } from "framer-motion";
import {
  FiShield,
  FiUsers,
  FiAlertTriangle,
  FiActivity,
  FiSearch,
  FiEye,
  FiMapPin,
  FiRefreshCw,
  FiX,
  FiChevronRight,
  FiArrowRight,
  FiCheckCircle,
} from "react-icons/fi";
import { toast } from "react-toastify";
import IntelligenceDossierModal from "../components/Admin/IntelligenceDossierModal";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const AdminDashboard = () => {
  const { admin, getAdminAuthHeaders } = useAdminAuth();

  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState([]);
  const [victims, setVictims] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [regeneratingVictimId, setRegeneratingVictimId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Fetch all admin dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoadingData(true);
      const headers = getAdminAuthHeaders();

      const [statsRes, analyticsRes, victimsRes] = await Promise.all([
        axios.get(`${backendUrl}/api/admin/stats`, { headers, withCredentials: true }),
        axios.get(`${backendUrl}/api/admin/analytics`, { headers, withCredentials: true }),
        axios.get(`${backendUrl}/api/admin/victims`, { headers, withCredentials: true }),
      ]);

      if (statsRes.data.success) setStats(statsRes.data.stats);
      if (analyticsRes.data.success) setAnalytics(analyticsRes.data.analytics || []);
      if (victimsRes.data.success) setVictims(victimsRes.data.victims || []);
    } catch (err) {
      console.error("Failed to load admin data:", err);
      toast.error("Failed to refresh admin dashboard data");
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Open in-depth analytics modal for a victim
  const openVictimAnalytics = (victimObj) => {
    const vId = victimObj._id || victimObj;
    const existingRecord = analytics.find(
      (a) => (a.victim?._id || a.victim) === vId
    );

    if (existingRecord) {
      setSelectedRecord(existingRecord);
    } else {
      setSelectedRecord({
        victim: typeof victimObj === "object" ? victimObj : { _id: victimObj },
        isPending: true,
      });
    }
  };

  // Regenerate latest analytics for a specific victim
  const handleRegenerateVictimAnalytics = async (victimId, victimName = "victim") => {
    if (!victimId) {
      toast.error("Unable to identify victim for analysis");
      return;
    }
    try {
      setRegeneratingVictimId(victimId);
      toast.info(`Evaluating latest chat & risk data for ${victimName} via AI...`);

      const res = await axios.post(
        `${backendUrl}/api/admin/victim/${victimId}/regenerate-analytics`,
        {},
        { headers: getAdminAuthHeaders(), withCredentials: true }
      );

      if (res.data.success && res.data.analytics) {
        toast.success(`Latest analytics generated for ${victimName}!`);
        await fetchDashboardData();

        // Update currently open modal if it corresponds to this victim
        setSelectedRecord((current) => {
          if (
            current &&
            ((current.victim?._id || current.victim) === victimId ||
              (current.victim?._id || current.victim) === res.data.analytics.victim?._id)
          ) {
            return res.data.analytics;
          }
          return current;
        });
      }
    } catch (err) {
      console.error("Failed to regenerate analytics:", err);
      toast.error(
        err.response?.data?.message || `Failed to regenerate analytics for ${victimName}`
      );
    } finally {
      setRegeneratingVictimId(null);
    }
  };

  // Combine victims with their latest AI analytics
  const combinedVictims = victims.map((victim) => {
    const analytic = analytics.find(
      (a) => (a.victim?._id || a.victim) === victim._id
    );
    return {
      ...victim,
      analytics: analytic || null,
    };
  });

  // Filter for ONLY immediate action cases on the main dashboard:
  // - Critical Risk, or High Risk, or Threat indicator ("Might need protection"), or acute distress score >= 70
  const immediateActionVictims = combinedVictims.filter((item) => {
    const isCritical = item.analytics?.riskLevel === "CRITICAL";
    const isHigh = item.analytics?.riskLevel === "HIGH";
    const hasThreat = Boolean(item.analytics?.threatIndicator);
    const highDistress = (item.analytics?.distressScore || 0) >= 70;
    return isCritical || isHigh || hasThreat || highDistress;
  });

  // Filter immediate action cases by search query
  const filteredImmediateVictims = immediateActionVictims.filter((item) => {
    const query = searchQuery.toLowerCase();
    const vName = item.name?.toLowerCase() || "";
    const email = item.email?.toLowerCase() || "";
    const district = item.district?.toLowerCase() || "";
    const caseType = item.caseType?.toLowerCase() || "";
    const message = item.analytics?.message?.toLowerCase() || "";

    return (
      vName.includes(query) ||
      email.includes(query) ||
      district.includes(query) ||
      caseType.includes(query) ||
      message.includes(query)
    );
  });

  const getRiskBadgeStyles = (level) => {
    switch (level) {
      case "CRITICAL":
        return "bg-rose-50 text-rose-700 border-rose-200 ring-rose-500/20";
      case "HIGH":
        return "bg-amber-50 text-amber-800 border-amber-200 ring-amber-500/20";
      case "MEDIUM":
        return "bg-stone-100 text-stone-800 border-stone-300 ring-stone-500/10";
      default:
        return "bg-emerald-50 text-emerald-800 border-emerald-200 ring-emerald-500/20";
    }
  };

  return (
    <div className="min-h-full bg-[#f8f7f5] flex flex-col p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* 🏛️ Executive Command Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/90 shadow-xs relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-rose-500/10 via-amber-500/5 to-transparent rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-stone-900 to-stone-800 text-white flex items-center justify-center font-black shadow-lg ring-4 ring-emerald-500/10 shrink-0">
              <FiShield className="h-7 w-7 text-emerald-400" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl font-black text-stone-900 tracking-tight">
                  Sarthi Command Center
                </h1>
                <span className="px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[11px] font-black uppercase tracking-wider border border-emerald-200">
                  {admin?.role || "LEGAL CELL"}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200/60">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active AI Surveillance
                </span>
              </div>
              <p className="text-xs text-stone-500 font-medium mt-1">
                Authorized Officer: <strong className="text-stone-800">{admin?.name}</strong> • {admin?.department || "Department of Victim Safety & Legal Defense"}
              </p>
            </div>
          </div>

          {/* Quick Actions: Sync + View All Users Link */}
          <div className="flex flex-wrap items-center gap-3 shrink-0 self-start md:self-auto">
            <Link
              to="/admin/dashboard/users"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer group"
            >
              <FiUsers className="h-3.5 w-3.5 text-emerald-400" />
              <span>All Victims Directory ({victims.length})</span>
              <FiArrowRight className="h-3.5 w-3.5 text-stone-400 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <button
              onClick={fetchDashboardData}
              disabled={loadingData}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200 text-xs font-bold transition-all shadow-xs disabled:opacity-50 cursor-pointer"
              title="Sync latest database records"
            >
              <FiRefreshCw className={`h-3.5 w-3.5 ${loadingData ? "animate-spin text-emerald-700" : ""}`} />
              <span>{loadingData ? "Synchronizing..." : "Sync"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 📊 High-Impact Analytics & Risk KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Total Registered Victims */}
        <Link
          to="/admin/dashboard/users"
          className="bg-white p-5 sm:p-6 rounded-3xl border border-stone-200/90 shadow-xs relative overflow-hidden group hover:border-emerald-500/40 hover:shadow-md transition-all block"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 group-hover:text-emerald-700 transition-colors">
              Monitored Cases
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <FiUsers className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-stone-900 tracking-tight">
              {stats?.totalVictims ?? 0}
            </span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1">
              View All <FiArrowRight className="h-3 w-3" />
            </span>
          </div>
          <p className="text-[11px] text-stone-400 font-medium mt-2">
            Click to view complete victim directory & analytics
          </p>
        </Link>

        {/* 2. Immediate Action Cases Count */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-stone-200/90 shadow-xs relative overflow-hidden group hover:border-rose-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
              Immediate Action Required
            </span>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center font-bold">
              <FiAlertTriangle className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-rose-700 tracking-tight flex items-center gap-2">
              {immediateActionVictims.length}
              {immediateActionVictims.length > 0 && (
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
              )}
            </span>
            <span className="text-xs font-semibold text-rose-800 bg-rose-50 px-2 py-0.5 rounded-md">
              Priority
            </span>
          </div>
          <p className="text-[11px] text-stone-400 font-medium mt-2">
            Active cases flagged for urgent officer review
          </p>
        </div>

        {/* 3. Protection Interventions Advised */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-stone-200/90 shadow-xs relative overflow-hidden group hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
              Protection Needed
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <FiShield className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-900 tracking-tight">
              {stats?.activeThreatsCount ?? 0}
            </span>
            <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md">
              Directives Active
            </span>
          </div>
          <p className="text-[11px] text-stone-400 font-medium mt-2">
            Cases flagged requiring officer protective assistance
          </p>
        </div>

        {/* 4. Average Distress Index Meter */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-stone-200/90 shadow-xs relative overflow-hidden group hover:border-teal-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
              Avg Distress Score
            </span>
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              <FiActivity className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-stone-900 tracking-tight">
              {stats?.avgDistressScore ?? 0}
            </span>
            <span className="text-sm font-semibold text-stone-400">/ 100</span>
          </div>
          {/* Mini progress bar gauge */}
          <div className="w-full h-2 bg-stone-100 rounded-full mt-3 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                (stats?.avgDistressScore || 0) > 75
                  ? "bg-rose-500"
                  : (stats?.avgDistressScore || 0) > 50
                  ? "bg-amber-500"
                  : "bg-emerald-500"
              }`}
              style={{ width: `${Math.min(100, stats?.avgDistressScore || 0)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* 🚨 Immediate Action Feed Header & Search */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-stone-200/90 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center font-bold shrink-0">
              <FiAlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-stone-900 tracking-tight">
                  Immediate Action Required
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-black uppercase">
                  {immediateActionVictims.length} Critical
                </span>
              </div>
              <p className="text-xs text-stone-400 font-medium">
                Victims flagged with high/critical risk or acute safety distress requiring intervention
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Search Box */}
            <div className="relative w-full md:w-72">
              <FiSearch className="absolute left-3.5 top-3 text-stone-400 h-4 w-4 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search immediate action cases..."
                className="w-full pl-9 pr-9 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl text-xs font-semibold text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-3 text-stone-400 hover:text-stone-600 cursor-pointer"
                >
                  <FiX className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Link to Full Directory */}
            <Link
              to="/admin/dashboard/users"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-all shrink-0 cursor-pointer"
            >
              <span>View All Users</span>
              <FiArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 📋 Immediate Action Cases List */}
      <div className="flex-1 space-y-3">
        {immediateActionVictims.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-stone-200/90 text-stone-500 space-y-4 shadow-xs">
            <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <FiCheckCircle className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-black text-stone-900">
                All Monitored Cases Stable
              </h3>
              <p className="text-xs text-stone-500 max-w-md mx-auto">
                No victims currently require immediate protective intervention. All active cases are within standard thresholds.
              </p>
            </div>
            <Link
              to="/admin/dashboard/users"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-2xl transition-all shadow-xs cursor-pointer"
            >
              <FiUsers className="h-4 w-4 text-emerald-400" />
              <span>Browse All Registered Victims ({victims.length})</span>
            </Link>
          </div>
        ) : filteredImmediateVictims.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-stone-200/90 text-stone-400 space-y-3 shadow-xs">
            <FiActivity className="h-10 w-10 mx-auto text-stone-300" />
            <h4 className="text-base font-bold text-stone-700">No Matching Cases Found</h4>
            <p className="text-xs text-stone-500 max-w-md mx-auto">
              No immediate action cases match your search query &ldquo;{searchQuery}&rdquo;.
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-2 px-4 py-2 bg-stone-900 text-white text-xs font-bold rounded-xl shadow-xs hover:bg-stone-800 transition-all cursor-pointer"
            >
              Clear Search
            </button>
          </div>
        ) : (
          filteredImmediateVictims.map((item) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-rose-200/80 shadow-xs hover:border-rose-400 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
            >
              {/* 👤 Left: Victim Profile Summary */}
              <div className="flex items-center gap-3.5 min-w-0">
                <button
                  onClick={() => openVictimAnalytics(item)}
                  className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-sm transition-transform group-hover:scale-105 cursor-pointer"
                  title="Click to open In-Depth Intelligence Dossier"
                >
                  {item.name ? item.name.charAt(0).toUpperCase() : "V"}
                </button>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => openVictimAnalytics(item)}
                      className="text-base font-black text-stone-900 hover:text-rose-700 transition-colors text-left cursor-pointer truncate flex items-center gap-1.5"
                      title="Click to open In-Depth Intelligence Dossier"
                    >
                      <span>{item.name || "Anonymous Victim"}</span>
                      <FiChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-rose-600" />
                    </button>

                    {item.analytics?.threatIndicator && (
                      <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-black uppercase flex items-center gap-1 shrink-0">
                        <FiShield className="h-3 w-3" /> Might Need Protection
                      </span>
                    )}

                    {item.analytics?.riskLevel && (
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ring-1 ${getRiskBadgeStyles(
                          item.analytics.riskLevel
                        )}`}
                      >
                        Risk: {item.analytics.riskLevel}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 font-medium mt-1">
                    <span className="text-stone-400">{item.email}</span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1">
                      <FiMapPin className="h-3 w-3 text-stone-400" />
                      {item.district || "Bihar"}
                    </span>
                    <span>•</span>
                    <span className="text-stone-700 font-bold">
                      {item.caseType || "General Protection"}
                    </span>
                  </div>
                </div>
              </div>

              {/* 🎯 Right: Risk Badges, Distress Level & Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 shrink-0 justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-stone-100">
                {/* Distress Score Badge */}
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-50 border border-stone-200">
                  <span className="text-[10px] font-bold text-stone-400 uppercase">Distress:</span>
                  <span className="text-xs font-black text-rose-700">
                    {item.analytics?.distressScore ?? "N/A"}
                  </span>
                  <span className="text-[10px] text-stone-400">/ 100</span>
                </div>

                {/* View In-Depth Analytics Primary CTA */}
                <button
                  onClick={() => openVictimAnalytics(item)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
                  title="View comprehensive clinical & risk analytics"
                >
                  <FiEye className="h-3.5 w-3.5 text-emerald-400" />
                  <span>In-Depth</span>
                </button>

                {/* Refresh Button */}
                <button
                  onClick={() =>
                    handleRegenerateVictimAnalytics(item._id, item.name)
                  }
                  disabled={regeneratingVictimId === item._id}
                  className="inline-flex items-center gap-1.5 p-2 rounded-xl bg-stone-100 hover:bg-emerald-50 text-stone-700 hover:text-emerald-800 border border-stone-200 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                  title="Re-evaluate latest chat data via AI"
                >
                  <FiRefreshCw
                    className={`h-3.5 w-3.5 ${
                      regeneratingVictimId === item._id
                        ? "animate-spin text-emerald-700"
                        : ""
                    }`}
                  />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* 🏛️ Executive Intelligence Dossier Modal */}
      <IntelligenceDossierModal
        selectedRecord={selectedRecord}
        onClose={() => setSelectedRecord(null)}
        onRegenerate={handleRegenerateVictimAnalytics}
        regeneratingVictimId={regeneratingVictimId}
        getRiskBadgeStyles={getRiskBadgeStyles}
      />
    </div>
  );
};

export default AdminDashboard;
