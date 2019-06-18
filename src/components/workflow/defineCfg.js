// 流程定义，通用方法
var cfg = {};

cfg.formModules = [
  {id:'1',title:'财务'},
  {id:'2',title:'仓库'},
  {id:'3',title:'运输'},
  {id:'9',title:'其它'},
]

// 表单
cfg.forms = [
  {module:'1',key:'fybxd',title:'费用报销单',startUrl:'/financial/expense/start',handleUrl:'/financial/expense/handle',viewUrl:'/financial/expense/view',printUrl:'bill/bx/',defineIds:[1,10]},
  {module:'1',key:'fkjh',title:'付款计划',startUrl:'/financial/payplan/start',handleUrl:'/financial/payplan/handle',viewUrl:'/financial/payplan/view',printUrl:'bill/fkjh/',defineIds:[4]},
  {module:'1',key:'fkd',title:'付款单',startUrl:'/financial/payorder/start',handleUrl:'/financial/payorder/handle',viewUrl:'/financial/payorder/view',printUrl:'bill/fk/',defineIds:[7,8]},
  {module:'1',key:'byjsqd',title:'备用金申请单',startUrl:'/financial/reserve/start',handleUrl:'/financial/reserve/handle',viewUrl:'/financial/reserve/view',printUrl:'bill/byj/',defineIds:[9]},

  {module:'1',key:'jxzyd',title:'机械作业单',startUrl:'/machine/order/start',handleUrl:'/machine/order/handle',viewUrl:'/machine/order/view',defineIds:[12]},  
  {module:'1',key:'jxzljsd',title:'机械租赁结算单',startUrl:'/machine/bill/start',handleUrl:'/machine/bill/handle',viewUrl:'/machine/bill/view',defineIds:[5]},   
  
  {module:'2',key:'clrkd',title:'材料入库单',startUrl:'/storage/instock/start',handleUrl:'/storage/instock/handle',viewUrl:'/storage/instock/view',defineIds:[2,14]},
  {module:'2',key:'clckd',title:'材料出库单',startUrl:'/storage/outstock/start',handleUrl:'/storage/outstock/handle',viewUrl:'/storage/outstock/view',defineIds:[3]},
  {module:'3',key:'ysxp',title:'运输小票',startUrl:'/transport/order/start',handleUrl:'/transport/order/handle',viewUrl:'/transport/order/view',defineIds:[13]}, 
  {module:'3',key:'ysjsd',title:'运输结算单',startUrl:'/transport/bill/start',handleUrl:'/transport/bill/handle',viewUrl:'/transport/bill/view',defineIds:[6]}, 

  {module:'9',key:'sgrb',title:'施工日报',startUrl:'/project/daily',handleUrl:'/project/daily/handle',viewUrl:'/project/daily/view',defineIds:[11]}, 
  //{title:'标题',startUrl:'',handleUrl:'',viewUrl:'',defineIds:[]},
]


cfg.formModules.map(item=>{
  item.forms = [];
  cfg.forms.map(form=>{
    if(form.module == item.id){
      item.forms.push(form)
    }
  })
});

cfg.getFormByDefine = function (defId) {
  var form = null;
  cfg.forms.map(item=>{
    if(item.defineIds.indexOf(defId * 1)>=0){
      form = item;
    }
  });
  return form;
}


export default cfg;