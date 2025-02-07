import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js";
import { auth, db } from "./firebaseConfig.js";
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";



let userName = document.querySelector("#user-profile-name");
let userProfileImg = document.querySelector("#user-profile-img");
const logbtn = document.querySelector("#logout-btnCORRECT");

onAuthStateChanged(auth,async (user) => {
  if (user) {
    console.log(auth.currentUser.uid) // Ya id current user k id hai jo login howa hia 
    const uid = user.uid;
    console.log(uid)
    let userdata = await getDatafromfirebasedb();
     userName.innerHTML = userdata.fullName;
     userProfileImg.src = userdata.profileImg;
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