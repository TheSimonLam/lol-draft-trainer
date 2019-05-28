<template>
  <div id="app">
    <div id="nav">
      <div class="nav-title">🔵DraftTrainer™🔴</div>
      <div class="router-links-container">
        <router-link to="/">Home</router-link> |
        <router-link to="/about">About</router-link>
      </div>
    </div>
    <router-view/>
  </div>
</template>

<script>
  const fetch = require('node-fetch');
  import pbConfig from "./pb-config";
  import store from './store';
  
  export default {
    name: 'app',
    methods: {
      getChampData: () => {
        let champDataUrl = "http://ddragon.leagueoflegends.com/cdn/" + pbConfig.version + "/data/en_US/champion.json";
        fetch(champDataUrl)
          .then(res => res.json())
          .then(json => store.commit('setChampData', json.data));
      }
    },
    created(){
      this.getChampData();
    }
  }
</script>

<style lang="scss">
@import "./css/global";

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #fff;
  text-align: center;
}
#nav {
  background: $blue3;
  text-align: center;
  padding: 5px;
  a {
    font-weight: bold;
    color: $blue1;
    text-decoration: none;
    &.router-link-exact-active {
      color: $white;
      text-decoration: none;
    }
  }
}

.nav-title{
  font-size: 1.2em;
  display: inline-block;
}

.router-links-container{
  position: absolute;
  top: 5px;
  right: 10px;
}
</style>
