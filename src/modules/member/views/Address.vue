<template>
    <div id="address">
        <van-empty description="还未添加地址~" v-if="items.length === 0"/>

        <van-address-list
                v-model="chosenAddressId"
                :list="items"
                default-tag-text="默认"
                @add="onAdd"
                @edit="onEdit"
                @select="onChangeAddress"
        />
    </div>
</template>

<script>
export default {
	name: 'Address',

	data: () => ({
		chosenAddressId: null,
		items: [],
		isCheckAddress: false
	}),


	activated() {
		this.isCheckAddress = this.$sessionGet('isCheckAddress') || false
		this.getMyAddress()
	},

	methods: {
		getMyAddress() {
			this.showProgress()
			this.$get('/api/UserAddress/GetMyAddress')
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
					this.items = d.map(e => {
						return {
							id: e.ID,
							name: e.ReceiptAccount,
							tel: e.Mobile,
							address: e.DetailAddress,
							isDefault: Number(e.IsDefault) === 1
						}
					})
					this.chosenAddressId = this.items[0].id
					this.showProgress(false)
				})
				.catch(error => {
					this.showProgress(false)
					this.procError(error)
				})
		},

		onAdd() {
			this.redirectRouter('addAddress')
		},

		onEdit(item) {
			this.$sessionSet('address-item', item)
			this.$router.push('addAddress')
		},

		onChangeAddress(e) {
			if (this.isCheckAddress) this.$router.replace({path: 'confirmOrder', query: {code: e.id}})
		}
	},

	beforeRouteLeave(to, form, next) {
		if (to.name !== 'addAddress') {
			sessionStorage.removeItem('isCheckAddress')
		}
		next()

	},
}
</script>

<style lang="less" scoped>
#address {
    /deep/ .van-tabbar {
        height: 65px;

        .add {
            width: 100%;
        }
    }
}
</style>
