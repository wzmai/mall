<template>
    <div id="goodsDetails">
        <div class="warp">
            <scroller>
                <van-swipe :autoplay="3000" indicator-color="white">
                    <van-swipe-item v-for="(item, index) in images" :key="index">
                        <img v-lazy="item"/>
                    </van-swipe-item>
                </van-swipe>

                <div class="px-4 py-4 background-white">
                    <van-row>
                        <van-col span="18">
                            <div class="subtitle-4">{{item && item.BrandName}}</div>
                            <div class="caption mt-1">{{item && item.Labels}}</div>
                            <div class="money-number mt-3 red-text">₱{{item && item.SellPrice}}</div>
                        </van-col>
                        <van-col span="6" class="text-center">
                            <div class="caption">销量 {{item && item.SaleCount}}</div>
                        </van-col>
                    </van-row>
                </div>

                <div class="px-4 py-4 background-white mt-3">
                    <div class="headline">商品信息</div>

                    <div class="main-item mt-4">
                        <template v-for="(good, index) in item && item.GoodsParams">
                            <van-row :key="index">
                                <van-col span="6">
                                    <div class="title">{{good.KeyInfo}}</div>
                                </van-col>
                                <van-col span="18">
                                    <div class="content">{{good.ValueInfo}}</div>
                                </van-col>
                            </van-row>
                        </template>
                    </div>
                </div>

                <div class="px-4 py-4 background-white mt-3">
                    <div class="headline">图片详情</div>

                    <div class="mt-3">
                        <template v-for="(image, index) in item && item.GoodsImgDetail">
                            <van-image :src="image.PhotoUrl" lazy-load width="100%" height="100%" :key="index">
                                <template v-slot:loading>
                                    <van-loading type="spinner" size="28"/>
                                </template>
                            </van-image>
                        </template>
                    </div>

                </div>


                <div class="py-4 background-white mt-3">
                    <div class="headline px-4 mb-3">相关说明</div>

                    <van-cell-group>
                        <van-cell title="价格说明" label="价格以实际价格为准。"/>
                        <van-cell title="折扣说明"
                                  label="折扣指商品实时价格与参考价格的比率，该对比值仅供您参考，具体优惠会根据商品参加优惠活动及优惠券而发生改变，最终优惠以订单确认页为准。"/>
                        <van-cell title="优惠券说明"
                                  label="订单中包含特价商品时不能使用优惠券，优惠券不能与其他优惠（如促销活动）同时使用；优惠券只能抵扣订单金额，优惠金额超出订单金额部分不能再次使用，不能兑换现金；每个订单只能使用一张优惠券。"/>
                    </van-cell-group>

                </div>

            </scroller>
        </div>


        <van-goods-action>
            <van-goods-action-icon icon="chat-o" text="客服" color="#ee0a24" @click="goKf"/>
            <van-goods-action-icon icon="cart-o" text="购物车" :badge="cardLength"
                                   @click="redirectRouter('/app/shoppingCart')"/>
            <van-goods-action-icon :icon=" collection ? 'like' : 'like-o'" :text="collection? '已收藏' : '收藏'"
                                   :color="collection? '#ff5000' : ''"
                                   @click="goodsToMyCollection"/>
            <van-goods-action-button type="warning" text="加入购物车" @click="showSku=true"/>
            <van-goods-action-button type="danger" text="立即购买" @click="showSku=true"/>
        </van-goods-action>


        <van-sku
                v-model="showSku"
                :sku="sku"
                :goods="goods"
                :custom-stepper-config="customStepperConfig"
                :start-sale-num="1"
                :show-soldout-sku="false"
                @sku-selected="selectedSku"
                @buy-clicked="onBuyClicked"
                @add-cart="onAddCartClicked">
            <div slot="sku-header-price">
                <span class="caption">₱</span> <span class="red-text price-text">{{price}}</span>
            </div>
        </van-sku>
    </div>
</template>

<script>
import {Toast} from 'vant'

export default {
	name: 'GoodsDetails',

	data: () => ({
		showSku: false,
		images: [],
		item: {},
		sizeConfig: [],
		colorSizeList: [],
		collection: false,
		price: 0,
		goods: {
			// 默认商品 sku 缩略图
			picture: ''
		},
		sku: {
			// 所有sku规格类目与其值的从属关系，比如商品有颜色和尺码两大类规格，颜色下面又有红色和蓝色两个规格值。
			// 可以理解为一个商品可以有多个规格类目，一个规格类目下可以有多个规格值。
			tree: [],
			// 所有 sku 的组合列表，比如红色、M 码为一个 sku 组合，红色、S 码为另一个组合
			list: [],
			price: 0, // 默认价格（单位元）
			stock_num: 0, // 商品总库存
		},

		customStepperConfig: {
			// 自定义步进器超过限制时的回调
			handleOverLimit: (data) => {
				const {action, startSaleNum} = data;

				if (action === 'minus') {
					Toast(startSaleNum > 1 ? `${startSaleNum}件起售` : '至少选择一件商品');
				}
			},
		},

		cardLength: ''
	}),


	activated() {
		let id = this.$route.query.id
		if (id) this.getGoodsDetailInfo(id)
		this.getMyShoppingCartLength()
	},

	methods: {
		goodsToMyCollection() {
			let id = this.colorSizeList[0].GoodsID
			this.showProgress()
			this.$get('/api/UserOperate/GoodsToMyCollection?GoodsID=' + id)
				.then(resp => {
					return this.checkResp(resp, (r) => r.data.Code === 2)
				})
				.then(() => {
					this.showProgress(false)
					if (!this.collection) {
						this.collection = true
						this.$success('已添加到收藏')
					} else {
						this.collection = false
						this.$success('已移除收藏')
					}
				})
				.catch(error => {
					this.showProgress(false)
					this.procError(error)
				})
		},

		getMyShoppingCartLength() {
			this.$get('/api/UserShopCart/GetMyShoppingCart')
				.then(resp => {
					return this.checkResp(resp, (r) => r.data.Code === 200)
				})
				.then(data => {
					let d = data.Data
					if (d) this.cardLength = d.length
				})
				.catch(error => {
					this.procError(error)
				})
		},

		getGoodsDetailInfo(GoodsID) {
			this.showProgress()
			this.$get('/api/GoodsIndex/GetGoodsDetailInfo?GoodsID=' + GoodsID)
				.then(resp => {
					return this.checkResp(resp, (r) => r.data.Code === 200)
				})
				.then(data => {
					let d = data.Data
					this.images = d.ShowsImgList
					this.item = d
					this.collection = d.HasCollection
					this.sku.price = d.SellPrice
					this.sku.stock_num = d.Stock
					this.goods.picture = d.ImgUrl
					this.colorSizeList = d.ColorSizeList
					let g = d.ColorSizeList
					let c = {
						k: '颜色',
						k_s: 'GoodsColor',
						v: g.map(e => {
							return {
								id: e.ID, // skuValueId：规格值 id
								name: e.GoodsColor, // skuValueName：规格值名称
								imgUrl: this.item.ImgUrl, // 规格类目图片，只有第一个规格类目可以定义图片
								previewImgUrl: this.item.ImgUrl, // 用于预览显示的规格类目图片
							}
						})
					}

					let s = {
						k: '尺码',
						k_s: 'SizeId',
						v: d.ColorSizeConfigList.map(e => {
							return {
								id: e.ID,
								name: e.Size
							}
						})
					}

					this.sizeConfig = d.ColorSizeConfigList.map(e => {
						return {
							id: e.ID,
							name: e.Size
						}
					})

					let list = this.cList(d.ColorSizeList)
					this.sku.tree = []
					this.sku.list = []
					this.sku.tree.push(c)
					this.sku.tree.push(s)
					this.sku.list = list
					this.showProgress(false)
				})
				.catch(error => {
					this.showProgress(false)
					this.procError(error)
				})
		},

		cList(items) {
			let lists = []
			items.forEach(function (e) {
				e.SizeInfo.forEach(function (s) {
					let c = {}
					c.id = e.GoodsID
					c.GoodsColor = s.ColorID
					c.SizeId = s.SizeID
					c.price = s.Price
					c.stock_num = s.Stock
					lists.push(JSON.parse(JSON.stringify(c)))
				})
			})
			return lists
		},

		selectedSku(e) {
			if (e.selectedSkuComb) {
				this.price = e.selectedSkuComb.price
			}
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

		onBuyClicked(e) {
			this.addGoods(e, 2)
		},

		onAddCartClicked(e) {
			this.addGoods(e, 1)
		},


		addGoods(e, flag) {
			let g = e.selectedSkuComb
			let s = this.sizeConfig.filter(c => c.id === g.SizeId)[0]
			let c = this.colorSizeList.filter(c => c.ID === g.GoodsColor)[0]
			let cart = {
				GoodsID: g.id,
				Flag: flag,
				ColorID: g.GoodsColor,
				Color: c.GoodsColor,
				SizeID: g.SizeId,
				Size: s.name,
				Number: e.selectedNum
			}

			this.showProgress()
			this.$get('/api/UserShopCart/AddToMyShoppingCart', cart)
				.then(resp => {
					return this.checkResp(resp, (r) => r.data.Code === 2)
				})
				.then(data => {
					this.showProgress(false)
					this.showSku = false
					if (flag === 2) {
						// 跳转下单界面
						let e = []
						e.push(data.Data)
						this.$sessionSet('shopping-cart', e)
						this.$sessionSet('confirmFlag', 0)
						this.$router.push('confirmOrder')
					} else {
						this.$success('已加入购物车')
					}

				})
				.catch(error => {
					this.showProgress(false)
					this.procError(error)
				})
		}
	},

	beforeRouteEnter(to, from, next) {
		let e = to.query.id
		if (!e) next('/app/sort')
		else next()
	}
}
</script>

<style lang="less" scoped>
#goodsDetails {
    height: 100%;

    .warp {
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        bottom: 50px;

        .van-swipe {
            height: 375px;

            img {
                height: 375px;
                width: 100%;
            }
        }

        .main-item {
            line-height: 45px;
            text-align: center;
            border-bottom: 0.5px solid rgba(0, 0, 0, 0.22);

            .van-row {
                border: 0.5px solid rgba(0, 0, 0, 0.22);
                border-bottom: none;
            }

            .title {
                font-weight: bold;
                font-size: 14px;
                background-color: rgba(0, 0, 0, 0.03);
                border-right: 0.5px solid rgba(0, 0, 0, 0.22);
            }

            .content {
                text-align: left;
                font-size: 12px;
                color: rgba(0, 0, 0, 0.8);
                background-color: white !important;
                padding: 0px 10px;
            }
        }
    }
}
</style>
