<template>
  <div>
    <el-form
      :model="collectForm"
      ref="collectForm"
      label-width="180px"
      class="demo-dynamic"
    >
      <div class="cell">
        <el-form-item
          prop="name"
          label="收集名称"
          :rules="[
            { required: true, message: '请输入任务名称', trigger: 'blur' },
          ]"
        >
          <el-input v-model="collectForm.name"></el-input>
        </el-form-item>
      </div>
      <div class="cell">
        <el-form-item prop="locationId" label="打卡限制地点">
          <el-select v-model="collectForm.locationId" placeholder="请选择">
            <el-option
              v-for="item in locationList"
              :key="item.locationId"
              :label="item.locationName"
              :value="item.locationId"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </div>
      <div class="cell">
        <el-form-item prop="workId" label="指定被收集的员工（编号）">
          <el-input v-model="collectForm.wordId"></el-input>
        </el-form-item>
      </div>
      <div class="cell">
        <el-form-item prop="departmentId" label="指定被收集的部门">
          <el-select v-model="collectForm.departmentId" placeholder="请选择">
            <el-option
              v-for="item in departmentList"
              :key="item.departmentId"
              :label="item.name"
              :value="item.departmentId"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </div>
      <div class="cell">
        <el-form-item prop="startDate" label="开始日期">
          <el-date-picker
            v-model="collectForm.startDate"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
      </div>
      <div class="cell">
        <el-form-item prop="startTime" label="开始时间" value-format="HH:mm">
          <el-time-select
            v-model="collectForm.startTime"
            :picker-options="{
              start: '06:00',
              step: '00:15',
              end: '23:00',
            }"
            placeholder="选择时间"
          >
          </el-time-select>
        </el-form-item>
      </div>
      <div class="cell">
        <el-form-item prop="endDate" label="结束日期">
          <el-date-picker
            v-model="collectForm.endDate"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
      </div>
      <div class="cell">
        <el-form-item prop="endTime" label="结束时间" value-format="HH:mm">
          <el-time-select
            v-model="collectForm.endTime"
            :picker-options="{
              start: '06:00',
              step: '00:15',
              end: '23:00',
            }"
            placeholder="选择时间"
          >
          </el-time-select>
        </el-form-item>
      </div>
      <div class="cell">
        <el-form-item prop="ifIcon" label="是否为拍照签到">
          <el-radio v-model="collectForm.ifIcon" label="0">否</el-radio>
          <el-radio v-model="collectForm.ifIcon" label="1">是</el-radio>
        </el-form-item>
      </div>
      <div class="cell">
        <el-form-item prop="dayTimes" label="每天重复次数">
          <el-input-number
            v-model="collectForm.dayTimes"
            :min="0"
            :max="3"
            label="每天重复次数"
          ></el-input-number>
        </el-form-item>
      </div>
      <div class="cell">
        <el-form-item prop="question" label="信息问题">
          <el-input v-model="collectForm.question"></el-input>
        </el-form-item>
      </div>
      <div class="cell">
        <el-form-item
          v-for="(chose, index) in collectForm.choices"
          :label="'选项' + index"
          :key="chose.key"
          :prop="'choices.' + index + '.value'"
          style="display: inline"
        >
          <el-input v-model="chose.value"></el-input
          ><el-button @click.prevent="removeChoice(chose)">删除</el-button>
        </el-form-item>
      </div>
      <div class="cell">
        <el-form-item>
          <el-button type="primary" @click="submitForm(collectForm)"
            >提交</el-button
          >
          <el-button @click="addChoice">新增选项</el-button>
          <el-button @click="resetForm('collectForm')">重置</el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "Task",
  data() {
    return {
      collectForm: {
        choices: [{ value: "" }],
        question: "",
        name: "",
        locationId: "",
        workId: "",
        departmentId: "",
        startDate: "",
        startTime: "",
        endDate: "",
        endTime: "",
        ifIcon: "",
        dayTimes: "",
      },
      locationList: [
        {
          locationId: "",
          locationName: "无限制",
        },
      ],
      departmentList: [
        {
          departmentId: "",
          name: "全公司",
        },
      ],
    };
  },
  methods: {
    submitForm(collectForm) {
      let _this = this;
      let health = "" + collectForm.question + ";";
      for (let i = 0; i < collectForm.choices.length; i++) {
        health += collectForm.choices[i].value + ";";
      }
      console.log(collectForm);
      _this.$http
        .post(
          "http://101.132.70.231:8081/api/task/add",
          {
            name: collectForm.name,
            locationId: collectForm.locationId,
            health: health,
            startDate: collectForm.startDate,
            startTime: collectForm.startTime,
            endDate: collectForm.endDate,
            endTime: collectForm.endTime,
            workId: collectForm.workId,
            departmentId: collectForm.departmentId,
            ifIcon: collectForm.ifIcon,
            dayTimes: collectForm.dayTimes,
          },
          {
            emulateJSON: true,
          }
        )
        .then(
          (res) => {
            _this.$message(res.body.msg);
          },
          (res) => {
            _this.$message(res.body.error);
          }
        );
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    removeChoice(item) {
      var index = this.collectForm.choices.indexOf(item);
      if (index !== -1) {
        this.collectForm.choices.splice(index, 1);
      }
    },
    addChoice() {
      this.collectForm.choices.push({
        value: "",
        key: Date.now(),
      });
    },
  },
  created() {
    let _this = this;
    _this.$http.get("http://101.132.70.231:8081/api/department/getlist").then(
      (res) => {
        _this.departmentList = _this.departmentList.concat(res.body.data);
      },
      (res) => {
        _this.$message(res.body.error);
      }
    );
    _this.$http.get("http://101.132.70.231:8081/api/location/getList").then(
      (res) => {
        _this.locationList = _this.locationList.concat(res.body.data);
      },
      (res) => {
        _this.$message(res.body.error);
      }
    );
  },
};
</script>

<style scoped>
.cell {
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
}
</style>