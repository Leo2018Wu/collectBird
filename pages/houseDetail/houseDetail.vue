<template>
	<view class="houseDetail">
		<view class="houseSkuBox">
			<!-- <house-sku :houseInfoList="communityInfo" v-on:myClick="returnClick"></house-sku> -->
			<house-sku-new :item="communityInfo" :btnContent1="'管理房源'" :paddingSelf="100" v-on:myClick="returnClick" v-on:filterHouseRent="returnFilterRent" v-on:filterHouseEmpty="returnFilterEmpty" v-on:resetHouse="resetHouse"></house-sku-new>
			<image class="houseRightIcon" src="../../static/right_arrow.png" mode="aspectFit"></image>
		</view>
		<view class="addBarBox">
			<view class="formBox" @click="showCommForm">
				<image src="../../static/formIcon.png" mode="aspectFit"></image>
				<view>收支报表</view>
			</view>
			<view class="addHouseBtn" @click="addHouse">
				<image src="../../static/addHouse.png" mode="aspectFit"></image>
				<view>添加房号</view>
			</view>
			<!-- <add-Bar title="添加房号" v-on:addCommunity="addHouse"></add-Bar> -->
		</view>
		<view class="section">
			<!-- @click="toEditHouse(item)" -->
			<view class="houseLi" v-for="(item,index) in houseInfo" :key="index" v-if="item.roomList.length != 0">
				<view class="tips" v-if="item.rentType == 0">整租</view>
				<view class="content">
					<view class="liNumber" @click="toEditHouse(item.id)">
						<view class="liTop"><span>{{item.buildingNo}}</span>{{"号" | addSpace}} <span>{{item.houseNo}}</span></view>
						<view class="facility textOverFlow">
							{{item.bedroomNum}}{{'室' | addSpace}}{{item.livingroomNum}}{{"厅" | addSpace}}{{item.toiletNum}}卫
							<span>合计:</span> {{item.rentPrice}}元/月
						</view>
					</view>

					<scroll-view class="roomScroll" scroll-x="true">
						<view class="roomItem" :class="[{noRent:p.rentStatus == 0},{hasPayBill: p.unPayBill >= 1},{unFill:p.tenantStatus == 2},{waitRent:p.rentStatus == 2}]" v-for="(p,idx) in item.roomList"
						 :key="idx" @click="goRoom(p.id,idx,index,p.tenantId)">
							<view class="roomItemLi">
								<view v-if="item.rentType != 0">卧<span class="roomNo">{{p.roomNo}}</span></view>
								<view v-if="item.rentType == 0">整租</view>
								<span v-if="p.tenantStatus == 2">待完善</span>
								<view v-if="p.tenantStatus != 2">
									<span v-if="p.rentStatus == 2">招租中</span>
									<span v-if="p.rentStatus == 0" style="fontSize:28rpx">闲置</span>
									<span v-if="p.rentStatus == 1 && p.unPayBill >= 1" style="fontSize:28rpx">有账单</span>
									<span v-if="p.rentStatus == 1 && p.unPayBill == 0">{{p.tenantName}}</span>
								</view>
							</view>
						</view>
					</scroll-view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import houseSkuNew from '../../components/houseSkuNew.vue'
	import addBar from "../../components/addBar.vue"
	export default {
		components: {
			// "house-sku":houseSku,
			"add-Bar": addBar,
			houseSkuNew
		},
		computed: {

		},
		data() {
			return {
				communityInfo: {},
				houseInfo: [],
				par:{
					id: '',
					landlordId: '',
				},
				houseId:''
			}
		},
		onLoad(option) {
			console.log(option)
			this.houseId = option.id
			this.par.id = option.id
			this.par.landlordId = option.landlordId
		},
		onShow() {
			this.getCommuny(this.houseId)
			this.getHouseInfo()
		},
		methods: {
			resetHouse(e){
				console.log(e)
				this.getHouseInfo()
			},
			returnFilterRent(e){
				console.log(e)
				this.getHouseInfo('1')
			},
			returnFilterEmpty(e){
				console.log(e)
				this.getHouseInfo('02')
			},
			showCommForm(){
				uni.navigateTo({
					url:'../houseReportForm/houseReportForm?communityId='+this.houseId
				})
			},
			toEditHouse(id) {
				uni.navigateTo({
					url: '../addRoomNum/addRoomNum?communityName=' + this.communityInfo.communityName + '&communityId=' + this.houseId +
						'&houseId=' + id
				})
			},
			updateData() {
				this.getCommuny(this.houseId)
			},
			returnClick(e) {
				uni.navigateTo({
					url: '../addCommunity/addCommunity?communityInfo=' + JSON.stringify(e)
				})
			},
			addHouse() {
				uni.navigateTo({
					url: '../addRoomNum/addRoomNum?communityName=' + this.communityInfo.communityName + '&communityId=' + this.houseId
				})
			},
			goRoom(id, idx, index,tenantId) {
				console.log('sss', id, idx, index)
				let communityInfo = {}
				communityInfo.name = this.communityInfo.communityName
				communityInfo.houseNo = this.houseInfo[index].houseNo
				communityInfo.bedroomNum = this.houseInfo[index].bedroomNum
				communityInfo.livingroomNum = this.houseInfo[index].livingroomNum
				communityInfo.toiletNum = this.houseInfo[index].toiletNum
				communityInfo.roomNo = this.houseInfo[index].roomList[idx].roomNo
				communityInfo.roomPrice = this.houseInfo[index].roomList[idx].roomPrice
				console.log(communityInfo)
				let houseId = this.houseInfo[index].id
				uni.navigateTo({
					url: '../renter/renter?id=' + id + '&communityInfo=' + JSON.stringify(communityInfo) + '&houseId=' + houseId +
						'&communityId=' + this.houseId+'&tenantId='+tenantId
				})
			},
			getCommuny(id) {
				let _this = this;
				_this.$request.post("/community/findById", {
					id,
				}).then((res) => {

					res.data.data.communityImgs = res.data.data.communityImgs.split(",");
					_this.communityInfo = res.data.data
				}).catch(err => {
					console.log(err)
				})
			},
			getHouseInfo(rentStatus) {
				let _this = this;
				if(rentStatus){
					this.par.rentStatus = rentStatus
				}else{
					delete this.par.rentStatus
				}
				_this.$request.post("/house/myHouse", _this.par).then((res) => {
					console.log(res)
					_this.houseInfo = res.data.data
				}).catch(err => {
					console.log(err)
				})
			}
		}
	}
</script>

<style scoped>
	.houseDetail {
		width: 100%;
		height: 100vh;
		background-color: #FAFAFA;
	}

	.houseSkuBox {
		width: 100%;
		padding: 13rpx 40rpx 0 40rpx;
		border-top: 2rpx solid #DBDBDB60;
		position: relative;
		background-color: #FFFFFF;
	}

	.houseRightIcon {
		position: absolute;
		width: 30rpx;
		height: 30rpx;
		top: 50%;
		right: 70rpx;
		transform: translateY(-50%);
	}

	.addBarBox {
		/* border-top: 1rpx solid #DBDBDB; */
		padding: 34rpx 0;
		background-color: #FFFFFF;
		display: flex;
		color: #FFA344;
		font-size: 34rpx;
	}
	.formBox image {
		width: 38rpx;
		height: 34rpx;
		margin-bottom: 6rpx;
	}
	.addHouseBtn image{
		width: 34rpx;
		height: 34rpx;
		margin-bottom: 6rpx;
	}
	.addBarBox view{
		display: flex;
		width: 50%;
		height: 100%;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.section {
		width: 100%;
		padding: 13rpx 40rpx 30rpx 40rpx;
		background-color: #FAFAFA;
	}

	.houseLi {
		width: 100%;
		height: 100%;
		background-color: #FFFFFF;
		border-radius: 12rpx;
		padding: 26rpx 38rpx 33rpx 30rpx;
		display: flex;
		margin-bottom: 14rpx;
		position: relative;
	}

	.tips {
		position: absolute;
		right: 0;
		top: 0;
		width: 66rpx;
		height: 30rpx;
		line-height: 30rpx;
		border-radius: 5rpx 0 5rpx 5rpx;
		color: #FFFFFF;
		font-size: 22rpx;
		background-color: #FFA344;
		text-align: center;
	}

	.content {
		width: 100%;
		height: 100%;
		/* display: flex;
		justify-content: space-between;
		align-items: flex-start; */
	}

	.liNumber {
		font-size: 30rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}

	.liTop {
		margin-right: 18rpx;
		font-size: 30rpx;
		color: #333333;
		font-weight: bold;
	}

	.liNumber .liTop span:first-of-type {
		box-sizing: border-box;
		padding: 0 4rpx;
		display: inline-block;
		min-width: 34rpx;
		height: 34rpx;
		text-align: center;
		line-height: 34rpx;
		border-radius: 5rpx;
		background-color: #FFA344;
		color: #FFFFFF;
		font-weight: normal;
	}

	.facility {
		color: #999999;
		font-size: 30rpx;
		min-height: 30rpx;
	}

	.facility span {
		margin: 0 17rpx;
	}


	.roomScroll {
		width: 100%;
		height: 116rpx;
		margin-top: 35rpx;
		color: #999;
		white-space: nowrap;
	}

	.roomItem {
		width: 116rpx;
		height: 116rpx;
		border-radius: 5rpx;
		background-color: #FFF2E5;
		color: #FFA344;
		font-size: 28rpx;
		display: inline-block;
		margin-right: 24rpx;
	}

	.roomItemLi {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content:space-around;
		align-items: center;
	}
	.addLi{
		justify-content:center;
	}

	.roomItem .roomNo {
		font-weight: bold;
		font-size: 32rpx;
	}

	.roomItem:last-of-type {
		margin-right: unset;
	}

	.noRent {
		background-color: #CFCFCF;
		color: #FFFFFF;
	}

	.hasPayBill {
		background-color: #EB5E61 !important;
		color: #FFFFFF;
	}
	.unFill{
		background-color: #FFD0D1;
		color: #EB5E61;
	}
	.waitRent{
		background-color: #E7F0FF;
		color: #5396FF;
	}
</style>
