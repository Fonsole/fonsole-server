<template>
  <div>
    <input v-model="roomName" type="number">
    <input @click="join" type="button" value="JOIN" :disabled="!isValidRoomName">
  </div>
</template>

<script>
export default {
  data: () => ({
    roomName: '',
    joining: false,
  }),
  computed: {
    isValidRoomName() {
      return this.$store.getters.isValidRoomName(this.roomName);
    },
  },
  methods: {
    async join() {
      this.joining = true;
      try {
        await this.$store.dispatch('joinRoom', {
          roomName: this.roomName,
        });
      } catch (err) {
        // TODO: Message
        // eslint-disable-next-line no-alert
        alert('Failed to join room: ', err);
      } finally {
        this.joining = false;
      }
    },
  },
};
</script>

<style lang="sass">
  input
    font-size: 10vh
    height: 12vh
    width: 24vw
</style>
