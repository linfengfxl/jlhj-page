<template>
  <Editable @add="add" @remove="remove" :editable="editable">
    <table cellspacing="0" cellpadding="0">
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
          <td class="col-select" @click="editable && !isImport &&  selMater(item)">
            <span>{{item.machineOrderId}}</span>
            <!--  作业单号 -->
          </td>
          <td>
            {{item.machineOrderId}}
            <!--  机械代码 -->
          </td>
            <td>
            {{item.materName}}
            <!--  机械名称 -->
          </td>
          <td>
            {{item.spec}}
            <!--  机械型号 -->
          </td>
          <td>
            {{$args.getArgText('unit',item.unit)}}
            <!--  作业日期 -->
          </td>
          <td>
            {{item.spec}}
            <!--  租赁方式 -->
          </td>
          <td>
            {{item.spec}}
            <!--  作业用时 -->
          </td> 
          <td class="col-quantity">
            <!--  作业台班 -->
            {{item.spec}}
          </td>
          <td class="col-price">
            <!--  含税单价(元) -->
            <InputNumber
              :max="999999"
              :min="0"
              v-model="item.taxUnitPrice"
              @on-change="computedAmount(item)"
            ></InputNumber>
          </td>
          <td class="col-amount">
            <!--  结算金额  -->
            {{item.unitPrice}}
          </td>
          <td class="col-amount">
            <!--  税额 -->
            {{item.tax}}
          </td>
          <td class="col-amount">
            <!--  价税合计 -->
            {{item.tax}}
          </td>
        </tr>
      </tbody>
    </table>
    <!-- 选择作业单 -->
    <SelectMachineOrder ref="selmaterial" :transfer="true"></SelectMachineOrder>
  </Editable>
</template>
<script>
import Editable from '@/components/editable-table';
import floatObj from '@/assets/js/floatObj';
import SelectMachineOrder from '@/components/machine-order/SelectMachineOrder'
export default {
  components: {
    SelectMachineOrder,
    Editable,
  },
  props: {
    list: {
      type: Array,
      default: function () {
        var arr = [];
      }
    },
    storageId: {
      type: String,
      default: ''
    },
    editable: {
      type: Boolean,
      default: false
    },
    isImport: {  // 是否为导入的数据，导入的数据不能添加行，部分字段不能编辑
      type: Boolean,
      default: false
    }
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
        type: 2,//入库
        machineOrderId: '',//材料编号
        materName: '',//材料名称
        spec: '',//规格型号
        unit: '',//单位
        quantity: 0,//数量
        unitPrice: 0,//单价
        taxUnitPrice: 0,//含税单价
        tax: 0,//税额
        amount: 0,//金额
        constructionSite: '',//施工部位
        productName: ''//产成品名称
      };
      return def;
    },
    add() {
      if (!this.isImport) {
        this.list.push(this.listNewRow());
      }
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
      item.amount = floatObj.multiply(item.taxUnitPrice, item.quantity);//数量*含税单价
      item.unitPrice = floatObj.multiply(item.quantity, item.taxUnitPrice);//含税单价*(1-税率)
      item.tax = floatObj.multiply(item.quantity, item.taxUnitPrice);//数量*含税单价*税率
      this.$emit('on-amount-change', this.sumAmount());
    },
    sumAmount() {
      var totals = 0;
      this.list.map((mater) => {
        totals = floatObj.add(totals, mater.amount);
      });
      return totals;
    },
    selMater(row) {
      var selmaterial = this.$refs.selmaterial;
      selmaterial.show({
        ok: (data) => {
          debugger;
          if (_.findIndex(this.list, { 'machineOrderId': data.machineOrderId }) >= 0) {
            this.$Message.error('作业单已存在!');
            return;
          }
          row.machineOrderId = data.machineOrderId;
          row.materName = data.materName;
          row.spec = data.spec;
          row.unit = data.unit;
          this.computedAmount(row);
        }
      });
    },
  }
}

</script>

<style type="text/css">
</style>
