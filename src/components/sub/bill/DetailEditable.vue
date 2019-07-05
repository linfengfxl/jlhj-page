<template>
  <Editable @add="add" @remove="remove" :editable="editable" :model="model">
    <table cellspacing="0" cellpadding="0" v-if="!editable">
      <thead>
        <th class="col-xh">序号</th>
        <th>工序名称</th>
        <th>计量单位</th>
        <th class="col-quantity">合同工程量</th>
        <th class="col-price">含税单价</th>
        <th class="col-price">单价</th>
        <th class="col-quantity">工程量</th>
        <th class="col-price">金额</th>
        <th class="col-price">税额</th>
        <th class="col-price">价税合计</th>
        <th class="col-quantity">累计工程量</th>
      </thead>
      <tbody>
        <tr v-for="(item,index) in list" :key="'mater_'+index" @click="curIndex = index">
          <td>{{index+1}}</td>
          <td>
            {{item.name}}
          </td>
          <td>
            {{$args.getArgText('unit',item.unit)}}
          </td>
          <td class="col-quantity">
            {{item.contractProjectQuantity}}
          </td>
          <td class="col-price">
            {{item.taxUnitPrice}}
          </td>
          <td class="col-price">
            {{item.unitPrice}}
          </td>
          <td class="col-quantity">
            {{item.projectQuantity}}
          </td>
           <td class="col-price">
            {{item.amount}}
          </td>
           <td class="col-price">
            {{item.tax}}
          </td>
          <td class="col-price">
            {{item.totalPriceTax}}
          </td>
          <td class="col-quantity">
            {{item.totalProjectQuantity}}
          </td>
        </tr>
      </tbody>
    </table>

    <table cellspacing="0" cellpadding="0" v-else>
      <thead>
        <th class="col-xh">序号</th>
        <th>工序名称</th>
        <th>计量单位</th>
        <th class="col-quantity">合同工程量</th>
        <th class="col-price">含税单价</th>
        <th class="col-price">单价</th>
        <th class="col-quantity">工程量</th>
        <th class="col-price">金额</th>
        <th class="col-price">税额</th>
        <th class="col-price">价税合计</th>
      </thead>
      <tbody>
        <tr v-for="(item,index) in list" :key="'mater_'+index" @click="curIndex = index">
          <td :class="{'col-xh':true,'cur':index==curIndex}">
            {{index+1}}
            <!--  序号 -->
          </td>
          <td>
            <Input v-model="item.name" style="width: 150px;"></Input> 
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
              v-model="item.contractProjectQuantity"
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
          <td class="col-quantity">
            <InputNumber
              :max="999999"
              :min="0"
              v-model="item.projectQuantity"
              @on-change="onAmountChange(item)"
            ></InputNumber>
          </td>
          <td class="col-price">
            {{item.amount}}
          </td>
          <td class="col-price">
            {{item.tax}}
          </td>
          <td class="col-price">
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
        planWorkload: 0,
        subPrice: 0,
        amount: 0,
        remark: '',
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
        planWorkload:0,
        amount:0,
      };
      item.amount=parseFloat(floatObj.multiply(item.planWorkload,item.subPrice));
      this.list.map(mater => {
        total.planWorkload = parseFloat(floatObj.add(total.planWorkload, mater.planWorkload));
        total.amount = parseFloat(floatObj.add(total.amount, mater.amount));
      });
      this.$emit("on-amount-change", total);
    },
  }
}

</script>

<style type="text/css">
</style>
