<template>
  <Editable @add="add" @remove="remove" :editable="editable">
    <table cellspacing="0" cellpadding="0" v-if="!editable">
      <thead>
        <th class="col-xh">序号</th>
        <th>日期</th>
        <th class="col-price">计量金额</th>
        <th class="col-price">批复金额</th>
        <th>附件</th>
      </thead>
      <tbody>
        <tr v-for="(item,index) in list" :key="'mater_'+index">
          <td>
            {{index+1}}
            <!--  序号 -->
          </td>
          <td>
            {{item.meteringDate}}
          </td>
          <td class="col-price">
            {{item.meteringAmount}}
          </td>
          <td class="col-price">
            {{item.replyAmount}}
          </td>
          <td>
            {{item.files}}
          </td>
        </tr>
      </tbody>
    </table>

    <table cellspacing="0" cellpadding="0" v-else>
      <thead>
        <th class="col-xh">序号</th>
        <th>日期</th>
        <th class="col-price">计量金额</th>
        <th class="col-price">批复金额</th>
        <th>附件</th>
      </thead>
      <tbody>
        <tr v-for="(item,index) in list" :key="'mater_'+index" @click="curIndex = index">
          <td :class="{'col-xh':true,'cur':index==curIndex}">
            {{index+1}}
            <!--  序号 -->
          </td>
          <td>
            <Date-picker
              type="date"
              placeholder="选择日期"
              v-model="item.meteringDate"
              format="yyyy-MM-dd"
            ></Date-picker> 
          </td>
          <td>
            <InputNumber
              style="width:80px;"
              :max="9999999999"              
              :min="0"               
              v-model="item.meteringAmount"
              @on-change="computedAmount(index)"
            ></InputNumber>
          </td>
          <td>
            <InputNumber
              style="width:80px;"
              :max="9999999999"              
              :min="0"               
              v-model="item.replyAmount"
              @on-change="computedAmount(index)"
            ></InputNumber>
          </td>
          <td>
            <UploadBox v-model="item.files" :readonly="false" style="width:300px;"></UploadBox>
          </td>
        </tr>
      </tbody>
    </table>
  </Editable>
</template>
<script>
import Editable from "@/components/editable-table";
import floatObj from "@/assets/js/floatObj"; 
import UploadBox from '@/components/upload/Index';
export default {
  components: { 
    Editable,
    UploadBox
  },
  props: {
    list: {
      type: Array,
      default: function() {
        var arr = [];
      }
    },
    editable: {
      type: Boolean,
      default: false
    },
    model: {
      type: Object,
      default: null
    },
    edit: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      curIndex: 0,
    };
  },
  mounted: function() {},
  computed: {},
  watch: {
    list(val, old) {
      this.$emit("on-amount-change", this.sumAmount());
    }
  },
  methods: {
    load() {},
    listNewRow() {
      var def = {
        id:null,
        projectCode:this.model.projectCode,
        meteringDate: "", 
        meteringAmount: 0, 
        replyAmount: null, 
        files: "", 
      };
      return def;
    },
    add() {
      if (!this.isImport) {
        this.list.push(this.listNewRow());
      }
    },
    remove() {
      if(this.list[this.curIndex].id!=null){
        this.$Message.error("历史数据无法删除");
        return;
      }
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
    computedAmount(index) {
      this.$emit("on-amount-change", this.sumAmount());
    },
    sumAmount() {
      var totals = {
        totalMeteringAmount:0,
        totalReplyAmount:0,
      };
      this.list.map(mater => {
        totals.totalMeteringAmount = floatObj.add(totals.totalMeteringAmount, mater.meteringAmount);
        if(mater.replyAmount!=null){
          totals.totalReplyAmount = floatObj.add(totals.totalReplyAmount, mater.replyAmount);
        }   
      });
      return totals;
    }
  }
};
</script>

<style type="text/css">
</style>
