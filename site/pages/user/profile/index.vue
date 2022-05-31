<template>
  <div class="widget no-margin">
    <div class="widget-content">
      <!-- 头像 -->
      <div class="field is-horizontal">
        <div class="field-label is-normal">
          <label class="label">头像</label>
        </div>
        <div class="field-body">
          <div class="field">
            <div class="control">
              <avatar-edit
                v-model="user.avatar"
                @success="onAvatarUpdateSuccess"
                @error="onAvatarUpdateError"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- 昵称 -->
      <div class="field is-horizontal">
        <div class="field-label is-normal">
          <label class="label">昵称</label>
        </div>
        <div class="field-body">
          <div class="field">
            <div class="control">
              <input
                v-model="form.nickname"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                autocomplete="off"
                placeholder="请输入昵称"
              >
            </div>
          </div>
        </div>
      </div>

      <!-- 个性签名 -->
      <div class="field is-horizontal">
        <div class="field-label is-normal">
          <label class="label">个性签名</label>
        </div>
        <div class="field-body">
          <div class="field">
            <div class="control">
              <textarea
                v-model="form.description"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                rows="2"
                placeholder="一句话介绍你自己"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- 个人主页 -->
      <div class="field is-horizontal">
        <div class="field-label is-normal">
          <label class="label">个人主页</label>
        </div>
        <div class="field-body">
          <div class="field">
            <div class="control">
              <input
                v-model="form.homePage"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                autocomplete="off"
                placeholder="请输入个人主页"
              >
            </div>
          </div>
        </div>
      </div>

      <div class="field is-horizontal">
        <div class="field-label is-normal" />
        <div class="field-body">
          <div class="field">
            <div class="control">
              <a class="button is-success" @click="submitForm">保存</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  middleware: 'authenticated',
  async asyncData ({ $axios }) {
    const user = await $axios.get('/api/user/current')
    const form = { ...user }
    return {
      user,
      form
    }
  },
  data () {
    return {
      form: {
        nickname: '',
        homePage: '',
        description: ''
      }
    }
  },
  head () {
    return {
      title: this.$siteTitle(this.user.nickname + ' - 个人资料')
    }
  },
  methods: {
    async submitForm () {
      try {
        await this.$axios.post('/api/user/edit/' + this.user.id, {
          nickname: this.form.nickname,
          homePage: this.form.homePage,
          description: this.form.description
        })
        await this.reload()
        this.$message.success('资料修改成功')
      } catch (e) {
        console.error(e)
        this.$message.error('资料修改失败：' + (e.message || e))
      }
    },
    onAvatarUpdateSuccess () {
      this.$message.success('头像更新成功')
    },
    onAvatarUpdateError (e) {
      this.$message.error('头像更新失败')
    },
    async reload () {
      this.user = await this.$axios.get('/api/user/current')
      this.form = { ...this.user }
    }
  }
}
</script>

<style lang="scss" scoped></style>
