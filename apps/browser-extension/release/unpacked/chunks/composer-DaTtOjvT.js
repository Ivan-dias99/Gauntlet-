(function(){const u=document.createElement("link").relList;if(u&&u.supports&&u.supports("modulepreload"))return;for(const m of document.querySelectorAll('link[rel="modulepreload"]'))v(m);new MutationObserver(m=>{for(const h of m)if(h.type==="childList")for(const z of h.addedNodes)z.tagName==="LINK"&&z.rel==="modulepreload"&&v(z)}).observe(document,{childList:!0,subtree:!0});function i(m){const h={};return m.integrity&&(h.integrity=m.integrity),m.referrerPolicy&&(h.referrerPolicy=m.referrerPolicy),m.crossOrigin==="use-credentials"?h.credentials="include":m.crossOrigin==="anonymous"?h.credentials="omit":h.credentials="same-origin",h}function v(m){if(m.ep)return;m.ep=!0;const h=i(m);fetch(m.href,h)}})();try{}catch(o){console.error("[wxt] Failed to initialize plugins",o)}var gs={exports:{}},vl={},ms={exports:{}},ne={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Qu;function tp(){if(Qu)return ne;Qu=1;var o=Symbol.for("react.element"),u=Symbol.for("react.portal"),i=Symbol.for("react.fragment"),v=Symbol.for("react.strict_mode"),m=Symbol.for("react.profiler"),h=Symbol.for("react.provider"),z=Symbol.for("react.context"),E=Symbol.for("react.forward_ref"),k=Symbol.for("react.suspense"),M=Symbol.for("react.memo"),P=Symbol.for("react.lazy"),b=Symbol.iterator;function U(x){return x===null||typeof x!="object"?null:(x=b&&x[b]||x["@@iterator"],typeof x=="function"?x:null)}var fe={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},re=Object.assign,te={};function le(x,C,Z){this.props=x,this.context=C,this.refs=te,this.updater=Z||fe}le.prototype.isReactComponent={},le.prototype.setState=function(x,C){if(typeof x!="object"&&typeof x!="function"&&x!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,x,C,"setState")},le.prototype.forceUpdate=function(x){this.updater.enqueueForceUpdate(this,x,"forceUpdate")};function R(){}R.prototype=le.prototype;function Me(x,C,Z){this.props=x,this.context=C,this.refs=te,this.updater=Z||fe}var Te=Me.prototype=new R;Te.constructor=Me,re(Te,le.prototype),Te.isPureReactComponent=!0;var we=Array.isArray,Y=Object.prototype.hasOwnProperty,pe={current:null},ze={key:!0,ref:!0,__self:!0,__source:!0};function De(x,C,Z){var ee,oe={},se=null,he=null;if(C!=null)for(ee in C.ref!==void 0&&(he=C.ref),C.key!==void 0&&(se=""+C.key),C)Y.call(C,ee)&&!ze.hasOwnProperty(ee)&&(oe[ee]=C[ee]);var ie=arguments.length-2;if(ie===1)oe.children=Z;else if(1<ie){for(var ge=Array(ie),We=0;We<ie;We++)ge[We]=arguments[We+2];oe.children=ge}if(x&&x.defaultProps)for(ee in ie=x.defaultProps,ie)oe[ee]===void 0&&(oe[ee]=ie[ee]);return{$$typeof:o,type:x,key:se,ref:he,props:oe,_owner:pe.current}}function Ct(x,C){return{$$typeof:o,type:x.type,key:C,ref:x.ref,props:x.props,_owner:x._owner}}function gt(x){return typeof x=="object"&&x!==null&&x.$$typeof===o}function Ft(x){var C={"=":"=0",":":"=2"};return"$"+x.replace(/[=:]/g,function(Z){return C[Z]})}var ot=/\/+/g;function Ye(x,C){return typeof x=="object"&&x!==null&&x.key!=null?Ft(""+x.key):C.toString(36)}function st(x,C,Z,ee,oe){var se=typeof x;(se==="undefined"||se==="boolean")&&(x=null);var he=!1;if(x===null)he=!0;else switch(se){case"string":case"number":he=!0;break;case"object":switch(x.$$typeof){case o:case u:he=!0}}if(he)return he=x,oe=oe(he),x=ee===""?"."+Ye(he,0):ee,we(oe)?(Z="",x!=null&&(Z=x.replace(ot,"$&/")+"/"),st(oe,C,Z,"",function(We){return We})):oe!=null&&(gt(oe)&&(oe=Ct(oe,Z+(!oe.key||he&&he.key===oe.key?"":(""+oe.key).replace(ot,"$&/")+"/")+x)),C.push(oe)),1;if(he=0,ee=ee===""?".":ee+":",we(x))for(var ie=0;ie<x.length;ie++){se=x[ie];var ge=ee+Ye(se,ie);he+=st(se,C,Z,ge,oe)}else if(ge=U(x),typeof ge=="function")for(x=ge.call(x),ie=0;!(se=x.next()).done;)se=se.value,ge=ee+Ye(se,ie++),he+=st(se,C,Z,ge,oe);else if(se==="object")throw C=String(x),Error("Objects are not valid as a React child (found: "+(C==="[object Object]"?"object with keys {"+Object.keys(x).join(", ")+"}":C)+"). If you meant to render a collection of children, use an array instead.");return he}function mt(x,C,Z){if(x==null)return x;var ee=[],oe=0;return st(x,ee,"","",function(se){return C.call(Z,se,oe++)}),ee}function Fe(x){if(x._status===-1){var C=x._result;C=C(),C.then(function(Z){(x._status===0||x._status===-1)&&(x._status=1,x._result=Z)},function(Z){(x._status===0||x._status===-1)&&(x._status=2,x._result=Z)}),x._status===-1&&(x._status=0,x._result=C)}if(x._status===1)return x._result.default;throw x._result}var ve={current:null},O={transition:null},Q={ReactCurrentDispatcher:ve,ReactCurrentBatchConfig:O,ReactCurrentOwner:pe};function A(){throw Error("act(...) is not supported in production builds of React.")}return ne.Children={map:mt,forEach:function(x,C,Z){mt(x,function(){C.apply(this,arguments)},Z)},count:function(x){var C=0;return mt(x,function(){C++}),C},toArray:function(x){return mt(x,function(C){return C})||[]},only:function(x){if(!gt(x))throw Error("React.Children.only expected to receive a single React element child.");return x}},ne.Component=le,ne.Fragment=i,ne.Profiler=m,ne.PureComponent=Me,ne.StrictMode=v,ne.Suspense=k,ne.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Q,ne.act=A,ne.cloneElement=function(x,C,Z){if(x==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+x+".");var ee=re({},x.props),oe=x.key,se=x.ref,he=x._owner;if(C!=null){if(C.ref!==void 0&&(se=C.ref,he=pe.current),C.key!==void 0&&(oe=""+C.key),x.type&&x.type.defaultProps)var ie=x.type.defaultProps;for(ge in C)Y.call(C,ge)&&!ze.hasOwnProperty(ge)&&(ee[ge]=C[ge]===void 0&&ie!==void 0?ie[ge]:C[ge])}var ge=arguments.length-2;if(ge===1)ee.children=Z;else if(1<ge){ie=Array(ge);for(var We=0;We<ge;We++)ie[We]=arguments[We+2];ee.children=ie}return{$$typeof:o,type:x.type,key:oe,ref:se,props:ee,_owner:he}},ne.createContext=function(x){return x={$$typeof:z,_currentValue:x,_currentValue2:x,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},x.Provider={$$typeof:h,_context:x},x.Consumer=x},ne.createElement=De,ne.createFactory=function(x){var C=De.bind(null,x);return C.type=x,C},ne.createRef=function(){return{current:null}},ne.forwardRef=function(x){return{$$typeof:E,render:x}},ne.isValidElement=gt,ne.lazy=function(x){return{$$typeof:P,_payload:{_status:-1,_result:x},_init:Fe}},ne.memo=function(x,C){return{$$typeof:M,type:x,compare:C===void 0?null:C}},ne.startTransition=function(x){var C=O.transition;O.transition={};try{x()}finally{O.transition=C}},ne.unstable_act=A,ne.useCallback=function(x,C){return ve.current.useCallback(x,C)},ne.useContext=function(x){return ve.current.useContext(x)},ne.useDebugValue=function(){},ne.useDeferredValue=function(x){return ve.current.useDeferredValue(x)},ne.useEffect=function(x,C){return ve.current.useEffect(x,C)},ne.useId=function(){return ve.current.useId()},ne.useImperativeHandle=function(x,C,Z){return ve.current.useImperativeHandle(x,C,Z)},ne.useInsertionEffect=function(x,C){return ve.current.useInsertionEffect(x,C)},ne.useLayoutEffect=function(x,C){return ve.current.useLayoutEffect(x,C)},ne.useMemo=function(x,C){return ve.current.useMemo(x,C)},ne.useReducer=function(x,C,Z){return ve.current.useReducer(x,C,Z)},ne.useRef=function(x){return ve.current.useRef(x)},ne.useState=function(x){return ve.current.useState(x)},ne.useSyncExternalStore=function(x,C,Z){return ve.current.useSyncExternalStore(x,C,Z)},ne.useTransition=function(){return ve.current.useTransition()},ne.version="18.3.1",ne}var Ju;function bs(){return Ju||(Ju=1,ms.exports=tp()),ms.exports}/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Yu;function np(){if(Yu)return vl;Yu=1;var o=bs(),u=Symbol.for("react.element"),i=Symbol.for("react.fragment"),v=Object.prototype.hasOwnProperty,m=o.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,h={key:!0,ref:!0,__self:!0,__source:!0};function z(E,k,M){var P,b={},U=null,fe=null;M!==void 0&&(U=""+M),k.key!==void 0&&(U=""+k.key),k.ref!==void 0&&(fe=k.ref);for(P in k)v.call(k,P)&&!h.hasOwnProperty(P)&&(b[P]=k[P]);if(E&&E.defaultProps)for(P in k=E.defaultProps,k)b[P]===void 0&&(b[P]=k[P]);return{$$typeof:u,type:E,key:U,ref:fe,props:b,_owner:m.current}}return vl.Fragment=i,vl.jsx=z,vl.jsxs=z,vl}var Gu;function rp(){return Gu||(Gu=1,gs.exports=np()),gs.exports}var d=rp(),j=bs(),Na={},hs={exports:{}},at={},xs={exports:{}},vs={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var qu;function lp(){return qu||(qu=1,(function(o){function u(O,Q){var A=O.length;O.push(Q);e:for(;0<A;){var x=A-1>>>1,C=O[x];if(0<m(C,Q))O[x]=Q,O[A]=C,A=x;else break e}}function i(O){return O.length===0?null:O[0]}function v(O){if(O.length===0)return null;var Q=O[0],A=O.pop();if(A!==Q){O[0]=A;e:for(var x=0,C=O.length,Z=C>>>1;x<Z;){var ee=2*(x+1)-1,oe=O[ee],se=ee+1,he=O[se];if(0>m(oe,A))se<C&&0>m(he,oe)?(O[x]=he,O[se]=A,x=se):(O[x]=oe,O[ee]=A,x=ee);else if(se<C&&0>m(he,A))O[x]=he,O[se]=A,x=se;else break e}}return Q}function m(O,Q){var A=O.sortIndex-Q.sortIndex;return A!==0?A:O.id-Q.id}if(typeof performance=="object"&&typeof performance.now=="function"){var h=performance;o.unstable_now=function(){return h.now()}}else{var z=Date,E=z.now();o.unstable_now=function(){return z.now()-E}}var k=[],M=[],P=1,b=null,U=3,fe=!1,re=!1,te=!1,le=typeof setTimeout=="function"?setTimeout:null,R=typeof clearTimeout=="function"?clearTimeout:null,Me=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function Te(O){for(var Q=i(M);Q!==null;){if(Q.callback===null)v(M);else if(Q.startTime<=O)v(M),Q.sortIndex=Q.expirationTime,u(k,Q);else break;Q=i(M)}}function we(O){if(te=!1,Te(O),!re)if(i(k)!==null)re=!0,Fe(Y);else{var Q=i(M);Q!==null&&ve(we,Q.startTime-O)}}function Y(O,Q){re=!1,te&&(te=!1,R(De),De=-1),fe=!0;var A=U;try{for(Te(Q),b=i(k);b!==null&&(!(b.expirationTime>Q)||O&&!Ft());){var x=b.callback;if(typeof x=="function"){b.callback=null,U=b.priorityLevel;var C=x(b.expirationTime<=Q);Q=o.unstable_now(),typeof C=="function"?b.callback=C:b===i(k)&&v(k),Te(Q)}else v(k);b=i(k)}if(b!==null)var Z=!0;else{var ee=i(M);ee!==null&&ve(we,ee.startTime-Q),Z=!1}return Z}finally{b=null,U=A,fe=!1}}var pe=!1,ze=null,De=-1,Ct=5,gt=-1;function Ft(){return!(o.unstable_now()-gt<Ct)}function ot(){if(ze!==null){var O=o.unstable_now();gt=O;var Q=!0;try{Q=ze(!0,O)}finally{Q?Ye():(pe=!1,ze=null)}}else pe=!1}var Ye;if(typeof Me=="function")Ye=function(){Me(ot)};else if(typeof MessageChannel<"u"){var st=new MessageChannel,mt=st.port2;st.port1.onmessage=ot,Ye=function(){mt.postMessage(null)}}else Ye=function(){le(ot,0)};function Fe(O){ze=O,pe||(pe=!0,Ye())}function ve(O,Q){De=le(function(){O(o.unstable_now())},Q)}o.unstable_IdlePriority=5,o.unstable_ImmediatePriority=1,o.unstable_LowPriority=4,o.unstable_NormalPriority=3,o.unstable_Profiling=null,o.unstable_UserBlockingPriority=2,o.unstable_cancelCallback=function(O){O.callback=null},o.unstable_continueExecution=function(){re||fe||(re=!0,Fe(Y))},o.unstable_forceFrameRate=function(O){0>O||125<O?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):Ct=0<O?Math.floor(1e3/O):5},o.unstable_getCurrentPriorityLevel=function(){return U},o.unstable_getFirstCallbackNode=function(){return i(k)},o.unstable_next=function(O){switch(U){case 1:case 2:case 3:var Q=3;break;default:Q=U}var A=U;U=Q;try{return O()}finally{U=A}},o.unstable_pauseExecution=function(){},o.unstable_requestPaint=function(){},o.unstable_runWithPriority=function(O,Q){switch(O){case 1:case 2:case 3:case 4:case 5:break;default:O=3}var A=U;U=O;try{return Q()}finally{U=A}},o.unstable_scheduleCallback=function(O,Q,A){var x=o.unstable_now();switch(typeof A=="object"&&A!==null?(A=A.delay,A=typeof A=="number"&&0<A?x+A:x):A=x,O){case 1:var C=-1;break;case 2:C=250;break;case 5:C=1073741823;break;case 4:C=1e4;break;default:C=5e3}return C=A+C,O={id:P++,callback:Q,priorityLevel:O,startTime:A,expirationTime:C,sortIndex:-1},A>x?(O.sortIndex=A,u(M,O),i(k)===null&&O===i(M)&&(te?(R(De),De=-1):te=!0,ve(we,A-x))):(O.sortIndex=C,u(k,O),re||fe||(re=!0,Fe(Y))),O},o.unstable_shouldYield=Ft,o.unstable_wrapCallback=function(O){var Q=U;return function(){var A=U;U=Q;try{return O.apply(this,arguments)}finally{U=A}}}})(vs)),vs}var Xu;function ap(){return Xu||(Xu=1,xs.exports=lp()),xs.exports}/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Zu;function op(){if(Zu)return at;Zu=1;var o=bs(),u=ap();function i(e){for(var t="https://reactjs.org/docs/error-decoder.html?invariant="+e,n=1;n<arguments.length;n++)t+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var v=new Set,m={};function h(e,t){z(e,t),z(e+"Capture",t)}function z(e,t){for(m[e]=t,e=0;e<t.length;e++)v.add(t[e])}var E=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),k=Object.prototype.hasOwnProperty,M=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,P={},b={};function U(e){return k.call(b,e)?!0:k.call(P,e)?!1:M.test(e)?b[e]=!0:(P[e]=!0,!1)}function fe(e,t,n,r){if(n!==null&&n.type===0)return!1;switch(typeof t){case"function":case"symbol":return!0;case"boolean":return r?!1:n!==null?!n.acceptsBooleans:(e=e.toLowerCase().slice(0,5),e!=="data-"&&e!=="aria-");default:return!1}}function re(e,t,n,r){if(t===null||typeof t>"u"||fe(e,t,n,r))return!0;if(r)return!1;if(n!==null)switch(n.type){case 3:return!t;case 4:return t===!1;case 5:return isNaN(t);case 6:return isNaN(t)||1>t}return!1}function te(e,t,n,r,l,a,s){this.acceptsBooleans=t===2||t===3||t===4,this.attributeName=r,this.attributeNamespace=l,this.mustUseProperty=n,this.propertyName=e,this.type=t,this.sanitizeURL=a,this.removeEmptyString=s}var le={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e){le[e]=new te(e,0,!1,e,null,!1,!1)}),[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(e){var t=e[0];le[t]=new te(t,1,!1,e[1],null,!1,!1)}),["contentEditable","draggable","spellCheck","value"].forEach(function(e){le[e]=new te(e,2,!1,e.toLowerCase(),null,!1,!1)}),["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(e){le[e]=new te(e,2,!1,e,null,!1,!1)}),"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e){le[e]=new te(e,3,!1,e.toLowerCase(),null,!1,!1)}),["checked","multiple","muted","selected"].forEach(function(e){le[e]=new te(e,3,!0,e,null,!1,!1)}),["capture","download"].forEach(function(e){le[e]=new te(e,4,!1,e,null,!1,!1)}),["cols","rows","size","span"].forEach(function(e){le[e]=new te(e,6,!1,e,null,!1,!1)}),["rowSpan","start"].forEach(function(e){le[e]=new te(e,5,!1,e.toLowerCase(),null,!1,!1)});var R=/[\-:]([a-z])/g;function Me(e){return e[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e){var t=e.replace(R,Me);le[t]=new te(t,1,!1,e,null,!1,!1)}),"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e){var t=e.replace(R,Me);le[t]=new te(t,1,!1,e,"http://www.w3.org/1999/xlink",!1,!1)}),["xml:base","xml:lang","xml:space"].forEach(function(e){var t=e.replace(R,Me);le[t]=new te(t,1,!1,e,"http://www.w3.org/XML/1998/namespace",!1,!1)}),["tabIndex","crossOrigin"].forEach(function(e){le[e]=new te(e,1,!1,e.toLowerCase(),null,!1,!1)}),le.xlinkHref=new te("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1),["src","href","action","formAction"].forEach(function(e){le[e]=new te(e,1,!1,e.toLowerCase(),null,!0,!0)});function Te(e,t,n,r){var l=le.hasOwnProperty(t)?le[t]:null;(l!==null?l.type!==0:r||!(2<t.length)||t[0]!=="o"&&t[0]!=="O"||t[1]!=="n"&&t[1]!=="N")&&(re(t,n,l,r)&&(n=null),r||l===null?U(t)&&(n===null?e.removeAttribute(t):e.setAttribute(t,""+n)):l.mustUseProperty?e[l.propertyName]=n===null?l.type===3?!1:"":n:(t=l.attributeName,r=l.attributeNamespace,n===null?e.removeAttribute(t):(l=l.type,n=l===3||l===4&&n===!0?"":""+n,r?e.setAttributeNS(r,t,n):e.setAttribute(t,n))))}var we=o.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,Y=Symbol.for("react.element"),pe=Symbol.for("react.portal"),ze=Symbol.for("react.fragment"),De=Symbol.for("react.strict_mode"),Ct=Symbol.for("react.profiler"),gt=Symbol.for("react.provider"),Ft=Symbol.for("react.context"),ot=Symbol.for("react.forward_ref"),Ye=Symbol.for("react.suspense"),st=Symbol.for("react.suspense_list"),mt=Symbol.for("react.memo"),Fe=Symbol.for("react.lazy"),ve=Symbol.for("react.offscreen"),O=Symbol.iterator;function Q(e){return e===null||typeof e!="object"?null:(e=O&&e[O]||e["@@iterator"],typeof e=="function"?e:null)}var A=Object.assign,x;function C(e){if(x===void 0)try{throw Error()}catch(n){var t=n.stack.trim().match(/\n( *(at )?)/);x=t&&t[1]||""}return`
`+x+e}var Z=!1;function ee(e,t){if(!e||Z)return"";Z=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(t)if(t=function(){throw Error()},Object.defineProperty(t.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(t,[])}catch(w){var r=w}Reflect.construct(e,[],t)}else{try{t.call()}catch(w){r=w}e.call(t.prototype)}else{try{throw Error()}catch(w){r=w}e()}}catch(w){if(w&&r&&typeof w.stack=="string"){for(var l=w.stack.split(`
`),a=r.stack.split(`
`),s=l.length-1,c=a.length-1;1<=s&&0<=c&&l[s]!==a[c];)c--;for(;1<=s&&0<=c;s--,c--)if(l[s]!==a[c]){if(s!==1||c!==1)do if(s--,c--,0>c||l[s]!==a[c]){var p=`
`+l[s].replace(" at new "," at ");return e.displayName&&p.includes("<anonymous>")&&(p=p.replace("<anonymous>",e.displayName)),p}while(1<=s&&0<=c);break}}}finally{Z=!1,Error.prepareStackTrace=n}return(e=e?e.displayName||e.name:"")?C(e):""}function oe(e){switch(e.tag){case 5:return C(e.type);case 16:return C("Lazy");case 13:return C("Suspense");case 19:return C("SuspenseList");case 0:case 2:case 15:return e=ee(e.type,!1),e;case 11:return e=ee(e.type.render,!1),e;case 1:return e=ee(e.type,!0),e;default:return""}}function se(e){if(e==null)return null;if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case ze:return"Fragment";case pe:return"Portal";case Ct:return"Profiler";case De:return"StrictMode";case Ye:return"Suspense";case st:return"SuspenseList"}if(typeof e=="object")switch(e.$$typeof){case Ft:return(e.displayName||"Context")+".Consumer";case gt:return(e._context.displayName||"Context")+".Provider";case ot:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case mt:return t=e.displayName||null,t!==null?t:se(e.type)||"Memo";case Fe:t=e._payload,e=e._init;try{return se(e(t))}catch{}}return null}function he(e){var t=e.type;switch(e.tag){case 24:return"Cache";case 9:return(t.displayName||"Context")+".Consumer";case 10:return(t._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return e=t.render,e=e.displayName||e.name||"",t.displayName||(e!==""?"ForwardRef("+e+")":"ForwardRef");case 7:return"Fragment";case 5:return t;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return se(t);case 8:return t===De?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t}return null}function ie(e){switch(typeof e){case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function ge(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function We(e){var t=ge(e)?"checked":"value",n=Object.getOwnPropertyDescriptor(e.constructor.prototype,t),r=""+e[t];if(!e.hasOwnProperty(t)&&typeof n<"u"&&typeof n.get=="function"&&typeof n.set=="function"){var l=n.get,a=n.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return l.call(this)},set:function(s){r=""+s,a.call(this,s)}}),Object.defineProperty(e,t,{enumerable:n.enumerable}),{getValue:function(){return r},setValue:function(s){r=""+s},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function ht(e){e._valueTracker||(e._valueTracker=We(e))}function Xe(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),r="";return e&&(r=ge(e)?e.checked?"true":"false":e.value),e=r,e!==n?(t.setValue(e),!0):!1}function Xn(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}function Nt(e,t){var n=t.checked;return A({},t,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:n??e._wrapperState.initialChecked})}function Zn(e,t){var n=t.defaultValue==null?"":t.defaultValue,r=t.checked!=null?t.checked:t.defaultChecked;n=ie(t.value!=null?t.value:n),e._wrapperState={initialChecked:r,initialValue:n,controlled:t.type==="checkbox"||t.type==="radio"?t.checked!=null:t.value!=null}}function Ut(e,t){t=t.checked,t!=null&&Te(e,"checked",t,!1)}function Bt(e,t){Ut(e,t);var n=ie(t.value),r=t.type;if(n!=null)r==="number"?(n===0&&e.value===""||e.value!=n)&&(e.value=""+n):e.value!==""+n&&(e.value=""+n);else if(r==="submit"||r==="reset"){e.removeAttribute("value");return}t.hasOwnProperty("value")?Lr(e,t.type,n):t.hasOwnProperty("defaultValue")&&Lr(e,t.type,ie(t.defaultValue)),t.checked==null&&t.defaultChecked!=null&&(e.defaultChecked=!!t.defaultChecked)}function Pn(e,t,n){if(t.hasOwnProperty("value")||t.hasOwnProperty("defaultValue")){var r=t.type;if(!(r!=="submit"&&r!=="reset"||t.value!==void 0&&t.value!==null))return;t=""+e._wrapperState.initialValue,n||t===e.value||(e.value=t),e.defaultValue=t}n=e.name,n!==""&&(e.name=""),e.defaultChecked=!!e._wrapperState.initialChecked,n!==""&&(e.name=n)}function Lr(e,t,n){(t!=="number"||Xn(e.ownerDocument)!==e)&&(n==null?e.defaultValue=""+e._wrapperState.initialValue:e.defaultValue!==""+n&&(e.defaultValue=""+n))}var on=Array.isArray;function Ue(e,t,n,r){if(e=e.options,t){t={};for(var l=0;l<n.length;l++)t["$"+n[l]]=!0;for(n=0;n<e.length;n++)l=t.hasOwnProperty("$"+e[n].value),e[n].selected!==l&&(e[n].selected=l),l&&r&&(e[n].defaultSelected=!0)}else{for(n=""+ie(n),t=null,l=0;l<e.length;l++){if(e[l].value===n){e[l].selected=!0,r&&(e[l].defaultSelected=!0);return}t!==null||e[l].disabled||(t=e[l])}t!==null&&(t.selected=!0)}}function sn(e,t){if(t.dangerouslySetInnerHTML!=null)throw Error(i(91));return A({},t,{value:void 0,defaultValue:void 0,children:""+e._wrapperState.initialValue})}function Qt(e,t){var n=t.value;if(n==null){if(n=t.children,t=t.defaultValue,n!=null){if(t!=null)throw Error(i(92));if(on(n)){if(1<n.length)throw Error(i(93));n=n[0]}t=n}t==null&&(t=""),n=t}e._wrapperState={initialValue:ie(n)}}function er(e,t){var n=ie(t.value),r=ie(t.defaultValue);n!=null&&(n=""+n,n!==e.value&&(e.value=n),t.defaultValue==null&&e.defaultValue!==n&&(e.defaultValue=n)),r!=null&&(e.defaultValue=""+r)}function Oe(e){var t=e.textContent;t===e._wrapperState.initialValue&&t!==""&&t!==null&&(e.value=t)}function tr(e){switch(e){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function nr(e,t){return e==null||e==="http://www.w3.org/1999/xhtml"?tr(t):e==="http://www.w3.org/2000/svg"&&t==="foreignObject"?"http://www.w3.org/1999/xhtml":e}var Jt,un=(function(e){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(t,n,r,l){MSApp.execUnsafeLocalFunction(function(){return e(t,n,r,l)})}:e})(function(e,t){if(e.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in e)e.innerHTML=t;else{for(Jt=Jt||document.createElement("div"),Jt.innerHTML="<svg>"+t.valueOf().toString()+"</svg>",t=Jt.firstChild;e.firstChild;)e.removeChild(e.firstChild);for(;t.firstChild;)e.appendChild(t.firstChild)}});function jt(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&n.nodeType===3){n.nodeValue=t;return}}e.textContent=t}var xt={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},rr=["Webkit","ms","Moz","O"];Object.keys(xt).forEach(function(e){rr.forEach(function(t){t=t+e.charAt(0).toUpperCase()+e.substring(1),xt[t]=xt[e]})});function Tt(e,t,n){return t==null||typeof t=="boolean"||t===""?"":n||typeof t!="number"||t===0||xt.hasOwnProperty(e)&&xt[e]?(""+t).trim():t+"px"}function Rr(e,t){e=e.style;for(var n in t)if(t.hasOwnProperty(n)){var r=n.indexOf("--")===0,l=Tt(n,t[n],r);n==="float"&&(n="cssFloat"),r?e.setProperty(n,l):e[n]=l}}var Ta=A({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function lr(e,t){if(t){if(Ta[e]&&(t.children!=null||t.dangerouslySetInnerHTML!=null))throw Error(i(137,e));if(t.dangerouslySetInnerHTML!=null){if(t.children!=null)throw Error(i(60));if(typeof t.dangerouslySetInnerHTML!="object"||!("__html"in t.dangerouslySetInnerHTML))throw Error(i(61))}if(t.style!=null&&typeof t.style!="object")throw Error(i(62))}}function ar(e,t){if(e.indexOf("-")===-1)return typeof t.is=="string";switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Mn=null;function or(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var zt=null,it=null,Pt=null;function Ln(e){if(e=rl(e)){if(typeof zt!="function")throw Error(i(280));var t=e.stateNode;t&&(t=Bl(t),zt(e.stateNode,e.type,t))}}function _l(e){it?Pt?Pt.push(e):Pt=[e]:it=e}function Dr(){if(it){var e=it,t=Pt;if(Pt=it=null,Ln(e),t)for(e=0;e<t.length;e++)Ln(t[e])}}function Or(e,t){return e(t)}function Yt(){}var Rn=!1;function Dn(e,t,n){if(Rn)return e(t,n);Rn=!0;try{return Or(e,t,n)}finally{Rn=!1,(it!==null||Pt!==null)&&(Yt(),Dr())}}function On(e,t){var n=e.stateNode;if(n===null)return null;var r=Bl(n);if(r===null)return null;n=r[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(r=!r.disabled)||(e=e.type,r=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!r;break e;default:e=!1}if(e)return null;if(n&&typeof n!="function")throw Error(i(231,t,typeof n));return n}var ut=!1;if(E)try{var Gt={};Object.defineProperty(Gt,"passive",{get:function(){ut=!0}}),window.addEventListener("test",Gt,Gt),window.removeEventListener("test",Gt,Gt)}catch{ut=!1}function $r(e,t,n,r,l,a,s,c,p){var w=Array.prototype.slice.call(arguments,3);try{t.apply(n,w)}catch(T){this.onError(T)}}var cn=!1,$n=null,qt=!1,sr=null,ir={onError:function(e){cn=!0,$n=e}};function za(e,t,n,r,l,a,s,c,p){cn=!1,$n=null,$r.apply(ir,arguments)}function Mt(e,t,n,r,l,a,s,c,p){if(za.apply(this,arguments),cn){if(cn){var w=$n;cn=!1,$n=null}else throw Error(i(198));qt||(qt=!0,sr=w)}}function Lt(e){var t=e,n=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,(t.flags&4098)!==0&&(n=t.return),e=t.return;while(e)}return t.tag===3?n:null}function vt(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function ur(e){if(Lt(e)!==e)throw Error(i(188))}function Pa(e){var t=e.alternate;if(!t){if(t=Lt(e),t===null)throw Error(i(188));return t!==e?null:e}for(var n=e,r=t;;){var l=n.return;if(l===null)break;var a=l.alternate;if(a===null){if(r=l.return,r!==null){n=r;continue}break}if(l.child===a.child){for(a=l.child;a;){if(a===n)return ur(l),e;if(a===r)return ur(l),t;a=a.sibling}throw Error(i(188))}if(n.return!==r.return)n=l,r=a;else{for(var s=!1,c=l.child;c;){if(c===n){s=!0,n=l,r=a;break}if(c===r){s=!0,r=l,n=a;break}c=c.sibling}if(!s){for(c=a.child;c;){if(c===n){s=!0,n=a,r=l;break}if(c===r){s=!0,r=a,n=l;break}c=c.sibling}if(!s)throw Error(i(189))}}if(n.alternate!==r)throw Error(i(190))}if(n.tag!==3)throw Error(i(188));return n.stateNode.current===n?e:t}function Ir(e){return e=Pa(e),e!==null?wl(e):null}function wl(e){if(e.tag===5||e.tag===6)return e;for(e=e.child;e!==null;){var t=wl(e);if(t!==null)return t;e=e.sibling}return null}var In=u.unstable_scheduleCallback,kl=u.unstable_cancelCallback,Ma=u.unstable_shouldYield,La=u.unstable_requestPaint,ke=u.unstable_now,bl=u.unstable_getCurrentPriorityLevel,cr=u.unstable_ImmediatePriority,f=u.unstable_UserBlockingPriority,S=u.unstable_NormalPriority,$=u.unstable_LowPriority,G=u.unstable_IdlePriority,ae=null,X=null;function Ze(e){if(X&&typeof X.onCommitFiberRoot=="function")try{X.onCommitFiberRoot(ae,e,void 0,(e.current.flags&128)===128)}catch{}}var J=Math.clz32?Math.clz32:An,ue=Math.log,Ce=Math.LN2;function An(e){return e>>>=0,e===0?32:31-(ue(e)/Ce|0)|0}var Sl=64,El=4194304;function Ar(e){switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return e&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return e}}function Cl(e,t){var n=e.pendingLanes;if(n===0)return 0;var r=0,l=e.suspendedLanes,a=e.pingedLanes,s=n&268435455;if(s!==0){var c=s&~l;c!==0?r=Ar(c):(a&=s,a!==0&&(r=Ar(a)))}else s=n&~l,s!==0?r=Ar(s):a!==0&&(r=Ar(a));if(r===0)return 0;if(t!==0&&t!==r&&(t&l)===0&&(l=r&-r,a=t&-t,l>=a||l===16&&(a&4194240)!==0))return t;if((r&4)!==0&&(r|=n&16),t=e.entangledLanes,t!==0)for(e=e.entanglements,t&=r;0<t;)n=31-J(t),l=1<<n,r|=e[n],t&=~l;return r}function _c(e,t){switch(e){case 1:case 2:case 4:return t+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function wc(e,t){for(var n=e.suspendedLanes,r=e.pingedLanes,l=e.expirationTimes,a=e.pendingLanes;0<a;){var s=31-J(a),c=1<<s,p=l[s];p===-1?((c&n)===0||(c&r)!==0)&&(l[s]=_c(c,t)):p<=t&&(e.expiredLanes|=c),a&=~c}}function Ra(e){return e=e.pendingLanes&-1073741825,e!==0?e:e&1073741824?1073741824:0}function Ss(){var e=Sl;return Sl<<=1,(Sl&4194240)===0&&(Sl=64),e}function Da(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function Fr(e,t,n){e.pendingLanes|=t,t!==536870912&&(e.suspendedLanes=0,e.pingedLanes=0),e=e.eventTimes,t=31-J(t),e[t]=n}function kc(e,t){var n=e.pendingLanes&~t;e.pendingLanes=t,e.suspendedLanes=0,e.pingedLanes=0,e.expiredLanes&=t,e.mutableReadLanes&=t,e.entangledLanes&=t,t=e.entanglements;var r=e.eventTimes;for(e=e.expirationTimes;0<n;){var l=31-J(n),a=1<<l;t[l]=0,r[l]=-1,e[l]=-1,n&=~a}}function Oa(e,t){var n=e.entangledLanes|=t;for(e=e.entanglements;n;){var r=31-J(n),l=1<<r;l&t|e[r]&t&&(e[r]|=t),n&=~l}}var me=0;function Es(e){return e&=-e,1<e?4<e?(e&268435455)!==0?16:536870912:4:1}var Cs,$a,Ns,js,Ts,Ia=!1,Nl=[],dn=null,pn=null,fn=null,Ur=new Map,Br=new Map,gn=[],bc="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function zs(e,t){switch(e){case"focusin":case"focusout":dn=null;break;case"dragenter":case"dragleave":pn=null;break;case"mouseover":case"mouseout":fn=null;break;case"pointerover":case"pointerout":Ur.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":Br.delete(t.pointerId)}}function Vr(e,t,n,r,l,a){return e===null||e.nativeEvent!==a?(e={blockedOn:t,domEventName:n,eventSystemFlags:r,nativeEvent:a,targetContainers:[l]},t!==null&&(t=rl(t),t!==null&&$a(t)),e):(e.eventSystemFlags|=r,t=e.targetContainers,l!==null&&t.indexOf(l)===-1&&t.push(l),e)}function Sc(e,t,n,r,l){switch(t){case"focusin":return dn=Vr(dn,e,t,n,r,l),!0;case"dragenter":return pn=Vr(pn,e,t,n,r,l),!0;case"mouseover":return fn=Vr(fn,e,t,n,r,l),!0;case"pointerover":var a=l.pointerId;return Ur.set(a,Vr(Ur.get(a)||null,e,t,n,r,l)),!0;case"gotpointercapture":return a=l.pointerId,Br.set(a,Vr(Br.get(a)||null,e,t,n,r,l)),!0}return!1}function Ps(e){var t=Fn(e.target);if(t!==null){var n=Lt(t);if(n!==null){if(t=n.tag,t===13){if(t=vt(n),t!==null){e.blockedOn=t,Ts(e.priority,function(){Ns(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}e.blockedOn=null}function jl(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var n=Fa(e.domEventName,e.eventSystemFlags,t[0],e.nativeEvent);if(n===null){n=e.nativeEvent;var r=new n.constructor(n.type,n);Mn=r,n.target.dispatchEvent(r),Mn=null}else return t=rl(n),t!==null&&$a(t),e.blockedOn=n,!1;t.shift()}return!0}function Ms(e,t,n){jl(e)&&n.delete(t)}function Ec(){Ia=!1,dn!==null&&jl(dn)&&(dn=null),pn!==null&&jl(pn)&&(pn=null),fn!==null&&jl(fn)&&(fn=null),Ur.forEach(Ms),Br.forEach(Ms)}function Wr(e,t){e.blockedOn===t&&(e.blockedOn=null,Ia||(Ia=!0,u.unstable_scheduleCallback(u.unstable_NormalPriority,Ec)))}function Hr(e){function t(l){return Wr(l,e)}if(0<Nl.length){Wr(Nl[0],e);for(var n=1;n<Nl.length;n++){var r=Nl[n];r.blockedOn===e&&(r.blockedOn=null)}}for(dn!==null&&Wr(dn,e),pn!==null&&Wr(pn,e),fn!==null&&Wr(fn,e),Ur.forEach(t),Br.forEach(t),n=0;n<gn.length;n++)r=gn[n],r.blockedOn===e&&(r.blockedOn=null);for(;0<gn.length&&(n=gn[0],n.blockedOn===null);)Ps(n),n.blockedOn===null&&gn.shift()}var dr=we.ReactCurrentBatchConfig,Tl=!0;function Cc(e,t,n,r){var l=me,a=dr.transition;dr.transition=null;try{me=1,Aa(e,t,n,r)}finally{me=l,dr.transition=a}}function Nc(e,t,n,r){var l=me,a=dr.transition;dr.transition=null;try{me=4,Aa(e,t,n,r)}finally{me=l,dr.transition=a}}function Aa(e,t,n,r){if(Tl){var l=Fa(e,t,n,r);if(l===null)ro(e,t,r,zl,n),zs(e,r);else if(Sc(l,e,t,n,r))r.stopPropagation();else if(zs(e,r),t&4&&-1<bc.indexOf(e)){for(;l!==null;){var a=rl(l);if(a!==null&&Cs(a),a=Fa(e,t,n,r),a===null&&ro(e,t,r,zl,n),a===l)break;l=a}l!==null&&r.stopPropagation()}else ro(e,t,r,null,n)}}var zl=null;function Fa(e,t,n,r){if(zl=null,e=or(r),e=Fn(e),e!==null)if(t=Lt(e),t===null)e=null;else if(n=t.tag,n===13){if(e=vt(t),e!==null)return e;e=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null);return zl=e,null}function Ls(e){switch(e){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(bl()){case cr:return 1;case f:return 4;case S:case $:return 16;case G:return 536870912;default:return 16}default:return 16}}var mn=null,Ua=null,Pl=null;function Rs(){if(Pl)return Pl;var e,t=Ua,n=t.length,r,l="value"in mn?mn.value:mn.textContent,a=l.length;for(e=0;e<n&&t[e]===l[e];e++);var s=n-e;for(r=1;r<=s&&t[n-r]===l[a-r];r++);return Pl=l.slice(e,1<r?1-r:void 0)}function Ml(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function Ll(){return!0}function Ds(){return!1}function ct(e){function t(n,r,l,a,s){this._reactName=n,this._targetInst=l,this.type=r,this.nativeEvent=a,this.target=s,this.currentTarget=null;for(var c in e)e.hasOwnProperty(c)&&(n=e[c],this[c]=n?n(a):a[c]);return this.isDefaultPrevented=(a.defaultPrevented!=null?a.defaultPrevented:a.returnValue===!1)?Ll:Ds,this.isPropagationStopped=Ds,this}return A(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=Ll)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=Ll)},persist:function(){},isPersistent:Ll}),t}var pr={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Ba=ct(pr),Kr=A({},pr,{view:0,detail:0}),jc=ct(Kr),Va,Wa,Qr,Rl=A({},Kr,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Ka,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==Qr&&(Qr&&e.type==="mousemove"?(Va=e.screenX-Qr.screenX,Wa=e.screenY-Qr.screenY):Wa=Va=0,Qr=e),Va)},movementY:function(e){return"movementY"in e?e.movementY:Wa}}),Os=ct(Rl),Tc=A({},Rl,{dataTransfer:0}),zc=ct(Tc),Pc=A({},Kr,{relatedTarget:0}),Ha=ct(Pc),Mc=A({},pr,{animationName:0,elapsedTime:0,pseudoElement:0}),Lc=ct(Mc),Rc=A({},pr,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),Dc=ct(Rc),Oc=A({},pr,{data:0}),$s=ct(Oc),$c={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Ic={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Ac={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Fc(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=Ac[e])?!!t[e]:!1}function Ka(){return Fc}var Uc=A({},Kr,{key:function(e){if(e.key){var t=$c[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=Ml(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?Ic[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Ka,charCode:function(e){return e.type==="keypress"?Ml(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?Ml(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),Bc=ct(Uc),Vc=A({},Rl,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Is=ct(Vc),Wc=A({},Kr,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Ka}),Hc=ct(Wc),Kc=A({},pr,{propertyName:0,elapsedTime:0,pseudoElement:0}),Qc=ct(Kc),Jc=A({},Rl,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),Yc=ct(Jc),Gc=[9,13,27,32],Qa=E&&"CompositionEvent"in window,Jr=null;E&&"documentMode"in document&&(Jr=document.documentMode);var qc=E&&"TextEvent"in window&&!Jr,As=E&&(!Qa||Jr&&8<Jr&&11>=Jr),Fs=" ",Us=!1;function Bs(e,t){switch(e){case"keyup":return Gc.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Vs(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var fr=!1;function Xc(e,t){switch(e){case"compositionend":return Vs(t);case"keypress":return t.which!==32?null:(Us=!0,Fs);case"textInput":return e=t.data,e===Fs&&Us?null:e;default:return null}}function Zc(e,t){if(fr)return e==="compositionend"||!Qa&&Bs(e,t)?(e=Rs(),Pl=Ua=mn=null,fr=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return As&&t.locale!=="ko"?null:t.data;default:return null}}var ed={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Ws(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!ed[e.type]:t==="textarea"}function Hs(e,t,n,r){_l(r),t=Al(t,"onChange"),0<t.length&&(n=new Ba("onChange","change",null,n,r),e.push({event:n,listeners:t}))}var Yr=null,Gr=null;function td(e){ui(e,0)}function Dl(e){var t=vr(e);if(Xe(t))return e}function nd(e,t){if(e==="change")return t}var Ks=!1;if(E){var Ja;if(E){var Ya="oninput"in document;if(!Ya){var Qs=document.createElement("div");Qs.setAttribute("oninput","return;"),Ya=typeof Qs.oninput=="function"}Ja=Ya}else Ja=!1;Ks=Ja&&(!document.documentMode||9<document.documentMode)}function Js(){Yr&&(Yr.detachEvent("onpropertychange",Ys),Gr=Yr=null)}function Ys(e){if(e.propertyName==="value"&&Dl(Gr)){var t=[];Hs(t,Gr,e,or(e)),Dn(td,t)}}function rd(e,t,n){e==="focusin"?(Js(),Yr=t,Gr=n,Yr.attachEvent("onpropertychange",Ys)):e==="focusout"&&Js()}function ld(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return Dl(Gr)}function ad(e,t){if(e==="click")return Dl(t)}function od(e,t){if(e==="input"||e==="change")return Dl(t)}function sd(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var Rt=typeof Object.is=="function"?Object.is:sd;function qr(e,t){if(Rt(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var n=Object.keys(e),r=Object.keys(t);if(n.length!==r.length)return!1;for(r=0;r<n.length;r++){var l=n[r];if(!k.call(t,l)||!Rt(e[l],t[l]))return!1}return!0}function Gs(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function qs(e,t){var n=Gs(e);e=0;for(var r;n;){if(n.nodeType===3){if(r=e+n.textContent.length,e<=t&&r>=t)return{node:n,offset:t-e};e=r}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=Gs(n)}}function Xs(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?Xs(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function Zs(){for(var e=window,t=Xn();t instanceof e.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href=="string"}catch{n=!1}if(n)e=t.contentWindow;else break;t=Xn(e.document)}return t}function Ga(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}function id(e){var t=Zs(),n=e.focusedElem,r=e.selectionRange;if(t!==n&&n&&n.ownerDocument&&Xs(n.ownerDocument.documentElement,n)){if(r!==null&&Ga(n)){if(t=r.start,e=r.end,e===void 0&&(e=t),"selectionStart"in n)n.selectionStart=t,n.selectionEnd=Math.min(e,n.value.length);else if(e=(t=n.ownerDocument||document)&&t.defaultView||window,e.getSelection){e=e.getSelection();var l=n.textContent.length,a=Math.min(r.start,l);r=r.end===void 0?a:Math.min(r.end,l),!e.extend&&a>r&&(l=r,r=a,a=l),l=qs(n,a);var s=qs(n,r);l&&s&&(e.rangeCount!==1||e.anchorNode!==l.node||e.anchorOffset!==l.offset||e.focusNode!==s.node||e.focusOffset!==s.offset)&&(t=t.createRange(),t.setStart(l.node,l.offset),e.removeAllRanges(),a>r?(e.addRange(t),e.extend(s.node,s.offset)):(t.setEnd(s.node,s.offset),e.addRange(t)))}}for(t=[],e=n;e=e.parentNode;)e.nodeType===1&&t.push({element:e,left:e.scrollLeft,top:e.scrollTop});for(typeof n.focus=="function"&&n.focus(),n=0;n<t.length;n++)e=t[n],e.element.scrollLeft=e.left,e.element.scrollTop=e.top}}var ud=E&&"documentMode"in document&&11>=document.documentMode,gr=null,qa=null,Xr=null,Xa=!1;function ei(e,t,n){var r=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;Xa||gr==null||gr!==Xn(r)||(r=gr,"selectionStart"in r&&Ga(r)?r={start:r.selectionStart,end:r.selectionEnd}:(r=(r.ownerDocument&&r.ownerDocument.defaultView||window).getSelection(),r={anchorNode:r.anchorNode,anchorOffset:r.anchorOffset,focusNode:r.focusNode,focusOffset:r.focusOffset}),Xr&&qr(Xr,r)||(Xr=r,r=Al(qa,"onSelect"),0<r.length&&(t=new Ba("onSelect","select",null,t,n),e.push({event:t,listeners:r}),t.target=gr)))}function Ol(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n["Webkit"+e]="webkit"+t,n["Moz"+e]="moz"+t,n}var mr={animationend:Ol("Animation","AnimationEnd"),animationiteration:Ol("Animation","AnimationIteration"),animationstart:Ol("Animation","AnimationStart"),transitionend:Ol("Transition","TransitionEnd")},Za={},ti={};E&&(ti=document.createElement("div").style,"AnimationEvent"in window||(delete mr.animationend.animation,delete mr.animationiteration.animation,delete mr.animationstart.animation),"TransitionEvent"in window||delete mr.transitionend.transition);function $l(e){if(Za[e])return Za[e];if(!mr[e])return e;var t=mr[e],n;for(n in t)if(t.hasOwnProperty(n)&&n in ti)return Za[e]=t[n];return e}var ni=$l("animationend"),ri=$l("animationiteration"),li=$l("animationstart"),ai=$l("transitionend"),oi=new Map,si="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function hn(e,t){oi.set(e,t),h(t,[e])}for(var eo=0;eo<si.length;eo++){var to=si[eo],cd=to.toLowerCase(),dd=to[0].toUpperCase()+to.slice(1);hn(cd,"on"+dd)}hn(ni,"onAnimationEnd"),hn(ri,"onAnimationIteration"),hn(li,"onAnimationStart"),hn("dblclick","onDoubleClick"),hn("focusin","onFocus"),hn("focusout","onBlur"),hn(ai,"onTransitionEnd"),z("onMouseEnter",["mouseout","mouseover"]),z("onMouseLeave",["mouseout","mouseover"]),z("onPointerEnter",["pointerout","pointerover"]),z("onPointerLeave",["pointerout","pointerover"]),h("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),h("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),h("onBeforeInput",["compositionend","keypress","textInput","paste"]),h("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),h("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),h("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Zr="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),pd=new Set("cancel close invalid load scroll toggle".split(" ").concat(Zr));function ii(e,t,n){var r=e.type||"unknown-event";e.currentTarget=n,Mt(r,t,void 0,e),e.currentTarget=null}function ui(e,t){t=(t&4)!==0;for(var n=0;n<e.length;n++){var r=e[n],l=r.event;r=r.listeners;e:{var a=void 0;if(t)for(var s=r.length-1;0<=s;s--){var c=r[s],p=c.instance,w=c.currentTarget;if(c=c.listener,p!==a&&l.isPropagationStopped())break e;ii(l,c,w),a=p}else for(s=0;s<r.length;s++){if(c=r[s],p=c.instance,w=c.currentTarget,c=c.listener,p!==a&&l.isPropagationStopped())break e;ii(l,c,w),a=p}}}if(qt)throw e=sr,qt=!1,sr=null,e}function ye(e,t){var n=t[uo];n===void 0&&(n=t[uo]=new Set);var r=e+"__bubble";n.has(r)||(ci(t,e,2,!1),n.add(r))}function no(e,t,n){var r=0;t&&(r|=4),ci(n,e,r,t)}var Il="_reactListening"+Math.random().toString(36).slice(2);function el(e){if(!e[Il]){e[Il]=!0,v.forEach(function(n){n!=="selectionchange"&&(pd.has(n)||no(n,!1,e),no(n,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[Il]||(t[Il]=!0,no("selectionchange",!1,t))}}function ci(e,t,n,r){switch(Ls(t)){case 1:var l=Cc;break;case 4:l=Nc;break;default:l=Aa}n=l.bind(null,t,n,e),l=void 0,!ut||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(l=!0),r?l!==void 0?e.addEventListener(t,n,{capture:!0,passive:l}):e.addEventListener(t,n,!0):l!==void 0?e.addEventListener(t,n,{passive:l}):e.addEventListener(t,n,!1)}function ro(e,t,n,r,l){var a=r;if((t&1)===0&&(t&2)===0&&r!==null)e:for(;;){if(r===null)return;var s=r.tag;if(s===3||s===4){var c=r.stateNode.containerInfo;if(c===l||c.nodeType===8&&c.parentNode===l)break;if(s===4)for(s=r.return;s!==null;){var p=s.tag;if((p===3||p===4)&&(p=s.stateNode.containerInfo,p===l||p.nodeType===8&&p.parentNode===l))return;s=s.return}for(;c!==null;){if(s=Fn(c),s===null)return;if(p=s.tag,p===5||p===6){r=a=s;continue e}c=c.parentNode}}r=r.return}Dn(function(){var w=a,T=or(n),L=[];e:{var N=oi.get(e);if(N!==void 0){var I=Ba,B=e;switch(e){case"keypress":if(Ml(n)===0)break e;case"keydown":case"keyup":I=Bc;break;case"focusin":B="focus",I=Ha;break;case"focusout":B="blur",I=Ha;break;case"beforeblur":case"afterblur":I=Ha;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":I=Os;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":I=zc;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":I=Hc;break;case ni:case ri:case li:I=Lc;break;case ai:I=Qc;break;case"scroll":I=jc;break;case"wheel":I=Yc;break;case"copy":case"cut":case"paste":I=Dc;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":I=Is}var V=(t&4)!==0,je=!V&&e==="scroll",y=V?N!==null?N+"Capture":null:N;V=[];for(var g=w,_;g!==null;){_=g;var D=_.stateNode;if(_.tag===5&&D!==null&&(_=D,y!==null&&(D=On(g,y),D!=null&&V.push(tl(g,D,_)))),je)break;g=g.return}0<V.length&&(N=new I(N,B,null,n,T),L.push({event:N,listeners:V}))}}if((t&7)===0){e:{if(N=e==="mouseover"||e==="pointerover",I=e==="mouseout"||e==="pointerout",N&&n!==Mn&&(B=n.relatedTarget||n.fromElement)&&(Fn(B)||B[Xt]))break e;if((I||N)&&(N=T.window===T?T:(N=T.ownerDocument)?N.defaultView||N.parentWindow:window,I?(B=n.relatedTarget||n.toElement,I=w,B=B?Fn(B):null,B!==null&&(je=Lt(B),B!==je||B.tag!==5&&B.tag!==6)&&(B=null)):(I=null,B=w),I!==B)){if(V=Os,D="onMouseLeave",y="onMouseEnter",g="mouse",(e==="pointerout"||e==="pointerover")&&(V=Is,D="onPointerLeave",y="onPointerEnter",g="pointer"),je=I==null?N:vr(I),_=B==null?N:vr(B),N=new V(D,g+"leave",I,n,T),N.target=je,N.relatedTarget=_,D=null,Fn(T)===w&&(V=new V(y,g+"enter",B,n,T),V.target=_,V.relatedTarget=je,D=V),je=D,I&&B)t:{for(V=I,y=B,g=0,_=V;_;_=hr(_))g++;for(_=0,D=y;D;D=hr(D))_++;for(;0<g-_;)V=hr(V),g--;for(;0<_-g;)y=hr(y),_--;for(;g--;){if(V===y||y!==null&&V===y.alternate)break t;V=hr(V),y=hr(y)}V=null}else V=null;I!==null&&di(L,N,I,V,!1),B!==null&&je!==null&&di(L,je,B,V,!0)}}e:{if(N=w?vr(w):window,I=N.nodeName&&N.nodeName.toLowerCase(),I==="select"||I==="input"&&N.type==="file")var W=nd;else if(Ws(N))if(Ks)W=od;else{W=ld;var H=rd}else(I=N.nodeName)&&I.toLowerCase()==="input"&&(N.type==="checkbox"||N.type==="radio")&&(W=ad);if(W&&(W=W(e,w))){Hs(L,W,n,T);break e}H&&H(e,N,w),e==="focusout"&&(H=N._wrapperState)&&H.controlled&&N.type==="number"&&Lr(N,"number",N.value)}switch(H=w?vr(w):window,e){case"focusin":(Ws(H)||H.contentEditable==="true")&&(gr=H,qa=w,Xr=null);break;case"focusout":Xr=qa=gr=null;break;case"mousedown":Xa=!0;break;case"contextmenu":case"mouseup":case"dragend":Xa=!1,ei(L,n,T);break;case"selectionchange":if(ud)break;case"keydown":case"keyup":ei(L,n,T)}var K;if(Qa)e:{switch(e){case"compositionstart":var q="onCompositionStart";break e;case"compositionend":q="onCompositionEnd";break e;case"compositionupdate":q="onCompositionUpdate";break e}q=void 0}else fr?Bs(e,n)&&(q="onCompositionEnd"):e==="keydown"&&n.keyCode===229&&(q="onCompositionStart");q&&(As&&n.locale!=="ko"&&(fr||q!=="onCompositionStart"?q==="onCompositionEnd"&&fr&&(K=Rs()):(mn=T,Ua="value"in mn?mn.value:mn.textContent,fr=!0)),H=Al(w,q),0<H.length&&(q=new $s(q,e,null,n,T),L.push({event:q,listeners:H}),K?q.data=K:(K=Vs(n),K!==null&&(q.data=K)))),(K=qc?Xc(e,n):Zc(e,n))&&(w=Al(w,"onBeforeInput"),0<w.length&&(T=new $s("onBeforeInput","beforeinput",null,n,T),L.push({event:T,listeners:w}),T.data=K))}ui(L,t)})}function tl(e,t,n){return{instance:e,listener:t,currentTarget:n}}function Al(e,t){for(var n=t+"Capture",r=[];e!==null;){var l=e,a=l.stateNode;l.tag===5&&a!==null&&(l=a,a=On(e,n),a!=null&&r.unshift(tl(e,a,l)),a=On(e,t),a!=null&&r.push(tl(e,a,l))),e=e.return}return r}function hr(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5);return e||null}function di(e,t,n,r,l){for(var a=t._reactName,s=[];n!==null&&n!==r;){var c=n,p=c.alternate,w=c.stateNode;if(p!==null&&p===r)break;c.tag===5&&w!==null&&(c=w,l?(p=On(n,a),p!=null&&s.unshift(tl(n,p,c))):l||(p=On(n,a),p!=null&&s.push(tl(n,p,c)))),n=n.return}s.length!==0&&e.push({event:t,listeners:s})}var fd=/\r\n?/g,gd=/\u0000|\uFFFD/g;function pi(e){return(typeof e=="string"?e:""+e).replace(fd,`
`).replace(gd,"")}function Fl(e,t,n){if(t=pi(t),pi(e)!==t&&n)throw Error(i(425))}function Ul(){}var lo=null,ao=null;function oo(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var so=typeof setTimeout=="function"?setTimeout:void 0,md=typeof clearTimeout=="function"?clearTimeout:void 0,fi=typeof Promise=="function"?Promise:void 0,hd=typeof queueMicrotask=="function"?queueMicrotask:typeof fi<"u"?function(e){return fi.resolve(null).then(e).catch(xd)}:so;function xd(e){setTimeout(function(){throw e})}function io(e,t){var n=t,r=0;do{var l=n.nextSibling;if(e.removeChild(n),l&&l.nodeType===8)if(n=l.data,n==="/$"){if(r===0){e.removeChild(l),Hr(t);return}r--}else n!=="$"&&n!=="$?"&&n!=="$!"||r++;n=l}while(n);Hr(t)}function xn(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?")break;if(t==="/$")return null}}return e}function gi(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="$"||n==="$!"||n==="$?"){if(t===0)return e;t--}else n==="/$"&&t++}e=e.previousSibling}return null}var xr=Math.random().toString(36).slice(2),Vt="__reactFiber$"+xr,nl="__reactProps$"+xr,Xt="__reactContainer$"+xr,uo="__reactEvents$"+xr,vd="__reactListeners$"+xr,yd="__reactHandles$"+xr;function Fn(e){var t=e[Vt];if(t)return t;for(var n=e.parentNode;n;){if(t=n[Xt]||n[Vt]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(e=gi(e);e!==null;){if(n=e[Vt])return n;e=gi(e)}return t}e=n,n=e.parentNode}return null}function rl(e){return e=e[Vt]||e[Xt],!e||e.tag!==5&&e.tag!==6&&e.tag!==13&&e.tag!==3?null:e}function vr(e){if(e.tag===5||e.tag===6)return e.stateNode;throw Error(i(33))}function Bl(e){return e[nl]||null}var co=[],yr=-1;function vn(e){return{current:e}}function _e(e){0>yr||(e.current=co[yr],co[yr]=null,yr--)}function xe(e,t){yr++,co[yr]=e.current,e.current=t}var yn={},He=vn(yn),et=vn(!1),Un=yn;function _r(e,t){var n=e.type.contextTypes;if(!n)return yn;var r=e.stateNode;if(r&&r.__reactInternalMemoizedUnmaskedChildContext===t)return r.__reactInternalMemoizedMaskedChildContext;var l={},a;for(a in n)l[a]=t[a];return r&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=t,e.__reactInternalMemoizedMaskedChildContext=l),l}function tt(e){return e=e.childContextTypes,e!=null}function Vl(){_e(et),_e(He)}function mi(e,t,n){if(He.current!==yn)throw Error(i(168));xe(He,t),xe(et,n)}function hi(e,t,n){var r=e.stateNode;if(t=t.childContextTypes,typeof r.getChildContext!="function")return n;r=r.getChildContext();for(var l in r)if(!(l in t))throw Error(i(108,he(e)||"Unknown",l));return A({},n,r)}function Wl(e){return e=(e=e.stateNode)&&e.__reactInternalMemoizedMergedChildContext||yn,Un=He.current,xe(He,e),xe(et,et.current),!0}function xi(e,t,n){var r=e.stateNode;if(!r)throw Error(i(169));n?(e=hi(e,t,Un),r.__reactInternalMemoizedMergedChildContext=e,_e(et),_e(He),xe(He,e)):_e(et),xe(et,n)}var Zt=null,Hl=!1,po=!1;function vi(e){Zt===null?Zt=[e]:Zt.push(e)}function _d(e){Hl=!0,vi(e)}function _n(){if(!po&&Zt!==null){po=!0;var e=0,t=me;try{var n=Zt;for(me=1;e<n.length;e++){var r=n[e];do r=r(!0);while(r!==null)}Zt=null,Hl=!1}catch(l){throw Zt!==null&&(Zt=Zt.slice(e+1)),In(cr,_n),l}finally{me=t,po=!1}}return null}var wr=[],kr=0,Kl=null,Ql=0,yt=[],_t=0,Bn=null,en=1,tn="";function Vn(e,t){wr[kr++]=Ql,wr[kr++]=Kl,Kl=e,Ql=t}function yi(e,t,n){yt[_t++]=en,yt[_t++]=tn,yt[_t++]=Bn,Bn=e;var r=en;e=tn;var l=32-J(r)-1;r&=~(1<<l),n+=1;var a=32-J(t)+l;if(30<a){var s=l-l%5;a=(r&(1<<s)-1).toString(32),r>>=s,l-=s,en=1<<32-J(t)+l|n<<l|r,tn=a+e}else en=1<<a|n<<l|r,tn=e}function fo(e){e.return!==null&&(Vn(e,1),yi(e,1,0))}function go(e){for(;e===Kl;)Kl=wr[--kr],wr[kr]=null,Ql=wr[--kr],wr[kr]=null;for(;e===Bn;)Bn=yt[--_t],yt[_t]=null,tn=yt[--_t],yt[_t]=null,en=yt[--_t],yt[_t]=null}var dt=null,pt=null,be=!1,Dt=null;function _i(e,t){var n=St(5,null,null,0);n.elementType="DELETED",n.stateNode=t,n.return=e,t=e.deletions,t===null?(e.deletions=[n],e.flags|=16):t.push(n)}function wi(e,t){switch(e.tag){case 5:var n=e.type;return t=t.nodeType!==1||n.toLowerCase()!==t.nodeName.toLowerCase()?null:t,t!==null?(e.stateNode=t,dt=e,pt=xn(t.firstChild),!0):!1;case 6:return t=e.pendingProps===""||t.nodeType!==3?null:t,t!==null?(e.stateNode=t,dt=e,pt=null,!0):!1;case 13:return t=t.nodeType!==8?null:t,t!==null?(n=Bn!==null?{id:en,overflow:tn}:null,e.memoizedState={dehydrated:t,treeContext:n,retryLane:1073741824},n=St(18,null,null,0),n.stateNode=t,n.return=e,e.child=n,dt=e,pt=null,!0):!1;default:return!1}}function mo(e){return(e.mode&1)!==0&&(e.flags&128)===0}function ho(e){if(be){var t=pt;if(t){var n=t;if(!wi(e,t)){if(mo(e))throw Error(i(418));t=xn(n.nextSibling);var r=dt;t&&wi(e,t)?_i(r,n):(e.flags=e.flags&-4097|2,be=!1,dt=e)}}else{if(mo(e))throw Error(i(418));e.flags=e.flags&-4097|2,be=!1,dt=e}}}function ki(e){for(e=e.return;e!==null&&e.tag!==5&&e.tag!==3&&e.tag!==13;)e=e.return;dt=e}function Jl(e){if(e!==dt)return!1;if(!be)return ki(e),be=!0,!1;var t;if((t=e.tag!==3)&&!(t=e.tag!==5)&&(t=e.type,t=t!=="head"&&t!=="body"&&!oo(e.type,e.memoizedProps)),t&&(t=pt)){if(mo(e))throw bi(),Error(i(418));for(;t;)_i(e,t),t=xn(t.nextSibling)}if(ki(e),e.tag===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(i(317));e:{for(e=e.nextSibling,t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="/$"){if(t===0){pt=xn(e.nextSibling);break e}t--}else n!=="$"&&n!=="$!"&&n!=="$?"||t++}e=e.nextSibling}pt=null}}else pt=dt?xn(e.stateNode.nextSibling):null;return!0}function bi(){for(var e=pt;e;)e=xn(e.nextSibling)}function br(){pt=dt=null,be=!1}function xo(e){Dt===null?Dt=[e]:Dt.push(e)}var wd=we.ReactCurrentBatchConfig;function ll(e,t,n){if(e=n.ref,e!==null&&typeof e!="function"&&typeof e!="object"){if(n._owner){if(n=n._owner,n){if(n.tag!==1)throw Error(i(309));var r=n.stateNode}if(!r)throw Error(i(147,e));var l=r,a=""+e;return t!==null&&t.ref!==null&&typeof t.ref=="function"&&t.ref._stringRef===a?t.ref:(t=function(s){var c=l.refs;s===null?delete c[a]:c[a]=s},t._stringRef=a,t)}if(typeof e!="string")throw Error(i(284));if(!n._owner)throw Error(i(290,e))}return e}function Yl(e,t){throw e=Object.prototype.toString.call(t),Error(i(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e))}function Si(e){var t=e._init;return t(e._payload)}function Ei(e){function t(y,g){if(e){var _=y.deletions;_===null?(y.deletions=[g],y.flags|=16):_.push(g)}}function n(y,g){if(!e)return null;for(;g!==null;)t(y,g),g=g.sibling;return null}function r(y,g){for(y=new Map;g!==null;)g.key!==null?y.set(g.key,g):y.set(g.index,g),g=g.sibling;return y}function l(y,g){return y=jn(y,g),y.index=0,y.sibling=null,y}function a(y,g,_){return y.index=_,e?(_=y.alternate,_!==null?(_=_.index,_<g?(y.flags|=2,g):_):(y.flags|=2,g)):(y.flags|=1048576,g)}function s(y){return e&&y.alternate===null&&(y.flags|=2),y}function c(y,g,_,D){return g===null||g.tag!==6?(g=is(_,y.mode,D),g.return=y,g):(g=l(g,_),g.return=y,g)}function p(y,g,_,D){var W=_.type;return W===ze?T(y,g,_.props.children,D,_.key):g!==null&&(g.elementType===W||typeof W=="object"&&W!==null&&W.$$typeof===Fe&&Si(W)===g.type)?(D=l(g,_.props),D.ref=ll(y,g,_),D.return=y,D):(D=ya(_.type,_.key,_.props,null,y.mode,D),D.ref=ll(y,g,_),D.return=y,D)}function w(y,g,_,D){return g===null||g.tag!==4||g.stateNode.containerInfo!==_.containerInfo||g.stateNode.implementation!==_.implementation?(g=us(_,y.mode,D),g.return=y,g):(g=l(g,_.children||[]),g.return=y,g)}function T(y,g,_,D,W){return g===null||g.tag!==7?(g=qn(_,y.mode,D,W),g.return=y,g):(g=l(g,_),g.return=y,g)}function L(y,g,_){if(typeof g=="string"&&g!==""||typeof g=="number")return g=is(""+g,y.mode,_),g.return=y,g;if(typeof g=="object"&&g!==null){switch(g.$$typeof){case Y:return _=ya(g.type,g.key,g.props,null,y.mode,_),_.ref=ll(y,null,g),_.return=y,_;case pe:return g=us(g,y.mode,_),g.return=y,g;case Fe:var D=g._init;return L(y,D(g._payload),_)}if(on(g)||Q(g))return g=qn(g,y.mode,_,null),g.return=y,g;Yl(y,g)}return null}function N(y,g,_,D){var W=g!==null?g.key:null;if(typeof _=="string"&&_!==""||typeof _=="number")return W!==null?null:c(y,g,""+_,D);if(typeof _=="object"&&_!==null){switch(_.$$typeof){case Y:return _.key===W?p(y,g,_,D):null;case pe:return _.key===W?w(y,g,_,D):null;case Fe:return W=_._init,N(y,g,W(_._payload),D)}if(on(_)||Q(_))return W!==null?null:T(y,g,_,D,null);Yl(y,_)}return null}function I(y,g,_,D,W){if(typeof D=="string"&&D!==""||typeof D=="number")return y=y.get(_)||null,c(g,y,""+D,W);if(typeof D=="object"&&D!==null){switch(D.$$typeof){case Y:return y=y.get(D.key===null?_:D.key)||null,p(g,y,D,W);case pe:return y=y.get(D.key===null?_:D.key)||null,w(g,y,D,W);case Fe:var H=D._init;return I(y,g,_,H(D._payload),W)}if(on(D)||Q(D))return y=y.get(_)||null,T(g,y,D,W,null);Yl(g,D)}return null}function B(y,g,_,D){for(var W=null,H=null,K=g,q=g=0,Ae=null;K!==null&&q<_.length;q++){K.index>q?(Ae=K,K=null):Ae=K.sibling;var de=N(y,K,_[q],D);if(de===null){K===null&&(K=Ae);break}e&&K&&de.alternate===null&&t(y,K),g=a(de,g,q),H===null?W=de:H.sibling=de,H=de,K=Ae}if(q===_.length)return n(y,K),be&&Vn(y,q),W;if(K===null){for(;q<_.length;q++)K=L(y,_[q],D),K!==null&&(g=a(K,g,q),H===null?W=K:H.sibling=K,H=K);return be&&Vn(y,q),W}for(K=r(y,K);q<_.length;q++)Ae=I(K,y,q,_[q],D),Ae!==null&&(e&&Ae.alternate!==null&&K.delete(Ae.key===null?q:Ae.key),g=a(Ae,g,q),H===null?W=Ae:H.sibling=Ae,H=Ae);return e&&K.forEach(function(Tn){return t(y,Tn)}),be&&Vn(y,q),W}function V(y,g,_,D){var W=Q(_);if(typeof W!="function")throw Error(i(150));if(_=W.call(_),_==null)throw Error(i(151));for(var H=W=null,K=g,q=g=0,Ae=null,de=_.next();K!==null&&!de.done;q++,de=_.next()){K.index>q?(Ae=K,K=null):Ae=K.sibling;var Tn=N(y,K,de.value,D);if(Tn===null){K===null&&(K=Ae);break}e&&K&&Tn.alternate===null&&t(y,K),g=a(Tn,g,q),H===null?W=Tn:H.sibling=Tn,H=Tn,K=Ae}if(de.done)return n(y,K),be&&Vn(y,q),W;if(K===null){for(;!de.done;q++,de=_.next())de=L(y,de.value,D),de!==null&&(g=a(de,g,q),H===null?W=de:H.sibling=de,H=de);return be&&Vn(y,q),W}for(K=r(y,K);!de.done;q++,de=_.next())de=I(K,y,q,de.value,D),de!==null&&(e&&de.alternate!==null&&K.delete(de.key===null?q:de.key),g=a(de,g,q),H===null?W=de:H.sibling=de,H=de);return e&&K.forEach(function(ep){return t(y,ep)}),be&&Vn(y,q),W}function je(y,g,_,D){if(typeof _=="object"&&_!==null&&_.type===ze&&_.key===null&&(_=_.props.children),typeof _=="object"&&_!==null){switch(_.$$typeof){case Y:e:{for(var W=_.key,H=g;H!==null;){if(H.key===W){if(W=_.type,W===ze){if(H.tag===7){n(y,H.sibling),g=l(H,_.props.children),g.return=y,y=g;break e}}else if(H.elementType===W||typeof W=="object"&&W!==null&&W.$$typeof===Fe&&Si(W)===H.type){n(y,H.sibling),g=l(H,_.props),g.ref=ll(y,H,_),g.return=y,y=g;break e}n(y,H);break}else t(y,H);H=H.sibling}_.type===ze?(g=qn(_.props.children,y.mode,D,_.key),g.return=y,y=g):(D=ya(_.type,_.key,_.props,null,y.mode,D),D.ref=ll(y,g,_),D.return=y,y=D)}return s(y);case pe:e:{for(H=_.key;g!==null;){if(g.key===H)if(g.tag===4&&g.stateNode.containerInfo===_.containerInfo&&g.stateNode.implementation===_.implementation){n(y,g.sibling),g=l(g,_.children||[]),g.return=y,y=g;break e}else{n(y,g);break}else t(y,g);g=g.sibling}g=us(_,y.mode,D),g.return=y,y=g}return s(y);case Fe:return H=_._init,je(y,g,H(_._payload),D)}if(on(_))return B(y,g,_,D);if(Q(_))return V(y,g,_,D);Yl(y,_)}return typeof _=="string"&&_!==""||typeof _=="number"?(_=""+_,g!==null&&g.tag===6?(n(y,g.sibling),g=l(g,_),g.return=y,y=g):(n(y,g),g=is(_,y.mode,D),g.return=y,y=g),s(y)):n(y,g)}return je}var Sr=Ei(!0),Ci=Ei(!1),Gl=vn(null),ql=null,Er=null,vo=null;function yo(){vo=Er=ql=null}function _o(e){var t=Gl.current;_e(Gl),e._currentValue=t}function wo(e,t,n){for(;e!==null;){var r=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,r!==null&&(r.childLanes|=t)):r!==null&&(r.childLanes&t)!==t&&(r.childLanes|=t),e===n)break;e=e.return}}function Cr(e,t){ql=e,vo=Er=null,e=e.dependencies,e!==null&&e.firstContext!==null&&((e.lanes&t)!==0&&(nt=!0),e.firstContext=null)}function wt(e){var t=e._currentValue;if(vo!==e)if(e={context:e,memoizedValue:t,next:null},Er===null){if(ql===null)throw Error(i(308));Er=e,ql.dependencies={lanes:0,firstContext:e}}else Er=Er.next=e;return t}var Wn=null;function ko(e){Wn===null?Wn=[e]:Wn.push(e)}function Ni(e,t,n,r){var l=t.interleaved;return l===null?(n.next=n,ko(t)):(n.next=l.next,l.next=n),t.interleaved=n,nn(e,r)}function nn(e,t){e.lanes|=t;var n=e.alternate;for(n!==null&&(n.lanes|=t),n=e,e=e.return;e!==null;)e.childLanes|=t,n=e.alternate,n!==null&&(n.childLanes|=t),n=e,e=e.return;return n.tag===3?n.stateNode:null}var wn=!1;function bo(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function ji(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,effects:e.effects})}function rn(e,t){return{eventTime:e,lane:t,tag:0,payload:null,callback:null,next:null}}function kn(e,t,n){var r=e.updateQueue;if(r===null)return null;if(r=r.shared,(ce&2)!==0){var l=r.pending;return l===null?t.next=t:(t.next=l.next,l.next=t),r.pending=t,nn(e,n)}return l=r.interleaved,l===null?(t.next=t,ko(r)):(t.next=l.next,l.next=t),r.interleaved=t,nn(e,n)}function Xl(e,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,(n&4194240)!==0)){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,Oa(e,n)}}function Ti(e,t){var n=e.updateQueue,r=e.alternate;if(r!==null&&(r=r.updateQueue,n===r)){var l=null,a=null;if(n=n.firstBaseUpdate,n!==null){do{var s={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};a===null?l=a=s:a=a.next=s,n=n.next}while(n!==null);a===null?l=a=t:a=a.next=t}else l=a=t;n={baseState:r.baseState,firstBaseUpdate:l,lastBaseUpdate:a,shared:r.shared,effects:r.effects},e.updateQueue=n;return}e=n.lastBaseUpdate,e===null?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}function Zl(e,t,n,r){var l=e.updateQueue;wn=!1;var a=l.firstBaseUpdate,s=l.lastBaseUpdate,c=l.shared.pending;if(c!==null){l.shared.pending=null;var p=c,w=p.next;p.next=null,s===null?a=w:s.next=w,s=p;var T=e.alternate;T!==null&&(T=T.updateQueue,c=T.lastBaseUpdate,c!==s&&(c===null?T.firstBaseUpdate=w:c.next=w,T.lastBaseUpdate=p))}if(a!==null){var L=l.baseState;s=0,T=w=p=null,c=a;do{var N=c.lane,I=c.eventTime;if((r&N)===N){T!==null&&(T=T.next={eventTime:I,lane:0,tag:c.tag,payload:c.payload,callback:c.callback,next:null});e:{var B=e,V=c;switch(N=t,I=n,V.tag){case 1:if(B=V.payload,typeof B=="function"){L=B.call(I,L,N);break e}L=B;break e;case 3:B.flags=B.flags&-65537|128;case 0:if(B=V.payload,N=typeof B=="function"?B.call(I,L,N):B,N==null)break e;L=A({},L,N);break e;case 2:wn=!0}}c.callback!==null&&c.lane!==0&&(e.flags|=64,N=l.effects,N===null?l.effects=[c]:N.push(c))}else I={eventTime:I,lane:N,tag:c.tag,payload:c.payload,callback:c.callback,next:null},T===null?(w=T=I,p=L):T=T.next=I,s|=N;if(c=c.next,c===null){if(c=l.shared.pending,c===null)break;N=c,c=N.next,N.next=null,l.lastBaseUpdate=N,l.shared.pending=null}}while(!0);if(T===null&&(p=L),l.baseState=p,l.firstBaseUpdate=w,l.lastBaseUpdate=T,t=l.shared.interleaved,t!==null){l=t;do s|=l.lane,l=l.next;while(l!==t)}else a===null&&(l.shared.lanes=0);Qn|=s,e.lanes=s,e.memoizedState=L}}function zi(e,t,n){if(e=t.effects,t.effects=null,e!==null)for(t=0;t<e.length;t++){var r=e[t],l=r.callback;if(l!==null){if(r.callback=null,r=n,typeof l!="function")throw Error(i(191,l));l.call(r)}}}var al={},Wt=vn(al),ol=vn(al),sl=vn(al);function Hn(e){if(e===al)throw Error(i(174));return e}function So(e,t){switch(xe(sl,t),xe(ol,e),xe(Wt,al),e=t.nodeType,e){case 9:case 11:t=(t=t.documentElement)?t.namespaceURI:nr(null,"");break;default:e=e===8?t.parentNode:t,t=e.namespaceURI||null,e=e.tagName,t=nr(t,e)}_e(Wt),xe(Wt,t)}function Nr(){_e(Wt),_e(ol),_e(sl)}function Pi(e){Hn(sl.current);var t=Hn(Wt.current),n=nr(t,e.type);t!==n&&(xe(ol,e),xe(Wt,n))}function Eo(e){ol.current===e&&(_e(Wt),_e(ol))}var Se=vn(0);function ea(e){for(var t=e;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||n.data==="$?"||n.data==="$!"))return t}else if(t.tag===19&&t.memoizedProps.revealOrder!==void 0){if((t.flags&128)!==0)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var Co=[];function No(){for(var e=0;e<Co.length;e++)Co[e]._workInProgressVersionPrimary=null;Co.length=0}var ta=we.ReactCurrentDispatcher,jo=we.ReactCurrentBatchConfig,Kn=0,Ee=null,Le=null,$e=null,na=!1,il=!1,ul=0,kd=0;function Ke(){throw Error(i(321))}function To(e,t){if(t===null)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!Rt(e[n],t[n]))return!1;return!0}function zo(e,t,n,r,l,a){if(Kn=a,Ee=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,ta.current=e===null||e.memoizedState===null?Cd:Nd,e=n(r,l),il){a=0;do{if(il=!1,ul=0,25<=a)throw Error(i(301));a+=1,$e=Le=null,t.updateQueue=null,ta.current=jd,e=n(r,l)}while(il)}if(ta.current=aa,t=Le!==null&&Le.next!==null,Kn=0,$e=Le=Ee=null,na=!1,t)throw Error(i(300));return e}function Po(){var e=ul!==0;return ul=0,e}function Ht(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return $e===null?Ee.memoizedState=$e=e:$e=$e.next=e,$e}function kt(){if(Le===null){var e=Ee.alternate;e=e!==null?e.memoizedState:null}else e=Le.next;var t=$e===null?Ee.memoizedState:$e.next;if(t!==null)$e=t,Le=e;else{if(e===null)throw Error(i(310));Le=e,e={memoizedState:Le.memoizedState,baseState:Le.baseState,baseQueue:Le.baseQueue,queue:Le.queue,next:null},$e===null?Ee.memoizedState=$e=e:$e=$e.next=e}return $e}function cl(e,t){return typeof t=="function"?t(e):t}function Mo(e){var t=kt(),n=t.queue;if(n===null)throw Error(i(311));n.lastRenderedReducer=e;var r=Le,l=r.baseQueue,a=n.pending;if(a!==null){if(l!==null){var s=l.next;l.next=a.next,a.next=s}r.baseQueue=l=a,n.pending=null}if(l!==null){a=l.next,r=r.baseState;var c=s=null,p=null,w=a;do{var T=w.lane;if((Kn&T)===T)p!==null&&(p=p.next={lane:0,action:w.action,hasEagerState:w.hasEagerState,eagerState:w.eagerState,next:null}),r=w.hasEagerState?w.eagerState:e(r,w.action);else{var L={lane:T,action:w.action,hasEagerState:w.hasEagerState,eagerState:w.eagerState,next:null};p===null?(c=p=L,s=r):p=p.next=L,Ee.lanes|=T,Qn|=T}w=w.next}while(w!==null&&w!==a);p===null?s=r:p.next=c,Rt(r,t.memoizedState)||(nt=!0),t.memoizedState=r,t.baseState=s,t.baseQueue=p,n.lastRenderedState=r}if(e=n.interleaved,e!==null){l=e;do a=l.lane,Ee.lanes|=a,Qn|=a,l=l.next;while(l!==e)}else l===null&&(n.lanes=0);return[t.memoizedState,n.dispatch]}function Lo(e){var t=kt(),n=t.queue;if(n===null)throw Error(i(311));n.lastRenderedReducer=e;var r=n.dispatch,l=n.pending,a=t.memoizedState;if(l!==null){n.pending=null;var s=l=l.next;do a=e(a,s.action),s=s.next;while(s!==l);Rt(a,t.memoizedState)||(nt=!0),t.memoizedState=a,t.baseQueue===null&&(t.baseState=a),n.lastRenderedState=a}return[a,r]}function Mi(){}function Li(e,t){var n=Ee,r=kt(),l=t(),a=!Rt(r.memoizedState,l);if(a&&(r.memoizedState=l,nt=!0),r=r.queue,Ro(Oi.bind(null,n,r,e),[e]),r.getSnapshot!==t||a||$e!==null&&$e.memoizedState.tag&1){if(n.flags|=2048,dl(9,Di.bind(null,n,r,l,t),void 0,null),Ie===null)throw Error(i(349));(Kn&30)!==0||Ri(n,t,l)}return l}function Ri(e,t,n){e.flags|=16384,e={getSnapshot:t,value:n},t=Ee.updateQueue,t===null?(t={lastEffect:null,stores:null},Ee.updateQueue=t,t.stores=[e]):(n=t.stores,n===null?t.stores=[e]:n.push(e))}function Di(e,t,n,r){t.value=n,t.getSnapshot=r,$i(t)&&Ii(e)}function Oi(e,t,n){return n(function(){$i(t)&&Ii(e)})}function $i(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!Rt(e,n)}catch{return!0}}function Ii(e){var t=nn(e,1);t!==null&&At(t,e,1,-1)}function Ai(e){var t=Ht();return typeof e=="function"&&(e=e()),t.memoizedState=t.baseState=e,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:cl,lastRenderedState:e},t.queue=e,e=e.dispatch=Ed.bind(null,Ee,e),[t.memoizedState,e]}function dl(e,t,n,r){return e={tag:e,create:t,destroy:n,deps:r,next:null},t=Ee.updateQueue,t===null?(t={lastEffect:null,stores:null},Ee.updateQueue=t,t.lastEffect=e.next=e):(n=t.lastEffect,n===null?t.lastEffect=e.next=e:(r=n.next,n.next=e,e.next=r,t.lastEffect=e)),e}function Fi(){return kt().memoizedState}function ra(e,t,n,r){var l=Ht();Ee.flags|=e,l.memoizedState=dl(1|t,n,void 0,r===void 0?null:r)}function la(e,t,n,r){var l=kt();r=r===void 0?null:r;var a=void 0;if(Le!==null){var s=Le.memoizedState;if(a=s.destroy,r!==null&&To(r,s.deps)){l.memoizedState=dl(t,n,a,r);return}}Ee.flags|=e,l.memoizedState=dl(1|t,n,a,r)}function Ui(e,t){return ra(8390656,8,e,t)}function Ro(e,t){return la(2048,8,e,t)}function Bi(e,t){return la(4,2,e,t)}function Vi(e,t){return la(4,4,e,t)}function Wi(e,t){if(typeof t=="function")return e=e(),t(e),function(){t(null)};if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function Hi(e,t,n){return n=n!=null?n.concat([e]):null,la(4,4,Wi.bind(null,t,e),n)}function Do(){}function Ki(e,t){var n=kt();t=t===void 0?null:t;var r=n.memoizedState;return r!==null&&t!==null&&To(t,r[1])?r[0]:(n.memoizedState=[e,t],e)}function Qi(e,t){var n=kt();t=t===void 0?null:t;var r=n.memoizedState;return r!==null&&t!==null&&To(t,r[1])?r[0]:(e=e(),n.memoizedState=[e,t],e)}function Ji(e,t,n){return(Kn&21)===0?(e.baseState&&(e.baseState=!1,nt=!0),e.memoizedState=n):(Rt(n,t)||(n=Ss(),Ee.lanes|=n,Qn|=n,e.baseState=!0),t)}function bd(e,t){var n=me;me=n!==0&&4>n?n:4,e(!0);var r=jo.transition;jo.transition={};try{e(!1),t()}finally{me=n,jo.transition=r}}function Yi(){return kt().memoizedState}function Sd(e,t,n){var r=Cn(e);if(n={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null},Gi(e))qi(t,n);else if(n=Ni(e,t,n,r),n!==null){var l=qe();At(n,e,r,l),Xi(n,t,r)}}function Ed(e,t,n){var r=Cn(e),l={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null};if(Gi(e))qi(t,l);else{var a=e.alternate;if(e.lanes===0&&(a===null||a.lanes===0)&&(a=t.lastRenderedReducer,a!==null))try{var s=t.lastRenderedState,c=a(s,n);if(l.hasEagerState=!0,l.eagerState=c,Rt(c,s)){var p=t.interleaved;p===null?(l.next=l,ko(t)):(l.next=p.next,p.next=l),t.interleaved=l;return}}catch{}finally{}n=Ni(e,t,l,r),n!==null&&(l=qe(),At(n,e,r,l),Xi(n,t,r))}}function Gi(e){var t=e.alternate;return e===Ee||t!==null&&t===Ee}function qi(e,t){il=na=!0;var n=e.pending;n===null?t.next=t:(t.next=n.next,n.next=t),e.pending=t}function Xi(e,t,n){if((n&4194240)!==0){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,Oa(e,n)}}var aa={readContext:wt,useCallback:Ke,useContext:Ke,useEffect:Ke,useImperativeHandle:Ke,useInsertionEffect:Ke,useLayoutEffect:Ke,useMemo:Ke,useReducer:Ke,useRef:Ke,useState:Ke,useDebugValue:Ke,useDeferredValue:Ke,useTransition:Ke,useMutableSource:Ke,useSyncExternalStore:Ke,useId:Ke,unstable_isNewReconciler:!1},Cd={readContext:wt,useCallback:function(e,t){return Ht().memoizedState=[e,t===void 0?null:t],e},useContext:wt,useEffect:Ui,useImperativeHandle:function(e,t,n){return n=n!=null?n.concat([e]):null,ra(4194308,4,Wi.bind(null,t,e),n)},useLayoutEffect:function(e,t){return ra(4194308,4,e,t)},useInsertionEffect:function(e,t){return ra(4,2,e,t)},useMemo:function(e,t){var n=Ht();return t=t===void 0?null:t,e=e(),n.memoizedState=[e,t],e},useReducer:function(e,t,n){var r=Ht();return t=n!==void 0?n(t):t,r.memoizedState=r.baseState=t,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:t},r.queue=e,e=e.dispatch=Sd.bind(null,Ee,e),[r.memoizedState,e]},useRef:function(e){var t=Ht();return e={current:e},t.memoizedState=e},useState:Ai,useDebugValue:Do,useDeferredValue:function(e){return Ht().memoizedState=e},useTransition:function(){var e=Ai(!1),t=e[0];return e=bd.bind(null,e[1]),Ht().memoizedState=e,[t,e]},useMutableSource:function(){},useSyncExternalStore:function(e,t,n){var r=Ee,l=Ht();if(be){if(n===void 0)throw Error(i(407));n=n()}else{if(n=t(),Ie===null)throw Error(i(349));(Kn&30)!==0||Ri(r,t,n)}l.memoizedState=n;var a={value:n,getSnapshot:t};return l.queue=a,Ui(Oi.bind(null,r,a,e),[e]),r.flags|=2048,dl(9,Di.bind(null,r,a,n,t),void 0,null),n},useId:function(){var e=Ht(),t=Ie.identifierPrefix;if(be){var n=tn,r=en;n=(r&~(1<<32-J(r)-1)).toString(32)+n,t=":"+t+"R"+n,n=ul++,0<n&&(t+="H"+n.toString(32)),t+=":"}else n=kd++,t=":"+t+"r"+n.toString(32)+":";return e.memoizedState=t},unstable_isNewReconciler:!1},Nd={readContext:wt,useCallback:Ki,useContext:wt,useEffect:Ro,useImperativeHandle:Hi,useInsertionEffect:Bi,useLayoutEffect:Vi,useMemo:Qi,useReducer:Mo,useRef:Fi,useState:function(){return Mo(cl)},useDebugValue:Do,useDeferredValue:function(e){var t=kt();return Ji(t,Le.memoizedState,e)},useTransition:function(){var e=Mo(cl)[0],t=kt().memoizedState;return[e,t]},useMutableSource:Mi,useSyncExternalStore:Li,useId:Yi,unstable_isNewReconciler:!1},jd={readContext:wt,useCallback:Ki,useContext:wt,useEffect:Ro,useImperativeHandle:Hi,useInsertionEffect:Bi,useLayoutEffect:Vi,useMemo:Qi,useReducer:Lo,useRef:Fi,useState:function(){return Lo(cl)},useDebugValue:Do,useDeferredValue:function(e){var t=kt();return Le===null?t.memoizedState=e:Ji(t,Le.memoizedState,e)},useTransition:function(){var e=Lo(cl)[0],t=kt().memoizedState;return[e,t]},useMutableSource:Mi,useSyncExternalStore:Li,useId:Yi,unstable_isNewReconciler:!1};function Ot(e,t){if(e&&e.defaultProps){t=A({},t),e=e.defaultProps;for(var n in e)t[n]===void 0&&(t[n]=e[n]);return t}return t}function Oo(e,t,n,r){t=e.memoizedState,n=n(r,t),n=n==null?t:A({},t,n),e.memoizedState=n,e.lanes===0&&(e.updateQueue.baseState=n)}var oa={isMounted:function(e){return(e=e._reactInternals)?Lt(e)===e:!1},enqueueSetState:function(e,t,n){e=e._reactInternals;var r=qe(),l=Cn(e),a=rn(r,l);a.payload=t,n!=null&&(a.callback=n),t=kn(e,a,l),t!==null&&(At(t,e,l,r),Xl(t,e,l))},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var r=qe(),l=Cn(e),a=rn(r,l);a.tag=1,a.payload=t,n!=null&&(a.callback=n),t=kn(e,a,l),t!==null&&(At(t,e,l,r),Xl(t,e,l))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=qe(),r=Cn(e),l=rn(n,r);l.tag=2,t!=null&&(l.callback=t),t=kn(e,l,r),t!==null&&(At(t,e,r,n),Xl(t,e,r))}};function Zi(e,t,n,r,l,a,s){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(r,a,s):t.prototype&&t.prototype.isPureReactComponent?!qr(n,r)||!qr(l,a):!0}function eu(e,t,n){var r=!1,l=yn,a=t.contextType;return typeof a=="object"&&a!==null?a=wt(a):(l=tt(t)?Un:He.current,r=t.contextTypes,a=(r=r!=null)?_r(e,l):yn),t=new t(n,a),e.memoizedState=t.state!==null&&t.state!==void 0?t.state:null,t.updater=oa,e.stateNode=t,t._reactInternals=e,r&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=l,e.__reactInternalMemoizedMaskedChildContext=a),t}function tu(e,t,n,r){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(n,r),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(n,r),t.state!==e&&oa.enqueueReplaceState(t,t.state,null)}function $o(e,t,n,r){var l=e.stateNode;l.props=n,l.state=e.memoizedState,l.refs={},bo(e);var a=t.contextType;typeof a=="object"&&a!==null?l.context=wt(a):(a=tt(t)?Un:He.current,l.context=_r(e,a)),l.state=e.memoizedState,a=t.getDerivedStateFromProps,typeof a=="function"&&(Oo(e,t,a,n),l.state=e.memoizedState),typeof t.getDerivedStateFromProps=="function"||typeof l.getSnapshotBeforeUpdate=="function"||typeof l.UNSAFE_componentWillMount!="function"&&typeof l.componentWillMount!="function"||(t=l.state,typeof l.componentWillMount=="function"&&l.componentWillMount(),typeof l.UNSAFE_componentWillMount=="function"&&l.UNSAFE_componentWillMount(),t!==l.state&&oa.enqueueReplaceState(l,l.state,null),Zl(e,n,l,r),l.state=e.memoizedState),typeof l.componentDidMount=="function"&&(e.flags|=4194308)}function jr(e,t){try{var n="",r=t;do n+=oe(r),r=r.return;while(r);var l=n}catch(a){l=`
Error generating stack: `+a.message+`
`+a.stack}return{value:e,source:t,stack:l,digest:null}}function Io(e,t,n){return{value:e,source:null,stack:n??null,digest:t??null}}function Ao(e,t){try{console.error(t.value)}catch(n){setTimeout(function(){throw n})}}var Td=typeof WeakMap=="function"?WeakMap:Map;function nu(e,t,n){n=rn(-1,n),n.tag=3,n.payload={element:null};var r=t.value;return n.callback=function(){fa||(fa=!0,es=r),Ao(e,t)},n}function ru(e,t,n){n=rn(-1,n),n.tag=3;var r=e.type.getDerivedStateFromError;if(typeof r=="function"){var l=t.value;n.payload=function(){return r(l)},n.callback=function(){Ao(e,t)}}var a=e.stateNode;return a!==null&&typeof a.componentDidCatch=="function"&&(n.callback=function(){Ao(e,t),typeof r!="function"&&(Sn===null?Sn=new Set([this]):Sn.add(this));var s=t.stack;this.componentDidCatch(t.value,{componentStack:s!==null?s:""})}),n}function lu(e,t,n){var r=e.pingCache;if(r===null){r=e.pingCache=new Td;var l=new Set;r.set(t,l)}else l=r.get(t),l===void 0&&(l=new Set,r.set(t,l));l.has(n)||(l.add(n),e=Vd.bind(null,e,t,n),t.then(e,e))}function au(e){do{var t;if((t=e.tag===13)&&(t=e.memoizedState,t=t!==null?t.dehydrated!==null:!0),t)return e;e=e.return}while(e!==null);return null}function ou(e,t,n,r,l){return(e.mode&1)===0?(e===t?e.flags|=65536:(e.flags|=128,n.flags|=131072,n.flags&=-52805,n.tag===1&&(n.alternate===null?n.tag=17:(t=rn(-1,1),t.tag=2,kn(n,t,1))),n.lanes|=1),e):(e.flags|=65536,e.lanes=l,e)}var zd=we.ReactCurrentOwner,nt=!1;function Ge(e,t,n,r){t.child=e===null?Ci(t,null,n,r):Sr(t,e.child,n,r)}function su(e,t,n,r,l){n=n.render;var a=t.ref;return Cr(t,l),r=zo(e,t,n,r,a,l),n=Po(),e!==null&&!nt?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~l,ln(e,t,l)):(be&&n&&fo(t),t.flags|=1,Ge(e,t,r,l),t.child)}function iu(e,t,n,r,l){if(e===null){var a=n.type;return typeof a=="function"&&!ss(a)&&a.defaultProps===void 0&&n.compare===null&&n.defaultProps===void 0?(t.tag=15,t.type=a,uu(e,t,a,r,l)):(e=ya(n.type,null,r,t,t.mode,l),e.ref=t.ref,e.return=t,t.child=e)}if(a=e.child,(e.lanes&l)===0){var s=a.memoizedProps;if(n=n.compare,n=n!==null?n:qr,n(s,r)&&e.ref===t.ref)return ln(e,t,l)}return t.flags|=1,e=jn(a,r),e.ref=t.ref,e.return=t,t.child=e}function uu(e,t,n,r,l){if(e!==null){var a=e.memoizedProps;if(qr(a,r)&&e.ref===t.ref)if(nt=!1,t.pendingProps=r=a,(e.lanes&l)!==0)(e.flags&131072)!==0&&(nt=!0);else return t.lanes=e.lanes,ln(e,t,l)}return Fo(e,t,n,r,l)}function cu(e,t,n){var r=t.pendingProps,l=r.children,a=e!==null?e.memoizedState:null;if(r.mode==="hidden")if((t.mode&1)===0)t.memoizedState={baseLanes:0,cachePool:null,transitions:null},xe(zr,ft),ft|=n;else{if((n&1073741824)===0)return e=a!==null?a.baseLanes|n:n,t.lanes=t.childLanes=1073741824,t.memoizedState={baseLanes:e,cachePool:null,transitions:null},t.updateQueue=null,xe(zr,ft),ft|=e,null;t.memoizedState={baseLanes:0,cachePool:null,transitions:null},r=a!==null?a.baseLanes:n,xe(zr,ft),ft|=r}else a!==null?(r=a.baseLanes|n,t.memoizedState=null):r=n,xe(zr,ft),ft|=r;return Ge(e,t,l,n),t.child}function du(e,t){var n=t.ref;(e===null&&n!==null||e!==null&&e.ref!==n)&&(t.flags|=512,t.flags|=2097152)}function Fo(e,t,n,r,l){var a=tt(n)?Un:He.current;return a=_r(t,a),Cr(t,l),n=zo(e,t,n,r,a,l),r=Po(),e!==null&&!nt?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~l,ln(e,t,l)):(be&&r&&fo(t),t.flags|=1,Ge(e,t,n,l),t.child)}function pu(e,t,n,r,l){if(tt(n)){var a=!0;Wl(t)}else a=!1;if(Cr(t,l),t.stateNode===null)ia(e,t),eu(t,n,r),$o(t,n,r,l),r=!0;else if(e===null){var s=t.stateNode,c=t.memoizedProps;s.props=c;var p=s.context,w=n.contextType;typeof w=="object"&&w!==null?w=wt(w):(w=tt(n)?Un:He.current,w=_r(t,w));var T=n.getDerivedStateFromProps,L=typeof T=="function"||typeof s.getSnapshotBeforeUpdate=="function";L||typeof s.UNSAFE_componentWillReceiveProps!="function"&&typeof s.componentWillReceiveProps!="function"||(c!==r||p!==w)&&tu(t,s,r,w),wn=!1;var N=t.memoizedState;s.state=N,Zl(t,r,s,l),p=t.memoizedState,c!==r||N!==p||et.current||wn?(typeof T=="function"&&(Oo(t,n,T,r),p=t.memoizedState),(c=wn||Zi(t,n,c,r,N,p,w))?(L||typeof s.UNSAFE_componentWillMount!="function"&&typeof s.componentWillMount!="function"||(typeof s.componentWillMount=="function"&&s.componentWillMount(),typeof s.UNSAFE_componentWillMount=="function"&&s.UNSAFE_componentWillMount()),typeof s.componentDidMount=="function"&&(t.flags|=4194308)):(typeof s.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=r,t.memoizedState=p),s.props=r,s.state=p,s.context=w,r=c):(typeof s.componentDidMount=="function"&&(t.flags|=4194308),r=!1)}else{s=t.stateNode,ji(e,t),c=t.memoizedProps,w=t.type===t.elementType?c:Ot(t.type,c),s.props=w,L=t.pendingProps,N=s.context,p=n.contextType,typeof p=="object"&&p!==null?p=wt(p):(p=tt(n)?Un:He.current,p=_r(t,p));var I=n.getDerivedStateFromProps;(T=typeof I=="function"||typeof s.getSnapshotBeforeUpdate=="function")||typeof s.UNSAFE_componentWillReceiveProps!="function"&&typeof s.componentWillReceiveProps!="function"||(c!==L||N!==p)&&tu(t,s,r,p),wn=!1,N=t.memoizedState,s.state=N,Zl(t,r,s,l);var B=t.memoizedState;c!==L||N!==B||et.current||wn?(typeof I=="function"&&(Oo(t,n,I,r),B=t.memoizedState),(w=wn||Zi(t,n,w,r,N,B,p)||!1)?(T||typeof s.UNSAFE_componentWillUpdate!="function"&&typeof s.componentWillUpdate!="function"||(typeof s.componentWillUpdate=="function"&&s.componentWillUpdate(r,B,p),typeof s.UNSAFE_componentWillUpdate=="function"&&s.UNSAFE_componentWillUpdate(r,B,p)),typeof s.componentDidUpdate=="function"&&(t.flags|=4),typeof s.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof s.componentDidUpdate!="function"||c===e.memoizedProps&&N===e.memoizedState||(t.flags|=4),typeof s.getSnapshotBeforeUpdate!="function"||c===e.memoizedProps&&N===e.memoizedState||(t.flags|=1024),t.memoizedProps=r,t.memoizedState=B),s.props=r,s.state=B,s.context=p,r=w):(typeof s.componentDidUpdate!="function"||c===e.memoizedProps&&N===e.memoizedState||(t.flags|=4),typeof s.getSnapshotBeforeUpdate!="function"||c===e.memoizedProps&&N===e.memoizedState||(t.flags|=1024),r=!1)}return Uo(e,t,n,r,a,l)}function Uo(e,t,n,r,l,a){du(e,t);var s=(t.flags&128)!==0;if(!r&&!s)return l&&xi(t,n,!1),ln(e,t,a);r=t.stateNode,zd.current=t;var c=s&&typeof n.getDerivedStateFromError!="function"?null:r.render();return t.flags|=1,e!==null&&s?(t.child=Sr(t,e.child,null,a),t.child=Sr(t,null,c,a)):Ge(e,t,c,a),t.memoizedState=r.state,l&&xi(t,n,!0),t.child}function fu(e){var t=e.stateNode;t.pendingContext?mi(e,t.pendingContext,t.pendingContext!==t.context):t.context&&mi(e,t.context,!1),So(e,t.containerInfo)}function gu(e,t,n,r,l){return br(),xo(l),t.flags|=256,Ge(e,t,n,r),t.child}var Bo={dehydrated:null,treeContext:null,retryLane:0};function Vo(e){return{baseLanes:e,cachePool:null,transitions:null}}function mu(e,t,n){var r=t.pendingProps,l=Se.current,a=!1,s=(t.flags&128)!==0,c;if((c=s)||(c=e!==null&&e.memoizedState===null?!1:(l&2)!==0),c?(a=!0,t.flags&=-129):(e===null||e.memoizedState!==null)&&(l|=1),xe(Se,l&1),e===null)return ho(t),e=t.memoizedState,e!==null&&(e=e.dehydrated,e!==null)?((t.mode&1)===0?t.lanes=1:e.data==="$!"?t.lanes=8:t.lanes=1073741824,null):(s=r.children,e=r.fallback,a?(r=t.mode,a=t.child,s={mode:"hidden",children:s},(r&1)===0&&a!==null?(a.childLanes=0,a.pendingProps=s):a=_a(s,r,0,null),e=qn(e,r,n,null),a.return=t,e.return=t,a.sibling=e,t.child=a,t.child.memoizedState=Vo(n),t.memoizedState=Bo,e):Wo(t,s));if(l=e.memoizedState,l!==null&&(c=l.dehydrated,c!==null))return Pd(e,t,s,r,c,l,n);if(a){a=r.fallback,s=t.mode,l=e.child,c=l.sibling;var p={mode:"hidden",children:r.children};return(s&1)===0&&t.child!==l?(r=t.child,r.childLanes=0,r.pendingProps=p,t.deletions=null):(r=jn(l,p),r.subtreeFlags=l.subtreeFlags&14680064),c!==null?a=jn(c,a):(a=qn(a,s,n,null),a.flags|=2),a.return=t,r.return=t,r.sibling=a,t.child=r,r=a,a=t.child,s=e.child.memoizedState,s=s===null?Vo(n):{baseLanes:s.baseLanes|n,cachePool:null,transitions:s.transitions},a.memoizedState=s,a.childLanes=e.childLanes&~n,t.memoizedState=Bo,r}return a=e.child,e=a.sibling,r=jn(a,{mode:"visible",children:r.children}),(t.mode&1)===0&&(r.lanes=n),r.return=t,r.sibling=null,e!==null&&(n=t.deletions,n===null?(t.deletions=[e],t.flags|=16):n.push(e)),t.child=r,t.memoizedState=null,r}function Wo(e,t){return t=_a({mode:"visible",children:t},e.mode,0,null),t.return=e,e.child=t}function sa(e,t,n,r){return r!==null&&xo(r),Sr(t,e.child,null,n),e=Wo(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function Pd(e,t,n,r,l,a,s){if(n)return t.flags&256?(t.flags&=-257,r=Io(Error(i(422))),sa(e,t,s,r)):t.memoizedState!==null?(t.child=e.child,t.flags|=128,null):(a=r.fallback,l=t.mode,r=_a({mode:"visible",children:r.children},l,0,null),a=qn(a,l,s,null),a.flags|=2,r.return=t,a.return=t,r.sibling=a,t.child=r,(t.mode&1)!==0&&Sr(t,e.child,null,s),t.child.memoizedState=Vo(s),t.memoizedState=Bo,a);if((t.mode&1)===0)return sa(e,t,s,null);if(l.data==="$!"){if(r=l.nextSibling&&l.nextSibling.dataset,r)var c=r.dgst;return r=c,a=Error(i(419)),r=Io(a,r,void 0),sa(e,t,s,r)}if(c=(s&e.childLanes)!==0,nt||c){if(r=Ie,r!==null){switch(s&-s){case 4:l=2;break;case 16:l=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:l=32;break;case 536870912:l=268435456;break;default:l=0}l=(l&(r.suspendedLanes|s))!==0?0:l,l!==0&&l!==a.retryLane&&(a.retryLane=l,nn(e,l),At(r,e,l,-1))}return os(),r=Io(Error(i(421))),sa(e,t,s,r)}return l.data==="$?"?(t.flags|=128,t.child=e.child,t=Wd.bind(null,e),l._reactRetry=t,null):(e=a.treeContext,pt=xn(l.nextSibling),dt=t,be=!0,Dt=null,e!==null&&(yt[_t++]=en,yt[_t++]=tn,yt[_t++]=Bn,en=e.id,tn=e.overflow,Bn=t),t=Wo(t,r.children),t.flags|=4096,t)}function hu(e,t,n){e.lanes|=t;var r=e.alternate;r!==null&&(r.lanes|=t),wo(e.return,t,n)}function Ho(e,t,n,r,l){var a=e.memoizedState;a===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:r,tail:n,tailMode:l}:(a.isBackwards=t,a.rendering=null,a.renderingStartTime=0,a.last=r,a.tail=n,a.tailMode=l)}function xu(e,t,n){var r=t.pendingProps,l=r.revealOrder,a=r.tail;if(Ge(e,t,r.children,n),r=Se.current,(r&2)!==0)r=r&1|2,t.flags|=128;else{if(e!==null&&(e.flags&128)!==0)e:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&hu(e,n,t);else if(e.tag===19)hu(e,n,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}r&=1}if(xe(Se,r),(t.mode&1)===0)t.memoizedState=null;else switch(l){case"forwards":for(n=t.child,l=null;n!==null;)e=n.alternate,e!==null&&ea(e)===null&&(l=n),n=n.sibling;n=l,n===null?(l=t.child,t.child=null):(l=n.sibling,n.sibling=null),Ho(t,!1,l,n,a);break;case"backwards":for(n=null,l=t.child,t.child=null;l!==null;){if(e=l.alternate,e!==null&&ea(e)===null){t.child=l;break}e=l.sibling,l.sibling=n,n=l,l=e}Ho(t,!0,n,null,a);break;case"together":Ho(t,!1,null,null,void 0);break;default:t.memoizedState=null}return t.child}function ia(e,t){(t.mode&1)===0&&e!==null&&(e.alternate=null,t.alternate=null,t.flags|=2)}function ln(e,t,n){if(e!==null&&(t.dependencies=e.dependencies),Qn|=t.lanes,(n&t.childLanes)===0)return null;if(e!==null&&t.child!==e.child)throw Error(i(153));if(t.child!==null){for(e=t.child,n=jn(e,e.pendingProps),t.child=n,n.return=t;e.sibling!==null;)e=e.sibling,n=n.sibling=jn(e,e.pendingProps),n.return=t;n.sibling=null}return t.child}function Md(e,t,n){switch(t.tag){case 3:fu(t),br();break;case 5:Pi(t);break;case 1:tt(t.type)&&Wl(t);break;case 4:So(t,t.stateNode.containerInfo);break;case 10:var r=t.type._context,l=t.memoizedProps.value;xe(Gl,r._currentValue),r._currentValue=l;break;case 13:if(r=t.memoizedState,r!==null)return r.dehydrated!==null?(xe(Se,Se.current&1),t.flags|=128,null):(n&t.child.childLanes)!==0?mu(e,t,n):(xe(Se,Se.current&1),e=ln(e,t,n),e!==null?e.sibling:null);xe(Se,Se.current&1);break;case 19:if(r=(n&t.childLanes)!==0,(e.flags&128)!==0){if(r)return xu(e,t,n);t.flags|=128}if(l=t.memoizedState,l!==null&&(l.rendering=null,l.tail=null,l.lastEffect=null),xe(Se,Se.current),r)break;return null;case 22:case 23:return t.lanes=0,cu(e,t,n)}return ln(e,t,n)}var vu,Ko,yu,_u;vu=function(e,t){for(var n=t.child;n!==null;){if(n.tag===5||n.tag===6)e.appendChild(n.stateNode);else if(n.tag!==4&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===t)break;for(;n.sibling===null;){if(n.return===null||n.return===t)return;n=n.return}n.sibling.return=n.return,n=n.sibling}},Ko=function(){},yu=function(e,t,n,r){var l=e.memoizedProps;if(l!==r){e=t.stateNode,Hn(Wt.current);var a=null;switch(n){case"input":l=Nt(e,l),r=Nt(e,r),a=[];break;case"select":l=A({},l,{value:void 0}),r=A({},r,{value:void 0}),a=[];break;case"textarea":l=sn(e,l),r=sn(e,r),a=[];break;default:typeof l.onClick!="function"&&typeof r.onClick=="function"&&(e.onclick=Ul)}lr(n,r);var s;n=null;for(w in l)if(!r.hasOwnProperty(w)&&l.hasOwnProperty(w)&&l[w]!=null)if(w==="style"){var c=l[w];for(s in c)c.hasOwnProperty(s)&&(n||(n={}),n[s]="")}else w!=="dangerouslySetInnerHTML"&&w!=="children"&&w!=="suppressContentEditableWarning"&&w!=="suppressHydrationWarning"&&w!=="autoFocus"&&(m.hasOwnProperty(w)?a||(a=[]):(a=a||[]).push(w,null));for(w in r){var p=r[w];if(c=l!=null?l[w]:void 0,r.hasOwnProperty(w)&&p!==c&&(p!=null||c!=null))if(w==="style")if(c){for(s in c)!c.hasOwnProperty(s)||p&&p.hasOwnProperty(s)||(n||(n={}),n[s]="");for(s in p)p.hasOwnProperty(s)&&c[s]!==p[s]&&(n||(n={}),n[s]=p[s])}else n||(a||(a=[]),a.push(w,n)),n=p;else w==="dangerouslySetInnerHTML"?(p=p?p.__html:void 0,c=c?c.__html:void 0,p!=null&&c!==p&&(a=a||[]).push(w,p)):w==="children"?typeof p!="string"&&typeof p!="number"||(a=a||[]).push(w,""+p):w!=="suppressContentEditableWarning"&&w!=="suppressHydrationWarning"&&(m.hasOwnProperty(w)?(p!=null&&w==="onScroll"&&ye("scroll",e),a||c===p||(a=[])):(a=a||[]).push(w,p))}n&&(a=a||[]).push("style",n);var w=a;(t.updateQueue=w)&&(t.flags|=4)}},_u=function(e,t,n,r){n!==r&&(t.flags|=4)};function pl(e,t){if(!be)switch(e.tailMode){case"hidden":t=e.tail;for(var n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?e.tail=null:n.sibling=null;break;case"collapsed":n=e.tail;for(var r=null;n!==null;)n.alternate!==null&&(r=n),n=n.sibling;r===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:r.sibling=null}}function Qe(e){var t=e.alternate!==null&&e.alternate.child===e.child,n=0,r=0;if(t)for(var l=e.child;l!==null;)n|=l.lanes|l.childLanes,r|=l.subtreeFlags&14680064,r|=l.flags&14680064,l.return=e,l=l.sibling;else for(l=e.child;l!==null;)n|=l.lanes|l.childLanes,r|=l.subtreeFlags,r|=l.flags,l.return=e,l=l.sibling;return e.subtreeFlags|=r,e.childLanes=n,t}function Ld(e,t,n){var r=t.pendingProps;switch(go(t),t.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Qe(t),null;case 1:return tt(t.type)&&Vl(),Qe(t),null;case 3:return r=t.stateNode,Nr(),_e(et),_e(He),No(),r.pendingContext&&(r.context=r.pendingContext,r.pendingContext=null),(e===null||e.child===null)&&(Jl(t)?t.flags|=4:e===null||e.memoizedState.isDehydrated&&(t.flags&256)===0||(t.flags|=1024,Dt!==null&&(rs(Dt),Dt=null))),Ko(e,t),Qe(t),null;case 5:Eo(t);var l=Hn(sl.current);if(n=t.type,e!==null&&t.stateNode!=null)yu(e,t,n,r,l),e.ref!==t.ref&&(t.flags|=512,t.flags|=2097152);else{if(!r){if(t.stateNode===null)throw Error(i(166));return Qe(t),null}if(e=Hn(Wt.current),Jl(t)){r=t.stateNode,n=t.type;var a=t.memoizedProps;switch(r[Vt]=t,r[nl]=a,e=(t.mode&1)!==0,n){case"dialog":ye("cancel",r),ye("close",r);break;case"iframe":case"object":case"embed":ye("load",r);break;case"video":case"audio":for(l=0;l<Zr.length;l++)ye(Zr[l],r);break;case"source":ye("error",r);break;case"img":case"image":case"link":ye("error",r),ye("load",r);break;case"details":ye("toggle",r);break;case"input":Zn(r,a),ye("invalid",r);break;case"select":r._wrapperState={wasMultiple:!!a.multiple},ye("invalid",r);break;case"textarea":Qt(r,a),ye("invalid",r)}lr(n,a),l=null;for(var s in a)if(a.hasOwnProperty(s)){var c=a[s];s==="children"?typeof c=="string"?r.textContent!==c&&(a.suppressHydrationWarning!==!0&&Fl(r.textContent,c,e),l=["children",c]):typeof c=="number"&&r.textContent!==""+c&&(a.suppressHydrationWarning!==!0&&Fl(r.textContent,c,e),l=["children",""+c]):m.hasOwnProperty(s)&&c!=null&&s==="onScroll"&&ye("scroll",r)}switch(n){case"input":ht(r),Pn(r,a,!0);break;case"textarea":ht(r),Oe(r);break;case"select":case"option":break;default:typeof a.onClick=="function"&&(r.onclick=Ul)}r=l,t.updateQueue=r,r!==null&&(t.flags|=4)}else{s=l.nodeType===9?l:l.ownerDocument,e==="http://www.w3.org/1999/xhtml"&&(e=tr(n)),e==="http://www.w3.org/1999/xhtml"?n==="script"?(e=s.createElement("div"),e.innerHTML="<script><\/script>",e=e.removeChild(e.firstChild)):typeof r.is=="string"?e=s.createElement(n,{is:r.is}):(e=s.createElement(n),n==="select"&&(s=e,r.multiple?s.multiple=!0:r.size&&(s.size=r.size))):e=s.createElementNS(e,n),e[Vt]=t,e[nl]=r,vu(e,t,!1,!1),t.stateNode=e;e:{switch(s=ar(n,r),n){case"dialog":ye("cancel",e),ye("close",e),l=r;break;case"iframe":case"object":case"embed":ye("load",e),l=r;break;case"video":case"audio":for(l=0;l<Zr.length;l++)ye(Zr[l],e);l=r;break;case"source":ye("error",e),l=r;break;case"img":case"image":case"link":ye("error",e),ye("load",e),l=r;break;case"details":ye("toggle",e),l=r;break;case"input":Zn(e,r),l=Nt(e,r),ye("invalid",e);break;case"option":l=r;break;case"select":e._wrapperState={wasMultiple:!!r.multiple},l=A({},r,{value:void 0}),ye("invalid",e);break;case"textarea":Qt(e,r),l=sn(e,r),ye("invalid",e);break;default:l=r}lr(n,l),c=l;for(a in c)if(c.hasOwnProperty(a)){var p=c[a];a==="style"?Rr(e,p):a==="dangerouslySetInnerHTML"?(p=p?p.__html:void 0,p!=null&&un(e,p)):a==="children"?typeof p=="string"?(n!=="textarea"||p!=="")&&jt(e,p):typeof p=="number"&&jt(e,""+p):a!=="suppressContentEditableWarning"&&a!=="suppressHydrationWarning"&&a!=="autoFocus"&&(m.hasOwnProperty(a)?p!=null&&a==="onScroll"&&ye("scroll",e):p!=null&&Te(e,a,p,s))}switch(n){case"input":ht(e),Pn(e,r,!1);break;case"textarea":ht(e),Oe(e);break;case"option":r.value!=null&&e.setAttribute("value",""+ie(r.value));break;case"select":e.multiple=!!r.multiple,a=r.value,a!=null?Ue(e,!!r.multiple,a,!1):r.defaultValue!=null&&Ue(e,!!r.multiple,r.defaultValue,!0);break;default:typeof l.onClick=="function"&&(e.onclick=Ul)}switch(n){case"button":case"input":case"select":case"textarea":r=!!r.autoFocus;break e;case"img":r=!0;break e;default:r=!1}}r&&(t.flags|=4)}t.ref!==null&&(t.flags|=512,t.flags|=2097152)}return Qe(t),null;case 6:if(e&&t.stateNode!=null)_u(e,t,e.memoizedProps,r);else{if(typeof r!="string"&&t.stateNode===null)throw Error(i(166));if(n=Hn(sl.current),Hn(Wt.current),Jl(t)){if(r=t.stateNode,n=t.memoizedProps,r[Vt]=t,(a=r.nodeValue!==n)&&(e=dt,e!==null))switch(e.tag){case 3:Fl(r.nodeValue,n,(e.mode&1)!==0);break;case 5:e.memoizedProps.suppressHydrationWarning!==!0&&Fl(r.nodeValue,n,(e.mode&1)!==0)}a&&(t.flags|=4)}else r=(n.nodeType===9?n:n.ownerDocument).createTextNode(r),r[Vt]=t,t.stateNode=r}return Qe(t),null;case 13:if(_e(Se),r=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(be&&pt!==null&&(t.mode&1)!==0&&(t.flags&128)===0)bi(),br(),t.flags|=98560,a=!1;else if(a=Jl(t),r!==null&&r.dehydrated!==null){if(e===null){if(!a)throw Error(i(318));if(a=t.memoizedState,a=a!==null?a.dehydrated:null,!a)throw Error(i(317));a[Vt]=t}else br(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;Qe(t),a=!1}else Dt!==null&&(rs(Dt),Dt=null),a=!0;if(!a)return t.flags&65536?t:null}return(t.flags&128)!==0?(t.lanes=n,t):(r=r!==null,r!==(e!==null&&e.memoizedState!==null)&&r&&(t.child.flags|=8192,(t.mode&1)!==0&&(e===null||(Se.current&1)!==0?Re===0&&(Re=3):os())),t.updateQueue!==null&&(t.flags|=4),Qe(t),null);case 4:return Nr(),Ko(e,t),e===null&&el(t.stateNode.containerInfo),Qe(t),null;case 10:return _o(t.type._context),Qe(t),null;case 17:return tt(t.type)&&Vl(),Qe(t),null;case 19:if(_e(Se),a=t.memoizedState,a===null)return Qe(t),null;if(r=(t.flags&128)!==0,s=a.rendering,s===null)if(r)pl(a,!1);else{if(Re!==0||e!==null&&(e.flags&128)!==0)for(e=t.child;e!==null;){if(s=ea(e),s!==null){for(t.flags|=128,pl(a,!1),r=s.updateQueue,r!==null&&(t.updateQueue=r,t.flags|=4),t.subtreeFlags=0,r=n,n=t.child;n!==null;)a=n,e=r,a.flags&=14680066,s=a.alternate,s===null?(a.childLanes=0,a.lanes=e,a.child=null,a.subtreeFlags=0,a.memoizedProps=null,a.memoizedState=null,a.updateQueue=null,a.dependencies=null,a.stateNode=null):(a.childLanes=s.childLanes,a.lanes=s.lanes,a.child=s.child,a.subtreeFlags=0,a.deletions=null,a.memoizedProps=s.memoizedProps,a.memoizedState=s.memoizedState,a.updateQueue=s.updateQueue,a.type=s.type,e=s.dependencies,a.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext}),n=n.sibling;return xe(Se,Se.current&1|2),t.child}e=e.sibling}a.tail!==null&&ke()>Pr&&(t.flags|=128,r=!0,pl(a,!1),t.lanes=4194304)}else{if(!r)if(e=ea(s),e!==null){if(t.flags|=128,r=!0,n=e.updateQueue,n!==null&&(t.updateQueue=n,t.flags|=4),pl(a,!0),a.tail===null&&a.tailMode==="hidden"&&!s.alternate&&!be)return Qe(t),null}else 2*ke()-a.renderingStartTime>Pr&&n!==1073741824&&(t.flags|=128,r=!0,pl(a,!1),t.lanes=4194304);a.isBackwards?(s.sibling=t.child,t.child=s):(n=a.last,n!==null?n.sibling=s:t.child=s,a.last=s)}return a.tail!==null?(t=a.tail,a.rendering=t,a.tail=t.sibling,a.renderingStartTime=ke(),t.sibling=null,n=Se.current,xe(Se,r?n&1|2:n&1),t):(Qe(t),null);case 22:case 23:return as(),r=t.memoizedState!==null,e!==null&&e.memoizedState!==null!==r&&(t.flags|=8192),r&&(t.mode&1)!==0?(ft&1073741824)!==0&&(Qe(t),t.subtreeFlags&6&&(t.flags|=8192)):Qe(t),null;case 24:return null;case 25:return null}throw Error(i(156,t.tag))}function Rd(e,t){switch(go(t),t.tag){case 1:return tt(t.type)&&Vl(),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return Nr(),_e(et),_e(He),No(),e=t.flags,(e&65536)!==0&&(e&128)===0?(t.flags=e&-65537|128,t):null;case 5:return Eo(t),null;case 13:if(_e(Se),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(i(340));br()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return _e(Se),null;case 4:return Nr(),null;case 10:return _o(t.type._context),null;case 22:case 23:return as(),null;case 24:return null;default:return null}}var ua=!1,Je=!1,Dd=typeof WeakSet=="function"?WeakSet:Set,F=null;function Tr(e,t){var n=e.ref;if(n!==null)if(typeof n=="function")try{n(null)}catch(r){Ne(e,t,r)}else n.current=null}function Qo(e,t,n){try{n()}catch(r){Ne(e,t,r)}}var wu=!1;function Od(e,t){if(lo=Tl,e=Zs(),Ga(e)){if("selectionStart"in e)var n={start:e.selectionStart,end:e.selectionEnd};else e:{n=(n=e.ownerDocument)&&n.defaultView||window;var r=n.getSelection&&n.getSelection();if(r&&r.rangeCount!==0){n=r.anchorNode;var l=r.anchorOffset,a=r.focusNode;r=r.focusOffset;try{n.nodeType,a.nodeType}catch{n=null;break e}var s=0,c=-1,p=-1,w=0,T=0,L=e,N=null;t:for(;;){for(var I;L!==n||l!==0&&L.nodeType!==3||(c=s+l),L!==a||r!==0&&L.nodeType!==3||(p=s+r),L.nodeType===3&&(s+=L.nodeValue.length),(I=L.firstChild)!==null;)N=L,L=I;for(;;){if(L===e)break t;if(N===n&&++w===l&&(c=s),N===a&&++T===r&&(p=s),(I=L.nextSibling)!==null)break;L=N,N=L.parentNode}L=I}n=c===-1||p===-1?null:{start:c,end:p}}else n=null}n=n||{start:0,end:0}}else n=null;for(ao={focusedElem:e,selectionRange:n},Tl=!1,F=t;F!==null;)if(t=F,e=t.child,(t.subtreeFlags&1028)!==0&&e!==null)e.return=t,F=e;else for(;F!==null;){t=F;try{var B=t.alternate;if((t.flags&1024)!==0)switch(t.tag){case 0:case 11:case 15:break;case 1:if(B!==null){var V=B.memoizedProps,je=B.memoizedState,y=t.stateNode,g=y.getSnapshotBeforeUpdate(t.elementType===t.type?V:Ot(t.type,V),je);y.__reactInternalSnapshotBeforeUpdate=g}break;case 3:var _=t.stateNode.containerInfo;_.nodeType===1?_.textContent="":_.nodeType===9&&_.documentElement&&_.removeChild(_.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(i(163))}}catch(D){Ne(t,t.return,D)}if(e=t.sibling,e!==null){e.return=t.return,F=e;break}F=t.return}return B=wu,wu=!1,B}function fl(e,t,n){var r=t.updateQueue;if(r=r!==null?r.lastEffect:null,r!==null){var l=r=r.next;do{if((l.tag&e)===e){var a=l.destroy;l.destroy=void 0,a!==void 0&&Qo(t,n,a)}l=l.next}while(l!==r)}}function ca(e,t){if(t=t.updateQueue,t=t!==null?t.lastEffect:null,t!==null){var n=t=t.next;do{if((n.tag&e)===e){var r=n.create;n.destroy=r()}n=n.next}while(n!==t)}}function Jo(e){var t=e.ref;if(t!==null){var n=e.stateNode;switch(e.tag){case 5:e=n;break;default:e=n}typeof t=="function"?t(e):t.current=e}}function ku(e){var t=e.alternate;t!==null&&(e.alternate=null,ku(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&(delete t[Vt],delete t[nl],delete t[uo],delete t[vd],delete t[yd])),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}function bu(e){return e.tag===5||e.tag===3||e.tag===4}function Su(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||bu(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function Yo(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?n.nodeType===8?n.parentNode.insertBefore(e,t):n.insertBefore(e,t):(n.nodeType===8?(t=n.parentNode,t.insertBefore(e,n)):(t=n,t.appendChild(e)),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=Ul));else if(r!==4&&(e=e.child,e!==null))for(Yo(e,t,n),e=e.sibling;e!==null;)Yo(e,t,n),e=e.sibling}function Go(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?n.insertBefore(e,t):n.appendChild(e);else if(r!==4&&(e=e.child,e!==null))for(Go(e,t,n),e=e.sibling;e!==null;)Go(e,t,n),e=e.sibling}var Be=null,$t=!1;function bn(e,t,n){for(n=n.child;n!==null;)Eu(e,t,n),n=n.sibling}function Eu(e,t,n){if(X&&typeof X.onCommitFiberUnmount=="function")try{X.onCommitFiberUnmount(ae,n)}catch{}switch(n.tag){case 5:Je||Tr(n,t);case 6:var r=Be,l=$t;Be=null,bn(e,t,n),Be=r,$t=l,Be!==null&&($t?(e=Be,n=n.stateNode,e.nodeType===8?e.parentNode.removeChild(n):e.removeChild(n)):Be.removeChild(n.stateNode));break;case 18:Be!==null&&($t?(e=Be,n=n.stateNode,e.nodeType===8?io(e.parentNode,n):e.nodeType===1&&io(e,n),Hr(e)):io(Be,n.stateNode));break;case 4:r=Be,l=$t,Be=n.stateNode.containerInfo,$t=!0,bn(e,t,n),Be=r,$t=l;break;case 0:case 11:case 14:case 15:if(!Je&&(r=n.updateQueue,r!==null&&(r=r.lastEffect,r!==null))){l=r=r.next;do{var a=l,s=a.destroy;a=a.tag,s!==void 0&&((a&2)!==0||(a&4)!==0)&&Qo(n,t,s),l=l.next}while(l!==r)}bn(e,t,n);break;case 1:if(!Je&&(Tr(n,t),r=n.stateNode,typeof r.componentWillUnmount=="function"))try{r.props=n.memoizedProps,r.state=n.memoizedState,r.componentWillUnmount()}catch(c){Ne(n,t,c)}bn(e,t,n);break;case 21:bn(e,t,n);break;case 22:n.mode&1?(Je=(r=Je)||n.memoizedState!==null,bn(e,t,n),Je=r):bn(e,t,n);break;default:bn(e,t,n)}}function Cu(e){var t=e.updateQueue;if(t!==null){e.updateQueue=null;var n=e.stateNode;n===null&&(n=e.stateNode=new Dd),t.forEach(function(r){var l=Hd.bind(null,e,r);n.has(r)||(n.add(r),r.then(l,l))})}}function It(e,t){var n=t.deletions;if(n!==null)for(var r=0;r<n.length;r++){var l=n[r];try{var a=e,s=t,c=s;e:for(;c!==null;){switch(c.tag){case 5:Be=c.stateNode,$t=!1;break e;case 3:Be=c.stateNode.containerInfo,$t=!0;break e;case 4:Be=c.stateNode.containerInfo,$t=!0;break e}c=c.return}if(Be===null)throw Error(i(160));Eu(a,s,l),Be=null,$t=!1;var p=l.alternate;p!==null&&(p.return=null),l.return=null}catch(w){Ne(l,t,w)}}if(t.subtreeFlags&12854)for(t=t.child;t!==null;)Nu(t,e),t=t.sibling}function Nu(e,t){var n=e.alternate,r=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if(It(t,e),Kt(e),r&4){try{fl(3,e,e.return),ca(3,e)}catch(V){Ne(e,e.return,V)}try{fl(5,e,e.return)}catch(V){Ne(e,e.return,V)}}break;case 1:It(t,e),Kt(e),r&512&&n!==null&&Tr(n,n.return);break;case 5:if(It(t,e),Kt(e),r&512&&n!==null&&Tr(n,n.return),e.flags&32){var l=e.stateNode;try{jt(l,"")}catch(V){Ne(e,e.return,V)}}if(r&4&&(l=e.stateNode,l!=null)){var a=e.memoizedProps,s=n!==null?n.memoizedProps:a,c=e.type,p=e.updateQueue;if(e.updateQueue=null,p!==null)try{c==="input"&&a.type==="radio"&&a.name!=null&&Ut(l,a),ar(c,s);var w=ar(c,a);for(s=0;s<p.length;s+=2){var T=p[s],L=p[s+1];T==="style"?Rr(l,L):T==="dangerouslySetInnerHTML"?un(l,L):T==="children"?jt(l,L):Te(l,T,L,w)}switch(c){case"input":Bt(l,a);break;case"textarea":er(l,a);break;case"select":var N=l._wrapperState.wasMultiple;l._wrapperState.wasMultiple=!!a.multiple;var I=a.value;I!=null?Ue(l,!!a.multiple,I,!1):N!==!!a.multiple&&(a.defaultValue!=null?Ue(l,!!a.multiple,a.defaultValue,!0):Ue(l,!!a.multiple,a.multiple?[]:"",!1))}l[nl]=a}catch(V){Ne(e,e.return,V)}}break;case 6:if(It(t,e),Kt(e),r&4){if(e.stateNode===null)throw Error(i(162));l=e.stateNode,a=e.memoizedProps;try{l.nodeValue=a}catch(V){Ne(e,e.return,V)}}break;case 3:if(It(t,e),Kt(e),r&4&&n!==null&&n.memoizedState.isDehydrated)try{Hr(t.containerInfo)}catch(V){Ne(e,e.return,V)}break;case 4:It(t,e),Kt(e);break;case 13:It(t,e),Kt(e),l=e.child,l.flags&8192&&(a=l.memoizedState!==null,l.stateNode.isHidden=a,!a||l.alternate!==null&&l.alternate.memoizedState!==null||(Zo=ke())),r&4&&Cu(e);break;case 22:if(T=n!==null&&n.memoizedState!==null,e.mode&1?(Je=(w=Je)||T,It(t,e),Je=w):It(t,e),Kt(e),r&8192){if(w=e.memoizedState!==null,(e.stateNode.isHidden=w)&&!T&&(e.mode&1)!==0)for(F=e,T=e.child;T!==null;){for(L=F=T;F!==null;){switch(N=F,I=N.child,N.tag){case 0:case 11:case 14:case 15:fl(4,N,N.return);break;case 1:Tr(N,N.return);var B=N.stateNode;if(typeof B.componentWillUnmount=="function"){r=N,n=N.return;try{t=r,B.props=t.memoizedProps,B.state=t.memoizedState,B.componentWillUnmount()}catch(V){Ne(r,n,V)}}break;case 5:Tr(N,N.return);break;case 22:if(N.memoizedState!==null){zu(L);continue}}I!==null?(I.return=N,F=I):zu(L)}T=T.sibling}e:for(T=null,L=e;;){if(L.tag===5){if(T===null){T=L;try{l=L.stateNode,w?(a=l.style,typeof a.setProperty=="function"?a.setProperty("display","none","important"):a.display="none"):(c=L.stateNode,p=L.memoizedProps.style,s=p!=null&&p.hasOwnProperty("display")?p.display:null,c.style.display=Tt("display",s))}catch(V){Ne(e,e.return,V)}}}else if(L.tag===6){if(T===null)try{L.stateNode.nodeValue=w?"":L.memoizedProps}catch(V){Ne(e,e.return,V)}}else if((L.tag!==22&&L.tag!==23||L.memoizedState===null||L===e)&&L.child!==null){L.child.return=L,L=L.child;continue}if(L===e)break e;for(;L.sibling===null;){if(L.return===null||L.return===e)break e;T===L&&(T=null),L=L.return}T===L&&(T=null),L.sibling.return=L.return,L=L.sibling}}break;case 19:It(t,e),Kt(e),r&4&&Cu(e);break;case 21:break;default:It(t,e),Kt(e)}}function Kt(e){var t=e.flags;if(t&2){try{e:{for(var n=e.return;n!==null;){if(bu(n)){var r=n;break e}n=n.return}throw Error(i(160))}switch(r.tag){case 5:var l=r.stateNode;r.flags&32&&(jt(l,""),r.flags&=-33);var a=Su(e);Go(e,a,l);break;case 3:case 4:var s=r.stateNode.containerInfo,c=Su(e);Yo(e,c,s);break;default:throw Error(i(161))}}catch(p){Ne(e,e.return,p)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function $d(e,t,n){F=e,ju(e)}function ju(e,t,n){for(var r=(e.mode&1)!==0;F!==null;){var l=F,a=l.child;if(l.tag===22&&r){var s=l.memoizedState!==null||ua;if(!s){var c=l.alternate,p=c!==null&&c.memoizedState!==null||Je;c=ua;var w=Je;if(ua=s,(Je=p)&&!w)for(F=l;F!==null;)s=F,p=s.child,s.tag===22&&s.memoizedState!==null?Pu(l):p!==null?(p.return=s,F=p):Pu(l);for(;a!==null;)F=a,ju(a),a=a.sibling;F=l,ua=c,Je=w}Tu(e)}else(l.subtreeFlags&8772)!==0&&a!==null?(a.return=l,F=a):Tu(e)}}function Tu(e){for(;F!==null;){var t=F;if((t.flags&8772)!==0){var n=t.alternate;try{if((t.flags&8772)!==0)switch(t.tag){case 0:case 11:case 15:Je||ca(5,t);break;case 1:var r=t.stateNode;if(t.flags&4&&!Je)if(n===null)r.componentDidMount();else{var l=t.elementType===t.type?n.memoizedProps:Ot(t.type,n.memoizedProps);r.componentDidUpdate(l,n.memoizedState,r.__reactInternalSnapshotBeforeUpdate)}var a=t.updateQueue;a!==null&&zi(t,a,r);break;case 3:var s=t.updateQueue;if(s!==null){if(n=null,t.child!==null)switch(t.child.tag){case 5:n=t.child.stateNode;break;case 1:n=t.child.stateNode}zi(t,s,n)}break;case 5:var c=t.stateNode;if(n===null&&t.flags&4){n=c;var p=t.memoizedProps;switch(t.type){case"button":case"input":case"select":case"textarea":p.autoFocus&&n.focus();break;case"img":p.src&&(n.src=p.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(t.memoizedState===null){var w=t.alternate;if(w!==null){var T=w.memoizedState;if(T!==null){var L=T.dehydrated;L!==null&&Hr(L)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(i(163))}Je||t.flags&512&&Jo(t)}catch(N){Ne(t,t.return,N)}}if(t===e){F=null;break}if(n=t.sibling,n!==null){n.return=t.return,F=n;break}F=t.return}}function zu(e){for(;F!==null;){var t=F;if(t===e){F=null;break}var n=t.sibling;if(n!==null){n.return=t.return,F=n;break}F=t.return}}function Pu(e){for(;F!==null;){var t=F;try{switch(t.tag){case 0:case 11:case 15:var n=t.return;try{ca(4,t)}catch(p){Ne(t,n,p)}break;case 1:var r=t.stateNode;if(typeof r.componentDidMount=="function"){var l=t.return;try{r.componentDidMount()}catch(p){Ne(t,l,p)}}var a=t.return;try{Jo(t)}catch(p){Ne(t,a,p)}break;case 5:var s=t.return;try{Jo(t)}catch(p){Ne(t,s,p)}}}catch(p){Ne(t,t.return,p)}if(t===e){F=null;break}var c=t.sibling;if(c!==null){c.return=t.return,F=c;break}F=t.return}}var Id=Math.ceil,da=we.ReactCurrentDispatcher,qo=we.ReactCurrentOwner,bt=we.ReactCurrentBatchConfig,ce=0,Ie=null,Pe=null,Ve=0,ft=0,zr=vn(0),Re=0,gl=null,Qn=0,pa=0,Xo=0,ml=null,rt=null,Zo=0,Pr=1/0,an=null,fa=!1,es=null,Sn=null,ga=!1,En=null,ma=0,hl=0,ts=null,ha=-1,xa=0;function qe(){return(ce&6)!==0?ke():ha!==-1?ha:ha=ke()}function Cn(e){return(e.mode&1)===0?1:(ce&2)!==0&&Ve!==0?Ve&-Ve:wd.transition!==null?(xa===0&&(xa=Ss()),xa):(e=me,e!==0||(e=window.event,e=e===void 0?16:Ls(e.type)),e)}function At(e,t,n,r){if(50<hl)throw hl=0,ts=null,Error(i(185));Fr(e,n,r),((ce&2)===0||e!==Ie)&&(e===Ie&&((ce&2)===0&&(pa|=n),Re===4&&Nn(e,Ve)),lt(e,r),n===1&&ce===0&&(t.mode&1)===0&&(Pr=ke()+500,Hl&&_n()))}function lt(e,t){var n=e.callbackNode;wc(e,t);var r=Cl(e,e===Ie?Ve:0);if(r===0)n!==null&&kl(n),e.callbackNode=null,e.callbackPriority=0;else if(t=r&-r,e.callbackPriority!==t){if(n!=null&&kl(n),t===1)e.tag===0?_d(Lu.bind(null,e)):vi(Lu.bind(null,e)),hd(function(){(ce&6)===0&&_n()}),n=null;else{switch(Es(r)){case 1:n=cr;break;case 4:n=f;break;case 16:n=S;break;case 536870912:n=G;break;default:n=S}n=Uu(n,Mu.bind(null,e))}e.callbackPriority=t,e.callbackNode=n}}function Mu(e,t){if(ha=-1,xa=0,(ce&6)!==0)throw Error(i(327));var n=e.callbackNode;if(Mr()&&e.callbackNode!==n)return null;var r=Cl(e,e===Ie?Ve:0);if(r===0)return null;if((r&30)!==0||(r&e.expiredLanes)!==0||t)t=va(e,r);else{t=r;var l=ce;ce|=2;var a=Du();(Ie!==e||Ve!==t)&&(an=null,Pr=ke()+500,Yn(e,t));do try{Ud();break}catch(c){Ru(e,c)}while(!0);yo(),da.current=a,ce=l,Pe!==null?t=0:(Ie=null,Ve=0,t=Re)}if(t!==0){if(t===2&&(l=Ra(e),l!==0&&(r=l,t=ns(e,l))),t===1)throw n=gl,Yn(e,0),Nn(e,r),lt(e,ke()),n;if(t===6)Nn(e,r);else{if(l=e.current.alternate,(r&30)===0&&!Ad(l)&&(t=va(e,r),t===2&&(a=Ra(e),a!==0&&(r=a,t=ns(e,a))),t===1))throw n=gl,Yn(e,0),Nn(e,r),lt(e,ke()),n;switch(e.finishedWork=l,e.finishedLanes=r,t){case 0:case 1:throw Error(i(345));case 2:Gn(e,rt,an);break;case 3:if(Nn(e,r),(r&130023424)===r&&(t=Zo+500-ke(),10<t)){if(Cl(e,0)!==0)break;if(l=e.suspendedLanes,(l&r)!==r){qe(),e.pingedLanes|=e.suspendedLanes&l;break}e.timeoutHandle=so(Gn.bind(null,e,rt,an),t);break}Gn(e,rt,an);break;case 4:if(Nn(e,r),(r&4194240)===r)break;for(t=e.eventTimes,l=-1;0<r;){var s=31-J(r);a=1<<s,s=t[s],s>l&&(l=s),r&=~a}if(r=l,r=ke()-r,r=(120>r?120:480>r?480:1080>r?1080:1920>r?1920:3e3>r?3e3:4320>r?4320:1960*Id(r/1960))-r,10<r){e.timeoutHandle=so(Gn.bind(null,e,rt,an),r);break}Gn(e,rt,an);break;case 5:Gn(e,rt,an);break;default:throw Error(i(329))}}}return lt(e,ke()),e.callbackNode===n?Mu.bind(null,e):null}function ns(e,t){var n=ml;return e.current.memoizedState.isDehydrated&&(Yn(e,t).flags|=256),e=va(e,t),e!==2&&(t=rt,rt=n,t!==null&&rs(t)),e}function rs(e){rt===null?rt=e:rt.push.apply(rt,e)}function Ad(e){for(var t=e;;){if(t.flags&16384){var n=t.updateQueue;if(n!==null&&(n=n.stores,n!==null))for(var r=0;r<n.length;r++){var l=n[r],a=l.getSnapshot;l=l.value;try{if(!Rt(a(),l))return!1}catch{return!1}}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function Nn(e,t){for(t&=~Xo,t&=~pa,e.suspendedLanes|=t,e.pingedLanes&=~t,e=e.expirationTimes;0<t;){var n=31-J(t),r=1<<n;e[n]=-1,t&=~r}}function Lu(e){if((ce&6)!==0)throw Error(i(327));Mr();var t=Cl(e,0);if((t&1)===0)return lt(e,ke()),null;var n=va(e,t);if(e.tag!==0&&n===2){var r=Ra(e);r!==0&&(t=r,n=ns(e,r))}if(n===1)throw n=gl,Yn(e,0),Nn(e,t),lt(e,ke()),n;if(n===6)throw Error(i(345));return e.finishedWork=e.current.alternate,e.finishedLanes=t,Gn(e,rt,an),lt(e,ke()),null}function ls(e,t){var n=ce;ce|=1;try{return e(t)}finally{ce=n,ce===0&&(Pr=ke()+500,Hl&&_n())}}function Jn(e){En!==null&&En.tag===0&&(ce&6)===0&&Mr();var t=ce;ce|=1;var n=bt.transition,r=me;try{if(bt.transition=null,me=1,e)return e()}finally{me=r,bt.transition=n,ce=t,(ce&6)===0&&_n()}}function as(){ft=zr.current,_e(zr)}function Yn(e,t){e.finishedWork=null,e.finishedLanes=0;var n=e.timeoutHandle;if(n!==-1&&(e.timeoutHandle=-1,md(n)),Pe!==null)for(n=Pe.return;n!==null;){var r=n;switch(go(r),r.tag){case 1:r=r.type.childContextTypes,r!=null&&Vl();break;case 3:Nr(),_e(et),_e(He),No();break;case 5:Eo(r);break;case 4:Nr();break;case 13:_e(Se);break;case 19:_e(Se);break;case 10:_o(r.type._context);break;case 22:case 23:as()}n=n.return}if(Ie=e,Pe=e=jn(e.current,null),Ve=ft=t,Re=0,gl=null,Xo=pa=Qn=0,rt=ml=null,Wn!==null){for(t=0;t<Wn.length;t++)if(n=Wn[t],r=n.interleaved,r!==null){n.interleaved=null;var l=r.next,a=n.pending;if(a!==null){var s=a.next;a.next=l,r.next=s}n.pending=r}Wn=null}return e}function Ru(e,t){do{var n=Pe;try{if(yo(),ta.current=aa,na){for(var r=Ee.memoizedState;r!==null;){var l=r.queue;l!==null&&(l.pending=null),r=r.next}na=!1}if(Kn=0,$e=Le=Ee=null,il=!1,ul=0,qo.current=null,n===null||n.return===null){Re=1,gl=t,Pe=null;break}e:{var a=e,s=n.return,c=n,p=t;if(t=Ve,c.flags|=32768,p!==null&&typeof p=="object"&&typeof p.then=="function"){var w=p,T=c,L=T.tag;if((T.mode&1)===0&&(L===0||L===11||L===15)){var N=T.alternate;N?(T.updateQueue=N.updateQueue,T.memoizedState=N.memoizedState,T.lanes=N.lanes):(T.updateQueue=null,T.memoizedState=null)}var I=au(s);if(I!==null){I.flags&=-257,ou(I,s,c,a,t),I.mode&1&&lu(a,w,t),t=I,p=w;var B=t.updateQueue;if(B===null){var V=new Set;V.add(p),t.updateQueue=V}else B.add(p);break e}else{if((t&1)===0){lu(a,w,t),os();break e}p=Error(i(426))}}else if(be&&c.mode&1){var je=au(s);if(je!==null){(je.flags&65536)===0&&(je.flags|=256),ou(je,s,c,a,t),xo(jr(p,c));break e}}a=p=jr(p,c),Re!==4&&(Re=2),ml===null?ml=[a]:ml.push(a),a=s;do{switch(a.tag){case 3:a.flags|=65536,t&=-t,a.lanes|=t;var y=nu(a,p,t);Ti(a,y);break e;case 1:c=p;var g=a.type,_=a.stateNode;if((a.flags&128)===0&&(typeof g.getDerivedStateFromError=="function"||_!==null&&typeof _.componentDidCatch=="function"&&(Sn===null||!Sn.has(_)))){a.flags|=65536,t&=-t,a.lanes|=t;var D=ru(a,c,t);Ti(a,D);break e}}a=a.return}while(a!==null)}$u(n)}catch(W){t=W,Pe===n&&n!==null&&(Pe=n=n.return);continue}break}while(!0)}function Du(){var e=da.current;return da.current=aa,e===null?aa:e}function os(){(Re===0||Re===3||Re===2)&&(Re=4),Ie===null||(Qn&268435455)===0&&(pa&268435455)===0||Nn(Ie,Ve)}function va(e,t){var n=ce;ce|=2;var r=Du();(Ie!==e||Ve!==t)&&(an=null,Yn(e,t));do try{Fd();break}catch(l){Ru(e,l)}while(!0);if(yo(),ce=n,da.current=r,Pe!==null)throw Error(i(261));return Ie=null,Ve=0,Re}function Fd(){for(;Pe!==null;)Ou(Pe)}function Ud(){for(;Pe!==null&&!Ma();)Ou(Pe)}function Ou(e){var t=Fu(e.alternate,e,ft);e.memoizedProps=e.pendingProps,t===null?$u(e):Pe=t,qo.current=null}function $u(e){var t=e;do{var n=t.alternate;if(e=t.return,(t.flags&32768)===0){if(n=Ld(n,t,ft),n!==null){Pe=n;return}}else{if(n=Rd(n,t),n!==null){n.flags&=32767,Pe=n;return}if(e!==null)e.flags|=32768,e.subtreeFlags=0,e.deletions=null;else{Re=6,Pe=null;return}}if(t=t.sibling,t!==null){Pe=t;return}Pe=t=e}while(t!==null);Re===0&&(Re=5)}function Gn(e,t,n){var r=me,l=bt.transition;try{bt.transition=null,me=1,Bd(e,t,n,r)}finally{bt.transition=l,me=r}return null}function Bd(e,t,n,r){do Mr();while(En!==null);if((ce&6)!==0)throw Error(i(327));n=e.finishedWork;var l=e.finishedLanes;if(n===null)return null;if(e.finishedWork=null,e.finishedLanes=0,n===e.current)throw Error(i(177));e.callbackNode=null,e.callbackPriority=0;var a=n.lanes|n.childLanes;if(kc(e,a),e===Ie&&(Pe=Ie=null,Ve=0),(n.subtreeFlags&2064)===0&&(n.flags&2064)===0||ga||(ga=!0,Uu(S,function(){return Mr(),null})),a=(n.flags&15990)!==0,(n.subtreeFlags&15990)!==0||a){a=bt.transition,bt.transition=null;var s=me;me=1;var c=ce;ce|=4,qo.current=null,Od(e,n),Nu(n,e),id(ao),Tl=!!lo,ao=lo=null,e.current=n,$d(n),La(),ce=c,me=s,bt.transition=a}else e.current=n;if(ga&&(ga=!1,En=e,ma=l),a=e.pendingLanes,a===0&&(Sn=null),Ze(n.stateNode),lt(e,ke()),t!==null)for(r=e.onRecoverableError,n=0;n<t.length;n++)l=t[n],r(l.value,{componentStack:l.stack,digest:l.digest});if(fa)throw fa=!1,e=es,es=null,e;return(ma&1)!==0&&e.tag!==0&&Mr(),a=e.pendingLanes,(a&1)!==0?e===ts?hl++:(hl=0,ts=e):hl=0,_n(),null}function Mr(){if(En!==null){var e=Es(ma),t=bt.transition,n=me;try{if(bt.transition=null,me=16>e?16:e,En===null)var r=!1;else{if(e=En,En=null,ma=0,(ce&6)!==0)throw Error(i(331));var l=ce;for(ce|=4,F=e.current;F!==null;){var a=F,s=a.child;if((F.flags&16)!==0){var c=a.deletions;if(c!==null){for(var p=0;p<c.length;p++){var w=c[p];for(F=w;F!==null;){var T=F;switch(T.tag){case 0:case 11:case 15:fl(8,T,a)}var L=T.child;if(L!==null)L.return=T,F=L;else for(;F!==null;){T=F;var N=T.sibling,I=T.return;if(ku(T),T===w){F=null;break}if(N!==null){N.return=I,F=N;break}F=I}}}var B=a.alternate;if(B!==null){var V=B.child;if(V!==null){B.child=null;do{var je=V.sibling;V.sibling=null,V=je}while(V!==null)}}F=a}}if((a.subtreeFlags&2064)!==0&&s!==null)s.return=a,F=s;else e:for(;F!==null;){if(a=F,(a.flags&2048)!==0)switch(a.tag){case 0:case 11:case 15:fl(9,a,a.return)}var y=a.sibling;if(y!==null){y.return=a.return,F=y;break e}F=a.return}}var g=e.current;for(F=g;F!==null;){s=F;var _=s.child;if((s.subtreeFlags&2064)!==0&&_!==null)_.return=s,F=_;else e:for(s=g;F!==null;){if(c=F,(c.flags&2048)!==0)try{switch(c.tag){case 0:case 11:case 15:ca(9,c)}}catch(W){Ne(c,c.return,W)}if(c===s){F=null;break e}var D=c.sibling;if(D!==null){D.return=c.return,F=D;break e}F=c.return}}if(ce=l,_n(),X&&typeof X.onPostCommitFiberRoot=="function")try{X.onPostCommitFiberRoot(ae,e)}catch{}r=!0}return r}finally{me=n,bt.transition=t}}return!1}function Iu(e,t,n){t=jr(n,t),t=nu(e,t,1),e=kn(e,t,1),t=qe(),e!==null&&(Fr(e,1,t),lt(e,t))}function Ne(e,t,n){if(e.tag===3)Iu(e,e,n);else for(;t!==null;){if(t.tag===3){Iu(t,e,n);break}else if(t.tag===1){var r=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof r.componentDidCatch=="function"&&(Sn===null||!Sn.has(r))){e=jr(n,e),e=ru(t,e,1),t=kn(t,e,1),e=qe(),t!==null&&(Fr(t,1,e),lt(t,e));break}}t=t.return}}function Vd(e,t,n){var r=e.pingCache;r!==null&&r.delete(t),t=qe(),e.pingedLanes|=e.suspendedLanes&n,Ie===e&&(Ve&n)===n&&(Re===4||Re===3&&(Ve&130023424)===Ve&&500>ke()-Zo?Yn(e,0):Xo|=n),lt(e,t)}function Au(e,t){t===0&&((e.mode&1)===0?t=1:(t=El,El<<=1,(El&130023424)===0&&(El=4194304)));var n=qe();e=nn(e,t),e!==null&&(Fr(e,t,n),lt(e,n))}function Wd(e){var t=e.memoizedState,n=0;t!==null&&(n=t.retryLane),Au(e,n)}function Hd(e,t){var n=0;switch(e.tag){case 13:var r=e.stateNode,l=e.memoizedState;l!==null&&(n=l.retryLane);break;case 19:r=e.stateNode;break;default:throw Error(i(314))}r!==null&&r.delete(t),Au(e,n)}var Fu;Fu=function(e,t,n){if(e!==null)if(e.memoizedProps!==t.pendingProps||et.current)nt=!0;else{if((e.lanes&n)===0&&(t.flags&128)===0)return nt=!1,Md(e,t,n);nt=(e.flags&131072)!==0}else nt=!1,be&&(t.flags&1048576)!==0&&yi(t,Ql,t.index);switch(t.lanes=0,t.tag){case 2:var r=t.type;ia(e,t),e=t.pendingProps;var l=_r(t,He.current);Cr(t,n),l=zo(null,t,r,e,l,n);var a=Po();return t.flags|=1,typeof l=="object"&&l!==null&&typeof l.render=="function"&&l.$$typeof===void 0?(t.tag=1,t.memoizedState=null,t.updateQueue=null,tt(r)?(a=!0,Wl(t)):a=!1,t.memoizedState=l.state!==null&&l.state!==void 0?l.state:null,bo(t),l.updater=oa,t.stateNode=l,l._reactInternals=t,$o(t,r,e,n),t=Uo(null,t,r,!0,a,n)):(t.tag=0,be&&a&&fo(t),Ge(null,t,l,n),t=t.child),t;case 16:r=t.elementType;e:{switch(ia(e,t),e=t.pendingProps,l=r._init,r=l(r._payload),t.type=r,l=t.tag=Qd(r),e=Ot(r,e),l){case 0:t=Fo(null,t,r,e,n);break e;case 1:t=pu(null,t,r,e,n);break e;case 11:t=su(null,t,r,e,n);break e;case 14:t=iu(null,t,r,Ot(r.type,e),n);break e}throw Error(i(306,r,""))}return t;case 0:return r=t.type,l=t.pendingProps,l=t.elementType===r?l:Ot(r,l),Fo(e,t,r,l,n);case 1:return r=t.type,l=t.pendingProps,l=t.elementType===r?l:Ot(r,l),pu(e,t,r,l,n);case 3:e:{if(fu(t),e===null)throw Error(i(387));r=t.pendingProps,a=t.memoizedState,l=a.element,ji(e,t),Zl(t,r,null,n);var s=t.memoizedState;if(r=s.element,a.isDehydrated)if(a={element:r,isDehydrated:!1,cache:s.cache,pendingSuspenseBoundaries:s.pendingSuspenseBoundaries,transitions:s.transitions},t.updateQueue.baseState=a,t.memoizedState=a,t.flags&256){l=jr(Error(i(423)),t),t=gu(e,t,r,n,l);break e}else if(r!==l){l=jr(Error(i(424)),t),t=gu(e,t,r,n,l);break e}else for(pt=xn(t.stateNode.containerInfo.firstChild),dt=t,be=!0,Dt=null,n=Ci(t,null,r,n),t.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(br(),r===l){t=ln(e,t,n);break e}Ge(e,t,r,n)}t=t.child}return t;case 5:return Pi(t),e===null&&ho(t),r=t.type,l=t.pendingProps,a=e!==null?e.memoizedProps:null,s=l.children,oo(r,l)?s=null:a!==null&&oo(r,a)&&(t.flags|=32),du(e,t),Ge(e,t,s,n),t.child;case 6:return e===null&&ho(t),null;case 13:return mu(e,t,n);case 4:return So(t,t.stateNode.containerInfo),r=t.pendingProps,e===null?t.child=Sr(t,null,r,n):Ge(e,t,r,n),t.child;case 11:return r=t.type,l=t.pendingProps,l=t.elementType===r?l:Ot(r,l),su(e,t,r,l,n);case 7:return Ge(e,t,t.pendingProps,n),t.child;case 8:return Ge(e,t,t.pendingProps.children,n),t.child;case 12:return Ge(e,t,t.pendingProps.children,n),t.child;case 10:e:{if(r=t.type._context,l=t.pendingProps,a=t.memoizedProps,s=l.value,xe(Gl,r._currentValue),r._currentValue=s,a!==null)if(Rt(a.value,s)){if(a.children===l.children&&!et.current){t=ln(e,t,n);break e}}else for(a=t.child,a!==null&&(a.return=t);a!==null;){var c=a.dependencies;if(c!==null){s=a.child;for(var p=c.firstContext;p!==null;){if(p.context===r){if(a.tag===1){p=rn(-1,n&-n),p.tag=2;var w=a.updateQueue;if(w!==null){w=w.shared;var T=w.pending;T===null?p.next=p:(p.next=T.next,T.next=p),w.pending=p}}a.lanes|=n,p=a.alternate,p!==null&&(p.lanes|=n),wo(a.return,n,t),c.lanes|=n;break}p=p.next}}else if(a.tag===10)s=a.type===t.type?null:a.child;else if(a.tag===18){if(s=a.return,s===null)throw Error(i(341));s.lanes|=n,c=s.alternate,c!==null&&(c.lanes|=n),wo(s,n,t),s=a.sibling}else s=a.child;if(s!==null)s.return=a;else for(s=a;s!==null;){if(s===t){s=null;break}if(a=s.sibling,a!==null){a.return=s.return,s=a;break}s=s.return}a=s}Ge(e,t,l.children,n),t=t.child}return t;case 9:return l=t.type,r=t.pendingProps.children,Cr(t,n),l=wt(l),r=r(l),t.flags|=1,Ge(e,t,r,n),t.child;case 14:return r=t.type,l=Ot(r,t.pendingProps),l=Ot(r.type,l),iu(e,t,r,l,n);case 15:return uu(e,t,t.type,t.pendingProps,n);case 17:return r=t.type,l=t.pendingProps,l=t.elementType===r?l:Ot(r,l),ia(e,t),t.tag=1,tt(r)?(e=!0,Wl(t)):e=!1,Cr(t,n),eu(t,r,l),$o(t,r,l,n),Uo(null,t,r,!0,e,n);case 19:return xu(e,t,n);case 22:return cu(e,t,n)}throw Error(i(156,t.tag))};function Uu(e,t){return In(e,t)}function Kd(e,t,n,r){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=r,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function St(e,t,n,r){return new Kd(e,t,n,r)}function ss(e){return e=e.prototype,!(!e||!e.isReactComponent)}function Qd(e){if(typeof e=="function")return ss(e)?1:0;if(e!=null){if(e=e.$$typeof,e===ot)return 11;if(e===mt)return 14}return 2}function jn(e,t){var n=e.alternate;return n===null?(n=St(e.tag,t,e.key,e.mode),n.elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=e.flags&14680064,n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n}function ya(e,t,n,r,l,a){var s=2;if(r=e,typeof e=="function")ss(e)&&(s=1);else if(typeof e=="string")s=5;else e:switch(e){case ze:return qn(n.children,l,a,t);case De:s=8,l|=8;break;case Ct:return e=St(12,n,t,l|2),e.elementType=Ct,e.lanes=a,e;case Ye:return e=St(13,n,t,l),e.elementType=Ye,e.lanes=a,e;case st:return e=St(19,n,t,l),e.elementType=st,e.lanes=a,e;case ve:return _a(n,l,a,t);default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case gt:s=10;break e;case Ft:s=9;break e;case ot:s=11;break e;case mt:s=14;break e;case Fe:s=16,r=null;break e}throw Error(i(130,e==null?e:typeof e,""))}return t=St(s,n,t,l),t.elementType=e,t.type=r,t.lanes=a,t}function qn(e,t,n,r){return e=St(7,e,r,t),e.lanes=n,e}function _a(e,t,n,r){return e=St(22,e,r,t),e.elementType=ve,e.lanes=n,e.stateNode={isHidden:!1},e}function is(e,t,n){return e=St(6,e,null,t),e.lanes=n,e}function us(e,t,n){return t=St(4,e.children!==null?e.children:[],e.key,t),t.lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}function Jd(e,t,n,r,l){this.tag=t,this.containerInfo=e,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=Da(0),this.expirationTimes=Da(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Da(0),this.identifierPrefix=r,this.onRecoverableError=l,this.mutableSourceEagerHydrationData=null}function cs(e,t,n,r,l,a,s,c,p){return e=new Jd(e,t,n,c,p),t===1?(t=1,a===!0&&(t|=8)):t=0,a=St(3,null,null,t),e.current=a,a.stateNode=e,a.memoizedState={element:r,isDehydrated:n,cache:null,transitions:null,pendingSuspenseBoundaries:null},bo(a),e}function Yd(e,t,n){var r=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:pe,key:r==null?null:""+r,children:e,containerInfo:t,implementation:n}}function Bu(e){if(!e)return yn;e=e._reactInternals;e:{if(Lt(e)!==e||e.tag!==1)throw Error(i(170));var t=e;do{switch(t.tag){case 3:t=t.stateNode.context;break e;case 1:if(tt(t.type)){t=t.stateNode.__reactInternalMemoizedMergedChildContext;break e}}t=t.return}while(t!==null);throw Error(i(171))}if(e.tag===1){var n=e.type;if(tt(n))return hi(e,n,t)}return t}function Vu(e,t,n,r,l,a,s,c,p){return e=cs(n,r,!0,e,l,a,s,c,p),e.context=Bu(null),n=e.current,r=qe(),l=Cn(n),a=rn(r,l),a.callback=t??null,kn(n,a,l),e.current.lanes=l,Fr(e,l,r),lt(e,r),e}function wa(e,t,n,r){var l=t.current,a=qe(),s=Cn(l);return n=Bu(n),t.context===null?t.context=n:t.pendingContext=n,t=rn(a,s),t.payload={element:e},r=r===void 0?null:r,r!==null&&(t.callback=r),e=kn(l,t,s),e!==null&&(At(e,l,s,a),Xl(e,l,s)),s}function ka(e){if(e=e.current,!e.child)return null;switch(e.child.tag){case 5:return e.child.stateNode;default:return e.child.stateNode}}function Wu(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var n=e.retryLane;e.retryLane=n!==0&&n<t?n:t}}function ds(e,t){Wu(e,t),(e=e.alternate)&&Wu(e,t)}function Gd(){return null}var Hu=typeof reportError=="function"?reportError:function(e){console.error(e)};function ps(e){this._internalRoot=e}ba.prototype.render=ps.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(i(409));wa(e,t,null,null)},ba.prototype.unmount=ps.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;Jn(function(){wa(null,e,null,null)}),t[Xt]=null}};function ba(e){this._internalRoot=e}ba.prototype.unstable_scheduleHydration=function(e){if(e){var t=js();e={blockedOn:null,target:e,priority:t};for(var n=0;n<gn.length&&t!==0&&t<gn[n].priority;n++);gn.splice(n,0,e),n===0&&Ps(e)}};function fs(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function Sa(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11&&(e.nodeType!==8||e.nodeValue!==" react-mount-point-unstable "))}function Ku(){}function qd(e,t,n,r,l){if(l){if(typeof r=="function"){var a=r;r=function(){var w=ka(s);a.call(w)}}var s=Vu(t,r,e,0,null,!1,!1,"",Ku);return e._reactRootContainer=s,e[Xt]=s.current,el(e.nodeType===8?e.parentNode:e),Jn(),s}for(;l=e.lastChild;)e.removeChild(l);if(typeof r=="function"){var c=r;r=function(){var w=ka(p);c.call(w)}}var p=cs(e,0,!1,null,null,!1,!1,"",Ku);return e._reactRootContainer=p,e[Xt]=p.current,el(e.nodeType===8?e.parentNode:e),Jn(function(){wa(t,p,n,r)}),p}function Ea(e,t,n,r,l){var a=n._reactRootContainer;if(a){var s=a;if(typeof l=="function"){var c=l;l=function(){var p=ka(s);c.call(p)}}wa(t,s,e,l)}else s=qd(n,t,e,l,r);return ka(s)}Cs=function(e){switch(e.tag){case 3:var t=e.stateNode;if(t.current.memoizedState.isDehydrated){var n=Ar(t.pendingLanes);n!==0&&(Oa(t,n|1),lt(t,ke()),(ce&6)===0&&(Pr=ke()+500,_n()))}break;case 13:Jn(function(){var r=nn(e,1);if(r!==null){var l=qe();At(r,e,1,l)}}),ds(e,1)}},$a=function(e){if(e.tag===13){var t=nn(e,134217728);if(t!==null){var n=qe();At(t,e,134217728,n)}ds(e,134217728)}},Ns=function(e){if(e.tag===13){var t=Cn(e),n=nn(e,t);if(n!==null){var r=qe();At(n,e,t,r)}ds(e,t)}},js=function(){return me},Ts=function(e,t){var n=me;try{return me=e,t()}finally{me=n}},zt=function(e,t,n){switch(t){case"input":if(Bt(e,n),t=n.name,n.type==="radio"&&t!=null){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+t)+'][type="radio"]'),t=0;t<n.length;t++){var r=n[t];if(r!==e&&r.form===e.form){var l=Bl(r);if(!l)throw Error(i(90));Xe(r),Bt(r,l)}}}break;case"textarea":er(e,n);break;case"select":t=n.value,t!=null&&Ue(e,!!n.multiple,t,!1)}},Or=ls,Yt=Jn;var Xd={usingClientEntryPoint:!1,Events:[rl,vr,Bl,_l,Dr,ls]},xl={findFiberByHostInstance:Fn,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},Zd={bundleType:xl.bundleType,version:xl.version,rendererPackageName:xl.rendererPackageName,rendererConfig:xl.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:we.ReactCurrentDispatcher,findHostInstanceByFiber:function(e){return e=Ir(e),e===null?null:e.stateNode},findFiberByHostInstance:xl.findFiberByHostInstance||Gd,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var Ca=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Ca.isDisabled&&Ca.supportsFiber)try{ae=Ca.inject(Zd),X=Ca}catch{}}return at.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Xd,at.createPortal=function(e,t){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!fs(t))throw Error(i(200));return Yd(e,t,null,n)},at.createRoot=function(e,t){if(!fs(e))throw Error(i(299));var n=!1,r="",l=Hu;return t!=null&&(t.unstable_strictMode===!0&&(n=!0),t.identifierPrefix!==void 0&&(r=t.identifierPrefix),t.onRecoverableError!==void 0&&(l=t.onRecoverableError)),t=cs(e,1,!1,null,null,n,!1,r,l),e[Xt]=t.current,el(e.nodeType===8?e.parentNode:e),new ps(t)},at.findDOMNode=function(e){if(e==null)return null;if(e.nodeType===1)return e;var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(i(188)):(e=Object.keys(e).join(","),Error(i(268,e)));return e=Ir(t),e=e===null?null:e.stateNode,e},at.flushSync=function(e){return Jn(e)},at.hydrate=function(e,t,n){if(!Sa(t))throw Error(i(200));return Ea(null,e,t,!0,n)},at.hydrateRoot=function(e,t,n){if(!fs(e))throw Error(i(405));var r=n!=null&&n.hydratedSources||null,l=!1,a="",s=Hu;if(n!=null&&(n.unstable_strictMode===!0&&(l=!0),n.identifierPrefix!==void 0&&(a=n.identifierPrefix),n.onRecoverableError!==void 0&&(s=n.onRecoverableError)),t=Vu(t,null,e,1,n??null,l,!1,a,s),e[Xt]=t.current,el(e),r)for(e=0;e<r.length;e++)n=r[e],l=n._getVersion,l=l(n._source),t.mutableSourceEagerHydrationData==null?t.mutableSourceEagerHydrationData=[n,l]:t.mutableSourceEagerHydrationData.push(n,l);return new ba(t)},at.render=function(e,t,n){if(!Sa(t))throw Error(i(200));return Ea(null,e,t,!1,n)},at.unmountComponentAtNode=function(e){if(!Sa(e))throw Error(i(40));return e._reactRootContainer?(Jn(function(){Ea(null,null,e,!1,function(){e._reactRootContainer=null,e[Xt]=null})}),!0):!1},at.unstable_batchedUpdates=ls,at.unstable_renderSubtreeIntoContainer=function(e,t,n,r){if(!Sa(n))throw Error(i(200));if(e==null||e._reactInternals===void 0)throw Error(i(38));return Ea(e,t,n,!1,r)},at.version="18.3.1-next-f1338f8080-20240426",at}var ec;function sp(){if(ec)return hs.exports;ec=1;function o(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(o)}catch(u){console.error(u)}}return o(),hs.exports=op(),hs.exports}var tc;function ip(){if(tc)return Na;tc=1;var o=sp();return Na.createRoot=o.createRoot,Na.hydrateRoot=o.hydrateRoot,Na}var up=ip();function cp(){if(typeof window>"u")return!1;const o=window;return!!(o.SpeechRecognition||o.webkitSpeechRecognition)}function dp(){if(typeof window>"u")return null;const o=window;return o.SpeechRecognition??o.webkitSpeechRecognition??null}function pp(o){const u=dp();if(!u)return o.onError("Voice input is not supported in this browser."),null;let i=new u;i.continuous=!0,i.interimResults=!0;try{i.lang=navigator.language||"en-US"}catch{i.lang="en-US"}let v=!1,m="";i.onresult=h=>{var k;let z="",E="";for(let M=h.resultIndex;M<h.results.length;M++){const P=h.results[M],b=((k=P[0])==null?void 0:k.transcript)??"";P.isFinal?E+=b:z+=b}E&&(m=(m+" "+E).trim()),o.onPartial((m+" "+z).trim())},i.onerror=h=>{const z=h.error??"unknown";v||(z==="no-speech"?o.onError("Voice: silence detected. Hold the mic and speak."):z==="not-allowed"||z==="service-not-allowed"?o.onError("Voice: microphone permission denied."):z==="aborted"||o.onError(`Voice error: ${z}`))},i.onend=()=>{v||m&&o.onCommit(m)};try{i.start()}catch(h){return o.onError(h instanceof Error?h.message:"Voice failed to start."),null}return{stop:()=>{try{i==null||i.stop()}catch{}},abort:()=>{v=!0;try{i==null||i.abort()}catch{}i=null}}}function ks(){return typeof navigator>"u"||!navigator.mediaDevices?!1:typeof navigator.mediaDevices.getUserMedia=="function"&&typeof MediaRecorder<"u"}function fp(o,u,i={}){return(async()=>{if(!ks())return u.onError("Voice: this runtime does not expose MediaRecorder."),null;let v;try{v=await navigator.mediaDevices.getUserMedia({audio:!0})}catch(k){const M=k instanceof Error?k.message:"microphone unavailable";return u.onError(`Voice: microphone permission denied or device missing (${M}).`),null}let m=i.preferredMime??"audio/webm;codecs=opus";typeof MediaRecorder.isTypeSupported=="function"&&!MediaRecorder.isTypeSupported(m)&&(m=["audio/webm","audio/ogg;codecs=opus","audio/mp4"].find(P=>MediaRecorder.isTypeSupported(P))??"");const h=m?new MediaRecorder(v,{mimeType:m}):new MediaRecorder(v),z=[];let E=!1;h.addEventListener("dataavailable",k=>{k.data&&k.data.size>0&&z.push(k.data)}),h.addEventListener("stop",()=>{if(v.getTracks().forEach(M=>M.stop()),E||z.length===0)return;const k=new Blob(z,{type:m||"audio/webm"});k.arrayBuffer().then(M=>{const P=gp(M);return u.onPartial("a transcrever…"),o.transcribeAudio(P,k.type||"audio/webm",i.language)}).then(M=>{if(E)return;const P=((M==null?void 0:M.text)??"").trim();P?u.onCommit(P):u.onError("Voice: silence detected — nada para transcrever.")}).catch(M=>{if(E)return;const P=M instanceof Error?M.message:String(M);u.onError(`Voice: ${P}`)})});try{h.start()}catch(k){return v.getTracks().forEach(M=>M.stop()),u.onError(k instanceof Error?k.message:"recorder failed to start"),null}return{stop:()=>{if(h.state==="recording")try{h.stop()}catch{}},abort:()=>{if(E=!0,h.state==="recording")try{h.stop()}catch{}v.getTracks().forEach(k=>k.stop())}}})()}function gp(o){const u=new Uint8Array(o);let i="";const v=32768;for(let m=0;m<u.length;m+=v){const h=u.subarray(m,Math.min(m+v,u.length));i+=String.fromCharCode.apply(null,Array.from(h))}return btoa(i)}function mp(o){const u=[],i=o.split(`
`);let v=0,m=[];function h(){m.length!==0&&(u.push({kind:"prose",body:m.join(`
`)}),m=[])}for(;v<i.length;){const z=i[v],E=z.match(/^```(\w[\w+-]*)?\s*$/);if(E){h();const k=E[1]||null;v++;const M=v;for(;v<i.length&&!i[v].match(/^```\s*$/);)v++;const P=i.slice(M,v).join(`
`);u.push({kind:"code",lang:k,body:P}),v++;continue}m.push(z),v++}return h(),u}const hp=[[/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/,(o,u)=>d.jsx("a",{href:o[2],target:"_blank",rel:"noopener noreferrer",className:"gauntlet-md__link",children:o[1]},`a-${u}`)],[/`([^`]+)`/,(o,u)=>d.jsx("code",{className:"gauntlet-md__inline-code",children:o[1]},`c-${u}`)],[/\*\*([^*]+)\*\*/,(o,u)=>d.jsx("strong",{className:"gauntlet-md__strong",children:o[1]},`b-${u}`)],[/\*([^*]+)\*/,(o,u)=>d.jsx("em",{className:"gauntlet-md__em",children:o[1]},`i-${u}`)],[/_([^_]+)_/,(o,u)=>d.jsx("em",{className:"gauntlet-md__em",children:o[1]},`u-${u}`)]];function yl(o,u){const i=[];let v=0,m=0;for(;v<o.length;){let h=null;for(const[z,E]of hp){const M=o.slice(v).match(z);!M||M.index===void 0||(h===null||M.index<h.idx)&&(h={idx:M.index,match:M,render:E})}if(h===null){i.push(o.slice(v));break}h.idx>0&&i.push(o.slice(v,v+h.idx)),i.push(h.render(h.match,u*100+m)),m++,v+=h.idx+h.match[0].length}return i}function xp(o,u){const i=[],v=o.split(`
`);let m=0,h=u;for(;m<v.length;){const E=v[m].trim();if(!E){m++;continue}const k=E.match(/^(#{1,3})\s+(.*)$/);if(k){const P=k[1].length,U=`h${P}`;i.push(d.jsx(U,{className:`gauntlet-md__h gauntlet-md__h${P}`,children:yl(k[2],h++)},`h-${h++}`)),m++;continue}if(/^---+$/.test(E)||/^\*\*\*+$/.test(E)){i.push(d.jsx("hr",{className:"gauntlet-md__hr"},`hr-${h++}`)),m++;continue}if(E.startsWith(">")){const P=[];for(;m<v.length&&v[m].trim().startsWith(">");)P.push(v[m].replace(/^\s*>\s?/,"")),m++;i.push(d.jsx("blockquote",{className:"gauntlet-md__quote",children:yl(P.join(" "),h++)},`q-${h++}`));continue}if(/^[-*]\s+/.test(E)){const P=[];for(;m<v.length&&/^[-*]\s+/.test(v[m].trim());)P.push(v[m].trim().replace(/^[-*]\s+/,"")),m++;i.push(d.jsx("ul",{className:"gauntlet-md__list",children:P.map((b,U)=>d.jsx("li",{className:"gauntlet-md__li",children:yl(b,h++)},U))},`ul-${h++}`));continue}if(/^\d+\.\s+/.test(E)){const P=[];for(;m<v.length&&/^\d+\.\s+/.test(v[m].trim());)P.push(v[m].trim().replace(/^\d+\.\s+/,"")),m++;i.push(d.jsx("ol",{className:"gauntlet-md__list",children:P.map((b,U)=>d.jsx("li",{className:"gauntlet-md__li",children:yl(b,h++)},U))},`ol-${h++}`));continue}const M=[];for(;m<v.length;){const P=v[m],b=P.trim();if(!b||/^(#{1,3})\s+/.test(b)||/^---+$/.test(b)||/^\*\*\*+$/.test(b)||b.startsWith(">")||/^[-*]\s+/.test(b)||/^\d+\.\s+/.test(b))break;M.push(P),m++}i.push(d.jsx("p",{className:"gauntlet-md__p",children:yl(M.join(" "),h++)},`p-${h++}`))}return i}function vp({source:o,onCopyBlock:u}){const i=mp(o);return d.jsx("div",{className:"gauntlet-md",children:i.map((v,m)=>v.kind==="code"?d.jsx(jp,{lang:v.lang,body:v.body,onCopy:u},`cb-${m}`):d.jsx("div",{className:"gauntlet-md__prose",children:xp(v.body,m*1e3)},`pb-${m}`))})}const yp=new Set(["def","class","if","elif","else","for","while","return","import","from","as","with","try","except","finally","raise","pass","break","continue","in","is","not","and","or","lambda","yield","async","await","global","nonlocal","True","False","None","self","cls","print"]),_p=new Set(["function","const","let","var","if","else","return","class","export","import","from","as","default","async","await","for","while","try","catch","finally","throw","new","this","super","extends","implements","interface","type","enum","public","private","protected","readonly","static","typeof","instanceof","in","of","null","undefined","true","false","void","switch","case","break","continue","do","yield"]),wp=new Set(["cd","ls","cat","rm","mv","cp","mkdir","touch","grep","sed","awk","export","source","if","then","else","elif","fi","for","while","do","done","case","esac","exit","npm","npx","git","python","node","tsc","make","vite","wxt","set","get","start-process","select-string"]);function pc(o,u){if(o[u]!=="#")return-1;const i=o.indexOf(`
`,u);return i===-1?o.length:i}function kp(o,u){if(o[u]!=="/")return-1;if(o[u+1]==="/"){const i=o.indexOf(`
`,u);return i===-1?o.length:i}if(o[u+1]==="*"){const i=o.indexOf("*/",u+2);return i===-1?o.length:i+2}return-1}const fc={keywords:yp,matchComment:pc},bp={keywords:_p,matchComment:kp},Sp={keywords:wp,matchComment:pc};function Ep(o){if(!o)return null;const u=o.toLowerCase();return u==="py"||u==="python"||u==="python3"||u==="ipython"||u==="pycon"?fc:u==="ts"||u==="tsx"||u==="typescript"||u==="js"||u==="jsx"||u==="javascript"||u==="mjs"||u==="json"||u==="json5"?bp:u==="sh"||u==="bash"||u==="zsh"||u==="shell"||u==="powershell"||u==="ps"||u==="ps1"||u==="console"?Sp:null}function gc(o){return o>="a"&&o<="z"||o>="A"&&o<="Z"||o==="_"||o==="$"}function Cp(o){return gc(o)||o>="0"&&o<="9"}function ys(o){return o>="0"&&o<="9"}function Np(o,u){const i=[];let v="";function m(){v&&(i.push({kind:"p",text:v}),v="")}let h=0;for(;h<o.length;){const z=o[h],E=u.matchComment(o,h);if(E!==-1){m(),i.push({kind:"c",text:o.slice(h,E)}),h=E;continue}if(u===fc&&(o.startsWith('"""',h)||o.startsWith("'''",h))){m();const k=o.slice(h,h+3);let M=o.indexOf(k,h+3);M=M===-1?o.length:M+3,i.push({kind:"s",text:o.slice(h,M)}),h=M;continue}if(z==='"'||z==="'"||z==="`"){m();let k=h+1;for(;k<o.length&&o[k]!==z;){if(o[k]==="\\"){k+=2;continue}if(o[k]===`
`&&z!=="`")break;k++}const M=k<o.length?k+1:k;i.push({kind:"s",text:o.slice(h,M)}),h=M;continue}if(ys(z)){m();let k=h;for(;k<o.length&&(ys(o[k])||o[k]==="."||o[k]==="_");)k++;if(k<o.length&&(o[k]==="e"||o[k]==="E"))for(k++,k<o.length&&(o[k]==="+"||o[k]==="-")&&k++;k<o.length&&ys(o[k]);)k++;i.push({kind:"n",text:o.slice(h,k)}),h=k;continue}if(gc(z)){m();let k=h+1;for(;k<o.length&&Cp(o[k]);)k++;const M=o.slice(h,k);let P=k;for(;P<o.length&&o[P]===" ";)P++;const b=o[P]==="(";let U="p";u.keywords.has(M)?U="k":b&&(U="f"),i.push({kind:U,text:M}),h=k;continue}v+=z,h++}return m(),i}function jp({lang:o,body:u,onCopy:i}){const v=()=>{navigator.clipboard.writeText(u).catch(()=>{}),i==null||i(u)},m=Ep(o),h=m?Np(u,m):null;return d.jsxs("figure",{className:"gauntlet-md__code",children:[d.jsxs("header",{className:"gauntlet-md__code-meta",children:[d.jsx("span",{className:"gauntlet-md__code-lang",children:o??"code"}),d.jsx("button",{type:"button",className:"gauntlet-md__code-copy",onClick:v,"aria-label":"copy code",children:"copy"})]}),d.jsx("pre",{className:"gauntlet-md__code-body",children:h?d.jsx("code",{children:h.map((z,E)=>d.jsx("span",{className:`gauntlet-md__tok gauntlet-md__tok--${z.kind}`,children:z.text},E))}):d.jsx("code",{children:u})})]})}const Tp={domains:{},actions:{},default_domain_policy:{allowed:!0,require_danger_ack:!1},default_action_policy:{allowed:!0,require_danger_ack:!1},tool_policies:{},max_page_text_chars:6e3,max_dom_skeleton_chars:4e3,screenshot_default:!1,execution_reporting_required:!1,updated_at:""},zp="2px solid #d07a5a",Pp="2px",Mp="#gauntlet-capsule-host",Lp=[/\bpassword\b/i,/\bdelete\b/i,/\bdestroy\b/i,/\bremove\b/i,/\bunsubscribe\b/i,/payment|checkout|billing/i,/credit[-_ ]?card|\bccnum\b|\bcvv\b|\bcvc\b/i],Rp=["delete","remove","destroy","drop","discard","apagar","eliminar","remover","destruir","pay","buy","purchase","order","checkout","pagar","comprar","encomendar","confirm","submit","send","publish","enviar","confirmar","publicar","transfer","withdraw","transferir","levantar","cancel subscription","cancelar subscrição","cancelar assinatura"],Dp=5e3;function Op(o){const u=o.filter(h=>h.type==="fill"),i=o.filter(h=>h.type==="click");if(u.length===0||i.length===0)return{danger:!1};const v=u.find(h=>{const z=h.selector.toLowerCase();return!!(/\bpassword\b/.test(z)||/\bcvv\b|\bcvc\b|\bccnum\b|credit[-_ ]?card/.test(z)||/payment|checkout|billing/.test(z)||/cc-(number|exp|csc|name)/.test(z))});if(!v)return{danger:!1};const m=i.find(h=>{const z=h.selector.toLowerCase();return!!(z.includes("submit")||/\b(pay|buy|purchase|confirm|send|order|checkout|pagar|comprar|enviar|confirmar)\b/.test(z))});return m?{danger:!0,reason:`cadeia destrutiva: fill em "${v.selector}" seguido de click em "${m.selector}"`}:{danger:!1}}function $p(o){var v;if(o.type==="highlight"||o.type==="scroll_to")return{danger:!1};const u=o.selector;for(const m of Lp)if(m.test(u))return{danger:!0,reason:`selector matches /${m.source}/`};let i=null;try{i=document.querySelector(u)}catch{}if(o.type==="fill")return i instanceof HTMLInputElement&&i.type==="password"?{danger:!0,reason:"password field"}:i instanceof HTMLInputElement&&(((v=i.autocomplete)==null?void 0:v.includes("cc-"))??!1)?{danger:!0,reason:"credit-card autocomplete"}:o.value.length>Dp?{danger:!0,reason:"unusually long value"}:{danger:!1};if(o.type==="click"){if(i instanceof HTMLButtonElement&&i.type==="submit")return{danger:!0,reason:"submit button"};if(i instanceof HTMLInputElement&&(i.type==="submit"||i.type==="reset"))return{danger:!0,reason:`${i.type} button`};if(i instanceof HTMLElement){const m=(i.innerText??"").trim().toLowerCase();if(m){for(const h of Rp)if(m===h||m.startsWith(h+" ")||m.endsWith(" "+h)||m.includes(" "+h+" "))return{danger:!0,reason:`action label: "${h}"`}}}return{danger:!1}}return{danger:!1}}async function Ip(o){const u=[];for(const i of o)try{Ap(i),await Fp(i),u.push({action:i,ok:!0})}catch(v){u.push({action:i,ok:!1,error:v instanceof Error?v.message:String(v)})}return u}function Ap(o){const u=o.selector;if(!u||typeof u!="string")throw new Error("selector missing or not a string");if(u.includes(Mp))throw new Error(`selector targets the Gauntlet capsule itself: ${u}`);try{document.querySelector(u)}catch{throw new Error(`selector is not valid CSS: ${u}`)}}async function Fp(o){if(o.type==="fill"){Up(o.selector,o.value);return}if(o.type==="click"){Bp(o.selector);return}if(o.type==="highlight"){Vp(o.selector,o.duration_ms??1500);return}if(o.type==="scroll_to"){Wp(o.selector);return}throw new Error(`unknown action type: ${o.type??"<missing>"}`)}function Up(o,u){var v,m;const i=document.querySelector(o);if(!i)throw new Error(`selector not found: ${o}`);if(i instanceof HTMLInputElement||i instanceof HTMLTextAreaElement){i.focus({preventScroll:!0});const h=i instanceof HTMLInputElement?HTMLInputElement.prototype:HTMLTextAreaElement.prototype,z=(v=Object.getOwnPropertyDescriptor(h,"value"))==null?void 0:v.set;z?z.call(i,u):i.value=u,i.dispatchEvent(new Event("input",{bubbles:!0})),i.dispatchEvent(new Event("change",{bubbles:!0})),i.dispatchEvent(new Event("blur",{bubbles:!0}));return}if(i instanceof HTMLSelectElement){i.focus({preventScroll:!0});const h=(m=Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,"value"))==null?void 0:m.set;h?h.call(i,u):i.value=u,i.dispatchEvent(new Event("input",{bubbles:!0})),i.dispatchEvent(new Event("change",{bubbles:!0})),i.dispatchEvent(new Event("blur",{bubbles:!0}));return}if(i instanceof HTMLElement&&i.isContentEditable){i.focus(),i.textContent=u,i.dispatchEvent(new InputEvent("input",{bubbles:!0}));return}throw new Error(`element at ${o} is not fillable`)}function Bp(o){const u=document.querySelector(o);if(!u)throw new Error(`selector not found: ${o}`);if(!(u instanceof HTMLElement))throw new Error(`element at ${o} is not clickable`);const i=u.getBoundingClientRect(),v=i.left+i.width/2,m=i.top+i.height/2,h={bubbles:!0,cancelable:!0,view:window,clientX:v,clientY:m,button:0,buttons:1},z={...h,pointerId:1,pointerType:"mouse",isPrimary:!0};u.dispatchEvent(new PointerEvent("pointerdown",z)),u.dispatchEvent(new MouseEvent("mousedown",h)),u.focus({preventScroll:!0}),u.dispatchEvent(new PointerEvent("pointerup",z)),u.dispatchEvent(new MouseEvent("mouseup",h)),u.click()}function Vp(o,u){const i=document.querySelectorAll(o);if(i.length===0)throw new Error(`selector not found: ${o}`);for(const v of Array.from(i)){if(!(v instanceof HTMLElement))continue;const m=v.style.outline,h=v.style.outlineOffset;v.style.outline=zp,v.style.outlineOffset=Pp,window.setTimeout(()=>{v.style.outline=m,v.style.outlineOffset=h},u)}}function Wp(o){const u=document.querySelector(o);if(!u)throw new Error(`selector not found: ${o}`);if(!(u instanceof HTMLElement))throw new Error(`element at ${o} cannot be scrolled to`);u.scrollIntoView({behavior:"smooth",block:"center"})}const _s={},Hp="https://ruberra-backend-jkpf-production.up.railway.app",Kp=typeof import.meta<"u"?_s==null?void 0:_s.VITE_BACKEND_URL:void 0,Qp=(Kp??Hp).replace(/\/+$/,"");class Jp{constructor(u,i={}){this.ambient=u,this.backendUrl=(i.backendUrl??Qp).replace(/\/+$/,"")}captureContext(u,i){return this.ambient.transport.fetchJson("POST",`${this.backendUrl}/composer/context`,u,i)}detectIntent(u,i,v){return this.ambient.transport.fetchJson("POST",`${this.backendUrl}/composer/intent`,{context_id:u,user_input:i},v)}generatePreview(u,i){return this.ambient.transport.fetchJson("POST",`${this.backendUrl}/composer/preview`,{intent_id:u},i)}applyPreview(u,i,v,m){return this.ambient.transport.fetchJson("POST",`${this.backendUrl}/composer/apply`,{preview_id:u,approved:i,approval_reason:v??null},m)}async getToolManifests(u){return(await this.ambient.transport.fetchJson("GET",`${this.backendUrl}/tools/manifests`,void 0,u)).tools??[]}getSettings(u){return this.ambient.transport.fetchJson("GET",`${this.backendUrl}/composer/settings`,void 0,u)}updateSettings(u,i){return this.ambient.transport.fetchJson("PUT",`${this.backendUrl}/composer/settings`,u,i)}reportExecution(u,i){return this.ambient.transport.fetchJson("POST",`${this.backendUrl}/composer/execution`,u,i)}transcribeAudio(u,i,v,m){return this.ambient.transport.fetchJson("POST",`${this.backendUrl}/voice/transcribe`,{audio_base64:u,mime:i,language:v},m)}synthesizeSpeech(u,i,v){return this.ambient.transport.fetchJson("POST",`${this.backendUrl}/voice/synthesize`,{text:u,voice:i},v)}requestDomPlan(u,i,v){return this.ambient.transport.fetchJson("POST",`${this.backendUrl}/composer/dom_plan`,{context_id:u,user_input:i},v)}requestDomPlanStream(u,i,v){return this.ambient.transport.stream?this.ambient.transport.stream(`${this.backendUrl}/composer/dom_plan_stream`,{context_id:u,user_input:i},v):(v.onError("streaming not supported by this ambient"),()=>{})}}const nc="gauntlet:pill_position",ws="gauntlet:dismissed_domains",rc="gauntlet:screenshot_enabled",lc="gauntlet:theme",ac="gauntlet:palette_recent",oc="gauntlet:pill_mode",sc="gauntlet:tts_enabled",ic=8,mc="light",Yp="corner",Gp={bottom:16,right:16};function uc(o){const u=typeof window<"u"?window.innerWidth:1280,i=typeof window<"u"?window.innerHeight:800,v=4,m=u-v,h=i-v;return{right:Math.max(-14,Math.min(m,o.right)),bottom:Math.max(-14,Math.min(h,o.bottom))}}function qp(o){return{async readPillPosition(){const u=await o.get(nc);return u&&typeof u=="object"&&typeof u.bottom=="number"&&typeof u.right=="number"?uc(u):Gp},async writePillPosition(u){await o.set(nc,uc(u))},async readDismissedDomains(){const u=await o.get(ws);return Array.isArray(u)?u.filter(i=>typeof i=="string"):[]},async dismissDomain(u){if(!u)return;const i=await this.readDismissedDomains();i.includes(u)||await o.set(ws,[...i,u])},async restoreDomain(u){if(!u)return;const i=await this.readDismissedDomains(),v=i.filter(m=>m!==u);v.length!==i.length&&await o.set(ws,v)},async isDomainDismissed(u){return u?(await this.readDismissedDomains()).includes(u):!1},async readScreenshotEnabled(){return await o.get(rc)===!0},async writeScreenshotEnabled(u){await o.set(rc,!!u)},async readTheme(){const u=await o.get(lc);return u==="dark"||u==="light"?u:mc},async writeTheme(u){await o.set(lc,u)},async readPaletteRecent(){const u=await o.get(ac);return Array.isArray(u)?u.filter(i=>typeof i=="string").slice(0,ic):[]},async notePaletteUse(u){if(!u)return;const i=await this.readPaletteRecent(),v=[u,...i.filter(m=>m!==u)].slice(0,ic);await o.set(ac,v)},async readPillMode(){const u=await o.get(oc);return u==="cursor"||u==="corner"?u:Yp},async writePillMode(u){await o.set(oc,u)},async readTtsEnabled(){return await o.get(sc)===!0},async writeTtsEnabled(u){await o.set(sc,!!u)}}}function Xp({ambient:o,initialSnapshot:u,onDismiss:i,cursorAnchor:v}){var ke,bl,cr;const m=j.useMemo(()=>new Jp(o),[o]),h=j.useMemo(()=>qp(o.storage),[o]),z=(ke=o.domActions)==null?void 0:ke.execute,[E,k]=j.useState(u),[M,P]=j.useState(""),[b,U]=j.useState("idle"),[fe,re]=j.useState(null),[te,le]=j.useState(!1),[R,Me]=j.useState(null),[Te,we]=j.useState(null),[Y,pe]=j.useState(!1),[ze,De]=j.useState(""),[Ct,gt]=j.useState(!1),[Ft,ot]=j.useState(mc),[Ye,st]=j.useState([]),[mt,Fe]=j.useState([]),[ve,O]=j.useState(0),[Q,A]=j.useState(!1),x=j.useRef(!1),C=j.useRef(null),[Z,ee]=j.useState(!1),oe=j.useRef(""),[se,he]=j.useState(null),[ie,ge]=j.useState([]),[We,ht]=j.useState(null),[Xe,Xn]=j.useState(Tp),Nt=j.useRef(null),Zn=j.useRef(null),Ut=j.useRef(null),Bt=j.useRef(""),Pn=j.useRef(!1),[Lr,on]=j.useState(0),Ue=j.useRef(null),[sn,Qt]=j.useState(!1),[er,Oe]=j.useState(!1),[tr,nr]=j.useState(null),[Jt,un]=j.useState(0),jt=j.useMemo(()=>R?R.actions.map($p):[],[R]),xt=j.useMemo(()=>R?Op(R.actions):{danger:!1},[R]),rr=j.useMemo(()=>{if(!R||R.actions.length===0)return{forced:!1,reason:null};let f="";try{f=new URL(E.url).hostname.toLowerCase()}catch{}if((Xe.domains[f]??Xe.default_domain_policy).require_danger_ack)return{forced:!0,reason:f?`policy: domain '${f}' requires explicit confirmation`:"policy: default domain policy requires explicit confirmation"};for(const $ of R.actions)if((Xe.actions[$.type]??Xe.default_action_policy).require_danger_ack)return{forced:!0,reason:`policy: action type '${$.type}' requires explicit confirmation`};return{forced:!1,reason:null}},[R,E.url,Xe]),Tt=jt.some(f=>f.danger)||xt.danger||rr.forced;j.useEffect(()=>{var f;return(f=Nt.current)==null||f.focus(),()=>{var S,$;(S=Zn.current)==null||S.abort(),($=Ut.current)==null||$.call(Ut)}},[]),j.useEffect(()=>{k(u)},[u]),j.useEffect(()=>{let f=!1;return m.getToolManifests().then(S=>{f||st(S)}).catch(()=>{}),h.readPaletteRecent().then(S=>{f||Fe(S)}),()=>{f=!0}},[m,h]),j.useEffect(()=>{const f=!!E.text;f&&!x.current&&(A(!0),C.current!==null&&window.clearTimeout(C.current),C.current=window.setTimeout(()=>{A(!1),C.current=null},700)),x.current=f},[E.text]),j.useEffect(()=>()=>{C.current!==null&&(window.clearTimeout(C.current),C.current=null)},[]),j.useEffect(()=>{let f=!1;h.readTtsEnabled().then($=>{f||ee($)});function S($){const G=$.detail;typeof(G==null?void 0:G.enabled)=="boolean"&&ee(G.enabled)}return window.addEventListener("gauntlet:tts",S),()=>{f=!0,window.removeEventListener("gauntlet:tts",S)}},[h]),j.useEffect(()=>{if(!Z||b!=="plan_ready")return;const f=R==null?void 0:R.compose;if(f&&f!==oe.current&&!(typeof window>"u"||!window.speechSynthesis))try{window.speechSynthesis.cancel();const S=new SpeechSynthesisUtterance(f);S.rate=1.05,S.pitch=1,window.speechSynthesis.speak(S),oe.current=f}catch{}},[Z,b,R==null?void 0:R.compose]),j.useEffect(()=>()=>{var f;try{(f=window.speechSynthesis)==null||f.cancel()}catch{}},[]),j.useEffect(()=>{let f=!1;return h.readTheme().then(S=>{f||ot(S)}),()=>{f=!0}},[h]),j.useEffect(()=>{let f=!1;return m.getSettings().then(S=>{f||Xn(S)}).catch(()=>{}),()=>{f=!0}},[m]),j.useEffect(()=>{if(!o.capabilities.screenshot||!o.screenshot)return;let f=!1;return h.readScreenshotEnabled().then(S=>{const $=S||Xe.screenshot_default;f||!$||o.screenshot.capture().then(G=>{f||!G||he(G)}).catch(()=>{})}),()=>{f=!0}},[o,h,Xe.screenshot_default]);const Rr=j.useCallback(()=>{k(o.selection.read())},[o]),Ta=j.useCallback(()=>{if(Ue.current)return;re(null);const f=M,S={onPartial:G=>{P(f?`${f} ${G}`.trim():G)},onCommit:G=>{var ae;P(f?`${f} ${G}`.trim():G),Qt(!1),Ue.current=null,(ae=Nt.current)==null||ae.focus()},onError:G=>{re(G),Qt(!1),Ue.current=null}};if(o.capabilities.remoteVoice&&ks()){Qt(!0),fp(m,S).then(G=>{G?Ue.current=G:Qt(!1)});return}const $=pp(S);$&&(Ue.current=$,Qt(!0))},[M,o,m]),lr=j.useCallback(()=>{var f;(f=Ue.current)==null||f.stop()},[]),ar=j.useCallback(()=>{var f;(f=Ue.current)==null||f.abort(),Ue.current=null,Qt(!1)},[]);j.useEffect(()=>()=>{var f;(f=Ue.current)==null||f.abort()},[]),j.useEffect(()=>{function f(S){(S.metaKey||S.ctrlKey)&&(S.key==="k"||S.key==="K")&&(S.preventDefault(),S.stopPropagation(),Oe(G=>!G))}return window.addEventListener("keydown",f,!0),()=>window.removeEventListener("keydown",f,!0)},[]);const Mn=j.useCallback(f=>{nr(f),window.setTimeout(()=>nr(null),1400)},[]),or=j.useCallback(async()=>{const f=(R==null?void 0:R.compose)||E.text||M.trim();if(!f){re("Nada para guardar — escreve um pedido ou recebe uma resposta.");return}const S=(M.trim()||E.pageTitle||"cápsula note").slice(0,200);try{await o.transport.fetchJson("POST",`${m.backendUrl}/memory/records`,{topic:S,body:f,kind:"note",scope:"user"}),Mn("saved")}catch($){re($ instanceof Error?`memória: ${$.message}`:"memória: falhou")}},[o,m,R,E,M,Mn]),zt=j.useCallback(async(f,S=[],$)=>{if(!R||R.actions.length===0)return;Pn.current=!0;const G=R.actions.map((X,Ze)=>{const J=S[Ze],ue=jt[Ze];return{action:X,ok:J?J.ok:!1,error:(J==null?void 0:J.error)??null,danger:(ue==null?void 0:ue.danger)??!1,danger_reason:(ue==null?void 0:ue.reason)??null}}),ae={plan_id:R.plan_id||null,context_id:R.context_id||null,url:E.url||null,page_title:E.pageTitle||null,status:f,results:G,has_danger:Tt,sequence_danger_reason:xt.danger?xt.reason??null:null,danger_acknowledged:Y,error:$??null,model_used:R.model_used||null,plan_latency_ms:R.latency_ms||null,user_input:M.trim()||null};if(Xe.execution_reporting_required)try{await m.reportExecution(ae)}catch(X){const Ze=X instanceof Error?X.message:String(X);re(`policy: execution report rejected — ${Ze}`),U("error")}else m.reportExecution(ae).catch(()=>{})},[m,R,E,jt,Tt,xt,Y,M,Xe.execution_reporting_required]),it=j.useCallback(()=>{R&&R.actions.length>0&&!Pn.current&&zt("rejected"),i()},[R,i,zt]);j.useEffect(()=>{function f(S){if(S.key==="Escape"){if(S.preventDefault(),S.stopPropagation(),er){Oe(!1);return}if(Ue.current){ar();return}it()}}return window.addEventListener("keydown",f,!0),()=>window.removeEventListener("keydown",f,!0)},[it,er,ar]);const Pt=j.useCallback(async()=>{const f=o.filesystem;if(f){ht(null);try{const S=await f.pickFile();if(!S)return;const $=S.name.toLowerCase();if(/\.(png|jpe?g|gif|webp|svg)$/.test($)){const{base64:ae,mime:X}=await f.readFileBase64(S.path),Ze=Math.ceil(ae.length*3/4);ge(J=>[...J,{id:`att-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,kind:"image",name:S.name,mime:X,bytes:Ze,base64:ae,path:S.path}])}else{const ae=await f.readTextFile(S.path);ge(X=>[...X,{id:`att-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,kind:"text",name:S.name,mime:"text/plain",bytes:new TextEncoder().encode(ae).length,text:ae,path:S.path}])}}catch(S){ht(S instanceof Error?S.message:String(S))}}},[o]),Ln=j.useCallback(async()=>{var S;const f=(S=o.screenshot)==null?void 0:S.captureScreen;if(f){ht(null);try{const $=await f();if(!$){ht("Captura de ecrã indisponível neste sistema.");return}const G=Math.ceil($.base64.length*3/4);ge(ae=>[...ae,{id:`att-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,kind:"image",name:`ecrã-${new Date().toISOString().slice(11,19)}.png`,mime:"image/png",bytes:G,base64:$.base64,path:$.path}])}catch($){ht($ instanceof Error?$.message:String($))}}},[o]),_l=j.useCallback(f=>{ge(S=>S.filter($=>$.id!==f))},[]),[Dr,Or]=j.useState(null),[Yt,Rn]=j.useState(!1),[Dn,On]=j.useState(""),[ut,Gt]=j.useState(null),[$r,cn]=j.useState(!1),$n=j.useCallback(async()=>{const f=o.shellExec;if(!f)return;const S=Dn.trim();if(!S)return;const $=S.split(/\s+/),G=$[0],ae=$.slice(1);cn(!0),Gt(null);try{const X=await f.run(G,ae);Gt({cmd:S,stdout:X.stdout,stderr:X.stderr,exitCode:X.exitCode,durationMs:X.durationMs})}catch(X){Gt({cmd:S,stdout:"",stderr:X instanceof Error?X.message:String(X),exitCode:null,durationMs:0})}finally{cn(!1)}},[o,Dn]),qt=j.useCallback(async()=>{const f=o.filesystem;if(!(f!=null&&f.pickSavePath)||!f.writeTextFile)return;const S=(R==null?void 0:R.compose)??"";if(S.trim()){ht(null);try{const G=`${(E.pageTitle||"gauntlet-compose").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,60)||"gauntlet-compose"}.md`,ae=await f.pickSavePath(G,["md","txt","json"]);if(!ae)return;const X=await f.writeTextFile(ae,S);Or(`${ae.split(/[\\/]/).pop()??"ficheiro"} (${X<1024?`${X} B`:`${Math.round(X/1024)} KB`})`),window.setTimeout(()=>Or(null),2500)}catch($){ht($ instanceof Error?$.message:String($))}}},[o,R,E.pageTitle]),sr=j.useCallback(f=>{if(ie.length===0)return f;const S=[];for(const $ of ie)if($.kind==="text"&&$.text!=null)S.push(`<file name="${$.name}" path="${$.path??""}">
${$.text}
</file>`);else if($.kind==="image"){const G=Math.max(1,Math.round($.bytes/1024));S.push(`<image name="${$.name}" bytes="${$.bytes}" mime="${$.mime}">[${G} KB image attached — describe in prompt; multimodal payload arrives in A2]</image>`)}return`${S.join(`

`)}

${f}`},[ie]),ir=j.useCallback(async()=>{var G,ae;if(!M.trim()||b==="planning"||b==="streaming"||b==="executing")return;R&&R.actions.length>0&&!Pn.current&&zt("rejected"),(G=Zn.current)==null||G.abort(),(ae=Ut.current)==null||ae.call(Ut);const f=new AbortController;Zn.current=f,U("planning"),re(null),Me(null),we(null),pe(!1),le(!1),De(""),on(0),Bt.current="",Pn.current=!1;const S=await h.readScreenshotEnabled(),$=lf(E,S?se:null);try{const X=await m.captureContext($,f.signal);if(f.signal.aborted)return;const Ze=sr(M.trim());Ut.current=m.requestDomPlanStream(X.context_id,Ze,{onDelta:J=>{if(f.signal.aborted)return;Bt.current+=J,on(Ce=>Ce+1);const ue=rf(Bt.current);ue!==null?(De(ue),U(Ce=>Ce==="planning"?"streaming":Ce)):U(Ce=>Ce==="planning"?"streaming":Ce)},onDone:J=>{f.signal.aborted||(Me(J),U("plan_ready"),De(""),Bt.current="")},onError:J=>{f.signal.aborted||(async()=>{try{const ue=await m.requestDomPlan(X.context_id,Ze,f.signal);if(f.signal.aborted)return;Me(ue),U("plan_ready"),De(""),Bt.current=""}catch(ue){if(f.signal.aborted)return;const Ce=ue instanceof Error?ue.message:String(ue);re(`stream: ${J} · fallback: ${Ce}`),U("error"),De(""),Bt.current=""}})()}})}catch(X){if(f.signal.aborted)return;re(X instanceof Error?X.message:String(X)),U("error")}},[m,E,se,M,b,R,zt,sr,h]),za=j.useCallback(f=>{var S;f.preventDefault(),O($=>$+1);try{(S=window.speechSynthesis)==null||S.cancel()}catch{}oe.current="",ir()},[ir]),Mt=j.useMemo(()=>M.startsWith("/")?M.split(`
`,1)[0].slice(1).toLowerCase():null,[M]),Lt=j.useMemo(()=>{var S,$;const f=[];return o.capabilities.filesystemRead&&o.filesystem&&f.push({id:"anexar",label:"/anexar",hint:"Anexar ficheiro local",run:()=>void Pt()}),o.capabilities.screenCapture&&((S=o.screenshot)!=null&&S.captureScreen)&&f.push({id:"ecra",label:"/ecrã",hint:"Capturar ecrã inteiro",run:()=>void Ln()}),o.capabilities.shellExecute&&o.shellExec&&f.push({id:"shell",label:"/shell",hint:Yt?"Fechar shell rápida":"Abrir shell rápida",run:()=>Rn(G=>!G)}),o.capabilities.filesystemWrite&&(($=o.filesystem)!=null&&$.writeTextFile)&&(R!=null&&R.compose)&&f.push({id:"guardar",label:"/guardar",hint:"Guardar resposta para ficheiro",run:()=>void qt()}),f.push({id:"limpar",label:"/limpar",hint:"Esvaziar input",run:()=>{var G;P(""),(G=Nt.current)==null||G.focus()}}),f.push({id:"fechar",label:"/fechar",hint:"Dispensar cápsula",run:()=>it()}),f.push({id:"palette",label:"/palette",hint:"Abrir command palette completa (⌘K)",run:()=>{P(""),Oe(!0)}}),f},[o,Pt,Ln,it,R,qt,Yt]),vt=j.useMemo(()=>Mt===null?[]:Mt===""?Lt:Lt.filter(f=>f.id.startsWith(Mt)||f.label.includes(Mt)),[Lt,Mt]);j.useEffect(()=>{un(0)},[Mt]);const ur=j.useCallback(f=>{const S=vt[f];S&&(P(""),un(0),S.run())},[vt]),Pa=j.useCallback(f=>{if(Mt!==null&&vt.length>0){if(f.key==="ArrowDown"){f.preventDefault(),un(S=>(S+1)%vt.length);return}if(f.key==="ArrowUp"){f.preventDefault(),un(S=>(S-1+vt.length)%vt.length);return}if(f.key==="Enter"&&!f.shiftKey){f.preventDefault(),ur(Jt);return}if(f.key==="Escape"){f.preventDefault(),P("");return}}f.key==="Enter"&&(f.shiftKey||(f.preventDefault(),ir()))},[ir,ur,Jt,vt,Mt]),Ir=j.useCallback(async()=>{if(R!=null&&R.compose)try{await navigator.clipboard.writeText(R.compose),le(!0),window.setTimeout(()=>le(!1),1500)}catch{re("Clipboard write blocked. Select the text and copy manually.")}},[R]),wl=j.useCallback(async()=>{if(!(!z||!R||R.actions.length===0)&&!(Tt&&!Y)){U("executing"),re(null);try{const f=await z(R.actions);we(f),U("executed");const S=f.every($=>$.ok);window.dispatchEvent(new CustomEvent("gauntlet:execute-result",{detail:{ok:S}})),await zt("executed",f)}catch(f){const S=f instanceof Error?f.message:String(f);re(S),U("error"),window.dispatchEvent(new CustomEvent("gauntlet:execute-result",{detail:{ok:!1}})),await zt("failed",[],S)}}},[z,R,Tt,Y,zt]),In=j.useMemo(()=>E.bbox?E.bbox:v?{x:v.x,y:v.y,width:0,height:0}:null,[E.bbox,v]),kl=j.useMemo(()=>{if(!In)return;const f=typeof window<"u"?window.innerWidth:1280,S=typeof window<"u"?window.innerHeight:800,$=of(f,S),G=sf(In,{width:f,height:S},$);return{top:`${G.top}px`,left:`${G.left}px`}},[In]),Ma=`gauntlet-capsule--phase-${b}`,La=["gauntlet-capsule","gauntlet-capsule--floating",In?"gauntlet-capsule--anchored":"gauntlet-capsule--centered",E.text?null:"gauntlet-capsule--no-selection",Ma].filter(Boolean).join(" ");return j.useEffect(()=>{window.dispatchEvent(new CustomEvent("gauntlet:phase",{detail:{phase:b}}))},[b]),d.jsxs("div",{className:La,"data-theme":Ft,role:"dialog","aria-label":"Gauntlet",style:kl,children:[d.jsx("div",{className:"gauntlet-capsule__aurora","aria-hidden":!0}),d.jsxs("div",{className:"gauntlet-capsule__layout",children:[d.jsxs("div",{className:"gauntlet-capsule__panel gauntlet-capsule__panel--left",children:[d.jsxs("header",{className:"gauntlet-capsule__header",children:[d.jsxs("div",{className:"gauntlet-capsule__brand-block",children:[d.jsx("span",{className:"gauntlet-capsule__mark","aria-hidden":!0,children:d.jsx("span",{className:"gauntlet-capsule__mark-dot"})}),d.jsxs("div",{className:"gauntlet-capsule__brand-text",children:[d.jsx("span",{className:"gauntlet-capsule__brand",children:"GAUNTLET"}),d.jsx("span",{className:"gauntlet-capsule__tagline",children:"cursor · capsule"})]})]}),d.jsxs("div",{className:"gauntlet-capsule__header-actions",children:[d.jsx("button",{type:"button",className:"gauntlet-capsule__settings-btn",onClick:()=>gt(f=>!f),"aria-label":"Definições","aria-expanded":Ct,title:"Definições",children:d.jsx("span",{"aria-hidden":!0,children:"···"})}),d.jsx("button",{type:"button",className:"gauntlet-capsule__close",onClick:it,"aria-label":"Dismiss capsule (Esc)",children:d.jsx("span",{"aria-hidden":!0,children:"esc"})})]})]}),Ct&&d.jsx(nf,{onClose:()=>gt(!1),showScreenshot:o.capabilities.screenshot,showDismissedDomains:o.capabilities.dismissDomain,showPillMode:o.capabilities.pillSurface,prefs:h,theme:Ft,onChangeTheme:f=>{ot(f),h.writeTheme(f)}}),d.jsxs("section",{className:"gauntlet-capsule__context",children:[d.jsxs("div",{className:"gauntlet-capsule__context-meta",children:[d.jsx("span",{className:`gauntlet-capsule__source${Q?" gauntlet-capsule__source--popped":""}`,children:"browser"}),d.jsx("span",{className:"gauntlet-capsule__url",title:E.url,children:E.pageTitle||E.url}),d.jsx("button",{type:"button",className:"gauntlet-capsule__refresh",onClick:Rr,title:"Re-read current selection",children:"re-read"})]}),E.text?d.jsx("pre",{className:"gauntlet-capsule__selection",children:hc(E.text,600)}):d.jsx(tf,{snapshot:E,screenshotEnabled:se!==null})]})]}),d.jsxs("div",{className:"gauntlet-capsule__panel gauntlet-capsule__panel--right",children:[d.jsxs("form",{className:"gauntlet-capsule__form",onSubmit:za,children:[ie.length>0&&d.jsx("div",{className:"gauntlet-capsule__attachments","aria-label":"Anexos",children:ie.map(f=>d.jsxs("span",{className:`gauntlet-capsule__attachment gauntlet-capsule__attachment--${f.kind}`,title:f.path??f.name,children:[d.jsx("span",{className:"gauntlet-capsule__attachment-icon","aria-hidden":!0,children:f.kind==="image"?"◫":"⌥"}),d.jsx("span",{className:"gauntlet-capsule__attachment-name",children:f.name}),d.jsx("span",{className:"gauntlet-capsule__attachment-size",children:f.bytes<1024?`${f.bytes} B`:f.bytes<1024*1024?`${Math.round(f.bytes/1024)} KB`:`${(f.bytes/(1024*1024)).toFixed(1)} MB`}),d.jsx("button",{type:"button",className:"gauntlet-capsule__attachment-remove",onClick:()=>_l(f.id),"aria-label":`Remover ${f.name}`,children:"×"})]},f.id))}),We&&d.jsx("div",{className:"gauntlet-capsule__attach-error",role:"alert",children:We}),Yt&&o.shellExec&&d.jsxs("div",{className:"gauntlet-capsule__shell-panel",children:[d.jsxs("div",{className:"gauntlet-capsule__shell-row",children:[d.jsx("span",{className:"gauntlet-capsule__shell-prompt","aria-hidden":!0,children:"$"}),d.jsx("input",{type:"text",className:"gauntlet-capsule__shell-input",placeholder:"git status — comandos da allowlist",value:Dn,onChange:f=>On(f.target.value),onKeyDown:f=>{f.key==="Enter"&&!f.shiftKey&&(f.preventDefault(),$n())},disabled:$r,spellCheck:!1,autoComplete:"off"}),d.jsx("button",{type:"button",className:"gauntlet-capsule__shell-run",onClick:()=>void $n(),disabled:$r||!Dn.trim(),children:$r?"…":"Executar"})]}),ut&&d.jsxs("div",{className:"gauntlet-capsule__shell-output",children:[d.jsxs("div",{className:"gauntlet-capsule__shell-meta",children:[d.jsxs("span",{className:"gauntlet-capsule__shell-meta-cmd",children:["$ ",ut.cmd]}),d.jsxs("span",{className:"gauntlet-capsule__shell-meta-stat",children:[ut.exitCode===null?"erro":`exit ${ut.exitCode}`," · ",ut.durationMs," ms"]})]}),ut.stdout&&d.jsx("pre",{className:"gauntlet-capsule__shell-stdout",children:ut.stdout}),ut.stderr&&d.jsx("pre",{className:"gauntlet-capsule__shell-stderr",children:ut.stderr})]})]}),Mt!==null&&vt.length>0&&d.jsx("div",{className:"gauntlet-capsule__slash",role:"listbox",children:vt.map((f,S)=>d.jsxs("button",{type:"button",role:"option","aria-selected":S===Jt,className:`gauntlet-capsule__slash-item${S===Jt?" gauntlet-capsule__slash-item--active":""}`,onMouseEnter:()=>un(S),onClick:()=>ur(S),children:[d.jsx("span",{className:"gauntlet-capsule__slash-label",children:f.label}),d.jsx("span",{className:"gauntlet-capsule__slash-hint",children:f.hint})]},f.id))}),d.jsx("textarea",{ref:Nt,className:"gauntlet-capsule__input",placeholder:"O que queres? / abre comandos · Enter envia · Shift+Enter nova linha",value:M,onChange:f=>P(f.target.value),onKeyDown:Pa,rows:2,disabled:b==="planning"||b==="streaming"||b==="executing"}),d.jsxs("div",{className:"gauntlet-capsule__actions",children:[d.jsxs("span",{className:"gauntlet-capsule__hint","aria-hidden":!0,children:[d.jsx("span",{className:"gauntlet-capsule__kbd",children:"↵"}),d.jsx("span",{className:"gauntlet-capsule__kbd-sep",children:"·"}),d.jsx("span",{className:"gauntlet-capsule__kbd",children:"⌘K"})]}),o.capabilities.filesystemRead&&o.filesystem&&d.jsxs("button",{type:"button",className:"gauntlet-capsule__attach-btn",onClick:()=>void Pt(),"aria-label":"Anexar ficheiro local",title:"Anexar ficheiro do disco",disabled:b==="planning"||b==="streaming"||b==="executing",children:[d.jsx("svg",{viewBox:"0 0 24 24",width:"13",height:"13","aria-hidden":!0,children:d.jsx("path",{d:"M14 4l-2 0 0 8-3 0 4 5 4-5-3 0 0-8z",transform:"rotate(45 12 12)",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinejoin:"round"})}),d.jsx("span",{className:"gauntlet-capsule__attach-label",children:"anexar"})]}),o.capabilities.screenCapture&&((bl=o.screenshot)==null?void 0:bl.captureScreen)&&d.jsxs("button",{type:"button",className:"gauntlet-capsule__attach-btn",onClick:()=>void Ln(),"aria-label":"Capturar ecrã inteiro",title:"Capturar ecrã inteiro",disabled:b==="planning"||b==="streaming"||b==="executing",children:[d.jsxs("svg",{viewBox:"0 0 24 24",width:"13",height:"13","aria-hidden":!0,children:[d.jsx("rect",{x:"3",y:"5",width:"18",height:"13",rx:"2",fill:"none",stroke:"currentColor",strokeWidth:"1.6"}),d.jsx("circle",{cx:"12",cy:"11.5",r:"2.4",fill:"none",stroke:"currentColor",strokeWidth:"1.6"})]}),d.jsx("span",{className:"gauntlet-capsule__attach-label",children:"ecrã"})]}),o.capabilities.shellExecute&&o.shellExec&&d.jsxs("button",{type:"button",className:`gauntlet-capsule__attach-btn${Yt?" gauntlet-capsule__attach-btn--active":""}`,onClick:()=>Rn(f=>!f),"aria-label":"Shell rápida",title:"Shell rápida (allowlist + GAUNTLET_ALLOW_CODE_EXEC)","aria-expanded":Yt,children:[d.jsx("svg",{viewBox:"0 0 24 24",width:"13",height:"13","aria-hidden":!0,children:d.jsx("path",{d:"M5 7l4 4-4 4M11 16h7",stroke:"currentColor",strokeWidth:"1.7",fill:"none",strokeLinecap:"round",strokeLinejoin:"round"})}),d.jsx("span",{className:"gauntlet-capsule__attach-label",children:"shell"})]}),(cp()||o.capabilities.remoteVoice&&ks())&&d.jsxs("button",{type:"button",className:`gauntlet-capsule__voice${sn?" gauntlet-capsule__voice--active":""}`,onPointerDown:f=>{f.preventDefault(),Ta()},onPointerUp:()=>lr(),onPointerLeave:()=>{sn&&lr()},"aria-label":sn?"A ouvir — solta para enviar":"Premer e falar",title:"Premir e falar",disabled:b==="planning"||b==="streaming"||b==="executing",children:[d.jsxs("svg",{viewBox:"0 0 24 24",width:"13",height:"13","aria-hidden":!0,children:[d.jsx("path",{d:"M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3z",fill:"currentColor"}),d.jsx("path",{d:"M19 11a7 7 0 0 1-14 0M12 18v3",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",fill:"none"})]}),d.jsx("span",{className:"gauntlet-capsule__voice-label",children:sn?"a ouvir":"voz"})]}),d.jsxs("button",{type:"submit",className:"gauntlet-capsule__compose",disabled:b==="planning"||b==="streaming"||b==="executing"||!M.trim(),children:[ve>0&&d.jsx("span",{className:"gauntlet-capsule__compose-ripple","aria-hidden":!0},ve),b==="planning"||b==="streaming"?d.jsxs(d.Fragment,{children:[d.jsx("span",{className:"gauntlet-capsule__compose-spinner","aria-hidden":!0}),d.jsx("span",{children:b==="planning"?"a pensar":"a escrever"})]}):"Enviar"]})]})]}),b==="streaming"&&ze&&d.jsxs("section",{className:"gauntlet-capsule__compose-result gauntlet-capsule__compose-result--streaming",children:[d.jsxs("header",{className:"gauntlet-capsule__compose-meta",children:[d.jsx("span",{className:"gauntlet-capsule__compose-tag",children:"resposta"}),d.jsxs("span",{className:"gauntlet-capsule__compose-meta-text",children:[d.jsxs("span",{className:"gauntlet-capsule__token-counter","aria-live":"polite",children:[Lr," chunks"]}),d.jsx("span",{"aria-hidden":!0,children:"·"}),d.jsx("span",{children:"a escrever…"})]})]}),d.jsxs("div",{className:"gauntlet-capsule__compose-text gauntlet-capsule__compose-text--streaming",children:[ze,d.jsx("span",{className:"gauntlet-capsule__compose-caret","aria-hidden":!0,children:"▍"})]})]}),(b==="planning"||b==="streaming"&&!ze)&&d.jsxs("section",{className:"gauntlet-capsule__skeleton",role:"status","aria-live":"polite","aria-label":"A pensar...",children:[d.jsxs("header",{className:"gauntlet-capsule__skeleton-header",children:[d.jsx("span",{className:"gauntlet-capsule__skeleton-tag"}),d.jsx("span",{className:"gauntlet-capsule__skeleton-meta"})]}),d.jsx("div",{className:"gauntlet-capsule__skeleton-line gauntlet-capsule__skeleton-line--w90"}),d.jsx("div",{className:"gauntlet-capsule__skeleton-line gauntlet-capsule__skeleton-line--w75"}),d.jsx("div",{className:"gauntlet-capsule__skeleton-line gauntlet-capsule__skeleton-line--w55"})]}),(R==null?void 0:R.compose)&&b==="plan_ready"&&d.jsxs("section",{className:"gauntlet-capsule__compose-result",children:[d.jsxs("header",{className:"gauntlet-capsule__compose-meta",children:[d.jsx("span",{className:"gauntlet-capsule__compose-tag",children:"resposta"}),d.jsxs("span",{className:"gauntlet-capsule__compose-meta-text",children:[R.model_used," · ",R.latency_ms," ms"]})]}),d.jsx("div",{className:"gauntlet-capsule__compose-text",children:d.jsx(vp,{source:R.compose,onCopyBlock:()=>Mn("code copied")})}),d.jsxs("div",{className:"gauntlet-capsule__compose-actions",children:[d.jsx("button",{type:"button",className:"gauntlet-capsule__copy",onClick:()=>void Ir(),children:te?"copiado ✓":"Copy"}),d.jsx("button",{type:"button",className:"gauntlet-capsule__copy gauntlet-capsule__copy--ghost",onClick:()=>void or(),children:tr==="saved"?"guardado ✓":"Save"}),o.capabilities.filesystemWrite&&((cr=o.filesystem)==null?void 0:cr.writeTextFile)&&d.jsx("button",{type:"button",className:"gauntlet-capsule__copy gauntlet-capsule__copy--ghost",onClick:()=>void qt(),title:"Guardar resposta para um ficheiro",children:Dr?`→ ${Dr}`:"Guardar como"})]})]}),R&&R.actions.length===0&&!R.compose&&b==="plan_ready"&&d.jsx("section",{className:"gauntlet-capsule__plan",children:d.jsx("p",{className:"gauntlet-capsule__plan-empty",children:R.reason??"Modelo não conseguiu planear."})}),R&&R.actions.length>0&&(b==="plan_ready"||b==="executing"||b==="executed")&&d.jsxs("section",{className:"gauntlet-capsule__plan",children:[d.jsxs("header",{className:"gauntlet-capsule__plan-header",children:[d.jsx("span",{className:"gauntlet-capsule__plan-title",children:"plano"}),d.jsxs("span",{className:"gauntlet-capsule__plan-meta",children:[R.actions.length," action",R.actions.length===1?"":"s"," · ",R.model_used," · ",R.latency_ms," ms"]})]}),d.jsx("ol",{className:"gauntlet-capsule__plan-list",children:R.actions.map((f,S)=>{const $=Te==null?void 0:Te[S],G=$?$.ok?"ok":"fail":"pending",ae=jt[S];return d.jsxs("li",{className:`gauntlet-capsule__plan-item gauntlet-capsule__plan-item--${G}${ae!=null&&ae.danger?" gauntlet-capsule__plan-item--danger":""}`,children:[d.jsx("span",{className:"gauntlet-capsule__plan-step",children:S+1}),d.jsx("span",{className:"gauntlet-capsule__plan-desc",children:af(f)}),(ae==null?void 0:ae.danger)&&d.jsx("span",{className:"gauntlet-capsule__plan-danger",title:ae.reason,children:"sensível"}),$&&!$.ok&&d.jsx("span",{className:"gauntlet-capsule__plan-err",title:$.error,children:$.error})]},`${S}-${f.type}-${f.selector}`)})}),b!=="executed"&&Tt&&d.jsxs("div",{className:"gauntlet-capsule__danger-gate",role:"alert",children:[d.jsxs("header",{className:"gauntlet-capsule__danger-header",children:[d.jsx("span",{className:"gauntlet-capsule__danger-mark","aria-hidden":!0,children:"!"}),d.jsx("span",{className:"gauntlet-capsule__danger-title",children:"Acções sensíveis no plano"})]}),d.jsxs("ul",{className:"gauntlet-capsule__danger-list",children:[rr.forced&&rr.reason&&d.jsxs("li",{children:[d.jsx("strong",{children:"governança:"})," ",rr.reason]},"danger-policy"),xt.danger&&d.jsxs("li",{children:[d.jsx("strong",{children:"cadeia:"})," ",xt.reason??"flagged"]},"danger-sequence"),jt.map((f,S)=>f.danger?d.jsxs("li",{children:[d.jsxs("strong",{children:["step ",S+1,":"]})," ",f.reason??"flagged"]},`danger-${S}`):null)]}),d.jsxs("label",{className:"gauntlet-capsule__danger-confirm",children:[d.jsx("input",{type:"checkbox",checked:Y,onChange:f=>pe(f.target.checked),disabled:b==="executing"}),d.jsx("span",{children:"Confirmo, executar mesmo assim."})]})]}),b!=="executed"&&z&&d.jsx("div",{className:"gauntlet-capsule__plan-actions",children:d.jsx("button",{type:"button",className:`gauntlet-capsule__execute${Tt?" gauntlet-capsule__execute--danger":""}`,onClick:()=>void wl(),disabled:b==="executing"||Tt&&!Y,children:b==="executing"?"executando…":Tt?"Executar com cuidado":"Executar"})}),b!=="executed"&&!z&&d.jsx("p",{className:"gauntlet-capsule__plan-empty",children:"esta superfície não tem acesso a uma página viva — abre o Gauntlet num separador para executar acções."})]}),b==="error"&&fe&&d.jsxs("div",{className:"gauntlet-capsule__error",role:"alert",children:[d.jsx("span",{className:"gauntlet-capsule__error-icon","aria-hidden":!0,children:"!"}),d.jsx("span",{children:fe})]})]})]}),er&&d.jsx(ef,{onClose:()=>Oe(!1),recentIds:mt,actions:(()=>{var X,Ze;const f=J=>{Fe(ue=>[J,...ue.filter(An=>An!==J)].slice(0,8)),h.notePaletteUse(J)},S=J=>{P(ue=>{const Ce=ue.trimEnd(),An=`usa a tool ${J} para `;return Ce.startsWith("usa a tool ")?An:Ce?`${An}${Ce}`:An}),window.setTimeout(()=>{const ue=Nt.current;ue&&(ue.focus(),ue.setSelectionRange(ue.value.length,ue.value.length))},0)},$=[{id:"focus",label:"Focar input",shortcut:"↵",group:"action",run:()=>{f("focus"),Oe(!1),window.setTimeout(()=>{var J;return(J=Nt.current)==null?void 0:J.focus()},0)}},{id:"copy",label:"Copiar resposta",shortcut:"⌘C",group:"action",disabled:!(R!=null&&R.compose),run:()=>{f("copy"),Oe(!1),Ir()}},{id:"save",label:"Guardar em memória",shortcut:"S",group:"action",disabled:!(R!=null&&R.compose)&&!E.text&&!M.trim(),run:()=>{f("save"),Oe(!1),or()}},...o.capabilities.filesystemRead&&o.filesystem?[{id:"attach-file",label:"Anexar ficheiro local",description:"Abre o file picker e anexa o conteúdo ao prompt",shortcut:"",group:"action",run:()=>{f("attach-file"),Oe(!1),Pt()}}]:[],...o.capabilities.screenCapture&&((X=o.screenshot)!=null&&X.captureScreen)?[{id:"attach-screen",label:"Capturar ecrã inteiro",description:"Anexa um screenshot do ecrã primário",shortcut:"",group:"action",run:()=>{f("attach-screen"),Oe(!1),Ln()}}]:[],...o.capabilities.shellExecute&&o.shellExec?[{id:"shell-toggle",label:Yt?"Fechar shell rápida":"Abrir shell rápida",description:"Painel inline para correr comandos da allowlist",shortcut:"",group:"action",run:()=>{f("shell-toggle"),Oe(!1),Rn(J=>!J)}}]:[],...o.capabilities.filesystemWrite&&((Ze=o.filesystem)!=null&&Ze.writeTextFile)?[{id:"save-disk",label:"Guardar resposta em ficheiro",description:"Save dialog → escreve compose para o disco",shortcut:"",group:"action",disabled:!(R!=null&&R.compose),run:()=>{f("save-disk"),Oe(!1),qt()}}]:[],{id:"reread",label:"Re-ler contexto",shortcut:"R",group:"action",run:()=>{f("reread"),Oe(!1),Rr()}},{id:"clear",label:"Limpar input",shortcut:"X",group:"action",disabled:!M,run:()=>{var J;f("clear"),Oe(!1),P(""),(J=Nt.current)==null||J.focus()}},{id:"dismiss",label:"Fechar cápsula",shortcut:"Esc",group:"action",run:()=>{f("dismiss"),Oe(!1),it()}}],ae=Ye.filter(J=>{var Ce;const ue=(Ce=Xe.tool_policies)==null?void 0:Ce[J.name];return!ue||ue.allowed!==!1}).map(J=>{var ue,Ce;return{id:`tool:${J.name}`,label:J.name,description:J.description,shortcut:"",group:"tool",mode:J.mode,risk:J.risk,requiresApproval:((Ce=(ue=Xe.tool_policies)==null?void 0:ue[J.name])==null?void 0:Ce.require_approval)===!0,run:()=>{f(`tool:${J.name}`),Oe(!1),S(J.name)}}});return[...$,...ae]})()}),tr&&d.jsx("div",{className:"gauntlet-capsule__flash",role:"status","aria-live":"polite",children:tr})]})}function Zp(o,u){if(!o)return 0;const i=o.toLowerCase(),v=u.toLowerCase();if(v.includes(i))return 1e3-v.indexOf(i);let m=0,h=0,z=-2;for(let E=0;E<v.length&&m<i.length;E++)v[E]===i[m]&&(E!==z+1&&h++,z=E,m++);return m<i.length?-1:500-h*10-(v.length-i.length)}function ef({actions:o,onClose:u,recentIds:i}){const[v,m]=j.useState(""),[h,z]=j.useState(0),E=j.useRef(null);j.useEffect(()=>{var P;(P=E.current)==null||P.focus()},[]);const k=j.useMemo(()=>{if(!v){const b=new Map(i.map((re,te)=>[re,te])),U=re=>{const te=b.get(re.id);return te===void 0?i.length:te};return[...o].sort((re,te)=>{const le=U(re),R=U(te);if(le!==R)return le-R;const Me=Y=>Y==="tool"?1:0,Te=Me(re.group),we=Me(te.group);return Te!==we?Te-we:re.label.localeCompare(te.label)})}return o.map(b=>{const U=`${b.label} ${b.id} ${b.description??""}`;return{a:b,score:Zp(v,U)}}).filter(b=>b.score>=0).sort((b,U)=>U.score-b.score).map(b=>b.a)},[o,v,i]);j.useEffect(()=>{h>=k.length&&z(0)},[k.length,h]);const M=j.useCallback(P=>{if(P.key==="ArrowDown")P.preventDefault(),z(b=>Math.min(b+1,k.length-1));else if(P.key==="ArrowUp")P.preventDefault(),z(b=>Math.max(b-1,0));else if(P.key==="Enter"){P.preventDefault();const b=k[h];b&&!b.disabled&&b.run()}},[k,h]);return d.jsxs("div",{className:"gauntlet-capsule__palette",role:"dialog","aria-label":"Command palette",children:[d.jsx("div",{className:"gauntlet-capsule__palette-scrim",onClick:u}),d.jsxs("div",{className:"gauntlet-capsule__palette-panel",onKeyDown:M,children:[d.jsx("input",{ref:E,className:"gauntlet-capsule__palette-input",type:"text",placeholder:"comandos · tools…  (↑↓ para navegar, ↵ para correr, esc para fechar)",value:v,onChange:P=>m(P.target.value)}),d.jsx("ul",{className:"gauntlet-capsule__palette-list",role:"listbox",children:k.length===0?d.jsx("li",{className:"gauntlet-capsule__palette-empty",children:"sem resultados"}):k.map((P,b)=>d.jsxs("li",{role:"option","aria-selected":b===h,"aria-disabled":P.disabled,onMouseEnter:()=>z(b),onClick:()=>{P.disabled||P.run()},className:`gauntlet-capsule__palette-item${b===h?" gauntlet-capsule__palette-item--active":""}${P.disabled?" gauntlet-capsule__palette-item--disabled":""}${P.group==="tool"?" gauntlet-capsule__palette-item--tool":""}`,children:[d.jsxs("div",{className:"gauntlet-capsule__palette-main",children:[d.jsx("span",{className:"gauntlet-capsule__palette-label",children:P.label}),P.description&&d.jsx("span",{className:"gauntlet-capsule__palette-desc",children:P.description})]}),d.jsxs("div",{className:"gauntlet-capsule__palette-meta",children:[P.mode&&d.jsx("span",{className:`gauntlet-capsule__palette-badge gauntlet-capsule__palette-badge--mode-${P.mode}`,title:`mode: ${P.mode}`,children:P.mode}),P.risk&&P.risk!=="low"&&d.jsx("span",{className:`gauntlet-capsule__palette-badge gauntlet-capsule__palette-badge--risk-${P.risk}`,title:`risk: ${P.risk}`,children:P.risk}),P.requiresApproval&&d.jsx("span",{className:"gauntlet-capsule__palette-badge gauntlet-capsule__palette-badge--approval",title:"requires explicit approval before running",children:"approval"}),P.shortcut&&d.jsx("span",{className:"gauntlet-capsule__palette-shortcut",children:P.shortcut})]})]},P.id))})]})]})}function hc(o,u){return o.length<=u?o:o.slice(0,u)+"…"}function tf({snapshot:o,screenshotEnabled:u}){const i=(()=>{if(!o.domSkeleton)return 0;try{const m=JSON.parse(o.domSkeleton);if(Array.isArray(m))return m.length}catch{}return 0})(),v=!!o.pageText;return d.jsxs("ul",{className:"gauntlet-capsule__context-summary","aria-label":"context",children:[d.jsxs("li",{children:[d.jsx("span",{className:"gauntlet-capsule__context-key",children:"selection"}),d.jsx("span",{className:"gauntlet-capsule__context-val gauntlet-capsule__context-val--muted",children:"none"})]}),d.jsxs("li",{children:[d.jsx("span",{className:"gauntlet-capsule__context-key",children:"page captured"}),d.jsx("span",{className:"gauntlet-capsule__context-val",children:v?"yes":"no"})]}),d.jsxs("li",{children:[d.jsx("span",{className:"gauntlet-capsule__context-key",children:"DOM captured"}),d.jsx("span",{className:"gauntlet-capsule__context-val",children:i>0?`${i} elements`:"—"})]}),d.jsxs("li",{children:[d.jsx("span",{className:"gauntlet-capsule__context-key",children:"screenshot"}),d.jsx("span",{className:"gauntlet-capsule__context-val",children:u?"on":"off"})]})]})}function nf({onClose:o,showScreenshot:u,prefs:i,showDismissedDomains:v,theme:m,onChangeTheme:h,showPillMode:z}){const[E,k]=j.useState([]),[M,P]=j.useState(!0),[b,U]=j.useState(!1),[fe,re]=j.useState("corner"),[te,le]=j.useState(!1);j.useEffect(()=>{let Y=!1;return v&&i.readDismissedDomains().then(pe=>{Y||k(pe)}),i.readScreenshotEnabled().then(pe=>{Y||(U(pe),P(!1))}),i.readPillMode().then(pe=>{Y||re(pe)}),i.readTtsEnabled().then(pe=>{Y||le(pe)}),()=>{Y=!0}},[i,v]);const R=j.useCallback(async Y=>{re(Y),await i.writePillMode(Y),window.dispatchEvent(new CustomEvent("gauntlet:pill-mode",{detail:{mode:Y}}))},[i]),Me=j.useCallback(async Y=>{var pe;if(le(Y),await i.writeTtsEnabled(Y),!Y)try{(pe=window.speechSynthesis)==null||pe.cancel()}catch{}window.dispatchEvent(new CustomEvent("gauntlet:tts",{detail:{enabled:Y}}))},[i]),Te=j.useCallback(async Y=>{await i.restoreDomain(Y),k(pe=>pe.filter(ze=>ze!==Y))},[i]),we=j.useCallback(async Y=>{U(Y),await i.writeScreenshotEnabled(Y)},[i]);return d.jsxs("section",{className:"gauntlet-capsule__settings",role:"region","aria-label":"Definições",children:[d.jsxs("header",{className:"gauntlet-capsule__settings-header",children:[d.jsx("span",{className:"gauntlet-capsule__settings-title",children:"definições"}),d.jsx("button",{type:"button",className:"gauntlet-capsule__settings-close",onClick:o,"aria-label":"Fechar definições",children:"×"})]}),d.jsxs("div",{className:"gauntlet-capsule__settings-section",children:[d.jsx("span",{className:"gauntlet-capsule__settings-subtitle",children:"aparência"}),d.jsxs("div",{className:"gauntlet-capsule__theme-switch",role:"radiogroup","aria-label":"tema",children:[d.jsxs("button",{type:"button",className:`gauntlet-capsule__theme-option${m==="light"?" gauntlet-capsule__theme-option--active":""}`,onClick:()=>h("light"),role:"radio","aria-checked":m==="light",children:[d.jsx("span",{className:"gauntlet-capsule__theme-swatch gauntlet-capsule__theme-swatch--light","aria-hidden":!0}),d.jsx("span",{children:"flagship light"})]}),d.jsxs("button",{type:"button",className:`gauntlet-capsule__theme-option${m==="dark"?" gauntlet-capsule__theme-option--active":""}`,onClick:()=>h("dark"),role:"radio","aria-checked":m==="dark",children:[d.jsx("span",{className:"gauntlet-capsule__theme-swatch gauntlet-capsule__theme-swatch--dark","aria-hidden":!0}),d.jsx("span",{children:"night premium"})]})]})]}),z&&d.jsxs("div",{className:"gauntlet-capsule__settings-section",children:[d.jsx("span",{className:"gauntlet-capsule__settings-subtitle",children:"pill"}),d.jsxs("div",{className:"gauntlet-capsule__theme-switch",role:"radiogroup","aria-label":"pill mode",children:[d.jsxs("button",{type:"button",className:`gauntlet-capsule__theme-option${fe==="corner"?" gauntlet-capsule__theme-option--active":""}`,onClick:()=>void R("corner"),role:"radio","aria-checked":fe==="corner",children:[d.jsx("span",{className:"gauntlet-capsule__theme-swatch gauntlet-capsule__pill-mode-swatch--corner","aria-hidden":!0}),d.jsx("span",{children:"resting corner"})]}),d.jsxs("button",{type:"button",className:`gauntlet-capsule__theme-option${fe==="cursor"?" gauntlet-capsule__theme-option--active":""}`,onClick:()=>void R("cursor"),role:"radio","aria-checked":fe==="cursor",children:[d.jsx("span",{className:"gauntlet-capsule__theme-swatch gauntlet-capsule__pill-mode-swatch--cursor","aria-hidden":!0}),d.jsx("span",{children:"cursor pill"})]})]})]}),u&&d.jsx("div",{className:"gauntlet-capsule__settings-section",children:d.jsxs("label",{className:"gauntlet-capsule__settings-toggle",children:[d.jsx("input",{type:"checkbox",checked:b,onChange:Y=>void we(Y.target.checked)}),d.jsxs("span",{className:"gauntlet-capsule__settings-toggle-label",children:[d.jsx("strong",{children:"incluir screenshot"}),d.jsx("small",{children:"o modelo vê a página visível. útil para layouts e imagens, exposição de senhas/DMs visíveis. opt-in."})]})]})}),d.jsx("div",{className:"gauntlet-capsule__settings-section",children:d.jsxs("label",{className:"gauntlet-capsule__settings-toggle",children:[d.jsx("input",{type:"checkbox",checked:te,onChange:Y=>void Me(Y.target.checked)}),d.jsxs("span",{className:"gauntlet-capsule__settings-toggle-label",children:[d.jsx("strong",{children:"ler resposta em voz alta"}),d.jsx("small",{children:"quando o modelo termina, a cápsula fala a resposta via Web Speech. cancela ao submeter outro pedido ou fechar a cápsula."})]})]})}),d.jsxs("div",{className:"gauntlet-capsule__settings-section",children:[d.jsx("span",{className:"gauntlet-capsule__settings-subtitle",children:"domínios escondidos"}),M?d.jsx("p",{className:"gauntlet-capsule__settings-empty",children:"a carregar…"}):E.length===0?d.jsx("p",{className:"gauntlet-capsule__settings-empty",children:"nenhum — clica direito no pill em qualquer site para o esconder."}):d.jsx("ul",{className:"gauntlet-capsule__settings-list",children:E.map(Y=>d.jsxs("li",{className:"gauntlet-capsule__settings-row",children:[d.jsx("span",{className:"gauntlet-capsule__settings-host",children:Y}),d.jsx("button",{type:"button",className:"gauntlet-capsule__settings-restore",onClick:()=>void Te(Y),children:"restaurar"})]},Y))})]})]})}function rf(o){const u=o.match(/"compose"\s*:\s*"((?:[^"\\]|\\.)*)/);if(!u)return null;let i=u[1];return i.endsWith("\\")&&!i.endsWith("\\\\")&&(i=i.slice(0,-1)),i.replace(/\\n/g,`
`).replace(/\\r/g,"\r").replace(/\\t/g,"	").replace(/\\"/g,'"').replace(/\\\\/g,"\\")}function lf(o,u){const i={};return o.pageText&&(i.page_text=o.pageText),o.domSkeleton&&(i.dom_skeleton=o.domSkeleton),o.bbox&&(i.selection_bbox=o.bbox),u&&(i.screenshot_data_url=u),{source:"browser",url:o.url,page_title:o.pageTitle,selection:o.text||void 0,metadata:Object.keys(i).length>0?i:void 0}}function af(o){switch(o.type){case"fill":return`fill ${o.selector} ← "${hc(o.value,80)}"`;case"click":return`click ${o.selector}`;case"highlight":return`highlight ${o.selector}`;case"scroll_to":return`scroll to ${o.selector}`}}const Et=16,zn=12;function ja(o,u,i){return i<u||o<u?u:o>i?i:o}function of(o,u){if(o<=600)return{width:Math.max(0,o-24),height:Math.max(0,u-24)};const v=ja(.72*o,560,820),m=ja(.72*u,420,560);return{width:v,height:m}}function sf(o,u,i){if(!o)return{top:Math.max(Et,Math.floor((u.height-i.height)/2)),left:Math.max(Et,Math.floor((u.width-i.width)/2)),placement:"center"};const v=u.height-(o.y+o.height)-zn-Et,m=o.y-zn-Et,h=u.width-(o.x+o.width)-zn-Et,z=o.x-zn-Et,E=v>=i.height,k=m>=i.height,M=h>=i.width,P=z>=i.width;let b,U,fe;E?(b="below",U=o.y+o.height+zn,fe=o.x):k?(b="above",U=o.y-zn-i.height,fe=o.x):M?(b="right",fe=o.x+o.width+zn,U=Math.floor(o.y+o.height/2-i.height/2)):P?(b="left",fe=o.x-zn-i.width,U=Math.floor(o.y+o.height/2-i.height/2)):(b="center",U=Math.floor((u.height-i.height)/2),fe=Math.floor((u.width-i.width)/2));const re=u.height-i.height-Et,te=u.width-i.width-Et;return U=ja(U,Et,Math.max(Et,re)),fe=ja(fe,Et,Math.max(Et,te)),{top:U,left:fe,placement:b}}const uf=`
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
`,cf=100,df=new Set(["script","style","meta","link","noscript","head","html","br","hr","wbr"]),pf="gauntlet-capsule-host";function ff(o){const u=o.tagName.toLowerCase(),i=o.getAttribute("id");if(i&&!i.startsWith("gauntlet-"))return`${u}#${CSS.escape(i)}`;const v=o.getAttribute("name");if(v)return`${u}[name="${v}"]`;const m=o.getAttribute("type");if(m)return`${u}[type="${m}"]`;const h=Array.from(o.classList).filter(z=>z.length>2&&!z.startsWith("is-")&&!z.startsWith("has-")).slice(0,2);return h.length>0?`${u}.${h.map(z=>CSS.escape(z)).join(".")}`:u}function gf(o){try{const u=window.getComputedStyle(o);if(u.display==="none"||u.visibility==="hidden"||u.opacity==="0")return!1;const i=o.getBoundingClientRect();return!(i.width===0&&i.height===0||i.bottom<0||i.top>window.innerHeight||i.right<0||i.left>window.innerWidth)}catch{return!1}}function mf(o){let u=0,i=o;for(;i&&i!==document.body;)u++,i=i.parentElement;return u}function hf(o){var i;let u=o;for(;u;){if(u.id===pf||(i=u.id)!=null&&i.startsWith("gauntlet-"))return!0;u=u.parentElement}return!1}function xf(o){var M;const u=o.tagName.toLowerCase();if(df.has(u)||hf(o))return null;const i=ff(o),v=gf(o),m=mf(o),h={selector:i,tag:u,visible:v,depth:m},z=o.getAttribute("type");z&&(h.type=z);const E=o.getAttribute("placeholder")||o.getAttribute("aria-label")||o.getAttribute("title")||"";E&&(h.placeholder=E.trim().slice(0,80));const k=((M=o.innerText)==null?void 0:M.trim())??"";return k&&k.length>0&&(h.text=k.slice(0,50)),h}const vf=["input","textarea","select",'[contenteditable="true"]',"button","a[href]","label",'[role="button"]','[role="link"]','[role="textbox"]','[role="combobox"]','[role="listbox"]','[role="menuitem"]','[role="tab"]','[role="checkbox"]','[role="radio"]','[role="switch"]',"nav","main","form"].join(", ");function yf(){try{const o=[],u=new Set,i=document.querySelectorAll(vf);for(const v of Array.from(i)){if(o.length>=cf)break;const m=xf(v);m&&(u.has(m.selector)||(u.add(m.selector),o.push(m)))}return{elements:o}}catch{return{elements:[]}}}const cc=5e3;function _f(){try{const o=document.body;if(!o)return"";const i=(o.innerText??"").replace(/\r\n/g,`
`).replace(/\r/g,`
`).replace(/\n{3,}/g,`

`).replace(/[ \t]{2,}/g," ").trim();return i.length<=cc?i:i.slice(0,cc)+"…"}catch{return""}}function xc(){return{text:bf(),url:Sf(),pageTitle:Ef(),pageText:_f(),domSkeleton:JSON.stringify(yf()),bbox:Cf()}}const wf=50;async function kf(){var z;const o=xc();if(o.text)return o;const u=`gauntlet-cid-${Math.random().toString(36).slice(2)}`,i=[],v=E=>{const k=E.data;!k||k.gauntlet!=="subframe-selection-response"||k.cid===u&&(typeof k.text!="string"||!k.text||i.push({text:k.text,url:typeof k.url=="string"?k.url:void 0,pageTitle:typeof k.pageTitle=="string"?k.pageTitle:void 0}))};window.addEventListener("message",v);let m=null;try{m=document.querySelectorAll("iframe")}catch{m=null}if(m)for(const E of Array.from(m))try{(z=E.contentWindow)==null||z.postMessage({gauntlet:"subframe-selection-request",cid:u},"*")}catch{}await new Promise(E=>window.setTimeout(E,wf)),window.removeEventListener("message",v);const h=i.sort((E,k)=>k.text.length-E.text.length)[0];return h?{...o,text:h.text,url:h.url||o.url,pageTitle:h.pageTitle||o.pageTitle,bbox:null}:o}function bf(){try{const o=window.getSelection();return o?o.toString().trim():""}catch{return""}}function Sf(){try{return window.location.href}catch{return""}}function Ef(){try{return document.title??""}catch{return""}}function Cf(){try{const o=window.getSelection();if(!o||o.rangeCount===0||o.isCollapsed)return null;const i=o.getRangeAt(0).getBoundingClientRect();return i.width===0&&i.height===0?null:{x:i.x,y:i.y,width:i.width,height:i.height}}catch{return null}}const Nf={domExecution:!0,pillSurface:!0,screenshot:!0,dismissDomain:!0,voice:typeof window<"u"&&("SpeechRecognition"in window||"webkitSpeechRecognition"in window),streaming:!0,refreshSelection:!0,filesystemRead:!1,filesystemWrite:!1,screenCapture:!1,remoteVoice:!0,shellExecute:!1};async function jf(o,u,i){const v=await chrome.runtime.sendMessage({type:"gauntlet:fetch",url:u,method:o,headers:{"content-type":"application/json"},body:i===void 0?void 0:JSON.stringify(i)});if(!v||!v.ok)throw new Error(`composer: background fetch failed — ${(v==null?void 0:v.error)??"unknown error"}`);let m=null;if(v.body!=null&&v.body!=="")try{m=JSON.parse(v.body)}catch{m=v.body}const h=v.status??0;if(h<200||h>=300)throw new Error(`composer: ${h} ${v.statusText??""}`.trim());return m}const Tf={async get(o){try{return(await chrome.storage.local.get(o))[o]??null}catch{return null}},async set(o,u){try{await chrome.storage.local.set({[o]:u})}catch{}},async remove(o){try{await chrome.storage.local.remove(o)}catch{}}};function zf(o,u,i){const v=chrome.runtime.connect({name:"gauntlet:stream"});let m=!1;function h(){if(!m){m=!0;try{v.disconnect()}catch{}}}return v.onMessage.addListener(z=>{if(!z||typeof z!="object")return;const E=z;if(E.type==="sse"&&typeof E.data=="string"){let k=null;try{k=JSON.parse(E.data)}catch{i.onError("malformed SSE payload"),h();return}if(E.event==="delta"){const M=k.text??"";i.onDelta(M)}else if(E.event==="done"){const M=k;i.onDone({plan_id:M.plan_id??"",context_id:M.context_id??"",actions:M.actions??[],compose:M.compose??null,reason:M.reason??null,model_used:M.model_used??"",latency_ms:M.latency_ms??0,raw_response:null}),h()}else if(E.event==="error"){const M=k.error??"model error";i.onError(M),h()}}else E.type==="error"?(i.onError(E.error??"transport error"),h()):E.type==="closed"&&(m||(i.onDone({plan_id:"",context_id:"",actions:[],compose:null,reason:"stream ended without result",model_used:"",latency_ms:0,raw_response:null}),m=!0))}),v.onDisconnect.addListener(()=>{var z;if(!m){const E=(z=chrome.runtime.lastError)==null?void 0:z.message;i.onError(E??"disconnected"),m=!0}}),v.postMessage({type:"start",url:o,body:u}),()=>{if(!m){try{v.postMessage({type:"abort"})}catch{}h()}}}function Pf(){return{shell:"browser",capabilities:Nf,transport:{fetchJson(o,u,i){return jf(o,u,i)},stream:zf},storage:Tf,selection:{read:()=>xc(),readAsync:()=>kf()},domActions:{execute:Ip},screenshot:{async capture(){var o;if(typeof chrome>"u"||!((o=chrome.runtime)!=null&&o.sendMessage))return null;try{const u=await chrome.runtime.sendMessage({type:"gauntlet:capture_screenshot"});return!(u!=null&&u.ok)||!u.dataUrl?null:u.dataUrl}catch{return null}}},debug:{async lastSummon(){try{const o=await chrome.runtime.sendMessage({type:"gauntlet:debug"});return(o==null?void 0:o.lastSummon)??null}catch{return null}}}}}const Mf=`
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
`,vc=document.createElement("style");vc.textContent=uf+Mf;document.head.appendChild(vc);const dc=Pf(),yc={...dc,capabilities:{...dc.capabilities,domExecution:!1,screenshot:!1,dismissDomain:!1,refreshSelection:!1,pillSurface:!1},domActions:void 0,screenshot:void 0};yc.storage.get("gauntlet:theme").then(o=>{const u=o==="dark"||o==="light"?o:"light";document.documentElement.setAttribute("data-theme",u),document.body.setAttribute("data-theme",u)});const Lf=up.createRoot(document.getElementById("root"));Lf.render(d.jsx(j.StrictMode,{children:d.jsx(Xp,{ambient:yc,initialSnapshot:{text:"",url:"window://composer",pageTitle:"Composer",pageText:"",domSkeleton:"",bbox:null},onDismiss:()=>window.close()})}));
