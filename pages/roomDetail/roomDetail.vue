<template>
	<view class="">
		<choose-list v-if="listShow" v-on:close="hideList" :currentChooseIndex="chooseIndex" :list="list" :title="'选择收租周期'" v-on:emitClick = "returnEmit"></choose-list>
		<view class="roomDetail" v-if="!isEditRoom">
			
			<view class="bannerBox">
				<span>上传图片</span>
				<view class="changeBtn" @click="deleteImg">修改</view>
				<image v-if="imgUrl" class="bannerImg" :src="imgUrl" mode="aspectFill"></image>
				<image v-else class="bannerImg" src="../../static/el.jpg" mode="aspectFill"></image>
				<!-- <uImg  ref="upimg"
				    :canUploadFile="true" 
				    :limit="limitNum"
				    :uploadFileUrl="uploadFileUrl" 
				    :uImgList.sync="uImgList" 
				    @uploadSuccess="uploadSuccess"
					:parentPath="'community'"/> -->
				<image class="uploadimg" src="../../static/upload1.png" mode="aspectFit" @click="chooseImg"></image>
			</view>
			
			<view v-if="isWholeRent" class="communityName">{{houseInfo.communityName}}-{{houseInfo.roomNo}}-整租</view>
			<view v-if="!isWholeRent" class="communityName">{{houseInfo.communityName}}-{{houseInfo.roomNo}}-卧室{{bedRoomNo}}</view>
			
			<evan-form class="evanForm" :hide-required-asterisk="hideRequiredAsterisk" ref="form" :model="info">
				<view class="section1">
					<evan-form-item label="租金" prop="rentPrice">
						<template v-slot:main>
							<input class="form-input" type="number" placeholder-class="form-input-placeholder" v-model="info.rentPrice" placeholder="元/月" />
						</template>
						<template v-slot:tip>
							<image class="inpArrow" src="../../static/right_arrow.png" mode="aspectFit"></image>
						</template>
					</evan-form-item>
					<evan-form-item label="收租周期" prop="rentCycle">
							<template v-slot:main>
								<input  class="form-input" disabled="true" @click="showList()" placeholder-class="form-input-placeholder" v-model="info.rentCycle"  placeholder="请选择收租周期"  />
							</template>
							<template v-slot:tip>
								<view class="inputSpan"></view>
								<!-- <image class="inpArrow" src="../../static/triangle.png" mode="aspectFit"></image> -->
							</template>
					</evan-form-item>
				</view>
				<view class="section2">
					<evan-form-item label="电费"  prop="elecCost">
						<template v-slot:main>
							<input class="form-input" type="number" placeholder-class="form-input-placeholder" v-model="info.elecCost" placeholder="元/度" />
						</template>
						<template v-slot:tip>
							<image class="inpArrow" src="../../static/right_arrow.png" mode="aspectFit"></image>
						</template>
					</evan-form-item>
					<evan-form-item label="水费" prop="waterCost">
						<template v-slot:main>
							<input class="form-input" type="number" placeholder-class="form-input-placeholder" v-model="info.waterCost" placeholder="元/月" />
						</template>
						<template v-slot:tip>
							<image class="inpArrow" src="../../static/right_arrow.png" mode="aspectFit"></image>
						</template>
					</evan-form-item>
					<evan-form-item label="宽带费" prop="netCost">
						<template v-slot:main>
							<input class="form-input" type="number" placeholder-class="form-input-placeholder" v-model="info.netCost" placeholder="元/月" />
						</template>
						<template v-slot:tip>
							<image class="inpArrow" src="../../static/right_arrow.png" mode="aspectFit"></image>
						</template>
					</evan-form-item>
				</view>
			</evan-form>
			<view class="saveBtn" @click="save">保存</view>
		</view>
		
		<view class="roomDetail" v-if="isEditRoom">
			<view class="bannerBox">
				<span>上传图片</span>
				<view class="changeBtn" @click="deleteImg">修改</view>
				<image v-if="newHouseInfo.roomList[0].roomImgs" class="bannerImg" :src="newHouseInfo.roomList[0].roomImgs" mode="aspectFill"></image>
				<image v-else class="bannerImg" src="../../static/el.jpg" mode="aspectFill"></image>
				<!-- <uImg  ref="upimg"
				    :canUploadFile="true" 
				    :limit="limitNum"
				    :uploadFileUrl="uploadFileUrl" 
				    :uImgList.sync="uImgList" 
				    @uploadSuccess="uploadSuccess"
					:parentPath="'community'"/> -->
				<image class="uploadimg" src="../../static/upload1.png" mode="aspectFit" @click="chooseImg"></image>
			</view>
			
			<view v-if="isWholeRent" class="communityName">{{newHouseInfo.roomList[0].communityName}}-{{newHouseInfo.houseNo}}-整租</view>
			<view v-if="!isWholeRent" class="communityName">{{newHouseInfo.roomList[0].communityName}}-{{newHouseInfo.houseNo}}-卧室{{newHouseInfo.roomList[0].roomNo}}</view>
			
			<evan-form class="evanForm" :hide-required-asterisk="hideRequiredAsterisk" ref="form" :model="info">
				<view class="section1">
					<evan-form-item label="租金" prop="rentPrice">
						<template v-slot:main>
							<input class="form-input" placeholder-class="form-input-placeholder" v-model="info.rentPrice" placeholder="元/月" />
						</template>
						<template v-slot:tip>
							<image class="inpArrow" src="../../static/right_arrow.png" mode="aspectFit"></image>
						</template>
					</evan-form-item>
					<evan-form-item label="收租周期" prop="rentCycle">
							<template v-slot:main>
								<input  class="form-input" disabled="true" placeholder-class="form-input-placeholder"  v-model="info.rentCycle" placeholder="请选择收租周期" @click="showList"/>
							</template>
							<template v-slot:tip>
								<!-- <image class="inpArrow" src="../../static/right_arrow.png" mode="aspectFit"></image> -->
								<view class="inputSpan"></view>
							</template>
					</evan-form-item>
				</view>
				<view class="section2">
					<evan-form-item label="电费" prop="elecCost">
						<template v-slot:main>
							<input class="form-input" placeholder-class="form-input-placeholder" v-model="info.elecCost" placeholder="元/度" />
						</template>
						<template v-slot:tip>
							<image class="inpArrow" src="../../static/right_arrow.png" mode="aspectFit"></image>
						</template>
					</evan-form-item>
					<evan-form-item label="水费" prop="waterCost">
						<template v-slot:main>
							<input class="form-input" placeholder-class="form-input-placeholder" v-model="info.waterCost" placeholder="元/月" />
						</template>
						<template v-slot:tip>
							<image class="inpArrow" src="../../static/right_arrow.png" mode="aspectFit"></image>
						</template>
					</evan-form-item>
					<evan-form-item label="宽带费" prop="netCost">
						<template v-slot:main>
							<input class="form-input" placeholder-class="form-input-placeholder" v-model="info.netCost" placeholder="元/月" />
						</template>
						<template v-slot:tip>
							<image class="inpArrow" src="../../static/right_arrow.png" mode="aspectFit"></image>
						</template>
					</evan-form-item>
				</view>
			</evan-form>
			<view class="saveBtn" @click="save">保存</view>
		</view>
	</view>
	
</template>

<script>
	import chnToNumber from '../../util/index'
	import evanFormItem from '../../components/evan-form/evan-form-item.vue'
	import evanForm from '../../components/evan-form/evan-form.vue'
	import inputBar from '../../components/inputBar.vue'
	import chooseList from '../../components/chooseList.vue'
	export default {
		components:{
			inputBar,
			evanFormItem,
			evanForm,
			chooseList
		},
		data() {
			return {
				id:null,//处于编辑状态的房间id
				chooseIndex:null,
				list: [      //要展示的数据
					'押一付一',
					'押二付一',
				    '押三付一',
					'押三付二'
				],
				initValue:'',
				listShow:false,
				rentCycleList:[1,1],
				isWholeRent:false,
				bedRoomNo:'',
				houseInfo:{},
				newHouseInfo:{},//添加房号之后更新房屋信息
				isEditRoom:false,
				imgUrl:"",
				info:{
					rentPrice:'',
					rentCycle:'',
					elecCost:'',
					waterCost:'',
					netCost:''
				},
				rules:{
					rentPrice:{
						required:true,
						message:'请输入租金'
					},
					rentCycle:{
						required:true,
						message:"请输入收租周期"
					},
					elecCost:{
						required:true,
						message:"请输入电费"
					},
					waterCost:{
						required:true,
						message:"请输入水费"
					},
					netCost:{
						required:true,
						message:"请输入宽带费"
					}
				}
			}
		},
		onLoad(options){
			this.$nextTick(() => {
				this.$refs.form.setRules(this.rules)
			})
			this.houseInfo = JSON.parse(options.houseInfo)
			this.isWholeRent = options.isWholeRent
			if(options.roomNo){
				this.bedRoomNo = options.roomNo;
			}
			this.getRentCycleList()
		},
		onShow(){
			let _this = this
			setTimeout(()=>{
				_this.getHouseInfo(this.houseInfo.houseId)
			},800)
			
		},
		methods: {
			showList(){
				this.listShow = true;
			},
			hideList(){
				this.listShow = false;
			},
			returnEmit(e){
				this.rentCycleList = chnToNumber.chnToNumber(e.newVal)
				this.info.rentCycle = e.newVal
				this.chooseIndex = e.index
				this.listShow = false;
			},
			//查询以保存的房号信息
			getHouseInfo(id){
				this.$request.post('/house/findById',{
					id
				}).then(res=>{
					console.log()
					if(res.data.data.roomList){
						let arr = []
					 	res.data.data.roomList.forEach(item =>{
						console.log(item,this.bedRoomNo)
						if(item.roomNo == this.bedRoomNo){
							arr.push(item)
						}
						res.data.data.roomList = arr
				
					})
					console.log(res.data.data.roomList)
							if(res.data.data.roomList.length != 0){
						//处于编辑房间状态  
						let depositNumIndex = parseInt(res.data.data.roomList[0].rentNum) - 1;
						this.chooseIndex = depositNumIndex;
						this.id = res.data.data.roomList[0].id;
						console.log(this.list,depositNumIndex)
						this.isEditRoom = true
						this.info.rentPrice = res.data.data.roomList[0].roomPrice;
						this.rentCycleList[0]=res.data.data.roomList[0].rentNum;//付月租数量
						this.rentCycleList[1] = res.data.data.roomList[0].depositNum;//押金数量
						// this.initValue = this.list[res.data.data.roomList[0].depositNum - 1];
						this.info.elecCost = res.data.data.roomList[0].eleUnitPrice ? res.data.data.roomList[0].eleUnitPrice : 1;
						this.info.waterCost = res.data.data.roomList[0].waterUnitPrice ? res.data.data.roomList[0].waterUnitPrice : 30;
						this.info.netCost = res.data.data.roomList[0].netCost ? res.data.data.roomList[0].netCost : 30;
						this.info.rentCycle = this.list[depositNumIndex];
					}	
					}
					this.newHouseInfo = res.data.data
				})
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
			deleteImg(){
				this.imgUrl = "";
			},
			blur(){
				this.listShow = false
			},
			focus(e){
				this.listShow = true
			},
			change(e){
				this.rentCycleList = chnToNumber.chnToNumber(e.newVal)
				this.info.rentCycle = e.newVal
				// console.log(this.rentCycleList)
			},
			uploadImg(path){
				let _this = this
				return new Promise((reslove,rej) =>{
					uni.uploadFile({
						url:_this.$baseUrl+'/util/uploadByPath',
						// url:"http://192.168.10.184:8889/util/uploadByPath",
						name: "file",
						filePath: path, // 使用files上传数组列表,上面两者都会失效
						formData:{
							parentPath:'room',
							fileType:"images"
						},
						success:res=>{
							console.log(res)
							let data = JSON.parse(res.data)
							if(data.code == '87014'){
								uni.showToast({
									title:'图片内容违规，请重新选择',
									icon:'none'
								})
								return;
							}
							console.log(data)
							if(_this.isEditRoom){
								_this.newHouseInfo.roomList[0].roomImgs = data.data
							}else{
								_this.imgUrl = data.data
							}
							reslove(data.data)
							uni.hideLoading()
						},
						fail:err=>{
							uni.hideLoading()
							uni.showToast({
								title:err.errMsg
							})
						}
					})
				})
				
			},
			chooseImg(){
				let _this = this
				uni.chooseImage({
					count:1,
					sizeType: ['original', 'compressed'],
					sourceType: ['album', 'camera'],
					success(res) {
						_this.uploadImg(res.tempFilePaths[0])
					}
				})
			},
			save(){
				console.log(this.rentCycleList)
				// 请求参数
				let par = {
					houseId:this.houseInfo.houseId,
					landlordId:this.$store.state.landladyInfo.id,
					communityName:this.houseInfo.communityName,
					roomNo:this.bedRoomNo,
					roomPrice:this.info.rentPrice,
					rentStatus:"0",
					eleMeterReading:"0",
					waterMeterReading:"0",
					eleUnitPrice:this.info.elecCost,
					waterUnitPrice:this.info.waterCost,
					netCost:this.info.netCost,
					depositNum:this.rentCycleList[1],
					rentNum:this.rentCycleList[0]
				};
				if(this.isEditRoom){
					par.id = this.id
				}
				let urlPar = this.isEditRoom ? 'room/update' : '/room/addRoom'
				let _this = this
				if(this.imgUrl){
					par.roomImgs = _this.imgUrl
				}
				console.log(par)
				this.$refs.form.validate((res) => {
					if (res) {
						_this.$request.post(urlPar,par).then(data =>{
							uni.showToast({
								title:'房间保存成功',
								duration:1500,
								success() {
									_this.$store.commit('tempRoomInfo',data.data.data);
									uni.navigateBack()
								}
							})
						}).catch(err =>{
							console.log(err)
						})
					}
				})
			}
		}
	}
</script>

<style scoped>
	.roomDetail{
		width: 100%;
		height: 100vh;
		background-color: #FAFAFA;
		font-size: 30rpx;
	}
	.bannerBox{
		width: 100%;
		height: 324rpx;
		position: relative;
		color: #FFFFFF;
		font-size: 30rpx;
	}
	.bannerBox span{
		position: absolute;
		bottom: 60rpx;
		left: 50%;
		transform: translateX(-50%);
	}
	.bannerImg{
		width: 100%;
		height: 100%;
	}
	.uploadimg{
		width: 128rpx;
		height: 107rpx;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%,-60%);
	}
	.changeBtn{
		position: absolute;
		right: 24rpx;
		top: 20rpx;
		padding: 10rpx 25rpx;
		border-radius: 29rpx;
		background-color: rgba(255,255,255,0.1);
		color: #FFFFFF;
	}
	.communityName{
		padding: 34rpx 40rpx;
		font-size: 32rpx;
		margin-bottom: 17rpx;
		background-color: #FFFFFF;
	}
	.section2{
		padding: 0 40rpx;
		background-color: #FFFFFF;
	}
	.section1{
		padding: 0 40rpx;
		margin-bottom: 17rpx;
		background-color: #FFFFFF;
	}
	.inputContainer{
		width: 100%;
		height: 94rpx;
		line-height: 94rpx;
		display: flex;
		align-items: center;
		border-bottom: 3rpx solid #EBEBEB80;
	}
	.inputBarBox{
		width: 100%;
		height: 100%;
	}
	.inpArrow{
		width: 30rpx;
		height: 56rpx;
		margin-left: 22rpx;
	}
	.inputSpan{
		margin-left: 22rpx;
		width: 0; 
		height: 0;
		border-top: 8px #DBDBDB solid;
		border-left: 8px transparent solid;
		border-bottom: 8px transparent solid;
		border-right: 8px transparent solid;
	}
	.saveBtn{
		width: 257rpx;
		height: 74rpx;
		border-radius: 37rpx;
		color: #FFFFFF;
		background:linear-gradient(-90deg,rgba(243,183,73,1) 0%,rgba(240,154,66,1) 100%);
		text-align: center;
		line-height: 74rpx;
		margin: 148rpx auto 0 auto;
	}
</style>
