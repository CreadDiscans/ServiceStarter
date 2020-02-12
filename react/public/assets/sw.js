importScripts('https://www.gstatic.com/firebasejs/7.8.1/firebase-app.js'); 
importScripts('https://www.gstatic.com/firebasejs/7.8.1/firebase-messaging.js'); 

firebase.initializeApp({ 
    apiKey: "AIzaSyCmfVBPAbeU76f-M1jpkMbOvuqJ1eF-dBE",
    authDomain: "servicestarter-770d0.firebaseapp.com",
    databaseURL: "https://servicestarter-770d0.firebaseio.com",
    projectId: "servicestarter-770d0",
    storageBucket: "servicestarter-770d0.appspot.com",
    messagingSenderId: "460789091763",
    appId: "1:460789091763:web:358e2a97967b45caff0fc6",
    measurementId: "G-4QT1LCRVJ0"
}); 
const messaging = firebase.messaging(); 

self.addEventListener('push', function(event) { 
    const payload = event.data.json(); 
    const title = payload.notification.title; 
    const options = { 
        body: payload.notification.body, 
        icon: payload.notification.icon, 
        data: payload.notification.click_action 
    }; 
    event.waitUntil(self.registration.showNotification(title, options)); 
}); 
    
self.addEventListener('notificationclick', function(event) { 
    console.log(event.notification); 
    event.notification.close(); 
    event.waitUntil( 
        clients.openWindow(event.notification.data) 
    ); 
});
