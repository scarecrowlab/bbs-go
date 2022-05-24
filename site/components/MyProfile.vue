<template>
  <div class="widget">
    <div class="widget-header  flex items-baseline mb-2">
      <span class="text-lg  flex-grow">个人资料</span>
      <div class="slot text-xs">
        <nuxt-link to="/user/profile">
          编辑资料
        </nuxt-link>
      </div>
    </div>
    <div class="widget-content stable  text-sm">
      <div class="str flex">
        <div class="slabel  pr-2">
          昵称
        </div>
        <div class="svalue flex-grow">
          {{ user.nickname }}
        </div>
      </div>
      <div class="str flex">
        <div class="slabel pr-2">
          签名
        </div>
        <div class="svalue flex-grow">
          {{ user.description }}
        </div>
      </div>
      <div v-if="user.homePage" class="str flex">
        <div class="slabel pr-2">
          主页
        </div>
        <div class="svalue flex-grow">
          <a :href="user.homePage" target="_blank" rel="nofollow">{{
            user.homePage
          }}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MyProfile',
  props: {
    user: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped></style>
