<template>
  <Editable @add="add" @remove="remove" :editable="editable" :projectCode="projectCode">
    <table cellspacing="0" cellpadding="0" v-if="!editable">
      <thead>
        <th class="col-xh">序号</th>
        <th>单号</th>
        <th>材料名称</th>
        <th>规格型号</th>
        <th>单位</th>
        <th>数量</th>
      </thead>
      <tbody>
        <tr v-for="(item,index) in list" :key="'mater_'+index" @click="curIndex = index">
          <td>{{index+1}}</td>
          <td>{{item.id}}</td>
          <td>{{item.materName}}</td>
          <td>{{item.spec}}</td>
          <td>{{item.unit}}</td>
          <td>{{item.quantity}}</td>
        </tr>
      </tbody>
    </table>

    <table cellspacing="0" cellpadding="0" v-else>
      <thead>
        <th class="col-xh">序号</th>
        <th>单号</th>
        <th>材料名称</th>
        <th>规格型号</th>
        <th>单位</th>
        <th>数量</th>
      </thead>
      <tbody>
        <tr v-for="(item,index) in list" :key="'mater_'+index" @click="curIndex = index">
          <td :class="{'col-xh':true,'cur':index==curIndex}">
            {{index+1}}
            <!--  序号 -->
          </td>
          <td @click="editable && !isImport">
            <span>{{item.id}}</span>
            <!--    -->
          </td>
          <td>{{item.materName}}</td>
          <td>{{item.spec}}</td>
          <td>{{item.unit}}</td>
          <td>{{item.quantity}}</td>
        </tr>
      </tbody>
    </table>
    <SelectInstock ref="selectWorkload" :projectCode="projectCode"></SelectInstock>
  </Editable>
</template>
<script>
import Editable from '@/components/editable-table';
import floatObj from '@/assets/js/floatObj';
import SelectInstock from './SelectRkd2'// 
export default {
  components: {
    SelectInstock,
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
    load() {

    },
    listNewRow() {
      var def = {
        id: 0,
        materName: '',
        spec: '',// 
        unit: '',// 
        quantity: '',// 
      };
      return def;
    },
    add() {
      // if (!this.isImport) {
      //   this.list.push(this.listNewRow());
      // }
      var sel = this.$refs.selectWorkload;//引用该控件，赋值给变量对象
      sel.show({
        ok: (data) => {
          console.log(data);
          if (data) {
            var that = this;
            data.map(args => {
              if (_.findIndex(that.list, { 'id': args.id }) >= 0) {

              } else {
                var item = this.listNewRow();
                Object.assign(item, args);
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
  }
}

</script>

<style type="text/css">
</style>
