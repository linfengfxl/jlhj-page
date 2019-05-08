<template>
<LayoutVer>
  <div slot="top">
  </div> 
  <LayoutHor :fix="true" :left="'contacts-layout-left'">
    <div slot="left" class="contacts-left">
       <LayoutVer>
          <div slot="top" class="contacts-top-title">组织架构</div> 
          <div class="contacts-dept-tree">
            <Dept ref="dept" 
              @on-select="selectDept" 
              @on-menu-delete="delDept"
              @on-menu-add="addDept" 
              @on-menu-update="updateDept"></Dept>
          </div>           
      </LayoutVer> 
    </div> 
    <Members ref="members" class="contacts-member"></Members> 
  </LayoutHor>
</LayoutVer>
</template>

<script>

import LayoutVer from '@/components/layout/LayoutVer';
import LayoutHor from '@/components/layout/LayoutHor';
import Dept from '@/components/contacts/Dept'
import Members from '@/components/contacts/Members'

export default {
  components: {
    LayoutVer,
    LayoutHor,
    Dept,
    Members
  },
  data() { 
    return { 
      actionDept:0,
      actionEmp:0
    }
  },
  mounted(){ 
    this.loadDept();
  },
  computed:{ 
  },
  methods:{     
    loadDept() {
        this.$http.post('/api/engine/dept/list', {}).then((res) => {
          if (res.data.code === 0 && res.data.data !=null) {
            this.$refs.dept.load(res.data.data);
          } else {
            this.$Message.error(res.data.message)
          }
        }).catch((error) => { 
          this.$Message.error(error.message)
        });
    },
    selectDept(currentDept){
      this.actionDept = 0;
      this.actionEmp = 0;
      this.$refs.members.queryForm.status = -1;
      this.$refs.members.queryForm.dimission = 2;
      this.$refs.members.queryForm.distribution = true; 
      this.$refs.members.queryForm.deptId = currentDept.deptId;
      this.$refs.members.queryForm.deptName = currentDept.deptName;
      this.$refs.members.query();
    },
    addDept(editDept){
        let that = this;
        this.$http.post('/api/contacts/dept/add', 
        {
          deptId:editDept.deptId,
          deptName:editDept.deptName
        }).then((res) => {
          if (res.data.code === 0) {
            that.loadDept();
          } else {
            this.$Message.error(res.data.message)
          }
        }).catch((error) => {
           this.$Message.error(error.message)
        });
    },
    updateDept(editDept){
       let that = this;
        this.$http.post('/api/contacts/dept/edit',
         {
          deptId: editDept.deptId, 
          deptName: editDept.deptName
        }).then((res) => {
          if (res.data.code === 0) {
            that.loadDept();
          } else {
            this.$Message.error(res.data.message)
          }
        }).catch((error) => {
          this.$Message.error(error.message)
        });
    },
    delDept(deptId){ 
       this.$Modal.confirm({
          title: '删除确认',
          content: '<p>确定删除该部门吗？</p>',
          closable:true,
          onOk: () => {
             let that = this;
            this.$http.post('/api/contacts/dept/delete?deptId=' + deptId).then((res) => {
              if (res.data.code === 0) {
                that.loadDept();
              } else {
                this.$Message.error(res.data.message)
              }
            }).catch((error) => {
              this.$Message.error(error.message)
            });
          }
        });
    },
    leaveList(){
      this.actionDept = 0;
      this.actionEmp = 1;
      this.$refs.dept.setSelect(); 

      Object.assign(this.$refs.members.queryForm,{
        status:-1,
        deptId:1,
        dimission:1,
        distribution:true,
        keyword:'',
      });
      this.$refs.members.query();
    },
    undistributed(){
      this.actionDept = 1;
      this.actionEmp = 0;
      this.$refs.dept.setSelect();
      
      Object.assign(this.$refs.members.queryForm,{
        status:-1,
        deptId:1,
        dimission:2,
        distribution:false,
        keyword:'',
      });
      this.$refs.members.query();
    }
  }
}

</script> 

<style type="text/css">
  .contacts-bar-alert { 
    height: 41px;
    line-height: 24px;
    margin-bottom: 0px;
  }
  .contacts-left {
     height:100%;
     width:210px;
     background-color: white;
     border-right: 1px solid #eeeeee;
  }
  .contacts-top-title {
    line-height: 41px;
    font-size: 14px;
    padding-left:15px;
    border-bottom: 1px solid #eeeeee;
    /*background-color: #F9FAFB;*/
  }
  .contacts-left-footer {
    line-height: 41px;
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
    width: 210px;
  }
  
</style>