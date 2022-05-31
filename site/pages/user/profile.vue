<template>
  <div class="container flex flex-row  m-auto ">
    <div class="left-container w-64 border-r ">
      <div class="profile-edit-tabs-pc">
        <div class="profile-edit-tab-item">
          <nuxt-link to="/user/profile">
            <i class="iconfont icon-username" />
            <span>个人资料</span>
          </nuxt-link>
        </div>
        <div class="profile-edit-tab-item">
          <nuxt-link to="/user/profile/account">
            <i class="iconfont icon-username" />
            <span>账号设置</span>
          </nuxt-link>
        </div>
      </div>
    </div>
    <div class="right-container  flex-grow">
      <div class="profile-edit-tabs-mobile tabs border-b">
        <ul class="flex">
          <li class="px-4 py-2" :class="{ 'border-b-2 border-blue-500 is-active': active === 'profile' }">
            <nuxt-link to="/user/profile">
              个人资料
            </nuxt-link>
          </li>
          <li class="px-4 py-2" :class="{ 'border-b-2 border-blue-500 is-active': active === 'account' }">
            <nuxt-link to="/user/profile/account">
              账号设置
            </nuxt-link>
          </li>
        </ul>
      </div>
      <nuxt-child class="p-5  w-96 m-auto" />
    </div>
  </div>
</template>

<script>
export default {
  middleware: 'authenticated',
  computed: {
    active () {
      if (this.$route.path.includes('/user/profile/account')) {
        return 'account'
      }
      return 'profile'
    }
  }
}
</script>
