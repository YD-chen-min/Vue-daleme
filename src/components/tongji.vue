<template>
  <div>
    <el-tabs>
      <el-tab-pane label="全部打卡统计"
        ><day-sign-times></day-sign-times
      ></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import DaySignTimes from "./daySignTimes.vue";
export default {
  name: "Tongji",
  components: {
    DaySignTimes,
  },methods:{
   
  }
};
</script>

<style  scoped>
</style>