// 'use strict';

// 푸쉬알림 제목 및 내용
self.addEventListener('push', function(event) {
    console.log('[Service Worker] Push Received.');
    console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

    // var payload = event.data.json();
    // const title = payload.title;
    const title = '오늘의 식단표는??';

    const options = {
        // body: payload.body,
        body: '지금 접속해서 확인해보세요!!',
        icon: 'img/menu-1.png',
        badge: 'img/badge.png',
        vibrate: [200, 100, 200, 100, 200, 100, 400],
        // data: payload.params
    };
    event.waitUntil(self.registration.showNotification(title, options));
});

// 푸쉬알림 클릭 시 링크
self.addEventListener('notificationclick', function(event) {
    console.log('[Service Worker] Notification click Received.');
  
    var data = event.notification.data;
    event.notification.close();
    event.waitUntil(
        // clients.openWindow(data.url)
        clients.openWindow('http://localhost:8080/weeklymenu')
    );
});