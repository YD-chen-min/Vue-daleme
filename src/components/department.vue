<template>
  <div>
    <el-table
      :data="departmentList"
      stripe
      style="width: 100%"
      v-loading="loading"
      show-summary
    >
      <el-table-column prop="departmentId" label="部门编号"> </el-table-column>
      <el-table-column prop="name" label="部门名称"> </el-table-column>
      <el-table-column prop="workerSum" label="员工数目"> </el-table-column>
      <el-table-column align="right">
        <template slot="header">
          <el-button size="mini" round @click="viewVisible = true"
            >可视化</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="数据可视化" :visible.sync="viewVisible" fullscreen>
      <d3-pie
        :options="options"
        :data="data"
        width="100%"
        height="400px"
      >
      </d3-pie>
      <span slot="footer" class="dialog-footer">
        <el-button @click="viewVisible = false">取 消</el-button>
        <el-button type="primary" @click="viewVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Department",
  data() {
    return {
      departmentList: [],
      loading: true,
      viewVisible: false,
      data:[],
      options:{
       
        axisLabelFontSize:60
      }
    };
  },
  created() {
    let _this = this;
    _this.$http.get("http://101.132.70.231:8081/api/department/getlist").then(
      (res) => {
        _this.loading = false;
        _this.departmentList = res.body.data;
        for(let i=0;i<res.body.data.length;i++){
          _this.data.push({
            key:res.body.data[i].name,
            value:Number(res.body.data[i].workerSum)
          });
        }
      },
      (res) => {
        _this.$message(res.body.error);
      }
    );
  },
};
</script>

<style scoped>
</style>