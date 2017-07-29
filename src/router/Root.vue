<template>
  <div>
    <div class="logo">
      <img class="logo-img" src="http://placehold.it/300x125" />
    </div>
    <div class="container">
      <form>
        <fieldset>
          <div class="roomField">
            <label for="roomname" class="text-signin">Room Code</label>
            <br>
            <input id="roomname" class="pure-input-1 jbg-input" v-model="roomname" :value="roomname.toUpperCase()" @input="roomname = $event.target.value.toUpperCase()" type="text" tabindex="1" placeholder="ENTER ROOM CODE" style="text-transform:uppercase;" maxlength="6" autocapitalize="off" autocorrect="off" autocomplete="off">
          </div>
          <div class="nameField">
            <label for="playername" class="text-signin">Name (Limit 12 Characters)</label>
            <br>
            <input id="playername" class="pure-input-1 jbg-input" v-model="playername" :value="playername.toUpperCase()" @input="playername = $event.target.value.toUpperCase()" type="text" tabindex="2" placeholder="ENTER YOUR NAME" style="text-transform:uppercase;" maxlength="12" autocapitalize="off" autocorrect="off" autocomplete="off">
          </div>
        </fieldset>
      </form>
      <div class="button">
        <input type="submit" value="PLAY" id="button-join" tabindex="3" class="button-signin button-blue button-xlarge pure-button" :disabled="joining" v-on:click="join">
      </div>
      <a href="./bigview.zip">
        <div class="button">
          <input type="submit" value="Download Desktop Game Client" id="button-download" tabindex="3" class="button-signin button-blue button-xlarge pure-button">
        </div>
      </a>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Root',
  data() {
    return {
      joining: false,
      roomname: localStorage.roomname || '',
    };
  },
  methods: {
    join() {
      localStorage.gameid = this.roomname;
      localStorage.playername = this.playername;
      this.$store.commit('joinRoom', {
        roomname: this.roomname,
        playername: this.playername,
      });

      // since the game redirects in case of an error, we can just
      // disable the button once it's clicked to stop people spamming
      this.joining = true;
    },
  },
};
</script>

<style lang="sass">
#controldiv
  display: none
  background: #fff
  padding: 3px
  width: 100%
  color: white
  height: 9vh
label
  white-space:nowrap
button
  margin-top: 1%
  color: white
  background-color: #333333
  border-radius: 2vw
  border: none
  box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19)
  width: 20vw
  height: 5vh
  display: block


/* main.css */
.container
  width: 100%
  max-width: 960px
  text-align: center

/* Logo styles */

.logo
  position: relative
  margin-top: 30px
  margin-bottom: 15px

.logo-img
  display: block
  width: auto
  max-width: 75%
  margin: 0 auto

/* Form styles */

.container form
  text-align: left
  input
    width: 100%
    border-radius: 2px
    border: 1px solid #BBBBBB
    padding: 7px
    font-weight: bold
    margin-bottom: 8px
    -webkit-box-shadow: inset 0 0 2px #BBB
    -moz-box-shadow: inset 0 0 2px #BBB
    box-shadow: inset 0 0 2px #BBB
    background: transparent
  label
    color: #3B52FD
    margin-bottom: 0

/* Button Styles */

.button-blue
  background: #3B52FD
  border: none
  padding: 12px
  color: #ffffff
  font-weight: bold

@media (max-width: 480px)
  #button-download
    width: 100%
    font-size: 16px
</style>

<style lang="sass" scoped>
#button-join
  border-radius: 5px
  font-size: 12px
  width: 100%
  margin-top: 5px
  font-weight: 800
  &:disabled
    background-color: grey

#button-download
  border-radius: 3px
  font-size: 18px
  padding-top: 20px
  padding-bottom: 20px
  margin-top: 20px
  text-shadow: 1px 1px #000000

@media (max-width: 480px)
  #button-download
    width: 100%
    font-size: 16px
</style>
