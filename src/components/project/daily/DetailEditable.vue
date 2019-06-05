<template>
  <Editable @add="add" @remove="remove" :editable="editable" :projectCode="projectCode">
    <table cellspacing="0" cellpadding="0" v-if="!editable">
      <thead>
        <th class="col-xh">序号</th>
        <th>分部分项工程名</th>
        <th>层次编码</th>
        <th>复核工程量</th>
        <th>单位</th>
        <th>部位</th>
        <th>今日计划工程量</th>
        <th>
          <span>今日完成工程量</span>
        </th>
        <th class="col-amount">
          <span>累计完成工程量</span>
        </th>
        <th>
          <span>累计完成工程比</span>
        </th>
        <th class="col-amount">
          <span>起始桩号</span>
        </th>
        <th class="col-amount">
          <span>左右幅</span>
        </th>
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
          <td>
            {{$args.getArgText('unit',item.unit)}}
            <!--  单位 -->
          </td>
          <td>
            {{item.place}}
            <!--  部位 -->
          </td>
          <td>
            {{item.workloadPlan}}
            <!--  今日计划工程量 -->
          </td>
          <td class="col-amount">
            {{item.workload}}
            <!--  今日完成工程量  -->
          </td>
          <td class="col-amount">
            {{item.actualWorkload}}
            <!--  累计完成工程量 -->
          </td>
          <td class="col-amount">
            {{item.actualPercent}}
            <!--  累计完成工程比 -->
          </td>
          <td class="col-amount">
            {{item.startPile}}
            <!--  起始桩号 -->
          </td>
          <td class="col-amount">
            {{item.leftRight}}
            <!--  左右幅 -->
          </td>
        </tr>
      </tbody>
    </table>

    <table cellspacing="0" cellpadding="0" v-else>
      <thead>
        <th class="col-xh">序号</th>
        <th>分部分项工程名</th>
        <th>层次编码</th>
        <th>复核工程量</th>
        <th>单位</th>
        <th>部位</th>
        <th>今日计划工程量</th>
        <th>今日完成工程量</th>
        <th>累计完成工程量</th>
        <th>累计完成工程比</th>
        <th>起始桩号</th>
        <th>左右幅</th>
      </thead>
      <tbody>
        <tr v-for="(item,index) in list" :key="'mater_'+index" @click="curIndex = index">
          <td :class="{'col-xh':true,'cur':index==curIndex}">
            {{index+1}}
            <!--  序号 -->
          </td>
          <td class="col-select" @click="editable && !isImport">
            <span>
              {{item.materCode}}
              <SelectWorkload
                :projectCode="projectCode"
                :text="item.subProjectName"
                @on-select="selProvider(item,arguments[0])"
              />
            </span>
            <!--    -->
          </td>
          <td>
            {{item.levelCode}}
            <!--  层次编码 -->
          </td>
          <td>
            {{item.reviewWorkload}}
            <!--  复核工程量 -->
          </td>
          <td>{{item.unit}}</td>
          <td>{{item.place}}</td>
          <td class="col-quantity">
            <InputNumber :max="999999" :min="0" v-model="item.workloadPlan"></InputNumber>
          </td>
          <td class="col-quantity">
            <InputNumber :max="999999" :min="0" v-model="item.workload"></InputNumber>
          </td>
          <td class="col-quantity">
            <InputNumber :max="999999" :min="0" v-model="item.actualWorkload"></InputNumber>
          </td>
          <td class="col-quantity">
            <InputNumber :max="999999" :min="0" v-model="item.actualPercent"></InputNumber>
          </td>
          <td>
            <Input v-model="item.startPile" placeholder :maxlength="100"/>
          </td>
          <td>
            <RadioGroup v-model="item.leftRight">
              <Radio label="左幅"></Radio>
              <Radio label="右幅"></Radio>
              <Radio label="全幅"></Radio>
            </RadioGroup>
          </td>
        </tr>
      </tbody>
    </table>
  </Editable>
</template>
<script>
import Editable from '@/components/editable-table';
import floatObj from '@/assets/js/floatObj';
import SelectWorkload from '@/components/page/form/SelectWorkload'
export default {
  components: {
    SelectWorkload,
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
