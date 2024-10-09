<template>
  <div class="building-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <div class="search-label">企业名称：</div>
      <el-input v-model="searchEnterpriseName" clearable placeholder="请输入内容" class="search-main" />
      <el-button type="primary" @click="findEnterpriseByName">查询</el-button>
    </div>
    <div class="create-container">
      <el-button type="primary" @click="addEnterprise">添加企业</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table
        style="width: 100%"
        :data="enterpriseList"
        @expand-change="handleExpandChange"
      >
        <!-- 租赁合同 -->
        <el-table-column type="expand">
          <template #default="{row}">
            <el-table :data="row.rentList" style="width: 100%">
              <el-table-column label="租赁楼宇" width="320" prop="buildingName" />
              <el-table-column label="租赁起始时间" prop="startTime" />

              <el-table-column label="合同状态">
                <template #default="scope">
                  <el-tag :type="formatInfoType(scope.row.status)">
                    {{ formatStatus(scope.row.status) }}
                  </el-tag>
                </template>

              </el-table-column>
              <el-table-column label="操作" width="180">
                <template #default="scope">
                  <el-button size="mini" :disabled="scope.row.status === 3" type="text" @click="outRent(scope.row.id)">退租</el-button>
                  <el-button size="mini" :disabled="scope.row.status !== 3" type="text">删除</el-button>
                </template>
              </el-table-column>

            </el-table>
          </template>
        </el-table-column>
        <!-- 表格 -->
        <el-table-column type="index" label="序号" />
        <el-table-column label="企业名称" width="320" prop="name" />
        <el-table-column label="联系人" prop="contact" />
        <el-table-column
          label="联系电话"
          prop="contactNumber"
        />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="mini" type="text" @click="addContract(scope.row.id)">添加合同</el-button>
            <el-button size="mini" type="text" @click="detailEnterprise(scope.row.id)">查看</el-button>
            <el-button size="mini" type="text" @click="editEnterprise(scope.row.id)">编辑</el-button>
            <el-button size="mini" type="text" @click="deleteEnterprise(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>

      </el-table>
    </div>
    <div class="page-container">
      <el-pagination
        background
        layout="total, prev, pager, next"
        :page-size="params.pageSize"
        :total="total"
        @current-change="handleCurrentChange"
      />
    </div>
    <div>
      <el-dialog
        title="添加合同"
        :visible="contractDialogVisible"
        width="580px"
        @close="closeDialog"
      >
        <!-- 表单区域 -->
        <!-- 表单模版 -->
        <div class="form-container">
          <el-form ref="addForm" :model="rentForm" :rules="rentRules" label-position="top">
            <el-form-item label="租赁楼宇" prop="buildingId">
              <el-select v-model="rentForm.buildingId" placeholder="请选择">
                <el-option
                  v-for="item in buildingList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="租赁起止日期" prop="rentTime">
              <el-date-picker
                v-model="rentForm.rentTime"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              />
            </el-form-item>
            <el-form-item label="租赁合同" prop="contractId">
              <el-upload
                action="#"
                :before-upload="beforeUploadRentContract"
                :http-request="uploadRentContract"
              >
                <el-button size="small" type="primary" plain>上传合同文件</el-button>
                <div slot="tip" class="el-upload__tip">支持扩展名：.doc .docx .pdf, 文件大小不超过5M</div>
              </el-upload>
            </el-form-item>
          </el-form>
        </div>
        <template #footer>
          <el-button size="mini" @click="closeDialog">取 消</el-button>
          <el-button size="mini" type="primary" @click="submitRentContract">确 定</el-button>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getEnterpriseListAPI, deleteEnterpriseAPI, addRentContractAPI, getRentContractByIdAPI, rentOutByIdAPI } from '@/api/enterprise'
import { getBuildingListAPI } from '@/api/building'
import { uploadAPI } from '@/api/public'
export default {
  name: 'Enterprise',
  data() {
    return {
      total: 0,
      searchEnterpriseName: '',
      params: {
        pageSize: 2,
        pageNum: 1,
        name: null
      },
      enterprise: {
        name: '',
        contact: '',
        contactNumber: ''
      },
      enterpriseList: [],
      contractDialogVisible: false,
      rentForm: {
        buildingId: null, // 楼宇id
        rentTime: null, // 租赁起止日期
        contractUrl: '', // 合同文件
        enterpriseId: null, // 企业id
        type: 0, // 合同类型
        contractId: null// 合同id
      },
      rentRules: {
        buildingId: [
          { required: true, message: '请选择租赁楼宇', trigger: 'blur' }
        ],
        rentTime: [
          { required: true, message: '请选择租赁起止日期', trigger: 'blur' }
        ],
        contractId: [
          { required: true, message: '请上传租赁合同', trigger: 'blur' }
        ]
      },
      buildingList: [],
      buildingTotal: 0,
      buildingParams: {
        name: null,
        pageSize: 10,
        pageNum: 1
      }
    }
  },
  created() {
    this.getEnterpriseList()
    this.getBuildingList()
  },
  methods: {
    formatInfoType(status) {
      const MAP = {
        0: 'warning',
        1: 'success',
        2: 'info',
        3: 'danger'
      }
      // return 格式化之后的中文显示
      return MAP[status]
    },
    // 格式化status
    formatStatus(type) {
      const TYPEMAP = {
        0: '待生效',
        1: '生效中',
        2: '已到期',
        3: '已退租'
      }
      return TYPEMAP[type]
    },

    handleCurrentChange(val) {
      this.params.pageNum = val
      // 重新获取数据
      this.getEnterpriseList()
    },
    async getEnterpriseList() {
      debugger
      console.log(this.params)
      await getEnterpriseListAPI(this.params).then(res => {
        debugger
        console.log(res.data)
        this.enterpriseList = res.data.rows.map((item) => {
          return {
            ...item,
            rentList: []// 每一行补充存放合同的列表
          }
        })
        console.log(this.enterpriseList)
        debugger
        this.total = res.data.total
      })
    },
    findEnterpriseByName() {
      this.params.name = this.searchEnterpriseName
      console.log(this.params.name)
      debugger
      this.getEnterpriseList()
    },
    addEnterprise() {
      this.$router.push('/park/enterprise/add/')
    },
    editEnterprise(id) {
      debugger
      console.log(this.$router)
      console.log(id)
      debugger
      this.$router.push(`/park/enterprise/add/${id}`)
    },
    async deleteEnterprise(id) {
    // 确认
      this.$confirm('确定删除该企业吗？', '删除企业', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await deleteEnterpriseAPI(id).then(res => {
          this.$message.info(res.msg)
          this.getEnterpriseList()
        })
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    addContract(id) {
      debugger
      this.rentForm.enterpriseId = id
      // 打开弹窗
      this.contractDialogVisible = true
    },
    closeDialog() {
    // 关闭弹窗
      this.contractDialogVisible = false
    },
    // 获取楼宇列表
    async getBuildingList() {
      await getBuildingListAPI(this.buildingParams).then(res => {
        this.buildingList = res.data.rows
        this.buildingTotal = res.datatotal
      })
    },
    // 上传文件前校验
    beforeUploadRentContract(file) {
      const isValideType = ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/pdf'].includes(file.type)
      const isLt2M = file.size / 1024 / 1024 < 5
      if (!isValideType) {
        this.$message.error('上传文件格式不正确!')
      }
      if (!isLt2M) {
        this.$message.error('上传文件大小不能超过 5MB!')
      }
      return isLt2M && isValideType
    },
    async uploadRentContract(file) {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'contract')

      // 上传
      const res = await uploadAPI(formData)
      const { id, url } = res.data
      this.rentForm.contractId = id
      this.rentForm.contractUrl = url

      // 校验表单字段
      this.$refs.addForm.validateField('contractId')
    },
    submitRentContract() {
      this.$refs.addForm.validate(async valid => {
        if (!valid) return
        const { buildingId, contractId, contractUrl, enterpriseId, type } = this.rentForm
        await addRentContractAPI({
          buildingId, contractId, contractUrl, enterpriseId, type,
          startTime: this.rentForm.rentTime[0],
          endTime: this.rentForm.rentTime[1]
        }).then(res => {
          this.$message.info(res.msg)
          // 关闭弹窗
          this.closeDialog()
          // 重新获取数据
          this.getEnterpriseList()
        })
      })
    },
    async handleExpandChange(row, rows) {
      debugger
      console.log(row)
      console.log(rows)
      const isExpend = rows.find(item => item.id === row.id)
      if (isExpend) {
        const res = await getRentContractByIdAPI(row.id)
        debugger
        console.log(res)
        // eslint-disable-next-line require-atomic-updates
        row.rentList = res.data
      }
    },
    async rentOut(id) {
      this.$confirm('确定退租该合同吗？', '退租合同', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await rentOutByIdAPI(id).then(res => {
          this.$message.info(res.msg)
          this.getEnterpriseList()
        })
      }).catch(() => {
        this.$message.info('已取消退租')
      })
    },
    detailEnterprise(id) {
      debugger
      console.log(this.$router)
      console.log(id)
      this.$router.push(`/exterpriseDetail/${id}`)
    }
  }
}

</script>
<style lang="scss" scoped>
.department-container {
  padding: 10px;
}

.search-container {
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(237, 237, 237, .9);;
  padding-bottom: 20px;

  .search-label {
    width: 100px;
  }

  .search-main {
    width: 220px;
    margin-right: 10px;
  }
}

.create-container {
  margin: 10px 0px;
}

.page-container {
  padding: 4px 0px;
  text-align: right;
}

.form-container {
  padding: 0px 80px;
}
</style>
