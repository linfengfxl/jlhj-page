<template>
  <Editable @add="add" @remove="remove" :editable="editable" :editprice="editprice" :model="model">
    <table cellspacing="0" cellpadding="0" v-if="!editable">
      <thead>
        <th class="col-xh">序号</th>
        <th>材料编码</th>
        <th>材料名称</th>
        <th>规格型号</th>
        <th>单位</th>
        <th>
          <span>数量</span>
        </th>
        <th v-if="$user.hasPower('wdsx.rkdxgjg')">
          <span>含税单价(元)</span>
        </th>
        <th v-if="$user.hasPower('wdsx.rkdxgjg')">
          <span>单价(元)</span>
        </th>
        <th v-if="$user.hasPower('wdsx.rkdxgjg')">
          <span>金额(元)</span>
        </th>
        <th v-if="$user.hasPower('wdsx.rkdxgjg')">
          <span>税额(元)</span>
        </th>
      </thead>
      <tbody>
        <tr v-for="(item,index) in list" :key="'mater_'+index" @click="curIndex = index">
          <td>{{index+1}}</td>
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
            {{$args.getArgText('unit',item.unit)}}
            <!--  单位 -->
          </td>
          <td class="col-quantity">
            {{item.quantity}}
            <!--  数量 -->
          </td>
          <td class="col-price" v-if="$user.hasPower('wdsx.rkdxgjg')">
            <!-- {{item.taxUnitPrice}} -->
            <!--  含税单价(元) -->
            <template v-if="editprice">
              <InputNumber
                :max="999999"
                :min="0"
                v-model="item.taxUnitPrice"
                @on-change="computedAmount(item)"
              ></InputNumber>
            </template>
            <template v-else>{{item.taxUnitPrice}}</template>
            <!--  含税单价(元) -->
          </td>
          <td class="col-amount" v-if="$user.hasPower('wdsx.rkdxgjg')">
            {{item.unitPrice}}
            <!--  单价(元) -->
          </td>
          <td class="col-amount" v-if="$user.hasPower('wdsx.rkdxgjg')">
            {{item.amount}}
            <!--  金额(元) -->
          </td>
          <td class="col-amount" v-if="$user.hasPower('wdsx.rkdxgjg')">
            {{item.tax}}
            <!--  税额(元) -->
          </td>
        </tr>
      </tbody>
    </table>

    <table cellspacing="0" cellpadding="0" v-else>
      <thead>
        <th class="col-xh">序号</th>
        <th>材料编码</th>
        <th>材料名称</th>
        <th>规格型号</th>
        <th>单位</th>
        <th class="col-quantity">
          <span>数量</span>
        </th>
        <th class="col-price" v-if="$user.hasPower('wdsx.rkdxgjg')">
          <span>含税单价(元)</span>
        </th>
        <th class="col-price" v-if="$user.hasPower('wdsx.rkdxgjg')">
          <span>单价(元)</span>
        </th>
        <th class="col-amount" v-if="$user.hasPower('wdsx.rkdxgjg')">
          <span>金额(元)</span>
        </th>
        <th class="col-amount" v-if="$user.hasPower('wdsx.rkdxgjg')">
          <span>税额(元)</span>
        </th>
      </thead>
      <tbody>
        <tr v-for="(item,index) in list" :key="'mater_'+index" @click="curIndex = index">
          <td :class="{'col-xh':true,'cur':index==curIndex}">
            {{index+1}}
            <!--  序号 -->
          </td>
          <td class="col-select" @click="editable && !isImport &&  selMater(item)">
            <span>{{item.materCode}}</span>
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
            {{$args.getArgText('unit',item.unit)}}
            <!--  单位 -->
          </td>
          <td class="col-quantity">
            <!--  数量 -->
            <InputNumber
              :max="999999"
              :min="0"
              v-model="item.quantity"
              @on-change="computedAmount(item)"
            ></InputNumber>
          </td>
          <td class="col-price" v-if="$user.hasPower('wdsx.rkdxgjg')">
            <!--  含税单价(元) -->
            <InputNumber
              :max="999999"
              :min="0"
              v-model="item.taxUnitPrice"
              @on-change="computedAmount(item)"
            ></InputNumber>
          </td>
          <td class="col-amount" v-if="$user.hasPower('wdsx.rkdxgjg')">
            <!--  单价(元) -->
            {{item.unitPrice}}
          </td>
          <td class="col-amount" v-if="$user.hasPower('wdsx.rkdxgjg')">
            <!--  金额(元) -->
            {{item.amount}}
          </td>
          <td class="col-amount" v-if="$user.hasPower('wdsx.rkdxgjg')">
            <!--  税额(元) -->
            {{item.tax}}
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
    editprice: {
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
      this.$emit('on-amount-change', this.sumAmount());
    }
  },
  methods: {
    load() {

    },
    listNewRow() {
      var def = {
        id: 0,
        type: 1,//入库
        materCode: '',//材料编号
        materName: '',//材料名称
        spec: '',//规格型号
        unit: '',//单位
        quantity: 0,//数量
        unitPrice: 0,//单价
        taxUnitPrice: 0,//含税单价
        tax: 0,//税额
        amount: 0,//金额
        constructionSite: '',//施工部位
        productName: ''//产成品名称
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
    computedAmount(item) {
      item.amount = floatObj.multiply(item.quantity, item.taxUnitPrice);//数量*含税单价   
      item.unitPrice = floatObj.multiply(item.taxUnitPrice, floatObj.subtract(1, this.model.taxRate));//含税单价*(1-税率)
      item.tax = floatObj.multiply(item.amount, this.model.taxRate);//数量*含税单价*税率
      this.$emit('on-amount-change', this.sumAmount());
    },
    sumAmount() {
      var totals = 0;
      this.list.map((mater) => {
        totals = floatObj.add(totals, mater.amount);
      });
      return totals;
    },
    selMater(row) {
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
          row.unit = data.unit;
          this.computedAmount(row);
        }
      });
    },
  }
}

</script>

<style type="text/css">
</style>
