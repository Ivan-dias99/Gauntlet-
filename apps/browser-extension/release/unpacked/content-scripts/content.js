var content=(function(){"use strict";var og=Object.defineProperty;var sg=(Ht,Wt,nn)=>Wt in Ht?og(Ht,Wt,{enumerable:!0,configurable:!0,writable:!0,value:nn}):Ht[Wt]=nn;var Qn=(Ht,Wt,nn)=>sg(Ht,typeof Wt!="symbol"?Wt+"":Wt,nn);var Ht=typeof document<"u"?document.currentScript:null;function Wt(s){return s&&s.__esModule&&Object.prototype.hasOwnProperty.call(s,"default")?s.default:s}var nn={exports:{}},Sr={},Ma={exports:{}},ge={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Cs;function Nc(){if(Cs)return ge;Cs=1;var s=Symbol.for("react.element"),u=Symbol.for("react.portal"),o=Symbol.for("react.fragment"),d=Symbol.for("react.strict_mode"),x=Symbol.for("react.profiler"),m=Symbol.for("react.provider"),A=Symbol.for("react.context"),S=Symbol.for("react.forward_ref"),k=Symbol.for("react.suspense"),N=Symbol.for("react.memo"),P=Symbol.for("react.lazy"),C=Symbol.iterator;function B(f){return f===null||typeof f!="object"?null:(f=C&&f[C]||f["@@iterator"],typeof f=="function"?f:null)}var ie={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},ne=Object.assign,te={};function oe(f,E,ee){this.props=f,this.context=E,this.refs=te,this.updater=ee||ie}oe.prototype.isReactComponent={},oe.prototype.setState=function(f,E){if(typeof f!="object"&&typeof f!="function"&&f!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,f,E,"setState")},oe.prototype.forceUpdate=function(f){this.updater.enqueueForceUpdate(this,f,"forceUpdate")};function L(){}L.prototype=oe.prototype;function ke(f,E,ee){this.props=f,this.context=E,this.refs=te,this.updater=ee||ie}var Ae=ke.prototype=new L;Ae.constructor=ke,ne(Ae,oe.prototype),Ae.isPureReactComponent=!0;var _e=Array.isArray,F=Object.prototype.hasOwnProperty,T={current:null},R={key:!0,ref:!0,__self:!0,__source:!0};function U(f,E,ee){var re,de={},pe=null,le=null;if(E!=null)for(re in E.ref!==void 0&&(le=E.ref),E.key!==void 0&&(pe=""+E.key),E)F.call(E,re)&&!R.hasOwnProperty(re)&&(de[re]=E[re]);var ue=arguments.length-2;if(ue===1)de.children=ee;else if(1<ue){for(var me=Array(ue),Le=0;Le<ue;Le++)me[Le]=arguments[Le+2];de.children=me}if(f&&f.defaultProps)for(re in ue=f.defaultProps,ue)de[re]===void 0&&(de[re]=ue[re]);return{$$typeof:s,type:f,key:pe,ref:le,props:de,_owner:T.current}}function Y(f,E){return{$$typeof:s,type:f.type,key:E,ref:f.ref,props:f.props,_owner:f._owner}}function he(f){return typeof f=="object"&&f!==null&&f.$$typeof===s}function Ne(f){var E={"=":"=0",":":"=2"};return"$"+f.replace(/[=:]/g,function(ee){return E[ee]})}var Se=/\/+/g;function q(f,E){return typeof f=="object"&&f!==null&&f.key!=null?Ne(""+f.key):E.toString(36)}function Ee(f,E,ee,re,de){var pe=typeof f;(pe==="undefined"||pe==="boolean")&&(f=null);var le=!1;if(f===null)le=!0;else switch(pe){case"string":case"number":le=!0;break;case"object":switch(f.$$typeof){case s:case u:le=!0}}if(le)return le=f,de=de(le),f=re===""?"."+q(le,0):re,_e(de)?(ee="",f!=null&&(ee=f.replace(Se,"$&/")+"/"),Ee(de,E,ee,"",function(Le){return Le})):de!=null&&(he(de)&&(de=Y(de,ee+(!de.key||le&&le.key===de.key?"":(""+de.key).replace(Se,"$&/")+"/")+f)),E.push(de)),1;if(le=0,re=re===""?".":re+":",_e(f))for(var ue=0;ue<f.length;ue++){pe=f[ue];var me=re+q(pe,ue);le+=Ee(pe,E,ee,me,de)}else if(me=B(f),typeof me=="function")for(f=me.call(f),ue=0;!(pe=f.next()).done;)pe=pe.value,me=re+q(pe,ue++),le+=Ee(pe,E,ee,me,de);else if(pe==="object")throw E=String(f),Error("Objects are not valid as a React child (found: "+(E==="[object Object]"?"object with keys {"+Object.keys(f).join(", ")+"}":E)+"). If you meant to render a collection of children, use an array instead.");return le}function xe(f,E,ee){if(f==null)return f;var re=[],de=0;return Ee(f,re,"","",function(pe){return E.call(ee,pe,de++)}),re}function Pe(f){if(f._status===-1){var E=f._result;E=E(),E.then(function(ee){(f._status===0||f._status===-1)&&(f._status=1,f._result=ee)},function(ee){(f._status===0||f._status===-1)&&(f._status=2,f._result=ee)}),f._status===-1&&(f._status=0,f._result=E)}if(f._status===1)return f._result.default;throw f._result}var fe={current:null},$={transition:null},G={ReactCurrentDispatcher:fe,ReactCurrentBatchConfig:$,ReactCurrentOwner:T};function D(){throw Error("act(...) is not supported in production builds of React.")}return ge.Children={map:xe,forEach:function(f,E,ee){xe(f,function(){E.apply(this,arguments)},ee)},count:function(f){var E=0;return xe(f,function(){E++}),E},toArray:function(f){return xe(f,function(E){return E})||[]},only:function(f){if(!he(f))throw Error("React.Children.only expected to receive a single React element child.");return f}},ge.Component=oe,ge.Fragment=o,ge.Profiler=x,ge.PureComponent=ke,ge.StrictMode=d,ge.Suspense=k,ge.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=G,ge.act=D,ge.cloneElement=function(f,E,ee){if(f==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+f+".");var re=ne({},f.props),de=f.key,pe=f.ref,le=f._owner;if(E!=null){if(E.ref!==void 0&&(pe=E.ref,le=T.current),E.key!==void 0&&(de=""+E.key),f.type&&f.type.defaultProps)var ue=f.type.defaultProps;for(me in E)F.call(E,me)&&!R.hasOwnProperty(me)&&(re[me]=E[me]===void 0&&ue!==void 0?ue[me]:E[me])}var me=arguments.length-2;if(me===1)re.children=ee;else if(1<me){ue=Array(me);for(var Le=0;Le<me;Le++)ue[Le]=arguments[Le+2];re.children=ue}return{$$typeof:s,type:f.type,key:de,ref:pe,props:re,_owner:le}},ge.createContext=function(f){return f={$$typeof:A,_currentValue:f,_currentValue2:f,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},f.Provider={$$typeof:m,_context:f},f.Consumer=f},ge.createElement=U,ge.createFactory=function(f){var E=U.bind(null,f);return E.type=f,E},ge.createRef=function(){return{current:null}},ge.forwardRef=function(f){return{$$typeof:S,render:f}},ge.isValidElement=he,ge.lazy=function(f){return{$$typeof:P,_payload:{_status:-1,_result:f},_init:Pe}},ge.memo=function(f,E){return{$$typeof:N,type:f,compare:E===void 0?null:E}},ge.startTransition=function(f){var E=$.transition;$.transition={};try{f()}finally{$.transition=E}},ge.unstable_act=D,ge.useCallback=function(f,E){return fe.current.useCallback(f,E)},ge.useContext=function(f){return fe.current.useContext(f)},ge.useDebugValue=function(){},ge.useDeferredValue=function(f){return fe.current.useDeferredValue(f)},ge.useEffect=function(f,E){return fe.current.useEffect(f,E)},ge.useId=function(){return fe.current.useId()},ge.useImperativeHandle=function(f,E,ee){return fe.current.useImperativeHandle(f,E,ee)},ge.useInsertionEffect=function(f,E){return fe.current.useInsertionEffect(f,E)},ge.useLayoutEffect=function(f,E){return fe.current.useLayoutEffect(f,E)},ge.useMemo=function(f,E){return fe.current.useMemo(f,E)},ge.useReducer=function(f,E,ee){return fe.current.useReducer(f,E,ee)},ge.useRef=function(f){return fe.current.useRef(f)},ge.useState=function(f){return fe.current.useState(f)},ge.useSyncExternalStore=function(f,E,ee){return fe.current.useSyncExternalStore(f,E,ee)},ge.useTransition=function(){return fe.current.useTransition()},ge.version="18.3.1",ge}var As;function za(){return As||(As=1,Ma.exports=Nc()),Ma.exports}/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Ns;function Tc(){if(Ns)return Sr;Ns=1;var s=za(),u=Symbol.for("react.element"),o=Symbol.for("react.fragment"),d=Object.prototype.hasOwnProperty,x=s.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,m={key:!0,ref:!0,__self:!0,__source:!0};function A(S,k,N){var P,C={},B=null,ie=null;N!==void 0&&(B=""+N),k.key!==void 0&&(B=""+k.key),k.ref!==void 0&&(ie=k.ref);for(P in k)d.call(k,P)&&!m.hasOwnProperty(P)&&(C[P]=k[P]);if(S&&S.defaultProps)for(P in k=S.defaultProps,k)C[P]===void 0&&(C[P]=k[P]);return{$$typeof:u,type:S,key:B,ref:ie,props:C,_owner:x.current}}return Sr.Fragment=o,Sr.jsx=A,Sr.jsxs=A,Sr}var Ts;function Pc(){return Ts||(Ts=1,nn.exports=Tc()),nn.exports}var p=Pc();function ig(s){return s}var b=za(),gl={},La={exports:{}},ot={},Ra={exports:{}},Da={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Ps;function jc(){return Ps||(Ps=1,(function(s){function u($,G){var D=$.length;$.push(G);e:for(;0<D;){var f=D-1>>>1,E=$[f];if(0<x(E,G))$[f]=G,$[D]=E,D=f;else break e}}function o($){return $.length===0?null:$[0]}function d($){if($.length===0)return null;var G=$[0],D=$.pop();if(D!==G){$[0]=D;e:for(var f=0,E=$.length,ee=E>>>1;f<ee;){var re=2*(f+1)-1,de=$[re],pe=re+1,le=$[pe];if(0>x(de,D))pe<E&&0>x(le,de)?($[f]=le,$[pe]=D,f=pe):($[f]=de,$[re]=D,f=re);else if(pe<E&&0>x(le,D))$[f]=le,$[pe]=D,f=pe;else break e}}return G}function x($,G){var D=$.sortIndex-G.sortIndex;return D!==0?D:$.id-G.id}if(typeof performance=="object"&&typeof performance.now=="function"){var m=performance;s.unstable_now=function(){return m.now()}}else{var A=Date,S=A.now();s.unstable_now=function(){return A.now()-S}}var k=[],N=[],P=1,C=null,B=3,ie=!1,ne=!1,te=!1,oe=typeof setTimeout=="function"?setTimeout:null,L=typeof clearTimeout=="function"?clearTimeout:null,ke=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function Ae($){for(var G=o(N);G!==null;){if(G.callback===null)d(N);else if(G.startTime<=$)d(N),G.sortIndex=G.expirationTime,u(k,G);else break;G=o(N)}}function _e($){if(te=!1,Ae($),!ne)if(o(k)!==null)ne=!0,Pe(F);else{var G=o(N);G!==null&&fe(_e,G.startTime-$)}}function F($,G){ne=!1,te&&(te=!1,L(U),U=-1),ie=!0;var D=B;try{for(Ae(G),C=o(k);C!==null&&(!(C.expirationTime>G)||$&&!Ne());){var f=C.callback;if(typeof f=="function"){C.callback=null,B=C.priorityLevel;var E=f(C.expirationTime<=G);G=s.unstable_now(),typeof E=="function"?C.callback=E:C===o(k)&&d(k),Ae(G)}else d(k);C=o(k)}if(C!==null)var ee=!0;else{var re=o(N);re!==null&&fe(_e,re.startTime-G),ee=!1}return ee}finally{C=null,B=D,ie=!1}}var T=!1,R=null,U=-1,Y=5,he=-1;function Ne(){return!(s.unstable_now()-he<Y)}function Se(){if(R!==null){var $=s.unstable_now();he=$;var G=!0;try{G=R(!0,$)}finally{G?q():(T=!1,R=null)}}else T=!1}var q;if(typeof ke=="function")q=function(){ke(Se)};else if(typeof MessageChannel<"u"){var Ee=new MessageChannel,xe=Ee.port2;Ee.port1.onmessage=Se,q=function(){xe.postMessage(null)}}else q=function(){oe(Se,0)};function Pe($){R=$,T||(T=!0,q())}function fe($,G){U=oe(function(){$(s.unstable_now())},G)}s.unstable_IdlePriority=5,s.unstable_ImmediatePriority=1,s.unstable_LowPriority=4,s.unstable_NormalPriority=3,s.unstable_Profiling=null,s.unstable_UserBlockingPriority=2,s.unstable_cancelCallback=function($){$.callback=null},s.unstable_continueExecution=function(){ne||ie||(ne=!0,Pe(F))},s.unstable_forceFrameRate=function($){0>$||125<$?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):Y=0<$?Math.floor(1e3/$):5},s.unstable_getCurrentPriorityLevel=function(){return B},s.unstable_getFirstCallbackNode=function(){return o(k)},s.unstable_next=function($){switch(B){case 1:case 2:case 3:var G=3;break;default:G=B}var D=B;B=G;try{return $()}finally{B=D}},s.unstable_pauseExecution=function(){},s.unstable_requestPaint=function(){},s.unstable_runWithPriority=function($,G){switch($){case 1:case 2:case 3:case 4:case 5:break;default:$=3}var D=B;B=$;try{return G()}finally{B=D}},s.unstable_scheduleCallback=function($,G,D){var f=s.unstable_now();switch(typeof D=="object"&&D!==null?(D=D.delay,D=typeof D=="number"&&0<D?f+D:f):D=f,$){case 1:var E=-1;break;case 2:E=250;break;case 5:E=1073741823;break;case 4:E=1e4;break;default:E=5e3}return E=D+E,$={id:P++,callback:G,priorityLevel:$,startTime:D,expirationTime:E,sortIndex:-1},D>f?($.sortIndex=D,u(N,$),o(k)===null&&$===o(N)&&(te?(L(U),U=-1):te=!0,fe(_e,D-f))):($.sortIndex=E,u(k,$),ne||ie||(ne=!0,Pe(F))),$},s.unstable_shouldYield=Ne,s.unstable_wrapCallback=function($){var G=B;return function(){var D=B;B=G;try{return $.apply(this,arguments)}finally{B=D}}}})(Da)),Da}var js;function Mc(){return js||(js=1,Ra.exports=jc()),Ra.exports}/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Ms;function zc(){if(Ms)return ot;Ms=1;var s=za(),u=Mc();function o(e){for(var t="https://reactjs.org/docs/error-decoder.html?invariant="+e,n=1;n<arguments.length;n++)t+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var d=new Set,x={};function m(e,t){A(e,t),A(e+"Capture",t)}function A(e,t){for(x[e]=t,e=0;e<t.length;e++)d.add(t[e])}var S=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),k=Object.prototype.hasOwnProperty,N=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,P={},C={};function B(e){return k.call(C,e)?!0:k.call(P,e)?!1:N.test(e)?C[e]=!0:(P[e]=!0,!1)}function ie(e,t,n,r){if(n!==null&&n.type===0)return!1;switch(typeof t){case"function":case"symbol":return!0;case"boolean":return r?!1:n!==null?!n.acceptsBooleans:(e=e.toLowerCase().slice(0,5),e!=="data-"&&e!=="aria-");default:return!1}}function ne(e,t,n,r){if(t===null||typeof t>"u"||ie(e,t,n,r))return!0;if(r)return!1;if(n!==null)switch(n.type){case 3:return!t;case 4:return t===!1;case 5:return isNaN(t);case 6:return isNaN(t)||1>t}return!1}function te(e,t,n,r,l,a,i){this.acceptsBooleans=t===2||t===3||t===4,this.attributeName=r,this.attributeNamespace=l,this.mustUseProperty=n,this.propertyName=e,this.type=t,this.sanitizeURL=a,this.removeEmptyString=i}var oe={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e){oe[e]=new te(e,0,!1,e,null,!1,!1)}),[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(e){var t=e[0];oe[t]=new te(t,1,!1,e[1],null,!1,!1)}),["contentEditable","draggable","spellCheck","value"].forEach(function(e){oe[e]=new te(e,2,!1,e.toLowerCase(),null,!1,!1)}),["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(e){oe[e]=new te(e,2,!1,e,null,!1,!1)}),"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e){oe[e]=new te(e,3,!1,e.toLowerCase(),null,!1,!1)}),["checked","multiple","muted","selected"].forEach(function(e){oe[e]=new te(e,3,!0,e,null,!1,!1)}),["capture","download"].forEach(function(e){oe[e]=new te(e,4,!1,e,null,!1,!1)}),["cols","rows","size","span"].forEach(function(e){oe[e]=new te(e,6,!1,e,null,!1,!1)}),["rowSpan","start"].forEach(function(e){oe[e]=new te(e,5,!1,e.toLowerCase(),null,!1,!1)});var L=/[\-:]([a-z])/g;function ke(e){return e[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e){var t=e.replace(L,ke);oe[t]=new te(t,1,!1,e,null,!1,!1)}),"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e){var t=e.replace(L,ke);oe[t]=new te(t,1,!1,e,"http://www.w3.org/1999/xlink",!1,!1)}),["xml:base","xml:lang","xml:space"].forEach(function(e){var t=e.replace(L,ke);oe[t]=new te(t,1,!1,e,"http://www.w3.org/XML/1998/namespace",!1,!1)}),["tabIndex","crossOrigin"].forEach(function(e){oe[e]=new te(e,1,!1,e.toLowerCase(),null,!1,!1)}),oe.xlinkHref=new te("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1),["src","href","action","formAction"].forEach(function(e){oe[e]=new te(e,1,!1,e.toLowerCase(),null,!0,!0)});function Ae(e,t,n,r){var l=oe.hasOwnProperty(t)?oe[t]:null;(l!==null?l.type!==0:r||!(2<t.length)||t[0]!=="o"&&t[0]!=="O"||t[1]!=="n"&&t[1]!=="N")&&(ne(t,n,l,r)&&(n=null),r||l===null?B(t)&&(n===null?e.removeAttribute(t):e.setAttribute(t,""+n)):l.mustUseProperty?e[l.propertyName]=n===null?l.type===3?!1:"":n:(t=l.attributeName,r=l.attributeNamespace,n===null?e.removeAttribute(t):(l=l.type,n=l===3||l===4&&n===!0?"":""+n,r?e.setAttributeNS(r,t,n):e.setAttribute(t,n))))}var _e=s.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,F=Symbol.for("react.element"),T=Symbol.for("react.portal"),R=Symbol.for("react.fragment"),U=Symbol.for("react.strict_mode"),Y=Symbol.for("react.profiler"),he=Symbol.for("react.provider"),Ne=Symbol.for("react.context"),Se=Symbol.for("react.forward_ref"),q=Symbol.for("react.suspense"),Ee=Symbol.for("react.suspense_list"),xe=Symbol.for("react.memo"),Pe=Symbol.for("react.lazy"),fe=Symbol.for("react.offscreen"),$=Symbol.iterator;function G(e){return e===null||typeof e!="object"?null:(e=$&&e[$]||e["@@iterator"],typeof e=="function"?e:null)}var D=Object.assign,f;function E(e){if(f===void 0)try{throw Error()}catch(n){var t=n.stack.trim().match(/\n( *(at )?)/);f=t&&t[1]||""}return`
`+f+e}var ee=!1;function re(e,t){if(!e||ee)return"";ee=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(t)if(t=function(){throw Error()},Object.defineProperty(t.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(t,[])}catch(w){var r=w}Reflect.construct(e,[],t)}else{try{t.call()}catch(w){r=w}e.call(t.prototype)}else{try{throw Error()}catch(w){r=w}e()}}catch(w){if(w&&r&&typeof w.stack=="string"){for(var l=w.stack.split(`
`),a=r.stack.split(`
`),i=l.length-1,c=a.length-1;1<=i&&0<=c&&l[i]!==a[c];)c--;for(;1<=i&&0<=c;i--,c--)if(l[i]!==a[c]){if(i!==1||c!==1)do if(i--,c--,0>c||l[i]!==a[c]){var g=`
`+l[i].replace(" at new "," at ");return e.displayName&&g.includes("<anonymous>")&&(g=g.replace("<anonymous>",e.displayName)),g}while(1<=i&&0<=c);break}}}finally{ee=!1,Error.prepareStackTrace=n}return(e=e?e.displayName||e.name:"")?E(e):""}function de(e){switch(e.tag){case 5:return E(e.type);case 16:return E("Lazy");case 13:return E("Suspense");case 19:return E("SuspenseList");case 0:case 2:case 15:return e=re(e.type,!1),e;case 11:return e=re(e.type.render,!1),e;case 1:return e=re(e.type,!0),e;default:return""}}function pe(e){if(e==null)return null;if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case R:return"Fragment";case T:return"Portal";case Y:return"Profiler";case U:return"StrictMode";case q:return"Suspense";case Ee:return"SuspenseList"}if(typeof e=="object")switch(e.$$typeof){case Ne:return(e.displayName||"Context")+".Consumer";case he:return(e._context.displayName||"Context")+".Provider";case Se:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case xe:return t=e.displayName||null,t!==null?t:pe(e.type)||"Memo";case Pe:t=e._payload,e=e._init;try{return pe(e(t))}catch{}}return null}function le(e){var t=e.type;switch(e.tag){case 24:return"Cache";case 9:return(t.displayName||"Context")+".Consumer";case 10:return(t._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return e=t.render,e=e.displayName||e.name||"",t.displayName||(e!==""?"ForwardRef("+e+")":"ForwardRef");case 7:return"Fragment";case 5:return t;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return pe(t);case 8:return t===U?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t}return null}function ue(e){switch(typeof e){case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function me(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function Le(e){var t=me(e)?"checked":"value",n=Object.getOwnPropertyDescriptor(e.constructor.prototype,t),r=""+e[t];if(!e.hasOwnProperty(t)&&typeof n<"u"&&typeof n.get=="function"&&typeof n.set=="function"){var l=n.get,a=n.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return l.call(this)},set:function(i){r=""+i,a.call(this,i)}}),Object.defineProperty(e,t,{enumerable:n.enumerable}),{getValue:function(){return r},setValue:function(i){r=""+i},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function nt(e){e._valueTracker||(e._valueTracker=Le(e))}function qe(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),r="";return e&&(r=me(e)?e.checked?"true":"false":e.value),e=r,e!==n?(t.setValue(e),!0):!1}function ln(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}function rt(e,t){var n=t.checked;return D({},t,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:n??e._wrapperState.initialChecked})}function Jn(e,t){var n=t.defaultValue==null?"":t.defaultValue,r=t.checked!=null?t.checked:t.defaultChecked;n=ue(t.value!=null?t.value:n),e._wrapperState={initialChecked:r,initialValue:n,controlled:t.type==="checkbox"||t.type==="radio"?t.checked!=null:t.value!=null}}function Lt(e,t){t=t.checked,t!=null&&Ae(e,"checked",t,!1)}function Rt(e,t){Lt(e,t);var n=ue(t.value),r=t.type;if(n!=null)r==="number"?(n===0&&e.value===""||e.value!=n)&&(e.value=""+n):e.value!==""+n&&(e.value=""+n);else if(r==="submit"||r==="reset"){e.removeAttribute("value");return}t.hasOwnProperty("value")?Ar(e,t.type,n):t.hasOwnProperty("defaultValue")&&Ar(e,t.type,ue(t.defaultValue)),t.checked==null&&t.defaultChecked!=null&&(e.defaultChecked=!!t.defaultChecked)}function jn(e,t,n){if(t.hasOwnProperty("value")||t.hasOwnProperty("defaultValue")){var r=t.type;if(!(r!=="submit"&&r!=="reset"||t.value!==void 0&&t.value!==null))return;t=""+e._wrapperState.initialValue,n||t===e.value||(e.value=t),e.defaultValue=t}n=e.name,n!==""&&(e.name=""),e.defaultChecked=!!e._wrapperState.initialChecked,n!==""&&(e.name=n)}function Ar(e,t,n){(t!=="number"||ln(e.ownerDocument)!==e)&&(n==null?e.defaultValue=""+e._wrapperState.initialValue:e.defaultValue!==""+n&&(e.defaultValue=""+n))}var an=Array.isArray;function Qe(e,t,n,r){if(e=e.options,t){t={};for(var l=0;l<n.length;l++)t["$"+n[l]]=!0;for(n=0;n<e.length;n++)l=t.hasOwnProperty("$"+e[n].value),e[n].selected!==l&&(e[n].selected=l),l&&r&&(e[n].defaultSelected=!0)}else{for(n=""+ue(n),t=null,l=0;l<e.length;l++){if(e[l].value===n){e[l].selected=!0,r&&(e[l].defaultSelected=!0);return}t!==null||e[l].disabled||(t=e[l])}t!==null&&(t.selected=!0)}}function on(e,t){if(t.dangerouslySetInnerHTML!=null)throw Error(o(91));return D({},t,{value:void 0,defaultValue:void 0,children:""+e._wrapperState.initialValue})}function Kt(e,t){var n=t.value;if(n==null){if(n=t.children,t=t.defaultValue,n!=null){if(t!=null)throw Error(o(92));if(an(n)){if(1<n.length)throw Error(o(93));n=n[0]}t=n}t==null&&(t=""),n=t}e._wrapperState={initialValue:ue(n)}}function Gn(e,t){var n=ue(t.value),r=ue(t.defaultValue);n!=null&&(n=""+n,n!==e.value&&(e.value=n),t.defaultValue==null&&e.defaultValue!==n&&(e.defaultValue=n)),r!=null&&(e.defaultValue=""+r)}function ft(e){var t=e.textContent;t===e._wrapperState.initialValue&&t!==""&&t!==null&&(e.value=t)}function qn(e){switch(e){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function Xn(e,t){return e==null||e==="http://www.w3.org/1999/xhtml"?qn(t):e==="http://www.w3.org/2000/svg"&&t==="foreignObject"?"http://www.w3.org/1999/xhtml":e}var Dt,Yt=(function(e){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(t,n,r,l){MSApp.execUnsafeLocalFunction(function(){return e(t,n,r,l)})}:e})(function(e,t){if(e.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in e)e.innerHTML=t;else{for(Dt=Dt||document.createElement("div"),Dt.innerHTML="<svg>"+t.valueOf().toString()+"</svg>",t=Dt.firstChild;e.firstChild;)e.removeChild(e.firstChild);for(;t.firstChild;)e.appendChild(t.firstChild)}});function It(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&n.nodeType===3){n.nodeValue=t;return}}e.textContent=t}var st={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},wl=["Webkit","ms","Moz","O"];Object.keys(st).forEach(function(e){wl.forEach(function(t){t=t+e.charAt(0).toUpperCase()+e.substring(1),st[t]=st[e]})});function kl(e,t,n){return t==null||typeof t=="boolean"||t===""?"":n||typeof t!="number"||t===0||st.hasOwnProperty(e)&&st[e]?(""+t).trim():t+"px"}function Nr(e,t){e=e.style;for(var n in t)if(t.hasOwnProperty(n)){var r=n.indexOf("--")===0,l=kl(n,t[n],r);n==="float"&&(n="cssFloat"),r?e.setProperty(n,l):e[n]=l}}var bl=D({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function Mn(e,t){if(t){if(bl[e]&&(t.children!=null||t.dangerouslySetInnerHTML!=null))throw Error(o(137,e));if(t.dangerouslySetInnerHTML!=null){if(t.children!=null)throw Error(o(60));if(typeof t.dangerouslySetInnerHTML!="object"||!("__html"in t.dangerouslySetInnerHTML))throw Error(o(61))}if(t.style!=null&&typeof t.style!="object")throw Error(o(62))}}function Zn(e,t){if(e.indexOf("-")===-1)return typeof t.is=="string";switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Ct=null;function sn(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var Tr=null,un=null,cn=null;function Pr(e){if(e=Zr(e)){if(typeof Tr!="function")throw Error(o(280));var t=e.stateNode;t&&(t=Yl(t),Tr(e.stateNode,e.type,t))}}function jr(e){un?cn?cn.push(e):cn=[e]:un=e}function Sl(){if(un){var e=un,t=cn;if(cn=un=null,Pr(e),t)for(e=0;e<t.length;e++)Pr(t[e])}}function Mr(e,t){return e(t)}function zn(){}var zr=!1;function El(e,t,n){if(zr)return e(t,n);zr=!0;try{return Mr(e,t,n)}finally{zr=!1,(un!==null||cn!==null)&&(zn(),Sl())}}function dn(e,t){var n=e.stateNode;if(n===null)return null;var r=Yl(n);if(r===null)return null;n=r[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(r=!r.disabled)||(e=e.type,r=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!r;break e;default:e=!1}if(e)return null;if(n&&typeof n!="function")throw Error(o(231,t,typeof n));return n}var Lr=!1;if(S)try{var Ot={};Object.defineProperty(Ot,"passive",{get:function(){Lr=!0}}),window.addEventListener("test",Ot,Ot),window.removeEventListener("test",Ot,Ot)}catch{Lr=!1}function Ha(e,t,n,r,l,a,i,c,g){var w=Array.prototype.slice.call(arguments,3);try{t.apply(n,w)}catch(M){this.onError(M)}}var Ln=!1,er=null,Rn=!1,tr=null,Cl={onError:function(e){Ln=!0,er=e}};function _(e,t,n,r,l,a,i,c,g){Ln=!1,er=null,Ha.apply(Cl,arguments)}function O(e,t,n,r,l,a,i,c,g){if(_.apply(this,arguments),Ln){if(Ln){var w=er;Ln=!1,er=null}else throw Error(o(198));Rn||(Rn=!0,tr=w)}}function V(e){var t=e,n=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,(t.flags&4098)!==0&&(n=t.return),e=t.return;while(e)}return t.tag===3?n:null}function ce(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function ve(e){if(V(e)!==e)throw Error(o(188))}function se(e){var t=e.alternate;if(!t){if(t=V(e),t===null)throw Error(o(188));return t!==e?null:e}for(var n=e,r=t;;){var l=n.return;if(l===null)break;var a=l.alternate;if(a===null){if(r=l.return,r!==null){n=r;continue}break}if(l.child===a.child){for(a=l.child;a;){if(a===n)return ve(l),e;if(a===r)return ve(l),t;a=a.sibling}throw Error(o(188))}if(n.return!==r.return)n=l,r=a;else{for(var i=!1,c=l.child;c;){if(c===n){i=!0,n=l,r=a;break}if(c===r){i=!0,r=l,n=a;break}c=c.sibling}if(!i){for(c=a.child;c;){if(c===n){i=!0,n=a,r=l;break}if(c===r){i=!0,r=a,n=l;break}c=c.sibling}if(!i)throw Error(o(189))}}if(n.alternate!==r)throw Error(o(190))}if(n.tag!==3)throw Error(o(188));return n.stateNode.current===n?e:t}function Ce(e){return e=se(e),e!==null?Te(e):null}function Te(e){if(e.tag===5||e.tag===6)return e;for(e=e.child;e!==null;){var t=Te(e);if(t!==null)return t;e=e.sibling}return null}var Re=u.unstable_scheduleCallback,yt=u.unstable_cancelCallback,hp=u.unstable_shouldYield,xp=u.unstable_requestPaint,Fe=u.unstable_now,vp=u.unstable_getCurrentPriorityLevel,Wa=u.unstable_ImmediatePriority,ri=u.unstable_UserBlockingPriority,Al=u.unstable_NormalPriority,yp=u.unstable_LowPriority,li=u.unstable_IdlePriority,Nl=null,$t=null;function _p(e){if($t&&typeof $t.onCommitFiberRoot=="function")try{$t.onCommitFiberRoot(Nl,e,void 0,(e.current.flags&128)===128)}catch{}}var At=Math.clz32?Math.clz32:bp,wp=Math.log,kp=Math.LN2;function bp(e){return e>>>=0,e===0?32:31-(wp(e)/kp|0)|0}var Tl=64,Pl=4194304;function Rr(e){switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return e&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return e}}function jl(e,t){var n=e.pendingLanes;if(n===0)return 0;var r=0,l=e.suspendedLanes,a=e.pingedLanes,i=n&268435455;if(i!==0){var c=i&~l;c!==0?r=Rr(c):(a&=i,a!==0&&(r=Rr(a)))}else i=n&~l,i!==0?r=Rr(i):a!==0&&(r=Rr(a));if(r===0)return 0;if(t!==0&&t!==r&&(t&l)===0&&(l=r&-r,a=t&-t,l>=a||l===16&&(a&4194240)!==0))return t;if((r&4)!==0&&(r|=n&16),t=e.entangledLanes,t!==0)for(e=e.entanglements,t&=r;0<t;)n=31-At(t),l=1<<n,r|=e[n],t&=~l;return r}function Sp(e,t){switch(e){case 1:case 2:case 4:return t+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Ep(e,t){for(var n=e.suspendedLanes,r=e.pingedLanes,l=e.expirationTimes,a=e.pendingLanes;0<a;){var i=31-At(a),c=1<<i,g=l[i];g===-1?((c&n)===0||(c&r)!==0)&&(l[i]=Sp(c,t)):g<=t&&(e.expiredLanes|=c),a&=~c}}function Ka(e){return e=e.pendingLanes&-1073741825,e!==0?e:e&1073741824?1073741824:0}function ai(){var e=Tl;return Tl<<=1,(Tl&4194240)===0&&(Tl=64),e}function Ya(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function Dr(e,t,n){e.pendingLanes|=t,t!==536870912&&(e.suspendedLanes=0,e.pingedLanes=0),e=e.eventTimes,t=31-At(t),e[t]=n}function Cp(e,t){var n=e.pendingLanes&~t;e.pendingLanes=t,e.suspendedLanes=0,e.pingedLanes=0,e.expiredLanes&=t,e.mutableReadLanes&=t,e.entangledLanes&=t,t=e.entanglements;var r=e.eventTimes;for(e=e.expirationTimes;0<n;){var l=31-At(n),a=1<<l;t[l]=0,r[l]=-1,e[l]=-1,n&=~a}}function Qa(e,t){var n=e.entangledLanes|=t;for(e=e.entanglements;n;){var r=31-At(n),l=1<<r;l&t|e[r]&t&&(e[r]|=t),n&=~l}}var be=0;function oi(e){return e&=-e,1<e?4<e?(e&268435455)!==0?16:536870912:4:1}var si,Ja,ii,ui,ci,Ga=!1,Ml=[],pn=null,fn=null,gn=null,Ir=new Map,Or=new Map,mn=[],Ap="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function di(e,t){switch(e){case"focusin":case"focusout":pn=null;break;case"dragenter":case"dragleave":fn=null;break;case"mouseover":case"mouseout":gn=null;break;case"pointerover":case"pointerout":Ir.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":Or.delete(t.pointerId)}}function $r(e,t,n,r,l,a){return e===null||e.nativeEvent!==a?(e={blockedOn:t,domEventName:n,eventSystemFlags:r,nativeEvent:a,targetContainers:[l]},t!==null&&(t=Zr(t),t!==null&&Ja(t)),e):(e.eventSystemFlags|=r,t=e.targetContainers,l!==null&&t.indexOf(l)===-1&&t.push(l),e)}function Np(e,t,n,r,l){switch(t){case"focusin":return pn=$r(pn,e,t,n,r,l),!0;case"dragenter":return fn=$r(fn,e,t,n,r,l),!0;case"mouseover":return gn=$r(gn,e,t,n,r,l),!0;case"pointerover":var a=l.pointerId;return Ir.set(a,$r(Ir.get(a)||null,e,t,n,r,l)),!0;case"gotpointercapture":return a=l.pointerId,Or.set(a,$r(Or.get(a)||null,e,t,n,r,l)),!0}return!1}function pi(e){var t=Dn(e.target);if(t!==null){var n=V(t);if(n!==null){if(t=n.tag,t===13){if(t=ce(n),t!==null){e.blockedOn=t,ci(e.priority,function(){ii(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}e.blockedOn=null}function zl(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var n=Xa(e.domEventName,e.eventSystemFlags,t[0],e.nativeEvent);if(n===null){n=e.nativeEvent;var r=new n.constructor(n.type,n);Ct=r,n.target.dispatchEvent(r),Ct=null}else return t=Zr(n),t!==null&&Ja(t),e.blockedOn=n,!1;t.shift()}return!0}function fi(e,t,n){zl(e)&&n.delete(t)}function Tp(){Ga=!1,pn!==null&&zl(pn)&&(pn=null),fn!==null&&zl(fn)&&(fn=null),gn!==null&&zl(gn)&&(gn=null),Ir.forEach(fi),Or.forEach(fi)}function Fr(e,t){e.blockedOn===t&&(e.blockedOn=null,Ga||(Ga=!0,u.unstable_scheduleCallback(u.unstable_NormalPriority,Tp)))}function Ur(e){function t(l){return Fr(l,e)}if(0<Ml.length){Fr(Ml[0],e);for(var n=1;n<Ml.length;n++){var r=Ml[n];r.blockedOn===e&&(r.blockedOn=null)}}for(pn!==null&&Fr(pn,e),fn!==null&&Fr(fn,e),gn!==null&&Fr(gn,e),Ir.forEach(t),Or.forEach(t),n=0;n<mn.length;n++)r=mn[n],r.blockedOn===e&&(r.blockedOn=null);for(;0<mn.length&&(n=mn[0],n.blockedOn===null);)pi(n),n.blockedOn===null&&mn.shift()}var nr=_e.ReactCurrentBatchConfig,Ll=!0;function Pp(e,t,n,r){var l=be,a=nr.transition;nr.transition=null;try{be=1,qa(e,t,n,r)}finally{be=l,nr.transition=a}}function jp(e,t,n,r){var l=be,a=nr.transition;nr.transition=null;try{be=4,qa(e,t,n,r)}finally{be=l,nr.transition=a}}function qa(e,t,n,r){if(Ll){var l=Xa(e,t,n,r);if(l===null)ho(e,t,r,Rl,n),di(e,r);else if(Np(l,e,t,n,r))r.stopPropagation();else if(di(e,r),t&4&&-1<Ap.indexOf(e)){for(;l!==null;){var a=Zr(l);if(a!==null&&si(a),a=Xa(e,t,n,r),a===null&&ho(e,t,r,Rl,n),a===l)break;l=a}l!==null&&r.stopPropagation()}else ho(e,t,r,null,n)}}var Rl=null;function Xa(e,t,n,r){if(Rl=null,e=sn(r),e=Dn(e),e!==null)if(t=V(e),t===null)e=null;else if(n=t.tag,n===13){if(e=ce(t),e!==null)return e;e=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null);return Rl=e,null}function gi(e){switch(e){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(vp()){case Wa:return 1;case ri:return 4;case Al:case yp:return 16;case li:return 536870912;default:return 16}default:return 16}}var hn=null,Za=null,Dl=null;function mi(){if(Dl)return Dl;var e,t=Za,n=t.length,r,l="value"in hn?hn.value:hn.textContent,a=l.length;for(e=0;e<n&&t[e]===l[e];e++);var i=n-e;for(r=1;r<=i&&t[n-r]===l[a-r];r++);return Dl=l.slice(e,1<r?1-r:void 0)}function Il(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function Ol(){return!0}function hi(){return!1}function gt(e){function t(n,r,l,a,i){this._reactName=n,this._targetInst=l,this.type=r,this.nativeEvent=a,this.target=i,this.currentTarget=null;for(var c in e)e.hasOwnProperty(c)&&(n=e[c],this[c]=n?n(a):a[c]);return this.isDefaultPrevented=(a.defaultPrevented!=null?a.defaultPrevented:a.returnValue===!1)?Ol:hi,this.isPropagationStopped=hi,this}return D(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=Ol)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=Ol)},persist:function(){},isPersistent:Ol}),t}var rr={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},eo=gt(rr),Br=D({},rr,{view:0,detail:0}),Mp=gt(Br),to,no,Vr,$l=D({},Br,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:lo,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==Vr&&(Vr&&e.type==="mousemove"?(to=e.screenX-Vr.screenX,no=e.screenY-Vr.screenY):no=to=0,Vr=e),to)},movementY:function(e){return"movementY"in e?e.movementY:no}}),xi=gt($l),zp=D({},$l,{dataTransfer:0}),Lp=gt(zp),Rp=D({},Br,{relatedTarget:0}),ro=gt(Rp),Dp=D({},rr,{animationName:0,elapsedTime:0,pseudoElement:0}),Ip=gt(Dp),Op=D({},rr,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),$p=gt(Op),Fp=D({},rr,{data:0}),vi=gt(Fp),Up={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Bp={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Vp={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Hp(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=Vp[e])?!!t[e]:!1}function lo(){return Hp}var Wp=D({},Br,{key:function(e){if(e.key){var t=Up[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=Il(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?Bp[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:lo,charCode:function(e){return e.type==="keypress"?Il(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?Il(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),Kp=gt(Wp),Yp=D({},$l,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),yi=gt(Yp),Qp=D({},Br,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:lo}),Jp=gt(Qp),Gp=D({},rr,{propertyName:0,elapsedTime:0,pseudoElement:0}),qp=gt(Gp),Xp=D({},$l,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),Zp=gt(Xp),ef=[9,13,27,32],ao=S&&"CompositionEvent"in window,Hr=null;S&&"documentMode"in document&&(Hr=document.documentMode);var tf=S&&"TextEvent"in window&&!Hr,_i=S&&(!ao||Hr&&8<Hr&&11>=Hr),wi=" ",ki=!1;function bi(e,t){switch(e){case"keyup":return ef.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Si(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var lr=!1;function nf(e,t){switch(e){case"compositionend":return Si(t);case"keypress":return t.which!==32?null:(ki=!0,wi);case"textInput":return e=t.data,e===wi&&ki?null:e;default:return null}}function rf(e,t){if(lr)return e==="compositionend"||!ao&&bi(e,t)?(e=mi(),Dl=Za=hn=null,lr=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return _i&&t.locale!=="ko"?null:t.data;default:return null}}var lf={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Ei(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!lf[e.type]:t==="textarea"}function Ci(e,t,n,r){jr(r),t=Hl(t,"onChange"),0<t.length&&(n=new eo("onChange","change",null,n,r),e.push({event:n,listeners:t}))}var Wr=null,Kr=null;function af(e){Hi(e,0)}function Fl(e){var t=ur(e);if(qe(t))return e}function of(e,t){if(e==="change")return t}var Ai=!1;if(S){var oo;if(S){var so="oninput"in document;if(!so){var Ni=document.createElement("div");Ni.setAttribute("oninput","return;"),so=typeof Ni.oninput=="function"}oo=so}else oo=!1;Ai=oo&&(!document.documentMode||9<document.documentMode)}function Ti(){Wr&&(Wr.detachEvent("onpropertychange",Pi),Kr=Wr=null)}function Pi(e){if(e.propertyName==="value"&&Fl(Kr)){var t=[];Ci(t,Kr,e,sn(e)),El(af,t)}}function sf(e,t,n){e==="focusin"?(Ti(),Wr=t,Kr=n,Wr.attachEvent("onpropertychange",Pi)):e==="focusout"&&Ti()}function uf(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return Fl(Kr)}function cf(e,t){if(e==="click")return Fl(t)}function df(e,t){if(e==="input"||e==="change")return Fl(t)}function pf(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var Nt=typeof Object.is=="function"?Object.is:pf;function Yr(e,t){if(Nt(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var n=Object.keys(e),r=Object.keys(t);if(n.length!==r.length)return!1;for(r=0;r<n.length;r++){var l=n[r];if(!k.call(t,l)||!Nt(e[l],t[l]))return!1}return!0}function ji(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function Mi(e,t){var n=ji(e);e=0;for(var r;n;){if(n.nodeType===3){if(r=e+n.textContent.length,e<=t&&r>=t)return{node:n,offset:t-e};e=r}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=ji(n)}}function zi(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?zi(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function Li(){for(var e=window,t=ln();t instanceof e.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href=="string"}catch{n=!1}if(n)e=t.contentWindow;else break;t=ln(e.document)}return t}function io(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}function ff(e){var t=Li(),n=e.focusedElem,r=e.selectionRange;if(t!==n&&n&&n.ownerDocument&&zi(n.ownerDocument.documentElement,n)){if(r!==null&&io(n)){if(t=r.start,e=r.end,e===void 0&&(e=t),"selectionStart"in n)n.selectionStart=t,n.selectionEnd=Math.min(e,n.value.length);else if(e=(t=n.ownerDocument||document)&&t.defaultView||window,e.getSelection){e=e.getSelection();var l=n.textContent.length,a=Math.min(r.start,l);r=r.end===void 0?a:Math.min(r.end,l),!e.extend&&a>r&&(l=r,r=a,a=l),l=Mi(n,a);var i=Mi(n,r);l&&i&&(e.rangeCount!==1||e.anchorNode!==l.node||e.anchorOffset!==l.offset||e.focusNode!==i.node||e.focusOffset!==i.offset)&&(t=t.createRange(),t.setStart(l.node,l.offset),e.removeAllRanges(),a>r?(e.addRange(t),e.extend(i.node,i.offset)):(t.setEnd(i.node,i.offset),e.addRange(t)))}}for(t=[],e=n;e=e.parentNode;)e.nodeType===1&&t.push({element:e,left:e.scrollLeft,top:e.scrollTop});for(typeof n.focus=="function"&&n.focus(),n=0;n<t.length;n++)e=t[n],e.element.scrollLeft=e.left,e.element.scrollTop=e.top}}var gf=S&&"documentMode"in document&&11>=document.documentMode,ar=null,uo=null,Qr=null,co=!1;function Ri(e,t,n){var r=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;co||ar==null||ar!==ln(r)||(r=ar,"selectionStart"in r&&io(r)?r={start:r.selectionStart,end:r.selectionEnd}:(r=(r.ownerDocument&&r.ownerDocument.defaultView||window).getSelection(),r={anchorNode:r.anchorNode,anchorOffset:r.anchorOffset,focusNode:r.focusNode,focusOffset:r.focusOffset}),Qr&&Yr(Qr,r)||(Qr=r,r=Hl(uo,"onSelect"),0<r.length&&(t=new eo("onSelect","select",null,t,n),e.push({event:t,listeners:r}),t.target=ar)))}function Ul(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n["Webkit"+e]="webkit"+t,n["Moz"+e]="moz"+t,n}var or={animationend:Ul("Animation","AnimationEnd"),animationiteration:Ul("Animation","AnimationIteration"),animationstart:Ul("Animation","AnimationStart"),transitionend:Ul("Transition","TransitionEnd")},po={},Di={};S&&(Di=document.createElement("div").style,"AnimationEvent"in window||(delete or.animationend.animation,delete or.animationiteration.animation,delete or.animationstart.animation),"TransitionEvent"in window||delete or.transitionend.transition);function Bl(e){if(po[e])return po[e];if(!or[e])return e;var t=or[e],n;for(n in t)if(t.hasOwnProperty(n)&&n in Di)return po[e]=t[n];return e}var Ii=Bl("animationend"),Oi=Bl("animationiteration"),$i=Bl("animationstart"),Fi=Bl("transitionend"),Ui=new Map,Bi="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function xn(e,t){Ui.set(e,t),m(t,[e])}for(var fo=0;fo<Bi.length;fo++){var go=Bi[fo],mf=go.toLowerCase(),hf=go[0].toUpperCase()+go.slice(1);xn(mf,"on"+hf)}xn(Ii,"onAnimationEnd"),xn(Oi,"onAnimationIteration"),xn($i,"onAnimationStart"),xn("dblclick","onDoubleClick"),xn("focusin","onFocus"),xn("focusout","onBlur"),xn(Fi,"onTransitionEnd"),A("onMouseEnter",["mouseout","mouseover"]),A("onMouseLeave",["mouseout","mouseover"]),A("onPointerEnter",["pointerout","pointerover"]),A("onPointerLeave",["pointerout","pointerover"]),m("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),m("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),m("onBeforeInput",["compositionend","keypress","textInput","paste"]),m("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),m("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),m("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Jr="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),xf=new Set("cancel close invalid load scroll toggle".split(" ").concat(Jr));function Vi(e,t,n){var r=e.type||"unknown-event";e.currentTarget=n,O(r,t,void 0,e),e.currentTarget=null}function Hi(e,t){t=(t&4)!==0;for(var n=0;n<e.length;n++){var r=e[n],l=r.event;r=r.listeners;e:{var a=void 0;if(t)for(var i=r.length-1;0<=i;i--){var c=r[i],g=c.instance,w=c.currentTarget;if(c=c.listener,g!==a&&l.isPropagationStopped())break e;Vi(l,c,w),a=g}else for(i=0;i<r.length;i++){if(c=r[i],g=c.instance,w=c.currentTarget,c=c.listener,g!==a&&l.isPropagationStopped())break e;Vi(l,c,w),a=g}}}if(Rn)throw e=tr,Rn=!1,tr=null,e}function Me(e,t){var n=t[ko];n===void 0&&(n=t[ko]=new Set);var r=e+"__bubble";n.has(r)||(Wi(t,e,2,!1),n.add(r))}function mo(e,t,n){var r=0;t&&(r|=4),Wi(n,e,r,t)}var Vl="_reactListening"+Math.random().toString(36).slice(2);function Gr(e){if(!e[Vl]){e[Vl]=!0,d.forEach(function(n){n!=="selectionchange"&&(xf.has(n)||mo(n,!1,e),mo(n,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[Vl]||(t[Vl]=!0,mo("selectionchange",!1,t))}}function Wi(e,t,n,r){switch(gi(t)){case 1:var l=Pp;break;case 4:l=jp;break;default:l=qa}n=l.bind(null,t,n,e),l=void 0,!Lr||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(l=!0),r?l!==void 0?e.addEventListener(t,n,{capture:!0,passive:l}):e.addEventListener(t,n,!0):l!==void 0?e.addEventListener(t,n,{passive:l}):e.addEventListener(t,n,!1)}function ho(e,t,n,r,l){var a=r;if((t&1)===0&&(t&2)===0&&r!==null)e:for(;;){if(r===null)return;var i=r.tag;if(i===3||i===4){var c=r.stateNode.containerInfo;if(c===l||c.nodeType===8&&c.parentNode===l)break;if(i===4)for(i=r.return;i!==null;){var g=i.tag;if((g===3||g===4)&&(g=i.stateNode.containerInfo,g===l||g.nodeType===8&&g.parentNode===l))return;i=i.return}for(;c!==null;){if(i=Dn(c),i===null)return;if(g=i.tag,g===5||g===6){r=a=i;continue e}c=c.parentNode}}r=r.return}El(function(){var w=a,M=sn(n),z=[];e:{var j=Ui.get(e);if(j!==void 0){var H=eo,K=e;switch(e){case"keypress":if(Il(n)===0)break e;case"keydown":case"keyup":H=Kp;break;case"focusin":K="focus",H=ro;break;case"focusout":K="blur",H=ro;break;case"beforeblur":case"afterblur":H=ro;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":H=xi;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":H=Lp;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":H=Jp;break;case Ii:case Oi:case $i:H=Ip;break;case Fi:H=qp;break;case"scroll":H=Mp;break;case"wheel":H=Zp;break;case"copy":case"cut":case"paste":H=$p;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":H=yi}var Q=(t&4)!==0,Ue=!Q&&e==="scroll",v=Q?j!==null?j+"Capture":null:j;Q=[];for(var h=w,y;h!==null;){y=h;var I=y.stateNode;if(y.tag===5&&I!==null&&(y=I,v!==null&&(I=dn(h,v),I!=null&&Q.push(qr(h,I,y)))),Ue)break;h=h.return}0<Q.length&&(j=new H(j,K,null,n,M),z.push({event:j,listeners:Q}))}}if((t&7)===0){e:{if(j=e==="mouseover"||e==="pointerover",H=e==="mouseout"||e==="pointerout",j&&n!==Ct&&(K=n.relatedTarget||n.fromElement)&&(Dn(K)||K[Qt]))break e;if((H||j)&&(j=M.window===M?M:(j=M.ownerDocument)?j.defaultView||j.parentWindow:window,H?(K=n.relatedTarget||n.toElement,H=w,K=K?Dn(K):null,K!==null&&(Ue=V(K),K!==Ue||K.tag!==5&&K.tag!==6)&&(K=null)):(H=null,K=w),H!==K)){if(Q=xi,I="onMouseLeave",v="onMouseEnter",h="mouse",(e==="pointerout"||e==="pointerover")&&(Q=yi,I="onPointerLeave",v="onPointerEnter",h="pointer"),Ue=H==null?j:ur(H),y=K==null?j:ur(K),j=new Q(I,h+"leave",H,n,M),j.target=Ue,j.relatedTarget=y,I=null,Dn(M)===w&&(Q=new Q(v,h+"enter",K,n,M),Q.target=y,Q.relatedTarget=Ue,I=Q),Ue=I,H&&K)t:{for(Q=H,v=K,h=0,y=Q;y;y=sr(y))h++;for(y=0,I=v;I;I=sr(I))y++;for(;0<h-y;)Q=sr(Q),h--;for(;0<y-h;)v=sr(v),y--;for(;h--;){if(Q===v||v!==null&&Q===v.alternate)break t;Q=sr(Q),v=sr(v)}Q=null}else Q=null;H!==null&&Ki(z,j,H,Q,!1),K!==null&&Ue!==null&&Ki(z,Ue,K,Q,!0)}}e:{if(j=w?ur(w):window,H=j.nodeName&&j.nodeName.toLowerCase(),H==="select"||H==="input"&&j.type==="file")var J=of;else if(Ei(j))if(Ai)J=df;else{J=uf;var X=sf}else(H=j.nodeName)&&H.toLowerCase()==="input"&&(j.type==="checkbox"||j.type==="radio")&&(J=cf);if(J&&(J=J(e,w))){Ci(z,J,n,M);break e}X&&X(e,j,w),e==="focusout"&&(X=j._wrapperState)&&X.controlled&&j.type==="number"&&Ar(j,"number",j.value)}switch(X=w?ur(w):window,e){case"focusin":(Ei(X)||X.contentEditable==="true")&&(ar=X,uo=w,Qr=null);break;case"focusout":Qr=uo=ar=null;break;case"mousedown":co=!0;break;case"contextmenu":case"mouseup":case"dragend":co=!1,Ri(z,n,M);break;case"selectionchange":if(gf)break;case"keydown":case"keyup":Ri(z,n,M)}var Z;if(ao)e:{switch(e){case"compositionstart":var ae="onCompositionStart";break e;case"compositionend":ae="onCompositionEnd";break e;case"compositionupdate":ae="onCompositionUpdate";break e}ae=void 0}else lr?bi(e,n)&&(ae="onCompositionEnd"):e==="keydown"&&n.keyCode===229&&(ae="onCompositionStart");ae&&(_i&&n.locale!=="ko"&&(lr||ae!=="onCompositionStart"?ae==="onCompositionEnd"&&lr&&(Z=mi()):(hn=M,Za="value"in hn?hn.value:hn.textContent,lr=!0)),X=Hl(w,ae),0<X.length&&(ae=new vi(ae,e,null,n,M),z.push({event:ae,listeners:X}),Z?ae.data=Z:(Z=Si(n),Z!==null&&(ae.data=Z)))),(Z=tf?nf(e,n):rf(e,n))&&(w=Hl(w,"onBeforeInput"),0<w.length&&(M=new vi("onBeforeInput","beforeinput",null,n,M),z.push({event:M,listeners:w}),M.data=Z))}Hi(z,t)})}function qr(e,t,n){return{instance:e,listener:t,currentTarget:n}}function Hl(e,t){for(var n=t+"Capture",r=[];e!==null;){var l=e,a=l.stateNode;l.tag===5&&a!==null&&(l=a,a=dn(e,n),a!=null&&r.unshift(qr(e,a,l)),a=dn(e,t),a!=null&&r.push(qr(e,a,l))),e=e.return}return r}function sr(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5);return e||null}function Ki(e,t,n,r,l){for(var a=t._reactName,i=[];n!==null&&n!==r;){var c=n,g=c.alternate,w=c.stateNode;if(g!==null&&g===r)break;c.tag===5&&w!==null&&(c=w,l?(g=dn(n,a),g!=null&&i.unshift(qr(n,g,c))):l||(g=dn(n,a),g!=null&&i.push(qr(n,g,c)))),n=n.return}i.length!==0&&e.push({event:t,listeners:i})}var vf=/\r\n?/g,yf=/\u0000|\uFFFD/g;function Yi(e){return(typeof e=="string"?e:""+e).replace(vf,`
`).replace(yf,"")}function Wl(e,t,n){if(t=Yi(t),Yi(e)!==t&&n)throw Error(o(425))}function Kl(){}var xo=null,vo=null;function yo(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var _o=typeof setTimeout=="function"?setTimeout:void 0,_f=typeof clearTimeout=="function"?clearTimeout:void 0,Qi=typeof Promise=="function"?Promise:void 0,wf=typeof queueMicrotask=="function"?queueMicrotask:typeof Qi<"u"?function(e){return Qi.resolve(null).then(e).catch(kf)}:_o;function kf(e){setTimeout(function(){throw e})}function wo(e,t){var n=t,r=0;do{var l=n.nextSibling;if(e.removeChild(n),l&&l.nodeType===8)if(n=l.data,n==="/$"){if(r===0){e.removeChild(l),Ur(t);return}r--}else n!=="$"&&n!=="$?"&&n!=="$!"||r++;n=l}while(n);Ur(t)}function vn(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?")break;if(t==="/$")return null}}return e}function Ji(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="$"||n==="$!"||n==="$?"){if(t===0)return e;t--}else n==="/$"&&t++}e=e.previousSibling}return null}var ir=Math.random().toString(36).slice(2),Ft="__reactFiber$"+ir,Xr="__reactProps$"+ir,Qt="__reactContainer$"+ir,ko="__reactEvents$"+ir,bf="__reactListeners$"+ir,Sf="__reactHandles$"+ir;function Dn(e){var t=e[Ft];if(t)return t;for(var n=e.parentNode;n;){if(t=n[Qt]||n[Ft]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(e=Ji(e);e!==null;){if(n=e[Ft])return n;e=Ji(e)}return t}e=n,n=e.parentNode}return null}function Zr(e){return e=e[Ft]||e[Qt],!e||e.tag!==5&&e.tag!==6&&e.tag!==13&&e.tag!==3?null:e}function ur(e){if(e.tag===5||e.tag===6)return e.stateNode;throw Error(o(33))}function Yl(e){return e[Xr]||null}var bo=[],cr=-1;function yn(e){return{current:e}}function ze(e){0>cr||(e.current=bo[cr],bo[cr]=null,cr--)}function je(e,t){cr++,bo[cr]=e.current,e.current=t}var _n={},Xe=yn(_n),it=yn(!1),In=_n;function dr(e,t){var n=e.type.contextTypes;if(!n)return _n;var r=e.stateNode;if(r&&r.__reactInternalMemoizedUnmaskedChildContext===t)return r.__reactInternalMemoizedMaskedChildContext;var l={},a;for(a in n)l[a]=t[a];return r&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=t,e.__reactInternalMemoizedMaskedChildContext=l),l}function ut(e){return e=e.childContextTypes,e!=null}function Ql(){ze(it),ze(Xe)}function Gi(e,t,n){if(Xe.current!==_n)throw Error(o(168));je(Xe,t),je(it,n)}function qi(e,t,n){var r=e.stateNode;if(t=t.childContextTypes,typeof r.getChildContext!="function")return n;r=r.getChildContext();for(var l in r)if(!(l in t))throw Error(o(108,le(e)||"Unknown",l));return D({},n,r)}function Jl(e){return e=(e=e.stateNode)&&e.__reactInternalMemoizedMergedChildContext||_n,In=Xe.current,je(Xe,e),je(it,it.current),!0}function Xi(e,t,n){var r=e.stateNode;if(!r)throw Error(o(169));n?(e=qi(e,t,In),r.__reactInternalMemoizedMergedChildContext=e,ze(it),ze(Xe),je(Xe,e)):ze(it),je(it,n)}var Jt=null,Gl=!1,So=!1;function Zi(e){Jt===null?Jt=[e]:Jt.push(e)}function Ef(e){Gl=!0,Zi(e)}function wn(){if(!So&&Jt!==null){So=!0;var e=0,t=be;try{var n=Jt;for(be=1;e<n.length;e++){var r=n[e];do r=r(!0);while(r!==null)}Jt=null,Gl=!1}catch(l){throw Jt!==null&&(Jt=Jt.slice(e+1)),Re(Wa,wn),l}finally{be=t,So=!1}}return null}var pr=[],fr=0,ql=null,Xl=0,_t=[],wt=0,On=null,Gt=1,qt="";function $n(e,t){pr[fr++]=Xl,pr[fr++]=ql,ql=e,Xl=t}function eu(e,t,n){_t[wt++]=Gt,_t[wt++]=qt,_t[wt++]=On,On=e;var r=Gt;e=qt;var l=32-At(r)-1;r&=~(1<<l),n+=1;var a=32-At(t)+l;if(30<a){var i=l-l%5;a=(r&(1<<i)-1).toString(32),r>>=i,l-=i,Gt=1<<32-At(t)+l|n<<l|r,qt=a+e}else Gt=1<<a|n<<l|r,qt=e}function Eo(e){e.return!==null&&($n(e,1),eu(e,1,0))}function Co(e){for(;e===ql;)ql=pr[--fr],pr[fr]=null,Xl=pr[--fr],pr[fr]=null;for(;e===On;)On=_t[--wt],_t[wt]=null,qt=_t[--wt],_t[wt]=null,Gt=_t[--wt],_t[wt]=null}var mt=null,ht=null,De=!1,Tt=null;function tu(e,t){var n=Et(5,null,null,0);n.elementType="DELETED",n.stateNode=t,n.return=e,t=e.deletions,t===null?(e.deletions=[n],e.flags|=16):t.push(n)}function nu(e,t){switch(e.tag){case 5:var n=e.type;return t=t.nodeType!==1||n.toLowerCase()!==t.nodeName.toLowerCase()?null:t,t!==null?(e.stateNode=t,mt=e,ht=vn(t.firstChild),!0):!1;case 6:return t=e.pendingProps===""||t.nodeType!==3?null:t,t!==null?(e.stateNode=t,mt=e,ht=null,!0):!1;case 13:return t=t.nodeType!==8?null:t,t!==null?(n=On!==null?{id:Gt,overflow:qt}:null,e.memoizedState={dehydrated:t,treeContext:n,retryLane:1073741824},n=Et(18,null,null,0),n.stateNode=t,n.return=e,e.child=n,mt=e,ht=null,!0):!1;default:return!1}}function Ao(e){return(e.mode&1)!==0&&(e.flags&128)===0}function No(e){if(De){var t=ht;if(t){var n=t;if(!nu(e,t)){if(Ao(e))throw Error(o(418));t=vn(n.nextSibling);var r=mt;t&&nu(e,t)?tu(r,n):(e.flags=e.flags&-4097|2,De=!1,mt=e)}}else{if(Ao(e))throw Error(o(418));e.flags=e.flags&-4097|2,De=!1,mt=e}}}function ru(e){for(e=e.return;e!==null&&e.tag!==5&&e.tag!==3&&e.tag!==13;)e=e.return;mt=e}function Zl(e){if(e!==mt)return!1;if(!De)return ru(e),De=!0,!1;var t;if((t=e.tag!==3)&&!(t=e.tag!==5)&&(t=e.type,t=t!=="head"&&t!=="body"&&!yo(e.type,e.memoizedProps)),t&&(t=ht)){if(Ao(e))throw lu(),Error(o(418));for(;t;)tu(e,t),t=vn(t.nextSibling)}if(ru(e),e.tag===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(o(317));e:{for(e=e.nextSibling,t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="/$"){if(t===0){ht=vn(e.nextSibling);break e}t--}else n!=="$"&&n!=="$!"&&n!=="$?"||t++}e=e.nextSibling}ht=null}}else ht=mt?vn(e.stateNode.nextSibling):null;return!0}function lu(){for(var e=ht;e;)e=vn(e.nextSibling)}function gr(){ht=mt=null,De=!1}function To(e){Tt===null?Tt=[e]:Tt.push(e)}var Cf=_e.ReactCurrentBatchConfig;function el(e,t,n){if(e=n.ref,e!==null&&typeof e!="function"&&typeof e!="object"){if(n._owner){if(n=n._owner,n){if(n.tag!==1)throw Error(o(309));var r=n.stateNode}if(!r)throw Error(o(147,e));var l=r,a=""+e;return t!==null&&t.ref!==null&&typeof t.ref=="function"&&t.ref._stringRef===a?t.ref:(t=function(i){var c=l.refs;i===null?delete c[a]:c[a]=i},t._stringRef=a,t)}if(typeof e!="string")throw Error(o(284));if(!n._owner)throw Error(o(290,e))}return e}function ea(e,t){throw e=Object.prototype.toString.call(t),Error(o(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e))}function au(e){var t=e._init;return t(e._payload)}function ou(e){function t(v,h){if(e){var y=v.deletions;y===null?(v.deletions=[h],v.flags|=16):y.push(h)}}function n(v,h){if(!e)return null;for(;h!==null;)t(v,h),h=h.sibling;return null}function r(v,h){for(v=new Map;h!==null;)h.key!==null?v.set(h.key,h):v.set(h.index,h),h=h.sibling;return v}function l(v,h){return v=Tn(v,h),v.index=0,v.sibling=null,v}function a(v,h,y){return v.index=y,e?(y=v.alternate,y!==null?(y=y.index,y<h?(v.flags|=2,h):y):(v.flags|=2,h)):(v.flags|=1048576,h)}function i(v){return e&&v.alternate===null&&(v.flags|=2),v}function c(v,h,y,I){return h===null||h.tag!==6?(h=_s(y,v.mode,I),h.return=v,h):(h=l(h,y),h.return=v,h)}function g(v,h,y,I){var J=y.type;return J===R?M(v,h,y.props.children,I,y.key):h!==null&&(h.elementType===J||typeof J=="object"&&J!==null&&J.$$typeof===Pe&&au(J)===h.type)?(I=l(h,y.props),I.ref=el(v,h,y),I.return=v,I):(I=Sa(y.type,y.key,y.props,null,v.mode,I),I.ref=el(v,h,y),I.return=v,I)}function w(v,h,y,I){return h===null||h.tag!==4||h.stateNode.containerInfo!==y.containerInfo||h.stateNode.implementation!==y.implementation?(h=ws(y,v.mode,I),h.return=v,h):(h=l(h,y.children||[]),h.return=v,h)}function M(v,h,y,I,J){return h===null||h.tag!==7?(h=Yn(y,v.mode,I,J),h.return=v,h):(h=l(h,y),h.return=v,h)}function z(v,h,y){if(typeof h=="string"&&h!==""||typeof h=="number")return h=_s(""+h,v.mode,y),h.return=v,h;if(typeof h=="object"&&h!==null){switch(h.$$typeof){case F:return y=Sa(h.type,h.key,h.props,null,v.mode,y),y.ref=el(v,null,h),y.return=v,y;case T:return h=ws(h,v.mode,y),h.return=v,h;case Pe:var I=h._init;return z(v,I(h._payload),y)}if(an(h)||G(h))return h=Yn(h,v.mode,y,null),h.return=v,h;ea(v,h)}return null}function j(v,h,y,I){var J=h!==null?h.key:null;if(typeof y=="string"&&y!==""||typeof y=="number")return J!==null?null:c(v,h,""+y,I);if(typeof y=="object"&&y!==null){switch(y.$$typeof){case F:return y.key===J?g(v,h,y,I):null;case T:return y.key===J?w(v,h,y,I):null;case Pe:return J=y._init,j(v,h,J(y._payload),I)}if(an(y)||G(y))return J!==null?null:M(v,h,y,I,null);ea(v,y)}return null}function H(v,h,y,I,J){if(typeof I=="string"&&I!==""||typeof I=="number")return v=v.get(y)||null,c(h,v,""+I,J);if(typeof I=="object"&&I!==null){switch(I.$$typeof){case F:return v=v.get(I.key===null?y:I.key)||null,g(h,v,I,J);case T:return v=v.get(I.key===null?y:I.key)||null,w(h,v,I,J);case Pe:var X=I._init;return H(v,h,y,X(I._payload),J)}if(an(I)||G(I))return v=v.get(y)||null,M(h,v,I,J,null);ea(h,I)}return null}function K(v,h,y,I){for(var J=null,X=null,Z=h,ae=h=0,Ye=null;Z!==null&&ae<y.length;ae++){Z.index>ae?(Ye=Z,Z=null):Ye=Z.sibling;var we=j(v,Z,y[ae],I);if(we===null){Z===null&&(Z=Ye);break}e&&Z&&we.alternate===null&&t(v,Z),h=a(we,h,ae),X===null?J=we:X.sibling=we,X=we,Z=Ye}if(ae===y.length)return n(v,Z),De&&$n(v,ae),J;if(Z===null){for(;ae<y.length;ae++)Z=z(v,y[ae],I),Z!==null&&(h=a(Z,h,ae),X===null?J=Z:X.sibling=Z,X=Z);return De&&$n(v,ae),J}for(Z=r(v,Z);ae<y.length;ae++)Ye=H(Z,v,ae,y[ae],I),Ye!==null&&(e&&Ye.alternate!==null&&Z.delete(Ye.key===null?ae:Ye.key),h=a(Ye,h,ae),X===null?J=Ye:X.sibling=Ye,X=Ye);return e&&Z.forEach(function(Pn){return t(v,Pn)}),De&&$n(v,ae),J}function Q(v,h,y,I){var J=G(y);if(typeof J!="function")throw Error(o(150));if(y=J.call(y),y==null)throw Error(o(151));for(var X=J=null,Z=h,ae=h=0,Ye=null,we=y.next();Z!==null&&!we.done;ae++,we=y.next()){Z.index>ae?(Ye=Z,Z=null):Ye=Z.sibling;var Pn=j(v,Z,we.value,I);if(Pn===null){Z===null&&(Z=Ye);break}e&&Z&&Pn.alternate===null&&t(v,Z),h=a(Pn,h,ae),X===null?J=Pn:X.sibling=Pn,X=Pn,Z=Ye}if(we.done)return n(v,Z),De&&$n(v,ae),J;if(Z===null){for(;!we.done;ae++,we=y.next())we=z(v,we.value,I),we!==null&&(h=a(we,h,ae),X===null?J=we:X.sibling=we,X=we);return De&&$n(v,ae),J}for(Z=r(v,Z);!we.done;ae++,we=y.next())we=H(Z,v,ae,we.value,I),we!==null&&(e&&we.alternate!==null&&Z.delete(we.key===null?ae:we.key),h=a(we,h,ae),X===null?J=we:X.sibling=we,X=we);return e&&Z.forEach(function(ag){return t(v,ag)}),De&&$n(v,ae),J}function Ue(v,h,y,I){if(typeof y=="object"&&y!==null&&y.type===R&&y.key===null&&(y=y.props.children),typeof y=="object"&&y!==null){switch(y.$$typeof){case F:e:{for(var J=y.key,X=h;X!==null;){if(X.key===J){if(J=y.type,J===R){if(X.tag===7){n(v,X.sibling),h=l(X,y.props.children),h.return=v,v=h;break e}}else if(X.elementType===J||typeof J=="object"&&J!==null&&J.$$typeof===Pe&&au(J)===X.type){n(v,X.sibling),h=l(X,y.props),h.ref=el(v,X,y),h.return=v,v=h;break e}n(v,X);break}else t(v,X);X=X.sibling}y.type===R?(h=Yn(y.props.children,v.mode,I,y.key),h.return=v,v=h):(I=Sa(y.type,y.key,y.props,null,v.mode,I),I.ref=el(v,h,y),I.return=v,v=I)}return i(v);case T:e:{for(X=y.key;h!==null;){if(h.key===X)if(h.tag===4&&h.stateNode.containerInfo===y.containerInfo&&h.stateNode.implementation===y.implementation){n(v,h.sibling),h=l(h,y.children||[]),h.return=v,v=h;break e}else{n(v,h);break}else t(v,h);h=h.sibling}h=ws(y,v.mode,I),h.return=v,v=h}return i(v);case Pe:return X=y._init,Ue(v,h,X(y._payload),I)}if(an(y))return K(v,h,y,I);if(G(y))return Q(v,h,y,I);ea(v,y)}return typeof y=="string"&&y!==""||typeof y=="number"?(y=""+y,h!==null&&h.tag===6?(n(v,h.sibling),h=l(h,y),h.return=v,v=h):(n(v,h),h=_s(y,v.mode,I),h.return=v,v=h),i(v)):n(v,h)}return Ue}var mr=ou(!0),su=ou(!1),ta=yn(null),na=null,hr=null,Po=null;function jo(){Po=hr=na=null}function Mo(e){var t=ta.current;ze(ta),e._currentValue=t}function zo(e,t,n){for(;e!==null;){var r=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,r!==null&&(r.childLanes|=t)):r!==null&&(r.childLanes&t)!==t&&(r.childLanes|=t),e===n)break;e=e.return}}function xr(e,t){na=e,Po=hr=null,e=e.dependencies,e!==null&&e.firstContext!==null&&((e.lanes&t)!==0&&(ct=!0),e.firstContext=null)}function kt(e){var t=e._currentValue;if(Po!==e)if(e={context:e,memoizedValue:t,next:null},hr===null){if(na===null)throw Error(o(308));hr=e,na.dependencies={lanes:0,firstContext:e}}else hr=hr.next=e;return t}var Fn=null;function Lo(e){Fn===null?Fn=[e]:Fn.push(e)}function iu(e,t,n,r){var l=t.interleaved;return l===null?(n.next=n,Lo(t)):(n.next=l.next,l.next=n),t.interleaved=n,Xt(e,r)}function Xt(e,t){e.lanes|=t;var n=e.alternate;for(n!==null&&(n.lanes|=t),n=e,e=e.return;e!==null;)e.childLanes|=t,n=e.alternate,n!==null&&(n.childLanes|=t),n=e,e=e.return;return n.tag===3?n.stateNode:null}var kn=!1;function Ro(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function uu(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,effects:e.effects})}function Zt(e,t){return{eventTime:e,lane:t,tag:0,payload:null,callback:null,next:null}}function bn(e,t,n){var r=e.updateQueue;if(r===null)return null;if(r=r.shared,(ye&2)!==0){var l=r.pending;return l===null?t.next=t:(t.next=l.next,l.next=t),r.pending=t,Xt(e,n)}return l=r.interleaved,l===null?(t.next=t,Lo(r)):(t.next=l.next,l.next=t),r.interleaved=t,Xt(e,n)}function ra(e,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,(n&4194240)!==0)){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,Qa(e,n)}}function cu(e,t){var n=e.updateQueue,r=e.alternate;if(r!==null&&(r=r.updateQueue,n===r)){var l=null,a=null;if(n=n.firstBaseUpdate,n!==null){do{var i={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};a===null?l=a=i:a=a.next=i,n=n.next}while(n!==null);a===null?l=a=t:a=a.next=t}else l=a=t;n={baseState:r.baseState,firstBaseUpdate:l,lastBaseUpdate:a,shared:r.shared,effects:r.effects},e.updateQueue=n;return}e=n.lastBaseUpdate,e===null?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}function la(e,t,n,r){var l=e.updateQueue;kn=!1;var a=l.firstBaseUpdate,i=l.lastBaseUpdate,c=l.shared.pending;if(c!==null){l.shared.pending=null;var g=c,w=g.next;g.next=null,i===null?a=w:i.next=w,i=g;var M=e.alternate;M!==null&&(M=M.updateQueue,c=M.lastBaseUpdate,c!==i&&(c===null?M.firstBaseUpdate=w:c.next=w,M.lastBaseUpdate=g))}if(a!==null){var z=l.baseState;i=0,M=w=g=null,c=a;do{var j=c.lane,H=c.eventTime;if((r&j)===j){M!==null&&(M=M.next={eventTime:H,lane:0,tag:c.tag,payload:c.payload,callback:c.callback,next:null});e:{var K=e,Q=c;switch(j=t,H=n,Q.tag){case 1:if(K=Q.payload,typeof K=="function"){z=K.call(H,z,j);break e}z=K;break e;case 3:K.flags=K.flags&-65537|128;case 0:if(K=Q.payload,j=typeof K=="function"?K.call(H,z,j):K,j==null)break e;z=D({},z,j);break e;case 2:kn=!0}}c.callback!==null&&c.lane!==0&&(e.flags|=64,j=l.effects,j===null?l.effects=[c]:j.push(c))}else H={eventTime:H,lane:j,tag:c.tag,payload:c.payload,callback:c.callback,next:null},M===null?(w=M=H,g=z):M=M.next=H,i|=j;if(c=c.next,c===null){if(c=l.shared.pending,c===null)break;j=c,c=j.next,j.next=null,l.lastBaseUpdate=j,l.shared.pending=null}}while(!0);if(M===null&&(g=z),l.baseState=g,l.firstBaseUpdate=w,l.lastBaseUpdate=M,t=l.shared.interleaved,t!==null){l=t;do i|=l.lane,l=l.next;while(l!==t)}else a===null&&(l.shared.lanes=0);Vn|=i,e.lanes=i,e.memoizedState=z}}function du(e,t,n){if(e=t.effects,t.effects=null,e!==null)for(t=0;t<e.length;t++){var r=e[t],l=r.callback;if(l!==null){if(r.callback=null,r=n,typeof l!="function")throw Error(o(191,l));l.call(r)}}}var tl={},Ut=yn(tl),nl=yn(tl),rl=yn(tl);function Un(e){if(e===tl)throw Error(o(174));return e}function Do(e,t){switch(je(rl,t),je(nl,e),je(Ut,tl),e=t.nodeType,e){case 9:case 11:t=(t=t.documentElement)?t.namespaceURI:Xn(null,"");break;default:e=e===8?t.parentNode:t,t=e.namespaceURI||null,e=e.tagName,t=Xn(t,e)}ze(Ut),je(Ut,t)}function vr(){ze(Ut),ze(nl),ze(rl)}function pu(e){Un(rl.current);var t=Un(Ut.current),n=Xn(t,e.type);t!==n&&(je(nl,e),je(Ut,n))}function Io(e){nl.current===e&&(ze(Ut),ze(nl))}var Ie=yn(0);function aa(e){for(var t=e;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||n.data==="$?"||n.data==="$!"))return t}else if(t.tag===19&&t.memoizedProps.revealOrder!==void 0){if((t.flags&128)!==0)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var Oo=[];function $o(){for(var e=0;e<Oo.length;e++)Oo[e]._workInProgressVersionPrimary=null;Oo.length=0}var oa=_e.ReactCurrentDispatcher,Fo=_e.ReactCurrentBatchConfig,Bn=0,Oe=null,Ve=null,We=null,sa=!1,ll=!1,al=0,Af=0;function Ze(){throw Error(o(321))}function Uo(e,t){if(t===null)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!Nt(e[n],t[n]))return!1;return!0}function Bo(e,t,n,r,l,a){if(Bn=a,Oe=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,oa.current=e===null||e.memoizedState===null?jf:Mf,e=n(r,l),ll){a=0;do{if(ll=!1,al=0,25<=a)throw Error(o(301));a+=1,We=Ve=null,t.updateQueue=null,oa.current=zf,e=n(r,l)}while(ll)}if(oa.current=ca,t=Ve!==null&&Ve.next!==null,Bn=0,We=Ve=Oe=null,sa=!1,t)throw Error(o(300));return e}function Vo(){var e=al!==0;return al=0,e}function Bt(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return We===null?Oe.memoizedState=We=e:We=We.next=e,We}function bt(){if(Ve===null){var e=Oe.alternate;e=e!==null?e.memoizedState:null}else e=Ve.next;var t=We===null?Oe.memoizedState:We.next;if(t!==null)We=t,Ve=e;else{if(e===null)throw Error(o(310));Ve=e,e={memoizedState:Ve.memoizedState,baseState:Ve.baseState,baseQueue:Ve.baseQueue,queue:Ve.queue,next:null},We===null?Oe.memoizedState=We=e:We=We.next=e}return We}function ol(e,t){return typeof t=="function"?t(e):t}function Ho(e){var t=bt(),n=t.queue;if(n===null)throw Error(o(311));n.lastRenderedReducer=e;var r=Ve,l=r.baseQueue,a=n.pending;if(a!==null){if(l!==null){var i=l.next;l.next=a.next,a.next=i}r.baseQueue=l=a,n.pending=null}if(l!==null){a=l.next,r=r.baseState;var c=i=null,g=null,w=a;do{var M=w.lane;if((Bn&M)===M)g!==null&&(g=g.next={lane:0,action:w.action,hasEagerState:w.hasEagerState,eagerState:w.eagerState,next:null}),r=w.hasEagerState?w.eagerState:e(r,w.action);else{var z={lane:M,action:w.action,hasEagerState:w.hasEagerState,eagerState:w.eagerState,next:null};g===null?(c=g=z,i=r):g=g.next=z,Oe.lanes|=M,Vn|=M}w=w.next}while(w!==null&&w!==a);g===null?i=r:g.next=c,Nt(r,t.memoizedState)||(ct=!0),t.memoizedState=r,t.baseState=i,t.baseQueue=g,n.lastRenderedState=r}if(e=n.interleaved,e!==null){l=e;do a=l.lane,Oe.lanes|=a,Vn|=a,l=l.next;while(l!==e)}else l===null&&(n.lanes=0);return[t.memoizedState,n.dispatch]}function Wo(e){var t=bt(),n=t.queue;if(n===null)throw Error(o(311));n.lastRenderedReducer=e;var r=n.dispatch,l=n.pending,a=t.memoizedState;if(l!==null){n.pending=null;var i=l=l.next;do a=e(a,i.action),i=i.next;while(i!==l);Nt(a,t.memoizedState)||(ct=!0),t.memoizedState=a,t.baseQueue===null&&(t.baseState=a),n.lastRenderedState=a}return[a,r]}function fu(){}function gu(e,t){var n=Oe,r=bt(),l=t(),a=!Nt(r.memoizedState,l);if(a&&(r.memoizedState=l,ct=!0),r=r.queue,Ko(xu.bind(null,n,r,e),[e]),r.getSnapshot!==t||a||We!==null&&We.memoizedState.tag&1){if(n.flags|=2048,sl(9,hu.bind(null,n,r,l,t),void 0,null),Ke===null)throw Error(o(349));(Bn&30)!==0||mu(n,t,l)}return l}function mu(e,t,n){e.flags|=16384,e={getSnapshot:t,value:n},t=Oe.updateQueue,t===null?(t={lastEffect:null,stores:null},Oe.updateQueue=t,t.stores=[e]):(n=t.stores,n===null?t.stores=[e]:n.push(e))}function hu(e,t,n,r){t.value=n,t.getSnapshot=r,vu(t)&&yu(e)}function xu(e,t,n){return n(function(){vu(t)&&yu(e)})}function vu(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!Nt(e,n)}catch{return!0}}function yu(e){var t=Xt(e,1);t!==null&&zt(t,e,1,-1)}function _u(e){var t=Bt();return typeof e=="function"&&(e=e()),t.memoizedState=t.baseState=e,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:ol,lastRenderedState:e},t.queue=e,e=e.dispatch=Pf.bind(null,Oe,e),[t.memoizedState,e]}function sl(e,t,n,r){return e={tag:e,create:t,destroy:n,deps:r,next:null},t=Oe.updateQueue,t===null?(t={lastEffect:null,stores:null},Oe.updateQueue=t,t.lastEffect=e.next=e):(n=t.lastEffect,n===null?t.lastEffect=e.next=e:(r=n.next,n.next=e,e.next=r,t.lastEffect=e)),e}function wu(){return bt().memoizedState}function ia(e,t,n,r){var l=Bt();Oe.flags|=e,l.memoizedState=sl(1|t,n,void 0,r===void 0?null:r)}function ua(e,t,n,r){var l=bt();r=r===void 0?null:r;var a=void 0;if(Ve!==null){var i=Ve.memoizedState;if(a=i.destroy,r!==null&&Uo(r,i.deps)){l.memoizedState=sl(t,n,a,r);return}}Oe.flags|=e,l.memoizedState=sl(1|t,n,a,r)}function ku(e,t){return ia(8390656,8,e,t)}function Ko(e,t){return ua(2048,8,e,t)}function bu(e,t){return ua(4,2,e,t)}function Su(e,t){return ua(4,4,e,t)}function Eu(e,t){if(typeof t=="function")return e=e(),t(e),function(){t(null)};if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function Cu(e,t,n){return n=n!=null?n.concat([e]):null,ua(4,4,Eu.bind(null,t,e),n)}function Yo(){}function Au(e,t){var n=bt();t=t===void 0?null:t;var r=n.memoizedState;return r!==null&&t!==null&&Uo(t,r[1])?r[0]:(n.memoizedState=[e,t],e)}function Nu(e,t){var n=bt();t=t===void 0?null:t;var r=n.memoizedState;return r!==null&&t!==null&&Uo(t,r[1])?r[0]:(e=e(),n.memoizedState=[e,t],e)}function Tu(e,t,n){return(Bn&21)===0?(e.baseState&&(e.baseState=!1,ct=!0),e.memoizedState=n):(Nt(n,t)||(n=ai(),Oe.lanes|=n,Vn|=n,e.baseState=!0),t)}function Nf(e,t){var n=be;be=n!==0&&4>n?n:4,e(!0);var r=Fo.transition;Fo.transition={};try{e(!1),t()}finally{be=n,Fo.transition=r}}function Pu(){return bt().memoizedState}function Tf(e,t,n){var r=An(e);if(n={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null},ju(e))Mu(t,n);else if(n=iu(e,t,n,r),n!==null){var l=at();zt(n,e,r,l),zu(n,t,r)}}function Pf(e,t,n){var r=An(e),l={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null};if(ju(e))Mu(t,l);else{var a=e.alternate;if(e.lanes===0&&(a===null||a.lanes===0)&&(a=t.lastRenderedReducer,a!==null))try{var i=t.lastRenderedState,c=a(i,n);if(l.hasEagerState=!0,l.eagerState=c,Nt(c,i)){var g=t.interleaved;g===null?(l.next=l,Lo(t)):(l.next=g.next,g.next=l),t.interleaved=l;return}}catch{}finally{}n=iu(e,t,l,r),n!==null&&(l=at(),zt(n,e,r,l),zu(n,t,r))}}function ju(e){var t=e.alternate;return e===Oe||t!==null&&t===Oe}function Mu(e,t){ll=sa=!0;var n=e.pending;n===null?t.next=t:(t.next=n.next,n.next=t),e.pending=t}function zu(e,t,n){if((n&4194240)!==0){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,Qa(e,n)}}var ca={readContext:kt,useCallback:Ze,useContext:Ze,useEffect:Ze,useImperativeHandle:Ze,useInsertionEffect:Ze,useLayoutEffect:Ze,useMemo:Ze,useReducer:Ze,useRef:Ze,useState:Ze,useDebugValue:Ze,useDeferredValue:Ze,useTransition:Ze,useMutableSource:Ze,useSyncExternalStore:Ze,useId:Ze,unstable_isNewReconciler:!1},jf={readContext:kt,useCallback:function(e,t){return Bt().memoizedState=[e,t===void 0?null:t],e},useContext:kt,useEffect:ku,useImperativeHandle:function(e,t,n){return n=n!=null?n.concat([e]):null,ia(4194308,4,Eu.bind(null,t,e),n)},useLayoutEffect:function(e,t){return ia(4194308,4,e,t)},useInsertionEffect:function(e,t){return ia(4,2,e,t)},useMemo:function(e,t){var n=Bt();return t=t===void 0?null:t,e=e(),n.memoizedState=[e,t],e},useReducer:function(e,t,n){var r=Bt();return t=n!==void 0?n(t):t,r.memoizedState=r.baseState=t,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:t},r.queue=e,e=e.dispatch=Tf.bind(null,Oe,e),[r.memoizedState,e]},useRef:function(e){var t=Bt();return e={current:e},t.memoizedState=e},useState:_u,useDebugValue:Yo,useDeferredValue:function(e){return Bt().memoizedState=e},useTransition:function(){var e=_u(!1),t=e[0];return e=Nf.bind(null,e[1]),Bt().memoizedState=e,[t,e]},useMutableSource:function(){},useSyncExternalStore:function(e,t,n){var r=Oe,l=Bt();if(De){if(n===void 0)throw Error(o(407));n=n()}else{if(n=t(),Ke===null)throw Error(o(349));(Bn&30)!==0||mu(r,t,n)}l.memoizedState=n;var a={value:n,getSnapshot:t};return l.queue=a,ku(xu.bind(null,r,a,e),[e]),r.flags|=2048,sl(9,hu.bind(null,r,a,n,t),void 0,null),n},useId:function(){var e=Bt(),t=Ke.identifierPrefix;if(De){var n=qt,r=Gt;n=(r&~(1<<32-At(r)-1)).toString(32)+n,t=":"+t+"R"+n,n=al++,0<n&&(t+="H"+n.toString(32)),t+=":"}else n=Af++,t=":"+t+"r"+n.toString(32)+":";return e.memoizedState=t},unstable_isNewReconciler:!1},Mf={readContext:kt,useCallback:Au,useContext:kt,useEffect:Ko,useImperativeHandle:Cu,useInsertionEffect:bu,useLayoutEffect:Su,useMemo:Nu,useReducer:Ho,useRef:wu,useState:function(){return Ho(ol)},useDebugValue:Yo,useDeferredValue:function(e){var t=bt();return Tu(t,Ve.memoizedState,e)},useTransition:function(){var e=Ho(ol)[0],t=bt().memoizedState;return[e,t]},useMutableSource:fu,useSyncExternalStore:gu,useId:Pu,unstable_isNewReconciler:!1},zf={readContext:kt,useCallback:Au,useContext:kt,useEffect:Ko,useImperativeHandle:Cu,useInsertionEffect:bu,useLayoutEffect:Su,useMemo:Nu,useReducer:Wo,useRef:wu,useState:function(){return Wo(ol)},useDebugValue:Yo,useDeferredValue:function(e){var t=bt();return Ve===null?t.memoizedState=e:Tu(t,Ve.memoizedState,e)},useTransition:function(){var e=Wo(ol)[0],t=bt().memoizedState;return[e,t]},useMutableSource:fu,useSyncExternalStore:gu,useId:Pu,unstable_isNewReconciler:!1};function Pt(e,t){if(e&&e.defaultProps){t=D({},t),e=e.defaultProps;for(var n in e)t[n]===void 0&&(t[n]=e[n]);return t}return t}function Qo(e,t,n,r){t=e.memoizedState,n=n(r,t),n=n==null?t:D({},t,n),e.memoizedState=n,e.lanes===0&&(e.updateQueue.baseState=n)}var da={isMounted:function(e){return(e=e._reactInternals)?V(e)===e:!1},enqueueSetState:function(e,t,n){e=e._reactInternals;var r=at(),l=An(e),a=Zt(r,l);a.payload=t,n!=null&&(a.callback=n),t=bn(e,a,l),t!==null&&(zt(t,e,l,r),ra(t,e,l))},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var r=at(),l=An(e),a=Zt(r,l);a.tag=1,a.payload=t,n!=null&&(a.callback=n),t=bn(e,a,l),t!==null&&(zt(t,e,l,r),ra(t,e,l))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=at(),r=An(e),l=Zt(n,r);l.tag=2,t!=null&&(l.callback=t),t=bn(e,l,r),t!==null&&(zt(t,e,r,n),ra(t,e,r))}};function Lu(e,t,n,r,l,a,i){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(r,a,i):t.prototype&&t.prototype.isPureReactComponent?!Yr(n,r)||!Yr(l,a):!0}function Ru(e,t,n){var r=!1,l=_n,a=t.contextType;return typeof a=="object"&&a!==null?a=kt(a):(l=ut(t)?In:Xe.current,r=t.contextTypes,a=(r=r!=null)?dr(e,l):_n),t=new t(n,a),e.memoizedState=t.state!==null&&t.state!==void 0?t.state:null,t.updater=da,e.stateNode=t,t._reactInternals=e,r&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=l,e.__reactInternalMemoizedMaskedChildContext=a),t}function Du(e,t,n,r){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(n,r),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(n,r),t.state!==e&&da.enqueueReplaceState(t,t.state,null)}function Jo(e,t,n,r){var l=e.stateNode;l.props=n,l.state=e.memoizedState,l.refs={},Ro(e);var a=t.contextType;typeof a=="object"&&a!==null?l.context=kt(a):(a=ut(t)?In:Xe.current,l.context=dr(e,a)),l.state=e.memoizedState,a=t.getDerivedStateFromProps,typeof a=="function"&&(Qo(e,t,a,n),l.state=e.memoizedState),typeof t.getDerivedStateFromProps=="function"||typeof l.getSnapshotBeforeUpdate=="function"||typeof l.UNSAFE_componentWillMount!="function"&&typeof l.componentWillMount!="function"||(t=l.state,typeof l.componentWillMount=="function"&&l.componentWillMount(),typeof l.UNSAFE_componentWillMount=="function"&&l.UNSAFE_componentWillMount(),t!==l.state&&da.enqueueReplaceState(l,l.state,null),la(e,n,l,r),l.state=e.memoizedState),typeof l.componentDidMount=="function"&&(e.flags|=4194308)}function yr(e,t){try{var n="",r=t;do n+=de(r),r=r.return;while(r);var l=n}catch(a){l=`
Error generating stack: `+a.message+`
`+a.stack}return{value:e,source:t,stack:l,digest:null}}function Go(e,t,n){return{value:e,source:null,stack:n??null,digest:t??null}}function qo(e,t){try{console.error(t.value)}catch(n){setTimeout(function(){throw n})}}var Lf=typeof WeakMap=="function"?WeakMap:Map;function Iu(e,t,n){n=Zt(-1,n),n.tag=3,n.payload={element:null};var r=t.value;return n.callback=function(){va||(va=!0,ps=r),qo(e,t)},n}function Ou(e,t,n){n=Zt(-1,n),n.tag=3;var r=e.type.getDerivedStateFromError;if(typeof r=="function"){var l=t.value;n.payload=function(){return r(l)},n.callback=function(){qo(e,t)}}var a=e.stateNode;return a!==null&&typeof a.componentDidCatch=="function"&&(n.callback=function(){qo(e,t),typeof r!="function"&&(En===null?En=new Set([this]):En.add(this));var i=t.stack;this.componentDidCatch(t.value,{componentStack:i!==null?i:""})}),n}function $u(e,t,n){var r=e.pingCache;if(r===null){r=e.pingCache=new Lf;var l=new Set;r.set(t,l)}else l=r.get(t),l===void 0&&(l=new Set,r.set(t,l));l.has(n)||(l.add(n),e=Qf.bind(null,e,t,n),t.then(e,e))}function Fu(e){do{var t;if((t=e.tag===13)&&(t=e.memoizedState,t=t!==null?t.dehydrated!==null:!0),t)return e;e=e.return}while(e!==null);return null}function Uu(e,t,n,r,l){return(e.mode&1)===0?(e===t?e.flags|=65536:(e.flags|=128,n.flags|=131072,n.flags&=-52805,n.tag===1&&(n.alternate===null?n.tag=17:(t=Zt(-1,1),t.tag=2,bn(n,t,1))),n.lanes|=1),e):(e.flags|=65536,e.lanes=l,e)}var Rf=_e.ReactCurrentOwner,ct=!1;function lt(e,t,n,r){t.child=e===null?su(t,null,n,r):mr(t,e.child,n,r)}function Bu(e,t,n,r,l){n=n.render;var a=t.ref;return xr(t,l),r=Bo(e,t,n,r,a,l),n=Vo(),e!==null&&!ct?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~l,en(e,t,l)):(De&&n&&Eo(t),t.flags|=1,lt(e,t,r,l),t.child)}function Vu(e,t,n,r,l){if(e===null){var a=n.type;return typeof a=="function"&&!ys(a)&&a.defaultProps===void 0&&n.compare===null&&n.defaultProps===void 0?(t.tag=15,t.type=a,Hu(e,t,a,r,l)):(e=Sa(n.type,null,r,t,t.mode,l),e.ref=t.ref,e.return=t,t.child=e)}if(a=e.child,(e.lanes&l)===0){var i=a.memoizedProps;if(n=n.compare,n=n!==null?n:Yr,n(i,r)&&e.ref===t.ref)return en(e,t,l)}return t.flags|=1,e=Tn(a,r),e.ref=t.ref,e.return=t,t.child=e}function Hu(e,t,n,r,l){if(e!==null){var a=e.memoizedProps;if(Yr(a,r)&&e.ref===t.ref)if(ct=!1,t.pendingProps=r=a,(e.lanes&l)!==0)(e.flags&131072)!==0&&(ct=!0);else return t.lanes=e.lanes,en(e,t,l)}return Xo(e,t,n,r,l)}function Wu(e,t,n){var r=t.pendingProps,l=r.children,a=e!==null?e.memoizedState:null;if(r.mode==="hidden")if((t.mode&1)===0)t.memoizedState={baseLanes:0,cachePool:null,transitions:null},je(wr,xt),xt|=n;else{if((n&1073741824)===0)return e=a!==null?a.baseLanes|n:n,t.lanes=t.childLanes=1073741824,t.memoizedState={baseLanes:e,cachePool:null,transitions:null},t.updateQueue=null,je(wr,xt),xt|=e,null;t.memoizedState={baseLanes:0,cachePool:null,transitions:null},r=a!==null?a.baseLanes:n,je(wr,xt),xt|=r}else a!==null?(r=a.baseLanes|n,t.memoizedState=null):r=n,je(wr,xt),xt|=r;return lt(e,t,l,n),t.child}function Ku(e,t){var n=t.ref;(e===null&&n!==null||e!==null&&e.ref!==n)&&(t.flags|=512,t.flags|=2097152)}function Xo(e,t,n,r,l){var a=ut(n)?In:Xe.current;return a=dr(t,a),xr(t,l),n=Bo(e,t,n,r,a,l),r=Vo(),e!==null&&!ct?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~l,en(e,t,l)):(De&&r&&Eo(t),t.flags|=1,lt(e,t,n,l),t.child)}function Yu(e,t,n,r,l){if(ut(n)){var a=!0;Jl(t)}else a=!1;if(xr(t,l),t.stateNode===null)fa(e,t),Ru(t,n,r),Jo(t,n,r,l),r=!0;else if(e===null){var i=t.stateNode,c=t.memoizedProps;i.props=c;var g=i.context,w=n.contextType;typeof w=="object"&&w!==null?w=kt(w):(w=ut(n)?In:Xe.current,w=dr(t,w));var M=n.getDerivedStateFromProps,z=typeof M=="function"||typeof i.getSnapshotBeforeUpdate=="function";z||typeof i.UNSAFE_componentWillReceiveProps!="function"&&typeof i.componentWillReceiveProps!="function"||(c!==r||g!==w)&&Du(t,i,r,w),kn=!1;var j=t.memoizedState;i.state=j,la(t,r,i,l),g=t.memoizedState,c!==r||j!==g||it.current||kn?(typeof M=="function"&&(Qo(t,n,M,r),g=t.memoizedState),(c=kn||Lu(t,n,c,r,j,g,w))?(z||typeof i.UNSAFE_componentWillMount!="function"&&typeof i.componentWillMount!="function"||(typeof i.componentWillMount=="function"&&i.componentWillMount(),typeof i.UNSAFE_componentWillMount=="function"&&i.UNSAFE_componentWillMount()),typeof i.componentDidMount=="function"&&(t.flags|=4194308)):(typeof i.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=r,t.memoizedState=g),i.props=r,i.state=g,i.context=w,r=c):(typeof i.componentDidMount=="function"&&(t.flags|=4194308),r=!1)}else{i=t.stateNode,uu(e,t),c=t.memoizedProps,w=t.type===t.elementType?c:Pt(t.type,c),i.props=w,z=t.pendingProps,j=i.context,g=n.contextType,typeof g=="object"&&g!==null?g=kt(g):(g=ut(n)?In:Xe.current,g=dr(t,g));var H=n.getDerivedStateFromProps;(M=typeof H=="function"||typeof i.getSnapshotBeforeUpdate=="function")||typeof i.UNSAFE_componentWillReceiveProps!="function"&&typeof i.componentWillReceiveProps!="function"||(c!==z||j!==g)&&Du(t,i,r,g),kn=!1,j=t.memoizedState,i.state=j,la(t,r,i,l);var K=t.memoizedState;c!==z||j!==K||it.current||kn?(typeof H=="function"&&(Qo(t,n,H,r),K=t.memoizedState),(w=kn||Lu(t,n,w,r,j,K,g)||!1)?(M||typeof i.UNSAFE_componentWillUpdate!="function"&&typeof i.componentWillUpdate!="function"||(typeof i.componentWillUpdate=="function"&&i.componentWillUpdate(r,K,g),typeof i.UNSAFE_componentWillUpdate=="function"&&i.UNSAFE_componentWillUpdate(r,K,g)),typeof i.componentDidUpdate=="function"&&(t.flags|=4),typeof i.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof i.componentDidUpdate!="function"||c===e.memoizedProps&&j===e.memoizedState||(t.flags|=4),typeof i.getSnapshotBeforeUpdate!="function"||c===e.memoizedProps&&j===e.memoizedState||(t.flags|=1024),t.memoizedProps=r,t.memoizedState=K),i.props=r,i.state=K,i.context=g,r=w):(typeof i.componentDidUpdate!="function"||c===e.memoizedProps&&j===e.memoizedState||(t.flags|=4),typeof i.getSnapshotBeforeUpdate!="function"||c===e.memoizedProps&&j===e.memoizedState||(t.flags|=1024),r=!1)}return Zo(e,t,n,r,a,l)}function Zo(e,t,n,r,l,a){Ku(e,t);var i=(t.flags&128)!==0;if(!r&&!i)return l&&Xi(t,n,!1),en(e,t,a);r=t.stateNode,Rf.current=t;var c=i&&typeof n.getDerivedStateFromError!="function"?null:r.render();return t.flags|=1,e!==null&&i?(t.child=mr(t,e.child,null,a),t.child=mr(t,null,c,a)):lt(e,t,c,a),t.memoizedState=r.state,l&&Xi(t,n,!0),t.child}function Qu(e){var t=e.stateNode;t.pendingContext?Gi(e,t.pendingContext,t.pendingContext!==t.context):t.context&&Gi(e,t.context,!1),Do(e,t.containerInfo)}function Ju(e,t,n,r,l){return gr(),To(l),t.flags|=256,lt(e,t,n,r),t.child}var es={dehydrated:null,treeContext:null,retryLane:0};function ts(e){return{baseLanes:e,cachePool:null,transitions:null}}function Gu(e,t,n){var r=t.pendingProps,l=Ie.current,a=!1,i=(t.flags&128)!==0,c;if((c=i)||(c=e!==null&&e.memoizedState===null?!1:(l&2)!==0),c?(a=!0,t.flags&=-129):(e===null||e.memoizedState!==null)&&(l|=1),je(Ie,l&1),e===null)return No(t),e=t.memoizedState,e!==null&&(e=e.dehydrated,e!==null)?((t.mode&1)===0?t.lanes=1:e.data==="$!"?t.lanes=8:t.lanes=1073741824,null):(i=r.children,e=r.fallback,a?(r=t.mode,a=t.child,i={mode:"hidden",children:i},(r&1)===0&&a!==null?(a.childLanes=0,a.pendingProps=i):a=Ea(i,r,0,null),e=Yn(e,r,n,null),a.return=t,e.return=t,a.sibling=e,t.child=a,t.child.memoizedState=ts(n),t.memoizedState=es,e):ns(t,i));if(l=e.memoizedState,l!==null&&(c=l.dehydrated,c!==null))return Df(e,t,i,r,c,l,n);if(a){a=r.fallback,i=t.mode,l=e.child,c=l.sibling;var g={mode:"hidden",children:r.children};return(i&1)===0&&t.child!==l?(r=t.child,r.childLanes=0,r.pendingProps=g,t.deletions=null):(r=Tn(l,g),r.subtreeFlags=l.subtreeFlags&14680064),c!==null?a=Tn(c,a):(a=Yn(a,i,n,null),a.flags|=2),a.return=t,r.return=t,r.sibling=a,t.child=r,r=a,a=t.child,i=e.child.memoizedState,i=i===null?ts(n):{baseLanes:i.baseLanes|n,cachePool:null,transitions:i.transitions},a.memoizedState=i,a.childLanes=e.childLanes&~n,t.memoizedState=es,r}return a=e.child,e=a.sibling,r=Tn(a,{mode:"visible",children:r.children}),(t.mode&1)===0&&(r.lanes=n),r.return=t,r.sibling=null,e!==null&&(n=t.deletions,n===null?(t.deletions=[e],t.flags|=16):n.push(e)),t.child=r,t.memoizedState=null,r}function ns(e,t){return t=Ea({mode:"visible",children:t},e.mode,0,null),t.return=e,e.child=t}function pa(e,t,n,r){return r!==null&&To(r),mr(t,e.child,null,n),e=ns(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function Df(e,t,n,r,l,a,i){if(n)return t.flags&256?(t.flags&=-257,r=Go(Error(o(422))),pa(e,t,i,r)):t.memoizedState!==null?(t.child=e.child,t.flags|=128,null):(a=r.fallback,l=t.mode,r=Ea({mode:"visible",children:r.children},l,0,null),a=Yn(a,l,i,null),a.flags|=2,r.return=t,a.return=t,r.sibling=a,t.child=r,(t.mode&1)!==0&&mr(t,e.child,null,i),t.child.memoizedState=ts(i),t.memoizedState=es,a);if((t.mode&1)===0)return pa(e,t,i,null);if(l.data==="$!"){if(r=l.nextSibling&&l.nextSibling.dataset,r)var c=r.dgst;return r=c,a=Error(o(419)),r=Go(a,r,void 0),pa(e,t,i,r)}if(c=(i&e.childLanes)!==0,ct||c){if(r=Ke,r!==null){switch(i&-i){case 4:l=2;break;case 16:l=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:l=32;break;case 536870912:l=268435456;break;default:l=0}l=(l&(r.suspendedLanes|i))!==0?0:l,l!==0&&l!==a.retryLane&&(a.retryLane=l,Xt(e,l),zt(r,e,l,-1))}return vs(),r=Go(Error(o(421))),pa(e,t,i,r)}return l.data==="$?"?(t.flags|=128,t.child=e.child,t=Jf.bind(null,e),l._reactRetry=t,null):(e=a.treeContext,ht=vn(l.nextSibling),mt=t,De=!0,Tt=null,e!==null&&(_t[wt++]=Gt,_t[wt++]=qt,_t[wt++]=On,Gt=e.id,qt=e.overflow,On=t),t=ns(t,r.children),t.flags|=4096,t)}function qu(e,t,n){e.lanes|=t;var r=e.alternate;r!==null&&(r.lanes|=t),zo(e.return,t,n)}function rs(e,t,n,r,l){var a=e.memoizedState;a===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:r,tail:n,tailMode:l}:(a.isBackwards=t,a.rendering=null,a.renderingStartTime=0,a.last=r,a.tail=n,a.tailMode=l)}function Xu(e,t,n){var r=t.pendingProps,l=r.revealOrder,a=r.tail;if(lt(e,t,r.children,n),r=Ie.current,(r&2)!==0)r=r&1|2,t.flags|=128;else{if(e!==null&&(e.flags&128)!==0)e:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&qu(e,n,t);else if(e.tag===19)qu(e,n,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}r&=1}if(je(Ie,r),(t.mode&1)===0)t.memoizedState=null;else switch(l){case"forwards":for(n=t.child,l=null;n!==null;)e=n.alternate,e!==null&&aa(e)===null&&(l=n),n=n.sibling;n=l,n===null?(l=t.child,t.child=null):(l=n.sibling,n.sibling=null),rs(t,!1,l,n,a);break;case"backwards":for(n=null,l=t.child,t.child=null;l!==null;){if(e=l.alternate,e!==null&&aa(e)===null){t.child=l;break}e=l.sibling,l.sibling=n,n=l,l=e}rs(t,!0,n,null,a);break;case"together":rs(t,!1,null,null,void 0);break;default:t.memoizedState=null}return t.child}function fa(e,t){(t.mode&1)===0&&e!==null&&(e.alternate=null,t.alternate=null,t.flags|=2)}function en(e,t,n){if(e!==null&&(t.dependencies=e.dependencies),Vn|=t.lanes,(n&t.childLanes)===0)return null;if(e!==null&&t.child!==e.child)throw Error(o(153));if(t.child!==null){for(e=t.child,n=Tn(e,e.pendingProps),t.child=n,n.return=t;e.sibling!==null;)e=e.sibling,n=n.sibling=Tn(e,e.pendingProps),n.return=t;n.sibling=null}return t.child}function If(e,t,n){switch(t.tag){case 3:Qu(t),gr();break;case 5:pu(t);break;case 1:ut(t.type)&&Jl(t);break;case 4:Do(t,t.stateNode.containerInfo);break;case 10:var r=t.type._context,l=t.memoizedProps.value;je(ta,r._currentValue),r._currentValue=l;break;case 13:if(r=t.memoizedState,r!==null)return r.dehydrated!==null?(je(Ie,Ie.current&1),t.flags|=128,null):(n&t.child.childLanes)!==0?Gu(e,t,n):(je(Ie,Ie.current&1),e=en(e,t,n),e!==null?e.sibling:null);je(Ie,Ie.current&1);break;case 19:if(r=(n&t.childLanes)!==0,(e.flags&128)!==0){if(r)return Xu(e,t,n);t.flags|=128}if(l=t.memoizedState,l!==null&&(l.rendering=null,l.tail=null,l.lastEffect=null),je(Ie,Ie.current),r)break;return null;case 22:case 23:return t.lanes=0,Wu(e,t,n)}return en(e,t,n)}var Zu,ls,ec,tc;Zu=function(e,t){for(var n=t.child;n!==null;){if(n.tag===5||n.tag===6)e.appendChild(n.stateNode);else if(n.tag!==4&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===t)break;for(;n.sibling===null;){if(n.return===null||n.return===t)return;n=n.return}n.sibling.return=n.return,n=n.sibling}},ls=function(){},ec=function(e,t,n,r){var l=e.memoizedProps;if(l!==r){e=t.stateNode,Un(Ut.current);var a=null;switch(n){case"input":l=rt(e,l),r=rt(e,r),a=[];break;case"select":l=D({},l,{value:void 0}),r=D({},r,{value:void 0}),a=[];break;case"textarea":l=on(e,l),r=on(e,r),a=[];break;default:typeof l.onClick!="function"&&typeof r.onClick=="function"&&(e.onclick=Kl)}Mn(n,r);var i;n=null;for(w in l)if(!r.hasOwnProperty(w)&&l.hasOwnProperty(w)&&l[w]!=null)if(w==="style"){var c=l[w];for(i in c)c.hasOwnProperty(i)&&(n||(n={}),n[i]="")}else w!=="dangerouslySetInnerHTML"&&w!=="children"&&w!=="suppressContentEditableWarning"&&w!=="suppressHydrationWarning"&&w!=="autoFocus"&&(x.hasOwnProperty(w)?a||(a=[]):(a=a||[]).push(w,null));for(w in r){var g=r[w];if(c=l!=null?l[w]:void 0,r.hasOwnProperty(w)&&g!==c&&(g!=null||c!=null))if(w==="style")if(c){for(i in c)!c.hasOwnProperty(i)||g&&g.hasOwnProperty(i)||(n||(n={}),n[i]="");for(i in g)g.hasOwnProperty(i)&&c[i]!==g[i]&&(n||(n={}),n[i]=g[i])}else n||(a||(a=[]),a.push(w,n)),n=g;else w==="dangerouslySetInnerHTML"?(g=g?g.__html:void 0,c=c?c.__html:void 0,g!=null&&c!==g&&(a=a||[]).push(w,g)):w==="children"?typeof g!="string"&&typeof g!="number"||(a=a||[]).push(w,""+g):w!=="suppressContentEditableWarning"&&w!=="suppressHydrationWarning"&&(x.hasOwnProperty(w)?(g!=null&&w==="onScroll"&&Me("scroll",e),a||c===g||(a=[])):(a=a||[]).push(w,g))}n&&(a=a||[]).push("style",n);var w=a;(t.updateQueue=w)&&(t.flags|=4)}},tc=function(e,t,n,r){n!==r&&(t.flags|=4)};function il(e,t){if(!De)switch(e.tailMode){case"hidden":t=e.tail;for(var n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?e.tail=null:n.sibling=null;break;case"collapsed":n=e.tail;for(var r=null;n!==null;)n.alternate!==null&&(r=n),n=n.sibling;r===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:r.sibling=null}}function et(e){var t=e.alternate!==null&&e.alternate.child===e.child,n=0,r=0;if(t)for(var l=e.child;l!==null;)n|=l.lanes|l.childLanes,r|=l.subtreeFlags&14680064,r|=l.flags&14680064,l.return=e,l=l.sibling;else for(l=e.child;l!==null;)n|=l.lanes|l.childLanes,r|=l.subtreeFlags,r|=l.flags,l.return=e,l=l.sibling;return e.subtreeFlags|=r,e.childLanes=n,t}function Of(e,t,n){var r=t.pendingProps;switch(Co(t),t.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return et(t),null;case 1:return ut(t.type)&&Ql(),et(t),null;case 3:return r=t.stateNode,vr(),ze(it),ze(Xe),$o(),r.pendingContext&&(r.context=r.pendingContext,r.pendingContext=null),(e===null||e.child===null)&&(Zl(t)?t.flags|=4:e===null||e.memoizedState.isDehydrated&&(t.flags&256)===0||(t.flags|=1024,Tt!==null&&(ms(Tt),Tt=null))),ls(e,t),et(t),null;case 5:Io(t);var l=Un(rl.current);if(n=t.type,e!==null&&t.stateNode!=null)ec(e,t,n,r,l),e.ref!==t.ref&&(t.flags|=512,t.flags|=2097152);else{if(!r){if(t.stateNode===null)throw Error(o(166));return et(t),null}if(e=Un(Ut.current),Zl(t)){r=t.stateNode,n=t.type;var a=t.memoizedProps;switch(r[Ft]=t,r[Xr]=a,e=(t.mode&1)!==0,n){case"dialog":Me("cancel",r),Me("close",r);break;case"iframe":case"object":case"embed":Me("load",r);break;case"video":case"audio":for(l=0;l<Jr.length;l++)Me(Jr[l],r);break;case"source":Me("error",r);break;case"img":case"image":case"link":Me("error",r),Me("load",r);break;case"details":Me("toggle",r);break;case"input":Jn(r,a),Me("invalid",r);break;case"select":r._wrapperState={wasMultiple:!!a.multiple},Me("invalid",r);break;case"textarea":Kt(r,a),Me("invalid",r)}Mn(n,a),l=null;for(var i in a)if(a.hasOwnProperty(i)){var c=a[i];i==="children"?typeof c=="string"?r.textContent!==c&&(a.suppressHydrationWarning!==!0&&Wl(r.textContent,c,e),l=["children",c]):typeof c=="number"&&r.textContent!==""+c&&(a.suppressHydrationWarning!==!0&&Wl(r.textContent,c,e),l=["children",""+c]):x.hasOwnProperty(i)&&c!=null&&i==="onScroll"&&Me("scroll",r)}switch(n){case"input":nt(r),jn(r,a,!0);break;case"textarea":nt(r),ft(r);break;case"select":case"option":break;default:typeof a.onClick=="function"&&(r.onclick=Kl)}r=l,t.updateQueue=r,r!==null&&(t.flags|=4)}else{i=l.nodeType===9?l:l.ownerDocument,e==="http://www.w3.org/1999/xhtml"&&(e=qn(n)),e==="http://www.w3.org/1999/xhtml"?n==="script"?(e=i.createElement("div"),e.innerHTML="<script><\/script>",e=e.removeChild(e.firstChild)):typeof r.is=="string"?e=i.createElement(n,{is:r.is}):(e=i.createElement(n),n==="select"&&(i=e,r.multiple?i.multiple=!0:r.size&&(i.size=r.size))):e=i.createElementNS(e,n),e[Ft]=t,e[Xr]=r,Zu(e,t,!1,!1),t.stateNode=e;e:{switch(i=Zn(n,r),n){case"dialog":Me("cancel",e),Me("close",e),l=r;break;case"iframe":case"object":case"embed":Me("load",e),l=r;break;case"video":case"audio":for(l=0;l<Jr.length;l++)Me(Jr[l],e);l=r;break;case"source":Me("error",e),l=r;break;case"img":case"image":case"link":Me("error",e),Me("load",e),l=r;break;case"details":Me("toggle",e),l=r;break;case"input":Jn(e,r),l=rt(e,r),Me("invalid",e);break;case"option":l=r;break;case"select":e._wrapperState={wasMultiple:!!r.multiple},l=D({},r,{value:void 0}),Me("invalid",e);break;case"textarea":Kt(e,r),l=on(e,r),Me("invalid",e);break;default:l=r}Mn(n,l),c=l;for(a in c)if(c.hasOwnProperty(a)){var g=c[a];a==="style"?Nr(e,g):a==="dangerouslySetInnerHTML"?(g=g?g.__html:void 0,g!=null&&Yt(e,g)):a==="children"?typeof g=="string"?(n!=="textarea"||g!=="")&&It(e,g):typeof g=="number"&&It(e,""+g):a!=="suppressContentEditableWarning"&&a!=="suppressHydrationWarning"&&a!=="autoFocus"&&(x.hasOwnProperty(a)?g!=null&&a==="onScroll"&&Me("scroll",e):g!=null&&Ae(e,a,g,i))}switch(n){case"input":nt(e),jn(e,r,!1);break;case"textarea":nt(e),ft(e);break;case"option":r.value!=null&&e.setAttribute("value",""+ue(r.value));break;case"select":e.multiple=!!r.multiple,a=r.value,a!=null?Qe(e,!!r.multiple,a,!1):r.defaultValue!=null&&Qe(e,!!r.multiple,r.defaultValue,!0);break;default:typeof l.onClick=="function"&&(e.onclick=Kl)}switch(n){case"button":case"input":case"select":case"textarea":r=!!r.autoFocus;break e;case"img":r=!0;break e;default:r=!1}}r&&(t.flags|=4)}t.ref!==null&&(t.flags|=512,t.flags|=2097152)}return et(t),null;case 6:if(e&&t.stateNode!=null)tc(e,t,e.memoizedProps,r);else{if(typeof r!="string"&&t.stateNode===null)throw Error(o(166));if(n=Un(rl.current),Un(Ut.current),Zl(t)){if(r=t.stateNode,n=t.memoizedProps,r[Ft]=t,(a=r.nodeValue!==n)&&(e=mt,e!==null))switch(e.tag){case 3:Wl(r.nodeValue,n,(e.mode&1)!==0);break;case 5:e.memoizedProps.suppressHydrationWarning!==!0&&Wl(r.nodeValue,n,(e.mode&1)!==0)}a&&(t.flags|=4)}else r=(n.nodeType===9?n:n.ownerDocument).createTextNode(r),r[Ft]=t,t.stateNode=r}return et(t),null;case 13:if(ze(Ie),r=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(De&&ht!==null&&(t.mode&1)!==0&&(t.flags&128)===0)lu(),gr(),t.flags|=98560,a=!1;else if(a=Zl(t),r!==null&&r.dehydrated!==null){if(e===null){if(!a)throw Error(o(318));if(a=t.memoizedState,a=a!==null?a.dehydrated:null,!a)throw Error(o(317));a[Ft]=t}else gr(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;et(t),a=!1}else Tt!==null&&(ms(Tt),Tt=null),a=!0;if(!a)return t.flags&65536?t:null}return(t.flags&128)!==0?(t.lanes=n,t):(r=r!==null,r!==(e!==null&&e.memoizedState!==null)&&r&&(t.child.flags|=8192,(t.mode&1)!==0&&(e===null||(Ie.current&1)!==0?He===0&&(He=3):vs())),t.updateQueue!==null&&(t.flags|=4),et(t),null);case 4:return vr(),ls(e,t),e===null&&Gr(t.stateNode.containerInfo),et(t),null;case 10:return Mo(t.type._context),et(t),null;case 17:return ut(t.type)&&Ql(),et(t),null;case 19:if(ze(Ie),a=t.memoizedState,a===null)return et(t),null;if(r=(t.flags&128)!==0,i=a.rendering,i===null)if(r)il(a,!1);else{if(He!==0||e!==null&&(e.flags&128)!==0)for(e=t.child;e!==null;){if(i=aa(e),i!==null){for(t.flags|=128,il(a,!1),r=i.updateQueue,r!==null&&(t.updateQueue=r,t.flags|=4),t.subtreeFlags=0,r=n,n=t.child;n!==null;)a=n,e=r,a.flags&=14680066,i=a.alternate,i===null?(a.childLanes=0,a.lanes=e,a.child=null,a.subtreeFlags=0,a.memoizedProps=null,a.memoizedState=null,a.updateQueue=null,a.dependencies=null,a.stateNode=null):(a.childLanes=i.childLanes,a.lanes=i.lanes,a.child=i.child,a.subtreeFlags=0,a.deletions=null,a.memoizedProps=i.memoizedProps,a.memoizedState=i.memoizedState,a.updateQueue=i.updateQueue,a.type=i.type,e=i.dependencies,a.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext}),n=n.sibling;return je(Ie,Ie.current&1|2),t.child}e=e.sibling}a.tail!==null&&Fe()>kr&&(t.flags|=128,r=!0,il(a,!1),t.lanes=4194304)}else{if(!r)if(e=aa(i),e!==null){if(t.flags|=128,r=!0,n=e.updateQueue,n!==null&&(t.updateQueue=n,t.flags|=4),il(a,!0),a.tail===null&&a.tailMode==="hidden"&&!i.alternate&&!De)return et(t),null}else 2*Fe()-a.renderingStartTime>kr&&n!==1073741824&&(t.flags|=128,r=!0,il(a,!1),t.lanes=4194304);a.isBackwards?(i.sibling=t.child,t.child=i):(n=a.last,n!==null?n.sibling=i:t.child=i,a.last=i)}return a.tail!==null?(t=a.tail,a.rendering=t,a.tail=t.sibling,a.renderingStartTime=Fe(),t.sibling=null,n=Ie.current,je(Ie,r?n&1|2:n&1),t):(et(t),null);case 22:case 23:return xs(),r=t.memoizedState!==null,e!==null&&e.memoizedState!==null!==r&&(t.flags|=8192),r&&(t.mode&1)!==0?(xt&1073741824)!==0&&(et(t),t.subtreeFlags&6&&(t.flags|=8192)):et(t),null;case 24:return null;case 25:return null}throw Error(o(156,t.tag))}function $f(e,t){switch(Co(t),t.tag){case 1:return ut(t.type)&&Ql(),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return vr(),ze(it),ze(Xe),$o(),e=t.flags,(e&65536)!==0&&(e&128)===0?(t.flags=e&-65537|128,t):null;case 5:return Io(t),null;case 13:if(ze(Ie),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(o(340));gr()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return ze(Ie),null;case 4:return vr(),null;case 10:return Mo(t.type._context),null;case 22:case 23:return xs(),null;case 24:return null;default:return null}}var ga=!1,tt=!1,Ff=typeof WeakSet=="function"?WeakSet:Set,W=null;function _r(e,t){var n=e.ref;if(n!==null)if(typeof n=="function")try{n(null)}catch(r){$e(e,t,r)}else n.current=null}function as(e,t,n){try{n()}catch(r){$e(e,t,r)}}var nc=!1;function Uf(e,t){if(xo=Ll,e=Li(),io(e)){if("selectionStart"in e)var n={start:e.selectionStart,end:e.selectionEnd};else e:{n=(n=e.ownerDocument)&&n.defaultView||window;var r=n.getSelection&&n.getSelection();if(r&&r.rangeCount!==0){n=r.anchorNode;var l=r.anchorOffset,a=r.focusNode;r=r.focusOffset;try{n.nodeType,a.nodeType}catch{n=null;break e}var i=0,c=-1,g=-1,w=0,M=0,z=e,j=null;t:for(;;){for(var H;z!==n||l!==0&&z.nodeType!==3||(c=i+l),z!==a||r!==0&&z.nodeType!==3||(g=i+r),z.nodeType===3&&(i+=z.nodeValue.length),(H=z.firstChild)!==null;)j=z,z=H;for(;;){if(z===e)break t;if(j===n&&++w===l&&(c=i),j===a&&++M===r&&(g=i),(H=z.nextSibling)!==null)break;z=j,j=z.parentNode}z=H}n=c===-1||g===-1?null:{start:c,end:g}}else n=null}n=n||{start:0,end:0}}else n=null;for(vo={focusedElem:e,selectionRange:n},Ll=!1,W=t;W!==null;)if(t=W,e=t.child,(t.subtreeFlags&1028)!==0&&e!==null)e.return=t,W=e;else for(;W!==null;){t=W;try{var K=t.alternate;if((t.flags&1024)!==0)switch(t.tag){case 0:case 11:case 15:break;case 1:if(K!==null){var Q=K.memoizedProps,Ue=K.memoizedState,v=t.stateNode,h=v.getSnapshotBeforeUpdate(t.elementType===t.type?Q:Pt(t.type,Q),Ue);v.__reactInternalSnapshotBeforeUpdate=h}break;case 3:var y=t.stateNode.containerInfo;y.nodeType===1?y.textContent="":y.nodeType===9&&y.documentElement&&y.removeChild(y.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(o(163))}}catch(I){$e(t,t.return,I)}if(e=t.sibling,e!==null){e.return=t.return,W=e;break}W=t.return}return K=nc,nc=!1,K}function ul(e,t,n){var r=t.updateQueue;if(r=r!==null?r.lastEffect:null,r!==null){var l=r=r.next;do{if((l.tag&e)===e){var a=l.destroy;l.destroy=void 0,a!==void 0&&as(t,n,a)}l=l.next}while(l!==r)}}function ma(e,t){if(t=t.updateQueue,t=t!==null?t.lastEffect:null,t!==null){var n=t=t.next;do{if((n.tag&e)===e){var r=n.create;n.destroy=r()}n=n.next}while(n!==t)}}function os(e){var t=e.ref;if(t!==null){var n=e.stateNode;switch(e.tag){case 5:e=n;break;default:e=n}typeof t=="function"?t(e):t.current=e}}function rc(e){var t=e.alternate;t!==null&&(e.alternate=null,rc(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&(delete t[Ft],delete t[Xr],delete t[ko],delete t[bf],delete t[Sf])),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}function lc(e){return e.tag===5||e.tag===3||e.tag===4}function ac(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||lc(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function ss(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?n.nodeType===8?n.parentNode.insertBefore(e,t):n.insertBefore(e,t):(n.nodeType===8?(t=n.parentNode,t.insertBefore(e,n)):(t=n,t.appendChild(e)),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=Kl));else if(r!==4&&(e=e.child,e!==null))for(ss(e,t,n),e=e.sibling;e!==null;)ss(e,t,n),e=e.sibling}function is(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?n.insertBefore(e,t):n.appendChild(e);else if(r!==4&&(e=e.child,e!==null))for(is(e,t,n),e=e.sibling;e!==null;)is(e,t,n),e=e.sibling}var Je=null,jt=!1;function Sn(e,t,n){for(n=n.child;n!==null;)oc(e,t,n),n=n.sibling}function oc(e,t,n){if($t&&typeof $t.onCommitFiberUnmount=="function")try{$t.onCommitFiberUnmount(Nl,n)}catch{}switch(n.tag){case 5:tt||_r(n,t);case 6:var r=Je,l=jt;Je=null,Sn(e,t,n),Je=r,jt=l,Je!==null&&(jt?(e=Je,n=n.stateNode,e.nodeType===8?e.parentNode.removeChild(n):e.removeChild(n)):Je.removeChild(n.stateNode));break;case 18:Je!==null&&(jt?(e=Je,n=n.stateNode,e.nodeType===8?wo(e.parentNode,n):e.nodeType===1&&wo(e,n),Ur(e)):wo(Je,n.stateNode));break;case 4:r=Je,l=jt,Je=n.stateNode.containerInfo,jt=!0,Sn(e,t,n),Je=r,jt=l;break;case 0:case 11:case 14:case 15:if(!tt&&(r=n.updateQueue,r!==null&&(r=r.lastEffect,r!==null))){l=r=r.next;do{var a=l,i=a.destroy;a=a.tag,i!==void 0&&((a&2)!==0||(a&4)!==0)&&as(n,t,i),l=l.next}while(l!==r)}Sn(e,t,n);break;case 1:if(!tt&&(_r(n,t),r=n.stateNode,typeof r.componentWillUnmount=="function"))try{r.props=n.memoizedProps,r.state=n.memoizedState,r.componentWillUnmount()}catch(c){$e(n,t,c)}Sn(e,t,n);break;case 21:Sn(e,t,n);break;case 22:n.mode&1?(tt=(r=tt)||n.memoizedState!==null,Sn(e,t,n),tt=r):Sn(e,t,n);break;default:Sn(e,t,n)}}function sc(e){var t=e.updateQueue;if(t!==null){e.updateQueue=null;var n=e.stateNode;n===null&&(n=e.stateNode=new Ff),t.forEach(function(r){var l=Gf.bind(null,e,r);n.has(r)||(n.add(r),r.then(l,l))})}}function Mt(e,t){var n=t.deletions;if(n!==null)for(var r=0;r<n.length;r++){var l=n[r];try{var a=e,i=t,c=i;e:for(;c!==null;){switch(c.tag){case 5:Je=c.stateNode,jt=!1;break e;case 3:Je=c.stateNode.containerInfo,jt=!0;break e;case 4:Je=c.stateNode.containerInfo,jt=!0;break e}c=c.return}if(Je===null)throw Error(o(160));oc(a,i,l),Je=null,jt=!1;var g=l.alternate;g!==null&&(g.return=null),l.return=null}catch(w){$e(l,t,w)}}if(t.subtreeFlags&12854)for(t=t.child;t!==null;)ic(t,e),t=t.sibling}function ic(e,t){var n=e.alternate,r=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if(Mt(t,e),Vt(e),r&4){try{ul(3,e,e.return),ma(3,e)}catch(Q){$e(e,e.return,Q)}try{ul(5,e,e.return)}catch(Q){$e(e,e.return,Q)}}break;case 1:Mt(t,e),Vt(e),r&512&&n!==null&&_r(n,n.return);break;case 5:if(Mt(t,e),Vt(e),r&512&&n!==null&&_r(n,n.return),e.flags&32){var l=e.stateNode;try{It(l,"")}catch(Q){$e(e,e.return,Q)}}if(r&4&&(l=e.stateNode,l!=null)){var a=e.memoizedProps,i=n!==null?n.memoizedProps:a,c=e.type,g=e.updateQueue;if(e.updateQueue=null,g!==null)try{c==="input"&&a.type==="radio"&&a.name!=null&&Lt(l,a),Zn(c,i);var w=Zn(c,a);for(i=0;i<g.length;i+=2){var M=g[i],z=g[i+1];M==="style"?Nr(l,z):M==="dangerouslySetInnerHTML"?Yt(l,z):M==="children"?It(l,z):Ae(l,M,z,w)}switch(c){case"input":Rt(l,a);break;case"textarea":Gn(l,a);break;case"select":var j=l._wrapperState.wasMultiple;l._wrapperState.wasMultiple=!!a.multiple;var H=a.value;H!=null?Qe(l,!!a.multiple,H,!1):j!==!!a.multiple&&(a.defaultValue!=null?Qe(l,!!a.multiple,a.defaultValue,!0):Qe(l,!!a.multiple,a.multiple?[]:"",!1))}l[Xr]=a}catch(Q){$e(e,e.return,Q)}}break;case 6:if(Mt(t,e),Vt(e),r&4){if(e.stateNode===null)throw Error(o(162));l=e.stateNode,a=e.memoizedProps;try{l.nodeValue=a}catch(Q){$e(e,e.return,Q)}}break;case 3:if(Mt(t,e),Vt(e),r&4&&n!==null&&n.memoizedState.isDehydrated)try{Ur(t.containerInfo)}catch(Q){$e(e,e.return,Q)}break;case 4:Mt(t,e),Vt(e);break;case 13:Mt(t,e),Vt(e),l=e.child,l.flags&8192&&(a=l.memoizedState!==null,l.stateNode.isHidden=a,!a||l.alternate!==null&&l.alternate.memoizedState!==null||(ds=Fe())),r&4&&sc(e);break;case 22:if(M=n!==null&&n.memoizedState!==null,e.mode&1?(tt=(w=tt)||M,Mt(t,e),tt=w):Mt(t,e),Vt(e),r&8192){if(w=e.memoizedState!==null,(e.stateNode.isHidden=w)&&!M&&(e.mode&1)!==0)for(W=e,M=e.child;M!==null;){for(z=W=M;W!==null;){switch(j=W,H=j.child,j.tag){case 0:case 11:case 14:case 15:ul(4,j,j.return);break;case 1:_r(j,j.return);var K=j.stateNode;if(typeof K.componentWillUnmount=="function"){r=j,n=j.return;try{t=r,K.props=t.memoizedProps,K.state=t.memoizedState,K.componentWillUnmount()}catch(Q){$e(r,n,Q)}}break;case 5:_r(j,j.return);break;case 22:if(j.memoizedState!==null){dc(z);continue}}H!==null?(H.return=j,W=H):dc(z)}M=M.sibling}e:for(M=null,z=e;;){if(z.tag===5){if(M===null){M=z;try{l=z.stateNode,w?(a=l.style,typeof a.setProperty=="function"?a.setProperty("display","none","important"):a.display="none"):(c=z.stateNode,g=z.memoizedProps.style,i=g!=null&&g.hasOwnProperty("display")?g.display:null,c.style.display=kl("display",i))}catch(Q){$e(e,e.return,Q)}}}else if(z.tag===6){if(M===null)try{z.stateNode.nodeValue=w?"":z.memoizedProps}catch(Q){$e(e,e.return,Q)}}else if((z.tag!==22&&z.tag!==23||z.memoizedState===null||z===e)&&z.child!==null){z.child.return=z,z=z.child;continue}if(z===e)break e;for(;z.sibling===null;){if(z.return===null||z.return===e)break e;M===z&&(M=null),z=z.return}M===z&&(M=null),z.sibling.return=z.return,z=z.sibling}}break;case 19:Mt(t,e),Vt(e),r&4&&sc(e);break;case 21:break;default:Mt(t,e),Vt(e)}}function Vt(e){var t=e.flags;if(t&2){try{e:{for(var n=e.return;n!==null;){if(lc(n)){var r=n;break e}n=n.return}throw Error(o(160))}switch(r.tag){case 5:var l=r.stateNode;r.flags&32&&(It(l,""),r.flags&=-33);var a=ac(e);is(e,a,l);break;case 3:case 4:var i=r.stateNode.containerInfo,c=ac(e);ss(e,c,i);break;default:throw Error(o(161))}}catch(g){$e(e,e.return,g)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function Bf(e,t,n){W=e,uc(e)}function uc(e,t,n){for(var r=(e.mode&1)!==0;W!==null;){var l=W,a=l.child;if(l.tag===22&&r){var i=l.memoizedState!==null||ga;if(!i){var c=l.alternate,g=c!==null&&c.memoizedState!==null||tt;c=ga;var w=tt;if(ga=i,(tt=g)&&!w)for(W=l;W!==null;)i=W,g=i.child,i.tag===22&&i.memoizedState!==null?pc(l):g!==null?(g.return=i,W=g):pc(l);for(;a!==null;)W=a,uc(a),a=a.sibling;W=l,ga=c,tt=w}cc(e)}else(l.subtreeFlags&8772)!==0&&a!==null?(a.return=l,W=a):cc(e)}}function cc(e){for(;W!==null;){var t=W;if((t.flags&8772)!==0){var n=t.alternate;try{if((t.flags&8772)!==0)switch(t.tag){case 0:case 11:case 15:tt||ma(5,t);break;case 1:var r=t.stateNode;if(t.flags&4&&!tt)if(n===null)r.componentDidMount();else{var l=t.elementType===t.type?n.memoizedProps:Pt(t.type,n.memoizedProps);r.componentDidUpdate(l,n.memoizedState,r.__reactInternalSnapshotBeforeUpdate)}var a=t.updateQueue;a!==null&&du(t,a,r);break;case 3:var i=t.updateQueue;if(i!==null){if(n=null,t.child!==null)switch(t.child.tag){case 5:n=t.child.stateNode;break;case 1:n=t.child.stateNode}du(t,i,n)}break;case 5:var c=t.stateNode;if(n===null&&t.flags&4){n=c;var g=t.memoizedProps;switch(t.type){case"button":case"input":case"select":case"textarea":g.autoFocus&&n.focus();break;case"img":g.src&&(n.src=g.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(t.memoizedState===null){var w=t.alternate;if(w!==null){var M=w.memoizedState;if(M!==null){var z=M.dehydrated;z!==null&&Ur(z)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(o(163))}tt||t.flags&512&&os(t)}catch(j){$e(t,t.return,j)}}if(t===e){W=null;break}if(n=t.sibling,n!==null){n.return=t.return,W=n;break}W=t.return}}function dc(e){for(;W!==null;){var t=W;if(t===e){W=null;break}var n=t.sibling;if(n!==null){n.return=t.return,W=n;break}W=t.return}}function pc(e){for(;W!==null;){var t=W;try{switch(t.tag){case 0:case 11:case 15:var n=t.return;try{ma(4,t)}catch(g){$e(t,n,g)}break;case 1:var r=t.stateNode;if(typeof r.componentDidMount=="function"){var l=t.return;try{r.componentDidMount()}catch(g){$e(t,l,g)}}var a=t.return;try{os(t)}catch(g){$e(t,a,g)}break;case 5:var i=t.return;try{os(t)}catch(g){$e(t,i,g)}}}catch(g){$e(t,t.return,g)}if(t===e){W=null;break}var c=t.sibling;if(c!==null){c.return=t.return,W=c;break}W=t.return}}var Vf=Math.ceil,ha=_e.ReactCurrentDispatcher,us=_e.ReactCurrentOwner,St=_e.ReactCurrentBatchConfig,ye=0,Ke=null,Be=null,Ge=0,xt=0,wr=yn(0),He=0,cl=null,Vn=0,xa=0,cs=0,dl=null,dt=null,ds=0,kr=1/0,tn=null,va=!1,ps=null,En=null,ya=!1,Cn=null,_a=0,pl=0,fs=null,wa=-1,ka=0;function at(){return(ye&6)!==0?Fe():wa!==-1?wa:wa=Fe()}function An(e){return(e.mode&1)===0?1:(ye&2)!==0&&Ge!==0?Ge&-Ge:Cf.transition!==null?(ka===0&&(ka=ai()),ka):(e=be,e!==0||(e=window.event,e=e===void 0?16:gi(e.type)),e)}function zt(e,t,n,r){if(50<pl)throw pl=0,fs=null,Error(o(185));Dr(e,n,r),((ye&2)===0||e!==Ke)&&(e===Ke&&((ye&2)===0&&(xa|=n),He===4&&Nn(e,Ge)),pt(e,r),n===1&&ye===0&&(t.mode&1)===0&&(kr=Fe()+500,Gl&&wn()))}function pt(e,t){var n=e.callbackNode;Ep(e,t);var r=jl(e,e===Ke?Ge:0);if(r===0)n!==null&&yt(n),e.callbackNode=null,e.callbackPriority=0;else if(t=r&-r,e.callbackPriority!==t){if(n!=null&&yt(n),t===1)e.tag===0?Ef(gc.bind(null,e)):Zi(gc.bind(null,e)),wf(function(){(ye&6)===0&&wn()}),n=null;else{switch(oi(r)){case 1:n=Wa;break;case 4:n=ri;break;case 16:n=Al;break;case 536870912:n=li;break;default:n=Al}n=kc(n,fc.bind(null,e))}e.callbackPriority=t,e.callbackNode=n}}function fc(e,t){if(wa=-1,ka=0,(ye&6)!==0)throw Error(o(327));var n=e.callbackNode;if(br()&&e.callbackNode!==n)return null;var r=jl(e,e===Ke?Ge:0);if(r===0)return null;if((r&30)!==0||(r&e.expiredLanes)!==0||t)t=ba(e,r);else{t=r;var l=ye;ye|=2;var a=hc();(Ke!==e||Ge!==t)&&(tn=null,kr=Fe()+500,Wn(e,t));do try{Kf();break}catch(c){mc(e,c)}while(!0);jo(),ha.current=a,ye=l,Be!==null?t=0:(Ke=null,Ge=0,t=He)}if(t!==0){if(t===2&&(l=Ka(e),l!==0&&(r=l,t=gs(e,l))),t===1)throw n=cl,Wn(e,0),Nn(e,r),pt(e,Fe()),n;if(t===6)Nn(e,r);else{if(l=e.current.alternate,(r&30)===0&&!Hf(l)&&(t=ba(e,r),t===2&&(a=Ka(e),a!==0&&(r=a,t=gs(e,a))),t===1))throw n=cl,Wn(e,0),Nn(e,r),pt(e,Fe()),n;switch(e.finishedWork=l,e.finishedLanes=r,t){case 0:case 1:throw Error(o(345));case 2:Kn(e,dt,tn);break;case 3:if(Nn(e,r),(r&130023424)===r&&(t=ds+500-Fe(),10<t)){if(jl(e,0)!==0)break;if(l=e.suspendedLanes,(l&r)!==r){at(),e.pingedLanes|=e.suspendedLanes&l;break}e.timeoutHandle=_o(Kn.bind(null,e,dt,tn),t);break}Kn(e,dt,tn);break;case 4:if(Nn(e,r),(r&4194240)===r)break;for(t=e.eventTimes,l=-1;0<r;){var i=31-At(r);a=1<<i,i=t[i],i>l&&(l=i),r&=~a}if(r=l,r=Fe()-r,r=(120>r?120:480>r?480:1080>r?1080:1920>r?1920:3e3>r?3e3:4320>r?4320:1960*Vf(r/1960))-r,10<r){e.timeoutHandle=_o(Kn.bind(null,e,dt,tn),r);break}Kn(e,dt,tn);break;case 5:Kn(e,dt,tn);break;default:throw Error(o(329))}}}return pt(e,Fe()),e.callbackNode===n?fc.bind(null,e):null}function gs(e,t){var n=dl;return e.current.memoizedState.isDehydrated&&(Wn(e,t).flags|=256),e=ba(e,t),e!==2&&(t=dt,dt=n,t!==null&&ms(t)),e}function ms(e){dt===null?dt=e:dt.push.apply(dt,e)}function Hf(e){for(var t=e;;){if(t.flags&16384){var n=t.updateQueue;if(n!==null&&(n=n.stores,n!==null))for(var r=0;r<n.length;r++){var l=n[r],a=l.getSnapshot;l=l.value;try{if(!Nt(a(),l))return!1}catch{return!1}}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function Nn(e,t){for(t&=~cs,t&=~xa,e.suspendedLanes|=t,e.pingedLanes&=~t,e=e.expirationTimes;0<t;){var n=31-At(t),r=1<<n;e[n]=-1,t&=~r}}function gc(e){if((ye&6)!==0)throw Error(o(327));br();var t=jl(e,0);if((t&1)===0)return pt(e,Fe()),null;var n=ba(e,t);if(e.tag!==0&&n===2){var r=Ka(e);r!==0&&(t=r,n=gs(e,r))}if(n===1)throw n=cl,Wn(e,0),Nn(e,t),pt(e,Fe()),n;if(n===6)throw Error(o(345));return e.finishedWork=e.current.alternate,e.finishedLanes=t,Kn(e,dt,tn),pt(e,Fe()),null}function hs(e,t){var n=ye;ye|=1;try{return e(t)}finally{ye=n,ye===0&&(kr=Fe()+500,Gl&&wn())}}function Hn(e){Cn!==null&&Cn.tag===0&&(ye&6)===0&&br();var t=ye;ye|=1;var n=St.transition,r=be;try{if(St.transition=null,be=1,e)return e()}finally{be=r,St.transition=n,ye=t,(ye&6)===0&&wn()}}function xs(){xt=wr.current,ze(wr)}function Wn(e,t){e.finishedWork=null,e.finishedLanes=0;var n=e.timeoutHandle;if(n!==-1&&(e.timeoutHandle=-1,_f(n)),Be!==null)for(n=Be.return;n!==null;){var r=n;switch(Co(r),r.tag){case 1:r=r.type.childContextTypes,r!=null&&Ql();break;case 3:vr(),ze(it),ze(Xe),$o();break;case 5:Io(r);break;case 4:vr();break;case 13:ze(Ie);break;case 19:ze(Ie);break;case 10:Mo(r.type._context);break;case 22:case 23:xs()}n=n.return}if(Ke=e,Be=e=Tn(e.current,null),Ge=xt=t,He=0,cl=null,cs=xa=Vn=0,dt=dl=null,Fn!==null){for(t=0;t<Fn.length;t++)if(n=Fn[t],r=n.interleaved,r!==null){n.interleaved=null;var l=r.next,a=n.pending;if(a!==null){var i=a.next;a.next=l,r.next=i}n.pending=r}Fn=null}return e}function mc(e,t){do{var n=Be;try{if(jo(),oa.current=ca,sa){for(var r=Oe.memoizedState;r!==null;){var l=r.queue;l!==null&&(l.pending=null),r=r.next}sa=!1}if(Bn=0,We=Ve=Oe=null,ll=!1,al=0,us.current=null,n===null||n.return===null){He=1,cl=t,Be=null;break}e:{var a=e,i=n.return,c=n,g=t;if(t=Ge,c.flags|=32768,g!==null&&typeof g=="object"&&typeof g.then=="function"){var w=g,M=c,z=M.tag;if((M.mode&1)===0&&(z===0||z===11||z===15)){var j=M.alternate;j?(M.updateQueue=j.updateQueue,M.memoizedState=j.memoizedState,M.lanes=j.lanes):(M.updateQueue=null,M.memoizedState=null)}var H=Fu(i);if(H!==null){H.flags&=-257,Uu(H,i,c,a,t),H.mode&1&&$u(a,w,t),t=H,g=w;var K=t.updateQueue;if(K===null){var Q=new Set;Q.add(g),t.updateQueue=Q}else K.add(g);break e}else{if((t&1)===0){$u(a,w,t),vs();break e}g=Error(o(426))}}else if(De&&c.mode&1){var Ue=Fu(i);if(Ue!==null){(Ue.flags&65536)===0&&(Ue.flags|=256),Uu(Ue,i,c,a,t),To(yr(g,c));break e}}a=g=yr(g,c),He!==4&&(He=2),dl===null?dl=[a]:dl.push(a),a=i;do{switch(a.tag){case 3:a.flags|=65536,t&=-t,a.lanes|=t;var v=Iu(a,g,t);cu(a,v);break e;case 1:c=g;var h=a.type,y=a.stateNode;if((a.flags&128)===0&&(typeof h.getDerivedStateFromError=="function"||y!==null&&typeof y.componentDidCatch=="function"&&(En===null||!En.has(y)))){a.flags|=65536,t&=-t,a.lanes|=t;var I=Ou(a,c,t);cu(a,I);break e}}a=a.return}while(a!==null)}vc(n)}catch(J){t=J,Be===n&&n!==null&&(Be=n=n.return);continue}break}while(!0)}function hc(){var e=ha.current;return ha.current=ca,e===null?ca:e}function vs(){(He===0||He===3||He===2)&&(He=4),Ke===null||(Vn&268435455)===0&&(xa&268435455)===0||Nn(Ke,Ge)}function ba(e,t){var n=ye;ye|=2;var r=hc();(Ke!==e||Ge!==t)&&(tn=null,Wn(e,t));do try{Wf();break}catch(l){mc(e,l)}while(!0);if(jo(),ye=n,ha.current=r,Be!==null)throw Error(o(261));return Ke=null,Ge=0,He}function Wf(){for(;Be!==null;)xc(Be)}function Kf(){for(;Be!==null&&!hp();)xc(Be)}function xc(e){var t=wc(e.alternate,e,xt);e.memoizedProps=e.pendingProps,t===null?vc(e):Be=t,us.current=null}function vc(e){var t=e;do{var n=t.alternate;if(e=t.return,(t.flags&32768)===0){if(n=Of(n,t,xt),n!==null){Be=n;return}}else{if(n=$f(n,t),n!==null){n.flags&=32767,Be=n;return}if(e!==null)e.flags|=32768,e.subtreeFlags=0,e.deletions=null;else{He=6,Be=null;return}}if(t=t.sibling,t!==null){Be=t;return}Be=t=e}while(t!==null);He===0&&(He=5)}function Kn(e,t,n){var r=be,l=St.transition;try{St.transition=null,be=1,Yf(e,t,n,r)}finally{St.transition=l,be=r}return null}function Yf(e,t,n,r){do br();while(Cn!==null);if((ye&6)!==0)throw Error(o(327));n=e.finishedWork;var l=e.finishedLanes;if(n===null)return null;if(e.finishedWork=null,e.finishedLanes=0,n===e.current)throw Error(o(177));e.callbackNode=null,e.callbackPriority=0;var a=n.lanes|n.childLanes;if(Cp(e,a),e===Ke&&(Be=Ke=null,Ge=0),(n.subtreeFlags&2064)===0&&(n.flags&2064)===0||ya||(ya=!0,kc(Al,function(){return br(),null})),a=(n.flags&15990)!==0,(n.subtreeFlags&15990)!==0||a){a=St.transition,St.transition=null;var i=be;be=1;var c=ye;ye|=4,us.current=null,Uf(e,n),ic(n,e),ff(vo),Ll=!!xo,vo=xo=null,e.current=n,Bf(n),xp(),ye=c,be=i,St.transition=a}else e.current=n;if(ya&&(ya=!1,Cn=e,_a=l),a=e.pendingLanes,a===0&&(En=null),_p(n.stateNode),pt(e,Fe()),t!==null)for(r=e.onRecoverableError,n=0;n<t.length;n++)l=t[n],r(l.value,{componentStack:l.stack,digest:l.digest});if(va)throw va=!1,e=ps,ps=null,e;return(_a&1)!==0&&e.tag!==0&&br(),a=e.pendingLanes,(a&1)!==0?e===fs?pl++:(pl=0,fs=e):pl=0,wn(),null}function br(){if(Cn!==null){var e=oi(_a),t=St.transition,n=be;try{if(St.transition=null,be=16>e?16:e,Cn===null)var r=!1;else{if(e=Cn,Cn=null,_a=0,(ye&6)!==0)throw Error(o(331));var l=ye;for(ye|=4,W=e.current;W!==null;){var a=W,i=a.child;if((W.flags&16)!==0){var c=a.deletions;if(c!==null){for(var g=0;g<c.length;g++){var w=c[g];for(W=w;W!==null;){var M=W;switch(M.tag){case 0:case 11:case 15:ul(8,M,a)}var z=M.child;if(z!==null)z.return=M,W=z;else for(;W!==null;){M=W;var j=M.sibling,H=M.return;if(rc(M),M===w){W=null;break}if(j!==null){j.return=H,W=j;break}W=H}}}var K=a.alternate;if(K!==null){var Q=K.child;if(Q!==null){K.child=null;do{var Ue=Q.sibling;Q.sibling=null,Q=Ue}while(Q!==null)}}W=a}}if((a.subtreeFlags&2064)!==0&&i!==null)i.return=a,W=i;else e:for(;W!==null;){if(a=W,(a.flags&2048)!==0)switch(a.tag){case 0:case 11:case 15:ul(9,a,a.return)}var v=a.sibling;if(v!==null){v.return=a.return,W=v;break e}W=a.return}}var h=e.current;for(W=h;W!==null;){i=W;var y=i.child;if((i.subtreeFlags&2064)!==0&&y!==null)y.return=i,W=y;else e:for(i=h;W!==null;){if(c=W,(c.flags&2048)!==0)try{switch(c.tag){case 0:case 11:case 15:ma(9,c)}}catch(J){$e(c,c.return,J)}if(c===i){W=null;break e}var I=c.sibling;if(I!==null){I.return=c.return,W=I;break e}W=c.return}}if(ye=l,wn(),$t&&typeof $t.onPostCommitFiberRoot=="function")try{$t.onPostCommitFiberRoot(Nl,e)}catch{}r=!0}return r}finally{be=n,St.transition=t}}return!1}function yc(e,t,n){t=yr(n,t),t=Iu(e,t,1),e=bn(e,t,1),t=at(),e!==null&&(Dr(e,1,t),pt(e,t))}function $e(e,t,n){if(e.tag===3)yc(e,e,n);else for(;t!==null;){if(t.tag===3){yc(t,e,n);break}else if(t.tag===1){var r=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof r.componentDidCatch=="function"&&(En===null||!En.has(r))){e=yr(n,e),e=Ou(t,e,1),t=bn(t,e,1),e=at(),t!==null&&(Dr(t,1,e),pt(t,e));break}}t=t.return}}function Qf(e,t,n){var r=e.pingCache;r!==null&&r.delete(t),t=at(),e.pingedLanes|=e.suspendedLanes&n,Ke===e&&(Ge&n)===n&&(He===4||He===3&&(Ge&130023424)===Ge&&500>Fe()-ds?Wn(e,0):cs|=n),pt(e,t)}function _c(e,t){t===0&&((e.mode&1)===0?t=1:(t=Pl,Pl<<=1,(Pl&130023424)===0&&(Pl=4194304)));var n=at();e=Xt(e,t),e!==null&&(Dr(e,t,n),pt(e,n))}function Jf(e){var t=e.memoizedState,n=0;t!==null&&(n=t.retryLane),_c(e,n)}function Gf(e,t){var n=0;switch(e.tag){case 13:var r=e.stateNode,l=e.memoizedState;l!==null&&(n=l.retryLane);break;case 19:r=e.stateNode;break;default:throw Error(o(314))}r!==null&&r.delete(t),_c(e,n)}var wc;wc=function(e,t,n){if(e!==null)if(e.memoizedProps!==t.pendingProps||it.current)ct=!0;else{if((e.lanes&n)===0&&(t.flags&128)===0)return ct=!1,If(e,t,n);ct=(e.flags&131072)!==0}else ct=!1,De&&(t.flags&1048576)!==0&&eu(t,Xl,t.index);switch(t.lanes=0,t.tag){case 2:var r=t.type;fa(e,t),e=t.pendingProps;var l=dr(t,Xe.current);xr(t,n),l=Bo(null,t,r,e,l,n);var a=Vo();return t.flags|=1,typeof l=="object"&&l!==null&&typeof l.render=="function"&&l.$$typeof===void 0?(t.tag=1,t.memoizedState=null,t.updateQueue=null,ut(r)?(a=!0,Jl(t)):a=!1,t.memoizedState=l.state!==null&&l.state!==void 0?l.state:null,Ro(t),l.updater=da,t.stateNode=l,l._reactInternals=t,Jo(t,r,e,n),t=Zo(null,t,r,!0,a,n)):(t.tag=0,De&&a&&Eo(t),lt(null,t,l,n),t=t.child),t;case 16:r=t.elementType;e:{switch(fa(e,t),e=t.pendingProps,l=r._init,r=l(r._payload),t.type=r,l=t.tag=Xf(r),e=Pt(r,e),l){case 0:t=Xo(null,t,r,e,n);break e;case 1:t=Yu(null,t,r,e,n);break e;case 11:t=Bu(null,t,r,e,n);break e;case 14:t=Vu(null,t,r,Pt(r.type,e),n);break e}throw Error(o(306,r,""))}return t;case 0:return r=t.type,l=t.pendingProps,l=t.elementType===r?l:Pt(r,l),Xo(e,t,r,l,n);case 1:return r=t.type,l=t.pendingProps,l=t.elementType===r?l:Pt(r,l),Yu(e,t,r,l,n);case 3:e:{if(Qu(t),e===null)throw Error(o(387));r=t.pendingProps,a=t.memoizedState,l=a.element,uu(e,t),la(t,r,null,n);var i=t.memoizedState;if(r=i.element,a.isDehydrated)if(a={element:r,isDehydrated:!1,cache:i.cache,pendingSuspenseBoundaries:i.pendingSuspenseBoundaries,transitions:i.transitions},t.updateQueue.baseState=a,t.memoizedState=a,t.flags&256){l=yr(Error(o(423)),t),t=Ju(e,t,r,n,l);break e}else if(r!==l){l=yr(Error(o(424)),t),t=Ju(e,t,r,n,l);break e}else for(ht=vn(t.stateNode.containerInfo.firstChild),mt=t,De=!0,Tt=null,n=su(t,null,r,n),t.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(gr(),r===l){t=en(e,t,n);break e}lt(e,t,r,n)}t=t.child}return t;case 5:return pu(t),e===null&&No(t),r=t.type,l=t.pendingProps,a=e!==null?e.memoizedProps:null,i=l.children,yo(r,l)?i=null:a!==null&&yo(r,a)&&(t.flags|=32),Ku(e,t),lt(e,t,i,n),t.child;case 6:return e===null&&No(t),null;case 13:return Gu(e,t,n);case 4:return Do(t,t.stateNode.containerInfo),r=t.pendingProps,e===null?t.child=mr(t,null,r,n):lt(e,t,r,n),t.child;case 11:return r=t.type,l=t.pendingProps,l=t.elementType===r?l:Pt(r,l),Bu(e,t,r,l,n);case 7:return lt(e,t,t.pendingProps,n),t.child;case 8:return lt(e,t,t.pendingProps.children,n),t.child;case 12:return lt(e,t,t.pendingProps.children,n),t.child;case 10:e:{if(r=t.type._context,l=t.pendingProps,a=t.memoizedProps,i=l.value,je(ta,r._currentValue),r._currentValue=i,a!==null)if(Nt(a.value,i)){if(a.children===l.children&&!it.current){t=en(e,t,n);break e}}else for(a=t.child,a!==null&&(a.return=t);a!==null;){var c=a.dependencies;if(c!==null){i=a.child;for(var g=c.firstContext;g!==null;){if(g.context===r){if(a.tag===1){g=Zt(-1,n&-n),g.tag=2;var w=a.updateQueue;if(w!==null){w=w.shared;var M=w.pending;M===null?g.next=g:(g.next=M.next,M.next=g),w.pending=g}}a.lanes|=n,g=a.alternate,g!==null&&(g.lanes|=n),zo(a.return,n,t),c.lanes|=n;break}g=g.next}}else if(a.tag===10)i=a.type===t.type?null:a.child;else if(a.tag===18){if(i=a.return,i===null)throw Error(o(341));i.lanes|=n,c=i.alternate,c!==null&&(c.lanes|=n),zo(i,n,t),i=a.sibling}else i=a.child;if(i!==null)i.return=a;else for(i=a;i!==null;){if(i===t){i=null;break}if(a=i.sibling,a!==null){a.return=i.return,i=a;break}i=i.return}a=i}lt(e,t,l.children,n),t=t.child}return t;case 9:return l=t.type,r=t.pendingProps.children,xr(t,n),l=kt(l),r=r(l),t.flags|=1,lt(e,t,r,n),t.child;case 14:return r=t.type,l=Pt(r,t.pendingProps),l=Pt(r.type,l),Vu(e,t,r,l,n);case 15:return Hu(e,t,t.type,t.pendingProps,n);case 17:return r=t.type,l=t.pendingProps,l=t.elementType===r?l:Pt(r,l),fa(e,t),t.tag=1,ut(r)?(e=!0,Jl(t)):e=!1,xr(t,n),Ru(t,r,l),Jo(t,r,l,n),Zo(null,t,r,!0,e,n);case 19:return Xu(e,t,n);case 22:return Wu(e,t,n)}throw Error(o(156,t.tag))};function kc(e,t){return Re(e,t)}function qf(e,t,n,r){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=r,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Et(e,t,n,r){return new qf(e,t,n,r)}function ys(e){return e=e.prototype,!(!e||!e.isReactComponent)}function Xf(e){if(typeof e=="function")return ys(e)?1:0;if(e!=null){if(e=e.$$typeof,e===Se)return 11;if(e===xe)return 14}return 2}function Tn(e,t){var n=e.alternate;return n===null?(n=Et(e.tag,t,e.key,e.mode),n.elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=e.flags&14680064,n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n}function Sa(e,t,n,r,l,a){var i=2;if(r=e,typeof e=="function")ys(e)&&(i=1);else if(typeof e=="string")i=5;else e:switch(e){case R:return Yn(n.children,l,a,t);case U:i=8,l|=8;break;case Y:return e=Et(12,n,t,l|2),e.elementType=Y,e.lanes=a,e;case q:return e=Et(13,n,t,l),e.elementType=q,e.lanes=a,e;case Ee:return e=Et(19,n,t,l),e.elementType=Ee,e.lanes=a,e;case fe:return Ea(n,l,a,t);default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case he:i=10;break e;case Ne:i=9;break e;case Se:i=11;break e;case xe:i=14;break e;case Pe:i=16,r=null;break e}throw Error(o(130,e==null?e:typeof e,""))}return t=Et(i,n,t,l),t.elementType=e,t.type=r,t.lanes=a,t}function Yn(e,t,n,r){return e=Et(7,e,r,t),e.lanes=n,e}function Ea(e,t,n,r){return e=Et(22,e,r,t),e.elementType=fe,e.lanes=n,e.stateNode={isHidden:!1},e}function _s(e,t,n){return e=Et(6,e,null,t),e.lanes=n,e}function ws(e,t,n){return t=Et(4,e.children!==null?e.children:[],e.key,t),t.lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}function Zf(e,t,n,r,l){this.tag=t,this.containerInfo=e,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=Ya(0),this.expirationTimes=Ya(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Ya(0),this.identifierPrefix=r,this.onRecoverableError=l,this.mutableSourceEagerHydrationData=null}function ks(e,t,n,r,l,a,i,c,g){return e=new Zf(e,t,n,c,g),t===1?(t=1,a===!0&&(t|=8)):t=0,a=Et(3,null,null,t),e.current=a,a.stateNode=e,a.memoizedState={element:r,isDehydrated:n,cache:null,transitions:null,pendingSuspenseBoundaries:null},Ro(a),e}function eg(e,t,n){var r=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:T,key:r==null?null:""+r,children:e,containerInfo:t,implementation:n}}function bc(e){if(!e)return _n;e=e._reactInternals;e:{if(V(e)!==e||e.tag!==1)throw Error(o(170));var t=e;do{switch(t.tag){case 3:t=t.stateNode.context;break e;case 1:if(ut(t.type)){t=t.stateNode.__reactInternalMemoizedMergedChildContext;break e}}t=t.return}while(t!==null);throw Error(o(171))}if(e.tag===1){var n=e.type;if(ut(n))return qi(e,n,t)}return t}function Sc(e,t,n,r,l,a,i,c,g){return e=ks(n,r,!0,e,l,a,i,c,g),e.context=bc(null),n=e.current,r=at(),l=An(n),a=Zt(r,l),a.callback=t??null,bn(n,a,l),e.current.lanes=l,Dr(e,l,r),pt(e,r),e}function Ca(e,t,n,r){var l=t.current,a=at(),i=An(l);return n=bc(n),t.context===null?t.context=n:t.pendingContext=n,t=Zt(a,i),t.payload={element:e},r=r===void 0?null:r,r!==null&&(t.callback=r),e=bn(l,t,i),e!==null&&(zt(e,l,i,a),ra(e,l,i)),i}function Aa(e){if(e=e.current,!e.child)return null;switch(e.child.tag){case 5:return e.child.stateNode;default:return e.child.stateNode}}function Ec(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var n=e.retryLane;e.retryLane=n!==0&&n<t?n:t}}function bs(e,t){Ec(e,t),(e=e.alternate)&&Ec(e,t)}function tg(){return null}var Cc=typeof reportError=="function"?reportError:function(e){console.error(e)};function Ss(e){this._internalRoot=e}Na.prototype.render=Ss.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(o(409));Ca(e,t,null,null)},Na.prototype.unmount=Ss.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;Hn(function(){Ca(null,e,null,null)}),t[Qt]=null}};function Na(e){this._internalRoot=e}Na.prototype.unstable_scheduleHydration=function(e){if(e){var t=ui();e={blockedOn:null,target:e,priority:t};for(var n=0;n<mn.length&&t!==0&&t<mn[n].priority;n++);mn.splice(n,0,e),n===0&&pi(e)}};function Es(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function Ta(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11&&(e.nodeType!==8||e.nodeValue!==" react-mount-point-unstable "))}function Ac(){}function ng(e,t,n,r,l){if(l){if(typeof r=="function"){var a=r;r=function(){var w=Aa(i);a.call(w)}}var i=Sc(t,r,e,0,null,!1,!1,"",Ac);return e._reactRootContainer=i,e[Qt]=i.current,Gr(e.nodeType===8?e.parentNode:e),Hn(),i}for(;l=e.lastChild;)e.removeChild(l);if(typeof r=="function"){var c=r;r=function(){var w=Aa(g);c.call(w)}}var g=ks(e,0,!1,null,null,!1,!1,"",Ac);return e._reactRootContainer=g,e[Qt]=g.current,Gr(e.nodeType===8?e.parentNode:e),Hn(function(){Ca(t,g,n,r)}),g}function Pa(e,t,n,r,l){var a=n._reactRootContainer;if(a){var i=a;if(typeof l=="function"){var c=l;l=function(){var g=Aa(i);c.call(g)}}Ca(t,i,e,l)}else i=ng(n,t,e,l,r);return Aa(i)}si=function(e){switch(e.tag){case 3:var t=e.stateNode;if(t.current.memoizedState.isDehydrated){var n=Rr(t.pendingLanes);n!==0&&(Qa(t,n|1),pt(t,Fe()),(ye&6)===0&&(kr=Fe()+500,wn()))}break;case 13:Hn(function(){var r=Xt(e,1);if(r!==null){var l=at();zt(r,e,1,l)}}),bs(e,1)}},Ja=function(e){if(e.tag===13){var t=Xt(e,134217728);if(t!==null){var n=at();zt(t,e,134217728,n)}bs(e,134217728)}},ii=function(e){if(e.tag===13){var t=An(e),n=Xt(e,t);if(n!==null){var r=at();zt(n,e,t,r)}bs(e,t)}},ui=function(){return be},ci=function(e,t){var n=be;try{return be=e,t()}finally{be=n}},Tr=function(e,t,n){switch(t){case"input":if(Rt(e,n),t=n.name,n.type==="radio"&&t!=null){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+t)+'][type="radio"]'),t=0;t<n.length;t++){var r=n[t];if(r!==e&&r.form===e.form){var l=Yl(r);if(!l)throw Error(o(90));qe(r),Rt(r,l)}}}break;case"textarea":Gn(e,n);break;case"select":t=n.value,t!=null&&Qe(e,!!n.multiple,t,!1)}},Mr=hs,zn=Hn;var rg={usingClientEntryPoint:!1,Events:[Zr,ur,Yl,jr,Sl,hs]},fl={findFiberByHostInstance:Dn,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},lg={bundleType:fl.bundleType,version:fl.version,rendererPackageName:fl.rendererPackageName,rendererConfig:fl.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:_e.ReactCurrentDispatcher,findHostInstanceByFiber:function(e){return e=Ce(e),e===null?null:e.stateNode},findFiberByHostInstance:fl.findFiberByHostInstance||tg,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var ja=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!ja.isDisabled&&ja.supportsFiber)try{Nl=ja.inject(lg),$t=ja}catch{}}return ot.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=rg,ot.createPortal=function(e,t){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!Es(t))throw Error(o(200));return eg(e,t,null,n)},ot.createRoot=function(e,t){if(!Es(e))throw Error(o(299));var n=!1,r="",l=Cc;return t!=null&&(t.unstable_strictMode===!0&&(n=!0),t.identifierPrefix!==void 0&&(r=t.identifierPrefix),t.onRecoverableError!==void 0&&(l=t.onRecoverableError)),t=ks(e,1,!1,null,null,n,!1,r,l),e[Qt]=t.current,Gr(e.nodeType===8?e.parentNode:e),new Ss(t)},ot.findDOMNode=function(e){if(e==null)return null;if(e.nodeType===1)return e;var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(o(188)):(e=Object.keys(e).join(","),Error(o(268,e)));return e=Ce(t),e=e===null?null:e.stateNode,e},ot.flushSync=function(e){return Hn(e)},ot.hydrate=function(e,t,n){if(!Ta(t))throw Error(o(200));return Pa(null,e,t,!0,n)},ot.hydrateRoot=function(e,t,n){if(!Es(e))throw Error(o(405));var r=n!=null&&n.hydratedSources||null,l=!1,a="",i=Cc;if(n!=null&&(n.unstable_strictMode===!0&&(l=!0),n.identifierPrefix!==void 0&&(a=n.identifierPrefix),n.onRecoverableError!==void 0&&(i=n.onRecoverableError)),t=Sc(t,null,e,1,n??null,l,!1,a,i),e[Qt]=t.current,Gr(e),r)for(e=0;e<r.length;e++)n=r[e],l=n._getVersion,l=l(n._source),t.mutableSourceEagerHydrationData==null?t.mutableSourceEagerHydrationData=[n,l]:t.mutableSourceEagerHydrationData.push(n,l);return new Na(t)},ot.render=function(e,t,n){if(!Ta(t))throw Error(o(200));return Pa(null,e,t,!1,n)},ot.unmountComponentAtNode=function(e){if(!Ta(e))throw Error(o(40));return e._reactRootContainer?(Hn(function(){Pa(null,null,e,!1,function(){e._reactRootContainer=null,e[Qt]=null})}),!0):!1},ot.unstable_batchedUpdates=hs,ot.unstable_renderSubtreeIntoContainer=function(e,t,n,r){if(!Ta(n))throw Error(o(200));if(e==null||e._reactInternals===void 0)throw Error(o(38));return Pa(e,t,n,!1,r)},ot.version="18.3.1-next-f1338f8080-20240426",ot}var zs;function Lc(){if(zs)return La.exports;zs=1;function s(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(s)}catch(u){console.error(u)}}return s(),La.exports=zc(),La.exports}var Ls;function Rc(){if(Ls)return gl;Ls=1;var s=Lc();return gl.createRoot=s.createRoot,gl.hydrateRoot=s.hydrateRoot,gl}var Dc=Rc();function Ic(){if(typeof window>"u")return!1;const s=window;return!!(s.SpeechRecognition||s.webkitSpeechRecognition)}function Oc(){if(typeof window>"u")return null;const s=window;return s.SpeechRecognition??s.webkitSpeechRecognition??null}function $c(s){const u=Oc();if(!u)return s.onError("Voice input is not supported in this browser."),null;let o=new u;o.continuous=!0,o.interimResults=!0;try{o.lang=navigator.language||"en-US"}catch{o.lang="en-US"}let d=!1,x="";o.onresult=m=>{var k;let A="",S="";for(let N=m.resultIndex;N<m.results.length;N++){const P=m.results[N],C=((k=P[0])==null?void 0:k.transcript)??"";P.isFinal?S+=C:A+=C}S&&(x=(x+" "+S).trim()),s.onPartial((x+" "+A).trim())},o.onerror=m=>{const A=m.error??"unknown";d||(A==="no-speech"?s.onError("Voice: silence detected. Hold the mic and speak."):A==="not-allowed"||A==="service-not-allowed"?s.onError("Voice: microphone permission denied."):A==="aborted"||s.onError(`Voice error: ${A}`))},o.onend=()=>{d||x&&s.onCommit(x)};try{o.start()}catch(m){return s.onError(m instanceof Error?m.message:"Voice failed to start."),null}return{stop:()=>{try{o==null||o.stop()}catch{}},abort:()=>{d=!0;try{o==null||o.abort()}catch{}o=null}}}function Ia(){return typeof navigator>"u"||!navigator.mediaDevices?!1:typeof navigator.mediaDevices.getUserMedia=="function"&&typeof MediaRecorder<"u"}function Fc(s,u,o={}){return(async()=>{if(!Ia())return u.onError("Voice: this runtime does not expose MediaRecorder."),null;let d;try{d=await navigator.mediaDevices.getUserMedia({audio:!0})}catch(k){const N=k instanceof Error?k.message:"microphone unavailable";return u.onError(`Voice: microphone permission denied or device missing (${N}).`),null}let x=o.preferredMime??"audio/webm;codecs=opus";typeof MediaRecorder.isTypeSupported=="function"&&!MediaRecorder.isTypeSupported(x)&&(x=["audio/webm","audio/ogg;codecs=opus","audio/mp4"].find(P=>MediaRecorder.isTypeSupported(P))??"");const m=x?new MediaRecorder(d,{mimeType:x}):new MediaRecorder(d),A=[];let S=!1;m.addEventListener("dataavailable",k=>{k.data&&k.data.size>0&&A.push(k.data)}),m.addEventListener("stop",()=>{if(d.getTracks().forEach(N=>N.stop()),S||A.length===0)return;const k=new Blob(A,{type:x||"audio/webm"});k.arrayBuffer().then(N=>{const P=Uc(N);return u.onPartial("a transcrever…"),s.transcribeAudio(P,k.type||"audio/webm",o.language)}).then(N=>{if(S)return;const P=((N==null?void 0:N.text)??"").trim();P?u.onCommit(P):u.onError("Voice: silence detected — nada para transcrever.")}).catch(N=>{if(S)return;const P=N instanceof Error?N.message:String(N);u.onError(`Voice: ${P}`)})});try{m.start()}catch(k){return d.getTracks().forEach(N=>N.stop()),u.onError(k instanceof Error?k.message:"recorder failed to start"),null}return{stop:()=>{if(m.state==="recording")try{m.stop()}catch{}},abort:()=>{if(S=!0,m.state==="recording")try{m.stop()}catch{}d.getTracks().forEach(k=>k.stop())}}})()}function Uc(s){const u=new Uint8Array(s);let o="";const d=32768;for(let x=0;x<u.length;x+=d){const m=u.subarray(x,Math.min(x+d,u.length));o+=String.fromCharCode.apply(null,Array.from(m))}return btoa(o)}function Bc(s){const u=[],o=s.split(`
`);let d=0,x=[];function m(){x.length!==0&&(u.push({kind:"prose",body:x.join(`
`)}),x=[])}for(;d<o.length;){const A=o[d],S=A.match(/^```(\w[\w+-]*)?\s*$/);if(S){m();const k=S[1]||null;d++;const N=d;for(;d<o.length&&!o[d].match(/^```\s*$/);)d++;const P=o.slice(N,d).join(`
`);u.push({kind:"code",lang:k,body:P}),d++;continue}x.push(A),d++}return m(),u}const Vc=[[/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/,(s,u)=>p.jsx("a",{href:s[2],target:"_blank",rel:"noopener noreferrer",className:"gauntlet-md__link",children:s[1]},`a-${u}`)],[/`([^`]+)`/,(s,u)=>p.jsx("code",{className:"gauntlet-md__inline-code",children:s[1]},`c-${u}`)],[/\*\*([^*]+)\*\*/,(s,u)=>p.jsx("strong",{className:"gauntlet-md__strong",children:s[1]},`b-${u}`)],[/\*([^*]+)\*/,(s,u)=>p.jsx("em",{className:"gauntlet-md__em",children:s[1]},`i-${u}`)],[/_([^_]+)_/,(s,u)=>p.jsx("em",{className:"gauntlet-md__em",children:s[1]},`u-${u}`)]];function Er(s,u){const o=[];let d=0,x=0;for(;d<s.length;){let m=null;for(const[A,S]of Vc){const N=s.slice(d).match(A);!N||N.index===void 0||(m===null||N.index<m.idx)&&(m={idx:N.index,match:N,render:S})}if(m===null){o.push(s.slice(d));break}m.idx>0&&o.push(s.slice(d,d+m.idx)),o.push(m.render(m.match,u*100+x)),x++,d+=m.idx+m.match[0].length}return o}function Hc(s,u){const o=[],d=s.split(`
`);let x=0,m=u;for(;x<d.length;){const S=d[x].trim();if(!S){x++;continue}const k=S.match(/^(#{1,3})\s+(.*)$/);if(k){const P=k[1].length,B=`h${P}`;o.push(p.jsx(B,{className:`gauntlet-md__h gauntlet-md__h${P}`,children:Er(k[2],m++)},`h-${m++}`)),x++;continue}if(/^---+$/.test(S)||/^\*\*\*+$/.test(S)){o.push(p.jsx("hr",{className:"gauntlet-md__hr"},`hr-${m++}`)),x++;continue}if(S.startsWith(">")){const P=[];for(;x<d.length&&d[x].trim().startsWith(">");)P.push(d[x].replace(/^\s*>\s?/,"")),x++;o.push(p.jsx("blockquote",{className:"gauntlet-md__quote",children:Er(P.join(" "),m++)},`q-${m++}`));continue}if(/^[-*]\s+/.test(S)){const P=[];for(;x<d.length&&/^[-*]\s+/.test(d[x].trim());)P.push(d[x].trim().replace(/^[-*]\s+/,"")),x++;o.push(p.jsx("ul",{className:"gauntlet-md__list",children:P.map((C,B)=>p.jsx("li",{className:"gauntlet-md__li",children:Er(C,m++)},B))},`ul-${m++}`));continue}if(/^\d+\.\s+/.test(S)){const P=[];for(;x<d.length&&/^\d+\.\s+/.test(d[x].trim());)P.push(d[x].trim().replace(/^\d+\.\s+/,"")),x++;o.push(p.jsx("ol",{className:"gauntlet-md__list",children:P.map((C,B)=>p.jsx("li",{className:"gauntlet-md__li",children:Er(C,m++)},B))},`ol-${m++}`));continue}const N=[];for(;x<d.length;){const P=d[x],C=P.trim();if(!C||/^(#{1,3})\s+/.test(C)||/^---+$/.test(C)||/^\*\*\*+$/.test(C)||C.startsWith(">")||/^[-*]\s+/.test(C)||/^\d+\.\s+/.test(C))break;N.push(P),x++}o.push(p.jsx("p",{className:"gauntlet-md__p",children:Er(N.join(" "),m++)},`p-${m++}`))}return o}function Wc({source:s,onCopyBlock:u}){const o=Bc(s);return p.jsx("div",{className:"gauntlet-md",children:o.map((d,x)=>d.kind==="code"?p.jsx(td,{lang:d.lang,body:d.body,onCopy:u},`cb-${x}`):p.jsx("div",{className:"gauntlet-md__prose",children:Hc(d.body,x*1e3)},`pb-${x}`))})}const Kc=new Set(["def","class","if","elif","else","for","while","return","import","from","as","with","try","except","finally","raise","pass","break","continue","in","is","not","and","or","lambda","yield","async","await","global","nonlocal","True","False","None","self","cls","print"]),Yc=new Set(["function","const","let","var","if","else","return","class","export","import","from","as","default","async","await","for","while","try","catch","finally","throw","new","this","super","extends","implements","interface","type","enum","public","private","protected","readonly","static","typeof","instanceof","in","of","null","undefined","true","false","void","switch","case","break","continue","do","yield"]),Qc=new Set(["cd","ls","cat","rm","mv","cp","mkdir","touch","grep","sed","awk","export","source","if","then","else","elif","fi","for","while","do","done","case","esac","exit","npm","npx","git","python","node","tsc","make","vite","wxt","set","get","start-process","select-string"]);function Rs(s,u){if(s[u]!=="#")return-1;const o=s.indexOf(`
`,u);return o===-1?s.length:o}function Jc(s,u){if(s[u]!=="/")return-1;if(s[u+1]==="/"){const o=s.indexOf(`
`,u);return o===-1?s.length:o}if(s[u+1]==="*"){const o=s.indexOf("*/",u+2);return o===-1?s.length:o+2}return-1}const Ds={keywords:Kc,matchComment:Rs},Gc={keywords:Yc,matchComment:Jc},qc={keywords:Qc,matchComment:Rs};function Xc(s){if(!s)return null;const u=s.toLowerCase();return u==="py"||u==="python"||u==="python3"||u==="ipython"||u==="pycon"?Ds:u==="ts"||u==="tsx"||u==="typescript"||u==="js"||u==="jsx"||u==="javascript"||u==="mjs"||u==="json"||u==="json5"?Gc:u==="sh"||u==="bash"||u==="zsh"||u==="shell"||u==="powershell"||u==="ps"||u==="ps1"||u==="console"?qc:null}function Is(s){return s>="a"&&s<="z"||s>="A"&&s<="Z"||s==="_"||s==="$"}function Zc(s){return Is(s)||s>="0"&&s<="9"}function Oa(s){return s>="0"&&s<="9"}function ed(s,u){const o=[];let d="";function x(){d&&(o.push({kind:"p",text:d}),d="")}let m=0;for(;m<s.length;){const A=s[m],S=u.matchComment(s,m);if(S!==-1){x(),o.push({kind:"c",text:s.slice(m,S)}),m=S;continue}if(u===Ds&&(s.startsWith('"""',m)||s.startsWith("'''",m))){x();const k=s.slice(m,m+3);let N=s.indexOf(k,m+3);N=N===-1?s.length:N+3,o.push({kind:"s",text:s.slice(m,N)}),m=N;continue}if(A==='"'||A==="'"||A==="`"){x();let k=m+1;for(;k<s.length&&s[k]!==A;){if(s[k]==="\\"){k+=2;continue}if(s[k]===`
`&&A!=="`")break;k++}const N=k<s.length?k+1:k;o.push({kind:"s",text:s.slice(m,N)}),m=N;continue}if(Oa(A)){x();let k=m;for(;k<s.length&&(Oa(s[k])||s[k]==="."||s[k]==="_");)k++;if(k<s.length&&(s[k]==="e"||s[k]==="E"))for(k++,k<s.length&&(s[k]==="+"||s[k]==="-")&&k++;k<s.length&&Oa(s[k]);)k++;o.push({kind:"n",text:s.slice(m,k)}),m=k;continue}if(Is(A)){x();let k=m+1;for(;k<s.length&&Zc(s[k]);)k++;const N=s.slice(m,k);let P=k;for(;P<s.length&&s[P]===" ";)P++;const C=s[P]==="(";let B="p";u.keywords.has(N)?B="k":C&&(B="f"),o.push({kind:B,text:N}),m=k;continue}d+=A,m++}return x(),o}function td({lang:s,body:u,onCopy:o}){const d=()=>{navigator.clipboard.writeText(u).catch(()=>{}),o==null||o(u)},x=Xc(s),m=x?ed(u,x):null;return p.jsxs("figure",{className:"gauntlet-md__code",children:[p.jsxs("header",{className:"gauntlet-md__code-meta",children:[p.jsx("span",{className:"gauntlet-md__code-lang",children:s??"code"}),p.jsx("button",{type:"button",className:"gauntlet-md__code-copy",onClick:d,"aria-label":"copy code",children:"copy"})]}),p.jsx("pre",{className:"gauntlet-md__code-body",children:m?p.jsx("code",{children:m.map((A,S)=>p.jsx("span",{className:`gauntlet-md__tok gauntlet-md__tok--${A.kind}`,children:A.text},S))}):p.jsx("code",{children:u})})]})}const nd={domains:{},actions:{},default_domain_policy:{allowed:!0,require_danger_ack:!1},default_action_policy:{allowed:!0,require_danger_ack:!1},tool_policies:{},max_page_text_chars:6e3,max_dom_skeleton_chars:4e3,screenshot_default:!1,execution_reporting_required:!1,updated_at:""},rd="2px solid #d07a5a",ld="2px",ad="#gauntlet-capsule-host",od=[/\bpassword\b/i,/\bdelete\b/i,/\bdestroy\b/i,/\bremove\b/i,/\bunsubscribe\b/i,/payment|checkout|billing/i,/credit[-_ ]?card|\bccnum\b|\bcvv\b|\bcvc\b/i],sd=["delete","remove","destroy","drop","discard","apagar","eliminar","remover","destruir","pay","buy","purchase","order","checkout","pagar","comprar","encomendar","confirm","submit","send","publish","enviar","confirmar","publicar","transfer","withdraw","transferir","levantar","cancel subscription","cancelar subscrição","cancelar assinatura"],id=5e3;function ud(s){const u=s.filter(m=>m.type==="fill"),o=s.filter(m=>m.type==="click");if(u.length===0||o.length===0)return{danger:!1};const d=u.find(m=>{const A=m.selector.toLowerCase();return!!(/\bpassword\b/.test(A)||/\bcvv\b|\bcvc\b|\bccnum\b|credit[-_ ]?card/.test(A)||/payment|checkout|billing/.test(A)||/cc-(number|exp|csc|name)/.test(A))});if(!d)return{danger:!1};const x=o.find(m=>{const A=m.selector.toLowerCase();return!!(A.includes("submit")||/\b(pay|buy|purchase|confirm|send|order|checkout|pagar|comprar|enviar|confirmar)\b/.test(A))});return x?{danger:!0,reason:`cadeia destrutiva: fill em "${d.selector}" seguido de click em "${x.selector}"`}:{danger:!1}}function cd(s){var d;if(s.type==="highlight"||s.type==="scroll_to")return{danger:!1};const u=s.selector;for(const x of od)if(x.test(u))return{danger:!0,reason:`selector matches /${x.source}/`};let o=null;try{o=document.querySelector(u)}catch{}if(s.type==="fill")return o instanceof HTMLInputElement&&o.type==="password"?{danger:!0,reason:"password field"}:o instanceof HTMLInputElement&&(((d=o.autocomplete)==null?void 0:d.includes("cc-"))??!1)?{danger:!0,reason:"credit-card autocomplete"}:s.value.length>id?{danger:!0,reason:"unusually long value"}:{danger:!1};if(s.type==="click"){if(o instanceof HTMLButtonElement&&o.type==="submit")return{danger:!0,reason:"submit button"};if(o instanceof HTMLInputElement&&(o.type==="submit"||o.type==="reset"))return{danger:!0,reason:`${o.type} button`};if(o instanceof HTMLElement){const x=(o.innerText??"").trim().toLowerCase();if(x){for(const m of sd)if(x===m||x.startsWith(m+" ")||x.endsWith(" "+m)||x.includes(" "+m+" "))return{danger:!0,reason:`action label: "${m}"`}}}return{danger:!1}}return{danger:!1}}async function dd(s){const u=[];for(const o of s)try{pd(o),await fd(o),u.push({action:o,ok:!0})}catch(d){u.push({action:o,ok:!1,error:d instanceof Error?d.message:String(d)})}return u}function pd(s){const u=s.selector;if(!u||typeof u!="string")throw new Error("selector missing or not a string");if(u.includes(ad))throw new Error(`selector targets the Gauntlet capsule itself: ${u}`);try{document.querySelector(u)}catch{throw new Error(`selector is not valid CSS: ${u}`)}}async function fd(s){if(s.type==="fill"){gd(s.selector,s.value);return}if(s.type==="click"){md(s.selector);return}if(s.type==="highlight"){hd(s.selector,s.duration_ms??1500);return}if(s.type==="scroll_to"){xd(s.selector);return}throw new Error(`unknown action type: ${s.type??"<missing>"}`)}function gd(s,u){var d,x;const o=document.querySelector(s);if(!o)throw new Error(`selector not found: ${s}`);if(o instanceof HTMLInputElement||o instanceof HTMLTextAreaElement){o.focus({preventScroll:!0});const m=o instanceof HTMLInputElement?HTMLInputElement.prototype:HTMLTextAreaElement.prototype,A=(d=Object.getOwnPropertyDescriptor(m,"value"))==null?void 0:d.set;A?A.call(o,u):o.value=u,o.dispatchEvent(new Event("input",{bubbles:!0})),o.dispatchEvent(new Event("change",{bubbles:!0})),o.dispatchEvent(new Event("blur",{bubbles:!0}));return}if(o instanceof HTMLSelectElement){o.focus({preventScroll:!0});const m=(x=Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,"value"))==null?void 0:x.set;m?m.call(o,u):o.value=u,o.dispatchEvent(new Event("input",{bubbles:!0})),o.dispatchEvent(new Event("change",{bubbles:!0})),o.dispatchEvent(new Event("blur",{bubbles:!0}));return}if(o instanceof HTMLElement&&o.isContentEditable){o.focus(),o.textContent=u,o.dispatchEvent(new InputEvent("input",{bubbles:!0}));return}throw new Error(`element at ${s} is not fillable`)}function md(s){const u=document.querySelector(s);if(!u)throw new Error(`selector not found: ${s}`);if(!(u instanceof HTMLElement))throw new Error(`element at ${s} is not clickable`);const o=u.getBoundingClientRect(),d=o.left+o.width/2,x=o.top+o.height/2,m={bubbles:!0,cancelable:!0,view:window,clientX:d,clientY:x,button:0,buttons:1},A={...m,pointerId:1,pointerType:"mouse",isPrimary:!0};u.dispatchEvent(new PointerEvent("pointerdown",A)),u.dispatchEvent(new MouseEvent("mousedown",m)),u.focus({preventScroll:!0}),u.dispatchEvent(new PointerEvent("pointerup",A)),u.dispatchEvent(new MouseEvent("mouseup",m)),u.click()}function hd(s,u){const o=document.querySelectorAll(s);if(o.length===0)throw new Error(`selector not found: ${s}`);for(const d of Array.from(o)){if(!(d instanceof HTMLElement))continue;const x=d.style.outline,m=d.style.outlineOffset;d.style.outline=rd,d.style.outlineOffset=ld,window.setTimeout(()=>{d.style.outline=x,d.style.outlineOffset=m},u)}}function xd(s){const u=document.querySelector(s);if(!u)throw new Error(`selector not found: ${s}`);if(!(u instanceof HTMLElement))throw new Error(`element at ${s} cannot be scrolled to`);u.scrollIntoView({behavior:"smooth",block:"center"})}const $a={},vd=((typeof{url:Ht&&Ht.tagName.toUpperCase()==="SCRIPT"&&Ht.src||new URL("content-scripts/content.js",document.baseURI).href}<"u"?$a==null?void 0:$a.VITE_BACKEND_URL:void 0)??"https://ruberra-backend-jkpf-production.up.railway.app").replace(/\/+$/,"");class yd{constructor(u,o={}){this.ambient=u,this.backendUrl=(o.backendUrl??vd).replace(/\/+$/,"")}captureContext(u,o){return this.ambient.transport.fetchJson("POST",`${this.backendUrl}/composer/context`,u,o)}detectIntent(u,o,d){return this.ambient.transport.fetchJson("POST",`${this.backendUrl}/composer/intent`,{context_id:u,user_input:o},d)}generatePreview(u,o){return this.ambient.transport.fetchJson("POST",`${this.backendUrl}/composer/preview`,{intent_id:u},o)}applyPreview(u,o,d,x){return this.ambient.transport.fetchJson("POST",`${this.backendUrl}/composer/apply`,{preview_id:u,approved:o,approval_reason:d??null},x)}async getToolManifests(u){return(await this.ambient.transport.fetchJson("GET",`${this.backendUrl}/tools/manifests`,void 0,u)).tools??[]}getSettings(u){return this.ambient.transport.fetchJson("GET",`${this.backendUrl}/composer/settings`,void 0,u)}updateSettings(u,o){return this.ambient.transport.fetchJson("PUT",`${this.backendUrl}/composer/settings`,u,o)}reportExecution(u,o){return this.ambient.transport.fetchJson("POST",`${this.backendUrl}/composer/execution`,u,o)}transcribeAudio(u,o,d,x){return this.ambient.transport.fetchJson("POST",`${this.backendUrl}/voice/transcribe`,{audio_base64:u,mime:o,language:d},x)}synthesizeSpeech(u,o,d){return this.ambient.transport.fetchJson("POST",`${this.backendUrl}/voice/synthesize`,{text:u,voice:o},d)}requestDomPlan(u,o,d){return this.ambient.transport.fetchJson("POST",`${this.backendUrl}/composer/dom_plan`,{context_id:u,user_input:o},d)}requestDomPlanStream(u,o,d){return this.ambient.transport.stream?this.ambient.transport.stream(`${this.backendUrl}/composer/dom_plan_stream`,{context_id:u,user_input:o},d):(d.onError("streaming not supported by this ambient"),()=>{})}}const Os="gauntlet:pill_position",Fa="gauntlet:dismissed_domains",$s="gauntlet:screenshot_enabled",Fs="gauntlet:theme",Us="gauntlet:palette_recent",Bs="gauntlet:pill_mode",Vs="gauntlet:tts_enabled",Hs=8,Ws="light",Ks="corner",Ys={bottom:16,right:16};function Qs(s){const u=typeof window<"u"?window.innerWidth:1280,o=typeof window<"u"?window.innerHeight:800,d=4,x=u-d,m=o-d;return{right:Math.max(-14,Math.min(x,s.right)),bottom:Math.max(-14,Math.min(m,s.bottom))}}function Js(s){return{async readPillPosition(){const u=await s.get(Os);return u&&typeof u=="object"&&typeof u.bottom=="number"&&typeof u.right=="number"?Qs(u):Ys},async writePillPosition(u){await s.set(Os,Qs(u))},async readDismissedDomains(){const u=await s.get(Fa);return Array.isArray(u)?u.filter(o=>typeof o=="string"):[]},async dismissDomain(u){if(!u)return;const o=await this.readDismissedDomains();o.includes(u)||await s.set(Fa,[...o,u])},async restoreDomain(u){if(!u)return;const o=await this.readDismissedDomains(),d=o.filter(x=>x!==u);d.length!==o.length&&await s.set(Fa,d)},async isDomainDismissed(u){return u?(await this.readDismissedDomains()).includes(u):!1},async readScreenshotEnabled(){return await s.get($s)===!0},async writeScreenshotEnabled(u){await s.set($s,!!u)},async readTheme(){const u=await s.get(Fs);return u==="dark"||u==="light"?u:Ws},async writeTheme(u){await s.set(Fs,u)},async readPaletteRecent(){const u=await s.get(Us);return Array.isArray(u)?u.filter(o=>typeof o=="string").slice(0,Hs):[]},async notePaletteUse(u){if(!u)return;const o=await this.readPaletteRecent(),d=[u,...o.filter(x=>x!==u)].slice(0,Hs);await s.set(Us,d)},async readPillMode(){const u=await s.get(Bs);return u==="cursor"||u==="corner"?u:Ks},async writePillMode(u){await s.set(Bs,u)},async readTtsEnabled(){return await s.get(Vs)===!0},async writeTtsEnabled(u){await s.set(Vs,!!u)}}}function _d({ambient:s,initialSnapshot:u,onDismiss:o,cursorAnchor:d}){var Rn,tr,Cl;const x=b.useMemo(()=>new yd(s),[s]),m=b.useMemo(()=>Js(s.storage),[s]),A=(Rn=s.domActions)==null?void 0:Rn.execute,[S,k]=b.useState(u),[N,P]=b.useState(""),[C,B]=b.useState("idle"),[ie,ne]=b.useState(null),[te,oe]=b.useState(!1),[L,ke]=b.useState(null),[Ae,_e]=b.useState(null),[F,T]=b.useState(!1),[R,U]=b.useState(""),[Y,he]=b.useState(!1),[Ne,Se]=b.useState(Ws),[q,Ee]=b.useState([]),[xe,Pe]=b.useState([]),[fe,$]=b.useState(0),[G,D]=b.useState(!1),f=b.useRef(!1),E=b.useRef(null),[ee,re]=b.useState(!1),de=b.useRef(""),[pe,le]=b.useState(null),[ue,me]=b.useState([]),[Le,nt]=b.useState(null),[qe,ln]=b.useState(nd),rt=b.useRef(null),Jn=b.useRef(null),Lt=b.useRef(null),Rt=b.useRef(""),jn=b.useRef(!1),[Ar,an]=b.useState(0),Qe=b.useRef(null),[on,Kt]=b.useState(!1),[Gn,ft]=b.useState(!1),[qn,Xn]=b.useState(null),Dt=b.useMemo(()=>L?L.actions.map(cd):[],[L]),Yt=b.useMemo(()=>L?ud(L.actions):{danger:!1},[L]),It=b.useMemo(()=>{if(!L||L.actions.length===0)return{forced:!1,reason:null};let _="";try{_=new URL(S.url).hostname.toLowerCase()}catch{}if((qe.domains[_]??qe.default_domain_policy).require_danger_ack)return{forced:!0,reason:_?`policy: domain '${_}' requires explicit confirmation`:"policy: default domain policy requires explicit confirmation"};for(const V of L.actions)if((qe.actions[V.type]??qe.default_action_policy).require_danger_ack)return{forced:!0,reason:`policy: action type '${V.type}' requires explicit confirmation`};return{forced:!1,reason:null}},[L,S.url,qe]),st=Dt.some(_=>_.danger)||Yt.danger||It.forced;b.useEffect(()=>{var _;return(_=rt.current)==null||_.focus(),()=>{var O,V;(O=Jn.current)==null||O.abort(),(V=Lt.current)==null||V.call(Lt)}},[]),b.useEffect(()=>{k(u)},[u]),b.useEffect(()=>{let _=!1;return x.getToolManifests().then(O=>{_||Ee(O)}).catch(()=>{}),m.readPaletteRecent().then(O=>{_||Pe(O)}),()=>{_=!0}},[x,m]),b.useEffect(()=>{const _=!!S.text;_&&!f.current&&(D(!0),E.current!==null&&window.clearTimeout(E.current),E.current=window.setTimeout(()=>{D(!1),E.current=null},700)),f.current=_},[S.text]),b.useEffect(()=>()=>{E.current!==null&&(window.clearTimeout(E.current),E.current=null)},[]),b.useEffect(()=>{let _=!1;m.readTtsEnabled().then(V=>{_||re(V)});function O(V){const ce=V.detail;typeof(ce==null?void 0:ce.enabled)=="boolean"&&re(ce.enabled)}return window.addEventListener("gauntlet:tts",O),()=>{_=!0,window.removeEventListener("gauntlet:tts",O)}},[m]),b.useEffect(()=>{if(!ee||C!=="plan_ready")return;const _=L==null?void 0:L.compose;if(_&&_!==de.current&&!(typeof window>"u"||!window.speechSynthesis))try{window.speechSynthesis.cancel();const O=new SpeechSynthesisUtterance(_);O.rate=1.05,O.pitch=1,window.speechSynthesis.speak(O),de.current=_}catch{}},[ee,C,L==null?void 0:L.compose]),b.useEffect(()=>()=>{var _;try{(_=window.speechSynthesis)==null||_.cancel()}catch{}},[]),b.useEffect(()=>{let _=!1;return m.readTheme().then(O=>{_||Se(O)}),()=>{_=!0}},[m]),b.useEffect(()=>{let _=!1;return x.getSettings().then(O=>{_||ln(O)}).catch(()=>{}),()=>{_=!0}},[x]),b.useEffect(()=>{if(!s.capabilities.screenshot||!s.screenshot)return;let _=!1;return m.readScreenshotEnabled().then(O=>{const V=O||qe.screenshot_default;_||!V||s.screenshot.capture().then(ce=>{_||!ce||le(ce)}).catch(()=>{})}),()=>{_=!0}},[s,m,qe.screenshot_default]);const wl=b.useCallback(()=>{k(s.selection.read())},[s]),kl=b.useCallback(()=>{if(Qe.current)return;ne(null);const _=N,O={onPartial:ce=>{P(_?`${_} ${ce}`.trim():ce)},onCommit:ce=>{var ve;P(_?`${_} ${ce}`.trim():ce),Kt(!1),Qe.current=null,(ve=rt.current)==null||ve.focus()},onError:ce=>{ne(ce),Kt(!1),Qe.current=null}};if(s.capabilities.remoteVoice&&Ia()){Kt(!0),Fc(x,O).then(ce=>{ce?Qe.current=ce:Kt(!1)});return}const V=$c(O);V&&(Qe.current=V,Kt(!0))},[N,s,x]),Nr=b.useCallback(()=>{var _;(_=Qe.current)==null||_.stop()},[]),bl=b.useCallback(()=>{var _;(_=Qe.current)==null||_.abort(),Qe.current=null,Kt(!1)},[]);b.useEffect(()=>()=>{var _;(_=Qe.current)==null||_.abort()},[]),b.useEffect(()=>{function _(O){(O.metaKey||O.ctrlKey)&&(O.key==="k"||O.key==="K")&&(O.preventDefault(),O.stopPropagation(),ft(ce=>!ce))}return window.addEventListener("keydown",_,!0),()=>window.removeEventListener("keydown",_,!0)},[]);const Mn=b.useCallback(_=>{Xn(_),window.setTimeout(()=>Xn(null),1400)},[]),Zn=b.useCallback(async()=>{const _=(L==null?void 0:L.compose)||S.text||N.trim();if(!_){ne("Nada para guardar — escreve um pedido ou recebe uma resposta.");return}const O=(N.trim()||S.pageTitle||"cápsula note").slice(0,200);try{await s.transport.fetchJson("POST",`${x.backendUrl}/memory/records`,{topic:O,body:_,kind:"note",scope:"user"}),Mn("saved")}catch(V){ne(V instanceof Error?`memória: ${V.message}`:"memória: falhou")}},[s,x,L,S,N,Mn]),Ct=b.useCallback(async(_,O=[],V)=>{if(!L||L.actions.length===0)return;jn.current=!0;const ce=L.actions.map((se,Ce)=>{const Te=O[Ce],Re=Dt[Ce];return{action:se,ok:Te?Te.ok:!1,error:(Te==null?void 0:Te.error)??null,danger:(Re==null?void 0:Re.danger)??!1,danger_reason:(Re==null?void 0:Re.reason)??null}}),ve={plan_id:L.plan_id||null,context_id:L.context_id||null,url:S.url||null,page_title:S.pageTitle||null,status:_,results:ce,has_danger:st,sequence_danger_reason:Yt.danger?Yt.reason??null:null,danger_acknowledged:F,error:V??null,model_used:L.model_used||null,plan_latency_ms:L.latency_ms||null,user_input:N.trim()||null};if(qe.execution_reporting_required)try{await x.reportExecution(ve)}catch(se){const Ce=se instanceof Error?se.message:String(se);ne(`policy: execution report rejected — ${Ce}`),B("error")}else x.reportExecution(ve).catch(()=>{})},[x,L,S,Dt,st,Yt,F,N,qe.execution_reporting_required]),sn=b.useCallback(()=>{L&&L.actions.length>0&&!jn.current&&Ct("rejected"),o()},[L,o,Ct]);b.useEffect(()=>{function _(O){if(O.key==="Escape"){if(O.preventDefault(),O.stopPropagation(),Gn){ft(!1);return}if(Qe.current){bl();return}sn()}}return window.addEventListener("keydown",_,!0),()=>window.removeEventListener("keydown",_,!0)},[sn,Gn,bl]);const Tr=b.useCallback(async()=>{const _=s.filesystem;if(_){nt(null);try{const O=await _.pickFile();if(!O)return;const V=O.name.toLowerCase();if(/\.(png|jpe?g|gif|webp|svg)$/.test(V)){const{base64:ve,mime:se}=await _.readFileBase64(O.path),Ce=Math.ceil(ve.length*3/4);me(Te=>[...Te,{id:`att-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,kind:"image",name:O.name,mime:se,bytes:Ce,base64:ve,path:O.path}])}else{const ve=await _.readTextFile(O.path);me(se=>[...se,{id:`att-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,kind:"text",name:O.name,mime:"text/plain",bytes:new TextEncoder().encode(ve).length,text:ve,path:O.path}])}}catch(O){nt(O instanceof Error?O.message:String(O))}}},[s]),un=b.useCallback(async()=>{var O;const _=(O=s.screenshot)==null?void 0:O.captureScreen;if(_){nt(null);try{const V=await _();if(!V){nt("Captura de ecrã indisponível neste sistema.");return}const ce=Math.ceil(V.base64.length*3/4);me(ve=>[...ve,{id:`att-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,kind:"image",name:`ecrã-${new Date().toISOString().slice(11,19)}.png`,mime:"image/png",bytes:ce,base64:V.base64,path:V.path}])}catch(V){nt(V instanceof Error?V.message:String(V))}}},[s]),cn=b.useCallback(_=>{me(O=>O.filter(V=>V.id!==_))},[]),[Pr,jr]=b.useState(null),Sl=b.useCallback(async()=>{const _=s.filesystem;if(!(_!=null&&_.pickSavePath)||!_.writeTextFile)return;const O=(L==null?void 0:L.compose)??"";if(O.trim()){nt(null);try{const ce=`${(S.pageTitle||"gauntlet-compose").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,60)||"gauntlet-compose"}.md`,ve=await _.pickSavePath(ce,["md","txt","json"]);if(!ve)return;const se=await _.writeTextFile(ve,O);jr(`${ve.split(/[\\/]/).pop()??"ficheiro"} (${se<1024?`${se} B`:`${Math.round(se/1024)} KB`})`),window.setTimeout(()=>jr(null),2500)}catch(V){nt(V instanceof Error?V.message:String(V))}}},[s,L,S.pageTitle]),Mr=b.useCallback(_=>{if(ue.length===0)return _;const O=[];for(const V of ue)if(V.kind==="text"&&V.text!=null)O.push(`<file name="${V.name}" path="${V.path??""}">
${V.text}
</file>`);else if(V.kind==="image"){const ce=Math.max(1,Math.round(V.bytes/1024));O.push(`<image name="${V.name}" bytes="${V.bytes}" mime="${V.mime}">[${ce} KB image attached — describe in prompt; multimodal payload arrives in A2]</image>`)}return`${O.join(`

`)}

${_}`},[ue]),zn=b.useCallback(async()=>{var ce,ve;if(!N.trim()||C==="planning"||C==="streaming"||C==="executing")return;L&&L.actions.length>0&&!jn.current&&Ct("rejected"),(ce=Jn.current)==null||ce.abort(),(ve=Lt.current)==null||ve.call(Lt);const _=new AbortController;Jn.current=_,B("planning"),ne(null),ke(null),_e(null),T(!1),oe(!1),U(""),an(0),Rt.current="",jn.current=!1;const O=await m.readScreenshotEnabled(),V=Cd(S,O?pe:null);try{const se=await x.captureContext(V,_.signal);if(_.signal.aborted)return;const Ce=Mr(N.trim());Lt.current=x.requestDomPlanStream(se.context_id,Ce,{onDelta:Te=>{if(_.signal.aborted)return;Rt.current+=Te,an(yt=>yt+1);const Re=Ed(Rt.current);Re!==null?(U(Re),B(yt=>yt==="planning"?"streaming":yt)):B(yt=>yt==="planning"?"streaming":yt)},onDone:Te=>{_.signal.aborted||(ke(Te),B("plan_ready"),U(""),Rt.current="")},onError:Te=>{_.signal.aborted||(async()=>{try{const Re=await x.requestDomPlan(se.context_id,Ce,_.signal);if(_.signal.aborted)return;ke(Re),B("plan_ready"),U(""),Rt.current=""}catch(Re){if(_.signal.aborted)return;const yt=Re instanceof Error?Re.message:String(Re);ne(`stream: ${Te} · fallback: ${yt}`),B("error"),U(""),Rt.current=""}})()}})}catch(se){if(_.signal.aborted)return;ne(se instanceof Error?se.message:String(se)),B("error")}},[x,S,pe,N,C,L,Ct,Mr,m]),zr=b.useCallback(_=>{var O;_.preventDefault(),$(V=>V+1);try{(O=window.speechSynthesis)==null||O.cancel()}catch{}de.current="",zn()},[zn]),El=b.useCallback(_=>{_.key==="Enter"&&(_.shiftKey||(_.preventDefault(),zn()))},[zn]),dn=b.useCallback(async()=>{if(L!=null&&L.compose)try{await navigator.clipboard.writeText(L.compose),oe(!0),window.setTimeout(()=>oe(!1),1500)}catch{ne("Clipboard write blocked. Select the text and copy manually.")}},[L]),Lr=b.useCallback(async()=>{if(!(!A||!L||L.actions.length===0)&&!(st&&!F)){B("executing"),ne(null);try{const _=await A(L.actions);_e(_),B("executed");const O=_.every(V=>V.ok);window.dispatchEvent(new CustomEvent("gauntlet:execute-result",{detail:{ok:O}})),await Ct("executed",_)}catch(_){const O=_ instanceof Error?_.message:String(_);ne(O),B("error"),window.dispatchEvent(new CustomEvent("gauntlet:execute-result",{detail:{ok:!1}})),await Ct("failed",[],O)}}},[A,L,st,F,Ct]),Ot=b.useMemo(()=>S.bbox?S.bbox:d?{x:d.x,y:d.y,width:0,height:0}:null,[S.bbox,d]),Ha=b.useMemo(()=>{if(!Ot)return;const _=typeof window<"u"?window.innerWidth:1280,O=typeof window<"u"?window.innerHeight:800,V=Nd(_,O),ce=Td(Ot,{width:_,height:O},V);return{top:`${ce.top}px`,left:`${ce.left}px`}},[Ot]),Ln=`gauntlet-capsule--phase-${C}`,er=["gauntlet-capsule","gauntlet-capsule--floating",Ot?"gauntlet-capsule--anchored":"gauntlet-capsule--centered",S.text?null:"gauntlet-capsule--no-selection",Ln].filter(Boolean).join(" ");return b.useEffect(()=>{window.dispatchEvent(new CustomEvent("gauntlet:phase",{detail:{phase:C}}))},[C]),p.jsxs("div",{className:er,"data-theme":Ne,role:"dialog","aria-label":"Gauntlet",style:Ha,children:[p.jsx("div",{className:"gauntlet-capsule__aurora","aria-hidden":!0}),p.jsxs("div",{className:"gauntlet-capsule__layout",children:[p.jsxs("div",{className:"gauntlet-capsule__panel gauntlet-capsule__panel--left",children:[p.jsxs("header",{className:"gauntlet-capsule__header",children:[p.jsxs("div",{className:"gauntlet-capsule__brand-block",children:[p.jsx("span",{className:"gauntlet-capsule__mark","aria-hidden":!0,children:p.jsx("span",{className:"gauntlet-capsule__mark-dot"})}),p.jsxs("div",{className:"gauntlet-capsule__brand-text",children:[p.jsx("span",{className:"gauntlet-capsule__brand",children:"GAUNTLET"}),p.jsx("span",{className:"gauntlet-capsule__tagline",children:"cursor · capsule"})]})]}),p.jsxs("div",{className:"gauntlet-capsule__header-actions",children:[p.jsx("button",{type:"button",className:"gauntlet-capsule__settings-btn",onClick:()=>he(_=>!_),"aria-label":"Definições","aria-expanded":Y,title:"Definições",children:p.jsx("span",{"aria-hidden":!0,children:"···"})}),p.jsx("button",{type:"button",className:"gauntlet-capsule__close",onClick:sn,"aria-label":"Dismiss capsule (Esc)",children:p.jsx("span",{"aria-hidden":!0,children:"esc"})})]})]}),Y&&p.jsx(Sd,{onClose:()=>he(!1),showScreenshot:s.capabilities.screenshot,showDismissedDomains:s.capabilities.dismissDomain,showPillMode:s.capabilities.pillSurface,prefs:m,theme:Ne,onChangeTheme:_=>{Se(_),m.writeTheme(_)}}),p.jsxs("section",{className:"gauntlet-capsule__context",children:[p.jsxs("div",{className:"gauntlet-capsule__context-meta",children:[p.jsx("span",{className:`gauntlet-capsule__source${G?" gauntlet-capsule__source--popped":""}`,children:"browser"}),p.jsx("span",{className:"gauntlet-capsule__url",title:S.url,children:S.pageTitle||S.url}),p.jsx("button",{type:"button",className:"gauntlet-capsule__refresh",onClick:wl,title:"Re-read current selection",children:"re-read"})]}),S.text?p.jsx("pre",{className:"gauntlet-capsule__selection",children:Gs(S.text,600)}):p.jsx(bd,{snapshot:S,screenshotEnabled:pe!==null})]})]}),p.jsxs("div",{className:"gauntlet-capsule__panel gauntlet-capsule__panel--right",children:[p.jsxs("form",{className:"gauntlet-capsule__form",onSubmit:zr,children:[ue.length>0&&p.jsx("div",{className:"gauntlet-capsule__attachments","aria-label":"Anexos",children:ue.map(_=>p.jsxs("span",{className:`gauntlet-capsule__attachment gauntlet-capsule__attachment--${_.kind}`,title:_.path??_.name,children:[p.jsx("span",{className:"gauntlet-capsule__attachment-icon","aria-hidden":!0,children:_.kind==="image"?"◫":"⌥"}),p.jsx("span",{className:"gauntlet-capsule__attachment-name",children:_.name}),p.jsx("span",{className:"gauntlet-capsule__attachment-size",children:_.bytes<1024?`${_.bytes} B`:_.bytes<1048576?`${Math.round(_.bytes/1024)} KB`:`${(_.bytes/1048576).toFixed(1)} MB`}),p.jsx("button",{type:"button",className:"gauntlet-capsule__attachment-remove",onClick:()=>cn(_.id),"aria-label":`Remover ${_.name}`,children:"×"})]},_.id))}),Le&&p.jsx("div",{className:"gauntlet-capsule__attach-error",role:"alert",children:Le}),p.jsx("textarea",{ref:rt,className:"gauntlet-capsule__input",placeholder:"O que queres? — Enter para enviar, Shift+Enter nova linha",value:N,onChange:_=>P(_.target.value),onKeyDown:El,rows:2,disabled:C==="planning"||C==="streaming"||C==="executing"}),p.jsxs("div",{className:"gauntlet-capsule__actions",children:[p.jsxs("span",{className:"gauntlet-capsule__hint","aria-hidden":!0,children:[p.jsx("span",{className:"gauntlet-capsule__kbd",children:"↵"}),p.jsx("span",{className:"gauntlet-capsule__kbd-sep",children:"·"}),p.jsx("span",{className:"gauntlet-capsule__kbd",children:"⌘K"})]}),s.capabilities.filesystemRead&&s.filesystem&&p.jsxs("button",{type:"button",className:"gauntlet-capsule__attach-btn",onClick:()=>void Tr(),"aria-label":"Anexar ficheiro local",title:"Anexar ficheiro do disco",disabled:C==="planning"||C==="streaming"||C==="executing",children:[p.jsx("svg",{viewBox:"0 0 24 24",width:"13",height:"13","aria-hidden":!0,children:p.jsx("path",{d:"M14 4l-2 0 0 8-3 0 4 5 4-5-3 0 0-8z",transform:"rotate(45 12 12)",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinejoin:"round"})}),p.jsx("span",{className:"gauntlet-capsule__attach-label",children:"anexar"})]}),s.capabilities.screenCapture&&((tr=s.screenshot)==null?void 0:tr.captureScreen)&&p.jsxs("button",{type:"button",className:"gauntlet-capsule__attach-btn",onClick:()=>void un(),"aria-label":"Capturar ecrã inteiro",title:"Capturar ecrã inteiro",disabled:C==="planning"||C==="streaming"||C==="executing",children:[p.jsxs("svg",{viewBox:"0 0 24 24",width:"13",height:"13","aria-hidden":!0,children:[p.jsx("rect",{x:"3",y:"5",width:"18",height:"13",rx:"2",fill:"none",stroke:"currentColor",strokeWidth:"1.6"}),p.jsx("circle",{cx:"12",cy:"11.5",r:"2.4",fill:"none",stroke:"currentColor",strokeWidth:"1.6"})]}),p.jsx("span",{className:"gauntlet-capsule__attach-label",children:"ecrã"})]}),(Ic()||s.capabilities.remoteVoice&&Ia())&&p.jsxs("button",{type:"button",className:`gauntlet-capsule__voice${on?" gauntlet-capsule__voice--active":""}`,onPointerDown:_=>{_.preventDefault(),kl()},onPointerUp:()=>Nr(),onPointerLeave:()=>{on&&Nr()},"aria-label":on?"A ouvir — solta para enviar":"Premer e falar",title:"Premir e falar",disabled:C==="planning"||C==="streaming"||C==="executing",children:[p.jsxs("svg",{viewBox:"0 0 24 24",width:"13",height:"13","aria-hidden":!0,children:[p.jsx("path",{d:"M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3z",fill:"currentColor"}),p.jsx("path",{d:"M19 11a7 7 0 0 1-14 0M12 18v3",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",fill:"none"})]}),p.jsx("span",{className:"gauntlet-capsule__voice-label",children:on?"a ouvir":"voz"})]}),p.jsxs("button",{type:"submit",className:"gauntlet-capsule__compose",disabled:C==="planning"||C==="streaming"||C==="executing"||!N.trim(),children:[fe>0&&p.jsx("span",{className:"gauntlet-capsule__compose-ripple","aria-hidden":!0},fe),C==="planning"||C==="streaming"?p.jsxs(p.Fragment,{children:[p.jsx("span",{className:"gauntlet-capsule__compose-spinner","aria-hidden":!0}),p.jsx("span",{children:C==="planning"?"a pensar":"a escrever"})]}):"Enviar"]})]})]}),C==="streaming"&&R&&p.jsxs("section",{className:"gauntlet-capsule__compose-result gauntlet-capsule__compose-result--streaming",children:[p.jsxs("header",{className:"gauntlet-capsule__compose-meta",children:[p.jsx("span",{className:"gauntlet-capsule__compose-tag",children:"resposta"}),p.jsxs("span",{className:"gauntlet-capsule__compose-meta-text",children:[p.jsxs("span",{className:"gauntlet-capsule__token-counter","aria-live":"polite",children:[Ar," chunks"]}),p.jsx("span",{"aria-hidden":!0,children:"·"}),p.jsx("span",{children:"a escrever…"})]})]}),p.jsxs("div",{className:"gauntlet-capsule__compose-text gauntlet-capsule__compose-text--streaming",children:[R,p.jsx("span",{className:"gauntlet-capsule__compose-caret","aria-hidden":!0,children:"▍"})]})]}),(C==="planning"||C==="streaming"&&!R)&&p.jsxs("section",{className:"gauntlet-capsule__skeleton",role:"status","aria-live":"polite","aria-label":"A pensar...",children:[p.jsxs("header",{className:"gauntlet-capsule__skeleton-header",children:[p.jsx("span",{className:"gauntlet-capsule__skeleton-tag"}),p.jsx("span",{className:"gauntlet-capsule__skeleton-meta"})]}),p.jsx("div",{className:"gauntlet-capsule__skeleton-line gauntlet-capsule__skeleton-line--w90"}),p.jsx("div",{className:"gauntlet-capsule__skeleton-line gauntlet-capsule__skeleton-line--w75"}),p.jsx("div",{className:"gauntlet-capsule__skeleton-line gauntlet-capsule__skeleton-line--w55"})]}),(L==null?void 0:L.compose)&&C==="plan_ready"&&p.jsxs("section",{className:"gauntlet-capsule__compose-result",children:[p.jsxs("header",{className:"gauntlet-capsule__compose-meta",children:[p.jsx("span",{className:"gauntlet-capsule__compose-tag",children:"resposta"}),p.jsxs("span",{className:"gauntlet-capsule__compose-meta-text",children:[L.model_used," · ",L.latency_ms," ms"]})]}),p.jsx("div",{className:"gauntlet-capsule__compose-text",children:p.jsx(Wc,{source:L.compose,onCopyBlock:()=>Mn("code copied")})}),p.jsxs("div",{className:"gauntlet-capsule__compose-actions",children:[p.jsx("button",{type:"button",className:"gauntlet-capsule__copy",onClick:()=>void dn(),children:te?"copiado ✓":"Copy"}),p.jsx("button",{type:"button",className:"gauntlet-capsule__copy gauntlet-capsule__copy--ghost",onClick:()=>void Zn(),children:qn==="saved"?"guardado ✓":"Save"}),s.capabilities.filesystemWrite&&((Cl=s.filesystem)==null?void 0:Cl.writeTextFile)&&p.jsx("button",{type:"button",className:"gauntlet-capsule__copy gauntlet-capsule__copy--ghost",onClick:()=>void Sl(),title:"Guardar resposta para um ficheiro",children:Pr?`→ ${Pr}`:"Guardar como"})]})]}),L&&L.actions.length===0&&!L.compose&&C==="plan_ready"&&p.jsx("section",{className:"gauntlet-capsule__plan",children:p.jsx("p",{className:"gauntlet-capsule__plan-empty",children:L.reason??"Modelo não conseguiu planear."})}),L&&L.actions.length>0&&(C==="plan_ready"||C==="executing"||C==="executed")&&p.jsxs("section",{className:"gauntlet-capsule__plan",children:[p.jsxs("header",{className:"gauntlet-capsule__plan-header",children:[p.jsx("span",{className:"gauntlet-capsule__plan-title",children:"plano"}),p.jsxs("span",{className:"gauntlet-capsule__plan-meta",children:[L.actions.length," action",L.actions.length===1?"":"s"," · ",L.model_used," · ",L.latency_ms," ms"]})]}),p.jsx("ol",{className:"gauntlet-capsule__plan-list",children:L.actions.map((_,O)=>{const V=Ae==null?void 0:Ae[O],ce=V?V.ok?"ok":"fail":"pending",ve=Dt[O];return p.jsxs("li",{className:`gauntlet-capsule__plan-item gauntlet-capsule__plan-item--${ce}${ve!=null&&ve.danger?" gauntlet-capsule__plan-item--danger":""}`,children:[p.jsx("span",{className:"gauntlet-capsule__plan-step",children:O+1}),p.jsx("span",{className:"gauntlet-capsule__plan-desc",children:Ad(_)}),(ve==null?void 0:ve.danger)&&p.jsx("span",{className:"gauntlet-capsule__plan-danger",title:ve.reason,children:"sensível"}),V&&!V.ok&&p.jsx("span",{className:"gauntlet-capsule__plan-err",title:V.error,children:V.error})]},`${O}-${_.type}-${_.selector}`)})}),C!=="executed"&&st&&p.jsxs("div",{className:"gauntlet-capsule__danger-gate",role:"alert",children:[p.jsxs("header",{className:"gauntlet-capsule__danger-header",children:[p.jsx("span",{className:"gauntlet-capsule__danger-mark","aria-hidden":!0,children:"!"}),p.jsx("span",{className:"gauntlet-capsule__danger-title",children:"Acções sensíveis no plano"})]}),p.jsxs("ul",{className:"gauntlet-capsule__danger-list",children:[It.forced&&It.reason&&p.jsxs("li",{children:[p.jsx("strong",{children:"governança:"})," ",It.reason]},"danger-policy"),Yt.danger&&p.jsxs("li",{children:[p.jsx("strong",{children:"cadeia:"})," ",Yt.reason??"flagged"]},"danger-sequence"),Dt.map((_,O)=>_.danger?p.jsxs("li",{children:[p.jsxs("strong",{children:["step ",O+1,":"]})," ",_.reason??"flagged"]},`danger-${O}`):null)]}),p.jsxs("label",{className:"gauntlet-capsule__danger-confirm",children:[p.jsx("input",{type:"checkbox",checked:F,onChange:_=>T(_.target.checked),disabled:C==="executing"}),p.jsx("span",{children:"Confirmo, executar mesmo assim."})]})]}),C!=="executed"&&A&&p.jsx("div",{className:"gauntlet-capsule__plan-actions",children:p.jsx("button",{type:"button",className:`gauntlet-capsule__execute${st?" gauntlet-capsule__execute--danger":""}`,onClick:()=>void Lr(),disabled:C==="executing"||st&&!F,children:C==="executing"?"executando…":st?"Executar com cuidado":"Executar"})}),C!=="executed"&&!A&&p.jsx("p",{className:"gauntlet-capsule__plan-empty",children:"esta superfície não tem acesso a uma página viva — abre o Gauntlet num separador para executar acções."})]}),C==="error"&&ie&&p.jsxs("div",{className:"gauntlet-capsule__error",role:"alert",children:[p.jsx("span",{className:"gauntlet-capsule__error-icon","aria-hidden":!0,children:"!"}),p.jsx("span",{children:ie})]})]})]}),Gn&&p.jsx(kd,{onClose:()=>ft(!1),recentIds:xe,actions:(()=>{const _=se=>{Pe(Ce=>[se,...Ce.filter(Re=>Re!==se)].slice(0,8)),m.notePaletteUse(se)},O=se=>{P(Ce=>{const Te=Ce.trimEnd(),Re=`usa a tool ${se} para `;return Te.startsWith("usa a tool ")?Re:Te?`${Re}${Te}`:Re}),window.setTimeout(()=>{const Ce=rt.current;Ce&&(Ce.focus(),Ce.setSelectionRange(Ce.value.length,Ce.value.length))},0)},V=[{id:"focus",label:"Focar input",shortcut:"↵",group:"action",run:()=>{_("focus"),ft(!1),window.setTimeout(()=>{var se;return(se=rt.current)==null?void 0:se.focus()},0)}},{id:"copy",label:"Copiar resposta",shortcut:"⌘C",group:"action",disabled:!(L!=null&&L.compose),run:()=>{_("copy"),ft(!1),dn()}},{id:"save",label:"Guardar em memória",shortcut:"S",group:"action",disabled:!(L!=null&&L.compose)&&!S.text&&!N.trim(),run:()=>{_("save"),ft(!1),Zn()}},{id:"reread",label:"Re-ler contexto",shortcut:"R",group:"action",run:()=>{_("reread"),ft(!1),wl()}},{id:"clear",label:"Limpar input",shortcut:"X",group:"action",disabled:!N,run:()=>{var se;_("clear"),ft(!1),P(""),(se=rt.current)==null||se.focus()}},{id:"dismiss",label:"Fechar cápsula",shortcut:"Esc",group:"action",run:()=>{_("dismiss"),ft(!1),sn()}}],ve=q.filter(se=>{var Te;const Ce=(Te=qe.tool_policies)==null?void 0:Te[se.name];return!Ce||Ce.allowed!==!1}).map(se=>{var Ce,Te;return{id:`tool:${se.name}`,label:se.name,description:se.description,shortcut:"",group:"tool",mode:se.mode,risk:se.risk,requiresApproval:((Te=(Ce=qe.tool_policies)==null?void 0:Ce[se.name])==null?void 0:Te.require_approval)===!0,run:()=>{_(`tool:${se.name}`),ft(!1),O(se.name)}}});return[...V,...ve]})()}),qn&&p.jsx("div",{className:"gauntlet-capsule__flash",role:"status","aria-live":"polite",children:qn})]})}function wd(s,u){if(!s)return 0;const o=s.toLowerCase(),d=u.toLowerCase();if(d.includes(o))return 1e3-d.indexOf(o);let x=0,m=0,A=-2;for(let S=0;S<d.length&&x<o.length;S++)d[S]===o[x]&&(S!==A+1&&m++,A=S,x++);return x<o.length?-1:500-m*10-(d.length-o.length)}function kd({actions:s,onClose:u,recentIds:o}){const[d,x]=b.useState(""),[m,A]=b.useState(0),S=b.useRef(null);b.useEffect(()=>{var P;(P=S.current)==null||P.focus()},[]);const k=b.useMemo(()=>{if(!d){const C=new Map(o.map((ne,te)=>[ne,te])),B=ne=>{const te=C.get(ne.id);return te===void 0?o.length:te};return[...s].sort((ne,te)=>{const oe=B(ne),L=B(te);if(oe!==L)return oe-L;const ke=F=>F==="tool"?1:0,Ae=ke(ne.group),_e=ke(te.group);return Ae!==_e?Ae-_e:ne.label.localeCompare(te.label)})}return s.map(C=>{const B=`${C.label} ${C.id} ${C.description??""}`;return{a:C,score:wd(d,B)}}).filter(C=>C.score>=0).sort((C,B)=>B.score-C.score).map(C=>C.a)},[s,d,o]);b.useEffect(()=>{m>=k.length&&A(0)},[k.length,m]);const N=b.useCallback(P=>{if(P.key==="ArrowDown")P.preventDefault(),A(C=>Math.min(C+1,k.length-1));else if(P.key==="ArrowUp")P.preventDefault(),A(C=>Math.max(C-1,0));else if(P.key==="Enter"){P.preventDefault();const C=k[m];C&&!C.disabled&&C.run()}},[k,m]);return p.jsxs("div",{className:"gauntlet-capsule__palette",role:"dialog","aria-label":"Command palette",children:[p.jsx("div",{className:"gauntlet-capsule__palette-scrim",onClick:u}),p.jsxs("div",{className:"gauntlet-capsule__palette-panel",onKeyDown:N,children:[p.jsx("input",{ref:S,className:"gauntlet-capsule__palette-input",type:"text",placeholder:"comandos · tools…  (↑↓ para navegar, ↵ para correr, esc para fechar)",value:d,onChange:P=>x(P.target.value)}),p.jsx("ul",{className:"gauntlet-capsule__palette-list",role:"listbox",children:k.length===0?p.jsx("li",{className:"gauntlet-capsule__palette-empty",children:"sem resultados"}):k.map((P,C)=>p.jsxs("li",{role:"option","aria-selected":C===m,"aria-disabled":P.disabled,onMouseEnter:()=>A(C),onClick:()=>{P.disabled||P.run()},className:`gauntlet-capsule__palette-item${C===m?" gauntlet-capsule__palette-item--active":""}${P.disabled?" gauntlet-capsule__palette-item--disabled":""}${P.group==="tool"?" gauntlet-capsule__palette-item--tool":""}`,children:[p.jsxs("div",{className:"gauntlet-capsule__palette-main",children:[p.jsx("span",{className:"gauntlet-capsule__palette-label",children:P.label}),P.description&&p.jsx("span",{className:"gauntlet-capsule__palette-desc",children:P.description})]}),p.jsxs("div",{className:"gauntlet-capsule__palette-meta",children:[P.mode&&p.jsx("span",{className:`gauntlet-capsule__palette-badge gauntlet-capsule__palette-badge--mode-${P.mode}`,title:`mode: ${P.mode}`,children:P.mode}),P.risk&&P.risk!=="low"&&p.jsx("span",{className:`gauntlet-capsule__palette-badge gauntlet-capsule__palette-badge--risk-${P.risk}`,title:`risk: ${P.risk}`,children:P.risk}),P.requiresApproval&&p.jsx("span",{className:"gauntlet-capsule__palette-badge gauntlet-capsule__palette-badge--approval",title:"requires explicit approval before running",children:"approval"}),P.shortcut&&p.jsx("span",{className:"gauntlet-capsule__palette-shortcut",children:P.shortcut})]})]},P.id))})]})]})}function Gs(s,u){return s.length<=u?s:s.slice(0,u)+"…"}function bd({snapshot:s,screenshotEnabled:u}){const o=(()=>{if(!s.domSkeleton)return 0;try{const x=JSON.parse(s.domSkeleton);if(Array.isArray(x))return x.length}catch{}return 0})(),d=!!s.pageText;return p.jsxs("ul",{className:"gauntlet-capsule__context-summary","aria-label":"context",children:[p.jsxs("li",{children:[p.jsx("span",{className:"gauntlet-capsule__context-key",children:"selection"}),p.jsx("span",{className:"gauntlet-capsule__context-val gauntlet-capsule__context-val--muted",children:"none"})]}),p.jsxs("li",{children:[p.jsx("span",{className:"gauntlet-capsule__context-key",children:"page captured"}),p.jsx("span",{className:"gauntlet-capsule__context-val",children:d?"yes":"no"})]}),p.jsxs("li",{children:[p.jsx("span",{className:"gauntlet-capsule__context-key",children:"DOM captured"}),p.jsx("span",{className:"gauntlet-capsule__context-val",children:o>0?`${o} elements`:"—"})]}),p.jsxs("li",{children:[p.jsx("span",{className:"gauntlet-capsule__context-key",children:"screenshot"}),p.jsx("span",{className:"gauntlet-capsule__context-val",children:u?"on":"off"})]})]})}function Sd({onClose:s,showScreenshot:u,prefs:o,showDismissedDomains:d,theme:x,onChangeTheme:m,showPillMode:A}){const[S,k]=b.useState([]),[N,P]=b.useState(!0),[C,B]=b.useState(!1),[ie,ne]=b.useState("corner"),[te,oe]=b.useState(!1);b.useEffect(()=>{let F=!1;return d&&o.readDismissedDomains().then(T=>{F||k(T)}),o.readScreenshotEnabled().then(T=>{F||(B(T),P(!1))}),o.readPillMode().then(T=>{F||ne(T)}),o.readTtsEnabled().then(T=>{F||oe(T)}),()=>{F=!0}},[o,d]);const L=b.useCallback(async F=>{ne(F),await o.writePillMode(F),window.dispatchEvent(new CustomEvent("gauntlet:pill-mode",{detail:{mode:F}}))},[o]),ke=b.useCallback(async F=>{var T;if(oe(F),await o.writeTtsEnabled(F),!F)try{(T=window.speechSynthesis)==null||T.cancel()}catch{}window.dispatchEvent(new CustomEvent("gauntlet:tts",{detail:{enabled:F}}))},[o]),Ae=b.useCallback(async F=>{await o.restoreDomain(F),k(T=>T.filter(R=>R!==F))},[o]),_e=b.useCallback(async F=>{B(F),await o.writeScreenshotEnabled(F)},[o]);return p.jsxs("section",{className:"gauntlet-capsule__settings",role:"region","aria-label":"Definições",children:[p.jsxs("header",{className:"gauntlet-capsule__settings-header",children:[p.jsx("span",{className:"gauntlet-capsule__settings-title",children:"definições"}),p.jsx("button",{type:"button",className:"gauntlet-capsule__settings-close",onClick:s,"aria-label":"Fechar definições",children:"×"})]}),p.jsxs("div",{className:"gauntlet-capsule__settings-section",children:[p.jsx("span",{className:"gauntlet-capsule__settings-subtitle",children:"aparência"}),p.jsxs("div",{className:"gauntlet-capsule__theme-switch",role:"radiogroup","aria-label":"tema",children:[p.jsxs("button",{type:"button",className:`gauntlet-capsule__theme-option${x==="light"?" gauntlet-capsule__theme-option--active":""}`,onClick:()=>m("light"),role:"radio","aria-checked":x==="light",children:[p.jsx("span",{className:"gauntlet-capsule__theme-swatch gauntlet-capsule__theme-swatch--light","aria-hidden":!0}),p.jsx("span",{children:"flagship light"})]}),p.jsxs("button",{type:"button",className:`gauntlet-capsule__theme-option${x==="dark"?" gauntlet-capsule__theme-option--active":""}`,onClick:()=>m("dark"),role:"radio","aria-checked":x==="dark",children:[p.jsx("span",{className:"gauntlet-capsule__theme-swatch gauntlet-capsule__theme-swatch--dark","aria-hidden":!0}),p.jsx("span",{children:"night premium"})]})]})]}),A&&p.jsxs("div",{className:"gauntlet-capsule__settings-section",children:[p.jsx("span",{className:"gauntlet-capsule__settings-subtitle",children:"pill"}),p.jsxs("div",{className:"gauntlet-capsule__theme-switch",role:"radiogroup","aria-label":"pill mode",children:[p.jsxs("button",{type:"button",className:`gauntlet-capsule__theme-option${ie==="corner"?" gauntlet-capsule__theme-option--active":""}`,onClick:()=>void L("corner"),role:"radio","aria-checked":ie==="corner",children:[p.jsx("span",{className:"gauntlet-capsule__theme-swatch gauntlet-capsule__pill-mode-swatch--corner","aria-hidden":!0}),p.jsx("span",{children:"resting corner"})]}),p.jsxs("button",{type:"button",className:`gauntlet-capsule__theme-option${ie==="cursor"?" gauntlet-capsule__theme-option--active":""}`,onClick:()=>void L("cursor"),role:"radio","aria-checked":ie==="cursor",children:[p.jsx("span",{className:"gauntlet-capsule__theme-swatch gauntlet-capsule__pill-mode-swatch--cursor","aria-hidden":!0}),p.jsx("span",{children:"cursor pill"})]})]})]}),u&&p.jsx("div",{className:"gauntlet-capsule__settings-section",children:p.jsxs("label",{className:"gauntlet-capsule__settings-toggle",children:[p.jsx("input",{type:"checkbox",checked:C,onChange:F=>void _e(F.target.checked)}),p.jsxs("span",{className:"gauntlet-capsule__settings-toggle-label",children:[p.jsx("strong",{children:"incluir screenshot"}),p.jsx("small",{children:"o modelo vê a página visível. útil para layouts e imagens, exposição de senhas/DMs visíveis. opt-in."})]})]})}),p.jsx("div",{className:"gauntlet-capsule__settings-section",children:p.jsxs("label",{className:"gauntlet-capsule__settings-toggle",children:[p.jsx("input",{type:"checkbox",checked:te,onChange:F=>void ke(F.target.checked)}),p.jsxs("span",{className:"gauntlet-capsule__settings-toggle-label",children:[p.jsx("strong",{children:"ler resposta em voz alta"}),p.jsx("small",{children:"quando o modelo termina, a cápsula fala a resposta via Web Speech. cancela ao submeter outro pedido ou fechar a cápsula."})]})]})}),p.jsxs("div",{className:"gauntlet-capsule__settings-section",children:[p.jsx("span",{className:"gauntlet-capsule__settings-subtitle",children:"domínios escondidos"}),N?p.jsx("p",{className:"gauntlet-capsule__settings-empty",children:"a carregar…"}):S.length===0?p.jsx("p",{className:"gauntlet-capsule__settings-empty",children:"nenhum — clica direito no pill em qualquer site para o esconder."}):p.jsx("ul",{className:"gauntlet-capsule__settings-list",children:S.map(F=>p.jsxs("li",{className:"gauntlet-capsule__settings-row",children:[p.jsx("span",{className:"gauntlet-capsule__settings-host",children:F}),p.jsx("button",{type:"button",className:"gauntlet-capsule__settings-restore",onClick:()=>void Ae(F),children:"restaurar"})]},F))})]})]})}function Ed(s){const u=s.match(/"compose"\s*:\s*"((?:[^"\\]|\\.)*)/);if(!u)return null;let o=u[1];return o.endsWith("\\")&&!o.endsWith("\\\\")&&(o=o.slice(0,-1)),o.replace(/\\n/g,`
`).replace(/\\r/g,"\r").replace(/\\t/g,"	").replace(/\\"/g,'"').replace(/\\\\/g,"\\")}function Cd(s,u){const o={};return s.pageText&&(o.page_text=s.pageText),s.domSkeleton&&(o.dom_skeleton=s.domSkeleton),s.bbox&&(o.selection_bbox=s.bbox),u&&(o.screenshot_data_url=u),{source:"browser",url:s.url,page_title:s.pageTitle,selection:s.text||void 0,metadata:Object.keys(o).length>0?o:void 0}}function Ad(s){switch(s.type){case"fill":return`fill ${s.selector} ← "${Gs(s.value,80)}"`;case"click":return`click ${s.selector}`;case"highlight":return`highlight ${s.selector}`;case"scroll_to":return`scroll to ${s.selector}`}}const vt=16,rn=12;function ml(s,u,o){return o<u||s<u?u:s>o?o:s}function Nd(s,u){if(s<=600)return{width:Math.max(0,s-24),height:Math.max(0,u-24)};const d=ml(.72*s,560,820),x=ml(.72*u,420,560);return{width:d,height:x}}function Td(s,u,o){if(!s)return{top:Math.max(vt,Math.floor((u.height-o.height)/2)),left:Math.max(vt,Math.floor((u.width-o.width)/2)),placement:"center"};const d=u.height-(s.y+s.height)-rn-vt,x=s.y-rn-vt,m=u.width-(s.x+s.width)-rn-vt,A=s.x-rn-vt,S=d>=o.height,k=x>=o.height,N=m>=o.width,P=A>=o.width;let C,B,ie;S?(C="below",B=s.y+s.height+rn,ie=s.x):k?(C="above",B=s.y-rn-o.height,ie=s.x):N?(C="right",ie=s.x+s.width+rn,B=Math.floor(s.y+s.height/2-o.height/2)):P?(C="left",ie=s.x-rn-o.width,B=Math.floor(s.y+s.height/2-o.height/2)):(C="center",B=Math.floor((u.height-o.height)/2),ie=Math.floor((u.width-o.width)/2));const ne=u.height-o.height-vt,te=u.width-o.width-vt;return B=ml(B,vt,Math.max(vt,ne)),ie=ml(ie,vt,Math.max(vt,te)),{top:B,left:ie,placement:C}}const Pd=`
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
`,jd=4,Md=3e4,qs=180,Xs=8,zd=24;function Ld({position:s,onClick:u,onDismissDomain:o,onPersistPosition:d,flash:x,phase:m,hasContext:A,disconnected:S,mode:k="corner"}){const[N,P]=b.useState(s),[C,B]=b.useState(!1),[ie,ne]=b.useState({dx:0,dy:0,near:!1}),[te,oe]=b.useState(null),[L,ke]=b.useState(!1),[Ae,_e]=b.useState(!1),[F,T]=b.useState(!1),R=b.useRef(null),U=b.useRef(null),Y=b.useRef(null),he=b.useRef(null),Ne=b.useRef(null);b.useEffect(()=>{P(s)},[s.bottom,s.right]),b.useEffect(()=>{if(k==="cursor"){B(f=>f&&!1);return}function D(){Y.current!==null&&window.clearTimeout(Y.current),B(f=>f&&!1),Y.current=window.setTimeout(()=>{B(!0)},Md)}return D(),window.addEventListener("mousemove",D,{passive:!0}),window.addEventListener("keydown",D,{passive:!0}),()=>{window.removeEventListener("mousemove",D),window.removeEventListener("keydown",D),Y.current!==null&&window.clearTimeout(Y.current)}},[k]),b.useEffect(()=>{if(k!=="cursor"){oe(null),ke(!1),_e(!1),T(!1);return}const D=document.createElement("style");D.id="gauntlet-pill-cursor-style",D.textContent=`
      html, body, * { cursor: none !important; }
    `,document.documentElement.appendChild(D);let f=null,E=null;function ee(){if(f=null,!E)return;oe(E);const le=document.elementFromPoint(E.x,E.y),ue=!!(le!=null&&le.closest('input:not([type="button"]):not([type="submit"]):not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="color"]):not([type="file"]), textarea, [contenteditable=""], [contenteditable="true"]')),me=ue?!1:!!(le!=null&&le.closest('a, button, [role="button"], select'));_e(Le=>Le===ue?Le:ue),ke(Le=>Le===me?Le:me)}function re(le){E={x:le.clientX,y:le.clientY},f==null&&(f=window.requestAnimationFrame(ee))}function de(le){(le.metaKey||le.ctrlKey)&&T(!0)}function pe(le){!le.metaKey&&!le.ctrlKey&&T(!1)}return window.addEventListener("pointermove",re,{passive:!0}),window.addEventListener("keydown",de,{passive:!0}),window.addEventListener("keyup",pe,{passive:!0}),()=>{window.removeEventListener("pointermove",re),window.removeEventListener("keydown",de),window.removeEventListener("keyup",pe),f!=null&&cancelAnimationFrame(f),D.remove(),oe(null),ke(!1),_e(!1),T(!1)}},[k]),b.useEffect(()=>{if(k==="cursor"){ne(f=>f.dx===0&&f.dy===0&&!f.near?f:{dx:0,dy:0,near:!1});return}function D(f){Ne.current={x:f.clientX,y:f.clientY},he.current==null&&(he.current=window.requestAnimationFrame(()=>{if(he.current=null,R.current)return;const E=Ne.current;if(!E)return;const ee=U.current;if(!ee)return;const re=ee.getBoundingClientRect(),de=re.left+re.width/2,pe=re.top+re.height/2,le=E.x-de,ue=E.y-pe,me=Math.hypot(le,ue);if(me>qs||me<1){ne(rt=>rt.dx===0&&rt.dy===0&&!rt.near?rt:{dx:0,dy:0,near:!1});return}const Le=1-me/qs,nt=Xs+(zd-Xs)*Le,qe=le/me,ln=ue/me;ne({dx:qe*nt,dy:ln*nt,near:!0})}))}return window.addEventListener("pointermove",D,{passive:!0}),()=>{window.removeEventListener("pointermove",D),he.current!=null&&(cancelAnimationFrame(he.current),he.current=null)}},[k]);const Se=b.useCallback(D=>{var f;D.button===0&&((f=U.current)==null||f.setPointerCapture(D.pointerId),R.current={pressX:D.clientX,pressY:D.clientY,startBottom:N.bottom,startRight:N.right,armed:!1})},[N.bottom,N.right]),q=b.useCallback(D=>{const f=R.current;if(!f)return;const E=D.clientX-f.pressX,ee=D.clientY-f.pressY;!f.armed&&Math.abs(E)+Math.abs(ee)<jd||(f.armed=!0,P({right:f.startRight-E,bottom:f.startBottom-ee}))},[]),Ee=b.useCallback(D=>{var E;const f=R.current;R.current=null;try{(E=U.current)==null||E.releasePointerCapture(D.pointerId)}catch{}if(f){if(f.armed){d(N);return}u()}},[N,u,d]),xe=b.useCallback(D=>{D.preventDefault();const f=(()=>{try{return window.location.hostname}catch{return""}})();window.confirm(f?`Esconder o Gauntlet em ${f}? Restauras na cápsula → "···" → restaurar.`:"Esconder o Gauntlet neste site?")&&o()},[o]),Pe=x==="ok"?"gauntlet-pill--success":x==="fail"?"gauntlet-pill--error":"",fe=k==="cursor",$=["gauntlet-pill",C&&!fe?"gauntlet-pill--idle":"",!fe&&ie.near?"gauntlet-pill--near-cursor":"",A?"gauntlet-pill--context":"",S?"gauntlet-pill--disconnected":"",Pe,m&&m!=="idle"?`gauntlet-pill--phase-${m}`:"",fe?"gauntlet-pill--cursor-mode":"",fe&&L?"gauntlet-pill--over-interactive":"",fe&&Ae?"gauntlet-pill--over-editable":"",fe&&F?"gauntlet-pill--cmd-held":""].filter(Boolean).join(" "),G=fe?te?{top:`${te.y}px`,left:`${te.x}px`,right:"auto",bottom:"auto",transform:"translate(-50%, -50%)",pointerEvents:"none"}:{bottom:`${N.bottom}px`,right:`${N.right}px`,pointerEvents:"none"}:{bottom:`${N.bottom}px`,right:`${N.right}px`,transform:ie.dx!==0||ie.dy!==0?`translate3d(${ie.dx}px, ${ie.dy}px, 0)`:void 0};return p.jsx("button",{ref:U,type:"button",className:$,style:G,onPointerDown:Se,onPointerMove:q,onPointerUp:Ee,onPointerEnter:()=>B(!1),onContextMenu:xe,"aria-label":"Summon Gauntlet capsule",title:"Click: abrir · Drag: mover · Right-click: esconder neste domínio",children:p.jsx("span",{className:"gauntlet-pill__mark","aria-hidden":!0,children:p.jsx("span",{className:"gauntlet-pill__dot"})})})}const Rd=`
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
`,Dd=100,Id=new Set(["script","style","meta","link","noscript","head","html","br","hr","wbr"]),Od="gauntlet-capsule-host";function $d(s){const u=s.tagName.toLowerCase(),o=s.getAttribute("id");if(o&&!o.startsWith("gauntlet-"))return`${u}#${CSS.escape(o)}`;const d=s.getAttribute("name");if(d)return`${u}[name="${d}"]`;const x=s.getAttribute("type");if(x)return`${u}[type="${x}"]`;const m=Array.from(s.classList).filter(A=>A.length>2&&!A.startsWith("is-")&&!A.startsWith("has-")).slice(0,2);return m.length>0?`${u}.${m.map(A=>CSS.escape(A)).join(".")}`:u}function Fd(s){try{const u=window.getComputedStyle(s);if(u.display==="none"||u.visibility==="hidden"||u.opacity==="0")return!1;const o=s.getBoundingClientRect();return!(o.width===0&&o.height===0||o.bottom<0||o.top>window.innerHeight||o.right<0||o.left>window.innerWidth)}catch{return!1}}function Ud(s){let u=0,o=s;for(;o&&o!==document.body;)u++,o=o.parentElement;return u}function Bd(s){var o;let u=s;for(;u;){if(u.id===Od||(o=u.id)!=null&&o.startsWith("gauntlet-"))return!0;u=u.parentElement}return!1}function Vd(s){var N;const u=s.tagName.toLowerCase();if(Id.has(u)||Bd(s))return null;const o=$d(s),d=Fd(s),x=Ud(s),m={selector:o,tag:u,visible:d,depth:x},A=s.getAttribute("type");A&&(m.type=A);const S=s.getAttribute("placeholder")||s.getAttribute("aria-label")||s.getAttribute("title")||"";S&&(m.placeholder=S.trim().slice(0,80));const k=((N=s.innerText)==null?void 0:N.trim())??"";return k&&k.length>0&&(m.text=k.slice(0,50)),m}const Hd=["input","textarea","select",'[contenteditable="true"]',"button","a[href]","label",'[role="button"]','[role="link"]','[role="textbox"]','[role="combobox"]','[role="listbox"]','[role="menuitem"]','[role="tab"]','[role="checkbox"]','[role="radio"]','[role="switch"]',"nav","main","form"].join(", ");function Wd(){try{const s=[],u=new Set,o=document.querySelectorAll(Hd);for(const d of Array.from(o)){if(s.length>=Dd)break;const x=Vd(d);x&&(u.has(x.selector)||(u.add(x.selector),s.push(x)))}return{elements:s}}catch{return{elements:[]}}}const Zs=5e3;function Kd(){try{const s=document.body;if(!s)return"";const o=(s.innerText??"").replace(/\r\n/g,`
`).replace(/\r/g,`
`).replace(/\n{3,}/g,`

`).replace(/[ \t]{2,}/g," ").trim();return o.length<=Zs?o:o.slice(0,Zs)+"…"}catch{return""}}function ei(){return{text:Jd(),url:Gd(),pageTitle:qd(),pageText:Kd(),domSkeleton:JSON.stringify(Wd()),bbox:Xd()}}const Yd=50;async function Qd(){var A;const s=ei();if(s.text)return s;const u=`gauntlet-cid-${Math.random().toString(36).slice(2)}`,o=[],d=S=>{const k=S.data;!k||k.gauntlet!=="subframe-selection-response"||k.cid===u&&(typeof k.text!="string"||!k.text||o.push({text:k.text,url:typeof k.url=="string"?k.url:void 0,pageTitle:typeof k.pageTitle=="string"?k.pageTitle:void 0}))};window.addEventListener("message",d);let x=null;try{x=document.querySelectorAll("iframe")}catch{x=null}if(x)for(const S of Array.from(x))try{(A=S.contentWindow)==null||A.postMessage({gauntlet:"subframe-selection-request",cid:u},"*")}catch{}await new Promise(S=>window.setTimeout(S,Yd)),window.removeEventListener("message",d);const m=o.sort((S,k)=>k.text.length-S.text.length)[0];return m?{...s,text:m.text,url:m.url||s.url,pageTitle:m.pageTitle||s.pageTitle,bbox:null}:s}function Jd(){try{const s=window.getSelection();return s?s.toString().trim():""}catch{return""}}function Gd(){try{return window.location.href}catch{return""}}function qd(){try{return document.title??""}catch{return""}}function Xd(){try{const s=window.getSelection();if(!s||s.rangeCount===0||s.isCollapsed)return null;const o=s.getRangeAt(0).getBoundingClientRect();return o.width===0&&o.height===0?null:{x:o.x,y:o.y,width:o.width,height:o.height}}catch{return null}}const Zd={domExecution:!0,pillSurface:!0,screenshot:!0,dismissDomain:!0,voice:typeof window<"u"&&("SpeechRecognition"in window||"webkitSpeechRecognition"in window),streaming:!0,refreshSelection:!0,filesystemRead:!1,filesystemWrite:!1,screenCapture:!1,remoteVoice:!0};async function ep(s,u,o){const d=await chrome.runtime.sendMessage({type:"gauntlet:fetch",url:u,method:s,headers:{"content-type":"application/json"},body:o===void 0?void 0:JSON.stringify(o)});if(!d||!d.ok)throw new Error(`composer: background fetch failed — ${(d==null?void 0:d.error)??"unknown error"}`);let x=null;if(d.body!=null&&d.body!=="")try{x=JSON.parse(d.body)}catch{x=d.body}const m=d.status??0;if(m<200||m>=300)throw new Error(`composer: ${m} ${d.statusText??""}`.trim());return x}const tp={async get(s){try{return(await chrome.storage.local.get(s))[s]??null}catch{return null}},async set(s,u){try{await chrome.storage.local.set({[s]:u})}catch{}},async remove(s){try{await chrome.storage.local.remove(s)}catch{}}};function np(s,u,o){const d=chrome.runtime.connect({name:"gauntlet:stream"});let x=!1;function m(){if(!x){x=!0;try{d.disconnect()}catch{}}}return d.onMessage.addListener(A=>{if(!A||typeof A!="object")return;const S=A;if(S.type==="sse"&&typeof S.data=="string"){let k=null;try{k=JSON.parse(S.data)}catch{o.onError("malformed SSE payload"),m();return}if(S.event==="delta"){const N=k.text??"";o.onDelta(N)}else if(S.event==="done"){const N=k;o.onDone({plan_id:N.plan_id??"",context_id:N.context_id??"",actions:N.actions??[],compose:N.compose??null,reason:N.reason??null,model_used:N.model_used??"",latency_ms:N.latency_ms??0,raw_response:null}),m()}else if(S.event==="error"){const N=k.error??"model error";o.onError(N),m()}}else S.type==="error"?(o.onError(S.error??"transport error"),m()):S.type==="closed"&&(x||(o.onDone({plan_id:"",context_id:"",actions:[],compose:null,reason:"stream ended without result",model_used:"",latency_ms:0,raw_response:null}),x=!0))}),d.onDisconnect.addListener(()=>{var A;if(!x){const S=(A=chrome.runtime.lastError)==null?void 0:A.message;o.onError(S??"disconnected"),x=!0}}),d.postMessage({type:"start",url:s,body:u}),()=>{if(!x){try{d.postMessage({type:"abort"})}catch{}m()}}}function rp(){return{shell:"browser",capabilities:Zd,transport:{fetchJson(s,u,o){return ep(s,u,o)},stream:np},storage:tp,selection:{read:()=>ei(),readAsync:()=>Qd()},domActions:{execute:dd},screenshot:{async capture(){var s;if(typeof chrome>"u"||!((s=chrome.runtime)!=null&&s.sendMessage))return null;try{const u=await chrome.runtime.sendMessage({type:"gauntlet:capture_screenshot"});return!(u!=null&&u.ok)||!u.dataUrl?null:u.dataUrl}catch{return null}}},debug:{async lastSummon(){try{const s=await chrome.runtime.sendMessage({type:"gauntlet:debug"});return(s==null?void 0:s.lastSummon)??null}catch{return null}}}}}const lp=Pd+Rd;function ap(){const s=b.useMemo(()=>rp(),[]),u=b.useMemo(()=>Js(s.storage),[s]),[o,d]=b.useState({kind:"pill"}),[x,m]=b.useState(Ys),[A,S]=b.useState(Ks),[k,N]=b.useState(!1),[P,C]=b.useState(null),[B,ie]=b.useState(null),[ne,te]=b.useState(!1);b.useEffect(()=>{function F(){let T=!1;try{const R=window.getSelection();T=!!(R&&R.toString().trim().length>0)}catch{T=!1}te(R=>R===T?R:T)}return F(),document.addEventListener("selectionchange",F,{passive:!0}),()=>document.removeEventListener("selectionchange",F)},[]),b.useEffect(()=>{function F(R){const U=R.detail,Y=(U==null?void 0:U.ok)===!1?"fail":"ok";C(Y),window.setTimeout(()=>C(null),1500)}function T(R){const U=R.detail;U!=null&&U.phase&&(ie(U.phase),(U.phase==="executed"||U.phase==="error")&&window.setTimeout(()=>ie(null),3500))}return window.addEventListener("gauntlet:execute-result",F),window.addEventListener("gauntlet:phase",T),()=>{window.removeEventListener("gauntlet:execute-result",F),window.removeEventListener("gauntlet:phase",T)}},[]);const oe=b.useRef(null);b.useEffect(()=>{function F(T){oe.current={x:T.clientX,y:T.clientY}}return window.addEventListener("mousemove",F,{passive:!0}),()=>window.removeEventListener("mousemove",F)},[]),b.useEffect(()=>{let F=!1;u.readPillPosition().then(U=>{F||m(U)}),u.readPillMode().then(U=>{F||S(U)});function T(U){const Y=U.detail;((Y==null?void 0:Y.mode)==="cursor"||(Y==null?void 0:Y.mode)==="corner")&&S(Y.mode)}window.addEventListener("gauntlet:pill-mode",T);const R=(()=>{try{return window.location.hostname}catch{return""}})();return R&&u.isDomainDismissed(R).then(U=>{F||!U||(N(!0),d(Y=>Y.kind==="pill"?{kind:"gone"}:Y))}),()=>{F=!0,window.removeEventListener("gauntlet:pill-mode",T)}},[u]);const L=b.useCallback(()=>{const F=oe.current;d(T=>({kind:"capsule",snapshot:s.selection.read(),cursor:F,nonce:T.kind==="capsule"?T.nonce+1:1})),s.selection.readAsync&&s.selection.readAsync().then(T=>{d(R=>R.kind!=="capsule"||!T.text||T.text===R.snapshot.text?R:{...R,snapshot:T})})},[s]),ke=b.useCallback(()=>{d(k?{kind:"gone"}:{kind:"pill"})},[k]),Ae=b.useCallback(()=>{const F=(()=>{try{return window.location.hostname}catch{return""}})();F&&u.dismissDomain(F),N(!0),d({kind:"gone"})},[u]),_e=b.useCallback(F=>{u.writePillPosition(F)},[u]);return b.useEffect(()=>{function F(T,R,U){if(!T||typeof T!="object")return!1;const Y=T.type;return Y==="gauntlet:summon"?(L(),U({ok:!0}),!1):(Y==="gauntlet:dismiss"&&(ke(),U({ok:!0})),!1)}return chrome.runtime.onMessage.addListener(F),()=>chrome.runtime.onMessage.removeListener(F)},[L,ke]),o.kind==="gone"?null:o.kind==="pill"?p.jsx(Ld,{position:x,mode:A,onClick:L,onDismissDomain:Ae,onPersistPosition:_e,flash:P,phase:B,hasContext:ne,disconnected:B==="error"}):p.jsx(_d,{ambient:s,initialSnapshot:o.snapshot,cursorAnchor:o.cursor,onDismiss:ke},o.nonce)}const ti="gauntlet-capsule-host",op={matches:["<all_urls>"],runAt:"document_idle",cssInjectionMode:"manual",async main(){if(window.top!==window.self){window.addEventListener("message",m=>{var N;const A=m.data;if(!A||A.gauntlet!=="subframe-selection-request")return;const S=window.getSelection(),k=S?S.toString().trim():"";(N=m.source)==null||N.postMessage({gauntlet:"subframe-selection-response",cid:A.cid,text:k,url:window.location.href,pageTitle:document.title},{targetOrigin:"*"})});return}if(document.getElementById(ti))return;const s=document.createElement("div");s.id=ti,Object.assign(s.style,{position:"fixed",inset:"0",zIndex:"2147483647",pointerEvents:"none",all:"initial"});const u=s.attachShadow({mode:"open"}),o=document.createElement("style");o.textContent=lp,u.appendChild(o);const d=document.createElement("div");u.appendChild(d),document.documentElement.appendChild(s),Dc.createRoot(d).render(p.jsx(b.StrictMode,{children:p.jsx(ap,{})}))}};var hl={exports:{}},sp=hl.exports,ni;function ip(){return ni||(ni=1,(function(s,u){(function(o,d){d(s)})(typeof globalThis<"u"?globalThis:typeof self<"u"?self:sp,function(o){if(!(globalThis.chrome&&globalThis.chrome.runtime&&globalThis.chrome.runtime.id))throw new Error("This script should only be loaded in a browser extension.");if(globalThis.browser&&globalThis.browser.runtime&&globalThis.browser.runtime.id)o.exports=globalThis.browser;else{const d="The message port closed before a response was received.",x=m=>{const A={alarms:{clear:{minArgs:0,maxArgs:1},clearAll:{minArgs:0,maxArgs:0},get:{minArgs:0,maxArgs:1},getAll:{minArgs:0,maxArgs:0}},bookmarks:{create:{minArgs:1,maxArgs:1},get:{minArgs:1,maxArgs:1},getChildren:{minArgs:1,maxArgs:1},getRecent:{minArgs:1,maxArgs:1},getSubTree:{minArgs:1,maxArgs:1},getTree:{minArgs:0,maxArgs:0},move:{minArgs:2,maxArgs:2},remove:{minArgs:1,maxArgs:1},removeTree:{minArgs:1,maxArgs:1},search:{minArgs:1,maxArgs:1},update:{minArgs:2,maxArgs:2}},browserAction:{disable:{minArgs:0,maxArgs:1,fallbackToNoCallback:!0},enable:{minArgs:0,maxArgs:1,fallbackToNoCallback:!0},getBadgeBackgroundColor:{minArgs:1,maxArgs:1},getBadgeText:{minArgs:1,maxArgs:1},getPopup:{minArgs:1,maxArgs:1},getTitle:{minArgs:1,maxArgs:1},openPopup:{minArgs:0,maxArgs:0},setBadgeBackgroundColor:{minArgs:1,maxArgs:1,fallbackToNoCallback:!0},setBadgeText:{minArgs:1,maxArgs:1,fallbackToNoCallback:!0},setIcon:{minArgs:1,maxArgs:1},setPopup:{minArgs:1,maxArgs:1,fallbackToNoCallback:!0},setTitle:{minArgs:1,maxArgs:1,fallbackToNoCallback:!0}},browsingData:{remove:{minArgs:2,maxArgs:2},removeCache:{minArgs:1,maxArgs:1},removeCookies:{minArgs:1,maxArgs:1},removeDownloads:{minArgs:1,maxArgs:1},removeFormData:{minArgs:1,maxArgs:1},removeHistory:{minArgs:1,maxArgs:1},removeLocalStorage:{minArgs:1,maxArgs:1},removePasswords:{minArgs:1,maxArgs:1},removePluginData:{minArgs:1,maxArgs:1},settings:{minArgs:0,maxArgs:0}},commands:{getAll:{minArgs:0,maxArgs:0}},contextMenus:{remove:{minArgs:1,maxArgs:1},removeAll:{minArgs:0,maxArgs:0},update:{minArgs:2,maxArgs:2}},cookies:{get:{minArgs:1,maxArgs:1},getAll:{minArgs:1,maxArgs:1},getAllCookieStores:{minArgs:0,maxArgs:0},remove:{minArgs:1,maxArgs:1},set:{minArgs:1,maxArgs:1}},devtools:{inspectedWindow:{eval:{minArgs:1,maxArgs:2,singleCallbackArg:!1}},panels:{create:{minArgs:3,maxArgs:3,singleCallbackArg:!0},elements:{createSidebarPane:{minArgs:1,maxArgs:1}}}},downloads:{cancel:{minArgs:1,maxArgs:1},download:{minArgs:1,maxArgs:1},erase:{minArgs:1,maxArgs:1},getFileIcon:{minArgs:1,maxArgs:2},open:{minArgs:1,maxArgs:1,fallbackToNoCallback:!0},pause:{minArgs:1,maxArgs:1},removeFile:{minArgs:1,maxArgs:1},resume:{minArgs:1,maxArgs:1},search:{minArgs:1,maxArgs:1},show:{minArgs:1,maxArgs:1,fallbackToNoCallback:!0}},extension:{isAllowedFileSchemeAccess:{minArgs:0,maxArgs:0},isAllowedIncognitoAccess:{minArgs:0,maxArgs:0}},history:{addUrl:{minArgs:1,maxArgs:1},deleteAll:{minArgs:0,maxArgs:0},deleteRange:{minArgs:1,maxArgs:1},deleteUrl:{minArgs:1,maxArgs:1},getVisits:{minArgs:1,maxArgs:1},search:{minArgs:1,maxArgs:1}},i18n:{detectLanguage:{minArgs:1,maxArgs:1},getAcceptLanguages:{minArgs:0,maxArgs:0}},identity:{launchWebAuthFlow:{minArgs:1,maxArgs:1}},idle:{queryState:{minArgs:1,maxArgs:1}},management:{get:{minArgs:1,maxArgs:1},getAll:{minArgs:0,maxArgs:0},getSelf:{minArgs:0,maxArgs:0},setEnabled:{minArgs:2,maxArgs:2},uninstallSelf:{minArgs:0,maxArgs:1}},notifications:{clear:{minArgs:1,maxArgs:1},create:{minArgs:1,maxArgs:2},getAll:{minArgs:0,maxArgs:0},getPermissionLevel:{minArgs:0,maxArgs:0},update:{minArgs:2,maxArgs:2}},pageAction:{getPopup:{minArgs:1,maxArgs:1},getTitle:{minArgs:1,maxArgs:1},hide:{minArgs:1,maxArgs:1,fallbackToNoCallback:!0},setIcon:{minArgs:1,maxArgs:1},setPopup:{minArgs:1,maxArgs:1,fallbackToNoCallback:!0},setTitle:{minArgs:1,maxArgs:1,fallbackToNoCallback:!0},show:{minArgs:1,maxArgs:1,fallbackToNoCallback:!0}},permissions:{contains:{minArgs:1,maxArgs:1},getAll:{minArgs:0,maxArgs:0},remove:{minArgs:1,maxArgs:1},request:{minArgs:1,maxArgs:1}},runtime:{getBackgroundPage:{minArgs:0,maxArgs:0},getPlatformInfo:{minArgs:0,maxArgs:0},openOptionsPage:{minArgs:0,maxArgs:0},requestUpdateCheck:{minArgs:0,maxArgs:0},sendMessage:{minArgs:1,maxArgs:3},sendNativeMessage:{minArgs:2,maxArgs:2},setUninstallURL:{minArgs:1,maxArgs:1}},sessions:{getDevices:{minArgs:0,maxArgs:1},getRecentlyClosed:{minArgs:0,maxArgs:1},restore:{minArgs:0,maxArgs:1}},storage:{local:{clear:{minArgs:0,maxArgs:0},get:{minArgs:0,maxArgs:1},getBytesInUse:{minArgs:0,maxArgs:1},remove:{minArgs:1,maxArgs:1},set:{minArgs:1,maxArgs:1}},managed:{get:{minArgs:0,maxArgs:1},getBytesInUse:{minArgs:0,maxArgs:1}},sync:{clear:{minArgs:0,maxArgs:0},get:{minArgs:0,maxArgs:1},getBytesInUse:{minArgs:0,maxArgs:1},remove:{minArgs:1,maxArgs:1},set:{minArgs:1,maxArgs:1}}},tabs:{captureVisibleTab:{minArgs:0,maxArgs:2},create:{minArgs:1,maxArgs:1},detectLanguage:{minArgs:0,maxArgs:1},discard:{minArgs:0,maxArgs:1},duplicate:{minArgs:1,maxArgs:1},executeScript:{minArgs:1,maxArgs:2},get:{minArgs:1,maxArgs:1},getCurrent:{minArgs:0,maxArgs:0},getZoom:{minArgs:0,maxArgs:1},getZoomSettings:{minArgs:0,maxArgs:1},goBack:{minArgs:0,maxArgs:1},goForward:{minArgs:0,maxArgs:1},highlight:{minArgs:1,maxArgs:1},insertCSS:{minArgs:1,maxArgs:2},move:{minArgs:2,maxArgs:2},query:{minArgs:1,maxArgs:1},reload:{minArgs:0,maxArgs:2},remove:{minArgs:1,maxArgs:1},removeCSS:{minArgs:1,maxArgs:2},sendMessage:{minArgs:2,maxArgs:3},setZoom:{minArgs:1,maxArgs:2},setZoomSettings:{minArgs:1,maxArgs:2},update:{minArgs:1,maxArgs:2}},topSites:{get:{minArgs:0,maxArgs:0}},webNavigation:{getAllFrames:{minArgs:1,maxArgs:1},getFrame:{minArgs:1,maxArgs:1}},webRequest:{handlerBehaviorChanged:{minArgs:0,maxArgs:0}},windows:{create:{minArgs:0,maxArgs:1},get:{minArgs:1,maxArgs:2},getAll:{minArgs:0,maxArgs:1},getCurrent:{minArgs:0,maxArgs:1},getLastFocused:{minArgs:0,maxArgs:1},remove:{minArgs:1,maxArgs:1},update:{minArgs:2,maxArgs:2}}};if(Object.keys(A).length===0)throw new Error("api-metadata.json has not been included in browser-polyfill");class S extends WeakMap{constructor(R,U=void 0){super(U),this.createItem=R}get(R){return this.has(R)||this.set(R,this.createItem(R)),super.get(R)}}const k=T=>T&&typeof T=="object"&&typeof T.then=="function",N=(T,R)=>(...U)=>{m.runtime.lastError?T.reject(new Error(m.runtime.lastError.message)):R.singleCallbackArg||U.length<=1&&R.singleCallbackArg!==!1?T.resolve(U[0]):T.resolve(U)},P=T=>T==1?"argument":"arguments",C=(T,R)=>function(Y,...he){if(he.length<R.minArgs)throw new Error(`Expected at least ${R.minArgs} ${P(R.minArgs)} for ${T}(), got ${he.length}`);if(he.length>R.maxArgs)throw new Error(`Expected at most ${R.maxArgs} ${P(R.maxArgs)} for ${T}(), got ${he.length}`);return new Promise((Ne,Se)=>{if(R.fallbackToNoCallback)try{Y[T](...he,N({resolve:Ne,reject:Se},R))}catch(q){console.warn(`${T} API method doesn't seem to support the callback parameter, falling back to call it without a callback: `,q),Y[T](...he),R.fallbackToNoCallback=!1,R.noCallback=!0,Ne()}else R.noCallback?(Y[T](...he),Ne()):Y[T](...he,N({resolve:Ne,reject:Se},R))})},B=(T,R,U)=>new Proxy(R,{apply(Y,he,Ne){return U.call(he,T,...Ne)}});let ie=Function.call.bind(Object.prototype.hasOwnProperty);const ne=(T,R={},U={})=>{let Y=Object.create(null),he={has(Se,q){return q in T||q in Y},get(Se,q,Ee){if(q in Y)return Y[q];if(!(q in T))return;let xe=T[q];if(typeof xe=="function")if(typeof R[q]=="function")xe=B(T,T[q],R[q]);else if(ie(U,q)){let Pe=C(q,U[q]);xe=B(T,T[q],Pe)}else xe=xe.bind(T);else if(typeof xe=="object"&&xe!==null&&(ie(R,q)||ie(U,q)))xe=ne(xe,R[q],U[q]);else if(ie(U,"*"))xe=ne(xe,R[q],U["*"]);else return Object.defineProperty(Y,q,{configurable:!0,enumerable:!0,get(){return T[q]},set(Pe){T[q]=Pe}}),xe;return Y[q]=xe,xe},set(Se,q,Ee,xe){return q in Y?Y[q]=Ee:T[q]=Ee,!0},defineProperty(Se,q,Ee){return Reflect.defineProperty(Y,q,Ee)},deleteProperty(Se,q){return Reflect.deleteProperty(Y,q)}},Ne=Object.create(T);return new Proxy(Ne,he)},te=T=>({addListener(R,U,...Y){R.addListener(T.get(U),...Y)},hasListener(R,U){return R.hasListener(T.get(U))},removeListener(R,U){R.removeListener(T.get(U))}}),oe=new S(T=>typeof T!="function"?T:function(U){const Y=ne(U,{},{getContent:{minArgs:0,maxArgs:0}});T(Y)}),L=new S(T=>typeof T!="function"?T:function(U,Y,he){let Ne=!1,Se,q=new Promise(fe=>{Se=function($){Ne=!0,fe($)}}),Ee;try{Ee=T(U,Y,Se)}catch(fe){Ee=Promise.reject(fe)}const xe=Ee!==!0&&k(Ee);if(Ee!==!0&&!xe&&!Ne)return!1;const Pe=fe=>{fe.then($=>{he($)},$=>{let G;$&&($ instanceof Error||typeof $.message=="string")?G=$.message:G="An unexpected error occurred",he({__mozWebExtensionPolyfillReject__:!0,message:G})}).catch($=>{console.error("Failed to send onMessage rejected reply",$)})};return Pe(xe?Ee:q),!0}),ke=({reject:T,resolve:R},U)=>{m.runtime.lastError?m.runtime.lastError.message===d?R():T(new Error(m.runtime.lastError.message)):U&&U.__mozWebExtensionPolyfillReject__?T(new Error(U.message)):R(U)},Ae=(T,R,U,...Y)=>{if(Y.length<R.minArgs)throw new Error(`Expected at least ${R.minArgs} ${P(R.minArgs)} for ${T}(), got ${Y.length}`);if(Y.length>R.maxArgs)throw new Error(`Expected at most ${R.maxArgs} ${P(R.maxArgs)} for ${T}(), got ${Y.length}`);return new Promise((he,Ne)=>{const Se=ke.bind(null,{resolve:he,reject:Ne});Y.push(Se),U.sendMessage(...Y)})},_e={devtools:{network:{onRequestFinished:te(oe)}},runtime:{onMessage:te(L),onMessageExternal:te(L),sendMessage:Ae.bind(null,"sendMessage",{minArgs:1,maxArgs:3})},tabs:{sendMessage:Ae.bind(null,"sendMessage",{minArgs:2,maxArgs:3})}},F={clear:{minArgs:1,maxArgs:1},get:{minArgs:1,maxArgs:1},set:{minArgs:1,maxArgs:1}};return A.privacy={network:{"*":F},services:{"*":F},websites:{"*":F}},ne(m,_e,A)};o.exports=x(chrome)}})})(hl)),hl.exports}var up=ip();const xl=Wt(up);function vl(s,...u){}const cp={debug:(...s)=>vl(console.debug,...s),log:(...s)=>vl(console.log,...s),warn:(...s)=>vl(console.warn,...s),error:(...s)=>vl(console.error,...s)},_l=class _l extends Event{constructor(u,o){super(_l.EVENT_NAME,{}),this.newUrl=u,this.oldUrl=o}};Qn(_l,"EVENT_NAME",Ba("wxt:locationchange"));let Ua=_l;function Ba(s){var u;return`${(u=xl==null?void 0:xl.runtime)==null?void 0:u.id}:content:${s}`}function dp(s){let u,o;return{run(){u==null&&(o=new URL(location.href),u=s.setInterval(()=>{let d=new URL(location.href);d.href!==o.href&&(window.dispatchEvent(new Ua(d,o)),o=d)},1e3))}}}const Cr=class Cr{constructor(u,o){Qn(this,"isTopFrame",window.self===window.top);Qn(this,"abortController");Qn(this,"locationWatcher",dp(this));Qn(this,"receivedMessageIds",new Set);this.contentScriptName=u,this.options=o,this.abortController=new AbortController,this.isTopFrame?(this.listenForNewerScripts({ignoreFirstEvent:!0}),this.stopOldScripts()):this.listenForNewerScripts()}get signal(){return this.abortController.signal}abort(u){return this.abortController.abort(u)}get isInvalid(){return xl.runtime.id==null&&this.notifyInvalidated(),this.signal.aborted}get isValid(){return!this.isInvalid}onInvalidated(u){return this.signal.addEventListener("abort",u),()=>this.signal.removeEventListener("abort",u)}block(){return new Promise(()=>{})}setInterval(u,o){const d=setInterval(()=>{this.isValid&&u()},o);return this.onInvalidated(()=>clearInterval(d)),d}setTimeout(u,o){const d=setTimeout(()=>{this.isValid&&u()},o);return this.onInvalidated(()=>clearTimeout(d)),d}requestAnimationFrame(u){const o=requestAnimationFrame((...d)=>{this.isValid&&u(...d)});return this.onInvalidated(()=>cancelAnimationFrame(o)),o}requestIdleCallback(u,o){const d=requestIdleCallback((...x)=>{this.signal.aborted||u(...x)},o);return this.onInvalidated(()=>cancelIdleCallback(d)),d}addEventListener(u,o,d,x){var m;o==="wxt:locationchange"&&this.isValid&&this.locationWatcher.run(),(m=u.addEventListener)==null||m.call(u,o.startsWith("wxt:")?Ba(o):o,d,{...x,signal:this.signal})}notifyInvalidated(){this.abort("Content script context invalidated"),cp.debug(`Content script "${this.contentScriptName}" context invalidated`)}stopOldScripts(){window.postMessage({type:Cr.SCRIPT_STARTED_MESSAGE_TYPE,contentScriptName:this.contentScriptName,messageId:Math.random().toString(36).slice(2)},"*")}verifyScriptStartedEvent(u){var m,A,S;const o=((m=u.data)==null?void 0:m.type)===Cr.SCRIPT_STARTED_MESSAGE_TYPE,d=((A=u.data)==null?void 0:A.contentScriptName)===this.contentScriptName,x=!this.receivedMessageIds.has((S=u.data)==null?void 0:S.messageId);return o&&d&&x}listenForNewerScripts(u){let o=!0;const d=x=>{if(this.verifyScriptStartedEvent(x)){this.receivedMessageIds.add(x.data.messageId);const m=o;if(o=!1,m&&(u!=null&&u.ignoreFirstEvent))return;this.notifyInvalidated()}};addEventListener("message",d),this.onInvalidated(()=>removeEventListener("message",d))}};Qn(Cr,"SCRIPT_STARTED_MESSAGE_TYPE",Ba("wxt:content-script-started"));let Va=Cr;const pp=Symbol("null");let fp=0;class gp extends Map{constructor(...u){super(),this._objectHashes=new WeakMap,this._symbolHashes=new Map,this._publicKeys=new Map;const[o]=u;if(o!=null){if(typeof o[Symbol.iterator]!="function")throw new TypeError(typeof o+" is not iterable (cannot read property Symbol(Symbol.iterator))");for(const[d,x]of o)this.set(d,x)}}_getPublicKeys(u,o=!1){if(!Array.isArray(u))throw new TypeError("The keys parameter must be an array");const d=this._getPrivateKey(u,o);let x;return d&&this._publicKeys.has(d)?x=this._publicKeys.get(d):o&&(x=[...u],this._publicKeys.set(d,x)),{privateKey:d,publicKey:x}}_getPrivateKey(u,o=!1){const d=[];for(const x of u){const m=x===null?pp:x;let A;if(typeof m=="object"||typeof m=="function"?A="_objectHashes":typeof m=="symbol"?A="_symbolHashes":A=!1,!A)d.push(m);else if(this[A].has(m))d.push(this[A].get(m));else if(o){const S=`@@mkm-ref-${fp++}@@`;this[A].set(m,S),d.push(S)}else return!1}return JSON.stringify(d)}set(u,o){const{publicKey:d}=this._getPublicKeys(u,!0);return super.set(d,o)}get(u){const{publicKey:o}=this._getPublicKeys(u);return super.get(o)}has(u){const{publicKey:o}=this._getPublicKeys(u);return super.has(o)}delete(u){const{publicKey:o,privateKey:d}=this._getPublicKeys(u);return!!(o&&super.delete(o)&&this._publicKeys.delete(d))}clear(){super.clear(),this._symbolHashes.clear(),this._publicKeys.clear()}get[Symbol.toStringTag](){return"ManyKeysMap"}get size(){return super.size}}new gp;function pg(){}function yl(s,...u){}const mp={debug:(...s)=>yl(console.debug,...s),log:(...s)=>yl(console.log,...s),warn:(...s)=>yl(console.warn,...s),error:(...s)=>yl(console.error,...s)};return(async()=>{try{const{main:s,...u}=op,o=new Va("content",u);return await s(o)}catch(s){throw mp.error('The content script "content" crashed on startup!',s),s}})()})();
content;
