<template>
  <n-loading-bar-provider>
    <n-dialog-provider>
      <n-message-provider>
        <n-notification-provider>
          <global-api />
        </n-notification-provider>
      </n-message-provider>
    </n-dialog-provider>
  </n-loading-bar-provider>
  <div class="box">
    <div class="header">
      <img class="logo" src="./assets/logo.png" />
      <div class="title-box">
        <div class="title">Auto Mooc</div>
        <div>自动化慕课工具 v2.0</div>
      </div>
    </div>
    <div class="card">
      <div v-if="state == -1" class="loading">
        <n-spin size="medium" />
        <div class="tips">加载中...</div>
      </div>
      <div v-else-if="state == 0" class="login">
        <n-spin size="medium" :show="qrCode == ''">
          <img class="qr-code" :src="qrCode" />
        </n-spin>
        <div class="tips">获取二维码登陆</div>
        <n-button type="primary" @click="checkQr(true)" class="btn">我已扫码</n-button>
        <n-button strong secondary type="primary" @click="reCode">刷新</n-button>
      </div>
      <div v-else-if="state == 1" class="work">
        <div>你好 👋 {{ user }} 同学, 请选择要学习的科目</div>
        <n-spin size="medium" :show="subject.length == 0">
          <div class="subject-box">
            <div v-for="item in subject" class="subject-item" @click="selectSubject(item)">
              <n-tag v-if="select == item.id" class="select" :bordered="false" type="info" round>上次选择</n-tag>
              <img :src="item.cover" class="cover" />
              <div>{{ item.name }}</div>
            </div>
          </div>
        </n-spin>
      </div>
      <div v-else-if="state == 9" class="work">
        <n-spin size="medium" :show="screen == ''">
          <img class="screen" :src="screen" />
        </n-spin>
        <div class="btn-box">
          <n-button type="success" @click="reScreen">刷新</n-button>
          <div>
            <n-button type="warning" @click="recoveryWork" style="margin-right: 10px;">恢复任务</n-button>
            <n-button type="error" @click="stopWork">停止任务</n-button>
          </div>
        </div>
      </div>
      <div v-else class="loading">
        <div style="margin-bottom: 10px;">加载失败, 网络异常</div>
        <n-button type="success" @click="init">刷新</n-button>
      </div>
    </div>
    <foot-bar />
  </div>
</template>

<script>
import GlobalApi from './components/globalApi.vue'
import FootBar from './components/footBar.vue'
import { user, study } from './plugins/api'

export default {
  name: "App",
  components: { GlobalApi, FootBar },
  data: () => ({
    timer: 0,
    state: -1,
    qrCode: '',
    user: '',
    subject: [],
    select: '',
    screen: ''
  }),
  methods: {
    init() {
      this.state = -1
      study.getWorkState().then(res => {
        if (res.message == 'started') {
          this.state = 9
          this.screen = study.workScreen()
        } else this.checkLogin()
      }).catch(err => {
        console.log('任务状态接口请求失败',err)
        window.$message.error('任务状态接口请求失败')
      })
    },
    checkLogin() {
      user.getLoginState().then(res => {
        if (res.state) {
          if (res.data == 0) {
            this.qrCode = user.getQrCode()
            this.autoCheckQr()
          } else if (res.data == 1) {
            clearInterval(this.timer)
            this.getUserName()
            setTimeout(() => {
              this.getSubjectList()
            }, 1000)
          }
          this.state = res.data
        } else {
          this.state = 2
        }
      }).catch(err => {
        console.log('登陆校验接口请求失败',err)
        window.$message.error('登陆校验接口请求失败')
      })
    },
    reCode() {
      this.qrCode = ''
      setTimeout(() => {
        this.qrCode = user.getQrCode()
      }, 500);
    },
    autoCheckQr() {
      clearInterval(this.timer)
      this.timer = setInterval(() => {
        this.checkQr(false)
      }, 1000);
    },
    checkQr(tips) {
      user.getQrState().then(res => {
        if (res.state) {
          if (res.data == 0) {
            this.state = -1
            window.$message.success('登陆成功')
            clearInterval(this.timer)
            this.checkLogin()
          } else if (tips) {
            if (res.data == 1) window.$message.warning('等待扫码中...')
            else if (res.data == 2) window.$message.success('扫码成功')
            else if (res.data == 3) {
              window.$message.warning('扫码失败')
              this.reCode()
            } else {
              window.$message.warning('未生成二维码')
              this.reCode()
            }
          }
        } else window.$message.error('检查扫码状态失败')
      }).catch(err => {
        console.log('二维码校验接口请求失败',err)
        window.$message.error('二维码校验接口请求失败')
      })
    },
    getUserName() {
      user.getUser().then(res => {
        if (res.state) this.user = res.message
        else window.$message.warning('获取用户信息失败')
      }).catch(err => {
        console.log('用户信息接口请求失败',err)
        window.$message.error('用户信息接口请求失败')
      })
    },
    getSubjectList() {
      study.getSubjectList().then(res => {
        if (res.state) {
          for (let i in res.data) {
            let item = res.data[i]
            if (item.name.indexOf('（') != -1) item.name = item.name.substring(0, item.name.indexOf('（'));
            if (item.name.indexOf('(') != -1) item.name = item.name.substring(0, item.name.indexOf('('));
            item.name = item.name.trim();
          }
          this.subject = res.data
          this.select = res.message
        } else window.$message.warning('获取科目列表失败')
      }).catch(err => {
        console.log('科目列表接口请求失败',err)
        window.$message.error('科目列表接口请求失败')
      })
    },
    selectSubject(item) {
      window.$dialog.warning({
        title: '科目确认',
        content: '确认要开始上《' + item.name + '》的课程吗?',
        positiveText: '确认开始',
        negativeText: '取消',
        onPositiveClick: () => {
          this.startWork(item.id)
        }
      })
    },
    startWork(id) {
      let tips = window.$message.loading('正在开始任务', { duration: 1000 * 60 });
      study.selectSubject(id).then(res => {
        if (res.state) {
          window.$message.success('科目选择成功')
          study.startWork().then(res2 => {
            if (res2.state) {
              tips.type = "success";
              tips.content = "任务已开始";
              this.init()
            } else {
              tips.type = "warning";
              tips.content = "任务开始失败";
            }
            setTimeout(() => {
              tips.destroy()
            }, 2000);
          }).catch(() => {
            tips.type = "error";
            tips.content = "开始任务接口请求失败";
            setTimeout(() => {
              tips.destroy()
            }, 2000);
          })
        } else window.$message.warning('科目选择失败')
      }).catch(err => {
        console.log('选科接口请求失败',err)
        window.$message.error('选科接口请求失败')
      })
    },
    stopWork() {
      window.$dialog.warning({
        title: '操作确认',
        content: '确认要停止上课任务吗?',
        positiveText: '停止',
        negativeText: '取消',
        onPositiveClick: () => {
          let tips = window.$message.loading('正在停止任务', { duration: 1000 * 60 });
          study.stopWork().then(res => {
            if (res.state) {
              tips.type = "success";
              tips.content = "任务已停止";
              this.init()
            } else {
              tips.type = "warning";
              tips.content = "任务停止失败";
            }
            setTimeout(() => {
              tips.destroy()
            }, 2000);
          }).catch(() => {
            tips.type = "error";
            tips.content = "停止任务接口请求失败";
            setTimeout(() => {
              tips.destroy()
            }, 2000);
          })
        }
      })
    },
    recoveryWork() {
      window.$dialog.warning({
        title: '任务恢复',
        content: '若在任务截图中看到播放停止, 可使用任务恢复功能, 重新注入脚本, 但如果任务截图中看到已经离开上课页面, 则需停止后重新开始, 确认要恢复任务吗?',
        positiveText: '确认',
        negativeText: '取消',
        onPositiveClick: () => {
          study.recoveryWork().then(res => {
            if (res.state) {
              window.$message.success('已重新注入脚本')
              this.reScreen()
            } else window.$message.warning('恢复任务失败')
          }).catch(err => {
        console.log('恢复任务接口请求失败',err)
            window.$message.error('恢复任务接口请求失败')
          })
        }
      })
    },
    reScreen() {
      this.screen = ''
      setTimeout(() => {
        this.screen = study.workScreen()
      }, 500);
    }
  },
  mounted() {
    setTimeout(() => {
      this.init()
    }, 500);
  }
};
</script>
<style>
.box {
  width: 600px;
  margin: 0 auto;
}

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

.card {
  backdrop-filter: saturate(180%) blur(20px);
  background-color: #fff;
  margin-bottom: 10px;
  border-radius: 8px;
  width: 100%;
}

.loading {
  text-align: center;
  padding: 200px 0;
}

.loading .tips {
  margin-top: 10px;
}

.login {
  text-align: center;
  padding: 100px 0;
}

.qr-code {
  width: 200px;
  height: 200px;
}

.login .tips {
  margin: -10px 0 20px 0;
}

.login .btn {
  margin-right: 10px;
}

.work {
  padding: 10px;
}

.subject-box {
  min-height: 330px;
  flex-wrap: wrap;
  display: flex;
}

.subject-item {
  padding: 10px 5px 0 5px;
  border-radius: 8px;
  position: relative;
  cursor: pointer;
}

.subject-item:hover {
  background-color: #e4e4e4;
}

.select {
  background-color: #2080f0;
  position: absolute;
  color: #fff;
  right: 10px;
  top: 15px
}

.cover {
  border-radius: 8px;
  width: 183px;
}

.screen {
  border-radius: 8px;
  min-height: 300px;
  width: 580px;
}

.btn-box {
  justify-content: space-between;
  padding-top: 10px;
  display: flex;
}
</style>