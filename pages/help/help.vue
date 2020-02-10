<template>
	<view class="help">
		<view class="containerItem" @click="openDeatil">
			<view class="containerIn">
				<view class="question">如何查找租客?</view>
				<view class="rightPart"><image class="rightPartImg" src="../../static/down_s.png" mode=""></image></view>
				<!-- <view class="detail" v-if="isShowDetail">
					<view class="">
						<view class="dot"></view>
						<view class="">
							房源管理>点击小区>显示红色方块有账单，点击租客信息后可查看租客账单
						</view>
					</view>
					<view class="">
						<view class="dot"></view>
						<view class="">
							点击租客信息后可查看租客账单
						</view>
					</view>
				</view> -->
			</view>
		</view>
		<view class="containerItem">
			<view class="containerIn">
				<view class="question">如何查看租客账单?</view>
				<view class="rightPart"><image class="rightPartImg" src="../../static/down_s.png" mode=""></image></view>
				<!-- <view class="borderLine"></view> -->
				<!-- <view class="isshow">
					<view class="">
						<view class="dot"></view>
						<view class="">
							房源管理>点击小区>显示红色方块有账单，点击租客信息后可查看租客账单
						</view>
					</view>
					<view class="">
						<view class="dot"></view>
						<view class="">
							点击租客信息后可查看租客账单
						</view>
					</view>
				</view> -->
			</view>
		</view>
		<view class="containerItem">
			<view class="containerIn">
				<view class="question">如何修改房号信息?</view>
				<view class="rightPart"><image class="rightPartImg" src="../../static/down_s.png" mode=""></image></view>
				<!-- <view class="borderLine"></view> -->
				<!-- <view class="isshow">
					<view class="">
						<view class="dot"></view>
						<view class="">
							房源管理>点击小区>显示红色方块有账单，点击租客信息后可查看租客账单
						</view>
					</view>
					<view class="">
						<view class="dot"></view>
						<view class="">
							点击租客信息后可查看租客账单
						</view>
					</view>
				</view> -->
			</view>
		</view>
		<view class="containerItem">
			<view class="containerIn">
				<view class="question">如何添加房间号信息?</view>
				<view class="rightPart"><image class="rightPartImg" src="../../static/down_s.png" mode=""></image></view>
				<!-- <view class="borderLine"></view> -->
				<!-- <view class="isshow">
					<view class="">
						<view class="dot"></view>
						<view class="">
							房源管理>点击小区>显示红色方块有账单，点击租客信息后可查看租客账单
						</view>
					</view>
					<view class="">
						<view class="dot"></view>
						<view class="">
							点击租客信息后可查看租客账单
						</view>
					</view>
				</view> -->
			</view>
		</view>
		<view class="containerItem">
			<view class="containerIn">
				<view class="question">如何上传照片?</view>
				<view class="rightPart"><image class="rightPartImg" src="../../static/down_s.png" mode=""></image></view>
				<!-- <view class="borderLine"></view> -->
				<!-- <view class="isshow">
					<view class="">
						<view class="dot"></view>
						<view class="">
							房源管理>点击小区>显示红色方块有账单，点击租客信息后可查看租客账单
						</view>
					</view>
					<view class="">
						<view class="dot"></view>
						<view class="">
							点击租客信息后可查看租客账单
						</view>
					</view>
				</view> -->
			</view>
		</view>
		<view class="containerItem">
			<view class="containerIn">
				<view class="question">如何添加租客?</view>
				<view class="rightPart"><image class="rightPartImg" src="../../static/down_s.png" mode=""></image></view>
				<!-- <view class="borderLine"></view> -->
				<!-- <view class="isshow">
					<view class="">
						<view class="dot"></view>
						<view class="">
							房源管理>点击小区>显示红色方块有账单，点击租客信息后可查看租客账单
						</view>
					</view>
					<view class="">
						<view class="dot"></view>
						<view class="">
							点击租客信息后可查看租客账单
						</view>
					</view>
				</view> -->
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isShowDetail:false
			}
		},
		methods: {
			openDeatil(){
				console.log("111111");
				this.isShowDetail = true;
			}
		}
	}
</script>

<style>
	.help{
		height: 100hv;
		width: 100%;
	}
	.containerItem{
		height: 109rpx;
		width: 100%;
		padding: 0rpx 36rpx;
	}
	.containerIn{
		width: 678rpx;
		height: 100%;
		border-bottom: 1rpx solid rgba(236,236,236,1);
		display: flex;
		justify-content:space-between;
		align-items:center;
	}
	.question{
		font-size:32rpx;
		font-family:PingFang SC;
		font-weight:500;
		color:rgba(51,51,51,1);
		line-height:36rpx;
	}
	.rightPartImg {
		width: 24rpx;
		height: 24rpx;
	}
	.detail{
		width: 100%;
		height: 202rpx;
	}
</style>
