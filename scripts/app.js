import {
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js";
import { auth, db } from "./firebaseConfig.js";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";

let userName = document.querySelector("#user-profile-name");
let userProfileImg = document.querySelector("#user-profile-img");
const logbtn = document.querySelector("#logout-btn1");
const showblogs = document.querySelector(".container");
let blogsarray = [];

onAuthStateChanged(auth, async (user) => {
  if (user) {
    console.log(auth.currentUser.uid); // Ya id current user k id hai jo login howa hia
    const uid = user.uid;

    console.log(uid);

    let userdata = await getDatafromfirebasedb();

    userName.innerHTML = userdata.fullName;

    userProfileImg.src = userdata.profileImg;

    let blogs = await getBlogsDataFromFirebaseDB();
    renderBlogOnScreen(blogs);
    let storedName = localStorage.getItem("updatedUserName");
    if (storedName) {
      userName.innerHTML = storedName; // Use updated name
      // localStorage.removeItem("updatedUserName"); // Remove to avoid reusing old name
    } else {
      userName.innerHTML = userData.userName;
    }
  }

  else { window.location = "login.html";}
});

async function getDatafromfirebasedb() {
  let user = null;
  const q = query(
    collection(db, "users"),
    where("uid", "==", auth.currentUser.uid)
  );
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    console.log(doc.id, " => ", doc.data());
    user = doc.data();
  });

  return user;
}

async function getBlogsDataFromFirebaseDB() {
  const q = query(collection(db, "usersblog"), orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);

  blogsarray = [];

  querySnapshot.forEach((doc) => {
    console.log(doc.id, " => ", doc.data());
    console.log(doc.data());
    blogsarray.push(doc.data());
  });

  return blogsarray;
}

function renderBlogOnScreen(blogs) {
  const blogContainer = document.getElementById("blog-container");
  blogContainer.innerHTML = ""; // Clear previous content
  blogs.forEach((res) => {
    let card = document.createElement("div");
    card.classList.add(
      "col-lg-8",
      "col-md-10",
      "col-sm-12",
      "d-flex",
      "justify-content-center",
      "mb-4"
    );

    let cardInner = document.createElement("div");
    cardInner.classList.add(
      "card",
      "shadow-lg",
      "border-0",
      "rounded-4",
      "overflow-hidden",
      "d-flex",
      "flex-md-row",
      "flex-column"
    );
    cardInner.style.width = "80%";
    cardInner.style.maxWidth = "700px";
    cardInner.style.minHeight = "250px";

    let imageSrc = res.profileImg
      ? res.profileImg
      : "https://via.placeholder.com/150"; // Default image
    let imageHtml = ` <div class="card-img-container" style="width: 40%; min-height: 250px;"> <img src="${imageSrc}" class="card-img" alt="Blog Image"  style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px 0 0 8px;"> </div>`;
    let titleHtml = res.title
      ? `<h5 class="card-title fw-bold text-dark">${res.title}</h5>`
      : "";
    let descriptionHtml = res.description
      ? `<p class="card-text text-muted small">${res.description}</p>`
      : "";

      let createdAt = res.createdAt
      ? new Date(res.createdAt.seconds * 1000).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "Unknown Date";
    

    let cardBodyHtml = `
        <div class="card-body d-flex flex-column justify-content-center p-4" style="width: 60%;">
        
         <p class="text-muted small mb-2" style="font-size: 12px;"> Posted on: ${createdAt}</p>

            ${titleHtml}
            ${descriptionHtml}
        </div>
    `;  

    if (imageHtml || titleHtml || descriptionHtml) {
      cardInner.innerHTML = `${imageHtml}${cardBodyHtml}`;
      card.appendChild(cardInner);
      blogContainer.appendChild(card);
    }
  });
}


renderBlogOnScreen(blogsarray);

logbtn.addEventListener("click", (e) => {
  e.preventDefault();
  signOut(auth)
    .then(() => {
      // Sign-out successful.
      console.log("user Sign-out successful ");
      window.location = "login.html";
    })
    .catch((error) => {
      // An error happened.
      console.log(error);
    });
});
