<template>
  <Editable @add="add" @remove="remove" :editable="editable" :projectCode="projectCode">
    <table cellspacing="0" cellpadding="0" v-if="!editable">
      <thead>
        <th class="col-xh">序号</th>
        <th>单号</th>
      </thead>
      <tbody>
        <tr v-for="(item,index) in list" :key="'mater_'+index" @click="curIndex = index">
          <td>{{index+1}}</td>
          <td>{{item.machineOrderId}}</td>
        </tr>
      </tbody>
    </table>

    <table cellspacing="0" cellpadding="0" v-else>
      <thead>
        <th class="col-xh">序号</th>
        <th>单号</th>
      </thead>
      <tbody>
        <tr v-for="(item,index) in list" :key="'mater_'+index" @click="curIndex = index">
          <td :class="{'col-xh':true,'cur':index==curIndex}">
            {{index+1}}
            <!--  序号 -->
          </td>
          <td @click="editable && !isImport">
            <span>{{item.machineOrderId}}</span>
            <!--    -->
          </td>
        </tr>
      </tbody>
    </table>
    <SelectMachineOrder ref="selectMachineOrder" :projectCode="projectCode"></SelectMachineOrder>
  </Editable>
</template>
<script>
import Editable from '@/components/editable-table';
import floatObj from '@/assets/js/floatObj';
import SelectMachineOrder from '@/components/machine/order/SelectMachineOrder'// '@/components/page/form/SelectWorkload'
export default {
  components: {
    SelectMachineOrder,
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
        if (_.findIndex(this.list, { 'workloadId': args.workloadId }) >= 0) {
          this.$Message.error('已存在!');
          return;
        }
        item.workloadId = args.workloadId;
        item.subProjectName = args.subProjectName; //分部分项工程名  
        item.levelCode = args.levelCode;//层次编码 
        item.reviewWorkload = args.reviewWorkload;//复核工程量 
        item.unit = args.unit;//单位   
      }
    },
    load() {

    },
    listNewRow() {
      var def = {
        id: 0,
        workloadId: '',
        projectCode: '',//分部分项工程名 
        levelCode: '',//层次编码 
        reviewWorkload: '',//复核工程量 
        unit: '',//单位  
        place: '',//部位
        workloadPlan: 0,//今日计划工程量
        workload: 0,//今日完成工程量 
        actualWorkload: 0,//累计完成工程量 
        actualPercent: 0,//累计完成工程比 
        startPile: '',//起始桩号 
        leftRight: '',//左右幅
      };
      return def;
    },
    add() {
      // if (!this.isImport) {
      //   this.list.push(this.listNewRow());
      // }
      var sel = this.$refs.selectMachineOrder;//引用该控件，赋值给变量对象
      sel.show({
        ok: (data) => {
          console.log(data);
          if (data) {
            var that = this;
            data.map(args => {
              if (_.findIndex(that.list, { 'machineOrderId': args.machineOrderId }) >= 0) {

              } else {
                var item = this.listNewRow();
                Object.assign(item, args);
                item.machineOrderId = args.machineOrderId;//  
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
