var content=(function(){"use strict";var sg=Object.defineProperty;var ig=(Kt,Yt,fn)=>Yt in Kt?sg(Kt,Yt,{enumerable:!0,configurable:!0,writable:!0,value:fn}):Kt[Yt]=fn;var sr=(Kt,Yt,fn)=>ig(Kt,typeof Yt!="symbol"?Yt+"":Yt,fn);var Kt=typeof document<"u"?document.currentScript:null;function Yt(o){return o&&o.__esModule&&Object.prototype.hasOwnProperty.call(o,"default")?o.default:o}var fn={exports:{}},Wr={},Ua={exports:{}},me={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Ds;function Dc(){if(Ds)return me;Ds=1;var o=Symbol.for("react.element"),u=Symbol.for("react.portal"),s=Symbol.for("react.fragment"),p=Symbol.for("react.strict_mode"),v=Symbol.for("react.profiler"),h=Symbol.for("react.provider"),T=Symbol.for("react.context"),E=Symbol.for("react.forward_ref"),b=Symbol.for("react.suspense"),N=Symbol.for("react.memo"),j=Symbol.for("react.lazy"),A=Symbol.iterator;function W(f){return f===null||typeof f!="object"?null:(f=A&&f[A]||f["@@iterator"],typeof f=="function"?f:null)}var ce={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},le=Object.assign,re={};function ue(f,C,ne){this.props=f,this.context=C,this.refs=re,this.updater=ne||ce}ue.prototype.isReactComponent={},ue.prototype.setState=function(f,C){if(typeof f!="object"&&typeof f!="function"&&f!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,f,C,"setState")},ue.prototype.forceUpdate=function(f){this.updater.enqueueForceUpdate(this,f,"forceUpdate")};function M(){}M.prototype=ue.prototype;function Ee(f,C,ne){this.props=f,this.context=C,this.refs=re,this.updater=ne||ce}var Te=Ee.prototype=new M;Te.constructor=Ee,le(Te,ue.prototype),Te.isPureReactComponent=!0;var be=Array.isArray,B=Object.prototype.hasOwnProperty,P={current:null},D={key:!0,ref:!0,__self:!0,__source:!0};function U(f,C,ne){var ae,de={},pe=null,oe=null;if(C!=null)for(ae in C.ref!==void 0&&(oe=C.ref),C.key!==void 0&&(pe=""+C.key),C)B.call(C,ae)&&!D.hasOwnProperty(ae)&&(de[ae]=C[ae]);var he=arguments.length-2;if(he===1)de.children=ne;else if(1<he){for(var ge=Array(he),Me=0;Me<he;Me++)ge[Me]=arguments[Me+2];de.children=ge}if(f&&f.defaultProps)for(ae in he=f.defaultProps,he)de[ae]===void 0&&(de[ae]=he[ae]);return{$$typeof:o,type:f,key:pe,ref:oe,props:de,_owner:P.current}}function J(f,C){return{$$typeof:o,type:f.type,key:C,ref:f.ref,props:f.props,_owner:f._owner}}function xe(f){return typeof f=="object"&&f!==null&&f.$$typeof===o}function Pe(f){var C={"=":"=0",":":"=2"};return"$"+f.replace(/[=:]/g,function(ne){return C[ne]})}var Ae=/\/+/g;function Z(f,C){return typeof f=="object"&&f!==null&&f.key!=null?Pe(""+f.key):C.toString(36)}function Ne(f,C,ne,ae,de){var pe=typeof f;(pe==="undefined"||pe==="boolean")&&(f=null);var oe=!1;if(f===null)oe=!0;else switch(pe){case"string":case"number":oe=!0;break;case"object":switch(f.$$typeof){case o:case u:oe=!0}}if(oe)return oe=f,de=de(oe),f=ae===""?"."+Z(oe,0):ae,be(de)?(ne="",f!=null&&(ne=f.replace(Ae,"$&/")+"/"),Ne(de,C,ne,"",function(Me){return Me})):de!=null&&(xe(de)&&(de=J(de,ne+(!de.key||oe&&oe.key===de.key?"":(""+de.key).replace(Ae,"$&/")+"/")+f)),C.push(de)),1;if(oe=0,ae=ae===""?".":ae+":",be(f))for(var he=0;he<f.length;he++){pe=f[he];var ge=ae+Z(pe,he);oe+=Ne(pe,C,ne,ge,de)}else if(ge=W(f),typeof ge=="function")for(f=ge.call(f),he=0;!(pe=f.next()).done;)pe=pe.value,ge=ae+Z(pe,he++),oe+=Ne(pe,C,ne,ge,de);else if(pe==="object")throw C=String(f),Error("Objects are not valid as a React child (found: "+(C==="[object Object]"?"object with keys {"+Object.keys(f).join(", ")+"}":C)+"). If you meant to render a collection of children, use an array instead.");return oe}function we(f,C,ne){if(f==null)return f;var ae=[],de=0;return Ne(f,ae,"","",function(pe){return C.call(ne,pe,de++)}),ae}function je(f){if(f._status===-1){var C=f._result;C=C(),C.then(function(ne){(f._status===0||f._status===-1)&&(f._status=1,f._result=ne)},function(ne){(f._status===0||f._status===-1)&&(f._status=2,f._result=ne)}),f._status===-1&&(f._status=0,f._result=C)}if(f._status===1)return f._result.default;throw f._result}var fe={current:null},F={transition:null},X={ReactCurrentDispatcher:fe,ReactCurrentBatchConfig:F,ReactCurrentOwner:P};function $(){throw Error("act(...) is not supported in production builds of React.")}return me.Children={map:we,forEach:function(f,C,ne){we(f,function(){C.apply(this,arguments)},ne)},count:function(f){var C=0;return we(f,function(){C++}),C},toArray:function(f){return we(f,function(C){return C})||[]},only:function(f){if(!xe(f))throw Error("React.Children.only expected to receive a single React element child.");return f}},me.Component=ue,me.Fragment=s,me.Profiler=v,me.PureComponent=Ee,me.StrictMode=p,me.Suspense=b,me.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=X,me.act=$,me.cloneElement=function(f,C,ne){if(f==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+f+".");var ae=le({},f.props),de=f.key,pe=f.ref,oe=f._owner;if(C!=null){if(C.ref!==void 0&&(pe=C.ref,oe=P.current),C.key!==void 0&&(de=""+C.key),f.type&&f.type.defaultProps)var he=f.type.defaultProps;for(ge in C)B.call(C,ge)&&!D.hasOwnProperty(ge)&&(ae[ge]=C[ge]===void 0&&he!==void 0?he[ge]:C[ge])}var ge=arguments.length-2;if(ge===1)ae.children=ne;else if(1<ge){he=Array(ge);for(var Me=0;Me<ge;Me++)he[Me]=arguments[Me+2];ae.children=he}return{$$typeof:o,type:f.type,key:de,ref:pe,props:ae,_owner:oe}},me.createContext=function(f){return f={$$typeof:T,_currentValue:f,_currentValue2:f,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},f.Provider={$$typeof:h,_context:f},f.Consumer=f},me.createElement=U,me.createFactory=function(f){var C=U.bind(null,f);return C.type=f,C},me.createRef=function(){return{current:null}},me.forwardRef=function(f){return{$$typeof:E,render:f}},me.isValidElement=xe,me.lazy=function(f){return{$$typeof:j,_payload:{_status:-1,_result:f},_init:je}},me.memo=function(f,C){return{$$typeof:N,type:f,compare:C===void 0?null:C}},me.startTransition=function(f){var C=F.transition;F.transition={};try{f()}finally{F.transition=C}},me.unstable_act=$,me.useCallback=function(f,C){return fe.current.useCallback(f,C)},me.useContext=function(f){return fe.current.useContext(f)},me.useDebugValue=function(){},me.useDeferredValue=function(f){return fe.current.useDeferredValue(f)},me.useEffect=function(f,C){return fe.current.useEffect(f,C)},me.useId=function(){return fe.current.useId()},me.useImperativeHandle=function(f,C,ne){return fe.current.useImperativeHandle(f,C,ne)},me.useInsertionEffect=function(f,C){return fe.current.useInsertionEffect(f,C)},me.useLayoutEffect=function(f,C){return fe.current.useLayoutEffect(f,C)},me.useMemo=function(f,C){return fe.current.useMemo(f,C)},me.useReducer=function(f,C,ne){return fe.current.useReducer(f,C,ne)},me.useRef=function(f){return fe.current.useRef(f)},me.useState=function(f){return fe.current.useState(f)},me.useSyncExternalStore=function(f,C,ne){return fe.current.useSyncExternalStore(f,C,ne)},me.useTransition=function(){return fe.current.useTransition()},me.version="18.3.1",me}var $s;function Wa(){return $s||($s=1,Ua.exports=Dc()),Ua.exports}/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Is;function $c(){if(Is)return Wr;Is=1;var o=Wa(),u=Symbol.for("react.element"),s=Symbol.for("react.fragment"),p=Object.prototype.hasOwnProperty,v=o.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,h={key:!0,ref:!0,__self:!0,__source:!0};function T(E,b,N){var j,A={},W=null,ce=null;N!==void 0&&(W=""+N),b.key!==void 0&&(W=""+b.key),b.ref!==void 0&&(ce=b.ref);for(j in b)p.call(b,j)&&!h.hasOwnProperty(j)&&(A[j]=b[j]);if(E&&E.defaultProps)for(j in b=E.defaultProps,b)A[j]===void 0&&(A[j]=b[j]);return{$$typeof:u,type:E,key:W,ref:ce,props:A,_owner:v.current}}return Wr.Fragment=s,Wr.jsx=T,Wr.jsxs=T,Wr}var Os;function Ic(){return Os||(Os=1,fn.exports=$c()),fn.exports}var d=Ic();function ug(o){return o}var k=Wa(),Tl={},Ha={exports:{}},at={},Va={exports:{}},Ka={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Fs;function Oc(){return Fs||(Fs=1,(function(o){function u(F,X){var $=F.length;F.push(X);e:for(;0<$;){var f=$-1>>>1,C=F[f];if(0<v(C,X))F[f]=X,F[$]=C,$=f;else break e}}function s(F){return F.length===0?null:F[0]}function p(F){if(F.length===0)return null;var X=F[0],$=F.pop();if($!==X){F[0]=$;e:for(var f=0,C=F.length,ne=C>>>1;f<ne;){var ae=2*(f+1)-1,de=F[ae],pe=ae+1,oe=F[pe];if(0>v(de,$))pe<C&&0>v(oe,de)?(F[f]=oe,F[pe]=$,f=pe):(F[f]=de,F[ae]=$,f=ae);else if(pe<C&&0>v(oe,$))F[f]=oe,F[pe]=$,f=pe;else break e}}return X}function v(F,X){var $=F.sortIndex-X.sortIndex;return $!==0?$:F.id-X.id}if(typeof performance=="object"&&typeof performance.now=="function"){var h=performance;o.unstable_now=function(){return h.now()}}else{var T=Date,E=T.now();o.unstable_now=function(){return T.now()-E}}var b=[],N=[],j=1,A=null,W=3,ce=!1,le=!1,re=!1,ue=typeof setTimeout=="function"?setTimeout:null,M=typeof clearTimeout=="function"?clearTimeout:null,Ee=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function Te(F){for(var X=s(N);X!==null;){if(X.callback===null)p(N);else if(X.startTime<=F)p(N),X.sortIndex=X.expirationTime,u(b,X);else break;X=s(N)}}function be(F){if(re=!1,Te(F),!le)if(s(b)!==null)le=!0,je(B);else{var X=s(N);X!==null&&fe(be,X.startTime-F)}}function B(F,X){le=!1,re&&(re=!1,M(U),U=-1),ce=!0;var $=W;try{for(Te(X),A=s(b);A!==null&&(!(A.expirationTime>X)||F&&!Pe());){var f=A.callback;if(typeof f=="function"){A.callback=null,W=A.priorityLevel;var C=f(A.expirationTime<=X);X=o.unstable_now(),typeof C=="function"?A.callback=C:A===s(b)&&p(b),Te(X)}else p(b);A=s(b)}if(A!==null)var ne=!0;else{var ae=s(N);ae!==null&&fe(be,ae.startTime-X),ne=!1}return ne}finally{A=null,W=$,ce=!1}}var P=!1,D=null,U=-1,J=5,xe=-1;function Pe(){return!(o.unstable_now()-xe<J)}function Ae(){if(D!==null){var F=o.unstable_now();xe=F;var X=!0;try{X=D(!0,F)}finally{X?Z():(P=!1,D=null)}}else P=!1}var Z;if(typeof Ee=="function")Z=function(){Ee(Ae)};else if(typeof MessageChannel<"u"){var Ne=new MessageChannel,we=Ne.port2;Ne.port1.onmessage=Ae,Z=function(){we.postMessage(null)}}else Z=function(){ue(Ae,0)};function je(F){D=F,P||(P=!0,Z())}function fe(F,X){U=ue(function(){F(o.unstable_now())},X)}o.unstable_IdlePriority=5,o.unstable_ImmediatePriority=1,o.unstable_LowPriority=4,o.unstable_NormalPriority=3,o.unstable_Profiling=null,o.unstable_UserBlockingPriority=2,o.unstable_cancelCallback=function(F){F.callback=null},o.unstable_continueExecution=function(){le||ce||(le=!0,je(B))},o.unstable_forceFrameRate=function(F){0>F||125<F?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):J=0<F?Math.floor(1e3/F):5},o.unstable_getCurrentPriorityLevel=function(){return W},o.unstable_getFirstCallbackNode=function(){return s(b)},o.unstable_next=function(F){switch(W){case 1:case 2:case 3:var X=3;break;default:X=W}var $=W;W=X;try{return F()}finally{W=$}},o.unstable_pauseExecution=function(){},o.unstable_requestPaint=function(){},o.unstable_runWithPriority=function(F,X){switch(F){case 1:case 2:case 3:case 4:case 5:break;default:F=3}var $=W;W=F;try{return X()}finally{W=$}},o.unstable_scheduleCallback=function(F,X,$){var f=o.unstable_now();switch(typeof $=="object"&&$!==null?($=$.delay,$=typeof $=="number"&&0<$?f+$:f):$=f,F){case 1:var C=-1;break;case 2:C=250;break;case 5:C=1073741823;break;case 4:C=1e4;break;default:C=5e3}return C=$+C,F={id:j++,callback:X,priorityLevel:F,startTime:$,expirationTime:C,sortIndex:-1},$>f?(F.sortIndex=$,u(N,F),s(b)===null&&F===s(N)&&(re?(M(U),U=-1):re=!0,fe(be,$-f))):(F.sortIndex=C,u(b,F),le||ce||(le=!0,je(B))),F},o.unstable_shouldYield=Pe,o.unstable_wrapCallback=function(F){var X=W;return function(){var $=W;W=X;try{return F.apply(this,arguments)}finally{W=$}}}})(Ka)),Ka}var Bs;function Fc(){return Bs||(Bs=1,Va.exports=Oc()),Va.exports}/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Us;function Bc(){if(Us)return at;Us=1;var o=Wa(),u=Fc();function s(e){for(var t="https://reactjs.org/docs/error-decoder.html?invariant="+e,n=1;n<arguments.length;n++)t+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var p=new Set,v={};function h(e,t){T(e,t),T(e+"Capture",t)}function T(e,t){for(v[e]=t,e=0;e<t.length;e++)p.add(t[e])}var E=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),b=Object.prototype.hasOwnProperty,N=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,j={},A={};function W(e){return b.call(A,e)?!0:b.call(j,e)?!1:N.test(e)?A[e]=!0:(j[e]=!0,!1)}function ce(e,t,n,r){if(n!==null&&n.type===0)return!1;switch(typeof t){case"function":case"symbol":return!0;case"boolean":return r?!1:n!==null?!n.acceptsBooleans:(e=e.toLowerCase().slice(0,5),e!=="data-"&&e!=="aria-");default:return!1}}function le(e,t,n,r){if(t===null||typeof t>"u"||ce(e,t,n,r))return!0;if(r)return!1;if(n!==null)switch(n.type){case 3:return!t;case 4:return t===!1;case 5:return isNaN(t);case 6:return isNaN(t)||1>t}return!1}function re(e,t,n,r,l,a,i){this.acceptsBooleans=t===2||t===3||t===4,this.attributeName=r,this.attributeNamespace=l,this.mustUseProperty=n,this.propertyName=e,this.type=t,this.sanitizeURL=a,this.removeEmptyString=i}var ue={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e){ue[e]=new re(e,0,!1,e,null,!1,!1)}),[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(e){var t=e[0];ue[t]=new re(t,1,!1,e[1],null,!1,!1)}),["contentEditable","draggable","spellCheck","value"].forEach(function(e){ue[e]=new re(e,2,!1,e.toLowerCase(),null,!1,!1)}),["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(e){ue[e]=new re(e,2,!1,e,null,!1,!1)}),"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e){ue[e]=new re(e,3,!1,e.toLowerCase(),null,!1,!1)}),["checked","multiple","muted","selected"].forEach(function(e){ue[e]=new re(e,3,!0,e,null,!1,!1)}),["capture","download"].forEach(function(e){ue[e]=new re(e,4,!1,e,null,!1,!1)}),["cols","rows","size","span"].forEach(function(e){ue[e]=new re(e,6,!1,e,null,!1,!1)}),["rowSpan","start"].forEach(function(e){ue[e]=new re(e,5,!1,e.toLowerCase(),null,!1,!1)});var M=/[\-:]([a-z])/g;function Ee(e){return e[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e){var t=e.replace(M,Ee);ue[t]=new re(t,1,!1,e,null,!1,!1)}),"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e){var t=e.replace(M,Ee);ue[t]=new re(t,1,!1,e,"http://www.w3.org/1999/xlink",!1,!1)}),["xml:base","xml:lang","xml:space"].forEach(function(e){var t=e.replace(M,Ee);ue[t]=new re(t,1,!1,e,"http://www.w3.org/XML/1998/namespace",!1,!1)}),["tabIndex","crossOrigin"].forEach(function(e){ue[e]=new re(e,1,!1,e.toLowerCase(),null,!1,!1)}),ue.xlinkHref=new re("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1),["src","href","action","formAction"].forEach(function(e){ue[e]=new re(e,1,!1,e.toLowerCase(),null,!0,!0)});function Te(e,t,n,r){var l=ue.hasOwnProperty(t)?ue[t]:null;(l!==null?l.type!==0:r||!(2<t.length)||t[0]!=="o"&&t[0]!=="O"||t[1]!=="n"&&t[1]!=="N")&&(le(t,n,l,r)&&(n=null),r||l===null?W(t)&&(n===null?e.removeAttribute(t):e.setAttribute(t,""+n)):l.mustUseProperty?e[l.propertyName]=n===null?l.type===3?!1:"":n:(t=l.attributeName,r=l.attributeNamespace,n===null?e.removeAttribute(t):(l=l.type,n=l===3||l===4&&n===!0?"":""+n,r?e.setAttributeNS(r,t,n):e.setAttribute(t,n))))}var be=o.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,B=Symbol.for("react.element"),P=Symbol.for("react.portal"),D=Symbol.for("react.fragment"),U=Symbol.for("react.strict_mode"),J=Symbol.for("react.profiler"),xe=Symbol.for("react.provider"),Pe=Symbol.for("react.context"),Ae=Symbol.for("react.forward_ref"),Z=Symbol.for("react.suspense"),Ne=Symbol.for("react.suspense_list"),we=Symbol.for("react.memo"),je=Symbol.for("react.lazy"),fe=Symbol.for("react.offscreen"),F=Symbol.iterator;function X(e){return e===null||typeof e!="object"?null:(e=F&&e[F]||e["@@iterator"],typeof e=="function"?e:null)}var $=Object.assign,f;function C(e){if(f===void 0)try{throw Error()}catch(n){var t=n.stack.trim().match(/\n( *(at )?)/);f=t&&t[1]||""}return`
`+f+e}var ne=!1;function ae(e,t){if(!e||ne)return"";ne=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(t)if(t=function(){throw Error()},Object.defineProperty(t.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(t,[])}catch(w){var r=w}Reflect.construct(e,[],t)}else{try{t.call()}catch(w){r=w}e.call(t.prototype)}else{try{throw Error()}catch(w){r=w}e()}}catch(w){if(w&&r&&typeof w.stack=="string"){for(var l=w.stack.split(`
`),a=r.stack.split(`
`),i=l.length-1,c=a.length-1;1<=i&&0<=c&&l[i]!==a[c];)c--;for(;1<=i&&0<=c;i--,c--)if(l[i]!==a[c]){if(i!==1||c!==1)do if(i--,c--,0>c||l[i]!==a[c]){var g=`
`+l[i].replace(" at new "," at ");return e.displayName&&g.includes("<anonymous>")&&(g=g.replace("<anonymous>",e.displayName)),g}while(1<=i&&0<=c);break}}}finally{ne=!1,Error.prepareStackTrace=n}return(e=e?e.displayName||e.name:"")?C(e):""}function de(e){switch(e.tag){case 5:return C(e.type);case 16:return C("Lazy");case 13:return C("Suspense");case 19:return C("SuspenseList");case 0:case 2:case 15:return e=ae(e.type,!1),e;case 11:return e=ae(e.type.render,!1),e;case 1:return e=ae(e.type,!0),e;default:return""}}function pe(e){if(e==null)return null;if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case D:return"Fragment";case P:return"Portal";case J:return"Profiler";case U:return"StrictMode";case Z:return"Suspense";case Ne:return"SuspenseList"}if(typeof e=="object")switch(e.$$typeof){case Pe:return(e.displayName||"Context")+".Consumer";case xe:return(e._context.displayName||"Context")+".Provider";case Ae:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case we:return t=e.displayName||null,t!==null?t:pe(e.type)||"Memo";case je:t=e._payload,e=e._init;try{return pe(e(t))}catch{}}return null}function oe(e){var t=e.type;switch(e.tag){case 24:return"Cache";case 9:return(t.displayName||"Context")+".Consumer";case 10:return(t._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return e=t.render,e=e.displayName||e.name||"",t.displayName||(e!==""?"ForwardRef("+e+")":"ForwardRef");case 7:return"Fragment";case 5:return t;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return pe(t);case 8:return t===U?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t}return null}function he(e){switch(typeof e){case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function ge(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function Me(e){var t=ge(e)?"checked":"value",n=Object.getOwnPropertyDescriptor(e.constructor.prototype,t),r=""+e[t];if(!e.hasOwnProperty(t)&&typeof n<"u"&&typeof n.get=="function"&&typeof n.set=="function"){var l=n.get,a=n.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return l.call(this)},set:function(i){r=""+i,a.call(this,i)}}),Object.defineProperty(e,t,{enumerable:n.enumerable}),{getValue:function(){return r},setValue:function(i){r=""+i},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function $t(e){e._valueTracker||(e._valueTracker=Me(e))}function vt(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),r="";return e&&(r=ge(e)?e.checked?"true":"false":e.value),e=r,e!==n?(t.setValue(e),!0):!1}function Ke(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}function It(e,t){var n=t.checked;return $({},t,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:n??e._wrapperState.initialChecked})}function Ot(e,t){var n=t.defaultValue==null?"":t.defaultValue,r=t.checked!=null?t.checked:t.defaultChecked;n=he(t.value!=null?t.value:n),e._wrapperState={initialChecked:r,initialValue:n,controlled:t.type==="checkbox"||t.type==="radio"?t.checked!=null:t.value!=null}}function ir(e,t){t=t.checked,t!=null&&Te(e,"checked",t,!1)}function Ct(e,t){ir(e,t);var n=he(t.value),r=t.type;if(n!=null)r==="number"?(n===0&&e.value===""||e.value!=n)&&(e.value=""+n):e.value!==""+n&&(e.value=""+n);else if(r==="submit"||r==="reset"){e.removeAttribute("value");return}t.hasOwnProperty("value")?mn(e,t.type,n):t.hasOwnProperty("defaultValue")&&mn(e,t.type,he(t.defaultValue)),t.checked==null&&t.defaultChecked!=null&&(e.defaultChecked=!!t.defaultChecked)}function Qt(e,t,n){if(t.hasOwnProperty("value")||t.hasOwnProperty("defaultValue")){var r=t.type;if(!(r!=="submit"&&r!=="reset"||t.value!==void 0&&t.value!==null))return;t=""+e._wrapperState.initialValue,n||t===e.value||(e.value=t),e.defaultValue=t}n=e.name,n!==""&&(e.name=""),e.defaultChecked=!!e._wrapperState.initialChecked,n!==""&&(e.name=n)}function mn(e,t,n){(t!=="number"||Ke(e.ownerDocument)!==e)&&(n==null?e.defaultValue=""+e._wrapperState.initialValue:e.defaultValue!==""+n&&(e.defaultValue=""+n))}var $n=Array.isArray;function Jt(e,t,n,r){if(e=e.options,t){t={};for(var l=0;l<n.length;l++)t["$"+n[l]]=!0;for(n=0;n<e.length;n++)l=t.hasOwnProperty("$"+e[n].value),e[n].selected!==l&&(e[n].selected=l),l&&r&&(e[n].defaultSelected=!0)}else{for(n=""+he(n),t=null,l=0;l<e.length;l++){if(e[l].value===n){e[l].selected=!0,r&&(e[l].defaultSelected=!0);return}t!==null||e[l].disabled||(t=e[l])}t!==null&&(t.selected=!0)}}function ot(e,t){if(t.dangerouslySetInnerHTML!=null)throw Error(s(91));return $({},t,{value:void 0,defaultValue:void 0,children:""+e._wrapperState.initialValue})}function In(e,t){var n=t.value;if(n==null){if(n=t.children,t=t.defaultValue,n!=null){if(t!=null)throw Error(s(92));if($n(n)){if(1<n.length)throw Error(s(93));n=n[0]}t=n}t==null&&(t=""),n=t}e._wrapperState={initialValue:he(n)}}function Gt(e,t){var n=he(t.value),r=he(t.defaultValue);n!=null&&(n=""+n,n!==e.value&&(e.value=n),t.defaultValue==null&&e.defaultValue!==n&&(e.defaultValue=n)),r!=null&&(e.defaultValue=""+r)}function ur(e){var t=e.textContent;t===e._wrapperState.initialValue&&t!==""&&t!==null&&(e.value=t)}function Ye(e){switch(e){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function On(e,t){return e==null||e==="http://www.w3.org/1999/xhtml"?Ye(t):e==="http://www.w3.org/2000/svg"&&t==="foreignObject"?"http://www.w3.org/1999/xhtml":e}var Fn,Bn=(function(e){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(t,n,r,l){MSApp.execUnsafeLocalFunction(function(){return e(t,n,r,l)})}:e})(function(e,t){if(e.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in e)e.innerHTML=t;else{for(Fn=Fn||document.createElement("div"),Fn.innerHTML="<svg>"+t.valueOf().toString()+"</svg>",t=Fn.firstChild;e.firstChild;)e.removeChild(e.firstChild);for(;t.firstChild;)e.appendChild(t.firstChild)}});function At(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&n.nodeType===3){n.nodeValue=t;return}}e.textContent=t}var Nt={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},Dl=["Webkit","ms","Moz","O"];Object.keys(Nt).forEach(function(e){Dl.forEach(function(t){t=t+e.charAt(0).toUpperCase()+e.substring(1),Nt[t]=Nt[e]})});function qt(e,t,n){return t==null||typeof t=="boolean"||t===""?"":n||typeof t!="number"||t===0||Nt.hasOwnProperty(e)&&Nt[e]?(""+t).trim():t+"px"}function Un(e,t){e=e.style;for(var n in t)if(t.hasOwnProperty(n)){var r=n.indexOf("--")===0,l=qt(n,t[n],r);n==="float"&&(n="cssFloat"),r?e.setProperty(n,l):e[n]=l}}var Ft=$({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function cr(e,t){if(t){if(Ft[e]&&(t.children!=null||t.dangerouslySetInnerHTML!=null))throw Error(s(137,e));if(t.dangerouslySetInnerHTML!=null){if(t.children!=null)throw Error(s(60));if(typeof t.dangerouslySetInnerHTML!="object"||!("__html"in t.dangerouslySetInnerHTML))throw Error(s(61))}if(t.style!=null&&typeof t.style!="object")throw Error(s(62))}}function Kr(e,t){if(e.indexOf("-")===-1)return typeof t.is=="string";switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var dr=null;function pr(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var Wn=null,Xt=null,st=null;function Zt(e){if(e=gl(e)){if(typeof Wn!="function")throw Error(s(280));var t=e.stateNode;t&&(t=ra(t),Wn(e.stateNode,e.type,t))}}function Hn(e){Xt?st?st.push(e):st=[e]:Xt=e}function Vn(){if(Xt){var e=Xt,t=st;if(st=Xt=null,Zt(e),t)for(e=0;e<t.length;e++)Zt(t[e])}}function $l(e,t){return e(t)}function Yr(){}var fr=!1;function en(e,t,n){if(fr)return e(t,n);fr=!0;try{return $l(e,t,n)}finally{fr=!1,(Xt!==null||st!==null)&&(Yr(),Vn())}}function tn(e,t){var n=e.stateNode;if(n===null)return null;var r=ra(n);if(r===null)return null;n=r[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(r=!r.disabled)||(e=e.type,r=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!r;break e;default:e=!1}if(e)return null;if(n&&typeof n!="function")throw Error(s(231,t,typeof n));return n}var hn=!1;if(E)try{var Kn={};Object.defineProperty(Kn,"passive",{get:function(){hn=!0}}),window.addEventListener("test",Kn,Kn),window.removeEventListener("test",Kn,Kn)}catch{hn=!1}function Tt(e,t,n,r,l,a,i,c,g){var w=Array.prototype.slice.call(arguments,3);try{t.apply(n,w)}catch(L){this.onError(L)}}var nn=!1,xn=null,Yn=!1,gr=null,mr={onError:function(e){nn=!0,xn=e}};function Il(e,t,n,r,l,a,i,c,g){nn=!1,xn=null,Tt.apply(mr,arguments)}function hr(e,t,n,r,l,a,i,c,g){if(Il.apply(this,arguments),nn){if(nn){var w=xn;nn=!1,xn=null}else throw Error(s(198));Yn||(Yn=!0,gr=w)}}function rn(e){var t=e,n=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,(t.flags&4098)!==0&&(n=t.return),e=t.return;while(e)}return t.tag===3?n:null}function yt(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function xr(e){if(rn(e)!==e)throw Error(s(188))}function Pt(e){var t=e.alternate;if(!t){if(t=rn(e),t===null)throw Error(s(188));return t!==e?null:e}for(var n=e,r=t;;){var l=n.return;if(l===null)break;var a=l.alternate;if(a===null){if(r=l.return,r!==null){n=r;continue}break}if(l.child===a.child){for(a=l.child;a;){if(a===n)return xr(l),e;if(a===r)return xr(l),t;a=a.sibling}throw Error(s(188))}if(n.return!==r.return)n=l,r=a;else{for(var i=!1,c=l.child;c;){if(c===n){i=!0,n=l,r=a;break}if(c===r){i=!0,r=l,n=a;break}c=c.sibling}if(!i){for(c=a.child;c;){if(c===n){i=!0,n=a,r=l;break}if(c===r){i=!0,r=a,n=l;break}c=c.sibling}if(!i)throw Error(s(189))}}if(n.alternate!==r)throw Error(s(190))}if(n.tag!==3)throw Error(s(188));return n.stateNode.current===n?e:t}function vr(e){return e=Pt(e),e!==null?Ol(e):null}function Ol(e){if(e.tag===5||e.tag===6)return e;for(e=e.child;e!==null;){var t=Ol(e);if(t!==null)return t;e=e.sibling}return null}var Qr=u.unstable_scheduleCallback,Fl=u.unstable_cancelCallback,yr=u.unstable_shouldYield,eo=u.unstable_requestPaint,Ie=u.unstable_now,to=u.unstable_getCurrentPriorityLevel,_r=u.unstable_ImmediatePriority,Jr=u.unstable_UserBlockingPriority,Qn=u.unstable_NormalPriority,m=u.unstable_LowPriority,S=u.unstable_IdlePriority,I=null,V=null;function ve(e){if(V&&typeof V.onCommitFiberRoot=="function")try{V.onCommitFiberRoot(I,e,void 0,(e.current.flags&128)===128)}catch{}}var se=Math.clz32?Math.clz32:_e,ye=Math.log,K=Math.LN2;function _e(e){return e>>>=0,e===0?32:31-(ye(e)/K|0)|0}var Le=64,Bt=4194304;function Gr(e){switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return e&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return e}}function Bl(e,t){var n=e.pendingLanes;if(n===0)return 0;var r=0,l=e.suspendedLanes,a=e.pingedLanes,i=n&268435455;if(i!==0){var c=i&~l;c!==0?r=Gr(c):(a&=i,a!==0&&(r=Gr(a)))}else i=n&~l,i!==0?r=Gr(i):a!==0&&(r=Gr(a));if(r===0)return 0;if(t!==0&&t!==r&&(t&l)===0&&(l=r&-r,a=t&-t,l>=a||l===16&&(a&4194240)!==0))return t;if((r&4)!==0&&(r|=n&16),t=e.entangledLanes,t!==0)for(e=e.entanglements,t&=r;0<t;)n=31-se(t),l=1<<n,r|=e[n],t&=~l;return r}function Ep(e,t){switch(e){case 1:case 2:case 4:return t+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Cp(e,t){for(var n=e.suspendedLanes,r=e.pingedLanes,l=e.expirationTimes,a=e.pendingLanes;0<a;){var i=31-se(a),c=1<<i,g=l[i];g===-1?((c&n)===0||(c&r)!==0)&&(l[i]=Ep(c,t)):g<=t&&(e.expiredLanes|=c),a&=~c}}function no(e){return e=e.pendingLanes&-1073741825,e!==0?e:e&1073741824?1073741824:0}function fi(){var e=Le;return Le<<=1,(Le&4194240)===0&&(Le=64),e}function ro(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function qr(e,t,n){e.pendingLanes|=t,t!==536870912&&(e.suspendedLanes=0,e.pingedLanes=0),e=e.eventTimes,t=31-se(t),e[t]=n}function Ap(e,t){var n=e.pendingLanes&~t;e.pendingLanes=t,e.suspendedLanes=0,e.pingedLanes=0,e.expiredLanes&=t,e.mutableReadLanes&=t,e.entangledLanes&=t,t=e.entanglements;var r=e.eventTimes;for(e=e.expirationTimes;0<n;){var l=31-se(n),a=1<<l;t[l]=0,r[l]=-1,e[l]=-1,n&=~a}}function lo(e,t){var n=e.entangledLanes|=t;for(e=e.entanglements;n;){var r=31-se(n),l=1<<r;l&t|e[r]&t&&(e[r]|=t),n&=~l}}var Ce=0;function gi(e){return e&=-e,1<e?4<e?(e&268435455)!==0?16:536870912:4:1}var mi,ao,hi,xi,vi,oo=!1,Ul=[],vn=null,yn=null,_n=null,Xr=new Map,Zr=new Map,wn=[],Np="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function yi(e,t){switch(e){case"focusin":case"focusout":vn=null;break;case"dragenter":case"dragleave":yn=null;break;case"mouseover":case"mouseout":_n=null;break;case"pointerover":case"pointerout":Xr.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":Zr.delete(t.pointerId)}}function el(e,t,n,r,l,a){return e===null||e.nativeEvent!==a?(e={blockedOn:t,domEventName:n,eventSystemFlags:r,nativeEvent:a,targetContainers:[l]},t!==null&&(t=gl(t),t!==null&&ao(t)),e):(e.eventSystemFlags|=r,t=e.targetContainers,l!==null&&t.indexOf(l)===-1&&t.push(l),e)}function Tp(e,t,n,r,l){switch(t){case"focusin":return vn=el(vn,e,t,n,r,l),!0;case"dragenter":return yn=el(yn,e,t,n,r,l),!0;case"mouseover":return _n=el(_n,e,t,n,r,l),!0;case"pointerover":var a=l.pointerId;return Xr.set(a,el(Xr.get(a)||null,e,t,n,r,l)),!0;case"gotpointercapture":return a=l.pointerId,Zr.set(a,el(Zr.get(a)||null,e,t,n,r,l)),!0}return!1}function _i(e){var t=Jn(e.target);if(t!==null){var n=rn(t);if(n!==null){if(t=n.tag,t===13){if(t=yt(n),t!==null){e.blockedOn=t,vi(e.priority,function(){hi(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}e.blockedOn=null}function Wl(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var n=io(e.domEventName,e.eventSystemFlags,t[0],e.nativeEvent);if(n===null){n=e.nativeEvent;var r=new n.constructor(n.type,n);dr=r,n.target.dispatchEvent(r),dr=null}else return t=gl(n),t!==null&&ao(t),e.blockedOn=n,!1;t.shift()}return!0}function wi(e,t,n){Wl(e)&&n.delete(t)}function Pp(){oo=!1,vn!==null&&Wl(vn)&&(vn=null),yn!==null&&Wl(yn)&&(yn=null),_n!==null&&Wl(_n)&&(_n=null),Xr.forEach(wi),Zr.forEach(wi)}function tl(e,t){e.blockedOn===t&&(e.blockedOn=null,oo||(oo=!0,u.unstable_scheduleCallback(u.unstable_NormalPriority,Pp)))}function nl(e){function t(l){return tl(l,e)}if(0<Ul.length){tl(Ul[0],e);for(var n=1;n<Ul.length;n++){var r=Ul[n];r.blockedOn===e&&(r.blockedOn=null)}}for(vn!==null&&tl(vn,e),yn!==null&&tl(yn,e),_n!==null&&tl(_n,e),Xr.forEach(t),Zr.forEach(t),n=0;n<wn.length;n++)r=wn[n],r.blockedOn===e&&(r.blockedOn=null);for(;0<wn.length&&(n=wn[0],n.blockedOn===null);)_i(n),n.blockedOn===null&&wn.shift()}var wr=be.ReactCurrentBatchConfig,Hl=!0;function jp(e,t,n,r){var l=Ce,a=wr.transition;wr.transition=null;try{Ce=1,so(e,t,n,r)}finally{Ce=l,wr.transition=a}}function Mp(e,t,n,r){var l=Ce,a=wr.transition;wr.transition=null;try{Ce=4,so(e,t,n,r)}finally{Ce=l,wr.transition=a}}function so(e,t,n,r){if(Hl){var l=io(e,t,n,r);if(l===null)Co(e,t,r,Vl,n),yi(e,r);else if(Tp(l,e,t,n,r))r.stopPropagation();else if(yi(e,r),t&4&&-1<Np.indexOf(e)){for(;l!==null;){var a=gl(l);if(a!==null&&mi(a),a=io(e,t,n,r),a===null&&Co(e,t,r,Vl,n),a===l)break;l=a}l!==null&&r.stopPropagation()}else Co(e,t,r,null,n)}}var Vl=null;function io(e,t,n,r){if(Vl=null,e=pr(r),e=Jn(e),e!==null)if(t=rn(e),t===null)e=null;else if(n=t.tag,n===13){if(e=yt(t),e!==null)return e;e=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null);return Vl=e,null}function ki(e){switch(e){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(to()){case _r:return 1;case Jr:return 4;case Qn:case m:return 16;case S:return 536870912;default:return 16}default:return 16}}var kn=null,uo=null,Kl=null;function bi(){if(Kl)return Kl;var e,t=uo,n=t.length,r,l="value"in kn?kn.value:kn.textContent,a=l.length;for(e=0;e<n&&t[e]===l[e];e++);var i=n-e;for(r=1;r<=i&&t[n-r]===l[a-r];r++);return Kl=l.slice(e,1<r?1-r:void 0)}function Yl(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function Ql(){return!0}function Si(){return!1}function ft(e){function t(n,r,l,a,i){this._reactName=n,this._targetInst=l,this.type=r,this.nativeEvent=a,this.target=i,this.currentTarget=null;for(var c in e)e.hasOwnProperty(c)&&(n=e[c],this[c]=n?n(a):a[c]);return this.isDefaultPrevented=(a.defaultPrevented!=null?a.defaultPrevented:a.returnValue===!1)?Ql:Si,this.isPropagationStopped=Si,this}return $(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=Ql)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=Ql)},persist:function(){},isPersistent:Ql}),t}var kr={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},co=ft(kr),rl=$({},kr,{view:0,detail:0}),zp=ft(rl),po,fo,ll,Jl=$({},rl,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:mo,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==ll&&(ll&&e.type==="mousemove"?(po=e.screenX-ll.screenX,fo=e.screenY-ll.screenY):fo=po=0,ll=e),po)},movementY:function(e){return"movementY"in e?e.movementY:fo}}),Ei=ft(Jl),Lp=$({},Jl,{dataTransfer:0}),Rp=ft(Lp),Dp=$({},rl,{relatedTarget:0}),go=ft(Dp),$p=$({},kr,{animationName:0,elapsedTime:0,pseudoElement:0}),Ip=ft($p),Op=$({},kr,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),Fp=ft(Op),Bp=$({},kr,{data:0}),Ci=ft(Bp),Up={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Wp={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Hp={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Vp(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=Hp[e])?!!t[e]:!1}function mo(){return Vp}var Kp=$({},rl,{key:function(e){if(e.key){var t=Up[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=Yl(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?Wp[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:mo,charCode:function(e){return e.type==="keypress"?Yl(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?Yl(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),Yp=ft(Kp),Qp=$({},Jl,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Ai=ft(Qp),Jp=$({},rl,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:mo}),Gp=ft(Jp),qp=$({},kr,{propertyName:0,elapsedTime:0,pseudoElement:0}),Xp=ft(qp),Zp=$({},Jl,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),ef=ft(Zp),tf=[9,13,27,32],ho=E&&"CompositionEvent"in window,al=null;E&&"documentMode"in document&&(al=document.documentMode);var nf=E&&"TextEvent"in window&&!al,Ni=E&&(!ho||al&&8<al&&11>=al),Ti=" ",Pi=!1;function ji(e,t){switch(e){case"keyup":return tf.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Mi(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var br=!1;function rf(e,t){switch(e){case"compositionend":return Mi(t);case"keypress":return t.which!==32?null:(Pi=!0,Ti);case"textInput":return e=t.data,e===Ti&&Pi?null:e;default:return null}}function lf(e,t){if(br)return e==="compositionend"||!ho&&ji(e,t)?(e=bi(),Kl=uo=kn=null,br=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return Ni&&t.locale!=="ko"?null:t.data;default:return null}}var af={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function zi(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!af[e.type]:t==="textarea"}function Li(e,t,n,r){Hn(r),t=ea(t,"onChange"),0<t.length&&(n=new co("onChange","change",null,n,r),e.push({event:n,listeners:t}))}var ol=null,sl=null;function of(e){Xi(e,0)}function Gl(e){var t=Nr(e);if(vt(t))return e}function sf(e,t){if(e==="change")return t}var Ri=!1;if(E){var xo;if(E){var vo="oninput"in document;if(!vo){var Di=document.createElement("div");Di.setAttribute("oninput","return;"),vo=typeof Di.oninput=="function"}xo=vo}else xo=!1;Ri=xo&&(!document.documentMode||9<document.documentMode)}function $i(){ol&&(ol.detachEvent("onpropertychange",Ii),sl=ol=null)}function Ii(e){if(e.propertyName==="value"&&Gl(sl)){var t=[];Li(t,sl,e,pr(e)),en(of,t)}}function uf(e,t,n){e==="focusin"?($i(),ol=t,sl=n,ol.attachEvent("onpropertychange",Ii)):e==="focusout"&&$i()}function cf(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return Gl(sl)}function df(e,t){if(e==="click")return Gl(t)}function pf(e,t){if(e==="input"||e==="change")return Gl(t)}function ff(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var jt=typeof Object.is=="function"?Object.is:ff;function il(e,t){if(jt(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var n=Object.keys(e),r=Object.keys(t);if(n.length!==r.length)return!1;for(r=0;r<n.length;r++){var l=n[r];if(!b.call(t,l)||!jt(e[l],t[l]))return!1}return!0}function Oi(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function Fi(e,t){var n=Oi(e);e=0;for(var r;n;){if(n.nodeType===3){if(r=e+n.textContent.length,e<=t&&r>=t)return{node:n,offset:t-e};e=r}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=Oi(n)}}function Bi(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?Bi(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function Ui(){for(var e=window,t=Ke();t instanceof e.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href=="string"}catch{n=!1}if(n)e=t.contentWindow;else break;t=Ke(e.document)}return t}function yo(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}function gf(e){var t=Ui(),n=e.focusedElem,r=e.selectionRange;if(t!==n&&n&&n.ownerDocument&&Bi(n.ownerDocument.documentElement,n)){if(r!==null&&yo(n)){if(t=r.start,e=r.end,e===void 0&&(e=t),"selectionStart"in n)n.selectionStart=t,n.selectionEnd=Math.min(e,n.value.length);else if(e=(t=n.ownerDocument||document)&&t.defaultView||window,e.getSelection){e=e.getSelection();var l=n.textContent.length,a=Math.min(r.start,l);r=r.end===void 0?a:Math.min(r.end,l),!e.extend&&a>r&&(l=r,r=a,a=l),l=Fi(n,a);var i=Fi(n,r);l&&i&&(e.rangeCount!==1||e.anchorNode!==l.node||e.anchorOffset!==l.offset||e.focusNode!==i.node||e.focusOffset!==i.offset)&&(t=t.createRange(),t.setStart(l.node,l.offset),e.removeAllRanges(),a>r?(e.addRange(t),e.extend(i.node,i.offset)):(t.setEnd(i.node,i.offset),e.addRange(t)))}}for(t=[],e=n;e=e.parentNode;)e.nodeType===1&&t.push({element:e,left:e.scrollLeft,top:e.scrollTop});for(typeof n.focus=="function"&&n.focus(),n=0;n<t.length;n++)e=t[n],e.element.scrollLeft=e.left,e.element.scrollTop=e.top}}var mf=E&&"documentMode"in document&&11>=document.documentMode,Sr=null,_o=null,ul=null,wo=!1;function Wi(e,t,n){var r=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;wo||Sr==null||Sr!==Ke(r)||(r=Sr,"selectionStart"in r&&yo(r)?r={start:r.selectionStart,end:r.selectionEnd}:(r=(r.ownerDocument&&r.ownerDocument.defaultView||window).getSelection(),r={anchorNode:r.anchorNode,anchorOffset:r.anchorOffset,focusNode:r.focusNode,focusOffset:r.focusOffset}),ul&&il(ul,r)||(ul=r,r=ea(_o,"onSelect"),0<r.length&&(t=new co("onSelect","select",null,t,n),e.push({event:t,listeners:r}),t.target=Sr)))}function ql(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n["Webkit"+e]="webkit"+t,n["Moz"+e]="moz"+t,n}var Er={animationend:ql("Animation","AnimationEnd"),animationiteration:ql("Animation","AnimationIteration"),animationstart:ql("Animation","AnimationStart"),transitionend:ql("Transition","TransitionEnd")},ko={},Hi={};E&&(Hi=document.createElement("div").style,"AnimationEvent"in window||(delete Er.animationend.animation,delete Er.animationiteration.animation,delete Er.animationstart.animation),"TransitionEvent"in window||delete Er.transitionend.transition);function Xl(e){if(ko[e])return ko[e];if(!Er[e])return e;var t=Er[e],n;for(n in t)if(t.hasOwnProperty(n)&&n in Hi)return ko[e]=t[n];return e}var Vi=Xl("animationend"),Ki=Xl("animationiteration"),Yi=Xl("animationstart"),Qi=Xl("transitionend"),Ji=new Map,Gi="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function bn(e,t){Ji.set(e,t),h(t,[e])}for(var bo=0;bo<Gi.length;bo++){var So=Gi[bo],hf=So.toLowerCase(),xf=So[0].toUpperCase()+So.slice(1);bn(hf,"on"+xf)}bn(Vi,"onAnimationEnd"),bn(Ki,"onAnimationIteration"),bn(Yi,"onAnimationStart"),bn("dblclick","onDoubleClick"),bn("focusin","onFocus"),bn("focusout","onBlur"),bn(Qi,"onTransitionEnd"),T("onMouseEnter",["mouseout","mouseover"]),T("onMouseLeave",["mouseout","mouseover"]),T("onPointerEnter",["pointerout","pointerover"]),T("onPointerLeave",["pointerout","pointerover"]),h("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),h("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),h("onBeforeInput",["compositionend","keypress","textInput","paste"]),h("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),h("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),h("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var cl="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),vf=new Set("cancel close invalid load scroll toggle".split(" ").concat(cl));function qi(e,t,n){var r=e.type||"unknown-event";e.currentTarget=n,hr(r,t,void 0,e),e.currentTarget=null}function Xi(e,t){t=(t&4)!==0;for(var n=0;n<e.length;n++){var r=e[n],l=r.event;r=r.listeners;e:{var a=void 0;if(t)for(var i=r.length-1;0<=i;i--){var c=r[i],g=c.instance,w=c.currentTarget;if(c=c.listener,g!==a&&l.isPropagationStopped())break e;qi(l,c,w),a=g}else for(i=0;i<r.length;i++){if(c=r[i],g=c.instance,w=c.currentTarget,c=c.listener,g!==a&&l.isPropagationStopped())break e;qi(l,c,w),a=g}}}if(Yn)throw e=gr,Yn=!1,gr=null,e}function Re(e,t){var n=t[Mo];n===void 0&&(n=t[Mo]=new Set);var r=e+"__bubble";n.has(r)||(Zi(t,e,2,!1),n.add(r))}function Eo(e,t,n){var r=0;t&&(r|=4),Zi(n,e,r,t)}var Zl="_reactListening"+Math.random().toString(36).slice(2);function dl(e){if(!e[Zl]){e[Zl]=!0,p.forEach(function(n){n!=="selectionchange"&&(vf.has(n)||Eo(n,!1,e),Eo(n,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[Zl]||(t[Zl]=!0,Eo("selectionchange",!1,t))}}function Zi(e,t,n,r){switch(ki(t)){case 1:var l=jp;break;case 4:l=Mp;break;default:l=so}n=l.bind(null,t,n,e),l=void 0,!hn||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(l=!0),r?l!==void 0?e.addEventListener(t,n,{capture:!0,passive:l}):e.addEventListener(t,n,!0):l!==void 0?e.addEventListener(t,n,{passive:l}):e.addEventListener(t,n,!1)}function Co(e,t,n,r,l){var a=r;if((t&1)===0&&(t&2)===0&&r!==null)e:for(;;){if(r===null)return;var i=r.tag;if(i===3||i===4){var c=r.stateNode.containerInfo;if(c===l||c.nodeType===8&&c.parentNode===l)break;if(i===4)for(i=r.return;i!==null;){var g=i.tag;if((g===3||g===4)&&(g=i.stateNode.containerInfo,g===l||g.nodeType===8&&g.parentNode===l))return;i=i.return}for(;c!==null;){if(i=Jn(c),i===null)return;if(g=i.tag,g===5||g===6){r=a=i;continue e}c=c.parentNode}}r=r.return}en(function(){var w=a,L=pr(n),R=[];e:{var z=Ji.get(e);if(z!==void 0){var H=co,Q=e;switch(e){case"keypress":if(Yl(n)===0)break e;case"keydown":case"keyup":H=Yp;break;case"focusin":Q="focus",H=go;break;case"focusout":Q="blur",H=go;break;case"beforeblur":case"afterblur":H=go;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":H=Ei;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":H=Rp;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":H=Gp;break;case Vi:case Ki:case Yi:H=Ip;break;case Qi:H=Xp;break;case"scroll":H=zp;break;case"wheel":H=ef;break;case"copy":case"cut":case"paste":H=Fp;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":H=Ai}var G=(t&4)!==0,Ue=!G&&e==="scroll",y=G?z!==null?z+"Capture":null:z;G=[];for(var x=w,_;x!==null;){_=x;var O=_.stateNode;if(_.tag===5&&O!==null&&(_=O,y!==null&&(O=tn(x,y),O!=null&&G.push(pl(x,O,_)))),Ue)break;x=x.return}0<G.length&&(z=new H(z,Q,null,n,L),R.push({event:z,listeners:G}))}}if((t&7)===0){e:{if(z=e==="mouseover"||e==="pointerover",H=e==="mouseout"||e==="pointerout",z&&n!==dr&&(Q=n.relatedTarget||n.fromElement)&&(Jn(Q)||Q[ln]))break e;if((H||z)&&(z=L.window===L?L:(z=L.ownerDocument)?z.defaultView||z.parentWindow:window,H?(Q=n.relatedTarget||n.toElement,H=w,Q=Q?Jn(Q):null,Q!==null&&(Ue=rn(Q),Q!==Ue||Q.tag!==5&&Q.tag!==6)&&(Q=null)):(H=null,Q=w),H!==Q)){if(G=Ei,O="onMouseLeave",y="onMouseEnter",x="mouse",(e==="pointerout"||e==="pointerover")&&(G=Ai,O="onPointerLeave",y="onPointerEnter",x="pointer"),Ue=H==null?z:Nr(H),_=Q==null?z:Nr(Q),z=new G(O,x+"leave",H,n,L),z.target=Ue,z.relatedTarget=_,O=null,Jn(L)===w&&(G=new G(y,x+"enter",Q,n,L),G.target=_,G.relatedTarget=Ue,O=G),Ue=O,H&&Q)t:{for(G=H,y=Q,x=0,_=G;_;_=Cr(_))x++;for(_=0,O=y;O;O=Cr(O))_++;for(;0<x-_;)G=Cr(G),x--;for(;0<_-x;)y=Cr(y),_--;for(;x--;){if(G===y||y!==null&&G===y.alternate)break t;G=Cr(G),y=Cr(y)}G=null}else G=null;H!==null&&eu(R,z,H,G,!1),Q!==null&&Ue!==null&&eu(R,Ue,Q,G,!0)}}e:{if(z=w?Nr(w):window,H=z.nodeName&&z.nodeName.toLowerCase(),H==="select"||H==="input"&&z.type==="file")var q=sf;else if(zi(z))if(Ri)q=pf;else{q=cf;var ee=uf}else(H=z.nodeName)&&H.toLowerCase()==="input"&&(z.type==="checkbox"||z.type==="radio")&&(q=df);if(q&&(q=q(e,w))){Li(R,q,n,L);break e}ee&&ee(e,z,w),e==="focusout"&&(ee=z._wrapperState)&&ee.controlled&&z.type==="number"&&mn(z,"number",z.value)}switch(ee=w?Nr(w):window,e){case"focusin":(zi(ee)||ee.contentEditable==="true")&&(Sr=ee,_o=w,ul=null);break;case"focusout":ul=_o=Sr=null;break;case"mousedown":wo=!0;break;case"contextmenu":case"mouseup":case"dragend":wo=!1,Wi(R,n,L);break;case"selectionchange":if(mf)break;case"keydown":case"keyup":Wi(R,n,L)}var te;if(ho)e:{switch(e){case"compositionstart":var ie="onCompositionStart";break e;case"compositionend":ie="onCompositionEnd";break e;case"compositionupdate":ie="onCompositionUpdate";break e}ie=void 0}else br?ji(e,n)&&(ie="onCompositionEnd"):e==="keydown"&&n.keyCode===229&&(ie="onCompositionStart");ie&&(Ni&&n.locale!=="ko"&&(br||ie!=="onCompositionStart"?ie==="onCompositionEnd"&&br&&(te=bi()):(kn=L,uo="value"in kn?kn.value:kn.textContent,br=!0)),ee=ea(w,ie),0<ee.length&&(ie=new Ci(ie,e,null,n,L),R.push({event:ie,listeners:ee}),te?ie.data=te:(te=Mi(n),te!==null&&(ie.data=te)))),(te=nf?rf(e,n):lf(e,n))&&(w=ea(w,"onBeforeInput"),0<w.length&&(L=new Ci("onBeforeInput","beforeinput",null,n,L),R.push({event:L,listeners:w}),L.data=te))}Xi(R,t)})}function pl(e,t,n){return{instance:e,listener:t,currentTarget:n}}function ea(e,t){for(var n=t+"Capture",r=[];e!==null;){var l=e,a=l.stateNode;l.tag===5&&a!==null&&(l=a,a=tn(e,n),a!=null&&r.unshift(pl(e,a,l)),a=tn(e,t),a!=null&&r.push(pl(e,a,l))),e=e.return}return r}function Cr(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5);return e||null}function eu(e,t,n,r,l){for(var a=t._reactName,i=[];n!==null&&n!==r;){var c=n,g=c.alternate,w=c.stateNode;if(g!==null&&g===r)break;c.tag===5&&w!==null&&(c=w,l?(g=tn(n,a),g!=null&&i.unshift(pl(n,g,c))):l||(g=tn(n,a),g!=null&&i.push(pl(n,g,c)))),n=n.return}i.length!==0&&e.push({event:t,listeners:i})}var yf=/\r\n?/g,_f=/\u0000|\uFFFD/g;function tu(e){return(typeof e=="string"?e:""+e).replace(yf,`
`).replace(_f,"")}function ta(e,t,n){if(t=tu(t),tu(e)!==t&&n)throw Error(s(425))}function na(){}var Ao=null,No=null;function To(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var Po=typeof setTimeout=="function"?setTimeout:void 0,wf=typeof clearTimeout=="function"?clearTimeout:void 0,nu=typeof Promise=="function"?Promise:void 0,kf=typeof queueMicrotask=="function"?queueMicrotask:typeof nu<"u"?function(e){return nu.resolve(null).then(e).catch(bf)}:Po;function bf(e){setTimeout(function(){throw e})}function jo(e,t){var n=t,r=0;do{var l=n.nextSibling;if(e.removeChild(n),l&&l.nodeType===8)if(n=l.data,n==="/$"){if(r===0){e.removeChild(l),nl(t);return}r--}else n!=="$"&&n!=="$?"&&n!=="$!"||r++;n=l}while(n);nl(t)}function Sn(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?")break;if(t==="/$")return null}}return e}function ru(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="$"||n==="$!"||n==="$?"){if(t===0)return e;t--}else n==="/$"&&t++}e=e.previousSibling}return null}var Ar=Math.random().toString(36).slice(2),Ut="__reactFiber$"+Ar,fl="__reactProps$"+Ar,ln="__reactContainer$"+Ar,Mo="__reactEvents$"+Ar,Sf="__reactListeners$"+Ar,Ef="__reactHandles$"+Ar;function Jn(e){var t=e[Ut];if(t)return t;for(var n=e.parentNode;n;){if(t=n[ln]||n[Ut]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(e=ru(e);e!==null;){if(n=e[Ut])return n;e=ru(e)}return t}e=n,n=e.parentNode}return null}function gl(e){return e=e[Ut]||e[ln],!e||e.tag!==5&&e.tag!==6&&e.tag!==13&&e.tag!==3?null:e}function Nr(e){if(e.tag===5||e.tag===6)return e.stateNode;throw Error(s(33))}function ra(e){return e[fl]||null}var zo=[],Tr=-1;function En(e){return{current:e}}function De(e){0>Tr||(e.current=zo[Tr],zo[Tr]=null,Tr--)}function ze(e,t){Tr++,zo[Tr]=e.current,e.current=t}var Cn={},Ze=En(Cn),it=En(!1),Gn=Cn;function Pr(e,t){var n=e.type.contextTypes;if(!n)return Cn;var r=e.stateNode;if(r&&r.__reactInternalMemoizedUnmaskedChildContext===t)return r.__reactInternalMemoizedMaskedChildContext;var l={},a;for(a in n)l[a]=t[a];return r&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=t,e.__reactInternalMemoizedMaskedChildContext=l),l}function ut(e){return e=e.childContextTypes,e!=null}function la(){De(it),De(Ze)}function lu(e,t,n){if(Ze.current!==Cn)throw Error(s(168));ze(Ze,t),ze(it,n)}function au(e,t,n){var r=e.stateNode;if(t=t.childContextTypes,typeof r.getChildContext!="function")return n;r=r.getChildContext();for(var l in r)if(!(l in t))throw Error(s(108,oe(e)||"Unknown",l));return $({},n,r)}function aa(e){return e=(e=e.stateNode)&&e.__reactInternalMemoizedMergedChildContext||Cn,Gn=Ze.current,ze(Ze,e),ze(it,it.current),!0}function ou(e,t,n){var r=e.stateNode;if(!r)throw Error(s(169));n?(e=au(e,t,Gn),r.__reactInternalMemoizedMergedChildContext=e,De(it),De(Ze),ze(Ze,e)):De(it),ze(it,n)}var an=null,oa=!1,Lo=!1;function su(e){an===null?an=[e]:an.push(e)}function Cf(e){oa=!0,su(e)}function An(){if(!Lo&&an!==null){Lo=!0;var e=0,t=Ce;try{var n=an;for(Ce=1;e<n.length;e++){var r=n[e];do r=r(!0);while(r!==null)}an=null,oa=!1}catch(l){throw an!==null&&(an=an.slice(e+1)),Qr(_r,An),l}finally{Ce=t,Lo=!1}}return null}var jr=[],Mr=0,sa=null,ia=0,_t=[],wt=0,qn=null,on=1,sn="";function Xn(e,t){jr[Mr++]=ia,jr[Mr++]=sa,sa=e,ia=t}function iu(e,t,n){_t[wt++]=on,_t[wt++]=sn,_t[wt++]=qn,qn=e;var r=on;e=sn;var l=32-se(r)-1;r&=~(1<<l),n+=1;var a=32-se(t)+l;if(30<a){var i=l-l%5;a=(r&(1<<i)-1).toString(32),r>>=i,l-=i,on=1<<32-se(t)+l|n<<l|r,sn=a+e}else on=1<<a|n<<l|r,sn=e}function Ro(e){e.return!==null&&(Xn(e,1),iu(e,1,0))}function Do(e){for(;e===sa;)sa=jr[--Mr],jr[Mr]=null,ia=jr[--Mr],jr[Mr]=null;for(;e===qn;)qn=_t[--wt],_t[wt]=null,sn=_t[--wt],_t[wt]=null,on=_t[--wt],_t[wt]=null}var gt=null,mt=null,$e=!1,Mt=null;function uu(e,t){var n=Et(5,null,null,0);n.elementType="DELETED",n.stateNode=t,n.return=e,t=e.deletions,t===null?(e.deletions=[n],e.flags|=16):t.push(n)}function cu(e,t){switch(e.tag){case 5:var n=e.type;return t=t.nodeType!==1||n.toLowerCase()!==t.nodeName.toLowerCase()?null:t,t!==null?(e.stateNode=t,gt=e,mt=Sn(t.firstChild),!0):!1;case 6:return t=e.pendingProps===""||t.nodeType!==3?null:t,t!==null?(e.stateNode=t,gt=e,mt=null,!0):!1;case 13:return t=t.nodeType!==8?null:t,t!==null?(n=qn!==null?{id:on,overflow:sn}:null,e.memoizedState={dehydrated:t,treeContext:n,retryLane:1073741824},n=Et(18,null,null,0),n.stateNode=t,n.return=e,e.child=n,gt=e,mt=null,!0):!1;default:return!1}}function $o(e){return(e.mode&1)!==0&&(e.flags&128)===0}function Io(e){if($e){var t=mt;if(t){var n=t;if(!cu(e,t)){if($o(e))throw Error(s(418));t=Sn(n.nextSibling);var r=gt;t&&cu(e,t)?uu(r,n):(e.flags=e.flags&-4097|2,$e=!1,gt=e)}}else{if($o(e))throw Error(s(418));e.flags=e.flags&-4097|2,$e=!1,gt=e}}}function du(e){for(e=e.return;e!==null&&e.tag!==5&&e.tag!==3&&e.tag!==13;)e=e.return;gt=e}function ua(e){if(e!==gt)return!1;if(!$e)return du(e),$e=!0,!1;var t;if((t=e.tag!==3)&&!(t=e.tag!==5)&&(t=e.type,t=t!=="head"&&t!=="body"&&!To(e.type,e.memoizedProps)),t&&(t=mt)){if($o(e))throw pu(),Error(s(418));for(;t;)uu(e,t),t=Sn(t.nextSibling)}if(du(e),e.tag===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(s(317));e:{for(e=e.nextSibling,t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="/$"){if(t===0){mt=Sn(e.nextSibling);break e}t--}else n!=="$"&&n!=="$!"&&n!=="$?"||t++}e=e.nextSibling}mt=null}}else mt=gt?Sn(e.stateNode.nextSibling):null;return!0}function pu(){for(var e=mt;e;)e=Sn(e.nextSibling)}function zr(){mt=gt=null,$e=!1}function Oo(e){Mt===null?Mt=[e]:Mt.push(e)}var Af=be.ReactCurrentBatchConfig;function ml(e,t,n){if(e=n.ref,e!==null&&typeof e!="function"&&typeof e!="object"){if(n._owner){if(n=n._owner,n){if(n.tag!==1)throw Error(s(309));var r=n.stateNode}if(!r)throw Error(s(147,e));var l=r,a=""+e;return t!==null&&t.ref!==null&&typeof t.ref=="function"&&t.ref._stringRef===a?t.ref:(t=function(i){var c=l.refs;i===null?delete c[a]:c[a]=i},t._stringRef=a,t)}if(typeof e!="string")throw Error(s(284));if(!n._owner)throw Error(s(290,e))}return e}function ca(e,t){throw e=Object.prototype.toString.call(t),Error(s(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e))}function fu(e){var t=e._init;return t(e._payload)}function gu(e){function t(y,x){if(e){var _=y.deletions;_===null?(y.deletions=[x],y.flags|=16):_.push(x)}}function n(y,x){if(!e)return null;for(;x!==null;)t(y,x),x=x.sibling;return null}function r(y,x){for(y=new Map;x!==null;)x.key!==null?y.set(x.key,x):y.set(x.index,x),x=x.sibling;return y}function l(y,x){return y=Rn(y,x),y.index=0,y.sibling=null,y}function a(y,x,_){return y.index=_,e?(_=y.alternate,_!==null?(_=_.index,_<x?(y.flags|=2,x):_):(y.flags|=2,x)):(y.flags|=1048576,x)}function i(y){return e&&y.alternate===null&&(y.flags|=2),y}function c(y,x,_,O){return x===null||x.tag!==6?(x=Ps(_,y.mode,O),x.return=y,x):(x=l(x,_),x.return=y,x)}function g(y,x,_,O){var q=_.type;return q===D?L(y,x,_.props.children,O,_.key):x!==null&&(x.elementType===q||typeof q=="object"&&q!==null&&q.$$typeof===je&&fu(q)===x.type)?(O=l(x,_.props),O.ref=ml(y,x,_),O.return=y,O):(O=La(_.type,_.key,_.props,null,y.mode,O),O.ref=ml(y,x,_),O.return=y,O)}function w(y,x,_,O){return x===null||x.tag!==4||x.stateNode.containerInfo!==_.containerInfo||x.stateNode.implementation!==_.implementation?(x=js(_,y.mode,O),x.return=y,x):(x=l(x,_.children||[]),x.return=y,x)}function L(y,x,_,O,q){return x===null||x.tag!==7?(x=or(_,y.mode,O,q),x.return=y,x):(x=l(x,_),x.return=y,x)}function R(y,x,_){if(typeof x=="string"&&x!==""||typeof x=="number")return x=Ps(""+x,y.mode,_),x.return=y,x;if(typeof x=="object"&&x!==null){switch(x.$$typeof){case B:return _=La(x.type,x.key,x.props,null,y.mode,_),_.ref=ml(y,null,x),_.return=y,_;case P:return x=js(x,y.mode,_),x.return=y,x;case je:var O=x._init;return R(y,O(x._payload),_)}if($n(x)||X(x))return x=or(x,y.mode,_,null),x.return=y,x;ca(y,x)}return null}function z(y,x,_,O){var q=x!==null?x.key:null;if(typeof _=="string"&&_!==""||typeof _=="number")return q!==null?null:c(y,x,""+_,O);if(typeof _=="object"&&_!==null){switch(_.$$typeof){case B:return _.key===q?g(y,x,_,O):null;case P:return _.key===q?w(y,x,_,O):null;case je:return q=_._init,z(y,x,q(_._payload),O)}if($n(_)||X(_))return q!==null?null:L(y,x,_,O,null);ca(y,_)}return null}function H(y,x,_,O,q){if(typeof O=="string"&&O!==""||typeof O=="number")return y=y.get(_)||null,c(x,y,""+O,q);if(typeof O=="object"&&O!==null){switch(O.$$typeof){case B:return y=y.get(O.key===null?_:O.key)||null,g(x,y,O,q);case P:return y=y.get(O.key===null?_:O.key)||null,w(x,y,O,q);case je:var ee=O._init;return H(y,x,_,ee(O._payload),q)}if($n(O)||X(O))return y=y.get(_)||null,L(x,y,O,q,null);ca(x,O)}return null}function Q(y,x,_,O){for(var q=null,ee=null,te=x,ie=x=0,Ge=null;te!==null&&ie<_.length;ie++){te.index>ie?(Ge=te,te=null):Ge=te.sibling;var Se=z(y,te,_[ie],O);if(Se===null){te===null&&(te=Ge);break}e&&te&&Se.alternate===null&&t(y,te),x=a(Se,x,ie),ee===null?q=Se:ee.sibling=Se,ee=Se,te=Ge}if(ie===_.length)return n(y,te),$e&&Xn(y,ie),q;if(te===null){for(;ie<_.length;ie++)te=R(y,_[ie],O),te!==null&&(x=a(te,x,ie),ee===null?q=te:ee.sibling=te,ee=te);return $e&&Xn(y,ie),q}for(te=r(y,te);ie<_.length;ie++)Ge=H(te,y,ie,_[ie],O),Ge!==null&&(e&&Ge.alternate!==null&&te.delete(Ge.key===null?ie:Ge.key),x=a(Ge,x,ie),ee===null?q=Ge:ee.sibling=Ge,ee=Ge);return e&&te.forEach(function(Dn){return t(y,Dn)}),$e&&Xn(y,ie),q}function G(y,x,_,O){var q=X(_);if(typeof q!="function")throw Error(s(150));if(_=q.call(_),_==null)throw Error(s(151));for(var ee=q=null,te=x,ie=x=0,Ge=null,Se=_.next();te!==null&&!Se.done;ie++,Se=_.next()){te.index>ie?(Ge=te,te=null):Ge=te.sibling;var Dn=z(y,te,Se.value,O);if(Dn===null){te===null&&(te=Ge);break}e&&te&&Dn.alternate===null&&t(y,te),x=a(Dn,x,ie),ee===null?q=Dn:ee.sibling=Dn,ee=Dn,te=Ge}if(Se.done)return n(y,te),$e&&Xn(y,ie),q;if(te===null){for(;!Se.done;ie++,Se=_.next())Se=R(y,Se.value,O),Se!==null&&(x=a(Se,x,ie),ee===null?q=Se:ee.sibling=Se,ee=Se);return $e&&Xn(y,ie),q}for(te=r(y,te);!Se.done;ie++,Se=_.next())Se=H(te,y,ie,Se.value,O),Se!==null&&(e&&Se.alternate!==null&&te.delete(Se.key===null?ie:Se.key),x=a(Se,x,ie),ee===null?q=Se:ee.sibling=Se,ee=Se);return e&&te.forEach(function(og){return t(y,og)}),$e&&Xn(y,ie),q}function Ue(y,x,_,O){if(typeof _=="object"&&_!==null&&_.type===D&&_.key===null&&(_=_.props.children),typeof _=="object"&&_!==null){switch(_.$$typeof){case B:e:{for(var q=_.key,ee=x;ee!==null;){if(ee.key===q){if(q=_.type,q===D){if(ee.tag===7){n(y,ee.sibling),x=l(ee,_.props.children),x.return=y,y=x;break e}}else if(ee.elementType===q||typeof q=="object"&&q!==null&&q.$$typeof===je&&fu(q)===ee.type){n(y,ee.sibling),x=l(ee,_.props),x.ref=ml(y,ee,_),x.return=y,y=x;break e}n(y,ee);break}else t(y,ee);ee=ee.sibling}_.type===D?(x=or(_.props.children,y.mode,O,_.key),x.return=y,y=x):(O=La(_.type,_.key,_.props,null,y.mode,O),O.ref=ml(y,x,_),O.return=y,y=O)}return i(y);case P:e:{for(ee=_.key;x!==null;){if(x.key===ee)if(x.tag===4&&x.stateNode.containerInfo===_.containerInfo&&x.stateNode.implementation===_.implementation){n(y,x.sibling),x=l(x,_.children||[]),x.return=y,y=x;break e}else{n(y,x);break}else t(y,x);x=x.sibling}x=js(_,y.mode,O),x.return=y,y=x}return i(y);case je:return ee=_._init,Ue(y,x,ee(_._payload),O)}if($n(_))return Q(y,x,_,O);if(X(_))return G(y,x,_,O);ca(y,_)}return typeof _=="string"&&_!==""||typeof _=="number"?(_=""+_,x!==null&&x.tag===6?(n(y,x.sibling),x=l(x,_),x.return=y,y=x):(n(y,x),x=Ps(_,y.mode,O),x.return=y,y=x),i(y)):n(y,x)}return Ue}var Lr=gu(!0),mu=gu(!1),da=En(null),pa=null,Rr=null,Fo=null;function Bo(){Fo=Rr=pa=null}function Uo(e){var t=da.current;De(da),e._currentValue=t}function Wo(e,t,n){for(;e!==null;){var r=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,r!==null&&(r.childLanes|=t)):r!==null&&(r.childLanes&t)!==t&&(r.childLanes|=t),e===n)break;e=e.return}}function Dr(e,t){pa=e,Fo=Rr=null,e=e.dependencies,e!==null&&e.firstContext!==null&&((e.lanes&t)!==0&&(ct=!0),e.firstContext=null)}function kt(e){var t=e._currentValue;if(Fo!==e)if(e={context:e,memoizedValue:t,next:null},Rr===null){if(pa===null)throw Error(s(308));Rr=e,pa.dependencies={lanes:0,firstContext:e}}else Rr=Rr.next=e;return t}var Zn=null;function Ho(e){Zn===null?Zn=[e]:Zn.push(e)}function hu(e,t,n,r){var l=t.interleaved;return l===null?(n.next=n,Ho(t)):(n.next=l.next,l.next=n),t.interleaved=n,un(e,r)}function un(e,t){e.lanes|=t;var n=e.alternate;for(n!==null&&(n.lanes|=t),n=e,e=e.return;e!==null;)e.childLanes|=t,n=e.alternate,n!==null&&(n.childLanes|=t),n=e,e=e.return;return n.tag===3?n.stateNode:null}var Nn=!1;function Vo(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function xu(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,effects:e.effects})}function cn(e,t){return{eventTime:e,lane:t,tag:0,payload:null,callback:null,next:null}}function Tn(e,t,n){var r=e.updateQueue;if(r===null)return null;if(r=r.shared,(ke&2)!==0){var l=r.pending;return l===null?t.next=t:(t.next=l.next,l.next=t),r.pending=t,un(e,n)}return l=r.interleaved,l===null?(t.next=t,Ho(r)):(t.next=l.next,l.next=t),r.interleaved=t,un(e,n)}function fa(e,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,(n&4194240)!==0)){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,lo(e,n)}}function vu(e,t){var n=e.updateQueue,r=e.alternate;if(r!==null&&(r=r.updateQueue,n===r)){var l=null,a=null;if(n=n.firstBaseUpdate,n!==null){do{var i={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};a===null?l=a=i:a=a.next=i,n=n.next}while(n!==null);a===null?l=a=t:a=a.next=t}else l=a=t;n={baseState:r.baseState,firstBaseUpdate:l,lastBaseUpdate:a,shared:r.shared,effects:r.effects},e.updateQueue=n;return}e=n.lastBaseUpdate,e===null?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}function ga(e,t,n,r){var l=e.updateQueue;Nn=!1;var a=l.firstBaseUpdate,i=l.lastBaseUpdate,c=l.shared.pending;if(c!==null){l.shared.pending=null;var g=c,w=g.next;g.next=null,i===null?a=w:i.next=w,i=g;var L=e.alternate;L!==null&&(L=L.updateQueue,c=L.lastBaseUpdate,c!==i&&(c===null?L.firstBaseUpdate=w:c.next=w,L.lastBaseUpdate=g))}if(a!==null){var R=l.baseState;i=0,L=w=g=null,c=a;do{var z=c.lane,H=c.eventTime;if((r&z)===z){L!==null&&(L=L.next={eventTime:H,lane:0,tag:c.tag,payload:c.payload,callback:c.callback,next:null});e:{var Q=e,G=c;switch(z=t,H=n,G.tag){case 1:if(Q=G.payload,typeof Q=="function"){R=Q.call(H,R,z);break e}R=Q;break e;case 3:Q.flags=Q.flags&-65537|128;case 0:if(Q=G.payload,z=typeof Q=="function"?Q.call(H,R,z):Q,z==null)break e;R=$({},R,z);break e;case 2:Nn=!0}}c.callback!==null&&c.lane!==0&&(e.flags|=64,z=l.effects,z===null?l.effects=[c]:z.push(c))}else H={eventTime:H,lane:z,tag:c.tag,payload:c.payload,callback:c.callback,next:null},L===null?(w=L=H,g=R):L=L.next=H,i|=z;if(c=c.next,c===null){if(c=l.shared.pending,c===null)break;z=c,c=z.next,z.next=null,l.lastBaseUpdate=z,l.shared.pending=null}}while(!0);if(L===null&&(g=R),l.baseState=g,l.firstBaseUpdate=w,l.lastBaseUpdate=L,t=l.shared.interleaved,t!==null){l=t;do i|=l.lane,l=l.next;while(l!==t)}else a===null&&(l.shared.lanes=0);nr|=i,e.lanes=i,e.memoizedState=R}}function yu(e,t,n){if(e=t.effects,t.effects=null,e!==null)for(t=0;t<e.length;t++){var r=e[t],l=r.callback;if(l!==null){if(r.callback=null,r=n,typeof l!="function")throw Error(s(191,l));l.call(r)}}}var hl={},Wt=En(hl),xl=En(hl),vl=En(hl);function er(e){if(e===hl)throw Error(s(174));return e}function Ko(e,t){switch(ze(vl,t),ze(xl,e),ze(Wt,hl),e=t.nodeType,e){case 9:case 11:t=(t=t.documentElement)?t.namespaceURI:On(null,"");break;default:e=e===8?t.parentNode:t,t=e.namespaceURI||null,e=e.tagName,t=On(t,e)}De(Wt),ze(Wt,t)}function $r(){De(Wt),De(xl),De(vl)}function _u(e){er(vl.current);var t=er(Wt.current),n=On(t,e.type);t!==n&&(ze(xl,e),ze(Wt,n))}function Yo(e){xl.current===e&&(De(Wt),De(xl))}var Oe=En(0);function ma(e){for(var t=e;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||n.data==="$?"||n.data==="$!"))return t}else if(t.tag===19&&t.memoizedProps.revealOrder!==void 0){if((t.flags&128)!==0)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var Qo=[];function Jo(){for(var e=0;e<Qo.length;e++)Qo[e]._workInProgressVersionPrimary=null;Qo.length=0}var ha=be.ReactCurrentDispatcher,Go=be.ReactCurrentBatchConfig,tr=0,Fe=null,He=null,Qe=null,xa=!1,yl=!1,_l=0,Nf=0;function et(){throw Error(s(321))}function qo(e,t){if(t===null)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!jt(e[n],t[n]))return!1;return!0}function Xo(e,t,n,r,l,a){if(tr=a,Fe=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,ha.current=e===null||e.memoizedState===null?Mf:zf,e=n(r,l),yl){a=0;do{if(yl=!1,_l=0,25<=a)throw Error(s(301));a+=1,Qe=He=null,t.updateQueue=null,ha.current=Lf,e=n(r,l)}while(yl)}if(ha.current=_a,t=He!==null&&He.next!==null,tr=0,Qe=He=Fe=null,xa=!1,t)throw Error(s(300));return e}function Zo(){var e=_l!==0;return _l=0,e}function Ht(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Qe===null?Fe.memoizedState=Qe=e:Qe=Qe.next=e,Qe}function bt(){if(He===null){var e=Fe.alternate;e=e!==null?e.memoizedState:null}else e=He.next;var t=Qe===null?Fe.memoizedState:Qe.next;if(t!==null)Qe=t,He=e;else{if(e===null)throw Error(s(310));He=e,e={memoizedState:He.memoizedState,baseState:He.baseState,baseQueue:He.baseQueue,queue:He.queue,next:null},Qe===null?Fe.memoizedState=Qe=e:Qe=Qe.next=e}return Qe}function wl(e,t){return typeof t=="function"?t(e):t}function es(e){var t=bt(),n=t.queue;if(n===null)throw Error(s(311));n.lastRenderedReducer=e;var r=He,l=r.baseQueue,a=n.pending;if(a!==null){if(l!==null){var i=l.next;l.next=a.next,a.next=i}r.baseQueue=l=a,n.pending=null}if(l!==null){a=l.next,r=r.baseState;var c=i=null,g=null,w=a;do{var L=w.lane;if((tr&L)===L)g!==null&&(g=g.next={lane:0,action:w.action,hasEagerState:w.hasEagerState,eagerState:w.eagerState,next:null}),r=w.hasEagerState?w.eagerState:e(r,w.action);else{var R={lane:L,action:w.action,hasEagerState:w.hasEagerState,eagerState:w.eagerState,next:null};g===null?(c=g=R,i=r):g=g.next=R,Fe.lanes|=L,nr|=L}w=w.next}while(w!==null&&w!==a);g===null?i=r:g.next=c,jt(r,t.memoizedState)||(ct=!0),t.memoizedState=r,t.baseState=i,t.baseQueue=g,n.lastRenderedState=r}if(e=n.interleaved,e!==null){l=e;do a=l.lane,Fe.lanes|=a,nr|=a,l=l.next;while(l!==e)}else l===null&&(n.lanes=0);return[t.memoizedState,n.dispatch]}function ts(e){var t=bt(),n=t.queue;if(n===null)throw Error(s(311));n.lastRenderedReducer=e;var r=n.dispatch,l=n.pending,a=t.memoizedState;if(l!==null){n.pending=null;var i=l=l.next;do a=e(a,i.action),i=i.next;while(i!==l);jt(a,t.memoizedState)||(ct=!0),t.memoizedState=a,t.baseQueue===null&&(t.baseState=a),n.lastRenderedState=a}return[a,r]}function wu(){}function ku(e,t){var n=Fe,r=bt(),l=t(),a=!jt(r.memoizedState,l);if(a&&(r.memoizedState=l,ct=!0),r=r.queue,ns(Eu.bind(null,n,r,e),[e]),r.getSnapshot!==t||a||Qe!==null&&Qe.memoizedState.tag&1){if(n.flags|=2048,kl(9,Su.bind(null,n,r,l,t),void 0,null),Je===null)throw Error(s(349));(tr&30)!==0||bu(n,t,l)}return l}function bu(e,t,n){e.flags|=16384,e={getSnapshot:t,value:n},t=Fe.updateQueue,t===null?(t={lastEffect:null,stores:null},Fe.updateQueue=t,t.stores=[e]):(n=t.stores,n===null?t.stores=[e]:n.push(e))}function Su(e,t,n,r){t.value=n,t.getSnapshot=r,Cu(t)&&Au(e)}function Eu(e,t,n){return n(function(){Cu(t)&&Au(e)})}function Cu(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!jt(e,n)}catch{return!0}}function Au(e){var t=un(e,1);t!==null&&Dt(t,e,1,-1)}function Nu(e){var t=Ht();return typeof e=="function"&&(e=e()),t.memoizedState=t.baseState=e,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:wl,lastRenderedState:e},t.queue=e,e=e.dispatch=jf.bind(null,Fe,e),[t.memoizedState,e]}function kl(e,t,n,r){return e={tag:e,create:t,destroy:n,deps:r,next:null},t=Fe.updateQueue,t===null?(t={lastEffect:null,stores:null},Fe.updateQueue=t,t.lastEffect=e.next=e):(n=t.lastEffect,n===null?t.lastEffect=e.next=e:(r=n.next,n.next=e,e.next=r,t.lastEffect=e)),e}function Tu(){return bt().memoizedState}function va(e,t,n,r){var l=Ht();Fe.flags|=e,l.memoizedState=kl(1|t,n,void 0,r===void 0?null:r)}function ya(e,t,n,r){var l=bt();r=r===void 0?null:r;var a=void 0;if(He!==null){var i=He.memoizedState;if(a=i.destroy,r!==null&&qo(r,i.deps)){l.memoizedState=kl(t,n,a,r);return}}Fe.flags|=e,l.memoizedState=kl(1|t,n,a,r)}function Pu(e,t){return va(8390656,8,e,t)}function ns(e,t){return ya(2048,8,e,t)}function ju(e,t){return ya(4,2,e,t)}function Mu(e,t){return ya(4,4,e,t)}function zu(e,t){if(typeof t=="function")return e=e(),t(e),function(){t(null)};if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function Lu(e,t,n){return n=n!=null?n.concat([e]):null,ya(4,4,zu.bind(null,t,e),n)}function rs(){}function Ru(e,t){var n=bt();t=t===void 0?null:t;var r=n.memoizedState;return r!==null&&t!==null&&qo(t,r[1])?r[0]:(n.memoizedState=[e,t],e)}function Du(e,t){var n=bt();t=t===void 0?null:t;var r=n.memoizedState;return r!==null&&t!==null&&qo(t,r[1])?r[0]:(e=e(),n.memoizedState=[e,t],e)}function $u(e,t,n){return(tr&21)===0?(e.baseState&&(e.baseState=!1,ct=!0),e.memoizedState=n):(jt(n,t)||(n=fi(),Fe.lanes|=n,nr|=n,e.baseState=!0),t)}function Tf(e,t){var n=Ce;Ce=n!==0&&4>n?n:4,e(!0);var r=Go.transition;Go.transition={};try{e(!1),t()}finally{Ce=n,Go.transition=r}}function Iu(){return bt().memoizedState}function Pf(e,t,n){var r=zn(e);if(n={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null},Ou(e))Fu(t,n);else if(n=hu(e,t,n,r),n!==null){var l=lt();Dt(n,e,r,l),Bu(n,t,r)}}function jf(e,t,n){var r=zn(e),l={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null};if(Ou(e))Fu(t,l);else{var a=e.alternate;if(e.lanes===0&&(a===null||a.lanes===0)&&(a=t.lastRenderedReducer,a!==null))try{var i=t.lastRenderedState,c=a(i,n);if(l.hasEagerState=!0,l.eagerState=c,jt(c,i)){var g=t.interleaved;g===null?(l.next=l,Ho(t)):(l.next=g.next,g.next=l),t.interleaved=l;return}}catch{}finally{}n=hu(e,t,l,r),n!==null&&(l=lt(),Dt(n,e,r,l),Bu(n,t,r))}}function Ou(e){var t=e.alternate;return e===Fe||t!==null&&t===Fe}function Fu(e,t){yl=xa=!0;var n=e.pending;n===null?t.next=t:(t.next=n.next,n.next=t),e.pending=t}function Bu(e,t,n){if((n&4194240)!==0){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,lo(e,n)}}var _a={readContext:kt,useCallback:et,useContext:et,useEffect:et,useImperativeHandle:et,useInsertionEffect:et,useLayoutEffect:et,useMemo:et,useReducer:et,useRef:et,useState:et,useDebugValue:et,useDeferredValue:et,useTransition:et,useMutableSource:et,useSyncExternalStore:et,useId:et,unstable_isNewReconciler:!1},Mf={readContext:kt,useCallback:function(e,t){return Ht().memoizedState=[e,t===void 0?null:t],e},useContext:kt,useEffect:Pu,useImperativeHandle:function(e,t,n){return n=n!=null?n.concat([e]):null,va(4194308,4,zu.bind(null,t,e),n)},useLayoutEffect:function(e,t){return va(4194308,4,e,t)},useInsertionEffect:function(e,t){return va(4,2,e,t)},useMemo:function(e,t){var n=Ht();return t=t===void 0?null:t,e=e(),n.memoizedState=[e,t],e},useReducer:function(e,t,n){var r=Ht();return t=n!==void 0?n(t):t,r.memoizedState=r.baseState=t,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:t},r.queue=e,e=e.dispatch=Pf.bind(null,Fe,e),[r.memoizedState,e]},useRef:function(e){var t=Ht();return e={current:e},t.memoizedState=e},useState:Nu,useDebugValue:rs,useDeferredValue:function(e){return Ht().memoizedState=e},useTransition:function(){var e=Nu(!1),t=e[0];return e=Tf.bind(null,e[1]),Ht().memoizedState=e,[t,e]},useMutableSource:function(){},useSyncExternalStore:function(e,t,n){var r=Fe,l=Ht();if($e){if(n===void 0)throw Error(s(407));n=n()}else{if(n=t(),Je===null)throw Error(s(349));(tr&30)!==0||bu(r,t,n)}l.memoizedState=n;var a={value:n,getSnapshot:t};return l.queue=a,Pu(Eu.bind(null,r,a,e),[e]),r.flags|=2048,kl(9,Su.bind(null,r,a,n,t),void 0,null),n},useId:function(){var e=Ht(),t=Je.identifierPrefix;if($e){var n=sn,r=on;n=(r&~(1<<32-se(r)-1)).toString(32)+n,t=":"+t+"R"+n,n=_l++,0<n&&(t+="H"+n.toString(32)),t+=":"}else n=Nf++,t=":"+t+"r"+n.toString(32)+":";return e.memoizedState=t},unstable_isNewReconciler:!1},zf={readContext:kt,useCallback:Ru,useContext:kt,useEffect:ns,useImperativeHandle:Lu,useInsertionEffect:ju,useLayoutEffect:Mu,useMemo:Du,useReducer:es,useRef:Tu,useState:function(){return es(wl)},useDebugValue:rs,useDeferredValue:function(e){var t=bt();return $u(t,He.memoizedState,e)},useTransition:function(){var e=es(wl)[0],t=bt().memoizedState;return[e,t]},useMutableSource:wu,useSyncExternalStore:ku,useId:Iu,unstable_isNewReconciler:!1},Lf={readContext:kt,useCallback:Ru,useContext:kt,useEffect:ns,useImperativeHandle:Lu,useInsertionEffect:ju,useLayoutEffect:Mu,useMemo:Du,useReducer:ts,useRef:Tu,useState:function(){return ts(wl)},useDebugValue:rs,useDeferredValue:function(e){var t=bt();return He===null?t.memoizedState=e:$u(t,He.memoizedState,e)},useTransition:function(){var e=ts(wl)[0],t=bt().memoizedState;return[e,t]},useMutableSource:wu,useSyncExternalStore:ku,useId:Iu,unstable_isNewReconciler:!1};function zt(e,t){if(e&&e.defaultProps){t=$({},t),e=e.defaultProps;for(var n in e)t[n]===void 0&&(t[n]=e[n]);return t}return t}function ls(e,t,n,r){t=e.memoizedState,n=n(r,t),n=n==null?t:$({},t,n),e.memoizedState=n,e.lanes===0&&(e.updateQueue.baseState=n)}var wa={isMounted:function(e){return(e=e._reactInternals)?rn(e)===e:!1},enqueueSetState:function(e,t,n){e=e._reactInternals;var r=lt(),l=zn(e),a=cn(r,l);a.payload=t,n!=null&&(a.callback=n),t=Tn(e,a,l),t!==null&&(Dt(t,e,l,r),fa(t,e,l))},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var r=lt(),l=zn(e),a=cn(r,l);a.tag=1,a.payload=t,n!=null&&(a.callback=n),t=Tn(e,a,l),t!==null&&(Dt(t,e,l,r),fa(t,e,l))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=lt(),r=zn(e),l=cn(n,r);l.tag=2,t!=null&&(l.callback=t),t=Tn(e,l,r),t!==null&&(Dt(t,e,r,n),fa(t,e,r))}};function Uu(e,t,n,r,l,a,i){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(r,a,i):t.prototype&&t.prototype.isPureReactComponent?!il(n,r)||!il(l,a):!0}function Wu(e,t,n){var r=!1,l=Cn,a=t.contextType;return typeof a=="object"&&a!==null?a=kt(a):(l=ut(t)?Gn:Ze.current,r=t.contextTypes,a=(r=r!=null)?Pr(e,l):Cn),t=new t(n,a),e.memoizedState=t.state!==null&&t.state!==void 0?t.state:null,t.updater=wa,e.stateNode=t,t._reactInternals=e,r&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=l,e.__reactInternalMemoizedMaskedChildContext=a),t}function Hu(e,t,n,r){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(n,r),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(n,r),t.state!==e&&wa.enqueueReplaceState(t,t.state,null)}function as(e,t,n,r){var l=e.stateNode;l.props=n,l.state=e.memoizedState,l.refs={},Vo(e);var a=t.contextType;typeof a=="object"&&a!==null?l.context=kt(a):(a=ut(t)?Gn:Ze.current,l.context=Pr(e,a)),l.state=e.memoizedState,a=t.getDerivedStateFromProps,typeof a=="function"&&(ls(e,t,a,n),l.state=e.memoizedState),typeof t.getDerivedStateFromProps=="function"||typeof l.getSnapshotBeforeUpdate=="function"||typeof l.UNSAFE_componentWillMount!="function"&&typeof l.componentWillMount!="function"||(t=l.state,typeof l.componentWillMount=="function"&&l.componentWillMount(),typeof l.UNSAFE_componentWillMount=="function"&&l.UNSAFE_componentWillMount(),t!==l.state&&wa.enqueueReplaceState(l,l.state,null),ga(e,n,l,r),l.state=e.memoizedState),typeof l.componentDidMount=="function"&&(e.flags|=4194308)}function Ir(e,t){try{var n="",r=t;do n+=de(r),r=r.return;while(r);var l=n}catch(a){l=`
Error generating stack: `+a.message+`
`+a.stack}return{value:e,source:t,stack:l,digest:null}}function os(e,t,n){return{value:e,source:null,stack:n??null,digest:t??null}}function ss(e,t){try{console.error(t.value)}catch(n){setTimeout(function(){throw n})}}var Rf=typeof WeakMap=="function"?WeakMap:Map;function Vu(e,t,n){n=cn(-1,n),n.tag=3,n.payload={element:null};var r=t.value;return n.callback=function(){Na||(Na=!0,ks=r),ss(e,t)},n}function Ku(e,t,n){n=cn(-1,n),n.tag=3;var r=e.type.getDerivedStateFromError;if(typeof r=="function"){var l=t.value;n.payload=function(){return r(l)},n.callback=function(){ss(e,t)}}var a=e.stateNode;return a!==null&&typeof a.componentDidCatch=="function"&&(n.callback=function(){ss(e,t),typeof r!="function"&&(jn===null?jn=new Set([this]):jn.add(this));var i=t.stack;this.componentDidCatch(t.value,{componentStack:i!==null?i:""})}),n}function Yu(e,t,n){var r=e.pingCache;if(r===null){r=e.pingCache=new Rf;var l=new Set;r.set(t,l)}else l=r.get(t),l===void 0&&(l=new Set,r.set(t,l));l.has(n)||(l.add(n),e=Jf.bind(null,e,t,n),t.then(e,e))}function Qu(e){do{var t;if((t=e.tag===13)&&(t=e.memoizedState,t=t!==null?t.dehydrated!==null:!0),t)return e;e=e.return}while(e!==null);return null}function Ju(e,t,n,r,l){return(e.mode&1)===0?(e===t?e.flags|=65536:(e.flags|=128,n.flags|=131072,n.flags&=-52805,n.tag===1&&(n.alternate===null?n.tag=17:(t=cn(-1,1),t.tag=2,Tn(n,t,1))),n.lanes|=1),e):(e.flags|=65536,e.lanes=l,e)}var Df=be.ReactCurrentOwner,ct=!1;function rt(e,t,n,r){t.child=e===null?mu(t,null,n,r):Lr(t,e.child,n,r)}function Gu(e,t,n,r,l){n=n.render;var a=t.ref;return Dr(t,l),r=Xo(e,t,n,r,a,l),n=Zo(),e!==null&&!ct?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~l,dn(e,t,l)):($e&&n&&Ro(t),t.flags|=1,rt(e,t,r,l),t.child)}function qu(e,t,n,r,l){if(e===null){var a=n.type;return typeof a=="function"&&!Ts(a)&&a.defaultProps===void 0&&n.compare===null&&n.defaultProps===void 0?(t.tag=15,t.type=a,Xu(e,t,a,r,l)):(e=La(n.type,null,r,t,t.mode,l),e.ref=t.ref,e.return=t,t.child=e)}if(a=e.child,(e.lanes&l)===0){var i=a.memoizedProps;if(n=n.compare,n=n!==null?n:il,n(i,r)&&e.ref===t.ref)return dn(e,t,l)}return t.flags|=1,e=Rn(a,r),e.ref=t.ref,e.return=t,t.child=e}function Xu(e,t,n,r,l){if(e!==null){var a=e.memoizedProps;if(il(a,r)&&e.ref===t.ref)if(ct=!1,t.pendingProps=r=a,(e.lanes&l)!==0)(e.flags&131072)!==0&&(ct=!0);else return t.lanes=e.lanes,dn(e,t,l)}return is(e,t,n,r,l)}function Zu(e,t,n){var r=t.pendingProps,l=r.children,a=e!==null?e.memoizedState:null;if(r.mode==="hidden")if((t.mode&1)===0)t.memoizedState={baseLanes:0,cachePool:null,transitions:null},ze(Fr,ht),ht|=n;else{if((n&1073741824)===0)return e=a!==null?a.baseLanes|n:n,t.lanes=t.childLanes=1073741824,t.memoizedState={baseLanes:e,cachePool:null,transitions:null},t.updateQueue=null,ze(Fr,ht),ht|=e,null;t.memoizedState={baseLanes:0,cachePool:null,transitions:null},r=a!==null?a.baseLanes:n,ze(Fr,ht),ht|=r}else a!==null?(r=a.baseLanes|n,t.memoizedState=null):r=n,ze(Fr,ht),ht|=r;return rt(e,t,l,n),t.child}function ec(e,t){var n=t.ref;(e===null&&n!==null||e!==null&&e.ref!==n)&&(t.flags|=512,t.flags|=2097152)}function is(e,t,n,r,l){var a=ut(n)?Gn:Ze.current;return a=Pr(t,a),Dr(t,l),n=Xo(e,t,n,r,a,l),r=Zo(),e!==null&&!ct?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~l,dn(e,t,l)):($e&&r&&Ro(t),t.flags|=1,rt(e,t,n,l),t.child)}function tc(e,t,n,r,l){if(ut(n)){var a=!0;aa(t)}else a=!1;if(Dr(t,l),t.stateNode===null)ba(e,t),Wu(t,n,r),as(t,n,r,l),r=!0;else if(e===null){var i=t.stateNode,c=t.memoizedProps;i.props=c;var g=i.context,w=n.contextType;typeof w=="object"&&w!==null?w=kt(w):(w=ut(n)?Gn:Ze.current,w=Pr(t,w));var L=n.getDerivedStateFromProps,R=typeof L=="function"||typeof i.getSnapshotBeforeUpdate=="function";R||typeof i.UNSAFE_componentWillReceiveProps!="function"&&typeof i.componentWillReceiveProps!="function"||(c!==r||g!==w)&&Hu(t,i,r,w),Nn=!1;var z=t.memoizedState;i.state=z,ga(t,r,i,l),g=t.memoizedState,c!==r||z!==g||it.current||Nn?(typeof L=="function"&&(ls(t,n,L,r),g=t.memoizedState),(c=Nn||Uu(t,n,c,r,z,g,w))?(R||typeof i.UNSAFE_componentWillMount!="function"&&typeof i.componentWillMount!="function"||(typeof i.componentWillMount=="function"&&i.componentWillMount(),typeof i.UNSAFE_componentWillMount=="function"&&i.UNSAFE_componentWillMount()),typeof i.componentDidMount=="function"&&(t.flags|=4194308)):(typeof i.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=r,t.memoizedState=g),i.props=r,i.state=g,i.context=w,r=c):(typeof i.componentDidMount=="function"&&(t.flags|=4194308),r=!1)}else{i=t.stateNode,xu(e,t),c=t.memoizedProps,w=t.type===t.elementType?c:zt(t.type,c),i.props=w,R=t.pendingProps,z=i.context,g=n.contextType,typeof g=="object"&&g!==null?g=kt(g):(g=ut(n)?Gn:Ze.current,g=Pr(t,g));var H=n.getDerivedStateFromProps;(L=typeof H=="function"||typeof i.getSnapshotBeforeUpdate=="function")||typeof i.UNSAFE_componentWillReceiveProps!="function"&&typeof i.componentWillReceiveProps!="function"||(c!==R||z!==g)&&Hu(t,i,r,g),Nn=!1,z=t.memoizedState,i.state=z,ga(t,r,i,l);var Q=t.memoizedState;c!==R||z!==Q||it.current||Nn?(typeof H=="function"&&(ls(t,n,H,r),Q=t.memoizedState),(w=Nn||Uu(t,n,w,r,z,Q,g)||!1)?(L||typeof i.UNSAFE_componentWillUpdate!="function"&&typeof i.componentWillUpdate!="function"||(typeof i.componentWillUpdate=="function"&&i.componentWillUpdate(r,Q,g),typeof i.UNSAFE_componentWillUpdate=="function"&&i.UNSAFE_componentWillUpdate(r,Q,g)),typeof i.componentDidUpdate=="function"&&(t.flags|=4),typeof i.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof i.componentDidUpdate!="function"||c===e.memoizedProps&&z===e.memoizedState||(t.flags|=4),typeof i.getSnapshotBeforeUpdate!="function"||c===e.memoizedProps&&z===e.memoizedState||(t.flags|=1024),t.memoizedProps=r,t.memoizedState=Q),i.props=r,i.state=Q,i.context=g,r=w):(typeof i.componentDidUpdate!="function"||c===e.memoizedProps&&z===e.memoizedState||(t.flags|=4),typeof i.getSnapshotBeforeUpdate!="function"||c===e.memoizedProps&&z===e.memoizedState||(t.flags|=1024),r=!1)}return us(e,t,n,r,a,l)}function us(e,t,n,r,l,a){ec(e,t);var i=(t.flags&128)!==0;if(!r&&!i)return l&&ou(t,n,!1),dn(e,t,a);r=t.stateNode,Df.current=t;var c=i&&typeof n.getDerivedStateFromError!="function"?null:r.render();return t.flags|=1,e!==null&&i?(t.child=Lr(t,e.child,null,a),t.child=Lr(t,null,c,a)):rt(e,t,c,a),t.memoizedState=r.state,l&&ou(t,n,!0),t.child}function nc(e){var t=e.stateNode;t.pendingContext?lu(e,t.pendingContext,t.pendingContext!==t.context):t.context&&lu(e,t.context,!1),Ko(e,t.containerInfo)}function rc(e,t,n,r,l){return zr(),Oo(l),t.flags|=256,rt(e,t,n,r),t.child}var cs={dehydrated:null,treeContext:null,retryLane:0};function ds(e){return{baseLanes:e,cachePool:null,transitions:null}}function lc(e,t,n){var r=t.pendingProps,l=Oe.current,a=!1,i=(t.flags&128)!==0,c;if((c=i)||(c=e!==null&&e.memoizedState===null?!1:(l&2)!==0),c?(a=!0,t.flags&=-129):(e===null||e.memoizedState!==null)&&(l|=1),ze(Oe,l&1),e===null)return Io(t),e=t.memoizedState,e!==null&&(e=e.dehydrated,e!==null)?((t.mode&1)===0?t.lanes=1:e.data==="$!"?t.lanes=8:t.lanes=1073741824,null):(i=r.children,e=r.fallback,a?(r=t.mode,a=t.child,i={mode:"hidden",children:i},(r&1)===0&&a!==null?(a.childLanes=0,a.pendingProps=i):a=Ra(i,r,0,null),e=or(e,r,n,null),a.return=t,e.return=t,a.sibling=e,t.child=a,t.child.memoizedState=ds(n),t.memoizedState=cs,e):ps(t,i));if(l=e.memoizedState,l!==null&&(c=l.dehydrated,c!==null))return $f(e,t,i,r,c,l,n);if(a){a=r.fallback,i=t.mode,l=e.child,c=l.sibling;var g={mode:"hidden",children:r.children};return(i&1)===0&&t.child!==l?(r=t.child,r.childLanes=0,r.pendingProps=g,t.deletions=null):(r=Rn(l,g),r.subtreeFlags=l.subtreeFlags&14680064),c!==null?a=Rn(c,a):(a=or(a,i,n,null),a.flags|=2),a.return=t,r.return=t,r.sibling=a,t.child=r,r=a,a=t.child,i=e.child.memoizedState,i=i===null?ds(n):{baseLanes:i.baseLanes|n,cachePool:null,transitions:i.transitions},a.memoizedState=i,a.childLanes=e.childLanes&~n,t.memoizedState=cs,r}return a=e.child,e=a.sibling,r=Rn(a,{mode:"visible",children:r.children}),(t.mode&1)===0&&(r.lanes=n),r.return=t,r.sibling=null,e!==null&&(n=t.deletions,n===null?(t.deletions=[e],t.flags|=16):n.push(e)),t.child=r,t.memoizedState=null,r}function ps(e,t){return t=Ra({mode:"visible",children:t},e.mode,0,null),t.return=e,e.child=t}function ka(e,t,n,r){return r!==null&&Oo(r),Lr(t,e.child,null,n),e=ps(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function $f(e,t,n,r,l,a,i){if(n)return t.flags&256?(t.flags&=-257,r=os(Error(s(422))),ka(e,t,i,r)):t.memoizedState!==null?(t.child=e.child,t.flags|=128,null):(a=r.fallback,l=t.mode,r=Ra({mode:"visible",children:r.children},l,0,null),a=or(a,l,i,null),a.flags|=2,r.return=t,a.return=t,r.sibling=a,t.child=r,(t.mode&1)!==0&&Lr(t,e.child,null,i),t.child.memoizedState=ds(i),t.memoizedState=cs,a);if((t.mode&1)===0)return ka(e,t,i,null);if(l.data==="$!"){if(r=l.nextSibling&&l.nextSibling.dataset,r)var c=r.dgst;return r=c,a=Error(s(419)),r=os(a,r,void 0),ka(e,t,i,r)}if(c=(i&e.childLanes)!==0,ct||c){if(r=Je,r!==null){switch(i&-i){case 4:l=2;break;case 16:l=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:l=32;break;case 536870912:l=268435456;break;default:l=0}l=(l&(r.suspendedLanes|i))!==0?0:l,l!==0&&l!==a.retryLane&&(a.retryLane=l,un(e,l),Dt(r,e,l,-1))}return Ns(),r=os(Error(s(421))),ka(e,t,i,r)}return l.data==="$?"?(t.flags|=128,t.child=e.child,t=Gf.bind(null,e),l._reactRetry=t,null):(e=a.treeContext,mt=Sn(l.nextSibling),gt=t,$e=!0,Mt=null,e!==null&&(_t[wt++]=on,_t[wt++]=sn,_t[wt++]=qn,on=e.id,sn=e.overflow,qn=t),t=ps(t,r.children),t.flags|=4096,t)}function ac(e,t,n){e.lanes|=t;var r=e.alternate;r!==null&&(r.lanes|=t),Wo(e.return,t,n)}function fs(e,t,n,r,l){var a=e.memoizedState;a===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:r,tail:n,tailMode:l}:(a.isBackwards=t,a.rendering=null,a.renderingStartTime=0,a.last=r,a.tail=n,a.tailMode=l)}function oc(e,t,n){var r=t.pendingProps,l=r.revealOrder,a=r.tail;if(rt(e,t,r.children,n),r=Oe.current,(r&2)!==0)r=r&1|2,t.flags|=128;else{if(e!==null&&(e.flags&128)!==0)e:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&ac(e,n,t);else if(e.tag===19)ac(e,n,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}r&=1}if(ze(Oe,r),(t.mode&1)===0)t.memoizedState=null;else switch(l){case"forwards":for(n=t.child,l=null;n!==null;)e=n.alternate,e!==null&&ma(e)===null&&(l=n),n=n.sibling;n=l,n===null?(l=t.child,t.child=null):(l=n.sibling,n.sibling=null),fs(t,!1,l,n,a);break;case"backwards":for(n=null,l=t.child,t.child=null;l!==null;){if(e=l.alternate,e!==null&&ma(e)===null){t.child=l;break}e=l.sibling,l.sibling=n,n=l,l=e}fs(t,!0,n,null,a);break;case"together":fs(t,!1,null,null,void 0);break;default:t.memoizedState=null}return t.child}function ba(e,t){(t.mode&1)===0&&e!==null&&(e.alternate=null,t.alternate=null,t.flags|=2)}function dn(e,t,n){if(e!==null&&(t.dependencies=e.dependencies),nr|=t.lanes,(n&t.childLanes)===0)return null;if(e!==null&&t.child!==e.child)throw Error(s(153));if(t.child!==null){for(e=t.child,n=Rn(e,e.pendingProps),t.child=n,n.return=t;e.sibling!==null;)e=e.sibling,n=n.sibling=Rn(e,e.pendingProps),n.return=t;n.sibling=null}return t.child}function If(e,t,n){switch(t.tag){case 3:nc(t),zr();break;case 5:_u(t);break;case 1:ut(t.type)&&aa(t);break;case 4:Ko(t,t.stateNode.containerInfo);break;case 10:var r=t.type._context,l=t.memoizedProps.value;ze(da,r._currentValue),r._currentValue=l;break;case 13:if(r=t.memoizedState,r!==null)return r.dehydrated!==null?(ze(Oe,Oe.current&1),t.flags|=128,null):(n&t.child.childLanes)!==0?lc(e,t,n):(ze(Oe,Oe.current&1),e=dn(e,t,n),e!==null?e.sibling:null);ze(Oe,Oe.current&1);break;case 19:if(r=(n&t.childLanes)!==0,(e.flags&128)!==0){if(r)return oc(e,t,n);t.flags|=128}if(l=t.memoizedState,l!==null&&(l.rendering=null,l.tail=null,l.lastEffect=null),ze(Oe,Oe.current),r)break;return null;case 22:case 23:return t.lanes=0,Zu(e,t,n)}return dn(e,t,n)}var sc,gs,ic,uc;sc=function(e,t){for(var n=t.child;n!==null;){if(n.tag===5||n.tag===6)e.appendChild(n.stateNode);else if(n.tag!==4&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===t)break;for(;n.sibling===null;){if(n.return===null||n.return===t)return;n=n.return}n.sibling.return=n.return,n=n.sibling}},gs=function(){},ic=function(e,t,n,r){var l=e.memoizedProps;if(l!==r){e=t.stateNode,er(Wt.current);var a=null;switch(n){case"input":l=It(e,l),r=It(e,r),a=[];break;case"select":l=$({},l,{value:void 0}),r=$({},r,{value:void 0}),a=[];break;case"textarea":l=ot(e,l),r=ot(e,r),a=[];break;default:typeof l.onClick!="function"&&typeof r.onClick=="function"&&(e.onclick=na)}cr(n,r);var i;n=null;for(w in l)if(!r.hasOwnProperty(w)&&l.hasOwnProperty(w)&&l[w]!=null)if(w==="style"){var c=l[w];for(i in c)c.hasOwnProperty(i)&&(n||(n={}),n[i]="")}else w!=="dangerouslySetInnerHTML"&&w!=="children"&&w!=="suppressContentEditableWarning"&&w!=="suppressHydrationWarning"&&w!=="autoFocus"&&(v.hasOwnProperty(w)?a||(a=[]):(a=a||[]).push(w,null));for(w in r){var g=r[w];if(c=l!=null?l[w]:void 0,r.hasOwnProperty(w)&&g!==c&&(g!=null||c!=null))if(w==="style")if(c){for(i in c)!c.hasOwnProperty(i)||g&&g.hasOwnProperty(i)||(n||(n={}),n[i]="");for(i in g)g.hasOwnProperty(i)&&c[i]!==g[i]&&(n||(n={}),n[i]=g[i])}else n||(a||(a=[]),a.push(w,n)),n=g;else w==="dangerouslySetInnerHTML"?(g=g?g.__html:void 0,c=c?c.__html:void 0,g!=null&&c!==g&&(a=a||[]).push(w,g)):w==="children"?typeof g!="string"&&typeof g!="number"||(a=a||[]).push(w,""+g):w!=="suppressContentEditableWarning"&&w!=="suppressHydrationWarning"&&(v.hasOwnProperty(w)?(g!=null&&w==="onScroll"&&Re("scroll",e),a||c===g||(a=[])):(a=a||[]).push(w,g))}n&&(a=a||[]).push("style",n);var w=a;(t.updateQueue=w)&&(t.flags|=4)}},uc=function(e,t,n,r){n!==r&&(t.flags|=4)};function bl(e,t){if(!$e)switch(e.tailMode){case"hidden":t=e.tail;for(var n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?e.tail=null:n.sibling=null;break;case"collapsed":n=e.tail;for(var r=null;n!==null;)n.alternate!==null&&(r=n),n=n.sibling;r===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:r.sibling=null}}function tt(e){var t=e.alternate!==null&&e.alternate.child===e.child,n=0,r=0;if(t)for(var l=e.child;l!==null;)n|=l.lanes|l.childLanes,r|=l.subtreeFlags&14680064,r|=l.flags&14680064,l.return=e,l=l.sibling;else for(l=e.child;l!==null;)n|=l.lanes|l.childLanes,r|=l.subtreeFlags,r|=l.flags,l.return=e,l=l.sibling;return e.subtreeFlags|=r,e.childLanes=n,t}function Of(e,t,n){var r=t.pendingProps;switch(Do(t),t.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return tt(t),null;case 1:return ut(t.type)&&la(),tt(t),null;case 3:return r=t.stateNode,$r(),De(it),De(Ze),Jo(),r.pendingContext&&(r.context=r.pendingContext,r.pendingContext=null),(e===null||e.child===null)&&(ua(t)?t.flags|=4:e===null||e.memoizedState.isDehydrated&&(t.flags&256)===0||(t.flags|=1024,Mt!==null&&(Es(Mt),Mt=null))),gs(e,t),tt(t),null;case 5:Yo(t);var l=er(vl.current);if(n=t.type,e!==null&&t.stateNode!=null)ic(e,t,n,r,l),e.ref!==t.ref&&(t.flags|=512,t.flags|=2097152);else{if(!r){if(t.stateNode===null)throw Error(s(166));return tt(t),null}if(e=er(Wt.current),ua(t)){r=t.stateNode,n=t.type;var a=t.memoizedProps;switch(r[Ut]=t,r[fl]=a,e=(t.mode&1)!==0,n){case"dialog":Re("cancel",r),Re("close",r);break;case"iframe":case"object":case"embed":Re("load",r);break;case"video":case"audio":for(l=0;l<cl.length;l++)Re(cl[l],r);break;case"source":Re("error",r);break;case"img":case"image":case"link":Re("error",r),Re("load",r);break;case"details":Re("toggle",r);break;case"input":Ot(r,a),Re("invalid",r);break;case"select":r._wrapperState={wasMultiple:!!a.multiple},Re("invalid",r);break;case"textarea":In(r,a),Re("invalid",r)}cr(n,a),l=null;for(var i in a)if(a.hasOwnProperty(i)){var c=a[i];i==="children"?typeof c=="string"?r.textContent!==c&&(a.suppressHydrationWarning!==!0&&ta(r.textContent,c,e),l=["children",c]):typeof c=="number"&&r.textContent!==""+c&&(a.suppressHydrationWarning!==!0&&ta(r.textContent,c,e),l=["children",""+c]):v.hasOwnProperty(i)&&c!=null&&i==="onScroll"&&Re("scroll",r)}switch(n){case"input":$t(r),Qt(r,a,!0);break;case"textarea":$t(r),ur(r);break;case"select":case"option":break;default:typeof a.onClick=="function"&&(r.onclick=na)}r=l,t.updateQueue=r,r!==null&&(t.flags|=4)}else{i=l.nodeType===9?l:l.ownerDocument,e==="http://www.w3.org/1999/xhtml"&&(e=Ye(n)),e==="http://www.w3.org/1999/xhtml"?n==="script"?(e=i.createElement("div"),e.innerHTML="<script><\/script>",e=e.removeChild(e.firstChild)):typeof r.is=="string"?e=i.createElement(n,{is:r.is}):(e=i.createElement(n),n==="select"&&(i=e,r.multiple?i.multiple=!0:r.size&&(i.size=r.size))):e=i.createElementNS(e,n),e[Ut]=t,e[fl]=r,sc(e,t,!1,!1),t.stateNode=e;e:{switch(i=Kr(n,r),n){case"dialog":Re("cancel",e),Re("close",e),l=r;break;case"iframe":case"object":case"embed":Re("load",e),l=r;break;case"video":case"audio":for(l=0;l<cl.length;l++)Re(cl[l],e);l=r;break;case"source":Re("error",e),l=r;break;case"img":case"image":case"link":Re("error",e),Re("load",e),l=r;break;case"details":Re("toggle",e),l=r;break;case"input":Ot(e,r),l=It(e,r),Re("invalid",e);break;case"option":l=r;break;case"select":e._wrapperState={wasMultiple:!!r.multiple},l=$({},r,{value:void 0}),Re("invalid",e);break;case"textarea":In(e,r),l=ot(e,r),Re("invalid",e);break;default:l=r}cr(n,l),c=l;for(a in c)if(c.hasOwnProperty(a)){var g=c[a];a==="style"?Un(e,g):a==="dangerouslySetInnerHTML"?(g=g?g.__html:void 0,g!=null&&Bn(e,g)):a==="children"?typeof g=="string"?(n!=="textarea"||g!=="")&&At(e,g):typeof g=="number"&&At(e,""+g):a!=="suppressContentEditableWarning"&&a!=="suppressHydrationWarning"&&a!=="autoFocus"&&(v.hasOwnProperty(a)?g!=null&&a==="onScroll"&&Re("scroll",e):g!=null&&Te(e,a,g,i))}switch(n){case"input":$t(e),Qt(e,r,!1);break;case"textarea":$t(e),ur(e);break;case"option":r.value!=null&&e.setAttribute("value",""+he(r.value));break;case"select":e.multiple=!!r.multiple,a=r.value,a!=null?Jt(e,!!r.multiple,a,!1):r.defaultValue!=null&&Jt(e,!!r.multiple,r.defaultValue,!0);break;default:typeof l.onClick=="function"&&(e.onclick=na)}switch(n){case"button":case"input":case"select":case"textarea":r=!!r.autoFocus;break e;case"img":r=!0;break e;default:r=!1}}r&&(t.flags|=4)}t.ref!==null&&(t.flags|=512,t.flags|=2097152)}return tt(t),null;case 6:if(e&&t.stateNode!=null)uc(e,t,e.memoizedProps,r);else{if(typeof r!="string"&&t.stateNode===null)throw Error(s(166));if(n=er(vl.current),er(Wt.current),ua(t)){if(r=t.stateNode,n=t.memoizedProps,r[Ut]=t,(a=r.nodeValue!==n)&&(e=gt,e!==null))switch(e.tag){case 3:ta(r.nodeValue,n,(e.mode&1)!==0);break;case 5:e.memoizedProps.suppressHydrationWarning!==!0&&ta(r.nodeValue,n,(e.mode&1)!==0)}a&&(t.flags|=4)}else r=(n.nodeType===9?n:n.ownerDocument).createTextNode(r),r[Ut]=t,t.stateNode=r}return tt(t),null;case 13:if(De(Oe),r=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if($e&&mt!==null&&(t.mode&1)!==0&&(t.flags&128)===0)pu(),zr(),t.flags|=98560,a=!1;else if(a=ua(t),r!==null&&r.dehydrated!==null){if(e===null){if(!a)throw Error(s(318));if(a=t.memoizedState,a=a!==null?a.dehydrated:null,!a)throw Error(s(317));a[Ut]=t}else zr(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;tt(t),a=!1}else Mt!==null&&(Es(Mt),Mt=null),a=!0;if(!a)return t.flags&65536?t:null}return(t.flags&128)!==0?(t.lanes=n,t):(r=r!==null,r!==(e!==null&&e.memoizedState!==null)&&r&&(t.child.flags|=8192,(t.mode&1)!==0&&(e===null||(Oe.current&1)!==0?Ve===0&&(Ve=3):Ns())),t.updateQueue!==null&&(t.flags|=4),tt(t),null);case 4:return $r(),gs(e,t),e===null&&dl(t.stateNode.containerInfo),tt(t),null;case 10:return Uo(t.type._context),tt(t),null;case 17:return ut(t.type)&&la(),tt(t),null;case 19:if(De(Oe),a=t.memoizedState,a===null)return tt(t),null;if(r=(t.flags&128)!==0,i=a.rendering,i===null)if(r)bl(a,!1);else{if(Ve!==0||e!==null&&(e.flags&128)!==0)for(e=t.child;e!==null;){if(i=ma(e),i!==null){for(t.flags|=128,bl(a,!1),r=i.updateQueue,r!==null&&(t.updateQueue=r,t.flags|=4),t.subtreeFlags=0,r=n,n=t.child;n!==null;)a=n,e=r,a.flags&=14680066,i=a.alternate,i===null?(a.childLanes=0,a.lanes=e,a.child=null,a.subtreeFlags=0,a.memoizedProps=null,a.memoizedState=null,a.updateQueue=null,a.dependencies=null,a.stateNode=null):(a.childLanes=i.childLanes,a.lanes=i.lanes,a.child=i.child,a.subtreeFlags=0,a.deletions=null,a.memoizedProps=i.memoizedProps,a.memoizedState=i.memoizedState,a.updateQueue=i.updateQueue,a.type=i.type,e=i.dependencies,a.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext}),n=n.sibling;return ze(Oe,Oe.current&1|2),t.child}e=e.sibling}a.tail!==null&&Ie()>Br&&(t.flags|=128,r=!0,bl(a,!1),t.lanes=4194304)}else{if(!r)if(e=ma(i),e!==null){if(t.flags|=128,r=!0,n=e.updateQueue,n!==null&&(t.updateQueue=n,t.flags|=4),bl(a,!0),a.tail===null&&a.tailMode==="hidden"&&!i.alternate&&!$e)return tt(t),null}else 2*Ie()-a.renderingStartTime>Br&&n!==1073741824&&(t.flags|=128,r=!0,bl(a,!1),t.lanes=4194304);a.isBackwards?(i.sibling=t.child,t.child=i):(n=a.last,n!==null?n.sibling=i:t.child=i,a.last=i)}return a.tail!==null?(t=a.tail,a.rendering=t,a.tail=t.sibling,a.renderingStartTime=Ie(),t.sibling=null,n=Oe.current,ze(Oe,r?n&1|2:n&1),t):(tt(t),null);case 22:case 23:return As(),r=t.memoizedState!==null,e!==null&&e.memoizedState!==null!==r&&(t.flags|=8192),r&&(t.mode&1)!==0?(ht&1073741824)!==0&&(tt(t),t.subtreeFlags&6&&(t.flags|=8192)):tt(t),null;case 24:return null;case 25:return null}throw Error(s(156,t.tag))}function Ff(e,t){switch(Do(t),t.tag){case 1:return ut(t.type)&&la(),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return $r(),De(it),De(Ze),Jo(),e=t.flags,(e&65536)!==0&&(e&128)===0?(t.flags=e&-65537|128,t):null;case 5:return Yo(t),null;case 13:if(De(Oe),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(s(340));zr()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return De(Oe),null;case 4:return $r(),null;case 10:return Uo(t.type._context),null;case 22:case 23:return As(),null;case 24:return null;default:return null}}var Sa=!1,nt=!1,Bf=typeof WeakSet=="function"?WeakSet:Set,Y=null;function Or(e,t){var n=e.ref;if(n!==null)if(typeof n=="function")try{n(null)}catch(r){Be(e,t,r)}else n.current=null}function ms(e,t,n){try{n()}catch(r){Be(e,t,r)}}var cc=!1;function Uf(e,t){if(Ao=Hl,e=Ui(),yo(e)){if("selectionStart"in e)var n={start:e.selectionStart,end:e.selectionEnd};else e:{n=(n=e.ownerDocument)&&n.defaultView||window;var r=n.getSelection&&n.getSelection();if(r&&r.rangeCount!==0){n=r.anchorNode;var l=r.anchorOffset,a=r.focusNode;r=r.focusOffset;try{n.nodeType,a.nodeType}catch{n=null;break e}var i=0,c=-1,g=-1,w=0,L=0,R=e,z=null;t:for(;;){for(var H;R!==n||l!==0&&R.nodeType!==3||(c=i+l),R!==a||r!==0&&R.nodeType!==3||(g=i+r),R.nodeType===3&&(i+=R.nodeValue.length),(H=R.firstChild)!==null;)z=R,R=H;for(;;){if(R===e)break t;if(z===n&&++w===l&&(c=i),z===a&&++L===r&&(g=i),(H=R.nextSibling)!==null)break;R=z,z=R.parentNode}R=H}n=c===-1||g===-1?null:{start:c,end:g}}else n=null}n=n||{start:0,end:0}}else n=null;for(No={focusedElem:e,selectionRange:n},Hl=!1,Y=t;Y!==null;)if(t=Y,e=t.child,(t.subtreeFlags&1028)!==0&&e!==null)e.return=t,Y=e;else for(;Y!==null;){t=Y;try{var Q=t.alternate;if((t.flags&1024)!==0)switch(t.tag){case 0:case 11:case 15:break;case 1:if(Q!==null){var G=Q.memoizedProps,Ue=Q.memoizedState,y=t.stateNode,x=y.getSnapshotBeforeUpdate(t.elementType===t.type?G:zt(t.type,G),Ue);y.__reactInternalSnapshotBeforeUpdate=x}break;case 3:var _=t.stateNode.containerInfo;_.nodeType===1?_.textContent="":_.nodeType===9&&_.documentElement&&_.removeChild(_.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(s(163))}}catch(O){Be(t,t.return,O)}if(e=t.sibling,e!==null){e.return=t.return,Y=e;break}Y=t.return}return Q=cc,cc=!1,Q}function Sl(e,t,n){var r=t.updateQueue;if(r=r!==null?r.lastEffect:null,r!==null){var l=r=r.next;do{if((l.tag&e)===e){var a=l.destroy;l.destroy=void 0,a!==void 0&&ms(t,n,a)}l=l.next}while(l!==r)}}function Ea(e,t){if(t=t.updateQueue,t=t!==null?t.lastEffect:null,t!==null){var n=t=t.next;do{if((n.tag&e)===e){var r=n.create;n.destroy=r()}n=n.next}while(n!==t)}}function hs(e){var t=e.ref;if(t!==null){var n=e.stateNode;switch(e.tag){case 5:e=n;break;default:e=n}typeof t=="function"?t(e):t.current=e}}function dc(e){var t=e.alternate;t!==null&&(e.alternate=null,dc(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&(delete t[Ut],delete t[fl],delete t[Mo],delete t[Sf],delete t[Ef])),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}function pc(e){return e.tag===5||e.tag===3||e.tag===4}function fc(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||pc(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function xs(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?n.nodeType===8?n.parentNode.insertBefore(e,t):n.insertBefore(e,t):(n.nodeType===8?(t=n.parentNode,t.insertBefore(e,n)):(t=n,t.appendChild(e)),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=na));else if(r!==4&&(e=e.child,e!==null))for(xs(e,t,n),e=e.sibling;e!==null;)xs(e,t,n),e=e.sibling}function vs(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?n.insertBefore(e,t):n.appendChild(e);else if(r!==4&&(e=e.child,e!==null))for(vs(e,t,n),e=e.sibling;e!==null;)vs(e,t,n),e=e.sibling}var qe=null,Lt=!1;function Pn(e,t,n){for(n=n.child;n!==null;)gc(e,t,n),n=n.sibling}function gc(e,t,n){if(V&&typeof V.onCommitFiberUnmount=="function")try{V.onCommitFiberUnmount(I,n)}catch{}switch(n.tag){case 5:nt||Or(n,t);case 6:var r=qe,l=Lt;qe=null,Pn(e,t,n),qe=r,Lt=l,qe!==null&&(Lt?(e=qe,n=n.stateNode,e.nodeType===8?e.parentNode.removeChild(n):e.removeChild(n)):qe.removeChild(n.stateNode));break;case 18:qe!==null&&(Lt?(e=qe,n=n.stateNode,e.nodeType===8?jo(e.parentNode,n):e.nodeType===1&&jo(e,n),nl(e)):jo(qe,n.stateNode));break;case 4:r=qe,l=Lt,qe=n.stateNode.containerInfo,Lt=!0,Pn(e,t,n),qe=r,Lt=l;break;case 0:case 11:case 14:case 15:if(!nt&&(r=n.updateQueue,r!==null&&(r=r.lastEffect,r!==null))){l=r=r.next;do{var a=l,i=a.destroy;a=a.tag,i!==void 0&&((a&2)!==0||(a&4)!==0)&&ms(n,t,i),l=l.next}while(l!==r)}Pn(e,t,n);break;case 1:if(!nt&&(Or(n,t),r=n.stateNode,typeof r.componentWillUnmount=="function"))try{r.props=n.memoizedProps,r.state=n.memoizedState,r.componentWillUnmount()}catch(c){Be(n,t,c)}Pn(e,t,n);break;case 21:Pn(e,t,n);break;case 22:n.mode&1?(nt=(r=nt)||n.memoizedState!==null,Pn(e,t,n),nt=r):Pn(e,t,n);break;default:Pn(e,t,n)}}function mc(e){var t=e.updateQueue;if(t!==null){e.updateQueue=null;var n=e.stateNode;n===null&&(n=e.stateNode=new Bf),t.forEach(function(r){var l=qf.bind(null,e,r);n.has(r)||(n.add(r),r.then(l,l))})}}function Rt(e,t){var n=t.deletions;if(n!==null)for(var r=0;r<n.length;r++){var l=n[r];try{var a=e,i=t,c=i;e:for(;c!==null;){switch(c.tag){case 5:qe=c.stateNode,Lt=!1;break e;case 3:qe=c.stateNode.containerInfo,Lt=!0;break e;case 4:qe=c.stateNode.containerInfo,Lt=!0;break e}c=c.return}if(qe===null)throw Error(s(160));gc(a,i,l),qe=null,Lt=!1;var g=l.alternate;g!==null&&(g.return=null),l.return=null}catch(w){Be(l,t,w)}}if(t.subtreeFlags&12854)for(t=t.child;t!==null;)hc(t,e),t=t.sibling}function hc(e,t){var n=e.alternate,r=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if(Rt(t,e),Vt(e),r&4){try{Sl(3,e,e.return),Ea(3,e)}catch(G){Be(e,e.return,G)}try{Sl(5,e,e.return)}catch(G){Be(e,e.return,G)}}break;case 1:Rt(t,e),Vt(e),r&512&&n!==null&&Or(n,n.return);break;case 5:if(Rt(t,e),Vt(e),r&512&&n!==null&&Or(n,n.return),e.flags&32){var l=e.stateNode;try{At(l,"")}catch(G){Be(e,e.return,G)}}if(r&4&&(l=e.stateNode,l!=null)){var a=e.memoizedProps,i=n!==null?n.memoizedProps:a,c=e.type,g=e.updateQueue;if(e.updateQueue=null,g!==null)try{c==="input"&&a.type==="radio"&&a.name!=null&&ir(l,a),Kr(c,i);var w=Kr(c,a);for(i=0;i<g.length;i+=2){var L=g[i],R=g[i+1];L==="style"?Un(l,R):L==="dangerouslySetInnerHTML"?Bn(l,R):L==="children"?At(l,R):Te(l,L,R,w)}switch(c){case"input":Ct(l,a);break;case"textarea":Gt(l,a);break;case"select":var z=l._wrapperState.wasMultiple;l._wrapperState.wasMultiple=!!a.multiple;var H=a.value;H!=null?Jt(l,!!a.multiple,H,!1):z!==!!a.multiple&&(a.defaultValue!=null?Jt(l,!!a.multiple,a.defaultValue,!0):Jt(l,!!a.multiple,a.multiple?[]:"",!1))}l[fl]=a}catch(G){Be(e,e.return,G)}}break;case 6:if(Rt(t,e),Vt(e),r&4){if(e.stateNode===null)throw Error(s(162));l=e.stateNode,a=e.memoizedProps;try{l.nodeValue=a}catch(G){Be(e,e.return,G)}}break;case 3:if(Rt(t,e),Vt(e),r&4&&n!==null&&n.memoizedState.isDehydrated)try{nl(t.containerInfo)}catch(G){Be(e,e.return,G)}break;case 4:Rt(t,e),Vt(e);break;case 13:Rt(t,e),Vt(e),l=e.child,l.flags&8192&&(a=l.memoizedState!==null,l.stateNode.isHidden=a,!a||l.alternate!==null&&l.alternate.memoizedState!==null||(ws=Ie())),r&4&&mc(e);break;case 22:if(L=n!==null&&n.memoizedState!==null,e.mode&1?(nt=(w=nt)||L,Rt(t,e),nt=w):Rt(t,e),Vt(e),r&8192){if(w=e.memoizedState!==null,(e.stateNode.isHidden=w)&&!L&&(e.mode&1)!==0)for(Y=e,L=e.child;L!==null;){for(R=Y=L;Y!==null;){switch(z=Y,H=z.child,z.tag){case 0:case 11:case 14:case 15:Sl(4,z,z.return);break;case 1:Or(z,z.return);var Q=z.stateNode;if(typeof Q.componentWillUnmount=="function"){r=z,n=z.return;try{t=r,Q.props=t.memoizedProps,Q.state=t.memoizedState,Q.componentWillUnmount()}catch(G){Be(r,n,G)}}break;case 5:Or(z,z.return);break;case 22:if(z.memoizedState!==null){yc(R);continue}}H!==null?(H.return=z,Y=H):yc(R)}L=L.sibling}e:for(L=null,R=e;;){if(R.tag===5){if(L===null){L=R;try{l=R.stateNode,w?(a=l.style,typeof a.setProperty=="function"?a.setProperty("display","none","important"):a.display="none"):(c=R.stateNode,g=R.memoizedProps.style,i=g!=null&&g.hasOwnProperty("display")?g.display:null,c.style.display=qt("display",i))}catch(G){Be(e,e.return,G)}}}else if(R.tag===6){if(L===null)try{R.stateNode.nodeValue=w?"":R.memoizedProps}catch(G){Be(e,e.return,G)}}else if((R.tag!==22&&R.tag!==23||R.memoizedState===null||R===e)&&R.child!==null){R.child.return=R,R=R.child;continue}if(R===e)break e;for(;R.sibling===null;){if(R.return===null||R.return===e)break e;L===R&&(L=null),R=R.return}L===R&&(L=null),R.sibling.return=R.return,R=R.sibling}}break;case 19:Rt(t,e),Vt(e),r&4&&mc(e);break;case 21:break;default:Rt(t,e),Vt(e)}}function Vt(e){var t=e.flags;if(t&2){try{e:{for(var n=e.return;n!==null;){if(pc(n)){var r=n;break e}n=n.return}throw Error(s(160))}switch(r.tag){case 5:var l=r.stateNode;r.flags&32&&(At(l,""),r.flags&=-33);var a=fc(e);vs(e,a,l);break;case 3:case 4:var i=r.stateNode.containerInfo,c=fc(e);xs(e,c,i);break;default:throw Error(s(161))}}catch(g){Be(e,e.return,g)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function Wf(e,t,n){Y=e,xc(e)}function xc(e,t,n){for(var r=(e.mode&1)!==0;Y!==null;){var l=Y,a=l.child;if(l.tag===22&&r){var i=l.memoizedState!==null||Sa;if(!i){var c=l.alternate,g=c!==null&&c.memoizedState!==null||nt;c=Sa;var w=nt;if(Sa=i,(nt=g)&&!w)for(Y=l;Y!==null;)i=Y,g=i.child,i.tag===22&&i.memoizedState!==null?_c(l):g!==null?(g.return=i,Y=g):_c(l);for(;a!==null;)Y=a,xc(a),a=a.sibling;Y=l,Sa=c,nt=w}vc(e)}else(l.subtreeFlags&8772)!==0&&a!==null?(a.return=l,Y=a):vc(e)}}function vc(e){for(;Y!==null;){var t=Y;if((t.flags&8772)!==0){var n=t.alternate;try{if((t.flags&8772)!==0)switch(t.tag){case 0:case 11:case 15:nt||Ea(5,t);break;case 1:var r=t.stateNode;if(t.flags&4&&!nt)if(n===null)r.componentDidMount();else{var l=t.elementType===t.type?n.memoizedProps:zt(t.type,n.memoizedProps);r.componentDidUpdate(l,n.memoizedState,r.__reactInternalSnapshotBeforeUpdate)}var a=t.updateQueue;a!==null&&yu(t,a,r);break;case 3:var i=t.updateQueue;if(i!==null){if(n=null,t.child!==null)switch(t.child.tag){case 5:n=t.child.stateNode;break;case 1:n=t.child.stateNode}yu(t,i,n)}break;case 5:var c=t.stateNode;if(n===null&&t.flags&4){n=c;var g=t.memoizedProps;switch(t.type){case"button":case"input":case"select":case"textarea":g.autoFocus&&n.focus();break;case"img":g.src&&(n.src=g.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(t.memoizedState===null){var w=t.alternate;if(w!==null){var L=w.memoizedState;if(L!==null){var R=L.dehydrated;R!==null&&nl(R)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(s(163))}nt||t.flags&512&&hs(t)}catch(z){Be(t,t.return,z)}}if(t===e){Y=null;break}if(n=t.sibling,n!==null){n.return=t.return,Y=n;break}Y=t.return}}function yc(e){for(;Y!==null;){var t=Y;if(t===e){Y=null;break}var n=t.sibling;if(n!==null){n.return=t.return,Y=n;break}Y=t.return}}function _c(e){for(;Y!==null;){var t=Y;try{switch(t.tag){case 0:case 11:case 15:var n=t.return;try{Ea(4,t)}catch(g){Be(t,n,g)}break;case 1:var r=t.stateNode;if(typeof r.componentDidMount=="function"){var l=t.return;try{r.componentDidMount()}catch(g){Be(t,l,g)}}var a=t.return;try{hs(t)}catch(g){Be(t,a,g)}break;case 5:var i=t.return;try{hs(t)}catch(g){Be(t,i,g)}}}catch(g){Be(t,t.return,g)}if(t===e){Y=null;break}var c=t.sibling;if(c!==null){c.return=t.return,Y=c;break}Y=t.return}}var Hf=Math.ceil,Ca=be.ReactCurrentDispatcher,ys=be.ReactCurrentOwner,St=be.ReactCurrentBatchConfig,ke=0,Je=null,We=null,Xe=0,ht=0,Fr=En(0),Ve=0,El=null,nr=0,Aa=0,_s=0,Cl=null,dt=null,ws=0,Br=1/0,pn=null,Na=!1,ks=null,jn=null,Ta=!1,Mn=null,Pa=0,Al=0,bs=null,ja=-1,Ma=0;function lt(){return(ke&6)!==0?Ie():ja!==-1?ja:ja=Ie()}function zn(e){return(e.mode&1)===0?1:(ke&2)!==0&&Xe!==0?Xe&-Xe:Af.transition!==null?(Ma===0&&(Ma=fi()),Ma):(e=Ce,e!==0||(e=window.event,e=e===void 0?16:ki(e.type)),e)}function Dt(e,t,n,r){if(50<Al)throw Al=0,bs=null,Error(s(185));qr(e,n,r),((ke&2)===0||e!==Je)&&(e===Je&&((ke&2)===0&&(Aa|=n),Ve===4&&Ln(e,Xe)),pt(e,r),n===1&&ke===0&&(t.mode&1)===0&&(Br=Ie()+500,oa&&An()))}function pt(e,t){var n=e.callbackNode;Cp(e,t);var r=Bl(e,e===Je?Xe:0);if(r===0)n!==null&&Fl(n),e.callbackNode=null,e.callbackPriority=0;else if(t=r&-r,e.callbackPriority!==t){if(n!=null&&Fl(n),t===1)e.tag===0?Cf(kc.bind(null,e)):su(kc.bind(null,e)),kf(function(){(ke&6)===0&&An()}),n=null;else{switch(gi(r)){case 1:n=_r;break;case 4:n=Jr;break;case 16:n=Qn;break;case 536870912:n=S;break;default:n=Qn}n=Pc(n,wc.bind(null,e))}e.callbackPriority=t,e.callbackNode=n}}function wc(e,t){if(ja=-1,Ma=0,(ke&6)!==0)throw Error(s(327));var n=e.callbackNode;if(Ur()&&e.callbackNode!==n)return null;var r=Bl(e,e===Je?Xe:0);if(r===0)return null;if((r&30)!==0||(r&e.expiredLanes)!==0||t)t=za(e,r);else{t=r;var l=ke;ke|=2;var a=Sc();(Je!==e||Xe!==t)&&(pn=null,Br=Ie()+500,lr(e,t));do try{Yf();break}catch(c){bc(e,c)}while(!0);Bo(),Ca.current=a,ke=l,We!==null?t=0:(Je=null,Xe=0,t=Ve)}if(t!==0){if(t===2&&(l=no(e),l!==0&&(r=l,t=Ss(e,l))),t===1)throw n=El,lr(e,0),Ln(e,r),pt(e,Ie()),n;if(t===6)Ln(e,r);else{if(l=e.current.alternate,(r&30)===0&&!Vf(l)&&(t=za(e,r),t===2&&(a=no(e),a!==0&&(r=a,t=Ss(e,a))),t===1))throw n=El,lr(e,0),Ln(e,r),pt(e,Ie()),n;switch(e.finishedWork=l,e.finishedLanes=r,t){case 0:case 1:throw Error(s(345));case 2:ar(e,dt,pn);break;case 3:if(Ln(e,r),(r&130023424)===r&&(t=ws+500-Ie(),10<t)){if(Bl(e,0)!==0)break;if(l=e.suspendedLanes,(l&r)!==r){lt(),e.pingedLanes|=e.suspendedLanes&l;break}e.timeoutHandle=Po(ar.bind(null,e,dt,pn),t);break}ar(e,dt,pn);break;case 4:if(Ln(e,r),(r&4194240)===r)break;for(t=e.eventTimes,l=-1;0<r;){var i=31-se(r);a=1<<i,i=t[i],i>l&&(l=i),r&=~a}if(r=l,r=Ie()-r,r=(120>r?120:480>r?480:1080>r?1080:1920>r?1920:3e3>r?3e3:4320>r?4320:1960*Hf(r/1960))-r,10<r){e.timeoutHandle=Po(ar.bind(null,e,dt,pn),r);break}ar(e,dt,pn);break;case 5:ar(e,dt,pn);break;default:throw Error(s(329))}}}return pt(e,Ie()),e.callbackNode===n?wc.bind(null,e):null}function Ss(e,t){var n=Cl;return e.current.memoizedState.isDehydrated&&(lr(e,t).flags|=256),e=za(e,t),e!==2&&(t=dt,dt=n,t!==null&&Es(t)),e}function Es(e){dt===null?dt=e:dt.push.apply(dt,e)}function Vf(e){for(var t=e;;){if(t.flags&16384){var n=t.updateQueue;if(n!==null&&(n=n.stores,n!==null))for(var r=0;r<n.length;r++){var l=n[r],a=l.getSnapshot;l=l.value;try{if(!jt(a(),l))return!1}catch{return!1}}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function Ln(e,t){for(t&=~_s,t&=~Aa,e.suspendedLanes|=t,e.pingedLanes&=~t,e=e.expirationTimes;0<t;){var n=31-se(t),r=1<<n;e[n]=-1,t&=~r}}function kc(e){if((ke&6)!==0)throw Error(s(327));Ur();var t=Bl(e,0);if((t&1)===0)return pt(e,Ie()),null;var n=za(e,t);if(e.tag!==0&&n===2){var r=no(e);r!==0&&(t=r,n=Ss(e,r))}if(n===1)throw n=El,lr(e,0),Ln(e,t),pt(e,Ie()),n;if(n===6)throw Error(s(345));return e.finishedWork=e.current.alternate,e.finishedLanes=t,ar(e,dt,pn),pt(e,Ie()),null}function Cs(e,t){var n=ke;ke|=1;try{return e(t)}finally{ke=n,ke===0&&(Br=Ie()+500,oa&&An())}}function rr(e){Mn!==null&&Mn.tag===0&&(ke&6)===0&&Ur();var t=ke;ke|=1;var n=St.transition,r=Ce;try{if(St.transition=null,Ce=1,e)return e()}finally{Ce=r,St.transition=n,ke=t,(ke&6)===0&&An()}}function As(){ht=Fr.current,De(Fr)}function lr(e,t){e.finishedWork=null,e.finishedLanes=0;var n=e.timeoutHandle;if(n!==-1&&(e.timeoutHandle=-1,wf(n)),We!==null)for(n=We.return;n!==null;){var r=n;switch(Do(r),r.tag){case 1:r=r.type.childContextTypes,r!=null&&la();break;case 3:$r(),De(it),De(Ze),Jo();break;case 5:Yo(r);break;case 4:$r();break;case 13:De(Oe);break;case 19:De(Oe);break;case 10:Uo(r.type._context);break;case 22:case 23:As()}n=n.return}if(Je=e,We=e=Rn(e.current,null),Xe=ht=t,Ve=0,El=null,_s=Aa=nr=0,dt=Cl=null,Zn!==null){for(t=0;t<Zn.length;t++)if(n=Zn[t],r=n.interleaved,r!==null){n.interleaved=null;var l=r.next,a=n.pending;if(a!==null){var i=a.next;a.next=l,r.next=i}n.pending=r}Zn=null}return e}function bc(e,t){do{var n=We;try{if(Bo(),ha.current=_a,xa){for(var r=Fe.memoizedState;r!==null;){var l=r.queue;l!==null&&(l.pending=null),r=r.next}xa=!1}if(tr=0,Qe=He=Fe=null,yl=!1,_l=0,ys.current=null,n===null||n.return===null){Ve=1,El=t,We=null;break}e:{var a=e,i=n.return,c=n,g=t;if(t=Xe,c.flags|=32768,g!==null&&typeof g=="object"&&typeof g.then=="function"){var w=g,L=c,R=L.tag;if((L.mode&1)===0&&(R===0||R===11||R===15)){var z=L.alternate;z?(L.updateQueue=z.updateQueue,L.memoizedState=z.memoizedState,L.lanes=z.lanes):(L.updateQueue=null,L.memoizedState=null)}var H=Qu(i);if(H!==null){H.flags&=-257,Ju(H,i,c,a,t),H.mode&1&&Yu(a,w,t),t=H,g=w;var Q=t.updateQueue;if(Q===null){var G=new Set;G.add(g),t.updateQueue=G}else Q.add(g);break e}else{if((t&1)===0){Yu(a,w,t),Ns();break e}g=Error(s(426))}}else if($e&&c.mode&1){var Ue=Qu(i);if(Ue!==null){(Ue.flags&65536)===0&&(Ue.flags|=256),Ju(Ue,i,c,a,t),Oo(Ir(g,c));break e}}a=g=Ir(g,c),Ve!==4&&(Ve=2),Cl===null?Cl=[a]:Cl.push(a),a=i;do{switch(a.tag){case 3:a.flags|=65536,t&=-t,a.lanes|=t;var y=Vu(a,g,t);vu(a,y);break e;case 1:c=g;var x=a.type,_=a.stateNode;if((a.flags&128)===0&&(typeof x.getDerivedStateFromError=="function"||_!==null&&typeof _.componentDidCatch=="function"&&(jn===null||!jn.has(_)))){a.flags|=65536,t&=-t,a.lanes|=t;var O=Ku(a,c,t);vu(a,O);break e}}a=a.return}while(a!==null)}Cc(n)}catch(q){t=q,We===n&&n!==null&&(We=n=n.return);continue}break}while(!0)}function Sc(){var e=Ca.current;return Ca.current=_a,e===null?_a:e}function Ns(){(Ve===0||Ve===3||Ve===2)&&(Ve=4),Je===null||(nr&268435455)===0&&(Aa&268435455)===0||Ln(Je,Xe)}function za(e,t){var n=ke;ke|=2;var r=Sc();(Je!==e||Xe!==t)&&(pn=null,lr(e,t));do try{Kf();break}catch(l){bc(e,l)}while(!0);if(Bo(),ke=n,Ca.current=r,We!==null)throw Error(s(261));return Je=null,Xe=0,Ve}function Kf(){for(;We!==null;)Ec(We)}function Yf(){for(;We!==null&&!yr();)Ec(We)}function Ec(e){var t=Tc(e.alternate,e,ht);e.memoizedProps=e.pendingProps,t===null?Cc(e):We=t,ys.current=null}function Cc(e){var t=e;do{var n=t.alternate;if(e=t.return,(t.flags&32768)===0){if(n=Of(n,t,ht),n!==null){We=n;return}}else{if(n=Ff(n,t),n!==null){n.flags&=32767,We=n;return}if(e!==null)e.flags|=32768,e.subtreeFlags=0,e.deletions=null;else{Ve=6,We=null;return}}if(t=t.sibling,t!==null){We=t;return}We=t=e}while(t!==null);Ve===0&&(Ve=5)}function ar(e,t,n){var r=Ce,l=St.transition;try{St.transition=null,Ce=1,Qf(e,t,n,r)}finally{St.transition=l,Ce=r}return null}function Qf(e,t,n,r){do Ur();while(Mn!==null);if((ke&6)!==0)throw Error(s(327));n=e.finishedWork;var l=e.finishedLanes;if(n===null)return null;if(e.finishedWork=null,e.finishedLanes=0,n===e.current)throw Error(s(177));e.callbackNode=null,e.callbackPriority=0;var a=n.lanes|n.childLanes;if(Ap(e,a),e===Je&&(We=Je=null,Xe=0),(n.subtreeFlags&2064)===0&&(n.flags&2064)===0||Ta||(Ta=!0,Pc(Qn,function(){return Ur(),null})),a=(n.flags&15990)!==0,(n.subtreeFlags&15990)!==0||a){a=St.transition,St.transition=null;var i=Ce;Ce=1;var c=ke;ke|=4,ys.current=null,Uf(e,n),hc(n,e),gf(No),Hl=!!Ao,No=Ao=null,e.current=n,Wf(n),eo(),ke=c,Ce=i,St.transition=a}else e.current=n;if(Ta&&(Ta=!1,Mn=e,Pa=l),a=e.pendingLanes,a===0&&(jn=null),ve(n.stateNode),pt(e,Ie()),t!==null)for(r=e.onRecoverableError,n=0;n<t.length;n++)l=t[n],r(l.value,{componentStack:l.stack,digest:l.digest});if(Na)throw Na=!1,e=ks,ks=null,e;return(Pa&1)!==0&&e.tag!==0&&Ur(),a=e.pendingLanes,(a&1)!==0?e===bs?Al++:(Al=0,bs=e):Al=0,An(),null}function Ur(){if(Mn!==null){var e=gi(Pa),t=St.transition,n=Ce;try{if(St.transition=null,Ce=16>e?16:e,Mn===null)var r=!1;else{if(e=Mn,Mn=null,Pa=0,(ke&6)!==0)throw Error(s(331));var l=ke;for(ke|=4,Y=e.current;Y!==null;){var a=Y,i=a.child;if((Y.flags&16)!==0){var c=a.deletions;if(c!==null){for(var g=0;g<c.length;g++){var w=c[g];for(Y=w;Y!==null;){var L=Y;switch(L.tag){case 0:case 11:case 15:Sl(8,L,a)}var R=L.child;if(R!==null)R.return=L,Y=R;else for(;Y!==null;){L=Y;var z=L.sibling,H=L.return;if(dc(L),L===w){Y=null;break}if(z!==null){z.return=H,Y=z;break}Y=H}}}var Q=a.alternate;if(Q!==null){var G=Q.child;if(G!==null){Q.child=null;do{var Ue=G.sibling;G.sibling=null,G=Ue}while(G!==null)}}Y=a}}if((a.subtreeFlags&2064)!==0&&i!==null)i.return=a,Y=i;else e:for(;Y!==null;){if(a=Y,(a.flags&2048)!==0)switch(a.tag){case 0:case 11:case 15:Sl(9,a,a.return)}var y=a.sibling;if(y!==null){y.return=a.return,Y=y;break e}Y=a.return}}var x=e.current;for(Y=x;Y!==null;){i=Y;var _=i.child;if((i.subtreeFlags&2064)!==0&&_!==null)_.return=i,Y=_;else e:for(i=x;Y!==null;){if(c=Y,(c.flags&2048)!==0)try{switch(c.tag){case 0:case 11:case 15:Ea(9,c)}}catch(q){Be(c,c.return,q)}if(c===i){Y=null;break e}var O=c.sibling;if(O!==null){O.return=c.return,Y=O;break e}Y=c.return}}if(ke=l,An(),V&&typeof V.onPostCommitFiberRoot=="function")try{V.onPostCommitFiberRoot(I,e)}catch{}r=!0}return r}finally{Ce=n,St.transition=t}}return!1}function Ac(e,t,n){t=Ir(n,t),t=Vu(e,t,1),e=Tn(e,t,1),t=lt(),e!==null&&(qr(e,1,t),pt(e,t))}function Be(e,t,n){if(e.tag===3)Ac(e,e,n);else for(;t!==null;){if(t.tag===3){Ac(t,e,n);break}else if(t.tag===1){var r=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof r.componentDidCatch=="function"&&(jn===null||!jn.has(r))){e=Ir(n,e),e=Ku(t,e,1),t=Tn(t,e,1),e=lt(),t!==null&&(qr(t,1,e),pt(t,e));break}}t=t.return}}function Jf(e,t,n){var r=e.pingCache;r!==null&&r.delete(t),t=lt(),e.pingedLanes|=e.suspendedLanes&n,Je===e&&(Xe&n)===n&&(Ve===4||Ve===3&&(Xe&130023424)===Xe&&500>Ie()-ws?lr(e,0):_s|=n),pt(e,t)}function Nc(e,t){t===0&&((e.mode&1)===0?t=1:(t=Bt,Bt<<=1,(Bt&130023424)===0&&(Bt=4194304)));var n=lt();e=un(e,t),e!==null&&(qr(e,t,n),pt(e,n))}function Gf(e){var t=e.memoizedState,n=0;t!==null&&(n=t.retryLane),Nc(e,n)}function qf(e,t){var n=0;switch(e.tag){case 13:var r=e.stateNode,l=e.memoizedState;l!==null&&(n=l.retryLane);break;case 19:r=e.stateNode;break;default:throw Error(s(314))}r!==null&&r.delete(t),Nc(e,n)}var Tc;Tc=function(e,t,n){if(e!==null)if(e.memoizedProps!==t.pendingProps||it.current)ct=!0;else{if((e.lanes&n)===0&&(t.flags&128)===0)return ct=!1,If(e,t,n);ct=(e.flags&131072)!==0}else ct=!1,$e&&(t.flags&1048576)!==0&&iu(t,ia,t.index);switch(t.lanes=0,t.tag){case 2:var r=t.type;ba(e,t),e=t.pendingProps;var l=Pr(t,Ze.current);Dr(t,n),l=Xo(null,t,r,e,l,n);var a=Zo();return t.flags|=1,typeof l=="object"&&l!==null&&typeof l.render=="function"&&l.$$typeof===void 0?(t.tag=1,t.memoizedState=null,t.updateQueue=null,ut(r)?(a=!0,aa(t)):a=!1,t.memoizedState=l.state!==null&&l.state!==void 0?l.state:null,Vo(t),l.updater=wa,t.stateNode=l,l._reactInternals=t,as(t,r,e,n),t=us(null,t,r,!0,a,n)):(t.tag=0,$e&&a&&Ro(t),rt(null,t,l,n),t=t.child),t;case 16:r=t.elementType;e:{switch(ba(e,t),e=t.pendingProps,l=r._init,r=l(r._payload),t.type=r,l=t.tag=Zf(r),e=zt(r,e),l){case 0:t=is(null,t,r,e,n);break e;case 1:t=tc(null,t,r,e,n);break e;case 11:t=Gu(null,t,r,e,n);break e;case 14:t=qu(null,t,r,zt(r.type,e),n);break e}throw Error(s(306,r,""))}return t;case 0:return r=t.type,l=t.pendingProps,l=t.elementType===r?l:zt(r,l),is(e,t,r,l,n);case 1:return r=t.type,l=t.pendingProps,l=t.elementType===r?l:zt(r,l),tc(e,t,r,l,n);case 3:e:{if(nc(t),e===null)throw Error(s(387));r=t.pendingProps,a=t.memoizedState,l=a.element,xu(e,t),ga(t,r,null,n);var i=t.memoizedState;if(r=i.element,a.isDehydrated)if(a={element:r,isDehydrated:!1,cache:i.cache,pendingSuspenseBoundaries:i.pendingSuspenseBoundaries,transitions:i.transitions},t.updateQueue.baseState=a,t.memoizedState=a,t.flags&256){l=Ir(Error(s(423)),t),t=rc(e,t,r,n,l);break e}else if(r!==l){l=Ir(Error(s(424)),t),t=rc(e,t,r,n,l);break e}else for(mt=Sn(t.stateNode.containerInfo.firstChild),gt=t,$e=!0,Mt=null,n=mu(t,null,r,n),t.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(zr(),r===l){t=dn(e,t,n);break e}rt(e,t,r,n)}t=t.child}return t;case 5:return _u(t),e===null&&Io(t),r=t.type,l=t.pendingProps,a=e!==null?e.memoizedProps:null,i=l.children,To(r,l)?i=null:a!==null&&To(r,a)&&(t.flags|=32),ec(e,t),rt(e,t,i,n),t.child;case 6:return e===null&&Io(t),null;case 13:return lc(e,t,n);case 4:return Ko(t,t.stateNode.containerInfo),r=t.pendingProps,e===null?t.child=Lr(t,null,r,n):rt(e,t,r,n),t.child;case 11:return r=t.type,l=t.pendingProps,l=t.elementType===r?l:zt(r,l),Gu(e,t,r,l,n);case 7:return rt(e,t,t.pendingProps,n),t.child;case 8:return rt(e,t,t.pendingProps.children,n),t.child;case 12:return rt(e,t,t.pendingProps.children,n),t.child;case 10:e:{if(r=t.type._context,l=t.pendingProps,a=t.memoizedProps,i=l.value,ze(da,r._currentValue),r._currentValue=i,a!==null)if(jt(a.value,i)){if(a.children===l.children&&!it.current){t=dn(e,t,n);break e}}else for(a=t.child,a!==null&&(a.return=t);a!==null;){var c=a.dependencies;if(c!==null){i=a.child;for(var g=c.firstContext;g!==null;){if(g.context===r){if(a.tag===1){g=cn(-1,n&-n),g.tag=2;var w=a.updateQueue;if(w!==null){w=w.shared;var L=w.pending;L===null?g.next=g:(g.next=L.next,L.next=g),w.pending=g}}a.lanes|=n,g=a.alternate,g!==null&&(g.lanes|=n),Wo(a.return,n,t),c.lanes|=n;break}g=g.next}}else if(a.tag===10)i=a.type===t.type?null:a.child;else if(a.tag===18){if(i=a.return,i===null)throw Error(s(341));i.lanes|=n,c=i.alternate,c!==null&&(c.lanes|=n),Wo(i,n,t),i=a.sibling}else i=a.child;if(i!==null)i.return=a;else for(i=a;i!==null;){if(i===t){i=null;break}if(a=i.sibling,a!==null){a.return=i.return,i=a;break}i=i.return}a=i}rt(e,t,l.children,n),t=t.child}return t;case 9:return l=t.type,r=t.pendingProps.children,Dr(t,n),l=kt(l),r=r(l),t.flags|=1,rt(e,t,r,n),t.child;case 14:return r=t.type,l=zt(r,t.pendingProps),l=zt(r.type,l),qu(e,t,r,l,n);case 15:return Xu(e,t,t.type,t.pendingProps,n);case 17:return r=t.type,l=t.pendingProps,l=t.elementType===r?l:zt(r,l),ba(e,t),t.tag=1,ut(r)?(e=!0,aa(t)):e=!1,Dr(t,n),Wu(t,r,l),as(t,r,l,n),us(null,t,r,!0,e,n);case 19:return oc(e,t,n);case 22:return Zu(e,t,n)}throw Error(s(156,t.tag))};function Pc(e,t){return Qr(e,t)}function Xf(e,t,n,r){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=r,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Et(e,t,n,r){return new Xf(e,t,n,r)}function Ts(e){return e=e.prototype,!(!e||!e.isReactComponent)}function Zf(e){if(typeof e=="function")return Ts(e)?1:0;if(e!=null){if(e=e.$$typeof,e===Ae)return 11;if(e===we)return 14}return 2}function Rn(e,t){var n=e.alternate;return n===null?(n=Et(e.tag,t,e.key,e.mode),n.elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=e.flags&14680064,n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n}function La(e,t,n,r,l,a){var i=2;if(r=e,typeof e=="function")Ts(e)&&(i=1);else if(typeof e=="string")i=5;else e:switch(e){case D:return or(n.children,l,a,t);case U:i=8,l|=8;break;case J:return e=Et(12,n,t,l|2),e.elementType=J,e.lanes=a,e;case Z:return e=Et(13,n,t,l),e.elementType=Z,e.lanes=a,e;case Ne:return e=Et(19,n,t,l),e.elementType=Ne,e.lanes=a,e;case fe:return Ra(n,l,a,t);default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case xe:i=10;break e;case Pe:i=9;break e;case Ae:i=11;break e;case we:i=14;break e;case je:i=16,r=null;break e}throw Error(s(130,e==null?e:typeof e,""))}return t=Et(i,n,t,l),t.elementType=e,t.type=r,t.lanes=a,t}function or(e,t,n,r){return e=Et(7,e,r,t),e.lanes=n,e}function Ra(e,t,n,r){return e=Et(22,e,r,t),e.elementType=fe,e.lanes=n,e.stateNode={isHidden:!1},e}function Ps(e,t,n){return e=Et(6,e,null,t),e.lanes=n,e}function js(e,t,n){return t=Et(4,e.children!==null?e.children:[],e.key,t),t.lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}function eg(e,t,n,r,l){this.tag=t,this.containerInfo=e,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=ro(0),this.expirationTimes=ro(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=ro(0),this.identifierPrefix=r,this.onRecoverableError=l,this.mutableSourceEagerHydrationData=null}function Ms(e,t,n,r,l,a,i,c,g){return e=new eg(e,t,n,c,g),t===1?(t=1,a===!0&&(t|=8)):t=0,a=Et(3,null,null,t),e.current=a,a.stateNode=e,a.memoizedState={element:r,isDehydrated:n,cache:null,transitions:null,pendingSuspenseBoundaries:null},Vo(a),e}function tg(e,t,n){var r=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:P,key:r==null?null:""+r,children:e,containerInfo:t,implementation:n}}function jc(e){if(!e)return Cn;e=e._reactInternals;e:{if(rn(e)!==e||e.tag!==1)throw Error(s(170));var t=e;do{switch(t.tag){case 3:t=t.stateNode.context;break e;case 1:if(ut(t.type)){t=t.stateNode.__reactInternalMemoizedMergedChildContext;break e}}t=t.return}while(t!==null);throw Error(s(171))}if(e.tag===1){var n=e.type;if(ut(n))return au(e,n,t)}return t}function Mc(e,t,n,r,l,a,i,c,g){return e=Ms(n,r,!0,e,l,a,i,c,g),e.context=jc(null),n=e.current,r=lt(),l=zn(n),a=cn(r,l),a.callback=t??null,Tn(n,a,l),e.current.lanes=l,qr(e,l,r),pt(e,r),e}function Da(e,t,n,r){var l=t.current,a=lt(),i=zn(l);return n=jc(n),t.context===null?t.context=n:t.pendingContext=n,t=cn(a,i),t.payload={element:e},r=r===void 0?null:r,r!==null&&(t.callback=r),e=Tn(l,t,i),e!==null&&(Dt(e,l,i,a),fa(e,l,i)),i}function $a(e){if(e=e.current,!e.child)return null;switch(e.child.tag){case 5:return e.child.stateNode;default:return e.child.stateNode}}function zc(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var n=e.retryLane;e.retryLane=n!==0&&n<t?n:t}}function zs(e,t){zc(e,t),(e=e.alternate)&&zc(e,t)}function ng(){return null}var Lc=typeof reportError=="function"?reportError:function(e){console.error(e)};function Ls(e){this._internalRoot=e}Ia.prototype.render=Ls.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(s(409));Da(e,t,null,null)},Ia.prototype.unmount=Ls.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;rr(function(){Da(null,e,null,null)}),t[ln]=null}};function Ia(e){this._internalRoot=e}Ia.prototype.unstable_scheduleHydration=function(e){if(e){var t=xi();e={blockedOn:null,target:e,priority:t};for(var n=0;n<wn.length&&t!==0&&t<wn[n].priority;n++);wn.splice(n,0,e),n===0&&_i(e)}};function Rs(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function Oa(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11&&(e.nodeType!==8||e.nodeValue!==" react-mount-point-unstable "))}function Rc(){}function rg(e,t,n,r,l){if(l){if(typeof r=="function"){var a=r;r=function(){var w=$a(i);a.call(w)}}var i=Mc(t,r,e,0,null,!1,!1,"",Rc);return e._reactRootContainer=i,e[ln]=i.current,dl(e.nodeType===8?e.parentNode:e),rr(),i}for(;l=e.lastChild;)e.removeChild(l);if(typeof r=="function"){var c=r;r=function(){var w=$a(g);c.call(w)}}var g=Ms(e,0,!1,null,null,!1,!1,"",Rc);return e._reactRootContainer=g,e[ln]=g.current,dl(e.nodeType===8?e.parentNode:e),rr(function(){Da(t,g,n,r)}),g}function Fa(e,t,n,r,l){var a=n._reactRootContainer;if(a){var i=a;if(typeof l=="function"){var c=l;l=function(){var g=$a(i);c.call(g)}}Da(t,i,e,l)}else i=rg(n,t,e,l,r);return $a(i)}mi=function(e){switch(e.tag){case 3:var t=e.stateNode;if(t.current.memoizedState.isDehydrated){var n=Gr(t.pendingLanes);n!==0&&(lo(t,n|1),pt(t,Ie()),(ke&6)===0&&(Br=Ie()+500,An()))}break;case 13:rr(function(){var r=un(e,1);if(r!==null){var l=lt();Dt(r,e,1,l)}}),zs(e,1)}},ao=function(e){if(e.tag===13){var t=un(e,134217728);if(t!==null){var n=lt();Dt(t,e,134217728,n)}zs(e,134217728)}},hi=function(e){if(e.tag===13){var t=zn(e),n=un(e,t);if(n!==null){var r=lt();Dt(n,e,t,r)}zs(e,t)}},xi=function(){return Ce},vi=function(e,t){var n=Ce;try{return Ce=e,t()}finally{Ce=n}},Wn=function(e,t,n){switch(t){case"input":if(Ct(e,n),t=n.name,n.type==="radio"&&t!=null){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+t)+'][type="radio"]'),t=0;t<n.length;t++){var r=n[t];if(r!==e&&r.form===e.form){var l=ra(r);if(!l)throw Error(s(90));vt(r),Ct(r,l)}}}break;case"textarea":Gt(e,n);break;case"select":t=n.value,t!=null&&Jt(e,!!n.multiple,t,!1)}},$l=Cs,Yr=rr;var lg={usingClientEntryPoint:!1,Events:[gl,Nr,ra,Hn,Vn,Cs]},Nl={findFiberByHostInstance:Jn,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},ag={bundleType:Nl.bundleType,version:Nl.version,rendererPackageName:Nl.rendererPackageName,rendererConfig:Nl.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:be.ReactCurrentDispatcher,findHostInstanceByFiber:function(e){return e=vr(e),e===null?null:e.stateNode},findFiberByHostInstance:Nl.findFiberByHostInstance||ng,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var Ba=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Ba.isDisabled&&Ba.supportsFiber)try{I=Ba.inject(ag),V=Ba}catch{}}return at.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=lg,at.createPortal=function(e,t){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!Rs(t))throw Error(s(200));return tg(e,t,null,n)},at.createRoot=function(e,t){if(!Rs(e))throw Error(s(299));var n=!1,r="",l=Lc;return t!=null&&(t.unstable_strictMode===!0&&(n=!0),t.identifierPrefix!==void 0&&(r=t.identifierPrefix),t.onRecoverableError!==void 0&&(l=t.onRecoverableError)),t=Ms(e,1,!1,null,null,n,!1,r,l),e[ln]=t.current,dl(e.nodeType===8?e.parentNode:e),new Ls(t)},at.findDOMNode=function(e){if(e==null)return null;if(e.nodeType===1)return e;var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(s(188)):(e=Object.keys(e).join(","),Error(s(268,e)));return e=vr(t),e=e===null?null:e.stateNode,e},at.flushSync=function(e){return rr(e)},at.hydrate=function(e,t,n){if(!Oa(t))throw Error(s(200));return Fa(null,e,t,!0,n)},at.hydrateRoot=function(e,t,n){if(!Rs(e))throw Error(s(405));var r=n!=null&&n.hydratedSources||null,l=!1,a="",i=Lc;if(n!=null&&(n.unstable_strictMode===!0&&(l=!0),n.identifierPrefix!==void 0&&(a=n.identifierPrefix),n.onRecoverableError!==void 0&&(i=n.onRecoverableError)),t=Mc(t,null,e,1,n??null,l,!1,a,i),e[ln]=t.current,dl(e),r)for(e=0;e<r.length;e++)n=r[e],l=n._getVersion,l=l(n._source),t.mutableSourceEagerHydrationData==null?t.mutableSourceEagerHydrationData=[n,l]:t.mutableSourceEagerHydrationData.push(n,l);return new Ia(t)},at.render=function(e,t,n){if(!Oa(t))throw Error(s(200));return Fa(null,e,t,!1,n)},at.unmountComponentAtNode=function(e){if(!Oa(e))throw Error(s(40));return e._reactRootContainer?(rr(function(){Fa(null,null,e,!1,function(){e._reactRootContainer=null,e[ln]=null})}),!0):!1},at.unstable_batchedUpdates=Cs,at.unstable_renderSubtreeIntoContainer=function(e,t,n,r){if(!Oa(n))throw Error(s(200));if(e==null||e._reactInternals===void 0)throw Error(s(38));return Fa(e,t,n,!1,r)},at.version="18.3.1-next-f1338f8080-20240426",at}var Ws;function Uc(){if(Ws)return Ha.exports;Ws=1;function o(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(o)}catch(u){console.error(u)}}return o(),Ha.exports=Bc(),Ha.exports}var Hs;function Wc(){if(Hs)return Tl;Hs=1;var o=Uc();return Tl.createRoot=o.createRoot,Tl.hydrateRoot=o.hydrateRoot,Tl}var Hc=Wc();function Vc(){if(typeof window>"u")return!1;const o=window;return!!(o.SpeechRecognition||o.webkitSpeechRecognition)}function Kc(){if(typeof window>"u")return null;const o=window;return o.SpeechRecognition??o.webkitSpeechRecognition??null}function Yc(o){const u=Kc();if(!u)return o.onError("Voice input is not supported in this browser."),null;let s=new u;s.continuous=!0,s.interimResults=!0;try{s.lang=navigator.language||"en-US"}catch{s.lang="en-US"}let p=!1,v="";s.onresult=h=>{var b;let T="",E="";for(let N=h.resultIndex;N<h.results.length;N++){const j=h.results[N],A=((b=j[0])==null?void 0:b.transcript)??"";j.isFinal?E+=A:T+=A}E&&(v=(v+" "+E).trim()),o.onPartial((v+" "+T).trim())},s.onerror=h=>{const T=h.error??"unknown";p||(T==="no-speech"?o.onError("Voice: silence detected. Hold the mic and speak."):T==="not-allowed"||T==="service-not-allowed"?o.onError("Voice: microphone permission denied."):T==="aborted"||o.onError(`Voice error: ${T}`))},s.onend=()=>{p||v&&o.onCommit(v)};try{s.start()}catch(h){return o.onError(h instanceof Error?h.message:"Voice failed to start."),null}return{stop:()=>{try{s==null||s.stop()}catch{}},abort:()=>{p=!0;try{s==null||s.abort()}catch{}s=null}}}function Ya(){return typeof navigator>"u"||!navigator.mediaDevices?!1:typeof navigator.mediaDevices.getUserMedia=="function"&&typeof MediaRecorder<"u"}function Qc(o,u,s={}){return(async()=>{if(!Ya())return u.onError("Voice: this runtime does not expose MediaRecorder."),null;let p;try{p=await navigator.mediaDevices.getUserMedia({audio:!0})}catch(b){const N=b instanceof Error?b.message:"microphone unavailable";return u.onError(`Voice: microphone permission denied or device missing (${N}).`),null}let v=s.preferredMime??"audio/webm;codecs=opus";typeof MediaRecorder.isTypeSupported=="function"&&!MediaRecorder.isTypeSupported(v)&&(v=["audio/webm","audio/ogg;codecs=opus","audio/mp4"].find(j=>MediaRecorder.isTypeSupported(j))??"");const h=v?new MediaRecorder(p,{mimeType:v}):new MediaRecorder(p),T=[];let E=!1;h.addEventListener("dataavailable",b=>{b.data&&b.data.size>0&&T.push(b.data)}),h.addEventListener("stop",()=>{if(p.getTracks().forEach(N=>N.stop()),E||T.length===0)return;const b=new Blob(T,{type:v||"audio/webm"});b.arrayBuffer().then(N=>{const j=Jc(N);return u.onPartial("a transcrever…"),o.transcribeAudio(j,b.type||"audio/webm",s.language)}).then(N=>{if(E)return;const j=((N==null?void 0:N.text)??"").trim();j?u.onCommit(j):u.onError("Voice: silence detected — nada para transcrever.")}).catch(N=>{if(E)return;const j=N instanceof Error?N.message:String(N);u.onError(`Voice: ${j}`)})});try{h.start()}catch(b){return p.getTracks().forEach(N=>N.stop()),u.onError(b instanceof Error?b.message:"recorder failed to start"),null}return{stop:()=>{if(h.state==="recording")try{h.stop()}catch{}},abort:()=>{if(E=!0,h.state==="recording")try{h.stop()}catch{}p.getTracks().forEach(b=>b.stop())}}})()}function Jc(o){const u=new Uint8Array(o);let s="";const p=32768;for(let v=0;v<u.length;v+=p){const h=u.subarray(v,Math.min(v+p,u.length));s+=String.fromCharCode.apply(null,Array.from(h))}return btoa(s)}function Gc(o){const u=[],s=o.split(`
`);let p=0,v=[];function h(){v.length!==0&&(u.push({kind:"prose",body:v.join(`
`)}),v=[])}for(;p<s.length;){const T=s[p],E=T.match(/^```(\w[\w+-]*)?\s*$/);if(E){h();const b=E[1]||null;p++;const N=p;for(;p<s.length&&!s[p].match(/^```\s*$/);)p++;const j=s.slice(N,p).join(`
`);u.push({kind:"code",lang:b,body:j}),p++;continue}v.push(T),p++}return h(),u}const qc=[[/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/,(o,u)=>d.jsx("a",{href:o[2],target:"_blank",rel:"noopener noreferrer",className:"gauntlet-md__link",children:o[1]},`a-${u}`)],[/`([^`]+)`/,(o,u)=>d.jsx("code",{className:"gauntlet-md__inline-code",children:o[1]},`c-${u}`)],[/\*\*([^*]+)\*\*/,(o,u)=>d.jsx("strong",{className:"gauntlet-md__strong",children:o[1]},`b-${u}`)],[/\*([^*]+)\*/,(o,u)=>d.jsx("em",{className:"gauntlet-md__em",children:o[1]},`i-${u}`)],[/_([^_]+)_/,(o,u)=>d.jsx("em",{className:"gauntlet-md__em",children:o[1]},`u-${u}`)]];function Hr(o,u){const s=[];let p=0,v=0;for(;p<o.length;){let h=null;for(const[T,E]of qc){const N=o.slice(p).match(T);!N||N.index===void 0||(h===null||N.index<h.idx)&&(h={idx:N.index,match:N,render:E})}if(h===null){s.push(o.slice(p));break}h.idx>0&&s.push(o.slice(p,p+h.idx)),s.push(h.render(h.match,u*100+v)),v++,p+=h.idx+h.match[0].length}return s}function Xc(o,u){const s=[],p=o.split(`
`);let v=0,h=u;for(;v<p.length;){const E=p[v].trim();if(!E){v++;continue}const b=E.match(/^(#{1,3})\s+(.*)$/);if(b){const j=b[1].length,W=`h${j}`;s.push(d.jsx(W,{className:`gauntlet-md__h gauntlet-md__h${j}`,children:Hr(b[2],h++)},`h-${h++}`)),v++;continue}if(/^---+$/.test(E)||/^\*\*\*+$/.test(E)){s.push(d.jsx("hr",{className:"gauntlet-md__hr"},`hr-${h++}`)),v++;continue}if(E.startsWith(">")){const j=[];for(;v<p.length&&p[v].trim().startsWith(">");)j.push(p[v].replace(/^\s*>\s?/,"")),v++;s.push(d.jsx("blockquote",{className:"gauntlet-md__quote",children:Hr(j.join(" "),h++)},`q-${h++}`));continue}if(/^[-*]\s+/.test(E)){const j=[];for(;v<p.length&&/^[-*]\s+/.test(p[v].trim());)j.push(p[v].trim().replace(/^[-*]\s+/,"")),v++;s.push(d.jsx("ul",{className:"gauntlet-md__list",children:j.map((A,W)=>d.jsx("li",{className:"gauntlet-md__li",children:Hr(A,h++)},W))},`ul-${h++}`));continue}if(/^\d+\.\s+/.test(E)){const j=[];for(;v<p.length&&/^\d+\.\s+/.test(p[v].trim());)j.push(p[v].trim().replace(/^\d+\.\s+/,"")),v++;s.push(d.jsx("ol",{className:"gauntlet-md__list",children:j.map((A,W)=>d.jsx("li",{className:"gauntlet-md__li",children:Hr(A,h++)},W))},`ol-${h++}`));continue}const N=[];for(;v<p.length;){const j=p[v],A=j.trim();if(!A||/^(#{1,3})\s+/.test(A)||/^---+$/.test(A)||/^\*\*\*+$/.test(A)||A.startsWith(">")||/^[-*]\s+/.test(A)||/^\d+\.\s+/.test(A))break;N.push(j),v++}s.push(d.jsx("p",{className:"gauntlet-md__p",children:Hr(N.join(" "),h++)},`p-${h++}`))}return s}function Zc({source:o,onCopyBlock:u}){const s=Gc(o);return d.jsx("div",{className:"gauntlet-md",children:s.map((p,v)=>p.kind==="code"?d.jsx(ud,{lang:p.lang,body:p.body,onCopy:u},`cb-${v}`):d.jsx("div",{className:"gauntlet-md__prose",children:Xc(p.body,v*1e3)},`pb-${v}`))})}const ed=new Set(["def","class","if","elif","else","for","while","return","import","from","as","with","try","except","finally","raise","pass","break","continue","in","is","not","and","or","lambda","yield","async","await","global","nonlocal","True","False","None","self","cls","print"]),td=new Set(["function","const","let","var","if","else","return","class","export","import","from","as","default","async","await","for","while","try","catch","finally","throw","new","this","super","extends","implements","interface","type","enum","public","private","protected","readonly","static","typeof","instanceof","in","of","null","undefined","true","false","void","switch","case","break","continue","do","yield"]),nd=new Set(["cd","ls","cat","rm","mv","cp","mkdir","touch","grep","sed","awk","export","source","if","then","else","elif","fi","for","while","do","done","case","esac","exit","npm","npx","git","python","node","tsc","make","vite","wxt","set","get","start-process","select-string"]);function Vs(o,u){if(o[u]!=="#")return-1;const s=o.indexOf(`
`,u);return s===-1?o.length:s}function rd(o,u){if(o[u]!=="/")return-1;if(o[u+1]==="/"){const s=o.indexOf(`
`,u);return s===-1?o.length:s}if(o[u+1]==="*"){const s=o.indexOf("*/",u+2);return s===-1?o.length:s+2}return-1}const Ks={keywords:ed,matchComment:Vs},ld={keywords:td,matchComment:rd},ad={keywords:nd,matchComment:Vs};function od(o){if(!o)return null;const u=o.toLowerCase();return u==="py"||u==="python"||u==="python3"||u==="ipython"||u==="pycon"?Ks:u==="ts"||u==="tsx"||u==="typescript"||u==="js"||u==="jsx"||u==="javascript"||u==="mjs"||u==="json"||u==="json5"?ld:u==="sh"||u==="bash"||u==="zsh"||u==="shell"||u==="powershell"||u==="ps"||u==="ps1"||u==="console"?ad:null}function Ys(o){return o>="a"&&o<="z"||o>="A"&&o<="Z"||o==="_"||o==="$"}function sd(o){return Ys(o)||o>="0"&&o<="9"}function Qa(o){return o>="0"&&o<="9"}function id(o,u){const s=[];let p="";function v(){p&&(s.push({kind:"p",text:p}),p="")}let h=0;for(;h<o.length;){const T=o[h],E=u.matchComment(o,h);if(E!==-1){v(),s.push({kind:"c",text:o.slice(h,E)}),h=E;continue}if(u===Ks&&(o.startsWith('"""',h)||o.startsWith("'''",h))){v();const b=o.slice(h,h+3);let N=o.indexOf(b,h+3);N=N===-1?o.length:N+3,s.push({kind:"s",text:o.slice(h,N)}),h=N;continue}if(T==='"'||T==="'"||T==="`"){v();let b=h+1;for(;b<o.length&&o[b]!==T;){if(o[b]==="\\"){b+=2;continue}if(o[b]===`
`&&T!=="`")break;b++}const N=b<o.length?b+1:b;s.push({kind:"s",text:o.slice(h,N)}),h=N;continue}if(Qa(T)){v();let b=h;for(;b<o.length&&(Qa(o[b])||o[b]==="."||o[b]==="_");)b++;if(b<o.length&&(o[b]==="e"||o[b]==="E"))for(b++,b<o.length&&(o[b]==="+"||o[b]==="-")&&b++;b<o.length&&Qa(o[b]);)b++;s.push({kind:"n",text:o.slice(h,b)}),h=b;continue}if(Ys(T)){v();let b=h+1;for(;b<o.length&&sd(o[b]);)b++;const N=o.slice(h,b);let j=b;for(;j<o.length&&o[j]===" ";)j++;const A=o[j]==="(";let W="p";u.keywords.has(N)?W="k":A&&(W="f"),s.push({kind:W,text:N}),h=b;continue}p+=T,h++}return v(),s}function ud({lang:o,body:u,onCopy:s}){const p=()=>{navigator.clipboard.writeText(u).catch(()=>{}),s==null||s(u)},v=od(o),h=v?id(u,v):null;return d.jsxs("figure",{className:"gauntlet-md__code",children:[d.jsxs("header",{className:"gauntlet-md__code-meta",children:[d.jsx("span",{className:"gauntlet-md__code-lang",children:o??"code"}),d.jsx("button",{type:"button",className:"gauntlet-md__code-copy",onClick:p,"aria-label":"copy code",children:"copy"})]}),d.jsx("pre",{className:"gauntlet-md__code-body",children:h?d.jsx("code",{children:h.map((T,E)=>d.jsx("span",{className:`gauntlet-md__tok gauntlet-md__tok--${T.kind}`,children:T.text},E))}):d.jsx("code",{children:u})})]})}const cd={domains:{},actions:{},default_domain_policy:{allowed:!0,require_danger_ack:!1},default_action_policy:{allowed:!0,require_danger_ack:!1},tool_policies:{},max_page_text_chars:6e3,max_dom_skeleton_chars:4e3,screenshot_default:!1,execution_reporting_required:!1,updated_at:""},dd="2px solid #d07a5a",pd="2px",fd="#gauntlet-capsule-host",gd=[/\bpassword\b/i,/\bdelete\b/i,/\bdestroy\b/i,/\bremove\b/i,/\bunsubscribe\b/i,/payment|checkout|billing/i,/credit[-_ ]?card|\bccnum\b|\bcvv\b|\bcvc\b/i],md=["delete","remove","destroy","drop","discard","apagar","eliminar","remover","destruir","pay","buy","purchase","order","checkout","pagar","comprar","encomendar","confirm","submit","send","publish","enviar","confirmar","publicar","transfer","withdraw","transferir","levantar","cancel subscription","cancelar subscrição","cancelar assinatura"],hd=5e3;function xd(o){const u=o.filter(h=>h.type==="fill"),s=o.filter(h=>h.type==="click");if(u.length===0||s.length===0)return{danger:!1};const p=u.find(h=>{const T=h.selector.toLowerCase();return!!(/\bpassword\b/.test(T)||/\bcvv\b|\bcvc\b|\bccnum\b|credit[-_ ]?card/.test(T)||/payment|checkout|billing/.test(T)||/cc-(number|exp|csc|name)/.test(T))});if(!p)return{danger:!1};const v=s.find(h=>{const T=h.selector.toLowerCase();return!!(T.includes("submit")||/\b(pay|buy|purchase|confirm|send|order|checkout|pagar|comprar|enviar|confirmar)\b/.test(T))});return v?{danger:!0,reason:`cadeia destrutiva: fill em "${p.selector}" seguido de click em "${v.selector}"`}:{danger:!1}}function vd(o){var p;if(o.type==="highlight"||o.type==="scroll_to")return{danger:!1};if(o.type==="fs.read")return{danger:!1};if(o.type==="shell.run")return{danger:!0,reason:`executa "${o.cmd}" no sistema local — cabe à allowlist e ao gate GAUNTLET_ALLOW_CODE_EXEC`};if(o.type==="fs.write")return{danger:!0,reason:`grava em ${o.path} — sobrescreve o conteúdo existente`};const u=o.selector;for(const v of gd)if(v.test(u))return{danger:!0,reason:`selector matches /${v.source}/`};let s=null;try{s=document.querySelector(u)}catch{}if(o.type==="fill")return s instanceof HTMLInputElement&&s.type==="password"?{danger:!0,reason:"password field"}:s instanceof HTMLInputElement&&(((p=s.autocomplete)==null?void 0:p.includes("cc-"))??!1)?{danger:!0,reason:"credit-card autocomplete"}:o.value.length>hd?{danger:!0,reason:"unusually long value"}:{danger:!1};if(o.type==="click"){if(s instanceof HTMLButtonElement&&s.type==="submit")return{danger:!0,reason:"submit button"};if(s instanceof HTMLInputElement&&(s.type==="submit"||s.type==="reset"))return{danger:!0,reason:`${s.type} button`};if(s instanceof HTMLElement){const v=(s.innerText??"").trim().toLowerCase();if(v){for(const h of md)if(v===h||v.startsWith(h+" ")||v.endsWith(" "+h)||v.includes(" "+h+" "))return{danger:!0,reason:`action label: "${h}"`}}}return{danger:!1}}return{danger:!1}}function yd(o){const u=o.type;return u==="fill"||u==="click"||u==="highlight"||u==="scroll_to"}async function _d(o){const u=[];for(const s of o){if(!yd(s)){u.push({action:s,ok:!1,error:`executor: ${s.type} is an ambient action — route through the Capsule dispatcher`});continue}try{wd(s),await kd(s),u.push({action:s,ok:!0})}catch(p){u.push({action:s,ok:!1,error:p instanceof Error?p.message:String(p)})}}return u}function wd(o){const u=o.selector;if(!u||typeof u!="string")throw new Error("selector missing or not a string");if(u.includes(fd))throw new Error(`selector targets the Gauntlet capsule itself: ${u}`);try{document.querySelector(u)}catch{throw new Error(`selector is not valid CSS: ${u}`)}}async function kd(o){if(o.type==="fill"){bd(o.selector,o.value);return}if(o.type==="click"){Sd(o.selector);return}if(o.type==="highlight"){Ed(o.selector,o.duration_ms??1500);return}if(o.type==="scroll_to"){Cd(o.selector);return}throw new Error(`unknown action type: ${o.type??"<missing>"}`)}function bd(o,u){var p,v;const s=document.querySelector(o);if(!s)throw new Error(`selector not found: ${o}`);if(s instanceof HTMLInputElement||s instanceof HTMLTextAreaElement){s.focus({preventScroll:!0});const h=s instanceof HTMLInputElement?HTMLInputElement.prototype:HTMLTextAreaElement.prototype,T=(p=Object.getOwnPropertyDescriptor(h,"value"))==null?void 0:p.set;T?T.call(s,u):s.value=u,s.dispatchEvent(new Event("input",{bubbles:!0})),s.dispatchEvent(new Event("change",{bubbles:!0})),s.dispatchEvent(new Event("blur",{bubbles:!0}));return}if(s instanceof HTMLSelectElement){s.focus({preventScroll:!0});const h=(v=Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,"value"))==null?void 0:v.set;h?h.call(s,u):s.value=u,s.dispatchEvent(new Event("input",{bubbles:!0})),s.dispatchEvent(new Event("change",{bubbles:!0})),s.dispatchEvent(new Event("blur",{bubbles:!0}));return}if(s instanceof HTMLElement&&s.isContentEditable){s.focus(),s.textContent=u,s.dispatchEvent(new InputEvent("input",{bubbles:!0}));return}throw new Error(`element at ${o} is not fillable`)}function Sd(o){const u=document.querySelector(o);if(!u)throw new Error(`selector not found: ${o}`);if(!(u instanceof HTMLElement))throw new Error(`element at ${o} is not clickable`);const s=u.getBoundingClientRect(),p=s.left+s.width/2,v=s.top+s.height/2,h={bubbles:!0,cancelable:!0,view:window,clientX:p,clientY:v,button:0,buttons:1},T={...h,pointerId:1,pointerType:"mouse",isPrimary:!0};u.dispatchEvent(new PointerEvent("pointerdown",T)),u.dispatchEvent(new MouseEvent("mousedown",h)),u.focus({preventScroll:!0}),u.dispatchEvent(new PointerEvent("pointerup",T)),u.dispatchEvent(new MouseEvent("mouseup",h)),u.click()}function Ed(o,u){const s=document.querySelectorAll(o);if(s.length===0)throw new Error(`selector not found: ${o}`);for(const p of Array.from(s)){if(!(p instanceof HTMLElement))continue;const v=p.style.outline,h=p.style.outlineOffset;p.style.outline=dd,p.style.outlineOffset=pd,window.setTimeout(()=>{p.style.outline=v,p.style.outlineOffset=h},u)}}function Cd(o){const u=document.querySelector(o);if(!u)throw new Error(`selector not found: ${o}`);if(!(u instanceof HTMLElement))throw new Error(`element at ${o} cannot be scrolled to`);u.scrollIntoView({behavior:"smooth",block:"center"})}const Ja={},Ad=((typeof{url:Kt&&Kt.tagName.toUpperCase()==="SCRIPT"&&Kt.src||new URL("content-scripts/content.js",document.baseURI).href}<"u"?Ja==null?void 0:Ja.VITE_BACKEND_URL:void 0)??"https://ruberra-backend-jkpf-production.up.railway.app").replace(/\/+$/,"");class Nd{constructor(u,s={}){this.ambient=u,this.backendUrl=(s.backendUrl??Ad).replace(/\/+$/,"")}captureContext(u,s){return this.ambient.transport.fetchJson("POST",`${this.backendUrl}/composer/context`,u,s)}detectIntent(u,s,p){return this.ambient.transport.fetchJson("POST",`${this.backendUrl}/composer/intent`,{context_id:u,user_input:s},p)}generatePreview(u,s){return this.ambient.transport.fetchJson("POST",`${this.backendUrl}/composer/preview`,{intent_id:u},s)}applyPreview(u,s,p,v){return this.ambient.transport.fetchJson("POST",`${this.backendUrl}/composer/apply`,{preview_id:u,approved:s,approval_reason:p??null},v)}async getToolManifests(u){return(await this.ambient.transport.fetchJson("GET",`${this.backendUrl}/tools/manifests`,void 0,u)).tools??[]}getSettings(u){return this.ambient.transport.fetchJson("GET",`${this.backendUrl}/composer/settings`,void 0,u)}updateSettings(u,s){return this.ambient.transport.fetchJson("PUT",`${this.backendUrl}/composer/settings`,u,s)}reportExecution(u,s){return this.ambient.transport.fetchJson("POST",`${this.backendUrl}/composer/execution`,u,s)}transcribeAudio(u,s,p,v){return this.ambient.transport.fetchJson("POST",`${this.backendUrl}/voice/transcribe`,{audio_base64:u,mime:s,language:p},v)}synthesizeSpeech(u,s,p){return this.ambient.transport.fetchJson("POST",`${this.backendUrl}/voice/synthesize`,{text:u,voice:s},p)}requestDomPlan(u,s,p){return this.ambient.transport.fetchJson("POST",`${this.backendUrl}/composer/dom_plan`,{context_id:u,user_input:s},p)}requestDomPlanStream(u,s,p){return this.ambient.transport.stream?this.ambient.transport.stream(`${this.backendUrl}/composer/dom_plan_stream`,{context_id:u,user_input:s},p):(p.onError("streaming not supported by this ambient"),()=>{})}}const Qs="gauntlet:pill_position",Ga="gauntlet:dismissed_domains",Js="gauntlet:screenshot_enabled",Gs="gauntlet:theme",qs="gauntlet:palette_recent",Xs="gauntlet:pill_mode",Zs="gauntlet:tts_enabled",ei=8,ti="light",ni="corner",ri={bottom:16,right:16};function li(o){const u=typeof window<"u"?window.innerWidth:1280,s=typeof window<"u"?window.innerHeight:800,p=4,v=u-p,h=s-p;return{right:Math.max(-14,Math.min(v,o.right)),bottom:Math.max(-14,Math.min(h,o.bottom))}}function ai(o){return{async readPillPosition(){const u=await o.get(Qs);return u&&typeof u=="object"&&typeof u.bottom=="number"&&typeof u.right=="number"?li(u):ri},async writePillPosition(u){await o.set(Qs,li(u))},async readDismissedDomains(){const u=await o.get(Ga);return Array.isArray(u)?u.filter(s=>typeof s=="string"):[]},async dismissDomain(u){if(!u)return;const s=await this.readDismissedDomains();s.includes(u)||await o.set(Ga,[...s,u])},async restoreDomain(u){if(!u)return;const s=await this.readDismissedDomains(),p=s.filter(v=>v!==u);p.length!==s.length&&await o.set(Ga,p)},async isDomainDismissed(u){return u?(await this.readDismissedDomains()).includes(u):!1},async readScreenshotEnabled(){return await o.get(Js)===!0},async writeScreenshotEnabled(u){await o.set(Js,!!u)},async readTheme(){const u=await o.get(Gs);return u==="dark"||u==="light"?u:ti},async writeTheme(u){await o.set(Gs,u)},async readPaletteRecent(){const u=await o.get(qs);return Array.isArray(u)?u.filter(s=>typeof s=="string").slice(0,ei):[]},async notePaletteUse(u){if(!u)return;const s=await this.readPaletteRecent(),p=[u,...s.filter(v=>v!==u)].slice(0,ei);await o.set(qs,p)},async readPillMode(){const u=await o.get(Xs);return u==="cursor"||u==="corner"?u:ni},async writePillMode(u){await o.set(Xs,u)},async readTtsEnabled(){return await o.get(Zs)===!0},async writeTtsEnabled(u){await o.set(Zs,!!u)}}}function Td({ambient:o,initialSnapshot:u,onDismiss:s,cursorAnchor:p}){var _r,Jr,Qn;const v=k.useMemo(()=>new Nd(o),[o]),h=k.useMemo(()=>ai(o.storage),[o]),T=(_r=o.domActions)==null?void 0:_r.execute,[E,b]=k.useState(u),[N,j]=k.useState(""),[A,W]=k.useState("idle"),[ce,le]=k.useState(null),[re,ue]=k.useState(!1),[M,Ee]=k.useState(null),[Te,be]=k.useState(null),[B,P]=k.useState(!1),[D,U]=k.useState(""),[J,xe]=k.useState(!1),[Pe,Ae]=k.useState(ti),[Z,Ne]=k.useState([]),[we,je]=k.useState([]),[fe,F]=k.useState(0),[X,$]=k.useState(!1),f=k.useRef(!1),C=k.useRef(null),[ne,ae]=k.useState(!1),de=k.useRef(""),[pe,oe]=k.useState(null),he=k.useCallback(async m=>{var ve,se;const S=[];let I=[];const V=async()=>{var K;if(I.length===0)return;if(!((K=o.domActions)!=null&&K.execute)){for(const _e of I)S.push({action:_e,ok:!1,error:"shell does not support DOM actions"});I=[];return}const ye=await o.domActions.execute(I);S.push(...ye),I=[]};for(const ye of m)if(ye.type==="shell.run"){if(await V(),!o.shellExec){S.push({action:ye,ok:!1,error:"shell.run requires a desktop ambient with shellExec"});continue}try{const K=await o.shellExec.run(ye.cmd,ye.args,ye.cwd);S.push({action:ye,ok:K.exitCode===0,error:K.exitCode===0?void 0:K.stderr||`exit ${K.exitCode}`,output:{stdout:K.stdout,stderr:K.stderr,exitCode:K.exitCode,durationMs:K.durationMs}})}catch(K){S.push({action:ye,ok:!1,error:K instanceof Error?K.message:String(K)})}}else if(ye.type==="fs.read"){if(await V(),!((ve=o.filesystem)!=null&&ve.readTextFile)){S.push({action:ye,ok:!1,error:"fs.read requires a desktop ambient with filesystem"});continue}try{const K=await o.filesystem.readTextFile(ye.path);S.push({action:ye,ok:!0,output:{text:K,bytes:new TextEncoder().encode(K).length}})}catch(K){S.push({action:ye,ok:!1,error:K instanceof Error?K.message:String(K)})}}else if(ye.type==="fs.write"){if(await V(),!((se=o.filesystem)!=null&&se.writeTextFile)){S.push({action:ye,ok:!1,error:"fs.write requires a desktop ambient with filesystem"});continue}try{const K=await o.filesystem.writeTextFile(ye.path,ye.content);S.push({action:ye,ok:!0,output:{bytes:K}})}catch(K){S.push({action:ye,ok:!1,error:K instanceof Error?K.message:String(K)})}}else I.push(ye);return await V(),S},[o]),[ge,Me]=k.useState([]),[$t,vt]=k.useState(null),[Ke,It]=k.useState(cd),Ot=k.useRef(null),ir=k.useRef(null),Ct=k.useRef(null),Qt=k.useRef(""),mn=k.useRef(!1),[$n,Jt]=k.useState(0),ot=k.useRef(null),[In,Gt]=k.useState(!1),[ur,Ye]=k.useState(!1),[On,Fn]=k.useState(null),[Bn,At]=k.useState(0),Nt=k.useMemo(()=>M?M.actions.map(vd):[],[M]),Dl=k.useMemo(()=>!M||M.actions.length===0?!1:M.actions.some(m=>{var S,I,V;return m.type==="shell.run"?!!o.shellExec:m.type==="fs.read"?!!((S=o.filesystem)!=null&&S.readTextFile):m.type==="fs.write"?!!((I=o.filesystem)!=null&&I.writeTextFile):!!((V=o.domActions)!=null&&V.execute)}),[M,o]),qt=k.useMemo(()=>M?xd(M.actions):{danger:!1},[M]),Un=k.useMemo(()=>{if(!M||M.actions.length===0)return{forced:!1,reason:null};let m="";try{m=new URL(E.url).hostname.toLowerCase()}catch{}if((Ke.domains[m]??Ke.default_domain_policy).require_danger_ack)return{forced:!0,reason:m?`policy: domain '${m}' requires explicit confirmation`:"policy: default domain policy requires explicit confirmation"};for(const I of M.actions)if((Ke.actions[I.type]??Ke.default_action_policy).require_danger_ack)return{forced:!0,reason:`policy: action type '${I.type}' requires explicit confirmation`};return{forced:!1,reason:null}},[M,E.url,Ke]),Ft=Nt.some(m=>m.danger)||qt.danger||Un.forced;k.useEffect(()=>{var m;return(m=Ot.current)==null||m.focus(),()=>{var S,I;(S=ir.current)==null||S.abort(),(I=Ct.current)==null||I.call(Ct)}},[]),k.useEffect(()=>{b(u)},[u]),k.useEffect(()=>{let m=!1;return v.getToolManifests().then(S=>{m||Ne(S)}).catch(()=>{}),h.readPaletteRecent().then(S=>{m||je(S)}),()=>{m=!0}},[v,h]),k.useEffect(()=>{const m=!!E.text;m&&!f.current&&($(!0),C.current!==null&&window.clearTimeout(C.current),C.current=window.setTimeout(()=>{$(!1),C.current=null},700)),f.current=m},[E.text]),k.useEffect(()=>()=>{C.current!==null&&(window.clearTimeout(C.current),C.current=null)},[]),k.useEffect(()=>{let m=!1;h.readTtsEnabled().then(I=>{m||ae(I)});function S(I){const V=I.detail;typeof(V==null?void 0:V.enabled)=="boolean"&&ae(V.enabled)}return window.addEventListener("gauntlet:tts",S),()=>{m=!0,window.removeEventListener("gauntlet:tts",S)}},[h]),k.useEffect(()=>{if(!ne||A!=="plan_ready")return;const m=M==null?void 0:M.compose;if(m&&m!==de.current&&!(typeof window>"u"||!window.speechSynthesis))try{window.speechSynthesis.cancel();const S=new SpeechSynthesisUtterance(m);S.rate=1.05,S.pitch=1,window.speechSynthesis.speak(S),de.current=m}catch{}},[ne,A,M==null?void 0:M.compose]),k.useEffect(()=>()=>{var m;try{(m=window.speechSynthesis)==null||m.cancel()}catch{}},[]),k.useEffect(()=>{let m=!1;return h.readTheme().then(S=>{m||Ae(S)}),()=>{m=!0}},[h]),k.useEffect(()=>{let m=!1;return v.getSettings().then(S=>{m||It(S)}).catch(()=>{}),()=>{m=!0}},[v]),k.useEffect(()=>{if(!o.capabilities.screenshot||!o.screenshot)return;let m=!1;return h.readScreenshotEnabled().then(S=>{const I=S||Ke.screenshot_default;m||!I||o.screenshot.capture().then(V=>{m||!V||oe(V)}).catch(()=>{})}),()=>{m=!0}},[o,h,Ke.screenshot_default]);const cr=k.useCallback(()=>{b(o.selection.read())},[o]),Kr=k.useCallback(()=>{if(ot.current)return;le(null);const m=N,S={onPartial:V=>{j(m?`${m} ${V}`.trim():V)},onCommit:V=>{var ve;j(m?`${m} ${V}`.trim():V),Gt(!1),ot.current=null,(ve=Ot.current)==null||ve.focus()},onError:V=>{le(V),Gt(!1),ot.current=null}};if(o.capabilities.remoteVoice&&Ya()){Gt(!0),Qc(v,S).then(V=>{V?ot.current=V:Gt(!1)});return}const I=Yc(S);I&&(ot.current=I,Gt(!0))},[N,o,v]),dr=k.useCallback(()=>{var m;(m=ot.current)==null||m.stop()},[]),pr=k.useCallback(()=>{var m;(m=ot.current)==null||m.abort(),ot.current=null,Gt(!1)},[]);k.useEffect(()=>()=>{var m;(m=ot.current)==null||m.abort()},[]),k.useEffect(()=>{function m(S){(S.metaKey||S.ctrlKey)&&(S.key==="k"||S.key==="K")&&(S.preventDefault(),S.stopPropagation(),Ye(V=>!V))}return window.addEventListener("keydown",m,!0),()=>window.removeEventListener("keydown",m,!0)},[]);const Wn=k.useCallback(m=>{Fn(m),window.setTimeout(()=>Fn(null),1400)},[]),Xt=k.useCallback(async()=>{const m=(M==null?void 0:M.compose)||E.text||N.trim();if(!m){le("Nada para guardar — escreve um pedido ou recebe uma resposta.");return}const S=(N.trim()||E.pageTitle||"cápsula note").slice(0,200);try{await o.transport.fetchJson("POST",`${v.backendUrl}/memory/records`,{topic:S,body:m,kind:"note",scope:"user"}),Wn("saved")}catch(I){le(I instanceof Error?`memória: ${I.message}`:"memória: falhou")}},[o,v,M,E,N,Wn]),st=k.useCallback(async(m,S=[],I)=>{if(!M||M.actions.length===0)return;mn.current=!0;const V=M.actions.map((se,ye)=>{const K=S[ye],_e=Nt[ye];return{action:se,ok:K?K.ok:!1,error:(K==null?void 0:K.error)??null,danger:(_e==null?void 0:_e.danger)??!1,danger_reason:(_e==null?void 0:_e.reason)??null}}),ve={plan_id:M.plan_id||null,context_id:M.context_id||null,url:E.url||null,page_title:E.pageTitle||null,status:m,results:V,has_danger:Ft,sequence_danger_reason:qt.danger?qt.reason??null:null,danger_acknowledged:B,error:I??null,model_used:M.model_used||null,plan_latency_ms:M.latency_ms||null,user_input:N.trim()||null};if(Ke.execution_reporting_required)try{await v.reportExecution(ve)}catch(se){const ye=se instanceof Error?se.message:String(se);le(`policy: execution report rejected — ${ye}`),W("error")}else v.reportExecution(ve).catch(()=>{})},[v,M,E,Nt,Ft,qt,B,N,Ke.execution_reporting_required]),Zt=k.useCallback(()=>{M&&M.actions.length>0&&!mn.current&&st("rejected"),s()},[M,s,st]);k.useEffect(()=>{function m(S){if(S.key==="Escape"){if(S.preventDefault(),S.stopPropagation(),ur){Ye(!1);return}if(ot.current){pr();return}Zt()}}return window.addEventListener("keydown",m,!0),()=>window.removeEventListener("keydown",m,!0)},[Zt,ur,pr]);const Hn=k.useCallback(async()=>{const m=o.filesystem;if(m){vt(null);try{const S=await m.pickFile();if(!S)return;const I=S.name.toLowerCase();if(/\.(png|jpe?g|gif|webp|svg)$/.test(I)){const{base64:ve,mime:se}=await m.readFileBase64(S.path),ye=Math.ceil(ve.length*3/4);Me(K=>[...K,{id:`att-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,kind:"image",name:S.name,mime:se,bytes:ye,base64:ve,path:S.path}])}else{const ve=await m.readTextFile(S.path);Me(se=>[...se,{id:`att-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,kind:"text",name:S.name,mime:"text/plain",bytes:new TextEncoder().encode(ve).length,text:ve,path:S.path}])}}catch(S){vt(S instanceof Error?S.message:String(S))}}},[o]),Vn=k.useCallback(async()=>{var S;const m=(S=o.screenshot)==null?void 0:S.captureScreen;if(m){vt(null);try{const I=await m();if(!I){vt("Captura de ecrã indisponível neste sistema.");return}const V=Math.ceil(I.base64.length*3/4);Me(ve=>[...ve,{id:`att-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,kind:"image",name:`ecrã-${new Date().toISOString().slice(11,19)}.png`,mime:"image/png",bytes:V,base64:I.base64,path:I.path}])}catch(I){vt(I instanceof Error?I.message:String(I))}}},[o]),$l=k.useCallback(m=>{Me(S=>S.filter(I=>I.id!==m))},[]),[Yr,fr]=k.useState(null),[en,tn]=k.useState(!1),[hn,Kn]=k.useState(""),[Tt,nn]=k.useState(null),[xn,Yn]=k.useState(!1),gr=k.useCallback(async()=>{const m=o.shellExec;if(!m)return;const S=hn.trim();if(!S)return;const I=S.split(/\s+/),V=I[0],ve=I.slice(1);Yn(!0),nn(null);try{const se=await m.run(V,ve);nn({cmd:S,stdout:se.stdout,stderr:se.stderr,exitCode:se.exitCode,durationMs:se.durationMs})}catch(se){nn({cmd:S,stdout:"",stderr:se instanceof Error?se.message:String(se),exitCode:null,durationMs:0})}finally{Yn(!1)}},[o,hn]),mr=k.useCallback(async()=>{const m=o.filesystem;if(!(m!=null&&m.pickSavePath)||!m.writeTextFile)return;const S=(M==null?void 0:M.compose)??"";if(S.trim()){vt(null);try{const V=`${(E.pageTitle||"gauntlet-compose").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,60)||"gauntlet-compose"}.md`,ve=await m.pickSavePath(V,["md","txt","json"]);if(!ve)return;const se=await m.writeTextFile(ve,S);fr(`${ve.split(/[\\/]/).pop()??"ficheiro"} (${se<1024?`${se} B`:`${Math.round(se/1024)} KB`})`),window.setTimeout(()=>fr(null),2500)}catch(I){vt(I instanceof Error?I.message:String(I))}}},[o,M,E.pageTitle]),Il=k.useCallback(m=>{if(ge.length===0)return m;const S=[];for(const I of ge)if(I.kind==="text"&&I.text!=null)S.push(`<file name="${I.name}" path="${I.path??""}">
${I.text}
</file>`);else if(I.kind==="image"){const V=Math.max(1,Math.round(I.bytes/1024));S.push(`<image name="${I.name}" bytes="${I.bytes}" mime="${I.mime}">[${V} KB image attached — describe in prompt; multimodal payload arrives in A2]</image>`)}return`${S.join(`

`)}

${m}`},[ge]),hr=k.useCallback(async()=>{var V,ve;if(!N.trim()||A==="planning"||A==="streaming"||A==="executing")return;M&&M.actions.length>0&&!mn.current&&st("rejected"),(V=ir.current)==null||V.abort(),(ve=Ct.current)==null||ve.call(Ct);const m=new AbortController;ir.current=m,W("planning"),le(null),Ee(null),be(null),P(!1),ue(!1),U(""),Jt(0),Qt.current="",mn.current=!1;const S=await h.readScreenshotEnabled(),I=Rd(E,S?pe:null);try{const se=await v.captureContext(I,m.signal);if(m.signal.aborted)return;const ye=Il(N.trim());Ct.current=v.requestDomPlanStream(se.context_id,ye,{onDelta:K=>{if(m.signal.aborted)return;Qt.current+=K,Jt(Le=>Le+1);const _e=Ld(Qt.current);_e!==null?(U(_e),W(Le=>Le==="planning"?"streaming":Le)):W(Le=>Le==="planning"?"streaming":Le)},onDone:K=>{m.signal.aborted||(Ee(K),W("plan_ready"),U(""),Qt.current="")},onError:K=>{m.signal.aborted||(async()=>{try{const _e=await v.requestDomPlan(se.context_id,ye,m.signal);if(m.signal.aborted)return;Ee(_e),W("plan_ready"),U(""),Qt.current=""}catch(_e){if(m.signal.aborted)return;const Le=_e instanceof Error?_e.message:String(_e);le(`stream: ${K} · fallback: ${Le}`),W("error"),U(""),Qt.current=""}})()}})}catch(se){if(m.signal.aborted)return;le(se instanceof Error?se.message:String(se)),W("error")}},[v,E,pe,N,A,M,st,Il,h]),rn=k.useCallback(m=>{var S;m.preventDefault(),F(I=>I+1);try{(S=window.speechSynthesis)==null||S.cancel()}catch{}de.current="",hr()},[hr]),yt=k.useMemo(()=>N.startsWith("/")?N.split(`
`,1)[0].slice(1).toLowerCase():null,[N]),xr=k.useMemo(()=>{var S,I;const m=[];return o.capabilities.filesystemRead&&o.filesystem&&m.push({id:"anexar",label:"/anexar",hint:"Anexar ficheiro local",run:()=>void Hn()}),o.capabilities.screenCapture&&((S=o.screenshot)!=null&&S.captureScreen)&&m.push({id:"ecra",label:"/ecrã",hint:"Capturar ecrã inteiro",run:()=>void Vn()}),o.capabilities.shellExecute&&o.shellExec&&m.push({id:"shell",label:"/shell",hint:en?"Fechar shell rápida":"Abrir shell rápida",run:()=>tn(V=>!V)}),o.capabilities.filesystemWrite&&((I=o.filesystem)!=null&&I.writeTextFile)&&(M!=null&&M.compose)&&m.push({id:"guardar",label:"/guardar",hint:"Guardar resposta para ficheiro",run:()=>void mr()}),m.push({id:"limpar",label:"/limpar",hint:"Esvaziar input",run:()=>{var V;j(""),(V=Ot.current)==null||V.focus()}}),m.push({id:"fechar",label:"/fechar",hint:"Dispensar cápsula",run:()=>Zt()}),m.push({id:"palette",label:"/palette",hint:"Abrir command palette completa (⌘K)",run:()=>{j(""),Ye(!0)}}),m},[o,Hn,Vn,Zt,M,mr,en]),Pt=k.useMemo(()=>yt===null?[]:yt===""?xr:xr.filter(m=>m.id.startsWith(yt)||m.label.includes(yt)),[xr,yt]);k.useEffect(()=>{At(0)},[yt]);const vr=k.useCallback(m=>{const S=Pt[m];S&&(j(""),At(0),S.run())},[Pt]),Ol=k.useCallback(m=>{if(yt!==null&&Pt.length>0){if(m.key==="ArrowDown"){m.preventDefault(),At(S=>(S+1)%Pt.length);return}if(m.key==="ArrowUp"){m.preventDefault(),At(S=>(S-1+Pt.length)%Pt.length);return}if(m.key==="Enter"&&!m.shiftKey){m.preventDefault(),vr(Bn);return}if(m.key==="Escape"){m.preventDefault(),j("");return}}m.key==="Enter"&&(m.shiftKey||(m.preventDefault(),hr()))},[hr,vr,Bn,Pt,yt]),Qr=k.useCallback(async()=>{if(M!=null&&M.compose)try{await navigator.clipboard.writeText(M.compose),ue(!0),window.setTimeout(()=>ue(!1),1500)}catch{le("Clipboard write blocked. Select the text and copy manually.")}},[M]),Fl=k.useCallback(async()=>{var m;if(!(!M||M.actions.length===0)&&!(Ft&&!B)){W("executing"),le(null);try{const S=await he(M.actions);be(S),W("executed");const I=S.every(V=>V.ok);window.dispatchEvent(new CustomEvent("gauntlet:execute-result",{detail:{ok:I}})),(m=o.notifications)==null||m.notify(I?"Gauntlet — plano executado":"Gauntlet — plano com falhas",I?`${S.length} ${S.length===1?"acção":"acções"} OK`:`${S.filter(V=>!V.ok).length}/${S.length} falharam — revê na cápsula`),await st("executed",S)}catch(S){const I=S instanceof Error?S.message:String(S);le(I),W("error"),window.dispatchEvent(new CustomEvent("gauntlet:execute-result",{detail:{ok:!1}})),await st("failed",[],I)}}},[T,M,Ft,B,st]),yr=k.useMemo(()=>E.bbox?E.bbox:p?{x:p.x,y:p.y,width:0,height:0}:null,[E.bbox,p]),eo=k.useMemo(()=>{if(!yr)return;const m=typeof window<"u"?window.innerWidth:1280,S=typeof window<"u"?window.innerHeight:800,I=$d(m,S),V=Id(yr,{width:m,height:S},I);return{top:`${V.top}px`,left:`${V.left}px`}},[yr]),Ie=`gauntlet-capsule--phase-${A}`,to=["gauntlet-capsule","gauntlet-capsule--floating",yr?"gauntlet-capsule--anchored":"gauntlet-capsule--centered",E.text?null:"gauntlet-capsule--no-selection",Ie].filter(Boolean).join(" ");return k.useEffect(()=>{window.dispatchEvent(new CustomEvent("gauntlet:phase",{detail:{phase:A}}))},[A]),d.jsxs("div",{className:to,"data-theme":Pe,role:"dialog","aria-label":"Gauntlet",style:eo,children:[d.jsx("div",{className:"gauntlet-capsule__aurora","aria-hidden":!0}),d.jsxs("div",{className:"gauntlet-capsule__layout",children:[d.jsxs("div",{className:"gauntlet-capsule__panel gauntlet-capsule__panel--left",children:[d.jsxs("header",{className:"gauntlet-capsule__header",children:[d.jsxs("div",{className:"gauntlet-capsule__brand-block",children:[d.jsx("span",{className:"gauntlet-capsule__mark","aria-hidden":!0,children:d.jsx("span",{className:"gauntlet-capsule__mark-dot"})}),d.jsxs("div",{className:"gauntlet-capsule__brand-text",children:[d.jsx("span",{className:"gauntlet-capsule__brand",children:"GAUNTLET"}),d.jsx("span",{className:"gauntlet-capsule__tagline",children:"cursor · capsule"})]})]}),d.jsxs("div",{className:"gauntlet-capsule__header-actions",children:[d.jsx("button",{type:"button",className:"gauntlet-capsule__settings-btn",onClick:()=>xe(m=>!m),"aria-label":"Definições","aria-expanded":J,title:"Definições",children:d.jsx("span",{"aria-hidden":!0,children:"···"})}),d.jsx("button",{type:"button",className:"gauntlet-capsule__close",onClick:Zt,"aria-label":"Dismiss capsule (Esc)",children:d.jsx("span",{"aria-hidden":!0,children:"esc"})})]})]}),J&&d.jsx(zd,{onClose:()=>xe(!1),showScreenshot:o.capabilities.screenshot,showDismissedDomains:o.capabilities.dismissDomain,showPillMode:o.capabilities.pillSurface,prefs:h,theme:Pe,onChangeTheme:m=>{Ae(m),h.writeTheme(m)}}),d.jsxs("section",{className:"gauntlet-capsule__context",children:[d.jsxs("div",{className:"gauntlet-capsule__context-meta",children:[d.jsx("span",{className:`gauntlet-capsule__source${X?" gauntlet-capsule__source--popped":""}`,children:"browser"}),d.jsx("span",{className:"gauntlet-capsule__url",title:E.url,children:E.pageTitle||E.url}),d.jsx("button",{type:"button",className:"gauntlet-capsule__refresh",onClick:cr,title:"Re-read current selection",children:"re-read"})]}),E.text?d.jsx("pre",{className:"gauntlet-capsule__selection",children:oi(E.text,600)}):d.jsx(Md,{snapshot:E,screenshotEnabled:pe!==null})]})]}),d.jsxs("div",{className:"gauntlet-capsule__panel gauntlet-capsule__panel--right",children:[d.jsxs("form",{className:"gauntlet-capsule__form",onSubmit:rn,children:[ge.length>0&&d.jsx("div",{className:"gauntlet-capsule__attachments","aria-label":"Anexos",children:ge.map(m=>d.jsxs("span",{className:`gauntlet-capsule__attachment gauntlet-capsule__attachment--${m.kind}`,title:m.path??m.name,children:[d.jsx("span",{className:"gauntlet-capsule__attachment-icon","aria-hidden":!0,children:m.kind==="image"?"◫":"⌥"}),d.jsx("span",{className:"gauntlet-capsule__attachment-name",children:m.name}),d.jsx("span",{className:"gauntlet-capsule__attachment-size",children:m.bytes<1024?`${m.bytes} B`:m.bytes<1048576?`${Math.round(m.bytes/1024)} KB`:`${(m.bytes/1048576).toFixed(1)} MB`}),d.jsx("button",{type:"button",className:"gauntlet-capsule__attachment-remove",onClick:()=>$l(m.id),"aria-label":`Remover ${m.name}`,children:"×"})]},m.id))}),$t&&d.jsx("div",{className:"gauntlet-capsule__attach-error",role:"alert",children:$t}),en&&o.shellExec&&d.jsxs("div",{className:"gauntlet-capsule__shell-panel",children:[d.jsxs("div",{className:"gauntlet-capsule__shell-row",children:[d.jsx("span",{className:"gauntlet-capsule__shell-prompt","aria-hidden":!0,children:"$"}),d.jsx("input",{type:"text",className:"gauntlet-capsule__shell-input",placeholder:"git status — comandos da allowlist",value:hn,onChange:m=>Kn(m.target.value),onKeyDown:m=>{m.key==="Enter"&&!m.shiftKey&&(m.preventDefault(),gr())},disabled:xn,spellCheck:!1,autoComplete:"off"}),d.jsx("button",{type:"button",className:"gauntlet-capsule__shell-run",onClick:()=>void gr(),disabled:xn||!hn.trim(),children:xn?"…":"Executar"})]}),Tt&&d.jsxs("div",{className:"gauntlet-capsule__shell-output",children:[d.jsxs("div",{className:"gauntlet-capsule__shell-meta",children:[d.jsxs("span",{className:"gauntlet-capsule__shell-meta-cmd",children:["$ ",Tt.cmd]}),d.jsxs("span",{className:"gauntlet-capsule__shell-meta-stat",children:[Tt.exitCode===null?"erro":`exit ${Tt.exitCode}`," · ",Tt.durationMs," ms"]})]}),Tt.stdout&&d.jsx("pre",{className:"gauntlet-capsule__shell-stdout",children:Tt.stdout}),Tt.stderr&&d.jsx("pre",{className:"gauntlet-capsule__shell-stderr",children:Tt.stderr})]})]}),yt!==null&&Pt.length>0&&d.jsx("div",{className:"gauntlet-capsule__slash",role:"listbox",children:Pt.map((m,S)=>d.jsxs("button",{type:"button",role:"option","aria-selected":S===Bn,className:`gauntlet-capsule__slash-item${S===Bn?" gauntlet-capsule__slash-item--active":""}`,onMouseEnter:()=>At(S),onClick:()=>vr(S),children:[d.jsx("span",{className:"gauntlet-capsule__slash-label",children:m.label}),d.jsx("span",{className:"gauntlet-capsule__slash-hint",children:m.hint})]},m.id))}),d.jsx("textarea",{ref:Ot,className:"gauntlet-capsule__input",placeholder:"O que queres? / abre comandos · Enter envia · Shift+Enter nova linha",value:N,onChange:m=>j(m.target.value),onKeyDown:Ol,rows:2,disabled:A==="planning"||A==="streaming"||A==="executing"}),d.jsxs("div",{className:"gauntlet-capsule__actions",children:[d.jsxs("span",{className:"gauntlet-capsule__hint","aria-hidden":!0,children:[d.jsx("span",{className:"gauntlet-capsule__kbd",children:"↵"}),d.jsx("span",{className:"gauntlet-capsule__kbd-sep",children:"·"}),d.jsx("span",{className:"gauntlet-capsule__kbd",children:"⌘K"})]}),o.capabilities.filesystemRead&&o.filesystem&&d.jsxs("button",{type:"button",className:"gauntlet-capsule__attach-btn",onClick:()=>void Hn(),"aria-label":"Anexar ficheiro local",title:"Anexar ficheiro do disco",disabled:A==="planning"||A==="streaming"||A==="executing",children:[d.jsx("svg",{viewBox:"0 0 24 24",width:"13",height:"13","aria-hidden":!0,children:d.jsx("path",{d:"M14 4l-2 0 0 8-3 0 4 5 4-5-3 0 0-8z",transform:"rotate(45 12 12)",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinejoin:"round"})}),d.jsx("span",{className:"gauntlet-capsule__attach-label",children:"anexar"})]}),o.capabilities.screenCapture&&((Jr=o.screenshot)==null?void 0:Jr.captureScreen)&&d.jsxs("button",{type:"button",className:"gauntlet-capsule__attach-btn",onClick:()=>void Vn(),"aria-label":"Capturar ecrã inteiro",title:"Capturar ecrã inteiro",disabled:A==="planning"||A==="streaming"||A==="executing",children:[d.jsxs("svg",{viewBox:"0 0 24 24",width:"13",height:"13","aria-hidden":!0,children:[d.jsx("rect",{x:"3",y:"5",width:"18",height:"13",rx:"2",fill:"none",stroke:"currentColor",strokeWidth:"1.6"}),d.jsx("circle",{cx:"12",cy:"11.5",r:"2.4",fill:"none",stroke:"currentColor",strokeWidth:"1.6"})]}),d.jsx("span",{className:"gauntlet-capsule__attach-label",children:"ecrã"})]}),o.capabilities.shellExecute&&o.shellExec&&d.jsxs("button",{type:"button",className:`gauntlet-capsule__attach-btn${en?" gauntlet-capsule__attach-btn--active":""}`,onClick:()=>tn(m=>!m),"aria-label":"Shell rápida",title:"Shell rápida (allowlist + GAUNTLET_ALLOW_CODE_EXEC)","aria-expanded":en,children:[d.jsx("svg",{viewBox:"0 0 24 24",width:"13",height:"13","aria-hidden":!0,children:d.jsx("path",{d:"M5 7l4 4-4 4M11 16h7",stroke:"currentColor",strokeWidth:"1.7",fill:"none",strokeLinecap:"round",strokeLinejoin:"round"})}),d.jsx("span",{className:"gauntlet-capsule__attach-label",children:"shell"})]}),(Vc()||o.capabilities.remoteVoice&&Ya())&&d.jsxs("button",{type:"button",className:`gauntlet-capsule__voice${In?" gauntlet-capsule__voice--active":""}`,onPointerDown:m=>{m.preventDefault(),Kr()},onPointerUp:()=>dr(),onPointerLeave:()=>{In&&dr()},"aria-label":In?"A ouvir — solta para enviar":"Premer e falar",title:"Premir e falar",disabled:A==="planning"||A==="streaming"||A==="executing",children:[d.jsxs("svg",{viewBox:"0 0 24 24",width:"13",height:"13","aria-hidden":!0,children:[d.jsx("path",{d:"M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3z",fill:"currentColor"}),d.jsx("path",{d:"M19 11a7 7 0 0 1-14 0M12 18v3",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",fill:"none"})]}),d.jsx("span",{className:"gauntlet-capsule__voice-label",children:In?"a ouvir":"voz"})]}),d.jsxs("button",{type:"submit",className:"gauntlet-capsule__compose",disabled:A==="planning"||A==="streaming"||A==="executing"||!N.trim(),children:[fe>0&&d.jsx("span",{className:"gauntlet-capsule__compose-ripple","aria-hidden":!0},fe),A==="planning"||A==="streaming"?d.jsxs(d.Fragment,{children:[d.jsx("span",{className:"gauntlet-capsule__compose-spinner","aria-hidden":!0}),d.jsx("span",{children:A==="planning"?"a pensar":"a escrever"})]}):"Enviar"]})]})]}),A==="streaming"&&D&&d.jsxs("section",{className:"gauntlet-capsule__compose-result gauntlet-capsule__compose-result--streaming",children:[d.jsxs("header",{className:"gauntlet-capsule__compose-meta",children:[d.jsx("span",{className:"gauntlet-capsule__compose-tag",children:"resposta"}),d.jsxs("span",{className:"gauntlet-capsule__compose-meta-text",children:[d.jsxs("span",{className:"gauntlet-capsule__token-counter","aria-live":"polite",children:[$n," chunks"]}),d.jsx("span",{"aria-hidden":!0,children:"·"}),d.jsx("span",{children:"a escrever…"})]})]}),d.jsxs("div",{className:"gauntlet-capsule__compose-text gauntlet-capsule__compose-text--streaming",children:[D,d.jsx("span",{className:"gauntlet-capsule__compose-caret","aria-hidden":!0,children:"▍"})]})]}),(A==="planning"||A==="streaming"&&!D)&&d.jsxs("section",{className:"gauntlet-capsule__skeleton",role:"status","aria-live":"polite","aria-label":"A pensar...",children:[d.jsxs("header",{className:"gauntlet-capsule__skeleton-header",children:[d.jsx("span",{className:"gauntlet-capsule__skeleton-tag"}),d.jsx("span",{className:"gauntlet-capsule__skeleton-meta"})]}),d.jsx("div",{className:"gauntlet-capsule__skeleton-line gauntlet-capsule__skeleton-line--w90"}),d.jsx("div",{className:"gauntlet-capsule__skeleton-line gauntlet-capsule__skeleton-line--w75"}),d.jsx("div",{className:"gauntlet-capsule__skeleton-line gauntlet-capsule__skeleton-line--w55"})]}),(M==null?void 0:M.compose)&&A==="plan_ready"&&d.jsxs("section",{className:"gauntlet-capsule__compose-result",children:[d.jsxs("header",{className:"gauntlet-capsule__compose-meta",children:[d.jsx("span",{className:"gauntlet-capsule__compose-tag",children:"resposta"}),d.jsxs("span",{className:"gauntlet-capsule__compose-meta-text",children:[M.model_used," · ",M.latency_ms," ms"]})]}),d.jsx("div",{className:"gauntlet-capsule__compose-text",children:d.jsx(Zc,{source:M.compose,onCopyBlock:()=>Wn("code copied")})}),d.jsxs("div",{className:"gauntlet-capsule__compose-actions",children:[d.jsx("button",{type:"button",className:"gauntlet-capsule__copy",onClick:()=>void Qr(),children:re?"copiado ✓":"Copy"}),d.jsx("button",{type:"button",className:"gauntlet-capsule__copy gauntlet-capsule__copy--ghost",onClick:()=>void Xt(),children:On==="saved"?"guardado ✓":"Save"}),o.capabilities.filesystemWrite&&((Qn=o.filesystem)==null?void 0:Qn.writeTextFile)&&d.jsx("button",{type:"button",className:"gauntlet-capsule__copy gauntlet-capsule__copy--ghost",onClick:()=>void mr(),title:"Guardar resposta para um ficheiro",children:Yr?`→ ${Yr}`:"Guardar como"})]})]}),M&&M.actions.length===0&&!M.compose&&A==="plan_ready"&&d.jsx("section",{className:"gauntlet-capsule__plan",children:d.jsx("p",{className:"gauntlet-capsule__plan-empty",children:M.reason??"Modelo não conseguiu planear."})}),M&&M.actions.length>0&&(A==="plan_ready"||A==="executing"||A==="executed")&&d.jsxs("section",{className:"gauntlet-capsule__plan",children:[d.jsxs("header",{className:"gauntlet-capsule__plan-header",children:[d.jsx("span",{className:"gauntlet-capsule__plan-title",children:"plano"}),d.jsxs("span",{className:"gauntlet-capsule__plan-meta",children:[M.actions.length," action",M.actions.length===1?"":"s"," · ",M.model_used," · ",M.latency_ms," ms"]})]}),d.jsx("ol",{className:"gauntlet-capsule__plan-list",children:M.actions.map((m,S)=>{const I=Te==null?void 0:Te[S],V=I?I.ok?"ok":"fail":"pending",ve=Nt[S];return d.jsxs("li",{className:`gauntlet-capsule__plan-item gauntlet-capsule__plan-item--${V}${ve!=null&&ve.danger?" gauntlet-capsule__plan-item--danger":""}`,children:[d.jsx("span",{className:"gauntlet-capsule__plan-step",children:S+1}),d.jsx("span",{className:"gauntlet-capsule__plan-desc",children:Dd(m)}),(ve==null?void 0:ve.danger)&&d.jsx("span",{className:"gauntlet-capsule__plan-danger",title:ve.reason,children:"sensível"}),I&&!I.ok&&d.jsx("span",{className:"gauntlet-capsule__plan-err",title:I.error,children:I.error})]},`${S}-${m.type}-${"selector"in m?m.selector:"path"in m?m.path:m.cmd}`)})}),A!=="executed"&&Ft&&d.jsxs("div",{className:"gauntlet-capsule__danger-gate",role:"alert",children:[d.jsxs("header",{className:"gauntlet-capsule__danger-header",children:[d.jsx("span",{className:"gauntlet-capsule__danger-mark","aria-hidden":!0,children:"!"}),d.jsx("span",{className:"gauntlet-capsule__danger-title",children:"Acções sensíveis no plano"})]}),d.jsxs("ul",{className:"gauntlet-capsule__danger-list",children:[Un.forced&&Un.reason&&d.jsxs("li",{children:[d.jsx("strong",{children:"governança:"})," ",Un.reason]},"danger-policy"),qt.danger&&d.jsxs("li",{children:[d.jsx("strong",{children:"cadeia:"})," ",qt.reason??"flagged"]},"danger-sequence"),Nt.map((m,S)=>m.danger?d.jsxs("li",{children:[d.jsxs("strong",{children:["step ",S+1,":"]})," ",m.reason??"flagged"]},`danger-${S}`):null)]}),d.jsxs("label",{className:"gauntlet-capsule__danger-confirm",children:[d.jsx("input",{type:"checkbox",checked:B,onChange:m=>P(m.target.checked),disabled:A==="executing"}),d.jsx("span",{children:"Confirmo, executar mesmo assim."})]})]}),A!=="executed"&&Dl&&d.jsx("div",{className:"gauntlet-capsule__plan-actions",children:d.jsx("button",{type:"button",className:`gauntlet-capsule__execute${Ft?" gauntlet-capsule__execute--danger":""}`,onClick:()=>void Fl(),disabled:A==="executing"||Ft&&!B,children:A==="executing"?"executando…":Ft?"Executar com cuidado":"Executar"})}),A!=="executed"&&!Dl&&d.jsx("p",{className:"gauntlet-capsule__plan-empty",children:"esta superfície não tem adapter para nenhuma destas acções — abre o Gauntlet num shell que as suporte."})]}),A==="error"&&ce&&d.jsxs("div",{className:"gauntlet-capsule__error",role:"alert",children:[d.jsx("span",{className:"gauntlet-capsule__error-icon","aria-hidden":!0,children:"!"}),d.jsx("span",{children:ce})]})]})]}),ur&&d.jsx(jd,{onClose:()=>Ye(!1),recentIds:we,actions:(()=>{var se,ye;const m=K=>{je(_e=>[K,..._e.filter(Bt=>Bt!==K)].slice(0,8)),h.notePaletteUse(K)},S=K=>{j(_e=>{const Le=_e.trimEnd(),Bt=`usa a tool ${K} para `;return Le.startsWith("usa a tool ")?Bt:Le?`${Bt}${Le}`:Bt}),window.setTimeout(()=>{const _e=Ot.current;_e&&(_e.focus(),_e.setSelectionRange(_e.value.length,_e.value.length))},0)},I=[{id:"focus",label:"Focar input",shortcut:"↵",group:"action",run:()=>{m("focus"),Ye(!1),window.setTimeout(()=>{var K;return(K=Ot.current)==null?void 0:K.focus()},0)}},{id:"copy",label:"Copiar resposta",shortcut:"⌘C",group:"action",disabled:!(M!=null&&M.compose),run:()=>{m("copy"),Ye(!1),Qr()}},{id:"save",label:"Guardar em memória",shortcut:"S",group:"action",disabled:!(M!=null&&M.compose)&&!E.text&&!N.trim(),run:()=>{m("save"),Ye(!1),Xt()}},...o.capabilities.filesystemRead&&o.filesystem?[{id:"attach-file",label:"Anexar ficheiro local",description:"Abre o file picker e anexa o conteúdo ao prompt",shortcut:"",group:"action",run:()=>{m("attach-file"),Ye(!1),Hn()}}]:[],...o.capabilities.screenCapture&&((se=o.screenshot)!=null&&se.captureScreen)?[{id:"attach-screen",label:"Capturar ecrã inteiro",description:"Anexa um screenshot do ecrã primário",shortcut:"",group:"action",run:()=>{m("attach-screen"),Ye(!1),Vn()}}]:[],...o.capabilities.shellExecute&&o.shellExec?[{id:"shell-toggle",label:en?"Fechar shell rápida":"Abrir shell rápida",description:"Painel inline para correr comandos da allowlist",shortcut:"",group:"action",run:()=>{m("shell-toggle"),Ye(!1),tn(K=>!K)}}]:[],...o.capabilities.filesystemWrite&&((ye=o.filesystem)!=null&&ye.writeTextFile)?[{id:"save-disk",label:"Guardar resposta em ficheiro",description:"Save dialog → escreve compose para o disco",shortcut:"",group:"action",disabled:!(M!=null&&M.compose),run:()=>{m("save-disk"),Ye(!1),mr()}}]:[],{id:"reread",label:"Re-ler contexto",shortcut:"R",group:"action",run:()=>{m("reread"),Ye(!1),cr()}},{id:"clear",label:"Limpar input",shortcut:"X",group:"action",disabled:!N,run:()=>{var K;m("clear"),Ye(!1),j(""),(K=Ot.current)==null||K.focus()}},{id:"dismiss",label:"Fechar cápsula",shortcut:"Esc",group:"action",run:()=>{m("dismiss"),Ye(!1),Zt()}}],ve=Z.filter(K=>{var Le;const _e=(Le=Ke.tool_policies)==null?void 0:Le[K.name];return!_e||_e.allowed!==!1}).map(K=>{var _e,Le;return{id:`tool:${K.name}`,label:K.name,description:K.description,shortcut:"",group:"tool",mode:K.mode,risk:K.risk,requiresApproval:((Le=(_e=Ke.tool_policies)==null?void 0:_e[K.name])==null?void 0:Le.require_approval)===!0,run:()=>{m(`tool:${K.name}`),Ye(!1),S(K.name)}}});return[...I,...ve]})()}),On&&d.jsx("div",{className:"gauntlet-capsule__flash",role:"status","aria-live":"polite",children:On})]})}function Pd(o,u){if(!o)return 0;const s=o.toLowerCase(),p=u.toLowerCase();if(p.includes(s))return 1e3-p.indexOf(s);let v=0,h=0,T=-2;for(let E=0;E<p.length&&v<s.length;E++)p[E]===s[v]&&(E!==T+1&&h++,T=E,v++);return v<s.length?-1:500-h*10-(p.length-s.length)}function jd({actions:o,onClose:u,recentIds:s}){const[p,v]=k.useState(""),[h,T]=k.useState(0),E=k.useRef(null);k.useEffect(()=>{var j;(j=E.current)==null||j.focus()},[]);const b=k.useMemo(()=>{if(!p){const A=new Map(s.map((le,re)=>[le,re])),W=le=>{const re=A.get(le.id);return re===void 0?s.length:re};return[...o].sort((le,re)=>{const ue=W(le),M=W(re);if(ue!==M)return ue-M;const Ee=B=>B==="tool"?1:0,Te=Ee(le.group),be=Ee(re.group);return Te!==be?Te-be:le.label.localeCompare(re.label)})}return o.map(A=>{const W=`${A.label} ${A.id} ${A.description??""}`;return{a:A,score:Pd(p,W)}}).filter(A=>A.score>=0).sort((A,W)=>W.score-A.score).map(A=>A.a)},[o,p,s]);k.useEffect(()=>{h>=b.length&&T(0)},[b.length,h]);const N=k.useCallback(j=>{if(j.key==="ArrowDown")j.preventDefault(),T(A=>Math.min(A+1,b.length-1));else if(j.key==="ArrowUp")j.preventDefault(),T(A=>Math.max(A-1,0));else if(j.key==="Enter"){j.preventDefault();const A=b[h];A&&!A.disabled&&A.run()}},[b,h]);return d.jsxs("div",{className:"gauntlet-capsule__palette",role:"dialog","aria-label":"Command palette",children:[d.jsx("div",{className:"gauntlet-capsule__palette-scrim",onClick:u}),d.jsxs("div",{className:"gauntlet-capsule__palette-panel",onKeyDown:N,children:[d.jsx("input",{ref:E,className:"gauntlet-capsule__palette-input",type:"text",placeholder:"comandos · tools…  (↑↓ para navegar, ↵ para correr, esc para fechar)",value:p,onChange:j=>v(j.target.value)}),d.jsx("ul",{className:"gauntlet-capsule__palette-list",role:"listbox",children:b.length===0?d.jsx("li",{className:"gauntlet-capsule__palette-empty",children:"sem resultados"}):b.map((j,A)=>d.jsxs("li",{role:"option","aria-selected":A===h,"aria-disabled":j.disabled,onMouseEnter:()=>T(A),onClick:()=>{j.disabled||j.run()},className:`gauntlet-capsule__palette-item${A===h?" gauntlet-capsule__palette-item--active":""}${j.disabled?" gauntlet-capsule__palette-item--disabled":""}${j.group==="tool"?" gauntlet-capsule__palette-item--tool":""}`,children:[d.jsxs("div",{className:"gauntlet-capsule__palette-main",children:[d.jsx("span",{className:"gauntlet-capsule__palette-label",children:j.label}),j.description&&d.jsx("span",{className:"gauntlet-capsule__palette-desc",children:j.description})]}),d.jsxs("div",{className:"gauntlet-capsule__palette-meta",children:[j.mode&&d.jsx("span",{className:`gauntlet-capsule__palette-badge gauntlet-capsule__palette-badge--mode-${j.mode}`,title:`mode: ${j.mode}`,children:j.mode}),j.risk&&j.risk!=="low"&&d.jsx("span",{className:`gauntlet-capsule__palette-badge gauntlet-capsule__palette-badge--risk-${j.risk}`,title:`risk: ${j.risk}`,children:j.risk}),j.requiresApproval&&d.jsx("span",{className:"gauntlet-capsule__palette-badge gauntlet-capsule__palette-badge--approval",title:"requires explicit approval before running",children:"approval"}),j.shortcut&&d.jsx("span",{className:"gauntlet-capsule__palette-shortcut",children:j.shortcut})]})]},j.id))})]})]})}function oi(o,u){return o.length<=u?o:o.slice(0,u)+"…"}function Md({snapshot:o,screenshotEnabled:u}){const s=(()=>{if(!o.domSkeleton)return 0;try{const v=JSON.parse(o.domSkeleton);if(Array.isArray(v))return v.length}catch{}return 0})(),p=!!o.pageText;return d.jsxs("ul",{className:"gauntlet-capsule__context-summary","aria-label":"context",children:[d.jsxs("li",{children:[d.jsx("span",{className:"gauntlet-capsule__context-key",children:"selection"}),d.jsx("span",{className:"gauntlet-capsule__context-val gauntlet-capsule__context-val--muted",children:"none"})]}),d.jsxs("li",{children:[d.jsx("span",{className:"gauntlet-capsule__context-key",children:"page captured"}),d.jsx("span",{className:"gauntlet-capsule__context-val",children:p?"yes":"no"})]}),d.jsxs("li",{children:[d.jsx("span",{className:"gauntlet-capsule__context-key",children:"DOM captured"}),d.jsx("span",{className:"gauntlet-capsule__context-val",children:s>0?`${s} elements`:"—"})]}),d.jsxs("li",{children:[d.jsx("span",{className:"gauntlet-capsule__context-key",children:"screenshot"}),d.jsx("span",{className:"gauntlet-capsule__context-val",children:u?"on":"off"})]})]})}function zd({onClose:o,showScreenshot:u,prefs:s,showDismissedDomains:p,theme:v,onChangeTheme:h,showPillMode:T}){const[E,b]=k.useState([]),[N,j]=k.useState(!0),[A,W]=k.useState(!1),[ce,le]=k.useState("corner"),[re,ue]=k.useState(!1);k.useEffect(()=>{let B=!1;return p&&s.readDismissedDomains().then(P=>{B||b(P)}),s.readScreenshotEnabled().then(P=>{B||(W(P),j(!1))}),s.readPillMode().then(P=>{B||le(P)}),s.readTtsEnabled().then(P=>{B||ue(P)}),()=>{B=!0}},[s,p]);const M=k.useCallback(async B=>{le(B),await s.writePillMode(B),window.dispatchEvent(new CustomEvent("gauntlet:pill-mode",{detail:{mode:B}}))},[s]),Ee=k.useCallback(async B=>{var P;if(ue(B),await s.writeTtsEnabled(B),!B)try{(P=window.speechSynthesis)==null||P.cancel()}catch{}window.dispatchEvent(new CustomEvent("gauntlet:tts",{detail:{enabled:B}}))},[s]),Te=k.useCallback(async B=>{await s.restoreDomain(B),b(P=>P.filter(D=>D!==B))},[s]),be=k.useCallback(async B=>{W(B),await s.writeScreenshotEnabled(B)},[s]);return d.jsxs("section",{className:"gauntlet-capsule__settings",role:"region","aria-label":"Definições",children:[d.jsxs("header",{className:"gauntlet-capsule__settings-header",children:[d.jsx("span",{className:"gauntlet-capsule__settings-title",children:"definições"}),d.jsx("button",{type:"button",className:"gauntlet-capsule__settings-close",onClick:o,"aria-label":"Fechar definições",children:"×"})]}),d.jsxs("div",{className:"gauntlet-capsule__settings-section",children:[d.jsx("span",{className:"gauntlet-capsule__settings-subtitle",children:"aparência"}),d.jsxs("div",{className:"gauntlet-capsule__theme-switch",role:"radiogroup","aria-label":"tema",children:[d.jsxs("button",{type:"button",className:`gauntlet-capsule__theme-option${v==="light"?" gauntlet-capsule__theme-option--active":""}`,onClick:()=>h("light"),role:"radio","aria-checked":v==="light",children:[d.jsx("span",{className:"gauntlet-capsule__theme-swatch gauntlet-capsule__theme-swatch--light","aria-hidden":!0}),d.jsx("span",{children:"flagship light"})]}),d.jsxs("button",{type:"button",className:`gauntlet-capsule__theme-option${v==="dark"?" gauntlet-capsule__theme-option--active":""}`,onClick:()=>h("dark"),role:"radio","aria-checked":v==="dark",children:[d.jsx("span",{className:"gauntlet-capsule__theme-swatch gauntlet-capsule__theme-swatch--dark","aria-hidden":!0}),d.jsx("span",{children:"night premium"})]})]})]}),T&&d.jsxs("div",{className:"gauntlet-capsule__settings-section",children:[d.jsx("span",{className:"gauntlet-capsule__settings-subtitle",children:"pill"}),d.jsxs("div",{className:"gauntlet-capsule__theme-switch",role:"radiogroup","aria-label":"pill mode",children:[d.jsxs("button",{type:"button",className:`gauntlet-capsule__theme-option${ce==="corner"?" gauntlet-capsule__theme-option--active":""}`,onClick:()=>void M("corner"),role:"radio","aria-checked":ce==="corner",children:[d.jsx("span",{className:"gauntlet-capsule__theme-swatch gauntlet-capsule__pill-mode-swatch--corner","aria-hidden":!0}),d.jsx("span",{children:"resting corner"})]}),d.jsxs("button",{type:"button",className:`gauntlet-capsule__theme-option${ce==="cursor"?" gauntlet-capsule__theme-option--active":""}`,onClick:()=>void M("cursor"),role:"radio","aria-checked":ce==="cursor",children:[d.jsx("span",{className:"gauntlet-capsule__theme-swatch gauntlet-capsule__pill-mode-swatch--cursor","aria-hidden":!0}),d.jsx("span",{children:"cursor pill"})]})]})]}),u&&d.jsx("div",{className:"gauntlet-capsule__settings-section",children:d.jsxs("label",{className:"gauntlet-capsule__settings-toggle",children:[d.jsx("input",{type:"checkbox",checked:A,onChange:B=>void be(B.target.checked)}),d.jsxs("span",{className:"gauntlet-capsule__settings-toggle-label",children:[d.jsx("strong",{children:"incluir screenshot"}),d.jsx("small",{children:"o modelo vê a página visível. útil para layouts e imagens, exposição de senhas/DMs visíveis. opt-in."})]})]})}),d.jsx("div",{className:"gauntlet-capsule__settings-section",children:d.jsxs("label",{className:"gauntlet-capsule__settings-toggle",children:[d.jsx("input",{type:"checkbox",checked:re,onChange:B=>void Ee(B.target.checked)}),d.jsxs("span",{className:"gauntlet-capsule__settings-toggle-label",children:[d.jsx("strong",{children:"ler resposta em voz alta"}),d.jsx("small",{children:"quando o modelo termina, a cápsula fala a resposta via Web Speech. cancela ao submeter outro pedido ou fechar a cápsula."})]})]})}),d.jsxs("div",{className:"gauntlet-capsule__settings-section",children:[d.jsx("span",{className:"gauntlet-capsule__settings-subtitle",children:"domínios escondidos"}),N?d.jsx("p",{className:"gauntlet-capsule__settings-empty",children:"a carregar…"}):E.length===0?d.jsx("p",{className:"gauntlet-capsule__settings-empty",children:"nenhum — clica direito no pill em qualquer site para o esconder."}):d.jsx("ul",{className:"gauntlet-capsule__settings-list",children:E.map(B=>d.jsxs("li",{className:"gauntlet-capsule__settings-row",children:[d.jsx("span",{className:"gauntlet-capsule__settings-host",children:B}),d.jsx("button",{type:"button",className:"gauntlet-capsule__settings-restore",onClick:()=>void Te(B),children:"restaurar"})]},B))})]})]})}function Ld(o){const u=o.match(/"compose"\s*:\s*"((?:[^"\\]|\\.)*)/);if(!u)return null;let s=u[1];return s.endsWith("\\")&&!s.endsWith("\\\\")&&(s=s.slice(0,-1)),s.replace(/\\n/g,`
`).replace(/\\r/g,"\r").replace(/\\t/g,"	").replace(/\\"/g,'"').replace(/\\\\/g,"\\")}function Rd(o,u){const s={};return o.pageText&&(s.page_text=o.pageText),o.domSkeleton&&(s.dom_skeleton=o.domSkeleton),o.bbox&&(s.selection_bbox=o.bbox),u&&(s.screenshot_data_url=u),{source:"browser",url:o.url,page_title:o.pageTitle,selection:o.text||void 0,metadata:Object.keys(s).length>0?s:void 0}}function Dd(o){switch(o.type){case"fill":return`fill ${o.selector} ← "${oi(o.value,80)}"`;case"click":return`click ${o.selector}`;case"highlight":return`highlight ${o.selector}`;case"scroll_to":return`scroll to ${o.selector}`;case"shell.run":{const u=(o.args??[]).join(" "),s=o.cwd?` (cwd: ${o.cwd})`:"";return`shell: ${o.cmd}${u?` ${u}`:""}${s}`}case"fs.read":return`fs.read ${o.path}`;case"fs.write":return`fs.write ${o.path} (${o.content.length} chars)`}}const xt=16,gn=12;function Pl(o,u,s){return s<u||o<u?u:o>s?s:o}function $d(o,u){if(o<=600)return{width:Math.max(0,o-24),height:Math.max(0,u-24)};const p=Pl(.72*o,560,820),v=Pl(.72*u,420,560);return{width:p,height:v}}function Id(o,u,s){if(!o)return{top:Math.max(xt,Math.floor((u.height-s.height)/2)),left:Math.max(xt,Math.floor((u.width-s.width)/2)),placement:"center"};const p=u.height-(o.y+o.height)-gn-xt,v=o.y-gn-xt,h=u.width-(o.x+o.width)-gn-xt,T=o.x-gn-xt,E=p>=s.height,b=v>=s.height,N=h>=s.width,j=T>=s.width;let A,W,ce;E?(A="below",W=o.y+o.height+gn,ce=o.x):b?(A="above",W=o.y-gn-s.height,ce=o.x):N?(A="right",ce=o.x+o.width+gn,W=Math.floor(o.y+o.height/2-s.height/2)):j?(A="left",ce=o.x-gn-s.width,W=Math.floor(o.y+o.height/2-s.height/2)):(A="center",W=Math.floor((u.height-s.height)/2),ce=Math.floor((u.width-s.width)/2));const le=u.height-s.height-xt,re=u.width-s.width-xt;return W=Pl(W,xt,Math.max(xt,le)),ce=Pl(ce,xt,Math.max(xt,re)),{top:W,left:ce,placement:A}}const Od=`
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
`,Fd=4,Bd=3e4,si=180,ii=8,Ud=24;function Wd({position:o,onClick:u,onDismissDomain:s,onPersistPosition:p,flash:v,phase:h,hasContext:T,disconnected:E,mode:b="corner"}){const[N,j]=k.useState(o),[A,W]=k.useState(!1),[ce,le]=k.useState({dx:0,dy:0,near:!1}),[re,ue]=k.useState(null),[M,Ee]=k.useState(!1),[Te,be]=k.useState(!1),[B,P]=k.useState(!1),D=k.useRef(null),U=k.useRef(null),J=k.useRef(null),xe=k.useRef(null),Pe=k.useRef(null);k.useEffect(()=>{j(o)},[o.bottom,o.right]),k.useEffect(()=>{if(b==="cursor"){W(f=>f&&!1);return}function $(){J.current!==null&&window.clearTimeout(J.current),W(f=>f&&!1),J.current=window.setTimeout(()=>{W(!0)},Bd)}return $(),window.addEventListener("mousemove",$,{passive:!0}),window.addEventListener("keydown",$,{passive:!0}),()=>{window.removeEventListener("mousemove",$),window.removeEventListener("keydown",$),J.current!==null&&window.clearTimeout(J.current)}},[b]),k.useEffect(()=>{if(b!=="cursor"){ue(null),Ee(!1),be(!1),P(!1);return}const $=document.createElement("style");$.id="gauntlet-pill-cursor-style",$.textContent=`
      html, body, * { cursor: none !important; }
    `,document.documentElement.appendChild($);let f=null,C=null;function ne(){if(f=null,!C)return;ue(C);const oe=document.elementFromPoint(C.x,C.y),he=!!(oe!=null&&oe.closest('input:not([type="button"]):not([type="submit"]):not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="color"]):not([type="file"]), textarea, [contenteditable=""], [contenteditable="true"]')),ge=he?!1:!!(oe!=null&&oe.closest('a, button, [role="button"], select'));be(Me=>Me===he?Me:he),Ee(Me=>Me===ge?Me:ge)}function ae(oe){C={x:oe.clientX,y:oe.clientY},f==null&&(f=window.requestAnimationFrame(ne))}function de(oe){(oe.metaKey||oe.ctrlKey)&&P(!0)}function pe(oe){!oe.metaKey&&!oe.ctrlKey&&P(!1)}return window.addEventListener("pointermove",ae,{passive:!0}),window.addEventListener("keydown",de,{passive:!0}),window.addEventListener("keyup",pe,{passive:!0}),()=>{window.removeEventListener("pointermove",ae),window.removeEventListener("keydown",de),window.removeEventListener("keyup",pe),f!=null&&cancelAnimationFrame(f),$.remove(),ue(null),Ee(!1),be(!1),P(!1)}},[b]),k.useEffect(()=>{if(b==="cursor"){le(f=>f.dx===0&&f.dy===0&&!f.near?f:{dx:0,dy:0,near:!1});return}function $(f){Pe.current={x:f.clientX,y:f.clientY},xe.current==null&&(xe.current=window.requestAnimationFrame(()=>{if(xe.current=null,D.current)return;const C=Pe.current;if(!C)return;const ne=U.current;if(!ne)return;const ae=ne.getBoundingClientRect(),de=ae.left+ae.width/2,pe=ae.top+ae.height/2,oe=C.x-de,he=C.y-pe,ge=Math.hypot(oe,he);if(ge>si||ge<1){le(It=>It.dx===0&&It.dy===0&&!It.near?It:{dx:0,dy:0,near:!1});return}const Me=1-ge/si,$t=ii+(Ud-ii)*Me,vt=oe/ge,Ke=he/ge;le({dx:vt*$t,dy:Ke*$t,near:!0})}))}return window.addEventListener("pointermove",$,{passive:!0}),()=>{window.removeEventListener("pointermove",$),xe.current!=null&&(cancelAnimationFrame(xe.current),xe.current=null)}},[b]);const Ae=k.useCallback($=>{var f;$.button===0&&((f=U.current)==null||f.setPointerCapture($.pointerId),D.current={pressX:$.clientX,pressY:$.clientY,startBottom:N.bottom,startRight:N.right,armed:!1})},[N.bottom,N.right]),Z=k.useCallback($=>{const f=D.current;if(!f)return;const C=$.clientX-f.pressX,ne=$.clientY-f.pressY;!f.armed&&Math.abs(C)+Math.abs(ne)<Fd||(f.armed=!0,j({right:f.startRight-C,bottom:f.startBottom-ne}))},[]),Ne=k.useCallback($=>{var C;const f=D.current;D.current=null;try{(C=U.current)==null||C.releasePointerCapture($.pointerId)}catch{}if(f){if(f.armed){p(N);return}u()}},[N,u,p]),we=k.useCallback($=>{$.preventDefault();const f=(()=>{try{return window.location.hostname}catch{return""}})();window.confirm(f?`Esconder o Gauntlet em ${f}? Restauras na cápsula → "···" → restaurar.`:"Esconder o Gauntlet neste site?")&&s()},[s]),je=v==="ok"?"gauntlet-pill--success":v==="fail"?"gauntlet-pill--error":"",fe=b==="cursor",F=["gauntlet-pill",A&&!fe?"gauntlet-pill--idle":"",!fe&&ce.near?"gauntlet-pill--near-cursor":"",T?"gauntlet-pill--context":"",E?"gauntlet-pill--disconnected":"",je,h&&h!=="idle"?`gauntlet-pill--phase-${h}`:"",fe?"gauntlet-pill--cursor-mode":"",fe&&M?"gauntlet-pill--over-interactive":"",fe&&Te?"gauntlet-pill--over-editable":"",fe&&B?"gauntlet-pill--cmd-held":""].filter(Boolean).join(" "),X=fe?re?{top:`${re.y}px`,left:`${re.x}px`,right:"auto",bottom:"auto",transform:"translate(-50%, -50%)",pointerEvents:"none"}:{bottom:`${N.bottom}px`,right:`${N.right}px`,pointerEvents:"none"}:{bottom:`${N.bottom}px`,right:`${N.right}px`,transform:ce.dx!==0||ce.dy!==0?`translate3d(${ce.dx}px, ${ce.dy}px, 0)`:void 0};return d.jsx("button",{ref:U,type:"button",className:F,style:X,onPointerDown:Ae,onPointerMove:Z,onPointerUp:Ne,onPointerEnter:()=>W(!1),onContextMenu:we,"aria-label":"Summon Gauntlet capsule",title:"Click: abrir · Drag: mover · Right-click: esconder neste domínio",children:d.jsx("span",{className:"gauntlet-pill__mark","aria-hidden":!0,children:d.jsx("span",{className:"gauntlet-pill__dot"})})})}const Hd=`
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
`,Vd=100,Kd=new Set(["script","style","meta","link","noscript","head","html","br","hr","wbr"]),Yd="gauntlet-capsule-host";function Qd(o){const u=o.tagName.toLowerCase(),s=o.getAttribute("id");if(s&&!s.startsWith("gauntlet-"))return`${u}#${CSS.escape(s)}`;const p=o.getAttribute("name");if(p)return`${u}[name="${p}"]`;const v=o.getAttribute("type");if(v)return`${u}[type="${v}"]`;const h=Array.from(o.classList).filter(T=>T.length>2&&!T.startsWith("is-")&&!T.startsWith("has-")).slice(0,2);return h.length>0?`${u}.${h.map(T=>CSS.escape(T)).join(".")}`:u}function Jd(o){try{const u=window.getComputedStyle(o);if(u.display==="none"||u.visibility==="hidden"||u.opacity==="0")return!1;const s=o.getBoundingClientRect();return!(s.width===0&&s.height===0||s.bottom<0||s.top>window.innerHeight||s.right<0||s.left>window.innerWidth)}catch{return!1}}function Gd(o){let u=0,s=o;for(;s&&s!==document.body;)u++,s=s.parentElement;return u}function qd(o){var s;let u=o;for(;u;){if(u.id===Yd||(s=u.id)!=null&&s.startsWith("gauntlet-"))return!0;u=u.parentElement}return!1}function Xd(o){var N;const u=o.tagName.toLowerCase();if(Kd.has(u)||qd(o))return null;const s=Qd(o),p=Jd(o),v=Gd(o),h={selector:s,tag:u,visible:p,depth:v},T=o.getAttribute("type");T&&(h.type=T);const E=o.getAttribute("placeholder")||o.getAttribute("aria-label")||o.getAttribute("title")||"";E&&(h.placeholder=E.trim().slice(0,80));const b=((N=o.innerText)==null?void 0:N.trim())??"";return b&&b.length>0&&(h.text=b.slice(0,50)),h}const Zd=["input","textarea","select",'[contenteditable="true"]',"button","a[href]","label",'[role="button"]','[role="link"]','[role="textbox"]','[role="combobox"]','[role="listbox"]','[role="menuitem"]','[role="tab"]','[role="checkbox"]','[role="radio"]','[role="switch"]',"nav","main","form"].join(", ");function ep(){try{const o=[],u=new Set,s=document.querySelectorAll(Zd);for(const p of Array.from(s)){if(o.length>=Vd)break;const v=Xd(p);v&&(u.has(v.selector)||(u.add(v.selector),o.push(v)))}return{elements:o}}catch{return{elements:[]}}}const ui=5e3;function tp(){try{const o=document.body;if(!o)return"";const s=(o.innerText??"").replace(/\r\n/g,`
`).replace(/\r/g,`
`).replace(/\n{3,}/g,`

`).replace(/[ \t]{2,}/g," ").trim();return s.length<=ui?s:s.slice(0,ui)+"…"}catch{return""}}function ci(){return{text:lp(),url:ap(),pageTitle:op(),pageText:tp(),domSkeleton:JSON.stringify(ep()),bbox:sp()}}const np=50;async function rp(){var T;const o=ci();if(o.text)return o;const u=`gauntlet-cid-${Math.random().toString(36).slice(2)}`,s=[],p=E=>{const b=E.data;!b||b.gauntlet!=="subframe-selection-response"||b.cid===u&&(typeof b.text!="string"||!b.text||s.push({text:b.text,url:typeof b.url=="string"?b.url:void 0,pageTitle:typeof b.pageTitle=="string"?b.pageTitle:void 0}))};window.addEventListener("message",p);let v=null;try{v=document.querySelectorAll("iframe")}catch{v=null}if(v)for(const E of Array.from(v))try{(T=E.contentWindow)==null||T.postMessage({gauntlet:"subframe-selection-request",cid:u},"*")}catch{}await new Promise(E=>window.setTimeout(E,np)),window.removeEventListener("message",p);const h=s.sort((E,b)=>b.text.length-E.text.length)[0];return h?{...o,text:h.text,url:h.url||o.url,pageTitle:h.pageTitle||o.pageTitle,bbox:null}:o}function lp(){try{const o=window.getSelection();return o?o.toString().trim():""}catch{return""}}function ap(){try{return window.location.href}catch{return""}}function op(){try{return document.title??""}catch{return""}}function sp(){try{const o=window.getSelection();if(!o||o.rangeCount===0||o.isCollapsed)return null;const s=o.getRangeAt(0).getBoundingClientRect();return s.width===0&&s.height===0?null:{x:s.x,y:s.y,width:s.width,height:s.height}}catch{return null}}const ip={domExecution:!0,pillSurface:!0,screenshot:!0,dismissDomain:!0,voice:typeof window<"u"&&("SpeechRecognition"in window||"webkitSpeechRecognition"in window),streaming:!0,refreshSelection:!0,filesystemRead:!1,filesystemWrite:!1,screenCapture:!1,remoteVoice:!0,shellExecute:!1,notifications:!1};async function up(o,u,s){const p=await chrome.runtime.sendMessage({type:"gauntlet:fetch",url:u,method:o,headers:{"content-type":"application/json"},body:s===void 0?void 0:JSON.stringify(s)});if(!p||!p.ok)throw new Error(`composer: background fetch failed — ${(p==null?void 0:p.error)??"unknown error"}`);let v=null;if(p.body!=null&&p.body!=="")try{v=JSON.parse(p.body)}catch{v=p.body}const h=p.status??0;if(h<200||h>=300)throw new Error(`composer: ${h} ${p.statusText??""}`.trim());return v}const cp={async get(o){try{return(await chrome.storage.local.get(o))[o]??null}catch{return null}},async set(o,u){try{await chrome.storage.local.set({[o]:u})}catch{}},async remove(o){try{await chrome.storage.local.remove(o)}catch{}}};function dp(o,u,s){const p=chrome.runtime.connect({name:"gauntlet:stream"});let v=!1;function h(){if(!v){v=!0;try{p.disconnect()}catch{}}}return p.onMessage.addListener(T=>{if(!T||typeof T!="object")return;const E=T;if(E.type==="sse"&&typeof E.data=="string"){let b=null;try{b=JSON.parse(E.data)}catch{s.onError("malformed SSE payload"),h();return}if(E.event==="delta"){const N=b.text??"";s.onDelta(N)}else if(E.event==="done"){const N=b;s.onDone({plan_id:N.plan_id??"",context_id:N.context_id??"",actions:N.actions??[],compose:N.compose??null,reason:N.reason??null,model_used:N.model_used??"",latency_ms:N.latency_ms??0,raw_response:null}),h()}else if(E.event==="error"){const N=b.error??"model error";s.onError(N),h()}}else E.type==="error"?(s.onError(E.error??"transport error"),h()):E.type==="closed"&&(v||(s.onDone({plan_id:"",context_id:"",actions:[],compose:null,reason:"stream ended without result",model_used:"",latency_ms:0,raw_response:null}),v=!0))}),p.onDisconnect.addListener(()=>{var T;if(!v){const E=(T=chrome.runtime.lastError)==null?void 0:T.message;s.onError(E??"disconnected"),v=!0}}),p.postMessage({type:"start",url:o,body:u}),()=>{if(!v){try{p.postMessage({type:"abort"})}catch{}h()}}}function pp(){return{shell:"browser",capabilities:ip,transport:{fetchJson(o,u,s){return up(o,u,s)},stream:dp},storage:cp,selection:{read:()=>ci(),readAsync:()=>rp()},domActions:{execute:_d},screenshot:{async capture(){var o;if(typeof chrome>"u"||!((o=chrome.runtime)!=null&&o.sendMessage))return null;try{const u=await chrome.runtime.sendMessage({type:"gauntlet:capture_screenshot"});return!(u!=null&&u.ok)||!u.dataUrl?null:u.dataUrl}catch{return null}}},debug:{async lastSummon(){try{const o=await chrome.runtime.sendMessage({type:"gauntlet:debug"});return(o==null?void 0:o.lastSummon)??null}catch{return null}}}}}const fp=Od+Hd;function gp(){const o=k.useMemo(()=>pp(),[]),u=k.useMemo(()=>ai(o.storage),[o]),[s,p]=k.useState({kind:"pill"}),[v,h]=k.useState(ri),[T,E]=k.useState(ni),[b,N]=k.useState(!1),[j,A]=k.useState(null),[W,ce]=k.useState(null),[le,re]=k.useState(!1);k.useEffect(()=>{function B(){let P=!1;try{const D=window.getSelection();P=!!(D&&D.toString().trim().length>0)}catch{P=!1}re(D=>D===P?D:P)}return B(),document.addEventListener("selectionchange",B,{passive:!0}),()=>document.removeEventListener("selectionchange",B)},[]),k.useEffect(()=>{function B(D){const U=D.detail,J=(U==null?void 0:U.ok)===!1?"fail":"ok";A(J),window.setTimeout(()=>A(null),1500)}function P(D){const U=D.detail;U!=null&&U.phase&&(ce(U.phase),(U.phase==="executed"||U.phase==="error")&&window.setTimeout(()=>ce(null),3500))}return window.addEventListener("gauntlet:execute-result",B),window.addEventListener("gauntlet:phase",P),()=>{window.removeEventListener("gauntlet:execute-result",B),window.removeEventListener("gauntlet:phase",P)}},[]);const ue=k.useRef(null);k.useEffect(()=>{function B(P){ue.current={x:P.clientX,y:P.clientY}}return window.addEventListener("mousemove",B,{passive:!0}),()=>window.removeEventListener("mousemove",B)},[]),k.useEffect(()=>{let B=!1;u.readPillPosition().then(U=>{B||h(U)}),u.readPillMode().then(U=>{B||E(U)});function P(U){const J=U.detail;((J==null?void 0:J.mode)==="cursor"||(J==null?void 0:J.mode)==="corner")&&E(J.mode)}window.addEventListener("gauntlet:pill-mode",P);const D=(()=>{try{return window.location.hostname}catch{return""}})();return D&&u.isDomainDismissed(D).then(U=>{B||!U||(N(!0),p(J=>J.kind==="pill"?{kind:"gone"}:J))}),()=>{B=!0,window.removeEventListener("gauntlet:pill-mode",P)}},[u]);const M=k.useCallback(()=>{const B=ue.current;p(P=>({kind:"capsule",snapshot:o.selection.read(),cursor:B,nonce:P.kind==="capsule"?P.nonce+1:1})),o.selection.readAsync&&o.selection.readAsync().then(P=>{p(D=>D.kind!=="capsule"||!P.text||P.text===D.snapshot.text?D:{...D,snapshot:P})})},[o]),Ee=k.useCallback(()=>{p(b?{kind:"gone"}:{kind:"pill"})},[b]),Te=k.useCallback(()=>{const B=(()=>{try{return window.location.hostname}catch{return""}})();B&&u.dismissDomain(B),N(!0),p({kind:"gone"})},[u]),be=k.useCallback(B=>{u.writePillPosition(B)},[u]);return k.useEffect(()=>{function B(P,D,U){if(!P||typeof P!="object")return!1;const J=P.type;return J==="gauntlet:summon"?(M(),U({ok:!0}),!1):(J==="gauntlet:dismiss"&&(Ee(),U({ok:!0})),!1)}return chrome.runtime.onMessage.addListener(B),()=>chrome.runtime.onMessage.removeListener(B)},[M,Ee]),s.kind==="gone"?null:s.kind==="pill"?d.jsx(Wd,{position:v,mode:T,onClick:M,onDismissDomain:Te,onPersistPosition:be,flash:j,phase:W,hasContext:le,disconnected:W==="error"}):d.jsx(Td,{ambient:o,initialSnapshot:s.snapshot,cursorAnchor:s.cursor,onDismiss:Ee},s.nonce)}const di="gauntlet-capsule-host",mp={matches:["<all_urls>"],runAt:"document_idle",cssInjectionMode:"manual",async main(){if(window.top!==window.self){window.addEventListener("message",h=>{var N;const T=h.data;if(!T||T.gauntlet!=="subframe-selection-request")return;const E=window.getSelection(),b=E?E.toString().trim():"";(N=h.source)==null||N.postMessage({gauntlet:"subframe-selection-response",cid:T.cid,text:b,url:window.location.href,pageTitle:document.title},{targetOrigin:"*"})});return}if(document.getElementById(di))return;const o=document.createElement("div");o.id=di,Object.assign(o.style,{position:"fixed",inset:"0",zIndex:"2147483647",pointerEvents:"none",all:"initial"});const u=o.attachShadow({mode:"open"}),s=document.createElement("style");s.textContent=fp,u.appendChild(s);const p=document.createElement("div");u.appendChild(p),document.documentElement.appendChild(o),Hc.createRoot(p).render(d.jsx(k.StrictMode,{children:d.jsx(gp,{})}))}};var jl={exports:{}},hp=jl.exports,pi;function xp(){return pi||(pi=1,(function(o,u){(function(s,p){p(o)})(typeof globalThis<"u"?globalThis:typeof self<"u"?self:hp,function(s){if(!(globalThis.chrome&&globalThis.chrome.runtime&&globalThis.chrome.runtime.id))throw new Error("This script should only be loaded in a browser extension.");if(globalThis.browser&&globalThis.browser.runtime&&globalThis.browser.runtime.id)s.exports=globalThis.browser;else{const p="The message port closed before a response was received.",v=h=>{const T={alarms:{clear:{minArgs:0,maxArgs:1},clearAll:{minArgs:0,maxArgs:0},get:{minArgs:0,maxArgs:1},getAll:{minArgs:0,maxArgs:0}},bookmarks:{create:{minArgs:1,maxArgs:1},get:{minArgs:1,maxArgs:1},getChildren:{minArgs:1,maxArgs:1},getRecent:{minArgs:1,maxArgs:1},getSubTree:{minArgs:1,maxArgs:1},getTree:{minArgs:0,maxArgs:0},move:{minArgs:2,maxArgs:2},remove:{minArgs:1,maxArgs:1},removeTree:{minArgs:1,maxArgs:1},search:{minArgs:1,maxArgs:1},update:{minArgs:2,maxArgs:2}},browserAction:{disable:{minArgs:0,maxArgs:1,fallbackToNoCallback:!0},enable:{minArgs:0,maxArgs:1,fallbackToNoCallback:!0},getBadgeBackgroundColor:{minArgs:1,maxArgs:1},getBadgeText:{minArgs:1,maxArgs:1},getPopup:{minArgs:1,maxArgs:1},getTitle:{minArgs:1,maxArgs:1},openPopup:{minArgs:0,maxArgs:0},setBadgeBackgroundColor:{minArgs:1,maxArgs:1,fallbackToNoCallback:!0},setBadgeText:{minArgs:1,maxArgs:1,fallbackToNoCallback:!0},setIcon:{minArgs:1,maxArgs:1},setPopup:{minArgs:1,maxArgs:1,fallbackToNoCallback:!0},setTitle:{minArgs:1,maxArgs:1,fallbackToNoCallback:!0}},browsingData:{remove:{minArgs:2,maxArgs:2},removeCache:{minArgs:1,maxArgs:1},removeCookies:{minArgs:1,maxArgs:1},removeDownloads:{minArgs:1,maxArgs:1},removeFormData:{minArgs:1,maxArgs:1},removeHistory:{minArgs:1,maxArgs:1},removeLocalStorage:{minArgs:1,maxArgs:1},removePasswords:{minArgs:1,maxArgs:1},removePluginData:{minArgs:1,maxArgs:1},settings:{minArgs:0,maxArgs:0}},commands:{getAll:{minArgs:0,maxArgs:0}},contextMenus:{remove:{minArgs:1,maxArgs:1},removeAll:{minArgs:0,maxArgs:0},update:{minArgs:2,maxArgs:2}},cookies:{get:{minArgs:1,maxArgs:1},getAll:{minArgs:1,maxArgs:1},getAllCookieStores:{minArgs:0,maxArgs:0},remove:{minArgs:1,maxArgs:1},set:{minArgs:1,maxArgs:1}},devtools:{inspectedWindow:{eval:{minArgs:1,maxArgs:2,singleCallbackArg:!1}},panels:{create:{minArgs:3,maxArgs:3,singleCallbackArg:!0},elements:{createSidebarPane:{minArgs:1,maxArgs:1}}}},downloads:{cancel:{minArgs:1,maxArgs:1},download:{minArgs:1,maxArgs:1},erase:{minArgs:1,maxArgs:1},getFileIcon:{minArgs:1,maxArgs:2},open:{minArgs:1,maxArgs:1,fallbackToNoCallback:!0},pause:{minArgs:1,maxArgs:1},removeFile:{minArgs:1,maxArgs:1},resume:{minArgs:1,maxArgs:1},search:{minArgs:1,maxArgs:1},show:{minArgs:1,maxArgs:1,fallbackToNoCallback:!0}},extension:{isAllowedFileSchemeAccess:{minArgs:0,maxArgs:0},isAllowedIncognitoAccess:{minArgs:0,maxArgs:0}},history:{addUrl:{minArgs:1,maxArgs:1},deleteAll:{minArgs:0,maxArgs:0},deleteRange:{minArgs:1,maxArgs:1},deleteUrl:{minArgs:1,maxArgs:1},getVisits:{minArgs:1,maxArgs:1},search:{minArgs:1,maxArgs:1}},i18n:{detectLanguage:{minArgs:1,maxArgs:1},getAcceptLanguages:{minArgs:0,maxArgs:0}},identity:{launchWebAuthFlow:{minArgs:1,maxArgs:1}},idle:{queryState:{minArgs:1,maxArgs:1}},management:{get:{minArgs:1,maxArgs:1},getAll:{minArgs:0,maxArgs:0},getSelf:{minArgs:0,maxArgs:0},setEnabled:{minArgs:2,maxArgs:2},uninstallSelf:{minArgs:0,maxArgs:1}},notifications:{clear:{minArgs:1,maxArgs:1},create:{minArgs:1,maxArgs:2},getAll:{minArgs:0,maxArgs:0},getPermissionLevel:{minArgs:0,maxArgs:0},update:{minArgs:2,maxArgs:2}},pageAction:{getPopup:{minArgs:1,maxArgs:1},getTitle:{minArgs:1,maxArgs:1},hide:{minArgs:1,maxArgs:1,fallbackToNoCallback:!0},setIcon:{minArgs:1,maxArgs:1},setPopup:{minArgs:1,maxArgs:1,fallbackToNoCallback:!0},setTitle:{minArgs:1,maxArgs:1,fallbackToNoCallback:!0},show:{minArgs:1,maxArgs:1,fallbackToNoCallback:!0}},permissions:{contains:{minArgs:1,maxArgs:1},getAll:{minArgs:0,maxArgs:0},remove:{minArgs:1,maxArgs:1},request:{minArgs:1,maxArgs:1}},runtime:{getBackgroundPage:{minArgs:0,maxArgs:0},getPlatformInfo:{minArgs:0,maxArgs:0},openOptionsPage:{minArgs:0,maxArgs:0},requestUpdateCheck:{minArgs:0,maxArgs:0},sendMessage:{minArgs:1,maxArgs:3},sendNativeMessage:{minArgs:2,maxArgs:2},setUninstallURL:{minArgs:1,maxArgs:1}},sessions:{getDevices:{minArgs:0,maxArgs:1},getRecentlyClosed:{minArgs:0,maxArgs:1},restore:{minArgs:0,maxArgs:1}},storage:{local:{clear:{minArgs:0,maxArgs:0},get:{minArgs:0,maxArgs:1},getBytesInUse:{minArgs:0,maxArgs:1},remove:{minArgs:1,maxArgs:1},set:{minArgs:1,maxArgs:1}},managed:{get:{minArgs:0,maxArgs:1},getBytesInUse:{minArgs:0,maxArgs:1}},sync:{clear:{minArgs:0,maxArgs:0},get:{minArgs:0,maxArgs:1},getBytesInUse:{minArgs:0,maxArgs:1},remove:{minArgs:1,maxArgs:1},set:{minArgs:1,maxArgs:1}}},tabs:{captureVisibleTab:{minArgs:0,maxArgs:2},create:{minArgs:1,maxArgs:1},detectLanguage:{minArgs:0,maxArgs:1},discard:{minArgs:0,maxArgs:1},duplicate:{minArgs:1,maxArgs:1},executeScript:{minArgs:1,maxArgs:2},get:{minArgs:1,maxArgs:1},getCurrent:{minArgs:0,maxArgs:0},getZoom:{minArgs:0,maxArgs:1},getZoomSettings:{minArgs:0,maxArgs:1},goBack:{minArgs:0,maxArgs:1},goForward:{minArgs:0,maxArgs:1},highlight:{minArgs:1,maxArgs:1},insertCSS:{minArgs:1,maxArgs:2},move:{minArgs:2,maxArgs:2},query:{minArgs:1,maxArgs:1},reload:{minArgs:0,maxArgs:2},remove:{minArgs:1,maxArgs:1},removeCSS:{minArgs:1,maxArgs:2},sendMessage:{minArgs:2,maxArgs:3},setZoom:{minArgs:1,maxArgs:2},setZoomSettings:{minArgs:1,maxArgs:2},update:{minArgs:1,maxArgs:2}},topSites:{get:{minArgs:0,maxArgs:0}},webNavigation:{getAllFrames:{minArgs:1,maxArgs:1},getFrame:{minArgs:1,maxArgs:1}},webRequest:{handlerBehaviorChanged:{minArgs:0,maxArgs:0}},windows:{create:{minArgs:0,maxArgs:1},get:{minArgs:1,maxArgs:2},getAll:{minArgs:0,maxArgs:1},getCurrent:{minArgs:0,maxArgs:1},getLastFocused:{minArgs:0,maxArgs:1},remove:{minArgs:1,maxArgs:1},update:{minArgs:2,maxArgs:2}}};if(Object.keys(T).length===0)throw new Error("api-metadata.json has not been included in browser-polyfill");class E extends WeakMap{constructor(D,U=void 0){super(U),this.createItem=D}get(D){return this.has(D)||this.set(D,this.createItem(D)),super.get(D)}}const b=P=>P&&typeof P=="object"&&typeof P.then=="function",N=(P,D)=>(...U)=>{h.runtime.lastError?P.reject(new Error(h.runtime.lastError.message)):D.singleCallbackArg||U.length<=1&&D.singleCallbackArg!==!1?P.resolve(U[0]):P.resolve(U)},j=P=>P==1?"argument":"arguments",A=(P,D)=>function(J,...xe){if(xe.length<D.minArgs)throw new Error(`Expected at least ${D.minArgs} ${j(D.minArgs)} for ${P}(), got ${xe.length}`);if(xe.length>D.maxArgs)throw new Error(`Expected at most ${D.maxArgs} ${j(D.maxArgs)} for ${P}(), got ${xe.length}`);return new Promise((Pe,Ae)=>{if(D.fallbackToNoCallback)try{J[P](...xe,N({resolve:Pe,reject:Ae},D))}catch(Z){console.warn(`${P} API method doesn't seem to support the callback parameter, falling back to call it without a callback: `,Z),J[P](...xe),D.fallbackToNoCallback=!1,D.noCallback=!0,Pe()}else D.noCallback?(J[P](...xe),Pe()):J[P](...xe,N({resolve:Pe,reject:Ae},D))})},W=(P,D,U)=>new Proxy(D,{apply(J,xe,Pe){return U.call(xe,P,...Pe)}});let ce=Function.call.bind(Object.prototype.hasOwnProperty);const le=(P,D={},U={})=>{let J=Object.create(null),xe={has(Ae,Z){return Z in P||Z in J},get(Ae,Z,Ne){if(Z in J)return J[Z];if(!(Z in P))return;let we=P[Z];if(typeof we=="function")if(typeof D[Z]=="function")we=W(P,P[Z],D[Z]);else if(ce(U,Z)){let je=A(Z,U[Z]);we=W(P,P[Z],je)}else we=we.bind(P);else if(typeof we=="object"&&we!==null&&(ce(D,Z)||ce(U,Z)))we=le(we,D[Z],U[Z]);else if(ce(U,"*"))we=le(we,D[Z],U["*"]);else return Object.defineProperty(J,Z,{configurable:!0,enumerable:!0,get(){return P[Z]},set(je){P[Z]=je}}),we;return J[Z]=we,we},set(Ae,Z,Ne,we){return Z in J?J[Z]=Ne:P[Z]=Ne,!0},defineProperty(Ae,Z,Ne){return Reflect.defineProperty(J,Z,Ne)},deleteProperty(Ae,Z){return Reflect.deleteProperty(J,Z)}},Pe=Object.create(P);return new Proxy(Pe,xe)},re=P=>({addListener(D,U,...J){D.addListener(P.get(U),...J)},hasListener(D,U){return D.hasListener(P.get(U))},removeListener(D,U){D.removeListener(P.get(U))}}),ue=new E(P=>typeof P!="function"?P:function(U){const J=le(U,{},{getContent:{minArgs:0,maxArgs:0}});P(J)}),M=new E(P=>typeof P!="function"?P:function(U,J,xe){let Pe=!1,Ae,Z=new Promise(fe=>{Ae=function(F){Pe=!0,fe(F)}}),Ne;try{Ne=P(U,J,Ae)}catch(fe){Ne=Promise.reject(fe)}const we=Ne!==!0&&b(Ne);if(Ne!==!0&&!we&&!Pe)return!1;const je=fe=>{fe.then(F=>{xe(F)},F=>{let X;F&&(F instanceof Error||typeof F.message=="string")?X=F.message:X="An unexpected error occurred",xe({__mozWebExtensionPolyfillReject__:!0,message:X})}).catch(F=>{console.error("Failed to send onMessage rejected reply",F)})};return je(we?Ne:Z),!0}),Ee=({reject:P,resolve:D},U)=>{h.runtime.lastError?h.runtime.lastError.message===p?D():P(new Error(h.runtime.lastError.message)):U&&U.__mozWebExtensionPolyfillReject__?P(new Error(U.message)):D(U)},Te=(P,D,U,...J)=>{if(J.length<D.minArgs)throw new Error(`Expected at least ${D.minArgs} ${j(D.minArgs)} for ${P}(), got ${J.length}`);if(J.length>D.maxArgs)throw new Error(`Expected at most ${D.maxArgs} ${j(D.maxArgs)} for ${P}(), got ${J.length}`);return new Promise((xe,Pe)=>{const Ae=Ee.bind(null,{resolve:xe,reject:Pe});J.push(Ae),U.sendMessage(...J)})},be={devtools:{network:{onRequestFinished:re(ue)}},runtime:{onMessage:re(M),onMessageExternal:re(M),sendMessage:Te.bind(null,"sendMessage",{minArgs:1,maxArgs:3})},tabs:{sendMessage:Te.bind(null,"sendMessage",{minArgs:2,maxArgs:3})}},B={clear:{minArgs:1,maxArgs:1},get:{minArgs:1,maxArgs:1},set:{minArgs:1,maxArgs:1}};return T.privacy={network:{"*":B},services:{"*":B},websites:{"*":B}},le(h,be,T)};s.exports=v(chrome)}})})(jl)),jl.exports}var vp=xp();const Ml=Yt(vp);function zl(o,...u){}const yp={debug:(...o)=>zl(console.debug,...o),log:(...o)=>zl(console.log,...o),warn:(...o)=>zl(console.warn,...o),error:(...o)=>zl(console.error,...o)},Rl=class Rl extends Event{constructor(u,s){super(Rl.EVENT_NAME,{}),this.newUrl=u,this.oldUrl=s}};sr(Rl,"EVENT_NAME",Xa("wxt:locationchange"));let qa=Rl;function Xa(o){var u;return`${(u=Ml==null?void 0:Ml.runtime)==null?void 0:u.id}:content:${o}`}function _p(o){let u,s;return{run(){u==null&&(s=new URL(location.href),u=o.setInterval(()=>{let p=new URL(location.href);p.href!==s.href&&(window.dispatchEvent(new qa(p,s)),s=p)},1e3))}}}const Vr=class Vr{constructor(u,s){sr(this,"isTopFrame",window.self===window.top);sr(this,"abortController");sr(this,"locationWatcher",_p(this));sr(this,"receivedMessageIds",new Set);this.contentScriptName=u,this.options=s,this.abortController=new AbortController,this.isTopFrame?(this.listenForNewerScripts({ignoreFirstEvent:!0}),this.stopOldScripts()):this.listenForNewerScripts()}get signal(){return this.abortController.signal}abort(u){return this.abortController.abort(u)}get isInvalid(){return Ml.runtime.id==null&&this.notifyInvalidated(),this.signal.aborted}get isValid(){return!this.isInvalid}onInvalidated(u){return this.signal.addEventListener("abort",u),()=>this.signal.removeEventListener("abort",u)}block(){return new Promise(()=>{})}setInterval(u,s){const p=setInterval(()=>{this.isValid&&u()},s);return this.onInvalidated(()=>clearInterval(p)),p}setTimeout(u,s){const p=setTimeout(()=>{this.isValid&&u()},s);return this.onInvalidated(()=>clearTimeout(p)),p}requestAnimationFrame(u){const s=requestAnimationFrame((...p)=>{this.isValid&&u(...p)});return this.onInvalidated(()=>cancelAnimationFrame(s)),s}requestIdleCallback(u,s){const p=requestIdleCallback((...v)=>{this.signal.aborted||u(...v)},s);return this.onInvalidated(()=>cancelIdleCallback(p)),p}addEventListener(u,s,p,v){var h;s==="wxt:locationchange"&&this.isValid&&this.locationWatcher.run(),(h=u.addEventListener)==null||h.call(u,s.startsWith("wxt:")?Xa(s):s,p,{...v,signal:this.signal})}notifyInvalidated(){this.abort("Content script context invalidated"),yp.debug(`Content script "${this.contentScriptName}" context invalidated`)}stopOldScripts(){window.postMessage({type:Vr.SCRIPT_STARTED_MESSAGE_TYPE,contentScriptName:this.contentScriptName,messageId:Math.random().toString(36).slice(2)},"*")}verifyScriptStartedEvent(u){var h,T,E;const s=((h=u.data)==null?void 0:h.type)===Vr.SCRIPT_STARTED_MESSAGE_TYPE,p=((T=u.data)==null?void 0:T.contentScriptName)===this.contentScriptName,v=!this.receivedMessageIds.has((E=u.data)==null?void 0:E.messageId);return s&&p&&v}listenForNewerScripts(u){let s=!0;const p=v=>{if(this.verifyScriptStartedEvent(v)){this.receivedMessageIds.add(v.data.messageId);const h=s;if(s=!1,h&&(u!=null&&u.ignoreFirstEvent))return;this.notifyInvalidated()}};addEventListener("message",p),this.onInvalidated(()=>removeEventListener("message",p))}};sr(Vr,"SCRIPT_STARTED_MESSAGE_TYPE",Xa("wxt:content-script-started"));let Za=Vr;const wp=Symbol("null");let kp=0;class bp extends Map{constructor(...u){super(),this._objectHashes=new WeakMap,this._symbolHashes=new Map,this._publicKeys=new Map;const[s]=u;if(s!=null){if(typeof s[Symbol.iterator]!="function")throw new TypeError(typeof s+" is not iterable (cannot read property Symbol(Symbol.iterator))");for(const[p,v]of s)this.set(p,v)}}_getPublicKeys(u,s=!1){if(!Array.isArray(u))throw new TypeError("The keys parameter must be an array");const p=this._getPrivateKey(u,s);let v;return p&&this._publicKeys.has(p)?v=this._publicKeys.get(p):s&&(v=[...u],this._publicKeys.set(p,v)),{privateKey:p,publicKey:v}}_getPrivateKey(u,s=!1){const p=[];for(const v of u){const h=v===null?wp:v;let T;if(typeof h=="object"||typeof h=="function"?T="_objectHashes":typeof h=="symbol"?T="_symbolHashes":T=!1,!T)p.push(h);else if(this[T].has(h))p.push(this[T].get(h));else if(s){const E=`@@mkm-ref-${kp++}@@`;this[T].set(h,E),p.push(E)}else return!1}return JSON.stringify(p)}set(u,s){const{publicKey:p}=this._getPublicKeys(u,!0);return super.set(p,s)}get(u){const{publicKey:s}=this._getPublicKeys(u);return super.get(s)}has(u){const{publicKey:s}=this._getPublicKeys(u);return super.has(s)}delete(u){const{publicKey:s,privateKey:p}=this._getPublicKeys(u);return!!(s&&super.delete(s)&&this._publicKeys.delete(p))}clear(){super.clear(),this._symbolHashes.clear(),this._publicKeys.clear()}get[Symbol.toStringTag](){return"ManyKeysMap"}get size(){return super.size}}new bp;function fg(){}function Ll(o,...u){}const Sp={debug:(...o)=>Ll(console.debug,...o),log:(...o)=>Ll(console.log,...o),warn:(...o)=>Ll(console.warn,...o),error:(...o)=>Ll(console.error,...o)};return(async()=>{try{const{main:o,...u}=mp,s=new Za("content",u);return await o(s)}catch(o){throw Sp.error('The content script "content" crashed on startup!',o),o}})()})();
content;
