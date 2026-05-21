const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAUbyQlVd8ElTbez7TAddtqc_fPXIQARPE",
  authDomain: "pixelchat-82d61.firebaseapp.com",
  projectId: "pixelchat-82d61",
  storageBucket: "pixelchat-82d61.firebasestorage.app",
  messagingSenderId: "1058396003619",
  appId: "1:1058396003619:web:4e9d2c796e7e9b748e0096",
  measurementId: "G-G7C8K3QM7D",
};

const CURRENT_PROJECT_KEY = "novaide-current-project";
const STORAGE_KEY = "novaide-workspace-v2";
const APPROVED_ACCESS_KEY = "novaide-approved-email";

const elements = {
  loading: document.querySelector("[data-projects-loading]"),
  loadingTitle: document.querySelector("[data-projects-loading-title]"),
  loadingMessage: document.querySelector("[data-projects-loading-message]"),
  status: document.querySelector("[data-projects-status]"),
  grid: document.querySelector("[data-projects-grid]"),
  empty: document.querySelector("[data-projects-empty]"),
  userName: document.querySelector("[data-projects-name]"),
  userEmail: document.querySelector("[data-projects-email]"),
  userAvatar: document.querySelector("[data-projects-avatar]"),
  signOut: document.querySelector("[data-projects-signout]"),
  openCreateButtons: document.querySelectorAll("[data-open-create-project]"),
  modal: document.querySelector("[data-create-project-modal]"),
  modalClose: document.querySelectorAll("[data-close-create-project]"),
  form: document.querySelector("[data-create-project-form]"),
  input: document.querySelector("[data-create-project-input]"),
  note: document.querySelector("[data-create-project-note]"),
  submit: document.querySelector("[data-create-project-submit]"),
};

const scriptLoaders = {};
let authInstance = null;
let firestoreInstance = null;
let accessRequestToken = 0;

function normalizeProjectName(name) {
  return String(name || "")
    .replace(/[\/\\]+/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

function setCurrentProjectName(name) {
  const normalized = normalizeProjectName(name);

  if (!normalized) {
    return "";
  }

  window.localStorage.setItem(CURRENT_PROJECT_KEY, normalized);
  return normalized;
}

function clearApprovedAccess() {
  window.sessionStorage.removeItem(APPROVED_ACCESS_KEY);
}

function rememberApprovedAccess(email) {
  window.sessionStorage.setItem(APPROVED_ACCESS_KEY, String(email || "").trim().toLowerCase());
}

function showLoading(title = "Loading your projects...", message = "Nova is checking your account and retrieving your workspace list.") {
  elements.loading.hidden = false;
  elements.loadingTitle.textContent = title;
  elements.loadingMessage.textContent = message;
}

function hideLoading() {
  elements.loading.hidden = true;
}

function setStatus(message) {
  elements.status.textContent = message;
}

function getProjectsErrorMessage(error) {
  const message = error instanceof Error ? error.message : String(error || "");
  const normalized = message.toLowerCase();

  if (normalized.includes("missing or insufficient permissions") || normalized.includes("permission-denied")) {
    return 'Firestore rules need to allow Nova projects at novaideUsers/{userId}/Workspace/{projectName}.';
  }

  return message || "Could not load your projects.";
}

function setCreateNote(message, tone = "info") {
  elements.note.textContent = message;
  elements.note.style.color = tone === "error" ? "#ffb4b4" : tone === "success" ? "#b9ffd0" : "";
}

function getDisplayName(user) {
  if (user?.displayName) {
    return user.displayName.split(" ")[0];
  }

  if (user?.email && user.email.includes("@")) {
    const emailPrefix = user.email.split("@")[0];
    const rawName = emailPrefix.split(/[\._-]/)[0];
    return rawName.charAt(0).toUpperCase() + rawName.slice(1);
  }

  return "Developer";
}

function getInitials(name) {
  return String(name || "NV")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("") || "NV";
}

function renderUser(user) {
  const name = user?.displayName || getDisplayName(user);
  elements.userName.textContent = name;
  elements.userEmail.textContent = user?.email || "Signed out";
  elements.userAvatar.textContent = getInitials(name);
}

function openCreateProjectModal() {
  elements.modal.hidden = false;
  setCreateNote("Nova will create a starter project with index.html, app.css, and app.js.");
  elements.input.focus();
  elements.input.select();
}

function closeCreateProjectModal() {
  elements.modal.hidden = true;
  elements.form.reset();
  setCreateNote("Nova will create a starter project with index.html, app.css, and app.js.");
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
      existing.addEventListener("error", () => reject(new Error(`Failed to load script: ${src}`)), { once: true });
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

async function ensureFirebaseServices() {
  if (authInstance && firestoreInstance) {
    return { auth: authInstance, firestore: firestoreInstance };
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
  return { auth: authInstance, firestore: firestoreInstance };
}

async function getAuthorizedHeaders(includeJson = false) {
  const { auth } = await ensureFirebaseServices();
  const user = auth.currentUser;

  if (!user) {
    throw new Error("You need to be signed in.");
  }

  const idToken = await user.getIdToken();
  const headers = {
    Authorization: `Bearer ${idToken}`,
  };

  if (includeJson) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
}

async function fetchEarlyAccessStatus() {
  const response = await fetch("/api/check-access", {
    method: "POST",
    headers: await getAuthorizedHeaders(true),
    cache: "no-store",
    body: "{}",
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `Access check failed with ${response.status}`);
  }

  return data;
}

function getWorkspaceCollectionRef(user) {
  if (!firestoreInstance || !user?.uid) {
    return null;
  }

  return firestoreInstance.collection("novaideUsers").doc(user.uid).collection("Workspace");
}

function getLegacyWorkspaceDocumentRef(user) {
  if (!firestoreInstance || !user?.uid) {
    return null;
  }

  return firestoreInstance.collection("novaideUsers").doc(user.uid).collection("workspaces").doc("primary");
}

function getDefaultProjectState(projectName) {
  const normalizedName = normalizeProjectName(projectName) || "frontend-studio";

  return {
    workspaceVersion: 4,
    workspaceName: normalizedName,
    files: [
      {
        path: "index.html",
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Project</title>
  <link rel="stylesheet" href="app.css">
</head>
<body>
  <main id="app"></main>
  <script src="app.js"><\/script>
</body>
</html>`,
        originalContent: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Project</title>
  <link rel="stylesheet" href="app.css">
</head>
<body>
  <main id="app"></main>
  <script src="app.js"><\/script>
</body>
</html>`,
        source: "starter",
        tracked: true,
        language: "html",
        updatedAt: Date.now(),
      },
      {
        path: "app.css",
        content: `body {
  margin: 0;
  min-height: 100vh;
  font-family: "Segoe UI", sans-serif;
}`,
        originalContent: `body {
  margin: 0;
  min-height: 100vh;
  font-family: "Segoe UI", sans-serif;
}`,
        source: "starter",
        tracked: true,
        language: "css",
        updatedAt: Date.now(),
      },
      {
        path: "app.js",
        content: `const app = document.querySelector("#app");

if (app) {
  app.textContent = "";
}`,
        originalContent: `const app = document.querySelector("#app");

if (app) {
  app.textContent = "";
}`,
        source: "starter",
        tracked: true,
        language: "javascript",
        updatedAt: Date.now(),
      },
      {
        path: "scripts/reset-project.js",
        content: `console.log("Resetting NovaIDE workspace...");
await api.resetProject();
console.log("Workspace cleared to a blank HTML, CSS, and JavaScript starter.");`,
        originalContent: `console.log("Resetting NovaIDE workspace...");
await api.resetProject();
console.log("Workspace cleared to a blank HTML, CSS, and JavaScript starter.");`,
        source: "starter",
        tracked: true,
        language: "javascript",
        updatedAt: Date.now(),
      },
    ],
    folders: ["scripts"],
    openTabs: ["index.html", "app.css", "app.js", "scripts/reset-project.js"],
    activeFilePath: "index.html",
    selectedItem: { type: "file", path: "index.html" },
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
    collapsedFolders: [],
    logs: [
      {
        id: `boot-${Date.now()}`,
        message: "Workspace booted with a blank HTML, CSS, and JavaScript starter.",
        tone: "info",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ],
  };
}

async function createProjectDocument(user, projectName) {
  const normalizedName = normalizeProjectName(projectName) || "frontend-studio";
  const workspaceRef = getWorkspaceCollectionRef(user)?.doc(normalizedName);

  if (!workspaceRef) {
    throw new Error("Could not access your project workspace collection.");
  }

  const existing = await workspaceRef.get();

  if (existing.exists) {
    throw new Error("A project with that name already exists.");
  }

  const workspace = getDefaultProjectState(normalizedName);
  await workspaceRef.set({
    workspace,
    email: user.email || "",
    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
  }, { merge: true });

  return normalizedName;
}

async function migrateLegacyWorkspaceIfNeeded(user) {
  const legacyRef = getLegacyWorkspaceDocumentRef(user);

  if (!legacyRef) {
    return false;
  }

  const legacySnapshot = await legacyRef.get();

  if (!legacySnapshot.exists) {
    return false;
  }

  const legacyWorkspace = legacySnapshot.data()?.workspace;

  if (!legacyWorkspace || typeof legacyWorkspace !== "object") {
    return false;
  }

  const projectName = normalizeProjectName(legacyWorkspace.workspaceName || "frontend-studio") || "frontend-studio";
  const workspaceRef = getWorkspaceCollectionRef(user)?.doc(projectName);

  if (!workspaceRef) {
    return false;
  }

  const nextWorkspace = {
    ...legacyWorkspace,
    workspaceName: projectName,
  };

  await workspaceRef.set({
    workspace: nextWorkspace,
    email: user.email || "",
    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
  }, { merge: true });

  return true;
}

function formatUpdatedAt(value) {
  if (!value) {
    return "Recently";
  }

  const date = typeof value.toDate === "function" ? value.toDate() : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }

  return date.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function renderProjects(projects) {
  if (!projects.length) {
    elements.grid.innerHTML = "";
    elements.empty.hidden = false;
    setStatus("No projects yet");
    return;
  }

  elements.empty.hidden = true;
  setStatus(`${projects.length} project${projects.length === 1 ? "" : "s"}`);
  elements.grid.innerHTML = projects.map((project) => `
    <article class="project-card">
      <div class="project-card__header">
        <div>
          <p class="projects-eyebrow">Project</p>
          <h3 class="project-card__title">${escapeHtml(project.name)}</h3>
        </div>
        <span class="project-card__tag">Cloud</span>
      </div>
      <div class="project-card__meta">
        <div class="project-card__meta-item">
          <span class="project-card__meta-label">Files</span>
          <span class="project-card__meta-value">${project.fileCount}</span>
        </div>
        <div class="project-card__meta-item">
          <span class="project-card__meta-label">Updated</span>
          <span class="project-card__meta-value">${escapeHtml(project.updatedAt)}</span>
        </div>
      </div>
      <div class="project-card__actions">
        <button class="projects-secondary project-card__open" type="button" data-open-project="${escapeHtml(project.name)}">Open</button>
      </div>
    </article>
  `).join("");
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function loadProjects(user) {
  const workspaceCollection = getWorkspaceCollectionRef(user);

  if (!workspaceCollection) {
    throw new Error("Could not access your projects.");
  }

  let snapshot = await workspaceCollection.get();

  if (snapshot.empty) {
    const migrated = await migrateLegacyWorkspaceIfNeeded(user);
    if (migrated) {
      snapshot = await workspaceCollection.get();
    }
  }

  if (snapshot.empty) {
    await createProjectDocument(user, "frontend-studio");
    snapshot = await workspaceCollection.get();
  }

  const projects = snapshot.docs
    .map((doc) => {
      const workspace = doc.data()?.workspace || {};
      const fileCount = Array.isArray(workspace.files) ? workspace.files.length : 0;
      return {
        id: doc.id,
        name: normalizeProjectName(workspace.workspaceName || doc.id) || doc.id,
        fileCount,
        updatedAt: formatUpdatedAt(doc.data()?.updatedAt),
        updatedAtRaw: doc.data()?.updatedAt?.toDate?.()?.getTime?.() || 0,
      };
    })
    .sort((left, right) => right.updatedAtRaw - left.updatedAtRaw || left.name.localeCompare(right.name));

  renderProjects(projects);
}

function openProject(name) {
  const normalized = setCurrentProjectName(name);

  if (!normalized) {
    return;
  }

  window.location.href = `index.html?project=${encodeURIComponent(normalized)}`;
}

async function bootstrapProjectsHome() {
  showLoading();

  const { auth } = await ensureFirebaseServices();
  auth.onAuthStateChanged(async (user) => {
    const requestToken = accessRequestToken + 1;
    accessRequestToken = requestToken;

    if (!user) {
      clearApprovedAccess();
      window.location.href = "home.html";
      return;
    }

    renderUser(user);

    try {
      const result = await fetchEarlyAccessStatus();

      if (accessRequestToken !== requestToken) {
        return;
      }

      if (!result.approved) {
        clearApprovedAccess();
        window.location.href = "home.html";
        return;
      }

      rememberApprovedAccess(String(user.email || "").trim().toLowerCase());
      await loadProjects(user);
      hideLoading();
    } catch (error) {
      if (accessRequestToken !== requestToken) {
        return;
      }

      hideLoading();
      clearApprovedAccess();
      setStatus(getProjectsErrorMessage(error));
    }
  });
}

elements.openCreateButtons.forEach((button) => {
  button.addEventListener("click", openCreateProjectModal);
});

elements.modalClose.forEach((button) => {
  button.addEventListener("click", closeCreateProjectModal);
});

elements.form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const projectName = normalizeProjectName(elements.input.value || "");

  if (!projectName) {
    setCreateNote("Add a project name before creating your workspace.", "error");
    return;
  }

  if (elements.submit) {
    elements.submit.disabled = true;
  }

  try {
    const { auth } = await ensureFirebaseServices();
    const user = auth.currentUser;

    if (!user) {
      throw new Error("You need to be signed in.");
    }

    const createdProject = await createProjectDocument(user, projectName);
    setCurrentProjectName(createdProject);
    closeCreateProjectModal();
    openProject(createdProject);
  } catch (error) {
    setCreateNote(error instanceof Error ? error.message : "Project creation failed.", "error");
  } finally {
    if (elements.submit) {
      elements.submit.disabled = false;
    }
  }
});

elements.grid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-open-project]");

  if (!button) {
    return;
  }

  openProject(button.dataset.openProject || "");
});

elements.signOut.addEventListener("click", async () => {
  clearApprovedAccess();
  window.localStorage.removeItem(CURRENT_PROJECT_KEY);

  try {
    const { auth } = await ensureFirebaseServices();
    await auth.signOut();
  } finally {
    window.location.href = "home.html";
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && elements.modal && !elements.modal.hidden) {
    closeCreateProjectModal();
  }
});

bootstrapProjectsHome().catch((error) => {
  hideLoading();
  setStatus(getProjectsErrorMessage(error));
});
