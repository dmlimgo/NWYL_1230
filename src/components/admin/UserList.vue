<template>
    <v-container grid-list-md>
        <v-layout row wrap>
            <v-flex xs12>
                <v-data-table
                :headers="header"
                :items="members"
                :pagination.sync="pagination" 
                sort-icon="arrow_drop_down"
                prev-icon="navigate_before"
                next-icon="navigate_next"
                >
                    <template slot="items" slot-scope="props">
                        <td ><v-img :src="gravatarURL(props.item.email)"></v-img></td>
                        <td>{{props.item.displayName}}</td>
                        <td>{{props.item.email}}</td>
                        <td>{{props.item.tokensValidAfterTime | convertDate}}</td>
                        <td v-if="props.item.customClaims!=null&&props.item.customClaims.admin===true"><v-icon>build</v-icon></td>
                        <td v-else><v-icon>person</v-icon></td>
                        <td v-if="(props.item.customClaims!=null&&props.item.customClaims.admin===true)"><v-icon @click="deleteAdmin(props.item.email)">lock</v-icon></td>
                        <td v-else><v-icon @click="createAdmin(props.item.email)">add</v-icon></td>
                        <td  v-if="props.item.customClaims!=null&&props.item.customClaims.admin===true"><v-icon>error</v-icon></td>
                        <td v-else><v-icon @click="deleteUser(props.item.email)">delete</v-icon></td>
                    </template>
                </v-data-table>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
let md5 = require('md5')
import FirebaseService from '@/services/FirebaseService'
import store from '@/store'

export default {
    data: ()=>{
         return {
             header: [
                {text: 'Icon', value:'', sortable:false},
                {text: 'Name', value: 'displayName', sortable:false},
                {text: 'Email', value: 'email', sortable:false},
                {text: 'CreateDate', value: 'tokensValidAfterTime', sortable:false},
                {text: 'Claim', value: 'customClaims', sortable: false},
                {text: 'Authorization', sortable:false},
                {text: 'Withdrawal' , sortable:false}
            ],
            pagination: {
                rowsPerPage: 10
            },
            members: [],
        }
    },

    methods: {
        gravatarURL(email) {
            return `http://www.gravatar.com/avatar/${md5(email)}?s=150&d=retro`
        },

        // 일반유저에게 관리자 권한 부여
        createAdmin(email) {
            const conf = window.confirm("회원에게 관리자 권한을 부여하시겠습니까?")
            if(conf === true) {   // 확인을 눌렀을 때
                const result = FirebaseService.createAdmin(email)
                .then( ()=> {
                    const after = FirebaseService.getUserList()
                    after.then( result => {
                        this.members =  result
                    })
                })
            }
            else {               // 취소를 눌렀을 때

            }
        },

        // 관리자 권한 박탈하기 (관리자 -> 관리자)
        deleteAdmin(email) {
            const conf = window.confirm("회원에게 관리자 권한을 회수하시겠습니까?")
            if((conf === true)&&(email!=store.state.user.email)) {   // 확인을 눌렀을 때
                const result = FirebaseService.deleteAdmin(email)
                .then( ()=> {
                    const after = FirebaseService.getUserList()
                    after.then( result => {
                        this.members =  result
                    })
                })
            }
            else {               // 취소를 눌렀을 때 혹은 '현재 로그인된 관리자'의 정보를 바꿀 때
                alert('권한 회수 실패')
            }
        },

        // 회원 탈퇴시키기 (관리자 입장에서)
        deleteUser(email) {
            const conf = window.confirm("회원정보를 삭제하시겠습니까?")
            if((conf === true)&&(email!=store.state.user.email)) {  // 확인을 눌렀을 때
                const result = FirebaseService.deleteUser(email)
                .then( ()=> {
                    const after = FirebaseService.getUserList()
                    after.then( result => {
                        this.members =  result
                    })
                })
            }
            else {               // 취소를 눌렀을 때 혹은 '현재 로그인된 관리자'의 정보를 바꿀 때
                alert('삭제 실패')
            }
        },

        // // Sorting (반응이없음)
        // customSort(items, index, isDescending) {
        //   items.sort((a, b) => {
        //       if (index === 'CreateDate') {
        //           if (isDescending) {
        //               var aDate = new Date(a)
        //               var bDate = new Date(b)
        //               return bDate - aDate;
        //           } else {
        //               return aDate - bDate;
        //           }
        //       }
        //       else if(index === 'customClaims') {
        //           if(isDescending) {

        //           } else {

        //           }
        //       }
        //   });

        //   return items;
        // }
    },

    // 날짜 정보를 필터링
    filters: {                
        convertDate: function(value) {
            const result = new Date(value)
            var year = result.getFullYear()
            var month = result.getMonth()+1
            var date = result.getDate()     
            return year + '. ' + month + '. ' + date
        }
    },

    // UserList 컴포넌트 렌더링 전, 유저정보 리스트를 요청해 data의 members에 할당
    created() {
        const result = FirebaseService.getUserList()
         .then( result => {
                this.members =  result
        })
    }
}
</script>
