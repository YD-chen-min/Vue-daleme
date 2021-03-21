<template>
  <div>
    <el-container style="height: 1275px; border: 1px solid #eee">
      <el-aside
        width="300px"
        style="background-color: rgb(0, 24, 45); height: 1275px"
      >
        <div
          style="
            background: #0059a5;
            height: 80px;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            color: #ffffff;
            font-size: 28px;
          "
        >
          打了么后台管理系统
        </div>
        <el-menu
          class="el-menu-vertical-demo"
          background-color="#00182D"
          text-color="#fff"
          active-text-color="#ffd04b"
          router
          default-active="$route.path"
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-notebook-2"></i>
              <span>基本信息管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="location">地址管理</el-menu-item>
              <el-menu-item index="department">部门管理</el-menu-item>
              <el-menu-item index="worker">员工管理</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-menu-item index="sign">
            <i class="el-icon-location"></i>
            <span slot="title">签到管理</span>
          </el-menu-item>
          <el-menu-item index="task">
            <i class="el-icon-user-solid"></i>
            <span slot="title">发布任务</span>
          </el-menu-item>
          <el-menu-item index="history">
            <i class="el-icon-s-claim"></i>
            <span slot="title">签到历史</span>
          </el-menu-item>
          <el-menu-item index="tongji">
            <i class="el-icon-s-marketing"></i>
            <span slot="title">统计信息</span>
          </el-menu-item>
          <el-menu-item index="message">
            <i class="el-icon-s-comment"></i>
            <span slot="title">通知消息</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main >
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import router from "../router/index";
export default {
  name: "Main",
  router,
};
</script>

<style scoped>
.el-header {
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
}

</style>