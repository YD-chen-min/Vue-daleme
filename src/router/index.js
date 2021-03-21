import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path:'/login',
    name:'login',
    component:()=>import('../views/login'),
  },
  {
    path:'/location',
    name:'location',
    component:()=>import('../components/location'),
    meta:{
      requireAuth:true
    }
  },{
    path:"/department",
    name:'department',
    component:()=>import('../components/department'),
    meta:{
      requireAuth:true
    }
  },{
    path:'/history',
    name:'history',
    component:()=>import('../components/history'),
    meta:{
      requireAuth:true
    }
  },{
    path:'/message',
    name:'messgae',
    component:()=>import('../components/message'),
    meta:{
      requireAuth:true
    }
  },{
    path:'/sign',
    name:'sign',
    component:()=>import('../components/sign'),
    meta:{
      requireAuth:true
    }
  },{
    path:'/task',
    name:'task',
    component:()=>import('../components/task'),
    meta:{
      requireAuth:true
    }
  },{
    path:'/tongji',
    name:'tongji',
    component:()=>import('../components/tongji'),
    meta:{
      requireAuth:true
    }
  },{
    path:'/worker',
    name:'worker',
    component:()=>import('../components/worker'),
    meta:{
      requireAuth:true
    }
  }
]

const router = new VueRouter({
  routes
})
//全局守卫
router.beforeEach((to,from,next)=>{
  
  if(to.matched.some(record=>record.meta.requireAuth)){
    if(sessionStorage.getItem('user')===null){
      next({
        path:'/login',
        query:{
          redirect:to.fullPath
        }
      });
    }else{
     next();
    }
  }
  next();
});
export default router
