<template>
  <div class="bg">
    <div class="title">打了么后台管理信息系统</div>
    <div class="box">
      <div>
        <img src="../assets/id.png" class="icon" />
        <input id="id" type="text" placeholder="请输入账号" v-model="id" />
      </div>
      <div>
        <img src="../assets/password.png" class="icon" />
        <input
          id="password"
          type="password"
          placeholder="输入密码"
          v-model="password"
        />
      </div>
      <div>
        <div style="background-color: rgba(255, 255, 255, 0); height: 18px">
          <input type="checkbox" value="true" class="radio" />自动登录
        </div>
        <div style="background-color: rgba(255, 255, 255, 0); height: 18px">
          <a href="#">忘记密码</a>
        </div>
      </div>
      <button @click="login">立即登录</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      id: "",
      password: "",
    };
  },
  methods:{
    login(){
      this.$http.post('http://101.132.70.231:8081/login',{
        id:this.id,
        password:this.password
      },
      {emulateJSON:true}
      ).then(
        (res)=>{
          if(res.body.code===0){
            let data={
              user:this.id
            };
            sessionStorage.setItem('user',JSON.stringify(data));
            if(this.$route.query.redirect){
              console.log("有参");
              this.$router.push({
              path:this.$route.query.redirect
            });
            }else{
              console.log("无参");
              this.$router.push({
              path:'/'
            });
            }
          }else{
            this.$message(res.body.msg);
          }
        },
        (res)=>{
          this.$message(res.body.error);
        }
      )
    }
  }
};
</script>

<style scoped>
.bg {
  display: flex;
  position: absolute;
  width: 100%;
  height: 100%;
  background: url("../assets/bg.gif") fixed repeat;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.box {
  width: 640px;
  height: 400px;
  background: rgba(255, 255, 255, 0.3);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
}
input {
  width: 480px;
  height: 48px;
  border: 1px solid #eeeeee;
  background: #ffffff;

  opacity: 1;
}
#id ::placeholder,
#password ::placeholder {
  width: 56px;
  height: 14px;
  font-size: 14px;
  font-family: SourceHanSansCN;
  font-weight: 400;
  color: #b4b4b4;
  line-height: 40px;
}
.icon {
  width: 18px;
  height: 18px;
  padding-right: 10px;
  padding-left: 10px;
}
.box div:nth-child(1),
.box div:nth-child(2) {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 20px;
  background-color: #ffffff;
  height: 56px;
  border-radius: 5px;
}
.radio {
  width: 16px;
  height: 16px;
  background-color: rgba(255, 255, 255, 0);
}

.box div:nth-child(3) {
  width: 100%;
  background-color: rgba(255, 255, 255, 0);
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  position: relative;
}
button {
  width: 480px;
  height: 56px;
  background: #3eb4fa;
  font-size: 18px;
  font-family: SourceHanSansCN;
  font-weight: 400;
  color: #ffffff;
}
.title {
  width: 456px;
  height: 39px;
  font-size: 40px;
  font-family: Adobe Heiti Std;
  font-weight: normal;
  color: #ffffff;
  line-height: 40px;
  margin-bottom: 40px;
}
</style>