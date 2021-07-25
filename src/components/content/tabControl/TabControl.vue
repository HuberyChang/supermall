<template>
  <div class="tab-control">
    <div v-for="(item,index) in titles" :class="{active:index===currentIndex}" class="tab-control-item"
         @click="itemClick(index)">
      <span>{{ item }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "TabControl",
  // 父传子，父组件往子组件里面传数据，子组件用props
  props: {
    titles: {
      type: Array,
      // 返回值是对象或者数组的时候，用default()函数
      default() {
        return []
      },
    }
  },
  data() {
    return {
      currentIndex: 0
    }
  },
  methods: {
    itemClick(index) {
      this.currentIndex = index
      // 子传父，子组件往父组件外面传数据，子组件用emit
      this.$emit('tabClick', index)
    }
  }
}
</script>

<style scoped>
.tab-control {
  display: flex;
  text-align: center;
  font-size: 15px;
  background-color: #fff;
  height: 40px;
  line-height: 40px;
}

.tab-control-item {
  flex: 1;
}

.tab-control-item span {
  padding: 5px;
}

.active {
  color: var(--color-high-text);
}

.active span {
  border-bottom: 3px solid var(--color-tint);
}
</style>
