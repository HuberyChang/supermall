/*
混入使用：
  1、在其他组件导入引入组件
  2、导入mixin
  3、mixin加入导入的mixin对象
* */
import {debounce} from "./utils";
import BackTop from "components/content/backTop/BackTop";
import {BACK_POSITION} from "common/const";

export const itemListenerMixin = {
  data() {
    return {
      itemImgListener: null,
      refresh: null
    }
  },
  mounted() {
    this.refresh = debounce(this.$refs.scroll.refresh, 500)
    this.itemImgListener = () => {
      this.refresh()
    }

    this.$bus.$on('itemImageLoad', this.itemImgListener)
  }
}

export const backTopMixin = {
  components: {
    BackTop
  },
  data() {
    return {
      isShow: false
    }
  },
  methods: {
    backClick() {
      this.$refs.scroll.scrollTo(0, 0, 500)
    },
    listenShowBackTop(position) {
      this.isShow = -position.y > BACK_POSITION
    },
  }
}
