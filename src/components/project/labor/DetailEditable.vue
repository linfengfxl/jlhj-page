<template>
  <Editable @add="add" @remove="remove" :editable="editable">
    <table cellspacing="0" cellpadding="0" v-if="!editable">
      <thead>
         <th class="col-xh">序号</th>
          <th>领工</th>
          <th>技工工作量</th>
          <th>技工加班量</th>
          <th>力工工作量</th>
          <th>力工加班量</th>
          <th>金额</th>
      </thead>
      <tbody>
        <tr v-for="(item,index) in list" :key="'mater_'+index" @click="curIndex = index">
          <td :class="{'col-xh':true,'cur':index==curIndex}">{{index+1}}</td>
          <td>{{item.leader}}</td>
          <td>{{item.skillWorkload}}</td> 
          <td>{{item.skillWorkloadOvertime}}</td>
          <td>{{item.strongWorkload}}</td>
          <td>{{item.strongWorkloadOvertime}}</td>
          <td>{{item.amount}}</td>
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
          <th>金额</th>
      </thead>
      <tbody>
        <tr v-for="(item,index) in list" :key="'mater_'+index" @click="curIndex = index">
          <td :class="{'col-xh':true,'cur':index==curIndex}">
            {{index+1}}
            <!--  序号 -->
          </td>
          <td class="col-select"> 
              <Input v-model="item.leader"/> 
          </td>
          <td>
               <InputNumber :max="999999" :min="0" v-model="item.skillWorkload"></InputNumber>  <!--技工工作量  -->
          </td>
          <td>
               <InputNumber :max="999999" :min="0" v-model="item.skillWorkloadOvertime"></InputNumber>  <!--技工加班量  -->
          </td>
          <td>
               <InputNumber :max="999999" :min="0" v-model="item.strongWorkload"></InputNumber>  <!--力工工作量  -->
          </td> 
          <td>
               <InputNumber :max="999999" :min="0" v-model="item.strongWorkloadOvertime"></InputNumber>  <!--力工加班量  -->
          </td>    
          <td> <InputNumber :max="999999" :min="0" v-model="item.amount"></InputNumber></td><!--金额	--> 
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
        skillWorkload: null,//技工工作量
        skillWorkloadOvertime:null,//技工加班量
        strongWorkload: null,//力工工作量
        strongWorkloadOvertime: null,//力工工作加班量
        amount:null,//金额
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
  }
}

</script>

<style type="text/css">
</style>
