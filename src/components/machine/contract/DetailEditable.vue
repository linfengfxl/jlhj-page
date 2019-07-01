<template>
  <Editable @add="add" @remove="remove" :editable="editable" :model="model">
    <table cellspacing="0" cellpadding="0" v-if="!editable">
      <thead>
        <th class="col-xh">序号</th>
        <th>机械代码</th>
        <th>机械名称</th>
        <th>规格型号</th>
        <th>单位</th>
        <th class="col-quantity">
          <span>数量</span>
        </th>
        <th>
          <span>进场时间</span>
        </th>
      </thead>
      <tbody>
        <tr v-for="(item,index) in list" :key="'mater_'+index" @click="curIndex = index">
          <td>{{index+1}}</td>
          <td>
            {{item.machineCode}}
            <!-- 机械代码 -->
          </td>
          <td>
            {{item.machineName}}
            <!--  机械名称 -->
          </td>
          <td>
            {{item.machineModel}}
            <!--  规格型号 -->
          </td>
          <td>
            {{$args.getArgText('unit',item.unit)}}
            <!--  单位 -->
          </td>
          <td class="col-quantity">
            {{item.taxUnitPrice}}
            <!--  数量 -->
          </td>
          <td>
            {{item.entryTime}}
            <!-- 进场时间 -->
          </td>
        </tr>
      </tbody>
    </table>

    <table cellspacing="0" cellpadding="0" v-else>
      <thead>
        <th class="col-xh">序号</th>
        <th>机械代码</th>
        <th>机械名称</th>
        <th>规格型号</th>
        <th>单位</th>
        <th class="col-quantity">
          <span>数量</span>
        </th>
        <th>
          <span>进场时间</span>
        </th>
      </thead>
      <tbody>
        <tr v-for="(item,index) in list" :key="'mater_'+index" @click="curIndex = index">
          <td :class="{'col-xh':true,'cur':index==curIndex}">
            {{index+1}}
            <!--  序号 -->
          </td>
          <td class="col-select" @click="editable && !isImport &&  selMachine(item)">
            <span>{{item.machineCode}}</span>
            <!--  机械编码 -->
          </td>
          <td>
            {{item.machineName}}
            <!--  机械名称 -->
          </td>
          <td>
            {{item.machineModel}}
            <!--  规格型号 -->
          </td>
          <td>
            <Select v-model="item.unit" style="width:150px" >
              <Option
                v-for="item in $args.getArgGroup('unit')"
                :value="item.argCode"
                :key="item.argCode"
              >{{ item.argText }}</Option>
            </Select>
          </td>
          <td class="col-quantity">
            <!--  数量 -->
            <InputNumber
              :max="999999"
              :min="0"
              v-model="item.taxUnitPrice"
            ></InputNumber>
          </td>
          <td>
            <!--  进场时间 -->
            <Date-picker
              type="datetime"
              placeholder="选择时间"
              v-model="item.entryTime"
            ></Date-picker>
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
        machineCode: '',
        machineName: '',
        machineModel: '',
        unit: '',
        taxUnitPrice: 0,
        entryTime: null,
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
