import React, { useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx"; 

/* =========================================================
   1. please workxICONS (Defined locally to prevent import crashes)
========================================================= */
const Icon = ({ path, size = 20, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {path}
  </svg>
);

const Icons = {
  AlertCircle: (p) => <Icon {...p} path={<><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></>} />,
  AlertTriangle: (p) => <Icon {...p} path={<><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></>} />,
  Check: (p) => <Icon {...p} path={<polyline points="20 6 9 17 4 12" />} />,
  ChevronLeft: (p) => <Icon {...p} path={<polyline points="15 18 9 12 15 6" />} />,
  ChevronRight: (p) => <Icon {...p} path={<polyline points="9 18 15 12 9 6" />} />,
  List: (p) => <Icon {...p} path={<><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></>} />,
  PieChart: (p) => <Icon {...p} path={<><path d="M21.21 15.89A10 10 0 1 1 8 2.83" /><path d="M22 12A10 10 0 0 0 12 2v10z" /></>} />,
  Landmark: (p) => <Icon {...p} path={<><line x1="3" y1="22" x2="21" y2="22" /><line x1="6" y1="18" x2="6" y2="11" /><line x1="10" y1="18" x2="10" y2="11" /><line x1="14" y1="18" x2="14" y2="11" /><line x1="18" y1="18" x2="18" y2="11" /><polygon points="12 2 20 7 4 7" /></>} />,
  Settings: (p) => <Icon {...p} path={<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />} />,
  Plus: (p) => <Icon {...p} path={<><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>} />,
  Trash2: (p) => <Icon {...p} path={<><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></>} />,
  User: (p) => <Icon {...p} path={<><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>} />,
  X: (p) => <Icon {...p} path={<><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>} />,
  Camera: (p) => <Icon {...p} path={<><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></>} />,
  Sparkles: (p) => <Icon {...p} path={<path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L12 3Z" />} />,
  Share: (p) => <Icon {...p} path={<><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></>} />,
  ArrowRight: (p) => <Icon {...p} path={<><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></>} />,
  ChevronUp: (p) => <Icon {...p} path={<polyline points="18 15 12 9 6 15" />} />,
  ChevronDown: (p) => <Icon {...p} path={<polyline points="6 9 12 15 18 9" />} />
};

/* =========================================================
   2. CONFIG, UTILS, STORAGE ADAPTER
========================================================= */

// Local Storage Keys
const STORE_KEYS = {
  CATS: "sm_v1_categories",
  TXS: "sm_v1_transactions",
  ACCTS: "sm_v1_nw_accounts",
  SNAPS: "sm_v1_nw_snapshots"
};

const DEFAULT_CATEGORIES = [
  { id: "rent", name: "Rent", budget: 2430, color: "#10b981" },
  { id: "food", name: "Food", budget: 500, color: "#f59e0b" },
  { id: "trans", name: "Transportation", budget: 100, color: "#3b82f6" },
  { id: "bills", name: "Bills", budget: 100, color: "#ef4444" },
  { id: "subs", name: "Subscriptions", budget: 70, color: "#8b5cf6" },
  { id: "target", name: "Target", budget: 100, color: "#ec4899" },
  { id: "save", name: "Savings", budget: 600, color: "#059669" },
  { id: "invest", name: "Invest", budget: 50, color: "#047857" },
  { id: "misc", name: "Misc", budget: 500, color: "#64748B" },
];

const ACCOUNT_TYPES = ["Credit Card", "Cash", "Debit"];
const ASSET_LABELS = ["Checking", "Savings", "High Yield Savings", "Brokerage", "Roth IRA", "401k", "Crypto", "Real Estate", "Vehicle", "Cash"];
const LIABILITY_LABELS = ["Credit Card", "Mortgage", "Auto Loan", "Student Loan", "Personal Loan", "Other Debt"];
const COLOR_PALETTE = ["#10b981", "#f59e0b", "#3b82f6", "#ef4444", "#8b5cf6", "#ec4899", "#059669", "#047857", "#6366f1", "#14b8a6", "#f97316", "#64748b"];

const safeNumber = (val) => {
  if (typeof val === 'number') return Number.isFinite(val) ? val : 0;
  if (!val) return 0;
  const clean = String(val).replace(/[^0-9.-]/g, "");
  const num = Number(clean);
  return Number.isFinite(num) ? num : 0;
};

const fmtUSD = (value, { cents = false } = {}) => {
  const val = safeNumber(value);
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: cents ? 2 : 0, maximumFractionDigits: cents ? 2 : 0 }).format(val);
};

const formatCurrency = (a) => fmtUSD(a, { cents: false });
const formatCurrencyPrecise = (a) => fmtUSD(a, { cents: true });

const safeDate = (d) => {
  if (!d) return new Date().toISOString().split("T")[0];
  if (typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return new Date().toISOString().split("T")[0];
  return date.toISOString().split("T")[0];
};

const parseCSVLine = (text) => {
  if (!text) return [];
  const matches = text.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
  if (!matches) return text.split(",");
  return matches.map((v) => v.trim().replace(/^"|"$/g, "").replace(/""/g, '"'));
};

const findCategoryId = (name, categories) => {
  if (!name) return "misc";
  const clean = String(name).trim().toLowerCase();
  const exact = categories.find((c) => c.name.toLowerCase() === clean);
  if (exact) return exact.id;
  const includes = categories.find((c) => clean.includes(c.name.toLowerCase()));
  if (includes) return includes.id;
  const reverse = categories.find((c) => c.name.toLowerCase().includes(clean));
  return reverse ? reverse.id : "misc";
};

const generateID = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;
const chunk = (arr, size) => {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
};

const copyToClipboard = (text, onSuccess) => {
  try {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    if (successful && onSuccess) onSuccess();
  } catch (err) { console.error('Copy failed', err); }
};

const extractJsonArray = (raw) => {
  const s = String(raw || "").replace(/```json/g, "").replace(/```/g, "").trim();
  const start = s.indexOf("[");
  const end = s.lastIndexOf("]");
  if (start !== -1 && end !== -1) return s.slice(start, end + 1);
  if (s.startsWith("{") && s.endsWith("}")) return `[${s}]`;
  return "[]";
};

// STORAGE ADAPTER LAYER
const LocalDB = {
  loadJSON: (key, fallback) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  },
  saveJSON: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) { console.error("Save failed", e); }
  },
  
  // Categories
  getCategories: () => LocalDB.loadJSON(STORE_KEYS.CATS, DEFAULT_CATEGORIES),
  saveCategories: (cats) => LocalDB.saveJSON(STORE_KEYS.CATS, cats),
  
  // Transactions (Sorted Date DESC)
  getTransactions: () => {
    const txs = LocalDB.loadJSON(STORE_KEYS.TXS, []);
    return txs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },
  upsertTransactions: (newTxs) => {
    const current = LocalDB.loadJSON(STORE_KEYS.TXS, []);
    const inputArr = Array.isArray(newTxs) ? newTxs : [newTxs];
    const map = new Map(current.map(t => [t.id, t]));
    inputArr.forEach(t => map.set(t.id, t));
    const merged = Array.from(map.values());
    LocalDB.saveJSON(STORE_KEYS.TXS, merged);
    return merged.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },
  deleteTransactions: (ids) => {
    const idArr = Array.isArray(ids) ? ids : [ids];
    const current = LocalDB.loadJSON(STORE_KEYS.TXS, []);
    const filtered = current.filter(t => !idArr.includes(t.id));
    LocalDB.saveJSON(STORE_KEYS.TXS, filtered);
    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  // Accounts
  getAccounts: () => LocalDB.loadJSON(STORE_KEYS.ACCTS, []),
  upsertAccount: (acc) => {
    const current = LocalDB.loadJSON(STORE_KEYS.ACCTS, []);
    const idx = current.findIndex(a => a.id === acc.id);
    if (idx > -1) current[idx] = acc;
    else current.push(acc);
    LocalDB.saveJSON(STORE_KEYS.ACCTS, current);
    return current;
  },
  deleteAccount: (id) => {
    const current = LocalDB.loadJSON(STORE_KEYS.ACCTS, []);
    const filtered = current.filter(a => a.id !== id);
    LocalDB.saveJSON(STORE_KEYS.ACCTS, filtered);
    return filtered;
  },

  // Snapshots (Sorted Date DESC)
  getSnapshots: () => {
    const snaps = LocalDB.loadJSON(STORE_KEYS.SNAPS, []);
    return snaps.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },
  upsertSnapshots: (newSnaps) => {
    const current = LocalDB.loadJSON(STORE_KEYS.SNAPS, []);
    const inputArr = Array.isArray(newSnaps) ? newSnaps : [newSnaps];
    const map = new Map(current.map(s => [s.id, s]));
    inputArr.forEach(s => map.set(s.id, s));
    const merged = Array.from(map.values());
    LocalDB.saveJSON(STORE_KEYS.SNAPS, merged);
    return merged.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },
  deleteSnapshot: (id) => {
    const current = LocalDB.loadJSON(STORE_KEYS.SNAPS, []);
    const filtered = current.filter(s => s.id !== id);
    LocalDB.saveJSON(STORE_KEYS.SNAPS, filtered);
    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },
  
  // Wipe
  wipeAll: () => {
    localStorage.removeItem(STORE_KEYS.TXS);
    localStorage.removeItem(STORE_KEYS.ACCTS);
    localStorage.removeItem(STORE_KEYS.SNAPS);
    // Optionally reset categories to default or clear them. Keeping categories usually preferred but strictly "wipe" implies default.
    localStorage.removeItem(STORE_KEYS.CATS);
    return {
      c: DEFAULT_CATEGORIES,
      t: [],
      a: [],
      s: []
    }
  }
};

/* =========================================================
   3. UI COMPONENTS (Bottom-Up Definition)
========================================================= */

const ErrorBoundary = class extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 text-center h-screen flex flex-col justify-center items-center bg-slate-50 text-slate-800">
          <Icons.AlertTriangle className="text-red-500 mb-4" size={48} />
          <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
          <p className="text-xs text-red-500 bg-red-50 p-2 rounded mb-4 max-w-xs break-words">{this.state.error?.message || "Unknown Error"}</p>
          <button onClick={() => window.location.reload()} className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold shadow-lg">Reload App</button>
        </div>
      );
    }
    return this.props.children;
  }
};

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [message, onClose]);
  if (!message) return null;
  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[60] animate-in slide-in-from-top-5 pointer-events-none">
      <div className={`flex items-center gap-2 px-4 py-3 rounded-xl shadow-xl text-white text-sm font-bold ${type === "error" ? "bg-red-600" : "bg-slate-900"}`}>
        {type === "error" ? <Icons.AlertCircle size={16} /> : <Icons.Check size={16} />}
        {message}
      </div>
    </div>
  );
};

const DonutChart = ({ data, total }) => {
  const safeTotal = total > 0 ? total : 1;
  return (
    <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
      <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
        {data.map((item, i) => {
          const val = safeNumber(item.value);
          const percent = val / safeTotal;
          const circumference = 2 * Math.PI * 40;
          const strokeDasharray = `${percent * circumference} ${circumference}`;
          const previousVal = data.slice(0, i).reduce((acc, curr) => acc + (safeNumber(curr.value)), 0);
          const strokeDashoffset = -(previousVal / safeTotal) * circumference;
          return (
            <circle key={i} cx="50" cy="50" r="40" fill="transparent" stroke={item.color} strokeWidth="12"
              strokeDasharray={strokeDasharray} strokeDashoffset={strokeDashoffset} className="transition-all duration-500 ease-out" />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Spent</span>
        <span className="text-slate-900 text-3xl font-bold tracking-tight">{formatCurrency(total)}</span>
      </div>
    </div>
  );
};

const SimpleLineChart = ({ data, color = "#10b981" }) => {
  if (!data || data.length < 2) return <div className="h-32 flex items-center justify-center text-slate-400 text-xs font-medium border-2 border-dashed border-slate-100 rounded-xl">Add more data to see trends</div>;
  const height = 100, width = 300, padding = 5;
  const values = data.map(d => safeNumber(d.value));
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const range = (maxVal - minVal) || 1;
  const points = data.map((d, i) => {
    const val = safeNumber(d.value);
    const x = (i / (data.length - 1)) * (width - padding * 2) + padding;
    const y = height - ((val - minVal) / range) * (height - padding * 2) - padding;
    return `${x},${y}`;
  }).join(" ");
  const lastVal = safeNumber(data[data.length - 1].value);
  const lastX = (width - padding * 2) + padding;
  const lastY = height - ((lastVal - minVal) / range) * (height - padding * 2) - padding;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-32 overflow-visible">
      <polyline fill="none" stroke={color} strokeWidth="3" points={points} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={lastX} cy={lastY} r="4" fill={color} />
    </svg>
  );
};

const NavButton = ({ icon: Icon, label, isActive, onClick }) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1 transition-colors ${isActive ? "text-slate-900" : "text-slate-400 hover:text-slate-500"}`}>
    <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
    <span className="text-[10px] font-bold">{label}</span>
  </button>
);

/* =========================================================
   4. MODALS (Defined BEFORE Views)
========================================================= */

const CategoryModal = ({ cat, onClose, onSave, onDelete }) => {
  const [name, setName] = useState(cat?.name || "");
  const [budget, setBudget] = useState(cat?.budget ?? "");
  const [color, setColor] = useState(cat?.color || COLOR_PALETTE[0]);
  const handleSubmit = (e) => { e.preventDefault(); onSave({ id: cat?.id || generateID(), name, budget: safeNumber(budget), color }); onClose(); };
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 relative">
        <h3 className="font-bold text-lg text-slate-800 mb-6">{cat ? "Edit" : "New"} Category</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Category Name" className="w-full border border-slate-200 p-3 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-slate-500" required />
          <input type="number" value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="Budget Amount" className="w-full border border-slate-200 p-3 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-slate-500" />
          <div className="flex flex-wrap gap-3">
            {COLOR_PALETTE.map((c) => (<button key={c} type="button" onClick={() => setColor(c)} style={{ backgroundColor: c }} className={`w-8 h-8 rounded-full shadow-sm transition-transform ${color === c ? "ring-2 ring-offset-2 ring-slate-800 scale-110" : ""}`} />))}
          </div>
          <div className="flex gap-3 pt-4">
            {cat && <button type="button" onClick={() => { onDelete(cat.id); onClose(); }} className="flex-1 py-3 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100">Delete</button>}
            <button type="submit" className="flex-[2] py-3 bg-slate-900 text-white font-bold rounded-xl shadow-lg active:scale-95 transition-transform">Save Category</button>
          </div>
        </form>
        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full text-slate-400 hover:text-slate-600"><Icons.X size={16} /></button>
      </div>
    </div>
  );
};

const ImportModal = ({ onClose, onImport, onShowToast }) => {
  const [txt, setTxt] = useState("");
  const [preview, setPreview] = useState([]);
  const handleParse = () => {
    try {
      const rows = txt.split(/\r?\n/).filter((r) => r.trim() !== "");
      const headers = parseCSVLine(rows[0]).map((h) => h.toLowerCase());
      const dateIdx = headers.findIndex((h) => h.includes("date")), catIdx = headers.findIndex((h) => h.includes("category")), amtIdx = headers.findIndex((h) => h.includes("amount"));
      if (dateIdx === -1 || amtIdx === -1) return onShowToast("CSV must include Date and Amount columns", "error");
      const data = [];
      for (let i = 1; i < rows.length; i++) {
        const cols = parseCSVLine(rows[i]);
        if (cols.length < 2) continue;
        const rawAmt = Number(String(cols[amtIdx] || "").replace(/[^0-9.-]+/g, ""));
        if (!cols[dateIdx] || Number.isNaN(rawAmt)) continue;
        data.push({ date: safeDate(cols[dateIdx]), amount: rawAmt, categoryName: catIdx !== -1 ? cols[catIdx] : "Misc", account: "Import", note: "" });
      }
      setPreview(data);
    } catch { onShowToast("Error parsing CSV", "error"); }
  };
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-lg text-slate-800">Import CSV</h3><button onClick={onClose}><Icons.X className="text-slate-400" /></button></div>
        {preview.length === 0 ? <textarea value={txt} onChange={(e) => setTxt(e.target.value)} className="w-full flex-1 border border-slate-200 p-4 rounded-xl text-xs mb-4 focus:outline-none focus:border-slate-500 resize-none font-mono" placeholder={"Paste your CSV here...\nDate,Category,Amount,Account,Note"} /> : 
        <div className="flex-1 overflow-y-auto border border-slate-200 rounded-xl mb-4 bg-slate-50 p-2"><table className="w-full text-xs text-left"><thead className="text-slate-400 font-bold uppercase border-b border-slate-200"><tr><th className="p-2">Date</th><th className="p-2">Cat</th><th className="p-2">Amt</th></tr></thead><tbody>{preview.map((p, i) => (<tr key={i} className="border-b border-slate-100 last:border-0"><td className="p-2 font-medium">{p.date.slice(5)}</td><td className="p-2 text-slate-500">{p.categoryName}</td><td className="p-2 font-mono">{p.amount}</td></tr>))}</tbody></table></div>}
        <div className="flex gap-3"><button onClick={onClose} className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-gray-200 transition-colors">Cancel</button>{preview.length === 0 ? <button onClick={handleParse} className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl shadow-lg active:scale-95 transition-transform">Preview Data</button> : <button onClick={() => { onImport(preview); onClose(); }} className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-lg active:scale-95 transition-transform">Import {preview.length} Items</button>}</div>
      </div>
    </div>
  );
};

const ProfileModal = ({ isOpen, onClose, transactions = [], categories = [], onWipeData }) => {
  if (!isOpen) return null;
  let spent = 0, invested = 0, saved = 0;
  transactions.forEach((t) => {
    const cat = categories.find((c) => c.id === t.categoryId);
    const text = `${cat?.name || ""} ${t.note || ""}`.toLowerCase(), amt = safeNumber(t.amount);

    if (text.includes("invest") || text.includes("401k") || text.includes("ira") || text.includes("brokerage")) {
      invested += amt;
    } else if (text.includes("save") || text.includes("saving") || text.includes("fund") || text.includes("deposit") || text.includes("stash")) {
      saved += amt;
    } else {
      spent += amt;
    }
  });
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full text-slate-400"><Icons.X size={18} /></button>
        <div className="text-center mb-6"><div className="w-16 h-16 bg-slate-900 text-white rounded-full flex items-center justify-center mx-auto mb-3"><Icons.User size={32} /></div><h3 className="font-bold text-xl">Stats</h3></div>
        <div className="space-y-3">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100"><p className="text-[10px] uppercase font-bold text-slate-400">Net Spent</p><p className="text-2xl font-bold">{formatCurrency(spent)}</p></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl"><p className="text-[10px] uppercase font-bold text-emerald-600 mb-1">Invested</p><p className="text-xl font-bold text-emerald-700">{formatCurrency(invested)}</p></div>
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl"><p className="text-[10px] uppercase font-bold text-blue-600 mb-1">Saved</p><p className="text-xl font-bold text-blue-700">{formatCurrency(saved)}</p></div>
          </div>
          <button onClick={() => { onWipeData(); onClose(); }} className="w-full py-3 mt-2 text-red-500 font-bold text-xs hover:bg-red-50 rounded-xl">Reset Application</button>
        </div>
      </div>
    </div>
  );
};

const AccountModal = ({ account, onClose, onSave, onDelete }) => {
  const [name, setName] = useState(account?.name || ""), [label, setLabel] = useState(account?.label || "");
  const [type, setType] = useState(account?.type || "asset");
  
  useEffect(() => {
    if (account) {
      setName(account.name);
      setLabel(account.label);
      setType(account.type || (ASSET_LABELS.includes(account.label) ? "asset" : "liability"));
    } else {
      setName("");
      setLabel("");
      setType("asset");
    }
  }, [account]);

  const handleSubmit = (e) => { e.preventDefault(); onSave({ id: account?.id, name, label: label || (type === 'asset' ? 'Other Asset' : 'Other Liability'), type, isActive: true, isNew: !account }); onClose(); };
  const chips = type === 'asset' ? ASSET_LABELS : LIABILITY_LABELS;

  return (
    <div className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm rounded-xl shadow-2xl p-6 relative">
        <h3 className="font-bold text-lg mb-4">{account ? "Edit" : "New"} Account</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Account Name (e.g. Chase)" className="w-full border p-3 rounded-lg" required autoFocus />
          <div>
             <div className="flex p-1 bg-slate-100 rounded-lg mb-3">
               <button type="button" onClick={() => { setType('asset'); setLabel(''); }} className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${type === 'asset' ? 'bg-white shadow text-slate-900' : 'text-slate-400'}`}>Asset</button>
               <button type="button" onClick={() => { setType('liability'); setLabel(''); }} className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${type === 'liability' ? 'bg-white shadow text-slate-900' : 'text-slate-400'}`}>Liability</button>
             </div>
             <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Account Type</label>
             <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder={type === 'asset' ? "e.g. Gold, Cash..." : "e.g. Loan..."} className="w-full border p-2 rounded-lg text-sm mb-3" />
             <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">{chips.map(l => (<button key={l} type="button" onClick={() => setLabel(l)} className={`px-2 py-1 text-[10px] border rounded-md transition-colors ${label === l ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}>{l}</button>))}</div>
          </div>
          <div className="flex gap-2 pt-2">
            {account && <button type="button" onClick={() => { if(confirm("Delete this account?")) { onDelete(account.id); onClose(); } }} className="flex-1 py-3 bg-red-50 text-red-600 font-bold rounded-lg hover:bg-red-100">Delete</button>}
            <button type="submit" className="flex-[2] py-3 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800">Save Account</button>
          </div>
        </form>
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><Icons.X size={20} /></button>
      </div>
    </div>
  );
};

const SnapshotModal = ({ accounts, onClose, onSave, onShowToast }) => {
  const [balances, setBalances] = useState({});
  return (
    <div className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl p-6 relative">
        <h3 className="font-bold text-lg mb-4">Log Balances</h3>
        <div className="space-y-3 max-h-[60vh] overflow-y-auto">{accounts.filter(a=>a.isActive).map(acc=>(<div key={acc.id} className="flex justify-between items-center"><span className="text-sm font-bold">{acc.name}</span><input type="number" placeholder="0.00" className="border p-2 rounded-lg text-right w-32" onChange={e=>setBalances({...balances,[acc.id]:e.target.value})} /></div>))}</div>
        <button onClick={() => { const s = Object.entries(balances).filter(([,v])=>v!=="").map(([id,v])=>({ id: generateID(), accountId: id, date: new Date().toISOString().split("T")[0], balance: safeNumber(v), note: "Manual" })); if(s.length){ onSave(s); onClose(); } else onShowToast("Enter value", "error"); }} className="w-full mt-4 py-3 bg-slate-900 text-white font-bold rounded-lg">Save</button>
        <button onClick={onClose} className="absolute top-4 right-4"><Icons.X className="text-slate-400" /></button>
      </div>
    </div>
  );
};

const EditSnapshotModal = ({ snapshot, onClose, onUpdate, onDelete }) => {
    const [date, setDate] = useState(snapshot?.date || "");
    const [balance, setBalance] = useState(snapshot?.balance || "");
    const handleSubmit = (e) => { e.preventDefault(); onUpdate({ ...snapshot, date: safeDate(date), balance: safeNumber(balance) }); onClose(); };
    return (
        <div className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-xs rounded-xl shadow-2xl p-6 relative">
                <h3 className="font-bold text-lg mb-4">Edit Snapshot</h3>
                <p className="text-xs text-slate-400 mb-4">{snapshot?.accountName || "Unknown Account"}</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div><label className="text-xs font-bold text-slate-500 uppercase">Date</label><input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full border p-2 rounded-lg mt-1" required /></div>
                    <div><label className="text-xs font-bold text-slate-500 uppercase">Balance</label><input type="number" step="0.01" value={balance} onChange={(e) => setBalance(e.target.value)} className="w-full border p-2 rounded-lg mt-1" required /></div>
                    <div className="flex gap-2 pt-2">
                        <button type="button" onClick={() => { if(confirm("Delete snapshot?")) { onDelete(snapshot.id); onClose(); } }} className="flex-1 py-2 bg-red-100 text-red-600 font-bold rounded-lg text-xs">Delete</button>
                        <button type="submit" className="flex-[2] py-2 bg-slate-900 text-white font-bold rounded-lg text-xs">Save</button>
                    </div>
                </form>
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><Icons.X size={18} /></button>
            </div>
        </div>
    );
};

const TrendDetailModal = ({ data, accounts, snapshots, onClose }) => {
    const [range, setRange] = useState("1Y"); 
    const [selectedAccount, setSelectedAccount] = useState("ALL");

    // Recalculate trend data
    const filteredData = useMemo(() => {
        // 1. Get Dates
        const dates = [...new Set(snapshots.map((s) => s.date))].sort();
        
        // 2. Filter Dates by Range
        const now = new Date();
        const cutoff = new Date();
        if (range === "3M") cutoff.setMonth(now.getMonth() - 3);
        if (range === "6M") cutoff.setMonth(now.getMonth() - 6);
        if (range === "1Y") cutoff.setFullYear(now.getFullYear() - 1);
        
        const activeDates = range === "ALL" ? dates : dates.filter(d => new Date(d) >= cutoff);
        if (activeDates.length === 0) return [];

        // 3. Build Points
        return activeDates.map((date) => {
            let val = 0;
            accounts.forEach((acc) => {
                if (selectedAccount !== "ALL" && acc.id !== selectedAccount) return;
                const snap = snapshots
                  .filter((s) => s.accountId === acc.id && s.date <= date)
                  .sort((x, y) => new Date(y.date).getTime() - new Date(x.date).getTime())[0];
                const bal = snap ? safeNumber(snap.balance) : 0;
                if (selectedAccount !== "ALL") {
                    val += bal;
                } else {
                    if (acc.type === "asset") val += bal;
                    else val -= bal;
                }
            });
            return { date, value: val };
        });
    }, [snapshots, accounts, range, selectedAccount]);

    const startVal = filteredData.length > 0 ? safeNumber(filteredData[0].value) : 0;
    const endVal = filteredData.length > 0 ? safeNumber(filteredData[filteredData.length - 1].value) : 0;
    const change = endVal - startVal;
    const pctChange = startVal !== 0 ? (change / Math.abs(startVal)) * 100 : 0;
    const values = filteredData.map(d => safeNumber(d.value));
    const high = values.length ? Math.max(...values) : 0;
    const low = values.length ? Math.min(...values) : 0;

    return (
        <div className="fixed inset-0 z-[90] bg-white animate-in slide-in-from-bottom-10 duration-200 flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
                <h2 className="text-xl font-bold text-slate-900">Net Worth Trend</h2>
                <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200">
                    <Icons.X size={20} />
                </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
                <div className="flex flex-col gap-3 mb-6">
                     <select 
                       className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                       value={selectedAccount}
                       onChange={(e) => setSelectedAccount(e.target.value)}
                     >
                        <option value="ALL">All Accounts (Net Worth)</option>
                        {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                     </select>

                    <div className="flex p-1 bg-slate-100 rounded-xl">
                        {["3M", "6M", "1Y", "ALL"].map(r => (
                            <button
                                key={r}
                                onClick={() => setRange(r)}
                                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${range === r ? "bg-white shadow text-slate-900" : "text-slate-400"}`}
                            >
                                {r}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-slate-900 text-white rounded-2xl p-6 mb-6 shadow-lg">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">{range === 'ALL' ? 'Lifetime' : range} Change</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold">{formatCurrency(change)}</span>
                        <span className={`text-sm font-bold ${change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {change >= 0 ? '+' : ''}{pctChange.toFixed(1)}%
                        </span>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-100 p-4 mb-6 shadow-sm">
                    <h3 className="text-xs font-bold text-slate-500 uppercase mb-4">Chart View</h3>
                    <SimpleLineChart data={filteredData} />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <p className="text-[10px] uppercase font-bold text-slate-400">Period High</p>
                        <p className="text-lg font-bold text-slate-800">{formatCurrency(high)}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <p className="text-[10px] uppercase font-bold text-slate-400">Period Low</p>
                        <p className="text-lg font-bold text-slate-800">{formatCurrency(low)}</p>
                    </div>
                </div>

                <h3 className="text-xs font-bold text-slate-400 uppercase mb-3">History</h3>
                <div className="space-y-0 border-t border-slate-100">
                    {[...filteredData].reverse().map((d, i) => (
                        <div key={i} className="flex justify-between items-center py-3 border-b border-slate-50">
                            <span className="text-sm text-slate-600 font-medium">{d.date}</span>
                            <span className="text-sm font-bold text-slate-900">{formatCurrency(d.value)}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const TransactionModal = ({ categories, onClose, onSave, isOpen, initialData, onShowToast }) => {
  const [mode, setMode] = useState("manual");
  const [form, setForm] = useState({ amount: "", date: new Date().toISOString().split("T")[0], categoryId: "", note: "", account: "Credit Card" });
  
  // AI is disabled in local version, but keeping state structure
  const [magic, setMagic] = useState("");
  const [loading, setLoading] = useState(false);
  const [magicPreview, setMagicPreview] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    if (initialData) setForm(initialData);
    else { setForm({ amount: "", date: new Date().toISOString().split("T")[0], categoryId: categories[0]?.id || "", note: "", account: "Credit Card" }); setMagic(""); setMagicPreview(null); setMode("manual"); }
  }, [isOpen, initialData, categories]);

  if (!isOpen) return null;

  const handleSave = (e) => { e.preventDefault(); onSave([{ ...form, id: initialData?.id || Date.now().toString(), amount: Number(form.amount) }]); onClose(); onShowToast("Transaction Saved"); };
  
  // MODIFIED FOR LOCAL: Disable AI
  const handleMagic = async (e) => { 
    e.preventDefault(); 
    onShowToast("AI features disabled in local-only build. Use manual entry or CSV import.", "error");
  };
  
  const confirmMagic = () => { /* No Op in local */ };
  
  // MODIFIED FOR LOCAL: Disable Scan
  const handleScan = (e) => { 
    onShowToast("AI features disabled in local-only build. Use manual entry or CSV import.", "error");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4">
      <div className="bg-white w-full max-w-md rounded-t-3xl md:rounded-3xl border-t border-slate-100 shadow-2xl overflow-hidden flex flex-col h-[80vh] md:h-auto">
        <div className="p-2 border-b border-slate-100 flex gap-2 bg-slate-50">
          <button onClick={() => setMode("manual")} className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${mode === "manual" ? "bg-white shadow-sm text-blue-600 ring-1 ring-blue-100" : "text-slate-400 hover:text-slate-600"}`}>Manual</button>
          <button onClick={() => setMode("magic")} className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1 ${mode === "magic" ? "bg-white shadow-sm text-blue-600 ring-1 ring-blue-100" : "text-slate-400 hover:text-slate-600"}`}><Icons.Sparkles size={14} /> Magic AI</button>
          <label className="flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer hover:bg-slate-200 text-slate-400"><Icons.Camera size={14} /> Scan<input type="file" accept="image/*" onChange={handleScan} className="hidden" /></label>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600"><Icons.X size={20} /></button>
        </div>
        {mode === "manual" ? (
          <form onSubmit={handleSave} className="p-6 space-y-5 flex-1 overflow-y-auto">
            <div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-2xl font-light">$</span><input type="number" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-6 text-4xl font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="0.00" autoFocus required /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase">Date</label><input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full bg-white border border-slate-200 p-3 rounded-xl font-medium text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none" required /></div>
              <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase">Account</label><select value={form.account} onChange={(e) => setForm({ ...form, account: e.target.value })} className="w-full bg-white border border-slate-200 p-3 rounded-xl font-medium text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none">{ACCOUNT_TYPES.map((t) => (<option key={t} value={t}>{t}</option>))}</select></div>
            </div>
            <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase">Category</label><div className="grid grid-cols-3 gap-2">{categories.map((c) => (<button key={c.id} type="button" onClick={() => setForm({ ...form, categoryId: c.id })} className={`p-2.5 text-[11px] font-bold border rounded-xl truncate transition-all ${form.categoryId === c.id ? "bg-blue-50 border-blue-200 text-blue-700 shadow-sm" : "bg-white border-slate-100 text-slate-500 hover:border-slate-300"}`}>{c.name}</button>))}</div></div>
            <input value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="Add a note..." className="w-full bg-white border border-slate-200 p-4 rounded-xl font-medium text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none" />
            <button type="submit" className="w-full py-4 bg-blue-600 text-white font-bold text-lg rounded-2xl shadow-lg shadow-blue-200 active:scale-95 transition-transform">Save Transaction</button>
          </form>
        ) : (
          <div className="p-6 flex flex-col h-full">
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl mb-4"><p className="text-blue-800 text-sm font-medium">✨ Type naturally or paste bulk text.</p></div><textarea value={magic} onChange={(e) => setMagic(e.target.value)} className="w-full h-40 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-lg text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none resize-none mb-4" placeholder="Type here..." autoFocus /><button onClick={handleMagic} disabled={loading} className="w-full mt-auto py-4 bg-blue-600 text-white font-bold text-lg rounded-2xl shadow-lg shadow-blue-200 active:scale-95 transition-transform flex items-center justify-center gap-2">{loading ? "Processing..." : (<><Icons.Sparkles size={18} /> Analyze Text</>)}</button>
          </div>
        )}
      </div>
    </div>
  );
};


/* =========================================================
   5. VIEWS (Defined AFTER Modals, BEFORE MainContent)
========================================================= */

function NetWorthView({ accounts, snapshots, onSaveAccount, onDeleteAccount, onSaveSnapshots, onDeleteSnapshot, onUpdateSnapshot, onLoadDemo, onShowToast }) {
  const [view, setView] = useState("dashboard");
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);
  const [editAccount, setEditAccount] = useState(null);
  const [editingSnapshot, setEditingSnapshot] = useState(null); 
  const [importText, setImportText] = useState("");
  const [showTrendModal, setShowTrendModal] = useState(false); 

  const latestSnapshotByAccount = useMemo(() => {
    const map = {};
    [...snapshots]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .forEach((s) => {
        map[s.accountId] = s;
      });
    return map;
  }, [snapshots]);

  const stats = useMemo(() => {
    let assets = 0,
      liabilities = 0;
    accounts.forEach((acc) => {
      if (!acc.isActive) return;
      const bal = latestSnapshotByAccount[acc.id]?.balance || 0;
      if (acc.type === "asset") assets += bal;
      else liabilities += bal;
    });
    return { assets, liabilities, netWorth: assets - liabilities };
  }, [accounts, latestSnapshotByAccount]);

  const trendData = useMemo(() => {
    const dates = [...new Set(snapshots.map((s) => s.date))].sort();
    if (dates.length < 1) return [];
    
    const points = dates.map((date) => {
      let a = 0,
        l = 0;
      accounts.forEach((acc) => {
        const snap = snapshots
          .filter((s) => s.accountId === acc.id && s.date <= date)
          .sort((x, y) => new Date(y.date).getTime() - new Date(x.date).getTime())[0]; 
        const bal = snap ? snap.balance : 0;
        if (acc.type === "asset") a += bal;
        else l += bal;
      });
      return { date, value: a - l }; 
    });
    return points;
  }, [accounts, snapshots]);

  // Sort snapshots for history view
  const historyList = useMemo(() => {
      return [...snapshots].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [snapshots]);

  const handleJsonImport = () => {
    try {
      const data = JSON.parse(importText);
      if (data.accounts) data.accounts.forEach((acc) => onSaveAccount({ ...acc, isNew: true }));
      if (data.snapshots) onSaveSnapshots(data.snapshots);
      onShowToast("Import Successful!");
      setImportText("");
    } catch {
      onShowToast("Invalid JSON", "error");
    }
  };

  // --- Empty State ---
  if (accounts.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-6">
        <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
           <Icons.Landmark size={48} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Track Your Net Worth</h2>
          <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">
            Add your accounts to track your net worth over time.
          </p>
        </div>
        <div className="space-y-3 w-full max-w-xs">
          <button 
            onClick={() => setShowAccountModal(true)}
            className="w-full py-3.5 bg-slate-900 text-white font-bold rounded-xl shadow-lg active:scale-95 transition-transform"
          >
            Add First Account
          </button>
          <button 
            onClick={onLoadDemo}
            className="w-full py-3.5 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50"
          >
            Load Demo Data
          </button>
        </div>
        {showAccountModal && (
          <AccountModal account={null} onClose={() => setShowAccountModal(false)} onSave={onSaveAccount} onDelete={onDeleteAccount} />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex p-1 bg-slate-100 rounded-xl">
        <button
          onClick={() => setView("dashboard")}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            view === "dashboard" ? "bg-white shadow text-slate-900" : "text-slate-400"
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setView("accounts")}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            view === "accounts" ? "bg-white shadow text-slate-900" : "text-slate-400"
          }`}
        >
          Accounts
        </button>
        <button
          onClick={() => setView("log")}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            view === "log" ? "bg-white shadow text-slate-900" : "text-slate-400"
          }`}
        >
          Data
        </button>
      </div>

      {view === "dashboard" && (
        <>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 text-center">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
              Total Net Worth
            </p>
            <h2 className="text-4xl font-bold text-slate-900 tracking-tighter mb-6">
              {formatCurrency(stats.netWorth)}
            </h2>
            <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
              <div>
                <p className="text-emerald-600 text-xs font-bold uppercase mb-1">Assets</p>
                <p className="text-lg font-bold text-slate-800">{formatCurrency(stats.assets)}</p>
              </div>
              <div>
                <p className="text-red-500 text-xs font-bold uppercase mb-1">Liabilities</p>
                <p className="text-lg font-bold text-slate-800">
                  {formatCurrency(stats.liabilities)}
                </p>
              </div>
            </div>
          </div>

          <div onClick={() => setShowTrendModal(true)} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 cursor-pointer hover:border-slate-300 transition-colors">
            <div className="flex justify-between items-center mb-4">
               <h3 className="text-slate-800 font-bold text-sm uppercase">Trend (30 Days)</h3>
               <Icons.ChevronRight size={16} className="text-slate-400" />
            </div>
            {/* Show last 30 days preview here */}
            <SimpleLineChart data={trendData.slice(-30)} />
          </div>

          <div className="space-y-2">
            <h3 className="text-slate-400 text-xs font-bold uppercase pl-2">Accounts</h3>
            {accounts
              .filter((a) => a.isActive)
              .map((acc) => (
                <div
                  key={acc.id}
                  className="bg-white p-3 rounded-lg border border-slate-100 flex justify-between items-center"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2 h-8 rounded-sm ${
                        acc.type === "asset" ? "bg-emerald-500" : "bg-red-500"
                      }`}
                    />
                    <div>
                      <p className="font-bold text-slate-700 text-sm">{acc.name}</p>
                      <p className="text-[10px] text-slate-400">{acc.label}</p>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-slate-800">
                    {formatCurrency(latestSnapshotByAccount[acc.id]?.balance || 0)}
                  </span>
                </div>
              ))}
          </div>
        </>
      )}

      {view === "accounts" && (
        <div className="space-y-4">
          <button
            onClick={() => {
              setEditAccount(null);
              setShowAccountModal(true);
            }}
            className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl flex items-center justify-center gap-2"
          >
            <Icons.Plus size={16} /> Add Account
          </button>

          <div className="space-y-2">
            {accounts.map((acc) => (
              <div
                key={acc.id}
                onClick={() => {
                  setEditAccount(acc);
                  setShowAccountModal(true);
                }}
                className="bg-white p-4 rounded-xl border border-slate-200 flex justify-between items-center cursor-pointer hover:border-slate-300"
              >
                <div>
                  <p className={`text-sm font-bold ${!acc.isActive ? "text-slate-400 line-through" : ""}`}>
                    {acc.name}
                  </p>
                  <p className="text-[10px] text-slate-400 uppercase">{acc.label}</p>
                </div>
                <Icons.ChevronRight size={16} className="text-slate-300" />
              </div>
            ))}
          </div>
        </div>
      )}

      {view === "log" && (
        <div className="space-y-6">
          <button
            onClick={() => setShowLogModal(true)}
            className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-200"
          >
            <Icons.Plus size={18} /> Log Balance Snapshot
          </button>

           {/* Snapshot History Section */}
           <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
             <div className="p-4 border-b border-slate-100 font-bold text-sm text-slate-700 bg-slate-50">
               History
             </div>
             <div className="max-h-96 overflow-y-auto">
               {historyList.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs">No snapshots recorded yet.</div>
               ) : (
                  historyList.map(snap => {
                     const acc = accounts.find(a => a.id === snap.accountId);
                     return (
                       <div 
                         key={snap.id} 
                         onClick={() => setEditingSnapshot({ ...snap, accountName: acc?.name })}
                         className="flex items-center justify-between p-3 border-b border-slate-50 last:border-0 hover:bg-slate-50 cursor-pointer transition-colors"
                       >
                         <div>
                            <p className="font-bold text-xs text-slate-700">{acc?.name || "Unknown Account"}</p>
                            <p className="text-[10px] text-slate-400">{snap.date}</p>
                         </div>
                         <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-medium text-slate-900">{formatCurrency(snap.balance)}</span>
                            <Icons.ChevronRight size={14} className="text-slate-300" />
                         </div>
                       </div>
                     );
                  })
               )}
             </div>
           </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={onLoadDemo}
                className="py-2 bg-slate-50 border border-slate-200 text-slate-600 text-xs font-bold rounded-lg"
              >
                Load Demo
              </button>
              <button
                className="py-2 bg-slate-50 border border-slate-200 text-slate-600 text-xs font-bold rounded-lg"
                onClick={() => {
                  copyToClipboard(JSON.stringify({ accounts, snapshots }), () => {
                     onShowToast("JSON Copied");
                  });
                }}
              >
                Export JSON
              </button>
            </div>

            <textarea
              className="w-full h-24 bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono mt-4"
              placeholder="Paste JSON to Import"
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
            />

            <button
              onClick={handleJsonImport}
              className="w-full mt-2 py-2 bg-slate-800 text-white text-xs font-bold rounded-lg"
            >
              Import JSON
            </button>
          </div>
        </div>
      )}

      {showAccountModal && (
        <AccountModal
          account={editAccount}
          onClose={() => {
            setShowAccountModal(false);
            setEditAccount(null);
          }}
          onSave={onSaveAccount}
          onDelete={onDeleteAccount}
        />
      )}

      {showLogModal && (
        <SnapshotModal
          accounts={accounts}
          onClose={() => setShowLogModal(false)}
          onSave={onSaveSnapshots}
          onShowToast={onShowToast}
        />
      )}

      {editingSnapshot && (
         <EditSnapshotModal
           snapshot={editingSnapshot}
           onClose={() => setEditingSnapshot(null)}
           onUpdate={onUpdateSnapshot}
           onDelete={onDeleteSnapshot}
         />
      )}
      
      {showTrendModal && (
          <TrendDetailModal 
            data={trendData} 
            accounts={accounts}
            snapshots={snapshots}
            onClose={() => setShowTrendModal(false)} 
          />
      )}
    </div>
  );
}

function DashboardView({ transactions = [], categories = [], viewDate }) {
  const [showMixModal, setShowMixModal] = useState(false);

  // --- Calculations ---
  const currentMonth = viewDate.getMonth();
  const currentYear = viewDate.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const today = new Date();

  // If viewing a past/future month, "current day" logic shifts
  const isCurrentMonth = currentMonth === today.getMonth() && currentYear === today.getFullYear();
  let daysPassed = isCurrentMonth ? today.getDate() : daysInMonth; 
  if (viewDate > today && !isCurrentMonth) daysPassed = 0; 

  const daysLeft = daysInMonth - daysPassed;
  const safeDaysLeft = daysLeft > 0 ? daysLeft : 1; 
  const safeDaysPassed = daysPassed > 0 ? daysPassed : 1;

  const monthlyTxs = transactions.filter((t) => {
    const d = new Date(`${t.date}T12:00:00`);
    return !Number.isNaN(d.getTime()) && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  // FILTER: Show categories if they have spending OR a budget set
  const activeCategories = categories.filter(c => {
    const spend = monthlyTxs
      .filter(t => t.categoryId === c.id)
      .reduce((sum, t) => sum + safeNumber(t.amount), 0);
    return spend > 0 || c.budget > 0;
  });

  const totalSpent = monthlyTxs.reduce((acc, t) => acc + (safeNumber(t.amount)), 0);
  const totalBudget = categories.reduce((acc, c) => acc + (safeNumber(c.budget)), 0);
  const remaining = totalBudget - totalSpent;

  // Rent exclusion logic for "Daily Pace" card
  const rentIds = categories
    .filter((c) => c.name.toLowerCase().includes("rent") || c.name.toLowerCase().includes("mortgage"))
    .map((c) => c.id);

  const discBudget = categories
    .filter((c) => !rentIds.includes(c.id))
    .reduce((acc, c) => acc + safeNumber(c.budget), 0);

  const discSpent = monthlyTxs
    .filter((t) => !rentIds.includes(t.categoryId))
    .reduce((acc, t) => acc + (safeNumber(t.amount)), 0);

  const idealDaily = daysInMonth > 0 ? discBudget / daysInMonth : 0;
  const currentDaily = safeDaysPassed > 0 ? discSpent / safeDaysPassed : 0;

  // --- Hero Card Logic ---
  const getStatusStyles = () => {
    if (remaining < 0) return { bg: "bg-red-100", text: "text-red-700", border: "border-red-200", hero: "text-red-600", label: "Over budget" };
    if (currentDaily > idealDaily * 1.1) return { bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-200", hero: "text-amber-600", label: "At risk" };
    return { bg: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-200", hero: "text-emerald-700", label: "On track" };
  };
  const styles = getStatusStyles();

  const dailyRemaining = remaining > 0 ? remaining / safeDaysLeft : 0;

  const catData = useMemo(() => {
    const s = {};
    monthlyTxs.forEach((t) => (s[t.categoryId] = (s[t.categoryId] || 0) + (safeNumber(t.amount))));
    return categories
      .map((c) => ({ id: c.id, name: c.name, value: s[c.id] || 0, color: c.color, budget: c.budget }))
      // Corrected Filter: value > 0 OR budget > 0
      .filter((c) => c.value > 0 || c.budget > 0)
      .sort((a, b) => b.value - a.value);
  }, [monthlyTxs, categories]);

  return (
    <div className="space-y-6 pb-6">
      
      {/* 1. HERO CARD */}
      <div className={`rounded-3xl p-6 border ${styles.border} bg-white shadow-sm flex flex-col items-center text-center relative overflow-hidden`}>
        <div className={`absolute inset-0 opacity-10 ${styles.bg}`} />
        
        <div className="relative z-10 flex flex-col items-center">
          <div className={`px-3 py-1 mb-4 rounded-full text-[10px] font-bold uppercase tracking-wider ${styles.bg} ${styles.text} ${styles.border} border`}>
            {styles.label}
          </div>

          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Remaining Budget</h2>
          
          <div className={`text-5xl font-black tracking-tighter mb-2 ${styles.hero}`}>
            {formatCurrency(remaining)}
          </div>

          <p className="text-slate-400 text-sm font-medium mb-6">
            of {formatCurrency(totalBudget)} total
          </p>

          {remaining > 0 ? (
             <div className="bg-slate-50/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-slate-100">
               <p className="text-slate-600 text-xs font-medium">
                 You can spend <span className="font-bold text-slate-900">{formatCurrencyPrecise(dailyRemaining)}</span>/day for the rest of the month.
               </p>
             </div>
          ) : (
             <div className="bg-red-50/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-red-100">
               <p className="text-red-600 text-xs font-medium">
                 You have exceeded your monthly budget.
               </p>
             </div>
          )}
        </div>
      </div>

      {/* 2. Secondary Metrics (Daily Pace) */}
      <div className="py-2"> 
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider">Daily Pace</h3>
            <span className="text-[10px] text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-100">No Rent</span>
          </div>

          <div className="flex items-end justify-between mb-2">
            <div>
              <p className="text-[10px] text-slate-400 mb-0.5 uppercase">Actual / Day</p>
              <p className="text-lg font-bold text-slate-700">{formatCurrencyPrecise(currentDaily)}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-400 mb-0.5 uppercase">Target</p>
              <p className="text-lg font-bold text-slate-400">{formatCurrencyPrecise(idealDaily)}</p>
            </div>
          </div>

          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${currentDaily > idealDaily ? "bg-orange-400" : "bg-blue-400"}`} 
              style={{ width: `${Math.min((currentDaily / (idealDaily || 1)) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3. Spending Breakdown List */}
      <div className="space-y-3">
        <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider ml-1">Spending Breakdown</h3>
        
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
          {catData.length === 0 ? (
             <div className="p-6 text-center text-slate-400 text-xs">No spending yet this month.</div>
          ) : (
             catData.map((cat, idx) => {
               const pct = cat.budget > 0 ? (cat.value / cat.budget) * 100 : 0;
               const isOver = pct > 100;

               return (
                 <div key={cat.id} className="group px-4 py-3 border-b border-slate-50 last:border-0 flex items-center justify-between hover:bg-slate-50 transition-colors">
                   {/* Left: Identity */}
                   <div className="flex items-center gap-3">
                     <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                     <span className="text-xs font-bold text-slate-700">{cat.name}</span>
                   </div>

                   {/* Right: Metrics + Bar */}
                   <div className="flex items-center gap-4">
                      <div className="text-right flex items-center gap-2">
                         <span className={`text-xs font-bold ${isOver ? "text-red-600" : "text-slate-800"}`}>
                           {formatCurrency(cat.value)}
                         </span>
                         <span className="text-[10px] text-slate-400">/ {formatCurrency(cat.budget)}</span>
                         
                         {/* Percentage Badge */}
                         <div className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${isOver ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'}`}>
                           {Math.round(pct)}%
                         </div>
                      </div>
                      
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${isOver ? 'bg-red-500' : 'bg-slate-400'}`}
                          style={{ width: `${Math.min(pct, 100)}%` }}
                        />
                      </div>
                   </div>
                 </div>
               );
             })
          )}
          
          {/* Navigation Button */}
          <button 
            onClick={() => setShowMixModal(true)}
            className="w-full py-4 bg-slate-50 hover:bg-slate-100 transition-colors text-xs font-bold text-slate-500 flex items-center justify-center gap-2"
          >
            <Icons.PieChart size={14} /> View Full Analysis <Icons.ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Full Screen Mix Modal */}
      {showMixModal && (
        <div className="fixed inset-0 z-[100] bg-white animate-in slide-in-from-bottom-10 duration-200 flex flex-col">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
             <h2 className="text-xl font-bold text-slate-900">Spending Mix</h2>
             <button onClick={() => setShowMixModal(false)} className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200">
               <Icons.X size={20} />
             </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6">
             <div className="flex flex-col items-center mb-8">
               <DonutChart data={catData} total={totalSpent} />
               
               {/* NEW: Mini Key / Legend */}
               <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-8 max-w-xs mx-auto">
                 {catData.map(cat => {
                   if (cat.value === 0) return null;
                   const pct = totalSpent > 0 ? (cat.value / totalSpent) * 100 : 0;
                   return (
                     <div key={cat.id} className="flex items-center gap-1.5">
                       <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: cat.color }} />
                       <span className="text-xs font-medium text-slate-600">
                         {cat.name} <span className="text-slate-400 text-[10px]">({Math.round(pct)}%)</span>
                       </span>
                     </div>
                   );
                 })}
               </div>
             </div>
             
             <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-4 border-t border-slate-100 pt-6">Category Details</h3>
             <div className="space-y-3">
               {catData.map(cat => {
                 if(cat.value === 0) return null;
                 const pctOfTotal = totalSpent > 0 ? (cat.value / totalSpent) * 100 : 0;
                 const pctOfBudget = cat.budget > 0 ? (cat.value / cat.budget) * 100 : 0;
                 const isOver = pctOfBudget > 100;
                 
                 return (
                   <div key={cat.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-3">
                         <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: cat.color }} />
                         <span className="font-bold text-slate-700">{cat.name}</span>
                      </div>
                      <div className="text-right">
                         <div className="flex items-baseline justify-end gap-1.5 mb-1">
                           <span className="font-bold text-slate-900">{formatCurrency(cat.value)}</span>
                           <span className="text-xs text-slate-400 font-medium">/ {formatCurrency(cat.budget)}</span>
                         </div>
                         <div className="flex items-center justify-end gap-2 text-[10px] font-medium">
                           <span className="text-slate-400">{pctOfTotal.toFixed(1)}% of total</span>
                           <span className={`px-1.5 py-0.5 rounded ${isOver ? 'bg-red-100 text-red-600' : 'bg-slate-200 text-slate-600'}`}>
                             {Math.round(pctOfBudget)}% of budget
                           </span>
                         </div>
                      </div>
                   </div>
                 )
               })}
             </div>
          </div>
        </div>
      )}
    </div>
  );
}

function HistoryView({ transactions = [], categories = [], viewDate, onEdit, onDelete }) {
  const currentMonth = viewDate.getMonth();
  const currentYear = viewDate.getFullYear();
  const [search, setSearch] = useState("");

  const monthlyTx = transactions.filter((t) => {
    const d = new Date(`${t.date}T12:00:00`);
    return !Number.isNaN(d.getTime()) && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });
  const filtered = monthlyTx.filter((t) => {
    if (!search) return true;
    const s = search.toLowerCase();
    const c = categories.find((cat) => cat.id === t.categoryId);
    return t.note?.toLowerCase().includes(s) || c?.name.toLowerCase().includes(s) || String(t.amount).includes(s);
  });
  const grouped = [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date)).reduce((acc, t) => {
    const label = new Date(`${t.date}T12:00:00`).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
    (acc[label] ||= []).push(t);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      <div className="relative">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search transactions..." className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all" />
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Icons.List size={16} /></div>
      </div>
      {Object.entries(grouped).map(([date, items]) => (
        <div key={date}>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 py-2">{date}</h3>
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            {items.map((t, idx) => {
              const cat = categories.find((c) => c.id === t.categoryId);
              return (
                <div key={t.id} onClick={() => onEdit(t)} className={`flex justify-between items-center p-4 hover:bg-slate-50 transition-colors cursor-pointer ${idx !== items.length - 1 ? "border-b border-slate-100" : ""}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center text-white font-bold text-sm rounded-full shadow-sm" style={{ backgroundColor: cat?.color || "#94a3b8" }}>{cat?.name?.[0] || "?"}</div>
                    <div className="overflow-hidden"><p className="font-bold text-slate-900 text-sm truncate">{cat?.name || "Unknown"}</p><p className="text-xs text-slate-500 truncate max-w-[140px]">{t.note || t.account}</p></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-900 text-sm">{formatCurrencyPrecise(t.amount)}</span>
                    <button onClick={(e) => { e.stopPropagation(); onDelete(t.id); }} className="text-slate-300 hover:text-red-500 transition-colors"><Icons.Trash2 size={16} /></button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function SettingsView({ categories = [], onUpdateCategories, onSaveCategory, onDeleteCategory, transactions = [], onImportCSV, viewDate, onClearMonth, onShowToast }) {
  const [editCat, setEditCat] = useState(null);
  const [showCatModal, setShowCatModal] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const currentMonthTransactions = transactions.filter((t) => {
    const d = new Date(`${t.date}T12:00:00`);
    return d.getMonth() === viewDate.getMonth() && d.getFullYear() === viewDate.getFullYear();
  });
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-xs font-bold text-slate-400 uppercase mb-4 tracking-wider">Categories</h3>
        <div className="space-y-2">
          {categories.map((cat, idx) => (
            <div key={cat.id} onClick={() => { setEditCat(cat); setShowCatModal(true); }} className="flex justify-between items-center p-3 bg-slate-50 border border-slate-100 rounded-xl group hover:border-slate-300 transition-colors cursor-pointer">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                <span className="font-semibold text-slate-700 text-sm">{cat.name}</span>
              </div>
              <div className="flex items-center gap-2"><span className="text-slate-400 text-xs font-medium">{formatCurrency(cat.budget)}</span><Icons.ChevronRight size={16} className="text-slate-300" /></div>
            </div>
          ))}
        </div>
        <button onClick={() => { setEditCat(null); setShowCatModal(true); }} className="w-full mt-4 py-3 border border-dashed border-slate-300 text-slate-500 font-bold text-xs rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50 hover:text-slate-700 hover:border-slate-400 transition-all"><Icons.Plus size={16} /> Add Category</button>
      </div>
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-xs font-bold text-slate-400 uppercase mb-4 tracking-wider">Data Management</h3>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => { let csv = "Date,Category,Amount,Account,Note\n"; transactions.forEach((t) => { const catName = categories.find((c) => c.id === t.categoryId)?.name || "Unknown"; csv += `${t.date},"${catName}",${t.amount},${t.account},"${(t.note || "").replace(/"/g, '""')}"\n`; }); copyToClipboard(csv, () => onShowToast("CSV Copied!")); }} className="py-3 bg-white border border-slate-200 text-slate-600 font-bold text-xs rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50"><Icons.Share size={16} /> Export CSV</button>
          <button onClick={() => setShowImport(true)} className="py-3 bg-white border border-slate-200 text-slate-600 font-bold text-xs rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50">Import CSV</button>
        </div>
        <button onClick={() => onClearMonth(currentMonthTransactions.map((t) => t.id))} disabled={currentMonthTransactions.length === 0} className="w-full mt-3 py-3 border border-red-100 text-red-500 font-bold text-xs rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 hover:bg-red-50"><Icons.Trash2 size={16} /> Clear This Month</button>
      </div>
      {showCatModal && <CategoryModal cat={editCat} onClose={() => setShowCatModal(false)} onSave={onSaveCategory} onDelete={onDeleteCategory} />}
      {showImport && <ImportModal onClose={() => setShowImport(false)} onImport={onImportCSV} categories={categories} onShowToast={onShowToast} />}
    </div>
  );
};

/* =========================================================
   6. MAIN CONTENT (Refactored for Local Storage)
========================================================= */

function MainContent() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [viewDate, setViewDate] = useState(new Date());
  const [nwAccounts, setNwAccounts] = useState([]);
  const [nwSnapshots, setNwSnapshots] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [toast, setToast] = useState({ message: "", type: "success", visible: false });

  const showToastMsg = (message, type = "success") => {
    setToast({ message, type, visible: true });
    setTimeout(() => setToast((p) => ({ ...p, visible: false })), 3500);
  };

  // LOAD DATA ON MOUNT
  useEffect(() => {
    setCategories(LocalDB.getCategories());
    setTransactions(LocalDB.getTransactions());
    setNwAccounts(LocalDB.getAccounts());
    setNwSnapshots(LocalDB.getSnapshots());
  }, []);

  const changeMonth = (delta) => {
    const d = new Date(viewDate);
    d.setMonth(d.getMonth() + delta);
    setViewDate(d);
  };

  const handleSaveTransaction = async (txs) => {
    const arr = Array.isArray(txs) ? txs : [txs];
    const cleaned = arr.map((tx) => ({ 
      ...tx, 
      amount: safeNumber(tx.amount), 
      date: safeDate(tx.date),
      timestamp: Date.now() // Local timestamp replacement
    }));
    
    // Update Local Storage
    const updatedTxs = LocalDB.upsertTransactions(cleaned);
    
    // Update State
    setTransactions(updatedTxs);
    setEditingTransaction(null);
  };

  const handleDeleteTransaction = async (id) => {
    const updated = LocalDB.deleteTransactions(id);
    setTransactions(updated);
  };

  const handleUpdateCategories = async (newCats) => {
    LocalDB.saveCategories(newCats);
    setCategories(newCats);
  };

  const handleSaveCategory = async (cat) => {
    const newCats = [...categories];
    const idx = newCats.findIndex((c) => c.id === cat.id);
    if (idx >= 0) newCats[idx] = cat;
    else newCats.push(cat);
    await handleUpdateCategories(newCats);
  };

  const handleDeleteCategory = async (id) => {
    await handleUpdateCategories(categories.filter((c) => c.id !== id));
  };

  const handleImportCSV = async (dataList) => {
    if (!Array.isArray(dataList) || dataList.length === 0) return;
    const cleaned = dataList.map((item) => {
      const catId = findCategoryId(item.categoryName, categories);
      return {
        ...item, 
        id: generateID(),
        amount: safeNumber(item.amount), 
        date: safeDate(item.date), 
        categoryId: catId, 
        timestamp: Date.now(),
      };
    });
    const updated = LocalDB.upsertTransactions(cleaned);
    setTransactions(updated);
    showToastMsg(`Imported ${cleaned.length} transactions!`);
  };

  const handleClearMonth = async (ids) => {
    if (!Array.isArray(ids) || ids.length === 0) return;
    const updated = LocalDB.deleteTransactions(ids);
    setTransactions(updated);
    showToastMsg("Cleared transactions");
  };

  const handleWipeAllData = async () => {
    const fresh = LocalDB.wipeAll();
    setCategories(fresh.c);
    setTransactions(fresh.t);
    setNwAccounts(fresh.a);
    setNwSnapshots(fresh.s);
    showToastMsg("Wiped Data");
  };

  const handleSaveAccount = async (acc) => {
    let type = acc.type;
    if (!type) type = ASSET_LABELS.includes(acc.label) ? "asset" : "liability";
    const { isNew, ...rest } = acc;
    // Fix: Generate ID if missing so upsert works correctly
    const data = { ...rest, id: rest.id || generateID(), type, isActive: acc.isActive !== false };
    
    const updated = LocalDB.upsertAccount(data);
    setNwAccounts(updated);
    showToastMsg("Account Saved");
  };

  const handleDeleteAccount = async (id) => { 
    const updated = LocalDB.deleteAccount(id);
    setNwAccounts(updated);
  };
  
  const handleSaveSnapshots = async (snaps) => {
    if (!Array.isArray(snaps)) return;
    const cleaned = snaps.map((s) => ({
      ...s,
      balance: safeNumber(s.balance),
      date: safeDate(s.date),
      timestamp: Date.now()
    }));
    
    const updated = LocalDB.upsertSnapshots(cleaned);
    setNwSnapshots(updated);
    showToastMsg("Balances Logged");
  };
  
  const handleDeleteSnapshot = async (id) => { 
    const updated = LocalDB.deleteSnapshot(id);
    setNwSnapshots(updated);
  };

  const handleUpdateSnapshot = async (snap) => {
    const cleaned = {
      ...snap,
      balance: safeNumber(snap.balance),
      date: safeDate(snap.date),
      timestamp: Date.now()
    };
    const updated = LocalDB.upsertSnapshots(cleaned);
    setNwSnapshots(updated);
    showToastMsg("Snapshot Updated");
  };

  const handleDemoData = async () => {
    const accounts = [{ id: generateID(), name: "Chase Checking", type: "asset", label: "Checking", isActive: true }, { id: generateID(), name: "Amex Gold", type: "liability", label: "Credit Card", isActive: true }];
    const snaps = [];
    const now = new Date();
    
    for (let i = 2; i >= 0; i--) {
      const d = new Date(now);
      d.setMonth(d.getMonth() - i);
      const dateStr = d.toISOString().split("T")[0];
      accounts.forEach((acc) => {
        let bal = 1000;
        if (acc.type === "asset") bal += Math.random() * 500 + (2-i) * 100;
        else bal = 500 + Math.random() * 50;
        snaps.push({ id: generateID(), accountId: acc.id, date: dateStr, balance: Number(bal.toFixed(2)), note: "Demo" });
      });
    }

    const newAccts = LocalDB.upsertAccount(accounts[0]); 
    LocalDB.upsertAccount(accounts[1]);
    const finalAccts = LocalDB.getAccounts(); // Reload full list
    
    const finalSnaps = LocalDB.upsertSnapshots(snaps);
    
    setNwAccounts(finalAccts);
    setNwSnapshots(finalSnaps);
    showToastMsg("Demo Data Loaded!");
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-[#F4F6F8] font-sans text-slate-900 border-x border-slate-200 shadow-2xl relative overflow-hidden">
      <div className="flex items-center justify-between p-6 pb-4 z-10 bg-[#F4F6F8]/90 backdrop-blur-md sticky top-0">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">{activeTab === "networth" ? "Net Worth" : "Spend Manager"}</h1>
          {activeTab !== "networth" && (
            <div className="flex items-center gap-1 mt-1">
              <button onClick={() => changeMonth(-1)} className="p-1 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"><Icons.ChevronLeft size={16} /></button>
              <span className="text-sm font-semibold text-slate-600 w-24 text-center font-mono uppercase">{viewDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</span>
              <button onClick={() => changeMonth(1)} className="p-1 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"><Icons.ChevronRight size={16} /></button>
            </div>
          )}
        </div>
        <button onClick={() => setShowProfile(true)} className="w-9 h-9 bg-white shadow-sm border border-slate-200 flex items-center justify-center text-slate-500 rounded-full hover:bg-slate-100 hover:text-slate-900 transition-all"><Icons.User size={18} /></button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide pb-32 px-4 pt-2">
        {activeTab === "dashboard" && <DashboardView transactions={transactions} categories={categories} viewDate={viewDate} />}
        {activeTab === "list" && <HistoryView transactions={transactions} categories={categories} viewDate={viewDate} onEdit={(t) => { setEditingTransaction({ ...t, isEdit: true }); setShowAddModal(true); }} onDelete={handleDeleteTransaction} />}
        {activeTab === "settings" && <SettingsView categories={categories} transactions={transactions} onUpdateCategories={handleUpdateCategories} onSaveCategory={handleSaveCategory} onDeleteCategory={handleDeleteCategory} onClearMonth={handleClearMonth} viewDate={viewDate} onImportCSV={handleImportCSV} onShowToast={showToastMsg} />}
        {activeTab === "networth" && <NetWorthView accounts={nwAccounts} snapshots={nwSnapshots} onSaveAccount={handleSaveAccount} onDeleteAccount={handleDeleteAccount} onSaveSnapshots={handleSaveSnapshots} onDeleteSnapshot={handleDeleteSnapshot} onUpdateSnapshot={handleUpdateSnapshot} onLoadDemo={handleDemoData} onShowToast={showToastMsg} />}
      </div>

      {activeTab !== "networth" && (
        <button onClick={() => { setEditingTransaction(null); setShowAddModal(true); }} className="absolute bottom-24 right-6 w-14 h-14 bg-slate-900 hover:bg-slate-800 text-white rounded-full shadow-lg flex items-center justify-center transition-transform active:scale-95 z-20"><Icons.Plus size={28} strokeWidth={2.5} /></button>
      )}

      <div className="fixed bottom-0 w-full max-w-md bg-white border-t border-slate-100 p-2 pb-6 flex justify-around z-30">
        <NavButton icon={Icons.PieChart} label="Overview" isActive={activeTab === "dashboard"} onClick={() => setActiveTab("dashboard")} />
        <NavButton icon={Icons.List} label="Transactions" isActive={activeTab === "list"} onClick={() => setActiveTab("list")} />
        <NavButton icon={Icons.Landmark} label="Net Worth" isActive={activeTab === "networth"} onClick={() => setActiveTab("networth")} />
        <NavButton icon={Icons.Settings} label="Settings" isActive={activeTab === "settings"} onClick={() => setActiveTab("settings")} />
      </div>

      <TransactionModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onSave={handleSaveTransaction} categories={categories} initialData={editingTransaction} onShowToast={showToastMsg} />
      <ProfileModal isOpen={showProfile} onClose={() => setShowProfile(false)} transactions={transactions} categories={categories} onWipeData={handleWipeAllData} />
      {toast.visible && <Toast message={toast.message} type={toast.type} onClose={() => setToast((p) => ({ ...p, visible: false }))} />}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <MainContent />
    </ErrorBoundary>
  );
}