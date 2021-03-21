<template>
  <div>
    <div class="options">
      <div class="option">
        <b>部门：</b>
        <el-select
          v-model="departmentId"
          placeholder="请选择"
          @change="loadData"
        >
          <el-option
            v-for="item in departmentList"
            :key="item.departmentId"
            :label="item.name"
            :value="item.departmentId"
          >
          </el-option>
        </el-select>
      </div>
      <div class="option">
        <el-button type="primary" round @click="view">可视化</el-button>
         <el-button type="primary" round @click="export2Excel">导出</el-button>
      </div>
    </div>
    <el-table
      :data="tableData"
      border
      show-summary
      stripe
      style="width: 100%"
      :summary-method="getSummaries"
      v-loading="loading"
      @row-dblclick="showPersonHis"
    >
      <el-table-column prop="workName" label="员工"> </el-table-column>
      <el-table-column prop="departmentName" label="部门"> </el-table-column>
      <el-table-column prop="signInTimes" label="累计签到次数">
      </el-table-column>
      <el-table-column prop="noSignTimes" label="累计缺勤次数">
      </el-table-column>
    </el-table>
    <el-dialog title="数据可视化" :visible.sync="viewVisible" fullscreen  center="true" destroy-on-close="true" >
      <data-view :data="data"></data-view>
      <span slot="footer" class="dialog-footer">
        <el-button @click="viewVisible = false">取 消</el-button>
        <el-button type="primary" @click="viewVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="个人记录" :visible.sync="hisVisible"  center="true" >
      <person-his :name="select.workName" :department="select.departmentName" :signCounts="select.signInTimes" :unSignCounts="select.noSignTimes" ></person-his>
      <span slot="footer" class="dialog-footer">
        <el-button @click="hisVisible = false">取 消</el-button>
        <el-button type="primary" @click="hisVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import DataView from "../components/dataView";
import PersonHis from './personHis.vue';
export default {
  name: "DaySignTimes",
  components: { DataView ,PersonHis},
  data() {

      return {
      tableData: [],
      departmentList: [
        {
          departmentId: "",
          name: "全部",
        },
      ],
      departmentId: "",
      loading: true,
      viewVisible: false,
      hisVisible:false,
      select:{
        workName:"",
        departmentName:"",
        signInTimes:"",
        noSignTimes:""
      }
    };
  },
  computed: {
    data() {
      let sign = 0;
      let unSign = 0;
      for (let i = 0; i < this.tableData.length; i++) {
        sign += parseInt(this.tableData[i].signInTimes);
        unSign += parseInt(this.tableData[i].noSignTimes);
      }
      sign = parseInt(sign);
      unSign = parseInt(unSign);
      if (sign + unSign === 0) {
        return {
          signCount: sign,
          unSignCount: unSign,
          percent: 0,
        };
      } else {
        return {
          signCount: sign,
          unSignCount: unSign,
          percent: (sign * 1.0) / (unSign + sign),
        };
      }
    },
  },
  methods: {
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        const values = data.map((item) => Number(item[column.property]));
        if (!values.every((value) => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index];
        } else {
          sums[1] = values.reduce((prev, curr) => {
            curr = 1;
            return prev + curr;
          }, 0);
          sums[1] += "人";
        }
      });

      return sums;
    },
    loadData() {
      let _this = this;
      if (_this.departmentId === "") {
        _this.$http.get("http://101.132.70.231:8081/api/counts/all").then(
          (res) => {
            if (res.body.code === 0) {
              _this.tableData = res.body.data;
            }
            _this.$message(res.body.msg);
          },
          (res) => {
            _this.$message(res.body.error);
          }
        );
      } else {
        _this.$http
          .get("http://101.132.70.231:8081/api/counts/department", {
            params: { departmentId: _this.departmentId },
          })
          .then(
            (res) => {
              if (res.body.code === 0) {
                _this.tableData = res.body.data;
              }
              _this.$message(res.body.msg);
            },
            (res) => {
              _this.$message(res.body.error);
            }
          );
      }
    },
    view() {
      this.viewVisible = true;
    },
     export2Excel(){
          require.ensure([], () => {
            const { export_json_to_excel } = require('../Excel/Export2Excel');
            const tHeader = [ '员工', '部门', '累计签到次数','累计缺勤次数'];
            const filterVal = ['workName', 'departmentName', 'signInTimes','noSignTimes'];
            const list = this.tableData;
            const data = this.formatJson(filterVal, list);
            export_json_to_excel(tHeader, data, '列表excel');
          })
        },
        formatJson(filterVal, jsonData){
          return jsonData.map(v => filterVal.map(j => v[j]))
        },
    showPersonHis(row){
     this.select.workName=row.workName;
     this.select.departmentName=row.departmentName;
     this.select.signInTimes=row.signInTimes;
     this.select.noSignTimes=row.noSignTimes;
     this.hisVisible=true;
    }
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
    _this.$http.get("http://101.132.70.231:8081/api/counts/all").then(
      (res) => {
        if (res.body.code === 0) {
          _this.tableData = res.body.data;
        }
        _this.$message(res.body.msg);
      },
      (res) => {
        _this.$message(res.body.error);
      }
    );
  },
};
</script>

<style  scoped>
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
</style>