<template>
    <div id="dashboard" class="background-white">
        <scroller>
            <van-swipe :autoplay="3000" indicator-color="white">
                <van-swipe-item v-for="(item, index) in swiperLists" :key="index" @click="redirectType(item)">
                    <img v-lazy="item.ImgUrl"/>
                </van-swipe-item>
            </van-swipe>

            <div v-if="discountLists.length > 0">
                <div class="px-4 py-4">
                    <span class="subtitle-4">折扣专区</span>
                </div>

                <van-row gutter="8" class="px-4">
                    <template v-for="(item, index) in discountLists">
                        <van-col span="12" :key="index" @click="redirectType(item)">
                            <van-image :src="item.ImgUrl"
                                       width="100%"
                                       height="80px">
                                <template v-slot:loading>
                                    <van-loading type="spinner" size="24"/>
                                </template>
                            </van-image>
                        </van-col>
                    </template>
                </van-row>
            </div>


            <div class="px-4 py-4">
                <span class="subtitle-4">热销品牌</span>
            </div>

            <van-row gutter="8" class="px-4">
                <template v-for="(item, index) in hotBrandLists">
                    <van-col span="12" :key="index" @click="redirectType(item)">
                        <van-image :src="item.ImgUrl"
                                   width="100%"
                                   height="80px">
                            <div class="brand_describe">{{item.Describe}}
                                <van-icon name="arrow" size="16"/>
                            </div>
                            <template v-slot:loading>
                                <van-loading type="spinner" size="24"/>
                            </template>
                        </van-image>
                    </van-col>
                </template>
            </van-row>

            <div class="px-4 py-4 mt-3">
                <span class="subtitle-4">热销排行</span>
            </div>

            <div class="masonry px-4">
                <div class="column" v-for="(item, index) in hotItemLists" :key="index">
                    <div class="radius-2 elevation-3" @click="redirectDetails(item.ID)">
                        <van-image :src="item.ImgUrl"
                                   width="100%"
                                   height="120px">
                            <template v-slot:loading>
                                <van-loading type="spinner" size="24"/>
                            </template>
                        </van-image>

                        <div class="px-4 pt-2 pb-3 text-left">
                            <div class="subtitle-3">{{item.Name}}</div>
                            <div class="caption mt-1">{{item.Labels}}</div>
                            <div class="subtitle-1 mt-1 text-grey">₱{{item.SellPrice}}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="px-4 py-4 mt-3">
                <span class="subtitle-4">新品上架</span>
            </div>

            <div class="masonry px-4">
                <div class="column" v-for="(item, index) in newProductsLists" :key="index">
                    <div class="radius-2 elevation-3" @click="redirectDetails(item.ID)">
                        <van-image :src="item.ImgUrl"
                                   width="100%"
                                   height="120px">
                            <template v-slot:loading>
                                <van-loading type="spinner" size="24"/>
                            </template>
                        </van-image>

                        <div class="px-4 pt-2 pb-3 text-left">
                            <div class="subtitle-3">{{item.Name}}</div>
                            <div class="caption mt-1">{{item.Labels}}</div>
                            <div class="subtitle-1 mt-1 text-grey">₱{{item.SellPrice}}</div>
                        </div>
                    </div>
                </div>
            </div>

            <provide/>
        </scroller>
    </div>
</template>

<script>
export default {
	name: 'Dashboard',

	data: () => ({
		swiperLists: [],
		hotBrandLists: [],
		hotItemLists: [],
		discountLists: [],
		newProductsLists: []
	}),


	activated() {
		this.getMallAdvertInfo()
	},

	methods: {
		getMallAdvertInfo() {
			this.showProgress()
			this.$get('/api/GoodsIndex/GetMallAdvertInfo')
				.then(resp => {
					return this.checkResp(resp, (r) => r.data.Code === 200)
				})
				.then(data => {
					let d = data.Data
					this.swiperLists = d.SwiperList
					this.hotBrandLists = d.HotBrandList
					this.hotItemLists = d.HotItemList
					this.discountLists = d.DiscountList
					this.newProductsLists = d.NewProductsList
					this.showProgress(false)
				})
				.catch(error => {
					this.showProgress(false)
					this.procError(error)
				})
		},

		redirectType(item) {
			if (item.JumpType === 1) this.redirectGoodLists(item.JumpID)
			else this.redirectDetails(item.JumpID)
		},

		redirectGoodLists(id) {
			this.$router.push({path: 'goods', query: {id: id}})
		},

		redirectDetails(id) {
			this.$router.push({path: 'goodsDetails', query: {id: id}})
		}
	}
}
</script>

<style lang="less" scoped>
#dashboard {
    height: 100%;

    .van-swipe {
        height: 400px;

        img {
            height: 400px;
            width: 100%;
        }
    }

    /deep/ .van-image {
        .brand_describe {
            font-size: 14px;
            font-weight: bolder;
            text-align: center;
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            margin: auto;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }

    .masonry {
        -moz-column-count: 2; /* Firefox */
        -webkit-column-count: 2; /* Safari 和 Chrome */
        column-count: 2;
        -moz-column-gap: 8px;
        -webkit-column-gap: 8px;
        column-gap: 8px;

        .column {
            padding-bottom: 16px;
            -webkit-column-break-inside: avoid;
            break-inside: avoid; /*防止断点*/
            text-align: center;

            /deep/ .van-image__img {
                border-top-left-radius: 8px;
                border-top-right-radius: 8px;
            }
        }
    }
}
</style>
