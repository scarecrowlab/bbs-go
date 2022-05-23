<template>
  <div class="flex flex-row">
    <a @click="handlePostCommand('topic')">发帖子</a>
    <!-- <a @click="handlePostCommand('article')">发作品</a> -->
  </div>
</template>
<script>
export default {
  data () {
    return {}
  },
  computed: {},
  methods: {
    handlePostCommand (cmd) {
      if (cmd === 'topic') {
        this.$linkTo('/topic/create')
      } else if (cmd === 'tweet') {
        this.$linkTo('/topic/create?type=1')
      } else if (cmd === 'article') {
        this.$linkTo('/article/create')
      }
    }
  }
}
</script>
<style lang="scss" scoped></style>
