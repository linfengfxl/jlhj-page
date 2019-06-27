<template>
  <Editable @add="add" @remove="remove" :editable="editable">
    <table cellspacing="0" cellpadding="0" v-if="!editable">
      <thead>
        <th class="col-xh">序号</th>
        <th>领工</th>
        <th>技工人数</th>
        <th>技工加班（h）</th>
        <th>力工人数</th>
        <th>力工加班（h）</th>
        <th>金额</th>
        <th>备注</th>
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
          <th>{{item.remark}}</th>
        </tr>
      </tbody>
    </table>

    <table cellspacing="0" cellpadding="0" v-else>
      <thead>
        <th class="col-xh">序号</th>
        <th>领工</th>
        <th>技工人数</th>
        <th>技工加班（h）</th>
        <th>力工人数</th>
        <th>力工加班（h）</th>
        <th>金额</th>
        <th>备注</th>
        <th>附件</th>
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
            <InputNumber :max="999999" :min="0" v-model="item.skillWorkload"></InputNumber>
            <!--技工工作量  -->
          </td>
          <td>
            <InputNumber :max="999999" :min="0" v-model="item.skillWorkloadOvertime"></InputNumber>
            <!--技工加班量  -->
          </td>
          <td>
            <InputNumber :max="999999" :min="0" v-model="item.strongWorkload"></InputNumber>
            <!--力工工作量  -->
          </td>
          <td>
            <InputNumber :max="999999" :min="0" v-model="item.strongWorkloadOvertime"></InputNumber>
            <!--力工加班量  -->
          </td>
          <td>
            <InputNumber
              :max="999999"
              :min="0"
              v-model="item.amount"
              @on-change="computedAmount(item)"
            ></InputNumber>
          </td>
          <!--金额	-->
          <td>
            <div style="width:100px;">
              <Input v-model="item.remark"/>
            </div>
          </td>
          <td>
            <UploadBox v-model="item.files" :readonly="false"></UploadBox>
          </td>
        </tr>
      </tbody>
    </table>
  </Editable>
</template>
<script>
import Editable from '@/components/editable-table';
import floatObj from '@/assets/js/floatObj';
import UploadBox from '@/components/upload/Index';
export default {
  components: {
    UploadBox,
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
    }
  },
  methods: {
    load() {

    },
    listNewRow() {
      var def = {
        id: 0,
        skillWorkload: null,//技工工作量
        skillWorkloadOvertime: null,//技工加班量
        strongWorkload: null,//力工工作量
        strongWorkloadOvertime: null,//力工工作加班量
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
    },
    computedAmount(item) {
      this.$emit('on-amount-change', this.sumAmount());
    },
    sumAmount() {
      var totals = 0;
      this.list.map((mater) => {
        totals = floatObj.add(totals, mater.amount);
      });
      return totals;
    },
  }
}

</script>

<style type="text/css">
</style>
