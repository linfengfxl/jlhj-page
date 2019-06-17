<template>
  <ViewProcess
    ref="ViewProcess"
    :instId="instId"
    :title="title"
    @on-load="instLoaded"
    @on-submit="save"
  >
    <div class="page instock-edit">
      <Loading :loading="loading">
        <div class="baseinfo">
          <div class="page-tools"></div>
          <Form ref="form" class="page-form" :model="formItem" :label-width="120">
            <table cellspacing="0" cellpadding="0">
              <colgroup>
                <col width="33%">
                <col width="auto">
                <col width="33%">
              </colgroup>
              <tr>
                <td>
                  <FormItem prop="deptId" label="部门">{{formItem.deptName}}</FormItem>
                </td>
                <td>
                  <FormItem prop="jobDate" label="作业日期">{{formItem.jobDate}}</FormItem>
                </td>
                <td>
                  <FormItem prop="projectCode" label="工程名称">{{formItem.projectName}}</FormItem>
                </td>
              </tr>
              <tr>
                <td>
                  <FormItem prop="providerCode" label="供应商">{{formItem.providerName}}</FormItem>
                </td>
                <td>
                  <FormItem prop label="供应商联系人">{{formItem.linkMan}}</FormItem>
                </td>
                <td>
                  <FormItem prop label="加班时长">{{formItem.overtime}}</FormItem>
                </td>
              </tr>
              <tr>
                <td>
                  <FormItem prop="machineName" label="机械名称">{{formItem.machineName}}</FormItem>
                </td>
                <td>
                  <FormItem prop label="租赁方式">{{$args.getArgText('lease_type', formItem.leaseType)}}</FormItem>
                </td>
                <td>
                  <FormItem prop label="加油数量">{{formItem.addFuel}}</FormItem>
                </td>
              </tr>
              <tr>
                <td>
                  <FormItem label="机械代码">{{formItem.machineCode}}</FormItem>
                </td>
                <td>
                  <FormItem prop label="机械型号">{{formItem.machineModel}}</FormItem>
                </td>
                <td>
                  <FormItem prop label=" 司机/操作手姓名">{{formItem.operator}}</FormItem>
                </td>
              </tr>

              <tr>
                <td>
                  <FormItem prop label="司机/操作手电话">{{formItem.operatorTel}}</FormItem>
                </td>
                <td colspan="2">
                  <FormItem prop=" " label="备注">{{formItem.remark}}</FormItem>
                </td>
              </tr>
            </table>
          </Form>
        </div>
        <div>
          <div class="subheader">单据明细</div>
          <Alert v-if="!formItem.deptId">请选择部门</Alert>
          <Editable
            ref="editable"
            :list="list"
            :editable="false"
            :deptId="formItem.deptId"
            @on-amount-change="onAmountChange"
            :style="{display: formItem.deptId?'':'none'}"
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
import dateFormat from '@/assets/js/dateFormat';

import SelStorage from '@/components/storage/input/SelStorage';

import SelectProject from '@/components/page/form/SelectProject';
import SelectMachine from '@/components/page/form/SelectMachine';
import SelectProvider from '@/components/page/form/SelectProvider';

import ViewProcess from '@/components/workflow/process/View';

export default {
  components: {
    Loading,
    LayoutHor,
    Editable,
    SelStorage,
    SelectProject,
    SelectMachine,
    SelectProvider,
    ViewProcess,
  },
  data() {
    return {
      loading: 0,
      instId: 0,
      title: '',
      machineOrderId: '',
      pageFlag: 1,//1.新建 2.编辑 3.修订
      formItem: {
        machineOrderId: '',//单据编号
        deptId: '',//所属部门
        projectCode: '',//工程代码
        projectName: '',//工程名
        machineCode: '',//机械代码
        machineName: '',//机械名称
        machineModel: '',//机械型号
        providerCode: '',//供应商名称
        linkMan: '',//供应商联系人
        jobDate: '',//作业日期
        operator: '',//司机/操作手姓名
        operatorTel: '',//司机/操作手电话
        leaseType: '',//租赁方式
        taibanPrice: '',//台班单价
        remark: '',//备注
        overtime: '',//加班时长
        addFuel: '',//加油数量
        taibanPrice: null,//
        source: 1,
      },
      list: [],
      oriItem: {},
      storage: []
    }
  },
  mounted: function () {
    this.instId = this.$route.query.inst;
  },
  computed: {
    pageTitle() {
      return '机械作业单 - 明細';
    }
  },
  methods: {
    instLoaded(proc) {
      this.machineOrderId = proc.instance.businessKey;
      this.title = "机械作业单_" + this.machineOrderId;
      this.load();
    },
    load() {
      this.loading = 1;
      this.$http.post("/api/engine/machine/order/get", { "machineOrderId": this.machineOrderId }).then((res) => {
        this.loading = 0;
        if (res.data.code == 0) {
          if (res.data.data) {
            this.oriItem = eval('(' + JSON.stringify(res.data.data) + ')');
            res.data.data.jobDate=res.data.data.jobDate.length>=10?res.data.data.jobDate.substring(0,10):res.data.data.jobDate; 
            Object.assign(this.formItem, res.data.data);
            this.list = res.data.data.detailList;
            this.list.map(p => {
              p.times = [p.startTime, p.endTime];
            });
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
        machineOrderId: '',//单据编号
        deptId: '',//所属部门
        projectCode: '',//工程代码
        projectName: '',//工程名
        machineCode: '',//机械代码
        machineName: '',//机械名称
        machineModel: '',//机械型号
        providerCode: '',//供应商名称
        linkMan: '',//供应商联系人
        jobDate: '',//作业日期
        operator: '',//司机/操作手姓名
        operatorTel: '',//司机/操作手电话
        leaseType: '',//租赁方式
        taibanPrice: '',//台班单价
        remark: '',//备注
        overtime: '',//加班时长
        addFuel: '',//加油数量
        taibanPrice: null,//
        source: 1,
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
      form.jobDate = page.formatDate(form.jobDate);

      var pass = true;
      this.$refs.form.validate((valid) => {
        pass = valid;
      })

      if (!pass) {
        this.$Message.error('验证未通过！');
        return;
      }

      form.detailList = [];
      var taiban = 0, useTime = 0;
      // 明细
      for (var i = 0; i < this.list.length; i++) {
        var item = this.list[i];
        var msg = '明细第 ' + (i + 1) + ' 行，';
        if (item.startTime == '') {
          this.$Message.error(msg + '请选择时间');
          return;
        }
        if (item.endTime == '') {
          this.$Message.error(msg + '请选择时间');
          return;
        }
        if (item.taiban == 0) {
          this.$Message.error(msg + '请录入作业台班');
          return;
        }
        item['startTime'] = page.formatDateTime(item['startTime']);
        item['endTime'] = page.formatDateTime(item['endTime']);
        form.detailList.push(item);
        taiban = floatObj.add(item['taiban'], taiban);
        useTime = floatObj.add(item['useTime'], useTime);
      }
      form.taiban = taiban;//作业台班 合计
      form.useTime = useTime;//作用用时 合计
      console.log(form);
      // 提交
      this.loading = 1;
      var uri = '/api/engine/machine/order/add';
      if (this.pageFlag == 2) {
        uri = '/api/engine/machine/order/update';
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
    selProvider(data) {
      if (data) {
        this.formItem.providerName = data.providerName;
        this.formItem.providerCode = data.providerCode;
        this.formItem.linkMan = data.linkMan;//供应商联系人
        this.formItem.linkPhone = data.linkPhone;//供应商联系电话
        this.formItem.taxpayerType = this.$args.getArgText('taxpayer_type', data.taxpayerType);//纳税人类型
        this.formItem.invoiceType = this.$args.getArgText('invoice_type', data.invoiceType);//发票类型
        this.formItem.taxRate = floatObj.multiply(data.taxRate, 100);//税率 
      }
    },
    selMachine(data) {
      if (data) {
        this.formItem.leaseType = data.leaseType;
        this.formItem.machineModel = data.machineModel;
      }
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
  }
}

</script>

<style type="text/css">
.instock-edit.page {
  width: 100%;
  margin: 0 auto;
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
