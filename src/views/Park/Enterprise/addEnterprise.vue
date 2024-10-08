<template>
  <div class="add-enterprise">
    <header class="add-header">
      <div class="left">
        <span class="arrow" @click="$router.back()"><i class="el-icon-arrow-left" />返回</span>
        <span>|</span>
        <span>{{ id ? '编辑' : '添加' }}企业</span>
      </div>
      <div class="right">
        黑马程序员
      </div>
    </header>
    <main class="add-main">
      <div class="form-container">
        <div class="title">企业信息</div>
        <div class="form">
          <el-form ref="ruleForm" :model="addForm" :rules="rules" label-width="100px">
            <el-form-item label="企业名称" prop="name">
              <el-input v-model="addForm.name" />
            </el-form-item>
            <el-form-item label="法人" prop="name">
              <el-input v-model="addForm.legalPerson" />
            </el-form-item>
            <el-form-item label="注册地址" prop="name">
              <el-input v-model="addForm.registeredAddress" />
            </el-form-item>
            <el-form-item label="所在行业" prop="name">
              <el-select v-model="addForm.industryCode">
                <el-option
                  v-for="item in industryList"
                  :key="item.industryCode"
                  :value="item.industryCode"
                  :label="item.industryName"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="企业联系人" prop="name">
              <el-input v-model="addForm.contact" />
            </el-form-item>
            <el-form-item label="联系电话" prop="name">
              <el-input v-model="addForm.contactNumber" />
            </el-form-item>
            <el-form-item label="营业执照">
              <el-upload
                action="#"
                :http-request="uploadBusinessLicenseRequest"
                :before-upload="beforeUpload"
              >
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
            </el-form-item>
          </el-form>
        </div>
      </div>

    </main>
    <footer class="add-footer">
      <div class="btn-container">
        <el-button @click="resetForm">重置</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </div>
    </footer>
  </div>
</template>

<script>
import { addEnterpriseAPI, getIndustryListAPI, getEnterpriseDetailAPI, updateEnterpriseAPI } from '@/api/enterprise'
import { uploadAPI } from '@/api/public'
export default {
  data() {
    return {
      addForm: {
        name: '', // 企业名称
        legalPerson: '', // 法人
        registeredAddress: '', // 注册地址
        industryCode: '', // 所在行业
        contact: '', // 企业联系人
        contactNumber: '', // 联系人电话
        businessLicenseUrl: '', // 营业执照url
        businessLicenseId: '' // 营业执照id
      },
      industryList: [], // 行业列表
      rules: {
        name: [
          { required: true, message: '请输入企业名称', trigger: 'blur' }
        ],
        legalPerson: [
          { required: true, message: '请输入法人', trigger: 'blur' }
        ],
        registeredAddress: [
          { required: true, message: '请输入注册地址', trigger: 'blur' }
        ],
        industryCode: [
          { required: true, message: '请输入所在行业', trigger: 'blur' }
        ],
        businessLicenseUrl: [
          { required: true, message: '请上传营业执照', trigger: 'blur' }
        ],
        contactNumber: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
          { pattern: /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1589]))\d{8}$/, message: '请输入正确的联系电话', trigger: 'blur' }
        ]
      }

    }
  },
  computed: {
    id() {
      return this.$route.params.id
    }
  },
  mounted() {
    if (this.id) {
      this.getEnterpriseDetail()
      return
    }
    this.getIndustryList()
  },
  methods: {
    resetForm() {
      this.$refs.ruleForm.resetFields()
    },
    handleSubmit() {
      this.$refs.ruleForm.validate(async valid => {
        if (!valid) return
        console.log(this.addForm)
        if (this.id) {
          await updateEnterpriseAPI(this.addForm).then(res => {
            this.$message.info(res.msg)
          })
        } else {
          await addEnterpriseAPI(this.addForm).then(res => {
            this.$message.info(res.msg)
          })
        } this.$router.back()
      })
    },
    async getIndustryList() {
      await getIndustryListAPI().then(res => {
        this.industryList = res.data
      })
    },
    async uploadBusinessLicenseRequest(data) {
      const file = data.file
      // 构造表单数据
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'businessLicense')
      // 上传营业执照
      const res = await uploadAPI(formData)
      // 赋值表单数据
      this.addForm.businessLicenseId = res.data.id
      this.addForm.businessLicenseUrl = res.data.url
      // 校验营业执照
      this.$refs.ruleForm.validateField('businessLicenseId')
    },
    beforeUpload(file) {
      console.log(file.type)
      const allowedExtensions = ['image/jpg', 'image/png', 'image/jpg', 'image/jpeg'].includes(file.type)
      const isLt5M = file.size / 1024 / 1024 < 5
      if (!allowedExtensions) {
        this.$message.error('上传图片只能是 JPG/PNG/JPEG 格式!')
      }
      if (!isLt5M) {
        this.$message.error('上传图片大小不能超过 5MB!')
      }
      return allowedExtensions && isLt5M
    },
    async getEnterpriseDetail() {
      const res = await getEnterpriseDetailAPI(this.id)
      const { businessLicenseId, businessLicenseUrl, contact, contactNumber, industryCode, legalPerson, name, registeredAddress } = res.data
      this.addForm = { businessLicenseId, businessLicenseUrl, contact, contactNumber, industryCode, legalPerson, name, registeredAddress }
    }
  }
}
</script>

<style scoped lang="scss">
.add-enterprise {
  background-color: #f4f6f8;
  height: 100vh;

  .add-header {
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
    height: 64px;
    line-height: 64px;
    font-size: 16px;
    font-weight: bold;
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
        padding-left:20px;
      }
      .form {
        margin-bottom: 20px;
        padding: 20px 65px 24px;
        .el-form{
          display: flex;
          flex-wrap: wrap;
          .el-form-item{
            width: 50%;
          }
        }
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
