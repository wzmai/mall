<template>
    <div id="member">
        <div class="top">
            <div class="text-center pt-6">
                <van-image
                        round
                        width="68px"
                        height="68px"
                        src="https://img01.yzcdn.cn/vant/cat.jpeg"
                />

                <div class="subtitle-3 mt-3" v-if="nikeName">{{nikeName}}</div>
                <div class="subtitle-3 mt-3" v-else @click="redirectRouter('/login')">您还未登陆</div>
            </div>
        </div>

        <van-cell title-class="headline" class="background-white"
                  title="我的订单" value="查看全部订单" is-link :border="false" @click="redirectOrders('')"/>

        <div class="text-center pt-4 background-white">
            <van-row>
                <template v-for="(item, index) in navs">
                    <van-col span="6" :key="index" @click="redirectOrders(item.code)">
                        <van-icon :name="item.icon" size="35px"/>
                        <div class="caption">{{item.text}}</div>
                    </van-col>
                </template>
            </van-row>

            <div class="text-left mt-5">
                <van-cell title-class="headline" title="其他" :border="false"/>
                <van-cell is-link title="收货地址" icon="location-o" title-class="other-btn-item" size="large"
                          @click="redirectRouter('address')"/>
                <van-cell is-link title="联系客服" icon="service-o" title-class="other-btn-item" size="large" @click="goKf"/>
            </div>
        </div>


        <div class="abort mt-3 px-3 pb-3">
            <van-button type="default" block class="radius-2" @click="onLogout">退出</van-button>
        </div>

    </div>
</template>

<script>
import {removeToken} from "@/utils/auth";

export default {
	name: 'Member',

	data: () => ({
		nikeName: '',
		navs: [
			{text: '待付款', icon: '/images/member/To_be_paid.png', code: '0'},
			{text: '待发货', icon: '/images/member/To_be_delivered.png', code: '1'},
			{text: '待收货', icon: '/images/member/Goods_to_be_received.png', code: '2'},
			{text: '退款/售后', icon: '/images/member/return_goods.png', code: '4'},
		]
	}),


	activated() {
		this.nikeName = sessionStorage.getItem('NickName')
	},

	methods: {
		onLogout() {
			this.$dialog.confirm({
				title: '提示',
				message: '是否退出登陆',
			})
				.then(() => {
					this.showProgress()
					removeToken()
					sessionStorage.clear()
					this.$store.commit('removeToken')
					setTimeout(() => {
						this.showProgress(false)
						this.$success('退出成功')
						this.$router.push('/login')
					}, 1000)
				})
				.catch(() => {
				})
		},

		goKf() {
			this.$dialog.confirm({
				title: '标题',
				message: '该客服是Telegram客服 确保手机安装了改软件，是否前往？',
			})
				.then(() => {
					// on confirm
					if (!(this.siteConfig && this.siteConfig.MallCustomer)) {
						this.$error('商户还没有接入客服')
						return
					}
					window.open('https://t.me/' + this.siteConfig.MallCustomer)
				})
				.catch(() => {
					// on cancel
				});
		},

		redirectOrders(e) {
			this.$router.push({path: 'orders', query: {code: e}})
		}
	}
}
</script>

<style lang="less" scoped>
#member {
    .top {
        height: 150px;
        background-color: white;
    }

    .other-btn-item {
        font-weight: bold;
        font-size: 14px;
    }
}
</style>
