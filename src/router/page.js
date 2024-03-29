let components = [];

//1.资源库 --> 
//供应商
components.push({ component: 'provider/Index', name: '', path: '/provider' })//供应商列表，查询，新建，编辑， 
//客户
components.push({ component: 'customer/Index', name: '', path: '/customer' })
//材料
components.push({ component: 'material/Index', name: '', path: '/material' })
//资源档案
components.push({ component: 'machine/Index', name: '', path: '/machine' })
components.push({ component: 'machine/type/Index', name: '', path: '/machine/type' })
components.push({ component: 'address/Index', name: '', path: '/address' })
//物质库存 
//入库单
components.push({ component: 'storage/instock/Index', name: '', path: '/storage/instock' })
components.push({ component: 'storage/instock/InStockEdit', name: '', path: '/storage/instock/start' })
components.push({ component: 'storage/instock/Handle', name: '', path: '/storage/instock/handle' })
components.push({ component: 'storage/instock/View', name: '', path: '/storage/instock/view' }) 
components.push({ component: 'storage/instock/Sum', name: '', path: '/storage/instock/sum' }) 

//出库单
components.push({ component: 'storage/outstock/Index', name: '', path: '/storage/outstock' })
components.push({ component: 'storage/outstock/OutStockEdit', name: '', path: '/storage/outstock/start' })
components.push({ component: 'storage/outstock/Handle', name: '', path: '/storage/outstock/handle' })
components.push({ component: 'storage/outstock/View', name: '', path: '/storage/outstock/view' })
components.push({ component: 'storage/outstock/Sum', name: '', path: '/storage/outstock/sum' }) 
//采购合同
components.push({ component: 'storage/contract/Index', name: '', path: '/storage/contract' })
components.push({ component: 'storage/contract/Edit', name: '', path: '/storage/contract/edit' })

//期初库存
components.push({ component: 'storage/inventory/Index', name: '', path: '/storage/inventory' })
components.push({ component: 'storage/inventory/Edit', name: '', path: '/storage/inventory/edit' })
components.push({ component: 'storage/inventory/Handle', name: '', path: '/storage/inventory/handle' })
components.push({ component: 'storage/inventory/View', name: '', path: '/storage/inventory/view' })  

components.push({ component: 'storage/sendAndReceive/Index', name: '', path: '/storage/sendAndReceive' })

//低值耗材结算单
components.push({ component: 'storage/low/Index', name: '', path: '/storage/low' })
components.push({ component: 'storage/low/Edit', name: '', path: '/storage/low/edit' })
components.push({ component: 'storage/low/View', name: '', path: '/storage/low/view' })
//施工管理
//工程登记
components.push({ component: 'project/Index', name: '', path: '/project' })
//工程量导入
components.push({ component: 'project/workload/Index', name: '', path: '/workload' })
components.push({ component: 'project/workload/workload', name: '', path: '/workload/workload' })
//工作日报
components.push({ component: 'project/daily/Index', name: '', path: '/project/daily' })
components.push({ component: 'project/daily/Edit', name: '', path: '/project/daily/start' })
components.push({ component: 'project/daily/Handle', name: '', path: '/project/daily/handle' })
components.push({ component: 'project/daily/View', name: '', path: '/project/daily/view' })
components.push({ component: 'project/daily/List', name: '', path: '/project/daily/list' })
//工程量统计
components.push({ component: 'project/quantity/Index', name: '', path: '/project/quantity' })
//成本分析表
components.push({ component: 'project/analysis/Index', name: '', path: '/project/analysis' })
components.push({ component: 'project/analysis/Edit', name: '', path: '/project/analysis/start' })
components.push({ component: 'project/analysis/Handle', name: '', path: '/project/analysis/handle' }) 
components.push({ component: 'project/analysis/View', name: '', path: '/project/analysis/view' })
//工程结算表
components.push({ component: 'project/bill/Index', name: '', path: '/project/bill' })
components.push({ component: 'project/bill/Edit', name: '', path: '/project/bill/start' })
components.push({ component: 'project/bill/Handle', name: '', path: '/project/bill/handle' }) 
components.push({ component: 'project/bill/View', name: '', path: '/project/bill/view' })
//工程计量汇总表
components.push({ component: 'project/metering/Index', name: '', path: '/project/metering' })
components.push({ component: 'project/metering/Edit', name: '', path: '/project/metering/edit' })
//项目文件
components.push({ component: 'project/folder/Index', name: '', path: '/project/folder' })
components.push({ component: 'project/folder/Browse', name: '', path: '/project/folder/browse' })

//劳务用工
components.push({ component: 'project/labor/Index', name: '', path: '/project/labor' })
components.push({ component: 'project/labor/Edit', name: '', path: '/project/labor/edit' })

components.push({ component: 'project/labourCost', name: '', path: '/project/labourcost' })
//机械作业单
//机械作业单
components.push({ component: 'machine/order/Index', name: '', path: '/machine/order' })
components.push({ component: 'machine/order/Edit', name: '', path: '/machine/order/start' })
components.push({ component: 'machine/order/Handle', name: '', path: '/machine/order/handle' }) 
components.push({ component: 'machine/order/View', name: '', path: '/machine/order/view' })
//机械租赁结算单
components.push({ component: 'machine/bill/Index', name: '', path: '/machine/bill' })
components.push({ component: 'machine/bill/Edit', name: '', path: '/machine/bill/start' })
components.push({ component: 'machine/bill/Handle', name: '', path: '/machine/bill/handle' }) 
components.push({ component: 'machine/bill/View', name: '', path: '/machine/bill/view' }) 
//机械租赁合同
components.push({ component: 'machine/contract/Index', name: '', path: '/machine/contract' })
components.push({ component: 'machine/contract/Edit', name: '', path: '/machine/contract/edit' })
components.push({ component: 'machine/contract/View', name: '', path: '/machine/contract/view' })

// workflow
components.push({ component: 'workflow/define/Index', name: '', path: '/workflow/define' })
components.push({ component: 'workflow/mywork/Index', name: '', path: '/workflow/mywork' })
components.push({ component: 'workflow/process/Index', name: '', path: '/workflow/process' })
components.push({ component: 'workflow/process/Redirect', name: '', path: '/workflow/process/redirect' })
components.push({ component: 'workflow/mywork/Start', name: '', path: '/workflow/start' })

// financial
//报销单
components.push({ component: 'financial/expense/Index', name: '', path: '/financial/expense' })
components.push({ component: 'financial/expense/ExpenseStart', name: '', path: '/financial/expense/start' })
components.push({ component: 'financial/expense/ExpenseHandle', name: '', path: '/financial/expense/handle' })
components.push({ component: 'financial/expense/ExpenseView', name: '', path: '/financial/expense/view' })


//付款计划
components.push({ component: 'financial/payPlan/Index', name: '', path: '/financial/payplan' })
components.push({ component: 'financial/payPlan/PayPlanStart', name: '', path: '/financial/payplan/start' })
components.push({ component: 'financial/payPlan/PayPlanHandle', name: '', path: '/financial/payplan/handle' })
components.push({ component: 'financial/payPlan/PayPlanView', name: '', path: '/financial/payplan/view' })

//付款单
components.push({ component: 'financial/payOrder/Index', name: '', path: '/financial/payorder' })
components.push({ component: 'financial/payOrder/PayOrderStart', name: '', path: '/financial/payorder/start' })
components.push({ component: 'financial/payOrder/PayOrderHandle', name: '', path: '/financial/payorder/handle' })
components.push({ component: 'financial/payOrder/PayOrderView', name: '', path: '/financial/payorder/view' })

//备用金申请单
components.push({ component: 'financial/reserve/Index', name: '', path: '/financial/reserve' })
components.push({ component: 'financial/reserve/ReserveStart', name: '', path: '/financial/reserve/start' })
components.push({ component: 'financial/reserve/ReserveHandle', name: '', path: '/financial/reserve/handle' })
components.push({ component: 'financial/reserve/ReserveView', name: '', path: '/financial/reserve/view' })
 
//应付账款汇总
components.push({ component: 'financial/payTotal/Index', name: '', path: '/financial/paytotal' })

//合同登记
components.push({ component: 'financial/contract/Index', name: '', path: '/financial/contract' })
//合同收款登记
components.push({ component: 'financial/contractReceipt/Index', name: '', path: '/financial/contractReceipt' })
//发票收票登记
components.push({ component: 'financial/invoice/Index', name: '', path: '/financial/invoice' })


 


// 运输小票
components.push({ component: 'transport/order/Index', name: '', path: '/transport/order' })
components.push({ component: 'transport/order/Start', name: '', path: '/transport/order/start' })
components.push({ component: 'transport/order/Handle', name: '', path: '/transport/order/handle' })
components.push({ component: 'transport/order/View', name: '', path: '/transport/order/view' })
// 运输结算单
components.push({ component: 'transport/bill/Index', name: '', path: '/transport/bill' })
components.push({ component: 'transport/bill/Edit', name: '', path: '/transport/bill/start' })
components.push({ component: 'transport/bill/Handle', name: '', path: '/transport/bill/handle' })
components.push({ component: 'transport/bill/View', name: '', path: '/transport/bill/view' })
//运输合同
components.push({ component: 'transport/contract/Index', name: '', path: '/transport/contract' })
components.push({ component: 'transport/contract/Edit', name: '', path: '/transport/contract/edit' })
components.push({ component: 'transport/contract/View', name: '', path: '/transport/contract/view' })

// 系统日志
components.push({ component: 'logger/Index', name: '', path: '/logger' })

//分包管理
//分包需求计划
components.push({ component: 'sub/plan/Index', name: '', path: '/sub/plan' })
components.push({ component: 'sub/plan/Edit', name: '', path: '/sub/plan/edit' })
components.push({ component: 'sub/plan/View', name: '', path: '/sub/plan/view' })
//分包合同
components.push({ component: 'sub/contract/Index', name: '', path: '/sub/contract' })
components.push({ component: 'sub/contract/Edit', name: '', path: '/sub/contract/edit' })
components.push({ component: 'sub/contract/View', name: '', path: '/sub/contract/view' })
//分包完工验收单
components.push({ component: 'sub/accept/Index', name: '', path: '/sub/accept' })
components.push({ component: 'sub/accept/Edit', name: '', path: '/sub/accept/edit' })
components.push({ component: 'sub/accept/View', name: '', path: '/sub/accept/view' })
//分包结算会签单
components.push({ component: 'sub/bill/Index', name: '', path: '/sub/bill' })
components.push({ component: 'sub/bill/Edit', name: '', path: '/sub/bill/edit' })
components.push({ component: 'sub/bill/View', name: '', path: '/sub/bill/view' })
// //2.销售合同 -->
// //客户
// components.push({ component: 'customer/Index', name: '', path: '/customer' })

// //询价单
// components.push({ component: 'sales/inquire/Index', name: '', path: '/inquire' })
// components.push({ component: 'sales/inquire/InquireEdit', name: '', path: '/inquire/edit' })
// components.push({ component: 'sales/inquire/InquireView', name: '', path: '/inquire/view' })

// components.push({ component: 'sales/inquire/InquireWeight', name: '', path: '/inquire-weight' })
// components.push({ component: 'sales/inquire/InquireWeightEdit', name: '', path: '/inquire-weight/edit' })
// // 合同
// components.push({ component: 'sales/contract/Index', name: '', path: '/contract' })
// components.push({ component: 'sales/contract/ContractView', name: '', path: '/contract/view' })
// components.push({ component: 'sales/contract/ContractEdit', name: '', path: '/contract/edit' })
// //质量管理
// components.push({ component: 'quality/device/index', name: '', path: '/device' })//计量器具管理
// components.push({ component: 'quality/certificate/Index', name: '', path: '/certificate/index' })//管理记录管理
// components.push({ component: 'quality/device/QualityAdd', name: '', path: '/device/add' })
// components.push({ component: 'quality/device/AddApplication', name: '', path: '/device/addApp' })
// components.push({ component: 'quality/device/Inspection', name: '', path: '/device/Inspection' })
// components.push({ component: 'quality/device/newOutside', name: '', path: '/device/newOutside' })//检验记录管理

// //管理记录
// components.push({ component: 'quality/certificate/management', name: '', path: '/certificate/management' })//合格证管理
// components.push({ component: 'quality/certificate/examination', name: '', path: '/certificate/examination' })//合格证审核
// components.push({ component: 'quality/certificate/authorize', name: '', path: '/certificate/authorize' })//合格证审核
// components.push({ component: 'quality/certificate/print', name: '', path: '/certificate/print' })//合格证打印
// components.push({ component: 'quality/certificate/qualification/casting', name: '', path: '/certificate/qualification/cast' })//合格证打印
// components.push({ component: 'quality/certificate/construction/new', name: '', path: '/certificate/construction/new' })//合格证打印
// components.push({ component: 'quality/inspectionRecord/Index', name: '', path: '/inspectionRecord' })//合格证打印
// components.push({ component: 'quality/inspectionRecord/supply/Index', name: '', path: '/inspectionRecord/supply' })//合格证打印
// components.push({ component: 'quality/inspectionRecord/supply/Standard', name: '', path: '/inspectionRecord/Standard' })//合格证打印
// components.push({ component: 'quality/inspectionRecord/unqualified/Index', name: '', path: '/inspectionRecord/unqualified' })//合格证打印
// components.push({ component: 'quality/inspectionRecord/unqualified/correct', name: '', path: '/inspectionRecord/correct' })//合格证打印
// components.push({ component: 'quality/inspectionRecord/unqualified/concession', name: '', path: '/inspectionRecord/concession' })//合格证打印
// components.push({ component: 'quality/inspectionRecord/unqualified/d_report', name: '', path: '/inspectionRecord/d_report' })//合格证打印
// components.push({ component: 'quality/inspectionRecord/unqualified/requisition', name: '', path: '/inspectionRecord/requisition' })//合格证打印

// //销售发货单
// components.push({ component: 'sales/shipping/Index', name: '', path: '/shipping' })
// components.push({ component: 'sales/shipping/ShippingView', name: '', path: '/shipping/view' })
// components.push({ component: 'sales/shipping/ShippingEdit', name: '', path: '/shipping/edit' })

// //3.采购 ---> 

// //新材料试用
// components.push({ component: 'purchase/provider-newmaterial/Index', name: '', path: '/provider-newmaterial' })//新材料管理（列表，查询，新建，编辑）
// components.push({ component: 'purchase/provider-newmaterial/ProviderNewMatEdit', name: '', path: '/provider-newmaterial/edit' })//新材料的新建编辑页面（复杂页面）
// components.push({ component: 'purchase/provider-newmaterial/ProviderNewMatView', name: '', path: '/provider-newmaterial/view' })//新材料的详情页面

// //新材料试用记录
// components.push({ component: 'craft-newmaterial/Index', name: '', path: '/craft-newmaterial' })//新材料试用记录（工艺人员)
// components.push({ component: 'craft-newmaterial/CraftnewmaterialView', name: '', path: '/craft-newmaterial/view' })//新材料试用记录（工艺人员)--增加附件上传
// components.push({ component: 'craft-newmaterial/CraftnewmaterialDetail', name: '', path: '/craft-newmaterial/detail' })//新材料试用记录（工艺人员)--详情(暂时没用)

// //采购订单
// components.push({ component: 'purchase/purchase-order/Index', name: '', path: '/purchase-order' })
// components.push({ component: 'purchase/purchase-order/OrderEdit', name: '', path: '/purchase-order/edit' })
// components.push({ component: 'purchase/purchase-order/OrderView', name: '', path: '/purchase-order/view' })

// //采购订单维护
// components.push({ component: 'purchase/purchase-order-mgr/Index', name: '', path: '/purchase-order-mgr' })//采购订单维护列表
// components.push({ component: 'purchase/purchase-order-mgr/OrderManagerEdit', name: '', path: '/purchase-order-mgr/edit' })//采购订单---新建/创建入库单
// components.push({ component: 'purchase/purchase-order-mgr/OrderManagerView', name: '', path: '/purchase-order-mgr/view' })//采购订单---
// components.push({ component: 'purchase/purchase-order-mgr/OrderManagerInspectionEdit', name: '', path: '/purchase-order-mgr/editInspection' }) //采购订单---新建/创建报检单

// //询价结果登记
// components.push({ component: 'purchase/provider-inquire/Index', name: '', path: '/provider-inquire' })//询价结果登记

// //入库驳回记录
// components.push({ component: 'purchase/purchase-instockreject/Index', name: '', path: '/purchase-instockreject' })//入库驳回记录

// //报检驳回记录
// components.push({ component: 'purchase/purchase-inspectionreject/Index', name: '', path: '/purchase-inspectionreject' })//报检驳回记录

// //调价申请管理
// components.push({ component: 'purchase/provider-adjustprice/Index', name: '', path: '/provider-adjustprice' })//调价申请管理
// components.push({ component: 'purchase/provider-adjustprice/ProviderAdjustPriceEdit', name: '', path: '/provider-adjustprice/edit' })//调价申请管理

// //付款申请管理
// components.push({ component: 'purchase/provider-payapply/Index', name: '', path: '/provider-payapply' })
// components.push({ component: 'purchase/provider-payapply/ProviderPayApplyEdit', name: '', path: '/provider-payapply/edit' })
// components.push({ component: 'purchase/provider-payapply/ProviderPayApplyView', name: '', path: '/provider-payapply/view' })


// //4.仓库  --->
// components.push({ component: 'storage/StorageMgr', name: '', path: '/storage/mgr' });
// components.push({ component: 'storage/instock/Index', name: '', path: '/storage/instock'})
// components.push({ component: 'storage/instock/InStockEdit', name: '', path: '/storage/instock/edit' })
// components.push({ component: 'storage/instock/WeightInStockEdit', name: '', path: '/storage/weightinstock/edit'})
// components.push({ component: 'storage/audit/Index', name: '', path: '/storage/audit' })
// components.push({ component: 'storage/outstock/Index', name: '', path: '/storage/outstock'})
// components.push({ component: 'storage/outstock/OutStockEdit', name: '', path: '/storage/outstock/edit' })
// components.push({ component: 'storage/movestock/Index', name: '', path: '/storage/movestock'})
// components.push({ component: 'storage/movestock/MoveStockEdit', name: '', path: '/storage/movestock/edit' })
// components.push({ component: 'storage/checkstock/Index', name: '', path: '/storage/checkstock'})
// components.push({ component: 'storage/checkstock/Input', name: '', path: '/storage/checkstock/input'})
// components.push({ component: 'storage/checkstock/Audit', name: '', path: '/storage/checkstock/audit'})

// components.push({ component: 'storage/query/Index', name: '', path: '/storage/query'})
// components.push({ component: 'storage/query/Stock', name: '', path: '/storage/query/stock'})

// //基础设置
// components.push({ component: 'storage/baseset/Index', name: '', path: '/storage/baseset' })
// components.push({ component: 'storage/baseset/Storage', name: '', path: '/storage/storage' })//仓库信息维护列表(列表，新建，查询，编辑，删除)
// components.push({ component: 'storage/baseset/StockOperType', name: '', path: '/storage/stock/opertype' })//库存操作类(列表，新建，查询，编辑，删除，详情)
// components.push({ component: 'storage/baseset/StorageAuth', name: '', path: '/storage/storage/auth' })//仓库操作权限
// components.push({ component: 'storage/baseset/StorageInit', name: '', path: '/storage/storage/init' })
// components.push({ component: 'storage/baseset/StorageReverseInit', name: '', path: '/storage/storage/reinit' })//仓库反初始化
// components.push({ component: 'storage/baseset/StorageSafe', name: '', path: '/storage/storage/safe' })//安全库存
// components.push({ component: 'storage/baseset/StoragePlace', name: '', path: '/storage/storage/place' })

// components.push({ component: 'storage/temphumi/Index', name: '', path: '/storage/temphumi' })


// //产成品库管理
// components.push({ component: 'productstock/StockMgr', name: '', path: '/productstock/mgr' })
// components.push({ component: 'productstock/stockin/Index', name: '', path: '/productstock/stockin'})
// components.push({ component: 'productstock/checkstock/Index', name: '', path: '/productstock/checkstock'})
// components.push({ component: 'productstock/checkstock/Input', name: '', path: '/productstock/checkstock/input'})
// components.push({ component: 'productstock/checkstock/Audit', name: '', path: '/productstock/checkstock/audit'})
// components.push({ component: 'productstock/stockout/Index', name: '', path: '/productstock/stockout'})
// components.push({ component: 'productstock/stockout/StockOutEdit', name: '', path: '/productstock/stockout/edit'})

// components.push({ component: 'productstock/query/Stock', name: '', path: '/productstock/query/stock'})

// //5.工艺 --->
// //项目档案
// components.push({ component: 'projectfile/WaitTransfer', name: '', path: '/projectfile/waittransfer' })//待转合同
// components.push({ component: 'projectfile/Project', name: '', path: '/projectfile' })//项目档案
// components.push({ component: 'projectfile/ProjectEdit', name: '', path: '/projectfile/edit' })//合同转档编辑更新


// //8.售后 --->
//  components.push({ component: 'aftersales/complaint/Index', name: '', path: '/complaint' })
//  components.push({ component: 'aftersales/complaint/ComplaintEdit', name: '', path: '/complaint/edit' })
//  components.push({ component: 'aftersales/complaint/ComplaintView', name: '', path: '/complaint/view' })
//  components.push({ component: 'aftersales/disposition/Index', name: '', path: '/disposition' })
//  components.push({ component: 'aftersales/disposition/DispositionEdit', name: '', path: '/disposition/edit' })
//  components.push({ component: 'aftersales/disposition/DispositionView', name: '', path: '/disposition/view' })

// //7.外委加工
// //外委加工
// components.push({ component: 'outprovider/Index', name: '', path: '/outprovider' })//外委厂商
// //外委加工合同
// components.push({ component: 'outcontract/Index', name: '', path: '/outcontract' })//外委加工合同
// components.push({ component: 'outcontract/OutContractEdit', name: '', path: '/outcontract/edit' })//外围合同加工编辑新建
// components.push({ component: 'outcontract/OutContractView', name: '', path: '/outcontract/view' })//外围合同加工查看

// //9.车间生产管理
// //领料单
// components.push({ component: 'production/outstock/Index', name: '', path: '/outstockapply' })//领料单首页
// components.push({ component: 'production/outstock/OutStockEdit', name: '', path: '/outstockapply/edit' })//新建领料单
// //装箱单
// components.push({ component: 'pack/Index', name: '', path: '/pack' })//装箱单
// components.push({ component: 'pack/PackEdit', name: '', path: '/pack/edit' })//装箱单
// components.push({ component: 'pack/IndexAudit', name: '', path: '/pack/audit' })//装箱单
// //自用件制作申请
// components.push({ component: 'selfmater/selfmaterApply/Index', name: '', path: '/selfmater' })//自用件制作申请首页
// components.push({ component: 'selfmater/selfmaterApply/SelfMaterMakeEdit', name: '', path: '/selfmater/edit' })//新建或编辑自用件制作申请
// //自用件报废申请
// components.push({ component: 'selfmater/selfmaterScrap/Index', name: '', path: '/selfmater/scrap' })//自用件管理
// components.push({ component: 'selfmater/selfmaterScrap/SelfMaterSmNoEdit', name: '', path: '/selfmater/smno/edit' })//编号维护
// components.push({ component: 'selfmater/selfmaterScrap/SelfMaterScrapEdit', name: '', path: '/selfmater/scrap/edit' })//新建或编辑自用件报废申请
// components.push({ component: 'selfmater/selfmaterScrap/RegisterDetailEditable', name: '', path: '/selfmater/register/edit' })//领用登记
// //自用件台账
// components.push({ component: 'selfmater/selfmaterRecord/Index', name: '', path: '/selfmaterRecord' })//自用件台账

// //模型外协合同
// components.push({ component: 'model/contract/Index', name: '', path: '/model/contract' })//模型外协合同首页
// components.push({ component: 'model/contract/ContractEdit', name: '', path: '/model/contract/edit' })//模型外协合同新建
// components.push({ component: 'model/contract/ContractView', name: '', path: '/model/contract/view' })//模型外协合同查看
// //模型验收
// components.push({ component: 'model/check/Index', name: '', path: '/model/check' })//模型验收首页
// components.push({ component: 'model/check/CheckEdit', name: '', path: '/model/check/edit' })//模型验收新建

// components.push({ component: 'model/check/InStockEdit', name: '', path: '/model/instock/edit' })//新建模型入库单
// //模型管理
// components.push({ component: 'model/manager/Index', name: '', path: '/model/manager' })//模型管理首页
// components.push({ component: 'model/manager/ModelOutstock', name: '', path: '/model/manager/outstock' })
// components.push({ component: 'model/manager/ModelInstock', name: '', path: '/model/manager/instock' })
// components.push({ component: 'model/manager/ModelRecord', name: '', path: '/model/manager/view' })

// //模型检查管理
// components.push({ component: 'model/checkApply/Index', name: '', path: '/model/checkApply' })//模型检查管理
// components.push({ component: 'model/checkApply/Edit', name: '', path: '/model/checkApply/edit' })//模型检查申请
// components.push({ component: 'model/checkApply/ModelCheckResult', name: '', path: '/model/checkApply/checkResult' })//模型检查结果
// components.push({ component: 'model/checkApply/ModelRepairResult', name: '', path: '/model/checkApply/repairResult' })//模型维修结果
// //模型出厂申请
// components.push({ component: 'model/leave/ModelLeaveApply', name: '', path: '/model/leaveApply' })//模型出厂申请
// //模型报废申请
// components.push({ component: 'model/scrap/ModelScrapApply', name: '', path: '/model/scrapApply' })//模型报废申请


export default components;