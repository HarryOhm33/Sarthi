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
  FiArrowLeft,
} from "react-icons/fi";
import { toast } from "react-toastify";
import IntelligenceDossierModal from "../components/Admin/IntelligenceDossierModal";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const AdminUsers = () => {
  const { admin, getAdminAuthHeaders } = useAdminAuth();

  const [analytics, setAnalytics] = useState([]);
  const [victims, setVictims] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [regeneratingVictimId, setRegeneratingVictimId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState("ALL"); // 'ALL' | 'CRITICAL' | 'HIGH' | 'THREAT' | 'PENDING'
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Fetch all victims and analytics data
  const fetchData = async () => {
    try {
      setLoadingData(true);
      const headers = getAdminAuthHeaders();

      const [analyticsRes, victimsRes] = await Promise.all([
        axios.get(`${backendUrl}/api/admin/analytics`, { headers, withCredentials: true }),
        axios.get(`${backendUrl}/api/admin/victims`, { headers, withCredentials: true }),
      ]);

      if (analyticsRes.data.success) setAnalytics(analyticsRes.data.analytics || []);
      if (victimsRes.data.success) setVictims(victimsRes.data.victims || []);
    } catch (err) {
      console.error("Failed to load victims analytics:", err);
      toast.error("Failed to load victims and analytics directory");
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchData();
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
        await fetchData();

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

  // Filter combined victims
  const filteredVictims = combinedVictims.filter((item) => {
    const query = searchQuery.toLowerCase();
    const vName = item.name?.toLowerCase() || "";
    const email = item.email?.toLowerCase() || "";
    const district = item.district?.toLowerCase() || "";
    const caseType = item.caseType?.toLowerCase() || "";
    const message = item.analytics?.message?.toLowerCase() || "";

    const matchesQuery =
      vName.includes(query) ||
      email.includes(query) ||
      district.includes(query) ||
      caseType.includes(query) ||
      message.includes(query);

    if (!matchesQuery) return false;

    if (riskFilter === "CRITICAL") return item.analytics?.riskLevel === "CRITICAL";
    if (riskFilter === "HIGH")
      return (
        item.analytics?.riskLevel === "HIGH" ||
        item.analytics?.riskLevel === "CRITICAL"
      );
    if (riskFilter === "THREAT") return Boolean(item.analytics?.threatIndicator);
    if (riskFilter === "PENDING") return !item.analytics;

    return true;
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
    <div className="min-h-full bg-[#f8f7f5] p-3 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 max-w-7xl mx-auto w-full">
      {/* 🏛️ Header with Navigation Back */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-stone-200/90 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-5 relative z-10">
          <div className="flex items-center gap-3.5 sm:gap-4">
            <Link
              to="/admin/dashboard"
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center font-bold transition-all shadow-xs cursor-pointer group shrink-0"
              title="Return to Command Center"
            >
              <FiArrowLeft className="h-5 w-5 group-hover:-translate-x-0.5 transition-transform" />
            </Link>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
                  All Victims & Risk Directory
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] sm:text-[11px] font-black uppercase tracking-wider border border-emerald-200">
                  {victims.length} Registered Cases
                </span>
              </div>
              <p className="text-xs text-stone-500 font-medium mt-1">
                Comprehensive directory of all monitored citizens under Sarthi Legal Defense.
              </p>
            </div>
          </div>

          {/* Quick Refresh */}
          <button
            onClick={fetchData}
            disabled={loadingData}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200 text-xs font-bold transition-all shadow-xs disabled:opacity-50 cursor-pointer self-start md:self-auto"
          >
            <FiRefreshCw className={`h-3.5 w-3.5 ${loadingData ? "animate-spin text-emerald-700" : ""}`} />
            <span>{loadingData ? "Syncing..." : "Sync Directory"}</span>
          </button>
        </div>
      </div>

      {/* 🧭 Control Strip: Filter Chips & Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-stone-200/90 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <FiUsers className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-stone-900 tracking-tight">
                Citizen Directory ({filteredVictims.length} displayed)
              </h2>
              <p className="text-xs text-stone-400 font-medium">
                Tap on any citizen to view clinical AI analytics & protection directives
              </p>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <FiSearch className="absolute left-3.5 top-3 text-stone-400 h-4 w-4 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, district..."
              className="w-full pl-9 pr-9 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl text-xs font-semibold text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-700 transition-all"
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
        </div>

        {/* Quick Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-100">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mr-1">
            Filter:
          </span>
          {[
            { id: "ALL", label: `All Cases (${victims.length})` },
            {
              id: "CRITICAL",
              label: `Critical (${combinedVictims.filter((v) => v.analytics?.riskLevel === "CRITICAL").length})`,
            },
            {
              id: "HIGH",
              label: `High & Critical (${combinedVictims.filter((v) => v.analytics?.riskLevel === "HIGH" || v.analytics?.riskLevel === "CRITICAL").length})`,
            },
            {
              id: "THREAT",
              label: `Protection Needed (${combinedVictims.filter((v) => v.analytics?.threatIndicator).length})`,
            },
            {
              id: "PENDING",
              label: `Pending Evaluation (${combinedVictims.filter((v) => !v.analytics).length})`,
            },
          ].map((chip) => (
            <button
              key={chip.id}
              onClick={() => setRiskFilter(chip.id)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                riskFilter === chip.id
                  ? "bg-stone-900 text-white shadow-xs"
                  : "bg-stone-50 hover:bg-stone-100 text-stone-600 border border-stone-200"
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* 📋 Complete Victims Directory Feed */}
      <div className="flex-1 space-y-3">
        {filteredVictims.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-stone-200/90 text-stone-400 space-y-3 shadow-xs">
            <FiActivity className="h-10 w-10 mx-auto text-stone-300" />
            <h4 className="text-base font-bold text-stone-700">No Citizen Records Found</h4>
            <p className="text-xs text-stone-500 max-w-md mx-auto">
              {searchQuery || riskFilter !== "ALL"
                ? "No citizens match your active search or filter selection."
                : "No registered victims in the database."}
            </p>
            {(searchQuery || riskFilter !== "ALL") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setRiskFilter("ALL");
                }}
                className="mt-2 px-4 py-2 bg-stone-900 text-white text-xs font-bold rounded-xl shadow-xs hover:bg-stone-800 transition-all cursor-pointer"
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          filteredVictims.map((item) => {
            const hasAnalytics = Boolean(item.analytics);
            const isHighRisk =
              item.analytics?.riskLevel === "HIGH" ||
              item.analytics?.riskLevel === "CRITICAL";

            return (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/90 shadow-xs hover:border-emerald-600/40 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
              >
                {/* 👤 Left: Victim Profile Summary */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <button
                    onClick={() => openVictimAnalytics(item)}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm text-white shrink-0 shadow-sm transition-transform group-hover:scale-105 cursor-pointer ${
                      isHighRisk
                        ? "bg-rose-600"
                        : hasAnalytics
                        ? "bg-emerald-700"
                        : "bg-stone-400"
                    }`}
                    title="Click to open In-Depth Intelligence Dossier"
                  >
                    {item.name ? item.name.charAt(0).toUpperCase() : "V"}
                  </button>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => openVictimAnalytics(item)}
                        className="text-base font-black text-stone-900 hover:text-emerald-700 transition-colors text-left cursor-pointer truncate flex items-center gap-1.5"
                        title="Click to open In-Depth Intelligence Dossier"
                      >
                        <span>{item.name || "Anonymous Victim"}</span>
                        <FiChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-700" />
                      </button>

                      {/* Status / Threat Badges */}
                      {item.analytics?.threatIndicator && (
                        <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-black uppercase flex items-center gap-1 shrink-0">
                          <FiShield className="h-3 w-3" /> Might Need Protection
                        </span>
                      )}

                      {!hasAnalytics && (
                        <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 text-[10px] font-bold">
                          Pending AI Evaluation
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
                      <span>•</span>
                      <span className="text-emerald-700 font-bold">
                        {item.caseStatus || "ONGOING"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 🎯 Right: Risk Badges, Distress Level & Action Buttons */}
                <div className="flex flex-wrap items-center gap-2.5 shrink-0 justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-stone-100">
                  {hasAnalytics ? (
                    <>
                      {/* Risk Level Badge */}
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ring-1 ${getRiskBadgeStyles(
                          item.analytics.riskLevel
                        )}`}
                      >
                        Risk: {item.analytics.riskLevel}
                      </span>

                      {/* Distress Score Badge */}
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-50 border border-stone-200">
                        <span className="text-[10px] font-bold text-stone-400 uppercase">Distress:</span>
                        <span className="text-xs font-black text-stone-900">
                          {item.analytics.distressScore}
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
                    </>
                  ) : (
                    /* If no analytics yet, provide 1-click generation CTA */
                    <button
                      onClick={() =>
                        handleRegenerateVictimAnalytics(item._id, item.name)
                      }
                      disabled={regeneratingVictimId === item._id}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all cursor-pointer shadow-xs disabled:opacity-50"
                    >
                      <FiRefreshCw
                        className={`h-3.5 w-3.5 ${
                          regeneratingVictimId === item._id
                            ? "animate-spin text-white"
                            : ""
                        }`}
                      />
                      <span>
                        {regeneratingVictimId === item._id
                          ? "Evaluating..."
                          : "Evaluate via AI"}
                      </span>
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })
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

export default AdminUsers;
