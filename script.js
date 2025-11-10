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

// About modal logic (open from footer About link)
(() => {
  const aboutModal = document.getElementById('aboutModal');
  if (!aboutModal) return;

  // Create a footer About link if missing and place it in the first (left) footer column
  let footerAbout = document.getElementById('footerAboutBtn');
  if (!footerAbout) {
    const footerLeft = document.querySelector('footer .footer-left');
    if (footerLeft) {
      footerAbout = document.createElement('button');
      footerAbout.id = 'footerAboutBtn';
      footerAbout.className = 'contact-item';
      footerAbout.type = 'button';
      footerAbout.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zM11 11h2v6h-2v-6zm0-4h2v2h-2V7z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg> <span>About Me</span>';
      // insert before the contact list so it's the first interactive item
      const contactList = footerLeft.querySelector('.contact-list');
      if (contactList) footerLeft.insertBefore(footerAbout, contactList);
      else footerLeft.appendChild(footerAbout);
    }
  }

  const openModal = () => {
    aboutModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    // focus management
    const closeBtn = aboutModal.querySelector('.modal-close');
    if (closeBtn) closeBtn.focus();
  };

  const closeModal = () => {
    aboutModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (footerAbout) footerAbout.focus();
  };

  // open on click
  footerAbout && footerAbout.addEventListener('click', openModal);

  // close handlers
  aboutModal.querySelectorAll('[data-dismiss], .modal-close').forEach(el => el.addEventListener('click', closeModal));
  // close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && aboutModal.getAttribute('aria-hidden') === 'false') closeModal();
  });
})();

// Removed header shrink-on-scroll to avoid jerky scrolling.
// Using a CSS animated gradient and subtle illustration float for a modern look.
