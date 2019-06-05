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
        <th>时间</th>
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
            <DatePicker
              type="datetimerange"
              format="yyyy-MM-dd HH:mm"
              v-model="item.times"
              placeholder="选择时间"
              style="width: 300px"
              @on-change="computedAmount(item)"
            ></DatePicker>
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
      item.startTime = item.times[0];
      item.endTime = item.times[1];
      item.useTime = this.getInervalHour(item.startTime, item.endTime);//作业用时
      item.taiban = floatObj.divide(item.useTime, 8, 3);//作业台班 默认为作业用时/8，可以手工输入或修改

    },
    getInervalHour(sDate1, sDate2) {
      var oDate1, oDate2;
      oDate1 = new Date(sDate1).getTime();
      oDate2 = new Date(sDate2).getTime();
      var TotalMilliseconds = oDate2 - oDate1;//相差的毫秒数
      if (isNaN(TotalMilliseconds) || TotalMilliseconds < 0) {
        return 0;
      }
      var hours = TotalMilliseconds / 1000 / 60 / 60;//除1000是毫秒，不加是秒  
      return hours.toFixed(3);
    }
  }
}

</script>

<style type="text/css">
</style>
