<template>
  <div id="app" :class="appClasses">
    <div v-if="!loaded" class="app-loading-message">{{message}}</div>
    <template v-else>
      <div class="app-right wt-scroll" :style="appRightStyle"> 
        <keep-alive>
          <router-view></router-view>
        </keep-alive> 
      </div>
      <div class="app-left">
        <LeftMenu @on-size-change="leftMenuSizeChange"></LeftMenu>
      </div>
      <div class="app-top">
        <TopMenu :user="user"></TopMenu>
      </div>
    </template>
  </div>
</template>

<script>
import TopMenu from '@/components/nav/TopMenu'
import LeftMenu from '@/components/nav/LeftMenu'
import storage from '@/assets/js/storage'
import power from '@/components/nav/power'

export default {
  name: 'app',
  components: {
    TopMenu,
    LeftMenu,
  },
  data() {
    return {
      loaded:false,
      user:{},
      appRightLeft:0,
      appRightMax:false,
      appRightInnerScroll:false,
      appRightSetting:{
        // 内部滚动条
        innerScroll:false
      },
      message:'加载中...'
    }
  },
  created() {
    this.$bus.$on('on-router-after-each',(params)=>{
      var path = params.to.path;
      var routeName = params.to.name;
      if(routeName == 'app.frame'){
        this.appRightInnerScroll = true;
      }else{
        this.appRightInnerScroll = false;
      }
    });
  },
  watch: {
    isLogin(newValue, oldValue) {
      if (newValue) {
        this.$router.push({ 'name': 'Index' })
      } else {         
        this.$router.push({ 'name': 'Login' })
      }
    }
  },
  mounted() {
    if(window.location.href.indexOf('_max')>=0){
      this.appRightMax = true;
    }
    Vue.$app = this;
    this.load();
  },
  computed:{
    appClasses:function(){
      var cls = {}; 
      cls['app'] = true;
      cls['app-right-max'] = this.appRightMax;
      cls['app-right-no-scroll'] = this.appRightInnerScroll;
      return cls;
    },
    appRightStyle(){
      var style = {};
      if(!this.appRightMax){
        style.left = this.appRightLeft + 'px';
      }
      return style;
    }
  },
  methods: {
    load:function(){ 
      this.user.nickName = '加载中...'
      this.message = '获取登录身份...';
      this.$http.get('api/login/get', {}).then((res) => {
        if (res.data.code === 401 || res.data.data == null ) {
          this.$Message.error('没有登录，跳转登录页面 /corp/login');
        } else {
          var data = res.data.data;
          var user = {};  
          data.isSuper = data.isSuper || (data.loginName=='admin'); 
          user.userId = data.userId;
          user.nickName = data.nickName;
          user.loginName = data.loginName; 
          user.header = data.header;
          user.isSuper = data.isSuper;
          user.trueName = data.trueName;

          this.user=user;
          this.$user.userId = user.userId;
          this.$user.loginName = user.loginName;
          this.$user.trueName = user.trueName;
          this.$user.nickName = user.nickName;
          this.$user.empInfo = user.empInfo; 
          this.$user.isLogin = true;
          this.$user.isSuper = user.isSuper;
          
          this.message = '获取权限...';
          this.$http.get('/api/engine/login/getPowerKeys').then((res)=>{
            this.$user.powerKeys = res.data.data;

            this.message = '获取菜单配置...';
            this.$http.post('/api/engine/power.list').then((res)=>{
              var powers = res.data.data;
              powers.map(p=>{
                p.hasPower = this.$user.hasPower(p.powerKey);
              })
              power.rebuild(powers);

              this.message = '获取数据字典...';
              this.loaded = 1;

              //加载用户配置
              this.$user.config.load({});
             
              this.$http.post('/api/engine/login/args').then((res)=>{
                this.$args.argMap = res.data.data;
                this.loaded = 1;                
                //加载用户配置
                this.$user.config.load({});

                Vue.prototype.$routerArgs.next();

              }).catch((error) => {
                this.message = error.toString();                
              });
               
            }).catch((error) => {
              this.message = error.toString();              
            }); 
            
          }).catch((error) => {
            this.message = error.toString();            
          }); 
        }
      }).catch((error) => { 
        this.message = error.toString();
      });
    },
    leftMenuSizeChange:function(sender) {
      this.appRightLeft = sender.getWidth();
    },
    buildItems(powers,parentId,level){
      var arr = [];
      if(level >= 10){
        return arr;
      }
      powers.map((p)=>{
        if(p.parentId == parentId){
          if(p.powerType<3){
            var item = {
              id:p.powerId,
              title:p.powerCaption,
              type:p.powerType,
              level:level
            };
            item.points = this.buildPoints(powers,item.id);
            item.children = this.buildItems(powers,item.id,level+1);
            arr.push(item);
          }
        }
      });
      return arr;
    },
    beforeEach(to,from,next){ 
      if(this.loaded){
        next();
      }
    }
  }
}
</script>

<style type="text/css">
  .app-top{
    position: absolute;
    top:0px;
  }

  .app-left{
     position: fixed;
     left:0px;
     top:60px;
     bottom: 0px;
     min-width: 50px;
   }

  .app-right{
    position: fixed;
    left:0px;
    top:60px;
    right: 0px;
    bottom: 0px;
    overflow:auto;
  }

  .app-right-no-scroll .app-right-fold{
    overflow:hidden;
  }

  .app-right-max .app-left,
  .app-right-max .app-top{
    display: none;
  }
  .app-right-max .app-right{
    left: 0px;top:0px;right:0px;bottom:0px;
  }

  .app-loading-message{
    font-size: 14px;
    padding: 10px;
  }
  
</style>
