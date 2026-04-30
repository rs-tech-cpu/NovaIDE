const STORAGE_KEY = "novaide-workspace-v2";
const WORKSPACE_VERSION = 4;
const DEFAULT_BACKEND_PORT = 8765;
const APPROVED_ACCESS_KEY = "novaide-approved-email";
const SCRIPT_RUN_LIMIT = 5;
const SUPPORTED_CHAT_MODELS = ["gemini-2.5-flash-lite", "gemini-2.5-flash", "gemini-2.0-flash"];
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
  projectLoading: document.querySelector("[data-project-loading]"),
  projectLoadingTitle: document.querySelector("[data-project-loading-title]"),
  projectLoadingMessage: document.querySelector("[data-project-loading-message]"),
  workspaceName: document.querySelector("[data-workspace-name]"),
  tree: document.querySelector("[data-tree]"),
  treeCaption: document.querySelector("[data-tree-caption]"),
  totalFiles: document.querySelector("[data-total-files]"),
  dirtyFiles: document.querySelector("[data-dirty-files]"),
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
  editorSuggestions: document.querySelector("[data-editor-suggestions]"),
  editorSurface: document.querySelector("[data-editor-surface]"),
  previewFrame: document.querySelector("[data-preview-frame]"),
  previewResizer: document.querySelector("[data-preview-resizer]"),
  sidebarResizer: document.querySelector("[data-sidebar-resizer]"),
  previewTitle: document.querySelector("[data-preview-title]"),
  previewStatus: document.querySelector("[data-preview-status]"),
  chatStatus: document.querySelector("[data-chat-status]"),
  chatCount: document.querySelector("[data-chat-count]"),
  chatList: document.querySelector("[data-chat-list]"),
  chatInput: document.querySelector("[data-chat-input]"),
  chatModel: document.querySelector("[data-chat-model]"),
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
  runLimitModal: document.querySelector("[data-run-limit-modal]"),
  renameModal: document.querySelector("[data-rename-modal]"),
  extensionsModal: document.querySelector("[data-extensions-modal]"),
  githubModal: document.querySelector("[data-github-modal]"),
  slackModal: document.querySelector("[data-slack-modal]"),
  createForm: document.querySelector("[data-create-form]"),
  renameForm: document.querySelector("[data-rename-form]"),
  githubForm: document.querySelector("[data-github-form]"),
  slackForm: document.querySelector("[data-slack-form]"),
  renameInput: document.querySelector("[data-rename-input]"),
  githubRepoInput: document.querySelector("[data-github-repo-input]"),
  githubRefInput: document.querySelector("[data-github-ref-input]"),
  githubFolderInput: document.querySelector("[data-github-folder-input]"),
  githubStatus: document.querySelector("[data-github-status]"),
  slackTitleInput: document.querySelector("[data-slack-title-input]"),
  slackMessageInput: document.querySelector("[data-slack-message-input]"),
  slackStatus: document.querySelector("[data-slack-status]"),
  newFilePath: document.querySelector("[data-new-file-path]"),
  newFileTemplate: document.querySelector("[data-new-file-template]"),
  saveWorkspace: document.querySelector("[data-save-workspace]"),
  downloadFile: document.querySelector("[data-download-file]"),
  runActiveFile: document.querySelector("[data-run-active-file]"),
  runCount: document.querySelector("[data-run-count]"),
  createFolder: document.querySelector("[data-create-folder]"),
  duplicateItem: document.querySelector("[data-duplicate-item]"),
  deleteItem: document.querySelector("[data-delete-item]"),
  panelMenuToggle: document.querySelector("[data-panel-menu-toggle]"),
  panelMenu: document.querySelector("[data-panel-menu]"),
  panelMenuItems: document.querySelectorAll("[data-menu-toggle]"),
  exportProject: document.querySelector("[data-export-project]"),
  renameProject: document.querySelector("[data-rename-project]"),
  openExtensions: document.querySelector("[data-open-extensions]"),
  openGitHubImport: document.querySelector("[data-open-github-import]"),
  openSlackShare: document.querySelector("[data-open-slack-share]"),
  githubSubmit: document.querySelector("[data-github-submit]"),
  slackSubmit: document.querySelector("[data-slack-submit]"),
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

function normalizeChatModel(model) {
  const raw = String(model || "").trim();
  const normalized = raw.replace(/^openai\//i, "");

  if (SUPPORTED_CHAT_MODELS.includes(normalized)) {
    return normalized;
  }

  return "gemini-2.5-flash-lite";
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
    workspaceName: "frontend-studio",
    files,
    folders,
    openTabs: files.map((file) => file.path),
    activeFilePath: files[0].path,
    selectedItem: { type: "file", path: files[0].path },
    search: "",
    activity: "files",
    explorerVisible: true,
    gitVisible: true,
    previewVisible: true,
    terminalVisible: true,
    terminalHistory: [
      { type: "output", tone: "accent", text: "Browser workspace shell ready. Run `help` to see commands." },
    ],
    terminalCwd: "",
    chatMessages: [
      {
        role: "assistant",
        content: "I can answer questions about your workspace using the deployed Gemini assistant.",
      },
    ],
    openrouterModel: "gemini-2.5-flash-lite",
    previewWidth: 210,
    sidebarWidth: 330,
    scriptRunCount: 0,
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
      workspaceName: typeof parsed.workspaceName === "string" && parsed.workspaceName.trim()
        ? parsed.workspaceName.trim()
        : "frontend-studio",
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
      previewVisible: typeof parsed.previewVisible === "boolean" ? parsed.previewVisible : true,
      terminalVisible: typeof parsed.terminalVisible === "boolean" ? parsed.terminalVisible : true,
      terminalHistory: Array.isArray(parsed.terminalHistory) && parsed.terminalHistory.length
        ? parsed.terminalHistory.slice(-80)
        : createDefaultState().terminalHistory,
      terminalCwd: typeof parsed.terminalCwd === "string" ? parsed.terminalCwd : "",
      chatMessages: Array.isArray(parsed.chatMessages) && parsed.chatMessages.length
        ? parsed.chatMessages.slice(-12)
        : createDefaultState().chatMessages,
      openrouterModel: normalizeChatModel(parsed.openrouterModel),
      previewWidth: typeof parsed.previewWidth === "number" ? parsed.previewWidth : createDefaultState().previewWidth,
      sidebarWidth: typeof parsed.sidebarWidth === "number" ? parsed.sidebarWidth : createDefaultState().sidebarWidth,
      scriptRunCount: typeof parsed.scriptRunCount === "number" ? parsed.scriptRunCount : 0,
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
let previewResizeSession = null;
let sidebarResizeSession = null;
let terminalPendingAction = null;
let cloudSaveTimer = null;
let firestoreInstance = null;
let cloudSyncReady = false;
let draggedTreeFilePath = "";
let suggestionState = {
  items: [],
  activeIndex: 0,
  range: null,
};
let shellBackend = {
  available: false,
  baseUrl: "",
};
const EDITOR_INDENT = "  ";
const scriptLoaders = {};
let authInstance = null;

function showProjectLoading(title = "Loading your Nova project...", message = "Large projects may take a little longer to retrieve from your account.") {
  if (!elements.projectLoading) {
    return;
  }

  elements.projectLoading.hidden = false;

  if (elements.projectLoadingTitle) {
    elements.projectLoadingTitle.textContent = title;
  }

  if (elements.projectLoadingMessage) {
    elements.projectLoadingMessage.textContent = message;
  }
}

function hideProjectLoading() {
  if (!elements.projectLoading) {
    return;
  }

  elements.projectLoading.hidden = true;
}

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
  await loadExternalScript("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore-compat.js");

  if (!window.firebase) {
    throw new Error("Firebase failed to initialize.");
  }

  if (!firebase.apps.length) {
    firebase.initializeApp(FIREBASE_CONFIG);
  }

  authInstance = firebase.auth();
  firestoreInstance = firebase.firestore();
  return authInstance;
}

async function fetchEarlyAccessStatus(email) {
  const response = await fetch(`/api/check-access?email=${encodeURIComponent(email)}`, {
    cache: "no-store",
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `Access check failed with ${response.status}`);
  }

  return data;
}

function clearApprovedAccess() {
  window.sessionStorage.removeItem(APPROVED_ACCESS_KEY);
}

function rememberApprovedAccess(email) {
  window.sessionStorage.setItem(APPROVED_ACCESS_KEY, String(email || "").trim().toLowerCase());
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

function getSerializableState() {
  return {
    ...state,
    collapsedFolders: Array.from(new Set(state.collapsedFolders)),
    logs: state.logs.slice(0, 18),
  };
}

function getWorkspaceDocumentRef(user) {
  if (!firestoreInstance || !user?.uid) {
    return null;
  }

  return firestoreInstance.collection("novaideUsers").doc(user.uid).collection("workspaces").doc("primary");
}

async function saveWorkspaceToCloudNow() {
  if (!cloudSyncReady || !authInstance?.currentUser) {
    return;
  }

  const workspaceRef = getWorkspaceDocumentRef(authInstance.currentUser);

  if (!workspaceRef) {
    return;
  }

  await workspaceRef.set({
    workspace: getSerializableState(),
    email: authInstance.currentUser.email || "",
    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
  }, { merge: true });
}

function queueCloudWorkspaceSave() {
  if (!cloudSyncReady) {
    return;
  }

  window.clearTimeout(cloudSaveTimer);
  cloudSaveTimer = window.setTimeout(() => {
    saveWorkspaceToCloudNow().catch(() => {
      pushLog("Cloud sync failed. Local workspace is still saved on this device.", "warn");
    });
  }, 700);
}

async function syncWorkspaceFromCloud(user) {
  const workspaceRef = getWorkspaceDocumentRef(user);

  if (!workspaceRef) {
    cloudSyncReady = false;
    return;
  }

  const snapshot = await workspaceRef.get();
  const remoteWorkspace = snapshot.data()?.workspace;

  if (remoteWorkspace && typeof remoteWorkspace === "object") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(remoteWorkspace));
    state = loadState();
    pushLog("Workspace loaded from your account.", "info");
  } else {
    await workspaceRef.set({
      workspace: getSerializableState(),
      email: user.email || "",
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
    pushLog("Workspace backup created for this account.", "info");
  }

  cloudSyncReady = true;
}

function persistState() {
  const serializable = getSerializableState();

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(serializable));
  queueCloudWorkspaceSave();
}

function getRemainingScriptRuns() {
  return Math.max(0, SCRIPT_RUN_LIMIT - (state.scriptRunCount || 0));
}

function hasScriptRunQuota() {
  return getRemainingScriptRuns() > 0;
}

function consumeScriptRunQuota() {
  state.scriptRunCount = Math.min(SCRIPT_RUN_LIMIT, (state.scriptRunCount || 0) + 1);
}

function getScriptRunLimitMessage() {
  return `You have reached the ${SCRIPT_RUN_LIMIT}-run limit for Nova IDE script execution. The editor and AI assistant are still available.`;
}

function openRunLimitModal() {
  if (elements.runLimitModal) {
    elements.runLimitModal.hidden = false;
  }
}

function closeRunLimitModal() {
  if (elements.runLimitModal) {
    elements.runLimitModal.hidden = true;
  }
}

function clampPreviewWidth(width) {
  return Math.max(170, Math.min(520, Math.round(width)));
}

function applyPreviewWidth() {
  if (!elements.editorSurface) {
    return;
  }

  elements.editorSurface.style.setProperty("--preview-width", `${clampPreviewWidth(state.previewWidth || 210)}px`);
}

function clampSidebarWidth(width) {
  return Math.max(280, Math.min(520, Math.round(width)));
}

function applySidebarWidth() {
  document.documentElement.style.setProperty("--right-sidebar-width", `${clampSidebarWidth(state.sidebarWidth || 330)}px`);
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

  if (extension === "py") {
    return "python";
  }

  if (extension === "cpp" || extension === "cc" || extension === "cxx") {
    return "cpp";
  }

  if (extension === "cs") {
    return "csharp";
  }

  if (extension === "swift") {
    return "swift";
  }

  if (extension === "java") {
    return "java";
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

const EDITOR_SUGGESTIONS = {
  python: [
    { label: "print", detail: "Output text", insertText: "print" },
    { label: "pass", detail: "No-op statement", insertText: "pass" },
    { label: "pow", detail: "Power function", insertText: "pow" },
    { label: "property", detail: "Decorator", insertText: "property" },
    { label: "def", detail: "Function definition", insertText: "def " },
    { label: "class", detail: "Class definition", insertText: "class " },
    { label: "import", detail: "Import module", insertText: "import " },
    { label: "from", detail: "Import from module", insertText: "from " },
    { label: "if", detail: "Conditional statement", insertText: "if " },
    { label: "for", detail: "Loop statement", insertText: "for " },
    { label: "while", detail: "Loop statement", insertText: "while " },
    { label: "range", detail: "Sequence generator", insertText: "range" },
    { label: "len", detail: "Built-in function", insertText: "len" },
    { label: "str", detail: "String constructor", insertText: "str" },
    { label: "int", detail: "Integer constructor", insertText: "int" },
    { label: "list", detail: "List constructor", insertText: "list" },
    { label: "dict", detail: "Dictionary constructor", insertText: "dict" },
    { label: "enumerate", detail: "Indexed iteration", insertText: "enumerate" },
    { label: "append", detail: "List method", insertText: "append" },
    { label: "join", detail: "String method", insertText: "join" },
    { label: "__init__", detail: "Initializer method", insertText: "__init__" },
    { label: "open", detail: "File function", insertText: "open" },
    { label: "with", detail: "Context manager", insertText: "with " },
    { label: "except", detail: "Exception handler", insertText: "except " },
    { label: "format", detail: "String method", insertText: "format" },
  ],
  javascript: [
    { label: "console.log", detail: "Debug output", insertText: "console.log" },
    { label: "const", detail: "Constant binding", insertText: "const" },
    { label: "let", detail: "Mutable binding", insertText: "let" },
    { label: "if", detail: "Conditional statement", insertText: "if" },
    { label: "for", detail: "Loop statement", insertText: "for" },
    { label: "async", detail: "Async function", insertText: "async" },
    { label: "function", detail: "Function declaration", insertText: "function" },
    { label: "return", detail: "Return statement", insertText: "return" },
    { label: "document.querySelector", detail: "DOM lookup", insertText: "document.querySelector" },
    { label: "fetch", detail: "HTTP request", insertText: "fetch" },
    { label: "addEventListener", detail: "DOM event listener", insertText: "addEventListener" },
    { label: "setTimeout", detail: "Delayed callback", insertText: "setTimeout" },
    { label: "Promise", detail: "Async wrapper", insertText: "Promise" },
    { label: "map", detail: "Array transform", insertText: "map" },
    { label: "filter", detail: "Array filter", insertText: "filter" },
    { label: "import", detail: "Module import", insertText: "import " },
    { label: "forEach", detail: "Array iteration", insertText: "forEach" },
    { label: "querySelectorAll", detail: "DOM lookup list", insertText: "querySelectorAll" },
    { label: "JSON.parse", detail: "Parse JSON", insertText: "JSON.parse" },
    { label: "JSON.stringify", detail: "Serialize JSON", insertText: "JSON.stringify" },
  ],
  html: [
    { label: "<div>", detail: "Container element", insertText: "<div></div>" },
    { label: "<section>", detail: "Section element", insertText: "<section></section>" },
    { label: "<button>", detail: "Button element", insertText: "<button></button>" },
    { label: "<script>", detail: "Script tag", insertText: "<script></script>" },
    { label: "<input>", detail: "Input element", insertText: "<input />" },
    { label: "<form>", detail: "Form element", insertText: "<form></form>" },
    { label: "<main>", detail: "Main element", insertText: "<main></main>" },
    { label: "<article>", detail: "Article element", insertText: "<article></article>" },
    { label: "<header>", detail: "Header element", insertText: "<header></header>" },
    { label: "<footer>", detail: "Footer element", insertText: "<footer></footer>" },
    { label: "<nav>", detail: "Navigation element", insertText: "<nav></nav>" },
    { label: "<img>", detail: "Image element", insertText: "<img src=\"\" alt=\"\" />" },
    { label: "<a>", detail: "Link element", insertText: "<a href=\"\"></a>" },
    { label: "<span>", detail: "Inline element", insertText: "<span></span>" },
    { label: "<ul>", detail: "Unordered list", insertText: "<ul></ul>" },
    { label: "<li>", detail: "List item", insertText: "<li></li>" },
    { label: "<label>", detail: "Form label", insertText: "<label></label>" },
  ],
  css: [
    { label: "display", detail: "Layout property", insertText: "display" },
    { label: "position", detail: "Position property", insertText: "position" },
    { label: "background", detail: "Background property", insertText: "background" },
    { label: "color", detail: "Text color", insertText: "color" },
    { label: "justify-content", detail: "Flex alignment", insertText: "justify-content" },
    { label: "align-items", detail: "Cross-axis alignment", insertText: "align-items" },
    { label: "grid-template-columns", detail: "Grid columns", insertText: "grid-template-columns" },
    { label: "border-radius", detail: "Rounded corners", insertText: "border-radius" },
    { label: "padding", detail: "Inner spacing", insertText: "padding" },
    { label: "margin", detail: "Outer spacing", insertText: "margin" },
    { label: "font-size", detail: "Text size", insertText: "font-size" },
    { label: "box-shadow", detail: "Shadow effect", insertText: "box-shadow" },
    { label: "@import", detail: "Stylesheet import", insertText: "@import " },
    { label: "gap", detail: "Flex or grid gap", insertText: "gap" },
    { label: "transition", detail: "Animation timing", insertText: "transition" },
    { label: "width", detail: "Width property", insertText: "width" },
    { label: "height", detail: "Height property", insertText: "height" },
  ],
  cpp: [
    { label: "std::cout", detail: "Standard output", insertText: "std::cout" },
    { label: "std::cin", detail: "Standard input", insertText: "std::cin" },
    { label: "std::string", detail: "String type", insertText: "std::string" },
    { label: "int", detail: "Integer type", insertText: "int" },
    { label: "double", detail: "Double type", insertText: "double" },
    { label: "for", detail: "Loop statement", insertText: "for" },
    { label: "if", detail: "Conditional statement", insertText: "if" },
    { label: "return", detail: "Return statement", insertText: "return" },
    { label: "std::vector", detail: "Dynamic array", insertText: "std::vector" },
    { label: "std::map", detail: "Associative map", insertText: "std::map" },
    { label: "#include", detail: "Header import", insertText: "#include " },
    { label: "while", detail: "Loop statement", insertText: "while" },
    { label: "class", detail: "Class declaration", insertText: "class " },
    { label: "std::endl", detail: "Line break manipulator", insertText: "std::endl" },
    { label: "auto", detail: "Type inference", insertText: "auto" },
    { label: "bool", detail: "Boolean type", insertText: "bool" },
    { label: "std::unordered_map", detail: "Hash map", insertText: "std::unordered_map" },
  ],
  csharp: [
    { label: "Console.WriteLine", detail: "Console output", insertText: "Console.WriteLine" },
    { label: "string", detail: "String type", insertText: "string" },
    { label: "int", detail: "Integer type", insertText: "int" },
    { label: "var", detail: "Implicit type", insertText: "var" },
    { label: "public", detail: "Access modifier", insertText: "public" },
    { label: "private", detail: "Access modifier", insertText: "private" },
    { label: "if", detail: "Conditional statement", insertText: "if" },
    { label: "foreach", detail: "Collection loop", insertText: "foreach" },
    { label: "using", detail: "Namespace import", insertText: "using " },
    { label: "List", detail: "Generic list", insertText: "List" },
    { label: "Task", detail: "Async task", insertText: "Task" },
    { label: "async", detail: "Async modifier", insertText: "async" },
    { label: "await", detail: "Await expression", insertText: "await" },
    { label: "namespace", detail: "Namespace declaration", insertText: "namespace " },
    { label: "DateTime", detail: "Date and time type", insertText: "DateTime" },
    { label: "ToString", detail: "Object string conversion", insertText: "ToString" },
    { label: "Count", detail: "Collection size property", insertText: "Count" },
  ],
  swift: [
    { label: "print", detail: "Console output", insertText: "print" },
    { label: "let", detail: "Constant binding", insertText: "let" },
    { label: "var", detail: "Mutable binding", insertText: "var" },
    { label: "func", detail: "Function declaration", insertText: "func" },
    { label: "struct", detail: "Structure declaration", insertText: "struct" },
    { label: "class", detail: "Class declaration", insertText: "class" },
    { label: "if", detail: "Conditional statement", insertText: "if" },
    { label: "for", detail: "Loop statement", insertText: "for" },
    { label: "import", detail: "Module import", insertText: "import " },
    { label: "guard", detail: "Early exit condition", insertText: "guard " },
    { label: "return", detail: "Return statement", insertText: "return" },
    { label: "init", detail: "Initializer", insertText: "init" },
    { label: "extension", detail: "Type extension", insertText: "extension " },
    { label: "nil", detail: "Empty optional value", insertText: "nil" },
    { label: "Optional", detail: "Optional type", insertText: "Optional" },
    { label: "guard let", detail: "Optional binding", insertText: "guard let " },
    { label: "DispatchQueue.main.async", detail: "Main thread dispatch", insertText: "DispatchQueue.main.async" },
  ],
  java: [
    { label: "System.out.println", detail: "Console output", insertText: "System.out.println" },
    { label: "String", detail: "String type", insertText: "String" },
    { label: "int", detail: "Integer type", insertText: "int" },
    { label: "double", detail: "Double type", insertText: "double" },
    { label: "public", detail: "Access modifier", insertText: "public" },
    { label: "private", detail: "Access modifier", insertText: "private" },
    { label: "class", detail: "Class declaration", insertText: "class" },
    { label: "return", detail: "Return statement", insertText: "return" },
    { label: "import", detail: "Package import", insertText: "import " },
    { label: "List", detail: "Collection interface", insertText: "List" },
    { label: "ArrayList", detail: "Resizable list", insertText: "ArrayList" },
    { label: "Scanner", detail: "Input reader", insertText: "Scanner" },
    { label: "static", detail: "Static modifier", insertText: "static" },
    { label: "HashMap", detail: "Key-value map", insertText: "HashMap" },
    { label: "forEach", detail: "Collection iteration", insertText: "forEach" },
    { label: "new", detail: "Object creation", insertText: "new" },
    { label: "extends", detail: "Class inheritance", insertText: "extends" },
  ],
};

const EDITOR_IMPORT_SUGGESTIONS = {
  python: [
    { label: "os", detail: "Module", insertText: "os" },
    { label: "sys", detail: "Module", insertText: "sys" },
    { label: "math", detail: "Module", insertText: "math" },
    { label: "json", detail: "Module", insertText: "json" },
    { label: "random", detail: "Module", insertText: "random" },
    { label: "datetime", detail: "Module", insertText: "datetime" },
    { label: "pathlib", detail: "Module", insertText: "pathlib" },
    { label: "collections", detail: "Module", insertText: "collections" },
    { label: "itertools", detail: "Module", insertText: "itertools" },
    { label: "asyncio", detail: "Module", insertText: "asyncio" },
    { label: "re", detail: "Module", insertText: "re" },
    { label: "typing", detail: "Module", insertText: "typing" },
  ],
  javascript: [
    { label: "react", detail: "Package", insertText: "react" },
    { label: "express", detail: "Package", insertText: "express" },
    { label: "axios", detail: "Package", insertText: "axios" },
    { label: "lodash", detail: "Package", insertText: "lodash" },
    { label: "fs", detail: "Node module", insertText: "fs" },
    { label: "path", detail: "Node module", insertText: "path" },
    { label: "http", detail: "Node module", insertText: "http" },
    { label: "https", detail: "Node module", insertText: "https" },
    { label: "url", detail: "Node module", insertText: "url" },
    { label: "events", detail: "Node module", insertText: "events" },
    { label: "crypto", detail: "Node module", insertText: "crypto" },
    { label: "stream", detail: "Node module", insertText: "stream" },
  ],
  css: [
    { label: "reset.css", detail: "Stylesheet", insertText: "reset.css" },
    { label: "theme.css", detail: "Stylesheet", insertText: "theme.css" },
    { label: "fonts.css", detail: "Stylesheet", insertText: "fonts.css" },
    { label: "base.css", detail: "Stylesheet", insertText: "base.css" },
  ],
  cpp: [
    { label: "iostream", detail: "Header", insertText: "iostream" },
    { label: "vector", detail: "Header", insertText: "vector" },
    { label: "string", detail: "Header", insertText: "string" },
    { label: "map", detail: "Header", insertText: "map" },
    { label: "unordered_map", detail: "Header", insertText: "unordered_map" },
    { label: "memory", detail: "Header", insertText: "memory" },
    { label: "algorithm", detail: "Header", insertText: "algorithm" },
    { label: "fstream", detail: "Header", insertText: "fstream" },
    { label: "sstream", detail: "Header", insertText: "sstream" },
    { label: "iomanip", detail: "Header", insertText: "iomanip" },
    { label: "set", detail: "Header", insertText: "set" },
    { label: "utility", detail: "Header", insertText: "utility" },
  ],
  csharp: [
    { label: "System", detail: "Namespace", insertText: "System" },
    { label: "System.IO", detail: "Namespace", insertText: "System.IO" },
    { label: "System.Linq", detail: "Namespace", insertText: "System.Linq" },
    { label: "System.Text", detail: "Namespace", insertText: "System.Text" },
    { label: "System.Net.Http", detail: "Namespace", insertText: "System.Net.Http" },
    { label: "System.Threading.Tasks", detail: "Namespace", insertText: "System.Threading.Tasks" },
    { label: "System.Collections.Generic", detail: "Namespace", insertText: "System.Collections.Generic" },
    { label: "Microsoft.AspNetCore.Mvc", detail: "Namespace", insertText: "Microsoft.AspNetCore.Mvc" },
    { label: "System.Text.Json", detail: "Namespace", insertText: "System.Text.Json" },
    { label: "System.Collections", detail: "Namespace", insertText: "System.Collections" },
  ],
  swift: [
    { label: "Foundation", detail: "Module", insertText: "Foundation" },
    { label: "SwiftUI", detail: "Module", insertText: "SwiftUI" },
    { label: "UIKit", detail: "Module", insertText: "UIKit" },
    { label: "Combine", detail: "Module", insertText: "Combine" },
    { label: "CoreData", detail: "Module", insertText: "CoreData" },
    { label: "AVFoundation", detail: "Module", insertText: "AVFoundation" },
    { label: "MapKit", detail: "Module", insertText: "MapKit" },
    { label: "CoreGraphics", detail: "Module", insertText: "CoreGraphics" },
    { label: "PhotosUI", detail: "Module", insertText: "PhotosUI" },
  ],
  java: [
    { label: "java.util.List", detail: "Package", insertText: "java.util.List" },
    { label: "java.util.ArrayList", detail: "Package", insertText: "java.util.ArrayList" },
    { label: "java.util.Map", detail: "Package", insertText: "java.util.Map" },
    { label: "java.util.HashMap", detail: "Package", insertText: "java.util.HashMap" },
    { label: "java.util.Scanner", detail: "Package", insertText: "java.util.Scanner" },
    { label: "java.time.LocalDate", detail: "Package", insertText: "java.time.LocalDate" },
    { label: "java.nio.file.Files", detail: "Package", insertText: "java.nio.file.Files" },
    { label: "java.nio.file.Paths", detail: "Package", insertText: "java.nio.file.Paths" },
    { label: "java.util.Collections", detail: "Package", insertText: "java.util.Collections" },
    { label: "java.util.Optional", detail: "Package", insertText: "java.util.Optional" },
  ],
};

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
    python: "Python",
    cpp: "C++",
    csharp: "C#",
    swift: "Swift",
    java: "Java",
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
    python: "tree-file__icon--python",
    cpp: "tree-file__icon--cpp",
    csharp: "tree-file__icon--csharp",
    swift: "tree-file__icon--swift",
    java: "tree-file__icon--java",
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

  if (language === "python") {
    return highlightPython(content);
  }

  if (language === "cpp") {
    return highlightCpp(content);
  }

  if (language === "csharp") {
    return highlightCSharp(content);
  }

  if (language === "swift") {
    return highlightSwift(content);
  }

  if (language === "java") {
    return highlightJava(content);
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

function highlightPython(content) {
  const escaped = escapeHtml(content);

  return tokenizePatterns(escaped, [
    { regex: /#[^\n]*/g, className: "token-comment" },
    { regex: /"""[\s\S]*?"""|'''[\s\S]*?'''|"[^"\n]*"|'[^'\n]*'/g, className: "token-string" },
    { regex: /\b(def|class|return|if|elif|else|for|while|try|except|finally|with|as|import|from|pass|break|continue|lambda|yield|async|await|in|is|and|or|not|None|True|False)\b/g, className: "token-keyword" },
    { regex: /\b(\d+(?:\.\d+)?)\b/g, className: "token-number" },
    { regex: /\b([A-Za-z_][\w]*)(?=\()/g, className: "token-function" },
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

function highlightCpp(content) {
  const escaped = escapeHtml(content);

  return tokenizePatterns(escaped, [
    { regex: /\/\*[\s\S]*?\*\/|\/\/.*/g, className: "token-comment" },
    { regex: /"([^"\\]|\\.)*"|'([^'\\]|\\.)*'/g, className: "token-string" },
    { regex: /#[A-Za-z_]\w*/g, className: "token-atrule" },
    { regex: /\b(class|struct|namespace|template|typename|using|return|if|else|for|while|switch|case|break|continue|public|private|protected|virtual|const|auto|void|int|double|float|char|bool|long|short|unsigned|signed|new|delete|try|catch|throw|nullptr|include|std)\b/g, className: "token-keyword" },
    { regex: /\b(\d+(?:\.\d+)?)\b/g, className: "token-number" },
    { regex: /\b([A-Za-z_][\w:]*)(?=\()/g, className: "token-function" },
  ]);
}

function highlightCSharp(content) {
  const escaped = escapeHtml(content);

  return tokenizePatterns(escaped, [
    { regex: /\/\*[\s\S]*?\*\/|\/\/.*/g, className: "token-comment" },
    { regex: /@"[\s\S]*?"|"([^"\\]|\\.)*"|'([^'\\]|\\.)*'/g, className: "token-string" },
    { regex: /\b(namespace|using|class|struct|interface|enum|public|private|protected|internal|static|void|string|int|double|float|decimal|bool|var|new|return|if|else|for|foreach|while|switch|case|break|continue|try|catch|finally|throw|null|true|false|async|await)\b/g, className: "token-keyword" },
    { regex: /\b(\d+(?:\.\d+)?)\b/g, className: "token-number" },
    { regex: /\b([A-Za-z_]\w*)(?=\()/g, className: "token-function" },
  ]);
}

function highlightSwift(content) {
  const escaped = escapeHtml(content);

  return tokenizePatterns(escaped, [
    { regex: /\/\*[\s\S]*?\*\/|\/\/.*/g, className: "token-comment" },
    { regex: /#?"([^"\\]|\\.)*"|'([^'\\]|\\.)*'/g, className: "token-string" },
    { regex: /\b(import|class|struct|enum|protocol|extension|func|let|var|if|else|guard|for|while|switch|case|break|continue|return|throw|throws|do|catch|try|nil|true|false)\b/g, className: "token-keyword" },
    { regex: /\b(\d+(?:\.\d+)?)\b/g, className: "token-number" },
    { regex: /\b([A-Za-z_]\w*)(?=\()/g, className: "token-function" },
  ]);
}

function highlightJava(content) {
  const escaped = escapeHtml(content);

  return tokenizePatterns(escaped, [
    { regex: /\/\*[\s\S]*?\*\/|\/\/.*/g, className: "token-comment" },
    { regex: /"([^"\\]|\\.)*"|'([^'\\]|\\.)*'/g, className: "token-string" },
    { regex: /\b(package|import|class|interface|enum|public|private|protected|static|final|void|String|int|double|float|boolean|new|return|if|else|for|while|switch|case|break|continue|try|catch|finally|throw|null|true|false)\b/g, className: "token-keyword" },
    { regex: /\b(\d+(?:\.\d+)?)\b/g, className: "token-number" },
    { regex: /\b([A-Za-z_]\w*)(?=\()/g, className: "token-function" },
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
    <button class="tree-file ${file.path === state.activeFilePath ? "tree-file--active" : ""} ${selectedItem.type === "file" && selectedItem.path === file.path ? "is-selected" : ""}" type="button" data-file-path="${file.path}" draggable="true">
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

  elements.totalFiles.textContent = String(state.files.length);
  elements.dirtyFiles.textContent = String(changedCount);
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
    hideEditorSuggestions();
    elements.editorInput.value = "";
    elements.highlightCode.innerHTML = "";
    elements.lineNumbers.innerHTML = '<span>01</span>';
    elements.currentFolder.textContent = "workspace";
    elements.currentFile.textContent = "No file selected";
    elements.currentLanguage.textContent = "Text";
    elements.charCount.textContent = "0 chars";
    elements.runActiveFile.disabled = true;
    elements.runActiveFile.hidden = false;
    elements.runActiveFile.textContent = "Run Active File";
    elements.runActiveFile.setAttribute("aria-label", "Run active file");
    elements.runCount.textContent = `${Math.min(state.scriptRunCount || 0, SCRIPT_RUN_LIMIT)}/${SCRIPT_RUN_LIMIT}`;
    elements.debugFile.textContent = "No file selected";
    elements.debugLanguage.textContent = "Text";
    return;
  }

  if (elements.editorInput.value !== file.content) {
    elements.editorInput.value = file.content;
  }

  if (!EDITOR_SUGGESTIONS[file.language]) {
    hideEditorSuggestions();
  }

  elements.highlightCode.innerHTML = `${highlightCode(file.content, file.language)}\n`;

  const lineCount = Math.max(file.content.split("\n").length, 1);
  elements.lineNumbers.innerHTML = Array.from({ length: lineCount }, (_, index) => `<span>${String(index + 1).padStart(2, "0")}</span>`).join("");

  elements.currentFolder.textContent = getFolderPath(file.path);
  elements.currentFile.textContent = getFileName(file.path);
  elements.currentLanguage.textContent = getLanguageLabel(file.language);
  elements.charCount.textContent = `${file.content.length} chars`;
  const canRunLanguage = isOneCompilerRunnable(file.language);
  const hasRunQuota = hasScriptRunQuota();
  elements.runCount.textContent = `${Math.min(state.scriptRunCount || 0, SCRIPT_RUN_LIMIT)}/${SCRIPT_RUN_LIMIT}`;
  elements.runActiveFile.hidden = canRunLanguage && !hasRunQuota;
  elements.runActiveFile.disabled = !canRunLanguage || !hasRunQuota;
  elements.runActiveFile.textContent = canRunLanguage
    ? `Run ${getLanguageLabel(file.language)}`
    : "Run Active File";
  elements.runActiveFile.setAttribute(
    "aria-label",
    canRunLanguage && hasRunQuota
      ? `Run ${getLanguageLabel(file.language)}`
      : canRunLanguage
        ? getScriptRunLimitMessage()
        : "Run active file"
  );
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
  elements.chatStatus.textContent = elements.chatSend.disabled ? "Thinking" : "Ready";
  elements.chatModel.value = normalizeChatModel(state.openrouterModel);

  elements.chatList.innerHTML = messages.map((message) => `
    <article class="chat-message ${message.role === "assistant" ? "chat-message--assistant" : ""}">
      <p class="chat-message__role">${message.role}</p>
      <div class="chat-message__body">${renderChatMessageBody(message.content)}</div>
    </article>
  `).join("");
}

function renderChatMessageBody(content) {
  const segments = String(content || "").split(/```([\w#+.-]*)\n?([\s\S]*?)```/g);

  if (segments.length === 1) {
    return `<p>${escapeHtml(content)}</p>`;
  }

  const rendered = [];

  for (let index = 0; index < segments.length; index += 1) {
    if (index % 3 === 0) {
      const text = segments[index];
      if (text.trim()) {
        rendered.push(`<p>${escapeHtml(text)}</p>`);
      }
      continue;
    }

    const language = segments[index];
    const code = segments[index + 1] || "";
    rendered.push(`
      <section class="chat-code-block">
        <div class="chat-code-block__header">
          <span>${escapeHtml(language || "code")}</span>
          <button class="chat-code-block__copy" type="button" data-copy-code>Copy</button>
        </div>
        <pre class="chat-code-block__body"><code>${escapeHtml(code.trim())}</code></pre>
      </section>
    `);
    index += 1;
  }

  return rendered.join("");
}

function hideEditorSuggestions() {
  suggestionState.items = [];
  suggestionState.activeIndex = 0;
  suggestionState.range = null;
  elements.editorSuggestions.hidden = true;
  elements.editorSuggestions.innerHTML = "";
}

function getEditorCaretPosition() {
  const textarea = elements.editorInput;
  const stage = textarea.parentElement;

  if (!textarea || !stage) {
    return { left: 16, top: 16 };
  }

  const mirror = document.createElement("div");
  const computed = window.getComputedStyle(textarea);
  const properties = [
    "fontFamily",
    "fontSize",
    "fontWeight",
    "fontStyle",
    "letterSpacing",
    "textTransform",
    "wordSpacing",
    "textIndent",
    "boxSizing",
    "borderLeftWidth",
    "borderRightWidth",
    "borderTopWidth",
    "borderBottomWidth",
    "paddingLeft",
    "paddingRight",
    "paddingTop",
    "paddingBottom",
    "lineHeight",
    "whiteSpace",
    "tabSize",
    "width",
  ];

  mirror.style.position = "absolute";
  mirror.style.visibility = "hidden";
  mirror.style.pointerEvents = "none";
  mirror.style.whiteSpace = "pre-wrap";
  mirror.style.wordWrap = "break-word";
  mirror.style.overflow = "hidden";

  properties.forEach((property) => {
    mirror.style[property] = computed[property];
  });

  mirror.textContent = textarea.value.slice(0, textarea.selectionStart);
  const marker = document.createElement("span");
  marker.textContent = "\u200b";
  mirror.appendChild(marker);
  stage.appendChild(mirror);

  const left = marker.offsetLeft - textarea.scrollLeft;
  const top = marker.offsetTop - textarea.scrollTop;
  const height = marker.offsetHeight || parseFloat(computed.lineHeight) || 18;

  stage.removeChild(mirror);

  return { left, top: top + height };
}

function setEditorValue(nextValue, selectionStart, selectionEnd = selectionStart) {
  elements.editorInput.value = nextValue;
  elements.editorInput.selectionStart = selectionStart;
  elements.editorInput.selectionEnd = selectionEnd;
  elements.editorInput.dispatchEvent(new Event("input"));
}

function getCurrentLineBeforeCursor(value, cursor) {
  const lineStart = value.lastIndexOf("\n", Math.max(0, cursor - 1)) + 1;
  return value.slice(lineStart, cursor);
}

function getLineIndentation(line) {
  return (line.match(/^\s*/) || [""])[0];
}

function shouldIncreaseIndent(language, lineBeforeCursor) {
  const trimmed = lineBeforeCursor.trimEnd();

  if (!trimmed) {
    return false;
  }

  if (language === "python") {
    return trimmed.endsWith(":");
  }

  if (["javascript", "csharp", "java", "cpp", "swift"].includes(language)) {
    return /[\{\[\(]$/.test(trimmed);
  }

  return false;
}

function handleEditorPairInsertion(event) {
  const pairs = {
    "(": ")",
    "[": "]",
    "{": "}",
    "\"": "\"",
    "'": "'",
  };
  const closingChars = new Set(Object.values(pairs));
  const opener = event.key;
  const closer = pairs[opener];

  if (!closer || event.ctrlKey || event.metaKey || event.altKey) {
    return false;
  }

  const textarea = elements.editorInput;
  const value = textarea.value;
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selectedText = value.slice(start, end);
  const nextChar = value[end] || "";
  const prevChar = value[start - 1] || "";
  const isQuote = opener === "\"" || opener === "'";

  if (isQuote && /[A-Za-z0-9_]/.test(prevChar)) {
    return false;
  }

  event.preventDefault();

  if (selectedText) {
    setEditorValue(
      `${value.slice(0, start)}${opener}${selectedText}${closer}${value.slice(end)}`,
      start + 1,
      end + 1
    );
    return true;
  }

  if (isQuote && nextChar === closer) {
    setEditorValue(value, start + 1);
    return true;
  }

  if (!isQuote && closingChars.has(nextChar) && nextChar === closer) {
    setEditorValue(value, start + 1);
    return true;
  }

  setEditorValue(
    `${value.slice(0, start)}${opener}${closer}${value.slice(end)}`,
    start + 1
  );
  return true;
}

function handleEditorNewline(event, language) {
  if (event.ctrlKey || event.metaKey || event.altKey) {
    return false;
  }

  const textarea = elements.editorInput;
  const value = textarea.value;
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const lineBeforeCursor = getCurrentLineBeforeCursor(value, start);
  const baseIndent = getLineIndentation(lineBeforeCursor);
  const shouldIndentMore = shouldIncreaseIndent(language, lineBeforeCursor);
  const nextChar = value[end] || "";
  const innerIndent = `${baseIndent}${shouldIndentMore ? EDITOR_INDENT : ""}`;
  const shouldCreateClosingLine = ["}", "]", ")"].includes(nextChar)
    && ["javascript", "csharp", "java", "cpp", "swift"].includes(language);

  event.preventDefault();

  if (shouldCreateClosingLine) {
    const insertion = `\n${innerIndent}\n${baseIndent}`;
    const cursorPosition = start + 1 + innerIndent.length;
    setEditorValue(
      `${value.slice(0, start)}${insertion}${value.slice(end)}`,
      cursorPosition
    );
    return true;
  }

  const insertion = `\n${innerIndent}`;
  const cursorPosition = start + insertion.length;
  setEditorValue(
    `${value.slice(0, start)}${insertion}${value.slice(end)}`,
    cursorPosition
  );
  return true;
}

function renderEditorSuggestions() {
  if (!suggestionState.items.length) {
    hideEditorSuggestions();
    return;
  }

  const caret = getEditorCaretPosition();
  elements.editorSuggestions.hidden = false;
  elements.editorSuggestions.style.left = `${Math.max(8, caret.left + 8)}px`;
  elements.editorSuggestions.style.top = `${Math.max(8, caret.top + 8)}px`;
  elements.editorSuggestions.innerHTML = suggestionState.items.map((item, index) => `
    <button
      class="editor-suggestions__item ${index === suggestionState.activeIndex ? "is-active" : ""}"
      type="button"
      data-suggestion-index="${index}"
    >
      <span class="editor-suggestions__label">${escapeHtml(item.label)}</span>
      <span class="editor-suggestions__detail">${escapeHtml(item.detail)}</span>
    </button>
  `).join("");
}

function extractVariableSuggestions(file) {
  if (!file?.content) {
    return [];
  }

  const patternsByLanguage = {
    python: [
      /^\s*([A-Za-z_]\w*)\s*=(?!=)/gm,
    ],
    javascript: [
      /\b(?:const|let|var)\s+([A-Za-z_$]\w*)/g,
      /^\s*([A-Za-z_$]\w*)\s*=(?!=)/gm,
    ],
    html: [],
    css: [
      /--([A-Za-z_-][\w-]*)\s*:/g,
    ],
    cpp: [
      /\b(?:int|float|double|char|bool|auto|std::string|long|short|size_t|std::vector<[^>]+>)\s+([A-Za-z_]\w*)/g,
      /\bfor\s*\([^;]*\b([A-Za-z_]\w*)\s*=/g,
    ],
    csharp: [
      /\b(?:string|int|double|float|bool|var|decimal|long|List<[^>]+>|IEnumerable<[^>]+>)\s+([A-Za-z_]\w*)/g,
      /\bforeach\s*\(\s*[^)]*\s+([A-Za-z_]\w*)\s+in\b/g,
    ],
    swift: [
      /\b(?:let|var)\s+([A-Za-z_]\w*)/g,
    ],
    java: [
      /\b(?:String|int|double|float|boolean|var|long|List<[^>]+>|ArrayList<[^>]+>)\s+([A-Za-z_]\w*)/g,
      /\bfor\s*\([^;]*\b([A-Za-z_]\w*)\s*=/g,
    ],
  };

  const patterns = patternsByLanguage[file.language] || [];
  const seen = new Set();
  const variables = [];

  patterns.forEach((pattern) => {
    for (const match of file.content.matchAll(pattern)) {
      const rawName = match[1];
      const label = file.language === "css" ? `--${rawName}` : rawName;

      if (!label || seen.has(label)) {
        continue;
      }

      seen.add(label);
      variables.push({
        label,
        detail: "Variable from file",
        insertText: label,
      });
    }
  });

  return variables;
}

function dedupeSuggestions(items) {
  return items.filter((item, index, suggestions) => (
    suggestions.findIndex((candidate) => candidate.label.toLowerCase() === item.label.toLowerCase()) === index
  ));
}

function hasExactSuggestionMatch(query, suggestions) {
  const normalizedQuery = String(query || "").trim().toLowerCase();

  if (!normalizedQuery) {
    return false;
  }

  return suggestions.some((item) => item.label.trim().toLowerCase() === normalizedQuery);
}

function getWorkspaceImportSuggestions(file) {
  if (!file) {
    return [];
  }

  if (file.language === "python") {
    return dedupeSuggestions(state.files
      .filter((candidate) => candidate.path !== file.path && candidate.language === "python")
      .map((candidate) => candidate.path.replace(/\.py$/i, "").replace(/\//g, "."))
      .filter(Boolean)
      .map((label) => ({
        label,
        detail: "Workspace module",
        insertText: label,
      })));
  }

  if (file.language === "javascript") {
    return dedupeSuggestions(state.files
      .filter((candidate) => candidate.path !== file.path && candidate.language === "javascript")
      .map((candidate) => ({
        label: `./${candidate.path}`,
        detail: "Workspace module",
        insertText: `./${candidate.path}`,
      })));
  }

  if (file.language === "css") {
    return dedupeSuggestions(state.files
      .filter((candidate) => candidate.path !== file.path && candidate.language === "css")
      .map((candidate) => ({
        label: candidate.path,
        detail: "Workspace stylesheet",
        insertText: candidate.path,
      })));
  }

  return [];
}

function getImportSuggestionContext(file, value, cursor) {
  if (!file) {
    return null;
  }

  const lineStart = value.lastIndexOf("\n", Math.max(0, cursor - 1)) + 1;
  const lineBeforeCursor = value.slice(lineStart, cursor);
  const matchersByLanguage = {
    python: [
      /^\s*import\s+([A-Za-z0-9_\.]*)$/,
      /^\s*from\s+([A-Za-z0-9_\.]*)$/,
    ],
    javascript: [
      /^\s*import\s+["']?([@A-Za-z0-9_./-]*)$/,
      /^\s*import[\s\S]*?\sfrom\s+["']([@A-Za-z0-9_./-]*)$/,
      /\brequire\(\s*["']([@A-Za-z0-9_./-]*)$/,
      /^\s*export[\s\S]*?\sfrom\s+["']([@A-Za-z0-9_./-]*)$/,
    ],
    css: [
      /^\s*@import\s+(?:url\()?["']?([@A-Za-z0-9_./-]*)$/,
    ],
    cpp: [
      /^\s*#include\s+[<"]([A-Za-z0-9_./-]*)$/,
    ],
    csharp: [
      /^\s*using\s+([A-Za-z0-9_\.]*)$/,
    ],
    swift: [
      /^\s*import\s+([A-Za-z0-9_\.]*)$/,
    ],
    java: [
      /^\s*import\s+([A-Za-z0-9_\.\*]*)$/,
    ],
  };

  const matchers = matchersByLanguage[file.language] || [];

  for (const matcher of matchers) {
    const match = lineBeforeCursor.match(matcher);

    if (!match) {
      continue;
    }

    const query = match[1] || "";
    const suggestions = dedupeSuggestions([
      ...(EDITOR_IMPORT_SUGGESTIONS[file.language] || []),
      ...getWorkspaceImportSuggestions(file),
    ]);

    if (hasExactSuggestionMatch(query, suggestions)) {
      return null;
    }

    const items = suggestions
      .filter((item) => item.label.toLowerCase().startsWith(query.toLowerCase()))
      .slice(0, 10);

    if (!items.length) {
      return null;
    }

    return {
      items,
      range: {
        start: cursor - query.length,
        end: cursor,
      },
    };
  }

  return null;
}

function getEditorSuggestionContext() {
  const file = getActiveFile();
  if (!file) {
    return null;
  }

  const value = elements.editorInput.value;
  const cursor = elements.editorInput.selectionStart || 0;
  const importContext = getImportSuggestionContext(file, value, cursor);

  if (importContext) {
    return importContext;
  }

  const suggestions = dedupeSuggestions([
    ...(EDITOR_SUGGESTIONS[file.language] || []),
    ...extractVariableSuggestions(file),
  ]);
  const prefixMatch = value.slice(0, cursor).match(/[\w<./-]+$/);
  const query = prefixMatch?.[0] || "";

  if (!query || query.length < 1) {
    return null;
  }

  if (hasExactSuggestionMatch(query, suggestions)) {
    return null;
  }

  const start = cursor - query.length;
  const matches = suggestions.filter((item) => item.label.toLowerCase().startsWith(query.toLowerCase()))
    .slice(0, 8);

  if (!matches.length) {
    return null;
  }

  return {
    items: matches,
    range: { start, end: cursor },
  };
}

function updateEditorSuggestions() {
  const context = getEditorSuggestionContext();

  if (!context) {
    hideEditorSuggestions();
    return;
  }

  suggestionState.items = context.items;
  suggestionState.range = context.range;
  suggestionState.activeIndex = Math.min(suggestionState.activeIndex, context.items.length - 1);
  renderEditorSuggestions();
}

function applyEditorSuggestion(index = suggestionState.activeIndex) {
  const suggestion = suggestionState.items[index];
  const range = suggestionState.range;

  if (!suggestion || !range) {
    return false;
  }

  const value = elements.editorInput.value;
  const nextValue = `${value.slice(0, range.start)}${suggestion.insertText}${value.slice(range.end)}`;
  const nextCursor = range.start + suggestion.insertText.length;

  elements.editorInput.value = nextValue;
  elements.editorInput.selectionStart = nextCursor;
  elements.editorInput.selectionEnd = nextCursor;
  hideEditorSuggestions();
  elements.editorInput.dispatchEvent(new Event("input"));
  return true;
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
    pushTerminalLine("Data Restored Successfully", "muted");
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

function getOneCompilerRuntimeForLanguage(language) {
  const runtimes = {
    python: {
      command: "python",
      label: "Python",
      apiLanguage: "python",
    },
    cpp: {
      command: "cpp",
      label: "C++",
      apiLanguage: "cpp",
    },
    csharp: {
      command: "csharp",
      label: "C#",
      apiLanguage: "csharp",
    },
    swift: {
      command: "swift",
      label: "Swift",
      apiLanguage: "swift",
    },
    java: {
      command: "java",
      label: "Java",
      apiLanguage: "java",
    },
  };

  return runtimes[language] || null;
}

function isOneCompilerRunnable(language) {
  return Boolean(getOneCompilerRuntimeForLanguage(language));
}

async function runRemoteFileWithOneCompiler(filePath, expectedLanguage = "", stdin = "") {
  if (!filePath) {
    pushTerminalLine("Usage: python <file.py> | cpp <file.cpp> | csharp <file.cs> [--stdin text]", "accent");
    return;
  }

  const targetPath = resolveTerminalPath(filePath);
  const file = state.files.find((item) => item.path === targetPath);

  if (!file) {
    pushTerminalLine(`File not found: ${filePath}`, "accent");
    return;
  }

  const runtime = getOneCompilerRuntimeForLanguage(file.language);

  if (!runtime) {
    pushTerminalLine(`OneCompiler runs are available for Python, C++, C#, Swift, and Java: ${file.path}`, "accent");
    return;
  }

  if (expectedLanguage && file.language !== expectedLanguage) {
    const expectedRuntime = getOneCompilerRuntimeForLanguage(expectedLanguage);
    pushTerminalLine(`Use ${expectedRuntime?.command || expectedLanguage} with a matching file type.`, "accent");
    return;
  }

  if (!hasScriptRunQuota()) {
    pushTerminalLine(getScriptRunLimitMessage(), "accent");
    openRunLimitModal();
    return;
  }

  pushTerminalLine(`Running ${file.path} on OneCompiler as ${runtime.label}...`, "muted");
  consumeScriptRunQuota();
  if (!hasScriptRunQuota()) {
    pushTerminalLine(getScriptRunLimitMessage(), "warn");
    openRunLimitModal();
  }
  persistState();
  renderAll();

  try {
    const response = await fetch("/api/run-python", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        language: runtime.apiLanguage,
        stdin,
        files: [
          {
            name: getFileName(file.path),
            content: file.content,
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok || data.status === "failed") {
      pushTerminalLine(data.error || `OneCompiler request failed with ${response.status}`, "accent");
      return;
    }

    if (data.stdout) {
      pushTerminalLine(data.stdout.trimEnd(), "success");
    }

    if (data.stderr) {
      pushTerminalLine(data.stderr.trimEnd(), "warn");
    }

    if (data.exception) {
      pushTerminalLine(String(data.exception).trim(), "accent");
    }

    pushTerminalLine(`Execution time: ${data.executionTime ?? 0}ms • Memory: ${data.memoryUsed ?? 0}KB`, "muted");
    pushLog(`Executed ${file.path} with OneCompiler.`, "info");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    pushTerminalLine(`OneCompiler request failed: ${message}`, "accent");
    pushLog("OneCompiler execution failed.", "error");
  }
}

async function runActiveEditorFile() {
  const activeFile = getActiveFile();

  if (!activeFile) {
    pushTerminalLine("No active file selected.", "accent");
    renderTerminal();
    return;
  }

  if (!isOneCompilerRunnable(activeFile.language)) {
    pushTerminalLine("Run supports Python, C++, C#, Swift, and Java files.", "accent");
    renderTerminal();
    return;
  }

  await runRemoteFileWithOneCompiler(activeFile.path);
  persistState();
  renderAll();
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
  const stdinFlagIndex = args.indexOf("--stdin");
  const languageTargetArg = stdinFlagIndex >= 0 ? args.slice(0, stdinFlagIndex).join(" ") : arg;
  const languageStdinArg = stdinFlagIndex >= 0 ? args.slice(stdinFlagIndex + 1).join(" ") : "";

  if (command === "python" || command === "python3") {
    await runRemoteFileWithOneCompiler(languageTargetArg || getActiveFile()?.path || "", "python", languageStdinArg);
  } else if (command === "cpp" || command === "c++") {
    await runRemoteFileWithOneCompiler(languageTargetArg || getActiveFile()?.path || "", "cpp", languageStdinArg);
  } else if (command === "csharp" || command === "cs") {
    await runRemoteFileWithOneCompiler(languageTargetArg || getActiveFile()?.path || "", "csharp", languageStdinArg);
  } else if (command === "swift") {
    await runRemoteFileWithOneCompiler(languageTargetArg || getActiveFile()?.path || "", "swift", languageStdinArg);
  } else if (command === "java") {
    await runRemoteFileWithOneCompiler(languageTargetArg || getActiveFile()?.path || "", "java", languageStdinArg);
  } else if (shellBackend.available && command !== "run" && command !== "help" && command !== "clear") {
    try {
      await executeBackendShellCommand(input);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      pushTerminalLine(`Shell request failed: ${message}`, "accent");
      pushLog("Python shell request failed.", "error");
    }
  } else if (command === "help") {
    if (shellBackend.available) {
      pushTerminalLine("Shell mode: most commands run in the Python backend. Local IDE commands: python <file.py>, cpp <file.cpp>, csharp <file.cs>, swift <file.swift>, java <file.java>, run <file.js>, help, clear.", "muted");
    } else {
      pushTerminalLine("Commands: help, ls, pwd, cd <folder>, cat <file>, open <file>, python <file.py>, cpp <file.cpp>, csharp <file.cs>, swift <file.swift>, java <file.java>, run <file.js>, curl <url>, mkdir <folder>, touch <file>, cp <src> <dest>, mv <src> <dest>, rm <path>, clear", "muted");
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
  const prompt = elements.chatInput.value.trim();

  if (!prompt) {
    return;
  }

  const userMessage = { role: "user", content: prompt };
  state.chatMessages.push(userMessage);
  state.chatMessages = state.chatMessages.slice(-12);
  const recentHistory = state.chatMessages
    .slice(0, -1)
    .slice(-10)
    .map((message) => ({
      role: message.role === "assistant" ? "assistant" : "user",
      content: String(message.content || ""),
    }))
    .filter((message) => message.content.trim());
  elements.chatInput.value = "";
  elements.chatStatus.textContent = "Thinking";
  elements.chatSend.disabled = true;
  persistState();
  renderChatPanel();

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: normalizeChatModel(state.openrouterModel),
        prompt,
        history: recentHistory,
        workspaceContext: buildWorkspaceContext(),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Request failed with ${response.status}`);
    }

    const assistantText = data.output_text || "I could not parse a reply from the API.";
    state.chatMessages.push({ role: "assistant", content: assistantText });
    state.chatMessages = state.chatMessages.slice(-12);
    pushLog("Gemini responded using the deployed AI Studio assistant.", "info");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    state.chatMessages.push({ role: "assistant", content: `Request failed: ${message}` });
    state.chatMessages = state.chatMessages.slice(-12);
    pushLog("Gemini request failed.", "error");
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

  if (template === "py") {
    return `def main():
    print("${fileName} ready")


if __name__ == "__main__":
    main()
`;
  }

  if (template === "cpp") {
    return `#include <iostream>

int main() {
  std::cout << "${fileName} ready" << std::endl;
  return 0;
}
`;
  }

  if (template === "cs") {
    return `using System;

class Program
{
    static void Main()
    {
        Console.WriteLine("${fileName} ready");
    }
}
`;
  }

  if (template === "swift") {
    return `import Foundation

print("${fileName} ready")
`;
  }

  if (template === "java") {
    return `class Main {
  public static void main(String[] args) {
    System.out.println("${fileName} ready");
  }
}
`;
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

function moveFileIntoFolder(sourcePath, destinationFolderPath) {
  const file = state.files.find((item) => item.path === sourcePath);

  if (!file) {
    return false;
  }

  const normalizedDestinationFolder = normalizePath(destinationFolderPath || "").replace(/\/+$/, "");
  const currentFolder = getFolderPath(file.path) === "workspace" ? "" : getFolderPath(file.path);

  if (normalizedDestinationFolder === currentFolder) {
    return false;
  }

  const nextPath = [normalizedDestinationFolder, getFileName(file.path)].filter(Boolean).join("/");

  if (!nextPath || nextPath === sourcePath) {
    return false;
  }

  if (state.files.some((item) => item.path === nextPath && item.path !== sourcePath)) {
    pushLog(`Cannot move ${sourcePath} because ${nextPath} already exists.`, "warn");
    return false;
  }

  ensureFolderPath(normalizedDestinationFolder);
  file.path = nextPath;
  file.language = inferLanguage(nextPath);
  state.openTabs = state.openTabs.map((path) => path === sourcePath ? nextPath : path);

  if (state.activeFilePath === sourcePath) {
    state.activeFilePath = nextPath;
  }

  setSelectedItem("file", nextPath);
  state.folders = [...new Set([...collectFoldersFromFiles(state.files), ...state.folders])].sort((left, right) => left.localeCompare(right));
  persistState();
  pushLog(`Moved ${sourcePath} to ${normalizedDestinationFolder || "workspace"}.`, "info");
  renderAll();
  return true;
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

function clearTreeDropTargets() {
  elements.tree.querySelectorAll(".tree-folder.is-drop-target").forEach((node) => {
    node.classList.remove("is-drop-target");
  });
}

function closeRenameModal() {
  elements.renameModal.hidden = true;
  elements.renameForm.reset();
}

function closeExtensionsModal() {
  elements.extensionsModal.hidden = true;
}

function closeGitHubModal() {
  if (!elements.githubModal || !elements.githubForm) {
    return;
  }

  elements.githubModal.hidden = true;
  elements.githubForm.reset();
  setGitHubStatus("");
}

function closeSlackModal() {
  if (!elements.slackModal || !elements.slackForm) {
    return;
  }

  elements.slackModal.hidden = true;
  elements.slackForm.reset();
  setSlackStatus("");
}

function setGitHubStatus(message, tone = "info") {
  if (!elements.githubStatus) {
    return;
  }

  const normalizedMessage = String(message || "").trim();
  elements.githubStatus.hidden = !normalizedMessage;
  elements.githubStatus.textContent = normalizedMessage;
  elements.githubStatus.dataset.tone = normalizedMessage ? tone : "";
}

function setSlackStatus(message, tone = "info") {
  if (!elements.slackStatus) {
    return;
  }

  const normalizedMessage = String(message || "").trim();
  elements.slackStatus.hidden = !normalizedMessage;
  elements.slackStatus.textContent = normalizedMessage;
  elements.slackStatus.dataset.tone = normalizedMessage ? tone : "";
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

function addOrReplaceImportedFile(path, content, source = "imported", tracked = false) {
  const normalizedPath = normalizePath(path);

  if (!normalizedPath) {
    return;
  }

  ensureFolderPath(getFolderPath(normalizedPath) === "workspace" ? "" : getFolderPath(normalizedPath));
  const existingIndex = state.files.findIndex((file) => file.path === normalizedPath);
  const nextRecord = createFileRecord({ path: normalizedPath, content, source, tracked });

  if (existingIndex >= 0) {
    nextRecord.originalContent = content;
    state.files[existingIndex] = nextRecord;
    return;
  }

  state.files.push(nextRecord);
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

function downloadBlob(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}

function sanitizeProjectName(name) {
  return String(name || "nova-project")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "") || "nova-project";
}

function getProjectExportBaseName() {
  return sanitizeProjectName(state.workspaceName || "nova-project");
}

function getZipTimestamp(date = new Date()) {
  const year = Math.max(1980, date.getFullYear());
  const dosTime = ((date.getHours() & 31) << 11)
    | ((date.getMinutes() & 63) << 5)
    | ((Math.floor(date.getSeconds() / 2)) & 31);
  const dosDate = (((year - 1980) & 127) << 9)
    | (((date.getMonth() + 1) & 15) << 5)
    | (date.getDate() & 31);

  return { dosTime, dosDate };
}

function makeCrcTable() {
  const table = new Uint32Array(256);

  for (let index = 0; index < 256; index += 1) {
    let value = index;

    for (let bit = 0; bit < 8; bit += 1) {
      value = (value & 1) ? (0xedb88320 ^ (value >>> 1)) : (value >>> 1);
    }

    table[index] = value >>> 0;
  }

  return table;
}

const CRC_TABLE = makeCrcTable();

function crc32(bytes) {
  let crc = 0xffffffff;

  for (let index = 0; index < bytes.length; index += 1) {
    crc = CRC_TABLE[(crc ^ bytes[index]) & 0xff] ^ (crc >>> 8);
  }

  return (crc ^ 0xffffffff) >>> 0;
}

function createZipArchive(entries) {
  const encoder = new TextEncoder();
  const fileParts = [];
  const centralParts = [];
  let offset = 0;
  const timestamp = getZipTimestamp();

  entries.forEach((entry) => {
    const nameBytes = encoder.encode(entry.name);
    const contentBytes = entry.directory ? new Uint8Array(0) : encoder.encode(entry.content);
    const localHeader = new Uint8Array(30 + nameBytes.length);
    const localView = new DataView(localHeader.buffer);
    const crc = crc32(contentBytes);

    localView.setUint32(0, 0x04034b50, true);
    localView.setUint16(4, 20, true);
    localView.setUint16(6, 0, true);
    localView.setUint16(8, 0, true);
    localView.setUint16(10, timestamp.dosTime, true);
    localView.setUint16(12, timestamp.dosDate, true);
    localView.setUint32(14, crc, true);
    localView.setUint32(18, contentBytes.length, true);
    localView.setUint32(22, contentBytes.length, true);
    localView.setUint16(26, nameBytes.length, true);
    localView.setUint16(28, 0, true);
    localHeader.set(nameBytes, 30);

    fileParts.push(localHeader, contentBytes);

    const centralHeader = new Uint8Array(46 + nameBytes.length);
    const centralView = new DataView(centralHeader.buffer);
    centralView.setUint32(0, 0x02014b50, true);
    centralView.setUint16(4, 20, true);
    centralView.setUint16(6, 20, true);
    centralView.setUint16(8, 0, true);
    centralView.setUint16(10, 0, true);
    centralView.setUint16(12, timestamp.dosTime, true);
    centralView.setUint16(14, timestamp.dosDate, true);
    centralView.setUint32(16, crc, true);
    centralView.setUint32(20, contentBytes.length, true);
    centralView.setUint32(24, contentBytes.length, true);
    centralView.setUint16(28, nameBytes.length, true);
    centralView.setUint16(30, 0, true);
    centralView.setUint16(32, 0, true);
    centralView.setUint16(34, 0, true);
    centralView.setUint16(36, 0, true);
    centralView.setUint32(38, entry.directory ? 0x10 : 0, true);
    centralView.setUint32(42, offset, true);
    centralHeader.set(nameBytes, 46);
    centralParts.push(centralHeader);

    offset += localHeader.length + contentBytes.length;
  });

  const centralSize = centralParts.reduce((total, part) => total + part.length, 0);
  const endRecord = new Uint8Array(22);
  const endView = new DataView(endRecord.buffer);
  endView.setUint32(0, 0x06054b50, true);
  endView.setUint16(4, 0, true);
  endView.setUint16(6, 0, true);
  endView.setUint16(8, entries.length, true);
  endView.setUint16(10, entries.length, true);
  endView.setUint32(12, centralSize, true);
  endView.setUint32(16, offset, true);
  endView.setUint16(20, 0, true);

  return new Blob([...fileParts, ...centralParts, endRecord], { type: "application/zip" });
}

function downloadProjectArchive() {
  const baseName = getProjectExportBaseName();
  const folderEntries = state.folders
    .map((folder) => ({
      name: `${baseName}/${folder.replace(/\/+$/, "")}/`,
      content: "",
      directory: true,
    }));
  const fileEntries = state.files.map((file) => ({
    name: `${baseName}/${file.path}`,
    content: file.content,
    directory: false,
  }));
  const zipBlob = createZipArchive([...folderEntries, ...fileEntries]);

  downloadBlob(zipBlob, `${baseName}.zip`);
  pushLog(`Exported ${state.files.length} files as ${baseName}.zip.`, "info");
}

function getPendingChangeCount() {
  return state.files.filter((file) => file.content !== file.originalContent).length;
}

function buildSlackWorkspacePayload() {
  const activeFile = getActiveFile();

  return {
    workspaceName: state.workspaceName || "frontend-studio",
    activeFile: activeFile?.path || "No active file",
    language: getLanguageLabel(activeFile?.language || "text"),
    totalFiles: state.files.length,
    pendingChanges: getPendingChangeCount(),
  };
}

async function sendSlackUpdate(event) {
  event.preventDefault();

  const title = String(elements.slackTitleInput?.value || "").trim();
  const message = String(elements.slackMessageInput?.value || "").trim();

  if (!title || !message) {
    setSlackStatus("Add both a title and a message before sending your update.", "warn");
    return;
  }

  setSlackStatus("Sending your update to Slack...", "info");

  if (elements.slackSubmit) {
    elements.slackSubmit.disabled = true;
  }

  try {
    const response = await fetch("/api/slack-share", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        message,
        ...buildSlackWorkspacePayload(),
      }),
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Slack share failed with ${response.status}.`);
    }

    pushLog(`Sent a Slack update for ${state.workspaceName || "this workspace"}.`, "info");
    closeSlackModal();
  } catch (error) {
    setSlackStatus(error instanceof Error ? error.message : "Slack share failed.", "error");
  } finally {
    if (elements.slackSubmit) {
      elements.slackSubmit.disabled = false;
    }
  }
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
  elements.workspaceName.textContent = state.workspaceName || "frontend-studio";
  document.body.classList.toggle("explorer-collapsed", !state.explorerVisible);
  document.body.classList.toggle("git-collapsed", !state.gitVisible);
  document.body.classList.toggle("preview-collapsed", !state.previewVisible);
  document.body.classList.toggle("terminal-collapsed", !state.terminalVisible);
  elements.panelMenuItems.forEach((item) => {
    if (item.dataset.menuToggle === "explorer") {
      item.textContent = state.explorerVisible ? "Hide File Hierarchy" : "Show File Hierarchy";
    }

    if (item.dataset.menuToggle === "git") {
      item.textContent = state.gitVisible ? "Hide Gemini" : "Show Gemini";
    }

    if (item.dataset.menuToggle === "preview") {
      item.textContent = state.previewVisible ? "Hide Live Preview" : "Show Live Preview";
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
  applyPreviewWidth();
  applySidebarWidth();
  renderPreview();
  renderTerminal();
}

function finishPreviewResize() {
  if (!previewResizeSession) {
    return;
  }

  window.removeEventListener("pointermove", handlePreviewResizeMove);
  window.removeEventListener("pointerup", finishPreviewResize);
  document.body.classList.remove("is-resizing-preview");
  previewResizeSession = null;
  persistState();
}

function handlePreviewResizeMove(event) {
  if (!previewResizeSession || !elements.editorSurface) {
    return;
  }

  const bounds = elements.editorSurface.getBoundingClientRect();
  state.previewWidth = clampPreviewWidth(bounds.right - event.clientX);
  applyPreviewWidth();
}

function startPreviewResize(event) {
  if (window.innerWidth <= 1460 || !state.previewVisible || !elements.editorSurface || !elements.previewResizer) {
    return;
  }

  previewResizeSession = { pointerId: event.pointerId };
  elements.previewResizer.setPointerCapture?.(event.pointerId);
  document.body.classList.add("is-resizing-preview");
  window.addEventListener("pointermove", handlePreviewResizeMove);
  window.addEventListener("pointerup", finishPreviewResize, { once: true });
}

function finishSidebarResize() {
  if (!sidebarResizeSession) {
    return;
  }

  window.removeEventListener("pointermove", handleSidebarResizeMove);
  window.removeEventListener("pointerup", finishSidebarResize);
  document.body.classList.remove("is-resizing-sidebar");
  sidebarResizeSession = null;
  persistState();
}

function handleSidebarResizeMove(event) {
  if (!sidebarResizeSession) {
    return;
  }

  state.sidebarWidth = clampSidebarWidth(window.innerWidth - event.clientX - 14);
  applySidebarWidth();
}

function startSidebarResize(event) {
  if (window.innerWidth <= 1460 || !state.gitVisible || !elements.sidebarResizer) {
    return;
  }

  sidebarResizeSession = { pointerId: event.pointerId };
  elements.sidebarResizer.setPointerCapture?.(event.pointerId);
  document.body.classList.add("is-resizing-sidebar");
  window.addEventListener("pointermove", handleSidebarResizeMove);
  window.addEventListener("pointerup", finishSidebarResize, { once: true });
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

function suggestGitHubDestination(repositoryName) {
  const baseName = sanitizeProjectName(repositoryName || "github-project");
  let candidate = baseName || "github-project";
  let suffix = 2;

  while (
    state.folders.includes(candidate)
    || state.files.some((file) => file.path === candidate || file.path.startsWith(`${candidate}/`))
  ) {
    candidate = `${baseName}-${suffix}`;
    suffix += 1;
  }

  return candidate;
}

function importGitHubFilesIntoWorkspace(files, destinationFolder) {
  const normalizedDestination = normalizePath(destinationFolder || "").replace(/\/+$/, "");
  const initialActivePath = state.activeFilePath;
  const initialSelectedItem = getSelectedItem();
  const importedPaths = [];

  if (normalizedDestination) {
    ensureFolderPath(normalizedDestination);
  }

  files.forEach((file) => {
    const nextPath = [normalizedDestination, normalizePath(file.path)].filter(Boolean).join("/");
    addOrReplaceImportedFile(nextPath, String(file.content || ""), "imported", false);
    importedPaths.push(nextPath);
  });

  state.folders = [...new Set([...collectFoldersFromFiles(state.files), ...state.folders])].sort((left, right) => left.localeCompare(right));

  if (importedPaths.length) {
    state.activeFilePath = importedPaths[0];
    if (!state.openTabs.includes(importedPaths[0])) {
      state.openTabs.push(importedPaths[0]);
    }
    setSelectedItem("file", importedPaths[0]);
  } else if (initialActivePath) {
    state.activeFilePath = initialActivePath;
    setSelectedItem(initialSelectedItem.type, initialSelectedItem.path);
  }

  persistState();
  renderAll();
}

async function importGitHubRepository(event) {
  event.preventDefault();

  const repository = String(elements.githubRepoInput?.value || "").trim();
  const ref = String(elements.githubRefInput?.value || "").trim();

  if (!repository) {
    setGitHubStatus("Enter a GitHub repository to import first.", "warn");
    elements.githubRepoInput?.focus();
    return;
  }

  setGitHubStatus("Importing repository files from GitHub...", "info");

  if (elements.githubSubmit) {
    elements.githubSubmit.disabled = true;
  }

  try {
    const response = await fetch("/api/github-import", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        repository,
        ref,
      }),
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `GitHub import failed with ${response.status}.`);
    }

    const destinationInput = String(elements.githubFolderInput?.value || "").trim();
    const destinationFolder = destinationInput || suggestGitHubDestination(data.repoName || "github-project");

    if (elements.githubFolderInput && !destinationInput) {
      elements.githubFolderInput.value = destinationFolder;
    }

    importGitHubFilesIntoWorkspace(Array.isArray(data.files) ? data.files : [], destinationFolder);

    const stats = data.stats || {};
    const skippedTotal = Number(stats.skippedOversized || 0) + Number(stats.skippedBinary || 0) + Number(stats.skippedFailed || 0) + Number(stats.truncated || 0);
    pushLog(
      `Imported ${Number(stats.imported || 0)} file${Number(stats.imported || 0) === 1 ? "" : "s"} from ${data.repository}@${data.ref} into ${destinationFolder}.${skippedTotal ? ` Skipped ${skippedTotal} file${skippedTotal === 1 ? "" : "s"}.` : ""}`,
      "info"
    );

    closeGitHubModal();
  } catch (error) {
    setGitHubStatus(error instanceof Error ? error.message : "GitHub import failed.", "error");
  } finally {
    if (elements.githubSubmit) {
      elements.githubSubmit.disabled = false;
    }
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

elements.tree.addEventListener("dragstart", (event) => {
  const fileButton = event.target.closest("[data-file-path]");

  if (!fileButton) {
    return;
  }

  draggedTreeFilePath = fileButton.dataset.filePath || "";
  fileButton.classList.add("is-dragging");
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", draggedTreeFilePath);
  }
});

elements.tree.addEventListener("dragend", (event) => {
  const fileButton = event.target.closest("[data-file-path]");

  if (fileButton) {
    fileButton.classList.remove("is-dragging");
  }

  draggedTreeFilePath = "";
  clearTreeDropTargets();
});

elements.tree.addEventListener("dragover", (event) => {
  const folderButton = event.target.closest("[data-folder-path]");

  clearTreeDropTargets();

  if (!folderButton || !draggedTreeFilePath) {
    return;
  }

  const draggedFile = state.files.find((item) => item.path === draggedTreeFilePath);
  const destinationFolder = folderButton.dataset.folderPath || "";
  const currentFolder = draggedFile ? (getFolderPath(draggedFile.path) === "workspace" ? "" : getFolderPath(draggedFile.path)) : "";

  if (destinationFolder === currentFolder) {
    return;
  }

  event.preventDefault();
  folderButton.classList.add("is-drop-target");
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = "move";
  }
});

elements.tree.addEventListener("dragleave", (event) => {
  const relatedTarget = event.relatedTarget;

  if (relatedTarget && elements.tree.contains(relatedTarget)) {
    return;
  }

  clearTreeDropTargets();
});

elements.tree.addEventListener("drop", (event) => {
  const folderButton = event.target.closest("[data-folder-path]");

  if (!folderButton || !draggedTreeFilePath) {
    return;
  }

  event.preventDefault();
  const sourcePath = draggedTreeFilePath;
  draggedTreeFilePath = "";
  clearTreeDropTargets();
  moveFileIntoFolder(sourcePath, folderButton.dataset.folderPath || "");
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
  updateEditorSuggestions();
});

elements.editorInput.addEventListener("scroll", () => {
  elements.highlightCode.parentElement.scrollTop = elements.editorInput.scrollTop;
  elements.highlightCode.parentElement.scrollLeft = elements.editorInput.scrollLeft;
  elements.lineNumbers.scrollTop = elements.editorInput.scrollTop;
  renderEditorSuggestions();
});

["click", "keyup"].forEach((eventName) => {
  elements.editorInput.addEventListener(eventName, () => {
    updateCursorStats();
    updateEditorSuggestions();
  });
});

elements.editorInput.addEventListener("keydown", (event) => {
  const file = getActiveFile();

  if (suggestionState.items.length) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      suggestionState.activeIndex = (suggestionState.activeIndex + 1) % suggestionState.items.length;
      renderEditorSuggestions();
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      suggestionState.activeIndex = (suggestionState.activeIndex - 1 + suggestionState.items.length) % suggestionState.items.length;
      renderEditorSuggestions();
      return;
    }

    if (event.key === "Enter" || event.key === "Tab") {
      event.preventDefault();
      applyEditorSuggestion();
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      hideEditorSuggestions();
      return;
    }
  }

  if (["(", "\"", "{", "[", "'"].includes(event.key)) {
    if (handleEditorPairInsertion(event)) {
      return;
    }
  }

  if (event.key === "Enter" && file) {
    if (handleEditorNewline(event, file.language)) {
      return;
    }
  }

  if (event.key === "Tab") {
    event.preventDefault();
    const start = elements.editorInput.selectionStart;
    const end = elements.editorInput.selectionEnd;
    const value = elements.editorInput.value;
    const insertion = EDITOR_INDENT;

    setEditorValue(
      `${value.slice(0, start)}${insertion}${value.slice(end)}`,
      start + insertion.length
    );
  }
});

elements.editorSuggestions.addEventListener("mousedown", (event) => {
  const button = event.target.closest("[data-suggestion-index]");

  if (!button) {
    return;
  }

  event.preventDefault();
  applyEditorSuggestion(Number(button.dataset.suggestionIndex));
  elements.editorInput.focus();
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

document.querySelectorAll("[data-close-rename]").forEach((button) => {
  button.addEventListener("click", () => {
    closeRenameModal();
  });
});

document.querySelectorAll("[data-close-extensions]").forEach((button) => {
  button.addEventListener("click", () => {
    closeExtensionsModal();
  });
});

document.querySelectorAll("[data-close-github-modal]").forEach((button) => {
  button.addEventListener("click", () => {
    closeGitHubModal();
  });
});

document.querySelectorAll("[data-close-slack-modal]").forEach((button) => {
  button.addEventListener("click", () => {
    closeSlackModal();
  });
});

document.querySelectorAll("[data-close-run-limit]").forEach((button) => {
  button.addEventListener("click", () => {
    closeRunLimitModal();
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

elements.renameForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const nextName = String(elements.renameInput.value || "").trim();

  if (!nextName) {
    return;
  }

  state.workspaceName = nextName;
  persistState();
  closeRenameModal();
  pushLog(`Renamed workspace to ${nextName}.`, "info");
  renderAll();
});

elements.githubForm?.addEventListener("submit", importGitHubRepository);
elements.slackForm?.addEventListener("submit", sendSlackUpdate);

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
elements.deleteItem.addEventListener("click", deleteSelectedItem);
elements.chatModel.addEventListener("change", (event) => {
  state.openrouterModel = normalizeChatModel(event.target.value);
  persistState();
  renderChatPanel();
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
      content: "Ask a new question whenever you're ready.",
    },
  ];
  persistState();
  renderChatPanel();
});
elements.chatList.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-copy-code]");

  if (!button) {
    return;
  }

  const codeBlock = button.closest(".chat-code-block")?.querySelector("code");
  const code = codeBlock?.textContent || "";

  if (!code) {
    return;
  }

  const originalLabel = button.textContent;

  try {
    await navigator.clipboard.writeText(code);
    button.textContent = "Copied";
    window.setTimeout(() => {
      button.textContent = originalLabel;
    }, 1200);
  } catch (error) {
    button.textContent = "Failed";
    window.setTimeout(() => {
      button.textContent = originalLabel;
    }, 1200);
  }
});
elements.previewResizer?.addEventListener("pointerdown", startPreviewResize);
elements.previewResizer?.addEventListener("keydown", (event) => {
  if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
    return;
  }

  event.preventDefault();
  const delta = event.key === "ArrowLeft" ? 20 : -20;
  state.previewWidth = clampPreviewWidth((state.previewWidth || 210) + delta);
  applyPreviewWidth();
  persistState();
});
elements.sidebarResizer?.addEventListener("pointerdown", startSidebarResize);
elements.sidebarResizer?.addEventListener("keydown", (event) => {
  if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
    return;
  }

  event.preventDefault();
  const delta = event.key === "ArrowLeft" ? 20 : -20;
  state.sidebarWidth = clampSidebarWidth((state.sidebarWidth || 330) + delta);
  applySidebarWidth();
  persistState();
});
elements.terminalForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = elements.terminalInput.value;
  elements.terminalInput.value = "";
  executeTerminalCommand(value);
});

elements.runActiveFile.addEventListener("click", () => {
  runActiveEditorFile();
});
elements.saveWorkspace.addEventListener("click", saveSnapshot);
elements.downloadFile.addEventListener("click", downloadActiveFile);
elements.exportProject.addEventListener("click", () => {
  downloadProjectArchive();
  elements.panelMenu.hidden = true;
  elements.panelMenuToggle.setAttribute("aria-expanded", "false");
});
elements.renameProject.addEventListener("click", () => {
  elements.renameInput.value = state.workspaceName || "frontend-studio";
  elements.renameModal.hidden = false;
  elements.panelMenu.hidden = true;
  elements.panelMenuToggle.setAttribute("aria-expanded", "false");
  elements.renameInput.focus();
  elements.renameInput.select();
});
elements.openExtensions.addEventListener("click", () => {
  elements.extensionsModal.hidden = false;
  elements.panelMenu.hidden = true;
  elements.panelMenuToggle.setAttribute("aria-expanded", "false");
});
elements.openGitHubImport?.addEventListener("click", () => {
  closeExtensionsModal();
  setGitHubStatus("");
  if (elements.githubModal) {
    elements.githubModal.hidden = false;
  }
  if (elements.githubRepoInput) {
    elements.githubRepoInput.focus();
  }
});
elements.openSlackShare?.addEventListener("click", () => {
  closeExtensionsModal();
  setSlackStatus("");
  if (elements.slackTitleInput) {
    elements.slackTitleInput.value = `${state.workspaceName || "frontend-studio"} progress update`;
  }
  if (elements.slackModal) {
    elements.slackModal.hidden = false;
  }
  if (elements.slackMessageInput) {
    elements.slackMessageInput.focus();
  }
});
elements.signOut.addEventListener("click", async () => {
  clearApprovedAccess();
  cloudSyncReady = false;
  window.clearTimeout(cloudSaveTimer);
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

    if (button.dataset.menuToggle === "preview") {
      state.previewVisible = !state.previewVisible;
      if (!state.previewVisible) {
        finishPreviewResize();
      }
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

  if (event.key === "Escape" && elements.renameModal && !elements.renameModal.hidden) {
    closeRenameModal();
  }

  if (event.key === "Escape" && elements.extensionsModal && !elements.extensionsModal.hidden) {
    closeExtensionsModal();
  }

  if (event.key === "Escape" && elements.githubModal && !elements.githubModal.hidden) {
    closeGitHubModal();
  }

  if (event.key === "Escape" && elements.slackModal && !elements.slackModal.hidden) {
    closeSlackModal();
  }

  if (event.key === "Escape" && elements.runLimitModal && !elements.runLimitModal.hidden) {
    closeRunLimitModal();
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
    auth.onAuthStateChanged(async (user) => {
      if (!applyAuthenticatedUser(user)) {
        hideProjectLoading();
        clearApprovedAccess();
        cloudSyncReady = false;
        window.clearTimeout(cloudSaveTimer);
        return;
      }

      showProjectLoading(
        "Loading your Nova project...",
        "Large projects may take a little longer to retrieve from your account."
      );

      const normalizedEmail = String(user.email || "").trim().toLowerCase();

      try {
        const result = await fetchEarlyAccessStatus(normalizedEmail);
        if (!result.approved) {
          hideProjectLoading();
          clearApprovedAccess();
          window.location.href = "home.html";
          return;
        }
        rememberApprovedAccess(normalizedEmail);
      } catch (error) {
        hideProjectLoading();
        clearApprovedAccess();
        cloudSyncReady = false;
        window.location.href = "home.html";
        return;
      }

      try {
        await syncWorkspaceFromCloud(user);
      } catch (error) {
        cloudSyncReady = false;
        pushLog("Cloud sync is unavailable right now. Using this device's saved workspace.", "warn");
      }
      renderAll();
      checkShellBackend();
      hideProjectLoading();
    });
  })
  .catch(() => {
    hideProjectLoading();
    window.location.href = "home.html";
  });
