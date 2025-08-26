self.addEventListener("install", () => console.log("Service Worker installed"));
self.addEventListener("activate", () => console.log("Service Worker activated"));

self.addEventListener("push", event => {
  const data = event.data.json();
  self.registration.showNotification(data.title, {
    body: data.message,
    icon: "/icons/icon-192.png"
  });
});
