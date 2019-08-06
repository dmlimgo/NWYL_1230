<template>
    <div>
        <div class="admin-aside">
            <div class="admin-aside-flex">
                <div class="admin-aside-title">
                    ADMIN PAGE
                </div>
                <div class="admin-aside-menu">
                    <div class="admin-aside-li">
                        대시 보드
                    </div>
                    <div class="admin-aside-li">
                        페이지 정보
                    </div>
                    <div class="admin-aside-li">
                        회원 정보
                    </div>
                    <div class="admin-aside-li">
                        메뉴 정보
                    </div>
                    <div class="admin-aside-li">
                        페이지 기록
                    </div>
                </div>
            </div>
        </div>
        <div class="admin-header">
            <div class="admin-header-flex">
                <div class="admin-header-right">
                    관리자 정보
                </div>
            </div>
        </div>
        <div class="admin-content">

        </div>
    </div>
</template>

<script>
export default {
    name: 'AdminPage',
}
</script>

<style lang="scss">
@import './AdminPageView.scss';
</style>
