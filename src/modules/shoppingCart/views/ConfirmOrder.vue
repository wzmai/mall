<template>
    <div id="confirmOrder">
        <div class="warp">
            <scroller>
                <div class="mt-3 px-3 pb-15">
                    <div class="radius-2 background-white">
                        <div class="flex space-between align-items-center" @click="redirectAddress">
                            <div class="px-4 pa-4" v-if="address">
                                <div class="subtitle-4">{{address.Mobile}}</div>
                                <div class="body-2 text-grey mt-1">{{address.DetailAddress}}</div>
                            </div>

                            <div class="pa-4" v-else>
                                <div class="caption">暂未获取到收货地址</div>
                                <div class="headline mt-1">请新建收货地址</div>
                            </div>

                            <van-icon name="arrow" size="20" class="mr-4"/>
                        </div>
                        <van-cell title="配送方式" value="快递" class="radius-2"/>
                    </div>

                    <div class="mt-3 radius-2 background-white">
                        <van-cell :title="siteConfig && siteConfig.MallTitle" icon="shop-o" :border="false" size="large" center class="radius-2"/>

                        <template v-for="(g, index) in item && item.GoodsList">
                            <van-card
                                    :num="g.Number"
                                    :price="g.SellPrice"
                                    :desc="g.ShopDescribe"
                                    :title="g.TitleName"
                                    :thumb="g.ImgUrl"
                                    currency="₱"
                                    class="background-white radius-2"
                                    :key="index"
                            />
                        </template>

                        <div class="px-4 py-3 text-right">
                            <span class="text-grey caption mr-2">共{{getGoodsListLen}}件</span>
                            <span class="body-2">商品小计：</span>
                            <span class="subtitle-4"> <span class="caption">₱</span> {{getPrice || 0}}</span>
                        </div>
                    </div>

<!--                    <van-coupon-cell-->
<!--                            :coupons="coupons"-->
<!--                            :editable="false"-->
<!--                            :chosen-coupon="chosenCoupon"-->
<!--                            currency="₱"-->
<!--                            @click="showList = true"-->
<!--                            class="mt-3 radius-2"-->
<!--                    />-->


                    <van-field
                            v-model="buyersMessage"
                            rows="1"
                            autosize
                            label="买家留言"
                            type="textarea"
                            placeholder="请输入留言"
                            class="radius-2 mt-3"
                    />

                </div>
            </scroller>
        </div>


        <van-submit-bar :price="(getPrice*100) || 0" currency="₱" button-text="去下单" label="应付：" @submit="onSubmit">
        </van-submit-bar>

        <!-- 优惠券列表 -->
        <van-popup
                v-model="showList"
                round
                position="bottom"
                style="height: 90%; padding-top: 4px;"
        >
            <van-coupon-list
                    :show-exchange-bar="false"
                    :coupons="coupons"
                    :chosen-coupon="chosenCoupon"
                    currency="₱"
                    @change="onChange"
                    @exchange="onExchange"
            />
        </van-popup>
    </div>
</template>

<script>
const coupon = {
	available: 1,
	condition: '无使用门槛\n最多优惠12元',
	reason: '',
	value: 150,
	name: '优惠券名称',
	startAt: 1489104000,
	endAt: 1514592000,
	valueDesc: '1.5',
	unitDesc: '元',
};
export default {
	name: 'ConfirmOrder',

	data: () => ({
		item: {},
		address: null,
		showList: false,
		showAddress: true,
		addressID: null,
		chosenCoupon: -1,
		coupons: [coupon],
		buyersMessage: '',
		confirmFlag: 1
	}),


	activated() {
		let e = this.$sessionGet('shopping-cart')
		let flag = this.$sessionGet('confirmFlag')
		let code = this.$route.query.code
		if (code) this.getMyAddress(code)
		if (e && flag) this.getConfirmOrderGoodsInfo(e, flag)
	},

	computed: {
		getPrice() {
			let e = this.item && this.item.GoodsList
			let p = 0
			if (!e) return
			e.forEach(e => {
				p += e.SellPrice
			})
			return p
		},

		getGoodsListLen() {
			let p = 0
			let e = this.item && this.item.GoodsList
			if (!(this.item && this.item.GoodsList)) {
				return 0
			} else {
				e.forEach(e => {
					p += e.Number
				})

				return p
			}
		}
	},

	methods: {
		getConfirmOrderGoodsInfo(params, flag) {
			let p = {
				ShopCardID: JSON.stringify(params),
				ConfirmFlag: flag
			}
			this.confirmFlag = flag
			this.showProgress()
			this.$get('/api/UserOrder/GetConfirmOrderGoodsInfo', p)
				.then(resp => {
					return this.checkResp(resp, (r) => r.data.Code === 200)
				})
				.then(data => {
					let d = data.Data
					this.item = d
					this.address = d.AddressInfo
					this.addressID = this.address.ID
					this.showProgress(false)
				})
				.catch(error => {
					this.showProgress(false)
					this.procError(error)
				})
		},

		onSubmit() {
			let e = this.$sessionGet('shopping-cart')
			let Params = {
				ConfirmOrder: JSON.stringify(e),
				CouponID: 0,//当前使用的优惠券ID
				AddressID: this.addressID,
				BuyersMessage: this.buyersMessage,
				ConfirmFlag: this.confirmFlag
			};
			this.$dialog.confirm({
				title: '提示',
				message: '是否下单？',
			})
				.then(() => {
					this.showProgress(true)
					this.$get('/api/UserOrder/ConfirmMyOrderInfo', Params)
						.then(resp => {
							return this.checkResp(resp, (r) => r.data.Code === 2)
						})
						.then(() => {
							this.showProgress(false)
							this.$success('下单成功')
							this.$router.back()
						})
						.catch(error => {
							this.showProgress(false)
							this.procError(error)
						})
				})
				.catch(() => {
				})
		},

		getMyAddress(e) {
			this.showProgress(true)
			this.$get('/api/UserAddress/GetMyAddressInfo?AddressID=' + e)
				.then(resp => {
					return this.checkResp(resp, (r) => r.data.Code === 200)
				})
				.then(data => {
					let d = data.Data
					this.address = d
					this.addressID = d.ID
					this.showProgress(false)
				})
				.catch(error => {
					this.showProgress(false)
					this.procError(error)
				})
		},

		redirectAddress() {
			let u = 'address'
			if (!this.addressID) u = 'addAddress'
			this.$sessionSet('isCheckAddress', true)
			this.$router.push(u)
		},

		onChange(index) {
			this.showList = false;
			this.chosenCoupon = index;
		},

		onExchange() {
			this.coupons.push(coupon);
		},
	},

	beforeRouteLeave(to, form, next) {
		if (to.name === 'addAddress' || to.name === 'address') {
			next()
			return
		}
		sessionStorage.removeItem('shopping-cart')
		sessionStorage.removeItem('confirmFlag')
		next()
	},
}
</script>

<style lang="less" scoped>
#confirmOrder {

    .warp {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 50px;
    }

    .van-submit-bar__text {
        text-align: left;
    }
}
</style>
