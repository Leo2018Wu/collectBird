<template>
	<view class="addCommunity">
		<view class="content">
			<evan-form class="evanForm" :hide-required-asterisk="hideRequiredAsterisk" ref="form" :model="info">
					<evan-form-item label="小区名" prop="name">
						<template v-slot:main>
							<view @click="chooseLocation(false)" class="form-input" :class="{'form-input-placeholder': myName == '请输入小区名'}">{{myName}}</view>
							<!-- <input @click="chooseLocation(false)" class="form-input" placeholder-class="form-input-placeholder" v-model="info.name" placeholder="请输入小区名" /> -->
						</template>
						<template v-slot:tip>
							<image class="inpArrow" src="../../static/right_arrow.png" mode="aspectFit"></image>
						</template>
					</evan-form-item>
					<evan-form-item label="详细地址" prop="addr">
						<template v-slot:main>
							<view @click="chooseLocation(true)" class="form-input textOverFlow" :class="{'form-input-placeholder': myAddr == '请输入地址'}">{{myAddr}}</view>
							<!-- <input @click="chooseLocation(true)" class="form-input" placeholder-class="form-input-placeholder" :value="info.addr"  placeholder="请填写" /> -->
						</template>
						<template v-slot:tip>
							<image class="inpArrow" src="../../static/right_arrow.png" mode="aspectFit"></image>
						</template>
					</evan-form-item>
			</evan-form>
			<view class="uploadBlock">
				<view>房源照片</view>
				<view class="uploadImg">
					<uImg  ref="upimg"
					    :canUploadFile="true" 
					    :limit="limitNum"
					    :uploadFileUrl="uploadFileUrl" 
					    :uImgList.sync="uImgList" 
					    @uploadSuccess="uploadSuccess"
						:parentPath="'community'"/>
				</view>
			</view>
		</view>
		<view class="btnBox" v-if="!isEdit">
			<view class="btnSave" @click="save()">保存</view>
			<view class="addNext">继续添加房号</view>
		</view>
		<view class="btnBox" v-else>
			<view class="addNext" @click="save()">保存</view>
			<view class="btnSave" @click="deleteComm">删除小区</view>
		</view>
	</view>
</template>

<script>
	import evanFormItem from '../../components/evan-form/evan-form-item.vue'
	import evanForm from '../../components/evan-form/evan-form.vue'
	import uImg from '@/components/uploadImg/uploadImg.vue';
	export default {
		components:{
			uImg,
			evanForm,
			evanFormItem
		},
		
		data() {
			return {
				isEdit:false,
				communityInfo:{},
				msg:'',
				length:140,
				limitNum:1,
				uploadFileUrl: '/util/uploadByPath', //替换成你的后端接收文件地址
				name:'file', //上传的名字
				uImgList: [],
				imgArr:[],
				info:{
				        name: '',
				        addr: '',
				},
				rules:{
					name:{
						required:true,
						message:"请输入小区名"
					},
					addr:{
						required:true,
						message:"请输入小区地址"
					}
				}
			}
		},
		onShow(){
			if(!this.isEdit){
				let chooseLocationInfo = this.$store.state.chooseLocationInfo;
				console.log(chooseLocationInfo)
				this.info.name = chooseLocationInfo.name;
				this.info.addr = chooseLocationInfo.addr;
			}
			
		},
		onLoad(options){
			if(JSON.stringify(options) !="{}"){
				this.isEdit = true;
				this.communityInfo = JSON.parse(options.communityInfo);
				console.log(this.communityInfo)
				this.info.name = this.communityInfo.communityName;
				this.info.addr = this.communityInfo.communityAddress;
				this.uImgList.push(this.communityInfo.communityImgs[0]);
				this.imgArr.push(this.communityInfo.communityImgs[0])
			}else{
				this.uImgList = []
			}
			console.log(options)
			this.$nextTick(() => {
				this.$refs.form.setRules(this.rules)
			})
		},
		computed:{
			myName(){
				if(this.isEdit){
					return this.communityInfo.communityName
				}else{
					return this.$store.state.chooseLocationInfo.name ? this.$store.state.chooseLocationInfo.name : '请输入小区名';
				}
				
			},
			myAddr(){
				if(this.isEdit){
					return this.communityInfo.communityAddress
				}else{
					return this.$store.state.chooseLocationInfo.addr ? this.$store.state.chooseLocationInfo.addr : '请输入地址';
				}
				
			}
		},
		
		onUnload(){
			this.$store.commit('chooseLocationInfo',{})
		},
		methods: {
			chooseLocation(e){
					let url = e ? '../chooseLocation/chooseLocation?type='+'addr' : '../chooseLocation/chooseLocation'
					uni.navigateTo({
						url
					})
			},
			deleteComm(){
				this.$request.post('/community/delete',{
					id:this.communityInfo.id
				}).then(res =>{
					if(res.data.code == 200){
						uni.showToast({
							title:'删除成功',
							icon:'none',
						})
						uni.redirectTo({
							url:"../houseList/houseList"
						})
					}
				})
			},
			refreshLastPage(){
					setTimeout(() => {
								let pages = getCurrentPages();
							    if (pages.length > 1) {
							        let beforePage = pages[pages.length - 2];
										console.log(beforePage)
									
							            beforePage.$vm.updateData()
							            uni.navigateBack({
							                delta: 1,
							            })
							        }
							}, 1500);
			},
			save() {
				// this.imgArr = [];
				let _this = this;
				this.$refs.form.validate((res) => {
					console.log('1111')
					if (res) {
						console.log('2222')
						// if(_this.imgArr == []){
							_this.upFile()
						// }else{
						// console.log('3333')
						// _this.submitData()
					// }
						
					}
				})
				// uni.showLoading({
				// 	title:'图片正在上传'
				// })
				
			},
			submitData(){
				console.log()
				let _this = this
				let postUrl = this.isEdit ? '/community/updateCommunity' : "/community/addCommunity"
				let postPar = this.isEdit ? {
							landlordId:_this.$store.state.landladyInfo.id,
							communityAddress:_this.myAddr,
							communityName:_this.myName,
							communityImgs:_this.imgArr.join(','),
							id:this.communityInfo.id
						} : {
							landlordId:_this.$store.state.landladyInfo.id,
							communityAddress:_this.myAddr,
							communityName:_this.myName,
							communityImgs:_this.imgArr.join(','),
						}
						_this.$request.post(postUrl,postPar).then((data)=>{
							// console.log(data)
							uni.showToast({
								title: '添加成功',
								duration:1500,
							})
								this.$store.commit('chooseLocationInfo',{})
							_this.refreshLastPage()
							 
						})
					
			
			},
			uploadSuccess(result) {
				// let data = JSON.parse(result.data)
				console.log('只愿一生',result)
				uni.hideLoading()
				this.imgArr = result
				this.submitData()
				},
				//上传方法的调用
				upFile(){
					this.$refs.upimg.upload()
				},
				
				
		}
	}
</script>

<style scoped>
	
	.addCommunity{
		width: 100%;
		height: 100vh;
		padding-top: 30rpx;
		background-color: #FAFAFA;
		position: relative;
	}
	
	.content{
		background-color: #FFFFFF;
		padding: 0 40rpx;
	}
	.inpArrow{
		width: 30rpx;
		height: 24rpx;
		margin-left: 8rpx;
		
	}
	.form-input{
		width: 86%;
		/* width: 100%; */
		height: 100%;
		margin-left: auto;
		text-align: right;
		overflow: hidden;
		max-width: 500rpx;
	}
	.uploadBlock{
		width: 100%;
		height: fit-content;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		white-space: nowrap;
		padding: 25rpx 38rpx 25rpx 0;
	}
	.uploadImg{
		width: 100%;
		height: 106rpx;
		margin-left: auto;
	}
	.btnBox{
		width: 100%;
		padding-left: 65rpx;
		
	}
	.btnSave,.addNext{
		width: 290rpx;
		height: 74rpx;
		border-radius: 37rpx;
		font-size: 32rpx;
		text-align: center;
		line-height: 74rpx;
	}
	.btnSave{
		color: #FFA344;
		border: 2rpx solid #FFA344;
		position: absolute;
		bottom: 120rpx;
		left: 65rpx;
	}
	.addNext{
		background:linear-gradient(-90deg,rgba(243,182,73,1) 0%,rgba(240,154,66,1) 100%);
		color: #FFFFFF;
		position: absolute;
		bottom: 120rpx;
		right: 65rpx;
	}
	
	
</style>
