<template>
  <div class="page demo">
    <div class="page-title">
      批量选择人员
    </div>
    <div>
      <table class="demo-table">
        <tr>
          <td>操作</td>
          <td><Button type="default" @click="show1">选择人员(id)</Button></td>
          <td><Button type="default" @click="show">选择人员(empId)</Button></td> 
        </tr>
        <tr>
          <td>选中的人员</td>
          <td>
            <div v-for="(item,index) in checkEmpIds1 ">
              {{index+1}}.{{item}}
            </div>
          </td>
          <td>
            <div v-for="(item,index) in checkEmpIds ">
              {{index+1}}.{{item}}
            </div>
          </td>
        </tr>  
      </table>
      <SelPersons ref="selPersons" :transfer="true"></SelPersons> 
    </div>
  </div> 
</template>

<script>

import SelPersons from '@/components/selcontacts1';  

export default {
  components: {
    SelPersons
  },
  data() {  
    return { 
      checkEmpIds:['renxin','wuying'],
      checkEmpIds1:[1,20]
    }
  },
  mounted:function(){ 
     
  },
  computed:{
     
  },
  methods:{
    show(){
      var sel = this.$refs.selPersons;
      sel.show({
        checkEmpIds:this.checkEmpIds,
        identify:2,
        ok:()=>{ 
           this.checkEmpIds = sel.checkEmpIds;
        }
      });
    },
    show1(){
      var sel = this.$refs.selPersons;
      sel.show({
        checkEmpIds:this.checkEmpIds1,
        identify:1,
        ok:()=>{ 
           this.checkEmpIds1 = sel.checkEmpIds;
        }
      });
    }
  }
}

</script>

<style type="text/css">
  .demo-table td{
    padding: 4px;
  }
</style>