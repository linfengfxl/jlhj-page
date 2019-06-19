<template>
  <Modal v-model="show" :title="title" :closable="false" :mask-closable="true">
    <div class="page">
      <Loading :loading="loading">
      <div class="page-form">
        <Form :model="formItem" ref="argForm" :label-width="120" :rules="ruleValidate" class="form-item">

          <div class="form-sub-title">
            <Icon type="compose"></Icon>
            基本资料
          </div>
          <FormItem label="合同编号" prop >
           {{formItem.contractId}}
          </FormItem>
          
          <FormItem label="合同名称" prop >
           {{formItem.contractName}}
          </FormItem>
         
          <FormItem label="客户名称" prop >
           {{formItem.customerName}}
          </FormItem>
         
          <FormItem label="签订日期" prop >
           {{formItem.signDate}}
          </FormItem>
         
          <FormItem label="合同生效日期" prop >
           {{formItem.validStartDate}}
          </FormItem>
          
          <FormItem label="合同终止日期" prop >
           {{formItem.validEndDate}}
          </FormItem>
          
          <FormItem label="合同金额" prop >
           {{formItem.amount}}
          </FormItem>

          <FormItem label="合同类型" prop >
           {{formItem.contractType}}
          </FormItem>
        
          <FormItem label="付款方" prop >
           {{formItem.paySubject}}
          </FormItem>
          
          <FormItem label="合同情况" prop>
           {{status}}
          </FormItem>
          <FormItem >
            <Button type="primary" icon="checkmark" @click="close">确定</Button>
            <Button type="ghost" @click="edit" style="margin-left: 8px" >编辑</Button>
            <Button type="ghost" @click="close" style="margin-left: 8px">取消</Button>
          </FormItem> 
        </Form>
      </div>
      </Loading>
      <SelectCustomer ref="selCustomer" :transfer="false"></SelectCustomer>
    </div>
    <div slot="footer"></div>
  </Modal>
</template>
<script>
  import Loading from '@/components/loading'; 
  import SelectCustomer from '@/components/customer/SelectCustomer';
  import page from '@/assets/js/page';

  export default {
    components: {
      Loading, 
      SelectCustomer
    },
    data() {
      return {
        loading: 1,
        show: false,
        //是否编辑 
        isEdit: false,
        //表单对象
        formItem: {
          contractId: '',
          contractName:'',
          customerCode:'',
          customerName: '',
          signDate: '',
          validStartDate: '',
          validEndDate: '',
          amount:0,
          contractType:'',
          paySubject:'',
          status: '',
        },
        oriItem:{

        },
        //验证
        ruleValidate: {

        },
        contractStatus:[
        {code:1,text:'已做未签'},
        {code:2,text:'未做'},
        {code:3,text:'已签'},
      ],
      status:'',
      clickEdit: () => { }
      }
    },
    computed: {
      title() {
        return "查看合同信息";
      }, 
    },
    methods: {
      open(arg) {
        this.show = true; 
        this.$refs['argForm'].resetFields(); 
        this.oriItem={};
        if (arg.contractId) {
          this.oriItem = $.extend({
            contractId: '',
            contractName:'',
            customerCode:'',
            customerName: '',
            signDate: '',
            validStartDate: '',
            validEndDate: '',
            contractType:'',
            amount:0,
            paySubject:'',
            status: ''},arg);
        }
        if(this.oriItem.signDate!=null){
          this.oriItem.signDate = this.oriItem.signDate.length>=10?this.oriItem.signDate.substring(0,10):this.oriItem.signDate;  
        }
        
        if(this.oriItem.validStartDate!=null){
          this.oriItem.validStartDate = this.oriItem.validStartDate.length>=10?this.oriItem.validStartDate.substring(0,10):this.oriItem.validStartDate; 
        }
        if(this.oriItem.validEndDate!=null){
          this.oriItem.validEndDate = this.oriItem.validEndDate.length>=10?this.oriItem.validEndDate.substring(0,10):this.oriItem.validEndDate; 
        }
        
        $.extend(this.formItem,this.oriItem);
        if(this.formItem.status==1){
          this.status="已做未签";
        }
        if(this.formItem.status==2){
          this.status="未做";
        }
        if(this.formItem.status==3){
          this.status="已签";
        }
        this.loading = 0;
      },
      close() {
        this.show = false;
      },
      edit() {
        this.show = false;
        this.clickEdit();
      },
      reset() {
        $.extend(this.formItem,this.oriItem);
      }
    }
  }

</script>

<style type="text/css">
  .form-sub-title {
    font-size: 14px;
    margin: 0 0 12px 18px;
    color: #2b85e4;
  }
</style>
