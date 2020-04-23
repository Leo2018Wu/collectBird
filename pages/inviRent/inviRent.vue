<template>
	<view class="renterManage">
		<view class="header">
			<view class="headBar">
				<view class="headBarItem">
					招租房间
					<span>{{ rentingNum ? rentingNum : 0 }}</span>
				</view>
				<view class="headBarItemLine"></view>
				<view class="headBarItem">
					闲置房间
					<span>{{ freeNum ? freeNum : 0 }}</span>
				</view>
			</view>
		</view>
		<view class="emptyList" v-if="renterList.length == 0 && loadEnd">
			<image class="noRenterIcon" src="../../static/houseEmpty.png" mode="aspectFit"></image>
			<view>
				暂无招租房源
			</view>
		</view>
		<view v-else class="section" :class="{ secFirst: index == 0 }" v-for="(item, index) in renterList" :key="index">
			<view class="sectionBar" @click="showRenterList(index)">
				<span :class="[isShow && currentIndex == index ? 'tips1' : 'tips0']"></span>
				<view class="secName">{{ item.communityName }}</view>
			</view>
			<view class="renterListBox" :class="{ active: isShow && currentIndex == index }">
				<view class="houseLi" v-for="(p, idx) in item.houseList" :key="idx">
					<view class="content">
						<view class="liNumber"  @click="toEditHouse(p.id,item.communityId,item.communityName)">
							<view class="liTop">
								<span>{{p.buildingNo}}</span>
								号
								<span>{{p.houseNo}}</span>
							</view>
						</view>
						<scroll-view class="roomScroll" scroll-x="true">
							<view
								class="roomItem"
								:class="{freeItem:ele.rentStatus == 0}"
								v-for="(ele, iddx) in p.roomList"
								:key="iddx"
								@click="goRoom(p,ele,item.communityName,item.communityId)"
							>
								<view class="roomItemLi">
									<view>
										卧
										<span class="roomNo">{{ele.roomNo}}</span>
									</view>
									<span>{{ele.rentStatus == 0 ? '闲置' : '招租中' }}</span>
								</view>
							</view>
						</scroll-view>
					</view>
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
			rentingNum: '',
			freeNum: '',
			loadEnd: false
		};
	},
	onLoad() {},
	onShow() {
		let landordId = this.$store.state.landladyInfo.id;
		this.getRenterList(landordId);
		this.getTopNum(landordId);
	},
	methods: {
		goRoom(house,room,communityName,communityId) {
			let communityInfo = {}
			communityInfo.name = communityName
			communityInfo.houseNo = house.houseNo
			communityInfo.bedroomNum = house.bedroomNum
			communityInfo.livingroomNum = house.livingroomNum
			communityInfo.toiletNum = house.toiletNum
			communityInfo.roomNo = room.roomNo
			communityInfo.roomPrice = room.roomPrice
			uni.navigateTo({
				url: '../renter/renter?id=' + room.id + '&communityInfo=' + JSON.stringify(communityInfo) + '&houseId=' + house.id +
					'&communityId=' + communityId+'&tenantId='+room.tenantId
			})
		},
		toEditHouse(id,communityId,communityName) {
			uni.navigateTo({
				url: '../addRoomNum/addRoomNum?communityName=' + communityName + '&communityId=' + communityId +
					'&houseId=' + id
			})
		},
		showHelp() {
			uni.navigateTo({
				url: '../helpDetail/helpDetail?title=' + '如何添加租客？' + '&index=' + 1 + '&idx=' + 0
			});
		},
		getTopNum(id) {
			this.$request
				.post('/user/getRoomNum', {
					id
				})
				.then(res => {
					this.rentingNum = res.data.data.letNum;
					this.freeNum = res.data.data.idleNum;
				});
		},
		goRenter(item, name, tenantId) {
			console.log(item);
			let communityInfo = {};
			communityInfo.name = name;
			communityInfo.houseNo = item.map.houseNo;
			communityInfo.bedroomNum = item.map.bedroomNum;
			communityInfo.livingroomNum = item.map.livingroomNum;
			communityInfo.toiletNum = item.map.toiletNum;
			communityInfo.roomNo = item.map.roomNo;
			communityInfo.roomPrice = item.map.roomPrice;
			let id = item.map.roomId;
			uni.navigateTo({
				url: '../renter/renter?id=' + id + '&communityInfo=' + JSON.stringify(communityInfo) + '&houseId=' + item.map.houseId + '&tenantId=' + tenantId
			});
		},
		getRenterList(id) {
			console.log(id);
			this.$request
				.post('/room/findByRentStatus', {
					landlordId:id,
					 "rentStatus": "02" 
				})
				.then(res => {
					this.loadEnd = true;
					res.data.data.forEach((item) =>{
						item.houseList = item.houseList.filter(p => p.roomList.length != 0)
					})
					this.renterList = res.data.data;
				});
		},
		showRenterList(index) {
			this.currentIndex = index;
			this.isShow = !this.isShow;
		}
	}
};
</script>

<style scoped>
.renterManage {
	width: 100%;
	height: 100%;
	min-height: 100vh;
	background-color: #fafafa;
}

.header {
	width: 100%;
	height: 81rpx;
	background-color: #f09a42;
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
	background-color: #ffffff;
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
	border-top: 2rpx solid #ebebeb80;
	display: flex;
	align-items: center;
	justify-content: flex-start;
}

.active {
	display: block;
}

.tips0 {
	content: '';
	width: 0;
	height: 0;
	position: absolute;
	right: 0;
	border-top: 0;
	border-bottom: 12rpx solid #dbdbdb;
	border-left: 12rpx solid transparent;
	border-right: 12rpx solid transparent;
}

.tips1 {
	content: '';
	width: 0;
	height: 0;
	position: absolute;
	right: 0;
	border-top: 0;
	transform: rotate(-180deg);
	border-bottom: 12rpx solid #dbdbdb;
	border-left: 12rpx solid transparent;
	border-right: 12rpx solid transparent;
}

.secName {
	margin-right: auto;
	font-size: 32rpx;
}

.renters {
	color: #ffa344;
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

.rightArr {
	width: 30rpx;
	height: 28rpx;
}

.overDue {
	background-color: #ffecec;
	border-radius: 20rpx;
	height: 40rpx;
	width: fit-content;
	padding: 0 12rpx;
	text-align: center;
	line-height: 40rpx;
	margin-right: 15rpx;
	font-size: 24rpx;
	color: #eb5e61;
}
.emptyList {
	padding-top: 290rpx;
	text-align: center;
	color: #bbbbbb;
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
	background-color: #bbbbbb;
	bottom: 0;
	left: 0;
}
.noRenterIcon {
	width: 136rpx;
	height: 190rpx;
	margin: 0 auto 14rpx auto;
}
.houseLi {
	width: 100%;
	height: 100%;
	background-color: #ffffff;
	padding: 26rpx 0 33rpx 0;
	display: flex;
	position: relative;
	border-top: 1rpx solid #EBEBEB;
}

.tips {
	position: absolute;
	right: 0;
	top: 0;
	width: 66rpx;
	height: 30rpx;
	line-height: 30rpx;
	border-radius: 5rpx 0 5rpx 5rpx;
	color: #ffffff;
	font-size: 22rpx;
	background-color: #ffa344;
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
	background-color: #ffa344;
	color: #ffffff;
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
	color: #FFFFFF;
	white-space: nowrap;
}

.roomItem {
	width: 116rpx;
	height: 116rpx;
	border-radius: 5rpx;
	background-color: #e7f0ff;
	color: #5396ff;
	font-size: 28rpx;
	display: inline-block;
	margin-right: 24rpx;
}

.roomItemLi {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	align-items: center;
}
.addLi {
	justify-content: center;
}

.roomItem .roomNo {
	font-weight: bold;
	font-size: 32rpx;
}

.roomItem:last-of-type {
	margin-right: unset;
}
.freeItem {
	background-color: #cfcfcf;
	color: #ffffff;
}
</style>
