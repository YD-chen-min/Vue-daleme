<template>
  <div>
    <div class="options">
      <div class="option">
        <b>部门：</b>
        <el-select
          v-model="departmentId"
          @change="loadData"
          placeholder="请选择"
        >
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
      </div>
      <div class="option">
        <b>工号:</b>
        <el-input
          v-model="workId"
          @change="loadData"
          placeholder="请输入工号"
        ></el-input>
      </div>
    </div>
    <el-table :data="workerList" stripe style="width: 100%" v-loading="loading">
      <el-table-column prop="workId" label="工号" width="180">
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="180"> </el-table-column>
      <el-table-column prop="departmentName" width="180" label="部门">
      </el-table-column>
      <el-table-column prop="departmentId" width="180" label="部门编号">
      </el-table-column>
      <el-table-column prop="phoneNumber" width="180" label="手机">
      </el-table-column>
       <el-table-column prop="mac" label="设备标识" width="180"> </el-table-column>
      <el-table-column align="right">
        <template slot="header">
          <el-button size="mini" round @click="handleAdd()">添加员工</el-button>
        </template>
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="修改员工信息" :visible.sync="dialogFormVisible">
      <el-form :model="selectedWorker">
        <el-form-item label="工号" :label-width="formLabelWidth" required>
          <el-input v-model="selectedWorker.workId"></el-input>
        </el-form-item>
        <el-form-item label="姓名" :label-width="formLabelWidth" required>
          <el-input v-model="selectedWorker.name"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth" required>
          <el-input
            v-model="selectedWorker.phoneNumber"
            type="number"
          ></el-input>
        </el-form-item>
        <el-form-item label="部门" :label-width="formLabelWidth" required>
          <el-select
            v-model="selectedWorker.departmentId"
            placeholder="请选择部门"
          >
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
        <el-button type="danger" round @click="resetPassword">重置密码</el-button>
        <el-button type="danger" round @click="resetMac">解除绑定</el-button>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="modifyInfo">修改</el-button>
      </div>
    </el-dialog>
    <el-dialog title="添加员工" :visible.sync="dialogAddVisible">
      <el-form :model="addWorker">
        <el-form-item label="姓名" :label-width="formLabelWidth" required>
          <el-input v-model="addWorker.name"></el-input>
        </el-form-item>
        <el-form-item label="部门" :label-width="formLabelWidth" required>
          <el-select v-model="addWorker.departmentId" placeholder="请选择部门">
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="add">添加</el-button>
      </div>
    </el-dialog>
  </div>
</template>
  
<script>
export default {
  name: "Worker",
  data() {
    return {
      departmentList: [{ departmentId: "", name: "全部" }],
      workerList: [],
      departmentId: "",
      workId: "",
      selectedWorker: {},
      dialogFormVisible: false,
      formLabelWidth: "120px",
      loading: true,
      password: null,
      addWorker: {
        name: "",
        departmentId: "",
        roleId: "0",
        password: "e10adc3949ba59abbe56e057f20f883e",
      },
      dialogAddVisible: false,
      mac:null,
    };
  },
  methods: {
    handleEdit(index, row) {
      this.selectedWorker = row;
      this.dialogFormVisible = true;
    },
    resetMac(){
      let _this = this;
      _this.$http
        .post(
          "http://101.132.70.231:8081/api/user/resetMac",
          {
            workId: _this.selectedWorker.workId,
          }
        )
        .then(
          (res) => {
            _this.loading = false;
            _this.$message(res.body.msg);
            _this.loadData();
          },
          (res) => {
            _this.loading = false;
            _this.$message(res.body.error);
          }
        );
    },
    handleDelete(index, row) {
      let _this = this;
      _this.$http
        .post(
          "http://101.132.70.231:8081/api/user/delete",
          {
            workIds: row.workId,
          },
          { emulateJSON: true }
        )
        .then(
          (res) => {
            _this.loading = false;
            _this.$message(res.body.msg);
            _this.loadData();
          },
          (res) => {
            _this.loading = false;
            _this.$message(res.body.error);
          }
        );
    },
    handleAdd() {
      this.dialogAddVisible = true;
    },
    resetPassword() {
      let _this = this;
      _this.$http
        .post(
          "http://101.132.70.231:8081/api/user/resetPassword",
          {
             workId: _this.selectedWorker.workId,
          }
        )
        .then(
          (res) => {
            _this.loading = false;
            _this.$message(res.body.msg);
            _this.loadData();
          },
          (res) => {
            _this.loading = false;
            _this.$message(res.body.error);
          }
        );
    },
    
    modifyInfo() {
      let _this = this;
      _this.loading = true;
      _this.$http
        .post("http://101.132.70.231:8081/api/user/modify", {
          workId: _this.selectedWorker.workId,
          name: _this.selectedWorker.name,
          password: _this.password,
          departmentId: _this.selectedWorker.departmentId,
          phoneNumber: _this.selectedWorker.phoneNumber,
        })
        .then(
          (res) => {
            _this.loading = false;
            _this.$message(res.body.msg);
            _this.dialogFormVisible = false;
            _this.loadData();
          },
          (res) => {
            _this.loading = false;
            _this.$message(res.body.error);
          }
        );
    },
    loadData() {
      let _this = this;
      if (_this.workId === "") {
        _this.$http
          .get("http://101.132.70.231:8081/api/user/getList", {
            params: { departmentId: _this.departmentId },
          })
          .then(
            (res) => {
              _this.workerList = res.body.data;
            },
            (res) => {
              _this.$message(res.body.error);
            }
          );
      } else {
        _this.$http
          .get("http://101.132.70.231:8081/api/user/get", {
            params: { workId: _this.workId },
          })
          .then(
            (res) => {
              _this.workerList = [];
              _this.workerList.push(res.body.data);
            },
            (res) => {
              _this.$message(res.body.error);
            }
          );
      }
    },
    add() {
      let _this = this;
      _this.loading = true;
      _this.$http
        .post(
          "http://101.132.70.231:8081/api/user/add",
          {
            name: _this.addWorker.name,
            departmentId: _this.addWorker.departmentId,
            roleId: _this.addWorker.roleId,
            password: _this.addWorker.password,
          },
          { emulateJSON: true }
        )
        .then(
          (res) => {
            _this.loading = false;
            _this.$message(res.body.msg);
            _this.dialogAddVisible = false;
            _this.loadData();
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
    _this.$http.get("http://101.132.70.231:8081/api/department/getlist").then(
      (res) => {
        _this.loading = false;
        _this.departmentList = _this.departmentList.concat(res.body.data);
      },
      (res) => {
        _this.$message(res.body.error);
      }
    );
    _this.$http.get("http://101.132.70.231:8081/api/user/getList").then(
      (res) => {
        _this.loading = false;
        _this.workerList = res.body.data;
        _this.$message(res.body.msg);
      },
      (res) => {
        _this.$message(res.body.error);
      }
    );
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
  justify-content: center;
}
.option {
  display: flex;
  position: relative;
  margin: 0px 20px;
  flex-flow: row nowrap;
  align-items: center;
}
.option b {
  word-break: keep-all;
  white-space: nowrap;
  margin: 0px 10px;
}
</style>