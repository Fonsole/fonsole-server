<template>
  <div>
    <div class="logo">
      <img class="logo-img" src="http://placehold.it/300x125"></img>
    </div>
    <div class="container">
      <form>
        <fieldset>
          <div class="roomField">
            <label for="roomName" class="text-signin">Room Code</label>
            <br>
            <input
              id="roomName"
              class="pure-input-1 jbg-input"
              v-model="roomName"
              :value="roomName.toUpperCase()"
              @input="roomName = $event.target.value.toUpperCase()"
              type="text"
              tabindex="1"
              placeholder="ENTER ROOM CODE"
              maxlength="6"
              autocapitalize="off"
              autocorrect="off"
              autocomplete="off"
            >
          </div>
        </fieldset>
      </form>
      <div class="button">
        <input
          type="submit"
          value="PLAY"
          id="button-join"
          tabindex="3"
          class="button-signin button-blue button-xlarge pure-button"
          :disabled="joining"
          @click="join"
        >
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Root',
  data() {
    return {
      joining: false,
      roomName: localStorage.roomName || '',
    };
  },
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

<style lang="sass">

</style>
