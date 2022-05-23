<template>
  <div class="shadow-sm">
    <pc-nav class="pc-nav" />
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss">
// 当现实顶部导航栏的时候，顶部预留一段空白，防止重叠
body {
  @media screen and (max-width: 1024px) {
    padding-top: 46px;
  }
}
</style>
