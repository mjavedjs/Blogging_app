
  import { collection, addDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";
  import { auth, db } from "./firebaseConfig.js";
  import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js";  
  
  let uploadedImageUrl = "";
  
  let myWidget = cloudinary.createUploadWidget({
    cloudName: "dhro6nafp",
    uploadPreset: "my_preset",
  }, (error, result) => {
    if (!error && result && result.event === "success") {
      console.log("Done! Here is the image info: ", result.info);
      uploadedImageUrl = result.info.secure_url;
    }
  });


  
  document.getElementById("upload_widget").addEventListener("click", function (e) { 
    e.preventDefault();
    myWidget.open();
  }, false);

  
  const form = document.querySelector("#form");
   let userDataArray = [];
  
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
  const title = document.querySelector("#title").value.trim();
    const description = document.querySelector("#description").value.trim();  
    try {
      const docRef = await addDoc(collection(db, "usersblog"), {
        title: title,
        description: description,
        profileImg: uploadedImageUrl,
        createdAt: new Date(),
        uid: auth.currentUser.uid,
      });
      console.log("Document written with ID: ", docRef.id);
      window.location = "index.html";
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  });


  onAuthStateChanged(auth, async(user) => {
    if (user) {
      console.log("User is logged in:", user.uid);
    const uservalue =   await loginUserData(user.uid);
    renderloginUserblogs(uservalue)
   console.log(uservalue)

    } else {
      console.log("No user is logged in.");
      window.location = "login.html"; 
    }
  });
  
  async function loginUserData(uid) {
     userDataArray = []
    try {
      const q = query(collection(db, "usersblog"), where("uid", "==", uid));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        userDataArray.push(doc.data()); // Push data into the global array
      });
  
      console.log("Updated userDataArray:", userDataArray); // Debugging
      return userDataArray;
  
    } catch (e) {
      console.error("Error fetching user blogs: ", e);
    }
  }
  

async function renderloginUserblogs(userData) {
  console.log(userData); // Debugging to check user data

  const cardContainer = document.getElementById("card-container");
  cardContainer.innerHTML = ""; // Clear previous posts before rendering

  userData.forEach((post) => {
      const createdAt = new Date(post.createdAt.seconds * 1000).toLocaleString(); // Convert Firestore timestamp
      const cardHTML = `
    <div class="col-lg-10 col-md-12 col-sm-12 d-flex justify-content-center mb-4">
        <div class="card shadow-lg border-0 rounded-3 overflow-hidden d-flex flex-row" style="max-width: 450px; width: 100%;">
            
            ${post.profileImg ? `
                <div class="card-img-container" style="width: 40%;">
                    <img src="${post.profileImg}" class="card-img" alt="Blog Image"  
                        style="width: 100%; height: 100%; object-fit: cover;">
                </div>` 
            : ""}
            
            <div class="card-body d-flex flex-column justify-content-center p-3" style="width: 60%;">
                <h6 class="card-title fw-bold text-dark mb-1" style="font-size: 14px;">${post.title || "Untitled Post"}</h6>
                <p class="card-text text-muted mb-1" style="font-size: 12px; line-height: 1.2;">${post.description}</p>
                <p class="text-muted small mb-0" style="font-size: 10px;">Posted on: ${createdAt}</p>
            </div>
        </div>
    </div>
`;


      cardContainer.innerHTML += cardHTML;
  });
}
