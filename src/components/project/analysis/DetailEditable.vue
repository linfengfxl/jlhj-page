<template>
  <Editable @add="add" @remove="remove" :editable="editable">
    <table cellspacing="0" cellpadding="0" v-if="!editable">
      <thead>
        <th class="col-xh">序号</th>
        <th>层级编码</th>
        <th>分部分项工程名称</th>
        <th>工程数量</th>
        <th>单位</th>
        <th>材料费</th>
        <th>人工费</th>
        <th>机械费</th>
        <th>合计</th>
        <th>财审价</th>
        <th>差价</th>
        <th>工程造价</th>
        <th>成本合价</th>
        <th>材料成本</th>
        <th>人工成本</th>
        <th>机械成本</th>
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
            {{item.materialFee}}
          </td>
          <td class="col-price">
            {{item.laborFee}}
          </td>
          <td class="col-price">
            {{item.machineFee}}
          </td>
          <td class="col-price">
            {{item.totalFee}}
          </td>
          <td class="col-price">
            {{item.reviewPrice}}
          </td>
          <td class="col-price">
            {{item.differPrice}}
          </td>
          <td class="col-amount">
            {{item.projectAmount}}
          </td>
          <td class="col-amount">
            {{item.costAmount}}
          </td>
          <td class="col-amount">
            {{item.materialAmount}}
          </td>
          <td class="col-amount">
            {{item.laborAmount}}
          </td>
          <td class="col-amount">
            {{item.machineAmount}}
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
        <th>材料费</th>
        <th>人工费</th>
        <th>机械费</th>
        <th>合计</th>
        <th>财审价</th>
        <th>差价</th>
        <th>工程造价</th>
        <th>成本合价</th>
        <th>材料成本</th>
        <th>人工成本</th>
        <th>机械成本</th>
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
            <Input v-model="item.subProjectName" style="width: 100px;"></Input> 
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
            <Input v-model="item.unit" style="width: 100px;"></Input> 
          </td>
          <td class="col-price">
            <InputNumber
              style="width:100px;"
              :max="9999999999"              
              :min="0"               
              v-model="item.materialFee"
              @on-change="computedAmount(index)"
            ></InputNumber>
          </td>
          <td class="col-price">
            <InputNumber
              style="width:100px;"
              :max="9999999999"              
              :min="0"               
              v-model="item.laborFee"
              @on-change="computedAmount(index)"
            ></InputNumber>
          </td>
          <td class="col-price">
            <InputNumber
              style="width:100px;"
              :max="9999999999"              
              :min="0"               
              v-model="item.machineFee"
              @on-change="computedAmount(index)"
            ></InputNumber>
          </td>
          <td class="col-price">
            {{item.totalFee}}
          </td>
          <td class="col-price">
            <InputNumber
              style="width:100px;"
              :max="9999999999"              
              :min="0"               
              v-model="item.reviewPrice"
              @on-change="computedAmount(index)"
            ></InputNumber>
          </td>
          <td class="col-price">
            {{item.differPrice}}
          </td>
          <td class="col-amount">
            {{item.projectAmount}}
          </td>
          <td class="col-amount">
            {{item.costAmount}}
          </td>
          <td class="col-amount">
            {{item.materialAmount}}
          </td>
          <td class="col-amount">
            {{item.laborAmount}}
          </td>
          <td class="col-amount">
            {{item.machineAmount}}
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
        levelCode: "", //单据编号
        subProjectName: "", 
        workload: 0, 
        unit: "", 
        materialFee: 0, 
        laborFee: 0, 
        machineFee: 0, 
        totalFee: 0, 
        reviewPrice: 0, 
        differPrice: 0, 
        projectAmount: 0, 
        costAmount: 0, 
        materialAmount: 0, 
        laborAmount: 0, 
        machineAmount: 0,
        remark: "" 
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
      this.list[index].totalFee=this.list[index].materialFee+this.list[index].laborFee+this.list[index].machineFee;
      this.list[index].differPrice=this.list[index].reviewPrice-this.list[index].totalFee;
      this.list[index].projectAmount=floatObj.multiply(this.list[index].workload,this.list[index].reviewPrice);
      this.list[index].costAmount=floatObj.multiply(this.list[index].workload,this.list[index].totalFee);
      this.list[index].materialAmount=floatObj.multiply(this.list[index].workload,this.list[index].materialFee);
      this.list[index].laborAmount=floatObj.multiply(this.list[index].workload,this.list[index].laborFee);
      this.list[index].machineAmount=floatObj.multiply(this.list[index].workload,this.list[index].machineFee);
      this.$emit("on-amount-change", this.sumAmount());
    },
    sumAmount() {
      var totals = {
        totalProjectAmount:0,
        totalCostAmount:0,
        totalMaterialAmount:0,
        totalLaborAmount:0,
        totalMachineAmount:0,
      };
      this.list.map(mater => {
        totals.totalProjectAmount = floatObj.add(totals.totalProjectAmount, mater.projectAmount);
        totals.totalCostAmount = floatObj.add( totals.totalCostAmount, mater.costAmount);
        totals.totalMaterialAmount = floatObj.add(totals.totalMaterialAmount, mater.materialAmount);
        totals.totalLaborAmount = floatObj.add(totals.totalLaborAmount, mater.laborAmount);
        totals.totalMachineAmount = floatObj.add(totals.totalMachineAmount, mater.machineAmount);
      });
      return totals;
    }
  }
};
</script>

<style type="text/css">
</style>
