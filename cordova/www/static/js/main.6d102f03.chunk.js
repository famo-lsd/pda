(this["webpackJsonppda-client"]=this["webpackJsonppda-client"]||[]).push([[0],{47:function(e,t,a){e.exports=a(78)},77:function(e,t,a){},78:function(e,t,a){"use strict";a.r(t);var n=a(7),c=a.n(n),o=a(0),r=a.n(o),l=a(35),s=a.n(l),i=(a(46),a(1)),m=a(16),u=a(2),f="pda",d="http://192.168.1.2:9070/",p=a(19),b=a(13),h=a(18),E="SS_PALLET",v=function(){function e(){Object(b.a)(this,e)}return Object(h.a)(e,null,[{key:"clear",value:function(e){e?e.pallet||window.sessionStorage.removeItem(E):window.sessionStorage.clear()}}]),e}(),N=a(5);var y=Object(p.h)(Object(N.c)()((function(e){var t=e.t,a=Object(o.useState)({inventory:!1,pallet:!1}),n=Object(i.a)(a,2),c=n[0],l=n[1],s=[{label:t("key_806"),key:"inventory",image:"btn-inventario.png"},{label:t("key_826"),key:"pallet",image:"btn-palete.png"}];return Object(o.useEffect)((function(){v.clear()}),[]),c.inventory?r.a.createElement(p.a,{push:!0,to:"/Inventory"}):c.pallet?r.a.createElement(p.a,{push:!0,to:"/Pallet"}):r.a.createElement("div",{className:"container"},r.a.createElement("div",{className:"row",style:{justifyContent:"center"}},s.map((function(e,t){return r.a.createElement("div",{key:t,className:"col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2"},r.a.createElement("section",{className:"famo-wrapper",onClick:function(t){return l((function(t){return Object(u.a)({},t,Object(m.a)({},e.key,!0))}))}},r.a.createElement("div",{className:"famo-content"},r.a.createElement("div",{className:"famo-grid famo-sidebar-main-item"},r.a.createElement("div",{className:"famo-row"},r.a.createElement("div",{className:"famo-cell famo-sidebar-item-label text-center"},r.a.createElement("span",{className:"famo-text-19",title:e.label},e.label))),r.a.createElement("div",{className:"famo-row"},r.a.createElement("div",{className:"famo-cell famo-sidebar-item-img text-center"},r.a.createElement("img",{src:d+"Images/"+e.image,alt:e.label})))))))}))))}))),g=a(3),O=a.n(g),k=a(15),j=a.n(k);function w(e){return e?e.toString().replace(new RegExp("\\"+j.a.localeData().delimiters.thousands,"g"),"").replace(new RegExp("\\"+j.a.localeData().delimiters.decimal,"g"),"."):e}window.numeral=j.a;var x,C=r.a.forwardRef((function(e,t){var a=Object(N.b)().t,n=e.className,l=e.isDisabled,s=e.isNumber,m=e.name,f=e.value,d=e.autoFocus,p=e.noData,b=e.wrongFormat,h=e.invalidValue,E=e.invalidMessage,v=e.analyze,y=e.set,g=e.children,O=Object(o.useState)({noData:!1,wrongFormat:!1,invalidValue:!1}),k=Object(i.a)(O,2),x=k[0],C=k[1],_=r.a.Children.count(g)>0;return Object(o.useEffect)((function(){if(!l&&v){var e=f;y((function(e){return Object(u.a)({},e,{noData:!1,wrongFormat:!1,invalidValue:!1})})),e?s&&e&&(e=w(e),isNaN(e)?y((function(e){return Object(u.a)({},e,{noData:!1,wrongFormat:!0,invalidValue:!1})})):parseFloat(e)<=0&&y((function(e){return Object(u.a)({},e,{noData:!1,wrongFormat:!1,invalidValue:!0})}))):y((function(e){return Object(u.a)({},e,{noData:!0,wrongFormat:!1,invalidValue:!1})})),y((function(e){return Object(u.a)({},e,{analyzeForm:!0})}))}}),[v]),Object(o.useEffect)((function(){C({noData:p,wrongFormat:b,invalidValue:h})}),[p,b,h]),r.a.createElement(r.a.Fragment,null,_?r.a.createElement("select",{className:n+(x.noData?" famo-input-error":""),name:m,ref:t,disabled:l,onChange:function(e){return y((function(e){return Object(u.a)({},e,{value:t.current.value})}))}},g):r.a.createElement("input",{type:"text",className:n+(x.noData?" famo-input-error":x.wrongFormat||x.invalidValue?" famo-input-warning":""),name:m,value:f,ref:t,autoFocus:d,disabled:l,onKeyDown:function(e){s&&function(e,t){var a,n;c.a.async((function(c){for(;;)switch(c.prev=c.next){case 0:a=t.current.selectionStart,n=t.current.value,110===e.keyCode&&(e.preventDefault(),t.current.value=n.substr(0,a)+j.a.localeData().delimiters.decimal+n.substr(a,n.length-1));case 2:case"end":return c.stop()}}))}(e,t)},onChange:function(e){return y((function(e){return Object(u.a)({},e,{value:t.current.value})}))}}),!_&&r.a.createElement(r.a.Fragment,null,!l&&r.a.createElement("div",{className:"famo-input-message"+(x.wrongFormat?"":" hide")},r.a.createElement("span",{className:"famo-text-15"},a("key_808"))),E&&!l&&r.a.createElement("div",{className:"famo-input-message"+(x.invalidValue?"":" hide")},r.a.createElement("span",{className:"famo-text-15"},E))))})),_=function(){function e(){Object(b.a)(this,e)}return Object(h.a)(e,null,[{key:"analyze",value:function(e,t){e.forEach((function(e,a){e.isDisabled||t[a]((function(e){return Object(u.a)({},e,{analyze:!0})}))}))}},{key:"areAllAnalyzed",value:function(e){return!e.filter((function(e){return!e.isDisabled})).some((function(e){return!e.analyzeForm}))}},{key:"areAllValid",value:function(e){return!e.filter((function(e){return!e.isDisabled})).some((function(e){return e.noData||e.wrongFormat||e.invalidValue}))}},{key:"getValue",value:function(e){return e.isNumber?parseFloat(w(e.value)):e.value}},{key:"popUpAlerts",value:function(e,t){e.some((function(e){return e.noData}))&&S.noDataAlert(t),e.some((function(e){return e.wrongFormat}))&&S.wrongFormatAlert(e.filter((function(e){return e.wrongFormat})).map((function(e){return e.label})),t),e.some((function(e){return e.invalidValue}))&&S.invalidValuesAlert(e.filter((function(e){return e.invalidValue})).map((function(e){return e.label})),t)}},{key:"resetValues",value:function(e,t){e.forEach((function(e,a){e.isDisabled||t[a]((function(e){return Object(u.a)({},e,{value:"",noData:!1,wrongFormat:!1,invalidValue:!1,analyze:!1,analyzeForm:!1})}))}))}},{key:"resetValidations",value:function(e,t){e.forEach((function(e,a){e.isDisabled||t[a]((function(e){return Object(u.a)({},e,{analyze:!1,analyzeForm:!1})}))}))}}]),e}(),S=function(){function e(){Object(b.a)(this,e)}return Object(h.a)(e,null,[{key:"invalidValuesAlert",value:function(e,t){for(var a=t("key_192"),n=0,c=e.length;n<c;n++)a+=e[n],n<c-2?a+=", ":n===c-2&&(a+=" "+t("key_573")+" ");alert(a)}},{key:"noDataAlert",value:function(e){alert(e("key_197"))}},{key:"wrongFormatAlert",value:function(e,t){for(var a=t("key_191"),n=0,c=e.length;n<c;n++)a+=e[n],n<c-2?a+=", ":n===c-2&&(a+=" "+t("key_573")+" ");alert(a)}}]),e}(),D=C;!function(e){e[e.inventoryProduct=1]="inventoryProduct",e[e.palletBox=2]="palletBox"}(x||(x={}));var P=Object(N.c)()((function(e){var t=e.contentType,a=e.visible,n=e.setVisible,c=e.confirm,l=e.t,s=Object(o.useState)(a),m=Object(i.a)(s,2),u=m[0],f=m[1],d=Object(o.useState)({className:"famo-input famo-text-10",isDisabled:!1,isNumber:!1,label:l("key_87"),name:"productCode",value:"",ref:r.a.createRef(),noData:!1,analyze:!1,analyzeForm:!1}),p=Object(i.a)(d,2),b=p[0],h=p[1],E=Object(o.useState)({className:"famo-input famo-text-10",isDisabled:!1,isNumber:!1,label:l("key_819"),name:"boxCode",value:"",ref:r.a.createRef(),autoFocus:!0,noData:!1,analyze:!1,analyzeForm:!1}),v=Object(i.a)(E,2),N=v[0],y=v[1],g=function(){switch(t){case x.inventoryProduct:return[b];case x.palletBox:return[N]}}(),O=function(){switch(t){case x.inventoryProduct:return[h];case x.palletBox:return[y]}}();function k(){switch(t){case x.inventoryProduct:case x.palletBox:_.analyze(g,O)}}function j(e){e.preventDefault(),k()}return Object(o.useEffect)((function(){if(u)switch(t){case x.palletBox:var e=g[0];e.autoFocus&&e.ref.current.focus()}}),[u]),Object(o.useEffect)((function(){f(a),a||_.resetValues(g,O)}),[a]),Object(o.useEffect)((function(){if(_.areAllAnalyzed(g)){if(_.areAllValid(g)){switch(t){case x.inventoryProduct:case x.palletBox:c(g[0].value)}switch(t){case x.inventoryProduct:n(!1);break;case x.palletBox:var e=g[0];_.resetValues(g,O),e.autoFocus&&e.ref.current.focus()}}_.resetValidations(g,O)}}),g),r.a.createElement("section",{className:"w3-modal famo-modal"+(u?" w3-show":""),onClick:function(e){return n(!1)}},r.a.createElement("div",{className:"w3-modal-content famo-modal-content",onClick:function(e){return e.stopPropagation()}},function(){switch(t){case x.inventoryProduct:case x.palletBox:return r.a.createElement("section",{className:"famo-wrapper"},r.a.createElement("div",{className:"famo-content"},r.a.createElement("form",{className:"famo-grid famo-form-grid famo-submit-form",noValidate:!0,onSubmit:j},r.a.createElement("div",{className:"famo-row"},r.a.createElement("div",{className:"famo-cell famo-input-label"},r.a.createElement("span",{className:"famo-text-11"},g[0].label)),r.a.createElement("div",{className:"famo-cell"},r.a.createElement(D,Object.assign({},g[0],{set:O[0]})))),r.a.createElement("input",{type:"submit",className:"hide",value:""})),r.a.createElement("div",{className:"famo-grid famo-buttons"},r.a.createElement("div",{className:"famo-row"},r.a.createElement("div",{className:"famo-cell text-right"},r.a.createElement("button",{type:"button",className:"famo-button famo-confirm-button",onClick:function(e){return k()}},r.a.createElement("span",{className:"famo-text-12"},l("key_701"))),r.a.createElement("button",{type:"button",className:"famo-button famo-cancel-button",onClick:function(e){return n(!1)}},r.a.createElement("span",{className:"famo-text-12"},l("key_484"))))))))}}()),r.a.createElement("div",{className:"famo-buttons"},r.a.createElement("button",{type:"button",className:"famo-button famo-icon-button",title:l("key_200"),onClick:function(e){e.stopPropagation(),n(!1)}},r.a.createElement("span",{className:"fas fa-times"}))))}));var F=function(e){var t=e.text,a=Object(o.useState)(!1),n=Object(i.a)(a,2),c=n[0],l=n[1];return r.a.createElement("div",{className:"famo-title"+(c?" collapsed":"")},r.a.createElement("span",{className:"famo-text-13",onClick:function(e){l(!c)}},t))};function A(e,t){function a(e){e.preventDefault(),document.removeEventListener("backbutton",a,!1)}document.addEventListener("backbutton",a,!1),window.cordova.plugins.barcodeScanner.scan((function(t){t.cancelled||(e(t),document.removeEventListener("backbutton",a,!1))}),(function(e){alert(t("key_686"))}),{preferFrontCamera:!1,showFlipCameraButton:!1,showTorchButton:!0,torchOn:!1,saveHistory:!1,prompt:"",resultDisplayDuration:0,formats:"CODE_39,CODE_128",orientation:"unset",disableAnimations:!0,disableSuccessBeep:!1,continuousMode:!1})}function I(e){var t=e.hide;return r.a.createElement("div",{className:"pda-app-loader"+(t?" hide":"")},r.a.createElement("div",{className:"famo-loader"}))}function T(e){var t=e.hide;return r.a.createElement("div",{className:"famo-loader-wrapper"+(t?" hide":"")},r.a.createElement("div",{className:"famo-loader"}))}function V(e){var t="?timestamp="+(new Date).getTime();for(var a in e){var n=e[a];if(Array.isArray(n))for(var c=0,o=n.length;c<o;c++)t+="&"+a+"="+(null===n[c]?"":encodeURIComponent(n[c]));else t+="&"+a+"="+(null===n?"":encodeURIComponent(n))}return t}function R(e,t){var a=document.createElement("script");a.async=!0,a.src=e,a.type="text/javascript",t.current.appendChild(a)}function U(e){fetch(d+"Log/Http/Errors?appName="+f+"&timestamp="+(new Date).getTime(),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({status:e.status,statusText:e.statusText,url:e.url}),credentials:"include"}).then((function(){})).catch((function(){}))}function B(e){fetch(d+"Log/Promise/Errors?appName="+f+"&timestamp="+(new Date).getTime(),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:e.message,stack:e.stack,request:e.request?{method:e.request.method,path:e.request.path}:null,response:e.response?{status:e.response.status}:null}),credentials:"include"}).then((function(){})).catch((function(){}))}var M=a(41),z={setAndroidApp:function(e,t){e.setState(Object(u.a)({},e.state,{androidApp:t}))},setAuthUser:function(e,t){e.setState(Object(u.a)({},e.state,{authUser:t}))},setLoadPage:function(e,t){e.setState(Object(u.a)({},e.state,{loadPage:t}))}},L=Object(M.a)(r.a,{androidApp:!1,authUser:null,loadPage:!1},z);var K=Object(p.h)(Object(N.c)()((function(e){var t=e.t,a=L(),n=Object(i.a)(a,2),c=n[0],l=n[1],s=Object(o.useState)({className:"famo-input famo-text-10",isDisabled:!1,isNumber:!1,label:t("key_806"),name:"inventoryCode",value:"",ref:r.a.createRef()}),m=Object(i.a)(s,2),f=m[0],p=m[1],b=Object(o.useState)([]),h=Object(i.a)(b,2),E=h[0],N=h[1],y=Object(o.useState)(!1),g=Object(i.a)(y,2),k=g[0],j=g[1],w=Object(o.useState)(!1),C=Object(i.a)(w,2),S=C[0],I=C[1],M=Object(o.useState)(null),z=Object(i.a)(M,2),K=z[0],G=z[1],J=Object(o.useState)({className:"famo-input famo-text-10",isDisabled:!0,isNumber:!1,label:t("key_87"),name:"productCode",value:""}),H=Object(i.a)(J,2),q=H[0],Y=H[1],Q=Object(o.useState)({className:"famo-input famo-text-10",isDisabled:!0,isNumber:!1,label:t("key_464"),name:"productVariantCode",value:""}),W=Object(i.a)(Q,2),X=W[0],Z=W[1],$=Object(o.useState)({className:"famo-input famo-text-10",isDisabled:!0,isNumber:!1,label:t("key_138"),name:"productDescription",value:""}),ee=Object(i.a)($,2),te=ee[0],ae=ee[1],ne=Object(o.useState)({className:"famo-input famo-text-10",isDisabled:!0,isNumber:!1,label:t("key_751"),name:"locationCode",value:""}),ce=Object(i.a)(ne,2),oe=ce[0],re=ce[1],le=Object(o.useState)({className:"famo-input famo-text-10",isDisabled:!1,isNumber:!0,label:t("key_347"),name:"quantity",value:"",ref:r.a.createRef(),noData:!1,wrongFormat:!1,invalidValue:!1,invalidMessage:t("key_13"),analyze:!1,analyzeForm:!1}),se=Object(i.a)(le,2),ie=se[0],me=se[1],ue=[q,X,te,oe,ie],fe=[Y,Z,ae,re,me],de=r.a.createRef();function pe(e){var a=e.split("/"),n=a[0],c="";a.length>1&&(c=a[1]),I(!0),be(),fetch(d+"ERP/Inventories/Products"+V({inventoryCode:f.value,productCode:n,productVariantCode:c}),{method:"GET",credentials:"include"}).then((function(e){e.ok&&e.status===O.a.OK?e.json().then((function(e){G(e),Y((function(t){return Object(u.a)({},t,{value:e.ProductCode})})),Z((function(t){return Object(u.a)({},t,{value:e.ProductVariantCode})})),ae((function(t){return Object(u.a)({},t,{value:e.ProductDescription})})),re((function(t){return Object(u.a)({},t,{value:e.LocationCode})}))})).catch((function(e){B(e),alert(t("key_416"))})):(U(e),alert(e.status===O.a.NOT_FOUND?t("key_809"):t("key_303")))})).catch((function(e){B(e),alert(t("key_416"))})).finally((function(){I(!1)}))}function be(){G(null),_.resetValues(ue,fe)}return Object(o.useEffect)((function(){c.authUser&&fetch(d+"ERP/Inventories?timestamp="+(new Date).getTime(),{method:"GET",credentials:"include"}).then((function(e){e.ok&&e.status===O.a.OK?e.json().then((function(e){N(e)})).catch((function(e){B(e),alert(t("key_416"))})):(U(e),alert(t("key_303")))})).catch((function(e){B(e),alert(t("key_416"))})).finally((function(){l.setLoadPage(!1)}))}),[c.authUser]),Object(o.useEffect)((function(){l.setLoadPage(!0),1===Object.keys(window.numeral.locales).length&&(R("http://www.famo-code.com/Scripts/numeral/locales/pt-pt.js?version=27",de),R("http://www.famo-code.com/Scripts/numeral/locales/es-es.js?version=27",de),R("http://www.famo-code.com/Scripts/numeral/locales/fr.js?version=27",de)),v.clear()}),[]),Object(o.useEffect)((function(){be()}),[f]),Object(o.useEffect)((function(){_.areAllAnalyzed(ue)&&(_.areAllValid(ue)?(I(!0),fetch(d+"ERP/Inventories/Products"+V({documentCode:K.Code,productCode:K.ProductCode,productVariantCode:K.ProductVariantCode,locationCode:K.LocationCode,quantity:_.getValue(ie)}),{method:"PATCH",credentials:"include"}).then((function(e){e.ok&&e.status===O.a.OK?(be(),alert(t("key_805"))):(U(e),alert(t("key_302")))})).catch((function(e){B(e),alert(t("key_416"))})).finally((function(){I(!1)}))):_.popUpAlerts(ue,t),_.resetValidations(ue,fe))}),ue),r.a.createElement(r.a.Fragment,null,r.a.createElement("section",{className:"famo-wrapper",ref:de},r.a.createElement("div",{className:"famo-content"},r.a.createElement("form",{className:"famo-grid famo-form-grid",noValidate:!0,onSubmit:function(e){return e.preventDefault()}},r.a.createElement("div",{className:"famo-row"},r.a.createElement("div",{className:"famo-cell famo-input-label"},r.a.createElement("span",{className:"famo-text-11"},f.label)),r.a.createElement("div",{className:"famo-cell"},r.a.createElement(D,Object.assign({},f,{isDisabled:S,set:p}),r.a.createElement("option",{key:""}),E.map((function(e,t){return r.a.createElement("option",{key:t,value:e.Code},e.Name)})))))))),(K||S)&&r.a.createElement("section",{className:"famo-wrapper"},r.a.createElement(F,{text:t("key_339")}),r.a.createElement("div",{className:"famo-content"},r.a.createElement(T,{hide:!S}),r.a.createElement("form",{className:"famo-grid famo-form-grid"+(S?" hide":""),noValidate:!0,onSubmit:function(e){return e.preventDefault()}},r.a.createElement("div",{className:"famo-row"},r.a.createElement("div",{className:"famo-cell famo-input-label"},r.a.createElement("span",{className:"famo-text-11"},q.label)),r.a.createElement("div",{className:"famo-cell"},r.a.createElement(D,q))),r.a.createElement("div",{className:"famo-row"},r.a.createElement("div",{className:"famo-cell famo-input-label"},r.a.createElement("span",{className:"famo-text-11"},X.label)),r.a.createElement("div",{className:"famo-cell"},r.a.createElement(D,X))),r.a.createElement("div",{className:"famo-row"},r.a.createElement("div",{className:"famo-cell famo-input-label"},r.a.createElement("span",{className:"famo-text-11"},te.label)),r.a.createElement("div",{className:"famo-cell"},r.a.createElement(D,te))),r.a.createElement("div",{className:"famo-row"},r.a.createElement("div",{className:"famo-cell famo-input-label"},r.a.createElement("span",{className:"famo-text-11"},oe.label)),r.a.createElement("div",{className:"famo-cell"},r.a.createElement(D,oe))),r.a.createElement("div",{className:"famo-row"},r.a.createElement("div",{className:"famo-cell famo-input-label"},r.a.createElement("span",{className:"famo-text-11"},ie.label)),r.a.createElement("div",{className:"famo-cell"},r.a.createElement(D,Object.assign({},ie,{set:me}))))),r.a.createElement("div",{className:"famo-grid famo-buttons"+(S?" hide":"")},r.a.createElement("div",{className:"famo-row"},r.a.createElement("div",{className:"famo-cell text-right"},r.a.createElement("button",{type:"button",className:"famo-button famo-confirm-button",onClick:function(e){_.analyze(ue,fe)}},r.a.createElement("span",{className:"famo-text-12"},t("key_810")))))))),f.value&&r.a.createElement("section",{className:"famo-wrapper"},r.a.createElement("div",{className:"famo-grid"},r.a.createElement("div",{className:"famo-row"},r.a.createElement("div",{className:"famo-cell text-right"},r.a.createElement("button",{type:"button",className:"famo-button famo-normal-button",disabled:S,onClick:function(e){return j(!0)}},r.a.createElement("span",{className:"famo-text-12"},t("key_807"))),c.androidApp&&r.a.createElement("button",{type:"button",className:"famo-button famo-normal-button",disabled:S,onClick:function(e){A((function(e){pe(e.text)}),t)}},r.a.createElement("span",{className:"famo-text-12"},t("key_681"))))))),r.a.createElement(P,{contentType:x.inventoryProduct,visible:k,setVisible:j,confirm:pe}))}))),G=a(45),J=a(42),H=a.n(J);function q(e){var t=Object(N.b)().t,a=e.history,n=L(),c=Object(i.a)(n,1)[0],l=window.sessionStorage.getItem(E),s=Object(o.useState)({className:"famo-input famo-text-10",isDisabled:!1,isNumber:!1,label:t("key_822"),name:"shipmentCode",value:l?JSON.parse(window.sessionStorage.getItem(E)).shipmentCode:"",ref:r.a.createRef(),autoFocus:!0}),m=Object(i.a)(s,2),f=m[0],p=m[1],b=Object(o.useState)(!1),h=Object(i.a)(b,2),y=h[0],g=h[1],k=Object(o.useState)(null),j=Object(i.a)(k,2),w=j[0],x=j[1],C=[t("key_279")];function _(e){g(!0),x(null),fetch(d+"ERP/Pallets"+V({shipmentCode:e}),{method:"GET",credentials:"include"}).then((function(a){a.ok&&a.status===O.a.OK?a.json().then((function(t){p((function(t){return Object(u.a)({},t,{valueSubmit:e})})),x(t)})).catch((function(e){B(e),alert(t("key_416"))})):(U(a),alert(a.status===O.a.NOT_FOUND?t("key_825"):t("key_303")))})).catch((function(e){B(e),alert(t("key_416"))})).finally((function(){g(!1)}))}function S(e){window.sessionStorage.setItem(E,JSON.stringify({shipmentCode:f.valueSubmit})),a.push("/Pallet/Edit?shipmentCode="+f.valueSubmit+(e?"&palletID="+e:""))}return Object(o.useEffect)((function(){l&&_(f.value),v.clear()}),[]),r.a.createElement(r.a.Fragment,null,r.a.createElement("section",{className:"famo-wrapper"},r.a.createElement("div",{className:"famo-content"},r.a.createElement("form",{className:"famo-grid famo-form-grid",noValidate:!0,onSubmit:function(e){e.preventDefault(),_(f.value)}},r.a.createElement("div",{className:"famo-row"},r.a.createElement("div",{className:"famo-cell famo-input-label"},r.a.createElement("span",{className:"famo-text-11"},f.label)),r.a.createElement("div",{className:"famo-cell"},r.a.createElement(D,Object.assign({},f,{set:p})))),r.a.createElement("input",{type:"submit",className:"hide",value:""})),r.a.createElement("div",{className:"famo-grid famo-buttons"},r.a.createElement("div",{className:"famo-row"},r.a.createElement("div",{className:"famo-cell text-right"},!c.androidApp&&r.a.createElement("button",{type:"button",className:"famo-button famo-normal-button",disabled:y,onClick:function(e){return p((function(e){return Object(u.a)({},e,{value:""})})),void f.ref.current.focus()}},r.a.createElement("span",{className:"famo-text-12"},t("key_829"))),c.androidApp&&r.a.createElement("button",{type:"button",className:"famo-button famo-normal-button",disabled:y,onClick:function(e){A((function(e){p((function(t){return Object(u.a)({},t,{value:e.text})})),_(e.text)}),t)}},r.a.createElement("span",{className:"famo-text-12"},t("key_681"))),r.a.createElement("button",{type:"button",className:"famo-button famo-normal-button",disabled:y,onClick:function(e){return _(f.value)}},r.a.createElement("span",{className:"famo-text-12"},t("key_323")))))))),(w||y)&&r.a.createElement("section",{className:"famo-wrapper"},r.a.createElement(F,{text:"Paletes"}),r.a.createElement("div",{className:"famo-content"},r.a.createElement(T,{hide:!y}),r.a.createElement("div",{className:"famo-grid famo-content-grid pallets"+(y?" hide":"")},r.a.createElement("div",{className:"famo-row famo-header-row"},C.map((function(e,t){return r.a.createElement("div",{key:t,className:"famo-cell famo-col-"+(t+1)},r.a.createElement("span",{className:"famo-text-11"},e))}))),w&&w.map((function(e,t){return r.a.createElement("div",{key:t,className:"famo-row famo-body-row",onClick:function(t){return S(e.ID)}},r.a.createElement("div",{className:"famo-cell famo-col-1"},r.a.createElement("span",{className:"famo-text-10"},e.ID)))}))))),w&&r.a.createElement("section",{className:"famo-wrapper"},r.a.createElement("div",{className:"famo-grid"},r.a.createElement("div",{className:"famo-row"},r.a.createElement("div",{className:"famo-cell text-right"},r.a.createElement("button",{type:"button",className:"famo-button famo-normal-button",disabled:y,onClick:function(e){return S()}},r.a.createElement("span",{className:"famo-text-12"},t("key_817"))))))))}function Y(e){var t=Object(N.b)().t,a=e.location,n=e.history,c=L(),l=Object(i.a)(c,2),s=l[0],m=l[1],f=H.a.parse(a.search),b=Object(o.useState)(f.palletID),h=Object(i.a)(b,2),E=h[0],y=h[1],g=[t("key_87"),t("key_179"),""],k=Object(o.useState)(!0),j=Object(i.a)(k,2),w=j[0],C=j[1],_=Object(o.useState)(!1),S=Object(i.a)(_,2),D=S[0],I=S[1],R=Object(o.useState)([]),M=Object(i.a)(R,2),z=M[0],K=M[1],J=Object(o.useState)(!1),q=Object(i.a)(J,2),Y=q[0],Q=q[1],W=Object(o.useState)(!1),X=Object(i.a)(W,2),Z=X[0],$=X[1],ee=Object(o.useState)(!1),te=Object(i.a)(ee,2),ae=te[0],ne=te[1],ce=Object(o.useState)(!1),oe=Object(i.a)(ce,2),re=oe[0],le=oe[1];function se(e){z.some((function(t){return t.Code===e}))?alert(t("key_814")):(Q(!0),fetch(d+"ERP/Shipments/Boxes"+V({shipmentCode:f.shipmentCode,boxCode:e}),{method:"GET",credentials:"include"}).then((function(e){e.ok&&e.status===O.a.OK?e.json().then((function(e){e.isNew=!0,K([].concat(Object(G.a)(z),[e]))})).catch((function(e){B(e),alert(t("key_416"))})):(U(e),e.status===O.a.NOT_FOUND?alert(t("key_824")):e.status===O.a.FORBIDDEN?alert(t("key_828")):alert(t("key_303")))})).catch((function(e){B(e),alert(t("key_416"))})).finally((function(){Q(!1)})))}function ie(){w&&z.some((function(e){return e.isNew}))?alert(t("key_821")):(ne(!0),fetch(d+"ERP/Pallets/"+(w?"Close":"Reopen")+V({shipmentCode:f.shipmentCode,palletID:E||""}),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(z.map((function(e){return e.Code}))),credentials:"include"}).then((function(e){e.ok&&e.status===O.a.OK?(alert(t(w?"key_812":"key_813")),C(!w)):(U(e),alert(t("key_302")))})).catch((function(e){B(e),alert(t("key_416"))})).finally((function(){ne(!1)})))}return Object(o.useEffect)((function(){f.palletID&&(m.setLoadPage(!0),fetch(d+"ERP/Pallets/Boxes"+V({shipmentCode:f.shipmentCode,palletID:f.palletID}),{method:"GET",credentials:"include"}).then((function(e){e.ok&&e.status===O.a.OK?e.json().then((function(e){I(e.some((function(e){return e.IsShipped}))),C(e.some((function(e){return e.IsPalletOpen}))),e.forEach((function(e){e.isNew=!1})),K(e)})).catch((function(e){B(e),alert(t("key_416"))})):(U(e),e.status===O.a.NOT_FOUND?n.replace("/Pallet"):alert(t("key_303")))})).catch((function(e){B(e),alert(t("key_416"))})).finally((function(){m.setLoadPage(!1)}))),v.clear({pallet:!0})}),[]),f.shipmentCode?r.a.createElement(r.a.Fragment,null,r.a.createElement("section",{className:"famo-wrapper"},r.a.createElement(F,{text:t("key_820")}),r.a.createElement("div",{className:"famo-content"},r.a.createElement(T,{hide:!Z}),r.a.createElement("div",{className:"famo-grid famo-content-grid pallet-boxes"+(Z?" hide":"")},r.a.createElement("div",{className:"famo-row famo-header-row"},g.map((function(e,t){return r.a.createElement("div",{key:t,className:"famo-cell famo-col-"+(t+1)},r.a.createElement("span",{className:"famo-text-11"},e))}))),z.map((function(e,t){return r.a.createElement("div",{key:t,className:"famo-row famo-body-row"},r.a.createElement("div",{className:"famo-cell famo-col-1"},r.a.createElement("span",{className:"famo-text-10"},e.Code)),r.a.createElement("div",{className:"famo-cell famo-col-2"},r.a.createElement("span",{className:"famo-text-10"},e.OrderCode)),r.a.createElement("div",{className:"famo-cell famo-col-3"},r.a.createElement("span",{className:"famo-text-10"},e.isNew&&r.a.createElement("button",{type:"button",className:"famo-button famo-cancel-button button-delete-box",onClick:function(t){return a=e.Code,void K(z.filter((function(e){return e.Code!==a})));var a}},r.a.createElement("span",{className:"fas fa-trash-alt"})))))}))),!D&&w&&r.a.createElement("div",{className:"famo-grid famo-buttons"+(Z?" hide":"")},r.a.createElement("div",{className:"famo-row"},r.a.createElement("div",{className:"famo-cell text-right"},r.a.createElement("button",{type:"button",className:"famo-button famo-normal-button",disabled:Y||ae,onClick:function(e){return le(!0)}},r.a.createElement("span",{className:"famo-text-12"},t("key_815")+" ("+t("key_807").toLowerCase()+")")),s.androidApp&&r.a.createElement("button",{type:"button",className:"famo-button famo-normal-button",disabled:Y||ae,onClick:function(e){A((function(e){se(e.text)}),t)}},r.a.createElement("span",{className:"famo-text-12"},t("key_815")+" ("+t("key_681").toLowerCase()+")"))))))),!D&&z.length>0&&r.a.createElement("section",{className:"famo-wrapper"},r.a.createElement("div",{className:"famo-grid"},r.a.createElement("div",{className:"famo-row"},r.a.createElement("div",{className:"famo-cell text-right"},w?r.a.createElement(r.a.Fragment,null,z.some((function(e){return e.isNew}))&&r.a.createElement("button",{type:"button",className:"famo-button famo-normal-button",disabled:Y||Z||ae,onClick:function(e){return $(!0),void fetch(d+"ERP/Pallets/Boxes"+V({shipmentCode:f.shipmentCode,palletID:E||""}),{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(z.filter((function(e){return e.isNew})).map((function(e){return e.Code}))),credentials:"include"}).then((function(e){e.ok&&e.status===O.a.OK?(e.json().then((function(e){y(e.palletID)})).catch((function(e){B(e),alert(t("key_416"))})),K(z.map((function(e){return Object(u.a)({},e,{isNew:!1})})))):(U(e),alert(t("key_302")))})).catch((function(e){B(e),alert(t("key_416"))})).finally((function(){$(!1)}))}},r.a.createElement("span",{className:"famo-text-12"},t("key_220"))),r.a.createElement("button",{type:"button",className:"famo-button famo-confirm-button famo-loader-button",disabled:Y||Z||ae,onClick:function(e){return ie()}},r.a.createElement("span",{className:"fas fa-spinner fa-spin"+(ae?"":" hide")}),r.a.createElement("span",{className:"famo-text-12"+(ae?" hide":"")},t("key_200")))):r.a.createElement("button",{type:"button",className:"famo-button famo-confirm-button famo-loader-button",disabled:Y||Z||ae,onClick:function(e){return ie()}},r.a.createElement("span",{className:"fas fa-spinner fa-spin"+(ae?"":" hide")}),r.a.createElement("span",{className:"famo-text-12"+(ae?" hide":"")},t("key_827"))))))),r.a.createElement(P,{contentType:x.palletBox,visible:re,setVisible:le,confirm:se})):r.a.createElement(p.a,{to:"/Pallet"})}var Q=Object(p.h)((function(){return r.a.createElement(p.d,null,r.a.createElement(p.b,{exact:!0,path:"/Pallet",render:function(e){return r.a.createElement(q,e)}}),r.a.createElement(p.b,{exact:!0,path:"/Pallet/Edit",render:function(e){return r.a.createElement(Y,e)}}),r.a.createElement(p.b,{path:"/Pallet/*",render:function(){return r.a.createElement(p.a,{to:"/Pallet"})}}))})),W=a(31),X=a(30),Z=a(32);function $(e,t,a){fetch(d+"Platform/Android?timestamp="+(new Date).getTime(),{method:"GET",credentials:"include"}).then((function(n){n.ok&&n.status===O.a.OK?n.json().then((function(a){!function(e){switch(e){case"POR":j.a.locale("pt-pt");break;case"ENG":j.a.locale("en");break;case"ESP":j.a.locale("es-es");break;case"FRA":j.a.locale("fr")}}(e.Language.Code),t.setAndroidApp(a),t.setAuthUser(e)})).catch((function(e){B(e),alert(a("key_416"))})):(U(n),alert(a("key_303")))})).catch((function(e){B(e),alert(a("key_416"))}))}function ee(e,t){te.autoSignIn().then((function(a){a.ok&&a.status===O.a.OK?a.json().then((function(a){$(a,e,t)})).catch((function(e){B(e),alert(t("key_416"))})):(U(a),alert(t("key_306")))})).catch((function(e){B(e),alert(t("key_416"))}))}var te=function e(){Object(b.a)(this,e)};te.signIn=function(e,t){return c.a.async((function(a){for(;;)switch(a.prev=a.next){case 0:return a.abrupt("return",fetch(d+"Authentication/SignIn",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:e,password:t}),credentials:"include"}));case 1:case"end":return a.stop()}}))},te.autoSignIn=function(){return c.a.async((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",fetch(d+"Authentication/AutoSignIn?timestamp="+(new Date).getTime(),{method:"GET",credentials:"include"}));case 1:case"end":return e.stop()}}))},te.signOut=function(){return c.a.async((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",fetch(d+"Authentication/SignOut",{method:"GET",credentials:"include"}));case 1:case"end":return e.stop()}}))};var ae=a(26),ne=a.n(ae),ce=a(44),oe=a(43);ce.a.use(oe.a).use(N.a).init({lng:"pt",fallbackLng:"pt",whitelist:["pt","en","es","fr"],debug:!1,react:{},backend:{loadPath:d+"JSON/i18n/{{lng}}.json?timestamp="+(new Date).getTime(),crossDomain:!0}});var re=function(e){function t(e){var a;return Object(b.a)(this,t),(a=Object(W.a)(this,Object(X.a)(t).call(this,e))).usernameRef=void 0,a.hideInputMsg=function(e){return"signin-error-input"+(e?" hide":"")},a.handleChangeInput=function(e){a.setState(Object(m.a)({},e.target.name,e.target.value))},a.handleUserInput=function(e){e.target.value||a.setState({hideUserMsg:"blur"!==e.type})},a.handlePwdInput=function(e){e.target.value||a.setState({hidePwdMsg:"blur"!==e.type})},a.handleSubmit=function(e){var t,n,o,r,l,s;return c.a.async((function(m){for(;;)switch(m.prev=m.next){case 0:if(e.preventDefault(),t=L(),n=Object(i.a)(t,2),o=n[1],a.state.username&&a.state.password){m.next=6;break}a.setState({hideUserMsg:!!a.state.username,hidePwdMsg:!!a.state.password}),m.next=24;break;case 6:return m.next=8,c.a.awrap(te.signIn(a.state.username,a.state.password));case 8:if(r=m.sent,l=a.props.t,a.setState({authError:!1,authHttpCode:-1}),!r.ok){m.next=20;break}return a.setState({authSuccess:!0}),m.t0=o,m.next=16,c.a.awrap(r.json());case 16:m.t1=m.sent,m.t0.setAuthUser.call(m.t0,m.t1),m.next=24;break;case 20:400!==(s=r.status)&&500!==s&&console.log(l("key_416")+" - "+s),a.usernameRef.current.focus(),a.setState({password:"",hidePwdMsg:!0,authError:!0,authHttpCode:s});case 24:case"end":return m.stop()}}))},a.state={username:"",password:"",hideUserMsg:!0,hidePwdMsg:!0,authSuccess:!1,authError:!1,authHttpCode:-1},a.usernameRef=r.a.createRef(),a}return Object(Z.a)(t,e),Object(h.a)(t,[{key:"componentDidMount",value:function(){this.usernameRef.current.focus()}},{key:"render",value:function(){var e=ne()("famo-input signin-form-input famo-text-3",{"famo-input-error":!this.state.hideUserMsg}),t=ne()("famo-input signin-form-input famo-text-3",{"famo-input-error":!this.state.hidePwdMsg}),a=ne()("signin-error-submit",{hide:!this.state.authError}),n=this.props,c=n.t,o=n.location;return this.state.authSuccess?r.a.createElement(p.a,{to:o.state||{from:{pathname:"/"}}}):r.a.createElement("section",{className:"famo-grid signin"},r.a.createElement("div",{className:"famo-row"},r.a.createElement("div",{className:"famo-cell"},r.a.createElement("div",{className:"signin-body"},r.a.createElement("div",{className:"signin-famo-logo"},r.a.createElement("img",{src:"http://www.famo-code.com/Content/Images/logo-famo-black-normal.png",alt:"FAMO"})),r.a.createElement("div",{className:"signin-form"},r.a.createElement("div",{className:"signin-app-name"},r.a.createElement("span",{className:"famo-text-2"},"PDA")),r.a.createElement("form",{id:"signin-form",method:"POST",onSubmit:this.handleSubmit},r.a.createElement("div",{className:"signin-input-wrapper"},r.a.createElement("input",{type:"text",id:"signin-username-input",className:e,placeholder:c("key_397"),ref:this.usernameRef,name:"username",value:this.state.username,autoComplete:"off",onChange:this.handleChangeInput,onFocus:this.handleUserInput,onBlur:this.handleUserInput}),r.a.createElement(le,{msgClass:this.hideInputMsg(this.state.hideUserMsg),msgText:c("key_196")})),r.a.createElement("div",{className:"signin-input-wrapper"},r.a.createElement("input",{type:"password",id:"signin-password-input",className:t,placeholder:c("key_314"),name:"password",value:this.state.password,onChange:this.handleChangeInput,onFocus:this.handlePwdInput,onBlur:this.handlePwdInput}),r.a.createElement(le,{msgClass:this.hideInputMsg(this.state.hidePwdMsg),msgText:c("key_195")})),r.a.createElement("div",{className:a},this.state.authError&&400===this.state.authHttpCode&&r.a.createElement("span",{className:"famo-text-7"},c("key_398")),this.state.authError&&500===this.state.authHttpCode&&r.a.createElement("span",{className:"famo-text-7"},c("key_306"))),r.a.createElement("button",{className:"famo-button famo-confirm-button signin-button-submit",type:"submit"},r.a.createElement("span",{className:"famo-text-5"},c("key_238"))),r.a.createElement("button",{type:"button",className:"famo-button famo-transparent-button signup-button"},r.a.createElement("span",{className:"famo-text-27"},c("key_648")))))))),r.a.createElement("div",{className:"famo-row"},r.a.createElement("div",{className:"famo-cell famo-cell-bottom"},r.a.createElement("div",{className:"signin-footer text-center"},r.a.createElement("span",{className:"famo-text-1"},(new Date).getFullYear()," \xa9 FAMO - ","PDA")))))}}]),t}(r.a.Component),le=function(e){function t(){return Object(b.a)(this,t),Object(W.a)(this,Object(X.a)(t).apply(this,arguments))}return Object(Z.a)(t,e),Object(h.a)(t,[{key:"render",value:function(){var e=this.props,t=e.msgClass,a=e.msgText;return r.a.createElement("div",{className:t},r.a.createElement("span",{className:"famo-text-7"},a))}}]),t}(r.a.Component),se=(Object(N.c)()(re),a(21));a(77);function ie(e){var t=e.t,a=Object(p.g)(),n=L(),c=Object(i.a)(n,2),l=c[0],s=c[1],m=Object(o.useState)(!1),u=Object(i.a)(m,2),f=u[0],b=u[1];return Object(o.useEffect)((function(){fetch(d+"Authentication/Session/User",{method:"GET",credentials:"include"}).then((function(e){e.ok&&e.status===O.a.OK?e.json().then((function(e){$(e,s,t)})).catch((function(e){ee(s,t),B(e)})):(ee(s,t),U(e))})).catch((function(e){ee(s,t),B(e)}))}),[]),Object(o.useEffect)((function(){b("/"!==a.location.pathname)}),[a.location.pathname]),r.a.createElement("section",{className:"famo-body"},r.a.createElement(p.d,null,r.a.createElement(p.b,{exact:!0,path:"/",render:function(){return r.a.createElement(y,null)}}),r.a.createElement(p.b,{path:"/Inventory",render:function(){return r.a.createElement(K,null)}}),r.a.createElement(p.b,{path:"/Pallet",render:function(){return r.a.createElement(Q,null)}})),r.a.createElement(I,{hide:l.authUser&&!l.loadPage}),!l.androidApp&&f&&r.a.createElement("button",{type:"button",className:"famo-button famo-normal-button pda-back-button"+(l.authUser&&!l.loadPage?"":" hide"),onClick:function(e){return a.goBack()}},r.a.createElement("span",{className:"fas fa-arrow-left"})))}var me=Object(N.c)()((function(e){return r.a.createElement(se.a,{basename:"/"},r.a.createElement(ie,e))}));function ue(){return c.a.async((function(e){for(;;)switch(e.prev=e.next){case 0:try{document.getElementById("pda-footer").innerText=(new Date).getFullYear()+" \xa9 FAMO - PDA",s.a.render(r.a.createElement(o.Suspense,{fallback:r.a.createElement(I,{hide:!0})},r.a.createElement(me,null)),document.getElementById("root"))}catch(t){alert("Oops!! Liga o servidor Node.js!")}case 1:case"end":return e.stop()}}))}window.cordova?document.addEventListener("deviceready",ue,!1):ue()}},[[47,1,2]]]);