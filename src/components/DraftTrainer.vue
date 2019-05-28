<template>
  <div class="draft-trainer-container">

    <!-- SELECT SIDE -->
    <div v-if="!selectedSide" class="select-side-container opacity-fade">
      <div class="select-side-text">Please select your side:</div>
      <button class="blue-btn" @click="selectSide('blue')">Blue</button> <button class="red-btn" @click="selectSide('red')">Red</button>
    </div>

    <!-- SELECT CHAMPS -->

  </div>
</template>

<script>
import store from '../store';

export default {
  name: 'DraftTrainer',
  data(){
    return{
      selectedSide: null
    }
  },
  methods: {
    init: function(){
      // RESET ALL VARIABLES HERE!
      store.commit('resetSelectedChamps');
    },
    replay: function(){
      //Play again, with same enemy champs and configs
    },
    selectSide: function(side){
      document.getElementsByClassName("select-side-container")[0].className += " opacity-fade-out";
      setTimeout(() =>{this.selectedSide = side;}, 500);
    }
  },
  created (){
    setTimeout(() =>{document.getElementsByClassName("select-side-container")[0].className += " opacity-fade-in";}, 500);
    this.init();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  @import "../css/global";

  .draft-trainer-container{
    display: inline-block;
  }

  .select-side-container{
    width: 500px;
    border-radius: 5px;
    background: #348498;
    padding: 50px;
    button{
      color: $white;
      border: 0;
      padding: 20px;
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

  .select-side-text{
    font-size: 1.5em;
    padding-bottom: 20px;
  }
</style>
