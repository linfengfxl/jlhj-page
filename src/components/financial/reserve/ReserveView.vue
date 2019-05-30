<template>
  <ViewProcess ref="ViewProcess" :instId="instId" :title="title" @on-load="instLoaded" @on-submit="save">
    <div class="page expense-edit">     
    <Loading :loading="loading">
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
                <FormItem prop="applyDeptId" label="申请部门">
                  {{formItem.applyDeptName}}
                </FormItem>
              </td> 
              <td>
                <FormItem prop="applicant" label="申请人">
                  {{formItem.applicantName}}
                </FormItem>
              </td>
            </tr>
            <tr>
              <td>
                <FormItem prop="reverseType" label="备用金类型"> 
                  {{formItem.reverseType}}
                </FormItem>
              </td>
              <td>
                <FormItem prop="offsetDate" label="预计冲销日期">
                   {{formItem.offsetDate}}
                </FormItem>
              </td>
            </tr>
            <tr>
              <td>
                <FormItem prop="payee" label="收款人">
                  {{formItem.payee}}
                </FormItem>
              </td>
              <td>
                <FormItem prop="bankOpen" label="开户银行"> 
                  {{formItem.bankOpen}}
                </FormItem>
              </td> 
            </tr>
            <tr>  
             <td>
                <FormItem prop="bankAccName" label="银行户名"> 
                  {{formItem.bankAccName}}
                </FormItem>
              </td> 
              <td>
                <FormItem prop="bankAccount" label="银行账号"> 
                  {{formItem.bankAccount}}
                </FormItem>
              </td>  
            </tr> 
            <tr> 
              <td>
                <FormItem prop="amount" label="金额">
                  {{formItem.amount}}
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
                <FormItem prop="finalPaymentDate" label="最后付款日期">
                   {{formItem.finalPaymentDate}}
                </FormItem>
              </td>
            </tr>
            <tr>
              <td colspan="2">
                <FormItem prop="reserveUse" label="备用金用途"> 
                  {{formItem.reserveUse}}
                </FormItem>
              </td>
            </tr>
            <tr>
              <td colspan="2">
                <FormItem prop="files" label="附件">
                  <UploadBox v-model="formItem.files" :readonly="true"></UploadBox>
                </FormItem>
              </td> 
            </tr>
          </table>
        </Form>
      </div>  
    </Loading>
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
      title:'备用金申请单',
      loading: 0,
      instId:0,    
      formItem: {
        reserveApplyId:'',
        applyDeptId:'',
        applyDeptName:'',
        applicant:0,
        applicantName:'',
        reverseType:'',
        offsetDate:'',
        payee:'',
        bankOpen:'',
        bankAccName:'',
        bankAccount:'',
        amount:0,
        payWay:'',
        legalSubject:'',
        finalPaymentDate:'',
        reserveUse:'',
        files:'',
        status:0,
        instId:0
      },
      formRules: {
         
      },
      reserveApplyId:'',
      oriItem: {},
    }
  },
  mounted: function () { 
    this.instId = this.$route.query.inst;    
  },
  computed: {     
  },
  methods: {
    instLoaded(proc){ 
      this.reserveApplyId = proc.instance.businessKey;
      this.title = "备用金申请单_" + this.reserveApplyId;
      this.load();
    },
    load() {
      this.loading = 1;

      this.$http.post("/api/engine/financial/reserve/get", {reserveApplyId:this.reserveApplyId}).then((res) => {
        this.loading = 0;
        if (res.data.code == 0) {
          if (res.data.data) {
            res.data.data.offsetDate=res.data.data.offsetDate.length>=10?res.data.data.offsetDate.substring(0,10):res.data.data.offsetDate;
            res.data.data.finalPaymentDate=res.data.data.finalPaymentDate.length>=10?res.data.data.finalPaymentDate.substring(0,10):res.data.data.finalPaymentDate; 
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
        reserveApplyId:'',
        applyDeptId:'',
        applyDeptName:'',
        applicant:0,
        applicantName:'',
        reverseType:'',
        offsetDate:page.formatDate(new Date(),'yyyy-MM-dd'),
        payee:'',
        bankOpen:'',
        bankAccName:'',
        bankAccount:'',
        amount:0,
        payWay:'',
        legalSubject:'',
        finalPaymentDate:page.formatDate(new Date(),'yyyy-MM-dd'),
        reserveUse:'',
        files:'',
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
      var uri = '/api/engine/financial/reserve/submit';

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
