<template>
	<view class="mine">
		<view class="topContent">
			<view class="myMsg">
				<view class="myContainer">
					<view class=""><image class="myPhoto" src="../../static/el.jpg"></image></view>
					<view class="detail">
						<view class="detailTop">
							<view class="myName">{{ mine }}</view>
							<view class="myLevel">
								<image class="levelIcon" src="../../static/queen.png"></image>
								<view class="levelText">{{ myLevel }}</view>
							</view>
						</view>
						<view class="detailBottom">邀请码: {{ invitationCode }}</view>
					</view>
				</view>
			</view>
			<view class="emptyBackground"></view>
			<view class="houseTotalMsg">
				<view class="leftMsg">
					<view class="leftMsgTitle">剩余天数</view>
					<view class="leftMsgValue">{{ residue }}</view>
					<view class="leftMsgDate">{{ dateDue }}</view>
				</view>
				<view class="line"></view>
				<view class="rightMsg">
					<view class="rightMsgTitle">房号容量</view>
					<view class="rightMsgValue">28</view>
				</view>
			</view>
		</view>
		<view class="jumpPortal">
			<view class="jumpPortalitem" @click="openNewsInvitationCode">
				<view class="leftPart">
					<image class="jumpPortalImg" src="../../static/myIcon1.png" mode=""></image>
					<view class="jumpPortalText">填写邀请码</view>
					<view class="modalNum">{{modalNum}}</view>
				</view>
				<view class="rightPart"><image class="rightPartImg" src="../../static/right_arrow.png" mode=""></image></view>
			</view>
			<view class="jumpPortalitem">
				<view class="leftPart">
					<image class="jumpPortalImg" src="../../static/myIcon5.png" mode=""></image>
					<view class="jumpPortalText">邀请好友</view>
				</view>
				<view class="rightPart"><image class="rightPartImg" src="../../static/right_arrow.png" mode=""></image></view>
			</view>
			<view class="jumpPortalitem" @click="openFeedBack">
				<view class="leftPart">
					<image class="jumpPortalImg" src="../../static/myIcon2.png" mode=""></image>
					<view class="jumpPortalText">意见反馈</view>
				</view>
				<view class="rightPart"><image class="rightPartImg" src="../../static/right_arrow.png" mode=""></image></view>
			</view>
			<view class="jumpPortalitem">
				<view class="leftPart">
					<image class="jumpPortalImg" src="../../static/myIcon3.png" mode=""></image>
					<view class="jumpPortalText">帮助</view>
				</view>
				<view class="rightPart"><image class="rightPartImg" src="../../static/right_arrow.png" mode=""></image></view>
			</view>
			<view class="jumpPortalitem" @click="openAboutUs">
				<view class="leftPart">
					<image class="jumpPortalImg" src="../../static/myIcon4.png" mode=""></image>
					<view class="jumpPortalText">关于收租鸟</view>
				</view>
				<view class="rightPart"><image class="rightPartImg" src="../../static/right_arrow.png" mode=""></image></view>
			</view>
		</view>
		<!-- 弹窗 -->
		<view class="modal" v-show="flag"></view>
		<view class="modalBox" v-show="flag">
			<view class="modalTitle">填写邀请码</view>
			<view class="modalContent">
				<view class="modalInput"><input type="text" value="" placeholder="请输入邀请码" style="font-size: 30rpx;" /></view>
				<view class="reminder">
					<view class="reminderSymbol">!</view>
					<view class="reminderText">邀请码仅填写一次</view>
				</view>
				<view class="button">
					<view class="btn_cancle" @click="powerDrawer" data-statu="close">取消</view>
					<view class="modalLine"></view>
					<view class="btn_ok active" @click="powerDrawer" data-statu="open">确定</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			mine: '璐璐',
			myLevel: 'LV 1',
			invitationCode: '2568',
			residue: '89',
			dateDue: '2020-09-05到期',
			flag: false,
			modalNum:'2568',
		};
	},
	methods: {
		powerDrawer() {
			this.flag = false;
		},
		openNewsInvitationCode(e) {
			this.flag = true;
		},
		openFeedBack(e) {
			uni.navigateTo({
				url: '../feedback/feedback'
			});
		},
		openAboutUs(e){
			uni.navigateTo({
				url: '../aboutUs/aboutUs'
			});
		}
	}
};
</script>

<style>
.mine {
	height: 100vh;
	width: 100%;
}
.myContainer {
	height: 114rpx;
	width: 100%;
	display: flex;
	margin-top: 40rpx;
}

.topContent {
	height: 36%;
	width: 100%;
	position: relative;
	overflow: hidden;
}

.myMsg {
	height: 72%;
	/* background:linear-gradient(-56deg,rgba(244,183,74,1) 0%,rgba(240,153,66,1) 100%); */
	background-color: #f09a42;
	padding: 20rpx 30rpx;
	display: flex;
	justify-content: flex-start;
	
}

.myPhoto {
	width: 115rpx;
	height: 115rpx;
	border-radius: 50%;
}

.detailTop {
	position: relative;
	display: flex;
	justify-content: flex-start;
	align-items: center;
}

.myLevel {
	width: 121rpx;
	height: 40rpx;
	margin-left: 7rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 22rpx;
	border-radius: 20rpx;
	background: linear-gradient(-56deg, rgba(244, 183, 74, 1) 0%, rgba(240, 153, 66, 1) 100%);
}
.detail {
	padding-left: 19rpx;
	height: 57rpx;
}

.levelIcon {
		width: 20rpx;
		height: 20rpx;
		color: #fff;
	}

.levelText {
	color: #fff;
	margin-left: 20rpx;
	font-family: PingFang SC;
	font-weight: 500;
}

.detailBottom {
	margin-top: 25rpx;
	color: #fff;
	font-size: 32rpx;
	font-family: PingFang SC;
	font-weight: 500;
}

.myName {
	font-size: 40rpx;
	font-family: PingFang SC;
	font-weight: bold;
	color: rgba(255, 255, 255, 1);
}

.houseTotalMsg {
	width: 690rpx;
	height: 180rpx;
	position: absolute;
	bottom: 40rpx;
	left: 30rpx;
	background-color: #fff;
	border-radius: 15rpx;
	display: flex;
	justify-content: space-between;
}

.leftMsg {
	width: 48%;
	text-align: center;
	padding-top: 35rpx;
}

.leftMsgTitle {
	font-size: 24rpx;
	font-family: PingFang SC;
	font-weight: 500;
}

.leftMsgValue {
	font-size: 55rpx;
	font-family: PingFang SC;
	font-weight: bold;
	color: rgba(255, 164, 73, 1);
}

.leftMsgDate {
	font-size: 22rpx;
	font-family: PingFang SC;
	font-weight: 500;
	color: rgba(153, 153, 153, 1);
}

.rightMsg {
	width: 48%;
	text-align: center;
	padding-top: 35rpx;
}

.rightMsgTitle {
	font-size: 24rpx;
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
	width: 1rpx;
	height: 61rpx;
	/* border: 1rpx solid rgba(166, 166, 166, 1); */
	position: absolute;
	top: 57rpx;
	left: 50%;
	background-color: rgba(190, 190, 190, 1);

}

.jumpPortal {
	background-color: #fff;
	height: 65%;
	padding: 20rpx 40rpx;
}

.jumpPortalImg {
	width: 48rpx;
	height: 48rpx;
}

.jumpPortalitem {
	height: 15%;
	border-bottom: 3rpx solid #F5F5F5;
	display: flex;
	justify-content:space-between;
	align-items:center;
	position: relative;
}

.leftPart {
	display: flex;
	justify-content: flex-start;
}

.rightPartImg {
	width: 24rpx;
	height: 24rpx;
}

.jumpPortalText {
	margin-left: 25rpx;
	font-size: 32rpx;
	font-family: PingFang SC;
	/* font-weight: 500; */
}
.modalNum{
	position: absolute;
	font-size:28rpx;
	font-family:PingFang SC;
	font-weight:500;
	color:rgba(153,153,153,1);
	top:34%;
	right:40rpx;
}

/* 弹窗 */
.modal {
	width: 100%;
	height: 100%;
	position: fixed;
	top: 0;
	left: 0;
	z-index: 1000;
	background: #000;
	opacity: 0.5;
	overflow: hidden;
	z-index: 500;
}
.modalTitle {
	height: 25%;
}
.modalContent {
	height: 75%;
}
.modalBox {
	width: 540rpx;
	height: 362rpx;
	overflow: hidden;
	position: fixed;
	top: 28%;
	left: 15%;
	z-index: 1001;
	background: rgba(255, 255, 255, 1);
	/* background: #FAFAFA; */
	border-radius: 25rpx;
}

.modalTitle {
	padding-top: 40rpx;
	font-size: 36rpx;
	font-family: PingFang SC;
	font-weight: bold;
	color: rgba(51, 51, 51, 1);
	text-align: center;
}

.modalInput {
	padding: 60rpx 40rpx 10rpx 40rpx;
	border-bottom: 1rpx solid #eeeeee;
	width: 80%;
	text-align: center;
	margin: 0 auto;
	font-size: 30rpx;
}
.reminderText {
	font-size: 22rpx;
	font-family: PingFang SC;
	font-weight: 500;
	color: rgba(255, 160, 68, 1);
}
.reminder {
	text-align: center;
	color: #ffa044;
	font-size: 22rpx;
	font-family: PingFang SC;
	font-weight: 500;
	color: rgba(255, 160, 68, 1);
	display: flex;
	justify-content: center;
	padding: 10rpx 20rpx 25rpx;
}

.reminderSymbol {
	width: 30rpx;
	height: 30rpx;
	border: 1rpx solid #ffa044;
	border-radius: 50%;
	margin-right: 10rpx;
	line-height: 24rpx;
	text-align: center;

}

.button {
	width: 100%;
	height: 90rpx;
	border-top: 1rpx solid rgba(238, 238, 238, 1);
	display: flex;
	justify-content: space-around;
	font-size: 34rpx;
	font-family: PingFang SC;
	font-weight: 500;
	color: rgba(51, 51, 51, 1);
	position: relative;
	line-height: 80rpx;
}

.modalLine {
	width: 1rpx;
	height: 89rpx;
	border: 1rpx solid rgba(238, 238, 238, 1);
	position: absolute;
	top: 0%;
	left: 50%;
}

.active {
	color: #ffa044;
}
</style>
