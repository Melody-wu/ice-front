import md5 from 'md5';

// 深度拷贝
export const deepClone = (data) => {

  if (typeof data == null || typeof data !== 'object') {
    return data;
  }

  let result;

  if (data instanceof Array) {
    result = [];
  } else if (data instanceof Object) {
    result = {};
  }
  for (let key in data) {
    // 保证key 不是原形的属性，判断它是否有这个个这属性
    result[key] = deepClone(data[key])
  }
  return result;
}

// 获取url参数
export const getQueryString = (name) => {
  const url = window.location.href;
  const theRequest = {};
  if (url.indexOf('?') !== -1) {
    const str = url.split('?')[1];
    const strs = str.split('&');
    for (let i = 0; i < strs.length; i += 1) {
      theRequest[strs[i].split('=')[0]] = decodeURI(strs[i].split('=')[1]);
    }
    return theRequest[name] || '';
  }
};
/*
 * 获取某个url参数
 * @param {query参数名} key
 */
export const getUrlParam = key => {
  return new URL(location.href.replace('#', '')).searchParams.get(key)
}

// 将base64转换为文件
export const dataURLtoFile = (dataurl) => {
  const agent = navigator.userAgent;
  const isOpera = agent.indexOf('Opera') > -1;
  const isIE = agent.indexOf('compatible') > -1 && agent.indexOf('MSIE') > -1 && !isOpera;
  const isIE11 = agent.indexOf('Trident') > -1 && agent.indexOf('rv:11.0') > -1;
  const isEdge = agent.indexOf('Edge') > -1;

  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = window.atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n -= 1) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  if (isIE11 || isIE || isEdge) {
    return [new Blob([u8arr], {
      type: mime
    }), `${md5((new Date()).getTime())}.${mime.split('/')[1]}`];
  }
  return new File([u8arr], `${md5((new Date()).getTime())}.${mime.split('/')[1]}`, {
    type: mime
  });
};

// 时间戳
export const dateToTimestamp = (time, language = 'zh_CN') => {
  // 刚刚、几分钟前、几小时前、几天前、几周前、（超一周后且当年）月日-时分、年月日-时分
  const now = new Date().getTime();
  const {
    userAgent
  } = navigator;
  // const last = new Date(knowledgeInfo.lastUpdateDate).getTime();
  let last = '';
  if ('msSaveOrOpenBlob' in navigator) { // 判断是ie的浏览器，调用ie文件下载的方法
    if (time) {
      last = new Date(Date.parse(time.replace(/-/g, '/')));
    }
  } else if (userAgent.indexOf('Safari') > -1 || userAgent.indexOf('iPhone') > -1) {
    if (time) {
      last = new Date(Date.parse(time.replace(/-/g, '/')));
    }
  } else {
    last = new Date(time).getTime();
  }
  // const subtract = (now - last) / (1000 * 60 * 60);  // 这是时间差毫小时
  const subtract = (now - last); // 这是时间差毫小时

  const minute = 1000 * 60;
  const hour = minute * 60;
  const day = hour * 24;
  const halfamonth = day * 15;
  const month = day * 30;

  const yearC = subtract / (month * 12);
  const monthC = subtract / month;
  const weekC = subtract / (7 * day);
  const dayC = subtract / day;
  const hourC = subtract / hour;
  const minC = subtract / minute;

  const t = time.split(' ');
  const yy = t[0].split('-')[0];
  const mm = t[0].split('-')[1];
  const dd = t[0].split('-')[2];
  const hh = t[1].split(':')[0];
  const mmm = t[1].split(':')[1];
  if (language === 'zh_CN') {
    if (yearC >= 1) {
      return `${yy}-${mm}-${dd} ${hh}:${mmm}`; // 年月日-时分
    }
    if (monthC >= 1) {
      return `${mm}-${dd} ${hh}:${mmm}`; // 当年的 月日-时分
    }
    if (weekC >= 1) {
      return `${parseInt(weekC, 10)}周前`; // 几周
    }
    if (dayC >= 1) {
      return `${parseInt(dayC, 10)}天前`; // 几天
    }
    if (hourC >= 1) {
      return `${parseInt(hourC, 10)}小时前`; // 小时
    }
    if (minC >= 1) {
      return `${parseInt(minC, 10)}分钟前`; // 分钟
    }
    return '刚刚';
  } else {
    if (yearC >= 1) {
      return `${yy}-${mm}-${dd} ${hh}:${mmm}`; // 年月日-时分
    }
    if (monthC >= 1) {
      return `${mm}-${dd} ${hh}:${mmm}`; // 当年的 月日-时分
    }
    if (weekC >= 1) {
      return `${parseInt(weekC, 10)} week ago`; // 几周
    }
    if (dayC >= 1) {
      return `${parseInt(dayC, 10)} days ago`; // 几天
    }
    if (hourC >= 1) {
      return `${parseInt(hourC, 10)} hours ago`; // 小时
    }
    if (minC >= 1) {
      return `${parseInt(minC, 10)} minutes ago`; // 分钟
    }
    return 'just';
  }
};

/**
 * 获取IE版本号
 * return -1 非ie
 *
 */
export const IEVersion = () => {
  var userAgent = navigator.userAgent;
  var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器  
  var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器
  var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
  if (isIE) {
    var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
    reIE.test(userAgent);
    var fIEVersion = parseFloat(RegExp["$1"]);
    if (fIEVersion == 7) {
      return 7;
    } else if (fIEVersion == 8) {
      return 8;
    } else if (fIEVersion == 9) {
      return 9;
    } else if (fIEVersion == 10) {
      return 10;
    } else {
      return 6; //IE版本<=7
    }
  } else if (isEdge) {
    return 'edge'; //edge
  } else if (isIE11) {
    return 11; //IE11
  } else {
    return -1; //不是ie浏览器
  }
}


/**
 * 是否是PC设备
 */
export const isPc = () => {
  var userAgentInfo = navigator.userAgent;
  var Agents = ["Android", "iPhone",
    "SymbianOS", "Windows Phone",
    "iPad", "iPod"
  ];
  var flag = true;
  for (var v = 0; v < Agents.length; v++) {
    if (userAgentInfo.indexOf(Agents[v]) > 0) {
      flag = false;
      break;
    }
  }
  return flag;
}

/**
 * 是否是Mac设备
 */
export const isMac = () => {
  return /macintosh|mac os x/i.test(navigator.userAgent);
}

/**
 * 是否win设备
 */
export const isWindows = () => {
  return /windows|win32/i.test(navigator.userAgent);
}

/**
 * 是否是iOS设备
 */
export const isIOS = () => {
  var u = navigator.userAgent;
  var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
  return isiOS
}

/**
 * 是否是Android设备
 */
export const isAndroid = () => {
  var u = navigator.userAgent;
  var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
  return isAndroid
}