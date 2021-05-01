/**
 * Vuex
 *
 * @library
 *
 * https://vuex.vuejs.org/en/
 */

// Lib imports
import Vue from 'vue'
import Vuex from 'vuex'


import state from './state'
import getters from './getters'
import mutations from './mutations'

Vue.use(Vuex)

// Create a new store
const store = new Vuex.Store({
  getters,
  mutations,
  state
})

export default store
