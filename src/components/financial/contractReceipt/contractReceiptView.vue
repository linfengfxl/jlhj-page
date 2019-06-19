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
          <FormItem label="单据编号" prop="contractReceiptCode">
            {{formItem.contractReceiptCode}}
          </FormItem>
          <FormItem label="收款户名" prop="receiptAccount" >
             {{formItem.receiptAccount}}
          </FormItem>
          <FormItem prop="receiptDate" label="收款日期">
            {{formItem.receiptDate}}
          </FormItem>
          <FormItem prop="receiptType" label="收款类型" > 
             {{formItem.receiptType}}
          </FormItem>
          <FormItem prop="projectCode" label="工程名称"> 
             {{formItem.projectName}}
          </FormItem>
          <FormItem label="合同甲方" prop="customerName" >
             {{formItem.customerName}}
          </FormItem>
           <FormItem prop="penalty" label="罚款">
             {{formItem.penalty}}
          </FormItem>
           <FormItem prop="deduction" label="扣款">
             {{formItem.deduction}}
          </FormItem>
           <FormItem prop="receiptAmount" label="收款金额">
             {{formItem.receiptAmount}}
          </FormItem>
          <FormItem label="经手人" prop="payee" >
            {{formItem.payee}}
          </FormItem>
          <FormItem label="备注" prop="remark" >
             {{formItem.remark}}
          </FormItem>
          <FormItem prop="files" label="附件">
            <UploadBox v-model="formItem.files" :readonly="true"></UploadBox>
          </FormItem> 
          <FormItem >
            <Button type="primary" icon="checkmark" @click="close">确定</Button>
            <Button type="ghost" @click="edit" style="margin-left: 8px">编辑</Button>
            <Button type="ghost" @click="close" style="margin-left: 8px">取消</Button>
          </FormItem> 
        </Form>
      </div>
      </Loading>
    </div>
    <div slot="footer"></div>
  </Modal>
</template>
<script>
  import Loading from '@/components/loading'; 
  import SelectCustomer from '@/components/customer/SelectCustomer';
  import page from '@/assets/js/page';
  import SelectProject from '@/components/page/form/SelectProject';
  import UploadBox from '@/components/upload/Index';

  export default {
    components: {
      Loading, 
      SelectCustomer,
      SelectProject,
      UploadBox
    },
    data() {
      return {
        loading: 1,
        show: false,
        //是否编辑 
        isEdit: false,
        //表单对象
        formItem: {
          contractReceiptCode: '',
          receiptAccount:'',
          receiptDate:'',
          receiptType:'',
          projectCode:'',
          projectName:'',
          customerCode:'',
          customerName: '',
          penalty: 0,
          deduction: 0,
          receiptAmount: 0,
          payee:'',
          remark:'',
          files:'',
        },
        oriItem:{

        },
        clickEdit: () => { },
        //验证
        ruleValidate: {
        },
        receiptType:[
        {code:'进度款',text:'进度款'},
        {code:'完工款',text:'完工款'},
      ],
      }
    },
    computed: {
      title() {
          return "查看合同收款信息";
      }, 
    },
    methods: {
      open(arg) {
        this.show = true; 
        this.$refs['argForm'].resetFields(); 
        this.oriItem={
            contractReceiptCode: '',
            receiptAccount:'',
            receiptDate:'',
            receiptType:'',
            projectCode:'',
            projectName:'',
            customerCode:'',
            customerName: '',
            penalty: 0,
            deduction: 0,
            receiptAmount: 0,
            payee:'',
            remark:'',
            files:'',};
        if (arg.contractReceiptCode) {
          this.oriItem = $.extend({
            contractReceiptCode: '',
            receiptAccount:'',
            receiptDate:'',
            receiptType:'',
            projectCode:'',
            projectName:'',
            customerCode:'',
            customerName: '',
            penalty: 0,
            deduction: 0,
            receiptAmount: 0,
            payee:'',
            remark:'',
            files:'',
          },arg);
        }
         if(this.oriItem.receiptDate!=null){
          this.oriItem.receiptDate = this.oriItem.receiptDate.length>=10?this.oriItem.receiptDate.substring(0,10):this.oriItem.receiptDate;  
        }
        $.extend(this.formItem,this.oriItem);
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
