<template>
	<view class="houseReportForm">
		<view class="section">
			<view class="titleBar">
				<view class="dateTitle active">
					2020年3月
				</view>
				<view class="topRight">
					<view class="cost ">支出</view>
					<view class="cost active">收入</view>
					<view class="cost ">净利润</view>
				</view>
			</view>
			<view class="costNum">共支出1笔, 合计</view>
			<view class="costTotal">￥6500.00</view>
		</view>
		<view class="section1">
			<view class="chartsTitle">支出对比</view>
			<image class="divideBar" src="../../static/reportFormDivide.png" mode="aspectFill"></image>
			<canvas canvas-id="canvasColumn" id="canvasColumn"  class="charts" disable-scroll=true @touchstart="touchLineA"
			 @touchmove="moveLineA" @touchend="touchEndLineA"></canvas>
			<view class="chartsTitle selfMargin">支出明细</view>
			<view class="costDetail" v-for="(item,index) in [0,1,2]" :key="index">
				<view>1号 202</view>
				<view class="detailPrice">￥2500.12</view>
			</view>
		</view>
	</view>
</template>

<script>
	import uCharts from '../../util/u-charts.js'
	var _self;
	var canvaColumn = null;

	export default {
		data() {
			return {
				communityId:'',
				cWidth: '',
				cHeight: '',
				pixelRatio: 1,
				"chartData": {
					"categories": ['1月','2月','3月','4月','5月','6月','7月','8月'],
					"series": [{
						"name": "支出",
						color: '#FFDEBC',
						textColor: '#FFDEBC',
						"data": [20,40,50,48,23,45,25,77,43]
					}]
				},
				serverData: '',
			}
		},
		onLoad(options) {
			_self = this;
			_self.communityId = options.communityId
			this.cWidth = uni.upx2px(750);
			this.cHeight = uni.upx2px(500);
			this.getReportData();
		},
		methods: {
			getReportData() {
				let min, max
				_self.$request.post('/report/reportQueryByCommunity', {
					"id": _self.$store.state.landladyInfo.id,
					"communityId": _self.communityId
				}).then((res) => {
					console.log(res)
					// res.data.data.forEach((item, index) => {
					// 	_self.chartData.categories.push(item.year + '年' + item.month + '月')
					// 	_self.chartData.series[0].data.push(parseInt(item.totalAmount))
					// })
					// min = _self.chartData.series[0].data.sort(function(a, b) {
					// 	return a - b;
					// })
					// max = _self.chartData.series[0].data.sort(function(a, b) {
					// 	return b - a;
					// })
				})
				setTimeout(() => {
					// _self.showColumn("canvasColumn", _self.chartData, min[0], max[0]);
					_self.showColumn("canvasColumn", _self.chartData);
				}, 2000)
			},
			showColumn(canvasId, chartData, min, max) {
				console.log(_self.chartData)
				canvaColumn = new uCharts({
					$this: _self,
					canvasId: canvasId,
					type: 'column',
					legend: {
						show: true
					},
					fontSize: 11,
					background: '#FFFFFF',
					pixelRatio: _self.pixelRatio,
					animation: true,
					categories: chartData.categories,
					series: chartData.series,
					enableScroll: true,
					xAxis: {
						disableGrid: true,
						itemCount: 4, //x轴单屏显示数据的数量，默认为5个
						scrollShow: chartData.categories.length > 4 ? true : false, //新增是否显示滚动条，默认false
						scrollAlign: 'left', //滚动条初始位置
						scrollBackgroundColor: '#F7F7FF', //默认为 #EFEBEF
						scrollColor: '#FFDEBC', //默认为 #A6A6A6
						axisLineColor: '#F09A42',
					},
					yAxis: {
						disabled: true,
						disableGrid: true,
						// dashLength: 4,
						splitNumber: 6,
						// min: min - 1000,
						// max: max + 1000,
						// format: (val) => {
						// 	return '￥'+val.toFixed(0) + '元'
						// }
					},
					dataLabel: true,
					width: _self.cWidth * _self.pixelRatio,
					height: _self.cHeight * _self.pixelRatio,
					extra: {
						tooltip:{
							show:false
						},
						column: {
							type: 'group',
							width: 20
						}
					}
				});

			},

			touchLineA(e) {
				console.log('开始', e)
				canvaColumn.scrollStart(e);
			},
			moveLineA(e) {
				console.log('进行时', e)
				canvaColumn.scroll(e);
			},
			touchEndLineA(e) {
				console.log('结束', e)
				canvaColumn.scrollEnd(e);
				//下面是toolTip事件，如果滚动后不需要显示，可不填写
				canvaColumn.touchLegend(e, {
					animation: false
				});
				canvaColumn.showToolTip(e, {
					format: function(item, category) {
						console.log(item,category)
						if (typeof item.data === 'object') {
							return category + ' ' + item.name + ':' + item.data.value
						} else {
							return category + ' ' + item.name + ':' + item.data
						}
					}
				});
			},
		}
	}
</script>

<style>
	.houseReportForm {
		width: 100%;
		min-height: 100vh;
		height: 100%;
		background-color: #FAFAFA;
	}

	.section {

		width: 100%;
		height: 354rpx;
		background-color: #F09A42;
		padding: 30rpx 36rpx 0 32rpx;
	}

	.active {
		border: 1rpx solid #FFFFFF;
		color: #FFFFFF !important;
	}

	.titleBar {
		width: 100%;
		display: flex;
	}

	.dateTitle {
		width: fit-content;
		background-color: #F09A42;
		padding: 0rpx 24rpx;
		height: 56rpx;
		display: flex;
		align-items: center;
		font-size: 37rpx;
		border-radius: 28rpx;
		margin-right: auto;
	}

	.topRight {
		min-width: 340rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.topRight view {
		padding: 0 20rpx;
		height: 44rpx;
		color: #FDE3C9;
		font-size: 28rpx;
		border-radius: 22rpx;
		line-height: 40rpx;
	}

	.costNum {
		color: #FDE3C9;
		font-size: 30rpx;
		padding: 68rpx 0 0 52rpx;
	}

	.costTotal {
		font-size: 60rpx;
		color: #FFFFFF;
		font-weight: bold;
		margin-top: 22rpx;
	}

	.costTotal::first-letter {
		font-size: 48rpx;
	}

	.section1 {
		width: 686rpx;
		height: 100%;
		background-color: #FFFFFF;
		border-radius: 10rpx;
		margin: 22rpx auto 0 auto;
		position: relative;
	}

	.selfMargin {
		margin: 36rpx 0 20rpx 0;
	}

	.chartsTitle {
		padding: 38rpx 0 0 38rpx;
		font-size: 32rpx;
		color: #333333;
		font-weight: bold;
	}

	.divideBar {
		width: 100%;
		height: 18rpx;
		position: absolute;
		top: 600rpx;
		left: 0;
	}

	.charts {
		width: 100%;
		height: 500rpx;
		background-color: #FFFFFF;
		border-radius: 10rpx;
	}

	.costDetail {
		width: calc(100% - 70rpx);
		height: 84rpx;
		margin-left: 35rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		color: #333333;
		font-size: 32rpx;
	}

	.costDetail:not(:last-of-type) {
		border-bottom: 1rpx solid #F7F7F7;
	}

	.detailPrice::first-letter {
		font-size: 24rpx;
	}
</style>
