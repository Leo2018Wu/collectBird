<template>
	<view>
		<view class="section1 sectionBorderBottom">
			<view class="houseName">
				{{communityInfo.name}}
			</view>
			<view class="houseDetail" @click="toEditHouse">
				<image class="houseArrow" src="../../static/right_arrow.png" mode="aspectFit"></image>
				<view class="detailTop">
					<span class="houseNum">{{communityInfo.houseNo}}</span>{{communityInfo.bedroomNum}}
					{{'室' | addSpace}}{{communityInfo.livingroomNum}}{{'厅' | addSpace}}
					{{communityInfo.toiletNum}}{{'卫' | addSpace}}
					<icon-bar class="iconBar" :title="'卧室'+communityInfo.roomNo" :bgColor="'#FFF2E5'" :fontColor="'#FFA344'"></icon-bar>
				</view>
				<view class="detailBottom">
					<span class="housePrice">{{communityInfo.roomPrice}}元/月</span>
					<span class="showRecord" v-if="roomInfo.unPayBill >= 1" @click.stop="showBill()">查看账单</span>
				</view>
			</view>
		</view>
		<view class="renterTitle">
			租客信息
		</view>
		<!-- v-if="isShowAddBtn" -->
		<view class="section3" v-for="(item,index) in roomInfo.tenants" :key="index">
			<renter-info-bar :userInfo="item" v-on:emitFillInfo="fillInfo" v-on:emitUserId="getEmit" :showFillBtn="roomInfo.tenantStatus == 2"></renter-info-bar>
		</view>
		
		<view class="addRenterBox1" v-if="isShowAddBtn">
			<image class="noRenter" src="../../static/noRenter.png" mode="aspectFit"></image>
			<view v-if="roomInfo.tenantStatus == 1">租客信息填写中，您可以选择</view>
			<view v-else>暂无租客，您可以选择</view>
		</view>
		<view class="addRenterBox" v-if="isShowAddBtn && roomInfo.tenantStatus == 0">
			<view class="addRenter" @click="addRenter">添加租客</view>
			<button class="invite" open-type="share">邀请入住</button>
		</view>
		<view class="addRenterBox" v-if="isShowAddBtn && roomInfo.tenantStatus == 1">
			<view class="addRenter" @click="updateInviteStatus(0)">取消邀请</view>
			<button class="invite" open-type="share">再次邀请</button>
		</view>
		<view class="operationBox" v-if="!isShowAddBtn &&  roomInfo.tenantStatus >= 3">
			<view class="rentBtnBox" @click="endRenting">
				<image src="../../static/endRentIcon.png" mode="aspectFit"></image>
				<view>退租</view>
			</view>
			<view class="rentBtnBox" @click="keepRenting">
				<image src="../../static/keepRentIcon.png" mode="aspectFit"></image>
				<view>续租</view>
			</view>
			<view class="inviteBind">邀请账号绑定</view>
			<!-- <view class="operationBtn keepRenting" @click="endRenting">退租</view>
			<view class="operationBtn endRenting" @click="keepRenting">续租</view> -->
		</view>
		<tip-modal v-if="isShowTipModal" :oneButton="true" :title="'提示'" :describition="'有未确认账单，不能退租。'" v-on:emitCancel="returnEmit"></tip-modal>
	</view>
</template>

<script>
	import tipModal from '../../components/tipModal.vue'
	import iconBar from '../../components/iconBar.vue'
	import renterInfoBar from '../../components/renterInfoBar.vue'
	export default {
		components: {
			"icon-bar": iconBar,
			renterInfoBar,
			tipModal
		},
		data() {
			return {
				addresseeId:'',
				isWholeRent:false,
				tenantId:null,
				isShowTipModal:false,
				houseId: null,
				communityId: null,
				isShowAddBtn: false,
				roomId: '',
				communityInfo: {},
				roomInfo: {},
				configList: [],
				facBarList: ['床', '衣柜', '书桌', '空调', '家居礼包'],
				commonFacBarList: ['空调', '智能锁', '燃气灶', '热水器'],
				msgId:''
			}
		},
		computed: {},
		onShow() {
			console.log(this.$store.state)
			if(this.$store.state.tenantId != null){
				this.tenantId = this.$store.state.tenantId
				this.$store.commit('tempRenterId', null);
			}
			this.getRoomInfo(this.roomId)
			this.$request.post('/house/findById', {
				id: this.houseId
			}).then((res) => {
				console.log(res)
				let data = res.data.data
				this.isWholeRent = data.rentType == '0' ? 1 : 0;
				this.communityInfo.houseNo = data.houseNo
				this.communityInfo.bedroomNum = data.bedroomNum
				this.communityInfo.livingroomNum = data.livingroomNum
				this.communityInfo.toiletNum = data.toiletNum
			})
			if(this.addresseeId){
				this.updateIsRead(this.addresseeId,this.msgId)
			}
		},
		onLoad(option) {
			console.log(option)
			if(option.addresseeId){
				this.addresseeId = option.addresseeId
				this.msgId = option.msgId
			}
			this.communityInfo = JSON.parse(option.communityInfo)
			// this.getRoomInfo(option.id)
			if(option.tenantId){
				this.tenantId = option.tenantId
			}
			this.roomId = option.id
			this.houseId = option.houseId
			this.communityId = option.communityId
		},

		onShareAppMessage(res) {
			let _this = this
			_this.updateInviteStatus(1)
			var shareObject
			// let par = {
			// 	roomId:this.roomId,
			// 	landLordId:this.$store.state.landladyInfo.id,
			// 	landLordName:this.$store.state.landladyInfo.userName
			// }
			let data = this.$store.state.landladyInfo
			shareObject = {
				title: _this.$store.state.landladyInfo.userName + '邀请你填写入住信息',
				imageUrl:'https://funnyduck.raysler.com/uploadFile/rentbird/banner/images/share.jpg',
				path: '/pages/inviteRenter/inviteRenter?roomId=' +this.roomId+'&landLordId='+data.id+'&landLordName='+data.userName+'&landLordAva='+data.userImg
			}
			return shareObject;
		},
		methods: {
			updateIsRead(addresseeId){
				this.$request.post('/userMessage/updateIsRead',{
					addresseeId,
					id:this.msgId
				}).then(()=>{})
			},
			// updateData(){
			// 	this.getRoomInfo(this.roomId)
			// },
			keepRenting(){
				uni.navigateTo({
					url:'../keepRenting/keepRenting?id='+this.roomInfo.tenants[0].id
				})
			},
			returnEmit(){
				this.isShowTipModal = false;
			},
			endRenting(){
				if(this.roomInfo.unPayBill >= 1){
					this.isShowTipModal = true;
				}else{
					let houseAddr = this.communityInfo.name +'-'+ this.communityInfo.houseNo+'-' + this.communityInfo.roomNo
					uni.navigateTo({
						url:'../endRenting/endRenting?tenantId=' + this.roomInfo.tenants[0].id+'&houseAddr='+houseAddr 
					})
				}
			},
			fillInfo(){
				console.log('返回事件')
				let commInfo = {
					name: this.communityInfo.name,
					houseNo: this.communityInfo.houseNo,
					roomNo: this.communityInfo.roomNo,
					renterId:this.roomInfo.tenants[0].id
				}
				uni.navigateTo({
					url:'../addRenter/addRenter?commInfo='+JSON.stringify(commInfo)+'&roomId='+this.roomInfo.id
				})
				
			},
			updateInviteStatus(status) {
				console.log('我是分享函数')
				let par = this.roomInfo;
				par.tenantStatus = status;
				console.log(par)
				this.$request.post('room/update', par).then((res) => {
					console.log(res)
				})
			},
			toEditHouse() {
				
				let houseInfo = {
					communityName : this.communityInfo.name,
					communityId : this.communityId,
					houseId : this.houseId
				}
				uni.navigateTo({
					url: `../roomDetail/roomDetail?isWholeRent=${this.isWholeRent}` + `&roomNo=` + `${this.communityInfo.roomNo}` + '&houseInfo=' +
						`${JSON.stringify(houseInfo)}`,
				})
			},
			getRoomInfo(id) {
				let _this = this;
				let par = {
					id
				}
				console.log(this.tenantId)
				// if(this.tenantId != null){
					console.log('nihao')
					par.tenantId = this.tenantId == 'null' ? '' : this.tenantId
				// }
				_this.$request.post('room/findRoomById',par).then((res) => {
					console.log(res)
					// _this.commonFacBarList = res.data.data.houseConfigure.split(',')
					_this.roomInfo = res.data.data
					_this.communityInfo.roomPrice = res.data.data.roomPrice
					_this.communityInfo.name = res.data.data.communityName
					if (_this.roomInfo.tenants && _this.roomInfo.tenants.length == 0) {
						this.isShowAddBtn = true;
					} else {
						this.isShowAddBtn = false;
					}
				})
			},
			showBill() {
				console.log('我点击了',this.roomInfo)
				if(this.roomInfo.billStatus == 5){
					let houseAddr = this.communityInfo.name +'-'+ this.communityInfo.houseNo+'-' + this.communityInfo.roomNo
					uni.navigateTo({
						url:'../endRenting/endRenting?billId=' + this.roomInfo.billId+'&houseAddr='+houseAddr 
					})
				}else{
					uni.navigateTo({
						url: '../billDetail/billDetail?billId=' + this.roomInfo.billId + '&tenantId=' + this.roomInfo.tenants[0].id
					})
				}
			},
			getEmit(e) {
				console.log(e)
				this.userInfo = e;
				let communInfo = {
					name: this.communityInfo.name,
					houseNo: this.communityInfo.houseNo,
					roomNo: this.communityInfo.roomNo
				}
				if(this.roomInfo.billStatus != 5){
					uni.navigateTo({
						url: "../billRecord/billRecord?userInfo=" + JSON.stringify(e) + '&commInfo=' + JSON.stringify(communInfo) +
							'&roomId=' + this.roomId
					})
				}
			},
			addRenter() {
				console.log('你打')
				let communInfo = {
					name: this.communityInfo.name,
					houseNo: this.communityInfo.houseNo,
					roomNo: this.communityInfo.roomNo
				}
				uni.navigateTo({
					url: '../addRenter/addRenter?roomId=' + this.roomId + '&commInfo=' + JSON.stringify(communInfo)
				})
			}

		}
	}
</script>

<style scoped>
	.section1 {
		padding: 23rpx 39rpx 26rpx 41rpx;
	}

	.sectionBorderBottom {
		border-bottom: 3px solid #FAFAFA;
	}

	.houseName {
		font-weight: bold;
		font-size: 32rpx;
		margin-bottom: 35rpx;
	}

	.houseDetail {
		color: #999999;
		font-size: 28rpx;
		font-weight: 500;
		padding-left: 19rpx;
		position: relative;
	}

	.houseArrow {
		position: absolute;
		width: 30rpx;
		height: 56rpx;
		right: 0;
		top: calc(50% - 28rpx);
	}

	.detailTop {
		display: flex;
		align-items: center;
		margin-bottom: 35rpx;
	}

	.houseDetail .houseNum {
		font-size: 32rpx;
		font-weight: bold;
		color: #333333;
		margin-right: 17rpx;
	}

	.iconBar {
		margin-left: 17rpx;
	}

	.detailBottom {
		color: #666666;
		font-size: 32rpx;
		display: flex;
		align-items: baseline;
	}

	.showRecord {
		height: 45rpx;
		width: 160rpx;
		text-align: center;
		line-height: 45rpx;
		font-size: 28rpx;
		color: #EB5E61;
		background-color: #FFECEC;
		border-radius: 23rpx;
		margin-left: 35rpx;
		position: relative;
		z-index: 9;
	}

	.section2 {
		padding: 40rpx 40rpx 6rpx 40rpx;
	}

	.itemBar {
		margin-bottom: 35rpx;
	}

	.facilityBox {
		display: flex;
		flex-wrap: wrap;
	}

	.facilityItem {
		width: calc(100% / 5);
		margin-bottom: 54rpx;
	}

	.section3 {
		padding: 32rpx 0;
		width: calc(100% - 80rpx);
		margin-left: 40rpx;
		border-bottom: 3rpx solid #FAFAFA;
	}

	.addRenterBox {
		height: 68rpx;
		width: fit-content;
		margin: 300rpx auto 0 auto;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.addRenter ,.invite,.inviteCancel,.inviteAgain{
		width: 212rpx;
		height: 100%;
		border-radius: 18rpx;
		line-height: 68rpx;
		text-align: center;
		font-size: 32rpx;
	}
	.invite{
		background-color: #FFA044;
		color: #FFFFFF;
	}
	.addRenter {
		border: 2rpx solid #FFA044;
		color: #FFA044;
		margin-right: 58rpx;
	}


	.renterTitle {
		width: 100%;
		padding: 30rpx 0 30rpx 40rpx;
		border-bottom: 1rpx solid #FAFAFA;
		font-weight: bold;
		font-size: 32rpx;
	}


	.addRenterBox1 {
		color: #BBBBBB;
		font-size: 28rpx;
		width: fit-content;
		height: fit-content;
		margin: 170rpx auto 0 auto;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.noRenter {
		width: 214rpx;
		height: 152rpx;
		margin: 0 auto 48rpx auto;
	}

	.operationBox{
		position: fixed;
		bottom: 0;
		left: 0;
		box-shadow:0px -5rpx 16rpx 0px rgba(0, 0, 0, 0.04);
		height: 128rpx;
		width: 100%;
		padding: 22rpx 40rpx 20rpx 100rpx;
		font-size: 28rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}
	.rentBtnBox{
		width: fit-content;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-items: center;
		margin-right: 84rpx;
	}
	.inviteBind{
		width:317rpx;
		height:92rpx;
		line-height: 92rpx;
		text-align: center;
		background:linear-gradient(-90deg,rgba(234,185,93,1) 0%,rgba(228,158,84,1) 100%);
		border-radius:18rpx;
		font-size: 34rpx;
		color: #FFFFFF;
		margin-left: auto;
	}
	.rentBtnBox image{
		width: 42rpx;
		height: 42rpx;
	}
	/* .operationBtn{
		width:112rpx;
		height:56rpx;
		text-align: center;
		line-height: 56rpx;
		border-radius:10rpx;
		font-size: 30rpx;
	}
	.endRenting{
		border:1rpx solid #FFA044;
		color: #FFA044;
	}
	.keepRenting{
		border:1rpx solid #999999;
		color: #999999;
		margin-right: 20rpx;
	} */
</style>
