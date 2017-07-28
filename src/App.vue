<template lang="pug">
    #app
        #controldiv
            span#connectedspan(hidden v-on:click="this.$state.commit('disconnect')")
                button#leaveroom Disconnect
        router-view#routerView
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
