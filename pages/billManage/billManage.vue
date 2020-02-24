<template>
	<view class="billManage">
		<view class="amountMsg">
			<view class="background"></view>
			<view class="houseTotalMsg">
				<view class="leftMsg">
					<view class="leftMsgTitle">未收金额</view>
					<view class="leftMsgValue">{{ unIncome | thousandsPoints}}</view>
				</view>
				<view class="line"></view>
				<view class="rightMsg">
					<view class="rightMsgTitle">已收金额</view>
					<view class="rightMsgValue">{{ income | thousandsPoints}}</view>
				</view>
			</view>
		</view>
		<view class="billBar">
			<view class="billBaritem" @click="changeIndex(index)" v-for="(item, index) in arr" :key="index" :class="{ active: currentIndex == index }">{{ item }}</view>
		</view>
		<view class="billList">
			<mescroll-uni :down="downOption" @down="downCallback" :up="upOption" @up="upCallback" :fixed="false" @init="init">
				<view v-for="(item, idx) in selectList" :key="idx" @click="showBill(item)">
					<view class="myBillItem">
						<view class="itemFlex itemTop">
							<view class="myBillName">租金账单</view>
							<view class="topRight">￥{{ item.totalAmount | thousandsPoints}}<span class="reminder"
								 v-if="item.depositAmount">(含押金)</span></view>
						</view>
						<view class="itemFlex itemMiddle">
							<view class="myBillDate">{{ item.payRentDate.substr(0, 10) }}</view>
							<view class="myOverDueNum" v-if="currentIndex != 3 && currentIndex != 2">
								<span v-if="currentIndex == 0">逾期{{ item.overdueDays }}天</span>
								<span v-if="currentIndex == 1 && item.overdueDays < 0">{{ -item.overdueDays }}天后交租</span>
								<span v-if="currentIndex == 1 && item.overdueDays == 0">当天交租</span>
							</view>
							<view class="myOverDueNum" v-if="currentIndex == 3 && item.billStatus != 4">
								<span v-if="item.overdueDays > 0">逾期{{ item.overdueDays }}天</span>
								<span v-if="item.overdueDays < 0">{{ -item.overdueDays }}天后交租</span>
								<span v-if="item.overdueDays == 0">当天交租</span>
							</view>
						</view>
						<view class="itemBottom itemFlex">
							<view class="bottomNo">{{ item.roomNo }}</view>
							<view class="bottomName">{{item.tenantName}}</view>
						</view>
							<!-- <view class="topLeft">
								<view class="myBillName">租金账单</view>
								<view class="myBillDate">{{ item.payRentDate.substr(0, 10) }}</view>
							</view>
							<view class="topLeft">
								<view class="topRight" :class="{ bule:  item.billStatus == 4 }">{{ item.totalAmount }}<span class="reminder"
									 v-if="item.depositAmount">(含押金)</span></view>
								<view class="myOverDueNum" v-if="currentIndex != 3">
									<span v-if="currentIndex == 0">逾期{{ item.overdueDays }}天</span>
									<span v-if="currentIndex == 1 && item.overdueDays < 0">{{ -item.overdueDays }}天后交租</span>
									<span v-if="currentIndex == 1 && item.overdueDays == 0">当天交租</span>
								</view>
								<view class="myOverDueNum" v-if="currentIndex == 3 && item.billStatus != 4">
									<span v-if="item.overdueDays > 0">逾期{{ item.overdueDays }}天</span>
									<span v-if="item.overdueDays < 0">{{ -item.overdueDays }}天后交租</span>
									<span v-if="item.overdueDays == 0">当天交租</span>
								</view>
							</view> -->
					</view>
				</view>

			</mescroll-uni>
		</view>
	</view>
</template>

<script>
	import MescrollUni from '../../components/mescroll-uni/mescroll-uni.vue';
	export default {
		name: 'billManage',
		components: {
			MescrollUni
		},
		data() {
			return {
				billListInfo: [],
				// billStatus: '3', // 默认展示已逾期
				billStatus: '0', // 默认展示已逾期
				userId: '',
				arr: ['已逾期', '未收款', '已收款', '全部'],
				currentIndex: 0,
				// isActive: true, //判断是否选中
				unIncome: 0,
				income: 0,
				mescroll: {},
				para: {
					landlordId: '',
					pageNum: 1,
					billStatus: '3'
				},
				countTotal: '',
				// 下拉刷新的常用配置
				downOption: {
					use: true, // 是否启用下拉刷新; 默认true
					auto: true // 是否在初始化完毕之后自动执行下拉刷新的回调; 默认true
				},
				// 上拉加载的常用配置
				upOption: {
					use: true, // 是否启用上拉加载; 默认true
					auto: true, // 是否在初始化完毕之后自动执行上拉加载的回调; 默认true
					page: {
						num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
						size: 10 // 每页数据的数量,默认10
					},
					noMoreSize: 5, // 配置列表的总数量要大于等于5条才显示'-- END --'的提示
					empty: {
						use: true,
						tip: '暂无相关数据'
					}
				}
			};
		},
		computed: {
			selectList() {
				const overdueList = function(item) {
					return item.overdueDays > 0
				}
				const normalList = function(item) {
					return item.overdueDays <= 0
				}
				const fullList = function(item) {
					return item
				}
				let par = this.currentIndex == 0 ? overdueList : (this.currentIndex == 1 ? normalList : fullList)
				let arr = this.billListInfo.filter(par)
				return arr
			}
		},
		onLoad() {
			this.getMoney();
		},
		methods: {
			updateData() {
				console.log('wwww');
				this.downCallback(this.mescroll);
			},
			getMoney() {
				let _this = this;
				_this.$request
					.post('/bill/money', {
						id: this.$store.state.landladyInfo.id
					})
					.then(res => {
						console.log(res);
						_this.unIncome = res.data.data.unIncome;
						_this.income = res.data.data.income;
					})
					.catch(err => {
						console.log(err);
					});
			},
			changeIndex(index) {
				console.log(index);
				this.currentIndex = index;
				switch (index) {
					case 0:
						// this.billStatus = '3';
						this.billStatus = '0';
						this.downCallback(this.mescroll);
						break;
					case 1:
						this.billStatus = '0';
						this.downCallback(this.mescroll);
						break;
					case 2:
						this.billStatus = '4';
						this.downCallback(this.mescroll);
						break;
					case 3:
						this.billStatus = '';
						this.downCallback(this.mescroll);
						break;
					default:
						break;
				}
			},
			showBill(item) {
				console.log(item);
				uni.navigateTo({
					url: '../billDetail/billDetail?billId=' + item.id + '&tenantId=' + item.tenantId
				});
			},
			init(e) {
				this.mescroll = e;
			},
			async getBillList(pageNum, billStatus) {
				let _this = this;
				_this.para.pageNum = pageNum;
				_this.para.landlordId = _this.$store.state.landladyInfo.id;
				_this.para.billStatus = this.billStatus;
				console.log(_this.para);
				try {
					const response = await _this.$request.post('/bill/billList', _this.para);
					let arr = [];
					console.log(response.data.data);
					if (response.data.data.length > 0) {
						response.data.data.forEach((item, index) => {
							if (item.communityImgs == null) {
								item.communityImgs = [];
								item.communityImgs.push(
									'https://funnyduck.raysler.com/uploadFile/huyue/article/images/20190704/1562239924231ZGZQuw.jpeg');
							} else {
								item.communityImgs = item.communityImgs.split(',');
							}
							arr.push(item);
						});
					}

					response.data.data.list = arr;
					return response.data.data;
				} catch (e) {
					console.log(e);
				}
			},

			/*下拉刷新的回调, 有三种处理方式: */
			downCallback(mescroll) {
				let _this = this;
				mescroll.resetUpScroll(); // 重置列表为第一页 (自动执行 page.num=1, 再触发upCallback方法 )
			},
			/*上拉加载的回调*/
			async upCallback(mescroll) {
				let _this = this;
				// 此时mescroll会携带page的参数:
				let pageNum = mescroll.num; // 页码, 默认从1开始
				let pageSize = mescroll.size; // 页长, 默认每页10条
				if (mescroll.num == 1) _this.billListInfo = []; //如果是第一页需手动置空列表
				let res = await _this.getBillList(pageNum, _this.billStatus);
				let curPageData = res;
				console.log(curPageData);
				_this.billListInfo = _this.billListInfo.concat(curPageData); //追加新数据
				console.log(_this.billListInfo);
				let arryNew = [];
				_this.billListInfo.map((item, index) => {
					let countTotal = parseInt(item.depositAmount) + parseInt(item.total);
					arryNew.push(Object.assign({}, item, {
						countTotal: countTotal
					}));
				});
				console.log(arryNew);
				_this.billListInfo = arryNew;
				_this.$nextTick(() => {
					mescroll.endSuccess(curPageData.length, res.hasNextPage);
				});
			}
		}
	};
</script>

<style>
	.billManage {
		height: 100%;
		min-height: 100vh;
		width: 100%;
		background-color: #fafafa;
	}

	.myBillItem {
		width: calc(100% - 60rpx);
		margin: 17rpx 0 17rpx 30rpx;
		height: fit-content;
		padding:24rpx 32rpx 20rpx 32rpx;
		background-color: #FFFFFF;
		border-radius: 12rpx;
		font-size: 28rpx;
	}
	.itemFlex{
		width: 100%;
		height: fit-content;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.itemTop {
		color: #333333;
		font-size: 34rpx;
		align-items: baseline;
	}
	.itemMiddle{
		padding-bottom: 12rpx;
		border-bottom: 1rpx solid #EBEBEB;
	}
	.myBillName {
		color: #3333333;
		font-size: 32rpx;
		font-weight: bold;
		margin-bottom: 10rpx;
	}
	.myBillDate{
		font-size: 30rpx;
		color: #999999;
	}
	.topLeft{
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	.topLeft:last-of-type{
		align-items: flex-end;
		margin-bottom: 10rpx;
	}
	.topRight {
		font-size: 36rpx;
		font-weight: bold;
		color: #333333;
		margin-bottom: 10rpx;
	}

	.itemBottom {
		font-size: 26rpx;
		color: #333333;
		margin-top: 10rpx;
	}
	.bottomNo{
		max-width: 450rpx;
	}

	.myOverDueNum {
		font-size: 22rpx;
		padding: 6rpx 12rpx;
		background-color: #EB5E61;
		color: #FFFFFF;
		border-radius: 5rpx;
		width: fit-content;
	}

	.amountMsg {
		background-color: #fff;
		position: relative;
		overflow: hidden;
		height: 218rpx;
	}

	.background {
		background-color: #f09a42;
		height: 102rpx;
	}

	.billBar {
		display: flex;
		justify-content: space-around;
		align-items: center;
		padding: 36rpx 30rpx 0rpx;
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(121, 121, 121, 1);
		text-align: center;
		background-color: #fff;
	}

	.houseTotalMsg {
		width: 690rpx;
		height: 175rpx;
		position: absolute;
		top: 35rpx;
		left: 30rpx;
		background-color: #fff;
		border-radius: 15rpx;
		display: flex;
		justify-content: space-between;
		box-shadow: 3px 5px 9px 1px rgba(225, 226, 226, 0.27);
	}

	.leftMsg {
		width: 48%;
		text-align: center;
		padding-top: 40rpx;
	}

	.leftMsgTitle {
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
	}

	.leftMsgValue {
		font-size: 55rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: rgba(255, 164, 73, 1);
	}

	.rightMsg {
		width: 48%;
		text-align: center;
		padding-top: 40rpx;
	}

	.rightMsgTitle {
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: 500;
	}

	.rightMsgValue {
		font-size: 55rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: rgba(255, 164, 73, 1);
	}

	.line {
		height: 61rpx;
		/* border: 1rpx solid rgba(190, 190, 190, 1); */
		width: 1rpx;
		background-color: rgba(190, 190, 190, 1);
		position: absolute;
		top: 57rpx;
		left: 50%;
	}

	.active {
		width: 141rpx;
		height: 60rpx;
		color: #f09a42;
		border-bottom: 4rpx solid #f09a42;
	}

	.billBaritem {
		width: 141rpx;
		height: 60rpx;
	}

	.billList {
		height: calc(100% - 200rpx);
		background-color: #fafafa;
	}

	.billListLeft {
		width: 60%;
	}

	.billListright {
		width: 40%;
		text-align: right;
	}

	.billListLeft {
		padding: 25rpx 0rpx 25rpx 34rpx;
	}

	.billListright {
		padding: 25rpx 34rpx 25rpx 0rpx;
	}

	.billListItem {
		height: calc(100%-280rpx);
		background-color: #fff;
		margin: 17rpx 30rpx 17rpx;
		display: flex;
		justify-content: space-between;
		border-radius: 12rpx;
		/* padding: 0rpx 34rpx; */
		margin-top: 17rpx;
	}

	.billDateText {
		font-size: 28rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: #444444;
	}

	.billDate {
		margin-top: 10rpx;
		font-size: 33rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #333333;
	}

	.billAdress {
		margin-top: 10rpx;
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #999999;

	}

	.billSum {
		font-size: 45rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: #eb5e61;
		width: 100%;
		display: flex;
		justify-content: flex-end;
		align-items: center;

	}

	.reminder {
		font-size: 26rpx;
		color: #999999;
		font-weight: normal;
	}

	.overdueNum {
		font-size: 26rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #eb5e61;
		margin-top: 30rpx;
	}
</style>
