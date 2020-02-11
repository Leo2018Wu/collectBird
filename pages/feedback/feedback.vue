<template>
 	<view class="feedback">
 		<view class="container">
 			<view class="title">反馈类型</view>
 			<view class="feedbackTypes">
 				<view
 				    class="feedbackType"
 				    @click="changeIndex(item,index)"
 				    v-for="(item,index) in arr1"
 					:key="index"
 				    :class="{active : currentIndex == index}">{{item}}
 				</view>
 			</view>	
 			<view class="question">请描述你在使用收租鸟时的问题</view>
 			<view class="questionInput">
 				<evan-form class="evanForm" :hide-required-asterisk="hideRequiredAsterisk" ref="form" :model="info">
 						<evan-form-item  prop="questionCommit">
 							<template v-slot:main>
 								<!-- <input @click="chooseLocation" class="form-input" placeholder-class="form-input-placeholder" v-model="info.name" placeholder="请输入小区名" /> -->
 								<textarea value="" class="form-textarea" v-model="info.questionCommit" placeholder="请输入内容最多300字" maxlength="300"  placeholder-class="form-input-placeholder"/>
 							</template>
 						</evan-form-item>
 				</evan-form>
 			</view>
 			<!-- <view class="questionInput">
 				<textarea value="" placeholder="请输入内容最多300字" maxlength="300" />
 			</view> -->
 		</view>
 		<view class="submit" @click="commit()">提交</view>
 	</view>
 </template>
 
 <script>
 	import evanFormItem from '../../components/evan-form/evan-form-item.vue'
 	import evanForm from '../../components/evan-form/evan-form.vue'
 	
 	export default {
 		components:{
 			evanFormItem,
 			evanForm
 		},
 		data() {
 			return {
 				arr1:['打不开页面','闪退问题','支付问题','登录与注册','其他问题','新建议'],
 				currentIndex: 0,
				feedbackType:'打不开页面',
 				questionCommit:'',
				info:{
					questionCommit:'',
				},
 				rules:{
 					questionCommit:{
 						required:true,
 						message:"请输入你在使用收租鸟时的问题"
 					}
 				}
 			}
 		},
 		onLoad(options){
 			this.$nextTick(() => {
 				this.$refs.form.setRules(this.rules)
 			})
 		},
 		methods: {
 			changeIndex(item,index){
 				console.log(item,index);
				this.feedbackType = item
 				this.currentIndex = index;
 			},
 			commit(){
				let _this = this;
				uni.showLoading({
					title:'正在提交'
				})
				this.$refs.form.validate((res) => {
					console.log();
					let v={
						createUser:"ab8afaed-31f7-11ea-91b8-525400bc2088",
						type:this.feedbackType,
						reason:this.info.questionCommit
					}
					console.log(v);
					if (res) {
						_this.$request.post('/feedback/addFeedBack',v).then(res=>{
							console.log(res)
							uni.showToast({
								title:'提交成功，感谢您的反馈',
							});
							// this.feedbackType='打不开页面';
							// this.info.questionCommit = '';
							setTimeout(()=>{
								uni.navigateBack({
								  delta: 1
								})
							},1000);
							
						}).catch(()=>{
							uni.hideLoading()
						})
					}
				})
			}
 		}
 	}
 </script>
 
 <style>
 	.feedback {
 		width: 100%;
 		height: 100vh;
 		border-top: 1rpx solid #DBDBDB;
 	}
 
 	.container {
 		position: relative;
 	}
 
 	.title {
 		padding: 40rpx 41rpx 20rpx;
 		font-size: 32rpx;
 		font-family: PingFang SC;
 		font-weight: bold;
 	}
 
 	.feedbackTypes {
 		width: 100%;
 		/* height: 100rpx; */
 		/* display: flex;
 		justify-content: space-between; */
 		padding: 14rpx 35rpx;
 		text-align: center;
 		overflow: hidden;
 	}
 
 	.feedbackType {
 		width: 206rpx;
 		height: 56rpx;
 		border: 1rpx solid #DBDBDB;
 		line-height: 53rpx;
 		border-radius: 28rpx;
 		font-size: 24rpx;
 		font-family: PingFang SC;
 		font-weight: 400;
 		float: left;
 		color: rgba(102, 102, 102, 1);
 		margin: 10rpx;
 	}
 
 	.submit {
 		position: absolute;
 		bottom: 50rpx;
 		left: 34%;
 		background-color: #F09A42;
 		color: #fff;
 		width: 257rpx;
 		height: 74rpx;
 		text-align: center;
 		line-height: 74rpx;
 		border-radius: 37rpx;
 	}
 
 	.question {
 		font-size:32rpx;
 		font-family:PingFang SC;
 		font-weight:bold;
 		color:#333333;
 		overflow: hidden;
 		margin-left: 37rpx;
 		margin-top: 20rpx;
 	}
 
 	.questionInput {
		width: 100%;
 		padding: 134rpx 40rpx 0rpx;
 		font-size: 26rpx;
 		font-family: PingFang SC;
 		color: rgba(153, 153, 153, 1);
 		/* border-bottom: 1rpx solid rgba(238, 238, 238, 1); */
 	}

 	.active {
 		background-color: #F09A42;
 		color: #fff;
 		border: none;
 
 	}
 </style>
 