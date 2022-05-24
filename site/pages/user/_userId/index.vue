<template>
  <div class="container flex flex-col  m-auto">
    <user-profile :user="user" />

    <div class="flex">
      <div class=" border-r">
        <user-center-sidebar :user="user" class="  w-64" />
      </div>

      <div class="right-container flex-grow">
        <div class="tabs-warp">
          <div class="tabs pl-4 border-b ">
            <ul class="flex">
              <li class="px-4 py-2" :class="{ ' border-b-2 border-blue-500': activeTab === 'topics' }">
                <nuxt-link :to="'/user/' + user.id + '?tab=topics'">
                  <span class="icon is-small">
                    <i class="iconfont icon-topic" aria-hidden="true" />
                  </span>
                  <span>话题</span>
                </nuxt-link>
              </li>
              <li class="px-4 py-2" :class="{ 'border-b-2 border-blue-500': activeTab === 'articles' }">
                <nuxt-link :to="'/user/' + user.id + '?tab=articles'">
                  <span class="icon is-small">
                    <i class="iconfont icon-article" aria-hidden="true" />
                  </span>
                  <span>作品</span>
                </nuxt-link>
              </li>
            </ul>
          </div>

          <div v-if="activeTab === 'topics'">
            <div
              v-if="
                topicsPage && topicsPage.results && topicsPage.results.length
              "
            >
              <load-more
                v-if="topicsPage"
                v-slot="{ results }"
                :init-data="topicsPage"
                :url="'/api/topic/user/topics?userId=' + user.id"
              >
                <topic-list :topics="results" :show-avatar="false" />
              </load-more>
            </div>
            <div v-else class="notification is-primary">
              暂无话题
            </div>
          </div>

          <div v-if="activeTab === 'articles'">
            <div
              v-if="
                articlesPage &&
                  articlesPage.results &&
                  articlesPage.results.length
              "
            >
              <load-more
                v-if="articlesPage"
                v-slot="{ results }"
                :init-data="articlesPage"
                :url="'/api/article/user/articles?userId=' + user.id"
              >
                <article-list :articles="results" />
              </load-more>
            </div>
            <div v-else class="notification is-primary">
              暂无作品
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const defaultTab = 'topics'

export default {
  async asyncData ({ $axios, params, query, error }) {
    let user
    try {
      user = await $axios.get('/api/user/' + params.userId)
    } catch (err) {
      error({
        statusCode: 404,
        message: err.message || '系统错误'
      })
      return
    }

    const activeTab = query.tab || defaultTab
    let topicsPage = null
    let articlesPage = null
    if (activeTab === 'topics') {
      topicsPage = await $axios.get('/api/topic/user/topics', {
        params: { userId: params.userId }
      })
    } else if (activeTab === 'articles') {
      articlesPage = await $axios.get('/api/article/user/articles', {
        params: { userId: params.userId }
      })
    }
    return {
      activeTab,
      user,
      topicsPage,
      articlesPage
    }
  },
  data () {
    return {}
  },
  head () {
    return {
      title: this.$siteTitle(this.user.nickname)
    }
  },
  computed: {
    currentUser () {
      return this.$store.state.user.current
    },
    isOwner () {
      const current = this.$store.state.user.current
      return this.user && current && this.user.id === current.id
    }
  },
  watchQuery: ['tab']
}
</script>

<style lang="scss" scoped>

</style>
