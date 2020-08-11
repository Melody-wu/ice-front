---
name: Icon 图标
route: /icon
menu: 组件
menuOrder: 1
# meta: {
#       keepAlive: false
#     }
---

import Iconfont from './index'

# Icon 图标

此组件引用的是[Iconfont-阿里巴巴矢量图标库](https://www.iconfont.cn/)，需要在环境变量中设置`process.env.ICONFONT_URI`

<Iconfont type="icon-HTML" style={{ fontSize: 32, marginRight: 12 }} />
<Iconfont type="icon-TXT" style={{ fontSize: 32, marginRight: 12 }} />
<Iconfont type="icon-PPT" style={{ fontSize: 32, marginRight: 12 }} />

```jsx
<Iconfont type="icon-PPT" />
```

⚠️ icon以svg形式展示，若图标本身带有颜色，则color样式无效
