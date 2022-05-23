<template>
  <nav class="dock-nav">
    <ul>
      <li :class="{ active: currentNodeId === 0 }">
        <nuxt-link to="/topics/node/newest">
          <img class="node-logo" src="~/assets/logos/arduino.svg">
          <span class="node-name">最新</span>
        </nuxt-link>
      </li>
      <li :class="{ active: currentNodeId === -1 }">
        <nuxt-link to="/topics/node/recommend">
          <img class="node-logo" src="~/assets/logos/raspberrypi.png">
          <span class="node-name">推荐</span>
        </nuxt-link>
      </li>
      <li :class="{ active: currentNodeId === -2 }">
        <nuxt-link to="/topics/node/feed">
          <img class="node-logo" src="~/assets/logos/tinygo-logo.png">
          <span class="node-name">关注</span>
        </nuxt-link>
      </li>
      <li
        v-for="node in nodes"
        :key="node.nodeId"
        :class="{ active: currentNodeId === node.nodeId }"
      >
        <nuxt-link :to="'/topics/node/' + node.nodeId">
          <img v-if="node.logo" class="node-logo" :src="node.logo">
          <img v-else class="node-logo" src="~/assets/images/node.png">
          <span class="node-name">{{ node.name }}</span>
        </nuxt-link>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  props: {
    nodes: {
      type: Array,
      default () {
        return []
      }
    }
  },
  computed: {
    currentNodeId () {
      return this.$store.state.env.currentNodeId
    }
  }
}
</script>

<style lang="scss" scoped>
.dock-nav {
  display: block;
  position: sticky;
  top: 10px;

  transition: all 0.2s linear;

  ul {
    display: flex;
    flex-direction: column;
    color: black;
    background-color: white;
    li {
      padding: 5px 0px;
      position: relative;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      border-left: 20px;
      &:hover {
        background-color: hsla(0, 0%, 94.9%, 0.6);
      }
      &.active {
        background-color: hsla(0, 0%, 94.9%, 0.6);
        border-left: solid;
        border-left-color: black;
      }

      a {
        text-decoration: none;
        cursor: pointer;
        color: var(--text-color3);
        width: 100%;
        height: 100%;
        text-align: center;
        line-height: 30px;
        padding-left: 10px;

        display: flex;
        align-items: center;
        //justify-content: center;
        .node-logo {
          width: 24px;

          border-radius: 4px;
          margin-right: 10px;
        }
      }
    }
  }
}
</style>
