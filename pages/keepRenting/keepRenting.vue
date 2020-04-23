<template>
	<view class="keepRenting">

		<view class="form-container whiteBg">
			<view class="titleBar">
				当前合约
			</view>
			<evan-form class="evanForm" :hide-required-asterisk="hideRequiredAsterisk" ref="form" :model="info">
				<view class="section1">
					<evan-form-item label="月租金" prop="rentUnitPrice">
						<template v-slot:main>
							<input class="form-input" type="digit" placeholder-class="form-input-placeholder" v-model="info.rentUnitPrice"
							 placeholder="0.00" @input="myInput1"/>
						</template>
						<template v-slot:tip>
							<image class="inpArrow" src="../../static/right_arrow.png" mode="aspectFit"></image>
						</template>
					</evan-form-item>
					<evan-form-item label="到租日期" prop="endDate" :border="false">
						<template v-slot:main>
							<picker class="form-input" disabled="true" mode="date" data-type="start" :value="endDate" :start="startDate" @change="bindDateChange">{{ endDate }}</picker>
						</template>
						<template v-slot:tip>
							<image class="inpArrow" src="../../static/right_arrow.png" mode="aspectFit"></image>
						</template>
					</evan-form-item>
				</view>
				<view class="titleBar">
					续租合约
				</view>
				<view class="section2">
					<view class="keepDateList">
						<view class="keepDateLi" :class="{ keepDateLiActive: currentLiIndex == index }" v-for="(item, index) in keepDateList"
						 :key="index" @click="chooseLi(index)">
							{{ item }}
						</view>
					</view>
					<evan-form-item label="到租日期" prop="keepEndDate">
						<template v-slot:main>
							<picker class="form-input" mode="date" data-type="start" :value="keepEndDate" :start="startDate" @change="bindDateChange">{{ keepEndDate }}</picker>
						</template>
						<template v-slot:tip>
							<image class="inpArrow" src="../../static/right_arrow.png" mode="aspectFit"></image>
						</template>
					</evan-form-item>
					<evan-form-item label="续约租金" prop="keepRentPrice" :border="false">
						<template v-slot:main>
							<input class="form-input" type="digit" placeholder-class="form-input-placeholder" v-model="info.keepRentPrice"
							 placeholder="0.00" @input="myInput2" />
						</template>
						<template v-slot:tip>
							<image class="inpArrow" src="../../static/right_arrow.png" mode="aspectFit"></image>
						</template>
					</evan-form-item>
				</view>
			</evan-form>
		</view>
		<view class="save" @click="save">保存</view>
	</view>
</template>

<script>
	import {
		dateForm,moneyLimit
	} from '../../util/index.js';
	import evanFormItem from '../../components/evan-form/evan-form-item.vue';
	import evanForm from '../../components/evan-form/evan-form.vue';
	import moment from 'moment';
	export default {
		components: {
			evanFormItem,
			evanForm,
		},
		data() {
			const currentDate = this.$getDate();
			return {
				renterInfo: {},
				id: null,
				keepEndDate: '',
				currentLiIndex: 1,
				keepDateList: ['半年', '1年', '2年', '其他'],
				endDate: currentDate,
				info: {
					rentUnitPrice: '',
					keepEndDate: '',
					keepRentPrice: ''
				},
				rules: {
					rentUnitPrice: {
						required: true,
						message: '请输入当前合约月租金'
					},

					keepEndDate: {
						required: false,
						message: '请选择续约到期时间'
					},
					keepRentPrice: {
						required: false,
						message: '请输入续约月租金'
					},
				}
			}
		},
		computed: {
			rentMonthNum() {
				//用-分成数组
				let _this = this;
				if (_this.renterInfo.startDate) {
					let date1 = dateForm(_this.renterInfo.startDate).split("-");
					let date2 = dateForm(_this.keepEndDate).split("-");
					//获取年,月数
					var year1 = parseInt(date1[0]),
						month1 = parseInt(date1[1]),
						year2 = parseInt(date2[0]),
						month2 = parseInt(date2[1]),
						//通过年,月差计算月份差
						months = (year2 - year1) * 12 + (month2 - month1);
					return months;
				}
			}
		},
		onShow() {},
		onLoad(options) {
			this.id = options.id
			this.$nextTick(() => {
				this.$refs.form.setRules(this.rules)
			})
			this.getRenterInfo(this.id)
		},
		methods: {
			myInput1(e){
				this.info.rentUnitPrice = moneyLimit(e.detail.value)
			},
			myInput2(e){
				this.info.keepRentPrice = moneyLimit(e.detail.value)
			},
			getRenterInfo(id) {
				this.$request.post('/roomUser/findByTenantId', {
					tenantId: id
				}).then((res) => {
					let data = res.data.data;
					this.renterInfo = data;
					this.info.rentUnitPrice = data.rentPrice;
					this.info.keepRentPrice = data.rentPrice;
					this.endDate = dateForm(data.endDate)
					this.chooseLi(1)
				})
			},
			save() {
				let _this = this;
				this.$refs.form.validate(res => {
					if (res) {
						_this.renterInfo.rentMonthNum = _this.rentMonthNum;
						_this.renterInfo.rentPrice = _this.info.keepRentPrice;
						_this.renterInfo.endDate = _this.keepEndDate + ' 00:00:00';
						let par = _this.renterInfo;
						par.historyStatus = 0;
						_this.$request.post('/roomUser/reletTenant',par).then((data)=>{
							if(data.data.code == 200){
								uni.showToast({
									title:'续租成功！',
									duration:1500
								})
								setTimeout(()=>{
									uni.navigateBack()
								},1500)
							}
						})
					}
				})
			},
			chooseLi(index) {
				this.currentLiIndex = index
				this.keepEndDate = this.getKeepDate(index)
			},
			getKeepDate(index) {
				let keepDate;
				let _this = this;
				switch (index) {
					case 0:
						keepDate = moment(this.endDate)
							.add(6, 'month')
							// .subtract(1, 'days');
						break;
					case 1:
						keepDate = moment(this.endDate)
							.add(12, 'month')
							// .subtract(1, 'days');
						break;
					case 2:
						keepDate = moment(this.endDate)
							.add(24, 'month')
							// .subtract(1, 'days');
						break;
					case 3:
						uni.showToast({
							title: '请自己选择租期',
							icon: 'none'
						});
						break;
					default:
						break;
				}
				if (index != 3) {
					return this.$getDate(keepDate);
				} else {
					return this.endDate;
				}
			},
			bindDateChange(e) {
				//比较到租日期和今天的大小
				let time1 = new Date((this.endDate).replace(/\-/g, '/'))
				let maxDate = Date.parse(time1) > Date.parse(new Date()) ? Date.parse(time1) : Date.parse(new Date())
				if(maxDate >  Date.parse(new Date((e.detail.value).replace(/\-/g, '/')))){
					uni.showToast({
						title:'续租日期不能小于到租日期和当前日期',
						icon:'none',
						duration:1500
					})
				}else{
					this.keepEndDate = e.detail.value
				}
			}
		}
	}
</script>

<style scoped>
	.keepRenting {
		min-height: 100vh;
		height: 100%;
		width: 100%;
		background-color: #FAFAFA;
	}

	.titleBar {
		padding: 36rpx 0 26rpx 18rpx;
		font-size: 34rpx;
		font-weight: bold;
		background-color: #FAFAFA;
	}

	.section1,
	.section2,
	.section3,
	.section4 {
		padding: 0 24rpx;
		border-radius: 5rpx;
	}

	.whiteBg {
		background: #FFFFFF;
	}

	.divideBottom {
		border-bottom: 14rpx solid #FAFAFA;
	}

	.form-container {
		width: calc(100% - 34rpx);
		margin-left: 17rpx;
		color: #333333;
	}

	.inpArrow {
		width: 30rpx;
		height: 24rpx;
		margin-left: 8rpx;
	}

	.keepDateList {
		/* height: 93rpx; */
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		border-bottom: 3rpx solid #EBEBEB80;
		padding-bottom: 32rpx;
	}

	.keepDateLi {
		width: calc((100% - 69rpx) / 4);
		height: 60rpx;
		text-align: center;
		line-height: 60rpx;
		border-radius: 10rpx;
		margin-right: 23rpx;
		color: #666666;
		border: 1rpx solid #D2D2D2;
	}

	.keepDateLiActive {
		border: 1rpx solid #FFA344;
		color: #FFA344;
	}

	.keepDateLi:last-of-type {
		margin-right: unset;
	}

	.save {
		width: 257rpx;
		height: 82rpx;
		line-height: 82rpx;
		text-align: center;
		background: linear-gradient(-90deg, rgba(234, 185, 93, 1) 0%, rgba(228, 158, 84, 1) 100%);
		border-radius: 41rpx;
		font-size: 34rpx;
		color: #FFFFFF;
		margin: 230rpx auto 0 auto;
	}
</style>
