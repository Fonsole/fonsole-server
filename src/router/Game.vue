<template>
  <div>
    <!-- :src="`https://localhost:80/game/${$route.parmas.game}/pc.html`" -->
    <iframe id="game" ref="game" src="/static/games/test.html"></iframe>
  </div>
</template>
<script>
export default {
  mounted() {
    this.$store.commit('injectPlatform', this.$refs.game);
  },
};
</script>

<style lang="sass" scoped>
  div
    width: 100%
    height: 100%
  #game
    border: none
    position: absolute
    width: 100%
    height: 100%
</style>

