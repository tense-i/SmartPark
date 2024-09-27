<template>
  <div class="add-card">
    <header class="add-header">
      <el-page-header content="增加月卡" @back="$router.back()" />
    </header>
    <main class="add-main">
      <div class="form-container">
        <div class="title">车辆信息</div>
        <div class="form">
          <el-form ref="carInfo" :model="carInfoForm" :rules="carInfoRules" label-width="100px">
            <el-form-item label="车主姓名" prop="personName">
              <el-input v-model="carInfoForm.personName" />
            </el-form-item>
            <el-form-item label="联系方式" prop="phoneNumber">
              <el-input v-model="carInfoForm.phoneNumber" />
            </el-form-item>
            <el-form-item label="车辆号码" prop="carNumber">
              <el-input v-model="carInfoForm.carNumber" />
            </el-form-item>
            <el-form-item label="车辆品牌" prop="carBrand">
              <el-input v-model="carInfoForm.carBrand" />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="form-container">
        <div class="title">最新一次月卡缴费信息</div>
        <div class="form">
          <el-form ref="payInfo" label-width="100px" :model="payInfoForm">
            <el-form-item label="有效日期" prop="effectiveDate">
              <el-date-picker
                v-model="payInfoForm.effectiveDate"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              />
            </el-form-item>

            <el-form-item label="支付金额" prop="payAmount">
              <el-input v-model="payInfoForm.payAmount" />
            </el-form-item>
            <el-form-item label="支付方式" prop="payType">
              <el-select v-model="payInfoForm.payType">
                <el-option
                  v-for="item in payMethodList"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"
                />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </div>

    </main>
    <footer class="add-footer">
      <div class="btn-container">
        <el-button @click="clearFormInfo">重置</el-button>
        <el-button type="primary" @click="confirmAdd">确定</el-button>
      </div>
    </footer>
  </div>
</template>

<script>
import {createCardAPI, getCardDetailAPI, updateCardAPI} from '@/api/card'
export default {
  name: 'CarCardAdd',
  data() {
    const validateCarNumber = (rule, value, callback) => {
      const req = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-HJ-NP-Z][A-HJ-NP-Z0-9]{4,5}[A-HJ-NP-Z0-9挂学警港澳]$/
      if (!req.test(value)) {
        callback(new Error('请输入正确的车牌号'))
      } else {
        callback()
      }
    }
    return {
      carInfoForm: {
        personName: '',
        phoneNumber: '',
        carNumber: '',
        carBrand: ''
      },
      carInfoRules: {
        personName: [
          { required: true, message: '请输入车主姓名', trigger: 'blur' }
        ],
        phoneNumber: [
          { required: true, message: '请输入联系方式', trigger: 'blur' }

        ],
        carNumber: [
          { required: true, message: '请输入车辆号码', trigger: 'blur' }, {
            validator: validateCarNumber
          }
        ],
        carBrand: [
          { required: true, message: '请输入车辆品牌', trigger: 'blur' }
        ]
      }, payInfoForm: {
        effectiveDate: '',
        payAmount: null,
        payType: ''
      },
      payMethodList: [
        {
          id: 'Alipay',
          name: '支付宝'
        },
        {
          id: 'WeChat',
          name: '微信'
        },
        {
          id: 'Cash',
          name: '线下'
        }],
      payInfoFormRules: {
        effectiveDate: [
          { required: true, message: '请输入有效日期', trigger: 'blur' }
        ],
        payAmount: [
          { required: true, message: '请输入支付金额', trigger: 'blur' }, { type: 'number', message: '支付金额必须是数字', trigger: 'blur' }
        ],
        payType: [
          { required: true, message: '请输入支付方式', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    if (this.id) {
      this.getCardDetail()
    }
  },
  methods: {
    confirmAdd() {
      this.$refs.carInfo.validate(valid => {
        if (valid) {
          this.$refs.payInfo.validate(async valid => {
            debugger
            console.log('payAmount' + this.payInfoForm.payAmount)

            if (valid) {
              console.log('paytime' + this.payInfoForm.effectiveDate)
              const payLoad = {
                ...this.carInfoForm,
                ...this.payInfoForm,
                // 单独处理时间
                cardStartDate: this.feeForm.payTime[0],
                cardEndDate: this.feeForm.payTime[1]
              }
              // 删除多余字段
              delete payLoad.effectiveDate
              if (this.id) {
                await updateCardAPI(payLoad)
              } else { await createCardAPI(payLoad) }
              this.$message({
                message: '添加成功',
                type: 'success'
              })
            }
          })
        }
      })
    },
    clearFormInfo() {
      this.$refs.carInfo.resetFields()
      this.$refs.payInfo.resetFields()
    },
    async getCardDetail() {
      const res = await getCardDetailAPI(this.id)
      const { carInfoId, personName, phoneNumber, carNumber, carBrand } = res.data
      this.carInfoForm = {
        carInfoId,
        personName,
        phoneNumber,
        carNumber,
        carBrand
      }

      const { rechargeId, cardStartDate, cardEndDate, paymentAmount, paymentMethod } = res.data
      this.payInfoForm = {
        rechargeId,
        payType: paymentMethod,
        cardStartDate,
        cardEndDate,
        payAmount: paymentAmount
      }
    }
  }
}
</script>

<style scoped lang="scss">
.add-card {
  background-color: #f4f6f8;
  height: 100vh;

  .add-header {
    display: flex;
    align-items: center;
    padding: 0 20px;
    height: 64px;
    background-color: #fff;

    .left {
      span {
        margin-right: 4px;
      }
      .arrow{
        cursor: pointer;
      }
    }

    .right {
      text-align: right;
    }
  }

  .add-main {
    background: #f4f6f8;
    padding: 20px 130px;

    .form-container {
      background-color: #fff;

      .title {
        height: 60px;
        line-height: 60px;
        padding-left: 20px;
      }

      .form {
        margin-bottom: 20px;
        padding: 20px 65px 24px;

        .el-form {
          display: flex;
          flex-wrap: wrap;

          .el-form-item {
            width: 50%;
          }
        }
      }
    }
    .preview{
      img{
        width: 100px;
      }
    }
  }

  .add-footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    padding: 24px 50px;
    color: #000000d9;
    font-size: 14px;
    background: #fff;
    text-align: center;
  }
}
</style>
