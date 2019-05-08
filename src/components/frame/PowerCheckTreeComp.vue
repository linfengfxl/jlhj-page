<template>
  <div class="typowercheck">
    <Loading :title="msg" :loading="loading">       
        <table class="typowercheck-table">
          <tr v-for="(item,index) in items" v-if="item.visible">
            <td :class="'typowercheck-table-lev typowercheck-table-lev'+item.level">
              <div class="typowercheck-table-fold">
                <div v-if="item.children.length>0">
                  <Icon type="plus-round" @click.native="item.doOpen" style="cursor: pointer;" title="展开" v-if="item.open==0"></Icon>
                  <Icon type="minus-round" @click.native="item.doClose" style="cursor: pointer;" title="折叠" v-else></Icon> 
                </div> 
              </div>                
              <div class="typowercheck-check" @click="item.check==1?item.doUnCheck() + userChange():item.doCheck() + userChange()">
                <Icon type="android-checkbox-outline-blank" class="icon-uncheck" v-if="item.check==0"></Icon>
                <Icon type="android-checkbox" v-if="item.check==1"></Icon>
                <Icon type="android-radio-button-on" v-if="item.check==2"></Icon>                
              </div> 
              <span @click="item.children.length>0 && (item.open==0?item.doOpen():item.doClose())" style="cursor:default">{{item.title}}</span>
            </td>
            <td class="typowercheck-table-points">
              <div class="typowercheck-check" @click="sub.check==1?sub.doUnCheck() + userChange():sub.doCheck() + userChange()" v-for="(sub,index) in item.points" >
                <Icon type="android-checkbox-outline-blank" class="icon-uncheck" v-if="sub.check==0"></Icon>
                <Icon type="android-checkbox" v-if="sub.check==1" ></Icon>
                <Icon type="android-radio-button-on" v-if="sub.check==2"></Icon>
                <span>{{sub.title}}</span>
              </div>
            </td>
          </tr>
        </table>
    </Loading>
  </div>
</template>
<script>
  import Loading from '@/components/loading';

  function powerNode(options){
    Object.assign(this,{
            id:'',
            title:'',
            parent:null,
            level:0,
            open:false,
            check:0,
            select:0,
            visible:0,
            children:[],
            points:[]
        },options);
  } 

  powerNode.prototype.eachChildren = function(call){
    this.children.map(item=>{
      call(item);
      item.eachChildren(call);
    });
  } 

  powerNode.prototype.eachChildrenPoint = function(call){
    this.points.map(item=>{
      call(item);
    });
    this.children.map(item=>{
      call(item);
      item.eachChildrenPoint(call);
    });
  }

  // 遍历叶子结点
  powerNode.prototype.eachLeafChildrenPoint = function(call){
    this.eachChildrenPoint(item=>{
      if(item.children.length == 0 && item.points.length == 0){
        call(item);
      }
    })
  }

  powerNode.prototype.existChildrenPoint = function(call){
    this.points.map(item=>{
      if(call(item) == true){
        return true;
      }
    });
    this.children.map(item=>{
      if(call(item) == true || item.eachChildrenPoint(call) == true){
        return true;
      } 
    });
    return false;
  }

  powerNode.prototype.eachParent = function(call){    
    if(this.parent){
      call(this.parent);
      this.parent.eachParent(call);
    }
  }

  powerNode.prototype.doOpen = function(){
    this.open = 1;
    this.visible = this.parent == null || this.parent.visible;
    this.eachChildren(item=>{
      item.visible = item.parent.visible && item.parent.open;
    });
  }

  powerNode.prototype.doClose = function(){
    this.open = 0;
    this.visible = this.parent == null || this.parent.visible;
    this.eachChildren(item=>{
      item.visible = item.parent.visible && item.parent.open;
    });
  }

  powerNode.prototype.doCheck = function(){
    this.check = 1;
    this.eachChildrenPoint(item=>{
      item.check = 1;
    });

    this.eachParent(item=>{
      item._compouteCheck();
    });
  }

  powerNode.prototype.doUnCheck = function(){
    this.check = 0;
    this.eachChildrenPoint(item=>{
      item.check = 0;
    });

    this.eachParent(item=>{
      item._compouteCheck();
    });
  }


  powerNode.prototype._compouteCheck = function(){ 
    var check = {
      all:0,
      c_0:0,
      c_1:0,
      c_2:0,
    }; 

    this.points.map(item=>{
      check.all ++;
      check['c_' + item.check] ++;
    })

    this.children.map(item=>{
      check.all ++;
      check['c_' + item.check] ++;
    })

    if(check.all > 0){
      if(check.all == check.c_0){
        this.check = 0;
      }else if(check.all == check.c_1){
        this.check = 1;
      }else{
        this.check = 2;
      }
    }
  }




  export default {
    components: {
      Loading
    },
    data() {
      return {
        loading:0,
        msg:'',
        checked:[],
        items:[], 
        root:new powerNode({id:0,title:'root',visible:1,open:1}), 
      }
    },
    computed: {
    },
    watch:{
      checked(val,old){
        this.resetCheck();
      }
    },
    methods: {
      load() {
        this.loading = 1;
        this.$http.post("/api/engine/power.list", {}).then((res) => {
          this.loading = 0;
          if (res.data.code === 0) {
            var powers = res.data.data;
            powers = powers.sort((a,b)=>{return a.seq - b.seq;});
        
            var root = new powerNode({id:0,title:'root',visible:1,open:1});
            this.buildChildren(root,powers);

            var items = [];
            root.eachChildren(item=>{
              items.push(item);
            })
            this.items = items; 

            this.root = root;
            root.doOpen();

            this.resetCheck();
          } else {
            this.loading = 3;
            this.msg = res.data.message;
          }
        }).catch((error) => {
          this.loading = 3;
            this.msg = error
        });
      },
      buildChildren(node,powers){
        powers.map(item=>{
          if(item.parentId == node.id){ 
            if(item.powerType <= 2){
              // 子菜单
              var children = new powerNode({
                id:item.powerId,
                title:item.powerCaption,
                parent:node,
                level:node.level + 1
              }); 
              node.children.push(children);
              this.buildChildren(children,powers);
            }
            else{
              // 功能点
              node.points.push(new powerNode({ 
                  id:item.powerId,
                  title:item.powerCaption,
                  parent:node
              }));
            }            
          }
        })
      },
      resetCheck(){ 
        var checked = this.checked;
        this.root.eachChildrenPoint(item=>{
          item.check = 0;
        });
        this.root.eachLeafChildrenPoint(item=>{
          if(checked.indexOf(item.id)>=0){
            item.doCheck();
          }
        })
      },
      userChange(){
        this.checked.splice(0,this.checked.length);
        this.root.eachChildrenPoint(item=>{
          if(item.check>0){
            this.checked.push(item.id);
          }
        })
      }
    }
  }

</script>

<style type="text/css">
  .typowercheck{

  }
  .typowercheck-table{
    width: 100%;
  }
  .typowercheck-table td{
    vertical-align: top;
    padding:4px;
    line-height: 24px;
    border-bottom: 1px #ddd dashed;
  }
  .typowercheck-table-lev{
    white-space:nowrap;
  }
  .typowercheck-table-lev1{
    width: 140px;
    font-weight: bold;
  }
  .typowercheck-table td.typowercheck-table-lev2{
    padding-left: 20px;
  }
  .typowercheck-table td.typowercheck-table-lev3{
    padding-left: 40px;
  }
  .typowercheck .ivu-checkbox-group-item{
    white-space:nowrap;
  }
  
  .typowercheck-table-chkall{
    width: 1px;
  }
  .typowercheck-table-chkall .ivu-icon{
    font-size: 16px;
    cursor: pointer;
    color: #ccc;
  }
  .typowercheck-table-chkall .ivu-icon:hover{
    color:#20bfee;
  }
  .typowercheck-table-fold{
    display: inline-block;color: #999;
    width:24px;text-align: center;
  }

  .typowercheck-check{
    cursor: pointer;
    display: inline-block;
    line-height: 18px;
  }

  .typowercheck-check:hover span{
    color:#333;
  }

  .typowercheck-check .ivu-icon{    
    color: #eb5954;
    font-size: 16px;
  }

  .typowercheck-check .icon-uncheck{
    color:#ccc;
  }

  .typowercheck-table-points .typowercheck-check{
    margin-right: 14px;
  }

   
</style>
