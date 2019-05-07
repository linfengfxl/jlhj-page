<template>
<LayoutVer>
  <div slot="top">
  </div> 
  <LayoutHor :fix="true" :left="'contacts-layout-left'">
    <div slot="left" class="contacts-left">
       <LayoutVer>
          <div slot="top" class="contacts-top-title">功能菜单</div> 
          <div class="contacts-dept-tree">
            <Category ref="category" 
              @on-select="selCate" 
              @on-menu-delete="delCate"
              @on-menu-add="addCate" ></Category>
          </div>
      </LayoutVer> 
    </div> 
    <PowerList ref="powerList" class="contacts-member" @on-save="reLoadCategory"  @on-menu-del="delCate"></PowerList> 
     <PowerEdit ref="powerEdit" @on-save="loadCategory"></PowerEdit>
  </LayoutHor>
</LayoutVer>
</template>

<script>

import LayoutVer from '@/components/layout/LayoutVer';
import LayoutHor from '@/components/layout/LayoutHor';
import Category from '@/components/powermenu/Category';
import PowerList from '@/components/powermenu/powerList';
import PowerEdit from '@/components/powermenu/PowerEdit';
export default {
  components: {
    LayoutVer,
    LayoutHor,
    Category,
    PowerList,
    PowerEdit
  },
  data() { 
    return { 
      actionDept:0,
      actionEmp:0
    }
  },
  mounted(){  
    this.loadCategory();
  },
  computed:{ 
  },
  methods:{
    loadCategory() {
      this.$http.post('/api/engine/power.list?', {}).then((res) => {
        if (res.data.code == 0 && res.data.data !=null) {
          this.$refs.category.load(res.data.data);
        } else {
          this.$Message.error(res.data.message)
        }
      }).catch((error) => { 
        this.$Message.error(error.message)
      });
    },
     reLoadCategory(id) {
      this.$http.post('/api/engine/power.list?', {}).then((res) => {
        if (res.data.code === 0 && res.data.data !=null) {
          this.$refs.category.resetMenu(res.data.data,id);
        } else {
          this.$Message.error(res.data.message)
        }
      }).catch((error) => { 
        this.$Message.error(error.message)
      });
    },
    selCate(cur){
      this.$refs.powerList.queryForm.powerId = cur.powerId;
      this.$refs.powerList.query();
    },
    addCate(editCate){
      this.$refs.powerEdit.open(editCate);
    },
     delCate(code){ 
     this.$Modal.confirm({
        title: '删除确认',
        content: '<p>确定删除该功能点吗？</p>',
        closable:true,
        onOk: () => {
          let that = this;
          this.$http.post('/api/engine/power.delete',{powerId:code}).then((res) => {
            if (res.data.code === 0) {
              that.loadCategory();
              this.$Message.success("删除成功");
            } else {
              this.$Message.error(res.data.message)
            }
          }).catch((error) => {
            this.$Message.error(error.message)
          });
        }
      });
    }
  }
}

</script>
<style type="text/css">
  /*部门树*/
  .contacts-left .dept-tree-node .tv-node.select{
    background-color: #e8f8fd;
    color: #20bfee;
  }
  .contacts-left .dept-tree-node .tv-node:hover {
    background-color: #e8f8fd;
  }

</style>

<style type="text/css">
  .contacts-bar-alert { 
    height: 42px;
    line-height: 24px;
    margin-bottom: 0px;
  }
  .contacts-left {
     height:100%;
     width:240px;
     background-color: white;
     border-right: 1px solid #eeeeee;
  }
  .contacts-top-title {
    height: 42px;
    line-height: 42px;
    font-size: 12px;
    padding-left:15px;
    border-bottom: 1px solid #eeeeee;
    /*background-color: #F9FAFB;*/
  }
  .contacts-left-footer {
    line-height: 40px;
    text-align: left;
    cursor: pointer;
    background-color: white;
  }

  .contacts-left-footer .footer-txt {
    display: block;
    color: #495060;
    border-top: 1px solid #eeeeee;
    padding-left: 15px;
    /*background-color: #F9FAFB;*/
  }
   .contacts-left-footer .footer-txt:hover {
    color: #20bfee;
    background-color: #e8f8fd;
    border-right:2px solid #20bfee; 
  }

  .contacts-left-footer .active {
    color:#20bfee;
    background-color: #e8f8fd;
    border-right:2px solid #20bfee; 
  }
  
  .contacts-layout-left.layout-hor-left{
    width: 240px;
  }
  
</style>