<template>
  <ul class="topic-list">
    <li
      v-for="topic in topics"
      :key="topic.topicId"
      class="topic-item rounded-sm shadow-sm"
    >
      <div class="flex flex-col w-full">
        <div
          class="topic-content py-2"
          :class="{ 'topic-tweet': topic.type === 1 }"
        >
          <template v-if="topic.type === 0">
            <h1 class="topic-title">
              <nuxt-link :to="'/topic/' + topic.topicId">
                {{
                  topic.title
                }}
              </nuxt-link>
            </h1>
            <nuxt-link :to="'/topic/' + topic.topicId" class="text-lg">
              {{
                topic.summary
              }}
            </nuxt-link>
          </template>
          <template v-if="topic.type === 1">
            <nuxt-link
              v-if="topic.content"
              :to="'/topic/' + topic.topicId"
              class="text-lg"
            >
              {{ topic.content }}
            </nuxt-link>
            <ul
              v-if="topic.imageList && topic.imageList.length"
              class="topic-image-list"
            >
              <li v-for="(image, index) in topic.imageList" :key="index">
                <nuxt-link :to="'/topic/' + topic.topicId" class="image-item">
                  <img v-lazy="image.preview">
                </nuxt-link>
              </li>
            </ul>
          </template>
        </div>
        <div class="flex flex-row text-xs mt-2">
          <div class="flex flex-row flex-grow items-center">
            <div
              class="topic-avatar pr-2"
              :href="'/user/' + topic.user.id"
              :title="topic.user.nickname"
            >
              <avatar :user="topic.user" size="20" class="rounded-full" />
            </div>
            <!-- <nuxt-link :to="'/user/' + topic.user.id">{{
              topic.user.nickname
            }}</nuxt-link> -->
            <div
              class="btn px-0.5 flex items-center"
              :class="{ liked: topic.liked }"
              @click="like(topic)"
            >
              <i
                class="iconfont icon-like pr-1"
                :class="{
                  ' to-blue-500': topic.liked,
                }"
              />
              <span>{{ topic.likeCount || 0 }}</span>
            </div>
            <div
              class="btn px-0.5 flex items-center"
              @click="toTopicDetail(topic.topicId)"
            >
              <i class="iconfont icon-comment pr-1" />
              <span>{{ topic.commentCount || 0 }}</span>
            </div>
            <div
              class="btn px-0.5 flex items-center"
              @click="toTopicDetail(topic.topicId)"
            >
              <i class="iconfont icon-read pr-1" />
              <span>{{ topic.viewCount || 0 }}</span>
            </div>

            <span
              v-if="showSticky && topic.sticky"
              class="topic-sticky-icon px-2"
            >置顶</span>
          </div>
          <div class="topic-tags">
            <span>
              <nuxt-link
                v-if="topic.node"
                :to="'/topics/node/' + topic.node.nodeId"
                :alt="topic.node.name"
              >{{ topic.node.name }}</nuxt-link>
            </span>
          </div>

          <div class="topic-time">
            发布于{{ topic.createTime | prettyDate }}
          </div>
        </div>
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    topics: {
      type: Array,
      default () {
        return []
      },
      required: false
    },
    showAvatar: {
      type: Boolean,
      default: true
    },
    showSticky: {
      type: Boolean,
      default: false
    },
    showAd: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    async like (topic) {
      try {
        await this.$axios.post('/api/topic/like/' + topic.topicId)
        topic.liked = true
        topic.likeCount++
        this.$message.success('点赞成功')
      } catch (e) {
        if (e.errorCode === 1) {
          this.$msgSignIn()
        } else {
          this.$message.error(e.message || e)
        }
      }
    },
    toTopicDetail (topicId) {
      this.$linkTo(`/topic/${topicId}`)
    }
  }
}
</script>

<style lang="scss" scoped></style>
