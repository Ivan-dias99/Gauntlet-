var content=(function(){"use strict";var og=Object.defineProperty;var sg=(Yt,Qt,un)=>Qt in Yt?og(Yt,Qt,{enumerable:!0,configurable:!0,writable:!0,value:un}):Yt[Qt]=un;var nr=(Yt,Qt,un)=>sg(Yt,typeof Qt!="symbol"?Qt+"":Qt,un);var Yt=typeof document<"u"?document.currentScript:null;function Qt(o){return o&&o.__esModule&&Object.prototype.hasOwnProperty.call(o,"default")?o.default:o}var un={exports:{}},Ir={},$a={exports:{}},me={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Ds;function Dc(){if(Ds)return me;Ds=1;var o=Symbol.for("react.element"),u=Symbol.for("react.portal"),s=Symbol.for("react.fragment"),p=Symbol.for("react.strict_mode"),v=Symbol.for("react.profiler"),h=Symbol.for("react.provider"),A=Symbol.for("react.context"),S=Symbol.for("react.forward_ref"),k=Symbol.for("react.suspense"),N=Symbol.for("react.memo"),j=Symbol.for("react.lazy"),C=Symbol.iterator;function U(f){return f===null||typeof f!="object"?null:(f=C&&f[C]||f["@@iterator"],typeof f=="function"?f:null)}var ue={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},le=Object.assign,ne={};function ie(f,E,ee){this.props=f,this.context=E,this.refs=ne,this.updater=ee||ue}ie.prototype.isReactComponent={},ie.prototype.setState=function(f,E){if(typeof f!="object"&&typeof f!="function"&&f!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,f,E,"setState")},ie.prototype.forceUpdate=function(f){this.updater.enqueueForceUpdate(this,f,"forceUpdate")};function z(){}z.prototype=ie.prototype;function Se(f,E,ee){this.props=f,this.context=E,this.refs=ne,this.updater=ee||ue}var Ne=Se.prototype=new z;Ne.constructor=Se,le(Ne,ie.prototype),Ne.isPureReactComponent=!0;var ke=Array.isArray,F=Object.prototype.hasOwnProperty,T={current:null},D={key:!0,ref:!0,__self:!0,__source:!0};function B(f,E,ee){var ae,pe={},fe=null,oe=null;if(E!=null)for(ae in E.ref!==void 0&&(oe=E.ref),E.key!==void 0&&(fe=""+E.key),E)F.call(E,ae)&&!D.hasOwnProperty(ae)&&(pe[ae]=E[ae]);var de=arguments.length-2;if(de===1)pe.children=ee;else if(1<de){for(var he=Array(de),Le=0;Le<de;Le++)he[Le]=arguments[Le+2];pe.children=he}if(f&&f.defaultProps)for(ae in de=f.defaultProps,de)pe[ae]===void 0&&(pe[ae]=de[ae]);return{$$typeof:o,type:f,key:fe,ref:oe,props:pe,_owner:T.current}}function Y(f,E){return{$$typeof:o,type:f.type,key:E,ref:f.ref,props:f.props,_owner:f._owner}}function xe(f){return typeof f=="object"&&f!==null&&f.$$typeof===o}function Te(f){var E={"=":"=0",":":"=2"};return"$"+f.replace(/[=:]/g,function(ee){return E[ee]})}var Ce=/\/+/g;function q(f,E){return typeof f=="object"&&f!==null&&f.key!=null?Te(""+f.key):E.toString(36)}function Ae(f,E,ee,ae,pe){var fe=typeof f;(fe==="undefined"||fe==="boolean")&&(f=null);var oe=!1;if(f===null)oe=!0;else switch(fe){case"string":case"number":oe=!0;break;case"object":switch(f.$$typeof){case o:case u:oe=!0}}if(oe)return oe=f,pe=pe(oe),f=ae===""?"."+q(oe,0):ae,ke(pe)?(ee="",f!=null&&(ee=f.replace(Ce,"$&/")+"/"),Ae(pe,E,ee,"",function(Le){return Le})):pe!=null&&(xe(pe)&&(pe=Y(pe,ee+(!pe.key||oe&&oe.key===pe.key?"":(""+pe.key).replace(Ce,"$&/")+"/")+f)),E.push(pe)),1;if(oe=0,ae=ae===""?".":ae+":",ke(f))for(var de=0;de<f.length;de++){fe=f[de];var he=ae+q(fe,de);oe+=Ae(fe,E,ee,he,pe)}else if(he=U(f),typeof he=="function")for(f=he.call(f),de=0;!(fe=f.next()).done;)fe=fe.value,he=ae+q(fe,de++),oe+=Ae(fe,E,ee,he,pe);else if(fe==="object")throw E=String(f),Error("Objects are not valid as a React child (found: "+(E==="[object Object]"?"object with keys {"+Object.keys(f).join(", ")+"}":E)+"). If you meant to render a collection of children, use an array instead.");return oe}function ye(f,E,ee){if(f==null)return f;var ae=[],pe=0;return Ae(f,ae,"","",function(fe){return E.call(ee,fe,pe++)}),ae}function Pe(f){if(f._status===-1){var E=f._result;E=E(),E.then(function(ee){(f._status===0||f._status===-1)&&(f._status=1,f._result=ee)},function(ee){(f._status===0||f._status===-1)&&(f._status=2,f._result=ee)}),f._status===-1&&(f._status=0,f._result=E)}if(f._status===1)return f._result.default;throw f._result}var ge={current:null},$={transition:null},G={ReactCurrentDispatcher:ge,ReactCurrentBatchConfig:$,ReactCurrentOwner:T};function I(){throw Error("act(...) is not supported in production builds of React.")}return me.Children={map:ye,forEach:function(f,E,ee){ye(f,function(){E.apply(this,arguments)},ee)},count:function(f){var E=0;return ye(f,function(){E++}),E},toArray:function(f){return ye(f,function(E){return E})||[]},only:function(f){if(!xe(f))throw Error("React.Children.only expected to receive a single React element child.");return f}},me.Component=ie,me.Fragment=s,me.Profiler=v,me.PureComponent=Se,me.StrictMode=p,me.Suspense=k,me.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=G,me.act=I,me.cloneElement=function(f,E,ee){if(f==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+f+".");var ae=le({},f.props),pe=f.key,fe=f.ref,oe=f._owner;if(E!=null){if(E.ref!==void 0&&(fe=E.ref,oe=T.current),E.key!==void 0&&(pe=""+E.key),f.type&&f.type.defaultProps)var de=f.type.defaultProps;for(he in E)F.call(E,he)&&!D.hasOwnProperty(he)&&(ae[he]=E[he]===void 0&&de!==void 0?de[he]:E[he])}var he=arguments.length-2;if(he===1)ae.children=ee;else if(1<he){de=Array(he);for(var Le=0;Le<he;Le++)de[Le]=arguments[Le+2];ae.children=de}return{$$typeof:o,type:f.type,key:pe,ref:fe,props:ae,_owner:oe}},me.createContext=function(f){return f={$$typeof:A,_currentValue:f,_currentValue2:f,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},f.Provider={$$typeof:h,_context:f},f.Consumer=f},me.createElement=B,me.createFactory=function(f){var E=B.bind(null,f);return E.type=f,E},me.createRef=function(){return{current:null}},me.forwardRef=function(f){return{$$typeof:S,render:f}},me.isValidElement=xe,me.lazy=function(f){return{$$typeof:j,_payload:{_status:-1,_result:f},_init:Pe}},me.memo=function(f,E){return{$$typeof:N,type:f,compare:E===void 0?null:E}},me.startTransition=function(f){var E=$.transition;$.transition={};try{f()}finally{$.transition=E}},me.unstable_act=I,me.useCallback=function(f,E){return ge.current.useCallback(f,E)},me.useContext=function(f){return ge.current.useContext(f)},me.useDebugValue=function(){},me.useDeferredValue=function(f){return ge.current.useDeferredValue(f)},me.useEffect=function(f,E){return ge.current.useEffect(f,E)},me.useId=function(){return ge.current.useId()},me.useImperativeHandle=function(f,E,ee){return ge.current.useImperativeHandle(f,E,ee)},me.useInsertionEffect=function(f,E){return ge.current.useInsertionEffect(f,E)},me.useLayoutEffect=function(f,E){return ge.current.useLayoutEffect(f,E)},me.useMemo=function(f,E){return ge.current.useMemo(f,E)},me.useReducer=function(f,E,ee){return ge.current.useReducer(f,E,ee)},me.useRef=function(f){return ge.current.useRef(f)},me.useState=function(f){return ge.current.useState(f)},me.useSyncExternalStore=function(f,E,ee){return ge.current.useSyncExternalStore(f,E,ee)},me.useTransition=function(){return ge.current.useTransition()},me.version="18.3.1",me}var Is;function Fa(){return Is||(Is=1,$a.exports=Dc()),$a.exports}/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Os;function Ic(){if(Os)return Ir;Os=1;var o=Fa(),u=Symbol.for("react.element"),s=Symbol.for("react.fragment"),p=Object.prototype.hasOwnProperty,v=o.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,h={key:!0,ref:!0,__self:!0,__source:!0};function A(S,k,N){var j,C={},U=null,ue=null;N!==void 0&&(U=""+N),k.key!==void 0&&(U=""+k.key),k.ref!==void 0&&(ue=k.ref);for(j in k)p.call(k,j)&&!h.hasOwnProperty(j)&&(C[j]=k[j]);if(S&&S.defaultProps)for(j in k=S.defaultProps,k)C[j]===void 0&&(C[j]=k[j]);return{$$typeof:u,type:S,key:U,ref:ue,props:C,_owner:v.current}}return Ir.Fragment=s,Ir.jsx=A,Ir.jsxs=A,Ir}var $s;function Oc(){return $s||($s=1,un.exports=Ic()),un.exports}var d=Oc();function ig(o){return o}var b=Fa(),El={},Ba={exports:{}},st={},Ua={exports:{}},Ha={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Fs;function $c(){return Fs||(Fs=1,(function(o){function u($,G){var I=$.length;$.push(G);e:for(;0<I;){var f=I-1>>>1,E=$[f];if(0<v(E,G))$[f]=G,$[I]=E,I=f;else break e}}function s($){return $.length===0?null:$[0]}function p($){if($.length===0)return null;var G=$[0],I=$.pop();if(I!==G){$[0]=I;e:for(var f=0,E=$.length,ee=E>>>1;f<ee;){var ae=2*(f+1)-1,pe=$[ae],fe=ae+1,oe=$[fe];if(0>v(pe,I))fe<E&&0>v(oe,pe)?($[f]=oe,$[fe]=I,f=fe):($[f]=pe,$[ae]=I,f=ae);else if(fe<E&&0>v(oe,I))$[f]=oe,$[fe]=I,f=fe;else break e}}return G}function v($,G){var I=$.sortIndex-G.sortIndex;return I!==0?I:$.id-G.id}if(typeof performance=="object"&&typeof performance.now=="function"){var h=performance;o.unstable_now=function(){return h.now()}}else{var A=Date,S=A.now();o.unstable_now=function(){return A.now()-S}}var k=[],N=[],j=1,C=null,U=3,ue=!1,le=!1,ne=!1,ie=typeof setTimeout=="function"?setTimeout:null,z=typeof clearTimeout=="function"?clearTimeout:null,Se=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function Ne($){for(var G=s(N);G!==null;){if(G.callback===null)p(N);else if(G.startTime<=$)p(N),G.sortIndex=G.expirationTime,u(k,G);else break;G=s(N)}}function ke($){if(ne=!1,Ne($),!le)if(s(k)!==null)le=!0,Pe(F);else{var G=s(N);G!==null&&ge(ke,G.startTime-$)}}function F($,G){le=!1,ne&&(ne=!1,z(B),B=-1),ue=!0;var I=U;try{for(Ne(G),C=s(k);C!==null&&(!(C.expirationTime>G)||$&&!Te());){var f=C.callback;if(typeof f=="function"){C.callback=null,U=C.priorityLevel;var E=f(C.expirationTime<=G);G=o.unstable_now(),typeof E=="function"?C.callback=E:C===s(k)&&p(k),Ne(G)}else p(k);C=s(k)}if(C!==null)var ee=!0;else{var ae=s(N);ae!==null&&ge(ke,ae.startTime-G),ee=!1}return ee}finally{C=null,U=I,ue=!1}}var T=!1,D=null,B=-1,Y=5,xe=-1;function Te(){return!(o.unstable_now()-xe<Y)}function Ce(){if(D!==null){var $=o.unstable_now();xe=$;var G=!0;try{G=D(!0,$)}finally{G?q():(T=!1,D=null)}}else T=!1}var q;if(typeof Se=="function")q=function(){Se(Ce)};else if(typeof MessageChannel<"u"){var Ae=new MessageChannel,ye=Ae.port2;Ae.port1.onmessage=Ce,q=function(){ye.postMessage(null)}}else q=function(){ie(Ce,0)};function Pe($){D=$,T||(T=!0,q())}function ge($,G){B=ie(function(){$(o.unstable_now())},G)}o.unstable_IdlePriority=5,o.unstable_ImmediatePriority=1,o.unstable_LowPriority=4,o.unstable_NormalPriority=3,o.unstable_Profiling=null,o.unstable_UserBlockingPriority=2,o.unstable_cancelCallback=function($){$.callback=null},o.unstable_continueExecution=function(){le||ue||(le=!0,Pe(F))},o.unstable_forceFrameRate=function($){0>$||125<$?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):Y=0<$?Math.floor(1e3/$):5},o.unstable_getCurrentPriorityLevel=function(){return U},o.unstable_getFirstCallbackNode=function(){return s(k)},o.unstable_next=function($){switch(U){case 1:case 2:case 3:var G=3;break;default:G=U}var I=U;U=G;try{return $()}finally{U=I}},o.unstable_pauseExecution=function(){},o.unstable_requestPaint=function(){},o.unstable_runWithPriority=function($,G){switch($){case 1:case 2:case 3:case 4:case 5:break;default:$=3}var I=U;U=$;try{return G()}finally{U=I}},o.unstable_scheduleCallback=function($,G,I){var f=o.unstable_now();switch(typeof I=="object"&&I!==null?(I=I.delay,I=typeof I=="number"&&0<I?f+I:f):I=f,$){case 1:var E=-1;break;case 2:E=250;break;case 5:E=1073741823;break;case 4:E=1e4;break;default:E=5e3}return E=I+E,$={id:j++,callback:G,priorityLevel:$,startTime:I,expirationTime:E,sortIndex:-1},I>f?($.sortIndex=I,u(N,$),s(k)===null&&$===s(N)&&(ne?(z(B),B=-1):ne=!0,ge(ke,I-f))):($.sortIndex=E,u(k,$),le||ue||(le=!0,Pe(F))),$},o.unstable_shouldYield=Te,o.unstable_wrapCallback=function($){var G=U;return function(){var I=U;U=G;try{return $.apply(this,arguments)}finally{U=I}}}})(Ha)),Ha}var Bs;function Fc(){return Bs||(Bs=1,Ua.exports=$c()),Ua.exports}/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Us;function Bc(){if(Us)return st;Us=1;var o=Fa(),u=Fc();function s(e){for(var t="https://reactjs.org/docs/error-decoder.html?invariant="+e,n=1;n<arguments.length;n++)t+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var p=new Set,v={};function h(e,t){A(e,t),A(e+"Capture",t)}function A(e,t){for(v[e]=t,e=0;e<t.length;e++)p.add(t[e])}var S=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),k=Object.prototype.hasOwnProperty,N=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,j={},C={};function U(e){return k.call(C,e)?!0:k.call(j,e)?!1:N.test(e)?C[e]=!0:(j[e]=!0,!1)}function ue(e,t,n,r){if(n!==null&&n.type===0)return!1;switch(typeof t){case"function":case"symbol":return!0;case"boolean":return r?!1:n!==null?!n.acceptsBooleans:(e=e.toLowerCase().slice(0,5),e!=="data-"&&e!=="aria-");default:return!1}}function le(e,t,n,r){if(t===null||typeof t>"u"||ue(e,t,n,r))return!0;if(r)return!1;if(n!==null)switch(n.type){case 3:return!t;case 4:return t===!1;case 5:return isNaN(t);case 6:return isNaN(t)||1>t}return!1}function ne(e,t,n,r,l,a,i){this.acceptsBooleans=t===2||t===3||t===4,this.attributeName=r,this.attributeNamespace=l,this.mustUseProperty=n,this.propertyName=e,this.type=t,this.sanitizeURL=a,this.removeEmptyString=i}var ie={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e){ie[e]=new ne(e,0,!1,e,null,!1,!1)}),[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(e){var t=e[0];ie[t]=new ne(t,1,!1,e[1],null,!1,!1)}),["contentEditable","draggable","spellCheck","value"].forEach(function(e){ie[e]=new ne(e,2,!1,e.toLowerCase(),null,!1,!1)}),["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(e){ie[e]=new ne(e,2,!1,e,null,!1,!1)}),"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e){ie[e]=new ne(e,3,!1,e.toLowerCase(),null,!1,!1)}),["checked","multiple","muted","selected"].forEach(function(e){ie[e]=new ne(e,3,!0,e,null,!1,!1)}),["capture","download"].forEach(function(e){ie[e]=new ne(e,4,!1,e,null,!1,!1)}),["cols","rows","size","span"].forEach(function(e){ie[e]=new ne(e,6,!1,e,null,!1,!1)}),["rowSpan","start"].forEach(function(e){ie[e]=new ne(e,5,!1,e.toLowerCase(),null,!1,!1)});var z=/[\-:]([a-z])/g;function Se(e){return e[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e){var t=e.replace(z,Se);ie[t]=new ne(t,1,!1,e,null,!1,!1)}),"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e){var t=e.replace(z,Se);ie[t]=new ne(t,1,!1,e,"http://www.w3.org/1999/xlink",!1,!1)}),["xml:base","xml:lang","xml:space"].forEach(function(e){var t=e.replace(z,Se);ie[t]=new ne(t,1,!1,e,"http://www.w3.org/XML/1998/namespace",!1,!1)}),["tabIndex","crossOrigin"].forEach(function(e){ie[e]=new ne(e,1,!1,e.toLowerCase(),null,!1,!1)}),ie.xlinkHref=new ne("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1),["src","href","action","formAction"].forEach(function(e){ie[e]=new ne(e,1,!1,e.toLowerCase(),null,!0,!0)});function Ne(e,t,n,r){var l=ie.hasOwnProperty(t)?ie[t]:null;(l!==null?l.type!==0:r||!(2<t.length)||t[0]!=="o"&&t[0]!=="O"||t[1]!=="n"&&t[1]!=="N")&&(le(t,n,l,r)&&(n=null),r||l===null?U(t)&&(n===null?e.removeAttribute(t):e.setAttribute(t,""+n)):l.mustUseProperty?e[l.propertyName]=n===null?l.type===3?!1:"":n:(t=l.attributeName,r=l.attributeNamespace,n===null?e.removeAttribute(t):(l=l.type,n=l===3||l===4&&n===!0?"":""+n,r?e.setAttributeNS(r,t,n):e.setAttribute(t,n))))}var ke=o.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,F=Symbol.for("react.element"),T=Symbol.for("react.portal"),D=Symbol.for("react.fragment"),B=Symbol.for("react.strict_mode"),Y=Symbol.for("react.profiler"),xe=Symbol.for("react.provider"),Te=Symbol.for("react.context"),Ce=Symbol.for("react.forward_ref"),q=Symbol.for("react.suspense"),Ae=Symbol.for("react.suspense_list"),ye=Symbol.for("react.memo"),Pe=Symbol.for("react.lazy"),ge=Symbol.for("react.offscreen"),$=Symbol.iterator;function G(e){return e===null||typeof e!="object"?null:(e=$&&e[$]||e["@@iterator"],typeof e=="function"?e:null)}var I=Object.assign,f;function E(e){if(f===void 0)try{throw Error()}catch(n){var t=n.stack.trim().match(/\n( *(at )?)/);f=t&&t[1]||""}return`
`+f+e}var ee=!1;function ae(e,t){if(!e||ee)return"";ee=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(t)if(t=function(){throw Error()},Object.defineProperty(t.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(t,[])}catch(w){var r=w}Reflect.construct(e,[],t)}else{try{t.call()}catch(w){r=w}e.call(t.prototype)}else{try{throw Error()}catch(w){r=w}e()}}catch(w){if(w&&r&&typeof w.stack=="string"){for(var l=w.stack.split(`
`),a=r.stack.split(`
`),i=l.length-1,c=a.length-1;1<=i&&0<=c&&l[i]!==a[c];)c--;for(;1<=i&&0<=c;i--,c--)if(l[i]!==a[c]){if(i!==1||c!==1)do if(i--,c--,0>c||l[i]!==a[c]){var g=`
`+l[i].replace(" at new "," at ");return e.displayName&&g.includes("<anonymous>")&&(g=g.replace("<anonymous>",e.displayName)),g}while(1<=i&&0<=c);break}}}finally{ee=!1,Error.prepareStackTrace=n}return(e=e?e.displayName||e.name:"")?E(e):""}function pe(e){switch(e.tag){case 5:return E(e.type);case 16:return E("Lazy");case 13:return E("Suspense");case 19:return E("SuspenseList");case 0:case 2:case 15:return e=ae(e.type,!1),e;case 11:return e=ae(e.type.render,!1),e;case 1:return e=ae(e.type,!0),e;default:return""}}function fe(e){if(e==null)return null;if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case D:return"Fragment";case T:return"Portal";case Y:return"Profiler";case B:return"StrictMode";case q:return"Suspense";case Ae:return"SuspenseList"}if(typeof e=="object")switch(e.$$typeof){case Te:return(e.displayName||"Context")+".Consumer";case xe:return(e._context.displayName||"Context")+".Provider";case Ce:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case ye:return t=e.displayName||null,t!==null?t:fe(e.type)||"Memo";case Pe:t=e._payload,e=e._init;try{return fe(e(t))}catch{}}return null}function oe(e){var t=e.type;switch(e.tag){case 24:return"Cache";case 9:return(t.displayName||"Context")+".Consumer";case 10:return(t._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return e=t.render,e=e.displayName||e.name||"",t.displayName||(e!==""?"ForwardRef("+e+")":"ForwardRef");case 7:return"Fragment";case 5:return t;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return fe(t);case 8:return t===B?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t}return null}function de(e){switch(typeof e){case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function he(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function Le(e){var t=he(e)?"checked":"value",n=Object.getOwnPropertyDescriptor(e.constructor.prototype,t),r=""+e[t];if(!e.hasOwnProperty(t)&&typeof n<"u"&&typeof n.get=="function"&&typeof n.set=="function"){var l=n.get,a=n.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return l.call(this)},set:function(i){r=""+i,a.call(this,i)}}),Object.defineProperty(e,t,{enumerable:n.enumerable}),{getValue:function(){return r},setValue:function(i){r=""+i},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function lt(e){e._valueTracker||(e._valueTracker=Le(e))}function Xe(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),r="";return e&&(r=he(e)?e.checked?"true":"false":e.value),e=r,e!==n?(t.setValue(e),!0):!1}function dn(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}function Ze(e,t){var n=t.checked;return I({},t,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:n??e._wrapperState.initialChecked})}function rr(e,t){var n=t.defaultValue==null?"":t.defaultValue,r=t.checked!=null?t.checked:t.defaultChecked;n=de(t.value!=null?t.value:n),e._wrapperState={initialChecked:r,initialValue:n,controlled:t.type==="checkbox"||t.type==="radio"?t.checked!=null:t.value!=null}}function Bt(e,t){t=t.checked,t!=null&&Ne(e,"checked",t,!1)}function Ut(e,t){Bt(e,t);var n=de(t.value),r=t.type;if(n!=null)r==="number"?(n===0&&e.value===""||e.value!=n)&&(e.value=""+n):e.value!==""+n&&(e.value=""+n);else if(r==="submit"||r==="reset"){e.removeAttribute("value");return}t.hasOwnProperty("value")?Fr(e,t.type,n):t.hasOwnProperty("defaultValue")&&Fr(e,t.type,de(t.defaultValue)),t.checked==null&&t.defaultChecked!=null&&(e.defaultChecked=!!t.defaultChecked)}function Rn(e,t,n){if(t.hasOwnProperty("value")||t.hasOwnProperty("defaultValue")){var r=t.type;if(!(r!=="submit"&&r!=="reset"||t.value!==void 0&&t.value!==null))return;t=""+e._wrapperState.initialValue,n||t===e.value||(e.value=t),e.defaultValue=t}n=e.name,n!==""&&(e.name=""),e.defaultChecked=!!e._wrapperState.initialChecked,n!==""&&(e.name=n)}function Fr(e,t,n){(t!=="number"||dn(e.ownerDocument)!==e)&&(n==null?e.defaultValue=""+e._wrapperState.initialValue:e.defaultValue!==""+n&&(e.defaultValue=""+n))}var pn=Array.isArray;function Je(e,t,n,r){if(e=e.options,t){t={};for(var l=0;l<n.length;l++)t["$"+n[l]]=!0;for(n=0;n<e.length;n++)l=t.hasOwnProperty("$"+e[n].value),e[n].selected!==l&&(e[n].selected=l),l&&r&&(e[n].defaultSelected=!0)}else{for(n=""+de(n),t=null,l=0;l<e.length;l++){if(e[l].value===n){e[l].selected=!0,r&&(e[l].defaultSelected=!0);return}t!==null||e[l].disabled||(t=e[l])}t!==null&&(t.selected=!0)}}function fn(e,t){if(t.dangerouslySetInnerHTML!=null)throw Error(s(91));return I({},t,{value:void 0,defaultValue:void 0,children:""+e._wrapperState.initialValue})}function Jt(e,t){var n=t.value;if(n==null){if(n=t.children,t=t.defaultValue,n!=null){if(t!=null)throw Error(s(92));if(pn(n)){if(1<n.length)throw Error(s(93));n=n[0]}t=n}t==null&&(t=""),n=t}e._wrapperState={initialValue:de(n)}}function lr(e,t){var n=de(t.value),r=de(t.defaultValue);n!=null&&(n=""+n,n!==e.value&&(e.value=n),t.defaultValue==null&&e.defaultValue!==n&&(e.defaultValue=n)),r!=null&&(e.defaultValue=""+r)}function We(e){var t=e.textContent;t===e._wrapperState.initialValue&&t!==""&&t!==null&&(e.value=t)}function ar(e){switch(e){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function or(e,t){return e==null||e==="http://www.w3.org/1999/xhtml"?ar(t):e==="http://www.w3.org/2000/svg"&&t==="foreignObject"?"http://www.w3.org/1999/xhtml":e}var Gt,gn=(function(e){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(t,n,r,l){MSApp.execUnsafeLocalFunction(function(){return e(t,n,r,l)})}:e})(function(e,t){if(e.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in e)e.innerHTML=t;else{for(Gt=Gt||document.createElement("div"),Gt.innerHTML="<svg>"+t.valueOf().toString()+"</svg>",t=Gt.firstChild;e.firstChild;)e.removeChild(e.firstChild);for(;t.firstChild;)e.appendChild(t.firstChild)}});function Tt(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&n.nodeType===3){n.nodeValue=t;return}}e.textContent=t}var wt={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},sr=["Webkit","ms","Moz","O"];Object.keys(wt).forEach(function(e){sr.forEach(function(t){t=t+e.charAt(0).toUpperCase()+e.substring(1),wt[t]=wt[e]})});function Pt(e,t,n){return t==null||typeof t=="boolean"||t===""?"":n||typeof t!="number"||t===0||wt.hasOwnProperty(e)&&wt[e]?(""+t).trim():t+"px"}function Br(e,t){e=e.style;for(var n in t)if(t.hasOwnProperty(n)){var r=n.indexOf("--")===0,l=Pt(n,t[n],r);n==="float"&&(n="cssFloat"),r?e.setProperty(n,l):e[n]=l}}var qa=I({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function ir(e,t){if(t){if(qa[e]&&(t.children!=null||t.dangerouslySetInnerHTML!=null))throw Error(s(137,e));if(t.dangerouslySetInnerHTML!=null){if(t.children!=null)throw Error(s(60));if(typeof t.dangerouslySetInnerHTML!="object"||!("__html"in t.dangerouslySetInnerHTML))throw Error(s(61))}if(t.style!=null&&typeof t.style!="object")throw Error(s(62))}}function ur(e,t){if(e.indexOf("-")===-1)return typeof t.is=="string";switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Dn=null;function cr(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var jt=null,gt=null,Mt=null;function In(e){if(e=cl(e)){if(typeof jt!="function")throw Error(s(280));var t=e.stateNode;t&&(t=ea(t),jt(e.stateNode,e.type,t))}}function Ml(e){gt?Mt?Mt.push(e):Mt=[e]:gt=e}function Ur(){if(gt){var e=gt,t=Mt;if(Mt=gt=null,In(e),t)for(e=0;e<t.length;e++)In(t[e])}}function Hr(e,t){return e(t)}function qt(){}var On=!1;function $n(e,t,n){if(On)return e(t,n);On=!0;try{return Hr(e,t,n)}finally{On=!1,(gt!==null||Mt!==null)&&(qt(),Ur())}}function Fn(e,t){var n=e.stateNode;if(n===null)return null;var r=ea(n);if(r===null)return null;n=r[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(r=!r.disabled)||(e=e.type,r=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!r;break e;default:e=!1}if(e)return null;if(n&&typeof n!="function")throw Error(s(231,t,typeof n));return n}var mt=!1;if(S)try{var Xt={};Object.defineProperty(Xt,"passive",{get:function(){mt=!0}}),window.addEventListener("test",Xt,Xt),window.removeEventListener("test",Xt,Xt)}catch{mt=!1}function Vr(e,t,n,r,l,a,i,c,g){var w=Array.prototype.slice.call(arguments,3);try{t.apply(n,w)}catch(L){this.onError(L)}}var mn=!1,Bn=null,Zt=!1,dr=null,pr={onError:function(e){mn=!0,Bn=e}};function Xa(e,t,n,r,l,a,i,c,g){mn=!1,Bn=null,Vr.apply(pr,arguments)}function zt(e,t,n,r,l,a,i,c,g){if(Xa.apply(this,arguments),mn){if(mn){var w=Bn;mn=!1,Bn=null}else throw Error(s(198));Zt||(Zt=!0,dr=w)}}function Lt(e){var t=e,n=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,(t.flags&4098)!==0&&(n=t.return),e=t.return;while(e)}return t.tag===3?n:null}function kt(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function fr(e){if(Lt(e)!==e)throw Error(s(188))}function Za(e){var t=e.alternate;if(!t){if(t=Lt(e),t===null)throw Error(s(188));return t!==e?null:e}for(var n=e,r=t;;){var l=n.return;if(l===null)break;var a=l.alternate;if(a===null){if(r=l.return,r!==null){n=r;continue}break}if(l.child===a.child){for(a=l.child;a;){if(a===n)return fr(l),e;if(a===r)return fr(l),t;a=a.sibling}throw Error(s(188))}if(n.return!==r.return)n=l,r=a;else{for(var i=!1,c=l.child;c;){if(c===n){i=!0,n=l,r=a;break}if(c===r){i=!0,r=l,n=a;break}c=c.sibling}if(!i){for(c=a.child;c;){if(c===n){i=!0,n=a,r=l;break}if(c===r){i=!0,r=a,n=l;break}c=c.sibling}if(!i)throw Error(s(189))}}if(n.alternate!==r)throw Error(s(190))}if(n.tag!==3)throw Error(s(188));return n.stateNode.current===n?e:t}function Wr(e){return e=Za(e),e!==null?zl(e):null}function zl(e){if(e.tag===5||e.tag===6)return e;for(e=e.child;e!==null;){var t=zl(e);if(t!==null)return t;e=e.sibling}return null}var Un=u.unstable_scheduleCallback,Ll=u.unstable_cancelCallback,eo=u.unstable_shouldYield,to=u.unstable_requestPaint,Re=u.unstable_now,Rl=u.unstable_getCurrentPriorityLevel,gr=u.unstable_ImmediatePriority,m=u.unstable_UserBlockingPriority,P=u.unstable_NormalPriority,H=u.unstable_LowPriority,re=u.unstable_IdlePriority,ve=null,ce=null;function it(e){if(ce&&typeof ce.onCommitFiberRoot=="function")try{ce.onCommitFiberRoot(ve,e,void 0,(e.current.flags&128)===128)}catch{}}var te=Math.clz32?Math.clz32:Hn,_e=Math.log,$e=Math.LN2;function Hn(e){return e>>>=0,e===0?32:31-(_e(e)/$e|0)|0}var Dl=64,Il=4194304;function Kr(e){switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return e&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return e}}function Ol(e,t){var n=e.pendingLanes;if(n===0)return 0;var r=0,l=e.suspendedLanes,a=e.pingedLanes,i=n&268435455;if(i!==0){var c=i&~l;c!==0?r=Kr(c):(a&=i,a!==0&&(r=Kr(a)))}else i=n&~l,i!==0?r=Kr(i):a!==0&&(r=Kr(a));if(r===0)return 0;if(t!==0&&t!==r&&(t&l)===0&&(l=r&-r,a=t&-t,l>=a||l===16&&(a&4194240)!==0))return t;if((r&4)!==0&&(r|=n&16),t=e.entangledLanes,t!==0)for(e=e.entanglements,t&=r;0<t;)n=31-te(t),l=1<<n,r|=e[n],t&=~l;return r}function Sp(e,t){switch(e){case 1:case 2:case 4:return t+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Ep(e,t){for(var n=e.suspendedLanes,r=e.pingedLanes,l=e.expirationTimes,a=e.pendingLanes;0<a;){var i=31-te(a),c=1<<i,g=l[i];g===-1?((c&n)===0||(c&r)!==0)&&(l[i]=Sp(c,t)):g<=t&&(e.expiredLanes|=c),a&=~c}}function no(e){return e=e.pendingLanes&-1073741825,e!==0?e:e&1073741824?1073741824:0}function fi(){var e=Dl;return Dl<<=1,(Dl&4194240)===0&&(Dl=64),e}function ro(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function Yr(e,t,n){e.pendingLanes|=t,t!==536870912&&(e.suspendedLanes=0,e.pingedLanes=0),e=e.eventTimes,t=31-te(t),e[t]=n}function Cp(e,t){var n=e.pendingLanes&~t;e.pendingLanes=t,e.suspendedLanes=0,e.pingedLanes=0,e.expiredLanes&=t,e.mutableReadLanes&=t,e.entangledLanes&=t,t=e.entanglements;var r=e.eventTimes;for(e=e.expirationTimes;0<n;){var l=31-te(n),a=1<<l;t[l]=0,r[l]=-1,e[l]=-1,n&=~a}}function lo(e,t){var n=e.entangledLanes|=t;for(e=e.entanglements;n;){var r=31-te(n),l=1<<r;l&t|e[r]&t&&(e[r]|=t),n&=~l}}var Ee=0;function gi(e){return e&=-e,1<e?4<e?(e&268435455)!==0?16:536870912:4:1}var mi,ao,hi,xi,vi,oo=!1,$l=[],hn=null,xn=null,vn=null,Qr=new Map,Jr=new Map,yn=[],Ap="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function yi(e,t){switch(e){case"focusin":case"focusout":hn=null;break;case"dragenter":case"dragleave":xn=null;break;case"mouseover":case"mouseout":vn=null;break;case"pointerover":case"pointerout":Qr.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":Jr.delete(t.pointerId)}}function Gr(e,t,n,r,l,a){return e===null||e.nativeEvent!==a?(e={blockedOn:t,domEventName:n,eventSystemFlags:r,nativeEvent:a,targetContainers:[l]},t!==null&&(t=cl(t),t!==null&&ao(t)),e):(e.eventSystemFlags|=r,t=e.targetContainers,l!==null&&t.indexOf(l)===-1&&t.push(l),e)}function Np(e,t,n,r,l){switch(t){case"focusin":return hn=Gr(hn,e,t,n,r,l),!0;case"dragenter":return xn=Gr(xn,e,t,n,r,l),!0;case"mouseover":return vn=Gr(vn,e,t,n,r,l),!0;case"pointerover":var a=l.pointerId;return Qr.set(a,Gr(Qr.get(a)||null,e,t,n,r,l)),!0;case"gotpointercapture":return a=l.pointerId,Jr.set(a,Gr(Jr.get(a)||null,e,t,n,r,l)),!0}return!1}function _i(e){var t=Vn(e.target);if(t!==null){var n=Lt(t);if(n!==null){if(t=n.tag,t===13){if(t=kt(n),t!==null){e.blockedOn=t,vi(e.priority,function(){hi(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}e.blockedOn=null}function Fl(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var n=io(e.domEventName,e.eventSystemFlags,t[0],e.nativeEvent);if(n===null){n=e.nativeEvent;var r=new n.constructor(n.type,n);Dn=r,n.target.dispatchEvent(r),Dn=null}else return t=cl(n),t!==null&&ao(t),e.blockedOn=n,!1;t.shift()}return!0}function wi(e,t,n){Fl(e)&&n.delete(t)}function Tp(){oo=!1,hn!==null&&Fl(hn)&&(hn=null),xn!==null&&Fl(xn)&&(xn=null),vn!==null&&Fl(vn)&&(vn=null),Qr.forEach(wi),Jr.forEach(wi)}function qr(e,t){e.blockedOn===t&&(e.blockedOn=null,oo||(oo=!0,u.unstable_scheduleCallback(u.unstable_NormalPriority,Tp)))}function Xr(e){function t(l){return qr(l,e)}if(0<$l.length){qr($l[0],e);for(var n=1;n<$l.length;n++){var r=$l[n];r.blockedOn===e&&(r.blockedOn=null)}}for(hn!==null&&qr(hn,e),xn!==null&&qr(xn,e),vn!==null&&qr(vn,e),Qr.forEach(t),Jr.forEach(t),n=0;n<yn.length;n++)r=yn[n],r.blockedOn===e&&(r.blockedOn=null);for(;0<yn.length&&(n=yn[0],n.blockedOn===null);)_i(n),n.blockedOn===null&&yn.shift()}var mr=ke.ReactCurrentBatchConfig,Bl=!0;function Pp(e,t,n,r){var l=Ee,a=mr.transition;mr.transition=null;try{Ee=1,so(e,t,n,r)}finally{Ee=l,mr.transition=a}}function jp(e,t,n,r){var l=Ee,a=mr.transition;mr.transition=null;try{Ee=4,so(e,t,n,r)}finally{Ee=l,mr.transition=a}}function so(e,t,n,r){if(Bl){var l=io(e,t,n,r);if(l===null)Co(e,t,r,Ul,n),yi(e,r);else if(Np(l,e,t,n,r))r.stopPropagation();else if(yi(e,r),t&4&&-1<Ap.indexOf(e)){for(;l!==null;){var a=cl(l);if(a!==null&&mi(a),a=io(e,t,n,r),a===null&&Co(e,t,r,Ul,n),a===l)break;l=a}l!==null&&r.stopPropagation()}else Co(e,t,r,null,n)}}var Ul=null;function io(e,t,n,r){if(Ul=null,e=cr(r),e=Vn(e),e!==null)if(t=Lt(e),t===null)e=null;else if(n=t.tag,n===13){if(e=kt(t),e!==null)return e;e=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null);return Ul=e,null}function ki(e){switch(e){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(Rl()){case gr:return 1;case m:return 4;case P:case H:return 16;case re:return 536870912;default:return 16}default:return 16}}var _n=null,uo=null,Hl=null;function bi(){if(Hl)return Hl;var e,t=uo,n=t.length,r,l="value"in _n?_n.value:_n.textContent,a=l.length;for(e=0;e<n&&t[e]===l[e];e++);var i=n-e;for(r=1;r<=i&&t[n-r]===l[a-r];r++);return Hl=l.slice(e,1<r?1-r:void 0)}function Vl(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function Wl(){return!0}function Si(){return!1}function ht(e){function t(n,r,l,a,i){this._reactName=n,this._targetInst=l,this.type=r,this.nativeEvent=a,this.target=i,this.currentTarget=null;for(var c in e)e.hasOwnProperty(c)&&(n=e[c],this[c]=n?n(a):a[c]);return this.isDefaultPrevented=(a.defaultPrevented!=null?a.defaultPrevented:a.returnValue===!1)?Wl:Si,this.isPropagationStopped=Si,this}return I(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=Wl)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=Wl)},persist:function(){},isPersistent:Wl}),t}var hr={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},co=ht(hr),Zr=I({},hr,{view:0,detail:0}),Mp=ht(Zr),po,fo,el,Kl=I({},Zr,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:mo,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==el&&(el&&e.type==="mousemove"?(po=e.screenX-el.screenX,fo=e.screenY-el.screenY):fo=po=0,el=e),po)},movementY:function(e){return"movementY"in e?e.movementY:fo}}),Ei=ht(Kl),zp=I({},Kl,{dataTransfer:0}),Lp=ht(zp),Rp=I({},Zr,{relatedTarget:0}),go=ht(Rp),Dp=I({},hr,{animationName:0,elapsedTime:0,pseudoElement:0}),Ip=ht(Dp),Op=I({},hr,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),$p=ht(Op),Fp=I({},hr,{data:0}),Ci=ht(Fp),Bp={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Up={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Hp={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Vp(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=Hp[e])?!!t[e]:!1}function mo(){return Vp}var Wp=I({},Zr,{key:function(e){if(e.key){var t=Bp[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=Vl(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?Up[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:mo,charCode:function(e){return e.type==="keypress"?Vl(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?Vl(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),Kp=ht(Wp),Yp=I({},Kl,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Ai=ht(Yp),Qp=I({},Zr,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:mo}),Jp=ht(Qp),Gp=I({},hr,{propertyName:0,elapsedTime:0,pseudoElement:0}),qp=ht(Gp),Xp=I({},Kl,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),Zp=ht(Xp),ef=[9,13,27,32],ho=S&&"CompositionEvent"in window,tl=null;S&&"documentMode"in document&&(tl=document.documentMode);var tf=S&&"TextEvent"in window&&!tl,Ni=S&&(!ho||tl&&8<tl&&11>=tl),Ti=" ",Pi=!1;function ji(e,t){switch(e){case"keyup":return ef.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Mi(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var xr=!1;function nf(e,t){switch(e){case"compositionend":return Mi(t);case"keypress":return t.which!==32?null:(Pi=!0,Ti);case"textInput":return e=t.data,e===Ti&&Pi?null:e;default:return null}}function rf(e,t){if(xr)return e==="compositionend"||!ho&&ji(e,t)?(e=bi(),Hl=uo=_n=null,xr=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return Ni&&t.locale!=="ko"?null:t.data;default:return null}}var lf={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function zi(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!lf[e.type]:t==="textarea"}function Li(e,t,n,r){Ml(r),t=ql(t,"onChange"),0<t.length&&(n=new co("onChange","change",null,n,r),e.push({event:n,listeners:t}))}var nl=null,rl=null;function af(e){Xi(e,0)}function Yl(e){var t=kr(e);if(Xe(t))return e}function of(e,t){if(e==="change")return t}var Ri=!1;if(S){var xo;if(S){var vo="oninput"in document;if(!vo){var Di=document.createElement("div");Di.setAttribute("oninput","return;"),vo=typeof Di.oninput=="function"}xo=vo}else xo=!1;Ri=xo&&(!document.documentMode||9<document.documentMode)}function Ii(){nl&&(nl.detachEvent("onpropertychange",Oi),rl=nl=null)}function Oi(e){if(e.propertyName==="value"&&Yl(rl)){var t=[];Li(t,rl,e,cr(e)),$n(af,t)}}function sf(e,t,n){e==="focusin"?(Ii(),nl=t,rl=n,nl.attachEvent("onpropertychange",Oi)):e==="focusout"&&Ii()}function uf(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return Yl(rl)}function cf(e,t){if(e==="click")return Yl(t)}function df(e,t){if(e==="input"||e==="change")return Yl(t)}function pf(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var Rt=typeof Object.is=="function"?Object.is:pf;function ll(e,t){if(Rt(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var n=Object.keys(e),r=Object.keys(t);if(n.length!==r.length)return!1;for(r=0;r<n.length;r++){var l=n[r];if(!k.call(t,l)||!Rt(e[l],t[l]))return!1}return!0}function $i(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function Fi(e,t){var n=$i(e);e=0;for(var r;n;){if(n.nodeType===3){if(r=e+n.textContent.length,e<=t&&r>=t)return{node:n,offset:t-e};e=r}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=$i(n)}}function Bi(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?Bi(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function Ui(){for(var e=window,t=dn();t instanceof e.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href=="string"}catch{n=!1}if(n)e=t.contentWindow;else break;t=dn(e.document)}return t}function yo(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}function ff(e){var t=Ui(),n=e.focusedElem,r=e.selectionRange;if(t!==n&&n&&n.ownerDocument&&Bi(n.ownerDocument.documentElement,n)){if(r!==null&&yo(n)){if(t=r.start,e=r.end,e===void 0&&(e=t),"selectionStart"in n)n.selectionStart=t,n.selectionEnd=Math.min(e,n.value.length);else if(e=(t=n.ownerDocument||document)&&t.defaultView||window,e.getSelection){e=e.getSelection();var l=n.textContent.length,a=Math.min(r.start,l);r=r.end===void 0?a:Math.min(r.end,l),!e.extend&&a>r&&(l=r,r=a,a=l),l=Fi(n,a);var i=Fi(n,r);l&&i&&(e.rangeCount!==1||e.anchorNode!==l.node||e.anchorOffset!==l.offset||e.focusNode!==i.node||e.focusOffset!==i.offset)&&(t=t.createRange(),t.setStart(l.node,l.offset),e.removeAllRanges(),a>r?(e.addRange(t),e.extend(i.node,i.offset)):(t.setEnd(i.node,i.offset),e.addRange(t)))}}for(t=[],e=n;e=e.parentNode;)e.nodeType===1&&t.push({element:e,left:e.scrollLeft,top:e.scrollTop});for(typeof n.focus=="function"&&n.focus(),n=0;n<t.length;n++)e=t[n],e.element.scrollLeft=e.left,e.element.scrollTop=e.top}}var gf=S&&"documentMode"in document&&11>=document.documentMode,vr=null,_o=null,al=null,wo=!1;function Hi(e,t,n){var r=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;wo||vr==null||vr!==dn(r)||(r=vr,"selectionStart"in r&&yo(r)?r={start:r.selectionStart,end:r.selectionEnd}:(r=(r.ownerDocument&&r.ownerDocument.defaultView||window).getSelection(),r={anchorNode:r.anchorNode,anchorOffset:r.anchorOffset,focusNode:r.focusNode,focusOffset:r.focusOffset}),al&&ll(al,r)||(al=r,r=ql(_o,"onSelect"),0<r.length&&(t=new co("onSelect","select",null,t,n),e.push({event:t,listeners:r}),t.target=vr)))}function Ql(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n["Webkit"+e]="webkit"+t,n["Moz"+e]="moz"+t,n}var yr={animationend:Ql("Animation","AnimationEnd"),animationiteration:Ql("Animation","AnimationIteration"),animationstart:Ql("Animation","AnimationStart"),transitionend:Ql("Transition","TransitionEnd")},ko={},Vi={};S&&(Vi=document.createElement("div").style,"AnimationEvent"in window||(delete yr.animationend.animation,delete yr.animationiteration.animation,delete yr.animationstart.animation),"TransitionEvent"in window||delete yr.transitionend.transition);function Jl(e){if(ko[e])return ko[e];if(!yr[e])return e;var t=yr[e],n;for(n in t)if(t.hasOwnProperty(n)&&n in Vi)return ko[e]=t[n];return e}var Wi=Jl("animationend"),Ki=Jl("animationiteration"),Yi=Jl("animationstart"),Qi=Jl("transitionend"),Ji=new Map,Gi="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function wn(e,t){Ji.set(e,t),h(t,[e])}for(var bo=0;bo<Gi.length;bo++){var So=Gi[bo],mf=So.toLowerCase(),hf=So[0].toUpperCase()+So.slice(1);wn(mf,"on"+hf)}wn(Wi,"onAnimationEnd"),wn(Ki,"onAnimationIteration"),wn(Yi,"onAnimationStart"),wn("dblclick","onDoubleClick"),wn("focusin","onFocus"),wn("focusout","onBlur"),wn(Qi,"onTransitionEnd"),A("onMouseEnter",["mouseout","mouseover"]),A("onMouseLeave",["mouseout","mouseover"]),A("onPointerEnter",["pointerout","pointerover"]),A("onPointerLeave",["pointerout","pointerover"]),h("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),h("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),h("onBeforeInput",["compositionend","keypress","textInput","paste"]),h("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),h("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),h("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var ol="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),xf=new Set("cancel close invalid load scroll toggle".split(" ").concat(ol));function qi(e,t,n){var r=e.type||"unknown-event";e.currentTarget=n,zt(r,t,void 0,e),e.currentTarget=null}function Xi(e,t){t=(t&4)!==0;for(var n=0;n<e.length;n++){var r=e[n],l=r.event;r=r.listeners;e:{var a=void 0;if(t)for(var i=r.length-1;0<=i;i--){var c=r[i],g=c.instance,w=c.currentTarget;if(c=c.listener,g!==a&&l.isPropagationStopped())break e;qi(l,c,w),a=g}else for(i=0;i<r.length;i++){if(c=r[i],g=c.instance,w=c.currentTarget,c=c.listener,g!==a&&l.isPropagationStopped())break e;qi(l,c,w),a=g}}}if(Zt)throw e=dr,Zt=!1,dr=null,e}function Me(e,t){var n=t[Mo];n===void 0&&(n=t[Mo]=new Set);var r=e+"__bubble";n.has(r)||(Zi(t,e,2,!1),n.add(r))}function Eo(e,t,n){var r=0;t&&(r|=4),Zi(n,e,r,t)}var Gl="_reactListening"+Math.random().toString(36).slice(2);function sl(e){if(!e[Gl]){e[Gl]=!0,p.forEach(function(n){n!=="selectionchange"&&(xf.has(n)||Eo(n,!1,e),Eo(n,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[Gl]||(t[Gl]=!0,Eo("selectionchange",!1,t))}}function Zi(e,t,n,r){switch(ki(t)){case 1:var l=Pp;break;case 4:l=jp;break;default:l=so}n=l.bind(null,t,n,e),l=void 0,!mt||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(l=!0),r?l!==void 0?e.addEventListener(t,n,{capture:!0,passive:l}):e.addEventListener(t,n,!0):l!==void 0?e.addEventListener(t,n,{passive:l}):e.addEventListener(t,n,!1)}function Co(e,t,n,r,l){var a=r;if((t&1)===0&&(t&2)===0&&r!==null)e:for(;;){if(r===null)return;var i=r.tag;if(i===3||i===4){var c=r.stateNode.containerInfo;if(c===l||c.nodeType===8&&c.parentNode===l)break;if(i===4)for(i=r.return;i!==null;){var g=i.tag;if((g===3||g===4)&&(g=i.stateNode.containerInfo,g===l||g.nodeType===8&&g.parentNode===l))return;i=i.return}for(;c!==null;){if(i=Vn(c),i===null)return;if(g=i.tag,g===5||g===6){r=a=i;continue e}c=c.parentNode}}r=r.return}$n(function(){var w=a,L=cr(n),R=[];e:{var M=Ji.get(e);if(M!==void 0){var V=co,K=e;switch(e){case"keypress":if(Vl(n)===0)break e;case"keydown":case"keyup":V=Kp;break;case"focusin":K="focus",V=go;break;case"focusout":K="blur",V=go;break;case"beforeblur":case"afterblur":V=go;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":V=Ei;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":V=Lp;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":V=Jp;break;case Wi:case Ki:case Yi:V=Ip;break;case Qi:V=qp;break;case"scroll":V=Mp;break;case"wheel":V=Zp;break;case"copy":case"cut":case"paste":V=$p;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":V=Ai}var Q=(t&4)!==0,Be=!Q&&e==="scroll",y=Q?M!==null?M+"Capture":null:M;Q=[];for(var x=w,_;x!==null;){_=x;var O=_.stateNode;if(_.tag===5&&O!==null&&(_=O,y!==null&&(O=Fn(x,y),O!=null&&Q.push(il(x,O,_)))),Be)break;x=x.return}0<Q.length&&(M=new V(M,K,null,n,L),R.push({event:M,listeners:Q}))}}if((t&7)===0){e:{if(M=e==="mouseover"||e==="pointerover",V=e==="mouseout"||e==="pointerout",M&&n!==Dn&&(K=n.relatedTarget||n.fromElement)&&(Vn(K)||K[en]))break e;if((V||M)&&(M=L.window===L?L:(M=L.ownerDocument)?M.defaultView||M.parentWindow:window,V?(K=n.relatedTarget||n.toElement,V=w,K=K?Vn(K):null,K!==null&&(Be=Lt(K),K!==Be||K.tag!==5&&K.tag!==6)&&(K=null)):(V=null,K=w),V!==K)){if(Q=Ei,O="onMouseLeave",y="onMouseEnter",x="mouse",(e==="pointerout"||e==="pointerover")&&(Q=Ai,O="onPointerLeave",y="onPointerEnter",x="pointer"),Be=V==null?M:kr(V),_=K==null?M:kr(K),M=new Q(O,x+"leave",V,n,L),M.target=Be,M.relatedTarget=_,O=null,Vn(L)===w&&(Q=new Q(y,x+"enter",K,n,L),Q.target=_,Q.relatedTarget=Be,O=Q),Be=O,V&&K)t:{for(Q=V,y=K,x=0,_=Q;_;_=_r(_))x++;for(_=0,O=y;O;O=_r(O))_++;for(;0<x-_;)Q=_r(Q),x--;for(;0<_-x;)y=_r(y),_--;for(;x--;){if(Q===y||y!==null&&Q===y.alternate)break t;Q=_r(Q),y=_r(y)}Q=null}else Q=null;V!==null&&eu(R,M,V,Q,!1),K!==null&&Be!==null&&eu(R,Be,K,Q,!0)}}e:{if(M=w?kr(w):window,V=M.nodeName&&M.nodeName.toLowerCase(),V==="select"||V==="input"&&M.type==="file")var J=of;else if(zi(M))if(Ri)J=df;else{J=uf;var X=sf}else(V=M.nodeName)&&V.toLowerCase()==="input"&&(M.type==="checkbox"||M.type==="radio")&&(J=cf);if(J&&(J=J(e,w))){Li(R,J,n,L);break e}X&&X(e,M,w),e==="focusout"&&(X=M._wrapperState)&&X.controlled&&M.type==="number"&&Fr(M,"number",M.value)}switch(X=w?kr(w):window,e){case"focusin":(zi(X)||X.contentEditable==="true")&&(vr=X,_o=w,al=null);break;case"focusout":al=_o=vr=null;break;case"mousedown":wo=!0;break;case"contextmenu":case"mouseup":case"dragend":wo=!1,Hi(R,n,L);break;case"selectionchange":if(gf)break;case"keydown":case"keyup":Hi(R,n,L)}var Z;if(ho)e:{switch(e){case"compositionstart":var se="onCompositionStart";break e;case"compositionend":se="onCompositionEnd";break e;case"compositionupdate":se="onCompositionUpdate";break e}se=void 0}else xr?ji(e,n)&&(se="onCompositionEnd"):e==="keydown"&&n.keyCode===229&&(se="onCompositionStart");se&&(Ni&&n.locale!=="ko"&&(xr||se!=="onCompositionStart"?se==="onCompositionEnd"&&xr&&(Z=bi()):(_n=L,uo="value"in _n?_n.value:_n.textContent,xr=!0)),X=ql(w,se),0<X.length&&(se=new Ci(se,e,null,n,L),R.push({event:se,listeners:X}),Z?se.data=Z:(Z=Mi(n),Z!==null&&(se.data=Z)))),(Z=tf?nf(e,n):rf(e,n))&&(w=ql(w,"onBeforeInput"),0<w.length&&(L=new Ci("onBeforeInput","beforeinput",null,n,L),R.push({event:L,listeners:w}),L.data=Z))}Xi(R,t)})}function il(e,t,n){return{instance:e,listener:t,currentTarget:n}}function ql(e,t){for(var n=t+"Capture",r=[];e!==null;){var l=e,a=l.stateNode;l.tag===5&&a!==null&&(l=a,a=Fn(e,n),a!=null&&r.unshift(il(e,a,l)),a=Fn(e,t),a!=null&&r.push(il(e,a,l))),e=e.return}return r}function _r(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5);return e||null}function eu(e,t,n,r,l){for(var a=t._reactName,i=[];n!==null&&n!==r;){var c=n,g=c.alternate,w=c.stateNode;if(g!==null&&g===r)break;c.tag===5&&w!==null&&(c=w,l?(g=Fn(n,a),g!=null&&i.unshift(il(n,g,c))):l||(g=Fn(n,a),g!=null&&i.push(il(n,g,c)))),n=n.return}i.length!==0&&e.push({event:t,listeners:i})}var vf=/\r\n?/g,yf=/\u0000|\uFFFD/g;function tu(e){return(typeof e=="string"?e:""+e).replace(vf,`
`).replace(yf,"")}function Xl(e,t,n){if(t=tu(t),tu(e)!==t&&n)throw Error(s(425))}function Zl(){}var Ao=null,No=null;function To(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var Po=typeof setTimeout=="function"?setTimeout:void 0,_f=typeof clearTimeout=="function"?clearTimeout:void 0,nu=typeof Promise=="function"?Promise:void 0,wf=typeof queueMicrotask=="function"?queueMicrotask:typeof nu<"u"?function(e){return nu.resolve(null).then(e).catch(kf)}:Po;function kf(e){setTimeout(function(){throw e})}function jo(e,t){var n=t,r=0;do{var l=n.nextSibling;if(e.removeChild(n),l&&l.nodeType===8)if(n=l.data,n==="/$"){if(r===0){e.removeChild(l),Xr(t);return}r--}else n!=="$"&&n!=="$?"&&n!=="$!"||r++;n=l}while(n);Xr(t)}function kn(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?")break;if(t==="/$")return null}}return e}function ru(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="$"||n==="$!"||n==="$?"){if(t===0)return e;t--}else n==="/$"&&t++}e=e.previousSibling}return null}var wr=Math.random().toString(36).slice(2),Ht="__reactFiber$"+wr,ul="__reactProps$"+wr,en="__reactContainer$"+wr,Mo="__reactEvents$"+wr,bf="__reactListeners$"+wr,Sf="__reactHandles$"+wr;function Vn(e){var t=e[Ht];if(t)return t;for(var n=e.parentNode;n;){if(t=n[en]||n[Ht]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(e=ru(e);e!==null;){if(n=e[Ht])return n;e=ru(e)}return t}e=n,n=e.parentNode}return null}function cl(e){return e=e[Ht]||e[en],!e||e.tag!==5&&e.tag!==6&&e.tag!==13&&e.tag!==3?null:e}function kr(e){if(e.tag===5||e.tag===6)return e.stateNode;throw Error(s(33))}function ea(e){return e[ul]||null}var zo=[],br=-1;function bn(e){return{current:e}}function ze(e){0>br||(e.current=zo[br],zo[br]=null,br--)}function je(e,t){br++,zo[br]=e.current,e.current=t}var Sn={},et=bn(Sn),ut=bn(!1),Wn=Sn;function Sr(e,t){var n=e.type.contextTypes;if(!n)return Sn;var r=e.stateNode;if(r&&r.__reactInternalMemoizedUnmaskedChildContext===t)return r.__reactInternalMemoizedMaskedChildContext;var l={},a;for(a in n)l[a]=t[a];return r&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=t,e.__reactInternalMemoizedMaskedChildContext=l),l}function ct(e){return e=e.childContextTypes,e!=null}function ta(){ze(ut),ze(et)}function lu(e,t,n){if(et.current!==Sn)throw Error(s(168));je(et,t),je(ut,n)}function au(e,t,n){var r=e.stateNode;if(t=t.childContextTypes,typeof r.getChildContext!="function")return n;r=r.getChildContext();for(var l in r)if(!(l in t))throw Error(s(108,oe(e)||"Unknown",l));return I({},n,r)}function na(e){return e=(e=e.stateNode)&&e.__reactInternalMemoizedMergedChildContext||Sn,Wn=et.current,je(et,e),je(ut,ut.current),!0}function ou(e,t,n){var r=e.stateNode;if(!r)throw Error(s(169));n?(e=au(e,t,Wn),r.__reactInternalMemoizedMergedChildContext=e,ze(ut),ze(et),je(et,e)):ze(ut),je(ut,n)}var tn=null,ra=!1,Lo=!1;function su(e){tn===null?tn=[e]:tn.push(e)}function Ef(e){ra=!0,su(e)}function En(){if(!Lo&&tn!==null){Lo=!0;var e=0,t=Ee;try{var n=tn;for(Ee=1;e<n.length;e++){var r=n[e];do r=r(!0);while(r!==null)}tn=null,ra=!1}catch(l){throw tn!==null&&(tn=tn.slice(e+1)),Un(gr,En),l}finally{Ee=t,Lo=!1}}return null}var Er=[],Cr=0,la=null,aa=0,bt=[],St=0,Kn=null,nn=1,rn="";function Yn(e,t){Er[Cr++]=aa,Er[Cr++]=la,la=e,aa=t}function iu(e,t,n){bt[St++]=nn,bt[St++]=rn,bt[St++]=Kn,Kn=e;var r=nn;e=rn;var l=32-te(r)-1;r&=~(1<<l),n+=1;var a=32-te(t)+l;if(30<a){var i=l-l%5;a=(r&(1<<i)-1).toString(32),r>>=i,l-=i,nn=1<<32-te(t)+l|n<<l|r,rn=a+e}else nn=1<<a|n<<l|r,rn=e}function Ro(e){e.return!==null&&(Yn(e,1),iu(e,1,0))}function Do(e){for(;e===la;)la=Er[--Cr],Er[Cr]=null,aa=Er[--Cr],Er[Cr]=null;for(;e===Kn;)Kn=bt[--St],bt[St]=null,rn=bt[--St],bt[St]=null,nn=bt[--St],bt[St]=null}var xt=null,vt=null,De=!1,Dt=null;function uu(e,t){var n=Nt(5,null,null,0);n.elementType="DELETED",n.stateNode=t,n.return=e,t=e.deletions,t===null?(e.deletions=[n],e.flags|=16):t.push(n)}function cu(e,t){switch(e.tag){case 5:var n=e.type;return t=t.nodeType!==1||n.toLowerCase()!==t.nodeName.toLowerCase()?null:t,t!==null?(e.stateNode=t,xt=e,vt=kn(t.firstChild),!0):!1;case 6:return t=e.pendingProps===""||t.nodeType!==3?null:t,t!==null?(e.stateNode=t,xt=e,vt=null,!0):!1;case 13:return t=t.nodeType!==8?null:t,t!==null?(n=Kn!==null?{id:nn,overflow:rn}:null,e.memoizedState={dehydrated:t,treeContext:n,retryLane:1073741824},n=Nt(18,null,null,0),n.stateNode=t,n.return=e,e.child=n,xt=e,vt=null,!0):!1;default:return!1}}function Io(e){return(e.mode&1)!==0&&(e.flags&128)===0}function Oo(e){if(De){var t=vt;if(t){var n=t;if(!cu(e,t)){if(Io(e))throw Error(s(418));t=kn(n.nextSibling);var r=xt;t&&cu(e,t)?uu(r,n):(e.flags=e.flags&-4097|2,De=!1,xt=e)}}else{if(Io(e))throw Error(s(418));e.flags=e.flags&-4097|2,De=!1,xt=e}}}function du(e){for(e=e.return;e!==null&&e.tag!==5&&e.tag!==3&&e.tag!==13;)e=e.return;xt=e}function oa(e){if(e!==xt)return!1;if(!De)return du(e),De=!0,!1;var t;if((t=e.tag!==3)&&!(t=e.tag!==5)&&(t=e.type,t=t!=="head"&&t!=="body"&&!To(e.type,e.memoizedProps)),t&&(t=vt)){if(Io(e))throw pu(),Error(s(418));for(;t;)uu(e,t),t=kn(t.nextSibling)}if(du(e),e.tag===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(s(317));e:{for(e=e.nextSibling,t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="/$"){if(t===0){vt=kn(e.nextSibling);break e}t--}else n!=="$"&&n!=="$!"&&n!=="$?"||t++}e=e.nextSibling}vt=null}}else vt=xt?kn(e.stateNode.nextSibling):null;return!0}function pu(){for(var e=vt;e;)e=kn(e.nextSibling)}function Ar(){vt=xt=null,De=!1}function $o(e){Dt===null?Dt=[e]:Dt.push(e)}var Cf=ke.ReactCurrentBatchConfig;function dl(e,t,n){if(e=n.ref,e!==null&&typeof e!="function"&&typeof e!="object"){if(n._owner){if(n=n._owner,n){if(n.tag!==1)throw Error(s(309));var r=n.stateNode}if(!r)throw Error(s(147,e));var l=r,a=""+e;return t!==null&&t.ref!==null&&typeof t.ref=="function"&&t.ref._stringRef===a?t.ref:(t=function(i){var c=l.refs;i===null?delete c[a]:c[a]=i},t._stringRef=a,t)}if(typeof e!="string")throw Error(s(284));if(!n._owner)throw Error(s(290,e))}return e}function sa(e,t){throw e=Object.prototype.toString.call(t),Error(s(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e))}function fu(e){var t=e._init;return t(e._payload)}function gu(e){function t(y,x){if(e){var _=y.deletions;_===null?(y.deletions=[x],y.flags|=16):_.push(x)}}function n(y,x){if(!e)return null;for(;x!==null;)t(y,x),x=x.sibling;return null}function r(y,x){for(y=new Map;x!==null;)x.key!==null?y.set(x.key,x):y.set(x.index,x),x=x.sibling;return y}function l(y,x){return y=zn(y,x),y.index=0,y.sibling=null,y}function a(y,x,_){return y.index=_,e?(_=y.alternate,_!==null?(_=_.index,_<x?(y.flags|=2,x):_):(y.flags|=2,x)):(y.flags|=1048576,x)}function i(y){return e&&y.alternate===null&&(y.flags|=2),y}function c(y,x,_,O){return x===null||x.tag!==6?(x=Ps(_,y.mode,O),x.return=y,x):(x=l(x,_),x.return=y,x)}function g(y,x,_,O){var J=_.type;return J===D?L(y,x,_.props.children,O,_.key):x!==null&&(x.elementType===J||typeof J=="object"&&J!==null&&J.$$typeof===Pe&&fu(J)===x.type)?(O=l(x,_.props),O.ref=dl(y,x,_),O.return=y,O):(O=ja(_.type,_.key,_.props,null,y.mode,O),O.ref=dl(y,x,_),O.return=y,O)}function w(y,x,_,O){return x===null||x.tag!==4||x.stateNode.containerInfo!==_.containerInfo||x.stateNode.implementation!==_.implementation?(x=js(_,y.mode,O),x.return=y,x):(x=l(x,_.children||[]),x.return=y,x)}function L(y,x,_,O,J){return x===null||x.tag!==7?(x=tr(_,y.mode,O,J),x.return=y,x):(x=l(x,_),x.return=y,x)}function R(y,x,_){if(typeof x=="string"&&x!==""||typeof x=="number")return x=Ps(""+x,y.mode,_),x.return=y,x;if(typeof x=="object"&&x!==null){switch(x.$$typeof){case F:return _=ja(x.type,x.key,x.props,null,y.mode,_),_.ref=dl(y,null,x),_.return=y,_;case T:return x=js(x,y.mode,_),x.return=y,x;case Pe:var O=x._init;return R(y,O(x._payload),_)}if(pn(x)||G(x))return x=tr(x,y.mode,_,null),x.return=y,x;sa(y,x)}return null}function M(y,x,_,O){var J=x!==null?x.key:null;if(typeof _=="string"&&_!==""||typeof _=="number")return J!==null?null:c(y,x,""+_,O);if(typeof _=="object"&&_!==null){switch(_.$$typeof){case F:return _.key===J?g(y,x,_,O):null;case T:return _.key===J?w(y,x,_,O):null;case Pe:return J=_._init,M(y,x,J(_._payload),O)}if(pn(_)||G(_))return J!==null?null:L(y,x,_,O,null);sa(y,_)}return null}function V(y,x,_,O,J){if(typeof O=="string"&&O!==""||typeof O=="number")return y=y.get(_)||null,c(x,y,""+O,J);if(typeof O=="object"&&O!==null){switch(O.$$typeof){case F:return y=y.get(O.key===null?_:O.key)||null,g(x,y,O,J);case T:return y=y.get(O.key===null?_:O.key)||null,w(x,y,O,J);case Pe:var X=O._init;return V(y,x,_,X(O._payload),J)}if(pn(O)||G(O))return y=y.get(_)||null,L(x,y,O,J,null);sa(x,O)}return null}function K(y,x,_,O){for(var J=null,X=null,Z=x,se=x=0,Qe=null;Z!==null&&se<_.length;se++){Z.index>se?(Qe=Z,Z=null):Qe=Z.sibling;var be=M(y,Z,_[se],O);if(be===null){Z===null&&(Z=Qe);break}e&&Z&&be.alternate===null&&t(y,Z),x=a(be,x,se),X===null?J=be:X.sibling=be,X=be,Z=Qe}if(se===_.length)return n(y,Z),De&&Yn(y,se),J;if(Z===null){for(;se<_.length;se++)Z=R(y,_[se],O),Z!==null&&(x=a(Z,x,se),X===null?J=Z:X.sibling=Z,X=Z);return De&&Yn(y,se),J}for(Z=r(y,Z);se<_.length;se++)Qe=V(Z,y,se,_[se],O),Qe!==null&&(e&&Qe.alternate!==null&&Z.delete(Qe.key===null?se:Qe.key),x=a(Qe,x,se),X===null?J=Qe:X.sibling=Qe,X=Qe);return e&&Z.forEach(function(Ln){return t(y,Ln)}),De&&Yn(y,se),J}function Q(y,x,_,O){var J=G(_);if(typeof J!="function")throw Error(s(150));if(_=J.call(_),_==null)throw Error(s(151));for(var X=J=null,Z=x,se=x=0,Qe=null,be=_.next();Z!==null&&!be.done;se++,be=_.next()){Z.index>se?(Qe=Z,Z=null):Qe=Z.sibling;var Ln=M(y,Z,be.value,O);if(Ln===null){Z===null&&(Z=Qe);break}e&&Z&&Ln.alternate===null&&t(y,Z),x=a(Ln,x,se),X===null?J=Ln:X.sibling=Ln,X=Ln,Z=Qe}if(be.done)return n(y,Z),De&&Yn(y,se),J;if(Z===null){for(;!be.done;se++,be=_.next())be=R(y,be.value,O),be!==null&&(x=a(be,x,se),X===null?J=be:X.sibling=be,X=be);return De&&Yn(y,se),J}for(Z=r(y,Z);!be.done;se++,be=_.next())be=V(Z,y,se,be.value,O),be!==null&&(e&&be.alternate!==null&&Z.delete(be.key===null?se:be.key),x=a(be,x,se),X===null?J=be:X.sibling=be,X=be);return e&&Z.forEach(function(ag){return t(y,ag)}),De&&Yn(y,se),J}function Be(y,x,_,O){if(typeof _=="object"&&_!==null&&_.type===D&&_.key===null&&(_=_.props.children),typeof _=="object"&&_!==null){switch(_.$$typeof){case F:e:{for(var J=_.key,X=x;X!==null;){if(X.key===J){if(J=_.type,J===D){if(X.tag===7){n(y,X.sibling),x=l(X,_.props.children),x.return=y,y=x;break e}}else if(X.elementType===J||typeof J=="object"&&J!==null&&J.$$typeof===Pe&&fu(J)===X.type){n(y,X.sibling),x=l(X,_.props),x.ref=dl(y,X,_),x.return=y,y=x;break e}n(y,X);break}else t(y,X);X=X.sibling}_.type===D?(x=tr(_.props.children,y.mode,O,_.key),x.return=y,y=x):(O=ja(_.type,_.key,_.props,null,y.mode,O),O.ref=dl(y,x,_),O.return=y,y=O)}return i(y);case T:e:{for(X=_.key;x!==null;){if(x.key===X)if(x.tag===4&&x.stateNode.containerInfo===_.containerInfo&&x.stateNode.implementation===_.implementation){n(y,x.sibling),x=l(x,_.children||[]),x.return=y,y=x;break e}else{n(y,x);break}else t(y,x);x=x.sibling}x=js(_,y.mode,O),x.return=y,y=x}return i(y);case Pe:return X=_._init,Be(y,x,X(_._payload),O)}if(pn(_))return K(y,x,_,O);if(G(_))return Q(y,x,_,O);sa(y,_)}return typeof _=="string"&&_!==""||typeof _=="number"?(_=""+_,x!==null&&x.tag===6?(n(y,x.sibling),x=l(x,_),x.return=y,y=x):(n(y,x),x=Ps(_,y.mode,O),x.return=y,y=x),i(y)):n(y,x)}return Be}var Nr=gu(!0),mu=gu(!1),ia=bn(null),ua=null,Tr=null,Fo=null;function Bo(){Fo=Tr=ua=null}function Uo(e){var t=ia.current;ze(ia),e._currentValue=t}function Ho(e,t,n){for(;e!==null;){var r=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,r!==null&&(r.childLanes|=t)):r!==null&&(r.childLanes&t)!==t&&(r.childLanes|=t),e===n)break;e=e.return}}function Pr(e,t){ua=e,Fo=Tr=null,e=e.dependencies,e!==null&&e.firstContext!==null&&((e.lanes&t)!==0&&(dt=!0),e.firstContext=null)}function Et(e){var t=e._currentValue;if(Fo!==e)if(e={context:e,memoizedValue:t,next:null},Tr===null){if(ua===null)throw Error(s(308));Tr=e,ua.dependencies={lanes:0,firstContext:e}}else Tr=Tr.next=e;return t}var Qn=null;function Vo(e){Qn===null?Qn=[e]:Qn.push(e)}function hu(e,t,n,r){var l=t.interleaved;return l===null?(n.next=n,Vo(t)):(n.next=l.next,l.next=n),t.interleaved=n,ln(e,r)}function ln(e,t){e.lanes|=t;var n=e.alternate;for(n!==null&&(n.lanes|=t),n=e,e=e.return;e!==null;)e.childLanes|=t,n=e.alternate,n!==null&&(n.childLanes|=t),n=e,e=e.return;return n.tag===3?n.stateNode:null}var Cn=!1;function Wo(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function xu(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,effects:e.effects})}function an(e,t){return{eventTime:e,lane:t,tag:0,payload:null,callback:null,next:null}}function An(e,t,n){var r=e.updateQueue;if(r===null)return null;if(r=r.shared,(we&2)!==0){var l=r.pending;return l===null?t.next=t:(t.next=l.next,l.next=t),r.pending=t,ln(e,n)}return l=r.interleaved,l===null?(t.next=t,Vo(r)):(t.next=l.next,l.next=t),r.interleaved=t,ln(e,n)}function ca(e,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,(n&4194240)!==0)){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,lo(e,n)}}function vu(e,t){var n=e.updateQueue,r=e.alternate;if(r!==null&&(r=r.updateQueue,n===r)){var l=null,a=null;if(n=n.firstBaseUpdate,n!==null){do{var i={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};a===null?l=a=i:a=a.next=i,n=n.next}while(n!==null);a===null?l=a=t:a=a.next=t}else l=a=t;n={baseState:r.baseState,firstBaseUpdate:l,lastBaseUpdate:a,shared:r.shared,effects:r.effects},e.updateQueue=n;return}e=n.lastBaseUpdate,e===null?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}function da(e,t,n,r){var l=e.updateQueue;Cn=!1;var a=l.firstBaseUpdate,i=l.lastBaseUpdate,c=l.shared.pending;if(c!==null){l.shared.pending=null;var g=c,w=g.next;g.next=null,i===null?a=w:i.next=w,i=g;var L=e.alternate;L!==null&&(L=L.updateQueue,c=L.lastBaseUpdate,c!==i&&(c===null?L.firstBaseUpdate=w:c.next=w,L.lastBaseUpdate=g))}if(a!==null){var R=l.baseState;i=0,L=w=g=null,c=a;do{var M=c.lane,V=c.eventTime;if((r&M)===M){L!==null&&(L=L.next={eventTime:V,lane:0,tag:c.tag,payload:c.payload,callback:c.callback,next:null});e:{var K=e,Q=c;switch(M=t,V=n,Q.tag){case 1:if(K=Q.payload,typeof K=="function"){R=K.call(V,R,M);break e}R=K;break e;case 3:K.flags=K.flags&-65537|128;case 0:if(K=Q.payload,M=typeof K=="function"?K.call(V,R,M):K,M==null)break e;R=I({},R,M);break e;case 2:Cn=!0}}c.callback!==null&&c.lane!==0&&(e.flags|=64,M=l.effects,M===null?l.effects=[c]:M.push(c))}else V={eventTime:V,lane:M,tag:c.tag,payload:c.payload,callback:c.callback,next:null},L===null?(w=L=V,g=R):L=L.next=V,i|=M;if(c=c.next,c===null){if(c=l.shared.pending,c===null)break;M=c,c=M.next,M.next=null,l.lastBaseUpdate=M,l.shared.pending=null}}while(!0);if(L===null&&(g=R),l.baseState=g,l.firstBaseUpdate=w,l.lastBaseUpdate=L,t=l.shared.interleaved,t!==null){l=t;do i|=l.lane,l=l.next;while(l!==t)}else a===null&&(l.shared.lanes=0);qn|=i,e.lanes=i,e.memoizedState=R}}function yu(e,t,n){if(e=t.effects,t.effects=null,e!==null)for(t=0;t<e.length;t++){var r=e[t],l=r.callback;if(l!==null){if(r.callback=null,r=n,typeof l!="function")throw Error(s(191,l));l.call(r)}}}var pl={},Vt=bn(pl),fl=bn(pl),gl=bn(pl);function Jn(e){if(e===pl)throw Error(s(174));return e}function Ko(e,t){switch(je(gl,t),je(fl,e),je(Vt,pl),e=t.nodeType,e){case 9:case 11:t=(t=t.documentElement)?t.namespaceURI:or(null,"");break;default:e=e===8?t.parentNode:t,t=e.namespaceURI||null,e=e.tagName,t=or(t,e)}ze(Vt),je(Vt,t)}function jr(){ze(Vt),ze(fl),ze(gl)}function _u(e){Jn(gl.current);var t=Jn(Vt.current),n=or(t,e.type);t!==n&&(je(fl,e),je(Vt,n))}function Yo(e){fl.current===e&&(ze(Vt),ze(fl))}var Ie=bn(0);function pa(e){for(var t=e;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||n.data==="$?"||n.data==="$!"))return t}else if(t.tag===19&&t.memoizedProps.revealOrder!==void 0){if((t.flags&128)!==0)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var Qo=[];function Jo(){for(var e=0;e<Qo.length;e++)Qo[e]._workInProgressVersionPrimary=null;Qo.length=0}var fa=ke.ReactCurrentDispatcher,Go=ke.ReactCurrentBatchConfig,Gn=0,Oe=null,He=null,Ke=null,ga=!1,ml=!1,hl=0,Af=0;function tt(){throw Error(s(321))}function qo(e,t){if(t===null)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!Rt(e[n],t[n]))return!1;return!0}function Xo(e,t,n,r,l,a){if(Gn=a,Oe=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,fa.current=e===null||e.memoizedState===null?jf:Mf,e=n(r,l),ml){a=0;do{if(ml=!1,hl=0,25<=a)throw Error(s(301));a+=1,Ke=He=null,t.updateQueue=null,fa.current=zf,e=n(r,l)}while(ml)}if(fa.current=xa,t=He!==null&&He.next!==null,Gn=0,Ke=He=Oe=null,ga=!1,t)throw Error(s(300));return e}function Zo(){var e=hl!==0;return hl=0,e}function Wt(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Ke===null?Oe.memoizedState=Ke=e:Ke=Ke.next=e,Ke}function Ct(){if(He===null){var e=Oe.alternate;e=e!==null?e.memoizedState:null}else e=He.next;var t=Ke===null?Oe.memoizedState:Ke.next;if(t!==null)Ke=t,He=e;else{if(e===null)throw Error(s(310));He=e,e={memoizedState:He.memoizedState,baseState:He.baseState,baseQueue:He.baseQueue,queue:He.queue,next:null},Ke===null?Oe.memoizedState=Ke=e:Ke=Ke.next=e}return Ke}function xl(e,t){return typeof t=="function"?t(e):t}function es(e){var t=Ct(),n=t.queue;if(n===null)throw Error(s(311));n.lastRenderedReducer=e;var r=He,l=r.baseQueue,a=n.pending;if(a!==null){if(l!==null){var i=l.next;l.next=a.next,a.next=i}r.baseQueue=l=a,n.pending=null}if(l!==null){a=l.next,r=r.baseState;var c=i=null,g=null,w=a;do{var L=w.lane;if((Gn&L)===L)g!==null&&(g=g.next={lane:0,action:w.action,hasEagerState:w.hasEagerState,eagerState:w.eagerState,next:null}),r=w.hasEagerState?w.eagerState:e(r,w.action);else{var R={lane:L,action:w.action,hasEagerState:w.hasEagerState,eagerState:w.eagerState,next:null};g===null?(c=g=R,i=r):g=g.next=R,Oe.lanes|=L,qn|=L}w=w.next}while(w!==null&&w!==a);g===null?i=r:g.next=c,Rt(r,t.memoizedState)||(dt=!0),t.memoizedState=r,t.baseState=i,t.baseQueue=g,n.lastRenderedState=r}if(e=n.interleaved,e!==null){l=e;do a=l.lane,Oe.lanes|=a,qn|=a,l=l.next;while(l!==e)}else l===null&&(n.lanes=0);return[t.memoizedState,n.dispatch]}function ts(e){var t=Ct(),n=t.queue;if(n===null)throw Error(s(311));n.lastRenderedReducer=e;var r=n.dispatch,l=n.pending,a=t.memoizedState;if(l!==null){n.pending=null;var i=l=l.next;do a=e(a,i.action),i=i.next;while(i!==l);Rt(a,t.memoizedState)||(dt=!0),t.memoizedState=a,t.baseQueue===null&&(t.baseState=a),n.lastRenderedState=a}return[a,r]}function wu(){}function ku(e,t){var n=Oe,r=Ct(),l=t(),a=!Rt(r.memoizedState,l);if(a&&(r.memoizedState=l,dt=!0),r=r.queue,ns(Eu.bind(null,n,r,e),[e]),r.getSnapshot!==t||a||Ke!==null&&Ke.memoizedState.tag&1){if(n.flags|=2048,vl(9,Su.bind(null,n,r,l,t),void 0,null),Ye===null)throw Error(s(349));(Gn&30)!==0||bu(n,t,l)}return l}function bu(e,t,n){e.flags|=16384,e={getSnapshot:t,value:n},t=Oe.updateQueue,t===null?(t={lastEffect:null,stores:null},Oe.updateQueue=t,t.stores=[e]):(n=t.stores,n===null?t.stores=[e]:n.push(e))}function Su(e,t,n,r){t.value=n,t.getSnapshot=r,Cu(t)&&Au(e)}function Eu(e,t,n){return n(function(){Cu(t)&&Au(e)})}function Cu(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!Rt(e,n)}catch{return!0}}function Au(e){var t=ln(e,1);t!==null&&Ft(t,e,1,-1)}function Nu(e){var t=Wt();return typeof e=="function"&&(e=e()),t.memoizedState=t.baseState=e,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:xl,lastRenderedState:e},t.queue=e,e=e.dispatch=Pf.bind(null,Oe,e),[t.memoizedState,e]}function vl(e,t,n,r){return e={tag:e,create:t,destroy:n,deps:r,next:null},t=Oe.updateQueue,t===null?(t={lastEffect:null,stores:null},Oe.updateQueue=t,t.lastEffect=e.next=e):(n=t.lastEffect,n===null?t.lastEffect=e.next=e:(r=n.next,n.next=e,e.next=r,t.lastEffect=e)),e}function Tu(){return Ct().memoizedState}function ma(e,t,n,r){var l=Wt();Oe.flags|=e,l.memoizedState=vl(1|t,n,void 0,r===void 0?null:r)}function ha(e,t,n,r){var l=Ct();r=r===void 0?null:r;var a=void 0;if(He!==null){var i=He.memoizedState;if(a=i.destroy,r!==null&&qo(r,i.deps)){l.memoizedState=vl(t,n,a,r);return}}Oe.flags|=e,l.memoizedState=vl(1|t,n,a,r)}function Pu(e,t){return ma(8390656,8,e,t)}function ns(e,t){return ha(2048,8,e,t)}function ju(e,t){return ha(4,2,e,t)}function Mu(e,t){return ha(4,4,e,t)}function zu(e,t){if(typeof t=="function")return e=e(),t(e),function(){t(null)};if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function Lu(e,t,n){return n=n!=null?n.concat([e]):null,ha(4,4,zu.bind(null,t,e),n)}function rs(){}function Ru(e,t){var n=Ct();t=t===void 0?null:t;var r=n.memoizedState;return r!==null&&t!==null&&qo(t,r[1])?r[0]:(n.memoizedState=[e,t],e)}function Du(e,t){var n=Ct();t=t===void 0?null:t;var r=n.memoizedState;return r!==null&&t!==null&&qo(t,r[1])?r[0]:(e=e(),n.memoizedState=[e,t],e)}function Iu(e,t,n){return(Gn&21)===0?(e.baseState&&(e.baseState=!1,dt=!0),e.memoizedState=n):(Rt(n,t)||(n=fi(),Oe.lanes|=n,qn|=n,e.baseState=!0),t)}function Nf(e,t){var n=Ee;Ee=n!==0&&4>n?n:4,e(!0);var r=Go.transition;Go.transition={};try{e(!1),t()}finally{Ee=n,Go.transition=r}}function Ou(){return Ct().memoizedState}function Tf(e,t,n){var r=jn(e);if(n={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null},$u(e))Fu(t,n);else if(n=hu(e,t,n,r),n!==null){var l=ot();Ft(n,e,r,l),Bu(n,t,r)}}function Pf(e,t,n){var r=jn(e),l={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null};if($u(e))Fu(t,l);else{var a=e.alternate;if(e.lanes===0&&(a===null||a.lanes===0)&&(a=t.lastRenderedReducer,a!==null))try{var i=t.lastRenderedState,c=a(i,n);if(l.hasEagerState=!0,l.eagerState=c,Rt(c,i)){var g=t.interleaved;g===null?(l.next=l,Vo(t)):(l.next=g.next,g.next=l),t.interleaved=l;return}}catch{}finally{}n=hu(e,t,l,r),n!==null&&(l=ot(),Ft(n,e,r,l),Bu(n,t,r))}}function $u(e){var t=e.alternate;return e===Oe||t!==null&&t===Oe}function Fu(e,t){ml=ga=!0;var n=e.pending;n===null?t.next=t:(t.next=n.next,n.next=t),e.pending=t}function Bu(e,t,n){if((n&4194240)!==0){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,lo(e,n)}}var xa={readContext:Et,useCallback:tt,useContext:tt,useEffect:tt,useImperativeHandle:tt,useInsertionEffect:tt,useLayoutEffect:tt,useMemo:tt,useReducer:tt,useRef:tt,useState:tt,useDebugValue:tt,useDeferredValue:tt,useTransition:tt,useMutableSource:tt,useSyncExternalStore:tt,useId:tt,unstable_isNewReconciler:!1},jf={readContext:Et,useCallback:function(e,t){return Wt().memoizedState=[e,t===void 0?null:t],e},useContext:Et,useEffect:Pu,useImperativeHandle:function(e,t,n){return n=n!=null?n.concat([e]):null,ma(4194308,4,zu.bind(null,t,e),n)},useLayoutEffect:function(e,t){return ma(4194308,4,e,t)},useInsertionEffect:function(e,t){return ma(4,2,e,t)},useMemo:function(e,t){var n=Wt();return t=t===void 0?null:t,e=e(),n.memoizedState=[e,t],e},useReducer:function(e,t,n){var r=Wt();return t=n!==void 0?n(t):t,r.memoizedState=r.baseState=t,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:t},r.queue=e,e=e.dispatch=Tf.bind(null,Oe,e),[r.memoizedState,e]},useRef:function(e){var t=Wt();return e={current:e},t.memoizedState=e},useState:Nu,useDebugValue:rs,useDeferredValue:function(e){return Wt().memoizedState=e},useTransition:function(){var e=Nu(!1),t=e[0];return e=Nf.bind(null,e[1]),Wt().memoizedState=e,[t,e]},useMutableSource:function(){},useSyncExternalStore:function(e,t,n){var r=Oe,l=Wt();if(De){if(n===void 0)throw Error(s(407));n=n()}else{if(n=t(),Ye===null)throw Error(s(349));(Gn&30)!==0||bu(r,t,n)}l.memoizedState=n;var a={value:n,getSnapshot:t};return l.queue=a,Pu(Eu.bind(null,r,a,e),[e]),r.flags|=2048,vl(9,Su.bind(null,r,a,n,t),void 0,null),n},useId:function(){var e=Wt(),t=Ye.identifierPrefix;if(De){var n=rn,r=nn;n=(r&~(1<<32-te(r)-1)).toString(32)+n,t=":"+t+"R"+n,n=hl++,0<n&&(t+="H"+n.toString(32)),t+=":"}else n=Af++,t=":"+t+"r"+n.toString(32)+":";return e.memoizedState=t},unstable_isNewReconciler:!1},Mf={readContext:Et,useCallback:Ru,useContext:Et,useEffect:ns,useImperativeHandle:Lu,useInsertionEffect:ju,useLayoutEffect:Mu,useMemo:Du,useReducer:es,useRef:Tu,useState:function(){return es(xl)},useDebugValue:rs,useDeferredValue:function(e){var t=Ct();return Iu(t,He.memoizedState,e)},useTransition:function(){var e=es(xl)[0],t=Ct().memoizedState;return[e,t]},useMutableSource:wu,useSyncExternalStore:ku,useId:Ou,unstable_isNewReconciler:!1},zf={readContext:Et,useCallback:Ru,useContext:Et,useEffect:ns,useImperativeHandle:Lu,useInsertionEffect:ju,useLayoutEffect:Mu,useMemo:Du,useReducer:ts,useRef:Tu,useState:function(){return ts(xl)},useDebugValue:rs,useDeferredValue:function(e){var t=Ct();return He===null?t.memoizedState=e:Iu(t,He.memoizedState,e)},useTransition:function(){var e=ts(xl)[0],t=Ct().memoizedState;return[e,t]},useMutableSource:wu,useSyncExternalStore:ku,useId:Ou,unstable_isNewReconciler:!1};function It(e,t){if(e&&e.defaultProps){t=I({},t),e=e.defaultProps;for(var n in e)t[n]===void 0&&(t[n]=e[n]);return t}return t}function ls(e,t,n,r){t=e.memoizedState,n=n(r,t),n=n==null?t:I({},t,n),e.memoizedState=n,e.lanes===0&&(e.updateQueue.baseState=n)}var va={isMounted:function(e){return(e=e._reactInternals)?Lt(e)===e:!1},enqueueSetState:function(e,t,n){e=e._reactInternals;var r=ot(),l=jn(e),a=an(r,l);a.payload=t,n!=null&&(a.callback=n),t=An(e,a,l),t!==null&&(Ft(t,e,l,r),ca(t,e,l))},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var r=ot(),l=jn(e),a=an(r,l);a.tag=1,a.payload=t,n!=null&&(a.callback=n),t=An(e,a,l),t!==null&&(Ft(t,e,l,r),ca(t,e,l))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=ot(),r=jn(e),l=an(n,r);l.tag=2,t!=null&&(l.callback=t),t=An(e,l,r),t!==null&&(Ft(t,e,r,n),ca(t,e,r))}};function Uu(e,t,n,r,l,a,i){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(r,a,i):t.prototype&&t.prototype.isPureReactComponent?!ll(n,r)||!ll(l,a):!0}function Hu(e,t,n){var r=!1,l=Sn,a=t.contextType;return typeof a=="object"&&a!==null?a=Et(a):(l=ct(t)?Wn:et.current,r=t.contextTypes,a=(r=r!=null)?Sr(e,l):Sn),t=new t(n,a),e.memoizedState=t.state!==null&&t.state!==void 0?t.state:null,t.updater=va,e.stateNode=t,t._reactInternals=e,r&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=l,e.__reactInternalMemoizedMaskedChildContext=a),t}function Vu(e,t,n,r){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(n,r),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(n,r),t.state!==e&&va.enqueueReplaceState(t,t.state,null)}function as(e,t,n,r){var l=e.stateNode;l.props=n,l.state=e.memoizedState,l.refs={},Wo(e);var a=t.contextType;typeof a=="object"&&a!==null?l.context=Et(a):(a=ct(t)?Wn:et.current,l.context=Sr(e,a)),l.state=e.memoizedState,a=t.getDerivedStateFromProps,typeof a=="function"&&(ls(e,t,a,n),l.state=e.memoizedState),typeof t.getDerivedStateFromProps=="function"||typeof l.getSnapshotBeforeUpdate=="function"||typeof l.UNSAFE_componentWillMount!="function"&&typeof l.componentWillMount!="function"||(t=l.state,typeof l.componentWillMount=="function"&&l.componentWillMount(),typeof l.UNSAFE_componentWillMount=="function"&&l.UNSAFE_componentWillMount(),t!==l.state&&va.enqueueReplaceState(l,l.state,null),da(e,n,l,r),l.state=e.memoizedState),typeof l.componentDidMount=="function"&&(e.flags|=4194308)}function Mr(e,t){try{var n="",r=t;do n+=pe(r),r=r.return;while(r);var l=n}catch(a){l=`
Error generating stack: `+a.message+`
`+a.stack}return{value:e,source:t,stack:l,digest:null}}function os(e,t,n){return{value:e,source:null,stack:n??null,digest:t??null}}function ss(e,t){try{console.error(t.value)}catch(n){setTimeout(function(){throw n})}}var Lf=typeof WeakMap=="function"?WeakMap:Map;function Wu(e,t,n){n=an(-1,n),n.tag=3,n.payload={element:null};var r=t.value;return n.callback=function(){Ea||(Ea=!0,ks=r),ss(e,t)},n}function Ku(e,t,n){n=an(-1,n),n.tag=3;var r=e.type.getDerivedStateFromError;if(typeof r=="function"){var l=t.value;n.payload=function(){return r(l)},n.callback=function(){ss(e,t)}}var a=e.stateNode;return a!==null&&typeof a.componentDidCatch=="function"&&(n.callback=function(){ss(e,t),typeof r!="function"&&(Tn===null?Tn=new Set([this]):Tn.add(this));var i=t.stack;this.componentDidCatch(t.value,{componentStack:i!==null?i:""})}),n}function Yu(e,t,n){var r=e.pingCache;if(r===null){r=e.pingCache=new Lf;var l=new Set;r.set(t,l)}else l=r.get(t),l===void 0&&(l=new Set,r.set(t,l));l.has(n)||(l.add(n),e=Qf.bind(null,e,t,n),t.then(e,e))}function Qu(e){do{var t;if((t=e.tag===13)&&(t=e.memoizedState,t=t!==null?t.dehydrated!==null:!0),t)return e;e=e.return}while(e!==null);return null}function Ju(e,t,n,r,l){return(e.mode&1)===0?(e===t?e.flags|=65536:(e.flags|=128,n.flags|=131072,n.flags&=-52805,n.tag===1&&(n.alternate===null?n.tag=17:(t=an(-1,1),t.tag=2,An(n,t,1))),n.lanes|=1),e):(e.flags|=65536,e.lanes=l,e)}var Rf=ke.ReactCurrentOwner,dt=!1;function at(e,t,n,r){t.child=e===null?mu(t,null,n,r):Nr(t,e.child,n,r)}function Gu(e,t,n,r,l){n=n.render;var a=t.ref;return Pr(t,l),r=Xo(e,t,n,r,a,l),n=Zo(),e!==null&&!dt?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~l,on(e,t,l)):(De&&n&&Ro(t),t.flags|=1,at(e,t,r,l),t.child)}function qu(e,t,n,r,l){if(e===null){var a=n.type;return typeof a=="function"&&!Ts(a)&&a.defaultProps===void 0&&n.compare===null&&n.defaultProps===void 0?(t.tag=15,t.type=a,Xu(e,t,a,r,l)):(e=ja(n.type,null,r,t,t.mode,l),e.ref=t.ref,e.return=t,t.child=e)}if(a=e.child,(e.lanes&l)===0){var i=a.memoizedProps;if(n=n.compare,n=n!==null?n:ll,n(i,r)&&e.ref===t.ref)return on(e,t,l)}return t.flags|=1,e=zn(a,r),e.ref=t.ref,e.return=t,t.child=e}function Xu(e,t,n,r,l){if(e!==null){var a=e.memoizedProps;if(ll(a,r)&&e.ref===t.ref)if(dt=!1,t.pendingProps=r=a,(e.lanes&l)!==0)(e.flags&131072)!==0&&(dt=!0);else return t.lanes=e.lanes,on(e,t,l)}return is(e,t,n,r,l)}function Zu(e,t,n){var r=t.pendingProps,l=r.children,a=e!==null?e.memoizedState:null;if(r.mode==="hidden")if((t.mode&1)===0)t.memoizedState={baseLanes:0,cachePool:null,transitions:null},je(Lr,yt),yt|=n;else{if((n&1073741824)===0)return e=a!==null?a.baseLanes|n:n,t.lanes=t.childLanes=1073741824,t.memoizedState={baseLanes:e,cachePool:null,transitions:null},t.updateQueue=null,je(Lr,yt),yt|=e,null;t.memoizedState={baseLanes:0,cachePool:null,transitions:null},r=a!==null?a.baseLanes:n,je(Lr,yt),yt|=r}else a!==null?(r=a.baseLanes|n,t.memoizedState=null):r=n,je(Lr,yt),yt|=r;return at(e,t,l,n),t.child}function ec(e,t){var n=t.ref;(e===null&&n!==null||e!==null&&e.ref!==n)&&(t.flags|=512,t.flags|=2097152)}function is(e,t,n,r,l){var a=ct(n)?Wn:et.current;return a=Sr(t,a),Pr(t,l),n=Xo(e,t,n,r,a,l),r=Zo(),e!==null&&!dt?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~l,on(e,t,l)):(De&&r&&Ro(t),t.flags|=1,at(e,t,n,l),t.child)}function tc(e,t,n,r,l){if(ct(n)){var a=!0;na(t)}else a=!1;if(Pr(t,l),t.stateNode===null)_a(e,t),Hu(t,n,r),as(t,n,r,l),r=!0;else if(e===null){var i=t.stateNode,c=t.memoizedProps;i.props=c;var g=i.context,w=n.contextType;typeof w=="object"&&w!==null?w=Et(w):(w=ct(n)?Wn:et.current,w=Sr(t,w));var L=n.getDerivedStateFromProps,R=typeof L=="function"||typeof i.getSnapshotBeforeUpdate=="function";R||typeof i.UNSAFE_componentWillReceiveProps!="function"&&typeof i.componentWillReceiveProps!="function"||(c!==r||g!==w)&&Vu(t,i,r,w),Cn=!1;var M=t.memoizedState;i.state=M,da(t,r,i,l),g=t.memoizedState,c!==r||M!==g||ut.current||Cn?(typeof L=="function"&&(ls(t,n,L,r),g=t.memoizedState),(c=Cn||Uu(t,n,c,r,M,g,w))?(R||typeof i.UNSAFE_componentWillMount!="function"&&typeof i.componentWillMount!="function"||(typeof i.componentWillMount=="function"&&i.componentWillMount(),typeof i.UNSAFE_componentWillMount=="function"&&i.UNSAFE_componentWillMount()),typeof i.componentDidMount=="function"&&(t.flags|=4194308)):(typeof i.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=r,t.memoizedState=g),i.props=r,i.state=g,i.context=w,r=c):(typeof i.componentDidMount=="function"&&(t.flags|=4194308),r=!1)}else{i=t.stateNode,xu(e,t),c=t.memoizedProps,w=t.type===t.elementType?c:It(t.type,c),i.props=w,R=t.pendingProps,M=i.context,g=n.contextType,typeof g=="object"&&g!==null?g=Et(g):(g=ct(n)?Wn:et.current,g=Sr(t,g));var V=n.getDerivedStateFromProps;(L=typeof V=="function"||typeof i.getSnapshotBeforeUpdate=="function")||typeof i.UNSAFE_componentWillReceiveProps!="function"&&typeof i.componentWillReceiveProps!="function"||(c!==R||M!==g)&&Vu(t,i,r,g),Cn=!1,M=t.memoizedState,i.state=M,da(t,r,i,l);var K=t.memoizedState;c!==R||M!==K||ut.current||Cn?(typeof V=="function"&&(ls(t,n,V,r),K=t.memoizedState),(w=Cn||Uu(t,n,w,r,M,K,g)||!1)?(L||typeof i.UNSAFE_componentWillUpdate!="function"&&typeof i.componentWillUpdate!="function"||(typeof i.componentWillUpdate=="function"&&i.componentWillUpdate(r,K,g),typeof i.UNSAFE_componentWillUpdate=="function"&&i.UNSAFE_componentWillUpdate(r,K,g)),typeof i.componentDidUpdate=="function"&&(t.flags|=4),typeof i.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof i.componentDidUpdate!="function"||c===e.memoizedProps&&M===e.memoizedState||(t.flags|=4),typeof i.getSnapshotBeforeUpdate!="function"||c===e.memoizedProps&&M===e.memoizedState||(t.flags|=1024),t.memoizedProps=r,t.memoizedState=K),i.props=r,i.state=K,i.context=g,r=w):(typeof i.componentDidUpdate!="function"||c===e.memoizedProps&&M===e.memoizedState||(t.flags|=4),typeof i.getSnapshotBeforeUpdate!="function"||c===e.memoizedProps&&M===e.memoizedState||(t.flags|=1024),r=!1)}return us(e,t,n,r,a,l)}function us(e,t,n,r,l,a){ec(e,t);var i=(t.flags&128)!==0;if(!r&&!i)return l&&ou(t,n,!1),on(e,t,a);r=t.stateNode,Rf.current=t;var c=i&&typeof n.getDerivedStateFromError!="function"?null:r.render();return t.flags|=1,e!==null&&i?(t.child=Nr(t,e.child,null,a),t.child=Nr(t,null,c,a)):at(e,t,c,a),t.memoizedState=r.state,l&&ou(t,n,!0),t.child}function nc(e){var t=e.stateNode;t.pendingContext?lu(e,t.pendingContext,t.pendingContext!==t.context):t.context&&lu(e,t.context,!1),Ko(e,t.containerInfo)}function rc(e,t,n,r,l){return Ar(),$o(l),t.flags|=256,at(e,t,n,r),t.child}var cs={dehydrated:null,treeContext:null,retryLane:0};function ds(e){return{baseLanes:e,cachePool:null,transitions:null}}function lc(e,t,n){var r=t.pendingProps,l=Ie.current,a=!1,i=(t.flags&128)!==0,c;if((c=i)||(c=e!==null&&e.memoizedState===null?!1:(l&2)!==0),c?(a=!0,t.flags&=-129):(e===null||e.memoizedState!==null)&&(l|=1),je(Ie,l&1),e===null)return Oo(t),e=t.memoizedState,e!==null&&(e=e.dehydrated,e!==null)?((t.mode&1)===0?t.lanes=1:e.data==="$!"?t.lanes=8:t.lanes=1073741824,null):(i=r.children,e=r.fallback,a?(r=t.mode,a=t.child,i={mode:"hidden",children:i},(r&1)===0&&a!==null?(a.childLanes=0,a.pendingProps=i):a=Ma(i,r,0,null),e=tr(e,r,n,null),a.return=t,e.return=t,a.sibling=e,t.child=a,t.child.memoizedState=ds(n),t.memoizedState=cs,e):ps(t,i));if(l=e.memoizedState,l!==null&&(c=l.dehydrated,c!==null))return Df(e,t,i,r,c,l,n);if(a){a=r.fallback,i=t.mode,l=e.child,c=l.sibling;var g={mode:"hidden",children:r.children};return(i&1)===0&&t.child!==l?(r=t.child,r.childLanes=0,r.pendingProps=g,t.deletions=null):(r=zn(l,g),r.subtreeFlags=l.subtreeFlags&14680064),c!==null?a=zn(c,a):(a=tr(a,i,n,null),a.flags|=2),a.return=t,r.return=t,r.sibling=a,t.child=r,r=a,a=t.child,i=e.child.memoizedState,i=i===null?ds(n):{baseLanes:i.baseLanes|n,cachePool:null,transitions:i.transitions},a.memoizedState=i,a.childLanes=e.childLanes&~n,t.memoizedState=cs,r}return a=e.child,e=a.sibling,r=zn(a,{mode:"visible",children:r.children}),(t.mode&1)===0&&(r.lanes=n),r.return=t,r.sibling=null,e!==null&&(n=t.deletions,n===null?(t.deletions=[e],t.flags|=16):n.push(e)),t.child=r,t.memoizedState=null,r}function ps(e,t){return t=Ma({mode:"visible",children:t},e.mode,0,null),t.return=e,e.child=t}function ya(e,t,n,r){return r!==null&&$o(r),Nr(t,e.child,null,n),e=ps(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function Df(e,t,n,r,l,a,i){if(n)return t.flags&256?(t.flags&=-257,r=os(Error(s(422))),ya(e,t,i,r)):t.memoizedState!==null?(t.child=e.child,t.flags|=128,null):(a=r.fallback,l=t.mode,r=Ma({mode:"visible",children:r.children},l,0,null),a=tr(a,l,i,null),a.flags|=2,r.return=t,a.return=t,r.sibling=a,t.child=r,(t.mode&1)!==0&&Nr(t,e.child,null,i),t.child.memoizedState=ds(i),t.memoizedState=cs,a);if((t.mode&1)===0)return ya(e,t,i,null);if(l.data==="$!"){if(r=l.nextSibling&&l.nextSibling.dataset,r)var c=r.dgst;return r=c,a=Error(s(419)),r=os(a,r,void 0),ya(e,t,i,r)}if(c=(i&e.childLanes)!==0,dt||c){if(r=Ye,r!==null){switch(i&-i){case 4:l=2;break;case 16:l=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:l=32;break;case 536870912:l=268435456;break;default:l=0}l=(l&(r.suspendedLanes|i))!==0?0:l,l!==0&&l!==a.retryLane&&(a.retryLane=l,ln(e,l),Ft(r,e,l,-1))}return Ns(),r=os(Error(s(421))),ya(e,t,i,r)}return l.data==="$?"?(t.flags|=128,t.child=e.child,t=Jf.bind(null,e),l._reactRetry=t,null):(e=a.treeContext,vt=kn(l.nextSibling),xt=t,De=!0,Dt=null,e!==null&&(bt[St++]=nn,bt[St++]=rn,bt[St++]=Kn,nn=e.id,rn=e.overflow,Kn=t),t=ps(t,r.children),t.flags|=4096,t)}function ac(e,t,n){e.lanes|=t;var r=e.alternate;r!==null&&(r.lanes|=t),Ho(e.return,t,n)}function fs(e,t,n,r,l){var a=e.memoizedState;a===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:r,tail:n,tailMode:l}:(a.isBackwards=t,a.rendering=null,a.renderingStartTime=0,a.last=r,a.tail=n,a.tailMode=l)}function oc(e,t,n){var r=t.pendingProps,l=r.revealOrder,a=r.tail;if(at(e,t,r.children,n),r=Ie.current,(r&2)!==0)r=r&1|2,t.flags|=128;else{if(e!==null&&(e.flags&128)!==0)e:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&ac(e,n,t);else if(e.tag===19)ac(e,n,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}r&=1}if(je(Ie,r),(t.mode&1)===0)t.memoizedState=null;else switch(l){case"forwards":for(n=t.child,l=null;n!==null;)e=n.alternate,e!==null&&pa(e)===null&&(l=n),n=n.sibling;n=l,n===null?(l=t.child,t.child=null):(l=n.sibling,n.sibling=null),fs(t,!1,l,n,a);break;case"backwards":for(n=null,l=t.child,t.child=null;l!==null;){if(e=l.alternate,e!==null&&pa(e)===null){t.child=l;break}e=l.sibling,l.sibling=n,n=l,l=e}fs(t,!0,n,null,a);break;case"together":fs(t,!1,null,null,void 0);break;default:t.memoizedState=null}return t.child}function _a(e,t){(t.mode&1)===0&&e!==null&&(e.alternate=null,t.alternate=null,t.flags|=2)}function on(e,t,n){if(e!==null&&(t.dependencies=e.dependencies),qn|=t.lanes,(n&t.childLanes)===0)return null;if(e!==null&&t.child!==e.child)throw Error(s(153));if(t.child!==null){for(e=t.child,n=zn(e,e.pendingProps),t.child=n,n.return=t;e.sibling!==null;)e=e.sibling,n=n.sibling=zn(e,e.pendingProps),n.return=t;n.sibling=null}return t.child}function If(e,t,n){switch(t.tag){case 3:nc(t),Ar();break;case 5:_u(t);break;case 1:ct(t.type)&&na(t);break;case 4:Ko(t,t.stateNode.containerInfo);break;case 10:var r=t.type._context,l=t.memoizedProps.value;je(ia,r._currentValue),r._currentValue=l;break;case 13:if(r=t.memoizedState,r!==null)return r.dehydrated!==null?(je(Ie,Ie.current&1),t.flags|=128,null):(n&t.child.childLanes)!==0?lc(e,t,n):(je(Ie,Ie.current&1),e=on(e,t,n),e!==null?e.sibling:null);je(Ie,Ie.current&1);break;case 19:if(r=(n&t.childLanes)!==0,(e.flags&128)!==0){if(r)return oc(e,t,n);t.flags|=128}if(l=t.memoizedState,l!==null&&(l.rendering=null,l.tail=null,l.lastEffect=null),je(Ie,Ie.current),r)break;return null;case 22:case 23:return t.lanes=0,Zu(e,t,n)}return on(e,t,n)}var sc,gs,ic,uc;sc=function(e,t){for(var n=t.child;n!==null;){if(n.tag===5||n.tag===6)e.appendChild(n.stateNode);else if(n.tag!==4&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===t)break;for(;n.sibling===null;){if(n.return===null||n.return===t)return;n=n.return}n.sibling.return=n.return,n=n.sibling}},gs=function(){},ic=function(e,t,n,r){var l=e.memoizedProps;if(l!==r){e=t.stateNode,Jn(Vt.current);var a=null;switch(n){case"input":l=Ze(e,l),r=Ze(e,r),a=[];break;case"select":l=I({},l,{value:void 0}),r=I({},r,{value:void 0}),a=[];break;case"textarea":l=fn(e,l),r=fn(e,r),a=[];break;default:typeof l.onClick!="function"&&typeof r.onClick=="function"&&(e.onclick=Zl)}ir(n,r);var i;n=null;for(w in l)if(!r.hasOwnProperty(w)&&l.hasOwnProperty(w)&&l[w]!=null)if(w==="style"){var c=l[w];for(i in c)c.hasOwnProperty(i)&&(n||(n={}),n[i]="")}else w!=="dangerouslySetInnerHTML"&&w!=="children"&&w!=="suppressContentEditableWarning"&&w!=="suppressHydrationWarning"&&w!=="autoFocus"&&(v.hasOwnProperty(w)?a||(a=[]):(a=a||[]).push(w,null));for(w in r){var g=r[w];if(c=l!=null?l[w]:void 0,r.hasOwnProperty(w)&&g!==c&&(g!=null||c!=null))if(w==="style")if(c){for(i in c)!c.hasOwnProperty(i)||g&&g.hasOwnProperty(i)||(n||(n={}),n[i]="");for(i in g)g.hasOwnProperty(i)&&c[i]!==g[i]&&(n||(n={}),n[i]=g[i])}else n||(a||(a=[]),a.push(w,n)),n=g;else w==="dangerouslySetInnerHTML"?(g=g?g.__html:void 0,c=c?c.__html:void 0,g!=null&&c!==g&&(a=a||[]).push(w,g)):w==="children"?typeof g!="string"&&typeof g!="number"||(a=a||[]).push(w,""+g):w!=="suppressContentEditableWarning"&&w!=="suppressHydrationWarning"&&(v.hasOwnProperty(w)?(g!=null&&w==="onScroll"&&Me("scroll",e),a||c===g||(a=[])):(a=a||[]).push(w,g))}n&&(a=a||[]).push("style",n);var w=a;(t.updateQueue=w)&&(t.flags|=4)}},uc=function(e,t,n,r){n!==r&&(t.flags|=4)};function yl(e,t){if(!De)switch(e.tailMode){case"hidden":t=e.tail;for(var n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?e.tail=null:n.sibling=null;break;case"collapsed":n=e.tail;for(var r=null;n!==null;)n.alternate!==null&&(r=n),n=n.sibling;r===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:r.sibling=null}}function nt(e){var t=e.alternate!==null&&e.alternate.child===e.child,n=0,r=0;if(t)for(var l=e.child;l!==null;)n|=l.lanes|l.childLanes,r|=l.subtreeFlags&14680064,r|=l.flags&14680064,l.return=e,l=l.sibling;else for(l=e.child;l!==null;)n|=l.lanes|l.childLanes,r|=l.subtreeFlags,r|=l.flags,l.return=e,l=l.sibling;return e.subtreeFlags|=r,e.childLanes=n,t}function Of(e,t,n){var r=t.pendingProps;switch(Do(t),t.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return nt(t),null;case 1:return ct(t.type)&&ta(),nt(t),null;case 3:return r=t.stateNode,jr(),ze(ut),ze(et),Jo(),r.pendingContext&&(r.context=r.pendingContext,r.pendingContext=null),(e===null||e.child===null)&&(oa(t)?t.flags|=4:e===null||e.memoizedState.isDehydrated&&(t.flags&256)===0||(t.flags|=1024,Dt!==null&&(Es(Dt),Dt=null))),gs(e,t),nt(t),null;case 5:Yo(t);var l=Jn(gl.current);if(n=t.type,e!==null&&t.stateNode!=null)ic(e,t,n,r,l),e.ref!==t.ref&&(t.flags|=512,t.flags|=2097152);else{if(!r){if(t.stateNode===null)throw Error(s(166));return nt(t),null}if(e=Jn(Vt.current),oa(t)){r=t.stateNode,n=t.type;var a=t.memoizedProps;switch(r[Ht]=t,r[ul]=a,e=(t.mode&1)!==0,n){case"dialog":Me("cancel",r),Me("close",r);break;case"iframe":case"object":case"embed":Me("load",r);break;case"video":case"audio":for(l=0;l<ol.length;l++)Me(ol[l],r);break;case"source":Me("error",r);break;case"img":case"image":case"link":Me("error",r),Me("load",r);break;case"details":Me("toggle",r);break;case"input":rr(r,a),Me("invalid",r);break;case"select":r._wrapperState={wasMultiple:!!a.multiple},Me("invalid",r);break;case"textarea":Jt(r,a),Me("invalid",r)}ir(n,a),l=null;for(var i in a)if(a.hasOwnProperty(i)){var c=a[i];i==="children"?typeof c=="string"?r.textContent!==c&&(a.suppressHydrationWarning!==!0&&Xl(r.textContent,c,e),l=["children",c]):typeof c=="number"&&r.textContent!==""+c&&(a.suppressHydrationWarning!==!0&&Xl(r.textContent,c,e),l=["children",""+c]):v.hasOwnProperty(i)&&c!=null&&i==="onScroll"&&Me("scroll",r)}switch(n){case"input":lt(r),Rn(r,a,!0);break;case"textarea":lt(r),We(r);break;case"select":case"option":break;default:typeof a.onClick=="function"&&(r.onclick=Zl)}r=l,t.updateQueue=r,r!==null&&(t.flags|=4)}else{i=l.nodeType===9?l:l.ownerDocument,e==="http://www.w3.org/1999/xhtml"&&(e=ar(n)),e==="http://www.w3.org/1999/xhtml"?n==="script"?(e=i.createElement("div"),e.innerHTML="<script><\/script>",e=e.removeChild(e.firstChild)):typeof r.is=="string"?e=i.createElement(n,{is:r.is}):(e=i.createElement(n),n==="select"&&(i=e,r.multiple?i.multiple=!0:r.size&&(i.size=r.size))):e=i.createElementNS(e,n),e[Ht]=t,e[ul]=r,sc(e,t,!1,!1),t.stateNode=e;e:{switch(i=ur(n,r),n){case"dialog":Me("cancel",e),Me("close",e),l=r;break;case"iframe":case"object":case"embed":Me("load",e),l=r;break;case"video":case"audio":for(l=0;l<ol.length;l++)Me(ol[l],e);l=r;break;case"source":Me("error",e),l=r;break;case"img":case"image":case"link":Me("error",e),Me("load",e),l=r;break;case"details":Me("toggle",e),l=r;break;case"input":rr(e,r),l=Ze(e,r),Me("invalid",e);break;case"option":l=r;break;case"select":e._wrapperState={wasMultiple:!!r.multiple},l=I({},r,{value:void 0}),Me("invalid",e);break;case"textarea":Jt(e,r),l=fn(e,r),Me("invalid",e);break;default:l=r}ir(n,l),c=l;for(a in c)if(c.hasOwnProperty(a)){var g=c[a];a==="style"?Br(e,g):a==="dangerouslySetInnerHTML"?(g=g?g.__html:void 0,g!=null&&gn(e,g)):a==="children"?typeof g=="string"?(n!=="textarea"||g!=="")&&Tt(e,g):typeof g=="number"&&Tt(e,""+g):a!=="suppressContentEditableWarning"&&a!=="suppressHydrationWarning"&&a!=="autoFocus"&&(v.hasOwnProperty(a)?g!=null&&a==="onScroll"&&Me("scroll",e):g!=null&&Ne(e,a,g,i))}switch(n){case"input":lt(e),Rn(e,r,!1);break;case"textarea":lt(e),We(e);break;case"option":r.value!=null&&e.setAttribute("value",""+de(r.value));break;case"select":e.multiple=!!r.multiple,a=r.value,a!=null?Je(e,!!r.multiple,a,!1):r.defaultValue!=null&&Je(e,!!r.multiple,r.defaultValue,!0);break;default:typeof l.onClick=="function"&&(e.onclick=Zl)}switch(n){case"button":case"input":case"select":case"textarea":r=!!r.autoFocus;break e;case"img":r=!0;break e;default:r=!1}}r&&(t.flags|=4)}t.ref!==null&&(t.flags|=512,t.flags|=2097152)}return nt(t),null;case 6:if(e&&t.stateNode!=null)uc(e,t,e.memoizedProps,r);else{if(typeof r!="string"&&t.stateNode===null)throw Error(s(166));if(n=Jn(gl.current),Jn(Vt.current),oa(t)){if(r=t.stateNode,n=t.memoizedProps,r[Ht]=t,(a=r.nodeValue!==n)&&(e=xt,e!==null))switch(e.tag){case 3:Xl(r.nodeValue,n,(e.mode&1)!==0);break;case 5:e.memoizedProps.suppressHydrationWarning!==!0&&Xl(r.nodeValue,n,(e.mode&1)!==0)}a&&(t.flags|=4)}else r=(n.nodeType===9?n:n.ownerDocument).createTextNode(r),r[Ht]=t,t.stateNode=r}return nt(t),null;case 13:if(ze(Ie),r=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(De&&vt!==null&&(t.mode&1)!==0&&(t.flags&128)===0)pu(),Ar(),t.flags|=98560,a=!1;else if(a=oa(t),r!==null&&r.dehydrated!==null){if(e===null){if(!a)throw Error(s(318));if(a=t.memoizedState,a=a!==null?a.dehydrated:null,!a)throw Error(s(317));a[Ht]=t}else Ar(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;nt(t),a=!1}else Dt!==null&&(Es(Dt),Dt=null),a=!0;if(!a)return t.flags&65536?t:null}return(t.flags&128)!==0?(t.lanes=n,t):(r=r!==null,r!==(e!==null&&e.memoizedState!==null)&&r&&(t.child.flags|=8192,(t.mode&1)!==0&&(e===null||(Ie.current&1)!==0?Ve===0&&(Ve=3):Ns())),t.updateQueue!==null&&(t.flags|=4),nt(t),null);case 4:return jr(),gs(e,t),e===null&&sl(t.stateNode.containerInfo),nt(t),null;case 10:return Uo(t.type._context),nt(t),null;case 17:return ct(t.type)&&ta(),nt(t),null;case 19:if(ze(Ie),a=t.memoizedState,a===null)return nt(t),null;if(r=(t.flags&128)!==0,i=a.rendering,i===null)if(r)yl(a,!1);else{if(Ve!==0||e!==null&&(e.flags&128)!==0)for(e=t.child;e!==null;){if(i=pa(e),i!==null){for(t.flags|=128,yl(a,!1),r=i.updateQueue,r!==null&&(t.updateQueue=r,t.flags|=4),t.subtreeFlags=0,r=n,n=t.child;n!==null;)a=n,e=r,a.flags&=14680066,i=a.alternate,i===null?(a.childLanes=0,a.lanes=e,a.child=null,a.subtreeFlags=0,a.memoizedProps=null,a.memoizedState=null,a.updateQueue=null,a.dependencies=null,a.stateNode=null):(a.childLanes=i.childLanes,a.lanes=i.lanes,a.child=i.child,a.subtreeFlags=0,a.deletions=null,a.memoizedProps=i.memoizedProps,a.memoizedState=i.memoizedState,a.updateQueue=i.updateQueue,a.type=i.type,e=i.dependencies,a.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext}),n=n.sibling;return je(Ie,Ie.current&1|2),t.child}e=e.sibling}a.tail!==null&&Re()>Rr&&(t.flags|=128,r=!0,yl(a,!1),t.lanes=4194304)}else{if(!r)if(e=pa(i),e!==null){if(t.flags|=128,r=!0,n=e.updateQueue,n!==null&&(t.updateQueue=n,t.flags|=4),yl(a,!0),a.tail===null&&a.tailMode==="hidden"&&!i.alternate&&!De)return nt(t),null}else 2*Re()-a.renderingStartTime>Rr&&n!==1073741824&&(t.flags|=128,r=!0,yl(a,!1),t.lanes=4194304);a.isBackwards?(i.sibling=t.child,t.child=i):(n=a.last,n!==null?n.sibling=i:t.child=i,a.last=i)}return a.tail!==null?(t=a.tail,a.rendering=t,a.tail=t.sibling,a.renderingStartTime=Re(),t.sibling=null,n=Ie.current,je(Ie,r?n&1|2:n&1),t):(nt(t),null);case 22:case 23:return As(),r=t.memoizedState!==null,e!==null&&e.memoizedState!==null!==r&&(t.flags|=8192),r&&(t.mode&1)!==0?(yt&1073741824)!==0&&(nt(t),t.subtreeFlags&6&&(t.flags|=8192)):nt(t),null;case 24:return null;case 25:return null}throw Error(s(156,t.tag))}function $f(e,t){switch(Do(t),t.tag){case 1:return ct(t.type)&&ta(),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return jr(),ze(ut),ze(et),Jo(),e=t.flags,(e&65536)!==0&&(e&128)===0?(t.flags=e&-65537|128,t):null;case 5:return Yo(t),null;case 13:if(ze(Ie),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(s(340));Ar()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return ze(Ie),null;case 4:return jr(),null;case 10:return Uo(t.type._context),null;case 22:case 23:return As(),null;case 24:return null;default:return null}}var wa=!1,rt=!1,Ff=typeof WeakSet=="function"?WeakSet:Set,W=null;function zr(e,t){var n=e.ref;if(n!==null)if(typeof n=="function")try{n(null)}catch(r){Fe(e,t,r)}else n.current=null}function ms(e,t,n){try{n()}catch(r){Fe(e,t,r)}}var cc=!1;function Bf(e,t){if(Ao=Bl,e=Ui(),yo(e)){if("selectionStart"in e)var n={start:e.selectionStart,end:e.selectionEnd};else e:{n=(n=e.ownerDocument)&&n.defaultView||window;var r=n.getSelection&&n.getSelection();if(r&&r.rangeCount!==0){n=r.anchorNode;var l=r.anchorOffset,a=r.focusNode;r=r.focusOffset;try{n.nodeType,a.nodeType}catch{n=null;break e}var i=0,c=-1,g=-1,w=0,L=0,R=e,M=null;t:for(;;){for(var V;R!==n||l!==0&&R.nodeType!==3||(c=i+l),R!==a||r!==0&&R.nodeType!==3||(g=i+r),R.nodeType===3&&(i+=R.nodeValue.length),(V=R.firstChild)!==null;)M=R,R=V;for(;;){if(R===e)break t;if(M===n&&++w===l&&(c=i),M===a&&++L===r&&(g=i),(V=R.nextSibling)!==null)break;R=M,M=R.parentNode}R=V}n=c===-1||g===-1?null:{start:c,end:g}}else n=null}n=n||{start:0,end:0}}else n=null;for(No={focusedElem:e,selectionRange:n},Bl=!1,W=t;W!==null;)if(t=W,e=t.child,(t.subtreeFlags&1028)!==0&&e!==null)e.return=t,W=e;else for(;W!==null;){t=W;try{var K=t.alternate;if((t.flags&1024)!==0)switch(t.tag){case 0:case 11:case 15:break;case 1:if(K!==null){var Q=K.memoizedProps,Be=K.memoizedState,y=t.stateNode,x=y.getSnapshotBeforeUpdate(t.elementType===t.type?Q:It(t.type,Q),Be);y.__reactInternalSnapshotBeforeUpdate=x}break;case 3:var _=t.stateNode.containerInfo;_.nodeType===1?_.textContent="":_.nodeType===9&&_.documentElement&&_.removeChild(_.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(s(163))}}catch(O){Fe(t,t.return,O)}if(e=t.sibling,e!==null){e.return=t.return,W=e;break}W=t.return}return K=cc,cc=!1,K}function _l(e,t,n){var r=t.updateQueue;if(r=r!==null?r.lastEffect:null,r!==null){var l=r=r.next;do{if((l.tag&e)===e){var a=l.destroy;l.destroy=void 0,a!==void 0&&ms(t,n,a)}l=l.next}while(l!==r)}}function ka(e,t){if(t=t.updateQueue,t=t!==null?t.lastEffect:null,t!==null){var n=t=t.next;do{if((n.tag&e)===e){var r=n.create;n.destroy=r()}n=n.next}while(n!==t)}}function hs(e){var t=e.ref;if(t!==null){var n=e.stateNode;switch(e.tag){case 5:e=n;break;default:e=n}typeof t=="function"?t(e):t.current=e}}function dc(e){var t=e.alternate;t!==null&&(e.alternate=null,dc(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&(delete t[Ht],delete t[ul],delete t[Mo],delete t[bf],delete t[Sf])),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}function pc(e){return e.tag===5||e.tag===3||e.tag===4}function fc(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||pc(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function xs(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?n.nodeType===8?n.parentNode.insertBefore(e,t):n.insertBefore(e,t):(n.nodeType===8?(t=n.parentNode,t.insertBefore(e,n)):(t=n,t.appendChild(e)),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=Zl));else if(r!==4&&(e=e.child,e!==null))for(xs(e,t,n),e=e.sibling;e!==null;)xs(e,t,n),e=e.sibling}function vs(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?n.insertBefore(e,t):n.appendChild(e);else if(r!==4&&(e=e.child,e!==null))for(vs(e,t,n),e=e.sibling;e!==null;)vs(e,t,n),e=e.sibling}var Ge=null,Ot=!1;function Nn(e,t,n){for(n=n.child;n!==null;)gc(e,t,n),n=n.sibling}function gc(e,t,n){if(ce&&typeof ce.onCommitFiberUnmount=="function")try{ce.onCommitFiberUnmount(ve,n)}catch{}switch(n.tag){case 5:rt||zr(n,t);case 6:var r=Ge,l=Ot;Ge=null,Nn(e,t,n),Ge=r,Ot=l,Ge!==null&&(Ot?(e=Ge,n=n.stateNode,e.nodeType===8?e.parentNode.removeChild(n):e.removeChild(n)):Ge.removeChild(n.stateNode));break;case 18:Ge!==null&&(Ot?(e=Ge,n=n.stateNode,e.nodeType===8?jo(e.parentNode,n):e.nodeType===1&&jo(e,n),Xr(e)):jo(Ge,n.stateNode));break;case 4:r=Ge,l=Ot,Ge=n.stateNode.containerInfo,Ot=!0,Nn(e,t,n),Ge=r,Ot=l;break;case 0:case 11:case 14:case 15:if(!rt&&(r=n.updateQueue,r!==null&&(r=r.lastEffect,r!==null))){l=r=r.next;do{var a=l,i=a.destroy;a=a.tag,i!==void 0&&((a&2)!==0||(a&4)!==0)&&ms(n,t,i),l=l.next}while(l!==r)}Nn(e,t,n);break;case 1:if(!rt&&(zr(n,t),r=n.stateNode,typeof r.componentWillUnmount=="function"))try{r.props=n.memoizedProps,r.state=n.memoizedState,r.componentWillUnmount()}catch(c){Fe(n,t,c)}Nn(e,t,n);break;case 21:Nn(e,t,n);break;case 22:n.mode&1?(rt=(r=rt)||n.memoizedState!==null,Nn(e,t,n),rt=r):Nn(e,t,n);break;default:Nn(e,t,n)}}function mc(e){var t=e.updateQueue;if(t!==null){e.updateQueue=null;var n=e.stateNode;n===null&&(n=e.stateNode=new Ff),t.forEach(function(r){var l=Gf.bind(null,e,r);n.has(r)||(n.add(r),r.then(l,l))})}}function $t(e,t){var n=t.deletions;if(n!==null)for(var r=0;r<n.length;r++){var l=n[r];try{var a=e,i=t,c=i;e:for(;c!==null;){switch(c.tag){case 5:Ge=c.stateNode,Ot=!1;break e;case 3:Ge=c.stateNode.containerInfo,Ot=!0;break e;case 4:Ge=c.stateNode.containerInfo,Ot=!0;break e}c=c.return}if(Ge===null)throw Error(s(160));gc(a,i,l),Ge=null,Ot=!1;var g=l.alternate;g!==null&&(g.return=null),l.return=null}catch(w){Fe(l,t,w)}}if(t.subtreeFlags&12854)for(t=t.child;t!==null;)hc(t,e),t=t.sibling}function hc(e,t){var n=e.alternate,r=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if($t(t,e),Kt(e),r&4){try{_l(3,e,e.return),ka(3,e)}catch(Q){Fe(e,e.return,Q)}try{_l(5,e,e.return)}catch(Q){Fe(e,e.return,Q)}}break;case 1:$t(t,e),Kt(e),r&512&&n!==null&&zr(n,n.return);break;case 5:if($t(t,e),Kt(e),r&512&&n!==null&&zr(n,n.return),e.flags&32){var l=e.stateNode;try{Tt(l,"")}catch(Q){Fe(e,e.return,Q)}}if(r&4&&(l=e.stateNode,l!=null)){var a=e.memoizedProps,i=n!==null?n.memoizedProps:a,c=e.type,g=e.updateQueue;if(e.updateQueue=null,g!==null)try{c==="input"&&a.type==="radio"&&a.name!=null&&Bt(l,a),ur(c,i);var w=ur(c,a);for(i=0;i<g.length;i+=2){var L=g[i],R=g[i+1];L==="style"?Br(l,R):L==="dangerouslySetInnerHTML"?gn(l,R):L==="children"?Tt(l,R):Ne(l,L,R,w)}switch(c){case"input":Ut(l,a);break;case"textarea":lr(l,a);break;case"select":var M=l._wrapperState.wasMultiple;l._wrapperState.wasMultiple=!!a.multiple;var V=a.value;V!=null?Je(l,!!a.multiple,V,!1):M!==!!a.multiple&&(a.defaultValue!=null?Je(l,!!a.multiple,a.defaultValue,!0):Je(l,!!a.multiple,a.multiple?[]:"",!1))}l[ul]=a}catch(Q){Fe(e,e.return,Q)}}break;case 6:if($t(t,e),Kt(e),r&4){if(e.stateNode===null)throw Error(s(162));l=e.stateNode,a=e.memoizedProps;try{l.nodeValue=a}catch(Q){Fe(e,e.return,Q)}}break;case 3:if($t(t,e),Kt(e),r&4&&n!==null&&n.memoizedState.isDehydrated)try{Xr(t.containerInfo)}catch(Q){Fe(e,e.return,Q)}break;case 4:$t(t,e),Kt(e);break;case 13:$t(t,e),Kt(e),l=e.child,l.flags&8192&&(a=l.memoizedState!==null,l.stateNode.isHidden=a,!a||l.alternate!==null&&l.alternate.memoizedState!==null||(ws=Re())),r&4&&mc(e);break;case 22:if(L=n!==null&&n.memoizedState!==null,e.mode&1?(rt=(w=rt)||L,$t(t,e),rt=w):$t(t,e),Kt(e),r&8192){if(w=e.memoizedState!==null,(e.stateNode.isHidden=w)&&!L&&(e.mode&1)!==0)for(W=e,L=e.child;L!==null;){for(R=W=L;W!==null;){switch(M=W,V=M.child,M.tag){case 0:case 11:case 14:case 15:_l(4,M,M.return);break;case 1:zr(M,M.return);var K=M.stateNode;if(typeof K.componentWillUnmount=="function"){r=M,n=M.return;try{t=r,K.props=t.memoizedProps,K.state=t.memoizedState,K.componentWillUnmount()}catch(Q){Fe(r,n,Q)}}break;case 5:zr(M,M.return);break;case 22:if(M.memoizedState!==null){yc(R);continue}}V!==null?(V.return=M,W=V):yc(R)}L=L.sibling}e:for(L=null,R=e;;){if(R.tag===5){if(L===null){L=R;try{l=R.stateNode,w?(a=l.style,typeof a.setProperty=="function"?a.setProperty("display","none","important"):a.display="none"):(c=R.stateNode,g=R.memoizedProps.style,i=g!=null&&g.hasOwnProperty("display")?g.display:null,c.style.display=Pt("display",i))}catch(Q){Fe(e,e.return,Q)}}}else if(R.tag===6){if(L===null)try{R.stateNode.nodeValue=w?"":R.memoizedProps}catch(Q){Fe(e,e.return,Q)}}else if((R.tag!==22&&R.tag!==23||R.memoizedState===null||R===e)&&R.child!==null){R.child.return=R,R=R.child;continue}if(R===e)break e;for(;R.sibling===null;){if(R.return===null||R.return===e)break e;L===R&&(L=null),R=R.return}L===R&&(L=null),R.sibling.return=R.return,R=R.sibling}}break;case 19:$t(t,e),Kt(e),r&4&&mc(e);break;case 21:break;default:$t(t,e),Kt(e)}}function Kt(e){var t=e.flags;if(t&2){try{e:{for(var n=e.return;n!==null;){if(pc(n)){var r=n;break e}n=n.return}throw Error(s(160))}switch(r.tag){case 5:var l=r.stateNode;r.flags&32&&(Tt(l,""),r.flags&=-33);var a=fc(e);vs(e,a,l);break;case 3:case 4:var i=r.stateNode.containerInfo,c=fc(e);xs(e,c,i);break;default:throw Error(s(161))}}catch(g){Fe(e,e.return,g)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function Uf(e,t,n){W=e,xc(e)}function xc(e,t,n){for(var r=(e.mode&1)!==0;W!==null;){var l=W,a=l.child;if(l.tag===22&&r){var i=l.memoizedState!==null||wa;if(!i){var c=l.alternate,g=c!==null&&c.memoizedState!==null||rt;c=wa;var w=rt;if(wa=i,(rt=g)&&!w)for(W=l;W!==null;)i=W,g=i.child,i.tag===22&&i.memoizedState!==null?_c(l):g!==null?(g.return=i,W=g):_c(l);for(;a!==null;)W=a,xc(a),a=a.sibling;W=l,wa=c,rt=w}vc(e)}else(l.subtreeFlags&8772)!==0&&a!==null?(a.return=l,W=a):vc(e)}}function vc(e){for(;W!==null;){var t=W;if((t.flags&8772)!==0){var n=t.alternate;try{if((t.flags&8772)!==0)switch(t.tag){case 0:case 11:case 15:rt||ka(5,t);break;case 1:var r=t.stateNode;if(t.flags&4&&!rt)if(n===null)r.componentDidMount();else{var l=t.elementType===t.type?n.memoizedProps:It(t.type,n.memoizedProps);r.componentDidUpdate(l,n.memoizedState,r.__reactInternalSnapshotBeforeUpdate)}var a=t.updateQueue;a!==null&&yu(t,a,r);break;case 3:var i=t.updateQueue;if(i!==null){if(n=null,t.child!==null)switch(t.child.tag){case 5:n=t.child.stateNode;break;case 1:n=t.child.stateNode}yu(t,i,n)}break;case 5:var c=t.stateNode;if(n===null&&t.flags&4){n=c;var g=t.memoizedProps;switch(t.type){case"button":case"input":case"select":case"textarea":g.autoFocus&&n.focus();break;case"img":g.src&&(n.src=g.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(t.memoizedState===null){var w=t.alternate;if(w!==null){var L=w.memoizedState;if(L!==null){var R=L.dehydrated;R!==null&&Xr(R)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(s(163))}rt||t.flags&512&&hs(t)}catch(M){Fe(t,t.return,M)}}if(t===e){W=null;break}if(n=t.sibling,n!==null){n.return=t.return,W=n;break}W=t.return}}function yc(e){for(;W!==null;){var t=W;if(t===e){W=null;break}var n=t.sibling;if(n!==null){n.return=t.return,W=n;break}W=t.return}}function _c(e){for(;W!==null;){var t=W;try{switch(t.tag){case 0:case 11:case 15:var n=t.return;try{ka(4,t)}catch(g){Fe(t,n,g)}break;case 1:var r=t.stateNode;if(typeof r.componentDidMount=="function"){var l=t.return;try{r.componentDidMount()}catch(g){Fe(t,l,g)}}var a=t.return;try{hs(t)}catch(g){Fe(t,a,g)}break;case 5:var i=t.return;try{hs(t)}catch(g){Fe(t,i,g)}}}catch(g){Fe(t,t.return,g)}if(t===e){W=null;break}var c=t.sibling;if(c!==null){c.return=t.return,W=c;break}W=t.return}}var Hf=Math.ceil,ba=ke.ReactCurrentDispatcher,ys=ke.ReactCurrentOwner,At=ke.ReactCurrentBatchConfig,we=0,Ye=null,Ue=null,qe=0,yt=0,Lr=bn(0),Ve=0,wl=null,qn=0,Sa=0,_s=0,kl=null,pt=null,ws=0,Rr=1/0,sn=null,Ea=!1,ks=null,Tn=null,Ca=!1,Pn=null,Aa=0,bl=0,bs=null,Na=-1,Ta=0;function ot(){return(we&6)!==0?Re():Na!==-1?Na:Na=Re()}function jn(e){return(e.mode&1)===0?1:(we&2)!==0&&qe!==0?qe&-qe:Cf.transition!==null?(Ta===0&&(Ta=fi()),Ta):(e=Ee,e!==0||(e=window.event,e=e===void 0?16:ki(e.type)),e)}function Ft(e,t,n,r){if(50<bl)throw bl=0,bs=null,Error(s(185));Yr(e,n,r),((we&2)===0||e!==Ye)&&(e===Ye&&((we&2)===0&&(Sa|=n),Ve===4&&Mn(e,qe)),ft(e,r),n===1&&we===0&&(t.mode&1)===0&&(Rr=Re()+500,ra&&En()))}function ft(e,t){var n=e.callbackNode;Ep(e,t);var r=Ol(e,e===Ye?qe:0);if(r===0)n!==null&&Ll(n),e.callbackNode=null,e.callbackPriority=0;else if(t=r&-r,e.callbackPriority!==t){if(n!=null&&Ll(n),t===1)e.tag===0?Ef(kc.bind(null,e)):su(kc.bind(null,e)),wf(function(){(we&6)===0&&En()}),n=null;else{switch(gi(r)){case 1:n=gr;break;case 4:n=m;break;case 16:n=P;break;case 536870912:n=re;break;default:n=P}n=Pc(n,wc.bind(null,e))}e.callbackPriority=t,e.callbackNode=n}}function wc(e,t){if(Na=-1,Ta=0,(we&6)!==0)throw Error(s(327));var n=e.callbackNode;if(Dr()&&e.callbackNode!==n)return null;var r=Ol(e,e===Ye?qe:0);if(r===0)return null;if((r&30)!==0||(r&e.expiredLanes)!==0||t)t=Pa(e,r);else{t=r;var l=we;we|=2;var a=Sc();(Ye!==e||qe!==t)&&(sn=null,Rr=Re()+500,Zn(e,t));do try{Kf();break}catch(c){bc(e,c)}while(!0);Bo(),ba.current=a,we=l,Ue!==null?t=0:(Ye=null,qe=0,t=Ve)}if(t!==0){if(t===2&&(l=no(e),l!==0&&(r=l,t=Ss(e,l))),t===1)throw n=wl,Zn(e,0),Mn(e,r),ft(e,Re()),n;if(t===6)Mn(e,r);else{if(l=e.current.alternate,(r&30)===0&&!Vf(l)&&(t=Pa(e,r),t===2&&(a=no(e),a!==0&&(r=a,t=Ss(e,a))),t===1))throw n=wl,Zn(e,0),Mn(e,r),ft(e,Re()),n;switch(e.finishedWork=l,e.finishedLanes=r,t){case 0:case 1:throw Error(s(345));case 2:er(e,pt,sn);break;case 3:if(Mn(e,r),(r&130023424)===r&&(t=ws+500-Re(),10<t)){if(Ol(e,0)!==0)break;if(l=e.suspendedLanes,(l&r)!==r){ot(),e.pingedLanes|=e.suspendedLanes&l;break}e.timeoutHandle=Po(er.bind(null,e,pt,sn),t);break}er(e,pt,sn);break;case 4:if(Mn(e,r),(r&4194240)===r)break;for(t=e.eventTimes,l=-1;0<r;){var i=31-te(r);a=1<<i,i=t[i],i>l&&(l=i),r&=~a}if(r=l,r=Re()-r,r=(120>r?120:480>r?480:1080>r?1080:1920>r?1920:3e3>r?3e3:4320>r?4320:1960*Hf(r/1960))-r,10<r){e.timeoutHandle=Po(er.bind(null,e,pt,sn),r);break}er(e,pt,sn);break;case 5:er(e,pt,sn);break;default:throw Error(s(329))}}}return ft(e,Re()),e.callbackNode===n?wc.bind(null,e):null}function Ss(e,t){var n=kl;return e.current.memoizedState.isDehydrated&&(Zn(e,t).flags|=256),e=Pa(e,t),e!==2&&(t=pt,pt=n,t!==null&&Es(t)),e}function Es(e){pt===null?pt=e:pt.push.apply(pt,e)}function Vf(e){for(var t=e;;){if(t.flags&16384){var n=t.updateQueue;if(n!==null&&(n=n.stores,n!==null))for(var r=0;r<n.length;r++){var l=n[r],a=l.getSnapshot;l=l.value;try{if(!Rt(a(),l))return!1}catch{return!1}}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function Mn(e,t){for(t&=~_s,t&=~Sa,e.suspendedLanes|=t,e.pingedLanes&=~t,e=e.expirationTimes;0<t;){var n=31-te(t),r=1<<n;e[n]=-1,t&=~r}}function kc(e){if((we&6)!==0)throw Error(s(327));Dr();var t=Ol(e,0);if((t&1)===0)return ft(e,Re()),null;var n=Pa(e,t);if(e.tag!==0&&n===2){var r=no(e);r!==0&&(t=r,n=Ss(e,r))}if(n===1)throw n=wl,Zn(e,0),Mn(e,t),ft(e,Re()),n;if(n===6)throw Error(s(345));return e.finishedWork=e.current.alternate,e.finishedLanes=t,er(e,pt,sn),ft(e,Re()),null}function Cs(e,t){var n=we;we|=1;try{return e(t)}finally{we=n,we===0&&(Rr=Re()+500,ra&&En())}}function Xn(e){Pn!==null&&Pn.tag===0&&(we&6)===0&&Dr();var t=we;we|=1;var n=At.transition,r=Ee;try{if(At.transition=null,Ee=1,e)return e()}finally{Ee=r,At.transition=n,we=t,(we&6)===0&&En()}}function As(){yt=Lr.current,ze(Lr)}function Zn(e,t){e.finishedWork=null,e.finishedLanes=0;var n=e.timeoutHandle;if(n!==-1&&(e.timeoutHandle=-1,_f(n)),Ue!==null)for(n=Ue.return;n!==null;){var r=n;switch(Do(r),r.tag){case 1:r=r.type.childContextTypes,r!=null&&ta();break;case 3:jr(),ze(ut),ze(et),Jo();break;case 5:Yo(r);break;case 4:jr();break;case 13:ze(Ie);break;case 19:ze(Ie);break;case 10:Uo(r.type._context);break;case 22:case 23:As()}n=n.return}if(Ye=e,Ue=e=zn(e.current,null),qe=yt=t,Ve=0,wl=null,_s=Sa=qn=0,pt=kl=null,Qn!==null){for(t=0;t<Qn.length;t++)if(n=Qn[t],r=n.interleaved,r!==null){n.interleaved=null;var l=r.next,a=n.pending;if(a!==null){var i=a.next;a.next=l,r.next=i}n.pending=r}Qn=null}return e}function bc(e,t){do{var n=Ue;try{if(Bo(),fa.current=xa,ga){for(var r=Oe.memoizedState;r!==null;){var l=r.queue;l!==null&&(l.pending=null),r=r.next}ga=!1}if(Gn=0,Ke=He=Oe=null,ml=!1,hl=0,ys.current=null,n===null||n.return===null){Ve=1,wl=t,Ue=null;break}e:{var a=e,i=n.return,c=n,g=t;if(t=qe,c.flags|=32768,g!==null&&typeof g=="object"&&typeof g.then=="function"){var w=g,L=c,R=L.tag;if((L.mode&1)===0&&(R===0||R===11||R===15)){var M=L.alternate;M?(L.updateQueue=M.updateQueue,L.memoizedState=M.memoizedState,L.lanes=M.lanes):(L.updateQueue=null,L.memoizedState=null)}var V=Qu(i);if(V!==null){V.flags&=-257,Ju(V,i,c,a,t),V.mode&1&&Yu(a,w,t),t=V,g=w;var K=t.updateQueue;if(K===null){var Q=new Set;Q.add(g),t.updateQueue=Q}else K.add(g);break e}else{if((t&1)===0){Yu(a,w,t),Ns();break e}g=Error(s(426))}}else if(De&&c.mode&1){var Be=Qu(i);if(Be!==null){(Be.flags&65536)===0&&(Be.flags|=256),Ju(Be,i,c,a,t),$o(Mr(g,c));break e}}a=g=Mr(g,c),Ve!==4&&(Ve=2),kl===null?kl=[a]:kl.push(a),a=i;do{switch(a.tag){case 3:a.flags|=65536,t&=-t,a.lanes|=t;var y=Wu(a,g,t);vu(a,y);break e;case 1:c=g;var x=a.type,_=a.stateNode;if((a.flags&128)===0&&(typeof x.getDerivedStateFromError=="function"||_!==null&&typeof _.componentDidCatch=="function"&&(Tn===null||!Tn.has(_)))){a.flags|=65536,t&=-t,a.lanes|=t;var O=Ku(a,c,t);vu(a,O);break e}}a=a.return}while(a!==null)}Cc(n)}catch(J){t=J,Ue===n&&n!==null&&(Ue=n=n.return);continue}break}while(!0)}function Sc(){var e=ba.current;return ba.current=xa,e===null?xa:e}function Ns(){(Ve===0||Ve===3||Ve===2)&&(Ve=4),Ye===null||(qn&268435455)===0&&(Sa&268435455)===0||Mn(Ye,qe)}function Pa(e,t){var n=we;we|=2;var r=Sc();(Ye!==e||qe!==t)&&(sn=null,Zn(e,t));do try{Wf();break}catch(l){bc(e,l)}while(!0);if(Bo(),we=n,ba.current=r,Ue!==null)throw Error(s(261));return Ye=null,qe=0,Ve}function Wf(){for(;Ue!==null;)Ec(Ue)}function Kf(){for(;Ue!==null&&!eo();)Ec(Ue)}function Ec(e){var t=Tc(e.alternate,e,yt);e.memoizedProps=e.pendingProps,t===null?Cc(e):Ue=t,ys.current=null}function Cc(e){var t=e;do{var n=t.alternate;if(e=t.return,(t.flags&32768)===0){if(n=Of(n,t,yt),n!==null){Ue=n;return}}else{if(n=$f(n,t),n!==null){n.flags&=32767,Ue=n;return}if(e!==null)e.flags|=32768,e.subtreeFlags=0,e.deletions=null;else{Ve=6,Ue=null;return}}if(t=t.sibling,t!==null){Ue=t;return}Ue=t=e}while(t!==null);Ve===0&&(Ve=5)}function er(e,t,n){var r=Ee,l=At.transition;try{At.transition=null,Ee=1,Yf(e,t,n,r)}finally{At.transition=l,Ee=r}return null}function Yf(e,t,n,r){do Dr();while(Pn!==null);if((we&6)!==0)throw Error(s(327));n=e.finishedWork;var l=e.finishedLanes;if(n===null)return null;if(e.finishedWork=null,e.finishedLanes=0,n===e.current)throw Error(s(177));e.callbackNode=null,e.callbackPriority=0;var a=n.lanes|n.childLanes;if(Cp(e,a),e===Ye&&(Ue=Ye=null,qe=0),(n.subtreeFlags&2064)===0&&(n.flags&2064)===0||Ca||(Ca=!0,Pc(P,function(){return Dr(),null})),a=(n.flags&15990)!==0,(n.subtreeFlags&15990)!==0||a){a=At.transition,At.transition=null;var i=Ee;Ee=1;var c=we;we|=4,ys.current=null,Bf(e,n),hc(n,e),ff(No),Bl=!!Ao,No=Ao=null,e.current=n,Uf(n),to(),we=c,Ee=i,At.transition=a}else e.current=n;if(Ca&&(Ca=!1,Pn=e,Aa=l),a=e.pendingLanes,a===0&&(Tn=null),it(n.stateNode),ft(e,Re()),t!==null)for(r=e.onRecoverableError,n=0;n<t.length;n++)l=t[n],r(l.value,{componentStack:l.stack,digest:l.digest});if(Ea)throw Ea=!1,e=ks,ks=null,e;return(Aa&1)!==0&&e.tag!==0&&Dr(),a=e.pendingLanes,(a&1)!==0?e===bs?bl++:(bl=0,bs=e):bl=0,En(),null}function Dr(){if(Pn!==null){var e=gi(Aa),t=At.transition,n=Ee;try{if(At.transition=null,Ee=16>e?16:e,Pn===null)var r=!1;else{if(e=Pn,Pn=null,Aa=0,(we&6)!==0)throw Error(s(331));var l=we;for(we|=4,W=e.current;W!==null;){var a=W,i=a.child;if((W.flags&16)!==0){var c=a.deletions;if(c!==null){for(var g=0;g<c.length;g++){var w=c[g];for(W=w;W!==null;){var L=W;switch(L.tag){case 0:case 11:case 15:_l(8,L,a)}var R=L.child;if(R!==null)R.return=L,W=R;else for(;W!==null;){L=W;var M=L.sibling,V=L.return;if(dc(L),L===w){W=null;break}if(M!==null){M.return=V,W=M;break}W=V}}}var K=a.alternate;if(K!==null){var Q=K.child;if(Q!==null){K.child=null;do{var Be=Q.sibling;Q.sibling=null,Q=Be}while(Q!==null)}}W=a}}if((a.subtreeFlags&2064)!==0&&i!==null)i.return=a,W=i;else e:for(;W!==null;){if(a=W,(a.flags&2048)!==0)switch(a.tag){case 0:case 11:case 15:_l(9,a,a.return)}var y=a.sibling;if(y!==null){y.return=a.return,W=y;break e}W=a.return}}var x=e.current;for(W=x;W!==null;){i=W;var _=i.child;if((i.subtreeFlags&2064)!==0&&_!==null)_.return=i,W=_;else e:for(i=x;W!==null;){if(c=W,(c.flags&2048)!==0)try{switch(c.tag){case 0:case 11:case 15:ka(9,c)}}catch(J){Fe(c,c.return,J)}if(c===i){W=null;break e}var O=c.sibling;if(O!==null){O.return=c.return,W=O;break e}W=c.return}}if(we=l,En(),ce&&typeof ce.onPostCommitFiberRoot=="function")try{ce.onPostCommitFiberRoot(ve,e)}catch{}r=!0}return r}finally{Ee=n,At.transition=t}}return!1}function Ac(e,t,n){t=Mr(n,t),t=Wu(e,t,1),e=An(e,t,1),t=ot(),e!==null&&(Yr(e,1,t),ft(e,t))}function Fe(e,t,n){if(e.tag===3)Ac(e,e,n);else for(;t!==null;){if(t.tag===3){Ac(t,e,n);break}else if(t.tag===1){var r=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof r.componentDidCatch=="function"&&(Tn===null||!Tn.has(r))){e=Mr(n,e),e=Ku(t,e,1),t=An(t,e,1),e=ot(),t!==null&&(Yr(t,1,e),ft(t,e));break}}t=t.return}}function Qf(e,t,n){var r=e.pingCache;r!==null&&r.delete(t),t=ot(),e.pingedLanes|=e.suspendedLanes&n,Ye===e&&(qe&n)===n&&(Ve===4||Ve===3&&(qe&130023424)===qe&&500>Re()-ws?Zn(e,0):_s|=n),ft(e,t)}function Nc(e,t){t===0&&((e.mode&1)===0?t=1:(t=Il,Il<<=1,(Il&130023424)===0&&(Il=4194304)));var n=ot();e=ln(e,t),e!==null&&(Yr(e,t,n),ft(e,n))}function Jf(e){var t=e.memoizedState,n=0;t!==null&&(n=t.retryLane),Nc(e,n)}function Gf(e,t){var n=0;switch(e.tag){case 13:var r=e.stateNode,l=e.memoizedState;l!==null&&(n=l.retryLane);break;case 19:r=e.stateNode;break;default:throw Error(s(314))}r!==null&&r.delete(t),Nc(e,n)}var Tc;Tc=function(e,t,n){if(e!==null)if(e.memoizedProps!==t.pendingProps||ut.current)dt=!0;else{if((e.lanes&n)===0&&(t.flags&128)===0)return dt=!1,If(e,t,n);dt=(e.flags&131072)!==0}else dt=!1,De&&(t.flags&1048576)!==0&&iu(t,aa,t.index);switch(t.lanes=0,t.tag){case 2:var r=t.type;_a(e,t),e=t.pendingProps;var l=Sr(t,et.current);Pr(t,n),l=Xo(null,t,r,e,l,n);var a=Zo();return t.flags|=1,typeof l=="object"&&l!==null&&typeof l.render=="function"&&l.$$typeof===void 0?(t.tag=1,t.memoizedState=null,t.updateQueue=null,ct(r)?(a=!0,na(t)):a=!1,t.memoizedState=l.state!==null&&l.state!==void 0?l.state:null,Wo(t),l.updater=va,t.stateNode=l,l._reactInternals=t,as(t,r,e,n),t=us(null,t,r,!0,a,n)):(t.tag=0,De&&a&&Ro(t),at(null,t,l,n),t=t.child),t;case 16:r=t.elementType;e:{switch(_a(e,t),e=t.pendingProps,l=r._init,r=l(r._payload),t.type=r,l=t.tag=Xf(r),e=It(r,e),l){case 0:t=is(null,t,r,e,n);break e;case 1:t=tc(null,t,r,e,n);break e;case 11:t=Gu(null,t,r,e,n);break e;case 14:t=qu(null,t,r,It(r.type,e),n);break e}throw Error(s(306,r,""))}return t;case 0:return r=t.type,l=t.pendingProps,l=t.elementType===r?l:It(r,l),is(e,t,r,l,n);case 1:return r=t.type,l=t.pendingProps,l=t.elementType===r?l:It(r,l),tc(e,t,r,l,n);case 3:e:{if(nc(t),e===null)throw Error(s(387));r=t.pendingProps,a=t.memoizedState,l=a.element,xu(e,t),da(t,r,null,n);var i=t.memoizedState;if(r=i.element,a.isDehydrated)if(a={element:r,isDehydrated:!1,cache:i.cache,pendingSuspenseBoundaries:i.pendingSuspenseBoundaries,transitions:i.transitions},t.updateQueue.baseState=a,t.memoizedState=a,t.flags&256){l=Mr(Error(s(423)),t),t=rc(e,t,r,n,l);break e}else if(r!==l){l=Mr(Error(s(424)),t),t=rc(e,t,r,n,l);break e}else for(vt=kn(t.stateNode.containerInfo.firstChild),xt=t,De=!0,Dt=null,n=mu(t,null,r,n),t.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(Ar(),r===l){t=on(e,t,n);break e}at(e,t,r,n)}t=t.child}return t;case 5:return _u(t),e===null&&Oo(t),r=t.type,l=t.pendingProps,a=e!==null?e.memoizedProps:null,i=l.children,To(r,l)?i=null:a!==null&&To(r,a)&&(t.flags|=32),ec(e,t),at(e,t,i,n),t.child;case 6:return e===null&&Oo(t),null;case 13:return lc(e,t,n);case 4:return Ko(t,t.stateNode.containerInfo),r=t.pendingProps,e===null?t.child=Nr(t,null,r,n):at(e,t,r,n),t.child;case 11:return r=t.type,l=t.pendingProps,l=t.elementType===r?l:It(r,l),Gu(e,t,r,l,n);case 7:return at(e,t,t.pendingProps,n),t.child;case 8:return at(e,t,t.pendingProps.children,n),t.child;case 12:return at(e,t,t.pendingProps.children,n),t.child;case 10:e:{if(r=t.type._context,l=t.pendingProps,a=t.memoizedProps,i=l.value,je(ia,r._currentValue),r._currentValue=i,a!==null)if(Rt(a.value,i)){if(a.children===l.children&&!ut.current){t=on(e,t,n);break e}}else for(a=t.child,a!==null&&(a.return=t);a!==null;){var c=a.dependencies;if(c!==null){i=a.child;for(var g=c.firstContext;g!==null;){if(g.context===r){if(a.tag===1){g=an(-1,n&-n),g.tag=2;var w=a.updateQueue;if(w!==null){w=w.shared;var L=w.pending;L===null?g.next=g:(g.next=L.next,L.next=g),w.pending=g}}a.lanes|=n,g=a.alternate,g!==null&&(g.lanes|=n),Ho(a.return,n,t),c.lanes|=n;break}g=g.next}}else if(a.tag===10)i=a.type===t.type?null:a.child;else if(a.tag===18){if(i=a.return,i===null)throw Error(s(341));i.lanes|=n,c=i.alternate,c!==null&&(c.lanes|=n),Ho(i,n,t),i=a.sibling}else i=a.child;if(i!==null)i.return=a;else for(i=a;i!==null;){if(i===t){i=null;break}if(a=i.sibling,a!==null){a.return=i.return,i=a;break}i=i.return}a=i}at(e,t,l.children,n),t=t.child}return t;case 9:return l=t.type,r=t.pendingProps.children,Pr(t,n),l=Et(l),r=r(l),t.flags|=1,at(e,t,r,n),t.child;case 14:return r=t.type,l=It(r,t.pendingProps),l=It(r.type,l),qu(e,t,r,l,n);case 15:return Xu(e,t,t.type,t.pendingProps,n);case 17:return r=t.type,l=t.pendingProps,l=t.elementType===r?l:It(r,l),_a(e,t),t.tag=1,ct(r)?(e=!0,na(t)):e=!1,Pr(t,n),Hu(t,r,l),as(t,r,l,n),us(null,t,r,!0,e,n);case 19:return oc(e,t,n);case 22:return Zu(e,t,n)}throw Error(s(156,t.tag))};function Pc(e,t){return Un(e,t)}function qf(e,t,n,r){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=r,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Nt(e,t,n,r){return new qf(e,t,n,r)}function Ts(e){return e=e.prototype,!(!e||!e.isReactComponent)}function Xf(e){if(typeof e=="function")return Ts(e)?1:0;if(e!=null){if(e=e.$$typeof,e===Ce)return 11;if(e===ye)return 14}return 2}function zn(e,t){var n=e.alternate;return n===null?(n=Nt(e.tag,t,e.key,e.mode),n.elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=e.flags&14680064,n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n}function ja(e,t,n,r,l,a){var i=2;if(r=e,typeof e=="function")Ts(e)&&(i=1);else if(typeof e=="string")i=5;else e:switch(e){case D:return tr(n.children,l,a,t);case B:i=8,l|=8;break;case Y:return e=Nt(12,n,t,l|2),e.elementType=Y,e.lanes=a,e;case q:return e=Nt(13,n,t,l),e.elementType=q,e.lanes=a,e;case Ae:return e=Nt(19,n,t,l),e.elementType=Ae,e.lanes=a,e;case ge:return Ma(n,l,a,t);default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case xe:i=10;break e;case Te:i=9;break e;case Ce:i=11;break e;case ye:i=14;break e;case Pe:i=16,r=null;break e}throw Error(s(130,e==null?e:typeof e,""))}return t=Nt(i,n,t,l),t.elementType=e,t.type=r,t.lanes=a,t}function tr(e,t,n,r){return e=Nt(7,e,r,t),e.lanes=n,e}function Ma(e,t,n,r){return e=Nt(22,e,r,t),e.elementType=ge,e.lanes=n,e.stateNode={isHidden:!1},e}function Ps(e,t,n){return e=Nt(6,e,null,t),e.lanes=n,e}function js(e,t,n){return t=Nt(4,e.children!==null?e.children:[],e.key,t),t.lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}function Zf(e,t,n,r,l){this.tag=t,this.containerInfo=e,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=ro(0),this.expirationTimes=ro(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=ro(0),this.identifierPrefix=r,this.onRecoverableError=l,this.mutableSourceEagerHydrationData=null}function Ms(e,t,n,r,l,a,i,c,g){return e=new Zf(e,t,n,c,g),t===1?(t=1,a===!0&&(t|=8)):t=0,a=Nt(3,null,null,t),e.current=a,a.stateNode=e,a.memoizedState={element:r,isDehydrated:n,cache:null,transitions:null,pendingSuspenseBoundaries:null},Wo(a),e}function eg(e,t,n){var r=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:T,key:r==null?null:""+r,children:e,containerInfo:t,implementation:n}}function jc(e){if(!e)return Sn;e=e._reactInternals;e:{if(Lt(e)!==e||e.tag!==1)throw Error(s(170));var t=e;do{switch(t.tag){case 3:t=t.stateNode.context;break e;case 1:if(ct(t.type)){t=t.stateNode.__reactInternalMemoizedMergedChildContext;break e}}t=t.return}while(t!==null);throw Error(s(171))}if(e.tag===1){var n=e.type;if(ct(n))return au(e,n,t)}return t}function Mc(e,t,n,r,l,a,i,c,g){return e=Ms(n,r,!0,e,l,a,i,c,g),e.context=jc(null),n=e.current,r=ot(),l=jn(n),a=an(r,l),a.callback=t??null,An(n,a,l),e.current.lanes=l,Yr(e,l,r),ft(e,r),e}function za(e,t,n,r){var l=t.current,a=ot(),i=jn(l);return n=jc(n),t.context===null?t.context=n:t.pendingContext=n,t=an(a,i),t.payload={element:e},r=r===void 0?null:r,r!==null&&(t.callback=r),e=An(l,t,i),e!==null&&(Ft(e,l,i,a),ca(e,l,i)),i}function La(e){if(e=e.current,!e.child)return null;switch(e.child.tag){case 5:return e.child.stateNode;default:return e.child.stateNode}}function zc(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var n=e.retryLane;e.retryLane=n!==0&&n<t?n:t}}function zs(e,t){zc(e,t),(e=e.alternate)&&zc(e,t)}function tg(){return null}var Lc=typeof reportError=="function"?reportError:function(e){console.error(e)};function Ls(e){this._internalRoot=e}Ra.prototype.render=Ls.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(s(409));za(e,t,null,null)},Ra.prototype.unmount=Ls.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;Xn(function(){za(null,e,null,null)}),t[en]=null}};function Ra(e){this._internalRoot=e}Ra.prototype.unstable_scheduleHydration=function(e){if(e){var t=xi();e={blockedOn:null,target:e,priority:t};for(var n=0;n<yn.length&&t!==0&&t<yn[n].priority;n++);yn.splice(n,0,e),n===0&&_i(e)}};function Rs(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function Da(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11&&(e.nodeType!==8||e.nodeValue!==" react-mount-point-unstable "))}function Rc(){}function ng(e,t,n,r,l){if(l){if(typeof r=="function"){var a=r;r=function(){var w=La(i);a.call(w)}}var i=Mc(t,r,e,0,null,!1,!1,"",Rc);return e._reactRootContainer=i,e[en]=i.current,sl(e.nodeType===8?e.parentNode:e),Xn(),i}for(;l=e.lastChild;)e.removeChild(l);if(typeof r=="function"){var c=r;r=function(){var w=La(g);c.call(w)}}var g=Ms(e,0,!1,null,null,!1,!1,"",Rc);return e._reactRootContainer=g,e[en]=g.current,sl(e.nodeType===8?e.parentNode:e),Xn(function(){za(t,g,n,r)}),g}function Ia(e,t,n,r,l){var a=n._reactRootContainer;if(a){var i=a;if(typeof l=="function"){var c=l;l=function(){var g=La(i);c.call(g)}}za(t,i,e,l)}else i=ng(n,t,e,l,r);return La(i)}mi=function(e){switch(e.tag){case 3:var t=e.stateNode;if(t.current.memoizedState.isDehydrated){var n=Kr(t.pendingLanes);n!==0&&(lo(t,n|1),ft(t,Re()),(we&6)===0&&(Rr=Re()+500,En()))}break;case 13:Xn(function(){var r=ln(e,1);if(r!==null){var l=ot();Ft(r,e,1,l)}}),zs(e,1)}},ao=function(e){if(e.tag===13){var t=ln(e,134217728);if(t!==null){var n=ot();Ft(t,e,134217728,n)}zs(e,134217728)}},hi=function(e){if(e.tag===13){var t=jn(e),n=ln(e,t);if(n!==null){var r=ot();Ft(n,e,t,r)}zs(e,t)}},xi=function(){return Ee},vi=function(e,t){var n=Ee;try{return Ee=e,t()}finally{Ee=n}},jt=function(e,t,n){switch(t){case"input":if(Ut(e,n),t=n.name,n.type==="radio"&&t!=null){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+t)+'][type="radio"]'),t=0;t<n.length;t++){var r=n[t];if(r!==e&&r.form===e.form){var l=ea(r);if(!l)throw Error(s(90));Xe(r),Ut(r,l)}}}break;case"textarea":lr(e,n);break;case"select":t=n.value,t!=null&&Je(e,!!n.multiple,t,!1)}},Hr=Cs,qt=Xn;var rg={usingClientEntryPoint:!1,Events:[cl,kr,ea,Ml,Ur,Cs]},Sl={findFiberByHostInstance:Vn,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},lg={bundleType:Sl.bundleType,version:Sl.version,rendererPackageName:Sl.rendererPackageName,rendererConfig:Sl.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:ke.ReactCurrentDispatcher,findHostInstanceByFiber:function(e){return e=Wr(e),e===null?null:e.stateNode},findFiberByHostInstance:Sl.findFiberByHostInstance||tg,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var Oa=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Oa.isDisabled&&Oa.supportsFiber)try{ve=Oa.inject(lg),ce=Oa}catch{}}return st.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=rg,st.createPortal=function(e,t){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!Rs(t))throw Error(s(200));return eg(e,t,null,n)},st.createRoot=function(e,t){if(!Rs(e))throw Error(s(299));var n=!1,r="",l=Lc;return t!=null&&(t.unstable_strictMode===!0&&(n=!0),t.identifierPrefix!==void 0&&(r=t.identifierPrefix),t.onRecoverableError!==void 0&&(l=t.onRecoverableError)),t=Ms(e,1,!1,null,null,n,!1,r,l),e[en]=t.current,sl(e.nodeType===8?e.parentNode:e),new Ls(t)},st.findDOMNode=function(e){if(e==null)return null;if(e.nodeType===1)return e;var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(s(188)):(e=Object.keys(e).join(","),Error(s(268,e)));return e=Wr(t),e=e===null?null:e.stateNode,e},st.flushSync=function(e){return Xn(e)},st.hydrate=function(e,t,n){if(!Da(t))throw Error(s(200));return Ia(null,e,t,!0,n)},st.hydrateRoot=function(e,t,n){if(!Rs(e))throw Error(s(405));var r=n!=null&&n.hydratedSources||null,l=!1,a="",i=Lc;if(n!=null&&(n.unstable_strictMode===!0&&(l=!0),n.identifierPrefix!==void 0&&(a=n.identifierPrefix),n.onRecoverableError!==void 0&&(i=n.onRecoverableError)),t=Mc(t,null,e,1,n??null,l,!1,a,i),e[en]=t.current,sl(e),r)for(e=0;e<r.length;e++)n=r[e],l=n._getVersion,l=l(n._source),t.mutableSourceEagerHydrationData==null?t.mutableSourceEagerHydrationData=[n,l]:t.mutableSourceEagerHydrationData.push(n,l);return new Ra(t)},st.render=function(e,t,n){if(!Da(t))throw Error(s(200));return Ia(null,e,t,!1,n)},st.unmountComponentAtNode=function(e){if(!Da(e))throw Error(s(40));return e._reactRootContainer?(Xn(function(){Ia(null,null,e,!1,function(){e._reactRootContainer=null,e[en]=null})}),!0):!1},st.unstable_batchedUpdates=Cs,st.unstable_renderSubtreeIntoContainer=function(e,t,n,r){if(!Da(n))throw Error(s(200));if(e==null||e._reactInternals===void 0)throw Error(s(38));return Ia(e,t,n,!1,r)},st.version="18.3.1-next-f1338f8080-20240426",st}var Hs;function Uc(){if(Hs)return Ba.exports;Hs=1;function o(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(o)}catch(u){console.error(u)}}return o(),Ba.exports=Bc(),Ba.exports}var Vs;function Hc(){if(Vs)return El;Vs=1;var o=Uc();return El.createRoot=o.createRoot,El.hydrateRoot=o.hydrateRoot,El}var Vc=Hc();function Wc(){if(typeof window>"u")return!1;const o=window;return!!(o.SpeechRecognition||o.webkitSpeechRecognition)}function Kc(){if(typeof window>"u")return null;const o=window;return o.SpeechRecognition??o.webkitSpeechRecognition??null}function Yc(o){const u=Kc();if(!u)return o.onError("Voice input is not supported in this browser."),null;let s=new u;s.continuous=!0,s.interimResults=!0;try{s.lang=navigator.language||"en-US"}catch{s.lang="en-US"}let p=!1,v="";s.onresult=h=>{var k;let A="",S="";for(let N=h.resultIndex;N<h.results.length;N++){const j=h.results[N],C=((k=j[0])==null?void 0:k.transcript)??"";j.isFinal?S+=C:A+=C}S&&(v=(v+" "+S).trim()),o.onPartial((v+" "+A).trim())},s.onerror=h=>{const A=h.error??"unknown";p||(A==="no-speech"?o.onError("Voice: silence detected. Hold the mic and speak."):A==="not-allowed"||A==="service-not-allowed"?o.onError("Voice: microphone permission denied."):A==="aborted"||o.onError(`Voice error: ${A}`))},s.onend=()=>{p||v&&o.onCommit(v)};try{s.start()}catch(h){return o.onError(h instanceof Error?h.message:"Voice failed to start."),null}return{stop:()=>{try{s==null||s.stop()}catch{}},abort:()=>{p=!0;try{s==null||s.abort()}catch{}s=null}}}function Va(){return typeof navigator>"u"||!navigator.mediaDevices?!1:typeof navigator.mediaDevices.getUserMedia=="function"&&typeof MediaRecorder<"u"}function Qc(o,u,s={}){return(async()=>{if(!Va())return u.onError("Voice: this runtime does not expose MediaRecorder."),null;let p;try{p=await navigator.mediaDevices.getUserMedia({audio:!0})}catch(k){const N=k instanceof Error?k.message:"microphone unavailable";return u.onError(`Voice: microphone permission denied or device missing (${N}).`),null}let v=s.preferredMime??"audio/webm;codecs=opus";typeof MediaRecorder.isTypeSupported=="function"&&!MediaRecorder.isTypeSupported(v)&&(v=["audio/webm","audio/ogg;codecs=opus","audio/mp4"].find(j=>MediaRecorder.isTypeSupported(j))??"");const h=v?new MediaRecorder(p,{mimeType:v}):new MediaRecorder(p),A=[];let S=!1;h.addEventListener("dataavailable",k=>{k.data&&k.data.size>0&&A.push(k.data)}),h.addEventListener("stop",()=>{if(p.getTracks().forEach(N=>N.stop()),S||A.length===0)return;const k=new Blob(A,{type:v||"audio/webm"});k.arrayBuffer().then(N=>{const j=Jc(N);return u.onPartial("a transcrever…"),o.transcribeAudio(j,k.type||"audio/webm",s.language)}).then(N=>{if(S)return;const j=((N==null?void 0:N.text)??"").trim();j?u.onCommit(j):u.onError("Voice: silence detected — nada para transcrever.")}).catch(N=>{if(S)return;const j=N instanceof Error?N.message:String(N);u.onError(`Voice: ${j}`)})});try{h.start()}catch(k){return p.getTracks().forEach(N=>N.stop()),u.onError(k instanceof Error?k.message:"recorder failed to start"),null}return{stop:()=>{if(h.state==="recording")try{h.stop()}catch{}},abort:()=>{if(S=!0,h.state==="recording")try{h.stop()}catch{}p.getTracks().forEach(k=>k.stop())}}})()}function Jc(o){const u=new Uint8Array(o);let s="";const p=32768;for(let v=0;v<u.length;v+=p){const h=u.subarray(v,Math.min(v+p,u.length));s+=String.fromCharCode.apply(null,Array.from(h))}return btoa(s)}function Gc(o){const u=[],s=o.split(`
`);let p=0,v=[];function h(){v.length!==0&&(u.push({kind:"prose",body:v.join(`
`)}),v=[])}for(;p<s.length;){const A=s[p],S=A.match(/^```(\w[\w+-]*)?\s*$/);if(S){h();const k=S[1]||null;p++;const N=p;for(;p<s.length&&!s[p].match(/^```\s*$/);)p++;const j=s.slice(N,p).join(`
`);u.push({kind:"code",lang:k,body:j}),p++;continue}v.push(A),p++}return h(),u}const qc=[[/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/,(o,u)=>d.jsx("a",{href:o[2],target:"_blank",rel:"noopener noreferrer",className:"gauntlet-md__link",children:o[1]},`a-${u}`)],[/`([^`]+)`/,(o,u)=>d.jsx("code",{className:"gauntlet-md__inline-code",children:o[1]},`c-${u}`)],[/\*\*([^*]+)\*\*/,(o,u)=>d.jsx("strong",{className:"gauntlet-md__strong",children:o[1]},`b-${u}`)],[/\*([^*]+)\*/,(o,u)=>d.jsx("em",{className:"gauntlet-md__em",children:o[1]},`i-${u}`)],[/_([^_]+)_/,(o,u)=>d.jsx("em",{className:"gauntlet-md__em",children:o[1]},`u-${u}`)]];function Or(o,u){const s=[];let p=0,v=0;for(;p<o.length;){let h=null;for(const[A,S]of qc){const N=o.slice(p).match(A);!N||N.index===void 0||(h===null||N.index<h.idx)&&(h={idx:N.index,match:N,render:S})}if(h===null){s.push(o.slice(p));break}h.idx>0&&s.push(o.slice(p,p+h.idx)),s.push(h.render(h.match,u*100+v)),v++,p+=h.idx+h.match[0].length}return s}function Xc(o,u){const s=[],p=o.split(`
`);let v=0,h=u;for(;v<p.length;){const S=p[v].trim();if(!S){v++;continue}const k=S.match(/^(#{1,3})\s+(.*)$/);if(k){const j=k[1].length,U=`h${j}`;s.push(d.jsx(U,{className:`gauntlet-md__h gauntlet-md__h${j}`,children:Or(k[2],h++)},`h-${h++}`)),v++;continue}if(/^---+$/.test(S)||/^\*\*\*+$/.test(S)){s.push(d.jsx("hr",{className:"gauntlet-md__hr"},`hr-${h++}`)),v++;continue}if(S.startsWith(">")){const j=[];for(;v<p.length&&p[v].trim().startsWith(">");)j.push(p[v].replace(/^\s*>\s?/,"")),v++;s.push(d.jsx("blockquote",{className:"gauntlet-md__quote",children:Or(j.join(" "),h++)},`q-${h++}`));continue}if(/^[-*]\s+/.test(S)){const j=[];for(;v<p.length&&/^[-*]\s+/.test(p[v].trim());)j.push(p[v].trim().replace(/^[-*]\s+/,"")),v++;s.push(d.jsx("ul",{className:"gauntlet-md__list",children:j.map((C,U)=>d.jsx("li",{className:"gauntlet-md__li",children:Or(C,h++)},U))},`ul-${h++}`));continue}if(/^\d+\.\s+/.test(S)){const j=[];for(;v<p.length&&/^\d+\.\s+/.test(p[v].trim());)j.push(p[v].trim().replace(/^\d+\.\s+/,"")),v++;s.push(d.jsx("ol",{className:"gauntlet-md__list",children:j.map((C,U)=>d.jsx("li",{className:"gauntlet-md__li",children:Or(C,h++)},U))},`ol-${h++}`));continue}const N=[];for(;v<p.length;){const j=p[v],C=j.trim();if(!C||/^(#{1,3})\s+/.test(C)||/^---+$/.test(C)||/^\*\*\*+$/.test(C)||C.startsWith(">")||/^[-*]\s+/.test(C)||/^\d+\.\s+/.test(C))break;N.push(j),v++}s.push(d.jsx("p",{className:"gauntlet-md__p",children:Or(N.join(" "),h++)},`p-${h++}`))}return s}function Zc({source:o,onCopyBlock:u}){const s=Gc(o);return d.jsx("div",{className:"gauntlet-md",children:s.map((p,v)=>p.kind==="code"?d.jsx(ud,{lang:p.lang,body:p.body,onCopy:u},`cb-${v}`):d.jsx("div",{className:"gauntlet-md__prose",children:Xc(p.body,v*1e3)},`pb-${v}`))})}const ed=new Set(["def","class","if","elif","else","for","while","return","import","from","as","with","try","except","finally","raise","pass","break","continue","in","is","not","and","or","lambda","yield","async","await","global","nonlocal","True","False","None","self","cls","print"]),td=new Set(["function","const","let","var","if","else","return","class","export","import","from","as","default","async","await","for","while","try","catch","finally","throw","new","this","super","extends","implements","interface","type","enum","public","private","protected","readonly","static","typeof","instanceof","in","of","null","undefined","true","false","void","switch","case","break","continue","do","yield"]),nd=new Set(["cd","ls","cat","rm","mv","cp","mkdir","touch","grep","sed","awk","export","source","if","then","else","elif","fi","for","while","do","done","case","esac","exit","npm","npx","git","python","node","tsc","make","vite","wxt","set","get","start-process","select-string"]);function Ws(o,u){if(o[u]!=="#")return-1;const s=o.indexOf(`
`,u);return s===-1?o.length:s}function rd(o,u){if(o[u]!=="/")return-1;if(o[u+1]==="/"){const s=o.indexOf(`
`,u);return s===-1?o.length:s}if(o[u+1]==="*"){const s=o.indexOf("*/",u+2);return s===-1?o.length:s+2}return-1}const Ks={keywords:ed,matchComment:Ws},ld={keywords:td,matchComment:rd},ad={keywords:nd,matchComment:Ws};function od(o){if(!o)return null;const u=o.toLowerCase();return u==="py"||u==="python"||u==="python3"||u==="ipython"||u==="pycon"?Ks:u==="ts"||u==="tsx"||u==="typescript"||u==="js"||u==="jsx"||u==="javascript"||u==="mjs"||u==="json"||u==="json5"?ld:u==="sh"||u==="bash"||u==="zsh"||u==="shell"||u==="powershell"||u==="ps"||u==="ps1"||u==="console"?ad:null}function Ys(o){return o>="a"&&o<="z"||o>="A"&&o<="Z"||o==="_"||o==="$"}function sd(o){return Ys(o)||o>="0"&&o<="9"}function Wa(o){return o>="0"&&o<="9"}function id(o,u){const s=[];let p="";function v(){p&&(s.push({kind:"p",text:p}),p="")}let h=0;for(;h<o.length;){const A=o[h],S=u.matchComment(o,h);if(S!==-1){v(),s.push({kind:"c",text:o.slice(h,S)}),h=S;continue}if(u===Ks&&(o.startsWith('"""',h)||o.startsWith("'''",h))){v();const k=o.slice(h,h+3);let N=o.indexOf(k,h+3);N=N===-1?o.length:N+3,s.push({kind:"s",text:o.slice(h,N)}),h=N;continue}if(A==='"'||A==="'"||A==="`"){v();let k=h+1;for(;k<o.length&&o[k]!==A;){if(o[k]==="\\"){k+=2;continue}if(o[k]===`
`&&A!=="`")break;k++}const N=k<o.length?k+1:k;s.push({kind:"s",text:o.slice(h,N)}),h=N;continue}if(Wa(A)){v();let k=h;for(;k<o.length&&(Wa(o[k])||o[k]==="."||o[k]==="_");)k++;if(k<o.length&&(o[k]==="e"||o[k]==="E"))for(k++,k<o.length&&(o[k]==="+"||o[k]==="-")&&k++;k<o.length&&Wa(o[k]);)k++;s.push({kind:"n",text:o.slice(h,k)}),h=k;continue}if(Ys(A)){v();let k=h+1;for(;k<o.length&&sd(o[k]);)k++;const N=o.slice(h,k);let j=k;for(;j<o.length&&o[j]===" ";)j++;const C=o[j]==="(";let U="p";u.keywords.has(N)?U="k":C&&(U="f"),s.push({kind:U,text:N}),h=k;continue}p+=A,h++}return v(),s}function ud({lang:o,body:u,onCopy:s}){const p=()=>{navigator.clipboard.writeText(u).catch(()=>{}),s==null||s(u)},v=od(o),h=v?id(u,v):null;return d.jsxs("figure",{className:"gauntlet-md__code",children:[d.jsxs("header",{className:"gauntlet-md__code-meta",children:[d.jsx("span",{className:"gauntlet-md__code-lang",children:o??"code"}),d.jsx("button",{type:"button",className:"gauntlet-md__code-copy",onClick:p,"aria-label":"copy code",children:"copy"})]}),d.jsx("pre",{className:"gauntlet-md__code-body",children:h?d.jsx("code",{children:h.map((A,S)=>d.jsx("span",{className:`gauntlet-md__tok gauntlet-md__tok--${A.kind}`,children:A.text},S))}):d.jsx("code",{children:u})})]})}const cd={domains:{},actions:{},default_domain_policy:{allowed:!0,require_danger_ack:!1},default_action_policy:{allowed:!0,require_danger_ack:!1},tool_policies:{},max_page_text_chars:6e3,max_dom_skeleton_chars:4e3,screenshot_default:!1,execution_reporting_required:!1,updated_at:""},dd="2px solid #d07a5a",pd="2px",fd="#gauntlet-capsule-host",gd=[/\bpassword\b/i,/\bdelete\b/i,/\bdestroy\b/i,/\bremove\b/i,/\bunsubscribe\b/i,/payment|checkout|billing/i,/credit[-_ ]?card|\bccnum\b|\bcvv\b|\bcvc\b/i],md=["delete","remove","destroy","drop","discard","apagar","eliminar","remover","destruir","pay","buy","purchase","order","checkout","pagar","comprar","encomendar","confirm","submit","send","publish","enviar","confirmar","publicar","transfer","withdraw","transferir","levantar","cancel subscription","cancelar subscrição","cancelar assinatura"],hd=5e3;function xd(o){const u=o.filter(h=>h.type==="fill"),s=o.filter(h=>h.type==="click");if(u.length===0||s.length===0)return{danger:!1};const p=u.find(h=>{const A=h.selector.toLowerCase();return!!(/\bpassword\b/.test(A)||/\bcvv\b|\bcvc\b|\bccnum\b|credit[-_ ]?card/.test(A)||/payment|checkout|billing/.test(A)||/cc-(number|exp|csc|name)/.test(A))});if(!p)return{danger:!1};const v=s.find(h=>{const A=h.selector.toLowerCase();return!!(A.includes("submit")||/\b(pay|buy|purchase|confirm|send|order|checkout|pagar|comprar|enviar|confirmar)\b/.test(A))});return v?{danger:!0,reason:`cadeia destrutiva: fill em "${p.selector}" seguido de click em "${v.selector}"`}:{danger:!1}}function vd(o){var p;if(o.type==="highlight"||o.type==="scroll_to")return{danger:!1};const u=o.selector;for(const v of gd)if(v.test(u))return{danger:!0,reason:`selector matches /${v.source}/`};let s=null;try{s=document.querySelector(u)}catch{}if(o.type==="fill")return s instanceof HTMLInputElement&&s.type==="password"?{danger:!0,reason:"password field"}:s instanceof HTMLInputElement&&(((p=s.autocomplete)==null?void 0:p.includes("cc-"))??!1)?{danger:!0,reason:"credit-card autocomplete"}:o.value.length>hd?{danger:!0,reason:"unusually long value"}:{danger:!1};if(o.type==="click"){if(s instanceof HTMLButtonElement&&s.type==="submit")return{danger:!0,reason:"submit button"};if(s instanceof HTMLInputElement&&(s.type==="submit"||s.type==="reset"))return{danger:!0,reason:`${s.type} button`};if(s instanceof HTMLElement){const v=(s.innerText??"").trim().toLowerCase();if(v){for(const h of md)if(v===h||v.startsWith(h+" ")||v.endsWith(" "+h)||v.includes(" "+h+" "))return{danger:!0,reason:`action label: "${h}"`}}}return{danger:!1}}return{danger:!1}}async function yd(o){const u=[];for(const s of o)try{_d(s),await wd(s),u.push({action:s,ok:!0})}catch(p){u.push({action:s,ok:!1,error:p instanceof Error?p.message:String(p)})}return u}function _d(o){const u=o.selector;if(!u||typeof u!="string")throw new Error("selector missing or not a string");if(u.includes(fd))throw new Error(`selector targets the Gauntlet capsule itself: ${u}`);try{document.querySelector(u)}catch{throw new Error(`selector is not valid CSS: ${u}`)}}async function wd(o){if(o.type==="fill"){kd(o.selector,o.value);return}if(o.type==="click"){bd(o.selector);return}if(o.type==="highlight"){Sd(o.selector,o.duration_ms??1500);return}if(o.type==="scroll_to"){Ed(o.selector);return}throw new Error(`unknown action type: ${o.type??"<missing>"}`)}function kd(o,u){var p,v;const s=document.querySelector(o);if(!s)throw new Error(`selector not found: ${o}`);if(s instanceof HTMLInputElement||s instanceof HTMLTextAreaElement){s.focus({preventScroll:!0});const h=s instanceof HTMLInputElement?HTMLInputElement.prototype:HTMLTextAreaElement.prototype,A=(p=Object.getOwnPropertyDescriptor(h,"value"))==null?void 0:p.set;A?A.call(s,u):s.value=u,s.dispatchEvent(new Event("input",{bubbles:!0})),s.dispatchEvent(new Event("change",{bubbles:!0})),s.dispatchEvent(new Event("blur",{bubbles:!0}));return}if(s instanceof HTMLSelectElement){s.focus({preventScroll:!0});const h=(v=Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,"value"))==null?void 0:v.set;h?h.call(s,u):s.value=u,s.dispatchEvent(new Event("input",{bubbles:!0})),s.dispatchEvent(new Event("change",{bubbles:!0})),s.dispatchEvent(new Event("blur",{bubbles:!0}));return}if(s instanceof HTMLElement&&s.isContentEditable){s.focus(),s.textContent=u,s.dispatchEvent(new InputEvent("input",{bubbles:!0}));return}throw new Error(`element at ${o} is not fillable`)}function bd(o){const u=document.querySelector(o);if(!u)throw new Error(`selector not found: ${o}`);if(!(u instanceof HTMLElement))throw new Error(`element at ${o} is not clickable`);const s=u.getBoundingClientRect(),p=s.left+s.width/2,v=s.top+s.height/2,h={bubbles:!0,cancelable:!0,view:window,clientX:p,clientY:v,button:0,buttons:1},A={...h,pointerId:1,pointerType:"mouse",isPrimary:!0};u.dispatchEvent(new PointerEvent("pointerdown",A)),u.dispatchEvent(new MouseEvent("mousedown",h)),u.focus({preventScroll:!0}),u.dispatchEvent(new PointerEvent("pointerup",A)),u.dispatchEvent(new MouseEvent("mouseup",h)),u.click()}function Sd(o,u){const s=document.querySelectorAll(o);if(s.length===0)throw new Error(`selector not found: ${o}`);for(const p of Array.from(s)){if(!(p instanceof HTMLElement))continue;const v=p.style.outline,h=p.style.outlineOffset;p.style.outline=dd,p.style.outlineOffset=pd,window.setTimeout(()=>{p.style.outline=v,p.style.outlineOffset=h},u)}}function Ed(o){const u=document.querySelector(o);if(!u)throw new Error(`selector not found: ${o}`);if(!(u instanceof HTMLElement))throw new Error(`element at ${o} cannot be scrolled to`);u.scrollIntoView({behavior:"smooth",block:"center"})}const Ka={},Cd=((typeof{url:Yt&&Yt.tagName.toUpperCase()==="SCRIPT"&&Yt.src||new URL("content-scripts/content.js",document.baseURI).href}<"u"?Ka==null?void 0:Ka.VITE_BACKEND_URL:void 0)??"https://ruberra-backend-jkpf-production.up.railway.app").replace(/\/+$/,"");class Ad{constructor(u,s={}){this.ambient=u,this.backendUrl=(s.backendUrl??Cd).replace(/\/+$/,"")}captureContext(u,s){return this.ambient.transport.fetchJson("POST",`${this.backendUrl}/composer/context`,u,s)}detectIntent(u,s,p){return this.ambient.transport.fetchJson("POST",`${this.backendUrl}/composer/intent`,{context_id:u,user_input:s},p)}generatePreview(u,s){return this.ambient.transport.fetchJson("POST",`${this.backendUrl}/composer/preview`,{intent_id:u},s)}applyPreview(u,s,p,v){return this.ambient.transport.fetchJson("POST",`${this.backendUrl}/composer/apply`,{preview_id:u,approved:s,approval_reason:p??null},v)}async getToolManifests(u){return(await this.ambient.transport.fetchJson("GET",`${this.backendUrl}/tools/manifests`,void 0,u)).tools??[]}getSettings(u){return this.ambient.transport.fetchJson("GET",`${this.backendUrl}/composer/settings`,void 0,u)}updateSettings(u,s){return this.ambient.transport.fetchJson("PUT",`${this.backendUrl}/composer/settings`,u,s)}reportExecution(u,s){return this.ambient.transport.fetchJson("POST",`${this.backendUrl}/composer/execution`,u,s)}transcribeAudio(u,s,p,v){return this.ambient.transport.fetchJson("POST",`${this.backendUrl}/voice/transcribe`,{audio_base64:u,mime:s,language:p},v)}synthesizeSpeech(u,s,p){return this.ambient.transport.fetchJson("POST",`${this.backendUrl}/voice/synthesize`,{text:u,voice:s},p)}requestDomPlan(u,s,p){return this.ambient.transport.fetchJson("POST",`${this.backendUrl}/composer/dom_plan`,{context_id:u,user_input:s},p)}requestDomPlanStream(u,s,p){return this.ambient.transport.stream?this.ambient.transport.stream(`${this.backendUrl}/composer/dom_plan_stream`,{context_id:u,user_input:s},p):(p.onError("streaming not supported by this ambient"),()=>{})}}const Qs="gauntlet:pill_position",Ya="gauntlet:dismissed_domains",Js="gauntlet:screenshot_enabled",Gs="gauntlet:theme",qs="gauntlet:palette_recent",Xs="gauntlet:pill_mode",Zs="gauntlet:tts_enabled",ei=8,ti="light",ni="corner",ri={bottom:16,right:16};function li(o){const u=typeof window<"u"?window.innerWidth:1280,s=typeof window<"u"?window.innerHeight:800,p=4,v=u-p,h=s-p;return{right:Math.max(-14,Math.min(v,o.right)),bottom:Math.max(-14,Math.min(h,o.bottom))}}function ai(o){return{async readPillPosition(){const u=await o.get(Qs);return u&&typeof u=="object"&&typeof u.bottom=="number"&&typeof u.right=="number"?li(u):ri},async writePillPosition(u){await o.set(Qs,li(u))},async readDismissedDomains(){const u=await o.get(Ya);return Array.isArray(u)?u.filter(s=>typeof s=="string"):[]},async dismissDomain(u){if(!u)return;const s=await this.readDismissedDomains();s.includes(u)||await o.set(Ya,[...s,u])},async restoreDomain(u){if(!u)return;const s=await this.readDismissedDomains(),p=s.filter(v=>v!==u);p.length!==s.length&&await o.set(Ya,p)},async isDomainDismissed(u){return u?(await this.readDismissedDomains()).includes(u):!1},async readScreenshotEnabled(){return await o.get(Js)===!0},async writeScreenshotEnabled(u){await o.set(Js,!!u)},async readTheme(){const u=await o.get(Gs);return u==="dark"||u==="light"?u:ti},async writeTheme(u){await o.set(Gs,u)},async readPaletteRecent(){const u=await o.get(qs);return Array.isArray(u)?u.filter(s=>typeof s=="string").slice(0,ei):[]},async notePaletteUse(u){if(!u)return;const s=await this.readPaletteRecent(),p=[u,...s.filter(v=>v!==u)].slice(0,ei);await o.set(qs,p)},async readPillMode(){const u=await o.get(Xs);return u==="cursor"||u==="corner"?u:ni},async writePillMode(u){await o.set(Xs,u)},async readTtsEnabled(){return await o.get(Zs)===!0},async writeTtsEnabled(u){await o.set(Zs,!!u)}}}function Nd({ambient:o,initialSnapshot:u,onDismiss:s,cursorAnchor:p}){var Re,Rl,gr;const v=b.useMemo(()=>new Ad(o),[o]),h=b.useMemo(()=>ai(o.storage),[o]),A=(Re=o.domActions)==null?void 0:Re.execute,[S,k]=b.useState(u),[N,j]=b.useState(""),[C,U]=b.useState("idle"),[ue,le]=b.useState(null),[ne,ie]=b.useState(!1),[z,Se]=b.useState(null),[Ne,ke]=b.useState(null),[F,T]=b.useState(!1),[D,B]=b.useState(""),[Y,xe]=b.useState(!1),[Te,Ce]=b.useState(ti),[q,Ae]=b.useState([]),[ye,Pe]=b.useState([]),[ge,$]=b.useState(0),[G,I]=b.useState(!1),f=b.useRef(!1),E=b.useRef(null),[ee,ae]=b.useState(!1),pe=b.useRef(""),[fe,oe]=b.useState(null),[de,he]=b.useState([]),[Le,lt]=b.useState(null),[Xe,dn]=b.useState(cd),Ze=b.useRef(null),rr=b.useRef(null),Bt=b.useRef(null),Ut=b.useRef(""),Rn=b.useRef(!1),[Fr,pn]=b.useState(0),Je=b.useRef(null),[fn,Jt]=b.useState(!1),[lr,We]=b.useState(!1),[ar,or]=b.useState(null),[Gt,gn]=b.useState(0),Tt=b.useMemo(()=>z?z.actions.map(vd):[],[z]),wt=b.useMemo(()=>z?xd(z.actions):{danger:!1},[z]),sr=b.useMemo(()=>{if(!z||z.actions.length===0)return{forced:!1,reason:null};let m="";try{m=new URL(S.url).hostname.toLowerCase()}catch{}if((Xe.domains[m]??Xe.default_domain_policy).require_danger_ack)return{forced:!0,reason:m?`policy: domain '${m}' requires explicit confirmation`:"policy: default domain policy requires explicit confirmation"};for(const H of z.actions)if((Xe.actions[H.type]??Xe.default_action_policy).require_danger_ack)return{forced:!0,reason:`policy: action type '${H.type}' requires explicit confirmation`};return{forced:!1,reason:null}},[z,S.url,Xe]),Pt=Tt.some(m=>m.danger)||wt.danger||sr.forced;b.useEffect(()=>{var m;return(m=Ze.current)==null||m.focus(),()=>{var P,H;(P=rr.current)==null||P.abort(),(H=Bt.current)==null||H.call(Bt)}},[]),b.useEffect(()=>{k(u)},[u]),b.useEffect(()=>{let m=!1;return v.getToolManifests().then(P=>{m||Ae(P)}).catch(()=>{}),h.readPaletteRecent().then(P=>{m||Pe(P)}),()=>{m=!0}},[v,h]),b.useEffect(()=>{const m=!!S.text;m&&!f.current&&(I(!0),E.current!==null&&window.clearTimeout(E.current),E.current=window.setTimeout(()=>{I(!1),E.current=null},700)),f.current=m},[S.text]),b.useEffect(()=>()=>{E.current!==null&&(window.clearTimeout(E.current),E.current=null)},[]),b.useEffect(()=>{let m=!1;h.readTtsEnabled().then(H=>{m||ae(H)});function P(H){const re=H.detail;typeof(re==null?void 0:re.enabled)=="boolean"&&ae(re.enabled)}return window.addEventListener("gauntlet:tts",P),()=>{m=!0,window.removeEventListener("gauntlet:tts",P)}},[h]),b.useEffect(()=>{if(!ee||C!=="plan_ready")return;const m=z==null?void 0:z.compose;if(m&&m!==pe.current&&!(typeof window>"u"||!window.speechSynthesis))try{window.speechSynthesis.cancel();const P=new SpeechSynthesisUtterance(m);P.rate=1.05,P.pitch=1,window.speechSynthesis.speak(P),pe.current=m}catch{}},[ee,C,z==null?void 0:z.compose]),b.useEffect(()=>()=>{var m;try{(m=window.speechSynthesis)==null||m.cancel()}catch{}},[]),b.useEffect(()=>{let m=!1;return h.readTheme().then(P=>{m||Ce(P)}),()=>{m=!0}},[h]),b.useEffect(()=>{let m=!1;return v.getSettings().then(P=>{m||dn(P)}).catch(()=>{}),()=>{m=!0}},[v]),b.useEffect(()=>{if(!o.capabilities.screenshot||!o.screenshot)return;let m=!1;return h.readScreenshotEnabled().then(P=>{const H=P||Xe.screenshot_default;m||!H||o.screenshot.capture().then(re=>{m||!re||oe(re)}).catch(()=>{})}),()=>{m=!0}},[o,h,Xe.screenshot_default]);const Br=b.useCallback(()=>{k(o.selection.read())},[o]),qa=b.useCallback(()=>{if(Je.current)return;le(null);const m=N,P={onPartial:re=>{j(m?`${m} ${re}`.trim():re)},onCommit:re=>{var ve;j(m?`${m} ${re}`.trim():re),Jt(!1),Je.current=null,(ve=Ze.current)==null||ve.focus()},onError:re=>{le(re),Jt(!1),Je.current=null}};if(o.capabilities.remoteVoice&&Va()){Jt(!0),Qc(v,P).then(re=>{re?Je.current=re:Jt(!1)});return}const H=Yc(P);H&&(Je.current=H,Jt(!0))},[N,o,v]),ir=b.useCallback(()=>{var m;(m=Je.current)==null||m.stop()},[]),ur=b.useCallback(()=>{var m;(m=Je.current)==null||m.abort(),Je.current=null,Jt(!1)},[]);b.useEffect(()=>()=>{var m;(m=Je.current)==null||m.abort()},[]),b.useEffect(()=>{function m(P){(P.metaKey||P.ctrlKey)&&(P.key==="k"||P.key==="K")&&(P.preventDefault(),P.stopPropagation(),We(re=>!re))}return window.addEventListener("keydown",m,!0),()=>window.removeEventListener("keydown",m,!0)},[]);const Dn=b.useCallback(m=>{or(m),window.setTimeout(()=>or(null),1400)},[]),cr=b.useCallback(async()=>{const m=(z==null?void 0:z.compose)||S.text||N.trim();if(!m){le("Nada para guardar — escreve um pedido ou recebe uma resposta.");return}const P=(N.trim()||S.pageTitle||"cápsula note").slice(0,200);try{await o.transport.fetchJson("POST",`${v.backendUrl}/memory/records`,{topic:P,body:m,kind:"note",scope:"user"}),Dn("saved")}catch(H){le(H instanceof Error?`memória: ${H.message}`:"memória: falhou")}},[o,v,z,S,N,Dn]),jt=b.useCallback(async(m,P=[],H)=>{if(!z||z.actions.length===0)return;Rn.current=!0;const re=z.actions.map((ce,it)=>{const te=P[it],_e=Tt[it];return{action:ce,ok:te?te.ok:!1,error:(te==null?void 0:te.error)??null,danger:(_e==null?void 0:_e.danger)??!1,danger_reason:(_e==null?void 0:_e.reason)??null}}),ve={plan_id:z.plan_id||null,context_id:z.context_id||null,url:S.url||null,page_title:S.pageTitle||null,status:m,results:re,has_danger:Pt,sequence_danger_reason:wt.danger?wt.reason??null:null,danger_acknowledged:F,error:H??null,model_used:z.model_used||null,plan_latency_ms:z.latency_ms||null,user_input:N.trim()||null};if(Xe.execution_reporting_required)try{await v.reportExecution(ve)}catch(ce){const it=ce instanceof Error?ce.message:String(ce);le(`policy: execution report rejected — ${it}`),U("error")}else v.reportExecution(ve).catch(()=>{})},[v,z,S,Tt,Pt,wt,F,N,Xe.execution_reporting_required]),gt=b.useCallback(()=>{z&&z.actions.length>0&&!Rn.current&&jt("rejected"),s()},[z,s,jt]);b.useEffect(()=>{function m(P){if(P.key==="Escape"){if(P.preventDefault(),P.stopPropagation(),lr){We(!1);return}if(Je.current){ur();return}gt()}}return window.addEventListener("keydown",m,!0),()=>window.removeEventListener("keydown",m,!0)},[gt,lr,ur]);const Mt=b.useCallback(async()=>{const m=o.filesystem;if(m){lt(null);try{const P=await m.pickFile();if(!P)return;const H=P.name.toLowerCase();if(/\.(png|jpe?g|gif|webp|svg)$/.test(H)){const{base64:ve,mime:ce}=await m.readFileBase64(P.path),it=Math.ceil(ve.length*3/4);he(te=>[...te,{id:`att-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,kind:"image",name:P.name,mime:ce,bytes:it,base64:ve,path:P.path}])}else{const ve=await m.readTextFile(P.path);he(ce=>[...ce,{id:`att-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,kind:"text",name:P.name,mime:"text/plain",bytes:new TextEncoder().encode(ve).length,text:ve,path:P.path}])}}catch(P){lt(P instanceof Error?P.message:String(P))}}},[o]),In=b.useCallback(async()=>{var P;const m=(P=o.screenshot)==null?void 0:P.captureScreen;if(m){lt(null);try{const H=await m();if(!H){lt("Captura de ecrã indisponível neste sistema.");return}const re=Math.ceil(H.base64.length*3/4);he(ve=>[...ve,{id:`att-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,kind:"image",name:`ecrã-${new Date().toISOString().slice(11,19)}.png`,mime:"image/png",bytes:re,base64:H.base64,path:H.path}])}catch(H){lt(H instanceof Error?H.message:String(H))}}},[o]),Ml=b.useCallback(m=>{he(P=>P.filter(H=>H.id!==m))},[]),[Ur,Hr]=b.useState(null),[qt,On]=b.useState(!1),[$n,Fn]=b.useState(""),[mt,Xt]=b.useState(null),[Vr,mn]=b.useState(!1),Bn=b.useCallback(async()=>{const m=o.shellExec;if(!m)return;const P=$n.trim();if(!P)return;const H=P.split(/\s+/),re=H[0],ve=H.slice(1);mn(!0),Xt(null);try{const ce=await m.run(re,ve);Xt({cmd:P,stdout:ce.stdout,stderr:ce.stderr,exitCode:ce.exitCode,durationMs:ce.durationMs})}catch(ce){Xt({cmd:P,stdout:"",stderr:ce instanceof Error?ce.message:String(ce),exitCode:null,durationMs:0})}finally{mn(!1)}},[o,$n]),Zt=b.useCallback(async()=>{const m=o.filesystem;if(!(m!=null&&m.pickSavePath)||!m.writeTextFile)return;const P=(z==null?void 0:z.compose)??"";if(P.trim()){lt(null);try{const re=`${(S.pageTitle||"gauntlet-compose").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,60)||"gauntlet-compose"}.md`,ve=await m.pickSavePath(re,["md","txt","json"]);if(!ve)return;const ce=await m.writeTextFile(ve,P);Hr(`${ve.split(/[\\/]/).pop()??"ficheiro"} (${ce<1024?`${ce} B`:`${Math.round(ce/1024)} KB`})`),window.setTimeout(()=>Hr(null),2500)}catch(H){lt(H instanceof Error?H.message:String(H))}}},[o,z,S.pageTitle]),dr=b.useCallback(m=>{if(de.length===0)return m;const P=[];for(const H of de)if(H.kind==="text"&&H.text!=null)P.push(`<file name="${H.name}" path="${H.path??""}">
${H.text}
</file>`);else if(H.kind==="image"){const re=Math.max(1,Math.round(H.bytes/1024));P.push(`<image name="${H.name}" bytes="${H.bytes}" mime="${H.mime}">[${re} KB image attached — describe in prompt; multimodal payload arrives in A2]</image>`)}return`${P.join(`

`)}

${m}`},[de]),pr=b.useCallback(async()=>{var re,ve;if(!N.trim()||C==="planning"||C==="streaming"||C==="executing")return;z&&z.actions.length>0&&!Rn.current&&jt("rejected"),(re=rr.current)==null||re.abort(),(ve=Bt.current)==null||ve.call(Bt);const m=new AbortController;rr.current=m,U("planning"),le(null),Se(null),ke(null),T(!1),ie(!1),B(""),pn(0),Ut.current="",Rn.current=!1;const P=await h.readScreenshotEnabled(),H=Ld(S,P?fe:null);try{const ce=await v.captureContext(H,m.signal);if(m.signal.aborted)return;const it=dr(N.trim());Bt.current=v.requestDomPlanStream(ce.context_id,it,{onDelta:te=>{if(m.signal.aborted)return;Ut.current+=te,pn($e=>$e+1);const _e=zd(Ut.current);_e!==null?(B(_e),U($e=>$e==="planning"?"streaming":$e)):U($e=>$e==="planning"?"streaming":$e)},onDone:te=>{m.signal.aborted||(Se(te),U("plan_ready"),B(""),Ut.current="")},onError:te=>{m.signal.aborted||(async()=>{try{const _e=await v.requestDomPlan(ce.context_id,it,m.signal);if(m.signal.aborted)return;Se(_e),U("plan_ready"),B(""),Ut.current=""}catch(_e){if(m.signal.aborted)return;const $e=_e instanceof Error?_e.message:String(_e);le(`stream: ${te} · fallback: ${$e}`),U("error"),B(""),Ut.current=""}})()}})}catch(ce){if(m.signal.aborted)return;le(ce instanceof Error?ce.message:String(ce)),U("error")}},[v,S,fe,N,C,z,jt,dr,h]),Xa=b.useCallback(m=>{var P;m.preventDefault(),$(H=>H+1);try{(P=window.speechSynthesis)==null||P.cancel()}catch{}pe.current="",pr()},[pr]),zt=b.useMemo(()=>N.startsWith("/")?N.split(`
`,1)[0].slice(1).toLowerCase():null,[N]),Lt=b.useMemo(()=>{var P,H;const m=[];return o.capabilities.filesystemRead&&o.filesystem&&m.push({id:"anexar",label:"/anexar",hint:"Anexar ficheiro local",run:()=>void Mt()}),o.capabilities.screenCapture&&((P=o.screenshot)!=null&&P.captureScreen)&&m.push({id:"ecra",label:"/ecrã",hint:"Capturar ecrã inteiro",run:()=>void In()}),o.capabilities.shellExecute&&o.shellExec&&m.push({id:"shell",label:"/shell",hint:qt?"Fechar shell rápida":"Abrir shell rápida",run:()=>On(re=>!re)}),o.capabilities.filesystemWrite&&((H=o.filesystem)!=null&&H.writeTextFile)&&(z!=null&&z.compose)&&m.push({id:"guardar",label:"/guardar",hint:"Guardar resposta para ficheiro",run:()=>void Zt()}),m.push({id:"limpar",label:"/limpar",hint:"Esvaziar input",run:()=>{var re;j(""),(re=Ze.current)==null||re.focus()}}),m.push({id:"fechar",label:"/fechar",hint:"Dispensar cápsula",run:()=>gt()}),m.push({id:"palette",label:"/palette",hint:"Abrir command palette completa (⌘K)",run:()=>{j(""),We(!0)}}),m},[o,Mt,In,gt,z,Zt,qt]),kt=b.useMemo(()=>zt===null?[]:zt===""?Lt:Lt.filter(m=>m.id.startsWith(zt)||m.label.includes(zt)),[Lt,zt]);b.useEffect(()=>{gn(0)},[zt]);const fr=b.useCallback(m=>{const P=kt[m];P&&(j(""),gn(0),P.run())},[kt]),Za=b.useCallback(m=>{if(zt!==null&&kt.length>0){if(m.key==="ArrowDown"){m.preventDefault(),gn(P=>(P+1)%kt.length);return}if(m.key==="ArrowUp"){m.preventDefault(),gn(P=>(P-1+kt.length)%kt.length);return}if(m.key==="Enter"&&!m.shiftKey){m.preventDefault(),fr(Gt);return}if(m.key==="Escape"){m.preventDefault(),j("");return}}m.key==="Enter"&&(m.shiftKey||(m.preventDefault(),pr()))},[pr,fr,Gt,kt,zt]),Wr=b.useCallback(async()=>{if(z!=null&&z.compose)try{await navigator.clipboard.writeText(z.compose),ie(!0),window.setTimeout(()=>ie(!1),1500)}catch{le("Clipboard write blocked. Select the text and copy manually.")}},[z]),zl=b.useCallback(async()=>{if(!(!A||!z||z.actions.length===0)&&!(Pt&&!F)){U("executing"),le(null);try{const m=await A(z.actions);ke(m),U("executed");const P=m.every(H=>H.ok);window.dispatchEvent(new CustomEvent("gauntlet:execute-result",{detail:{ok:P}})),await jt("executed",m)}catch(m){const P=m instanceof Error?m.message:String(m);le(P),U("error"),window.dispatchEvent(new CustomEvent("gauntlet:execute-result",{detail:{ok:!1}})),await jt("failed",[],P)}}},[A,z,Pt,F,jt]),Un=b.useMemo(()=>S.bbox?S.bbox:p?{x:p.x,y:p.y,width:0,height:0}:null,[S.bbox,p]),Ll=b.useMemo(()=>{if(!Un)return;const m=typeof window<"u"?window.innerWidth:1280,P=typeof window<"u"?window.innerHeight:800,H=Dd(m,P),re=Id(Un,{width:m,height:P},H);return{top:`${re.top}px`,left:`${re.left}px`}},[Un]),eo=`gauntlet-capsule--phase-${C}`,to=["gauntlet-capsule","gauntlet-capsule--floating",Un?"gauntlet-capsule--anchored":"gauntlet-capsule--centered",S.text?null:"gauntlet-capsule--no-selection",eo].filter(Boolean).join(" ");return b.useEffect(()=>{window.dispatchEvent(new CustomEvent("gauntlet:phase",{detail:{phase:C}}))},[C]),d.jsxs("div",{className:to,"data-theme":Te,role:"dialog","aria-label":"Gauntlet",style:Ll,children:[d.jsx("div",{className:"gauntlet-capsule__aurora","aria-hidden":!0}),d.jsxs("div",{className:"gauntlet-capsule__layout",children:[d.jsxs("div",{className:"gauntlet-capsule__panel gauntlet-capsule__panel--left",children:[d.jsxs("header",{className:"gauntlet-capsule__header",children:[d.jsxs("div",{className:"gauntlet-capsule__brand-block",children:[d.jsx("span",{className:"gauntlet-capsule__mark","aria-hidden":!0,children:d.jsx("span",{className:"gauntlet-capsule__mark-dot"})}),d.jsxs("div",{className:"gauntlet-capsule__brand-text",children:[d.jsx("span",{className:"gauntlet-capsule__brand",children:"GAUNTLET"}),d.jsx("span",{className:"gauntlet-capsule__tagline",children:"cursor · capsule"})]})]}),d.jsxs("div",{className:"gauntlet-capsule__header-actions",children:[d.jsx("button",{type:"button",className:"gauntlet-capsule__settings-btn",onClick:()=>xe(m=>!m),"aria-label":"Definições","aria-expanded":Y,title:"Definições",children:d.jsx("span",{"aria-hidden":!0,children:"···"})}),d.jsx("button",{type:"button",className:"gauntlet-capsule__close",onClick:gt,"aria-label":"Dismiss capsule (Esc)",children:d.jsx("span",{"aria-hidden":!0,children:"esc"})})]})]}),Y&&d.jsx(Md,{onClose:()=>xe(!1),showScreenshot:o.capabilities.screenshot,showDismissedDomains:o.capabilities.dismissDomain,showPillMode:o.capabilities.pillSurface,prefs:h,theme:Te,onChangeTheme:m=>{Ce(m),h.writeTheme(m)}}),d.jsxs("section",{className:"gauntlet-capsule__context",children:[d.jsxs("div",{className:"gauntlet-capsule__context-meta",children:[d.jsx("span",{className:`gauntlet-capsule__source${G?" gauntlet-capsule__source--popped":""}`,children:"browser"}),d.jsx("span",{className:"gauntlet-capsule__url",title:S.url,children:S.pageTitle||S.url}),d.jsx("button",{type:"button",className:"gauntlet-capsule__refresh",onClick:Br,title:"Re-read current selection",children:"re-read"})]}),S.text?d.jsx("pre",{className:"gauntlet-capsule__selection",children:oi(S.text,600)}):d.jsx(jd,{snapshot:S,screenshotEnabled:fe!==null})]})]}),d.jsxs("div",{className:"gauntlet-capsule__panel gauntlet-capsule__panel--right",children:[d.jsxs("form",{className:"gauntlet-capsule__form",onSubmit:Xa,children:[de.length>0&&d.jsx("div",{className:"gauntlet-capsule__attachments","aria-label":"Anexos",children:de.map(m=>d.jsxs("span",{className:`gauntlet-capsule__attachment gauntlet-capsule__attachment--${m.kind}`,title:m.path??m.name,children:[d.jsx("span",{className:"gauntlet-capsule__attachment-icon","aria-hidden":!0,children:m.kind==="image"?"◫":"⌥"}),d.jsx("span",{className:"gauntlet-capsule__attachment-name",children:m.name}),d.jsx("span",{className:"gauntlet-capsule__attachment-size",children:m.bytes<1024?`${m.bytes} B`:m.bytes<1048576?`${Math.round(m.bytes/1024)} KB`:`${(m.bytes/1048576).toFixed(1)} MB`}),d.jsx("button",{type:"button",className:"gauntlet-capsule__attachment-remove",onClick:()=>Ml(m.id),"aria-label":`Remover ${m.name}`,children:"×"})]},m.id))}),Le&&d.jsx("div",{className:"gauntlet-capsule__attach-error",role:"alert",children:Le}),qt&&o.shellExec&&d.jsxs("div",{className:"gauntlet-capsule__shell-panel",children:[d.jsxs("div",{className:"gauntlet-capsule__shell-row",children:[d.jsx("span",{className:"gauntlet-capsule__shell-prompt","aria-hidden":!0,children:"$"}),d.jsx("input",{type:"text",className:"gauntlet-capsule__shell-input",placeholder:"git status — comandos da allowlist",value:$n,onChange:m=>Fn(m.target.value),onKeyDown:m=>{m.key==="Enter"&&!m.shiftKey&&(m.preventDefault(),Bn())},disabled:Vr,spellCheck:!1,autoComplete:"off"}),d.jsx("button",{type:"button",className:"gauntlet-capsule__shell-run",onClick:()=>void Bn(),disabled:Vr||!$n.trim(),children:Vr?"…":"Executar"})]}),mt&&d.jsxs("div",{className:"gauntlet-capsule__shell-output",children:[d.jsxs("div",{className:"gauntlet-capsule__shell-meta",children:[d.jsxs("span",{className:"gauntlet-capsule__shell-meta-cmd",children:["$ ",mt.cmd]}),d.jsxs("span",{className:"gauntlet-capsule__shell-meta-stat",children:[mt.exitCode===null?"erro":`exit ${mt.exitCode}`," · ",mt.durationMs," ms"]})]}),mt.stdout&&d.jsx("pre",{className:"gauntlet-capsule__shell-stdout",children:mt.stdout}),mt.stderr&&d.jsx("pre",{className:"gauntlet-capsule__shell-stderr",children:mt.stderr})]})]}),zt!==null&&kt.length>0&&d.jsx("div",{className:"gauntlet-capsule__slash",role:"listbox",children:kt.map((m,P)=>d.jsxs("button",{type:"button",role:"option","aria-selected":P===Gt,className:`gauntlet-capsule__slash-item${P===Gt?" gauntlet-capsule__slash-item--active":""}`,onMouseEnter:()=>gn(P),onClick:()=>fr(P),children:[d.jsx("span",{className:"gauntlet-capsule__slash-label",children:m.label}),d.jsx("span",{className:"gauntlet-capsule__slash-hint",children:m.hint})]},m.id))}),d.jsx("textarea",{ref:Ze,className:"gauntlet-capsule__input",placeholder:"O que queres? / abre comandos · Enter envia · Shift+Enter nova linha",value:N,onChange:m=>j(m.target.value),onKeyDown:Za,rows:2,disabled:C==="planning"||C==="streaming"||C==="executing"}),d.jsxs("div",{className:"gauntlet-capsule__actions",children:[d.jsxs("span",{className:"gauntlet-capsule__hint","aria-hidden":!0,children:[d.jsx("span",{className:"gauntlet-capsule__kbd",children:"↵"}),d.jsx("span",{className:"gauntlet-capsule__kbd-sep",children:"·"}),d.jsx("span",{className:"gauntlet-capsule__kbd",children:"⌘K"})]}),o.capabilities.filesystemRead&&o.filesystem&&d.jsxs("button",{type:"button",className:"gauntlet-capsule__attach-btn",onClick:()=>void Mt(),"aria-label":"Anexar ficheiro local",title:"Anexar ficheiro do disco",disabled:C==="planning"||C==="streaming"||C==="executing",children:[d.jsx("svg",{viewBox:"0 0 24 24",width:"13",height:"13","aria-hidden":!0,children:d.jsx("path",{d:"M14 4l-2 0 0 8-3 0 4 5 4-5-3 0 0-8z",transform:"rotate(45 12 12)",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinejoin:"round"})}),d.jsx("span",{className:"gauntlet-capsule__attach-label",children:"anexar"})]}),o.capabilities.screenCapture&&((Rl=o.screenshot)==null?void 0:Rl.captureScreen)&&d.jsxs("button",{type:"button",className:"gauntlet-capsule__attach-btn",onClick:()=>void In(),"aria-label":"Capturar ecrã inteiro",title:"Capturar ecrã inteiro",disabled:C==="planning"||C==="streaming"||C==="executing",children:[d.jsxs("svg",{viewBox:"0 0 24 24",width:"13",height:"13","aria-hidden":!0,children:[d.jsx("rect",{x:"3",y:"5",width:"18",height:"13",rx:"2",fill:"none",stroke:"currentColor",strokeWidth:"1.6"}),d.jsx("circle",{cx:"12",cy:"11.5",r:"2.4",fill:"none",stroke:"currentColor",strokeWidth:"1.6"})]}),d.jsx("span",{className:"gauntlet-capsule__attach-label",children:"ecrã"})]}),o.capabilities.shellExecute&&o.shellExec&&d.jsxs("button",{type:"button",className:`gauntlet-capsule__attach-btn${qt?" gauntlet-capsule__attach-btn--active":""}`,onClick:()=>On(m=>!m),"aria-label":"Shell rápida",title:"Shell rápida (allowlist + GAUNTLET_ALLOW_CODE_EXEC)","aria-expanded":qt,children:[d.jsx("svg",{viewBox:"0 0 24 24",width:"13",height:"13","aria-hidden":!0,children:d.jsx("path",{d:"M5 7l4 4-4 4M11 16h7",stroke:"currentColor",strokeWidth:"1.7",fill:"none",strokeLinecap:"round",strokeLinejoin:"round"})}),d.jsx("span",{className:"gauntlet-capsule__attach-label",children:"shell"})]}),(Wc()||o.capabilities.remoteVoice&&Va())&&d.jsxs("button",{type:"button",className:`gauntlet-capsule__voice${fn?" gauntlet-capsule__voice--active":""}`,onPointerDown:m=>{m.preventDefault(),qa()},onPointerUp:()=>ir(),onPointerLeave:()=>{fn&&ir()},"aria-label":fn?"A ouvir — solta para enviar":"Premer e falar",title:"Premir e falar",disabled:C==="planning"||C==="streaming"||C==="executing",children:[d.jsxs("svg",{viewBox:"0 0 24 24",width:"13",height:"13","aria-hidden":!0,children:[d.jsx("path",{d:"M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3z",fill:"currentColor"}),d.jsx("path",{d:"M19 11a7 7 0 0 1-14 0M12 18v3",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",fill:"none"})]}),d.jsx("span",{className:"gauntlet-capsule__voice-label",children:fn?"a ouvir":"voz"})]}),d.jsxs("button",{type:"submit",className:"gauntlet-capsule__compose",disabled:C==="planning"||C==="streaming"||C==="executing"||!N.trim(),children:[ge>0&&d.jsx("span",{className:"gauntlet-capsule__compose-ripple","aria-hidden":!0},ge),C==="planning"||C==="streaming"?d.jsxs(d.Fragment,{children:[d.jsx("span",{className:"gauntlet-capsule__compose-spinner","aria-hidden":!0}),d.jsx("span",{children:C==="planning"?"a pensar":"a escrever"})]}):"Enviar"]})]})]}),C==="streaming"&&D&&d.jsxs("section",{className:"gauntlet-capsule__compose-result gauntlet-capsule__compose-result--streaming",children:[d.jsxs("header",{className:"gauntlet-capsule__compose-meta",children:[d.jsx("span",{className:"gauntlet-capsule__compose-tag",children:"resposta"}),d.jsxs("span",{className:"gauntlet-capsule__compose-meta-text",children:[d.jsxs("span",{className:"gauntlet-capsule__token-counter","aria-live":"polite",children:[Fr," chunks"]}),d.jsx("span",{"aria-hidden":!0,children:"·"}),d.jsx("span",{children:"a escrever…"})]})]}),d.jsxs("div",{className:"gauntlet-capsule__compose-text gauntlet-capsule__compose-text--streaming",children:[D,d.jsx("span",{className:"gauntlet-capsule__compose-caret","aria-hidden":!0,children:"▍"})]})]}),(C==="planning"||C==="streaming"&&!D)&&d.jsxs("section",{className:"gauntlet-capsule__skeleton",role:"status","aria-live":"polite","aria-label":"A pensar...",children:[d.jsxs("header",{className:"gauntlet-capsule__skeleton-header",children:[d.jsx("span",{className:"gauntlet-capsule__skeleton-tag"}),d.jsx("span",{className:"gauntlet-capsule__skeleton-meta"})]}),d.jsx("div",{className:"gauntlet-capsule__skeleton-line gauntlet-capsule__skeleton-line--w90"}),d.jsx("div",{className:"gauntlet-capsule__skeleton-line gauntlet-capsule__skeleton-line--w75"}),d.jsx("div",{className:"gauntlet-capsule__skeleton-line gauntlet-capsule__skeleton-line--w55"})]}),(z==null?void 0:z.compose)&&C==="plan_ready"&&d.jsxs("section",{className:"gauntlet-capsule__compose-result",children:[d.jsxs("header",{className:"gauntlet-capsule__compose-meta",children:[d.jsx("span",{className:"gauntlet-capsule__compose-tag",children:"resposta"}),d.jsxs("span",{className:"gauntlet-capsule__compose-meta-text",children:[z.model_used," · ",z.latency_ms," ms"]})]}),d.jsx("div",{className:"gauntlet-capsule__compose-text",children:d.jsx(Zc,{source:z.compose,onCopyBlock:()=>Dn("code copied")})}),d.jsxs("div",{className:"gauntlet-capsule__compose-actions",children:[d.jsx("button",{type:"button",className:"gauntlet-capsule__copy",onClick:()=>void Wr(),children:ne?"copiado ✓":"Copy"}),d.jsx("button",{type:"button",className:"gauntlet-capsule__copy gauntlet-capsule__copy--ghost",onClick:()=>void cr(),children:ar==="saved"?"guardado ✓":"Save"}),o.capabilities.filesystemWrite&&((gr=o.filesystem)==null?void 0:gr.writeTextFile)&&d.jsx("button",{type:"button",className:"gauntlet-capsule__copy gauntlet-capsule__copy--ghost",onClick:()=>void Zt(),title:"Guardar resposta para um ficheiro",children:Ur?`→ ${Ur}`:"Guardar como"})]})]}),z&&z.actions.length===0&&!z.compose&&C==="plan_ready"&&d.jsx("section",{className:"gauntlet-capsule__plan",children:d.jsx("p",{className:"gauntlet-capsule__plan-empty",children:z.reason??"Modelo não conseguiu planear."})}),z&&z.actions.length>0&&(C==="plan_ready"||C==="executing"||C==="executed")&&d.jsxs("section",{className:"gauntlet-capsule__plan",children:[d.jsxs("header",{className:"gauntlet-capsule__plan-header",children:[d.jsx("span",{className:"gauntlet-capsule__plan-title",children:"plano"}),d.jsxs("span",{className:"gauntlet-capsule__plan-meta",children:[z.actions.length," action",z.actions.length===1?"":"s"," · ",z.model_used," · ",z.latency_ms," ms"]})]}),d.jsx("ol",{className:"gauntlet-capsule__plan-list",children:z.actions.map((m,P)=>{const H=Ne==null?void 0:Ne[P],re=H?H.ok?"ok":"fail":"pending",ve=Tt[P];return d.jsxs("li",{className:`gauntlet-capsule__plan-item gauntlet-capsule__plan-item--${re}${ve!=null&&ve.danger?" gauntlet-capsule__plan-item--danger":""}`,children:[d.jsx("span",{className:"gauntlet-capsule__plan-step",children:P+1}),d.jsx("span",{className:"gauntlet-capsule__plan-desc",children:Rd(m)}),(ve==null?void 0:ve.danger)&&d.jsx("span",{className:"gauntlet-capsule__plan-danger",title:ve.reason,children:"sensível"}),H&&!H.ok&&d.jsx("span",{className:"gauntlet-capsule__plan-err",title:H.error,children:H.error})]},`${P}-${m.type}-${m.selector}`)})}),C!=="executed"&&Pt&&d.jsxs("div",{className:"gauntlet-capsule__danger-gate",role:"alert",children:[d.jsxs("header",{className:"gauntlet-capsule__danger-header",children:[d.jsx("span",{className:"gauntlet-capsule__danger-mark","aria-hidden":!0,children:"!"}),d.jsx("span",{className:"gauntlet-capsule__danger-title",children:"Acções sensíveis no plano"})]}),d.jsxs("ul",{className:"gauntlet-capsule__danger-list",children:[sr.forced&&sr.reason&&d.jsxs("li",{children:[d.jsx("strong",{children:"governança:"})," ",sr.reason]},"danger-policy"),wt.danger&&d.jsxs("li",{children:[d.jsx("strong",{children:"cadeia:"})," ",wt.reason??"flagged"]},"danger-sequence"),Tt.map((m,P)=>m.danger?d.jsxs("li",{children:[d.jsxs("strong",{children:["step ",P+1,":"]})," ",m.reason??"flagged"]},`danger-${P}`):null)]}),d.jsxs("label",{className:"gauntlet-capsule__danger-confirm",children:[d.jsx("input",{type:"checkbox",checked:F,onChange:m=>T(m.target.checked),disabled:C==="executing"}),d.jsx("span",{children:"Confirmo, executar mesmo assim."})]})]}),C!=="executed"&&A&&d.jsx("div",{className:"gauntlet-capsule__plan-actions",children:d.jsx("button",{type:"button",className:`gauntlet-capsule__execute${Pt?" gauntlet-capsule__execute--danger":""}`,onClick:()=>void zl(),disabled:C==="executing"||Pt&&!F,children:C==="executing"?"executando…":Pt?"Executar com cuidado":"Executar"})}),C!=="executed"&&!A&&d.jsx("p",{className:"gauntlet-capsule__plan-empty",children:"esta superfície não tem acesso a uma página viva — abre o Gauntlet num separador para executar acções."})]}),C==="error"&&ue&&d.jsxs("div",{className:"gauntlet-capsule__error",role:"alert",children:[d.jsx("span",{className:"gauntlet-capsule__error-icon","aria-hidden":!0,children:"!"}),d.jsx("span",{children:ue})]})]})]}),lr&&d.jsx(Pd,{onClose:()=>We(!1),recentIds:ye,actions:(()=>{var ce,it;const m=te=>{Pe(_e=>[te,..._e.filter(Hn=>Hn!==te)].slice(0,8)),h.notePaletteUse(te)},P=te=>{j(_e=>{const $e=_e.trimEnd(),Hn=`usa a tool ${te} para `;return $e.startsWith("usa a tool ")?Hn:$e?`${Hn}${$e}`:Hn}),window.setTimeout(()=>{const _e=Ze.current;_e&&(_e.focus(),_e.setSelectionRange(_e.value.length,_e.value.length))},0)},H=[{id:"focus",label:"Focar input",shortcut:"↵",group:"action",run:()=>{m("focus"),We(!1),window.setTimeout(()=>{var te;return(te=Ze.current)==null?void 0:te.focus()},0)}},{id:"copy",label:"Copiar resposta",shortcut:"⌘C",group:"action",disabled:!(z!=null&&z.compose),run:()=>{m("copy"),We(!1),Wr()}},{id:"save",label:"Guardar em memória",shortcut:"S",group:"action",disabled:!(z!=null&&z.compose)&&!S.text&&!N.trim(),run:()=>{m("save"),We(!1),cr()}},...o.capabilities.filesystemRead&&o.filesystem?[{id:"attach-file",label:"Anexar ficheiro local",description:"Abre o file picker e anexa o conteúdo ao prompt",shortcut:"",group:"action",run:()=>{m("attach-file"),We(!1),Mt()}}]:[],...o.capabilities.screenCapture&&((ce=o.screenshot)!=null&&ce.captureScreen)?[{id:"attach-screen",label:"Capturar ecrã inteiro",description:"Anexa um screenshot do ecrã primário",shortcut:"",group:"action",run:()=>{m("attach-screen"),We(!1),In()}}]:[],...o.capabilities.shellExecute&&o.shellExec?[{id:"shell-toggle",label:qt?"Fechar shell rápida":"Abrir shell rápida",description:"Painel inline para correr comandos da allowlist",shortcut:"",group:"action",run:()=>{m("shell-toggle"),We(!1),On(te=>!te)}}]:[],...o.capabilities.filesystemWrite&&((it=o.filesystem)!=null&&it.writeTextFile)?[{id:"save-disk",label:"Guardar resposta em ficheiro",description:"Save dialog → escreve compose para o disco",shortcut:"",group:"action",disabled:!(z!=null&&z.compose),run:()=>{m("save-disk"),We(!1),Zt()}}]:[],{id:"reread",label:"Re-ler contexto",shortcut:"R",group:"action",run:()=>{m("reread"),We(!1),Br()}},{id:"clear",label:"Limpar input",shortcut:"X",group:"action",disabled:!N,run:()=>{var te;m("clear"),We(!1),j(""),(te=Ze.current)==null||te.focus()}},{id:"dismiss",label:"Fechar cápsula",shortcut:"Esc",group:"action",run:()=>{m("dismiss"),We(!1),gt()}}],ve=q.filter(te=>{var $e;const _e=($e=Xe.tool_policies)==null?void 0:$e[te.name];return!_e||_e.allowed!==!1}).map(te=>{var _e,$e;return{id:`tool:${te.name}`,label:te.name,description:te.description,shortcut:"",group:"tool",mode:te.mode,risk:te.risk,requiresApproval:(($e=(_e=Xe.tool_policies)==null?void 0:_e[te.name])==null?void 0:$e.require_approval)===!0,run:()=>{m(`tool:${te.name}`),We(!1),P(te.name)}}});return[...H,...ve]})()}),ar&&d.jsx("div",{className:"gauntlet-capsule__flash",role:"status","aria-live":"polite",children:ar})]})}function Td(o,u){if(!o)return 0;const s=o.toLowerCase(),p=u.toLowerCase();if(p.includes(s))return 1e3-p.indexOf(s);let v=0,h=0,A=-2;for(let S=0;S<p.length&&v<s.length;S++)p[S]===s[v]&&(S!==A+1&&h++,A=S,v++);return v<s.length?-1:500-h*10-(p.length-s.length)}function Pd({actions:o,onClose:u,recentIds:s}){const[p,v]=b.useState(""),[h,A]=b.useState(0),S=b.useRef(null);b.useEffect(()=>{var j;(j=S.current)==null||j.focus()},[]);const k=b.useMemo(()=>{if(!p){const C=new Map(s.map((le,ne)=>[le,ne])),U=le=>{const ne=C.get(le.id);return ne===void 0?s.length:ne};return[...o].sort((le,ne)=>{const ie=U(le),z=U(ne);if(ie!==z)return ie-z;const Se=F=>F==="tool"?1:0,Ne=Se(le.group),ke=Se(ne.group);return Ne!==ke?Ne-ke:le.label.localeCompare(ne.label)})}return o.map(C=>{const U=`${C.label} ${C.id} ${C.description??""}`;return{a:C,score:Td(p,U)}}).filter(C=>C.score>=0).sort((C,U)=>U.score-C.score).map(C=>C.a)},[o,p,s]);b.useEffect(()=>{h>=k.length&&A(0)},[k.length,h]);const N=b.useCallback(j=>{if(j.key==="ArrowDown")j.preventDefault(),A(C=>Math.min(C+1,k.length-1));else if(j.key==="ArrowUp")j.preventDefault(),A(C=>Math.max(C-1,0));else if(j.key==="Enter"){j.preventDefault();const C=k[h];C&&!C.disabled&&C.run()}},[k,h]);return d.jsxs("div",{className:"gauntlet-capsule__palette",role:"dialog","aria-label":"Command palette",children:[d.jsx("div",{className:"gauntlet-capsule__palette-scrim",onClick:u}),d.jsxs("div",{className:"gauntlet-capsule__palette-panel",onKeyDown:N,children:[d.jsx("input",{ref:S,className:"gauntlet-capsule__palette-input",type:"text",placeholder:"comandos · tools…  (↑↓ para navegar, ↵ para correr, esc para fechar)",value:p,onChange:j=>v(j.target.value)}),d.jsx("ul",{className:"gauntlet-capsule__palette-list",role:"listbox",children:k.length===0?d.jsx("li",{className:"gauntlet-capsule__palette-empty",children:"sem resultados"}):k.map((j,C)=>d.jsxs("li",{role:"option","aria-selected":C===h,"aria-disabled":j.disabled,onMouseEnter:()=>A(C),onClick:()=>{j.disabled||j.run()},className:`gauntlet-capsule__palette-item${C===h?" gauntlet-capsule__palette-item--active":""}${j.disabled?" gauntlet-capsule__palette-item--disabled":""}${j.group==="tool"?" gauntlet-capsule__palette-item--tool":""}`,children:[d.jsxs("div",{className:"gauntlet-capsule__palette-main",children:[d.jsx("span",{className:"gauntlet-capsule__palette-label",children:j.label}),j.description&&d.jsx("span",{className:"gauntlet-capsule__palette-desc",children:j.description})]}),d.jsxs("div",{className:"gauntlet-capsule__palette-meta",children:[j.mode&&d.jsx("span",{className:`gauntlet-capsule__palette-badge gauntlet-capsule__palette-badge--mode-${j.mode}`,title:`mode: ${j.mode}`,children:j.mode}),j.risk&&j.risk!=="low"&&d.jsx("span",{className:`gauntlet-capsule__palette-badge gauntlet-capsule__palette-badge--risk-${j.risk}`,title:`risk: ${j.risk}`,children:j.risk}),j.requiresApproval&&d.jsx("span",{className:"gauntlet-capsule__palette-badge gauntlet-capsule__palette-badge--approval",title:"requires explicit approval before running",children:"approval"}),j.shortcut&&d.jsx("span",{className:"gauntlet-capsule__palette-shortcut",children:j.shortcut})]})]},j.id))})]})]})}function oi(o,u){return o.length<=u?o:o.slice(0,u)+"…"}function jd({snapshot:o,screenshotEnabled:u}){const s=(()=>{if(!o.domSkeleton)return 0;try{const v=JSON.parse(o.domSkeleton);if(Array.isArray(v))return v.length}catch{}return 0})(),p=!!o.pageText;return d.jsxs("ul",{className:"gauntlet-capsule__context-summary","aria-label":"context",children:[d.jsxs("li",{children:[d.jsx("span",{className:"gauntlet-capsule__context-key",children:"selection"}),d.jsx("span",{className:"gauntlet-capsule__context-val gauntlet-capsule__context-val--muted",children:"none"})]}),d.jsxs("li",{children:[d.jsx("span",{className:"gauntlet-capsule__context-key",children:"page captured"}),d.jsx("span",{className:"gauntlet-capsule__context-val",children:p?"yes":"no"})]}),d.jsxs("li",{children:[d.jsx("span",{className:"gauntlet-capsule__context-key",children:"DOM captured"}),d.jsx("span",{className:"gauntlet-capsule__context-val",children:s>0?`${s} elements`:"—"})]}),d.jsxs("li",{children:[d.jsx("span",{className:"gauntlet-capsule__context-key",children:"screenshot"}),d.jsx("span",{className:"gauntlet-capsule__context-val",children:u?"on":"off"})]})]})}function Md({onClose:o,showScreenshot:u,prefs:s,showDismissedDomains:p,theme:v,onChangeTheme:h,showPillMode:A}){const[S,k]=b.useState([]),[N,j]=b.useState(!0),[C,U]=b.useState(!1),[ue,le]=b.useState("corner"),[ne,ie]=b.useState(!1);b.useEffect(()=>{let F=!1;return p&&s.readDismissedDomains().then(T=>{F||k(T)}),s.readScreenshotEnabled().then(T=>{F||(U(T),j(!1))}),s.readPillMode().then(T=>{F||le(T)}),s.readTtsEnabled().then(T=>{F||ie(T)}),()=>{F=!0}},[s,p]);const z=b.useCallback(async F=>{le(F),await s.writePillMode(F),window.dispatchEvent(new CustomEvent("gauntlet:pill-mode",{detail:{mode:F}}))},[s]),Se=b.useCallback(async F=>{var T;if(ie(F),await s.writeTtsEnabled(F),!F)try{(T=window.speechSynthesis)==null||T.cancel()}catch{}window.dispatchEvent(new CustomEvent("gauntlet:tts",{detail:{enabled:F}}))},[s]),Ne=b.useCallback(async F=>{await s.restoreDomain(F),k(T=>T.filter(D=>D!==F))},[s]),ke=b.useCallback(async F=>{U(F),await s.writeScreenshotEnabled(F)},[s]);return d.jsxs("section",{className:"gauntlet-capsule__settings",role:"region","aria-label":"Definições",children:[d.jsxs("header",{className:"gauntlet-capsule__settings-header",children:[d.jsx("span",{className:"gauntlet-capsule__settings-title",children:"definições"}),d.jsx("button",{type:"button",className:"gauntlet-capsule__settings-close",onClick:o,"aria-label":"Fechar definições",children:"×"})]}),d.jsxs("div",{className:"gauntlet-capsule__settings-section",children:[d.jsx("span",{className:"gauntlet-capsule__settings-subtitle",children:"aparência"}),d.jsxs("div",{className:"gauntlet-capsule__theme-switch",role:"radiogroup","aria-label":"tema",children:[d.jsxs("button",{type:"button",className:`gauntlet-capsule__theme-option${v==="light"?" gauntlet-capsule__theme-option--active":""}`,onClick:()=>h("light"),role:"radio","aria-checked":v==="light",children:[d.jsx("span",{className:"gauntlet-capsule__theme-swatch gauntlet-capsule__theme-swatch--light","aria-hidden":!0}),d.jsx("span",{children:"flagship light"})]}),d.jsxs("button",{type:"button",className:`gauntlet-capsule__theme-option${v==="dark"?" gauntlet-capsule__theme-option--active":""}`,onClick:()=>h("dark"),role:"radio","aria-checked":v==="dark",children:[d.jsx("span",{className:"gauntlet-capsule__theme-swatch gauntlet-capsule__theme-swatch--dark","aria-hidden":!0}),d.jsx("span",{children:"night premium"})]})]})]}),A&&d.jsxs("div",{className:"gauntlet-capsule__settings-section",children:[d.jsx("span",{className:"gauntlet-capsule__settings-subtitle",children:"pill"}),d.jsxs("div",{className:"gauntlet-capsule__theme-switch",role:"radiogroup","aria-label":"pill mode",children:[d.jsxs("button",{type:"button",className:`gauntlet-capsule__theme-option${ue==="corner"?" gauntlet-capsule__theme-option--active":""}`,onClick:()=>void z("corner"),role:"radio","aria-checked":ue==="corner",children:[d.jsx("span",{className:"gauntlet-capsule__theme-swatch gauntlet-capsule__pill-mode-swatch--corner","aria-hidden":!0}),d.jsx("span",{children:"resting corner"})]}),d.jsxs("button",{type:"button",className:`gauntlet-capsule__theme-option${ue==="cursor"?" gauntlet-capsule__theme-option--active":""}`,onClick:()=>void z("cursor"),role:"radio","aria-checked":ue==="cursor",children:[d.jsx("span",{className:"gauntlet-capsule__theme-swatch gauntlet-capsule__pill-mode-swatch--cursor","aria-hidden":!0}),d.jsx("span",{children:"cursor pill"})]})]})]}),u&&d.jsx("div",{className:"gauntlet-capsule__settings-section",children:d.jsxs("label",{className:"gauntlet-capsule__settings-toggle",children:[d.jsx("input",{type:"checkbox",checked:C,onChange:F=>void ke(F.target.checked)}),d.jsxs("span",{className:"gauntlet-capsule__settings-toggle-label",children:[d.jsx("strong",{children:"incluir screenshot"}),d.jsx("small",{children:"o modelo vê a página visível. útil para layouts e imagens, exposição de senhas/DMs visíveis. opt-in."})]})]})}),d.jsx("div",{className:"gauntlet-capsule__settings-section",children:d.jsxs("label",{className:"gauntlet-capsule__settings-toggle",children:[d.jsx("input",{type:"checkbox",checked:ne,onChange:F=>void Se(F.target.checked)}),d.jsxs("span",{className:"gauntlet-capsule__settings-toggle-label",children:[d.jsx("strong",{children:"ler resposta em voz alta"}),d.jsx("small",{children:"quando o modelo termina, a cápsula fala a resposta via Web Speech. cancela ao submeter outro pedido ou fechar a cápsula."})]})]})}),d.jsxs("div",{className:"gauntlet-capsule__settings-section",children:[d.jsx("span",{className:"gauntlet-capsule__settings-subtitle",children:"domínios escondidos"}),N?d.jsx("p",{className:"gauntlet-capsule__settings-empty",children:"a carregar…"}):S.length===0?d.jsx("p",{className:"gauntlet-capsule__settings-empty",children:"nenhum — clica direito no pill em qualquer site para o esconder."}):d.jsx("ul",{className:"gauntlet-capsule__settings-list",children:S.map(F=>d.jsxs("li",{className:"gauntlet-capsule__settings-row",children:[d.jsx("span",{className:"gauntlet-capsule__settings-host",children:F}),d.jsx("button",{type:"button",className:"gauntlet-capsule__settings-restore",onClick:()=>void Ne(F),children:"restaurar"})]},F))})]})]})}function zd(o){const u=o.match(/"compose"\s*:\s*"((?:[^"\\]|\\.)*)/);if(!u)return null;let s=u[1];return s.endsWith("\\")&&!s.endsWith("\\\\")&&(s=s.slice(0,-1)),s.replace(/\\n/g,`
`).replace(/\\r/g,"\r").replace(/\\t/g,"	").replace(/\\"/g,'"').replace(/\\\\/g,"\\")}function Ld(o,u){const s={};return o.pageText&&(s.page_text=o.pageText),o.domSkeleton&&(s.dom_skeleton=o.domSkeleton),o.bbox&&(s.selection_bbox=o.bbox),u&&(s.screenshot_data_url=u),{source:"browser",url:o.url,page_title:o.pageTitle,selection:o.text||void 0,metadata:Object.keys(s).length>0?s:void 0}}function Rd(o){switch(o.type){case"fill":return`fill ${o.selector} ← "${oi(o.value,80)}"`;case"click":return`click ${o.selector}`;case"highlight":return`highlight ${o.selector}`;case"scroll_to":return`scroll to ${o.selector}`}}const _t=16,cn=12;function Cl(o,u,s){return s<u||o<u?u:o>s?s:o}function Dd(o,u){if(o<=600)return{width:Math.max(0,o-24),height:Math.max(0,u-24)};const p=Cl(.72*o,560,820),v=Cl(.72*u,420,560);return{width:p,height:v}}function Id(o,u,s){if(!o)return{top:Math.max(_t,Math.floor((u.height-s.height)/2)),left:Math.max(_t,Math.floor((u.width-s.width)/2)),placement:"center"};const p=u.height-(o.y+o.height)-cn-_t,v=o.y-cn-_t,h=u.width-(o.x+o.width)-cn-_t,A=o.x-cn-_t,S=p>=s.height,k=v>=s.height,N=h>=s.width,j=A>=s.width;let C,U,ue;S?(C="below",U=o.y+o.height+cn,ue=o.x):k?(C="above",U=o.y-cn-s.height,ue=o.x):N?(C="right",ue=o.x+o.width+cn,U=Math.floor(o.y+o.height/2-s.height/2)):j?(C="left",ue=o.x-cn-s.width,U=Math.floor(o.y+o.height/2-s.height/2)):(C="center",U=Math.floor((u.height-s.height)/2),ue=Math.floor((u.width-s.width)/2));const le=u.height-s.height-_t,ne=u.width-s.width-_t;return U=Cl(U,_t,Math.max(_t,le)),ue=Cl(ue,_t,Math.max(_t,ne)),{top:U,left:ue,placement:C}}const Od=`
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
`,$d=4,Fd=3e4,si=180,ii=8,Bd=24;function Ud({position:o,onClick:u,onDismissDomain:s,onPersistPosition:p,flash:v,phase:h,hasContext:A,disconnected:S,mode:k="corner"}){const[N,j]=b.useState(o),[C,U]=b.useState(!1),[ue,le]=b.useState({dx:0,dy:0,near:!1}),[ne,ie]=b.useState(null),[z,Se]=b.useState(!1),[Ne,ke]=b.useState(!1),[F,T]=b.useState(!1),D=b.useRef(null),B=b.useRef(null),Y=b.useRef(null),xe=b.useRef(null),Te=b.useRef(null);b.useEffect(()=>{j(o)},[o.bottom,o.right]),b.useEffect(()=>{if(k==="cursor"){U(f=>f&&!1);return}function I(){Y.current!==null&&window.clearTimeout(Y.current),U(f=>f&&!1),Y.current=window.setTimeout(()=>{U(!0)},Fd)}return I(),window.addEventListener("mousemove",I,{passive:!0}),window.addEventListener("keydown",I,{passive:!0}),()=>{window.removeEventListener("mousemove",I),window.removeEventListener("keydown",I),Y.current!==null&&window.clearTimeout(Y.current)}},[k]),b.useEffect(()=>{if(k!=="cursor"){ie(null),Se(!1),ke(!1),T(!1);return}const I=document.createElement("style");I.id="gauntlet-pill-cursor-style",I.textContent=`
      html, body, * { cursor: none !important; }
    `,document.documentElement.appendChild(I);let f=null,E=null;function ee(){if(f=null,!E)return;ie(E);const oe=document.elementFromPoint(E.x,E.y),de=!!(oe!=null&&oe.closest('input:not([type="button"]):not([type="submit"]):not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="color"]):not([type="file"]), textarea, [contenteditable=""], [contenteditable="true"]')),he=de?!1:!!(oe!=null&&oe.closest('a, button, [role="button"], select'));ke(Le=>Le===de?Le:de),Se(Le=>Le===he?Le:he)}function ae(oe){E={x:oe.clientX,y:oe.clientY},f==null&&(f=window.requestAnimationFrame(ee))}function pe(oe){(oe.metaKey||oe.ctrlKey)&&T(!0)}function fe(oe){!oe.metaKey&&!oe.ctrlKey&&T(!1)}return window.addEventListener("pointermove",ae,{passive:!0}),window.addEventListener("keydown",pe,{passive:!0}),window.addEventListener("keyup",fe,{passive:!0}),()=>{window.removeEventListener("pointermove",ae),window.removeEventListener("keydown",pe),window.removeEventListener("keyup",fe),f!=null&&cancelAnimationFrame(f),I.remove(),ie(null),Se(!1),ke(!1),T(!1)}},[k]),b.useEffect(()=>{if(k==="cursor"){le(f=>f.dx===0&&f.dy===0&&!f.near?f:{dx:0,dy:0,near:!1});return}function I(f){Te.current={x:f.clientX,y:f.clientY},xe.current==null&&(xe.current=window.requestAnimationFrame(()=>{if(xe.current=null,D.current)return;const E=Te.current;if(!E)return;const ee=B.current;if(!ee)return;const ae=ee.getBoundingClientRect(),pe=ae.left+ae.width/2,fe=ae.top+ae.height/2,oe=E.x-pe,de=E.y-fe,he=Math.hypot(oe,de);if(he>si||he<1){le(Ze=>Ze.dx===0&&Ze.dy===0&&!Ze.near?Ze:{dx:0,dy:0,near:!1});return}const Le=1-he/si,lt=ii+(Bd-ii)*Le,Xe=oe/he,dn=de/he;le({dx:Xe*lt,dy:dn*lt,near:!0})}))}return window.addEventListener("pointermove",I,{passive:!0}),()=>{window.removeEventListener("pointermove",I),xe.current!=null&&(cancelAnimationFrame(xe.current),xe.current=null)}},[k]);const Ce=b.useCallback(I=>{var f;I.button===0&&((f=B.current)==null||f.setPointerCapture(I.pointerId),D.current={pressX:I.clientX,pressY:I.clientY,startBottom:N.bottom,startRight:N.right,armed:!1})},[N.bottom,N.right]),q=b.useCallback(I=>{const f=D.current;if(!f)return;const E=I.clientX-f.pressX,ee=I.clientY-f.pressY;!f.armed&&Math.abs(E)+Math.abs(ee)<$d||(f.armed=!0,j({right:f.startRight-E,bottom:f.startBottom-ee}))},[]),Ae=b.useCallback(I=>{var E;const f=D.current;D.current=null;try{(E=B.current)==null||E.releasePointerCapture(I.pointerId)}catch{}if(f){if(f.armed){p(N);return}u()}},[N,u,p]),ye=b.useCallback(I=>{I.preventDefault();const f=(()=>{try{return window.location.hostname}catch{return""}})();window.confirm(f?`Esconder o Gauntlet em ${f}? Restauras na cápsula → "···" → restaurar.`:"Esconder o Gauntlet neste site?")&&s()},[s]),Pe=v==="ok"?"gauntlet-pill--success":v==="fail"?"gauntlet-pill--error":"",ge=k==="cursor",$=["gauntlet-pill",C&&!ge?"gauntlet-pill--idle":"",!ge&&ue.near?"gauntlet-pill--near-cursor":"",A?"gauntlet-pill--context":"",S?"gauntlet-pill--disconnected":"",Pe,h&&h!=="idle"?`gauntlet-pill--phase-${h}`:"",ge?"gauntlet-pill--cursor-mode":"",ge&&z?"gauntlet-pill--over-interactive":"",ge&&Ne?"gauntlet-pill--over-editable":"",ge&&F?"gauntlet-pill--cmd-held":""].filter(Boolean).join(" "),G=ge?ne?{top:`${ne.y}px`,left:`${ne.x}px`,right:"auto",bottom:"auto",transform:"translate(-50%, -50%)",pointerEvents:"none"}:{bottom:`${N.bottom}px`,right:`${N.right}px`,pointerEvents:"none"}:{bottom:`${N.bottom}px`,right:`${N.right}px`,transform:ue.dx!==0||ue.dy!==0?`translate3d(${ue.dx}px, ${ue.dy}px, 0)`:void 0};return d.jsx("button",{ref:B,type:"button",className:$,style:G,onPointerDown:Ce,onPointerMove:q,onPointerUp:Ae,onPointerEnter:()=>U(!1),onContextMenu:ye,"aria-label":"Summon Gauntlet capsule",title:"Click: abrir · Drag: mover · Right-click: esconder neste domínio",children:d.jsx("span",{className:"gauntlet-pill__mark","aria-hidden":!0,children:d.jsx("span",{className:"gauntlet-pill__dot"})})})}const Hd=`
@keyframes gauntlet-pill-pulse {
  0%, 100% { opacity: 0.7; transform: scale(1); }
  50%      { opacity: 1;   transform: scale(1.18); }
}
@keyframes gauntlet-pill-rise {
  0%   { opacity: 0; transform: translateY(8px) scale(0.85); }
  100% { opacity: 1; transform: translateY(0)   scale(1); }
}
/* C — pill como cursor evoluído. Breath: when there's selection
   context, the pill pulses a warmer halo to telegraph "ready to be
   summoned". Phase orbit: planning/streaming/executing get a
   continuously growing+fading shadow that reads as life, not just a
   static halo. Both run at low intensity by default and amplify when
   the matching state is on so the pill never dominates the page. */
@keyframes gauntlet-pill-breathe {
  0%, 100% {
    box-shadow:
      0 0 0 1px rgba(255, 255, 255, 0.04),
      0 0 14px rgba(208, 122, 90, 0.32),
      0 4px 12px rgba(0, 0, 0, 0.40);
  }
  50% {
    box-shadow:
      0 0 0 1px rgba(255, 255, 255, 0.08),
      0 0 22px rgba(208, 122, 90, 0.55),
      0 6px 18px rgba(0, 0, 0, 0.50);
  }
}
@keyframes gauntlet-pill-phase-orbit {
  0%   { box-shadow: 0 0 0 0 var(--gauntlet-pill-phase-color, transparent); opacity: 0.85; }
  60%  { box-shadow: 0 0 0 6px transparent; opacity: 0.35; }
  100% { box-shadow: 0 0 0 0 var(--gauntlet-pill-phase-color, transparent); opacity: 0.85; }
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
  /* Breath halo — runs on top of the static shadow rule above; the
     keyframe paints all three layers so the override is total during
     the cycle. 3.4s reads as breath, not strobe. */
  animation:
    gauntlet-pill-rise 320ms cubic-bezier(0.2, 0, 0, 1) both,
    gauntlet-pill-breathe 3.4s ease-in-out 320ms infinite;
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
  /* Spin = ambient drift; orbit pulse = "the model is working RIGHT NOW".
     Stacked animations: spin runs forever for slow ambient motion, the
     orbit-pulse breathes shadow size in 1.4s cycles so the operator
     reads "live" even from across the page. */
  animation:
    gauntlet-pill-phase-spin 6s linear infinite,
    gauntlet-pill-phase-orbit 1.4s ease-in-out infinite;
  box-shadow: 0 0 12px var(--gauntlet-pill-phase-color, transparent);
}
/* Terminal phases (plan_ready / executed / error) don't pulse — once
   the model is done, the orbit settles into a quiet halo so the
   ambient noise doesn't mask the next interaction. */
.gauntlet-pill--phase-plan_ready::after,
.gauntlet-pill--phase-executed::after,
.gauntlet-pill--phase-error::after {
  animation: gauntlet-pill-phase-spin 6s linear infinite;
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
`,Vd=100,Wd=new Set(["script","style","meta","link","noscript","head","html","br","hr","wbr"]),Kd="gauntlet-capsule-host";function Yd(o){const u=o.tagName.toLowerCase(),s=o.getAttribute("id");if(s&&!s.startsWith("gauntlet-"))return`${u}#${CSS.escape(s)}`;const p=o.getAttribute("name");if(p)return`${u}[name="${p}"]`;const v=o.getAttribute("type");if(v)return`${u}[type="${v}"]`;const h=Array.from(o.classList).filter(A=>A.length>2&&!A.startsWith("is-")&&!A.startsWith("has-")).slice(0,2);return h.length>0?`${u}.${h.map(A=>CSS.escape(A)).join(".")}`:u}function Qd(o){try{const u=window.getComputedStyle(o);if(u.display==="none"||u.visibility==="hidden"||u.opacity==="0")return!1;const s=o.getBoundingClientRect();return!(s.width===0&&s.height===0||s.bottom<0||s.top>window.innerHeight||s.right<0||s.left>window.innerWidth)}catch{return!1}}function Jd(o){let u=0,s=o;for(;s&&s!==document.body;)u++,s=s.parentElement;return u}function Gd(o){var s;let u=o;for(;u;){if(u.id===Kd||(s=u.id)!=null&&s.startsWith("gauntlet-"))return!0;u=u.parentElement}return!1}function qd(o){var N;const u=o.tagName.toLowerCase();if(Wd.has(u)||Gd(o))return null;const s=Yd(o),p=Qd(o),v=Jd(o),h={selector:s,tag:u,visible:p,depth:v},A=o.getAttribute("type");A&&(h.type=A);const S=o.getAttribute("placeholder")||o.getAttribute("aria-label")||o.getAttribute("title")||"";S&&(h.placeholder=S.trim().slice(0,80));const k=((N=o.innerText)==null?void 0:N.trim())??"";return k&&k.length>0&&(h.text=k.slice(0,50)),h}const Xd=["input","textarea","select",'[contenteditable="true"]',"button","a[href]","label",'[role="button"]','[role="link"]','[role="textbox"]','[role="combobox"]','[role="listbox"]','[role="menuitem"]','[role="tab"]','[role="checkbox"]','[role="radio"]','[role="switch"]',"nav","main","form"].join(", ");function Zd(){try{const o=[],u=new Set,s=document.querySelectorAll(Xd);for(const p of Array.from(s)){if(o.length>=Vd)break;const v=qd(p);v&&(u.has(v.selector)||(u.add(v.selector),o.push(v)))}return{elements:o}}catch{return{elements:[]}}}const ui=5e3;function ep(){try{const o=document.body;if(!o)return"";const s=(o.innerText??"").replace(/\r\n/g,`
`).replace(/\r/g,`
`).replace(/\n{3,}/g,`

`).replace(/[ \t]{2,}/g," ").trim();return s.length<=ui?s:s.slice(0,ui)+"…"}catch{return""}}function ci(){return{text:rp(),url:lp(),pageTitle:ap(),pageText:ep(),domSkeleton:JSON.stringify(Zd()),bbox:op()}}const tp=50;async function np(){var A;const o=ci();if(o.text)return o;const u=`gauntlet-cid-${Math.random().toString(36).slice(2)}`,s=[],p=S=>{const k=S.data;!k||k.gauntlet!=="subframe-selection-response"||k.cid===u&&(typeof k.text!="string"||!k.text||s.push({text:k.text,url:typeof k.url=="string"?k.url:void 0,pageTitle:typeof k.pageTitle=="string"?k.pageTitle:void 0}))};window.addEventListener("message",p);let v=null;try{v=document.querySelectorAll("iframe")}catch{v=null}if(v)for(const S of Array.from(v))try{(A=S.contentWindow)==null||A.postMessage({gauntlet:"subframe-selection-request",cid:u},"*")}catch{}await new Promise(S=>window.setTimeout(S,tp)),window.removeEventListener("message",p);const h=s.sort((S,k)=>k.text.length-S.text.length)[0];return h?{...o,text:h.text,url:h.url||o.url,pageTitle:h.pageTitle||o.pageTitle,bbox:null}:o}function rp(){try{const o=window.getSelection();return o?o.toString().trim():""}catch{return""}}function lp(){try{return window.location.href}catch{return""}}function ap(){try{return document.title??""}catch{return""}}function op(){try{const o=window.getSelection();if(!o||o.rangeCount===0||o.isCollapsed)return null;const s=o.getRangeAt(0).getBoundingClientRect();return s.width===0&&s.height===0?null:{x:s.x,y:s.y,width:s.width,height:s.height}}catch{return null}}const sp={domExecution:!0,pillSurface:!0,screenshot:!0,dismissDomain:!0,voice:typeof window<"u"&&("SpeechRecognition"in window||"webkitSpeechRecognition"in window),streaming:!0,refreshSelection:!0,filesystemRead:!1,filesystemWrite:!1,screenCapture:!1,remoteVoice:!0,shellExecute:!1};async function ip(o,u,s){const p=await chrome.runtime.sendMessage({type:"gauntlet:fetch",url:u,method:o,headers:{"content-type":"application/json"},body:s===void 0?void 0:JSON.stringify(s)});if(!p||!p.ok)throw new Error(`composer: background fetch failed — ${(p==null?void 0:p.error)??"unknown error"}`);let v=null;if(p.body!=null&&p.body!=="")try{v=JSON.parse(p.body)}catch{v=p.body}const h=p.status??0;if(h<200||h>=300)throw new Error(`composer: ${h} ${p.statusText??""}`.trim());return v}const up={async get(o){try{return(await chrome.storage.local.get(o))[o]??null}catch{return null}},async set(o,u){try{await chrome.storage.local.set({[o]:u})}catch{}},async remove(o){try{await chrome.storage.local.remove(o)}catch{}}};function cp(o,u,s){const p=chrome.runtime.connect({name:"gauntlet:stream"});let v=!1;function h(){if(!v){v=!0;try{p.disconnect()}catch{}}}return p.onMessage.addListener(A=>{if(!A||typeof A!="object")return;const S=A;if(S.type==="sse"&&typeof S.data=="string"){let k=null;try{k=JSON.parse(S.data)}catch{s.onError("malformed SSE payload"),h();return}if(S.event==="delta"){const N=k.text??"";s.onDelta(N)}else if(S.event==="done"){const N=k;s.onDone({plan_id:N.plan_id??"",context_id:N.context_id??"",actions:N.actions??[],compose:N.compose??null,reason:N.reason??null,model_used:N.model_used??"",latency_ms:N.latency_ms??0,raw_response:null}),h()}else if(S.event==="error"){const N=k.error??"model error";s.onError(N),h()}}else S.type==="error"?(s.onError(S.error??"transport error"),h()):S.type==="closed"&&(v||(s.onDone({plan_id:"",context_id:"",actions:[],compose:null,reason:"stream ended without result",model_used:"",latency_ms:0,raw_response:null}),v=!0))}),p.onDisconnect.addListener(()=>{var A;if(!v){const S=(A=chrome.runtime.lastError)==null?void 0:A.message;s.onError(S??"disconnected"),v=!0}}),p.postMessage({type:"start",url:o,body:u}),()=>{if(!v){try{p.postMessage({type:"abort"})}catch{}h()}}}function dp(){return{shell:"browser",capabilities:sp,transport:{fetchJson(o,u,s){return ip(o,u,s)},stream:cp},storage:up,selection:{read:()=>ci(),readAsync:()=>np()},domActions:{execute:yd},screenshot:{async capture(){var o;if(typeof chrome>"u"||!((o=chrome.runtime)!=null&&o.sendMessage))return null;try{const u=await chrome.runtime.sendMessage({type:"gauntlet:capture_screenshot"});return!(u!=null&&u.ok)||!u.dataUrl?null:u.dataUrl}catch{return null}}},debug:{async lastSummon(){try{const o=await chrome.runtime.sendMessage({type:"gauntlet:debug"});return(o==null?void 0:o.lastSummon)??null}catch{return null}}}}}const pp=Od+Hd;function fp(){const o=b.useMemo(()=>dp(),[]),u=b.useMemo(()=>ai(o.storage),[o]),[s,p]=b.useState({kind:"pill"}),[v,h]=b.useState(ri),[A,S]=b.useState(ni),[k,N]=b.useState(!1),[j,C]=b.useState(null),[U,ue]=b.useState(null),[le,ne]=b.useState(!1);b.useEffect(()=>{function F(){let T=!1;try{const D=window.getSelection();T=!!(D&&D.toString().trim().length>0)}catch{T=!1}ne(D=>D===T?D:T)}return F(),document.addEventListener("selectionchange",F,{passive:!0}),()=>document.removeEventListener("selectionchange",F)},[]),b.useEffect(()=>{function F(D){const B=D.detail,Y=(B==null?void 0:B.ok)===!1?"fail":"ok";C(Y),window.setTimeout(()=>C(null),1500)}function T(D){const B=D.detail;B!=null&&B.phase&&(ue(B.phase),(B.phase==="executed"||B.phase==="error")&&window.setTimeout(()=>ue(null),3500))}return window.addEventListener("gauntlet:execute-result",F),window.addEventListener("gauntlet:phase",T),()=>{window.removeEventListener("gauntlet:execute-result",F),window.removeEventListener("gauntlet:phase",T)}},[]);const ie=b.useRef(null);b.useEffect(()=>{function F(T){ie.current={x:T.clientX,y:T.clientY}}return window.addEventListener("mousemove",F,{passive:!0}),()=>window.removeEventListener("mousemove",F)},[]),b.useEffect(()=>{let F=!1;u.readPillPosition().then(B=>{F||h(B)}),u.readPillMode().then(B=>{F||S(B)});function T(B){const Y=B.detail;((Y==null?void 0:Y.mode)==="cursor"||(Y==null?void 0:Y.mode)==="corner")&&S(Y.mode)}window.addEventListener("gauntlet:pill-mode",T);const D=(()=>{try{return window.location.hostname}catch{return""}})();return D&&u.isDomainDismissed(D).then(B=>{F||!B||(N(!0),p(Y=>Y.kind==="pill"?{kind:"gone"}:Y))}),()=>{F=!0,window.removeEventListener("gauntlet:pill-mode",T)}},[u]);const z=b.useCallback(()=>{const F=ie.current;p(T=>({kind:"capsule",snapshot:o.selection.read(),cursor:F,nonce:T.kind==="capsule"?T.nonce+1:1})),o.selection.readAsync&&o.selection.readAsync().then(T=>{p(D=>D.kind!=="capsule"||!T.text||T.text===D.snapshot.text?D:{...D,snapshot:T})})},[o]),Se=b.useCallback(()=>{p(k?{kind:"gone"}:{kind:"pill"})},[k]),Ne=b.useCallback(()=>{const F=(()=>{try{return window.location.hostname}catch{return""}})();F&&u.dismissDomain(F),N(!0),p({kind:"gone"})},[u]),ke=b.useCallback(F=>{u.writePillPosition(F)},[u]);return b.useEffect(()=>{function F(T,D,B){if(!T||typeof T!="object")return!1;const Y=T.type;return Y==="gauntlet:summon"?(z(),B({ok:!0}),!1):(Y==="gauntlet:dismiss"&&(Se(),B({ok:!0})),!1)}return chrome.runtime.onMessage.addListener(F),()=>chrome.runtime.onMessage.removeListener(F)},[z,Se]),s.kind==="gone"?null:s.kind==="pill"?d.jsx(Ud,{position:v,mode:A,onClick:z,onDismissDomain:Ne,onPersistPosition:ke,flash:j,phase:U,hasContext:le,disconnected:U==="error"}):d.jsx(Nd,{ambient:o,initialSnapshot:s.snapshot,cursorAnchor:s.cursor,onDismiss:Se},s.nonce)}const di="gauntlet-capsule-host",gp={matches:["<all_urls>"],runAt:"document_idle",cssInjectionMode:"manual",async main(){if(window.top!==window.self){window.addEventListener("message",h=>{var N;const A=h.data;if(!A||A.gauntlet!=="subframe-selection-request")return;const S=window.getSelection(),k=S?S.toString().trim():"";(N=h.source)==null||N.postMessage({gauntlet:"subframe-selection-response",cid:A.cid,text:k,url:window.location.href,pageTitle:document.title},{targetOrigin:"*"})});return}if(document.getElementById(di))return;const o=document.createElement("div");o.id=di,Object.assign(o.style,{position:"fixed",inset:"0",zIndex:"2147483647",pointerEvents:"none",all:"initial"});const u=o.attachShadow({mode:"open"}),s=document.createElement("style");s.textContent=pp,u.appendChild(s);const p=document.createElement("div");u.appendChild(p),document.documentElement.appendChild(o),Vc.createRoot(p).render(d.jsx(b.StrictMode,{children:d.jsx(fp,{})}))}};var Al={exports:{}},mp=Al.exports,pi;function hp(){return pi||(pi=1,(function(o,u){(function(s,p){p(o)})(typeof globalThis<"u"?globalThis:typeof self<"u"?self:mp,function(s){if(!(globalThis.chrome&&globalThis.chrome.runtime&&globalThis.chrome.runtime.id))throw new Error("This script should only be loaded in a browser extension.");if(globalThis.browser&&globalThis.browser.runtime&&globalThis.browser.runtime.id)s.exports=globalThis.browser;else{const p="The message port closed before a response was received.",v=h=>{const A={alarms:{clear:{minArgs:0,maxArgs:1},clearAll:{minArgs:0,maxArgs:0},get:{minArgs:0,maxArgs:1},getAll:{minArgs:0,maxArgs:0}},bookmarks:{create:{minArgs:1,maxArgs:1},get:{minArgs:1,maxArgs:1},getChildren:{minArgs:1,maxArgs:1},getRecent:{minArgs:1,maxArgs:1},getSubTree:{minArgs:1,maxArgs:1},getTree:{minArgs:0,maxArgs:0},move:{minArgs:2,maxArgs:2},remove:{minArgs:1,maxArgs:1},removeTree:{minArgs:1,maxArgs:1},search:{minArgs:1,maxArgs:1},update:{minArgs:2,maxArgs:2}},browserAction:{disable:{minArgs:0,maxArgs:1,fallbackToNoCallback:!0},enable:{minArgs:0,maxArgs:1,fallbackToNoCallback:!0},getBadgeBackgroundColor:{minArgs:1,maxArgs:1},getBadgeText:{minArgs:1,maxArgs:1},getPopup:{minArgs:1,maxArgs:1},getTitle:{minArgs:1,maxArgs:1},openPopup:{minArgs:0,maxArgs:0},setBadgeBackgroundColor:{minArgs:1,maxArgs:1,fallbackToNoCallback:!0},setBadgeText:{minArgs:1,maxArgs:1,fallbackToNoCallback:!0},setIcon:{minArgs:1,maxArgs:1},setPopup:{minArgs:1,maxArgs:1,fallbackToNoCallback:!0},setTitle:{minArgs:1,maxArgs:1,fallbackToNoCallback:!0}},browsingData:{remove:{minArgs:2,maxArgs:2},removeCache:{minArgs:1,maxArgs:1},removeCookies:{minArgs:1,maxArgs:1},removeDownloads:{minArgs:1,maxArgs:1},removeFormData:{minArgs:1,maxArgs:1},removeHistory:{minArgs:1,maxArgs:1},removeLocalStorage:{minArgs:1,maxArgs:1},removePasswords:{minArgs:1,maxArgs:1},removePluginData:{minArgs:1,maxArgs:1},settings:{minArgs:0,maxArgs:0}},commands:{getAll:{minArgs:0,maxArgs:0}},contextMenus:{remove:{minArgs:1,maxArgs:1},removeAll:{minArgs:0,maxArgs:0},update:{minArgs:2,maxArgs:2}},cookies:{get:{minArgs:1,maxArgs:1},getAll:{minArgs:1,maxArgs:1},getAllCookieStores:{minArgs:0,maxArgs:0},remove:{minArgs:1,maxArgs:1},set:{minArgs:1,maxArgs:1}},devtools:{inspectedWindow:{eval:{minArgs:1,maxArgs:2,singleCallbackArg:!1}},panels:{create:{minArgs:3,maxArgs:3,singleCallbackArg:!0},elements:{createSidebarPane:{minArgs:1,maxArgs:1}}}},downloads:{cancel:{minArgs:1,maxArgs:1},download:{minArgs:1,maxArgs:1},erase:{minArgs:1,maxArgs:1},getFileIcon:{minArgs:1,maxArgs:2},open:{minArgs:1,maxArgs:1,fallbackToNoCallback:!0},pause:{minArgs:1,maxArgs:1},removeFile:{minArgs:1,maxArgs:1},resume:{minArgs:1,maxArgs:1},search:{minArgs:1,maxArgs:1},show:{minArgs:1,maxArgs:1,fallbackToNoCallback:!0}},extension:{isAllowedFileSchemeAccess:{minArgs:0,maxArgs:0},isAllowedIncognitoAccess:{minArgs:0,maxArgs:0}},history:{addUrl:{minArgs:1,maxArgs:1},deleteAll:{minArgs:0,maxArgs:0},deleteRange:{minArgs:1,maxArgs:1},deleteUrl:{minArgs:1,maxArgs:1},getVisits:{minArgs:1,maxArgs:1},search:{minArgs:1,maxArgs:1}},i18n:{detectLanguage:{minArgs:1,maxArgs:1},getAcceptLanguages:{minArgs:0,maxArgs:0}},identity:{launchWebAuthFlow:{minArgs:1,maxArgs:1}},idle:{queryState:{minArgs:1,maxArgs:1}},management:{get:{minArgs:1,maxArgs:1},getAll:{minArgs:0,maxArgs:0},getSelf:{minArgs:0,maxArgs:0},setEnabled:{minArgs:2,maxArgs:2},uninstallSelf:{minArgs:0,maxArgs:1}},notifications:{clear:{minArgs:1,maxArgs:1},create:{minArgs:1,maxArgs:2},getAll:{minArgs:0,maxArgs:0},getPermissionLevel:{minArgs:0,maxArgs:0},update:{minArgs:2,maxArgs:2}},pageAction:{getPopup:{minArgs:1,maxArgs:1},getTitle:{minArgs:1,maxArgs:1},hide:{minArgs:1,maxArgs:1,fallbackToNoCallback:!0},setIcon:{minArgs:1,maxArgs:1},setPopup:{minArgs:1,maxArgs:1,fallbackToNoCallback:!0},setTitle:{minArgs:1,maxArgs:1,fallbackToNoCallback:!0},show:{minArgs:1,maxArgs:1,fallbackToNoCallback:!0}},permissions:{contains:{minArgs:1,maxArgs:1},getAll:{minArgs:0,maxArgs:0},remove:{minArgs:1,maxArgs:1},request:{minArgs:1,maxArgs:1}},runtime:{getBackgroundPage:{minArgs:0,maxArgs:0},getPlatformInfo:{minArgs:0,maxArgs:0},openOptionsPage:{minArgs:0,maxArgs:0},requestUpdateCheck:{minArgs:0,maxArgs:0},sendMessage:{minArgs:1,maxArgs:3},sendNativeMessage:{minArgs:2,maxArgs:2},setUninstallURL:{minArgs:1,maxArgs:1}},sessions:{getDevices:{minArgs:0,maxArgs:1},getRecentlyClosed:{minArgs:0,maxArgs:1},restore:{minArgs:0,maxArgs:1}},storage:{local:{clear:{minArgs:0,maxArgs:0},get:{minArgs:0,maxArgs:1},getBytesInUse:{minArgs:0,maxArgs:1},remove:{minArgs:1,maxArgs:1},set:{minArgs:1,maxArgs:1}},managed:{get:{minArgs:0,maxArgs:1},getBytesInUse:{minArgs:0,maxArgs:1}},sync:{clear:{minArgs:0,maxArgs:0},get:{minArgs:0,maxArgs:1},getBytesInUse:{minArgs:0,maxArgs:1},remove:{minArgs:1,maxArgs:1},set:{minArgs:1,maxArgs:1}}},tabs:{captureVisibleTab:{minArgs:0,maxArgs:2},create:{minArgs:1,maxArgs:1},detectLanguage:{minArgs:0,maxArgs:1},discard:{minArgs:0,maxArgs:1},duplicate:{minArgs:1,maxArgs:1},executeScript:{minArgs:1,maxArgs:2},get:{minArgs:1,maxArgs:1},getCurrent:{minArgs:0,maxArgs:0},getZoom:{minArgs:0,maxArgs:1},getZoomSettings:{minArgs:0,maxArgs:1},goBack:{minArgs:0,maxArgs:1},goForward:{minArgs:0,maxArgs:1},highlight:{minArgs:1,maxArgs:1},insertCSS:{minArgs:1,maxArgs:2},move:{minArgs:2,maxArgs:2},query:{minArgs:1,maxArgs:1},reload:{minArgs:0,maxArgs:2},remove:{minArgs:1,maxArgs:1},removeCSS:{minArgs:1,maxArgs:2},sendMessage:{minArgs:2,maxArgs:3},setZoom:{minArgs:1,maxArgs:2},setZoomSettings:{minArgs:1,maxArgs:2},update:{minArgs:1,maxArgs:2}},topSites:{get:{minArgs:0,maxArgs:0}},webNavigation:{getAllFrames:{minArgs:1,maxArgs:1},getFrame:{minArgs:1,maxArgs:1}},webRequest:{handlerBehaviorChanged:{minArgs:0,maxArgs:0}},windows:{create:{minArgs:0,maxArgs:1},get:{minArgs:1,maxArgs:2},getAll:{minArgs:0,maxArgs:1},getCurrent:{minArgs:0,maxArgs:1},getLastFocused:{minArgs:0,maxArgs:1},remove:{minArgs:1,maxArgs:1},update:{minArgs:2,maxArgs:2}}};if(Object.keys(A).length===0)throw new Error("api-metadata.json has not been included in browser-polyfill");class S extends WeakMap{constructor(D,B=void 0){super(B),this.createItem=D}get(D){return this.has(D)||this.set(D,this.createItem(D)),super.get(D)}}const k=T=>T&&typeof T=="object"&&typeof T.then=="function",N=(T,D)=>(...B)=>{h.runtime.lastError?T.reject(new Error(h.runtime.lastError.message)):D.singleCallbackArg||B.length<=1&&D.singleCallbackArg!==!1?T.resolve(B[0]):T.resolve(B)},j=T=>T==1?"argument":"arguments",C=(T,D)=>function(Y,...xe){if(xe.length<D.minArgs)throw new Error(`Expected at least ${D.minArgs} ${j(D.minArgs)} for ${T}(), got ${xe.length}`);if(xe.length>D.maxArgs)throw new Error(`Expected at most ${D.maxArgs} ${j(D.maxArgs)} for ${T}(), got ${xe.length}`);return new Promise((Te,Ce)=>{if(D.fallbackToNoCallback)try{Y[T](...xe,N({resolve:Te,reject:Ce},D))}catch(q){console.warn(`${T} API method doesn't seem to support the callback parameter, falling back to call it without a callback: `,q),Y[T](...xe),D.fallbackToNoCallback=!1,D.noCallback=!0,Te()}else D.noCallback?(Y[T](...xe),Te()):Y[T](...xe,N({resolve:Te,reject:Ce},D))})},U=(T,D,B)=>new Proxy(D,{apply(Y,xe,Te){return B.call(xe,T,...Te)}});let ue=Function.call.bind(Object.prototype.hasOwnProperty);const le=(T,D={},B={})=>{let Y=Object.create(null),xe={has(Ce,q){return q in T||q in Y},get(Ce,q,Ae){if(q in Y)return Y[q];if(!(q in T))return;let ye=T[q];if(typeof ye=="function")if(typeof D[q]=="function")ye=U(T,T[q],D[q]);else if(ue(B,q)){let Pe=C(q,B[q]);ye=U(T,T[q],Pe)}else ye=ye.bind(T);else if(typeof ye=="object"&&ye!==null&&(ue(D,q)||ue(B,q)))ye=le(ye,D[q],B[q]);else if(ue(B,"*"))ye=le(ye,D[q],B["*"]);else return Object.defineProperty(Y,q,{configurable:!0,enumerable:!0,get(){return T[q]},set(Pe){T[q]=Pe}}),ye;return Y[q]=ye,ye},set(Ce,q,Ae,ye){return q in Y?Y[q]=Ae:T[q]=Ae,!0},defineProperty(Ce,q,Ae){return Reflect.defineProperty(Y,q,Ae)},deleteProperty(Ce,q){return Reflect.deleteProperty(Y,q)}},Te=Object.create(T);return new Proxy(Te,xe)},ne=T=>({addListener(D,B,...Y){D.addListener(T.get(B),...Y)},hasListener(D,B){return D.hasListener(T.get(B))},removeListener(D,B){D.removeListener(T.get(B))}}),ie=new S(T=>typeof T!="function"?T:function(B){const Y=le(B,{},{getContent:{minArgs:0,maxArgs:0}});T(Y)}),z=new S(T=>typeof T!="function"?T:function(B,Y,xe){let Te=!1,Ce,q=new Promise(ge=>{Ce=function($){Te=!0,ge($)}}),Ae;try{Ae=T(B,Y,Ce)}catch(ge){Ae=Promise.reject(ge)}const ye=Ae!==!0&&k(Ae);if(Ae!==!0&&!ye&&!Te)return!1;const Pe=ge=>{ge.then($=>{xe($)},$=>{let G;$&&($ instanceof Error||typeof $.message=="string")?G=$.message:G="An unexpected error occurred",xe({__mozWebExtensionPolyfillReject__:!0,message:G})}).catch($=>{console.error("Failed to send onMessage rejected reply",$)})};return Pe(ye?Ae:q),!0}),Se=({reject:T,resolve:D},B)=>{h.runtime.lastError?h.runtime.lastError.message===p?D():T(new Error(h.runtime.lastError.message)):B&&B.__mozWebExtensionPolyfillReject__?T(new Error(B.message)):D(B)},Ne=(T,D,B,...Y)=>{if(Y.length<D.minArgs)throw new Error(`Expected at least ${D.minArgs} ${j(D.minArgs)} for ${T}(), got ${Y.length}`);if(Y.length>D.maxArgs)throw new Error(`Expected at most ${D.maxArgs} ${j(D.maxArgs)} for ${T}(), got ${Y.length}`);return new Promise((xe,Te)=>{const Ce=Se.bind(null,{resolve:xe,reject:Te});Y.push(Ce),B.sendMessage(...Y)})},ke={devtools:{network:{onRequestFinished:ne(ie)}},runtime:{onMessage:ne(z),onMessageExternal:ne(z),sendMessage:Ne.bind(null,"sendMessage",{minArgs:1,maxArgs:3})},tabs:{sendMessage:Ne.bind(null,"sendMessage",{minArgs:2,maxArgs:3})}},F={clear:{minArgs:1,maxArgs:1},get:{minArgs:1,maxArgs:1},set:{minArgs:1,maxArgs:1}};return A.privacy={network:{"*":F},services:{"*":F},websites:{"*":F}},le(h,ke,A)};s.exports=v(chrome)}})})(Al)),Al.exports}var xp=hp();const Nl=Qt(xp);function Tl(o,...u){}const vp={debug:(...o)=>Tl(console.debug,...o),log:(...o)=>Tl(console.log,...o),warn:(...o)=>Tl(console.warn,...o),error:(...o)=>Tl(console.error,...o)},jl=class jl extends Event{constructor(u,s){super(jl.EVENT_NAME,{}),this.newUrl=u,this.oldUrl=s}};nr(jl,"EVENT_NAME",Ja("wxt:locationchange"));let Qa=jl;function Ja(o){var u;return`${(u=Nl==null?void 0:Nl.runtime)==null?void 0:u.id}:content:${o}`}function yp(o){let u,s;return{run(){u==null&&(s=new URL(location.href),u=o.setInterval(()=>{let p=new URL(location.href);p.href!==s.href&&(window.dispatchEvent(new Qa(p,s)),s=p)},1e3))}}}const $r=class $r{constructor(u,s){nr(this,"isTopFrame",window.self===window.top);nr(this,"abortController");nr(this,"locationWatcher",yp(this));nr(this,"receivedMessageIds",new Set);this.contentScriptName=u,this.options=s,this.abortController=new AbortController,this.isTopFrame?(this.listenForNewerScripts({ignoreFirstEvent:!0}),this.stopOldScripts()):this.listenForNewerScripts()}get signal(){return this.abortController.signal}abort(u){return this.abortController.abort(u)}get isInvalid(){return Nl.runtime.id==null&&this.notifyInvalidated(),this.signal.aborted}get isValid(){return!this.isInvalid}onInvalidated(u){return this.signal.addEventListener("abort",u),()=>this.signal.removeEventListener("abort",u)}block(){return new Promise(()=>{})}setInterval(u,s){const p=setInterval(()=>{this.isValid&&u()},s);return this.onInvalidated(()=>clearInterval(p)),p}setTimeout(u,s){const p=setTimeout(()=>{this.isValid&&u()},s);return this.onInvalidated(()=>clearTimeout(p)),p}requestAnimationFrame(u){const s=requestAnimationFrame((...p)=>{this.isValid&&u(...p)});return this.onInvalidated(()=>cancelAnimationFrame(s)),s}requestIdleCallback(u,s){const p=requestIdleCallback((...v)=>{this.signal.aborted||u(...v)},s);return this.onInvalidated(()=>cancelIdleCallback(p)),p}addEventListener(u,s,p,v){var h;s==="wxt:locationchange"&&this.isValid&&this.locationWatcher.run(),(h=u.addEventListener)==null||h.call(u,s.startsWith("wxt:")?Ja(s):s,p,{...v,signal:this.signal})}notifyInvalidated(){this.abort("Content script context invalidated"),vp.debug(`Content script "${this.contentScriptName}" context invalidated`)}stopOldScripts(){window.postMessage({type:$r.SCRIPT_STARTED_MESSAGE_TYPE,contentScriptName:this.contentScriptName,messageId:Math.random().toString(36).slice(2)},"*")}verifyScriptStartedEvent(u){var h,A,S;const s=((h=u.data)==null?void 0:h.type)===$r.SCRIPT_STARTED_MESSAGE_TYPE,p=((A=u.data)==null?void 0:A.contentScriptName)===this.contentScriptName,v=!this.receivedMessageIds.has((S=u.data)==null?void 0:S.messageId);return s&&p&&v}listenForNewerScripts(u){let s=!0;const p=v=>{if(this.verifyScriptStartedEvent(v)){this.receivedMessageIds.add(v.data.messageId);const h=s;if(s=!1,h&&(u!=null&&u.ignoreFirstEvent))return;this.notifyInvalidated()}};addEventListener("message",p),this.onInvalidated(()=>removeEventListener("message",p))}};nr($r,"SCRIPT_STARTED_MESSAGE_TYPE",Ja("wxt:content-script-started"));let Ga=$r;const _p=Symbol("null");let wp=0;class kp extends Map{constructor(...u){super(),this._objectHashes=new WeakMap,this._symbolHashes=new Map,this._publicKeys=new Map;const[s]=u;if(s!=null){if(typeof s[Symbol.iterator]!="function")throw new TypeError(typeof s+" is not iterable (cannot read property Symbol(Symbol.iterator))");for(const[p,v]of s)this.set(p,v)}}_getPublicKeys(u,s=!1){if(!Array.isArray(u))throw new TypeError("The keys parameter must be an array");const p=this._getPrivateKey(u,s);let v;return p&&this._publicKeys.has(p)?v=this._publicKeys.get(p):s&&(v=[...u],this._publicKeys.set(p,v)),{privateKey:p,publicKey:v}}_getPrivateKey(u,s=!1){const p=[];for(const v of u){const h=v===null?_p:v;let A;if(typeof h=="object"||typeof h=="function"?A="_objectHashes":typeof h=="symbol"?A="_symbolHashes":A=!1,!A)p.push(h);else if(this[A].has(h))p.push(this[A].get(h));else if(s){const S=`@@mkm-ref-${wp++}@@`;this[A].set(h,S),p.push(S)}else return!1}return JSON.stringify(p)}set(u,s){const{publicKey:p}=this._getPublicKeys(u,!0);return super.set(p,s)}get(u){const{publicKey:s}=this._getPublicKeys(u);return super.get(s)}has(u){const{publicKey:s}=this._getPublicKeys(u);return super.has(s)}delete(u){const{publicKey:s,privateKey:p}=this._getPublicKeys(u);return!!(s&&super.delete(s)&&this._publicKeys.delete(p))}clear(){super.clear(),this._symbolHashes.clear(),this._publicKeys.clear()}get[Symbol.toStringTag](){return"ManyKeysMap"}get size(){return super.size}}new kp;function pg(){}function Pl(o,...u){}const bp={debug:(...o)=>Pl(console.debug,...o),log:(...o)=>Pl(console.log,...o),warn:(...o)=>Pl(console.warn,...o),error:(...o)=>Pl(console.error,...o)};return(async()=>{try{const{main:o,...u}=gp,s=new Ga("content",u);return await o(s)}catch(o){throw bp.error('The content script "content" crashed on startup!',o),o}})()})();
content;
