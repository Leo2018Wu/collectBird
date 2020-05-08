<template>
	<view class="houseReportForm">
		<view class="section">
			<view class="titleBar">
				<view class="dateTitle active" @click="showPicker">
					{{choosedDate}}
				</view>
				<view class="topRight">
					<view class="cost" :class="{active : index == curIndex}" v-for="(item,index) in typeList" :key="index" @click="chooseType(index)">{{item}}</view>
				</view>
			</view>
			<view class="costNum" v-if="curIndex != 2">共{{curIndex == 0 ? '收入' :'支出'}} <span v-if="curCost">{{curIndex == 1 ? curCost[0].expendCount : curCost[0].incomeCount}}</span>
				<span v-if="!curCost">--</span>笔,
				合计</view>
			<view class="costNum" v-if="curIndex == 2">合计</view>
			<view class="costTotal" v-if="curCost">￥{{curIndex == 1 ? curCost[0].totalPay : (curIndex == 0 ? curCost[0].totalAmount : curCost[0].monthIncome) | thousandsPoints}}</view>
			<view class="costTotal1" v-if="!curCost">--</view>
		</view>
		<view class="section1">
			<view class="chartsTitle">{{curIndex == 0 ? '收入对比' : (curIndex == 1 ? '支出对比' : '净利润对比')}}</view>
			<image class="divideBar" src="../../static/reportFormDivide.png" mode="aspectFill"></image>
			<canvas v-show="!isShowPicker" canvas-id="canvasColumn" id="canvasColumn" class="charts" disable-scroll=true
			 @touchstart="touchLineA" @touchmove="moveLineA" @touchend="touchEndLineA"></canvas>
			<view class="chartsTitle selfMargin">{{curIndex == 0 ? '收入明细' : (curIndex == 1 ? '支出明细' : '净利润明细')}}</view>
			<view class="costDetail" v-for="(item,index) in houseDataList" :key="index">
				<view>{{item.buildingNo}}号 {{item.houseNo}}</view>
				<view class="detailPrice">￥{{curIndex == 1 ? item.totalPay : (curIndex == 0 ? item.totalAmount : item.monthIncome)  | thousandsPoints}}</view>
			</view>
		</view>
		<view class="pickerMask" v-if="isShowPicker" @click="pickerCancel" @catchtouchmove="true"></view>
		<view class="pickerBox" v-if="isShowPicker">
			<view class="pickerTop">
				<view class="pickerCancel" @click="pickerCancel">取消</view>
				<view>选择时间</view>
				<view class="pickerSure" @click="pickerSure">确定</view>
			</view>
			<picker-view indicator-class="indicatorClass" :value="monthValue" @change="bindChange">
				<picker-view-column>
					<view class="item" v-for="(item,index) in years" :key="index">{{item}}年</view>
				</picker-view-column>
				<picker-view-column>
					<view class="item" v-for="(item,index) in months" :key="index">{{item}}月</view>
				</picker-view-column>
			</picker-view>
		</view>

	</view>
</template>

<script>
	import uCharts from '../../util/u-charts.js'
	var _self;
	var canvaColumn = null;

	export default {
		data() {

			const date = new Date()
			const years = []
			const year = date.getFullYear()
			const months = []
			const month = date.getMonth() + 1
			for (let i = 2018; i <= year; i++) {
				years.push(i)
			}
			for (let i = 1; i <= 12; i++) {
				months.push(i)
			}
			return {
				houseDataList: [],
				years,
				months,
				curMonth: month,
				curYear: year,
				monthValue: [year - 2018, month - 1],
				isShowPicker: false,
				curIndex: null,
				typeList: ['收入', '支出', '净利润'],
				communityId: '',
				cWidth: '',
				cHeight: '',
				pixelRatio: 1,
				"chartData": {
					"categories": [],
					"series": [{
						// "name": curIndex == 0 ? "支出(元)" :(curIndex == 1 ? "收入(元)" : "净利润(元)"),
						"name": '',
						color: '#FFFFFF',
						textColor: '#FFDEBC',
						"data": [],
						format: (val) => {
							var reg = /\d{1,3}(?=(\d{3})+$)/g;
							return (val + '').replace(reg, '$&,');
						}
					}]
				},
				communityData: [],
				serverData: '',
				choosedDate: year + '年' + month + '月',
				housePar: {
					"id": "92c12b79-eef4-4d55-bf72-734b136b786f", // 二房东id
					"communityId": "c23aa04f-a75f-4a89-9ab6-1de781d0652a", // 小区id
					"year": "2020", // 年
					"month": "3", // 月
					"countType": "1" // 统计类型 1-收入 2-支出 3-利润
				}
			}
		},
		computed: {
			curCost() {
				if (this.communityData.length != 0) {
					if (this.communityData.filter(item => item.month == this.curMonth).length == 0) {
						return [{
							accCount: 0,
							expendCount: 0,
							incomeCount: 0,
							totalAmount: 0,
							totalPay: 0,
							monthIncome: 0
						}]
					} else {
						return this.communityData.filter(item => item.month == this.curMonth)
					}
				}
			}
		},
		onLoad(options) {
			_self = this;
			_self.communityId = options.communityId
			this.cWidth = uni.upx2px(750);
			this.cHeight = uni.upx2px(500);
			this.getReportData();
			// this.getHouseData();
			_self.housePar.landlordId = _self.$store.state.landladyInfo.id
			_self.housePar.communityId = _self.communityId
		},
		methods: {
			getHouseData() {
				_self.housePar.year = _self.curYear;
				_self.housePar.month = _self.curMonth;
				_self.housePar.countType = _self.curIndex == 0 ? 1 : (_self.curIndex == 1 ? 2 : 3);
				_self.$request.post('/report/groupHouse', _self.housePar).then((res) => {
					_self.houseDataList = res.data.data;
				})
			},
			pickerCancel() {
				this.isShowPicker = false
			},
			pickerSure() {
				this.choosedDate = this.curYear + '年' + this.curMonth + '月';
				this.getHouseData()
				this.isShowPicker = false
				let myIndex
				_self.chartData.categories.forEach((item, index) => {
					if (_self.curMonth == item.substr(3, 1) && _self.curYear.toString().substr(2, 2) == item.substr(0, 2)) {
						myIndex = index
					}
				})
				let minVal, maxVal
				if (_self.chartData.series[0].data.length <= 1) {
					minVal = Number(_self.chartData.series[0].data[0].value) * 0.8
					maxVal = Number(_self.chartData.series[0].data[0].value) * 1.1
				} else {
					const arr = _self.chartData.series[0].data.map(p => {
						return p.value
					})
					maxVal = Math.max.apply(Math, arr) * 1.1
					minVal = Math.min.apply(Math, arr) * 0.8
				}
				_self.chartData.series[0].data.forEach((p, idx) => {
					if (idx == myIndex) {
						_self.chartData.series[0].data[idx].color = "#F09A42"
					} else {
						_self.chartData.series[0].data[idx].color = "#FFDEBC"
					}
				})
				console.log(minVal, maxVal)
				let data = {
					series: _self.chartData.series,
					yAxis: {
						min: minVal,
						max: maxVal
					}
				}

				canvaColumn.updateData(data)
			},
			showPicker() {
				this.isShowPicker = true
			},
			bindChange: function(e) {
				const val = e.detail.value
				this.monthValue = val
				this.curMonth = this.months[val[1]];
				this.curYear = this.years[val[0]]
			},
			chooseType(index) {
				uni.showLoading({
					title: '报表绘制中...'
				})
				if (index == _self.curIndex) return
				_self.curIndex = index;
				_self.chartData.series[0].data = []
				_self.communityData.map((item, index) => {
					let temp
					if (item.month == (new Date().getMonth() + 1)) {
						temp = {
							value: _self.curIndex == 1 ? parseInt(item.totalPay) : (_self.curIndex == 0 ? parseInt(item.totalAmount) :
								parseInt(item.monthIncome)),
							color: '#F09A42'
						}
					} else {
						temp = {
							value: _self.curIndex == 1 ? parseInt(item.totalPay) : (_self.curIndex == 0 ? parseInt(item.totalAmount) :
								parseInt(item.monthIncome)),
							color: '#FFDEBC'
						}
					}
					console.log(temp)
					_self.chartData.series[0].data.push(temp)
				})
				let minVal, maxVal
				if (_self.chartData.series[0].data.length == 1) {
					minVal = Number(_self.chartData.series[0].data[0].value)
					maxVal = Number(_self.chartData.series[0].data[0].value)
				} else {
					const arr = _self.chartData.series[0].data.map(p => {
						return p.value
					})
					maxVal = Math.max.apply(Math, arr)
					minVal = Math.min.apply(Math, arr)
				}
				_self.showColumn("canvasColumn", _self.chartData, (minVal * 0.8), (maxVal * 1.1));
				canvaColumn.addEventListener('renderComplete', () => {
					uni.hideLoading()
				});
				_self.getHouseData()
			},
			getReportData() {
				_self.$request.post('/report/groupCommunity', {
					"landlordId": _self.$store.state.landladyInfo.id,
					"communityId": _self.communityId,
				}).then((res) => {
					_self.communityData = res.data.data;
					if (_self.communityData.length == 0) return
					res.data.data.forEach((item, index) => {
						_self.chartData.categories.push(item.year.substr(2, 2) + '年' + item.month + '月')
					})
					_self.chooseType(0)
					_self.getHouseData()
				})
			},
			showColumn(canvasId, chartData, min, max) {
				console.log(chartData)
				canvaColumn = new uCharts({
					$this: _self,
					canvasId: canvasId,
					type: 'column',
					legend: {
						show: true,
					},
					padding: [15, 30, 0, 15],
					fontSize: 11,
					background: '#FFFFFF',
					pixelRatio: _self.pixelRatio,
					animation: true,
					categories: chartData.categories,
					series: chartData.series,
					enableScroll: true,
					xAxis: {
						disableGrid: true,
						itemCount: 6, //x轴单屏显示数据的数量，默认为5个
						scrollShow: chartData.categories.length > 4 ? true : false, //新增是否显示滚动条，默认false
						scrollAlign: 'left', //滚动条初始位置
						scrollBackgroundColor: '#F7F7FF', //默认为 #EFEBEF
						scrollColor: '#FFDEBC', //默认为 #A6A6A6
						axisLineColor: '#F09A42',
					},
					yAxis: {
						disabled: true,
						disableGrid: true,
						splitNumber: 6,
						min,
						max,
						// format: (val) => {
						// 	return '￥'+val.toFixed(0) + '元'
						// }
					},
					dataLabel: true,
					width: _self.cWidth * _self.pixelRatio,
					height: _self.cHeight * _self.pixelRatio,
					extra: {
						tooltip: {
							bgColor: "transparent"
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
						console.log(item, category)
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
		padding-top: 68rpx;
	}

	.costTotal {
		font-size: 60rpx;
		color: #FFFFFF;
		font-weight: bold;
		margin-top: 22rpx;
	}

	.costTotal1 {
		font-size: 60rpx;
		color: #FFFFFF;
		font-weight: bold;
		margin-top: 22rpx;
	}


	.selfMarginTop {
		margin-top: 72rpx;
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

	picker-view {
		width: 100%;
		height: 480rpx;
		position: fixed;
		bottom: 0;
	}

	.indicatorClass {
		background-color: #FAFAFA;
		z-index: -1;
	}

	.item {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.pickerMask {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: #000000;
		opacity: 0.3;
	}

	.pickerBox {
		position: fixed;
		bottom: 0;
		z-index: 99;
		background: #FFFFFF;
		width: 100%;
		height: 570rpx;
	}

	.pickerTop {
		width: calc(100% - 60rpx);
		height: 90rpx;

		margin-left: 30rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 36rpx;
		color: #333333;
		font-weight: 500;
	}

	.pickerCancel {
		font-size: 32rpx;
		color: #999999;
	}

	.pickerSure {
		font-size: 32rpx;
		color: #FFA044;
	}
</style>
