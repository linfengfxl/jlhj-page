<template>
<LayoutVer>
  <div slot="top">
  </div> 
  <LayoutHor :fix="true" :left="'contacts-layout-left'">
    <div slot="left" class="contacts-left">
       <LayoutVer>
          <div slot="top" class="contacts-top-title">部门人员</div> 
          <div class="contacts-dept-tree">
            <Dept ref="dept" @on-select="selectDept"></Dept>
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
       
    }
  },
  mounted(){  
  },
  computed:{ 
  },
  methods:{
    selectDept(dept){       
      this.$refs.members.queryForm.status = 0;
      this.$refs.members.queryForm.deptId = dept.deptId;       
      this.$refs.members.queryForm.deptName = dept.deptName;       
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