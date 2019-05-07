<template>
  <div class="tv-div">
    <DeptTreeNode :model="root"></DeptTreeNode>
    <div v-bind:class="{'contextmenu':1,'hidden':!contextmenu.show}" :style="menustyle">
       <ul v-if="cur!=null && cur.id==0" clas="contextmenu-ul">
              <li>
                <Button type="text" @click="create" class="contextmenu-item" >添加</Button>
              </li>
          </ul>
          <ul v-else clas="contextmenu-ul">
              <li>
                <Button type="text" @click="create" class="contextmenu-item" >添加</Button>
              </li>
              <li>
                <Button type="text" @click="del" class="contextmenu-item" >删除</Button>
              </li>
          </ul>
         
      </div>
  </div>
</template>
<script>
import DeptTreeNode from '@/components/contacts/DeptTreeNode'
import treeComponent from '@/components/tree/treeComponent.js'

export default {
  components: {
    DeptTreeNode,
  },
  data() {
    return {
      contextmenu:{
         top:0,
         left:0,
         show:false
      },
      cur:null,
      root:{
        title:'功能点',
        children:[]
      },
      tree:null,
      editDept:null,
      data:[]
    };
  },
  mounted(){
    var that = this;
    var tree = new treeComponent({
        idProperty:'powerId',
        titleProperty:'title', 
        parentIdProperty:'parentId',
        root:{title:'功能点',data:{title:'功能点',powerId:'',parentId:null,powerCaption:'功能点'}},
        onLoad:function(){
          if(!tree.options.isLoad){
            tree.build();
            tree.openLevel(0);
          }else{
            tree.buildRestoreStatus();
          }
          tree.options.isLoad = true;
        },
        onEvent:function(e){
          // 弹出上下文菜单
          if(e.name == 'contextmenu'){
            var offset = $(e.$e.srcElement).offset();
            var winHeight = $(window).height();
            var offsetY = offset.top + $('.contextmenu').height() - winHeight;
            if(offsetY>0){
                offset.top = offset.top - offsetY;
            }
            if(offset.top < 0){
                offset.top = 0;
            }

            that.contextmenu.show=true;
            that.contextmenu.top = offset.top;
            that.contextmenu.left = offset.left;
            that.contextmenu.show = true;

            that.cur = e.sender.data;

            tree.setSelect([that.cur.powerId]);

            e.handled=true;
          }
        },
        onSelect:function(e){
           that.sel(e.sender.data);
        }
    });
    this.tree= tree;
    this.root= tree.options._root;
    // 鼠标离开快捷菜单消失
    var hiddenContextMenuTimer = null;
    $('.contextmenu').hover(function(){
      clearTimeout(hiddenContextMenuTimer);
    },function(){
      hiddenContextMenuTimer = setTimeout(function(){
          that.contextmenu.show = false;
      },300);
    });
  },
  computed:{
    style() {
      if(this.model && this.model.level){
        return 'padding-left:' + this.model.level*14 + 'px';
      }
      return "";
    },
    menustyle() {
       return 'top:'+this.contextmenu.top+'px;left:'+this.contextmenu.left+'px;z-index:10;';
    }
  },
  methods:{
    load(data){
      if(typeof(data) != 'undefined' && data.length > 0){
        this.tree.options.data = data;
        this.tree.load();
        this.tree.foreach((node)=>{
          node.tooltip = node.data.powerCaption;
          node.title = node.data.powerCaption;
        })
        if(this.cur!=null){
          this.sel(this.cur);
        }else{
        this.sel(data[0]);
        this.tree.setSelect([data[0].powerId]);
      }
      }
    },
    resetMenu(data,id){
      if(typeof(data) != 'undefined' && data.length > 0){
        this.tree.options.data = data;
        this.tree.load();
        this.tree.foreach((node)=>{
          node.tooltip = node.data.powerCaption;
          node.title = node.data.powerCaption;
        })
        for(var i=0;i<data.length;i++){
          if(data[i].powerId==id){
             this.sel(data[i]);
            this.tree.setSelect([data[i].powerId]);
          }
        }
      }
    },
    sel(cur){
      this.contextmenu.show = false;
      this.cur = cur;
      this.$emit("on-select",cur);
    },
    setSelect(){
      this.tree.setSelect([]);
    },
    create(){
      this.contextmenu.show = false; 
      this.$emit("on-menu-add",{parentId:this.cur.powerId});
    },
    del(){
      this.contextmenu.show = false;
      var powerId=this.cur.powerId;
      this.cur=null;
      this.$emit("on-menu-delete",powerId);
    } 
  }
}
</script>

<style>
  .tv-div{}
  .contextmenu{
    position: fixed;
    background-color: white;
    border:1px solid #efefef;
  }
  .contextmenu ul{list-style: none;}
  .contextmenu-item{width: 100%;text-align: left;}
  .contextmenu-item:hover{background-color:#eaf2ff }
  .hidden{display: none;}

</style>

