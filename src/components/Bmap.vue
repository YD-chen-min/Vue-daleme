<template>
  <div style="height: 80%">
    <div class="options">
      <b>搜索</b
      ><el-input
        v-model="location"
        placeholder="请输入要搜索的地方"
        style="width: 300px"
      ></el-input>
      <el-button
        icon="el-icon-search"
        circle
        @click="handleSearch"
        style="margin-left: 20px"
      ></el-button>
      <el-button type="primary" round @click="handleAddMask(BMap)"
        >标注</el-button
      >
      <el-button type="danger" round @click="handleRemoveMask"
        >删除标注</el-button
      >
      <el-link href="http://lbsyun.baidu.com/trace/admin/service" target="_blank" >
       <el-button type="primary" round @click="null"
        >鹰眼跟踪</el-button
      >
      </el-link>
    </div>
    <baidu-map
      style="height: 700px"
      :center="center"
      :zoom="zoom"
      @ready="init"
    ></baidu-map>
  </div>
</template>

<script>
export default {
  props: {
    center: {},
  },
  name: "BMap",
  data() {
    return {
      map: null,
      zoom: 13,
      location: "",
      local: null,
      loading: true,
      points: [],
      BMap: null,
    };
  },

  methods: {
    init({ BMap, map }) {
      this.BMap = BMap;
      this.map = map;
      // 初始化地图,设置中心点坐标
      var point;
      console.log(this.center)
      if (this.center ==null) {
       point= new BMap.Point(116.20, 39.56);
      } else {
        point = new BMap.Point(this.center.lng, this.center.lat);
      }
      map.centerAndZoom(point, 14);
      // 添加鼠标滚动缩放
      map.enableScrollWheelZoom();
      this.local = new BMap.LocalSearch(map, {
        renderOptions: { map: map },
      });
      map.addOverlay(
        new BMap.Marker(new BMap.Point(this.center.lng, this.center.lat))
      );
      this.loading = false;
    },
    handleSearch() {
      this.local.search("" + this.location);
    },
    handleAddMask(BMap) {
      this.map.addEventListener("click", (e) => {
        this.points.push({
          lng: e.point.lng,
          lat: e.point.lat,
        });
        this.map.addOverlay(
          new BMap.Marker(new BMap.Point(e.point.lng, e.point.lat))
        );
        this.$emit("points", this.points);
      });
    },
    handleRemoveMask() {
      let allOverlay = this.map.getOverlays();
      let index = allOverlay.length - 1;
      this.map.removeOverlay(allOverlay[index]);
      this.points.pop();
    },
  },
};
</script>

<style scoped>
.options {
  display: flex;
  width: 100%;
  height: 50px;
  flex-direction: row;
  align-items: center;
}
.option b {
  word-break: keep-all;
  white-space: nowrap;
  margin: 0px 10px;
}
</style>