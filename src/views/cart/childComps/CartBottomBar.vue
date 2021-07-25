<template>
  <div class="bottom-bar">
    <div class="check-content">
      <check-button :is-check="isSelectAll" class="check-button" @click.native="checkClick"></check-button>
      <span>全选</span>
    </div>

    <div class="price">
      合计：{{ totalPrice }}
    </div>

    <div class="calculate" @click="calcClick">
      去计算：({{ checkLength }})
    </div>

  </div>
</template>

<script>
import CheckButton from "components/content/checkButton/CheckButton";
import {mapGetters} from "vuex";

export default {
  name: "CartBottomBar",
  components: {
    CheckButton
  },
  computed: {
    ...mapGetters([
      'cartList'
    ]),
    totalPrice() {
      return '￥' + this.cartList.filter(item => {
        return item.checked
      }).reduce((previousValue, item) => {
        return previousValue + item.price * item.count
      }, 0).toFixed(2)
    },
    checkLength() {
      return this.cartList.filter(item => item.checked).length
    },
    isSelectAll() {
      if (this.cartList.length === 0) return false

      // 使用filter
      // return  !(this.cartList.filter(item => !item.checked).length)

      // 使用find
      return !(this.cartList.find(item => !item.checked))

      // 使用for
      // for (let item in this.cartList){
      //   if (!item.checked){
      //     return false
      //   }
      // }
      // return true
    }
  },
  methods: {
    checkClick() {
      console.log('----');
      if (this.isSelectAll) {
        this.cartList.forEach(item => item.checked = false)
      } else {
        this.cartList.forEach(item => item.checked = true)
      }

      // 简化失败
      // this.cartList.forEach(item => item.checked=!this.isSelectAll)
    },
    calcClick() {
      if (!this.isSelectAll) {
        this.$toast.show('请选择购买的商品', 1500)
      }
    }
  }
}
</script>

<style scoped>
.bottom-bar {
  height: 40px;
  background-color: #eee;
  position: relative;
  line-height: 40px;
  display: flex;
  font-size: 14px;
}

.check-content {
  display: flex;
  align-items: center;
  margin-left: 5px;
  width: 60px;
}

.check-button {
  width: 20px;
  height: 20px;
  line-height: 20px;
  margin-right: 5px;
}

.price {
  margin-left: 30px;
  flex: 1;
}

.calculate {
  width: 90px;
  background: red;
  color: #fff;
  text-align: center;
}
</style>
