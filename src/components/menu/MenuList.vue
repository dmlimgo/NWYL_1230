<template>
    <div>
        <div class="menulist-wrapper">
            <MenuBox v-for="menu in menus" :menu="menu" :key="menu.id"/>
            <MenuModal />
        </div>
    </div>
</template>

<script>
import MenuBox from './MenuBox'
import MenuModal from './MenuModal'
import FirebaseService from '@/services/FirebaseService'

export default {
    name: 'MenuList',    
    components: {
        MenuBox,
        MenuModal,
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
    }
}
</script>

<style lang="scss">
@import './MenuList.scss';
</style>
