<template>
  <Editable @add="add" @remove="remove" :editable="editable" :model="model">
    <table cellspacing="0" cellpadding="0" v-if="!editable">
      <thead>
        <th class="col-xh">序号</th>
        <th>运输类别</th>
        <th>工程名称</th>
        <th>材料编码</th>
        <th>材料名称</th>
        <th>规格型号</th>
        <th>运输起点</th>
        <th>运输终点</th>
        <th class="col-quantity">运输距离</th>  
        <th>计量单位</th>
        <th class="col-quantity">单价</th>      
      </thead>
      <tbody>
        <tr v-for="(item,index) in list" :key="'mater_'+index" @click="curIndex = index">
          <td>{{index+1}}</td>
          <td>
            {{item.transportType}}
            <!-- 运输类别 -->
          </td>
          <td>
            {{item.projectName}}
            <!--  工程名称 -->
          </td>
          <td>
            {{item.materCode}}
            <!--  材料编码 -->
          </td>
          <td>
            {{item.materName}}
            <!--  材料名称 -->
          </td>
          <td>
            {{item.spec}}
            <!--  规格型号 -->
          </td>
           <td>
            {{item.transportStart}}
            <!--  运输起点 -->
          </td> 
          <td>
            {{item.transportEnd}}
            <!-- 运输终点 -->
          </td>
           <td class="col-quantity">
            {{item.milage}}
            <!-- 运输距离 -->
          </td>
          <td>
            {{$args.getArgText('unit',item.unit)}}
            <!--  计量单位 -->
          </td>
          <td class="col-quantity">
            {{item.unitPrice}}
            <!--  单价 -->
          </td>  
        </tr>
      </tbody>
    </table>

    <table cellspacing="0" cellpadding="0" v-else>
      <thead>
        <th class="col-xh">序号</th>
        <th>运输类别</th>
        <th>工程名称</th>
        <th>材料编码</th>
        <th>材料名称</th>
        <th>规格型号</th>
        <th>运输起点</th>
        <th>运输终点</th>
        <th class="col-quantity">运输距离</th>
        <th>计量单位</th>
        <th class="col-quantity">单价</th>
      </thead>
      <tbody>
        <tr v-for="(item,index) in list" :key="'mater_'+index" @click="curIndex = index">
          <td :class="{'col-xh':true,'cur':index==curIndex}">
            {{index+1}}
            <!--  序号 -->
          </td>
          <td>
            <Select v-model="item.transportType" style="width:120px" @on-change="onTypeChange(index)">
              <Option
                v-for="item in $args.getArgGroup('transport_type')"
                :value="item.argCode"
                :key="item.argCode"
              >{{ item.argText }}</Option>
            </Select>
          </td>
          <td>
            {{item.projectName}}
            <!--  工程名称 -->
          </td>
          <td class="col-select" @click="selMater(item)">
            <Input v-model="item.materCode" :disabled="item.transportType=='内部倒运'||item.transportType=='外弃'" 
            readonly style="width:120px"></Input> 
            <!--  材料编码 -->
          </td>
          <td>
            <Input v-model="item.materName" :disabled="item.transportType=='内部倒运'||item.transportType=='外弃'" 
            readonly style="width:120px"></Input> 
            <!--  材料名称 -->
          </td>
          <td>
            <Input v-model="item.spec" :disabled="item.transportType=='内部倒运'||item.transportType=='外弃'" readonly></Input> 
            <!--  规格型号 -->
          </td>
          <td>
            <Input v-model="item.transportStart" :disabled="item.transportType=='内部倒运'||item.transportType=='运材料'"></Input> 
            <!--  运输起点 -->
          </td>
          <td>
            <Input v-model="item.transportEnd" :disabled="item.transportType=='内部倒运'||item.transportType=='运材料'"></Input> 
            <!--  运输终点 -->
          </td>
          <td class="col-quantity">
            <!--  运输距离 -->
            <InputNumber
              :max="999999"
              :min="0"
              v-model="item.milage"
              :disabled="item.transportType=='内部倒运'"
            ></InputNumber>
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
            <!--  单价 -->
            <InputNumber
              :max="999999"
              :min="0"
              v-model="item.unitPrice"
            ></InputNumber>
          </td> 
        </tr>
      </tbody>
    </table>
    <!-- 选择材料 -->
    <SelectMaterial ref="selmaterial" :transfer="true"></SelectMaterial>
  </Editable>
</template>
<script>
import Editable from '@/components/editable-table';
import floatObj from '@/assets/js/floatObj';
import SelectMaterial from '@/components/material/selmaterial'
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
    project: {
      type: Object,
      default: null
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
        transportType: '',
        projectCode: this.project.projectCode,
        projectName: this.project.projectName,
        materCode: '',//材料编号
        materName: '',//材料名称
        spec: '',//规格型号
        transportStart: '',
        transportEnd: '',
        milage:null,
        unit: '',
        unitPrice: 0,
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
    onTypeChange(index) {
      if(this.list[index].transportType=="内部倒运"){
        this.list[index].materCode='';
        this.list[index].materName='';
        this.list[index].spec='';
        this.list[index].transportStart='';
        this.list[index].transportEnd='';
        this.list[index].milage=null;
      }
      if(this.list[index].transportType=="外弃"){
        this.list[index].materCode='';
        this.list[index].materName='';
        this.list[index].spec='';
      }
      if(this.list[index].transportType=="运材料"){
        this.list[index].transportStart='';
        this.list[index].transportEnd='';
      }
    },
    selMater(row) {
      if(row.transportType=="运材料"){
        var selmaterial = this.$refs.selmaterial;
        selmaterial.show({
          ok: (data) => {
            if (_.findIndex(this.list, { 'materCode': data.materCode }) >= 0) {
              this.$Message.error('物料已存在!');
              return;
            }
            row.materCode = data.materCode;
            row.materName = data.materName;
            row.spec = data.spec;
          }
        });
      }
    },
  }
}

</script>

<style type="text/css">
</style>
