<template>
    <div id="menu-modal" class="modal-wrapper">
        <a href="#" class="modal-back"/>
        <div class="modal-box">
            <div class="modal-header">
                <!-- 밑의 메뉴 이름에 변수 넣어주세요 -->
                <span class="modal-title">{{ $store.state.menuname }}</span>
                <!-- <span class="modal-title">{{ doc.data().name }}</span> -->
                <a href="#" class="modal-close">&times;</a>
            </div>
            <div class="modal-content">
                <div class="modal-image">
                    <!-- 밑의 src에 주소 넣어주세요 -->
                    <img :src="$store.state.menuimg" width="300" height="400" alt="modal_detail_image">
                </div>
                <div class="modal-info">
                    <!-- 이곳에 메뉴 정보를 넣어주세요 -->
                    메뉴 정보
                    <li v-for="item in $store.state.menutag">{{ item }}</li>
                </div>
            </div>
            <v-form>
                <v-text-field
                    id="commentTitle"
                    v-model="comment"
                    :counter="100"
                    label="comment"
                    required
                ></v-text-field>
                <!-- <input v-model="score" id="myscore" type="number" min="1" max="5" value="5" /> -->
                <form class="rating">
                <label>
                    <input v-model="score" id="myscore" type="radio" name="stars" value="1" />
                    <span class="icon">★</span>
                </label>
                <label>
                    <input v-model="score" id="myscore" type="radio" name="stars" value="2" />
                    <span class="icon">★</span>
                    <span class="icon">★</span>
                </label>
                <label>
                <input v-model="score" id="myscore" type="radio" name="stars" value="3" />
                <span class="icon">★</span>
                <span class="icon">★</span>
                <span class="icon">★</span>   
                </label>
                <label>
                    <input v-model="score" id="myscore" type="radio" name="stars" value="4" />
                    <span class="icon">★</span>
                    <span class="icon">★</span>
                    <span class="icon">★</span>
                    <span class="icon">★</span>
                </label>
                <label>
                    <input v-model="score" id="myscore" type="radio" name="stars" value="5" />
                    <span class="icon">★</span>
                    <span class="icon">★</span>
                    <span class="icon">★</span>
                    <span class="icon">★</span>
                    <span class="icon">★</span>
                </label>
                </form>
                <div class="submit-area">
                <button v-if="$store.state.commentUserTF===false" id="formButton" @click="postComment(comment,score); clear();" class="form-button" type="button">제출</button>
                <button id="editformButton" @click="editPost(comment, score); clear();" class="form-button" type="button" style="display:none;">수정</button>
                </div>
            </v-form>
            <br><hr><br>
            <div class="modal-comment" id="commentSection" :key="$store.state.menucomments.length">
                <!-- 댓글창 -->
                <!-- 이곳에 댓글창 구현해 주세요 -->
                <myli :id="i" v-for="i in $store.state.menucomments.length" style="margin-top:20px; display: block">{{ $store.state.menucomments[i-1] }}  
                    <span style="position: absolute; right: 200px;">나의 평점: {{ $store.state.menucommentsScore[i-1] }}</span>
                    <button v-if="$store.state.user.uid===$store.state.commentUserId[i-1]" id="commentEdit" class="form-button" @click="editComment(i)" style="position: absolute; right: 90px;">수정</button>
                    <!-- <a v-if="$store.state.user.uid===$store.state.commentUserId[i-1]" id="modal-button" class="button" href="#menu-modal" @click="">수정</a> -->
                    <button v-if="$store.state.user.uid===$store.state.commentUserId[i-1]" class="form-button" @click="deletecomment(i);" style="position: absolute; right: 0;">삭제</button>
                </myli>
            </div>
        </div>
    </div>
</template>

<script id="dsq-count-scr" src="//hongyong3.disqus.com/count.js" async></script>
<script>
import firebase from 'firebase/app'
import store from '@/store.js'
import { firestore } from '@/services/FirebaseService'                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 

const db = firebase.firestore();

export default {
    name: 'MenuModal',
    props: {
        comment: {type: String},
		score: {type: Number},
    },
    components: {
    },
    data() {
        return {
            title: '',
        }
    },
    mounted() {
        document.getElementById("myscore").value = 5;
    },
    methods: {
        postComment(comment, score) {
            // console.log('postComment:', comment, score)
            return firestore.collection('menus').doc(store.state.menuid).collection("comments").add({
                comment,
                score,
                userInfo: this.$store.state.user.uid,
                created_at: firebase.firestore.FieldValue.serverTimestamp()
            }).then(function(docRef) {
                //  console.log("Document written with ID: ", docRef.id);
                 firestore.collection('menus').doc(store.state.menuid).collection("comments").doc(docRef.id).update({
                     id: docRef.id
                })
                // console.log(store.state.menucomments)
            })
        },
        clear () {
            this.comment = ''
            this.score = 5
        },
        deletecomment(i) {
            db.collection("menus").doc(store.state.menuid).collection("comments").doc(store.state.commentId[i-1]).delete().then(function() {
                console.log("Comment successfully deleted!");

            }).catch(function(error) {
                console.error("Error removing Comment: ", error);
            });
        },
        editComment(i) {
            document.getElementById("editformButton").style.display = "block";
            document.getElementById("commentEdit").style.display = "none";
            var myC = db.collection("menus").doc(store.state.menuid).collection("comments").doc(store.state.commentId[i-1])
            myC.get().then(function(doc) {
                if (doc.exists) {
                    var myComment = doc.data().comment
                    document.querySelector("#commentTitle").parentNode.firstElementChild.textContent = myComment
                    store.state.commentEditId = store.state.commentId[i-1]
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                }
            }).catch(function(error) {
                console.log("Error getting document:", error);
            });

        },
        editPost(comment, score) {
            db.collection("menus").doc(store.state.menuid).collection("comments").doc(store.state.commentEditId).update({
                "comment": comment,
                "score": score
            })
            .then(function() {
                console.log("Document successfully updated!");
                document.getElementById("editformButton").style.display = "none";
                document.getElementById("commentEdit").style.display = "inline";
                document.querySelector("#commentTitle").parentNode.firstElementChild.textContent = "comment"
            });
        }
    }
}
</script>

<style lang="scss">
@import './MenuModal.scss';
</style>
<<<<<<< HEAD
=======



>>>>>>> cc0a35beaed43e9f00969740846d9690520db26c
