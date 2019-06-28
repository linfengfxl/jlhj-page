<template>
  <Editable @add="add" @remove="remove" :editable="editable" :model="model">
    <table cellspacing="0" cellpadding="0" v-if="!editable">
      <thead>
        <th class="col-xh">序号</th>
        <th >费用类别</th>
        <th>金额</th>
      </thead>
      <tbody>
        <tr v-for="(item,index) in list" :key="'mater_'+index" @click="curIndex = index">
          <td>{{index+1}}</td>
          <td style="width:200px;">
            {{item.feeType}}
            <!-- 费用类别 -->
          </td>
          <td style="width:200px;">
            {{item.amount}}
            <!--  金额 -->
          </td>
        </tr>
      </tbody>
    </table>

    <table cellspacing="0" cellpadding="0" v-else>
      <thead>
        <th class="col-xh">序号</th>
        <th>费用类别</th>
        <th>金额</th>
      </thead>
      <tbody>
        <tr v-for="(item,index) in list" :key="'mater_'+index" @click="curIndex = index">
          <td :class="{'col-xh':true,'cur':index==curIndex}">
            {{index+1}}
            <!--  序号 -->
          </td>
          <td>
            <Select v-model="item.feeType" style="width:200px" >
              <Option
                v-for="item in $args.getArgGroup('fee_type')"
                :value="item.argCode"
                :key="item.argCode"
              >{{ item.argText }}</Option>
            </Select>
          </td>
          <td class="col-quantity">
            <!--  金额 -->
            <InputNumber
              :max="999999"
              :min="0"
              style="width:200px"
              v-model="item.amount"
              @on-change="onAmountChange"
            ></InputNumber>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- 选择机械 -->
    <SelectMachine ref="selMachine" :transfer="true"></SelectMachine>
  </Editable>
</template>
<script>
import Editable from '@/components/editable-table';
import floatObj from '@/assets/js/floatObj';
import SelectMachine from '@/components/machine/Selectmachine'
export default {
  components: {
    SelectMachine,
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
        feeType: '',
        amount: 0,
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
    onAmountChange(){
      var total = 0;
      this.list.map(mater => {
        total = floatObj.add(total, mater.amount);
      });
      this.$emit("on-amount-change", total);
    },
    selMachine(row) {
      var selMachine = this.$refs.selMachine;
      selMachine.show({
        ok: (data) => {
          if (_.findIndex(this.list, { 'machineCode': data.machineCode }) >= 0) {
            this.$Message.error('机械已存在!');
            return;
          }
          row.machineCode = data.machineCode;
          row.machineName = data.machineName;
          row.machineModel = data.machineModel;
        }
      });
    },
  }
}

</script>

<style type="text/css">
</style>
