<template>
    <div id="sort">
        <van-tree-select height="153vw" :items="classifyList" :main-active-index.sync="active">
            <template #content>
                <div class="content-warp">
                    <scroller>
                        <van-row gutter="8" class="px-4 hot">
                            <template v-for="(item, index) in getItems">
                                <van-col span="12" :key="index" @click="redirectGoodsLists(item)">
                                    <div class="mt-3">
                                        <van-image :src="item.IconUrl"
                                                   width="100%"
                                                   height="70px">
                                            <template v-slot:loading>
                                                <van-loading type="spinner" size="24" />
                                            </template>
                                        </van-image>

                                        <div class="text-center px-4 pt-1 pb-2">
                                            <div class="caption-bold">{{item.Name}}</div>
                                        </div>
                                    </div>
                                </van-col>
                            </template>
                        </van-row>
                    </scroller>
                </div>
            </template>
        </van-tree-select>
    </div>
</template>

<script>
export default {
	name: 'Sort',

	data: () => ({
		active: 0,
		classifyList: [],
		items: []
	}),


	activated() {
		this.getClassifyList()
	},

	computed: {
		getItems() {
			if (this.classifyList.length < 1) return
			return this.classifyList && this.classifyList[this.active].children
		},
	},

	methods: {
		getClassifyList() {
			this.showProgress()
			this.$get('/api/GoodsIndex/GetClassifyList')
				.then(resp => {
					return this.checkResp(resp, (r) => r.data.Code === 200)
				})
				.then(data => {
					let d = data.Data
					this.classifyList = d.map(e => {
						return {
							id: e.ID,
							text: e.Name,
							children: e.ChildrenList
						}
					})
					this.showProgress(false)
				})
				.catch(error => {
					this.showProgress(false)
					this.procError(error)
				})
		},

		redirectGoodsLists (item) {
			this.$router.push({path: 'goods', query: {id: item.ID}})
        }
	}
}
</script>

<style lang="less" scoped>
#sort {
    .van-tree-select__content {
        position: relative;
    }
    .content-warp {
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
    }
}
</style>
