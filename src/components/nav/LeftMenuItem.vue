<template>
  <div class="tyleftbar-menu-item"> 
    <div :class="'row '+ (lev>1?'lev2':'') + ' lev' + lev + (curNode == menuNode?' cur':'')" @click="click">     

      <template v-if="lev==1">
        <Icon :type="menuNode.iconfont" class="tyleftbar-menu-item-icon" v-if="menuNode.iconfont"></Icon>
        <img :src="menuNode.icon" class="tyleftbar-menu-item-icon" v-else />
      </template>

      <div class="icon-fold" v-else>
        <Icon type="document" v-if="menuNode.children.length==0"></Icon>
        <Icon type="arrow-down-b open" v-if="menuNode.children.length>0 && menuNode.unfold"/>
        <Icon type="arrow-right-b close " v-if="menuNode.children.length>0 && !menuNode.unfold" />
      </div>

      <div class="title" :title="menuNode.title">{{menuNode.title}}</div>
    </div>
    <div class="children" v-if="menuNode.unfold">
      <LeftMenuItem :menuNode="item" :curNode="curNode" :lev="lev+1" v-for="(item,index) in menuNode.children"></LeftMenuItem>
    </div>
  </div>
</template>
<script>
  export default {
    name:'LeftMenuItem',
    components: {
       
    },
    props: {
      menuNode:{
        type:Object,
        default(){
          return {
            id:0,
            title:'标题',
            parent:null,
            root:null,
            children:[],
            unfold:false
          }
        }
      },
      lev:{
        type:Number,
        default:1,
      },
      curNode:{
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
      click(){
        this.menuNode.click && this.menuNode.click(this.menuNode);
      }
    }
  }

</script>

<style type="text/css">
  .tyleftbar-menu-item{
    padding: 0px;margin: 0px;
  } 
  .tyleftbar-menu-item .row{
    display: flex;
    flex-wrap: nowrap;
    align-items:center;
    padding: 0px 4px;
    white-space: nowrap;
  }

  .tyleftbar-menu-item .row.lev1{
    line-height: 42px;
    height: 42px;
    font-size: 16px;
    padding: 0px 15px;
    padding-left: 42px;
    cursor: pointer;
    position: relative;
    color:#3B5999;
  } 

  .tyleftbar-menu-item .row.lev1:hover{
    background-color: #cad3e2;
  } 

  .tyleftbar-menu-item-icon{
    position: absolute;
    display: inline-block;
    left:17px;
    top:13px;
    width: 16px;
    height: 16px;
    font-size: 16px;
    color:#ccc;
    text-align: center;
  }

  .tyleftbar-menu-item .row.lev2{
    line-height: 42px;
    height: 42px;
    font-size: 14px;
    padding: 0px 15px;
    padding-left: 34px;
    cursor: default;
    position: relative;
    color:#3B5999;
  }

  .tyleftbar-menu-item .row.lev2:hover{
    background-color: #cad3e2;
  }

  .tyleftbar-menu-item .row.lev2.cur{
    background-color: #BAC6D9;
  }

  .tyleftbar-menu-item .row.lev3{
    padding-left: 52px;
  }

  .tyleftbar-menu-item .icon-fold{
    display: inline-block;
    padding: 4px;
    cursor: pointer;     
    text-align: center;
  }

  .tyleftbar-menu-item .icon-fold .ivu-icon{
    font-size: 18px;
    height: 18px;
    width: 18px;    
  }
  .tyleftbar-menu-item .ivu-icon.close{
    color:#ccc;
  } 

  .tyleftbar-menu-item .ivu-icon.none-children{
    color:#ccc;
  }

  .tyleftbar-menu-item .children{     
    
  }
  /*颜色*/
  .tyleftbar-menu-item .row.lev1 .ivu-icon{
    color:#2B579A;
  }
</style>

