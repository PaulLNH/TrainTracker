// Initialize Firebase
var config = {
  apiKey: "AIzaSyCjdSrvzFYdeaDAVqmPadJVOrSnjNOLGm4",
  authDomain: "traintracker-2b358.firebaseapp.com",
  databaseURL: "https://traintracker-2b358.firebaseio.com",
  projectId: "traintracker-2b358",
  storageBucket: "traintracker-2b358.appspot.com",
  messagingSenderId: "666867210918"
};
firebase.initializeApp(config);

var dataRef = firebase.database();
