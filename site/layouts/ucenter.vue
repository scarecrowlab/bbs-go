<template>
  <div>
    <my-nav />

    <div class=" container flex flex-col m-auto ">
      <user-profile :user="user" />
      <div class="container flex flex-row m-auto ">
        <user-center-sidebar :user="user" class="w-64" />
        <div class="right-container">
          <nuxt />
        </div>
      </div>
    </div>

    <my-footer />
  </div>
</template>

<script>
export default {
  middleware: 'authenticated',
  computed: {
    user () {
      return this.$store.state.user.current
    }
  },
  methods: {}
}
</script>

<style lang="scss" scoped></style>
