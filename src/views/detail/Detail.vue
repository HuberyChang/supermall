<template>
  <div id="detail">
    <detail-nav-bar ref="nav" class="detail-nav" @titleClick="titleClick"></detail-nav-bar>
    <scroll ref="scroll" :probe-type="3" class="content" @scroll="contentScroll">
      <detail-swiper :top-images="topImages"></detail-swiper>
      <detail-base-info :goods="goods"></detail-base-info>
      <detail-shop-info :shop="shop"></detail-shop-info>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"></detail-goods-info>
      <detail-param-info ref="params" :param-info="paramInfo"></detail-param-info>
      <detail-comment-info ref="comment" :comment-info="commentInfo"></detail-comment-info>
      <goods-list ref="recommend" :goods="recommends"></goods-list>
    </scroll>
    <detail-bottom-bar @addCart="addToCart"></detail-bottom-bar>
    <back-top v-show="isShow" @click.native="backClick"></back-top>
    <!--    <toast :message="message" :show="show"></toast>-->

  </div>
</template>

<script>
import DetailNavBar from "./childComps/DetailNavBar";
import DetailSwiper from "./childComps/DetailSwiper";
import DetailBaseInfo from "./childComps/DetailBaseInfo";
import DetailShopInfo from "./childComps/DetailShopInfo";
import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
import DetailParamInfo from "./childComps/DetailParamInfo";
import DetailCommentInfo from "./childComps/DetailCommentInfo";
import DetailBottomBar from "./childComps/DetailBottomBar";
// import Toast from "components/common/toast/Toast";
import Scroll from "components/common/scroll/Scroll";
import GoodsList from "components/content/goods/GoodsList";
import BackTop from "components/content/backTop/BackTop";


import {getDetail, getRecommend, Goods, GoodsParam, Shop} from "network/detail";
import {backTopMixin, itemListenerMixin} from "common/mixin";
import {debounce} from "common/utils";

import {mapActions} from "vuex";


export default {
  name: "Detail",
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    DetailBottomBar,
    Scroll,
    GoodsList,
    BackTop,
    // Toast,
  },
  mixins: [
    itemListenerMixin,
    backTopMixin
  ],
  data() {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      themeTopYs: [],
      getThemeTopY: null,
      currentIndex: 0,
      isShow: false,
      // message:'',
      // show:false
    }
  },
  created() {
    // 1、保存传入的iid
    this.iid = this.$route.params.iid;

    // 2、根据iid请求详情数据
    getDetail(this.iid).then(res => {
      const data = res.result
      // 1、获取顶部的轮播图
      this.topImages = data.itemInfo.topImages;

      // 2、获取商品信息
      this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)

      // 3、创建店铺信息
      this.shop = new Shop(data.shopInfo)

      // 4、保存商品详情
      this.detailInfo = data.detailInfo

      // 5、获取参数信息
      this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)

      // 6、取出评论
      if (data.rate.cRate !== 0) {
        this.commentInfo = data.rate.list[0]
      }


      // this.$nextTick(()=>{
      //   this.themeTopYs=[]
      //   this.themeTopYs.push(0)
      //   this.themeTopYs.push(this.$refs.params.$el.offsetTop)
      //   this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
      //   this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
      //   console.log(themeTopYs);
      // })

    })

    // 3、请求推荐数据
    getRecommend().then(res => {
      this.recommends = res.data.list
    })

    // 4、给getThemeTopY赋值
    this.getThemeTopY = debounce(() => {
      this.themeTopYs = []
      this.themeTopYs.push(0)
      this.themeTopYs.push(this.$refs.params.$el.offsetTop)
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
      this.themeTopYs.push(Number.MAX_VALUE)
    }, 100)
  },
  mounted() {

    // const refresh = debounce(this.$refs.scroll.refresh, 500)
    // this.itemImgListener = () => {
    //   refresh()
    // }
    //
    // this.$bus.$on('itemImageLoad', this.itemImgListener)
  },
  destroyed() {
    this.$bus.$off('itemImageLoad', this.itemImgListener)
  },
  methods: {
    ...mapActions(['addCart']),
    imageLoad() {
      // this.$refs.scroll.refresh()
      this.refresh()
      this.getThemeTopY()

    },
    titleClick(index) {
      console.log(index);
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 100)
    },
    contentScroll(position) {
      // console.log(position);
      // 获取y值
      const positionY = -position.y
      let length = this.themeTopYs.length
      // 方法一：
      // for (let i = 0; i < length; i++) {
      //   if (this.currentIndex !== i && ((i < length - 1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i + 1]) || (i === length - 1 && positionY >= this.themeTopYs[i]))) {
      //     console.log(i);
      //     this.currentIndex = i
      //     this.$refs.nav.currentIndex = this.currentIndex
      //   }
      // }
      // 方法二：
      for (let i = 0; i < length - 1; i++) {
        if (this.currentIndex !== i && (positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i + 1])) {
          console.log(i);
          this.currentIndex = i
          this.$refs.nav.currentIndex = this.currentIndex
        }
      }

      // 显示回到顶部
      // 使用混入mixin
      this.listenShowBackTop(position)
      // this.isShow = -position.y > BACK_POSITION
    },
    // backClick() {
    //   this.$refs.scroll.scrollTo(0, 0, 500)
    // },
    addToCart() {
      // console.log('--ghjkl---');
      // 获取购物车需要展示的信息
      const product = {}
      product.image = this.topImages[0]
      product.title = this.goods.title
      product.desc = this.goods.desc
      product.price = this.goods.realPrice
      product.iid = this.iid

      // 加到购物车
      // 通过getters 映射actions方法
      this.addCart(product).then(res => {
        // this.show=true
        // this.message=res
        // setTimeout(() => {
        //   this.show=false
        //   // this.message=''
        // },1000)

        this.$toast.show(res, 1500)
      })

      // this.$store.commit('addCart', product)
      // this.$store.dispatch('addCart',product).then(res=>{
      //   console.log(res);
      // })
    }
  }
}
</script>

<style scoped>
#detail {
  position: relative;
  z-index: 9;
  background-color: #fff;
  height: 100vh;
}

.detail-nav {
  position: relative;
  z-index: 9;
  background-color: #fff;
}

.content {
  height: calc(100% - 44px);
}
</style>
