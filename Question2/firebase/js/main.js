var userProfile = '';

var config = {
  apiKey: "AIzaSyAX4Ul_GOC5AVOAFw3XsyO5tsV5gOeFGdU",
  authDomain: "fir-proyect-4c9c9.firebaseapp.com",
  databaseURL: "https://fir-proyect-4c9c9.firebaseio.com",
  projectId: "fir-proyect-4c9c9",
  storageBucket: "fir-proyect-4c9c9.appspot.com",
  messagingSenderId: "1020591082510"
};
firebase.initializeApp(config);
document.getElementById("login").addEventListener("click", function() {

  var provider = new firebase.auth.FacebookAuthProvider();
  firebase.auth().signInWithPopup(provider).then(function(result) {

    var token = result.credential.accesToken;
    userProfile = result.user;
    //      console.log(userProfile);
    localStorage.setItem("user", JSON.stringify(userProfile));
    document.getElementById("login-screen").style.display = 'none';
    document.getElementById("chat-screen").style.display = 'block';
    document.getElementById("image-chat-loaded").src = userProfile.photoURL;
    document.getElementById("hi").innerHTML = ` ${userProfile.displayName}`;

    loadAllMessages();

  }).catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    var email = error.mail;
    var credential = error.credential;
    alert('error logging in');
    console.log(error);

  });

});
// after login
document.getElementById('message-imput').addEventListener('keypress', function(event) {
  if (event.keyCode === 13) {
    // console.log(event.target.value);
databaseRun();

  }
  // console.log(event.keyCode)
})
document.getElementById('send-message').addEventListener("click", function() {
databaseRun();
});
 function databaseRun(){
   var newPostKey = firebase.database().ref().child('posts').push().key;
   var date = new Date();
var hour = date.getHours();
var med='AM';
if(hour>12){
  hour=hour-12;
  med='PM'

}
var min = date.getMinutes();
var timemessage= `${(hour)}:${min} ${med}`;
console.log(timemessage);
   firebase.database().ref().push({

       username: String(userProfile.displayName),
       message: document.getElementById('message-imput').value,
       profileImage: userProfile.photoURL,
       time: String(timemessage)

     })
     .then(res => console.log(res));
   document.getElementById('message-imput').value = '';
 }
function loadAllMessages() {
  firebase.database().ref().on("value", function(snapshot) {


    //    console.log(snapshot.val());
    var msgDiv = document.getElementById("messages");
    var messages = snapshot.val();
    var appendStr = '';
    // var username= JSON.parse(localStorage.getItem('user')).displayName;
    for (k in messages) {
      // console.log(localStorage.getItem('user'));

      appendStr +=
        `<div class="${messages[k].username == userProfile.displayName ? 'textright':'textleft'} messageSended"><p>${messages[k].message}</p>
     <img src="${messages[k].profileImage}" id="${messages[k].username == userProfile.displayName ? 'imageprofileright':'imageprofileleft'}" class="image_profile">
<em>${messages[k].time}</em>
</div>
    `;

    }
    msgDiv.innerHTML = appendStr;
    gotoBottom("chat-screen")

  })
}

function gotoBottom(id) {
  var element = document.getElementById(id);
  element.scrollTop = element.scrollHeight - element.clientHeight;
}
