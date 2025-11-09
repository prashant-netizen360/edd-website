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
    toolsSection.style.display = "flex";

    // Animate tools cards
    const cards = document.querySelectorAll(".tool-card");
    cards.forEach((card, index) => {
      setTimeout(() => card.classList.add("fade-in"), index * 200);
    });
  } else {
    // No user signed in
    loginBtn.style.display = "inline-block";
    logoutBtn.style.display = "none";
    toolsSection.style.display = "none";
    userName.textContent = "";
  }
});

// Login button click
loginBtn.addEventListener("click", () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
    .then((result) => {
      const user = result.user;
      userName.textContent = `Welcome, ${user.displayName}!`;
      loginBtn.style.display = "none";
      logoutBtn.style.display = "inline-block";
      toolsSection.style.display = "flex";

      // Animate tools cards
      const cards = document.querySelectorAll(".tool-card");
      cards.forEach((card, index) => {
        setTimeout(() => card.classList.add("fade-in"), index * 200);
      });
    })
    .catch((error) => {
      console.error("Login failed:", error);
      alert("Login failed. Check console for details.");
    });
});

// Logout button click
logoutBtn.addEventListener("click", () => {
  auth.signOut()
    .then(() => {
      loginBtn.style.display = "inline-block";
      logoutBtn.style.display = "none";
      toolsSection.style.display = "none";
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
    // Prevent the default anchor navigation; we'll open conditionally
    e.preventDefault();
    if (auth.currentUser) {
      // Open in new tab as intended
      window.open(eddLink.href, "_blank");
    } else {
      alert("Please sign in with Google to access the EDD calculator.");
    }
  });
}

// Header shrink on scroll — add/remove .shrunk on <header>
(() => {
  const headerEl = document.querySelector('header');
  if (!headerEl) return;
  const onScroll = () => {
    const y = window.scrollY || window.pageYOffset;
    if (y > 60) {
      headerEl.classList.add('shrunk');
    } else {
      headerEl.classList.remove('shrunk');
    }
  };
  // Run on load in case page is already scrolled
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
