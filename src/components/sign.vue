<template>
  <div>
    <el-table
      :data="collectList"
      stripe
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column prop="collectId" label="序号"> </el-table-column>
      <el-table-column prop="collectName" label="名称"> </el-table-column>
      <el-table-column prop="work" label="指定收集对象"> </el-table-column>
      <el-table-column prop="departmentName" label="指定被收集部门">
      </el-table-column>
      <el-table-column prop="ifIcon" label="是否拍照打卡"> </el-table-column>
      <el-table-column label="信息选择">
        <template slot-scope="scope">
          <el-collapse value="false">
          <el-collapse-item title="info" >
              <div >{{scope.row.info}}</div>
          </el-collapse-item>
          </el-collapse>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="打卡限制地点范围">
      </el-table-column>
      <el-table-column prop="startDate" label="开始日期"> </el-table-column>
      <el-table-column prop="startTime" label="开始时间"> </el-table-column>
      <el-table-column prop="endDate" label="结束日期"> </el-table-column>
      <el-table-column prop="endTime" label="结束时间"> </el-table-column>
      <el-table-column prop="dayTimes" label="每天重复次数"> </el-table-column>
      <el-table-column align="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "Sign",
  data() {
    return {
      collectList: [],
      loading: true,
    };
  },
  methods: {
    handleDelete(index, row) {
      let _this=this;
      _this.loading=true;
      _this.$http.post('http://101.132.70.231:8081/api/task/delete',{
        name:row.collectName
      },
      { emulateJSON: true }
      ).then(
        (res)=>{
          _this.loading=false;
          _this.$message(res.body.msg);
          _this.loadData();
        },
        (res)=>{
          _this.$message(res.body.error);
        }
      );
    },
    loadData() {
      let _this = this;
      _this.loading=true;
      _this.$http.get("http://101.132.70.231:8081/api/task/getList").then((res) => {
        _this.loading = false;
        _this.collectList = res.body.data;
         _this.$message(res.body.msg);
      }, (res)=>{
      _this.loading = false;
      _this.$message(res.body.error); 
    });
    },
  },
  created() {
    let _this = this;
    _this.$http.get("http://101.132.70.231:8081/api/task/getList").then((res) => {
      _this.loading = false;
      _this.collectList = res.body.data;
      _this.$message(res.body.msg);
    },
    (res)=>{
      _this.loading = false;
      _this.$message(res.body.error); 
    });
  },
};
</script>
<style scoped>
</style>