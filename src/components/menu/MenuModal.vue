<template>
    <div id="menu-modal" class="modal-wrapper">
        <a href="#" class="modal-back"/>
        <div class="modal-box">
            <div class="modal-header">
                <!-- 밑의 메뉴 이름에 변수 넣어주세요 -->
                <span class="modal-title">메뉴 이름</span>
                <a href="#" class="modal-close">&times;</a>
            </div>
            <div class="modal-content">
                <div class="modal-image">
                    <!-- 밑의 src에 주소 넣어주세요 -->
                    <img src="" alt="modal_detail_image">
                </div>
                <div class="modal-info">
                    <!-- 이곳에 메뉴 정보를 넣어주세요 -->
                    메뉴 정보
                </div>
            </div>
            <div class="modal-comment">
                댓글창
                <!-- 이곳에 댓글창 구현해 주세요 -->
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'MenuModal',
    props: {
        name: {type: String},
    }
}
</script>

<style lang="scss">
@import './MenuModal.scss'
</style>


