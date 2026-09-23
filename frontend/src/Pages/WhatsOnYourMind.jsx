import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSend,
  FiShield,
  FiLoader,
  FiMessageSquare,
  FiClock,
  FiInfo,
  FiSettings,
  FiLock,
  FiCopy,
  FiCheck,
  FiMic,
  FiSquare,
} from "react-icons/fi";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

// Clean any markdown symbols and render as natural plain chat paragraphs
const renderFormattedContent = (content, isTyping = false) => {
  if (!content && !isTyping) return null;
  const cleaned = (content || "")
    .replace(/^#+\s+/gm, "") // remove heading hashes
    .replace(/\*\*(.*?)\*\*/g, "$1") // remove bold asterisks
    .replace(/\*(.*?)\*/g, "$1") // remove single asterisks
    .replace(/^[\*\-]\s+/gm, "") // remove bullet dashes/stars
    .replace(/[#*`~]/g, "") // remove any remaining rogue symbols
    .trim();

  const paragraphs = cleaned.split(/\n\s*\n/).filter(Boolean);

  if (paragraphs.length === 0 && isTyping) {
    return (
      <p>
        <span className="inline-block w-1.5 h-3.5 bg-emerald-700 animate-pulse align-middle rounded-xs" />
      </p>
    );
  }

  return paragraphs.map((para, pIdx) => (
    <p key={pIdx} className={pIdx > 0 ? "mt-2" : ""}>
      {para}
      {isTyping && pIdx === paragraphs.length - 1 && (
        <span className="inline-block w-1.5 h-3.5 bg-emerald-700 ml-1 animate-pulse align-middle rounded-xs" />
      )}
    </p>
  ));
};

// Helper to group messages by Date (Today, Yesterday, or Specific Date)
const groupMessagesByDate = (msgs) => {
  const groups = {};

  msgs.forEach((msg) => {
    const msgDate = msg.createdAt ? new Date(msg.createdAt) : new Date();
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    let dateKey = "";
    if (msgDate.toDateString() === today.toDateString()) {
      dateKey = "Today";
    } else if (msgDate.toDateString() === yesterday.toDateString()) {
      dateKey = "Yesterday";
    } else {
      dateKey = msgDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }

    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(msg);
  });

  return groups;
};

// ⌨️ Typewriter Effect Component for newly arrived bot messages
const TypewriterText = ({ fullText, isNew, onProgress, onComplete }) => {
  const [displayedText, setDisplayedText] = useState(isNew ? "" : fullText);
  const [isTyping, setIsTyping] = useState(isNew);

  useEffect(() => {
    if (!isNew) {
      setDisplayedText(fullText);
      setIsTyping(false);
      return;
    }

    setDisplayedText("");
    setIsTyping(true);

    let currentIndex = 0;
    const speed = 14; // ms per chunk
    const chunkSize = 2; // characters per tick for a smooth, natural flow

    const intervalId = setInterval(() => {
      currentIndex += chunkSize;
      if (currentIndex >= fullText.length) {
        setDisplayedText(fullText);
        setIsTyping(false);
        clearInterval(intervalId);
        if (onComplete) onComplete();
        if (onProgress) onProgress();
      } else {
        setDisplayedText(fullText.slice(0, currentIndex));
        if (onProgress) onProgress();
      }
    }, speed);

    return () => clearInterval(intervalId);
  }, [fullText, isNew]);

  return (
    <div className="relative">
      {renderFormattedContent(displayedText, isTyping)}
    </div>
  );
};

const WhatsOnYourMind = () => {
  const { victim } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [typingMessageId, setTypingMessageId] = useState(null);
  const messagesEndRef = useRef(null);

  // 🎙️ Native Browser Voice Recording States
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  const recognitionRef = useRef(null);
  const recordingTimerRef = useRef(null);
  const baseTextRef = useRef("");

  const getAuthHeaders = () => {
    const token = Cookies.get("magicalKey");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const handleCopyMessage = async (id, text) => {
    if (!text) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopiedId(id);
      setTimeout(() => {
        setCopiedId(null);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy message:", err);
      toast.error("Failed to copy to clipboard");
    }
  };

  // 📜 Fetch chat history on component mount
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoadingHistory(true);
        const res = await axios.get(`${backendUrl}/api/chat/history`, {
          headers: getAuthHeaders(),
          withCredentials: true,
        });

        if (res.data.success) {
          setMessages(res.data.messages || []);
        }
      } catch (err) {
        console.error("Failed to load chat history:", err);
      } finally {
        setLoadingHistory(false);
      }
    };

    fetchHistory();
  }, []);

  // 📜 Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending]);

  // 🎙️ Cleanup speech recognition & timer on unmount
  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    };
  }, []);

  // 🎙️ Start Native Browser Voice Input
  const startRecording = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast.error(
        "Voice input is not supported in this browser. Please use Google Chrome, Microsoft Edge, or Safari."
      );
      return;
    }

    try {
      baseTextRef.current = inputMessage ? inputMessage.trim() + " " : "";

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = navigator.language || "en-IN";

      recognition.onresult = (event) => {
        let transcript = "";
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) {
          setInputMessage(baseTextRef.current + transcript);
        }
      };

      recognition.onerror = (event) => {
        if (event.error === "not-allowed" || event.error === "service-not-allowed") {
          toast.error("Microphone access denied. Please allow mic permissions in your browser.");
          stopRecording();
        }
      };

      recognition.onend = () => {
        setIsRecording(false);
        if (recordingTimerRef.current) {
          clearInterval(recordingTimerRef.current);
          recordingTimerRef.current = null;
        }
      };

      recognition.start();
      recognitionRef.current = recognition;

      setIsRecording(true);
      setRecordingSeconds(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Speech recognition start error:", err);
      toast.error("Could not start voice input.");
      stopRecording();
    }
  };

  // ⏹️ Stop Native Voice Input
  const stopRecording = () => {
    setIsRecording(false);

    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      recognitionRef.current = null;
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // 🚀 Send Message Handler
  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputMessage;
    if (!text || !text.trim() || isSending) return;

    const userText = text.trim();
    setInputMessage("");

    // Optimistic local add for immediate feedback
    const tempUserMsg = {
      _id: Date.now().toString(),
      sender: "victim",
      message: userText,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempUserMsg]);
    setIsSending(true);

    try {
      const res = await axios.post(
        `${backendUrl}/api/chat/send`,
        { message: userText },
        {
          headers: getAuthHeaders(),
          withCredentials: true,
        }
      );

      if (res.data.success && res.data.messages) {
        // Find newly received bot message to animate typing
        const newBotMsg = res.data.messages.find((m) => m.sender === "bot");
        if (newBotMsg && newBotMsg._id) {
          setTypingMessageId(newBotMsg._id);
        }

        // Replace temp and append bot message
        setMessages((prev) => [
          ...prev.filter((m) => m._id !== tempUserMsg._id),
          ...res.data.messages,
        ]);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send message");
      setMessages((prev) => prev.filter((m) => m._id !== tempUserMsg._id));
    } finally {
      setIsSending(false);
    }
  };

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div className="w-full h-full flex flex-col min-h-0 flex-1">
      {/* 🌟 Full-Width Header with Privacy & Advisory Notices */}
      <div className="bg-white px-5 py-3 rounded-2xl border border-stone-200/90 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-3 shrink-0 mb-3 w-full">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-700 to-teal-600 text-white flex items-center justify-center font-bold shadow-sm">
            <FiShield className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base font-black text-stone-900 tracking-tight flex items-center gap-2">
              Sarthi Companion
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Active"></span>
            </h1>
            <p className="text-stone-500 text-xs font-medium">
              What&apos;s on your mind today, {victim?.name || "there"}?
            </p>
          </div>
        </div>

        {/* 🔒 Notices: Privacy Assurance & Settings Advice (Side-by-Side) */}
        <div className="flex flex-row items-center gap-2 text-xs flex-nowrap shrink-0 overflow-x-auto py-0.5">
          {/* Privacy Assurance Badge */}
          <div className="flex items-center gap-1.5 text-emerald-950 bg-emerald-50/90 border border-emerald-200 px-3 py-1.5 rounded-xl font-semibold shadow-2xs whitespace-nowrap shrink-0">
            <FiLock className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
            <span>
              We care about your privacy. Your chats are only used in analytics; no one can see them.
            </span>
          </div>

          {/* Clear Chat Recommendation Notice */}
          <div className="flex items-center gap-1.5 text-stone-600 bg-stone-50 border border-stone-200/80 px-3 py-1.5 rounded-xl font-medium whitespace-nowrap shrink-0">
            <FiInfo className="h-3.5 w-3.5 text-amber-600 shrink-0" />
            <span>Clear chat is available in</span>
            <Link
              to="/dashboard/settings"
              className="font-extrabold text-emerald-800 hover:text-emerald-950 underline decoration-emerald-500/40 hover:decoration-emerald-700 flex items-center gap-1 cursor-pointer"
            >
              <FiSettings className="h-3 w-3" />
              <span>Settings</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 💬 Full-Width Messages Container */}
      <div className="flex-1 w-full min-h-0 bg-white rounded-2xl border border-stone-200/90 shadow-sm p-4 sm:p-6 overflow-y-auto space-y-6">
        {loadingHistory ? (
          <div className="h-full flex flex-col items-center justify-center text-stone-400 gap-2">
            <FiLoader className="h-6 w-6 animate-spin text-emerald-700" />
            <p className="text-xs font-bold">Loading conversation history...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-400 space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center text-2xl font-bold">
              <FiMessageSquare className="h-7 w-7 text-stone-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-800">
                No previous messages
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mt-1">
                Type anything on your mind to start a confidential conversation with Sarthi.
              </p>
            </div>
          </div>
        ) : (
          Object.entries(groupedMessages).map(([dateGroup, groupMsgs]) => (
            <div key={dateGroup} className="space-y-4">
              {/* 🗓️ Timeslot / Date Divider Badge */}
              <div className="flex items-center justify-center my-2">
                <div className="px-3.5 py-1 rounded-full bg-stone-100 border border-stone-200 text-stone-500 text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 shadow-2xs">
                  <FiClock className="h-3 w-3 text-emerald-700" />
                  <span>{dateGroup}</span>
                </div>
              </div>

              {/* Messages in this timeslot */}
              <AnimatePresence initial={false}>
                {groupMsgs.map((msg, idx) => {
                  const isBot = msg.sender === "bot";
                  return (
                    <motion.div
                      key={msg._id || idx}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`group flex items-start gap-2.5 ${
                        isBot ? "justify-start" : "justify-end"
                      }`}
                    >
                      {isBot && (
                        <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-xs text-xs font-bold mt-1">
                          <FiShield className="h-3.5 w-3.5" />
                        </div>
                      )}

                      <div
                        className={`max-w-[90%] sm:max-w-[85%] lg:max-w-4xl px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                          isBot
                            ? "bg-stone-50 text-stone-800 border border-stone-200/90 rounded-tl-xs shadow-2xs"
                            : "bg-emerald-700 text-white rounded-tr-xs shadow-xs font-medium"
                        }`}
                      >
                        {isBot ? (
                          <div className="text-stone-800">
                            <TypewriterText
                              fullText={msg.message}
                              isNew={typingMessageId === msg._id}
                              onProgress={scrollToBottom}
                              onComplete={() => setTypingMessageId(null)}
                            />
                          </div>
                        ) : (
                          <p className="whitespace-pre-wrap">{msg.message}</p>
                        )}

                        {/* Message Footer: Copy Option & Timestamp */}
                        <div
                          className={`flex items-center justify-between gap-4 mt-2 pt-1.5 border-t text-[11px] ${
                            isBot
                              ? "border-stone-200/70"
                              : "border-emerald-600/70"
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() =>
                              handleCopyMessage(msg._id || idx, msg.message)
                            }
                            className={`inline-flex items-center gap-1.5 font-semibold transition-all duration-150 cursor-pointer select-none ${
                              copiedId === (msg._id || idx)
                                ? "opacity-100"
                                : "opacity-0 group-hover:opacity-100 focus:opacity-100"
                            } ${
                              isBot
                                ? "text-stone-400 hover:text-emerald-700"
                                : "text-emerald-200 hover:text-white"
                            }`}
                            title="Copy message text"
                          >
                            {copiedId === (msg._id || idx) ? (
                              <>
                                <FiCheck
                                  className={`h-3 w-3 ${
                                    isBot ? "text-emerald-600" : "text-white"
                                  }`}
                                />
                                <span
                                  className={`text-[10px] font-bold ${
                                    isBot ? "text-emerald-600" : "text-white"
                                  }`}
                                >
                                  Copied!
                                </span>
                              </>
                            ) : (
                              <>
                                <FiCopy className="h-3 w-3" />
                                <span className="text-[10px]">Copy</span>
                              </>
                            )}
                          </button>

                          <span
                            className={`text-[10px] font-semibold ${
                              isBot ? "text-stone-400" : "text-emerald-200"
                            }`}
                          >
                            {msg.createdAt
                              ? new Date(msg.createdAt).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "Just now"}
                          </span>
                        </div>
                      </div>

                      {!isBot && (
                        <div className="w-7 h-7 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center shrink-0 text-xs font-black mt-1">
                          {victim?.name ? victim.name.charAt(0).toUpperCase() : "V"}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          ))
        )}

        {/* Typing Indicator: 3 Horizontal Dots changing position */}
        {isSending && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 text-xs font-semibold text-emerald-950 bg-emerald-50 px-4 py-2.5 rounded-2xl border border-emerald-200 shadow-2xs w-fit"
          >
            <div className="flex items-center gap-1.5 h-4 px-0.5">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="w-2 h-2 rounded-full bg-emerald-700 inline-block"
                  animate={{
                    y: [0, -6, 0],
                    scale: [1, 1.25, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 0.75,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.18,
                  }}
                />
              ))}
            </div>
            <span className="font-bold tracking-tight text-emerald-900">
              Sarthi is thinking...
            </span>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 🔴 Active Recording Status Floating Pill */}
      {isRecording && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          className="mt-2 flex items-center justify-between gap-3 px-4 py-2 bg-rose-50 border border-rose-200 rounded-2xl text-xs font-bold text-rose-900 shadow-xs"
        >
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping"></span>
            <span>Recording voice... Speak now</span>
            <span className="font-mono text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md text-[11px]">
              {Math.floor(recordingSeconds / 60)}:
              {String(recordingSeconds % 60).padStart(2, "0")}
            </span>
          </div>

          <button
            type="button"
            onClick={stopRecording}
            className="text-[11px] px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg cursor-pointer font-extrabold flex items-center gap-1 shadow-2xs transition-colors"
          >
            <FiSquare className="h-2.5 w-2.5 fill-current" />
            <span>Done</span>
          </button>
        </motion.div>
      )}

      {/* ⌨️ Clean Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="mt-3 bg-white p-2.5 rounded-2xl border border-stone-200/90 shadow-sm flex items-center gap-2 shrink-0 relative"
      >
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder={
            isRecording
              ? "Listening to your voice... Speak now"
              : "Write what's on your mind or tap the mic..."
          }
          disabled={isSending}
          className={`flex-1 px-4 py-2 bg-stone-50 border rounded-xl text-stone-900 placeholder-stone-400 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white transition-all disabled:opacity-60 ${
            isRecording ? "border-rose-400 bg-rose-50/40" : "border-stone-200"
          }`}
        />

        {/* 🎙️ Voice Input (Start/Stop Recording) */}
        <button
          type="button"
          onClick={toggleRecording}
          disabled={isSending}
          className={`p-2.5 rounded-xl text-sm font-bold flex items-center justify-center transition-all cursor-pointer shrink-0 disabled:opacity-40 ${
            isRecording
              ? "bg-rose-600 text-white shadow-md ring-4 ring-rose-500/20 animate-pulse hover:bg-rose-700"
              : "bg-stone-100 hover:bg-emerald-50 text-stone-600 hover:text-emerald-800 border border-stone-200"
          }`}
          title={isRecording ? "Stop voice input" : "Voice input (speak to type)"}
        >
          {isRecording ? (
            <FiSquare className="h-4 w-4 fill-current" />
          ) : (
            <FiMic className="h-4 w-4" />
          )}
        </button>

        {/* 🚀 Send Button */}
        <button
          type="submit"
          disabled={!inputMessage.trim() || isSending || isRecording}
          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white font-extrabold rounded-xl shadow-xs flex items-center gap-1.5 text-sm transition-all cursor-pointer shrink-0"
        >
          {isSending ? (
            <FiLoader className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <span>Send</span>
              <FiSend className="h-3.5 w-3.5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default WhatsOnYourMind;
