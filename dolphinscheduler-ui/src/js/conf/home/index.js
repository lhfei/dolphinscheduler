/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import '@/conf/public-path'
import Vue from 'vue'
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import router from './router'
import store from './store'
import i18n from '@/module/i18n'
import { sync } from 'vuex-router-sync'
import Chart from '@/module/ana-charts'
import '@/module/filter/formatDate'
import '@/module/filter/filterNull'
import themeData from '@/module/echarts/themeData.json'
import Permissions from '@/module/permissions'
import 'sass/conf/home/index.scss'
import 'bootstrap/dist/css/bootstrap.min.css'

import 'bootstrap/dist/js/bootstrap.min.js'
import 'canvg/dist/browser/canvg.min.js'
import 'remixicon/fonts/remixicon.css'
import formCreate from '@form-create/element-ui'

// Component internationalization
const useOpt = i18n.globalScope.LOCALE === 'en_US' ? { locale: locale } : {}

i18n.globalScope.LOCALE === 'en_US' ? Vue.use(ElementUI, { locale }) : Vue.use(ElementUI)

// Vue.use(ans)
Vue.use(useOpt)
Vue.use(formCreate)

sync(store, router)

Vue.config.devtools = true
Vue.config.productionTip = true
Vue.config.silent = true

Chart.config({
  theme: {
    name: 'themeName',
    data: themeData,
    default: true
  }
})

// 声明一个变量，可以用于卸载
let instance = null

// 挂载到自己的html中，基座会拿到这个挂载后的html插入进去
function render (props = {}) {
  const { container, onGlobalStateChange, initialState } = props
  const currentUser = initialState && initialState.currentUser
  console.log(currentUser)

  // store.dispatch('theme/getColor', currentTheme?.theme?.primaryColor || '');
  if (onGlobalStateChange) {
    onGlobalStateChange((state, prev) => {
      // state: 变更后的状态; prev 变更前的状态
      console.log(state, prev)
      // store.dispatch('theme/getColor', state?.color || '')
    })
  }
  /* eslint-disable no-new */
  Permissions.request().then(res => {
    // instance
    instance = new Vue({
      router,
      store,
      render: h => h(App),
      mounted () {
        document.addEventListener('click', (e) => {
          $('#contextmenu').css('visibility', 'hidden')
        })
      },
      methods: {
        initApp () {
          $('.global-loading').hide()
          const bootstrapTooltip = $.fn.tooltip.noConflict()
          $.fn.tooltip = bootstrapTooltip
          $('body').tooltip({
            selector: '[data-toggle="tooltip"]',
            trigger: 'hover'
          })
          // init
          i18n.init()
        }
      },
      created () {
        this.initApp()
      }
    }).$mount(container ? container.querySelector('#app') : '#app')
  })
}
/* eslint-disable no-new */
// Permissions.request().then(res => {
//   // instance
//   new Vue({
//     el: '#app',
//     router,
//     store,
//     render: h => h(App),
//     mounted () {
//       document.addEventListener('click', (e) => {
//         $('#contextmenu').css('visibility', 'hidden')
//       })
//     },
//     methods: {
//       initApp () {
//         $('.global-loading').hide()
//         const bootstrapTooltip = $.fn.tooltip.noConflict()
//         $.fn.tooltip = bootstrapTooltip
//         $('body').tooltip({
//           selector: '[data-toggle="tooltip"]',
//           trigger: 'hover'
//         })
//         // init
//         i18n.init()
//       }
//     },
//     created () {
//       this.initApp()
//     }
//   })
// })

// 独立运行
if (!window.__POWERED_BY_QIANKUN__) {
  render()
}

// 子组件的协议，必须暴露三个函数
export async function bootstrap (props) {
  console.log('bootstrap函数：', props)
}
export async function mount (props) {
  console.log('mount函数：', props)
  render(props)
}
export async function unmount (props) {
  console.log('unmount函数：', props)
  instance.$destroy()
  instance = null
}
