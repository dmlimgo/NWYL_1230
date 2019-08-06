<template>
    <div class="menu-box">
        <div class="menu-title">
            {{ menu.name }}
        </div>
        <div class="menu-image">
            <img :src="menu.image" style="width: 150px; height: 150px;" alt="menu_detail_image">
        </div>
        <ul class="menu-tags">
            <li v-for="tag in menu.tags" :tag="tag" :key="tag.id" class="tag">
                {{ tag }}
            </li>
        </ul>
        <div class="menu-favorite">
            <img v-for="score in menu.score" :key="score.id" src="@/assets/images/favorites-1.png" class="favorite-icon" alt="favorite_star_image"/>
        </div>
        <a class="button" href="#menu-modal">
            리뷰 보기
        </a>
    </div>
</template>

<script>
import MenuModal from './MenuModal'

export default {
    name: 'MenuBox',
    props: {
        menu: Object,
    },
    components: {
        MenuModal,
    }
}
</script>

<style lang="scss">
@import './MenuBox.scss';
</style>
