(this["webpackJsonppda-client"]=this["webpackJsonppda-client"]||[]).push([[0],{45:function(e,t,a){e.exports=a(65)},64:function(e,t,a){},65:function(e,t,a){"use strict";a.r(t);var n=a(6),o=a.n(n),c=a(0),s=a.n(c),r=a(35),l=a.n(r),i=(a(44),a(1)),m=a(16),u=a(3),f=a(36),d={setAndroidApp:function(e,t){e.setState(Object(u.a)({},e.state,{androidApp:t}))},setAuthUser:function(e,t){e.setState(Object(u.a)({},e.state,{authUser:t}))},setLoadPage:function(e,t){e.setState(Object(u.a)({},e.state,{loadPage:t}))}},p=Object(f.a)(s.a,{androidApp:!1,authUser:null,loadPage:!1},d),h=a(4);var E=Object(m.g)(Object(h.c)()((function(){var e=p(),t=Object(i.a)(e,2)[1],a=Object(c.useState)(!1),n=Object(i.a)(a,2),o=n[0],r=n[1];return Object(c.useEffect)((function(){t.setLoadPage(!1)}),[]),o?s.a.createElement(m.a,{push:!0,to:"/Inventory"}):s.a.createElement("section",{className:"famo-wrapper"},s.a.createElement("div",{className:"famo-content"},s.a.createElement("div",{className:"famo-grid"},s.a.createElement("div",{className:"famo-row"},s.a.createElement("div",{className:"famo-cell text-center"},s.a.createElement("button",{type:"button",className:"famo-button famo-normal-button",onClick:function(e){r(!0)}},s.a.createElement("span",{className:"famo-text-5"},"Invent\xe1rio")))))))}))),v=a(12),b=a.n(v),g=a(14),N=a.n(g);function y(e){return e?e.toString().replace(new RegExp("\\"+N.a.localeData().delimiters.thousands,"g"),"").replace(new RegExp("\\"+N.a.localeData().delimiters.decimal,"g"),"."):e}window.numeral=N.a;var O,w=function(e){Object(h.b)().t;var t=e.isNumber,a=e.className,n=e.name,r=e.value,l=e.invalidMessage,m=e.noData,f=e.wrongFormat,d=e.invalidValue,p=e.validate,E=e.set,v=Object(c.useState)({noData:!1,wrongFormat:!1,invalidValue:!1}),b=Object(i.a)(v,2),g=b[0],O=b[1],w=s.a.createRef();return Object(c.useEffect)((function(){if(p){var e=r;E((function(e){return Object(u.a)({},e,{noData:!1,wrongFormat:!1,invalidValue:!1})})),e?e&&t&&(e=y(e),isNaN(e)?E((function(e){return Object(u.a)({},e,{noData:!1,wrongFormat:!0,invalidValue:!1})})):parseFloat(e)<=0&&E((function(e){return Object(u.a)({},e,{noData:!1,wrongFormat:!1,invalidValue:!0})}))):E((function(e){return Object(u.a)({},e,{noData:!0,wrongFormat:!1,invalidValue:!1})})),E((function(e){return Object(u.a)({},e,{validateForm:!0})}))}}),[p]),Object(c.useEffect)((function(){O({noData:m,wrongFormat:f,invalidValue:d})}),[m,f,d]),s.a.createElement(s.a.Fragment,null,s.a.createElement("input",{type:"text",className:a+(g.noData?" famo-input-error":g.wrongFormat||g.invalidValue?" famo-input-warning":""),name:n,value:r,ref:w,onKeyDown:function(e){t&&function(e,t){var a,n;o.a.async((function(o){for(;;)switch(o.prev=o.next){case 0:a=t.current.selectionStart,n=t.current.value,110===e.keyCode&&(e.preventDefault(),t.current.value=n.substr(0,a)+N.a.localeData().delimiters.decimal+n.substr(a,n.length-1));case 2:case"end":return o.stop()}}))}(e,w)},onChange:function(e){return E((function(e){return Object(u.a)({},e,{value:w.current.value})}))}}),s.a.createElement("div",{className:"famo-input-message"+(g.wrongFormat?"":" hide")},s.a.createElement("span",{className:"famo-text-15"},"O campo tem um formato inv\xe1lido.")),s.a.createElement("div",{className:"famo-input-message"+(g.invalidValue?"":" hide")},s.a.createElement("span",{className:"famo-text-15"},l)))};!function(e){e[e.productInput=1]="productInput"}(O||(O={}));var j=Object(h.c)()((function(e){var t=e.contentType,a=e.visible,n=e.setVisible,o=e.confirm,r=e.t,l=Object(c.useState)(a),m=Object(i.a)(l,2),u=m[0],f=m[1],d=Object(c.useState)(""),p=Object(i.a)(d,2),h=p[0],E=p[1],v=[E];function b(){switch(t){case O.productInput:o(h)}n(!1)}function g(e){e.preventDefault(),b()}return Object(c.useEffect)((function(){f(a),a||v.forEach((function(e){e("")}))}),[a]),s.a.createElement("section",{className:"w3-modal famo-modal"+(u?" w3-show":""),onClick:function(e){return n(!1)}},s.a.createElement("div",{className:"w3-modal-content famo-modal-content",onClick:function(e){return e.stopPropagation()}},function(){switch(t){case O.productInput:return s.a.createElement("section",{className:"famo-wrapper"},s.a.createElement("div",{className:"famo-content"},s.a.createElement("form",{className:"famo-grid famo-form-grid famo-submit-form",noValidate:!0,onSubmit:g},s.a.createElement("div",{className:"famo-row"},s.a.createElement("div",{className:"famo-cell famo-input-label"},s.a.createElement("span",{className:"famo-text-11"},r("key_87"))),s.a.createElement("div",{className:"famo-cell"},s.a.createElement("input",{type:"text",className:"famo-input famo-text-10",name:"productCode",value:h,onChange:function(e){return E(e.target.value)}}))),s.a.createElement("input",{type:"submit",className:"hide",value:""})),s.a.createElement("div",{className:"famo-grid famo-buttons"},s.a.createElement("div",{className:"famo-row"},s.a.createElement("div",{className:"famo-cell text-right"},s.a.createElement("button",{type:"button",className:"famo-button famo-confirm-button",onClick:function(e){return b()}},s.a.createElement("span",{className:"famo-text-12"},r("key_701"))),s.a.createElement("button",{type:"button",className:"famo-button famo-cancel-button",onClick:function(e){return n(!1)}},s.a.createElement("span",{className:"famo-text-12"},r("key_484"))))))))}}()),s.a.createElement("div",{className:"famo-buttons"},s.a.createElement("button",{type:"button",className:"famo-button famo-icon-button",title:r("key_200"),onClick:function(e){e.stopPropagation(),n(!1)}},s.a.createElement("span",{className:"fas fa-times"}))))}));var k=function(e){var t=e.text,a=Object(c.useState)(!1),n=Object(i.a)(a,2),o=n[0],r=n[1];return s.a.createElement("div",{className:"famo-title"+(o?" collapsed":"")},s.a.createElement("span",{className:"famo-text-13",onClick:function(e){r(!o)}},t))};function x(e){var t=e.hide;return s.a.createElement("div",{className:"famo-loader-wrapper"+(t?" hide":"")},s.a.createElement("div",{className:"famo-loader"}))}function C(e,t){var a=document.createElement("script");a.async=!0,a.src=e,a.type="text/javascript",t.current.appendChild(a)}var S="pda",D="http://cpu-244.famo.pt:3030/";function _(e){fetch(D+"Log/Http/Errors?appName="+S+"&timestamp="+(new Date).getTime(),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({status:e.status,statusText:e.statusText,url:e.url}),credentials:"include"}).then((function(){})).catch((function(){}))}function P(e){fetch(D+"Log/Promise/Errors?appName="+S+"&timestamp="+(new Date).getTime(),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:e.message,stack:e.stack,request:e.request?{method:e.request.method,path:e.request.path}:null,response:e.response?{status:e.response.status}:null}),credentials:"include"}).then((function(){})).catch((function(){}))}var F=Object(m.g)(Object(h.c)()((function(e){var t=e.t,a=p(),n=Object(i.a)(a,2),o=n[0],r=n[1],l=Object(c.useState)(""),m=Object(i.a)(l,2),f=m[0],d=m[1],h=Object(c.useState)([]),E=Object(i.a)(h,2),v=E[0],g=E[1],N=Object(c.useState)(!1),S=Object(i.a)(N,2),F=S[0],I=S[1],A=Object(c.useState)(!1),T=Object(i.a)(A,2),M=T[0],V=T[1],U=Object(c.useState)(null),R=Object(i.a)(U,2),L=R[0],H=R[1],q=Object(c.useState)({isNumber:!0,className:"famo-input famo-text-10",name:"quantity",label:t("key_347"),value:"",invalidMessage:t("key_13"),noData:!1,wrongFormat:!1,invalidValue:!1,validate:!1,validateForm:!1}),B=Object(i.a)(q,2),G=B[0],K=B[1],J=[G],Y=[K],z=s.a.createRef();function Q(e){var a=e.split("/"),n=a[0],o="";a.length>1&&(o=a[1]),V(!0),fetch(D+"ERP/Inventories/Products?inventoryCode="+f+"&productCode="+n+"&productVariantCode="+o+"&timestamp="+(new Date).getTime(),{method:"GET",credentials:"include"}).then((function(e){e.ok&&e.status===b.a.OK?e.json().then((function(e){H(e),Y.forEach((function(e){e((function(e){return Object(u.a)({},e,{value:""})}))}))})).catch((function(e){H(null),P(e),alert(t("key_416"))})):(H(null),_(e),alert("O c\xf3digo n\xe3o corresponde a um produto do invent\xe1rio."))})).catch((function(e){H(null),P(e),alert(t("key_416"))})).finally((function(){V(!1)}))}return Object(c.useEffect)((function(){r.setLoadPage(!0),C("https://cpu-244.famo.pt/FAMO.CODE/Scripts/numeral/locales/pt-pt.js?version=26",z),C("https://cpu-244.famo.pt/FAMO.CODE/Scripts/numeral/locales/es-es.js?version=26",z),C("https://cpu-244.famo.pt/FAMO.CODE/Scripts/numeral/locales/fr.js?version=26",z)}),[]),Object(c.useEffect)((function(){o.authUser&&fetch(D+"ERP/Inventories?timestamp="+(new Date).getTime(),{method:"GET",credentials:"include"}).then((function(e){e.ok&&e.status===b.a.OK?e.json().then((function(e){g(e),r.setLoadPage(!1)})).catch((function(e){P(e),alert(t("key_416"))})):(_(e),alert(t("key_303")))})).catch((function(e){P(e),alert(t("key_416"))}))}),[o.authUser]),Object(c.useEffect)((function(){""===f&&H(null)}),[f]),Object(c.useEffect)((function(){var e,a;J.some((function(e){return!e.validateForm}))||(J.some((function(e){return e.noData||e.wrongFormat||e.invalidValue}))?(J.some((function(e){return e.noData}))&&function(e){alert(e("key_197"))}(t),J.some((function(e){return e.wrongFormat}))&&function(e,t){for(var a=t("key_191"),n=0,o=e.length;n<o;n++)a+=e[n],n<o-2?a+=", ":n===o-2&&(a+=" "+t("key_573")+" ");alert(a)}(J.filter((function(e){return e.wrongFormat})).map((function(e){return e.label})),t),J.some((function(e){return e.invalidValue}))&&function(e,t){for(var a=t("key_192"),n=0,o=e.length;n<o;n++)a+=e[n],n<o-2?a+=", ":n===o-2&&(a+=" "+t("key_573")+" ");alert(a)}(J.filter((function(e){return e.invalidValue})).map((function(e){return e.label})),t)):(V(!0),fetch(D+"ERP/Inventories/Products"+function(e){var t="?timestamp="+(new Date).getTime();for(var a in e){var n=e[a];if(Array.isArray(n))for(var o=0,c=n.length;o<c;o++)t+="&"+a+"="+(null===n[o]?"":encodeURIComponent(n[o]));else t+="&"+a+"="+(null===n?"":encodeURIComponent(n))}return t}({documentCode:L.Code,productCode:L.ProductCode,productVariantCode:L.ProductVariantCode,locationCode:L.LocationCode,quantity:(e=G.value,a=!0,a?parseFloat(y(e)):e)}),{method:"PATCH",credentials:"include"}).then((function(e){e.ok&&e.status===b.a.OK?(H(null),alert("A quantidade foi alterada com sucesso.")):(_(e),alert(t("key_302")))})).catch((function(e){P(e),alert(t("key_416"))})).finally((function(){V(!1)}))),Y.forEach((function(e){e((function(e){return Object(u.a)({},e,{validate:!1,validateForm:!1})}))})))}),J),s.a.createElement(s.a.Fragment,null,s.a.createElement("section",{className:"famo-wrapper",ref:z},s.a.createElement("div",{className:"famo-content"},s.a.createElement("form",{className:"famo-grid famo-form-grid",noValidate:!0,onSubmit:function(e){return e.preventDefault()}},s.a.createElement("div",{className:"famo-row"},s.a.createElement("div",{className:"famo-cell famo-input-label"},s.a.createElement("span",{className:"famo-text-11"},"Invent\xe1rio")),s.a.createElement("div",{className:"famo-cell"},s.a.createElement("select",{className:"famo-input famo-text-10",name:"inventoryCode",disabled:M,onChange:function(e){return d(e.target.value)}},s.a.createElement("option",{key:""}),v.map((function(e,t){return s.a.createElement("option",{key:t,value:e.Code},e.Name)})))))))),L||M?s.a.createElement("section",{className:"famo-wrapper"},s.a.createElement(k,{text:t("key_339")}),s.a.createElement("div",{className:"famo-content"},s.a.createElement(x,{hide:!M}),s.a.createElement("form",{className:"famo-grid famo-form-grid"+(M?" hide":""),noValidate:!0,onSubmit:function(e){return e.preventDefault()}},s.a.createElement("div",{className:"famo-row"},s.a.createElement("div",{className:"famo-cell famo-input-label"},s.a.createElement("span",{className:"famo-text-11"},t("key_87"))),s.a.createElement("div",{className:"famo-cell"},s.a.createElement("input",{type:"text",className:"famo-input famo-text-10",name:"productCode",disabled:!0,value:L?L.ProductCode:""}))),s.a.createElement("div",{className:"famo-row"},s.a.createElement("div",{className:"famo-cell famo-input-label"},s.a.createElement("span",{className:"famo-text-11"},t("key_464"))),s.a.createElement("div",{className:"famo-cell"},s.a.createElement("input",{type:"text",className:"famo-input famo-text-10",name:"productVariantCode",disabled:!0,value:L?L.ProductVariantCode:""}))),s.a.createElement("div",{className:"famo-row"},s.a.createElement("div",{className:"famo-cell famo-input-label"},s.a.createElement("span",{className:"famo-text-11"},t("key_138"))),s.a.createElement("div",{className:"famo-cell"},s.a.createElement("input",{type:"text",className:"famo-input famo-text-10",name:"productDescription",disabled:!0,value:L?L.ProductDescription:""}))),s.a.createElement("div",{className:"famo-row"},s.a.createElement("div",{className:"famo-cell famo-input-label"},s.a.createElement("span",{className:"famo-text-11"},t("key_751"))),s.a.createElement("div",{className:"famo-cell"},s.a.createElement("input",{type:"text",className:"famo-input famo-text-10",name:"locationCode",disabled:!0,value:L?L.LocationCode:""}))),s.a.createElement("div",{className:"famo-row"},s.a.createElement("div",{className:"famo-cell famo-input-label"},s.a.createElement("span",{className:"famo-text-11"},t("key_347"))),s.a.createElement("div",{className:"famo-cell"},s.a.createElement(w,Object.assign({},G,{set:K}))))),s.a.createElement("div",{className:"famo-grid famo-buttons"+(M?" hide":"")},s.a.createElement("div",{className:"famo-row"},s.a.createElement("div",{className:"famo-cell text-right"},s.a.createElement("button",{type:"button",className:"famo-button famo-confirm-button",onClick:function(e){Y.forEach((function(e){e((function(e){return Object(u.a)({},e,{validate:!0})}))}))}},s.a.createElement("span",{className:"famo-text-12"},"Registar"))))))):null,f?s.a.createElement("section",{className:"famo-wrapper"},s.a.createElement("div",{className:"famo-grid"},s.a.createElement("div",{className:"famo-row"},s.a.createElement("div",{className:"famo-cell text-right"},s.a.createElement("button",{type:"button",className:"famo-button famo-normal-button",disabled:M,onClick:function(e){return I(!0)}},s.a.createElement("span",{className:"famo-text-12"},"Manual")),o.androidApp?s.a.createElement("button",{type:"button",className:"famo-button famo-normal-button",disabled:M,onClick:function(e){window.cordova.plugins.barcodeScanner.scan((function(e){e.cancelled||Q(e.text)}),(function(e){alert(t("key_686"))}),{preferFrontCamera:!1,showFlipCameraButton:!1,showTorchButton:!0,torchOn:!1,saveHistory:!1,prompt:"",resultDisplayDuration:0,formats:"CODE_39",orientation:"unset",disableAnimations:!0,disableSuccessBeep:!1,continuousMode:!1})}},s.a.createElement("span",{className:"famo-text-12"},t("key_681"))):null)))):null,s.a.createElement(j,{contentType:O.productInput,visible:F,setVisible:I,confirm:Q}))}))),I=a(19),A=a(22),T=a(29),M=a(31),V=a(30),U=a(32);function R(e,t,a){fetch(D+"Platform/Android?timestamp="+(new Date).getTime(),{method:"GET",credentials:"include"}).then((function(n){n.ok&&n.status===b.a.OK?n.json().then((function(a){!function(e){switch(e){case"POR":N.a.locale("pt-pt");break;case"ENG":N.a.locale("en");break;case"ESP":N.a.locale("es-es");break;case"FRA":N.a.locale("fr")}}(e.Language.Code),t.setAndroidApp(a),t.setAuthUser(e)})).catch((function(e){P(e),alert(a("key_416"))})):(_(n),alert(a("key_303")))})).catch((function(e){P(e),alert(a("key_416"))}))}function L(e,t){H.autoSignIn().then((function(a){a.ok&&a.status===b.a.OK?a.json().then((function(a){R(a,e,t)})).catch((function(e){P(e),alert(t("key_416"))})):(_(a),alert(t("key_306")))})).catch((function(e){P(e),alert(t("key_416"))}))}var H=function e(){Object(A.a)(this,e)};H.signIn=function(e,t){return o.a.async((function(a){for(;;)switch(a.prev=a.next){case 0:return a.abrupt("return",fetch(D+"Authentication/SignIn",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:e,password:t}),credentials:"include"}));case 1:case"end":return a.stop()}}))},H.autoSignIn=function(){return o.a.async((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",fetch(D+"Authentication/AutoSignIn?timestamp="+(new Date).getTime(),{method:"GET",credentials:"include"}));case 1:case"end":return e.stop()}}))},H.signOut=function(){return o.a.async((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",fetch(D+"Authentication/SignOut",{method:"GET",credentials:"include"}));case 1:case"end":return e.stop()}}))};var q=a(25),B=a.n(q),G=a(43),K=a(42);G.a.use(K.a).use(h.a).init({lng:"pt",fallbackLng:"pt",whitelist:["pt","en","es","fr"],debug:!1,react:{useSuspense:!1},backend:{loadPath:"./JSON/i18n/{{lng}}.json?timestamp="+(new Date).getTime(),crossDomain:!0}});var J=function(e){function t(e){var a;return Object(A.a)(this,t),(a=Object(M.a)(this,Object(V.a)(t).call(this,e))).usernameRef=void 0,a.hideInputMsg=function(e){return"signin-error-input"+(e?" hide":"")},a.handleChangeInput=function(e){a.setState(Object(I.a)({},e.target.name,e.target.value))},a.handleUserInput=function(e){e.target.value||a.setState({hideUserMsg:"blur"!==e.type})},a.handlePwdInput=function(e){e.target.value||a.setState({hidePwdMsg:"blur"!==e.type})},a.handleSubmit=function(e){var t,n,c,s,r,l;return o.a.async((function(m){for(;;)switch(m.prev=m.next){case 0:if(e.preventDefault(),t=p(),n=Object(i.a)(t,2),c=n[1],a.state.username&&a.state.password){m.next=6;break}a.setState({hideUserMsg:!!a.state.username,hidePwdMsg:!!a.state.password}),m.next=24;break;case 6:return m.next=8,o.a.awrap(H.signIn(a.state.username,a.state.password));case 8:if(s=m.sent,r=a.props.t,a.setState({authError:!1,authHttpCode:-1}),!s.ok){m.next=20;break}return a.setState({authSuccess:!0}),m.t0=c,m.next=16,o.a.awrap(s.json());case 16:m.t1=m.sent,m.t0.setAuthUser.call(m.t0,m.t1),m.next=24;break;case 20:400!==(l=s.status)&&500!==l&&console.log(r("key_416")+" - "+l),a.usernameRef.current.focus(),a.setState({password:"",hidePwdMsg:!0,authError:!0,authHttpCode:l});case 24:case"end":return m.stop()}}))},a.state={username:"",password:"",hideUserMsg:!0,hidePwdMsg:!0,authSuccess:!1,authError:!1,authHttpCode:-1},a.usernameRef=s.a.createRef(),a}return Object(U.a)(t,e),Object(T.a)(t,[{key:"componentDidMount",value:function(){this.usernameRef.current.focus()}},{key:"render",value:function(){var e=B()("famo-input signin-form-input famo-text-3",{"famo-input-error":!this.state.hideUserMsg}),t=B()("famo-input signin-form-input famo-text-3",{"famo-input-error":!this.state.hidePwdMsg}),a=B()("signin-error-submit",{hide:!this.state.authError}),n=this.props,o=n.t,c=n.location;return this.state.authSuccess?s.a.createElement(m.a,{to:c.state||{from:{pathname:"/"}}}):s.a.createElement("section",{className:"famo-grid signin"},s.a.createElement("div",{className:"famo-row"},s.a.createElement("div",{className:"famo-cell"},s.a.createElement("div",{className:"signin-body"},s.a.createElement("div",{className:"signin-famo-logo"},s.a.createElement("img",{src:"https://cpu-244.famo.pt/FAMO.CODE/Content/Images/logo-famo-black-normal.png",alt:"FAMO"})),s.a.createElement("div",{className:"signin-form"},s.a.createElement("div",{className:"signin-app-name"},s.a.createElement("span",{className:"famo-text-2"},"PDA")),s.a.createElement("form",{id:"signin-form",method:"POST",onSubmit:this.handleSubmit},s.a.createElement("div",{className:"signin-input-wrapper"},s.a.createElement("input",{type:"text",id:"signin-username-input",className:e,placeholder:o("key_397"),ref:this.usernameRef,name:"username",value:this.state.username,autoComplete:"off",onChange:this.handleChangeInput,onFocus:this.handleUserInput,onBlur:this.handleUserInput}),s.a.createElement(Y,{msgClass:this.hideInputMsg(this.state.hideUserMsg),msgText:o("key_196")})),s.a.createElement("div",{className:"signin-input-wrapper"},s.a.createElement("input",{type:"password",id:"signin-password-input",className:t,placeholder:o("key_314"),name:"password",value:this.state.password,onChange:this.handleChangeInput,onFocus:this.handlePwdInput,onBlur:this.handlePwdInput}),s.a.createElement(Y,{msgClass:this.hideInputMsg(this.state.hidePwdMsg),msgText:o("key_195")})),s.a.createElement("div",{className:a},this.state.authError&&400===this.state.authHttpCode&&s.a.createElement("span",{className:"famo-text-7"},o("key_398")),this.state.authError&&500===this.state.authHttpCode&&s.a.createElement("span",{className:"famo-text-7"},o("key_306"))),s.a.createElement("button",{className:"famo-button famo-confirm-button signin-button-submit",type:"submit"},s.a.createElement("span",{className:"famo-text-5"},o("key_238"))),s.a.createElement("button",{type:"button",className:"famo-button famo-transparent-button signup-button"},s.a.createElement("span",{className:"famo-text-27"},o("key_648")))))))),s.a.createElement("div",{className:"famo-row"},s.a.createElement("div",{className:"famo-cell famo-cell-bottom"},s.a.createElement("div",{className:"signin-footer text-center"},s.a.createElement("span",{className:"famo-text-1"},(new Date).getFullYear()," \xa9 FAMO - ","PDA")))))}}]),t}(s.a.Component),Y=function(e){function t(){return Object(A.a)(this,t),Object(M.a)(this,Object(V.a)(t).apply(this,arguments))}return Object(U.a)(t,e),Object(T.a)(t,[{key:"render",value:function(){var e=this.props,t=e.msgClass,a=e.msgText;return s.a.createElement("div",{className:t},s.a.createElement("span",{className:"famo-text-7"},a))}}]),t}(s.a.Component),z=(Object(h.c)()(J),a(18));a(64);function Q(e){var t=e.t,a=p(),n=Object(i.a)(a,2),o=n[0],r=n[1];return Object(c.useEffect)((function(){fetch(D+"Authentication/Session/User",{method:"GET",credentials:"include"}).then((function(e){e.ok&&e.status===b.a.OK?e.json().then((function(e){R(e,r,t)})).catch((function(e){L(r,t),P(e)})):(L(r,t),_(e))})).catch((function(e){L(r,t),P(e)}))}),[]),s.a.createElement("section",{className:"famo-body"},s.a.createElement(m.d,null,s.a.createElement(m.b,{exact:!0,path:"/"},s.a.createElement(E,null)),s.a.createElement(m.b,{path:"/Inventory"},s.a.createElement(F,null))),s.a.createElement("div",{className:"pda-app-loader"+(o.authUser&&!o.loadPage?" hide":"")},s.a.createElement("div",{className:"famo-loader"})))}var W=Object(h.c)()((function(e){return window.cordova?s.a.createElement(z.b,null,s.a.createElement(Q,e)):s.a.createElement(z.a,null,s.a.createElement(Q,e))}));function X(){return o.a.async((function(e){for(;;)switch(e.prev=e.next){case 0:try{document.getElementById("pda-footer").innerText=(new Date).getFullYear()+" \xa9 FAMO - PDA",l.a.render(s.a.createElement(W,null),document.getElementById("root"))}catch(t){alert("Oops!! Liga o servidor Node.js!")}case 1:case"end":return e.stop()}}))}window.cordova?document.addEventListener("deviceready",X,!1):X()}},[[45,1,2]]]);