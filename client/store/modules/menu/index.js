import * as types from '../../mutation-types'
import lazyLoading from './lazyLoading'
import charts from './charts'
import uifeatures from './uifeatures'
import components from './components'
import tables from './tables'

// show: meta.label -> name
// name: component name
// meta.label: display label

const state = {
  items: [
    {
      name: '桌面',
      path: '/dashboard',
      meta: {
        auth: true,
        icon: 'fa-tachometer',
        link: 'dashboard/index.vue'
      },
      component: lazyLoading('dashboard', true)
    },
    {
      name: '视频管理',
      path: '/video',
      meta: {
        auth: true,
        icon: 'fa fa-video-camera',
        link: 'video/index.vue'
      },
      component: lazyLoading('video', true)
    },
    // charts,
    // uifeatures,
    // components,
    // tables
  ]
}

const mutations = {
  [types.EXPAND_MENU] (state, menuItem) {
    if (menuItem.index > -1) {
      if (state.items[menuItem.index] && state.items[menuItem.index].meta) {
        state.items[menuItem.index].meta.expanded = menuItem.expanded
      }
    } else if (menuItem.item && 'expanded' in menuItem.item.meta) {
      menuItem.item.meta.expanded = menuItem.expanded
    }
  }
}

export default {
  state,
  mutations
}
