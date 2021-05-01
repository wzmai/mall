<template>
    <div id="goodsMore">
        <div class="text-center py-4 body-2">
            <div>更多精选商品</div>
        </div>

        <van-row gutter="8" class="px-4 hot">
            <template v-for="(item, index) in items">
                <van-col span="12" :key="index" @click="redirectDetails(item)">
                    <div class="mb-3 background-white">
                        <van-image :src="item.ImgUrl"
                                   width="100%"
                                   height="120px">
                            <template v-slot:loading>
                                <van-loading type="spinner" size="24"/>
                            </template>
                        </van-image>

                        <div class="px-4 pt-2 pb-3 text-left">
                            <div class="subtitle-3">{{item.Name}}</div>
                            <div class="subtitle-1 mt-1 text-grey">₱{{item.SellPrice}}</div>
                        </div>
                    </div>
                </van-col>
            </template>
        </van-row>
    </div>
</template>

<script>
export default {
	name: 'GoodsMore',

	data: () => ({
		items: []
    }),


	created() {
		this.getMallCarefullyProducts()
	},

	methods: {
		getMallCarefullyProducts() {
			this.$get('/api/GoodsIndex/GetMallCarefullyProducts')
				.then(resp => {
					return this.checkResp(resp, (r) => r.data.Code === 200)
				})
				.then(data => {
					let d = data.Data
					if (d === null || d === 'null') {
						this.items = []
						return
					}
					this.items = d
				})
				.catch(error => {
					this.procError(error)
				})
		},

		redirectDetails(item) {
			this.$router.push({path: 'goodsDetails', query: {id: item.ID}})
		}

	}
}
</script>

<style lang="less" scoped>

</style>
