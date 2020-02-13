<template>
	<view class="addRenter">
		<view class="housTitle whiteBg">{{commInfo.name}}-{{commInfo.houseNo}}-卧室{{commInfo.roomNo}}</view>
		<view class="section1 whiteBg">
			
			<evan-form class="evanForm" :hide-required-asterisk="hideRequiredAsterisk" ref="form1" :model="info1">
				<evan-form-item label="姓名" prop="name">
					<template v-slot:main>
								<input class="form-input" placeholder-class="form-input-placeholder" v-model="info1.name" placeholder="租客姓名" />
							</template>
							<template v-slot:tip>
								<image class="inpArrow" src="../../static/right_arrow.png" mode="aspectFit"></image>
							</template>
				</evan-form-item>
				<evan-form-item label="性别" prop="sex">
					<template v-slot:main>
						<radio-group class="sexRadio" name="sexRadio" @change="radioChange">
							<label style="display: flex;justify-content: flex-end;">
								<view v-for="(item,index) in sexList" :key="index" >
									<radio :value="item.value" :checked="index === currentSex" color="#FFA344" /><text>{{item.name}}</text>
								</view>
							</label>
						</radio-group>
								<!-- <input class="form-input" placeholder-class="form-input-placeholder" v-model="info1.name" placeholder="租客姓名" /> -->
					</template>
					<!-- <template v-slot:tip>
								<image class="inpArrow" src="../../static/right_arrow.png" mode="aspectFit"></image>
					</template> -->
				</evan-form-item>
				<evan-form-item label="电话" prop="tel">
					<template v-slot:main>
						<input class="form-input" type="number" maxlength="11" placeholder-class="form-input-placeholder" v-model="info1.tel" placeholder="租客电话" @input="getPhone"/>
					</template>
					<template v-slot:tip>
						<image class="inpArrow" src="../../static/right_arrow.png" mode="aspectFit"></image>
					</template>
				</evan-form-item>
				<evan-form-item label="身份证号" prop="IDNum">
					<template v-slot:main>
								<input class="form-input" type="idcard" placeholder-class="form-input-placeholder" maxlength="18" v-model="info1.IDNum" placeholder="身份证号" @input="getID" />
							</template>
							<template v-slot:tip>
								<image class="inpArrow" src="../../static/right_arrow.png" mode="aspectFit"></image>
							</template>
				</evan-form-item>
			</evan-form>
			<view class="idImgBox">
				<view class="">
					身份证照片
				</view>
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
						 <picker class="form-input" mode="date" :value="date" :start="startDate" @change="bindDateChange">
						         {{date}}
						 </picker>
								<input v-show="false" class="form-input" placeholder-class="form-input-placeholder" v-model="info2.startDate" placeholder="请选择" />
							</template>
							<template v-slot:tip>
								<image class="inpArrow" src="../../static/right_arrow.png" mode="aspectFit"></image>
							</template>
				</evan-form-item>
				<evan-form-item label="租期" prop="keepDate" :border="false">
					<template v-slot:main >
								<input class="form-input"  placeholder-class="form-input-placeholder" v-model="info2.keepDate" placeholder="请选择" />
							</template>
							<template v-slot:tip>
								<image class="inpArrow" src="../../static/right_arrow.png" mode="aspectFit"></image>
					</template>
				</evan-form-item>
				<view class="keepDateList">
					<view class="keepDateLi" :class="{keepDateLiActive : currentLiIndex == index}" v-for="(item,index) in keepDateList" :key="index" @click="chooseLi(index)"> 
						{{item}}
					</view>
				</view>
				<evan-form-item label="收租周期" prop="rentCycle">
					<template v-slot:main>
								<!-- <my-select
								:list="list"
								:clearable="false"
								:showItemNum="5" 
								:listShow="listShow"
								:isCanInput="false"  
								:placeholder = "'请选择'"
								v-on:focus="focus"
								v-on:blur="blur"
								v-on:change="change"
								:selectHideType="'hideAll'">
								</my-select> -->
								<choose-list v-if="listShow" :currentChooseIndex="chooseIndex" v-on:close="hideList"  :list="list" :title="'选择收租周期'" v-on:emitClick = "returnEmit"></choose-list>
								<input  class="form-input" disabled="true" placeholder-class="form-input-placeholder" v-model="info2.rentCycle"  placeholder="请选择收租周期" @click="showList"/>
							</template>
							<template v-slot:tip>
								<image class="inpArrow" src="../../static/right_arrow.png" mode="aspectFit"></image>
							</template>
				</evan-form-item>
				<evan-form-item label="每期交租" prop="rentUnitPrice">
					<template v-slot:main>
								<input class="form-input" type="number" placeholder-class="form-input-placeholder" v-model="info2.rentUnitPrice" placeholder="请输入" @input="espInput" />
							</template>
							<template v-slot:tip>
								<image class="inpArrow" src="../../static/right_arrow.png" mode="aspectFit"></image>
							</template>
				</evan-form-item>
				<evan-form-item label="押金" prop="deposit" :border="false">
					<template v-slot:main>
								<input class="form-input" placeholder-class="form-input-placeholder" v-model="info2.deposit" placeholder="请输入" />
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
				<evan-form-item label="电费(元/度)" prop="eleCost">
					<template v-slot:main>
						<view style="display: flex;">
							<input class="form-input0" placeholder-class="form-input-placeholder" v-model="info3.ele" placeholder="1元/度" />
							<input class="form-input0" placeholder-class="form-input-placeholder" v-model="info3.eleCost" placeholder="(初始读数)" />
						</view>
					</template>
					
				</evan-form-item>
				<evan-form-item label="水费(元/月)" prop="waterCost">
					<template v-slot:main>
								<view style="display: flex;">
									<input class="form-input0"  disabled placeholder-class="form-input-placeholder" v-model="info3.water" placeholder="30元/月" />
									<input class="form-input0"  placeholder-class="form-input-placeholder" v-model="info3.waterCost" placeholder="30元/月" />
								</view>
					</template>
							
				</evan-form-item>
				<evan-form-item label="宽带(元/月)" prop="netCost" :border="false">
					<template v-slot:main>
						<view style="display: flex;">
							<input class="form-input0" disabled placeholder-class="form-input-placeholder"  v-model="info3.net" placeholder="30元/月" />
							<input class="form-input0"  placeholder-class="form-input-placeholder" v-model="info3.netCost" placeholder="30元/月" />
						</view>
					</template>
							
				</evan-form-item>
			</evan-form>
		</view>
		<view class="section4 whiteBg">
			<textarea class="secTip textOverFlow" placeholder="备注" value placeholder-class="textPlaceholder"></textarea>
		</view>
		<view class="sureBtn" @click="save">保存</view>
	</view>
</template>

<script>
	import myUploadImg from '../../util/myUpload.js'
	import chooseList from '../../components/chooseList.vue'
	import chnToNumber from '../../util/index'
	import mySelect from '../../components/mySelect/mySelect.vue'
	import moment from 'moment'
	import evanFormItem from '../../components/evan-form/evan-form-item.vue'
	import evanForm from '../../components/evan-form/evan-form.vue' 
	export default {
		components:{
			evanFormItem,
			evanForm,
			mySelect,
			chooseList
		},
		watch:{
			
		},
		computed: {
		    
		 },
		data() {
			const currentDate = this.getDate()
			return {
				userId:null,
				renterId:null,
				chooseIndex:null,
				isEdit:false,
				currentSex:0,
				sexList:[
					{
						value:0,
						name:'男'
					},
					{
						value:1,
						name:'女'
					}
				],
				commInfo:{},
				rentMonthNum:'',
				roomId:'',
				uploadFileUrl: '/util/uploadByPath',
				uImgList:[],
				listShow:false,
				date: currentDate,
				currentLiIndex:null,
				rentCycleList:[],
				keepDateList:['半年','1年','2年','其他'],
				imgSideUrl:'',
				imgOtherSideUrl:'',
				isChooseReverseImg:false,
				list: [      //要展示的数据
					'押一付一',
					'押二付一',
					'押三付一',
					'押三付二'
				],
				info1:{
					name:'',
					tel:'',
					IDNum:'',
				},
				rules1:{
					name:{
						required:true,
						message:'请输入租户姓名'
					},
					tel:[
							{
								required:true,
								message:'请输入租户电话'
							},{
								validator:(rules1, tel, callback) => {
									if (this.$validate.isMobilePhone(tel)) {
									callback()
								} else {
									callback(new Error('手机号格式不正确'))
								}
							}
						}],
					IDNum:[
						{
							required:true,
							message:'请输入租户身份证号码'
						},
						{
								validator:(rules1, IDNum, callback) => {
									if (this.$validate.isIdNumber(IDNum)) {
									callback()
								} else {
									callback(new Error('身份证号码格式不正确'))
								}
							}
						}
					],
				},
				info2:{
					startDate:'',
					keepDate:'',
					rentCycle:'',
					rentUnitPrice :'',
					deposit:''
				},
				rules2:{
					// startDate:{
					// 	required:true,
					// 	message:'请输入起租日期'
					// },
					keepDate:{
						required:true,
						message:'请输入租期'
					},
					rentCycle:{
						required:true,
						message:'请输入收租周期'
					},
					rentUnitPrice:{
						required:true,
						message:'请输入每期交租'
					},
					deposit:{
						required:true,
						message:'请输入押金'
					},
				},
				info3:{
					ele:'1元/度',
					eleCost:'',
					waterCost:'30',
					netCost:'30',
					net:'30元/月',
					water:'30元/月'
				},
				rules3:{
					ele:{
						required:true,
						message:'请输入电费'
					},
					eleCost:{
						required:true,
						message:'请输入抄表读数'
					},
					waterCost:{
						required:true,
						message:'请输入水费'
					},
					netCost:{
						required:true,
						message:'请输入宽带费'
					},
				}
				
			}
			
		},
		watch:{
			rentCycleList(newVal,oldVal){
				console.log(newVal,oldVal)
				this.espInput()
				// this.info2.deposit = this.info2.rentUnitPrice / this.newVal[0]
				// console.log(this.info2.rentUnitPrice)
				// console.log(this.info2.deposit)
			}
		},
		onLoad(options) {
			console.log(options)
			if(options.userId){
				console.log('我处于编辑状态',options.userId)
				this.isEdit = true;
				this.userId = options.userId
				uni.setNavigationBarTitle({
				    title: '编辑租客'
				});
				this.getUserInfo(options.userId);
			}
			this.commInfo = JSON.parse(options.commInfo) 
			this.roomId = options.roomId;
			this.$nextTick(() => {
				this.$refs.form1.setRules(this.rules1)
				this.$refs.form2.setRules(this.rules2)
				this.$refs.form3.setRules(this.rules3)
			})
			this.getRentCycleList()
		},
		methods: {
			getUserInfo(id){
				this.$request.post('roomUser/findById',{
					tenantId:id
				}).then((res)=>{
					console.log('用户信息',res)
					let data = res.data.data
					console.log(data.tenantIdNumber)
					let rentIndex = parseInt(data.payRentCycle) - 1; 
					console.log(rentIndex)
					this.chooseIndex = rentIndex;
					this.renterId = data.id;
					this.info1.name = data.tenantName;
					this.info1.tel = data.tenantPhone;
					this.info1.IDNum     =data.tenantIdNumber;
					this.imgSideUrl      =data.idCardImg1
					this.imgOtherSideUrl =data.idCardImg2
					this.info3.eleCost   =data.eleUnitPrice;//
					this.info3.waterCost =data.waterPrice;//
					this.info3.netCost   =data.netPrice;//
					this.info2.startDate =data.startDate.substr(0,10); 
					this.info2.keepDate  =data.endDate.substr(0,10); 
					this.info2.rentUnitPrice =data.rentPrice; 
					this.info2.deposit       =data.depositAmount; 
					this.info2.rentCycle     = this.list[rentIndex]; 
					this.rentCycleList[0] = data.payRentCycle;
					this.rentCycleList[1] = data.depositNum;
					// this.currentSex = data.tenantSex;
					this.radioChange({target:{value:data.tenantSex}})
					this.chooseLi(data.rentMonthNum,true)
					this.rentMonthNum = data.rentMonthNum
				})
			},
			showList(){
				this.listShow = true;
			},
			hideList(){
				this.listShow = false;
			},
			returnEmit(e){
				console.log(e)
				this.rentCycleList = chnToNumber.chnToNumber(e.newVal)
				console.log('大家好啊',this.rentCycleList)
				this.info2.rentCycle = e.newVal
				this.chooseIndex = e.index
				this.listShow = false;
			},
			radioChange(evt){
				console.log(evt)
				    for (let i = 0; i < this.sexList.length; i++) {
				                if (this.sexList[i].value == evt.target.value) {
				                    this.currentSex = this.sexList[i].value;
				                    break;
				                }
				            }
							// this.currentSex = evt.target.value;
			},
			save(){
				let _this = this;
				
				let postUrl = this.isEdit ? '/roomUser/update' : '/roomUser/signTenant'
				let par = {
					roomId:_this.roomId,
					tenantName:_this.info1.name,
					landlordId:_this.$store.state.landladyInfo.id,
					landlordName:_this.$store.state.landladyInfo.nickName,
					tenantPhone:_this.info1.tel,
					tenantIdNumber:_this.info1.IDNum,
					idCardImg1:_this.imgSideUrl,
					idCardImg2:_this.imgOtherSideUrl,
					eleUnitPrice:'1',
					elePrevNum:_this.info3.eleCost,
					waterPrice:_this.info3.waterCost,
					netPrice:_this.info3.netCost,
					startDate:_this.info2.startDate ? _this.info2.startDate + ' 00:00:00' : this.date+ ' 00:00:00',
					rentMonthNum:_this.rentMonthNum,
					endDate:_this.info2.keepDate+ ' 00:00:00',
					payRentCycle:_this.rentCycleList[0],
					rentPrice:_this.info2.rentUnitPrice,
					depositAmount:_this.info2.deposit,
					depositNum:_this.rentCycleList[1],
					tenantSex:this.currentSex,//性别字段
				}
				if(this.isEdit){
					par.id = this.renterId;
					par.tenantId = this.userId;
				}
				if(!(_this.imgSideUrl && _this.imgOtherSideUrl)){
					uni.showToast({
						title:'请先添加身份证照片',
						icon:'none'
					})
					return;
				}
				_this.$refs.form1.validate((res1) => {
					if (res1) {
						console.log(res1)
						_this.$refs.form2.validate((res2) =>{
							if(res2){
								_this.$refs.form3.validate((res3) =>{
									if(res3){
										_this.$request.post(postUrl,par).then((responce)=>{
											let tipContent = this.isEdit ? '编辑成功' : '添加成功'
											uni.showToast({
												title:tipContent
											})
												setTimeout(() => {
																				// let pages = getCurrentPages();
																			 //    if (pages.length > 1) {
																			 //        let beforePage = pages[pages.length - 2];
																				// 		console.log(beforePage)
																			 //            beforePage.$vm.updateData()
																			            uni.navigateBack({
																			                delta: 1,
																			            })
																			        // }
																			}, 1500);
											
										})
									}
								})
							}
						})
					}
				})
			},
			getPhone(e){
					let _this = this
					let value = e.detail.value;
					if(value.length == 11){
						if(!_this.$validate.isMobilePhone(value)){
							uni.showToast({
								title:'手机号码格式有误',
								icon:'none',
							})
						}
					}
			},
			getID(e){
					let _this = this
					let value = e.detail.value;
					if(value.length == 18){
						if(!_this.$validate.isIdNumber(value)){
							uni.showToast({
								title:'身份证号码格式有误',
								icon:'none',
							})
						}
					}
			},
			chooseImg(type){
				this.isChooseReverseImg = type
				let returnUrl = myUploadImg.upload().then((res)=>{
					console.log(res)
					if(this.isChooseReverseImg){
						this.imgOtherSideUrl = res;
					}else{
						this.imgSideUrl = res;
					}
				})
				
			},
			espInput(e){
				console.log(this.rentCycleList)
				
				if(this.rentCycleList.length != 0 && this.info2.rentUnitPrice / this.rentCycleList[0] !=0){
					this.info2.deposit = Math.ceil((this.info2.rentUnitPrice / this.rentCycleList[0]))
				}
			},
			blur(){
				this.listShow = false
			},
			focus(e){
				this.listShow = true
			},
			change(e){
				this.rentCycleList = chnToNumber.chnToNumber(e.newVal)
				
				this.info2.rentCycle = e.newVal
			},
			getRentCycleList(){
				this.$request.post('/dict/findByParentName',{
					name:'RENT_CYCLE'
				}).then(res =>{
					this.list = []
					res.data.data.forEach(item =>{
						this.list.push(item.name)
					})
				})
			},
			chooseLi(index,temp){
				if(temp){
					this.currentLiIndex = index == 6 ? 0 : (index == 12 ? 1 : 2)
				}else{
					this.currentLiIndex = index
					this.info2.keepDate = this.getKeepDate(index)
				}
			},
			getKeepDate(index){
				let keepDate;
				let _this = this;
				switch (index) {
					case 0:
					keepDate =	moment(this.date).add(6,'month').subtract(1,'days')
					_this.rentMonthNum = 6
						break;
					case 1:
					keepDate =	moment(this.date).add(12,'month').subtract(1,'days')
					_this.rentMonthNum = 12
						break;
					case 2:
					keepDate =	moment(this.date).add(24,'month').subtract(1,'days')
					_this.rentMonthNum = 24
						break;
					case 3:
						uni.showToast({
							title:'请自己填写',
							icon:'none'
						})
					break;
					default:
						break;
				}
				return this.getDate(keepDate)
			},
			  getDate(value) {
				  let date
						if(value){
							date = new Date(value);
						}else{
							date = new Date();
						}
			            let year = date.getFullYear();
			            let month = date.getMonth() + 1;
			            let day = date.getDate();
			            month = month > 9 ? month : '0' + month;;
			            day = day > 9 ? day : '0' + day;
			            return `${year}-${month}-${day}`;
			        },
					bindDateChange(e){
						console.log('nihaoa',e)
						this.date = e.detail.value
						this.info2.startDate = e.detail.value
					}
		}
	}
</script>

<style scoped>
	
	.addRenter{
		min-height: 100vh;
		height: 100%;
		width: 100%;
		background-color: #FAFAFA;
	}
	.whiteBg{
		background-color: #FFFFFF;
	}
	.housTitle{
		padding: 32rpx 0 32rpx 40rpx;
		font-size: 28rpx;
		font-weight: bold;
		color: #444444;
		margin-bottom: 17rpx;
		
	}
	.section1,.section2,.section3,.section4{
		padding: 0 40rpx;
		font-size: 30rpx;
		color: #333333;
		margin-bottom: 17rpx;
	}
	.inpArrow{
		width: 30rpx;
		height: 24rpx;
		margin-left: 8rpx;
	}
	.idImgBox{
		padding: 32rpx 0 35rpx 0;
		display: flex;
		justify-content: flex-end;
		align-items: flex-start;
	}
	.chooseIdImg0,.chooseIdImg1{
		width: 221rpx;
		height: 128rpx;
		
	}
	.chooseIdImg0 image ,.chooseIdImg1 image{
		width: 100%;
		height: 100%;
		border-radius: 14rpx;
	}
	.chooseIdImg1{
		margin-left: 28rpx;
	}
	.chooseIdImg0{
		margin-left: auto;
	}
	.section2Name{
		padding-top: 32rpx;
		font-weight: bold;
		font-size: 28rpx;
	}
	.keepDateList{
		/* height: 93rpx; */
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		border-bottom: 3rpx solid #EBEBEB80;
		padding-bottom: 32rpx;
	}
	.keepDateLi{
		width: calc((100% - 69rpx) / 4);
		height: 60rpx;
		text-align: center;
		line-height: 60rpx;
		border-radius: 10rpx;
		margin-right: 23rpx;
		color: #666666;
		border: 1rpx solid #D2D2D2;
	}
	.keepDateLiActive{
		border: 1rpx solid #FFA344;
		color: #FFA344;
	}
	.keepDateLi:last-of-type{
		margin-right: unset;
	}
	.form-input0{
		width: 50%;
		height: 100%;
		text-align: right;
	}
	.secTip{
		width: 100%;
		height: 180rpx;
		padding: 32rpx 0 30rpx 0;
		font-size: 30rpx;
		color: #333333;
		/* border-bottom: 2rpx solid #EBEBEB; */
	}
	.textPlaceholder{
		padding: 32rpx 0 30rpx 0;
		color: #999999;
		font-size: 30rpx;
	}
	.sureBtn{
		width: 257rpx;
		height: 74rpx;
		line-height: 74rpx;
		text-align: center;
		border-radius: 37rpx;
		color: #FFFFFF;
		background:linear-gradient(-90deg,rgba(243,183,73,1) 0%,rgba(240,154,66,1) 100%);
		font-size: 32rpx;
		margin: 124rpx auto 72rpx auto;
	}
	.sexRadio{
		text-align: right;
		/* color: #444444;
		font-size: 28rpx; */
	}
	.sexRadio text{
		color: #444444;
	}
</style>
