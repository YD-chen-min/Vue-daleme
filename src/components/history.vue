<template>
  <div>
    <div class="options">
      <div class="option">
        <span class="demonstration">日期：</span>
        <el-date-picker
          v-model="date"
          type="date"
          placeholder="选择日期"
          value-format="yyyy-MM-dd"
          @change="loadData"
          style="width: 180px"
        >
        </el-date-picker>
      </div>
      <div class="option">
        <span class="demonstration">打卡任务：</span>
        <el-select
          v-model="collectId"
          placeholder="全部"
          @change="loadData"
          style="width: 180px"
        >
          <el-option
            v-for="item in collects"
            :key="item.collectId"
            :label="item.collectName"
            :value="item.collectId"
          >
          </el-option>
        </el-select>
      </div>
      <div class="option">
        <span class="demonstration">筛选：</span>
        <el-select
          v-model="ifSignIn"
          placeholder="请选择"
          @change="loadData"
          style="width: 100px"
        >
          <el-option key="" label="无条件" value=""> </el-option>
          <el-option key="0" label="未签到" value="0"> </el-option>
          <el-option key="1" label="已签到" value="1"> </el-option>
        </el-select>
      </div>
      <div class="option">
        <span class="demonstration">一键提醒</span>
        <el-button
          type="info"
          icon="el-icon-message"
          circle
          @click="sendMessage"
        ></el-button>
      </div>
      <div class="option">
        <el-button type="primary" round @click="view">可视化</el-button>
         <el-button type="primary" round @click="export2Excel">导出</el-button>
      </div>
    </div>
    <el-table
      :data="daySignList"
      style="width: 100%"
      :row-class-name="tableRowClassName"
      :summary-method="getSummaries"
      show-summary
      v-loading="loading"
    >
      <el-table-column prop="collectName" label="打卡任务"> </el-table-column>
      <el-table-column prop="collectType" label="打卡类型"> </el-table-column>
      <el-table-column prop="work" label="员工"> </el-table-column>
      <el-table-column prop="departmentName" label="部门"> </el-table-column>
      <el-table-column prop="ifSign" label="是否完成签到"> </el-table-column>
      <el-table-column prop="address" label="要求签到地点范围"> </el-table-column>
      <el-table-column prop="date" label="签到日期"> </el-table-column>
      <el-table-column prop="time" label="签到时间"> </el-table-column>
      <el-table-column prop="info" label="信息"> </el-table-column>
      <el-table-column prop="icon" label="打卡照片"> 
        <template slot-scope="scope">
          <el-image v-if="scope.row.icon!=null &&scope.row.icon!='null'" @click="showIcon(scope.row.icon)"
          :alt="scope.row.icon"
            style="width: 100px; height: 100px"
            :src="scope.row.icon"
            fit="scale-down"
            ></el-image>
             <b v-else>
            null
        </b>
        </template>
       
      </el-table-column>
      <el-table-column label="位置">
        <template slot-scope="scope">
          <el-button type="primary" @click="handleSee(scope.$index, scope.row)"
            >查看</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="查看打卡位置" :visible.sync="dialogVisible" width="80%" center="true" top="1vh">
      <bmap style="height: 80%" :center="center"> </bmap>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <el-dialog title="数据可视化" :visible.sync="viewVisible" fullscreen center="true">
      <data-view :data="data"></data-view>
      <span slot="footer" class="dialog-footer">
        <el-button @click="viewVisible = false">取 消</el-button>
        <el-button type="primary" @click="viewVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="照片" :visible.sync="iconVisible" center="true" width="50%" >
      <el-image
      :src="url"
      fit="contain"></el-image>
      <span slot="footer" class="dialog-footer">
        <el-button @click="iconVisible = false">取 消</el-button>
        <el-button type="primary" @click="iconVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Bmap from "./Bmap.vue";
import DataView from "./dataView.vue";
export default {
  components: { Bmap, DataView },
  name: "History",

  data() {
    return {
      date: "",
      collectId: "",
      collects: [
        {
          collectId: "",
          collectName: "全部",
        },
      ],
      daySignList: [],
      ifSignIn: "",
      loading: true,
      center: {},
      dialogVisible: false,
      sums: [],
      viewVisible: false,
      url:null,
      iconVisible:false,
    };
  },
  computed: {
    data() {
      let sign = 0;
      let unSign = 0;
      for (let i = 0; i < this.daySignList.length; i++) {
        if (this.daySignList[i].ifSign === "未签到") {
          unSign++;
        } else {
          sign++;
        }
      }
     if((sign+unSign)===0){
        return {
        signCount:sign,
        unSignCount:unSign,
        percent:0
      };
     }else{
        return {
        signCount:sign,
        unSignCount:unSign,
        percent:(sign * 1.0) / (unSign + sign)
      };
     }
    },
  },
  methods: {
    tableRowClassName({ row }) {
      if (row.ifSign === "未签到") {
        return "warning-row";
      } else {
        return "success-row";
      }
    },
    handleSee(index, row) {
      let lnglat = row.location.split(",");
      this.center = {
        lng: lnglat[0],
        lat: lnglat[1],
      };
      console.log(this.center);
      this.dialogVisible = true;
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计(总数/已签)";
          return;
        }
        const values = data.map((item) => Number(item[column.property]));
        if (!values.every((value) => isNaN(value))) {
          sums[4] = values.reduce((prev, curr) => {
           
            if (curr === 0) {
              curr = 0;
            } else {
              curr = 1;
            }
            return prev + curr;
          }, 0);
          sums[4] += "已签人次";
        } else {
          sums[1] = values.reduce((prev, curr) => {
            curr = 1;
            return prev + curr;
          }, 0);
          sums[1] += "人次";
        }
      });
      return sums;
    },
    loadData() {
      let _this = this;
      _this.$http
        .get("http://101.132.70.231:8081/sign/all/record", {
          params: {
            date: _this.date,
            collectId: _this.collectId,
            ifSignIn: _this.ifSignIn,
          },
        })
        .then(
          (res) => {
            _this.daySignList = res.body.data;
            _this.$message(res.body.msg);
          },
          (res) => {
            _this.$message(res.body.error);
          }
        );
    },
    sendMessage() {
      let _this = this;
      let workids = "";
      for (let i = 0; i < _this.daySignList.length; i++) {
        workids += _this.daySignList[i].workId + ";";
      }
      _this.$http
        .get("http://101.132.70.231:8081/api/sendMessage", {
          params: { workIds: workids },
        })
        .then(
          (res) => {
            _this.$message(res.body.msg);
          },
          (res) => {
            _this.$message(res.body.error);
          }
        );
    },
    view() {
      this.viewVisible = true;
    },
     export2Excel(){
          require.ensure([], () => {
            const { export_json_to_excel } = require('../Excel/Export2Excel');
            const tHeader = [ '打卡任务', '打卡类型', '员工','部门','签到状态','签到日期','签到时间','签到信息'];
            const filterVal = ['collectName', 'collectType', 'work','departmentName','ifSign','date','time','info'];
            const list = this.daySignList;
            const data = this.formatJson(filterVal, list);
            export_json_to_excel(tHeader, data, '列表excel');
          })
        },
        formatJson(filterVal, jsonData){
          return jsonData.map(v => filterVal.map(j => v[j]))
        },
      showIcon(src){
        this.url=src;
        this.iconVisible=true;
      }
  },
  created() {
    let _this = this;
    _this.$http.get("http://101.132.70.231:8081/api/task/getList").then(
      (res) => {
        _this.loading = false;
        _this.collects = _this.collects.concat(res.body.data);
      },
      (res) => {
        _this.loading = false;
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
.el-table .warning-row {
  background: rgb(253, 1, 1);
}

.el-table .success-row {
  background: #59ff00;
}
.demonstration {
  margin-right: 5px;
}
</style>