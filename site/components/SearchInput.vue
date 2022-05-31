<template>
  <div
    ref="searchForm"
    v-click-outside="onBlur"
    class=" border  rounded-full relative "
    :class="{ 'input-focus': inputFocus, 'show-histories': showHistories }"
  >
    <div class="search-input">
      <input
        v-model="keyword"
        name="q"
        class="input rounded-full px-4 text-sm m-0 border-gray-200"
        type="text"
        maxlength="30"
        placeholder="输入你想查找的内容"
        autocomplete="off"
        aria-autocomplete="off"
        @focus="onFocus"
        @input="onInput"
        @keyup.down="changeSelect(1)"
        @keyup.up="changeSelect(-1)"
        @keyup.enter="searchBoxOnEnter"
      >
      <span>
        <i class="iconfont icon-search" />
      </span>
    </div>
  </div>
</template>

<script>
import ClickOutside from 'vue-click-outside'
const localStorageKey = 'bbsgo.search.histories'
const maxHistoryLen = 10

export default {
  directives: {
    ClickOutside
  },
  data () {
    return {
      keyword: '',
      inputFocus: false,
      selectedIndex: -1,
      allHistories: []
    }
  },
  computed: {
    showHistories () {
      return this.inputFocus && this.histories && this.histories.length
    },
    histories () {
      if (this.keyword) {
        return this.allHistories.filter((history) => {
          return history.includes(this.keyword)
        })
      }
      return this.allHistories
    }
  },
  mounted () {
    this.keyword = this.$store.state.search.keyword
    this.loadAllHistories()
  },
  methods: {
    searchBoxOnEnter () {
      // 如果选中了历史搜索记录，那么使用历史搜索记录
      if (
        this.selectedIndex >= 0 &&
        this.histories &&
        this.histories.length > this.selectedIndex
      ) {
        this.keyword = this.histories[this.selectedIndex]
      }
      this.submitSearch()
    },
    historyItemClick (keyword) {
      this.keyword = keyword
      this.submitSearch()
    },
    submitSearch () {
      if (!this.keyword) {
        return
      }
      this.addHistories()
      window.location = '/search?q=' + encodeURIComponent(this.keyword)
    },
    onFocus () {
      this.inputFocus = true
    },
    onBlur () {
      this.inputFocus = false
    },
    onInput () {
      this.selectedIndex = -1
    },
    changeSelect (delta) {
      if (!this.histories || !this.histories.length) {
        return
      }
      let index = this.selectedIndex + delta
      if (index < 0) {
        // 选中熬第一个了，再往上取消选中
        index = -1
      } else if (index >= this.histories.length) {
        // 选中到最后了，再往下就回到第一个
        index = 0
      }
      this.selectedIndex = index
    },
    historyItemMouseOver (index) {
      this.selectedIndex = index
    },
    historyItemMouseOut () {
      this.selectedIndex = -1
    },
    loadAllHistories () {
      try {
        this.allHistories =
          JSON.parse(localStorage.getItem(localStorageKey)) || []
      } catch (error) {
        this.allHistories = []
      }
    },
    addHistories () {
      if (!this.keyword) {
        return
      }
      const newArray = []
      newArray.push(this.keyword)
      if (this.allHistories && this.allHistories.length) {
        for (let i = 0; i < this.allHistories.length; i++) {
          const element = this.allHistories[i]
          if (newArray.length < maxHistoryLen && !newArray.includes(element)) {
            newArray.push(element)
          }
        }
      }
      localStorage.setItem(localStorageKey, JSON.stringify(newArray))
      this.allHistories = newArray
    },
    deleteHistory (kw) {
      const newArray = []
      if (this.allHistories && this.allHistories.length) {
        for (let i = 0; i < this.allHistories.length; i++) {
          const element = this.allHistories[i]
          if (element !== kw && !newArray.includes(element)) {
            newArray.push(element)
          }
        }
      }
      localStorage.setItem(localStorageKey, JSON.stringify(newArray))
      this.allHistories = newArray
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
