<template>
	<view class="reportForm">
		<view class="sectionOne whiteBg">
			<view class="secDate" @click="chooseDate">
				{{choosedDate}}
				<image class="trinagle" src="../../static/triangle.png" mode="aspectFit"></image>
			</view>
			<view class="secProfit">
				纯利润￥<span>10000</span>
			</view>
		</view>
		<view class="sectionTwo whiteBg">
			<view class="communityChoose" @click="chooseCommuinty">
				{{choosedCommunity ? choosedCommunity : '全部房产'}}
				<image class="trinagle" src="../../static/triangle.png" mode="aspectFit"></image>
			</view>
			<view class="houseChoose" @click="chooseHouse">
				{{choosedHouse ? '房号'+choosedHouse : '全部房号'}}
				<image class="trinagle" src="../../static/triangle.png" mode="aspectFit"></image>
			</view>
		</view>
		<view class="contentContainer">
			<view class="totalProfit">总收入</view>
			<view class="sectionThree">
				<canvas v-show="!visible" canvas-id="canvasRing" id="canvasRing" class="charts" @touchstart="touchRing"></canvas>
				<image class="divide" src="../../static/reportFormDivide.png" mode="aspectFit"></image>
			</view>
			<view class="sectionFour">
				<view class="secForItem" v-for="(item,index) in itemProfitList" :key="index">
					<view class="itemName">
						{{item.name}}
					</view>
					<view class="itemPrice">
						￥<span>{{item.price}}</span>
					</view>
				</view>
			</view>
		</view>

		<view class="pickerMask" v-if="visible" @click="pickerCancel"></view>
		<view class="pickerBox" :class="{shorterPick : pickerTypeCurIndex == 3 || pickerTypeCurIndex == 4}" v-if="visible">
			<view class="pickerTop">
				<view class="pickerCancel" @click="pickerCancel">取消</view>
				<view v-if="pickerTypeCurIndex == 3">选择房产</view>
				<view v-else-if="pickerTypeCurIndex == 4">选择房号</view>
				<view v-else>选择时间</view>
				<view class="pickerSure" @click="pickerSure">确定</view>
			</view>
			<view class="pickerTypeList" v-if="!(pickerTypeCurIndex == 4 || pickerTypeCurIndex == 3)">
				<view class="pickerLiOut">
					<view class="pickerTypeLi" :class="{pickerTypeLiActive : pickerTypeCurIndex == index}" v-for="(item,index) in pickerTypeList"
					 @click="choosePickerType(index)" :key="index">
						{{item}}
					</view>
				</view>
			</view>
			<picker-view v-if="pickerTypeCurIndex == 0" indicator-class="indicatorClass" :value="monthValue" @change="bindChange">
				<picker-view-column>
					<view class="item" v-for="(item,index) in years" :key="index">{{item}}年</view>
				</picker-view-column>
				<picker-view-column>
					<view class="item" v-for="(item,index) in months" :key="index">{{item}}月</view>
				</picker-view-column>
			</picker-view>
			<picker-view v-if="pickerTypeCurIndex == 1" indicator-class="indicatorClass" :value="seasonValue" @change="bindChange">
				<picker-view-column>
					<view class="item" v-for="(item,index) in seasons" :key="index">{{item}}</view>
				</picker-view-column>
			</picker-view>
			<picker-view v-if="pickerTypeCurIndex == 2" indicator-class="indicatorClass" :value="yearValue" @change="bindChange">
				<picker-view-column>
					<view class="item" v-for="(item,index) in years" :key="index">{{item}}</view>
				</picker-view-column>
			</picker-view>
			<picker-view v-if="pickerTypeCurIndex == 3" indicator-class="indicatorClass" :value="communityValue" @change="bindChange">
				<picker-view-column>
					<view class="item" v-for="(item,index) in communityList" :key="index">{{item.communityName}}</view>
				</picker-view-column>
			</picker-view>
			<picker-view v-if="pickerTypeCurIndex == 4" indicator-class="indicatorClass" :value="houseValue" @change="bindChange">
				<picker-view-column>
					<view class="item" v-for="(item,index) in houseList" :key="index">{{item.buildingNo}}</view>
				</picker-view-column>
			</picker-view>
		</view>

	</view>
</template>

<script>
	import uCharts from '../../util/u-charts.js'
	import {
		mapState,
		mapMutations
	} from "vuex";
	var canvaRing = null
	export default {
		data: function() {
			// var params = {
			// 		id: this.landladyInfo.id,
			// 		"communityId": "",
			// 		"houseId": "",
			// 		/**
			// 		 * 1-年 2-季 3-月
			// 		 * 年：只传startDate，格式为"yyyy"
			// 		 * 季：startDate和endDate都传，格式为“yyyy-MM”, "yyyy-MM"
			// 		 * 月：只传startDate，格式为"yyyy-MM"
			// 		 */
			// 		"dateType": "1", // 必填
			// 		"startDate": this.choosedDate,
			// 		"endDate": ""
			// 	}
			const date = new Date()
			const years = []
			const year = date.getFullYear()
			const months = []
			const month = date.getMonth() + 1
			const seasons = []
			const seasonsArr = ['01', '03', '04', '06', '07', '09', '10', '12']
			for (let i = 2015; i <= 2032; i++) {
				years.push(i)
				seasonsArr.forEach((item, index) => {
					if (index % 2 == 0) {
						let par = i + '.' + seasonsArr[index] + '~' + i + '.' + seasonsArr[index + 1]
						seasons.push(par)
					}
				})

			}
			for (let i = 1; i <= 12; i++) {
				months.push(i)
			}
			return {
				params: {
					id: '',
					"communityId": "",
					"houseId": "",
					/**
					 * 1-年 2-季 3-月
					 * 年：只传startDate，格式为"yyyy"
					 * 季：startDate和endDate都传，格式为“yyyy-MM”, "yyyy-MM"
					 * 月：只传startDate，格式为"yyyy-MM"
					 */
					"dateType": "1", // 必填
					"startDate": '',
					"endDate": ""
				},
				isCanClickSure: true, //是否触发点击确定取值
				itemProfitList: [{
						name: '租金',
						price: 1000
					},
					{
						name: '押金',
						price: 1000
					},
					{
						name: '宽带',
						price: 1000
					},
					{
						name: '水费',
						price: 1000
					},
					{
						name: '电费',
						price: 1000
					},
					{
						name: '其他',
						price: 1000
					},
				],
				cWidth: '',
				cHeight: '',
				chartData: {
					"series": [{
						"name": "租金",
						"data": 122
					}, {
						"name": "押金",
						"data": 122
					}, {
						"name": "宽带",
						"data": 50
					}, {
						"name": "水费",
						"data": 20
					}, {
						"name": "电费",
						"data": 18
					}, {
						"name": "其他",
						"data": 8
					}]
				},
				pixelRatio: 1,
				choosedCommunity: '',
				choosedHouse: '',
				choosedDate: year + '年' + month + '月',
				houseList: ['房屋1', '房屋2', '房屋3'],
				communityList: ['新德公寓', '青春里', '新凯家园'],
				pickerTypeCurIndex: 0,
				pickerTypeList: ['月', '季', '年'],
				years,
				year,
				months,
				month,
				seasons,
				seasonIndex: 0,
				monthValue: [year - 2015, month - 1],
				seasonValue: [(year - 2015) * 4 + this.seasonIndex],
				yearValue: [year - 2015],
				communityValue: [0],
				houseValue: [0],
				visible: false,
			}

		},
		computed: {
			...mapState(['landladyInfo']),
			// houseList() {
			// 		return this.communityList[this.communityValue[0]].houseList
			// }
		},
		onLoad() {
			let _this = this
			_this.cWidth = uni.upx2px(686);
			_this.cHeight = uni.upx2px(500);
			_this.getSeasonIndex()
			_this.seasonValue = [(_this.year - 2015) * 4 + _this.seasonIndex];
			_this.getReportPickerList(this.landladyInfo.id)
			_this.params.id = this.landladyInfo.id;
			_this.params.startDate = '2020'
			this.getReportFormData(this.params)
		},
		methods: {
			getReportFormData(par) {
				let _this = this;
				_this.$request.post('report/reportQuery',par).then((res)=>{
					console.log(res.data)
					let data = res.data.data
					let aa = _this.chartData.series
					_this.chartData.series[0].data = 120;
					_this.chartData.series[1].data = 160;
					_this.chartData.series[2].data = 46;
					_this.chartData.series[3].data = 25;
					_this.chartData.series[4].data = 122;
					_this.chartData.series[5].data = 52;
					_this.showRing("canvasRing", _this.chartData, _this,data.totalAmount);
					_this.itemProfitList[0].price = Number(data.total).toFixed(0);
					_this.itemProfitList[1].price = Number(data.depositAmount).toFixed(0);
					_this.itemProfitList[2].price = Number(data.netAmount).toFixed(0);
					_this.itemProfitList[3].price = Number(data.waterAmount).toFixed(0);
					_this.itemProfitList[4].price = Number(data.eleAmount).toFixed(0);
					_this.itemProfitList[5].price = Number(data.otherAmount).toFixed(0);
					console.log('你好不好',_this.chartData.series)
				})
			},
			getReportPickerList(id) {
				console
				let _this = this
				this.$request.post('report/findCommunityAndHouse', {
					id
				}).then((res) => {
					console.log(res)
					_this.communityList = res.data.data
					_this.houseList = res.data.data[0].houseList
				})
			},
			showRing(canvasId, chartData, that,totalAmount) {
				canvaRing = new uCharts({
					$this: that,
					canvasId: canvasId,
					type: 'ring',
					fontSize: 11,
					padding: [5, 5, 5, 5],
					legend: {
						show: true,
						position: 'top',
						float: 'center',
						itemGap: 10,
						padding: 5,
						lineHeight: 26,
						margin: 5,
						borderWidth: 1
					},
					background: '#FFFFFF',
					pixelRatio: that.pixelRatio,
					series: chartData.series,
					animation: false,
					width: that.cWidth * that.pixelRatio,
					height: that.cHeight * that.pixelRatio,
					disablePieStroke: true,
					dataLabel: true,
					subtitle: {
						name: '￥'+totalAmount,
						offsetX: -2,
						color: '#7cb5ec',
						fontSize: 18 * that.pixelRatio,
					},
					title: {
						offsetX: 4,
						name: '总收入',
						color: '#666666',
						fontSize: 15 * that.pixelRatio,
					},
					extra: {
						pie: {
							offsetAngle: 0,
							ringWidth: 40 * that.pixelRatio,
							labelWidth: 15
						}
					},
				});
			},
			touchRing(e) {
				canvaRing.touchLegend(e, {
					animation: false
				});
				canvaRing.showToolTip(e, {
					format: function(item) {
						return item.name + ':' + item.data
					}
				});
			},
			chooseCommuinty() {
				console.log('nihao')
				this.pickerTypeCurIndex = 3
				this.showPicker()
			},
			chooseHouse() {
				this.pickerTypeCurIndex = 4
				this.showPicker()
			},
			chooseDate() {
				this.showPicker()
				if (this.pickerTypeCurIndex == 3 || this.pickerTypeCurIndex == 4) {
					this.pickerTypeCurIndex = 0;
				}
			},
			showPicker() {
				this.isCanClickSure = true;
				this.visible = true;
			},
			hidePicker() {
				this.visible = false;
			},
			pickerCancel() {
				this.hidePicker()
			},
			pickerSure() {
				this.hidePicker();
				if (this.isCanClickSure) {
					switch (this.pickerTypeCurIndex) {
						case 1:
							this.choosedDate = this.seasons[this.seasonValue[0]]
							break;
						case 2:
							this.choosedDate = this.years[this.yearValue[0]] + '年'
							break;
						case 3:
							this.houseList = this.communityList[0].houseList
							this.choosedCommunity = this.communityList[0].communityName
							break;
						case 4:
							this.choosedHouse = this.houseList[0].buildingNo
							break;
						default:
							break;
					}
				}

			},
			getSeasonIndex() {
				switch (this.month) {
					case 1:
					case 2:
					case 3:
						this.seasonIndex = 0
						break;
					case 4:
					case 5:
					case 6:
						this.seasonIndex = 1
						break;
					case 7:
					case 8:
					case 9:
						this.seasonIndex = 2
						break;
					case 10:
					case 11:
					case 12:
						this.seasonIndex = 3
						break;
					default:
						break;
				}
			},
			choosePickerType(index) {
				this.pickerTypeCurIndex = index
			},
			bindChange: function(e) {
				console.log('我好烦', e)
				this.isCanClickSure = false
				const val = e.detail.value
				switch (this.pickerTypeCurIndex) {
					case 0:
						this.monthValue = val
						this.choosedDate = this.years[this.monthValue[0]] + '年' + this.months[this.monthValue[1]] + '月'
						break;
					case 1:
						this.seasonValue = val
						this.choosedDate = this.seasons[this.seasonValue[0]]
						break;
					case 2:
						this.yearValue = val
						this.choosedDate = this.years[this.yearValue[0]] + '年'
						break;
					case 3:
						this.communityValue = val;
						console.log(this.communityList, this.communityValue)
						this.choosedCommunity = this.communityList[this.communityValue[0]].communityName
						this.houseList = this.communityList[this.communityValue[0]].houseList
						console.log(this.choosedCommunity)
						break;
					case 4:
						this.houseValue = val;
						this.choosedHouse = this.houseList[this.houseValue[0]].buildingNo
						break;
					default:
						break;
				}
			}
		}
	}
</script>

<style>
	.reportForm {
		width: 100%;
		height: 100%;
		min-height: 100vh;
		background-color: #FAFAFA;
	}

	.whiteBg {
		background-color: #FFFFFF;
	}

	.sectionOne {
		padding: 30rpx 30rpx 38rpx 30rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		color: #333333;
	}

	.trinagle {
		width: 20rpx;
		height: 20rpx;
		margin-left: 12rpx;
		margin-top: 2rpx;
	}

	.sectionOne view:first-of-type {
		margin-right: auto;
	}

	.secDate {
		width: fit-content;
		height: 56rpx;
		display: flex;
		align-items: center;
		padding: 0 24rpx;
		font-size: 36rpx;
		border: 1px solid #DBDBDB;
		border-radius: 28px;
		background-color: #F5F5F5;
	}

	.secProfit {
		font-size: 32rpx;
	}

	.secProfit span {
		font-size: 40rpx;
		font-weight: bold;
	}

	.sectionTwo {
		width: 100%;
		height: 78rpx;
		font-size: 32rpx;
		font-weight: 500;
		/* display:flex; */
		border-top: 1rpx solid #F5F5F8;
	}

	.sectionTwo view {
		width: 50%;
		height: 100%;
		display: inline-flex;
		justify-content: center;
		align-items: center;
	}

	.sectionTwo view:first-of-type {
		border-right: 1rpx solid #F5F5F8;
	}

	.contentContainer {
		width: 686rpx;
		background-color: #FFFFFF;
		height: fit-content;
		margin: 22rpx auto 0 auto;
		padding-top: 28rpx;
	}

	.totalProfit {
		width: 100%;
		text-align: right;
		margin-bottom: 20rpx;
		padding-right: 30rpx;
		font-size: 32rpx;
		font-weight: bold;
	}

	.sectionThree {
		width: 100%;
		height: 500rpx;
		border-radius: 10rpx;
		position: relative;
	}

	.sectionFour {
		padding: 70rpx 35rpx 50rpx 35rpx;
	}

	.divide {
		width: 100%;
		height: 18rpx;
		position: absolute;
		bottom: -22rpx;
	}

	.secForItem {
		width: 100%;
		display: flex;
		justify-content: space-between;
		padding: 28rpx 0;
		border-bottom: 2rpx solid #F7F7F7;
		font-size: 32rpx;
	}

	.itemPrice {
		font-size: 24rpx;
	}

	.itemPrice span {
		font-size: 32rpx;
		font-weight: bold;
	}

	.charts {
		width: 100%;
		height: 100%;
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
		height: 740rpx;
	}

	.shorterPick {
		height: 560rpx !important;
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

	.pickerTypeList {
		width: 100%;
		border-top: 1rpx solid #EEEEEE;
	}

	.pickerTypeLi {
		width: 120rpx;
		height: 54rpx;
		line-height: 54rpx;
		text-align: center;
		color: #FFA044;
		font-size: 28rpx;
		font-weight: 500;
	}

	.pickerTypeLi:first-of-type,
	.pickerTypeLi:last-of-type {
		border-left: 1rpx solid #FFA044;
		border-right: 1rpx solid #FFA044;
	}

	.pickerTypeLi:first-of-type {
		border-top-left-radius: 5rpx;
		border-bottom-left-radius: 5rpx;
	}

	.pickerTypeLi:last-of-type {
		border-top-right-radius: 5rpx;
		border-bottom-right-radius: 5rpx;
	}

	.pickerLiOut {
		display: flex;
		width: fit-content;
		margin: 60rpx auto 0 auto;
		border-top: 1rpx solid #FFA044;
		border-bottom: 1rpx solid #FFA044;
		border-radius: 5rpx;
	}

	.pickerTypeLiActive {
		background-color: #FFA044;
		color: #FFFFFF;
	}

	.seasonsPicker {
		width: 60%;
		height: 300rpx;
		margin: 0 auto;
		display: flex;
		justify-content: space-between;
		align-items: center;
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
</style>
