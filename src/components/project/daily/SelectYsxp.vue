<template>
  <Editable @add="add" @remove="remove" :editable="editable" :projectCode="projectCode">
    <table cellspacing="0" cellpadding="0" v-if="!editable">
      <thead>
        <th class="col-xh">序号</th>
        <th>单号</th>
        <th>运输类型</th>
        <th>运输设备名称</th>
        <th>运输起点</th>
        <th>运输终点</th>
        <th>数量</th>
        <th>单位</th>
        <th>里程数</th>
      </thead>
      <tbody>
        <tr v-for="(item,index) in list" :key="'mater_'+index" @click="curIndex = index">
          <td>{{index+1}}</td>
          <td>{{item.transportOrderId}}</td>
          <td>{{item.transportType}}</td>
          <td>{{item.machineName}}</td>
          <td>{{item.transportStart}}</td>
          <td>{{item.transportEnd}}</td>
          <td>{{item.num}}</td>
          <td>{{item.unit}}</td>
          <td>{{item.milage}}</td>
        </tr>
      </tbody>
    </table>

    <table cellspacing="0" cellpadding="0" v-else>
      <thead>
        <th class="col-xh">序号</th>
        <th>单号</th>
        <th>运输类型</th>
        <th>运输设备名称</th>
        <th>运输起点</th>
        <th>运输终点</th>
        <th>数量</th>
        <th>单位</th>
        <th>里程数</th>
      </thead>
      <tbody>
        <tr v-for="(item,index) in list" :key="'mater_'+index" @click="curIndex = index">
          <td :class="{'col-xh':true,'cur':index==curIndex}">
            {{index+1}}
            <!--  序号 -->
          </td>
          <td @click="editable && !isImport">
            <span>{{item.transportOrderId}}</span>
          </td>
          <td>{{item.transportType}}</td>
          <td>{{item.machineName}}</td>
          <td>{{item.transportStart}}</td>
          <td>{{item.transportEnd}}</td>
          <td>{{item.num}}</td>
          <td>{{item.unit}}</td>
          <td>{{item.milage}}</td>
        </tr>
      </tbody>
    </table>
    <selectTransportOrder ref="selectTransportOrder" :projectCode="projectCode"></selectTransportOrder>
  </Editable>
</template>
<script>
import Editable from '@/components/editable-table';
import floatObj from '@/assets/js/floatObj';
import SelectTransportOrder from './SelectYsxp2'// 
export default {
  components: {
    SelectTransportOrder,
    Editable,
  },
  props: {
    list: {
      type: Array,
      default: function () {
        var arr = [];
      }
    },
    projectCode: {
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
      // this.$emit('on-amount-change', this.sumAmount());
    }
  },
  methods: {
    selProvider(item, args) {
      if (args) {
        if (_.findIndex(this.list, { 'transportOrderId': args.transportOrderId }) >= 0) {
          this.$Message.error('已存在!');
          return;
        }
        item.transportOrderId = args.transportOrderId;

      }
    },
    load() {

    },
    listNewRow() {
      var def = {
        id: 0,
        transportOrderId: '',
        transportType: '',
        machineName: '',//运输设备名称 
        transportStart: '',//起点
        transportEnd: '',//终点
        num: '',
        unit: '',
        milage: ''
      };
      return def;
    },
    add() {
      // if (!this.isImport) {
      //   this.list.push(this.listNewRow());
      // }
      var sel = this.$refs.selectTransportOrder;//引用该控件，赋值给变量对象
      sel.show({
        ok: (data) => {
          console.log(data);
          if (data) {
            var that = this;
            data.map(args => {
              if (_.findIndex(that.list, { 'transportOrderId': args.transportOrderId }) >= 0) {

              } else {
                var item = this.listNewRow();
                Object.assign(item, args);
                item.transportOrderId = args.transportOrderId;
                item.transportType = args.transportType;
                item.machineName = args.machineName;
                item.transportStart = args.transportStart;
                item.transportEnd = args.transportEnd;
                item.num = args.num;
                item.unit = args.unit;
                item.milage = args.milage;
                that.list.push(item);
              }
            })

          }
        }
      });

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
    computedWorkload(item) {
      console.log(item.workload)
      item.actualWorkload = floatObj.add(item.workload, item.quantity);//累计完成工程量  
      item.actualPercent = floatObj.multiply(floatObj.divide(item.actualWorkload, item.designWorkload), 100);//累计完成工程比  
    },
  }
}

</script>

<style type="text/css">
</style>
