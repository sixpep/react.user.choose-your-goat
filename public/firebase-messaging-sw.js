// Instead of `import` statements, use these:
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

// Initialize Firebase
firebase.initializeApp({
  apiKey: "AIzaSyCb_wY3T-iSJsOKJVKaQQW2uj2_pKov-v0",
  authDomain: "choose-your-goat.firebaseapp.com",
  projectId: "choose-your-goat",
  messagingSenderId: "636547426141",
  appId: "1:636547426141:web:d119716b29324503ef6ab4",
});

// Retrieve messaging instance
const messaging = firebase.messaging();

// Background message handler
messaging.onBackgroundMessage(function (payload) {
  console.log("Received background message ", payload);

  const notificationTitle = payload.data?.title || "New Alert!";
  const notificationOptions = {
    body: payload.data?.body || "You've got something new!",
    icon: payload.data?.icon || "/images/goatDp.png",
    data: {
      url: payload.data?.click_action || "https://truemeat.shop",
    },
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  const urlToOpen = event.notification.data?.url || "/";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      // If a window/tab is already open, focus it
      for (let client of windowClients) {
        if (client.url === urlToOpen && "focus" in client) {
          return client.focus();
        }
      }
      // Otherwise open a new tab
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
