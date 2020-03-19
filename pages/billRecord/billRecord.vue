<template>
	<view class="billRecord">
		<view class="section1" v-if="!ownerId">
			<renter-info-bar :userInfo="userInfo" v-on:emitUserId="getEmit"></renter-info-bar>
		</view>
		<view class="landlordItem" v-if="ownerId" @click="showLandLordInfo(ownerInfo.id,ownerInfo.houseId)">
			<image class="infoLink" src="../../static/right_arrow.png" mode="aspectFit"></image>
			<view class="landlordLi">
				<view class="fullName">
					<view class="surnName">{{ownerInfo.firstWord ? ownerInfo.surnName : '#'}}</view>
					<view class="lastNmae">{{ownerInfo.firstWord ? ownerInfo.lastName : ownerInfo.ownerName}}</view>
				</view>
				<view class="local">{{ownerInfo.communityName}}-{{ownerInfo.buildingNo}}号{{ownerInfo.houseNo}}</view>
				<view class="local">租期：{{ownerInfo.startDate}} ~ {{ownerInfo.endDate}}</view>
			</view>
		</view>
		<!-- <view class="addBar">
			<add-bar :title="'新账单'"></add-bar>
		</view> -->
		<view class="noLatestBill" v-if="latestBill.length == 0">暂无最新账单</view>
		<view class="section2" v-if="latestBill.length != 0">
			<view class="billBarName">最新账单</view>
			<view class="content" @click="showBillDetail(item)" v-for="(item,index) in latestBill" :key="index">
				<view class="inner">
					<view class="contentRight">
						<view class="billTitle">{{item.startDate.substr(0,10)}}账单</view>
						<view class="checkDate textOverFlow active">收租日期：{{item.payRentDate.substr(0,10)}}</view>
					</view>
					<view>{{item.totalAmount}}</view>
				</view>
			</view>
		</view>
		<view class="section2" v-if="returnBillRecord.length != 0">
			<view class="billBarName">历史账单</view>
			<view class="content" @click="showBillDetail(item)" v-for="(item,index) in returnBillRecord" :key="index">
				<view class="inner">
					<image v-if="item.billStatus  == 4 " class="checkBg" :src="item.billType  == 1 ? '../../static/hasCheck1.png' : '../../static/hasCheck.png'" mode="aspectFit"></image>
					<view class="contentRight">
						<view class="billTitle">{{item.billType == 0 ? '租金收入' : '租金支出'}}</view>
						<view class="checkDate textOverFlow">到账日期：{{item.arrivalDate.substr(0,10)}}</view>
					</view>
					<view>{{item.totalAmount}}</view>
				</view>
			</view>
		</view>
		<tip-modal v-if="isShowTipModal" :oneButton="true" :title="'提示'" :describition="'您有未确认账单，请先确认。'" v-on:emitCancel="hideTipModal"></tip-modal>
		<view class="latestBillBox">
			<view class="latestBill" @click="getLatestBill">生成最新账单</view>
		</view>
	</view>
</template>

<script>
	import tipModal from '../../components/tipModal.vue'
	import moment from 'moment'
	import renterInfoBar from '../../components/renterInfoBar.vue'
	import addBar from '../../components/addBar.vue'
	export default {
		components: {
			renterInfoBar,
			addBar,
			tipModal
		},
		data() {
			return {
				isShowTipModal: false,
				userInfo: {},
				// isHaveLatestBill:false,
				returnBillRecord: [],
				latestBill: [],
				roomId: '',
				communityInfo: {},
				ownerId: null,
				ownerInfo: {}
			}
		},
		onLoad(options) {
			if (options.ownerId) {
				this.ownerId = options.ownerId
				uni.setNavigationBarTitle({
					title: '房东账单'
				})
			} else {
				this.roomId = options.roomId;
				this.userInfo = JSON.parse(options.userInfo)
				this.communityInfo = JSON.parse(options.commInfo)
			}

		},
		onShow() {
			if (this.ownerId) {
				this.getOwnBill(this.ownerId)
			}
			this.getBillRecord()
		},
		methods: {
			showLandLordInfo(ownerId, houseId) {
				uni.navigateTo({
					url: '../addLandLord/addLandLord?ownerId=' + ownerId + '&houseId=' + houseId
				})
			},
			getOwnBill(id) {
				this.$request.post('/owner/findById', {
					id
				}).then((res) => {
					console.log(res)
					let data = res.data.data
					data.startDate = data.startDate.split(' ')[0];
					data.endDate = data.endDate.split(' ')[0];
					data.surnName = data.ownerName.substr(0, 1);
					data.lastName = data.ownerName.substr(1);
					this.ownerInfo = data
				})
			},
			hideTipModal() {
				this.isShowTipModal = false
			},
			getLatestBill() {
				if (this.latestBill.length != 0) {
					this.isShowTipModal = true
				} else {
					// let par = this.returnBillRecord[0]
					let par = this.ownerId ? {
						landlordId: this.$store.state.landladyInfo.id,
						billType: 1,
						ownerId: this.ownerId
					} : {
						landlordId: this.$store.state.landladyInfo.id,
						billType: 0,
						tenantId: this.userInfo.id
					}
					this.$request.post('/bill/createBill', par).then((res) => {
						if (res.data.code == 200) {
							this.getBillRecord(this.userInfo.id)
							uni.showToast({
								title: '最新账单已生成'
							})
						}
					})
				}
			},
			getRenterInfo(id) {
				this.$request.post('/roomUser/findByTenantId', {
					tenantId: id
				}).then((res) => {
					this.userInfo = res.data.data
				})
			},
			updateData() {

			},
			getEmit(e) {
				console.log(e)
				uni.navigateTo({
					url: '../addRenter/addRenter?commInfo=' + JSON.stringify(this.communityInfo) +
						'&roomId=' + this.roomId + '&userId=' + this.userInfo.id
				})
			},
			showBillDetail(item) {
				if (item.billType == 0) {
					uni.navigateTo({
						url: '../billDetail/billDetail?billId=' + item.id + '&tenantId=' + this.userInfo.id + '&billType=' + item.billType
					});
				} else if (item.billType == 1) {
					uni.navigateTo({
						url: '../billDetail/billDetail?billId=' + item.id + '&ownerId=' + this.ownerId + '&billType=' + item.billType
					});
				}
				
			},
			// checkIsHaveLatestBill(endDate){
			// 	this.isHaveLatestBill = moment(endDate).isAfter(new Date())
			// 	if(this.isHaveLatestBill){
			// 		const res =	this.returnBillRecord.shift()
			// 		this.latestBill.push(res)
			// 	}
			// },
			getBillRecord(id) {
				let _this = this;
				let arr1 = [];
				let arr2 = [];
				let parUrl = this.ownerId ? '/bill/findByOwnerId' : '/bill/findByTenantId'
				let params = this.ownerId ? {
					ownerId: this.ownerId
				} : {
					tenantId: this.userInfo.id
				}
				_this.$request.post(parUrl, params).then((res) => {
					if (res.data.data.length == 0) {
						this.latestBill = [];
						this.returnBillRecord = [];
					}
					res.data.data.forEach((item, index) => {
						if (item.billStatus != 4) {
							arr1.push(item)
						} else {
							arr2.push(item)
						}
						this.latestBill = arr1;
						this.returnBillRecord = arr2;
					});
				}).catch(err => {

				})
			},
		},

	}
</script>

<style scoped>
	.billRecord {
		width: 100%;
		height: 100%;
		min-height: 100vh;
		padding-bottom: 140rpx;
		background-color: #FAFAFA;
	}

	.section1 {
		padding: 33rpx 40rpx;
		margin-bottom: 14rpx;
		background-color: #FFFFFF;
	}

	.addBar {
		width: 100%;
		padding: 36rpx 0;
		margin-bottom: 14rpx;
		background-color: #FFFFFF;
	}

	.section2 {
		background-color: #FFFFFF;
	}

	.billBarName {
		width: 100%;
		padding: 20rpx 40rpx;
		font-size: 32rpx;
		font-weight: bold;
		color: #BBBBBB;
		text-align: right;
		background-color: #FAFAFA;
	}

	.inner {
		position: relative;
		border-radius: 5rpx;
		display: flex;
		justify-content: flex-start;
		width: calc(100% - 80rpx);
		margin-left: 40rpx;
		padding: 26rpx 0;
	}

	.content:not(:last-child) {
		border-bottom: 1rpx solid #EBEBEB;
	}

	.content {
		background-color: #FFFFFF;
		height: 128rpx;
		font-size: 32rpx;
		margin-bottom: 14rpx;
	}

	.checkBg {
		width: 96rpx;
		height: 96rpx;
		position: absolute;
		top: 19rpx;
		right: 144rpx;
	}

	.contentRight {
		margin-right: auto;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.checkDate {
		color: #999999;
		font-size: 26rpx;
		font-weight: bold;
		margin-top: 6rpx;
	}

	.active {
		color: #FFA344;
	}

	.noLatestBill {
		width: 100%;
		color: #BBBBBB;
		font-size: 32rpx;
		font-weight: bold;
		text-align: center;
		margin: 50rpx 0;
	}

	.latestBill {
		width: 378rpx;
		height: 74rpx;
		font-size: 34rpx;
		line-height: 74rpx;
		background: linear-gradient(-90deg, rgba(243, 183, 73, 1) 0%, rgba(240, 154, 66, 1) 100%);
		border-radius: 37rpx;
		color: #FFFFFF;
		text-align: center;
	}

	.latestBillBox {
		width: 100%;
		height: 128rpx;
		box-shadow: 0px -5px 16px 0px rgba(0, 0, 0, 0.04);
		display: flex;
		justify-content: center;
		align-items: center;
		position: fixed;
		bottom: 0;
		left: 0;
	}

	.landlordItem {
		width: 100%;
		background-color: #FFFFFF;
		font-size: 28rpx;
		color: #999999;
		padding: 0rpx 0 14rpx 32rpx;
		position: relative;
	}

	.landlordLi {
		padding: 20rpx 0;
	}

	.landlordLi:not(:first-of-type) {
		border-top: 1rpx solid #fafafa;
	}

	.landlordItem:not(:first-of-type) {
		margin-top: 20rpx;
	}

	.fullName {
		color: #333333;
		font-size: 33rpx;
		display: flex;
		align-items: center;
		font-weight: bold;
	}

	.surnName {
		width: 66rpx;
		height: 66rpx;
		background-color: #FFA344;
		font-size: 36rpx;
		color: #FFFFFF;
		text-align: center;
		line-height: 66rpx;
		border-radius: 50%;
		margin-right: 12rpx;
	}

	.local {
		padding: 0 0 4rpx 78rpx;
	}
	.infoLink{
		position: absolute;
		width: 26rpx;
		height: 26rpx;
		right: 32rpx;
		top: 50%;
		transform: translateY(-50%);
	}
</style>
