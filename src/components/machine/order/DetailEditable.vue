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
        useTime: null,//作业用时:结束时间-开始时间
        taiban: null,//作业台班:默认为作业用时/8
      };
      return def;
    },
    add() {
      this.list.push(this.listNewRow());
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
    computedAmount(item) {
      if (item.startTime && item.endTime) {
        item.useTime = this.dateDiff(item.startTime, item.endTime);//作业用时
        item.taiban = floatObj.divide(item.useTime, 8, 2);//作业台班 默认为作业用时/8，可以手工输入或修改
      }
    },
    dateDiff(date1, date2) {
      var type1 = typeof date1, type2 = typeof date2;
      if (type1 == 'string')
        date1 = stringToTime(date1);
      else if (date1.getTime)
        date1 = date1.getTime();
      if (type2 == 'string')
        date2 = stringToTime(date2);
      else if (date2.getTime)
        date2 = date2.getTime();
      return (date2 - date1) / 1000 / 60 / 60 / 24;//除1000是毫秒，不加是秒   
    }
  }
}

</script>

<style type="text/css">
</style>
