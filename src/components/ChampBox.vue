<template>
  <div>
    <input placeholder="Enter champion name..." type="text" v-model="filterString">
      <div class="champ-box-container">
        <div class="champ-box-image-container" v-for="(champ, index) in filteredChamps" v-bind:key=index>
          <img class="champ-box-image" v-bind:class="{ 'white-bg' : champ.lanes && champ.lanes.includes(lane) }" :src="'http://ddragon.leagueoflegends.com/cdn/' + config.version + '/img/champion/' + champ.image.full" @click="champSelected(champ.id)">
        </div>
    </div>
  </div>
</template>

<script>
import store from '../store';
import { mapGetters } from 'vuex'
import pbConfig from "../pb-config";

export default {
  name: 'ChampBox',
  data(){
    return {
      config: pbConfig,
      filterString: '',
      champs: null
    }
  },
  props: ['side', 'lane'],
  computed: {
    ...mapGetters({
      champData: 'getChampData'
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
    champSelected: function(champId){
      let info = {
        potentialEnemySide: this.side,
        lane: this.lane,
        champId: champId
      };
      store.commit('updatePotentialEnemyChampPick', info);
      this.$forceUpdate();
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  @import "../css/global";

  .champ-box-container{
    background: black;
    border-radius: 5px;
    max-height: 150px;
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

  .white-bg{
    background: $red1;
    border-radius: 5px;
  }
</style>
