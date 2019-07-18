<template>
  <div class="about">
    <img class="profile-img" v-bind:src="require('../assets/profile.jpg')">
    <h1>Application created by Ninjaroni.</h1>
    <h2>Follow for <a href="https://twitter.com/Ninjaroni_" target="_blank">more</a> </h2>
  </div>
</template>

<style>
.profile-img{
    display: inline-block;
    height: 200px;
    padding-top: 20px;
    border-radius: 140px;
}
</style>