<template>
  <Editable @add="add" @remove="remove" :editable="editable" :model="model">
    <table cellspacing="0" cellpadding="0" v-if="!editable">
      <thead>
        <th class="col-xh">序号</th>
        <th>作业单号</th>
        <th>机械代码</th>
        <th>机械名称</th>
        <th>机械型号</th>
        <th>作业日期</th>
        <th>租赁方式</th>
        <th>作业用时</th>
        <th>作业台班</th>
        <th>含税单价</th>
        <th>结算金额</th>
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
            {{item.machineOrderId}}
            <!--  作业单号 -->
          </td>
          <td>
            {{item.machineCode}}
            <!--  机械代码 -->
          </td>
          <td>
            {{item.machineName}}
            <!--  机械名称 -->
          </td>
          <td>
            {{item.machineModel}}
            <!--  机械型号 -->
          </td>
          <td>
            {{item.jobDate}}
            <!--  作业日期 -->
          </td>
          <td>
            {{$args.getArgText('lease_type', item.leaseType)}}
            <!--  租赁方式 -->
          </td>
          <td>
            {{item.useTime}}
            <!--  作业用时 -->
          </td>
          <td class="col-quantity">
            <!--  作业台班 -->
            {{item.taiban}}
          </td>
          <td class="col-price">
            <!--  含税单价(元) -->
            {{item.taibanPrice}}
          </td>
          <td class="col-amount">
            <!--  结算金额  -->
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
        <th>作业单号</th>
        <th>机械代码</th>
        <th>机械名称</th>
        <th>机械型号</th>
        <th>作业日期</th>
        <th>租赁方式</th>
        <th>作业用时</th>
        <th>作业台班</th>
        <th>含税单价</th>
        <th>结算金额</th>
        <th>税额</th>
        <th>价税合计</th>
      </thead>
      <tbody>
        <tr v-for="(item,index) in list" :key="'mater_'+index" @click="curIndex = index">
          <td :class="{'col-xh':true,'cur':index==curIndex}">
            {{index+1}}
            <!--  序号 -->
          </td>
          <td class="col-select">
            <span>{{item.machineOrderId}}</span>
            <!--  作业单号 -->
          </td>
          <td>
            {{item.machineCode}}
            <!--  机械代码 -->
          </td>
          <td>
            {{item.machineName}}
            <!--  机械名称 -->
          </td>
          <td>
            {{item.machineModel}}
            <!--  机械型号 -->
          </td>
          <td>
            {{item.jobDate}}
            <!--  作业日期 -->
          </td>
          <td>
            {{$args.getArgText('lease_type', item.leaseType)}}
            <!--  租赁方式 -->
          </td>
          <td>
            {{item.useTime}}
            <!--  作业用时 -->
          </td>
          <td class="col-quantity">
            <!--  作业台班 -->
            {{item.taiban}}
          </td>
          <td class="col-price">
            <!--  含税单价(元) -->
            <InputNumber
              :max="999999999"
              :min="0"
              v-model="item.taibanPrice"
              @on-change="computedAmount(item)"
            ></InputNumber>
          </td>
          <td class="col-amount">
            <!--  结算金额  -->
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
import Editable from '@/components/editable-table';
import floatObj from '@/assets/js/floatObj';
import page from '@/assets/js/page';
//import SelectMachineOrder from '@/components/machine/order/SelectMachineOrder'
export default {
  components: {
    // SelectMachineOrder,
    Editable,
  },
  props: {
    list: {
      type: Array,
      default: function () {
        var arr = [];
      }
    },
    model: {
      type: Object,
      default: null
    },
    editable: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      curIndex: 0,
    }
  },
  mounted: function () {

  },
  computed: {},
  watch: {
    list(val, old) {
      this.$emit('on-amount-change', this.sumAmount());
    }
  },
  methods: {
    load() {

    },
    listNewRow() {
      var def = {
        id: 0,
        machineOrderId: '',//作业单号 
        machineCode: '',//机械代码 
        machineName: '',//机械名称 
        machineModel: '',//机械型号  
        jobDate: '',//作业日期 
        leaseType: '', //租赁方式 
        useTime: '',//作业用时 
        taiban: '',//作业台班 
        taibanPrice: '',//含税单价(元) 
        amount: '',//结算金额
        tax: '',//税额
        totalPriceTax: '',//价税合计
      };
      return def;
    },
    add() {
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
      this.$emit('on-amount-change', this.sumAmount());
      this.$emit('on-pricetax-change', this.sumPricetax());
    },
    datePickerChange(item, args) {
      item.needDate = args[0];
    },
    computedAmount(item) {
      var taxSub = floatObj.subtract(1, this.model.taxRate);
      item.amount = floatObj.multiply(item.taibanPrice, floatObj.multiply(item.taiban, taxSub), 2);//結算金額= 含税单价*作业台班*(1-税率)
      item.tax = floatObj.multiply(floatObj.multiply(item.taibanPrice, item.taiban), this.model.taxRate);//税额 = 含税单价*作业台班*税率
      item.totalPriceTax = floatObj.multiply(item.taibanPrice, item.taiban);//价税合计 = 含税单价*作业台班
      this.$emit('on-amount-change', this.sumAmount());
      this.$emit('on-pricetax-change', this.sumPricetax());
    },
    sumAmount() {
      var totals = 0;
      this.list.map((mater) => {
        totals = floatObj.add(totals, mater.amount);
      });
      return totals;
    },
    sumPricetax() {
      var totals = 0;
      this.list.map((mater) => {
        totals = floatObj.add(totals, mater.totalPriceTax);
      });
      return totals;
    },
  }
}

</script>

<style type="text/css">
</style>
