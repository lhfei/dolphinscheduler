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
// import $ from 'jquery'
import 'babel-polyfill'
import '@/conf/public-path'
import Vue from 'vue'
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import i18n from '@/module/i18n'

import 'sass/conf/login/index.scss'
import 'bootstrap/dist/js/bootstrap.min.js'

i18n.globalScope.LOCALE === 'en_US' ? Vue.use(ElementUI, { locale }) : Vue.use(ElementUI)

Vue.config.devtools = true
Vue.config.productionTip = true
Vue.config.silent = true

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
  instance = new Vue({
    render: h => h(App),
    mounted () {
    },
    methods: {
      initApp () {
        const bootstrapTooltip = $.fn.tooltip.noConflict()
        $.fn.tooltip = bootstrapTooltip
        $('body').tooltip({
          selector: '[data-toggle="tooltip"]',
          trigger: 'hover'
        })
        // Component internationalization
        i18n.init()
      }
    },
    created () {
      this.initApp()
    }
  }).$mount(container ? container.querySelector('#app') : '#app')
}
/* eslint-disable no-new */
// new Vue({
//   el: '#app',
//   render: h => h(App),
//   mounted () {
//   },
//   methods: {
//     initApp () {
//       const bootstrapTooltip = $.fn.tooltip.noConflict()
//       $.fn.tooltip = bootstrapTooltip
//       $('body').tooltip({
//         selector: '[data-toggle="tooltip"]',
//         trigger: 'hover'
//       })
//       // Component internationalization
//       i18n.init()
//     }
//   },
//   created () {
//     this.initApp()
//   }
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
