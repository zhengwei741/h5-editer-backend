import { Service } from 'egg'
import { createSSRApp } from 'vue'
import { renderToString } from '@vue/server-renderer'
import LegoComponents from 'lego-components'

/**
 * Utils Service
 */

const reg = /^(\d+(\.\d+)?)px$/

export default class Utils extends Service {
  public async queryRanderPageData(id: number) {
    const work = await this.service.work.findWorkById(id)
    if (!work) {
      throw new Error("未找到作品");
    }
    const { title, content } = work

    this.px2vw((content && content.components) || [])

    const ssrApp = createSSRApp({
      data() {
        return {
          components: (content && content.components) || []
        }
      },
      template: `<final-page :components="components"></final-page>`
    })
    ssrApp.use(LegoComponents)

    const html = await renderToString(ssrApp)

    const bodyStyle = this.propsToStyle(content && content.props)

    return {
      title,
      html,
      bodyStyle
    }
  }

  px2vw(components = []) {
    components.forEach((component: any = {}) => {
      const { props } = component
      Object.keys(props).forEach(key => {
        const val = props[key]
        if (typeof val !== 'string') {
          return
        }
        if (reg.test(val) === false) {
          return
        }
        this.propsPx2vw(props, key)
      })
    })
  }

  propsPx2vw(props: any, key) {
    const val = props[key]
    if (typeof val !== 'string') {
      return
    }
    if (reg.test(val) === false) {
      return
    }
    const arr = val.match(reg) || []
    const numStr = arr[1]
    const num = parseFloat(numStr)
    // 计算出 vw，重新赋值
    // 编辑器的画布宽度是 375
    const vwNum = (num / 375) * 100
    props[key] = `${vwNum.toFixed(2)}vw`
  }

  propsToStyle(props: any) {
    let style = ''
    Object.keys(props).forEach(key => {
      this.propsPx2vw(props, key)
      const k = key.replace(/[A-Z]/g, (k) => `-${k.toLocaleLowerCase()}`)
      style += `${k}:${props[key]};`
    })
    return style
  }
}
