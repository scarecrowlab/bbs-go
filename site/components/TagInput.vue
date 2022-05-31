<template>
  <div class="select-tags">
    <input
      id="tags"
      v-model="tags"
      name="tags"
      type="hidden"
      class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    >
    <div class="tags-selected">
      <span v-for="tag in tags" :key="tag" class="border px-4 py-1 mx-1 my-1">
        <span
          class="text"
        >{{ tag
        }}<i
          :data-name="tag"
          class="iconfont icon-close"
          @click="clickRemoveTag"
        /></span>
      </span>
    </div>
    <input
      ref="tagInput"
      v-model="inputTag"
      class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"

      :placeholder="
        '标签（请用逗号分隔每个标签，最多' +
          maxTagCount +
          '个，每个最长15字符）'
      "

      type="text"
      @input="autocomplete"
      @keydown.delete="removeTag"
      @keydown.enter="addTag"
      @keydown.32="addTag"
      @keydown.186="addTag"
      @keydown.188="addTag"
      @keydown.38="selectUp"
      @keydown.40="selectDown"
      @keydown.esc="close"
      @focus="openRecommendTags"
      @blur="closeRecommendTags"
      @click="openRecommendTags"
    >
    <transition name="el-zoom-in-bottom">
      <div v-show="autocompleteTags.length > 0" class="autocomplete-tags">
        <div class="tags-container">
          <section class="tag-section">
            <div
              v-for="(item, index) in autocompleteTags"
              :key="item"
              :class="{ active: index === selectIndex }"
              class="tag-item"
              @click="selectTag(index)"
              v-text="item"
            />
          </section>
        </div>
      </div>
    </transition>
    <transition name="el-zoom-in-bottom">
      <div v-show="showRecommendTags" class="recommend-tags">
        <div class="tags-container">
          <div class="header">
            <span>推荐标签</span>
            <span
              class="close-recommend"
            ><i
              class="iconfont icon-close"
              @click="closeRecommendTags"
            /></span>
          </div>
          <a
            v-for="tag in recommendTags"
            :key="tag"
            class="tag-item"
            @click="addRecommendTag(tag)"
            v-text="tag"
          />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      tags: this.value || [],
      maxTagCount: 3, // 最多可以选择的标签数量
      maxWordCount: 15, // 每个标签最大字数
      showRecommendTags: false, // 是否显示推荐
      inputTag: '',
      autocompleteTags: [],
      selectIndex: -1
    }
  },
  computed: {
    // 推荐标签
    recommendTags () {
      return this.$store.state.config.config.recommendTags
    }
  },
  methods: {
    removeTag (event, tag) {
      const selectionStart = this.$refs.tagInput.selectionStart
      if (!this.inputTag || selectionStart === 0) {
        // input框没内容，或者光标在首位的时候就删除最后一个标签
        this.tags.splice(this.tags.length - 1, 1)
        this.$emit('input', this.tags)
      }
    },

    clickRemoveTag (event) {
      const tag = event.target.dataset.name
      if (tag) {
        const index = this.tags.indexOf(tag)
        if (index !== -1) {
          this.tags.splice(index, 1)
          this.$emit('input', this.tags)
        }
      }
    },

    /**
     * 手动点击选择标签
     * @param index
     */
    selectTag (index) {
      this.selectIndex = index
      this.addTag()
    },

    /**
     * 添加标签
     * @param event
     */
    addTag (event) {
      if (event) {
        event.stopPropagation()
        event.preventDefault()
      }

      if (
        this.selectIndex >= 0 &&
        this.autocompleteTags.length > this.selectIndex
      ) {
        this.addTagName(this.autocompleteTags[this.selectIndex])
      } else {
        this.addTagName(this.inputTag)
      }
      this.autocompleteTags = []
      this.selectIndex = -1
    },

    /**
     * 添加推荐标签
     * @param tagName
     */
    addRecommendTag (tagName) {
      this.addTagName(tagName)
      this.closeRecommendTags()
    },

    /**
     * 添加标签
     * @param tagName 标签名称
     * @returns {boolean} 是否成功
     */
    addTagName (tagName) {
      if (!tagName) {
        return false
      }

      // 最多四个标签
      if (this.tags && this.tags.length >= this.maxTagCount) {
        return false
      }

      // 每个标签最多15个字符
      if (tagName.length > this.maxWordCount) {
        return false
      }

      // 标签已经存在
      if (this.tags && this.tags.includes(tagName)) {
        return false
      }

      this.tags.push(tagName)
      this.inputTag = ''
      this.$emit('input', this.tags)
      return true
    },

    async autocomplete () {
      this.closeRecommendTags()
      this.selectIndex = -1
      if (!this.inputTag) {
        this.autocompleteTags = []
      } else {
        const ret = await this.$axios.post('/api/tag/autocomplete', {
          input: this.inputTag
        })
        this.autocompleteTags = []
        if (ret.length > 0) {
          for (let i = 0; i < ret.length; i++) {
            this.autocompleteTags.push(ret[i].name)
          }
        }
      }
    },

    selectUp (event) {
      event.stopPropagation()
      event.preventDefault()
      const curIndex = this.selectIndex
      const maxIndex = this.autocompleteTags.length - 1
      if (maxIndex < 0 || curIndex < 0) {
        // 已经在最顶部
        return
      }
      this.selectIndex--
    },

    selectDown (event) {
      event.stopPropagation()
      event.preventDefault()
      const curIndex = this.selectIndex
      const maxIndex = this.autocompleteTags.length - 1
      if (maxIndex < 0 || curIndex >= maxIndex) {
        // 已经在最底部
        return
      }
      this.selectIndex++
    },

    // 关闭推荐
    openRecommendTags () {
      this.showRecommendTags = true
    },

    // 开启推荐
    closeRecommendTags () {
      setTimeout(() => {
        this.showRecommendTags = false
      }, 300)
    },

    // 关闭自动补全
    close () {
      if (this.autocompleteTags && this.autocompleteTags.length > 0) {
        this.autocompleteTags = []
        this.selectIndex = -1
      }
      this.closeRecommendTags()
    }
  }
}
</script>
