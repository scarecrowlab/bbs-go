<template>
  <div class=" h-16  flex flex-row items-center  container  m-auto">
    <div>
      <nuxt-link to="/">
        <img
          :alt="config.siteTitle"
          src="~/assets/images/logo.svg"
          style="height: 36px"
          class="px-4 md:px-0"
        >
      </nuxt-link>
    </div>

    <!-- <div class="navbar-start flex flex-row flex-grow">
      <nuxt-link
        v-for="(nav, index) in config.siteNavs"
        :key="index"
        :to="nav.url"
        class="px-2"
      >
        {{ nav.title }}
      </nuxt-link>
    </div> -->

    <div class="navbar-end flex flex-row items-center flex-grow  justify-end">
      <div class="navbar-item">
        <search-input />
      </div>

      <div v-if="user" class="navbar-item px-5">
        <create-topic-btn />
      </div>

      <msg-notice v-if="user" class=" px-5" />

      <t-dropdown v-if="user" :toggle-on-hover="true">
        <div
          slot="trigger"
          slot-scope="{
            mousedownHandler,
            focusHandler,
            blurHandler,
            keydownHandler,
          }"
          class="flex"
        >
          <div class="navbar-link flex flex-row items-center">
            <!-- <nuxt-link :to="'/user/' + user.id" class="navbar-link flex flex-row items-center"> -->
            <avatar :user="user" :size="30" />
            <span
              class="user-menus-nickname pl-2"
              @mousedown="mousedownHandler"
              @focus="focusHandler"
              @blur="blurHandler"
              @keydown="keydownHandler"
            >{{ user.nickname }}</span>
          </div>
        </div>

        <div class=" z-10 border p-1 shadow-xs w-64 mt-4">
          <nuxt-link
            class="block px-4 py-2 text-sm leading-5 text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
            :to="'/user/' + user.id"
          >
            <i class="iconfont icon-username" />&nbsp;个人中心
          </nuxt-link>
          <nuxt-link
            class="block px-4 py-2 text-sm leading-5 text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
            to="/user/favorites"
          >
            <i class="iconfont icon-favorites" />&nbsp;我的收藏
          </nuxt-link>
          <nuxt-link
            class="block px-4 py-2 text-sm leading-5 text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
            to="/user/profile"
          >
            <i class="iconfont icon-username" />&nbsp;编辑资料
          </nuxt-link>
          <a
            class="block px-4 py-2 text-sm leading-5 text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
            @click="signout"
          >
            <i class="iconfont icon-log-out" />&nbsp;退出登录
          </a>
        </div>
      </t-dropdown>

      <div v-else class="navbar-item flex ">
        <t-button class="px-4  mx-4">
          <nuxt-link
            to="/user/signin"
          >
            登录
          </nuxt-link>
        </t-button>
        <t-button variant="secondary" class="px-4  mx-4">
          <nuxt-link
            to="/user/signup"
          >
            注册
          </nuxt-link>
        </t-button>
      </div>
    </div>
  </div>
</template>

<script>
import UserHelper from '~/common/UserHelper'

export default {
  data () {
    return {
      navbarActive: false
    }
  },
  computed: {
    user () {
      return this.$store.state.user.current
    },
    isOwnerOrAdmin () {
      return UserHelper.isOwner(this.user) || UserHelper.isAdmin(this.user)
    },
    config () {
      return this.$store.state.config.config
    }
  },
  methods: {
    async signout () {
      try {
        await this.$store.dispatch('user/signout')
        this.$linkTo('/')
      } catch (e) {
        console.error(e)
      }
    },
    toggleNav () {
      this.navbarActive = !this.navbarActive
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  /*opacity: 0.99;*/
  /*border-bottom: 1px solid #e7edf3;*/
  background-color: var(--bg-color);

  .navbar-item {
    font-weight: 700;
  }

  .publish {
    color: var(--text-color);
    background-color: #3174dc;
    width: 100px;
    &:hover {
      color: var(--text-color);
      background-color: #4d91fa;
    }
  }

  .login-btn {
    border-color: #000; // TODO
    &:hover {
      color: var(--text-color3);
      border-color: var(--text-color3);
    }
  }
}

.user-menus {
  .user-menus-nickname {
    margin-left: 5px;
  }
}
</style>
