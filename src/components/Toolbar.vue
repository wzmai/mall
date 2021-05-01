<template>
    <div id="page-toolbar">
        <van-nav-bar
                :title="title"
                :border="false"
                fixed
                safe-area-inset-bottom
                @click-right="redirectRouter(meta.routerRight)"
                :class="meta.class"
        >
            <template #left>
                <van-icon v-if="childPage" name="arrow-left" size="22" @click="leftClick"/>
                <van-icon v-else-if="active === 'dashboard'" :name="meta && meta.leftIcon" size="22" @click="leftClick"/>
                <van-icon v-else :name="meta && meta.leftIcon" size="22" @click="leftClick"/>
            </template>
            <template #right>
                <van-icon :name="meta && meta.rightIcon" size="22"/>
                <span class="main-text ml-1" v-if="meta.rightText">{{$$t(meta.rightText)}}</span>
            </template>
        </van-nav-bar>
    </div>
</template>

<script>
export default {
	name: 'Toolbar',

	computed: {
		title() {
			if (this.active === 'dashboard') return this.siteConfig && this.siteConfig.MallTitle
			else return this.meta && this.meta.title
		},

		meta() {
			return this.$route.meta
		},


		childPage() {
			return (this.$route.meta && this.$route.meta.childPage)
		},

		active() {
			let r = this.$route.name
			if (!r) return 'dashboard'
			else return this.$route.name
		},
	},

	methods: {
		goBack() {
			if (window.history.length <= 1) this.$router.push('/app/dashboard')
			else this.$router.back()
		},

		leftClick() {
			return this.meta.routerLeft ? this.redirectRouter(this.meta.routerLeft) : this.goBack()
		},

		redirectRouter(r) {
			this.$router.push(r)
		},
	}
}
</script>

<style lang="less" scoped>
#page-toolbar {
    .member {
        background-image: url("/images/banner/member_toolbar.png");
        background-size: 100% 100%;

        /deep/ .van-nav-bar__title {
            color: #FFF;
        }
    }
}
</style>
