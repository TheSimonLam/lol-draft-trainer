<template>
  <div class="draft-trainer-container">

    <!-- SELECT SIDE -->
    <div v-if="!sideSelected && !playing" class="container select-side-container opacity-fade">
      <div class="container-text">Please select your side:</div>
      <button class="blue-btn" @click="selectSide('blue')">Blue</button> <button class="red-btn" @click="selectSide('red')">Red</button>
    </div>

    <!-- SELECT ENEMY CHAMPS -->
    <template v-if="sideSelected && !playing">
      <div class="opacity-fade" id="select-enemy" >
        <div  class="container">
          <div class="container-text">Please select potential enemy <span class="red">top</span> laners:</div>
          <ChampBox v-bind:side="getEnemySide" lane="top"></ChampBox>
        </div>

        <div  class="container">
          <div class="container-text">Please select potential enemy <span class="red">junglers</span>:</div>
          <ChampBox v-bind:side="getEnemySide" lane="jungle"></ChampBox>
        </div>

        <div  class="container">
          <div class="container-text">Please select potential enemy <span class="red">mid</span> laners:</div>
          <ChampBox v-bind:side="getEnemySide" lane="mid"></ChampBox>
        </div>

        <div  class="container">
          <div class="container-text">Please select potential enemy <span class="red">support</span>:</div>
          <ChampBox v-bind:side="getEnemySide" lane="support"></ChampBox>
        </div>

        <div  class="container">
          <div class="container-text">Please select potential enemy <span class="red">ADCs</span>:</div>
          <ChampBox v-bind:side="getEnemySide" lane="adc"></ChampBox>
        </div>

        <button class="start-button" @click="setPlaying">Start</button>
      </div>
    </template>

    <ChampSelect v-if="playing"></ChampSelect>

  </div>
</template>

<script>
import store from '../store';
import { mapGetters } from 'vuex'
import ChampBox from './ChampBox';
import ChampSelect from './ChampSelect';

export default {
  name: 'DraftTrainer',
  components: {
    ChampBox,
    ChampSelect
  },
  data(){
    return {
      playing: false, //TODO: SET THIS BACK TO FALSE!,
      sideSelected: false
    }
  },
  computed: {
    ...mapGetters([
      'potentialEnemyLaners',
      'getPlayerSide',
      'getEnemySide'
    ])
  },
  methods: {
    setPlaying: function(){
      this.playing = !this.playing;
    },
    selectSide: function(side){
      document.getElementsByClassName("select-side-container")[0].className += " opacity-fade-out";
      let fadeSideSelect = new Promise((resolve, reject) => {
        setTimeout(() =>{
          store.commit('setSides', side);
          this.sideSelected = true;
          resolve();
        }, 500);
      });

      fadeSideSelect.then(() => {
        setTimeout(() =>{document.getElementById("select-enemy").className += " opacity-fade-in";}, 500);
      });
    }
  },
  created (){
    setTimeout(() =>{document.getElementsByClassName("select-side-container")[0].className += " opacity-fade-in";}, 500);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  @import "../css/global";

  .draft-trainer-container{
    display: inline-block;
    width: 100%;
  }

  .container{
    border-radius: 5px;
    background: #348498;
    padding: 10px;
    margin-bottom: 20px;
  }

  .select-side-container{
    width: 500px;
    margin: 0 auto;
    button{
      color: $white;
      border: 0;
      padding: 10px;
      display: inline-block;
      width: 50%;
      border-radius: 5px;
      font-size: 1.5em;
    }
  }

  .blue-btn{
    background: $blue1;
    &:hover{
        background: white;
        color: $blue1;
        font-weight: bold;
      }
  }

  .red-btn{
    background: $red1;
    &:hover{
        background: white;
        color: $red1;
        font-weight: bold;
      }
  }

  .container-text{
    padding-bottom: 10px;
  }

  .red{
    color: $red1;
    font-weight: bold;
  }

  .start-button{
    border: 0;
    border-radius: 5px;
    color: white;
    font-weight: bold;
    background: #ff502f;
    font-size: 1.5em;
    height: 50px;
    width: 300px;
    margin-bottom: 50px;
  }
</style>
