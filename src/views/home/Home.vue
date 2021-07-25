<template>
  <!--  <h2>首页</h2>-->
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>
    <tab-control v-show="isTabFixed" ref="tabControl1" :titles="['流行','新款 ','精选']" class="tab-control"
                 @tabClick='tabClick'></tab-control>

    <!--scroll里边用的驼峰probeType，这里用probe-type-->
    <scroll ref="scroll" :probe-type="3" :pull-up-load="true" class="content" @pullingUp="loadMore"
            @scroll="contentScroll">
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"></home-swiper>
      <recommend-view :recommends="recommends"></recommend-view>
      <feature-view></feature-view>
      <tab-control ref="tabControl2" :titles="['流行','新款 ','精选']"
                   @tabClick='tabClick'></tab-control>
      <goods-list :goods="showGoods"></goods-list>
    </scroll>

    <!--    组件不能直接监听点击事件，必须使用@click.native-->
    <back-top v-show="isShow" @click.native="backClick"></back-top>

  </div>
</template>

<script>
import HomeSwiper from "./childComps/HomeSwiper";
import RecommendView from "./childComps/RecommendView";
import FeatureView from "./childComps/FeatureView";

import NavBar from "components/common/navbar/NavBar";
import TabControl from "components/content/tabControl/TabControl";
import GoodsList from "components/content/goods/GoodsList";
import Scroll from "components/common/scroll/Scroll";
import BackTop from "components/content/backTop/BackTop";

import {getHomeGoods, getHomeMultiData} from "network/home";
import {itemListenerMixin} from "common/mixin";

export default {
  name: "Home",
  components: {
    HomeSwiper,
    RecommendView,
    FeatureView,
    NavBar,
    TabControl,
    GoodsList,
    Scroll,
    BackTop,
  },
  mixins: [
    itemListenerMixin
  ],
  computed: {
    showGoods() {
      return this.goods[this.currentType].list
    }
  },
  data() {
    return {
      // result:null
      banners: [],
      recommends: [],
      goods: {
        'pop': {page: 0, list: []},
        'new': {page: 0, list: []},
        'sell': {page: 0, list: []},
      },
      currentType: "pop",
      isShow: false,
      tabOffsetTop: 0,
      isTabFixed: false,
      saveY: 0,
    }
  },
  activated() {
    console.log("activated");
    this.$refs.scroll.refresh()
    this.$refs.scroll.scrollTo(0, this.saveY, 0)
  },
  deactivated() {
    console.log("deactivated");
    this.saveY = this.$refs.scroll.getScrollY()

    // 取消全局事件的监听
    this.$bus.$off('itemImageLoad', this.itemImgListener)
  },
  created() {
    // 1、请求多个数据
    this.getHomeMultiData()

    // 2、请求商品数据
    this.getHomeGoods('pop')
    this.getHomeGoods('new')
    this.getHomeGoods('sell')


  },
  mounted() {
    // this.$refs.swiper
    // 这个地方的img确实被挂载，但是其中的图片还没占据高度
    // 3、监听item中图片加载完成
    // const refresh = debounce(this.$refs.scroll.refresh, 500)
    //
    // // 对监听的时间进行保存
    // this.itemImgListener = () => {
    //   refresh();
    // }
    // this.$bus.$on('itemImageLoad', this.itemImgListener)

    // 获取tabControl的offsettop
    // 所以组件都有一个属性，$el:用于获取组件中的元素的
    //

  },
  methods: {
    /*
    * 事件监听相关方法*/

    tabClick(index) {
      console.log(index);
      switch (index) {
        case 0:
          this.currentType = 'pop'
          break
        case 1:
          this.currentType = 'new'
          break
        case 2:
          this.currentType = 'sell'
          break
      }
      this.$refs.tabControl1.currentIndex = index
      this.$refs.tabControl2.currentIndex = index
    },
    backClick() {
      this.$refs.scroll.scrollTo(0, 0, 500)
    },
    contentScroll(position) {
      // 1、判断backtop是否显示
      this.isShow = (-position.y) > 800

      // 2、决定tabControl是否吸顶
      this.isTabFixed = (-position.y) > this.tabOffsetTop
    },
    loadMore() {
      console.log("加载");
      this.getHomeGoods(this.currentType)

      this.refresh()
    },
    swiperImageLoad() {
      // console.log(this.$refs.tabControl2.$el.offsetTop);
      this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
    },

    /*
    * 网络请求相关方法
    * */
    getHomeMultiData() {
      getHomeMultiData().then(res => {
        console.log(res.data);
        // this.result=res
        // res在函数执行完后被回收，需要一个变量来保存
        this.banners = res.data.banner.list
        this.recommends = res.data.recommend.list
      })
    },
    getHomeGoods(type) {
      const page = this.goods[type].page + 1
      getHomeGoods(type, page).then(res => {
        // console.log(res)
        this.goods[type].list.push(...res.data.list)
        this.page += 1

        this.$refs.scroll.finishPullUp()
      })
    }
  }
}
</script>

<style scoped>
#home {
  /*padding-top: 44px;*/
  height: 100vh;
}

.home-nav {
  background-color: var(--color-tint);
  color: #fff;

  /*使用浏览器原生滚动，为了不让导航跟这一起滚动设置的*/
  /*position: fixed;*/
  /*left: 0;*/
  /*right: 0;*/
  /*top: 0;*/
  /*z-index: 9;*/
}

.tab-control {
  position: relative;
  /*top: 44px;*/
  z-index: 9;
}

/*.fixed {*/
/*  position: fixed;*/
/*  left: 0;*/
/*  right: 0;*/
/*  top: 44px;*/
/*}*/

.content {
  overflow: hidden;

  position: absolute;
  top: 44px;
  bottom: 49px;
  left: 0;
  right: 0;
}

/*.content {*/
/*  height: calc(100% - 93px);*/
/*  overflow: hidden;*/
/*  margin-top: 44px;*/
/*}*/
</style>
