import Rebase from 're-base';
import firebase from 'firebase';

const config = {
    apiKey: "AIzaSyBUJFcKOgUGmBhHG5DZ5bytgborProgPqM",
    authDomain: "corded-fact-87610.firebaseapp.com",
    databaseURL: "https://corded-fact-87610.firebaseio.com",
    projectId: "corded-fact-87610",
    storageBucket: "corded-fact-87610.appspot.com",
    messagingSenderId: "684510160957"
};

const fireConfig = firebase.initializeApp(config);
const base = Rebase.createClass(fireConfig.database());

export default base;