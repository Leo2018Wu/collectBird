<template>
	<view class="inviteRenter">
		<view class="headBg"></view>
		<view  v-if="loadingEnd">
			<view class="content" v-if="isSubmitSuccess == 1">
				<view class="landLordInfoBox">
					<image v-if="!avatar" class="avatar" src="../../static/defaultMale.png" mode="aspectFit"></image>
					<image v-else class="avatar" :src="avatar" mode="aspectFit"></image>
					<image class="divide" src="../../static/reportFormDivide.png" mode="aspectFit"></image>
					<view class="landLordInfo">
						<view>我是<span>{{landLordName}}</span></view>
						<view class="desc">邀请您填写入住基本信息</view>
					</view>
				</view>
				<view class="form">
					<evan-form class="evanForm" :hide-required-asterisk="hideRequiredAsterisk" ref="form" :model="info">
						<evan-form-item label="姓名" prop="name" :noBold="true">
							<template v-slot:main>
								<input class="form-input" placeholder-class="form-input-placeholder" v-model="info.name" placeholder="请输入姓名" />
							</template>
						</evan-form-item>
						<evan-form-item label="性别" prop="sex" :noBold="true">
							<template v-slot:main>
								<radio-group class="sexRadio" name="sexRadio" @change="radioChange">
									<label style="display: flex;justify-content: flex-end;">
										<view v-for="(item, index) in sexList" :key="index">
											<radio :value="item.value" :checked="index === currentSex" color="#FFA344" />
											<text>{{ item.name }}</text>
										</view>
									</label>
								</radio-group>
							</template>
						</evan-form-item>
						<evan-form-item label="电话" prop="tel" :noBold="true">
							<template v-slot:main>
								<input class="form-input" type="number" maxlength="11" placeholder-class="form-input-placeholder" v-model="info.tel"
								 placeholder="租客电话" @input="getPhone" />
							</template>
						</evan-form-item>
						<evan-form-item label="身份证号" prop="IDNum" :noBold="true">
							<template v-slot:main>
								<input class="form-input" type="idcard" placeholder-class="form-input-placeholder" maxlength="18" v-model="info.IDNum"
								 placeholder="身份证号" @input="getID" />
							</template>
						</evan-form-item>
					</evan-form>
					<view class="idContainer">
						<view class="idName">身份证照片</view>
						<view class="idImgBox">
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
				</view>
				<button class="submitBtn" open-type="getUserInfo" @getuserinfo="sumbit">提交</button>
			</view>
			<view class="content" v-if="isSubmitSuccess >= 2">
				<image class="success" src="../../static/submit_success.png" mode="aspectFit"></image>
				<view class="sucTip">信息已提交，祝您入住愉快！</view>
				<view class="bottomBox">
					<image src="../../static/aboutUs.png" mode="aspectFit"></image>
					<span class="logoTip">收租鸟，慧收租</span>
				</view>
			</view>
			<view class="content" v-if="isSubmitSuccess == 0">
				<image class="success inviteOver" src="../../static/inviteOver.png" mode="aspectFit"></image>
				<view class="failTip ">抱歉，邀请已过期！</view>
				<view class="bottomBox">
					<image src="../../static/aboutUs.png" mode="aspectFit"></image>
					<span class="logoTip">收租鸟，慧收租</span>
				</view>
			</view>
		</view>
	
	</view>
</template>

<script>
	import myUploadImg from '../../util/myUpload.js';
	import evanFormItem from '../../components/evan-form/evan-form-item.vue';
	import evanForm from '../../components/evan-form/evan-form.vue';
	export default {
		components: {
			evanFormItem,
			evanForm
		},
		data() {
			return {
				loadingEnd: false,
				isSubmitSuccess: '',
				returnData: {},
				roomId: '',
				landLordId: '',
				landLordName: '',
				avatar: '',
				renterAvatar: '',
				imgOtherSideUrl: '',
				imgSideUrl: '',
				isChooseReverseImg: false,
				sexList: [{
						value: 0,
						name: '男'
					},
					{
						value: 1,
						name: '女'
					}
				],
				currentSex: 0,
				info: {
					name: '',
					tel: '',
					IDNum: '',
				},
				rules: {
					name: {
						required: true,
						message: '请输入姓名'
					},
					tel: [{
							required: true,
							message: '请输入电话'
						},
						{
							validator: (rules, tel, callback) => {
								if (this.$validate.isMobilePhone(tel)) {
									callback();
								} else {
									callback(new Error('手机号格式不正确'));
								}
							}
						}
					],
					IDNum: [{
							required: true,
							message: '请输入身份证号码'
						},
						{
							validator: (rules, IDNum, callback) => {
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
				}
			}
		},
		onLoad(options) {
			console.log(options)
			let _this = this;
			this.roomId = options.roomId;
			this.landLordId = options.landLordId;
			this.landLordName = options.landLordName;
			this.avatar = options.landLordAva
			this.getRoomInfo(this.roomId)
			this.$nextTick(() => {
				this.$refs.form.setRules(this.rules)
			})
			//判断用户是否授权过
			uni.getSetting({
				success(res) {
					console.log(res);
					if (res.authSetting['scope.userInfo']) {
						_this.getUserInfo();
					}
				},
			});
		},
		methods: {
			getRoomInfo(id) {
				let _this = this;
				_this.$request.post('room/findRoomById', {
					id
				}).then((res) => {
					console.log(res)
					// if (res.data.data.tenantStatus >= '2') {
						_this.isSubmitSuccess = res.data.data.tenantStatus
					// }
					// setTimeout(() => {
						_this.loadingEnd = true
					// }, 200)
				})
			},
			getUserInfo() {
				// 获取用户信息
				let _this = this
				
				uni.getUserInfo({
					provider: 'weixin',
					success: function(infoRes) {
						_this.renterAvatar = infoRes.userInfo.avatarUrl;
					},
				})
			},
			sumbit() {
				let _this = this;
				let par = {
					"roomId": this.roomId,
					"landlordId": this.landLordId,
					"landlordName": this.landLordName,
					"tenantName": this.info.name,
					"tenantSex": this.currentSex,
					"tenantPhone": this.info.tel,
					"tenantIdNumber": this.info.IDNum,
					"idCardImg1": this.imgSideUrl,
					"idCardImg2": this.imgOtherSideUrl,
				}
				uni.showLoading({
					title:'正在提交...',
					mask:true,
				})
				// 获取用户信息
				uni.getUserInfo({
					provider: 'weixin',
					success: function(infoRes) {
						_this.renterAvatar = infoRes.userInfo.avatarUrl;
						_this.$debounce.canDoFunction({
							key: "事件名", //基于此值判断是否可以操作，如两个方法传入了同样的key，则会混淆，建议传入调用此事件的方法名，简单好梳理
							time: 3000, //如果传入time字段，则为定时器后，自动解除锁定状态，单位（毫秒）
							success: () => { //成功中调用应该操作的方法，被锁定状态不会执行此代码块内的方法
								_this.$refs.form.validate(res => {
									if (res) {
										uni.hideLoading()
										par.tenantImg = _this.renterAvatar
										_this.$request.post('/roomUser/inviTenant', par).then((data) => {
											if (data.data.code == '200') {
												_this.isSubmitSuccess = 2;
												uni.showToast({
													title: '填写成功',
													duration: 1500
												})
											} else {
												uni.showToast({
													title: data.data.msg,
													icon: 'none',
													duration: 1500
												})
											}
										})
									}
								})
							},
							complete: () => {

							}
						})
					},
					fail: function() {
						uni.showToast({
							title: '拒绝授权会导致您提交信息失败',
							icon: 'none',
							duration: 1500
						})
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
					console.log(res)
					if (this.isChooseReverseImg) {
						this.imgOtherSideUrl = res;
					} else {
						this.imgSideUrl = res;
					}
				})

			},
			radioChange(evt) {
				console.log(evt);
				for (let i = 0; i < this.sexList.length; i++) {
					if (this.sexList[i].value == evt.target.value) {
						this.currentSex = this.sexList[i].value;
						break;
					}
				}
				// this.currentSex = evt.target.value;
			},
		}
	}
</script>

<style scoped>
	.inviteRenter {
		width: 100%;
		height: 100vh;
		background: #FAFAFA;

	}

	.headBg {
		width: 100%;
		height: 252rpx;
		background: #F09A42;
	}

	.content {
		width: calc(100% - 64rpx);
		height: fit-content;
		min-height: calc(100vh - 80rpx);
		margin-left: 32rpx;
		position: absolute;
		top: 40rpx;
		padding: 86rpx 56rpx 100rpx 56rpx;
		background: #FFFFFF;
		border-radius: 30rpx;
	}

	.landLordInfoBox {
		width: 100%;
		height: 98rpx;
		display: flex;
		margin-bottom: 58rpx;
	}

	.landLordInfoBox .avatar {
		width: 98rpx;
		height: 98rpx;
		margin-right: 26rpx;
		position: relative;
		border-radius: 50%;
	}

	.landLordInfoBox .divide {
		width: 686rpx;
		height: 26rpx;
		position: absolute;
		top: 220rpx;
		left: 0rpx;
	}

	.landLordInfo {
		font-size: 34rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.landLordInfo span {
		font-size: 36rpx;
		font-weight: bold;
		margin-left: 12rpx;
	}

	.desc {
		color: #999999;
	}

	.sexRadio {
		text-align: right;
	}

	.sexRadio text {
		color: #999999;
	}

	.idContainer {
		padding-top: 40rpx;
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
		margin-left: 25rpx;
	}

	.chooseIdImg0 {
		margin-left: auto;
	}

	.submitBtn {
		width: 569rpx;
		height: 86rpx;
		background: linear-gradient(-90deg, rgba(240, 154, 66, 1) 0%, rgba(243, 183, 73, 1) 100%);
		box-shadow: 0rpx 8rpx 19rpx 2rpx rgba(242, 166, 69, 0.4);
		border-radius: 43rpx;
		position: absolute;
		bottom: 100rpx;
		left: 50%;
		transform: translateX(-50%);
		font-size: 40rpx;
		color: #FFFFFF;
		text-align: center;
		line-height: 86rpx;
	}

	.success {
		width: 140rpx;
		height: 140rpx;
		margin: 38rpx auto 64rpx auto;
		border-radius: 50%;
		display: block;
	}
	
	.sucTip {
		width: 100%;
		text-align: center;
		color: #333333;
		font-size: 34rpx;
	}
	.inviteOver{
		border-radius: 0;
	}
	.failTip{
		width: 100%;
		text-align: center;
		font-size: 34rpx;
		color: #C3C2C2;
	}

	.bottomBox {
		width: 100%;
		height: 68rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		position: absolute;
		bottom: 30rpx;
		left: 0;
	}

	.bottomBox image {
		height: 100%;
		width: 68rpx;
	}

	.logoTip {
		margin-left: 20rpx;
		color: #C2C2C2;
		font-size: 32rpx;
	}
</style>
