<template>
  <StartProcess ref="startProcess" defineId="4" :title="pageTitle" @on-submit="save">
    <div class="page payPlan-edit">     
    <Loading :loading="loading">
      <div class="baseinfo"> 
        <div class="subheader">
          单据表头
        </div>
        <Form ref="form" class="page-form" :model="formItem" :rules="formRules" :label-width="120">
          <table cellspacing="0" cellpadding="0">
            <colgroup>
              <col width="50%">
              <col width="50%">
            </colgroup>
            <tr>
              <td>
                <FormItem prop="payPlanName" label="付款计划名称"> 
                  <Input v-model="formItem.payPlanName"/>
                </FormItem>
              </td>
              <td>
                <FormItem label="供应商" prop="providerCode">
                  <Input
                    v-model="formItem.providerName"
                    placeholder
                    class="width-1"
                    readonly="readonly"
                    icon="search"
                    @on-click="selProvider"
                  />
                </FormItem>
              </td>
            </tr>
            <tr>
              <td>
                <FormItem label="供应商联系人" prop="linkMan">
                  <Input v-model="formItem.linkMan" readonly="readonly"/>
                </FormItem>
              </td>
               <td>
                <FormItem prop="amount" label="发生额">
                   <InputNumber
                      style="width:100%;"
                      :max="9999999999"              
                      :min="0"               
                      v-model="formItem.amount"
                    ></InputNumber>
                </FormItem>
              </td>
            </tr>
            <tr>  
              <td>
                <FormItem prop="acumPayAmount" label="累计付款额">
                   <InputNumber
                      style="width:100%;"
                      :max="9999999999"              
                      :min="0"               
                      v-model="formItem.acumPayAmount"
                    ></InputNumber>
                </FormItem>
              </td>
              <td>
                <FormItem prop="payableAmount" label="应付金额">
                   <InputNumber
                      style="width:100%;"
                      :max="9999999999"              
                      :min="0"               
                      v-model="formItem.payableAmount"
                    ></InputNumber>
                </FormItem>
              </td>    
            </tr> 
             <tr> 
               <td>
                <FormItem prop="payableType" label="应付类型"> 
                  <Select v-model="formItem.payableType">
                    <Option v-for="item in payableType" :value="item.code" :key="item.code">{{ item.text }}</Option>
                  </Select>
                </FormItem>
              </td>
              <td>
                <FormItem prop="currentPayableAmount" label="本期应付款额">
                   <InputNumber
                      style="width:100%;"
                      :max="9999999999"              
                      :min="0"               
                      v-model="formItem.currentPayableAmount"
                    ></InputNumber>
                </FormItem>
              </td>    
            </tr> 
            <tr>
               <td>
                <FormItem prop="currentPlanAmount" label="本期计划付款额">
                   <InputNumber
                      style="width:100%;"
                      :max="9999999999"              
                      :min="0"               
                      v-model="formItem.currentPlanAmount"
                    ></InputNumber>
                </FormItem>
              </td>
               <td>
                <FormItem prop="contractPayType" label="合同付款方式"> 
                  <Input v-model="formItem.contractPayType"/>
                </FormItem>
              </td>
            </tr>
            <tr>
              <td>
                <FormItem prop="contractBillPeriod" label="合同账期（%）">
                  <Input v-model="formItem.contractBillPeriod"/>
                </FormItem>
              </td>
               <td>
                <FormItem prop="operatorName" label="申请人">
                  <SelectMember
                    v-model="formItem.operator"
                    :model="formItem"
                    :text="formItem.operatorName"
                  />
                </FormItem>
              </td>   
            </tr>
            <tr>
              <td>
                <FormItem prop="deptId" label="申请部门">
                  <SelectDept v-model="formItem.deptId" :model="formItem" :text="formItem.deptName" />
                </FormItem>
              </td>   
              <td>
                <FormItem prop="planYear" label="计划年度">
                  <Input v-model="formItem.planYear"/>
                </FormItem>
              </td> 
            </tr>
            <tr>
              <td>
                <FormItem prop="planMonth" label="计划月份">
                  <Input v-model="formItem.planMonth"/>
                </FormItem>
              </td>     
            </tr>
          </table>
        </Form>
      </div>
       <SelProvider ref="selProvider" :transfer="false"></SelProvider>      
    </Loading>
  </div>
</StartProcess>  
</template>
<script>
import Loading from '@/components/loading';
import LayoutHor from '@/components/layout/LayoutHor';
import page from '@/assets/js/page';
import floatObj from '@/assets/js/floatObj'; 
import pagejs from '@/assets/js/page';
import UploadBox from '@/components/upload/Index';
import SelProvider from '@/components/provider/SelectProvider';
import SelectProject from '@/components/page/form/SelectProject';
import SelectDept from '@/components/page/form/SelectDept';
import SelectMember from '@/components/page/form/SelectMember';

import StartProcess from '@/components/workflow/process/Start';

export default {
  components: {
    Loading,
    LayoutHor,    
    UploadBox,
    SelectProject,
    SelectDept,
    StartProcess,
    SelProvider,
    SelectMember
  },
  data() {
    return {
      loading: 0,
      pageFlag: 1,//1.新建 2.编辑 3.修订
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
        applicant:0,
        applicantName:'',
        planYear:'',
        planMonth:'',
        operator:0,
        operatorName:'',
        status:0,
        instId:0
      },
      formRules: {
        payPlanName:[
          { required: true, whitespace: true, message: '该项为非空', trigger: 'change' }
        ],
      },
      payPlanId:'',
      oriItem: {},
      payableType:[
        {code:'陈欠',text:'陈欠'},
        {code:'新欠',text:'新欠'},
      ]
    }
  },
  mounted: function () {
    this.payPlanId = this.$route.query.id;
    if (this.payPlanId) {
      this.pageFlag = 2;
      this.load();
    } else {
      this.pageFlag = 1;
      this.initNew();
    }
  },
  computed: {
    pageTitle() {
      if (this.pageFlag == 1) {
        return '付款计划';
      }
      if (this.pageFlag == 2) {
        return '付款计划 - 重新发起';
      }
    }
  },
  methods: {
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
        deptId:'',
        deptName:'',
        applicant:0,
        applicantName:'',
        operator:0,
        operatorName:'',
        planYear:'',
        planMonth:'',
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
      form.applicant = form.operator;
      form.applicantName = form.operatorName;
      form.applyDeptId = form.deptId;
      form.proc = proc.formItem;

      // 提交
      this.loading = 1;
      var uri = '/api/engine/financial/payPlan/start';
      if (this.pageFlag == 2) {
        uri = '/api/engine/financial/payPlan/restart';
      }

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
    selProvider() {
      var sel = this.$refs.selProvider;
      sel.show({
        ok: (data) => {
          if (data) {
            this.formItem.providerCode = data.providerCode;
            this.formItem.providerName = data.providerName;
            this.formItem.linkMan = data.linkMan;
          }
        }
      });
    },
    reset() {
      if (this.pageFlag == 1) {
        this.initNew();
      } else {
        Object.assign(this.formItem, this.oriItem);
      }
    },
    goBack() {
      this.$router.go(-1);
    },
  }
}

</script>

<style type="text/css">
.payPlan-edit.page {
  position: relative;
}
.payPlan-edit .subheader {
  height: 34px;
  line-height: 34px;
  font-size: 14px;
  border-bottom: 0px solid #efefef;
  margin-bottom: 10px;
  color: #20bfee;
}
.payPlan-edit .baseinfo {
}
.payPlan-edit .baseinfo .label {
  width: 80px;
  text-align: right;
  padding-right: 8px;
}
.payPlan-edit .baseinfo table {
  width: 100%;
}
.payPlan-edit .baseinfo table td {
  height: 40px;
  padding-right: 4px;
}

.payPlan-edit .savebar {
  margin-top: 10px;
  height: 40px;
  width: 100%;
  border-collapse: collapse;
}
.payPlan-edit .savebar td {
  border: 1px solid #fefefe;
  font-size: 14px;
}
.payPlan-edit .savebar .save {
  width: 120px;
  border: 1px solid #20bfee;
  background-color: #20bfee;
  color: white;
  text-align: center;
  cursor: pointer;
}
.payPlan-edit .savebar .reset {
  width: 60px;
  border: 1px solid #a1e7f8;
  background-color: #a1e7f8;
  color: white;
  text-align: center;
  cursor: pointer;
}

.selectinput {
  cursor: pointer;
}

.payPlan-edit .tooltip {
  padding: 10px;
  background-color: #fafafa;
  border: 1px solid #efefef;
  border-radius: 3px;
  color: #666;
  margin-top: 10px;
}
</style>
