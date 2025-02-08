import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js";
import { auth, db } from "./firebaseConfig.js";
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";



let userName = document.querySelector("#user-profile-name");
let userProfileImg = document.querySelector("#user-profile-img");
const logbtn = document.querySelector("#logout-btnCORRECT");
const showblogs = document.querySelector(".container");
let blogsarray = [];
onAuthStateChanged(auth,async (user) => {
  if (user) {
    console.log(auth.currentUser.uid) // Ya id current user k id hai jo login howa hia 
    const uid = user.uid;
    console.log(uid)
    let userdata = await getDatafromfirebasedb();
     userName.innerHTML = userdata.fullName;
     userProfileImg.src = userdata.profileImg;
     let blogs = await getBlogsDataFromFirebaseDB();
     renderBlogOnScreen(blogs);
  } else {
    window.location = 'login.html'
  }
});


async function getDatafromfirebasedb(){
let user = null;
const q = query(collection(db, "users"), where("uid", "==", auth.currentUser.uid));
const querySnapshot = await getDocs(q);
querySnapshot.forEach((doc) => {

  console.log(doc.id, " => ", doc.data());
   user =  doc.data()

});

return user



}

async function getBlogsDataFromFirebaseDB() {
  const querySnapshot = await getDocs(collection(db, "usersblog"));
   blogsarray = [];

  querySnapshot.forEach((doc) => {
    console.log(doc.id, " => ", doc.data());
    console.log(doc.data())
    blogsarray.push(doc.data());
  });

  return blogsarray;
}

function renderBlogOnScreen(blogs) {
  const blogContainer = document.getElementById("blog-container");
  blogContainer.innerHTML = "";

  blogs.forEach((res) => {
      let card = document.createElement("div");
      card.classList.add("col-md-4");
      let imageSrc = res.profileImg ? res.profileImg : "";
      let title = res.title ? res.title : "";
      let description = res.description ? res.description : "";
      card.innerHTML = `
          <div class="card h-100 shadow-sm border-0">
             <img src="${imageSrc}" class="card-img-top" alt="Blog Image" style="height:200px; border-rounded object-fit:contain; width: 100%;">
              <div class="card-body">
                  <h5 class="card-title fw-bold">${title}</h5>
                  <p class="card-text text-muted">${description}</p>
              </div>
          </div>
      `;
      blogContainer.appendChild(card);
  });
}


renderBlogOnScreen(blogsarray);



logbtn.addEventListener("click",(e)=>{
    e.preventDefault();
signOut(auth).then(() => {
 // Sign-out successful.
 console.log("user Sign-out successful ");
 window.location = 'login.html'
}).catch((error) => {
 // An error happened.
 console.log(error)
});
})