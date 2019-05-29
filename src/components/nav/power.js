var power = {}
power.defalut = {
  id:0,
  key:'key',
  title:'菜单',
  view:'',
  uri:'',
  iconfont:'navigate',
  icon:null,
};

power.defaultIconFont = 'navigate';

power.items =
[
  {id:2,key:'workflow',title:'工作流',view:'',uri:'', iconfont:'paper-airplane',parent:0},
  {id:201,key:'',title:'我的事项',view:'',uri:'/workflow/mywork',parent:2},
  {id:202,key:'',title:'我的应用',view:'',uri:'/workflow/myapp',parent:2},
  {id:203,key:'',title:'应用管理',view:'',uri:'/workflow/appmgr',parent:2},
  {id:204,key:'',title:'系统管理',view:'',uri:'/workflow/sysmgr',parent:2},
  {id:205,key:'',title:'消息通知',view:'',uri:'/notice',parent:2},
  {id:3,key:'normalsetting',title:'系统设置',view:'',uri:'',iconfont:'settings',icon:'',parent:0},
  {id:301,key:'',title:'组织架构',view:'',uri:'/contacts',iconfont:'navigate',parent:3},
  {id:302,key:'',title:'用户管理',view:'',uri:'/admin',iconfont:'navigate',parent:3},
  {id:303,key:'',title:'数据字典',view:'',uri:'/arg',iconfont:'navigate', parent:3 },
  {id:305,key:'',title:'物料编码',view:'',uri:'/material',   iconfont:'navigate',parent:3 },
  {id:304,key:'',title:'系统信息',view:'',uri:'/sysinfo',iconfont:'navigate', parent:3 },
  {id:4,key:'',title:'销售合同',view:'',uri:'',iconfont:'briefcase',icon:'',parent:0 },
  {id:401,key:'',title:'客户',view:'',uri:'/customer',iconfont:'',icon:'',parent:4},
  {id:402,key:'',title:'询价单',view:'',uri:'/inquire',iconfont:'',icon:'',parent:4},
  {id:403,key:'',title:'合同',view:'',uri:'/contract',iconfont:'',icon:'',parent:4}
];

power.navs = [];
power.build = function() {
  power.navs = [];

  this.items.map((item)=>{
    if((item.iconfont || item.icon || '') == ''){
      item.iconfont = power.defaultIconFont;
    }
    if(item.parent == 0 && item.hasPower){
      power.navs.push(item);
      item.subItems = [];
      buildSubItems(item);
    }
  })
}
function buildSubItems(nav) {
  power.items.map((item)=>{
    if(item.parent == nav.id && item.hasPower){
      nav.subItems.push(item);
      item.subItems = [];
      buildSubItems(item);
    }
  })
}

power.build();

power.rebuild = function(items){
  //{"powerId":10,"powerKey":"xtzs","powerType":1,"powerIcon":"","powerCaption":"系统设置","powerUrl":"","isShow":1,"parentId":0,"seq":1,"creator":0,"createTime":"2018-11-12 16:10:51","lastUpdate":"2018-11-12 16:10:51"}
  //{id:11,key:'',title:'车间生产',view:'',uri:'',iconfont:'nuclear',icon:'',parent:0}
  power.items = [];
  items.map((item)=>{
    if(item.isShow && item.powerType != 3){
      power.items.push({
        id:item.powerId,
        key:item.powerKey,
        title:item.powerCaption,
        view:'',
        uri:item.powerUrl,
        iconfont:item.powerIcon,
        icon:'',
        parent:item.parentId,
        hasPower:item.hasPower
      });
    }
  });
  power.build();
}

power.each = function(callback){
  each(power.navs,callback);
}

function each(items,callback){
  if(items){
    items.map((item)=>{
      if(callback(item) == false){
        return ;
      }
      each(item.subItems,callback);
    })
  }
}

export default power;
