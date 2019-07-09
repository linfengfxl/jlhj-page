<template>
  <div class="tv-div">
    <DeptTreeNode :model="root"></DeptTreeNode>
    <div v-bind:class="{'contextmenu':1,'hidden':!contextmenu.show}" :style="menustyle"> 
        <ul v-if="currentDept!=null && currentDept.id==0" clas="contextmenu-ul">
            <li>
                <Button type="text" @click="add" class="contextmenu-item" >添加子部门</Button>
            </li>
        </ul>
        <ul v-else clas="contextmenu-ul">
            <li>
                <Button type="text" @click="add" class="contextmenu-item" >添加子部门</Button>
            </li>
            <li>
                <Button type="text" @click="update" class="contextmenu-item" >修改部门</Button>
            </li>
            <li>
                <Button type="text" @click="deleteDept" class="contextmenu-item" >删除</Button>
            </li>
        </ul>
    </div>
    <EditDept ref="editDept" @on-save="onSave"></EditDept>
  </div>
</template>
<script>
import DeptTreeNode from '@/components/contacts/DeptTreeNode'
import treeComponent from '@/components/tree/treeComponent.js'
import EditDept from '@/components/contacts/EditDept'

export default {
  components: {
    DeptTreeNode,
    EditDept
  },
  props: {

  },
  data() {
    return {
      contextmenu:{
         top:0,
         left:0,
         show:false
      },
      currentDept:null,
      root:{
        title:'公司',
        children:[]
      },
      tree:null
    };
  },
  mounted(){
    var that = this;
    var tree = new treeComponent({
      idProperty:'deptId',
      titleProperty:'deptName',
      parentIdProperty:'parentId',
      root:{title:'公司',data:{deptName:'公司',deptId:'',parentId:''},select:true},
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
            that.currentDept = e.sender.data;

            tree.setSelect([that.currentDept.deptId]);

            e.handled=true;
          }
      },
      onSelect:function(e){         
         that.selDept(e.sender.data);
      }
    });
    this.tree= tree;
    this.root= this.tree.options._root;

    // 鼠标离开快捷菜单消失
    var hiddenContextMenuTimer = null;
    $('.contextmenu').hover(function(){
        clearTimeout(hiddenContextMenuTimer);
    },function(){
        hiddenContextMenuTimer = setTimeout(function(){
            that.contextmenu.show = false;
        },300);
    });

    this.load();
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
    load(){
      this.$http.post('/api/engine/dept/list').then((res) => {
        if (res.data.code === 0) {
          this.tree.options.data = res.data.data;
          this.tree.load();
          if(this.currentDept){
            this.$emit("on-select",this.currentDept);
          }
        } else {
          this.$Message.error(res.data.message)
        }
      }).catch((error) => {
         this.$Message.error(error.message)
      });
    },
    selDept(currentDept){
       this.contextmenu.show = false;
       this.currentDept = currentDept;
       this.$emit("on-select",currentDept);
    }, 
    add(){
       this.contextmenu.show = false; 
       this.$refs.editDept.openAdd({parentId:this.currentDept.deptId,parentDeptName:this.currentDept.deptName});
    },
    update(){
       this.contextmenu.show = false;
       this.$refs.editDept.openEdit(this.currentDept);
    },
    onSave(dept){ 
      this.load();
    },
    deleteDept(){
        this.contextmenu.show = false;
        this.$Modal.confirm({
            title: '删除确认',
            content: '<p>删除后不能恢复，确定删除已选择的记录吗？</p>',
            onOk: () => {

              this.$http.post('/api/engine/a.canDelete', {deptId:this.currentDept.deptId}).then((res) => {
                if (res.data.code === 0) {
                  if(res.data.data){
                    this.$http.post('/api/engine/dept/delete', {deptId:this.currentDept.deptId}).then((res) => {
                      if (res.data.code === 0) {
                        this.$Message.success("删除成功");
                        this.load();
                        this.tree.setSelect([this.currentDept.parentId]);
                        this.$emit("on-select",this.currentDept);
                      } else {
                        this.$Message.error(res.data.message)
                      }
                    }).catch((error) => {
                      this.$Message.error(error.toString())
                    });
                  }else{
                    this.$Message.error("部门已被使用，无法删除");
                  }
                } else {
                  this.$Message.error(res.data.message)
                }
              }).catch((error) => {
                this.$Message.error(error.toString())
              });
            }
        });
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
  .contextmenu-item{width: 100%;text-align: left;}
  .contextmenu-item:hover{background-color:#eaf2ff }
  .hidden{display: none;}

</style>

