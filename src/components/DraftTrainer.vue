<template>
  <div class="draft-trainer-container">
    
  </div>
</template>

<script>
import store from '../store';

export default {
  name: 'DraftTrainer',
  data: () => {
    return{
      turnSideSelect: false
    }
  },
  methods: {
    init: () => {
      // RESET ALL VARIABLES HERE!
      store.commit('resetSelectedChamps');
      console.log(this.turnSideSelect);
    },
    replay: () => {
      //Play again, with same enemy champs and configs
    }
  },
  created (){
    this.init();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .draft-trainer-container{
    text-align: center;
  }
</style>
