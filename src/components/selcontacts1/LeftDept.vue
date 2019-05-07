<template>
  <div class="tv-div">
   <DeptTreeNode :model="root"></DeptTreeNode>
 </div>
</template>
<script>
  import DeptTreeNode from '@/components/contacts/DeptTreeNode'
  import treeComponent from '@/components/tree/treeComponent.js' 

  export default {
    components: {
      DeptTreeNode
    },
    props: {
      installed:{
        type:Boolean,
        default:true
      }
    },
    data() {
      return { 
        currentDept:null,
        root:{
          title:'公司',
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
        idProperty:'deptId',
        titleProperty:'deptName',
        parentIdProperty:'parentId',
        root:{title:'公司',data:{deptName:'公司',deptId:1,parentId:null}},
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

        },
        onSelect:function(e){
          that.selDept(e.sender.data);
        }
      });
      this.tree= tree;
      this.root= this.tree.options._root;
    },
    methods:{
      load(data){
        if( typeof(data) != 'undefined' && data.length > 0){
          this.tree.options.data = data;
          this.tree.options._root.title = data[0].deptName;
          this.tree.load(); 
        }
      },
      selDept(currentDept){ 
        this.$emit("on-select",currentDept);
      },
      setSelect(){
        this.tree.setSelect([]);
      },
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
    .contextmenu-item{width: 100%;text-align: left;}
    .contextmenu-item:hover{background-color:#eaf2ff }
    .hidden{display: none;}
  </style>

