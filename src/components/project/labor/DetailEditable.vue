<template>
  <Editable @add="add" @remove="remove" :editable="editable">
    <table cellspacing="0" cellpadding="0" v-if="!editable">
      <thead>
        <th class="col-xh">序号</th>
        <th>领工</th> 
        <th>人数</th>
        <th>金额</th> 
      </thead>
      <tbody>
        <tr v-for="(item,index) in list" :key="'mater_'+index" @click="curIndex = index">
          <td :class="{'col-xh':true,'cur':index==curIndex}">{{index+1}}</td>
          <td>{{item.leader}}</td> 
          <td>{{item.workload}}</td>
          <td>{{item.amount}}</td> 
        </tr>
      </tbody>
    </table>

    <table cellspacing="0" cellpadding="0" v-else>
      <thead>
        <th class="col-xh">序号</th>
        <th>领工</th> 
        <th>人数</th>
        <th>金额</th> 
      </thead>
      <tbody>
        <tr v-for="(item,index) in list" :key="'mater_'+index" @click="curIndex = index">
          <td :class="{'col-xh':true,'cur':index==curIndex}">
            {{index+1}}
            <!--  序号 -->
          </td>
          <td class="col-select">
            <div style="width:100px;">
              <Input v-model="item.leader"/>
            </div>
          </td>
          <td>
            <InputNumber :max="999999" :min="0" v-model="item.workload"   @on-change="computedWorkload(item)"></InputNumber>
            <!--人数  -->
          </td>  
          <td>
            <InputNumber
              :max="999999"
              :min="0"
              v-model="item.amount"
              @on-change="computedAmount(item)"
            ></InputNumber>
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
      this.$emit('on-amount-change', this.sumAmount());
      this.$emit('on-workload-change', this.sumWorkload());
    }
  },
  methods: {
    load() {

    },
    listNewRow() {
      var def = {
        id: 0,
        leader:'',//领工
        workload: null,//人数 
        amount: null,//金额
        remak: '',
        files: '',
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
      this.$emit('on-amount-change', this.sumAmount());
      this.$emit('on-workload-change', this.computedWorkload());
    },
    computedAmount(item) {
      this.$emit('on-amount-change', this.sumAmount());
    },
    computedWorkload(){
      this.$emit('on-workload-change', this.sumWorkload());
    },
    sumAmount() {
      var totals = 0;
      this.list.map((mater) => {
        totals = floatObj.add(totals, mater.amount);
      });
      return totals;
    },
    sumWorkload(){
      var totals = 0;
      this.list.map((mater) => {
        totals = floatObj.add(totals, mater.workload);
      });
      return totals;
    }
  }
}

</script>

<style type="text/css">
</style>
