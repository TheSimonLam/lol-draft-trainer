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
    updateEnemyChamp (state, selectedInfo){
      state.champData[selectedInfo.champId].lanes = state.champData[selectedInfo.champId].lanes || [];

      if(state.champData[selectedInfo.champId].lanes.includes(selectedInfo.lane)){
        delete state.champData[selectedInfo.champId].potentialEnemySide;
        let index = state.champData[selectedInfo.champId].lanes.indexOf(selectedInfo.lane);
        if (index !== -1) {
          state.champData[selectedInfo.champId].lanes.splice(index, 1);
        }
      }
      else{
        state.champData[selectedInfo.champId].potentialEnemySide = selectedInfo.potentialEnemySide;
        state.champData[selectedInfo.champId].lanes.push(selectedInfo.lane);
      }
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
