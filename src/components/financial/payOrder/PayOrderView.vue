<template>
  <ViewProcess ref="ViewProcess" :instId="instId" :title="title" :loading="loading" @on-load="instLoaded" @on-submit="save">
      <div class="baseinfo"> 
        <div class="subheader">
          单据表头
        </div>
        <Form ref="form" class="page-form page-form-view" :model="formItem" :rules="formRules" :label-width="120">
           <table cellspacing="0" cellpadding="0">
            <colgroup>
              <col width="50%">
              <col width="50%">
            </colgroup>
            <tr>
              <td>
                <FormItem prop="fundsPlan" label="资金计划类型"> 
                  {{formItem.fundsPlan}}
                </FormItem>
              </td>
              <td>
                <FormItem prop="payType" label="付款分类"> 
                  {{formItem.payType}}
                </FormItem>
              </td>
            </tr>
            <tr>
              <td>
                <FormItem prop="payDate" label="付款日期">
                   {{formItem.payDate}}
                </FormItem>
              </td>
              <td>
                <FormItem prop="projectCode" label="工程名称"> 
                  {{formItem.projectName}}
                </FormItem>
              </td>
            </tr>
            <tr>  
              <td>
                <FormItem label="供应商" prop="providerCode">
                  {{formItem.providerName}}
                </FormItem>
              </td>
             <td>
                <FormItem prop="bank" label="开户银行"> 
                  {{formItem.bank}}
                </FormItem>
              </td> 
            </tr> 
             <tr> 
               <td>
                <FormItem prop="bankAccount" label="银行户名"> 
                  {{formItem.bankAccount}}
                </FormItem>
              </td> 
              <td>
                <FormItem prop="bankCardNo" label="开户账号"> 
                  {{formItem.bankCardNo}}
                </FormItem>
              </td>    
            </tr> 
            <tr>
               <td>
                <FormItem prop="amount" label="付款金额">
                    {{formItem.amount}}
                </FormItem>
              </td>
               <td>
                <FormItem prop="amountCapital" label="付款金额大写"> 
                  {{formItem.amountCapital}}
                </FormItem>
              </td>
            </tr>
            <tr>
              <td>
                <FormItem prop="operatorName" label="经办人">
                  {{formItem.operatorName}}
                </FormItem>
              </td>
               <td>
                <FormItem prop="payWay" label="付款方式">
                  {{formItem.payWay}}
                </FormItem>
              </td>  
            </tr>
            <tr>
               <td>
                <FormItem prop="legalSubject" label="法律主体">
                  {{formItem.legalSubject}}
                </FormItem>
              </td>    
              <td>
                <FormItem prop="payDesc" label="付款说明">
                  {{formItem.payDesc}}
                </FormItem>
              </td> 
            </tr>
          </table>
        </Form>
      </div>  
</ViewProcess>  
</template>
<script>
import Loading from '@/components/loading';
import LayoutHor from '@/components/layout/LayoutHor';
import page from '@/assets/js/page';
import floatObj from '@/assets/js/floatObj'; 
import pagejs from '@/assets/js/page';
import UploadBox from '@/components/upload/Index';
import SelectProject from '@/components/page/form/SelectProject';
import SelectDept from '@/components/page/form/SelectDept';
import ViewProcess from '@/components/workflow/process/View';

export default {
  components: {
    Loading,
    LayoutHor,     
    UploadBox,
    SelectProject,
    SelectDept,
    ViewProcess
  },
  data() {
    return {
      title:'报销单',
      loading: 0,
      instId:0,
      stockBillId: '',       
      formItem: {
        payOrderId:'',
        fundsPlan:'',
        payType:'',
        payDate:'',
        projectCode:'',
        projectName:'',
        providerCode:'',
        providerName:'',
        bank:'',
        bankAccount:'',
        bankCardNo:'',
        amount:0,
        amountCapital:'',
        operatorName:'',
        payWay:'',
        legalSubject:'',
        payDesc:'',
        status:0,
        instId:0
      },
      formRules: {
         
      },
      list: [],
      payOrderId:'',
      oriItem: {},
      storage: [],
    }
  },
  mounted: function () { 
    this.instId = this.$route.query.inst;    
  },
  computed: {     
  },
  methods: {
    instLoaded(proc){ 
      this.payOrderId = proc.instance.businessKey;
      this.title = "付款单_" + this.payOrderId;
      this.load();
    },
    load() {
      this.loading = 1;

      this.$http.post("/api/engine/financial/payOrder/get", {payOrderId:this.payOrderId}).then((res) => {
        this.loading = 0;
        if (res.data.code == 0) {
          if (res.data.data) {
            res.data.data.payDate=res.data.data.payDate.length>=10?res.data.data.payDate.substring(0,10):res.data.data.payDate; 
            this.oriItem = eval('(' + JSON.stringify(res.data.data) + ')');
            Object.assign(this.formItem, res.data.data);          
          } else {
            this.$Message.error('单据不存在！');
            this.goBack();
          }
        } else {
          this.$Message.error(res.data.message);
        }
      }).catch((error) => {
        this.loading = 0;
        this.$Message.error("操作失败！")
      });
    },
    initNew() {
      Object.assign(this.formItem, {
        payOrderId:'',
        fundsPlan:'',
        payType:'',
        payDate:'',
        projectCode:'',
        projectName:'',
        providerCode:'',
        providerName:'',
        bank:'',
        bankAccount:'',
        bankCardNo:'',
        amount:0,
        amountCapital:'',
        operatorName:'',
        payWay:'',
        legalSubject:'',
        payDesc:'',
        status:0,
        instId:0
      });
    },
    save(proc) {
      var form = {};

      Object.assign(form, this.formItem);

      var pass = true;
      this.$refs.form.validate((valid) => {
        pass = valid;
      })

      if (!pass) {
        this.$Message.error('验证未通过！');
        return;
      }

      form.proc = proc.formItem;

      // 提交
      this.loading = 1;
      var uri = '/api/engine/financial/payOrder/submit';

      this.$http.post(uri, form).then((res) => {
        this.loading = 0;
        if (res.data.code == 0) {
          this.$Message.success("操作成功！");
          this.goBack();
        } else {
          this.$Message.error(res.data.message);
        }
      }).catch((error) => {
        this.loading = 0;
        this.$Message.error("请求失败，请重新操作")
      });
    },  
    reset() {
      Object.assign(this.formItem, this.oriItem);
    },
    goBack() {
      this.$router.go(-1);
    },
  }
}

</script>

<style type="text/css">
.expense-edit.page {
  position: relative;
}
.expense-edit .subheader {
  height: 34px;
  line-height: 34px;
  font-size: 14px;
  border-bottom: 0px solid #efefef;
  margin-bottom: 10px;
  color: #20bfee;
}
.expense-edit .baseinfo {
}
.expense-edit .baseinfo .label {
  width: 80px;
  text-align: right;
  padding-right: 8px;
}
.expense-edit .baseinfo table {
  width: 100%;
}
.expense-edit .baseinfo table td {
  height: 40px;
  padding-right: 4px;
} 

.selectinput {
  cursor: pointer;
}

.expense-edit .tooltip {
  padding: 10px;
  background-color: #fafafa;
  border: 1px solid #efefef;
  border-radius: 3px;
  color: #666;
  margin-top: 10px;
}
</style>
