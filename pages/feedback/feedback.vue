<template>
	<view class="feedback">
		<view class="container">
			<view class="title">反馈类型</view>
			<view class="feedbackTypes">
				<view
				    class="feedbackType"
				    @click="changeIndex(index)"
				    v-for="(item,index) in arr1"
				    :class="{active : currentIndex == index}">{{item}}
				</view>
			</view>	
			<!-- <view class="feedbackTypes">
				<view
				    class="feedbackType"
				    @click="changeIndex(index)"
				    v-for="(item,index) in arr2"
				    :class="{active : currentIndex == index}">{{item}}
				</view>
			</view> -->	
			<!-- <view class="feedbackTypes">
				<view class="feedbackType active">打不开页面</view>
				<view class="feedbackType">闪退问题</view>
				<view class="feedbackType">支付问题</view>
			</view>
			<view class="feedbackTypes">
				<view class="feedbackType">登录与注册</view>
				<view class="feedbackType">其他问题</view>
				<view class="feedbackType">新建议</view>
			</view> -->
			<view class="question">请描述你在使用收租鸟时的问题</view>
			<view class="questionInput">
				<textarea value="" placeholder="请输入内容最多5000字" maxlength="5000" />
			</view>
		</view>
		<view class="submit">提交</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
			arr1:['打不开页面','闪退问题','支付问题','登录与注册','其他问题','新建议'],
			// arr2:[],
			currentIndex: 0,
			currentIndex2: 0,
			}
		},
		methods: {
			changeIndex(index){
				console.log(index);
				this.currentIndex = index;
			},
			changeIndex2(index){
				console.log(index);
				this.currentIndex2 = index;
			},
		}
	}
</script>

<style>
	.feedback {
		width: 100%;
		height: 100vh;
		border-top: 1rpx solid #DBDBDB;
	}

	.container {
		position: relative;
	}

	.title {
		padding: 40rpx 41rpx 20rpx;
		font-size: 32rpx;
		font-family: PingFang SC;
		font-weight: bold;
	}

	.feedbackTypes {
		width: 100%;
		/* height: 100rpx; */
		/* display: flex;
		justify-content: space-between; */
		padding: 14rpx 35rpx;
		text-align: center;
		overflow: hidden;
	}

	.feedbackType {
		width: 206rpx;
		height: 56rpx;
		border: 1rpx solid #DBDBDB;
		line-height: 53rpx;
		border-radius: 28rpx;
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 400;
		float: left;
		color: rgba(102, 102, 102, 1);
		margin: 10rpx;
	}

	.submit {
		position: absolute;
		bottom: 50rpx;
		left: 34%;
		background-color: #F09A42;
		color: #fff;
		width: 257rpx;
		height: 74rpx;
		text-align: center;
		line-height: 74rpx;
		border-radius: 37rpx;
	}

	.question {
		font-size:32rpx;
		font-family:PingFang SC;
		font-weight:bold;
		color:#333333;
		overflow: hidden;
		margin-left: 37rpx;
		margin-top: 20rpx;
	}

	.questionInput {
		padding: 39rpx 41rpx 0rpx;
		font-size: 26rpx;
		font-family: PingFang SC;
		color: rgba(153, 153, 153, 1);
		border-bottom: 1rpx solid rgba(238, 238, 238, 1);
	}
	.questionInput textarea{
		width: 100%;
	}
	.active {
		background-color: #F09A42;
		color: #fff;
		border: none;

	}
</style>
