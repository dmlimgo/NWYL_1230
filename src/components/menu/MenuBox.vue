<template>
    <a id="modal-button" href="#menu-modal" @click="menuidfunction(menu.id); commentfunction(); scorefunction()">            
        <div class="menu-box">
            <div class="menu-title">
                {{ menu.name }}
            </div>
            <div class="menu-image">
                <img :src="menu.image" style="height: 100%;" alt="menu_detail_image">
            </div>
            <!-- <ul class="menu-tags" style="margin-top: 10px">
                <li v-for="tag in menu.tags" :tag="tag" :key="tag.id" class="tag">
                    {{ tag }}
                </li>
            </ul> -->
            <div class="menu-favorite">
                <div class="star-ratings-css">
                <div v-bind:id="menu.id" class="star-ratings-css-top" style="width: 0%"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div>
                <div class="star-ratings-css-bottom">
                    <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div>
                </div>
            </div>
            <!-- <div class='rating' style='width:40%;'></div> -->
            <div class="menu-more">
                <a v-if="$store.state.admin===true" id="modal-button" class="button" href="#menu-edit-modal" @click="editMenuId(menu.id);">
                    수정
                </a>
                <a v-if="$store.state.admin===true" id="modal-button" class="button" @click="menuDelete(menu.id)">
                    삭제
                </a>
            </div>
        </div>
    </a>
</template>

<script>
import MenuModal from './MenuModal'
import store from '@/store.js'
import firebase from 'firebase/app'
import EditMenuModal from './EditMenuModal'

const db = firebase.firestore();

export default {
    name: 'MenuBox',
    data() {
        return {

        }
    },
    props: {
        menu: Object,
        ID: String
    },
    components: {
        MenuModal,
        EditMenuModal
    },
    mounted(){
        if(store.state.admin===true){
            var all = document.getElementsByClassName('menu-box');
            for (var i = 0; i < all.length; i++) {
                all[i].style.height = "350px"
            }
        }
        var docRef = db.collection("menus").doc(this.ID)
        docRef.get().then(function(doc) {
            if (doc.exists) {
                document.getElementById(doc.data().id).style.width = doc.data().score*20 + "%";
                // console.log(doc.data().score);
            } else {
                // doc.data() will be undefined in this case
                console.log("No such MENUS!");
            }
            })   
    },
    methods: {
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
                store.state.menucomments = [],
                store.state.menucommentsScore = []
                store.state.commentId = []
                store.state.commentUserId = []
                store.state.commentScore = 0
                store.state.commentUserTF = false
                var commentL = 0
                snapshot.forEach(doc => {
                commentL += 1
                store.state.menucomments.push(doc.data().comment)
                store.state.commentId.push(doc.data().id)
                store.state.menucommentsScore.push(doc.data().score)
                store.state.commentUserId.push(doc.data().userInfo)
                store.state.commentScore += Number(doc.data().score)
                });
                if((store.state.commentUserId).includes(store.state.user.uid)){
                    store.state.commentUserTF = true
                }
                else{
                    store.state.commentUserTF = false
                }

                if(store.state.menucomments.length>0){
                    // console.log('asdasdsad')
                    var dkdk = store.state.menucomments.length*40 + 750
                    // console.log(dkdk)
                    document.querySelector('.modal-box').style.height = `${dkdk}` + "px"
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
                location.href="/menu"
            }).catch(function(error) {
                console.error("Error removing document: ", error);
            })
        }, 
    }
}
</script>

<style lang="scss">
@import './MenuBox.scss';
</style>
