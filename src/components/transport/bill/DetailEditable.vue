<template>
  <Editable @add="add" @remove="remove" :editable="editable">
    <table cellspacing="0" cellpadding="0" v-if="!editable">
      <thead>
        <th class="col-xh">序号</th>
        <th>运输单号</th>
        <th>机械编码</th>
        <th>机械名称</th>
        <th>规格型号</th>
        <th>运输类型</th>
        <th>运输时间</th>
        <th>运输量</th>
        <th>计量单位</th>
        <th>里程数</th>
        <th>含税单价</th>
        <th>扣款金额</th>
        <th>金额</th>
        <th>税额</th>
        <th>价税合计</th>
      </thead>
      <tbody>
        <tr v-for="(item,index) in list" :key="'mater_'+index">
          <td>
            {{index+1}}
            <!--  序号 -->
          </td>
          <td>
            {{item.transportOrderId}}
            <!--  运输单号 -->
          </td>
          <td>
            {{item.machineCode}}
            <!--  机械编码 -->
          </td>
          <td>
            {{item.machineName}}
            <!--  机械名称 -->
          </td>
          <td>
            {{item.machineModel}}
            <!--  规格型号 -->
          </td>
          <td>
            {{item.transportType}}
            <!--  运输类型 -->
          </td>
          <td>
            {{item.transportDate}}
            <!--  运输时间 -->
          </td>
          <td>
            {{item.num}}
            <!--  运输量 -->
          </td>
          <td>
            {{item.unit}}
            <!--  计量单位 -->
          </td>
          <td class="col-quantity">
            <!--  里程数 -->
            {{item.milage}}
          </td>
          <td class="col-price">
            <!--  含税单价(元) -->
            {{item.taxUnitPrice}}
          </td>
          <td class="col-amount">
            <!--  扣款金额  -->
            {{item.deductAmount}}
          </td>
          <td class="col-amount">
            <!--  金额  -->
            {{item.amount}}
          </td>
          <td class="col-amount">
            <!--  税额 -->
            {{item.tax}}
          </td>
          <td class="col-amount">
            <!--  价税合计 -->
            {{item.totalPriceTax}}
          </td>
        </tr>
      </tbody>
    </table>

    <table cellspacing="0" cellpadding="0" v-else>
      <thead>
        <th class="col-xh">序号</th>
        <th>运输单号</th>
        <th>机械编码</th>
        <th>机械名称</th>
        <th>规格型号</th>
        <th>运输类型</th>
        <th>运输时间</th>
        <th>运输量</th>
        <th>计量单位</th>
        <th>里程数</th>
        <th>含税单价</th>
        <th>扣款金额</th>
        <th>金额</th>
        <th>税额</th>
        <th>价税合计</th>
      </thead>
      <tbody>
        <tr v-for="(item,index) in list" :key="'mater_'+index" @click="curIndex = index">
          <td :class="{'col-xh':true,'cur':index==curIndex}">
            {{index+1}}
            <!--  序号 -->
          </td>
          <!-- 点击新增进行验证 -->
          <td class="col-select" @click="editable && selMater(item)">
            <span>{{item.transportOrderId}}</span>
            <!--  运输单号 -->
          </td>
          <td>
            {{item.machineCode}}
            <!--  机械编码 -->
          </td>
          <td>
            {{item.machineName}}
            <!--  机械名称 -->
          </td>
          <td>
            {{item.machineModel}}
            <!--  规格型号 -->
          </td>
          <td>
            {{item.transportType}}
            <!--  运输类型 -->
          </td>
          <td>
            {{item.transportDate}}
            <!--  运输时间 -->
          </td>
          <td>
            {{item.num}}
            <!--  运输量 -->
          </td>
          <td>
            {{item.unit}}
            <!--  计量单位 -->
          </td>
          <td class="col-quantity">
            <!--  里程数 -->
            {{item.milage}}
          </td>
          <td class="col-price">
            <!--  含税单价(元) -->
            {{item.taxUnitPrice}}
          </td>
          <td class="col-amount">
            <!--  扣款金额  -->
            {{item.deductAmount}}
          </td>
          <td class="col-amount">
            <!--  金额  -->
            {{item.amount}}
          </td>
          <td class="col-amount">
            <!--  税额 -->
            {{item.tax}}
          </td>
          <td class="col-amount">
            <!--  价税合计 -->
            {{item.totalPriceTax}}
          </td>
        </tr>
      </tbody>
    </table>
  </Editable>
</template>
<script>
import Editable from "@/components/editable-table";
import floatObj from "@/assets/js/floatObj"; 
export default {
  components: { 
    Editable
  },
  props: {
    list: {
      type: Array,
      default: function() {
        var arr = [];
      }
    },
    editable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      curIndex: 0,
    };
  },
  mounted: function() {},
  computed: {},
  watch: {
    list(val, old) {
      this.$emit("on-amount-change", this.sumAmount());
    }
  },
  methods: {
    load() {},
    listNewRow() {
      var def = {
        id: 0,
        transportOrderId: "", //单据编号
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
        transportContent: "" //运输内容
      };
      return def;
    },
    add() {
      // 因为要获取外部数据，先抛出问题，传入父组件
      this.$emit('on-import');
    },
    remove() {
      if (this.list.length > this.curIndex) {
        this.list.splice(this.curIndex, 1);
      }
      if (this.list.length <= this.curIndex) {
        this.curIndex = this.list.length - 1;
      }
      if (this.curIndex == -1) {
        this.curIndex = 0;
      }
    },
    datePickerChange(item, args) {
      item.needDate = args[0];
    },
    computedAmount(item) {
      this.$emit("on-amount-change", this.sumAmount());
    },
    sumAmount() {
      var totals = {
        amountTotal:0,
        taxTotal:0,
        deductAmountTotal:0,
        totalPriceTaxTotal:0,
      };
      this.list.map(mater => {
        totals.amountTotal = floatObj.add(totals.amountTotal, mater.amount);
        totals.taxTotal = floatObj.add( totals.taxTotal, mater.tax);
        totals.deductAmountTotal = floatObj.add(totals.deductAmountTotal, mater.deductAmount);
        totals.totalPriceTaxTotal = floatObj.add(totals.totalPriceTaxTotal, mater.totalPriceTax);
      });
      return totals;
    }
  }
};
</script>

<style type="text/css">
</style>
