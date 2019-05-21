<template>
  <div class="page expense-edit">
    <div class="page-bar">
      <LayoutHor>
        <div slot="left">
          <Button size="small" @click="goBack" icon="chevron-left" type="warning">返回</Button>
        </div>
        <div class="page-bar-title">{{pageTitle}}</div>
      </LayoutHor>
    </div>
    <Loading :loading="loading">
      <div class="baseinfo"> 
        <div class="subheader">
          单据表头
        </div>
        <Form ref="form" class="page-form" :model="formItem" :rules="formRules" :label-width="120">
          <table cellspacing="0" cellpadding="0">
            <colgroup>
              <col width="33%">
              <col width="auto">
              <col width="33%">
            </colgroup>
            <tr>
              <td>
                <FormItem prop="catalog" label="报销分类"> 
                  <Select v-model="formItem.catalog">
                    <Option v-for="item in catalog" :value="item.code" :key="item.code">{{ item.text }}</Option>
                  </Select>
                </FormItem>
              </td>
              <td>
                <FormItem prop="projectId" label="工程名称">
                  <Input
                    v-model="formItem.projectName"
                    placeholder
                    class="width-1"
                    readonly="readonly"
                    icon="search"
                    @on-click="selProject"
                  />
                </FormItem>
              </td>
              <td>
                <FormItem prop="billDate" label="报销日期">
                   <DatePicker type="date" placeholder="" v-model="formItem.billDate" format="yyyy-MM-dd" ></DatePicker>
                </FormItem>
              </td>
            </tr>
            <tr> 
              <td>
                <FormItem prop="bankOpen" label="开户银行">
                  <Input v-model="formItem.bankOpen"/>
                </FormItem>
              </td>
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
                <FormItem prop="payWay" label="付款方式">
                  <Input v-model="formItem.payWay"/>
                </FormItem>
              </td>
              <td>
                <FormItem prop="legal" label="法律主体">
                  <Input v-model="formItem.legal"/>
                </FormItem>
              </td>
              <td>
                 <FormItem prop="amount" label="报销金额">
                  <Input
                    v-model="formItem.amount"
                    placeholder
                    class="width-1"
                    readonly="readonly"
                  />
                </FormItem>
              </td>
            </tr>
             <tr> 
              <td>
                <FormItem prop="operator" label="经办人">
                  <Input v-model="formItem.operatorName"/>
                </FormItem>
              </td>
              <td>
                <FormItem prop="deptId" label="经办人部门">
                  <Input v-model="formItem.deptName"/>
                </FormItem>
              </td>  
            </tr> 
            <tr>
              <td colspan="3">
                <FormItem prop="files" label="附件">
                  <UploadBox v-model="formItem.files" :readonly="false"></UploadBox>
                </FormItem>
              </td>
            </tr>
            <tr>
              <td colspan="3">
                <FormItem prop="descirbe" label="报销说明">
                  <Input type="textarea" v-model="formItem.descirbe" :rows="3" />
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
          :editable="true"           
          @on-amount-change="onAmountChange"           
        ></Editable>
      </div>
      <table class="savebar" cellpadding="0" cellspacing="0">
        <tr>
          <td class="save" @click="save" v-if="pageFlag<=2">保存</td>
          <td class="reset" @click="reset">重置</td>
          <td></td>
        </tr>
      </table>
    </Loading>
    <!-- <SelInStockApply ref="selInStockApply"></SelInStockApply> -->
    <SelProvider ref="selProvider"></SelProvider>
    <SelProject ref="selProject"></SelProject>
    <SelMember ref="selMember"></SelMember>
  </div>
</template>
<script>
import Loading from '@/components/loading';
import LayoutHor from '@/components/layout/LayoutHor';
import Editable from './DetailEditable';
import page from '@/assets/js/page';
import floatObj from '@/assets/js/floatObj';
import SelStorage from '@/components/storage/input/SelStorage';
import SelProvider from '@/components/provider/SelectProvider';
import SelProject from '@/components/project/SelectProject'
//import SelStockOperType from '@/components/storage/input/SelStockOperType'; 

import SelPersonInput from '@/components/selcontacts/SelPersonInput';
//import SelInStockApply from '@/components/purchase/purchase-order-mgr/SelInStockApply'; 


import SelMember from '@/components/contacts/SelectMember'
import pagejs from '@/assets/js/page';
import UploadBox from '@/components/upload/Index';

export default {
  components: {
    Loading,
    LayoutHor,
    Editable,
    SelStorage, 
    SelPersonInput, 
    SelProvider,
    SelProject,
    SelMember,
    UploadBox
  },
  data() {
    return {
      loading: 0,
      stockBillId: '',
      pageFlag: 1,//1.新建 2.编辑 3.修订
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
        catalog:[
          { required: true, whitespace: true, message: '该项为非空', trigger: 'change' }
        ],
        projectId: [
          { required: true, whitespace: true, message: '该项为非空', trigger: 'change' }
        ],
        billDate:[
          { required: true, whitespace: true, message: '该项为非空', trigger: 'change' }
        ],
        bankOpen:[
          { required: true, whitespace: true, message: '该项为非空', trigger: 'change' }
        ],
        bankAccName:[
          { required: true, whitespace: true, message: '该项为非空', trigger: 'change' }
        ],
        bankAccount:[
          { required: true, whitespace: true, message: '该项为非空', trigger: 'change' }
        ],
        payWay: [
          { required: true, whitespace: true, message: '该项为非空', trigger: 'change' }
        ], 
        legal: [
          { required: true, whitespace: true, message: '该项为非空', trigger: 'change' }
        ], 
        operator: [
          { required: true, whitespace: true, message: '该项为非空', trigger: 'change' }
        ], 
        deptId: [
          { required: true, whitespace: true, message: '该项为非空', trigger: 'change' }
        ]
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
    this.stockBillId = this.$route.query.id;
    if (this.stockBillId) {
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
        return '报销单 - 创建';
      }
      if (this.pageFlag == 2) {
        return '报销单 - 编辑';
      }
    }
  },
  methods: {
    load() {
      this.loading = 1;

      this.$http.post("/api/engine/storage/instock/get?stockBillId=" + this.stockBillId, {}).then((res) => {
        this.loading = 0;
        if (res.data.code == 0) {
          if (res.data.data) {
            this.oriItem = eval('(' + JSON.stringify(res.data.data) + ')');
            Object.assign(this.formItem, res.data.data);
            this.formItem.taxpayerType = this.$args.getArgText('taxpayer_type', this.formItem.taxpayerType);//纳税人类型
            this.formItem.invoiceType = this.$args.getArgText('invoice_type', this.formItem.invoiceType);//发票类型
            this.list = res.data.data.detailList;
            // this.formItem.departmentName = this.$args.getArgText('deptList', this.formItem.department);
            // this.formItem.proposerName = this.$args.getArgText('empList', this.formItem.proposer);
            // this.formItem.receiverName = this.$args.getArgText('empList', this.formItem.receiver);
            // this.formItem.operatorName = this.$args.getArgText('empList', this.formItem.operator);

          } else {
            this.$Message.error('订单不存在！');
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
      });
      this.list = [];
      this.list.push(this.$refs.editable.listNewRow());
      this.list.push(this.$refs.editable.listNewRow());
    },
    save() {
      var form = {
        detailList: []
      };

      Object.assign(form, this.formItem);
      form.signDate = page.formatDate(form.signDate);

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
        if (item.materCode != '') {
          if (item.quantity == 0) {
            this.$Message.error(msg + '请录入数量');
            return;
          }
          if (item.taxUnitPrice == '') {
            this.$Message.error(msg + '请录入含税单价');
            return;
          }
          form.detailList.push(item);
        }
      }

      // 提交
      this.loading = 1;
      var uri = '/api/engine/storage/instock/add';
      if (this.pageFlag == 2) {
        uri = '/api/engine/storage/instock/update';
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
    selProvider(row) {
      var sel = this.$refs.selProvider;//引用该控件，赋值给变量对象
      sel.show({
        ok: (data) => {
          if (data) {
            this.formItem.providerName = data.providerName;
            this.formItem.providerCode = data.providerCode;
            this.formItem.linkMan = data.linkMan;//供应商联系人
            this.formItem.linkPhone = data.linkPhone;//供应商联系电话
            this.formItem.taxpayerType = this.$args.getArgText('taxpayer_type', data.taxpayerType);//纳税人类型
            this.formItem.invoiceType = this.$args.getArgText('invoice_type', data.invoiceType);//发票类型
            this.formItem.taxRate = data.taxRate;//税率 
          }
        }
      });
    },
    selProject(row) {
      var sel = this.$refs.selProject;//引用该控件，赋值给变量对象
      sel.show({
        ok: (data) => {
          if (data) {
            this.formItem.projectName = data.name;
            this.formItem.projectCode = data.projectCode;
          }
        }
      });
    },
    selMember(row) {
      var sel = this.$refs.selMember;//引用该控件，赋值给变量对象
      sel.show({
        ok: (data) => {
          if (data) {
            this.formItem.operator = data.id;
            this.formItem.operatorName = data.trueName;
          }
        }
      });
    },
    onAmountChange(val) {
      this.formItem.amount = val;
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
    goImport() {
      if (!this.formItem.deptId) {
        this.$Message.error("该项为非空仓库");
        return;
      }
      var sel = this.$refs.selInStockApply;
      sel.show({
        deptId: this.formItem.deptId,
        ok: (select) => {
          if (select) {
            this.formItem.inStockApplyId = select.inStockApplyId;
            this.formItem.purchaseOrderId = select.purchaseOrderId;
            this.formItem.proposerName = this.$args.getArgText('empList', select.proposer);
            this.formItem.proposer = select.proposer;
            this.formItem.departmentName = this.$args.getArgText('deptList', select.department);
            this.formItem.department = select.department;
            this.list = [];
            select.detailList.map((row) => {
              var newRow = this.$refs.editable.listNewRow();
              row.subQuantity = floatObj.multiply(row.quantity, row.unitRate);
              this.list.push(Object.assign(newRow, row));
            });
          }
        }
      });
    }
  }
}

</script>

<style type="text/css">
.expense-edit.page {
  width: 900px;
  /* margin: 0 auto; */
  padding: 10px 20px;
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

.expense-edit .savebar {
  margin-top: 10px;
  height: 40px;
  width: 100%;
  border-collapse: collapse;
}
.expense-edit .savebar td {
  border: 1px solid #fefefe;
  font-size: 14px;
}
.expense-edit .savebar .save {
  width: 120px;
  border: 1px solid #20bfee;
  background-color: #20bfee;
  color: white;
  text-align: center;
  cursor: pointer;
}
.expense-edit .savebar .reset {
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

.expense-edit .tooltip {
  padding: 10px;
  background-color: #fafafa;
  border: 1px solid #efefef;
  border-radius: 3px;
  color: #666;
  margin-top: 10px;
}
</style>
