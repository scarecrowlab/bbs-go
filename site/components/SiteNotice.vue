<template>
  <div v-if="config.siteNotification" class="widget">
    <div class="widget-header  text-lg">
      公告
    </div>
    <div class="widget-content content notice-content">
      <p v-html="config.siteNotification" />
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    config () {
      return this.$store.state.config.config
    }
  }
}
</script>

<style lang="scss" scoped>
.notice-content {
  font-size: 80%;
}
</style>
