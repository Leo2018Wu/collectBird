<template>
  <view class="containerMap">
    <!-- <map
	  :style="{'width':map.width+'px','height':map.height+'px'}"
      :latitude="map.latitude"
      :longitude="map.longitude"
      :show-location = "map.showLocation"
	  :controls="map.controls"
    ></map> -->
	<view class="headBlock">
		<view class="headContent">
			<image class="locationImg1" src="../../static/location.png" mode="aspectFit"></image>
			<!-- <span>{{currentCity}}</span> -->
			<span>上海</span>
			<image class="locationImg2" src="../../static/locationRIght.png" mode="aspectFit"></image>
			<input v-if="!isCommunity" class="inputClass textOverFlow" @input="getsuggest" v-model="inputValue"  placeholder="小区/公寓名" placeholder-class="inputPlaceHolder"/>
			<input v-else class="inputClass textOverFlow" @input="getsuggest" v-model="inputValue"  placeholder="地址" placeholder-class="inputPlaceHolder"/>
		</view>
	</view>
	<view class="welContent">
		您可以直接选择
	</view>
    <view v-for="(item,index) in suggestion" :key="index" class="locationList">
      <view class="locationLi"  @click="backfill(index)">
        <view class="textOverFlow" >{{item.title}}</view>
        <span class="textOverFlow">{{item.addr}}</span>
      </view>
    </view>
  </view>
</template>

<script>
var qqmapsdk;
import wxRequest from 'wechat-request';
import QQMapWX from "../../libs/qqmap-wx-jssdk.js";
export default {
  data() {
    return {
		isCommunity:false,
      inputValue: "",
      suggestion: [],
      currentCity: "",
      map: {
		width:375,
		height:400,
		showLocation:"true",
        latitude: 31.22114,
        longitude: 121.54409,
		controls:[{
				id:"map",
				iconPath:'../../static/icon_position.png',
				position:{
					left :0,	
					top : 180,
					width : 40,
					height : 40,
					clickable: false
				}  
		}]
      },
	  
    };
  },
  onLoad(options) {
	  console.log(options)
	  if(options.type == 'addr'){
		  this.isCommunity = true
	  }
    let _this = this;
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: "2QMBZ-CH4K4-XNNUZ-DUOLW-Z5AXJ-TFBD3"
    });
	// const mobileInfo = uni.getSystemInfoSync()
	// console.log(mobileInfo)
	// _this.map.width = mobileInfo.windowWidth;
	// _this.map.controls[0].position.left = (mobileInfo.windowWidth - 40) / 2 ;
    _this.getCurLocation();
  },
  methods: {
    getCurLocation() {
      let _this = this;
	  uni.getLocation({
		type: 'gcj02',
	  	success(res) {
			qqmapsdk.reverseGeocoder({
				location: {
				    latitude: res.latitude,
				    longitude: res.longitude,
				},
			  success(data) {
			    let resData = data.result;
			    // _this.map.latitude = resData.location.lat;
			    // _this.map.longitude = resData.location.lng;
			    _this.currentCity = resData.address_component.city;
			  }
			});
	  	}
	  })
    },
    //数据回填方法
    backfill: function(id) {
      // var id = e.currentTarget.id;
      for (var i = 0; i < this.suggestion.length; i++) {
        if (i == id) {
          this.map.latitude = this.suggestion[i].latitude;
          this.map.longitude = this.suggestion[i].longitude;
          this.inputValue = this.suggestion[i].title;
		  let par = {
			  name:this.suggestion[i].title,
			  addr:this.suggestion[i].addr
		  }
		  
		  this.$store.commit('chooseLocationInfo',par);
		  setTimeout(()=>{
			  uni.navigateBack()
		  },800)
		  console.log(this.$store)
        }
      }
    },
    //触发关键词输入提示事件
    getsuggest: function(e) {
      var _this = this;
      //调用关键词提示接口
      qqmapsdk.getSuggestion({
        //获取输入框值并设置keyword参数
        keyword: e.detail.value, //用户输入的关键词，可设置固定值,如keyword:'KFC'
        policy: 1,
		region:'上海',
        // region: _this.currentCity, //设置城市名，限制关键词所示的地域范围，非必填参数
		"auto-extend":0,
        success: function(res) {
          //搜索成功后的回调
          var sug = [];
          for (var i = 0; i < res.data.length; i++) {
            sug.push({
              // 获取返回结果，放到sug数组中
              title: res.data[i].title,
              id: res.data[i].id,
              addr: res.data[i].address,
              city: res.data[i].city,
              district: res.data[i].district,
              latitude: res.data[i].location.lat,
              longitude: res.data[i].location.lng
            });
          }
          _this.suggestion = sug;
        },
        fail: function(error) {
          console.error(error);
        },
        complete: function(res) {
          console.log(res);
        }
      });
    }
  }
};
</script>

<style scoped>

.headBlock{
	height: 100rpx;
	width: 100%;
	padding: 20rpx 30rpx 18rpx 30rpx;
	border-bottom: 2rpx solid #ECECEC;
}
.headContent{
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: flex-start;
	align-items: center;
}
.welContent{
	width: 100%;
	height: 90rpx;
	border-bottom: 1rpx solid #ECECEC;
	padding-left: 30rpx;
	line-height: 90rpx;
	font-size: 28rpx;
	color: #999999;
	font-weight: 500;
}
.locationImg1{
	width: 22rpx;
	height: 22rpx;
	margin-right: 6rpx;
}
.headContent span{
	font-size: 30rpx;
	color: #333333;
}
.locationImg2{
	width: 16rpx;
	height: 16rpx;
	margin-left: 6rpx;
	margin-right: auto;
}
.inputClass{
	border-radius: 5rpx;
	background: #F5F5F5;
	width: 520rpx;
	height: 100%;
	color: #333333;
	font-size: 30rpx;
	padding-left: 20rpx;
}
.inputPlaceHolder{
	color: #9B9B9B;
	font-size: 30rpx;
}
.locationList{
	width: 100%;
	padding: 0 58rpx;
	text-align: left;
}
.locationLi{
	font-size: 30rpx;
	padding: 25rpx 0;
	border-bottom: 2rpx solid #F4F4F4;
}
.locationLi view{
	font-weight: bold;
}
.locationLi span{
	font-size: 24rpx;
	color: #999999;
	margin-top: 20rpx;
}

</style>
