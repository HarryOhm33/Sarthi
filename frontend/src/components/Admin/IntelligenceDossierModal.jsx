import { motion, AnimatePresence } from "framer-motion";
import {
  FiShield,
  FiAlertTriangle,
  FiActivity,
  FiCheckCircle,
  FiClock,
  FiRefreshCw,
  FiX,
} from "react-icons/fi";

const IntelligenceDossierModal = ({
  selectedRecord,
  onClose,
  onRegenerate,
  regeneratingVictimId,
  getRiskBadgeStyles,
}) => {
  if (!selectedRecord) return null;

  const victimId = selectedRecord.victim?._id || selectedRecord.victim;
  const victimName = selectedRecord.victim?.name || "Victim Profile";
  const isRegenerating = regeneratingVictimId === victimId;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-3xl border border-stone-200 shadow-2xl w-full max-w-2xl max-h-[94dvh] flex flex-col overflow-hidden"
        >
          {/* Modal Header */}
          <div className="p-4 sm:p-6 border-b border-stone-100 flex items-center justify-between gap-3 sm:gap-4 bg-stone-50/70">
            <div className="flex items-center gap-3.5">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white text-lg font-black shrink-0 shadow-sm ${
                  selectedRecord.riskLevel === "CRITICAL" ||
                  selectedRecord.riskLevel === "HIGH"
                    ? "bg-rose-600"
                    : "bg-emerald-700"
                }`}
              >
                {selectedRecord.victim?.name
                  ? selectedRecord.victim.name.charAt(0).toUpperCase()
                  : "V"}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-stone-900">
                    {victimName}
                  </h2>
                  {selectedRecord.riskLevel && getRiskBadgeStyles && (
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ring-1 ${getRiskBadgeStyles(
                        selectedRecord.riskLevel
                      )}`}
                    >
                      {selectedRecord.riskLevel} Risk
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-500 font-medium mt-0.5">
                  District:{" "}
                  <strong className="text-stone-700">
                    {selectedRecord.victim?.district || "Bihar"}
                  </strong>{" "}
                  • Case:{" "}
                  <strong className="text-stone-700">
                    {selectedRecord.victim?.caseType || "General"}
                  </strong>{" "}
                  • Status:{" "}
                  <strong className="text-emerald-700">
                    {selectedRecord.victim?.caseStatus || "ONGOING"}
                  </strong>
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors cursor-pointer"
              title="Close Dossier"
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>

          {/* Modal Body (Scrollable) */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5">
            {selectedRecord.isPending ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
                  <FiActivity className="h-8 w-8 text-stone-400" />
                </div>
                <h3 className="text-base font-bold text-stone-800">
                  No AI Analytics Record Found
                </h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  Generate an on-demand clinical and risk evaluation for {victimName} using AI.
                </p>
                <button
                  onClick={() => onRegenerate(victimId, victimName)}
                  disabled={isRegenerating}
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-xs font-black shadow-md flex items-center gap-2 mx-auto transition-all cursor-pointer disabled:opacity-50"
                >
                  <FiRefreshCw
                    className={`h-4 w-4 ${isRegenerating ? "animate-spin" : ""}`}
                  />
                  <span>
                    {isRegenerating
                      ? "Evaluating via AI..."
                      : "Generate In-Depth Analytics"}
                  </span>
                </button>
              </div>
            ) : (
              <>
                {/* Summary Risk & Threat Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/80">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                      Distress Index
                    </span>
                    <span className="text-xl font-black text-stone-900 mt-0.5 block">
                      {selectedRecord.distressScore}{" "}
                      <span className="text-xs text-stone-400 font-normal">
                        / 100
                      </span>
                    </span>
                  </div>

                  <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/80">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                      Sentiment
                    </span>
                    <span
                      className={`text-sm font-black mt-1 block uppercase ${
                        selectedRecord.sentiment === "POSITIVE"
                          ? "text-emerald-700"
                          : selectedRecord.sentiment === "NEGATIVE"
                          ? "text-rose-700"
                          : "text-stone-700"
                      }`}
                    >
                      {selectedRecord.sentiment}
                    </span>
                  </div>

                  <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/80 col-span-2 sm:col-span-1">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                      Protection Need
                    </span>
                    <span className="text-sm font-black mt-1 block text-stone-800">
                      {selectedRecord.threatIndicator ? (
                        <span className="text-rose-700 flex items-center gap-1 font-extrabold">
                          <FiAlertTriangle className="h-3.5 w-3.5" /> High Need
                        </span>
                      ) : (
                        <span className="text-stone-500 font-bold">Standard</span>
                      )}
                    </span>
                  </div>
                </div>

                {/* Threat / Protection Warning Banner */}
                {selectedRecord.threatIndicator && (
                  <div className="p-3.5 bg-rose-50 rounded-2xl border border-rose-200 text-xs font-bold text-rose-900 flex items-center gap-2.5">
                    <FiShield className="h-4 w-4 text-rose-700 shrink-0" />
                    <span>
                      High vulnerability flagged: Immediate protective assistance
                      recommended by AI legal assessment.
                    </span>
                  </div>
                )}

                {/* Executive Assessment Message */}
                <div className="p-4 bg-stone-50/80 rounded-2xl border border-stone-200/90 space-y-1.5">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                    Executive Clinical & Legal Assessment
                  </span>
                  <p className="text-xs text-stone-800 font-semibold leading-relaxed">
                    {selectedRecord.message}
                  </p>
                </div>

                {/* Detected Emotions */}
                {selectedRecord.emotions && selectedRecord.emotions.length > 0 && (
                  <div>
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-1.5">
                      Detected Emotional States
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedRecord.emotions.map((emotion, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-xl bg-stone-100 border border-stone-200 text-stone-700 text-xs font-bold"
                        >
                          {emotion}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reasons & Recommended Interventions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {/* Identified Stressors & Context */}
                  <div className="p-4 rounded-2xl bg-stone-50/70 border border-stone-200/70">
                    <h4 className="text-[11px] font-black text-stone-500 uppercase tracking-wider mb-2.5">
                      Identified Stressors & Context
                    </h4>
                    <ul className="space-y-1.5 text-xs text-stone-700">
                      {selectedRecord.reasons?.map((r, i) => (
                        <li key={i} className="flex items-start gap-1.5 font-medium">
                          <span className="text-emerald-700 font-black">•</span>
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Recommended Officer Actions & Directives */}
                  <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/70">
                    <h4 className="text-[11px] font-black text-emerald-800 uppercase tracking-wider mb-2.5">
                      Recommended Officer Actions & Directives
                    </h4>
                    <ul className="space-y-1.5 text-xs text-emerald-950 font-medium">
                      {selectedRecord.recommendedInterventions?.map((inv, i) => (
                        <li key={i} className="flex items-start gap-1.5 font-medium">
                          <FiCheckCircle className="h-3.5 w-3.5 text-emerald-700 shrink-0 mt-0.5" />
                          <span>{inv}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Timestamp & Refresh Footer */}
                <div className="text-[11px] text-stone-400 font-semibold flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-stone-100">
                  <span className="flex items-center gap-1.5">
                    <FiClock className="h-3.5 w-3.5" />
                    Evaluated{" "}
                    {selectedRecord.createdAt
                      ? new Date(selectedRecord.createdAt).toLocaleString()
                      : "Recently"}
                  </span>

                  <button
                    onClick={() => onRegenerate(victimId, victimName)}
                    disabled={isRegenerating}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                    title="Re-evaluate latest conversation data via AI"
                  >
                    <FiRefreshCw
                      className={`h-3.5 w-3.5 ${
                        isRegenerating ? "animate-spin text-emerald-700" : ""
                      }`}
                    />
                    <span>
                      {isRegenerating ? "Analyzing..." : "Re-Evaluate via AI"}
                    </span>
                  </button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default IntelligenceDossierModal;
