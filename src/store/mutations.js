export default {
    // ----------------------------------------------
    // session 控制
    // ----------------------------------------------

    setToken (state, token) {
        state.session.token = token
    },

    removeToken (state) {
        state.session.token = null
    },

    setMemberInfo (state, memberInfo) {
        state.session.memberInfo = memberInfo
    },

    removeMemberInfo (state) {
        state.session.memberInfo = null
    },

    setSiteConfig (state, siteConfig) {
        state.session.siteConfig = siteConfig
    },

    removeSiteConfig (state) {
        state.session.siteConfig = null
    },

}
