import React, { useState, useEffect, useRef } from 'react';
import { 
  CheckCircle2, 
  Flame, 
  Archive, 
  Plus, 
  Filter, 
  Briefcase, 
  Trophy, 
  Layout,
  X,
  Save,
  MoreHorizontal,
  Edit2,
  Trash2,
  Check,
  AlertCircle,
  RefreshCw,
  Copy,
  RotateCcw,
  ChevronDown,
  ChevronRight,
  ArrowUpRight,
  Tag,
  FileDown,
  Pencil
} from 'lucide-react';

const STRATEGIC_TAGS = [
  'Launch', 'Measurement', 'Optimization', 'Recovery', 
  'Testing', 'Automation', 'Reporting', 'Stakeholder'
];

export default function App() {
  // --- Helpers ---
  const getQuarter = (dateStr) => {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return 'Q1'; // Fallback
    const month = date.getMonth(); // 0-11
    if (month <= 2) return 'Q1';
    if (month <= 5) return 'Q2';
    if (month <= 8) return 'Q3';
    return 'Q4';
  };

  const getCurrentQuarter = () => getQuarter(new Date());

  const getClientColor = (client) => {
    if (!client) return 'bg-gray-100 text-gray-800 border-gray-200';
    let hash = 0;
    for (let i = 0; i < client.length; i++) {
      hash = client.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colors = [
      'bg-blue-100 text-blue-800 border-blue-200',
      'bg-purple-100 text-purple-800 border-purple-200',
      'bg-emerald-100 text-emerald-800 border-emerald-200',
      'bg-amber-100 text-amber-800 border-amber-200',
      'bg-indigo-100 text-indigo-800 border-indigo-200',
      'bg-rose-100 text-rose-800 border-rose-200',
      'bg-cyan-100 text-cyan-800 border-cyan-200',
      'bg-teal-100 text-teal-800 border-teal-200',
      'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200'
    ];
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  // --- State ---
  const [activeTab, setActiveTab] = useState('workstream'); 
  const [clientFilter, setClientFilter] = useState('All Clients');
  const [selectedQuarter, setSelectedQuarter] = useState(getCurrentQuarter());
  const [tagFilter, setTagFilter] = useState('All Tags');
  
  // Client Management
  const [clients, setClients] = useState(['Client A', 'Client B', 'Client C', 'Internal']);
  const [isClientMenuOpen, setIsClientMenuOpen] = useState(false);
  const [newClientInput, setNewClientInput] = useState('');
  const [editingClient, setEditingClient] = useState(null); 
  const [editClientText, setEditClientText] = useState('');
  
  // Delete Confirmation
  const [clientToDelete, setClientToDelete] = useState(null);

  // Import Modal State
  const [showImportModal, setShowImportModal] = useState(false);
  const [importText, setImportText] = useState('');
  const [importStats, setImportStats] = useState(null); 
  const [importConfirmationStep, setImportConfirmationStep] = useState(false); 

  // Reset Application State
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  // Row Expansion
  const [expandedRows, setExpandedRows] = useState(new Set());

  // Export Feedback (String for custom messages)
  const [copyFeedback, setCopyFeedback] = useState('');

  // Data
  const [tasks, setTasks] = useState([]);
  const [pendingTasks, setPendingTasks] = useState([]); 
  const [qbrLog, setQbrLog] = useState([]);

  // Inputs
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskClient, setNewTaskClient] = useState('');
  const [isFireDrill, setIsFireDrill] = useState(false);
  
  // Pending Section State
  const [isPendingCollapsed, setIsPendingCollapsed] = useState(true);

  // Manual QBR Entry
  const [manualQbrText, setManualQbrText] = useState('');
  const [manualQbrClient, setManualQbrClient] = useState('');
  const [manualQbrType, setManualQbrType] = useState('Task');
  const [manualQbrImpact, setManualQbrImpact] = useState('');
  const [manualTags, setManualTags] = useState([]);
  const [showManualQbrForm, setShowManualQbrForm] = useState(false);

  // Modal & Undo State
  const [completingTask, setCompletingTask] = useState(null); 
  const [impactNote, setImpactNote] = useState('');
  const [completionTags, setCompletionTags] = useState([]);
  const [showUndoToast, setShowUndoToast] = useState(false);
  const undoTimerRef = useRef(null);

  // Edit Entry State
  const [editingEntry, setEditingEntry] = useState(null);
  const [editItemText, setEditItemText] = useState('');
  const [editImpactText, setEditImpactText] = useState('');
  const [editEntryType, setEditEntryType] = useState('');
  const [editEntryTags, setEditEntryTags] = useState([]);

  // Edit Active Task State
  const [editingTask, setEditingTask] = useState(null);
  const [editTaskTextState, setEditTaskTextState] = useState('');
  const [editTaskClientState, setEditTaskClientState] = useState('');
  const [editTaskFireDrillState, setEditTaskFireDrillState] = useState(false);

  if (!newTaskClient && clients.length > 0) setNewTaskClient(clients[0]);
  if (!manualQbrClient && clients.length > 0) setManualQbrClient(clients[0]);

  // --- Actions ---

  const handleAddClient = (e) => {
    e.preventDefault();
    if (!newClientInput.trim()) return;
    if (clients.includes(newClientInput.trim())) return; 
    setClients([...clients, newClientInput.trim()]);
    setNewClientInput('');
  };

  const startEditingClient = (clientName) => {
    setEditingClient(clientName);
    setEditClientText(clientName);
  };

  const saveClientEdit = () => {
    if (!editClientText.trim() || !editingClient) return;
    const newName = editClientText.trim();
    const oldName = editingClient;

    if (newName !== oldName) {
        if (clients.includes(newName)) return;
        setClients(clients.map(c => c === oldName ? newName : c));
        setTasks(tasks.map(t => t.client === oldName ? { ...t, client: newName } : t));
        setPendingTasks(pendingTasks.map(t => t.client === oldName ? { ...t, client: newName } : t));
        setQbrLog(qbrLog.map(l => l.client === oldName ? { ...l, client: newName } : l));
        
        if (clientFilter === oldName) setClientFilter(newName);
        if (newTaskClient === oldName) setNewTaskClient(newName);
        if (manualQbrClient === oldName) setManualQbrClient(newName);
    }
    setEditingClient(null);
    setEditClientText('');
  };

  const promptDeleteClient = (client) => {
    setClientToDelete(client);
    setIsClientMenuOpen(false); 
  };

  const executeDeleteClient = () => {
    if (!clientToDelete) return;
    const client = clientToDelete;
    const newClients = clients.filter(c => c !== client);
    setClients(newClients);
    setTasks(tasks.filter(t => t.client !== client));
    setPendingTasks(pendingTasks.filter(t => t.client !== client));
    setQbrLog(qbrLog.filter(l => l.client !== client));
    if (clientFilter === client) setClientFilter('All Clients');
    if (newTaskClient === client && newClients.length > 0) setNewTaskClient(newClients[0]);
    if (manualQbrClient === client && newClients.length > 0) setManualQbrClient(newClients[0]);
    setClientToDelete(null);
  };

  const loadDemoData = () => {
    if (tasks.length > 0 || qbrLog.length > 0 || pendingTasks.length > 0) {
       if (!window.confirm("Replace current data with robust demo data? This will overwrite everything.")) return;
    }

    const demoClients = [
      'Apex Fitness', 'Summit Financial', 'Urban Roots', 'TechFlow SaaS', 
      'Omega Retail', 'BrightPath Edu', 'Internal'
    ];

    const getRelDate = (daysAgo) => {
        const d = new Date();
        d.setDate(d.getDate() - daysAgo);
        return d.toLocaleDateString();
    };

    const demoTasks = [
      { id: 1001, text: 'Audit Q4 search query reports for negative keywords', client: 'Apex Fitness', isFireDrill: false, date: getRelDate(0) },
      { id: 1002, text: 'Set up RSA variations for Spring Sale', client: 'Omega Retail', isFireDrill: false, date: getRelDate(0) },
      { id: 1003, text: 'Debug GTM container firing issues on checkout', client: 'TechFlow SaaS', isFireDrill: true, date: getRelDate(0) },
      { id: 1004, text: 'Refresh audience lists for remarketing', client: 'Summit Financial', isFireDrill: false, date: getRelDate(1) },
      { id: 1005, text: 'Competitor auction insight analysis', client: 'BrightPath Edu', isFireDrill: false, date: getRelDate(1) },
      { id: 1006, text: 'Launch PMax campaign for new product line', client: 'Urban Roots', isFireDrill: false, date: getRelDate(2) },
      { id: 1007, text: 'Investigate sudden CPA spike in Non-Brand', client: 'TechFlow SaaS', isFireDrill: true, date: getRelDate(2) },
      { id: 1008, text: 'Submit weekly timesheets', client: 'Internal', isFireDrill: false, date: getRelDate(3) },
      { id: 1009, text: 'Check Merchant Center disapproval errors', client: 'Omega Retail', isFireDrill: true, date: getRelDate(3) },
      { id: 1010, text: 'Update sitelink extensions for Q2 promos', client: 'Apex Fitness', isFireDrill: false, date: getRelDate(4) },
      { id: 1011, text: 'Review auto-applied recommendations', client: 'Summit Financial', isFireDrill: false, date: getRelDate(4) },
      { id: 1012, text: 'Draft ad copy for new "Eco-Friendly" angle', client: 'Urban Roots', isFireDrill: false, date: getRelDate(5) },
    ];

    const demoPending = [
      { id: 2001, text: 'Weekly budget pacing check', client: 'Summit Financial', isFireDrill: false, date: getRelDate(1) },
      { id: 2002, text: 'Keyword expansion research', client: 'BrightPath Edu', isFireDrill: false, date: getRelDate(2) },
      { id: 2003, text: 'Bid adjustment for competitor conquesting', client: 'TechFlow SaaS', isFireDrill: false, date: getRelDate(3) },
      { id: 2004, text: 'Google Ads support call regarding account suspension warning', client: 'Omega Retail', isFireDrill: true, date: getRelDate(4) },
      { id: 2005, text: 'Setup Google Analytics 4 audience triggers', client: 'Apex Fitness', isFireDrill: false, date: getRelDate(5) },
      { id: 2006, text: 'Team sync regarding new attribution tool', client: 'Internal', isFireDrill: false, date: getRelDate(6) },
      { id: 2007, text: 'Verify UTM tracking parameters for newsletter', client: 'Urban Roots', isFireDrill: false, date: getRelDate(7) },
    ];

    const demoLog = [
      { id: 3001, date: getRelDate(2), client: 'TechFlow SaaS', item: 'Fixed broken conversion tag', type: 'Fire Drill', impact: 'Restored conversion tracking accuracy. Identified 48 hours of missing data and annotated GA4.', tags: ['Measurement', 'Recovery'] },
      { id: 3002, date: getRelDate(5), client: 'Omega Retail', item: 'Launched Holiday Flash Sale', type: 'Win', impact: 'Generated $15k revenue in 48h with a ROAS of 6.5. Best performing weekend of the quarter.', tags: ['Launch', 'Reporting'] },
      { id: 3003, date: getRelDate(10), client: 'Apex Fitness', item: 'Broad Match Test', type: 'Task', impact: 'Scaled Non-Brand spend by 20% while maintaining CPA targets. Identified 5 new high-intent search themes.', tags: ['Testing', 'Optimization'] },
      { id: 3004, date: getRelDate(12), client: 'BrightPath Edu', item: 'Lead Quality Audit', type: 'Win', impact: 'Reduced junk leads by 40% by excluding "free" and "job" related queries. Saved ~$1.2k/mo.', tags: ['Optimization'] },
      { id: 3005, date: getRelDate(15), client: 'Summit Financial', item: 'C-Suite Reporting Dashboard', type: 'Win', impact: 'Automated weekly performance reporting via Looker Studio, saving 2 hours of manual work per week.', tags: ['Automation', 'Reporting', 'Stakeholder'] },
      { id: 3006, date: getRelDate(18), client: 'Urban Roots', item: 'Site Outage Response', type: 'Fire Drill', impact: 'Paused all social and search spend within 10 mins of downtime alert. Saved client approx $500 in wasted click spend.', tags: ['Recovery'] },
      { id: 3007, date: getRelDate(22), client: 'TechFlow SaaS', item: 'Competitor Conquesting Launch', type: 'Task', impact: 'Achieved 15% impression share on top 3 competitor terms within first week.', tags: ['Launch'] },
      { id: 3008, date: getRelDate(25), client: 'Internal', item: 'Q2 Planning Deck', type: 'Task', impact: 'Delivered strategy roadmap for all 6 active clients. Approved by VP.', tags: ['Reporting'] },
      { id: 3009, date: getRelDate(30), client: 'Omega Retail', item: 'Feed Optimization', type: 'Win', impact: 'Fixed 150+ disapproved SKUs in Merchant Center. Restored visibility for top-selling category.', tags: ['Optimization', 'Recovery'] },
      { id: 3010, date: getRelDate(92), client: 'TechFlow SaaS', item: 'Q3 Alpha Beta Launch', type: 'Win', impact: 'Early access feature adoption led to 10% lower CPCs vs benchmark.', tags: ['Launch', 'Testing'] },
      { id: 3011, date: getRelDate(95), client: 'Apex Fitness', item: 'Video Ad Creative Refresh', type: 'Task', impact: 'Improved View rate by 5pp. Creative fatigue mitigated.', tags: ['Optimization'] },
      { id: 3012, date: getRelDate(98), client: 'Summit Financial', item: 'Budget Pacing Error Fix', type: 'Fire Drill', impact: 'Caught overspend risk early. Adjusted daily caps to land exactly on monthly budget.', tags: ['Recovery'] },
      { id: 3013, date: getRelDate(100), client: 'Urban Roots', item: 'Seasonal Promo Launch', type: 'Win', impact: 'Sold out of seasonal inventory in 3 weeks. ROAS 4.0.', tags: ['Launch'] },
      { id: 3014, date: getRelDate(105), client: 'BrightPath Edu', item: 'Landing Page CRO Test', type: 'Win', impact: 'A/B test variant B showed 12% lift in conversion rate.', tags: ['Testing', 'Optimization'] },
      { id: 3015, date: getRelDate(110), client: 'Omega Retail', item: 'GTM Migration', type: 'Task', impact: 'Seamlessly migrated all hardcoded pixels to GTM without data loss.', tags: ['Measurement', 'Automation'] },
      { id: 3016, date: getRelDate(115), client: 'Internal', item: 'Quarterly Team Training', type: 'Task', impact: 'Led workshop on new PMax scripts.', tags: ['Stakeholder'] },
    ];

    setClients(demoClients);
    setTasks(demoTasks);
    setPendingTasks(demoPending);
    setQbrLog(demoLog);
    setClientFilter('All Clients');
    setTagFilter('All Tags');
    setIsClientMenuOpen(false);
  };

  const promptReset = () => {
    setResetConfirmOpen(true);
    setIsClientMenuOpen(false);
  };

  const executeReset = () => {
      setClients(['Client A', 'Client B', 'Client C', 'Internal']);
      setTasks([]);
      setPendingTasks([]);
      setQbrLog([]);
      setClientFilter('All Clients');
      setTagFilter('All Tags');
      setSelectedQuarter(getCurrentQuarter());
      setExpandedRows(new Set());
      setResetConfirmOpen(false);
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 3000);
  };

  const validateAndParseCSV = () => {
    if (!importText.trim()) return;

    const lines = importText.trim().split('\n');
    const parseLine = (line) => line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(c => c.trim().replace(/^"|"$/g, ''));

    if (lines.length < 2) {
        setImportStats({ valid: 0, rejected: 0, total: 0, data: [], error: 'Not enough data rows.' });
        return;
    }

    const headers = parseLine(lines[0]).map(h => h.toLowerCase());
    const colMap = {
        date: headers.findIndex(h => h.includes('date')),
        client: headers.findIndex(h => h.includes('client')),
        item: headers.findIndex(h => h.includes('item')),
        type: headers.findIndex(h => h.includes('type')),
        impact: headers.findIndex(h => h.includes('impact')),
        tags: headers.findIndex(h => h.includes('tags')),
    };

    if (colMap.date === -1 || colMap.client === -1 || colMap.item === -1 || colMap.type === -1 || colMap.impact === -1) {
        setImportStats({ valid: 0, rejected: 0, total: 0, data: [], error: 'Missing required columns: Date, Client, Item, Type, or Impact Note.' });
        return;
    }

    const parsedData = [];
    let validCount = 0;
    let rejectedCount = 0;

    for (let i = 1; i < lines.length; i++) {
        const cols = parseLine(lines[i]);
        if (cols.length < 4 || !cols[colMap.date] || isNaN(new Date(cols[colMap.date]).getTime())) {
            rejectedCount++;
            continue;
        }

        let rowTags = [];
        if (colMap.tags > -1 && cols[colMap.tags]) {
            rowTags = cols[colMap.tags].split(',')
                .map(t => t.trim())
                .map(t => STRATEGIC_TAGS.find(st => st.toLowerCase() === t.toLowerCase())) 
                .filter(Boolean); 
        }

        const typeRaw = cols[colMap.type].toLowerCase();
        const typeNormalized = typeRaw.includes('fire') ? 'Fire Drill' : 'Task'; 

        parsedData.push({
            id: Date.now() + i,
            date: cols[colMap.date],
            client: cols[colMap.client],
            item: cols[colMap.item],
            type: typeNormalized,
            impact: cols[colMap.impact],
            tags: rowTags
        });
        validCount++;
    }

    setImportStats({ valid: validCount, rejected: rejectedCount, total: lines.length - 1, data: parsedData, error: null });
  };

  const executeImport = () => {
    if (!importStats || importStats.valid === 0) return;
    
    // Add new clients if any
    const newClients = new Set(clients);
    importStats.data.forEach(row => newClients.add(row.client));
    setClients(Array.from(newClients));
    
    // Append to existing log instead of replacing
    setQbrLog([...qbrLog, ...importStats.data]);
    
    // Reset Everything
    setShowImportModal(false);
    setImportText('');
    setImportStats(null);
    setImportConfirmationStep(false);
    setIsClientMenuOpen(false);
    setActiveTab('vault'); 
  };

  const addTask = (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    const task = {
      id: Date.now(),
      text: newTaskText,
      client: newTaskClient || clients[0],
      isFireDrill: isFireDrill,
      date: new Date().toLocaleDateString()
    };
    setTasks([task, ...tasks]);
    setNewTaskText('');
    setIsFireDrill(false);
  };

  const initiateComplete = (task) => {
    setCompletingTask({ ...task, source: 'active' });
    setImpactNote('');
    setCompletionTags([]);
    
    // Start Undo Timer
    setShowUndoToast(true);
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    undoTimerRef.current = setTimeout(() => {
      setShowUndoToast(false);
    }, 10000);
  };

  const initiatePendingPromote = (task) => {
    setCompletingTask({ ...task, source: 'pending' });
    setImpactNote('');
    setCompletionTags([]);
    setShowUndoToast(false); 
  };

  const discardPendingTask = (task) => {
    if (window.confirm("Permanently discard this task?")) {
      setPendingTasks(pendingTasks.filter(t => t.id !== task.id));
    }
  };

  const handleUndo = () => {
    setCompletingTask(null); // Close Modal
    setShowUndoToast(false); // Hide Toast
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
  };

  const clearUndoState = () => {
    setShowUndoToast(false);
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
  };

  const toggleCompletionTag = (tag) => {
    if (completionTags.includes(tag)) {
      setCompletionTags(completionTags.filter(t => t !== tag));
    } else {
      if (completionTags.length < 2) {
        setCompletionTags([...completionTags, tag]);
      }
    }
  };

  const toggleManualTag = (tag) => {
    if (manualTags.includes(tag)) {
      setManualTags(manualTags.filter(t => t !== tag));
    } else {
      if (manualTags.length < 2) {
        setManualTags([...manualTags, tag]);
      }
    }
  };

  const toggleEditEntryTag = (tag) => {
    if (editEntryTags.includes(tag)) {
      setEditEntryTags(editEntryTags.filter(t => t !== tag));
    } else {
      if (editEntryTags.length < 2) {
        setEditEntryTags([...editEntryTags, tag]);
      }
    }
  };

  const confirmQbrSave = () => {
    if (!completingTask) return;
    const logEntry = {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      client: completingTask.client,
      item: completingTask.text,
      type: completingTask.isFireDrill ? 'Fire Drill' : 'Task',
      impact: impactNote || 'Task Completed',
      tags: completionTags
    };
    
    setQbrLog([logEntry, ...qbrLog]);
    
    // Remove from source
    if (completingTask.source === 'active') {
      setTasks(tasks.filter(t => t.id !== completingTask.id));
    } else if (completingTask.source === 'pending') {
      setPendingTasks(pendingTasks.filter(t => t.id !== completingTask.id));
    }

    setCompletingTask(null);
    clearUndoState(); 
  };

  const skipQbrSave = () => {
    if (!completingTask) return;
    
    if (completingTask.source === 'active') {
      const taskToMove = { 
        id: completingTask.id,
        text: completingTask.text,
        client: completingTask.client,
        isFireDrill: completingTask.isFireDrill,
        date: completingTask.date
      };
      setPendingTasks([taskToMove, ...pendingTasks]);
      setTasks(tasks.filter(t => t.id !== completingTask.id));
    } 
    
    setCompletingTask(null);
    clearUndoState(); 
  };

  const addManualQbrEntry = (e) => {
    e.preventDefault();
    if (!manualQbrText.trim()) return;
    const logEntry = {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      client: manualQbrClient || clients[0],
      item: manualQbrText,
      type: manualQbrType,
      impact: manualQbrImpact || 'Manual Entry',
      tags: manualTags
    };
    setQbrLog([logEntry, ...qbrLog]);
    setManualQbrText('');
    setManualQbrImpact('');
    setManualTags([]);
    setShowManualQbrForm(false);
  };

  const startEditingEntry = (entry) => {
    setEditingEntry(entry);
    setEditItemText(entry.item);
    setEditImpactText(entry.impact || '');
    setEditEntryType(entry.type);
    setEditEntryTags(entry.tags || []);
  };

  const saveEditedEntry = () => {
    if (!editingEntry) return;
    const updatedEntry = {
      ...editingEntry,
      item: editItemText,
      impact: editImpactText,
      type: editEntryType,
      tags: editEntryTags
    };
    setQbrLog(qbrLog.map(entry => entry.id === editingEntry.id ? updatedEntry : entry));
    setEditingEntry(null);
  };

  // --- Task Editing Logic ---
  const startEditingTask = (task) => {
    setEditingTask(task);
    setEditTaskTextState(task.text);
    setEditTaskClientState(task.client);
    setEditTaskFireDrillState(task.isFireDrill);
  };

  const saveEditedTask = () => {
    if (!editingTask) return;
    const updatedTask = {
      ...editingTask,
      text: editTaskTextState,
      client: editTaskClientState,
      isFireDrill: editTaskFireDrillState
    };
    setTasks(tasks.map(t => t.id === editingTask.id ? updatedTask : t));
    setEditingTask(null);
  };

  const toggleRowExpansion = (id) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const handleExportQbr = () => {
    if (filteredLog.length === 0) return;

    // Helper to escape CSV fields
    const escapeCsv = (str) => {
        if (!str) return '';
        const stringified = String(str);
        if (stringified.includes(',') || stringified.includes('"') || stringified.includes('\n')) {
            return `"${stringified.replace(/"/g, '""')}"`;
        }
        return stringified;
    };

    // Headers
    const headers = ['Date', 'Client', 'Item', 'Type', 'Impact Note', 'Tags'];
    let csvContent = headers.join(',') + '\n';

    // Sort by Date Descending
    const sortedLog = [...filteredLog].sort((a, b) => new Date(b.date) - new Date(a.date));

    const rows = sortedLog.map(item => {
        const tags = item.tags ? item.tags.join(', ') : '';
        return [
            escapeCsv(item.date),
            escapeCsv(item.client),
            escapeCsv(item.item),
            escapeCsv(item.type),
            escapeCsv(item.impact),
            escapeCsv(tags)
        ].join(',');
    });

    csvContent += rows.join('\n');

    const textArea = document.createElement("textarea");
    textArea.value = csvContent;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    textArea.style.top = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      if (document.execCommand('copy')) {
        setCopyFeedback(`Copied CSV (${sortedLog.length} items)`);
        setTimeout(() => setCopyFeedback(''), 2000);
      }
    } catch (err) {
      console.error('Copy failed', err);
    }
    document.body.removeChild(textArea);
  };

  // --- Filtering ---
  const filteredTasks = (clientFilter === 'All Clients' 
    ? tasks 
    : tasks.filter(t => t.client === clientFilter))
    .filter(t => t.id !== completingTask?.id); 

  const filteredPendingTasks = clientFilter === 'All Clients'
    ? pendingTasks
    : pendingTasks.filter(t => t.client === clientFilter);

  const filteredLog = qbrLog.filter(item => {
    const matchClient = clientFilter === 'All Clients' || item.client === clientFilter;
    const matchQuarter = selectedQuarter === 'All' || getQuarter(item.date) === selectedQuarter;
    const matchTag = tagFilter === 'All Tags' || (item.tags && item.tags.includes(tagFilter));
    return matchClient && matchQuarter && matchTag;
  });

  // --- Metrics ---
  const totalEntries = filteredLog.length;
  const fireDrillsCount = filteredLog.filter(i => i.type === 'Fire Drill').length;
  const winsCount = totalEntries - fireDrillsCount;
  const uniqueClients = new Set(filteredLog.map(i => i.client)).size;
  const fireDrillPercentage = totalEntries > 0 ? Math.round((fireDrillsCount / totalEntries) * 100) : 0;

  // --- QoQ Logic ---
  const getPreviousQuarter = (q) => {
    if (q === 'Q1') return 'Q4';
    if (q === 'Q2') return 'Q1';
    if (q === 'Q3') return 'Q2';
    if (q === 'Q4') return 'Q3';
    return null;
  };

  const prevQuarter = selectedQuarter !== 'All' ? getPreviousQuarter(selectedQuarter) : null;
  const prevQuarterCount = prevQuarter ? qbrLog.filter(item => {
    const matchClient = clientFilter === 'All Clients' || item.client === clientFilter;
    const matchTag = tagFilter === 'All Tags' || (item.tags && item.tags.includes(tagFilter));
    const matchQuarter = getQuarter(item.date) === prevQuarter;
    return matchClient && matchTag && matchQuarter;
  }).length : 0;
  
  const qoqDelta = totalEntries - prevQuarterCount;
  const qoqSign = qoqDelta > 0 ? '+' : '';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col">
      
      {/* --- HEADER --- */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="relative">
            <button 
              onClick={() => setIsClientMenuOpen(!isClientMenuOpen)}
              className="flex items-center space-x-3 group outline-none"
            >
              <div className="bg-indigo-600 p-2 rounded-lg group-hover:bg-indigo-700 transition-colors">
                <Layout className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center">
                  Manager's Log
                  <MoreHorizontal className="w-4 h-4 ml-2 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h1>
              </div>
            </button>
            {isClientMenuOpen && (
              <>
                <div className="fixed inset-0 z-30 cursor-default" onClick={() => setIsClientMenuOpen(false)}/>
                <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-slate-200 z-40 overflow-hidden ring-1 ring-black/5">
                  <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Manage Clients</h3>
                  </div>
                  <ul className="max-h-60 overflow-y-auto">
                    {clients.map(client => (
                      <li key={client} className="px-4 py-2 flex items-center justify-between hover:bg-slate-50 border-b border-slate-50 last:border-0 group">
                        {editingClient === client ? (
                          <div className="flex items-center w-full space-x-2">
                            <input 
                              type="text" value={editClientText} onChange={(e) => setEditClientText(e.target.value)}
                              className="flex-1 h-7 text-sm px-2 border border-indigo-300 rounded focus:ring-1 focus:ring-indigo-500 outline-none" autoFocus
                            />
                            <button onClick={saveClientEdit} className="text-emerald-600 hover:text-emerald-700"><Check className="w-4 h-4" /></button>
                            <button onClick={() => setEditingClient(null)} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
                          </div>
                        ) : (
                          <>
                            <span className="text-sm text-slate-700 font-medium truncate">{client}</span>
                            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => startEditingClient(client)} className="p-1 text-slate-400 hover:text-indigo-600 rounded"><Edit2 className="w-3.5 h-3.5" /></button>
                              <button onClick={() => promptDeleteClient(client)} className="p-1 text-slate-400 hover:text-red-600 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                            </div>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                  <form onSubmit={handleAddClient} className="p-3 bg-slate-50 border-t border-slate-200">
                    <div className="flex items-center space-x-2">
                      <input type="text" placeholder="Add new client..." value={newClientInput} onChange={(e) => setNewClientInput(e.target.value)}
                        className="flex-1 h-8 text-sm border-slate-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      <button type="submit" className="h-8 w-8 flex items-center justify-center bg-indigo-600 text-white rounded hover:bg-indigo-700"><Plus className="w-4 h-4" /></button>
                    </div>
                  </form>
                  <div className="p-3 bg-slate-50 border-t border-slate-200 space-y-2">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Utilities</h3>
                    <button onClick={loadDemoData} className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-white border border-slate-200 text-slate-600 rounded text-xs font-semibold hover:bg-slate-100 hover:text-slate-800 transition-colors shadow-sm">
                      <RefreshCw className="w-3.5 h-3.5" /><span>Load Robust Demo</span>
                    </button>
                    <button onClick={() => { setShowImportModal(true); setIsClientMenuOpen(false); }} className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-white border border-slate-200 text-slate-600 rounded text-xs font-semibold hover:bg-slate-100 hover:text-slate-800 transition-colors shadow-sm">
                      <FileDown className="w-3.5 h-3.5" /><span>Import CSV</span>
                    </button>
                    <button onClick={promptReset} className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-white border border-red-200 text-red-600 rounded text-xs font-semibold hover:bg-red-50 hover:text-red-700 transition-colors shadow-sm">
                      <Trash2 className="w-3.5 h-3.5" /><span>Reset Application</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-slate-100 rounded-md px-3 py-1.5 border border-slate-200">
              <Filter className="w-4 h-4 text-slate-500" />
              <select value={clientFilter} onChange={(e) => setClientFilter(e.target.value)} className="bg-transparent border-none text-sm font-medium text-slate-700 focus:ring-0 cursor-pointer outline-none w-32">
                <option>All Clients</option>
                {clients.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>
        <div className="max-w-5xl mx-auto px-4 flex space-x-1 mt-1">
          <button onClick={() => setActiveTab('workstream')} className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'workstream' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>
            <div className="flex items-center space-x-2"><Briefcase className="w-4 h-4" /><span>Daily Workstream</span><span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full text-xs">{tasks.length}</span></div>
          </button>
          <button onClick={() => setActiveTab('vault')} className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'vault' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>
            <div className="flex items-center space-x-2"><Trophy className="w-4 h-4" /><span>QBR Vault</span><span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full text-xs">{qbrLog.length}</span></div>
          </button>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-6">
        {activeTab === 'workstream' && (
          <div className="space-y-6">
            <form onSubmit={addTask} className="bg-white p-3 rounded-lg shadow-sm border border-slate-200 flex flex-col md:flex-row gap-3 items-center">
              <select value={newTaskClient} onChange={(e) => setNewTaskClient(e.target.value)} className={`w-full md:w-40 text-sm border border-slate-200 rounded-md focus:ring-indigo-500 focus:border-indigo-500 font-medium transition-colors ${getClientColor(newTaskClient)}`}>
                {clients.map(c => <option key={c}>{c}</option>)}
              </select>
              <div className="flex-1 w-full relative">
                <input type="text" placeholder="What needs to be done?" value={newTaskText} onChange={(e) => setNewTaskText(e.target.value)} className="w-full text-sm border-slate-200 rounded-md focus:ring-indigo-500 focus:border-indigo-500 pl-3 pr-24" />
                <button type="button" onClick={() => setIsFireDrill(!isFireDrill)} className={`absolute right-1.5 top-1.5 bottom-1.5 px-2.5 rounded text-xs font-bold flex items-center space-x-1 transition-all ${isFireDrill ? 'bg-red-500 text-white shadow-sm' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}>
                  <Flame className="w-3 h-3" /><span>Fire Drill</span>
                </button>
              </div>
              <button type="submit" className="w-full md:w-auto px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-md hover:bg-slate-800 transition-colors shadow-sm">Add Task</button>
            </form>

            {/* Active Tasks List */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Tasks</h3>
                <span className="text-xs text-slate-400">{filteredTasks.length} items</span>
              </div>
              
              {filteredTasks.length === 0 ? (
                <div className="p-8 text-center text-slate-400">
                  <Archive className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No active tasks found for this view.</p>
                </div>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {filteredTasks.map(task => (
                    <li key={task.id} className="group hover:bg-slate-50 transition-colors">
                      <div className="flex items-center p-3">
                        <button onClick={() => initiateComplete(task)} className="flex-shrink-0 text-slate-300 hover:text-emerald-500 transition-colors mr-4" title="Complete Task">
                          <CheckCircle2 className="w-6 h-6" />
                        </button>
                        <div className="flex-1 min-w-0 flex items-center relative pr-8">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center mb-1">
                              {task.isFireDrill && (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 mr-2 border border-red-200"><Flame className="w-3 h-3 mr-0.5" /> FIRE DRILL</span>
                              )}
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border ${getClientColor(task.client)}`}>{task.client}</span>
                              <span className="text-[10px] text-slate-400 ml-auto">{task.date}</span>
                            </div>
                            <p className="text-sm text-slate-700 font-medium truncate">{task.text}</p>
                          </div>
                          
                          {/* Edit Active Task Button */}
                          <button 
                            onClick={() => startEditingTask(task)}
                            className="absolute right-0 text-slate-300 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                            title="Edit Task"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Completed (Pending Evaluation) Section */}
            {filteredPendingTasks.length > 0 && (
              <div className="bg-slate-50 rounded-lg border border-slate-200 overflow-hidden">
                <button 
                  onClick={() => setIsPendingCollapsed(!isPendingCollapsed)}
                  className="w-full px-4 py-3 flex justify-between items-center hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                     {isPendingCollapsed ? <ChevronRight className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                     <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Completed (Pending Evaluation)</h3>
                     <span className="text-xs font-semibold bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded-full">{filteredPendingTasks.length}</span>
                  </div>
                </button>
                
                {!isPendingCollapsed && (
                  <ul className="divide-y divide-slate-100 border-t border-slate-200">
                    {filteredPendingTasks.map(task => (
                       <li key={task.id} className="group flex items-center p-3 hover:bg-white transition-colors">
                          <div className="flex-1 min-w-0 opacity-75 group-hover:opacity-100 transition-opacity">
                             <div className="flex items-center mb-1">
                                {task.isFireDrill && (
                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 mr-2 border border-red-200 scale-90 origin-left"><Flame className="w-3 h-3 mr-0.5" /> FIRE DRILL</span>
                                )}
                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border scale-90 origin-left ${getClientColor(task.client)}`}>{task.client}</span>
                             </div>
                             <p className="text-sm text-slate-600 truncate">{task.text}</p>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <button 
                              onClick={() => initiatePendingPromote(task)}
                              className="text-xs font-medium text-indigo-600 hover:text-indigo-800 px-2 py-1 rounded hover:bg-indigo-50 border border-transparent hover:border-indigo-100 flex items-center"
                            >
                              <ArrowUpRight className="w-3 h-3 mr-1" />
                              Add to QBR
                            </button>
                            <button 
                              onClick={() => discardPendingTask(task)}
                              className="text-xs font-medium text-slate-400 hover:text-red-600 px-2 py-1 rounded hover:bg-red-50 transition-colors"
                            >
                              Discard
                            </button>
                          </div>
                       </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'vault' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
              {!showManualQbrForm ? (
                <div onClick={() => setShowManualQbrForm(true)} className="p-3 bg-slate-50 hover:bg-slate-100 cursor-pointer text-center text-sm text-indigo-600 font-medium flex items-center justify-center space-x-2 transition-colors">
                  <Plus className="w-4 h-4" /><span>Log Manual Win / Event</span>
                </div>
              ) : (
                <div className="p-4 bg-slate-50 border-b border-indigo-100">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-bold text-slate-700">Manual Entry</h3>
                    <button onClick={() => setShowManualQbrForm(false)} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
                  </div>
                  <form onSubmit={addManualQbrEntry} className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="col-span-1">
                      <label className="block text-xs font-medium text-slate-500 mb-1">Client</label>
                      <select value={manualQbrClient} onChange={(e) => setManualQbrClient(e.target.value)} className={`w-full text-sm border-slate-300 rounded-md font-medium ${getClientColor(manualQbrClient)}`}>
                        {clients.map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="col-span-1">
                       <label className="block text-xs font-medium text-slate-500 mb-1">Type</label>
                       <select value={manualQbrType} onChange={(e) => setManualQbrType(e.target.value)} className="w-full text-sm border-slate-300 rounded-md">
                        <option>Task</option><option>Fire Drill</option><option>Win</option><option>Strategic Update</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                       <label className="block text-xs font-medium text-slate-500 mb-1">Item Description</label>
                       <input type="text" value={manualQbrText} onChange={(e) => setManualQbrText(e.target.value)} className="w-full text-sm border-slate-300 rounded-md" placeholder="What happened?" />
                    </div>
                    
                    {/* Manual Tags */}
                    <div className="col-span-4">
                      <label className="block text-xs font-medium text-slate-500 mb-1">Strategic Tags <span className="text-slate-300 font-normal">(Max 2)</span></label>
                      <div className="flex flex-wrap gap-1.5">
                        {STRATEGIC_TAGS.map(tag => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => toggleManualTag(tag)}
                            className={`text-[10px] px-2 py-1 rounded border transition-colors ${
                              manualTags.includes(tag) 
                                ? 'bg-indigo-100 text-indigo-700 border-indigo-200 font-bold' 
                                : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="col-span-3">
                       <label className="block text-xs font-medium text-slate-500 mb-1">Impact / Result</label>
                       <input type="text" value={manualQbrImpact} onChange={(e) => setManualQbrImpact(e.target.value)} className="w-full text-sm border-slate-300 rounded-md" placeholder="e.g. Saved $500, Improved CPA by 10%..." />
                    </div>
                    <div className="col-span-1 flex items-end">
                      <button type="submit" className="w-full py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700">Add to Log</button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* QBR Table & Controls (Unified Card) */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col">
               <div className="px-4 py-3 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Quarterly Event Log</h3>
                  <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-md">
                     {['All', 'Q1', 'Q2', 'Q3', 'Q4'].map(q => (
                        <button key={q} onClick={() => setSelectedQuarter(q)} className={`px-2 py-0.5 text-[10px] font-bold rounded transition-colors ${selectedQuarter === q ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>{q}</button>
                     ))}
                  </div>
                  {/* Tag Filter */}
                  <div className="flex items-center space-x-2 bg-slate-100 rounded-md px-2 py-1 border border-slate-200">
                    <Filter className="w-3 h-3 text-slate-400" />
                    <select 
                      value={tagFilter} 
                      onChange={(e) => setTagFilter(e.target.value)}
                      className="bg-transparent border-none text-[10px] font-medium text-slate-600 focus:ring-0 cursor-pointer outline-none w-24 p-0"
                    >
                      <option>All Tags</option>
                      {STRATEGIC_TAGS.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <button onClick={handleExportQbr} disabled={filteredLog.length === 0} className={`text-xs font-medium flex items-center transition-colors ${copyFeedback ? 'text-emerald-600' : filteredLog.length === 0 ? 'text-slate-300 cursor-not-allowed' : 'text-indigo-600 hover:text-indigo-800'}`}>
                  {copyFeedback ? <><Check className="w-3 h-3 mr-1" />{copyFeedback}</> : <><Copy className="w-3 h-3 mr-1" />Copy CSV</>}
                </button>
              </div>

              {/* Summary Metrics Row */}
              <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex flex-wrap items-center gap-y-2">
                <div className="flex items-center space-x-4 mr-auto">
                  <div className="flex items-center space-x-2"><span className="text-xs font-medium text-slate-500">Total Wins:</span><span className="text-sm font-bold text-emerald-700">{winsCount}</span></div>
                  <div className="flex items-center space-x-2"><span className="text-xs font-medium text-slate-500">Fire Drills:</span><span className="text-sm font-bold text-red-600">{fireDrillsCount}</span></div>
                  <div className="flex items-center space-x-2"><span className="text-xs font-medium text-slate-500">Clients:</span><span className="text-sm font-bold text-slate-700">{uniqueClients}</span></div>
                </div>
                
                {totalEntries > 0 && (
                   <div className="flex items-center space-x-2 w-full md:w-auto md:pl-6 md:border-l md:border-slate-200 md:ml-0">
                     <span className="text-xs font-medium text-slate-500">Fire Drills:</span>
                     <span className="text-sm font-bold text-slate-700">{fireDrillPercentage}%</span>
                     <span className="text-xs text-slate-400">of logged wins this quarter</span>
                     {selectedQuarter !== 'All' && (totalEntries > 0 || prevQuarterCount > 0) && (
                       <div className="flex items-center space-x-2 pl-4 border-l border-slate-200 ml-4">
                         <span className="text-xs font-medium text-slate-500">QoQ:</span>
                         <span className={`text-sm font-bold ${qoqDelta >= 0 ? 'text-emerald-700' : 'text-slate-700'}`}>{qoqSign}{qoqDelta}</span>
                         <span className="text-xs text-slate-400">vs last qtr</span>
                       </div>
                     )}
                   </div>
                )}
              </div>

              {/* Table Section (Overflow handled here) */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                    <tr>
                      <th className="px-4 py-3 w-24">Date</th>
                      <th className="px-4 py-3 w-32">Client</th>
                      <th className="px-4 py-3">Event / Task</th>
                      <th className="px-4 py-3 w-32">Type</th>
                      <th className="px-4 py-3 w-40">Tags</th>
                      <th className="px-4 py-3 w-1/3">Impact Note</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredLog.length === 0 ? (
                       <tr><td colSpan="6" className="px-4 py-8 text-center text-slate-400">No events logged for {selectedQuarter === 'All' ? 'this period' : selectedQuarter}.</td></tr>
                    ) : (
                      filteredLog.map(item => (
                        <tr key={item.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 text-slate-500 font-mono text-xs align-top">{item.date}</td>
                          <td className="px-4 py-3 align-top"><span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-medium border ${getClientColor(item.client)}`}>{item.client}</span></td>
                          
                          {/* Event / Task with Edit */}
                          <td className="px-4 py-3 font-medium text-slate-800 align-top group/cell relative pr-8">
                            {item.item}
                            <button 
                              onClick={(e) => { e.stopPropagation(); startEditingEntry(item); }}
                              className="absolute right-0 top-3 text-slate-300 hover:text-indigo-600 opacity-0 group-hover/cell:opacity-100 transition-opacity p-1"
                              title="Edit Entry"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                          </td>

                          <td className="px-4 py-3 align-top">{item.type === 'Fire Drill' ? <span className="inline-flex items-center text-red-600 text-xs font-bold"><Flame className="w-3 h-3 mr-1" /> Fire Drill</span> : <span className="text-slate-500 text-xs">{item.type}</span>}</td>
                          <td className="px-4 py-3 align-top">
                            <div className="flex flex-wrap gap-1">
                              {item.tags && item.tags.length > 0 ? item.tags.map(tag => (
                                <span key={tag} className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                                  {tag}
                                </span>
                              )) : <span className="text-xs text-slate-300">-</span>}
                            </div>
                          </td>
                          <td onClick={() => toggleRowExpansion(item.id)} className="px-4 py-3 border-l border-slate-100 bg-slate-50/50 cursor-pointer hover:bg-slate-100 transition-colors align-top relative group" title="Click to expand/collapse">
                            <div className={`text-sm text-slate-900 italic leading-relaxed ${expandedRows.has(item.id) ? '' : 'line-clamp-2'}`}>{item.impact}</div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* --- COMPLETION MODAL --- */}
      {completingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100 relative">
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4">
              <div className="flex items-center justify-between text-white">
                <h2 className="text-lg font-bold flex items-center"><Trophy className="w-5 h-5 mr-2" />Nice Work!</h2>
                <button onClick={() => { setCompletingTask(null); clearUndoState(); }} className="text-indigo-200 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <p className="text-indigo-100 text-sm mt-1 truncate opacity-90">You finished: "{completingTask.text}"</p>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-bold text-slate-700 mb-2">Is this worth saving to your QBR Log?</label>
                <p className="text-xs text-slate-500 mb-4">If yes, add a quick note on the impact. If no, it will just be archived.</p>
                <textarea className="w-full text-sm border-slate-200 rounded-md focus:ring-indigo-500 focus:border-indigo-500 min-h-[80px]" placeholder="e.g. 'Saved the client $2k', 'Improved QS to 8/10'..." value={impactNote} onChange={(e) => setImpactNote(e.target.value)} autoFocus></textarea>
              </div>
              
              {/* Tags Selector in Modal */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-slate-500 mb-2">Strategic Tags <span className="text-slate-300 font-normal">(Max 2)</span></label>
                <div className="flex flex-wrap gap-1.5">
                  {STRATEGIC_TAGS.map(tag => (
                    <button
                      key={tag}
                      onClick={() => toggleCompletionTag(tag)}
                      className={`text-[10px] px-2 py-1 rounded border transition-colors ${
                        completionTags.includes(tag) 
                          ? 'bg-indigo-100 text-indigo-700 border-indigo-200 font-bold' 
                          : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3">
                <button onClick={confirmQbrSave} className="flex-1 bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm flex items-center justify-center"><Save className="w-4 h-4 mr-2" />Yes, Save to Vault</button>
                <button onClick={skipQbrSave} className="flex-1 bg-white border border-slate-200 text-slate-600 py-2.5 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors">No, Just Archive</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- EDIT ENTRY MODAL --- */}
      {editingEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100 relative flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800">Edit QBR Entry</h3>
              <button onClick={() => setEditingEntry(null)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              {/* Item Text */}
              <div className="mb-4">
                <label className="block text-xs font-bold text-slate-500 mb-1">Item Description</label>
                <input 
                  type="text" 
                  value={editItemText}
                  onChange={(e) => setEditItemText(e.target.value)}
                  className="w-full text-sm border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Type Selection */}
              <div className="mb-4">
                <label className="block text-xs font-bold text-slate-500 mb-1">Type</label>
                <select 
                  value={editEntryType}
                  onChange={(e) => setEditEntryType(e.target.value)}
                  className="w-full text-sm border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option>Task</option>
                  <option>Fire Drill</option>
                  <option>Win</option>
                  <option>Strategic Update</option>
                </select>
              </div>

              {/* Impact Note */}
              <div className="mb-4">
                <label className="block text-xs font-bold text-slate-500 mb-1">Impact / Result</label>
                <textarea 
                  className="w-full text-sm border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 min-h-[80px]"
                  value={editImpactText}
                  onChange={(e) => setEditImpactText(e.target.value)}
                ></textarea>
              </div>

              {/* Tags */}
              <div className="mb-2">
                <label className="block text-xs font-bold text-slate-500 mb-2">Strategic Tags <span className="text-slate-300 font-normal">(Max 2)</span></label>
                <div className="flex flex-wrap gap-1.5">
                  {STRATEGIC_TAGS.map(tag => (
                    <button
                      key={tag}
                      onClick={() => toggleEditEntryTag(tag)}
                      className={`text-[10px] px-2 py-1 rounded border transition-colors ${
                        editEntryTags.includes(tag) 
                          ? 'bg-indigo-100 text-indigo-700 border-indigo-200 font-bold' 
                          : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3">
              <button 
                onClick={() => setEditingEntry(null)}
                className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-50"
              >
                Cancel
              </button>
              <button 
                onClick={saveEditedEntry}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- EDIT ACTIVE TASK MODAL --- */}
      {editingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100 relative">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800">Edit Task</h3>
              <button onClick={() => setEditingTask(null)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Task Text */}
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Task Description</label>
                <input 
                  type="text" 
                  value={editTaskTextState}
                  onChange={(e) => setEditTaskTextState(e.target.value)}
                  className="w-full text-sm border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Client Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Client</label>
                <select 
                  value={editTaskClientState}
                  onChange={(e) => setEditTaskClientState(e.target.value)}
                  className={`w-full text-sm border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 font-medium ${getClientColor(editTaskClientState)}`}
                >
                  {clients.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>

              {/* Fire Drill Toggle */}
              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-md border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => setEditTaskFireDrillState(!editTaskFireDrillState)}>
                <div className="flex items-center space-x-2">
                  <Flame className={`w-4 h-4 ${editTaskFireDrillState ? 'text-red-500' : 'text-slate-400'}`} />
                  <span className={`text-sm font-medium ${editTaskFireDrillState ? 'text-red-700' : 'text-slate-600'}`}>Fire Drill</span>
                </div>
                <div className={`w-10 h-5 rounded-full relative transition-colors ${editTaskFireDrillState ? 'bg-red-500' : 'bg-slate-300'}`}>
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-transform ${editTaskFireDrillState ? 'left-6' : 'left-1'}`}></div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3">
              <button 
                onClick={() => setEditingTask(null)}
                className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-50"
              >
                Cancel
              </button>
              <button 
                onClick={saveEditedTask}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- IMPORT MODAL --- */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-900 flex items-center">
                <FileDown className="w-5 h-5 mr-2 text-indigo-600" /> Import QBR Data
              </h3>
              <button onClick={() => { setShowImportModal(false); setImportStats(null); }} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto">
              {!importStats ? (
                <div className="space-y-4">
                  <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-700 border border-blue-100">
                    <p className="font-bold mb-1">Requirements:</p>
                    <ul className="list-disc pl-4 space-y-1 text-xs">
                      <li>Headers (case-insensitive): Date, Client, Item, Type, Impact Note, Tags (optional)</li>
                      <li>Date Format: YYYY-MM-DD</li>
                      <li>Paste CSV data directly below.</li>
                    </ul>
                  </div>
                  <textarea 
                    className="w-full h-64 p-3 text-xs font-mono border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder={`Date,Client,Item,Type,Impact Note,Tags\n2023-10-01,Client A,Example Item,Win,Great result,Optimization`}
                    value={importText}
                    onChange={(e) => setImportText(e.target.value)}
                  />
                </div>
              ) : (
                <div className="space-y-6">
                  {importStats.error ? (
                    <div className="bg-red-50 p-4 rounded-md border border-red-200 text-center">
                      <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                      <h4 className="text-red-800 font-bold mb-1">Validation Failed</h4>
                      <p className="text-red-600 text-sm">{importStats.error}</p>
                      <button onClick={() => setImportStats(null)} className="mt-4 text-indigo-600 hover:text-indigo-800 text-sm font-medium underline">Try Again</button>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-slate-50 p-3 rounded border border-slate-200">
                          <div className="text-2xl font-bold text-slate-700">{importStats.total}</div>
                          <div className="text-xs text-slate-500 uppercase font-bold">Total Rows</div>
                        </div>
                        <div className="bg-emerald-50 p-3 rounded border border-emerald-200">
                          <div className="text-2xl font-bold text-emerald-700">{importStats.valid}</div>
                          <div className="text-xs text-emerald-600 uppercase font-bold">Valid</div>
                        </div>
                        <div className="bg-red-50 p-3 rounded border border-red-200">
                          <div className="text-2xl font-bold text-red-700">{importStats.rejected}</div>
                          <div className="text-xs text-red-600 uppercase font-bold">Rejected</div>
                        </div>
                      </div>
                      
                      {importStats.rejected > 0 && (
                        <p className="text-xs text-red-500 mb-6 bg-red-50 p-2 rounded border border-red-100 inline-block">
                          Note: {importStats.rejected} rows will be skipped due to missing required fields or invalid dates.
                        </p>
                      )}

                      <p className="text-sm text-slate-600 mb-2">
                        Ready to import? This will <strong>add to your existing data</strong>.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end space-x-3">
              {!importStats ? (
                <button 
                  onClick={validateAndParseCSV}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-bold hover:bg-indigo-700 transition-colors"
                >
                  Validate Data
                </button>
              ) : (
                !importStats.error && (
                  !importConfirmationStep ? (
                    <>
                      <button 
                        onClick={() => setImportStats(null)}
                        className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-50"
                      >
                        Back
                      </button>
                      <button 
                        onClick={() => setImportConfirmationStep(true)}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-md text-sm font-bold hover:bg-emerald-700 transition-colors shadow-sm"
                      >
                        Import & Append
                      </button>
                    </>
                  ) : (
                    <div className="flex items-center space-x-3">
                        <span className="text-xs text-slate-500 font-bold">Add {importStats.valid} items?</span>
                        <button 
                          onClick={() => setImportConfirmationStep(false)}
                          className="px-3 py-2 bg-slate-100 text-slate-600 rounded-md text-sm font-medium hover:bg-slate-200"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={executeImport}
                          className="px-4 py-2 bg-emerald-600 text-white rounded-md text-sm font-bold hover:bg-emerald-700 transition-colors shadow-sm"
                        >
                          Yes, Import
                        </button>
                    </div>
                  )
                )
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- RESET CONFIRMATION MODAL --- */}
      {resetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="p-6 text-center">
              <div className="bg-red-100 text-red-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"><AlertCircle className="w-6 h-6" /></div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Reset Application?</h3>
              <p className="text-sm text-slate-500 mb-6">This will permanently clear all tasks, clients, and QBR history. This action cannot be undone.</p>
              <div className="flex space-x-3">
                <button onClick={() => setResetConfirmOpen(false)} className="flex-1 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-md font-medium hover:bg-slate-50 transition-colors">Cancel</button>
                <button onClick={executeReset} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 transition-colors shadow-sm">Reset Everything</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- SUCCESS TOAST (Generic) --- */}
      {(showUndoToast || resetSuccess) && (
        <div className="fixed bottom-6 right-6 z-60 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-slate-900 text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-4 border border-slate-700">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span className="text-sm font-medium">{resetSuccess ? "Application reset." : "Task completed"}</span>
            </div>
            {showUndoToast && !resetSuccess && (
              <button 
                onClick={handleUndo}
                className="flex items-center space-x-1 px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded text-xs font-bold uppercase tracking-wider transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Undo</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* --- DELETE CLIENT CONFIRMATION MODAL --- */}
      {clientToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="p-6 text-center">
              <div className="bg-red-100 text-red-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"><AlertCircle className="w-6 h-6" /></div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Delete Client?</h3>
              <p className="text-sm text-slate-500 mb-6">Are you sure you want to delete <span className="font-bold text-slate-700">"{clientToDelete}"</span>? This will permanently remove all associated tasks and QBR history.</p>
              <div className="flex space-x-3">
                <button onClick={() => setClientToDelete(null)} className="flex-1 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-md font-medium hover:bg-slate-50 transition-colors">Cancel</button>
                <button onClick={executeDeleteClient} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 transition-colors shadow-sm">Delete Everything</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}