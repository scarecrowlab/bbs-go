<template>
  <section class=" container flex flex-row m-auto ">
    <topics-nav class="left-container    w-60 border-r" :nodes="nodes" />
    <div class="center-container flex-grow  bg-gray-50">
      <div class="topics-main">
        <sticky-topics :node-id="0" />
        <load-more
          v-if="topicsPage"
          v-slot="{ results }"
          :init-data="topicsPage"
          url="/api/topic/topics"
        >
          <topic-list :topics="results" />
        </load-more>
      </div>
    </div>
    <div class="right-container border-l  pl-5 pt-5   w-64">
      <check-in />
      <site-notice />
      <score-rank :score-rank="scoreRank" />
    </div>
  </section>
</template>

<script>
import '../assets/globals.css'

export default {
  async asyncData ({ $axios, store }) {
    store.commit('env/setCurrentNodeId', 0) // 设置当前所在node
    try {
      const [nodes, topicsPage, scoreRank, links] = await Promise.all([
        $axios.get('/api/topic/nodes'),
        $axios.get('/api/topic/topics'),
        $axios.get('/api/user/score/rank'),
        $axios.get('/api/link/toplinks')
      ])
      return { nodes, topicsPage, scoreRank, links }
    } catch (e) {
      console.error(e)
    }
  },
  data () {},
  head () {
    return {
      title: this.$siteTitle(),
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.$siteDescription()
        },
        { hid: 'keywords', name: 'keywords', content: this.$siteKeywords() }
      ]
    }
  }
}
</script>

<style lang="scss" scoped></style>
