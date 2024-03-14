<template>
  <div class="header">
    <img class="logo" src="../assets/logo.png" />
    <div class="title-box">
      <div class="title">Auto Mooc</div>
      <div>
        <span>自动化慕课工具 v2.0</span>
        <span class="push" @click="editPush">推送</span>
      </div>
    </div>
    <n-modal v-model:show="push.show">
      <div class="card">
        <div class="push-title">消息推送</div>
        <div class="push-item">
          <div class="push-label">开启推送</div>
          <n-switch v-model:value="push.enable" />
        </div>
        <div class="push-item">
          <div class="push-label">推送地址</div>
          <n-input v-model:value="push.path" type="text" placeholder="HTTP GET" />
        </div>
        <div class="push-btn">
          <n-button type="success" @click="savePushSetting">保存</n-button>
        </div>
      </div>
    </n-modal>
  </div>
</template>
<script>
import { setting } from '../plugins/api'
export default {
  name: "HeaderBar",
  data: () => ({
    push: {
      show: false,
      enable: false,
      path: ''
    }
  }),
  methods: {
    editPush() {
      this.push.show = true
      this.getPushSetting()
    },
    getPushSetting() {
      setting.getPush().then(res => {
        if (res.state) {
          this.push.enable = res.data;
          this.push.path = res.message;
        } else window.$message.warning('获取推送设置失败')
      }).catch(err => {
        console.log('推送设置查询接口请求失败', err)
        window.$message.error('推送设置查询接口请求失败')
      })
    },
    savePushSetting() {
      setting.savePush(this.push.enable, this.push.path).then(res => {
        if (res.state) {
          window.$message.success('保存成功')
          this.push.show = false
        } else window.$message.warning('推送设置保存失败')
      }).catch(err => {
        console.log('推送设置保存接口请求失败', err)
        window.$message.error('推送设置保存接口请求失败')
      })
    }
  }
};
</script>
<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10vh 0 20px 0;
}

.logo {
  width: 80px;
  height: 80px;
  background-color: #fff;
  padding: 10px;
  border-radius: 20px;
}

.title-box {
  margin-left: 10px;
}

.title {
  font-size: 32px;
  line-height: 32px;
  font-weight: bold;
}

.push {
  transition: all ease-out 0.3s;
  margin-left: 5px;
  cursor: pointer;
  color: #999;
}

.push:hover {
  color: #333;
}

.card {
  padding: 20px;
  width: 400px;
}

.push-title {
  font-weight: bold;
  font-size: 18px;
}

.push-item {
  align-items: center;
  margin-top: 20px;
  display: flex;
}

.push-label {
  min-width: 70px;
  max-width: 70px;
  width: 70px;
}

.push-btn {
  text-align: center;
  margin-top: 20px;
}

.push-btn button {
  width: 100%;
}
</style>