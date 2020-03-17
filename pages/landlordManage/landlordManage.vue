<template>
	<view class="landlordManage">
		<scroll-view scroll-y="true" class="indexes" scroll-with-animation :scroll-into-view="'myItem'+curItem"
		 enable-back-to-top>
			<view class="landlordItem" v-for="(item,index) in landlordList" :key="index" :id="'myItem'+item.type">
				<view class="landlordLi" v-for="(p,idx) in item.data" :key="idx" @click="showLandlordInfo(p.id)">
					<view class="itemTip" v-show="p.overdueDays > 0">账单逾期</view>
					<!-- <view class="itemTip" v-if="p.overdueDays < 0">{{ p.overdueDays }}天后交租</view> -->
					<view class="itemTip" v-show="p.overdueDays == 0">当天交租</view>
					<view class="fullName">
						<view class="surnName">{{item.type ? p.surnName : '#'}}</view>
						<view class="lastNmae">{{item.type ? p.lastName : p.ownerName}}</view>
					</view>
					<view class="local">{{p.house.roomList[0].communityName}}-{{p.house.buildingNo}}号{{p.house.houseNo}}</view>
					<view class="local">租期：{{p.startDate}} ~ {{p.endDate}}</view>
				</view>
			</view>
		</scroll-view>
		<view class="sideBar">
			<view class="sideWord" :class="{active : curIndex == index}" v-for="(item,index) in wordList" :key="index" :id="index"
			 @touchstart="getCur" @touchend="setCur">{{item}}</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations,

	} from 'vuex';
	export default {
		data() {
			return {
				boxTop: '',
				barTop: '',
				curIndex: null,
				curItem: 'A',
				landlordList: [],
				wordList: []
			}
		},
		computed: {
			...mapState(['landladyInfo'])
		},
		onLoad() {
			this.getLandlordList()
			for (let i = 0; i < 26; i++) {
				this.wordList[i] = String.fromCharCode(65 + i);
			}
			this.wordList.push('#')
		},
		methods: {
			//获取文字信息
			getCur(e) {
				this.curIndex = e.target.id;
				this.curItem = this.wordList[e.target.id] == '#' ? '' : this.wordList[e.target.id];
			},
			setCur(e) {
				this.curItem = this.curItem
			},
			showLandlordInfo(ownerId, houseId) {
				uni.navigateTo({
					url: "../billRecord/billRecord?ownerId=" + ownerId
				})
			},
			getLandlordList() {
				console.log('nihao')
				let _this = this;
				this.$request.post('/owner/ownerList', {
					id: this.landladyInfo.id
				}).then((res) => {
					console.log(res)
					res.data.data.forEach((item) => {
						item.startDate = item.startDate.split(' ')[0];
						item.endDate = item.endDate.split(' ')[0];
						item.surnName = item.ownerName.substr(0, 1);
						item.lastName = item.ownerName.substr(1);
					})
					const group = function(arr = [], key) {
						return key ? arr.reduce((t, v) => (!t[v[key]] && (t[v[key]] = []), t[v[key]].push(v), t), {}) : {};
					}
					const myArr = group(res.data.data, "firstWord")
					let temp, temp1
					for (let key in myArr) {
						console.log('dsdsadasd', key)
						if (key) {
							temp = {
								type: key,
								data: myArr[key]
							}
						} else {
							temp1 = {
								type: key,
								data: myArr[key]
							}
						}
						if (typeof temp != 'undefined') {
							_this.landlordList.push(temp)
						}
					}
					_this.landlordList.push(temp1)
					console.log(_this.landlordList)
				})
			},
			chooseWord(item, index) {
				item = item == '#' ? '' : item;
				this.curItem = 'myItem' + item;
				this.curIndex = index;
			}
		}
	}
</script>

<style scoped>
	.landlordManage {
		min-height: 100vh;
		height: 100%;
		width: 100%;
		background-color: #FAFAFA;
		padding: 20rpx 0;
	}

	scroll-view {
		height: 100vh;
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
		padding: 20rpx 0 14rpx 0;
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
		padding: 0 0 8rpx 78rpx;
	}

	.itemTip {
		position: absolute;
		top: 74rpx;
		right: 48rpx;
		padding: 4rpx 24rpx;
		color: #EB5E61;
		font-size: 24rpx;
		border-radius: 20rpx;
		background-color: #FFECEC;

	}

	.sideBar {
		width: 48rpx;
		font-family: Helvetica Neue, Helvetica, sans-serif;
		height: fit-content;
		display: flex;
		flex-direction: column;
		justify-content: ;
		align-items: center;
		color: #555555;
		font-size: 20rpx;
		font-weight: bold;
		position: fixed;
		top: 50%;
		right: 14rpx;
		transform: translateY(-50%);
		font-family: PingFang SC;
	}

	.sideWord {
		width: 100%;
		text-align: center;
		padding-bottom: 4rpx;
	}

	.active {
		background-color: #FFA344;
		border-radius: 50%;
		color: #FFFFFF;
		width: 32rpx;
		height: 32rpx;
		line-height: 32rpx;
	}
</style>
