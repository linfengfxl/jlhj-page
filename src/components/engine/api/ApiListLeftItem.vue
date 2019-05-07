<template>
  <div class="api-list-tree-node"> 
    <div class="row" @click="switchFold">
      <div class="icon-fold" >
        <Icon type="arrow-right-b close " v-if="apiNode.fold"/>
        <Icon type="arrow-down-b open" v-else />
      </div>
      <div :class="{'row-content':1,'cur':apiNode.cur}">
        <div class="title">{{apiNode.title}}</div>
      </div>
    </div>
    <div class="children" v-if="!apiNode.fold">
      <ApiNode :apiNode="item" :curApi="curApi" v-for="(item,index) in apiNode.children"></ApiNode>       
      <div :class="{'row-api':1,'cur':curApi==api}" v-for="(api,index) in apiNode.apis" @click="apiNode.click(apiNode,api)">
        <div class="api">{{api.shortName}}</div>
        <div class="title">{{api.title}}</div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name:'ApiNode',
    components: {
       
    },
    props: {
      apiNode:{
        type:Object,
        default(){
          return {
            id:0,             
            title:'标题',
            parent:null,
            root:null,
            children:[],
            fold:true,
            cur:false,
            apis:[]
          }
        }
      },
      curApi:{
        type:Object,
        default:null
      }
    },
    data() {　
      return {
      }
    },
    mounted:function(){
      　
    },
    watch:{
      　
    },
    computed:{ 
      　
    },
    methods:{
      switchFold(){ 
        this.apiNode.fold = !this.apiNode.fold;
      }
    }
  }

</script>

<style type="text/css">
  .api-list-tree-node{
    padding: 0px;margin: 0px;
  } 
  .api-list-tree-node .row{
    display: flex;
    flex-wrap: nowrap;
    align-items:center;
    padding: 0px 4px;
  }
  .api-list-tree-node .icon-fold{
    display: inline-block;
    padding: 4px;
    cursor: pointer;
    color:#666;
    text-align: center;
  }
  .api-list-tree-node .icon-fold:hover{
    color:#2db7f5;
    background-color: #e8f8fd;
    border-radius: 3px;
  }
  .api-list-tree-node .icon-fold:hover .ivu-icon.close{
    color:#2db7f5;
  }
  .api-list-tree-node .icon-fold .ivu-icon{
    font-size: 18px;
    height: 18px;
    width: 18px;    
  }
  .api-list-tree-node .ivu-icon.close{
    color:#ccc;
  }  
  .api-list-tree-node .row-content{
    flex: 2;
    padding: 2px 10px;
    cursor: default;
    border: 1px solid white;
    border-radius: 3px;    
  }
  .api-list-tree-node .row-content:hover{     
    background-color: #e8f8fd;
  }
  .api-list-tree-node .row-content.cur{
    border: 1px solid #9EE6FA;    
    background-color: #e8f8fd;
  }
  .api-list-tree-node .row-content .title{
    font-size: 16px;
    color: orange;
    white-space:nowrap;
  }

  .api-list-tree-node .row-api{
    flex: 2;
    padding: 2px 10px;
    cursor: default;
    border: 1px solid white;
    border-radius: 3px;
  }
  .api-list-tree-node .row-api:hover{     
    background-color: #e8f8fd;
  }
  .api-list-tree-node .row-api.cur{
    border: 1px solid #9EE6FA;    
    background-color: #e8f8fd;
  }
  .api-list-tree-node .row-api .api{
    font-size: 16px;
    color: green;    
    white-space:nowrap;
  }
  .api-list-tree-node .row-api .title{
    font-size: 12px;
    color: #999; 
    white-space:nowrap;
  }

  .api-list-tree-node .children{     
    padding-left: 30px;
  }
</style>

