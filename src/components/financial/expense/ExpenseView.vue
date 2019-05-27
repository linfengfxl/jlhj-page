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
              <col width="33%">
              <col width="auto">
              <col width="33%">
            </colgroup>
            <tr>
              <td>
                <FormItem prop="catalog" label="报销分类"> 
                  {{formItem.catalog}}
                </FormItem>
              </td>
              <td>
                <FormItem prop="projectId" label="工程名称"> 
                  {{formItem.projectName}}
                </FormItem>
              </td>
              <td>
                <FormItem prop="billDate" label="报销日期">
                  {{formItem.billDate}}
                </FormItem>
              </td>
            </tr>
            <tr> 
              <td>
                <FormItem prop="bankOpen" label="开户银行">
                  {{formItem.bankOpen}}
                </FormItem>
              </td>
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
                <FormItem prop="payWay" label="付款方式">
                  {{formItem.payWay}}
                </FormItem>
              </td>
              <td>
                <FormItem prop="legal" label="法律主体">
                  {{formItem.legal}}
                </FormItem>
              </td>
              <td>
                 <FormItem prop="amount" label="报销金额">
                  {{formItem.amount}}
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
                <FormItem prop="deptId" label="经办人部门">
                  {{formItem.deptName}}
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
            <tr>
              <td colspan="3">
                <FormItem prop="describe" label="报销说明">
                  {{formItem.describe}}
                </FormItem>
              </td>
            </tr>
          </table>
        </Form>
      </div>
      <div>
        <div class="subheader">单据明细</div>         
        <Editable
          ref="editable"
          :list="list"
          :editable="false"
          @on-amount-change="onAmountChange"           
        ></Editable>
      </div>       
    </Loading>
  </div>
</ViewProcess>  
</template>
<script>
import Loading from '@/components/loading';
import LayoutHor from '@/components/layout/LayoutHor';
import Editable from './DetailEditable';
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
    Editable,     
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
        billId:'',
        catalog:'',
        projectId:'',
        projectName:'',
        billDate:'',
        amount:'',
        bankAccName:'',
        bankOpen:'',
        bankAccount:'',
        operator:'',
        operatorName:'',
        deptId:'',
        deptName:'',
        payWay:'',
        legal:'',
        files:'',
        describe:'',
        status:0,
        instId:0
      },
      formRules: {
         
      },
      list: [],
      oriItem: {},
      storage: [],
      catalog:[
        {code:'生产类',text:'生产类'},
        {code:'行政类',text:'行政类'},
        {code:'财务类',text:'财务类'},
        {code:'伙食类',text:'伙食类'},
        {code:'业务招待费',text:'业务招待费'},
        {code:'其他类',text:'其他类'}
      ]
    }
  },
  mounted: function () { 
    this.instId = this.$route.query.inst;    
  },
  computed: {     
  },
  methods: {
    instLoaded(proc){ 
      this.billId = proc.instance.businessKey;
      this.title = "报销单_" + this.billId;
      this.load();
    },
    load() {
      this.loading = 1;

      this.$http.post("/api/engine/financial/expense/get?billId=" + this.billId, {}).then((res) => {
        this.loading = 0;
        if (res.data.code == 0) {
          if (res.data.data) {            
            this.oriItem = eval('(' + JSON.stringify(res.data.data) + ')');
            Object.assign(this.formItem, res.data.data);             
            this.list = res.data.data.detailList;
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
        billId:'',
        catalog:'',
        projectId:'',
        projectName:'',
        billDate:null,
        amount:'',
        bankAccName:'',
        bankOpen:'',
        bankAccount:'',
        operator:'',
        operatorName:'',
        deptId:'',
        deptName:'',
        payWay:'',
        legal:'',
        files:'',
        describe:'',
        status:0,
        instId:0
      });
      this.list = [];
      this.list.push(this.$refs.editable.listNewRow());
      this.list.push(this.$refs.editable.listNewRow());
    },
    save(proc) {
      var form = {
        detailList: []
      };

      Object.assign(form, this.formItem);
      form.billDate = page.formatDate(form.billDate);

      var pass = true;
      this.$refs.form.validate((valid) => {
        pass = valid;
      })

      if (!pass) {
        this.$Message.error('验证未通过！');
        return;
      }

      form.detailList = [];
      // 明细
      for (var i = 0; i < this.list.length; i++) {
        var item = this.list[i];
        var msg = '明细第 ' + (i + 1) + ' 行，';
        if (item.amount > 0) {
          if (item.feeType == '' || item.feeType == null) {
            this.$Message.error(msg + '请选择费用类型');
            return;
          }
          form.detailList.push(item);
        }
      }

      form.proc = proc.formItem;

      // 提交
      this.loading = 1;
      var uri = '/api/engine/financial/expense/submit';

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
    onAmountChange(val) {
      this.formItem.amount = val;
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
