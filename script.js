// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAFipOZWUqWV7LREBq3kwu6zFw1vqVv9Ng",
  authDomain: "prashantcalc.firebaseapp.com",
  projectId: "prashantcalc",
  storageBucket: "prashantcalc.firebasestorage.app",
  messagingSenderId: "137426817743",
  appId: "1:137426817743:web:d00c8fdfa040cce3049dba",
  measurementId: "G-EWL7HM08Y2"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// DOM Elements
const loginBtn = document.getElementById("loginBtn");
const toolsSection = document.getElementById("toolsSection");
const userName = document.getElementById("userName");

// Create Logout button dynamically if not present
let logoutBtn = document.getElementById("logoutBtn");
if (!logoutBtn) {
  logoutBtn = document.createElement("button");
  logoutBtn.id = "logoutBtn";
  logoutBtn.textContent = "Logout";
  logoutBtn.style.marginLeft = "10px";
  logoutBtn.style.padding = "0.5rem 1rem";
  logoutBtn.style.borderRadius = "10px";
  logoutBtn.style.cursor = "pointer";
  loginBtn.parentNode.appendChild(logoutBtn);
}
logoutBtn.style.display = "none";

// Check auth state on page load
auth.onAuthStateChanged((user) => {
  if (user) {
    // User is signed in
    userName.textContent = `Welcome, ${user.displayName}!`;
    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";
  } else {
    // No user signed in
    loginBtn.style.display = "inline-block";
    logoutBtn.style.display = "none";
    userName.textContent = "";
  }
});

// Login button click
loginBtn.addEventListener("click", () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  // Use popup (not redirect) to avoid storage issues in privacy-focused browsers
  auth.signInWithPopup(provider)
    .then((result) => {
      const user = result.user;
      userName.textContent = `Welcome, ${user.displayName}!`;
      loginBtn.style.display = "none";
      logoutBtn.style.display = "inline-block";
    })
    .catch((error) => {
      console.error("Login failed:", error);
      // More helpful error messages
      if (error.code === 'auth/operation-not-allowed') {
        alert("Google sign-in is not enabled. Please contact admin.");
      } else if (error.code === 'auth/popup-blocked') {
        alert("Popup was blocked. Please allow popups for this site and try again.");
      } else if (error.code === 'auth/cancelled-popup-request' || error.code === 'auth/popup-closed-by-user') {
        // User closed popup, silently ignore
        console.log("Login cancelled by user");
      } else {
        alert(`Login failed: ${error.message}\n\nTry: 1) Allow popups 2) Clear cache 3) Try incognito mode`);
      }
    });
});

// Logout button click
logoutBtn.addEventListener("click", () => {
  auth.signOut()
    .then(() => {
      loginBtn.style.display = "inline-block";
      logoutBtn.style.display = "none";
      userName.textContent = "";
    })
    .catch((error) => {
      console.error("Logout failed:", error);
    });
});

// Ensure the EDD link only opens if the user is signed in.
const eddLink = document.getElementById("eddLink");
if (eddLink) {
  eddLink.addEventListener("click", (e) => {
    e.preventDefault();
    if (auth.currentUser) {
      window.open(eddLink.href, "_blank");
    } else {
      // Trigger Google login when user tries to access calculator
      const provider = new firebase.auth.GoogleAuthProvider();
      auth.signInWithPopup(provider)
        .then((result) => {
          // After successful login, open the calculator
          window.open(eddLink.href, "_blank");
        })
        .catch((error) => {
          console.error("Login failed:", error);
          alert("Please sign in with Google to access the EDD calculator.");
        });
    }
  });
}

// About modal logic removed - button no longer appears in footer

// Privacy Policy modal logic
(() => {
  const privacyModal = document.getElementById('privacyModal');
  const privacyLink = document.getElementById('privacyLink');
  if (!privacyModal || !privacyLink) return;

  const openPrivacyModal = () => {
    privacyModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    const closeBtn = privacyModal.querySelector('.modal-close');
    if (closeBtn) closeBtn.focus();
  };

  const closePrivacyModal = () => {
    privacyModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (privacyLink) privacyLink.focus();
  };

  // open on click
  privacyLink.addEventListener('click', openPrivacyModal);

  // close handlers
  privacyModal.querySelectorAll('[data-dismiss], .modal-close').forEach(el => el.addEventListener('click', closePrivacyModal));
  
  // close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && privacyModal.getAttribute('aria-hidden') === 'false') closePrivacyModal();
  });
})();

// Removed header shrink-on-scroll to avoid jerky scrolling.
// Using a CSS animated gradient and subtle illustration float for a modern look.
