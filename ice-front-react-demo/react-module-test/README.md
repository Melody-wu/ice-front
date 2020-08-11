## 基于create-react-app 实现的Npm模块测试Demo

### 实现方式

- 软链接
- package.json 中file 关键字


### 第一种实现
```
cd npm_module_demo
npm link 

cd react-module-test
npm link npm_module_demo
```
### `yarn start`