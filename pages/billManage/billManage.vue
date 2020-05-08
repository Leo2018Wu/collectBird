<template>
	<view class="billManage">
		<view class="amountMsg">
			<view class="background"></view>
			<view class="houseTotalMsg">
				<view class="leftMsg">
					<view class="leftMsgTitle">{{para.billType == 0 ? '未收金额' : '收入金额'}}</view>
					<view class="leftMsgValue">{{ unIncome | thousandsPoints}}</view>
				</view>
				<view class="line"></view>
				<view class="rightMsg">
					<view class="rightMsgTitle">{{para.billType == 0 ? '已收金额' : '支出金额'}}</view>
					<view class="rightMsgValue"><span v-if="para.billType == 1 && income != 0">-</span>{{ income | thousandsPoints}}</view>
				</view>
			</view>
		</view>
		<view class="billBar" :class="{needBottom:currentIndex == 2 && para.billType == 1}">
			<view class="billBaritem" @click="changeIndex(index)" v-for="(item, index) in arr" :key="index" :class="{ active: currentIndex == index }">{{ item }}</view>
		</view>
		<view class="billList">
			<mescroll-uni :down="downOption" @down="downCallback" :up="upOption" @up="upCallback" :fixed="false" @init="init" v-on:emptyclick="emptyclick">
				<view  v-if="para.billType == 1 && currentIndex == 2">
					<view class="aaa" v-for="(item,index) in billListInfo" :key="index">
						<view class="liShowDate">{{item[0].showDate[1]}}月{{item[0].showDate[2]}}日</view>
						<view class="flowLi" v-for="(p, idx) in item" :key="idx" @click="showDetail(p.id)">
							<view class="liIcon" :class="{liIcon1:p.accType == 2}">
								<image :src="'../../static/billFlowIcon0'+p.conType+'.png'" mode="aspectFit"></image>
							</view>
							<view class="liRight">
								<view class="liName">{{p.billName}}</view>
								<view>{{p.accType == "1" ? '+' : '-' }}{{p.amount}}</view>
							</view>
						</view>
					</view>
				</view>
				<view v-if="!(para.billType == 1 && currentIndex == 2)">
					<view v-for="(item, idx) in billListInfo" :key="idx" @click="showBill(item)">
						<view class="myBillItem">
							<view class="itemFlex itemTop">
								<view class="myBillName">{{item.billStatus == 5 ? '退租账单' : "租金账单"}}</view>
								<view class="topRight">￥<span v-if="(item.billStatus == 5 || para.billType == 1) && item.totalAmount != 0">-</span>{{ item.totalAmount | thousandsPoints}}<span class="reminder" v-if="item.depositAmount && item.sortNo == 1">(含押金)</span></view>
							</view>
							<view class="itemFlex itemMiddle">
								<view class="myBillDate">{{ item.payRentDate }}</view>
								<view class="myOverDueNum" v-if="item.billStatus != 4">
									<span v-if="item.overdueDays > 0">逾期{{ item.overdueDays }}天</span>
									<span v-if="item.overdueDays < 0">{{ -item.overdueDays }}天后交租</span>
									<span v-if="item.overdueDays == 0">当天交租</span>
								</view>
							</view>
							<view class="itemBottom itemFlex">
								<view v-if="para.billType == 0" class="bottomNo textOverFlow">{{ item.roomNo }}</view>
								<view v-if="para.billType == 1" class="bottomNo textOverFlow">{{ item.communityName }}-{{item.houseNo}}</view>
								<view v-if="para.billType == 0" class="bottomName textOverFlow">{{item.tenantName}}</view>
								<view v-if="para.billType == 1" class="bottomName textOverFlow">{{item.ownerName}}</view>
							</view>
						</view>
					</view>
				</view>
			</mescroll-uni>
		</view>
		<image v-if="currentIndex == 2 && para.billType == 1" @click="bookBill" class="bookBtn" src="../../static/bookBtn.png" mode="aspectFit"></image>
	</view>
</template>

<script>
	import { thousandsPoints } from '../../util/index.js'
	import MescrollEmpty from '@/components/mescroll-uni/components/mescroll-empty.vue';
	import MescrollUni from '../../components/mescroll-uni/mescroll-uni.vue';
	export default {
		name: 'billManage',
		components: {
			MescrollUni,
			MescrollEmpty
		},
		data() {
			return {
				flowType:[
					{name:'租金',num:1},
					{name:'租金',num:2},
					{name:'租金',num:3},
					{name:'押金',num:4},
					{name:'电费',num:5},
					{name:'公摊电费',num:6},
					{name:'水费',num:7},
					{name:'网费',num:8},
					{name:'装修',num:9},
					{name:'维修',num:10},
					{name:'家电',num:11},
					{name:'中介费',num:12},
					{name:'推广费',num:13},
					{name:'工资',num:14},
					{name:'定金',num:15},
					{name:'物业费',num:16},
					{name:'停车费',num:17},
					{name:'退租',num:18},
					{name:'其他',num:99},
				],
				billListInfo: [],
				billStatus: '3', // 默认展示已逾期
				userId: '',
				// arr: ['已逾期', '未收款', '已收款', '全部'],
				currentIndex: 0,
				// isActive: true, //判断是否选中
				unIncome: 0,
				income: 0,
				mescroll: {},
				para: {
					landlordId: '',
					pageNum: 1,
					billStatus: '3',
					billType: 0,
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
						tip: '暂无相关数据',
					}
				}
			};
		},
		computed: {
			arr() {
				let list = this.para.billType == 0 ? ['已逾期', '未收款', '已收款', '全部'] : ['已逾期', '未付款', '明细'];
				return list
			},
		},
		onShow() {
			this.getMoney();
		},
		onLoad(options) {
			this.para.billType = options.billType
			if (options.billType == 1) {
				uni.setNavigationBarTitle({
					title: '账单'
				})
			}
		},
		methods: {
			showDetail(id){
				uni.navigateTo({
					url:'../postDetail/postDetail?id='+id
				})
			},
			bookBill(){
				uni.navigateTo({
					url:'../addPosting/addPosting'
				})
			},
			emptyclick(){
				uni.navigateTo({
					url: '../helpDetail/helpDetail?title=' + '如何查看账单？' + '&index=' + 3 + '&idx=' + 0
				})
			},
			updateData() {
				this.downCallback(this.mescroll);
			},
			getMoney() {
				let _this = this;
				if(this.para.billType == 0){
					_this.$request
						.post('/bill/money', {
							id: this.$store.state.landladyInfo.id,
							billType: this.para.billType
						})
						.then(res => {
							_this.unIncome = res.data.data.unIncome;
							_this.income = res.data.data.income;
						})
						.catch(err => {
						});
				}else{
					_this.$request
						.post('/account/money', {
							landlordId: this.$store.state.landladyInfo.id
						})
						.then(res => {
							_this.unIncome = res.data.data.incomeAmount;
							_this.income = res.data.data.expendAmount;
						})
						.catch(err => {
						});
				}
				
			},
			changeIndex(index) {
				this.currentIndex = index;
				switch (index) {
					case 0:
						this.billStatus = '3';
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
				if(item.billStatus == 5){
					uni.navigateTo({
						url:'../endRenting/endRenting?billId='+item.id+'&houseAddr='+item.roomNo
					})
				}else{
					if (item.billType == 0) {
						uni.navigateTo({
							url: '../billDetail/billDetail?billId=' + item.id + '&tenantId=' + item.tenantId + '&billType=' + item.billType
						});
					} else if (item.billType == 1) {
						uni.navigateTo({
							url: '../billDetail/billDetail?billId=' + item.id + '&ownerId=' + item.ownerId + '&billType=' + item.billType
						});
					}
				}
			},
			init(e) {
				this.mescroll = e;
			},
			Group(arr = [], key) {
			    return key ? arr.reduce((t, v) => (!t[v[key]] && (t[v[key]] = []), t[v[key]].push(v), t), {}) : {};
			},
			async getBillList(pageNum, billStatus) {
				let _this = this;
				if(this.currentIndex == 2 && this.para.billType == 1){
					try {
						const response = await _this.$request.post('/account/findList', {landlordId:_this.$store.state.landladyInfo.id,pageNum,pageSize:20});
						let arr = []
						if(response.data.data.list.length !=0){
							response.data.data.list.map((item) =>{
								item.tempDate = item.accTime.split(" ")[0]
								item.showDate = item.accTime.split(" ")[0].split("-")
								item.billName = _this.flowType.filter(p=>p.num == item.conType)[0].name
								item.amount = thousandsPoints(item.amount)
							})
							response.data.data.list = _this.Group(response.data.data.list,"tempDate")
							for(let key in response.data.data.list){
								arr.push(response.data.data.list[key])
							}
						}
						return arr;
					} catch (e) {
						console.log(e);
					}
				}else{
					_this.para.pageNum = pageNum;
					_this.para.landlordId = _this.$store.state.landladyInfo.id;
					_this.para.billStatus = this.billStatus;
					try {
						const response = await _this.$request.post('/bill/billList', _this.para);
						if(response.data.data.list.length !=0){
							response.data.data.list.map((item) =>{
								item.payRentDate = item.payRentDate.substr(0,10)
							})
						}
						return response.data.data.list;
					} catch (e) {
						console.log(e);
					}
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
				console.log(res)
				_this.billListInfo = _this.billListInfo.concat(curPageData); //追加新数据
				console.log(_this.billListInfo)
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
		padding: 24rpx 32rpx 20rpx 32rpx;
		background-color: #FFFFFF;
		border-radius: 12rpx;
		font-size: 28rpx;
	}

	.itemFlex {
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

	.itemMiddle {
		padding-bottom: 12rpx;
		border-bottom: 1rpx solid #EBEBEB;
	}

	.myBillName {
		color: #3333333;
		font-size: 32rpx;
		font-weight: bold;
		margin-bottom: 10rpx;
	}

	.myBillDate {
		font-size: 30rpx;
		color: #999999;
	}

	.topLeft {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.topLeft:last-of-type {
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

	.bottomNo {
		max-width: 450rpx;
	}
	.bottomName{
		max-width: 180rpx;
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
		width: 2rpx;
		background-color: rgba(190, 190, 190, 1);
		transform: scaleX(0.5);
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
		padding-bottom: 120rpx;
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
	.flowLi{
		width: 100%;
		height: 110rpx;
		padding: 0 30rpx;
		display: flex;
		align-items: center;
		background-color: #FFFFFF;
		font-size: 30rpx;
		color: #333333;
	}
	.liRight{
		width: calc(100% - 100rpx);
		height: 100%;
		display: flex;
		align-items: center;
		border-bottom: 1rpx solid #F5F5F5;
	}
	.liIcon{
		width: 70rpx;
		height: 70rpx;
		background-color: #5396FF;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 30rpx;
	}
	.liIcon1{
		background-color: #EB5E61;
	}
	.liIcon image{
		width: 46rpx;
		height: 46rpx;
	}
	.liName{
		margin-right: auto;
	}
	.liShowDate{
		background-color: #FFFFFF;
		padding: 42rpx 30rpx 22rpx 30rpx;
		color: #9A9A9A;
		font-size: 26rpx;
		border-bottom: 1rpx solid #F5F5F5;
	}
	.needBottom{
		border-bottom: 1rpx solid #F5F5F5;
	}
	.aaa .flowLi:last-of-type{
		border-bottom: 0;
	}
	.bookBtn{
		width: 146rpx;
		height: 146rpx;
		position: fixed;
		bottom: 194rpx;
		right: 0rpx;
	}
</style>
