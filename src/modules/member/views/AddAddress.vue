<template>
    <div>
        <van-address-edit
                :show-delete="showDelete"
                show-set-default
                show-search-result
                :show-area="false"
                :address-info="address"
                @save="onSave"
                @delete="onDelete"
                @change-detail="onChangeDetail"
        />
    </div>
</template>

<script>
export default {
	name: 'AddAddress',

	data: () => ({
		address: {},
		showDelete: false,
		isCheckAddress: false
	}),


	activated() {
		let e = this.$sessionGet('address-item')
		this.isCheckAddress = this.$sessionGet('isCheckAddress') || false
		if (e) {
			this.showDelete = true
			e.addressDetail = e.address
			this.address = e
		} else {
			this.address = {}
		}
	},

	methods: {
		onSave(e) {
			let c = {
				ReceiptAccount: e.name,
				Mobile: e.tel,
				DetailAddress: e.addressDetail,
				Region: 'PH',
				IsDefault: e.isDefault ? 1 : 0
			}
			if (this.showDelete) c.AddressID = this.address.id
			this.showProgress()
			this.$get('/api/UserAddress/OperateUserAddress', c)
				.then(resp => {
					return this.checkResp(resp, (r) => r.data.Code === 2)
				})
				.then(() => {
					this.showProgress(false)
					this.$success('保存成功！');
					this.$router.push('address')
				})
				.catch(error => {
					this.showProgress(false)
					this.procError(error)
				})
		},

		onDelete() {
			this.showProgress()
			this.$get('/api/UserAddress/DeleteMyAddress?ID=' + this.address.id)
				.then(resp => {
					return this.checkResp(resp, (r) => r.data.Code === 2)
				})
				.then(() => {
					this.showProgress(false)
					this.$success('删除成功！');
					this.$router.push('address')
				})
				.catch(error => {
					this.showProgress(false)
					this.procError(error)
				})
		},

		onChangeDetail() {
		},
	},

	beforeRouteLeave(to, form, next) {
		if (to.name !== 'address') {
			sessionStorage.removeItem('isCheckAddress')
		}

		sessionStorage.removeItem('address-item')
		next()
	},

}
</script>

<style lang="less" scoped>

</style>
