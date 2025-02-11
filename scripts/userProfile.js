import { updateProfile } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js";
import { auth, db } from "./firebaseConfig.js";
import { doc, updateDoc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js";

let uploadedImageUrl = "";

// ✅ **Cloudinary Upload Widget**
let myWidget = cloudinary.createUploadWidget(
  {
    cloudName: "dhro6nafp",
    uploadPreset: "my_preset",
  },
  (error, result) => {
    if (!error && result && result.event === "success") {
      console.log("Image uploaded successfully:", result.info);
      uploadedImageUrl = result.info.secure_url;
    }
  }
);

document.getElementById("upload_widget").addEventListener("click", function (e) {
  e.preventDefault();
  myWidget.open();
}, false);

// ✅ **Check Authentication State**
onAuthStateChanged(auth, async (user) => {
  if (user) {
    console.log("User is logged in:", user.uid);
    await loadUserProfile(user.uid);
  } else {
    console.log("No user is logged in.");
    window.location = "login.html";
  }
});

// ✅ **Profile Form Submission**
const form = document.querySelector("#profileForm");
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!auth.currentUser) {
    alert("User not logged in!");
    return;
  }

  const username = document.querySelector("#username").value;

  if (!uploadedImageUrl) {
    alert("Please upload an image before submitting.");
    return;
  }

  try {
    // ✅ **Update Firebase Authentication Profile**
    await updateProfile(auth.currentUser, {
      displayName: username,
      photoURL: uploadedImageUrl,
    });

    console.log("Updated Auth Profile:", auth.currentUser.displayName, auth.currentUser.photoURL);

    // ✅ **Update Firestore Profile**
    await saveUserProfile(auth.currentUser.uid, username, uploadedImageUrl);

  } catch (error) {
    console.error("Error updating profile:", error);
    alert("Error updating profile. Try again!");
  }
});

// ✅ **Load User Profile from Firestore**
async function loadUserProfile(userId) {
  try {
    const userDocRef = doc(db, "users", userId);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      const userData = docSnap.data();
      document.querySelector("#username").value = userData.fullName || "";
      uploadedImageUrl = userData.profileImg || "";
    }
  } catch (error) {
    console.error("Error loading user profile:", error);
  }
}

// ✅ **Save or Update Firestore Profile**
async function saveUserProfile(userId, username, profileImg) {
  try {
    const userDocRef = doc(db, "users", userId);
    const docSnap = await getDoc(userDocRef);

    if (!docSnap.exists()) {
      await setDoc(userDocRef, { fullName: username, profileImg });
    } else {
      await updateDoc(userDocRef, { fullName: username, profileImg });
    }
    alert("Profile updated successfully!");
    window.location.reload();
  } catch (error) {
    console.error("Error updating Firestore profile:", error);
    alert("Error saving profile. Try again!");
  }
}
