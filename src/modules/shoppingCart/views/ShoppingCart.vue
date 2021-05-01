<template>
    <div id="shoppingCart">
        <div class="warp">
            <scroller>
                <div class="py-4" v-if="items.length > 0">
                    <van-checkbox-group v-model="goodsResults" ref="checkboxGroup">
                        <template v-for="(item, index) in items">
                            <div class="flex align-items-center background-white py-2 pl-2" :key="index">
                                <div class="mr-2">
                                    <van-checkbox :name="item.ID" icon-size="14"/>
                                </div>
                                <div class="mt-1">
                                    <van-image :src="item.ImgUrl" width="80px" height="80px">
                                        <template v-slot:loading>
                                            <van-loading type="spinner" size="20"/>
                                        </template>
                                    </van-image>
                                </div>
                                <div class="pl-3" style="width: 240px">
                                    <div class="subtitle-3">{{item.TitleName}}</div>
                                    <div class="caption van-ellipsis">{{item.ShopDescribe}}</div>
                                    <div class="flex space-between mt-3">
                                        <div class="subtitle-1">₱{{item.SellPrice}}</div>
                                        <van-stepper slot="num" v-model="item.Number" @change="changeNumber(item)"/>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </van-checkbox-group>
                </div>

                <van-empty v-else>
                    <div class="text-center" slot="description">
                        <div class="subtitle-1" style="color: black">购物车还是空的</div>
                        <div class="text-grey caption mt-1">赶紧买点宝贝犒劳下自己吧</div>
                    </div>

                    <div slot="image" class="text-center">
                        <van-image src="https://img01.yzcdn.cn/vant/custom-empty-image.png" width="120px"/>
                    </div>
                    <div slot="default" class="bottom-button">
                        <van-button round plain @click="redirectRouter('sort')">去逛逛</van-button>
                    </div>
                </van-empty>

                <goods-more/>

                <provide/>
            </scroller>
        </div>


        <van-submit-bar :price="price" currency="₱" button-text="提交订单" @submit="onSubmit">
            <van-checkbox v-model="checked">全选</van-checkbox>
        </van-submit-bar>
    </div>
</template>

<script>
export default {
	name: 'ShoppingCart',

	data: () => ({
		checked: false,
		items: [],
		price: 0,
		goodsResults: []
	}),

	watch: {
		checked(v) {
			this.toggleAll(v)
		},

		goodsResults(v) {
			let p = 0
			if (v.length === 0) {
				this.price = 0
				return
			}
			if (this.items.length === v.length) this.checked = true
			v.forEach(e => {
				p += this.items.filter(c => c.ID === e)[0].SellPrice
				// addNum
			})

			this.price = p * 100
		}
	},


	activated() {
		this.checked = false
		if (!this.token) return
		this.getMyShoppingCart()
	},

	methods: {
		getMyShoppingCart() {
			this.showProgress()
			this.$get('/api/UserShopCart/GetMyShoppingCart')
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

		getMyAddress() {
			this.showProgress()
			this.$get('/api/UserAddress/GetMyAddress')
				.then(resp => {
					return this.checkResp(resp, (r) => r.data.Code === 200)
				})
				.then(data => {
					let d = data.Data
					this.showProgress(false)
					if (d.length === 0) {
						this.$dialog.confirm({
							title: '提示',
							message: '您还未添加地址 是否前去添加地址',
						})
							.then(() => {
								// on confirm
								this.$router.push('addAddress')
							})
							.catch(() => {
							});
					} else {
						this.$sessionSet('shopping-cart', this.goodsResults)
						this.$sessionSet('confirmFlag', 1)
						this.$router.push('confirmOrder')
					}
				})
				.catch(error => {
					this.showProgress(false)
					this.procError(error)
				})
		},


		onSubmit() {
			if (this.goodsResults.length === 0) {
				this.$error('你还未选中商品~')
				return
			}
			this.getMyAddress()
		},

		changeNumber(item) {
			let params = {
				Number: item.Number,
				CartID: item.ID
			}
			this.showProgress()
			this.$get('/api/UserShopCart/EditGoodsNumber', params)
				.then(resp => {
					return this.checkResp(resp, (r) => r.data.Code === 2)
				})
				.then(() => {
					this.getMyShoppingCart()
				})
				.catch(error => {
					this.showProgress(false)
					this.procError(error)
				})
		},

		toggleAll(e) {
			this.$refs.checkboxGroup.toggleAll(e);
		},
	}
}
</script>

<style lang="less" scoped>
#shoppingCart {
    .warp {
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        bottom: 84px;

        /deep/ .van-image {
            img {
                border-radius: 8px;
            }

        }
    }


    /deep/ .van-empty {
        .van-empty__image {
            width: 4.26667rem !important;
            height: 4.26667rem !important;
        }
    }

}

/deep/ .bottom-button {
    .van-button {
        width: 160px;
        height: 40px;

        border: 1px solid #323233 !important;
    }

    .van-button--plain {
        background-color: #f5f5f9;
    }
}

.van-submit-bar {
    bottom: 50px !important;
}

</style>
