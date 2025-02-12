import { updateProfile, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js";
import { auth, db } from "./firebaseConfig.js";
import { doc, updateDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";

const form = document.querySelector("#profileForm");
const userNameInput = document.querySelector("#username");

// Check user authentication status
onAuthStateChanged(auth, async (user) => {
  if (user) {
    console.log("User is logged in:", user.uid);
    await loadUserData(user.uid);
  } else {
    console.log("No user is logged in.");
    window.location = "login.html";
  }
});

// Load user data into the input field
async function loadUserData(userId) {
  const userRef = doc(db, "users", userId);
  try {
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const userData = userSnap.data();
      userNameInput.value = userData.userName || ""; // Pre-fill input
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
}

// Handle profile update
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const user = auth.currentUser;
  const updatedName = userNameInput.value.trim();
  if (!updatedName) {
    alert("Please enter a valid name.");
    return;
  }

  const userRef = doc(db, "users", user.uid);
  try {
    // Update name in Firestore
    await updateDoc(userRef, { userName: updatedName });
    // Update name in Firebase Authentication
    await updateProfile(user, { displayName: updatedName });

    console.log("Profile updated successfully!");
    alert("Profile updated successfully!");

    // Update name on the main page if applicable
    localStorage.setItem("updatedUserName", updatedName); // Store updated name
    window.location = "index.html"; // Redirect to main page

  } catch (error) {
    console.error("Error updating profile:", error);
    alert("Error updating profile.");
  }
});
