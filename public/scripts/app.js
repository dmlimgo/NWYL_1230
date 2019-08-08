'use strict';

setTimeout(() => {

    // api키등록, 버튼 선언
    const applicationServerPublicKey = 'BCc7XBb-21i5PNbkcqYGcQ_3Y_LCQbuTy4Tni9-Y6Sr27cu-rGtNRP8JktJXmN0RH2EFaLxbKRha4HdB3pl6GMg';
    const pushButton = document.querySelector('#subscribe');
    console.log(pushButton);


    // 전역 변수 선언
    let isSubscribed = false;
    let swRegistration = null;

    // api키 디코더
    function urlB64ToUint8Array(base64String) {
      const padding = '='.repeat((4 - base64String.length % 4) % 4);
      const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

      const rawData = window.atob(base64);
      const outputArray = new Uint8Array(rawData.length);

      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
      }
      return outputArray;
    }

    // 서비스 워커 등록
    if ('serviceWorker' in navigator && 'PushManager' in window) {
        console.log('Service Worker and Push is supported');

        navigator.serviceWorker.register('sw.js')
        .then(function(swReg) {
            console.log('Service Worker is registered', swReg);
      
            swRegistration = swReg;
            initializeUI();
        })
        .catch(function(error) {
            console.error('Service Worker Error', error);
        });
    } else {
        console.warn('Push messaging is not supported');
        pushButton.textContent = 'Push Not Supported';
    }

    // UI 초기화 및 버튼클릭이벤트 추가
    function initializeUI() {
        pushButton.addEventListener('click', function() {
            pushButton.disabled = true;
            if (isSubscribed) {
              unsubscribeUser();
            } else {
              subscribeUser();
            }
        });

        // Set the initial subscription value
        swRegistration.pushManager.getSubscription()
        .then(function(subscription) {
        isSubscribed = !(subscription === null);

        if (isSubscribed) {
            console.log('User IS subscribed.');
        } else {
            console.log('User is NOT subscribed.');
        }

        updateBtn();
      });
    }

    // 사용자 구독 메서드
    function subscribeUser() {
        // pushManager의 subscribe()메서드를 호출하여 api 공개키와 userVisibleOnly: true 제출
        // userVisibleOnly 매개변수는 푸시가 전송될 때마다 알림을 표시하도록 허용
        const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
        swRegistration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: applicationServerKey
        })
        .then(function(subscription) {
            console.log('User is subscribed:', subscription);
            updateSubscriptionOnServer(subscription);
            isSubscribed = true;
            updateBtn();
        })
        .catch(function(err) {
            console.log('Failed to subscribe the user: ', err);
            updateBtn();
        });
    }

    // 사용자 구독 취소 메서드
    function unsubscribeUser() {
        swRegistration.pushManager.getSubscription()
        .then(function(subscription) {
            if (subscription) {
              return subscription.unsubscribe();
            }
        })
        .catch(function(error) {
            console.log('Error unsubscribing', error);
        })
        .then(function() {
            updateSubscriptionOnServer(null);
            console.log('User is unsubscribed.');
            isSubscribed = false;
            updateBtn();
        });
    }

    // 실제 애플리케이션에서 백엔드로 구독을 보내는 메서드, 알림 전송을 위한 
    function updateSubscriptionOnServer(subscription) {
        // TODO: Send subscription to application server

        const subscriptionJson = document.querySelector('.js-subscription-json');
        const subscriptionDetails =
            document.querySelector('.js-subscription-details');

        if (subscription) {
            subscriptionJson.textContent = JSON.stringify(subscription);
            subscriptionDetails.classList.remove('is-invisible');
        } else {
            subscriptionDetails.classList.add('is-invisible');
        }
    }

    // 버튼 글자 업데이트
    function updateBtn() {
      // 사용자가 권한 요청을 차단할 경우
      if (Notification.permission === 'denied') {
          pushButton.textContent = '알림차단';
          pushButton.disabled = true;
          updateSubscriptionOnServer(null);
          return;
      }

      if (isSubscribed) {
          pushButton.textContent = '구독취소';
      } else {
          pushButton.textContent = '구독하기';
      }

      pushButton.disabled = false;
    }

}, 500);