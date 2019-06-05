<template>
  <Editable @add="add" @remove="remove" :editable="editable" :projectCode="projectCode">
    <table cellspacing="0" cellpadding="0" v-if="!editable">
      <thead>
        <th class="col-xh">序号</th>
        <th>领工</th>
        <th>技工工作量</th>
        <th>技工加班量</th>
        <th>力工工作量</th>
        <th>力工加班量</th>
        <th>备注</th>
      </thead>
      <tbody>
        <tr v-for="(item,index) in list" :key="'mater_'+index" @click="curIndex = index">
          <td>{{index+1}}</td>
          <td>
            {{item.projectCode}}
            <!--  分部分项工程名 -->
          </td>
          <td>
            {{item.levelCode}}
            <!--  层次编码  -->
          </td>
          <td>
            {{item.reviewWorkload}}
            <!--  复核工程量  -->
          </td>
         
          <td class="col-price">
            {{item.place}}
            <!--  部位 -->
          </td>
          <td class="col-amount">
            {{item.workloadPlan}}
            <!--  今日计划工程量 -->
          </td>
          <td class="col-amount">
            {{item.workload}}
            <!--  今日完成工程量  -->
          </td> 
        </tr>
      </tbody>
    </table>

    <table cellspacing="0" cellpadding="0" v-else>
      <thead>
        <th class="col-xh">序号</th>
        <th>领工</th>
        <th>技工工作量</th>
        <th>技工加班量</th>
        <th>力工工作量</th>
        <th>力工加班量</th>
        <th>备注</th>
      </thead>
      <tbody>
        <tr v-for="(item,index) in list" :key="'mater_'+index" @click="curIndex = index">
          <td :class="{'col-xh':true,'cur':index==curIndex}">
            {{index+1}}
            <!--  序号 -->
          </td>
          <td class="col-select" @click="editable && !isImport">
            <span>
              <InputNumber :max="999999" :min="0" v-model="item.workloadPlan"></InputNumber>
            </span>
          </td>
          <td>
            <InputNumber :max="999999" :min="0" v-model="item.workloadPlan"></InputNumber>
          </td>
          <td>
            <InputNumber :max="999999" :min="0" v-model="item.workloadPlan"></InputNumber>
          </td>
          <td class="col-amount">
            <InputNumber :max="999999" :min="0" v-model="item.workloadPlan"></InputNumber>
          </td>
          <td class="col-amount">
            <InputNumber :max="999999" :min="0" v-model="item.workload"></InputNumber>
          </td>
          <td class="col-amount">
            <InputNumber :max="999999" :min="0" v-model="item.actualWorkload"></InputNumber>
          </td>
        </tr>
      </tbody>
    </table>
  </Editable>
</template>
<script>
import Editable from '@/components/editable-table';
import floatObj from '@/assets/js/floatObj';
import SelectMaterial from '@/components/page/form/SelectWorkload'
export default {
  components: {
    SelectMaterial,
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
    debugger;

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
        item.subProjectName = args.subProjectName; //分部分项工程名  
        item.levelCode = args.levelCode;//层次编码 
        item.reviewWorkload = args.reviewWorkload;//复核工程量 
        item.unit = args.unit;//单位  
        item.place = args.place;//部位
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
        workloadPlan: '',//今日计划工程量
        workload: '',//今日完成工程量 
        actualWorkload: '',//累计完成工程量 
        actualPercent: '',//累计完成工程比 
        startPile: '',//起始桩号 
        leftRight: '',//左右幅
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
  }
}

</script>

<style type="text/css">
</style>
