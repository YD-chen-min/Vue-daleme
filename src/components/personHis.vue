<template>
  <div class="page">
     <div class="row">
      <div><el-avatar> {{name}} </el-avatar></div>
      <div>
        <table>
          <tr>
            <td>姓名：{{name}} </td>
            <td>部门：{{department}}</td>
          </tr>
             <tr>
            <td>已签到次数：{{signCounts}} </td>
            <td>未签到次数：{{unSignCounts}}</td>
          </tr>
        </table>
      </div>
    </div>
    <div class="row">
      <el-collapse v-model="activeNames" @change="loadData">
        <el-collapse-item title="未签到记录" name="1">
          <el-table
          :data="noSignList"
          stripe
          style="width: 100%">
          <el-table-column prop="collectName" label="打卡任务"> </el-table-column>
          <el-table-column prop="collectType" label="打卡类型"> </el-table-column>
          <el-table-column prop="work" label="员工"> </el-table-column>
          <el-table-column prop="departmentName" label="部门"> </el-table-column>
          <el-table-column prop="date" label="日期"> </el-table-column>
        </el-table>
        </el-collapse-item>
        <el-collapse-item title="已签到记录" name="2">
          <el-table
          :data="signList"
          stripe
          style="width: 100%">
          <el-table-column prop="collectName" label="打卡任务"> </el-table-column>
          <el-table-column prop="collectType" label="打卡类型"> </el-table-column>
          <el-table-column prop="work" label="员工"> </el-table-column>
          <el-table-column prop="departmentName" label="部门"> </el-table-column>
          <el-table-column prop="date" label="日期"> </el-table-column>
        </el-table>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
export default {
 props:{
   name:null,
   department:null,
   signCounts:null,
   unSignCounts:null,
 },
 data(){
   return {
     noSignList:[],
     signList:[],

   }
 },
methods:{
 loadData(){
    let _this=this;
   _this.$http.get("http://101.132.70.231:8081/sign/person/all",
   {params:{
     workName:_this.name,
     departmentName:_this.department,
     ifSign:"1"
   }}).then((res)=>{
     if(res.body.code==0){
       _this.signList=res.body.data;
     }
   });
    _this.$http.get("http://101.132.70.231:8081/sign/person/all",
   {params:{
     workName:_this.name,
     departmentName:_this.department,
     ifSign:"0"
   }}).then((res)=>{
     if(res.body.code==0){
       _this.noSignList=res.body.data;
     }
   });
 }
}
}

</script>

<style scoped>
.page{
  display: flex;
  flex-direction: column;
  height: 100%;
}
.row{
  display: flex;
  position: relative;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: center;
  height: 50%;
}


</style>