importScripts('https://www.gstatic.com/firebasejs/7.8.1/firebase-app.js'); 
importScripts('https://www.gstatic.com/firebasejs/7.8.1/firebase-messaging.js'); 

firebase.initializeApp({ 
    'messagingSenderId': '460789091763' 
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
