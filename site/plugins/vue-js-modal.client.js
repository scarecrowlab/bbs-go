import Vue from 'vue'
import VModal from 'vue-js-modal/dist/ssr.nocss'

import 'vue-js-modal/dist/styles.css'

console.log('注册')
Vue.use(VModal, { componentName: 'v-modal', dialog: true })
