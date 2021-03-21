<template>
  <div>
    <el-table
      :data="locationList"
      stripe
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column prop="locationId" label="序号"> </el-table-column>
      <el-table-column prop="locationName" label="方案名称"> </el-table-column>
      <el-table-column prop="locationInfo" label="地址坐标"></el-table-column>
      <el-table-column prop="address" label="详细地址"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
      <el-table-column align="right">
        <template slot="header">
          <el-button round @click="handleAdd()">添加地点</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="设置打卡范围"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      fullscreen
    >
      <el-dialog
        width="30%"
        title="添加地址"
        :visible.sync="innerVisible"
        append-to-body
      >
        <b>地点名称</b
        ><el-input v-model="locationName" placeholder="请输入内容"></el-input><br>
        <b>详细地址</b
        ><el-input v-model="addree" placeholder="请输入内容"></el-input>
        <span slot="footer" class="dialog-footer">
          <el-button @click="innerVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleAddLocation">确 定</el-button>
        </span>
      </el-dialog>
      <bmap style="height: 80%" @points="pointsChange"></bmap>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="innerVisible = true">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Bmap from "./Bmap.vue";
export default {
  name: "Location",
  data() {
    return {
      locationList: [],
      dialogVisible: false,
      innerVisible: false,
      locationName: "",
      locationInfo: "",
      loading: true,
      address:"",
    };
  },
  methods: {
    loadData() {
      this.$http.get("http://101.132.70.231:8081/api/location/getList").then(
        (res) => {
          this.loading = false;
          this.locationList = res.body.data;
        },
        (res) => {
          this.loading = false;
          this.$message(res.body.error);
        }
      );
    },
    handleEdit(index, row) {
      let _this = this;
      this.$prompt("请输入新的名称", "更改名称", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      }).then(({ value }) => {
        _this.$http
          .post(
            "http://101.132.70.231:8081/api/location/modify",
            {
              locationId: row.locationId,
              locationName: value,
              locationInfo: row.locationInfo,
            },
            { emulateJSON: true }
          )
          .then(
            (res) => {
              _this.$message(res.body.msg);
              _this.loadData();
            },
            (res) => {
              this.$message(res.body.error);
            }
          );
      });
    },
    handleDelete(index, row) {
      let _this=this;
      _this.$http
        .post(
          "http://101.132.70.231:8081/api/location/delete",
          {
            name: row.locationName,
          },
          { emulateJSON: true }
        )
        .then(
          (res) => {
            _this.$message(res.body.msg);
            _this.loadData();
          },
          (res) => {
            _this.$message(res.body.error);
          }
        );
    },
    handleAdd() {
      this.dialogVisible = true;
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(() => {
          done();
        })
        .catch(() => {});
    },
    handleAddLocation() {
      this.loading = true;
      let _this = this;
      _this.$http
        .post(
          "http://101.132.70.231:8081/api/location/add",
          {
            name: _this.locationName,
            locationInfo: _this.locationInfo,
            address:_this.address
          },
          { emulateJSON: true }
        )
        .then(
          (res) => {
            _this.loading = false;
            _this.$message(res.body.msg);
            _this.loadData();
            _this.innerVisible=false;
            _this.dialogVisible=false;
          },
          (res) => {
            _this.loading = false;
            _this.$message(res.body.error);
          }
        );
    },
    pointsChange(options) {
      this.locationInfo = "";
      for (let i = 0; i < options.length; i++) {
        this.locationInfo += options[i].lng + "," + options[i].lat + ";";
      }
    },
  },
  created() {
    this.$http.get("http://101.132.70.231:8081/api/location/getList").then(
      (res) => {
        this.loading = false;
        this.locationList = res.body.data;
      },
      (res) => {
        this.loading = false;
        this.$message(res.body.error);
      }
    );
  },
  components: { Bmap },
};
</script>

<style  scoped>
</style>