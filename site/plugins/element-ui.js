import Vue from 'vue'
import 'element-ui/lib/theme-chalk/index.css'

import { Progress, MessageBox, Message, Notification } from 'element-ui'

Vue.use(Progress)

Vue.prototype.$msgbox = MessageBox
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt
Vue.prototype.$notify = Notification
Vue.prototype.$message = Message
