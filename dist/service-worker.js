if(!self.define){let e,s={};const i=(i,n)=>(i=new URL(i+".js",n).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(n,r)=>{const o=e||("document"in self?document.currentScript.src:"")||location.href;if(s[o])return;let l={};const c=e=>i(e,o),t={module:{uri:o},exports:l,require:c};s[o]=Promise.all(n.map((e=>t[e]||c(e)))).then((e=>(r(...e),l)))}}define(["./workbox-d6430d1c"],(function(e){"use strict";e.setCacheNameDetails({prefix:"front"}),self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"/css/app.f9a8f065.css",revision:null},{url:"/css/chunk-vendors.9c97f2fb.css",revision:null},{url:"/img/loading.4f4a0956.gif",revision:null},{url:"/img/pig.37d60b40.jpg",revision:null},{url:"/index.html",revision:"8f4cf7464d64eacb539b5b36bb444de0"},{url:"/js/app.c9aeb0c0.js",revision:null},{url:"/js/chunk-vendors.7c3f3ef8.js",revision:null},{url:"/manifest.json",revision:"588e5998deaad78ac5857702fa5e4faa"},{url:"/piggy-bank.png",revision:"0c9630b9f6e6ec6e986fe00084bc1e36"},{url:"/robots.txt",revision:"b6216d61c03e6ce0c9aea6ca7808f7ca"}],{})}));
//# sourceMappingURL=service-worker.js.map
