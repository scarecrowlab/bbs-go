<template>
  <div class="flex  justify-center">
    <div class="widget signin w-96">
      <div class="widget-header text-2xl my-2">
        注册
      </div>
      <div class="widget-content">
        <div class="field  my-2">
          <label class="label  my-2">昵称</label>
          <div class="control has-icons-left">
            <t-input
              v-model="nickname"
              class="input is-success"
              type="text"
              placeholder="请输入昵称"
              @keyup.enter="signup"
            >
              <span class="icon is-small is-left">
                <i class="iconfont icon-username" />
              </span>
            </t-input>
          </div>
        </div>

        <div class="field  my-2">
          <label class="label  my-2">邮箱</label>
          <div class="control has-icons-left">
            <t-input
              v-model="email"
              class="input is-success"
              type="text"
              placeholder="请输入邮箱"
              @keyup.enter="signup"
            >
              <span class="icon is-small is-left">
                <i class="iconfont icon-email" />
              </span>
            </t-input>
          </div>
        </div>

        <div class="field  my-2">
          <label class="label  my-2">密码</label>
          <div class="control has-icons-left">
            <t-input
              v-model="password"
              class="input"
              type="password"
              placeholder="请输入密码"
              @keyup.enter="signup"
            >
              <span class="icon is-small is-left">
                <i class="iconfont icon-password" />
              </span>
            </t-input>
          </div>
        </div>

        <div class="field  my-2">
          <label class="label  my-2">确认密码</label>
          <div class="control has-icons-left">
            <t-input
              v-model="rePassword"
              class="input"
              type="password"
              placeholder="请再次输入密码"
              @keyup.enter="signup"
            >
              <span class="icon is-small is-left">
                <i class="iconfont icon-password" />
              </span>
            </t-input>
          </div>
        </div>

        <div class="field">
          <div class="control flex  items-center">
            <t-button class="button is-success" @click="signup">
              注册
            </t-button>
            <nuxt-link class="button is-text flex-grow text-right" to="/user/signin">
              已有账号，前往登录&gt;&gt;
            </nuxt-link>
          </div>
        </div>
      </div>
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
      nickname: '',
      email: '',
      password: '',
      rePassword: '',
      captchaId: '',
      captchaUrl: '',
      captchaCode: ''
    }
  },
  head () {
    return {
      title: this.$siteTitle('注册')
    }
  },
  computed: {
    loginMethod () {
      return this.$store.state.config.config.loginMethod
    }
  },
  methods: {
    async signup () {
      try {
        await this.$store.dispatch('user/signup', {
          captchaId: this.captchaId,
          captchaCode: this.captchaCode,
          nickname: this.nickname,
          email: this.email,
          password: this.password,
          rePassword: this.rePassword,
          ref: this.ref
        })
        if (this.ref) {
          // 跳到登录前
          this.$linkTo(this.ref)
        } else {
          // 跳到个人主页
          this.$linkTo('/user/profile')
        }
      } catch (err) {
        this.$message.error(err.message || err)
        await this.showCaptcha()
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
