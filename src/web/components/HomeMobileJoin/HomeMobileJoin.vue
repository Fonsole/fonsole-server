<template>
  <div>
    Join
  </div>
</template>

<script>
export default {
  data: () => ({
    joining: false,
  }),
  methods: {
    async join() {
      this.joining = true;
      localStorage.gameid = this.roomName;
      try {
        await this.$store.dispatch('joinRoom', {
          roomName: this.roomName,
        });
      } catch (err) {
        // TODO: Message
      }

      this.joining = false;
    },
  },
};
</script>

<style>

</style>
