<template>
	<view>
		<view class="zhtx-imgs">
			<view class="zhtx-single" v-for="(item, index) in list" :key="index" >
				<image :src="item" :data-src="item" mode="aspectFill" @tap="previewImg" />
				<view class="zhtx-del" @tap="deleteItem(index)">x</view> 
			</view>
			<image v-if="limit>list.length" class="zhtx-single zhtx-addNew" @tap="chooseFile" src="../../static/upload.png" mode="aspectFit"></image>
			<!-- <view v-if="limit>list.length" class="zhtx-single zhtx-addNew" @tap="chooseFile"> -->
				
			<!-- </view> -->
		</view>
	</view>
</template>

<script>
	
	let toast= msg=>{
		uni.showToast({
			title: msg,
			icon:'none'
		});
	}
	
	export default {
		props: {
			uImgList: {
				type: Array, //附件列表
				default () {
					return {}
				}
			},
			uploadFileUrl: {
				type: String,
				dafault: '#' // 上传文件的服务器url
			},
			header: {
				type: Object, //上传图片到服务器时，HTTP 请求 Header
				default () {
					return {}
				}
			},
			limit: {
				type: Number, //限制可上传的图片数量
				default: 9 //这里有问题???
			},
			fileKeyName: {
				type: String,
				default: 'file' //用于在服务端通过自定义key值获取该文件数据
			},
			canUploadFile: { //是否更新
				type: Boolean,
				default: true
			},
			parentPath:{
				type:String,
				default:"community"
			},
			isJustUpload:{
				type:Boolean,
				default:false
			}
		},
		computed: {
			list: {
				get(){
					return this.uImgList
				}
			}
		},
		data() {
			return {
				imageList: [],
			};
		},
		
		methods: {
			//预览
			previewImg(e) {
				console.log(...this.list);
				uni.previewImage({
					current: e.target.dataset.src,
					loop: true,
					longPressActions: {
						itemList: ['发送给朋友', '保存图片', '收藏'],
						success: function(data) {
							console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
						},
						fail: function(err) {
							console.log(err.errMsg);
						}
					},
					urls: this.list   //this.imageList,保持删除了的不在
				});
			},
			//删除
			deleteItem(index) {
				uni.showModal({
					title: '提示',
					content: '确定要删除此项吗？',
					success: res => {
						if (res.confirm) {
							this.imageList.splice(index,1)
							this.list.splice(index, 1);
							this.$forceUpdate(); //强制更新
							this.$emit('update:uImgList', this.list); //类似双向数据绑定
							this.$emit('deleteImg')
						}
					}
				});
			},

			chooseFile() {
				//双重保证
				// console.log(this.list);
				if (this.list.length >= this.limit) {
					toast('已达到最大上传数量')
					return; 
				}
				
				let canUploadFile = this.canUploadFile;
				let tempFiles;
				if (canUploadFile) {
					uni.chooseImage({
						count: this.limit - this.list.length,
						sizeType: ['original', 'compressed'], 
						sourceType: ['album', 'camera'],
						success: (res) => {
							// console.log(res.tempFilePaths);
							console.log(res)
							tempFiles = res.tempFilePaths;
							this.imageList = this.imageList.concat(tempFiles)
							
							console.log(this.imageList);
							this.list.push(...tempFiles)//如果图片一次性就超过这个值怎么使他赋的值回退
							this.$emit('uploadTrue');
							this.$emit('update:uImgList', this.list); //类似双向数据绑定,更新数据, 使用.sync修饰
							this.$forceUpdate();
							
							// ******
							if(this.isJustUpload){
								this.upload()
							}
							//***
							console.log(this.list);
						},
						fail:err=>{
							console.log(err);
						}
					});
						
				} 
			},
			
			upload(){
					uni.showLoading({
						title: '上传中...',
						mask: true,
					});
				let _this = this
				let imgArr = []
				for(let i=0; i<this.list.length;i++){
					let path=this.list[i]
					let index=i.toString()
					console.log('文件',path,_this.parentPath)
					uni.uploadFile({
						// url:"http://192.168.10.184:8889"+this.uploadFileUrl,
						url:"https://funnyduck.raysler.com/rentbird"+this.uploadFileUrl,
						// name: this.fileKeyName,
						name: "file",
						filePath: path, // 使用files上传数组列表,上面两者都会失效
						// file:[
						// 	{name:index,url:path}
						// ],
						formData:{
							parentPath:_this.parentPath,
							fileType:"images"
						},
						success:res=>{
							uni.hideLoading()
							console.log(res);
							let data = JSON.parse(res.data)
							if(data.code == '87014'){
								uni.showToast({
									title:'图片内容违规，请重新选择',
									icon:'none'
								})
								return;
							}
							imgArr.push(data.data)
							if(imgArr.length == this.list.length){
								this.$emit('uploadSuccess', imgArr);
							}
							// if (res.statusCode == 200) {
							// 	//上传成功将原信息,直接删除,
							// 	this.list.splice(i,1)
							// 	console.log(this.list);
							// 	console.log(res);
							// 	this.$forceUpdate();
							// } else {
											
							// }
						},
						fail:err=>{
							this.$emit('uploadSuccess',this.uImgList)
							// uni.hideLoading()
							// uni.showToast({
							// 	title:err.errMsg
							// })
							console.log(err);
						}
					})
								
				}
				
			},
			
		}
	};
</script>

<style  scoped>
	.zhtx-imgs {
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-end;
		align-items: center;
	}
	.zhtx-del {
		position: absolute;
		width: 35rpx;
		height: 35rpx;
		background: #f56c6c;
		color: #fff;
		top: 0;
		text-align: center;
		right: 0;
		line-height: 28rpx;
		font-size: 30rpx;
		z-index: 100;
	}
	.zhtx-single {
		position: relative;
		width: 106rpx;
		height: 106rpx;
		margin-left: 10rpx;
		z-index: 10;
	}
	.zhtx-addNew {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	image {
		width: 100%;
		height: 100%;
		display: block;
		border-radius: 5rpx;
	}
</style>
