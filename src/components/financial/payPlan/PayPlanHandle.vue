<template>
  <HandleProcess ref="handleProcess" :instId="instId" :title="title" :loading="loading" @on-load="instLoaded" @on-submit="save">
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
                <FormItem prop="payPlanName" label="付款计划名称"> 
                  {{formItem.payPlanName}}
                </FormItem>
              </td>
              <td>
                <FormItem label="供应商" prop="providerCode">
                  {{formItem.providerName}}
                </FormItem>
              </td>
            </tr>
            <tr>
              <td>
                <FormItem label="供应商联系人" prop="linkMan">
                  {{formItem.linkMan}}
                </FormItem>
              </td>
               <td>
                <FormItem prop="amount" label="发生额">
                  {{formItem.amount}}
                </FormItem>
              </td>
            </tr>
            <tr>  
              <td>
                <FormItem prop="acumPayAmount" label="累计付款额">
                  {{formItem.acumPayAmount}}
                </FormItem>
              </td>
              <td>
                <FormItem prop="payableAmount" label="应付金额">
                  {{formItem.payableAmount}}
                </FormItem>
              </td>    
            </tr> 
             <tr> 
               <td>
                <FormItem prop="payableType" label="应付类型"> 
                  {{formItem.payableType}}
                </FormItem>
              </td>
              <td>
                <FormItem prop="currentPayableAmount" label="本期应付款额">
                  {{formItem.currentPayableAmount}}
                </FormItem>
              </td>    
            </tr> 
            <tr>
               <td>
                <FormItem prop="currentPlanAmount" label="本期计划付款额">
                  {{formItem.currentPlanAmount}}
                </FormItem>
              </td>
               <td>
                <FormItem prop="contractPayType" label="合同付款方式"> 
                  {{formItem.contractPayType}}
                </FormItem>
              </td>
            </tr>
            <tr>
              <td>
                <FormItem prop="contractBillPeriod" label="合同账期（%）">
                  {{formItem.contractBillPeriod}}
                </FormItem>
              </td>
               <td>
                <FormItem prop="operatorName" label="申请人">
                  {{formItem.applicantName}}
                </FormItem>
              </td>   
            </tr>
            <tr>
              <td>
                <FormItem prop="deptId" label="申请部门">
                   {{formItem.deptName}}
                </FormItem>
              </td>   
              <td>
                <FormItem prop="planYear" label="计划年度">
                  {{formItem.planYear}}
                </FormItem>
              </td> 
            </tr>
            <tr>
              <td>
                <FormItem prop="planMonth" label="计划月份">
                  {{formItem.planMonth}}
                </FormItem>
              </td>     
            </tr>
          </table>
        </Form>
      </div>
</HandleProcess>  
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

import HandleProcess from '@/components/workflow/process/Handle';

export default {
  components: {
    Loading,
    LayoutHor,     
    UploadBox,
    SelectProject,
    SelectDept,
    HandleProcess
  },
  data() {
    return {
      title:'付款计划',
      loading: 0,
      instId:0,     
      formItem: {
        payPlanId:'',
        payPlanName:'',
        providerCode:'',
        providerName:'',
        linkMan:'',
        amount:0,
        acumPayAmount:0,
        payableAmount:0,
        payableType:'',
        currentPayableAmount:0,
        currentPlanAmount:0,
        contractPayType:'',
        contractBillPeriod:'',
        applyDeptId:'',
        applyDeptName:'',
        deptId:'',
        deptName:'',
        applicant:'',
        applicantName:'',
        planYear:'',
        planMonth:'',
        operator:'',
        operatorName:'',
        status:0,
        instId:0
      },
      formRules: {
         
      },
      payPlanId:'',
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
      this.payPlanId = proc.instance.businessKey;
      this.title = "付款计划_" + this.payPlanId;
      this.load();
    },
    load() {
      this.loading = 1;

      this.$http.post("/api/engine/financial/payPlan/get", {payPlanId:this.payPlanId}).then((res) => {
        this.loading = 0;
        if (res.data.code == 0) {
          if (res.data.data) {
            res.data.data.operator=res.data.data.applicant;
            res.data.data.operatorName=res.data.data.applicantName;
            res.data.data.deptId=res.data.data.applyDeptId;
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
        payPlanId:'',
        payPlanName:'',
        providerCode:'',
        providerName:'',
        linkMan:'',
        amount:0,
        acumPayAmount:0,
        payableAmount:0,
        payableType:'',
        currentPayableAmount:0,
        currentPlanAmount:0,
        contractPayType:'',
        contractBillPeriod:'',
        applyDeptId:'',
        applyDeptName:'',
        deptId:'',
        deptName:'',
        applicant:'',
        applicantName:'',
        planYear:'',
        planMonth:'',
        operator:'',
        operatorName:'',
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
      var uri = '/api/engine/financial/payPlan/submit';

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
