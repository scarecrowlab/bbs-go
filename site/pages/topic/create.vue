<template>
  <section class="container flex flex-col  m-auto  ">
    <div class="control my-5 flex flex-row items-center">
      <input
        v-model="postForm.title"
        class="input topic-title my-1 shadow appearance-none border rounded  py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        type="text"
        placeholder="请输入帖子标题"
      >
      <a
        :class="{ 'is-loading': publishing }"
        :disabled="publishing"
        class="button is-success border px-4 py-1 rounded-full mx-5 cursor-pointer"
        @click="submitCreate"
      >发表帖子</a>
    </div>

    <div class="control flex mb-3 ">
      <div
        v-for="node in nodes"
        :key="node.nodeId"
        class="topic-tag border py-1 px-4 text-sm m-1 rounded-full"
        :class="{ selected: postForm.nodeId === node.nodeId }"
        @click="postForm.nodeId = node.nodeId"
      >
        <span>{{ node.name }}</span>
      </div>
    </div>

    <markdown-editor
      ref="mdEditor"
      v-model="postForm.content"
      placeholder="请输入你要发表的内容..."
    />
  </section>
</template>

<script>

export default {
  middleware: 'authenticated',
  async asyncData ({ $axios, query, store }) {
    // 节点
    const nodes = await $axios.get('/api/topic/nodes')
    // 发帖标签
    const config = store.state.config.config || {}
    const nodeId = query.nodeId || config.defaultNodeId
    let currentNode = null
    if (nodeId) {
      try {
        currentNode = await $axios.get('/api/topic/node?nodeId=' + nodeId)
      } catch (e) {
        console.error(e)
      }
    }

    const type = parseInt(query.type || 0) || 0

    return {
      nodes,
      postForm: {
        type,
        nodeId: currentNode ? currentNode.nodeId : 0
      }
    }
  },
  data () {
    return {
      publishing: false, // 当前是否正处于发布中...
      captchaId: '',
      captchaUrl: '',
      captchaCode: '',
      postForm: {
        type: 0,
        nodeId: 0,
        title: '',
        tags: [],
        content: '',
        hideContent: '',
        imageList: []
      }
    }
  },
  head () {
    return {
      title: this.$siteTitle(this.postForm.type === 1 ? '发动态' : '发布')
    }
  },
  computed: {
    user () {
      return this.$store.state.user.current
    },
    config () {
      return this.$store.state.config.config
    },
    // 是否需要先邮箱认证
    isNeedEmailVerify () {
      return this.config.createTopicEmailVerified && !this.user.emailVerified
    },
    isEnableHideContent () {
      return this.config.enableHideContent
    }
  },
  watchQuery: ['type', 'nodeId'],
  mounted () {
    // const editor = new EditorJS({
    //   placeholder: '输入内容',
    // })
    // console.log(editor)
    this.showCaptcha()
  },
  methods: {
    async submitCreate () {
      if (this.publishing) {
        return
      }

      if (!this.postForm.nodeId) {
        this.$message.error('请选择节点')
        return
      }

      this.publishing = true

      if (this.$refs.simpleEditor && this.$refs.simpleEditor.isOnUpload()) {
        this.$message.warning('正在上传中...请上传完成后提交')
        return
      }

      const me = this
      try {
        const topic = await this.$axios.post('/api/topic/create', {
          captchaId: this.captchaId,
          captchaCode: this.captchaCode,
          type: this.postForm.type,
          nodeId: this.postForm.nodeId,
          title: this.postForm.title,
          content: this.postForm.content,
          hideContent: this.postForm.hideContent,
          imageList:
            this.postForm.imageList && this.postForm.imageList.length
              ? JSON.stringify(this.postForm.imageList)
              : '',
          tags: this.postForm.tags ? this.postForm.tags.join(',') : ''
        })
        if (this.$refs.mdEditor) {
          this.$refs.mdEditor.clearCache()
        }
        this.$msg({
          message: '提交成功',
          onClose () {
            me.$linkTo('/topic/' + topic.topicId)
          }
        })
      } catch (e) {
        await this.showCaptcha()
        this.publishing = false
        this.$message.error(e.message || e)
      }
    },
    async showCaptcha () {
      if (this.config.topicCaptcha) {
        try {
          const ret = await this.$axios.get('/api/captcha/request', {
            params: {
              captchaId: this.captchaId || ''
            }
          })
          this.captchaId = ret.captchaId
          this.captchaUrl = ret.captchaUrl
        } catch (e) {
          this.$message.error(e.message || e)
        }
      }
    },
    onSimpleEditorInput (value) {
      this.postForm.content = value.content
      this.postForm.imageList = value.imageList
    }
  }
}
</script>

<style lang="scss">
.ce-block__content,
.ce-toolbar__content {
  max-width: 100%; /* example value, adjust for your own use case */
}
</style>
