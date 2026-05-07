(function(){const u=document.createElement("link").relList;if(u&&u.supports&&u.supports("modulepreload"))return;for(const m of document.querySelectorAll('link[rel="modulepreload"]'))v(m);new MutationObserver(m=>{for(const h of m)if(h.type==="childList")for(const L of h.addedNodes)L.tagName==="LINK"&&L.rel==="modulepreload"&&v(L)}).observe(document,{childList:!0,subtree:!0});function s(m){const h={};return m.integrity&&(h.integrity=m.integrity),m.referrerPolicy&&(h.referrerPolicy=m.referrerPolicy),m.crossOrigin==="use-credentials"?h.credentials="include":m.crossOrigin==="anonymous"?h.credentials="omit":h.credentials="same-origin",h}function v(m){if(m.ep)return;m.ep=!0;const h=s(m);fetch(m.href,h)}})();try{}catch(o){console.error("[wxt] Failed to initialize plugins",o)}var gs={exports:{}},kl={},ms={exports:{}},ne={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Qu;function tp(){if(Qu)return ne;Qu=1;var o=Symbol.for("react.element"),u=Symbol.for("react.portal"),s=Symbol.for("react.fragment"),v=Symbol.for("react.strict_mode"),m=Symbol.for("react.profiler"),h=Symbol.for("react.provider"),L=Symbol.for("react.context"),E=Symbol.for("react.forward_ref"),b=Symbol.for("react.suspense"),M=Symbol.for("react.memo"),P=Symbol.for("react.lazy"),S=Symbol.iterator;function V(x){return x===null||typeof x!="object"?null:(x=S&&x[S]||x["@@iterator"],typeof x=="function"?x:null)}var ge={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},re=Object.assign,te={};function le(x,C,Z){this.props=x,this.context=C,this.refs=te,this.updater=Z||ge}le.prototype.isReactComponent={},le.prototype.setState=function(x,C){if(typeof x!="object"&&typeof x!="function"&&x!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,x,C,"setState")},le.prototype.forceUpdate=function(x){this.updater.enqueueForceUpdate(this,x,"forceUpdate")};function T(){}T.prototype=le.prototype;function Le(x,C,Z){this.props=x,this.context=C,this.refs=te,this.updater=Z||ge}var ze=Le.prototype=new T;ze.constructor=Le,re(ze,le.prototype),ze.isPureReactComponent=!0;var be=Array.isArray,G=Object.prototype.hasOwnProperty,pe={current:null},Pe={key:!0,ref:!0,__self:!0,__source:!0};function Oe(x,C,Z){var ee,oe={},se=null,xe=null;if(C!=null)for(ee in C.ref!==void 0&&(xe=C.ref),C.key!==void 0&&(se=""+C.key),C)G.call(C,ee)&&!Pe.hasOwnProperty(ee)&&(oe[ee]=C[ee]);var fe=arguments.length-2;if(fe===1)oe.children=Z;else if(1<fe){for(var me=Array(fe),$e=0;$e<fe;$e++)me[$e]=arguments[$e+2];oe.children=me}if(x&&x.defaultProps)for(ee in fe=x.defaultProps,fe)oe[ee]===void 0&&(oe[ee]=fe[ee]);return{$$typeof:o,type:x,key:se,ref:xe,props:oe,_owner:pe.current}}function bt(x,C){return{$$typeof:o,type:x.type,key:C,ref:x.ref,props:x.props,_owner:x._owner}}function ft(x){return typeof x=="object"&&x!==null&&x.$$typeof===o}function Dt(x){var C={"=":"=0",":":"=2"};return"$"+x.replace(/[=:]/g,function(Z){return C[Z]})}var st=/\/+/g;function Ge(x,C){return typeof x=="object"&&x!==null&&x.key!=null?Dt(""+x.key):C.toString(36)}function it(x,C,Z,ee,oe){var se=typeof x;(se==="undefined"||se==="boolean")&&(x=null);var xe=!1;if(x===null)xe=!0;else switch(se){case"string":case"number":xe=!0;break;case"object":switch(x.$$typeof){case o:case u:xe=!0}}if(xe)return xe=x,oe=oe(xe),x=ee===""?"."+Ge(xe,0):ee,be(oe)?(Z="",x!=null&&(Z=x.replace(st,"$&/")+"/"),it(oe,C,Z,"",function($e){return $e})):oe!=null&&(ft(oe)&&(oe=bt(oe,Z+(!oe.key||xe&&xe.key===oe.key?"":(""+oe.key).replace(st,"$&/")+"/")+x)),C.push(oe)),1;if(xe=0,ee=ee===""?".":ee+":",be(x))for(var fe=0;fe<x.length;fe++){se=x[fe];var me=ee+Ge(se,fe);xe+=it(se,C,Z,me,oe)}else if(me=V(x),typeof me=="function")for(x=me.call(x),fe=0;!(se=x.next()).done;)se=se.value,me=ee+Ge(se,fe++),xe+=it(se,C,Z,me,oe);else if(se==="object")throw C=String(x),Error("Objects are not valid as a React child (found: "+(C==="[object Object]"?"object with keys {"+Object.keys(x).join(", ")+"}":C)+"). If you meant to render a collection of children, use an array instead.");return xe}function gt(x,C,Z){if(x==null)return x;var ee=[],oe=0;return it(x,ee,"","",function(se){return C.call(Z,se,oe++)}),ee}function Ue(x){if(x._status===-1){var C=x._result;C=C(),C.then(function(Z){(x._status===0||x._status===-1)&&(x._status=1,x._result=Z)},function(Z){(x._status===0||x._status===-1)&&(x._status=2,x._result=Z)}),x._status===-1&&(x._status=0,x._result=C)}if(x._status===1)return x._result.default;throw x._result}var ye={current:null},$={transition:null},Y={ReactCurrentDispatcher:ye,ReactCurrentBatchConfig:$,ReactCurrentOwner:pe};function B(){throw Error("act(...) is not supported in production builds of React.")}return ne.Children={map:gt,forEach:function(x,C,Z){gt(x,function(){C.apply(this,arguments)},Z)},count:function(x){var C=0;return gt(x,function(){C++}),C},toArray:function(x){return gt(x,function(C){return C})||[]},only:function(x){if(!ft(x))throw Error("React.Children.only expected to receive a single React element child.");return x}},ne.Component=le,ne.Fragment=s,ne.Profiler=m,ne.PureComponent=Le,ne.StrictMode=v,ne.Suspense=b,ne.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Y,ne.act=B,ne.cloneElement=function(x,C,Z){if(x==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+x+".");var ee=re({},x.props),oe=x.key,se=x.ref,xe=x._owner;if(C!=null){if(C.ref!==void 0&&(se=C.ref,xe=pe.current),C.key!==void 0&&(oe=""+C.key),x.type&&x.type.defaultProps)var fe=x.type.defaultProps;for(me in C)G.call(C,me)&&!Pe.hasOwnProperty(me)&&(ee[me]=C[me]===void 0&&fe!==void 0?fe[me]:C[me])}var me=arguments.length-2;if(me===1)ee.children=Z;else if(1<me){fe=Array(me);for(var $e=0;$e<me;$e++)fe[$e]=arguments[$e+2];ee.children=fe}return{$$typeof:o,type:x.type,key:oe,ref:se,props:ee,_owner:xe}},ne.createContext=function(x){return x={$$typeof:L,_currentValue:x,_currentValue2:x,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},x.Provider={$$typeof:h,_context:x},x.Consumer=x},ne.createElement=Oe,ne.createFactory=function(x){var C=Oe.bind(null,x);return C.type=x,C},ne.createRef=function(){return{current:null}},ne.forwardRef=function(x){return{$$typeof:E,render:x}},ne.isValidElement=ft,ne.lazy=function(x){return{$$typeof:P,_payload:{_status:-1,_result:x},_init:Ue}},ne.memo=function(x,C){return{$$typeof:M,type:x,compare:C===void 0?null:C}},ne.startTransition=function(x){var C=$.transition;$.transition={};try{x()}finally{$.transition=C}},ne.unstable_act=B,ne.useCallback=function(x,C){return ye.current.useCallback(x,C)},ne.useContext=function(x){return ye.current.useContext(x)},ne.useDebugValue=function(){},ne.useDeferredValue=function(x){return ye.current.useDeferredValue(x)},ne.useEffect=function(x,C){return ye.current.useEffect(x,C)},ne.useId=function(){return ye.current.useId()},ne.useImperativeHandle=function(x,C,Z){return ye.current.useImperativeHandle(x,C,Z)},ne.useInsertionEffect=function(x,C){return ye.current.useInsertionEffect(x,C)},ne.useLayoutEffect=function(x,C){return ye.current.useLayoutEffect(x,C)},ne.useMemo=function(x,C){return ye.current.useMemo(x,C)},ne.useReducer=function(x,C,Z){return ye.current.useReducer(x,C,Z)},ne.useRef=function(x){return ye.current.useRef(x)},ne.useState=function(x){return ye.current.useState(x)},ne.useSyncExternalStore=function(x,C,Z){return ye.current.useSyncExternalStore(x,C,Z)},ne.useTransition=function(){return ye.current.useTransition()},ne.version="18.3.1",ne}var Ju;function bs(){return Ju||(Ju=1,ms.exports=tp()),ms.exports}/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Yu;function np(){if(Yu)return kl;Yu=1;var o=bs(),u=Symbol.for("react.element"),s=Symbol.for("react.fragment"),v=Object.prototype.hasOwnProperty,m=o.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,h={key:!0,ref:!0,__self:!0,__source:!0};function L(E,b,M){var P,S={},V=null,ge=null;M!==void 0&&(V=""+M),b.key!==void 0&&(V=""+b.key),b.ref!==void 0&&(ge=b.ref);for(P in b)v.call(b,P)&&!h.hasOwnProperty(P)&&(S[P]=b[P]);if(E&&E.defaultProps)for(P in b=E.defaultProps,b)S[P]===void 0&&(S[P]=b[P]);return{$$typeof:u,type:E,key:V,ref:ge,props:S,_owner:m.current}}return kl.Fragment=s,kl.jsx=L,kl.jsxs=L,kl}var Gu;function rp(){return Gu||(Gu=1,gs.exports=np()),gs.exports}var d=rp(),N=bs(),za={},hs={exports:{}},ot={},xs={exports:{}},vs={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var qu;function lp(){return qu||(qu=1,(function(o){function u($,Y){var B=$.length;$.push(Y);e:for(;0<B;){var x=B-1>>>1,C=$[x];if(0<m(C,Y))$[x]=Y,$[B]=C,B=x;else break e}}function s($){return $.length===0?null:$[0]}function v($){if($.length===0)return null;var Y=$[0],B=$.pop();if(B!==Y){$[0]=B;e:for(var x=0,C=$.length,Z=C>>>1;x<Z;){var ee=2*(x+1)-1,oe=$[ee],se=ee+1,xe=$[se];if(0>m(oe,B))se<C&&0>m(xe,oe)?($[x]=xe,$[se]=B,x=se):($[x]=oe,$[ee]=B,x=ee);else if(se<C&&0>m(xe,B))$[x]=xe,$[se]=B,x=se;else break e}}return Y}function m($,Y){var B=$.sortIndex-Y.sortIndex;return B!==0?B:$.id-Y.id}if(typeof performance=="object"&&typeof performance.now=="function"){var h=performance;o.unstable_now=function(){return h.now()}}else{var L=Date,E=L.now();o.unstable_now=function(){return L.now()-E}}var b=[],M=[],P=1,S=null,V=3,ge=!1,re=!1,te=!1,le=typeof setTimeout=="function"?setTimeout:null,T=typeof clearTimeout=="function"?clearTimeout:null,Le=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function ze($){for(var Y=s(M);Y!==null;){if(Y.callback===null)v(M);else if(Y.startTime<=$)v(M),Y.sortIndex=Y.expirationTime,u(b,Y);else break;Y=s(M)}}function be($){if(te=!1,ze($),!re)if(s(b)!==null)re=!0,Ue(G);else{var Y=s(M);Y!==null&&ye(be,Y.startTime-$)}}function G($,Y){re=!1,te&&(te=!1,T(Oe),Oe=-1),ge=!0;var B=V;try{for(ze(Y),S=s(b);S!==null&&(!(S.expirationTime>Y)||$&&!Dt());){var x=S.callback;if(typeof x=="function"){S.callback=null,V=S.priorityLevel;var C=x(S.expirationTime<=Y);Y=o.unstable_now(),typeof C=="function"?S.callback=C:S===s(b)&&v(b),ze(Y)}else v(b);S=s(b)}if(S!==null)var Z=!0;else{var ee=s(M);ee!==null&&ye(be,ee.startTime-Y),Z=!1}return Z}finally{S=null,V=B,ge=!1}}var pe=!1,Pe=null,Oe=-1,bt=5,ft=-1;function Dt(){return!(o.unstable_now()-ft<bt)}function st(){if(Pe!==null){var $=o.unstable_now();ft=$;var Y=!0;try{Y=Pe(!0,$)}finally{Y?Ge():(pe=!1,Pe=null)}}else pe=!1}var Ge;if(typeof Le=="function")Ge=function(){Le(st)};else if(typeof MessageChannel<"u"){var it=new MessageChannel,gt=it.port2;it.port1.onmessage=st,Ge=function(){gt.postMessage(null)}}else Ge=function(){le(st,0)};function Ue($){Pe=$,pe||(pe=!0,Ge())}function ye($,Y){Oe=le(function(){$(o.unstable_now())},Y)}o.unstable_IdlePriority=5,o.unstable_ImmediatePriority=1,o.unstable_LowPriority=4,o.unstable_NormalPriority=3,o.unstable_Profiling=null,o.unstable_UserBlockingPriority=2,o.unstable_cancelCallback=function($){$.callback=null},o.unstable_continueExecution=function(){re||ge||(re=!0,Ue(G))},o.unstable_forceFrameRate=function($){0>$||125<$?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):bt=0<$?Math.floor(1e3/$):5},o.unstable_getCurrentPriorityLevel=function(){return V},o.unstable_getFirstCallbackNode=function(){return s(b)},o.unstable_next=function($){switch(V){case 1:case 2:case 3:var Y=3;break;default:Y=V}var B=V;V=Y;try{return $()}finally{V=B}},o.unstable_pauseExecution=function(){},o.unstable_requestPaint=function(){},o.unstable_runWithPriority=function($,Y){switch($){case 1:case 2:case 3:case 4:case 5:break;default:$=3}var B=V;V=$;try{return Y()}finally{V=B}},o.unstable_scheduleCallback=function($,Y,B){var x=o.unstable_now();switch(typeof B=="object"&&B!==null?(B=B.delay,B=typeof B=="number"&&0<B?x+B:x):B=x,$){case 1:var C=-1;break;case 2:C=250;break;case 5:C=1073741823;break;case 4:C=1e4;break;default:C=5e3}return C=B+C,$={id:P++,callback:Y,priorityLevel:$,startTime:B,expirationTime:C,sortIndex:-1},B>x?($.sortIndex=B,u(M,$),s(b)===null&&$===s(M)&&(te?(T(Oe),Oe=-1):te=!0,ye(be,B-x))):($.sortIndex=C,u(b,$),re||ge||(re=!0,Ue(G))),$},o.unstable_shouldYield=Dt,o.unstable_wrapCallback=function($){var Y=V;return function(){var B=V;V=Y;try{return $.apply(this,arguments)}finally{V=B}}}})(vs)),vs}var Xu;function ap(){return Xu||(Xu=1,xs.exports=lp()),xs.exports}/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Zu;function op(){if(Zu)return ot;Zu=1;var o=bs(),u=ap();function s(e){for(var t="https://reactjs.org/docs/error-decoder.html?invariant="+e,n=1;n<arguments.length;n++)t+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var v=new Set,m={};function h(e,t){L(e,t),L(e+"Capture",t)}function L(e,t){for(m[e]=t,e=0;e<t.length;e++)v.add(t[e])}var E=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),b=Object.prototype.hasOwnProperty,M=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,P={},S={};function V(e){return b.call(S,e)?!0:b.call(P,e)?!1:M.test(e)?S[e]=!0:(P[e]=!0,!1)}function ge(e,t,n,r){if(n!==null&&n.type===0)return!1;switch(typeof t){case"function":case"symbol":return!0;case"boolean":return r?!1:n!==null?!n.acceptsBooleans:(e=e.toLowerCase().slice(0,5),e!=="data-"&&e!=="aria-");default:return!1}}function re(e,t,n,r){if(t===null||typeof t>"u"||ge(e,t,n,r))return!0;if(r)return!1;if(n!==null)switch(n.type){case 3:return!t;case 4:return t===!1;case 5:return isNaN(t);case 6:return isNaN(t)||1>t}return!1}function te(e,t,n,r,l,a,i){this.acceptsBooleans=t===2||t===3||t===4,this.attributeName=r,this.attributeNamespace=l,this.mustUseProperty=n,this.propertyName=e,this.type=t,this.sanitizeURL=a,this.removeEmptyString=i}var le={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e){le[e]=new te(e,0,!1,e,null,!1,!1)}),[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(e){var t=e[0];le[t]=new te(t,1,!1,e[1],null,!1,!1)}),["contentEditable","draggable","spellCheck","value"].forEach(function(e){le[e]=new te(e,2,!1,e.toLowerCase(),null,!1,!1)}),["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(e){le[e]=new te(e,2,!1,e,null,!1,!1)}),"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e){le[e]=new te(e,3,!1,e.toLowerCase(),null,!1,!1)}),["checked","multiple","muted","selected"].forEach(function(e){le[e]=new te(e,3,!0,e,null,!1,!1)}),["capture","download"].forEach(function(e){le[e]=new te(e,4,!1,e,null,!1,!1)}),["cols","rows","size","span"].forEach(function(e){le[e]=new te(e,6,!1,e,null,!1,!1)}),["rowSpan","start"].forEach(function(e){le[e]=new te(e,5,!1,e.toLowerCase(),null,!1,!1)});var T=/[\-:]([a-z])/g;function Le(e){return e[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e){var t=e.replace(T,Le);le[t]=new te(t,1,!1,e,null,!1,!1)}),"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e){var t=e.replace(T,Le);le[t]=new te(t,1,!1,e,"http://www.w3.org/1999/xlink",!1,!1)}),["xml:base","xml:lang","xml:space"].forEach(function(e){var t=e.replace(T,Le);le[t]=new te(t,1,!1,e,"http://www.w3.org/XML/1998/namespace",!1,!1)}),["tabIndex","crossOrigin"].forEach(function(e){le[e]=new te(e,1,!1,e.toLowerCase(),null,!1,!1)}),le.xlinkHref=new te("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1),["src","href","action","formAction"].forEach(function(e){le[e]=new te(e,1,!1,e.toLowerCase(),null,!0,!0)});function ze(e,t,n,r){var l=le.hasOwnProperty(t)?le[t]:null;(l!==null?l.type!==0:r||!(2<t.length)||t[0]!=="o"&&t[0]!=="O"||t[1]!=="n"&&t[1]!=="N")&&(re(t,n,l,r)&&(n=null),r||l===null?V(t)&&(n===null?e.removeAttribute(t):e.setAttribute(t,""+n)):l.mustUseProperty?e[l.propertyName]=n===null?l.type===3?!1:"":n:(t=l.attributeName,r=l.attributeNamespace,n===null?e.removeAttribute(t):(l=l.type,n=l===3||l===4&&n===!0?"":""+n,r?e.setAttributeNS(r,t,n):e.setAttribute(t,n))))}var be=o.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,G=Symbol.for("react.element"),pe=Symbol.for("react.portal"),Pe=Symbol.for("react.fragment"),Oe=Symbol.for("react.strict_mode"),bt=Symbol.for("react.profiler"),ft=Symbol.for("react.provider"),Dt=Symbol.for("react.context"),st=Symbol.for("react.forward_ref"),Ge=Symbol.for("react.suspense"),it=Symbol.for("react.suspense_list"),gt=Symbol.for("react.memo"),Ue=Symbol.for("react.lazy"),ye=Symbol.for("react.offscreen"),$=Symbol.iterator;function Y(e){return e===null||typeof e!="object"?null:(e=$&&e[$]||e["@@iterator"],typeof e=="function"?e:null)}var B=Object.assign,x;function C(e){if(x===void 0)try{throw Error()}catch(n){var t=n.stack.trim().match(/\n( *(at )?)/);x=t&&t[1]||""}return`
`+x+e}var Z=!1;function ee(e,t){if(!e||Z)return"";Z=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(t)if(t=function(){throw Error()},Object.defineProperty(t.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(t,[])}catch(w){var r=w}Reflect.construct(e,[],t)}else{try{t.call()}catch(w){r=w}e.call(t.prototype)}else{try{throw Error()}catch(w){r=w}e()}}catch(w){if(w&&r&&typeof w.stack=="string"){for(var l=w.stack.split(`
`),a=r.stack.split(`
`),i=l.length-1,c=a.length-1;1<=i&&0<=c&&l[i]!==a[c];)c--;for(;1<=i&&0<=c;i--,c--)if(l[i]!==a[c]){if(i!==1||c!==1)do if(i--,c--,0>c||l[i]!==a[c]){var p=`
`+l[i].replace(" at new "," at ");return e.displayName&&p.includes("<anonymous>")&&(p=p.replace("<anonymous>",e.displayName)),p}while(1<=i&&0<=c);break}}}finally{Z=!1,Error.prepareStackTrace=n}return(e=e?e.displayName||e.name:"")?C(e):""}function oe(e){switch(e.tag){case 5:return C(e.type);case 16:return C("Lazy");case 13:return C("Suspense");case 19:return C("SuspenseList");case 0:case 2:case 15:return e=ee(e.type,!1),e;case 11:return e=ee(e.type.render,!1),e;case 1:return e=ee(e.type,!0),e;default:return""}}function se(e){if(e==null)return null;if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case Pe:return"Fragment";case pe:return"Portal";case bt:return"Profiler";case Oe:return"StrictMode";case Ge:return"Suspense";case it:return"SuspenseList"}if(typeof e=="object")switch(e.$$typeof){case Dt:return(e.displayName||"Context")+".Consumer";case ft:return(e._context.displayName||"Context")+".Provider";case st:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case gt:return t=e.displayName||null,t!==null?t:se(e.type)||"Memo";case Ue:t=e._payload,e=e._init;try{return se(e(t))}catch{}}return null}function xe(e){var t=e.type;switch(e.tag){case 24:return"Cache";case 9:return(t.displayName||"Context")+".Consumer";case 10:return(t._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return e=t.render,e=e.displayName||e.name||"",t.displayName||(e!==""?"ForwardRef("+e+")":"ForwardRef");case 7:return"Fragment";case 5:return t;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return se(t);case 8:return t===Oe?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t}return null}function fe(e){switch(typeof e){case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function me(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function $e(e){var t=me(e)?"checked":"value",n=Object.getOwnPropertyDescriptor(e.constructor.prototype,t),r=""+e[t];if(!e.hasOwnProperty(t)&&typeof n<"u"&&typeof n.get=="function"&&typeof n.set=="function"){var l=n.get,a=n.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return l.call(this)},set:function(i){r=""+i,a.call(this,i)}}),Object.defineProperty(e,t,{enumerable:n.enumerable}),{getValue:function(){return r},setValue:function(i){r=""+i},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function Ln(e){e._valueTracker||(e._valueTracker=$e(e))}function Ot(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),r="";return e&&(r=me(e)?e.checked?"true":"false":e.value),e=r,e!==n?(t.setValue(e),!0):!1}function He(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}function Ir(e,t){var n=t.checked;return B({},t,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:n??e._wrapperState.initialChecked})}function $t(e,t){var n=t.defaultValue==null?"":t.defaultValue,r=t.checked!=null?t.checked:t.defaultChecked;n=fe(t.value!=null?t.value:n),e._wrapperState={initialChecked:r,initialValue:n,controlled:t.type==="checkbox"||t.type==="radio"?t.checked!=null:t.value!=null}}function rr(e,t){t=t.checked,t!=null&&ze(e,"checked",t,!1)}function St(e,t){rr(e,t);var n=fe(t.value),r=t.type;if(n!=null)r==="number"?(n===0&&e.value===""||e.value!=n)&&(e.value=""+n):e.value!==""+n&&(e.value=""+n);else if(r==="submit"||r==="reset"){e.removeAttribute("value");return}t.hasOwnProperty("value")?un(e,t.type,n):t.hasOwnProperty("defaultValue")&&un(e,t.type,fe(t.defaultValue)),t.checked==null&&t.defaultChecked!=null&&(e.defaultChecked=!!t.defaultChecked)}function Wt(e,t,n){if(t.hasOwnProperty("value")||t.hasOwnProperty("defaultValue")){var r=t.type;if(!(r!=="submit"&&r!=="reset"||t.value!==void 0&&t.value!==null))return;t=""+e._wrapperState.initialValue,n||t===e.value||(e.value=t),e.defaultValue=t}n=e.name,n!==""&&(e.name=""),e.defaultChecked=!!e._wrapperState.initialChecked,n!==""&&(e.name=n)}function un(e,t,n){(t!=="number"||He(e.ownerDocument)!==e)&&(n==null?e.defaultValue=""+e._wrapperState.initialValue:e.defaultValue!==""+n&&(e.defaultValue=""+n))}var cn=Array.isArray;function Ht(e,t,n,r){if(e=e.options,t){t={};for(var l=0;l<n.length;l++)t["$"+n[l]]=!0;for(n=0;n<e.length;n++)l=t.hasOwnProperty("$"+e[n].value),e[n].selected!==l&&(e[n].selected=l),l&&r&&(e[n].defaultSelected=!0)}else{for(n=""+fe(n),t=null,l=0;l<e.length;l++){if(e[l].value===n){e[l].selected=!0,r&&(e[l].defaultSelected=!0);return}t!==null||e[l].disabled||(t=e[l])}t!==null&&(t.selected=!0)}}function Ze(e,t){if(t.dangerouslySetInnerHTML!=null)throw Error(s(91));return B({},t,{value:void 0,defaultValue:void 0,children:""+e._wrapperState.initialValue})}function Rn(e,t){var n=t.value;if(n==null){if(n=t.children,t=t.defaultValue,n!=null){if(t!=null)throw Error(s(92));if(cn(n)){if(1<n.length)throw Error(s(93));n=n[0]}t=n}t==null&&(t=""),n=t}e._wrapperState={initialValue:fe(n)}}function Kt(e,t){var n=fe(t.value),r=fe(t.defaultValue);n!=null&&(n=""+n,n!==e.value&&(e.value=n),t.defaultValue==null&&e.defaultValue!==n&&(e.defaultValue=n)),r!=null&&(e.defaultValue=""+r)}function lr(e){var t=e.textContent;t===e._wrapperState.initialValue&&t!==""&&t!==null&&(e.value=t)}function Ie(e){switch(e){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function Dn(e,t){return e==null||e==="http://www.w3.org/1999/xhtml"?Ie(t):e==="http://www.w3.org/2000/svg"&&t==="foreignObject"?"http://www.w3.org/1999/xhtml":e}var On,$n=(function(e){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(t,n,r,l){MSApp.execUnsafeLocalFunction(function(){return e(t,n,r,l)})}:e})(function(e,t){if(e.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in e)e.innerHTML=t;else{for(On=On||document.createElement("div"),On.innerHTML="<svg>"+t.valueOf().toString()+"</svg>",t=On.firstChild;e.firstChild;)e.removeChild(e.firstChild);for(;t.firstChild;)e.appendChild(t.firstChild)}});function Et(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&n.nodeType===3){n.nodeValue=t;return}}e.textContent=t}var Ct={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},Sl=["Webkit","ms","Moz","O"];Object.keys(Ct).forEach(function(e){Sl.forEach(function(t){t=t+e.charAt(0).toUpperCase()+e.substring(1),Ct[t]=Ct[e]})});function Qt(e,t,n){return t==null||typeof t=="boolean"||t===""?"":n||typeof t!="number"||t===0||Ct.hasOwnProperty(e)&&Ct[e]?(""+t).trim():t+"px"}function In(e,t){e=e.style;for(var n in t)if(t.hasOwnProperty(n)){var r=n.indexOf("--")===0,l=Qt(n,t[n],r);n==="float"&&(n="cssFloat"),r?e.setProperty(n,l):e[n]=l}}var It=B({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function ar(e,t){if(t){if(It[e]&&(t.children!=null||t.dangerouslySetInnerHTML!=null))throw Error(s(137,e));if(t.dangerouslySetInnerHTML!=null){if(t.children!=null)throw Error(s(60));if(typeof t.dangerouslySetInnerHTML!="object"||!("__html"in t.dangerouslySetInnerHTML))throw Error(s(61))}if(t.style!=null&&typeof t.style!="object")throw Error(s(62))}}function Ar(e,t){if(e.indexOf("-")===-1)return typeof t.is=="string";switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var or=null;function sr(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var An=null,Jt=null,et=null;function Yt(e){if(e=sl(e)){if(typeof An!="function")throw Error(s(280));var t=e.stateNode;t&&(t=Hl(t),An(e.stateNode,e.type,t))}}function Fn(e){Jt?et?et.push(e):et=[e]:Jt=e}function Bn(){if(Jt){var e=Jt,t=et;if(et=Jt=null,Yt(e),t)for(e=0;e<t.length;e++)Yt(t[e])}}function El(e,t){return e(t)}function Fr(){}var ir=!1;function Gt(e,t,n){if(ir)return e(t,n);ir=!0;try{return El(e,t,n)}finally{ir=!1,(Jt!==null||et!==null)&&(Fr(),Bn())}}function qt(e,t){var n=e.stateNode;if(n===null)return null;var r=Hl(n);if(r===null)return null;n=r[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(r=!r.disabled)||(e=e.type,r=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!r;break e;default:e=!1}if(e)return null;if(n&&typeof n!="function")throw Error(s(231,t,typeof n));return n}var dn=!1;if(E)try{var Un={};Object.defineProperty(Un,"passive",{get:function(){dn=!0}}),window.addEventListener("test",Un,Un),window.removeEventListener("test",Un,Un)}catch{dn=!1}function Nt(e,t,n,r,l,a,i,c,p){var w=Array.prototype.slice.call(arguments,3);try{t.apply(n,w)}catch(z){this.onError(z)}}var Xt=!1,pn=null,Vn=!1,ur=null,cr={onError:function(e){Xt=!0,pn=e}};function Cl(e,t,n,r,l,a,i,c,p){Xt=!1,pn=null,Nt.apply(cr,arguments)}function dr(e,t,n,r,l,a,i,c,p){if(Cl.apply(this,arguments),Xt){if(Xt){var w=pn;Xt=!1,pn=null}else throw Error(s(198));Vn||(Vn=!0,ur=w)}}function Zt(e){var t=e,n=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,(t.flags&4098)!==0&&(n=t.return),e=t.return;while(e)}return t.tag===3?n:null}function mt(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function pr(e){if(Zt(e)!==e)throw Error(s(188))}function jt(e){var t=e.alternate;if(!t){if(t=Zt(e),t===null)throw Error(s(188));return t!==e?null:e}for(var n=e,r=t;;){var l=n.return;if(l===null)break;var a=l.alternate;if(a===null){if(r=l.return,r!==null){n=r;continue}break}if(l.child===a.child){for(a=l.child;a;){if(a===n)return pr(l),e;if(a===r)return pr(l),t;a=a.sibling}throw Error(s(188))}if(n.return!==r.return)n=l,r=a;else{for(var i=!1,c=l.child;c;){if(c===n){i=!0,n=l,r=a;break}if(c===r){i=!0,r=l,n=a;break}c=c.sibling}if(!i){for(c=a.child;c;){if(c===n){i=!0,n=a,r=l;break}if(c===r){i=!0,r=a,n=l;break}c=c.sibling}if(!i)throw Error(s(189))}}if(n.alternate!==r)throw Error(s(190))}if(n.tag!==3)throw Error(s(188));return n.stateNode.current===n?e:t}function fr(e){return e=jt(e),e!==null?Nl(e):null}function Nl(e){if(e.tag===5||e.tag===6)return e;for(e=e.child;e!==null;){var t=Nl(e);if(t!==null)return t;e=e.sibling}return null}var Br=u.unstable_scheduleCallback,jl=u.unstable_cancelCallback,gr=u.unstable_shouldYield,Ma=u.unstable_requestPaint,Ee=u.unstable_now,La=u.unstable_getCurrentPriorityLevel,mr=u.unstable_ImmediatePriority,Ur=u.unstable_UserBlockingPriority,Wn=u.unstable_NormalPriority,f=u.unstable_LowPriority,k=u.unstable_IdlePriority,D=null,A=null;function ae(e){if(A&&typeof A.onCommitFiberRoot=="function")try{A.onCommitFiberRoot(D,e,void 0,(e.current.flags&128)===128)}catch{}}var q=Math.clz32?Math.clz32:ue,ie=Math.log,F=Math.LN2;function ue(e){return e>>>=0,e===0?32:31-(ie(e)/F|0)|0}var _e=64,At=4194304;function Vr(e){switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return e&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return e}}function Tl(e,t){var n=e.pendingLanes;if(n===0)return 0;var r=0,l=e.suspendedLanes,a=e.pingedLanes,i=n&268435455;if(i!==0){var c=i&~l;c!==0?r=Vr(c):(a&=i,a!==0&&(r=Vr(a)))}else i=n&~l,i!==0?r=Vr(i):a!==0&&(r=Vr(a));if(r===0)return 0;if(t!==0&&t!==r&&(t&l)===0&&(l=r&-r,a=t&-t,l>=a||l===16&&(a&4194240)!==0))return t;if((r&4)!==0&&(r|=n&16),t=e.entangledLanes,t!==0)for(e=e.entanglements,t&=r;0<t;)n=31-q(t),l=1<<n,r|=e[n],t&=~l;return r}function _c(e,t){switch(e){case 1:case 2:case 4:return t+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function wc(e,t){for(var n=e.suspendedLanes,r=e.pingedLanes,l=e.expirationTimes,a=e.pendingLanes;0<a;){var i=31-q(a),c=1<<i,p=l[i];p===-1?((c&n)===0||(c&r)!==0)&&(l[i]=_c(c,t)):p<=t&&(e.expiredLanes|=c),a&=~c}}function Ra(e){return e=e.pendingLanes&-1073741825,e!==0?e:e&1073741824?1073741824:0}function Ss(){var e=_e;return _e<<=1,(_e&4194240)===0&&(_e=64),e}function Da(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function Wr(e,t,n){e.pendingLanes|=t,t!==536870912&&(e.suspendedLanes=0,e.pingedLanes=0),e=e.eventTimes,t=31-q(t),e[t]=n}function kc(e,t){var n=e.pendingLanes&~t;e.pendingLanes=t,e.suspendedLanes=0,e.pingedLanes=0,e.expiredLanes&=t,e.mutableReadLanes&=t,e.entangledLanes&=t,t=e.entanglements;var r=e.eventTimes;for(e=e.expirationTimes;0<n;){var l=31-q(n),a=1<<l;t[l]=0,r[l]=-1,e[l]=-1,n&=~a}}function Oa(e,t){var n=e.entangledLanes|=t;for(e=e.entanglements;n;){var r=31-q(n),l=1<<r;l&t|e[r]&t&&(e[r]|=t),n&=~l}}var he=0;function Es(e){return e&=-e,1<e?4<e?(e&268435455)!==0?16:536870912:4:1}var Cs,$a,Ns,js,Ts,Ia=!1,zl=[],fn=null,gn=null,mn=null,Hr=new Map,Kr=new Map,hn=[],bc="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function zs(e,t){switch(e){case"focusin":case"focusout":fn=null;break;case"dragenter":case"dragleave":gn=null;break;case"mouseover":case"mouseout":mn=null;break;case"pointerover":case"pointerout":Hr.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":Kr.delete(t.pointerId)}}function Qr(e,t,n,r,l,a){return e===null||e.nativeEvent!==a?(e={blockedOn:t,domEventName:n,eventSystemFlags:r,nativeEvent:a,targetContainers:[l]},t!==null&&(t=sl(t),t!==null&&$a(t)),e):(e.eventSystemFlags|=r,t=e.targetContainers,l!==null&&t.indexOf(l)===-1&&t.push(l),e)}function Sc(e,t,n,r,l){switch(t){case"focusin":return fn=Qr(fn,e,t,n,r,l),!0;case"dragenter":return gn=Qr(gn,e,t,n,r,l),!0;case"mouseover":return mn=Qr(mn,e,t,n,r,l),!0;case"pointerover":var a=l.pointerId;return Hr.set(a,Qr(Hr.get(a)||null,e,t,n,r,l)),!0;case"gotpointercapture":return a=l.pointerId,Kr.set(a,Qr(Kr.get(a)||null,e,t,n,r,l)),!0}return!1}function Ps(e){var t=Hn(e.target);if(t!==null){var n=Zt(t);if(n!==null){if(t=n.tag,t===13){if(t=mt(n),t!==null){e.blockedOn=t,Ts(e.priority,function(){Ns(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}e.blockedOn=null}function Pl(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var n=Fa(e.domEventName,e.eventSystemFlags,t[0],e.nativeEvent);if(n===null){n=e.nativeEvent;var r=new n.constructor(n.type,n);or=r,n.target.dispatchEvent(r),or=null}else return t=sl(n),t!==null&&$a(t),e.blockedOn=n,!1;t.shift()}return!0}function Ms(e,t,n){Pl(e)&&n.delete(t)}function Ec(){Ia=!1,fn!==null&&Pl(fn)&&(fn=null),gn!==null&&Pl(gn)&&(gn=null),mn!==null&&Pl(mn)&&(mn=null),Hr.forEach(Ms),Kr.forEach(Ms)}function Jr(e,t){e.blockedOn===t&&(e.blockedOn=null,Ia||(Ia=!0,u.unstable_scheduleCallback(u.unstable_NormalPriority,Ec)))}function Yr(e){function t(l){return Jr(l,e)}if(0<zl.length){Jr(zl[0],e);for(var n=1;n<zl.length;n++){var r=zl[n];r.blockedOn===e&&(r.blockedOn=null)}}for(fn!==null&&Jr(fn,e),gn!==null&&Jr(gn,e),mn!==null&&Jr(mn,e),Hr.forEach(t),Kr.forEach(t),n=0;n<hn.length;n++)r=hn[n],r.blockedOn===e&&(r.blockedOn=null);for(;0<hn.length&&(n=hn[0],n.blockedOn===null);)Ps(n),n.blockedOn===null&&hn.shift()}var hr=be.ReactCurrentBatchConfig,Ml=!0;function Cc(e,t,n,r){var l=he,a=hr.transition;hr.transition=null;try{he=1,Aa(e,t,n,r)}finally{he=l,hr.transition=a}}function Nc(e,t,n,r){var l=he,a=hr.transition;hr.transition=null;try{he=4,Aa(e,t,n,r)}finally{he=l,hr.transition=a}}function Aa(e,t,n,r){if(Ml){var l=Fa(e,t,n,r);if(l===null)ro(e,t,r,Ll,n),zs(e,r);else if(Sc(l,e,t,n,r))r.stopPropagation();else if(zs(e,r),t&4&&-1<bc.indexOf(e)){for(;l!==null;){var a=sl(l);if(a!==null&&Cs(a),a=Fa(e,t,n,r),a===null&&ro(e,t,r,Ll,n),a===l)break;l=a}l!==null&&r.stopPropagation()}else ro(e,t,r,null,n)}}var Ll=null;function Fa(e,t,n,r){if(Ll=null,e=sr(r),e=Hn(e),e!==null)if(t=Zt(e),t===null)e=null;else if(n=t.tag,n===13){if(e=mt(t),e!==null)return e;e=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null);return Ll=e,null}function Ls(e){switch(e){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(La()){case mr:return 1;case Ur:return 4;case Wn:case f:return 16;case k:return 536870912;default:return 16}default:return 16}}var xn=null,Ba=null,Rl=null;function Rs(){if(Rl)return Rl;var e,t=Ba,n=t.length,r,l="value"in xn?xn.value:xn.textContent,a=l.length;for(e=0;e<n&&t[e]===l[e];e++);var i=n-e;for(r=1;r<=i&&t[n-r]===l[a-r];r++);return Rl=l.slice(e,1<r?1-r:void 0)}function Dl(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function Ol(){return!0}function Ds(){return!1}function ut(e){function t(n,r,l,a,i){this._reactName=n,this._targetInst=l,this.type=r,this.nativeEvent=a,this.target=i,this.currentTarget=null;for(var c in e)e.hasOwnProperty(c)&&(n=e[c],this[c]=n?n(a):a[c]);return this.isDefaultPrevented=(a.defaultPrevented!=null?a.defaultPrevented:a.returnValue===!1)?Ol:Ds,this.isPropagationStopped=Ds,this}return B(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=Ol)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=Ol)},persist:function(){},isPersistent:Ol}),t}var xr={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Ua=ut(xr),Gr=B({},xr,{view:0,detail:0}),jc=ut(Gr),Va,Wa,qr,$l=B({},Gr,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Ka,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==qr&&(qr&&e.type==="mousemove"?(Va=e.screenX-qr.screenX,Wa=e.screenY-qr.screenY):Wa=Va=0,qr=e),Va)},movementY:function(e){return"movementY"in e?e.movementY:Wa}}),Os=ut($l),Tc=B({},$l,{dataTransfer:0}),zc=ut(Tc),Pc=B({},Gr,{relatedTarget:0}),Ha=ut(Pc),Mc=B({},xr,{animationName:0,elapsedTime:0,pseudoElement:0}),Lc=ut(Mc),Rc=B({},xr,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),Dc=ut(Rc),Oc=B({},xr,{data:0}),$s=ut(Oc),$c={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Ic={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Ac={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Fc(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=Ac[e])?!!t[e]:!1}function Ka(){return Fc}var Bc=B({},Gr,{key:function(e){if(e.key){var t=$c[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=Dl(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?Ic[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Ka,charCode:function(e){return e.type==="keypress"?Dl(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?Dl(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),Uc=ut(Bc),Vc=B({},$l,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Is=ut(Vc),Wc=B({},Gr,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Ka}),Hc=ut(Wc),Kc=B({},xr,{propertyName:0,elapsedTime:0,pseudoElement:0}),Qc=ut(Kc),Jc=B({},$l,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),Yc=ut(Jc),Gc=[9,13,27,32],Qa=E&&"CompositionEvent"in window,Xr=null;E&&"documentMode"in document&&(Xr=document.documentMode);var qc=E&&"TextEvent"in window&&!Xr,As=E&&(!Qa||Xr&&8<Xr&&11>=Xr),Fs=" ",Bs=!1;function Us(e,t){switch(e){case"keyup":return Gc.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Vs(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var vr=!1;function Xc(e,t){switch(e){case"compositionend":return Vs(t);case"keypress":return t.which!==32?null:(Bs=!0,Fs);case"textInput":return e=t.data,e===Fs&&Bs?null:e;default:return null}}function Zc(e,t){if(vr)return e==="compositionend"||!Qa&&Us(e,t)?(e=Rs(),Rl=Ba=xn=null,vr=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return As&&t.locale!=="ko"?null:t.data;default:return null}}var ed={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Ws(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!ed[e.type]:t==="textarea"}function Hs(e,t,n,r){Fn(r),t=Ul(t,"onChange"),0<t.length&&(n=new Ua("onChange","change",null,n,r),e.push({event:n,listeners:t}))}var Zr=null,el=null;function td(e){ui(e,0)}function Il(e){var t=br(e);if(Ot(t))return e}function nd(e,t){if(e==="change")return t}var Ks=!1;if(E){var Ja;if(E){var Ya="oninput"in document;if(!Ya){var Qs=document.createElement("div");Qs.setAttribute("oninput","return;"),Ya=typeof Qs.oninput=="function"}Ja=Ya}else Ja=!1;Ks=Ja&&(!document.documentMode||9<document.documentMode)}function Js(){Zr&&(Zr.detachEvent("onpropertychange",Ys),el=Zr=null)}function Ys(e){if(e.propertyName==="value"&&Il(el)){var t=[];Hs(t,el,e,sr(e)),Gt(td,t)}}function rd(e,t,n){e==="focusin"?(Js(),Zr=t,el=n,Zr.attachEvent("onpropertychange",Ys)):e==="focusout"&&Js()}function ld(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return Il(el)}function ad(e,t){if(e==="click")return Il(t)}function od(e,t){if(e==="input"||e==="change")return Il(t)}function sd(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var Tt=typeof Object.is=="function"?Object.is:sd;function tl(e,t){if(Tt(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var n=Object.keys(e),r=Object.keys(t);if(n.length!==r.length)return!1;for(r=0;r<n.length;r++){var l=n[r];if(!b.call(t,l)||!Tt(e[l],t[l]))return!1}return!0}function Gs(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function qs(e,t){var n=Gs(e);e=0;for(var r;n;){if(n.nodeType===3){if(r=e+n.textContent.length,e<=t&&r>=t)return{node:n,offset:t-e};e=r}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=Gs(n)}}function Xs(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?Xs(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function Zs(){for(var e=window,t=He();t instanceof e.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href=="string"}catch{n=!1}if(n)e=t.contentWindow;else break;t=He(e.document)}return t}function Ga(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}function id(e){var t=Zs(),n=e.focusedElem,r=e.selectionRange;if(t!==n&&n&&n.ownerDocument&&Xs(n.ownerDocument.documentElement,n)){if(r!==null&&Ga(n)){if(t=r.start,e=r.end,e===void 0&&(e=t),"selectionStart"in n)n.selectionStart=t,n.selectionEnd=Math.min(e,n.value.length);else if(e=(t=n.ownerDocument||document)&&t.defaultView||window,e.getSelection){e=e.getSelection();var l=n.textContent.length,a=Math.min(r.start,l);r=r.end===void 0?a:Math.min(r.end,l),!e.extend&&a>r&&(l=r,r=a,a=l),l=qs(n,a);var i=qs(n,r);l&&i&&(e.rangeCount!==1||e.anchorNode!==l.node||e.anchorOffset!==l.offset||e.focusNode!==i.node||e.focusOffset!==i.offset)&&(t=t.createRange(),t.setStart(l.node,l.offset),e.removeAllRanges(),a>r?(e.addRange(t),e.extend(i.node,i.offset)):(t.setEnd(i.node,i.offset),e.addRange(t)))}}for(t=[],e=n;e=e.parentNode;)e.nodeType===1&&t.push({element:e,left:e.scrollLeft,top:e.scrollTop});for(typeof n.focus=="function"&&n.focus(),n=0;n<t.length;n++)e=t[n],e.element.scrollLeft=e.left,e.element.scrollTop=e.top}}var ud=E&&"documentMode"in document&&11>=document.documentMode,yr=null,qa=null,nl=null,Xa=!1;function ei(e,t,n){var r=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;Xa||yr==null||yr!==He(r)||(r=yr,"selectionStart"in r&&Ga(r)?r={start:r.selectionStart,end:r.selectionEnd}:(r=(r.ownerDocument&&r.ownerDocument.defaultView||window).getSelection(),r={anchorNode:r.anchorNode,anchorOffset:r.anchorOffset,focusNode:r.focusNode,focusOffset:r.focusOffset}),nl&&tl(nl,r)||(nl=r,r=Ul(qa,"onSelect"),0<r.length&&(t=new Ua("onSelect","select",null,t,n),e.push({event:t,listeners:r}),t.target=yr)))}function Al(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n["Webkit"+e]="webkit"+t,n["Moz"+e]="moz"+t,n}var _r={animationend:Al("Animation","AnimationEnd"),animationiteration:Al("Animation","AnimationIteration"),animationstart:Al("Animation","AnimationStart"),transitionend:Al("Transition","TransitionEnd")},Za={},ti={};E&&(ti=document.createElement("div").style,"AnimationEvent"in window||(delete _r.animationend.animation,delete _r.animationiteration.animation,delete _r.animationstart.animation),"TransitionEvent"in window||delete _r.transitionend.transition);function Fl(e){if(Za[e])return Za[e];if(!_r[e])return e;var t=_r[e],n;for(n in t)if(t.hasOwnProperty(n)&&n in ti)return Za[e]=t[n];return e}var ni=Fl("animationend"),ri=Fl("animationiteration"),li=Fl("animationstart"),ai=Fl("transitionend"),oi=new Map,si="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function vn(e,t){oi.set(e,t),h(t,[e])}for(var eo=0;eo<si.length;eo++){var to=si[eo],cd=to.toLowerCase(),dd=to[0].toUpperCase()+to.slice(1);vn(cd,"on"+dd)}vn(ni,"onAnimationEnd"),vn(ri,"onAnimationIteration"),vn(li,"onAnimationStart"),vn("dblclick","onDoubleClick"),vn("focusin","onFocus"),vn("focusout","onBlur"),vn(ai,"onTransitionEnd"),L("onMouseEnter",["mouseout","mouseover"]),L("onMouseLeave",["mouseout","mouseover"]),L("onPointerEnter",["pointerout","pointerover"]),L("onPointerLeave",["pointerout","pointerover"]),h("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),h("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),h("onBeforeInput",["compositionend","keypress","textInput","paste"]),h("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),h("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),h("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var rl="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),pd=new Set("cancel close invalid load scroll toggle".split(" ").concat(rl));function ii(e,t,n){var r=e.type||"unknown-event";e.currentTarget=n,dr(r,t,void 0,e),e.currentTarget=null}function ui(e,t){t=(t&4)!==0;for(var n=0;n<e.length;n++){var r=e[n],l=r.event;r=r.listeners;e:{var a=void 0;if(t)for(var i=r.length-1;0<=i;i--){var c=r[i],p=c.instance,w=c.currentTarget;if(c=c.listener,p!==a&&l.isPropagationStopped())break e;ii(l,c,w),a=p}else for(i=0;i<r.length;i++){if(c=r[i],p=c.instance,w=c.currentTarget,c=c.listener,p!==a&&l.isPropagationStopped())break e;ii(l,c,w),a=p}}}if(Vn)throw e=ur,Vn=!1,ur=null,e}function we(e,t){var n=t[uo];n===void 0&&(n=t[uo]=new Set);var r=e+"__bubble";n.has(r)||(ci(t,e,2,!1),n.add(r))}function no(e,t,n){var r=0;t&&(r|=4),ci(n,e,r,t)}var Bl="_reactListening"+Math.random().toString(36).slice(2);function ll(e){if(!e[Bl]){e[Bl]=!0,v.forEach(function(n){n!=="selectionchange"&&(pd.has(n)||no(n,!1,e),no(n,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[Bl]||(t[Bl]=!0,no("selectionchange",!1,t))}}function ci(e,t,n,r){switch(Ls(t)){case 1:var l=Cc;break;case 4:l=Nc;break;default:l=Aa}n=l.bind(null,t,n,e),l=void 0,!dn||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(l=!0),r?l!==void 0?e.addEventListener(t,n,{capture:!0,passive:l}):e.addEventListener(t,n,!0):l!==void 0?e.addEventListener(t,n,{passive:l}):e.addEventListener(t,n,!1)}function ro(e,t,n,r,l){var a=r;if((t&1)===0&&(t&2)===0&&r!==null)e:for(;;){if(r===null)return;var i=r.tag;if(i===3||i===4){var c=r.stateNode.containerInfo;if(c===l||c.nodeType===8&&c.parentNode===l)break;if(i===4)for(i=r.return;i!==null;){var p=i.tag;if((p===3||p===4)&&(p=i.stateNode.containerInfo,p===l||p.nodeType===8&&p.parentNode===l))return;i=i.return}for(;c!==null;){if(i=Hn(c),i===null)return;if(p=i.tag,p===5||p===6){r=a=i;continue e}c=c.parentNode}}r=r.return}Gt(function(){var w=a,z=sr(n),R=[];e:{var j=oi.get(e);if(j!==void 0){var I=Ua,W=e;switch(e){case"keypress":if(Dl(n)===0)break e;case"keydown":case"keyup":I=Uc;break;case"focusin":W="focus",I=Ha;break;case"focusout":W="blur",I=Ha;break;case"beforeblur":case"afterblur":I=Ha;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":I=Os;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":I=zc;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":I=Hc;break;case ni:case ri:case li:I=Lc;break;case ai:I=Qc;break;case"scroll":I=jc;break;case"wheel":I=Yc;break;case"copy":case"cut":case"paste":I=Dc;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":I=Is}var H=(t&4)!==0,Te=!H&&e==="scroll",y=H?j!==null?j+"Capture":null:j;H=[];for(var g=w,_;g!==null;){_=g;var O=_.stateNode;if(_.tag===5&&O!==null&&(_=O,y!==null&&(O=qt(g,y),O!=null&&H.push(al(g,O,_)))),Te)break;g=g.return}0<H.length&&(j=new I(j,W,null,n,z),R.push({event:j,listeners:H}))}}if((t&7)===0){e:{if(j=e==="mouseover"||e==="pointerover",I=e==="mouseout"||e==="pointerout",j&&n!==or&&(W=n.relatedTarget||n.fromElement)&&(Hn(W)||W[en]))break e;if((I||j)&&(j=z.window===z?z:(j=z.ownerDocument)?j.defaultView||j.parentWindow:window,I?(W=n.relatedTarget||n.toElement,I=w,W=W?Hn(W):null,W!==null&&(Te=Zt(W),W!==Te||W.tag!==5&&W.tag!==6)&&(W=null)):(I=null,W=w),I!==W)){if(H=Os,O="onMouseLeave",y="onMouseEnter",g="mouse",(e==="pointerout"||e==="pointerover")&&(H=Is,O="onPointerLeave",y="onPointerEnter",g="pointer"),Te=I==null?j:br(I),_=W==null?j:br(W),j=new H(O,g+"leave",I,n,z),j.target=Te,j.relatedTarget=_,O=null,Hn(z)===w&&(H=new H(y,g+"enter",W,n,z),H.target=_,H.relatedTarget=Te,O=H),Te=O,I&&W)t:{for(H=I,y=W,g=0,_=H;_;_=wr(_))g++;for(_=0,O=y;O;O=wr(O))_++;for(;0<g-_;)H=wr(H),g--;for(;0<_-g;)y=wr(y),_--;for(;g--;){if(H===y||y!==null&&H===y.alternate)break t;H=wr(H),y=wr(y)}H=null}else H=null;I!==null&&di(R,j,I,H,!1),W!==null&&Te!==null&&di(R,Te,W,H,!0)}}e:{if(j=w?br(w):window,I=j.nodeName&&j.nodeName.toLowerCase(),I==="select"||I==="input"&&j.type==="file")var K=nd;else if(Ws(j))if(Ks)K=od;else{K=ld;var Q=rd}else(I=j.nodeName)&&I.toLowerCase()==="input"&&(j.type==="checkbox"||j.type==="radio")&&(K=ad);if(K&&(K=K(e,w))){Hs(R,K,n,z);break e}Q&&Q(e,j,w),e==="focusout"&&(Q=j._wrapperState)&&Q.controlled&&j.type==="number"&&un(j,"number",j.value)}switch(Q=w?br(w):window,e){case"focusin":(Ws(Q)||Q.contentEditable==="true")&&(yr=Q,qa=w,nl=null);break;case"focusout":nl=qa=yr=null;break;case"mousedown":Xa=!0;break;case"contextmenu":case"mouseup":case"dragend":Xa=!1,ei(R,n,z);break;case"selectionchange":if(ud)break;case"keydown":case"keyup":ei(R,n,z)}var J;if(Qa)e:{switch(e){case"compositionstart":var X="onCompositionStart";break e;case"compositionend":X="onCompositionEnd";break e;case"compositionupdate":X="onCompositionUpdate";break e}X=void 0}else vr?Us(e,n)&&(X="onCompositionEnd"):e==="keydown"&&n.keyCode===229&&(X="onCompositionStart");X&&(As&&n.locale!=="ko"&&(vr||X!=="onCompositionStart"?X==="onCompositionEnd"&&vr&&(J=Rs()):(xn=z,Ba="value"in xn?xn.value:xn.textContent,vr=!0)),Q=Ul(w,X),0<Q.length&&(X=new $s(X,e,null,n,z),R.push({event:X,listeners:Q}),J?X.data=J:(J=Vs(n),J!==null&&(X.data=J)))),(J=qc?Xc(e,n):Zc(e,n))&&(w=Ul(w,"onBeforeInput"),0<w.length&&(z=new $s("onBeforeInput","beforeinput",null,n,z),R.push({event:z,listeners:w}),z.data=J))}ui(R,t)})}function al(e,t,n){return{instance:e,listener:t,currentTarget:n}}function Ul(e,t){for(var n=t+"Capture",r=[];e!==null;){var l=e,a=l.stateNode;l.tag===5&&a!==null&&(l=a,a=qt(e,n),a!=null&&r.unshift(al(e,a,l)),a=qt(e,t),a!=null&&r.push(al(e,a,l))),e=e.return}return r}function wr(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5);return e||null}function di(e,t,n,r,l){for(var a=t._reactName,i=[];n!==null&&n!==r;){var c=n,p=c.alternate,w=c.stateNode;if(p!==null&&p===r)break;c.tag===5&&w!==null&&(c=w,l?(p=qt(n,a),p!=null&&i.unshift(al(n,p,c))):l||(p=qt(n,a),p!=null&&i.push(al(n,p,c)))),n=n.return}i.length!==0&&e.push({event:t,listeners:i})}var fd=/\r\n?/g,gd=/\u0000|\uFFFD/g;function pi(e){return(typeof e=="string"?e:""+e).replace(fd,`
`).replace(gd,"")}function Vl(e,t,n){if(t=pi(t),pi(e)!==t&&n)throw Error(s(425))}function Wl(){}var lo=null,ao=null;function oo(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var so=typeof setTimeout=="function"?setTimeout:void 0,md=typeof clearTimeout=="function"?clearTimeout:void 0,fi=typeof Promise=="function"?Promise:void 0,hd=typeof queueMicrotask=="function"?queueMicrotask:typeof fi<"u"?function(e){return fi.resolve(null).then(e).catch(xd)}:so;function xd(e){setTimeout(function(){throw e})}function io(e,t){var n=t,r=0;do{var l=n.nextSibling;if(e.removeChild(n),l&&l.nodeType===8)if(n=l.data,n==="/$"){if(r===0){e.removeChild(l),Yr(t);return}r--}else n!=="$"&&n!=="$?"&&n!=="$!"||r++;n=l}while(n);Yr(t)}function yn(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?")break;if(t==="/$")return null}}return e}function gi(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="$"||n==="$!"||n==="$?"){if(t===0)return e;t--}else n==="/$"&&t++}e=e.previousSibling}return null}var kr=Math.random().toString(36).slice(2),Ft="__reactFiber$"+kr,ol="__reactProps$"+kr,en="__reactContainer$"+kr,uo="__reactEvents$"+kr,vd="__reactListeners$"+kr,yd="__reactHandles$"+kr;function Hn(e){var t=e[Ft];if(t)return t;for(var n=e.parentNode;n;){if(t=n[en]||n[Ft]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(e=gi(e);e!==null;){if(n=e[Ft])return n;e=gi(e)}return t}e=n,n=e.parentNode}return null}function sl(e){return e=e[Ft]||e[en],!e||e.tag!==5&&e.tag!==6&&e.tag!==13&&e.tag!==3?null:e}function br(e){if(e.tag===5||e.tag===6)return e.stateNode;throw Error(s(33))}function Hl(e){return e[ol]||null}var co=[],Sr=-1;function _n(e){return{current:e}}function ke(e){0>Sr||(e.current=co[Sr],co[Sr]=null,Sr--)}function ve(e,t){Sr++,co[Sr]=e.current,e.current=t}var wn={},Ke=_n(wn),tt=_n(!1),Kn=wn;function Er(e,t){var n=e.type.contextTypes;if(!n)return wn;var r=e.stateNode;if(r&&r.__reactInternalMemoizedUnmaskedChildContext===t)return r.__reactInternalMemoizedMaskedChildContext;var l={},a;for(a in n)l[a]=t[a];return r&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=t,e.__reactInternalMemoizedMaskedChildContext=l),l}function nt(e){return e=e.childContextTypes,e!=null}function Kl(){ke(tt),ke(Ke)}function mi(e,t,n){if(Ke.current!==wn)throw Error(s(168));ve(Ke,t),ve(tt,n)}function hi(e,t,n){var r=e.stateNode;if(t=t.childContextTypes,typeof r.getChildContext!="function")return n;r=r.getChildContext();for(var l in r)if(!(l in t))throw Error(s(108,xe(e)||"Unknown",l));return B({},n,r)}function Ql(e){return e=(e=e.stateNode)&&e.__reactInternalMemoizedMergedChildContext||wn,Kn=Ke.current,ve(Ke,e),ve(tt,tt.current),!0}function xi(e,t,n){var r=e.stateNode;if(!r)throw Error(s(169));n?(e=hi(e,t,Kn),r.__reactInternalMemoizedMergedChildContext=e,ke(tt),ke(Ke),ve(Ke,e)):ke(tt),ve(tt,n)}var tn=null,Jl=!1,po=!1;function vi(e){tn===null?tn=[e]:tn.push(e)}function _d(e){Jl=!0,vi(e)}function kn(){if(!po&&tn!==null){po=!0;var e=0,t=he;try{var n=tn;for(he=1;e<n.length;e++){var r=n[e];do r=r(!0);while(r!==null)}tn=null,Jl=!1}catch(l){throw tn!==null&&(tn=tn.slice(e+1)),Br(mr,kn),l}finally{he=t,po=!1}}return null}var Cr=[],Nr=0,Yl=null,Gl=0,ht=[],xt=0,Qn=null,nn=1,rn="";function Jn(e,t){Cr[Nr++]=Gl,Cr[Nr++]=Yl,Yl=e,Gl=t}function yi(e,t,n){ht[xt++]=nn,ht[xt++]=rn,ht[xt++]=Qn,Qn=e;var r=nn;e=rn;var l=32-q(r)-1;r&=~(1<<l),n+=1;var a=32-q(t)+l;if(30<a){var i=l-l%5;a=(r&(1<<i)-1).toString(32),r>>=i,l-=i,nn=1<<32-q(t)+l|n<<l|r,rn=a+e}else nn=1<<a|n<<l|r,rn=e}function fo(e){e.return!==null&&(Jn(e,1),yi(e,1,0))}function go(e){for(;e===Yl;)Yl=Cr[--Nr],Cr[Nr]=null,Gl=Cr[--Nr],Cr[Nr]=null;for(;e===Qn;)Qn=ht[--xt],ht[xt]=null,rn=ht[--xt],ht[xt]=null,nn=ht[--xt],ht[xt]=null}var ct=null,dt=null,Se=!1,zt=null;function _i(e,t){var n=wt(5,null,null,0);n.elementType="DELETED",n.stateNode=t,n.return=e,t=e.deletions,t===null?(e.deletions=[n],e.flags|=16):t.push(n)}function wi(e,t){switch(e.tag){case 5:var n=e.type;return t=t.nodeType!==1||n.toLowerCase()!==t.nodeName.toLowerCase()?null:t,t!==null?(e.stateNode=t,ct=e,dt=yn(t.firstChild),!0):!1;case 6:return t=e.pendingProps===""||t.nodeType!==3?null:t,t!==null?(e.stateNode=t,ct=e,dt=null,!0):!1;case 13:return t=t.nodeType!==8?null:t,t!==null?(n=Qn!==null?{id:nn,overflow:rn}:null,e.memoizedState={dehydrated:t,treeContext:n,retryLane:1073741824},n=wt(18,null,null,0),n.stateNode=t,n.return=e,e.child=n,ct=e,dt=null,!0):!1;default:return!1}}function mo(e){return(e.mode&1)!==0&&(e.flags&128)===0}function ho(e){if(Se){var t=dt;if(t){var n=t;if(!wi(e,t)){if(mo(e))throw Error(s(418));t=yn(n.nextSibling);var r=ct;t&&wi(e,t)?_i(r,n):(e.flags=e.flags&-4097|2,Se=!1,ct=e)}}else{if(mo(e))throw Error(s(418));e.flags=e.flags&-4097|2,Se=!1,ct=e}}}function ki(e){for(e=e.return;e!==null&&e.tag!==5&&e.tag!==3&&e.tag!==13;)e=e.return;ct=e}function ql(e){if(e!==ct)return!1;if(!Se)return ki(e),Se=!0,!1;var t;if((t=e.tag!==3)&&!(t=e.tag!==5)&&(t=e.type,t=t!=="head"&&t!=="body"&&!oo(e.type,e.memoizedProps)),t&&(t=dt)){if(mo(e))throw bi(),Error(s(418));for(;t;)_i(e,t),t=yn(t.nextSibling)}if(ki(e),e.tag===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(s(317));e:{for(e=e.nextSibling,t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="/$"){if(t===0){dt=yn(e.nextSibling);break e}t--}else n!=="$"&&n!=="$!"&&n!=="$?"||t++}e=e.nextSibling}dt=null}}else dt=ct?yn(e.stateNode.nextSibling):null;return!0}function bi(){for(var e=dt;e;)e=yn(e.nextSibling)}function jr(){dt=ct=null,Se=!1}function xo(e){zt===null?zt=[e]:zt.push(e)}var wd=be.ReactCurrentBatchConfig;function il(e,t,n){if(e=n.ref,e!==null&&typeof e!="function"&&typeof e!="object"){if(n._owner){if(n=n._owner,n){if(n.tag!==1)throw Error(s(309));var r=n.stateNode}if(!r)throw Error(s(147,e));var l=r,a=""+e;return t!==null&&t.ref!==null&&typeof t.ref=="function"&&t.ref._stringRef===a?t.ref:(t=function(i){var c=l.refs;i===null?delete c[a]:c[a]=i},t._stringRef=a,t)}if(typeof e!="string")throw Error(s(284));if(!n._owner)throw Error(s(290,e))}return e}function Xl(e,t){throw e=Object.prototype.toString.call(t),Error(s(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e))}function Si(e){var t=e._init;return t(e._payload)}function Ei(e){function t(y,g){if(e){var _=y.deletions;_===null?(y.deletions=[g],y.flags|=16):_.push(g)}}function n(y,g){if(!e)return null;for(;g!==null;)t(y,g),g=g.sibling;return null}function r(y,g){for(y=new Map;g!==null;)g.key!==null?y.set(g.key,g):y.set(g.index,g),g=g.sibling;return y}function l(y,g){return y=zn(y,g),y.index=0,y.sibling=null,y}function a(y,g,_){return y.index=_,e?(_=y.alternate,_!==null?(_=_.index,_<g?(y.flags|=2,g):_):(y.flags|=2,g)):(y.flags|=1048576,g)}function i(y){return e&&y.alternate===null&&(y.flags|=2),y}function c(y,g,_,O){return g===null||g.tag!==6?(g=is(_,y.mode,O),g.return=y,g):(g=l(g,_),g.return=y,g)}function p(y,g,_,O){var K=_.type;return K===Pe?z(y,g,_.props.children,O,_.key):g!==null&&(g.elementType===K||typeof K=="object"&&K!==null&&K.$$typeof===Ue&&Si(K)===g.type)?(O=l(g,_.props),O.ref=il(y,g,_),O.return=y,O):(O=ka(_.type,_.key,_.props,null,y.mode,O),O.ref=il(y,g,_),O.return=y,O)}function w(y,g,_,O){return g===null||g.tag!==4||g.stateNode.containerInfo!==_.containerInfo||g.stateNode.implementation!==_.implementation?(g=us(_,y.mode,O),g.return=y,g):(g=l(g,_.children||[]),g.return=y,g)}function z(y,g,_,O,K){return g===null||g.tag!==7?(g=nr(_,y.mode,O,K),g.return=y,g):(g=l(g,_),g.return=y,g)}function R(y,g,_){if(typeof g=="string"&&g!==""||typeof g=="number")return g=is(""+g,y.mode,_),g.return=y,g;if(typeof g=="object"&&g!==null){switch(g.$$typeof){case G:return _=ka(g.type,g.key,g.props,null,y.mode,_),_.ref=il(y,null,g),_.return=y,_;case pe:return g=us(g,y.mode,_),g.return=y,g;case Ue:var O=g._init;return R(y,O(g._payload),_)}if(cn(g)||Y(g))return g=nr(g,y.mode,_,null),g.return=y,g;Xl(y,g)}return null}function j(y,g,_,O){var K=g!==null?g.key:null;if(typeof _=="string"&&_!==""||typeof _=="number")return K!==null?null:c(y,g,""+_,O);if(typeof _=="object"&&_!==null){switch(_.$$typeof){case G:return _.key===K?p(y,g,_,O):null;case pe:return _.key===K?w(y,g,_,O):null;case Ue:return K=_._init,j(y,g,K(_._payload),O)}if(cn(_)||Y(_))return K!==null?null:z(y,g,_,O,null);Xl(y,_)}return null}function I(y,g,_,O,K){if(typeof O=="string"&&O!==""||typeof O=="number")return y=y.get(_)||null,c(g,y,""+O,K);if(typeof O=="object"&&O!==null){switch(O.$$typeof){case G:return y=y.get(O.key===null?_:O.key)||null,p(g,y,O,K);case pe:return y=y.get(O.key===null?_:O.key)||null,w(g,y,O,K);case Ue:var Q=O._init;return I(y,g,_,Q(O._payload),K)}if(cn(O)||Y(O))return y=y.get(_)||null,z(g,y,O,K,null);Xl(g,O)}return null}function W(y,g,_,O){for(var K=null,Q=null,J=g,X=g=0,Be=null;J!==null&&X<_.length;X++){J.index>X?(Be=J,J=null):Be=J.sibling;var de=j(y,J,_[X],O);if(de===null){J===null&&(J=Be);break}e&&J&&de.alternate===null&&t(y,J),g=a(de,g,X),Q===null?K=de:Q.sibling=de,Q=de,J=Be}if(X===_.length)return n(y,J),Se&&Jn(y,X),K;if(J===null){for(;X<_.length;X++)J=R(y,_[X],O),J!==null&&(g=a(J,g,X),Q===null?K=J:Q.sibling=J,Q=J);return Se&&Jn(y,X),K}for(J=r(y,J);X<_.length;X++)Be=I(J,y,X,_[X],O),Be!==null&&(e&&Be.alternate!==null&&J.delete(Be.key===null?X:Be.key),g=a(Be,g,X),Q===null?K=Be:Q.sibling=Be,Q=Be);return e&&J.forEach(function(Pn){return t(y,Pn)}),Se&&Jn(y,X),K}function H(y,g,_,O){var K=Y(_);if(typeof K!="function")throw Error(s(150));if(_=K.call(_),_==null)throw Error(s(151));for(var Q=K=null,J=g,X=g=0,Be=null,de=_.next();J!==null&&!de.done;X++,de=_.next()){J.index>X?(Be=J,J=null):Be=J.sibling;var Pn=j(y,J,de.value,O);if(Pn===null){J===null&&(J=Be);break}e&&J&&Pn.alternate===null&&t(y,J),g=a(Pn,g,X),Q===null?K=Pn:Q.sibling=Pn,Q=Pn,J=Be}if(de.done)return n(y,J),Se&&Jn(y,X),K;if(J===null){for(;!de.done;X++,de=_.next())de=R(y,de.value,O),de!==null&&(g=a(de,g,X),Q===null?K=de:Q.sibling=de,Q=de);return Se&&Jn(y,X),K}for(J=r(y,J);!de.done;X++,de=_.next())de=I(J,y,X,de.value,O),de!==null&&(e&&de.alternate!==null&&J.delete(de.key===null?X:de.key),g=a(de,g,X),Q===null?K=de:Q.sibling=de,Q=de);return e&&J.forEach(function(ep){return t(y,ep)}),Se&&Jn(y,X),K}function Te(y,g,_,O){if(typeof _=="object"&&_!==null&&_.type===Pe&&_.key===null&&(_=_.props.children),typeof _=="object"&&_!==null){switch(_.$$typeof){case G:e:{for(var K=_.key,Q=g;Q!==null;){if(Q.key===K){if(K=_.type,K===Pe){if(Q.tag===7){n(y,Q.sibling),g=l(Q,_.props.children),g.return=y,y=g;break e}}else if(Q.elementType===K||typeof K=="object"&&K!==null&&K.$$typeof===Ue&&Si(K)===Q.type){n(y,Q.sibling),g=l(Q,_.props),g.ref=il(y,Q,_),g.return=y,y=g;break e}n(y,Q);break}else t(y,Q);Q=Q.sibling}_.type===Pe?(g=nr(_.props.children,y.mode,O,_.key),g.return=y,y=g):(O=ka(_.type,_.key,_.props,null,y.mode,O),O.ref=il(y,g,_),O.return=y,y=O)}return i(y);case pe:e:{for(Q=_.key;g!==null;){if(g.key===Q)if(g.tag===4&&g.stateNode.containerInfo===_.containerInfo&&g.stateNode.implementation===_.implementation){n(y,g.sibling),g=l(g,_.children||[]),g.return=y,y=g;break e}else{n(y,g);break}else t(y,g);g=g.sibling}g=us(_,y.mode,O),g.return=y,y=g}return i(y);case Ue:return Q=_._init,Te(y,g,Q(_._payload),O)}if(cn(_))return W(y,g,_,O);if(Y(_))return H(y,g,_,O);Xl(y,_)}return typeof _=="string"&&_!==""||typeof _=="number"?(_=""+_,g!==null&&g.tag===6?(n(y,g.sibling),g=l(g,_),g.return=y,y=g):(n(y,g),g=is(_,y.mode,O),g.return=y,y=g),i(y)):n(y,g)}return Te}var Tr=Ei(!0),Ci=Ei(!1),Zl=_n(null),ea=null,zr=null,vo=null;function yo(){vo=zr=ea=null}function _o(e){var t=Zl.current;ke(Zl),e._currentValue=t}function wo(e,t,n){for(;e!==null;){var r=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,r!==null&&(r.childLanes|=t)):r!==null&&(r.childLanes&t)!==t&&(r.childLanes|=t),e===n)break;e=e.return}}function Pr(e,t){ea=e,vo=zr=null,e=e.dependencies,e!==null&&e.firstContext!==null&&((e.lanes&t)!==0&&(rt=!0),e.firstContext=null)}function vt(e){var t=e._currentValue;if(vo!==e)if(e={context:e,memoizedValue:t,next:null},zr===null){if(ea===null)throw Error(s(308));zr=e,ea.dependencies={lanes:0,firstContext:e}}else zr=zr.next=e;return t}var Yn=null;function ko(e){Yn===null?Yn=[e]:Yn.push(e)}function Ni(e,t,n,r){var l=t.interleaved;return l===null?(n.next=n,ko(t)):(n.next=l.next,l.next=n),t.interleaved=n,ln(e,r)}function ln(e,t){e.lanes|=t;var n=e.alternate;for(n!==null&&(n.lanes|=t),n=e,e=e.return;e!==null;)e.childLanes|=t,n=e.alternate,n!==null&&(n.childLanes|=t),n=e,e=e.return;return n.tag===3?n.stateNode:null}var bn=!1;function bo(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function ji(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,effects:e.effects})}function an(e,t){return{eventTime:e,lane:t,tag:0,payload:null,callback:null,next:null}}function Sn(e,t,n){var r=e.updateQueue;if(r===null)return null;if(r=r.shared,(ce&2)!==0){var l=r.pending;return l===null?t.next=t:(t.next=l.next,l.next=t),r.pending=t,ln(e,n)}return l=r.interleaved,l===null?(t.next=t,ko(r)):(t.next=l.next,l.next=t),r.interleaved=t,ln(e,n)}function ta(e,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,(n&4194240)!==0)){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,Oa(e,n)}}function Ti(e,t){var n=e.updateQueue,r=e.alternate;if(r!==null&&(r=r.updateQueue,n===r)){var l=null,a=null;if(n=n.firstBaseUpdate,n!==null){do{var i={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};a===null?l=a=i:a=a.next=i,n=n.next}while(n!==null);a===null?l=a=t:a=a.next=t}else l=a=t;n={baseState:r.baseState,firstBaseUpdate:l,lastBaseUpdate:a,shared:r.shared,effects:r.effects},e.updateQueue=n;return}e=n.lastBaseUpdate,e===null?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}function na(e,t,n,r){var l=e.updateQueue;bn=!1;var a=l.firstBaseUpdate,i=l.lastBaseUpdate,c=l.shared.pending;if(c!==null){l.shared.pending=null;var p=c,w=p.next;p.next=null,i===null?a=w:i.next=w,i=p;var z=e.alternate;z!==null&&(z=z.updateQueue,c=z.lastBaseUpdate,c!==i&&(c===null?z.firstBaseUpdate=w:c.next=w,z.lastBaseUpdate=p))}if(a!==null){var R=l.baseState;i=0,z=w=p=null,c=a;do{var j=c.lane,I=c.eventTime;if((r&j)===j){z!==null&&(z=z.next={eventTime:I,lane:0,tag:c.tag,payload:c.payload,callback:c.callback,next:null});e:{var W=e,H=c;switch(j=t,I=n,H.tag){case 1:if(W=H.payload,typeof W=="function"){R=W.call(I,R,j);break e}R=W;break e;case 3:W.flags=W.flags&-65537|128;case 0:if(W=H.payload,j=typeof W=="function"?W.call(I,R,j):W,j==null)break e;R=B({},R,j);break e;case 2:bn=!0}}c.callback!==null&&c.lane!==0&&(e.flags|=64,j=l.effects,j===null?l.effects=[c]:j.push(c))}else I={eventTime:I,lane:j,tag:c.tag,payload:c.payload,callback:c.callback,next:null},z===null?(w=z=I,p=R):z=z.next=I,i|=j;if(c=c.next,c===null){if(c=l.shared.pending,c===null)break;j=c,c=j.next,j.next=null,l.lastBaseUpdate=j,l.shared.pending=null}}while(!0);if(z===null&&(p=R),l.baseState=p,l.firstBaseUpdate=w,l.lastBaseUpdate=z,t=l.shared.interleaved,t!==null){l=t;do i|=l.lane,l=l.next;while(l!==t)}else a===null&&(l.shared.lanes=0);Xn|=i,e.lanes=i,e.memoizedState=R}}function zi(e,t,n){if(e=t.effects,t.effects=null,e!==null)for(t=0;t<e.length;t++){var r=e[t],l=r.callback;if(l!==null){if(r.callback=null,r=n,typeof l!="function")throw Error(s(191,l));l.call(r)}}}var ul={},Bt=_n(ul),cl=_n(ul),dl=_n(ul);function Gn(e){if(e===ul)throw Error(s(174));return e}function So(e,t){switch(ve(dl,t),ve(cl,e),ve(Bt,ul),e=t.nodeType,e){case 9:case 11:t=(t=t.documentElement)?t.namespaceURI:Dn(null,"");break;default:e=e===8?t.parentNode:t,t=e.namespaceURI||null,e=e.tagName,t=Dn(t,e)}ke(Bt),ve(Bt,t)}function Mr(){ke(Bt),ke(cl),ke(dl)}function Pi(e){Gn(dl.current);var t=Gn(Bt.current),n=Dn(t,e.type);t!==n&&(ve(cl,e),ve(Bt,n))}function Eo(e){cl.current===e&&(ke(Bt),ke(cl))}var Ce=_n(0);function ra(e){for(var t=e;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||n.data==="$?"||n.data==="$!"))return t}else if(t.tag===19&&t.memoizedProps.revealOrder!==void 0){if((t.flags&128)!==0)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var Co=[];function No(){for(var e=0;e<Co.length;e++)Co[e]._workInProgressVersionPrimary=null;Co.length=0}var la=be.ReactCurrentDispatcher,jo=be.ReactCurrentBatchConfig,qn=0,Ne=null,Re=null,Ae=null,aa=!1,pl=!1,fl=0,kd=0;function Qe(){throw Error(s(321))}function To(e,t){if(t===null)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!Tt(e[n],t[n]))return!1;return!0}function zo(e,t,n,r,l,a){if(qn=a,Ne=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,la.current=e===null||e.memoizedState===null?Cd:Nd,e=n(r,l),pl){a=0;do{if(pl=!1,fl=0,25<=a)throw Error(s(301));a+=1,Ae=Re=null,t.updateQueue=null,la.current=jd,e=n(r,l)}while(pl)}if(la.current=ia,t=Re!==null&&Re.next!==null,qn=0,Ae=Re=Ne=null,aa=!1,t)throw Error(s(300));return e}function Po(){var e=fl!==0;return fl=0,e}function Ut(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Ae===null?Ne.memoizedState=Ae=e:Ae=Ae.next=e,Ae}function yt(){if(Re===null){var e=Ne.alternate;e=e!==null?e.memoizedState:null}else e=Re.next;var t=Ae===null?Ne.memoizedState:Ae.next;if(t!==null)Ae=t,Re=e;else{if(e===null)throw Error(s(310));Re=e,e={memoizedState:Re.memoizedState,baseState:Re.baseState,baseQueue:Re.baseQueue,queue:Re.queue,next:null},Ae===null?Ne.memoizedState=Ae=e:Ae=Ae.next=e}return Ae}function gl(e,t){return typeof t=="function"?t(e):t}function Mo(e){var t=yt(),n=t.queue;if(n===null)throw Error(s(311));n.lastRenderedReducer=e;var r=Re,l=r.baseQueue,a=n.pending;if(a!==null){if(l!==null){var i=l.next;l.next=a.next,a.next=i}r.baseQueue=l=a,n.pending=null}if(l!==null){a=l.next,r=r.baseState;var c=i=null,p=null,w=a;do{var z=w.lane;if((qn&z)===z)p!==null&&(p=p.next={lane:0,action:w.action,hasEagerState:w.hasEagerState,eagerState:w.eagerState,next:null}),r=w.hasEagerState?w.eagerState:e(r,w.action);else{var R={lane:z,action:w.action,hasEagerState:w.hasEagerState,eagerState:w.eagerState,next:null};p===null?(c=p=R,i=r):p=p.next=R,Ne.lanes|=z,Xn|=z}w=w.next}while(w!==null&&w!==a);p===null?i=r:p.next=c,Tt(r,t.memoizedState)||(rt=!0),t.memoizedState=r,t.baseState=i,t.baseQueue=p,n.lastRenderedState=r}if(e=n.interleaved,e!==null){l=e;do a=l.lane,Ne.lanes|=a,Xn|=a,l=l.next;while(l!==e)}else l===null&&(n.lanes=0);return[t.memoizedState,n.dispatch]}function Lo(e){var t=yt(),n=t.queue;if(n===null)throw Error(s(311));n.lastRenderedReducer=e;var r=n.dispatch,l=n.pending,a=t.memoizedState;if(l!==null){n.pending=null;var i=l=l.next;do a=e(a,i.action),i=i.next;while(i!==l);Tt(a,t.memoizedState)||(rt=!0),t.memoizedState=a,t.baseQueue===null&&(t.baseState=a),n.lastRenderedState=a}return[a,r]}function Mi(){}function Li(e,t){var n=Ne,r=yt(),l=t(),a=!Tt(r.memoizedState,l);if(a&&(r.memoizedState=l,rt=!0),r=r.queue,Ro(Oi.bind(null,n,r,e),[e]),r.getSnapshot!==t||a||Ae!==null&&Ae.memoizedState.tag&1){if(n.flags|=2048,ml(9,Di.bind(null,n,r,l,t),void 0,null),Fe===null)throw Error(s(349));(qn&30)!==0||Ri(n,t,l)}return l}function Ri(e,t,n){e.flags|=16384,e={getSnapshot:t,value:n},t=Ne.updateQueue,t===null?(t={lastEffect:null,stores:null},Ne.updateQueue=t,t.stores=[e]):(n=t.stores,n===null?t.stores=[e]:n.push(e))}function Di(e,t,n,r){t.value=n,t.getSnapshot=r,$i(t)&&Ii(e)}function Oi(e,t,n){return n(function(){$i(t)&&Ii(e)})}function $i(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!Tt(e,n)}catch{return!0}}function Ii(e){var t=ln(e,1);t!==null&&Rt(t,e,1,-1)}function Ai(e){var t=Ut();return typeof e=="function"&&(e=e()),t.memoizedState=t.baseState=e,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:gl,lastRenderedState:e},t.queue=e,e=e.dispatch=Ed.bind(null,Ne,e),[t.memoizedState,e]}function ml(e,t,n,r){return e={tag:e,create:t,destroy:n,deps:r,next:null},t=Ne.updateQueue,t===null?(t={lastEffect:null,stores:null},Ne.updateQueue=t,t.lastEffect=e.next=e):(n=t.lastEffect,n===null?t.lastEffect=e.next=e:(r=n.next,n.next=e,e.next=r,t.lastEffect=e)),e}function Fi(){return yt().memoizedState}function oa(e,t,n,r){var l=Ut();Ne.flags|=e,l.memoizedState=ml(1|t,n,void 0,r===void 0?null:r)}function sa(e,t,n,r){var l=yt();r=r===void 0?null:r;var a=void 0;if(Re!==null){var i=Re.memoizedState;if(a=i.destroy,r!==null&&To(r,i.deps)){l.memoizedState=ml(t,n,a,r);return}}Ne.flags|=e,l.memoizedState=ml(1|t,n,a,r)}function Bi(e,t){return oa(8390656,8,e,t)}function Ro(e,t){return sa(2048,8,e,t)}function Ui(e,t){return sa(4,2,e,t)}function Vi(e,t){return sa(4,4,e,t)}function Wi(e,t){if(typeof t=="function")return e=e(),t(e),function(){t(null)};if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function Hi(e,t,n){return n=n!=null?n.concat([e]):null,sa(4,4,Wi.bind(null,t,e),n)}function Do(){}function Ki(e,t){var n=yt();t=t===void 0?null:t;var r=n.memoizedState;return r!==null&&t!==null&&To(t,r[1])?r[0]:(n.memoizedState=[e,t],e)}function Qi(e,t){var n=yt();t=t===void 0?null:t;var r=n.memoizedState;return r!==null&&t!==null&&To(t,r[1])?r[0]:(e=e(),n.memoizedState=[e,t],e)}function Ji(e,t,n){return(qn&21)===0?(e.baseState&&(e.baseState=!1,rt=!0),e.memoizedState=n):(Tt(n,t)||(n=Ss(),Ne.lanes|=n,Xn|=n,e.baseState=!0),t)}function bd(e,t){var n=he;he=n!==0&&4>n?n:4,e(!0);var r=jo.transition;jo.transition={};try{e(!1),t()}finally{he=n,jo.transition=r}}function Yi(){return yt().memoizedState}function Sd(e,t,n){var r=jn(e);if(n={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null},Gi(e))qi(t,n);else if(n=Ni(e,t,n,r),n!==null){var l=Xe();Rt(n,e,r,l),Xi(n,t,r)}}function Ed(e,t,n){var r=jn(e),l={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null};if(Gi(e))qi(t,l);else{var a=e.alternate;if(e.lanes===0&&(a===null||a.lanes===0)&&(a=t.lastRenderedReducer,a!==null))try{var i=t.lastRenderedState,c=a(i,n);if(l.hasEagerState=!0,l.eagerState=c,Tt(c,i)){var p=t.interleaved;p===null?(l.next=l,ko(t)):(l.next=p.next,p.next=l),t.interleaved=l;return}}catch{}finally{}n=Ni(e,t,l,r),n!==null&&(l=Xe(),Rt(n,e,r,l),Xi(n,t,r))}}function Gi(e){var t=e.alternate;return e===Ne||t!==null&&t===Ne}function qi(e,t){pl=aa=!0;var n=e.pending;n===null?t.next=t:(t.next=n.next,n.next=t),e.pending=t}function Xi(e,t,n){if((n&4194240)!==0){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,Oa(e,n)}}var ia={readContext:vt,useCallback:Qe,useContext:Qe,useEffect:Qe,useImperativeHandle:Qe,useInsertionEffect:Qe,useLayoutEffect:Qe,useMemo:Qe,useReducer:Qe,useRef:Qe,useState:Qe,useDebugValue:Qe,useDeferredValue:Qe,useTransition:Qe,useMutableSource:Qe,useSyncExternalStore:Qe,useId:Qe,unstable_isNewReconciler:!1},Cd={readContext:vt,useCallback:function(e,t){return Ut().memoizedState=[e,t===void 0?null:t],e},useContext:vt,useEffect:Bi,useImperativeHandle:function(e,t,n){return n=n!=null?n.concat([e]):null,oa(4194308,4,Wi.bind(null,t,e),n)},useLayoutEffect:function(e,t){return oa(4194308,4,e,t)},useInsertionEffect:function(e,t){return oa(4,2,e,t)},useMemo:function(e,t){var n=Ut();return t=t===void 0?null:t,e=e(),n.memoizedState=[e,t],e},useReducer:function(e,t,n){var r=Ut();return t=n!==void 0?n(t):t,r.memoizedState=r.baseState=t,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:t},r.queue=e,e=e.dispatch=Sd.bind(null,Ne,e),[r.memoizedState,e]},useRef:function(e){var t=Ut();return e={current:e},t.memoizedState=e},useState:Ai,useDebugValue:Do,useDeferredValue:function(e){return Ut().memoizedState=e},useTransition:function(){var e=Ai(!1),t=e[0];return e=bd.bind(null,e[1]),Ut().memoizedState=e,[t,e]},useMutableSource:function(){},useSyncExternalStore:function(e,t,n){var r=Ne,l=Ut();if(Se){if(n===void 0)throw Error(s(407));n=n()}else{if(n=t(),Fe===null)throw Error(s(349));(qn&30)!==0||Ri(r,t,n)}l.memoizedState=n;var a={value:n,getSnapshot:t};return l.queue=a,Bi(Oi.bind(null,r,a,e),[e]),r.flags|=2048,ml(9,Di.bind(null,r,a,n,t),void 0,null),n},useId:function(){var e=Ut(),t=Fe.identifierPrefix;if(Se){var n=rn,r=nn;n=(r&~(1<<32-q(r)-1)).toString(32)+n,t=":"+t+"R"+n,n=fl++,0<n&&(t+="H"+n.toString(32)),t+=":"}else n=kd++,t=":"+t+"r"+n.toString(32)+":";return e.memoizedState=t},unstable_isNewReconciler:!1},Nd={readContext:vt,useCallback:Ki,useContext:vt,useEffect:Ro,useImperativeHandle:Hi,useInsertionEffect:Ui,useLayoutEffect:Vi,useMemo:Qi,useReducer:Mo,useRef:Fi,useState:function(){return Mo(gl)},useDebugValue:Do,useDeferredValue:function(e){var t=yt();return Ji(t,Re.memoizedState,e)},useTransition:function(){var e=Mo(gl)[0],t=yt().memoizedState;return[e,t]},useMutableSource:Mi,useSyncExternalStore:Li,useId:Yi,unstable_isNewReconciler:!1},jd={readContext:vt,useCallback:Ki,useContext:vt,useEffect:Ro,useImperativeHandle:Hi,useInsertionEffect:Ui,useLayoutEffect:Vi,useMemo:Qi,useReducer:Lo,useRef:Fi,useState:function(){return Lo(gl)},useDebugValue:Do,useDeferredValue:function(e){var t=yt();return Re===null?t.memoizedState=e:Ji(t,Re.memoizedState,e)},useTransition:function(){var e=Lo(gl)[0],t=yt().memoizedState;return[e,t]},useMutableSource:Mi,useSyncExternalStore:Li,useId:Yi,unstable_isNewReconciler:!1};function Pt(e,t){if(e&&e.defaultProps){t=B({},t),e=e.defaultProps;for(var n in e)t[n]===void 0&&(t[n]=e[n]);return t}return t}function Oo(e,t,n,r){t=e.memoizedState,n=n(r,t),n=n==null?t:B({},t,n),e.memoizedState=n,e.lanes===0&&(e.updateQueue.baseState=n)}var ua={isMounted:function(e){return(e=e._reactInternals)?Zt(e)===e:!1},enqueueSetState:function(e,t,n){e=e._reactInternals;var r=Xe(),l=jn(e),a=an(r,l);a.payload=t,n!=null&&(a.callback=n),t=Sn(e,a,l),t!==null&&(Rt(t,e,l,r),ta(t,e,l))},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var r=Xe(),l=jn(e),a=an(r,l);a.tag=1,a.payload=t,n!=null&&(a.callback=n),t=Sn(e,a,l),t!==null&&(Rt(t,e,l,r),ta(t,e,l))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=Xe(),r=jn(e),l=an(n,r);l.tag=2,t!=null&&(l.callback=t),t=Sn(e,l,r),t!==null&&(Rt(t,e,r,n),ta(t,e,r))}};function Zi(e,t,n,r,l,a,i){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(r,a,i):t.prototype&&t.prototype.isPureReactComponent?!tl(n,r)||!tl(l,a):!0}function eu(e,t,n){var r=!1,l=wn,a=t.contextType;return typeof a=="object"&&a!==null?a=vt(a):(l=nt(t)?Kn:Ke.current,r=t.contextTypes,a=(r=r!=null)?Er(e,l):wn),t=new t(n,a),e.memoizedState=t.state!==null&&t.state!==void 0?t.state:null,t.updater=ua,e.stateNode=t,t._reactInternals=e,r&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=l,e.__reactInternalMemoizedMaskedChildContext=a),t}function tu(e,t,n,r){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(n,r),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(n,r),t.state!==e&&ua.enqueueReplaceState(t,t.state,null)}function $o(e,t,n,r){var l=e.stateNode;l.props=n,l.state=e.memoizedState,l.refs={},bo(e);var a=t.contextType;typeof a=="object"&&a!==null?l.context=vt(a):(a=nt(t)?Kn:Ke.current,l.context=Er(e,a)),l.state=e.memoizedState,a=t.getDerivedStateFromProps,typeof a=="function"&&(Oo(e,t,a,n),l.state=e.memoizedState),typeof t.getDerivedStateFromProps=="function"||typeof l.getSnapshotBeforeUpdate=="function"||typeof l.UNSAFE_componentWillMount!="function"&&typeof l.componentWillMount!="function"||(t=l.state,typeof l.componentWillMount=="function"&&l.componentWillMount(),typeof l.UNSAFE_componentWillMount=="function"&&l.UNSAFE_componentWillMount(),t!==l.state&&ua.enqueueReplaceState(l,l.state,null),na(e,n,l,r),l.state=e.memoizedState),typeof l.componentDidMount=="function"&&(e.flags|=4194308)}function Lr(e,t){try{var n="",r=t;do n+=oe(r),r=r.return;while(r);var l=n}catch(a){l=`
Error generating stack: `+a.message+`
`+a.stack}return{value:e,source:t,stack:l,digest:null}}function Io(e,t,n){return{value:e,source:null,stack:n??null,digest:t??null}}function Ao(e,t){try{console.error(t.value)}catch(n){setTimeout(function(){throw n})}}var Td=typeof WeakMap=="function"?WeakMap:Map;function nu(e,t,n){n=an(-1,n),n.tag=3,n.payload={element:null};var r=t.value;return n.callback=function(){ha||(ha=!0,es=r),Ao(e,t)},n}function ru(e,t,n){n=an(-1,n),n.tag=3;var r=e.type.getDerivedStateFromError;if(typeof r=="function"){var l=t.value;n.payload=function(){return r(l)},n.callback=function(){Ao(e,t)}}var a=e.stateNode;return a!==null&&typeof a.componentDidCatch=="function"&&(n.callback=function(){Ao(e,t),typeof r!="function"&&(Cn===null?Cn=new Set([this]):Cn.add(this));var i=t.stack;this.componentDidCatch(t.value,{componentStack:i!==null?i:""})}),n}function lu(e,t,n){var r=e.pingCache;if(r===null){r=e.pingCache=new Td;var l=new Set;r.set(t,l)}else l=r.get(t),l===void 0&&(l=new Set,r.set(t,l));l.has(n)||(l.add(n),e=Vd.bind(null,e,t,n),t.then(e,e))}function au(e){do{var t;if((t=e.tag===13)&&(t=e.memoizedState,t=t!==null?t.dehydrated!==null:!0),t)return e;e=e.return}while(e!==null);return null}function ou(e,t,n,r,l){return(e.mode&1)===0?(e===t?e.flags|=65536:(e.flags|=128,n.flags|=131072,n.flags&=-52805,n.tag===1&&(n.alternate===null?n.tag=17:(t=an(-1,1),t.tag=2,Sn(n,t,1))),n.lanes|=1),e):(e.flags|=65536,e.lanes=l,e)}var zd=be.ReactCurrentOwner,rt=!1;function qe(e,t,n,r){t.child=e===null?Ci(t,null,n,r):Tr(t,e.child,n,r)}function su(e,t,n,r,l){n=n.render;var a=t.ref;return Pr(t,l),r=zo(e,t,n,r,a,l),n=Po(),e!==null&&!rt?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~l,on(e,t,l)):(Se&&n&&fo(t),t.flags|=1,qe(e,t,r,l),t.child)}function iu(e,t,n,r,l){if(e===null){var a=n.type;return typeof a=="function"&&!ss(a)&&a.defaultProps===void 0&&n.compare===null&&n.defaultProps===void 0?(t.tag=15,t.type=a,uu(e,t,a,r,l)):(e=ka(n.type,null,r,t,t.mode,l),e.ref=t.ref,e.return=t,t.child=e)}if(a=e.child,(e.lanes&l)===0){var i=a.memoizedProps;if(n=n.compare,n=n!==null?n:tl,n(i,r)&&e.ref===t.ref)return on(e,t,l)}return t.flags|=1,e=zn(a,r),e.ref=t.ref,e.return=t,t.child=e}function uu(e,t,n,r,l){if(e!==null){var a=e.memoizedProps;if(tl(a,r)&&e.ref===t.ref)if(rt=!1,t.pendingProps=r=a,(e.lanes&l)!==0)(e.flags&131072)!==0&&(rt=!0);else return t.lanes=e.lanes,on(e,t,l)}return Fo(e,t,n,r,l)}function cu(e,t,n){var r=t.pendingProps,l=r.children,a=e!==null?e.memoizedState:null;if(r.mode==="hidden")if((t.mode&1)===0)t.memoizedState={baseLanes:0,cachePool:null,transitions:null},ve(Dr,pt),pt|=n;else{if((n&1073741824)===0)return e=a!==null?a.baseLanes|n:n,t.lanes=t.childLanes=1073741824,t.memoizedState={baseLanes:e,cachePool:null,transitions:null},t.updateQueue=null,ve(Dr,pt),pt|=e,null;t.memoizedState={baseLanes:0,cachePool:null,transitions:null},r=a!==null?a.baseLanes:n,ve(Dr,pt),pt|=r}else a!==null?(r=a.baseLanes|n,t.memoizedState=null):r=n,ve(Dr,pt),pt|=r;return qe(e,t,l,n),t.child}function du(e,t){var n=t.ref;(e===null&&n!==null||e!==null&&e.ref!==n)&&(t.flags|=512,t.flags|=2097152)}function Fo(e,t,n,r,l){var a=nt(n)?Kn:Ke.current;return a=Er(t,a),Pr(t,l),n=zo(e,t,n,r,a,l),r=Po(),e!==null&&!rt?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~l,on(e,t,l)):(Se&&r&&fo(t),t.flags|=1,qe(e,t,n,l),t.child)}function pu(e,t,n,r,l){if(nt(n)){var a=!0;Ql(t)}else a=!1;if(Pr(t,l),t.stateNode===null)da(e,t),eu(t,n,r),$o(t,n,r,l),r=!0;else if(e===null){var i=t.stateNode,c=t.memoizedProps;i.props=c;var p=i.context,w=n.contextType;typeof w=="object"&&w!==null?w=vt(w):(w=nt(n)?Kn:Ke.current,w=Er(t,w));var z=n.getDerivedStateFromProps,R=typeof z=="function"||typeof i.getSnapshotBeforeUpdate=="function";R||typeof i.UNSAFE_componentWillReceiveProps!="function"&&typeof i.componentWillReceiveProps!="function"||(c!==r||p!==w)&&tu(t,i,r,w),bn=!1;var j=t.memoizedState;i.state=j,na(t,r,i,l),p=t.memoizedState,c!==r||j!==p||tt.current||bn?(typeof z=="function"&&(Oo(t,n,z,r),p=t.memoizedState),(c=bn||Zi(t,n,c,r,j,p,w))?(R||typeof i.UNSAFE_componentWillMount!="function"&&typeof i.componentWillMount!="function"||(typeof i.componentWillMount=="function"&&i.componentWillMount(),typeof i.UNSAFE_componentWillMount=="function"&&i.UNSAFE_componentWillMount()),typeof i.componentDidMount=="function"&&(t.flags|=4194308)):(typeof i.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=r,t.memoizedState=p),i.props=r,i.state=p,i.context=w,r=c):(typeof i.componentDidMount=="function"&&(t.flags|=4194308),r=!1)}else{i=t.stateNode,ji(e,t),c=t.memoizedProps,w=t.type===t.elementType?c:Pt(t.type,c),i.props=w,R=t.pendingProps,j=i.context,p=n.contextType,typeof p=="object"&&p!==null?p=vt(p):(p=nt(n)?Kn:Ke.current,p=Er(t,p));var I=n.getDerivedStateFromProps;(z=typeof I=="function"||typeof i.getSnapshotBeforeUpdate=="function")||typeof i.UNSAFE_componentWillReceiveProps!="function"&&typeof i.componentWillReceiveProps!="function"||(c!==R||j!==p)&&tu(t,i,r,p),bn=!1,j=t.memoizedState,i.state=j,na(t,r,i,l);var W=t.memoizedState;c!==R||j!==W||tt.current||bn?(typeof I=="function"&&(Oo(t,n,I,r),W=t.memoizedState),(w=bn||Zi(t,n,w,r,j,W,p)||!1)?(z||typeof i.UNSAFE_componentWillUpdate!="function"&&typeof i.componentWillUpdate!="function"||(typeof i.componentWillUpdate=="function"&&i.componentWillUpdate(r,W,p),typeof i.UNSAFE_componentWillUpdate=="function"&&i.UNSAFE_componentWillUpdate(r,W,p)),typeof i.componentDidUpdate=="function"&&(t.flags|=4),typeof i.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof i.componentDidUpdate!="function"||c===e.memoizedProps&&j===e.memoizedState||(t.flags|=4),typeof i.getSnapshotBeforeUpdate!="function"||c===e.memoizedProps&&j===e.memoizedState||(t.flags|=1024),t.memoizedProps=r,t.memoizedState=W),i.props=r,i.state=W,i.context=p,r=w):(typeof i.componentDidUpdate!="function"||c===e.memoizedProps&&j===e.memoizedState||(t.flags|=4),typeof i.getSnapshotBeforeUpdate!="function"||c===e.memoizedProps&&j===e.memoizedState||(t.flags|=1024),r=!1)}return Bo(e,t,n,r,a,l)}function Bo(e,t,n,r,l,a){du(e,t);var i=(t.flags&128)!==0;if(!r&&!i)return l&&xi(t,n,!1),on(e,t,a);r=t.stateNode,zd.current=t;var c=i&&typeof n.getDerivedStateFromError!="function"?null:r.render();return t.flags|=1,e!==null&&i?(t.child=Tr(t,e.child,null,a),t.child=Tr(t,null,c,a)):qe(e,t,c,a),t.memoizedState=r.state,l&&xi(t,n,!0),t.child}function fu(e){var t=e.stateNode;t.pendingContext?mi(e,t.pendingContext,t.pendingContext!==t.context):t.context&&mi(e,t.context,!1),So(e,t.containerInfo)}function gu(e,t,n,r,l){return jr(),xo(l),t.flags|=256,qe(e,t,n,r),t.child}var Uo={dehydrated:null,treeContext:null,retryLane:0};function Vo(e){return{baseLanes:e,cachePool:null,transitions:null}}function mu(e,t,n){var r=t.pendingProps,l=Ce.current,a=!1,i=(t.flags&128)!==0,c;if((c=i)||(c=e!==null&&e.memoizedState===null?!1:(l&2)!==0),c?(a=!0,t.flags&=-129):(e===null||e.memoizedState!==null)&&(l|=1),ve(Ce,l&1),e===null)return ho(t),e=t.memoizedState,e!==null&&(e=e.dehydrated,e!==null)?((t.mode&1)===0?t.lanes=1:e.data==="$!"?t.lanes=8:t.lanes=1073741824,null):(i=r.children,e=r.fallback,a?(r=t.mode,a=t.child,i={mode:"hidden",children:i},(r&1)===0&&a!==null?(a.childLanes=0,a.pendingProps=i):a=ba(i,r,0,null),e=nr(e,r,n,null),a.return=t,e.return=t,a.sibling=e,t.child=a,t.child.memoizedState=Vo(n),t.memoizedState=Uo,e):Wo(t,i));if(l=e.memoizedState,l!==null&&(c=l.dehydrated,c!==null))return Pd(e,t,i,r,c,l,n);if(a){a=r.fallback,i=t.mode,l=e.child,c=l.sibling;var p={mode:"hidden",children:r.children};return(i&1)===0&&t.child!==l?(r=t.child,r.childLanes=0,r.pendingProps=p,t.deletions=null):(r=zn(l,p),r.subtreeFlags=l.subtreeFlags&14680064),c!==null?a=zn(c,a):(a=nr(a,i,n,null),a.flags|=2),a.return=t,r.return=t,r.sibling=a,t.child=r,r=a,a=t.child,i=e.child.memoizedState,i=i===null?Vo(n):{baseLanes:i.baseLanes|n,cachePool:null,transitions:i.transitions},a.memoizedState=i,a.childLanes=e.childLanes&~n,t.memoizedState=Uo,r}return a=e.child,e=a.sibling,r=zn(a,{mode:"visible",children:r.children}),(t.mode&1)===0&&(r.lanes=n),r.return=t,r.sibling=null,e!==null&&(n=t.deletions,n===null?(t.deletions=[e],t.flags|=16):n.push(e)),t.child=r,t.memoizedState=null,r}function Wo(e,t){return t=ba({mode:"visible",children:t},e.mode,0,null),t.return=e,e.child=t}function ca(e,t,n,r){return r!==null&&xo(r),Tr(t,e.child,null,n),e=Wo(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function Pd(e,t,n,r,l,a,i){if(n)return t.flags&256?(t.flags&=-257,r=Io(Error(s(422))),ca(e,t,i,r)):t.memoizedState!==null?(t.child=e.child,t.flags|=128,null):(a=r.fallback,l=t.mode,r=ba({mode:"visible",children:r.children},l,0,null),a=nr(a,l,i,null),a.flags|=2,r.return=t,a.return=t,r.sibling=a,t.child=r,(t.mode&1)!==0&&Tr(t,e.child,null,i),t.child.memoizedState=Vo(i),t.memoizedState=Uo,a);if((t.mode&1)===0)return ca(e,t,i,null);if(l.data==="$!"){if(r=l.nextSibling&&l.nextSibling.dataset,r)var c=r.dgst;return r=c,a=Error(s(419)),r=Io(a,r,void 0),ca(e,t,i,r)}if(c=(i&e.childLanes)!==0,rt||c){if(r=Fe,r!==null){switch(i&-i){case 4:l=2;break;case 16:l=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:l=32;break;case 536870912:l=268435456;break;default:l=0}l=(l&(r.suspendedLanes|i))!==0?0:l,l!==0&&l!==a.retryLane&&(a.retryLane=l,ln(e,l),Rt(r,e,l,-1))}return os(),r=Io(Error(s(421))),ca(e,t,i,r)}return l.data==="$?"?(t.flags|=128,t.child=e.child,t=Wd.bind(null,e),l._reactRetry=t,null):(e=a.treeContext,dt=yn(l.nextSibling),ct=t,Se=!0,zt=null,e!==null&&(ht[xt++]=nn,ht[xt++]=rn,ht[xt++]=Qn,nn=e.id,rn=e.overflow,Qn=t),t=Wo(t,r.children),t.flags|=4096,t)}function hu(e,t,n){e.lanes|=t;var r=e.alternate;r!==null&&(r.lanes|=t),wo(e.return,t,n)}function Ho(e,t,n,r,l){var a=e.memoizedState;a===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:r,tail:n,tailMode:l}:(a.isBackwards=t,a.rendering=null,a.renderingStartTime=0,a.last=r,a.tail=n,a.tailMode=l)}function xu(e,t,n){var r=t.pendingProps,l=r.revealOrder,a=r.tail;if(qe(e,t,r.children,n),r=Ce.current,(r&2)!==0)r=r&1|2,t.flags|=128;else{if(e!==null&&(e.flags&128)!==0)e:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&hu(e,n,t);else if(e.tag===19)hu(e,n,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}r&=1}if(ve(Ce,r),(t.mode&1)===0)t.memoizedState=null;else switch(l){case"forwards":for(n=t.child,l=null;n!==null;)e=n.alternate,e!==null&&ra(e)===null&&(l=n),n=n.sibling;n=l,n===null?(l=t.child,t.child=null):(l=n.sibling,n.sibling=null),Ho(t,!1,l,n,a);break;case"backwards":for(n=null,l=t.child,t.child=null;l!==null;){if(e=l.alternate,e!==null&&ra(e)===null){t.child=l;break}e=l.sibling,l.sibling=n,n=l,l=e}Ho(t,!0,n,null,a);break;case"together":Ho(t,!1,null,null,void 0);break;default:t.memoizedState=null}return t.child}function da(e,t){(t.mode&1)===0&&e!==null&&(e.alternate=null,t.alternate=null,t.flags|=2)}function on(e,t,n){if(e!==null&&(t.dependencies=e.dependencies),Xn|=t.lanes,(n&t.childLanes)===0)return null;if(e!==null&&t.child!==e.child)throw Error(s(153));if(t.child!==null){for(e=t.child,n=zn(e,e.pendingProps),t.child=n,n.return=t;e.sibling!==null;)e=e.sibling,n=n.sibling=zn(e,e.pendingProps),n.return=t;n.sibling=null}return t.child}function Md(e,t,n){switch(t.tag){case 3:fu(t),jr();break;case 5:Pi(t);break;case 1:nt(t.type)&&Ql(t);break;case 4:So(t,t.stateNode.containerInfo);break;case 10:var r=t.type._context,l=t.memoizedProps.value;ve(Zl,r._currentValue),r._currentValue=l;break;case 13:if(r=t.memoizedState,r!==null)return r.dehydrated!==null?(ve(Ce,Ce.current&1),t.flags|=128,null):(n&t.child.childLanes)!==0?mu(e,t,n):(ve(Ce,Ce.current&1),e=on(e,t,n),e!==null?e.sibling:null);ve(Ce,Ce.current&1);break;case 19:if(r=(n&t.childLanes)!==0,(e.flags&128)!==0){if(r)return xu(e,t,n);t.flags|=128}if(l=t.memoizedState,l!==null&&(l.rendering=null,l.tail=null,l.lastEffect=null),ve(Ce,Ce.current),r)break;return null;case 22:case 23:return t.lanes=0,cu(e,t,n)}return on(e,t,n)}var vu,Ko,yu,_u;vu=function(e,t){for(var n=t.child;n!==null;){if(n.tag===5||n.tag===6)e.appendChild(n.stateNode);else if(n.tag!==4&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===t)break;for(;n.sibling===null;){if(n.return===null||n.return===t)return;n=n.return}n.sibling.return=n.return,n=n.sibling}},Ko=function(){},yu=function(e,t,n,r){var l=e.memoizedProps;if(l!==r){e=t.stateNode,Gn(Bt.current);var a=null;switch(n){case"input":l=Ir(e,l),r=Ir(e,r),a=[];break;case"select":l=B({},l,{value:void 0}),r=B({},r,{value:void 0}),a=[];break;case"textarea":l=Ze(e,l),r=Ze(e,r),a=[];break;default:typeof l.onClick!="function"&&typeof r.onClick=="function"&&(e.onclick=Wl)}ar(n,r);var i;n=null;for(w in l)if(!r.hasOwnProperty(w)&&l.hasOwnProperty(w)&&l[w]!=null)if(w==="style"){var c=l[w];for(i in c)c.hasOwnProperty(i)&&(n||(n={}),n[i]="")}else w!=="dangerouslySetInnerHTML"&&w!=="children"&&w!=="suppressContentEditableWarning"&&w!=="suppressHydrationWarning"&&w!=="autoFocus"&&(m.hasOwnProperty(w)?a||(a=[]):(a=a||[]).push(w,null));for(w in r){var p=r[w];if(c=l!=null?l[w]:void 0,r.hasOwnProperty(w)&&p!==c&&(p!=null||c!=null))if(w==="style")if(c){for(i in c)!c.hasOwnProperty(i)||p&&p.hasOwnProperty(i)||(n||(n={}),n[i]="");for(i in p)p.hasOwnProperty(i)&&c[i]!==p[i]&&(n||(n={}),n[i]=p[i])}else n||(a||(a=[]),a.push(w,n)),n=p;else w==="dangerouslySetInnerHTML"?(p=p?p.__html:void 0,c=c?c.__html:void 0,p!=null&&c!==p&&(a=a||[]).push(w,p)):w==="children"?typeof p!="string"&&typeof p!="number"||(a=a||[]).push(w,""+p):w!=="suppressContentEditableWarning"&&w!=="suppressHydrationWarning"&&(m.hasOwnProperty(w)?(p!=null&&w==="onScroll"&&we("scroll",e),a||c===p||(a=[])):(a=a||[]).push(w,p))}n&&(a=a||[]).push("style",n);var w=a;(t.updateQueue=w)&&(t.flags|=4)}},_u=function(e,t,n,r){n!==r&&(t.flags|=4)};function hl(e,t){if(!Se)switch(e.tailMode){case"hidden":t=e.tail;for(var n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?e.tail=null:n.sibling=null;break;case"collapsed":n=e.tail;for(var r=null;n!==null;)n.alternate!==null&&(r=n),n=n.sibling;r===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:r.sibling=null}}function Je(e){var t=e.alternate!==null&&e.alternate.child===e.child,n=0,r=0;if(t)for(var l=e.child;l!==null;)n|=l.lanes|l.childLanes,r|=l.subtreeFlags&14680064,r|=l.flags&14680064,l.return=e,l=l.sibling;else for(l=e.child;l!==null;)n|=l.lanes|l.childLanes,r|=l.subtreeFlags,r|=l.flags,l.return=e,l=l.sibling;return e.subtreeFlags|=r,e.childLanes=n,t}function Ld(e,t,n){var r=t.pendingProps;switch(go(t),t.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Je(t),null;case 1:return nt(t.type)&&Kl(),Je(t),null;case 3:return r=t.stateNode,Mr(),ke(tt),ke(Ke),No(),r.pendingContext&&(r.context=r.pendingContext,r.pendingContext=null),(e===null||e.child===null)&&(ql(t)?t.flags|=4:e===null||e.memoizedState.isDehydrated&&(t.flags&256)===0||(t.flags|=1024,zt!==null&&(rs(zt),zt=null))),Ko(e,t),Je(t),null;case 5:Eo(t);var l=Gn(dl.current);if(n=t.type,e!==null&&t.stateNode!=null)yu(e,t,n,r,l),e.ref!==t.ref&&(t.flags|=512,t.flags|=2097152);else{if(!r){if(t.stateNode===null)throw Error(s(166));return Je(t),null}if(e=Gn(Bt.current),ql(t)){r=t.stateNode,n=t.type;var a=t.memoizedProps;switch(r[Ft]=t,r[ol]=a,e=(t.mode&1)!==0,n){case"dialog":we("cancel",r),we("close",r);break;case"iframe":case"object":case"embed":we("load",r);break;case"video":case"audio":for(l=0;l<rl.length;l++)we(rl[l],r);break;case"source":we("error",r);break;case"img":case"image":case"link":we("error",r),we("load",r);break;case"details":we("toggle",r);break;case"input":$t(r,a),we("invalid",r);break;case"select":r._wrapperState={wasMultiple:!!a.multiple},we("invalid",r);break;case"textarea":Rn(r,a),we("invalid",r)}ar(n,a),l=null;for(var i in a)if(a.hasOwnProperty(i)){var c=a[i];i==="children"?typeof c=="string"?r.textContent!==c&&(a.suppressHydrationWarning!==!0&&Vl(r.textContent,c,e),l=["children",c]):typeof c=="number"&&r.textContent!==""+c&&(a.suppressHydrationWarning!==!0&&Vl(r.textContent,c,e),l=["children",""+c]):m.hasOwnProperty(i)&&c!=null&&i==="onScroll"&&we("scroll",r)}switch(n){case"input":Ln(r),Wt(r,a,!0);break;case"textarea":Ln(r),lr(r);break;case"select":case"option":break;default:typeof a.onClick=="function"&&(r.onclick=Wl)}r=l,t.updateQueue=r,r!==null&&(t.flags|=4)}else{i=l.nodeType===9?l:l.ownerDocument,e==="http://www.w3.org/1999/xhtml"&&(e=Ie(n)),e==="http://www.w3.org/1999/xhtml"?n==="script"?(e=i.createElement("div"),e.innerHTML="<script><\/script>",e=e.removeChild(e.firstChild)):typeof r.is=="string"?e=i.createElement(n,{is:r.is}):(e=i.createElement(n),n==="select"&&(i=e,r.multiple?i.multiple=!0:r.size&&(i.size=r.size))):e=i.createElementNS(e,n),e[Ft]=t,e[ol]=r,vu(e,t,!1,!1),t.stateNode=e;e:{switch(i=Ar(n,r),n){case"dialog":we("cancel",e),we("close",e),l=r;break;case"iframe":case"object":case"embed":we("load",e),l=r;break;case"video":case"audio":for(l=0;l<rl.length;l++)we(rl[l],e);l=r;break;case"source":we("error",e),l=r;break;case"img":case"image":case"link":we("error",e),we("load",e),l=r;break;case"details":we("toggle",e),l=r;break;case"input":$t(e,r),l=Ir(e,r),we("invalid",e);break;case"option":l=r;break;case"select":e._wrapperState={wasMultiple:!!r.multiple},l=B({},r,{value:void 0}),we("invalid",e);break;case"textarea":Rn(e,r),l=Ze(e,r),we("invalid",e);break;default:l=r}ar(n,l),c=l;for(a in c)if(c.hasOwnProperty(a)){var p=c[a];a==="style"?In(e,p):a==="dangerouslySetInnerHTML"?(p=p?p.__html:void 0,p!=null&&$n(e,p)):a==="children"?typeof p=="string"?(n!=="textarea"||p!=="")&&Et(e,p):typeof p=="number"&&Et(e,""+p):a!=="suppressContentEditableWarning"&&a!=="suppressHydrationWarning"&&a!=="autoFocus"&&(m.hasOwnProperty(a)?p!=null&&a==="onScroll"&&we("scroll",e):p!=null&&ze(e,a,p,i))}switch(n){case"input":Ln(e),Wt(e,r,!1);break;case"textarea":Ln(e),lr(e);break;case"option":r.value!=null&&e.setAttribute("value",""+fe(r.value));break;case"select":e.multiple=!!r.multiple,a=r.value,a!=null?Ht(e,!!r.multiple,a,!1):r.defaultValue!=null&&Ht(e,!!r.multiple,r.defaultValue,!0);break;default:typeof l.onClick=="function"&&(e.onclick=Wl)}switch(n){case"button":case"input":case"select":case"textarea":r=!!r.autoFocus;break e;case"img":r=!0;break e;default:r=!1}}r&&(t.flags|=4)}t.ref!==null&&(t.flags|=512,t.flags|=2097152)}return Je(t),null;case 6:if(e&&t.stateNode!=null)_u(e,t,e.memoizedProps,r);else{if(typeof r!="string"&&t.stateNode===null)throw Error(s(166));if(n=Gn(dl.current),Gn(Bt.current),ql(t)){if(r=t.stateNode,n=t.memoizedProps,r[Ft]=t,(a=r.nodeValue!==n)&&(e=ct,e!==null))switch(e.tag){case 3:Vl(r.nodeValue,n,(e.mode&1)!==0);break;case 5:e.memoizedProps.suppressHydrationWarning!==!0&&Vl(r.nodeValue,n,(e.mode&1)!==0)}a&&(t.flags|=4)}else r=(n.nodeType===9?n:n.ownerDocument).createTextNode(r),r[Ft]=t,t.stateNode=r}return Je(t),null;case 13:if(ke(Ce),r=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(Se&&dt!==null&&(t.mode&1)!==0&&(t.flags&128)===0)bi(),jr(),t.flags|=98560,a=!1;else if(a=ql(t),r!==null&&r.dehydrated!==null){if(e===null){if(!a)throw Error(s(318));if(a=t.memoizedState,a=a!==null?a.dehydrated:null,!a)throw Error(s(317));a[Ft]=t}else jr(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;Je(t),a=!1}else zt!==null&&(rs(zt),zt=null),a=!0;if(!a)return t.flags&65536?t:null}return(t.flags&128)!==0?(t.lanes=n,t):(r=r!==null,r!==(e!==null&&e.memoizedState!==null)&&r&&(t.child.flags|=8192,(t.mode&1)!==0&&(e===null||(Ce.current&1)!==0?De===0&&(De=3):os())),t.updateQueue!==null&&(t.flags|=4),Je(t),null);case 4:return Mr(),Ko(e,t),e===null&&ll(t.stateNode.containerInfo),Je(t),null;case 10:return _o(t.type._context),Je(t),null;case 17:return nt(t.type)&&Kl(),Je(t),null;case 19:if(ke(Ce),a=t.memoizedState,a===null)return Je(t),null;if(r=(t.flags&128)!==0,i=a.rendering,i===null)if(r)hl(a,!1);else{if(De!==0||e!==null&&(e.flags&128)!==0)for(e=t.child;e!==null;){if(i=ra(e),i!==null){for(t.flags|=128,hl(a,!1),r=i.updateQueue,r!==null&&(t.updateQueue=r,t.flags|=4),t.subtreeFlags=0,r=n,n=t.child;n!==null;)a=n,e=r,a.flags&=14680066,i=a.alternate,i===null?(a.childLanes=0,a.lanes=e,a.child=null,a.subtreeFlags=0,a.memoizedProps=null,a.memoizedState=null,a.updateQueue=null,a.dependencies=null,a.stateNode=null):(a.childLanes=i.childLanes,a.lanes=i.lanes,a.child=i.child,a.subtreeFlags=0,a.deletions=null,a.memoizedProps=i.memoizedProps,a.memoizedState=i.memoizedState,a.updateQueue=i.updateQueue,a.type=i.type,e=i.dependencies,a.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext}),n=n.sibling;return ve(Ce,Ce.current&1|2),t.child}e=e.sibling}a.tail!==null&&Ee()>Or&&(t.flags|=128,r=!0,hl(a,!1),t.lanes=4194304)}else{if(!r)if(e=ra(i),e!==null){if(t.flags|=128,r=!0,n=e.updateQueue,n!==null&&(t.updateQueue=n,t.flags|=4),hl(a,!0),a.tail===null&&a.tailMode==="hidden"&&!i.alternate&&!Se)return Je(t),null}else 2*Ee()-a.renderingStartTime>Or&&n!==1073741824&&(t.flags|=128,r=!0,hl(a,!1),t.lanes=4194304);a.isBackwards?(i.sibling=t.child,t.child=i):(n=a.last,n!==null?n.sibling=i:t.child=i,a.last=i)}return a.tail!==null?(t=a.tail,a.rendering=t,a.tail=t.sibling,a.renderingStartTime=Ee(),t.sibling=null,n=Ce.current,ve(Ce,r?n&1|2:n&1),t):(Je(t),null);case 22:case 23:return as(),r=t.memoizedState!==null,e!==null&&e.memoizedState!==null!==r&&(t.flags|=8192),r&&(t.mode&1)!==0?(pt&1073741824)!==0&&(Je(t),t.subtreeFlags&6&&(t.flags|=8192)):Je(t),null;case 24:return null;case 25:return null}throw Error(s(156,t.tag))}function Rd(e,t){switch(go(t),t.tag){case 1:return nt(t.type)&&Kl(),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return Mr(),ke(tt),ke(Ke),No(),e=t.flags,(e&65536)!==0&&(e&128)===0?(t.flags=e&-65537|128,t):null;case 5:return Eo(t),null;case 13:if(ke(Ce),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(s(340));jr()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return ke(Ce),null;case 4:return Mr(),null;case 10:return _o(t.type._context),null;case 22:case 23:return as(),null;case 24:return null;default:return null}}var pa=!1,Ye=!1,Dd=typeof WeakSet=="function"?WeakSet:Set,U=null;function Rr(e,t){var n=e.ref;if(n!==null)if(typeof n=="function")try{n(null)}catch(r){je(e,t,r)}else n.current=null}function Qo(e,t,n){try{n()}catch(r){je(e,t,r)}}var wu=!1;function Od(e,t){if(lo=Ml,e=Zs(),Ga(e)){if("selectionStart"in e)var n={start:e.selectionStart,end:e.selectionEnd};else e:{n=(n=e.ownerDocument)&&n.defaultView||window;var r=n.getSelection&&n.getSelection();if(r&&r.rangeCount!==0){n=r.anchorNode;var l=r.anchorOffset,a=r.focusNode;r=r.focusOffset;try{n.nodeType,a.nodeType}catch{n=null;break e}var i=0,c=-1,p=-1,w=0,z=0,R=e,j=null;t:for(;;){for(var I;R!==n||l!==0&&R.nodeType!==3||(c=i+l),R!==a||r!==0&&R.nodeType!==3||(p=i+r),R.nodeType===3&&(i+=R.nodeValue.length),(I=R.firstChild)!==null;)j=R,R=I;for(;;){if(R===e)break t;if(j===n&&++w===l&&(c=i),j===a&&++z===r&&(p=i),(I=R.nextSibling)!==null)break;R=j,j=R.parentNode}R=I}n=c===-1||p===-1?null:{start:c,end:p}}else n=null}n=n||{start:0,end:0}}else n=null;for(ao={focusedElem:e,selectionRange:n},Ml=!1,U=t;U!==null;)if(t=U,e=t.child,(t.subtreeFlags&1028)!==0&&e!==null)e.return=t,U=e;else for(;U!==null;){t=U;try{var W=t.alternate;if((t.flags&1024)!==0)switch(t.tag){case 0:case 11:case 15:break;case 1:if(W!==null){var H=W.memoizedProps,Te=W.memoizedState,y=t.stateNode,g=y.getSnapshotBeforeUpdate(t.elementType===t.type?H:Pt(t.type,H),Te);y.__reactInternalSnapshotBeforeUpdate=g}break;case 3:var _=t.stateNode.containerInfo;_.nodeType===1?_.textContent="":_.nodeType===9&&_.documentElement&&_.removeChild(_.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(s(163))}}catch(O){je(t,t.return,O)}if(e=t.sibling,e!==null){e.return=t.return,U=e;break}U=t.return}return W=wu,wu=!1,W}function xl(e,t,n){var r=t.updateQueue;if(r=r!==null?r.lastEffect:null,r!==null){var l=r=r.next;do{if((l.tag&e)===e){var a=l.destroy;l.destroy=void 0,a!==void 0&&Qo(t,n,a)}l=l.next}while(l!==r)}}function fa(e,t){if(t=t.updateQueue,t=t!==null?t.lastEffect:null,t!==null){var n=t=t.next;do{if((n.tag&e)===e){var r=n.create;n.destroy=r()}n=n.next}while(n!==t)}}function Jo(e){var t=e.ref;if(t!==null){var n=e.stateNode;switch(e.tag){case 5:e=n;break;default:e=n}typeof t=="function"?t(e):t.current=e}}function ku(e){var t=e.alternate;t!==null&&(e.alternate=null,ku(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&(delete t[Ft],delete t[ol],delete t[uo],delete t[vd],delete t[yd])),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}function bu(e){return e.tag===5||e.tag===3||e.tag===4}function Su(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||bu(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function Yo(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?n.nodeType===8?n.parentNode.insertBefore(e,t):n.insertBefore(e,t):(n.nodeType===8?(t=n.parentNode,t.insertBefore(e,n)):(t=n,t.appendChild(e)),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=Wl));else if(r!==4&&(e=e.child,e!==null))for(Yo(e,t,n),e=e.sibling;e!==null;)Yo(e,t,n),e=e.sibling}function Go(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?n.insertBefore(e,t):n.appendChild(e);else if(r!==4&&(e=e.child,e!==null))for(Go(e,t,n),e=e.sibling;e!==null;)Go(e,t,n),e=e.sibling}var Ve=null,Mt=!1;function En(e,t,n){for(n=n.child;n!==null;)Eu(e,t,n),n=n.sibling}function Eu(e,t,n){if(A&&typeof A.onCommitFiberUnmount=="function")try{A.onCommitFiberUnmount(D,n)}catch{}switch(n.tag){case 5:Ye||Rr(n,t);case 6:var r=Ve,l=Mt;Ve=null,En(e,t,n),Ve=r,Mt=l,Ve!==null&&(Mt?(e=Ve,n=n.stateNode,e.nodeType===8?e.parentNode.removeChild(n):e.removeChild(n)):Ve.removeChild(n.stateNode));break;case 18:Ve!==null&&(Mt?(e=Ve,n=n.stateNode,e.nodeType===8?io(e.parentNode,n):e.nodeType===1&&io(e,n),Yr(e)):io(Ve,n.stateNode));break;case 4:r=Ve,l=Mt,Ve=n.stateNode.containerInfo,Mt=!0,En(e,t,n),Ve=r,Mt=l;break;case 0:case 11:case 14:case 15:if(!Ye&&(r=n.updateQueue,r!==null&&(r=r.lastEffect,r!==null))){l=r=r.next;do{var a=l,i=a.destroy;a=a.tag,i!==void 0&&((a&2)!==0||(a&4)!==0)&&Qo(n,t,i),l=l.next}while(l!==r)}En(e,t,n);break;case 1:if(!Ye&&(Rr(n,t),r=n.stateNode,typeof r.componentWillUnmount=="function"))try{r.props=n.memoizedProps,r.state=n.memoizedState,r.componentWillUnmount()}catch(c){je(n,t,c)}En(e,t,n);break;case 21:En(e,t,n);break;case 22:n.mode&1?(Ye=(r=Ye)||n.memoizedState!==null,En(e,t,n),Ye=r):En(e,t,n);break;default:En(e,t,n)}}function Cu(e){var t=e.updateQueue;if(t!==null){e.updateQueue=null;var n=e.stateNode;n===null&&(n=e.stateNode=new Dd),t.forEach(function(r){var l=Hd.bind(null,e,r);n.has(r)||(n.add(r),r.then(l,l))})}}function Lt(e,t){var n=t.deletions;if(n!==null)for(var r=0;r<n.length;r++){var l=n[r];try{var a=e,i=t,c=i;e:for(;c!==null;){switch(c.tag){case 5:Ve=c.stateNode,Mt=!1;break e;case 3:Ve=c.stateNode.containerInfo,Mt=!0;break e;case 4:Ve=c.stateNode.containerInfo,Mt=!0;break e}c=c.return}if(Ve===null)throw Error(s(160));Eu(a,i,l),Ve=null,Mt=!1;var p=l.alternate;p!==null&&(p.return=null),l.return=null}catch(w){je(l,t,w)}}if(t.subtreeFlags&12854)for(t=t.child;t!==null;)Nu(t,e),t=t.sibling}function Nu(e,t){var n=e.alternate,r=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if(Lt(t,e),Vt(e),r&4){try{xl(3,e,e.return),fa(3,e)}catch(H){je(e,e.return,H)}try{xl(5,e,e.return)}catch(H){je(e,e.return,H)}}break;case 1:Lt(t,e),Vt(e),r&512&&n!==null&&Rr(n,n.return);break;case 5:if(Lt(t,e),Vt(e),r&512&&n!==null&&Rr(n,n.return),e.flags&32){var l=e.stateNode;try{Et(l,"")}catch(H){je(e,e.return,H)}}if(r&4&&(l=e.stateNode,l!=null)){var a=e.memoizedProps,i=n!==null?n.memoizedProps:a,c=e.type,p=e.updateQueue;if(e.updateQueue=null,p!==null)try{c==="input"&&a.type==="radio"&&a.name!=null&&rr(l,a),Ar(c,i);var w=Ar(c,a);for(i=0;i<p.length;i+=2){var z=p[i],R=p[i+1];z==="style"?In(l,R):z==="dangerouslySetInnerHTML"?$n(l,R):z==="children"?Et(l,R):ze(l,z,R,w)}switch(c){case"input":St(l,a);break;case"textarea":Kt(l,a);break;case"select":var j=l._wrapperState.wasMultiple;l._wrapperState.wasMultiple=!!a.multiple;var I=a.value;I!=null?Ht(l,!!a.multiple,I,!1):j!==!!a.multiple&&(a.defaultValue!=null?Ht(l,!!a.multiple,a.defaultValue,!0):Ht(l,!!a.multiple,a.multiple?[]:"",!1))}l[ol]=a}catch(H){je(e,e.return,H)}}break;case 6:if(Lt(t,e),Vt(e),r&4){if(e.stateNode===null)throw Error(s(162));l=e.stateNode,a=e.memoizedProps;try{l.nodeValue=a}catch(H){je(e,e.return,H)}}break;case 3:if(Lt(t,e),Vt(e),r&4&&n!==null&&n.memoizedState.isDehydrated)try{Yr(t.containerInfo)}catch(H){je(e,e.return,H)}break;case 4:Lt(t,e),Vt(e);break;case 13:Lt(t,e),Vt(e),l=e.child,l.flags&8192&&(a=l.memoizedState!==null,l.stateNode.isHidden=a,!a||l.alternate!==null&&l.alternate.memoizedState!==null||(Zo=Ee())),r&4&&Cu(e);break;case 22:if(z=n!==null&&n.memoizedState!==null,e.mode&1?(Ye=(w=Ye)||z,Lt(t,e),Ye=w):Lt(t,e),Vt(e),r&8192){if(w=e.memoizedState!==null,(e.stateNode.isHidden=w)&&!z&&(e.mode&1)!==0)for(U=e,z=e.child;z!==null;){for(R=U=z;U!==null;){switch(j=U,I=j.child,j.tag){case 0:case 11:case 14:case 15:xl(4,j,j.return);break;case 1:Rr(j,j.return);var W=j.stateNode;if(typeof W.componentWillUnmount=="function"){r=j,n=j.return;try{t=r,W.props=t.memoizedProps,W.state=t.memoizedState,W.componentWillUnmount()}catch(H){je(r,n,H)}}break;case 5:Rr(j,j.return);break;case 22:if(j.memoizedState!==null){zu(R);continue}}I!==null?(I.return=j,U=I):zu(R)}z=z.sibling}e:for(z=null,R=e;;){if(R.tag===5){if(z===null){z=R;try{l=R.stateNode,w?(a=l.style,typeof a.setProperty=="function"?a.setProperty("display","none","important"):a.display="none"):(c=R.stateNode,p=R.memoizedProps.style,i=p!=null&&p.hasOwnProperty("display")?p.display:null,c.style.display=Qt("display",i))}catch(H){je(e,e.return,H)}}}else if(R.tag===6){if(z===null)try{R.stateNode.nodeValue=w?"":R.memoizedProps}catch(H){je(e,e.return,H)}}else if((R.tag!==22&&R.tag!==23||R.memoizedState===null||R===e)&&R.child!==null){R.child.return=R,R=R.child;continue}if(R===e)break e;for(;R.sibling===null;){if(R.return===null||R.return===e)break e;z===R&&(z=null),R=R.return}z===R&&(z=null),R.sibling.return=R.return,R=R.sibling}}break;case 19:Lt(t,e),Vt(e),r&4&&Cu(e);break;case 21:break;default:Lt(t,e),Vt(e)}}function Vt(e){var t=e.flags;if(t&2){try{e:{for(var n=e.return;n!==null;){if(bu(n)){var r=n;break e}n=n.return}throw Error(s(160))}switch(r.tag){case 5:var l=r.stateNode;r.flags&32&&(Et(l,""),r.flags&=-33);var a=Su(e);Go(e,a,l);break;case 3:case 4:var i=r.stateNode.containerInfo,c=Su(e);Yo(e,c,i);break;default:throw Error(s(161))}}catch(p){je(e,e.return,p)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function $d(e,t,n){U=e,ju(e)}function ju(e,t,n){for(var r=(e.mode&1)!==0;U!==null;){var l=U,a=l.child;if(l.tag===22&&r){var i=l.memoizedState!==null||pa;if(!i){var c=l.alternate,p=c!==null&&c.memoizedState!==null||Ye;c=pa;var w=Ye;if(pa=i,(Ye=p)&&!w)for(U=l;U!==null;)i=U,p=i.child,i.tag===22&&i.memoizedState!==null?Pu(l):p!==null?(p.return=i,U=p):Pu(l);for(;a!==null;)U=a,ju(a),a=a.sibling;U=l,pa=c,Ye=w}Tu(e)}else(l.subtreeFlags&8772)!==0&&a!==null?(a.return=l,U=a):Tu(e)}}function Tu(e){for(;U!==null;){var t=U;if((t.flags&8772)!==0){var n=t.alternate;try{if((t.flags&8772)!==0)switch(t.tag){case 0:case 11:case 15:Ye||fa(5,t);break;case 1:var r=t.stateNode;if(t.flags&4&&!Ye)if(n===null)r.componentDidMount();else{var l=t.elementType===t.type?n.memoizedProps:Pt(t.type,n.memoizedProps);r.componentDidUpdate(l,n.memoizedState,r.__reactInternalSnapshotBeforeUpdate)}var a=t.updateQueue;a!==null&&zi(t,a,r);break;case 3:var i=t.updateQueue;if(i!==null){if(n=null,t.child!==null)switch(t.child.tag){case 5:n=t.child.stateNode;break;case 1:n=t.child.stateNode}zi(t,i,n)}break;case 5:var c=t.stateNode;if(n===null&&t.flags&4){n=c;var p=t.memoizedProps;switch(t.type){case"button":case"input":case"select":case"textarea":p.autoFocus&&n.focus();break;case"img":p.src&&(n.src=p.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(t.memoizedState===null){var w=t.alternate;if(w!==null){var z=w.memoizedState;if(z!==null){var R=z.dehydrated;R!==null&&Yr(R)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(s(163))}Ye||t.flags&512&&Jo(t)}catch(j){je(t,t.return,j)}}if(t===e){U=null;break}if(n=t.sibling,n!==null){n.return=t.return,U=n;break}U=t.return}}function zu(e){for(;U!==null;){var t=U;if(t===e){U=null;break}var n=t.sibling;if(n!==null){n.return=t.return,U=n;break}U=t.return}}function Pu(e){for(;U!==null;){var t=U;try{switch(t.tag){case 0:case 11:case 15:var n=t.return;try{fa(4,t)}catch(p){je(t,n,p)}break;case 1:var r=t.stateNode;if(typeof r.componentDidMount=="function"){var l=t.return;try{r.componentDidMount()}catch(p){je(t,l,p)}}var a=t.return;try{Jo(t)}catch(p){je(t,a,p)}break;case 5:var i=t.return;try{Jo(t)}catch(p){je(t,i,p)}}}catch(p){je(t,t.return,p)}if(t===e){U=null;break}var c=t.sibling;if(c!==null){c.return=t.return,U=c;break}U=t.return}}var Id=Math.ceil,ga=be.ReactCurrentDispatcher,qo=be.ReactCurrentOwner,_t=be.ReactCurrentBatchConfig,ce=0,Fe=null,Me=null,We=0,pt=0,Dr=_n(0),De=0,vl=null,Xn=0,ma=0,Xo=0,yl=null,lt=null,Zo=0,Or=1/0,sn=null,ha=!1,es=null,Cn=null,xa=!1,Nn=null,va=0,_l=0,ts=null,ya=-1,_a=0;function Xe(){return(ce&6)!==0?Ee():ya!==-1?ya:ya=Ee()}function jn(e){return(e.mode&1)===0?1:(ce&2)!==0&&We!==0?We&-We:wd.transition!==null?(_a===0&&(_a=Ss()),_a):(e=he,e!==0||(e=window.event,e=e===void 0?16:Ls(e.type)),e)}function Rt(e,t,n,r){if(50<_l)throw _l=0,ts=null,Error(s(185));Wr(e,n,r),((ce&2)===0||e!==Fe)&&(e===Fe&&((ce&2)===0&&(ma|=n),De===4&&Tn(e,We)),at(e,r),n===1&&ce===0&&(t.mode&1)===0&&(Or=Ee()+500,Jl&&kn()))}function at(e,t){var n=e.callbackNode;wc(e,t);var r=Tl(e,e===Fe?We:0);if(r===0)n!==null&&jl(n),e.callbackNode=null,e.callbackPriority=0;else if(t=r&-r,e.callbackPriority!==t){if(n!=null&&jl(n),t===1)e.tag===0?_d(Lu.bind(null,e)):vi(Lu.bind(null,e)),hd(function(){(ce&6)===0&&kn()}),n=null;else{switch(Es(r)){case 1:n=mr;break;case 4:n=Ur;break;case 16:n=Wn;break;case 536870912:n=k;break;default:n=Wn}n=Bu(n,Mu.bind(null,e))}e.callbackPriority=t,e.callbackNode=n}}function Mu(e,t){if(ya=-1,_a=0,(ce&6)!==0)throw Error(s(327));var n=e.callbackNode;if($r()&&e.callbackNode!==n)return null;var r=Tl(e,e===Fe?We:0);if(r===0)return null;if((r&30)!==0||(r&e.expiredLanes)!==0||t)t=wa(e,r);else{t=r;var l=ce;ce|=2;var a=Du();(Fe!==e||We!==t)&&(sn=null,Or=Ee()+500,er(e,t));do try{Bd();break}catch(c){Ru(e,c)}while(!0);yo(),ga.current=a,ce=l,Me!==null?t=0:(Fe=null,We=0,t=De)}if(t!==0){if(t===2&&(l=Ra(e),l!==0&&(r=l,t=ns(e,l))),t===1)throw n=vl,er(e,0),Tn(e,r),at(e,Ee()),n;if(t===6)Tn(e,r);else{if(l=e.current.alternate,(r&30)===0&&!Ad(l)&&(t=wa(e,r),t===2&&(a=Ra(e),a!==0&&(r=a,t=ns(e,a))),t===1))throw n=vl,er(e,0),Tn(e,r),at(e,Ee()),n;switch(e.finishedWork=l,e.finishedLanes=r,t){case 0:case 1:throw Error(s(345));case 2:tr(e,lt,sn);break;case 3:if(Tn(e,r),(r&130023424)===r&&(t=Zo+500-Ee(),10<t)){if(Tl(e,0)!==0)break;if(l=e.suspendedLanes,(l&r)!==r){Xe(),e.pingedLanes|=e.suspendedLanes&l;break}e.timeoutHandle=so(tr.bind(null,e,lt,sn),t);break}tr(e,lt,sn);break;case 4:if(Tn(e,r),(r&4194240)===r)break;for(t=e.eventTimes,l=-1;0<r;){var i=31-q(r);a=1<<i,i=t[i],i>l&&(l=i),r&=~a}if(r=l,r=Ee()-r,r=(120>r?120:480>r?480:1080>r?1080:1920>r?1920:3e3>r?3e3:4320>r?4320:1960*Id(r/1960))-r,10<r){e.timeoutHandle=so(tr.bind(null,e,lt,sn),r);break}tr(e,lt,sn);break;case 5:tr(e,lt,sn);break;default:throw Error(s(329))}}}return at(e,Ee()),e.callbackNode===n?Mu.bind(null,e):null}function ns(e,t){var n=yl;return e.current.memoizedState.isDehydrated&&(er(e,t).flags|=256),e=wa(e,t),e!==2&&(t=lt,lt=n,t!==null&&rs(t)),e}function rs(e){lt===null?lt=e:lt.push.apply(lt,e)}function Ad(e){for(var t=e;;){if(t.flags&16384){var n=t.updateQueue;if(n!==null&&(n=n.stores,n!==null))for(var r=0;r<n.length;r++){var l=n[r],a=l.getSnapshot;l=l.value;try{if(!Tt(a(),l))return!1}catch{return!1}}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function Tn(e,t){for(t&=~Xo,t&=~ma,e.suspendedLanes|=t,e.pingedLanes&=~t,e=e.expirationTimes;0<t;){var n=31-q(t),r=1<<n;e[n]=-1,t&=~r}}function Lu(e){if((ce&6)!==0)throw Error(s(327));$r();var t=Tl(e,0);if((t&1)===0)return at(e,Ee()),null;var n=wa(e,t);if(e.tag!==0&&n===2){var r=Ra(e);r!==0&&(t=r,n=ns(e,r))}if(n===1)throw n=vl,er(e,0),Tn(e,t),at(e,Ee()),n;if(n===6)throw Error(s(345));return e.finishedWork=e.current.alternate,e.finishedLanes=t,tr(e,lt,sn),at(e,Ee()),null}function ls(e,t){var n=ce;ce|=1;try{return e(t)}finally{ce=n,ce===0&&(Or=Ee()+500,Jl&&kn())}}function Zn(e){Nn!==null&&Nn.tag===0&&(ce&6)===0&&$r();var t=ce;ce|=1;var n=_t.transition,r=he;try{if(_t.transition=null,he=1,e)return e()}finally{he=r,_t.transition=n,ce=t,(ce&6)===0&&kn()}}function as(){pt=Dr.current,ke(Dr)}function er(e,t){e.finishedWork=null,e.finishedLanes=0;var n=e.timeoutHandle;if(n!==-1&&(e.timeoutHandle=-1,md(n)),Me!==null)for(n=Me.return;n!==null;){var r=n;switch(go(r),r.tag){case 1:r=r.type.childContextTypes,r!=null&&Kl();break;case 3:Mr(),ke(tt),ke(Ke),No();break;case 5:Eo(r);break;case 4:Mr();break;case 13:ke(Ce);break;case 19:ke(Ce);break;case 10:_o(r.type._context);break;case 22:case 23:as()}n=n.return}if(Fe=e,Me=e=zn(e.current,null),We=pt=t,De=0,vl=null,Xo=ma=Xn=0,lt=yl=null,Yn!==null){for(t=0;t<Yn.length;t++)if(n=Yn[t],r=n.interleaved,r!==null){n.interleaved=null;var l=r.next,a=n.pending;if(a!==null){var i=a.next;a.next=l,r.next=i}n.pending=r}Yn=null}return e}function Ru(e,t){do{var n=Me;try{if(yo(),la.current=ia,aa){for(var r=Ne.memoizedState;r!==null;){var l=r.queue;l!==null&&(l.pending=null),r=r.next}aa=!1}if(qn=0,Ae=Re=Ne=null,pl=!1,fl=0,qo.current=null,n===null||n.return===null){De=1,vl=t,Me=null;break}e:{var a=e,i=n.return,c=n,p=t;if(t=We,c.flags|=32768,p!==null&&typeof p=="object"&&typeof p.then=="function"){var w=p,z=c,R=z.tag;if((z.mode&1)===0&&(R===0||R===11||R===15)){var j=z.alternate;j?(z.updateQueue=j.updateQueue,z.memoizedState=j.memoizedState,z.lanes=j.lanes):(z.updateQueue=null,z.memoizedState=null)}var I=au(i);if(I!==null){I.flags&=-257,ou(I,i,c,a,t),I.mode&1&&lu(a,w,t),t=I,p=w;var W=t.updateQueue;if(W===null){var H=new Set;H.add(p),t.updateQueue=H}else W.add(p);break e}else{if((t&1)===0){lu(a,w,t),os();break e}p=Error(s(426))}}else if(Se&&c.mode&1){var Te=au(i);if(Te!==null){(Te.flags&65536)===0&&(Te.flags|=256),ou(Te,i,c,a,t),xo(Lr(p,c));break e}}a=p=Lr(p,c),De!==4&&(De=2),yl===null?yl=[a]:yl.push(a),a=i;do{switch(a.tag){case 3:a.flags|=65536,t&=-t,a.lanes|=t;var y=nu(a,p,t);Ti(a,y);break e;case 1:c=p;var g=a.type,_=a.stateNode;if((a.flags&128)===0&&(typeof g.getDerivedStateFromError=="function"||_!==null&&typeof _.componentDidCatch=="function"&&(Cn===null||!Cn.has(_)))){a.flags|=65536,t&=-t,a.lanes|=t;var O=ru(a,c,t);Ti(a,O);break e}}a=a.return}while(a!==null)}$u(n)}catch(K){t=K,Me===n&&n!==null&&(Me=n=n.return);continue}break}while(!0)}function Du(){var e=ga.current;return ga.current=ia,e===null?ia:e}function os(){(De===0||De===3||De===2)&&(De=4),Fe===null||(Xn&268435455)===0&&(ma&268435455)===0||Tn(Fe,We)}function wa(e,t){var n=ce;ce|=2;var r=Du();(Fe!==e||We!==t)&&(sn=null,er(e,t));do try{Fd();break}catch(l){Ru(e,l)}while(!0);if(yo(),ce=n,ga.current=r,Me!==null)throw Error(s(261));return Fe=null,We=0,De}function Fd(){for(;Me!==null;)Ou(Me)}function Bd(){for(;Me!==null&&!gr();)Ou(Me)}function Ou(e){var t=Fu(e.alternate,e,pt);e.memoizedProps=e.pendingProps,t===null?$u(e):Me=t,qo.current=null}function $u(e){var t=e;do{var n=t.alternate;if(e=t.return,(t.flags&32768)===0){if(n=Ld(n,t,pt),n!==null){Me=n;return}}else{if(n=Rd(n,t),n!==null){n.flags&=32767,Me=n;return}if(e!==null)e.flags|=32768,e.subtreeFlags=0,e.deletions=null;else{De=6,Me=null;return}}if(t=t.sibling,t!==null){Me=t;return}Me=t=e}while(t!==null);De===0&&(De=5)}function tr(e,t,n){var r=he,l=_t.transition;try{_t.transition=null,he=1,Ud(e,t,n,r)}finally{_t.transition=l,he=r}return null}function Ud(e,t,n,r){do $r();while(Nn!==null);if((ce&6)!==0)throw Error(s(327));n=e.finishedWork;var l=e.finishedLanes;if(n===null)return null;if(e.finishedWork=null,e.finishedLanes=0,n===e.current)throw Error(s(177));e.callbackNode=null,e.callbackPriority=0;var a=n.lanes|n.childLanes;if(kc(e,a),e===Fe&&(Me=Fe=null,We=0),(n.subtreeFlags&2064)===0&&(n.flags&2064)===0||xa||(xa=!0,Bu(Wn,function(){return $r(),null})),a=(n.flags&15990)!==0,(n.subtreeFlags&15990)!==0||a){a=_t.transition,_t.transition=null;var i=he;he=1;var c=ce;ce|=4,qo.current=null,Od(e,n),Nu(n,e),id(ao),Ml=!!lo,ao=lo=null,e.current=n,$d(n),Ma(),ce=c,he=i,_t.transition=a}else e.current=n;if(xa&&(xa=!1,Nn=e,va=l),a=e.pendingLanes,a===0&&(Cn=null),ae(n.stateNode),at(e,Ee()),t!==null)for(r=e.onRecoverableError,n=0;n<t.length;n++)l=t[n],r(l.value,{componentStack:l.stack,digest:l.digest});if(ha)throw ha=!1,e=es,es=null,e;return(va&1)!==0&&e.tag!==0&&$r(),a=e.pendingLanes,(a&1)!==0?e===ts?_l++:(_l=0,ts=e):_l=0,kn(),null}function $r(){if(Nn!==null){var e=Es(va),t=_t.transition,n=he;try{if(_t.transition=null,he=16>e?16:e,Nn===null)var r=!1;else{if(e=Nn,Nn=null,va=0,(ce&6)!==0)throw Error(s(331));var l=ce;for(ce|=4,U=e.current;U!==null;){var a=U,i=a.child;if((U.flags&16)!==0){var c=a.deletions;if(c!==null){for(var p=0;p<c.length;p++){var w=c[p];for(U=w;U!==null;){var z=U;switch(z.tag){case 0:case 11:case 15:xl(8,z,a)}var R=z.child;if(R!==null)R.return=z,U=R;else for(;U!==null;){z=U;var j=z.sibling,I=z.return;if(ku(z),z===w){U=null;break}if(j!==null){j.return=I,U=j;break}U=I}}}var W=a.alternate;if(W!==null){var H=W.child;if(H!==null){W.child=null;do{var Te=H.sibling;H.sibling=null,H=Te}while(H!==null)}}U=a}}if((a.subtreeFlags&2064)!==0&&i!==null)i.return=a,U=i;else e:for(;U!==null;){if(a=U,(a.flags&2048)!==0)switch(a.tag){case 0:case 11:case 15:xl(9,a,a.return)}var y=a.sibling;if(y!==null){y.return=a.return,U=y;break e}U=a.return}}var g=e.current;for(U=g;U!==null;){i=U;var _=i.child;if((i.subtreeFlags&2064)!==0&&_!==null)_.return=i,U=_;else e:for(i=g;U!==null;){if(c=U,(c.flags&2048)!==0)try{switch(c.tag){case 0:case 11:case 15:fa(9,c)}}catch(K){je(c,c.return,K)}if(c===i){U=null;break e}var O=c.sibling;if(O!==null){O.return=c.return,U=O;break e}U=c.return}}if(ce=l,kn(),A&&typeof A.onPostCommitFiberRoot=="function")try{A.onPostCommitFiberRoot(D,e)}catch{}r=!0}return r}finally{he=n,_t.transition=t}}return!1}function Iu(e,t,n){t=Lr(n,t),t=nu(e,t,1),e=Sn(e,t,1),t=Xe(),e!==null&&(Wr(e,1,t),at(e,t))}function je(e,t,n){if(e.tag===3)Iu(e,e,n);else for(;t!==null;){if(t.tag===3){Iu(t,e,n);break}else if(t.tag===1){var r=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof r.componentDidCatch=="function"&&(Cn===null||!Cn.has(r))){e=Lr(n,e),e=ru(t,e,1),t=Sn(t,e,1),e=Xe(),t!==null&&(Wr(t,1,e),at(t,e));break}}t=t.return}}function Vd(e,t,n){var r=e.pingCache;r!==null&&r.delete(t),t=Xe(),e.pingedLanes|=e.suspendedLanes&n,Fe===e&&(We&n)===n&&(De===4||De===3&&(We&130023424)===We&&500>Ee()-Zo?er(e,0):Xo|=n),at(e,t)}function Au(e,t){t===0&&((e.mode&1)===0?t=1:(t=At,At<<=1,(At&130023424)===0&&(At=4194304)));var n=Xe();e=ln(e,t),e!==null&&(Wr(e,t,n),at(e,n))}function Wd(e){var t=e.memoizedState,n=0;t!==null&&(n=t.retryLane),Au(e,n)}function Hd(e,t){var n=0;switch(e.tag){case 13:var r=e.stateNode,l=e.memoizedState;l!==null&&(n=l.retryLane);break;case 19:r=e.stateNode;break;default:throw Error(s(314))}r!==null&&r.delete(t),Au(e,n)}var Fu;Fu=function(e,t,n){if(e!==null)if(e.memoizedProps!==t.pendingProps||tt.current)rt=!0;else{if((e.lanes&n)===0&&(t.flags&128)===0)return rt=!1,Md(e,t,n);rt=(e.flags&131072)!==0}else rt=!1,Se&&(t.flags&1048576)!==0&&yi(t,Gl,t.index);switch(t.lanes=0,t.tag){case 2:var r=t.type;da(e,t),e=t.pendingProps;var l=Er(t,Ke.current);Pr(t,n),l=zo(null,t,r,e,l,n);var a=Po();return t.flags|=1,typeof l=="object"&&l!==null&&typeof l.render=="function"&&l.$$typeof===void 0?(t.tag=1,t.memoizedState=null,t.updateQueue=null,nt(r)?(a=!0,Ql(t)):a=!1,t.memoizedState=l.state!==null&&l.state!==void 0?l.state:null,bo(t),l.updater=ua,t.stateNode=l,l._reactInternals=t,$o(t,r,e,n),t=Bo(null,t,r,!0,a,n)):(t.tag=0,Se&&a&&fo(t),qe(null,t,l,n),t=t.child),t;case 16:r=t.elementType;e:{switch(da(e,t),e=t.pendingProps,l=r._init,r=l(r._payload),t.type=r,l=t.tag=Qd(r),e=Pt(r,e),l){case 0:t=Fo(null,t,r,e,n);break e;case 1:t=pu(null,t,r,e,n);break e;case 11:t=su(null,t,r,e,n);break e;case 14:t=iu(null,t,r,Pt(r.type,e),n);break e}throw Error(s(306,r,""))}return t;case 0:return r=t.type,l=t.pendingProps,l=t.elementType===r?l:Pt(r,l),Fo(e,t,r,l,n);case 1:return r=t.type,l=t.pendingProps,l=t.elementType===r?l:Pt(r,l),pu(e,t,r,l,n);case 3:e:{if(fu(t),e===null)throw Error(s(387));r=t.pendingProps,a=t.memoizedState,l=a.element,ji(e,t),na(t,r,null,n);var i=t.memoizedState;if(r=i.element,a.isDehydrated)if(a={element:r,isDehydrated:!1,cache:i.cache,pendingSuspenseBoundaries:i.pendingSuspenseBoundaries,transitions:i.transitions},t.updateQueue.baseState=a,t.memoizedState=a,t.flags&256){l=Lr(Error(s(423)),t),t=gu(e,t,r,n,l);break e}else if(r!==l){l=Lr(Error(s(424)),t),t=gu(e,t,r,n,l);break e}else for(dt=yn(t.stateNode.containerInfo.firstChild),ct=t,Se=!0,zt=null,n=Ci(t,null,r,n),t.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(jr(),r===l){t=on(e,t,n);break e}qe(e,t,r,n)}t=t.child}return t;case 5:return Pi(t),e===null&&ho(t),r=t.type,l=t.pendingProps,a=e!==null?e.memoizedProps:null,i=l.children,oo(r,l)?i=null:a!==null&&oo(r,a)&&(t.flags|=32),du(e,t),qe(e,t,i,n),t.child;case 6:return e===null&&ho(t),null;case 13:return mu(e,t,n);case 4:return So(t,t.stateNode.containerInfo),r=t.pendingProps,e===null?t.child=Tr(t,null,r,n):qe(e,t,r,n),t.child;case 11:return r=t.type,l=t.pendingProps,l=t.elementType===r?l:Pt(r,l),su(e,t,r,l,n);case 7:return qe(e,t,t.pendingProps,n),t.child;case 8:return qe(e,t,t.pendingProps.children,n),t.child;case 12:return qe(e,t,t.pendingProps.children,n),t.child;case 10:e:{if(r=t.type._context,l=t.pendingProps,a=t.memoizedProps,i=l.value,ve(Zl,r._currentValue),r._currentValue=i,a!==null)if(Tt(a.value,i)){if(a.children===l.children&&!tt.current){t=on(e,t,n);break e}}else for(a=t.child,a!==null&&(a.return=t);a!==null;){var c=a.dependencies;if(c!==null){i=a.child;for(var p=c.firstContext;p!==null;){if(p.context===r){if(a.tag===1){p=an(-1,n&-n),p.tag=2;var w=a.updateQueue;if(w!==null){w=w.shared;var z=w.pending;z===null?p.next=p:(p.next=z.next,z.next=p),w.pending=p}}a.lanes|=n,p=a.alternate,p!==null&&(p.lanes|=n),wo(a.return,n,t),c.lanes|=n;break}p=p.next}}else if(a.tag===10)i=a.type===t.type?null:a.child;else if(a.tag===18){if(i=a.return,i===null)throw Error(s(341));i.lanes|=n,c=i.alternate,c!==null&&(c.lanes|=n),wo(i,n,t),i=a.sibling}else i=a.child;if(i!==null)i.return=a;else for(i=a;i!==null;){if(i===t){i=null;break}if(a=i.sibling,a!==null){a.return=i.return,i=a;break}i=i.return}a=i}qe(e,t,l.children,n),t=t.child}return t;case 9:return l=t.type,r=t.pendingProps.children,Pr(t,n),l=vt(l),r=r(l),t.flags|=1,qe(e,t,r,n),t.child;case 14:return r=t.type,l=Pt(r,t.pendingProps),l=Pt(r.type,l),iu(e,t,r,l,n);case 15:return uu(e,t,t.type,t.pendingProps,n);case 17:return r=t.type,l=t.pendingProps,l=t.elementType===r?l:Pt(r,l),da(e,t),t.tag=1,nt(r)?(e=!0,Ql(t)):e=!1,Pr(t,n),eu(t,r,l),$o(t,r,l,n),Bo(null,t,r,!0,e,n);case 19:return xu(e,t,n);case 22:return cu(e,t,n)}throw Error(s(156,t.tag))};function Bu(e,t){return Br(e,t)}function Kd(e,t,n,r){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=r,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function wt(e,t,n,r){return new Kd(e,t,n,r)}function ss(e){return e=e.prototype,!(!e||!e.isReactComponent)}function Qd(e){if(typeof e=="function")return ss(e)?1:0;if(e!=null){if(e=e.$$typeof,e===st)return 11;if(e===gt)return 14}return 2}function zn(e,t){var n=e.alternate;return n===null?(n=wt(e.tag,t,e.key,e.mode),n.elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=e.flags&14680064,n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n}function ka(e,t,n,r,l,a){var i=2;if(r=e,typeof e=="function")ss(e)&&(i=1);else if(typeof e=="string")i=5;else e:switch(e){case Pe:return nr(n.children,l,a,t);case Oe:i=8,l|=8;break;case bt:return e=wt(12,n,t,l|2),e.elementType=bt,e.lanes=a,e;case Ge:return e=wt(13,n,t,l),e.elementType=Ge,e.lanes=a,e;case it:return e=wt(19,n,t,l),e.elementType=it,e.lanes=a,e;case ye:return ba(n,l,a,t);default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case ft:i=10;break e;case Dt:i=9;break e;case st:i=11;break e;case gt:i=14;break e;case Ue:i=16,r=null;break e}throw Error(s(130,e==null?e:typeof e,""))}return t=wt(i,n,t,l),t.elementType=e,t.type=r,t.lanes=a,t}function nr(e,t,n,r){return e=wt(7,e,r,t),e.lanes=n,e}function ba(e,t,n,r){return e=wt(22,e,r,t),e.elementType=ye,e.lanes=n,e.stateNode={isHidden:!1},e}function is(e,t,n){return e=wt(6,e,null,t),e.lanes=n,e}function us(e,t,n){return t=wt(4,e.children!==null?e.children:[],e.key,t),t.lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}function Jd(e,t,n,r,l){this.tag=t,this.containerInfo=e,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=Da(0),this.expirationTimes=Da(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Da(0),this.identifierPrefix=r,this.onRecoverableError=l,this.mutableSourceEagerHydrationData=null}function cs(e,t,n,r,l,a,i,c,p){return e=new Jd(e,t,n,c,p),t===1?(t=1,a===!0&&(t|=8)):t=0,a=wt(3,null,null,t),e.current=a,a.stateNode=e,a.memoizedState={element:r,isDehydrated:n,cache:null,transitions:null,pendingSuspenseBoundaries:null},bo(a),e}function Yd(e,t,n){var r=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:pe,key:r==null?null:""+r,children:e,containerInfo:t,implementation:n}}function Uu(e){if(!e)return wn;e=e._reactInternals;e:{if(Zt(e)!==e||e.tag!==1)throw Error(s(170));var t=e;do{switch(t.tag){case 3:t=t.stateNode.context;break e;case 1:if(nt(t.type)){t=t.stateNode.__reactInternalMemoizedMergedChildContext;break e}}t=t.return}while(t!==null);throw Error(s(171))}if(e.tag===1){var n=e.type;if(nt(n))return hi(e,n,t)}return t}function Vu(e,t,n,r,l,a,i,c,p){return e=cs(n,r,!0,e,l,a,i,c,p),e.context=Uu(null),n=e.current,r=Xe(),l=jn(n),a=an(r,l),a.callback=t??null,Sn(n,a,l),e.current.lanes=l,Wr(e,l,r),at(e,r),e}function Sa(e,t,n,r){var l=t.current,a=Xe(),i=jn(l);return n=Uu(n),t.context===null?t.context=n:t.pendingContext=n,t=an(a,i),t.payload={element:e},r=r===void 0?null:r,r!==null&&(t.callback=r),e=Sn(l,t,i),e!==null&&(Rt(e,l,i,a),ta(e,l,i)),i}function Ea(e){if(e=e.current,!e.child)return null;switch(e.child.tag){case 5:return e.child.stateNode;default:return e.child.stateNode}}function Wu(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var n=e.retryLane;e.retryLane=n!==0&&n<t?n:t}}function ds(e,t){Wu(e,t),(e=e.alternate)&&Wu(e,t)}function Gd(){return null}var Hu=typeof reportError=="function"?reportError:function(e){console.error(e)};function ps(e){this._internalRoot=e}Ca.prototype.render=ps.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(s(409));Sa(e,t,null,null)},Ca.prototype.unmount=ps.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;Zn(function(){Sa(null,e,null,null)}),t[en]=null}};function Ca(e){this._internalRoot=e}Ca.prototype.unstable_scheduleHydration=function(e){if(e){var t=js();e={blockedOn:null,target:e,priority:t};for(var n=0;n<hn.length&&t!==0&&t<hn[n].priority;n++);hn.splice(n,0,e),n===0&&Ps(e)}};function fs(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function Na(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11&&(e.nodeType!==8||e.nodeValue!==" react-mount-point-unstable "))}function Ku(){}function qd(e,t,n,r,l){if(l){if(typeof r=="function"){var a=r;r=function(){var w=Ea(i);a.call(w)}}var i=Vu(t,r,e,0,null,!1,!1,"",Ku);return e._reactRootContainer=i,e[en]=i.current,ll(e.nodeType===8?e.parentNode:e),Zn(),i}for(;l=e.lastChild;)e.removeChild(l);if(typeof r=="function"){var c=r;r=function(){var w=Ea(p);c.call(w)}}var p=cs(e,0,!1,null,null,!1,!1,"",Ku);return e._reactRootContainer=p,e[en]=p.current,ll(e.nodeType===8?e.parentNode:e),Zn(function(){Sa(t,p,n,r)}),p}function ja(e,t,n,r,l){var a=n._reactRootContainer;if(a){var i=a;if(typeof l=="function"){var c=l;l=function(){var p=Ea(i);c.call(p)}}Sa(t,i,e,l)}else i=qd(n,t,e,l,r);return Ea(i)}Cs=function(e){switch(e.tag){case 3:var t=e.stateNode;if(t.current.memoizedState.isDehydrated){var n=Vr(t.pendingLanes);n!==0&&(Oa(t,n|1),at(t,Ee()),(ce&6)===0&&(Or=Ee()+500,kn()))}break;case 13:Zn(function(){var r=ln(e,1);if(r!==null){var l=Xe();Rt(r,e,1,l)}}),ds(e,1)}},$a=function(e){if(e.tag===13){var t=ln(e,134217728);if(t!==null){var n=Xe();Rt(t,e,134217728,n)}ds(e,134217728)}},Ns=function(e){if(e.tag===13){var t=jn(e),n=ln(e,t);if(n!==null){var r=Xe();Rt(n,e,t,r)}ds(e,t)}},js=function(){return he},Ts=function(e,t){var n=he;try{return he=e,t()}finally{he=n}},An=function(e,t,n){switch(t){case"input":if(St(e,n),t=n.name,n.type==="radio"&&t!=null){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+t)+'][type="radio"]'),t=0;t<n.length;t++){var r=n[t];if(r!==e&&r.form===e.form){var l=Hl(r);if(!l)throw Error(s(90));Ot(r),St(r,l)}}}break;case"textarea":Kt(e,n);break;case"select":t=n.value,t!=null&&Ht(e,!!n.multiple,t,!1)}},El=ls,Fr=Zn;var Xd={usingClientEntryPoint:!1,Events:[sl,br,Hl,Fn,Bn,ls]},wl={findFiberByHostInstance:Hn,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},Zd={bundleType:wl.bundleType,version:wl.version,rendererPackageName:wl.rendererPackageName,rendererConfig:wl.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:be.ReactCurrentDispatcher,findHostInstanceByFiber:function(e){return e=fr(e),e===null?null:e.stateNode},findFiberByHostInstance:wl.findFiberByHostInstance||Gd,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var Ta=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Ta.isDisabled&&Ta.supportsFiber)try{D=Ta.inject(Zd),A=Ta}catch{}}return ot.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Xd,ot.createPortal=function(e,t){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!fs(t))throw Error(s(200));return Yd(e,t,null,n)},ot.createRoot=function(e,t){if(!fs(e))throw Error(s(299));var n=!1,r="",l=Hu;return t!=null&&(t.unstable_strictMode===!0&&(n=!0),t.identifierPrefix!==void 0&&(r=t.identifierPrefix),t.onRecoverableError!==void 0&&(l=t.onRecoverableError)),t=cs(e,1,!1,null,null,n,!1,r,l),e[en]=t.current,ll(e.nodeType===8?e.parentNode:e),new ps(t)},ot.findDOMNode=function(e){if(e==null)return null;if(e.nodeType===1)return e;var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(s(188)):(e=Object.keys(e).join(","),Error(s(268,e)));return e=fr(t),e=e===null?null:e.stateNode,e},ot.flushSync=function(e){return Zn(e)},ot.hydrate=function(e,t,n){if(!Na(t))throw Error(s(200));return ja(null,e,t,!0,n)},ot.hydrateRoot=function(e,t,n){if(!fs(e))throw Error(s(405));var r=n!=null&&n.hydratedSources||null,l=!1,a="",i=Hu;if(n!=null&&(n.unstable_strictMode===!0&&(l=!0),n.identifierPrefix!==void 0&&(a=n.identifierPrefix),n.onRecoverableError!==void 0&&(i=n.onRecoverableError)),t=Vu(t,null,e,1,n??null,l,!1,a,i),e[en]=t.current,ll(e),r)for(e=0;e<r.length;e++)n=r[e],l=n._getVersion,l=l(n._source),t.mutableSourceEagerHydrationData==null?t.mutableSourceEagerHydrationData=[n,l]:t.mutableSourceEagerHydrationData.push(n,l);return new Ca(t)},ot.render=function(e,t,n){if(!Na(t))throw Error(s(200));return ja(null,e,t,!1,n)},ot.unmountComponentAtNode=function(e){if(!Na(e))throw Error(s(40));return e._reactRootContainer?(Zn(function(){ja(null,null,e,!1,function(){e._reactRootContainer=null,e[en]=null})}),!0):!1},ot.unstable_batchedUpdates=ls,ot.unstable_renderSubtreeIntoContainer=function(e,t,n,r){if(!Na(n))throw Error(s(200));if(e==null||e._reactInternals===void 0)throw Error(s(38));return ja(e,t,n,!1,r)},ot.version="18.3.1-next-f1338f8080-20240426",ot}var ec;function sp(){if(ec)return hs.exports;ec=1;function o(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(o)}catch(u){console.error(u)}}return o(),hs.exports=op(),hs.exports}var tc;function ip(){if(tc)return za;tc=1;var o=sp();return za.createRoot=o.createRoot,za.hydrateRoot=o.hydrateRoot,za}var up=ip();function cp(){if(typeof window>"u")return!1;const o=window;return!!(o.SpeechRecognition||o.webkitSpeechRecognition)}function dp(){if(typeof window>"u")return null;const o=window;return o.SpeechRecognition??o.webkitSpeechRecognition??null}function pp(o){const u=dp();if(!u)return o.onError("Voice input is not supported in this browser."),null;let s=new u;s.continuous=!0,s.interimResults=!0;try{s.lang=navigator.language||"en-US"}catch{s.lang="en-US"}let v=!1,m="";s.onresult=h=>{var b;let L="",E="";for(let M=h.resultIndex;M<h.results.length;M++){const P=h.results[M],S=((b=P[0])==null?void 0:b.transcript)??"";P.isFinal?E+=S:L+=S}E&&(m=(m+" "+E).trim()),o.onPartial((m+" "+L).trim())},s.onerror=h=>{const L=h.error??"unknown";v||(L==="no-speech"?o.onError("Voice: silence detected. Hold the mic and speak."):L==="not-allowed"||L==="service-not-allowed"?o.onError("Voice: microphone permission denied."):L==="aborted"||o.onError(`Voice error: ${L}`))},s.onend=()=>{v||m&&o.onCommit(m)};try{s.start()}catch(h){return o.onError(h instanceof Error?h.message:"Voice failed to start."),null}return{stop:()=>{try{s==null||s.stop()}catch{}},abort:()=>{v=!0;try{s==null||s.abort()}catch{}s=null}}}function ks(){return typeof navigator>"u"||!navigator.mediaDevices?!1:typeof navigator.mediaDevices.getUserMedia=="function"&&typeof MediaRecorder<"u"}function fp(o,u,s={}){return(async()=>{if(!ks())return u.onError("Voice: this runtime does not expose MediaRecorder."),null;let v;try{v=await navigator.mediaDevices.getUserMedia({audio:!0})}catch(b){const M=b instanceof Error?b.message:"microphone unavailable";return u.onError(`Voice: microphone permission denied or device missing (${M}).`),null}let m=s.preferredMime??"audio/webm;codecs=opus";typeof MediaRecorder.isTypeSupported=="function"&&!MediaRecorder.isTypeSupported(m)&&(m=["audio/webm","audio/ogg;codecs=opus","audio/mp4"].find(P=>MediaRecorder.isTypeSupported(P))??"");const h=m?new MediaRecorder(v,{mimeType:m}):new MediaRecorder(v),L=[];let E=!1;h.addEventListener("dataavailable",b=>{b.data&&b.data.size>0&&L.push(b.data)}),h.addEventListener("stop",()=>{if(v.getTracks().forEach(M=>M.stop()),E||L.length===0)return;const b=new Blob(L,{type:m||"audio/webm"});b.arrayBuffer().then(M=>{const P=gp(M);return u.onPartial("a transcrever…"),o.transcribeAudio(P,b.type||"audio/webm",s.language)}).then(M=>{if(E)return;const P=((M==null?void 0:M.text)??"").trim();P?u.onCommit(P):u.onError("Voice: silence detected — nada para transcrever.")}).catch(M=>{if(E)return;const P=M instanceof Error?M.message:String(M);u.onError(`Voice: ${P}`)})});try{h.start()}catch(b){return v.getTracks().forEach(M=>M.stop()),u.onError(b instanceof Error?b.message:"recorder failed to start"),null}return{stop:()=>{if(h.state==="recording")try{h.stop()}catch{}},abort:()=>{if(E=!0,h.state==="recording")try{h.stop()}catch{}v.getTracks().forEach(b=>b.stop())}}})()}function gp(o){const u=new Uint8Array(o);let s="";const v=32768;for(let m=0;m<u.length;m+=v){const h=u.subarray(m,Math.min(m+v,u.length));s+=String.fromCharCode.apply(null,Array.from(h))}return btoa(s)}function mp(o){const u=[],s=o.split(`
`);let v=0,m=[];function h(){m.length!==0&&(u.push({kind:"prose",body:m.join(`
`)}),m=[])}for(;v<s.length;){const L=s[v],E=L.match(/^```(\w[\w+-]*)?\s*$/);if(E){h();const b=E[1]||null;v++;const M=v;for(;v<s.length&&!s[v].match(/^```\s*$/);)v++;const P=s.slice(M,v).join(`
`);u.push({kind:"code",lang:b,body:P}),v++;continue}m.push(L),v++}return h(),u}const hp=[[/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/,(o,u)=>d.jsx("a",{href:o[2],target:"_blank",rel:"noopener noreferrer",className:"gauntlet-md__link",children:o[1]},`a-${u}`)],[/`([^`]+)`/,(o,u)=>d.jsx("code",{className:"gauntlet-md__inline-code",children:o[1]},`c-${u}`)],[/\*\*([^*]+)\*\*/,(o,u)=>d.jsx("strong",{className:"gauntlet-md__strong",children:o[1]},`b-${u}`)],[/\*([^*]+)\*/,(o,u)=>d.jsx("em",{className:"gauntlet-md__em",children:o[1]},`i-${u}`)],[/_([^_]+)_/,(o,u)=>d.jsx("em",{className:"gauntlet-md__em",children:o[1]},`u-${u}`)]];function bl(o,u){const s=[];let v=0,m=0;for(;v<o.length;){let h=null;for(const[L,E]of hp){const M=o.slice(v).match(L);!M||M.index===void 0||(h===null||M.index<h.idx)&&(h={idx:M.index,match:M,render:E})}if(h===null){s.push(o.slice(v));break}h.idx>0&&s.push(o.slice(v,v+h.idx)),s.push(h.render(h.match,u*100+m)),m++,v+=h.idx+h.match[0].length}return s}function xp(o,u){const s=[],v=o.split(`
`);let m=0,h=u;for(;m<v.length;){const E=v[m].trim();if(!E){m++;continue}const b=E.match(/^(#{1,3})\s+(.*)$/);if(b){const P=b[1].length,V=`h${P}`;s.push(d.jsx(V,{className:`gauntlet-md__h gauntlet-md__h${P}`,children:bl(b[2],h++)},`h-${h++}`)),m++;continue}if(/^---+$/.test(E)||/^\*\*\*+$/.test(E)){s.push(d.jsx("hr",{className:"gauntlet-md__hr"},`hr-${h++}`)),m++;continue}if(E.startsWith(">")){const P=[];for(;m<v.length&&v[m].trim().startsWith(">");)P.push(v[m].replace(/^\s*>\s?/,"")),m++;s.push(d.jsx("blockquote",{className:"gauntlet-md__quote",children:bl(P.join(" "),h++)},`q-${h++}`));continue}if(/^[-*]\s+/.test(E)){const P=[];for(;m<v.length&&/^[-*]\s+/.test(v[m].trim());)P.push(v[m].trim().replace(/^[-*]\s+/,"")),m++;s.push(d.jsx("ul",{className:"gauntlet-md__list",children:P.map((S,V)=>d.jsx("li",{className:"gauntlet-md__li",children:bl(S,h++)},V))},`ul-${h++}`));continue}if(/^\d+\.\s+/.test(E)){const P=[];for(;m<v.length&&/^\d+\.\s+/.test(v[m].trim());)P.push(v[m].trim().replace(/^\d+\.\s+/,"")),m++;s.push(d.jsx("ol",{className:"gauntlet-md__list",children:P.map((S,V)=>d.jsx("li",{className:"gauntlet-md__li",children:bl(S,h++)},V))},`ol-${h++}`));continue}const M=[];for(;m<v.length;){const P=v[m],S=P.trim();if(!S||/^(#{1,3})\s+/.test(S)||/^---+$/.test(S)||/^\*\*\*+$/.test(S)||S.startsWith(">")||/^[-*]\s+/.test(S)||/^\d+\.\s+/.test(S))break;M.push(P),m++}s.push(d.jsx("p",{className:"gauntlet-md__p",children:bl(M.join(" "),h++)},`p-${h++}`))}return s}function vp({source:o,onCopyBlock:u}){const s=mp(o);return d.jsx("div",{className:"gauntlet-md",children:s.map((v,m)=>v.kind==="code"?d.jsx(jp,{lang:v.lang,body:v.body,onCopy:u},`cb-${m}`):d.jsx("div",{className:"gauntlet-md__prose",children:xp(v.body,m*1e3)},`pb-${m}`))})}const yp=new Set(["def","class","if","elif","else","for","while","return","import","from","as","with","try","except","finally","raise","pass","break","continue","in","is","not","and","or","lambda","yield","async","await","global","nonlocal","True","False","None","self","cls","print"]),_p=new Set(["function","const","let","var","if","else","return","class","export","import","from","as","default","async","await","for","while","try","catch","finally","throw","new","this","super","extends","implements","interface","type","enum","public","private","protected","readonly","static","typeof","instanceof","in","of","null","undefined","true","false","void","switch","case","break","continue","do","yield"]),wp=new Set(["cd","ls","cat","rm","mv","cp","mkdir","touch","grep","sed","awk","export","source","if","then","else","elif","fi","for","while","do","done","case","esac","exit","npm","npx","git","python","node","tsc","make","vite","wxt","set","get","start-process","select-string"]);function pc(o,u){if(o[u]!=="#")return-1;const s=o.indexOf(`
`,u);return s===-1?o.length:s}function kp(o,u){if(o[u]!=="/")return-1;if(o[u+1]==="/"){const s=o.indexOf(`
`,u);return s===-1?o.length:s}if(o[u+1]==="*"){const s=o.indexOf("*/",u+2);return s===-1?o.length:s+2}return-1}const fc={keywords:yp,matchComment:pc},bp={keywords:_p,matchComment:kp},Sp={keywords:wp,matchComment:pc};function Ep(o){if(!o)return null;const u=o.toLowerCase();return u==="py"||u==="python"||u==="python3"||u==="ipython"||u==="pycon"?fc:u==="ts"||u==="tsx"||u==="typescript"||u==="js"||u==="jsx"||u==="javascript"||u==="mjs"||u==="json"||u==="json5"?bp:u==="sh"||u==="bash"||u==="zsh"||u==="shell"||u==="powershell"||u==="ps"||u==="ps1"||u==="console"?Sp:null}function gc(o){return o>="a"&&o<="z"||o>="A"&&o<="Z"||o==="_"||o==="$"}function Cp(o){return gc(o)||o>="0"&&o<="9"}function ys(o){return o>="0"&&o<="9"}function Np(o,u){const s=[];let v="";function m(){v&&(s.push({kind:"p",text:v}),v="")}let h=0;for(;h<o.length;){const L=o[h],E=u.matchComment(o,h);if(E!==-1){m(),s.push({kind:"c",text:o.slice(h,E)}),h=E;continue}if(u===fc&&(o.startsWith('"""',h)||o.startsWith("'''",h))){m();const b=o.slice(h,h+3);let M=o.indexOf(b,h+3);M=M===-1?o.length:M+3,s.push({kind:"s",text:o.slice(h,M)}),h=M;continue}if(L==='"'||L==="'"||L==="`"){m();let b=h+1;for(;b<o.length&&o[b]!==L;){if(o[b]==="\\"){b+=2;continue}if(o[b]===`
`&&L!=="`")break;b++}const M=b<o.length?b+1:b;s.push({kind:"s",text:o.slice(h,M)}),h=M;continue}if(ys(L)){m();let b=h;for(;b<o.length&&(ys(o[b])||o[b]==="."||o[b]==="_");)b++;if(b<o.length&&(o[b]==="e"||o[b]==="E"))for(b++,b<o.length&&(o[b]==="+"||o[b]==="-")&&b++;b<o.length&&ys(o[b]);)b++;s.push({kind:"n",text:o.slice(h,b)}),h=b;continue}if(gc(L)){m();let b=h+1;for(;b<o.length&&Cp(o[b]);)b++;const M=o.slice(h,b);let P=b;for(;P<o.length&&o[P]===" ";)P++;const S=o[P]==="(";let V="p";u.keywords.has(M)?V="k":S&&(V="f"),s.push({kind:V,text:M}),h=b;continue}v+=L,h++}return m(),s}function jp({lang:o,body:u,onCopy:s}){const v=()=>{navigator.clipboard.writeText(u).catch(()=>{}),s==null||s(u)},m=Ep(o),h=m?Np(u,m):null;return d.jsxs("figure",{className:"gauntlet-md__code",children:[d.jsxs("header",{className:"gauntlet-md__code-meta",children:[d.jsx("span",{className:"gauntlet-md__code-lang",children:o??"code"}),d.jsx("button",{type:"button",className:"gauntlet-md__code-copy",onClick:v,"aria-label":"copy code",children:"copy"})]}),d.jsx("pre",{className:"gauntlet-md__code-body",children:h?d.jsx("code",{children:h.map((L,E)=>d.jsx("span",{className:`gauntlet-md__tok gauntlet-md__tok--${L.kind}`,children:L.text},E))}):d.jsx("code",{children:u})})]})}const Tp={domains:{},actions:{},default_domain_policy:{allowed:!0,require_danger_ack:!1},default_action_policy:{allowed:!0,require_danger_ack:!1},tool_policies:{},max_page_text_chars:6e3,max_dom_skeleton_chars:4e3,screenshot_default:!1,execution_reporting_required:!1,updated_at:""},zp="2px solid #d07a5a",Pp="2px",Mp="#gauntlet-capsule-host",Lp=[/\bpassword\b/i,/\bdelete\b/i,/\bdestroy\b/i,/\bremove\b/i,/\bunsubscribe\b/i,/payment|checkout|billing/i,/credit[-_ ]?card|\bccnum\b|\bcvv\b|\bcvc\b/i],Rp=["delete","remove","destroy","drop","discard","apagar","eliminar","remover","destruir","pay","buy","purchase","order","checkout","pagar","comprar","encomendar","confirm","submit","send","publish","enviar","confirmar","publicar","transfer","withdraw","transferir","levantar","cancel subscription","cancelar subscrição","cancelar assinatura"],Dp=5e3;function Op(o){const u=o.filter(h=>h.type==="fill"),s=o.filter(h=>h.type==="click");if(u.length===0||s.length===0)return{danger:!1};const v=u.find(h=>{const L=h.selector.toLowerCase();return!!(/\bpassword\b/.test(L)||/\bcvv\b|\bcvc\b|\bccnum\b|credit[-_ ]?card/.test(L)||/payment|checkout|billing/.test(L)||/cc-(number|exp|csc|name)/.test(L))});if(!v)return{danger:!1};const m=s.find(h=>{const L=h.selector.toLowerCase();return!!(L.includes("submit")||/\b(pay|buy|purchase|confirm|send|order|checkout|pagar|comprar|enviar|confirmar)\b/.test(L))});return m?{danger:!0,reason:`cadeia destrutiva: fill em "${v.selector}" seguido de click em "${m.selector}"`}:{danger:!1}}function $p(o){var v;if(o.type==="highlight"||o.type==="scroll_to")return{danger:!1};if(o.type==="fs.read")return{danger:!1};if(o.type==="shell.run")return{danger:!0,reason:`executa "${o.cmd}" no sistema local — cabe à allowlist e ao gate GAUNTLET_ALLOW_CODE_EXEC`};if(o.type==="fs.write")return{danger:!0,reason:`grava em ${o.path} — sobrescreve o conteúdo existente`};const u=o.selector;for(const m of Lp)if(m.test(u))return{danger:!0,reason:`selector matches /${m.source}/`};let s=null;try{s=document.querySelector(u)}catch{}if(o.type==="fill")return s instanceof HTMLInputElement&&s.type==="password"?{danger:!0,reason:"password field"}:s instanceof HTMLInputElement&&(((v=s.autocomplete)==null?void 0:v.includes("cc-"))??!1)?{danger:!0,reason:"credit-card autocomplete"}:o.value.length>Dp?{danger:!0,reason:"unusually long value"}:{danger:!1};if(o.type==="click"){if(s instanceof HTMLButtonElement&&s.type==="submit")return{danger:!0,reason:"submit button"};if(s instanceof HTMLInputElement&&(s.type==="submit"||s.type==="reset"))return{danger:!0,reason:`${s.type} button`};if(s instanceof HTMLElement){const m=(s.innerText??"").trim().toLowerCase();if(m){for(const h of Rp)if(m===h||m.startsWith(h+" ")||m.endsWith(" "+h)||m.includes(" "+h+" "))return{danger:!0,reason:`action label: "${h}"`}}}return{danger:!1}}return{danger:!1}}function Ip(o){const u=o.type;return u==="fill"||u==="click"||u==="highlight"||u==="scroll_to"}async function Ap(o){const u=[];for(const s of o){if(!Ip(s)){u.push({action:s,ok:!1,error:`executor: ${s.type} is an ambient action — route through the Capsule dispatcher`});continue}try{Fp(s),await Bp(s),u.push({action:s,ok:!0})}catch(v){u.push({action:s,ok:!1,error:v instanceof Error?v.message:String(v)})}}return u}function Fp(o){const u=o.selector;if(!u||typeof u!="string")throw new Error("selector missing or not a string");if(u.includes(Mp))throw new Error(`selector targets the Gauntlet capsule itself: ${u}`);try{document.querySelector(u)}catch{throw new Error(`selector is not valid CSS: ${u}`)}}async function Bp(o){if(o.type==="fill"){Up(o.selector,o.value);return}if(o.type==="click"){Vp(o.selector);return}if(o.type==="highlight"){Wp(o.selector,o.duration_ms??1500);return}if(o.type==="scroll_to"){Hp(o.selector);return}throw new Error(`unknown action type: ${o.type??"<missing>"}`)}function Up(o,u){var v,m;const s=document.querySelector(o);if(!s)throw new Error(`selector not found: ${o}`);if(s instanceof HTMLInputElement||s instanceof HTMLTextAreaElement){s.focus({preventScroll:!0});const h=s instanceof HTMLInputElement?HTMLInputElement.prototype:HTMLTextAreaElement.prototype,L=(v=Object.getOwnPropertyDescriptor(h,"value"))==null?void 0:v.set;L?L.call(s,u):s.value=u,s.dispatchEvent(new Event("input",{bubbles:!0})),s.dispatchEvent(new Event("change",{bubbles:!0})),s.dispatchEvent(new Event("blur",{bubbles:!0}));return}if(s instanceof HTMLSelectElement){s.focus({preventScroll:!0});const h=(m=Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,"value"))==null?void 0:m.set;h?h.call(s,u):s.value=u,s.dispatchEvent(new Event("input",{bubbles:!0})),s.dispatchEvent(new Event("change",{bubbles:!0})),s.dispatchEvent(new Event("blur",{bubbles:!0}));return}if(s instanceof HTMLElement&&s.isContentEditable){s.focus(),s.textContent=u,s.dispatchEvent(new InputEvent("input",{bubbles:!0}));return}throw new Error(`element at ${o} is not fillable`)}function Vp(o){const u=document.querySelector(o);if(!u)throw new Error(`selector not found: ${o}`);if(!(u instanceof HTMLElement))throw new Error(`element at ${o} is not clickable`);const s=u.getBoundingClientRect(),v=s.left+s.width/2,m=s.top+s.height/2,h={bubbles:!0,cancelable:!0,view:window,clientX:v,clientY:m,button:0,buttons:1},L={...h,pointerId:1,pointerType:"mouse",isPrimary:!0};u.dispatchEvent(new PointerEvent("pointerdown",L)),u.dispatchEvent(new MouseEvent("mousedown",h)),u.focus({preventScroll:!0}),u.dispatchEvent(new PointerEvent("pointerup",L)),u.dispatchEvent(new MouseEvent("mouseup",h)),u.click()}function Wp(o,u){const s=document.querySelectorAll(o);if(s.length===0)throw new Error(`selector not found: ${o}`);for(const v of Array.from(s)){if(!(v instanceof HTMLElement))continue;const m=v.style.outline,h=v.style.outlineOffset;v.style.outline=zp,v.style.outlineOffset=Pp,window.setTimeout(()=>{v.style.outline=m,v.style.outlineOffset=h},u)}}function Hp(o){const u=document.querySelector(o);if(!u)throw new Error(`selector not found: ${o}`);if(!(u instanceof HTMLElement))throw new Error(`element at ${o} cannot be scrolled to`);u.scrollIntoView({behavior:"smooth",block:"center"})}const _s={},Kp="https://ruberra-backend-jkpf-production.up.railway.app",Qp=typeof import.meta<"u"?_s==null?void 0:_s.VITE_BACKEND_URL:void 0,Jp=(Qp??Kp).replace(/\/+$/,"");class Yp{constructor(u,s={}){this.ambient=u,this.backendUrl=(s.backendUrl??Jp).replace(/\/+$/,"")}captureContext(u,s){return this.ambient.transport.fetchJson("POST",`${this.backendUrl}/composer/context`,u,s)}detectIntent(u,s,v){return this.ambient.transport.fetchJson("POST",`${this.backendUrl}/composer/intent`,{context_id:u,user_input:s},v)}generatePreview(u,s){return this.ambient.transport.fetchJson("POST",`${this.backendUrl}/composer/preview`,{intent_id:u},s)}applyPreview(u,s,v,m){return this.ambient.transport.fetchJson("POST",`${this.backendUrl}/composer/apply`,{preview_id:u,approved:s,approval_reason:v??null},m)}async getToolManifests(u){return(await this.ambient.transport.fetchJson("GET",`${this.backendUrl}/tools/manifests`,void 0,u)).tools??[]}getSettings(u){return this.ambient.transport.fetchJson("GET",`${this.backendUrl}/composer/settings`,void 0,u)}updateSettings(u,s){return this.ambient.transport.fetchJson("PUT",`${this.backendUrl}/composer/settings`,u,s)}reportExecution(u,s){return this.ambient.transport.fetchJson("POST",`${this.backendUrl}/composer/execution`,u,s)}transcribeAudio(u,s,v,m){return this.ambient.transport.fetchJson("POST",`${this.backendUrl}/voice/transcribe`,{audio_base64:u,mime:s,language:v},m)}synthesizeSpeech(u,s,v){return this.ambient.transport.fetchJson("POST",`${this.backendUrl}/voice/synthesize`,{text:u,voice:s},v)}requestDomPlan(u,s,v){return this.ambient.transport.fetchJson("POST",`${this.backendUrl}/composer/dom_plan`,{context_id:u,user_input:s},v)}requestDomPlanStream(u,s,v){return this.ambient.transport.stream?this.ambient.transport.stream(`${this.backendUrl}/composer/dom_plan_stream`,{context_id:u,user_input:s},v):(v.onError("streaming not supported by this ambient"),()=>{})}}const nc="gauntlet:pill_position",ws="gauntlet:dismissed_domains",rc="gauntlet:screenshot_enabled",lc="gauntlet:theme",ac="gauntlet:palette_recent",oc="gauntlet:pill_mode",sc="gauntlet:tts_enabled",ic=8,mc="light",Gp="corner",qp={bottom:16,right:16};function uc(o){const u=typeof window<"u"?window.innerWidth:1280,s=typeof window<"u"?window.innerHeight:800,v=4,m=u-v,h=s-v;return{right:Math.max(-14,Math.min(m,o.right)),bottom:Math.max(-14,Math.min(h,o.bottom))}}function Xp(o){return{async readPillPosition(){const u=await o.get(nc);return u&&typeof u=="object"&&typeof u.bottom=="number"&&typeof u.right=="number"?uc(u):qp},async writePillPosition(u){await o.set(nc,uc(u))},async readDismissedDomains(){const u=await o.get(ws);return Array.isArray(u)?u.filter(s=>typeof s=="string"):[]},async dismissDomain(u){if(!u)return;const s=await this.readDismissedDomains();s.includes(u)||await o.set(ws,[...s,u])},async restoreDomain(u){if(!u)return;const s=await this.readDismissedDomains(),v=s.filter(m=>m!==u);v.length!==s.length&&await o.set(ws,v)},async isDomainDismissed(u){return u?(await this.readDismissedDomains()).includes(u):!1},async readScreenshotEnabled(){return await o.get(rc)===!0},async writeScreenshotEnabled(u){await o.set(rc,!!u)},async readTheme(){const u=await o.get(lc);return u==="dark"||u==="light"?u:mc},async writeTheme(u){await o.set(lc,u)},async readPaletteRecent(){const u=await o.get(ac);return Array.isArray(u)?u.filter(s=>typeof s=="string").slice(0,ic):[]},async notePaletteUse(u){if(!u)return;const s=await this.readPaletteRecent(),v=[u,...s.filter(m=>m!==u)].slice(0,ic);await o.set(ac,v)},async readPillMode(){const u=await o.get(oc);return u==="cursor"||u==="corner"?u:Gp},async writePillMode(u){await o.set(oc,u)},async readTtsEnabled(){return await o.get(sc)===!0},async writeTtsEnabled(u){await o.set(sc,!!u)}}}function Zp({ambient:o,initialSnapshot:u,onDismiss:s,cursorAnchor:v}){var mr,Ur,Wn;const m=N.useMemo(()=>new Yp(o),[o]),h=N.useMemo(()=>Xp(o.storage),[o]),L=(mr=o.domActions)==null?void 0:mr.execute,[E,b]=N.useState(u),[M,P]=N.useState(""),[S,V]=N.useState("idle"),[ge,re]=N.useState(null),[te,le]=N.useState(!1),[T,Le]=N.useState(null),[ze,be]=N.useState(null),[G,pe]=N.useState(!1),[Pe,Oe]=N.useState(""),[bt,ft]=N.useState(!1),[Dt,st]=N.useState(mc),[Ge,it]=N.useState([]),[gt,Ue]=N.useState([]),[ye,$]=N.useState(0),[Y,B]=N.useState(!1),x=N.useRef(!1),C=N.useRef(null),[Z,ee]=N.useState(!1),oe=N.useRef(""),[se,xe]=N.useState(null),fe=N.useCallback(async f=>{var ae,q;const k=[];let D=[];const A=async()=>{var F;if(D.length===0)return;if(!((F=o.domActions)!=null&&F.execute)){for(const ue of D)k.push({action:ue,ok:!1,error:"shell does not support DOM actions"});D=[];return}const ie=await o.domActions.execute(D);k.push(...ie),D=[]};for(const ie of f)if(ie.type==="shell.run"){if(await A(),!o.shellExec){k.push({action:ie,ok:!1,error:"shell.run requires a desktop ambient with shellExec"});continue}try{const F=await o.shellExec.run(ie.cmd,ie.args,ie.cwd);k.push({action:ie,ok:F.exitCode===0,error:F.exitCode===0?void 0:F.stderr||`exit ${F.exitCode}`,output:{stdout:F.stdout,stderr:F.stderr,exitCode:F.exitCode,durationMs:F.durationMs}})}catch(F){k.push({action:ie,ok:!1,error:F instanceof Error?F.message:String(F)})}}else if(ie.type==="fs.read"){if(await A(),!((ae=o.filesystem)!=null&&ae.readTextFile)){k.push({action:ie,ok:!1,error:"fs.read requires a desktop ambient with filesystem"});continue}try{const F=await o.filesystem.readTextFile(ie.path);k.push({action:ie,ok:!0,output:{text:F,bytes:new TextEncoder().encode(F).length}})}catch(F){k.push({action:ie,ok:!1,error:F instanceof Error?F.message:String(F)})}}else if(ie.type==="fs.write"){if(await A(),!((q=o.filesystem)!=null&&q.writeTextFile)){k.push({action:ie,ok:!1,error:"fs.write requires a desktop ambient with filesystem"});continue}try{const F=await o.filesystem.writeTextFile(ie.path,ie.content);k.push({action:ie,ok:!0,output:{bytes:F}})}catch(F){k.push({action:ie,ok:!1,error:F instanceof Error?F.message:String(F)})}}else D.push(ie);return await A(),k},[o]),[me,$e]=N.useState([]),[Ln,Ot]=N.useState(null),[He,Ir]=N.useState(Tp),$t=N.useRef(null),rr=N.useRef(null),St=N.useRef(null),Wt=N.useRef(""),un=N.useRef(!1),[cn,Ht]=N.useState(0),Ze=N.useRef(null),[Rn,Kt]=N.useState(!1),[lr,Ie]=N.useState(!1),[Dn,On]=N.useState(null),[$n,Et]=N.useState(0),Ct=N.useMemo(()=>T?T.actions.map($p):[],[T]),Sl=N.useMemo(()=>!T||T.actions.length===0?!1:T.actions.some(f=>{var k,D,A;return f.type==="shell.run"?!!o.shellExec:f.type==="fs.read"?!!((k=o.filesystem)!=null&&k.readTextFile):f.type==="fs.write"?!!((D=o.filesystem)!=null&&D.writeTextFile):!!((A=o.domActions)!=null&&A.execute)}),[T,o]),Qt=N.useMemo(()=>T?Op(T.actions):{danger:!1},[T]),In=N.useMemo(()=>{if(!T||T.actions.length===0)return{forced:!1,reason:null};let f="";try{f=new URL(E.url).hostname.toLowerCase()}catch{}if((He.domains[f]??He.default_domain_policy).require_danger_ack)return{forced:!0,reason:f?`policy: domain '${f}' requires explicit confirmation`:"policy: default domain policy requires explicit confirmation"};for(const D of T.actions)if((He.actions[D.type]??He.default_action_policy).require_danger_ack)return{forced:!0,reason:`policy: action type '${D.type}' requires explicit confirmation`};return{forced:!1,reason:null}},[T,E.url,He]),It=Ct.some(f=>f.danger)||Qt.danger||In.forced;N.useEffect(()=>{var f;return(f=$t.current)==null||f.focus(),()=>{var k,D;(k=rr.current)==null||k.abort(),(D=St.current)==null||D.call(St)}},[]),N.useEffect(()=>{b(u)},[u]),N.useEffect(()=>{let f=!1;return m.getToolManifests().then(k=>{f||it(k)}).catch(()=>{}),h.readPaletteRecent().then(k=>{f||Ue(k)}),()=>{f=!0}},[m,h]),N.useEffect(()=>{const f=!!E.text;f&&!x.current&&(B(!0),C.current!==null&&window.clearTimeout(C.current),C.current=window.setTimeout(()=>{B(!1),C.current=null},700)),x.current=f},[E.text]),N.useEffect(()=>()=>{C.current!==null&&(window.clearTimeout(C.current),C.current=null)},[]),N.useEffect(()=>{let f=!1;h.readTtsEnabled().then(D=>{f||ee(D)});function k(D){const A=D.detail;typeof(A==null?void 0:A.enabled)=="boolean"&&ee(A.enabled)}return window.addEventListener("gauntlet:tts",k),()=>{f=!0,window.removeEventListener("gauntlet:tts",k)}},[h]),N.useEffect(()=>{if(!Z||S!=="plan_ready")return;const f=T==null?void 0:T.compose;if(f&&f!==oe.current&&!(typeof window>"u"||!window.speechSynthesis))try{window.speechSynthesis.cancel();const k=new SpeechSynthesisUtterance(f);k.rate=1.05,k.pitch=1,window.speechSynthesis.speak(k),oe.current=f}catch{}},[Z,S,T==null?void 0:T.compose]),N.useEffect(()=>()=>{var f;try{(f=window.speechSynthesis)==null||f.cancel()}catch{}},[]),N.useEffect(()=>{let f=!1;return h.readTheme().then(k=>{f||st(k)}),()=>{f=!0}},[h]),N.useEffect(()=>{let f=!1;return m.getSettings().then(k=>{f||Ir(k)}).catch(()=>{}),()=>{f=!0}},[m]),N.useEffect(()=>{if(!o.capabilities.screenshot||!o.screenshot)return;let f=!1;return h.readScreenshotEnabled().then(k=>{const D=k||He.screenshot_default;f||!D||o.screenshot.capture().then(A=>{f||!A||xe(A)}).catch(()=>{})}),()=>{f=!0}},[o,h,He.screenshot_default]);const ar=N.useCallback(()=>{b(o.selection.read())},[o]),Ar=N.useCallback(()=>{if(Ze.current)return;re(null);const f=M,k={onPartial:A=>{P(f?`${f} ${A}`.trim():A)},onCommit:A=>{var ae;P(f?`${f} ${A}`.trim():A),Kt(!1),Ze.current=null,(ae=$t.current)==null||ae.focus()},onError:A=>{re(A),Kt(!1),Ze.current=null}};if(o.capabilities.remoteVoice&&ks()){Kt(!0),fp(m,k).then(A=>{A?Ze.current=A:Kt(!1)});return}const D=pp(k);D&&(Ze.current=D,Kt(!0))},[M,o,m]),or=N.useCallback(()=>{var f;(f=Ze.current)==null||f.stop()},[]),sr=N.useCallback(()=>{var f;(f=Ze.current)==null||f.abort(),Ze.current=null,Kt(!1)},[]);N.useEffect(()=>()=>{var f;(f=Ze.current)==null||f.abort()},[]),N.useEffect(()=>{function f(k){(k.metaKey||k.ctrlKey)&&(k.key==="k"||k.key==="K")&&(k.preventDefault(),k.stopPropagation(),Ie(A=>!A))}return window.addEventListener("keydown",f,!0),()=>window.removeEventListener("keydown",f,!0)},[]);const An=N.useCallback(f=>{On(f),window.setTimeout(()=>On(null),1400)},[]),Jt=N.useCallback(async()=>{const f=(T==null?void 0:T.compose)||E.text||M.trim();if(!f){re("Nada para guardar — escreve um pedido ou recebe uma resposta.");return}const k=(M.trim()||E.pageTitle||"cápsula note").slice(0,200);try{await o.transport.fetchJson("POST",`${m.backendUrl}/memory/records`,{topic:k,body:f,kind:"note",scope:"user"}),An("saved")}catch(D){re(D instanceof Error?`memória: ${D.message}`:"memória: falhou")}},[o,m,T,E,M,An]),et=N.useCallback(async(f,k=[],D)=>{if(!T||T.actions.length===0)return;un.current=!0;const A=T.actions.map((q,ie)=>{const F=k[ie],ue=Ct[ie];return{action:q,ok:F?F.ok:!1,error:(F==null?void 0:F.error)??null,danger:(ue==null?void 0:ue.danger)??!1,danger_reason:(ue==null?void 0:ue.reason)??null}}),ae={plan_id:T.plan_id||null,context_id:T.context_id||null,url:E.url||null,page_title:E.pageTitle||null,status:f,results:A,has_danger:It,sequence_danger_reason:Qt.danger?Qt.reason??null:null,danger_acknowledged:G,error:D??null,model_used:T.model_used||null,plan_latency_ms:T.latency_ms||null,user_input:M.trim()||null};if(He.execution_reporting_required)try{await m.reportExecution(ae)}catch(q){const ie=q instanceof Error?q.message:String(q);re(`policy: execution report rejected — ${ie}`),V("error")}else m.reportExecution(ae).catch(()=>{})},[m,T,E,Ct,It,Qt,G,M,He.execution_reporting_required]),Yt=N.useCallback(()=>{T&&T.actions.length>0&&!un.current&&et("rejected"),s()},[T,s,et]);N.useEffect(()=>{function f(k){if(k.key==="Escape"){if(k.preventDefault(),k.stopPropagation(),lr){Ie(!1);return}if(Ze.current){sr();return}Yt()}}return window.addEventListener("keydown",f,!0),()=>window.removeEventListener("keydown",f,!0)},[Yt,lr,sr]);const Fn=N.useCallback(async()=>{const f=o.filesystem;if(f){Ot(null);try{const k=await f.pickFile();if(!k)return;const D=k.name.toLowerCase();if(/\.(png|jpe?g|gif|webp|svg)$/.test(D)){const{base64:ae,mime:q}=await f.readFileBase64(k.path),ie=Math.ceil(ae.length*3/4);$e(F=>[...F,{id:`att-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,kind:"image",name:k.name,mime:q,bytes:ie,base64:ae,path:k.path}])}else{const ae=await f.readTextFile(k.path);$e(q=>[...q,{id:`att-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,kind:"text",name:k.name,mime:"text/plain",bytes:new TextEncoder().encode(ae).length,text:ae,path:k.path}])}}catch(k){Ot(k instanceof Error?k.message:String(k))}}},[o]),Bn=N.useCallback(async()=>{var k;const f=(k=o.screenshot)==null?void 0:k.captureScreen;if(f){Ot(null);try{const D=await f();if(!D){Ot("Captura de ecrã indisponível neste sistema.");return}const A=Math.ceil(D.base64.length*3/4);$e(ae=>[...ae,{id:`att-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,kind:"image",name:`ecrã-${new Date().toISOString().slice(11,19)}.png`,mime:"image/png",bytes:A,base64:D.base64,path:D.path}])}catch(D){Ot(D instanceof Error?D.message:String(D))}}},[o]),El=N.useCallback(f=>{$e(k=>k.filter(D=>D.id!==f))},[]),[Fr,ir]=N.useState(null),[Gt,qt]=N.useState(!1),[dn,Un]=N.useState(""),[Nt,Xt]=N.useState(null),[pn,Vn]=N.useState(!1),ur=N.useCallback(async()=>{const f=o.shellExec;if(!f)return;const k=dn.trim();if(!k)return;const D=k.split(/\s+/),A=D[0],ae=D.slice(1);Vn(!0),Xt(null);try{const q=await f.run(A,ae);Xt({cmd:k,stdout:q.stdout,stderr:q.stderr,exitCode:q.exitCode,durationMs:q.durationMs})}catch(q){Xt({cmd:k,stdout:"",stderr:q instanceof Error?q.message:String(q),exitCode:null,durationMs:0})}finally{Vn(!1)}},[o,dn]),cr=N.useCallback(async()=>{const f=o.filesystem;if(!(f!=null&&f.pickSavePath)||!f.writeTextFile)return;const k=(T==null?void 0:T.compose)??"";if(k.trim()){Ot(null);try{const A=`${(E.pageTitle||"gauntlet-compose").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,60)||"gauntlet-compose"}.md`,ae=await f.pickSavePath(A,["md","txt","json"]);if(!ae)return;const q=await f.writeTextFile(ae,k);ir(`${ae.split(/[\\/]/).pop()??"ficheiro"} (${q<1024?`${q} B`:`${Math.round(q/1024)} KB`})`),window.setTimeout(()=>ir(null),2500)}catch(D){Ot(D instanceof Error?D.message:String(D))}}},[o,T,E.pageTitle]),Cl=N.useCallback(f=>{if(me.length===0)return f;const k=[];for(const D of me)if(D.kind==="text"&&D.text!=null)k.push(`<file name="${D.name}" path="${D.path??""}">
${D.text}
</file>`);else if(D.kind==="image"){const A=Math.max(1,Math.round(D.bytes/1024));k.push(`<image name="${D.name}" bytes="${D.bytes}" mime="${D.mime}">[${A} KB image attached — describe in prompt; multimodal payload arrives in A2]</image>`)}return`${k.join(`

`)}

${f}`},[me]),dr=N.useCallback(async()=>{var A,ae;if(!M.trim()||S==="planning"||S==="streaming"||S==="executing")return;T&&T.actions.length>0&&!un.current&&et("rejected"),(A=rr.current)==null||A.abort(),(ae=St.current)==null||ae.call(St);const f=new AbortController;rr.current=f,V("planning"),re(null),Le(null),be(null),pe(!1),le(!1),Oe(""),Ht(0),Wt.current="",un.current=!1;const k=await h.readScreenshotEnabled(),D=af(E,k?se:null);try{const q=await m.captureContext(D,f.signal);if(f.signal.aborted)return;const ie=Cl(M.trim());St.current=m.requestDomPlanStream(q.context_id,ie,{onDelta:F=>{if(f.signal.aborted)return;Wt.current+=F,Ht(_e=>_e+1);const ue=lf(Wt.current);ue!==null?(Oe(ue),V(_e=>_e==="planning"?"streaming":_e)):V(_e=>_e==="planning"?"streaming":_e)},onDone:F=>{f.signal.aborted||(Le(F),V("plan_ready"),Oe(""),Wt.current="")},onError:F=>{f.signal.aborted||(async()=>{try{const ue=await m.requestDomPlan(q.context_id,ie,f.signal);if(f.signal.aborted)return;Le(ue),V("plan_ready"),Oe(""),Wt.current=""}catch(ue){if(f.signal.aborted)return;const _e=ue instanceof Error?ue.message:String(ue);re(`stream: ${F} · fallback: ${_e}`),V("error"),Oe(""),Wt.current=""}})()}})}catch(q){if(f.signal.aborted)return;re(q instanceof Error?q.message:String(q)),V("error")}},[m,E,se,M,S,T,et,Cl,h]),Zt=N.useCallback(f=>{var k;f.preventDefault(),$(D=>D+1);try{(k=window.speechSynthesis)==null||k.cancel()}catch{}oe.current="",dr()},[dr]),mt=N.useMemo(()=>M.startsWith("/")?M.split(`
`,1)[0].slice(1).toLowerCase():null,[M]),pr=N.useMemo(()=>{var k,D;const f=[];return o.capabilities.filesystemRead&&o.filesystem&&f.push({id:"anexar",label:"/anexar",hint:"Anexar ficheiro local",run:()=>void Fn()}),o.capabilities.screenCapture&&((k=o.screenshot)!=null&&k.captureScreen)&&f.push({id:"ecra",label:"/ecrã",hint:"Capturar ecrã inteiro",run:()=>void Bn()}),o.capabilities.shellExecute&&o.shellExec&&f.push({id:"shell",label:"/shell",hint:Gt?"Fechar shell rápida":"Abrir shell rápida",run:()=>qt(A=>!A)}),o.capabilities.filesystemWrite&&((D=o.filesystem)!=null&&D.writeTextFile)&&(T!=null&&T.compose)&&f.push({id:"guardar",label:"/guardar",hint:"Guardar resposta para ficheiro",run:()=>void cr()}),f.push({id:"limpar",label:"/limpar",hint:"Esvaziar input",run:()=>{var A;P(""),(A=$t.current)==null||A.focus()}}),f.push({id:"fechar",label:"/fechar",hint:"Dispensar cápsula",run:()=>Yt()}),f.push({id:"palette",label:"/palette",hint:"Abrir command palette completa (⌘K)",run:()=>{P(""),Ie(!0)}}),f},[o,Fn,Bn,Yt,T,cr,Gt]),jt=N.useMemo(()=>mt===null?[]:mt===""?pr:pr.filter(f=>f.id.startsWith(mt)||f.label.includes(mt)),[pr,mt]);N.useEffect(()=>{Et(0)},[mt]);const fr=N.useCallback(f=>{const k=jt[f];k&&(P(""),Et(0),k.run())},[jt]),Nl=N.useCallback(f=>{if(mt!==null&&jt.length>0){if(f.key==="ArrowDown"){f.preventDefault(),Et(k=>(k+1)%jt.length);return}if(f.key==="ArrowUp"){f.preventDefault(),Et(k=>(k-1+jt.length)%jt.length);return}if(f.key==="Enter"&&!f.shiftKey){f.preventDefault(),fr($n);return}if(f.key==="Escape"){f.preventDefault(),P("");return}}f.key==="Enter"&&(f.shiftKey||(f.preventDefault(),dr()))},[dr,fr,$n,jt,mt]),Br=N.useCallback(async()=>{if(T!=null&&T.compose)try{await navigator.clipboard.writeText(T.compose),le(!0),window.setTimeout(()=>le(!1),1500)}catch{re("Clipboard write blocked. Select the text and copy manually.")}},[T]),jl=N.useCallback(async()=>{var f;if(!(!T||T.actions.length===0)&&!(It&&!G)){V("executing"),re(null);try{const k=await fe(T.actions);be(k),V("executed");const D=k.every(A=>A.ok);window.dispatchEvent(new CustomEvent("gauntlet:execute-result",{detail:{ok:D}})),(f=o.notifications)==null||f.notify(D?"Gauntlet — plano executado":"Gauntlet — plano com falhas",D?`${k.length} ${k.length===1?"acção":"acções"} OK`:`${k.filter(A=>!A.ok).length}/${k.length} falharam — revê na cápsula`),await et("executed",k)}catch(k){const D=k instanceof Error?k.message:String(k);re(D),V("error"),window.dispatchEvent(new CustomEvent("gauntlet:execute-result",{detail:{ok:!1}})),await et("failed",[],D)}}},[L,T,It,G,et]),gr=N.useMemo(()=>E.bbox?E.bbox:v?{x:v.x,y:v.y,width:0,height:0}:null,[E.bbox,v]),Ma=N.useMemo(()=>{if(!gr)return;const f=typeof window<"u"?window.innerWidth:1280,k=typeof window<"u"?window.innerHeight:800,D=sf(f,k),A=uf(gr,{width:f,height:k},D);return{top:`${A.top}px`,left:`${A.left}px`}},[gr]),Ee=`gauntlet-capsule--phase-${S}`,La=["gauntlet-capsule","gauntlet-capsule--floating",gr?"gauntlet-capsule--anchored":"gauntlet-capsule--centered",E.text?null:"gauntlet-capsule--no-selection",Ee].filter(Boolean).join(" ");return N.useEffect(()=>{window.dispatchEvent(new CustomEvent("gauntlet:phase",{detail:{phase:S}}))},[S]),d.jsxs("div",{className:La,"data-theme":Dt,role:"dialog","aria-label":"Gauntlet",style:Ma,children:[d.jsx("div",{className:"gauntlet-capsule__aurora","aria-hidden":!0}),d.jsxs("div",{className:"gauntlet-capsule__layout",children:[d.jsxs("div",{className:"gauntlet-capsule__panel gauntlet-capsule__panel--left",children:[d.jsxs("header",{className:"gauntlet-capsule__header",children:[d.jsxs("div",{className:"gauntlet-capsule__brand-block",children:[d.jsx("span",{className:"gauntlet-capsule__mark","aria-hidden":!0,children:d.jsx("span",{className:"gauntlet-capsule__mark-dot"})}),d.jsxs("div",{className:"gauntlet-capsule__brand-text",children:[d.jsx("span",{className:"gauntlet-capsule__brand",children:"GAUNTLET"}),d.jsx("span",{className:"gauntlet-capsule__tagline",children:"cursor · capsule"})]})]}),d.jsxs("div",{className:"gauntlet-capsule__header-actions",children:[d.jsx("button",{type:"button",className:"gauntlet-capsule__settings-btn",onClick:()=>ft(f=>!f),"aria-label":"Definições","aria-expanded":bt,title:"Definições",children:d.jsx("span",{"aria-hidden":!0,children:"···"})}),d.jsx("button",{type:"button",className:"gauntlet-capsule__close",onClick:Yt,"aria-label":"Dismiss capsule (Esc)",children:d.jsx("span",{"aria-hidden":!0,children:"esc"})})]})]}),bt&&d.jsx(rf,{onClose:()=>ft(!1),showScreenshot:o.capabilities.screenshot,showDismissedDomains:o.capabilities.dismissDomain,showPillMode:o.capabilities.pillSurface,prefs:h,theme:Dt,onChangeTheme:f=>{st(f),h.writeTheme(f)}}),d.jsxs("section",{className:"gauntlet-capsule__context",children:[d.jsxs("div",{className:"gauntlet-capsule__context-meta",children:[d.jsx("span",{className:`gauntlet-capsule__source${Y?" gauntlet-capsule__source--popped":""}`,children:o.shell}),d.jsx("span",{className:"gauntlet-capsule__url",title:E.url,children:E.pageTitle||E.url}),(T==null?void 0:T.model_used)&&d.jsxs("span",{className:"gauntlet-capsule__model-chip",title:`Modelo usado · ${T.latency_ms} ms`,children:[d.jsx("span",{className:"gauntlet-capsule__model-chip-dot","aria-hidden":!0}),T.model_used]}),d.jsx("button",{type:"button",className:"gauntlet-capsule__refresh",onClick:ar,title:"Re-read current selection",children:"re-read"})]}),E.text?d.jsx("pre",{className:"gauntlet-capsule__selection",children:hc(E.text,600)}):d.jsx(nf,{snapshot:E,screenshotEnabled:se!==null})]})]}),d.jsxs("div",{className:"gauntlet-capsule__panel gauntlet-capsule__panel--right",children:[d.jsxs("form",{className:"gauntlet-capsule__form",onSubmit:Zt,children:[me.length>0&&d.jsx("div",{className:"gauntlet-capsule__attachments","aria-label":"Anexos",children:me.map(f=>d.jsxs("span",{className:`gauntlet-capsule__attachment gauntlet-capsule__attachment--${f.kind}`,title:f.path??f.name,children:[d.jsx("span",{className:"gauntlet-capsule__attachment-icon","aria-hidden":!0,children:f.kind==="image"?"◫":"⌥"}),d.jsx("span",{className:"gauntlet-capsule__attachment-name",children:f.name}),d.jsx("span",{className:"gauntlet-capsule__attachment-size",children:f.bytes<1024?`${f.bytes} B`:f.bytes<1024*1024?`${Math.round(f.bytes/1024)} KB`:`${(f.bytes/(1024*1024)).toFixed(1)} MB`}),d.jsx("button",{type:"button",className:"gauntlet-capsule__attachment-remove",onClick:()=>El(f.id),"aria-label":`Remover ${f.name}`,children:"×"})]},f.id))}),Ln&&d.jsx("div",{className:"gauntlet-capsule__attach-error",role:"alert",children:Ln}),Gt&&o.shellExec&&d.jsxs("div",{className:"gauntlet-capsule__shell-panel",children:[d.jsxs("div",{className:"gauntlet-capsule__shell-row",children:[d.jsx("span",{className:"gauntlet-capsule__shell-prompt","aria-hidden":!0,children:"$"}),d.jsx("input",{type:"text",className:"gauntlet-capsule__shell-input",placeholder:"git status — comandos da allowlist",value:dn,onChange:f=>Un(f.target.value),onKeyDown:f=>{f.key==="Enter"&&!f.shiftKey&&(f.preventDefault(),ur())},disabled:pn,spellCheck:!1,autoComplete:"off"}),d.jsx("button",{type:"button",className:"gauntlet-capsule__shell-run",onClick:()=>void ur(),disabled:pn||!dn.trim(),children:pn?"…":"Executar"})]}),Nt&&d.jsxs("div",{className:"gauntlet-capsule__shell-output",children:[d.jsxs("div",{className:"gauntlet-capsule__shell-meta",children:[d.jsxs("span",{className:"gauntlet-capsule__shell-meta-cmd",children:["$ ",Nt.cmd]}),d.jsxs("span",{className:"gauntlet-capsule__shell-meta-stat",children:[Nt.exitCode===null?"erro":`exit ${Nt.exitCode}`," · ",Nt.durationMs," ms"]})]}),Nt.stdout&&d.jsx("pre",{className:"gauntlet-capsule__shell-stdout",children:Nt.stdout}),Nt.stderr&&d.jsx("pre",{className:"gauntlet-capsule__shell-stderr",children:Nt.stderr})]})]}),mt!==null&&jt.length>0&&d.jsx("div",{className:"gauntlet-capsule__slash",role:"listbox",children:jt.map((f,k)=>d.jsxs("button",{type:"button",role:"option","aria-selected":k===$n,className:`gauntlet-capsule__slash-item${k===$n?" gauntlet-capsule__slash-item--active":""}`,onMouseEnter:()=>Et(k),onClick:()=>fr(k),children:[d.jsx("span",{className:"gauntlet-capsule__slash-label",children:f.label}),d.jsx("span",{className:"gauntlet-capsule__slash-hint",children:f.hint})]},f.id))}),d.jsx("textarea",{ref:$t,className:"gauntlet-capsule__input",placeholder:"O que queres? / abre comandos · Enter envia · Shift+Enter nova linha",value:M,onChange:f=>P(f.target.value),onKeyDown:Nl,rows:2,disabled:S==="planning"||S==="streaming"||S==="executing"}),d.jsxs("div",{className:"gauntlet-capsule__actions",children:[d.jsxs("span",{className:"gauntlet-capsule__hint","aria-hidden":!0,children:[d.jsx("span",{className:"gauntlet-capsule__kbd",children:"↵"}),d.jsx("span",{className:"gauntlet-capsule__kbd-sep",children:"·"}),d.jsx("span",{className:"gauntlet-capsule__kbd",children:"⌘K"})]}),o.capabilities.filesystemRead&&o.filesystem&&d.jsxs("button",{type:"button",className:"gauntlet-capsule__attach-btn",onClick:()=>void Fn(),"aria-label":"Anexar ficheiro local",title:"Anexar ficheiro do disco",disabled:S==="planning"||S==="streaming"||S==="executing",children:[d.jsx("svg",{viewBox:"0 0 24 24",width:"13",height:"13","aria-hidden":!0,children:d.jsx("path",{d:"M14 4l-2 0 0 8-3 0 4 5 4-5-3 0 0-8z",transform:"rotate(45 12 12)",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinejoin:"round"})}),d.jsx("span",{className:"gauntlet-capsule__attach-label",children:"anexar"})]}),o.capabilities.screenCapture&&((Ur=o.screenshot)==null?void 0:Ur.captureScreen)&&d.jsxs("button",{type:"button",className:"gauntlet-capsule__attach-btn",onClick:()=>void Bn(),"aria-label":"Capturar ecrã inteiro",title:"Capturar ecrã inteiro",disabled:S==="planning"||S==="streaming"||S==="executing",children:[d.jsxs("svg",{viewBox:"0 0 24 24",width:"13",height:"13","aria-hidden":!0,children:[d.jsx("rect",{x:"3",y:"5",width:"18",height:"13",rx:"2",fill:"none",stroke:"currentColor",strokeWidth:"1.6"}),d.jsx("circle",{cx:"12",cy:"11.5",r:"2.4",fill:"none",stroke:"currentColor",strokeWidth:"1.6"})]}),d.jsx("span",{className:"gauntlet-capsule__attach-label",children:"ecrã"})]}),o.capabilities.shellExecute&&o.shellExec&&d.jsxs("button",{type:"button",className:`gauntlet-capsule__attach-btn${Gt?" gauntlet-capsule__attach-btn--active":""}`,onClick:()=>qt(f=>!f),"aria-label":"Shell rápida",title:"Shell rápida (allowlist + GAUNTLET_ALLOW_CODE_EXEC)","aria-expanded":Gt,children:[d.jsx("svg",{viewBox:"0 0 24 24",width:"13",height:"13","aria-hidden":!0,children:d.jsx("path",{d:"M5 7l4 4-4 4M11 16h7",stroke:"currentColor",strokeWidth:"1.7",fill:"none",strokeLinecap:"round",strokeLinejoin:"round"})}),d.jsx("span",{className:"gauntlet-capsule__attach-label",children:"shell"})]}),(cp()||o.capabilities.remoteVoice&&ks())&&d.jsxs("button",{type:"button",className:`gauntlet-capsule__voice${Rn?" gauntlet-capsule__voice--active":""}`,onPointerDown:f=>{f.preventDefault(),Ar()},onPointerUp:()=>or(),onPointerLeave:()=>{Rn&&or()},"aria-label":Rn?"A ouvir — solta para enviar":"Premer e falar",title:"Premir e falar",disabled:S==="planning"||S==="streaming"||S==="executing",children:[d.jsxs("svg",{viewBox:"0 0 24 24",width:"13",height:"13","aria-hidden":!0,children:[d.jsx("path",{d:"M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3z",fill:"currentColor"}),d.jsx("path",{d:"M19 11a7 7 0 0 1-14 0M12 18v3",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",fill:"none"})]}),d.jsx("span",{className:"gauntlet-capsule__voice-label",children:Rn?"a ouvir":"voz"})]}),d.jsxs("button",{type:"submit",className:"gauntlet-capsule__compose",disabled:S==="planning"||S==="streaming"||S==="executing"||!M.trim(),children:[ye>0&&d.jsx("span",{className:"gauntlet-capsule__compose-ripple","aria-hidden":!0},ye),S==="planning"||S==="streaming"?d.jsxs(d.Fragment,{children:[d.jsx("span",{className:"gauntlet-capsule__compose-spinner","aria-hidden":!0}),d.jsx("span",{children:S==="planning"?"a pensar":"a escrever"})]}):"Enviar"]})]})]}),S==="streaming"&&Pe&&d.jsxs("section",{className:"gauntlet-capsule__compose-result gauntlet-capsule__compose-result--streaming",children:[d.jsxs("header",{className:"gauntlet-capsule__compose-meta",children:[d.jsx("span",{className:"gauntlet-capsule__compose-tag",children:"resposta"}),d.jsxs("span",{className:"gauntlet-capsule__compose-meta-text",children:[d.jsxs("span",{className:"gauntlet-capsule__token-counter gauntlet-capsule__token-counter--pulse","aria-live":"polite",children:[cn," chunks"]},cn),d.jsx("span",{"aria-hidden":!0,children:"·"}),d.jsx("span",{children:"a escrever…"})]})]}),d.jsx("div",{className:"gauntlet-capsule__progress-bar",role:"progressbar","aria-label":"A receber resposta","aria-valuetext":"indeterminate",children:d.jsx("span",{className:"gauntlet-capsule__progress-bar-track"})}),d.jsxs("div",{className:"gauntlet-capsule__compose-text gauntlet-capsule__compose-text--streaming",children:[Pe,d.jsx("span",{className:"gauntlet-capsule__compose-caret","aria-hidden":!0,children:"▍"})]})]}),(S==="planning"||S==="streaming"&&!Pe)&&d.jsxs("section",{className:"gauntlet-capsule__skeleton",role:"status","aria-live":"polite","aria-label":"A pensar...",children:[d.jsxs("header",{className:"gauntlet-capsule__skeleton-header",children:[d.jsx("span",{className:"gauntlet-capsule__skeleton-tag"}),d.jsx("span",{className:"gauntlet-capsule__skeleton-meta"})]}),d.jsx("div",{className:"gauntlet-capsule__skeleton-line gauntlet-capsule__skeleton-line--w90"}),d.jsx("div",{className:"gauntlet-capsule__skeleton-line gauntlet-capsule__skeleton-line--w75"}),d.jsx("div",{className:"gauntlet-capsule__skeleton-line gauntlet-capsule__skeleton-line--w55"})]}),(T==null?void 0:T.compose)&&S==="plan_ready"&&d.jsxs("section",{className:"gauntlet-capsule__compose-result",children:[d.jsxs("header",{className:"gauntlet-capsule__compose-meta",children:[d.jsx("span",{className:"gauntlet-capsule__compose-tag",children:"resposta"}),d.jsxs("span",{className:"gauntlet-capsule__compose-meta-text",children:[T.model_used," · ",T.latency_ms," ms"]})]}),d.jsx("div",{className:"gauntlet-capsule__compose-text",children:d.jsx(vp,{source:T.compose,onCopyBlock:()=>An("code copied")})}),d.jsxs("div",{className:"gauntlet-capsule__compose-actions",children:[d.jsx("button",{type:"button",className:"gauntlet-capsule__copy",onClick:()=>void Br(),children:te?"copiado ✓":"Copy"}),d.jsx("button",{type:"button",className:"gauntlet-capsule__copy gauntlet-capsule__copy--ghost",onClick:()=>void Jt(),children:Dn==="saved"?"guardado ✓":"Save"}),o.capabilities.filesystemWrite&&((Wn=o.filesystem)==null?void 0:Wn.writeTextFile)&&d.jsx("button",{type:"button",className:"gauntlet-capsule__copy gauntlet-capsule__copy--ghost",onClick:()=>void cr(),title:"Guardar resposta para um ficheiro",children:Fr?`→ ${Fr}`:"Guardar como"})]})]}),T&&T.actions.length===0&&!T.compose&&S==="plan_ready"&&d.jsx("section",{className:"gauntlet-capsule__plan",children:d.jsx("p",{className:"gauntlet-capsule__plan-empty",children:T.reason??"Modelo não conseguiu planear."})}),T&&T.actions.length>0&&(S==="plan_ready"||S==="executing"||S==="executed")&&d.jsxs("section",{className:"gauntlet-capsule__plan",children:[d.jsxs("header",{className:"gauntlet-capsule__plan-header",children:[d.jsx("span",{className:"gauntlet-capsule__plan-title",children:"plano"}),d.jsxs("span",{className:"gauntlet-capsule__plan-meta",children:[T.actions.length," action",T.actions.length===1?"":"s"," · ",T.model_used," · ",T.latency_ms," ms"]})]}),d.jsx("ol",{className:"gauntlet-capsule__plan-list",children:T.actions.map((f,k)=>{const D=ze==null?void 0:ze[k],A=D?D.ok?"ok":"fail":"pending",ae=Ct[k];return d.jsxs("li",{className:`gauntlet-capsule__plan-item gauntlet-capsule__plan-item--${A}${ae!=null&&ae.danger?" gauntlet-capsule__plan-item--danger":""}`,children:[d.jsx("span",{className:"gauntlet-capsule__plan-step",children:k+1}),d.jsx("span",{className:"gauntlet-capsule__plan-desc",children:of(f)}),(ae==null?void 0:ae.danger)&&d.jsx("span",{className:"gauntlet-capsule__plan-danger",title:ae.reason,children:"sensível"}),D&&!D.ok&&d.jsx("span",{className:"gauntlet-capsule__plan-err",title:D.error,children:D.error})]},`${k}-${f.type}-${"selector"in f?f.selector:"path"in f?f.path:f.cmd}`)})}),S!=="executed"&&It&&d.jsxs("div",{className:"gauntlet-capsule__danger-gate",role:"alert",children:[d.jsxs("header",{className:"gauntlet-capsule__danger-header",children:[d.jsx("span",{className:"gauntlet-capsule__danger-mark","aria-hidden":!0,children:"!"}),d.jsx("span",{className:"gauntlet-capsule__danger-title",children:"Acções sensíveis no plano"})]}),d.jsxs("ul",{className:"gauntlet-capsule__danger-list",children:[In.forced&&In.reason&&d.jsxs("li",{children:[d.jsx("strong",{children:"governança:"})," ",In.reason]},"danger-policy"),Qt.danger&&d.jsxs("li",{children:[d.jsx("strong",{children:"cadeia:"})," ",Qt.reason??"flagged"]},"danger-sequence"),Ct.map((f,k)=>f.danger?d.jsxs("li",{children:[d.jsxs("strong",{children:["step ",k+1,":"]})," ",f.reason??"flagged"]},`danger-${k}`):null)]}),d.jsxs("label",{className:"gauntlet-capsule__danger-confirm",children:[d.jsx("input",{type:"checkbox",checked:G,onChange:f=>pe(f.target.checked),disabled:S==="executing"}),d.jsx("span",{children:"Confirmo, executar mesmo assim."})]})]}),S!=="executed"&&Sl&&d.jsx("div",{className:"gauntlet-capsule__plan-actions",children:d.jsx("button",{type:"button",className:`gauntlet-capsule__execute${It?" gauntlet-capsule__execute--danger":""}`,onClick:()=>void jl(),disabled:S==="executing"||It&&!G,children:S==="executing"?"executando…":It?"Executar com cuidado":"Executar"})}),S!=="executed"&&!Sl&&d.jsx("p",{className:"gauntlet-capsule__plan-empty",children:"esta superfície não tem adapter para nenhuma destas acções — abre o Gauntlet num shell que as suporte."})]}),S==="error"&&ge&&d.jsxs("div",{className:"gauntlet-capsule__error",role:"alert",children:[d.jsx("span",{className:"gauntlet-capsule__error-icon","aria-hidden":!0,children:"!"}),d.jsx("span",{children:ge})]})]})]}),lr&&d.jsx(tf,{onClose:()=>Ie(!1),recentIds:gt,actions:(()=>{var q,ie;const f=F=>{Ue(ue=>[F,...ue.filter(At=>At!==F)].slice(0,8)),h.notePaletteUse(F)},k=F=>{P(ue=>{const _e=ue.trimEnd(),At=`usa a tool ${F} para `;return _e.startsWith("usa a tool ")?At:_e?`${At}${_e}`:At}),window.setTimeout(()=>{const ue=$t.current;ue&&(ue.focus(),ue.setSelectionRange(ue.value.length,ue.value.length))},0)},D=[{id:"focus",label:"Focar input",shortcut:"↵",group:"action",run:()=>{f("focus"),Ie(!1),window.setTimeout(()=>{var F;return(F=$t.current)==null?void 0:F.focus()},0)}},{id:"copy",label:"Copiar resposta",shortcut:"⌘C",group:"action",disabled:!(T!=null&&T.compose),run:()=>{f("copy"),Ie(!1),Br()}},{id:"save",label:"Guardar em memória",shortcut:"S",group:"action",disabled:!(T!=null&&T.compose)&&!E.text&&!M.trim(),run:()=>{f("save"),Ie(!1),Jt()}},...o.capabilities.filesystemRead&&o.filesystem?[{id:"attach-file",label:"Anexar ficheiro local",description:"Abre o file picker e anexa o conteúdo ao prompt",shortcut:"",group:"action",run:()=>{f("attach-file"),Ie(!1),Fn()}}]:[],...o.capabilities.screenCapture&&((q=o.screenshot)!=null&&q.captureScreen)?[{id:"attach-screen",label:"Capturar ecrã inteiro",description:"Anexa um screenshot do ecrã primário",shortcut:"",group:"action",run:()=>{f("attach-screen"),Ie(!1),Bn()}}]:[],...o.capabilities.shellExecute&&o.shellExec?[{id:"shell-toggle",label:Gt?"Fechar shell rápida":"Abrir shell rápida",description:"Painel inline para correr comandos da allowlist",shortcut:"",group:"action",run:()=>{f("shell-toggle"),Ie(!1),qt(F=>!F)}}]:[],...o.capabilities.filesystemWrite&&((ie=o.filesystem)!=null&&ie.writeTextFile)?[{id:"save-disk",label:"Guardar resposta em ficheiro",description:"Save dialog → escreve compose para o disco",shortcut:"",group:"action",disabled:!(T!=null&&T.compose),run:()=>{f("save-disk"),Ie(!1),cr()}}]:[],{id:"reread",label:"Re-ler contexto",shortcut:"R",group:"action",run:()=>{f("reread"),Ie(!1),ar()}},{id:"clear",label:"Limpar input",shortcut:"X",group:"action",disabled:!M,run:()=>{var F;f("clear"),Ie(!1),P(""),(F=$t.current)==null||F.focus()}},{id:"dismiss",label:"Fechar cápsula",shortcut:"Esc",group:"action",run:()=>{f("dismiss"),Ie(!1),Yt()}}],ae=Ge.filter(F=>{var _e;const ue=(_e=He.tool_policies)==null?void 0:_e[F.name];return!ue||ue.allowed!==!1}).map(F=>{var ue,_e;return{id:`tool:${F.name}`,label:F.name,description:F.description,shortcut:"",group:"tool",mode:F.mode,risk:F.risk,requiresApproval:((_e=(ue=He.tool_policies)==null?void 0:ue[F.name])==null?void 0:_e.require_approval)===!0,run:()=>{f(`tool:${F.name}`),Ie(!1),k(F.name)}}});return[...D,...ae]})()}),Dn&&d.jsx("div",{className:"gauntlet-capsule__flash",role:"status","aria-live":"polite",children:Dn})]})}function ef(o,u){if(!o)return 0;const s=o.toLowerCase(),v=u.toLowerCase();if(v.includes(s))return 1e3-v.indexOf(s);let m=0,h=0,L=-2;for(let E=0;E<v.length&&m<s.length;E++)v[E]===s[m]&&(E!==L+1&&h++,L=E,m++);return m<s.length?-1:500-h*10-(v.length-s.length)}function tf({actions:o,onClose:u,recentIds:s}){const[v,m]=N.useState(""),[h,L]=N.useState(0),E=N.useRef(null);N.useEffect(()=>{var P;(P=E.current)==null||P.focus()},[]);const b=N.useMemo(()=>{if(!v){const S=new Map(s.map((re,te)=>[re,te])),V=re=>{const te=S.get(re.id);return te===void 0?s.length:te};return[...o].sort((re,te)=>{const le=V(re),T=V(te);if(le!==T)return le-T;const Le=G=>G==="tool"?1:0,ze=Le(re.group),be=Le(te.group);return ze!==be?ze-be:re.label.localeCompare(te.label)})}return o.map(S=>{const V=`${S.label} ${S.id} ${S.description??""}`;return{a:S,score:ef(v,V)}}).filter(S=>S.score>=0).sort((S,V)=>V.score-S.score).map(S=>S.a)},[o,v,s]);N.useEffect(()=>{h>=b.length&&L(0)},[b.length,h]);const M=N.useCallback(P=>{if(P.key==="ArrowDown")P.preventDefault(),L(S=>Math.min(S+1,b.length-1));else if(P.key==="ArrowUp")P.preventDefault(),L(S=>Math.max(S-1,0));else if(P.key==="Enter"){P.preventDefault();const S=b[h];S&&!S.disabled&&S.run()}},[b,h]);return d.jsxs("div",{className:"gauntlet-capsule__palette",role:"dialog","aria-label":"Command palette",children:[d.jsx("div",{className:"gauntlet-capsule__palette-scrim",onClick:u}),d.jsxs("div",{className:"gauntlet-capsule__palette-panel",onKeyDown:M,children:[d.jsx("input",{ref:E,className:"gauntlet-capsule__palette-input",type:"text",placeholder:"comandos · tools…  (↑↓ para navegar, ↵ para correr, esc para fechar)",value:v,onChange:P=>m(P.target.value)}),d.jsx("ul",{className:"gauntlet-capsule__palette-list",role:"listbox",children:b.length===0?d.jsx("li",{className:"gauntlet-capsule__palette-empty",children:"sem resultados"}):b.map((P,S)=>d.jsxs("li",{role:"option","aria-selected":S===h,"aria-disabled":P.disabled,onMouseEnter:()=>L(S),onClick:()=>{P.disabled||P.run()},className:`gauntlet-capsule__palette-item${S===h?" gauntlet-capsule__palette-item--active":""}${P.disabled?" gauntlet-capsule__palette-item--disabled":""}${P.group==="tool"?" gauntlet-capsule__palette-item--tool":""}`,children:[d.jsxs("div",{className:"gauntlet-capsule__palette-main",children:[d.jsx("span",{className:"gauntlet-capsule__palette-label",children:P.label}),P.description&&d.jsx("span",{className:"gauntlet-capsule__palette-desc",children:P.description})]}),d.jsxs("div",{className:"gauntlet-capsule__palette-meta",children:[P.mode&&d.jsx("span",{className:`gauntlet-capsule__palette-badge gauntlet-capsule__palette-badge--mode-${P.mode}`,title:`mode: ${P.mode}`,children:P.mode}),P.risk&&P.risk!=="low"&&d.jsx("span",{className:`gauntlet-capsule__palette-badge gauntlet-capsule__palette-badge--risk-${P.risk}`,title:`risk: ${P.risk}`,children:P.risk}),P.requiresApproval&&d.jsx("span",{className:"gauntlet-capsule__palette-badge gauntlet-capsule__palette-badge--approval",title:"requires explicit approval before running",children:"approval"}),P.shortcut&&d.jsx("span",{className:"gauntlet-capsule__palette-shortcut",children:P.shortcut})]})]},P.id))})]})]})}function hc(o,u){return o.length<=u?o:o.slice(0,u)+"…"}function nf({snapshot:o,screenshotEnabled:u}){const s=(()=>{if(!o.domSkeleton)return 0;try{const m=JSON.parse(o.domSkeleton);if(Array.isArray(m))return m.length}catch{}return 0})(),v=!!o.pageText;return d.jsxs("ul",{className:"gauntlet-capsule__context-summary","aria-label":"context",children:[d.jsxs("li",{children:[d.jsx("span",{className:"gauntlet-capsule__context-key",children:"selection"}),d.jsx("span",{className:"gauntlet-capsule__context-val gauntlet-capsule__context-val--muted",children:"none"})]}),d.jsxs("li",{children:[d.jsx("span",{className:"gauntlet-capsule__context-key",children:"page captured"}),d.jsx("span",{className:"gauntlet-capsule__context-val",children:v?"yes":"no"})]}),d.jsxs("li",{children:[d.jsx("span",{className:"gauntlet-capsule__context-key",children:"DOM captured"}),d.jsx("span",{className:"gauntlet-capsule__context-val",children:s>0?`${s} elements`:"—"})]}),d.jsxs("li",{children:[d.jsx("span",{className:"gauntlet-capsule__context-key",children:"screenshot"}),d.jsx("span",{className:"gauntlet-capsule__context-val",children:u?"on":"off"})]})]})}function rf({onClose:o,showScreenshot:u,prefs:s,showDismissedDomains:v,theme:m,onChangeTheme:h,showPillMode:L}){const[E,b]=N.useState([]),[M,P]=N.useState(!0),[S,V]=N.useState(!1),[ge,re]=N.useState("corner"),[te,le]=N.useState(!1);N.useEffect(()=>{let G=!1;return v&&s.readDismissedDomains().then(pe=>{G||b(pe)}),s.readScreenshotEnabled().then(pe=>{G||(V(pe),P(!1))}),s.readPillMode().then(pe=>{G||re(pe)}),s.readTtsEnabled().then(pe=>{G||le(pe)}),()=>{G=!0}},[s,v]);const T=N.useCallback(async G=>{re(G),await s.writePillMode(G),window.dispatchEvent(new CustomEvent("gauntlet:pill-mode",{detail:{mode:G}}))},[s]),Le=N.useCallback(async G=>{var pe;if(le(G),await s.writeTtsEnabled(G),!G)try{(pe=window.speechSynthesis)==null||pe.cancel()}catch{}window.dispatchEvent(new CustomEvent("gauntlet:tts",{detail:{enabled:G}}))},[s]),ze=N.useCallback(async G=>{await s.restoreDomain(G),b(pe=>pe.filter(Pe=>Pe!==G))},[s]),be=N.useCallback(async G=>{V(G),await s.writeScreenshotEnabled(G)},[s]);return d.jsxs("section",{className:"gauntlet-capsule__settings",role:"region","aria-label":"Definições",children:[d.jsxs("header",{className:"gauntlet-capsule__settings-header",children:[d.jsx("span",{className:"gauntlet-capsule__settings-title",children:"definições"}),d.jsx("button",{type:"button",className:"gauntlet-capsule__settings-close",onClick:o,"aria-label":"Fechar definições",children:"×"})]}),d.jsxs("div",{className:"gauntlet-capsule__settings-section",children:[d.jsx("span",{className:"gauntlet-capsule__settings-subtitle",children:"aparência"}),d.jsxs("div",{className:"gauntlet-capsule__theme-switch",role:"radiogroup","aria-label":"tema",children:[d.jsxs("button",{type:"button",className:`gauntlet-capsule__theme-option${m==="light"?" gauntlet-capsule__theme-option--active":""}`,onClick:()=>h("light"),role:"radio","aria-checked":m==="light",children:[d.jsx("span",{className:"gauntlet-capsule__theme-swatch gauntlet-capsule__theme-swatch--light","aria-hidden":!0}),d.jsx("span",{children:"flagship light"})]}),d.jsxs("button",{type:"button",className:`gauntlet-capsule__theme-option${m==="dark"?" gauntlet-capsule__theme-option--active":""}`,onClick:()=>h("dark"),role:"radio","aria-checked":m==="dark",children:[d.jsx("span",{className:"gauntlet-capsule__theme-swatch gauntlet-capsule__theme-swatch--dark","aria-hidden":!0}),d.jsx("span",{children:"night premium"})]})]})]}),L&&d.jsxs("div",{className:"gauntlet-capsule__settings-section",children:[d.jsx("span",{className:"gauntlet-capsule__settings-subtitle",children:"pill"}),d.jsxs("div",{className:"gauntlet-capsule__theme-switch",role:"radiogroup","aria-label":"pill mode",children:[d.jsxs("button",{type:"button",className:`gauntlet-capsule__theme-option${ge==="corner"?" gauntlet-capsule__theme-option--active":""}`,onClick:()=>void T("corner"),role:"radio","aria-checked":ge==="corner",children:[d.jsx("span",{className:"gauntlet-capsule__theme-swatch gauntlet-capsule__pill-mode-swatch--corner","aria-hidden":!0}),d.jsx("span",{children:"resting corner"})]}),d.jsxs("button",{type:"button",className:`gauntlet-capsule__theme-option${ge==="cursor"?" gauntlet-capsule__theme-option--active":""}`,onClick:()=>void T("cursor"),role:"radio","aria-checked":ge==="cursor",children:[d.jsx("span",{className:"gauntlet-capsule__theme-swatch gauntlet-capsule__pill-mode-swatch--cursor","aria-hidden":!0}),d.jsx("span",{children:"cursor pill"})]})]})]}),u&&d.jsx("div",{className:"gauntlet-capsule__settings-section",children:d.jsxs("label",{className:"gauntlet-capsule__settings-toggle",children:[d.jsx("input",{type:"checkbox",checked:S,onChange:G=>void be(G.target.checked)}),d.jsxs("span",{className:"gauntlet-capsule__settings-toggle-label",children:[d.jsx("strong",{children:"incluir screenshot"}),d.jsx("small",{children:"o modelo vê a página visível. útil para layouts e imagens, exposição de senhas/DMs visíveis. opt-in."})]})]})}),d.jsx("div",{className:"gauntlet-capsule__settings-section",children:d.jsxs("label",{className:"gauntlet-capsule__settings-toggle",children:[d.jsx("input",{type:"checkbox",checked:te,onChange:G=>void Le(G.target.checked)}),d.jsxs("span",{className:"gauntlet-capsule__settings-toggle-label",children:[d.jsx("strong",{children:"ler resposta em voz alta"}),d.jsx("small",{children:"quando o modelo termina, a cápsula fala a resposta via Web Speech. cancela ao submeter outro pedido ou fechar a cápsula."})]})]})}),d.jsxs("div",{className:"gauntlet-capsule__settings-section",children:[d.jsx("span",{className:"gauntlet-capsule__settings-subtitle",children:"domínios escondidos"}),M?d.jsx("p",{className:"gauntlet-capsule__settings-empty",children:"a carregar…"}):E.length===0?d.jsx("p",{className:"gauntlet-capsule__settings-empty",children:"nenhum — clica direito no pill em qualquer site para o esconder."}):d.jsx("ul",{className:"gauntlet-capsule__settings-list",children:E.map(G=>d.jsxs("li",{className:"gauntlet-capsule__settings-row",children:[d.jsx("span",{className:"gauntlet-capsule__settings-host",children:G}),d.jsx("button",{type:"button",className:"gauntlet-capsule__settings-restore",onClick:()=>void ze(G),children:"restaurar"})]},G))})]})]})}function lf(o){const u=o.match(/"compose"\s*:\s*"((?:[^"\\]|\\.)*)/);if(!u)return null;let s=u[1];return s.endsWith("\\")&&!s.endsWith("\\\\")&&(s=s.slice(0,-1)),s.replace(/\\n/g,`
`).replace(/\\r/g,"\r").replace(/\\t/g,"	").replace(/\\"/g,'"').replace(/\\\\/g,"\\")}function af(o,u){const s={};return o.pageText&&(s.page_text=o.pageText),o.domSkeleton&&(s.dom_skeleton=o.domSkeleton),o.bbox&&(s.selection_bbox=o.bbox),u&&(s.screenshot_data_url=u),{source:"browser",url:o.url,page_title:o.pageTitle,selection:o.text||void 0,metadata:Object.keys(s).length>0?s:void 0}}function of(o){switch(o.type){case"fill":return`fill ${o.selector} ← "${hc(o.value,80)}"`;case"click":return`click ${o.selector}`;case"highlight":return`highlight ${o.selector}`;case"scroll_to":return`scroll to ${o.selector}`;case"shell.run":{const u=(o.args??[]).join(" "),s=o.cwd?` (cwd: ${o.cwd})`:"";return`shell: ${o.cmd}${u?` ${u}`:""}${s}`}case"fs.read":return`fs.read ${o.path}`;case"fs.write":return`fs.write ${o.path} (${o.content.length} chars)`}}const kt=16,Mn=12;function Pa(o,u,s){return s<u||o<u?u:o>s?s:o}function sf(o,u){if(o<=600)return{width:Math.max(0,o-24),height:Math.max(0,u-24)};const v=Pa(.72*o,560,820),m=Pa(.72*u,420,560);return{width:v,height:m}}function uf(o,u,s){if(!o)return{top:Math.max(kt,Math.floor((u.height-s.height)/2)),left:Math.max(kt,Math.floor((u.width-s.width)/2)),placement:"center"};const v=u.height-(o.y+o.height)-Mn-kt,m=o.y-Mn-kt,h=u.width-(o.x+o.width)-Mn-kt,L=o.x-Mn-kt,E=v>=s.height,b=m>=s.height,M=h>=s.width,P=L>=s.width;let S,V,ge;E?(S="below",V=o.y+o.height+Mn,ge=o.x):b?(S="above",V=o.y-Mn-s.height,ge=o.x):M?(S="right",ge=o.x+o.width+Mn,V=Math.floor(o.y+o.height/2-s.height/2)):P?(S="left",ge=o.x-Mn-s.width,V=Math.floor(o.y+o.height/2-s.height/2)):(S="center",V=Math.floor((u.height-s.height)/2),ge=Math.floor((u.width-s.width)/2));const re=u.height-s.height-kt,te=u.width-s.width-kt;return V=Pa(V,kt,Math.max(kt,re)),ge=Pa(ge,kt,Math.max(kt,te)),{top:V,left:ge,placement:S}}const cf=`
@keyframes gauntlet-cap-pulse {
  0%, 100% { opacity: 0.7; transform: scale(1); }
  50%      { opacity: 1;   transform: scale(1.15); }
}
@keyframes gauntlet-cap-aurora {
  0%   { transform: translate3d(-12%, -8%, 0) rotate(0deg) scale(1); }
  33%  { transform: translate3d(6%,   -4%, 0) rotate(120deg) scale(1.06); }
  66%  { transform: translate3d(8%,    6%, 0) rotate(240deg) scale(0.96); }
  100% { transform: translate3d(-12%, -8%, 0) rotate(360deg) scale(1); }
}
/* Capsule enter — layered choreography: the shell rises with a soft
   spring (~360ms cubic), the aurora drifts in slightly later (200ms
   delay), and the content panels stagger by 60ms each so the eye
   reads the cápsula assembling itself instead of materialising as a
   single slab. Doutrina: a cápsula respira ao chegar, não aparece. */
@keyframes gauntlet-cap-rise {
  0%   { opacity: 0; transform: translateY(10px) scale(0.97); filter: blur(2px); }
  60%  { opacity: 1; filter: blur(0); }
  100% { opacity: 1; transform: translateY(0)   scale(1); filter: blur(0); }
}
@keyframes gauntlet-cap-rise-centered {
  0%   { opacity: 0; transform: translate(-50%, calc(-50% + 10px)) scale(0.97); filter: blur(2px); }
  60%  { opacity: 1; filter: blur(0); }
  100% { opacity: 1; transform: translate(-50%, -50%)              scale(1); filter: blur(0); }
}
@keyframes gauntlet-cap-aurora-fade-in {
  0%   { opacity: 0; }
  100% { opacity: 0.6; }
}
@keyframes gauntlet-cap-stagger-in {
  0%   { opacity: 0; transform: translateY(6px); }
  100% { opacity: 1; transform: translateY(0); }
}
@keyframes gauntlet-cap-spin {
  to { transform: rotate(360deg); }
}
/* Phase ring morph — when the active phase changes, the ring picks up
   the new colour over 600ms with an easing curve so the operator
   reads the transition as a state change, not a flicker. */
@keyframes gauntlet-cap-phase-morph {
  0%   { box-shadow: 0 0 0 1px transparent, 0 0 12px transparent; }
  50%  { box-shadow: 0 0 0 1px var(--gx-phase, transparent), 0 0 36px var(--gx-phase, transparent); }
  100% { box-shadow: 0 0 0 1px var(--gx-phase, transparent), 0 0 24px var(--gx-phase, transparent); }
}

.gauntlet-capsule {
  /* Flagship light is the new default surface. The cápsula is premium
     daylight: cream paper, ink fg, ember accent. Dark stays available
     as an alternative behind data-theme="dark"; existing operators
     who prefer the night surface flip via the settings drawer. */
  --gx-ember: #d07a5a;
  --gx-ember-soft: rgba(208, 122, 90, 0.14);
  --gx-bg: #f7f3e8;
  --gx-bg-solid: #fbf7ee;
  --gx-surface: rgba(255, 255, 255, 0.78);
  --gx-surface-strong: #ffffff;
  --gx-border: rgba(15, 17, 22, 0.08);
  --gx-border-mid: rgba(15, 17, 22, 0.16);
  --gx-fg: #1a1d24;
  --gx-fg-dim: #4a4f5b;
  --gx-fg-muted: #7a808d;
  --gx-tint-soft: rgba(15, 17, 22, 0.04);
  --gx-tint-strong: rgba(15, 17, 22, 0.08);
  --gx-sunken: rgba(15, 17, 22, 0.04);
  --gx-scrim: rgba(15, 17, 22, 0.32);
  --gx-shadow-rgb: 32, 24, 18;
  /* Semantic ink — text on tinted accent backgrounds. Light needs
     deeper hues to stay readable; dark uses paler hues. Each pairs
     with its own --gx-{accent,success,danger}-bg tint above. */
  --gx-accent-text: #b3501f;
  --gx-success-text: #2f6e44;
  --gx-danger-text: #9b2c2c;
  /* Code block ink — purple keywords, rust strings, slate comments.
     Mirrors the Codex/Claude-Code premium-light reference the operator
     pinned for the flagship surface. */
  --gx-code-bg: #f3edde;
  --gx-code-fg: #2a2218;
  --gx-code-keyword: #6e3aa8;
  --gx-code-string: #b3501f;
  --gx-code-number: #8c5a00;
  --gx-code-comment: #8a8470;
  --gx-code-fn: #2563a8;
  --gx-code-meta-bg: rgba(15, 17, 22, 0.04);
}

/* Dark variant — premium night surface. Same ember accent, glass
   mood, deep ink. Toggled via data-theme="dark" on the capsule root. */
.gauntlet-capsule[data-theme="dark"] {
  --gx-bg: rgba(14, 16, 22, 0.92);
  --gx-bg-solid: #0e1016;
  --gx-surface: rgba(28, 30, 38, 0.70);
  --gx-surface-strong: #1a1d26;
  --gx-border: rgba(255, 255, 255, 0.08);
  --gx-border-mid: rgba(255, 255, 255, 0.14);
  --gx-fg: #f0f2f7;
  --gx-fg-dim: #aab0bd;
  --gx-fg-muted: #6a7080;
  --gx-tint-soft: rgba(255, 255, 255, 0.04);
  --gx-tint-strong: rgba(255, 255, 255, 0.08);
  --gx-sunken: rgba(8, 9, 13, 0.55);
  --gx-scrim: rgba(8, 9, 13, 0.55);
  --gx-shadow-rgb: 0, 0, 0;
  --gx-accent-text: #f4c4ad;
  --gx-success-text: #cfe8d3;
  --gx-danger-text: #f1a4ad;
  --gx-code-bg: rgba(8, 9, 13, 0.7);
  --gx-code-fg: #e6e8ee;
  --gx-code-keyword: #c4a8ff;
  --gx-code-string: #f4c4ad;
  --gx-code-number: #f4d4c0;
  --gx-code-comment: #6a7080;
  --gx-code-fn: #a8c8ff;
  --gx-code-meta-bg: rgba(255, 255, 255, 0.02);
}

.gauntlet-capsule {
  /* Floating, viewport-safe by default. Doutrina: cápsula leve, discreta,
     sempre presente — never a bottom dock, never a giant standalone
     window. The base shape is the only shape; --anchored / --centered
     just decide where to drop it. */
  position: fixed;
  width: clamp(560px, 72vw, 820px);
  max-width: calc(100vw - 32px);
  max-height: clamp(420px, 72vh, 560px);
  height: auto;
  overflow: hidden;
  background: var(--gx-bg);
  color: var(--gx-fg);
  border: 1px solid var(--gx-border-mid);
  border-radius: 16px;
  backdrop-filter: saturate(1.2) blur(20px);
  -webkit-backdrop-filter: saturate(1.2) blur(20px);
  box-shadow:
    0 0 0 1px var(--gx-tint-soft),
    0 24px 60px rgba(var(--gx-shadow-rgb), 0.18),
    0 8px 24px rgba(var(--gx-shadow-rgb), 0.10);
  font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 13px;
  line-height: 1.45;
  z-index: 2147483647;
  padding: 0;
  isolation: isolate;
  pointer-events: auto;
  /* Spring-shaped curve — slightly past the target, settles back. The
     overshoot is ≤2px so the operator reads it as confidence, not
     bounce. 360ms gives the layered stagger room to breathe. */
  animation: gauntlet-cap-rise 360ms cubic-bezier(0.16, 1.05, 0.34, 1) both;
}

/* Tight viewports collapse to a near-fullscreen shape, but still
   floating with margin — never an edge-to-edge dock. */
@media (max-width: 600px), (max-height: 520px) {
  .gauntlet-capsule {
    width: calc(100vw - 24px);
    max-height: calc(100vh - 24px);
  }
}

/* Floating marker — every rendered capsule carries this. Composes with
   --anchored / --centered for testability. */
.gauntlet-capsule--floating {
  /* shape inherited from .gauntlet-capsule */
}

/* Centered mode — no selection bbox, no cursor anchor. Pure CSS
   positioning so the component doesn't have to measure itself. The
   animation override is intentional: gauntlet-cap-rise's end keyframe
   resolves transform to translateY(0) scale(1) with fill-mode: both,
   which would otherwise wipe out our centering translate after 220ms.
   The centered variant keeps the same lift motion but ends at
   translate(-50%, -50%) so the capsule stays truly centred. */
.gauntlet-capsule--centered {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: gauntlet-cap-rise-centered 360ms cubic-bezier(0.16, 1.05, 0.34, 1) both;
}

/* Anchored mode — top/left set inline via computeCapsulePosition. The
   class is a marker for tests + a hook for any anchored-only tweaks
   (e.g. a small tail/pointer in the future). */
.gauntlet-capsule--anchored {
  /* position set inline by the component */
}

/* Single-column layout — the floating capsule is too narrow for the
   two-pane shape that the old bottom-strip used. Context becomes a
   compact header, input + output own the rest of the height. */
.gauntlet-capsule__layout {
  flex-direction: column;
}
.gauntlet-capsule__panel--left {
  width: 100%;
  max-width: none;
  min-width: 0;
  border-right: none;
  border-bottom: 1px solid var(--gx-border);
  padding: 10px 14px;
  flex-shrink: 0;
}
.gauntlet-capsule__panel--right {
  padding: 12px 14px;
  flex: 1;
  min-height: 0;
  /* Internal scrolling so plan + result + danger banner combos can
     overflow without the capsule itself growing past the viewport. */
  overflow-y: auto;
  overflow-x: hidden;
}
.gauntlet-capsule__selection {
  max-height: 90px;
}

/* No-selection mode — the empty selection block is dead weight; collapse
   the left panel to its meta strip so the input dominates. */
.gauntlet-capsule--no-selection .gauntlet-capsule__selection--empty {
  display: none;
}
.gauntlet-capsule--no-selection .gauntlet-capsule__panel--left {
  padding: 8px 14px;
}
.gauntlet-capsule--no-selection .gauntlet-capsule__context {
  flex: 0 0 auto;
}

.gauntlet-capsule__aurora {
  position: absolute;
  inset: -30%;
  background:
    radial-gradient(40% 40% at 30% 30%, rgba(208, 122, 90, 0.18), transparent 60%),
    radial-gradient(40% 40% at 70% 70%, rgba(98, 130, 200, 0.12), transparent 60%);
  filter: blur(40px);
  opacity: 0;
  pointer-events: none;
  z-index: -1;
  /* Aurora fades in after the shell rise (200ms delay), then drifts
     forever at a 28s loop. Two-layer animation = mount fade + ambient
     drift; the comma syntax stacks them. */
  animation:
    gauntlet-cap-aurora-fade-in 600ms 200ms cubic-bezier(0.2, 0, 0, 1) forwards,
    gauntlet-cap-aurora 28s linear infinite;
}
/* Layered staggered entrance — each panel rises ~60ms after the one
   before it so the cápsula reads as composed, not stamped. */
.gauntlet-capsule__panel--left {
  animation: gauntlet-cap-stagger-in 320ms 120ms cubic-bezier(0.2, 0, 0, 1) both;
}
.gauntlet-capsule__panel--right {
  animation: gauntlet-cap-stagger-in 320ms 200ms cubic-bezier(0.2, 0, 0, 1) both;
}

/* ── Layout — single-column floating capsule ── */
.gauntlet-capsule__layout {
  display: flex;
  flex-direction: column;
  max-height: inherit;
  overflow: hidden;
}

.gauntlet-capsule__panel {
  display: flex;
  flex-direction: column;
  min-height: 0;
}

/* ── Header ── */
.gauntlet-capsule__header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 10px;
  flex-shrink: 0;
}
.gauntlet-capsule__brand-block {
  display: flex; align-items: center; gap: 10px;
}
.gauntlet-capsule__mark {
  position: relative;
  width: 22px; height: 22px;
  border-radius: 7px;
  background:
    radial-gradient(60% 60% at 30% 30%, rgba(208, 122, 90, 0.85), rgba(208, 122, 90, 0.35) 60%, transparent 100%),
    #1a1d26;
  border: 1px solid rgba(208, 122, 90, 0.45);
  box-shadow:
    0 0 18px rgba(208, 122, 90, 0.45),
    inset 0 1px 0 rgba(255, 255, 255, 0.10);
  display: flex; align-items: center; justify-content: center;
}
.gauntlet-capsule__mark-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: #f4c4ad;
  box-shadow: 0 0 10px rgba(244, 196, 173, 0.85);
  animation: gauntlet-cap-pulse 2.4s ease-in-out infinite;
}
.gauntlet-capsule__brand-text {
  display: flex; flex-direction: column; line-height: 1.05;
}
.gauntlet-capsule__brand {
  /* Doutrina: glass + serif headline + mono labels. The headline is
     the one place a serif earns its keep — distinguishes Gauntlet
     from generic dev-tool aesthetics without bundling a custom font.
     System serifs are surprisingly distinctive on macOS (New York /
     Charter) and Windows (Cambria) and degrade gracefully elsewhere. */
  font-family:
    "Charter", "New York", "Cambria", "Georgia",
    "Iowan Old Style", "Apple Garamond", serif;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.18em;
  color: var(--gx-fg);
  font-feature-settings: "kern" 1, "liga" 1;
}
.gauntlet-capsule__tagline {
  font-family: "JetBrains Mono", "Fira Code", ui-monospace, monospace;
  font-size: 9px;
  letter-spacing: 0.18em;
  color: var(--gx-fg-muted);
  margin-top: 2px;
}
.gauntlet-capsule__close {
  background: transparent;
  border: 1px solid var(--gx-border);
  color: var(--gx-fg-muted);
  border-radius: 6px;
  padding: 4px 8px;
  cursor: pointer;
  font-family: "JetBrains Mono", monospace;
  font-size: 10px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  transition: color 140ms ease, border-color 140ms ease, background 140ms ease;
}
.gauntlet-capsule__close:hover {
  color: var(--gx-fg);
  border-color: var(--gx-border-mid);
  background: var(--gx-tint-soft);
}

/* ── Context ── */
.gauntlet-capsule__context {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}
/* Context chips — pill row above the input. Source / page-title /
   re-read read as chips, like the reference flagship surface. Not a
   metadata strip; a deliberate chip row that frames the cápsula's
   ambient awareness. */
.gauntlet-capsule__context-meta {
  display: flex; gap: 6px; align-items: center;
  font-size: 11px;
  color: var(--gx-fg-dim);
  margin-bottom: 8px;
  font-family: "Inter", system-ui, sans-serif;
  flex-shrink: 0;
  flex-wrap: wrap;
}
.gauntlet-capsule__source {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px 4px 8px;
  border-radius: 999px;
  border: 1px solid var(--gx-border-mid);
  background: var(--gx-surface-strong, var(--gx-tint-soft));
  color: var(--gx-fg);
  font-family: "JetBrains Mono", monospace;
  font-size: 10px;
  transition: transform 180ms cubic-bezier(0.2, 0, 0, 1), border-color 180ms ease, box-shadow 200ms ease;
  letter-spacing: 0.10em;
  text-transform: uppercase;
}
.gauntlet-capsule__source::before {
  content: '';
  width: 6px; height: 6px;
  border-radius: 50%;
  background: var(--gx-ember);
  box-shadow: 0 0 6px rgba(208, 122, 90, 0.65);
  flex-shrink: 0;
}
/* Context pop — fires once when a fresh selection lands. The chip
   bumps to 1.06 with an ember halo, settles back. The dot inside also
   flashes brighter for the same window. */
@keyframes gauntlet-cap-chip-pop {
  0%   { transform: translateY(0)    scale(1);    box-shadow: 0 0 0 0 rgba(208, 122, 90, 0); }
  35%  { transform: translateY(-2px) scale(1.06); box-shadow: 0 0 0 6px rgba(208, 122, 90, 0.18); }
  70%  { transform: translateY(-1px) scale(1.02); box-shadow: 0 0 0 3px rgba(208, 122, 90, 0.10); }
  100% { transform: translateY(0)    scale(1);    box-shadow: 0 0 0 0 rgba(208, 122, 90, 0); }
}
.gauntlet-capsule__source--popped {
  animation: gauntlet-cap-chip-pop 700ms cubic-bezier(0.16, 1.05, 0.34, 1);
}
.gauntlet-capsule__source--popped::before {
  background: #ffd2b6;
  box-shadow: 0 0 12px rgba(208, 122, 90, 0.95);
}
/* B2 — model indicator chip. Persistent in the header meta strip
   once the planner returns a model_used value, so the operator
   always knows which brain answered. Dot is ember when the latency
   was low (good), amber for slow. */
.gauntlet-capsule__model-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-left: auto;
  margin-right: 6px;
  padding: 2px 8px;
  border-radius: 999px;
  border: 1px solid var(--gx-border-mid);
  background: var(--gx-tint-soft);
  color: var(--gx-fg-dim);
  font-family: "JetBrains Mono", monospace;
  font-size: 9.5px;
  letter-spacing: 0.04em;
  white-space: nowrap;
  text-transform: lowercase;
}
.gauntlet-capsule__model-chip-dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--gx-ember);
  box-shadow: 0 0 6px color-mix(in oklab, var(--gx-ember) 60%, transparent);
}

/* B3 — streaming progress. Indeterminate bar that walks left→right
   under the token counter so the operator senses the model is alive
   even when the chunks come in bursts. Token counter pulses on each
   delta (key change forces React to replay the keyframe). */
@keyframes gauntlet-cap-progress-walk {
  0%   { transform: translateX(-100%); }
  100% { transform: translateX(200%); }
}
@keyframes gauntlet-cap-token-pulse {
  0%   { color: var(--gx-ember); transform: scale(1.04); }
  100% { color: var(--gx-fg-dim); transform: scale(1); }
}
.gauntlet-capsule__progress-bar {
  position: relative;
  height: 2px;
  margin: 6px 0 8px;
  border-radius: 999px;
  background: var(--gx-tint-soft);
  overflow: hidden;
}
.gauntlet-capsule__progress-bar-track {
  position: absolute;
  inset: 0;
  width: 33%;
  border-radius: 999px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    var(--gx-ember) 50%,
    transparent 100%
  );
  animation: gauntlet-cap-progress-walk 1.6s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}
.gauntlet-capsule__token-counter--pulse {
  animation: gauntlet-cap-token-pulse 320ms ease-out;
  display: inline-block;
}

.gauntlet-capsule__url {
  flex: 1;
  min-width: 0;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid var(--gx-border);
  background: var(--gx-surface-strong, transparent);
  color: var(--gx-fg-dim);
  font-family: "Inter", system-ui, sans-serif;
  font-size: 11px;
  letter-spacing: 0;
  transition: transform 180ms cubic-bezier(0.2, 0, 0, 1), border-color 180ms ease, color 160ms ease;
}
/* Chip lift on hover — every context chip gets a 1px lift + ember
   border kiss so the operator senses the chip row is alive. Compose
   button gets its own pressed-state below. */
.gauntlet-capsule__source:hover,
.gauntlet-capsule__url:hover {
  transform: translateY(-1px);
  border-color: rgba(208, 122, 90, 0.45);
  color: var(--gx-fg);
}
.gauntlet-capsule__refresh {
  background: transparent;
  border: 1px solid var(--gx-border);
  color: var(--gx-fg-muted);
  font-family: "JetBrains Mono", monospace;
  font-size: 9px;
  padding: 4px 10px;
  border-radius: 999px;
  cursor: pointer;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  transition: color 160ms ease, border-color 160ms ease, background 160ms ease, transform 180ms cubic-bezier(0.2, 0, 0, 1);
  flex-shrink: 0;
}
.gauntlet-capsule__refresh:hover {
  color: var(--gx-fg);
  border-color: var(--gx-border-mid);
  transform: translateY(-1px);
  background: var(--gx-tint-soft);
}
.gauntlet-capsule__selection {
  background: var(--gx-sunken);
  border: 1px solid var(--gx-border);
  padding: 8px 10px;
  border-radius: 8px;
  font-family: "JetBrains Mono", "Fira Code", ui-monospace, monospace;
  font-size: 11px;
  white-space: pre-wrap; word-break: break-word;
  flex: 1;
  overflow: auto;
  color: var(--gx-fg-dim); margin: 0;
}
.gauntlet-capsule__selection--empty {
  color: var(--gx-fg-muted); font-style: italic;
  font-family: "Inter", sans-serif;
  font-size: 11px;
}

/* Compact context summary — no-selection state. Tight bulleted readout
   so the operator sees what's being sent without giving up vertical
   space the input/output need. */
.gauntlet-capsule__context-summary {
  list-style: none;
  margin: 0;
  padding: 6px 0 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 4px 14px;
}
.gauntlet-capsule__context-summary li {
  display: flex;
  align-items: baseline;
  gap: 8px;
  font-family: "JetBrains Mono", monospace;
  font-size: 10px;
  letter-spacing: 0.06em;
}
.gauntlet-capsule__context-key {
  color: var(--gx-fg-muted);
  text-transform: uppercase;
  letter-spacing: 0.12em;
}
.gauntlet-capsule__context-val {
  color: var(--gx-fg-dim);
}
.gauntlet-capsule__context-val--muted {
  color: var(--gx-fg-muted);
  font-style: italic;
}

/* ── Form ── */
.gauntlet-capsule__form {
  position: relative;
  flex-shrink: 0;
}
.gauntlet-capsule__input {
  width: 100%;
  background: var(--gx-surface-strong, var(--gx-sunken));
  color: var(--gx-fg);
  border: 1px solid var(--gx-border-mid);
  border-radius: 14px;
  padding: 14px 16px;
  font-family: inherit;
  font-size: 14.5px;
  resize: none;
  min-height: 64px;
  box-sizing: border-box;
  line-height: 1.55;
  transition: border-color 160ms ease, box-shadow 200ms ease, background 160ms ease;
  caret-color: var(--gx-ember);
}
.gauntlet-capsule__input::placeholder {
  color: var(--gx-fg-muted);
  font-style: normal;
}
.gauntlet-capsule__input:focus {
  outline: none;
  border-color: rgba(208, 122, 90, 0.55);
  box-shadow:
    0 0 0 3px rgba(208, 122, 90, 0.14),
    0 0 32px rgba(208, 122, 90, 0.10);
}
.gauntlet-capsule__actions {
  display: flex; align-items: center; justify-content: space-between;
  gap: 12px; margin-top: 10px;
}
.gauntlet-capsule__hint {
  display: inline-flex; gap: 4px; align-items: center;
  color: var(--gx-fg-muted);
  font-family: "JetBrains Mono", monospace;
  font-size: 10px;
  letter-spacing: 0.08em;
}
.gauntlet-capsule__kbd {
  display: inline-flex; align-items: center; justify-content: center;
  min-width: 18px; height: 18px;
  padding: 0 4px;
  border: 1px solid var(--gx-border-mid);
  border-radius: 4px;
  background: var(--gx-tint-soft);
  color: var(--gx-fg-dim);
  font-size: 10px;
}
/* Submit ripple — radiates from the compose button on every submit so
   the operator's gesture has visible weight. Pure CSS animation, lives
   inside the button (overflow stays clipped to the pill shape so the
   ripple looks like an inner pulse expanding outward). */
@keyframes gauntlet-cap-ripple {
  0%   { opacity: 0.45; transform: translate(-50%, -50%) scale(0.2); }
  60%  { opacity: 0.20; }
  100% { opacity: 0;    transform: translate(-50%, -50%) scale(2.6); }
}
.gauntlet-capsule__compose {
  position: relative;
  overflow: hidden;
}
.gauntlet-capsule__compose-ripple {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 120%;
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.65) 0%,
    rgba(255, 255, 255, 0) 70%
  );
  pointer-events: none;
  animation: gauntlet-cap-ripple 520ms cubic-bezier(0.2, 0, 0, 1) forwards;
  z-index: 0;
}
.gauntlet-capsule__compose > *:not(.gauntlet-capsule__compose-ripple) {
  position: relative;
  z-index: 1;
}
.gauntlet-capsule__compose {
  position: relative;
  border: none;
  cursor: pointer;
  padding: 9px 18px;
  border-radius: 999px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: #fff;
  background: linear-gradient(180deg, #d6855e 0%, #b65d3f 100%);
  box-shadow:
    0 0 0 1px rgba(208, 122, 90, 0.45),
    0 6px 18px rgba(208, 122, 90, 0.35);
  transition: transform 120ms ease, box-shadow 160ms ease, opacity 120ms ease;
  display: inline-flex; align-items: center; gap: 8px;
}
.gauntlet-capsule__compose:hover:not(:disabled) {
  transform: translateY(-1.5px);
  box-shadow:
    0 0 0 1px rgba(208, 122, 90, 0.55),
    0 12px 28px rgba(208, 122, 90, 0.55),
    0 0 0 4px rgba(208, 122, 90, 0.10);
}
/* Press feedback — micro-spring inward when the operator commits.
   Slightly past flat (0.5px down) reads like a real button settling. */
.gauntlet-capsule__compose:active:not(:disabled) {
  transform: translateY(0.5px) scale(0.985);
  box-shadow:
    0 0 0 1px rgba(208, 122, 90, 0.55),
    0 4px 12px rgba(208, 122, 90, 0.40);
  transition-duration: 60ms;
}
.gauntlet-capsule__compose:disabled {
  opacity: 0.45; cursor: not-allowed; transform: none;
  box-shadow: 0 0 0 1px var(--gx-border-mid);
}
.gauntlet-capsule__compose-spinner {
  width: 12px; height: 12px;
  border: 2px solid rgba(14, 16, 22, 0.25);
  border-top-color: #0e1016;
  border-radius: 50%;
  animation: gauntlet-cap-spin 0.7s linear infinite;
}

/* ── Error ── */
.gauntlet-capsule__error {
  margin-top: 10px; padding: 8px 12px;
  background: rgba(212, 96, 60, 0.10);
  border: 1px solid rgba(212, 96, 60, 0.32);
  color: var(--gx-danger-text);
  border-radius: 8px;
  font-size: 12px;
  display: flex; align-items: center; gap: 10px;
}
.gauntlet-capsule__error-icon {
  display: inline-flex; align-items: center; justify-content: center;
  width: 18px; height: 18px;
  border-radius: 50%;
  background: rgba(212, 96, 60, 0.25);
  color: var(--gx-danger-text);
  font-family: "JetBrains Mono", monospace;
  font-weight: 700;
  font-size: 11px;
  flex-shrink: 0;
}

/* ── Preview ── */
.gauntlet-capsule__preview {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid var(--gx-border);
  animation: gauntlet-cap-rise 240ms cubic-bezier(0.2, 0, 0, 1) both;
}
.gauntlet-capsule__preview-meta {
  display: flex; flex-wrap: wrap; gap: 6px;
  margin-bottom: 8px;
}
.gauntlet-capsule__preview-pill {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 3px 8px;
  border-radius: 999px;
  border: 1px solid var(--gx-border);
  background: var(--gx-tint-soft);
  font-family: "JetBrains Mono", monospace;
  font-size: 10px;
  letter-spacing: 0.08em;
}
.gauntlet-capsule__preview-pill[data-tone="high"] {
  border-color: rgba(122, 180, 138, 0.35);
  background: rgba(122, 180, 138, 0.10);
}
.gauntlet-capsule__preview-pill[data-tone="low"] {
  border-color: rgba(212, 120, 90, 0.35);
  background: rgba(212, 120, 90, 0.10);
}
.gauntlet-capsule__preview-key { color: var(--gx-fg-muted); }
.gauntlet-capsule__preview-val { color: var(--gx-fg); }

.gauntlet-capsule__artifact {
  background: var(--gx-sunken);
  border: 1px solid var(--gx-border);
  padding: 10px 12px;
  border-radius: 10px;
  font-family: "JetBrains Mono", "Fira Code", ui-monospace, monospace;
  font-size: 12px;
  color: var(--gx-fg);
  white-space: pre-wrap; word-break: break-word;
  margin: 0;
  line-height: 1.55;
}
.gauntlet-capsule__preview-actions {
  display: flex; justify-content: flex-end; margin-top: 8px;
}
.gauntlet-capsule__copy {
  background: var(--gx-tint-soft);
  color: var(--gx-fg);
  border: 1px solid var(--gx-border-mid);
  border-radius: 8px;
  padding: 6px 14px;
  cursor: pointer;
  font-family: inherit;
  font-size: 12px;
  font-weight: 500;
  transition: background 120ms ease, border-color 120ms ease;
}
.gauntlet-capsule__copy:hover {
  background: var(--gx-tint-soft);
  border-color: rgba(255, 255, 255, 0.22);
}

.gauntlet-capsule__refusal {
  padding: 12px;
  background: rgba(208, 122, 90, 0.07);
  border: 1px solid rgba(208, 122, 90, 0.25);
  border-radius: 10px;
  font-size: 12px;
  color: var(--gx-accent-text);
}
.gauntlet-capsule__refusal header {
  display: flex; align-items: center; gap: 10px;
  margin-bottom: 8px;
}
.gauntlet-capsule__refusal-mark {
  font-family: "JetBrains Mono", monospace;
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--gx-accent-text);
  padding: 2px 8px;
  background: rgba(208, 122, 90, 0.20);
  border: 1px solid rgba(208, 122, 90, 0.35);
  border-radius: 4px;
}
.gauntlet-capsule__refusal-reason {
  font-family: "JetBrains Mono", monospace;
  font-size: 11px;
  color: var(--gx-fg-dim);
}
.gauntlet-capsule__refusal p { margin: 0 0 8px; line-height: 1.5; }
.gauntlet-capsule__refusal ul { margin: 8px 0 0; padding-left: 18px; }
.gauntlet-capsule__refusal li { margin: 3px 0; }

/* ── Action-buttons row ── */
.gauntlet-capsule__action-buttons {
  display: inline-flex; align-items: center; gap: 8px;
}
.gauntlet-capsule__actuate {
  background: rgba(208, 122, 90, 0.12);
  color: var(--gx-accent-text);
  border: 1px solid rgba(208, 122, 90, 0.45);
  border-radius: 8px;
  padding: 8px 14px;
  cursor: pointer;
  font-family: inherit;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.04em;
  transition: background 120ms ease, transform 120ms ease, opacity 120ms ease;
  display: inline-flex; align-items: center; gap: 8px;
}
.gauntlet-capsule__actuate:hover:not(:disabled) {
  background: rgba(208, 122, 90, 0.22);
  transform: translateY(-1px);
}
.gauntlet-capsule__actuate:disabled {
  opacity: 0.45; cursor: not-allowed;
}

/* ── Settings drawer (currently: dismissed-domain list) ── */
.gauntlet-capsule__header-actions {
  display: inline-flex; align-items: center; gap: 6px;
}
.gauntlet-capsule__settings-btn {
  background: transparent;
  border: 1px solid var(--gx-border);
  color: var(--gx-fg-muted);
  border-radius: 6px;
  padding: 4px 8px;
  cursor: pointer;
  font-family: "JetBrains Mono", monospace;
  font-size: 13px;
  line-height: 1;
  letter-spacing: 0.04em;
  transition: color 140ms ease, border-color 140ms ease, background 140ms ease;
}
.gauntlet-capsule__settings-btn:hover {
  color: var(--gx-fg);
  border-color: var(--gx-border-mid);
  background: var(--gx-tint-soft);
}
@keyframes gauntlet-cap-drawer-flip {
  0%   { opacity: 0; transform: translateY(-4px) scaleY(0.92); transform-origin: top; }
  60%  { opacity: 1; transform: translateY(1px)  scaleY(1.02); }
  100% { opacity: 1; transform: translateY(0)    scaleY(1); }
}
.gauntlet-capsule__settings {
  margin: 8px 0;
  padding: 10px 12px;
  background: var(--gx-sunken);
  border: 1px solid var(--gx-border-mid);
  border-radius: 10px;
  /* Flip-spring open — the drawer scaleY-overshoots slightly so it
     reads like a real surface unfolding from under the header. */
  animation: gauntlet-cap-drawer-flip 280ms cubic-bezier(0.16, 1.05, 0.34, 1) both;
}
.gauntlet-capsule__settings-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 8px;
}
.gauntlet-capsule__settings-title {
  font-family: "JetBrains Mono", monospace;
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--gx-fg-dim);
}
.gauntlet-capsule__settings-close {
  background: transparent; border: none;
  color: var(--gx-fg-muted);
  cursor: pointer;
  font-size: 16px; line-height: 1; padding: 0 4px;
}
.gauntlet-capsule__settings-close:hover { color: var(--gx-fg); }
.gauntlet-capsule__settings-section {
  margin-bottom: 10px;
}
.gauntlet-capsule__settings-section:last-child { margin-bottom: 0; }
.gauntlet-capsule__settings-subtitle {
  display: block;
  font-family: "JetBrains Mono", monospace;
  font-size: 9px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--gx-fg-muted);
  margin-bottom: 6px;
}
.gauntlet-capsule__settings-toggle {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  cursor: pointer;
  padding: 6px 0;
  user-select: none;
}
.gauntlet-capsule__settings-toggle input[type="checkbox"] {
  margin-top: 3px;
  width: 14px; height: 14px;
  accent-color: var(--gx-ember);
  cursor: pointer;
  flex-shrink: 0;
}
.gauntlet-capsule__settings-toggle-label {
  display: flex; flex-direction: column; gap: 2px;
}
.gauntlet-capsule__settings-toggle-label strong {
  font-size: 12px;
  color: var(--gx-fg);
  font-weight: 500;
}
.gauntlet-capsule__settings-toggle-label small {
  font-size: 10px;
  color: var(--gx-fg-muted);
  line-height: 1.4;
}
.gauntlet-capsule__settings-empty {
  margin: 0;
  font-size: 11px;
  color: var(--gx-fg-muted);
  font-style: italic;
}
.gauntlet-capsule__settings-list {
  margin: 0; padding: 0; list-style: none;
  display: flex; flex-direction: column; gap: 4px;
  max-height: 180px; overflow-y: auto;
}
.gauntlet-capsule__settings-row {
  display: flex; align-items: center; justify-content: space-between;
  gap: 8px;
  padding: 4px 8px;
  border-radius: 6px;
  background: var(--gx-tint-soft);
  font-family: "JetBrains Mono", monospace;
  font-size: 11px;
  color: var(--gx-fg-dim);
}

/* Theme switch — flagship light vs night premium. Two pill buttons,
   the active one carries the ember accent. The swatch previews the
   destination so the operator picks visually, not by label alone. */
.gauntlet-capsule__theme-switch {
  display: flex;
  gap: 8px;
  margin-top: 4px;
}
.gauntlet-capsule__theme-option {
  flex: 1;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid var(--gx-border);
  background: var(--gx-tint-soft);
  color: var(--gx-fg-dim);
  font-family: "JetBrains Mono", monospace;
  font-size: 11px;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: border-color 140ms ease, background 140ms ease, color 140ms ease;
}
.gauntlet-capsule__theme-option:hover {
  color: var(--gx-fg);
  border-color: var(--gx-border-mid);
}
.gauntlet-capsule__theme-option--active {
  border-color: rgba(208, 122, 90, 0.55);
  background: var(--gx-ember-soft, rgba(208, 122, 90, 0.12));
  color: var(--gx-fg);
}
.gauntlet-capsule__theme-swatch {
  width: 14px;
  height: 14px;
  border-radius: 4px;
  border: 1px solid var(--gx-border-mid);
  flex-shrink: 0;
}
.gauntlet-capsule__theme-swatch--light {
  background: linear-gradient(135deg, #fbf7ee 0%, #f3edde 100%);
}
.gauntlet-capsule__theme-swatch--dark {
  background: linear-gradient(135deg, #1a1d26 0%, #0e1016 100%);
}
/* Pill-mode swatches — visual hint for the toggle: corner shows a
   resting dot in the bottom-right; cursor shows a small dot at the
   centre to suggest "follows pointer". */
.gauntlet-capsule__pill-mode-swatch--corner {
  background: var(--gx-surface-strong, #ffffff);
  position: relative;
}
.gauntlet-capsule__pill-mode-swatch--corner::after {
  content: '';
  position: absolute;
  bottom: 1px;
  right: 1px;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--gx-ember);
  box-shadow: 0 0 4px rgba(208, 122, 90, 0.55);
}
.gauntlet-capsule__pill-mode-swatch--cursor {
  background: var(--gx-surface-strong, #ffffff);
  position: relative;
}
.gauntlet-capsule__pill-mode-swatch--cursor::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 5px;
  height: 5px;
  border-radius: 1px;
  background: var(--gx-ember);
  box-shadow: 0 0 6px rgba(208, 122, 90, 0.65);
}
.gauntlet-capsule__settings-host {
  flex: 1;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.gauntlet-capsule__settings-restore {
  background: rgba(208, 122, 90, 0.12);
  color: var(--gx-accent-text);
  border: 1px solid rgba(208, 122, 90, 0.45);
  border-radius: 4px;
  padding: 2px 8px;
  cursor: pointer;
  font-family: inherit;
  font-size: 10px;
  letter-spacing: 0.04em;
  flex-shrink: 0;
}
.gauntlet-capsule__settings-restore:hover {
  background: rgba(208, 122, 90, 0.22);
}

/* ── Skeleton (perceived speed during the planning roundtrip) ──
   We can't stream tokens yet (Sprint 1.4-A), but a shimmering
   placeholder turns 1.5–4s of model latency from "spinner silence"
   into "the capsule is thinking". The shimmer reads as activity even
   if nothing else changes on screen. */
@keyframes gauntlet-cap-shimmer {
  0%   { background-position: -240px 0; }
  100% { background-position:  240px 0; }
}
.gauntlet-capsule__skeleton {
  margin-top: 10px;
  padding: 10px 12px;
  background: var(--gx-sunken);
  border: 1px solid var(--gx-border);
  border-radius: 10px;
  animation: gauntlet-cap-rise 200ms cubic-bezier(0.2, 0, 0, 1) both;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.gauntlet-capsule__skeleton-header {
  display: flex; align-items: center; gap: 10px;
  margin-bottom: 2px;
}
.gauntlet-capsule__skeleton-tag,
.gauntlet-capsule__skeleton-meta,
.gauntlet-capsule__skeleton-line {
  background:
    linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.04) 0%,
      rgba(208, 122, 90, 0.18) 50%,
      rgba(255, 255, 255, 0.04) 100%
    );
  background-size: 240px 100%;
  background-repeat: no-repeat;
  background-color: rgba(255, 255, 255, 0.04);
  border-radius: 4px;
  animation: gauntlet-cap-shimmer 1.4s ease-in-out infinite;
}
.gauntlet-capsule__skeleton-tag   { width: 56px; height: 14px; border-radius: 4px; }
.gauntlet-capsule__skeleton-meta  { width: 140px; height: 10px; border-radius: 3px; }
.gauntlet-capsule__skeleton-line  { height: 11px; border-radius: 3px; }
/* Wave-coordinated skeleton — three lines start the shimmer offset by
   140ms each so the eye reads a cohesive wave moving down, not three
   loose lines flickering independently. */
.gauntlet-capsule__skeleton-line--w90 { width: 90%; animation-delay: 0ms; }
.gauntlet-capsule__skeleton-line--w75 { width: 75%; animation-delay: 140ms; }
.gauntlet-capsule__skeleton-line--w55 { width: 55%; animation-delay: 280ms; }

/* ── Compose response (inline text answer) ── */
.gauntlet-capsule__compose-result {
  margin-top: 10px;
  padding: 10px 12px;
  background: var(--gx-sunken);
  border: 1px solid var(--gx-border);
  border-radius: 10px;
  animation: gauntlet-cap-rise 240ms cubic-bezier(0.2, 0, 0, 1) both;
}
.gauntlet-capsule__compose-meta {
  display: flex; align-items: center; gap: 10px;
  margin-bottom: 8px;
}
.gauntlet-capsule__compose-tag {
  font-family: "JetBrains Mono", monospace;
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--gx-accent-text);
  padding: 2px 8px;
  background: rgba(208, 122, 90, 0.20);
  border: 1px solid rgba(208, 122, 90, 0.35);
  border-radius: 4px;
}
.gauntlet-capsule__compose-meta-text {
  font-family: "JetBrains Mono", monospace;
  font-size: 10px;
  letter-spacing: 0.06em;
  color: var(--gx-fg-muted);
}
.gauntlet-capsule__compose-text {
  font-size: 13px;
  line-height: 1.55;
  color: var(--gx-fg);
  white-space: pre-wrap;
  word-break: break-word;
  /* At least 220px when output exists; up to 40% of the viewport on
     larger screens so long answers don't get crushed by the form. */
  min-height: 0;
  max-height: clamp(220px, 40vh, 380px);
  overflow-y: auto;
  overflow-x: hidden;
}
.gauntlet-capsule__compose-actions {
  display: flex; justify-content: flex-end; margin-top: 8px;
}
@keyframes gauntlet-cap-caret {
  0%, 49%   { opacity: 1; }
  50%, 100% { opacity: 0; }
}
.gauntlet-capsule__compose-caret {
  display: inline-block;
  margin-left: 1px;
  color: var(--gx-ember);
  animation: gauntlet-cap-caret 1s steps(1) infinite;
}
.gauntlet-capsule__compose-result--streaming {
  border-color: rgba(208, 122, 90, 0.35);
}

/* ── Plan section ── */
.gauntlet-capsule__plan {
  margin-top: 10px;
  padding: 10px 12px;
  background: var(--gx-sunken);
  border: 1px solid var(--gx-border);
  border-radius: 10px;
  animation: gauntlet-cap-rise 240ms cubic-bezier(0.2, 0, 0, 1) both;
}
.gauntlet-capsule__plan-header {
  display: flex; align-items: center; gap: 10px;
  margin-bottom: 8px;
}
.gauntlet-capsule__plan-title {
  font-family: "JetBrains Mono", monospace;
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--gx-accent-text);
  padding: 2px 8px;
  background: rgba(208, 122, 90, 0.20);
  border: 1px solid rgba(208, 122, 90, 0.35);
  border-radius: 4px;
}
.gauntlet-capsule__plan-meta {
  font-family: "JetBrains Mono", monospace;
  font-size: 10px;
  letter-spacing: 0.06em;
  color: var(--gx-fg-muted);
}
.gauntlet-capsule__plan-empty {
  margin: 0;
  font-size: 12px;
  color: var(--gx-fg-dim);
  font-style: italic;
}
.gauntlet-capsule__plan-list {
  margin: 0; padding: 0; list-style: none;
  display: flex; flex-direction: column; gap: 4px;
}
.gauntlet-capsule__plan-item {
  display: flex; align-items: flex-start; gap: 8px;
  padding: 6px 8px;
  border-radius: 6px;
  background: var(--gx-tint-soft);
  font-family: "JetBrains Mono", monospace;
  font-size: 11px;
  color: var(--gx-fg-dim);
  border: 1px solid transparent;
  transition: background 120ms ease, border-color 120ms ease;
}
.gauntlet-capsule__plan-item--ok {
  background: rgba(122, 180, 138, 0.10);
  border-color: rgba(122, 180, 138, 0.35);
  color: var(--gx-success-text);
}
.gauntlet-capsule__plan-item--fail {
  background: rgba(212, 96, 60, 0.10);
  border-color: rgba(212, 96, 60, 0.35);
  color: var(--gx-danger-text);
}
.gauntlet-capsule__plan-step {
  display: inline-flex; align-items: center; justify-content: center;
  width: 18px; height: 18px;
  border-radius: 50%;
  background: var(--gx-tint-soft);
  color: var(--gx-fg);
  font-size: 10px;
  font-weight: 600;
  flex-shrink: 0;
}
.gauntlet-capsule__plan-desc {
  flex: 1;
  word-break: break-all;
}
.gauntlet-capsule__plan-err {
  font-size: 10px;
  color: var(--gx-danger-text);
  font-style: italic;
}
.gauntlet-capsule__plan-actions {
  display: flex; justify-content: flex-end; margin-top: 8px;
}
.gauntlet-capsule__execute {
  background: linear-gradient(180deg, #d07a5a 0%, #b65d3f 100%);
  color: #0e1016;
  border: none;
  border-radius: 8px;
  padding: 6px 14px;
  cursor: pointer;
  font-family: inherit;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.02em;
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.15),
    0 6px 18px rgba(208, 122, 90, 0.45);
  transition: transform 120ms ease, box-shadow 120ms ease, opacity 120ms ease;
}
.gauntlet-capsule__execute:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.25),
    0 10px 24px rgba(208, 122, 90, 0.55);
}
.gauntlet-capsule__execute:disabled {
  opacity: 0.45; cursor: not-allowed; transform: none;
}
.gauntlet-capsule__execute--danger {
  background: linear-gradient(180deg, #d4603c 0%, #a8401e 100%);
  box-shadow:
    0 0 0 1px rgba(255, 90, 60, 0.35),
    0 6px 18px rgba(212, 96, 60, 0.55);
  color: #fff;
}
.gauntlet-capsule__execute--danger:hover:not(:disabled) {
  box-shadow:
    0 0 0 1px rgba(255, 120, 90, 0.45),
    0 10px 24px rgba(212, 96, 60, 0.65);
}

/* ── Per-item danger badge ── */
.gauntlet-capsule__plan-item--danger {
  background: rgba(212, 96, 60, 0.08);
  border-color: rgba(212, 96, 60, 0.30);
}
.gauntlet-capsule__plan-danger {
  flex-shrink: 0;
  font-family: "JetBrains Mono", monospace;
  font-size: 9px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--gx-danger-text);
  background: rgba(212, 96, 60, 0.18);
  border: 1px solid rgba(212, 96, 60, 0.45);
  border-radius: 4px;
  padding: 2px 6px;
}

/* ── Danger gate — explicit confirmation before destructive execution ── */
.gauntlet-capsule__danger-gate {
  margin-top: 10px;
  padding: 10px 12px;
  background: rgba(212, 96, 60, 0.10);
  border: 1px solid rgba(212, 96, 60, 0.40);
  border-radius: 8px;
  animation: gauntlet-cap-rise 220ms cubic-bezier(0.2, 0, 0, 1) both;
}
.gauntlet-capsule__danger-header {
  display: flex; align-items: center; gap: 8px;
  margin-bottom: 6px;
}
.gauntlet-capsule__danger-mark {
  display: inline-flex; align-items: center; justify-content: center;
  width: 18px; height: 18px;
  border-radius: 50%;
  background: rgba(212, 96, 60, 0.30);
  color: #fff;
  font-family: "JetBrains Mono", monospace;
  font-weight: 700;
  font-size: 11px;
  flex-shrink: 0;
}
.gauntlet-capsule__danger-title {
  font-family: "JetBrains Mono", monospace;
  font-size: 11px;
  letter-spacing: 0.10em;
  text-transform: uppercase;
  color: var(--gx-danger-text);
}
.gauntlet-capsule__danger-list {
  margin: 0 0 8px 0; padding: 0 0 0 24px;
  font-size: 11px;
  color: var(--gx-danger-text);
  line-height: 1.6;
}
.gauntlet-capsule__danger-list li { margin: 0; }
.gauntlet-capsule__danger-list strong {
  color: #fff;
  font-weight: 600;
  font-family: "JetBrains Mono", monospace;
  font-size: 10px;
  letter-spacing: 0.06em;
  margin-right: 4px;
}
.gauntlet-capsule__danger-confirm {
  display: inline-flex; align-items: center; gap: 8px;
  cursor: pointer;
  font-size: 12px;
  color: var(--gx-fg);
  user-select: none;
}
.gauntlet-capsule__danger-confirm input[type="checkbox"] {
  width: 14px; height: 14px;
  accent-color: #d4603c;
  cursor: pointer;
}

/* ── Phase-aware semantic colors ──────────────────────────────────────────
   Cores semânticas a representar estados e processo do trabalho.
   The cápsula ambient glow ring shifts hue with the phase so the
   operator senses progress without reading text. The pill (rendered by
   App after dismiss) listens to gauntlet:phase events and mirrors
   the same color. */
.gauntlet-capsule--phase-idle      { --gx-phase: rgba(208, 122, 90, 0.0); }
.gauntlet-capsule--phase-planning  { --gx-phase: rgba(244, 196, 86, 0.55); } /* amber */
.gauntlet-capsule--phase-streaming { --gx-phase: rgba(208, 122, 90, 0.65); } /* ember */
.gauntlet-capsule--phase-plan_ready{ --gx-phase: rgba(208, 122, 90, 0.45); }
.gauntlet-capsule--phase-executing { --gx-phase: rgba(98, 130, 200, 0.55); } /* blue */
.gauntlet-capsule--phase-executed  { --gx-phase: rgba(122, 180, 138, 0.55); } /* green */
.gauntlet-capsule--phase-error     { --gx-phase: rgba(212, 96, 60, 0.65); }  /* red */

.gauntlet-capsule--floating::before {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  pointer-events: none;
  box-shadow: 0 0 0 1px var(--gx-phase, transparent), 0 0 24px var(--gx-phase, transparent);
  opacity: 0;
  /* Both opacity AND box-shadow fade so a phase swap (planning → streaming
     → done) reads as a colour morph, not a flicker. The cubic curve gives
     a slight lead-in before the colour settles. */
  transition:
    opacity 320ms cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 480ms cubic-bezier(0.4, 0, 0.2, 1);
}
.gauntlet-capsule--phase-planning::before,
.gauntlet-capsule--phase-streaming::before,
.gauntlet-capsule--phase-plan_ready::before,
.gauntlet-capsule--phase-executing::before,
.gauntlet-capsule--phase-executed::before,
.gauntlet-capsule--phase-error::before {
  opacity: 1;
}
/* Heartbeat pulse on long-running phases (planning + streaming +
   executing) so the operator senses the cápsula "still thinking" even
   when no text is changing. Softer + slower than a loading spinner. */
@keyframes gauntlet-cap-phase-heartbeat {
  0%, 100% { box-shadow: 0 0 0 1px var(--gx-phase, transparent), 0 0 18px var(--gx-phase, transparent); }
  50%      { box-shadow: 0 0 0 1px var(--gx-phase, transparent), 0 0 36px var(--gx-phase, transparent); }
}
.gauntlet-capsule--phase-planning::before,
.gauntlet-capsule--phase-streaming::before,
.gauntlet-capsule--phase-executing::before {
  animation: gauntlet-cap-phase-heartbeat 2.4s ease-in-out infinite;
}

/* Phase mark-dot tint — the brand mark itself communicates state */
.gauntlet-capsule--phase-error .gauntlet-capsule__mark {
  border-color: rgba(212, 96, 60, 0.7);
}
.gauntlet-capsule--phase-executed .gauntlet-capsule__mark {
  border-color: rgba(122, 180, 138, 0.7);
}

/* ── Token tick counter (refining: sensação de avanço) ─────────────────── */
.gauntlet-capsule__token-counter {
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.04em;
  color: rgba(244, 196, 173, 0.85);
  font-weight: 600;
}
.gauntlet-capsule__compose-text--streaming {
  background: linear-gradient(
    180deg,
    rgba(208, 122, 90, 0.04) 0%,
    transparent 60%
  );
}

/* ── Save (ghost) button — sibling of Copy ──────────────────────────────── */
.gauntlet-capsule__copy--ghost {
  background: transparent;
  border-color: var(--gx-border);
  color: var(--gx-fg-dim);
}
.gauntlet-capsule__copy--ghost:hover {
  border-color: var(--gx-border-mid);
  color: var(--gx-fg);
  background: var(--gx-tint-soft);
}

/* ── Voice button (press-and-hold) ──────────────────────────────────────── */
/* Resonant waves — three concentric rings ride out as the operator
   speaks. Visual mic feedback without reading volume meters; reads as
   "the cápsula is listening" at a glance. */
@keyframes gauntlet-cap-listen {
  0%, 100% {
    box-shadow:
      0 0 0 0 rgba(212, 96, 60, 0.45),
      0 0 0 0 rgba(212, 96, 60, 0.30),
      0 0 0 0 rgba(212, 96, 60, 0.18);
  }
  50% {
    box-shadow:
      0 0 0 4px rgba(212, 96, 60, 0.10),
      0 0 0 8px rgba(212, 96, 60, 0.05),
      0 0 0 12px rgba(212, 96, 60, 0);
  }
}
/* Anexar / Ecrã — sibling buttons to the voice button. Same shape so
   the actions row reads as a coherent toolbar; the icon+label idiom
   stays consistent. Hidden when the ambient doesn't support FS / screen
   capture (web extension). */
.gauntlet-capsule__attach-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid var(--gx-border);
  background: var(--gx-tint-soft);
  color: var(--gx-fg-dim);
  font-family: "JetBrains Mono", monospace;
  font-size: 10px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 160ms, border-color 160ms, color 160ms;
}
.gauntlet-capsule__attach-btn:hover:not(:disabled) {
  background: var(--gx-tint-strong);
  border-color: var(--gx-border-mid);
  color: var(--gx-fg);
}
.gauntlet-capsule__attach-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
.gauntlet-capsule__attach-label {
  font-weight: 500;
}

/* Attachment chips — render above the textarea once the operator pins
   a file or screenshot. Compact, dismissible, hierarchy-light so the
   prompt remains the focus. */
.gauntlet-capsule__attachments {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 0 0 8px;
}
.gauntlet-capsule__attachment {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 6px 4px 10px;
  border-radius: 999px;
  border: 1px solid var(--gx-border-mid);
  background: var(--gx-surface);
  color: var(--gx-fg);
  font-family: "JetBrains Mono", monospace;
  font-size: 10px;
  max-width: 260px;
}
.gauntlet-capsule__attachment--image {
  border-color: color-mix(in oklab, var(--gx-ember) 32%, var(--gx-border-mid));
}
.gauntlet-capsule__attachment-icon {
  color: var(--gx-fg-muted);
  font-size: 11px;
}
.gauntlet-capsule__attachment-name {
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 160px;
}
.gauntlet-capsule__attachment-size {
  color: var(--gx-fg-muted);
  letter-spacing: 0.04em;
}
.gauntlet-capsule__attachment-remove {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 999px;
  border: none;
  background: transparent;
  color: var(--gx-fg-muted);
  font-size: 13px;
  line-height: 1;
  cursor: pointer;
  padding: 0;
}
.gauntlet-capsule__attachment-remove:hover {
  background: var(--gx-tint-strong);
  color: var(--gx-fg);
}

/* Inline error band when pickFile / captureScreen rejects (permission,
   missing binary, file too large). Same visual register as the model
   error band — just below the chips so the operator sees it before they
   submit. */
.gauntlet-capsule__attach-error {
  margin: 0 0 8px;
  padding: 6px 10px;
  border-radius: 8px;
  background: color-mix(in oklab, var(--gx-danger-text) 10%, transparent);
  border: 1px solid color-mix(in oklab, var(--gx-danger-text) 30%, transparent);
  color: var(--gx-danger-text);
  font-family: "JetBrains Mono", monospace;
  font-size: 10px;
  letter-spacing: 0.04em;
}

/* B1 — slash command dropdown. Sits above the textarea when the
   operator opens with a slash. Highlight follows arrow keys + mouse
   hover; Enter runs the highlighted entry. Same visual register as
   the compact attachment chips so the form reads as one cohesive
   surface. */
.gauntlet-capsule__slash {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin: 0 0 8px;
  padding: 6px;
  border: 1px solid var(--gx-border-mid);
  border-radius: 10px;
  background: var(--gx-surface-strong);
  box-shadow: 0 8px 20px rgba(var(--gx-shadow-rgb), 0.10);
  max-height: 220px;
  overflow: auto;
}
.gauntlet-capsule__slash-item {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  padding: 6px 10px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--gx-fg);
  font-family: "JetBrains Mono", monospace;
  font-size: 11px;
  text-align: left;
  cursor: pointer;
  transition: background 120ms;
}
.gauntlet-capsule__slash-item--active {
  background: var(--gx-tint-strong);
}
.gauntlet-capsule__slash-item:hover {
  background: var(--gx-tint-strong);
}
.gauntlet-capsule__slash-label {
  font-weight: 500;
  color: var(--gx-fg);
  letter-spacing: 0.02em;
}
.gauntlet-capsule__slash-hint {
  color: var(--gx-fg-muted);
  font-size: 10px;
  text-align: right;
}

/* Active state for the shell toggle button — highlights when the panel
   is open so the operator knows which surface they're commanding. */
.gauntlet-capsule__attach-btn--active {
  background: var(--gx-tint-strong);
  border-color: color-mix(in oklab, var(--gx-ember) 38%, var(--gx-border-mid));
  color: var(--gx-fg);
}

/* Shell quick-run panel — collapsed by default, opens above the textarea
   when the operator toggles the "shell" button. The output area scrolls
   internally so a wall of git log doesn't push the cápsula off-screen. */
.gauntlet-capsule__shell-panel {
  margin: 0 0 8px;
  border: 1px solid var(--gx-border-mid);
  border-radius: 10px;
  background: var(--gx-sunken);
  padding: 8px;
}
.gauntlet-capsule__shell-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
.gauntlet-capsule__shell-prompt {
  font-family: "JetBrains Mono", monospace;
  font-size: 12px;
  color: var(--gx-ember);
  width: 14px;
  text-align: center;
}
.gauntlet-capsule__shell-input {
  flex: 1;
  min-width: 0;
  padding: 6px 8px;
  border: 1px solid var(--gx-border);
  border-radius: 6px;
  background: var(--gx-surface);
  color: var(--gx-fg);
  font-family: "JetBrains Mono", monospace;
  font-size: 12px;
  outline: none;
  transition: border-color 160ms;
}
.gauntlet-capsule__shell-input:focus {
  border-color: color-mix(in oklab, var(--gx-ember) 50%, var(--gx-border-mid));
}
.gauntlet-capsule__shell-run {
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid color-mix(in oklab, var(--gx-ember) 40%, var(--gx-border-mid));
  background: color-mix(in oklab, var(--gx-ember) 18%, var(--gx-surface));
  color: var(--gx-fg);
  font-family: "JetBrains Mono", monospace;
  font-size: 10px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 160ms, border-color 160ms;
}
.gauntlet-capsule__shell-run:hover:not(:disabled) {
  background: color-mix(in oklab, var(--gx-ember) 28%, var(--gx-surface));
}
.gauntlet-capsule__shell-run:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
.gauntlet-capsule__shell-output {
  margin-top: 8px;
  border-top: 1px solid var(--gx-border);
  padding-top: 8px;
  max-height: 220px;
  overflow: auto;
}
.gauntlet-capsule__shell-meta {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
  font-family: "JetBrains Mono", monospace;
  font-size: 10px;
  color: var(--gx-fg-muted);
  margin-bottom: 4px;
}
.gauntlet-capsule__shell-meta-cmd {
  color: var(--gx-fg-dim);
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.gauntlet-capsule__shell-stdout,
.gauntlet-capsule__shell-stderr {
  margin: 0;
  padding: 6px 8px;
  background: var(--gx-bg-solid);
  border: 1px solid var(--gx-border);
  border-radius: 6px;
  font-family: "JetBrains Mono", monospace;
  font-size: 11px;
  line-height: 1.4;
  color: var(--gx-fg);
  white-space: pre-wrap;
  word-break: break-word;
}
.gauntlet-capsule__shell-stderr {
  border-color: color-mix(in oklab, var(--gx-danger-text) 30%, var(--gx-border));
  color: var(--gx-danger-text);
  margin-top: 6px;
}

.gauntlet-capsule__voice {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid var(--gx-border);
  background: var(--gx-tint-soft);
  color: var(--gx-fg-dim);
  font-family: "JetBrains Mono", monospace;
  font-size: 10px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  touch-action: none;
  transition: color 140ms ease, border-color 140ms ease, background 140ms ease;
}
.gauntlet-capsule__voice:hover:not(:disabled) {
  color: var(--gx-fg);
  border-color: var(--gx-border-mid);
  background: var(--gx-tint-soft);
}
.gauntlet-capsule__voice:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.gauntlet-capsule__voice--active {
  color: #f4a08a;
  border-color: rgba(208, 122, 90, 0.55);
  background: rgba(208, 122, 90, 0.10);
  animation: gauntlet-cap-listen 1.2s ease-in-out infinite;
}
.gauntlet-capsule__voice-label {
  font-weight: 600;
}
.gauntlet-capsule__kbd-sep {
  margin: 0 4px;
  color: rgba(255,255,255,0.18);
}

/* ── Command palette overlay (Cmd+K) ────────────────────────────────────── */
@keyframes gauntlet-cap-palette-rise {
  from { opacity: 0; transform: translateY(-4px) scale(0.985); }
  to   { opacity: 1; transform: translateY(0)    scale(1); }
}
.gauntlet-capsule__palette {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: grid;
  place-items: start center;
  padding-top: 30px;
  pointer-events: none;
}
.gauntlet-capsule__palette-scrim {
  position: absolute;
  inset: 0;
  /* Distinct scrim token — sunken is too soft for a meaningful dim on
     light theme (it's 4% black there for inset surfaces). The scrim
     needs to actually darken the background so the palette panel
     reads as a focused layer above. */
  background: var(--gx-scrim);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  pointer-events: auto;
  animation: gauntlet-cap-rise 160ms ease-out both;
}
.gauntlet-capsule__palette-panel {
  position: relative;
  width: min(420px, calc(100% - 36px));
  /* Theme-aware surface — was hardcoded rgba(20, 22, 30, 0.96) which
     showed as a dark slab over the cream flagship. Use the cápsula's
     own surface tokens so the palette inherits the active theme. */
  background: var(--gx-surface-strong, var(--gx-bg-solid));
  border: 1px solid var(--gx-border-mid);
  border-radius: 12px;
  box-shadow:
    0 0 0 1px var(--gx-tint-soft),
    0 24px 48px rgba(var(--gx-shadow-rgb), 0.30);
  pointer-events: auto;
  animation: gauntlet-cap-palette-rise 180ms cubic-bezier(0.2, 0, 0, 1) both;
}
.gauntlet-capsule__palette-input {
  width: 100%;
  padding: 12px 14px;
  border: none;
  background: transparent;
  color: var(--gx-fg);
  font-family: "Inter", sans-serif;
  font-size: 13px;
  outline: none;
  border-bottom: 1px solid var(--gx-border);
}
.gauntlet-capsule__palette-input::placeholder {
  color: var(--gx-fg-muted);
  font-size: 11px;
  letter-spacing: 0.02em;
}
.gauntlet-capsule__palette-list {
  list-style: none;
  margin: 0;
  padding: 6px;
  max-height: 240px;
  overflow-y: auto;
}
.gauntlet-capsule__palette-empty {
  padding: 14px;
  text-align: center;
  color: var(--gx-fg-muted);
  font-family: "JetBrains Mono", monospace;
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.gauntlet-capsule__palette-item {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 9px 12px;
  border-radius: 8px;
  font-family: "Inter", sans-serif;
  font-size: 13px;
  color: var(--gx-fg-dim);
  cursor: pointer;
  overflow: hidden;
  transition: color 140ms ease, transform 160ms cubic-bezier(0.2, 0, 0, 1);
}
/* Slide-in hover — instead of a static fade-in background, an ember
   wash slides in from the left to the active item. The eye reads
   movement, not just a colour swap. */
.gauntlet-capsule__palette-item::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    rgba(208, 122, 90, 0.18) 0%,
    rgba(208, 122, 90, 0.10) 60%,
    transparent 100%
  );
  transform: translateX(-100%);
  transition: transform 220ms cubic-bezier(0.2, 0, 0, 1);
  z-index: 0;
}
.gauntlet-capsule__palette-item > * {
  position: relative;
  z-index: 1;
}
.gauntlet-capsule__palette-item--active {
  color: var(--gx-fg);
}
.gauntlet-capsule__palette-item--active::before {
  transform: translateX(0);
}
.gauntlet-capsule__palette-item--disabled {
  opacity: 0.42;
  cursor: not-allowed;
}
.gauntlet-capsule__palette-shortcut {
  font-family: "JetBrains Mono", monospace;
  font-size: 10px;
  letter-spacing: 0.14em;
  color: var(--gx-fg-muted);
  text-transform: uppercase;
}
.gauntlet-capsule__palette-item--active .gauntlet-capsule__palette-shortcut {
  color: var(--gx-fg-dim);
}

/* Palette item — dual layout: label + description on the left, badges
   and shortcut on the right. Tools carry mode/risk/approval pills. */
.gauntlet-capsule__palette-main {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  flex: 1;
}
.gauntlet-capsule__palette-desc {
  font-family: "Inter", sans-serif;
  font-size: 11px;
  line-height: 1.35;
  color: var(--gx-fg-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.gauntlet-capsule__palette-meta {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}
.gauntlet-capsule__palette-item--tool .gauntlet-capsule__palette-label {
  font-family: "JetBrains Mono", monospace;
  font-size: 12px;
  letter-spacing: 0.04em;
  color: var(--gx-code-keyword);
}
.gauntlet-capsule__palette-item--tool.gauntlet-capsule__palette-item--active
  .gauntlet-capsule__palette-label {
  color: var(--gx-code-keyword);
}
.gauntlet-capsule__palette-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 7px;
  border-radius: 999px;
  font-family: "JetBrains Mono", monospace;
  font-size: 9px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  border: 1px solid var(--gx-border);
  background: var(--gx-tint-soft);
  color: var(--gx-fg-muted);
}
.gauntlet-capsule__palette-badge--mode-read {
  border-color: rgba(98, 130, 200, 0.30);
  background: rgba(98, 130, 200, 0.10);
  color: #4f6fb0;
}
.gauntlet-capsule__palette-badge--mode-write {
  border-color: rgba(208, 122, 90, 0.40);
  background: rgba(208, 122, 90, 0.12);
  color: #b3501f;
}
.gauntlet-capsule__palette-badge--risk-medium {
  border-color: rgba(212, 150, 60, 0.45);
  background: rgba(212, 150, 60, 0.12);
  color: #b3791f;
}
.gauntlet-capsule__palette-badge--risk-high {
  border-color: rgba(212, 96, 60, 0.55);
  background: rgba(212, 96, 60, 0.14);
  color: #b3401f;
}
.gauntlet-capsule__palette-badge--approval {
  border-color: rgba(212, 96, 60, 0.40);
  background: rgba(212, 96, 60, 0.10);
  color: #b3401f;
}

/* ── Toast flash (saved / code copied) ──────────────────────────────────── */
@keyframes gauntlet-cap-flash-rise {
  0%   { opacity: 0; transform: translate(-50%, 8px); }
  20%  { opacity: 1; transform: translate(-50%, 0); }
  80%  { opacity: 1; transform: translate(-50%, 0); }
  100% { opacity: 0; transform: translate(-50%, -4px); }
}
.gauntlet-capsule__flash {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  padding: 6px 14px;
  border-radius: 999px;
  background: rgba(122, 180, 138, 0.14);
  color: var(--gx-success-text);
  border: 1px solid rgba(122, 180, 138, 0.32);
  font-family: "JetBrains Mono", monospace;
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  pointer-events: none;
  z-index: 3;
  animation: gauntlet-cap-flash-rise 1400ms ease-out both;
}

/* ── Markdown rendering ─────────────────────────────────────────────────── */
.gauntlet-md {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.gauntlet-md__prose {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.gauntlet-md__p {
  margin: 0;
  font-family: "Inter", sans-serif;
  font-size: 13px;
  line-height: 1.62;
  color: var(--gx-fg);
}
.gauntlet-md__h {
  margin: 8px 0 2px;
  font-family: "Charter", "New York", "Cambria", "Georgia", serif;
  font-weight: 500;
  letter-spacing: -0.012em;
  color: var(--gx-fg);
  line-height: 1.25;
}
.gauntlet-md__h1 { font-size: 18px; }
.gauntlet-md__h2 { font-size: 15px; }
.gauntlet-md__h3 { font-size: 13px; letter-spacing: 0.04em; text-transform: uppercase; color: var(--gx-fg-dim); }
.gauntlet-md__strong { font-weight: 600; color: var(--gx-fg); }
.gauntlet-md__em { font-style: italic; color: var(--gx-fg-dim); }
.gauntlet-md__inline-code {
  font-family: "JetBrains Mono", "Fira Code", ui-monospace, monospace;
  font-size: 11.5px;
  background: var(--gx-ember-soft, rgba(208, 122, 90, 0.10));
  color: var(--gx-code-keyword);
  padding: 1px 6px;
  border-radius: 4px;
  border: 1px solid rgba(208, 122, 90, 0.20);
}
.gauntlet-md__link {
  color: var(--gx-ember);
  text-decoration: underline;
  text-decoration-color: rgba(208, 122, 90, 0.45);
  text-underline-offset: 2px;
}
.gauntlet-md__link:hover { text-decoration-color: var(--gx-ember); }
.gauntlet-md__quote {
  margin: 0;
  padding: 6px 12px;
  border-left: 2px solid rgba(208, 122, 90, 0.55);
  background: rgba(208, 122, 90, 0.04);
  color: var(--gx-fg-dim);
  font-style: italic;
  font-size: 12.5px;
  line-height: 1.6;
  border-radius: 0 6px 6px 0;
}
.gauntlet-md__hr {
  border: none;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.10),
    transparent
  );
  margin: 4px 0;
}
.gauntlet-md__list {
  margin: 0;
  padding-left: 18px;
  display: flex;
  flex-direction: column;
  gap: 3px;
  font-family: "Inter", sans-serif;
  font-size: 13px;
  line-height: 1.55;
}
.gauntlet-md__li::marker {
  color: rgba(208, 122, 90, 0.55);
}
.gauntlet-md__code {
  margin: 0;
  border: 1px solid var(--gx-border);
  border-radius: 10px;
  background: var(--gx-code-bg);
  overflow: hidden;
}
.gauntlet-md__code-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 10px;
  border-bottom: 1px solid var(--gx-border);
  background: var(--gx-code-meta-bg);
  font-family: "JetBrains Mono", monospace;
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}
.gauntlet-md__code-lang {
  color: var(--gx-fg-muted);
}
.gauntlet-md__code-copy {
  background: transparent;
  border: 1px solid var(--gx-border);
  color: var(--gx-fg-dim);
  padding: 2px 8px;
  border-radius: 4px;
  font-family: inherit;
  font-size: 9px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  cursor: pointer;
  transition: color 140ms ease, border-color 140ms ease;
}
.gauntlet-md__code-copy:hover {
  color: var(--gx-fg);
  border-color: var(--gx-border-mid);
}
.gauntlet-md__code-body {
  margin: 0;
  padding: 12px 14px;
  font-family: "JetBrains Mono", "Fira Code", ui-monospace, monospace;
  font-size: 12px;
  line-height: 1.6;
  color: var(--gx-code-fg);
  overflow-x: auto;
  white-space: pre;
}
.gauntlet-md__code-body code {
  font-family: inherit;
  background: transparent;
  color: inherit;
  padding: 0;
  border: none;
}
/* Syntax tokens — keywords/strings/numbers/comments/fns picked by the
   in-house tokenizer in markdown.tsx. Each kind binds to a --gx-code-*
   custom property so the light flagship + night premium themes stay
   in lockstep without forking the markdown.tsx logic. */
.gauntlet-md__tok--k { color: var(--gx-code-keyword); font-weight: 500; }
.gauntlet-md__tok--s { color: var(--gx-code-string); }
.gauntlet-md__tok--n { color: var(--gx-code-number); }
.gauntlet-md__tok--c { color: var(--gx-code-comment); font-style: italic; }
.gauntlet-md__tok--f { color: var(--gx-code-fn); }
.gauntlet-md__tok--p { color: inherit; }
`,df=100,pf=new Set(["script","style","meta","link","noscript","head","html","br","hr","wbr"]),ff="gauntlet-capsule-host";function gf(o){const u=o.tagName.toLowerCase(),s=o.getAttribute("id");if(s&&!s.startsWith("gauntlet-"))return`${u}#${CSS.escape(s)}`;const v=o.getAttribute("name");if(v)return`${u}[name="${v}"]`;const m=o.getAttribute("type");if(m)return`${u}[type="${m}"]`;const h=Array.from(o.classList).filter(L=>L.length>2&&!L.startsWith("is-")&&!L.startsWith("has-")).slice(0,2);return h.length>0?`${u}.${h.map(L=>CSS.escape(L)).join(".")}`:u}function mf(o){try{const u=window.getComputedStyle(o);if(u.display==="none"||u.visibility==="hidden"||u.opacity==="0")return!1;const s=o.getBoundingClientRect();return!(s.width===0&&s.height===0||s.bottom<0||s.top>window.innerHeight||s.right<0||s.left>window.innerWidth)}catch{return!1}}function hf(o){let u=0,s=o;for(;s&&s!==document.body;)u++,s=s.parentElement;return u}function xf(o){var s;let u=o;for(;u;){if(u.id===ff||(s=u.id)!=null&&s.startsWith("gauntlet-"))return!0;u=u.parentElement}return!1}function vf(o){var M;const u=o.tagName.toLowerCase();if(pf.has(u)||xf(o))return null;const s=gf(o),v=mf(o),m=hf(o),h={selector:s,tag:u,visible:v,depth:m},L=o.getAttribute("type");L&&(h.type=L);const E=o.getAttribute("placeholder")||o.getAttribute("aria-label")||o.getAttribute("title")||"";E&&(h.placeholder=E.trim().slice(0,80));const b=((M=o.innerText)==null?void 0:M.trim())??"";return b&&b.length>0&&(h.text=b.slice(0,50)),h}const yf=["input","textarea","select",'[contenteditable="true"]',"button","a[href]","label",'[role="button"]','[role="link"]','[role="textbox"]','[role="combobox"]','[role="listbox"]','[role="menuitem"]','[role="tab"]','[role="checkbox"]','[role="radio"]','[role="switch"]',"nav","main","form"].join(", ");function _f(){try{const o=[],u=new Set,s=document.querySelectorAll(yf);for(const v of Array.from(s)){if(o.length>=df)break;const m=vf(v);m&&(u.has(m.selector)||(u.add(m.selector),o.push(m)))}return{elements:o}}catch{return{elements:[]}}}const cc=5e3;function wf(){try{const o=document.body;if(!o)return"";const s=(o.innerText??"").replace(/\r\n/g,`
`).replace(/\r/g,`
`).replace(/\n{3,}/g,`

`).replace(/[ \t]{2,}/g," ").trim();return s.length<=cc?s:s.slice(0,cc)+"…"}catch{return""}}function xc(){return{text:Sf(),url:Ef(),pageTitle:Cf(),pageText:wf(),domSkeleton:JSON.stringify(_f()),bbox:Nf()}}const kf=50;async function bf(){var L;const o=xc();if(o.text)return o;const u=`gauntlet-cid-${Math.random().toString(36).slice(2)}`,s=[],v=E=>{const b=E.data;!b||b.gauntlet!=="subframe-selection-response"||b.cid===u&&(typeof b.text!="string"||!b.text||s.push({text:b.text,url:typeof b.url=="string"?b.url:void 0,pageTitle:typeof b.pageTitle=="string"?b.pageTitle:void 0}))};window.addEventListener("message",v);let m=null;try{m=document.querySelectorAll("iframe")}catch{m=null}if(m)for(const E of Array.from(m))try{(L=E.contentWindow)==null||L.postMessage({gauntlet:"subframe-selection-request",cid:u},"*")}catch{}await new Promise(E=>window.setTimeout(E,kf)),window.removeEventListener("message",v);const h=s.sort((E,b)=>b.text.length-E.text.length)[0];return h?{...o,text:h.text,url:h.url||o.url,pageTitle:h.pageTitle||o.pageTitle,bbox:null}:o}function Sf(){try{const o=window.getSelection();return o?o.toString().trim():""}catch{return""}}function Ef(){try{return window.location.href}catch{return""}}function Cf(){try{return document.title??""}catch{return""}}function Nf(){try{const o=window.getSelection();if(!o||o.rangeCount===0||o.isCollapsed)return null;const s=o.getRangeAt(0).getBoundingClientRect();return s.width===0&&s.height===0?null:{x:s.x,y:s.y,width:s.width,height:s.height}}catch{return null}}const jf={domExecution:!0,pillSurface:!0,screenshot:!0,dismissDomain:!0,voice:typeof window<"u"&&("SpeechRecognition"in window||"webkitSpeechRecognition"in window),streaming:!0,refreshSelection:!0,filesystemRead:!1,filesystemWrite:!1,screenCapture:!1,remoteVoice:!0,shellExecute:!1,notifications:!1};async function Tf(o,u,s){const v=await chrome.runtime.sendMessage({type:"gauntlet:fetch",url:u,method:o,headers:{"content-type":"application/json"},body:s===void 0?void 0:JSON.stringify(s)});if(!v||!v.ok)throw new Error(`composer: background fetch failed — ${(v==null?void 0:v.error)??"unknown error"}`);let m=null;if(v.body!=null&&v.body!=="")try{m=JSON.parse(v.body)}catch{m=v.body}const h=v.status??0;if(h<200||h>=300)throw new Error(`composer: ${h} ${v.statusText??""}`.trim());return m}const zf={async get(o){try{return(await chrome.storage.local.get(o))[o]??null}catch{return null}},async set(o,u){try{await chrome.storage.local.set({[o]:u})}catch{}},async remove(o){try{await chrome.storage.local.remove(o)}catch{}}};function Pf(o,u,s){const v=chrome.runtime.connect({name:"gauntlet:stream"});let m=!1;function h(){if(!m){m=!0;try{v.disconnect()}catch{}}}return v.onMessage.addListener(L=>{if(!L||typeof L!="object")return;const E=L;if(E.type==="sse"&&typeof E.data=="string"){let b=null;try{b=JSON.parse(E.data)}catch{s.onError("malformed SSE payload"),h();return}if(E.event==="delta"){const M=b.text??"";s.onDelta(M)}else if(E.event==="done"){const M=b;s.onDone({plan_id:M.plan_id??"",context_id:M.context_id??"",actions:M.actions??[],compose:M.compose??null,reason:M.reason??null,model_used:M.model_used??"",latency_ms:M.latency_ms??0,raw_response:null}),h()}else if(E.event==="error"){const M=b.error??"model error";s.onError(M),h()}}else E.type==="error"?(s.onError(E.error??"transport error"),h()):E.type==="closed"&&(m||(s.onDone({plan_id:"",context_id:"",actions:[],compose:null,reason:"stream ended without result",model_used:"",latency_ms:0,raw_response:null}),m=!0))}),v.onDisconnect.addListener(()=>{var L;if(!m){const E=(L=chrome.runtime.lastError)==null?void 0:L.message;s.onError(E??"disconnected"),m=!0}}),v.postMessage({type:"start",url:o,body:u}),()=>{if(!m){try{v.postMessage({type:"abort"})}catch{}h()}}}function Mf(){return{shell:"browser",capabilities:jf,transport:{fetchJson(o,u,s){return Tf(o,u,s)},stream:Pf},storage:zf,selection:{read:()=>xc(),readAsync:()=>bf()},domActions:{execute:Ap},screenshot:{async capture(){var o;if(typeof chrome>"u"||!((o=chrome.runtime)!=null&&o.sendMessage))return null;try{const u=await chrome.runtime.sendMessage({type:"gauntlet:capture_screenshot"});return!(u!=null&&u.ok)||!u.dataUrl?null:u.dataUrl}catch{return null}}},debug:{async lastSummon(){try{const o=await chrome.runtime.sendMessage({type:"gauntlet:debug"});return(o==null?void 0:o.lastSummon)??null}catch{return null}}}}}const Lf=`
  html, body {
    margin: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    /* Flagship light background — was #0a0c10 (deep ink) which left a
       black border around the cream cápsula on the first paint. The
       cápsula itself fills the window edge-to-edge, but if any frame
       slips through with --gx-bg unresolved (cold load, slow shadow
       css), this guard keeps the surface luminous instead of pitch. */
    background: #fbf7ee;
  }
  html[data-theme="dark"], body[data-theme="dark"] {
    background: #0e1016;
  }
  #root {
    width: 100%;
    height: 100%;
  }
  .gauntlet-capsule {
    position: static;
    width: 100%;
    max-width: 100%;
    height: 100%;
    max-height: 100%;
    min-height: 0;
    border-radius: 0;
    box-shadow: none;
    border: none;
    transform: none;
    /* The standalone window is the cápsula container — disable the
       enter rise transform; the capsule is already in place when the
       window opens. Removes the awkward double-animation of OS chrome
       fade + cap rise. */
    animation: none !important;
  }
`,vc=document.createElement("style");vc.textContent=cf+Lf;document.head.appendChild(vc);const dc=Mf(),yc={...dc,capabilities:{...dc.capabilities,domExecution:!1,screenshot:!1,dismissDomain:!1,refreshSelection:!1,pillSurface:!1},domActions:void 0,screenshot:void 0};yc.storage.get("gauntlet:theme").then(o=>{const u=o==="dark"||o==="light"?o:"light";document.documentElement.setAttribute("data-theme",u),document.body.setAttribute("data-theme",u)});const Rf=up.createRoot(document.getElementById("root"));Rf.render(d.jsx(N.StrictMode,{children:d.jsx(Zp,{ambient:yc,initialSnapshot:{text:"",url:"window://composer",pageTitle:"Composer",pageText:"",domSkeleton:"",bbox:null},onDismiss:()=>window.close()})}));
