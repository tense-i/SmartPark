<template>
  <div class="card-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <span class="search-label">车牌号码：</span>
      <el-input v-model="params.carNumber" clearable placeholder="请输入内容" class="search-main" />
      <span class="search-label">车主姓名：</span>
      <el-input v-model="params.personName" clearable placeholder="请输入内容" class="search-main" />
      <span class="search-label">状态：</span>
      <el-select v-model="params.cardStatus">
        <el-option
          v-for="item in cardStatusList "
          :key="item.id"
          :value="item.id"
          :label="item.name"
        />
      </el-select>
      <el-button type="primary" class="search-btn" @click="searchCarList">查询</el-button>
    </div>
    <!-- 新增删除操作区域 -->
    <div class="create-container">
      <el-button type="primary" @click="$router.push('/car/addMonthCard')">添加月卡</el-button>
      <el-button @click="deleteSelectedAll">批量删除</el-button>
    </div>
    <!-- 表格区域 -->
    <template>
      <el-table style="width: 100%" :data="cardList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />

        <el-table-column type="index" label="序号" />
        <el-table-column label="车主名称" prop="personName" />
        <el-table-column label="联系方式" prop="phoneNumber" />
        <el-table-column label="车牌号码" prop="carNumber" />
        <el-table-column label="车辆品牌" prop="carBrand" />
        <el-table-column label="剩余有效天数" prop="totalEffectiveDate" />
        <el-table-column label="状态" prop="cardStatus" :formatter="formatStatus" />
        <el-table-column label="操作" fixed="right" width="180">
          <template #default="scope">
            <el-button size="mini" type="text">续费</el-button>
            <el-button size="mini" type="text">查看</el-button>
            <el-button size="mini" type="text" @click="editCard(scope.row.id)">编辑</el-button>
            <el-button size="mini" type="text" @click="deleteCard(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <div class="page-container">
      <el-pagination
        background
        layout="total, prev, pager, next"
        :page-size="params.pageSize"
        :total="total"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 添加楼宇 -->
    <el-dialog
      title="添加楼宇"
      width="580px"
    >
      <!-- 表单接口 -->
      <div class="form-container">
        <!-- <el-form ref="addForm" :model="addForm" :rules="addFormRules">
          <el-form-item label="楼宇名称" prop="name">
            <el-input v-model="addForm.name" />
          </el-form-item>
          <el-form-item label="楼宇层数" prop="floors">
            <el-input v-model="addForm.floors" />
          </el-form-item>
          <el-form-item label="在管面积" prop="area">
            <el-input v-model="addForm.area" />
          </el-form-item>
          <el-form-item label="物业费" prop="propertyFeePrice">
            <el-input v-model="addForm.propertyFeePrice" />
          </el-form-item>
        </el-form> -->
      </div>
      <template #footer>
        <el-button size="mini">取 消</el-button>
        <el-button size="mini" type="primary">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { deleteCardAPI, getCardListAPI } from '@/api/card'

export default {
  data() {
    return {
      params: {
        page: 1,
        pageSize: 10,
        carNumber: '',
        personName: '',
        cardStatus: null
      },
      cardStatusList: [
        { id: null, name: '全部' },
        { id: 0, name: '可用' },
        { id: 1, name: '已过期' }
      ],
      cardList: [],
      total: 0,
      selectedList: []
    }
  },
  created() {
    this.getCardList()
  },
  methods: {
    async getCardList() {
      const res = await getCardListAPI(this.params)
      debugger
      console.log(res)
      this.cardList = res.data.rows
      this.total = res.data.total
    },
    formatStatus(row) {
      const MAP = {
        0: '可用',
        1: '已过期'
      }
      return MAP[row.cardStatus]
    },
    handleCurrentChange(page) {
      this.params.page = page
      this.getCardList()
    },
    editCard(id) {
      console.log(id)
      debugger
      this.$router.push({
        path: '/car/addMonthCard',
        query: {
          id
        }
      })
    },
    searchCarList() {
      debugger
      console.log(this.params)
      this.params.page = 1
      this.getCardList()
    },
    async deleteCard(id) {
      this.$confirm('是否删除该月卡？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await deleteCardAPI(id)
        await this.getCardList()
        this.$message({
          type: 'success',
          message: '删除成功'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleSelectionChange(val) {
      console.log(val)
      this.selectedList = val
    },
    deleteSelectedAll() {
      if (this.selectedList.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择要删除的月卡'
        })
        return
      }
      this.$confirm('是否删除选中的月卡？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        var ids = this.selectedList.map(item => item.id).join(',')
        console.log(ids)
        await deleteCardAPI(ids)
        await this.getCardList()
        this.$message({
          type: 'success',
          message: '删除成功'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.card-container {
  padding: 20px;
  background-color: #fff;
}

.search-container {
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(237, 237, 237, .9);
  padding-bottom: 20px;

  .search-main {
    width: 220px;
    margin-right: 10px;
  }

  .search-btn {
    margin-left: 20px;
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
