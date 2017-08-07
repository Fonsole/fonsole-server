<template>
  <div>
    <!-- Used to show correct home page to mobile or desktop -->
    <component :is="component"></component>
  </div>
</template>
<script>
/**
 * @file Base Home component.
 *       Used to show correct component for user's useragent.
 */
import HomeDesktop from '@/components/HomeDesktop/HomeDesktop';
import HomeMobile from '@/components/HomeMobile/HomeMobile';

export default {
  name: 'Home',
  components: {
    HomeMobile,
    HomeDesktop,
  },
  computed: {
    component() {
      return this.$store.state.mobileInterface.isMobile ? 'HomeMobile' : 'HomeDesktop';
    },
  },
};
</script>

<style lang="sass">

</style>
