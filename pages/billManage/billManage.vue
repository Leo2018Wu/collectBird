<template>
  <view class="billManage">
    <view class="amountMsg">
      <view class="background"></view>
      <view class="houseTotalMsg">
        <view class="leftMsg">
          <view class="leftMsgTitle">未收金额</view>
          <view class="leftMsgValue">{{unIncome}}</view>
        </view>
        <view class="line"></view>
        <view class="rightMsg">
          <view class="rightMsgTitle">已收金额</view>
          <view class="rightMsgValue">{{income}}</view>
        </view>
      </view>
    </view>
    <view class="billBar">
      <!-- 	<view class="billBaritem active" @click="overDue">已逾期</view>
			<view class="billBaritem" @click="unpaid">未收款</view>
			<view class="billBaritem" @click="receipt">已收款</view>
      <view class="billBaritem" @click="all">全部</view>-->
      <!-- <view data-num="1" class="billBaritem {{_num==1?'active':''}}" @click="menuClick">头条</view>
			<view data-num="2" class="billBaritem {{_num==2?'active':''}}" @click="menuClick">活动</view>
      <view data-num="3" class="billBaritem {{_num==3?'active':''}}" @click="menuClick">公告</view>-->

      <view
        class="billBaritem"
        @click="changeIndex(index)"
        v-for="(item,index) in arr"
        :class="{active : currentIndex == index}"
      >{{item}}</view>
    </view>
    <view class="billList">
      <view
        class="billListItem"
        v-for="(item,index) in billListInfo"
        :key="index"
        @click="showBill(item)"
      >
        <view class="billListLeft">
          <view class="billDateText">账单日期</view>
          <view class="billDate">{{item.endDate.substr(0,10)}}</view>
          <view class="billAdress">{{item.roomNo}}</view>
        </view>
        <view class="billListright">
          <view class="billSum">{{item.total}}</view>
          <view  class="overdueNum" v-if="item.overdueDays>0">逾期{{item.overdueDays}}天</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      billListInfo: [],
      billStatus: "3", // 默认展示已逾期
      landlordId: "",
      // isActive: true, //判断是否选中
      unIncome: "",
      income: "",
      arr: ["已逾期", "未收款", "已收款", "全部"],
      currentIndex: 0,
    };
  },
  onLoad() {
    this.getMoney();
  },
  onShow() {
    this.getBillList(this.billStatus, this.landlordId);
  },
  methods: {
    showBill(item) {
      uni.navigateTo({
        url: "../billDetail/billDetail?billId=" + item.id
      });
    },
    overDue() {
      this.isActive = true;
      // this.billStatus = '3'
      this.getBillList("3", this.landlordId);
    },
    unpaid() {
      this.isActive = true;
      this.billStatus = "0";
      this.getBillList("0", this.landlordId);
    },
    receipt() {
      this.isActive = true;
      this.billStatus = "4";
      this.getBillList("4", this.landlordId);
    },
    all() {
      this.isActive = true;
      this.billStatus = "";
      this.getBillList("", this.landlordId);
    },
    getBillList(billStatus, landlordId) {
      console.log(billStatus, landlordId);
      let _this = this;
      _this.$request
        .post("/bill/billList", {
          billStatus: this.billStatus,
          // landlordId: _this.$store.state.landladyInfo.id,
          landlordId: "ab8afaed-31f7-11ea-91b8-525400bc2088"
        })
        .then(res => {
          console.log(res);
          _this.billListInfo = res.data.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    getMoney() {
      let _this = this;
      _this.$request
        .post("/bill/money", {
          id: "ab8afaed-31f7-11ea-91b8-525400bc2088"
        })
        .then(res => {
          console.log(res);
          _this.unIncome = res.data.data.unIncome;
          _this.income = res.data.data.income;
        })
        .catch(err => {
          console.log(err);
        });
    },
    changeIndex(index) {
      console.log(index);
      this.currentIndex = index;
      switch (index) {
        case 0:
          this.billStatus = "3";
          break;
        case 1:
          this.billStatus = "0";
          break;
        case 2:
          this.billStatus = "4";
          break;
        case 3:
          this.billStatus = "";
          break;
        default:
          break;
      }
      this.getBillList(this.billStatus, this.landlordId);
    }
  }
};
</script>

<style>
.billManage {
  height: 100vh;
  width: 100%;
  background-color: #fafafa;
}

.amountMsg {
  height: 16%;
  background-color: #fff;
}

.background {
  background-color: #f09a42;
  height: 47rpx;
}

.billBar {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 36rpx 30rpx 0rpx;
  font-size: 28rpx;
  font-family: PingFang SC;
  font-weight: 500;
  color: rgba(121, 121, 121, 1);
  text-align: center;
  background-color: #fff;
}

.houseTotalMsg {
  width: 690rpx;
  height: 175rpx;
  position: absolute;
  top: 10rpx;
  left: 30rpx;
  background-color: #fff;
  border-radius: 15rpx;
  display: flex;
  justify-content: space-between;
  box-shadow: 3px 5px 9px 1px rgba(225, 226, 226, 0.27);
}

.leftMsg {
  width: 48%;
  text-align: center;
  padding-top: 40rpx;
}

.leftMsgTitle {
  font-size: 24rpx;
  font-family: PingFang SC;
  font-weight: 500;
}

.leftMsgValue {
  font-size: 55rpx;
  font-family: PingFang SC;
  font-weight: bold;
  color: rgba(255, 164, 73, 1);
}

.rightMsg {
  width: 48%;
  text-align: center;
  padding-top: 40rpx;
}

.rightMsgTitle {
  font-size: 24rpx;
  font-family: PingFang SC;
  font-weight: 500;
}

.rightMsgValue {
  font-size: 55rpx;
  font-family: PingFang SC;
  font-weight: bold;
  color: rgba(255, 164, 73, 1);
}

.line {
  height: 61rpx;
  /* border: 1rpx solid rgba(190, 190, 190, 1); */
  width: 1rpx;
  background-color: rgba(190, 190, 190, 1);
  position: absolute;
  top: 57rpx;
  left: 50%;
}

.active {
  width: 141rpx;
  height: 60rpx;
  color: #f09a42;
  border-bottom: 4rpx solid #f09a42;
}

.billBaritem {
  width: 141rpx;
  height: 60rpx;
}

.billList {
  height: 67%;
  /* background-color: #FAFAFA; */
  /* background-color: #F09A42; */
}

.billListLeft {
  width: 75%;
}

.billListright {
  width: 25%;
  text-align: right;
}

.billListLeft,
.billListright {
  margin: 32rpx 34rpx 32rpx;
}

.billListItem {
  height: 190rpx;
  background-color: #fff;
  margin: 17rpx 30rpx 17rpx;
  display: flex;
  justify-content: space-between;
  border-radius: 12rpx;
  padding: 0rpx 34rpx;
  margin-top: 17rpx;
}

.billDateText {
  font-size: 28rpx;
  font-family: PingFang SC;
  font-weight: bold;
  color: #444444;
}

.billDate {
  margin-top: 10rpx;
  font-size: 33rpx;
  font-family: PingFang SC;
  font-weight: 500;
  color: #333333;
}

.billAdress {
  margin-top: 10rpx;
  font-size: 26rpx;
  font-family: PingFang SC;
  font-weight: 500;
  color: #999999;
}

.billSum {
  font-size: 45rpx;
  font-family: PingFang SC;
  font-weight: bold;
  color: #eb5e61;
}

.overdueNum {
  font-size: 26rpx;
  font-family: PingFang SC;
  font-weight: 500;
  color: #eb5e61;
  margin-top: 30rpx;
}
</style>
