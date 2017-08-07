<template>
  <div>
    <component :is="component"></component>
  </div>
</template>
<script>
import HomeMobileGame from '@/components/HomeMobileGame/HomeMobileGame';
import HomeMobileJoin from '@/components/HomeMobileJoin/HomeMobileJoin';
import HomeMobileMenu from '@/components/HomeMobileMenu/HomeMobileMenu';

export default {
  name: 'HomeMobile',
  components: {
    HomeMobileGame,
    HomeMobileJoin,
    HomeMobileMenu,
  },
  computed: {
    component() {
      // If player hasn't joined a room => show room joining interface
      if (!this.$store.state.networking.roomName) return 'HomeMobileJoin';
      // If current room has active game => show game interface. Otherwise show menu controller.
      return this.$store.state.networking.gameName ? 'HomeMobileGame' : 'HomeMobileMenu';
    },
  },
};
</script>

<style lang="sass">

</style>
