<template>
  <div>
    <el-table :data="noticeList" stripe style="width: 100%" v-loading="loading">
      <el-table-column prop="noticeId" label="序号" width="180">
      </el-table-column>
      <el-table-column prop="title" label="标题" width="180"> </el-table-column>
      <el-table-column prop="departmentName" label="发布部门">
      </el-table-column>
      <el-table-column prop="type" label="公告类型"> </el-table-column>
      <el-table-column prop="date" label="发布日期"> </el-table-column>
      <el-table-column label="内容">
        <template slot-scope="scope">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            v-model="scope.row.noticeContents"
            readonly="readonly"
          >
          </el-input>
        </template>
      </el-table-column>
      <el-table-column align="right">
        <template slot="header">
          <el-button size="mini" round @click="dialogAddVisible = true"
            >添加公告</el-button
          >
        </template>
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
    <el-dialog title="添加公告" :visible.sync="dialogAddVisible">
      <el-form :model="addNotice">
        <el-form-item label="标题" :label-width="formLabelWidth" required>
          <el-input v-model="addNotice.title"></el-input>
        </el-form-item>
        <el-form-item label="部门" :label-width="formLabelWidth" required>
          <el-select v-model="addNotice.departmentId" placeholder="请选择部门">
            <el-option
              v-for="item in departmentList"
              :key="item.departmentId"
              :label="item.name"
              :value="item.departmentId"
              border:true
              stripe:true
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="公告类型" :label-width="formLabelWidth" required>
          <el-radio v-model="addNotice.type" label="普通公告"
            >普通公告</el-radio
          >
          <el-radio v-model="addNotice.type" label="紧急公告"
            >紧急公告</el-radio
          >
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="内容" required>
          <el-input
            type="textarea"
            :autosize="{ maxRows: 6 }"
            v-model="addNotice.content"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAdd">添加</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Message",
  data() {
    return {
      departmentList: [{ departmentId: "", name: "全部" }],
      addNotice: {
        title: "",
        departmentId: "",
        type: "",
        content: "",
      },
      noticeList: [],
      loading: true,
      dialogAddVisible: false,
      formLabelWidth: "120px",
    };
  },
  methods: {
    handleAdd() {
      let _this = this;
      _this.loading = true;
      _this.$http
        .post("http://101.132.70.231:8081/api/notice/add", {
          date: new Date().getTime(),
          title: _this.addNotice.title,
          departmentId: _this.addNotice.departmentId,
          type: _this.addNotice.type,
          content: _this.addNotice.content,
        }, 
        { emulateJSON: true }
        )
        .then(
          (res) => {
            _this.loading = false;
            if (res.body.code === 0) {
              _this.loadData();
            }
            _this.$message(res.body.msg);
            _this.dialogAddVisible = false;
          },
          (res) => {
            _this.loading = false;
            _this.$message(res.body.error);
          }
        );
    },
    handleDelete(index, row) {
      let _this = this;
      this.$http
        .post(
          "http://101.132.70.231:8081/api/notice/delete1",
          {
            name: row.title,
          },
          { emulateJson: true }
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
    loadData() {
      let _this = this;
      _this.loading = true;
      _this.$http.get("http://101.132.70.231:8081/api/notice/getlist").then(
        (res) => {
          _this.loading = false;
          if (res.body.code === 0) {
            _this.noticeList = res.body.data;
          }
          _this.$message(res.body.msg);
          _this.dialogAddVisible = false;
        },
        (res) => {
          _this.loading = false;
          _this.$message(res.body.error);
        }
      );
    },
  },
  created() {
    let _this = this;
    _this.$http.get("http://101.132.70.231:8081/api/notice/getlist").then(
      (res) => {
        _this.loading = false;
        if (res.body.code === 0) {
          _this.noticeList = res.body.data;
        }
        _this.$message(res.body.msg);
        _this.dialogAddVisible = false;
      },
      (res) => {
        _this.loading = false;
        _this.$message(res.body.error);
      }
    );
    _this.$http.get("http://101.132.70.231:8081/api/department/getlist").then(
      (res) => {
        _this.loading = false;
        _this.departmentList = _this.departmentList.concat(res.body.data);
      },
      (res) => {
        _this.$message(res.body.error);
      }
    );
  },
};
</script>

<style  scoped>
</style>