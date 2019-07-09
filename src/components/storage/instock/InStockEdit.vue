<template>
  <StartProcess ref="startProcess" defineId="2" :title="pageTitle" @on-submit="save">
    <div class="page page-bill">
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
                <col width="33%" />
                <col width="auto" />
                <col width="33%" />
              </colgroup>
              <tr>
                <td>
                  <FormItem prop="deptId" label="入往仓库">
                    <SelStorage v-model="formItem.deptId" :model="formItem"></SelStorage>
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
                <td>
                  <FormItem prop="providerCode" label="供应商">
                    <SelectProvider
                      v-model="formItem.providerCode"
                      :model="formItem"
                      :text="formItem.providerName"
                      @on-select="selProvider"
                    />
                  </FormItem>
                </td>
              </tr>
              <tr>
                <td>
                  <FormItem prop label="供应商联系人">{{formItem.linkMan}}</FormItem>
                </td>
                <td>
                  <FormItem prop label="税率">{{formItem.taxRate1}} %</FormItem>
                </td>
                <td>
                  <FormItem
                    prop="remark"
                    label="纳税人类型"
                  >{{$args.getArgText('taxpayer_type', formItem.taxpayerType)}}</FormItem>
                </td>
              </tr>
              <tr>
                <td>
                  <FormItem
                    prop
                    label="发票类型"
                  >{{$args.getArgText('invoice_type', formItem.invoiceType)}}</FormItem>
                </td>
                <td>
                  <FormItem prop="operateDate" label="日期">
                    <Date-picker
                      type="date"
                      placeholder="选择日期"
                      v-model="formItem.operateDate"
                      format="yyyy-MM-dd"
                    ></Date-picker>
                  </FormItem>
                </td>
                <td>
                  <FormItem prop="operatorName" label="收料员">
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
                  <FormItem prop label="红蓝字">
                    <Radio-group v-model="formItem.inboundType">
                      <Radio :label="1" style="color:blue;">蓝字</Radio>
                      <Radio :label="2" style="color:red;">红字</Radio>
                    </Radio-group>
                  </FormItem>
                </td>
                <td>
                  <FormItem prop label="车牌号">
                    <Input v-model="formItem.vehicleNum" />
                  </FormItem>
                </td>
                <td>
                  <FormItem prop=" " label="备注">
                    <Input type="textarea" :rows="2" v-model="formItem.remark" />
                  </FormItem>
                </td>
              </tr>
            </table>
          </Form>
        </div>
        <div>
          <div class="subheader">单据明细</div>
          <Alert v-if="!formItem.deptId">请选择仓库</Alert>
          <Editable
            ref="editable"
            :list="list"
            :editable="true"
            :editprice="true"
            :model="formItem"
            @on-amount-change="onAmountChange"
            :style="{display: formItem.deptId?'':'none'}"
          ></Editable>
        </div>
        <!-- <table class="savebar" cellpadding="0" cellspacing="0">
        <tr>
          <td class="save" @click="save" v-if="pageFlag<=2">保存</td>
          <td class="reset" @click="reset">重置</td>
          <td></td>
        </tr>
        </table>-->
      </Loading>
    </div>
  </StartProcess>
</template>
<script>
import Loading from '@/components/loading';
import LayoutHor from '@/components/layout/LayoutHor';
import Editable from './DetailEditable';
import page from '@/assets/js/page';
import floatObj from '@/assets/js/floatObj';
import SelStorage from '@/components/storage/input/SelStorage';//仓库部门
import SelectProject from '@/components/page/form/SelectProject';//工程名称
import SelectMember from '@/components/page/form/SelectMember';//收料员
import SelectProvider from '@/components/page/form/SelectProvider';//供应商
import pagejs from '@/assets/js/page';
import StartProcess from '@/components/workflow/process/Start';
export default {
  components: {
    Loading,
    LayoutHor,
    Editable,
    SelStorage,
    SelectProject,
    SelectMember,
    SelectProvider,
    StartProcess,
  },
  data() {
    return {
      loading: 0,
      stockBillId: '',
      pageFlag: 1,//1.新建 2.编辑 3.修订
      formItem: {
        stockBillId: '',//入库单号
        type: 1,//类型:1.入库, 2.出库
        projectCode: '',//工程编号
        projectName: '',//工程名称
        contractNo: '',//合同编号
        deptId: '',//仓库或部门 
        deptName: '',//
        providerCode: '',//供应商编号
        providerName: '',//供应商名称
        linkMan: '',//供应商联系人
        linkPhone: '',//供应商联系电话
        taxpayerType: '',//纳税人类型
        invoiceType: '',//发票类型
        taxRate: '',//税率 
        taxRate1: '',//税率 
        inboundType: 1,//红蓝字:1.“蓝字”表示入库，2.“红字”表示退货
        operateDate: page.formatDate(new Date(), 'yyyy-MM-dd'),
        remark: '',
        vehicleNum: '',//车牌号
        operator: '',//
        operatorName: '',
      },
      formRules: {
        deptId: [
          { required: true, whitespace: true, message: '请选择仓库', trigger: 'change' }
        ],
        projectCode: [
          { required: true, whitespace: true, message: '请选择工程', trigger: 'change' }
        ],
        providerCode: [
          { required: true, whitespace: true, message: '请选择供应商', trigger: 'change' }
        ],
        operatorName: [
          { required: true, whitespace: true, message: '请选择收料员', trigger: 'change' }
        ],
        operateDate: [
          {
            required: true,
            message: "请选择日期",
            trigger: "change",
            pattern: /.+/
          }
        ],
      },
      list: [],
      oriItem: {},
      storage: []
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
        return '入库单 - 创建';
      }
      if (this.pageFlag == 2) {
        return '入库单 - 编辑';
      }
      if (this.pageFlag == 3) {
        return '入库单 - 修订';
      }
    }
  },
  methods: {
    selProvider(data) {
      if (data) {
        this.formItem.providerName = data.providerName;
        this.formItem.providerCode = data.providerCode;
        this.formItem.linkMan = data.linkMan;//供应商联系人
        this.formItem.linkPhone = data.linkPhone;//供应商联系电话
        this.formItem.taxpayerType = data.taxpayerType;//纳税人类型
        this.formItem.invoiceType = data.invoiceType;//发票类型
        this.formItem.taxRate = data.taxRate;//税率 
        this.formItem.taxRate1 = floatObj.multiply(data.taxRate, 100);//税率 
      }
    },
    load() {
      this.loading = 1;
      this.$http.post("/api/engine/storage/instock/get", { stockBillId: this.stockBillId }).then((res) => {
        this.loading = 0;
        if (res.data.code == 0) {
          if (res.data.data) { 
            this.oriItem = eval('(' + JSON.stringify(res.data.data) + ')');
            Object.assign(this.formItem, res.data.data);
            this.list = res.data.data.detailList;
            if(this.formItem.taxRate) {
              this.formItem.taxRate1 = floatObj.multiply(this.formItem.taxRate, 100);//税率 
            }   
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
        stockBillId: '',//入库单号
        type: 1,//类型:1.入库, 2.出库
        projectCode: '',//工程编号
        contractNo: '',//合同编号
        deptId: '',//仓库或部门 
        providerCode: '',//供应商编号
        providerName: '',//供应商名称
        linkMan: '',//供应商联系人
        linkPhone: '',//供应商联系电话
        taxpayerType: '',//纳税人类型
        taxRate: '',//税率  
        inboundType: 1,
        remark: '',
        operator: '',//
        operatorName: '',
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
      form.signDate = page.formatDate(form.signDate);

      if (form.operateDate) {
        form.operateDate = page.formatDate(form.operateDate);
      }
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
          // if (item.taxUnitPrice == '') {
          //   this.$Message.error(msg + '请录入含税单价');
          //   return;
          // }
          form.detailList.push(item);
        }
      }

      form.proc = proc.formItem;
      // 提交
      this.loading = 1;
      var uri = '/api/engine/storage/instock/startPc';
      if (this.pageFlag == 2) {
        uri = '/api/engine/storage/instock/restart';
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