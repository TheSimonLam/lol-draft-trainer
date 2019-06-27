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

    <div class="champ-select-box-container" v-bind:class="{ 'half-opacity': showChampSelectBox }">
      <input placeholder="Enter champion name..." type="text" v-model="filterString">
      <div class="champ-box-image-container" v-for="(champ, index) in filteredChamps" v-bind:key=index @click="champSelected(champ.id, false)">
          <img class="champ-box-image" v-if="!champ.banned && !champ.picked" :src="'http://ddragon.leagueoflegends.com/cdn/' + config.version + '/img/champion/' + champ.image.full">
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
      <div class="bans-container">
        <div class="champ-box-image-container" v-for="(champImg, index) in (playerSide === 'blue' ? playerBanImageUrlsArray : enemyBanImageUrlsArray)" v-bind:key=index>
            <img class="champ-box-image" :src="'http://ddragon.leagueoflegends.com/cdn/' + config.version + '/img/champion/' + champImg + '.png'">
        </div>
      </div>

      <div class="bans-container">
        <div class="champ-box-image-container" v-for="(champImg, index) in (playerSide === 'red' ? playerBanImageUrlsArray : enemyBanImageUrlsArray)" v-bind:key=index>
            <img class="champ-box-image" :src="'http://ddragon.leagueoflegends.com/cdn/' + config.version + '/img/champion/' + champImg + '.png'">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import store from '../store';
import { mapGetters } from 'vuex'
import pbConfig from "../pb-config";
const TIMER_DURATION = 10;

export default {
  name: 'ChampSelect',
  data(){
    return {
      filterString: '',
      champs: null,
      config: pbConfig,
      time: TIMER_DURATION,
      timer: '',
      pickedChecker: '',
      blueTurn: true,
      redTurn: false,
      champPicked: false,
      inBanPhase: true,
      enemyBanImageUrlsArray: [],
      playerBanImageUrlsArray: [],
      enemyPicksImageUrlsArray: [],
      enemyBansImageUrlsArray: [],
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
    },
    showChampSelectBox(){
      if((this.blueTurn && this.playerSide === "blue") || (this.redTurn && this.playerSide === "red")){
        return false;
      }
      return true
    }
  },
  methods: {
    startTimer: function(){
      this.timer = setInterval(() => {this.tick()}, 1000)
    },
    tick: function(){
      if(this.time === 0){
        //Auto choose a random champ for the player
        this.champPicked = true;
      }
      else{
        this.time -= 1;
      }
    },
    removeTimers: function(){
      clearInterval(this.timer);
      clearInterval(this.pickedChecker);
    },
    generateRandomEnemyTime: function(){
      let randomTime = Math.floor((Math.random() * TIMER_DURATION) + 1);
      return randomTime > (TIMER_DURATION - 3) ? randomTime - 4 : randomTime;
    },
    champSelected: function(champ, isEnemySelection){
      if(!this.champPicked){
        this.champPicked = true;

        if(isEnemySelection){
          this.enemyBanImageUrlsArray.push(champ);
        }
        else{
          this.playerBanImageUrlsArray.push(champ);
        }

        let info = {
          champId: champ
        };

        if(this.inBanPhase){
          info.banned = true;
          info.side = isEnemySelection ? this.enemySide : this.playerSide;
        }
        else{
          info.picked = true;
          info.side = isEnemySelection ? this.enemySide : this.playerSide;
        }

        store.commit('updateChamp', info);
      }
    },
    resetTimersAndSwitchSides: function(){
        this.champPicked = false;
        this.blueTurn = !this.blueTurn;
        this.redTurn = !this.redTurn;
        this.time = TIMER_DURATION;
        this.removeTimers();
    },
    waitForBlueBan: function(){
      return new Promise(resolve => {
        this.startTimer();
        if(this.playerSide === "blue"){
          this.pickedChecker = setInterval(() => {
            if(this.champPicked){
              this.resetTimersAndSwitchSides();
              resolve();
            }
          }, 100)
        }
        else{
          let randomPickTime = this.generateRandomEnemyTime();
          this.pickedChecker = setInterval(() => {
            if(this.time === randomPickTime){
              this.champSelected(this.enemyBanRandomChampFromConfig(), true);
              this.champPicked = true;
              this.resetTimersAndSwitchSides();
              resolve();
            }
          }, 100)
        }
      });
    },
    waitForRedBan: function(){
      return new Promise(resolve => {
        this.startTimer();
        if(this.playerSide === "red"){
          this.pickedChecker = setInterval(() => {
            if(this.champPicked){
              this.resetTimersAndSwitchSides();
              resolve();
            }
          }, 100)
        }
        else{
          let randomPickTime = this.generateRandomEnemyTime();
          this.pickedChecker = setInterval(() => {
            if(this.time === randomPickTime){
              this.champSelected(this.enemyBanRandomChampFromConfig(), true);
              this.champPicked = true;
              this.resetTimersAndSwitchSides();
              resolve();
            }
          }, 100)
        }
      });
    },
    enemyBanRandomChampFromConfig: function(){
      let randomArrPos = Math.floor((Math.random() * this.config.likelyPlayerPicks.length));

      for (let champ in this.champData) {
        if (this.champData.hasOwnProperty(champ)) {
          if(champ === this.config.likelyPlayerPicks[randomArrPos] && !this.champData[champ].banned){
            return champ;
          }
        }
      }
      return this.enemyBanRandomChampFromConfig();
    }
  },
  async created (){
      await this.waitForBlueBan();
      await this.waitForRedBan();
      await this.waitForBlueBan();
      await this.waitForRedBan();
      await this.waitForBlueBan();
      await this.waitForRedBan();
      this.banPhase = false;
      console.log(this.champData);
      console.log('boom');
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

  .red-champs-container{
    float: right;
    background: $red1;
  }

  .blue-champs-container{
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

  .half-opacity{
    opacity: 0.5;
  }

  .bans-container{
    width: 50%;
    display: inline-block;
  }
</style>
