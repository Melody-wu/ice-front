 import axios from './axios';
 import moment from 'moment';
 import IconFont from './icon';
 import {
   IEVersion,
   isPc,
   isMac,
   isWindows,
   isIOS,
   isAndroid,
   getUrlParam,
   getQueryString,
   dateToTimestamp
 } from './common/utils'

 export {
   //http 请求
   axios,
   // 公用的方法
   IconFont,
   getUrlParam,
   getQueryString,
   dateToTimestamp,
   // 判断浏览器和机器类型
   IEVersion,
   isPc,
   isMac,
   isWindows,
   isIOS,
   isAndroid,
   moment
 }