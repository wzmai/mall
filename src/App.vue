<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import Meta from '@/mixins/meta'
import SessionContext from '@/mixins/sessionContext'

export default {
  name: 'App',
  mixins: [Meta, SessionContext],

  created() {
    this.initSystem()
  }

}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
