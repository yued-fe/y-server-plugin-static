'use strict';
require('colors');

const url = require('url');

const express = require('express');
const proxy = require('http-proxy-middleware');

function isObject(obj) {
  return typeof obj === 'object' && obj !== null;
}

function each(obj, fn) {
  if (isObject(obj)) {
    Object.keys(obj).forEach(function (key) {
      fn(obj[key], key);
    });
  }
}

/**
 * 获取带协议的域名
 * @param {String} uri 任意地址
 * @return {String} 带协议的域名
 */
function getHost(uri) {
  const uriObj = url.parse(uri);
  return `${uriObj.protocol}//${uriObj.host}`;
}

/**
 * 获取代理中间件
 * @param  {String} context 要代理的path
 * @param  {String} uri 代理到的uri
 * @return {Function} 中间件方法
 */
function getProxyMiddleware(context, uri) {
  const pathRewrite = {};
  pathRewrite[`^${context}`] = url.parse(uri).pathname;

  return proxy({
    target: getHost(uri),
    changeOrigin: true,
    logLevel: 'warn',
    pathRewrite: pathRewrite,
  });
}

/**
 * 请求地址修复中间件
 * SwitchyOmega 将 localsite.com 指向到 locahost:8080 时得到的 url 包含 host,
 * http-proxy-middleware 的 pathRewrite 的 '^/xx' 正则需要 req.originalUrl 不能包含 host
 * 代理之前需要调用此方法对 req.originalUrl 进行修复
 * @param {Request} req 请求实例
 * @param {Resopnse} res 响应实例
 * @param {Function} next 下一步回调
 */
function reqUrlFixMiddleware(req, res, next) {
  req.originalUrl = url.parse(req.originalUrl).path;
  next();
}

/**
 * y-server 静态资源插件
 * @param {Object} app Express实例
 * @param {Object} options 配置
 * @param {String|Object} options.staticPaths 静态资源路径配置
   * 初始化方法
 */
module.exports = function (options) {
  if (!options) {
    options = {};
  }

  const staticPaths = options.staticPaths;

  const REG_HTTP = /^(http|https):\/\//i;

  /**
   * 初始化方法
   * @param {Object} app Express实例
   */
  return function (app) {
    if (typeof staticPaths === 'string') {
      // 指向的是某一个具体路径
      return app.use(express.static(staticPaths));
    }
    if (!isObject(staticPaths)) {
      return;
    }

    each(staticPaths, function (staticPath, routePath) {
      if (REG_HTTP.test(staticPath)) {
        // 以 http/https 开头的路径, 使用 express-http-proxy 进行代理
        console.log('[静态资源映射]'.blue, `"${routePath}"`, '->', `"${staticPath}"`);

        app.use(routePath, reqUrlFixMiddleware, getProxyMiddleware(routePath, staticPath));
      } else {
        app.use(routePath, express.static(staticPath));
      }
    });
  };
};
