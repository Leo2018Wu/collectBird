<template>
	<view class="addCommunity">
		<tip-modal v-if="isShowTipModal" v-on:emitCancel="returnCancel" v-on:emitSure="returnSure"></tip-modal>
		<view class="content">
			<evan-form class="evanForm" :hide-required-asterisk="hideRequiredAsterisk" ref="form" :model="info">
				<evan-form-item label="小区名" prop="name">
					<template v-slot:main>
						<view @click="chooseLocation(false)" class="form-input form-input-placeholder">{{myName}}</view>
						<!-- <input @click="chooseLocation(false)" class="form-input" placeholder-class="form-input-placeholder" v-model="info.name" placeholder="请输入小区名" /> -->
					</template>
					<template v-slot:tip>
						<image class="inpArrow" src="../../static/right_arrow.png" mode="aspectFit"></image>
					</template>
				</evan-form-item>
				<evan-form-item label="详细地址" prop="addr">
					<template v-slot:main>
						<view @click="chooseLocation(true)" class="form-input form-input-placeholder">{{myAddr}}</view>
						<!-- <input @click="chooseLocation(true)" class="form-input" placeholder-class="form-input-placeholder" :value="info.addr"  placeholder="请填写" /> -->
					</template>
					<template v-slot:tip>
						<image class="inpArrow" src="../../static/right_arrow.png" mode="aspectFit"></image>
					</template>
				</evan-form-item>
			</evan-form>
			<view class="uploadBlock">
				<view>房源照片</view>
				<view class="uploadImg">
					<image v-if="!communityImg" src="../../static/upload.png" mode="aspectFill" @click="chooseImg"></image>
					<image v-else :src="communityImg" mode="aspectFit" @click="chooseImg"></image>
				</view>
			</view>
		</view>
		<view class="btnBox" v-if="!isEdit">
			<view class="btnSave" @click="save()">保存</view>
			<view class="addNext" @click="addRoom()">继续添加房号</view>
		</view>
		<view class="btnBox" v-else>
			<view class="addNext" @click="save()">保存</view>
			<view class="btnSave" @click="deleteComm">删除小区</view>
		</view>

	</view>
</template>

<script>
	import myUploadImg from '../../util/myUpload.js'
	import evanFormItem from '../../components/evan-form/evan-form-item.vue'
	import evanForm from '../../components/evan-form/evan-form.vue'
	import tipModal from '../../components/tipModal.vue';
	export default {
		components: {
			evanForm,
			evanFormItem,
			tipModal
		},

		data() {
			return {
				isShowTipModal: false,
				isEdit: false,
				communityInfo: {},
				communityImg: '',
				info: {
					name: '',
					addr: '',
				},
				rules: {
					name: {
						required: true,
						message: "请输入小区名"
					},
					addr: {
						required: true,
						message: "请输入小区地址"
					}
				}
			}
		},
		onShow() {
			let chooseLocationInfo = this.$store.state.chooseLocationInfo;
			console.log(chooseLocationInfo)
			this.info.name = chooseLocationInfo.name;
			this.info.addr = chooseLocationInfo.addr;
		},
		onLoad(options) {
			if (JSON.stringify(options) != "{}") {
				this.isEdit = true;
				this.communityInfo = JSON.parse(options.communityInfo);
				this.info.name = this.communityInfo.communityName,
					this.info.addr = this.communityInfo.communityAddress;
				this.communityImg = this.communityInfo.communityImgs[0];
				let storeInfo = {
					name: this.communityInfo.communityName,
					addr: this.communityInfo.communityAddress
				}
				this.$store.commit('chooseLocationInfo', storeInfo);
			} else {
				this.uImgList = []
			}
			if (this.isEdit) {
				uni.setNavigationBarTitle({
					title: '编辑房源'
				})
			}
			this.$nextTick(() => {
				this.$refs.form.setRules(this.rules)
			})
		},
		computed: {
			myName() {
				return this.$store.state.chooseLocationInfo.name ? this.$store.state.chooseLocationInfo.name : '请输入小区名';
			},
			myAddr() {
				return this.$store.state.chooseLocationInfo.addr ? this.$store.state.chooseLocationInfo.addr : '请输入地址';
			}
		},

		onUnload() {
			this.$store.commit('chooseLocationInfo', {})
		},
		methods: {
			chooseImg() {
				myUploadImg.upload().then((res) => {
					console.log(res)
					this.communityImg = res;
				})
			},
			chooseLocation(e) {
				let url = e ? '../chooseLocation/chooseLocation?type=' + 'addr' : '../chooseLocation/chooseLocation'
				uni.navigateTo({
					url
				})
			},
			hideModal() {
				this.isShowTipModal = false
			},
			deleteComm() {
				this.isShowTipModal = true
			},
			returnCancel() {
				this.hideModal()
			},
			returnSure() {
				this.hideModal()
				this.$request.post('/community/delete', {
					id: this.communityInfo.id
				}).then(res => {
					if (res.data.code == 200) {
						uni.showToast({
							title: '删除成功',
							icon: 'none',
						})
						uni.redirectTo({
							url: "../houseList/houseList"
						})
					}
				})
			},
			refreshLastPage() {
				setTimeout(() => {
					let pages = getCurrentPages();
					if (pages.length > 1) {
						let beforePage = pages[pages.length - 2];
						beforePage.$vm.updateData()
						uni.navigateBack({
							delta: 1,
						})
					}
				}, 1500);
			},
			save() {
				let _this = this;
				this.$refs.form.validate((res) => {
					if (res) {
						_this.submitData(true)
					}
				})
			},
			addRoom() {
				let _this = this;
				this.$refs.form.validate((res) => {
					if (res) {
						_this.submitData(false)
					}
				})
			},
			submitData(isRefresh) {
				console.log()
				let _this = this
				let postUrl = this.isEdit ? '/community/updateCommunity' : "/community/addCommunity"
				let postPar = this.isEdit ? {
					landlordId: _this.$store.state.landladyInfo.id,
					communityAddress: _this.myAddr,
					communityName: _this.myName,
					id: this.communityInfo.id
				} : {
					landlordId: _this.$store.state.landladyInfo.id,
					communityAddress: _this.myAddr,
					communityName: _this.myName,
				}
				postPar.communityImgs = _this.communityImg ?
					_this.communityImg :
					"https://funnyduck.raysler.com/uploadFile/huyue/article/images/20190704/1562239924231ZGZQuw.jpeg"
				_this.$request.post(postUrl, postPar).then((data) => {
					if (this.isEdit) {
						uni.showToast({
							title: '编辑成功',
							duration: 1500,
						})
					} else {
						uni.showToast({
							title: '添加成功',
							duration: 1500,
						})
					}
					this.$store.commit('chooseLocationInfo', {})
					if (isRefresh) {
						_this.refreshLastPage()
					} else {
						let tempInfo = data.data.data
						uni.navigateTo({
							url: '../addRoomNum/addRoomNum?communityId=' + tempInfo.id + '&communityName=' + tempInfo.communityName
						})
					}
				})


			},
		}
	}
</script>

<style scoped>
	.addCommunity {
		width: 100%;
		height: 100vh;
		padding-top: 30rpx;
		background-color: #FAFAFA;
		position: relative;
	}

	.content {
		background-color: #FFFFFF;
		padding: 0 40rpx;
	}

	.inpArrow {
		width: 30rpx;
		height: 24rpx;
		margin-left: 8rpx;

	}

	.form-input {
		width: 86%;
		/* width: 100%; */
		height: 100%;
		margin-left: auto;
		text-align: right;
		overflow: hidden;
		max-width: 500rpx;
		font-size: 32rpx;
	}

	.uploadBlock {
		width: 100%;
		font-size: 34rpx;
		font-weight: bold;
		height: fit-content;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		white-space: nowrap;
		padding: 25rpx 38rpx 25rpx 0;
	}

	.uploadImg {
		width: 100%;
		height: 106rpx;
		display: flex;
		justify-content: flex-end;
	}

	.uploadImg image {
		width: 106rpx;
		height: 100%;
	}

	.btnBox {
		width: 100%;
		padding-left: 65rpx;

	}

	.btnSave,
	.addNext {
		width: 290rpx;
		height: 74rpx;
		border-radius: 37rpx;
		font-size: 32rpx;
		text-align: center;
		line-height: 74rpx;
	}

	.btnSave {
		color: #FFA344;
		border: 2rpx solid #FFA344;
		position: absolute;
		bottom: 120rpx;
		left: 65rpx;
	}

	.addNext {
		background: linear-gradient(-90deg, rgba(243, 182, 73, 1) 0%, rgba(240, 154, 66, 1) 100%);
		color: #FFFFFF;
		position: absolute;
		bottom: 120rpx;
		right: 65rpx;
	}
</style>
