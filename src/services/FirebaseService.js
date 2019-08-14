import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import store from '../store'
import 'firebase/functions'

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

/// admin 기능 추가 ///
const functions = firebase.functions()

// firestore.settings({timestampsInSnapshots: true})
export { firestore };

// 로그인, 로그아웃 상태를 감지
firebase.auth().onAuthStateChanged(function(user) {
	if(user) {  //// 로그인된 상태
	
		// 회원가입 후, 바로 store.js에 저장하지 않는다. displayName의 update가 이뤄진 다음에 저장!
		if(user.displayName != null) {
			store.dispatch('getUser', user)
		}
	}else {    /// 로그아웃된 상태
		store.dispatch('setGuest')
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
		// console.log('모두다')
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
	getSelectMenus(a) {
		console.log('지역')
		const menusCollection = firestore.collection('menus')
		return menusCollection.where("selected", "==", a)
				.get()
				.then((docSnapshots) => {
					return docSnapshots.docs.map((doc) => {
						let data = doc.data()
						console.log(data)
						return data
					})
				})
	},
	getSelectTags(a) {
		return a.get().then((docSnapshots) => {
			return docSnapshots.docs.map((doc) => {
				let data = doc.data()
				console.log(data)
				return data
			})
		})
	},
  // 회원가입을 통해 생성한 계정으로 로그인하기
  	signInWithEmailAndPassword(email, password) {
		return firebase.auth().signInWithEmailAndPassword(email, password).then(function(result) {
			store.dispatch('getUser', result.user)
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
			store.dispatch('getUser', result.user)
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
			store.dispatch('getUser', result.user)
			return result
		}).catch(function(error) {
			console.error('[Facebook Login Error]', error)
		})
	},

	// signUp으로 생성한 계정으로 로그인하기
	loginWithEmailAndPassword(email, password) {
		return firebase.auth().signInWithEmailAndPassword(email, password).then(function(result) {
			store.dispatch('getUser', result.user)
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

	// email, password로 사용자 계정 생성하기
	createUserWithEmailAndPassword(email, password, name) {
		return firebase.auth().createUserWithEmailAndPassword(email, password)
		.then(
			(result) => {
				result.user.updateProfile({
					displayName : name
				}).then(
					() => {
						store.dispatch('getUser', result.user)
					}
				)
			}
		)   
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

			// store.js에 저장된 User 정보를 없앤다.
			store.dispatch('afterLogout', '')
			// Sign-out successful.
		}).catch(function(error) {
			console.error('[SignOut Error]',error)
		})
  	},

	// admin
	getLogs() {
		const logsCollection = firestore.collection('LOG')
		return logsCollection
				.orderBy('time', 'desc')
				.get()
				.then((docSnapshots) => {
					return docSnapshots.docs.map((doc) => {
						let data = doc.data()
						return data
					})
				})
	},

  	// 현재 로그인된 유저정보를 반환
	currnetUser() {
		return firebase.auth().currentUser
	},

	// 관리자 권한 부여하기
	createAdmin(admin_email) {
		const addAdminRole = functions.httpsCallable('addAdminRole')
		return addAdminRole( {
			email : admin_email
		}).then(result => {
			alert("관리자 권한 부여")
		})
	},

	// 관리자 권한 박탈하기
	deleteAdmin(admin_email) {
		const deleteAdminRole = functions.httpsCallable('deleteAdminRole')
		return deleteAdminRole( {
			email : admin_email
		}).then(result => {
			alert("관리자 권한 회수")
		})
	},

	// 현재 로그인된 사용자가 관리자인지 확인하기
	isAdmin() {
		const user = firebase.auth().currentUser
		user.getIdTokenResult().then(idTokenResult => {
			//console.log(idTokenResult.claims.admin)
			 if(idTokenResult.claims.admin == true) {
				 return true
			 }
		}).catch(err => {
			console.log(err)
		}) 
	},

	// 사이트 회원 정보 가져오기 (관리자 페이지에서 사용)
	getUserList() {
		const userList = functions.httpsCallable('userList')
		return userList()
		.then(data => {
			//alert("성공      " + data.data[1].customClaims.admin)
			// console.log(data)
			return data.data
		})
		.catch(err => {
			alert("실패      " + err)
		})
	},

	// 관리자 권한으로 회원 탈퇴시키기 
	deleteUser(user_email) {
		const deleteUser = functions.httpsCallable('deleteUser')
		return deleteUser( {
			email : user_email
		})
		.then(result => {
			alert("회원 삭제 성공")
		})
		.catch(err => {
			alert(err)
		})
	}
}
