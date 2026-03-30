const STORAGE_KEY = "novaide-workspace-v2";
const WORKSPACE_VERSION = 4;
const DEFAULT_BACKEND_PORT = 8765;
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAUbyQlVd8ElTbez7TAddtqc_fPXIQARPE",
  authDomain: "pixelchat-82d61.firebaseapp.com",
  projectId: "pixelchat-82d61",
  storageBucket: "pixelchat-82d61.firebasestorage.app",
  messagingSenderId: "1058396003619",
  appId: "1:1058396003619:web:4e9d2c796e7e9b748e0096",
  measurementId: "G-G7C8K3QM7D",
};

const elements = {
  fileSearch: document.querySelector("[data-file-search]"),
  tree: document.querySelector("[data-tree]"),
  treeCaption: document.querySelector("[data-tree-caption]"),
  totalFiles: document.querySelector("[data-total-files]"),
  dirtyFiles: document.querySelector("[data-dirty-files]"),
  importedFiles: document.querySelector("[data-imported-files]"),
  tabs: document.querySelector("[data-editor-tabs]"),
  selectionLabel: document.querySelector("[data-selection-label]"),
  currentFolder: document.querySelector("[data-current-folder]"),
  currentFile: document.querySelector("[data-current-file]"),
  cursorPosition: document.querySelector("[data-cursor-position]"),
  currentLanguage: document.querySelector("[data-current-language]"),
  charCount: document.querySelector("[data-char-count]"),
  lineNumbers: document.querySelector("[data-line-numbers]"),
  highlightCode: document.querySelector("[data-highlight-code]"),
  editorInput: document.querySelector("[data-editor-input]"),
  previewFrame: document.querySelector("[data-preview-frame]"),
  previewTitle: document.querySelector("[data-preview-title]"),
  previewStatus: document.querySelector("[data-preview-status]"),
  chatStatus: document.querySelector("[data-chat-status]"),
  chatCount: document.querySelector("[data-chat-count]"),
  chatList: document.querySelector("[data-chat-list]"),
  chatInput: document.querySelector("[data-chat-input]"),
  openrouterApiKey: document.querySelector("[data-openrouter-api-key]"),
  openrouterModel: document.querySelector("[data-openrouter-model]"),
  chatSend: document.querySelector("[data-chat-send]"),
  chatClear: document.querySelector("[data-chat-clear]"),
  terminalOutput: document.querySelector("[data-terminal-output]"),
  terminalForm: document.querySelector("[data-terminal-form]"),
  terminalInput: document.querySelector("[data-terminal-input]"),
  terminalCwd: document.querySelector("[data-terminal-cwd]"),
  sessionStatus: document.querySelector("[data-session-status]"),
  debugFile: document.querySelector("[data-debug-file]"),
  debugLanguage: document.querySelector("[data-debug-language]"),
  debugFiles: document.querySelector("[data-debug-files]"),
  debugDirty: document.querySelector("[data-debug-dirty]"),
  debugEvents: document.querySelector("[data-debug-events]"),
  debugLog: document.querySelector("[data-debug-log]"),
  fileInput: document.querySelector("[data-file-input]"),
  modal: document.querySelector("[data-modal]"),
  createForm: document.querySelector("[data-create-form]"),
  newFilePath: document.querySelector("[data-new-file-path]"),
  newFileTemplate: document.querySelector("[data-new-file-template]"),
  saveWorkspace: document.querySelector("[data-save-workspace]"),
  downloadFile: document.querySelector("[data-download-file]"),
  createFolder: document.querySelector("[data-create-folder]"),
  duplicateItem: document.querySelector("[data-duplicate-item]"),
  moveItem: document.querySelector("[data-move-item]"),
  deleteItem: document.querySelector("[data-delete-item]"),
  panelMenuToggle: document.querySelector("[data-panel-menu-toggle]"),
  panelMenu: document.querySelector("[data-panel-menu]"),
  panelMenuItems: document.querySelectorAll("[data-menu-toggle]"),
  signOut: document.querySelector("[data-sign-out]"),
  profileName: document.querySelector("[data-profile-name]"),
  profileEmail: document.querySelector("[data-profile-email]"),
  profileAvatar: document.querySelector("[data-profile-avatar]"),
};

const defaultFiles = [
  {
    path: "index.html",
    content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Project</title>
  <link rel="stylesheet" href="styles/app.css">
</head>
<body>
  <main id="app"></main>
  <script src="scripts/app.js"><\/script>
</body>
</html>`,
  },
  {
    path: "styles/app.css",
    content: `body {
  margin: 0;
  min-height: 100vh;
  font-family: "Segoe UI", sans-serif;
}`,
  },
  {
    path: "scripts/app.js",
    content: `const app = document.querySelector("#app");

if (app) {
  app.textContent = "";
}`,
  },
  {
    path: "scripts/reset-project.js",
    content: `console.log("Resetting NovaIDE workspace...");
await api.resetProject();
console.log("Workspace cleared to a blank HTML, CSS, and JavaScript starter.");`,
  },
];

function createFileRecord({ path, content, source = "starter", tracked = true }) {
  const normalizedPath = normalizePath(path);

  return {
    path: normalizedPath,
    content,
    originalContent: content,
    source,
    tracked,
    language: inferLanguage(normalizedPath),
    updatedAt: Date.now(),
  };
}

function createStarterWorkspace() {
  const files = defaultFiles.map((file) => createFileRecord(file));

  return {
    files,
    folders: collectFoldersFromFiles(files),
  };
}

function ensureWorkspaceUpgradeFiles(files, storedVersion = 0) {
  const nextFiles = [...files];

  if (!nextFiles.some((file) => file.path === "scripts/reset-project.js")) {
    nextFiles.push(createFileRecord({
      path: "scripts/reset-project.js",
      content: defaultFiles.find((file) => file.path === "scripts/reset-project.js")?.content || "",
    }));
  }

  if (storedVersion < 4) {
    const resetFile = nextFiles.find((file) => file.path === "scripts/reset-project.js");
    const defaultResetFile = defaultFiles.find((file) => file.path === "scripts/reset-project.js");

    if (resetFile && defaultResetFile) {
      resetFile.content = defaultResetFile.content;
      resetFile.originalContent = defaultResetFile.content;
      resetFile.updatedAt = Date.now();
    }
  }

  return nextFiles;
}

function createDefaultState() {
  const { files, folders } = createStarterWorkspace();

  return {
    workspaceVersion: WORKSPACE_VERSION,
    files,
    folders,
    openTabs: files.map((file) => file.path),
    activeFilePath: files[0].path,
    selectedItem: { type: "file", path: files[0].path },
    search: "",
    activity: "files",
    explorerVisible: true,
    gitVisible: true,
    terminalVisible: true,
    terminalHistory: [
      { type: "output", tone: "accent", text: "Browser workspace shell ready. Run `help` to see commands." },
    ],
    terminalCwd: "",
    chatMessages: [
      {
        role: "assistant",
        content: "I can answer questions about your workspace once you add your OpenRouter API key.",
      },
    ],
    openrouterApiKey: "",
    openrouterModel: "openai/gpt-5.2",
    collapsedFolders: [],
    logs: [
      createLogEntry("Workspace booted with a blank HTML, CSS, and JavaScript starter.", "info"),
    ],
  };
}

function loadState() {
  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return createDefaultState();
  }

  try {
    const parsed = JSON.parse(raw);
    const storedVersion = typeof parsed.workspaceVersion === "number" ? parsed.workspaceVersion : 0;
    const parsedFiles = Array.isArray(parsed.files) && parsed.files.length
      ? parsed.files.map((file) => {
          const record = createFileRecord({
            path: file.path,
            content: typeof file.content === "string" ? file.content : "",
            source: file.source || "starter",
            tracked: typeof file.tracked === "boolean" ? file.tracked : true,
          });
          record.originalContent = typeof file.originalContent === "string" ? file.originalContent : record.content;
          record.updatedAt = file.updatedAt || Date.now();
          return record;
        })
      : createDefaultState().files;
    const files = ensureWorkspaceUpgradeFiles(parsedFiles, storedVersion);

    const activeFilePath = files.some((file) => file.path === parsed.activeFilePath)
      ? parsed.activeFilePath
      : files[0].path;

    const openTabs = Array.isArray(parsed.openTabs) && parsed.openTabs.length
      ? parsed.openTabs.filter((path) => files.some((file) => file.path === path))
      : [activeFilePath];

    return {
      workspaceVersion: WORKSPACE_VERSION,
      files,
      folders: [...new Set([
        ...(Array.isArray(parsed.folders) ? parsed.folders : []),
        ...collectFoldersFromFiles(files),
      ])].sort((left, right) => left.localeCompare(right)),
      openTabs: openTabs.length ? openTabs : [activeFilePath],
      activeFilePath,
      selectedItem: parsed.selectedItem && typeof parsed.selectedItem.path === "string"
        ? parsed.selectedItem
        : { type: "file", path: activeFilePath },
      search: typeof parsed.search === "string" ? parsed.search : "",
      activity: typeof parsed.activity === "string" ? parsed.activity : "files",
      explorerVisible: typeof parsed.explorerVisible === "boolean" ? parsed.explorerVisible : true,
      gitVisible: typeof parsed.gitVisible === "boolean" ? parsed.gitVisible : true,
      terminalVisible: typeof parsed.terminalVisible === "boolean" ? parsed.terminalVisible : true,
      terminalHistory: Array.isArray(parsed.terminalHistory) && parsed.terminalHistory.length
        ? parsed.terminalHistory.slice(-80)
        : createDefaultState().terminalHistory,
      terminalCwd: typeof parsed.terminalCwd === "string" ? parsed.terminalCwd : "",
      chatMessages: Array.isArray(parsed.chatMessages) && parsed.chatMessages.length
        ? parsed.chatMessages.slice(-12)
        : createDefaultState().chatMessages,
      openrouterApiKey: typeof parsed.openrouterApiKey === "string" ? parsed.openrouterApiKey : "",
      openrouterModel: typeof parsed.openrouterModel === "string" && parsed.openrouterModel ? parsed.openrouterModel : "openai/gpt-5.2",
      collapsedFolders: Array.isArray(parsed.collapsedFolders) ? parsed.collapsedFolders : [],
      logs: Array.isArray(parsed.logs) && parsed.logs.length
        ? parsed.logs.slice(0, 18)
        : createDefaultState().logs,
    };
  } catch (error) {
    return createDefaultState();
  }
}

let state = loadState();
let previewTimer = null;
let terminalPendingAction = null;
let shellBackend = {
  available: false,
  baseUrl: "",
};
const scriptLoaders = {};
let authInstance = null;

function getFirstName(email, displayName) {
  if (displayName) {
    return displayName.split(" ")[0];
  }

  if (!email || !email.includes("@")) {
    return "User";
  }

  const emailPrefix = email.split("@")[0];
  const rawName = emailPrefix.split(/[\._-]/)[0];
  return rawName.charAt(0).toUpperCase() + rawName.slice(1);
}

function getInitials(name) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("") || "NV";
}

function loadExternalScript(src) {
  if (scriptLoaders[src]) {
    return scriptLoaders[src];
  }

  scriptLoaders[src] = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);

    if (existing && existing.dataset.loaded === "true") {
      resolve();
      return;
    }

    if (existing) {
      existing.addEventListener("load", () => {
        existing.dataset.loaded = "true";
        resolve();
      }, { once: true });
      existing.addEventListener("error", () => {
        reject(new Error(`Failed to load script: ${src}`));
      }, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      script.dataset.loaded = "true";
      resolve();
    };
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });

  return scriptLoaders[src];
}

async function ensureFirebaseAuth() {
  if (authInstance) {
    return authInstance;
  }

  await loadExternalScript("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
  await loadExternalScript("https://www.gstatic.com/firebasejs/10.7.1/firebase-auth-compat.js");

  if (!window.firebase) {
    throw new Error("Firebase failed to initialize.");
  }

  if (!firebase.apps.length) {
    firebase.initializeApp(FIREBASE_CONFIG);
  }

  authInstance = firebase.auth();
  return authInstance;
}

function applyAuthenticatedUser(user) {
  if (!user) {
    window.location.href = "home.html";
    return false;
  }

  const name = user.displayName || getFirstName(user.email || "", "");
  elements.profileName.textContent = name;
  elements.profileEmail.textContent = user.email;
  elements.profileAvatar.textContent = getInitials(name);
  return true;
}

function getShellBackendBaseUrl() {
  if (window.location.protocol === "http:" || window.location.protocol === "https:") {
    return window.location.origin;
  }

  return `http://127.0.0.1:${DEFAULT_BACKEND_PORT}`;
}

function persistState() {
  const serializable = {
    ...state,
    collapsedFolders: Array.from(new Set(state.collapsedFolders)),
    logs: state.logs.slice(0, 18),
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(serializable));
}

function normalizePath(path) {
  return path.replace(/\\/g, "/").replace(/^\.\/+/, "").replace(/^\/+/, "").trim();
}

function inferLanguage(path) {
  const extension = path.split(".").pop()?.toLowerCase();

  if (extension === "html" || extension === "htm") {
    return "html";
  }

  if (extension === "css") {
    return "css";
  }

  if (extension === "js" || extension === "mjs") {
    return "javascript";
  }

  if (extension === "json") {
    return "json";
  }

  return "text";
}

function getFileName(path) {
  const segments = path.split("/");
  return segments[segments.length - 1];
}

function collectFoldersFromFiles(files) {
  const folders = new Set();

  files.forEach((file) => {
    const parts = file.path.split("/");
    parts.pop();
    let current = "";

    parts.forEach((part) => {
      current = current ? `${current}/${part}` : part;
      folders.add(current);
    });
  });

  return [...folders].sort((left, right) => left.localeCompare(right));
}

function ensureFolderPath(path) {
  const normalizedPath = normalizePath(path).replace(/\/+$/, "");

  if (!normalizedPath) {
    return;
  }

  const parts = normalizedPath.split("/");
  let current = "";

  parts.forEach((part) => {
    current = current ? `${current}/${part}` : part;
    if (!state.folders.includes(current)) {
      state.folders.push(current);
    }
  });

  state.folders.sort((left, right) => left.localeCompare(right));
}

function setSelectedItem(type, path) {
  state.selectedItem = { type, path };
}

function getSelectedItem() {
  return state.selectedItem || { type: "file", path: state.activeFilePath };
}

function getFolderPath(path) {
  const parts = path.split("/");
  parts.pop();
  return parts.join("/") || "workspace";
}

function getLanguageLabel(language) {
  const labels = {
    html: "HTML",
    css: "CSS",
    javascript: "JavaScript",
    json: "JSON",
    text: "Text",
  };

  return labels[language] || "Text";
}

function getFileIconClass(language) {
  const classes = {
    html: "tree-file__icon--html",
    css: "tree-file__icon--css",
    javascript: "tree-file__icon--js",
    json: "tree-file__icon--json",
    text: "tree-file__icon--text",
  };

  return classes[language] || "tree-file__icon--text";
}

function getActiveFile() {
  return state.files.find((file) => file.path === state.activeFilePath) || state.files[0];
}

function getFileStatus(file) {
  if (!file.tracked) {
    return "A";
  }

  if (file.content !== file.originalContent) {
    return "M";
  }

  return "";
}

function getChangedFiles() {
  return state.files.filter((file) => getFileStatus(file));
}

function createLogEntry(message, tone = "info") {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    message,
    tone,
    time: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
}

function pushLog(message, tone = "info") {
  state.logs.unshift(createLogEntry(message, tone));
  state.logs = state.logs.slice(0, 18);
  persistState();
  renderDebugPanel();
}

function filterFiles() {
  const query = state.search.trim().toLowerCase();

  return state.files.filter((file) => {
    const matchesQuery = !query || file.path.toLowerCase().includes(query);
    const matchesActivity = state.activity !== "imports" || file.source !== "starter" || !file.tracked;
    return matchesQuery && matchesActivity;
  });
}

function buildTree(files, folders) {
  const root = { folders: new Map(), files: [] };

  folders.forEach((folderPath) => {
    const segments = folderPath.split("/").filter(Boolean);
    let node = root;

    segments.forEach((segment, index) => {
      if (!node.folders.has(segment)) {
        node.folders.set(segment, { folders: new Map(), files: [], path: segments.slice(0, index + 1).join("/") });
      }

      node = node.folders.get(segment);
    });
  });

  files.forEach((file) => {
    const segments = file.path.split("/");
    let node = root;

    segments.forEach((segment, index) => {
      const isFile = index === segments.length - 1;

      if (isFile) {
        node.files.push(file);
      } else {
        if (!node.folders.has(segment)) {
          node.folders.set(segment, { folders: new Map(), files: [], path: segments.slice(0, index + 1).join("/") });
        }

        node = node.folders.get(segment);
      }
    });
  });

  return root;
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function highlightCode(content, language) {
  if (language === "html") {
    return highlightHtml(content);
  }

  if (language === "css") {
    return highlightCss(content);
  }

  if (language === "javascript") {
    return highlightJavaScript(content);
  }

  if (language === "json") {
    return highlightJson(content);
  }

  return escapeHtml(content);
}

function tokenizePatterns(value, patterns) {
  const stash = [];
  let output = value;

  patterns.forEach(({ regex, className }) => {
    output = output.replace(regex, (match) => {
      const token = `__TOKEN_${stash.length}__`;
      stash.push(`<span class="${className}">${match}</span>`);
      return token;
    });
  });

  return output.replace(/__TOKEN_(\d+)__/g, (_, index) => stash[Number(index)]);
}

function highlightJavaScript(content) {
  const escaped = escapeHtml(content);

  return tokenizePatterns(escaped, [
    { regex: /\/\*[\s\S]*?\*\/|\/\/.*/g, className: "token-comment" },
    { regex: /`[^`]*`|"[^"]*"|'[^']*'/g, className: "token-string" },
    { regex: /\b(const|let|var|function|return|if|else|for|while|class|new|import|from|export|default|async|await|try|catch|throw)\b/g, className: "token-keyword" },
    { regex: /\b(\d+(?:\.\d+)?)\b/g, className: "token-number" },
    { regex: /\b([A-Za-z_$][\w$]*)(?=\()/g, className: "token-function" },
  ]);
}

function highlightCss(content) {
  const escaped = escapeHtml(content);

  return tokenizePatterns(escaped, [
    { regex: /\/\*[\s\S]*?\*\//g, className: "token-comment" },
    { regex: /"[^"]*"|'[^']*'/g, className: "token-string" },
    { regex: /@[a-z-]+/gi, className: "token-atrule" },
    { regex: /#[0-9a-fA-F]{3,8}\b/g, className: "token-value" },
    { regex: /\b\d+(?:\.\d+)?(?:px|rem|em|vh|vw|%|ms|s)?\b/g, className: "token-number" },
    { regex: /\b[a-z-]+(?=\s*:)/gi, className: "token-property" },
  ]);
}

function highlightHtml(content) {
  const escaped = escapeHtml(content);

  return tokenizePatterns(escaped, [
    { regex: /&lt;!--[\s\S]*?--&gt;/g, className: "token-comment" },
    { regex: /&lt;!DOCTYPE[\s\S]*?&gt;/gi, className: "token-keyword" },
    { regex: /&lt;\/?[A-Za-z][\s\S]*?&gt;/g, className: "token-tag" },
  ]);
}

function highlightJson(content) {
  const escaped = escapeHtml(content);

  return tokenizePatterns(escaped, [
    { regex: /"[^"]*"/g, className: "token-string" },
    { regex: /\b(true|false|null)\b/g, className: "token-keyword" },
    { regex: /\b(\d+(?:\.\d+)?)\b/g, className: "token-number" },
  ]);
}

function renderTreeNode(node, parentPath = "") {
  const folderEntries = Array.from(node.folders.entries()).sort(([left], [right]) => left.localeCompare(right));
  const fileEntries = [...node.files].sort((left, right) => left.path.localeCompare(right.path));
  const selectedItem = getSelectedItem();

  const folderMarkup = folderEntries.map(([name, child]) => {
    const folderPath = child.path || [parentPath, name].filter(Boolean).join("/");
    const isOpen = !state.collapsedFolders.includes(folderPath);
    const isSelected = selectedItem.type === "folder" && selectedItem.path === folderPath;

    return `
      <div class="tree-node">
        <button class="tree-folder ${isOpen ? "is-open" : ""} ${isSelected ? "is-selected" : ""}" type="button" data-folder-path="${folderPath}">
          <span class="tree-folder__arrow">></span>
          <span>${name}</span>
        </button>
        ${isOpen ? `<div class="tree-node__children">${renderTreeNode(child, folderPath)}</div>` : ""}
      </div>
    `;
  }).join("");

  const fileMarkup = fileEntries.map((file) => `
    <button class="tree-file ${file.path === state.activeFilePath ? "tree-file--active" : ""} ${selectedItem.type === "file" && selectedItem.path === file.path ? "is-selected" : ""}" type="button" data-file-path="${file.path}">
      <span class="tree-file__icon ${getFileIconClass(file.language)}"></span>
      <span>${getFileName(file.path)}</span>
    </button>
  `).join("");

  return `${folderMarkup}${fileMarkup}`;
}

function renderTree() {
  const files = filterFiles();
  const labels = {
    files: "All files",
    search: state.search.trim() ? `Search: ${state.search.trim()}` : "Search files",
    imports: "Imported and new files",
  };

  elements.treeCaption.textContent = labels[state.activity] || "All files";

  if (!files.length) {
    elements.tree.innerHTML = `
      <div class="tree-empty">
        <p>No files match this filter.</p>
        <span class="tree-empty__hint">Try another search or import new files.</span>
      </div>
    `;
    return;
  }

  elements.tree.innerHTML = renderTreeNode(buildTree(files, state.folders));
}

function renderSummary() {
  const changedCount = getChangedFiles().length;
  const importedCount = state.files.filter((file) => file.source !== "starter" || !file.tracked).length;

  elements.totalFiles.textContent = String(state.files.length);
  elements.dirtyFiles.textContent = String(changedCount);
  elements.importedFiles.textContent = String(importedCount);
  if (shellBackend.available) {
    elements.sessionStatus.textContent = changedCount ? "Python shell connected • Unsaved edits" : "Python shell connected";
  } else {
    elements.sessionStatus.textContent = changedCount ? "Unsaved edits in workspace" : "Editor ready";
  }
  const selectedItem = getSelectedItem();
  const selectedPath = selectedItem.path || "Nothing";
  elements.selectionLabel.innerHTML = `Selected: <strong>${selectedPath}</strong>`;
  elements.duplicateItem.disabled = selectedItem.type !== "file" || !selectedItem.path;
  elements.deleteItem.disabled = !selectedItem.path;
  elements.moveItem.disabled = !selectedItem.path;
}

function renderTabs() {
  const openTabs = state.openTabs
    .filter((path) => state.files.some((file) => file.path === path))
    .map((path) => {
      const file = state.files.find((item) => item.path === path);
      const isDirty = Boolean(getFileStatus(file));

      return `
        <button class="editor-tab ${path === state.activeFilePath ? "is-active" : ""} ${isDirty ? "is-dirty" : ""}" type="button" role="tab" aria-selected="${path === state.activeFilePath}" data-tab-path="${path}">
          <span class="editor-tab__label">${getFileName(path)}</span>
          <span class="editor-tab__dot"></span>
        </button>
      `;
    }).join("");

  elements.tabs.innerHTML = openTabs;
}

function renderEditor() {
  const file = getActiveFile();

  if (!file) {
    elements.editorInput.value = "";
    elements.highlightCode.innerHTML = "";
    elements.lineNumbers.innerHTML = '<span>01</span>';
    elements.currentFolder.textContent = "workspace";
    elements.currentFile.textContent = "No file selected";
    elements.currentLanguage.textContent = "Text";
    elements.charCount.textContent = "0 chars";
    elements.debugFile.textContent = "No file selected";
    elements.debugLanguage.textContent = "Text";
    return;
  }

  if (elements.editorInput.value !== file.content) {
    elements.editorInput.value = file.content;
  }

  elements.highlightCode.innerHTML = `${highlightCode(file.content, file.language)}\n`;

  const lineCount = Math.max(file.content.split("\n").length, 1);
  elements.lineNumbers.innerHTML = Array.from({ length: lineCount }, (_, index) => `<span>${String(index + 1).padStart(2, "0")}</span>`).join("");

  elements.currentFolder.textContent = getFolderPath(file.path);
  elements.currentFile.textContent = getFileName(file.path);
  elements.currentLanguage.textContent = getLanguageLabel(file.language);
  elements.charCount.textContent = `${file.content.length} chars`;
  elements.debugFile.textContent = file.path;
  elements.debugLanguage.textContent = getLanguageLabel(file.language);
  elements.debugFiles.textContent = String(state.files.length);
  elements.debugDirty.textContent = String(getChangedFiles().length);

  updateCursorStats();
  elements.debugEvents.textContent = `${state.logs.length} entries`;
  elements.debugLog.innerHTML = state.logs.slice(0, 5).map((entry) => `
    <div class="debug-log__item">
      <div class="debug-log__tone ${entry.tone === "warn" ? "debug-log__tone--warn" : entry.tone === "error" ? "debug-log__tone--error" : ""}"></div>
      <div>
        <strong>${entry.message}</strong>
        <p>${entry.time}</p>
      </div>
    </div>
  `).join("");
}

function renderChatPanel() {
  const messages = state.chatMessages.slice(-12);
  elements.chatCount.textContent = `${messages.length} msgs`;
  elements.chatStatus.textContent = state.openrouterApiKey ? "Connected" : "API key needed";
  elements.openrouterApiKey.value = state.openrouterApiKey;
  elements.openrouterModel.value = state.openrouterModel;

  elements.chatList.innerHTML = messages.map((message) => `
    <article class="chat-message ${message.role === "assistant" ? "chat-message--assistant" : ""}">
      <p class="chat-message__role">${message.role}</p>
      <p class="chat-message__body">${escapeHtml(message.content)}</p>
    </article>
  `).join("");
}

function getVisibleEntriesForCwd() {
  const cwd = state.terminalCwd;
  const files = state.files
    .filter((file) => getFolderPath(file.path) === (cwd || "workspace") || (cwd === "" && !file.path.includes("/")))
    .map((file) => `${getFileName(file.path)}`);
  const folders = state.folders
    .filter((folder) => getFolderPath(folder) === (cwd || "workspace") || (cwd === "" && !folder.includes("/")))
    .map((folder) => `${getFileName(folder)}/`);

  return [...folders, ...files].sort((left, right) => left.localeCompare(right));
}

function resolveTerminalPath(inputPath) {
  const raw = normalizePath(inputPath || "");
  if (!raw || raw === ".") {
    return state.terminalCwd;
  }

  if (raw === "..") {
    const parts = state.terminalCwd ? state.terminalCwd.split("/") : [];
    parts.pop();
    return parts.join("/");
  }

  if (raw.startsWith("/")) {
    return raw.replace(/^\/+/, "");
  }

  return [state.terminalCwd, raw].filter(Boolean).join("/");
}

function pushTerminalLine(text, tone = "") {
  state.terminalHistory.push({ type: "output", text, tone });
  state.terminalHistory = state.terminalHistory.slice(-80);
}

function buildPromptPath() {
  return state.terminalCwd ? `~/frontend/${state.terminalCwd}` : "~/frontend";
}

function formatTerminalValue(value) {
  if (typeof value === "string") {
    return value;
  }

  if (value === null) {
    return "null";
  }

  if (typeof value === "undefined") {
    return "undefined";
  }

  try {
    return JSON.stringify(value);
  } catch (error) {
    return String(value);
  }
}

function createFileRecordFromBackend(file, previousFile) {
  const normalizedPath = normalizePath(file.path);
  const content = typeof file.content === "string" ? file.content : "";

  return {
    path: normalizedPath,
    content,
    originalContent: previousFile ? previousFile.originalContent : content,
    source: previousFile ? previousFile.source : "created",
    tracked: previousFile ? previousFile.tracked : false,
    language: inferLanguage(normalizedPath),
    updatedAt: Date.now(),
  };
}

function applyBackendWorkspaceSnapshot(snapshot) {
  if (!snapshot || !Array.isArray(snapshot.files)) {
    return;
  }

  const previousFiles = new Map(state.files.map((file) => [file.path, file]));

  state.files = snapshot.files.map((file) => createFileRecordFromBackend(file, previousFiles.get(normalizePath(file.path))));
  state.folders = [...new Set([
    ...(Array.isArray(snapshot.folders) ? snapshot.folders.map((folder) => normalizePath(folder).replace(/\/+$/, "")) : []),
    ...collectFoldersFromFiles(state.files),
  ])].filter(Boolean).sort((left, right) => left.localeCompare(right));
  state.terminalCwd = normalizePath(snapshot.cwd || "").replace(/\/+$/, "");
  state.openTabs = state.openTabs.filter((path) => state.files.some((file) => file.path === path));

  if (!state.openTabs.length && state.files[0]) {
    state.openTabs = [state.files[0].path];
  }

  if (!state.files.some((file) => file.path === state.activeFilePath)) {
    state.activeFilePath = state.files[0]?.path || "";
  }

  if (state.activeFilePath) {
    setSelectedItem("file", state.activeFilePath);
  }
}

async function syncWorkspaceToShellBackend(command) {
  const response = await fetch(`${shellBackend.baseUrl}/api/shell`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      command,
      cwd: state.terminalCwd,
      files: state.files.map((file) => ({
        path: file.path,
        content: file.content,
      })),
      folders: state.folders,
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Shell request failed with ${response.status}`);
  }

  return response.json();
}

async function checkShellBackend() {
  shellBackend.baseUrl = getShellBackendBaseUrl();

  try {
    const response = await fetch(`${shellBackend.baseUrl}/api/health`);
    if (!response.ok) {
      throw new Error(`Health check failed with ${response.status}`);
    }

    shellBackend.available = true;
    pushTerminalLine("Python shell backend connected. Terminal is now running real shell commands.", "success");
  } catch (error) {
    shellBackend.available = false;
    pushTerminalLine("Python shell backend offline. Using browser workspace terminal fallback.", "muted");
  }

  renderSummary();
  renderTerminal();
}

async function executeBackendShellCommand(command) {
  const data = await syncWorkspaceToShellBackend(command);
  applyBackendWorkspaceSnapshot(data);

  if (data.stdout) {
    pushTerminalLine(data.stdout, "muted");
  }

  if (data.stderr) {
    pushTerminalLine(data.stderr, data.exitCode === 0 ? "warn" : "accent");
  }

  if (!data.stdout && !data.stderr) {
    pushTerminalLine(`Exit ${data.exitCode}`, data.exitCode === 0 ? "muted" : "accent");
  }

  pushLog(`Shell command finished with exit code ${data.exitCode}.`, data.exitCode === 0 ? "info" : "warn");
}

function resetWorkspaceProject() {
  const { files, folders } = createStarterWorkspace();

  state.files = files;
  state.folders = folders;
  state.openTabs = files.map((file) => file.path);
  state.activeFilePath = files[0]?.path || "";
  setSelectedItem("file", state.activeFilePath);
  state.search = "";
  state.activity = "files";
  state.collapsedFolders = [];
  state.terminalCwd = "";
  state.logs = [
    createLogEntry("Workspace cleared to a blank HTML, CSS, and JavaScript starter.", "info"),
  ];
}

function createTerminalScriptApi() {
  return {
    cwd: () => state.terminalCwd,
    resolvePath: (inputPath = "") => resolveTerminalPath(inputPath),
    readFile: (inputPath = "") => {
      const targetPath = resolveTerminalPath(inputPath);
      const file = state.files.find((item) => item.path === targetPath);

      if (!file) {
        throw new Error(`File not found: ${inputPath}`);
      }

      return file.content;
    },
    writeFile: (inputPath = "", content = "") => {
      const targetPath = resolveTerminalPath(inputPath);

      if (!targetPath) {
        throw new Error("A file path is required.");
      }

      upsertFile(targetPath, String(content), "created", false);
      return targetPath;
    },
    createFolder: (inputPath = "") => {
      const targetPath = resolveTerminalPath(inputPath);

      if (!targetPath || !createFolderAt(targetPath)) {
        throw new Error(`Could not create folder: ${inputPath}`);
      }

      return targetPath;
    },
    listFiles: () => state.files.map((file) => file.path),
    openFile: (inputPath = "") => {
      const targetPath = resolveTerminalPath(inputPath);
      const file = state.files.find((item) => item.path === targetPath);

      if (!file) {
        throw new Error(`File not found: ${inputPath}`);
      }

      openFile(targetPath);
      return targetPath;
    },
    log: (...values) => {
      pushTerminalLine(values.map(formatTerminalValue).join(" "), "muted");
    },
    resetProject: async () => {
      resetWorkspaceProject();
      return "project-reset";
    },
  };
}

async function runWorkspaceScript(inputPath) {
  const targetPath = resolveTerminalPath(inputPath);
  const file = state.files.find((item) => item.path === targetPath);

  if (!inputPath) {
    pushTerminalLine("Usage: run <file.js>", "accent");
    return;
  }

  if (!file) {
    pushTerminalLine(`File not found: ${inputPath}`, "accent");
    return;
  }

  if (file.language !== "javascript") {
    pushTerminalLine(`Only JavaScript files can be run: ${file.path}`, "accent");
    return;
  }

  if (file.path === "scripts/reset-project.js") {
    terminalPendingAction = {
      type: "run-reset-project",
      path: file.path,
    };
    pushTerminalLine('Confirm project reset? Type "yes" to continue or "no" to cancel.', "warn");
    return;
  }

  await executeWorkspaceScriptFile(file);
}

async function executeWorkspaceScriptFile(file) {
  if (!file) {
    return;
  }

  const terminalConsole = {
    log: (...values) => pushTerminalLine(values.map(formatTerminalValue).join(" "), "muted"),
    warn: (...values) => pushTerminalLine(values.map(formatTerminalValue).join(" "), "warn"),
    error: (...values) => pushTerminalLine(values.map(formatTerminalValue).join(" "), "accent"),
  };

  try {
    const runner = new Function(
      "api",
      "console",
      `"use strict"; return (async () => {\n${file.content}\n})();`
    );

    pushTerminalLine(`Running ${file.path}...`, "muted");
    await runner(createTerminalScriptApi(), terminalConsole);
    pushTerminalLine(`Finished ${file.path}`, "success");
    pushLog(`Ran ${file.path} from the workspace terminal.`, "info");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    pushTerminalLine(`Script failed: ${message}`, "accent");
    pushLog(`Terminal script failed: ${file.path}.`, "error");
  }
}

async function fetchWithCurl(inputPath) {
  const target = inputPath.trim();

  if (!target) {
    pushTerminalLine("Usage: curl <url>", "accent");
    return;
  }

  let url;

  try {
    url = new URL(target, window.location.href);
  } catch (error) {
    pushTerminalLine(`Invalid URL: ${target}`, "accent");
    return;
  }

  pushTerminalLine(`Fetching ${url.href} ...`, "muted");

  try {
    const response = await fetch(url.href);
    const responseText = await response.text();
    const contentType = response.headers.get("content-type") || "unknown";
    const output = responseText.length > 4000
      ? `${responseText.slice(0, 4000)}\n\n... output truncated ...`
      : responseText;

    pushTerminalLine(`Status: ${response.status} ${response.statusText}`, response.ok ? "success" : "warn");
    pushTerminalLine(`Content-Type: ${contentType}`, "muted");
    pushTerminalLine(output || "(empty response body)", "muted");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    pushTerminalLine(`curl failed: ${message}`, "accent");
  }
}

function moveItemToPath(sourcePath, destinationPath) {
  const file = state.files.find((item) => item.path === sourcePath);

  if (file) {
    ensureFolderPath(getFolderPath(destinationPath) === "workspace" ? "" : getFolderPath(destinationPath));
    file.path = destinationPath;
    file.language = inferLanguage(destinationPath);
    state.openTabs = state.openTabs.map((path) => path === sourcePath ? destinationPath : path);
    if (state.activeFilePath === sourcePath) {
      state.activeFilePath = destinationPath;
    }
    setSelectedItem("file", destinationPath);
    state.folders = [...new Set([...collectFoldersFromFiles(state.files), ...state.folders])].sort((left, right) => left.localeCompare(right));
    return true;
  }

  if (!state.folders.includes(sourcePath)) {
    return false;
  }

  ensureFolderPath(destinationPath);
  state.files.forEach((item) => {
    if (item.path === sourcePath || item.path.startsWith(`${sourcePath}/`)) {
      item.path = destinationPath + item.path.slice(sourcePath.length);
      item.language = inferLanguage(item.path);
    }
  });
  state.folders = state.folders.map((folder) => {
    if (folder === sourcePath || folder.startsWith(`${sourcePath}/`)) {
      return destinationPath + folder.slice(sourcePath.length);
    }
    return folder;
  });
  state.openTabs = state.openTabs.map((path) => {
    if (path === sourcePath || path.startsWith(`${sourcePath}/`)) {
      return destinationPath + path.slice(sourcePath.length);
    }
    return path;
  });
  if (state.activeFilePath === sourcePath || state.activeFilePath.startsWith(`${sourcePath}/`)) {
    state.activeFilePath = destinationPath + state.activeFilePath.slice(sourcePath.length);
  }
  setSelectedItem("folder", destinationPath);
  state.folders = [...new Set([...collectFoldersFromFiles(state.files), ...state.folders])].sort((left, right) => left.localeCompare(right));
  return true;
}

function removeItemAtPath(targetPath) {
  const isFile = state.files.some((item) => item.path === targetPath);
  const isFolder = state.folders.includes(targetPath);

  if (!isFile && !isFolder) {
    return false;
  }

  if (isFile) {
    state.files = state.files.filter((file) => file.path !== targetPath);
    state.openTabs = state.openTabs.filter((path) => path !== targetPath);
  } else {
    state.files = state.files.filter((file) => file.path !== targetPath && !file.path.startsWith(`${targetPath}/`));
    state.folders = state.folders.filter((folder) => folder !== targetPath && !folder.startsWith(`${targetPath}/`));
    state.openTabs = state.openTabs.filter((path) => path !== targetPath && !path.startsWith(`${targetPath}/`));
  }

  state.folders = [...new Set([...collectFoldersFromFiles(state.files), ...state.folders])].sort((left, right) => left.localeCompare(right));
  state.activeFilePath = state.files[0]?.path || "";
  setSelectedItem(state.activeFilePath ? "file" : "folder", state.activeFilePath || state.folders[0] || "");
  return true;
}

function renderTerminal() {
  elements.terminalCwd.textContent = buildPromptPath();
  elements.terminalOutput.innerHTML = state.terminalHistory.map((entry) => {
    const toneClass = entry.tone ? ` terminal__line--${entry.tone}` : "";
    return `<div class="terminal__line${toneClass}">${escapeHtml(entry.text)}</div>`;
  }).join("");
  elements.terminalOutput.scrollTop = elements.terminalOutput.scrollHeight;
}

function duplicateFileToPath(sourcePath, nextPath) {
  const file = state.files.find((item) => item.path === sourcePath);
  if (!file) {
    return false;
  }

  upsertFile(nextPath, file.content, "created", false);
  return true;
}

async function executeTerminalCommand(rawInput) {
  const input = rawInput.trim();
  if (!input) {
    return;
  }

  state.terminalHistory.push({ type: "command", text: `workspace ${buildPromptPath()} ${input}` });

  if (terminalPendingAction) {
    const normalizedInput = input.toLowerCase();

    if (normalizedInput === "yes" || normalizedInput === "y") {
      const pendingAction = terminalPendingAction;
      terminalPendingAction = null;

      if (pendingAction.type === "run-reset-project") {
        const file = state.files.find((item) => item.path === pendingAction.path);

        if (!file) {
          pushTerminalLine(`File not found: ${pendingAction.path}`, "accent");
        } else {
          await executeWorkspaceScriptFile(file);
        }
      }

      persistState();
      renderAll();
      return;
    }

    if (normalizedInput === "no" || normalizedInput === "n") {
      terminalPendingAction = null;
      pushTerminalLine("Reset cancelled.", "muted");
      persistState();
      renderAll();
      return;
    }

    pushTerminalLine('Pending confirmation. Type "yes" to continue or "no" to cancel.', "warn");
    persistState();
    renderAll();
    return;
  }

  const [command, ...args] = input.split(/\s+/);
  const arg = args.join(" ");

  if (shellBackend.available && command !== "run" && command !== "help" && command !== "clear") {
    try {
      await executeBackendShellCommand(input);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      pushTerminalLine(`Shell request failed: ${message}`, "accent");
      pushLog("Python shell request failed.", "error");
    }
  } else if (command === "help") {
    if (shellBackend.available) {
      pushTerminalLine("Shell mode: most commands run in the Python backend. Local IDE commands: run <file.js>, help, clear.", "muted");
    } else {
      pushTerminalLine("Commands: help, ls, pwd, cd <folder>, cat <file>, open <file>, run <file.js>, curl <url>, mkdir <folder>, touch <file>, cp <src> <dest>, mv <src> <dest>, rm <path>, clear", "muted");
    }
  } else if (command === "cd") {
    const targetPath = resolveTerminalPath(arg);
    if (!arg) {
      state.terminalCwd = "";
      pushTerminalLine(buildPromptPath(), "muted");
    } else if (targetPath === "" || state.folders.includes(targetPath)) {
      state.terminalCwd = targetPath;
      pushTerminalLine(buildPromptPath(), "muted");
    } else {
      pushTerminalLine(`Folder not found: ${arg}`, "accent");
    }
  } else if (command === "pwd") {
    pushTerminalLine(buildPromptPath(), "muted");
  } else if (command === "ls") {
    const entries = getVisibleEntriesForCwd();
    pushTerminalLine(entries.length ? entries.join("   ") : "(empty)", "muted");
  } else if (command === "cat") {
    const targetPath = resolveTerminalPath(arg);
    const file = state.files.find((item) => item.path === targetPath);
    pushTerminalLine(file ? file.content : `File not found: ${arg}`, file ? "muted" : "accent");
  } else if (command === "open") {
    const targetPath = resolveTerminalPath(arg);
    const file = state.files.find((item) => item.path === targetPath);
    if (file) {
      openFile(file.path);
      pushTerminalLine(`Opened ${file.path}`, "success");
    } else {
      pushTerminalLine(`File not found: ${arg}`, "accent");
    }
  } else if (command === "run") {
    await runWorkspaceScript(arg);
  } else if (command === "curl") {
    await fetchWithCurl(arg);
  } else if (command === "mkdir") {
    const targetPath = resolveTerminalPath(arg);
    if (targetPath && createFolderAt(targetPath)) {
      pushTerminalLine(`Created folder ${targetPath}`, "success");
    } else {
      pushTerminalLine("Usage: mkdir <folder>", "accent");
    }
  } else if (command === "touch") {
    const targetPath = resolveTerminalPath(arg);
    if (targetPath) {
      upsertFile(targetPath, "", "created", false);
      pushTerminalLine(`Created file ${targetPath}`, "success");
    } else {
      pushTerminalLine("Usage: touch <file>", "accent");
    }
  } else if (command === "cp") {
    if (args.length < 2) {
      pushTerminalLine("Usage: cp <source> <destination>", "accent");
    } else {
      const sourcePath = resolveTerminalPath(args[0]);
      const destinationPath = resolveTerminalPath(args.slice(1).join(" "));
      if (duplicateFileToPath(sourcePath, destinationPath)) {
        pushTerminalLine(`Copied ${sourcePath} to ${destinationPath}`, "success");
      } else {
        pushTerminalLine(`File not found: ${args[0]}`, "accent");
      }
    }
  } else if (command === "mv") {
    if (args.length < 2) {
      pushTerminalLine("Usage: mv <source> <destination>", "accent");
    } else {
      const sourcePath = resolveTerminalPath(args[0]);
      const destinationPath = resolveTerminalPath(args.slice(1).join(" "));
      if (moveItemToPath(sourcePath, destinationPath)) {
        pushTerminalLine(`Moved ${sourcePath} to ${destinationPath}`, "success");
      } else {
        pushTerminalLine(`Path not found: ${args[0]}`, "accent");
      }
    }
  } else if (command === "rm") {
    const targetPath = resolveTerminalPath(arg);
    if (removeItemAtPath(targetPath)) {
      pushTerminalLine(`Removed ${targetPath}`, "warn");
    } else {
      pushTerminalLine(`Path not found: ${arg}`, "accent");
    }
  } else if (command === "clear") {
    state.terminalHistory = [];
  } else {
    pushTerminalLine(`Unknown command: ${command}`, "accent");
  }

  persistState();
  renderAll();
}

function renderDebugPanel() {
  const file = getActiveFile();

  if (!file) {
    return;
  }

  elements.debugFile.textContent = file.path;
  elements.debugLanguage.textContent = getLanguageLabel(file.language);
  elements.debugFiles.textContent = String(state.files.length);
  elements.debugDirty.textContent = String(getChangedFiles().length);
  elements.debugEvents.textContent = `${state.logs.length} entries`;
}

function injectIntoMarkup(source, marker, injection) {
  const lowerSource = source.toLowerCase();
  const lowerMarker = marker.toLowerCase();
  const index = lowerSource.lastIndexOf(lowerMarker);

  if (index === -1) {
    return `${source}${injection}`;
  }

  return `${source.slice(0, index)}${injection}${source.slice(index)}`;
}

function buildPreviewDocument() {
  const activeFile = getActiveFile();
  const htmlFile = activeFile.language === "html"
    ? activeFile
    : state.files.find((file) => file.path.toLowerCase() === "index.html")
      || state.files.find((file) => file.language === "html");

  const cssBundle = state.files
    .filter((file) => file.language === "css")
    .map((file) => `/* ${file.path} */\n${file.content}`)
    .join("\n\n");

  const jsBundle = state.files
    .filter((file) => file.language === "javascript")
    .map((file) => `// ${file.path}\n${file.content}`)
    .join("\n\n");

  const previewSource = htmlFile
    ? htmlFile.content
    : `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Preview</title></head><body><main style="font-family: sans-serif; padding: 32px;">Create an HTML file to render a live preview.</main></body></html>`;

  const bridgeScript = `<script>
    const originalLog = console.log.bind(console);
    const originalWarn = console.warn.bind(console);
    const originalError = console.error.bind(console);
    const send = (type, message) => parent.postMessage({ source: "nova-preview", type, message }, "*");
    console.log = (...args) => { originalLog(...args); send("log", args.join(" ")); };
    console.warn = (...args) => { originalWarn(...args); send("warn", args.join(" ")); };
    console.error = (...args) => { originalError(...args); send("error", args.join(" ")); };
    window.addEventListener("error", (event) => send("error", event.message));
    send("ready", "Preview refreshed");
  <\/script>`;

  const styleBlock = `<style>${cssBundle}</style>`;
  const scriptBlock = `${bridgeScript}<script>${jsBundle}<\/script>`;

  let documentMarkup = injectIntoMarkup(previewSource, "</head>", styleBlock);
  documentMarkup = injectIntoMarkup(documentMarkup, "</body>", scriptBlock);

  if (!documentMarkup.toLowerCase().includes("<style>")) {
    documentMarkup = `${styleBlock}${documentMarkup}`;
  }

  if (!documentMarkup.toLowerCase().includes("nova-preview")) {
    documentMarkup = injectIntoMarkup(documentMarkup, "</body>", bridgeScript);
  }

  return {
    title: htmlFile ? htmlFile.path : "preview.html",
    markup: documentMarkup,
  };
}

function buildWorkspaceContext() {
  const activeFile = getActiveFile();
  const fileList = state.files.map((file) => file.path).join("\n");
  const activeFileSection = activeFile
    ? `Active file: ${activeFile.path}\n\n${activeFile.content}`
    : "No active file selected.";

  return [
    "You are helping inside a browser IDE workspace.",
    `Files in workspace:\n${fileList}`,
    activeFileSection,
  ].join("\n\n");
}

function extractResponseText(data) {
  if (typeof data.output_text === "string" && data.output_text.trim()) {
    return data.output_text;
  }

  if (!Array.isArray(data.output)) {
    return "";
  }

  return data.output
    .flatMap((item) => Array.isArray(item.content) ? item.content : [])
    .filter((item) => item && item.type === "output_text")
    .map((item) => item.text || "")
    .join("\n")
    .trim();
}

async function sendChatMessage() {
  const apiKey = state.openrouterApiKey.trim();
  const prompt = elements.chatInput.value.trim();

  if (!apiKey) {
    window.alert("Add your OpenRouter API key in the ChatGPT panel first.");
    return;
  }

  if (!prompt) {
    return;
  }

  const userMessage = { role: "user", content: prompt };
  state.chatMessages.push(userMessage);
  state.chatMessages = state.chatMessages.slice(-12);
  elements.chatInput.value = "";
  elements.chatStatus.textContent = "Thinking";
  elements.chatSend.disabled = true;
  persistState();
  renderChatPanel();

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": window.location.href,
        "X-Title": "NovaIDE Workspace Assistant",
      },
      body: JSON.stringify({
        model: state.openrouterModel || "openai/gpt-5.2",
        messages: [
          {
            role: "system",
            content: "You are a helpful coding assistant inside a browser IDE. Use the provided workspace context to answer questions clearly and practically.",
          },
          {
            role: "user",
            content: `${buildWorkspaceContext()}\n\nUser request:\n${prompt}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Request failed with ${response.status}`);
    }

    const data = await response.json();
    const assistantText = data.choices?.[0]?.message?.content || "I could not parse a reply from the API.";
    state.chatMessages.push({ role: "assistant", content: assistantText });
    state.chatMessages = state.chatMessages.slice(-12);
    state.chatStatus = "Connected";
    pushLog("ChatGPT responded using current IDE context.", "info");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    state.chatMessages.push({ role: "assistant", content: `Request failed: ${message}` });
    state.chatMessages = state.chatMessages.slice(-12);
    pushLog("ChatGPT request failed.", "error");
  } finally {
    elements.chatSend.disabled = false;
    persistState();
    renderChatPanel();
  }
}

function renderPreview() {
  const preview = buildPreviewDocument();
  elements.previewTitle.textContent = preview.title;
  elements.previewStatus.textContent = "Live";
  elements.previewFrame.srcdoc = preview.markup;
}

function schedulePreviewRender() {
  window.clearTimeout(previewTimer);
  previewTimer = window.setTimeout(() => {
    renderPreview();
    persistState();
  }, 180);
}

function updateCursorStats() {
  const cursor = elements.editorInput.selectionStart || 0;
  const value = elements.editorInput.value.slice(0, cursor);
  const lines = value.split("\n");
  const line = lines.length;
  const column = lines[lines.length - 1].length + 1;
  elements.cursorPosition.textContent = `Ln ${line}, Col ${column}`;
}

function openFile(path) {
  if (!state.files.some((file) => file.path === path)) {
    return;
  }

  if (!state.openTabs.includes(path)) {
    state.openTabs.push(path);
  }

  state.activeFilePath = path;
  setSelectedItem("file", path);
  persistState();
  renderTabs();
  renderTree();
  renderEditor();
  renderPreview();
}

function toggleFolder(path) {
  setSelectedItem("folder", path);
  if (state.collapsedFolders.includes(path)) {
    state.collapsedFolders = state.collapsedFolders.filter((item) => item !== path);
  } else {
    state.collapsedFolders.push(path);
  }

  persistState();
  renderTree();
}

function createStarterContent(template, path) {
  const fileName = getFileName(path);
  const identifier = `init${fileName.replace(/\W/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()).replace(/\s+/g, "")}`;

  if (template === "html") {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${fileName}</title>
</head>
<body>
  <main>
    <h1>${fileName}</h1>
  </main>
</body>
</html>`;
  }

  if (template === "css") {
    return `.${fileName.replace(/\.[^.]+$/, "")} {
  display: block;
}`;
  }

  if (template === "js") {
    return `const ${identifier} = () => {
  console.log("${fileName} ready");
};

${identifier}();`;
  }

  return "";
}

function upsertFile(path, content, source = "created", tracked = false) {
  const normalizedPath = normalizePath(path);
  ensureFolderPath(getFolderPath(normalizedPath) === "workspace" ? "" : getFolderPath(normalizedPath));
  const existingIndex = state.files.findIndex((file) => file.path === normalizedPath);

  if (existingIndex >= 0) {
    state.files[existingIndex] = {
      ...state.files[existingIndex],
      path: normalizedPath,
      content,
      originalContent: content,
      source,
      tracked,
      language: inferLanguage(normalizedPath),
      updatedAt: Date.now(),
    };
  } else {
    state.files.push(createFileRecord({
      path: normalizedPath,
      content,
      source,
      tracked,
    }));
  }

  if (!state.openTabs.includes(normalizedPath)) {
    state.openTabs.push(normalizedPath);
  }

  state.activeFilePath = normalizedPath;
  setSelectedItem("file", normalizedPath);
  persistState();
}

function createFolderAt(path) {
  const normalizedPath = normalizePath(path).replace(/\/+$/, "");

  if (!normalizedPath) {
    return false;
  }

  ensureFolderPath(normalizedPath);
  setSelectedItem("folder", normalizedPath);
  persistState();
  return true;
}

function duplicateSelectedFile() {
  const selectedItem = getSelectedItem();

  if (selectedItem.type !== "file") {
    return;
  }

  const file = state.files.find((item) => item.path === selectedItem.path);
  if (!file) {
    return;
  }

  const defaultPath = file.path.replace(/(\.[^.]+)?$/, "-copy$1");
  const newPath = window.prompt("Copy file to:", defaultPath);

  if (!newPath) {
    return;
  }

  upsertFile(newPath, file.content, "created", false);
  pushLog(`Copied ${file.path} to ${normalizePath(newPath)}.`, "info");
  renderAll();
}

function moveSelectedItem() {
  const selectedItem = getSelectedItem();
  const currentPath = selectedItem.path;
  const nextPath = window.prompt(
    selectedItem.type === "folder" ? "Move folder to:" : "Move file to:",
    currentPath
  );

  if (!nextPath) {
    return;
  }

  const normalizedNextPath = normalizePath(nextPath).replace(/\/+$/, "");
  if (!normalizedNextPath || normalizedNextPath === currentPath) {
    return;
  }

  if (selectedItem.type === "file") {
    const file = state.files.find((item) => item.path === currentPath);
    if (!file) {
      return;
    }

    ensureFolderPath(getFolderPath(normalizedNextPath) === "workspace" ? "" : getFolderPath(normalizedNextPath));
    file.path = normalizedNextPath;
    file.language = inferLanguage(normalizedNextPath);
    state.openTabs = state.openTabs.map((path) => path === currentPath ? normalizedNextPath : path);
    if (state.activeFilePath === currentPath) {
      state.activeFilePath = normalizedNextPath;
    }
    setSelectedItem("file", normalizedNextPath);
  } else {
    ensureFolderPath(normalizedNextPath);
    state.files.forEach((file) => {
      if (file.path === currentPath || file.path.startsWith(`${currentPath}/`)) {
        file.path = normalizedNextPath + file.path.slice(currentPath.length);
        file.language = inferLanguage(file.path);
      }
    });
    state.folders = state.folders.map((folder) => {
      if (folder === currentPath || folder.startsWith(`${currentPath}/`)) {
        return normalizedNextPath + folder.slice(currentPath.length);
      }
      return folder;
    });
    state.openTabs = state.openTabs.map((path) => {
      if (path === currentPath || path.startsWith(`${currentPath}/`)) {
        return normalizedNextPath + path.slice(currentPath.length);
      }
      return path;
    });
    if (state.activeFilePath === currentPath || state.activeFilePath.startsWith(`${currentPath}/`)) {
      state.activeFilePath = normalizedNextPath + state.activeFilePath.slice(currentPath.length);
    }
    setSelectedItem("folder", normalizedNextPath);
  }

  state.folders = [...new Set([...collectFoldersFromFiles(state.files), ...state.folders])].sort((left, right) => left.localeCompare(right));
  persistState();
  pushLog(`Moved ${currentPath} to ${normalizedNextPath}.`, "info");
  renderAll();
}

function deleteSelectedItem() {
  const selectedItem = getSelectedItem();
  if (!selectedItem.path) {
    return;
  }

  const confirmed = window.confirm(`Delete ${selectedItem.type} "${selectedItem.path}"?`);
  if (!confirmed) {
    return;
  }

  if (selectedItem.type === "file") {
    state.files = state.files.filter((file) => file.path !== selectedItem.path);
    state.openTabs = state.openTabs.filter((path) => path !== selectedItem.path);
  } else {
    state.files = state.files.filter((file) => file.path !== selectedItem.path && !file.path.startsWith(`${selectedItem.path}/`));
    state.folders = state.folders.filter((folder) => folder !== selectedItem.path && !folder.startsWith(`${selectedItem.path}/`));
    state.openTabs = state.openTabs.filter((path) => path !== selectedItem.path && !path.startsWith(`${selectedItem.path}/`));
  }

  state.folders = [...new Set([...collectFoldersFromFiles(state.files), ...state.folders])].sort((left, right) => left.localeCompare(right));
  state.activeFilePath = state.files[0]?.path || "";
  setSelectedItem(state.activeFilePath ? "file" : "folder", state.activeFilePath || state.folders[0] || "");
  persistState();
  pushLog(`Deleted ${selectedItem.path}.`, "warn");
  renderAll();
}

function saveSnapshot() {
  state.files = state.files.map((file) => ({
    ...file,
    originalContent: file.content,
    tracked: true,
    updatedAt: Date.now(),
  }));

  persistState();
  pushLog("Workspace snapshot saved locally.", "info");
  renderSummary();
  renderTabs();
  renderDebugPanel();
}

function downloadActiveFile() {
  const file = getActiveFile();

  if (!file) {
    return;
  }

  const blob = new Blob([file.content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = getFileName(file.path);
  anchor.click();
  URL.revokeObjectURL(url);

  pushLog(`Downloaded ${file.path} to your computer.`, "info");
}

function renderAll() {
  state.files = ensureWorkspaceUpgradeFiles(state.files, state.workspaceVersion || WORKSPACE_VERSION);
  state.folders = [...new Set([...collectFoldersFromFiles(state.files), ...state.folders])].sort((left, right) => left.localeCompare(right));

  if (!state.files.length && !state.folders.length) {
    state = createDefaultState();
  }

  const activeExists = state.files.some((file) => file.path === state.activeFilePath);
  if (!activeExists) {
    state.activeFilePath = state.files[0]?.path || "";
  }

  if (state.activeFilePath && !state.openTabs.includes(state.activeFilePath)) {
    state.openTabs.push(state.activeFilePath);
  }

  elements.fileSearch.value = state.search;
  document.body.classList.toggle("explorer-collapsed", !state.explorerVisible);
  document.body.classList.toggle("git-collapsed", !state.gitVisible);
  document.body.classList.toggle("terminal-collapsed", !state.terminalVisible);
  elements.panelMenuItems.forEach((item) => {
    if (item.dataset.menuToggle === "explorer") {
      item.textContent = state.explorerVisible ? "Hide File Hierarchy" : "Show File Hierarchy";
    }

    if (item.dataset.menuToggle === "git") {
      item.textContent = state.gitVisible ? "Hide ChatGPT" : "Show ChatGPT";
    }

    if (item.dataset.menuToggle === "terminal") {
      item.textContent = state.terminalVisible ? "Hide Terminal" : "Show Terminal";
    }
  });

  document.querySelectorAll("[data-activity]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.activity === state.activity);
  });

  renderSummary();
  renderTree();
  renderTabs();
  renderEditor();
  renderChatPanel();
  renderDebugPanel();
  renderPreview();
  renderTerminal();
}

async function importFiles(fileList) {
  const files = Array.from(fileList);

  if (!files.length) {
    return;
  }

  const imported = await Promise.all(files.map((file) => new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve({ path: file.webkitRelativePath || file.name, content: String(reader.result || "") });
    reader.onerror = () => resolve(null);
    reader.readAsText(file);
  })));

  const successful = imported.filter(Boolean);

  successful.forEach((file) => {
    upsertFile(file.path, file.content, "imported", false);
  });

  if (successful.length) {
    pushLog(`Imported ${successful.length} file${successful.length === 1 ? "" : "s"} into the workspace.`, "info");
    renderAll();
  }
}

function handlePreviewMessages(event) {
  const data = event.data;

  if (!data || data.source !== "nova-preview") {
    return;
  }

  if (data.type === "ready") {
    elements.previewStatus.textContent = "Ready";
    return;
  }

  if (data.type === "warn") {
    pushLog(`Preview warning: ${data.message}`, "warn");
    return;
  }

  if (data.type === "error") {
    elements.previewStatus.textContent = "Error";
    pushLog(`Preview error: ${data.message}`, "error");
    return;
  }

  if (data.type === "log") {
    pushLog(`Preview log: ${data.message}`, "info");
  }
}

elements.tree.addEventListener("click", (event) => {
  const folderButton = event.target.closest("[data-folder-path]");
  if (folderButton) {
    toggleFolder(folderButton.dataset.folderPath);
    return;
  }

  const fileButton = event.target.closest("[data-file-path]");
  if (fileButton) {
    openFile(fileButton.dataset.filePath);
  }
});

elements.tabs.addEventListener("click", (event) => {
  const tabButton = event.target.closest("[data-tab-path]");
  if (tabButton) {
    openFile(tabButton.dataset.tabPath);
  }
});

document.querySelectorAll("[data-panel]").forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = tab.dataset.panel;

    document.querySelectorAll("[data-panel]").forEach((item) => {
      const isActive = item === tab;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-selected", String(isActive));
    });

    document.querySelectorAll("[data-console-panel]").forEach((panel) => {
      const isActive = panel.dataset.consolePanel === target;
      panel.classList.toggle("is-active", isActive);
      panel.hidden = !isActive;
    });
  });
});

document.querySelectorAll("[data-activity]").forEach((button) => {
  button.addEventListener("click", () => {
    state.activity = button.dataset.activity;

    if (state.activity === "search") {
      elements.fileSearch.focus();
    }

    persistState();
    renderTree();
    renderAll();
  });
});

elements.fileSearch.addEventListener("input", (event) => {
  state.search = event.target.value;
  if (state.search && state.activity !== "imports") {
    state.activity = "search";
  } else if (!state.search && state.activity === "search") {
    state.activity = "files";
  }
  persistState();
  renderAll();
});

elements.editorInput.addEventListener("input", () => {
  const file = getActiveFile();
  if (!file) {
    return;
  }

  file.content = elements.editorInput.value;
  file.updatedAt = Date.now();

  renderEditor();
  renderTabs();
  renderSummary();
  renderDebugPanel();
  schedulePreviewRender();
});

elements.editorInput.addEventListener("scroll", () => {
  elements.highlightCode.parentElement.scrollTop = elements.editorInput.scrollTop;
  elements.highlightCode.parentElement.scrollLeft = elements.editorInput.scrollLeft;
  elements.lineNumbers.scrollTop = elements.editorInput.scrollTop;
});

["click", "keyup"].forEach((eventName) => {
  elements.editorInput.addEventListener(eventName, updateCursorStats);
});

elements.editorInput.addEventListener("keydown", (event) => {
  if (event.key === "Tab") {
    event.preventDefault();
    const start = elements.editorInput.selectionStart;
    const end = elements.editorInput.selectionEnd;
    const value = elements.editorInput.value;
    const insertion = "  ";

    elements.editorInput.value = `${value.slice(0, start)}${insertion}${value.slice(end)}`;
    elements.editorInput.selectionStart = elements.editorInput.selectionEnd = start + insertion.length;
    elements.editorInput.dispatchEvent(new Event("input"));
  }
});

document.querySelector("[data-import-trigger]").addEventListener("click", () => {
  elements.fileInput.click();
});

elements.fileInput.addEventListener("change", async (event) => {
  await importFiles(event.target.files);
  event.target.value = "";
});

document.querySelectorAll("[data-open-modal]").forEach((button) => {
  button.addEventListener("click", () => {
    elements.modal.hidden = false;
    elements.newFilePath.focus();
  });
});

document.querySelectorAll("[data-close-modal]").forEach((button) => {
  button.addEventListener("click", () => {
    elements.modal.hidden = true;
    elements.createForm.reset();
  });
});

elements.createForm.addEventListener("submit", (event) => {
  event.preventDefault();

  let path = normalizePath(elements.newFilePath.value);
  const template = elements.newFileTemplate.value;

  if (!path) {
    return;
  }

  if (!path.includes(".") && template !== "blank") {
    const extension = template === "js" ? "js" : template;
    path = `${path}.${extension}`;
  }

  const content = createStarterContent(template, path);
  upsertFile(path, content, "created", false);
  elements.modal.hidden = true;
  elements.createForm.reset();

  pushLog(`Created ${path} inside the IDE.`, "info");
  renderAll();
});

elements.createFolder.addEventListener("click", () => {
  const selectedItem = getSelectedItem();
  const basePath = selectedItem.type === "folder"
    ? selectedItem.path
    : selectedItem.path
      ? getFolderPath(selectedItem.path) === "workspace" ? "" : getFolderPath(selectedItem.path)
      : "";
  const proposedPath = basePath ? `${basePath}/new-folder` : "new-folder";
  const folderPath = window.prompt("Create folder:", proposedPath);

  if (!folderPath) {
    return;
  }

  if (createFolderAt(folderPath)) {
    pushLog(`Created folder ${normalizePath(folderPath)}.`, "info");
    renderAll();
  }
});

elements.duplicateItem.addEventListener("click", duplicateSelectedFile);
elements.moveItem.addEventListener("click", moveSelectedItem);
elements.deleteItem.addEventListener("click", deleteSelectedItem);
elements.openrouterApiKey.addEventListener("input", (event) => {
  state.openrouterApiKey = event.target.value.trim();
  persistState();
  renderChatPanel();
});
elements.openrouterModel.addEventListener("input", (event) => {
  state.openrouterModel = event.target.value.trim() || "openai/gpt-5.2";
  persistState();
});
elements.chatSend.addEventListener("click", sendChatMessage);
elements.chatInput.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
    event.preventDefault();
    sendChatMessage();
  }
});
elements.chatClear.addEventListener("click", () => {
  state.chatMessages = [
    {
      role: "assistant",
      content: "Chat cleared. Ask a new question whenever you're ready.",
    },
  ];
  persistState();
  renderChatPanel();
});
elements.terminalForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = elements.terminalInput.value;
  elements.terminalInput.value = "";
  executeTerminalCommand(value);
});

elements.saveWorkspace.addEventListener("click", saveSnapshot);
elements.downloadFile.addEventListener("click", downloadActiveFile);
elements.signOut.addEventListener("click", async () => {
  try {
    const auth = await ensureFirebaseAuth();
    await auth.signOut();
  } catch (error) {
    window.location.href = "home.html";
  }
});
elements.panelMenuToggle.addEventListener("click", () => {
  const willOpen = elements.panelMenu.hidden;
  elements.panelMenu.hidden = !willOpen;
  elements.panelMenuToggle.setAttribute("aria-expanded", String(willOpen));
});
elements.panelMenuItems.forEach((button) => {
  button.addEventListener("click", () => {
    if (button.dataset.menuToggle === "explorer") {
      state.explorerVisible = !state.explorerVisible;
    }

    if (button.dataset.menuToggle === "git") {
      state.gitVisible = !state.gitVisible;
    }

    if (button.dataset.menuToggle === "terminal") {
      state.terminalVisible = !state.terminalVisible;
    }

    elements.panelMenu.hidden = true;
    elements.panelMenuToggle.setAttribute("aria-expanded", "false");
    persistState();
    renderAll();
  });
});

window.addEventListener("message", handlePreviewMessages);

window.addEventListener("keydown", (event) => {
  const isModKey = event.metaKey || event.ctrlKey;

  if (isModKey && event.key.toLowerCase() === "s") {
    event.preventDefault();
    saveSnapshot();
  }

  if (isModKey && event.key.toLowerCase() === "p") {
    event.preventDefault();
    elements.fileSearch.focus();
  }

  if (event.key === "Escape" && !elements.modal.hidden) {
    elements.modal.hidden = true;
    elements.createForm.reset();
  }

  if (event.key === "Escape" && !elements.panelMenu.hidden) {
    elements.panelMenu.hidden = true;
    elements.panelMenuToggle.setAttribute("aria-expanded", "false");
  }
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".panel-menu-wrap")) {
    elements.panelMenu.hidden = true;
    elements.panelMenuToggle.setAttribute("aria-expanded", "false");
  }
});

ensureFirebaseAuth()
  .then((auth) => {
    auth.onAuthStateChanged((user) => {
      if (!applyAuthenticatedUser(user)) {
        return;
      }

      renderAll();
      checkShellBackend();
    });
  })
  .catch(() => {
    window.location.href = "home.html";
  });
