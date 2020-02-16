<template>
  <!-- 废弃 -->
  <view class="inputBar">
    <slot class="slotClass"></slot>
    <!-- v-model="value" -->
    <input
      :name="myName"
      type="text"
      value
      @input="getValue"
      :placeholder="placeholderContent"
      placeholder-class="placeholderClassmy"
    />
  </view>
</template>

<script>
export default {
  data() {
    return {
      value: ""
    };
  },
  props: {
    placeholderContent: {
      type: String,
      default: ""
    },
    isAble: {
      type: Boolean,
      default: false
    },
    myName: {
      type: String,
      default: "input"
    }
  },
  computed: {
    // getValue(){
    //  return this.value
    // }
  },
  methods: {
    getValue(e) {
      // console.log("sssss", e);
      let par = {
        value: e.detail.value,
        name: this.myName
      };
      this.$emit("emitValue", par);
    }
  }
};
</script>

<style>
.inputBar {
	font-size: 34rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  white-space: nowrap;
  font-weight: bold;
  color: #333333;
}
input {
  width: calc(100% - 180rpx);
  height: 100%;
  text-align: right;
}
.slotClass {
  width: fit-content;
  margin: 20rpx;
}
.placeholderClassmy {
  color: #999999;
  font-size: 30rpx;
  text-align: right;
}
</style>
