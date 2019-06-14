<template>
  <Editable @add="add" @remove="remove" :editable="editable">
    <table cellspacing="0" cellpadding="0" v-if="!editable">
      <thead>
        <th class="col-xh">序号</th>
        <th>费用类型</th>
        <th>
          <span>金额(元)</span>
        </th> 
        <th>
          <span>描述</span>
        </th>
      </thead>
      <tbody>
        <tr v-for="(item,index) in list" :key="'mater_'+index" @click="curIndex = index">
          <td :class="{'col-xh':true,'cur':index==curIndex}">{{index+1}}</td>
          <td>{{item.feeTypeName}}</td> 
          <td>{{item.amount}}</td>
          <td>{{item.describe}}</td>
        </tr>
      </tbody>
    </table>

    <table cellspacing="0" cellpadding="0" v-else>
      <thead>
        <th class="col-xh">序号</th>
        <th class="col-w5">
          <span>费用类型</span>
        </th>
        <th>
          <span>金额(元)</span>
        </th> 
        <th>
          <span>描述</span>
        </th>
      </thead>
      <tbody>
        <tr v-for="(item,index) in list" :key="'mater_'+index" @click="curIndex = index">
          <td :class="{'col-xh':true,'cur':index==curIndex}">
            {{index+1}}
          </td> 
          <td>
            <Select v-model="item.feeType">
              <Option v-for="item in $args.getArgGroup('fee_type')" :value="item.argCode" :key="item.argCode">{{ item.argText }}</Option>
            </Select>
          </td>
          <td> 
            <InputNumber
              style="width:120px;"
              :max="9999999999"              
              :min="0"               
              v-model="item.amount"
              @on-change="computedAmount(item)"
            ></InputNumber>
          </td>
          <td>
             <Input v-model="item.describe" style="width: 300px"></Input> 
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
        feeType: '', 
        amount: 0, 
        describe: ''
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
      this.$emit('on-amount-change', this.sumAmount());
    },
    sumAmount() {
      var totals = 0;
      this.list.map((mater) => {
        totals = floatObj.add(totals, mater.amount);
      });
      return totals;
    },
  }
}

</script>

<style type="text/css">
</style>
