<template>
	<view class="help">
		<view class="section">
			<view class="topBox">
				<image src="../../static/aboutUs.png" mode="aspectFit"></image>
				<span class="logoContent">收租鸟，慧收租</span>
			</view>
			<view class="miniDesc">收租鸟通过简单便捷的交互方式，让您高效完成房源、租客、账单等收租管理需求。并享有多维度报表，智能抄表，以及房源直租等优势。</view>
		</view>
		<view class="helpList">
			<view class="helpBar">帮助手册</view>
			<view class="helpLi" v-for="(item,index) in list" :key="index">
				<view class="leftLi" @click="showMore(index)">
					<view class="rightLiInner">
						<image class="helpIcon" :src="item.iconUrl" mode=""></image>
						<view>{{item.queType}}</view>
						<image class="helpDown" :class="{isShow:isShow && isShowIndex == index}" src="../../static/helpDownIcon.png" mode="aspectFit"></image>
					</view>
				</view>
				<view class="rightLi">
					<view v-if="isShow && isShowIndex == index">
						<view class="rightLiItem" v-for="(p,idx) in item.detail" :key="idx" @click="showDetail(p,index,idx)">{{p}}</view>
					</view>
					<view v-else>
						<view class="rightLiItem"  @click="showDetail(item.detail[0],index,0)">{{item.detail[0]}}</view>
						<view class="rightLiItem"  @click="showDetail(item.detail[1],index,1)">{{item.detail[1]}}</view>
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
				isShow:false,
				isShowIndex: null,
				list: [{
						iconUrl: '../../static/helpIcon0.png',
						queType: "房源相关",
						detail: ['如何添加房源？', '如何添加房号？','如何添加房间？']
					},
					{
						iconUrl: '../../static/helpIcon1.png',
						queType: "租客相关",
						detail: ['如何添加租客？', '如何查看租客列表？']
					},
					{
						iconUrl: '../../static/helpIcon5.png',
						queType: "房东相关",
						detail: ['为什么要绑定房东？', '如何绑定房东？']
					},
					{
						iconUrl: '../../static/helpIcon2.png',
						queType: "账单相关",
						detail: ['如何查看账单？', '账单如何生成？']
					},
					{
						iconUrl: '../../static/helpIcon3.png',
						queType: "报表相关",
						detail: ['报表统计了哪些信息？', '净利润是如何计算的？']
					},
					{
						iconUrl: '../../static/helpIcon4.png',
						queType: "常见问题",
						detail: ['我的信息是安全的吗？', '收租鸟有试用期吗？']
					}
				]
			}
		},
		methods: {
			showMore(index){
				this.isShow = !this.isShow;
				this.isShowIndex = index;
			},
			showDetail(title,index,idx){
				uni.navigateTo({
					url:'../helpDetail/helpDetail?title='+title+'&index='+index+'&idx='+idx
				})
			}
		}
	}
</script>

<style scoped>
	.section {
		padding: 46rpx 26rpx;
		border-bottom: 10rpx solid #FAFAFA;
	}

	.section image {
		width: 116rpx;
		height: 116rpx;
	}

	.topBox {
		display: flex;
		align-items: center;
	}

	.logoContent {
		font-size: 32rpx;
		color: #333333;
		margin-left: 10rpx;
		margin-top: -10rpx;
	}

	.miniDesc {
		color: #999999;
		font-size: 30rpx;
		padding-left: 20rpx;
	}

	.helpList {
		color: #333333;
		font-size: 28rpx;
	}

	.helpBar {
		font-size: 32rpx;
		padding: 32rpx 40rpx;
		border-bottom: 1rpx solid #ECECEC;
	}

	.helpLi {
		min-height: 188rpx;
		height: 100%;
		display: flex;
	}
	.isShow{
		transform: rotate(180deg);
	}

	.helpLi {
		border-bottom: 1rpx solid #ECECEC;
	}

	.leftLi {
		width: 26%;
		border-right: 1rpx solid #ECECEC;
		display: flex;
		align-items: center;
	}
	.rightLiInner{
		width: 100%;
		height: 188rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-items: center;
		padding: 20rpx 0;
	}

	.rightLi {
		width: 74%;
	}

	.rightLiItem {
		width: 100%;
		height: 94rpx;
		line-height: 94rpx;
		padding-left: 30rpx;
	}

	.rightLiItem:not(:last-of-type) {
		border-bottom: 1rpx solid #ECECEC;
	}

	.helpIcon {
		width: 64rpx;
		height: 64rpx;
	}

	.helpDown {
		width: 20rpx;
		height: 20rpx;
	}
</style>
