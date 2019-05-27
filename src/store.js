import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    champData: {},
    red: {},
    blue: {}
  },
  mutations: {
    setChampData (state, champData) {
      state.champData = champData;
    },
    setSelectedChamps (state, selectedChampData) {
      state[selectedChampData.side][selectedChampData.role] = selectedChampData.champName;
    },
    resetSelectedChamps (state){
      state.red = {};
      state. blue = {};
    }
  },
  actions: {

  },
  getters: {
    getChampData: state => {
      return state.champData;
    }
  }
})
