<template>
	<view class="houseList">
		<view class="section1">
			<view class="secBar">
				<view class="secBarItem">
					在租房间
					<span>{{ !landladyInfo.rentNum ? 0 : landladyInfo.rentNum }}</span>
				</view>
				<view class="secBarItemLine"></view>
				<view class="secBarItem">
					闲置房间
					<span>{{ !landladyInfo.idleNum ? 0 : landladyInfo.idleNum }}</span>
				</view>
			</view>
		</view>
		<view class="section2" >
			<add-bar v-on:addCommunity="addCommunity"></add-bar>
			<view class="serchBar">
				<span v-if="wordList.length != 0">筛选：</span>
				<view class="scrollContainer" v-if="wordList.length != 0">
					<scroll-tab v-on:return-tab="chooseTab" :list="wordList"></scroll-tab>
				</view>
			</view>
		</view>
		<view class="section3">
			<mescroll-uni :down="downOption" @down="downCallback" :up="upOption" @up="upCallback" :fixed="false" @init="init">
				<view class="houseSkuBox" v-for="(item, index) in houseInfoList" :key="index" @click="goDetail(item.id, item.landlordId)">
					<new-house-sku :item="item"></new-house-sku>
				</view>
			</mescroll-uni>
		</view>
		<is-login v-show="loginFlag" :childLoginFlag="loginFlag" v-on:childByValue="childByValue"></is-login>
	</view>
</template>

<script>
	import newHouseSku from '../../components/houseSkuNew.vue';
	import {
		mapState,
		mapMutations
	} from 'vuex';
	import scrollTab from '../../components/scrollTab.vue';
	import houseSku from '../../components/houseSku.vue';
	import addBar from '../../components/addBar.vue';
	import isLogin from '../../components/isLogin.vue';
	import MescrollUni from '../../components/mescroll-uni/mescroll-uni.vue';
	export default {
		components: {
			'scroll-tab': scrollTab,
			'house-sku': houseSku,
			'add-Bar': addBar,
			'is-login': isLogin,
			MescrollUni,
			newHouseSku
		},
		data() {
			return {
				wordList: [],
				mescroll: {},
				loginFlag: false, //登录弹窗
				para: {
					landlordId: "",
					pageNum: 1,
					firstWord: ''
				},
				houseInfoList: [],
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
						icon:'/static/houseEmpty.png',
						tip: '暂无房源'
					}
				}
			};
		},
		computed: {
			...mapState(['login', 'landladyInfo'])
		},
		onShow() {
			let _this = this;
			if(this.$store.state.landladyInfo.id){
				this.getWords();
				this.downCallback(this.mescroll);
				this.$request
					.post('user/findByOpenId', {
						openId: this.$store.state.userOpenId
					})
					.then(res => {
						_this.$store.commit('landladyInfo', res.data.data);
					})
					.catch(err => {});
			}
		},
		methods: {
			childByValue(value) {
				console.log(value, '弹不弹登录提示')
				if (value == false) {
					this.loginFlag = false;
					uni.navigateTo({
						url: '../home/home'
					});
				}
			},
			updateData() {
				// this.getWords();
				// this.downCallback(this.mescroll);
			},
			addCommunity() {
				if (this.$store.state.isloginStatus) {
					uni.navigateTo({
						url: '../addCommunity/addCommunity'
					});
				} else {
					console.log('是否登录', this.$store.state.isloginStatus);
					console.log(this.loginFlag);
					this.loginFlag = true;
				}
			},
			goDetail(id, landlodId) {
				uni.navigateTo({
					url: '../houseDetail/houseDetail?id=' + id + '&landlordId=' + landlodId
				});
			},
			getWords() {
				let _this = this;
				this.$request
					.post('/community/getFirstWordArray', {
						landlordId: this.$store.state.landladyInfo.id
					})
					.then(res => {
						_this.wordList = res.data.data;
					})
					.catch(err => {
						console.log(err);
					});
			},

			chooseTab(e) {
				this.para.firstWord = e;
				this.downCallback(this.mescroll);
			},
			init(e) {
				this.mescroll = e;
			},
			async getHouseList(pageNum) {
				let _this = this;
				_this.para.pageNum = pageNum;
				_this.para.landlordId = _this.$store.state.landladyInfo.id
				try {
					const response = await _this.$request.post('/community/myCommunity', _this.para);
					let arr = [];
					response.data.data.list.forEach((item, index) => {
						if (item.communityImgs == null) {
							item.communityImgs = [];
							item.communityImgs.push(
								'https://funnyduck.raysler.com/uploadFile/huyue/article/images/20190704/1562239924231ZGZQuw.jpeg');
						} else {
							item.communityImgs = item.communityImgs.split(',');
						}
						arr.push(item);
					});
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
				if (mescroll.num == 1) _this.houseInfoList = []; //如果是第一页需手动置空列表
				let res = await _this.getHouseList(pageNum);
				let curPageData = res.list;
				_this.houseInfoList = _this.houseInfoList.concat(curPageData); //追加新数据
				_this.$nextTick(() => {
					mescroll.endSuccess(curPageData.length, res.hasNextPage);
				});
			},
			checkLoginStatus() {
				let _this = this;
				return new Promise((reslove, rej) => {
					//判断用户是否授权过
					uni.getSetting({
						success(res) {
							console.log(res);
							if (res.authSetting['scope.userInfo']) {
								_this.$store.commit('isloginStatus', true);
								// _this.getUserInfo();
							}
						},
						complete() {
							reslove(!_this.$store.state.isloginStatus);
						}
					});
				});
			},
		}
	};
</script>

<style scoped>
	.houseList {
		width: 100%;
		height: 100%;
		background-color: #fafafa;
		color: #333333;
		font-size: 32rpx;
	}

	.section1 {
		width: 100%;
		height: 81rpx;
		background-color: #f09a42;
		position: relative;
	}

	.secBar {
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

	.secBarItem {
		width: 50%;
		height: 65rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.secBarItem span {
		font-size: 40rpx;
		font-weight: 800;
		margin-left: 20rpx;
	}

	.secBarItemLine {
		width: 1rpx;
		height: 65rpx;
		/* border:3px solid rgba(223,220,220,1); */
		background-color: rgba(223, 220, 220, 1);
	}

	/* .secBarItem:first-of-type {
  border-right: 1rpx solid #dfdcdc80;
} */
	.secBarItem:first-of-type span {
		color: #f09a42;
	}

	.secBarItem:last-of-type span {
		color: #ed7275;
	}

	.section2 {
		width: 100%;
		/* height: 245rpx; */
		padding-top: 95rpx;
		padding-bottom: 10rpx;
		background-color: #ffffff;
	}

	.serchBar {
		margin-top: 34rpx;
		padding-left: 42rpx;
		display: flex;
		align-items: center;
	}

	.serchBar span {
		display: block;
		width: 100rpx;
		height: 52rpx;
		margin-right: 10rpx;
		white-space: nowrap;
		font-size: 34rpx;
		color: #222222;
	}

	.scrollContainer {
		width: 666px;
		overflow: hidden;
		white-space: nowrap;
	}

	.section3 {
		width: 100%;
		/* height: 400px; */
		/* background-color: pink; */
		height: calc(100vh - 324rpx);
		padding: 14rpx 0 30rpx 0;
		position: relative;
		z-index: 99;
	}

	.houseSkuBox {
		width: 670rpx;
		height: fit-content;
		margin: 0 auto 18rpx auto;
	}
	.emptyList{
		padding-top: 290rpx;
		text-align: center;
		color: #BBBBBB;
		font-size: 28rpx;
	}
	.noRenterIcon{
		width: 136rpx;
		height: 190rpx;
		margin: 0 auto 14rpx auto;
	}
</style>
