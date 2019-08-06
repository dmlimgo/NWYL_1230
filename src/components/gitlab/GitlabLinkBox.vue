<template>
    <div class="card-wrapper">
        <div class="card-title">
            Gitlab 그래프 확인하기
        </div>
        <div class="card-bar" />
        <div class="card-content-wrapper">
            <router-link to="/GitlabGraph2" class="button" style="color:black !important">
                <img src="https://about.gitlab.com/images/press/logo/png/gitlab-logo-gray-rgb.png" style="width: 100%;" alt="gitlab_logo">
            </router-link>
        </div>
    </div>
</template>

<script>
export default {
    name: 'GitlabLinkBox',
}
</script>