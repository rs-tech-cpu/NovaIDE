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

const scriptLoaders = {};
let authInstance = null;

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
  authNote.textContent = "Sign in with the same Firebase email and password used on Pixel Wave.";
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

async function redirectIfAuthenticated() {
  try {
    const auth = await ensureFirebaseAuth();
    auth.onAuthStateChanged((user) => {
      if (user) {
        window.location.href = "index.html";
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
      showAuthMessage("Signed in. Opening Nova IDE...");
      window.location.href = "index.html";
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
      showAuthMessage("Signed in with Google. Opening Nova IDE...");
      window.location.href = "index.html";
    } catch (error) {
      showAuthMessage(getAuthErrorMessage(error), true);
    }
  });
}

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && authModal && !authModal.hidden) {
    closeAuthModal();
  }
});

resetAuthMessage();
redirectIfAuthenticated();
