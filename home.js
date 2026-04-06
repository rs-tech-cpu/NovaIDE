const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAUbyQlVd8ElTbez7TAddtqc_fPXIQARPE",
  authDomain: "pixelchat-82d61.firebaseapp.com",
  projectId: "pixelchat-82d61",
  storageBucket: "pixelchat-82d61.firebasestorage.app",
  messagingSenderId: "1058396003619",
  appId: "1:1058396003619:web:4e9d2c796e7e9b748e0096",
  measurementId: "G-G7C8K3QM7D",
};

const homeShell = document.querySelector(".home-shell");
const launchButton = document.querySelector("[data-launch-ide]");
const authModal = document.querySelector("[data-auth-modal]");
const authForm = document.querySelector("[data-auth-form]");
const authEmail = document.querySelector("[data-auth-email]");
const authPassword = document.querySelector("[data-auth-password]");
const authNote = document.querySelector("[data-auth-note]");
const authCloseButtons = document.querySelectorAll("[data-close-auth]");
const googleLoginButton = document.querySelector("[data-google-login]");
const earlyAccessGate = document.querySelector("[data-early-access-gate]");
const earlyAccessMessage = document.querySelector("[data-early-access-message]");
const earlyAccessSignOut = document.querySelector("[data-early-access-signout]");
const APPROVED_ACCESS_KEY = "novaide-approved-email";

const scriptLoaders = {};
let authInstance = null;
let accessRequestToken = 0;

if (homeShell) {
  window.requestAnimationFrame(() => {
    homeShell.classList.add("home-shell--entered");
  });
}

function showAuthMessage(message, isError = false) {
  authNote.textContent = message;
  authNote.style.color = isError ? "#ffb4b4" : "#b8ffcf";
}

function resetAuthMessage() {
  authNote.textContent = "Sign in using your Pixel Wave account credentials.";
  authNote.style.color = "";
}

function openAuthModal() {
  authModal.hidden = false;
  authEmail.focus();
  resetAuthMessage();
}

function closeAuthModal() {
  authModal.hidden = true;
  authForm.reset();
  resetAuthMessage();
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

function renderAccessState(user) {
  const hasUser = Boolean(user);

  homeShell.classList.toggle("is-access-blocked", hasUser);
  earlyAccessGate.hidden = !hasUser;

  if (!hasUser) {
    return;
  }

  closeAuthModal();
  const firstName = getDisplayName(user);
  earlyAccessMessage.textContent = `${firstName}, your account is signed in, but Nova early access is not enabled yet. Join the waitlist below and we’ll contact you when access opens.`;
}

function clearApprovedAccess() {
  window.sessionStorage.removeItem(APPROVED_ACCESS_KEY);
}

function rememberApprovedAccess(email) {
  window.sessionStorage.setItem(APPROVED_ACCESS_KEY, String(email || "").trim().toLowerCase());
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

function getAuthErrorMessage(error) {
  switch (error?.code) {
    case "auth/invalid-email":
    case "auth/missing-email":
      return "Please enter a valid email address.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Incorrect email or password.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait and try again.";
    case "auth/popup-blocked":
      return "Popup was blocked by your browser. Please allow popups and try again.";
    case "auth/cancelled-popup-request":
      return "Another popup request interrupted Google sign-in. Please try again.";
    case "auth/operation-not-supported-in-this-environment":
      return "Google sign-in needs a secure site such as localhost or HTTPS.";
    case "auth/unauthorized-domain":
      return "This domain is not authorized in Firebase Authentication settings.";
    case "auth/popup-closed-by-user":
      return "Google sign-in was cancelled.";
    default:
      return error?.message || "Authentication failed. Please try again.";
  }
}

async function monitorAuthenticatedUser() {
  try {
    const auth = await ensureFirebaseAuth();
    auth.onAuthStateChanged(async (user) => {
      const requestToken = accessRequestToken + 1;
      accessRequestToken = requestToken;

      if (!user) {
        clearApprovedAccess();
        renderAccessState(null);
        return;
      }

      const normalizedEmail = String(user.email || "").trim().toLowerCase();
      if (window.sessionStorage.getItem(APPROVED_ACCESS_KEY) === normalizedEmail) {
        window.location.href = "index.html";
        return;
      }

      closeAuthModal();
      homeShell.classList.add("is-access-blocked");
      earlyAccessGate.hidden = false;
      earlyAccessMessage.textContent = "Checking your Nova early access status...";

      try {
        const result = await fetchEarlyAccessStatus(user.email || "");

        if (accessRequestToken !== requestToken) {
          return;
        }

        if (result.approved) {
          rememberApprovedAccess(normalizedEmail);
          window.location.href = "index.html";
          return;
        }

        clearApprovedAccess();
        renderAccessState(user);
        if (result.reason) {
          earlyAccessMessage.textContent = result.reason;
        }
      } catch (error) {
        if (accessRequestToken !== requestToken) {
          return;
        }

        clearApprovedAccess();
        renderAccessState(user);
        earlyAccessMessage.textContent = "We could not verify your early access yet. Please join the waitlist below and try again later.";
      }
    });
  } catch (error) {
    resetAuthMessage();
  }
}

if (launchButton) {
  launchButton.addEventListener("click", () => {
    openAuthModal();
  });
}

authCloseButtons.forEach((button) => {
  button.addEventListener("click", () => {
    closeAuthModal();
  });
});

if (authForm) {
  authForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = authEmail.value.trim().toLowerCase();
    const password = authPassword.value.trim();

    if (!email || !password) {
      showAuthMessage("Email and password are required.", true);
      return;
    }

    try {
      const auth = await ensureFirebaseAuth();
      await auth.signInWithEmailAndPassword(email, password);
      showAuthMessage("Signed in. Checking Nova access...");
    } catch (error) {
      showAuthMessage(getAuthErrorMessage(error), true);
    }
  });
}

if (googleLoginButton) {
  googleLoginButton.addEventListener("click", async () => {
    try {
      const auth = await ensureFirebaseAuth();
      const provider = new firebase.auth.GoogleAuthProvider();
      await auth.signInWithPopup(provider);
      showAuthMessage("Signed in with Google. Checking Nova access...");
    } catch (error) {
      showAuthMessage(getAuthErrorMessage(error), true);
    }
  });
}

if (earlyAccessSignOut) {
  earlyAccessSignOut.addEventListener("click", async () => {
    accessRequestToken += 1;
    clearApprovedAccess();
    try {
      const auth = await ensureFirebaseAuth();
      await auth.signOut();
      renderAccessState(null);
    } catch (error) {
      renderAccessState(null);
    }
  });
}

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && authModal && !authModal.hidden) {
    closeAuthModal();
  }
});

resetAuthMessage();
monitorAuthenticatedUser();
