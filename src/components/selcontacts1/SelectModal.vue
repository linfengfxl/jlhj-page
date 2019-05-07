<template>
  <Modal
    v-model="display"
    :closable="false"
    :mask-closable="false"
    :footerHide="true"
    :transfer ="transfer"
    title=""
    class="selcontacts1"
    width="800">
    <LeftDept ref="leftDept" class="leftdept" @on-select="selectDept"></LeftDept>  
    <RightMember ref="rightMember" :checkIds="checkEmpIds" :idPath="identify == 1?'id':'empId'" v-if="display"></RightMember>
    <div class="footer">
      <table>
        <tr>
          <td>
            <Button icon="" type="primary" @click="ok">确 定 ( {{checkEmpIds.length}} 人) </Button>
          </td>
          <td>&nbsp;&nbsp;</td>
          <td>
            <Button icon="" type="default" @click="cancel">取 消</Button>
          </td>
          <td></td>
        </tr>
      </table>
    </div>
  </Modal>
</template>
<script>
import LeftDept from './LeftDept';
import RightMember from './RightMember';

export default { 
  components: {
    LeftDept,
    RightMember
  },
  props:{
    transfer:{
      type:Boolean,
      default:false
    }
  },
  data() {
    return { 
      display:false,
      checkEmpIds:[],
      //标识 1.id 2.empId
      identify:1, 
      isMulti:false,
      options:{}
    }
  },
  mounted:function(){

  },
  computed:{

  },
  watch:{

  },
  methods:{ 
    ok:function(){
      this.display = false;
      if(this.options.ok){
        this.options.ok();
      }
    },
    cancel:function(){
      this.display = false;
      this.select = [];
      if(this.options.cancel){
        this.options.cancel();
      }
    },
    // 对外方法
    show(options){  
      Object.assign(this.options,{
        isMulti:true, 
        checkEmpIds:[],
        identify:1,
        ok:()=>{},
        cancel:()=>{}
      },options);

      this.checkEmpIds = Object.assign([],this.options.checkEmpIds || []);
      this.isMulti = this.options.isMulti;
      this.identify = this.options.identify;
      this.display = true;

      this.initData();
    },
    selectDept(dept){
      this.$refs.rightMember.queryForm.deptId = dept.deptId;
      this.$refs.rightMember.query();
    },
    initData(){
      this.loadDept();
    },
    loadDept(){
      var selDept = this.$refs.leftDept;
      selDept.load([{deptName:'加载中...'}]); 

      this.$http.post('/api/contacts/dept/list', {}).then((res) => {        
        if (res.data.code === 0 && res.data.data !=null) {
          selDept.load(res.data.data);
        } else {
          this.$Message.error(res.data.message)
        }
      }).catch((error) => { 
        this.$Message.error(error.message)
      });
    }
  }
}

</script>

<style type="text/css">
  .selcontacts1 .ivu-modal-body{
    height: 650px;
    padding: 10px;
    padding-left:210px;
    padding-bottom:60px;
    position: relative;
  }

  .selcontacts1 .leftdept {
    width: 200px; 
    overflow-y: auto;
    border-right: 1px solid #eeeeee;
    position: absolute;
    left:10px;
    bottom:10px;
    top:10px;
  }

  .selcontacts1 .footer{
    height: 60px;  
    border-top:1px solid #eeeeee;
    padding: 10px;
  }
  .selcontacts1 .footer table{
    float: right; 
  }
</style>