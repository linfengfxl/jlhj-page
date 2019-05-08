<template>
  <div :class="{'tyleftbar':1,'tyleftbar-fold':fold,'tyleftbar-unfold':!fold,'noselect':1}">     
    <div class="tyleftbar-head">
      <span class="tyleftbar-head-title">我的应用</span>
      <Icon v-if="fold" @click.native="switchFold"
        type="chevron-right tyleftbar-head-icon"></Icon>
      <Icon v-else @click.native="switchFold"
        type="chevron-left tyleftbar-head-icon"></Icon>
    </div>
    <div class="tyleftbar-menu wt-scroll">
      <div v-if="fold">
        <div class="tyleftbar-fold-menu-item" v-for="(item,index) in rootNode.children" :title="item.title" @click="foldMenuClick(item)">
          <Icon :type="item.iconfont" class="icon" v-if="item.iconfont"　></Icon>
          <img :src="item.icon" class="icon" v-else />
        </div>
      </div>
      <LeftMenuItem v-else :menuNode="item" :curNode="curNode" :lev="1" v-for="(item,index) in rootNode.children"></LeftMenuItem>
    </div>
  </div>
</template>

<script>

import storage from '@/assets/js/storage'
import LeftSubMenu from './LeftSubMenu'
import LeftMenuItem from './LeftMenuItem'
import power from './power'

function menuTreeNode(options) {
    var newObj = 
    Object.assign({
      id:0,
      title:'标题',
      parent:null,
      root:null,
      children:[],
      unfold:false
    },options);

    Object.assign(options,newObj);

    options.each = function(call){
      call(this);
      this.children.map(sub=>{
        sub.each && sub.each(call);
      })
    }

    options.click = function(target){
      options.parent && options.parent.click && options.parent.click(target); 
    }

    return options;
  }

  function menuTreeRoot(options) {

    var root = menuTreeNode(options);

    root._unfoldStatus = {};

    root.build = function(navs){ 
      // 记录 fold 状态
      root.each(node=>{
        if(node.unfold){root._unfoldStatus[node.id.toString()] = true;}
      }) 

      buildNode(root,navs);

      // 还原 fold 状态
      root.each(node=>{
        if(root._unfoldStatus[node.package]){
          node.unfold = true;
        }
      })

      root.unfold = true;
    }

    function buildNode(parent,navs){
      parent.children = [];
      navs.map(nav=>{
        var node = menuTreeNode(Object.assign({},nav));
        node.parent = parent;
        parent.children.push(node);
        buildNode(node,nav.subItems);
      });
    }

    return options;
  }

export default {
  components: {
    LeftSubMenu,
    LeftMenuItem
  },
  data() {
    return {
      fold:false,
      navs:[],  
      timer:null,
      rootNode:menuTreeRoot({title:'root',id:0}),
      curNode:null
    }
  },
  mounted: function () {
    this.load();
    this.rootNode.click = (node)=>{
      node.unfold = !node.unfold;
      this.open(node);
    }
  },
  methods: {
    load(){
      
      this.fold = storage.getLocal('leftMenuFold') == 1;  
      this.navs = power.navs;
      this.$emit('on-size-change',this);
      
      var curId = storage.getLocal('leftMenuCur');
      if(curId){
        power.navs.map(item=>{
          if(item.id==curId){
            this.open(item);
          }
        })
      }
      
      this.rootNode.build(power.navs);  
    },
    open(item){

      this.curNode = item;

      if(item.view){
        this.$router.push({name:item.view});
      }else if(item.uri){
        this.$router.push({path:item.uri});
      } 

      storage.setLocal('leftMenuCur',item.id);      
    },
    foldMenuClick(item){
      this.fold = false;
      this.$emit('on-size-change',this);
      this.rootNode.children.map(sub=>{
        sub.unfold = sub == item;
      })
    },
    subOpen(item){
      if(item.view){
        this.$router.push({name:item.view});
      }else if(item.uri){
        this.$router.push({path:item.uri});
      }
    }, 
    switchFold(){ 
      this.fold = !this.fold;      
      this.$emit('on-size-change',this);
    },     
    getWidth(){
      var width = 0;
      if(this.fold){
        width += 50;
      }else{
        width += 200;
      }
      if(this.showSubMenu){
        width += 150;
      }
      return width;
    }
  },
  computed:{
  },
  watch:{
    showSubMenu(val,old){
      this.$emit('on-size-change',this);
    },
    fold(val){
      if(val){
        storage.setLocal('leftMenuFold',1);
      }else{
        storage.setLocal('leftMenuFold',2);
      }
    }
  },
  created: function() {
    var that = this;
    this.$bus.$on('on-router-after-each', function (para) {
      var params = para.to.params.aid;
      var path = para.to.path;
    })
  }
}
</script>

<style type="text/css">
  .tyleftbar {
    height: 100%;
    padding-top: 42px;
    /*background-color: #414141;*/
    background-color:#EFF2F6 !important;
    color:#3B5999;
  }
  .tyleftbar:after {
    content: '';
    display: block;
    width: 1px;
    height: 100%;
    background: #CED8E4;
    position: absolute;
    right: 0;
    top: 0;
  }
  /*头部*/
  .tyleftbar-head {
    height: 42px;
    line-height: 42px;
    padding: 0 0 0 15px;
    font-size: 14px;
    border-bottom: 1px solid #CED8E4;
    cursor: default;
    margin-top: -42px;
  }

  .tyleftbar-head-icon{
    float: right; 
    cursor: pointer;
    line-height: 42px;
    width: 50px;
    display: block;
    text-align: center;
  }
  .tyleftbar-head-icon:hover{
    background-color: #cad3e2;
  }

  /*菜单*/
  .tyleftbar-menu{
    height: 100%;
    overflow-y: auto;
  }

  .tyleftbar-fold-menu-item{
    line-height: 42px;
    height: 42px;
    overflow: hidden;
    font-size: 14px;
    text-align: center;     
  }
  .tyleftbar-fold-menu-item .icon{
    font-size:16px;
  }

  .tyleftbar-fold-menu-item:hover{
    background-color: #cad3e2;    
  } 
  /*fold 状态*/ 
  .tyleftbar-unfold{
    width: 200px;
  }
  .tyleftbar-fold{
    width: 50px;
  }
  .tyleftbar-fold .tyleftbar-menu-item{
    padding: 0px 15px;
  }
  .tyleftbar-fold .tyleftbar-head-title,
  .tyleftbar-fold .tyleftbar-menu-item-title
  {
    display: none;
  }
  /*提示*/
  .tyleftbar .ivu-tooltip {
    display:initial;
    position: initial;
  }
  .tyleftbar .ivu-tooltip-rel {
    display:initial;
    position: initial;
  }
  /**/
  .tyleftbar-ext{
    position: absolute;
    right:-150px;
    z-index: 999;
    top:0px;
  }
  .tyleftbar-ext-fold{
    display: none;
  }
</style>
