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
          <FormItem label="单据编号" prop="invoiceReceiptCode">
            {{formItem.invoiceReceiptCode}}
          </FormItem>
          <FormItem prop="projectCode" label="工程名称"> 
            {{formItem.projectName}}
          </FormItem>
          <FormItem prop="invoiceDate" label="发票日期">
            {{formItem.invoiceDate}}
          </FormItem>
          <FormItem label="发票类型" prop>
            {{formItem.invoiceType}}
          </FormItem>
          <FormItem label="发票号码" prop="invoiceNo" >
            {{formItem.invoiceNo}}
          </FormItem>
           <FormItem label="组织机构代码证" prop="orgCode" >
            {{formItem.orgCode}}
          </FormItem>
          <FormItem prop="amount" label="发票金额">
            {{formItem.amount}}
          </FormItem>
          <FormItem label="金额大写" prop="amountCapital" >
            {{formItem.amountCapital}}
          </FormItem>
          <FormItem label="纳税人识别号" prop="taxpayerNo" >
            {{formItem.taxpayerNo}}
          </FormItem>
          <FormItem label="开户银行" prop="bank" >
            {{formItem.bank}}
          </FormItem>
          <FormItem label="开户账号" prop="bankCardNo" >
            {{formItem.bankCardNo}}
          </FormItem>
          <FormItem label="付款单位" prop="payOrg" >
            {{formItem.payOrg}}
          </FormItem>
          <FormItem prop="providerCode" label="收款单位">
            {{formItem.providerName}}
          </FormItem>
          <FormItem prop="billingType" label="开票类型" > 
            {{formItem.billingType}}
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
          invoiceReceiptCode: '',
          projectCode:'',
          projectName:'',
          invoiceDate:'',
          invoiceType:'',
          invoiceNo:'',
          orgCode:'',
          amount:0,
          amountCapital:'',
          taxpayerNo:'',
          bank:'',
          bankCardNo:'',
          payOrg:'',    
          providerCode:'',
          providerName: '',
          billingType: '',
          remark:'',
          files:'',
        },
        oriItem:{

        },
        clickEdit: () => { },
        //验证
        ruleValidate: {
        },
      }
    },
    computed: {
      title() {
        return "查看发票收票信息";
      }, 
    },
    methods: {
      open(arg) {
        this.show = true; 
        this.$refs['argForm'].resetFields(); 
        this.oriItem={
          invoiceReceiptCode: '',
          projectCode:'',
          projectName:'',
          invoiceDate:'',
          invoiceType:'',
          invoiceNo:'',
          orgCode:'',
          amount:0,
          amountCapital:'',
          taxpayerNo:'',
          bank:'',
          bankCardNo:'',
          payOrg:'',    
          providerCode:'',
          providerName: '',
          billingType: '',
          remark:'',
          files:'',};
        if (arg.invoiceReceiptCode) {
          this.oriItem = $.extend({
            invoiceReceiptCode: '',
            projectCode:'',
            projectName:'',
            invoiceDate:'',
            invoiceType:'',
            invoiceNo:'',
            orgCode:'',
            amount:0,
            amountCapital:'',
            taxpayerNo:'',
            bank:'',
            bankCardNo:'',
            payOrg:'',    
            providerCode:'',
            providerName: '',
            billingType: '',
            remark:'',
            files:'',
          },arg);
        }
         if(this.oriItem.invoiceDate!=null){
          this.oriItem.invoiceDate = this.oriItem.invoiceDate.length>=10?this.oriItem.invoiceDate.substring(0,10):this.oriItem.invoiceDate;  
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
