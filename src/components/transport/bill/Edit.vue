<template>
  <StartProcess ref="startProcess" defineId="6" :title="pageTitle" @on-submit="save" :max="1" :loading="loading">
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
                    <SelStorage
                      v-model="formItem.deptId"
                      :model="formItem"
                      :text="formItem.deptName"
                      @on-change="onQueryChange"
                    ></SelStorage>
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
                      @on-select="onQueryChange"
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
                  <FormItem prop label="供应商联系人">{{formItem.linkMan}}</FormItem>
                </td>
                <td>
                  <FormItem
                    prop="taxpayerType"
                    label="纳税人类型"
                  >{{$args.getArgText('taxpayer_type', formItem.taxpayerType)}}</FormItem>
                </td>
              </tr>
              <tr>
                <td>
                  <FormItem prop label="税率">{{formItem.taxRate}}%</FormItem>
                </td>
                <td>
                  <FormItem prop label="发票类型">{{formItem.invoiceType}}</FormItem>
                </td>
                <td>
                  <FormItem prop="startDate" label="结算开始日期">
                    <Date-picker
                      type="date"
                      placeholder="选择日期"
                      v-model="formItem.startDate"
                      format="yyyy-MM-dd"
                      @on-change="onQueryChange"
                    ></Date-picker>
                  </FormItem>
                </td>
              </tr>
              <tr>
                <td>
                  <FormItem prop="endDate" label="结算结束日期">
                    <Date-picker
                      type="date"
                      placeholder="选择日期"
                      v-model="formItem.endDate"
                      format="yyyy-MM-dd"
                      @on-change="onQueryChange"
                    ></Date-picker>
                  </FormItem>
                </td>
                <td>
                  <FormItem prop label="金额合计">
                    <Input v-model="formItem.amount" readonly="readonly"/>
                  </FormItem>
                </td>

                <td>
                  <FormItem prop label="税额合计">
                    <Input v-model="formItem.tax" readonly="readonly"/>
                  </FormItem>
                </td>
              </tr>
              <tr>
                <td>
                  <FormItem prop label="扣款合计">
                    <Input v-model="formItem.deductAmount" readonly="readonly"/>
                  </FormItem>
                </td>
                <td>
                  <FormItem prop label="价税合计">
                    <Input v-model="formItem.totalPriceTax" readonly="readonly"/>
                  </FormItem>
                </td>
                <td>
                  <FormItem prop=" " label="备注">
                    <Input type="textarea" :rows="2" v-model="formItem.remark"/>
                  </FormItem>
                </td>
              </tr>
            </table>
          </Form>
        </div>
        <div>
          <div class="subheader">运输结算明细</div>
          <!-- 父组件接受on-import子组件的方法 -->
          <Editable
            ref="editable"
            :list="list"
            :editable="true"
            @on-import="onImport"
            @on-amount-change="onAmountChange"
          ></Editable>
        </div>
      <SelProvider ref="selProvider"></SelProvider>
  </StartProcess>
</template>
<script>
import Loading from "@/components/loading";
import LayoutHor from "@/components/layout/LayoutHor";
import Editable from "./DetailEditable";
import page from "@/assets/js/page";
import floatObj from "@/assets/js/floatObj";
import pagejs from "@/assets/js/page";

import SelStorage from "@/components/storage/input/SelStorage";
import SelProvider from "@/components/provider/SelectProvider";
import SelectProject from "@/components/page/form/SelectProject";
import SelectMachine from "@/components/page/form/SelectMachine";
import StartProcess from "@/components/workflow/process/Start";
export default {
  components: {
    Loading,
    LayoutHor,
    Editable,
    SelStorage,
    SelProvider,
    SelectProject,
    SelectMachine,
    StartProcess
  },
  props: {
    api: {
      type: String,
      default: '/api/engine/transport/order/listAll'
    },
  },
  data() {
    return {
      loading: 0,
      transportBillId: "",
      pageFlag: 1, //1.新建 2.编辑 3.修订
      formItem: this.getInitFormItem(),
      formRules: {
        billDate: [
          {
            required: true,
            message: "请选择结算日期",
            trigger: "change",
            pattern: /.+/
          }
        ],
        startDate: [
          {
            required: true,
            message: "请选择结算开始日期",
            trigger: "change",
            pattern: /.+/
          }
        ],
        endDate: [
          {
            required: true,
            message: "请选择结算结束日期",
            trigger: "change",
            pattern: /.+/
          }
        ],
        projectCode: [
          {
            required: true,
            whitespace: true,
            message: "请选择工程",
            trigger: "change"
          }
        ],
        providerCode: [
          {
            required: true,
            whitespace: true,
            message: "请选择供应商",
            trigger: "change"
          }
        ]
      },
      list: [],
      oriItem: {},
      storage: []
    };
  },
  mounted: function () {
    this.transportBillId = this.$route.query.id;
    if (this.transportBillId) {
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
        return "运输结算单 - 创建";
      }
      if (this.pageFlag == 2) {
        return "运输结算单 - 编辑";
      }
    }
  },
  methods: {
    load() {
      this.loading = 1;
      this.$http
        .post("/api/engine/transport/bill/get?transportBillId=" + this.transportBillId, {
          transportBillId: this.transportBillId
        })
        .then(res => {
          this.loading = 0;
          if (res.data.code == 0) {
            if (res.data.data) {
              res.data.data.taxRate = floatObj.multiply(res.data.data.taxRate, 100);
              this.oriItem = eval("(" + JSON.stringify(res.data.data) + ")");
              Object.assign(this.formItem, res.data.data);
              this.list = res.data.data.detailList;
              this.list.map((item) => {
                item.transportDate = item.transportDate.length >= 10 ? item.transportDate.substring(0, 10) : item.transportDate;
              })
              this.$nextTick(() => {
                this.list = res.data.data.detailList;
              })
            } else {
              this.$Message.error("订单不存在！");
              this.goBack();
            }
          } else {
            this.$Message.error(res.data.message);
          }
        })
        .catch(error => {
          this.loading = 0;
          this.$Message.error("操作失败！");
        });
    },
    initNew() {
      Object.assign(this.formItem, this.getInitFormItem());
      this.list = [];
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
      this.$refs.form.validate(valid => {
        pass = valid;
      });
      if (!pass) {
        this.$Message.error("验证未通过！");
        return;
      }
      form.detailList = [];
      // 明细
      for (var i = 0; i < this.list.length; i++) {
        var item = this.list[i];
        var msg = "明细第 " + (i + 1) + " 行，";
        // if (item.materCode != '') {
        //   if (item.quantity == 0) {
        //     this.$Message.error(msg + '请录入数量');
        //     return;
        //   }
        //   if (item.taxUnitPrice == '') {
        //     this.$Message.error(msg + '请录入含税单价');
        //     return;
        //   }
        //   form.detailList.push(item);
        // }

        form.detailList.push(item);
      }

      form.proc = proc.formItem;
      // 提交
      this.loading = 1;
      var uri = "/api/engine/transport/bill/add ";
      if (this.pageFlag == 2) {
        uri = "/api/engine/transport/bill/update ";
      }

      this.$http
        .post(uri, form)
        .then(res => {
          this.loading = 0;
          if (res.data.code == 0) {
            this.$Message.success("操作成功！");
            this.goBack();
          } else {
            this.$Message.error(res.data.message);
          }
        })
        .catch(error => {
          this.loading = 0;
          this.$Message.error("请求失败，请重新操作");
        });
    },
    // 初始化表单数据
    getInitFormItem() {
      var obj = {
        transportBillId: "", //单据编号
        deptId: "", //所属部门
        deptName: "", // 所属部门
        projectCode: "", //工程代码
        projectName: "", //工程名称
        providerCode: "", //供应商名称,
        providerName: "", // 供应商名称
        linkMan: "", //供应商联系人',
        taxpayerType: "", //纳税人类型
        invoiceType: "", // 发票类型
        taxRate: 0, //税率',
        taxRate1: 0, //税率',
        startDate: "", // 结算开始日期
        endDate: "", // 结算结束日期
        billDate: "", // 结算日期
        taxUnitPrice: 0, //含税单价',
        deductAmount: 0, //扣款金额',
        amount: 0, //金额',
        tax: 0, //税额',
        totalPriceTax: 0, //价税合计',
        transportStart: "", //运输起点',
        transportEnd: "", //运输终点',
        transportType: "", //运输类别
        transportContent: "", //运输内容
        status: 0 //  审批状态
      };
      return obj;
    },
    selProvider(row) {
      var sel = this.$refs.selProvider; //引用该控件，赋值给变量对象
      sel.show({
        ok: data => {
          if (data) {
            this.formItem.providerName = data.providerName;
            this.formItem.providerCode = data.providerCode;
            this.formItem.linkMan = data.linkMan; //供应商联系人
            this.formItem.linkPhone = data.linkPhone; //供应商联系电话
            this.formItem.taxpayerType = this.$args.getArgText(
              "taxpayer_type",
              data.taxpayerType
            ); //纳税人类型
            this.formItem.invoiceType = this.$args.getArgText(
              "invoice_type",
              data.invoiceType
            ); //发票类型
            this.formItem.taxRate = floatObj.multiply(data.taxRate, 100); //税率
          }
        }
      });
      this.list = [];
    },
    onAmountChange(total) {
      this.formItem.amount = total.amountTotal;
      this.formItem.tax = total.taxTotal;
      this.formItem.deductAmount = total.deductAmountTotal;
      this.formItem.totalPriceTax = total.totalPriceTaxTotal;
    },
    // 对运输结算单进行新增前判断,通过后获取列表
    onImport() {
      if (this.formItem.projectCode == "") {
        this.$Message.error("请选择工程");
        return;
      }
      if (this.formItem.providerCode == "") {
        this.$Message.error("请选择供应商");
        return;
      }
      var param = {};
      param.status = 2;
      param.projectCode = this.formItem.projectCode;
      param.providerCode = this.formItem.providerCode;
      // if (this.formItem.startDate == "") {
      //   this.$Message.error("请选择开始日期");
      //   return;
      // }
      // if (this.formItem.endDate == "") {
      //   this.$Message.error("请选择结束日期");
      //   return;
      // }
      param.startDate = page.formatDate(this.formItem.startDate);
      param.endDate = page.formatDate(this.formItem.endDate);
      this.$http.post(this.api, param).then((res) => {
        this.loading = 0;
        if (res.data.code === 0) {
          this.loading = 0;
          var data = res.data.data;
          this.list = data.rows;
          if (this.list.length == 0) {
            this.$Message.error("抱歉，没有找到对应数据");
          } else {
            this.list.map((item) => {
              if (item.transportDate != null) {
                item.transportDate = item.transportDate.length >= 10 ? item.transportDate.substring(0, 10) : item.transportDate;
              }
            })
            this.$Message.success("共查询" + this.list.length + "条数据");
          }
        } else {
          this.loading = 0;
          this.list = [];
          this.$Message.error(res.data.message);
        }
      }).catch((error) => {
        this.loading = 0;
        this.$Message.error("请求失败，请重新发送")
      });

    },
    onQueryChange() {
      this.list = [];
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
    }
  }
};
</script>
 