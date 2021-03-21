<template>
  <div class="page">
    <div class="cell">
      <b style="display: block; font-size: 40px">签到率</b>
      <d3-circle :data="data.percent" width="400px" height="400px"> </d3-circle>
    </div>
    <div class="cell">
      <b style="displat: block; font-size: 40px">已签到人次</b>

      <d3-metric :data="data.signCount" width="400px" height="400px">
      </d3-metric>
    </div>
    <div class="cell">
      <b style="displat: block; font-size: 40px">未签到人次</b>

      <d3-metric :data="data.unSignCount" width="400px" height="400px">
      </d3-metric>
    </div>
  </div>
</template>

<script>
export default {
  name: "Dataview",
  props: {
    data: {
      percent: null,
      signCount: null,
      unSignCount: null,
    },
  },
  data() {
    return {};
  },
  created() {
    console.log(this.data);
  },
};
</script>

<style  scoped>
.page {
  display: flex;
  flex-flow: row wrap;
  align-items: center;
}
.cell {
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
}
</style>