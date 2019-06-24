<template>
  <Editable @add="add" @remove="remove" :editable="editable">
    <table cellspacing="0" cellpadding="0" v-if="!editable">
      <thead>
        <th class="col-xh">序号</th>
        <th>层级编码</th>
        <th>分部分项工程名称</th>
        <th>工程数量</th>
        <th>单位</th>
        <th>结算价格</th>
        <th>价格单位</th>
        <th>合价（元）</th>
        <th>备注</th>
      </thead>
      <tbody>
        <tr v-for="(item,index) in list" :key="'mater_'+index">
          <td>
            {{index+1}}
            <!--  序号 -->
          </td>
          <td>
            {{item.levelCode}}
          </td>
          <td>
            {{item.subProjectName}}
          </td>
          <td>
            {{item.workload}}
          </td>
          <td>
            {{item.unit}}
          </td>
          <td class="col-price">
            {{item.settlePrice}}
          </td>
          <td>
            {{item.priceUnit}}
          </td>
          <td class="col-amount">
            {{item.amount}}
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
        <th>层级编码</th>
        <th>分部分项工程名称</th>
        <th>工程数量</th>
        <th>单位</th>
        <th>结算价格</th>
        <th>价格单位</th>
        <th>合价（元）</th>
        <th>备注</th>
      </thead>
      <tbody>
        <tr v-for="(item,index) in list" :key="'mater_'+index" @click="curIndex = index">
          <td :class="{'col-xh':true,'cur':index==curIndex}">
            {{index+1}}
            <!--  序号 -->
          </td>
          <td>
            <Input v-model="item.levelCode" style="width: 100px;"></Input> 
          </td>
          <td>
            <Input v-model="item.subProjectName" style="width: 150px;"></Input> 
          </td>
          <td>
            <InputNumber
              style="width:100px;"
              :max="9999999999"              
              :min="0"               
              v-model="item.workload"
              @on-change="computedAmount(index)"
            ></InputNumber>
          </td>
          <td>
            <Input v-model="item.unit" style="width: 100px;" @on-change="computedAmount(index)"></Input> 
          </td>
          <td class="col-price">
            <InputNumber
              style="width:100px;"
              :max="9999999999"              
              :min="0"               
              v-model="item.settlePrice"
              @on-change="computedAmount(index)"
            ></InputNumber>
          </td>
          <td>
            <Input v-model="item.priceUnit" style="width: 100px;"></Input> 
          </td>
          <td class="col-price">
            {{item.amount}}
          </td>
          <td>
            <Input v-model="item.remark" style="width: 150px;"></Input> 
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
        levelCode: "", 
        subProjectName: "", 
        workload: 0, 
        unit: "", 
        settlePrice: 0, 
        priceUnit: '', 
        amount: 0, 
        remark: '' 
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
    computedAmount(index) {
      this.list[index].priceUnit='元/'+this.list[index].unit;
      this.list[index].amount=floatObj.multiply(this.list[index].workload,this.list[index].settlePrice);
      this.$emit("on-amount-change", this.sumAmount());
    },
    sumAmount() {
      var totals = {
        totalAmount:0,
      };
      this.list.map(mater => {
        totals.totalAmount = floatObj.add(totals.totalAmount, mater.amount);
      });
      return totals;
    }
  }
};
</script>

<style type="text/css">
</style>
