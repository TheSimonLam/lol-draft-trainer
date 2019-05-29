<template>
  <div class="champ-sel-container">
    <div class="champ-sel-header">
      <div class="header-section blue-side">
        <span v-if="playerSide ==='blue'" class="side-title">YOU</span>
        <span v-else class="side-title">ENEMY</span>
      </div>

      <div class="header-section">
        <div v-if="blueTurn" class="timer">:{{time}}</div>
        <img v-bind:src="require('../assets/lol-logo.png')" class="header-logo">
        <div v-if="redTurn" class="timer">:{{time}}</div>
      </div>

      <div class="header-section red-side">
        <span v-if="playerSide ==='red'" class="side-title">YOU</span>
        <span v-else class="side-title">ENEMY</span>
      </div>
    </div>

    <div class="champs-container blue-champs-container">
      <div class="picked-champ-container"><img class="picked-champ-img"></div>
      <div class="picked-champ-container"><img class="picked-champ-img"></div>
      <div class="picked-champ-container"><img class="picked-champ-img"></div>
      <div class="picked-champ-container"><img class="picked-champ-img"></div>
      <div class="picked-champ-container"><img class="picked-champ-img"></div>
    </div>

    <div class="champ-select-box-container">
      <input placeholder="Enter champion name..." type="text" v-model="filterString">
      <div class="champ-box-image-container" v-for="(champ, index) in filteredChamps" v-bind:key=index>
          <img class="champ-box-image" :src="'http://ddragon.leagueoflegends.com/cdn/' + config.version + '/img/champion/' + champ.image.full" @click="playerPick(champ.id)">
        </div>
    </div>

    <div class="champs-container red-champs-container">
      <div class="picked-champ-container"><img class="picked-champ-img"></div>
      <div class="picked-champ-container"><img class="picked-champ-img"></div>
      <div class="picked-champ-container"><img class="picked-champ-img"></div>
      <div class="picked-champ-container"><img class="picked-champ-img"></div>
      <div class="picked-champ-container"><img class="picked-champ-img"></div>
    </div>

    <div class="ban-bar-container">

    </div>
  </div>
</template>

<script>
import store from '../store';
import { mapGetters } from 'vuex'
import pbConfig from "../pb-config";
const TIMER_DURATION = 5;

export default {
  name: 'ChampSelect',
  data(){
    return {
      filterString: '',
      champs: null,
      config: pbConfig,
      time: TIMER_DURATION,
      timer: '',
      blueTurn: true,
      redTurn: false,
      banPhase1: 0,
      pickPhase1: 0,
      banPhase2: 0,
      pickPhase2: 0,
      blueBans: [],
      redBans: []
    }
  },
  computed: {
    ...mapGetters({
      champData: 'getChampData',
      playerSide: 'getPlayerSide',
      enemySide: 'getEnemySide'
    }),
    filteredChamps(){
      this.champs = Object.values(this.champData);
      this.champs = Object.assign([], this.champs).filter(
        champ => champ.name.toLowerCase().indexOf(this.filterString.toLowerCase()) > -1
      )
      return this.champs;
    }
  },
  methods: {
    blueIsBanning: function(){
      if(this.playerSide === 'blue'){
        this.waitPlayerBan().then((res) => {
          this.blueBans.push(res);
          this.banPhase += 1;
          this.blueTurn = false;
          this.redTurn = true;
        });
      }
      else{
        this.waitEnemyRandomBan().then((res) => {
          this.blueBans.push(res);
          this.banPhase += 1;
          this.blueTurn = false;
          this.redTurn = true;
        });
      }
    },
    redIsBanning: function(){
      if(this.playerSide === 'blue'){
        this.waitPlayerBan().then((res) => {
          this.redBans.push(res);
          this.banPhase += 1;
          this.blueTurn = true;
          this.redTurn = false;

        });
      }
      else{
        this.waitEnemyRandomBan().then((res) => {
          this.redBans.push(res);
          this.banPhase += 1;
          this.blueTurn = true;
          this.redTurn = false;
        });
      }
    },
    waitEnemyRandomBan: function(){
      //Promise in here
    },
    waitEnemyRandomPick: function(){
      //Promise in here
    },
    waitPlayerBan: function(){
      //Promise in here
    },
    waitPlayerPick: function(){
      //Promise in here
    },
    startTimer: function(){
      this.timer = setInterval(() => {this.tick()}, 1000)
    },
    tick: function(){
      if(this.time === 0){
        this.removeTimer();
        //Pick a blank champion (missed ban) or pick random champ
      }
      else{
        //Bulk of the game logic goes here
        if(this.banPhase1 < 3){ //If we're in first ban phase
          if(this.blueTurn){
            this.blueIsBanning();
          }
          else{
            this.redIsBanning();
          }
        }
        else if(this.pickPhase1 < 3){ //If we're in first pick phase

        }
        else if(this.banPhase2 < 2){ //If we're in second ban phase

        }
        else if(this.pickPhase2 < 2){ //If we're in second pick phase

        }
        this.time -= 1;
      }
    },
    restartTimer: function(){
      this.time = TIMER_DURATION;
    },
    removeTimer: function(){
      clearInterval(this.timer);
    }
  },
  created (){
      this.startTimer();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  @import "../css/global";

  .champ-sel-container{
    background: url('../assets/champ-select.png');
    height: 500px; /* You must set a specified height */
    background-position: center; /* Center the image */
    background-repeat: no-repeat; /* Do not repeat the image */
    background-size: cover; /* Resize the background image to cover the entire container */
    height: 600px;
    position: relative;
  }

  .champ-sel-header{
    text-align: center;
  }

  .header-section{
    width: 33.33%;
    display: inline-block;
    height: 100%;
    vertical-align: top;
  }

  .blue-side{
    background: $blue1;
  }

  .red-side{
    background: $red1;
  }

  .side-title{
    font-weight: bold;
    color: white;
    font-size: 2em;
  }

  .timer{
    display: inline-block;
    font-size: 2em;
  }

  .header-logo{
    height: 35px;
    padding: 0 20px;
    display: inline-block;
  }

  .champs-container{
    width: 20%;
  }

  .blue-champs-container{
    float: right;
    background: $red1;
  }

  .red-champs-container{
    float: left;
    background: $blue1
  }

  .ban-bar-container{
    height: 100px;
    background: $blue3;
  }

  .picked-champ-container{
    border-bottom: 2px solid black;
    height: 100px;
  }

  .picked-champ-img{

  }

  .champ-select-box-container{
    width: 50%;
    height: 510px;
    display: inline-block;
    background: black;
    margin: 20px;
    border-radius: 5px;
    overflow-y: scroll;
  }

  .champ-box-image-container{
    display: inline-block;
    max-height: 130px;
  }

  .champ-box-image{
    height: 60px;
    padding: 4px;
  }

  input{
    display: block;
    width: 100%;
    text-align: center;
    font-size: 1em;
    font-weight: bold;
    padding: 5px 0;
    border: 0;
  }
</style>
