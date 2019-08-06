import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import store from '../store'

const POSTS = 'posts'
const PORTFOLIOS = 'portfolios'

// Setup Firebase
const config = {
	apiKey: "AIzaSyAkuq-JbKzXNSx6zWNjeT6pGxGal6GPZJ8",
	authDomain: "spatial-framing-246206.firebaseapp.com",
	databaseURL: "https://spatial-framing-246206.firebaseio.com",
	projectId: "spatial-framing-246206",
	storageBucket: "spatial-framing-246206.appspot.com",
	messagingSenderId: "478331739090",
	appId: "1:478331739090:web:72cc71c0c7ccbdb0"
}

firebase.initializeApp(config)
const firestore = firebase.firestore()

// firestore.settings({timestampsInSnapshots: true})
export { firestore };

// 로그인, 로그아웃 상태를 감지
firebase.auth().onAuthStateChanged(function(user) {
	if(user != null) {
		// 로그인된 상태
		store.dispatch('getUser', user)
	}else {
		// 로그아웃된 상태
		//console.log("로그아웃 상태입니다.")
	}
})

export default {
	getPosts() {
		const postsCollection = firestore.collection(POSTS)
		return postsCollection
				.orderBy('created_at', 'desc')
				.get()
				.then((docSnapshots) => {
					return docSnapshots.docs.map((doc) => {
						let data = doc.data()
						data.created_at = new Date(data.created_at.toDate())
						return data
					})
				})
	},
	postPost(title, body) {
		return firestore.collection(POSTS).add({
			title,
			body,
			created_at: firebase.firestore.FieldValue.serverTimestamp()
		})
	},
	getPortfolios() {
		const postsCollection = firestore.collection(PORTFOLIOS)
		return postsCollection
				.orderBy('created_at', 'desc')
				.get()
				.then((docSnapshots) => {
					return docSnapshots.docs.map((doc) => {
						let data = doc.data()
						data.created_at = new Date(data.created_at.toDate())
						return data
					})
				})
	},
	postPortfolio(title, body, imgSrc) {
		return firestore.collection(PORTFOLIOS).add({
			title,
			body,
			imgSrc,
			created_at: firebase.firestore.FieldValue.serverTimestamp()
		})
	},
	getMenus() {
		const menusCollection = firestore.collection('menus')
		return menusCollection
				.orderBy('name', 'desc')
				.get()
				.then((docSnapshots) => {
					return docSnapshots.docs.map((doc) => {
						let data = doc.data()
						return data
					})
				})
	},
  // 회원가입을 통해 생성한 계정으로 로그인하기
  signInWithEmailAndPassword(email, password) {
    return firebase.auth().signInWithEmailAndPassword(email, password).then(function(result) {
      	return result
    })
    .catch(function(error) {
		let errorCode = error.code;
		let errorMessage = error.message;
		if(errorCode === 'auth/wrong-password') {
			alert('Wrong password.');
		} else {
			alert(errorMessage);
		}
		console.error('[SignIn Error]',error)
    })
  },
  // 구글 계정으로 로그인하기 (팝업)
	loginWithGoogle() {
		let provider = new firebase.auth.GoogleAuthProvider()
		return firebase.auth().signInWithPopup(provider).then(function(result) {
			// let accessToken = result.credential.accessToken
			// let user = result.user
			return result
		}).catch(function(error) {
			console.error('[Google Login Error]', error)
		})
	},
  // 페이스북 계정으로 로그인하기 (팝업)
	loginWithFacebook() {
		let provider = new firebase.auth.FacebookAuthProvider()
		return firebase.auth().signInWithPopup(provider).then(function(result) {
			return result
		}).catch(function(error) {
			console.error('[Facebook Login Error]', error)
		})
	},
	loginWithEmailAndPassword(email, password) {
		return firebase.auth().signInWithEmailAndPassword(email, password).then(function(result) {
		  return result
		})
		.catch(function(error) {
		  let errorCode = error.code;
		  let errorMessage = error.message;
		  if(errorCode === 'auth/wrong-password') {
			alert('Wrong password.');
		  } else {
			alert(errorMessage);
		  }
		  console.error('[SignIn Error]',error)
		})
	  },
	createUserWithEmailAndPassword(email, password, name) {
		return firebase.auth().createUserWithEmailAndPassword(email, password).then(function(result) {
			if (result) {
				result.user.updateProfile({
					displayName: name
				}).then()
				alert("회원가입 성공!");
			}
			return result
		})
		.catch(function(error) {
			let errorCode = error.code;
			let errorMessage = error.message;
			if(errorCode === 'auth/email-already-in-use') {
				alert('이미 사용중인 e-mail 입니다.');
			}
			else {
				alert(errorMessage);
			}
			console.error('[SignUp Error]',error)
		})
	},
  // 로그아웃
	signOut() {
		firebase.auth().signOut().then(function() {
			alert("로그아웃 되었습니다.")
			store.dispatch('afterLogout', '')
			// Sign-out successful.
		}).catch(function(error) {
			console.error('[SignOut Error]',error)
		})
  },
	currnetUser() {
		return firebase.auth().currentUser
	},
}
