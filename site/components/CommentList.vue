<template>
  <div class="comments">
    <load-more
      v-if="commentsPage"
      ref="commentsLoadMore"
      v-slot="{ results }"
      :init-data="commentsPage"
      :params="{ entityType: entityType, entityId: entityId }"
      url="/api/comment/comments"
    >
      <div v-for="comment in results" :key="comment.commentId" class="comment flex py-2">
        <div class="comment-item-left">
          <avatar :user="comment.user" size="40" round has-border />
        </div>
        <div class="comment-item-main pl-2 flex-grow">
          <div class="comment-meta flex text-sm">
            <nuxt-link
              :to="'/user/' + comment.user.id"
              class="comment-nickname flex-grow "
            >
              {{ comment.user.nickname }}
            </nuxt-link>
            <time
              class="comment-time text-xs"
              :datetime="comment.createTime | formatDate('yyyy-MM-ddTHH:mm:ss')"
            >{{ comment.createTime | prettyDate }}</time>
          </div>
          <div
            v-viewer
            v-lazy-container="{ selector: 'img' }"
            class="comment-content-wrapper"
          >
            <div
              v-if="comment.content"
              class="comment-content content"
              v-html="comment.content"
            />
            <div
              v-if="comment.imageList && comment.imageList.length"
              class="comment-image-list"
            >
              <img
                v-for="(image, imageIndex) in comment.imageList"
                :key="imageIndex"
                :data-src="image.url"
              >
            </div>
          </div>
          <div class="comment-actions flex text-xs">
            <div
              class="comment-action-item px-1"
              :class="{ active: comment.liked }"
              @click="like(comment)"
            >
              <i class="iconfont icon-like px-1" />
              <span>{{ comment.liked ? '已赞' : '点赞' }}</span>
              <span v-if="comment.likeCount > 0">{{ comment.likeCount }}</span>
            </div>
            <div
              class="comment-action-item"
              :class="{ active: reply.commentId === comment.commentId }"
              @click="switchShowReply(comment)"
            >
              <i class="iconfont icon-comment" />
              <span>{{
                reply.commentId === comment.commentId ? '取消评论' : '评论'
              }}</span>
            </div>
          </div>
          <div
            v-if="reply.commentId === comment.commentId"
            class="comment-reply-form border"
          >
            <text-editor
              :ref="`editor${comment.commentId}`"
              v-model="reply.value"
              class="border"
              :height="100"
              @submit="submitReply(comment)"
            />
          </div>
          <sub-comment-list
            v-if="
              comment.replies &&
                comment.replies.results &&
                comment.replies.results.length
            "
            :comment-id="comment.commentId"
            :data="comment.replies"
            @reply="onReply(comment, $event)"
          />
        </div>
      </div>
    </load-more>
  </div>
</template>

<script>
import SubCommentList from './SubCommentList.vue'
export default {
  components: { SubCommentList },
  props: {
    entityType: {
      type: String,
      default: '',
      required: true
    },
    entityId: {
      type: Number,
      default: 0,
      required: true
    },
    commentsPage: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      showReplyCommentId: 0,
      reply: {
        commentId: 0,
        value: {
          content: '',
          imageList: []
        }
      }
    }
  },
  computed: {
    user () {
      return this.$store.state.user.current
    },
    isLogin () {
      return this.$store.state.user.current != null
    }
  },
  methods: {
    append (data) {
      if (data) {
        this.$refs.commentsLoadMore.unshiftResults(data)
      }
    },
    async like (comment) {
      try {
        await this.$axios.post(`/api/comment/like/${comment.commentId}`)
        comment.liked = true
        comment.likeCount = comment.likeCount + 1
        this.$message.success('点赞成功')
      } catch (e) {
        if (e.errorCode === 1) {
          this.$msgSignIn()
        } else {
          this.$message.error(e.message || e)
        }
      }
    },
    switchShowReply (comment) {
      if (!this.user) {
        this.$msgSignIn()
        return
      }

      if (this.reply.commentId === comment.commentId) {
        this.hideReply(comment)
      } else {
        this.reply.commentId = comment.commentId
        setTimeout(() => {
          this.$refs[`editor${comment.commentId}`][0].focus()
        }, 0)
      }
    },
    hideReply (comment) {
      this.reply.commentId = 0
      this.reply.value.content = ''
      this.reply.value.imageList = []
    },
    async submitReply (parent) {
      try {
        const ret = await this.$axios.post('/api/comment/create', {
          entityType: 'comment',
          entityId: parent.commentId,
          content: this.reply.value.content,
          imageList:
            this.reply.value.imageList && this.reply.value.imageList.length
              ? JSON.stringify(this.reply.value.imageList)
              : ''
        })
        this.hideReply()
        this.appendReply(parent, ret)
        this.$message.success('发布成功')
      } catch (e) {
        if (e.errorCode === 1) {
          this.$msgSignIn()
        } else {
          this.$message.error(e.message || e)
        }
      }
    },
    onReply (parent, comment) {
      this.appendReply(parent, comment)
    },
    appendReply (parent, comment) {
      if (parent.replies && parent.replies.results) {
        parent.replies.results.push(comment)
      } else {
        parent.replies = {
          results: [comment]
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">

</style>
