<template>
  <section class="container flex flex-row m-auto">
    <topics-nav :nodes="nodes" class="left-container    w-60 border-r" />
    <div class="center-container flex-grow  bg-gray-50">
      <nuxt-child :key="$route.path" />
    </div>
    <div class="right-container border-l  pl-5 pt-5  w-64">
      <check-in />
      <site-notice />
      <score-rank :score-rank="scoreRank" />
      <!-- <friend-links :links="links" /> -->
    </div>
  </section>
</template>

<script>
export default {
  async asyncData ({ $axios, store }) {
    try {
      store.commit('env/setCurrentNodeId', 0) // 设置当前所在node
      const [nodes, scoreRank, links] = await Promise.all([
        $axios.get('/api/topic/nodes'),
        $axios.get('/api/user/score/rank'),
        $axios.get('/api/link/toplinks')
      ])
      return { nodes, scoreRank, links }
    } catch (e) {
      console.error(e)
    }
  }
}
</script>

<style lang="scss" scoped></style>
