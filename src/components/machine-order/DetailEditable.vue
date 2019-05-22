<template>
  <Editable @add="add" @remove="remove" :editable="editable">
    <table cellspacing="0" cellpadding="0" v-if="!editable">
      <thead>
        <th class="col-xh">序号</th>
        <th>开始时间</th>
        <th>结束时间</th>
        <th>作业用时</th>
        <th>作业台班</th>
      </thead>
      <tbody>
        <tr v-for="(item,index) in list" :key="'mater_'+index" @click="curIndex = index">
          <td :class="{'col-xh':true,'cur':index==curIndex}">{{index+1}}</td>
          <td>{{item.startTime}}</td>
          <td>{{item.endTime}}</td>
          <td>{{item.useTime}}</td>
          <td>{{item.taiban}}</td>
        </tr>
      </tbody>
    </table>

    <table cellspacing="0" cellpadding="0" v-else>
      <thead>
        <th class="col-xh">序号</th>
        <th>开始时间</th>
        <th>结束时间</th>
        <th>作业用时</th>
        <th>作业台班</th>
      </thead>
      <tbody>
        <tr v-for="(item,index) in list" :key="'mater_'+index" @click="curIndex = index">
          <td :class="{'col-xh':true,'cur':index==curIndex}">
            {{index+1}}
            <!--  序号 -->
          </td>
          <td class="col-select">
            <Date-picker
              type="date"
              placeholder="选择日期"
              v-model="item.startTime"
              format="yyyy-MM-dd"
              @on-change="computedAmount(item)"
            ></Date-picker>
          </td>
          <td>
            <Date-picker
              type="date"
              placeholder="选择日期"
              v-model="item.endTime"
              format="yyyy-MM-dd"
              @on-change="computedAmount(item)"
            ></Date-picker>
          </td>
          <td>{{item.useTime}}</td>
          <td>
            <InputNumber :max="999999" :min="0" v-model="item.taiban"></InputNumber>
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
        type: 2,//入库
        startTime: '',//开始时间
        endTime: '',//结束时间
        useTime: '',//作业用时:结束时间-开始时间
        taiban: '',//作业台班:默认为作业用时/8
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
      item.useTime = 0;//作业用时
      item.taiban = 0;//作业台班
    },

  }
}

</script>

<style type="text/css">
</style>
