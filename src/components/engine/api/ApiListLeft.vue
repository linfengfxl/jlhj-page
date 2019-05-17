<template>
  <div class="apilist-left">
    <table class="layout" cellpadding="0" cellspacing="0">
      <tr style="height: 10px">
        <td class="header">
          <div style="display: inline-block;flex: 2">Api 导航</div>
          <Button size="small" type="ghost" icon="arrow-right-b" @click="view=1" v-if="view==2"></Button>
          <Button size="small" type="ghost" icon="navicon" @click="view=2"  v-if="view==1"></Button>
          <Button size="small" type="ghost" icon="plus" @click="add" style="margin-left:8px;"></Button>
        </td> 
      </tr>
      <tr style="height: 10px">
        <td class="searchbar">
          <Input v-model="keyword" placeholder="关键字过滤" style="width:100%" clearable ></Input>
        </td> 
      </tr>
      <tr>
        <td style="position:relative">
          <div class="list wt-scroll">
            <ApiListLeftItem :apiNode ="tree" :curApi="curApi" v-if="view==2"></ApiListLeftItem>
            <div :class="{'list-item':1,'select':curApi == item}" v-for="(item,index) in listFilter" v-if="view==1" @click="select(item)">
               <div class="api"><span style="color:#ccc">{{index+1}}.</span> {{item.api}}</div>
               <div class="title">{{item.title}}</div>
            </div>
          </div> 
        </td>
      </tr>
    </table>
  </div> 
</template>
  
<script> 
  import Loading from '@/components/loading'; 
  import ApiListLeftItem from './ApiListLeftItem'; 

  function apiTreeNode(options) {
    var newObj = 
    Object.assign({      
      title:'package',
      package:'package',
      parent:null,
      root:null,
      children:[],
      fold:true,
      cur:false,
      apis:[]
    },options);

    Object.assign(options,newObj);

    options.each = function(call){
      call(this);
      this.children.map(sub=>{
        sub.each && sub.each(call);
      })
    }

    options.click = function(sender,api){
      options.parent && options.parent.click && options.parent.click(sender,api); 
    }

    return options;
  }

  function apiTreeRoot() {
    var root = apiTreeNode(this);

    root._unfoldStatus = {};

    root.build = function(apis){

      // 记录 fold 状态
      root.each(node=>{
        if(!node.fold){root._unfoldStatus[node.package] = true;}
      })

      // 提取包
      var packages = [];
      apis.map((api)=>{

        api.class = 'package.' + api.api.replace(/[\/\.]+/g,'.')
        .replace(/^[\.\s]+/,'').replace(/[\.\s]+$/,'');

        api.package = api.class.substring(0,api.class.lastIndexOf('.'));
        api.shortName = api.api.substring(api.api.lastIndexOf('.')+1);
        api.shortName = api.shortName.substring(api.shortName.lastIndexOf('/')+1);

        if(packages[api.package]){
          packages[api.package].push(api);
        }else{
          packages[api.package] = [api];
        }
      })

      // 构建父级包
      var parentPackages = {}
      for(name in packages){ 
        while(name.split('.').length>1){
          name = name.substring(0,name.lastIndexOf('.'));
          if(packages[name] || parentPackages[name]){
            //..
          }else{
            parentPackages[name] = [];
          }
        }
      }
      Object.assign(packages,parentPackages);

      // 排序
      var orderBy = [];
      for(name in packages){ 
        orderBy.push(name);
      }
      var newPackages = {};
      orderBy.sort().map(name=>{
        newPackages[name] = packages[name];
      }); 

      root.children = [];
      root.apis = [];      

      buildNode(root,newPackages);　

      // 还原 fold 状态
      root.each(node=>{
        if(root._unfoldStatus[node.package]){
          node.fold = false;
        }
      })

      root.fold = false;
    }

    function buildNode(node,packages){
      node.apis = packages[node.package];
      for(name in packages){
        if(name.startsWith(node.package) && name.split('.').length == node.package.split('.').length+1){
          var sub = apiTreeNode({title:name.substring(name.lastIndexOf('.')+1),package:name});
          buildNode(sub,packages);
          sub.parent = node;
          node.children.push(sub);
        }
      } 
    }
  }

  export default {
    components: {
       ApiListLeftItem
    },
    props: {
    },
    data() {
      var that = this;
      var tree = new apiTreeRoot();
      tree.click = (s,a)=>{
        this.select(a);
      }
      return {
        loading:0, 
        list:[],
        listFilter:[],
        keyword:'',
        curApi:null,
        tree:tree,
        view:2 // 1. 列表  2.树
      }
    },
    mounted:function(){ 
      this.load();
    },
    watch:{
      curApi(val){
        this.$emit('on-current-change',val);
      },
      keyword(val,old){
        if(val != old){
          this.filter();
          this.tree.build(this.listFilter);  
        } 
      }
    },
    computed:{ 
      
    },
    methods:{
      load(apiName){
        this.loading = 1;
        this.$http.post('/api/engine/api.list', {pageSize:1000}).then((res) => {
          this.loading = 0;
          if (res.data.code == 0) {
            var curIndex = this.list.indexOf(this.curApi);
            this.list = res.data.data.rows; 
            this.filter();

            this.tree.build(this.listFilter);
            if(this.curApi){
              var api = this.curApi.api;
              if(apiName){
                api = apiName;
              }
              var curApi = null;
              this.list.map(item=>{
                if(item.api == api){
                  curApi = item;
                }
              })
              if(curApi == null && this.list.length > 0){
                if(curIndex >= this.list.length){
                  curIndex = this.list.length - 1;
                }
                curApi = this.list[curIndex];
              }
              this.curApi = curApi;
            }
          } else {
            this.$Message.error(res.data.message)
          }
        }).catch((error) => { 
          this.loading = 0;
          this.$Message.error(error.message)
        });
      },
      select(item){
        this.curApi = item;
      },
      add(){
        this.curApi = {id:0};
      },
      filter(){
        var list = [];
        var keyword = '';
        if(this.keyword){
          keyword = this.keyword.replace(/\s+/g,'');
        }
        this.list.map((item)=>{
          if((item.title + item.api).toLowerCase().indexOf(keyword)>=0){
            list.push(item);
          }
        });
        this.listFilter = list;
      }
    }
  }

</script>

<style type="text/css">
  .apilist-left{
    height: 100%;
    width: 200px;
    background-color: white;
    border-right: 1px solid #eeeeee;
  }

  .apilist-left .searchbar{
    height: 42px;
    font-size: 12px;
    padding: 0 10px;    
  }

  .apilist-left .header{
    height: 42px;     
    padding: 0 10px;
    border-bottom: 1px solid #eeeeee;
    display: flex;
    align-items: center;

    font-size: 14px;
    color: #333;
  }  

  .apilist-left .header .ivu-btn{
    height: 25px;
    width: 25px;
    color:#999;
  }
   

  .apilist-left .layout{
    width: 100%;
    height: 100%;
    table-layout:fixed ;
  }

  .apilist-left .list{
    height: 100%;
    vertical-align: top;
    overflow-x: hidden;
    overflow-y: auto;
    background-color: white;
    z-index: 110;
    border-top: 1px solid #eeeeee;
  }

  .apilist-left .list:hover{
    top:0px;
    position: absolute;
    min-width: 200px;
    border-right:1px solid #eeeeee;      
  } 

  .apilist-left .list-item{
    border-bottom: 1px solid #eeeeee;
    padding: 4px;
    cursor: pointer;
  }
  .apilist-left .list-item:hover,.apilist-left .list-item.select{
    background-color:#e8f8fd;
  }
  .apilist-left .list-item .api{
    padding: 0 6px;
    height: 20px;
    line-height: 20px;
    font-size: 16px;
    color: orange;
    white-space:nowrap;
  }
  .apilist-left .list-item .title{
    padding: 0 6px;
    height: 20px;
    line-height: 20px;
    font-size: 12px;
    color: #999; 
    white-space:nowrap;
  }
</style>

