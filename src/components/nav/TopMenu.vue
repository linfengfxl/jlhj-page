<template>
  <div class="topbar">
    <LayoutHor>
      <div class="topbar-logo" slot="left">
        <img src="@/assets/img/logo.png" class="logo"/>
        <span class="logo-title"></span>
      </div>
      <div class="topbar-center"> 
        <div class="topbar-menu">
          <div class="topbar-menu-item" @click="open(item)"
            v-for="(item, index) in menus">
            {{item.title}}
          </div>
        </div>
      </div>
      <table slot="right" style="height: 100%;" cellspacing="0" cellpadding="0">
        <tr>
          <td v-if="false">
            <div class="topbar-menu topbar-down-pop" target="#topbar-down-msgbox">
              <div class="topbar-menu-item">
                <Badge :count="msgUnRead">
                    <Icon type="ios-bell-outline" size="26"></Icon>
                </Badge>
                &nbsp;消息
              </div>
            </div>
          </td>
          <td>
            <table class="topbar-userbox  topbar-down-pop" target="#topbar-down-userbox"  cellspacing="0" cellpadding="0">
              <tr>
                <td>
                  <div style="width:10px;"></div>
                </td>
                <td>
                  <img class="topbar-userbox-logo" :src="userHeader"/></td>
                <td>
                  <div class="topbar-userbox-name">{{userName}}</div>
                </td>
                <td>
                  <div style="width:10px;"></div>
                </td>
              </tr>
            </table>
          </td>
        </tr>  
      </table> 
    </LayoutHor>
    <div class="topbar-down hiden" id="topbar-down-msgbox">
      <div class="msglist">
        <a v-for="item in msgList" @click="msgClick(item)" :title="item.content">{{item.content}}</a> 
      </div> 
      <table class="topbar-down-layout" cellspacing="0" cellpadding="0">  
        <tr>
          <td>
            <div class="topbar-down-splitline"></div>
          </td>
        </tr> 
        <tr>
          <td>
            <Button @click="msgMore" class="topbar-down-btnmenu" type="text">查看更多</Button>
          </td>
        </tr>
        <tr>
          <td>
            <Button @click="msgIgnore" class="topbar-down-btnmenu" type="text">全部忽略</Button>
          </td>
        </tr>
      </table>
    </div>
    <div class="topbar-down hiden" id="topbar-down-userbox">
      <table class="topbar-down-layout" cellspacing="0" cellpadding="0">
        <tr>
          <td class="center"><img class="topbar-down-logo" :src="userHeader"/></td>
        </tr>
        <tr>
          <td class="center"><span>{{userName}}</span></td>
        </tr>
        <tr>
          <td>
            <div class="topbar-down-splitline"></div>
          </td>
        </tr> 
        <tr>
          <td>
            <Button @click="loginInfoChg" class="topbar-down-btnmenu" type="text" icon="locked">我的账号</Button>
          </td>
        </tr>
        <tr>
          <td>
            <Button @click="logout" class="topbar-down-btnmenu" type="text" icon="android-exit">退出</Button>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>
<script>
  import LayoutHor from '@/components/layout/LayoutHor';

  export default {
    components: {
      LayoutHor
    },
    data() {
      return {
        menus: [],
        msgList:[],
        msgUnRead:0,
        lastId:null
      }
    },
    props: {
      user: {
        type: [Object],
        default: {
          loginName: '',
          trueName: '',
          header: ''
        }
      }
    },
    methods: { 
      open: function (item) { 
        if (name == 'web') {
          window.open("http://www.lyarc.com");
        }
        if (item && item.view) {
          this.$router.push({name: item.view})
        }
      },
      logout: function () {
        window.location.href = "/corp/logout";
      },
      chgpwd: function () {
        this.$router.push({name: 'frm.chgpwd'});
      }, 
      loginInfoChg: function () {
        this.$router.push({name: 'frm.loginInfoChg'});
      },
      msgMore(){
        this.$router.push('/frame/message');
      },
      msgIgnore(){
        this.$http.post('/api/engine/message/mine/readall',{}).then((res)=>{
          this.msgList = [];
          this.msgUnRead = 0;
        }) 
      },
      msgClick(item){
        this.$http.post('/api/engine/message/mine/read',{ids:[item.id]}).then((res)=>{
          this.msgList.splice(this.msgList.indexOf(item),1); 
          this.msgUnRead = this.msgUnRead - 1;
          if(this.msgUnRead<0){
            this.msgUnRead = 0;
          }
        })   
      },
      msgLoad(){
        clearTimeout(this.msgLoadHandle);
        this.$http.post('/api/engine/message/mine/load',{lastId:this.lastId}).then((res)=>{
          if(res.data.code == 0){
            var data = res.data.data;
            this.msgList = data.top10;
            this.msgUnRead = data.unRead;
            this.lastId = data.lastId;

            data.news.map((item)=>{
              this.$Notice.open({ 
                  title:'消息',
                  desc: item.content
              });
            });
          }
          this.msgLoadHandle = setTimeout(this.msgLoad,1000*10);
        }) 
      }
    },
    mounted: function () {
      this.menus = [];
      /*
      if (window.location.href.indexOf('localhost') >= 0) {
        this.menus.push({name: 'demo', title: 'Demo', view: 'demo'});
      }*/

      this.menus.push({name: 'index', title: '首页', view: 'index'});
      
      var topbarDown = {};
      topbarDown.showHandle = null;
      topbarDown.hidenHandle = null; 
      topbarDown.init = function () {
        $('.topbar-down-pop').hover(function () {
          clearTimeout(topbarDown.showHandle);
          clearTimeout(topbarDown.hidenHandle); 
          var target = $(this).attr('target'); 
          $('.topbar-down').not(target).toggleClass('hiden', true);          
          topbarDown.showHandle = setTimeout(()=>{ 
            $(target).toggleClass('hiden', false);
          }, 400);
        }, function () {
          clearTimeout(topbarDown.hidenHandle);
          clearTimeout(topbarDown.showHandle); 
          var target = $(this).attr('target'); 
          $('.topbar-down').not(target).toggleClass('hiden', true);
          topbarDown.hidenHandle = setTimeout(()=>{
            $('.topbar-down').toggleClass('hiden', true);
          }, 400);
        });

        $('.topbar-down').hover(()=>{
          clearTimeout(topbarDown.hidenHandle);
          clearTimeout(topbarDown.showHandle);
        },()=>{
          clearTimeout(topbarDown.hidenHandle);
          clearTimeout(topbarDown.showHandle);
          topbarDown.hidenHandle = setTimeout(()=>{
            $('.topbar-down').toggleClass('hiden', true);
          }, 400);
        });
      }

      topbarDown.init(); 

      /*
      var backTask = {};
      backTask.loadMsgHandle;
      backTask.interVal = setInterval(()=>{

      },1000);*/
      this.msgLoad();
    },
    computed: {
      userHeader: function () {
        return this.user.header || require('@/assets/img/icon_corp.png');
      },
      userName: function () { 
        if (this.user.isSuper) {
          return this.user.trueName + ' [超管]';
        } else {
          return this.user.trueName ;//+ ' - ' +this.user.loginName;
        }
      }
    }, 
  }
</script>

<style>
  .topbar {
    height: 60px;
    width: 100%;
    position: relative;     
    background-color: #2b579a;
    color: white;
  }
 
  .topbar-center {
    float: right;
    overflow: hidden;
    height: 100%;
    padding-right: 20px;
  }

  .topbar:after {
    content: '';
    display: block;
    width: 100%;
    height: 2px;
    /*background: #c5261d;*/
    position: absolute;
    bottom: 0;
    left: 0;
  }

  .topbar .topbar-logo {
    font-size: 14px;
    padding-left: 15px;
    width: 380px;
  }
  .topbar .topbar-logo .logo{
    position: absolute;
  }
  .topbar .topbar-logo .logo-title{
    font-size: 24px; 
    padding-left: 55px; 
  }

  .topbar .layout-hor-left {
    vertical-align: middle;
  }

  .topbar .layout-hor-right {
    vertical-align: middle;
    white-space: nowrap;
  }

  .topbar .ivu-menu-horizontal.ivu-menu-light:after {
    display: none;
  }

  .topbar-userbox {
    font-size: 14px;
    cursor: default;
    height: 100%;
  }

  .topbar-userbox td {
    padding: 4px;
  }

  .topbar-userbox:hover {
    color:white; 
    background-color: #274D86;
  }

  .topbar-userbox-logo {
    width: 24px;
    height: 24px;
    background-color: white;
    border-radius: 12px;
    padding: 0px;
    margin: 0px;
    margin-top: 4px;
    border:1px solid #6C96D5; 
  }

  .topbar-userbox-name {
    max-width: 120px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .topbar-down {
    border-radius: 0px;
    position: fixed;
    right: 0px;
    top: 59px;
    width: 200px;
    background-color: white;
    border: 1px solid #dedede;     
    font-size: 14px;
    padding: 4px;
    box-shadow: 0 1px 6px rgba(0, 0, 0, .2);
    z-index: 1000;
  }

  .topbar-down.hiden ,.topbar-menu-down.hiden{
    display: none;
  }

  .topbar-down-layout {
    width: 100%;
  }

  .topbar-down-layout td {
    text-align: left;
  }

  .topbar-down-layout .center {
    text-align: center;
  }

  .topbar-down-logo {
    width: 48px;
    height: 48px;
    border-radius: 24px;
    background-color: white; 
  }

  .topbar-down-btnmenu.ivu-btn {
    width: 100%;
    font-size: 14px;
    text-align: left;
  }

  .topbar-down-btnmenu.ivu-btn:hover {
    background-color: #eee;
  }

  .topbar-down-splitline {
    border-bottom: 1px dashed #ccc;
    margin: 4px 0px;
  }

  .topbar-menu-down {
    border-radius: 0px;
    position: fixed;
    right: 100px;
    top: 59px;
    width: 200px;
    background-color: white;
    border: 1px solid #dedede; 
    font-size: 14px;
    padding: 4px;
    box-shadow: 0 1px 6px rgba(0, 0, 0, .2);
    z-index: 1000;
  }
  /*nav*/
  .topbar-menu{
    height: 100%;
    font-size: 14px; 
    text-align: right;
  }
  .topbar-menu-item{
    height: 60px;
    line-height: 60px;
    padding: 0px 20px;  
    cursor: pointer;
    display: inline-block;
  }
  .topbar-menu-item:hover{
    color:white; 
    background-color: #274D86;
  }

  #topbar-down-msgbox{
    width: 300px;
    right:60px;
  }
  #topbar-down-msgbox .msglist{
    padding: 4px 10px;
  }
  #topbar-down-msgbox .msglist a{
    display: block;
    padding: 4px 0px;
    color:#666;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  #topbar-down-msgbox .msglist a:hover{
    color:#4dcdf1;   
  }
  
</style>

