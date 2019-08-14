<template>
    <div id="admin-menuinfo" class="admin-content-wrapper">
        <div class="admin-fullbox">
            <div class="admin-box-header">
                <div class="admin-header-title">
                    메뉴 정보
                </div>
                <AddMenuAdmin v-if="($store.state.admin===true) && (1)"/>
            </div>
            <!-- <AddMenu v-if="$store.state.admin===true" style="margin-top:10px; margin-bottom:10px"></AddMenu> -->
            <MenuModal v-show="$store.state.menuname!==''" />
            <EditMenuModal></EditMenuModal>
            <div class="admin-menuinfo-box">
                <div v-for="menu in menus" :menu="menu" :key="menu.id" v-bind:ID="menu.id" class="admin-menuinfo-list">
                    <li>{{menu.name}} 
                        <span style="margin-left:40px">{{menu.uploadUser}}</span>
                        <a id="modal-button" class="button" href="#menu-modal" @click="menuidfunction(menu.id); commentfunction(); scorefunction()">
                            리뷰 보기
                        </a>
                        <a v-if="$store.state.admin===true" id="modal-button" class="button" href="#menu-edit-modal" @click="editMenuId(menu.id);">
                            수정
                        </a>
                        <a v-if="$store.state.admin===true" id="modal-button" class="button" @click="menuDelete(menu.id);">
                            삭제
                        </a>
                    </li>
                </div>
            </div>
            <!-- <li v-for="menu in menus" :menu="menu" :key="menu.id" v-bind:ID="menu.id"/>{{ menu.name }}</li> -->
        </div>
    </div>
</template>

<script>
import store from '@/store.js'
import FirebaseService from '@/services/FirebaseService'
import MenuModal from '@/components/menu/MenuModal'
import firebase from 'firebase/app'
import EditMenuModal from '@/components/menu/EditMenuModal'
import AddMenuAdmin from '@/components/menu/AddMenuAdmin'

const db = firebase.firestore();

export default {
    name: "AdminMenuInfo",
    components: {
        MenuModal,
        EditMenuModal,
        AddMenuAdmin,
    },
    data() {
        return {
            menus: [],
        }
    },
    mounted() {
        this.getMenus()
	},
	methods: {
		async getMenus() {
            this.menus = await FirebaseService.getMenus()
        },
                menuidfunction(a) {
            store.state.menuname = ''
            store.state.menuimg = ''
            store.state.menutag = ''

            store.state.menuid = a
            var docRef = db.collection("menus").doc(store.state.menuid);
            docRef.get().then(function(doc) {
                if (doc.exists) {
                    // console.log("MENUS data:", doc.data());
                    store.state.menuname = doc.data().name
                    store.state.menuimg = doc.data().image
                    // console.log(doc.data().tags)
                    store.state.menutag = doc.data().tags
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such MENUS!");
                }
                }).catch(function(error) {
                    console.log("Error getting MENUS:", error);
                });
        },
        editMenuId(a) {
            store.state.menuid = a
        },
        commentfunction() {
            const collection = db.collection('menus').doc(store.state.menuid).collection("comments").orderBy("created_at", "desc");
            // console.log('commentfucntion:',collection)
            collection.onSnapshot(snapshot => {
                store.state.menucomments = []
                store.state.commentId = []
                store.state.commentUserId = []
                store.state.commentScore = 0
                store.state.commentUserTF = false
                var commentL = 0
                snapshot.forEach(doc => {
                commentL += 1
                store.state.menucomments.push(doc.data().comment)
                store.state.commentId.push(doc.data().id)
                store.state.commentUserId.push(doc.data().userInfo)
                store.state.commentScore += Number(doc.data().score)
                });
                if((store.state.commentUserId).includes(store.state.user.uid)){
                    store.state.commentUserTF = true
                }
                else{
                    store.state.commentUserTF = false
                }
         
                // console.log("score 합 : ",store.state.commentScore)
                // console.log('commentL : ',commentL)
                // console.log('유저 리스트?')
                // console.log(store.state.commentUserId)
                // console.log('나의 uid')
                // console.log(store.state.user.uid)
                var res = store.state.commentScore/commentL
                res = res.toFixed(1)
                // console.log("avg : ",res)
                document.getElementById(store.state.menuid).style.width = res*20 + "%";
                db.collection('menus').doc(store.state.menuid).update({score:Number(res)})
                });
        },
        scorefunction(){
            const collection = db.collection('menus').doc(store.state.menuid)
            collection.onSnapshot(function(doc){
                // console.log("Current score: ", doc.data().score)
            })
        },
        menuDelete(a){
            // console.log(a)
            db.collection("menus").doc(a).delete().then(function() {
                console.log("Document successfully deleted!");
                location.href="/adminview"
                store.state.contentstate = 'admin-menuinfo'
                console.log(store.state.contentstate)
            }).catch(function(error) {
                console.error("Error removing document: ", error);
            })
        },
        // changeState() {
        //     store.state.contentstate = 'admin-menuinfo'
        // }
    }
}
</script>

<style lang="scss">
@import './AdminMenuInfo.scss';
</style>
