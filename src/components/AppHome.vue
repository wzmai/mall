<template>
    <div id="appHome">
        <toolbar v-if="!isShowToolbar"/>
        <div class="page-content" :class="[isShowTabbar ? 'hideTabbar' : '', isShowToolbar ? 'hideToolbar' : '']">
            <keep-alive>
                <router-view v-if="$route.meta.keepAlive"></router-view>
            </keep-alive>

            <router-view v-if="!$route.meta.keepAlive"></router-view>

        </div>
        <tabbar/>
    </div>
</template>

<script>
import Toolbar from '@/components/Toolbar'
import Tabbar from '@/components/Tabbar'
import sessionContext from '@/mixins/sessionContext'
import Meta from '@/mixins/meta'

export default {
	name: 'AppHome',
	mixins: [sessionContext, Meta],
	components: {
		Toolbar,
		Tabbar
	},

	computed: {
		isShowTabbar() {
			return (this.$route.meta && this.$route.meta.childPage)
		},

		isShowToolbar() {
			let r = this.$route.name
			return r === 'searchGames';
		}
	},

	methods: {
	}
}
</script>

<style lang="less">
#appHome .page-content {
    top: 46px;
    bottom: 50px;
    left: 0;
    right: 0;
    position: absolute;
    overflow: hidden;
    background-color: #f5f5f9;
}

.hideTabbar {
    bottom: 0 !important;
}

.hideToolbar {
    top: 0 !important;
}
</style>
