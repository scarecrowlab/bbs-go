<template>
  <ul class="nav  ">
    <li :class="{ ' bg-gray-50   border-l-blue-500 ': currentNodeId === 0 }" class="px-2 border-l-2">
      <nuxt-link to="/topics/node/newest" class="flex py-2">
        <div
          class="bg-no-repeat  bg-contain bg-center"
          style="background-image: url('/logos/arduino.svg');width: 20px;"
        />
        <span class="node-name pl-4 text-base">最新</span>
      </nuxt-link>
    </li>
    <li :class="{ 'bg-gray-50 border-l-blue-500': currentNodeId === -1 }" class="px-2 border-l-2">
      <nuxt-link to="/topics/node/recommend" class="flex py-2">
        <div
          class="bg-no-repeat   bg-contain bg-center"
          style="background-image: url('/logos/raspberrypi.png');width: 20px;"
        />
        <span class="node-name  pl-4 text-base">推荐</span>
      </nuxt-link>
    </li>
    <li :class="{ 'bg-gray-50 border-l-blue-500': currentNodeId === -2 }" class="px-2 border-l-2">
      <nuxt-link to="/topics/node/feed" class="flex py-2">
        <div
          class="bg-no-repeat  bg-contain bg-center"
          style="background-image: url('/logos/tinygo-logo.png');width: 20px;"
        />
        <span class="node-name pl-4 text-base">关注</span>
      </nuxt-link>
    </li>
    <li
      v-for="node in nodes"
      :key="node.nodeId"
      :class="{ 'bg-gray-50 border-l-blue-500': currentNodeId === node.nodeId }"
      class="px-2 border-l-2"
    >
      <nuxt-link :to="'/topics/node/' + node.nodeId" class="flex py-2">
        <div
          v-if="node.logo"
          class="bg-no-repeat bg-contain bg-center"
          :style="{
            width:'20px',
            backgroundImage:'url(\''+node.logo+'\')'
          }"
        />
        <img
          v-else
          class="
          node-logo"
          width="20px"
          src="~/assets/images/node.png"
        >
        <span class="node-name pl-4 text-base">{{ node.name }}</span>
      </nuxt-link>
    </li>
  </ul>
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
