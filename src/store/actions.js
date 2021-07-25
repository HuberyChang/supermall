import {ADD_COUNTER, ADD_TO_CART} from "./mutation-types";

export default {
  addCart(context, payload) {
    return new Promise((resolve, reject) => {

      // 查找之前的数组是否有这个商品
      let oldProduct = context.state.cartList.find(item => item.iid === payload.iid);

      if (oldProduct) { // 数量+1
        // oldProduct.count += 1
        context.commit(ADD_COUNTER, oldProduct)
        resolve('数量加一')
      } else { // 添加新的商品
        payload.count = 1
        // context.state.cartList.push(payload)
        context.commit(ADD_TO_CART, payload)
        resolve('商品加一')
      }
    })
  }
}
