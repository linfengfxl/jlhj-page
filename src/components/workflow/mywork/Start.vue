<template>
  <div class="page wfstart">
    <div class="page-title">发起审批</div>
    <div class="wfstart-box">
      <div class="wfstart-box-item" v-for="item in list" @click="goPage(item)">
        <Icon type="paper-airplane icon"></Icon>
        {{item.title}}
      </div>
      <div style="clear: both;"></div>
    </div>
  </div>
</template>
<script>

  export default {
    components: { 
    },
    data() {       
      return {
        list:[
          {title:'费用报销单审批流程',url:"/financial/expense/start?forward"},
          {title:'运输小票审核流程',url:""},
          {title:'月物资需求计划审批流程',url:""},
          {title:'月机械租赁计划审批流程',url:""},
          {title:'物资采购合同审核流程',url:""},
          {title:'机械作业单审核流程',url:""},
          {title:'机械租赁合同审核流程',url:""},
          {title:'机械租赁付款审批流程',url:""},
          {title:'分包结算单审核流程',url:""},
          {title:'分包合同审批流程',url:""},
          {title:'费用报销审批流程',url:""},
          {title:'材料入库单审核流程',url:"/storage/instock/edit?forward"},
          {title:'材料出库单审核流程',url:""},
          {title:'材料采购付款审批流程',url:""},
          {title:'备用金申请流程',url:""},
          {title:'付款计划审批流程',url:"/financial/payplan/start?forward"},
          {title:'付款单审批流程',url:"/financial/payorder/start?forward"},
        ]
      }
    },
    mounted: function () {
       
    },
    computed: {},
    methods: {
      goPage(item){
        this.$router.push({ path: item.url });
      }
    }
  }

</script>

<style type="text/css">
  .wfstart-box{
    padding: 10px;    
    max-width: 920px;
    margin:0 auto;
    margin-top: 40px;
  }
  .wfstart-box-item{
    width: 280px;
    height: 60px;    
    line-height: 60px;
    border:1px solid #eee;   
    border-radius: 3px;
    float: left;
    margin: 10px;
    padding: 0px 10px;
    font-size: 18px;
    cursor: pointer;
    padding-left: 60px;
    position: relative;
  }

  .wfstart-box-item:hover{
    background-color: #e8f8fd;
    border-color: #7BA7EA;
    color:#2B579A;        
  }

  .wfstart-box-item:hover .icon{
    color:#2B579A;        
  }

  .wfstart-box-item .icon{
    font-size: 36px;
    position: absolute;
    left: 10px;
    top:10px;
    color:#aaa;    
  }
</style>
