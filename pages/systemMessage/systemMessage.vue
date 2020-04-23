<template>
	<view class="system">
		<view v-if="msgList.length != 0" :class="{myPadding:msgList.length == 0}"></view>
		<view v-if="loadEnd">
			<mescroll-empty v-if="msgList.length == 0 && messageType ==1" :option="optEmpty1"></mescroll-empty>
			<mescroll-empty v-if="msgList.length == 0 && messageType ==2" :option="optEmpty2"></mescroll-empty>
			<mescroll-empty v-if="msgList.length == 0 && messageType ==3" :option="optEmpty3"></mescroll-empty>
		</view>
		<mescroll-uni  :down="downOption" @down="downCallback" :up="upOption" @up="upCallback" :fixed="false" @init="init">
			<view v-if="messageType == 3">
				<view class="msgContainer" v-for="(item, index) in msgList" :key="index" @click="showDetail(item.messageContent,item.id,item.addresseeId)">
					<view class="dateDivide">{{item.showDate}}</view>
					<view class="messageBox whiteBg">
						<view class="tip">{{item.noticeType == 1 ? '更新' : (item.noticeType == 2 ? '活动' : '通知')}}</view>
						<view class="messageTitle">
							<view class="msgTitle">{{item.messageTitle}}</view>
							<view class="showDetailBtn">查看详情</view>
							<image class="inpArrow" src="../../static/right_arrow.png" mode="aspectFit"></image>
						</view>
						<view class="msgContent textOverFlow">
							{{item.messageContent}}
						</view>
					</view>
				</view>
			</view>
			<view v-if="messageType == 2">
				<view class="msgContainer" v-for="(item, index) in msgList" :key="index">
					<view class="dateDivide">{{item.showDate}}</view>
					<view class="messageBox2 whiteBg">
						<view style="padding: 0 26rpx;">
							<view class="msgTop">
								<view class="msgTopName">{{item.specialType == 1 ? '租客到期提醒' : '邀请入住提醒'}}</view>
								<view v-if="item.isRead == 0 && item.specialType != 2" class="msgTip" :class="[{status0 :item.messageData.remindType == 9}]">{{item.messageData.remindType == 2 ? '即将到期' : '已到期'}}</view>
								<view v-if="item.isRead == 1" class="msgTip status1" >已处理</view>
								<view v-if="item.isRead == 0" class="tenantBtn" @click="goRenter(item.id,item.addresseeId,item.messageData)">去处理</view>
								<view v-if="item.isRead != 0" class="tenantBtn" @click="goRenter(item.id,item.addresseeId,item.messageData)">{{item.specialType == 1 ? '去看看' : '去处理'}}</view>
								<image class="inpArrow" src="../../static/right_arrow.png" mode="aspectFit"></image>
							</view>
							<view v-if="item.specialType == 1" class="tenantLocation textOverFlow">{{item.messageData.roomNo}}</view>
							<view v-else class="tenantLocation textOverFlow">{{item.messageContent}}</view>
							<view class="rentCycle" v-if="item.specialType == 1">租期：{{item.messageData.startDate}} ~ {{item.messageData.endDate}}</view>
						</view>
					</view>
				</view>
			</view>
			<view v-if="messageType == 1">
				<view class="msgContainer" v-for="(item, index) in msgList" :key="index">
					<view class="dateDivide">{{item.showDate}}</view>
					<view class="messageBox1 whiteBg">
						<view style="padding: 0 26rpx;">
							<view class="msgTop">
								<view class="msgTopName">{{item.messageTitle}}</view>
								<view class="msgTip" :class="{grayTip : item.billStatus == 4}">{{item.billStatus == 4 ? '已确认' :'未确认'}}</view>
								<view class="msgPrice"><span>{{item.messageData.totalAmount}}</span>元</view>
							</view>
							<view class="billTime">{{item.dateForm[0]}}年{{item.dateForm[1]}}月{{item.dateForm[2]}}日生成</view>
							<view class="billLocation">{{item.messageData.tenantName}}-{{item.messageData.roomNo}}</view>
							<view class="rentCycle">收租周期：{{item.messageData.startDate}} ~ {{item.messageData.endDate}}</view>
						</view>
						<view v-if="item.billStatus != 4" class="operatBtn" @click="checkBill(item.addresseeId,item.id,item.messageData)">去确认</view>
						<view v-else class="operatBtn grayBtn">已确认</view>
					</view>
				</view>
			</view>
		</mescroll-uni>
		
	</view>
</template>

<script>
	import MescrollEmpty from '@/components/mescroll-uni/components/mescroll-empty.vue';
	import MescrollUni from '../../components/mescroll-uni/mescroll-uni.vue';
	import {
		dateDiff
	} from '../../util/index.js'
	export default {
		components: {
			MescrollUni,
			MescrollEmpty
		},
		data() {
			return {
				loadEnd:false,
				para: {
					addresseeId: "",
					pageNum: 1,

				},
				messageType: '', //1账单2租客3系统
				// 下拉刷新的常用配置
				downOption: {
					use: true, // 是否启用下拉刷新; 默认true
					auto: false // 是否在初始化完毕之后自动执行下拉刷新的回调; 默认true
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
						use: false,
						// icon:'/static/noBillMsg.png',
						// tip: '暂无账单消息'
					}
				},
				optEmpty1: {
					use: true,
					icon:'/static/noBillMsg.png',
					tip: '暂无账单消息'
				},
				optEmpty2: {
					use: true,
					icon:'/static/noRenterMsg.png',
					tip: '暂无租客消息'
				},
				optEmpty3: {
					use: true,
					icon:'/static/noSysMsg.png',
					tip: '暂无系统消息'
				},
				mescroll: {},
				msgList: [],
			}
		},
		onShow() {
			this.downCallback(this.mescroll);
		},
		onLoad(options) {
			this.messageType = options.messageType
			uni.setNavigationBarTitle({
				title: this.messageType == 1 ? '账单消息' : (this.messageType == 2 ? '租客消息' : '系统消息')
			})
		},
		methods: {
			checkBill(addresseeId,id,messageData){
				console.log(messageData)
				uni.navigateTo({
					url: '../billDetail/billDetail?billId=' + messageData.billId + '&tenantId=' + messageData.tenantId+'&messageId='+id+'&addresseeId='+addresseeId
				})
			},
			showDetail(content,id,addresseeId){
				uni.navigateTo({
					url:'../sysMsgDetail/sysMsgDetail?content='+content+'&addresseeId='+addresseeId+'&msgId='+id
				})
			},
			goRenter(id,addresseeId,data){
				console.log(data)
				let communityInfo = {}
				communityInfo.name = ''
				communityInfo.houseNo = ''
				communityInfo.bedroomNum = ''
				communityInfo.livingroomNum = ''
				communityInfo.toiletNum = ''
				communityInfo.roomNo = ''
				communityInfo.roomPrice = ''
				uni.navigateTo({
					url: '../renter/renter?id=' + data.roomId + '&communityInfo=' + JSON.stringify(communityInfo) + '&houseId=' + data.houseId+'&tenantId='+data.tenantId+'&addresseeId='+addresseeId+'&msgId='+id
				})
			},
			init(e) {
				this.mescroll = e;
			},
			/*下拉刷新的回调, 有三种处理方式: */
			downCallback(mescroll) {
				let _this = this;
				mescroll.resetUpScroll(); // 重置列表为第一页 (自动执行 page.num=1, 再触发upCallback方法 )
			},
			/*上拉加载的回调*/
			async upCallback(mescroll) {
				let _this = this;
				_this.loadEnd = false;
				// 此时mescroll会携带page的参数:
				let pageNum = mescroll.num; // 页码, 默认从1开始
				let pageSize = mescroll.size; // 页长, 默认每页10条
				if (mescroll.num == 1) _this.msgList = []; //如果是第一页需手动置空列表
				let res = await _this.getMessage(pageNum);
				console.log(res)
				let curPageData = res;
				_this.msgList = _this.msgList.concat(curPageData); //追加新数据
				_this.loadEnd = true
				if(res.length !=0){
					_this.$nextTick(() => {
						mescroll.endSuccess(curPageData.length, res[0].hasNextPage);
					});
				}else{
					_this.$nextTick(() => {
						mescroll.endSuccess(curPageData.length,false);
					});
				}
			},
			async getMessage(pageNum) {
				let _this = this;
				_this.para.pageNum = pageNum;
				_this.para.addresseeId = _this.$store.state.landladyInfo.id
				try {
					const response = await _this.$request.post('/userMessage/messageList', _this.para);
					let arr = [];
					let curArr = _this.messageType == 1 ? response.data.data.billList : (_this.messageType == 2 ? response.data.data
						.tenantList : response.data.data.systemList)
					curArr.list.forEach((item, index) => {
						item.messageData = JSON.parse(item.messageData)
						if(_this.messageType == 2 && item.specialType != 2){
							item.messageData.startDate = item.messageData.startDate.split('T')[0]
							item.messageData.endDate = item.messageData.endDate.split('T')[0]
						}
						if(_this.messageType == 1){
							item.dateForm = (item.createTime.split(" ")[0].toString()).split('-')
							item.messageData.startDate = item.messageData.startDate.split('T')[0]
							item.messageData.endDate = item.messageData.endDate.split('T')[0]
							console.log(item.messageData)
						}
						item.showDate = dateDiff(Date.parse(new Date((item.createTime).replace(/\-/g, '/'))))
						arr.push(item)
					})
					if(arr.length !=0){
						arr[0].hasNextPage = curArr.hasNextPage
					}
					return arr;
				} catch (e) {
					console.log(e);
				}
			},
		}
	}
</script>

<style scoped>
	.system {
		width: 100%;
		/* height: 100%; */
		min-height: 100vh;
		background-color: #FAFAFA;
		/* text-align: center; */
	}

	.dateDivide {
		width: 100%;
		padding: 36rpx 0;
		color: #999999;
		font-size: 28rpx;
		text-align: center;
	}

	.whiteBg {
		background-color: #FFFFFF;
	}

	.messageBox {
		width: calc(100% - 60rpx);
		padding: 36rpx 28rpx 36rpx 74rpx;
		margin-left: 30rpx;
		border-radius: 10rpx;
		position: relative;
	}
	.messageBox2{
		width: 690rpx;
		margin-left: 30rpx;
		padding: 32rpx 0 10rpx 0;
		border-radius: 10rpx;
	}

	.tip {
		position: absolute;
		height: 34rpx;
		line-height: 34rpx;
		padding: 0 10rpx 0 6rpx;
		font-size: 22rpx;
		color: #FFFFFF;
		background: url(../../static/messageBgIcon.png);
		background-size: 100% 100%;
		left: -6rpx;
		top: 40rpx;
	}

	.messageTitle {
		color: #333333;
		font-size: 32rpx;

		display: flex;
		justify-content: flex-start;
		align-items: center;
	}

	.msgTitle {
		font-weight: bold;
		margin-right: auto;
	}

	.showDetailBtn {
		color: #999999;
		font-size: 28rpx;
		color: #BBBBBB;
		margin-left: 18rpx;
	}

	.inpArrow {
		width: 24rpx;
		height: 24rpx;
	}

	.msgContent {
		width: 100%;
		height: 100%;
		text-align: left;
		margin-top: 36rpx;
		font-size: 30rpx;
		color: #666666;
	}

	.messageBox1 {
		width: 690rpx;
		margin-left: 30rpx;
		padding-top: 25rpx;
		border-radius: 10rpx;
	}

	.msgTop {
		width: 100%;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		margin-bottom: 18rpx;
	}

	.msgTopName {
		color: #333333;
		font-size: 32rpx;
		font-weight: bold;
		margin-right: 12rpx;
	}

	.msgTip {
		padding: 2rpx 8rpx;
		border: 1rpx solid #FFA044;
		color: #FFA044;
		font-size: 18rpx;
		margin-right: auto;
		border-radius: 6rpx;
	}

	.msgPrice {
		font-size: 28rpx;
		color: #333333;
		font-weight: bold;
	}
	.tenantBtn{
		font-size: 28rpx;
		color: #BBBBBB;
		margin-right: 10rpx;
		margin-left: auto;
	}

	.msgPrice span {
		font-size: 32rpx;
		color: #FF9A22;
		margin-right: 10rpx;
		align-self: baseline;
	}

	.billTime {
		font-size: 26rpx;
		color: #999999;
		margin-bottom: 20rpx;
	}

	.billLocation,
	.rentCycle {
		font-size: 28rpx;
		color: #666666;
		margin-bottom: 20rpx;
	}
	.tenantLocation{
		margin: 32rpx 0 16rpx 0;
		color: #666666;
		font-size: 30rpx;
	}

	.rentCycle {
		margin-bottom: 24rpx;
	}

	.billLocation span {
		margin-left: 16rpx;
	}

	.operatBtn {
		height: 80rpx;
		width: 100%;
		text-align: center;
		line-height: 80rpx;
		border-top: 1rpx solid #DDDDDD;
		color: #FF9A22;
		font-size: 30rpx;
		font-weight: bold;
	}

	.grayBtn {
		color: #B3B3B3;
	}

	.grayTip {
		border: 1rpx solid #999999;
		color: #A5A5A5;
	}
	.status0{
		border: 1rpx solid #EB5E61;
		color: #EB5E61;
	}
	.status1{
		border: 1rpx solid #bbbbbb;
		color: #bbbbbb;
	}
	.myPadding{
		padding-top: 120rpx;
	}
</style>
