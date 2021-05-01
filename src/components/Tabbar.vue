<template>
    <div id="page-tabbar">
        <van-tabbar v-model="active" active-color="rgb(78, 114, 243)" inactive-color="rgb(189, 198, 220)" v-if="!childPage" >
            <van-tabbar-item v-for="(t, index) in tabbars" :name="t.name" :key="index" @click="changeRouter(t)" class="van-ellipsis">
                <span>{{t.text}}</span>
                <template #icon="props">
                    <van-icon :name="props.active ? t.activeIcon : t.icon" size="18"/>
                </template>
            </van-tabbar-item>
        </van-tabbar>
    </div>
</template>

<script>
export default {
	name: 'Tabbar',

	computed: {
		childPage() {
			return (this.$route.meta && this.$route.meta.childPage)
		}
	},


	created() {
		let t = sessionStorage.getItem('tabbar')
		this.active = t || 'dashboard'
	},


	watch: {
		$route(v) {
			if (v) {
				this.active = v.name
				sessionStorage.setItem('tabbar', v.name)
			}
		}
	},

	data() {
		return {
			active: 'dashboard',
			tabbars: [
				{icon: 'wap-home-o', activeIcon: 'wap-home', text: '首页', name: 'dashboard', to: 'dashboard' },
				{icon: 'label-o',  activeIcon: 'label',text: '分类', name: 'sort', to: 'sort'},
				{icon: 'shopping-cart-o',  activeIcon: 'shopping-cart',text: '购物车', name: 'shoppingCart', to: 'shoppingCart'},
				{icon: 'manager-o',  activeIcon: 'manager',text: '我的', name: 'member', to: 'member'}
			]
		}
	},

	methods: {
		changeRouter (v) {
			this.tabbar = v.name
			this.$sessionSet('tabbar', v.name)
            this.$router.push(v.to)
        }
	}
}
</script>

<style lang="less" scoped>
#page-tabbar {
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    .van-tabbar {
        height: 50px;
        .van-tabbar-item__icon {
            img {
                height: 100%;
            }
        }
    }
}

</style>
