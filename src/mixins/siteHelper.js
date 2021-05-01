import {isArray, isObject, isJson} from '@/utils/validate'
import {getToken} from '@/utils/auth'

export default {
	computed: {
		siteConfig() {
			return this.$store.getters.siteConfig || this.$sessionGet('SiteConfig')
		},

		memberInfo() {
			return this.$store.getters.memberInfo
		},

		token() {
			return this.$store.getters.token || getToken()
		}

	},

	methods: {
		getAvatar (p) {
			if (p) return `/images/member/avatars/${p}.png`
			else return null
		},

		isAndroid() {
			if (/android/i.test(navigator.userAgent)) {
				return true
			}

			if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
				return false
			}
		},

		$sessionGet(key) {
			let e = sessionStorage.getItem(key)
			if (e === 'true') return true
			else if (e === 'false') return false
			else if (isJson(e)) return JSON.parse(e)
			else return e
		},

		$sessionSet(key, value) {
			let e = value
			if (isArray(value) || isObject(value)) e = JSON.stringify(value)
			sessionStorage.setItem(key, e)
		},

		$sessionRemove(key) {
			sessionStorage.removeItem(key)
		},

		copyBtnClick(e) {
			let _this = this;
			this.$copyText(e)
				.then(function () {
					_this.$toast(_this.$t("common.copySuccess"));
				})
				.catch(() => {
					_this.$toast(_this.$t("common.copyFailed"));
				});
		},

		redirectRouter(r) {
			this.$router.push(r)
		}
	}
};
