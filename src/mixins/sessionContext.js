import {getToken, removeToken } from "@/utils/auth";

export default {
  methods: {
    initSystem() {
      this.initConfig()
      if (!getToken()) return;
    },


    initConfig() {
      this.$get('/api/MallSystem/MallSystemConfig')
          .then(resp => {
            return this.checkResp(resp, (r) => r.data.Code === 200)
          })
          .then(data => {
            this.$store.commit("setSiteConfig", data.Data);
          })
          .catch(error => {
            this.procError(error)
          })
    },

    removeSession () {
      removeToken()
      this.$store.commit('removeToken')
      sessionStorage.clear()
    },

    isNullOrUndefined(value) {
      return value === null || value === undefined || value === "";
    }
  }
};
