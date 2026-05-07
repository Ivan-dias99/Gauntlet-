var content=(function(){"use strict";var rg=Object.defineProperty;var lg=(Ft,Ut,Xt)=>Ut in Ft?rg(Ft,Ut,{enumerable:!0,configurable:!0,writable:!0,value:Xt}):Ft[Ut]=Xt;var Hn=(Ft,Ut,Xt)=>lg(Ft,typeof Ut!="symbol"?Ut+"":Ut,Xt);var Ft=typeof document<"u"?document.currentScript:null;function Ut(s){return s&&s.__esModule&&Object.prototype.hasOwnProperty.call(s,"default")?s.default:s}var Xt={exports:{}},gr={},bo={exports:{}},fe={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var ms;function bc(){if(ms)return fe;ms=1;var s=Symbol.for("react.element"),u=Symbol.for("react.portal"),a=Symbol.for("react.fragment"),f=Symbol.for("react.strict_mode"),x=Symbol.for("react.profiler"),h=Symbol.for("react.provider"),A=Symbol.for("react.context"),E=Symbol.for("react.forward_ref"),w=Symbol.for("react.suspense"),j=Symbol.for("react.memo"),z=Symbol.for("react.lazy"),C=Symbol.iterator;function U(d){return d===null||typeof d!="object"?null:(d=C&&d[C]||d["@@iterator"],typeof d=="function"?d:null)}var ie={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},te=Object.assign,ee={};function ae(d,k,Z){this.props=d,this.context=k,this.refs=ee,this.updater=Z||ie}ae.prototype.isReactComponent={},ae.prototype.setState=function(d,k){if(typeof d!="object"&&typeof d!="function"&&d!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,d,k,"setState")},ae.prototype.forceUpdate=function(d){this.updater.enqueueForceUpdate(this,d,"forceUpdate")};function D(){}D.prototype=ae.prototype;function we(d,k,Z){this.props=d,this.context=k,this.refs=ee,this.updater=Z||ie}var Ae=we.prototype=new D;Ae.constructor=we,te(Ae,ae.prototype),Ae.isPureReactComponent=!0;var ve=Array.isArray,$=Object.prototype.hasOwnProperty,N={current:null},L={key:!0,ref:!0,__self:!0,__source:!0};function F(d,k,Z){var ne,ue={},ce=null,le=null;if(k!=null)for(ne in k.ref!==void 0&&(le=k.ref),k.key!==void 0&&(ce=""+k.key),k)$.call(k,ne)&&!L.hasOwnProperty(ne)&&(ue[ne]=k[ne]);var re=arguments.length-2;if(re===1)ue.children=Z;else if(1<re){for(var me=Array(re),Ee=0;Ee<re;Ee++)me[Ee]=arguments[Ee+2];ue.children=me}if(d&&d.defaultProps)for(ne in re=d.defaultProps,re)ue[ne]===void 0&&(ue[ne]=re[ne]);return{$$typeof:s,type:d,key:ce,ref:le,props:ue,_owner:N.current}}function K(d,k){return{$$typeof:s,type:d.type,key:k,ref:d.ref,props:d.props,_owner:d._owner}}function ge(d){return typeof d=="object"&&d!==null&&d.$$typeof===s}function Ne(d){var k={"=":"=0",":":"=2"};return"$"+d.replace(/[=:]/g,function(Z){return k[Z]})}var be=/\/+/g;function q(d,k){return typeof d=="object"&&d!==null&&d.key!=null?Ne(""+d.key):k.toString(36)}function Se(d,k,Z,ne,ue){var ce=typeof d;(ce==="undefined"||ce==="boolean")&&(d=null);var le=!1;if(d===null)le=!0;else switch(ce){case"string":case"number":le=!0;break;case"object":switch(d.$$typeof){case s:case u:le=!0}}if(le)return le=d,ue=ue(le),d=ne===""?"."+q(le,0):ne,ve(ue)?(Z="",d!=null&&(Z=d.replace(be,"$&/")+"/"),Se(ue,k,Z,"",function(Ee){return Ee})):ue!=null&&(ge(ue)&&(ue=K(ue,Z+(!ue.key||le&&le.key===ue.key?"":(""+ue.key).replace(be,"$&/")+"/")+d)),k.push(ue)),1;if(le=0,ne=ne===""?".":ne+":",ve(d))for(var re=0;re<d.length;re++){ce=d[re];var me=ne+q(ce,re);le+=Se(ce,k,Z,me,ue)}else if(me=U(d),typeof me=="function")for(d=me.call(d),re=0;!(ce=d.next()).done;)ce=ce.value,me=ne+q(ce,re++),le+=Se(ce,k,Z,me,ue);else if(ce==="object")throw k=String(d),Error("Objects are not valid as a React child (found: "+(k==="[object Object]"?"object with keys {"+Object.keys(d).join(", ")+"}":k)+"). If you meant to render a collection of children, use an array instead.");return le}function he(d,k,Z){if(d==null)return d;var ne=[],ue=0;return Se(d,ne,"","",function(ce){return k.call(Z,ce,ue++)}),ne}function je(d){if(d._status===-1){var k=d._result;k=k(),k.then(function(Z){(d._status===0||d._status===-1)&&(d._status=1,d._result=Z)},function(Z){(d._status===0||d._status===-1)&&(d._status=2,d._result=Z)}),d._status===-1&&(d._status=0,d._result=k)}if(d._status===1)return d._result.default;throw d._result}var de={current:null},O={transition:null},J={ReactCurrentDispatcher:de,ReactCurrentBatchConfig:O,ReactCurrentOwner:N};function R(){throw Error("act(...) is not supported in production builds of React.")}return fe.Children={map:he,forEach:function(d,k,Z){he(d,function(){k.apply(this,arguments)},Z)},count:function(d){var k=0;return he(d,function(){k++}),k},toArray:function(d){return he(d,function(k){return k})||[]},only:function(d){if(!ge(d))throw Error("React.Children.only expected to receive a single React element child.");return d}},fe.Component=ae,fe.Fragment=a,fe.Profiler=x,fe.PureComponent=we,fe.StrictMode=f,fe.Suspense=w,fe.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=J,fe.act=R,fe.cloneElement=function(d,k,Z){if(d==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+d+".");var ne=te({},d.props),ue=d.key,ce=d.ref,le=d._owner;if(k!=null){if(k.ref!==void 0&&(ce=k.ref,le=N.current),k.key!==void 0&&(ue=""+k.key),d.type&&d.type.defaultProps)var re=d.type.defaultProps;for(me in k)$.call(k,me)&&!L.hasOwnProperty(me)&&(ne[me]=k[me]===void 0&&re!==void 0?re[me]:k[me])}var me=arguments.length-2;if(me===1)ne.children=Z;else if(1<me){re=Array(me);for(var Ee=0;Ee<me;Ee++)re[Ee]=arguments[Ee+2];ne.children=re}return{$$typeof:s,type:d.type,key:ue,ref:ce,props:ne,_owner:le}},fe.createContext=function(d){return d={$$typeof:A,_currentValue:d,_currentValue2:d,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},d.Provider={$$typeof:h,_context:d},d.Consumer=d},fe.createElement=F,fe.createFactory=function(d){var k=F.bind(null,d);return k.type=d,k},fe.createRef=function(){return{current:null}},fe.forwardRef=function(d){return{$$typeof:E,render:d}},fe.isValidElement=ge,fe.lazy=function(d){return{$$typeof:z,_payload:{_status:-1,_result:d},_init:je}},fe.memo=function(d,k){return{$$typeof:j,type:d,compare:k===void 0?null:k}},fe.startTransition=function(d){var k=O.transition;O.transition={};try{d()}finally{O.transition=k}},fe.unstable_act=R,fe.useCallback=function(d,k){return de.current.useCallback(d,k)},fe.useContext=function(d){return de.current.useContext(d)},fe.useDebugValue=function(){},fe.useDeferredValue=function(d){return de.current.useDeferredValue(d)},fe.useEffect=function(d,k){return de.current.useEffect(d,k)},fe.useId=function(){return de.current.useId()},fe.useImperativeHandle=function(d,k,Z){return de.current.useImperativeHandle(d,k,Z)},fe.useInsertionEffect=function(d,k){return de.current.useInsertionEffect(d,k)},fe.useLayoutEffect=function(d,k){return de.current.useLayoutEffect(d,k)},fe.useMemo=function(d,k){return de.current.useMemo(d,k)},fe.useReducer=function(d,k,Z){return de.current.useReducer(d,k,Z)},fe.useRef=function(d){return de.current.useRef(d)},fe.useState=function(d){return de.current.useState(d)},fe.useSyncExternalStore=function(d,k,Z){return de.current.useSyncExternalStore(d,k,Z)},fe.useTransition=function(){return de.current.useTransition()},fe.version="18.3.1",fe}var hs;function So(){return hs||(hs=1,bo.exports=bc()),bo.exports}/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var xs;function Sc(){if(xs)return gr;xs=1;var s=So(),u=Symbol.for("react.element"),a=Symbol.for("react.fragment"),f=Object.prototype.hasOwnProperty,x=s.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,h={key:!0,ref:!0,__self:!0,__source:!0};function A(E,w,j){var z,C={},U=null,ie=null;j!==void 0&&(U=""+j),w.key!==void 0&&(U=""+w.key),w.ref!==void 0&&(ie=w.ref);for(z in w)f.call(w,z)&&!h.hasOwnProperty(z)&&(C[z]=w[z]);if(E&&E.defaultProps)for(z in w=E.defaultProps,w)C[z]===void 0&&(C[z]=w[z]);return{$$typeof:u,type:E,key:U,ref:ie,props:C,_owner:x.current}}return gr.Fragment=a,gr.jsx=A,gr.jsxs=A,gr}var vs;function Ec(){return vs||(vs=1,Xt.exports=Sc()),Xt.exports}var g=Ec();function og(s){return s}var b=So(),ll={},Eo={exports:{}},rt={},Co={exports:{}},Ao={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var ys;function Cc(){return ys||(ys=1,(function(s){function u(O,J){var R=O.length;O.push(J);e:for(;0<R;){var d=R-1>>>1,k=O[d];if(0<x(k,J))O[d]=J,O[R]=k,R=d;else break e}}function a(O){return O.length===0?null:O[0]}function f(O){if(O.length===0)return null;var J=O[0],R=O.pop();if(R!==J){O[0]=R;e:for(var d=0,k=O.length,Z=k>>>1;d<Z;){var ne=2*(d+1)-1,ue=O[ne],ce=ne+1,le=O[ce];if(0>x(ue,R))ce<k&&0>x(le,ue)?(O[d]=le,O[ce]=R,d=ce):(O[d]=ue,O[ne]=R,d=ne);else if(ce<k&&0>x(le,R))O[d]=le,O[ce]=R,d=ce;else break e}}return J}function x(O,J){var R=O.sortIndex-J.sortIndex;return R!==0?R:O.id-J.id}if(typeof performance=="object"&&typeof performance.now=="function"){var h=performance;s.unstable_now=function(){return h.now()}}else{var A=Date,E=A.now();s.unstable_now=function(){return A.now()-E}}var w=[],j=[],z=1,C=null,U=3,ie=!1,te=!1,ee=!1,ae=typeof setTimeout=="function"?setTimeout:null,D=typeof clearTimeout=="function"?clearTimeout:null,we=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function Ae(O){for(var J=a(j);J!==null;){if(J.callback===null)f(j);else if(J.startTime<=O)f(j),J.sortIndex=J.expirationTime,u(w,J);else break;J=a(j)}}function ve(O){if(ee=!1,Ae(O),!te)if(a(w)!==null)te=!0,je($);else{var J=a(j);J!==null&&de(ve,J.startTime-O)}}function $(O,J){te=!1,ee&&(ee=!1,D(F),F=-1),ie=!0;var R=U;try{for(Ae(J),C=a(w);C!==null&&(!(C.expirationTime>J)||O&&!Ne());){var d=C.callback;if(typeof d=="function"){C.callback=null,U=C.priorityLevel;var k=d(C.expirationTime<=J);J=s.unstable_now(),typeof k=="function"?C.callback=k:C===a(w)&&f(w),Ae(J)}else f(w);C=a(w)}if(C!==null)var Z=!0;else{var ne=a(j);ne!==null&&de(ve,ne.startTime-J),Z=!1}return Z}finally{C=null,U=R,ie=!1}}var N=!1,L=null,F=-1,K=5,ge=-1;function Ne(){return!(s.unstable_now()-ge<K)}function be(){if(L!==null){var O=s.unstable_now();ge=O;var J=!0;try{J=L(!0,O)}finally{J?q():(N=!1,L=null)}}else N=!1}var q;if(typeof we=="function")q=function(){we(be)};else if(typeof MessageChannel<"u"){var Se=new MessageChannel,he=Se.port2;Se.port1.onmessage=be,q=function(){he.postMessage(null)}}else q=function(){ae(be,0)};function je(O){L=O,N||(N=!0,q())}function de(O,J){F=ae(function(){O(s.unstable_now())},J)}s.unstable_IdlePriority=5,s.unstable_ImmediatePriority=1,s.unstable_LowPriority=4,s.unstable_NormalPriority=3,s.unstable_Profiling=null,s.unstable_UserBlockingPriority=2,s.unstable_cancelCallback=function(O){O.callback=null},s.unstable_continueExecution=function(){te||ie||(te=!0,je($))},s.unstable_forceFrameRate=function(O){0>O||125<O?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):K=0<O?Math.floor(1e3/O):5},s.unstable_getCurrentPriorityLevel=function(){return U},s.unstable_getFirstCallbackNode=function(){return a(w)},s.unstable_next=function(O){switch(U){case 1:case 2:case 3:var J=3;break;default:J=U}var R=U;U=J;try{return O()}finally{U=R}},s.unstable_pauseExecution=function(){},s.unstable_requestPaint=function(){},s.unstable_runWithPriority=function(O,J){switch(O){case 1:case 2:case 3:case 4:case 5:break;default:O=3}var R=U;U=O;try{return J()}finally{U=R}},s.unstable_scheduleCallback=function(O,J,R){var d=s.unstable_now();switch(typeof R=="object"&&R!==null?(R=R.delay,R=typeof R=="number"&&0<R?d+R:d):R=d,O){case 1:var k=-1;break;case 2:k=250;break;case 5:k=1073741823;break;case 4:k=1e4;break;default:k=5e3}return k=R+k,O={id:z++,callback:J,priorityLevel:O,startTime:R,expirationTime:k,sortIndex:-1},R>d?(O.sortIndex=R,u(j,O),a(w)===null&&O===a(j)&&(ee?(D(F),F=-1):ee=!0,de(ve,R-d))):(O.sortIndex=k,u(w,O),te||ie||(te=!0,je($))),O},s.unstable_shouldYield=Ne,s.unstable_wrapCallback=function(O){var J=U;return function(){var R=U;U=J;try{return O.apply(this,arguments)}finally{U=R}}}})(Ao)),Ao}var _s;function Ac(){return _s||(_s=1,Co.exports=Cc()),Co.exports}/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var ws;function Nc(){if(ws)return rt;ws=1;var s=So(),u=Ac();function a(e){for(var t="https://reactjs.org/docs/error-decoder.html?invariant="+e,n=1;n<arguments.length;n++)t+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var f=new Set,x={};function h(e,t){A(e,t),A(e+"Capture",t)}function A(e,t){for(x[e]=t,e=0;e<t.length;e++)f.add(t[e])}var E=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),w=Object.prototype.hasOwnProperty,j=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,z={},C={};function U(e){return w.call(C,e)?!0:w.call(z,e)?!1:j.test(e)?C[e]=!0:(z[e]=!0,!1)}function ie(e,t,n,r){if(n!==null&&n.type===0)return!1;switch(typeof t){case"function":case"symbol":return!0;case"boolean":return r?!1:n!==null?!n.acceptsBooleans:(e=e.toLowerCase().slice(0,5),e!=="data-"&&e!=="aria-");default:return!1}}function te(e,t,n,r){if(t===null||typeof t>"u"||ie(e,t,n,r))return!0;if(r)return!1;if(n!==null)switch(n.type){case 3:return!t;case 4:return t===!1;case 5:return isNaN(t);case 6:return isNaN(t)||1>t}return!1}function ee(e,t,n,r,l,o,i){this.acceptsBooleans=t===2||t===3||t===4,this.attributeName=r,this.attributeNamespace=l,this.mustUseProperty=n,this.propertyName=e,this.type=t,this.sanitizeURL=o,this.removeEmptyString=i}var ae={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e){ae[e]=new ee(e,0,!1,e,null,!1,!1)}),[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(e){var t=e[0];ae[t]=new ee(t,1,!1,e[1],null,!1,!1)}),["contentEditable","draggable","spellCheck","value"].forEach(function(e){ae[e]=new ee(e,2,!1,e.toLowerCase(),null,!1,!1)}),["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(e){ae[e]=new ee(e,2,!1,e,null,!1,!1)}),"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e){ae[e]=new ee(e,3,!1,e.toLowerCase(),null,!1,!1)}),["checked","multiple","muted","selected"].forEach(function(e){ae[e]=new ee(e,3,!0,e,null,!1,!1)}),["capture","download"].forEach(function(e){ae[e]=new ee(e,4,!1,e,null,!1,!1)}),["cols","rows","size","span"].forEach(function(e){ae[e]=new ee(e,6,!1,e,null,!1,!1)}),["rowSpan","start"].forEach(function(e){ae[e]=new ee(e,5,!1,e.toLowerCase(),null,!1,!1)});var D=/[\-:]([a-z])/g;function we(e){return e[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e){var t=e.replace(D,we);ae[t]=new ee(t,1,!1,e,null,!1,!1)}),"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e){var t=e.replace(D,we);ae[t]=new ee(t,1,!1,e,"http://www.w3.org/1999/xlink",!1,!1)}),["xml:base","xml:lang","xml:space"].forEach(function(e){var t=e.replace(D,we);ae[t]=new ee(t,1,!1,e,"http://www.w3.org/XML/1998/namespace",!1,!1)}),["tabIndex","crossOrigin"].forEach(function(e){ae[e]=new ee(e,1,!1,e.toLowerCase(),null,!1,!1)}),ae.xlinkHref=new ee("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1),["src","href","action","formAction"].forEach(function(e){ae[e]=new ee(e,1,!1,e.toLowerCase(),null,!0,!0)});function Ae(e,t,n,r){var l=ae.hasOwnProperty(t)?ae[t]:null;(l!==null?l.type!==0:r||!(2<t.length)||t[0]!=="o"&&t[0]!=="O"||t[1]!=="n"&&t[1]!=="N")&&(te(t,n,l,r)&&(n=null),r||l===null?U(t)&&(n===null?e.removeAttribute(t):e.setAttribute(t,""+n)):l.mustUseProperty?e[l.propertyName]=n===null?l.type===3?!1:"":n:(t=l.attributeName,r=l.attributeNamespace,n===null?e.removeAttribute(t):(l=l.type,n=l===3||l===4&&n===!0?"":""+n,r?e.setAttributeNS(r,t,n):e.setAttribute(t,n))))}var ve=s.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,$=Symbol.for("react.element"),N=Symbol.for("react.portal"),L=Symbol.for("react.fragment"),F=Symbol.for("react.strict_mode"),K=Symbol.for("react.profiler"),ge=Symbol.for("react.provider"),Ne=Symbol.for("react.context"),be=Symbol.for("react.forward_ref"),q=Symbol.for("react.suspense"),Se=Symbol.for("react.suspense_list"),he=Symbol.for("react.memo"),je=Symbol.for("react.lazy"),de=Symbol.for("react.offscreen"),O=Symbol.iterator;function J(e){return e===null||typeof e!="object"?null:(e=O&&e[O]||e["@@iterator"],typeof e=="function"?e:null)}var R=Object.assign,d;function k(e){if(d===void 0)try{throw Error()}catch(n){var t=n.stack.trim().match(/\n( *(at )?)/);d=t&&t[1]||""}return`
`+d+e}var Z=!1;function ne(e,t){if(!e||Z)return"";Z=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(t)if(t=function(){throw Error()},Object.defineProperty(t.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(t,[])}catch(_){var r=_}Reflect.construct(e,[],t)}else{try{t.call()}catch(_){r=_}e.call(t.prototype)}else{try{throw Error()}catch(_){r=_}e()}}catch(_){if(_&&r&&typeof _.stack=="string"){for(var l=_.stack.split(`
`),o=r.stack.split(`
`),i=l.length-1,c=o.length-1;1<=i&&0<=c&&l[i]!==o[c];)c--;for(;1<=i&&0<=c;i--,c--)if(l[i]!==o[c]){if(i!==1||c!==1)do if(i--,c--,0>c||l[i]!==o[c]){var p=`
`+l[i].replace(" at new "," at ");return e.displayName&&p.includes("<anonymous>")&&(p=p.replace("<anonymous>",e.displayName)),p}while(1<=i&&0<=c);break}}}finally{Z=!1,Error.prepareStackTrace=n}return(e=e?e.displayName||e.name:"")?k(e):""}function ue(e){switch(e.tag){case 5:return k(e.type);case 16:return k("Lazy");case 13:return k("Suspense");case 19:return k("SuspenseList");case 0:case 2:case 15:return e=ne(e.type,!1),e;case 11:return e=ne(e.type.render,!1),e;case 1:return e=ne(e.type,!0),e;default:return""}}function ce(e){if(e==null)return null;if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case L:return"Fragment";case N:return"Portal";case K:return"Profiler";case F:return"StrictMode";case q:return"Suspense";case Se:return"SuspenseList"}if(typeof e=="object")switch(e.$$typeof){case Ne:return(e.displayName||"Context")+".Consumer";case ge:return(e._context.displayName||"Context")+".Provider";case be:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case he:return t=e.displayName||null,t!==null?t:ce(e.type)||"Memo";case je:t=e._payload,e=e._init;try{return ce(e(t))}catch{}}return null}function le(e){var t=e.type;switch(e.tag){case 24:return"Cache";case 9:return(t.displayName||"Context")+".Consumer";case 10:return(t._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return e=t.render,e=e.displayName||e.name||"",t.displayName||(e!==""?"ForwardRef("+e+")":"ForwardRef");case 7:return"Fragment";case 5:return t;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return ce(t);case 8:return t===F?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t}return null}function re(e){switch(typeof e){case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function me(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function Ee(e){var t=me(e)?"checked":"value",n=Object.getOwnPropertyDescriptor(e.constructor.prototype,t),r=""+e[t];if(!e.hasOwnProperty(t)&&typeof n<"u"&&typeof n.get=="function"&&typeof n.set=="function"){var l=n.get,o=n.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return l.call(this)},set:function(i){r=""+i,o.call(this,i)}}),Object.defineProperty(e,t,{enumerable:n.enumerable}),{getValue:function(){return r},setValue:function(i){r=""+i},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function Et(e){e._valueTracker||(e._valueTracker=Ee(e))}function xt(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),r="";return e&&(r=me(e)?e.checked?"true":"false":e.value),e=r,e!==n?(t.setValue(e),!0):!1}function ut(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}function ct(e,t){var n=t.checked;return R({},t,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:n??e._wrapperState.initialChecked})}function dl(e,t){var n=t.defaultValue==null?"":t.defaultValue,r=t.checked!=null?t.checked:t.defaultChecked;n=re(t.value!=null?t.value:n),e._wrapperState={initialChecked:r,initialValue:n,controlled:t.type==="checkbox"||t.type==="radio"?t.checked!=null:t.value!=null}}function xr(e,t){t=t.checked,t!=null&&Ae(e,"checked",t,!1)}function dt(e,t){xr(e,t);var n=re(t.value),r=t.type;if(n!=null)r==="number"?(n===0&&e.value===""||e.value!=n)&&(e.value=""+n):e.value!==""+n&&(e.value=""+n);else if(r==="submit"||r==="reset"){e.removeAttribute("value");return}t.hasOwnProperty("value")?en(e,t.type,n):t.hasOwnProperty("defaultValue")&&en(e,t.type,re(t.defaultValue)),t.checked==null&&t.defaultChecked!=null&&(e.defaultChecked=!!t.defaultChecked)}function Cn(e,t,n){if(t.hasOwnProperty("value")||t.hasOwnProperty("defaultValue")){var r=t.type;if(!(r!=="submit"&&r!=="reset"||t.value!==void 0&&t.value!==null))return;t=""+e._wrapperState.initialValue,n||t===e.value||(e.value=t),e.defaultValue=t}n=e.name,n!==""&&(e.name=""),e.defaultChecked=!!e._wrapperState.initialChecked,n!==""&&(e.name=n)}function en(e,t,n){(t!=="number"||ut(e.ownerDocument)!==e)&&(n==null?e.defaultValue=""+e._wrapperState.initialValue:e.defaultValue!==""+n&&(e.defaultValue=""+n))}var Bt=Array.isArray;function Qe(e,t,n,r){if(e=e.options,t){t={};for(var l=0;l<n.length;l++)t["$"+n[l]]=!0;for(n=0;n<e.length;n++)l=t.hasOwnProperty("$"+e[n].value),e[n].selected!==l&&(e[n].selected=l),l&&r&&(e[n].defaultSelected=!0)}else{for(n=""+re(n),t=null,l=0;l<e.length;l++){if(e[l].value===n){e[l].selected=!0,r&&(e[l].defaultSelected=!0);return}t!==null||e[l].disabled||(t=e[l])}t!==null&&(t.selected=!0)}}function An(e,t){if(t.dangerouslySetInnerHTML!=null)throw Error(a(91));return R({},t,{value:void 0,defaultValue:void 0,children:""+e._wrapperState.initialValue})}function vr(e,t){var n=t.value;if(n==null){if(n=t.children,t=t.defaultValue,n!=null){if(t!=null)throw Error(a(92));if(Bt(n)){if(1<n.length)throw Error(a(93));n=n[0]}t=n}t==null&&(t=""),n=t}e._wrapperState={initialValue:re(n)}}function tn(e,t){var n=re(t.value),r=re(t.defaultValue);n!=null&&(n=""+n,n!==e.value&&(e.value=n),t.defaultValue==null&&e.defaultValue!==n&&(e.defaultValue=n)),r!=null&&(e.defaultValue=""+r)}function Ht(e){var t=e.textContent;t===e._wrapperState.initialValue&&t!==""&&t!==null&&(e.value=t)}function Nn(e){switch(e){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function vt(e,t){return e==null||e==="http://www.w3.org/1999/xhtml"?Nn(t):e==="http://www.w3.org/2000/svg"&&t==="foreignObject"?"http://www.w3.org/1999/xhtml":e}var Tn,pl=(function(e){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(t,n,r,l){MSApp.execUnsafeLocalFunction(function(){return e(t,n,r,l)})}:e})(function(e,t){if(e.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in e)e.innerHTML=t;else{for(Tn=Tn||document.createElement("div"),Tn.innerHTML="<svg>"+t.valueOf().toString()+"</svg>",t=Tn.firstChild;e.firstChild;)e.removeChild(e.firstChild);for(;t.firstChild;)e.appendChild(t.firstChild)}});function nn(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&n.nodeType===3){n.nodeValue=t;return}}e.textContent=t}var rn={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},yr=["Webkit","ms","Moz","O"];Object.keys(rn).forEach(function(e){yr.forEach(function(t){t=t+e.charAt(0).toUpperCase()+e.substring(1),rn[t]=rn[e]})});function _r(e,t,n){return t==null||typeof t=="boolean"||t===""?"":n||typeof t!="number"||t===0||rn.hasOwnProperty(e)&&rn[e]?(""+t).trim():t+"px"}function Lt(e,t){e=e.style;for(var n in t)if(t.hasOwnProperty(n)){var r=n.indexOf("--")===0,l=_r(n,t[n],r);n==="float"&&(n="cssFloat"),r?e.setProperty(n,l):e[n]=l}}var Vn=R({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function ln(e,t){if(t){if(Vn[e]&&(t.children!=null||t.dangerouslySetInnerHTML!=null))throw Error(a(137,e));if(t.dangerouslySetInnerHTML!=null){if(t.children!=null)throw Error(a(60));if(typeof t.dangerouslySetInnerHTML!="object"||!("__html"in t.dangerouslySetInnerHTML))throw Error(a(61))}if(t.style!=null&&typeof t.style!="object")throw Error(a(62))}}function wr(e,t){if(e.indexOf("-")===-1)return typeof t.is=="string";switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var kr=null;function Wn(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var br=null,Ct=null,on=null;function fl(e){if(e=Hr(e)){if(typeof br!="function")throw Error(a(280));var t=e.stateNode;t&&(t=Il(t),br(e.stateNode,e.type,t))}}function gl(e){Ct?on?on.push(e):on=[e]:Ct=e}function Sr(){if(Ct){var e=Ct,t=on;if(on=Ct=null,fl(e),t)for(e=0;e<t.length;e++)fl(t[e])}}function S(e,t){return e(t)}function V(){}var se=!1;function Te(e,t,n){if(se)return e(t,n);se=!0;try{return S(e,t,n)}finally{se=!1,(Ct!==null||on!==null)&&(V(),Sr())}}function $e(e,t){var n=e.stateNode;if(n===null)return null;var r=Il(n);if(r===null)return null;n=r[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(r=!r.disabled)||(e=e.type,r=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!r;break e;default:e=!1}if(e)return null;if(n&&typeof n!="function")throw Error(a(231,t,typeof n));return n}var pe=!1;if(E)try{var ye={};Object.defineProperty(ye,"passive",{get:function(){pe=!0}}),window.addEventListener("test",ye,ye),window.removeEventListener("test",ye,ye)}catch{pe=!1}function Pe(e,t,n,r,l,o,i,c,p){var _=Array.prototype.slice.call(arguments,3);try{t.apply(n,_)}catch(P){this.onError(P)}}var Ce=!1,ml=null,hl=!1,Lo=null,up={onError:function(e){Ce=!0,ml=e}};function cp(e,t,n,r,l,o,i,c,p){Ce=!1,ml=null,Pe.apply(up,arguments)}function dp(e,t,n,r,l,o,i,c,p){if(cp.apply(this,arguments),Ce){if(Ce){var _=ml;Ce=!1,ml=null}else throw Error(a(198));hl||(hl=!0,Lo=_)}}function Pn(e){var t=e,n=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,(t.flags&4098)!==0&&(n=t.return),e=t.return;while(e)}return t.tag===3?n:null}function Ks(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function Ys(e){if(Pn(e)!==e)throw Error(a(188))}function pp(e){var t=e.alternate;if(!t){if(t=Pn(e),t===null)throw Error(a(188));return t!==e?null:e}for(var n=e,r=t;;){var l=n.return;if(l===null)break;var o=l.alternate;if(o===null){if(r=l.return,r!==null){n=r;continue}break}if(l.child===o.child){for(o=l.child;o;){if(o===n)return Ys(l),e;if(o===r)return Ys(l),t;o=o.sibling}throw Error(a(188))}if(n.return!==r.return)n=l,r=o;else{for(var i=!1,c=l.child;c;){if(c===n){i=!0,n=l,r=o;break}if(c===r){i=!0,r=l,n=o;break}c=c.sibling}if(!i){for(c=o.child;c;){if(c===n){i=!0,n=o,r=l;break}if(c===r){i=!0,r=o,n=l;break}c=c.sibling}if(!i)throw Error(a(189))}}if(n.alternate!==r)throw Error(a(190))}if(n.tag!==3)throw Error(a(188));return n.stateNode.current===n?e:t}function Qs(e){return e=pp(e),e!==null?Js(e):null}function Js(e){if(e.tag===5||e.tag===6)return e;for(e=e.child;e!==null;){var t=Js(e);if(t!==null)return t;e=e.sibling}return null}var qs=u.unstable_scheduleCallback,Gs=u.unstable_cancelCallback,fp=u.unstable_shouldYield,gp=u.unstable_requestPaint,Fe=u.unstable_now,mp=u.unstable_getCurrentPriorityLevel,Ro=u.unstable_ImmediatePriority,Xs=u.unstable_UserBlockingPriority,xl=u.unstable_NormalPriority,hp=u.unstable_LowPriority,Zs=u.unstable_IdlePriority,vl=null,Rt=null;function xp(e){if(Rt&&typeof Rt.onCommitFiberRoot=="function")try{Rt.onCommitFiberRoot(vl,e,void 0,(e.current.flags&128)===128)}catch{}}var At=Math.clz32?Math.clz32:_p,vp=Math.log,yp=Math.LN2;function _p(e){return e>>>=0,e===0?32:31-(vp(e)/yp|0)|0}var yl=64,_l=4194304;function Er(e){switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return e&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return e}}function wl(e,t){var n=e.pendingLanes;if(n===0)return 0;var r=0,l=e.suspendedLanes,o=e.pingedLanes,i=n&268435455;if(i!==0){var c=i&~l;c!==0?r=Er(c):(o&=i,o!==0&&(r=Er(o)))}else i=n&~l,i!==0?r=Er(i):o!==0&&(r=Er(o));if(r===0)return 0;if(t!==0&&t!==r&&(t&l)===0&&(l=r&-r,o=t&-t,l>=o||l===16&&(o&4194240)!==0))return t;if((r&4)!==0&&(r|=n&16),t=e.entangledLanes,t!==0)for(e=e.entanglements,t&=r;0<t;)n=31-At(t),l=1<<n,r|=e[n],t&=~l;return r}function wp(e,t){switch(e){case 1:case 2:case 4:return t+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function kp(e,t){for(var n=e.suspendedLanes,r=e.pingedLanes,l=e.expirationTimes,o=e.pendingLanes;0<o;){var i=31-At(o),c=1<<i,p=l[i];p===-1?((c&n)===0||(c&r)!==0)&&(l[i]=wp(c,t)):p<=t&&(e.expiredLanes|=c),o&=~c}}function Do(e){return e=e.pendingLanes&-1073741825,e!==0?e:e&1073741824?1073741824:0}function ei(){var e=yl;return yl<<=1,(yl&4194240)===0&&(yl=64),e}function Io(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function Cr(e,t,n){e.pendingLanes|=t,t!==536870912&&(e.suspendedLanes=0,e.pingedLanes=0),e=e.eventTimes,t=31-At(t),e[t]=n}function bp(e,t){var n=e.pendingLanes&~t;e.pendingLanes=t,e.suspendedLanes=0,e.pingedLanes=0,e.expiredLanes&=t,e.mutableReadLanes&=t,e.entangledLanes&=t,t=e.entanglements;var r=e.eventTimes;for(e=e.expirationTimes;0<n;){var l=31-At(n),o=1<<l;t[l]=0,r[l]=-1,e[l]=-1,n&=~o}}function Oo(e,t){var n=e.entangledLanes|=t;for(e=e.entanglements;n;){var r=31-At(n),l=1<<r;l&t|e[r]&t&&(e[r]|=t),n&=~l}}var ke=0;function ti(e){return e&=-e,1<e?4<e?(e&268435455)!==0?16:536870912:4:1}var ni,$o,ri,li,oi,Fo=!1,kl=[],an=null,sn=null,un=null,Ar=new Map,Nr=new Map,cn=[],Sp="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function ai(e,t){switch(e){case"focusin":case"focusout":an=null;break;case"dragenter":case"dragleave":sn=null;break;case"mouseover":case"mouseout":un=null;break;case"pointerover":case"pointerout":Ar.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":Nr.delete(t.pointerId)}}function Tr(e,t,n,r,l,o){return e===null||e.nativeEvent!==o?(e={blockedOn:t,domEventName:n,eventSystemFlags:r,nativeEvent:o,targetContainers:[l]},t!==null&&(t=Hr(t),t!==null&&$o(t)),e):(e.eventSystemFlags|=r,t=e.targetContainers,l!==null&&t.indexOf(l)===-1&&t.push(l),e)}function Ep(e,t,n,r,l){switch(t){case"focusin":return an=Tr(an,e,t,n,r,l),!0;case"dragenter":return sn=Tr(sn,e,t,n,r,l),!0;case"mouseover":return un=Tr(un,e,t,n,r,l),!0;case"pointerover":var o=l.pointerId;return Ar.set(o,Tr(Ar.get(o)||null,e,t,n,r,l)),!0;case"gotpointercapture":return o=l.pointerId,Nr.set(o,Tr(Nr.get(o)||null,e,t,n,r,l)),!0}return!1}function si(e){var t=jn(e.target);if(t!==null){var n=Pn(t);if(n!==null){if(t=n.tag,t===13){if(t=Ks(n),t!==null){e.blockedOn=t,oi(e.priority,function(){ri(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}e.blockedOn=null}function bl(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var n=Bo(e.domEventName,e.eventSystemFlags,t[0],e.nativeEvent);if(n===null){n=e.nativeEvent;var r=new n.constructor(n.type,n);kr=r,n.target.dispatchEvent(r),kr=null}else return t=Hr(n),t!==null&&$o(t),e.blockedOn=n,!1;t.shift()}return!0}function ii(e,t,n){bl(e)&&n.delete(t)}function Cp(){Fo=!1,an!==null&&bl(an)&&(an=null),sn!==null&&bl(sn)&&(sn=null),un!==null&&bl(un)&&(un=null),Ar.forEach(ii),Nr.forEach(ii)}function Pr(e,t){e.blockedOn===t&&(e.blockedOn=null,Fo||(Fo=!0,u.unstable_scheduleCallback(u.unstable_NormalPriority,Cp)))}function jr(e){function t(l){return Pr(l,e)}if(0<kl.length){Pr(kl[0],e);for(var n=1;n<kl.length;n++){var r=kl[n];r.blockedOn===e&&(r.blockedOn=null)}}for(an!==null&&Pr(an,e),sn!==null&&Pr(sn,e),un!==null&&Pr(un,e),Ar.forEach(t),Nr.forEach(t),n=0;n<cn.length;n++)r=cn[n],r.blockedOn===e&&(r.blockedOn=null);for(;0<cn.length&&(n=cn[0],n.blockedOn===null);)si(n),n.blockedOn===null&&cn.shift()}var Kn=ve.ReactCurrentBatchConfig,Sl=!0;function Ap(e,t,n,r){var l=ke,o=Kn.transition;Kn.transition=null;try{ke=1,Uo(e,t,n,r)}finally{ke=l,Kn.transition=o}}function Np(e,t,n,r){var l=ke,o=Kn.transition;Kn.transition=null;try{ke=4,Uo(e,t,n,r)}finally{ke=l,Kn.transition=o}}function Uo(e,t,n,r){if(Sl){var l=Bo(e,t,n,r);if(l===null)oa(e,t,r,El,n),ai(e,r);else if(Ep(l,e,t,n,r))r.stopPropagation();else if(ai(e,r),t&4&&-1<Sp.indexOf(e)){for(;l!==null;){var o=Hr(l);if(o!==null&&ni(o),o=Bo(e,t,n,r),o===null&&oa(e,t,r,El,n),o===l)break;l=o}l!==null&&r.stopPropagation()}else oa(e,t,r,null,n)}}var El=null;function Bo(e,t,n,r){if(El=null,e=Wn(r),e=jn(e),e!==null)if(t=Pn(e),t===null)e=null;else if(n=t.tag,n===13){if(e=Ks(t),e!==null)return e;e=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null);return El=e,null}function ui(e){switch(e){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(mp()){case Ro:return 1;case Xs:return 4;case xl:case hp:return 16;case Zs:return 536870912;default:return 16}default:return 16}}var dn=null,Ho=null,Cl=null;function ci(){if(Cl)return Cl;var e,t=Ho,n=t.length,r,l="value"in dn?dn.value:dn.textContent,o=l.length;for(e=0;e<n&&t[e]===l[e];e++);var i=n-e;for(r=1;r<=i&&t[n-r]===l[o-r];r++);return Cl=l.slice(e,1<r?1-r:void 0)}function Al(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function Nl(){return!0}function di(){return!1}function pt(e){function t(n,r,l,o,i){this._reactName=n,this._targetInst=l,this.type=r,this.nativeEvent=o,this.target=i,this.currentTarget=null;for(var c in e)e.hasOwnProperty(c)&&(n=e[c],this[c]=n?n(o):o[c]);return this.isDefaultPrevented=(o.defaultPrevented!=null?o.defaultPrevented:o.returnValue===!1)?Nl:di,this.isPropagationStopped=di,this}return R(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=Nl)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=Nl)},persist:function(){},isPersistent:Nl}),t}var Yn={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Vo=pt(Yn),zr=R({},Yn,{view:0,detail:0}),Tp=pt(zr),Wo,Ko,Mr,Tl=R({},zr,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Qo,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==Mr&&(Mr&&e.type==="mousemove"?(Wo=e.screenX-Mr.screenX,Ko=e.screenY-Mr.screenY):Ko=Wo=0,Mr=e),Wo)},movementY:function(e){return"movementY"in e?e.movementY:Ko}}),pi=pt(Tl),Pp=R({},Tl,{dataTransfer:0}),jp=pt(Pp),zp=R({},zr,{relatedTarget:0}),Yo=pt(zp),Mp=R({},Yn,{animationName:0,elapsedTime:0,pseudoElement:0}),Lp=pt(Mp),Rp=R({},Yn,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),Dp=pt(Rp),Ip=R({},Yn,{data:0}),fi=pt(Ip),Op={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},$p={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Fp={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Up(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=Fp[e])?!!t[e]:!1}function Qo(){return Up}var Bp=R({},zr,{key:function(e){if(e.key){var t=Op[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=Al(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?$p[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Qo,charCode:function(e){return e.type==="keypress"?Al(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?Al(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),Hp=pt(Bp),Vp=R({},Tl,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),gi=pt(Vp),Wp=R({},zr,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Qo}),Kp=pt(Wp),Yp=R({},Yn,{propertyName:0,elapsedTime:0,pseudoElement:0}),Qp=pt(Yp),Jp=R({},Tl,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),qp=pt(Jp),Gp=[9,13,27,32],Jo=E&&"CompositionEvent"in window,Lr=null;E&&"documentMode"in document&&(Lr=document.documentMode);var Xp=E&&"TextEvent"in window&&!Lr,mi=E&&(!Jo||Lr&&8<Lr&&11>=Lr),hi=" ",xi=!1;function vi(e,t){switch(e){case"keyup":return Gp.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function yi(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var Qn=!1;function Zp(e,t){switch(e){case"compositionend":return yi(t);case"keypress":return t.which!==32?null:(xi=!0,hi);case"textInput":return e=t.data,e===hi&&xi?null:e;default:return null}}function ef(e,t){if(Qn)return e==="compositionend"||!Jo&&vi(e,t)?(e=ci(),Cl=Ho=dn=null,Qn=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return mi&&t.locale!=="ko"?null:t.data;default:return null}}var tf={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function _i(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!tf[e.type]:t==="textarea"}function wi(e,t,n,r){gl(r),t=Ll(t,"onChange"),0<t.length&&(n=new Vo("onChange","change",null,n,r),e.push({event:n,listeners:t}))}var Rr=null,Dr=null;function nf(e){$i(e,0)}function Pl(e){var t=Zn(e);if(xt(t))return e}function rf(e,t){if(e==="change")return t}var ki=!1;if(E){var qo;if(E){var Go="oninput"in document;if(!Go){var bi=document.createElement("div");bi.setAttribute("oninput","return;"),Go=typeof bi.oninput=="function"}qo=Go}else qo=!1;ki=qo&&(!document.documentMode||9<document.documentMode)}function Si(){Rr&&(Rr.detachEvent("onpropertychange",Ei),Dr=Rr=null)}function Ei(e){if(e.propertyName==="value"&&Pl(Dr)){var t=[];wi(t,Dr,e,Wn(e)),Te(nf,t)}}function lf(e,t,n){e==="focusin"?(Si(),Rr=t,Dr=n,Rr.attachEvent("onpropertychange",Ei)):e==="focusout"&&Si()}function of(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return Pl(Dr)}function af(e,t){if(e==="click")return Pl(t)}function sf(e,t){if(e==="input"||e==="change")return Pl(t)}function uf(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var Nt=typeof Object.is=="function"?Object.is:uf;function Ir(e,t){if(Nt(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var n=Object.keys(e),r=Object.keys(t);if(n.length!==r.length)return!1;for(r=0;r<n.length;r++){var l=n[r];if(!w.call(t,l)||!Nt(e[l],t[l]))return!1}return!0}function Ci(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function Ai(e,t){var n=Ci(e);e=0;for(var r;n;){if(n.nodeType===3){if(r=e+n.textContent.length,e<=t&&r>=t)return{node:n,offset:t-e};e=r}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=Ci(n)}}function Ni(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?Ni(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function Ti(){for(var e=window,t=ut();t instanceof e.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href=="string"}catch{n=!1}if(n)e=t.contentWindow;else break;t=ut(e.document)}return t}function Xo(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}function cf(e){var t=Ti(),n=e.focusedElem,r=e.selectionRange;if(t!==n&&n&&n.ownerDocument&&Ni(n.ownerDocument.documentElement,n)){if(r!==null&&Xo(n)){if(t=r.start,e=r.end,e===void 0&&(e=t),"selectionStart"in n)n.selectionStart=t,n.selectionEnd=Math.min(e,n.value.length);else if(e=(t=n.ownerDocument||document)&&t.defaultView||window,e.getSelection){e=e.getSelection();var l=n.textContent.length,o=Math.min(r.start,l);r=r.end===void 0?o:Math.min(r.end,l),!e.extend&&o>r&&(l=r,r=o,o=l),l=Ai(n,o);var i=Ai(n,r);l&&i&&(e.rangeCount!==1||e.anchorNode!==l.node||e.anchorOffset!==l.offset||e.focusNode!==i.node||e.focusOffset!==i.offset)&&(t=t.createRange(),t.setStart(l.node,l.offset),e.removeAllRanges(),o>r?(e.addRange(t),e.extend(i.node,i.offset)):(t.setEnd(i.node,i.offset),e.addRange(t)))}}for(t=[],e=n;e=e.parentNode;)e.nodeType===1&&t.push({element:e,left:e.scrollLeft,top:e.scrollTop});for(typeof n.focus=="function"&&n.focus(),n=0;n<t.length;n++)e=t[n],e.element.scrollLeft=e.left,e.element.scrollTop=e.top}}var df=E&&"documentMode"in document&&11>=document.documentMode,Jn=null,Zo=null,Or=null,ea=!1;function Pi(e,t,n){var r=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;ea||Jn==null||Jn!==ut(r)||(r=Jn,"selectionStart"in r&&Xo(r)?r={start:r.selectionStart,end:r.selectionEnd}:(r=(r.ownerDocument&&r.ownerDocument.defaultView||window).getSelection(),r={anchorNode:r.anchorNode,anchorOffset:r.anchorOffset,focusNode:r.focusNode,focusOffset:r.focusOffset}),Or&&Ir(Or,r)||(Or=r,r=Ll(Zo,"onSelect"),0<r.length&&(t=new Vo("onSelect","select",null,t,n),e.push({event:t,listeners:r}),t.target=Jn)))}function jl(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n["Webkit"+e]="webkit"+t,n["Moz"+e]="moz"+t,n}var qn={animationend:jl("Animation","AnimationEnd"),animationiteration:jl("Animation","AnimationIteration"),animationstart:jl("Animation","AnimationStart"),transitionend:jl("Transition","TransitionEnd")},ta={},ji={};E&&(ji=document.createElement("div").style,"AnimationEvent"in window||(delete qn.animationend.animation,delete qn.animationiteration.animation,delete qn.animationstart.animation),"TransitionEvent"in window||delete qn.transitionend.transition);function zl(e){if(ta[e])return ta[e];if(!qn[e])return e;var t=qn[e],n;for(n in t)if(t.hasOwnProperty(n)&&n in ji)return ta[e]=t[n];return e}var zi=zl("animationend"),Mi=zl("animationiteration"),Li=zl("animationstart"),Ri=zl("transitionend"),Di=new Map,Ii="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function pn(e,t){Di.set(e,t),h(t,[e])}for(var na=0;na<Ii.length;na++){var ra=Ii[na],pf=ra.toLowerCase(),ff=ra[0].toUpperCase()+ra.slice(1);pn(pf,"on"+ff)}pn(zi,"onAnimationEnd"),pn(Mi,"onAnimationIteration"),pn(Li,"onAnimationStart"),pn("dblclick","onDoubleClick"),pn("focusin","onFocus"),pn("focusout","onBlur"),pn(Ri,"onTransitionEnd"),A("onMouseEnter",["mouseout","mouseover"]),A("onMouseLeave",["mouseout","mouseover"]),A("onPointerEnter",["pointerout","pointerover"]),A("onPointerLeave",["pointerout","pointerover"]),h("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),h("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),h("onBeforeInput",["compositionend","keypress","textInput","paste"]),h("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),h("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),h("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var $r="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),gf=new Set("cancel close invalid load scroll toggle".split(" ").concat($r));function Oi(e,t,n){var r=e.type||"unknown-event";e.currentTarget=n,dp(r,t,void 0,e),e.currentTarget=null}function $i(e,t){t=(t&4)!==0;for(var n=0;n<e.length;n++){var r=e[n],l=r.event;r=r.listeners;e:{var o=void 0;if(t)for(var i=r.length-1;0<=i;i--){var c=r[i],p=c.instance,_=c.currentTarget;if(c=c.listener,p!==o&&l.isPropagationStopped())break e;Oi(l,c,_),o=p}else for(i=0;i<r.length;i++){if(c=r[i],p=c.instance,_=c.currentTarget,c=c.listener,p!==o&&l.isPropagationStopped())break e;Oi(l,c,_),o=p}}}if(hl)throw e=Lo,hl=!1,Lo=null,e}function Me(e,t){var n=t[da];n===void 0&&(n=t[da]=new Set);var r=e+"__bubble";n.has(r)||(Fi(t,e,2,!1),n.add(r))}function la(e,t,n){var r=0;t&&(r|=4),Fi(n,e,r,t)}var Ml="_reactListening"+Math.random().toString(36).slice(2);function Fr(e){if(!e[Ml]){e[Ml]=!0,f.forEach(function(n){n!=="selectionchange"&&(gf.has(n)||la(n,!1,e),la(n,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[Ml]||(t[Ml]=!0,la("selectionchange",!1,t))}}function Fi(e,t,n,r){switch(ui(t)){case 1:var l=Ap;break;case 4:l=Np;break;default:l=Uo}n=l.bind(null,t,n,e),l=void 0,!pe||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(l=!0),r?l!==void 0?e.addEventListener(t,n,{capture:!0,passive:l}):e.addEventListener(t,n,!0):l!==void 0?e.addEventListener(t,n,{passive:l}):e.addEventListener(t,n,!1)}function oa(e,t,n,r,l){var o=r;if((t&1)===0&&(t&2)===0&&r!==null)e:for(;;){if(r===null)return;var i=r.tag;if(i===3||i===4){var c=r.stateNode.containerInfo;if(c===l||c.nodeType===8&&c.parentNode===l)break;if(i===4)for(i=r.return;i!==null;){var p=i.tag;if((p===3||p===4)&&(p=i.stateNode.containerInfo,p===l||p.nodeType===8&&p.parentNode===l))return;i=i.return}for(;c!==null;){if(i=jn(c),i===null)return;if(p=i.tag,p===5||p===6){r=o=i;continue e}c=c.parentNode}}r=r.return}Te(function(){var _=o,P=Wn(n),M=[];e:{var T=Di.get(e);if(T!==void 0){var B=Vo,W=e;switch(e){case"keypress":if(Al(n)===0)break e;case"keydown":case"keyup":B=Hp;break;case"focusin":W="focus",B=Yo;break;case"focusout":W="blur",B=Yo;break;case"beforeblur":case"afterblur":B=Yo;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":B=pi;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":B=jp;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":B=Kp;break;case zi:case Mi:case Li:B=Lp;break;case Ri:B=Qp;break;case"scroll":B=Tp;break;case"wheel":B=qp;break;case"copy":case"cut":case"paste":B=Dp;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":B=gi}var Y=(t&4)!==0,Ue=!Y&&e==="scroll",v=Y?T!==null?T+"Capture":null:T;Y=[];for(var m=_,y;m!==null;){y=m;var I=y.stateNode;if(y.tag===5&&I!==null&&(y=I,v!==null&&(I=$e(m,v),I!=null&&Y.push(Ur(m,I,y)))),Ue)break;m=m.return}0<Y.length&&(T=new B(T,W,null,n,P),M.push({event:T,listeners:Y}))}}if((t&7)===0){e:{if(T=e==="mouseover"||e==="pointerover",B=e==="mouseout"||e==="pointerout",T&&n!==kr&&(W=n.relatedTarget||n.fromElement)&&(jn(W)||W[Vt]))break e;if((B||T)&&(T=P.window===P?P:(T=P.ownerDocument)?T.defaultView||T.parentWindow:window,B?(W=n.relatedTarget||n.toElement,B=_,W=W?jn(W):null,W!==null&&(Ue=Pn(W),W!==Ue||W.tag!==5&&W.tag!==6)&&(W=null)):(B=null,W=_),B!==W)){if(Y=pi,I="onMouseLeave",v="onMouseEnter",m="mouse",(e==="pointerout"||e==="pointerover")&&(Y=gi,I="onPointerLeave",v="onPointerEnter",m="pointer"),Ue=B==null?T:Zn(B),y=W==null?T:Zn(W),T=new Y(I,m+"leave",B,n,P),T.target=Ue,T.relatedTarget=y,I=null,jn(P)===_&&(Y=new Y(v,m+"enter",W,n,P),Y.target=y,Y.relatedTarget=Ue,I=Y),Ue=I,B&&W)t:{for(Y=B,v=W,m=0,y=Y;y;y=Gn(y))m++;for(y=0,I=v;I;I=Gn(I))y++;for(;0<m-y;)Y=Gn(Y),m--;for(;0<y-m;)v=Gn(v),y--;for(;m--;){if(Y===v||v!==null&&Y===v.alternate)break t;Y=Gn(Y),v=Gn(v)}Y=null}else Y=null;B!==null&&Ui(M,T,B,Y,!1),W!==null&&Ue!==null&&Ui(M,Ue,W,Y,!0)}}e:{if(T=_?Zn(_):window,B=T.nodeName&&T.nodeName.toLowerCase(),B==="select"||B==="input"&&T.type==="file")var Q=rf;else if(_i(T))if(ki)Q=sf;else{Q=of;var G=lf}else(B=T.nodeName)&&B.toLowerCase()==="input"&&(T.type==="checkbox"||T.type==="radio")&&(Q=af);if(Q&&(Q=Q(e,_))){wi(M,Q,n,P);break e}G&&G(e,T,_),e==="focusout"&&(G=T._wrapperState)&&G.controlled&&T.type==="number"&&en(T,"number",T.value)}switch(G=_?Zn(_):window,e){case"focusin":(_i(G)||G.contentEditable==="true")&&(Jn=G,Zo=_,Or=null);break;case"focusout":Or=Zo=Jn=null;break;case"mousedown":ea=!0;break;case"contextmenu":case"mouseup":case"dragend":ea=!1,Pi(M,n,P);break;case"selectionchange":if(df)break;case"keydown":case"keyup":Pi(M,n,P)}var X;if(Jo)e:{switch(e){case"compositionstart":var oe="onCompositionStart";break e;case"compositionend":oe="onCompositionEnd";break e;case"compositionupdate":oe="onCompositionUpdate";break e}oe=void 0}else Qn?vi(e,n)&&(oe="onCompositionEnd"):e==="keydown"&&n.keyCode===229&&(oe="onCompositionStart");oe&&(mi&&n.locale!=="ko"&&(Qn||oe!=="onCompositionStart"?oe==="onCompositionEnd"&&Qn&&(X=ci()):(dn=P,Ho="value"in dn?dn.value:dn.textContent,Qn=!0)),G=Ll(_,oe),0<G.length&&(oe=new fi(oe,e,null,n,P),M.push({event:oe,listeners:G}),X?oe.data=X:(X=yi(n),X!==null&&(oe.data=X)))),(X=Xp?Zp(e,n):ef(e,n))&&(_=Ll(_,"onBeforeInput"),0<_.length&&(P=new fi("onBeforeInput","beforeinput",null,n,P),M.push({event:P,listeners:_}),P.data=X))}$i(M,t)})}function Ur(e,t,n){return{instance:e,listener:t,currentTarget:n}}function Ll(e,t){for(var n=t+"Capture",r=[];e!==null;){var l=e,o=l.stateNode;l.tag===5&&o!==null&&(l=o,o=$e(e,n),o!=null&&r.unshift(Ur(e,o,l)),o=$e(e,t),o!=null&&r.push(Ur(e,o,l))),e=e.return}return r}function Gn(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5);return e||null}function Ui(e,t,n,r,l){for(var o=t._reactName,i=[];n!==null&&n!==r;){var c=n,p=c.alternate,_=c.stateNode;if(p!==null&&p===r)break;c.tag===5&&_!==null&&(c=_,l?(p=$e(n,o),p!=null&&i.unshift(Ur(n,p,c))):l||(p=$e(n,o),p!=null&&i.push(Ur(n,p,c)))),n=n.return}i.length!==0&&e.push({event:t,listeners:i})}var mf=/\r\n?/g,hf=/\u0000|\uFFFD/g;function Bi(e){return(typeof e=="string"?e:""+e).replace(mf,`
`).replace(hf,"")}function Rl(e,t,n){if(t=Bi(t),Bi(e)!==t&&n)throw Error(a(425))}function Dl(){}var aa=null,sa=null;function ia(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var ua=typeof setTimeout=="function"?setTimeout:void 0,xf=typeof clearTimeout=="function"?clearTimeout:void 0,Hi=typeof Promise=="function"?Promise:void 0,vf=typeof queueMicrotask=="function"?queueMicrotask:typeof Hi<"u"?function(e){return Hi.resolve(null).then(e).catch(yf)}:ua;function yf(e){setTimeout(function(){throw e})}function ca(e,t){var n=t,r=0;do{var l=n.nextSibling;if(e.removeChild(n),l&&l.nodeType===8)if(n=l.data,n==="/$"){if(r===0){e.removeChild(l),jr(t);return}r--}else n!=="$"&&n!=="$?"&&n!=="$!"||r++;n=l}while(n);jr(t)}function fn(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?")break;if(t==="/$")return null}}return e}function Vi(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="$"||n==="$!"||n==="$?"){if(t===0)return e;t--}else n==="/$"&&t++}e=e.previousSibling}return null}var Xn=Math.random().toString(36).slice(2),Dt="__reactFiber$"+Xn,Br="__reactProps$"+Xn,Vt="__reactContainer$"+Xn,da="__reactEvents$"+Xn,_f="__reactListeners$"+Xn,wf="__reactHandles$"+Xn;function jn(e){var t=e[Dt];if(t)return t;for(var n=e.parentNode;n;){if(t=n[Vt]||n[Dt]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(e=Vi(e);e!==null;){if(n=e[Dt])return n;e=Vi(e)}return t}e=n,n=e.parentNode}return null}function Hr(e){return e=e[Dt]||e[Vt],!e||e.tag!==5&&e.tag!==6&&e.tag!==13&&e.tag!==3?null:e}function Zn(e){if(e.tag===5||e.tag===6)return e.stateNode;throw Error(a(33))}function Il(e){return e[Br]||null}var pa=[],er=-1;function gn(e){return{current:e}}function Le(e){0>er||(e.current=pa[er],pa[er]=null,er--)}function ze(e,t){er++,pa[er]=e.current,e.current=t}var mn={},Ge=gn(mn),lt=gn(!1),zn=mn;function tr(e,t){var n=e.type.contextTypes;if(!n)return mn;var r=e.stateNode;if(r&&r.__reactInternalMemoizedUnmaskedChildContext===t)return r.__reactInternalMemoizedMaskedChildContext;var l={},o;for(o in n)l[o]=t[o];return r&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=t,e.__reactInternalMemoizedMaskedChildContext=l),l}function ot(e){return e=e.childContextTypes,e!=null}function Ol(){Le(lt),Le(Ge)}function Wi(e,t,n){if(Ge.current!==mn)throw Error(a(168));ze(Ge,t),ze(lt,n)}function Ki(e,t,n){var r=e.stateNode;if(t=t.childContextTypes,typeof r.getChildContext!="function")return n;r=r.getChildContext();for(var l in r)if(!(l in t))throw Error(a(108,le(e)||"Unknown",l));return R({},n,r)}function $l(e){return e=(e=e.stateNode)&&e.__reactInternalMemoizedMergedChildContext||mn,zn=Ge.current,ze(Ge,e),ze(lt,lt.current),!0}function Yi(e,t,n){var r=e.stateNode;if(!r)throw Error(a(169));n?(e=Ki(e,t,zn),r.__reactInternalMemoizedMergedChildContext=e,Le(lt),Le(Ge),ze(Ge,e)):Le(lt),ze(lt,n)}var Wt=null,Fl=!1,fa=!1;function Qi(e){Wt===null?Wt=[e]:Wt.push(e)}function kf(e){Fl=!0,Qi(e)}function hn(){if(!fa&&Wt!==null){fa=!0;var e=0,t=ke;try{var n=Wt;for(ke=1;e<n.length;e++){var r=n[e];do r=r(!0);while(r!==null)}Wt=null,Fl=!1}catch(l){throw Wt!==null&&(Wt=Wt.slice(e+1)),qs(Ro,hn),l}finally{ke=t,fa=!1}}return null}var nr=[],rr=0,Ul=null,Bl=0,yt=[],_t=0,Mn=null,Kt=1,Yt="";function Ln(e,t){nr[rr++]=Bl,nr[rr++]=Ul,Ul=e,Bl=t}function Ji(e,t,n){yt[_t++]=Kt,yt[_t++]=Yt,yt[_t++]=Mn,Mn=e;var r=Kt;e=Yt;var l=32-At(r)-1;r&=~(1<<l),n+=1;var o=32-At(t)+l;if(30<o){var i=l-l%5;o=(r&(1<<i)-1).toString(32),r>>=i,l-=i,Kt=1<<32-At(t)+l|n<<l|r,Yt=o+e}else Kt=1<<o|n<<l|r,Yt=e}function ga(e){e.return!==null&&(Ln(e,1),Ji(e,1,0))}function ma(e){for(;e===Ul;)Ul=nr[--rr],nr[rr]=null,Bl=nr[--rr],nr[rr]=null;for(;e===Mn;)Mn=yt[--_t],yt[_t]=null,Yt=yt[--_t],yt[_t]=null,Kt=yt[--_t],yt[_t]=null}var ft=null,gt=null,Re=!1,Tt=null;function qi(e,t){var n=St(5,null,null,0);n.elementType="DELETED",n.stateNode=t,n.return=e,t=e.deletions,t===null?(e.deletions=[n],e.flags|=16):t.push(n)}function Gi(e,t){switch(e.tag){case 5:var n=e.type;return t=t.nodeType!==1||n.toLowerCase()!==t.nodeName.toLowerCase()?null:t,t!==null?(e.stateNode=t,ft=e,gt=fn(t.firstChild),!0):!1;case 6:return t=e.pendingProps===""||t.nodeType!==3?null:t,t!==null?(e.stateNode=t,ft=e,gt=null,!0):!1;case 13:return t=t.nodeType!==8?null:t,t!==null?(n=Mn!==null?{id:Kt,overflow:Yt}:null,e.memoizedState={dehydrated:t,treeContext:n,retryLane:1073741824},n=St(18,null,null,0),n.stateNode=t,n.return=e,e.child=n,ft=e,gt=null,!0):!1;default:return!1}}function ha(e){return(e.mode&1)!==0&&(e.flags&128)===0}function xa(e){if(Re){var t=gt;if(t){var n=t;if(!Gi(e,t)){if(ha(e))throw Error(a(418));t=fn(n.nextSibling);var r=ft;t&&Gi(e,t)?qi(r,n):(e.flags=e.flags&-4097|2,Re=!1,ft=e)}}else{if(ha(e))throw Error(a(418));e.flags=e.flags&-4097|2,Re=!1,ft=e}}}function Xi(e){for(e=e.return;e!==null&&e.tag!==5&&e.tag!==3&&e.tag!==13;)e=e.return;ft=e}function Hl(e){if(e!==ft)return!1;if(!Re)return Xi(e),Re=!0,!1;var t;if((t=e.tag!==3)&&!(t=e.tag!==5)&&(t=e.type,t=t!=="head"&&t!=="body"&&!ia(e.type,e.memoizedProps)),t&&(t=gt)){if(ha(e))throw Zi(),Error(a(418));for(;t;)qi(e,t),t=fn(t.nextSibling)}if(Xi(e),e.tag===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(a(317));e:{for(e=e.nextSibling,t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="/$"){if(t===0){gt=fn(e.nextSibling);break e}t--}else n!=="$"&&n!=="$!"&&n!=="$?"||t++}e=e.nextSibling}gt=null}}else gt=ft?fn(e.stateNode.nextSibling):null;return!0}function Zi(){for(var e=gt;e;)e=fn(e.nextSibling)}function lr(){gt=ft=null,Re=!1}function va(e){Tt===null?Tt=[e]:Tt.push(e)}var bf=ve.ReactCurrentBatchConfig;function Vr(e,t,n){if(e=n.ref,e!==null&&typeof e!="function"&&typeof e!="object"){if(n._owner){if(n=n._owner,n){if(n.tag!==1)throw Error(a(309));var r=n.stateNode}if(!r)throw Error(a(147,e));var l=r,o=""+e;return t!==null&&t.ref!==null&&typeof t.ref=="function"&&t.ref._stringRef===o?t.ref:(t=function(i){var c=l.refs;i===null?delete c[o]:c[o]=i},t._stringRef=o,t)}if(typeof e!="string")throw Error(a(284));if(!n._owner)throw Error(a(290,e))}return e}function Vl(e,t){throw e=Object.prototype.toString.call(t),Error(a(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e))}function eu(e){var t=e._init;return t(e._payload)}function tu(e){function t(v,m){if(e){var y=v.deletions;y===null?(v.deletions=[m],v.flags|=16):y.push(m)}}function n(v,m){if(!e)return null;for(;m!==null;)t(v,m),m=m.sibling;return null}function r(v,m){for(v=new Map;m!==null;)m.key!==null?v.set(m.key,m):v.set(m.index,m),m=m.sibling;return v}function l(v,m){return v=Sn(v,m),v.index=0,v.sibling=null,v}function o(v,m,y){return v.index=y,e?(y=v.alternate,y!==null?(y=y.index,y<m?(v.flags|=2,m):y):(v.flags|=2,m)):(v.flags|=1048576,m)}function i(v){return e&&v.alternate===null&&(v.flags|=2),v}function c(v,m,y,I){return m===null||m.tag!==6?(m=us(y,v.mode,I),m.return=v,m):(m=l(m,y),m.return=v,m)}function p(v,m,y,I){var Q=y.type;return Q===L?P(v,m,y.props.children,I,y.key):m!==null&&(m.elementType===Q||typeof Q=="object"&&Q!==null&&Q.$$typeof===je&&eu(Q)===m.type)?(I=l(m,y.props),I.ref=Vr(v,m,y),I.return=v,I):(I=mo(y.type,y.key,y.props,null,v.mode,I),I.ref=Vr(v,m,y),I.return=v,I)}function _(v,m,y,I){return m===null||m.tag!==4||m.stateNode.containerInfo!==y.containerInfo||m.stateNode.implementation!==y.implementation?(m=cs(y,v.mode,I),m.return=v,m):(m=l(m,y.children||[]),m.return=v,m)}function P(v,m,y,I,Q){return m===null||m.tag!==7?(m=Bn(y,v.mode,I,Q),m.return=v,m):(m=l(m,y),m.return=v,m)}function M(v,m,y){if(typeof m=="string"&&m!==""||typeof m=="number")return m=us(""+m,v.mode,y),m.return=v,m;if(typeof m=="object"&&m!==null){switch(m.$$typeof){case $:return y=mo(m.type,m.key,m.props,null,v.mode,y),y.ref=Vr(v,null,m),y.return=v,y;case N:return m=cs(m,v.mode,y),m.return=v,m;case je:var I=m._init;return M(v,I(m._payload),y)}if(Bt(m)||J(m))return m=Bn(m,v.mode,y,null),m.return=v,m;Vl(v,m)}return null}function T(v,m,y,I){var Q=m!==null?m.key:null;if(typeof y=="string"&&y!==""||typeof y=="number")return Q!==null?null:c(v,m,""+y,I);if(typeof y=="object"&&y!==null){switch(y.$$typeof){case $:return y.key===Q?p(v,m,y,I):null;case N:return y.key===Q?_(v,m,y,I):null;case je:return Q=y._init,T(v,m,Q(y._payload),I)}if(Bt(y)||J(y))return Q!==null?null:P(v,m,y,I,null);Vl(v,y)}return null}function B(v,m,y,I,Q){if(typeof I=="string"&&I!==""||typeof I=="number")return v=v.get(y)||null,c(m,v,""+I,Q);if(typeof I=="object"&&I!==null){switch(I.$$typeof){case $:return v=v.get(I.key===null?y:I.key)||null,p(m,v,I,Q);case N:return v=v.get(I.key===null?y:I.key)||null,_(m,v,I,Q);case je:var G=I._init;return B(v,m,y,G(I._payload),Q)}if(Bt(I)||J(I))return v=v.get(y)||null,P(m,v,I,Q,null);Vl(m,I)}return null}function W(v,m,y,I){for(var Q=null,G=null,X=m,oe=m=0,Ye=null;X!==null&&oe<y.length;oe++){X.index>oe?(Ye=X,X=null):Ye=X.sibling;var _e=T(v,X,y[oe],I);if(_e===null){X===null&&(X=Ye);break}e&&X&&_e.alternate===null&&t(v,X),m=o(_e,m,oe),G===null?Q=_e:G.sibling=_e,G=_e,X=Ye}if(oe===y.length)return n(v,X),Re&&Ln(v,oe),Q;if(X===null){for(;oe<y.length;oe++)X=M(v,y[oe],I),X!==null&&(m=o(X,m,oe),G===null?Q=X:G.sibling=X,G=X);return Re&&Ln(v,oe),Q}for(X=r(v,X);oe<y.length;oe++)Ye=B(X,v,oe,y[oe],I),Ye!==null&&(e&&Ye.alternate!==null&&X.delete(Ye.key===null?oe:Ye.key),m=o(Ye,m,oe),G===null?Q=Ye:G.sibling=Ye,G=Ye);return e&&X.forEach(function(En){return t(v,En)}),Re&&Ln(v,oe),Q}function Y(v,m,y,I){var Q=J(y);if(typeof Q!="function")throw Error(a(150));if(y=Q.call(y),y==null)throw Error(a(151));for(var G=Q=null,X=m,oe=m=0,Ye=null,_e=y.next();X!==null&&!_e.done;oe++,_e=y.next()){X.index>oe?(Ye=X,X=null):Ye=X.sibling;var En=T(v,X,_e.value,I);if(En===null){X===null&&(X=Ye);break}e&&X&&En.alternate===null&&t(v,X),m=o(En,m,oe),G===null?Q=En:G.sibling=En,G=En,X=Ye}if(_e.done)return n(v,X),Re&&Ln(v,oe),Q;if(X===null){for(;!_e.done;oe++,_e=y.next())_e=M(v,_e.value,I),_e!==null&&(m=o(_e,m,oe),G===null?Q=_e:G.sibling=_e,G=_e);return Re&&Ln(v,oe),Q}for(X=r(v,X);!_e.done;oe++,_e=y.next())_e=B(X,v,oe,_e.value,I),_e!==null&&(e&&_e.alternate!==null&&X.delete(_e.key===null?oe:_e.key),m=o(_e,m,oe),G===null?Q=_e:G.sibling=_e,G=_e);return e&&X.forEach(function(ng){return t(v,ng)}),Re&&Ln(v,oe),Q}function Ue(v,m,y,I){if(typeof y=="object"&&y!==null&&y.type===L&&y.key===null&&(y=y.props.children),typeof y=="object"&&y!==null){switch(y.$$typeof){case $:e:{for(var Q=y.key,G=m;G!==null;){if(G.key===Q){if(Q=y.type,Q===L){if(G.tag===7){n(v,G.sibling),m=l(G,y.props.children),m.return=v,v=m;break e}}else if(G.elementType===Q||typeof Q=="object"&&Q!==null&&Q.$$typeof===je&&eu(Q)===G.type){n(v,G.sibling),m=l(G,y.props),m.ref=Vr(v,G,y),m.return=v,v=m;break e}n(v,G);break}else t(v,G);G=G.sibling}y.type===L?(m=Bn(y.props.children,v.mode,I,y.key),m.return=v,v=m):(I=mo(y.type,y.key,y.props,null,v.mode,I),I.ref=Vr(v,m,y),I.return=v,v=I)}return i(v);case N:e:{for(G=y.key;m!==null;){if(m.key===G)if(m.tag===4&&m.stateNode.containerInfo===y.containerInfo&&m.stateNode.implementation===y.implementation){n(v,m.sibling),m=l(m,y.children||[]),m.return=v,v=m;break e}else{n(v,m);break}else t(v,m);m=m.sibling}m=cs(y,v.mode,I),m.return=v,v=m}return i(v);case je:return G=y._init,Ue(v,m,G(y._payload),I)}if(Bt(y))return W(v,m,y,I);if(J(y))return Y(v,m,y,I);Vl(v,y)}return typeof y=="string"&&y!==""||typeof y=="number"?(y=""+y,m!==null&&m.tag===6?(n(v,m.sibling),m=l(m,y),m.return=v,v=m):(n(v,m),m=us(y,v.mode,I),m.return=v,v=m),i(v)):n(v,m)}return Ue}var or=tu(!0),nu=tu(!1),Wl=gn(null),Kl=null,ar=null,ya=null;function _a(){ya=ar=Kl=null}function wa(e){var t=Wl.current;Le(Wl),e._currentValue=t}function ka(e,t,n){for(;e!==null;){var r=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,r!==null&&(r.childLanes|=t)):r!==null&&(r.childLanes&t)!==t&&(r.childLanes|=t),e===n)break;e=e.return}}function sr(e,t){Kl=e,ya=ar=null,e=e.dependencies,e!==null&&e.firstContext!==null&&((e.lanes&t)!==0&&(at=!0),e.firstContext=null)}function wt(e){var t=e._currentValue;if(ya!==e)if(e={context:e,memoizedValue:t,next:null},ar===null){if(Kl===null)throw Error(a(308));ar=e,Kl.dependencies={lanes:0,firstContext:e}}else ar=ar.next=e;return t}var Rn=null;function ba(e){Rn===null?Rn=[e]:Rn.push(e)}function ru(e,t,n,r){var l=t.interleaved;return l===null?(n.next=n,ba(t)):(n.next=l.next,l.next=n),t.interleaved=n,Qt(e,r)}function Qt(e,t){e.lanes|=t;var n=e.alternate;for(n!==null&&(n.lanes|=t),n=e,e=e.return;e!==null;)e.childLanes|=t,n=e.alternate,n!==null&&(n.childLanes|=t),n=e,e=e.return;return n.tag===3?n.stateNode:null}var xn=!1;function Sa(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function lu(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,effects:e.effects})}function Jt(e,t){return{eventTime:e,lane:t,tag:0,payload:null,callback:null,next:null}}function vn(e,t,n){var r=e.updateQueue;if(r===null)return null;if(r=r.shared,(xe&2)!==0){var l=r.pending;return l===null?t.next=t:(t.next=l.next,l.next=t),r.pending=t,Qt(e,n)}return l=r.interleaved,l===null?(t.next=t,ba(r)):(t.next=l.next,l.next=t),r.interleaved=t,Qt(e,n)}function Yl(e,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,(n&4194240)!==0)){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,Oo(e,n)}}function ou(e,t){var n=e.updateQueue,r=e.alternate;if(r!==null&&(r=r.updateQueue,n===r)){var l=null,o=null;if(n=n.firstBaseUpdate,n!==null){do{var i={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};o===null?l=o=i:o=o.next=i,n=n.next}while(n!==null);o===null?l=o=t:o=o.next=t}else l=o=t;n={baseState:r.baseState,firstBaseUpdate:l,lastBaseUpdate:o,shared:r.shared,effects:r.effects},e.updateQueue=n;return}e=n.lastBaseUpdate,e===null?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}function Ql(e,t,n,r){var l=e.updateQueue;xn=!1;var o=l.firstBaseUpdate,i=l.lastBaseUpdate,c=l.shared.pending;if(c!==null){l.shared.pending=null;var p=c,_=p.next;p.next=null,i===null?o=_:i.next=_,i=p;var P=e.alternate;P!==null&&(P=P.updateQueue,c=P.lastBaseUpdate,c!==i&&(c===null?P.firstBaseUpdate=_:c.next=_,P.lastBaseUpdate=p))}if(o!==null){var M=l.baseState;i=0,P=_=p=null,c=o;do{var T=c.lane,B=c.eventTime;if((r&T)===T){P!==null&&(P=P.next={eventTime:B,lane:0,tag:c.tag,payload:c.payload,callback:c.callback,next:null});e:{var W=e,Y=c;switch(T=t,B=n,Y.tag){case 1:if(W=Y.payload,typeof W=="function"){M=W.call(B,M,T);break e}M=W;break e;case 3:W.flags=W.flags&-65537|128;case 0:if(W=Y.payload,T=typeof W=="function"?W.call(B,M,T):W,T==null)break e;M=R({},M,T);break e;case 2:xn=!0}}c.callback!==null&&c.lane!==0&&(e.flags|=64,T=l.effects,T===null?l.effects=[c]:T.push(c))}else B={eventTime:B,lane:T,tag:c.tag,payload:c.payload,callback:c.callback,next:null},P===null?(_=P=B,p=M):P=P.next=B,i|=T;if(c=c.next,c===null){if(c=l.shared.pending,c===null)break;T=c,c=T.next,T.next=null,l.lastBaseUpdate=T,l.shared.pending=null}}while(!0);if(P===null&&(p=M),l.baseState=p,l.firstBaseUpdate=_,l.lastBaseUpdate=P,t=l.shared.interleaved,t!==null){l=t;do i|=l.lane,l=l.next;while(l!==t)}else o===null&&(l.shared.lanes=0);On|=i,e.lanes=i,e.memoizedState=M}}function au(e,t,n){if(e=t.effects,t.effects=null,e!==null)for(t=0;t<e.length;t++){var r=e[t],l=r.callback;if(l!==null){if(r.callback=null,r=n,typeof l!="function")throw Error(a(191,l));l.call(r)}}}var Wr={},It=gn(Wr),Kr=gn(Wr),Yr=gn(Wr);function Dn(e){if(e===Wr)throw Error(a(174));return e}function Ea(e,t){switch(ze(Yr,t),ze(Kr,e),ze(It,Wr),e=t.nodeType,e){case 9:case 11:t=(t=t.documentElement)?t.namespaceURI:vt(null,"");break;default:e=e===8?t.parentNode:t,t=e.namespaceURI||null,e=e.tagName,t=vt(t,e)}Le(It),ze(It,t)}function ir(){Le(It),Le(Kr),Le(Yr)}function su(e){Dn(Yr.current);var t=Dn(It.current),n=vt(t,e.type);t!==n&&(ze(Kr,e),ze(It,n))}function Ca(e){Kr.current===e&&(Le(It),Le(Kr))}var De=gn(0);function Jl(e){for(var t=e;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||n.data==="$?"||n.data==="$!"))return t}else if(t.tag===19&&t.memoizedProps.revealOrder!==void 0){if((t.flags&128)!==0)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var Aa=[];function Na(){for(var e=0;e<Aa.length;e++)Aa[e]._workInProgressVersionPrimary=null;Aa.length=0}var ql=ve.ReactCurrentDispatcher,Ta=ve.ReactCurrentBatchConfig,In=0,Ie=null,He=null,We=null,Gl=!1,Qr=!1,Jr=0,Sf=0;function Xe(){throw Error(a(321))}function Pa(e,t){if(t===null)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!Nt(e[n],t[n]))return!1;return!0}function ja(e,t,n,r,l,o){if(In=o,Ie=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,ql.current=e===null||e.memoizedState===null?Nf:Tf,e=n(r,l),Qr){o=0;do{if(Qr=!1,Jr=0,25<=o)throw Error(a(301));o+=1,We=He=null,t.updateQueue=null,ql.current=Pf,e=n(r,l)}while(Qr)}if(ql.current=eo,t=He!==null&&He.next!==null,In=0,We=He=Ie=null,Gl=!1,t)throw Error(a(300));return e}function za(){var e=Jr!==0;return Jr=0,e}function Ot(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return We===null?Ie.memoizedState=We=e:We=We.next=e,We}function kt(){if(He===null){var e=Ie.alternate;e=e!==null?e.memoizedState:null}else e=He.next;var t=We===null?Ie.memoizedState:We.next;if(t!==null)We=t,He=e;else{if(e===null)throw Error(a(310));He=e,e={memoizedState:He.memoizedState,baseState:He.baseState,baseQueue:He.baseQueue,queue:He.queue,next:null},We===null?Ie.memoizedState=We=e:We=We.next=e}return We}function qr(e,t){return typeof t=="function"?t(e):t}function Ma(e){var t=kt(),n=t.queue;if(n===null)throw Error(a(311));n.lastRenderedReducer=e;var r=He,l=r.baseQueue,o=n.pending;if(o!==null){if(l!==null){var i=l.next;l.next=o.next,o.next=i}r.baseQueue=l=o,n.pending=null}if(l!==null){o=l.next,r=r.baseState;var c=i=null,p=null,_=o;do{var P=_.lane;if((In&P)===P)p!==null&&(p=p.next={lane:0,action:_.action,hasEagerState:_.hasEagerState,eagerState:_.eagerState,next:null}),r=_.hasEagerState?_.eagerState:e(r,_.action);else{var M={lane:P,action:_.action,hasEagerState:_.hasEagerState,eagerState:_.eagerState,next:null};p===null?(c=p=M,i=r):p=p.next=M,Ie.lanes|=P,On|=P}_=_.next}while(_!==null&&_!==o);p===null?i=r:p.next=c,Nt(r,t.memoizedState)||(at=!0),t.memoizedState=r,t.baseState=i,t.baseQueue=p,n.lastRenderedState=r}if(e=n.interleaved,e!==null){l=e;do o=l.lane,Ie.lanes|=o,On|=o,l=l.next;while(l!==e)}else l===null&&(n.lanes=0);return[t.memoizedState,n.dispatch]}function La(e){var t=kt(),n=t.queue;if(n===null)throw Error(a(311));n.lastRenderedReducer=e;var r=n.dispatch,l=n.pending,o=t.memoizedState;if(l!==null){n.pending=null;var i=l=l.next;do o=e(o,i.action),i=i.next;while(i!==l);Nt(o,t.memoizedState)||(at=!0),t.memoizedState=o,t.baseQueue===null&&(t.baseState=o),n.lastRenderedState=o}return[o,r]}function iu(){}function uu(e,t){var n=Ie,r=kt(),l=t(),o=!Nt(r.memoizedState,l);if(o&&(r.memoizedState=l,at=!0),r=r.queue,Ra(pu.bind(null,n,r,e),[e]),r.getSnapshot!==t||o||We!==null&&We.memoizedState.tag&1){if(n.flags|=2048,Gr(9,du.bind(null,n,r,l,t),void 0,null),Ke===null)throw Error(a(349));(In&30)!==0||cu(n,t,l)}return l}function cu(e,t,n){e.flags|=16384,e={getSnapshot:t,value:n},t=Ie.updateQueue,t===null?(t={lastEffect:null,stores:null},Ie.updateQueue=t,t.stores=[e]):(n=t.stores,n===null?t.stores=[e]:n.push(e))}function du(e,t,n,r){t.value=n,t.getSnapshot=r,fu(t)&&gu(e)}function pu(e,t,n){return n(function(){fu(t)&&gu(e)})}function fu(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!Nt(e,n)}catch{return!0}}function gu(e){var t=Qt(e,1);t!==null&&Mt(t,e,1,-1)}function mu(e){var t=Ot();return typeof e=="function"&&(e=e()),t.memoizedState=t.baseState=e,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:qr,lastRenderedState:e},t.queue=e,e=e.dispatch=Af.bind(null,Ie,e),[t.memoizedState,e]}function Gr(e,t,n,r){return e={tag:e,create:t,destroy:n,deps:r,next:null},t=Ie.updateQueue,t===null?(t={lastEffect:null,stores:null},Ie.updateQueue=t,t.lastEffect=e.next=e):(n=t.lastEffect,n===null?t.lastEffect=e.next=e:(r=n.next,n.next=e,e.next=r,t.lastEffect=e)),e}function hu(){return kt().memoizedState}function Xl(e,t,n,r){var l=Ot();Ie.flags|=e,l.memoizedState=Gr(1|t,n,void 0,r===void 0?null:r)}function Zl(e,t,n,r){var l=kt();r=r===void 0?null:r;var o=void 0;if(He!==null){var i=He.memoizedState;if(o=i.destroy,r!==null&&Pa(r,i.deps)){l.memoizedState=Gr(t,n,o,r);return}}Ie.flags|=e,l.memoizedState=Gr(1|t,n,o,r)}function xu(e,t){return Xl(8390656,8,e,t)}function Ra(e,t){return Zl(2048,8,e,t)}function vu(e,t){return Zl(4,2,e,t)}function yu(e,t){return Zl(4,4,e,t)}function _u(e,t){if(typeof t=="function")return e=e(),t(e),function(){t(null)};if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function wu(e,t,n){return n=n!=null?n.concat([e]):null,Zl(4,4,_u.bind(null,t,e),n)}function Da(){}function ku(e,t){var n=kt();t=t===void 0?null:t;var r=n.memoizedState;return r!==null&&t!==null&&Pa(t,r[1])?r[0]:(n.memoizedState=[e,t],e)}function bu(e,t){var n=kt();t=t===void 0?null:t;var r=n.memoizedState;return r!==null&&t!==null&&Pa(t,r[1])?r[0]:(e=e(),n.memoizedState=[e,t],e)}function Su(e,t,n){return(In&21)===0?(e.baseState&&(e.baseState=!1,at=!0),e.memoizedState=n):(Nt(n,t)||(n=ei(),Ie.lanes|=n,On|=n,e.baseState=!0),t)}function Ef(e,t){var n=ke;ke=n!==0&&4>n?n:4,e(!0);var r=Ta.transition;Ta.transition={};try{e(!1),t()}finally{ke=n,Ta.transition=r}}function Eu(){return kt().memoizedState}function Cf(e,t,n){var r=kn(e);if(n={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null},Cu(e))Au(t,n);else if(n=ru(e,t,n,r),n!==null){var l=nt();Mt(n,e,r,l),Nu(n,t,r)}}function Af(e,t,n){var r=kn(e),l={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null};if(Cu(e))Au(t,l);else{var o=e.alternate;if(e.lanes===0&&(o===null||o.lanes===0)&&(o=t.lastRenderedReducer,o!==null))try{var i=t.lastRenderedState,c=o(i,n);if(l.hasEagerState=!0,l.eagerState=c,Nt(c,i)){var p=t.interleaved;p===null?(l.next=l,ba(t)):(l.next=p.next,p.next=l),t.interleaved=l;return}}catch{}finally{}n=ru(e,t,l,r),n!==null&&(l=nt(),Mt(n,e,r,l),Nu(n,t,r))}}function Cu(e){var t=e.alternate;return e===Ie||t!==null&&t===Ie}function Au(e,t){Qr=Gl=!0;var n=e.pending;n===null?t.next=t:(t.next=n.next,n.next=t),e.pending=t}function Nu(e,t,n){if((n&4194240)!==0){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,Oo(e,n)}}var eo={readContext:wt,useCallback:Xe,useContext:Xe,useEffect:Xe,useImperativeHandle:Xe,useInsertionEffect:Xe,useLayoutEffect:Xe,useMemo:Xe,useReducer:Xe,useRef:Xe,useState:Xe,useDebugValue:Xe,useDeferredValue:Xe,useTransition:Xe,useMutableSource:Xe,useSyncExternalStore:Xe,useId:Xe,unstable_isNewReconciler:!1},Nf={readContext:wt,useCallback:function(e,t){return Ot().memoizedState=[e,t===void 0?null:t],e},useContext:wt,useEffect:xu,useImperativeHandle:function(e,t,n){return n=n!=null?n.concat([e]):null,Xl(4194308,4,_u.bind(null,t,e),n)},useLayoutEffect:function(e,t){return Xl(4194308,4,e,t)},useInsertionEffect:function(e,t){return Xl(4,2,e,t)},useMemo:function(e,t){var n=Ot();return t=t===void 0?null:t,e=e(),n.memoizedState=[e,t],e},useReducer:function(e,t,n){var r=Ot();return t=n!==void 0?n(t):t,r.memoizedState=r.baseState=t,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:t},r.queue=e,e=e.dispatch=Cf.bind(null,Ie,e),[r.memoizedState,e]},useRef:function(e){var t=Ot();return e={current:e},t.memoizedState=e},useState:mu,useDebugValue:Da,useDeferredValue:function(e){return Ot().memoizedState=e},useTransition:function(){var e=mu(!1),t=e[0];return e=Ef.bind(null,e[1]),Ot().memoizedState=e,[t,e]},useMutableSource:function(){},useSyncExternalStore:function(e,t,n){var r=Ie,l=Ot();if(Re){if(n===void 0)throw Error(a(407));n=n()}else{if(n=t(),Ke===null)throw Error(a(349));(In&30)!==0||cu(r,t,n)}l.memoizedState=n;var o={value:n,getSnapshot:t};return l.queue=o,xu(pu.bind(null,r,o,e),[e]),r.flags|=2048,Gr(9,du.bind(null,r,o,n,t),void 0,null),n},useId:function(){var e=Ot(),t=Ke.identifierPrefix;if(Re){var n=Yt,r=Kt;n=(r&~(1<<32-At(r)-1)).toString(32)+n,t=":"+t+"R"+n,n=Jr++,0<n&&(t+="H"+n.toString(32)),t+=":"}else n=Sf++,t=":"+t+"r"+n.toString(32)+":";return e.memoizedState=t},unstable_isNewReconciler:!1},Tf={readContext:wt,useCallback:ku,useContext:wt,useEffect:Ra,useImperativeHandle:wu,useInsertionEffect:vu,useLayoutEffect:yu,useMemo:bu,useReducer:Ma,useRef:hu,useState:function(){return Ma(qr)},useDebugValue:Da,useDeferredValue:function(e){var t=kt();return Su(t,He.memoizedState,e)},useTransition:function(){var e=Ma(qr)[0],t=kt().memoizedState;return[e,t]},useMutableSource:iu,useSyncExternalStore:uu,useId:Eu,unstable_isNewReconciler:!1},Pf={readContext:wt,useCallback:ku,useContext:wt,useEffect:Ra,useImperativeHandle:wu,useInsertionEffect:vu,useLayoutEffect:yu,useMemo:bu,useReducer:La,useRef:hu,useState:function(){return La(qr)},useDebugValue:Da,useDeferredValue:function(e){var t=kt();return He===null?t.memoizedState=e:Su(t,He.memoizedState,e)},useTransition:function(){var e=La(qr)[0],t=kt().memoizedState;return[e,t]},useMutableSource:iu,useSyncExternalStore:uu,useId:Eu,unstable_isNewReconciler:!1};function Pt(e,t){if(e&&e.defaultProps){t=R({},t),e=e.defaultProps;for(var n in e)t[n]===void 0&&(t[n]=e[n]);return t}return t}function Ia(e,t,n,r){t=e.memoizedState,n=n(r,t),n=n==null?t:R({},t,n),e.memoizedState=n,e.lanes===0&&(e.updateQueue.baseState=n)}var to={isMounted:function(e){return(e=e._reactInternals)?Pn(e)===e:!1},enqueueSetState:function(e,t,n){e=e._reactInternals;var r=nt(),l=kn(e),o=Jt(r,l);o.payload=t,n!=null&&(o.callback=n),t=vn(e,o,l),t!==null&&(Mt(t,e,l,r),Yl(t,e,l))},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var r=nt(),l=kn(e),o=Jt(r,l);o.tag=1,o.payload=t,n!=null&&(o.callback=n),t=vn(e,o,l),t!==null&&(Mt(t,e,l,r),Yl(t,e,l))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=nt(),r=kn(e),l=Jt(n,r);l.tag=2,t!=null&&(l.callback=t),t=vn(e,l,r),t!==null&&(Mt(t,e,r,n),Yl(t,e,r))}};function Tu(e,t,n,r,l,o,i){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(r,o,i):t.prototype&&t.prototype.isPureReactComponent?!Ir(n,r)||!Ir(l,o):!0}function Pu(e,t,n){var r=!1,l=mn,o=t.contextType;return typeof o=="object"&&o!==null?o=wt(o):(l=ot(t)?zn:Ge.current,r=t.contextTypes,o=(r=r!=null)?tr(e,l):mn),t=new t(n,o),e.memoizedState=t.state!==null&&t.state!==void 0?t.state:null,t.updater=to,e.stateNode=t,t._reactInternals=e,r&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=l,e.__reactInternalMemoizedMaskedChildContext=o),t}function ju(e,t,n,r){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(n,r),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(n,r),t.state!==e&&to.enqueueReplaceState(t,t.state,null)}function Oa(e,t,n,r){var l=e.stateNode;l.props=n,l.state=e.memoizedState,l.refs={},Sa(e);var o=t.contextType;typeof o=="object"&&o!==null?l.context=wt(o):(o=ot(t)?zn:Ge.current,l.context=tr(e,o)),l.state=e.memoizedState,o=t.getDerivedStateFromProps,typeof o=="function"&&(Ia(e,t,o,n),l.state=e.memoizedState),typeof t.getDerivedStateFromProps=="function"||typeof l.getSnapshotBeforeUpdate=="function"||typeof l.UNSAFE_componentWillMount!="function"&&typeof l.componentWillMount!="function"||(t=l.state,typeof l.componentWillMount=="function"&&l.componentWillMount(),typeof l.UNSAFE_componentWillMount=="function"&&l.UNSAFE_componentWillMount(),t!==l.state&&to.enqueueReplaceState(l,l.state,null),Ql(e,n,l,r),l.state=e.memoizedState),typeof l.componentDidMount=="function"&&(e.flags|=4194308)}function ur(e,t){try{var n="",r=t;do n+=ue(r),r=r.return;while(r);var l=n}catch(o){l=`
Error generating stack: `+o.message+`
`+o.stack}return{value:e,source:t,stack:l,digest:null}}function $a(e,t,n){return{value:e,source:null,stack:n??null,digest:t??null}}function Fa(e,t){try{console.error(t.value)}catch(n){setTimeout(function(){throw n})}}var jf=typeof WeakMap=="function"?WeakMap:Map;function zu(e,t,n){n=Jt(-1,n),n.tag=3,n.payload={element:null};var r=t.value;return n.callback=function(){io||(io=!0,ts=r),Fa(e,t)},n}function Mu(e,t,n){n=Jt(-1,n),n.tag=3;var r=e.type.getDerivedStateFromError;if(typeof r=="function"){var l=t.value;n.payload=function(){return r(l)},n.callback=function(){Fa(e,t)}}var o=e.stateNode;return o!==null&&typeof o.componentDidCatch=="function"&&(n.callback=function(){Fa(e,t),typeof r!="function"&&(_n===null?_n=new Set([this]):_n.add(this));var i=t.stack;this.componentDidCatch(t.value,{componentStack:i!==null?i:""})}),n}function Lu(e,t,n){var r=e.pingCache;if(r===null){r=e.pingCache=new jf;var l=new Set;r.set(t,l)}else l=r.get(t),l===void 0&&(l=new Set,r.set(t,l));l.has(n)||(l.add(n),e=Wf.bind(null,e,t,n),t.then(e,e))}function Ru(e){do{var t;if((t=e.tag===13)&&(t=e.memoizedState,t=t!==null?t.dehydrated!==null:!0),t)return e;e=e.return}while(e!==null);return null}function Du(e,t,n,r,l){return(e.mode&1)===0?(e===t?e.flags|=65536:(e.flags|=128,n.flags|=131072,n.flags&=-52805,n.tag===1&&(n.alternate===null?n.tag=17:(t=Jt(-1,1),t.tag=2,vn(n,t,1))),n.lanes|=1),e):(e.flags|=65536,e.lanes=l,e)}var zf=ve.ReactCurrentOwner,at=!1;function tt(e,t,n,r){t.child=e===null?nu(t,null,n,r):or(t,e.child,n,r)}function Iu(e,t,n,r,l){n=n.render;var o=t.ref;return sr(t,l),r=ja(e,t,n,r,o,l),n=za(),e!==null&&!at?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~l,qt(e,t,l)):(Re&&n&&ga(t),t.flags|=1,tt(e,t,r,l),t.child)}function Ou(e,t,n,r,l){if(e===null){var o=n.type;return typeof o=="function"&&!is(o)&&o.defaultProps===void 0&&n.compare===null&&n.defaultProps===void 0?(t.tag=15,t.type=o,$u(e,t,o,r,l)):(e=mo(n.type,null,r,t,t.mode,l),e.ref=t.ref,e.return=t,t.child=e)}if(o=e.child,(e.lanes&l)===0){var i=o.memoizedProps;if(n=n.compare,n=n!==null?n:Ir,n(i,r)&&e.ref===t.ref)return qt(e,t,l)}return t.flags|=1,e=Sn(o,r),e.ref=t.ref,e.return=t,t.child=e}function $u(e,t,n,r,l){if(e!==null){var o=e.memoizedProps;if(Ir(o,r)&&e.ref===t.ref)if(at=!1,t.pendingProps=r=o,(e.lanes&l)!==0)(e.flags&131072)!==0&&(at=!0);else return t.lanes=e.lanes,qt(e,t,l)}return Ua(e,t,n,r,l)}function Fu(e,t,n){var r=t.pendingProps,l=r.children,o=e!==null?e.memoizedState:null;if(r.mode==="hidden")if((t.mode&1)===0)t.memoizedState={baseLanes:0,cachePool:null,transitions:null},ze(dr,mt),mt|=n;else{if((n&1073741824)===0)return e=o!==null?o.baseLanes|n:n,t.lanes=t.childLanes=1073741824,t.memoizedState={baseLanes:e,cachePool:null,transitions:null},t.updateQueue=null,ze(dr,mt),mt|=e,null;t.memoizedState={baseLanes:0,cachePool:null,transitions:null},r=o!==null?o.baseLanes:n,ze(dr,mt),mt|=r}else o!==null?(r=o.baseLanes|n,t.memoizedState=null):r=n,ze(dr,mt),mt|=r;return tt(e,t,l,n),t.child}function Uu(e,t){var n=t.ref;(e===null&&n!==null||e!==null&&e.ref!==n)&&(t.flags|=512,t.flags|=2097152)}function Ua(e,t,n,r,l){var o=ot(n)?zn:Ge.current;return o=tr(t,o),sr(t,l),n=ja(e,t,n,r,o,l),r=za(),e!==null&&!at?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~l,qt(e,t,l)):(Re&&r&&ga(t),t.flags|=1,tt(e,t,n,l),t.child)}function Bu(e,t,n,r,l){if(ot(n)){var o=!0;$l(t)}else o=!1;if(sr(t,l),t.stateNode===null)ro(e,t),Pu(t,n,r),Oa(t,n,r,l),r=!0;else if(e===null){var i=t.stateNode,c=t.memoizedProps;i.props=c;var p=i.context,_=n.contextType;typeof _=="object"&&_!==null?_=wt(_):(_=ot(n)?zn:Ge.current,_=tr(t,_));var P=n.getDerivedStateFromProps,M=typeof P=="function"||typeof i.getSnapshotBeforeUpdate=="function";M||typeof i.UNSAFE_componentWillReceiveProps!="function"&&typeof i.componentWillReceiveProps!="function"||(c!==r||p!==_)&&ju(t,i,r,_),xn=!1;var T=t.memoizedState;i.state=T,Ql(t,r,i,l),p=t.memoizedState,c!==r||T!==p||lt.current||xn?(typeof P=="function"&&(Ia(t,n,P,r),p=t.memoizedState),(c=xn||Tu(t,n,c,r,T,p,_))?(M||typeof i.UNSAFE_componentWillMount!="function"&&typeof i.componentWillMount!="function"||(typeof i.componentWillMount=="function"&&i.componentWillMount(),typeof i.UNSAFE_componentWillMount=="function"&&i.UNSAFE_componentWillMount()),typeof i.componentDidMount=="function"&&(t.flags|=4194308)):(typeof i.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=r,t.memoizedState=p),i.props=r,i.state=p,i.context=_,r=c):(typeof i.componentDidMount=="function"&&(t.flags|=4194308),r=!1)}else{i=t.stateNode,lu(e,t),c=t.memoizedProps,_=t.type===t.elementType?c:Pt(t.type,c),i.props=_,M=t.pendingProps,T=i.context,p=n.contextType,typeof p=="object"&&p!==null?p=wt(p):(p=ot(n)?zn:Ge.current,p=tr(t,p));var B=n.getDerivedStateFromProps;(P=typeof B=="function"||typeof i.getSnapshotBeforeUpdate=="function")||typeof i.UNSAFE_componentWillReceiveProps!="function"&&typeof i.componentWillReceiveProps!="function"||(c!==M||T!==p)&&ju(t,i,r,p),xn=!1,T=t.memoizedState,i.state=T,Ql(t,r,i,l);var W=t.memoizedState;c!==M||T!==W||lt.current||xn?(typeof B=="function"&&(Ia(t,n,B,r),W=t.memoizedState),(_=xn||Tu(t,n,_,r,T,W,p)||!1)?(P||typeof i.UNSAFE_componentWillUpdate!="function"&&typeof i.componentWillUpdate!="function"||(typeof i.componentWillUpdate=="function"&&i.componentWillUpdate(r,W,p),typeof i.UNSAFE_componentWillUpdate=="function"&&i.UNSAFE_componentWillUpdate(r,W,p)),typeof i.componentDidUpdate=="function"&&(t.flags|=4),typeof i.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof i.componentDidUpdate!="function"||c===e.memoizedProps&&T===e.memoizedState||(t.flags|=4),typeof i.getSnapshotBeforeUpdate!="function"||c===e.memoizedProps&&T===e.memoizedState||(t.flags|=1024),t.memoizedProps=r,t.memoizedState=W),i.props=r,i.state=W,i.context=p,r=_):(typeof i.componentDidUpdate!="function"||c===e.memoizedProps&&T===e.memoizedState||(t.flags|=4),typeof i.getSnapshotBeforeUpdate!="function"||c===e.memoizedProps&&T===e.memoizedState||(t.flags|=1024),r=!1)}return Ba(e,t,n,r,o,l)}function Ba(e,t,n,r,l,o){Uu(e,t);var i=(t.flags&128)!==0;if(!r&&!i)return l&&Yi(t,n,!1),qt(e,t,o);r=t.stateNode,zf.current=t;var c=i&&typeof n.getDerivedStateFromError!="function"?null:r.render();return t.flags|=1,e!==null&&i?(t.child=or(t,e.child,null,o),t.child=or(t,null,c,o)):tt(e,t,c,o),t.memoizedState=r.state,l&&Yi(t,n,!0),t.child}function Hu(e){var t=e.stateNode;t.pendingContext?Wi(e,t.pendingContext,t.pendingContext!==t.context):t.context&&Wi(e,t.context,!1),Ea(e,t.containerInfo)}function Vu(e,t,n,r,l){return lr(),va(l),t.flags|=256,tt(e,t,n,r),t.child}var Ha={dehydrated:null,treeContext:null,retryLane:0};function Va(e){return{baseLanes:e,cachePool:null,transitions:null}}function Wu(e,t,n){var r=t.pendingProps,l=De.current,o=!1,i=(t.flags&128)!==0,c;if((c=i)||(c=e!==null&&e.memoizedState===null?!1:(l&2)!==0),c?(o=!0,t.flags&=-129):(e===null||e.memoizedState!==null)&&(l|=1),ze(De,l&1),e===null)return xa(t),e=t.memoizedState,e!==null&&(e=e.dehydrated,e!==null)?((t.mode&1)===0?t.lanes=1:e.data==="$!"?t.lanes=8:t.lanes=1073741824,null):(i=r.children,e=r.fallback,o?(r=t.mode,o=t.child,i={mode:"hidden",children:i},(r&1)===0&&o!==null?(o.childLanes=0,o.pendingProps=i):o=ho(i,r,0,null),e=Bn(e,r,n,null),o.return=t,e.return=t,o.sibling=e,t.child=o,t.child.memoizedState=Va(n),t.memoizedState=Ha,e):Wa(t,i));if(l=e.memoizedState,l!==null&&(c=l.dehydrated,c!==null))return Mf(e,t,i,r,c,l,n);if(o){o=r.fallback,i=t.mode,l=e.child,c=l.sibling;var p={mode:"hidden",children:r.children};return(i&1)===0&&t.child!==l?(r=t.child,r.childLanes=0,r.pendingProps=p,t.deletions=null):(r=Sn(l,p),r.subtreeFlags=l.subtreeFlags&14680064),c!==null?o=Sn(c,o):(o=Bn(o,i,n,null),o.flags|=2),o.return=t,r.return=t,r.sibling=o,t.child=r,r=o,o=t.child,i=e.child.memoizedState,i=i===null?Va(n):{baseLanes:i.baseLanes|n,cachePool:null,transitions:i.transitions},o.memoizedState=i,o.childLanes=e.childLanes&~n,t.memoizedState=Ha,r}return o=e.child,e=o.sibling,r=Sn(o,{mode:"visible",children:r.children}),(t.mode&1)===0&&(r.lanes=n),r.return=t,r.sibling=null,e!==null&&(n=t.deletions,n===null?(t.deletions=[e],t.flags|=16):n.push(e)),t.child=r,t.memoizedState=null,r}function Wa(e,t){return t=ho({mode:"visible",children:t},e.mode,0,null),t.return=e,e.child=t}function no(e,t,n,r){return r!==null&&va(r),or(t,e.child,null,n),e=Wa(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function Mf(e,t,n,r,l,o,i){if(n)return t.flags&256?(t.flags&=-257,r=$a(Error(a(422))),no(e,t,i,r)):t.memoizedState!==null?(t.child=e.child,t.flags|=128,null):(o=r.fallback,l=t.mode,r=ho({mode:"visible",children:r.children},l,0,null),o=Bn(o,l,i,null),o.flags|=2,r.return=t,o.return=t,r.sibling=o,t.child=r,(t.mode&1)!==0&&or(t,e.child,null,i),t.child.memoizedState=Va(i),t.memoizedState=Ha,o);if((t.mode&1)===0)return no(e,t,i,null);if(l.data==="$!"){if(r=l.nextSibling&&l.nextSibling.dataset,r)var c=r.dgst;return r=c,o=Error(a(419)),r=$a(o,r,void 0),no(e,t,i,r)}if(c=(i&e.childLanes)!==0,at||c){if(r=Ke,r!==null){switch(i&-i){case 4:l=2;break;case 16:l=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:l=32;break;case 536870912:l=268435456;break;default:l=0}l=(l&(r.suspendedLanes|i))!==0?0:l,l!==0&&l!==o.retryLane&&(o.retryLane=l,Qt(e,l),Mt(r,e,l,-1))}return ss(),r=$a(Error(a(421))),no(e,t,i,r)}return l.data==="$?"?(t.flags|=128,t.child=e.child,t=Kf.bind(null,e),l._reactRetry=t,null):(e=o.treeContext,gt=fn(l.nextSibling),ft=t,Re=!0,Tt=null,e!==null&&(yt[_t++]=Kt,yt[_t++]=Yt,yt[_t++]=Mn,Kt=e.id,Yt=e.overflow,Mn=t),t=Wa(t,r.children),t.flags|=4096,t)}function Ku(e,t,n){e.lanes|=t;var r=e.alternate;r!==null&&(r.lanes|=t),ka(e.return,t,n)}function Ka(e,t,n,r,l){var o=e.memoizedState;o===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:r,tail:n,tailMode:l}:(o.isBackwards=t,o.rendering=null,o.renderingStartTime=0,o.last=r,o.tail=n,o.tailMode=l)}function Yu(e,t,n){var r=t.pendingProps,l=r.revealOrder,o=r.tail;if(tt(e,t,r.children,n),r=De.current,(r&2)!==0)r=r&1|2,t.flags|=128;else{if(e!==null&&(e.flags&128)!==0)e:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&Ku(e,n,t);else if(e.tag===19)Ku(e,n,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}r&=1}if(ze(De,r),(t.mode&1)===0)t.memoizedState=null;else switch(l){case"forwards":for(n=t.child,l=null;n!==null;)e=n.alternate,e!==null&&Jl(e)===null&&(l=n),n=n.sibling;n=l,n===null?(l=t.child,t.child=null):(l=n.sibling,n.sibling=null),Ka(t,!1,l,n,o);break;case"backwards":for(n=null,l=t.child,t.child=null;l!==null;){if(e=l.alternate,e!==null&&Jl(e)===null){t.child=l;break}e=l.sibling,l.sibling=n,n=l,l=e}Ka(t,!0,n,null,o);break;case"together":Ka(t,!1,null,null,void 0);break;default:t.memoizedState=null}return t.child}function ro(e,t){(t.mode&1)===0&&e!==null&&(e.alternate=null,t.alternate=null,t.flags|=2)}function qt(e,t,n){if(e!==null&&(t.dependencies=e.dependencies),On|=t.lanes,(n&t.childLanes)===0)return null;if(e!==null&&t.child!==e.child)throw Error(a(153));if(t.child!==null){for(e=t.child,n=Sn(e,e.pendingProps),t.child=n,n.return=t;e.sibling!==null;)e=e.sibling,n=n.sibling=Sn(e,e.pendingProps),n.return=t;n.sibling=null}return t.child}function Lf(e,t,n){switch(t.tag){case 3:Hu(t),lr();break;case 5:su(t);break;case 1:ot(t.type)&&$l(t);break;case 4:Ea(t,t.stateNode.containerInfo);break;case 10:var r=t.type._context,l=t.memoizedProps.value;ze(Wl,r._currentValue),r._currentValue=l;break;case 13:if(r=t.memoizedState,r!==null)return r.dehydrated!==null?(ze(De,De.current&1),t.flags|=128,null):(n&t.child.childLanes)!==0?Wu(e,t,n):(ze(De,De.current&1),e=qt(e,t,n),e!==null?e.sibling:null);ze(De,De.current&1);break;case 19:if(r=(n&t.childLanes)!==0,(e.flags&128)!==0){if(r)return Yu(e,t,n);t.flags|=128}if(l=t.memoizedState,l!==null&&(l.rendering=null,l.tail=null,l.lastEffect=null),ze(De,De.current),r)break;return null;case 22:case 23:return t.lanes=0,Fu(e,t,n)}return qt(e,t,n)}var Qu,Ya,Ju,qu;Qu=function(e,t){for(var n=t.child;n!==null;){if(n.tag===5||n.tag===6)e.appendChild(n.stateNode);else if(n.tag!==4&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===t)break;for(;n.sibling===null;){if(n.return===null||n.return===t)return;n=n.return}n.sibling.return=n.return,n=n.sibling}},Ya=function(){},Ju=function(e,t,n,r){var l=e.memoizedProps;if(l!==r){e=t.stateNode,Dn(It.current);var o=null;switch(n){case"input":l=ct(e,l),r=ct(e,r),o=[];break;case"select":l=R({},l,{value:void 0}),r=R({},r,{value:void 0}),o=[];break;case"textarea":l=An(e,l),r=An(e,r),o=[];break;default:typeof l.onClick!="function"&&typeof r.onClick=="function"&&(e.onclick=Dl)}ln(n,r);var i;n=null;for(_ in l)if(!r.hasOwnProperty(_)&&l.hasOwnProperty(_)&&l[_]!=null)if(_==="style"){var c=l[_];for(i in c)c.hasOwnProperty(i)&&(n||(n={}),n[i]="")}else _!=="dangerouslySetInnerHTML"&&_!=="children"&&_!=="suppressContentEditableWarning"&&_!=="suppressHydrationWarning"&&_!=="autoFocus"&&(x.hasOwnProperty(_)?o||(o=[]):(o=o||[]).push(_,null));for(_ in r){var p=r[_];if(c=l!=null?l[_]:void 0,r.hasOwnProperty(_)&&p!==c&&(p!=null||c!=null))if(_==="style")if(c){for(i in c)!c.hasOwnProperty(i)||p&&p.hasOwnProperty(i)||(n||(n={}),n[i]="");for(i in p)p.hasOwnProperty(i)&&c[i]!==p[i]&&(n||(n={}),n[i]=p[i])}else n||(o||(o=[]),o.push(_,n)),n=p;else _==="dangerouslySetInnerHTML"?(p=p?p.__html:void 0,c=c?c.__html:void 0,p!=null&&c!==p&&(o=o||[]).push(_,p)):_==="children"?typeof p!="string"&&typeof p!="number"||(o=o||[]).push(_,""+p):_!=="suppressContentEditableWarning"&&_!=="suppressHydrationWarning"&&(x.hasOwnProperty(_)?(p!=null&&_==="onScroll"&&Me("scroll",e),o||c===p||(o=[])):(o=o||[]).push(_,p))}n&&(o=o||[]).push("style",n);var _=o;(t.updateQueue=_)&&(t.flags|=4)}},qu=function(e,t,n,r){n!==r&&(t.flags|=4)};function Xr(e,t){if(!Re)switch(e.tailMode){case"hidden":t=e.tail;for(var n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?e.tail=null:n.sibling=null;break;case"collapsed":n=e.tail;for(var r=null;n!==null;)n.alternate!==null&&(r=n),n=n.sibling;r===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:r.sibling=null}}function Ze(e){var t=e.alternate!==null&&e.alternate.child===e.child,n=0,r=0;if(t)for(var l=e.child;l!==null;)n|=l.lanes|l.childLanes,r|=l.subtreeFlags&14680064,r|=l.flags&14680064,l.return=e,l=l.sibling;else for(l=e.child;l!==null;)n|=l.lanes|l.childLanes,r|=l.subtreeFlags,r|=l.flags,l.return=e,l=l.sibling;return e.subtreeFlags|=r,e.childLanes=n,t}function Rf(e,t,n){var r=t.pendingProps;switch(ma(t),t.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Ze(t),null;case 1:return ot(t.type)&&Ol(),Ze(t),null;case 3:return r=t.stateNode,ir(),Le(lt),Le(Ge),Na(),r.pendingContext&&(r.context=r.pendingContext,r.pendingContext=null),(e===null||e.child===null)&&(Hl(t)?t.flags|=4:e===null||e.memoizedState.isDehydrated&&(t.flags&256)===0||(t.flags|=1024,Tt!==null&&(ls(Tt),Tt=null))),Ya(e,t),Ze(t),null;case 5:Ca(t);var l=Dn(Yr.current);if(n=t.type,e!==null&&t.stateNode!=null)Ju(e,t,n,r,l),e.ref!==t.ref&&(t.flags|=512,t.flags|=2097152);else{if(!r){if(t.stateNode===null)throw Error(a(166));return Ze(t),null}if(e=Dn(It.current),Hl(t)){r=t.stateNode,n=t.type;var o=t.memoizedProps;switch(r[Dt]=t,r[Br]=o,e=(t.mode&1)!==0,n){case"dialog":Me("cancel",r),Me("close",r);break;case"iframe":case"object":case"embed":Me("load",r);break;case"video":case"audio":for(l=0;l<$r.length;l++)Me($r[l],r);break;case"source":Me("error",r);break;case"img":case"image":case"link":Me("error",r),Me("load",r);break;case"details":Me("toggle",r);break;case"input":dl(r,o),Me("invalid",r);break;case"select":r._wrapperState={wasMultiple:!!o.multiple},Me("invalid",r);break;case"textarea":vr(r,o),Me("invalid",r)}ln(n,o),l=null;for(var i in o)if(o.hasOwnProperty(i)){var c=o[i];i==="children"?typeof c=="string"?r.textContent!==c&&(o.suppressHydrationWarning!==!0&&Rl(r.textContent,c,e),l=["children",c]):typeof c=="number"&&r.textContent!==""+c&&(o.suppressHydrationWarning!==!0&&Rl(r.textContent,c,e),l=["children",""+c]):x.hasOwnProperty(i)&&c!=null&&i==="onScroll"&&Me("scroll",r)}switch(n){case"input":Et(r),Cn(r,o,!0);break;case"textarea":Et(r),Ht(r);break;case"select":case"option":break;default:typeof o.onClick=="function"&&(r.onclick=Dl)}r=l,t.updateQueue=r,r!==null&&(t.flags|=4)}else{i=l.nodeType===9?l:l.ownerDocument,e==="http://www.w3.org/1999/xhtml"&&(e=Nn(n)),e==="http://www.w3.org/1999/xhtml"?n==="script"?(e=i.createElement("div"),e.innerHTML="<script><\/script>",e=e.removeChild(e.firstChild)):typeof r.is=="string"?e=i.createElement(n,{is:r.is}):(e=i.createElement(n),n==="select"&&(i=e,r.multiple?i.multiple=!0:r.size&&(i.size=r.size))):e=i.createElementNS(e,n),e[Dt]=t,e[Br]=r,Qu(e,t,!1,!1),t.stateNode=e;e:{switch(i=wr(n,r),n){case"dialog":Me("cancel",e),Me("close",e),l=r;break;case"iframe":case"object":case"embed":Me("load",e),l=r;break;case"video":case"audio":for(l=0;l<$r.length;l++)Me($r[l],e);l=r;break;case"source":Me("error",e),l=r;break;case"img":case"image":case"link":Me("error",e),Me("load",e),l=r;break;case"details":Me("toggle",e),l=r;break;case"input":dl(e,r),l=ct(e,r),Me("invalid",e);break;case"option":l=r;break;case"select":e._wrapperState={wasMultiple:!!r.multiple},l=R({},r,{value:void 0}),Me("invalid",e);break;case"textarea":vr(e,r),l=An(e,r),Me("invalid",e);break;default:l=r}ln(n,l),c=l;for(o in c)if(c.hasOwnProperty(o)){var p=c[o];o==="style"?Lt(e,p):o==="dangerouslySetInnerHTML"?(p=p?p.__html:void 0,p!=null&&pl(e,p)):o==="children"?typeof p=="string"?(n!=="textarea"||p!=="")&&nn(e,p):typeof p=="number"&&nn(e,""+p):o!=="suppressContentEditableWarning"&&o!=="suppressHydrationWarning"&&o!=="autoFocus"&&(x.hasOwnProperty(o)?p!=null&&o==="onScroll"&&Me("scroll",e):p!=null&&Ae(e,o,p,i))}switch(n){case"input":Et(e),Cn(e,r,!1);break;case"textarea":Et(e),Ht(e);break;case"option":r.value!=null&&e.setAttribute("value",""+re(r.value));break;case"select":e.multiple=!!r.multiple,o=r.value,o!=null?Qe(e,!!r.multiple,o,!1):r.defaultValue!=null&&Qe(e,!!r.multiple,r.defaultValue,!0);break;default:typeof l.onClick=="function"&&(e.onclick=Dl)}switch(n){case"button":case"input":case"select":case"textarea":r=!!r.autoFocus;break e;case"img":r=!0;break e;default:r=!1}}r&&(t.flags|=4)}t.ref!==null&&(t.flags|=512,t.flags|=2097152)}return Ze(t),null;case 6:if(e&&t.stateNode!=null)qu(e,t,e.memoizedProps,r);else{if(typeof r!="string"&&t.stateNode===null)throw Error(a(166));if(n=Dn(Yr.current),Dn(It.current),Hl(t)){if(r=t.stateNode,n=t.memoizedProps,r[Dt]=t,(o=r.nodeValue!==n)&&(e=ft,e!==null))switch(e.tag){case 3:Rl(r.nodeValue,n,(e.mode&1)!==0);break;case 5:e.memoizedProps.suppressHydrationWarning!==!0&&Rl(r.nodeValue,n,(e.mode&1)!==0)}o&&(t.flags|=4)}else r=(n.nodeType===9?n:n.ownerDocument).createTextNode(r),r[Dt]=t,t.stateNode=r}return Ze(t),null;case 13:if(Le(De),r=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(Re&&gt!==null&&(t.mode&1)!==0&&(t.flags&128)===0)Zi(),lr(),t.flags|=98560,o=!1;else if(o=Hl(t),r!==null&&r.dehydrated!==null){if(e===null){if(!o)throw Error(a(318));if(o=t.memoizedState,o=o!==null?o.dehydrated:null,!o)throw Error(a(317));o[Dt]=t}else lr(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;Ze(t),o=!1}else Tt!==null&&(ls(Tt),Tt=null),o=!0;if(!o)return t.flags&65536?t:null}return(t.flags&128)!==0?(t.lanes=n,t):(r=r!==null,r!==(e!==null&&e.memoizedState!==null)&&r&&(t.child.flags|=8192,(t.mode&1)!==0&&(e===null||(De.current&1)!==0?Ve===0&&(Ve=3):ss())),t.updateQueue!==null&&(t.flags|=4),Ze(t),null);case 4:return ir(),Ya(e,t),e===null&&Fr(t.stateNode.containerInfo),Ze(t),null;case 10:return wa(t.type._context),Ze(t),null;case 17:return ot(t.type)&&Ol(),Ze(t),null;case 19:if(Le(De),o=t.memoizedState,o===null)return Ze(t),null;if(r=(t.flags&128)!==0,i=o.rendering,i===null)if(r)Xr(o,!1);else{if(Ve!==0||e!==null&&(e.flags&128)!==0)for(e=t.child;e!==null;){if(i=Jl(e),i!==null){for(t.flags|=128,Xr(o,!1),r=i.updateQueue,r!==null&&(t.updateQueue=r,t.flags|=4),t.subtreeFlags=0,r=n,n=t.child;n!==null;)o=n,e=r,o.flags&=14680066,i=o.alternate,i===null?(o.childLanes=0,o.lanes=e,o.child=null,o.subtreeFlags=0,o.memoizedProps=null,o.memoizedState=null,o.updateQueue=null,o.dependencies=null,o.stateNode=null):(o.childLanes=i.childLanes,o.lanes=i.lanes,o.child=i.child,o.subtreeFlags=0,o.deletions=null,o.memoizedProps=i.memoizedProps,o.memoizedState=i.memoizedState,o.updateQueue=i.updateQueue,o.type=i.type,e=i.dependencies,o.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext}),n=n.sibling;return ze(De,De.current&1|2),t.child}e=e.sibling}o.tail!==null&&Fe()>pr&&(t.flags|=128,r=!0,Xr(o,!1),t.lanes=4194304)}else{if(!r)if(e=Jl(i),e!==null){if(t.flags|=128,r=!0,n=e.updateQueue,n!==null&&(t.updateQueue=n,t.flags|=4),Xr(o,!0),o.tail===null&&o.tailMode==="hidden"&&!i.alternate&&!Re)return Ze(t),null}else 2*Fe()-o.renderingStartTime>pr&&n!==1073741824&&(t.flags|=128,r=!0,Xr(o,!1),t.lanes=4194304);o.isBackwards?(i.sibling=t.child,t.child=i):(n=o.last,n!==null?n.sibling=i:t.child=i,o.last=i)}return o.tail!==null?(t=o.tail,o.rendering=t,o.tail=t.sibling,o.renderingStartTime=Fe(),t.sibling=null,n=De.current,ze(De,r?n&1|2:n&1),t):(Ze(t),null);case 22:case 23:return as(),r=t.memoizedState!==null,e!==null&&e.memoizedState!==null!==r&&(t.flags|=8192),r&&(t.mode&1)!==0?(mt&1073741824)!==0&&(Ze(t),t.subtreeFlags&6&&(t.flags|=8192)):Ze(t),null;case 24:return null;case 25:return null}throw Error(a(156,t.tag))}function Df(e,t){switch(ma(t),t.tag){case 1:return ot(t.type)&&Ol(),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return ir(),Le(lt),Le(Ge),Na(),e=t.flags,(e&65536)!==0&&(e&128)===0?(t.flags=e&-65537|128,t):null;case 5:return Ca(t),null;case 13:if(Le(De),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(a(340));lr()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return Le(De),null;case 4:return ir(),null;case 10:return wa(t.type._context),null;case 22:case 23:return as(),null;case 24:return null;default:return null}}var lo=!1,et=!1,If=typeof WeakSet=="function"?WeakSet:Set,H=null;function cr(e,t){var n=e.ref;if(n!==null)if(typeof n=="function")try{n(null)}catch(r){Oe(e,t,r)}else n.current=null}function Qa(e,t,n){try{n()}catch(r){Oe(e,t,r)}}var Gu=!1;function Of(e,t){if(aa=Sl,e=Ti(),Xo(e)){if("selectionStart"in e)var n={start:e.selectionStart,end:e.selectionEnd};else e:{n=(n=e.ownerDocument)&&n.defaultView||window;var r=n.getSelection&&n.getSelection();if(r&&r.rangeCount!==0){n=r.anchorNode;var l=r.anchorOffset,o=r.focusNode;r=r.focusOffset;try{n.nodeType,o.nodeType}catch{n=null;break e}var i=0,c=-1,p=-1,_=0,P=0,M=e,T=null;t:for(;;){for(var B;M!==n||l!==0&&M.nodeType!==3||(c=i+l),M!==o||r!==0&&M.nodeType!==3||(p=i+r),M.nodeType===3&&(i+=M.nodeValue.length),(B=M.firstChild)!==null;)T=M,M=B;for(;;){if(M===e)break t;if(T===n&&++_===l&&(c=i),T===o&&++P===r&&(p=i),(B=M.nextSibling)!==null)break;M=T,T=M.parentNode}M=B}n=c===-1||p===-1?null:{start:c,end:p}}else n=null}n=n||{start:0,end:0}}else n=null;for(sa={focusedElem:e,selectionRange:n},Sl=!1,H=t;H!==null;)if(t=H,e=t.child,(t.subtreeFlags&1028)!==0&&e!==null)e.return=t,H=e;else for(;H!==null;){t=H;try{var W=t.alternate;if((t.flags&1024)!==0)switch(t.tag){case 0:case 11:case 15:break;case 1:if(W!==null){var Y=W.memoizedProps,Ue=W.memoizedState,v=t.stateNode,m=v.getSnapshotBeforeUpdate(t.elementType===t.type?Y:Pt(t.type,Y),Ue);v.__reactInternalSnapshotBeforeUpdate=m}break;case 3:var y=t.stateNode.containerInfo;y.nodeType===1?y.textContent="":y.nodeType===9&&y.documentElement&&y.removeChild(y.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(a(163))}}catch(I){Oe(t,t.return,I)}if(e=t.sibling,e!==null){e.return=t.return,H=e;break}H=t.return}return W=Gu,Gu=!1,W}function Zr(e,t,n){var r=t.updateQueue;if(r=r!==null?r.lastEffect:null,r!==null){var l=r=r.next;do{if((l.tag&e)===e){var o=l.destroy;l.destroy=void 0,o!==void 0&&Qa(t,n,o)}l=l.next}while(l!==r)}}function oo(e,t){if(t=t.updateQueue,t=t!==null?t.lastEffect:null,t!==null){var n=t=t.next;do{if((n.tag&e)===e){var r=n.create;n.destroy=r()}n=n.next}while(n!==t)}}function Ja(e){var t=e.ref;if(t!==null){var n=e.stateNode;switch(e.tag){case 5:e=n;break;default:e=n}typeof t=="function"?t(e):t.current=e}}function Xu(e){var t=e.alternate;t!==null&&(e.alternate=null,Xu(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&(delete t[Dt],delete t[Br],delete t[da],delete t[_f],delete t[wf])),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}function Zu(e){return e.tag===5||e.tag===3||e.tag===4}function ec(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||Zu(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function qa(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?n.nodeType===8?n.parentNode.insertBefore(e,t):n.insertBefore(e,t):(n.nodeType===8?(t=n.parentNode,t.insertBefore(e,n)):(t=n,t.appendChild(e)),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=Dl));else if(r!==4&&(e=e.child,e!==null))for(qa(e,t,n),e=e.sibling;e!==null;)qa(e,t,n),e=e.sibling}function Ga(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?n.insertBefore(e,t):n.appendChild(e);else if(r!==4&&(e=e.child,e!==null))for(Ga(e,t,n),e=e.sibling;e!==null;)Ga(e,t,n),e=e.sibling}var Je=null,jt=!1;function yn(e,t,n){for(n=n.child;n!==null;)tc(e,t,n),n=n.sibling}function tc(e,t,n){if(Rt&&typeof Rt.onCommitFiberUnmount=="function")try{Rt.onCommitFiberUnmount(vl,n)}catch{}switch(n.tag){case 5:et||cr(n,t);case 6:var r=Je,l=jt;Je=null,yn(e,t,n),Je=r,jt=l,Je!==null&&(jt?(e=Je,n=n.stateNode,e.nodeType===8?e.parentNode.removeChild(n):e.removeChild(n)):Je.removeChild(n.stateNode));break;case 18:Je!==null&&(jt?(e=Je,n=n.stateNode,e.nodeType===8?ca(e.parentNode,n):e.nodeType===1&&ca(e,n),jr(e)):ca(Je,n.stateNode));break;case 4:r=Je,l=jt,Je=n.stateNode.containerInfo,jt=!0,yn(e,t,n),Je=r,jt=l;break;case 0:case 11:case 14:case 15:if(!et&&(r=n.updateQueue,r!==null&&(r=r.lastEffect,r!==null))){l=r=r.next;do{var o=l,i=o.destroy;o=o.tag,i!==void 0&&((o&2)!==0||(o&4)!==0)&&Qa(n,t,i),l=l.next}while(l!==r)}yn(e,t,n);break;case 1:if(!et&&(cr(n,t),r=n.stateNode,typeof r.componentWillUnmount=="function"))try{r.props=n.memoizedProps,r.state=n.memoizedState,r.componentWillUnmount()}catch(c){Oe(n,t,c)}yn(e,t,n);break;case 21:yn(e,t,n);break;case 22:n.mode&1?(et=(r=et)||n.memoizedState!==null,yn(e,t,n),et=r):yn(e,t,n);break;default:yn(e,t,n)}}function nc(e){var t=e.updateQueue;if(t!==null){e.updateQueue=null;var n=e.stateNode;n===null&&(n=e.stateNode=new If),t.forEach(function(r){var l=Yf.bind(null,e,r);n.has(r)||(n.add(r),r.then(l,l))})}}function zt(e,t){var n=t.deletions;if(n!==null)for(var r=0;r<n.length;r++){var l=n[r];try{var o=e,i=t,c=i;e:for(;c!==null;){switch(c.tag){case 5:Je=c.stateNode,jt=!1;break e;case 3:Je=c.stateNode.containerInfo,jt=!0;break e;case 4:Je=c.stateNode.containerInfo,jt=!0;break e}c=c.return}if(Je===null)throw Error(a(160));tc(o,i,l),Je=null,jt=!1;var p=l.alternate;p!==null&&(p.return=null),l.return=null}catch(_){Oe(l,t,_)}}if(t.subtreeFlags&12854)for(t=t.child;t!==null;)rc(t,e),t=t.sibling}function rc(e,t){var n=e.alternate,r=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if(zt(t,e),$t(e),r&4){try{Zr(3,e,e.return),oo(3,e)}catch(Y){Oe(e,e.return,Y)}try{Zr(5,e,e.return)}catch(Y){Oe(e,e.return,Y)}}break;case 1:zt(t,e),$t(e),r&512&&n!==null&&cr(n,n.return);break;case 5:if(zt(t,e),$t(e),r&512&&n!==null&&cr(n,n.return),e.flags&32){var l=e.stateNode;try{nn(l,"")}catch(Y){Oe(e,e.return,Y)}}if(r&4&&(l=e.stateNode,l!=null)){var o=e.memoizedProps,i=n!==null?n.memoizedProps:o,c=e.type,p=e.updateQueue;if(e.updateQueue=null,p!==null)try{c==="input"&&o.type==="radio"&&o.name!=null&&xr(l,o),wr(c,i);var _=wr(c,o);for(i=0;i<p.length;i+=2){var P=p[i],M=p[i+1];P==="style"?Lt(l,M):P==="dangerouslySetInnerHTML"?pl(l,M):P==="children"?nn(l,M):Ae(l,P,M,_)}switch(c){case"input":dt(l,o);break;case"textarea":tn(l,o);break;case"select":var T=l._wrapperState.wasMultiple;l._wrapperState.wasMultiple=!!o.multiple;var B=o.value;B!=null?Qe(l,!!o.multiple,B,!1):T!==!!o.multiple&&(o.defaultValue!=null?Qe(l,!!o.multiple,o.defaultValue,!0):Qe(l,!!o.multiple,o.multiple?[]:"",!1))}l[Br]=o}catch(Y){Oe(e,e.return,Y)}}break;case 6:if(zt(t,e),$t(e),r&4){if(e.stateNode===null)throw Error(a(162));l=e.stateNode,o=e.memoizedProps;try{l.nodeValue=o}catch(Y){Oe(e,e.return,Y)}}break;case 3:if(zt(t,e),$t(e),r&4&&n!==null&&n.memoizedState.isDehydrated)try{jr(t.containerInfo)}catch(Y){Oe(e,e.return,Y)}break;case 4:zt(t,e),$t(e);break;case 13:zt(t,e),$t(e),l=e.child,l.flags&8192&&(o=l.memoizedState!==null,l.stateNode.isHidden=o,!o||l.alternate!==null&&l.alternate.memoizedState!==null||(es=Fe())),r&4&&nc(e);break;case 22:if(P=n!==null&&n.memoizedState!==null,e.mode&1?(et=(_=et)||P,zt(t,e),et=_):zt(t,e),$t(e),r&8192){if(_=e.memoizedState!==null,(e.stateNode.isHidden=_)&&!P&&(e.mode&1)!==0)for(H=e,P=e.child;P!==null;){for(M=H=P;H!==null;){switch(T=H,B=T.child,T.tag){case 0:case 11:case 14:case 15:Zr(4,T,T.return);break;case 1:cr(T,T.return);var W=T.stateNode;if(typeof W.componentWillUnmount=="function"){r=T,n=T.return;try{t=r,W.props=t.memoizedProps,W.state=t.memoizedState,W.componentWillUnmount()}catch(Y){Oe(r,n,Y)}}break;case 5:cr(T,T.return);break;case 22:if(T.memoizedState!==null){ac(M);continue}}B!==null?(B.return=T,H=B):ac(M)}P=P.sibling}e:for(P=null,M=e;;){if(M.tag===5){if(P===null){P=M;try{l=M.stateNode,_?(o=l.style,typeof o.setProperty=="function"?o.setProperty("display","none","important"):o.display="none"):(c=M.stateNode,p=M.memoizedProps.style,i=p!=null&&p.hasOwnProperty("display")?p.display:null,c.style.display=_r("display",i))}catch(Y){Oe(e,e.return,Y)}}}else if(M.tag===6){if(P===null)try{M.stateNode.nodeValue=_?"":M.memoizedProps}catch(Y){Oe(e,e.return,Y)}}else if((M.tag!==22&&M.tag!==23||M.memoizedState===null||M===e)&&M.child!==null){M.child.return=M,M=M.child;continue}if(M===e)break e;for(;M.sibling===null;){if(M.return===null||M.return===e)break e;P===M&&(P=null),M=M.return}P===M&&(P=null),M.sibling.return=M.return,M=M.sibling}}break;case 19:zt(t,e),$t(e),r&4&&nc(e);break;case 21:break;default:zt(t,e),$t(e)}}function $t(e){var t=e.flags;if(t&2){try{e:{for(var n=e.return;n!==null;){if(Zu(n)){var r=n;break e}n=n.return}throw Error(a(160))}switch(r.tag){case 5:var l=r.stateNode;r.flags&32&&(nn(l,""),r.flags&=-33);var o=ec(e);Ga(e,o,l);break;case 3:case 4:var i=r.stateNode.containerInfo,c=ec(e);qa(e,c,i);break;default:throw Error(a(161))}}catch(p){Oe(e,e.return,p)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function $f(e,t,n){H=e,lc(e)}function lc(e,t,n){for(var r=(e.mode&1)!==0;H!==null;){var l=H,o=l.child;if(l.tag===22&&r){var i=l.memoizedState!==null||lo;if(!i){var c=l.alternate,p=c!==null&&c.memoizedState!==null||et;c=lo;var _=et;if(lo=i,(et=p)&&!_)for(H=l;H!==null;)i=H,p=i.child,i.tag===22&&i.memoizedState!==null?sc(l):p!==null?(p.return=i,H=p):sc(l);for(;o!==null;)H=o,lc(o),o=o.sibling;H=l,lo=c,et=_}oc(e)}else(l.subtreeFlags&8772)!==0&&o!==null?(o.return=l,H=o):oc(e)}}function oc(e){for(;H!==null;){var t=H;if((t.flags&8772)!==0){var n=t.alternate;try{if((t.flags&8772)!==0)switch(t.tag){case 0:case 11:case 15:et||oo(5,t);break;case 1:var r=t.stateNode;if(t.flags&4&&!et)if(n===null)r.componentDidMount();else{var l=t.elementType===t.type?n.memoizedProps:Pt(t.type,n.memoizedProps);r.componentDidUpdate(l,n.memoizedState,r.__reactInternalSnapshotBeforeUpdate)}var o=t.updateQueue;o!==null&&au(t,o,r);break;case 3:var i=t.updateQueue;if(i!==null){if(n=null,t.child!==null)switch(t.child.tag){case 5:n=t.child.stateNode;break;case 1:n=t.child.stateNode}au(t,i,n)}break;case 5:var c=t.stateNode;if(n===null&&t.flags&4){n=c;var p=t.memoizedProps;switch(t.type){case"button":case"input":case"select":case"textarea":p.autoFocus&&n.focus();break;case"img":p.src&&(n.src=p.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(t.memoizedState===null){var _=t.alternate;if(_!==null){var P=_.memoizedState;if(P!==null){var M=P.dehydrated;M!==null&&jr(M)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(a(163))}et||t.flags&512&&Ja(t)}catch(T){Oe(t,t.return,T)}}if(t===e){H=null;break}if(n=t.sibling,n!==null){n.return=t.return,H=n;break}H=t.return}}function ac(e){for(;H!==null;){var t=H;if(t===e){H=null;break}var n=t.sibling;if(n!==null){n.return=t.return,H=n;break}H=t.return}}function sc(e){for(;H!==null;){var t=H;try{switch(t.tag){case 0:case 11:case 15:var n=t.return;try{oo(4,t)}catch(p){Oe(t,n,p)}break;case 1:var r=t.stateNode;if(typeof r.componentDidMount=="function"){var l=t.return;try{r.componentDidMount()}catch(p){Oe(t,l,p)}}var o=t.return;try{Ja(t)}catch(p){Oe(t,o,p)}break;case 5:var i=t.return;try{Ja(t)}catch(p){Oe(t,i,p)}}}catch(p){Oe(t,t.return,p)}if(t===e){H=null;break}var c=t.sibling;if(c!==null){c.return=t.return,H=c;break}H=t.return}}var Ff=Math.ceil,ao=ve.ReactCurrentDispatcher,Xa=ve.ReactCurrentOwner,bt=ve.ReactCurrentBatchConfig,xe=0,Ke=null,Be=null,qe=0,mt=0,dr=gn(0),Ve=0,el=null,On=0,so=0,Za=0,tl=null,st=null,es=0,pr=1/0,Gt=null,io=!1,ts=null,_n=null,uo=!1,wn=null,co=0,nl=0,ns=null,po=-1,fo=0;function nt(){return(xe&6)!==0?Fe():po!==-1?po:po=Fe()}function kn(e){return(e.mode&1)===0?1:(xe&2)!==0&&qe!==0?qe&-qe:bf.transition!==null?(fo===0&&(fo=ei()),fo):(e=ke,e!==0||(e=window.event,e=e===void 0?16:ui(e.type)),e)}function Mt(e,t,n,r){if(50<nl)throw nl=0,ns=null,Error(a(185));Cr(e,n,r),((xe&2)===0||e!==Ke)&&(e===Ke&&((xe&2)===0&&(so|=n),Ve===4&&bn(e,qe)),it(e,r),n===1&&xe===0&&(t.mode&1)===0&&(pr=Fe()+500,Fl&&hn()))}function it(e,t){var n=e.callbackNode;kp(e,t);var r=wl(e,e===Ke?qe:0);if(r===0)n!==null&&Gs(n),e.callbackNode=null,e.callbackPriority=0;else if(t=r&-r,e.callbackPriority!==t){if(n!=null&&Gs(n),t===1)e.tag===0?kf(uc.bind(null,e)):Qi(uc.bind(null,e)),vf(function(){(xe&6)===0&&hn()}),n=null;else{switch(ti(r)){case 1:n=Ro;break;case 4:n=Xs;break;case 16:n=xl;break;case 536870912:n=Zs;break;default:n=xl}n=xc(n,ic.bind(null,e))}e.callbackPriority=t,e.callbackNode=n}}function ic(e,t){if(po=-1,fo=0,(xe&6)!==0)throw Error(a(327));var n=e.callbackNode;if(fr()&&e.callbackNode!==n)return null;var r=wl(e,e===Ke?qe:0);if(r===0)return null;if((r&30)!==0||(r&e.expiredLanes)!==0||t)t=go(e,r);else{t=r;var l=xe;xe|=2;var o=dc();(Ke!==e||qe!==t)&&(Gt=null,pr=Fe()+500,Fn(e,t));do try{Hf();break}catch(c){cc(e,c)}while(!0);_a(),ao.current=o,xe=l,Be!==null?t=0:(Ke=null,qe=0,t=Ve)}if(t!==0){if(t===2&&(l=Do(e),l!==0&&(r=l,t=rs(e,l))),t===1)throw n=el,Fn(e,0),bn(e,r),it(e,Fe()),n;if(t===6)bn(e,r);else{if(l=e.current.alternate,(r&30)===0&&!Uf(l)&&(t=go(e,r),t===2&&(o=Do(e),o!==0&&(r=o,t=rs(e,o))),t===1))throw n=el,Fn(e,0),bn(e,r),it(e,Fe()),n;switch(e.finishedWork=l,e.finishedLanes=r,t){case 0:case 1:throw Error(a(345));case 2:Un(e,st,Gt);break;case 3:if(bn(e,r),(r&130023424)===r&&(t=es+500-Fe(),10<t)){if(wl(e,0)!==0)break;if(l=e.suspendedLanes,(l&r)!==r){nt(),e.pingedLanes|=e.suspendedLanes&l;break}e.timeoutHandle=ua(Un.bind(null,e,st,Gt),t);break}Un(e,st,Gt);break;case 4:if(bn(e,r),(r&4194240)===r)break;for(t=e.eventTimes,l=-1;0<r;){var i=31-At(r);o=1<<i,i=t[i],i>l&&(l=i),r&=~o}if(r=l,r=Fe()-r,r=(120>r?120:480>r?480:1080>r?1080:1920>r?1920:3e3>r?3e3:4320>r?4320:1960*Ff(r/1960))-r,10<r){e.timeoutHandle=ua(Un.bind(null,e,st,Gt),r);break}Un(e,st,Gt);break;case 5:Un(e,st,Gt);break;default:throw Error(a(329))}}}return it(e,Fe()),e.callbackNode===n?ic.bind(null,e):null}function rs(e,t){var n=tl;return e.current.memoizedState.isDehydrated&&(Fn(e,t).flags|=256),e=go(e,t),e!==2&&(t=st,st=n,t!==null&&ls(t)),e}function ls(e){st===null?st=e:st.push.apply(st,e)}function Uf(e){for(var t=e;;){if(t.flags&16384){var n=t.updateQueue;if(n!==null&&(n=n.stores,n!==null))for(var r=0;r<n.length;r++){var l=n[r],o=l.getSnapshot;l=l.value;try{if(!Nt(o(),l))return!1}catch{return!1}}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function bn(e,t){for(t&=~Za,t&=~so,e.suspendedLanes|=t,e.pingedLanes&=~t,e=e.expirationTimes;0<t;){var n=31-At(t),r=1<<n;e[n]=-1,t&=~r}}function uc(e){if((xe&6)!==0)throw Error(a(327));fr();var t=wl(e,0);if((t&1)===0)return it(e,Fe()),null;var n=go(e,t);if(e.tag!==0&&n===2){var r=Do(e);r!==0&&(t=r,n=rs(e,r))}if(n===1)throw n=el,Fn(e,0),bn(e,t),it(e,Fe()),n;if(n===6)throw Error(a(345));return e.finishedWork=e.current.alternate,e.finishedLanes=t,Un(e,st,Gt),it(e,Fe()),null}function os(e,t){var n=xe;xe|=1;try{return e(t)}finally{xe=n,xe===0&&(pr=Fe()+500,Fl&&hn())}}function $n(e){wn!==null&&wn.tag===0&&(xe&6)===0&&fr();var t=xe;xe|=1;var n=bt.transition,r=ke;try{if(bt.transition=null,ke=1,e)return e()}finally{ke=r,bt.transition=n,xe=t,(xe&6)===0&&hn()}}function as(){mt=dr.current,Le(dr)}function Fn(e,t){e.finishedWork=null,e.finishedLanes=0;var n=e.timeoutHandle;if(n!==-1&&(e.timeoutHandle=-1,xf(n)),Be!==null)for(n=Be.return;n!==null;){var r=n;switch(ma(r),r.tag){case 1:r=r.type.childContextTypes,r!=null&&Ol();break;case 3:ir(),Le(lt),Le(Ge),Na();break;case 5:Ca(r);break;case 4:ir();break;case 13:Le(De);break;case 19:Le(De);break;case 10:wa(r.type._context);break;case 22:case 23:as()}n=n.return}if(Ke=e,Be=e=Sn(e.current,null),qe=mt=t,Ve=0,el=null,Za=so=On=0,st=tl=null,Rn!==null){for(t=0;t<Rn.length;t++)if(n=Rn[t],r=n.interleaved,r!==null){n.interleaved=null;var l=r.next,o=n.pending;if(o!==null){var i=o.next;o.next=l,r.next=i}n.pending=r}Rn=null}return e}function cc(e,t){do{var n=Be;try{if(_a(),ql.current=eo,Gl){for(var r=Ie.memoizedState;r!==null;){var l=r.queue;l!==null&&(l.pending=null),r=r.next}Gl=!1}if(In=0,We=He=Ie=null,Qr=!1,Jr=0,Xa.current=null,n===null||n.return===null){Ve=1,el=t,Be=null;break}e:{var o=e,i=n.return,c=n,p=t;if(t=qe,c.flags|=32768,p!==null&&typeof p=="object"&&typeof p.then=="function"){var _=p,P=c,M=P.tag;if((P.mode&1)===0&&(M===0||M===11||M===15)){var T=P.alternate;T?(P.updateQueue=T.updateQueue,P.memoizedState=T.memoizedState,P.lanes=T.lanes):(P.updateQueue=null,P.memoizedState=null)}var B=Ru(i);if(B!==null){B.flags&=-257,Du(B,i,c,o,t),B.mode&1&&Lu(o,_,t),t=B,p=_;var W=t.updateQueue;if(W===null){var Y=new Set;Y.add(p),t.updateQueue=Y}else W.add(p);break e}else{if((t&1)===0){Lu(o,_,t),ss();break e}p=Error(a(426))}}else if(Re&&c.mode&1){var Ue=Ru(i);if(Ue!==null){(Ue.flags&65536)===0&&(Ue.flags|=256),Du(Ue,i,c,o,t),va(ur(p,c));break e}}o=p=ur(p,c),Ve!==4&&(Ve=2),tl===null?tl=[o]:tl.push(o),o=i;do{switch(o.tag){case 3:o.flags|=65536,t&=-t,o.lanes|=t;var v=zu(o,p,t);ou(o,v);break e;case 1:c=p;var m=o.type,y=o.stateNode;if((o.flags&128)===0&&(typeof m.getDerivedStateFromError=="function"||y!==null&&typeof y.componentDidCatch=="function"&&(_n===null||!_n.has(y)))){o.flags|=65536,t&=-t,o.lanes|=t;var I=Mu(o,c,t);ou(o,I);break e}}o=o.return}while(o!==null)}fc(n)}catch(Q){t=Q,Be===n&&n!==null&&(Be=n=n.return);continue}break}while(!0)}function dc(){var e=ao.current;return ao.current=eo,e===null?eo:e}function ss(){(Ve===0||Ve===3||Ve===2)&&(Ve=4),Ke===null||(On&268435455)===0&&(so&268435455)===0||bn(Ke,qe)}function go(e,t){var n=xe;xe|=2;var r=dc();(Ke!==e||qe!==t)&&(Gt=null,Fn(e,t));do try{Bf();break}catch(l){cc(e,l)}while(!0);if(_a(),xe=n,ao.current=r,Be!==null)throw Error(a(261));return Ke=null,qe=0,Ve}function Bf(){for(;Be!==null;)pc(Be)}function Hf(){for(;Be!==null&&!fp();)pc(Be)}function pc(e){var t=hc(e.alternate,e,mt);e.memoizedProps=e.pendingProps,t===null?fc(e):Be=t,Xa.current=null}function fc(e){var t=e;do{var n=t.alternate;if(e=t.return,(t.flags&32768)===0){if(n=Rf(n,t,mt),n!==null){Be=n;return}}else{if(n=Df(n,t),n!==null){n.flags&=32767,Be=n;return}if(e!==null)e.flags|=32768,e.subtreeFlags=0,e.deletions=null;else{Ve=6,Be=null;return}}if(t=t.sibling,t!==null){Be=t;return}Be=t=e}while(t!==null);Ve===0&&(Ve=5)}function Un(e,t,n){var r=ke,l=bt.transition;try{bt.transition=null,ke=1,Vf(e,t,n,r)}finally{bt.transition=l,ke=r}return null}function Vf(e,t,n,r){do fr();while(wn!==null);if((xe&6)!==0)throw Error(a(327));n=e.finishedWork;var l=e.finishedLanes;if(n===null)return null;if(e.finishedWork=null,e.finishedLanes=0,n===e.current)throw Error(a(177));e.callbackNode=null,e.callbackPriority=0;var o=n.lanes|n.childLanes;if(bp(e,o),e===Ke&&(Be=Ke=null,qe=0),(n.subtreeFlags&2064)===0&&(n.flags&2064)===0||uo||(uo=!0,xc(xl,function(){return fr(),null})),o=(n.flags&15990)!==0,(n.subtreeFlags&15990)!==0||o){o=bt.transition,bt.transition=null;var i=ke;ke=1;var c=xe;xe|=4,Xa.current=null,Of(e,n),rc(n,e),cf(sa),Sl=!!aa,sa=aa=null,e.current=n,$f(n),gp(),xe=c,ke=i,bt.transition=o}else e.current=n;if(uo&&(uo=!1,wn=e,co=l),o=e.pendingLanes,o===0&&(_n=null),xp(n.stateNode),it(e,Fe()),t!==null)for(r=e.onRecoverableError,n=0;n<t.length;n++)l=t[n],r(l.value,{componentStack:l.stack,digest:l.digest});if(io)throw io=!1,e=ts,ts=null,e;return(co&1)!==0&&e.tag!==0&&fr(),o=e.pendingLanes,(o&1)!==0?e===ns?nl++:(nl=0,ns=e):nl=0,hn(),null}function fr(){if(wn!==null){var e=ti(co),t=bt.transition,n=ke;try{if(bt.transition=null,ke=16>e?16:e,wn===null)var r=!1;else{if(e=wn,wn=null,co=0,(xe&6)!==0)throw Error(a(331));var l=xe;for(xe|=4,H=e.current;H!==null;){var o=H,i=o.child;if((H.flags&16)!==0){var c=o.deletions;if(c!==null){for(var p=0;p<c.length;p++){var _=c[p];for(H=_;H!==null;){var P=H;switch(P.tag){case 0:case 11:case 15:Zr(8,P,o)}var M=P.child;if(M!==null)M.return=P,H=M;else for(;H!==null;){P=H;var T=P.sibling,B=P.return;if(Xu(P),P===_){H=null;break}if(T!==null){T.return=B,H=T;break}H=B}}}var W=o.alternate;if(W!==null){var Y=W.child;if(Y!==null){W.child=null;do{var Ue=Y.sibling;Y.sibling=null,Y=Ue}while(Y!==null)}}H=o}}if((o.subtreeFlags&2064)!==0&&i!==null)i.return=o,H=i;else e:for(;H!==null;){if(o=H,(o.flags&2048)!==0)switch(o.tag){case 0:case 11:case 15:Zr(9,o,o.return)}var v=o.sibling;if(v!==null){v.return=o.return,H=v;break e}H=o.return}}var m=e.current;for(H=m;H!==null;){i=H;var y=i.child;if((i.subtreeFlags&2064)!==0&&y!==null)y.return=i,H=y;else e:for(i=m;H!==null;){if(c=H,(c.flags&2048)!==0)try{switch(c.tag){case 0:case 11:case 15:oo(9,c)}}catch(Q){Oe(c,c.return,Q)}if(c===i){H=null;break e}var I=c.sibling;if(I!==null){I.return=c.return,H=I;break e}H=c.return}}if(xe=l,hn(),Rt&&typeof Rt.onPostCommitFiberRoot=="function")try{Rt.onPostCommitFiberRoot(vl,e)}catch{}r=!0}return r}finally{ke=n,bt.transition=t}}return!1}function gc(e,t,n){t=ur(n,t),t=zu(e,t,1),e=vn(e,t,1),t=nt(),e!==null&&(Cr(e,1,t),it(e,t))}function Oe(e,t,n){if(e.tag===3)gc(e,e,n);else for(;t!==null;){if(t.tag===3){gc(t,e,n);break}else if(t.tag===1){var r=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof r.componentDidCatch=="function"&&(_n===null||!_n.has(r))){e=ur(n,e),e=Mu(t,e,1),t=vn(t,e,1),e=nt(),t!==null&&(Cr(t,1,e),it(t,e));break}}t=t.return}}function Wf(e,t,n){var r=e.pingCache;r!==null&&r.delete(t),t=nt(),e.pingedLanes|=e.suspendedLanes&n,Ke===e&&(qe&n)===n&&(Ve===4||Ve===3&&(qe&130023424)===qe&&500>Fe()-es?Fn(e,0):Za|=n),it(e,t)}function mc(e,t){t===0&&((e.mode&1)===0?t=1:(t=_l,_l<<=1,(_l&130023424)===0&&(_l=4194304)));var n=nt();e=Qt(e,t),e!==null&&(Cr(e,t,n),it(e,n))}function Kf(e){var t=e.memoizedState,n=0;t!==null&&(n=t.retryLane),mc(e,n)}function Yf(e,t){var n=0;switch(e.tag){case 13:var r=e.stateNode,l=e.memoizedState;l!==null&&(n=l.retryLane);break;case 19:r=e.stateNode;break;default:throw Error(a(314))}r!==null&&r.delete(t),mc(e,n)}var hc;hc=function(e,t,n){if(e!==null)if(e.memoizedProps!==t.pendingProps||lt.current)at=!0;else{if((e.lanes&n)===0&&(t.flags&128)===0)return at=!1,Lf(e,t,n);at=(e.flags&131072)!==0}else at=!1,Re&&(t.flags&1048576)!==0&&Ji(t,Bl,t.index);switch(t.lanes=0,t.tag){case 2:var r=t.type;ro(e,t),e=t.pendingProps;var l=tr(t,Ge.current);sr(t,n),l=ja(null,t,r,e,l,n);var o=za();return t.flags|=1,typeof l=="object"&&l!==null&&typeof l.render=="function"&&l.$$typeof===void 0?(t.tag=1,t.memoizedState=null,t.updateQueue=null,ot(r)?(o=!0,$l(t)):o=!1,t.memoizedState=l.state!==null&&l.state!==void 0?l.state:null,Sa(t),l.updater=to,t.stateNode=l,l._reactInternals=t,Oa(t,r,e,n),t=Ba(null,t,r,!0,o,n)):(t.tag=0,Re&&o&&ga(t),tt(null,t,l,n),t=t.child),t;case 16:r=t.elementType;e:{switch(ro(e,t),e=t.pendingProps,l=r._init,r=l(r._payload),t.type=r,l=t.tag=Jf(r),e=Pt(r,e),l){case 0:t=Ua(null,t,r,e,n);break e;case 1:t=Bu(null,t,r,e,n);break e;case 11:t=Iu(null,t,r,e,n);break e;case 14:t=Ou(null,t,r,Pt(r.type,e),n);break e}throw Error(a(306,r,""))}return t;case 0:return r=t.type,l=t.pendingProps,l=t.elementType===r?l:Pt(r,l),Ua(e,t,r,l,n);case 1:return r=t.type,l=t.pendingProps,l=t.elementType===r?l:Pt(r,l),Bu(e,t,r,l,n);case 3:e:{if(Hu(t),e===null)throw Error(a(387));r=t.pendingProps,o=t.memoizedState,l=o.element,lu(e,t),Ql(t,r,null,n);var i=t.memoizedState;if(r=i.element,o.isDehydrated)if(o={element:r,isDehydrated:!1,cache:i.cache,pendingSuspenseBoundaries:i.pendingSuspenseBoundaries,transitions:i.transitions},t.updateQueue.baseState=o,t.memoizedState=o,t.flags&256){l=ur(Error(a(423)),t),t=Vu(e,t,r,n,l);break e}else if(r!==l){l=ur(Error(a(424)),t),t=Vu(e,t,r,n,l);break e}else for(gt=fn(t.stateNode.containerInfo.firstChild),ft=t,Re=!0,Tt=null,n=nu(t,null,r,n),t.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(lr(),r===l){t=qt(e,t,n);break e}tt(e,t,r,n)}t=t.child}return t;case 5:return su(t),e===null&&xa(t),r=t.type,l=t.pendingProps,o=e!==null?e.memoizedProps:null,i=l.children,ia(r,l)?i=null:o!==null&&ia(r,o)&&(t.flags|=32),Uu(e,t),tt(e,t,i,n),t.child;case 6:return e===null&&xa(t),null;case 13:return Wu(e,t,n);case 4:return Ea(t,t.stateNode.containerInfo),r=t.pendingProps,e===null?t.child=or(t,null,r,n):tt(e,t,r,n),t.child;case 11:return r=t.type,l=t.pendingProps,l=t.elementType===r?l:Pt(r,l),Iu(e,t,r,l,n);case 7:return tt(e,t,t.pendingProps,n),t.child;case 8:return tt(e,t,t.pendingProps.children,n),t.child;case 12:return tt(e,t,t.pendingProps.children,n),t.child;case 10:e:{if(r=t.type._context,l=t.pendingProps,o=t.memoizedProps,i=l.value,ze(Wl,r._currentValue),r._currentValue=i,o!==null)if(Nt(o.value,i)){if(o.children===l.children&&!lt.current){t=qt(e,t,n);break e}}else for(o=t.child,o!==null&&(o.return=t);o!==null;){var c=o.dependencies;if(c!==null){i=o.child;for(var p=c.firstContext;p!==null;){if(p.context===r){if(o.tag===1){p=Jt(-1,n&-n),p.tag=2;var _=o.updateQueue;if(_!==null){_=_.shared;var P=_.pending;P===null?p.next=p:(p.next=P.next,P.next=p),_.pending=p}}o.lanes|=n,p=o.alternate,p!==null&&(p.lanes|=n),ka(o.return,n,t),c.lanes|=n;break}p=p.next}}else if(o.tag===10)i=o.type===t.type?null:o.child;else if(o.tag===18){if(i=o.return,i===null)throw Error(a(341));i.lanes|=n,c=i.alternate,c!==null&&(c.lanes|=n),ka(i,n,t),i=o.sibling}else i=o.child;if(i!==null)i.return=o;else for(i=o;i!==null;){if(i===t){i=null;break}if(o=i.sibling,o!==null){o.return=i.return,i=o;break}i=i.return}o=i}tt(e,t,l.children,n),t=t.child}return t;case 9:return l=t.type,r=t.pendingProps.children,sr(t,n),l=wt(l),r=r(l),t.flags|=1,tt(e,t,r,n),t.child;case 14:return r=t.type,l=Pt(r,t.pendingProps),l=Pt(r.type,l),Ou(e,t,r,l,n);case 15:return $u(e,t,t.type,t.pendingProps,n);case 17:return r=t.type,l=t.pendingProps,l=t.elementType===r?l:Pt(r,l),ro(e,t),t.tag=1,ot(r)?(e=!0,$l(t)):e=!1,sr(t,n),Pu(t,r,l),Oa(t,r,l,n),Ba(null,t,r,!0,e,n);case 19:return Yu(e,t,n);case 22:return Fu(e,t,n)}throw Error(a(156,t.tag))};function xc(e,t){return qs(e,t)}function Qf(e,t,n,r){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=r,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function St(e,t,n,r){return new Qf(e,t,n,r)}function is(e){return e=e.prototype,!(!e||!e.isReactComponent)}function Jf(e){if(typeof e=="function")return is(e)?1:0;if(e!=null){if(e=e.$$typeof,e===be)return 11;if(e===he)return 14}return 2}function Sn(e,t){var n=e.alternate;return n===null?(n=St(e.tag,t,e.key,e.mode),n.elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=e.flags&14680064,n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n}function mo(e,t,n,r,l,o){var i=2;if(r=e,typeof e=="function")is(e)&&(i=1);else if(typeof e=="string")i=5;else e:switch(e){case L:return Bn(n.children,l,o,t);case F:i=8,l|=8;break;case K:return e=St(12,n,t,l|2),e.elementType=K,e.lanes=o,e;case q:return e=St(13,n,t,l),e.elementType=q,e.lanes=o,e;case Se:return e=St(19,n,t,l),e.elementType=Se,e.lanes=o,e;case de:return ho(n,l,o,t);default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case ge:i=10;break e;case Ne:i=9;break e;case be:i=11;break e;case he:i=14;break e;case je:i=16,r=null;break e}throw Error(a(130,e==null?e:typeof e,""))}return t=St(i,n,t,l),t.elementType=e,t.type=r,t.lanes=o,t}function Bn(e,t,n,r){return e=St(7,e,r,t),e.lanes=n,e}function ho(e,t,n,r){return e=St(22,e,r,t),e.elementType=de,e.lanes=n,e.stateNode={isHidden:!1},e}function us(e,t,n){return e=St(6,e,null,t),e.lanes=n,e}function cs(e,t,n){return t=St(4,e.children!==null?e.children:[],e.key,t),t.lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}function qf(e,t,n,r,l){this.tag=t,this.containerInfo=e,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=Io(0),this.expirationTimes=Io(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Io(0),this.identifierPrefix=r,this.onRecoverableError=l,this.mutableSourceEagerHydrationData=null}function ds(e,t,n,r,l,o,i,c,p){return e=new qf(e,t,n,c,p),t===1?(t=1,o===!0&&(t|=8)):t=0,o=St(3,null,null,t),e.current=o,o.stateNode=e,o.memoizedState={element:r,isDehydrated:n,cache:null,transitions:null,pendingSuspenseBoundaries:null},Sa(o),e}function Gf(e,t,n){var r=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:N,key:r==null?null:""+r,children:e,containerInfo:t,implementation:n}}function vc(e){if(!e)return mn;e=e._reactInternals;e:{if(Pn(e)!==e||e.tag!==1)throw Error(a(170));var t=e;do{switch(t.tag){case 3:t=t.stateNode.context;break e;case 1:if(ot(t.type)){t=t.stateNode.__reactInternalMemoizedMergedChildContext;break e}}t=t.return}while(t!==null);throw Error(a(171))}if(e.tag===1){var n=e.type;if(ot(n))return Ki(e,n,t)}return t}function yc(e,t,n,r,l,o,i,c,p){return e=ds(n,r,!0,e,l,o,i,c,p),e.context=vc(null),n=e.current,r=nt(),l=kn(n),o=Jt(r,l),o.callback=t??null,vn(n,o,l),e.current.lanes=l,Cr(e,l,r),it(e,r),e}function xo(e,t,n,r){var l=t.current,o=nt(),i=kn(l);return n=vc(n),t.context===null?t.context=n:t.pendingContext=n,t=Jt(o,i),t.payload={element:e},r=r===void 0?null:r,r!==null&&(t.callback=r),e=vn(l,t,i),e!==null&&(Mt(e,l,i,o),Yl(e,l,i)),i}function vo(e){if(e=e.current,!e.child)return null;switch(e.child.tag){case 5:return e.child.stateNode;default:return e.child.stateNode}}function _c(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var n=e.retryLane;e.retryLane=n!==0&&n<t?n:t}}function ps(e,t){_c(e,t),(e=e.alternate)&&_c(e,t)}function Xf(){return null}var wc=typeof reportError=="function"?reportError:function(e){console.error(e)};function fs(e){this._internalRoot=e}yo.prototype.render=fs.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(a(409));xo(e,t,null,null)},yo.prototype.unmount=fs.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;$n(function(){xo(null,e,null,null)}),t[Vt]=null}};function yo(e){this._internalRoot=e}yo.prototype.unstable_scheduleHydration=function(e){if(e){var t=li();e={blockedOn:null,target:e,priority:t};for(var n=0;n<cn.length&&t!==0&&t<cn[n].priority;n++);cn.splice(n,0,e),n===0&&si(e)}};function gs(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function _o(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11&&(e.nodeType!==8||e.nodeValue!==" react-mount-point-unstable "))}function kc(){}function Zf(e,t,n,r,l){if(l){if(typeof r=="function"){var o=r;r=function(){var _=vo(i);o.call(_)}}var i=yc(t,r,e,0,null,!1,!1,"",kc);return e._reactRootContainer=i,e[Vt]=i.current,Fr(e.nodeType===8?e.parentNode:e),$n(),i}for(;l=e.lastChild;)e.removeChild(l);if(typeof r=="function"){var c=r;r=function(){var _=vo(p);c.call(_)}}var p=ds(e,0,!1,null,null,!1,!1,"",kc);return e._reactRootContainer=p,e[Vt]=p.current,Fr(e.nodeType===8?e.parentNode:e),$n(function(){xo(t,p,n,r)}),p}function wo(e,t,n,r,l){var o=n._reactRootContainer;if(o){var i=o;if(typeof l=="function"){var c=l;l=function(){var p=vo(i);c.call(p)}}xo(t,i,e,l)}else i=Zf(n,t,e,l,r);return vo(i)}ni=function(e){switch(e.tag){case 3:var t=e.stateNode;if(t.current.memoizedState.isDehydrated){var n=Er(t.pendingLanes);n!==0&&(Oo(t,n|1),it(t,Fe()),(xe&6)===0&&(pr=Fe()+500,hn()))}break;case 13:$n(function(){var r=Qt(e,1);if(r!==null){var l=nt();Mt(r,e,1,l)}}),ps(e,1)}},$o=function(e){if(e.tag===13){var t=Qt(e,134217728);if(t!==null){var n=nt();Mt(t,e,134217728,n)}ps(e,134217728)}},ri=function(e){if(e.tag===13){var t=kn(e),n=Qt(e,t);if(n!==null){var r=nt();Mt(n,e,t,r)}ps(e,t)}},li=function(){return ke},oi=function(e,t){var n=ke;try{return ke=e,t()}finally{ke=n}},br=function(e,t,n){switch(t){case"input":if(dt(e,n),t=n.name,n.type==="radio"&&t!=null){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+t)+'][type="radio"]'),t=0;t<n.length;t++){var r=n[t];if(r!==e&&r.form===e.form){var l=Il(r);if(!l)throw Error(a(90));xt(r),dt(r,l)}}}break;case"textarea":tn(e,n);break;case"select":t=n.value,t!=null&&Qe(e,!!n.multiple,t,!1)}},S=os,V=$n;var eg={usingClientEntryPoint:!1,Events:[Hr,Zn,Il,gl,Sr,os]},rl={findFiberByHostInstance:jn,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},tg={bundleType:rl.bundleType,version:rl.version,rendererPackageName:rl.rendererPackageName,rendererConfig:rl.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:ve.ReactCurrentDispatcher,findHostInstanceByFiber:function(e){return e=Qs(e),e===null?null:e.stateNode},findFiberByHostInstance:rl.findFiberByHostInstance||Xf,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var ko=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!ko.isDisabled&&ko.supportsFiber)try{vl=ko.inject(tg),Rt=ko}catch{}}return rt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=eg,rt.createPortal=function(e,t){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!gs(t))throw Error(a(200));return Gf(e,t,null,n)},rt.createRoot=function(e,t){if(!gs(e))throw Error(a(299));var n=!1,r="",l=wc;return t!=null&&(t.unstable_strictMode===!0&&(n=!0),t.identifierPrefix!==void 0&&(r=t.identifierPrefix),t.onRecoverableError!==void 0&&(l=t.onRecoverableError)),t=ds(e,1,!1,null,null,n,!1,r,l),e[Vt]=t.current,Fr(e.nodeType===8?e.parentNode:e),new fs(t)},rt.findDOMNode=function(e){if(e==null)return null;if(e.nodeType===1)return e;var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(a(188)):(e=Object.keys(e).join(","),Error(a(268,e)));return e=Qs(t),e=e===null?null:e.stateNode,e},rt.flushSync=function(e){return $n(e)},rt.hydrate=function(e,t,n){if(!_o(t))throw Error(a(200));return wo(null,e,t,!0,n)},rt.hydrateRoot=function(e,t,n){if(!gs(e))throw Error(a(405));var r=n!=null&&n.hydratedSources||null,l=!1,o="",i=wc;if(n!=null&&(n.unstable_strictMode===!0&&(l=!0),n.identifierPrefix!==void 0&&(o=n.identifierPrefix),n.onRecoverableError!==void 0&&(i=n.onRecoverableError)),t=yc(t,null,e,1,n??null,l,!1,o,i),e[Vt]=t.current,Fr(e),r)for(e=0;e<r.length;e++)n=r[e],l=n._getVersion,l=l(n._source),t.mutableSourceEagerHydrationData==null?t.mutableSourceEagerHydrationData=[n,l]:t.mutableSourceEagerHydrationData.push(n,l);return new yo(t)},rt.render=function(e,t,n){if(!_o(t))throw Error(a(200));return wo(null,e,t,!1,n)},rt.unmountComponentAtNode=function(e){if(!_o(e))throw Error(a(40));return e._reactRootContainer?($n(function(){wo(null,null,e,!1,function(){e._reactRootContainer=null,e[Vt]=null})}),!0):!1},rt.unstable_batchedUpdates=os,rt.unstable_renderSubtreeIntoContainer=function(e,t,n,r){if(!_o(n))throw Error(a(200));if(e==null||e._reactInternals===void 0)throw Error(a(38));return wo(e,t,n,!1,r)},rt.version="18.3.1-next-f1338f8080-20240426",rt}var ks;function Tc(){if(ks)return Eo.exports;ks=1;function s(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(s)}catch(u){console.error(u)}}return s(),Eo.exports=Nc(),Eo.exports}var bs;function Pc(){if(bs)return ll;bs=1;var s=Tc();return ll.createRoot=s.createRoot,ll.hydrateRoot=s.hydrateRoot,ll}var jc=Pc();function zc(){if(typeof window>"u")return!1;const s=window;return!!(s.SpeechRecognition||s.webkitSpeechRecognition)}function Mc(){if(typeof window>"u")return null;const s=window;return s.SpeechRecognition??s.webkitSpeechRecognition??null}function Lc(s){const u=Mc();if(!u)return s.onError("Voice input is not supported in this browser."),null;let a=new u;a.continuous=!0,a.interimResults=!0;try{a.lang=navigator.language||"en-US"}catch{a.lang="en-US"}let f=!1,x="";a.onresult=h=>{var w;let A="",E="";for(let j=h.resultIndex;j<h.results.length;j++){const z=h.results[j],C=((w=z[0])==null?void 0:w.transcript)??"";z.isFinal?E+=C:A+=C}E&&(x=(x+" "+E).trim()),s.onPartial((x+" "+A).trim())},a.onerror=h=>{const A=h.error??"unknown";f||(A==="no-speech"?s.onError("Voice: silence detected. Hold the mic and speak."):A==="not-allowed"||A==="service-not-allowed"?s.onError("Voice: microphone permission denied."):A==="aborted"||s.onError(`Voice error: ${A}`))},a.onend=()=>{f||x&&s.onCommit(x)};try{a.start()}catch(h){return s.onError(h instanceof Error?h.message:"Voice failed to start."),null}return{stop:()=>{try{a==null||a.stop()}catch{}},abort:()=>{f=!0;try{a==null||a.abort()}catch{}a=null}}}function Rc(s){const u=[],a=s.split(`
`);let f=0,x=[];function h(){x.length!==0&&(u.push({kind:"prose",body:x.join(`
`)}),x=[])}for(;f<a.length;){const A=a[f],E=A.match(/^```(\w[\w+-]*)?\s*$/);if(E){h();const w=E[1]||null;f++;const j=f;for(;f<a.length&&!a[f].match(/^```\s*$/);)f++;const z=a.slice(j,f).join(`
`);u.push({kind:"code",lang:w,body:z}),f++;continue}x.push(A),f++}return h(),u}const Dc=[[/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/,(s,u)=>g.jsx("a",{href:s[2],target:"_blank",rel:"noopener noreferrer",className:"gauntlet-md__link",children:s[1]},`a-${u}`)],[/`([^`]+)`/,(s,u)=>g.jsx("code",{className:"gauntlet-md__inline-code",children:s[1]},`c-${u}`)],[/\*\*([^*]+)\*\*/,(s,u)=>g.jsx("strong",{className:"gauntlet-md__strong",children:s[1]},`b-${u}`)],[/\*([^*]+)\*/,(s,u)=>g.jsx("em",{className:"gauntlet-md__em",children:s[1]},`i-${u}`)],[/_([^_]+)_/,(s,u)=>g.jsx("em",{className:"gauntlet-md__em",children:s[1]},`u-${u}`)]];function mr(s,u){const a=[];let f=0,x=0;for(;f<s.length;){let h=null;for(const[A,E]of Dc){const j=s.slice(f).match(A);!j||j.index===void 0||(h===null||j.index<h.idx)&&(h={idx:j.index,match:j,render:E})}if(h===null){a.push(s.slice(f));break}h.idx>0&&a.push(s.slice(f,f+h.idx)),a.push(h.render(h.match,u*100+x)),x++,f+=h.idx+h.match[0].length}return a}function Ic(s,u){const a=[],f=s.split(`
`);let x=0,h=u;for(;x<f.length;){const E=f[x].trim();if(!E){x++;continue}const w=E.match(/^(#{1,3})\s+(.*)$/);if(w){const z=w[1].length,U=`h${z}`;a.push(g.jsx(U,{className:`gauntlet-md__h gauntlet-md__h${z}`,children:mr(w[2],h++)},`h-${h++}`)),x++;continue}if(/^---+$/.test(E)||/^\*\*\*+$/.test(E)){a.push(g.jsx("hr",{className:"gauntlet-md__hr"},`hr-${h++}`)),x++;continue}if(E.startsWith(">")){const z=[];for(;x<f.length&&f[x].trim().startsWith(">");)z.push(f[x].replace(/^\s*>\s?/,"")),x++;a.push(g.jsx("blockquote",{className:"gauntlet-md__quote",children:mr(z.join(" "),h++)},`q-${h++}`));continue}if(/^[-*]\s+/.test(E)){const z=[];for(;x<f.length&&/^[-*]\s+/.test(f[x].trim());)z.push(f[x].trim().replace(/^[-*]\s+/,"")),x++;a.push(g.jsx("ul",{className:"gauntlet-md__list",children:z.map((C,U)=>g.jsx("li",{className:"gauntlet-md__li",children:mr(C,h++)},U))},`ul-${h++}`));continue}if(/^\d+\.\s+/.test(E)){const z=[];for(;x<f.length&&/^\d+\.\s+/.test(f[x].trim());)z.push(f[x].trim().replace(/^\d+\.\s+/,"")),x++;a.push(g.jsx("ol",{className:"gauntlet-md__list",children:z.map((C,U)=>g.jsx("li",{className:"gauntlet-md__li",children:mr(C,h++)},U))},`ol-${h++}`));continue}const j=[];for(;x<f.length;){const z=f[x],C=z.trim();if(!C||/^(#{1,3})\s+/.test(C)||/^---+$/.test(C)||/^\*\*\*+$/.test(C)||C.startsWith(">")||/^[-*]\s+/.test(C)||/^\d+\.\s+/.test(C))break;j.push(z),x++}a.push(g.jsx("p",{className:"gauntlet-md__p",children:mr(j.join(" "),h++)},`p-${h++}`))}return a}function Oc({source:s,onCopyBlock:u}){const a=Rc(s);return g.jsx("div",{className:"gauntlet-md",children:a.map((f,x)=>f.kind==="code"?g.jsx(Qc,{lang:f.lang,body:f.body,onCopy:u},`cb-${x}`):g.jsx("div",{className:"gauntlet-md__prose",children:Ic(f.body,x*1e3)},`pb-${x}`))})}const $c=new Set(["def","class","if","elif","else","for","while","return","import","from","as","with","try","except","finally","raise","pass","break","continue","in","is","not","and","or","lambda","yield","async","await","global","nonlocal","True","False","None","self","cls","print"]),Fc=new Set(["function","const","let","var","if","else","return","class","export","import","from","as","default","async","await","for","while","try","catch","finally","throw","new","this","super","extends","implements","interface","type","enum","public","private","protected","readonly","static","typeof","instanceof","in","of","null","undefined","true","false","void","switch","case","break","continue","do","yield"]),Uc=new Set(["cd","ls","cat","rm","mv","cp","mkdir","touch","grep","sed","awk","export","source","if","then","else","elif","fi","for","while","do","done","case","esac","exit","npm","npx","git","python","node","tsc","make","vite","wxt","set","get","start-process","select-string"]);function Ss(s,u){if(s[u]!=="#")return-1;const a=s.indexOf(`
`,u);return a===-1?s.length:a}function Bc(s,u){if(s[u]!=="/")return-1;if(s[u+1]==="/"){const a=s.indexOf(`
`,u);return a===-1?s.length:a}if(s[u+1]==="*"){const a=s.indexOf("*/",u+2);return a===-1?s.length:a+2}return-1}const Es={keywords:$c,matchComment:Ss},Hc={keywords:Fc,matchComment:Bc},Vc={keywords:Uc,matchComment:Ss};function Wc(s){if(!s)return null;const u=s.toLowerCase();return u==="py"||u==="python"||u==="python3"||u==="ipython"||u==="pycon"?Es:u==="ts"||u==="tsx"||u==="typescript"||u==="js"||u==="jsx"||u==="javascript"||u==="mjs"||u==="json"||u==="json5"?Hc:u==="sh"||u==="bash"||u==="zsh"||u==="shell"||u==="powershell"||u==="ps"||u==="ps1"||u==="console"?Vc:null}function Cs(s){return s>="a"&&s<="z"||s>="A"&&s<="Z"||s==="_"||s==="$"}function Kc(s){return Cs(s)||s>="0"&&s<="9"}function No(s){return s>="0"&&s<="9"}function Yc(s,u){const a=[];let f="";function x(){f&&(a.push({kind:"p",text:f}),f="")}let h=0;for(;h<s.length;){const A=s[h],E=u.matchComment(s,h);if(E!==-1){x(),a.push({kind:"c",text:s.slice(h,E)}),h=E;continue}if(u===Es&&(s.startsWith('"""',h)||s.startsWith("'''",h))){x();const w=s.slice(h,h+3);let j=s.indexOf(w,h+3);j=j===-1?s.length:j+3,a.push({kind:"s",text:s.slice(h,j)}),h=j;continue}if(A==='"'||A==="'"||A==="`"){x();let w=h+1;for(;w<s.length&&s[w]!==A;){if(s[w]==="\\"){w+=2;continue}if(s[w]===`
`&&A!=="`")break;w++}const j=w<s.length?w+1:w;a.push({kind:"s",text:s.slice(h,j)}),h=j;continue}if(No(A)){x();let w=h;for(;w<s.length&&(No(s[w])||s[w]==="."||s[w]==="_");)w++;if(w<s.length&&(s[w]==="e"||s[w]==="E"))for(w++,w<s.length&&(s[w]==="+"||s[w]==="-")&&w++;w<s.length&&No(s[w]);)w++;a.push({kind:"n",text:s.slice(h,w)}),h=w;continue}if(Cs(A)){x();let w=h+1;for(;w<s.length&&Kc(s[w]);)w++;const j=s.slice(h,w);let z=w;for(;z<s.length&&s[z]===" ";)z++;const C=s[z]==="(";let U="p";u.keywords.has(j)?U="k":C&&(U="f"),a.push({kind:U,text:j}),h=w;continue}f+=A,h++}return x(),a}function Qc({lang:s,body:u,onCopy:a}){const f=()=>{navigator.clipboard.writeText(u).catch(()=>{}),a==null||a(u)},x=Wc(s),h=x?Yc(u,x):null;return g.jsxs("figure",{className:"gauntlet-md__code",children:[g.jsxs("header",{className:"gauntlet-md__code-meta",children:[g.jsx("span",{className:"gauntlet-md__code-lang",children:s??"code"}),g.jsx("button",{type:"button",className:"gauntlet-md__code-copy",onClick:f,"aria-label":"copy code",children:"copy"})]}),g.jsx("pre",{className:"gauntlet-md__code-body",children:h?g.jsx("code",{children:h.map((A,E)=>g.jsx("span",{className:`gauntlet-md__tok gauntlet-md__tok--${A.kind}`,children:A.text},E))}):g.jsx("code",{children:u})})]})}const Jc={domains:{},actions:{},default_domain_policy:{allowed:!0,require_danger_ack:!1},default_action_policy:{allowed:!0,require_danger_ack:!1},tool_policies:{},max_page_text_chars:6e3,max_dom_skeleton_chars:4e3,screenshot_default:!1,execution_reporting_required:!1,updated_at:""},qc="2px solid #d07a5a",Gc="2px",Xc="#gauntlet-capsule-host",Zc=[/\bpassword\b/i,/\bdelete\b/i,/\bdestroy\b/i,/\bremove\b/i,/\bunsubscribe\b/i,/payment|checkout|billing/i,/credit[-_ ]?card|\bccnum\b|\bcvv\b|\bcvc\b/i],ed=["delete","remove","destroy","drop","discard","apagar","eliminar","remover","destruir","pay","buy","purchase","order","checkout","pagar","comprar","encomendar","confirm","submit","send","publish","enviar","confirmar","publicar","transfer","withdraw","transferir","levantar","cancel subscription","cancelar subscrição","cancelar assinatura"],td=5e3;function nd(s){const u=s.filter(h=>h.type==="fill"),a=s.filter(h=>h.type==="click");if(u.length===0||a.length===0)return{danger:!1};const f=u.find(h=>{const A=h.selector.toLowerCase();return!!(/\bpassword\b/.test(A)||/\bcvv\b|\bcvc\b|\bccnum\b|credit[-_ ]?card/.test(A)||/payment|checkout|billing/.test(A)||/cc-(number|exp|csc|name)/.test(A))});if(!f)return{danger:!1};const x=a.find(h=>{const A=h.selector.toLowerCase();return!!(A.includes("submit")||/\b(pay|buy|purchase|confirm|send|order|checkout|pagar|comprar|enviar|confirmar)\b/.test(A))});return x?{danger:!0,reason:`cadeia destrutiva: fill em "${f.selector}" seguido de click em "${x.selector}"`}:{danger:!1}}function rd(s){var f;if(s.type==="highlight"||s.type==="scroll_to")return{danger:!1};const u=s.selector;for(const x of Zc)if(x.test(u))return{danger:!0,reason:`selector matches /${x.source}/`};let a=null;try{a=document.querySelector(u)}catch{}if(s.type==="fill")return a instanceof HTMLInputElement&&a.type==="password"?{danger:!0,reason:"password field"}:a instanceof HTMLInputElement&&(((f=a.autocomplete)==null?void 0:f.includes("cc-"))??!1)?{danger:!0,reason:"credit-card autocomplete"}:s.value.length>td?{danger:!0,reason:"unusually long value"}:{danger:!1};if(s.type==="click"){if(a instanceof HTMLButtonElement&&a.type==="submit")return{danger:!0,reason:"submit button"};if(a instanceof HTMLInputElement&&(a.type==="submit"||a.type==="reset"))return{danger:!0,reason:`${a.type} button`};if(a instanceof HTMLElement){const x=(a.innerText??"").trim().toLowerCase();if(x){for(const h of ed)if(x===h||x.startsWith(h+" ")||x.endsWith(" "+h)||x.includes(" "+h+" "))return{danger:!0,reason:`action label: "${h}"`}}}return{danger:!1}}return{danger:!1}}async function ld(s){const u=[];for(const a of s)try{od(a),await ad(a),u.push({action:a,ok:!0})}catch(f){u.push({action:a,ok:!1,error:f instanceof Error?f.message:String(f)})}return u}function od(s){const u=s.selector;if(!u||typeof u!="string")throw new Error("selector missing or not a string");if(u.includes(Xc))throw new Error(`selector targets the Gauntlet capsule itself: ${u}`);try{document.querySelector(u)}catch{throw new Error(`selector is not valid CSS: ${u}`)}}async function ad(s){if(s.type==="fill"){sd(s.selector,s.value);return}if(s.type==="click"){id(s.selector);return}if(s.type==="highlight"){ud(s.selector,s.duration_ms??1500);return}if(s.type==="scroll_to"){cd(s.selector);return}throw new Error(`unknown action type: ${s.type??"<missing>"}`)}function sd(s,u){var f,x;const a=document.querySelector(s);if(!a)throw new Error(`selector not found: ${s}`);if(a instanceof HTMLInputElement||a instanceof HTMLTextAreaElement){a.focus({preventScroll:!0});const h=a instanceof HTMLInputElement?HTMLInputElement.prototype:HTMLTextAreaElement.prototype,A=(f=Object.getOwnPropertyDescriptor(h,"value"))==null?void 0:f.set;A?A.call(a,u):a.value=u,a.dispatchEvent(new Event("input",{bubbles:!0})),a.dispatchEvent(new Event("change",{bubbles:!0})),a.dispatchEvent(new Event("blur",{bubbles:!0}));return}if(a instanceof HTMLSelectElement){a.focus({preventScroll:!0});const h=(x=Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,"value"))==null?void 0:x.set;h?h.call(a,u):a.value=u,a.dispatchEvent(new Event("input",{bubbles:!0})),a.dispatchEvent(new Event("change",{bubbles:!0})),a.dispatchEvent(new Event("blur",{bubbles:!0}));return}if(a instanceof HTMLElement&&a.isContentEditable){a.focus(),a.textContent=u,a.dispatchEvent(new InputEvent("input",{bubbles:!0}));return}throw new Error(`element at ${s} is not fillable`)}function id(s){const u=document.querySelector(s);if(!u)throw new Error(`selector not found: ${s}`);if(!(u instanceof HTMLElement))throw new Error(`element at ${s} is not clickable`);const a=u.getBoundingClientRect(),f=a.left+a.width/2,x=a.top+a.height/2,h={bubbles:!0,cancelable:!0,view:window,clientX:f,clientY:x,button:0,buttons:1},A={...h,pointerId:1,pointerType:"mouse",isPrimary:!0};u.dispatchEvent(new PointerEvent("pointerdown",A)),u.dispatchEvent(new MouseEvent("mousedown",h)),u.focus({preventScroll:!0}),u.dispatchEvent(new PointerEvent("pointerup",A)),u.dispatchEvent(new MouseEvent("mouseup",h)),u.click()}function ud(s,u){const a=document.querySelectorAll(s);if(a.length===0)throw new Error(`selector not found: ${s}`);for(const f of Array.from(a)){if(!(f instanceof HTMLElement))continue;const x=f.style.outline,h=f.style.outlineOffset;f.style.outline=qc,f.style.outlineOffset=Gc,window.setTimeout(()=>{f.style.outline=x,f.style.outlineOffset=h},u)}}function cd(s){const u=document.querySelector(s);if(!u)throw new Error(`selector not found: ${s}`);if(!(u instanceof HTMLElement))throw new Error(`element at ${s} cannot be scrolled to`);u.scrollIntoView({behavior:"smooth",block:"center"})}const To={},dd=((typeof{url:Ft&&Ft.tagName.toUpperCase()==="SCRIPT"&&Ft.src||new URL("content-scripts/content.js",document.baseURI).href}<"u"?To==null?void 0:To.VITE_BACKEND_URL:void 0)??"https://ruberra-backend-jkpf-production.up.railway.app").replace(/\/+$/,"");class pd{constructor(u,a={}){this.ambient=u,this.backendUrl=(a.backendUrl??dd).replace(/\/+$/,"")}captureContext(u,a){return this.ambient.transport.fetchJson("POST",`${this.backendUrl}/composer/context`,u,a)}detectIntent(u,a,f){return this.ambient.transport.fetchJson("POST",`${this.backendUrl}/composer/intent`,{context_id:u,user_input:a},f)}generatePreview(u,a){return this.ambient.transport.fetchJson("POST",`${this.backendUrl}/composer/preview`,{intent_id:u},a)}applyPreview(u,a,f,x){return this.ambient.transport.fetchJson("POST",`${this.backendUrl}/composer/apply`,{preview_id:u,approved:a,approval_reason:f??null},x)}async getToolManifests(u){return(await this.ambient.transport.fetchJson("GET",`${this.backendUrl}/tools/manifests`,void 0,u)).tools??[]}getSettings(u){return this.ambient.transport.fetchJson("GET",`${this.backendUrl}/composer/settings`,void 0,u)}updateSettings(u,a){return this.ambient.transport.fetchJson("PUT",`${this.backendUrl}/composer/settings`,u,a)}reportExecution(u,a){return this.ambient.transport.fetchJson("POST",`${this.backendUrl}/composer/execution`,u,a)}requestDomPlan(u,a,f){return this.ambient.transport.fetchJson("POST",`${this.backendUrl}/composer/dom_plan`,{context_id:u,user_input:a},f)}requestDomPlanStream(u,a,f){return this.ambient.transport.stream?this.ambient.transport.stream(`${this.backendUrl}/composer/dom_plan_stream`,{context_id:u,user_input:a},f):(f.onError("streaming not supported by this ambient"),()=>{})}}const As="gauntlet:pill_position",Po="gauntlet:dismissed_domains",Ns="gauntlet:screenshot_enabled",Ts="gauntlet:theme",Ps="gauntlet:palette_recent",js="gauntlet:pill_mode",zs="gauntlet:tts_enabled",Ms=8,Ls="light",Rs="corner",Ds={bottom:16,right:16};function Is(s){const u=typeof window<"u"?window.innerWidth:1280,a=typeof window<"u"?window.innerHeight:800,f=4,x=u-f,h=a-f;return{right:Math.max(-14,Math.min(x,s.right)),bottom:Math.max(-14,Math.min(h,s.bottom))}}function Os(s){return{async readPillPosition(){const u=await s.get(As);return u&&typeof u=="object"&&typeof u.bottom=="number"&&typeof u.right=="number"?Is(u):Ds},async writePillPosition(u){await s.set(As,Is(u))},async readDismissedDomains(){const u=await s.get(Po);return Array.isArray(u)?u.filter(a=>typeof a=="string"):[]},async dismissDomain(u){if(!u)return;const a=await this.readDismissedDomains();a.includes(u)||await s.set(Po,[...a,u])},async restoreDomain(u){if(!u)return;const a=await this.readDismissedDomains(),f=a.filter(x=>x!==u);f.length!==a.length&&await s.set(Po,f)},async isDomainDismissed(u){return u?(await this.readDismissedDomains()).includes(u):!1},async readScreenshotEnabled(){return await s.get(Ns)===!0},async writeScreenshotEnabled(u){await s.set(Ns,!!u)},async readTheme(){const u=await s.get(Ts);return u==="dark"||u==="light"?u:Ls},async writeTheme(u){await s.set(Ts,u)},async readPaletteRecent(){const u=await s.get(Ps);return Array.isArray(u)?u.filter(a=>typeof a=="string").slice(0,Ms):[]},async notePaletteUse(u){if(!u)return;const a=await this.readPaletteRecent(),f=[u,...a.filter(x=>x!==u)].slice(0,Ms);await s.set(Ps,f)},async readPillMode(){const u=await s.get(js);return u==="cursor"||u==="corner"?u:Rs},async writePillMode(u){await s.set(js,u)},async readTtsEnabled(){return await s.get(zs)===!0},async writeTtsEnabled(u){await s.set(zs,!!u)}}}function fd({ambient:s,initialSnapshot:u,onDismiss:a,cursorAnchor:f}){var Sr;const x=b.useMemo(()=>new pd(s),[s]),h=b.useMemo(()=>Os(s.storage),[s]),A=(Sr=s.domActions)==null?void 0:Sr.execute,[E,w]=b.useState(u),[j,z]=b.useState(""),[C,U]=b.useState("idle"),[ie,te]=b.useState(null),[ee,ae]=b.useState(!1),[D,we]=b.useState(null),[Ae,ve]=b.useState(null),[$,N]=b.useState(!1),[L,F]=b.useState(""),[K,ge]=b.useState(!1),[Ne,be]=b.useState(Ls),[q,Se]=b.useState([]),[he,je]=b.useState([]),[de,O]=b.useState(0),[J,R]=b.useState(!1),d=b.useRef(!1),k=b.useRef(null),[Z,ne]=b.useState(!1),ue=b.useRef(""),[ce,le]=b.useState(null),[re,me]=b.useState(Jc),Ee=b.useRef(null),Et=b.useRef(null),xt=b.useRef(null),ut=b.useRef(""),ct=b.useRef(!1),[dl,xr]=b.useState(0),dt=b.useRef(null),[Cn,en]=b.useState(!1),[Bt,Qe]=b.useState(!1),[An,vr]=b.useState(null),tn=b.useMemo(()=>D?D.actions.map(rd):[],[D]),Ht=b.useMemo(()=>D?nd(D.actions):{danger:!1},[D]),Nn=b.useMemo(()=>{if(!D||D.actions.length===0)return{forced:!1,reason:null};let S="";try{S=new URL(E.url).hostname.toLowerCase()}catch{}if((re.domains[S]??re.default_domain_policy).require_danger_ack)return{forced:!0,reason:S?`policy: domain '${S}' requires explicit confirmation`:"policy: default domain policy requires explicit confirmation"};for(const se of D.actions)if((re.actions[se.type]??re.default_action_policy).require_danger_ack)return{forced:!0,reason:`policy: action type '${se.type}' requires explicit confirmation`};return{forced:!1,reason:null}},[D,E.url,re]),vt=tn.some(S=>S.danger)||Ht.danger||Nn.forced;b.useEffect(()=>{var S;return(S=Ee.current)==null||S.focus(),()=>{var V,se;(V=Et.current)==null||V.abort(),(se=xt.current)==null||se.call(xt)}},[]),b.useEffect(()=>{w(u)},[u]),b.useEffect(()=>{let S=!1;return x.getToolManifests().then(V=>{S||Se(V)}).catch(()=>{}),h.readPaletteRecent().then(V=>{S||je(V)}),()=>{S=!0}},[x,h]),b.useEffect(()=>{const S=!!E.text;S&&!d.current&&(R(!0),k.current!==null&&window.clearTimeout(k.current),k.current=window.setTimeout(()=>{R(!1),k.current=null},700)),d.current=S},[E.text]),b.useEffect(()=>()=>{k.current!==null&&(window.clearTimeout(k.current),k.current=null)},[]),b.useEffect(()=>{let S=!1;h.readTtsEnabled().then(se=>{S||ne(se)});function V(se){const Te=se.detail;typeof(Te==null?void 0:Te.enabled)=="boolean"&&ne(Te.enabled)}return window.addEventListener("gauntlet:tts",V),()=>{S=!0,window.removeEventListener("gauntlet:tts",V)}},[h]),b.useEffect(()=>{if(!Z||C!=="plan_ready")return;const S=D==null?void 0:D.compose;if(S&&S!==ue.current&&!(typeof window>"u"||!window.speechSynthesis))try{window.speechSynthesis.cancel();const V=new SpeechSynthesisUtterance(S);V.rate=1.05,V.pitch=1,window.speechSynthesis.speak(V),ue.current=S}catch{}},[Z,C,D==null?void 0:D.compose]),b.useEffect(()=>()=>{var S;try{(S=window.speechSynthesis)==null||S.cancel()}catch{}},[]),b.useEffect(()=>{let S=!1;return h.readTheme().then(V=>{S||be(V)}),()=>{S=!0}},[h]),b.useEffect(()=>{let S=!1;return x.getSettings().then(V=>{S||me(V)}).catch(()=>{}),()=>{S=!0}},[x]),b.useEffect(()=>{if(!s.capabilities.screenshot||!s.screenshot)return;let S=!1;return h.readScreenshotEnabled().then(V=>{const se=V||re.screenshot_default;S||!se||s.screenshot.capture().then(Te=>{S||!Te||le(Te)}).catch(()=>{})}),()=>{S=!0}},[s,h,re.screenshot_default]);const Tn=b.useCallback(()=>{w(s.selection.read())},[s]),pl=b.useCallback(()=>{if(dt.current)return;te(null);const S=j,V=Lc({onPartial:se=>{z(S?`${S} ${se}`.trim():se)},onCommit:se=>{var Te;z(S?`${S} ${se}`.trim():se),en(!1),dt.current=null,(Te=Ee.current)==null||Te.focus()},onError:se=>{te(se),en(!1),dt.current=null}});V&&(dt.current=V,en(!0))},[j]),nn=b.useCallback(()=>{var S;(S=dt.current)==null||S.stop()},[]),rn=b.useCallback(()=>{var S;(S=dt.current)==null||S.abort(),dt.current=null,en(!1)},[]);b.useEffect(()=>()=>{var S;(S=dt.current)==null||S.abort()},[]),b.useEffect(()=>{function S(V){(V.metaKey||V.ctrlKey)&&(V.key==="k"||V.key==="K")&&(V.preventDefault(),V.stopPropagation(),Qe(Te=>!Te))}return window.addEventListener("keydown",S,!0),()=>window.removeEventListener("keydown",S,!0)},[]);const yr=b.useCallback(S=>{vr(S),window.setTimeout(()=>vr(null),1400)},[]),_r=b.useCallback(async()=>{const S=(D==null?void 0:D.compose)||E.text||j.trim();if(!S){te("Nada para guardar — escreve um pedido ou recebe uma resposta.");return}const V=(j.trim()||E.pageTitle||"cápsula note").slice(0,200);try{await s.transport.fetchJson("POST",`${x.backendUrl}/memory/records`,{topic:V,body:S,kind:"note",scope:"user"}),yr("saved")}catch(se){te(se instanceof Error?`memória: ${se.message}`:"memória: falhou")}},[s,x,D,E,j,yr]),Lt=b.useCallback(async(S,V=[],se)=>{if(!D||D.actions.length===0)return;ct.current=!0;const Te=D.actions.map((pe,ye)=>{const Pe=V[ye],Ce=tn[ye];return{action:pe,ok:Pe?Pe.ok:!1,error:(Pe==null?void 0:Pe.error)??null,danger:(Ce==null?void 0:Ce.danger)??!1,danger_reason:(Ce==null?void 0:Ce.reason)??null}}),$e={plan_id:D.plan_id||null,context_id:D.context_id||null,url:E.url||null,page_title:E.pageTitle||null,status:S,results:Te,has_danger:vt,sequence_danger_reason:Ht.danger?Ht.reason??null:null,danger_acknowledged:$,error:se??null,model_used:D.model_used||null,plan_latency_ms:D.latency_ms||null,user_input:j.trim()||null};if(re.execution_reporting_required)try{await x.reportExecution($e)}catch(pe){const ye=pe instanceof Error?pe.message:String(pe);te(`policy: execution report rejected — ${ye}`),U("error")}else x.reportExecution($e).catch(()=>{})},[x,D,E,tn,vt,Ht,$,j,re.execution_reporting_required]),Vn=b.useCallback(()=>{D&&D.actions.length>0&&!ct.current&&Lt("rejected"),a()},[D,a,Lt]);b.useEffect(()=>{function S(V){if(V.key==="Escape"){if(V.preventDefault(),V.stopPropagation(),Bt){Qe(!1);return}if(dt.current){rn();return}Vn()}}return window.addEventListener("keydown",S,!0),()=>window.removeEventListener("keydown",S,!0)},[Vn,Bt,rn]);const ln=b.useCallback(async()=>{var Te,$e;if(!j.trim()||C==="planning"||C==="streaming"||C==="executing")return;D&&D.actions.length>0&&!ct.current&&Lt("rejected"),(Te=Et.current)==null||Te.abort(),($e=xt.current)==null||$e.call(xt);const S=new AbortController;Et.current=S,U("planning"),te(null),we(null),ve(null),N(!1),ae(!1),F(""),xr(0),ut.current="",ct.current=!1;const V=await h.readScreenshotEnabled(),se=yd(E,V?ce:null);try{const pe=await x.captureContext(se,S.signal);if(S.signal.aborted)return;xt.current=x.requestDomPlanStream(pe.context_id,j.trim(),{onDelta:ye=>{if(S.signal.aborted)return;ut.current+=ye,xr(Ce=>Ce+1);const Pe=vd(ut.current);Pe!==null?(F(Pe),U(Ce=>Ce==="planning"?"streaming":Ce)):U(Ce=>Ce==="planning"?"streaming":Ce)},onDone:ye=>{S.signal.aborted||(we(ye),U("plan_ready"),F(""),ut.current="")},onError:ye=>{S.signal.aborted||(async()=>{try{const Pe=await x.requestDomPlan(pe.context_id,j.trim(),S.signal);if(S.signal.aborted)return;we(Pe),U("plan_ready"),F(""),ut.current=""}catch(Pe){if(S.signal.aborted)return;const Ce=Pe instanceof Error?Pe.message:String(Pe);te(`stream: ${ye} · fallback: ${Ce}`),U("error"),F(""),ut.current=""}})()}})}catch(pe){if(S.signal.aborted)return;te(pe instanceof Error?pe.message:String(pe)),U("error")}},[x,E,ce,j,C,D,Lt]),wr=b.useCallback(S=>{var V;S.preventDefault(),O(se=>se+1);try{(V=window.speechSynthesis)==null||V.cancel()}catch{}ue.current="",ln()},[ln]),kr=b.useCallback(S=>{S.key==="Enter"&&(S.shiftKey||(S.preventDefault(),ln()))},[ln]),Wn=b.useCallback(async()=>{if(D!=null&&D.compose)try{await navigator.clipboard.writeText(D.compose),ae(!0),window.setTimeout(()=>ae(!1),1500)}catch{te("Clipboard write blocked. Select the text and copy manually.")}},[D]),br=b.useCallback(async()=>{if(!(!A||!D||D.actions.length===0)&&!(vt&&!$)){U("executing"),te(null);try{const S=await A(D.actions);ve(S),U("executed");const V=S.every(se=>se.ok);window.dispatchEvent(new CustomEvent("gauntlet:execute-result",{detail:{ok:V}})),await Lt("executed",S)}catch(S){const V=S instanceof Error?S.message:String(S);te(V),U("error"),window.dispatchEvent(new CustomEvent("gauntlet:execute-result",{detail:{ok:!1}})),await Lt("failed",[],V)}}},[A,D,vt,$,Lt]),Ct=b.useMemo(()=>E.bbox?E.bbox:f?{x:f.x,y:f.y,width:0,height:0}:null,[E.bbox,f]),on=b.useMemo(()=>{if(!Ct)return;const S=typeof window<"u"?window.innerWidth:1280,V=typeof window<"u"?window.innerHeight:800,se=wd(S,V),Te=kd(Ct,{width:S,height:V},se);return{top:`${Te.top}px`,left:`${Te.left}px`}},[Ct]),fl=`gauntlet-capsule--phase-${C}`,gl=["gauntlet-capsule","gauntlet-capsule--floating",Ct?"gauntlet-capsule--anchored":"gauntlet-capsule--centered",E.text?null:"gauntlet-capsule--no-selection",fl].filter(Boolean).join(" ");return b.useEffect(()=>{window.dispatchEvent(new CustomEvent("gauntlet:phase",{detail:{phase:C}}))},[C]),g.jsxs("div",{className:gl,"data-theme":Ne,role:"dialog","aria-label":"Gauntlet",style:on,children:[g.jsx("div",{className:"gauntlet-capsule__aurora","aria-hidden":!0}),g.jsxs("div",{className:"gauntlet-capsule__layout",children:[g.jsxs("div",{className:"gauntlet-capsule__panel gauntlet-capsule__panel--left",children:[g.jsxs("header",{className:"gauntlet-capsule__header",children:[g.jsxs("div",{className:"gauntlet-capsule__brand-block",children:[g.jsx("span",{className:"gauntlet-capsule__mark","aria-hidden":!0,children:g.jsx("span",{className:"gauntlet-capsule__mark-dot"})}),g.jsxs("div",{className:"gauntlet-capsule__brand-text",children:[g.jsx("span",{className:"gauntlet-capsule__brand",children:"GAUNTLET"}),g.jsx("span",{className:"gauntlet-capsule__tagline",children:"cursor · capsule"})]})]}),g.jsxs("div",{className:"gauntlet-capsule__header-actions",children:[g.jsx("button",{type:"button",className:"gauntlet-capsule__settings-btn",onClick:()=>ge(S=>!S),"aria-label":"Definições","aria-expanded":K,title:"Definições",children:g.jsx("span",{"aria-hidden":!0,children:"···"})}),g.jsx("button",{type:"button",className:"gauntlet-capsule__close",onClick:Vn,"aria-label":"Dismiss capsule (Esc)",children:g.jsx("span",{"aria-hidden":!0,children:"esc"})})]})]}),K&&g.jsx(xd,{onClose:()=>ge(!1),showScreenshot:s.capabilities.screenshot,showDismissedDomains:s.capabilities.dismissDomain,showPillMode:s.capabilities.pillSurface,prefs:h,theme:Ne,onChangeTheme:S=>{be(S),h.writeTheme(S)}}),g.jsxs("section",{className:"gauntlet-capsule__context",children:[g.jsxs("div",{className:"gauntlet-capsule__context-meta",children:[g.jsx("span",{className:`gauntlet-capsule__source${J?" gauntlet-capsule__source--popped":""}`,children:"browser"}),g.jsx("span",{className:"gauntlet-capsule__url",title:E.url,children:E.pageTitle||E.url}),g.jsx("button",{type:"button",className:"gauntlet-capsule__refresh",onClick:Tn,title:"Re-read current selection",children:"re-read"})]}),E.text?g.jsx("pre",{className:"gauntlet-capsule__selection",children:$s(E.text,600)}):g.jsx(hd,{snapshot:E,screenshotEnabled:ce!==null})]})]}),g.jsxs("div",{className:"gauntlet-capsule__panel gauntlet-capsule__panel--right",children:[g.jsxs("form",{className:"gauntlet-capsule__form",onSubmit:wr,children:[g.jsx("textarea",{ref:Ee,className:"gauntlet-capsule__input",placeholder:"O que queres? — Enter para enviar, Shift+Enter nova linha",value:j,onChange:S=>z(S.target.value),onKeyDown:kr,rows:2,disabled:C==="planning"||C==="streaming"||C==="executing"}),g.jsxs("div",{className:"gauntlet-capsule__actions",children:[g.jsxs("span",{className:"gauntlet-capsule__hint","aria-hidden":!0,children:[g.jsx("span",{className:"gauntlet-capsule__kbd",children:"↵"}),g.jsx("span",{className:"gauntlet-capsule__kbd-sep",children:"·"}),g.jsx("span",{className:"gauntlet-capsule__kbd",children:"⌘K"})]}),zc()&&g.jsxs("button",{type:"button",className:`gauntlet-capsule__voice${Cn?" gauntlet-capsule__voice--active":""}`,onPointerDown:S=>{S.preventDefault(),pl()},onPointerUp:()=>nn(),onPointerLeave:()=>{Cn&&nn()},"aria-label":Cn?"A ouvir — solta para enviar":"Premer e falar",title:"Premir e falar",disabled:C==="planning"||C==="streaming"||C==="executing",children:[g.jsxs("svg",{viewBox:"0 0 24 24",width:"13",height:"13","aria-hidden":!0,children:[g.jsx("path",{d:"M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3z",fill:"currentColor"}),g.jsx("path",{d:"M19 11a7 7 0 0 1-14 0M12 18v3",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",fill:"none"})]}),g.jsx("span",{className:"gauntlet-capsule__voice-label",children:Cn?"a ouvir":"voz"})]}),g.jsxs("button",{type:"submit",className:"gauntlet-capsule__compose",disabled:C==="planning"||C==="streaming"||C==="executing"||!j.trim(),children:[de>0&&g.jsx("span",{className:"gauntlet-capsule__compose-ripple","aria-hidden":!0},de),C==="planning"||C==="streaming"?g.jsxs(g.Fragment,{children:[g.jsx("span",{className:"gauntlet-capsule__compose-spinner","aria-hidden":!0}),g.jsx("span",{children:C==="planning"?"a pensar":"a escrever"})]}):"Enviar"]})]})]}),C==="streaming"&&L&&g.jsxs("section",{className:"gauntlet-capsule__compose-result gauntlet-capsule__compose-result--streaming",children:[g.jsxs("header",{className:"gauntlet-capsule__compose-meta",children:[g.jsx("span",{className:"gauntlet-capsule__compose-tag",children:"resposta"}),g.jsxs("span",{className:"gauntlet-capsule__compose-meta-text",children:[g.jsxs("span",{className:"gauntlet-capsule__token-counter","aria-live":"polite",children:[dl," chunks"]}),g.jsx("span",{"aria-hidden":!0,children:"·"}),g.jsx("span",{children:"a escrever…"})]})]}),g.jsxs("div",{className:"gauntlet-capsule__compose-text gauntlet-capsule__compose-text--streaming",children:[L,g.jsx("span",{className:"gauntlet-capsule__compose-caret","aria-hidden":!0,children:"▍"})]})]}),(C==="planning"||C==="streaming"&&!L)&&g.jsxs("section",{className:"gauntlet-capsule__skeleton",role:"status","aria-live":"polite","aria-label":"A pensar...",children:[g.jsxs("header",{className:"gauntlet-capsule__skeleton-header",children:[g.jsx("span",{className:"gauntlet-capsule__skeleton-tag"}),g.jsx("span",{className:"gauntlet-capsule__skeleton-meta"})]}),g.jsx("div",{className:"gauntlet-capsule__skeleton-line gauntlet-capsule__skeleton-line--w90"}),g.jsx("div",{className:"gauntlet-capsule__skeleton-line gauntlet-capsule__skeleton-line--w75"}),g.jsx("div",{className:"gauntlet-capsule__skeleton-line gauntlet-capsule__skeleton-line--w55"})]}),(D==null?void 0:D.compose)&&C==="plan_ready"&&g.jsxs("section",{className:"gauntlet-capsule__compose-result",children:[g.jsxs("header",{className:"gauntlet-capsule__compose-meta",children:[g.jsx("span",{className:"gauntlet-capsule__compose-tag",children:"resposta"}),g.jsxs("span",{className:"gauntlet-capsule__compose-meta-text",children:[D.model_used," · ",D.latency_ms," ms"]})]}),g.jsx("div",{className:"gauntlet-capsule__compose-text",children:g.jsx(Oc,{source:D.compose,onCopyBlock:()=>yr("code copied")})}),g.jsxs("div",{className:"gauntlet-capsule__compose-actions",children:[g.jsx("button",{type:"button",className:"gauntlet-capsule__copy",onClick:()=>void Wn(),children:ee?"copiado ✓":"Copy"}),g.jsx("button",{type:"button",className:"gauntlet-capsule__copy gauntlet-capsule__copy--ghost",onClick:()=>void _r(),children:An==="saved"?"guardado ✓":"Save"})]})]}),D&&D.actions.length===0&&!D.compose&&C==="plan_ready"&&g.jsx("section",{className:"gauntlet-capsule__plan",children:g.jsx("p",{className:"gauntlet-capsule__plan-empty",children:D.reason??"Modelo não conseguiu planear."})}),D&&D.actions.length>0&&(C==="plan_ready"||C==="executing"||C==="executed")&&g.jsxs("section",{className:"gauntlet-capsule__plan",children:[g.jsxs("header",{className:"gauntlet-capsule__plan-header",children:[g.jsx("span",{className:"gauntlet-capsule__plan-title",children:"plano"}),g.jsxs("span",{className:"gauntlet-capsule__plan-meta",children:[D.actions.length," action",D.actions.length===1?"":"s"," · ",D.model_used," · ",D.latency_ms," ms"]})]}),g.jsx("ol",{className:"gauntlet-capsule__plan-list",children:D.actions.map((S,V)=>{const se=Ae==null?void 0:Ae[V],Te=se?se.ok?"ok":"fail":"pending",$e=tn[V];return g.jsxs("li",{className:`gauntlet-capsule__plan-item gauntlet-capsule__plan-item--${Te}${$e!=null&&$e.danger?" gauntlet-capsule__plan-item--danger":""}`,children:[g.jsx("span",{className:"gauntlet-capsule__plan-step",children:V+1}),g.jsx("span",{className:"gauntlet-capsule__plan-desc",children:_d(S)}),($e==null?void 0:$e.danger)&&g.jsx("span",{className:"gauntlet-capsule__plan-danger",title:$e.reason,children:"sensível"}),se&&!se.ok&&g.jsx("span",{className:"gauntlet-capsule__plan-err",title:se.error,children:se.error})]},`${V}-${S.type}-${S.selector}`)})}),C!=="executed"&&vt&&g.jsxs("div",{className:"gauntlet-capsule__danger-gate",role:"alert",children:[g.jsxs("header",{className:"gauntlet-capsule__danger-header",children:[g.jsx("span",{className:"gauntlet-capsule__danger-mark","aria-hidden":!0,children:"!"}),g.jsx("span",{className:"gauntlet-capsule__danger-title",children:"Acções sensíveis no plano"})]}),g.jsxs("ul",{className:"gauntlet-capsule__danger-list",children:[Nn.forced&&Nn.reason&&g.jsxs("li",{children:[g.jsx("strong",{children:"governança:"})," ",Nn.reason]},"danger-policy"),Ht.danger&&g.jsxs("li",{children:[g.jsx("strong",{children:"cadeia:"})," ",Ht.reason??"flagged"]},"danger-sequence"),tn.map((S,V)=>S.danger?g.jsxs("li",{children:[g.jsxs("strong",{children:["step ",V+1,":"]})," ",S.reason??"flagged"]},`danger-${V}`):null)]}),g.jsxs("label",{className:"gauntlet-capsule__danger-confirm",children:[g.jsx("input",{type:"checkbox",checked:$,onChange:S=>N(S.target.checked),disabled:C==="executing"}),g.jsx("span",{children:"Confirmo, executar mesmo assim."})]})]}),C!=="executed"&&A&&g.jsx("div",{className:"gauntlet-capsule__plan-actions",children:g.jsx("button",{type:"button",className:`gauntlet-capsule__execute${vt?" gauntlet-capsule__execute--danger":""}`,onClick:()=>void br(),disabled:C==="executing"||vt&&!$,children:C==="executing"?"executando…":vt?"Executar com cuidado":"Executar"})}),C!=="executed"&&!A&&g.jsx("p",{className:"gauntlet-capsule__plan-empty",children:"esta superfície não tem acesso a uma página viva — abre o Gauntlet num separador para executar acções."})]}),C==="error"&&ie&&g.jsxs("div",{className:"gauntlet-capsule__error",role:"alert",children:[g.jsx("span",{className:"gauntlet-capsule__error-icon","aria-hidden":!0,children:"!"}),g.jsx("span",{children:ie})]})]})]}),Bt&&g.jsx(md,{onClose:()=>Qe(!1),recentIds:he,actions:(()=>{const S=pe=>{je(ye=>[pe,...ye.filter(Ce=>Ce!==pe)].slice(0,8)),h.notePaletteUse(pe)},V=pe=>{z(ye=>{const Pe=ye.trimEnd(),Ce=`usa a tool ${pe} para `;return Pe.startsWith("usa a tool ")?Ce:Pe?`${Ce}${Pe}`:Ce}),window.setTimeout(()=>{const ye=Ee.current;ye&&(ye.focus(),ye.setSelectionRange(ye.value.length,ye.value.length))},0)},se=[{id:"focus",label:"Focar input",shortcut:"↵",group:"action",run:()=>{S("focus"),Qe(!1),window.setTimeout(()=>{var pe;return(pe=Ee.current)==null?void 0:pe.focus()},0)}},{id:"copy",label:"Copiar resposta",shortcut:"⌘C",group:"action",disabled:!(D!=null&&D.compose),run:()=>{S("copy"),Qe(!1),Wn()}},{id:"save",label:"Guardar em memória",shortcut:"S",group:"action",disabled:!(D!=null&&D.compose)&&!E.text&&!j.trim(),run:()=>{S("save"),Qe(!1),_r()}},{id:"reread",label:"Re-ler contexto",shortcut:"R",group:"action",run:()=>{S("reread"),Qe(!1),Tn()}},{id:"clear",label:"Limpar input",shortcut:"X",group:"action",disabled:!j,run:()=>{var pe;S("clear"),Qe(!1),z(""),(pe=Ee.current)==null||pe.focus()}},{id:"dismiss",label:"Fechar cápsula",shortcut:"Esc",group:"action",run:()=>{S("dismiss"),Qe(!1),Vn()}}],$e=q.filter(pe=>{var Pe;const ye=(Pe=re.tool_policies)==null?void 0:Pe[pe.name];return!ye||ye.allowed!==!1}).map(pe=>{var ye,Pe;return{id:`tool:${pe.name}`,label:pe.name,description:pe.description,shortcut:"",group:"tool",mode:pe.mode,risk:pe.risk,requiresApproval:((Pe=(ye=re.tool_policies)==null?void 0:ye[pe.name])==null?void 0:Pe.require_approval)===!0,run:()=>{S(`tool:${pe.name}`),Qe(!1),V(pe.name)}}});return[...se,...$e]})()}),An&&g.jsx("div",{className:"gauntlet-capsule__flash",role:"status","aria-live":"polite",children:An})]})}function gd(s,u){if(!s)return 0;const a=s.toLowerCase(),f=u.toLowerCase();if(f.includes(a))return 1e3-f.indexOf(a);let x=0,h=0,A=-2;for(let E=0;E<f.length&&x<a.length;E++)f[E]===a[x]&&(E!==A+1&&h++,A=E,x++);return x<a.length?-1:500-h*10-(f.length-a.length)}function md({actions:s,onClose:u,recentIds:a}){const[f,x]=b.useState(""),[h,A]=b.useState(0),E=b.useRef(null);b.useEffect(()=>{var z;(z=E.current)==null||z.focus()},[]);const w=b.useMemo(()=>{if(!f){const C=new Map(a.map((te,ee)=>[te,ee])),U=te=>{const ee=C.get(te.id);return ee===void 0?a.length:ee};return[...s].sort((te,ee)=>{const ae=U(te),D=U(ee);if(ae!==D)return ae-D;const we=$=>$==="tool"?1:0,Ae=we(te.group),ve=we(ee.group);return Ae!==ve?Ae-ve:te.label.localeCompare(ee.label)})}return s.map(C=>{const U=`${C.label} ${C.id} ${C.description??""}`;return{a:C,score:gd(f,U)}}).filter(C=>C.score>=0).sort((C,U)=>U.score-C.score).map(C=>C.a)},[s,f,a]);b.useEffect(()=>{h>=w.length&&A(0)},[w.length,h]);const j=b.useCallback(z=>{if(z.key==="ArrowDown")z.preventDefault(),A(C=>Math.min(C+1,w.length-1));else if(z.key==="ArrowUp")z.preventDefault(),A(C=>Math.max(C-1,0));else if(z.key==="Enter"){z.preventDefault();const C=w[h];C&&!C.disabled&&C.run()}},[w,h]);return g.jsxs("div",{className:"gauntlet-capsule__palette",role:"dialog","aria-label":"Command palette",children:[g.jsx("div",{className:"gauntlet-capsule__palette-scrim",onClick:u}),g.jsxs("div",{className:"gauntlet-capsule__palette-panel",onKeyDown:j,children:[g.jsx("input",{ref:E,className:"gauntlet-capsule__palette-input",type:"text",placeholder:"comandos · tools…  (↑↓ para navegar, ↵ para correr, esc para fechar)",value:f,onChange:z=>x(z.target.value)}),g.jsx("ul",{className:"gauntlet-capsule__palette-list",role:"listbox",children:w.length===0?g.jsx("li",{className:"gauntlet-capsule__palette-empty",children:"sem resultados"}):w.map((z,C)=>g.jsxs("li",{role:"option","aria-selected":C===h,"aria-disabled":z.disabled,onMouseEnter:()=>A(C),onClick:()=>{z.disabled||z.run()},className:`gauntlet-capsule__palette-item${C===h?" gauntlet-capsule__palette-item--active":""}${z.disabled?" gauntlet-capsule__palette-item--disabled":""}${z.group==="tool"?" gauntlet-capsule__palette-item--tool":""}`,children:[g.jsxs("div",{className:"gauntlet-capsule__palette-main",children:[g.jsx("span",{className:"gauntlet-capsule__palette-label",children:z.label}),z.description&&g.jsx("span",{className:"gauntlet-capsule__palette-desc",children:z.description})]}),g.jsxs("div",{className:"gauntlet-capsule__palette-meta",children:[z.mode&&g.jsx("span",{className:`gauntlet-capsule__palette-badge gauntlet-capsule__palette-badge--mode-${z.mode}`,title:`mode: ${z.mode}`,children:z.mode}),z.risk&&z.risk!=="low"&&g.jsx("span",{className:`gauntlet-capsule__palette-badge gauntlet-capsule__palette-badge--risk-${z.risk}`,title:`risk: ${z.risk}`,children:z.risk}),z.requiresApproval&&g.jsx("span",{className:"gauntlet-capsule__palette-badge gauntlet-capsule__palette-badge--approval",title:"requires explicit approval before running",children:"approval"}),z.shortcut&&g.jsx("span",{className:"gauntlet-capsule__palette-shortcut",children:z.shortcut})]})]},z.id))})]})]})}function $s(s,u){return s.length<=u?s:s.slice(0,u)+"…"}function hd({snapshot:s,screenshotEnabled:u}){const a=(()=>{if(!s.domSkeleton)return 0;try{const x=JSON.parse(s.domSkeleton);if(Array.isArray(x))return x.length}catch{}return 0})(),f=!!s.pageText;return g.jsxs("ul",{className:"gauntlet-capsule__context-summary","aria-label":"context",children:[g.jsxs("li",{children:[g.jsx("span",{className:"gauntlet-capsule__context-key",children:"selection"}),g.jsx("span",{className:"gauntlet-capsule__context-val gauntlet-capsule__context-val--muted",children:"none"})]}),g.jsxs("li",{children:[g.jsx("span",{className:"gauntlet-capsule__context-key",children:"page captured"}),g.jsx("span",{className:"gauntlet-capsule__context-val",children:f?"yes":"no"})]}),g.jsxs("li",{children:[g.jsx("span",{className:"gauntlet-capsule__context-key",children:"DOM captured"}),g.jsx("span",{className:"gauntlet-capsule__context-val",children:a>0?`${a} elements`:"—"})]}),g.jsxs("li",{children:[g.jsx("span",{className:"gauntlet-capsule__context-key",children:"screenshot"}),g.jsx("span",{className:"gauntlet-capsule__context-val",children:u?"on":"off"})]})]})}function xd({onClose:s,showScreenshot:u,prefs:a,showDismissedDomains:f,theme:x,onChangeTheme:h,showPillMode:A}){const[E,w]=b.useState([]),[j,z]=b.useState(!0),[C,U]=b.useState(!1),[ie,te]=b.useState("corner"),[ee,ae]=b.useState(!1);b.useEffect(()=>{let $=!1;return f&&a.readDismissedDomains().then(N=>{$||w(N)}),a.readScreenshotEnabled().then(N=>{$||(U(N),z(!1))}),a.readPillMode().then(N=>{$||te(N)}),a.readTtsEnabled().then(N=>{$||ae(N)}),()=>{$=!0}},[a,f]);const D=b.useCallback(async $=>{te($),await a.writePillMode($),window.dispatchEvent(new CustomEvent("gauntlet:pill-mode",{detail:{mode:$}}))},[a]),we=b.useCallback(async $=>{var N;if(ae($),await a.writeTtsEnabled($),!$)try{(N=window.speechSynthesis)==null||N.cancel()}catch{}window.dispatchEvent(new CustomEvent("gauntlet:tts",{detail:{enabled:$}}))},[a]),Ae=b.useCallback(async $=>{await a.restoreDomain($),w(N=>N.filter(L=>L!==$))},[a]),ve=b.useCallback(async $=>{U($),await a.writeScreenshotEnabled($)},[a]);return g.jsxs("section",{className:"gauntlet-capsule__settings",role:"region","aria-label":"Definições",children:[g.jsxs("header",{className:"gauntlet-capsule__settings-header",children:[g.jsx("span",{className:"gauntlet-capsule__settings-title",children:"definições"}),g.jsx("button",{type:"button",className:"gauntlet-capsule__settings-close",onClick:s,"aria-label":"Fechar definições",children:"×"})]}),g.jsxs("div",{className:"gauntlet-capsule__settings-section",children:[g.jsx("span",{className:"gauntlet-capsule__settings-subtitle",children:"aparência"}),g.jsxs("div",{className:"gauntlet-capsule__theme-switch",role:"radiogroup","aria-label":"tema",children:[g.jsxs("button",{type:"button",className:`gauntlet-capsule__theme-option${x==="light"?" gauntlet-capsule__theme-option--active":""}`,onClick:()=>h("light"),role:"radio","aria-checked":x==="light",children:[g.jsx("span",{className:"gauntlet-capsule__theme-swatch gauntlet-capsule__theme-swatch--light","aria-hidden":!0}),g.jsx("span",{children:"flagship light"})]}),g.jsxs("button",{type:"button",className:`gauntlet-capsule__theme-option${x==="dark"?" gauntlet-capsule__theme-option--active":""}`,onClick:()=>h("dark"),role:"radio","aria-checked":x==="dark",children:[g.jsx("span",{className:"gauntlet-capsule__theme-swatch gauntlet-capsule__theme-swatch--dark","aria-hidden":!0}),g.jsx("span",{children:"night premium"})]})]})]}),A&&g.jsxs("div",{className:"gauntlet-capsule__settings-section",children:[g.jsx("span",{className:"gauntlet-capsule__settings-subtitle",children:"pill"}),g.jsxs("div",{className:"gauntlet-capsule__theme-switch",role:"radiogroup","aria-label":"pill mode",children:[g.jsxs("button",{type:"button",className:`gauntlet-capsule__theme-option${ie==="corner"?" gauntlet-capsule__theme-option--active":""}`,onClick:()=>void D("corner"),role:"radio","aria-checked":ie==="corner",children:[g.jsx("span",{className:"gauntlet-capsule__theme-swatch gauntlet-capsule__pill-mode-swatch--corner","aria-hidden":!0}),g.jsx("span",{children:"resting corner"})]}),g.jsxs("button",{type:"button",className:`gauntlet-capsule__theme-option${ie==="cursor"?" gauntlet-capsule__theme-option--active":""}`,onClick:()=>void D("cursor"),role:"radio","aria-checked":ie==="cursor",children:[g.jsx("span",{className:"gauntlet-capsule__theme-swatch gauntlet-capsule__pill-mode-swatch--cursor","aria-hidden":!0}),g.jsx("span",{children:"cursor pill"})]})]})]}),u&&g.jsx("div",{className:"gauntlet-capsule__settings-section",children:g.jsxs("label",{className:"gauntlet-capsule__settings-toggle",children:[g.jsx("input",{type:"checkbox",checked:C,onChange:$=>void ve($.target.checked)}),g.jsxs("span",{className:"gauntlet-capsule__settings-toggle-label",children:[g.jsx("strong",{children:"incluir screenshot"}),g.jsx("small",{children:"o modelo vê a página visível. útil para layouts e imagens, exposição de senhas/DMs visíveis. opt-in."})]})]})}),g.jsx("div",{className:"gauntlet-capsule__settings-section",children:g.jsxs("label",{className:"gauntlet-capsule__settings-toggle",children:[g.jsx("input",{type:"checkbox",checked:ee,onChange:$=>void we($.target.checked)}),g.jsxs("span",{className:"gauntlet-capsule__settings-toggle-label",children:[g.jsx("strong",{children:"ler resposta em voz alta"}),g.jsx("small",{children:"quando o modelo termina, a cápsula fala a resposta via Web Speech. cancela ao submeter outro pedido ou fechar a cápsula."})]})]})}),g.jsxs("div",{className:"gauntlet-capsule__settings-section",children:[g.jsx("span",{className:"gauntlet-capsule__settings-subtitle",children:"domínios escondidos"}),j?g.jsx("p",{className:"gauntlet-capsule__settings-empty",children:"a carregar…"}):E.length===0?g.jsx("p",{className:"gauntlet-capsule__settings-empty",children:"nenhum — clica direito no pill em qualquer site para o esconder."}):g.jsx("ul",{className:"gauntlet-capsule__settings-list",children:E.map($=>g.jsxs("li",{className:"gauntlet-capsule__settings-row",children:[g.jsx("span",{className:"gauntlet-capsule__settings-host",children:$}),g.jsx("button",{type:"button",className:"gauntlet-capsule__settings-restore",onClick:()=>void Ae($),children:"restaurar"})]},$))})]})]})}function vd(s){const u=s.match(/"compose"\s*:\s*"((?:[^"\\]|\\.)*)/);if(!u)return null;let a=u[1];return a.endsWith("\\")&&!a.endsWith("\\\\")&&(a=a.slice(0,-1)),a.replace(/\\n/g,`
`).replace(/\\r/g,"\r").replace(/\\t/g,"	").replace(/\\"/g,'"').replace(/\\\\/g,"\\")}function yd(s,u){const a={};return s.pageText&&(a.page_text=s.pageText),s.domSkeleton&&(a.dom_skeleton=s.domSkeleton),s.bbox&&(a.selection_bbox=s.bbox),u&&(a.screenshot_data_url=u),{source:"browser",url:s.url,page_title:s.pageTitle,selection:s.text||void 0,metadata:Object.keys(a).length>0?a:void 0}}function _d(s){switch(s.type){case"fill":return`fill ${s.selector} ← "${$s(s.value,80)}"`;case"click":return`click ${s.selector}`;case"highlight":return`highlight ${s.selector}`;case"scroll_to":return`scroll to ${s.selector}`}}const ht=16,Zt=12;function ol(s,u,a){return a<u||s<u?u:s>a?a:s}function wd(s,u){if(s<=600)return{width:Math.max(0,s-24),height:Math.max(0,u-24)};const f=ol(.72*s,560,820),x=ol(.72*u,420,560);return{width:f,height:x}}function kd(s,u,a){if(!s)return{top:Math.max(ht,Math.floor((u.height-a.height)/2)),left:Math.max(ht,Math.floor((u.width-a.width)/2)),placement:"center"};const f=u.height-(s.y+s.height)-Zt-ht,x=s.y-Zt-ht,h=u.width-(s.x+s.width)-Zt-ht,A=s.x-Zt-ht,E=f>=a.height,w=x>=a.height,j=h>=a.width,z=A>=a.width;let C,U,ie;E?(C="below",U=s.y+s.height+Zt,ie=s.x):w?(C="above",U=s.y-Zt-a.height,ie=s.x):j?(C="right",ie=s.x+s.width+Zt,U=Math.floor(s.y+s.height/2-a.height/2)):z?(C="left",ie=s.x-Zt-a.width,U=Math.floor(s.y+s.height/2-a.height/2)):(C="center",U=Math.floor((u.height-a.height)/2),ie=Math.floor((u.width-a.width)/2));const te=u.height-a.height-ht,ee=u.width-a.width-ht;return U=ol(U,ht,Math.max(ht,te)),ie=ol(ie,ht,Math.max(ht,ee)),{top:U,left:ie,placement:C}}const bd=`
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
`,Sd=4,Ed=3e4,Fs=180,Us=8,Cd=24;function Ad({position:s,onClick:u,onDismissDomain:a,onPersistPosition:f,flash:x,phase:h,hasContext:A,disconnected:E,mode:w="corner"}){const[j,z]=b.useState(s),[C,U]=b.useState(!1),[ie,te]=b.useState({dx:0,dy:0,near:!1}),[ee,ae]=b.useState(null),[D,we]=b.useState(!1),[Ae,ve]=b.useState(!1),[$,N]=b.useState(!1),L=b.useRef(null),F=b.useRef(null),K=b.useRef(null),ge=b.useRef(null),Ne=b.useRef(null);b.useEffect(()=>{z(s)},[s.bottom,s.right]),b.useEffect(()=>{if(w==="cursor"){U(d=>d&&!1);return}function R(){K.current!==null&&window.clearTimeout(K.current),U(d=>d&&!1),K.current=window.setTimeout(()=>{U(!0)},Ed)}return R(),window.addEventListener("mousemove",R,{passive:!0}),window.addEventListener("keydown",R,{passive:!0}),()=>{window.removeEventListener("mousemove",R),window.removeEventListener("keydown",R),K.current!==null&&window.clearTimeout(K.current)}},[w]),b.useEffect(()=>{if(w!=="cursor"){ae(null),we(!1),ve(!1),N(!1);return}const R=document.createElement("style");R.id="gauntlet-pill-cursor-style",R.textContent=`
      html, body, * { cursor: none !important; }
    `,document.documentElement.appendChild(R);let d=null,k=null;function Z(){if(d=null,!k)return;ae(k);const le=document.elementFromPoint(k.x,k.y),re=!!(le!=null&&le.closest('input:not([type="button"]):not([type="submit"]):not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="color"]):not([type="file"]), textarea, [contenteditable=""], [contenteditable="true"]')),me=re?!1:!!(le!=null&&le.closest('a, button, [role="button"], select'));ve(Ee=>Ee===re?Ee:re),we(Ee=>Ee===me?Ee:me)}function ne(le){k={x:le.clientX,y:le.clientY},d==null&&(d=window.requestAnimationFrame(Z))}function ue(le){(le.metaKey||le.ctrlKey)&&N(!0)}function ce(le){!le.metaKey&&!le.ctrlKey&&N(!1)}return window.addEventListener("pointermove",ne,{passive:!0}),window.addEventListener("keydown",ue,{passive:!0}),window.addEventListener("keyup",ce,{passive:!0}),()=>{window.removeEventListener("pointermove",ne),window.removeEventListener("keydown",ue),window.removeEventListener("keyup",ce),d!=null&&cancelAnimationFrame(d),R.remove(),ae(null),we(!1),ve(!1),N(!1)}},[w]),b.useEffect(()=>{if(w==="cursor"){te(d=>d.dx===0&&d.dy===0&&!d.near?d:{dx:0,dy:0,near:!1});return}function R(d){Ne.current={x:d.clientX,y:d.clientY},ge.current==null&&(ge.current=window.requestAnimationFrame(()=>{if(ge.current=null,L.current)return;const k=Ne.current;if(!k)return;const Z=F.current;if(!Z)return;const ne=Z.getBoundingClientRect(),ue=ne.left+ne.width/2,ce=ne.top+ne.height/2,le=k.x-ue,re=k.y-ce,me=Math.hypot(le,re);if(me>Fs||me<1){te(ct=>ct.dx===0&&ct.dy===0&&!ct.near?ct:{dx:0,dy:0,near:!1});return}const Ee=1-me/Fs,Et=Us+(Cd-Us)*Ee,xt=le/me,ut=re/me;te({dx:xt*Et,dy:ut*Et,near:!0})}))}return window.addEventListener("pointermove",R,{passive:!0}),()=>{window.removeEventListener("pointermove",R),ge.current!=null&&(cancelAnimationFrame(ge.current),ge.current=null)}},[w]);const be=b.useCallback(R=>{var d;R.button===0&&((d=F.current)==null||d.setPointerCapture(R.pointerId),L.current={pressX:R.clientX,pressY:R.clientY,startBottom:j.bottom,startRight:j.right,armed:!1})},[j.bottom,j.right]),q=b.useCallback(R=>{const d=L.current;if(!d)return;const k=R.clientX-d.pressX,Z=R.clientY-d.pressY;!d.armed&&Math.abs(k)+Math.abs(Z)<Sd||(d.armed=!0,z({right:d.startRight-k,bottom:d.startBottom-Z}))},[]),Se=b.useCallback(R=>{var k;const d=L.current;L.current=null;try{(k=F.current)==null||k.releasePointerCapture(R.pointerId)}catch{}if(d){if(d.armed){f(j);return}u()}},[j,u,f]),he=b.useCallback(R=>{R.preventDefault();const d=(()=>{try{return window.location.hostname}catch{return""}})();window.confirm(d?`Esconder o Gauntlet em ${d}? Restauras na cápsula → "···" → restaurar.`:"Esconder o Gauntlet neste site?")&&a()},[a]),je=x==="ok"?"gauntlet-pill--success":x==="fail"?"gauntlet-pill--error":"",de=w==="cursor",O=["gauntlet-pill",C&&!de?"gauntlet-pill--idle":"",!de&&ie.near?"gauntlet-pill--near-cursor":"",A?"gauntlet-pill--context":"",E?"gauntlet-pill--disconnected":"",je,h&&h!=="idle"?`gauntlet-pill--phase-${h}`:"",de?"gauntlet-pill--cursor-mode":"",de&&D?"gauntlet-pill--over-interactive":"",de&&Ae?"gauntlet-pill--over-editable":"",de&&$?"gauntlet-pill--cmd-held":""].filter(Boolean).join(" "),J=de?ee?{top:`${ee.y}px`,left:`${ee.x}px`,right:"auto",bottom:"auto",transform:"translate(-50%, -50%)",pointerEvents:"none"}:{bottom:`${j.bottom}px`,right:`${j.right}px`,pointerEvents:"none"}:{bottom:`${j.bottom}px`,right:`${j.right}px`,transform:ie.dx!==0||ie.dy!==0?`translate3d(${ie.dx}px, ${ie.dy}px, 0)`:void 0};return g.jsx("button",{ref:F,type:"button",className:O,style:J,onPointerDown:be,onPointerMove:q,onPointerUp:Se,onPointerEnter:()=>U(!1),onContextMenu:he,"aria-label":"Summon Gauntlet capsule",title:"Click: abrir · Drag: mover · Right-click: esconder neste domínio",children:g.jsx("span",{className:"gauntlet-pill__mark","aria-hidden":!0,children:g.jsx("span",{className:"gauntlet-pill__dot"})})})}const Nd=`
@keyframes gauntlet-pill-pulse {
  0%, 100% { opacity: 0.7; transform: scale(1); }
  50%      { opacity: 1;   transform: scale(1.18); }
}
@keyframes gauntlet-pill-rise {
  0%   { opacity: 0; transform: translateY(8px) scale(0.85); }
  100% { opacity: 1; transform: translateY(0)   scale(1); }
}

.gauntlet-pill {
  position: fixed;
  width: 18px;
  height: 18px;
  padding: 0;
  border-radius: 50%;
  background: rgba(14, 16, 22, 0.92);
  border: 1px solid rgba(208, 122, 90, 0.45);
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.04),
    0 0 14px rgba(208, 122, 90, 0.28),
    0 4px 12px rgba(0, 0, 0, 0.40);
  backdrop-filter: saturate(1.4) blur(16px);
  -webkit-backdrop-filter: saturate(1.4) blur(16px);
  cursor: grab;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: auto;
  z-index: 2147483647;
  /* Transform transition tuned for the magnet — short enough to feel
     responsive, long enough to read as motion rather than a snap. */
  transition:
    transform 220ms cubic-bezier(0.2, 0, 0, 1),
    box-shadow 160ms cubic-bezier(0.2, 0, 0, 1),
    border-color 160ms ease,
    opacity 600ms ease,
    width 200ms cubic-bezier(0.2, 0, 0, 1),
    height 200ms cubic-bezier(0.2, 0, 0, 1);
  animation: gauntlet-pill-rise 320ms cubic-bezier(0.2, 0, 0, 1) both;
  user-select: none;
  -webkit-user-select: none;
  touch-action: none;
}
.gauntlet-pill:hover {
  width: 24px;
  height: 24px;
  transform: translateY(-2px);
  border-color: rgba(208, 122, 90, 0.65);
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.08),
    0 0 26px rgba(208, 122, 90, 0.55),
    0 8px 22px rgba(0, 0, 0, 0.55);
}
.gauntlet-pill:active {
  cursor: grabbing;
  transform: translateY(0) scale(0.94);
}
.gauntlet-pill:focus-visible {
  outline: 2px solid rgba(208, 122, 90, 0.7);
  outline-offset: 3px;
}
/* Idle: dim and quiet. Activity (mousemove, hover, keydown) brings
   the pill back to full presence in the same tick the listener fires. */
.gauntlet-pill--idle {
  opacity: 0.32;
}
.gauntlet-pill--idle .gauntlet-pill__dot {
  animation-play-state: paused;
}
@keyframes gauntlet-pill-flash-ok {
  0%   { box-shadow: 0 0 0 0 rgba(122, 180, 138, 0.85); transform: scale(1); }
  40%  { box-shadow: 0 0 0 12px rgba(122, 180, 138, 0); transform: scale(1.18); }
  100% { box-shadow: 0 0 0 0 rgba(122, 180, 138, 0); transform: scale(1); }
}
@keyframes gauntlet-pill-flash-fail {
  0%, 100% { transform: translateX(0); }
  20%      { transform: translateX(-3px) rotate(-4deg); }
  40%      { transform: translateX(3px)  rotate(4deg); }
  60%      { transform: translateX(-2px) rotate(-2deg); }
  80%      { transform: translateX(2px)  rotate(2deg); }
}
.gauntlet-pill--flash-ok,
.gauntlet-pill--success {
  border-color: rgba(122, 180, 138, 0.85) !important;
  animation:
    gauntlet-pill-rise 320ms cubic-bezier(0.2, 0, 0, 1) both,
    gauntlet-pill-flash-ok 1400ms ease-out 1;
}
.gauntlet-pill--flash-fail,
.gauntlet-pill--error {
  border-color: rgba(212, 96, 60, 0.85) !important;
  animation:
    gauntlet-pill-rise 320ms cubic-bezier(0.2, 0, 0, 1) both,
    gauntlet-pill-flash-fail 600ms ease-in-out 1;
}

/* Near-cursor — subtle visual confirmation when the pill drifts toward
   the cursor. Brighter ring + slight upscale; never aggressive. */
.gauntlet-pill--near-cursor {
  border-color: rgba(208, 122, 90, 0.75);
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.06),
    0 0 22px rgba(208, 122, 90, 0.55),
    0 6px 18px rgba(0, 0, 0, 0.50);
}
.gauntlet-pill--near-cursor .gauntlet-pill__dot {
  animation-duration: 1.6s;
}

/* Context detected — a non-empty selection on the page. Slightly
   stronger pulse so the operator senses "ready" without reading. */
.gauntlet-pill--context {
  border-color: rgba(208, 122, 90, 0.80);
}
.gauntlet-pill--context .gauntlet-pill__dot {
  animation-duration: 1.4s;
  background: #ffd2b6;
}

/* Disconnected — backend last failed. A soft red ring states the pill
   is "live" but the brain isn't reachable. Doctrine: never silent. */
.gauntlet-pill--disconnected {
  border-color: rgba(212, 96, 60, 0.65) !important;
  box-shadow:
    0 0 0 1px rgba(212, 96, 60, 0.25),
    0 0 12px rgba(212, 96, 60, 0.40),
    0 4px 12px rgba(0, 0, 0, 0.40);
}
.gauntlet-pill--disconnected .gauntlet-pill__dot {
  background: #f1a4ad;
  box-shadow: 0 0 6px rgba(241, 164, 173, 0.85);
}
.gauntlet-pill__mark {
  position: relative;
  width: 8px;
  height: 8px;
  border-radius: 3px;
  background:
    radial-gradient(60% 60% at 30% 30%, rgba(208, 122, 90, 0.95), rgba(208, 122, 90, 0.45) 60%, transparent 100%),
    #1a1d26;
  border: 1px solid rgba(208, 122, 90, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}
.gauntlet-pill__dot {
  width: 2.5px;
  height: 2.5px;
  border-radius: 50%;
  background: #f4c4ad;
  box-shadow: 0 0 6px rgba(244, 196, 173, 0.85);
  animation: gauntlet-pill-pulse 2.4s ease-in-out infinite;
}

/* ── Breathing ring — sempre presente, never noisy ────────────────────────
   A slow outward halo that doesn't compete with content. Different from
   the dot pulse: this is the pill's "I am here" signal even in idle. */
@keyframes gauntlet-pill-breathe {
  0%, 100% { box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.04),
    0 0 14px rgba(208, 122, 90, 0.22),
    0 4px 12px rgba(0, 0, 0, 0.40); }
  50%      { box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.06),
    0 0 22px rgba(208, 122, 90, 0.42),
    0 4px 14px rgba(0, 0, 0, 0.40); }
}
.gauntlet-pill {
  animation:
    gauntlet-pill-rise 320ms cubic-bezier(0.2, 0, 0, 1) both,
    gauntlet-pill-breathe 4.6s ease-in-out 320ms infinite;
}
.gauntlet-pill--idle { animation-play-state: running, paused; }

/* ── Phase-reactive ring — mirrors the cápsula's ambient glow ────────────
   App listens to the gauntlet:phase event from Capsule and forwards
   the value as a prop. Each non-idle phase paints a distinct halo so
   the operator's eye catches "the model is working" from across the
   page even after they dismissed the cápsula. */
@keyframes gauntlet-pill-phase-spin {
  to { transform: rotate(360deg); }
}
.gauntlet-pill--phase-planning,
.gauntlet-pill--phase-streaming,
.gauntlet-pill--phase-executing {
  width: 22px;
  height: 22px;
}
.gauntlet-pill--phase-planning::after,
.gauntlet-pill--phase-streaming::after,
.gauntlet-pill--phase-plan_ready::after,
.gauntlet-pill--phase-executing::after,
.gauntlet-pill--phase-executed::after,
.gauntlet-pill--phase-error::after {
  content: '';
  position: absolute;
  inset: -3px;
  border-radius: 50%;
  pointer-events: none;
  border: 2px solid var(--gauntlet-pill-phase-color, transparent);
  animation: gauntlet-pill-phase-spin 6s linear infinite;
  box-shadow: 0 0 12px var(--gauntlet-pill-phase-color, transparent);
}
.gauntlet-pill--phase-planning  { --gauntlet-pill-phase-color: rgba(244, 196, 86, 0.65); }
.gauntlet-pill--phase-streaming { --gauntlet-pill-phase-color: rgba(208, 122, 90, 0.75); }
.gauntlet-pill--phase-plan_ready{ --gauntlet-pill-phase-color: rgba(208, 122, 90, 0.45); }
.gauntlet-pill--phase-executing { --gauntlet-pill-phase-color: rgba(98, 130, 200, 0.65); }
.gauntlet-pill--phase-executed  { --gauntlet-pill-phase-color: rgba(122, 180, 138, 0.65); }
.gauntlet-pill--phase-error     { --gauntlet-pill-phase-color: rgba(212, 96, 60, 0.75); }

/* ── Summon swoop — click animation ────────────────────────────────────── */
@keyframes gauntlet-pill-summon {
  0%   { transform: scale(1); }
  50%  { transform: scale(0.78); box-shadow: 0 0 0 6px rgba(208, 122, 90, 0.35); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 transparent; }
}
.gauntlet-pill--summoning {
  animation: gauntlet-pill-summon 240ms ease-out;
}

/* ── Cursor-mode — pill becomes the visual cursor ────────────────────────
   The component flips top/left + pointer-events: none in JS; CSS
   tightens the visual: smaller resting size (cursor needs to feel
   precise, not chunky), softer glow, transition tuned for follow
   smoothness. The OS cursor itself is hidden via a stylesheet
   injected on <html> by the component. */
.gauntlet-pill--cursor-mode {
  width: 14px;
  height: 14px;
  /* Position transitions are killed in cursor mode — top/left jumps
     pixel-accurate per rAF tick, no easing. Other transitions stay so
     the morph between states (interactive / cmd held) feels live. */
  transition:
    width 200ms cubic-bezier(0.2, 0, 0, 1),
    height 200ms cubic-bezier(0.2, 0, 0, 1),
    border-color 160ms ease,
    box-shadow 200ms ease,
    opacity 200ms ease;
  animation: none;
}
.gauntlet-pill--cursor-mode .gauntlet-pill__mark {
  width: 6px;
  height: 6px;
  border-radius: 2px;
}
.gauntlet-pill--cursor-mode .gauntlet-pill__dot {
  width: 2px;
  height: 2px;
}

/* Over an interactive element — Pill morphs to a slightly larger ring
   with stronger ember glow so the operator senses click affordance. */
.gauntlet-pill--over-interactive {
  width: 22px;
  height: 22px;
  border-color: rgba(208, 122, 90, 0.85);
  box-shadow:
    0 0 0 1px rgba(208, 122, 90, 0.35),
    0 0 18px rgba(208, 122, 90, 0.55),
    0 4px 10px rgba(0, 0, 0, 0.30);
}

/* Over an editable surface — pill morphs to a thin vertical bar that
   reads as the OS I-beam. Width collapses to 2px, height grows to
   18px, the inner mark/dot are hidden so the bar is a clean stripe.
   The transition is fast (160ms) so the I-beam ↔ ring morph feels
   snappy as the operator skims between text and links. */
.gauntlet-pill--over-editable {
  width: 2px;
  height: 18px;
  border-radius: 1px;
  border-color: rgba(208, 122, 90, 0.95);
  background: rgba(208, 122, 90, 0.95);
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.18),
    0 0 8px rgba(208, 122, 90, 0.55);
}
.gauntlet-pill--over-editable .gauntlet-pill__mark,
.gauntlet-pill--over-editable .gauntlet-pill__dot {
  display: none;
}

/* Cmd / Ctrl held — "ready to invoke" expand. The keyboard shortcut
   is the summon path in cursor mode; this state confirms the
   modifier is registered before the operator commits. */
.gauntlet-pill--cmd-held {
  width: 26px;
  height: 26px;
  border-color: rgba(208, 122, 90, 1);
  box-shadow:
    0 0 0 2px rgba(208, 122, 90, 0.45),
    0 0 28px rgba(208, 122, 90, 0.65);
}
.gauntlet-pill--cmd-held .gauntlet-pill__mark {
  width: 10px;
  height: 10px;
}
`,Td=100,Pd=new Set(["script","style","meta","link","noscript","head","html","br","hr","wbr"]),jd="gauntlet-capsule-host";function zd(s){const u=s.tagName.toLowerCase(),a=s.getAttribute("id");if(a&&!a.startsWith("gauntlet-"))return`${u}#${CSS.escape(a)}`;const f=s.getAttribute("name");if(f)return`${u}[name="${f}"]`;const x=s.getAttribute("type");if(x)return`${u}[type="${x}"]`;const h=Array.from(s.classList).filter(A=>A.length>2&&!A.startsWith("is-")&&!A.startsWith("has-")).slice(0,2);return h.length>0?`${u}.${h.map(A=>CSS.escape(A)).join(".")}`:u}function Md(s){try{const u=window.getComputedStyle(s);if(u.display==="none"||u.visibility==="hidden"||u.opacity==="0")return!1;const a=s.getBoundingClientRect();return!(a.width===0&&a.height===0||a.bottom<0||a.top>window.innerHeight||a.right<0||a.left>window.innerWidth)}catch{return!1}}function Ld(s){let u=0,a=s;for(;a&&a!==document.body;)u++,a=a.parentElement;return u}function Rd(s){var a;let u=s;for(;u;){if(u.id===jd||(a=u.id)!=null&&a.startsWith("gauntlet-"))return!0;u=u.parentElement}return!1}function Dd(s){var j;const u=s.tagName.toLowerCase();if(Pd.has(u)||Rd(s))return null;const a=zd(s),f=Md(s),x=Ld(s),h={selector:a,tag:u,visible:f,depth:x},A=s.getAttribute("type");A&&(h.type=A);const E=s.getAttribute("placeholder")||s.getAttribute("aria-label")||s.getAttribute("title")||"";E&&(h.placeholder=E.trim().slice(0,80));const w=((j=s.innerText)==null?void 0:j.trim())??"";return w&&w.length>0&&(h.text=w.slice(0,50)),h}const Id=["input","textarea","select",'[contenteditable="true"]',"button","a[href]","label",'[role="button"]','[role="link"]','[role="textbox"]','[role="combobox"]','[role="listbox"]','[role="menuitem"]','[role="tab"]','[role="checkbox"]','[role="radio"]','[role="switch"]',"nav","main","form"].join(", ");function Od(){try{const s=[],u=new Set,a=document.querySelectorAll(Id);for(const f of Array.from(a)){if(s.length>=Td)break;const x=Dd(f);x&&(u.has(x.selector)||(u.add(x.selector),s.push(x)))}return{elements:s}}catch{return{elements:[]}}}const Bs=5e3;function $d(){try{const s=document.body;if(!s)return"";const a=(s.innerText??"").replace(/\r\n/g,`
`).replace(/\r/g,`
`).replace(/\n{3,}/g,`

`).replace(/[ \t]{2,}/g," ").trim();return a.length<=Bs?a:a.slice(0,Bs)+"…"}catch{return""}}function Hs(){return{text:Bd(),url:Hd(),pageTitle:Vd(),pageText:$d(),domSkeleton:JSON.stringify(Od()),bbox:Wd()}}const Fd=50;async function Ud(){var A;const s=Hs();if(s.text)return s;const u=`gauntlet-cid-${Math.random().toString(36).slice(2)}`,a=[],f=E=>{const w=E.data;!w||w.gauntlet!=="subframe-selection-response"||w.cid===u&&(typeof w.text!="string"||!w.text||a.push({text:w.text,url:typeof w.url=="string"?w.url:void 0,pageTitle:typeof w.pageTitle=="string"?w.pageTitle:void 0}))};window.addEventListener("message",f);let x=null;try{x=document.querySelectorAll("iframe")}catch{x=null}if(x)for(const E of Array.from(x))try{(A=E.contentWindow)==null||A.postMessage({gauntlet:"subframe-selection-request",cid:u},"*")}catch{}await new Promise(E=>window.setTimeout(E,Fd)),window.removeEventListener("message",f);const h=a.sort((E,w)=>w.text.length-E.text.length)[0];return h?{...s,text:h.text,url:h.url||s.url,pageTitle:h.pageTitle||s.pageTitle,bbox:null}:s}function Bd(){try{const s=window.getSelection();return s?s.toString().trim():""}catch{return""}}function Hd(){try{return window.location.href}catch{return""}}function Vd(){try{return document.title??""}catch{return""}}function Wd(){try{const s=window.getSelection();if(!s||s.rangeCount===0||s.isCollapsed)return null;const a=s.getRangeAt(0).getBoundingClientRect();return a.width===0&&a.height===0?null:{x:a.x,y:a.y,width:a.width,height:a.height}}catch{return null}}const Kd={domExecution:!0,pillSurface:!0,screenshot:!0,dismissDomain:!0,voice:typeof window<"u"&&("SpeechRecognition"in window||"webkitSpeechRecognition"in window),streaming:!0,refreshSelection:!0};async function Yd(s,u,a){const f=await chrome.runtime.sendMessage({type:"gauntlet:fetch",url:u,method:s,headers:{"content-type":"application/json"},body:a===void 0?void 0:JSON.stringify(a)});if(!f||!f.ok)throw new Error(`composer: background fetch failed — ${(f==null?void 0:f.error)??"unknown error"}`);let x=null;if(f.body!=null&&f.body!=="")try{x=JSON.parse(f.body)}catch{x=f.body}const h=f.status??0;if(h<200||h>=300)throw new Error(`composer: ${h} ${f.statusText??""}`.trim());return x}const Qd={async get(s){try{return(await chrome.storage.local.get(s))[s]??null}catch{return null}},async set(s,u){try{await chrome.storage.local.set({[s]:u})}catch{}},async remove(s){try{await chrome.storage.local.remove(s)}catch{}}};function Jd(s,u,a){const f=chrome.runtime.connect({name:"gauntlet:stream"});let x=!1;function h(){if(!x){x=!0;try{f.disconnect()}catch{}}}return f.onMessage.addListener(A=>{if(!A||typeof A!="object")return;const E=A;if(E.type==="sse"&&typeof E.data=="string"){let w=null;try{w=JSON.parse(E.data)}catch{a.onError("malformed SSE payload"),h();return}if(E.event==="delta"){const j=w.text??"";a.onDelta(j)}else if(E.event==="done"){const j=w;a.onDone({plan_id:j.plan_id??"",context_id:j.context_id??"",actions:j.actions??[],compose:j.compose??null,reason:j.reason??null,model_used:j.model_used??"",latency_ms:j.latency_ms??0,raw_response:null}),h()}else if(E.event==="error"){const j=w.error??"model error";a.onError(j),h()}}else E.type==="error"?(a.onError(E.error??"transport error"),h()):E.type==="closed"&&(x||(a.onDone({plan_id:"",context_id:"",actions:[],compose:null,reason:"stream ended without result",model_used:"",latency_ms:0,raw_response:null}),x=!0))}),f.onDisconnect.addListener(()=>{var A;if(!x){const E=(A=chrome.runtime.lastError)==null?void 0:A.message;a.onError(E??"disconnected"),x=!0}}),f.postMessage({type:"start",url:s,body:u}),()=>{if(!x){try{f.postMessage({type:"abort"})}catch{}h()}}}function qd(){return{shell:"browser",capabilities:Kd,transport:{fetchJson(s,u,a){return Yd(s,u,a)},stream:Jd},storage:Qd,selection:{read:()=>Hs(),readAsync:()=>Ud()},domActions:{execute:ld},screenshot:{async capture(){var s;if(typeof chrome>"u"||!((s=chrome.runtime)!=null&&s.sendMessage))return null;try{const u=await chrome.runtime.sendMessage({type:"gauntlet:capture_screenshot"});return!(u!=null&&u.ok)||!u.dataUrl?null:u.dataUrl}catch{return null}}},debug:{async lastSummon(){try{const s=await chrome.runtime.sendMessage({type:"gauntlet:debug"});return(s==null?void 0:s.lastSummon)??null}catch{return null}}}}}const Gd=bd+Nd;function Xd(){const s=b.useMemo(()=>qd(),[]),u=b.useMemo(()=>Os(s.storage),[s]),[a,f]=b.useState({kind:"pill"}),[x,h]=b.useState(Ds),[A,E]=b.useState(Rs),[w,j]=b.useState(!1),[z,C]=b.useState(null),[U,ie]=b.useState(null),[te,ee]=b.useState(!1);b.useEffect(()=>{function $(){let N=!1;try{const L=window.getSelection();N=!!(L&&L.toString().trim().length>0)}catch{N=!1}ee(L=>L===N?L:N)}return $(),document.addEventListener("selectionchange",$,{passive:!0}),()=>document.removeEventListener("selectionchange",$)},[]),b.useEffect(()=>{function $(L){const F=L.detail,K=(F==null?void 0:F.ok)===!1?"fail":"ok";C(K),window.setTimeout(()=>C(null),1500)}function N(L){const F=L.detail;F!=null&&F.phase&&(ie(F.phase),(F.phase==="executed"||F.phase==="error")&&window.setTimeout(()=>ie(null),3500))}return window.addEventListener("gauntlet:execute-result",$),window.addEventListener("gauntlet:phase",N),()=>{window.removeEventListener("gauntlet:execute-result",$),window.removeEventListener("gauntlet:phase",N)}},[]);const ae=b.useRef(null);b.useEffect(()=>{function $(N){ae.current={x:N.clientX,y:N.clientY}}return window.addEventListener("mousemove",$,{passive:!0}),()=>window.removeEventListener("mousemove",$)},[]),b.useEffect(()=>{let $=!1;u.readPillPosition().then(F=>{$||h(F)}),u.readPillMode().then(F=>{$||E(F)});function N(F){const K=F.detail;((K==null?void 0:K.mode)==="cursor"||(K==null?void 0:K.mode)==="corner")&&E(K.mode)}window.addEventListener("gauntlet:pill-mode",N);const L=(()=>{try{return window.location.hostname}catch{return""}})();return L&&u.isDomainDismissed(L).then(F=>{$||!F||(j(!0),f(K=>K.kind==="pill"?{kind:"gone"}:K))}),()=>{$=!0,window.removeEventListener("gauntlet:pill-mode",N)}},[u]);const D=b.useCallback(()=>{const $=ae.current;f(N=>({kind:"capsule",snapshot:s.selection.read(),cursor:$,nonce:N.kind==="capsule"?N.nonce+1:1})),s.selection.readAsync&&s.selection.readAsync().then(N=>{f(L=>L.kind!=="capsule"||!N.text||N.text===L.snapshot.text?L:{...L,snapshot:N})})},[s]),we=b.useCallback(()=>{f(w?{kind:"gone"}:{kind:"pill"})},[w]),Ae=b.useCallback(()=>{const $=(()=>{try{return window.location.hostname}catch{return""}})();$&&u.dismissDomain($),j(!0),f({kind:"gone"})},[u]),ve=b.useCallback($=>{u.writePillPosition($)},[u]);return b.useEffect(()=>{function $(N,L,F){if(!N||typeof N!="object")return!1;const K=N.type;return K==="gauntlet:summon"?(D(),F({ok:!0}),!1):(K==="gauntlet:dismiss"&&(we(),F({ok:!0})),!1)}return chrome.runtime.onMessage.addListener($),()=>chrome.runtime.onMessage.removeListener($)},[D,we]),a.kind==="gone"?null:a.kind==="pill"?g.jsx(Ad,{position:x,mode:A,onClick:D,onDismissDomain:Ae,onPersistPosition:ve,flash:z,phase:U,hasContext:te,disconnected:U==="error"}):g.jsx(fd,{ambient:s,initialSnapshot:a.snapshot,cursorAnchor:a.cursor,onDismiss:we},a.nonce)}const Vs="gauntlet-capsule-host",Zd={matches:["<all_urls>"],runAt:"document_idle",cssInjectionMode:"manual",async main(){if(window.top!==window.self){window.addEventListener("message",h=>{var j;const A=h.data;if(!A||A.gauntlet!=="subframe-selection-request")return;const E=window.getSelection(),w=E?E.toString().trim():"";(j=h.source)==null||j.postMessage({gauntlet:"subframe-selection-response",cid:A.cid,text:w,url:window.location.href,pageTitle:document.title},{targetOrigin:"*"})});return}if(document.getElementById(Vs))return;const s=document.createElement("div");s.id=Vs,Object.assign(s.style,{position:"fixed",inset:"0",zIndex:"2147483647",pointerEvents:"none",all:"initial"});const u=s.attachShadow({mode:"open"}),a=document.createElement("style");a.textContent=Gd,u.appendChild(a);const f=document.createElement("div");u.appendChild(f),document.documentElement.appendChild(s),jc.createRoot(f).render(g.jsx(b.StrictMode,{children:g.jsx(Xd,{})}))}};var al={exports:{}},ep=al.exports,Ws;function tp(){return Ws||(Ws=1,(function(s,u){(function(a,f){f(s)})(typeof globalThis<"u"?globalThis:typeof self<"u"?self:ep,function(a){if(!(globalThis.chrome&&globalThis.chrome.runtime&&globalThis.chrome.runtime.id))throw new Error("This script should only be loaded in a browser extension.");if(globalThis.browser&&globalThis.browser.runtime&&globalThis.browser.runtime.id)a.exports=globalThis.browser;else{const f="The message port closed before a response was received.",x=h=>{const A={alarms:{clear:{minArgs:0,maxArgs:1},clearAll:{minArgs:0,maxArgs:0},get:{minArgs:0,maxArgs:1},getAll:{minArgs:0,maxArgs:0}},bookmarks:{create:{minArgs:1,maxArgs:1},get:{minArgs:1,maxArgs:1},getChildren:{minArgs:1,maxArgs:1},getRecent:{minArgs:1,maxArgs:1},getSubTree:{minArgs:1,maxArgs:1},getTree:{minArgs:0,maxArgs:0},move:{minArgs:2,maxArgs:2},remove:{minArgs:1,maxArgs:1},removeTree:{minArgs:1,maxArgs:1},search:{minArgs:1,maxArgs:1},update:{minArgs:2,maxArgs:2}},browserAction:{disable:{minArgs:0,maxArgs:1,fallbackToNoCallback:!0},enable:{minArgs:0,maxArgs:1,fallbackToNoCallback:!0},getBadgeBackgroundColor:{minArgs:1,maxArgs:1},getBadgeText:{minArgs:1,maxArgs:1},getPopup:{minArgs:1,maxArgs:1},getTitle:{minArgs:1,maxArgs:1},openPopup:{minArgs:0,maxArgs:0},setBadgeBackgroundColor:{minArgs:1,maxArgs:1,fallbackToNoCallback:!0},setBadgeText:{minArgs:1,maxArgs:1,fallbackToNoCallback:!0},setIcon:{minArgs:1,maxArgs:1},setPopup:{minArgs:1,maxArgs:1,fallbackToNoCallback:!0},setTitle:{minArgs:1,maxArgs:1,fallbackToNoCallback:!0}},browsingData:{remove:{minArgs:2,maxArgs:2},removeCache:{minArgs:1,maxArgs:1},removeCookies:{minArgs:1,maxArgs:1},removeDownloads:{minArgs:1,maxArgs:1},removeFormData:{minArgs:1,maxArgs:1},removeHistory:{minArgs:1,maxArgs:1},removeLocalStorage:{minArgs:1,maxArgs:1},removePasswords:{minArgs:1,maxArgs:1},removePluginData:{minArgs:1,maxArgs:1},settings:{minArgs:0,maxArgs:0}},commands:{getAll:{minArgs:0,maxArgs:0}},contextMenus:{remove:{minArgs:1,maxArgs:1},removeAll:{minArgs:0,maxArgs:0},update:{minArgs:2,maxArgs:2}},cookies:{get:{minArgs:1,maxArgs:1},getAll:{minArgs:1,maxArgs:1},getAllCookieStores:{minArgs:0,maxArgs:0},remove:{minArgs:1,maxArgs:1},set:{minArgs:1,maxArgs:1}},devtools:{inspectedWindow:{eval:{minArgs:1,maxArgs:2,singleCallbackArg:!1}},panels:{create:{minArgs:3,maxArgs:3,singleCallbackArg:!0},elements:{createSidebarPane:{minArgs:1,maxArgs:1}}}},downloads:{cancel:{minArgs:1,maxArgs:1},download:{minArgs:1,maxArgs:1},erase:{minArgs:1,maxArgs:1},getFileIcon:{minArgs:1,maxArgs:2},open:{minArgs:1,maxArgs:1,fallbackToNoCallback:!0},pause:{minArgs:1,maxArgs:1},removeFile:{minArgs:1,maxArgs:1},resume:{minArgs:1,maxArgs:1},search:{minArgs:1,maxArgs:1},show:{minArgs:1,maxArgs:1,fallbackToNoCallback:!0}},extension:{isAllowedFileSchemeAccess:{minArgs:0,maxArgs:0},isAllowedIncognitoAccess:{minArgs:0,maxArgs:0}},history:{addUrl:{minArgs:1,maxArgs:1},deleteAll:{minArgs:0,maxArgs:0},deleteRange:{minArgs:1,maxArgs:1},deleteUrl:{minArgs:1,maxArgs:1},getVisits:{minArgs:1,maxArgs:1},search:{minArgs:1,maxArgs:1}},i18n:{detectLanguage:{minArgs:1,maxArgs:1},getAcceptLanguages:{minArgs:0,maxArgs:0}},identity:{launchWebAuthFlow:{minArgs:1,maxArgs:1}},idle:{queryState:{minArgs:1,maxArgs:1}},management:{get:{minArgs:1,maxArgs:1},getAll:{minArgs:0,maxArgs:0},getSelf:{minArgs:0,maxArgs:0},setEnabled:{minArgs:2,maxArgs:2},uninstallSelf:{minArgs:0,maxArgs:1}},notifications:{clear:{minArgs:1,maxArgs:1},create:{minArgs:1,maxArgs:2},getAll:{minArgs:0,maxArgs:0},getPermissionLevel:{minArgs:0,maxArgs:0},update:{minArgs:2,maxArgs:2}},pageAction:{getPopup:{minArgs:1,maxArgs:1},getTitle:{minArgs:1,maxArgs:1},hide:{minArgs:1,maxArgs:1,fallbackToNoCallback:!0},setIcon:{minArgs:1,maxArgs:1},setPopup:{minArgs:1,maxArgs:1,fallbackToNoCallback:!0},setTitle:{minArgs:1,maxArgs:1,fallbackToNoCallback:!0},show:{minArgs:1,maxArgs:1,fallbackToNoCallback:!0}},permissions:{contains:{minArgs:1,maxArgs:1},getAll:{minArgs:0,maxArgs:0},remove:{minArgs:1,maxArgs:1},request:{minArgs:1,maxArgs:1}},runtime:{getBackgroundPage:{minArgs:0,maxArgs:0},getPlatformInfo:{minArgs:0,maxArgs:0},openOptionsPage:{minArgs:0,maxArgs:0},requestUpdateCheck:{minArgs:0,maxArgs:0},sendMessage:{minArgs:1,maxArgs:3},sendNativeMessage:{minArgs:2,maxArgs:2},setUninstallURL:{minArgs:1,maxArgs:1}},sessions:{getDevices:{minArgs:0,maxArgs:1},getRecentlyClosed:{minArgs:0,maxArgs:1},restore:{minArgs:0,maxArgs:1}},storage:{local:{clear:{minArgs:0,maxArgs:0},get:{minArgs:0,maxArgs:1},getBytesInUse:{minArgs:0,maxArgs:1},remove:{minArgs:1,maxArgs:1},set:{minArgs:1,maxArgs:1}},managed:{get:{minArgs:0,maxArgs:1},getBytesInUse:{minArgs:0,maxArgs:1}},sync:{clear:{minArgs:0,maxArgs:0},get:{minArgs:0,maxArgs:1},getBytesInUse:{minArgs:0,maxArgs:1},remove:{minArgs:1,maxArgs:1},set:{minArgs:1,maxArgs:1}}},tabs:{captureVisibleTab:{minArgs:0,maxArgs:2},create:{minArgs:1,maxArgs:1},detectLanguage:{minArgs:0,maxArgs:1},discard:{minArgs:0,maxArgs:1},duplicate:{minArgs:1,maxArgs:1},executeScript:{minArgs:1,maxArgs:2},get:{minArgs:1,maxArgs:1},getCurrent:{minArgs:0,maxArgs:0},getZoom:{minArgs:0,maxArgs:1},getZoomSettings:{minArgs:0,maxArgs:1},goBack:{minArgs:0,maxArgs:1},goForward:{minArgs:0,maxArgs:1},highlight:{minArgs:1,maxArgs:1},insertCSS:{minArgs:1,maxArgs:2},move:{minArgs:2,maxArgs:2},query:{minArgs:1,maxArgs:1},reload:{minArgs:0,maxArgs:2},remove:{minArgs:1,maxArgs:1},removeCSS:{minArgs:1,maxArgs:2},sendMessage:{minArgs:2,maxArgs:3},setZoom:{minArgs:1,maxArgs:2},setZoomSettings:{minArgs:1,maxArgs:2},update:{minArgs:1,maxArgs:2}},topSites:{get:{minArgs:0,maxArgs:0}},webNavigation:{getAllFrames:{minArgs:1,maxArgs:1},getFrame:{minArgs:1,maxArgs:1}},webRequest:{handlerBehaviorChanged:{minArgs:0,maxArgs:0}},windows:{create:{minArgs:0,maxArgs:1},get:{minArgs:1,maxArgs:2},getAll:{minArgs:0,maxArgs:1},getCurrent:{minArgs:0,maxArgs:1},getLastFocused:{minArgs:0,maxArgs:1},remove:{minArgs:1,maxArgs:1},update:{minArgs:2,maxArgs:2}}};if(Object.keys(A).length===0)throw new Error("api-metadata.json has not been included in browser-polyfill");class E extends WeakMap{constructor(L,F=void 0){super(F),this.createItem=L}get(L){return this.has(L)||this.set(L,this.createItem(L)),super.get(L)}}const w=N=>N&&typeof N=="object"&&typeof N.then=="function",j=(N,L)=>(...F)=>{h.runtime.lastError?N.reject(new Error(h.runtime.lastError.message)):L.singleCallbackArg||F.length<=1&&L.singleCallbackArg!==!1?N.resolve(F[0]):N.resolve(F)},z=N=>N==1?"argument":"arguments",C=(N,L)=>function(K,...ge){if(ge.length<L.minArgs)throw new Error(`Expected at least ${L.minArgs} ${z(L.minArgs)} for ${N}(), got ${ge.length}`);if(ge.length>L.maxArgs)throw new Error(`Expected at most ${L.maxArgs} ${z(L.maxArgs)} for ${N}(), got ${ge.length}`);return new Promise((Ne,be)=>{if(L.fallbackToNoCallback)try{K[N](...ge,j({resolve:Ne,reject:be},L))}catch(q){console.warn(`${N} API method doesn't seem to support the callback parameter, falling back to call it without a callback: `,q),K[N](...ge),L.fallbackToNoCallback=!1,L.noCallback=!0,Ne()}else L.noCallback?(K[N](...ge),Ne()):K[N](...ge,j({resolve:Ne,reject:be},L))})},U=(N,L,F)=>new Proxy(L,{apply(K,ge,Ne){return F.call(ge,N,...Ne)}});let ie=Function.call.bind(Object.prototype.hasOwnProperty);const te=(N,L={},F={})=>{let K=Object.create(null),ge={has(be,q){return q in N||q in K},get(be,q,Se){if(q in K)return K[q];if(!(q in N))return;let he=N[q];if(typeof he=="function")if(typeof L[q]=="function")he=U(N,N[q],L[q]);else if(ie(F,q)){let je=C(q,F[q]);he=U(N,N[q],je)}else he=he.bind(N);else if(typeof he=="object"&&he!==null&&(ie(L,q)||ie(F,q)))he=te(he,L[q],F[q]);else if(ie(F,"*"))he=te(he,L[q],F["*"]);else return Object.defineProperty(K,q,{configurable:!0,enumerable:!0,get(){return N[q]},set(je){N[q]=je}}),he;return K[q]=he,he},set(be,q,Se,he){return q in K?K[q]=Se:N[q]=Se,!0},defineProperty(be,q,Se){return Reflect.defineProperty(K,q,Se)},deleteProperty(be,q){return Reflect.deleteProperty(K,q)}},Ne=Object.create(N);return new Proxy(Ne,ge)},ee=N=>({addListener(L,F,...K){L.addListener(N.get(F),...K)},hasListener(L,F){return L.hasListener(N.get(F))},removeListener(L,F){L.removeListener(N.get(F))}}),ae=new E(N=>typeof N!="function"?N:function(F){const K=te(F,{},{getContent:{minArgs:0,maxArgs:0}});N(K)}),D=new E(N=>typeof N!="function"?N:function(F,K,ge){let Ne=!1,be,q=new Promise(de=>{be=function(O){Ne=!0,de(O)}}),Se;try{Se=N(F,K,be)}catch(de){Se=Promise.reject(de)}const he=Se!==!0&&w(Se);if(Se!==!0&&!he&&!Ne)return!1;const je=de=>{de.then(O=>{ge(O)},O=>{let J;O&&(O instanceof Error||typeof O.message=="string")?J=O.message:J="An unexpected error occurred",ge({__mozWebExtensionPolyfillReject__:!0,message:J})}).catch(O=>{console.error("Failed to send onMessage rejected reply",O)})};return je(he?Se:q),!0}),we=({reject:N,resolve:L},F)=>{h.runtime.lastError?h.runtime.lastError.message===f?L():N(new Error(h.runtime.lastError.message)):F&&F.__mozWebExtensionPolyfillReject__?N(new Error(F.message)):L(F)},Ae=(N,L,F,...K)=>{if(K.length<L.minArgs)throw new Error(`Expected at least ${L.minArgs} ${z(L.minArgs)} for ${N}(), got ${K.length}`);if(K.length>L.maxArgs)throw new Error(`Expected at most ${L.maxArgs} ${z(L.maxArgs)} for ${N}(), got ${K.length}`);return new Promise((ge,Ne)=>{const be=we.bind(null,{resolve:ge,reject:Ne});K.push(be),F.sendMessage(...K)})},ve={devtools:{network:{onRequestFinished:ee(ae)}},runtime:{onMessage:ee(D),onMessageExternal:ee(D),sendMessage:Ae.bind(null,"sendMessage",{minArgs:1,maxArgs:3})},tabs:{sendMessage:Ae.bind(null,"sendMessage",{minArgs:2,maxArgs:3})}},$={clear:{minArgs:1,maxArgs:1},get:{minArgs:1,maxArgs:1},set:{minArgs:1,maxArgs:1}};return A.privacy={network:{"*":$},services:{"*":$},websites:{"*":$}},te(h,ve,A)};a.exports=x(chrome)}})})(al)),al.exports}var np=tp();const sl=Ut(np);function il(s,...u){}const rp={debug:(...s)=>il(console.debug,...s),log:(...s)=>il(console.log,...s),warn:(...s)=>il(console.warn,...s),error:(...s)=>il(console.error,...s)},cl=class cl extends Event{constructor(u,a){super(cl.EVENT_NAME,{}),this.newUrl=u,this.oldUrl=a}};Hn(cl,"EVENT_NAME",zo("wxt:locationchange"));let jo=cl;function zo(s){var u;return`${(u=sl==null?void 0:sl.runtime)==null?void 0:u.id}:content:${s}`}function lp(s){let u,a;return{run(){u==null&&(a=new URL(location.href),u=s.setInterval(()=>{let f=new URL(location.href);f.href!==a.href&&(window.dispatchEvent(new jo(f,a)),a=f)},1e3))}}}const hr=class hr{constructor(u,a){Hn(this,"isTopFrame",window.self===window.top);Hn(this,"abortController");Hn(this,"locationWatcher",lp(this));Hn(this,"receivedMessageIds",new Set);this.contentScriptName=u,this.options=a,this.abortController=new AbortController,this.isTopFrame?(this.listenForNewerScripts({ignoreFirstEvent:!0}),this.stopOldScripts()):this.listenForNewerScripts()}get signal(){return this.abortController.signal}abort(u){return this.abortController.abort(u)}get isInvalid(){return sl.runtime.id==null&&this.notifyInvalidated(),this.signal.aborted}get isValid(){return!this.isInvalid}onInvalidated(u){return this.signal.addEventListener("abort",u),()=>this.signal.removeEventListener("abort",u)}block(){return new Promise(()=>{})}setInterval(u,a){const f=setInterval(()=>{this.isValid&&u()},a);return this.onInvalidated(()=>clearInterval(f)),f}setTimeout(u,a){const f=setTimeout(()=>{this.isValid&&u()},a);return this.onInvalidated(()=>clearTimeout(f)),f}requestAnimationFrame(u){const a=requestAnimationFrame((...f)=>{this.isValid&&u(...f)});return this.onInvalidated(()=>cancelAnimationFrame(a)),a}requestIdleCallback(u,a){const f=requestIdleCallback((...x)=>{this.signal.aborted||u(...x)},a);return this.onInvalidated(()=>cancelIdleCallback(f)),f}addEventListener(u,a,f,x){var h;a==="wxt:locationchange"&&this.isValid&&this.locationWatcher.run(),(h=u.addEventListener)==null||h.call(u,a.startsWith("wxt:")?zo(a):a,f,{...x,signal:this.signal})}notifyInvalidated(){this.abort("Content script context invalidated"),rp.debug(`Content script "${this.contentScriptName}" context invalidated`)}stopOldScripts(){window.postMessage({type:hr.SCRIPT_STARTED_MESSAGE_TYPE,contentScriptName:this.contentScriptName,messageId:Math.random().toString(36).slice(2)},"*")}verifyScriptStartedEvent(u){var h,A,E;const a=((h=u.data)==null?void 0:h.type)===hr.SCRIPT_STARTED_MESSAGE_TYPE,f=((A=u.data)==null?void 0:A.contentScriptName)===this.contentScriptName,x=!this.receivedMessageIds.has((E=u.data)==null?void 0:E.messageId);return a&&f&&x}listenForNewerScripts(u){let a=!0;const f=x=>{if(this.verifyScriptStartedEvent(x)){this.receivedMessageIds.add(x.data.messageId);const h=a;if(a=!1,h&&(u!=null&&u.ignoreFirstEvent))return;this.notifyInvalidated()}};addEventListener("message",f),this.onInvalidated(()=>removeEventListener("message",f))}};Hn(hr,"SCRIPT_STARTED_MESSAGE_TYPE",zo("wxt:content-script-started"));let Mo=hr;const op=Symbol("null");let ap=0;class sp extends Map{constructor(...u){super(),this._objectHashes=new WeakMap,this._symbolHashes=new Map,this._publicKeys=new Map;const[a]=u;if(a!=null){if(typeof a[Symbol.iterator]!="function")throw new TypeError(typeof a+" is not iterable (cannot read property Symbol(Symbol.iterator))");for(const[f,x]of a)this.set(f,x)}}_getPublicKeys(u,a=!1){if(!Array.isArray(u))throw new TypeError("The keys parameter must be an array");const f=this._getPrivateKey(u,a);let x;return f&&this._publicKeys.has(f)?x=this._publicKeys.get(f):a&&(x=[...u],this._publicKeys.set(f,x)),{privateKey:f,publicKey:x}}_getPrivateKey(u,a=!1){const f=[];for(const x of u){const h=x===null?op:x;let A;if(typeof h=="object"||typeof h=="function"?A="_objectHashes":typeof h=="symbol"?A="_symbolHashes":A=!1,!A)f.push(h);else if(this[A].has(h))f.push(this[A].get(h));else if(a){const E=`@@mkm-ref-${ap++}@@`;this[A].set(h,E),f.push(E)}else return!1}return JSON.stringify(f)}set(u,a){const{publicKey:f}=this._getPublicKeys(u,!0);return super.set(f,a)}get(u){const{publicKey:a}=this._getPublicKeys(u);return super.get(a)}has(u){const{publicKey:a}=this._getPublicKeys(u);return super.has(a)}delete(u){const{publicKey:a,privateKey:f}=this._getPublicKeys(u);return!!(a&&super.delete(a)&&this._publicKeys.delete(f))}clear(){super.clear(),this._symbolHashes.clear(),this._publicKeys.clear()}get[Symbol.toStringTag](){return"ManyKeysMap"}get size(){return super.size}}new sp;function ug(){}function ul(s,...u){}const ip={debug:(...s)=>ul(console.debug,...s),log:(...s)=>ul(console.log,...s),warn:(...s)=>ul(console.warn,...s),error:(...s)=>ul(console.error,...s)};return(async()=>{try{const{main:s,...u}=Zd,a=new Mo("content",u);return await s(a)}catch(s){throw ip.error('The content script "content" crashed on startup!',s),s}})()})();
content;
