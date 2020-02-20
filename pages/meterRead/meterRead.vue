<template>
	<view class="meterRead">
		<evan-form class="evanForm" :hide-required-asterisk="hideRequiredAsterisk" ref="form" :model="info"></evan-form>
		<view class="electricity">
			<view class="electricityTxt">电费</view>
			<view class="electricityDetail">
				<view class="left">抄表日期</view>
				<view class="date">
					<evan-form class="evanForm" :hide-required-asterisk="hideRequiredAsterisk" ref="form" :model="info">
						<evan-form-item prop="date" :border="false">
							<template v-slot:main>
								<picker mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange">
									<view style="fontWeight: normal;">{{date}}</view>
								</picker>
							</template>
						</evan-form-item>
					</evan-form>
				</view>
				<view class="right">
					<view class="rightPart">
						<image class="rightPartImg" src="../../static/right_arrow.png" mode=""></image>
					</view>
				</view>
			</view>
		</view>
		<view class="text">
			<view class="">上期读数</view>
			<view class="">本期读数</view>
			<view class="">费用</view>
		</view>
		<view class="money">
			<view class=""><input disabled="true" type="text" maxlength="5" v-model="prevNum" /></view>
			<view class="" style="text-align: center;"><input type="digit" maxlength="5" @input="inputChangeHandle" placeholder="0"
				 v-model="currentNum" /></view>
			<view class="" style="text-align: right;"><input disabled="true" type="digit" v-model="amount" readonly /></view>
		</view>
		<view class="button" @click="submit">完成</view>
	</view>
</template>

<script>
	import chooseList from '../../components/chooseList.vue';
	import chnToNumber from '../../util/index';
	import moment from 'moment';
	import evanFormItem from '../../components/evan-form/evan-form-item.vue';
	import evanForm from '../../components/evan-form/evan-form.vue';
	export default {
		components: {
			evanFormItem,
			evanForm,
			chooseList
		},
		computed: {
			amount() {
				let _this = this
				return parseInt((this.currentNum - this.prevNum) * this.electricityInfo.unitPrice)  <= 0 ? '0.00' : (this.currentNum - this.prevNum) * this.electricityInfo.unitPrice+
					'.00';
			},
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			}
		},
		data() {
			const currentDate = this.getDate({
            format: true
        });
			return {
				// amount:'0.00',
				date: currentDate,
				prevNum: '0',
				currentNum: '',
				info: {
					date: ''
				},
				billInfo: {}, // 账单列表
				electricityInfo: {} // 电费列表
			};
		},
		onLoad(option) {
			let _this = this
			this.electricityInfo = JSON.parse(option.electricityInfo)
			this.billInfo = JSON.parse(option.billInfo);
			this.billInfo.items.push(this.electricityInfo)
			// this.billInfo.items.map(item => {
			// 	if (item.itemName == '电费') {
			// 		_this.electricityInfo = item
			// 	}
			// })
			this.prevNum = this.electricityInfo.prevNum ? this.electricityInfo.prevNum : 0;
		},
		methods: {
			bindDateChange(e) {
				console.log('nihaoa', e);
				this.date = e.detail.value;
			},
			inputChangeHandle(e) {
				console.log(e)
				this.currentNum = e.detail.value
				if (+e.detail.value < +this.prevNum) {
					uni.showToast({
						title: '本期读数不能小于上期读数!',
						icon: 'none'
					});
					return;
				} else {
					// console.log(this.currentNum,this.prevNum)
					// this.amount = this.currentNum <= this.prevNum ? '0.00' : (this.currentNum - this.prevNum) * this.electricityInfo.unitPrice +
					// 	'.00';
				}
			},
			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();

				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year + 2;
				}
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			},
			submit() {
				let _this = this;
				if (!isNaN(_this.prevNum) && !isNaN(_this.currentNum)) {
					if (+_this.currentNum > +_this.prevNum) {
						_this.billInfo.items.map(v => {
							if (v.itemName == '电费') {
								v.noteDate = _this.date + ' 00:00:00';
								v.prevNum = _this.prevNum;
								v.currentNum = _this.currentNum;
								v.amount = _this.amount;
							}
						});
						_this.billInfo.items = [..._this.billInfo.items];
						console.log('传参数', _this.billInfo);
						_this.$request.post('/bill/updateItems', _this.billInfo).then(res => {
							console.log('请求反回', res);
							if (res.data.code == 200) {
								uni.showToast({
									title:'抄表成功',
									duration:1500
								})
								setTimeout(()=>{
									uni.navigateBack({
										delta: 1
									});
								},1500)
							}
						});
					} else {
						uni.showToast({
							title: '本期读数不能小于上期读数!',
							icon: 'none'
						});
					}
				} else {
					uni.showToast({
						title: '上期读数和本期读数必须要为数字!',
						icon: 'none'
					});
				}
			},
			refreshLastPage() {
				setTimeout(() => {
					let pages = getCurrentPages();
					if (pages.length > 1) {
						let beforePage = pages[pages.length - 2];
						beforePage.$vm.updateData();
						uni.navigateBack({
							delta: 1
						});
					}
				}, 1500);
			}
		}
	};
</script>

<style>
	.meterRead {
		height: 100vh;
		width: 100%;
		background-color: #fafafa;
		position: relative;
	}

	.electricity {
		/* height: 100%; */
		width: 100%;
		padding: 33rpx 60rpx 0rpx 41rpx;
		margin-bottom: 17rpx;
		background: #FFFFFF;
	}

	.electricityTxt {
		font-size: 30rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: rgba(51, 51, 51, 1);
	}

	.electricityDetail {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		position: relative;
	}

	.left {
		font-size: 30rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(51, 51, 51, 1);
	}

	.rightPartImg {
		width: 24rpx;
		height: 24rpx;
	}

	.right {
		position: absolute;
		top: 36rpx;
		right: -31rpx;
	}

	.date {
		font-size: 30rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(153, 153, 153, 1);
	}

	.text,
	.money {
		padding: 0rpx 45rpx;
		width: 100%;
		height: 94rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 30rpx;
		font-family: PingFang SC;
		font-weight: 500;
		background: #FFFFFF;
	}

	.money {
		padding: 0rpx 45rpx 0rpx 60rpx;
		color: rgba(153, 153, 153, 1);
	}

	.text {
		color: rgba(51, 51, 51, 1);
		border-bottom: 2rpx solid #EBEBEB80;
	}

	.button {
		position: absolute;
		bottom: 89rpx;
		left: 246rpx;
		width: 257rpx;
		height: 74rpx;
		background: linear-gradient(-90deg, rgba(243, 183, 73, 1) 0%, rgba(240, 154, 66, 1) 100%);
		border-radius: 37rpx;
		font-size: 32rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
		text-align: center;
		line-height: 74rpx;
	}
</style>
