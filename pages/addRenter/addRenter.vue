<template>
	<view class="addRenter">
		<view class="housTitle whiteBg">{{ commInfo.name }}-{{ commInfo.houseNo }}-卧室{{ commInfo.roomNo }}</view>
		<view class="section1 whiteBg">
			<evan-form class="evanForm" :hide-required-asterisk="hideRequiredAsterisk" ref="form1" :model="info1">
				<evan-form-item label="姓名" prop="name" :fontBold="true">
					<template v-slot:main>
						<input class="form-input" maxlength="10" placeholder-class="form-input-placeholder" v-model="info1.name" placeholder="租客姓名" @input="getName" />
					</template>
				</evan-form-item>
				<evan-form-item label="性别" prop="sex" :fontBold="true">
					<template v-slot:main>
						<radio-group class="sexRadio" name="sexRadio" @change="radioChange">
							<label style="display: flex;justify-content: flex-end;">
								<view v-for="(item, index) in sexList" :key="index">
									<radio :value="item.value" :checked="index === currentSex" color="#FFA344" />
									<text>{{ item.name }}</text>
								</view>
							</label>
						</radio-group>
						<!-- <input class="form-input" placeholder-class="form-input-placeholder" v-model="info1.name" placeholder="租客姓名" /> -->
					</template>
				</evan-form-item>
				<evan-form-item label="电话" prop="tel" :fontBold="true">
					<template v-slot:main>
						<input class="form-input" type="number" maxlength="11" placeholder-class="form-input-placeholder" v-model="info1.tel"
						 placeholder="租客电话" @input="getPhone" />
					</template>
				</evan-form-item>
				<evan-form-item label="身份证号" prop="IDNum" :fontBold="true">
					<template v-slot:main>
						<input class="form-input" type="idcard" placeholder-class="form-input-placeholder" maxlength="18" v-model="info1.IDNum"
						 placeholder="身份证号" @input="getID" />
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
		<view class="section2Name">签约资料</view>
		<view class="section2 whiteBg">
			<evan-form class="evanForm" :hide-required-asterisk="hideRequiredAsterisk" ref="form2" :model="info2">
				<evan-form-item label="起租日期" prop="startDate" :fontBold="true">
					<template v-slot:main>
						<picker class="form-input" :disabled="isEdit && !isChangeDateDue" mode="date" :value="date" :start="startDate"
						 @change="bindDateChange">{{ date }}</picker>
						<input v-show="false" class="form-input" placeholder-class="form-input-placeholder" v-model="info2.startDate"
						 placeholder="请选择" />
					</template>
				</evan-form-item>
				<evan-form-item label="租期" prop="keepDate" :border="false" :fontBold="true">
					<template v-slot:main>
						<picker class="form-input" :disabled="isEdit && !isChangeDateDue" mode="date" :value="pickerKeepDate" :start="startDate"
						 @change="bindKeepDateChange">{{ pickerKeepDate }}</picker>
						<input v-show="false" class="form-input" placeholder-class="form-input-placeholder" v-model="info2.keepDate"
						 placeholder="请选择" />
					</template>
				</evan-form-item>
				<view class="keepDateList">
					<view class="keepDateLi" :class="{ keepDateLiActive: currentLiIndex == index }" v-for="(item, index) in keepDateList"
					 :key="index" @click="chooseLi(index)">
						{{ item }}
					</view>
				</view>
				<evan-form-item label="收租周期" prop="rentCycle" :fontBold="true">
					<template v-slot:main>
						<choose-list v-if="listShow" :currentChooseIndex="chooseIndex" v-on:close="hideList" :list="list" :title="'选择收租周期'"
						 v-on:emitClick="returnEmit"></choose-list>
						<input class="form-input" disabled="true" placeholder-class="form-input-placeholder" v-model="info2.rentCycle"
						 placeholder="请选择收租周期" @click="showList" />
					</template>
				</evan-form-item>
				<evan-form-item label="月租金" prop="rentUnitPrice" :fontBold="true">
					<template v-slot:main>
						<input class="form-input" type="number" :disabled="isEdit && !isChangeDateDue" placeholder-class="form-input-placeholder"
						 v-model="info2.rentUnitPrice" placeholder="请输入" @input="espInput" />
					</template>
				</evan-form-item>
				<evan-form-item label="押金" prop="deposit" :border="false" :fontBold="true">
					<template v-slot:main>
						<input class="form-input" :disabled="isEdit && !isChangeDateDue" placeholder-class="form-input-placeholder"
						 v-model="info2.deposit" placeholder="请输入" />
					</template>
				</evan-form-item>
			</evan-form>
		</view>
		<view class="section2Name">基本费用</view>
		<view class="section3 whiteBg">
			<evan-form class="evanForm" :hide-required-asterisk="hideRequiredAsterisk" ref="form3" :model="info3">
				<evan-form-item label="电费(1元/度)" prop="eleCost" :fontBold="true">
					<template v-slot:main>
						<input class="form-input inputColor" type="digit" maxlength="5" placeholder-class="form-input-placeholder"
						 v-model="info3.eleCost" placeholder="请输入初始刻度" @input="myInput1"/>
					</template>
				</evan-form-item>
				<evan-form-item label="水费(元/月)" prop="waterCost" :fontBold="true">
					<template v-slot:main>
						<input class="form-input inputColor" type="digit" placeholder-class="form-input-placeholder" v-model="info3.waterCost"
						 placeholder="请输入水费" @input="myInput2"/>
					</template>
				</evan-form-item>
				<evan-form-item label="宽带(元/月)" prop="netCost" :border="false" :fontBold="true">
					<template v-slot:main>
						<input class="form-input inputColor" type="digit" placeholder-class="form-input-placeholder" v-model="info3.netCost"
						 placeholder="请输入宽带费" @input="myInput3"/>
					</template>
				</evan-form-item>
			</evan-form>
		</view>
		<view class="eleCommonBox whiteBg">
			<view class="switchBox">
				<span>均摊电费</span>
				<switch :checked="isShowEleCommonModal" @change="changeType" color="#F09A42" />
			</view>
			<view class="eleCommonInfo" v-if="isShowEleCommonModal">
				<evan-form-item label="电费(1元/度)" prop="commonEleNum">
					<template v-slot:main>
						<input class="form-input inputColor" type="digit" placeholder-class="form-input-placeholder" v-model="commonEleNum"
						 placeholder="请输入初始刻度" @input="myInput4"/>
					</template>
				</evan-form-item>
				<view class="eleCommonBottom">
					<span>均摊人数</span>
					<view class="eleNumBox">
						<number-box :valNum="tenantNum" v-on:emitVal='returnVal'></number-box>
					</view>
				</view>
			</view>
		</view>
		<view class="section3 whiteBg">
			<view class="remarkTitle">备注</view>
			<textarea class="secTip textOverFlow" v-model="remarks" placeholder-class="textPlaceholder"></textarea>
		</view>
		<!-- <view class="section4 whiteBg"><textarea class="secTip textOverFlow" placeholder="备注" v-model="remarks"
			 placeholder-class="textPlaceholder"></textarea></view> -->
		<cover-view class="btnBoxMy twoButton textLeft" v-if="!listShow && isEdit">
			<cover-view class="delBtn" @click="deleteRenter">删除</cover-view>
			<cover-view class="sureBtn" @click="save">保存</cover-view>
		</cover-view>
		<cover-view class="btnBoxMy oneButton" v-if="!listShow && !isEdit">
			<cover-view class="sureBtn" @click="save">保存</cover-view>
		</cover-view>
		<tip-modal v-if="isShowTipModal" :title="'删除租客'" :describition="'删除租客将删除租客全部账单，是否确认删除?'" v-on:emitCancel="hideTipModal"
		 v-on:emitSure="returnSure"></tip-modal>
		<cover-view v-if="isShowSureModal" class="modalMask" @click="cancel()" @catchtouchmove='true'>
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
	import {moneyLimit,filterEmoji} from '../../util/index.js'
	import numberBox from '../../components/numberBox.vue';
	import tipModal from '../../components/tipModal.vue';
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
			tipModal,
			numberBox
		},
		data() {
			const currentDate = this.$getDate();
			return {
				tempUserInfo:{},
				historyData:'',
				tenantNum: 2,
				commonEleNum: '',
				isShowEleCommonModal: false,
				isChangeDateDue: false,
				isShowTipModal: false,
				isShowSureModal: false,
				tenantImg: '',
				remarks: '',
				userId: null,
				renterId: null,
				chooseIndex: null,
				isEdit: false,
				isFillStatus: false,
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
				pickerKeepDate: '',
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
					eleCost: '',
					waterCost: '30',
					netCost: '30',
				},
				rules3: {
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
				eleUnitPrice: 1,
			}
		},
		onLoad(options) {
			console.log(options)
			if (options.userId) {
				console.log('我处于编辑状态', options.userId)
				this.isEdit = true;
				this.userId = options.userId
				uni.setNavigationBarTitle({
					title: '编辑租客'
				});
				this.getUserInfo(options.userId)
				this.getBillRecord(options.userId);
			}
			this.commInfo = JSON.parse(options.commInfo)
			if (this.commInfo.renterId) {
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
			getName(e){
				this.info1.name = filterEmoji(e.detail.value)
			},
			returnVal(e) {
				console.log('woshifanhuide')
				this.tenantNum = e;
			},
			changeType(e) {
				console.log(e)
				this.isShowEleCommonModal = e.detail.value
			},
			getBillRecord(id) {
				let _this = this;
				_this.$request.post("/bill/findByTenantId", {
					tenantId: id
				}).then((res) => {
					if (res.data.data.length == 0) {
						//签约信息可编辑
						_this.isChangeDateDue = true
					}
				}).catch(err => {

				})
			},
			deleteRenter() {
				this.showTipModal()
			},
			returnSure() {
				this.$request.post('/roomUser/delete', {
					id: this.userId
				}).then((res) => {
					this.hideTipModal();
					uni.showToast({
						title: '租客删除成功',
						duration: 1500
					})
					setTimeout(() => {
						uni.navigateBack({
							delta: 2
						})
					}, 2000)
				})
			},
			showTipModal() {
				this.isShowTipModal = true
			},
			hideTipModal() {
				this.isShowTipModal = false
			},
			cancel() {
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
					this.tenantNum = parseInt(data.tenantNum) + 1;
				})
			},
			getUserInfo(id) {
				this.$request.post('roomUser/findByTenantId', {
					tenantId: id
				}).then((res) => {
					let data = res.data.data
					let rentIndex = parseInt(data.payRentCycle) - 1;
					this.tempUserInfo = data
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
					this.chooseLi(data.rentMonthNum, true);
					this.rentMonthNum = data.rentMonthNum;
					this.remarks = data.remarks;
					this.isShowEleCommonModal = data.publicELeStatus == 1 ? true : false;
					this.commonEleNum = data.publicELeNum;
					this.tenantNum = data.tenantNum;
					this.historyData = data.historyData;
				});
			},
			showList() {
				if (!(this.isEdit && !this.isChangeDateDue)) {
					this.listShow = true;
				}
			},
			hideList() {
				this.listShow = false;
			},
			returnEmit(e) {
				this.rentCycleList = chnToNumber.chnToNumber(e.newVal);
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
			},
			sure() {
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
					endDate: _this.info2.keepDate ? _this.info2.keepDate + ' 00:00:00' : _this.pickerKeepDate + ' 00:00:00',
					payRentCycle: _this.rentCycleList[0],
					rentPrice: _this.info2.rentUnitPrice,
					depositAmount: _this.info2.deposit,
					depositNum: _this.rentCycleList[1],
					tenantSex: _this.currentSex, //性别字段
					remarks: _this.remarks,
					historyStatus:0,
				};

				if (this.isShowEleCommonModal) {
					par.publicELeNum = this.commonEleNum;
					par.publicElePrice = 1;
					par.tenantNum = this.tenantNum;
				}
				par.publicELeStatus = this.isShowEleCommonModal ? 1 : 0;

				if (this.isEdit) {
					par.id = this.renterId;
					par.tenantId = this.userId;
					par.historyData = this.historyData
				}
				if (this.isFillStatus) {
					par.tenantImg = this.tenantImg
					par.id = this.commInfo.renterId
					par.communityId = this.tempUserInfo.communityId
					par.communityName = this.tempUserInfo.communityName
					par.houseId = this.tempUserInfo.houseId
				}
				_this.$request.post(postUrl, par).then(responce => {
					console.log(responce)
					_this.$store.commit('tempRenterId', responce.data.data.id);
					console.log(_this.$store)
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
							delta: _this.isEdit ? 2 : 1
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
										if (_this.isShowEleCommonModal && !_this.commonEleNum) {
											uni.showToast({
												title: '请输入公共电费初始刻度',
												icon: 'none',
												duration: 1500
											})
											return;
										}
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
				this.isChooseReverseImg = type
				let returnUrl = myUploadImg.upload().then((res) => {
					if (this.isChooseReverseImg) {
						this.imgOtherSideUrl = res;
					} else {
						this.imgSideUrl = res;
					}
				})
			},
			myInput1(e) {
				this.info3.eleCost = moneyLimit(e.detail.value)
			},
			myInput2(e) {
				this.info3.waterCost = moneyLimit(e.detail.value)
			},
			myInput3(e) {
				this.info3.netCost = moneyLimit(e.detail.value)
			},
			myInput4(e) {
				this.info3.commonEleNum = moneyLimit(e.detail.value)
			},
			espInput(e) {
				this.info2.rentUnitPrice = moneyLimit(e.detail.value)
				this.info2.deposit = this.info2.rentUnitPrice
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
			chooseLi(index, temp, isPass) {
				if (!this.isEdit) {
					this.currentLiIndex = index
					this.pickerKeepDate = this.getKeepDate(index)
					this.info2.keepDate = this.getKeepDate(index)
				} else {
					if (this.isChangeDateDue) {
						this.currentLiIndex = index
						this.pickerKeepDate = this.getKeepDate(index)
						this.info2.keepDate = this.getKeepDate(index)
					}
					if (temp) {
						this.currentLiIndex = index == 6 ? 0 : (index == 12 ? 1 : (index == 24 ? 2 : 3))
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
							// .subtract(1, 'days');
						_this.rentMonthNum = 6;
						break;
					case 1:
						keepDate = moment(this.date)
							.add(12, 'month')
							// .subtract(1, 'days');
						_this.rentMonthNum = 12;
						break;
					case 2:
						keepDate = moment(this.date)
							.add(24, 'month')
							// .subtract(1, 'days');
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
				if (index != 3) {
					return this.$getDate(keepDate);
				}else{
					return this.pickerKeepDate
				}
			},
			bindDateChange(e) {
				console.log('nihaoa', e);
				this.date = e.detail.value;
				this.info2.startDate = e.detail.value;
			},
			getRentMonth(date1, date2) {
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
				// this.chooseLi(months, true)
				return months;
			},
			bindKeepDateChange(e) {
				console.log(e,this.date)
				let _this = this
				let time1 = new Date((e.detail.value).replace(/\-/g, '/'))
				let time2 = new Date((_this.date).replace(/\-/g, '/'))
				if (Date.parse(time1) < Date.parse(time2)) {
					uni.showToast({
						title: '选择租期时间必须必起租时间大',
						icon: 'none',
						duration: 1500
					})
				} else {
					this.pickerKeepDate = e.detail.value;
					this.info2.keepDate = e.detail.value;
					console.log(_this.date, _this.pickerKeepDate)
					this.rentMonthNum = this.getRentMonth(_this.date, _this.pickerKeepDate)
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
		padding-bottom: 140rpx;
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
	}

	.eleCommonBox {
		padding: 0 40rpx;
		width: 100%;
		margin-bottom: 17rpx;
	}

	.eleCommonInfo {
		width: 100%;
		border-top: 1rpx solid #EBEBEB;
	}

	.eleCommonBottom {
		height: 112rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 34rpx;
		color: #333;
	}

	.eleNumBox {
		width: 190rpx;
		height: 50rpx;
	}

	.switchBox {
		height: 112rpx;
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		color: #333333;
		font-size: 34rpx;
		font-weight: bold;
	}

	.switchBox switch {
		margin-right: -26rpx;
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
		padding: 36rpx 0 26rpx 40rpx;
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
		/* padding: 32rpx 0 30rpx 0; */
		font-size: 34rpx;
		color: #333333;
		margin-top: 20rpx;
		/* border-bottom: 2rpx solid #EBEBEB; */
	}

	.textPlaceholder {
		padding: 32rpx 0 30rpx 0;
		color: #999999;
		font-size: 34rpx;
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

	.textLeft {
		text-align: left;
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

	/* .oneButton .sureBtn{
		margin: 23rpx auto 0 auto;
	} */
	.delBtn {
		display: inline-block;
		width: 257rpx;
		height: 82rpx;
		line-height: 82rpx;
		text-align: center;
		border-radius: 40rpx;
		border: 1rpx solid #D2D2D2;
		color: #656565;
		font-size: 34rpx;
		vertical-align: middle;
	}

	.twoButton .delBtn {
		margin: 0 66rpx 0 85rpx;
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
	.modelContainer {
		width: 620rpx;
		/* height: fit-content; */
		background-color: #FFFFFF;
		border-radius: 25rpx;
		margin: 280rpx 0 0 65rpx;
		padding-top: 40rpx;
		text-align: center;
	}

	.modalTitle {
		font-size: 32rpx;
		font-weight: bold;
		margin-bottom: 40rpx;
	}

	.modalContent {
		font-size: 28rpx;
		text-align: left;
		color: #999999;
		width: calc(100% - 130rpx);
		height: fit-content;
		margin: 0 0 28rpx 65rpx;
		white-space: normal;
		line-height: 36rpx;
	}

	.btnBox {
		border-top: 2rpx solid rgba(217, 217, 220, 0.6);
		width: 100%;
		height: 90rpx;
		position: relative;
	}

	.btnBox .modalCancel,
	.btnBox .modalSure {
		width: 50%;
		height: 100%;
		font-size: 32rpx;
		font-weight: 500;
		display: inline-block;
		line-height: 90rpx;
	}

	.btnBox .modalCancel {
		color: #BABABA;
	}

	.btnBox .modalSure {
		color: #FFA044;
	}

	.btnDivide {
		width: 2rpx;
		height: 100%;
		background-color: rgba(217, 217, 220, 0.6);
		position: absolute;
		right: 50%;
		top: 0;
	}

	.modalMask {
		width: 100%;
		height: 100vh;
		background: rgba(0, 0, 0, 0.3);
		position: fixed;
		z-index: 99;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
	}

	/* end */
	.remarkTitle {
		margin-top: 17rpx;
		padding: 28rpx 0;
		font-size: 34rpx;
		color: #999999;
		border-bottom: 2rpx solid #EBEBEB;
	}
	
</style>
