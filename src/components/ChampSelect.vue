<template>
  <div class="champ-sel-container">
    <div class="error-no-champ-overlay" v-if="errorNoChampPicked">
      <div>You failed to select a champion on time!</div>
      <button class="restart-btn" @click="playAgain">Restart</button>
    </div>
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
      <div class="picked-champ-container" v-for="(champImg, index) in (playerSide === 'blue' ? playerPicksImageUrlsArray : enemyPicksImageUrlsArray)" v-bind:key=index>
        <img class="picked-champ-img" :src="'http://ddragon.leagueoflegends.com/cdn/' + config.version + '/img/champion/' + champImg + '.png'">
      </div>
    </div>

    <div class="champ-select-box-container" v-bind:class="{ 'half-opacity': isPlayersTurn }">
      <input placeholder="Enter champion name..." type="text" v-model="filterString">
      <div class="champ-box-image-container" v-for="(champ, index) in filteredChamps" v-bind:key=index @click="champSelected(false, champ.id)">
          <img class="champ-box-image" v-if="!champ.banned && !champ.picked" :src="'http://ddragon.leagueoflegends.com/cdn/' + config.version + '/img/champion/' + champ.image.full">
      </div>
    </div>

    <div class="champs-container red-champs-container">
      <div class="picked-champ-container" v-for="(champImg, index) in (playerSide === 'red' ? playerPicksImageUrlsArray : enemyPicksImageUrlsArray)" v-bind:key=index>
        <img class="picked-champ-img" :src="'http://ddragon.leagueoflegends.com/cdn/' + config.version + '/img/champion/' + champImg + '.png'">
      </div>
    </div>

    <div class="ban-bar-container">
      <div class="bans-container">
        <div class="champ-box-image-container" v-for="(champImg, index) in (playerSide === 'blue' ? playerBansImageUrlsArray : enemyBansImageUrlsArray)" v-bind:key=index>
            <img class="champ-box-image" :src="'http://ddragon.leagueoflegends.com/cdn/' + config.version + '/img/champion/' + champImg + '.png'">
        </div>
      </div>

      <div class="bans-container">
        <div class="champ-box-image-container" v-for="(champImg, index) in (playerSide === 'red' ? playerBansImageUrlsArray : enemyBansImageUrlsArray)" v-bind:key=index>
            <img class="champ-box-image" :src="'http://ddragon.leagueoflegends.com/cdn/' + config.version + '/img/champion/' + champImg + '.png'">
        </div>
      </div>

      <button class="restart-btn" v-if="!isPlayersTurn" @click="playAgain">Restart</button>
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
      pickedChecker: '',
      blueTurn: true,
      redTurn: false,
      previousSideTurn: "blue",
      inBanPhase: true,
      numChampsToSelect: 1,
      numChampsSelected: 0,
      enemyBansImageUrlsArray: [],
      playerBansImageUrlsArray: [],
      enemyPicksImageUrlsArray: [],
      playerPicksImageUrlsArray: [],
      errorNoChampPicked: false
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
    isPlayersTurn(){
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
        this.errorNoChampPicked = true;
      }
      else{
        this.time -= 1;
      }
    },
    removeTimers: function(){
      this.time = TIMER_DURATION;
      clearInterval(this.timer);
      clearInterval(this.pickedChecker);
    },
    generateRandomEnemyTime: function(){
      let randomTime = Math.floor((Math.random() * TIMER_DURATION) + 1);
      return randomTime > (TIMER_DURATION - 3) ? randomTime - 4 : randomTime;
    },
    champSelected: function(isEnemySelection, champId){
      if(!isEnemySelection && this.isPlayersTurn){return;}
      let generatedChampId = isEnemySelection ? this.inBanPhase ? this.enemyBanRandomChampFromConfig() : this.enemyPickRandomChampFromConfig() : null;

      this.numChampsSelected += 1;

      let info = {
        champId: champId || generatedChampId
      };

      if(this.inBanPhase){
        info.banned = true;
        info.side = isEnemySelection ? this.enemySide : this.playerSide;

        if(isEnemySelection){
          this.enemyBansImageUrlsArray.push(generatedChampId);
        }
        else{
          this.playerBansImageUrlsArray.push(champId);
        }
      }
      else{
        info.picked = true;
        info.side = isEnemySelection ? this.enemySide : this.playerSide;

        if(isEnemySelection){
          this.enemyPicksImageUrlsArray.push(generatedChampId);
        }
        else{
          this.playerPicksImageUrlsArray.push(champId);
        }
      }

      store.commit('updateChamp', info);
    },
    resetTimers: function(){
        this.numChampsToSelect = 1;
        this.numChampsSelected = 0;
        this.removeTimers();
    },
    checkSwitchSides: function(side){
        if(this.previousSideTurn !== side){
            this.previousSideTurn = side;
            this.blueTurn = !this.blueTurn;
            this.redTurn = !this.redTurn;
        }
    },
    startRound: function(side, isBanPhase, numChampsToSelect){
      this.checkSwitchSides(side);
      this.numChampsToSelect = numChampsToSelect;
      this.inBanPhase = isBanPhase;

      return new Promise(resolve => {
        this.startTimer();
        if(this.playerSide === side){
          this.waitForPlayer(resolve, side);
        }
        else{
          this.waitForEnemy(resolve, side);
        }
      });
    },
    waitForPlayer: function(resolve, side){
      this.pickedChecker = setInterval(() => {
        if(this.numChampsSelected === this.numChampsToSelect){
          this.resetTimers();
          resolve();
        }
      }, 100)
    },
    waitForEnemy: function(resolve, side){
      let randomPickTime = this.generateRandomEnemyTime();
      this.pickedChecker = setInterval(() => {
        if(this.time === randomPickTime){
          if(this.numChampsToSelect === 2){
            this.champSelected(true);
            this.champSelected(true);
          }
          else{
            this.champSelected(true);
          }
          this.resetTimers();
          resolve();
        }
      }, 100)
    },
    enemyBanRandomChampFromConfig: function(){
      let randomArrPos = Math.floor((Math.random() * this.config.likelyPlayerPicks.length));
      for (let champ in this.champData) {
        if (this.champData.hasOwnProperty(champ)) {
          if(champ === this.config.likelyPlayerPicks[randomArrPos] && !this.champData[champ].banned && !this.champData[champ].picked){
            return champ;
          }
        }
      }
      return this.enemyBanRandomChampFromConfig();
    },
    enemyPickRandomChampFromConfig: function(){
      let priorityConfig = this.enemySide === "red" ? pbConfig.redConfig.priorityLanes : pbConfig.blueConfig.priorityLanes,
          priorityLane = priorityConfig[this.enemyPicksImageUrlsArray.length],
          potentialChampsArray = [];

      for (let champ in this.champData) {
        if (this.champData.hasOwnProperty(champ) && this.champData[champ].potentialEnemySide && this.champData[champ].lanes) {
          for(let i=0;i<this.champData[champ].lanes.length;i++){
            if(this.champData[champ].lanes[i] === priorityLane && !this.champData[champ].banned && !this.champData[champ].picked){
              potentialChampsArray.push(this.champData[champ].id);
            }
          }
        }
      }

      if(potentialChampsArray.length === 0){
        for (let champ in this.champData) {
          if(!this.champData[champ].banned && !this.champData[champ].picked){
            potentialChampsArray.push(this.champData[champ].id);
          }
        }
      }

      let randomArrPos = Math.floor((Math.random() * potentialChampsArray.length));
      return potentialChampsArray[randomArrPos];
    },
    play: async function(){
        // Ban Phase 1
        await this.startRound('blue', true, 1); // (side, isBanPhase, numChampsToSelect)
        await this.startRound('red', true, 1);
        await this.startRound('blue', true, 1);
        await this.startRound('red', true, 1);
        await this.startRound('blue', true, 1);
        await this.startRound('red', true, 1);

        // Pick Phase 1
        await this.startRound('blue', false, 1);
        await this.startRound('red', false, 2);
        await this.startRound('blue', false, 2);
        await this.startRound('red', false, 1);

        // // Ban Phase 2
        await this.startRound('red', true, 1);
        await this.startRound('blue', true, 1);
        await this.startRound('red', true, 1);
        await this.startRound('blue', true, 1);

        // Pick Phase 2
        await this.startRound('red', false, 1);
        await this.startRound('blue', false, 2);
        await this.startRound('red', false, 1);

        this.time = '';
    },
    playAgain: function(){
      this.errorNoChampPicked = false;
      this.enemyBansImageUrlsArray = [];
      this.playerBansImageUrlsArray = [];
      this.enemyPicksImageUrlsArray = [];
      this.playerPicksImageUrlsArray = [];
      this.removeTimers();
      store.commit('resetSelectedChamps'); //might not have to do this
      this.play();
    },
  },
  created (){
      this.play();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  @import "../css/global";

  .champ-sel-container{
    background: url('../assets/champ-select.png');
    background-position: center; /* Center the image */
    background-repeat: no-repeat; /* Do not repeat the image */
    background-size: cover; /* Resize the background image to cover the entire container */
    height: 100%;
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
    position: absolute;
  }

  .red-champs-container{
    float: right;
    background: $red1;
    top: 50px;
    right: 0;
  }

  .blue-champs-container{
    float: left;
    background: $blue1;
    top: 50px;
    left: 0;
  }

  .ban-bar-container{
    background: $blue3;
    min-height: 150px;
  }

  .picked-champ-container{
    border-bottom: 2px solid black;
    height: 100px;
  }

  .picked-champ-img{
    height: 100%;
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

  .error-no-champ-overlay{
    position: absolute;
    height: 100%;
    width: 100%;
    color: white;
    text-align: center;
    background: red;
    font-size: 2em;
    line-height: 400px;
    z-index: 1;
  }

  .restart-btn{
    border: 0;
    border-radius: 5px;
    color: black;
    width: 100px;
    font-weight: bold;
    height: 30px;
  }
</style>
