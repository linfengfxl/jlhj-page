<template>
  <StartProcess ref="startProcess" :defineId="9" :title="pageTitle" @on-submit="save">
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
                <FormItem prop="deptName" label="申请部门">
                  <SelectDept v-model="formItem.deptId" :model="formItem" :text="formItem.deptName" />
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
                <FormItem prop="reverseType" label="备用金类型"> 
                  <Select v-model="formItem.reverseType" >
                    <Option v-for="item in reverseType" :value="item.code" :key="item.code">{{ item.text }}</Option>
                  </Select>
                </FormItem>
              </td>
              <td>
                <FormItem prop="offsetDate" label="预计冲销日期">
                   <DatePicker type="date" placeholder="" v-model="formItem.offsetDate" format="yyyy-MM-dd" 
                   style="width:100%;"></DatePicker>
                </FormItem>
              </td>
            </tr>
            <tr>
              <td>
                <FormItem prop="payee" label="收款人">
                  <Input v-model="formItem.payee"/>
                </FormItem>
              </td>
              <td>
                <FormItem prop="bankOpen" label="开户银行"> 
                  <Input v-model="formItem.bankOpen"/>
                </FormItem>
              </td> 
            </tr>
            <tr>  
             <td>
                <FormItem prop="bankAccName" label="银行户名"> 
                  <Input v-model="formItem.bankAccName"/>
                </FormItem>
              </td> 
              <td>
                <FormItem prop="bankAccount" label="银行账号"> 
                  <Input v-model="formItem.bankAccount"/>
                </FormItem>
              </td>  
            </tr> 
            <tr> 
              <td>
                <FormItem prop="amount" label="金额">
                   <InputNumber
                      style="width:100%;"
                      :max="9999999999"              
                      :min="0"               
                      v-model="formItem.amount"
                    ></InputNumber>
                </FormItem>
              </td> 
              <td>
                <FormItem prop="payWay" label="付款方式">
                  <Select v-model="formItem.payWay">
                    <Option v-for="item in $args.getArgGroup('pay_way')" :value="item.argCode" :key="item.argCode">{{ item.argText }}</Option>
                  </Select>
                </FormItem>
              </td> 
            </tr> 
            <tr>
              <td>
                <FormItem prop="legalSubject" label="法律主体">
                  <Select v-model="formItem.legalSubject">
                    <Option v-for="item in $args.getArgGroup('legal_subject')" :value="item.argCode" :key="item.argCode">{{ item.argText }}</Option>
                  </Select>
                </FormItem>
              </td>   
              <td>
                <FormItem prop="finalPaymentDate" label="最后付款日期">
                   <DatePicker type="date" placeholder="" v-model="formItem.finalPaymentDate" format="yyyy-MM-dd" 
                   style="width:100%;"></DatePicker>
                </FormItem>
              </td>
            </tr>
            <tr>
              <td colspan="2">
                <FormItem prop="reserveUse" label="备用金用途"> 
                  <Input v-model="formItem.reserveUse"/>
                </FormItem>
              </td>
            </tr>
            <tr>
              <td colspan="2">
                <FormItem prop="files" label="附件">
                  <UploadBox v-model="formItem.files" :readonly="false"></UploadBox>
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
    SelectMember,
    page
  },
  data() {
    return {
      loading: 0,
      pageFlag: 1,//1.新建 2.编辑 3.修订
      formItem: {
        reserveApplyId:'',
        applyDeptId:'',
        applyDeptName:'',
        deptId:'',
        deptName:'',
        applicant:0,
        applicantName:'',
        operator:0,
        operatorName:'',
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
        deptName:[
          { required: true, whitespace: true, message: '该项为非空', trigger: 'change' }
        ],
        operatorName:[
          { required: true,whitespace: true, message: '该项为非空', trigger: 'change' }
        ],
        reverseType:[
          { required: true, whitespace: true, message: '该项为非空', trigger: 'change' }
        ],
        offsetDate:[
          { required: true,  message: '该项为非空', trigger: 'change', pattern: /.+/ }
        ],
        payWay:[
          { required: true, whitespace: true, message: '该项为非空', trigger: 'change' }
        ],
        legalSubject:[
          { required: true, whitespace: true, message: '该项为非空', trigger: 'change' }
        ],
        finalPaymentDate:[
          { required: true,  message: '该项为非空', trigger: 'change', pattern: /.+/ }
        ],
        files:[
          {}
        ],
      },
      reserveApplyId:'',
      oriItem: {},
      reverseType:[
        {code:'临时备用金',text:'临时备用金'},
        {code:'定额备用金',text:'定额备用金'},
        {code:'特殊备用金',text:'特殊备用金'},
      ],
    }
  },
  mounted: function () {
    this.reserveApplyId = this.$route.query.id;
    if (this.reserveApplyId) {
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
        return '备用金申请';
      }
      if (this.pageFlag == 2) {
        return '备用金申请 - 重新发起';
      }
    }
  },
  methods: {
    load() {
      this.loading = 1;
      this.$http.post("/api/engine/financial/reserve/get", {reserveApplyId:this.reserveApplyId}).then((res) => {
        this.loading = 0;
        if (res.data.code == 0) {
          if (res.data.data) {
            res.data.data.operator=res.data.data.applicant;
            res.data.data.deptId=res.data.data.applyDeptId;
            res.data.data.operatorName=res.data.data.applicantName;
            res.data.data.deptName=res.data.data.applyDeptName;
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
        deptId:'',
        deptName:'',
        applicant:0,
        applicantName:'',
        operator:0,
        operatorName:'',
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
      this.formItem.operator=this.$user.userId;
      this.formItem.operatorName=this.$user.trueName;
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
      if (form.files==null||form.files=="") {
        this.$Message.error('请上传附件！');
        return;
      }
      form.applicant = form.operator;
      form.applicantName = form.operatorName;
      form.applyDeptId = form.deptId;
      form.offsetDate = page.formatDate(form.offsetDate);
      form.finalPaymentDate = page.formatDate(form.finalPaymentDate);
      form.proc = proc.formItem;

      // 提交
      this.loading = 1;
      var uri = '/api/engine/financial/reserve/start';
      if (this.pageFlag == 2) {
        uri = '/api/engine/financial/reserve/restart';
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
