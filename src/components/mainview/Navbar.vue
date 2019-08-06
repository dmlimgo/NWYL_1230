<template>
    <div class="header-wrapper">
        <div class="header-flex">
            <div class="left">
                <div class="logo">
                    <router-link to="/" style="-webkit-text-stroke: 1px black;">
                        <span style="color: #5a90bf;">12</span><span style="color: #c8e19d;">15</span>
                    </router-link>
                </div>
            </div>
            <!-- <div class="right">
                <LoginModal/>
            </div> -->
        </div>
    </div>
</template>

<script>
import LoginModal from '@/components/authenticate/LoginModal'

export default {
    name: 'Navbar',
    components: {
        LoginModal,
    },
    props: {
        ismain: {type: Boolean, default: false},
    },
    created() {
        window.addEventListener('scroll', this.viewNav)
    },
    mounted() {
        if (this.ismain) {
            document.querySelector('.header-wrapper').style.visibility = "hidden";
        }
    },
    methods: {
        viewNav() {
            if (this.ismain && window.scrollY <= 650) {
                document.querySelector('.header-wrapper').style.visibility = "hidden";
            } else {
                document.querySelector('.header-wrapper').style.visibility = "visible";
            }
        }
    }
}
</script>

<style lang="scss">
    @import '@/assets/sass/Navbar.scss';
</style>
