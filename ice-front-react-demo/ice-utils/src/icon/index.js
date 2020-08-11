import {
    createFromIconfontCN
} from '@ant-design/icons';

const IconFont = createFromIconfontCN({
    scriptUrl: process.env.ICONFONT_URI || '//at.alicdn.com/t/font_910269_q5ghvjdyvqg.js'
});

export default IconFont;