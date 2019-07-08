<template>
  <Editable @add="add" @remove="remove" @importExcel="importExcel" @exportDown="exportDownModel" :editable="editable" :model="model">
    <table cellspacing="0" cellpadding="0" v-if="!editable">
      <thead>
        <th class="col-xh">序号</th>
        <th>分包工序</th>
        <th>工作内容</th>
        <th>计量单位</th>
        <th class="col-quantity">计划工作量</th>
        <th class="col-price">分包单价</th>
        <th class="col-price">合价</th>
        <th class="col-quantity">累计计划工程量</th>
        <th>备注</th>
      </thead>
      <tbody>
        <tr v-for="(item,index) in list" :key="'mater_'+index" @click="curIndex = index">
          <td>{{index+1}}</td>
          <td>
            {{item.subProcess}}
          </td>
          <td>
            {{item.content}}
          </td>
          <td>
            {{$args.getArgText('unit',item.unit)}}
          </td>
          <td class="col-quantity">
            {{item.planWorkload}}
          </td>
          <td class="col-price">
            {{item.subPrice}}
          </td>
          <td class="col-price">
            {{item.amount}}
          </td>
          <td class="col-quantity">
            {{item.totalWorkload}}
          </td>
          <td>
            {{item.remark}}
          </td>
        </tr>
      </tbody>
    </table>

    <table cellspacing="0" cellpadding="0" v-else>
      <thead>
        <th class="col-xh">序号</th>
        <th>分包工序</th>
        <th>工作内容</th>
        <th>计量单位</th>
        <th class="col-quantity">计划工作量</th>
        <th class="col-price">分包单价</th>
        <th class="col-price">合价</th>
        <th>备注</th>
      </thead>
      <tbody>
        <tr v-for="(item,index) in list" :key="'mater_'+index" @click="curIndex = index">
          <td :class="{'col-xh':true,'cur':index==curIndex}">
            {{index+1}}
            <!--  序号 -->
          </td>
          <td>
            <Input v-model="item.subProcess" style="width: 150px;"></Input> 
          </td>
          <td>
            <Input v-model="item.content" style="width: 200px;"></Input> 
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
            <InputNumber
              :max="999999"
              :min="0"
              v-model="item.planWorkload"
              @on-change="onAmountChange(item)"
            ></InputNumber>
          </td>
          <td class="col-quantity">
            <InputNumber
              :max="999999"
              :min="0"
              v-model="item.subPrice"
              @on-change="onAmountChange(item)"
            ></InputNumber>
          </td>
           <td class="col-quantity">
           {{item.amount}}
          </td>
          <td>
            <Input v-model="item.remark" style="width: 200px;"></Input> 
          </td>
        </tr>
      </tbody>
    </table>
  </Editable>
</template>
<script>
import Editable from './Editable';
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
      ExcelList:[],
      total:{
        planWorkload:0,
        amount:0,
      }
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
        subProcess: '',
        content: '',
        unit: '',
        planWorkload: 0,
        subPrice: 0,
        amount: 0,
        remark: '',
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
    onAmountChange(item){
      item.amount=parseFloat(floatObj.multiply(item.planWorkload,item.subPrice));
      this.list.map(mater => {
        this.total.planWorkload = parseFloat(floatObj.add(this.total.planWorkload, mater.planWorkload));
        this.total.amount = parseFloat(floatObj.add(this.total.amount, mater.amount));
      });
      this.$emit("on-amount-change", this.total);
    },
    //导入excel
    importExcel(fileId){
      this.$http.post('/api/engine/sub/plan/import', {fileId:fileId}).then((res) => {
        if (res.data.code === 0) {
          this.ExcelList=res.data.data;
          var reg = /(^[\-0-9][0-9]*(.[0-9]+)?)$/;
          var pattern = new RegExp(reg);
          if(this.ExcelList.length>0){
            //明细
            var obj={};
            for(var i=0;i<this.ExcelList.length;i++){
                obj = {
                  subProcess: this.ExcelList[i][0], 
                  content: this.ExcelList[i][1], 
                  unit: this.ExcelList[i][2], 
                  planWorkload: pattern.test(this.ExcelList[i][3])?parseFloat(this.ExcelList[i][3]):0, 
                  subPrice: pattern.test(this.ExcelList[i][4])?parseFloat(this.ExcelList[i][4]):0, 
                  amount: pattern.test(this.ExcelList[i][5])?parseFloat(this.ExcelList[i][5]):0, 
                  remark: this.ExcelList[i][6],   
                }
                obj.amount=parseFloat(floatObj.multiply(obj.planWorkload,obj.subPrice));
              this.list.push(obj);
            }
            this.list.map(mater => {
              this.total.planWorkload = parseFloat(floatObj.add(this.total.planWorkload, mater.planWorkload));
              this.total.amount = parseFloat(floatObj.add(this.total.amount, mater.amount));
            });
            this.$emit("on-amount-change", this.total);
            this.$Message.success("共导入" + this.ExcelList.length + "条明细");
          }else{
            this.$Message.error("无数据导入");
          }     
        } else {
          this.$Message.error(res.data.message)
        }
      }).catch((error) => {
        this.$Message.error(error.toString())
      });
    },
    exportDownModel(){
      this.loading = 1;         
      this.$http.post('/api/engine/sub/plan/import', {_action:'exportModel'}).then((res) => {
        this.loading = 0;
        if (res.data.code === 0) { 
          this.loading = 0;
          var data = res.data.data;
          window.open(this.$http.defaults.baseURL + '/api/file/download?fileId=' + data);
        } else {
          this.loading = 0;             
          this.$Message.error(res.data.message);
        }
      }).catch((error) => {
        this.loading = 0;
        this.$Message.error("请求失败，请重新发送")
      });
    },
  }
}

</script>

<style type="text/css">
</style>
