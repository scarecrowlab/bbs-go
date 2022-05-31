<template>
  <div class="flex  justify-center">
    <div class="widget signin w-96">
      <div class="widget-header  text-2xl my-2  ">
        登录
      </div>
      <div class="widget-content">
        <template v-if="loginMethod.password">
          <div class="field my-2 ">
            <label class=" text-lg my-2">用户名/邮箱</label>
            <div class="control has-icons-left">
              <input
                v-model="username"
                class="input is-success"
                type="text"
                placeholder="请输入用户名或邮箱"
                @keyup.enter="submitLogin"
              >
              <span
                class="icon is-small is-left"
              ><i
                class="iconfont icon-username"
              /></span>
              </input>
            </div>
          </div>

          <div class="field my-2 ">
            <label class="text-lg my-2">密码</label>
            <div class="control has-icons-left">
              <t-input
                v-model="password"
                class="input"
                type="password"
                placeholder="请输入密码"
                @keyup.enter="submitLogin"
              >
                <span
                  class="icon is-small is-left"
                ><i
                  class="iconfont icon-password"
                /></span>
              </t-input>
            </div>
          </div>

          <div class="field flex   items-baseline">
            <t-button @click="submitLogin">
              登录
            </t-button>
            <nuxt-link to="/user/signup" class=" flex-grow text-right">
              没有账号？点击这里去注册&gt;&gt;
            </nuxt-link>
            </t-button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  asyncData ({ params, query }) {
    return {
      ref: query.ref
    }
  },
  data () {
    return {
      username: '',
      password: ''
    }
  },
  head () {
    return {
      title: this.$siteTitle('登录')
    }
  },
  computed: {
    currentUser () {
      return this.$store.state.user.current
    },
    isLogin () {
      return !!this.currentUser
    },
    loginMethod () {
      return this.$store.state.config.config.loginMethod
    }
  },
  methods: {
    async submitLogin () {
      try {
        if (!this.username) {
          this.$message.error('请输入用户名或邮箱')
          return
        }
        if (!this.password) {
          this.$message.error('请输入密码')
          return
        }
        const user = await this.$store.dispatch('user/signin', {
          captchaId: this.captchaId,
          captchaCode: this.captchaCode,
          username: this.username,
          password: this.password,
          ref: this.ref
        })
        if (this.ref) {
          // 跳到登录前
          this.$linkTo(this.ref)
        } else {
          // 跳到个人主页
          this.$linkTo('/user/' + user.id)
        }
      } catch (e) {
        this.$message.error(e.message || e)
        await this.showCaptcha()
      }
    },
    /**
     * 如果已经登录了，那么直接跳转
     * @returns {boolean}
     */
    redirectIfLogined () {
      if (this.isLogin) {
        const me = this
        this.$msg({
          message: '登录成功',
          onClose () {
            if (me.ref && !me.$isSigninUrl(me.ref)) {
              me.$linkTo(me.ref)
            } else {
              me.$linkTo('/')
            }
          }
        })
        return true
      }
      return false
    }
  }
}
</script>
