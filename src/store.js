import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    champData: {},
    playerSide: 'blue',
    enemySide: 'red'
  },
  mutations: {
    setChampData (state, champData) {
      state.champData = champData;
    },
    resetSelectedChamps (state){
      //RESET CHAMPDATA STATE
    },
    setSides (state, playerSide){
      state.playerSide = playerSide;
      state.enemySide = playerSide === 'red' ? 'blue' : 'red';
    },
    updatePotentialEnemyChampPick (state, info){
      state.champData[info.champId].lanes = state.champData[info.champId].lanes || [];

      if(state.champData[info.champId].lanes.includes(info.lane)){
        delete state.champData[info.champId].potentialEnemySide;
        let index = state.champData[info.champId].lanes.indexOf(info.lane);
        if (index !== -1) {
          state.champData[info.champId].lanes.splice(index, 1);
        }
      }
      else{
        state.champData[info.champId].potentialEnemySide = info.potentialEnemySide;
        state.champData[info.champId].lanes.push(info.lane);
      }
    },
    updateChamp (state, info){
      state.champData[info.champId].side = info.side;

      if(info.banned){
        state.champData[info.champId].banned = true;
      }
      else{
        state.champData[info.champId].picked = true;
      }
      console.log(state);
    }
  },
  actions: {

  },
  getters: {
    getChampData: state => {
      return state.champData;
    },
    getPlayerSide: state => {
      return state.playerSide;
    },
    getEnemySide: state => {
      return state.enemySide;
    }
  }
})
