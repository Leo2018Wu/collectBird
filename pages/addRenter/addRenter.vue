<template>
	<view class="addRenter">
		<view class="housTitle whiteBg">{{ commInfo.name }}-{{ commInfo.houseNo }}-卧室{{ commInfo.roomNo }}</view>
		<view class="section1 whiteBg">
			<evan-form class="evanForm" :hide-required-asterisk="hideRequiredAsterisk" ref="form1" :model="info1">
				<evan-form-item label="姓名" prop="name">
					<template v-slot:main>
						<input class="form-input" :disabled="isEdit" placeholder-class="form-input-placeholder" v-model="info1.name" placeholder="租客姓名" />
					</template>
					<template v-slot:tip>
						<image class="inpArrow" src="../../static/right_arrow.png" mode="aspectFit"></image>
					</template>
				</evan-form-item>
				<evan-form-item label="性别" prop="sex">
					<template v-slot:main>
						<radio-group class="sexRadio"  name="sexRadio" @change="radioChange" >
							<label style="display: flex;justify-content: flex-end;">
								<view v-for="(item, index) in sexList" :key="index">
									<radio :value="item.value" :disabled="isEdit" :checked="index === currentSex" color="#FFA344" />
									<text>{{ item.name }}</text>
								</view>
							</label>
						</radio-group>
						<!-- <input class="form-input" placeholder-class="form-input-placeholder" v-model="info1.name" placeholder="租客姓名" /> -->
					</template>
				</evan-form-item>
				<evan-form-item label="电话" prop="tel">
					<template v-slot:main>
						<input class="form-input" :disabled="isEdit" type="number" maxlength="11" placeholder-class="form-input-placeholder" v-model="info1.tel"
						 placeholder="租客电话" @input="getPhone" />
					</template>
					<template v-slot:tip>
						<image class="inpArrow" src="../../static/right_arrow.png" mode="aspectFit"></image>
					</template>
				</evan-form-item>
				<evan-form-item label="身份证号" prop="IDNum">
					<template v-slot:main>
						<input class="form-input" :disabled="isEdit" type="idcard" placeholder-class="form-input-placeholder" maxlength="18" v-model="info1.IDNum"
						 placeholder="身份证号" @input="getID" />
					</template>
					<template v-slot:tip>
						<image class="inpArrow" src="../../static/right_arrow.png" mode="aspectFit"></image>
					</template>
				</evan-form-item>
			</evan-form>
			<view class="idImgBox">
				<view class="idName">身份证照片</view>
				<view class="chooseIdImg0" @click="chooseImg(false)">
					<image v-if="imgSideUrl" :src="imgSideUrl" mode="aspectFill"></image>
					<image v-if="!imgSideUrl" src="../../static/idImg0.png" mode="aspectFit"></image>
				</view>
				<view class="chooseIdImg1" @click="chooseImg(true)">
					<image v-if="imgOtherSideUrl" :src="imgOtherSideUrl" mode="aspectFill"></image>
					<image v-if="!imgOtherSideUrl" src="../../static/idImg1.png" mode="aspectFit"></image>
				</view>
			</view>
		</view>
		<view class="section2 whiteBg">
			<view class="section2Name">签约资料</view>
			<evan-form class="evanForm" :hide-required-asterisk="hideRequiredAsterisk" ref="form2" :model="info2">
				<evan-form-item label="起租日期" prop="startDate">
					<template v-slot:main>
						<picker class="form-input" :disabled="isEdit" mode="date" :value="date" :start="startDate" @change="bindDateChange">{{ date }}</picker>
						<input v-show="false" class="form-input" placeholder-class="form-input-placeholder" v-model="info2.startDate"
						 placeholder="请选择" />
					</template>
					<template v-slot:tip>
						<image class="inpArrow" src="../../static/right_arrow.png" mode="aspectFit"></image>
					</template>
				</evan-form-item>
				<evan-form-item label="租期" prop="keepDate" :border="false">
					<template v-slot:main>
						<picker class="form-input" :disabled="isEdit" mode="date" :value="pickerKeepDate" :start="startDate" @change="bindKeepDateChange">{{ pickerKeepDate }}</picker>
						<input v-show="false" class="form-input" placeholder-class="form-input-placeholder" v-model="info2.keepDate" placeholder="请选择" />
					</template>
					<template v-slot:tip>
						<image class="inpArrow" src="../../static/right_arrow.png" mode="aspectFit"></image>
					</template>
				</evan-form-item>
				<view class="keepDateList">
					<view class="keepDateLi" :class="{ keepDateLiActive: currentLiIndex == index }" v-for="(item, index) in keepDateList"
					 :key="index" @click="chooseLi(index)">
						{{ item }}
					</view>
				</view>
				<evan-form-item label="收租周期" prop="rentCycle">
					<template v-slot:main>
						<choose-list v-if="listShow" :currentChooseIndex="chooseIndex" v-on:close="hideList" :list="list" :title="'选择收租周期'"
						 v-on:emitClick="returnEmit"></choose-list>
						<input class="form-input" :disabled="isEdit" placeholder-class="form-input-placeholder" v-model="info2.rentCycle"
						 placeholder="请选择收租周期" @click="showList" />
					</template>
					<template v-slot:tip>
						<image class="inpArrow" src="../../static/right_arrow.png" mode="aspectFit"></image>
					</template>
				</evan-form-item>
				<evan-form-item label="月租金" prop="rentUnitPrice">
					<template v-slot:main>
						<input class="form-input" type="number" :disabled="isEdit" placeholder-class="form-input-placeholder" v-model="info2.rentUnitPrice"
						 placeholder="请输入" @input="espInput" />
					</template>
					<template v-slot:tip>
						<image class="inpArrow" src="../../static/right_arrow.png" mode="aspectFit"></image>
					</template>
				</evan-form-item>
				<evan-form-item label="押金" prop="deposit" :border="false">
					<template v-slot:main>
						<input class="form-input" :disabled="isEdit" placeholder-class="form-input-placeholder" v-model="info2.deposit" placeholder="请输入" />
					</template>
					<template v-slot:tip>
						<image class="inpArrow" src="../../static/right_arrow.png" mode="aspectFit"></image>
					</template>
				</evan-form-item>
			</evan-form>
		</view>
		<view class="section3 whiteBg">
			<view class="section2Name">基本费用</view>
			<evan-form class="evanForm" :hide-required-asterisk="hideRequiredAsterisk" ref="form3" :model="info3">
				<evan-form-item label="电费(1元/度)" prop="eleCost">
					<template v-slot:main>
						<input class="form-input inputColor" :disabled="isEdit" type="digit" maxlength="5" placeholder-class="form-input-placeholder" v-model="info3.eleCost"
						 placeholder="请输入初始刻度" />
					</template>
				</evan-form-item>
				<evan-form-item label="水费(元/月)" prop="waterCost">
					<template v-slot:main>
						<input class="form-input inputColor" :disabled="isEdit" type="digit" placeholder-class="form-input-placeholder" v-model="info3.waterCost"
						 placeholder="请输入水费" />
					</template>
				</evan-form-item>
				<evan-form-item label="宽带(元/月)" prop="netCost" :border="false">
					<template v-slot:main>
						<input class="form-input inputColor" :disabled="isEdit" type="digit" placeholder-class="form-input-placeholder" v-model="info3.netCost"
						 placeholder="请输入宽带费" />
					</template>
				</evan-form-item>
				<!-- <view class="section4 whiteBg">
					<evan-form-item prop="remarks" :border="false">
						<template v-slot:main>
							<textarea class="secTip textOverFlow" placeholder="备注" value v-model="info3.remarks" placeholder-class="textPlaceholder"></textarea>
						</template>
					</evan-form-item>
				</view> -->
			</evan-form>
		</view>
		<view class="section4 whiteBg"><textarea class="secTip textOverFlow" :disabled="isEdit" placeholder="备注" v-model="remarks"
			 placeholder-class="textPlaceholder"></textarea></view>
		<view v-if="!isEdit" class="sureBtn" @click="save">保存</view>
		<view v-if="isEdit" class="delBtn" @click="deleteRenter">删除</view>
		<tip-modal v-if="isShowTipModal" :title="'删除租客'" :describition="'删除租客将删除租客全部账单，是否确认删除?'" v-on:emitCancel="hideTipModal" v-on:emitSure="returnSure"></tip-modal>
		<cover-view v-if="isShowSureModal" class="modalMask" @catchtouchmove='true'>
			<cover-view class="modelContainer">
				<cover-view class="modalTitle">信息确认</cover-view>
				<cover-view class="modalContent">租金：{{info2.rentUnitPrice}}元/月</cover-view>
				<cover-view class="modalContent">租金方式：{{info2.rentCycle}}</cover-view>
				<cover-view class="modalContent">合约周期：{{date}}~{{info2.keepDate}}</cover-view>
				<cover-view class="btnBox">
					<cover-view class="btnDivide"></cover-view>
					<cover-view class="modalCancel" @click="cancel()">取消</cover-view>
					<cover-view class="modalSure" @click="sure()">确认</cover-view>
				</cover-view>
			</cover-view>
		</cover-view>
	</view>
</template>

<script>
	import tipModal from '../../components/tipModal.vue'
	import myUploadImg from '../../util/myUpload.js';
	import chooseList from '../../components/chooseList.vue';
	import chnToNumber from '../../util/index';
	import moment from 'moment';
	import evanFormItem from '../../components/evan-form/evan-form-item.vue';
	import evanForm from '../../components/evan-form/evan-form.vue';
	export default {
		components: {
			evanFormItem,
			evanForm,
			chooseList,
			tipModal
		},
		data() {
			const currentDate = this.getDate();
			return {
				isShowTipModal:false,
				isShowSureModal:false,
				tenantImg:'',
				remarks: '',
				userId: null,
				renterId: null,
				chooseIndex: null,
				isEdit: false,
				isFillStatus:false,
				currentSex: 0,
				sexList: [{
						value: 0,
						name: '男'
					},
					{
						value: 1,
						name: '女'
					}
				],
				commInfo: {},
				rentMonthNum: '',
				roomId: '',
				uploadFileUrl: '/util/uploadByPath',
				uImgList: [],
				listShow: false,
				date: currentDate,
				pickerKeepDate:'',
				currentLiIndex: null,
				rentCycleList: [],
				keepDateList: ['半年', '1年', '2年', '其他'],
				imgSideUrl: '',
				imgOtherSideUrl: '',
				isChooseReverseImg: false,
				list: [
					//要展示的数据
					'押一付一',
					'押二付一',
					'押三付一',
					'押三付二'
				],
				info1: {
					name: '',
					tel: '',
					IDNum: ''
				},
				rules1: {
					name: {
						required: true,
						message: '请输入租户姓名'
					},
					tel: [{
							required: true,
							message: '请输入租户电话'
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
					IDNum: [{
							required: false,
							message: '请输入租户身份证号码'
						},
						{
							validator: (rules1, IDNum, callback) => {
								console.log(rules1, IDNum, callback);
								if (IDNum) {
									if (this.$validate.isIdNumber(IDNum)) {
										callback();
									} else {
										callback(new Error('身份证号码格式不正确'));
									}
								}

							}
						}
					]
				},
				info2: {
					startDate: '',
					keepDate: '',
					rentCycle: '',
					rentUnitPrice: '',
					deposit: ''
				},
				rules2: {
					// startDate:{
					// 	required:true,
					// 	message:'请输入起租日期'
					// },
					keepDate: {
						required: true,
						message: '请输入租期'
					},
					rentCycle: {
						required: true,
						message: '请输入收租周期'
					},
					rentUnitPrice: {
						required: true,
						message: '请输入每期交租'
					},
					deposit: {
						required: true,
						message: '请输入押金'
					}
				},
				info3: {
					// ele:'1元/度',
					eleCost: '',
					waterCost: '30',
					netCost: '30',
					// net: '30元/月',
					// water: '30元/月',
					// remarks: ''
				},
				rules3: {
					// ele:{
					// 	required:true,
					// 	message:'请输入电费'
					// },
					eleCost: {
						required: true,
						message: '请输入初始刻度'
					},
					waterCost: {
						required: true,
						message: '请输入水费'
					},
					netCost: {
						required: true,
						message: '请输入宽带费'
					}
				},
				eleUnitPrice:1,
			}
		},
		onLoad(options) {
			console.log(options)
			if (options.userId) {
				console.log('我处于编辑状态', options.userId)
				this.isEdit = true;
				this.userId = options.userId
				uni.setNavigationBarTitle({
					title: '租客信息'
				});
				this.getUserInfo(options.userId);
			}
			this.commInfo = JSON.parse(options.commInfo)
			if(this.commInfo.renterId){
				//分享信息填充操作
				console.log('我是分享信息补充')
				this.isFillStatus = true;
				uni.setNavigationBarTitle({
					title: '完善租客'
				});
				this.getUserInfo(this.commInfo.renterId);
			}
			this.roomId = options.roomId;
			this.$nextTick(() => {
				this.$refs.form1.setRules(this.rules1)
				this.$refs.form2.setRules(this.rules2)
				this.$refs.form3.setRules(this.rules3)
			})
			this.getRentCycleList().then(() => {
				if (!this.isEdit) {
					this.getRoomInfo(this.roomId)
				}
			})
			if (!this.isEdit) {
				//默认选择一年
				this.chooseLi(1)
			}
		},
		methods: {
			deleteRenter(){
				this.showTipModal()
			},
			returnSure(){
				this.$request.post('/roomUser/delete',{
					id:this.userId
				}).then((res)=>{
					this.hideTipModal();
					uni.showToast({
						title:'租客删除成功',
						duration:1500
					})
					setTimeout(()=>{
						uni.navigateBack({
							delta:2
						})
					},2000)
				})
			},
			showTipModal(){
				this.isShowTipModal = true
			},
			hideTipModal(){
				this.isShowTipModal = false
			},
			cancel(){
				this.isShowSureModal = false
			},
			getRoomInfo(id) {
				this.$request.post('room/findRoomById', {
					id
				}).then(res => {
					let data = res.data.data;
					this.eleUnitPrice = data.eleUnitPrice; // 因为房间录入的是电费单价
					this.info3.waterCost = data.waterUnitPrice; //
					this.info3.netCost = data.netCost; //
					let rentIndex = parseInt(data.rentNum) - 1;
					this.info2.rentCycle = this.list[rentIndex];
					this.chooseIndex = rentIndex;
					this.info2.rentUnitPrice = data.roomPrice;
					this.info2.deposit = data.roomPrice;
					this.rentCycleList[0] = data.rentNum;
					this.rentCycleList[1] = data.depositNum;
				})
			},
			getUserInfo(id) {
				this.$request.post('roomUser/findById', {
					tenantId: id
				}).then((res) => {
					console.log('用户信息', res)
					let data = res.data.data
					console.log(data.tenantIdNumber)
					let rentIndex = parseInt(data.payRentCycle) - 1;
					console.log(rentIndex)
					this.chooseIndex = rentIndex;
					// this.radioChange({
					// 	target: {
					// 		value: data.tenantSex
					// 	}
					// });
					this.currentSex = parseInt(data.tenantSex);
					this.tenantImg = data.tenantImg;
					this.renterId = data.id;
					this.info1.name = data.tenantName;
					this.info1.tel = data.tenantPhone;
					this.info1.IDNum = data.tenantIdNumber;
					this.imgSideUrl = data.idCardImg1;
					this.imgOtherSideUrl = data.idCardImg2;
					this.info3.eleCost = data.elePrevNum; //
					this.info3.waterCost = data.waterPrice; //
					this.info3.netCost = data.netPrice; //
					this.info3.remarks = data.remarks;
					this.info2.startDate = data.startDate.substr(0, 10);
					this.info2.keepDate = data.endDate.substr(0, 10);
					this.date = data.startDate.substr(0, 10);
					this.pickerKeepDate = data.endDate.substr(0, 10);
					this.info2.rentUnitPrice = data.rentPrice;
					this.info2.deposit = data.depositAmount;
					this.info2.rentCycle = this.list[rentIndex];
					this.rentCycleList[0] = data.payRentCycle;
					this.rentCycleList[1] = data.depositNum;
					// this.currentSex = data.tenantSex;
					
					this.chooseLi(data.rentMonthNum, true,true);
					this.rentMonthNum = data.rentMonthNum;
					this.remarks = data.remarks;
				});
			},
			showList() {
				if(!this.isEdit){
					this.listShow = true;
				}
			},
			hideList() {
				this.listShow = false;
			},
			returnEmit(e) {
				console.log(e);
				this.rentCycleList = chnToNumber.chnToNumber(e.newVal);
				console.log('大家好啊', this.rentCycleList);
				this.info2.rentCycle = e.newVal;
				this.chooseIndex = e.index;
				this.listShow = false;
			},
			radioChange(evt) {
				for (let i = 0; i < this.sexList.length; i++) {
					if (this.sexList[i].value == evt.target.value) {
						this.currentSex = this.sexList[i].value;
						break;
					}
				}
				// this.currentSex = evt.target.value;
			},
			sure(){
				let _this = this;
				uni.showLoading({
					title: '正在保存...'
				});
				let postUrl = this.isEdit ? '/roomUser/update' : '/roomUser/signTenant';
				let par = {
					roomId: _this.roomId,
					tenantName: _this.info1.name,
					landlordId: _this.$store.state.landladyInfo.id,
					landlordName: _this.$store.state.landladyInfo.userName,
					tenantPhone: _this.info1.tel,
					tenantIdNumber: _this.info1.IDNum,
					idCardImg1: _this.imgSideUrl,
					idCardImg2: _this.imgOtherSideUrl,
					eleUnitPrice: _this.eleUnitPrice ? _this.eleUnitPrice : 1,
					elePrevNum: _this.info3.eleCost,
					waterPrice: _this.info3.waterCost,
					netPrice: _this.info3.netCost,
					startDate: _this.info2.startDate ? _this.info2.startDate + ' 00:00:00' : _this.date + ' 00:00:00',
					rentMonthNum: _this.rentMonthNum,
					endDate:_this.info2.keepDate ? _this.info2.keepDate + ' 00:00:00' : _this.pickerKeepDate + ' 00:00:00',
					payRentCycle: _this.rentCycleList[0],
					rentPrice: _this.info2.rentUnitPrice,
					depositAmount: _this.info2.deposit,
					depositNum: _this.rentCycleList[1],
					tenantSex: _this.currentSex, //性别字段
					remarks: _this.remarks
				};
				if (this.isEdit) {
					par.id = this.renterId;
					par.tenantId = this.userId;
				}
				if(this.isFillStatus){
					par.tenantImg = this.tenantImg
					par.id = this.commInfo.renterId
				}
				_this.$request.post(postUrl, par).then(responce => {
					uni.hideLoading();
					let tipContent = this.isEdit ? '编辑成功' : '添加成功';
					uni.showToast({
						title: tipContent
					});
					setTimeout(() => {
						// let pages = getCurrentPages();
						//    if (pages.length > 1) {
						//        let beforePage = pages[pages.length - 2];
						// 		console.log(beforePage)
						//            beforePage.$vm.updateData()
						uni.navigateBack({
							delta: 1
						});
						// }
					}, 1500);
				});
			},
			save() {
				let _this = this;
				// uni.showLoading({
				// 	title: '正在保存...'
				// });
				// let postUrl = this.isEdit ? '/roomUser/update' : '/roomUser/signTenant';
				// let par = {
				// 	roomId: _this.roomId,
				// 	tenantName: _this.info1.name,
				// 	landlordId: _this.$store.state.landladyInfo.id,
				// 	landlordName: _this.$store.state.landladyInfo.userName,
				// 	tenantPhone: _this.info1.tel,
				// 	tenantIdNumber: _this.info1.IDNum,
				// 	idCardImg1: _this.imgSideUrl,
				// 	idCardImg2: _this.imgOtherSideUrl,
				// 	eleUnitPrice: _this.eleUnitPrice ? _this.eleUnitPrice : 1,
				// 	elePrevNum: _this.info3.eleCost,
				// 	waterPrice: _this.info3.waterCost,
				// 	netPrice: _this.info3.netCost,
				// 	startDate: _this.info2.startDate ? _this.info2.startDate + ' 00:00:00' : _this.date + ' 00:00:00',
				// 	rentMonthNum: _this.rentMonthNum,
				// 	endDate:_this.info2.keepDate ? _this.info2.keepDate + ' 00:00:00' : _this.pickerKeepDate + ' 00:00:00',
				// 	payRentCycle: _this.rentCycleList[0],
				// 	rentPrice: _this.info2.rentUnitPrice,
				// 	depositAmount: _this.info2.deposit,
				// 	depositNum: _this.rentCycleList[1],
				// 	tenantSex: _this.currentSex, //性别字段
				// 	remarks: _this.remarks
				// };
				// if (this.isEdit) {
				// 	par.id = this.renterId;
				// 	par.tenantId = this.userId;
				// }
				// if(this.isFillStatus){
				// 	par.tenantImg = this.tenantImg
				// 	par.id = this.commInfo.renterId
				// }
				_this.$refs.form1.validate(res1 => {
					if (res1) {
						console.log(res1);
						_this.$refs.form2.validate(res2 => {
							if (res2) {
								_this.$refs.form3.validate(res3 => {
									if (res3) {
										_this.isShowSureModal = true;
										// _this.$request.post(postUrl, par).then(responce => {
										// 	uni.hideLoading();
										// 	let tipContent = this.isEdit ? '编辑成功' : '添加成功';
										// 	uni.showToast({
										// 		title: tipContent
										// 	});
										// 	setTimeout(() => {
										// 		// let pages = getCurrentPages();
										// 		//    if (pages.length > 1) {
										// 		//        let beforePage = pages[pages.length - 2];
										// 		// 		console.log(beforePage)
										// 		//            beforePage.$vm.updateData()
										// 		uni.navigateBack({
										// 			delta: 1
										// 		});
										// 		// }
										// 	}, 1500);
										// });
									}
								});
							}
						});
					}
				});
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
			getID(e) {
				let _this = this
				let value = e.detail.value;
				if (value.length == 18) {
					if (!_this.$validate.isIdNumber(value)) {
						uni.showToast({
							title: '身份证号码格式有误',
							icon: 'none',
						})
					}
				}
			},
			chooseImg(type) {
				if(!this.isEdit){
					this.isChooseReverseImg = type
					let returnUrl = myUploadImg.upload().then((res) => {
						console.log(res)
						if (this.isChooseReverseImg) {
							this.imgOtherSideUrl = res;
						} else {
							this.imgSideUrl = res;
						}
					})
				}
			},
			espInput(e) {
				console.log(this.rentCycleList)
				this.info2.deposit = this.info2.rentUnitPrice
				// if(this.rentCycleList.length != 0 && this.info2.rentUnitPrice / this.rentCycleList[0] !=0){
				// 	this.info2.deposit = Math.ceil((this.info2.rentUnitPrice / this.rentCycleList[0]))
				// }
			},
			blur() {
				this.listShow = false
			},
			focus(e) {
				this.listShow = true
			},
			change(e) {
				this.rentCycleList = chnToNumber.chnToNumber(e.newVal)

				this.info2.rentCycle = e.newVal
			},
			getRentCycleList() {
				let _this = this;
				return new Promise((reslove, rej) => {
					_this.$request.post('/dict/findByParentName', {
						name: 'RENT_CYCLE'
					}).then(res => {
						_this.list = []
						res.data.data.forEach(item => {
							_this.list.push(item.name)
						})
						reslove(true)
					})
				})
			},
			chooseLi(index, temp,isPass) {
				if(!this.isEdit || isPass){
					if (temp) {
						this.currentLiIndex = index == 6 ? 0 : (index == 12 ? 1 : (index == 24 ? 2 : 3))
					} else {
						this.currentLiIndex = index
						this.pickerKeepDate = this.getKeepDate(index)
						this.info2.keepDate = this.getKeepDate(index)
					}
				}
			},
			getKeepDate(index) {
				let keepDate;
				let _this = this;
				switch (index) {
					case 0:
						keepDate = moment(this.date)
							.add(6, 'month')
							.subtract(1, 'days');
						_this.rentMonthNum = 6;
						break;
					case 1:
						keepDate = moment(this.date)
							.add(12, 'month')
							.subtract(1, 'days');
						_this.rentMonthNum = 12;
						break;
					case 2:
						keepDate = moment(this.date)
							.add(24, 'month')
							.subtract(1, 'days');
						_this.rentMonthNum = 24;
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
				if(index != 3){
					return this.getDate(keepDate);
				}
			},
			getDate(value) {
				let date;
				if (value) {
					date = new Date(value);
				} else {
					date = new Date();
				}
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();
				month = month > 9 ? month : '0' + month;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			},
			bindDateChange(e) {
				console.log('nihaoa', e);
				this.date = e.detail.value;
				this.info2.startDate = e.detail.value;
			},
			getRentMonth(date1,date2){
				//用-分成数组
				date1 = date1.split("-");
				date2 = date2.split("-");
				//获取年,月数
				var year1 = parseInt(date1[0]),
				month1 = parseInt(date1[1]),
				year2 = parseInt(date2[0]),
				month2 = parseInt(date2[1]),
				//通过年,月差计算月份差
				months = (year2 - year1) * 12 + (month2 - month1);
				this.chooseLi(months,true)
				return months;
			},
			bindKeepDateChange(e){
				let _this = this
				let time1 = new Date((e.detail.value).replace(/\-/g,'/'))
				let time2 = new Date((_this.date).replace(/\-/g,'/'))
				if(Date.parse(time1) < Date.parse(time2)){
					uni.showToast({
						title:'选择租期时间必须必起租时间大',
						icon:'none',
						duration:1500
					})
				}else{
					this.pickerKeepDate = e.detail.value;
					this.info2.keepDate = e.detail.value;
					this.rentMonthNum = this.getRentMonth(_this.date,_this.pickerKeepDate)
				}
			}
		}
	};
</script>

<style scoped>
	.addRenter {
		min-height: 100vh;
		height: 100%;
		width: 100%;
		background-color: #FAFAFA;
	}

	.whiteBg {
		background-color: #FFFFFF;
	}

	.housTitle {
		padding: 32rpx 0 32rpx 40rpx;
		font-size: 34rpx;
		font-weight: bold;
		color: #444444;
		margin-bottom: 17rpx;

	}

	.inputColor {
		color: #999999;
	}

	.idName {
		font-size: 34rpx;
		font-weight: bold;
	}

	.section1,
	.section2,
	.section3,
	.section4 {
		padding: 0 40rpx;
		font-size: 30rpx;
		color: #333333;
		margin-bottom: 17rpx;
	}

	.inpArrow {
		width: 30rpx;
		height: 24rpx;
		margin-left: 8rpx;
	}

	.idImgBox {
		padding: 32rpx 0 35rpx 0;
		display: flex;
		justify-content: flex-end;
		align-items: flex-start;
	}

	.chooseIdImg0,
	.chooseIdImg1 {
		width: 221rpx;
		height: 128rpx;

	}

	.chooseIdImg0 image,
	.chooseIdImg1 image {
		width: 100%;
		height: 100%;
		border-radius: 14rpx;
	}

	.chooseIdImg1 {
		margin-left: 28rpx;
	}

	.chooseIdImg0 {
		margin-left: auto;
	}

	.section2Name {
		padding-top: 32rpx;
		font-weight: bold;
		font-size: 34rpx;
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

	.form-input {
		font-size: 34rpx;
	}

	.secTip {
		width: 100%;
		height: 180rpx;
		padding: 32rpx 0 30rpx 0;
		font-size: 34rpx;
		color: #333333;
		/* border-bottom: 2rpx solid #EBEBEB; */
	}

	.textPlaceholder {
		padding: 32rpx 0 30rpx 0;
		color: #999999;
		font-size: 34rpx;
	}

	.sureBtn {
		width: 257rpx;
		height: 74rpx;
		line-height: 74rpx;
		text-align: center;
		border-radius: 37rpx;
		color: #FFFFFF;
		background: linear-gradient(-90deg, rgba(243, 183, 73, 1) 0%, rgba(240, 154, 66, 1) 100%);
		font-size: 32rpx;
		margin: 124rpx auto 72rpx auto;
	}
	.delBtn{
		width: 257rpx;
		height: 74rpx;
		line-height: 74rpx;
		text-align: center;
		border-radius: 37rpx;
		border: 1rpx solid #FFA044;
		color: #FFFFFF;
		font-size: 32rpx;
		color: #FFA044;
		margin: 124rpx auto 72rpx auto;
	}

	.sexRadio {
		text-align: right;
		/* color: #444444;
		font-size: 28rpx; */
	}

	.sexRadio text {
		color: #444444;
	}
	
	/* //确定弹窗 */
	.modelContainer{
		width: 620rpx;
		/* height: fit-content; */
		background-color: #FFFFFF;
		border-radius: 25rpx;
		margin: 280rpx 0 0 65rpx;
		padding-top: 40rpx;
		text-align: center;
	}
	.modalTitle{
		font-size: 32rpx;
		font-weight: bold;
		margin-bottom: 40rpx;
	}
	.modalContent{
		font-size: 28rpx;
		text-align: left;
		color: #999999;
		width: calc(100% - 130rpx);
		height: fit-content;
		margin: 0 0 28rpx  65rpx;
		white-space: normal;
		line-height: 36rpx;
	}
	.btnBox{
		border-top: 2rpx solid rgba(217,217,220,0.6);
		width: 100%;
		height: 90rpx;
		position: relative;
	}
	.btnBox .modalCancel,.btnBox .modalSure{
		width: 50%;
		height: 100%;
		font-size: 32rpx;
		font-weight: 500;
		display: inline-block;
		line-height: 90rpx;
	}
	.btnBox .modalCancel{
		color: #BABABA;
	}
	.btnBox .modalSure{
		color: #FFA044;
	}
	.btnDivide{
		width: 2rpx;
		height: 100%;
		background-color: rgba(217,217,220,0.6);
		position: absolute;
		right: 50%;
		top: 0;
	}
	.modalMask{
		width: 100%;
		height: 100vh;
		background:rgba(0,0,0,0.3);
		position: fixed;
		z-index: 99;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
	}
	/* end */
</style>
