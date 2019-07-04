<template>
  <Editable @add="add" @remove="remove" :editable="editable" :model="model">
    <table cellspacing="0" cellpadding="0" v-if="!editable">
      <thead>
        <th class="col-xh">序号</th>
        <th>分包工序</th>
        <th>工作内容</th>
        <th>计量单位</th>
        <th class="col-quantity">工作量</th>
        <th class="col-price">含税单价</th>
        <th class="col-price">单价</th>
        <th class="col-price">金额</th>
        <th class="col-price">税额</th>
        <th class="col-price">价税合计</th>
        <th>备注</th>     
      </thead>
      <tbody>
        <tr v-for="(item,index) in list" :key="'mater_'+index" @click="curIndex = index">
          <td>{{index+1}}</td>
          <td>
            {{item.subProcess}}
          </td>
          <td>
            {{item.content}}
          </td>
          <td>
            {{$args.getArgText('unit',item.unit)}}
          </td>
          <td>
            {{item.workload}}
          </td>
          <td class="col-price">
            {{item.taxUnitPrice}}
          </td>
           <td class="col-price">
            {{item.unitPrice}}
          </td > 
          <td class="col-price">
            {{item.amount}}
          </td>
           <td class="col-price">
            {{item.tax}}
          </td>
          <td class="col-price">
            {{item.totalAmount}}
          </td>
          <td>
            {{item.remark}}
          </td>  
        </tr>
      </tbody>
    </table>

    <table cellspacing="0" cellpadding="0" v-else>
      <thead>
        <th class="col-xh">序号</th>
        <th>分包工序</th>
        <th>工作内容</th>
        <th>计量单位</th>
        <th class="col-quantity">工作量</th>
        <th class="col-price">含税单价</th>
        <th class="col-price">单价</th>
        <th class="col-price">金额</th>
        <th class="col-price">税额</th>
        <th class="col-price">价税合计</th>
        <th>备注</th>     
      </thead>
      <tbody>
        <tr v-for="(item,index) in list" :key="'mater_'+index" @click="curIndex = index">
          <td :class="{'col-xh':true,'cur':index==curIndex}">
            {{index+1}}
            <!--  序号 -->
          </td>
         <td>
            <Input v-model="item.subProcess" style="width: 150px;"></Input> 
          </td>
          <td>
            <Input v-model="item.content" style="width: 200px;"></Input> 
          </td>
          <td>
            <Select v-model="item.unit" style="width:150px" >
              <Option
                v-for="item in $args.getArgGroup('unit')"
                :value="item.argCode"
                :key="item.argCode"
              >{{ item.argText }}</Option>
            </Select>
          </td>
          <td class="col-quantity">
            <InputNumber
              :max="999999"
              :min="0"
              v-model="item.workload"
              @on-change="onAmountChange(item)"
            ></InputNumber>
          </td>
          <td class="col-price">
            <InputNumber
              :max="999999"
              :min="0"
              v-model="item.taxUnitPrice"
              @on-change="onAmountChange(item)"
            ></InputNumber>
          </td>
          <td class="col-price">
            {{item.unitPrice}}
          </td>
          <td class="col-price">
            {{item.amount}}
          </td>
          <td class="col-price">
            {{item.tax}}
          </td>
          <td class="col-price">
            {{item.totalAmount}}
          </td>
          <td>
            <Input v-model="item.remark" style="width: 200px;"></Input> 
          </td>
        </tr>
      </tbody>
    </table>
  </Editable>
</template>
<script>
import Editable from '@/components/editable-table';
import floatObj from '@/assets/js/floatObj';
export default {
  components: {
    Editable,
  },
  props: {
    list: {
      type: Array,
      default: function () {
        var arr = [];
      }
    },
    taxRate: {
      type: Object,
      default: null
    },
    model: {
      type: Object,
      default: null
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
      // this.$emit('on-amount-change', this.sumAmount());
    }
  },
  methods: {
    load() {

    },
    listNewRow() {
      var def = {
        subProcess: '',
        content: '',
        unit: '',
        workload: 0,
        taxUnitPrice: 0,
        unitPrice: 0,
        amount: 0,
        tax: 0,
        totalAmount: 0,
        remark:'',
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
    onAmountChange(item){
      var total = {
        totalWorkload:0,
        totalAmount:0,
        totalTaxAmount:0,
      };
      item.unitPrice=parseFloat(floatObj.multiply(item.taxUnitPrice,floatObj.subtract(1,this.taxRate.taxRate)));//单价
      item.amount=parseFloat(floatObj.multiply(item.workload,item.unitPrice));//金额
      item.tax=parseFloat(floatObj.multiply(this.taxRate.taxRate,floatObj.multiply(item.workload,item.taxUnitPrice)));//税额
      item.totalAmount=parseFloat(floatObj.multiply(item.workload,item.taxUnitPrice));//价税合计
      this.list.map(mater => {
        total.totalWorkload = parseFloat(floatObj.add(total.totalWorkload, mater.workload));
        total.totalAmount = parseFloat(floatObj.add(total.totalAmount, mater.amount));
        total.totalTaxAmount = parseFloat(floatObj.add(total.totalTaxAmount, mater.totalAmount));
      });
      this.$emit("on-amount-change", total);
    },
  }
}

</script>

<style type="text/css">
</style>
