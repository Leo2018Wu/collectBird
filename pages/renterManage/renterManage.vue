<template>
	<view class="renterManage">
		<view class="header">
			<view class="headBar">
				<view class="headBarItem">
					在租租客
					<span>{{inRentTenantNum ? inRentTenantNum : 0 }}</span>
				</view>
				<view class="headBarItemLine"></view>
				<view class="headBarItem">
					即将到期
					<span>{{aboutToExpire ? aboutToExpire : 0}}</span>
				</view>
			</view>
		</view>
		<view class="emptyList" v-if="renterList.length == 0 && loadEnd">
			<image class="noRenterIcon" src="../../static/renterListEmpty.png" mode="aspectFit"></image>
			<view>暂无租客，<span @click="showHelp">查看如何添加租客?</span></view>
		</view>
		<view v-else class="section" :class="{secFirst : index == 0}" v-for="(item,index) in renterList" :key="index">
			<view class="sectionBar" @click="showRenterList(index)">
				<span :class="[isShow && currentIndex == index ? 'tips1' : 'tips0']"></span>
				<view class="secName">{{item.communityName}}</view>
				<view class="renters">租客<span>{{item.count}}</span></view>
			</view>
			<view class="renterListBox" :class="{active:isShow && currentIndex == index}">
				<view class="renterLi" v-for="(p,idx) in item.tenantList" :key="idx" @click="goRenter(p,item.communityName,p.id)">
					<image class="renterImg" v-if="p.tenantImg" :src="p.tenantImg" mode="aspectFill"></image>
					<view v-if="!p.tenantImg">
						<image class="renterImg" v-if="p.tenantSex == 0" src="../../static/defaultMale.png" mode="aspectFill"></image>
						<image class="renterImg" v-else src="../../static/defaultFemale.png" mode="aspectFill"></image>
					</view>
					<view class="renterInfoBox">
						<view class="textOverFlow">{{p.tenantName}}</view>
						<view class="renterTel textOverFlow">{{p.tenantPhone}}</view>
						<view class="roomNo textOverFlow">{{p.map.buildingNo}}号{{p.map.houseNo}}-卧{{p.map.roomNo}}</view>
					</view>
					<view class="overDue" v-if="p.overdueDays > 0">逾期{{p.overdueDays}}天</view>
					<view class="overDue" v-if="p.overdueDays == 0">今日账单</view>
					<view class="overDue" v-if="p.overdueDays < 0">{{-p.overdueDays}}天后交租</view>
					<image class="rightArr" src="../../static/right_arrow.png" mode="aspectFit"></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isShow: false,
				renterList: [],
				currentIndex: null,
				aboutToExpire: '',
				inRentTenantNum: '',
				loadEnd:false
			}
		},
		onLoad() {
		},
		onShow() {
			let landordId = this.$store.state.landladyInfo.id
			this.getRenterList(landordId)
			this.getTopNum(landordId)
		},
		methods: {
			showHelp(){
				uni.navigateTo({
					url: '../helpDetail/helpDetail?title=' + '如何添加租客？' + '&index=' + 1 + '&idx=' + 0
				})
			},
			getTopNum(id) {
				this.$request.post('/roomUser/tenantNum', {
					id
				}).then((res) => {
					console.log(res)
					this.aboutToExpire = res.data.data.aboutToExpire;
					this.inRentTenantNum = res.data.data.inRentTenantNum;
				})
			},
			goRenter(item, name,tenantId) {
				console.log(item)
				let communityInfo = {}
				communityInfo.name = name
				communityInfo.houseNo = item.map.houseNo
				communityInfo.bedroomNum = item.map.bedroomNum
				communityInfo.livingroomNum = item.map.livingroomNum
				communityInfo.toiletNum = item.map.toiletNum
				communityInfo.roomNo = item.map.roomNo
				communityInfo.roomPrice = item.map.roomPrice
				let id = item.map.roomId
				uni.navigateTo({
					url: '../renter/renter?id=' + id + '&communityInfo=' + JSON.stringify(communityInfo) + '&houseId=' + item.map.houseId+'&tenantId='+tenantId
				})
			},
			getRenterList(id) {
				console.log(id)
				this.$request.post('/roomUser/tenantList', {
					id
				}).then((res) => {
					console.log(res)
					this.loadEnd = true;
					this.renterList = res.data.data;
					this.renterList.forEach((item, index) => {
						item.tenantList.sort(function(newVal, oldVal) {
							console.log(newVal, oldVal)
							return newVal.map.buildingNo - oldVal.map.buildingNo
						})
					})
				})
			},
			showRenterList(index) {
				this.currentIndex = index;
				this.isShow = !this.isShow;
			}
		}
	}
</script>

<style scoped>
	.renterManage {
		width: 100%;
		height: 100%;
		min-height: 100vh;
		background-color: #FAFAFA;
	}

	.header {
		width: 100%;
		height: 81rpx;
		background-color: #F09A42;
		position: relative;
	}

	.headBar {
		width: 670rpx;
		height: 114rpx;
		/* line-height: 114rpx; */
		box-shadow: 3px 5px 9px 1px rgba(225, 226, 226, 0.27);
		border-radius: 10rpx;
		position: absolute;
		left: 40rpx;
		bottom: -56rpx;
		background-color: #ffffff;
		font-size: 30rpx;
		font-weight: 500;
		display: flex;
		align-items: center;
	}

	.headBarItem {
		width: 50%;
		height: 65rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.headBarItem span {
		font-size: 40rpx;
		font-weight: 800;
		margin-left: 20rpx;
		color: #f09a42;
	}

	.headBarItemLine {
		width: 1rpx;
		height: 65rpx;
		background-color: rgba(223, 220, 220, 1);
	}

	/* 	.headBarItem:first-of-type {
	  border-right: 1rpx solid #dfdcdc80;
	}
	.headBarItem:last-of-type {
	  border-left: 1rpx solid #dfdcdc80;
	} */
	.section {
		width: 100%;
		background-color: #FFFFFF;
		margin-bottom: 17rpx;
	}

	.secFirst {
		margin-top: 73rpx;
	}

	.sectionBar {
		height: 100rpx;
		width: calc(100% - 80rpx);
		padding-right: 44rpx;
		margin-left: 40rpx;
		display: flex;
		align-items: center;
		justify-content: flex-start;
		position: relative;
	}

	.renterListBox {
		height: 100%;
		width: 100%;
		padding: 0 40rpx;
		margin-bottom: 17rpx;
		display: none;
	}

	.renterLi {
		width: 100%;
		height: 160rpx;
		padding: 24rpx 0;
		border-top: 2rpx solid #EBEBEB80;
		display: flex;
		align-items: center;
		justify-content: flex-start;
	}

	.active {
		display: block;
	}

	.tips0 {
		content: "";
		width: 0;
		height: 0;
		position: absolute;
		right: 0;
		border-top: 0;
		border-bottom: 12rpx solid #DBDBDB;
		border-left: 12rpx solid transparent;
		border-right: 12rpx solid transparent;
	}

	.tips1 {
		content: "";
		width: 0;
		height: 0;
		position: absolute;
		right: 0;
		border-top: 0;
		transform: rotate(-180deg);
		border-bottom: 12rpx solid #DBDBDB;
		border-left: 12rpx solid transparent;
		border-right: 12rpx solid transparent;
	}

	.secName {
		margin-right: auto;
		font-size: 32rpx;
	}

	.renters {
		color: #FFA344;
		font-size: 28rpx;
	}

	.renters span {
		font-weight: bold;
		margin-left: 10rpx;
	}

	.renterImg {
		width: 94rpx;
		height: 94rpx;
		border-radius: 100%;
		margin-right: 30rpx;
	}

	.renterInfoBox {
		height: 100%;
		width: fit-content;
		max-width: 350rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		font-size: 33rpx;
		margin-right: auto;
	}

	.renterTel,
	.roomNo {
		color: #999999;
		font-size: 26rpx;
	}

	.rightArr {
		width: 30rpx;
		height: 28rpx;
	}

	.overDue {
		background-color: #FFECEC;
		border-radius: 20rpx;
		height: 40rpx;
		width: fit-content;
		padding: 0 12rpx;
		text-align: center;
		line-height: 40rpx;
		margin-right: 15rpx;
		font-size: 24rpx;
		color: #EB5E61;
	}
	.emptyList{
		padding-top: 290rpx;
		text-align: center;
		color: #BBBBBB;
		font-size: 28rpx;
	}
	.emptyList span {
		position: relative;
	}
	
	.emptyList span::after {
		position: absolute;
		content: '';
		width: 100%;
		height: 1rpx;
		background-color: #BBBBBB;
		bottom: 0;
		left: 0;
	}
	.noRenterIcon{
		width: 136rpx;
		height: 190rpx;
		margin: 0 auto 14rpx auto;
	}
</style>
