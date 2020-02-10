<template>
	<view>
		<view class="section1 sectionBorderBottom">
			<view class="houseName">
				{{communityInfo.name}}
			</view>
			<view class="houseDetail">
				<image class="houseArrow" src="../../static/right_arrow.png" mode="aspectFit"></image>
				<view class="detailTop">
					<span class="houseNum">{{communityInfo.houseNo}}</span>{{communityInfo.bedroomNum}}
					{{'室' | addSpace}}{{communityInfo.livingroomNum}}{{'厅' | addSpace}}
					{{communityInfo.toiletNum}}{{'卫' | addSpace}}
					<icon-bar class="iconBar" :title="'卧室'+communityInfo.roomNo" :bgColor="'#FFF2E5'" :fontColor="'#FFA344'"></icon-bar>
				</view>
				<view class="detailBottom">
					<span class="housePrice">{{communityInfo.roomPrice}}元/月</span>
					<span class="showRecord" v-if="roomInfo.unPayBill == 1">查看账单</span>
				</view>
			</view>
		</view>
		<!-- <view class="section2 sectionBorderBottom">
			<view class="itemBar">卧室配置</view>
			<view class="facilityBox">
				<view class="facilityItem" v-for="(item,index) in facBarList" :key="index">
					<facility-bar :title="item"></facility-bar>
				</view>
			</view>
			<view class="itemBar">公共区域</view>
			<view class="facilityBox">
				<view class="facilityItem" v-for="(item,index) in commonFacBarList" :key="index">
					<facility-bar :title="item"></facility-bar>
				</view>
			</view>
		</view> -->
		<view class="section3" v-for="(item,index) in roomInfo.tenants" :key="index" >
			<renter-info-bar v-if="!isShowAddBtn" :userInfo = "item" v-on:emitUserId="getEmit"></renter-info-bar>
			
		</view>
		<view class="addRenterBox1"	v-if="isShowAddBtn">
				<!-- <view class="invite">邀请入住</view> -->
				<image class="noRenter" src="../../static/noRenter.png" mode="aspectFit"></image>
				<view>暂无租客，点击添加租客</view>
				<view  class="addRenter1" @click="addRenter">添加租客</view>
			</view>
			<!-- <view class="addRenterBox">
				<view class="invite">邀请入住</view>
				<view v-if="isShowAddBtn" class="addRenter" @click="addRenter">添加租客</view>
			</view> -->
	</view>
</template>

<script>
	import iconBar from '../../components/iconBar.vue'
	import facilityBar from '../../components/facilityBar.vue'
	import renterInfoBar from '../../components/renterInfoBar.vue'
	export default {
		components:{
			"icon-bar":iconBar,
			"facility-bar":facilityBar,
			renterInfoBar
		},
		data() {
			return {
				isShowAddBtn:true,
				roomId:'',
				communityInfo:{},
				roomInfo:{},
				configList:[],
				facBarList:['床','衣柜','书桌','空调','家居礼包'],
				commonFacBarList:['空调','智能锁','燃气灶','热水器'],
			}
		},
		computed:{
		},
		onLoad(option) {
			this.communityInfo = JSON.parse(option.communityInfo)
			this.getRoomInfo(option.id)
			this.roomId =option.id 
		},
		methods: {
			updateData(){
				this.getRoomInfo(this.roomId)
			},
			getRoomInfo(id){
				let _this = this;
				_this.$request.post('room/findRoomById',{
					id
				}).then((res)=>{
					console.log(res)
					// _this.commonFacBarList = res.data.data.houseConfigure.split(',')
					_this.roomInfo = res.data.data
					if(_this.roomInfo.tenants){
						if(_this.roomInfo.tenants.length != 0){
						this.isShowAddBtn = false
					}
					}
					console.log(_this.roomInfo)
				})
			},
			
			showBill(){
				
			},
			getEmit(e){
				console.log(e)
				let communInfo = {
					name:this.communityInfo.name,
					houseNo:this.communityInfo.houseNo,
					roomNo:this.communityInfo.roomNo
				}
				uni.navigateTo({
					url:"../billRecord/billRecord?userInfo="+JSON.stringify(e)+'&commInfo='+JSON.stringify(communInfo)+'&roomId='+this.roomId
				})
			},
			addRenter(){
				console.log('你打')
				let communInfo = {
					name:this.communityInfo.name,
					houseNo:this.communityInfo.houseNo,
					roomNo:this.communityInfo.roomNo
				}
				uni.navigateTo({
					url:'../addRenter/addRenter?roomId='+this.roomId+'&commInfo='+JSON.stringify(communInfo)
				})
			}
		}
	}
</script>

<style scoped>
	.section1{
		padding: 23rpx 39rpx 26rpx 41rpx;
	}
	.sectionBorderBottom{
		border-bottom: 3px solid #FAFAFA;
	}
	.houseName{
		font-weight: bold;
		font-size: 30rpx;
		margin-bottom: 35rpx;
	}	
	
	.houseDetail{
		color: #999999;
		font-size: 26rpx;
		font-weight: 500;
		padding-left: 19rpx;
		position: relative;
	}
	.houseArrow{
		position: absolute;
		width: 30rpx;
		height: 56rpx;
		right: 0;
		top: calc(50% - 28rpx);
	}
	.detailTop{
		display: flex;
		align-items: center;
		margin-bottom: 35rpx;
	}
	.houseDetail .houseNum{
		font-size: 34rpx;
		font-weight: bold;
		color: #333333;
		margin-right: 17rpx;
	}
	.iconBar{
		margin-left: 17rpx;
	}
	.detailBottom{
		color: #666666;
		font-size: 32rpx;
		display: flex;
		align-items: baseline;
	}
	.showRecord{
		height: 45rpx;
		width: 160rpx;
		text-align: center;
		line-height: 45rpx;
		font-size: 26rpx;
		color: #EB5E61;
		background-color: #FFECEC;
		border-radius: 23rpx;
		margin-left: 35rpx;
	}
	.section2{
		padding: 40rpx 40rpx 6rpx 40rpx;
	}
	.itemBar{
		margin-bottom: 35rpx;
	}
	.facilityBox{
		display: flex;
		flex-wrap: wrap;
	}
	.facilityItem{
		width: calc(100% / 5);
		margin-bottom: 54rpx;
	}
	.section3{
		padding: 32rpx 0;
		width: calc(100% - 80rpx);
		margin-left: 40rpx;
		border-bottom: 3rpx solid #FAFAFA; 
	}
	
	.addRenterBox{
		height: 128rpx;
		width: 100%;
		position: fixed;
		bottom: 0;
		left: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		box-shadow:0px -5px 16px 0px rgba(0, 0, 0, 0.04);
	}
	.invite,.addRenter{
		width: 235rpx;
		height: 76rpx;
		text-align: center;
		line-height: 76rpx;
		color: #FFFFFF;
		border-radius: 18rpx;
		font-size: 34rpx;
	}
	.invite{
		margin-right: 46rpx;
		background:linear-gradient(-90deg,rgba(101,216,196,1) 0%,rgba(88,189,218,1) 100%);
	}
	.addRenter{
		background:linear-gradient(-90deg,rgba(243,183,73,1) 0%,rgba(240,154,66,1) 100%);
	}
	.addRenterBox1{
		color: #BBBBBB;
		font-size: 28rpx;
		width: fit-content;
		height: fit-content;
		margin: 170rpx auto 0 auto;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.noRenter{
		width: 214rpx;
		height: 152rpx;
		margin: 0 auto 48rpx auto;
	}
	.addRenter1{
		width: 235rpx;
		height: 68rpx;
		border-radius: 18rpx;
		border: 2rpx solid #FFA044;
		color: #FFA044;
		font-size: 32rpx;
		line-height: 68rpx;
		text-align: center;
		margin: 48rpx auto 0 auto;
	}
</style>
