<template>
  <ul class="topic-list">
    <li
      v-for="topic in topics"
      :key="topic.topicId"
      class="topic-item rounded-sm "
    >
      <div class="flex flex-col bg-white  border-b p-2 px-4 hover:shadow rounded">
        <div
          class="  flex flex-col  py-2"
          :class="{ 'topic-tweet': topic.type === 1 }"
        >
          <nuxt-link :to="'/topic/' + topic.topicId" class=" py-2 text-lg  font-medium hover:text-blue-500">
            {{
              topic.title
            }}
          </nuxt-link>
          <nuxt-link :to="'/topic/' + topic.topicId" class="py-1 text-sm hover:text-gray-800 text-gray-600">
            {{
              topic.summary
            }}
          </nuxt-link>
        </div>
        <div class="flex flex-row text-xs  items-center text-gray-500">
          <div class="flex flex-row flex-grow items-center ">
            <div
              class="topic-avatar pr-2"
              :href="'/user/' + topic.user.id"
              :title="topic.user.nickname"
            >
              <avatar :user="topic.user" size="20" class="rounded-full" />
            </div>
            <div
              class="btn px-0.5 flex items-center"
              :class="{ liked: topic.liked }"
              @click="like(topic)"
            >
              <font-awesome-icon
                icon="fa-solid fa-heart"
                :class="{
                  ' text-blue-500': topic.liked,
                }"
              />
              <span class="px-1">{{ topic.likeCount || 0 }}</span>
            </div>
            <div
              class="btn px-0.5 flex items-center"
              @click="toTopicDetail(topic.topicId)"
            >
              <font-awesome-icon
                icon="fa-solid fa-comment"
              />
              <span class="px-1">{{ topic.commentCount || 0 }}</span>
            </div>
            <div
              class="btn px-0.5 flex items-center"
              @click="toTopicDetail(topic.topicId)"
            >
              <font-awesome-icon
                icon="fa-solid fa-eye"
              />
              <span class="px-1">{{ topic.viewCount || 0 }}</span>
            </div>

            <span
              v-if="showSticky && topic.sticky"
              class="topic-sticky-icon px-2"
            >置顶</span>
          </div>
          <div class="topic-tags text-gray-500">
            <nuxt-link
              v-if="topic.node"
              :to="'/topics/node/' + topic.node.nodeId"
              :alt="topic.node.name"
              class="border px-2 mx-2 rounded-full"
            >
              {{ topic.node.name }}
            </nuxt-link>
          </div>

          <div class="topic-time">
            {{ topic.createTime | prettyDate }}
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
