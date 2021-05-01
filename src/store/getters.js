export default {
	// ----------------------------------------------
	// Session 控制
	// ----------------------------------------------
	token: state => {
		return state.session.token
	},

	memberInfo: state => {
		return state.session.memberInfo
	},

	siteConfig: state => {
		return state.session.siteConfig
	},

}
