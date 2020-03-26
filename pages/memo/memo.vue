<template>
	<view class="memo">
		<mescroll-uni :down="downOption" @down="downCallback" :up="upOption" @up="upCallback" :fixed="false" @init="init">
			<view v-if="memoList.length == 0" class="noMemoEmpty"></view>
			<view class="item" v-for="(item,index) in memoList" :key="index" @click="showDetail(item.id)">
				<view class="title">{{item.noteTitle}}</view>
				<view class="content line-clamp2" :class="{noMarginTop:!item.noteTitle}">{{item.noteContent}}</view>
				<view class="memoDate">{{item.updateTime}}</view>
			</view>
		</mescroll-uni>
		<is-login v-show="loginFlag" :childLoginFlag="loginFlag" v-on:childByValue="childByValue"></is-login>
		<image @click="addMemo" class="memoBtn" src="../../static/memoBtn.png" mode="aspectFit"></image>
	</view>
</template>

<script>
	import isLogin from '../../components/isLogin.vue';
	import MescrollUni from '../../components/mescroll-uni/mescroll-uni.vue';
	export default {
		components: {
			MescrollUni,
			isLogin,
		},
		data() {
			return {
				para: {
					landlordId: "",
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
						use: true,
						icon:'/static/noMemo.png',
						tip: '点击按钮，开始记事吧'
					}
				},
				mescroll: {},
				memoList: [],
				loginFlag:false,
			}
		},
		onShow() {
			this.para.landlordId = this.$store.state.landladyInfo.id
			this.downCallback(this.mescroll);
		},
		methods: {
			childByValue(value) {
				console.log(value, '弹不弹登录提示')
				if (value == false) {
					this.loginFlag = false;
					this.addMemo()
				}
			},
			showDetail(id){
				
				uni.navigateTo({
					url:'../addMemo/addMemo?memoId='+id
				})
			},
			addMemo(){
				if (this.$store.state.isloginStatus) {
					uni.navigateTo({
						url:'../addMemo/addMemo'
					})
				}else{
					this.loginFlag = true;
				}
				
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
				// 此时mescroll会携带page的参数:
				let pageNum = mescroll.num; // 页码, 默认从1开始
				let pageSize = mescroll.size; // 页长, 默认每页10条
				if (mescroll.num == 1) _this.memoList = []; //如果是第一页需手动置空列表
				let res = await _this.getMessage(pageNum);
				let curPageData = res;
				_this.memoList = _this.memoList.concat(curPageData); //追加新数据
				_this.$nextTick(() => {
					mescroll.endSuccess(curPageData.length, res.hasNextPage);
				});
			},
			async getMessage(pageNum) {
				let _this = this;
				_this.para.pageNum = pageNum;
				try {
					const response = await _this.$request.post('/note/findAll', _this.para);
					let arr = [];
					console.log(response.data.data.list)
					return response.data.data.list;
				} catch (e) {
					console.log(e);
				}
			},
		}
	}
</script>

<style scoped>
	.memo {
		min-height: 100vh;
		height: 100%;
		background-color: #FAFAFA;
		padding: 22rpx 30rpx 0 30rpx;
	}

	.item {
		margin-bottom: 20rpx;
		width: 100%;
		padding: 30rpx 30rpx;
		border-radius: 10rpx;
		background-color: #FFFFFF;
		color: #333333;
		font-size: 34rpx;
	}

	.title {
		font-weight: bold;
	}

	.content {
		margin: 18rpx 0;
	}

	.memoDate {
		color: #999999;
		font-size: 28rpx;
	}

	.memoBtn {
		width: 138rpx;
		height: 146rpx;
		position: fixed;
		right: 0;
		bottom: 202rpx;
	}
	.noMemoEmpty{
		width: 100%;
		height: 200rpx;
	}
	.noMarginTop{
		margin-top: 0;
	}
</style>
