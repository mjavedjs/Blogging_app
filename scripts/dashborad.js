import { auth, db } from "./firebaseConfig.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";

let uploadedImageUrl = "";


var myWidget = cloudinary.createUploadWidget({
    cloudName: 'dhro6nafp', 
    uploadPreset: 'my_preset'}, (error, result) => { 
      if (!error && result && result.event === "success") { 
        console.log('Done! Here is the image info: ', result.info); 
        uploadedImageUrl = result.info.secure_url
      }
    }
  )
  
  document.getElementById("upload_widget").addEventListener("click", function(e){
    e.preventDefault()
      myWidget.open();
    }, false);




const form = document.querySelector("#form");

form.addEventListener("submit",async (e)=>{
     e.preventDefault();
     const title = document.querySelector("#title");
     const description = document.querySelector("#description");

      try {
             const docRef = await addDoc(collection(db, "usersblog"), {
                 title:title.value,
                 description: description.value,
                 profileImg:uploadedImageUrl,
                 createdAt: new Date()

             });
            
             console.log("Document written with ID are sumbit of dashborad: ", docRef.id);
             window.location = 'index.html'
         } 
         catch (e) {
             console.error("Error adding document: ", e);
         }
     
})
