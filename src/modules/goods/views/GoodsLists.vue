<template>
    <div id="goodsLists">
        <scroller class="background-white">
            <div class="masonry px-4 mt-3" v-if="items.length > 0">
                <div class="column" v-for="(item, index) in items" :key="index">
                    <div class="radius-2 elevation-3 background-white" @click="redirectDetails(item)">
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

            <van-empty description="没有更多了~" v-else/>
        </scroller>
    </div>
</template>

<script>
export default {
	name: 'GoodsLists',

	data: () => ({
		items: []
	}),


	activated() {
		let id = this.$route.query.id
		if (id) this.getClassifyGoodsList(id)
	},

	methods: {
		getClassifyGoodsList(ClassID) {
			this.showProgress()
			this.$get('/api/GoodsIndex/GetClassifyGoodsList?ClassID=' + ClassID)
				.then(resp => {
					return this.checkResp(resp, (r) => r.data.Code === 200)
				})
				.then(data => {
					let d = data.Data
					if (d === null || d === 'null') {
						this.showProgress(false)
						this.items = []
						return
					}
					this.items = d
					this.showProgress(false)
				})
				.catch(error => {
					this.showProgress(false)
					this.procError(error)
				})
		},

		redirectDetails(item) {
			this.$router.push({path: 'goodsDetails', query: {id: item.ID}})
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
#goodsLists {
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
