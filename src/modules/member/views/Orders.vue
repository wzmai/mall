<template>
    <div id="orders">
        <van-tabs v-model="active">
            <van-tab title="全部" name=""/>
            <van-tab title="待付款" name="0"/>
            <van-tab title="待发货" name="1"/>
            <van-tab title="待收货" name="2"/>
            <van-tab title="已签收" name="3"/>
            <van-tab title="售后/退款" name="4"/>
        </van-tabs>


        <div class="warp">
            <scroller>
                <div v-if="datas.length > 0" class="px-1 pb-5">
                    <template v-for="(item, index) in datas ">
                        <div class="mt-3 radius-2 background-white" :key="index">
                            <van-cell :title="siteConfig && siteConfig.MallTitle" icon="shop-o" :border="false"
                                      size="large" center :value="getStatusText(Number(item.Status))"
                                      value-class="red-text" class="radius-2"/>
                            <van-card
                                    :num="item.GoodsNum"
                                    :price="item.SellPrice"
                                    :desc="item.ShopDescribe"
                                    :title="item.BrandName"
                                    :thumb="item.ImgUrl"
                                    currency="₱"
                                    class="background-white radius-2"
                            />
                            <div class="px-4 py-2 text-right">
                                <span class="body-2 text-grey">总价：<span class="caption">₱</span>{{item.GoodsAllPrice}},</span>
                                <span class="subtitle-4"> <span class="subtitle-3">实付款</span> <span
                                        class="caption">₱</span> {{item.GoodsAllPrice}}</span>
                            </div>

                            <div class="pb-3 mr-4 text-right" v-if="item.Status === 2">
                                <van-button plain hairline round size="mini" type="danger"
                                            @click="userConfirmReceivingGoods(item)">确认收货
                                </van-button>
                            </div>
                        </div>
                    </template>
                </div>
                <van-empty description="没有更多了~" v-else/>
            </scroller>
        </div>


    </div>
</template>

<script>
export default {
	name: 'Orders',

	data: () => ({
		active: '',
		items: []
	}),


	activated() {
		let code = this.$route.query.code
		if (code) this.active = code
		this.getMyOrderList()
	},

	computed: {
		datas() {
			if (this.active === '') return this.items
			else return this.items.filter(e => e.Status === Number(this.active))
		}
	},

	methods: {
		getMyOrderList() {
			let params = {
				Flag: -100
			};
			this.showProgress(true)
			this.$get('/api/UserOrder/GetMyOrderList', params)
				.then(resp => {
					return this.checkResp(resp, (r) => r.data.Code === 200)
				})
				.then(data => {
					let d = data.Data
					if (d) this.items = d
					else this.items = []
					this.showProgress(false)
				})
				.catch(error => {
					this.showProgress(false)
					this.procError(error)
				})
		},

		userConfirmReceivingGoods(item) {
			this.$dialog.confirm({
				title: '提示',
				message: '是否已到货？',
			})
				.then(() => {
					let params = {
						OrderID: item.ID
					};
					this.showProgress(true)
					this.$get('/api/UserOrder/UserConfirmReceivingGoods', params)
						.then(resp => {
							return this.checkResp(resp, (r) => r.data.Code === 2)
						})
						.then(() => {
							this.showProgress(false)
							this.$success('确认成功')
							this.getMyOrderList()
						})
						.catch(error => {
							this.showProgress(false)
							this.procError(error)
						})
				})
				.catch(() => {
				})

		},


		getStatusText(e) {
			if (e === 0) return '还未支付'
			else if (e === 1) return '货物准备中'
			else if (e === 2) return '仓库已发货'
			else if (e === 3) return '已签收'
			else ''
		}
	}
}
</script>

<style lang="less" scoped>
#orders {
    .warp {
        position: absolute;
        top: 44px;
        right: 0;
        left: 0;
        bottom: 0;
    }
}
</style>
