<template>
	<view class="addLandLord">
		<view class="section1 whiteBg">
			<evan-form class="evanForm" :hide-required-asterisk="hideRequiredAsterisk" ref="form1" :model="info1">
				<evan-form-item label="姓名" prop="name" :fontBold="true">
					<template v-slot:main>
						<input class="form-input" placeholder-class="form-input-placeholder" v-model="info1.name" placeholder="房东姓名" />
					</template>
					<template v-slot:tip>
						<image class="inpArrow" src="../../static/right_arrow.png" mode="aspectFit"></image>
					</template>
				</evan-form-item>
				<evan-form-item label="电话" prop="tel" :border="false" :fontBold="true">
					<template v-slot:main>
						<input class="form-input" type="number" maxlength="11" placeholder-class="form-input-placeholder" @input="getPhone"
						 v-model="info1.tel" placeholder="房东电话" />
					</template>
					<template v-slot:tip>
						<image class="inpArrow" src="../../static/right_arrow.png" mode="aspectFit"></image>
					</template>
				</evan-form-item>
			</evan-form>
		</view>
		<view class="section2 whiteBg">
			<evan-form class="evanForm" :hide-required-asterisk="hideRequiredAsterisk" ref="form2" :model="info2">
				<evan-form-item label="起租日期" prop="startDate" :fontBold="true">
					<template v-slot:main>
						<picker class="form-input" mode="date" data-type="start" :value="date" :start="startDate" @change="bindDateChange">{{ date }}</picker>
					</template>
					<template v-slot:tip>
						<image class="inpArrow" src="../../static/right_arrow.png" mode="aspectFit"></image>
					</template>
				</evan-form-item>
				<view class="keepDateName">租期</view>
				<view class="keepDateList">
					<view class="keepDateLi" :class="{ keepDateLiActive: currentLiIndex == index }" v-for="(item, index) in keepDateList"
					 :key="index" @click="chooseLi(index)">
						{{ item }}
					</view>
				</view>
				<evan-form-item label="到租日期" prop="startDate" :fontBold="true">
					<template v-slot:main>
						<picker class="form-input" mode="date" data-type="end" :value="endDate" :start="startDate" @change="bindDateChange">{{ endDate }}</picker>
					</template>
					<template v-slot:tip>
						<image class="inpArrow" src="../../static/right_arrow.png" mode="aspectFit"></image>
					</template>
				</evan-form-item>
				<evan-form-item label="收租周期" prop="rentCycle" :fontBold="true">
					<template v-slot:main>
						<choose-list v-if="listShow" :currentChooseIndex="chooseIndex" v-on:close="hideList" :list="list" :title="'选择收租周期'"
						 v-on:emitClick="returnEmit"></choose-list>
						<input class="form-input" disabled="true" placeholder-class="form-input-placeholder" v-model="info2.rentCycle"
						 placeholder="请选择收租周期" @click="showList" />
					</template>
					<template v-slot:tip>
						<image class="inpArrow" src="../../static/triangle.png" mode="aspectFit"></image>
					</template>
				</evan-form-item>
				<evan-form-item label="月租金" prop="rentUnitPrice" :fontBold="true">
					<template v-slot:main>
						<input class="form-input" type="digit" maxlength="6" placeholder-class="form-input-placeholder" v-model="info2.rentUnitPrice"
						 placeholder="0.00" @input="checkInput"/>
					</template>
					<template v-slot:tip>
						<image class="inpArrow" src="../../static/right_arrow.png" mode="aspectFit"></image>
					</template>
				</evan-form-item>
				<evan-form-item label="押金" prop="deposit" :border="false" :fontBold="true">
					<template v-slot:main>
						<input class="form-input" type="digit" maxlength="6" placeholder-class="form-input-placeholder" v-model="info2.deposit"
						 placeholder="0.00"  @input="checkInput1"/>
					</template>
					<template v-slot:tip>
						<image class="inpArrow" src="../../static/right_arrow.png" mode="aspectFit"></image>
					</template>
				</evan-form-item>
			</evan-form>
		</view>
		<view class="section3 whiteBg">
			<view class="remarkTitle">备注</view>
			<textarea class="secTip textOverFlow" v-model="remarks" placeholder-class="textPlaceholder"></textarea>
		</view>
		<cover-view class="btnBoxMy">
			<cover-view class="sureBtn" @click="save">保存</cover-view>
		</cover-view>
	</view>
</template>

<script>
	import {moneyLimit} from '../../util/index.js'
	import moment from 'moment';
	import chooseList from '../../components/chooseList.vue';
	import evanFormItem from '../../components/evan-form/evan-form-item.vue';
	import evanForm from '../../components/evan-form/evan-form.vue';
	export default {
		components: {
			evanFormItem,
			evanForm,
			chooseList
		},
		data() {
			const currentDate = this.$getDate();
			return {
				currentLiIndex: null,
				ownerId: null,
				remarks: '',
				list: [],
				keepDateList: ['3年', '5年', '8年', '其他'],
				chooseIndex: null,
				listShow: false,
				endDate: '',
				date: currentDate,
				info1: {
					name: '',
					tel: '',
				},
				info2: {
					rentCycle: '',
					rentUnitPrice: '',
					deposit: ''
				},
				rules2: {
					rentCycle: {
						required: true,
						message: '请选择交租周期'
					},
					rentUnitPrice: {
						required: true,
						message: '请输入每期租金'
					},
					deposit: {
						required: true,
						message: '请输入押金'
					}
				},
				rules1: {
					name: {
						required: true,
						message: '请输入房东姓名'
					},
					tel: [{
							required: true,
							message: '请输入房东电话'
						},
						{
							validator: (rules1, tel, callback) => {
								if (this.$validate.isMobilePhone(tel)) {
									callback();
								} else {
									callback(new Error('手机号格式不正确'));
								}
							}
						}
					],
				},
			}
		},
		computed: {
			//获取相差的月份
			rentMonthNum() {
				let date1, date2
				//用-分成数组
				date1 = this.date.split("-");
				date2 = this.endDate.split("-");
				//获取年,月数
				var year1 = parseInt(date1[0]),
					month1 = parseInt(date1[1]),
					year2 = parseInt(date2[0]),
					month2 = parseInt(date2[1]),
					//通过年,月差计算月份差
					months = (year2 - year1) * 12 + (month2 - month1);
				return months;
			},
			//交租周期
			payRentCycle() {
				let monthNum
				if (this.chooseIndex != null) {
					monthNum = parseInt(this.chooseIndex) + 1;
					return monthNum
				} else {
					return ''
				}
			}
		},
		onShow() {
			if (this.isEdit) {
				setTimeout(() => {
					this.getOwnerInfo(this.ownerId)
				}, 1000)
			}
		},
		onLoad(options) {
			if (options.ownerId) {
				this.isEdit = true;
				this.ownerId = options.ownerId;
				uni.setNavigationBarTitle({
					title: '业主信息'
				})
			}
			this.houseId = options.houseId
			this.getRentCycleList()
			this.$nextTick(() => {
				this.$refs.form1.setRules(this.rules1)
				this.$refs.form2.setRules(this.rules2)
			})
			this.getEndDate()
		},
		methods: {
			checkInput(e){
				this.info2.rentUnitPrice = moneyLimit(e.detail.value)
			},
			checkInput1(e){
				this.info2.deposit = moneyLimit(e.detail.value)
			},
			chooseLi(index,isEdit){
				if(isEdit){
					this.currentLiIndex = index == 36 ? 0 : (index == 60 ? 1 : (index == 96 ? 2 : 3))
				}else{
					this.currentLiIndex = index;
					this.endDate = this.getKeepDate(index)
				}
			},
			getKeepDate(index) {
				let keepDate;
				let _this = this;
				switch (index) {
					case 0:
						keepDate = moment(this.date)
							.add(3, 'years')
							// .subtract(1, 'days');
						break;
					case 1:
						keepDate = moment(this.date)
							.add(5, 'years')
							// .subtract(1, 'days');
						break;
					case 2:
						keepDate = moment(this.date)
							.add(8, 'years')
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
					return this.date;
				}
			},
			getPhone(e) {
				let _this = this
				let value = e.detail.value;
				if (value.length == 11) {
					if (!_this.$validate.isMobilePhone(value)) {
						uni.showToast({
							title: '手机号码格式有误',
							icon: 'none',
						})
					}
				}
			},
			getEndDate() {
				let myDate
				this.currentLiIndex = 1
				myDate = moment(this.date)
					.add(5, 'years')
				// .subtract(1, 'days');
				this.endDate = this.$getDate(myDate)
			},
			getRentCycleList() {
				let _this = this;
				return new Promise((reslove, rej) => {
					_this.$request.post('/dict/findByParentName', {
						name: 'OWNER_RENT_CYCLE'
					}).then(res => {
						_this.list = []
						res.data.data.forEach(item => {
							_this.list.push(item.name)
						})
						reslove(true)
					})
				})
			},
			returnEmit(e) {
				console.log(e);
				// this.rentCycleList = chnToNumber.chnToNumber(e.newVal);
				// console.log('大家好啊', this.rentCycleList);
				this.info2.rentCycle = e.newVal;
				this.chooseIndex = e.index;
				this.listShow = false;
			},
			showList() {
				this.listShow = true;
			},
			hideList() {
				this.listShow = false;
			},
			getOwnerInfo(id) {
				this.$request.post('/owner/findById', {
					id
				}).then((res) => {
					console.log(res)
					let data = res.data.data
					this.info1.name = data.ownerName;
					this.info1.tel = data.ownerPhone;
					this.date = data.startDate.substr(0, 10);
					this.endDate = data.endDate.substr(0, 10);
					this.chooseLi(data.rentMonthNum,true)
					this.info2.rentUnitPrice = data.rentPrice;
					this.info2.deposit = data.depositAmount;
					this.remarks = data.remarks;
					let rentIndex = parseInt(data.payRentCycle) - 1
					this.chooseIndex = rentIndex;
					this.info2.rentCycle = this.list[rentIndex];
					// this.payRentCycle          =data.
					// this.rentMonthNum          =data.
				})
			},
			save() {
				let _this = this;
				let par = {
					"landlordId": this.$store.state.landladyInfo.id,
					"houseId": this.houseId,
					"ownerName": this.info1.name,
					"ownerPhone": this.info1.tel,
					"startDate": this.date + ' 00:00:00',
					"endDate": this.endDate + ' 00:00:00',
					"rentMonthNum": this.rentMonthNum,
					"payRentCycle": this.payRentCycle,
					"rentPrice": this.info2.rentUnitPrice,
					"depositAmount": this.info2.deposit,
					"remarks": this.remarks
				}
				if (this.isEdit) {
					par.id = this.ownerId
				}
				let postUrl = this.isEdit ? '/owner/update' : '/owner/bindOwner';
				_this.$refs.form1.validate(res1 => {
					if (res1) {
						_this.$refs.form2.validate(res2 => {
							if (res2) {
								_this.$request.post(postUrl, par).then((data) => {
									console.log(data)
									let result = data.data
									if (result.code == '200') {
										uni.showToast({
											title: _this.isEdit ? '编辑业主成功' : '绑定业主成功',
											duration: 1500
										})
										setTimeout(() => {
											uni.navigateBack()
										}, 2000)
									}
								})
							}
						})
					}
				})

			},
			bindDateChange(e) {
				console.log(e)
				let type = e.currentTarget.dataset.type;
				if (type == 'start') {
					this.date = e.detail.value;
				} else {

					let time1 = new Date((this.date).replace(/\-/g, '/'))
					let time2 = new Date((e.detail.value).replace(/\-/g, '/'))
					if (Date.parse(time1) > Date.parse(time2)) {
						uni.showToast({
							title: '选择到租日期必须必起租日期大',
							icon: 'none',
							duration: 1500
						})
					} else {
						this.endDate = e.detail.value;
					}
				}

			},
		}
	}
</script>

<style scoped>
	.addLandLord {
		min-height: 100vh;
		height: 100%;
		width: 100%;
		background-color: #FAFAFA;
		padding-top: 30rpx;
		padding-bottom: 140rpx;
	}

	.whiteBg {
		background-color: #FFFFFF;
	}

	.inpArrow {
		width: 30rpx;
		height: 24rpx;
		margin-left: 8rpx;
	}

	.form-input {
		font-size: 34rpx;
	}

	.section1,
	.section2,
	.section3 {
		padding: 0 40rpx;
		font-size: 32rpx;
		color: #333333;
		margin-bottom: 17rpx;
	}

	.secTip {
		width: 100%;
		height: 180rpx;
		padding-bottom: 20rpx;
		font-size: 34rpx;
		color: #333333;
		margin-top: 17rpx;
	}

	.textPlaceholder {
		padding: 32rpx 0 30rpx 0;
		color: #999999;
		font-size: 34rpx;
	}

	.sureBtn {
		width: 257rpx;
		height: 82rpx;
		line-height: 82rpx;
		text-align: center;
		border-radius: 40rpx;
		color: #FFFFFF;
		background: #FFA044;
		font-size: 34rpx;
		display: inline-block;
		vertical-align: middle;
	}

	.remarkTitle {
		margin-top: 17rpx;
		padding: 28rpx 0;
		font-size: 34rpx;
		color: #999999;
		border-bottom: 2rpx solid #EBEBEB;
	}
	.btnBoxMy {
		width: 100%;
		/* padding: 0 85rpx; */
		height: 128rpx;
		line-height: 128rpx;
		text-align: center;
		background-color: #FFFFFF;
		position: fixed;
		bottom: 0;
		left: 0;
		box-shadow: 0px -5px 16px 0px rgba(0, 0, 0, 0.04);
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
	.keepDateName{
		font-size: 34rpx;
		color: #333333;
		font-weight: bold;
		padding: 30rpx 0;
	}
</style>
