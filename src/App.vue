<template>
  <div id="app">
    <div id="controldiv">
      <span id="connectedspan" hidden @click="this.$state.commit('disconnect')">
        <button id="leaveroom">
          Disconnect
        </button>
      </span>
    </div>
    <router-view id="routerView" />
  </div>
</template>

<script>
export default {
  name: 'app',
};
</script>

<style lang="sass" scoped>
*
  margin: 0
  padding: 0
  box-sizing: border-box
body
  font: Helvetica, Arial
  height: 100vh
#routerView
  width: 100%
  height: 100vh
  border: none
</style>
