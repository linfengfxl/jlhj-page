<template>
  <StartProcess ref="startProcess" defineId="5" :title="pageTitle" @on-submit="save">
    <div class="page instock-edit">
      <Loading :loading="loading">
        <div class="baseinfo">
          <div class="page-tools"></div>
          <Form
            ref="form"
            class="page-form"
            :model="formItem"
            :rules="formRules"
            :label-width="120"
          >
            <table cellspacing="0" cellpadding="0">
              <colgroup>
                <col width="33%">
                <col width="auto">
                <col width="33%">
              </colgroup>
              <tr>
                <td>
                  <FormItem prop="deptId" label="部门">
                    <SelStorage v-model="formItem.deptId" :model="formItem"></SelStorage>
                  </FormItem>
                </td>
                <td>
                  <FormItem prop="billDate" label="结算日期">
                    <Date-picker
                      type="date"
                      placeholder="选择日期"
                      v-model="formItem.billDate"
                      format="yyyy-MM-dd"
                    ></Date-picker>
                  </FormItem>
                </td>
                <td>
                  <FormItem prop="projectCode" label="工程名称">
                    <SelectProject
                      v-model="formItem.projectCode"
                      :model="formItem"
                      :text="formItem.projectName"
                    />
                  </FormItem>
                </td>
              </tr>
              <tr>
                <td>
                  <FormItem prop="providerCode" label="供应商">
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
                <td>
                  <FormItem label="供应商联系人">{{formItem.linkMan}}</FormItem>
                </td>
                <td>
                  <FormItem label="税率">{{formItem.taxRate1}}%</FormItem>
                </td>
              </tr>
              <tr>
                <td>
                  <FormItem label="发票类型">{{formItem.invoiceType}}</FormItem>
                </td>
                <td>
                  <FormItem prop="startDate" label="结算开始日期">
                    <Date-picker
                      type="date"
                      placeholder="选择日期"
                      v-model="formItem.startDate"
                      format="yyyy-MM-dd"
                    ></Date-picker>
                  </FormItem>
                </td>
                <td>
                  <FormItem prop="endDate" label="结算结束日期">
                    <Date-picker
                      type="date"
                      placeholder="选择日期"
                      v-model="formItem.endDate"
                      format="yyyy-MM-dd"
                    ></Date-picker>
                  </FormItem>
                </td>
              </tr>
              <tr>
                <td>
                  <FormItem label="金额合计">{{formItem.totalAmount}}</FormItem>
                </td>
                <td>
                  <FormItem prop="penalty" label="罚款">
                    <InputNumber
                      :max="999999999"
                      :min="0"
                      v-model="formItem.penalty"
                      @on-change="computedTotalPriceTax()"
                    ></InputNumber>
                  </FormItem>
                </td>
                <td>
                  <FormItem label="价税合计">{{formItem.totalPriceTax}}</FormItem>
                </td>
              </tr>
              <tr>
                <td colspan="3">
                  <FormItem label="备注">
                    <Input type="textarea" v-model="formItem.remark"/>
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
            :model="formItem"
            @on-amount-change="onAmountChange"
            @on-pricetax-change="onPriceTaxChange"
            @on-import="onImport"
          ></Editable>
        </div>
      </Loading>
      <SelProvider ref="selProvider"></SelProvider>
    </div>
  </StartProcess>
</template>
<script>
import Loading from '@/components/loading';
import LayoutHor from '@/components/layout/LayoutHor';
import Editable from './DetailEditable';
import page from '@/assets/js/page';
import floatObj from '@/assets/js/floatObj';

import SelStorage from '@/components/storage/input/SelStorage';
import SelProvider from '@/components/provider/SelectProvider';
import SelectProject from '@/components/page/form/SelectProject';
import SelectMachine from '@/components/page/form/SelectMachine';

import StartProcess from '@/components/workflow/process/Start';
export default {
  components: {
    Loading,
    LayoutHor,
    Editable,
    SelStorage,
    SelProvider,
    SelectProject,
    SelectMachine,
    StartProcess,
  },
  data() {
    return {
      loading: 0,
      machineBillCode: '',
      pageFlag: 1,//1.新建 2.编辑 3.修订
      formItem: {
        machineBillCode: '',//单据编号
        deptId: '',//所属部门ID
        deptName: '',//所属部门
        projectCode: '',//工程代码
        projectName: '',//工程名   
        billDate: '',//结算日期

        providerCode: '',//供应商名称
        linkMan: '',//供应商联系人
        taxpayerType: '',//纳税人类型
        taxRate: '',   //税率
        taxRate1: '',   //税率
        invoiceType: '',//发票类型 

        startDate: '',//结算开始日期
        endDate: '',//结算结束日期 
        totalAmount: 0,//金额合计
        penalty: 0,//罚款
        totalPriceTax: 0,//价税合计
        remark: '',//备注 
      },
      formRules: {
        billDate: [
          { required: true, message: '请选择结算日期', trigger: 'change', pattern: /.+/ }
        ],
        projectCode: [
          { required: true, whitespace: true, message: '请选择工程', trigger: 'change' }
        ],
        providerCode: [
          { required: true, whitespace: true, message: '请选择供应商', trigger: 'change' }
        ],
        startDate: [
          { required: true, message: '请选择结算开始日期', trigger: 'change', pattern: /.+/ }
        ],
        endDate: [
          { required: true, message: '请选择结算结束日期', trigger: 'change', pattern: /.+/ }
        ],
        penalty: [
          { required: true, type: 'number', message: '请填写罚款', trigger: 'change' }
        ],
      },
      list: [],
      oriItem: {},
      storage: []
    }
  },
  mounted: function () {
    this.machineBillCode = this.$route.query.id;
    if (this.machineBillCode) {
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
        return '机械租赁结算单 - 创建';
      }
      if (this.pageFlag == 2) {
        return '机械租赁结算单 - 编辑';
      }
    }
  },
  methods: {
    load() {
      this.loading = 1;
      this.$http.post("/api/engine/machine/bill/get", { "machineBillCode": this.machineBillCode }).then((res) => {
        this.loading = 0;
        if (res.data.code == 0) {
          if (res.data.data) {
            this.oriItem = eval('(' + JSON.stringify(res.data.data) + ')');
            res.data.data.billDate=res.data.data.billDate.length>=10?res.data.data.billDate.substring(0,10):res.data.data.billDate; 
            res.data.data.startDate=res.data.data.startDate.length>=10?res.data.data.startDate.substring(0,10):res.data.data.startDate; 
            res.data.data.endDate=res.data.data.endDate.length>=10?res.data.data.endDate.substring(0,10):res.data.data.endDate; 
            Object.assign(this.formItem, res.data.data);
            this.list = res.data.data.detailList;
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
        machineBillCode: '',//单据编号
        deptId: '',//所属部门ID
        deptName: '',//所属部门
        projectCode: '',//工程代码
        projectName: '',//工程名  

        providerCode: '',//供应商名称
        linkMan: '',//供应商联系人
        taxpayerType: '',//纳税人类型
        taxRate: '',   //税率
        invoiceType: '',//发票类型 

        startDate: '',//结算开始日期
        endDate: '',//结算结束日期 
        totalAmount: 0,//金额合计
        penalty: 0,//罚款
        totalPriceTax: 0,//价税合计
        totalPriceTax1: 0,//价税合计备用
        remark: '',//备注 
      });
      this.list = [];
      // this.list.push(this.$refs.editable.listNewRow());
      // this.list.push(this.$refs.editable.listNewRow());
    },
    save(proc) {
      var form = {
        detailList: []
      };

      Object.assign(form, this.formItem);
      form.billDate = page.formatDate(form.billDate);
      form.startDate = page.formatDate(form.startDate);
      form.endDate = page.formatDate(form.endDate);

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

        // if (item.projectCode != form.projectCode || item.providerCode != form.providerCode || item.jobDate != form.billDate) {
        //   this.$Message.error(msg + '作业单选择有误');
        //   return;
        // }
        if (item.taibanPrice == null || item.taibanPrice == '') {
          this.$Message.error(msg + '请录入含税单价');
          return;
        }
        form.detailList.push(item);
      }

      form.proc = proc.formItem;
      // 提交
      this.loading = 1;
      var uri = '/api/engine/machine/bill/start';
      if (this.pageFlag == 2) {
        uri = '/api/engine/machine/bill/restart';
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
            this.formItem.taxRate1 = floatObj.multiply(data.taxRate, 100);//税率
          }
        }
      });
    },
    computedTotalPriceTax() {
      this.formItem.totalPriceTax = floatObj.subtract(this.formItem.totalPriceTax1, this.formItem.penalty);
    },
    onPriceTaxChange(val) {
      this.formItem.totalPriceTax1 = val;
      this.computedTotalPriceTax();
    },
    onAmountChange(val) {
      this.formItem.totalAmount = val;
    },
    onImport() { 
      if (this.formItem == null || this.formItem.projectCode == null || this.formItem.projectCode == '') {//
        this.$Message.error('请选择工程!');
        return;
      }
      if (this.formItem == null || this.formItem.providerCode == null || this.formItem.providerCode == '') {//
        this.$Message.error('请选择供应商!');
        return;
      }
      this.list = [];
      var param = { page: 1, pageSize: 10000 ,status:2};
      param.projectCode = this.formItem.projectCode;
      param.providerCode = this.formItem.providerCode; 
      if (this.formItem.machineBillCode != '') {
        param.machineBillCode = this.formItem.machineBillCode;
      } else {
        param.machineBillCode ="0";
      } 
      param.timeStart = page.formatDate(this.formItem.startDate);
      param.timeEnd = page.formatDate(this.formItem.endDate);
      this.$http.post('/api/engine/machine/order/list', param).then((res) => {
        this.loading = 0;
        if (res.data.code === 0 && res.data.data != null) {
          var rows = res.data.data.rows;
          var total = res.data.data.total;
          if (total == 0) {
            this.$Message.error("抱歉，没有找到对应的数据！");
          }else{
            this.$emit('on-load-data', rows);
            this.list = rows;
            this.list.map((item) => {
              if (item.jobDate != null) {
                item.jobDate = item.jobDate.length >= 10 ? item.jobDate.substring(0, 10) : item.jobDate;
              }
            })
          }
        } else {
          this.$Message.error(res.data.message)
        }
      }).catch((error) => {
        this.loading = 0;
        this.$Message.error(error.message)
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
.instock-edit.page {
  width: 100%; 
  position: relative;
}
.instock-edit .subheader {
  height: 34px;
  line-height: 34px;
  font-size: 14px;
  border-bottom: 0px solid #efefef;
  margin-bottom: 10px;
  color: #20bfee;
}
.instock-edit .baseinfo {
}
.instock-edit .baseinfo .label {
  width: 80px;
  text-align: right;
  padding-right: 8px;
}
.instock-edit .baseinfo table {
  width: 100%;
}
.instock-edit .baseinfo table td {
  height: 40px;
  padding-right: 4px;
}

.instock-edit .savebar {
  margin-top: 10px;
  height: 40px;
  width: 100%;
  border-collapse: collapse;
}
.instock-edit .savebar td {
  border: 1px solid #fefefe;
  font-size: 14px;
}
.instock-edit .savebar .save {
  width: 120px;
  border: 1px solid #20bfee;
  background-color: #20bfee;
  color: white;
  text-align: center;
  cursor: pointer;
}
.instock-edit .savebar .reset {
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

.instock-edit .tooltip {
  padding: 10px;
  background-color: #fafafa;
  border: 1px solid #efefef;
  border-radius: 3px;
  color: #666;
  margin-top: 10px;
}
</style>
