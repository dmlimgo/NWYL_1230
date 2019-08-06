<template>
    <div class="card-wrapper">
        <div class="card-title">
            <span v-if="$store.state.user">
                {{$store.state.user.displayName}} 님의 프로필
            </span>
            <span v-else>
                로그인 해 주세요
            </span>
        </div>
        <div class="card-bar"/> 
        <!-- 로그인 상황에 따라 다른 화면 표시 -->
        <div class="card-content-wrapper" v-if="$store.state.user">
            <div style="display: flex;">
                <img :src="gravatarURL" class="gravatar-img" alt="gravatar_image"/>
            </div>
            <div style="display: flex; width: 100%;">
                <LoginModal/>
            </div>
        </div>
        <div class="card-content-wrapper" v-else>
            <LoginModal/>
        </div>
    </div>
</template>

<script>
import LoginModal from '@/components/authenticate/LoginModal'
import store from '@/store'
let md5 = require('md5');

export default {
    name: "ProfileBox",
    components: {
        LoginModal,
    },
    computed: {
        gravatarURL() {
            return `http://www.gravatar.com/avatar/${md5(store.state.user.email)}?s=150&d=retro`
        }
    }
}
</script>

<style>
.gravatar-img {
    border-radius: 100px;
}
</style>


