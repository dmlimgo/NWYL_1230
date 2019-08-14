import Vue from 'vue'
import Vuex from 'vuex'
import { firestore } from '@/services/FirebaseService'
Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        accessToken: '',
        user: '',
        admin: 'ab',                // 관리자 == true,  일반회원 == false, 방문자 == ''
        imgSrc: '',
        menuid: '',
        menuname: '',
        menuimg: '',
        menutag: [],
        menucomments: [],
        menucommentsScore: [],
        commentId: [],
        commentUserId: [],
        commentScore: 0,
        commentUserTF: false,
        commentEditId:'',
        selected:'',
        selectedState: false,
        // contentstate:'',
        selectTag:[false, false, false, false, false, false, false, false],
        // selectTag:{
        //     stirfry: false,
        //     noodle: false,
        //     soup: false,
        //     rice: false,
        //     meat: false,
        //     vegetable: false,
        //     fruit: false,
        //     etc: false
        // },
        imgToDB: {
            imglink: '',
            user_email: '',
        },
        vueName: {
            page: '',
            userid: '',
            time: ''
        }
    },
    mutations: {
        setUser(state, user) {
            state.user = user
        },
        setToken(state, accessToken) {
            state.accessToken = accessToken
        },
        setAdmin(state, isadmin) {
            state.admin = isadmin
        },
        addLog (state) {
            firestore.collection('LOG').add(state.vueName).then(() => {
                console.log('added LOG!!')
            })
        }
    },
    actions: {
        getUser({commit}, user){                // 사용자 로그인 후, state.user , accessToken, admin을 설정
            commit('setUser', user)
            user.getIdTokenResult().then(idTokenResult => {
                if(idTokenResult.claims.admin) {
                    commit('setAdmin', true)
                }else{
                    commit('setAdmin', false)
                }
            }).catch(error => {
                console.error('[getIdTokenResult Error]',error)
            })
            user.getIdToken().then(accessToken => {
                commit('setToken', accessToken)
            }).catch(error=> {
                console.error('[getIdToken Error]',error)
            })
        },
        setGuest({commit}) {                   // 방문자인 경우, state.admin을 따로 설정해야 함 
            commit('setAdmin', '')
        },
        afterLogout({commit}, user) {
            commit('setUser', user)
            commit('setToken', user)
            commit('setAdmin', '')
        },
        addLog (aa) {
            aa.commit('addLog')
        }
    },
})
