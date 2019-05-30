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
  {module:'1',title:'费用报销单',startUrl:'/financial/expense/start',handleUrl:'/financial/expense/handle',viewUrl:'/financial/expense/view',defineIds:[1]},
  {module:'1',title:'备用金申请',startUrl:'',handleUrl:'',viewUrl:'',defineIds:[]},
  {module:'1',title:'付款计划',startUrl:'/financial/payplan/start',handleUrl:'/financial/payplan/handle',viewUrl:'/financial/payplan/view',defineIds:[4]},
  {module:'1',title:'付款单',startUrl:'/financial/payorder/start',handleUrl:'/financial/payorder/handle',viewUrl:'/financial/payorder/view',defineIds:[7,8]},
  {module:'1',title:'机械租赁结算单',startUrl:'/machine/bill/start',handleUrl:'/machine/bill/handle',viewUrl:'/machine/bill/view',defineIds:[5]},   
  {module:'2',title:'材料入库单',startUrl:'/storage/instock/start',handleUrl:'/storage/instock/handle',viewUrl:'/storage/instock/view',defineIds:[2]},
  {module:'2',title:'材料出库单',startUrl:'/storage/outstock/start',handleUrl:'/storage/outstock/handle',viewUrl:'/storage/outstock/view',defineIds:[3]},
  {module:'3',title:'运输结算单',startUrl:'/transport/bill/handle',handleUrl:'/transport/bill/handle',viewUrl:'/transport/bill/view',defineIds:[6]},  
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