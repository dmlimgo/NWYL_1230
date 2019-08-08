<template>
    <div>
        <div class="leftnav-wrapper">
            <div class="nav-flex">
                <router-link to="/">
                    <div class="nav-icon home">
                        <img src="@/assets/images/home-1.png" style="width: 100%;" alt="home">
                    </div>
                </router-link>
                <button id="team-icon" class="nav-icon team">
                    <img src="@/assets/images/group.png" style="width:100%;" alt="team">
                </button>
            </div>
        </div>
        <div class="rightnav-wrapper">
            <div class="nav-flex">
                <router-link to="/menu">
                    <div class="nav-icon menu">
                        <img src="@/assets/images/menu-1.png" style="width: 100%;" alt="menu">
                    </div>
                </router-link>
                <router-link to="/weeklymenu">
                    <div class="nav-icon weeklymenu">
                        <img src="@/assets/images/calendar.png" style="width:100%;" alt="calendar">
                    </div>
                </router-link>
                <button disabled id="subscribe" class="nav-icon weeklymenu">
                    구독하기
                </button>
            </div>
        </div>
        <div>
            <section class="js-subscription-details is-invisible">
                <p>This String can use notification push alert.</p>
                <pre><code class="js-subscription-json"></code></pre>
            </section>
        </div>
    </div>
</template>

<script>

export default {
    name: 'SideNav',
    components: {

    },
    props: {
   
    },
    created() {

    },
    mounted() {
      
    },
    methods: {
      
    }
}
</script>

<style lang="scss">
@import './SideNav.scss';
</style>
