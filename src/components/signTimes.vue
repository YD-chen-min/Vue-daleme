<template>
  <div>
    <div class="options">
      <div class="option">
        <b>部门：</b>
        <el-select v-model="departmentId" placeholder="请选择">
            <el-option
              v-for="item in departmentList"
              :key="item.departmentId"
              :label="item.name"
              :value="item.departmentId"
            >
            </el-option>
          </el-select>
      </div>
    </div>
    <el-table :data="tableData" border show-summary stripe style="width: 100%">
      <el-table-column prop="workName" label="员工"> </el-table-column>
      <el-table-column prop="departmentName" label="部门"> </el-table-column>
      <el-table-column prop="signInTimes" label="累计签到次数">
      </el-table-column>
      <el-table-column prop="noSignTimes" label="累计缺勤次数">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "SignTimes",
  data(){
    return {
       tableData:[
      {
        workName:"dsada",
        departmentName:"销售部",
        signInTimes:10,
        noSignTimes:1
      },{
        workName:"dsaddsaa",
        departmentName:"销售部",
        signInTimes:9,
        noSignTimes:3
      }
    ], 
    departmentList: [
        {
          departmentId: "1001",
          name: "销售部",
        },
        {
          departmentId: "1002",
          name: "生产部",
        }
      ],
      departmentId:''
    }
  }
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