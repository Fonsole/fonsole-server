<template>
  <div>
    <iframe id="game" ref="game" :src="gameUrl"></iframe>
  </div>
</template>

<script>
export default {
  data: () => ({
    url: '',
  }),
  computed: {
    gameUrl: () => `/games/${this.$store.state.networking.gameName}.html`,
  },
  mounted() {
    this.$store.commit('attachNetworkingApi', this.$refs.game);
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
