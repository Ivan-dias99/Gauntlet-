(function(){const u=document.createElement("link").relList;if(u&&u.supports&&u.supports("modulepreload"))return;for(const g of document.querySelectorAll('link[rel="modulepreload"]'))x(g);new MutationObserver(g=>{for(const m of g)if(m.type==="childList")for(const j of m.addedNodes)j.tagName==="LINK"&&j.rel==="modulepreload"&&x(j)}).observe(document,{childList:!0,subtree:!0});function i(g){const m={};return g.integrity&&(m.integrity=g.integrity),g.referrerPolicy&&(m.referrerPolicy=g.referrerPolicy),g.crossOrigin==="use-credentials"?m.credentials="include":g.crossOrigin==="anonymous"?m.credentials="omit":m.credentials="same-origin",m}function x(g){if(g.ep)return;g.ep=!0;const m=i(g);fetch(g.href,m)}})();try{}catch(s){console.error("[wxt] Failed to initialize plugins",s)}var ei={exports:{}},ll={},ti={exports:{}},te={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Au;function tp(){if(Au)return te;Au=1;var s=Symbol.for("react.element"),u=Symbol.for("react.portal"),i=Symbol.for("react.fragment"),x=Symbol.for("react.strict_mode"),g=Symbol.for("react.profiler"),m=Symbol.for("react.provider"),j=Symbol.for("react.context"),E=Symbol.for("react.forward_ref"),k=Symbol.for("react.suspense"),z=Symbol.for("react.memo"),P=Symbol.for("react.lazy"),S=Symbol.iterator;function F(h){return h===null||typeof h!="object"?null:(h=S&&h[S]||h["@@iterator"],typeof h=="function"?h:null)}var de={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},ne=Object.assign,Z={};function re(h,b,G){this.props=h,this.context=b,this.refs=Z,this.updater=G||de}re.prototype.isReactComponent={},re.prototype.setState=function(h,b){if(typeof h!="object"&&typeof h!="function"&&h!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,h,b,"setState")},re.prototype.forceUpdate=function(h){this.updater.enqueueForceUpdate(this,h,"forceUpdate")};function D(){}D.prototype=re.prototype;function Me(h,b,G){this.props=h,this.context=b,this.refs=Z,this.updater=G||de}var Te=Me.prototype=new D;Te.constructor=Me,ne(Te,re.prototype),Te.isPureReactComponent=!0;var we=Array.isArray,Y=Object.prototype.hasOwnProperty,ce={current:null},ze={key:!0,ref:!0,__self:!0,__source:!0};function De(h,b,G){var X,le={},ae=null,ge=null;if(b!=null)for(X in b.ref!==void 0&&(ge=b.ref),b.key!==void 0&&(ae=""+b.key),b)Y.call(b,X)&&!ze.hasOwnProperty(X)&&(le[X]=b[X]);var oe=arguments.length-2;if(oe===1)le.children=G;else if(1<oe){for(var pe=Array(oe),Ve=0;Ve<oe;Ve++)pe[Ve]=arguments[Ve+2];le.children=pe}if(h&&h.defaultProps)for(X in oe=h.defaultProps,oe)le[X]===void 0&&(le[X]=oe[X]);return{$$typeof:s,type:h,key:ae,ref:ge,props:le,_owner:ce.current}}function wt(h,b){return{$$typeof:s,type:h.type,key:b,ref:h.ref,props:h.props,_owner:h._owner}}function pt(h){return typeof h=="object"&&h!==null&&h.$$typeof===s}function Pt(h){var b={"=":"=0",":":"=2"};return"$"+h.replace(/[=:]/g,function(G){return b[G]})}var at=/\/+/g;function Ye(h,b){return typeof h=="object"&&h!==null&&h.key!=null?Pt(""+h.key):b.toString(36)}function ot(h,b,G,X,le){var ae=typeof h;(ae==="undefined"||ae==="boolean")&&(h=null);var ge=!1;if(h===null)ge=!0;else switch(ae){case"string":case"number":ge=!0;break;case"object":switch(h.$$typeof){case s:case u:ge=!0}}if(ge)return ge=h,le=le(ge),h=X===""?"."+Ye(ge,0):X,we(le)?(G="",h!=null&&(G=h.replace(at,"$&/")+"/"),ot(le,b,G,"",function(Ve){return Ve})):le!=null&&(pt(le)&&(le=wt(le,G+(!le.key||ge&&ge.key===le.key?"":(""+le.key).replace(at,"$&/")+"/")+h)),b.push(le)),1;if(ge=0,X=X===""?".":X+":",we(h))for(var oe=0;oe<h.length;oe++){ae=h[oe];var pe=X+Ye(ae,oe);ge+=ot(ae,b,G,pe,le)}else if(pe=F(h),typeof pe=="function")for(h=pe.call(h),oe=0;!(ae=h.next()).done;)ae=ae.value,pe=X+Ye(ae,oe++),ge+=ot(ae,b,G,pe,le);else if(ae==="object")throw b=String(h),Error("Objects are not valid as a React child (found: "+(b==="[object Object]"?"object with keys {"+Object.keys(h).join(", ")+"}":b)+"). If you meant to render a collection of children, use an array instead.");return ge}function ft(h,b,G){if(h==null)return h;var X=[],le=0;return ot(h,X,"","",function(ae){return b.call(G,ae,le++)}),X}function Ae(h){if(h._status===-1){var b=h._result;b=b(),b.then(function(G){(h._status===0||h._status===-1)&&(h._status=1,h._result=G)},function(G){(h._status===0||h._status===-1)&&(h._status=2,h._result=G)}),h._status===-1&&(h._status=0,h._result=b)}if(h._status===1)return h._result.default;throw h._result}var ve={current:null},O={transition:null},K={ReactCurrentDispatcher:ve,ReactCurrentBatchConfig:O,ReactCurrentOwner:ce};function $(){throw Error("act(...) is not supported in production builds of React.")}return te.Children={map:ft,forEach:function(h,b,G){ft(h,function(){b.apply(this,arguments)},G)},count:function(h){var b=0;return ft(h,function(){b++}),b},toArray:function(h){return ft(h,function(b){return b})||[]},only:function(h){if(!pt(h))throw Error("React.Children.only expected to receive a single React element child.");return h}},te.Component=re,te.Fragment=i,te.Profiler=g,te.PureComponent=Me,te.StrictMode=x,te.Suspense=k,te.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=K,te.act=$,te.cloneElement=function(h,b,G){if(h==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+h+".");var X=ne({},h.props),le=h.key,ae=h.ref,ge=h._owner;if(b!=null){if(b.ref!==void 0&&(ae=b.ref,ge=ce.current),b.key!==void 0&&(le=""+b.key),h.type&&h.type.defaultProps)var oe=h.type.defaultProps;for(pe in b)Y.call(b,pe)&&!ze.hasOwnProperty(pe)&&(X[pe]=b[pe]===void 0&&oe!==void 0?oe[pe]:b[pe])}var pe=arguments.length-2;if(pe===1)X.children=G;else if(1<pe){oe=Array(pe);for(var Ve=0;Ve<pe;Ve++)oe[Ve]=arguments[Ve+2];X.children=oe}return{$$typeof:s,type:h.type,key:le,ref:ae,props:X,_owner:ge}},te.createContext=function(h){return h={$$typeof:j,_currentValue:h,_currentValue2:h,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},h.Provider={$$typeof:m,_context:h},h.Consumer=h},te.createElement=De,te.createFactory=function(h){var b=De.bind(null,h);return b.type=h,b},te.createRef=function(){return{current:null}},te.forwardRef=function(h){return{$$typeof:E,render:h}},te.isValidElement=pt,te.lazy=function(h){return{$$typeof:P,_payload:{_status:-1,_result:h},_init:Ae}},te.memo=function(h,b){return{$$typeof:z,type:h,compare:b===void 0?null:b}},te.startTransition=function(h){var b=O.transition;O.transition={};try{h()}finally{O.transition=b}},te.unstable_act=$,te.useCallback=function(h,b){return ve.current.useCallback(h,b)},te.useContext=function(h){return ve.current.useContext(h)},te.useDebugValue=function(){},te.useDeferredValue=function(h){return ve.current.useDeferredValue(h)},te.useEffect=function(h,b){return ve.current.useEffect(h,b)},te.useId=function(){return ve.current.useId()},te.useImperativeHandle=function(h,b,G){return ve.current.useImperativeHandle(h,b,G)},te.useInsertionEffect=function(h,b){return ve.current.useInsertionEffect(h,b)},te.useLayoutEffect=function(h,b){return ve.current.useLayoutEffect(h,b)},te.useMemo=function(h,b){return ve.current.useMemo(h,b)},te.useReducer=function(h,b,G){return ve.current.useReducer(h,b,G)},te.useRef=function(h){return ve.current.useRef(h)},te.useState=function(h){return ve.current.useState(h)},te.useSyncExternalStore=function(h,b,G){return ve.current.useSyncExternalStore(h,b,G)},te.useTransition=function(){return ve.current.useTransition()},te.version="18.3.1",te}var Fu;function ui(){return Fu||(Fu=1,ti.exports=tp()),ti.exports}/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Uu;function np(){if(Uu)return ll;Uu=1;var s=ui(),u=Symbol.for("react.element"),i=Symbol.for("react.fragment"),x=Object.prototype.hasOwnProperty,g=s.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,m={key:!0,ref:!0,__self:!0,__source:!0};function j(E,k,z){var P,S={},F=null,de=null;z!==void 0&&(F=""+z),k.key!==void 0&&(F=""+k.key),k.ref!==void 0&&(de=k.ref);for(P in k)x.call(k,P)&&!m.hasOwnProperty(P)&&(S[P]=k[P]);if(E&&E.defaultProps)for(P in k=E.defaultProps,k)S[P]===void 0&&(S[P]=k[P]);return{$$typeof:u,type:E,key:F,ref:de,props:S,_owner:g.current}}return ll.Fragment=i,ll.jsx=j,ll.jsxs=j,ll}var Bu;function rp(){return Bu||(Bu=1,ei.exports=np()),ei.exports}var d=rp(),M=ui(),xa={},ni={exports:{}},lt={},ri={exports:{}},li={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Vu;function lp(){return Vu||(Vu=1,(function(s){function u(O,K){var $=O.length;O.push(K);e:for(;0<$;){var h=$-1>>>1,b=O[h];if(0<g(b,K))O[h]=K,O[$]=b,$=h;else break e}}function i(O){return O.length===0?null:O[0]}function x(O){if(O.length===0)return null;var K=O[0],$=O.pop();if($!==K){O[0]=$;e:for(var h=0,b=O.length,G=b>>>1;h<G;){var X=2*(h+1)-1,le=O[X],ae=X+1,ge=O[ae];if(0>g(le,$))ae<b&&0>g(ge,le)?(O[h]=ge,O[ae]=$,h=ae):(O[h]=le,O[X]=$,h=X);else if(ae<b&&0>g(ge,$))O[h]=ge,O[ae]=$,h=ae;else break e}}return K}function g(O,K){var $=O.sortIndex-K.sortIndex;return $!==0?$:O.id-K.id}if(typeof performance=="object"&&typeof performance.now=="function"){var m=performance;s.unstable_now=function(){return m.now()}}else{var j=Date,E=j.now();s.unstable_now=function(){return j.now()-E}}var k=[],z=[],P=1,S=null,F=3,de=!1,ne=!1,Z=!1,re=typeof setTimeout=="function"?setTimeout:null,D=typeof clearTimeout=="function"?clearTimeout:null,Me=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function Te(O){for(var K=i(z);K!==null;){if(K.callback===null)x(z);else if(K.startTime<=O)x(z),K.sortIndex=K.expirationTime,u(k,K);else break;K=i(z)}}function we(O){if(Z=!1,Te(O),!ne)if(i(k)!==null)ne=!0,Ae(Y);else{var K=i(z);K!==null&&ve(we,K.startTime-O)}}function Y(O,K){ne=!1,Z&&(Z=!1,D(De),De=-1),de=!0;var $=F;try{for(Te(K),S=i(k);S!==null&&(!(S.expirationTime>K)||O&&!Pt());){var h=S.callback;if(typeof h=="function"){S.callback=null,F=S.priorityLevel;var b=h(S.expirationTime<=K);K=s.unstable_now(),typeof b=="function"?S.callback=b:S===i(k)&&x(k),Te(K)}else x(k);S=i(k)}if(S!==null)var G=!0;else{var X=i(z);X!==null&&ve(we,X.startTime-K),G=!1}return G}finally{S=null,F=$,de=!1}}var ce=!1,ze=null,De=-1,wt=5,pt=-1;function Pt(){return!(s.unstable_now()-pt<wt)}function at(){if(ze!==null){var O=s.unstable_now();pt=O;var K=!0;try{K=ze(!0,O)}finally{K?Ye():(ce=!1,ze=null)}}else ce=!1}var Ye;if(typeof Me=="function")Ye=function(){Me(at)};else if(typeof MessageChannel<"u"){var ot=new MessageChannel,ft=ot.port2;ot.port1.onmessage=at,Ye=function(){ft.postMessage(null)}}else Ye=function(){re(at,0)};function Ae(O){ze=O,ce||(ce=!0,Ye())}function ve(O,K){De=re(function(){O(s.unstable_now())},K)}s.unstable_IdlePriority=5,s.unstable_ImmediatePriority=1,s.unstable_LowPriority=4,s.unstable_NormalPriority=3,s.unstable_Profiling=null,s.unstable_UserBlockingPriority=2,s.unstable_cancelCallback=function(O){O.callback=null},s.unstable_continueExecution=function(){ne||de||(ne=!0,Ae(Y))},s.unstable_forceFrameRate=function(O){0>O||125<O?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):wt=0<O?Math.floor(1e3/O):5},s.unstable_getCurrentPriorityLevel=function(){return F},s.unstable_getFirstCallbackNode=function(){return i(k)},s.unstable_next=function(O){switch(F){case 1:case 2:case 3:var K=3;break;default:K=F}var $=F;F=K;try{return O()}finally{F=$}},s.unstable_pauseExecution=function(){},s.unstable_requestPaint=function(){},s.unstable_runWithPriority=function(O,K){switch(O){case 1:case 2:case 3:case 4:case 5:break;default:O=3}var $=F;F=O;try{return K()}finally{F=$}},s.unstable_scheduleCallback=function(O,K,$){var h=s.unstable_now();switch(typeof $=="object"&&$!==null?($=$.delay,$=typeof $=="number"&&0<$?h+$:h):$=h,O){case 1:var b=-1;break;case 2:b=250;break;case 5:b=1073741823;break;case 4:b=1e4;break;default:b=5e3}return b=$+b,O={id:P++,callback:K,priorityLevel:O,startTime:$,expirationTime:b,sortIndex:-1},$>h?(O.sortIndex=$,u(z,O),i(k)===null&&O===i(z)&&(Z?(D(De),De=-1):Z=!0,ve(we,$-h))):(O.sortIndex=b,u(k,O),ne||de||(ne=!0,Ae(Y))),O},s.unstable_shouldYield=Pt,s.unstable_wrapCallback=function(O){var K=F;return function(){var $=F;F=K;try{return O.apply(this,arguments)}finally{F=$}}}})(li)),li}var Hu;function ap(){return Hu||(Hu=1,ri.exports=lp()),ri.exports}/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Wu;function op(){if(Wu)return lt;Wu=1;var s=ui(),u=ap();function i(e){for(var t="https://reactjs.org/docs/error-decoder.html?invariant="+e,n=1;n<arguments.length;n++)t+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var x=new Set,g={};function m(e,t){j(e,t),j(e+"Capture",t)}function j(e,t){for(g[e]=t,e=0;e<t.length;e++)x.add(t[e])}var E=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),k=Object.prototype.hasOwnProperty,z=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,P={},S={};function F(e){return k.call(S,e)?!0:k.call(P,e)?!1:z.test(e)?S[e]=!0:(P[e]=!0,!1)}function de(e,t,n,r){if(n!==null&&n.type===0)return!1;switch(typeof t){case"function":case"symbol":return!0;case"boolean":return r?!1:n!==null?!n.acceptsBooleans:(e=e.toLowerCase().slice(0,5),e!=="data-"&&e!=="aria-");default:return!1}}function ne(e,t,n,r){if(t===null||typeof t>"u"||de(e,t,n,r))return!0;if(r)return!1;if(n!==null)switch(n.type){case 3:return!t;case 4:return t===!1;case 5:return isNaN(t);case 6:return isNaN(t)||1>t}return!1}function Z(e,t,n,r,l,a,o){this.acceptsBooleans=t===2||t===3||t===4,this.attributeName=r,this.attributeNamespace=l,this.mustUseProperty=n,this.propertyName=e,this.type=t,this.sanitizeURL=a,this.removeEmptyString=o}var re={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e){re[e]=new Z(e,0,!1,e,null,!1,!1)}),[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(e){var t=e[0];re[t]=new Z(t,1,!1,e[1],null,!1,!1)}),["contentEditable","draggable","spellCheck","value"].forEach(function(e){re[e]=new Z(e,2,!1,e.toLowerCase(),null,!1,!1)}),["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(e){re[e]=new Z(e,2,!1,e,null,!1,!1)}),"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e){re[e]=new Z(e,3,!1,e.toLowerCase(),null,!1,!1)}),["checked","multiple","muted","selected"].forEach(function(e){re[e]=new Z(e,3,!0,e,null,!1,!1)}),["capture","download"].forEach(function(e){re[e]=new Z(e,4,!1,e,null,!1,!1)}),["cols","rows","size","span"].forEach(function(e){re[e]=new Z(e,6,!1,e,null,!1,!1)}),["rowSpan","start"].forEach(function(e){re[e]=new Z(e,5,!1,e.toLowerCase(),null,!1,!1)});var D=/[\-:]([a-z])/g;function Me(e){return e[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e){var t=e.replace(D,Me);re[t]=new Z(t,1,!1,e,null,!1,!1)}),"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e){var t=e.replace(D,Me);re[t]=new Z(t,1,!1,e,"http://www.w3.org/1999/xlink",!1,!1)}),["xml:base","xml:lang","xml:space"].forEach(function(e){var t=e.replace(D,Me);re[t]=new Z(t,1,!1,e,"http://www.w3.org/XML/1998/namespace",!1,!1)}),["tabIndex","crossOrigin"].forEach(function(e){re[e]=new Z(e,1,!1,e.toLowerCase(),null,!1,!1)}),re.xlinkHref=new Z("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1),["src","href","action","formAction"].forEach(function(e){re[e]=new Z(e,1,!1,e.toLowerCase(),null,!0,!0)});function Te(e,t,n,r){var l=re.hasOwnProperty(t)?re[t]:null;(l!==null?l.type!==0:r||!(2<t.length)||t[0]!=="o"&&t[0]!=="O"||t[1]!=="n"&&t[1]!=="N")&&(ne(t,n,l,r)&&(n=null),r||l===null?F(t)&&(n===null?e.removeAttribute(t):e.setAttribute(t,""+n)):l.mustUseProperty?e[l.propertyName]=n===null?l.type===3?!1:"":n:(t=l.attributeName,r=l.attributeNamespace,n===null?e.removeAttribute(t):(l=l.type,n=l===3||l===4&&n===!0?"":""+n,r?e.setAttributeNS(r,t,n):e.setAttribute(t,n))))}var we=s.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,Y=Symbol.for("react.element"),ce=Symbol.for("react.portal"),ze=Symbol.for("react.fragment"),De=Symbol.for("react.strict_mode"),wt=Symbol.for("react.profiler"),pt=Symbol.for("react.provider"),Pt=Symbol.for("react.context"),at=Symbol.for("react.forward_ref"),Ye=Symbol.for("react.suspense"),ot=Symbol.for("react.suspense_list"),ft=Symbol.for("react.memo"),Ae=Symbol.for("react.lazy"),ve=Symbol.for("react.offscreen"),O=Symbol.iterator;function K(e){return e===null||typeof e!="object"?null:(e=O&&e[O]||e["@@iterator"],typeof e=="function"?e:null)}var $=Object.assign,h;function b(e){if(h===void 0)try{throw Error()}catch(n){var t=n.stack.trim().match(/\n( *(at )?)/);h=t&&t[1]||""}return`
`+h+e}var G=!1;function X(e,t){if(!e||G)return"";G=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(t)if(t=function(){throw Error()},Object.defineProperty(t.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(t,[])}catch(w){var r=w}Reflect.construct(e,[],t)}else{try{t.call()}catch(w){r=w}e.call(t.prototype)}else{try{throw Error()}catch(w){r=w}e()}}catch(w){if(w&&r&&typeof w.stack=="string"){for(var l=w.stack.split(`
`),a=r.stack.split(`
`),o=l.length-1,c=a.length-1;1<=o&&0<=c&&l[o]!==a[c];)c--;for(;1<=o&&0<=c;o--,c--)if(l[o]!==a[c]){if(o!==1||c!==1)do if(o--,c--,0>c||l[o]!==a[c]){var p=`
`+l[o].replace(" at new "," at ");return e.displayName&&p.includes("<anonymous>")&&(p=p.replace("<anonymous>",e.displayName)),p}while(1<=o&&0<=c);break}}}finally{G=!1,Error.prepareStackTrace=n}return(e=e?e.displayName||e.name:"")?b(e):""}function le(e){switch(e.tag){case 5:return b(e.type);case 16:return b("Lazy");case 13:return b("Suspense");case 19:return b("SuspenseList");case 0:case 2:case 15:return e=X(e.type,!1),e;case 11:return e=X(e.type.render,!1),e;case 1:return e=X(e.type,!0),e;default:return""}}function ae(e){if(e==null)return null;if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case ze:return"Fragment";case ce:return"Portal";case wt:return"Profiler";case De:return"StrictMode";case Ye:return"Suspense";case ot:return"SuspenseList"}if(typeof e=="object")switch(e.$$typeof){case Pt:return(e.displayName||"Context")+".Consumer";case pt:return(e._context.displayName||"Context")+".Provider";case at:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case ft:return t=e.displayName||null,t!==null?t:ae(e.type)||"Memo";case Ae:t=e._payload,e=e._init;try{return ae(e(t))}catch{}}return null}function ge(e){var t=e.type;switch(e.tag){case 24:return"Cache";case 9:return(t.displayName||"Context")+".Consumer";case 10:return(t._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return e=t.render,e=e.displayName||e.name||"",t.displayName||(e!==""?"ForwardRef("+e+")":"ForwardRef");case 7:return"Fragment";case 5:return t;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return ae(t);case 8:return t===De?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t}return null}function oe(e){switch(typeof e){case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function pe(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function Ve(e){var t=pe(e)?"checked":"value",n=Object.getOwnPropertyDescriptor(e.constructor.prototype,t),r=""+e[t];if(!e.hasOwnProperty(t)&&typeof n<"u"&&typeof n.get=="function"&&typeof n.set=="function"){var l=n.get,a=n.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return l.call(this)},set:function(o){r=""+o,a.call(this,o)}}),Object.defineProperty(e,t,{enumerable:n.enumerable}),{getValue:function(){return r},setValue:function(o){r=""+o},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function Mt(e){e._valueTracker||(e._valueTracker=Ve(e))}function qe(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),r="";return e&&(r=pe(e)?e.checked?"true":"false":e.value),e=r,e!==n?(t.setValue(e),!0):!1}function Hn(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}function Lt(e,t){var n=t.checked;return $({},t,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:n??e._wrapperState.initialChecked})}function Wn(e,t){var n=t.defaultValue==null?"":t.defaultValue,r=t.checked!=null?t.checked:t.defaultChecked;n=oe(t.value!=null?t.value:n),e._wrapperState={initialChecked:r,initialValue:n,controlled:t.type==="checkbox"||t.type==="radio"?t.checked!=null:t.value!=null}}function Rt(e,t){t=t.checked,t!=null&&Te(e,"checked",t,!1)}function Dt(e,t){Rt(e,t);var n=oe(t.value),r=t.type;if(n!=null)r==="number"?(n===0&&e.value===""||e.value!=n)&&(e.value=""+n):e.value!==""+n&&(e.value=""+n);else if(r==="submit"||r==="reset"){e.removeAttribute("value");return}t.hasOwnProperty("value")?vr(e,t.type,n):t.hasOwnProperty("defaultValue")&&vr(e,t.type,oe(t.defaultValue)),t.checked==null&&t.defaultChecked!=null&&(e.defaultChecked=!!t.defaultChecked)}function Cn(e,t,n){if(t.hasOwnProperty("value")||t.hasOwnProperty("defaultValue")){var r=t.type;if(!(r!=="submit"&&r!=="reset"||t.value!==void 0&&t.value!==null))return;t=""+e._wrapperState.initialValue,n||t===e.value||(e.value=t),e.defaultValue=t}n=e.name,n!==""&&(e.name=""),e.defaultChecked=!!e._wrapperState.initialChecked,n!==""&&(e.name=n)}function vr(e,t,n){(t!=="number"||Hn(e.ownerDocument)!==e)&&(n==null?e.defaultValue=""+e._wrapperState.initialValue:e.defaultValue!==""+n&&(e.defaultValue=""+n))}var Zt=Array.isArray;function Fe(e,t,n,r){if(e=e.options,t){t={};for(var l=0;l<n.length;l++)t["$"+n[l]]=!0;for(n=0;n<e.length;n++)l=t.hasOwnProperty("$"+e[n].value),e[n].selected!==l&&(e[n].selected=l),l&&r&&(e[n].defaultSelected=!0)}else{for(n=""+oe(n),t=null,l=0;l<e.length;l++){if(e[l].value===n){e[l].selected=!0,r&&(e[l].defaultSelected=!0);return}t!==null||e[l].disabled||(t=e[l])}t!==null&&(t.selected=!0)}}function en(e,t){if(t.dangerouslySetInnerHTML!=null)throw Error(i(91));return $({},t,{value:void 0,defaultValue:void 0,children:""+e._wrapperState.initialValue})}function Vt(e,t){var n=t.value;if(n==null){if(n=t.children,t=t.defaultValue,n!=null){if(t!=null)throw Error(i(92));if(Zt(n)){if(1<n.length)throw Error(i(93));n=n[0]}t=n}t==null&&(t=""),n=t}e._wrapperState={initialValue:oe(n)}}function Qn(e,t){var n=oe(t.value),r=oe(t.defaultValue);n!=null&&(n=""+n,n!==e.value&&(e.value=n),t.defaultValue==null&&e.defaultValue!==n&&(e.defaultValue=n)),r!=null&&(e.defaultValue=""+r)}function it(e){var t=e.textContent;t===e._wrapperState.initialValue&&t!==""&&t!==null&&(e.value=t)}function Kn(e){switch(e){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function Yn(e,t){return e==null||e==="http://www.w3.org/1999/xhtml"?Kn(t):e==="http://www.w3.org/2000/svg"&&t==="foreignObject"?"http://www.w3.org/1999/xhtml":e}var Ot,Ht=(function(e){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(t,n,r,l){MSApp.execUnsafeLocalFunction(function(){return e(t,n,r,l)})}:e})(function(e,t){if(e.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in e)e.innerHTML=t;else{for(Ot=Ot||document.createElement("div"),Ot.innerHTML="<svg>"+t.valueOf().toString()+"</svg>",t=Ot.firstChild;e.firstChild;)e.removeChild(e.firstChild);for(;t.firstChild;)e.appendChild(t.firstChild)}});function It(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&n.nodeType===3){n.nodeValue=t;return}}e.textContent=t}var Xe={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},ol=["Webkit","ms","Moz","O"];Object.keys(Xe).forEach(function(e){ol.forEach(function(t){t=t+e.charAt(0).toUpperCase()+e.substring(1),Xe[t]=Xe[e]})});function il(e,t,n){return t==null||typeof t=="boolean"||t===""?"":n||typeof t!="number"||t===0||Xe.hasOwnProperty(e)&&Xe[e]?(""+t).trim():t+"px"}function yr(e,t){e=e.style;for(var n in t)if(t.hasOwnProperty(n)){var r=n.indexOf("--")===0,l=il(n,t[n],r);n==="float"&&(n="cssFloat"),r?e.setProperty(n,l):e[n]=l}}var sl=$({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function Nn(e,t){if(t){if(sl[e]&&(t.children!=null||t.dangerouslySetInnerHTML!=null))throw Error(i(137,e));if(t.dangerouslySetInnerHTML!=null){if(t.children!=null)throw Error(i(60));if(typeof t.dangerouslySetInnerHTML!="object"||!("__html"in t.dangerouslySetInnerHTML))throw Error(i(61))}if(t.style!=null&&typeof t.style!="object")throw Error(i(62))}}function Jn(e,t){if(e.indexOf("-")===-1)return typeof t.is=="string";switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var kt=null;function tn(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var _r=null,nn=null,rn=null;function wr(e){if(e=Vr(e)){if(typeof _r!="function")throw Error(i(280));var t=e.stateNode;t&&(t=Ml(t),_r(e.stateNode,e.type,t))}}function jn(e){nn?rn?rn.push(e):rn=[e]:nn=e}function ul(){if(nn){var e=nn,t=rn;if(rn=nn=null,wr(e),t)for(e=0;e<t.length;e++)wr(t[e])}}function cl(e,t){return e(t)}function kr(){}var Sr=!1;function Tn(e,t,n){if(Sr)return e(t,n);Sr=!0;try{return cl(e,t,n)}finally{Sr=!1,(nn!==null||rn!==null)&&(kr(),ul())}}function zn(e,t){var n=e.stateNode;if(n===null)return null;var r=Ml(n);if(r===null)return null;n=r[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(r=!r.disabled)||(e=e.type,r=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!r;break e;default:e=!1}if(e)return null;if(n&&typeof n!="function")throw Error(i(231,t,typeof n));return n}var br=!1;if(E)try{var Pn={};Object.defineProperty(Pn,"passive",{get:function(){br=!0}}),window.addEventListener("test",Pn,Pn),window.removeEventListener("test",Pn,Pn)}catch{br=!1}function dl(e,t,n,r,l,a,o,c,p){var w=Array.prototype.slice.call(arguments,3);try{t.apply(n,w)}catch(N){this.onError(N)}}var ln=!1,_=null,R=!1,U=null,ee={onError:function(e){ln=!0,_=e}};function me(e,t,n,r,l,a,o,c,p){ln=!1,_=null,dl.apply(ee,arguments)}function q(e,t,n,r,l,a,o,c,p){if(me.apply(this,arguments),ln){if(ln){var w=_;ln=!1,_=null}else throw Error(i(198));R||(R=!0,U=w)}}function ie(e){var t=e,n=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,(t.flags&4098)!==0&&(n=t.return),e=t.return;while(e)}return t.tag===3?n:null}function he(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function ke(e){if(ie(e)!==e)throw Error(i(188))}function St(e){var t=e.alternate;if(!t){if(t=ie(e),t===null)throw Error(i(188));return t!==e?null:e}for(var n=e,r=t;;){var l=n.return;if(l===null)break;var a=l.alternate;if(a===null){if(r=l.return,r!==null){n=r;continue}break}if(l.child===a.child){for(a=l.child;a;){if(a===n)return ke(l),e;if(a===r)return ke(l),t;a=a.sibling}throw Error(i(188))}if(n.return!==r.return)n=l,r=a;else{for(var o=!1,c=l.child;c;){if(c===n){o=!0,n=l,r=a;break}if(c===r){o=!0,r=l,n=a;break}c=c.sibling}if(!o){for(c=a.child;c;){if(c===n){o=!0,n=a,r=l;break}if(c===r){o=!0,r=a,n=l;break}c=c.sibling}if(!o)throw Error(i(189))}}if(n.alternate!==r)throw Error(i(190))}if(n.tag!==3)throw Error(i(188));return n.stateNode.current===n?e:t}function ci(e){return e=St(e),e!==null?di(e):null}function di(e){if(e.tag===5||e.tag===6)return e;for(e=e.child;e!==null;){var t=di(e);if(t!==null)return t;e=e.sibling}return null}var pi=u.unstable_scheduleCallback,fi=u.unstable_cancelCallback,pc=u.unstable_shouldYield,fc=u.unstable_requestPaint,Ne=u.unstable_now,gc=u.unstable_getCurrentPriorityLevel,ya=u.unstable_ImmediatePriority,gi=u.unstable_UserBlockingPriority,pl=u.unstable_NormalPriority,mc=u.unstable_LowPriority,mi=u.unstable_IdlePriority,fl=null,$t=null;function hc(e){if($t&&typeof $t.onCommitFiberRoot=="function")try{$t.onCommitFiberRoot(fl,e,void 0,(e.current.flags&128)===128)}catch{}}var bt=Math.clz32?Math.clz32:yc,xc=Math.log,vc=Math.LN2;function yc(e){return e>>>=0,e===0?32:31-(xc(e)/vc|0)|0}var gl=64,ml=4194304;function Er(e){switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return e&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return e}}function hl(e,t){var n=e.pendingLanes;if(n===0)return 0;var r=0,l=e.suspendedLanes,a=e.pingedLanes,o=n&268435455;if(o!==0){var c=o&~l;c!==0?r=Er(c):(a&=o,a!==0&&(r=Er(a)))}else o=n&~l,o!==0?r=Er(o):a!==0&&(r=Er(a));if(r===0)return 0;if(t!==0&&t!==r&&(t&l)===0&&(l=r&-r,a=t&-t,l>=a||l===16&&(a&4194240)!==0))return t;if((r&4)!==0&&(r|=n&16),t=e.entangledLanes,t!==0)for(e=e.entanglements,t&=r;0<t;)n=31-bt(t),l=1<<n,r|=e[n],t&=~l;return r}function _c(e,t){switch(e){case 1:case 2:case 4:return t+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function wc(e,t){for(var n=e.suspendedLanes,r=e.pingedLanes,l=e.expirationTimes,a=e.pendingLanes;0<a;){var o=31-bt(a),c=1<<o,p=l[o];p===-1?((c&n)===0||(c&r)!==0)&&(l[o]=_c(c,t)):p<=t&&(e.expiredLanes|=c),a&=~c}}function _a(e){return e=e.pendingLanes&-1073741825,e!==0?e:e&1073741824?1073741824:0}function hi(){var e=gl;return gl<<=1,(gl&4194240)===0&&(gl=64),e}function wa(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function Cr(e,t,n){e.pendingLanes|=t,t!==536870912&&(e.suspendedLanes=0,e.pingedLanes=0),e=e.eventTimes,t=31-bt(t),e[t]=n}function kc(e,t){var n=e.pendingLanes&~t;e.pendingLanes=t,e.suspendedLanes=0,e.pingedLanes=0,e.expiredLanes&=t,e.mutableReadLanes&=t,e.entangledLanes&=t,t=e.entanglements;var r=e.eventTimes;for(e=e.expirationTimes;0<n;){var l=31-bt(n),a=1<<l;t[l]=0,r[l]=-1,e[l]=-1,n&=~a}}function ka(e,t){var n=e.entangledLanes|=t;for(e=e.entanglements;n;){var r=31-bt(n),l=1<<r;l&t|e[r]&t&&(e[r]|=t),n&=~l}}var fe=0;function xi(e){return e&=-e,1<e?4<e?(e&268435455)!==0?16:536870912:4:1}var vi,Sa,yi,_i,wi,ba=!1,xl=[],an=null,on=null,sn=null,Nr=new Map,jr=new Map,un=[],Sc="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function ki(e,t){switch(e){case"focusin":case"focusout":an=null;break;case"dragenter":case"dragleave":on=null;break;case"mouseover":case"mouseout":sn=null;break;case"pointerover":case"pointerout":Nr.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":jr.delete(t.pointerId)}}function Tr(e,t,n,r,l,a){return e===null||e.nativeEvent!==a?(e={blockedOn:t,domEventName:n,eventSystemFlags:r,nativeEvent:a,targetContainers:[l]},t!==null&&(t=Vr(t),t!==null&&Sa(t)),e):(e.eventSystemFlags|=r,t=e.targetContainers,l!==null&&t.indexOf(l)===-1&&t.push(l),e)}function bc(e,t,n,r,l){switch(t){case"focusin":return an=Tr(an,e,t,n,r,l),!0;case"dragenter":return on=Tr(on,e,t,n,r,l),!0;case"mouseover":return sn=Tr(sn,e,t,n,r,l),!0;case"pointerover":var a=l.pointerId;return Nr.set(a,Tr(Nr.get(a)||null,e,t,n,r,l)),!0;case"gotpointercapture":return a=l.pointerId,jr.set(a,Tr(jr.get(a)||null,e,t,n,r,l)),!0}return!1}function Si(e){var t=Mn(e.target);if(t!==null){var n=ie(t);if(n!==null){if(t=n.tag,t===13){if(t=he(n),t!==null){e.blockedOn=t,wi(e.priority,function(){yi(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}e.blockedOn=null}function vl(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var n=Ca(e.domEventName,e.eventSystemFlags,t[0],e.nativeEvent);if(n===null){n=e.nativeEvent;var r=new n.constructor(n.type,n);kt=r,n.target.dispatchEvent(r),kt=null}else return t=Vr(n),t!==null&&Sa(t),e.blockedOn=n,!1;t.shift()}return!0}function bi(e,t,n){vl(e)&&n.delete(t)}function Ec(){ba=!1,an!==null&&vl(an)&&(an=null),on!==null&&vl(on)&&(on=null),sn!==null&&vl(sn)&&(sn=null),Nr.forEach(bi),jr.forEach(bi)}function zr(e,t){e.blockedOn===t&&(e.blockedOn=null,ba||(ba=!0,u.unstable_scheduleCallback(u.unstable_NormalPriority,Ec)))}function Pr(e){function t(l){return zr(l,e)}if(0<xl.length){zr(xl[0],e);for(var n=1;n<xl.length;n++){var r=xl[n];r.blockedOn===e&&(r.blockedOn=null)}}for(an!==null&&zr(an,e),on!==null&&zr(on,e),sn!==null&&zr(sn,e),Nr.forEach(t),jr.forEach(t),n=0;n<un.length;n++)r=un[n],r.blockedOn===e&&(r.blockedOn=null);for(;0<un.length&&(n=un[0],n.blockedOn===null);)Si(n),n.blockedOn===null&&un.shift()}var Gn=we.ReactCurrentBatchConfig,yl=!0;function Cc(e,t,n,r){var l=fe,a=Gn.transition;Gn.transition=null;try{fe=1,Ea(e,t,n,r)}finally{fe=l,Gn.transition=a}}function Nc(e,t,n,r){var l=fe,a=Gn.transition;Gn.transition=null;try{fe=4,Ea(e,t,n,r)}finally{fe=l,Gn.transition=a}}function Ea(e,t,n,r){if(yl){var l=Ca(e,t,n,r);if(l===null)Va(e,t,r,_l,n),ki(e,r);else if(bc(l,e,t,n,r))r.stopPropagation();else if(ki(e,r),t&4&&-1<Sc.indexOf(e)){for(;l!==null;){var a=Vr(l);if(a!==null&&vi(a),a=Ca(e,t,n,r),a===null&&Va(e,t,r,_l,n),a===l)break;l=a}l!==null&&r.stopPropagation()}else Va(e,t,r,null,n)}}var _l=null;function Ca(e,t,n,r){if(_l=null,e=tn(r),e=Mn(e),e!==null)if(t=ie(e),t===null)e=null;else if(n=t.tag,n===13){if(e=he(t),e!==null)return e;e=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null);return _l=e,null}function Ei(e){switch(e){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(gc()){case ya:return 1;case gi:return 4;case pl:case mc:return 16;case mi:return 536870912;default:return 16}default:return 16}}var cn=null,Na=null,wl=null;function Ci(){if(wl)return wl;var e,t=Na,n=t.length,r,l="value"in cn?cn.value:cn.textContent,a=l.length;for(e=0;e<n&&t[e]===l[e];e++);var o=n-e;for(r=1;r<=o&&t[n-r]===l[a-r];r++);return wl=l.slice(e,1<r?1-r:void 0)}function kl(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function Sl(){return!0}function Ni(){return!1}function st(e){function t(n,r,l,a,o){this._reactName=n,this._targetInst=l,this.type=r,this.nativeEvent=a,this.target=o,this.currentTarget=null;for(var c in e)e.hasOwnProperty(c)&&(n=e[c],this[c]=n?n(a):a[c]);return this.isDefaultPrevented=(a.defaultPrevented!=null?a.defaultPrevented:a.returnValue===!1)?Sl:Ni,this.isPropagationStopped=Ni,this}return $(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=Sl)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=Sl)},persist:function(){},isPersistent:Sl}),t}var qn={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},ja=st(qn),Mr=$({},qn,{view:0,detail:0}),jc=st(Mr),Ta,za,Lr,bl=$({},Mr,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Ma,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==Lr&&(Lr&&e.type==="mousemove"?(Ta=e.screenX-Lr.screenX,za=e.screenY-Lr.screenY):za=Ta=0,Lr=e),Ta)},movementY:function(e){return"movementY"in e?e.movementY:za}}),ji=st(bl),Tc=$({},bl,{dataTransfer:0}),zc=st(Tc),Pc=$({},Mr,{relatedTarget:0}),Pa=st(Pc),Mc=$({},qn,{animationName:0,elapsedTime:0,pseudoElement:0}),Lc=st(Mc),Rc=$({},qn,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),Dc=st(Rc),Oc=$({},qn,{data:0}),Ti=st(Oc),Ic={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},$c={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Ac={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Fc(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=Ac[e])?!!t[e]:!1}function Ma(){return Fc}var Uc=$({},Mr,{key:function(e){if(e.key){var t=Ic[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=kl(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?$c[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Ma,charCode:function(e){return e.type==="keypress"?kl(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?kl(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),Bc=st(Uc),Vc=$({},bl,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),zi=st(Vc),Hc=$({},Mr,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Ma}),Wc=st(Hc),Qc=$({},qn,{propertyName:0,elapsedTime:0,pseudoElement:0}),Kc=st(Qc),Yc=$({},bl,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),Jc=st(Yc),Gc=[9,13,27,32],La=E&&"CompositionEvent"in window,Rr=null;E&&"documentMode"in document&&(Rr=document.documentMode);var qc=E&&"TextEvent"in window&&!Rr,Pi=E&&(!La||Rr&&8<Rr&&11>=Rr),Mi=" ",Li=!1;function Ri(e,t){switch(e){case"keyup":return Gc.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Di(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var Xn=!1;function Xc(e,t){switch(e){case"compositionend":return Di(t);case"keypress":return t.which!==32?null:(Li=!0,Mi);case"textInput":return e=t.data,e===Mi&&Li?null:e;default:return null}}function Zc(e,t){if(Xn)return e==="compositionend"||!La&&Ri(e,t)?(e=Ci(),wl=Na=cn=null,Xn=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return Pi&&t.locale!=="ko"?null:t.data;default:return null}}var ed={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Oi(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!ed[e.type]:t==="textarea"}function Ii(e,t,n,r){jn(r),t=Tl(t,"onChange"),0<t.length&&(n=new ja("onChange","change",null,n,r),e.push({event:n,listeners:t}))}var Dr=null,Or=null;function td(e){ts(e,0)}function El(e){var t=rr(e);if(qe(t))return e}function nd(e,t){if(e==="change")return t}var $i=!1;if(E){var Ra;if(E){var Da="oninput"in document;if(!Da){var Ai=document.createElement("div");Ai.setAttribute("oninput","return;"),Da=typeof Ai.oninput=="function"}Ra=Da}else Ra=!1;$i=Ra&&(!document.documentMode||9<document.documentMode)}function Fi(){Dr&&(Dr.detachEvent("onpropertychange",Ui),Or=Dr=null)}function Ui(e){if(e.propertyName==="value"&&El(Or)){var t=[];Ii(t,Or,e,tn(e)),Tn(td,t)}}function rd(e,t,n){e==="focusin"?(Fi(),Dr=t,Or=n,Dr.attachEvent("onpropertychange",Ui)):e==="focusout"&&Fi()}function ld(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return El(Or)}function ad(e,t){if(e==="click")return El(t)}function od(e,t){if(e==="input"||e==="change")return El(t)}function id(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var Et=typeof Object.is=="function"?Object.is:id;function Ir(e,t){if(Et(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var n=Object.keys(e),r=Object.keys(t);if(n.length!==r.length)return!1;for(r=0;r<n.length;r++){var l=n[r];if(!k.call(t,l)||!Et(e[l],t[l]))return!1}return!0}function Bi(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function Vi(e,t){var n=Bi(e);e=0;for(var r;n;){if(n.nodeType===3){if(r=e+n.textContent.length,e<=t&&r>=t)return{node:n,offset:t-e};e=r}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=Bi(n)}}function Hi(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?Hi(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function Wi(){for(var e=window,t=Hn();t instanceof e.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href=="string"}catch{n=!1}if(n)e=t.contentWindow;else break;t=Hn(e.document)}return t}function Oa(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}function sd(e){var t=Wi(),n=e.focusedElem,r=e.selectionRange;if(t!==n&&n&&n.ownerDocument&&Hi(n.ownerDocument.documentElement,n)){if(r!==null&&Oa(n)){if(t=r.start,e=r.end,e===void 0&&(e=t),"selectionStart"in n)n.selectionStart=t,n.selectionEnd=Math.min(e,n.value.length);else if(e=(t=n.ownerDocument||document)&&t.defaultView||window,e.getSelection){e=e.getSelection();var l=n.textContent.length,a=Math.min(r.start,l);r=r.end===void 0?a:Math.min(r.end,l),!e.extend&&a>r&&(l=r,r=a,a=l),l=Vi(n,a);var o=Vi(n,r);l&&o&&(e.rangeCount!==1||e.anchorNode!==l.node||e.anchorOffset!==l.offset||e.focusNode!==o.node||e.focusOffset!==o.offset)&&(t=t.createRange(),t.setStart(l.node,l.offset),e.removeAllRanges(),a>r?(e.addRange(t),e.extend(o.node,o.offset)):(t.setEnd(o.node,o.offset),e.addRange(t)))}}for(t=[],e=n;e=e.parentNode;)e.nodeType===1&&t.push({element:e,left:e.scrollLeft,top:e.scrollTop});for(typeof n.focus=="function"&&n.focus(),n=0;n<t.length;n++)e=t[n],e.element.scrollLeft=e.left,e.element.scrollTop=e.top}}var ud=E&&"documentMode"in document&&11>=document.documentMode,Zn=null,Ia=null,$r=null,$a=!1;function Qi(e,t,n){var r=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;$a||Zn==null||Zn!==Hn(r)||(r=Zn,"selectionStart"in r&&Oa(r)?r={start:r.selectionStart,end:r.selectionEnd}:(r=(r.ownerDocument&&r.ownerDocument.defaultView||window).getSelection(),r={anchorNode:r.anchorNode,anchorOffset:r.anchorOffset,focusNode:r.focusNode,focusOffset:r.focusOffset}),$r&&Ir($r,r)||($r=r,r=Tl(Ia,"onSelect"),0<r.length&&(t=new ja("onSelect","select",null,t,n),e.push({event:t,listeners:r}),t.target=Zn)))}function Cl(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n["Webkit"+e]="webkit"+t,n["Moz"+e]="moz"+t,n}var er={animationend:Cl("Animation","AnimationEnd"),animationiteration:Cl("Animation","AnimationIteration"),animationstart:Cl("Animation","AnimationStart"),transitionend:Cl("Transition","TransitionEnd")},Aa={},Ki={};E&&(Ki=document.createElement("div").style,"AnimationEvent"in window||(delete er.animationend.animation,delete er.animationiteration.animation,delete er.animationstart.animation),"TransitionEvent"in window||delete er.transitionend.transition);function Nl(e){if(Aa[e])return Aa[e];if(!er[e])return e;var t=er[e],n;for(n in t)if(t.hasOwnProperty(n)&&n in Ki)return Aa[e]=t[n];return e}var Yi=Nl("animationend"),Ji=Nl("animationiteration"),Gi=Nl("animationstart"),qi=Nl("transitionend"),Xi=new Map,Zi="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function dn(e,t){Xi.set(e,t),m(t,[e])}for(var Fa=0;Fa<Zi.length;Fa++){var Ua=Zi[Fa],cd=Ua.toLowerCase(),dd=Ua[0].toUpperCase()+Ua.slice(1);dn(cd,"on"+dd)}dn(Yi,"onAnimationEnd"),dn(Ji,"onAnimationIteration"),dn(Gi,"onAnimationStart"),dn("dblclick","onDoubleClick"),dn("focusin","onFocus"),dn("focusout","onBlur"),dn(qi,"onTransitionEnd"),j("onMouseEnter",["mouseout","mouseover"]),j("onMouseLeave",["mouseout","mouseover"]),j("onPointerEnter",["pointerout","pointerover"]),j("onPointerLeave",["pointerout","pointerover"]),m("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),m("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),m("onBeforeInput",["compositionend","keypress","textInput","paste"]),m("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),m("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),m("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Ar="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),pd=new Set("cancel close invalid load scroll toggle".split(" ").concat(Ar));function es(e,t,n){var r=e.type||"unknown-event";e.currentTarget=n,q(r,t,void 0,e),e.currentTarget=null}function ts(e,t){t=(t&4)!==0;for(var n=0;n<e.length;n++){var r=e[n],l=r.event;r=r.listeners;e:{var a=void 0;if(t)for(var o=r.length-1;0<=o;o--){var c=r[o],p=c.instance,w=c.currentTarget;if(c=c.listener,p!==a&&l.isPropagationStopped())break e;es(l,c,w),a=p}else for(o=0;o<r.length;o++){if(c=r[o],p=c.instance,w=c.currentTarget,c=c.listener,p!==a&&l.isPropagationStopped())break e;es(l,c,w),a=p}}}if(R)throw e=U,R=!1,U=null,e}function ye(e,t){var n=t[Ja];n===void 0&&(n=t[Ja]=new Set);var r=e+"__bubble";n.has(r)||(ns(t,e,2,!1),n.add(r))}function Ba(e,t,n){var r=0;t&&(r|=4),ns(n,e,r,t)}var jl="_reactListening"+Math.random().toString(36).slice(2);function Fr(e){if(!e[jl]){e[jl]=!0,x.forEach(function(n){n!=="selectionchange"&&(pd.has(n)||Ba(n,!1,e),Ba(n,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[jl]||(t[jl]=!0,Ba("selectionchange",!1,t))}}function ns(e,t,n,r){switch(Ei(t)){case 1:var l=Cc;break;case 4:l=Nc;break;default:l=Ea}n=l.bind(null,t,n,e),l=void 0,!br||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(l=!0),r?l!==void 0?e.addEventListener(t,n,{capture:!0,passive:l}):e.addEventListener(t,n,!0):l!==void 0?e.addEventListener(t,n,{passive:l}):e.addEventListener(t,n,!1)}function Va(e,t,n,r,l){var a=r;if((t&1)===0&&(t&2)===0&&r!==null)e:for(;;){if(r===null)return;var o=r.tag;if(o===3||o===4){var c=r.stateNode.containerInfo;if(c===l||c.nodeType===8&&c.parentNode===l)break;if(o===4)for(o=r.return;o!==null;){var p=o.tag;if((p===3||p===4)&&(p=o.stateNode.containerInfo,p===l||p.nodeType===8&&p.parentNode===l))return;o=o.return}for(;c!==null;){if(o=Mn(c),o===null)return;if(p=o.tag,p===5||p===6){r=a=o;continue e}c=c.parentNode}}r=r.return}Tn(function(){var w=a,N=tn(n),T=[];e:{var C=Xi.get(e);if(C!==void 0){var I=ja,B=e;switch(e){case"keypress":if(kl(n)===0)break e;case"keydown":case"keyup":I=Bc;break;case"focusin":B="focus",I=Pa;break;case"focusout":B="blur",I=Pa;break;case"beforeblur":case"afterblur":I=Pa;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":I=ji;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":I=zc;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":I=Wc;break;case Yi:case Ji:case Gi:I=Lc;break;case qi:I=Kc;break;case"scroll":I=jc;break;case"wheel":I=Jc;break;case"copy":case"cut":case"paste":I=Dc;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":I=zi}var V=(t&4)!==0,je=!V&&e==="scroll",v=V?C!==null?C+"Capture":null:C;V=[];for(var f=w,y;f!==null;){y=f;var L=y.stateNode;if(y.tag===5&&L!==null&&(y=L,v!==null&&(L=zn(f,v),L!=null&&V.push(Ur(f,L,y)))),je)break;f=f.return}0<V.length&&(C=new I(C,B,null,n,N),T.push({event:C,listeners:V}))}}if((t&7)===0){e:{if(C=e==="mouseover"||e==="pointerover",I=e==="mouseout"||e==="pointerout",C&&n!==kt&&(B=n.relatedTarget||n.fromElement)&&(Mn(B)||B[Wt]))break e;if((I||C)&&(C=N.window===N?N:(C=N.ownerDocument)?C.defaultView||C.parentWindow:window,I?(B=n.relatedTarget||n.toElement,I=w,B=B?Mn(B):null,B!==null&&(je=ie(B),B!==je||B.tag!==5&&B.tag!==6)&&(B=null)):(I=null,B=w),I!==B)){if(V=ji,L="onMouseLeave",v="onMouseEnter",f="mouse",(e==="pointerout"||e==="pointerover")&&(V=zi,L="onPointerLeave",v="onPointerEnter",f="pointer"),je=I==null?C:rr(I),y=B==null?C:rr(B),C=new V(L,f+"leave",I,n,N),C.target=je,C.relatedTarget=y,L=null,Mn(N)===w&&(V=new V(v,f+"enter",B,n,N),V.target=y,V.relatedTarget=je,L=V),je=L,I&&B)t:{for(V=I,v=B,f=0,y=V;y;y=tr(y))f++;for(y=0,L=v;L;L=tr(L))y++;for(;0<f-y;)V=tr(V),f--;for(;0<y-f;)v=tr(v),y--;for(;f--;){if(V===v||v!==null&&V===v.alternate)break t;V=tr(V),v=tr(v)}V=null}else V=null;I!==null&&rs(T,C,I,V,!1),B!==null&&je!==null&&rs(T,je,B,V,!0)}}e:{if(C=w?rr(w):window,I=C.nodeName&&C.nodeName.toLowerCase(),I==="select"||I==="input"&&C.type==="file")var H=nd;else if(Oi(C))if($i)H=od;else{H=ld;var W=rd}else(I=C.nodeName)&&I.toLowerCase()==="input"&&(C.type==="checkbox"||C.type==="radio")&&(H=ad);if(H&&(H=H(e,w))){Ii(T,H,n,N);break e}W&&W(e,C,w),e==="focusout"&&(W=C._wrapperState)&&W.controlled&&C.type==="number"&&vr(C,"number",C.value)}switch(W=w?rr(w):window,e){case"focusin":(Oi(W)||W.contentEditable==="true")&&(Zn=W,Ia=w,$r=null);break;case"focusout":$r=Ia=Zn=null;break;case"mousedown":$a=!0;break;case"contextmenu":case"mouseup":case"dragend":$a=!1,Qi(T,n,N);break;case"selectionchange":if(ud)break;case"keydown":case"keyup":Qi(T,n,N)}var Q;if(La)e:{switch(e){case"compositionstart":var J="onCompositionStart";break e;case"compositionend":J="onCompositionEnd";break e;case"compositionupdate":J="onCompositionUpdate";break e}J=void 0}else Xn?Ri(e,n)&&(J="onCompositionEnd"):e==="keydown"&&n.keyCode===229&&(J="onCompositionStart");J&&(Pi&&n.locale!=="ko"&&(Xn||J!=="onCompositionStart"?J==="onCompositionEnd"&&Xn&&(Q=Ci()):(cn=N,Na="value"in cn?cn.value:cn.textContent,Xn=!0)),W=Tl(w,J),0<W.length&&(J=new Ti(J,e,null,n,N),T.push({event:J,listeners:W}),Q?J.data=Q:(Q=Di(n),Q!==null&&(J.data=Q)))),(Q=qc?Xc(e,n):Zc(e,n))&&(w=Tl(w,"onBeforeInput"),0<w.length&&(N=new Ti("onBeforeInput","beforeinput",null,n,N),T.push({event:N,listeners:w}),N.data=Q))}ts(T,t)})}function Ur(e,t,n){return{instance:e,listener:t,currentTarget:n}}function Tl(e,t){for(var n=t+"Capture",r=[];e!==null;){var l=e,a=l.stateNode;l.tag===5&&a!==null&&(l=a,a=zn(e,n),a!=null&&r.unshift(Ur(e,a,l)),a=zn(e,t),a!=null&&r.push(Ur(e,a,l))),e=e.return}return r}function tr(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5);return e||null}function rs(e,t,n,r,l){for(var a=t._reactName,o=[];n!==null&&n!==r;){var c=n,p=c.alternate,w=c.stateNode;if(p!==null&&p===r)break;c.tag===5&&w!==null&&(c=w,l?(p=zn(n,a),p!=null&&o.unshift(Ur(n,p,c))):l||(p=zn(n,a),p!=null&&o.push(Ur(n,p,c)))),n=n.return}o.length!==0&&e.push({event:t,listeners:o})}var fd=/\r\n?/g,gd=/\u0000|\uFFFD/g;function ls(e){return(typeof e=="string"?e:""+e).replace(fd,`
`).replace(gd,"")}function zl(e,t,n){if(t=ls(t),ls(e)!==t&&n)throw Error(i(425))}function Pl(){}var Ha=null,Wa=null;function Qa(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var Ka=typeof setTimeout=="function"?setTimeout:void 0,md=typeof clearTimeout=="function"?clearTimeout:void 0,as=typeof Promise=="function"?Promise:void 0,hd=typeof queueMicrotask=="function"?queueMicrotask:typeof as<"u"?function(e){return as.resolve(null).then(e).catch(xd)}:Ka;function xd(e){setTimeout(function(){throw e})}function Ya(e,t){var n=t,r=0;do{var l=n.nextSibling;if(e.removeChild(n),l&&l.nodeType===8)if(n=l.data,n==="/$"){if(r===0){e.removeChild(l),Pr(t);return}r--}else n!=="$"&&n!=="$?"&&n!=="$!"||r++;n=l}while(n);Pr(t)}function pn(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?")break;if(t==="/$")return null}}return e}function os(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="$"||n==="$!"||n==="$?"){if(t===0)return e;t--}else n==="/$"&&t++}e=e.previousSibling}return null}var nr=Math.random().toString(36).slice(2),At="__reactFiber$"+nr,Br="__reactProps$"+nr,Wt="__reactContainer$"+nr,Ja="__reactEvents$"+nr,vd="__reactListeners$"+nr,yd="__reactHandles$"+nr;function Mn(e){var t=e[At];if(t)return t;for(var n=e.parentNode;n;){if(t=n[Wt]||n[At]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(e=os(e);e!==null;){if(n=e[At])return n;e=os(e)}return t}e=n,n=e.parentNode}return null}function Vr(e){return e=e[At]||e[Wt],!e||e.tag!==5&&e.tag!==6&&e.tag!==13&&e.tag!==3?null:e}function rr(e){if(e.tag===5||e.tag===6)return e.stateNode;throw Error(i(33))}function Ml(e){return e[Br]||null}var Ga=[],lr=-1;function fn(e){return{current:e}}function _e(e){0>lr||(e.current=Ga[lr],Ga[lr]=null,lr--)}function xe(e,t){lr++,Ga[lr]=e.current,e.current=t}var gn={},He=fn(gn),Ze=fn(!1),Ln=gn;function ar(e,t){var n=e.type.contextTypes;if(!n)return gn;var r=e.stateNode;if(r&&r.__reactInternalMemoizedUnmaskedChildContext===t)return r.__reactInternalMemoizedMaskedChildContext;var l={},a;for(a in n)l[a]=t[a];return r&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=t,e.__reactInternalMemoizedMaskedChildContext=l),l}function et(e){return e=e.childContextTypes,e!=null}function Ll(){_e(Ze),_e(He)}function is(e,t,n){if(He.current!==gn)throw Error(i(168));xe(He,t),xe(Ze,n)}function ss(e,t,n){var r=e.stateNode;if(t=t.childContextTypes,typeof r.getChildContext!="function")return n;r=r.getChildContext();for(var l in r)if(!(l in t))throw Error(i(108,ge(e)||"Unknown",l));return $({},n,r)}function Rl(e){return e=(e=e.stateNode)&&e.__reactInternalMemoizedMergedChildContext||gn,Ln=He.current,xe(He,e),xe(Ze,Ze.current),!0}function us(e,t,n){var r=e.stateNode;if(!r)throw Error(i(169));n?(e=ss(e,t,Ln),r.__reactInternalMemoizedMergedChildContext=e,_e(Ze),_e(He),xe(He,e)):_e(Ze),xe(Ze,n)}var Qt=null,Dl=!1,qa=!1;function cs(e){Qt===null?Qt=[e]:Qt.push(e)}function _d(e){Dl=!0,cs(e)}function mn(){if(!qa&&Qt!==null){qa=!0;var e=0,t=fe;try{var n=Qt;for(fe=1;e<n.length;e++){var r=n[e];do r=r(!0);while(r!==null)}Qt=null,Dl=!1}catch(l){throw Qt!==null&&(Qt=Qt.slice(e+1)),pi(ya,mn),l}finally{fe=t,qa=!1}}return null}var or=[],ir=0,Ol=null,Il=0,gt=[],mt=0,Rn=null,Kt=1,Yt="";function Dn(e,t){or[ir++]=Il,or[ir++]=Ol,Ol=e,Il=t}function ds(e,t,n){gt[mt++]=Kt,gt[mt++]=Yt,gt[mt++]=Rn,Rn=e;var r=Kt;e=Yt;var l=32-bt(r)-1;r&=~(1<<l),n+=1;var a=32-bt(t)+l;if(30<a){var o=l-l%5;a=(r&(1<<o)-1).toString(32),r>>=o,l-=o,Kt=1<<32-bt(t)+l|n<<l|r,Yt=a+e}else Kt=1<<a|n<<l|r,Yt=e}function Xa(e){e.return!==null&&(Dn(e,1),ds(e,1,0))}function Za(e){for(;e===Ol;)Ol=or[--ir],or[ir]=null,Il=or[--ir],or[ir]=null;for(;e===Rn;)Rn=gt[--mt],gt[mt]=null,Yt=gt[--mt],gt[mt]=null,Kt=gt[--mt],gt[mt]=null}var ut=null,ct=null,Se=!1,Ct=null;function ps(e,t){var n=yt(5,null,null,0);n.elementType="DELETED",n.stateNode=t,n.return=e,t=e.deletions,t===null?(e.deletions=[n],e.flags|=16):t.push(n)}function fs(e,t){switch(e.tag){case 5:var n=e.type;return t=t.nodeType!==1||n.toLowerCase()!==t.nodeName.toLowerCase()?null:t,t!==null?(e.stateNode=t,ut=e,ct=pn(t.firstChild),!0):!1;case 6:return t=e.pendingProps===""||t.nodeType!==3?null:t,t!==null?(e.stateNode=t,ut=e,ct=null,!0):!1;case 13:return t=t.nodeType!==8?null:t,t!==null?(n=Rn!==null?{id:Kt,overflow:Yt}:null,e.memoizedState={dehydrated:t,treeContext:n,retryLane:1073741824},n=yt(18,null,null,0),n.stateNode=t,n.return=e,e.child=n,ut=e,ct=null,!0):!1;default:return!1}}function eo(e){return(e.mode&1)!==0&&(e.flags&128)===0}function to(e){if(Se){var t=ct;if(t){var n=t;if(!fs(e,t)){if(eo(e))throw Error(i(418));t=pn(n.nextSibling);var r=ut;t&&fs(e,t)?ps(r,n):(e.flags=e.flags&-4097|2,Se=!1,ut=e)}}else{if(eo(e))throw Error(i(418));e.flags=e.flags&-4097|2,Se=!1,ut=e}}}function gs(e){for(e=e.return;e!==null&&e.tag!==5&&e.tag!==3&&e.tag!==13;)e=e.return;ut=e}function $l(e){if(e!==ut)return!1;if(!Se)return gs(e),Se=!0,!1;var t;if((t=e.tag!==3)&&!(t=e.tag!==5)&&(t=e.type,t=t!=="head"&&t!=="body"&&!Qa(e.type,e.memoizedProps)),t&&(t=ct)){if(eo(e))throw ms(),Error(i(418));for(;t;)ps(e,t),t=pn(t.nextSibling)}if(gs(e),e.tag===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(i(317));e:{for(e=e.nextSibling,t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="/$"){if(t===0){ct=pn(e.nextSibling);break e}t--}else n!=="$"&&n!=="$!"&&n!=="$?"||t++}e=e.nextSibling}ct=null}}else ct=ut?pn(e.stateNode.nextSibling):null;return!0}function ms(){for(var e=ct;e;)e=pn(e.nextSibling)}function sr(){ct=ut=null,Se=!1}function no(e){Ct===null?Ct=[e]:Ct.push(e)}var wd=we.ReactCurrentBatchConfig;function Hr(e,t,n){if(e=n.ref,e!==null&&typeof e!="function"&&typeof e!="object"){if(n._owner){if(n=n._owner,n){if(n.tag!==1)throw Error(i(309));var r=n.stateNode}if(!r)throw Error(i(147,e));var l=r,a=""+e;return t!==null&&t.ref!==null&&typeof t.ref=="function"&&t.ref._stringRef===a?t.ref:(t=function(o){var c=l.refs;o===null?delete c[a]:c[a]=o},t._stringRef=a,t)}if(typeof e!="string")throw Error(i(284));if(!n._owner)throw Error(i(290,e))}return e}function Al(e,t){throw e=Object.prototype.toString.call(t),Error(i(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e))}function hs(e){var t=e._init;return t(e._payload)}function xs(e){function t(v,f){if(e){var y=v.deletions;y===null?(v.deletions=[f],v.flags|=16):y.push(f)}}function n(v,f){if(!e)return null;for(;f!==null;)t(v,f),f=f.sibling;return null}function r(v,f){for(v=new Map;f!==null;)f.key!==null?v.set(f.key,f):v.set(f.index,f),f=f.sibling;return v}function l(v,f){return v=Sn(v,f),v.index=0,v.sibling=null,v}function a(v,f,y){return v.index=y,e?(y=v.alternate,y!==null?(y=y.index,y<f?(v.flags|=2,f):y):(v.flags|=2,f)):(v.flags|=1048576,f)}function o(v){return e&&v.alternate===null&&(v.flags|=2),v}function c(v,f,y,L){return f===null||f.tag!==6?(f=Yo(y,v.mode,L),f.return=v,f):(f=l(f,y),f.return=v,f)}function p(v,f,y,L){var H=y.type;return H===ze?N(v,f,y.props.children,L,y.key):f!==null&&(f.elementType===H||typeof H=="object"&&H!==null&&H.$$typeof===Ae&&hs(H)===f.type)?(L=l(f,y.props),L.ref=Hr(v,f,y),L.return=v,L):(L=ua(y.type,y.key,y.props,null,v.mode,L),L.ref=Hr(v,f,y),L.return=v,L)}function w(v,f,y,L){return f===null||f.tag!==4||f.stateNode.containerInfo!==y.containerInfo||f.stateNode.implementation!==y.implementation?(f=Jo(y,v.mode,L),f.return=v,f):(f=l(f,y.children||[]),f.return=v,f)}function N(v,f,y,L,H){return f===null||f.tag!==7?(f=Vn(y,v.mode,L,H),f.return=v,f):(f=l(f,y),f.return=v,f)}function T(v,f,y){if(typeof f=="string"&&f!==""||typeof f=="number")return f=Yo(""+f,v.mode,y),f.return=v,f;if(typeof f=="object"&&f!==null){switch(f.$$typeof){case Y:return y=ua(f.type,f.key,f.props,null,v.mode,y),y.ref=Hr(v,null,f),y.return=v,y;case ce:return f=Jo(f,v.mode,y),f.return=v,f;case Ae:var L=f._init;return T(v,L(f._payload),y)}if(Zt(f)||K(f))return f=Vn(f,v.mode,y,null),f.return=v,f;Al(v,f)}return null}function C(v,f,y,L){var H=f!==null?f.key:null;if(typeof y=="string"&&y!==""||typeof y=="number")return H!==null?null:c(v,f,""+y,L);if(typeof y=="object"&&y!==null){switch(y.$$typeof){case Y:return y.key===H?p(v,f,y,L):null;case ce:return y.key===H?w(v,f,y,L):null;case Ae:return H=y._init,C(v,f,H(y._payload),L)}if(Zt(y)||K(y))return H!==null?null:N(v,f,y,L,null);Al(v,y)}return null}function I(v,f,y,L,H){if(typeof L=="string"&&L!==""||typeof L=="number")return v=v.get(y)||null,c(f,v,""+L,H);if(typeof L=="object"&&L!==null){switch(L.$$typeof){case Y:return v=v.get(L.key===null?y:L.key)||null,p(f,v,L,H);case ce:return v=v.get(L.key===null?y:L.key)||null,w(f,v,L,H);case Ae:var W=L._init;return I(v,f,y,W(L._payload),H)}if(Zt(L)||K(L))return v=v.get(y)||null,N(f,v,L,H,null);Al(f,L)}return null}function B(v,f,y,L){for(var H=null,W=null,Q=f,J=f=0,$e=null;Q!==null&&J<y.length;J++){Q.index>J?($e=Q,Q=null):$e=Q.sibling;var ue=C(v,Q,y[J],L);if(ue===null){Q===null&&(Q=$e);break}e&&Q&&ue.alternate===null&&t(v,Q),f=a(ue,f,J),W===null?H=ue:W.sibling=ue,W=ue,Q=$e}if(J===y.length)return n(v,Q),Se&&Dn(v,J),H;if(Q===null){for(;J<y.length;J++)Q=T(v,y[J],L),Q!==null&&(f=a(Q,f,J),W===null?H=Q:W.sibling=Q,W=Q);return Se&&Dn(v,J),H}for(Q=r(v,Q);J<y.length;J++)$e=I(Q,v,J,y[J],L),$e!==null&&(e&&$e.alternate!==null&&Q.delete($e.key===null?J:$e.key),f=a($e,f,J),W===null?H=$e:W.sibling=$e,W=$e);return e&&Q.forEach(function(bn){return t(v,bn)}),Se&&Dn(v,J),H}function V(v,f,y,L){var H=K(y);if(typeof H!="function")throw Error(i(150));if(y=H.call(y),y==null)throw Error(i(151));for(var W=H=null,Q=f,J=f=0,$e=null,ue=y.next();Q!==null&&!ue.done;J++,ue=y.next()){Q.index>J?($e=Q,Q=null):$e=Q.sibling;var bn=C(v,Q,ue.value,L);if(bn===null){Q===null&&(Q=$e);break}e&&Q&&bn.alternate===null&&t(v,Q),f=a(bn,f,J),W===null?H=bn:W.sibling=bn,W=bn,Q=$e}if(ue.done)return n(v,Q),Se&&Dn(v,J),H;if(Q===null){for(;!ue.done;J++,ue=y.next())ue=T(v,ue.value,L),ue!==null&&(f=a(ue,f,J),W===null?H=ue:W.sibling=ue,W=ue);return Se&&Dn(v,J),H}for(Q=r(v,Q);!ue.done;J++,ue=y.next())ue=I(Q,v,J,ue.value,L),ue!==null&&(e&&ue.alternate!==null&&Q.delete(ue.key===null?J:ue.key),f=a(ue,f,J),W===null?H=ue:W.sibling=ue,W=ue);return e&&Q.forEach(function(ep){return t(v,ep)}),Se&&Dn(v,J),H}function je(v,f,y,L){if(typeof y=="object"&&y!==null&&y.type===ze&&y.key===null&&(y=y.props.children),typeof y=="object"&&y!==null){switch(y.$$typeof){case Y:e:{for(var H=y.key,W=f;W!==null;){if(W.key===H){if(H=y.type,H===ze){if(W.tag===7){n(v,W.sibling),f=l(W,y.props.children),f.return=v,v=f;break e}}else if(W.elementType===H||typeof H=="object"&&H!==null&&H.$$typeof===Ae&&hs(H)===W.type){n(v,W.sibling),f=l(W,y.props),f.ref=Hr(v,W,y),f.return=v,v=f;break e}n(v,W);break}else t(v,W);W=W.sibling}y.type===ze?(f=Vn(y.props.children,v.mode,L,y.key),f.return=v,v=f):(L=ua(y.type,y.key,y.props,null,v.mode,L),L.ref=Hr(v,f,y),L.return=v,v=L)}return o(v);case ce:e:{for(W=y.key;f!==null;){if(f.key===W)if(f.tag===4&&f.stateNode.containerInfo===y.containerInfo&&f.stateNode.implementation===y.implementation){n(v,f.sibling),f=l(f,y.children||[]),f.return=v,v=f;break e}else{n(v,f);break}else t(v,f);f=f.sibling}f=Jo(y,v.mode,L),f.return=v,v=f}return o(v);case Ae:return W=y._init,je(v,f,W(y._payload),L)}if(Zt(y))return B(v,f,y,L);if(K(y))return V(v,f,y,L);Al(v,y)}return typeof y=="string"&&y!==""||typeof y=="number"?(y=""+y,f!==null&&f.tag===6?(n(v,f.sibling),f=l(f,y),f.return=v,v=f):(n(v,f),f=Yo(y,v.mode,L),f.return=v,v=f),o(v)):n(v,f)}return je}var ur=xs(!0),vs=xs(!1),Fl=fn(null),Ul=null,cr=null,ro=null;function lo(){ro=cr=Ul=null}function ao(e){var t=Fl.current;_e(Fl),e._currentValue=t}function oo(e,t,n){for(;e!==null;){var r=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,r!==null&&(r.childLanes|=t)):r!==null&&(r.childLanes&t)!==t&&(r.childLanes|=t),e===n)break;e=e.return}}function dr(e,t){Ul=e,ro=cr=null,e=e.dependencies,e!==null&&e.firstContext!==null&&((e.lanes&t)!==0&&(tt=!0),e.firstContext=null)}function ht(e){var t=e._currentValue;if(ro!==e)if(e={context:e,memoizedValue:t,next:null},cr===null){if(Ul===null)throw Error(i(308));cr=e,Ul.dependencies={lanes:0,firstContext:e}}else cr=cr.next=e;return t}var On=null;function io(e){On===null?On=[e]:On.push(e)}function ys(e,t,n,r){var l=t.interleaved;return l===null?(n.next=n,io(t)):(n.next=l.next,l.next=n),t.interleaved=n,Jt(e,r)}function Jt(e,t){e.lanes|=t;var n=e.alternate;for(n!==null&&(n.lanes|=t),n=e,e=e.return;e!==null;)e.childLanes|=t,n=e.alternate,n!==null&&(n.childLanes|=t),n=e,e=e.return;return n.tag===3?n.stateNode:null}var hn=!1;function so(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function _s(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,effects:e.effects})}function Gt(e,t){return{eventTime:e,lane:t,tag:0,payload:null,callback:null,next:null}}function xn(e,t,n){var r=e.updateQueue;if(r===null)return null;if(r=r.shared,(se&2)!==0){var l=r.pending;return l===null?t.next=t:(t.next=l.next,l.next=t),r.pending=t,Jt(e,n)}return l=r.interleaved,l===null?(t.next=t,io(r)):(t.next=l.next,l.next=t),r.interleaved=t,Jt(e,n)}function Bl(e,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,(n&4194240)!==0)){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,ka(e,n)}}function ws(e,t){var n=e.updateQueue,r=e.alternate;if(r!==null&&(r=r.updateQueue,n===r)){var l=null,a=null;if(n=n.firstBaseUpdate,n!==null){do{var o={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};a===null?l=a=o:a=a.next=o,n=n.next}while(n!==null);a===null?l=a=t:a=a.next=t}else l=a=t;n={baseState:r.baseState,firstBaseUpdate:l,lastBaseUpdate:a,shared:r.shared,effects:r.effects},e.updateQueue=n;return}e=n.lastBaseUpdate,e===null?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}function Vl(e,t,n,r){var l=e.updateQueue;hn=!1;var a=l.firstBaseUpdate,o=l.lastBaseUpdate,c=l.shared.pending;if(c!==null){l.shared.pending=null;var p=c,w=p.next;p.next=null,o===null?a=w:o.next=w,o=p;var N=e.alternate;N!==null&&(N=N.updateQueue,c=N.lastBaseUpdate,c!==o&&(c===null?N.firstBaseUpdate=w:c.next=w,N.lastBaseUpdate=p))}if(a!==null){var T=l.baseState;o=0,N=w=p=null,c=a;do{var C=c.lane,I=c.eventTime;if((r&C)===C){N!==null&&(N=N.next={eventTime:I,lane:0,tag:c.tag,payload:c.payload,callback:c.callback,next:null});e:{var B=e,V=c;switch(C=t,I=n,V.tag){case 1:if(B=V.payload,typeof B=="function"){T=B.call(I,T,C);break e}T=B;break e;case 3:B.flags=B.flags&-65537|128;case 0:if(B=V.payload,C=typeof B=="function"?B.call(I,T,C):B,C==null)break e;T=$({},T,C);break e;case 2:hn=!0}}c.callback!==null&&c.lane!==0&&(e.flags|=64,C=l.effects,C===null?l.effects=[c]:C.push(c))}else I={eventTime:I,lane:C,tag:c.tag,payload:c.payload,callback:c.callback,next:null},N===null?(w=N=I,p=T):N=N.next=I,o|=C;if(c=c.next,c===null){if(c=l.shared.pending,c===null)break;C=c,c=C.next,C.next=null,l.lastBaseUpdate=C,l.shared.pending=null}}while(!0);if(N===null&&(p=T),l.baseState=p,l.firstBaseUpdate=w,l.lastBaseUpdate=N,t=l.shared.interleaved,t!==null){l=t;do o|=l.lane,l=l.next;while(l!==t)}else a===null&&(l.shared.lanes=0);An|=o,e.lanes=o,e.memoizedState=T}}function ks(e,t,n){if(e=t.effects,t.effects=null,e!==null)for(t=0;t<e.length;t++){var r=e[t],l=r.callback;if(l!==null){if(r.callback=null,r=n,typeof l!="function")throw Error(i(191,l));l.call(r)}}}var Wr={},Ft=fn(Wr),Qr=fn(Wr),Kr=fn(Wr);function In(e){if(e===Wr)throw Error(i(174));return e}function uo(e,t){switch(xe(Kr,t),xe(Qr,e),xe(Ft,Wr),e=t.nodeType,e){case 9:case 11:t=(t=t.documentElement)?t.namespaceURI:Yn(null,"");break;default:e=e===8?t.parentNode:t,t=e.namespaceURI||null,e=e.tagName,t=Yn(t,e)}_e(Ft),xe(Ft,t)}function pr(){_e(Ft),_e(Qr),_e(Kr)}function Ss(e){In(Kr.current);var t=In(Ft.current),n=Yn(t,e.type);t!==n&&(xe(Qr,e),xe(Ft,n))}function co(e){Qr.current===e&&(_e(Ft),_e(Qr))}var be=fn(0);function Hl(e){for(var t=e;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||n.data==="$?"||n.data==="$!"))return t}else if(t.tag===19&&t.memoizedProps.revealOrder!==void 0){if((t.flags&128)!==0)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var po=[];function fo(){for(var e=0;e<po.length;e++)po[e]._workInProgressVersionPrimary=null;po.length=0}var Wl=we.ReactCurrentDispatcher,go=we.ReactCurrentBatchConfig,$n=0,Ee=null,Le=null,Oe=null,Ql=!1,Yr=!1,Jr=0,kd=0;function We(){throw Error(i(321))}function mo(e,t){if(t===null)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!Et(e[n],t[n]))return!1;return!0}function ho(e,t,n,r,l,a){if($n=a,Ee=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,Wl.current=e===null||e.memoizedState===null?Cd:Nd,e=n(r,l),Yr){a=0;do{if(Yr=!1,Jr=0,25<=a)throw Error(i(301));a+=1,Oe=Le=null,t.updateQueue=null,Wl.current=jd,e=n(r,l)}while(Yr)}if(Wl.current=Jl,t=Le!==null&&Le.next!==null,$n=0,Oe=Le=Ee=null,Ql=!1,t)throw Error(i(300));return e}function xo(){var e=Jr!==0;return Jr=0,e}function Ut(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Oe===null?Ee.memoizedState=Oe=e:Oe=Oe.next=e,Oe}function xt(){if(Le===null){var e=Ee.alternate;e=e!==null?e.memoizedState:null}else e=Le.next;var t=Oe===null?Ee.memoizedState:Oe.next;if(t!==null)Oe=t,Le=e;else{if(e===null)throw Error(i(310));Le=e,e={memoizedState:Le.memoizedState,baseState:Le.baseState,baseQueue:Le.baseQueue,queue:Le.queue,next:null},Oe===null?Ee.memoizedState=Oe=e:Oe=Oe.next=e}return Oe}function Gr(e,t){return typeof t=="function"?t(e):t}function vo(e){var t=xt(),n=t.queue;if(n===null)throw Error(i(311));n.lastRenderedReducer=e;var r=Le,l=r.baseQueue,a=n.pending;if(a!==null){if(l!==null){var o=l.next;l.next=a.next,a.next=o}r.baseQueue=l=a,n.pending=null}if(l!==null){a=l.next,r=r.baseState;var c=o=null,p=null,w=a;do{var N=w.lane;if(($n&N)===N)p!==null&&(p=p.next={lane:0,action:w.action,hasEagerState:w.hasEagerState,eagerState:w.eagerState,next:null}),r=w.hasEagerState?w.eagerState:e(r,w.action);else{var T={lane:N,action:w.action,hasEagerState:w.hasEagerState,eagerState:w.eagerState,next:null};p===null?(c=p=T,o=r):p=p.next=T,Ee.lanes|=N,An|=N}w=w.next}while(w!==null&&w!==a);p===null?o=r:p.next=c,Et(r,t.memoizedState)||(tt=!0),t.memoizedState=r,t.baseState=o,t.baseQueue=p,n.lastRenderedState=r}if(e=n.interleaved,e!==null){l=e;do a=l.lane,Ee.lanes|=a,An|=a,l=l.next;while(l!==e)}else l===null&&(n.lanes=0);return[t.memoizedState,n.dispatch]}function yo(e){var t=xt(),n=t.queue;if(n===null)throw Error(i(311));n.lastRenderedReducer=e;var r=n.dispatch,l=n.pending,a=t.memoizedState;if(l!==null){n.pending=null;var o=l=l.next;do a=e(a,o.action),o=o.next;while(o!==l);Et(a,t.memoizedState)||(tt=!0),t.memoizedState=a,t.baseQueue===null&&(t.baseState=a),n.lastRenderedState=a}return[a,r]}function bs(){}function Es(e,t){var n=Ee,r=xt(),l=t(),a=!Et(r.memoizedState,l);if(a&&(r.memoizedState=l,tt=!0),r=r.queue,_o(js.bind(null,n,r,e),[e]),r.getSnapshot!==t||a||Oe!==null&&Oe.memoizedState.tag&1){if(n.flags|=2048,qr(9,Ns.bind(null,n,r,l,t),void 0,null),Ie===null)throw Error(i(349));($n&30)!==0||Cs(n,t,l)}return l}function Cs(e,t,n){e.flags|=16384,e={getSnapshot:t,value:n},t=Ee.updateQueue,t===null?(t={lastEffect:null,stores:null},Ee.updateQueue=t,t.stores=[e]):(n=t.stores,n===null?t.stores=[e]:n.push(e))}function Ns(e,t,n,r){t.value=n,t.getSnapshot=r,Ts(t)&&zs(e)}function js(e,t,n){return n(function(){Ts(t)&&zs(e)})}function Ts(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!Et(e,n)}catch{return!0}}function zs(e){var t=Jt(e,1);t!==null&&zt(t,e,1,-1)}function Ps(e){var t=Ut();return typeof e=="function"&&(e=e()),t.memoizedState=t.baseState=e,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Gr,lastRenderedState:e},t.queue=e,e=e.dispatch=Ed.bind(null,Ee,e),[t.memoizedState,e]}function qr(e,t,n,r){return e={tag:e,create:t,destroy:n,deps:r,next:null},t=Ee.updateQueue,t===null?(t={lastEffect:null,stores:null},Ee.updateQueue=t,t.lastEffect=e.next=e):(n=t.lastEffect,n===null?t.lastEffect=e.next=e:(r=n.next,n.next=e,e.next=r,t.lastEffect=e)),e}function Ms(){return xt().memoizedState}function Kl(e,t,n,r){var l=Ut();Ee.flags|=e,l.memoizedState=qr(1|t,n,void 0,r===void 0?null:r)}function Yl(e,t,n,r){var l=xt();r=r===void 0?null:r;var a=void 0;if(Le!==null){var o=Le.memoizedState;if(a=o.destroy,r!==null&&mo(r,o.deps)){l.memoizedState=qr(t,n,a,r);return}}Ee.flags|=e,l.memoizedState=qr(1|t,n,a,r)}function Ls(e,t){return Kl(8390656,8,e,t)}function _o(e,t){return Yl(2048,8,e,t)}function Rs(e,t){return Yl(4,2,e,t)}function Ds(e,t){return Yl(4,4,e,t)}function Os(e,t){if(typeof t=="function")return e=e(),t(e),function(){t(null)};if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function Is(e,t,n){return n=n!=null?n.concat([e]):null,Yl(4,4,Os.bind(null,t,e),n)}function wo(){}function $s(e,t){var n=xt();t=t===void 0?null:t;var r=n.memoizedState;return r!==null&&t!==null&&mo(t,r[1])?r[0]:(n.memoizedState=[e,t],e)}function As(e,t){var n=xt();t=t===void 0?null:t;var r=n.memoizedState;return r!==null&&t!==null&&mo(t,r[1])?r[0]:(e=e(),n.memoizedState=[e,t],e)}function Fs(e,t,n){return($n&21)===0?(e.baseState&&(e.baseState=!1,tt=!0),e.memoizedState=n):(Et(n,t)||(n=hi(),Ee.lanes|=n,An|=n,e.baseState=!0),t)}function Sd(e,t){var n=fe;fe=n!==0&&4>n?n:4,e(!0);var r=go.transition;go.transition={};try{e(!1),t()}finally{fe=n,go.transition=r}}function Us(){return xt().memoizedState}function bd(e,t,n){var r=wn(e);if(n={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null},Bs(e))Vs(t,n);else if(n=ys(e,t,n,r),n!==null){var l=Ge();zt(n,e,r,l),Hs(n,t,r)}}function Ed(e,t,n){var r=wn(e),l={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null};if(Bs(e))Vs(t,l);else{var a=e.alternate;if(e.lanes===0&&(a===null||a.lanes===0)&&(a=t.lastRenderedReducer,a!==null))try{var o=t.lastRenderedState,c=a(o,n);if(l.hasEagerState=!0,l.eagerState=c,Et(c,o)){var p=t.interleaved;p===null?(l.next=l,io(t)):(l.next=p.next,p.next=l),t.interleaved=l;return}}catch{}finally{}n=ys(e,t,l,r),n!==null&&(l=Ge(),zt(n,e,r,l),Hs(n,t,r))}}function Bs(e){var t=e.alternate;return e===Ee||t!==null&&t===Ee}function Vs(e,t){Yr=Ql=!0;var n=e.pending;n===null?t.next=t:(t.next=n.next,n.next=t),e.pending=t}function Hs(e,t,n){if((n&4194240)!==0){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,ka(e,n)}}var Jl={readContext:ht,useCallback:We,useContext:We,useEffect:We,useImperativeHandle:We,useInsertionEffect:We,useLayoutEffect:We,useMemo:We,useReducer:We,useRef:We,useState:We,useDebugValue:We,useDeferredValue:We,useTransition:We,useMutableSource:We,useSyncExternalStore:We,useId:We,unstable_isNewReconciler:!1},Cd={readContext:ht,useCallback:function(e,t){return Ut().memoizedState=[e,t===void 0?null:t],e},useContext:ht,useEffect:Ls,useImperativeHandle:function(e,t,n){return n=n!=null?n.concat([e]):null,Kl(4194308,4,Os.bind(null,t,e),n)},useLayoutEffect:function(e,t){return Kl(4194308,4,e,t)},useInsertionEffect:function(e,t){return Kl(4,2,e,t)},useMemo:function(e,t){var n=Ut();return t=t===void 0?null:t,e=e(),n.memoizedState=[e,t],e},useReducer:function(e,t,n){var r=Ut();return t=n!==void 0?n(t):t,r.memoizedState=r.baseState=t,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:t},r.queue=e,e=e.dispatch=bd.bind(null,Ee,e),[r.memoizedState,e]},useRef:function(e){var t=Ut();return e={current:e},t.memoizedState=e},useState:Ps,useDebugValue:wo,useDeferredValue:function(e){return Ut().memoizedState=e},useTransition:function(){var e=Ps(!1),t=e[0];return e=Sd.bind(null,e[1]),Ut().memoizedState=e,[t,e]},useMutableSource:function(){},useSyncExternalStore:function(e,t,n){var r=Ee,l=Ut();if(Se){if(n===void 0)throw Error(i(407));n=n()}else{if(n=t(),Ie===null)throw Error(i(349));($n&30)!==0||Cs(r,t,n)}l.memoizedState=n;var a={value:n,getSnapshot:t};return l.queue=a,Ls(js.bind(null,r,a,e),[e]),r.flags|=2048,qr(9,Ns.bind(null,r,a,n,t),void 0,null),n},useId:function(){var e=Ut(),t=Ie.identifierPrefix;if(Se){var n=Yt,r=Kt;n=(r&~(1<<32-bt(r)-1)).toString(32)+n,t=":"+t+"R"+n,n=Jr++,0<n&&(t+="H"+n.toString(32)),t+=":"}else n=kd++,t=":"+t+"r"+n.toString(32)+":";return e.memoizedState=t},unstable_isNewReconciler:!1},Nd={readContext:ht,useCallback:$s,useContext:ht,useEffect:_o,useImperativeHandle:Is,useInsertionEffect:Rs,useLayoutEffect:Ds,useMemo:As,useReducer:vo,useRef:Ms,useState:function(){return vo(Gr)},useDebugValue:wo,useDeferredValue:function(e){var t=xt();return Fs(t,Le.memoizedState,e)},useTransition:function(){var e=vo(Gr)[0],t=xt().memoizedState;return[e,t]},useMutableSource:bs,useSyncExternalStore:Es,useId:Us,unstable_isNewReconciler:!1},jd={readContext:ht,useCallback:$s,useContext:ht,useEffect:_o,useImperativeHandle:Is,useInsertionEffect:Rs,useLayoutEffect:Ds,useMemo:As,useReducer:yo,useRef:Ms,useState:function(){return yo(Gr)},useDebugValue:wo,useDeferredValue:function(e){var t=xt();return Le===null?t.memoizedState=e:Fs(t,Le.memoizedState,e)},useTransition:function(){var e=yo(Gr)[0],t=xt().memoizedState;return[e,t]},useMutableSource:bs,useSyncExternalStore:Es,useId:Us,unstable_isNewReconciler:!1};function Nt(e,t){if(e&&e.defaultProps){t=$({},t),e=e.defaultProps;for(var n in e)t[n]===void 0&&(t[n]=e[n]);return t}return t}function ko(e,t,n,r){t=e.memoizedState,n=n(r,t),n=n==null?t:$({},t,n),e.memoizedState=n,e.lanes===0&&(e.updateQueue.baseState=n)}var Gl={isMounted:function(e){return(e=e._reactInternals)?ie(e)===e:!1},enqueueSetState:function(e,t,n){e=e._reactInternals;var r=Ge(),l=wn(e),a=Gt(r,l);a.payload=t,n!=null&&(a.callback=n),t=xn(e,a,l),t!==null&&(zt(t,e,l,r),Bl(t,e,l))},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var r=Ge(),l=wn(e),a=Gt(r,l);a.tag=1,a.payload=t,n!=null&&(a.callback=n),t=xn(e,a,l),t!==null&&(zt(t,e,l,r),Bl(t,e,l))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=Ge(),r=wn(e),l=Gt(n,r);l.tag=2,t!=null&&(l.callback=t),t=xn(e,l,r),t!==null&&(zt(t,e,r,n),Bl(t,e,r))}};function Ws(e,t,n,r,l,a,o){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(r,a,o):t.prototype&&t.prototype.isPureReactComponent?!Ir(n,r)||!Ir(l,a):!0}function Qs(e,t,n){var r=!1,l=gn,a=t.contextType;return typeof a=="object"&&a!==null?a=ht(a):(l=et(t)?Ln:He.current,r=t.contextTypes,a=(r=r!=null)?ar(e,l):gn),t=new t(n,a),e.memoizedState=t.state!==null&&t.state!==void 0?t.state:null,t.updater=Gl,e.stateNode=t,t._reactInternals=e,r&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=l,e.__reactInternalMemoizedMaskedChildContext=a),t}function Ks(e,t,n,r){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(n,r),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(n,r),t.state!==e&&Gl.enqueueReplaceState(t,t.state,null)}function So(e,t,n,r){var l=e.stateNode;l.props=n,l.state=e.memoizedState,l.refs={},so(e);var a=t.contextType;typeof a=="object"&&a!==null?l.context=ht(a):(a=et(t)?Ln:He.current,l.context=ar(e,a)),l.state=e.memoizedState,a=t.getDerivedStateFromProps,typeof a=="function"&&(ko(e,t,a,n),l.state=e.memoizedState),typeof t.getDerivedStateFromProps=="function"||typeof l.getSnapshotBeforeUpdate=="function"||typeof l.UNSAFE_componentWillMount!="function"&&typeof l.componentWillMount!="function"||(t=l.state,typeof l.componentWillMount=="function"&&l.componentWillMount(),typeof l.UNSAFE_componentWillMount=="function"&&l.UNSAFE_componentWillMount(),t!==l.state&&Gl.enqueueReplaceState(l,l.state,null),Vl(e,n,l,r),l.state=e.memoizedState),typeof l.componentDidMount=="function"&&(e.flags|=4194308)}function fr(e,t){try{var n="",r=t;do n+=le(r),r=r.return;while(r);var l=n}catch(a){l=`
Error generating stack: `+a.message+`
`+a.stack}return{value:e,source:t,stack:l,digest:null}}function bo(e,t,n){return{value:e,source:null,stack:n??null,digest:t??null}}function Eo(e,t){try{console.error(t.value)}catch(n){setTimeout(function(){throw n})}}var Td=typeof WeakMap=="function"?WeakMap:Map;function Ys(e,t,n){n=Gt(-1,n),n.tag=3,n.payload={element:null};var r=t.value;return n.callback=function(){ra||(ra=!0,Fo=r),Eo(e,t)},n}function Js(e,t,n){n=Gt(-1,n),n.tag=3;var r=e.type.getDerivedStateFromError;if(typeof r=="function"){var l=t.value;n.payload=function(){return r(l)},n.callback=function(){Eo(e,t)}}var a=e.stateNode;return a!==null&&typeof a.componentDidCatch=="function"&&(n.callback=function(){Eo(e,t),typeof r!="function"&&(yn===null?yn=new Set([this]):yn.add(this));var o=t.stack;this.componentDidCatch(t.value,{componentStack:o!==null?o:""})}),n}function Gs(e,t,n){var r=e.pingCache;if(r===null){r=e.pingCache=new Td;var l=new Set;r.set(t,l)}else l=r.get(t),l===void 0&&(l=new Set,r.set(t,l));l.has(n)||(l.add(n),e=Vd.bind(null,e,t,n),t.then(e,e))}function qs(e){do{var t;if((t=e.tag===13)&&(t=e.memoizedState,t=t!==null?t.dehydrated!==null:!0),t)return e;e=e.return}while(e!==null);return null}function Xs(e,t,n,r,l){return(e.mode&1)===0?(e===t?e.flags|=65536:(e.flags|=128,n.flags|=131072,n.flags&=-52805,n.tag===1&&(n.alternate===null?n.tag=17:(t=Gt(-1,1),t.tag=2,xn(n,t,1))),n.lanes|=1),e):(e.flags|=65536,e.lanes=l,e)}var zd=we.ReactCurrentOwner,tt=!1;function Je(e,t,n,r){t.child=e===null?vs(t,null,n,r):ur(t,e.child,n,r)}function Zs(e,t,n,r,l){n=n.render;var a=t.ref;return dr(t,l),r=ho(e,t,n,r,a,l),n=xo(),e!==null&&!tt?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~l,qt(e,t,l)):(Se&&n&&Xa(t),t.flags|=1,Je(e,t,r,l),t.child)}function eu(e,t,n,r,l){if(e===null){var a=n.type;return typeof a=="function"&&!Ko(a)&&a.defaultProps===void 0&&n.compare===null&&n.defaultProps===void 0?(t.tag=15,t.type=a,tu(e,t,a,r,l)):(e=ua(n.type,null,r,t,t.mode,l),e.ref=t.ref,e.return=t,t.child=e)}if(a=e.child,(e.lanes&l)===0){var o=a.memoizedProps;if(n=n.compare,n=n!==null?n:Ir,n(o,r)&&e.ref===t.ref)return qt(e,t,l)}return t.flags|=1,e=Sn(a,r),e.ref=t.ref,e.return=t,t.child=e}function tu(e,t,n,r,l){if(e!==null){var a=e.memoizedProps;if(Ir(a,r)&&e.ref===t.ref)if(tt=!1,t.pendingProps=r=a,(e.lanes&l)!==0)(e.flags&131072)!==0&&(tt=!0);else return t.lanes=e.lanes,qt(e,t,l)}return Co(e,t,n,r,l)}function nu(e,t,n){var r=t.pendingProps,l=r.children,a=e!==null?e.memoizedState:null;if(r.mode==="hidden")if((t.mode&1)===0)t.memoizedState={baseLanes:0,cachePool:null,transitions:null},xe(mr,dt),dt|=n;else{if((n&1073741824)===0)return e=a!==null?a.baseLanes|n:n,t.lanes=t.childLanes=1073741824,t.memoizedState={baseLanes:e,cachePool:null,transitions:null},t.updateQueue=null,xe(mr,dt),dt|=e,null;t.memoizedState={baseLanes:0,cachePool:null,transitions:null},r=a!==null?a.baseLanes:n,xe(mr,dt),dt|=r}else a!==null?(r=a.baseLanes|n,t.memoizedState=null):r=n,xe(mr,dt),dt|=r;return Je(e,t,l,n),t.child}function ru(e,t){var n=t.ref;(e===null&&n!==null||e!==null&&e.ref!==n)&&(t.flags|=512,t.flags|=2097152)}function Co(e,t,n,r,l){var a=et(n)?Ln:He.current;return a=ar(t,a),dr(t,l),n=ho(e,t,n,r,a,l),r=xo(),e!==null&&!tt?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~l,qt(e,t,l)):(Se&&r&&Xa(t),t.flags|=1,Je(e,t,n,l),t.child)}function lu(e,t,n,r,l){if(et(n)){var a=!0;Rl(t)}else a=!1;if(dr(t,l),t.stateNode===null)Xl(e,t),Qs(t,n,r),So(t,n,r,l),r=!0;else if(e===null){var o=t.stateNode,c=t.memoizedProps;o.props=c;var p=o.context,w=n.contextType;typeof w=="object"&&w!==null?w=ht(w):(w=et(n)?Ln:He.current,w=ar(t,w));var N=n.getDerivedStateFromProps,T=typeof N=="function"||typeof o.getSnapshotBeforeUpdate=="function";T||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(c!==r||p!==w)&&Ks(t,o,r,w),hn=!1;var C=t.memoizedState;o.state=C,Vl(t,r,o,l),p=t.memoizedState,c!==r||C!==p||Ze.current||hn?(typeof N=="function"&&(ko(t,n,N,r),p=t.memoizedState),(c=hn||Ws(t,n,c,r,C,p,w))?(T||typeof o.UNSAFE_componentWillMount!="function"&&typeof o.componentWillMount!="function"||(typeof o.componentWillMount=="function"&&o.componentWillMount(),typeof o.UNSAFE_componentWillMount=="function"&&o.UNSAFE_componentWillMount()),typeof o.componentDidMount=="function"&&(t.flags|=4194308)):(typeof o.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=r,t.memoizedState=p),o.props=r,o.state=p,o.context=w,r=c):(typeof o.componentDidMount=="function"&&(t.flags|=4194308),r=!1)}else{o=t.stateNode,_s(e,t),c=t.memoizedProps,w=t.type===t.elementType?c:Nt(t.type,c),o.props=w,T=t.pendingProps,C=o.context,p=n.contextType,typeof p=="object"&&p!==null?p=ht(p):(p=et(n)?Ln:He.current,p=ar(t,p));var I=n.getDerivedStateFromProps;(N=typeof I=="function"||typeof o.getSnapshotBeforeUpdate=="function")||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(c!==T||C!==p)&&Ks(t,o,r,p),hn=!1,C=t.memoizedState,o.state=C,Vl(t,r,o,l);var B=t.memoizedState;c!==T||C!==B||Ze.current||hn?(typeof I=="function"&&(ko(t,n,I,r),B=t.memoizedState),(w=hn||Ws(t,n,w,r,C,B,p)||!1)?(N||typeof o.UNSAFE_componentWillUpdate!="function"&&typeof o.componentWillUpdate!="function"||(typeof o.componentWillUpdate=="function"&&o.componentWillUpdate(r,B,p),typeof o.UNSAFE_componentWillUpdate=="function"&&o.UNSAFE_componentWillUpdate(r,B,p)),typeof o.componentDidUpdate=="function"&&(t.flags|=4),typeof o.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof o.componentDidUpdate!="function"||c===e.memoizedProps&&C===e.memoizedState||(t.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||c===e.memoizedProps&&C===e.memoizedState||(t.flags|=1024),t.memoizedProps=r,t.memoizedState=B),o.props=r,o.state=B,o.context=p,r=w):(typeof o.componentDidUpdate!="function"||c===e.memoizedProps&&C===e.memoizedState||(t.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||c===e.memoizedProps&&C===e.memoizedState||(t.flags|=1024),r=!1)}return No(e,t,n,r,a,l)}function No(e,t,n,r,l,a){ru(e,t);var o=(t.flags&128)!==0;if(!r&&!o)return l&&us(t,n,!1),qt(e,t,a);r=t.stateNode,zd.current=t;var c=o&&typeof n.getDerivedStateFromError!="function"?null:r.render();return t.flags|=1,e!==null&&o?(t.child=ur(t,e.child,null,a),t.child=ur(t,null,c,a)):Je(e,t,c,a),t.memoizedState=r.state,l&&us(t,n,!0),t.child}function au(e){var t=e.stateNode;t.pendingContext?is(e,t.pendingContext,t.pendingContext!==t.context):t.context&&is(e,t.context,!1),uo(e,t.containerInfo)}function ou(e,t,n,r,l){return sr(),no(l),t.flags|=256,Je(e,t,n,r),t.child}var jo={dehydrated:null,treeContext:null,retryLane:0};function To(e){return{baseLanes:e,cachePool:null,transitions:null}}function iu(e,t,n){var r=t.pendingProps,l=be.current,a=!1,o=(t.flags&128)!==0,c;if((c=o)||(c=e!==null&&e.memoizedState===null?!1:(l&2)!==0),c?(a=!0,t.flags&=-129):(e===null||e.memoizedState!==null)&&(l|=1),xe(be,l&1),e===null)return to(t),e=t.memoizedState,e!==null&&(e=e.dehydrated,e!==null)?((t.mode&1)===0?t.lanes=1:e.data==="$!"?t.lanes=8:t.lanes=1073741824,null):(o=r.children,e=r.fallback,a?(r=t.mode,a=t.child,o={mode:"hidden",children:o},(r&1)===0&&a!==null?(a.childLanes=0,a.pendingProps=o):a=ca(o,r,0,null),e=Vn(e,r,n,null),a.return=t,e.return=t,a.sibling=e,t.child=a,t.child.memoizedState=To(n),t.memoizedState=jo,e):zo(t,o));if(l=e.memoizedState,l!==null&&(c=l.dehydrated,c!==null))return Pd(e,t,o,r,c,l,n);if(a){a=r.fallback,o=t.mode,l=e.child,c=l.sibling;var p={mode:"hidden",children:r.children};return(o&1)===0&&t.child!==l?(r=t.child,r.childLanes=0,r.pendingProps=p,t.deletions=null):(r=Sn(l,p),r.subtreeFlags=l.subtreeFlags&14680064),c!==null?a=Sn(c,a):(a=Vn(a,o,n,null),a.flags|=2),a.return=t,r.return=t,r.sibling=a,t.child=r,r=a,a=t.child,o=e.child.memoizedState,o=o===null?To(n):{baseLanes:o.baseLanes|n,cachePool:null,transitions:o.transitions},a.memoizedState=o,a.childLanes=e.childLanes&~n,t.memoizedState=jo,r}return a=e.child,e=a.sibling,r=Sn(a,{mode:"visible",children:r.children}),(t.mode&1)===0&&(r.lanes=n),r.return=t,r.sibling=null,e!==null&&(n=t.deletions,n===null?(t.deletions=[e],t.flags|=16):n.push(e)),t.child=r,t.memoizedState=null,r}function zo(e,t){return t=ca({mode:"visible",children:t},e.mode,0,null),t.return=e,e.child=t}function ql(e,t,n,r){return r!==null&&no(r),ur(t,e.child,null,n),e=zo(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function Pd(e,t,n,r,l,a,o){if(n)return t.flags&256?(t.flags&=-257,r=bo(Error(i(422))),ql(e,t,o,r)):t.memoizedState!==null?(t.child=e.child,t.flags|=128,null):(a=r.fallback,l=t.mode,r=ca({mode:"visible",children:r.children},l,0,null),a=Vn(a,l,o,null),a.flags|=2,r.return=t,a.return=t,r.sibling=a,t.child=r,(t.mode&1)!==0&&ur(t,e.child,null,o),t.child.memoizedState=To(o),t.memoizedState=jo,a);if((t.mode&1)===0)return ql(e,t,o,null);if(l.data==="$!"){if(r=l.nextSibling&&l.nextSibling.dataset,r)var c=r.dgst;return r=c,a=Error(i(419)),r=bo(a,r,void 0),ql(e,t,o,r)}if(c=(o&e.childLanes)!==0,tt||c){if(r=Ie,r!==null){switch(o&-o){case 4:l=2;break;case 16:l=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:l=32;break;case 536870912:l=268435456;break;default:l=0}l=(l&(r.suspendedLanes|o))!==0?0:l,l!==0&&l!==a.retryLane&&(a.retryLane=l,Jt(e,l),zt(r,e,l,-1))}return Qo(),r=bo(Error(i(421))),ql(e,t,o,r)}return l.data==="$?"?(t.flags|=128,t.child=e.child,t=Hd.bind(null,e),l._reactRetry=t,null):(e=a.treeContext,ct=pn(l.nextSibling),ut=t,Se=!0,Ct=null,e!==null&&(gt[mt++]=Kt,gt[mt++]=Yt,gt[mt++]=Rn,Kt=e.id,Yt=e.overflow,Rn=t),t=zo(t,r.children),t.flags|=4096,t)}function su(e,t,n){e.lanes|=t;var r=e.alternate;r!==null&&(r.lanes|=t),oo(e.return,t,n)}function Po(e,t,n,r,l){var a=e.memoizedState;a===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:r,tail:n,tailMode:l}:(a.isBackwards=t,a.rendering=null,a.renderingStartTime=0,a.last=r,a.tail=n,a.tailMode=l)}function uu(e,t,n){var r=t.pendingProps,l=r.revealOrder,a=r.tail;if(Je(e,t,r.children,n),r=be.current,(r&2)!==0)r=r&1|2,t.flags|=128;else{if(e!==null&&(e.flags&128)!==0)e:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&su(e,n,t);else if(e.tag===19)su(e,n,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}r&=1}if(xe(be,r),(t.mode&1)===0)t.memoizedState=null;else switch(l){case"forwards":for(n=t.child,l=null;n!==null;)e=n.alternate,e!==null&&Hl(e)===null&&(l=n),n=n.sibling;n=l,n===null?(l=t.child,t.child=null):(l=n.sibling,n.sibling=null),Po(t,!1,l,n,a);break;case"backwards":for(n=null,l=t.child,t.child=null;l!==null;){if(e=l.alternate,e!==null&&Hl(e)===null){t.child=l;break}e=l.sibling,l.sibling=n,n=l,l=e}Po(t,!0,n,null,a);break;case"together":Po(t,!1,null,null,void 0);break;default:t.memoizedState=null}return t.child}function Xl(e,t){(t.mode&1)===0&&e!==null&&(e.alternate=null,t.alternate=null,t.flags|=2)}function qt(e,t,n){if(e!==null&&(t.dependencies=e.dependencies),An|=t.lanes,(n&t.childLanes)===0)return null;if(e!==null&&t.child!==e.child)throw Error(i(153));if(t.child!==null){for(e=t.child,n=Sn(e,e.pendingProps),t.child=n,n.return=t;e.sibling!==null;)e=e.sibling,n=n.sibling=Sn(e,e.pendingProps),n.return=t;n.sibling=null}return t.child}function Md(e,t,n){switch(t.tag){case 3:au(t),sr();break;case 5:Ss(t);break;case 1:et(t.type)&&Rl(t);break;case 4:uo(t,t.stateNode.containerInfo);break;case 10:var r=t.type._context,l=t.memoizedProps.value;xe(Fl,r._currentValue),r._currentValue=l;break;case 13:if(r=t.memoizedState,r!==null)return r.dehydrated!==null?(xe(be,be.current&1),t.flags|=128,null):(n&t.child.childLanes)!==0?iu(e,t,n):(xe(be,be.current&1),e=qt(e,t,n),e!==null?e.sibling:null);xe(be,be.current&1);break;case 19:if(r=(n&t.childLanes)!==0,(e.flags&128)!==0){if(r)return uu(e,t,n);t.flags|=128}if(l=t.memoizedState,l!==null&&(l.rendering=null,l.tail=null,l.lastEffect=null),xe(be,be.current),r)break;return null;case 22:case 23:return t.lanes=0,nu(e,t,n)}return qt(e,t,n)}var cu,Mo,du,pu;cu=function(e,t){for(var n=t.child;n!==null;){if(n.tag===5||n.tag===6)e.appendChild(n.stateNode);else if(n.tag!==4&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===t)break;for(;n.sibling===null;){if(n.return===null||n.return===t)return;n=n.return}n.sibling.return=n.return,n=n.sibling}},Mo=function(){},du=function(e,t,n,r){var l=e.memoizedProps;if(l!==r){e=t.stateNode,In(Ft.current);var a=null;switch(n){case"input":l=Lt(e,l),r=Lt(e,r),a=[];break;case"select":l=$({},l,{value:void 0}),r=$({},r,{value:void 0}),a=[];break;case"textarea":l=en(e,l),r=en(e,r),a=[];break;default:typeof l.onClick!="function"&&typeof r.onClick=="function"&&(e.onclick=Pl)}Nn(n,r);var o;n=null;for(w in l)if(!r.hasOwnProperty(w)&&l.hasOwnProperty(w)&&l[w]!=null)if(w==="style"){var c=l[w];for(o in c)c.hasOwnProperty(o)&&(n||(n={}),n[o]="")}else w!=="dangerouslySetInnerHTML"&&w!=="children"&&w!=="suppressContentEditableWarning"&&w!=="suppressHydrationWarning"&&w!=="autoFocus"&&(g.hasOwnProperty(w)?a||(a=[]):(a=a||[]).push(w,null));for(w in r){var p=r[w];if(c=l!=null?l[w]:void 0,r.hasOwnProperty(w)&&p!==c&&(p!=null||c!=null))if(w==="style")if(c){for(o in c)!c.hasOwnProperty(o)||p&&p.hasOwnProperty(o)||(n||(n={}),n[o]="");for(o in p)p.hasOwnProperty(o)&&c[o]!==p[o]&&(n||(n={}),n[o]=p[o])}else n||(a||(a=[]),a.push(w,n)),n=p;else w==="dangerouslySetInnerHTML"?(p=p?p.__html:void 0,c=c?c.__html:void 0,p!=null&&c!==p&&(a=a||[]).push(w,p)):w==="children"?typeof p!="string"&&typeof p!="number"||(a=a||[]).push(w,""+p):w!=="suppressContentEditableWarning"&&w!=="suppressHydrationWarning"&&(g.hasOwnProperty(w)?(p!=null&&w==="onScroll"&&ye("scroll",e),a||c===p||(a=[])):(a=a||[]).push(w,p))}n&&(a=a||[]).push("style",n);var w=a;(t.updateQueue=w)&&(t.flags|=4)}},pu=function(e,t,n,r){n!==r&&(t.flags|=4)};function Xr(e,t){if(!Se)switch(e.tailMode){case"hidden":t=e.tail;for(var n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?e.tail=null:n.sibling=null;break;case"collapsed":n=e.tail;for(var r=null;n!==null;)n.alternate!==null&&(r=n),n=n.sibling;r===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:r.sibling=null}}function Qe(e){var t=e.alternate!==null&&e.alternate.child===e.child,n=0,r=0;if(t)for(var l=e.child;l!==null;)n|=l.lanes|l.childLanes,r|=l.subtreeFlags&14680064,r|=l.flags&14680064,l.return=e,l=l.sibling;else for(l=e.child;l!==null;)n|=l.lanes|l.childLanes,r|=l.subtreeFlags,r|=l.flags,l.return=e,l=l.sibling;return e.subtreeFlags|=r,e.childLanes=n,t}function Ld(e,t,n){var r=t.pendingProps;switch(Za(t),t.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Qe(t),null;case 1:return et(t.type)&&Ll(),Qe(t),null;case 3:return r=t.stateNode,pr(),_e(Ze),_e(He),fo(),r.pendingContext&&(r.context=r.pendingContext,r.pendingContext=null),(e===null||e.child===null)&&($l(t)?t.flags|=4:e===null||e.memoizedState.isDehydrated&&(t.flags&256)===0||(t.flags|=1024,Ct!==null&&(Vo(Ct),Ct=null))),Mo(e,t),Qe(t),null;case 5:co(t);var l=In(Kr.current);if(n=t.type,e!==null&&t.stateNode!=null)du(e,t,n,r,l),e.ref!==t.ref&&(t.flags|=512,t.flags|=2097152);else{if(!r){if(t.stateNode===null)throw Error(i(166));return Qe(t),null}if(e=In(Ft.current),$l(t)){r=t.stateNode,n=t.type;var a=t.memoizedProps;switch(r[At]=t,r[Br]=a,e=(t.mode&1)!==0,n){case"dialog":ye("cancel",r),ye("close",r);break;case"iframe":case"object":case"embed":ye("load",r);break;case"video":case"audio":for(l=0;l<Ar.length;l++)ye(Ar[l],r);break;case"source":ye("error",r);break;case"img":case"image":case"link":ye("error",r),ye("load",r);break;case"details":ye("toggle",r);break;case"input":Wn(r,a),ye("invalid",r);break;case"select":r._wrapperState={wasMultiple:!!a.multiple},ye("invalid",r);break;case"textarea":Vt(r,a),ye("invalid",r)}Nn(n,a),l=null;for(var o in a)if(a.hasOwnProperty(o)){var c=a[o];o==="children"?typeof c=="string"?r.textContent!==c&&(a.suppressHydrationWarning!==!0&&zl(r.textContent,c,e),l=["children",c]):typeof c=="number"&&r.textContent!==""+c&&(a.suppressHydrationWarning!==!0&&zl(r.textContent,c,e),l=["children",""+c]):g.hasOwnProperty(o)&&c!=null&&o==="onScroll"&&ye("scroll",r)}switch(n){case"input":Mt(r),Cn(r,a,!0);break;case"textarea":Mt(r),it(r);break;case"select":case"option":break;default:typeof a.onClick=="function"&&(r.onclick=Pl)}r=l,t.updateQueue=r,r!==null&&(t.flags|=4)}else{o=l.nodeType===9?l:l.ownerDocument,e==="http://www.w3.org/1999/xhtml"&&(e=Kn(n)),e==="http://www.w3.org/1999/xhtml"?n==="script"?(e=o.createElement("div"),e.innerHTML="<script><\/script>",e=e.removeChild(e.firstChild)):typeof r.is=="string"?e=o.createElement(n,{is:r.is}):(e=o.createElement(n),n==="select"&&(o=e,r.multiple?o.multiple=!0:r.size&&(o.size=r.size))):e=o.createElementNS(e,n),e[At]=t,e[Br]=r,cu(e,t,!1,!1),t.stateNode=e;e:{switch(o=Jn(n,r),n){case"dialog":ye("cancel",e),ye("close",e),l=r;break;case"iframe":case"object":case"embed":ye("load",e),l=r;break;case"video":case"audio":for(l=0;l<Ar.length;l++)ye(Ar[l],e);l=r;break;case"source":ye("error",e),l=r;break;case"img":case"image":case"link":ye("error",e),ye("load",e),l=r;break;case"details":ye("toggle",e),l=r;break;case"input":Wn(e,r),l=Lt(e,r),ye("invalid",e);break;case"option":l=r;break;case"select":e._wrapperState={wasMultiple:!!r.multiple},l=$({},r,{value:void 0}),ye("invalid",e);break;case"textarea":Vt(e,r),l=en(e,r),ye("invalid",e);break;default:l=r}Nn(n,l),c=l;for(a in c)if(c.hasOwnProperty(a)){var p=c[a];a==="style"?yr(e,p):a==="dangerouslySetInnerHTML"?(p=p?p.__html:void 0,p!=null&&Ht(e,p)):a==="children"?typeof p=="string"?(n!=="textarea"||p!=="")&&It(e,p):typeof p=="number"&&It(e,""+p):a!=="suppressContentEditableWarning"&&a!=="suppressHydrationWarning"&&a!=="autoFocus"&&(g.hasOwnProperty(a)?p!=null&&a==="onScroll"&&ye("scroll",e):p!=null&&Te(e,a,p,o))}switch(n){case"input":Mt(e),Cn(e,r,!1);break;case"textarea":Mt(e),it(e);break;case"option":r.value!=null&&e.setAttribute("value",""+oe(r.value));break;case"select":e.multiple=!!r.multiple,a=r.value,a!=null?Fe(e,!!r.multiple,a,!1):r.defaultValue!=null&&Fe(e,!!r.multiple,r.defaultValue,!0);break;default:typeof l.onClick=="function"&&(e.onclick=Pl)}switch(n){case"button":case"input":case"select":case"textarea":r=!!r.autoFocus;break e;case"img":r=!0;break e;default:r=!1}}r&&(t.flags|=4)}t.ref!==null&&(t.flags|=512,t.flags|=2097152)}return Qe(t),null;case 6:if(e&&t.stateNode!=null)pu(e,t,e.memoizedProps,r);else{if(typeof r!="string"&&t.stateNode===null)throw Error(i(166));if(n=In(Kr.current),In(Ft.current),$l(t)){if(r=t.stateNode,n=t.memoizedProps,r[At]=t,(a=r.nodeValue!==n)&&(e=ut,e!==null))switch(e.tag){case 3:zl(r.nodeValue,n,(e.mode&1)!==0);break;case 5:e.memoizedProps.suppressHydrationWarning!==!0&&zl(r.nodeValue,n,(e.mode&1)!==0)}a&&(t.flags|=4)}else r=(n.nodeType===9?n:n.ownerDocument).createTextNode(r),r[At]=t,t.stateNode=r}return Qe(t),null;case 13:if(_e(be),r=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(Se&&ct!==null&&(t.mode&1)!==0&&(t.flags&128)===0)ms(),sr(),t.flags|=98560,a=!1;else if(a=$l(t),r!==null&&r.dehydrated!==null){if(e===null){if(!a)throw Error(i(318));if(a=t.memoizedState,a=a!==null?a.dehydrated:null,!a)throw Error(i(317));a[At]=t}else sr(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;Qe(t),a=!1}else Ct!==null&&(Vo(Ct),Ct=null),a=!0;if(!a)return t.flags&65536?t:null}return(t.flags&128)!==0?(t.lanes=n,t):(r=r!==null,r!==(e!==null&&e.memoizedState!==null)&&r&&(t.child.flags|=8192,(t.mode&1)!==0&&(e===null||(be.current&1)!==0?Re===0&&(Re=3):Qo())),t.updateQueue!==null&&(t.flags|=4),Qe(t),null);case 4:return pr(),Mo(e,t),e===null&&Fr(t.stateNode.containerInfo),Qe(t),null;case 10:return ao(t.type._context),Qe(t),null;case 17:return et(t.type)&&Ll(),Qe(t),null;case 19:if(_e(be),a=t.memoizedState,a===null)return Qe(t),null;if(r=(t.flags&128)!==0,o=a.rendering,o===null)if(r)Xr(a,!1);else{if(Re!==0||e!==null&&(e.flags&128)!==0)for(e=t.child;e!==null;){if(o=Hl(e),o!==null){for(t.flags|=128,Xr(a,!1),r=o.updateQueue,r!==null&&(t.updateQueue=r,t.flags|=4),t.subtreeFlags=0,r=n,n=t.child;n!==null;)a=n,e=r,a.flags&=14680066,o=a.alternate,o===null?(a.childLanes=0,a.lanes=e,a.child=null,a.subtreeFlags=0,a.memoizedProps=null,a.memoizedState=null,a.updateQueue=null,a.dependencies=null,a.stateNode=null):(a.childLanes=o.childLanes,a.lanes=o.lanes,a.child=o.child,a.subtreeFlags=0,a.deletions=null,a.memoizedProps=o.memoizedProps,a.memoizedState=o.memoizedState,a.updateQueue=o.updateQueue,a.type=o.type,e=o.dependencies,a.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext}),n=n.sibling;return xe(be,be.current&1|2),t.child}e=e.sibling}a.tail!==null&&Ne()>hr&&(t.flags|=128,r=!0,Xr(a,!1),t.lanes=4194304)}else{if(!r)if(e=Hl(o),e!==null){if(t.flags|=128,r=!0,n=e.updateQueue,n!==null&&(t.updateQueue=n,t.flags|=4),Xr(a,!0),a.tail===null&&a.tailMode==="hidden"&&!o.alternate&&!Se)return Qe(t),null}else 2*Ne()-a.renderingStartTime>hr&&n!==1073741824&&(t.flags|=128,r=!0,Xr(a,!1),t.lanes=4194304);a.isBackwards?(o.sibling=t.child,t.child=o):(n=a.last,n!==null?n.sibling=o:t.child=o,a.last=o)}return a.tail!==null?(t=a.tail,a.rendering=t,a.tail=t.sibling,a.renderingStartTime=Ne(),t.sibling=null,n=be.current,xe(be,r?n&1|2:n&1),t):(Qe(t),null);case 22:case 23:return Wo(),r=t.memoizedState!==null,e!==null&&e.memoizedState!==null!==r&&(t.flags|=8192),r&&(t.mode&1)!==0?(dt&1073741824)!==0&&(Qe(t),t.subtreeFlags&6&&(t.flags|=8192)):Qe(t),null;case 24:return null;case 25:return null}throw Error(i(156,t.tag))}function Rd(e,t){switch(Za(t),t.tag){case 1:return et(t.type)&&Ll(),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return pr(),_e(Ze),_e(He),fo(),e=t.flags,(e&65536)!==0&&(e&128)===0?(t.flags=e&-65537|128,t):null;case 5:return co(t),null;case 13:if(_e(be),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(i(340));sr()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return _e(be),null;case 4:return pr(),null;case 10:return ao(t.type._context),null;case 22:case 23:return Wo(),null;case 24:return null;default:return null}}var Zl=!1,Ke=!1,Dd=typeof WeakSet=="function"?WeakSet:Set,A=null;function gr(e,t){var n=e.ref;if(n!==null)if(typeof n=="function")try{n(null)}catch(r){Ce(e,t,r)}else n.current=null}function Lo(e,t,n){try{n()}catch(r){Ce(e,t,r)}}var fu=!1;function Od(e,t){if(Ha=yl,e=Wi(),Oa(e)){if("selectionStart"in e)var n={start:e.selectionStart,end:e.selectionEnd};else e:{n=(n=e.ownerDocument)&&n.defaultView||window;var r=n.getSelection&&n.getSelection();if(r&&r.rangeCount!==0){n=r.anchorNode;var l=r.anchorOffset,a=r.focusNode;r=r.focusOffset;try{n.nodeType,a.nodeType}catch{n=null;break e}var o=0,c=-1,p=-1,w=0,N=0,T=e,C=null;t:for(;;){for(var I;T!==n||l!==0&&T.nodeType!==3||(c=o+l),T!==a||r!==0&&T.nodeType!==3||(p=o+r),T.nodeType===3&&(o+=T.nodeValue.length),(I=T.firstChild)!==null;)C=T,T=I;for(;;){if(T===e)break t;if(C===n&&++w===l&&(c=o),C===a&&++N===r&&(p=o),(I=T.nextSibling)!==null)break;T=C,C=T.parentNode}T=I}n=c===-1||p===-1?null:{start:c,end:p}}else n=null}n=n||{start:0,end:0}}else n=null;for(Wa={focusedElem:e,selectionRange:n},yl=!1,A=t;A!==null;)if(t=A,e=t.child,(t.subtreeFlags&1028)!==0&&e!==null)e.return=t,A=e;else for(;A!==null;){t=A;try{var B=t.alternate;if((t.flags&1024)!==0)switch(t.tag){case 0:case 11:case 15:break;case 1:if(B!==null){var V=B.memoizedProps,je=B.memoizedState,v=t.stateNode,f=v.getSnapshotBeforeUpdate(t.elementType===t.type?V:Nt(t.type,V),je);v.__reactInternalSnapshotBeforeUpdate=f}break;case 3:var y=t.stateNode.containerInfo;y.nodeType===1?y.textContent="":y.nodeType===9&&y.documentElement&&y.removeChild(y.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(i(163))}}catch(L){Ce(t,t.return,L)}if(e=t.sibling,e!==null){e.return=t.return,A=e;break}A=t.return}return B=fu,fu=!1,B}function Zr(e,t,n){var r=t.updateQueue;if(r=r!==null?r.lastEffect:null,r!==null){var l=r=r.next;do{if((l.tag&e)===e){var a=l.destroy;l.destroy=void 0,a!==void 0&&Lo(t,n,a)}l=l.next}while(l!==r)}}function ea(e,t){if(t=t.updateQueue,t=t!==null?t.lastEffect:null,t!==null){var n=t=t.next;do{if((n.tag&e)===e){var r=n.create;n.destroy=r()}n=n.next}while(n!==t)}}function Ro(e){var t=e.ref;if(t!==null){var n=e.stateNode;switch(e.tag){case 5:e=n;break;default:e=n}typeof t=="function"?t(e):t.current=e}}function gu(e){var t=e.alternate;t!==null&&(e.alternate=null,gu(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&(delete t[At],delete t[Br],delete t[Ja],delete t[vd],delete t[yd])),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}function mu(e){return e.tag===5||e.tag===3||e.tag===4}function hu(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||mu(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function Do(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?n.nodeType===8?n.parentNode.insertBefore(e,t):n.insertBefore(e,t):(n.nodeType===8?(t=n.parentNode,t.insertBefore(e,n)):(t=n,t.appendChild(e)),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=Pl));else if(r!==4&&(e=e.child,e!==null))for(Do(e,t,n),e=e.sibling;e!==null;)Do(e,t,n),e=e.sibling}function Oo(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?n.insertBefore(e,t):n.appendChild(e);else if(r!==4&&(e=e.child,e!==null))for(Oo(e,t,n),e=e.sibling;e!==null;)Oo(e,t,n),e=e.sibling}var Ue=null,jt=!1;function vn(e,t,n){for(n=n.child;n!==null;)xu(e,t,n),n=n.sibling}function xu(e,t,n){if($t&&typeof $t.onCommitFiberUnmount=="function")try{$t.onCommitFiberUnmount(fl,n)}catch{}switch(n.tag){case 5:Ke||gr(n,t);case 6:var r=Ue,l=jt;Ue=null,vn(e,t,n),Ue=r,jt=l,Ue!==null&&(jt?(e=Ue,n=n.stateNode,e.nodeType===8?e.parentNode.removeChild(n):e.removeChild(n)):Ue.removeChild(n.stateNode));break;case 18:Ue!==null&&(jt?(e=Ue,n=n.stateNode,e.nodeType===8?Ya(e.parentNode,n):e.nodeType===1&&Ya(e,n),Pr(e)):Ya(Ue,n.stateNode));break;case 4:r=Ue,l=jt,Ue=n.stateNode.containerInfo,jt=!0,vn(e,t,n),Ue=r,jt=l;break;case 0:case 11:case 14:case 15:if(!Ke&&(r=n.updateQueue,r!==null&&(r=r.lastEffect,r!==null))){l=r=r.next;do{var a=l,o=a.destroy;a=a.tag,o!==void 0&&((a&2)!==0||(a&4)!==0)&&Lo(n,t,o),l=l.next}while(l!==r)}vn(e,t,n);break;case 1:if(!Ke&&(gr(n,t),r=n.stateNode,typeof r.componentWillUnmount=="function"))try{r.props=n.memoizedProps,r.state=n.memoizedState,r.componentWillUnmount()}catch(c){Ce(n,t,c)}vn(e,t,n);break;case 21:vn(e,t,n);break;case 22:n.mode&1?(Ke=(r=Ke)||n.memoizedState!==null,vn(e,t,n),Ke=r):vn(e,t,n);break;default:vn(e,t,n)}}function vu(e){var t=e.updateQueue;if(t!==null){e.updateQueue=null;var n=e.stateNode;n===null&&(n=e.stateNode=new Dd),t.forEach(function(r){var l=Wd.bind(null,e,r);n.has(r)||(n.add(r),r.then(l,l))})}}function Tt(e,t){var n=t.deletions;if(n!==null)for(var r=0;r<n.length;r++){var l=n[r];try{var a=e,o=t,c=o;e:for(;c!==null;){switch(c.tag){case 5:Ue=c.stateNode,jt=!1;break e;case 3:Ue=c.stateNode.containerInfo,jt=!0;break e;case 4:Ue=c.stateNode.containerInfo,jt=!0;break e}c=c.return}if(Ue===null)throw Error(i(160));xu(a,o,l),Ue=null,jt=!1;var p=l.alternate;p!==null&&(p.return=null),l.return=null}catch(w){Ce(l,t,w)}}if(t.subtreeFlags&12854)for(t=t.child;t!==null;)yu(t,e),t=t.sibling}function yu(e,t){var n=e.alternate,r=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if(Tt(t,e),Bt(e),r&4){try{Zr(3,e,e.return),ea(3,e)}catch(V){Ce(e,e.return,V)}try{Zr(5,e,e.return)}catch(V){Ce(e,e.return,V)}}break;case 1:Tt(t,e),Bt(e),r&512&&n!==null&&gr(n,n.return);break;case 5:if(Tt(t,e),Bt(e),r&512&&n!==null&&gr(n,n.return),e.flags&32){var l=e.stateNode;try{It(l,"")}catch(V){Ce(e,e.return,V)}}if(r&4&&(l=e.stateNode,l!=null)){var a=e.memoizedProps,o=n!==null?n.memoizedProps:a,c=e.type,p=e.updateQueue;if(e.updateQueue=null,p!==null)try{c==="input"&&a.type==="radio"&&a.name!=null&&Rt(l,a),Jn(c,o);var w=Jn(c,a);for(o=0;o<p.length;o+=2){var N=p[o],T=p[o+1];N==="style"?yr(l,T):N==="dangerouslySetInnerHTML"?Ht(l,T):N==="children"?It(l,T):Te(l,N,T,w)}switch(c){case"input":Dt(l,a);break;case"textarea":Qn(l,a);break;case"select":var C=l._wrapperState.wasMultiple;l._wrapperState.wasMultiple=!!a.multiple;var I=a.value;I!=null?Fe(l,!!a.multiple,I,!1):C!==!!a.multiple&&(a.defaultValue!=null?Fe(l,!!a.multiple,a.defaultValue,!0):Fe(l,!!a.multiple,a.multiple?[]:"",!1))}l[Br]=a}catch(V){Ce(e,e.return,V)}}break;case 6:if(Tt(t,e),Bt(e),r&4){if(e.stateNode===null)throw Error(i(162));l=e.stateNode,a=e.memoizedProps;try{l.nodeValue=a}catch(V){Ce(e,e.return,V)}}break;case 3:if(Tt(t,e),Bt(e),r&4&&n!==null&&n.memoizedState.isDehydrated)try{Pr(t.containerInfo)}catch(V){Ce(e,e.return,V)}break;case 4:Tt(t,e),Bt(e);break;case 13:Tt(t,e),Bt(e),l=e.child,l.flags&8192&&(a=l.memoizedState!==null,l.stateNode.isHidden=a,!a||l.alternate!==null&&l.alternate.memoizedState!==null||(Ao=Ne())),r&4&&vu(e);break;case 22:if(N=n!==null&&n.memoizedState!==null,e.mode&1?(Ke=(w=Ke)||N,Tt(t,e),Ke=w):Tt(t,e),Bt(e),r&8192){if(w=e.memoizedState!==null,(e.stateNode.isHidden=w)&&!N&&(e.mode&1)!==0)for(A=e,N=e.child;N!==null;){for(T=A=N;A!==null;){switch(C=A,I=C.child,C.tag){case 0:case 11:case 14:case 15:Zr(4,C,C.return);break;case 1:gr(C,C.return);var B=C.stateNode;if(typeof B.componentWillUnmount=="function"){r=C,n=C.return;try{t=r,B.props=t.memoizedProps,B.state=t.memoizedState,B.componentWillUnmount()}catch(V){Ce(r,n,V)}}break;case 5:gr(C,C.return);break;case 22:if(C.memoizedState!==null){ku(T);continue}}I!==null?(I.return=C,A=I):ku(T)}N=N.sibling}e:for(N=null,T=e;;){if(T.tag===5){if(N===null){N=T;try{l=T.stateNode,w?(a=l.style,typeof a.setProperty=="function"?a.setProperty("display","none","important"):a.display="none"):(c=T.stateNode,p=T.memoizedProps.style,o=p!=null&&p.hasOwnProperty("display")?p.display:null,c.style.display=il("display",o))}catch(V){Ce(e,e.return,V)}}}else if(T.tag===6){if(N===null)try{T.stateNode.nodeValue=w?"":T.memoizedProps}catch(V){Ce(e,e.return,V)}}else if((T.tag!==22&&T.tag!==23||T.memoizedState===null||T===e)&&T.child!==null){T.child.return=T,T=T.child;continue}if(T===e)break e;for(;T.sibling===null;){if(T.return===null||T.return===e)break e;N===T&&(N=null),T=T.return}N===T&&(N=null),T.sibling.return=T.return,T=T.sibling}}break;case 19:Tt(t,e),Bt(e),r&4&&vu(e);break;case 21:break;default:Tt(t,e),Bt(e)}}function Bt(e){var t=e.flags;if(t&2){try{e:{for(var n=e.return;n!==null;){if(mu(n)){var r=n;break e}n=n.return}throw Error(i(160))}switch(r.tag){case 5:var l=r.stateNode;r.flags&32&&(It(l,""),r.flags&=-33);var a=hu(e);Oo(e,a,l);break;case 3:case 4:var o=r.stateNode.containerInfo,c=hu(e);Do(e,c,o);break;default:throw Error(i(161))}}catch(p){Ce(e,e.return,p)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function Id(e,t,n){A=e,_u(e)}function _u(e,t,n){for(var r=(e.mode&1)!==0;A!==null;){var l=A,a=l.child;if(l.tag===22&&r){var o=l.memoizedState!==null||Zl;if(!o){var c=l.alternate,p=c!==null&&c.memoizedState!==null||Ke;c=Zl;var w=Ke;if(Zl=o,(Ke=p)&&!w)for(A=l;A!==null;)o=A,p=o.child,o.tag===22&&o.memoizedState!==null?Su(l):p!==null?(p.return=o,A=p):Su(l);for(;a!==null;)A=a,_u(a),a=a.sibling;A=l,Zl=c,Ke=w}wu(e)}else(l.subtreeFlags&8772)!==0&&a!==null?(a.return=l,A=a):wu(e)}}function wu(e){for(;A!==null;){var t=A;if((t.flags&8772)!==0){var n=t.alternate;try{if((t.flags&8772)!==0)switch(t.tag){case 0:case 11:case 15:Ke||ea(5,t);break;case 1:var r=t.stateNode;if(t.flags&4&&!Ke)if(n===null)r.componentDidMount();else{var l=t.elementType===t.type?n.memoizedProps:Nt(t.type,n.memoizedProps);r.componentDidUpdate(l,n.memoizedState,r.__reactInternalSnapshotBeforeUpdate)}var a=t.updateQueue;a!==null&&ks(t,a,r);break;case 3:var o=t.updateQueue;if(o!==null){if(n=null,t.child!==null)switch(t.child.tag){case 5:n=t.child.stateNode;break;case 1:n=t.child.stateNode}ks(t,o,n)}break;case 5:var c=t.stateNode;if(n===null&&t.flags&4){n=c;var p=t.memoizedProps;switch(t.type){case"button":case"input":case"select":case"textarea":p.autoFocus&&n.focus();break;case"img":p.src&&(n.src=p.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(t.memoizedState===null){var w=t.alternate;if(w!==null){var N=w.memoizedState;if(N!==null){var T=N.dehydrated;T!==null&&Pr(T)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(i(163))}Ke||t.flags&512&&Ro(t)}catch(C){Ce(t,t.return,C)}}if(t===e){A=null;break}if(n=t.sibling,n!==null){n.return=t.return,A=n;break}A=t.return}}function ku(e){for(;A!==null;){var t=A;if(t===e){A=null;break}var n=t.sibling;if(n!==null){n.return=t.return,A=n;break}A=t.return}}function Su(e){for(;A!==null;){var t=A;try{switch(t.tag){case 0:case 11:case 15:var n=t.return;try{ea(4,t)}catch(p){Ce(t,n,p)}break;case 1:var r=t.stateNode;if(typeof r.componentDidMount=="function"){var l=t.return;try{r.componentDidMount()}catch(p){Ce(t,l,p)}}var a=t.return;try{Ro(t)}catch(p){Ce(t,a,p)}break;case 5:var o=t.return;try{Ro(t)}catch(p){Ce(t,o,p)}}}catch(p){Ce(t,t.return,p)}if(t===e){A=null;break}var c=t.sibling;if(c!==null){c.return=t.return,A=c;break}A=t.return}}var $d=Math.ceil,ta=we.ReactCurrentDispatcher,Io=we.ReactCurrentOwner,vt=we.ReactCurrentBatchConfig,se=0,Ie=null,Pe=null,Be=0,dt=0,mr=fn(0),Re=0,el=null,An=0,na=0,$o=0,tl=null,nt=null,Ao=0,hr=1/0,Xt=null,ra=!1,Fo=null,yn=null,la=!1,_n=null,aa=0,nl=0,Uo=null,oa=-1,ia=0;function Ge(){return(se&6)!==0?Ne():oa!==-1?oa:oa=Ne()}function wn(e){return(e.mode&1)===0?1:(se&2)!==0&&Be!==0?Be&-Be:wd.transition!==null?(ia===0&&(ia=hi()),ia):(e=fe,e!==0||(e=window.event,e=e===void 0?16:Ei(e.type)),e)}function zt(e,t,n,r){if(50<nl)throw nl=0,Uo=null,Error(i(185));Cr(e,n,r),((se&2)===0||e!==Ie)&&(e===Ie&&((se&2)===0&&(na|=n),Re===4&&kn(e,Be)),rt(e,r),n===1&&se===0&&(t.mode&1)===0&&(hr=Ne()+500,Dl&&mn()))}function rt(e,t){var n=e.callbackNode;wc(e,t);var r=hl(e,e===Ie?Be:0);if(r===0)n!==null&&fi(n),e.callbackNode=null,e.callbackPriority=0;else if(t=r&-r,e.callbackPriority!==t){if(n!=null&&fi(n),t===1)e.tag===0?_d(Eu.bind(null,e)):cs(Eu.bind(null,e)),hd(function(){(se&6)===0&&mn()}),n=null;else{switch(xi(r)){case 1:n=ya;break;case 4:n=gi;break;case 16:n=pl;break;case 536870912:n=mi;break;default:n=pl}n=Lu(n,bu.bind(null,e))}e.callbackPriority=t,e.callbackNode=n}}function bu(e,t){if(oa=-1,ia=0,(se&6)!==0)throw Error(i(327));var n=e.callbackNode;if(xr()&&e.callbackNode!==n)return null;var r=hl(e,e===Ie?Be:0);if(r===0)return null;if((r&30)!==0||(r&e.expiredLanes)!==0||t)t=sa(e,r);else{t=r;var l=se;se|=2;var a=Nu();(Ie!==e||Be!==t)&&(Xt=null,hr=Ne()+500,Un(e,t));do try{Ud();break}catch(c){Cu(e,c)}while(!0);lo(),ta.current=a,se=l,Pe!==null?t=0:(Ie=null,Be=0,t=Re)}if(t!==0){if(t===2&&(l=_a(e),l!==0&&(r=l,t=Bo(e,l))),t===1)throw n=el,Un(e,0),kn(e,r),rt(e,Ne()),n;if(t===6)kn(e,r);else{if(l=e.current.alternate,(r&30)===0&&!Ad(l)&&(t=sa(e,r),t===2&&(a=_a(e),a!==0&&(r=a,t=Bo(e,a))),t===1))throw n=el,Un(e,0),kn(e,r),rt(e,Ne()),n;switch(e.finishedWork=l,e.finishedLanes=r,t){case 0:case 1:throw Error(i(345));case 2:Bn(e,nt,Xt);break;case 3:if(kn(e,r),(r&130023424)===r&&(t=Ao+500-Ne(),10<t)){if(hl(e,0)!==0)break;if(l=e.suspendedLanes,(l&r)!==r){Ge(),e.pingedLanes|=e.suspendedLanes&l;break}e.timeoutHandle=Ka(Bn.bind(null,e,nt,Xt),t);break}Bn(e,nt,Xt);break;case 4:if(kn(e,r),(r&4194240)===r)break;for(t=e.eventTimes,l=-1;0<r;){var o=31-bt(r);a=1<<o,o=t[o],o>l&&(l=o),r&=~a}if(r=l,r=Ne()-r,r=(120>r?120:480>r?480:1080>r?1080:1920>r?1920:3e3>r?3e3:4320>r?4320:1960*$d(r/1960))-r,10<r){e.timeoutHandle=Ka(Bn.bind(null,e,nt,Xt),r);break}Bn(e,nt,Xt);break;case 5:Bn(e,nt,Xt);break;default:throw Error(i(329))}}}return rt(e,Ne()),e.callbackNode===n?bu.bind(null,e):null}function Bo(e,t){var n=tl;return e.current.memoizedState.isDehydrated&&(Un(e,t).flags|=256),e=sa(e,t),e!==2&&(t=nt,nt=n,t!==null&&Vo(t)),e}function Vo(e){nt===null?nt=e:nt.push.apply(nt,e)}function Ad(e){for(var t=e;;){if(t.flags&16384){var n=t.updateQueue;if(n!==null&&(n=n.stores,n!==null))for(var r=0;r<n.length;r++){var l=n[r],a=l.getSnapshot;l=l.value;try{if(!Et(a(),l))return!1}catch{return!1}}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function kn(e,t){for(t&=~$o,t&=~na,e.suspendedLanes|=t,e.pingedLanes&=~t,e=e.expirationTimes;0<t;){var n=31-bt(t),r=1<<n;e[n]=-1,t&=~r}}function Eu(e){if((se&6)!==0)throw Error(i(327));xr();var t=hl(e,0);if((t&1)===0)return rt(e,Ne()),null;var n=sa(e,t);if(e.tag!==0&&n===2){var r=_a(e);r!==0&&(t=r,n=Bo(e,r))}if(n===1)throw n=el,Un(e,0),kn(e,t),rt(e,Ne()),n;if(n===6)throw Error(i(345));return e.finishedWork=e.current.alternate,e.finishedLanes=t,Bn(e,nt,Xt),rt(e,Ne()),null}function Ho(e,t){var n=se;se|=1;try{return e(t)}finally{se=n,se===0&&(hr=Ne()+500,Dl&&mn())}}function Fn(e){_n!==null&&_n.tag===0&&(se&6)===0&&xr();var t=se;se|=1;var n=vt.transition,r=fe;try{if(vt.transition=null,fe=1,e)return e()}finally{fe=r,vt.transition=n,se=t,(se&6)===0&&mn()}}function Wo(){dt=mr.current,_e(mr)}function Un(e,t){e.finishedWork=null,e.finishedLanes=0;var n=e.timeoutHandle;if(n!==-1&&(e.timeoutHandle=-1,md(n)),Pe!==null)for(n=Pe.return;n!==null;){var r=n;switch(Za(r),r.tag){case 1:r=r.type.childContextTypes,r!=null&&Ll();break;case 3:pr(),_e(Ze),_e(He),fo();break;case 5:co(r);break;case 4:pr();break;case 13:_e(be);break;case 19:_e(be);break;case 10:ao(r.type._context);break;case 22:case 23:Wo()}n=n.return}if(Ie=e,Pe=e=Sn(e.current,null),Be=dt=t,Re=0,el=null,$o=na=An=0,nt=tl=null,On!==null){for(t=0;t<On.length;t++)if(n=On[t],r=n.interleaved,r!==null){n.interleaved=null;var l=r.next,a=n.pending;if(a!==null){var o=a.next;a.next=l,r.next=o}n.pending=r}On=null}return e}function Cu(e,t){do{var n=Pe;try{if(lo(),Wl.current=Jl,Ql){for(var r=Ee.memoizedState;r!==null;){var l=r.queue;l!==null&&(l.pending=null),r=r.next}Ql=!1}if($n=0,Oe=Le=Ee=null,Yr=!1,Jr=0,Io.current=null,n===null||n.return===null){Re=1,el=t,Pe=null;break}e:{var a=e,o=n.return,c=n,p=t;if(t=Be,c.flags|=32768,p!==null&&typeof p=="object"&&typeof p.then=="function"){var w=p,N=c,T=N.tag;if((N.mode&1)===0&&(T===0||T===11||T===15)){var C=N.alternate;C?(N.updateQueue=C.updateQueue,N.memoizedState=C.memoizedState,N.lanes=C.lanes):(N.updateQueue=null,N.memoizedState=null)}var I=qs(o);if(I!==null){I.flags&=-257,Xs(I,o,c,a,t),I.mode&1&&Gs(a,w,t),t=I,p=w;var B=t.updateQueue;if(B===null){var V=new Set;V.add(p),t.updateQueue=V}else B.add(p);break e}else{if((t&1)===0){Gs(a,w,t),Qo();break e}p=Error(i(426))}}else if(Se&&c.mode&1){var je=qs(o);if(je!==null){(je.flags&65536)===0&&(je.flags|=256),Xs(je,o,c,a,t),no(fr(p,c));break e}}a=p=fr(p,c),Re!==4&&(Re=2),tl===null?tl=[a]:tl.push(a),a=o;do{switch(a.tag){case 3:a.flags|=65536,t&=-t,a.lanes|=t;var v=Ys(a,p,t);ws(a,v);break e;case 1:c=p;var f=a.type,y=a.stateNode;if((a.flags&128)===0&&(typeof f.getDerivedStateFromError=="function"||y!==null&&typeof y.componentDidCatch=="function"&&(yn===null||!yn.has(y)))){a.flags|=65536,t&=-t,a.lanes|=t;var L=Js(a,c,t);ws(a,L);break e}}a=a.return}while(a!==null)}Tu(n)}catch(H){t=H,Pe===n&&n!==null&&(Pe=n=n.return);continue}break}while(!0)}function Nu(){var e=ta.current;return ta.current=Jl,e===null?Jl:e}function Qo(){(Re===0||Re===3||Re===2)&&(Re=4),Ie===null||(An&268435455)===0&&(na&268435455)===0||kn(Ie,Be)}function sa(e,t){var n=se;se|=2;var r=Nu();(Ie!==e||Be!==t)&&(Xt=null,Un(e,t));do try{Fd();break}catch(l){Cu(e,l)}while(!0);if(lo(),se=n,ta.current=r,Pe!==null)throw Error(i(261));return Ie=null,Be=0,Re}function Fd(){for(;Pe!==null;)ju(Pe)}function Ud(){for(;Pe!==null&&!pc();)ju(Pe)}function ju(e){var t=Mu(e.alternate,e,dt);e.memoizedProps=e.pendingProps,t===null?Tu(e):Pe=t,Io.current=null}function Tu(e){var t=e;do{var n=t.alternate;if(e=t.return,(t.flags&32768)===0){if(n=Ld(n,t,dt),n!==null){Pe=n;return}}else{if(n=Rd(n,t),n!==null){n.flags&=32767,Pe=n;return}if(e!==null)e.flags|=32768,e.subtreeFlags=0,e.deletions=null;else{Re=6,Pe=null;return}}if(t=t.sibling,t!==null){Pe=t;return}Pe=t=e}while(t!==null);Re===0&&(Re=5)}function Bn(e,t,n){var r=fe,l=vt.transition;try{vt.transition=null,fe=1,Bd(e,t,n,r)}finally{vt.transition=l,fe=r}return null}function Bd(e,t,n,r){do xr();while(_n!==null);if((se&6)!==0)throw Error(i(327));n=e.finishedWork;var l=e.finishedLanes;if(n===null)return null;if(e.finishedWork=null,e.finishedLanes=0,n===e.current)throw Error(i(177));e.callbackNode=null,e.callbackPriority=0;var a=n.lanes|n.childLanes;if(kc(e,a),e===Ie&&(Pe=Ie=null,Be=0),(n.subtreeFlags&2064)===0&&(n.flags&2064)===0||la||(la=!0,Lu(pl,function(){return xr(),null})),a=(n.flags&15990)!==0,(n.subtreeFlags&15990)!==0||a){a=vt.transition,vt.transition=null;var o=fe;fe=1;var c=se;se|=4,Io.current=null,Od(e,n),yu(n,e),sd(Wa),yl=!!Ha,Wa=Ha=null,e.current=n,Id(n),fc(),se=c,fe=o,vt.transition=a}else e.current=n;if(la&&(la=!1,_n=e,aa=l),a=e.pendingLanes,a===0&&(yn=null),hc(n.stateNode),rt(e,Ne()),t!==null)for(r=e.onRecoverableError,n=0;n<t.length;n++)l=t[n],r(l.value,{componentStack:l.stack,digest:l.digest});if(ra)throw ra=!1,e=Fo,Fo=null,e;return(aa&1)!==0&&e.tag!==0&&xr(),a=e.pendingLanes,(a&1)!==0?e===Uo?nl++:(nl=0,Uo=e):nl=0,mn(),null}function xr(){if(_n!==null){var e=xi(aa),t=vt.transition,n=fe;try{if(vt.transition=null,fe=16>e?16:e,_n===null)var r=!1;else{if(e=_n,_n=null,aa=0,(se&6)!==0)throw Error(i(331));var l=se;for(se|=4,A=e.current;A!==null;){var a=A,o=a.child;if((A.flags&16)!==0){var c=a.deletions;if(c!==null){for(var p=0;p<c.length;p++){var w=c[p];for(A=w;A!==null;){var N=A;switch(N.tag){case 0:case 11:case 15:Zr(8,N,a)}var T=N.child;if(T!==null)T.return=N,A=T;else for(;A!==null;){N=A;var C=N.sibling,I=N.return;if(gu(N),N===w){A=null;break}if(C!==null){C.return=I,A=C;break}A=I}}}var B=a.alternate;if(B!==null){var V=B.child;if(V!==null){B.child=null;do{var je=V.sibling;V.sibling=null,V=je}while(V!==null)}}A=a}}if((a.subtreeFlags&2064)!==0&&o!==null)o.return=a,A=o;else e:for(;A!==null;){if(a=A,(a.flags&2048)!==0)switch(a.tag){case 0:case 11:case 15:Zr(9,a,a.return)}var v=a.sibling;if(v!==null){v.return=a.return,A=v;break e}A=a.return}}var f=e.current;for(A=f;A!==null;){o=A;var y=o.child;if((o.subtreeFlags&2064)!==0&&y!==null)y.return=o,A=y;else e:for(o=f;A!==null;){if(c=A,(c.flags&2048)!==0)try{switch(c.tag){case 0:case 11:case 15:ea(9,c)}}catch(H){Ce(c,c.return,H)}if(c===o){A=null;break e}var L=c.sibling;if(L!==null){L.return=c.return,A=L;break e}A=c.return}}if(se=l,mn(),$t&&typeof $t.onPostCommitFiberRoot=="function")try{$t.onPostCommitFiberRoot(fl,e)}catch{}r=!0}return r}finally{fe=n,vt.transition=t}}return!1}function zu(e,t,n){t=fr(n,t),t=Ys(e,t,1),e=xn(e,t,1),t=Ge(),e!==null&&(Cr(e,1,t),rt(e,t))}function Ce(e,t,n){if(e.tag===3)zu(e,e,n);else for(;t!==null;){if(t.tag===3){zu(t,e,n);break}else if(t.tag===1){var r=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof r.componentDidCatch=="function"&&(yn===null||!yn.has(r))){e=fr(n,e),e=Js(t,e,1),t=xn(t,e,1),e=Ge(),t!==null&&(Cr(t,1,e),rt(t,e));break}}t=t.return}}function Vd(e,t,n){var r=e.pingCache;r!==null&&r.delete(t),t=Ge(),e.pingedLanes|=e.suspendedLanes&n,Ie===e&&(Be&n)===n&&(Re===4||Re===3&&(Be&130023424)===Be&&500>Ne()-Ao?Un(e,0):$o|=n),rt(e,t)}function Pu(e,t){t===0&&((e.mode&1)===0?t=1:(t=ml,ml<<=1,(ml&130023424)===0&&(ml=4194304)));var n=Ge();e=Jt(e,t),e!==null&&(Cr(e,t,n),rt(e,n))}function Hd(e){var t=e.memoizedState,n=0;t!==null&&(n=t.retryLane),Pu(e,n)}function Wd(e,t){var n=0;switch(e.tag){case 13:var r=e.stateNode,l=e.memoizedState;l!==null&&(n=l.retryLane);break;case 19:r=e.stateNode;break;default:throw Error(i(314))}r!==null&&r.delete(t),Pu(e,n)}var Mu;Mu=function(e,t,n){if(e!==null)if(e.memoizedProps!==t.pendingProps||Ze.current)tt=!0;else{if((e.lanes&n)===0&&(t.flags&128)===0)return tt=!1,Md(e,t,n);tt=(e.flags&131072)!==0}else tt=!1,Se&&(t.flags&1048576)!==0&&ds(t,Il,t.index);switch(t.lanes=0,t.tag){case 2:var r=t.type;Xl(e,t),e=t.pendingProps;var l=ar(t,He.current);dr(t,n),l=ho(null,t,r,e,l,n);var a=xo();return t.flags|=1,typeof l=="object"&&l!==null&&typeof l.render=="function"&&l.$$typeof===void 0?(t.tag=1,t.memoizedState=null,t.updateQueue=null,et(r)?(a=!0,Rl(t)):a=!1,t.memoizedState=l.state!==null&&l.state!==void 0?l.state:null,so(t),l.updater=Gl,t.stateNode=l,l._reactInternals=t,So(t,r,e,n),t=No(null,t,r,!0,a,n)):(t.tag=0,Se&&a&&Xa(t),Je(null,t,l,n),t=t.child),t;case 16:r=t.elementType;e:{switch(Xl(e,t),e=t.pendingProps,l=r._init,r=l(r._payload),t.type=r,l=t.tag=Kd(r),e=Nt(r,e),l){case 0:t=Co(null,t,r,e,n);break e;case 1:t=lu(null,t,r,e,n);break e;case 11:t=Zs(null,t,r,e,n);break e;case 14:t=eu(null,t,r,Nt(r.type,e),n);break e}throw Error(i(306,r,""))}return t;case 0:return r=t.type,l=t.pendingProps,l=t.elementType===r?l:Nt(r,l),Co(e,t,r,l,n);case 1:return r=t.type,l=t.pendingProps,l=t.elementType===r?l:Nt(r,l),lu(e,t,r,l,n);case 3:e:{if(au(t),e===null)throw Error(i(387));r=t.pendingProps,a=t.memoizedState,l=a.element,_s(e,t),Vl(t,r,null,n);var o=t.memoizedState;if(r=o.element,a.isDehydrated)if(a={element:r,isDehydrated:!1,cache:o.cache,pendingSuspenseBoundaries:o.pendingSuspenseBoundaries,transitions:o.transitions},t.updateQueue.baseState=a,t.memoizedState=a,t.flags&256){l=fr(Error(i(423)),t),t=ou(e,t,r,n,l);break e}else if(r!==l){l=fr(Error(i(424)),t),t=ou(e,t,r,n,l);break e}else for(ct=pn(t.stateNode.containerInfo.firstChild),ut=t,Se=!0,Ct=null,n=vs(t,null,r,n),t.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(sr(),r===l){t=qt(e,t,n);break e}Je(e,t,r,n)}t=t.child}return t;case 5:return Ss(t),e===null&&to(t),r=t.type,l=t.pendingProps,a=e!==null?e.memoizedProps:null,o=l.children,Qa(r,l)?o=null:a!==null&&Qa(r,a)&&(t.flags|=32),ru(e,t),Je(e,t,o,n),t.child;case 6:return e===null&&to(t),null;case 13:return iu(e,t,n);case 4:return uo(t,t.stateNode.containerInfo),r=t.pendingProps,e===null?t.child=ur(t,null,r,n):Je(e,t,r,n),t.child;case 11:return r=t.type,l=t.pendingProps,l=t.elementType===r?l:Nt(r,l),Zs(e,t,r,l,n);case 7:return Je(e,t,t.pendingProps,n),t.child;case 8:return Je(e,t,t.pendingProps.children,n),t.child;case 12:return Je(e,t,t.pendingProps.children,n),t.child;case 10:e:{if(r=t.type._context,l=t.pendingProps,a=t.memoizedProps,o=l.value,xe(Fl,r._currentValue),r._currentValue=o,a!==null)if(Et(a.value,o)){if(a.children===l.children&&!Ze.current){t=qt(e,t,n);break e}}else for(a=t.child,a!==null&&(a.return=t);a!==null;){var c=a.dependencies;if(c!==null){o=a.child;for(var p=c.firstContext;p!==null;){if(p.context===r){if(a.tag===1){p=Gt(-1,n&-n),p.tag=2;var w=a.updateQueue;if(w!==null){w=w.shared;var N=w.pending;N===null?p.next=p:(p.next=N.next,N.next=p),w.pending=p}}a.lanes|=n,p=a.alternate,p!==null&&(p.lanes|=n),oo(a.return,n,t),c.lanes|=n;break}p=p.next}}else if(a.tag===10)o=a.type===t.type?null:a.child;else if(a.tag===18){if(o=a.return,o===null)throw Error(i(341));o.lanes|=n,c=o.alternate,c!==null&&(c.lanes|=n),oo(o,n,t),o=a.sibling}else o=a.child;if(o!==null)o.return=a;else for(o=a;o!==null;){if(o===t){o=null;break}if(a=o.sibling,a!==null){a.return=o.return,o=a;break}o=o.return}a=o}Je(e,t,l.children,n),t=t.child}return t;case 9:return l=t.type,r=t.pendingProps.children,dr(t,n),l=ht(l),r=r(l),t.flags|=1,Je(e,t,r,n),t.child;case 14:return r=t.type,l=Nt(r,t.pendingProps),l=Nt(r.type,l),eu(e,t,r,l,n);case 15:return tu(e,t,t.type,t.pendingProps,n);case 17:return r=t.type,l=t.pendingProps,l=t.elementType===r?l:Nt(r,l),Xl(e,t),t.tag=1,et(r)?(e=!0,Rl(t)):e=!1,dr(t,n),Qs(t,r,l),So(t,r,l,n),No(null,t,r,!0,e,n);case 19:return uu(e,t,n);case 22:return nu(e,t,n)}throw Error(i(156,t.tag))};function Lu(e,t){return pi(e,t)}function Qd(e,t,n,r){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=r,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function yt(e,t,n,r){return new Qd(e,t,n,r)}function Ko(e){return e=e.prototype,!(!e||!e.isReactComponent)}function Kd(e){if(typeof e=="function")return Ko(e)?1:0;if(e!=null){if(e=e.$$typeof,e===at)return 11;if(e===ft)return 14}return 2}function Sn(e,t){var n=e.alternate;return n===null?(n=yt(e.tag,t,e.key,e.mode),n.elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=e.flags&14680064,n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n}function ua(e,t,n,r,l,a){var o=2;if(r=e,typeof e=="function")Ko(e)&&(o=1);else if(typeof e=="string")o=5;else e:switch(e){case ze:return Vn(n.children,l,a,t);case De:o=8,l|=8;break;case wt:return e=yt(12,n,t,l|2),e.elementType=wt,e.lanes=a,e;case Ye:return e=yt(13,n,t,l),e.elementType=Ye,e.lanes=a,e;case ot:return e=yt(19,n,t,l),e.elementType=ot,e.lanes=a,e;case ve:return ca(n,l,a,t);default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case pt:o=10;break e;case Pt:o=9;break e;case at:o=11;break e;case ft:o=14;break e;case Ae:o=16,r=null;break e}throw Error(i(130,e==null?e:typeof e,""))}return t=yt(o,n,t,l),t.elementType=e,t.type=r,t.lanes=a,t}function Vn(e,t,n,r){return e=yt(7,e,r,t),e.lanes=n,e}function ca(e,t,n,r){return e=yt(22,e,r,t),e.elementType=ve,e.lanes=n,e.stateNode={isHidden:!1},e}function Yo(e,t,n){return e=yt(6,e,null,t),e.lanes=n,e}function Jo(e,t,n){return t=yt(4,e.children!==null?e.children:[],e.key,t),t.lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}function Yd(e,t,n,r,l){this.tag=t,this.containerInfo=e,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=wa(0),this.expirationTimes=wa(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=wa(0),this.identifierPrefix=r,this.onRecoverableError=l,this.mutableSourceEagerHydrationData=null}function Go(e,t,n,r,l,a,o,c,p){return e=new Yd(e,t,n,c,p),t===1?(t=1,a===!0&&(t|=8)):t=0,a=yt(3,null,null,t),e.current=a,a.stateNode=e,a.memoizedState={element:r,isDehydrated:n,cache:null,transitions:null,pendingSuspenseBoundaries:null},so(a),e}function Jd(e,t,n){var r=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:ce,key:r==null?null:""+r,children:e,containerInfo:t,implementation:n}}function Ru(e){if(!e)return gn;e=e._reactInternals;e:{if(ie(e)!==e||e.tag!==1)throw Error(i(170));var t=e;do{switch(t.tag){case 3:t=t.stateNode.context;break e;case 1:if(et(t.type)){t=t.stateNode.__reactInternalMemoizedMergedChildContext;break e}}t=t.return}while(t!==null);throw Error(i(171))}if(e.tag===1){var n=e.type;if(et(n))return ss(e,n,t)}return t}function Du(e,t,n,r,l,a,o,c,p){return e=Go(n,r,!0,e,l,a,o,c,p),e.context=Ru(null),n=e.current,r=Ge(),l=wn(n),a=Gt(r,l),a.callback=t??null,xn(n,a,l),e.current.lanes=l,Cr(e,l,r),rt(e,r),e}function da(e,t,n,r){var l=t.current,a=Ge(),o=wn(l);return n=Ru(n),t.context===null?t.context=n:t.pendingContext=n,t=Gt(a,o),t.payload={element:e},r=r===void 0?null:r,r!==null&&(t.callback=r),e=xn(l,t,o),e!==null&&(zt(e,l,o,a),Bl(e,l,o)),o}function pa(e){if(e=e.current,!e.child)return null;switch(e.child.tag){case 5:return e.child.stateNode;default:return e.child.stateNode}}function Ou(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var n=e.retryLane;e.retryLane=n!==0&&n<t?n:t}}function qo(e,t){Ou(e,t),(e=e.alternate)&&Ou(e,t)}function Gd(){return null}var Iu=typeof reportError=="function"?reportError:function(e){console.error(e)};function Xo(e){this._internalRoot=e}fa.prototype.render=Xo.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(i(409));da(e,t,null,null)},fa.prototype.unmount=Xo.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;Fn(function(){da(null,e,null,null)}),t[Wt]=null}};function fa(e){this._internalRoot=e}fa.prototype.unstable_scheduleHydration=function(e){if(e){var t=_i();e={blockedOn:null,target:e,priority:t};for(var n=0;n<un.length&&t!==0&&t<un[n].priority;n++);un.splice(n,0,e),n===0&&Si(e)}};function Zo(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function ga(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11&&(e.nodeType!==8||e.nodeValue!==" react-mount-point-unstable "))}function $u(){}function qd(e,t,n,r,l){if(l){if(typeof r=="function"){var a=r;r=function(){var w=pa(o);a.call(w)}}var o=Du(t,r,e,0,null,!1,!1,"",$u);return e._reactRootContainer=o,e[Wt]=o.current,Fr(e.nodeType===8?e.parentNode:e),Fn(),o}for(;l=e.lastChild;)e.removeChild(l);if(typeof r=="function"){var c=r;r=function(){var w=pa(p);c.call(w)}}var p=Go(e,0,!1,null,null,!1,!1,"",$u);return e._reactRootContainer=p,e[Wt]=p.current,Fr(e.nodeType===8?e.parentNode:e),Fn(function(){da(t,p,n,r)}),p}function ma(e,t,n,r,l){var a=n._reactRootContainer;if(a){var o=a;if(typeof l=="function"){var c=l;l=function(){var p=pa(o);c.call(p)}}da(t,o,e,l)}else o=qd(n,t,e,l,r);return pa(o)}vi=function(e){switch(e.tag){case 3:var t=e.stateNode;if(t.current.memoizedState.isDehydrated){var n=Er(t.pendingLanes);n!==0&&(ka(t,n|1),rt(t,Ne()),(se&6)===0&&(hr=Ne()+500,mn()))}break;case 13:Fn(function(){var r=Jt(e,1);if(r!==null){var l=Ge();zt(r,e,1,l)}}),qo(e,1)}},Sa=function(e){if(e.tag===13){var t=Jt(e,134217728);if(t!==null){var n=Ge();zt(t,e,134217728,n)}qo(e,134217728)}},yi=function(e){if(e.tag===13){var t=wn(e),n=Jt(e,t);if(n!==null){var r=Ge();zt(n,e,t,r)}qo(e,t)}},_i=function(){return fe},wi=function(e,t){var n=fe;try{return fe=e,t()}finally{fe=n}},_r=function(e,t,n){switch(t){case"input":if(Dt(e,n),t=n.name,n.type==="radio"&&t!=null){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+t)+'][type="radio"]'),t=0;t<n.length;t++){var r=n[t];if(r!==e&&r.form===e.form){var l=Ml(r);if(!l)throw Error(i(90));qe(r),Dt(r,l)}}}break;case"textarea":Qn(e,n);break;case"select":t=n.value,t!=null&&Fe(e,!!n.multiple,t,!1)}},cl=Ho,kr=Fn;var Xd={usingClientEntryPoint:!1,Events:[Vr,rr,Ml,jn,ul,Ho]},rl={findFiberByHostInstance:Mn,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},Zd={bundleType:rl.bundleType,version:rl.version,rendererPackageName:rl.rendererPackageName,rendererConfig:rl.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:we.ReactCurrentDispatcher,findHostInstanceByFiber:function(e){return e=ci(e),e===null?null:e.stateNode},findFiberByHostInstance:rl.findFiberByHostInstance||Gd,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var ha=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!ha.isDisabled&&ha.supportsFiber)try{fl=ha.inject(Zd),$t=ha}catch{}}return lt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Xd,lt.createPortal=function(e,t){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!Zo(t))throw Error(i(200));return Jd(e,t,null,n)},lt.createRoot=function(e,t){if(!Zo(e))throw Error(i(299));var n=!1,r="",l=Iu;return t!=null&&(t.unstable_strictMode===!0&&(n=!0),t.identifierPrefix!==void 0&&(r=t.identifierPrefix),t.onRecoverableError!==void 0&&(l=t.onRecoverableError)),t=Go(e,1,!1,null,null,n,!1,r,l),e[Wt]=t.current,Fr(e.nodeType===8?e.parentNode:e),new Xo(t)},lt.findDOMNode=function(e){if(e==null)return null;if(e.nodeType===1)return e;var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(i(188)):(e=Object.keys(e).join(","),Error(i(268,e)));return e=ci(t),e=e===null?null:e.stateNode,e},lt.flushSync=function(e){return Fn(e)},lt.hydrate=function(e,t,n){if(!ga(t))throw Error(i(200));return ma(null,e,t,!0,n)},lt.hydrateRoot=function(e,t,n){if(!Zo(e))throw Error(i(405));var r=n!=null&&n.hydratedSources||null,l=!1,a="",o=Iu;if(n!=null&&(n.unstable_strictMode===!0&&(l=!0),n.identifierPrefix!==void 0&&(a=n.identifierPrefix),n.onRecoverableError!==void 0&&(o=n.onRecoverableError)),t=Du(t,null,e,1,n??null,l,!1,a,o),e[Wt]=t.current,Fr(e),r)for(e=0;e<r.length;e++)n=r[e],l=n._getVersion,l=l(n._source),t.mutableSourceEagerHydrationData==null?t.mutableSourceEagerHydrationData=[n,l]:t.mutableSourceEagerHydrationData.push(n,l);return new fa(t)},lt.render=function(e,t,n){if(!ga(t))throw Error(i(200));return ma(null,e,t,!1,n)},lt.unmountComponentAtNode=function(e){if(!ga(e))throw Error(i(40));return e._reactRootContainer?(Fn(function(){ma(null,null,e,!1,function(){e._reactRootContainer=null,e[Wt]=null})}),!0):!1},lt.unstable_batchedUpdates=Ho,lt.unstable_renderSubtreeIntoContainer=function(e,t,n,r){if(!ga(n))throw Error(i(200));if(e==null||e._reactInternals===void 0)throw Error(i(38));return ma(e,t,n,!1,r)},lt.version="18.3.1-next-f1338f8080-20240426",lt}var Qu;function ip(){if(Qu)return ni.exports;Qu=1;function s(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(s)}catch(u){console.error(u)}}return s(),ni.exports=op(),ni.exports}var Ku;function sp(){if(Ku)return xa;Ku=1;var s=ip();return xa.createRoot=s.createRoot,xa.hydrateRoot=s.hydrateRoot,xa}var up=sp();function cp(){if(typeof window>"u")return!1;const s=window;return!!(s.SpeechRecognition||s.webkitSpeechRecognition)}function dp(){if(typeof window>"u")return null;const s=window;return s.SpeechRecognition??s.webkitSpeechRecognition??null}function pp(s){const u=dp();if(!u)return s.onError("Voice input is not supported in this browser."),null;let i=new u;i.continuous=!0,i.interimResults=!0;try{i.lang=navigator.language||"en-US"}catch{i.lang="en-US"}let x=!1,g="";i.onresult=m=>{var k;let j="",E="";for(let z=m.resultIndex;z<m.results.length;z++){const P=m.results[z],S=((k=P[0])==null?void 0:k.transcript)??"";P.isFinal?E+=S:j+=S}E&&(g=(g+" "+E).trim()),s.onPartial((g+" "+j).trim())},i.onerror=m=>{const j=m.error??"unknown";x||(j==="no-speech"?s.onError("Voice: silence detected. Hold the mic and speak."):j==="not-allowed"||j==="service-not-allowed"?s.onError("Voice: microphone permission denied."):j==="aborted"||s.onError(`Voice error: ${j}`))},i.onend=()=>{x||g&&s.onCommit(g)};try{i.start()}catch(m){return s.onError(m instanceof Error?m.message:"Voice failed to start."),null}return{stop:()=>{try{i==null||i.stop()}catch{}},abort:()=>{x=!0;try{i==null||i.abort()}catch{}i=null}}}function si(){return typeof navigator>"u"||!navigator.mediaDevices?!1:typeof navigator.mediaDevices.getUserMedia=="function"&&typeof MediaRecorder<"u"}function fp(s,u,i={}){return(async()=>{if(!si())return u.onError("Voice: this runtime does not expose MediaRecorder."),null;let x;try{x=await navigator.mediaDevices.getUserMedia({audio:!0})}catch(k){const z=k instanceof Error?k.message:"microphone unavailable";return u.onError(`Voice: microphone permission denied or device missing (${z}).`),null}let g=i.preferredMime??"audio/webm;codecs=opus";typeof MediaRecorder.isTypeSupported=="function"&&!MediaRecorder.isTypeSupported(g)&&(g=["audio/webm","audio/ogg;codecs=opus","audio/mp4"].find(P=>MediaRecorder.isTypeSupported(P))??"");const m=g?new MediaRecorder(x,{mimeType:g}):new MediaRecorder(x),j=[];let E=!1;m.addEventListener("dataavailable",k=>{k.data&&k.data.size>0&&j.push(k.data)}),m.addEventListener("stop",()=>{if(x.getTracks().forEach(z=>z.stop()),E||j.length===0)return;const k=new Blob(j,{type:g||"audio/webm"});k.arrayBuffer().then(z=>{const P=gp(z);return u.onPartial("a transcrever…"),s.transcribeAudio(P,k.type||"audio/webm",i.language)}).then(z=>{if(E)return;const P=((z==null?void 0:z.text)??"").trim();P?u.onCommit(P):u.onError("Voice: silence detected — nada para transcrever.")}).catch(z=>{if(E)return;const P=z instanceof Error?z.message:String(z);u.onError(`Voice: ${P}`)})});try{m.start()}catch(k){return x.getTracks().forEach(z=>z.stop()),u.onError(k instanceof Error?k.message:"recorder failed to start"),null}return{stop:()=>{if(m.state==="recording")try{m.stop()}catch{}},abort:()=>{if(E=!0,m.state==="recording")try{m.stop()}catch{}x.getTracks().forEach(k=>k.stop())}}})()}function gp(s){const u=new Uint8Array(s);let i="";const x=32768;for(let g=0;g<u.length;g+=x){const m=u.subarray(g,Math.min(g+x,u.length));i+=String.fromCharCode.apply(null,Array.from(m))}return btoa(i)}function mp(s){const u=[],i=s.split(`
`);let x=0,g=[];function m(){g.length!==0&&(u.push({kind:"prose",body:g.join(`
`)}),g=[])}for(;x<i.length;){const j=i[x],E=j.match(/^```(\w[\w+-]*)?\s*$/);if(E){m();const k=E[1]||null;x++;const z=x;for(;x<i.length&&!i[x].match(/^```\s*$/);)x++;const P=i.slice(z,x).join(`
`);u.push({kind:"code",lang:k,body:P}),x++;continue}g.push(j),x++}return m(),u}const hp=[[/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/,(s,u)=>d.jsx("a",{href:s[2],target:"_blank",rel:"noopener noreferrer",className:"gauntlet-md__link",children:s[1]},`a-${u}`)],[/`([^`]+)`/,(s,u)=>d.jsx("code",{className:"gauntlet-md__inline-code",children:s[1]},`c-${u}`)],[/\*\*([^*]+)\*\*/,(s,u)=>d.jsx("strong",{className:"gauntlet-md__strong",children:s[1]},`b-${u}`)],[/\*([^*]+)\*/,(s,u)=>d.jsx("em",{className:"gauntlet-md__em",children:s[1]},`i-${u}`)],[/_([^_]+)_/,(s,u)=>d.jsx("em",{className:"gauntlet-md__em",children:s[1]},`u-${u}`)]];function al(s,u){const i=[];let x=0,g=0;for(;x<s.length;){let m=null;for(const[j,E]of hp){const z=s.slice(x).match(j);!z||z.index===void 0||(m===null||z.index<m.idx)&&(m={idx:z.index,match:z,render:E})}if(m===null){i.push(s.slice(x));break}m.idx>0&&i.push(s.slice(x,x+m.idx)),i.push(m.render(m.match,u*100+g)),g++,x+=m.idx+m.match[0].length}return i}function xp(s,u){const i=[],x=s.split(`
`);let g=0,m=u;for(;g<x.length;){const E=x[g].trim();if(!E){g++;continue}const k=E.match(/^(#{1,3})\s+(.*)$/);if(k){const P=k[1].length,F=`h${P}`;i.push(d.jsx(F,{className:`gauntlet-md__h gauntlet-md__h${P}`,children:al(k[2],m++)},`h-${m++}`)),g++;continue}if(/^---+$/.test(E)||/^\*\*\*+$/.test(E)){i.push(d.jsx("hr",{className:"gauntlet-md__hr"},`hr-${m++}`)),g++;continue}if(E.startsWith(">")){const P=[];for(;g<x.length&&x[g].trim().startsWith(">");)P.push(x[g].replace(/^\s*>\s?/,"")),g++;i.push(d.jsx("blockquote",{className:"gauntlet-md__quote",children:al(P.join(" "),m++)},`q-${m++}`));continue}if(/^[-*]\s+/.test(E)){const P=[];for(;g<x.length&&/^[-*]\s+/.test(x[g].trim());)P.push(x[g].trim().replace(/^[-*]\s+/,"")),g++;i.push(d.jsx("ul",{className:"gauntlet-md__list",children:P.map((S,F)=>d.jsx("li",{className:"gauntlet-md__li",children:al(S,m++)},F))},`ul-${m++}`));continue}if(/^\d+\.\s+/.test(E)){const P=[];for(;g<x.length&&/^\d+\.\s+/.test(x[g].trim());)P.push(x[g].trim().replace(/^\d+\.\s+/,"")),g++;i.push(d.jsx("ol",{className:"gauntlet-md__list",children:P.map((S,F)=>d.jsx("li",{className:"gauntlet-md__li",children:al(S,m++)},F))},`ol-${m++}`));continue}const z=[];for(;g<x.length;){const P=x[g],S=P.trim();if(!S||/^(#{1,3})\s+/.test(S)||/^---+$/.test(S)||/^\*\*\*+$/.test(S)||S.startsWith(">")||/^[-*]\s+/.test(S)||/^\d+\.\s+/.test(S))break;z.push(P),g++}i.push(d.jsx("p",{className:"gauntlet-md__p",children:al(z.join(" "),m++)},`p-${m++}`))}return i}function vp({source:s,onCopyBlock:u}){const i=mp(s);return d.jsx("div",{className:"gauntlet-md",children:i.map((x,g)=>x.kind==="code"?d.jsx(jp,{lang:x.lang,body:x.body,onCopy:u},`cb-${g}`):d.jsx("div",{className:"gauntlet-md__prose",children:xp(x.body,g*1e3)},`pb-${g}`))})}const yp=new Set(["def","class","if","elif","else","for","while","return","import","from","as","with","try","except","finally","raise","pass","break","continue","in","is","not","and","or","lambda","yield","async","await","global","nonlocal","True","False","None","self","cls","print"]),_p=new Set(["function","const","let","var","if","else","return","class","export","import","from","as","default","async","await","for","while","try","catch","finally","throw","new","this","super","extends","implements","interface","type","enum","public","private","protected","readonly","static","typeof","instanceof","in","of","null","undefined","true","false","void","switch","case","break","continue","do","yield"]),wp=new Set(["cd","ls","cat","rm","mv","cp","mkdir","touch","grep","sed","awk","export","source","if","then","else","elif","fi","for","while","do","done","case","esac","exit","npm","npx","git","python","node","tsc","make","vite","wxt","set","get","start-process","select-string"]);function lc(s,u){if(s[u]!=="#")return-1;const i=s.indexOf(`
`,u);return i===-1?s.length:i}function kp(s,u){if(s[u]!=="/")return-1;if(s[u+1]==="/"){const i=s.indexOf(`
`,u);return i===-1?s.length:i}if(s[u+1]==="*"){const i=s.indexOf("*/",u+2);return i===-1?s.length:i+2}return-1}const ac={keywords:yp,matchComment:lc},Sp={keywords:_p,matchComment:kp},bp={keywords:wp,matchComment:lc};function Ep(s){if(!s)return null;const u=s.toLowerCase();return u==="py"||u==="python"||u==="python3"||u==="ipython"||u==="pycon"?ac:u==="ts"||u==="tsx"||u==="typescript"||u==="js"||u==="jsx"||u==="javascript"||u==="mjs"||u==="json"||u==="json5"?Sp:u==="sh"||u==="bash"||u==="zsh"||u==="shell"||u==="powershell"||u==="ps"||u==="ps1"||u==="console"?bp:null}function oc(s){return s>="a"&&s<="z"||s>="A"&&s<="Z"||s==="_"||s==="$"}function Cp(s){return oc(s)||s>="0"&&s<="9"}function ai(s){return s>="0"&&s<="9"}function Np(s,u){const i=[];let x="";function g(){x&&(i.push({kind:"p",text:x}),x="")}let m=0;for(;m<s.length;){const j=s[m],E=u.matchComment(s,m);if(E!==-1){g(),i.push({kind:"c",text:s.slice(m,E)}),m=E;continue}if(u===ac&&(s.startsWith('"""',m)||s.startsWith("'''",m))){g();const k=s.slice(m,m+3);let z=s.indexOf(k,m+3);z=z===-1?s.length:z+3,i.push({kind:"s",text:s.slice(m,z)}),m=z;continue}if(j==='"'||j==="'"||j==="`"){g();let k=m+1;for(;k<s.length&&s[k]!==j;){if(s[k]==="\\"){k+=2;continue}if(s[k]===`
`&&j!=="`")break;k++}const z=k<s.length?k+1:k;i.push({kind:"s",text:s.slice(m,z)}),m=z;continue}if(ai(j)){g();let k=m;for(;k<s.length&&(ai(s[k])||s[k]==="."||s[k]==="_");)k++;if(k<s.length&&(s[k]==="e"||s[k]==="E"))for(k++,k<s.length&&(s[k]==="+"||s[k]==="-")&&k++;k<s.length&&ai(s[k]);)k++;i.push({kind:"n",text:s.slice(m,k)}),m=k;continue}if(oc(j)){g();let k=m+1;for(;k<s.length&&Cp(s[k]);)k++;const z=s.slice(m,k);let P=k;for(;P<s.length&&s[P]===" ";)P++;const S=s[P]==="(";let F="p";u.keywords.has(z)?F="k":S&&(F="f"),i.push({kind:F,text:z}),m=k;continue}x+=j,m++}return g(),i}function jp({lang:s,body:u,onCopy:i}){const x=()=>{navigator.clipboard.writeText(u).catch(()=>{}),i==null||i(u)},g=Ep(s),m=g?Np(u,g):null;return d.jsxs("figure",{className:"gauntlet-md__code",children:[d.jsxs("header",{className:"gauntlet-md__code-meta",children:[d.jsx("span",{className:"gauntlet-md__code-lang",children:s??"code"}),d.jsx("button",{type:"button",className:"gauntlet-md__code-copy",onClick:x,"aria-label":"copy code",children:"copy"})]}),d.jsx("pre",{className:"gauntlet-md__code-body",children:m?d.jsx("code",{children:m.map((j,E)=>d.jsx("span",{className:`gauntlet-md__tok gauntlet-md__tok--${j.kind}`,children:j.text},E))}):d.jsx("code",{children:u})})]})}const Tp={domains:{},actions:{},default_domain_policy:{allowed:!0,require_danger_ack:!1},default_action_policy:{allowed:!0,require_danger_ack:!1},tool_policies:{},max_page_text_chars:6e3,max_dom_skeleton_chars:4e3,screenshot_default:!1,execution_reporting_required:!1,updated_at:""},zp="2px solid #d07a5a",Pp="2px",Mp="#gauntlet-capsule-host",Lp=[/\bpassword\b/i,/\bdelete\b/i,/\bdestroy\b/i,/\bremove\b/i,/\bunsubscribe\b/i,/payment|checkout|billing/i,/credit[-_ ]?card|\bccnum\b|\bcvv\b|\bcvc\b/i],Rp=["delete","remove","destroy","drop","discard","apagar","eliminar","remover","destruir","pay","buy","purchase","order","checkout","pagar","comprar","encomendar","confirm","submit","send","publish","enviar","confirmar","publicar","transfer","withdraw","transferir","levantar","cancel subscription","cancelar subscrição","cancelar assinatura"],Dp=5e3;function Op(s){const u=s.filter(m=>m.type==="fill"),i=s.filter(m=>m.type==="click");if(u.length===0||i.length===0)return{danger:!1};const x=u.find(m=>{const j=m.selector.toLowerCase();return!!(/\bpassword\b/.test(j)||/\bcvv\b|\bcvc\b|\bccnum\b|credit[-_ ]?card/.test(j)||/payment|checkout|billing/.test(j)||/cc-(number|exp|csc|name)/.test(j))});if(!x)return{danger:!1};const g=i.find(m=>{const j=m.selector.toLowerCase();return!!(j.includes("submit")||/\b(pay|buy|purchase|confirm|send|order|checkout|pagar|comprar|enviar|confirmar)\b/.test(j))});return g?{danger:!0,reason:`cadeia destrutiva: fill em "${x.selector}" seguido de click em "${g.selector}"`}:{danger:!1}}function Ip(s){var x;if(s.type==="highlight"||s.type==="scroll_to")return{danger:!1};const u=s.selector;for(const g of Lp)if(g.test(u))return{danger:!0,reason:`selector matches /${g.source}/`};let i=null;try{i=document.querySelector(u)}catch{}if(s.type==="fill")return i instanceof HTMLInputElement&&i.type==="password"?{danger:!0,reason:"password field"}:i instanceof HTMLInputElement&&(((x=i.autocomplete)==null?void 0:x.includes("cc-"))??!1)?{danger:!0,reason:"credit-card autocomplete"}:s.value.length>Dp?{danger:!0,reason:"unusually long value"}:{danger:!1};if(s.type==="click"){if(i instanceof HTMLButtonElement&&i.type==="submit")return{danger:!0,reason:"submit button"};if(i instanceof HTMLInputElement&&(i.type==="submit"||i.type==="reset"))return{danger:!0,reason:`${i.type} button`};if(i instanceof HTMLElement){const g=(i.innerText??"").trim().toLowerCase();if(g){for(const m of Rp)if(g===m||g.startsWith(m+" ")||g.endsWith(" "+m)||g.includes(" "+m+" "))return{danger:!0,reason:`action label: "${m}"`}}}return{danger:!1}}return{danger:!1}}async function $p(s){const u=[];for(const i of s)try{Ap(i),await Fp(i),u.push({action:i,ok:!0})}catch(x){u.push({action:i,ok:!1,error:x instanceof Error?x.message:String(x)})}return u}function Ap(s){const u=s.selector;if(!u||typeof u!="string")throw new Error("selector missing or not a string");if(u.includes(Mp))throw new Error(`selector targets the Gauntlet capsule itself: ${u}`);try{document.querySelector(u)}catch{throw new Error(`selector is not valid CSS: ${u}`)}}async function Fp(s){if(s.type==="fill"){Up(s.selector,s.value);return}if(s.type==="click"){Bp(s.selector);return}if(s.type==="highlight"){Vp(s.selector,s.duration_ms??1500);return}if(s.type==="scroll_to"){Hp(s.selector);return}throw new Error(`unknown action type: ${s.type??"<missing>"}`)}function Up(s,u){var x,g;const i=document.querySelector(s);if(!i)throw new Error(`selector not found: ${s}`);if(i instanceof HTMLInputElement||i instanceof HTMLTextAreaElement){i.focus({preventScroll:!0});const m=i instanceof HTMLInputElement?HTMLInputElement.prototype:HTMLTextAreaElement.prototype,j=(x=Object.getOwnPropertyDescriptor(m,"value"))==null?void 0:x.set;j?j.call(i,u):i.value=u,i.dispatchEvent(new Event("input",{bubbles:!0})),i.dispatchEvent(new Event("change",{bubbles:!0})),i.dispatchEvent(new Event("blur",{bubbles:!0}));return}if(i instanceof HTMLSelectElement){i.focus({preventScroll:!0});const m=(g=Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,"value"))==null?void 0:g.set;m?m.call(i,u):i.value=u,i.dispatchEvent(new Event("input",{bubbles:!0})),i.dispatchEvent(new Event("change",{bubbles:!0})),i.dispatchEvent(new Event("blur",{bubbles:!0}));return}if(i instanceof HTMLElement&&i.isContentEditable){i.focus(),i.textContent=u,i.dispatchEvent(new InputEvent("input",{bubbles:!0}));return}throw new Error(`element at ${s} is not fillable`)}function Bp(s){const u=document.querySelector(s);if(!u)throw new Error(`selector not found: ${s}`);if(!(u instanceof HTMLElement))throw new Error(`element at ${s} is not clickable`);const i=u.getBoundingClientRect(),x=i.left+i.width/2,g=i.top+i.height/2,m={bubbles:!0,cancelable:!0,view:window,clientX:x,clientY:g,button:0,buttons:1},j={...m,pointerId:1,pointerType:"mouse",isPrimary:!0};u.dispatchEvent(new PointerEvent("pointerdown",j)),u.dispatchEvent(new MouseEvent("mousedown",m)),u.focus({preventScroll:!0}),u.dispatchEvent(new PointerEvent("pointerup",j)),u.dispatchEvent(new MouseEvent("mouseup",m)),u.click()}function Vp(s,u){const i=document.querySelectorAll(s);if(i.length===0)throw new Error(`selector not found: ${s}`);for(const x of Array.from(i)){if(!(x instanceof HTMLElement))continue;const g=x.style.outline,m=x.style.outlineOffset;x.style.outline=zp,x.style.outlineOffset=Pp,window.setTimeout(()=>{x.style.outline=g,x.style.outlineOffset=m},u)}}function Hp(s){const u=document.querySelector(s);if(!u)throw new Error(`selector not found: ${s}`);if(!(u instanceof HTMLElement))throw new Error(`element at ${s} cannot be scrolled to`);u.scrollIntoView({behavior:"smooth",block:"center"})}const oi={},Wp="https://ruberra-backend-jkpf-production.up.railway.app",Qp=typeof import.meta<"u"?oi==null?void 0:oi.VITE_BACKEND_URL:void 0,Kp=(Qp??Wp).replace(/\/+$/,"");class Yp{constructor(u,i={}){this.ambient=u,this.backendUrl=(i.backendUrl??Kp).replace(/\/+$/,"")}captureContext(u,i){return this.ambient.transport.fetchJson("POST",`${this.backendUrl}/composer/context`,u,i)}detectIntent(u,i,x){return this.ambient.transport.fetchJson("POST",`${this.backendUrl}/composer/intent`,{context_id:u,user_input:i},x)}generatePreview(u,i){return this.ambient.transport.fetchJson("POST",`${this.backendUrl}/composer/preview`,{intent_id:u},i)}applyPreview(u,i,x,g){return this.ambient.transport.fetchJson("POST",`${this.backendUrl}/composer/apply`,{preview_id:u,approved:i,approval_reason:x??null},g)}async getToolManifests(u){return(await this.ambient.transport.fetchJson("GET",`${this.backendUrl}/tools/manifests`,void 0,u)).tools??[]}getSettings(u){return this.ambient.transport.fetchJson("GET",`${this.backendUrl}/composer/settings`,void 0,u)}updateSettings(u,i){return this.ambient.transport.fetchJson("PUT",`${this.backendUrl}/composer/settings`,u,i)}reportExecution(u,i){return this.ambient.transport.fetchJson("POST",`${this.backendUrl}/composer/execution`,u,i)}transcribeAudio(u,i,x,g){return this.ambient.transport.fetchJson("POST",`${this.backendUrl}/voice/transcribe`,{audio_base64:u,mime:i,language:x},g)}synthesizeSpeech(u,i,x){return this.ambient.transport.fetchJson("POST",`${this.backendUrl}/voice/synthesize`,{text:u,voice:i},x)}requestDomPlan(u,i,x){return this.ambient.transport.fetchJson("POST",`${this.backendUrl}/composer/dom_plan`,{context_id:u,user_input:i},x)}requestDomPlanStream(u,i,x){return this.ambient.transport.stream?this.ambient.transport.stream(`${this.backendUrl}/composer/dom_plan_stream`,{context_id:u,user_input:i},x):(x.onError("streaming not supported by this ambient"),()=>{})}}const Yu="gauntlet:pill_position",ii="gauntlet:dismissed_domains",Ju="gauntlet:screenshot_enabled",Gu="gauntlet:theme",qu="gauntlet:palette_recent",Xu="gauntlet:pill_mode",Zu="gauntlet:tts_enabled",ec=8,ic="light",Jp="corner",Gp={bottom:16,right:16};function tc(s){const u=typeof window<"u"?window.innerWidth:1280,i=typeof window<"u"?window.innerHeight:800,x=4,g=u-x,m=i-x;return{right:Math.max(-14,Math.min(g,s.right)),bottom:Math.max(-14,Math.min(m,s.bottom))}}function qp(s){return{async readPillPosition(){const u=await s.get(Yu);return u&&typeof u=="object"&&typeof u.bottom=="number"&&typeof u.right=="number"?tc(u):Gp},async writePillPosition(u){await s.set(Yu,tc(u))},async readDismissedDomains(){const u=await s.get(ii);return Array.isArray(u)?u.filter(i=>typeof i=="string"):[]},async dismissDomain(u){if(!u)return;const i=await this.readDismissedDomains();i.includes(u)||await s.set(ii,[...i,u])},async restoreDomain(u){if(!u)return;const i=await this.readDismissedDomains(),x=i.filter(g=>g!==u);x.length!==i.length&&await s.set(ii,x)},async isDomainDismissed(u){return u?(await this.readDismissedDomains()).includes(u):!1},async readScreenshotEnabled(){return await s.get(Ju)===!0},async writeScreenshotEnabled(u){await s.set(Ju,!!u)},async readTheme(){const u=await s.get(Gu);return u==="dark"||u==="light"?u:ic},async writeTheme(u){await s.set(Gu,u)},async readPaletteRecent(){const u=await s.get(qu);return Array.isArray(u)?u.filter(i=>typeof i=="string").slice(0,ec):[]},async notePaletteUse(u){if(!u)return;const i=await this.readPaletteRecent(),x=[u,...i.filter(g=>g!==u)].slice(0,ec);await s.set(qu,x)},async readPillMode(){const u=await s.get(Xu);return u==="cursor"||u==="corner"?u:Jp},async writePillMode(u){await s.set(Xu,u)},async readTtsEnabled(){return await s.get(Zu)===!0},async writeTtsEnabled(u){await s.set(Zu,!!u)}}}function Xp({ambient:s,initialSnapshot:u,onDismiss:i,cursorAnchor:x}){var dl,ln;const g=M.useMemo(()=>new Yp(s),[s]),m=M.useMemo(()=>qp(s.storage),[s]),j=(dl=s.domActions)==null?void 0:dl.execute,[E,k]=M.useState(u),[z,P]=M.useState(""),[S,F]=M.useState("idle"),[de,ne]=M.useState(null),[Z,re]=M.useState(!1),[D,Me]=M.useState(null),[Te,we]=M.useState(null),[Y,ce]=M.useState(!1),[ze,De]=M.useState(""),[wt,pt]=M.useState(!1),[Pt,at]=M.useState(ic),[Ye,ot]=M.useState([]),[ft,Ae]=M.useState([]),[ve,O]=M.useState(0),[K,$]=M.useState(!1),h=M.useRef(!1),b=M.useRef(null),[G,X]=M.useState(!1),le=M.useRef(""),[ae,ge]=M.useState(null),[oe,pe]=M.useState([]),[Ve,Mt]=M.useState(null),[qe,Hn]=M.useState(Tp),Lt=M.useRef(null),Wn=M.useRef(null),Rt=M.useRef(null),Dt=M.useRef(""),Cn=M.useRef(!1),[vr,Zt]=M.useState(0),Fe=M.useRef(null),[en,Vt]=M.useState(!1),[Qn,it]=M.useState(!1),[Kn,Yn]=M.useState(null),Ot=M.useMemo(()=>D?D.actions.map(Ip):[],[D]),Ht=M.useMemo(()=>D?Op(D.actions):{danger:!1},[D]),It=M.useMemo(()=>{if(!D||D.actions.length===0)return{forced:!1,reason:null};let _="";try{_=new URL(E.url).hostname.toLowerCase()}catch{}if((qe.domains[_]??qe.default_domain_policy).require_danger_ack)return{forced:!0,reason:_?`policy: domain '${_}' requires explicit confirmation`:"policy: default domain policy requires explicit confirmation"};for(const U of D.actions)if((qe.actions[U.type]??qe.default_action_policy).require_danger_ack)return{forced:!0,reason:`policy: action type '${U.type}' requires explicit confirmation`};return{forced:!1,reason:null}},[D,E.url,qe]),Xe=Ot.some(_=>_.danger)||Ht.danger||It.forced;M.useEffect(()=>{var _;return(_=Lt.current)==null||_.focus(),()=>{var R,U;(R=Wn.current)==null||R.abort(),(U=Rt.current)==null||U.call(Rt)}},[]),M.useEffect(()=>{k(u)},[u]),M.useEffect(()=>{let _=!1;return g.getToolManifests().then(R=>{_||ot(R)}).catch(()=>{}),m.readPaletteRecent().then(R=>{_||Ae(R)}),()=>{_=!0}},[g,m]),M.useEffect(()=>{const _=!!E.text;_&&!h.current&&($(!0),b.current!==null&&window.clearTimeout(b.current),b.current=window.setTimeout(()=>{$(!1),b.current=null},700)),h.current=_},[E.text]),M.useEffect(()=>()=>{b.current!==null&&(window.clearTimeout(b.current),b.current=null)},[]),M.useEffect(()=>{let _=!1;m.readTtsEnabled().then(U=>{_||X(U)});function R(U){const ee=U.detail;typeof(ee==null?void 0:ee.enabled)=="boolean"&&X(ee.enabled)}return window.addEventListener("gauntlet:tts",R),()=>{_=!0,window.removeEventListener("gauntlet:tts",R)}},[m]),M.useEffect(()=>{if(!G||S!=="plan_ready")return;const _=D==null?void 0:D.compose;if(_&&_!==le.current&&!(typeof window>"u"||!window.speechSynthesis))try{window.speechSynthesis.cancel();const R=new SpeechSynthesisUtterance(_);R.rate=1.05,R.pitch=1,window.speechSynthesis.speak(R),le.current=_}catch{}},[G,S,D==null?void 0:D.compose]),M.useEffect(()=>()=>{var _;try{(_=window.speechSynthesis)==null||_.cancel()}catch{}},[]),M.useEffect(()=>{let _=!1;return m.readTheme().then(R=>{_||at(R)}),()=>{_=!0}},[m]),M.useEffect(()=>{let _=!1;return g.getSettings().then(R=>{_||Hn(R)}).catch(()=>{}),()=>{_=!0}},[g]),M.useEffect(()=>{if(!s.capabilities.screenshot||!s.screenshot)return;let _=!1;return m.readScreenshotEnabled().then(R=>{const U=R||qe.screenshot_default;_||!U||s.screenshot.capture().then(ee=>{_||!ee||ge(ee)}).catch(()=>{})}),()=>{_=!0}},[s,m,qe.screenshot_default]);const ol=M.useCallback(()=>{k(s.selection.read())},[s]),il=M.useCallback(()=>{if(Fe.current)return;ne(null);const _=z,R={onPartial:ee=>{P(_?`${_} ${ee}`.trim():ee)},onCommit:ee=>{var me;P(_?`${_} ${ee}`.trim():ee),Vt(!1),Fe.current=null,(me=Lt.current)==null||me.focus()},onError:ee=>{ne(ee),Vt(!1),Fe.current=null}};if(s.capabilities.remoteVoice&&si()){Vt(!0),fp(g,R).then(ee=>{ee?Fe.current=ee:Vt(!1)});return}const U=pp(R);U&&(Fe.current=U,Vt(!0))},[z,s,g]),yr=M.useCallback(()=>{var _;(_=Fe.current)==null||_.stop()},[]),sl=M.useCallback(()=>{var _;(_=Fe.current)==null||_.abort(),Fe.current=null,Vt(!1)},[]);M.useEffect(()=>()=>{var _;(_=Fe.current)==null||_.abort()},[]),M.useEffect(()=>{function _(R){(R.metaKey||R.ctrlKey)&&(R.key==="k"||R.key==="K")&&(R.preventDefault(),R.stopPropagation(),it(ee=>!ee))}return window.addEventListener("keydown",_,!0),()=>window.removeEventListener("keydown",_,!0)},[]);const Nn=M.useCallback(_=>{Yn(_),window.setTimeout(()=>Yn(null),1400)},[]),Jn=M.useCallback(async()=>{const _=(D==null?void 0:D.compose)||E.text||z.trim();if(!_){ne("Nada para guardar — escreve um pedido ou recebe uma resposta.");return}const R=(z.trim()||E.pageTitle||"cápsula note").slice(0,200);try{await s.transport.fetchJson("POST",`${g.backendUrl}/memory/records`,{topic:R,body:_,kind:"note",scope:"user"}),Nn("saved")}catch(U){ne(U instanceof Error?`memória: ${U.message}`:"memória: falhou")}},[s,g,D,E,z,Nn]),kt=M.useCallback(async(_,R=[],U)=>{if(!D||D.actions.length===0)return;Cn.current=!0;const ee=D.actions.map((q,ie)=>{const he=R[ie],ke=Ot[ie];return{action:q,ok:he?he.ok:!1,error:(he==null?void 0:he.error)??null,danger:(ke==null?void 0:ke.danger)??!1,danger_reason:(ke==null?void 0:ke.reason)??null}}),me={plan_id:D.plan_id||null,context_id:D.context_id||null,url:E.url||null,page_title:E.pageTitle||null,status:_,results:ee,has_danger:Xe,sequence_danger_reason:Ht.danger?Ht.reason??null:null,danger_acknowledged:Y,error:U??null,model_used:D.model_used||null,plan_latency_ms:D.latency_ms||null,user_input:z.trim()||null};if(qe.execution_reporting_required)try{await g.reportExecution(me)}catch(q){const ie=q instanceof Error?q.message:String(q);ne(`policy: execution report rejected — ${ie}`),F("error")}else g.reportExecution(me).catch(()=>{})},[g,D,E,Ot,Xe,Ht,Y,z,qe.execution_reporting_required]),tn=M.useCallback(()=>{D&&D.actions.length>0&&!Cn.current&&kt("rejected"),i()},[D,i,kt]);M.useEffect(()=>{function _(R){if(R.key==="Escape"){if(R.preventDefault(),R.stopPropagation(),Qn){it(!1);return}if(Fe.current){sl();return}tn()}}return window.addEventListener("keydown",_,!0),()=>window.removeEventListener("keydown",_,!0)},[tn,Qn,sl]);const _r=M.useCallback(async()=>{const _=s.filesystem;if(_){Mt(null);try{const R=await _.pickFile();if(!R)return;const U=R.name.toLowerCase();if(/\.(png|jpe?g|gif|webp|svg)$/.test(U)){const{base64:me,mime:q}=await _.readFileBase64(R.path),ie=Math.ceil(me.length*3/4);pe(he=>[...he,{id:`att-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,kind:"image",name:R.name,mime:q,bytes:ie,base64:me,path:R.path}])}else{const me=await _.readTextFile(R.path);pe(q=>[...q,{id:`att-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,kind:"text",name:R.name,mime:"text/plain",bytes:new TextEncoder().encode(me).length,text:me,path:R.path}])}}catch(R){Mt(R instanceof Error?R.message:String(R))}}},[s]),nn=M.useCallback(async()=>{var R;const _=(R=s.screenshot)==null?void 0:R.captureScreen;if(_){Mt(null);try{const U=await _();if(!U){Mt("Captura de ecrã indisponível neste sistema.");return}const ee=Math.ceil(U.base64.length*3/4);pe(me=>[...me,{id:`att-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,kind:"image",name:`ecrã-${new Date().toISOString().slice(11,19)}.png`,mime:"image/png",bytes:ee,base64:U.base64,path:U.path}])}catch(U){Mt(U instanceof Error?U.message:String(U))}}},[s]),rn=M.useCallback(_=>{pe(R=>R.filter(U=>U.id!==_))},[]),wr=M.useCallback(_=>{if(oe.length===0)return _;const R=[];for(const U of oe)if(U.kind==="text"&&U.text!=null)R.push(`<file name="${U.name}" path="${U.path??""}">
${U.text}
</file>`);else if(U.kind==="image"){const ee=Math.max(1,Math.round(U.bytes/1024));R.push(`<image name="${U.name}" bytes="${U.bytes}" mime="${U.mime}">[${ee} KB image attached — describe in prompt; multimodal payload arrives in A2]</image>`)}return`${R.join(`

`)}

${_}`},[oe]),jn=M.useCallback(async()=>{var ee,me;if(!z.trim()||S==="planning"||S==="streaming"||S==="executing")return;D&&D.actions.length>0&&!Cn.current&&kt("rejected"),(ee=Wn.current)==null||ee.abort(),(me=Rt.current)==null||me.call(Rt);const _=new AbortController;Wn.current=_,F("planning"),ne(null),Me(null),we(null),ce(!1),re(!1),De(""),Zt(0),Dt.current="",Cn.current=!1;const R=await m.readScreenshotEnabled(),U=lf(E,R?ae:null);try{const q=await g.captureContext(U,_.signal);if(_.signal.aborted)return;const ie=wr(z.trim());Rt.current=g.requestDomPlanStream(q.context_id,ie,{onDelta:he=>{if(_.signal.aborted)return;Dt.current+=he,Zt(St=>St+1);const ke=rf(Dt.current);ke!==null?(De(ke),F(St=>St==="planning"?"streaming":St)):F(St=>St==="planning"?"streaming":St)},onDone:he=>{_.signal.aborted||(Me(he),F("plan_ready"),De(""),Dt.current="")},onError:he=>{_.signal.aborted||(async()=>{try{const ke=await g.requestDomPlan(q.context_id,ie,_.signal);if(_.signal.aborted)return;Me(ke),F("plan_ready"),De(""),Dt.current=""}catch(ke){if(_.signal.aborted)return;const St=ke instanceof Error?ke.message:String(ke);ne(`stream: ${he} · fallback: ${St}`),F("error"),De(""),Dt.current=""}})()}})}catch(q){if(_.signal.aborted)return;ne(q instanceof Error?q.message:String(q)),F("error")}},[g,E,ae,z,S,D,kt,wr,m]),ul=M.useCallback(_=>{var R;_.preventDefault(),O(U=>U+1);try{(R=window.speechSynthesis)==null||R.cancel()}catch{}le.current="",jn()},[jn]),cl=M.useCallback(_=>{_.key==="Enter"&&(_.shiftKey||(_.preventDefault(),jn()))},[jn]),kr=M.useCallback(async()=>{if(D!=null&&D.compose)try{await navigator.clipboard.writeText(D.compose),re(!0),window.setTimeout(()=>re(!1),1500)}catch{ne("Clipboard write blocked. Select the text and copy manually.")}},[D]),Sr=M.useCallback(async()=>{if(!(!j||!D||D.actions.length===0)&&!(Xe&&!Y)){F("executing"),ne(null);try{const _=await j(D.actions);we(_),F("executed");const R=_.every(U=>U.ok);window.dispatchEvent(new CustomEvent("gauntlet:execute-result",{detail:{ok:R}})),await kt("executed",_)}catch(_){const R=_ instanceof Error?_.message:String(_);ne(R),F("error"),window.dispatchEvent(new CustomEvent("gauntlet:execute-result",{detail:{ok:!1}})),await kt("failed",[],R)}}},[j,D,Xe,Y,kt]),Tn=M.useMemo(()=>E.bbox?E.bbox:x?{x:x.x,y:x.y,width:0,height:0}:null,[E.bbox,x]),zn=M.useMemo(()=>{if(!Tn)return;const _=typeof window<"u"?window.innerWidth:1280,R=typeof window<"u"?window.innerHeight:800,U=of(_,R),ee=sf(Tn,{width:_,height:R},U);return{top:`${ee.top}px`,left:`${ee.left}px`}},[Tn]),br=`gauntlet-capsule--phase-${S}`,Pn=["gauntlet-capsule","gauntlet-capsule--floating",Tn?"gauntlet-capsule--anchored":"gauntlet-capsule--centered",E.text?null:"gauntlet-capsule--no-selection",br].filter(Boolean).join(" ");return M.useEffect(()=>{window.dispatchEvent(new CustomEvent("gauntlet:phase",{detail:{phase:S}}))},[S]),d.jsxs("div",{className:Pn,"data-theme":Pt,role:"dialog","aria-label":"Gauntlet",style:zn,children:[d.jsx("div",{className:"gauntlet-capsule__aurora","aria-hidden":!0}),d.jsxs("div",{className:"gauntlet-capsule__layout",children:[d.jsxs("div",{className:"gauntlet-capsule__panel gauntlet-capsule__panel--left",children:[d.jsxs("header",{className:"gauntlet-capsule__header",children:[d.jsxs("div",{className:"gauntlet-capsule__brand-block",children:[d.jsx("span",{className:"gauntlet-capsule__mark","aria-hidden":!0,children:d.jsx("span",{className:"gauntlet-capsule__mark-dot"})}),d.jsxs("div",{className:"gauntlet-capsule__brand-text",children:[d.jsx("span",{className:"gauntlet-capsule__brand",children:"GAUNTLET"}),d.jsx("span",{className:"gauntlet-capsule__tagline",children:"cursor · capsule"})]})]}),d.jsxs("div",{className:"gauntlet-capsule__header-actions",children:[d.jsx("button",{type:"button",className:"gauntlet-capsule__settings-btn",onClick:()=>pt(_=>!_),"aria-label":"Definições","aria-expanded":wt,title:"Definições",children:d.jsx("span",{"aria-hidden":!0,children:"···"})}),d.jsx("button",{type:"button",className:"gauntlet-capsule__close",onClick:tn,"aria-label":"Dismiss capsule (Esc)",children:d.jsx("span",{"aria-hidden":!0,children:"esc"})})]})]}),wt&&d.jsx(nf,{onClose:()=>pt(!1),showScreenshot:s.capabilities.screenshot,showDismissedDomains:s.capabilities.dismissDomain,showPillMode:s.capabilities.pillSurface,prefs:m,theme:Pt,onChangeTheme:_=>{at(_),m.writeTheme(_)}}),d.jsxs("section",{className:"gauntlet-capsule__context",children:[d.jsxs("div",{className:"gauntlet-capsule__context-meta",children:[d.jsx("span",{className:`gauntlet-capsule__source${K?" gauntlet-capsule__source--popped":""}`,children:"browser"}),d.jsx("span",{className:"gauntlet-capsule__url",title:E.url,children:E.pageTitle||E.url}),d.jsx("button",{type:"button",className:"gauntlet-capsule__refresh",onClick:ol,title:"Re-read current selection",children:"re-read"})]}),E.text?d.jsx("pre",{className:"gauntlet-capsule__selection",children:sc(E.text,600)}):d.jsx(tf,{snapshot:E,screenshotEnabled:ae!==null})]})]}),d.jsxs("div",{className:"gauntlet-capsule__panel gauntlet-capsule__panel--right",children:[d.jsxs("form",{className:"gauntlet-capsule__form",onSubmit:ul,children:[oe.length>0&&d.jsx("div",{className:"gauntlet-capsule__attachments","aria-label":"Anexos",children:oe.map(_=>d.jsxs("span",{className:`gauntlet-capsule__attachment gauntlet-capsule__attachment--${_.kind}`,title:_.path??_.name,children:[d.jsx("span",{className:"gauntlet-capsule__attachment-icon","aria-hidden":!0,children:_.kind==="image"?"◫":"⌥"}),d.jsx("span",{className:"gauntlet-capsule__attachment-name",children:_.name}),d.jsx("span",{className:"gauntlet-capsule__attachment-size",children:_.bytes<1024?`${_.bytes} B`:_.bytes<1024*1024?`${Math.round(_.bytes/1024)} KB`:`${(_.bytes/(1024*1024)).toFixed(1)} MB`}),d.jsx("button",{type:"button",className:"gauntlet-capsule__attachment-remove",onClick:()=>rn(_.id),"aria-label":`Remover ${_.name}`,children:"×"})]},_.id))}),Ve&&d.jsx("div",{className:"gauntlet-capsule__attach-error",role:"alert",children:Ve}),d.jsx("textarea",{ref:Lt,className:"gauntlet-capsule__input",placeholder:"O que queres? — Enter para enviar, Shift+Enter nova linha",value:z,onChange:_=>P(_.target.value),onKeyDown:cl,rows:2,disabled:S==="planning"||S==="streaming"||S==="executing"}),d.jsxs("div",{className:"gauntlet-capsule__actions",children:[d.jsxs("span",{className:"gauntlet-capsule__hint","aria-hidden":!0,children:[d.jsx("span",{className:"gauntlet-capsule__kbd",children:"↵"}),d.jsx("span",{className:"gauntlet-capsule__kbd-sep",children:"·"}),d.jsx("span",{className:"gauntlet-capsule__kbd",children:"⌘K"})]}),s.capabilities.filesystemRead&&s.filesystem&&d.jsxs("button",{type:"button",className:"gauntlet-capsule__attach-btn",onClick:()=>void _r(),"aria-label":"Anexar ficheiro local",title:"Anexar ficheiro do disco",disabled:S==="planning"||S==="streaming"||S==="executing",children:[d.jsx("svg",{viewBox:"0 0 24 24",width:"13",height:"13","aria-hidden":!0,children:d.jsx("path",{d:"M14 4l-2 0 0 8-3 0 4 5 4-5-3 0 0-8z",transform:"rotate(45 12 12)",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinejoin:"round"})}),d.jsx("span",{className:"gauntlet-capsule__attach-label",children:"anexar"})]}),s.capabilities.screenCapture&&((ln=s.screenshot)==null?void 0:ln.captureScreen)&&d.jsxs("button",{type:"button",className:"gauntlet-capsule__attach-btn",onClick:()=>void nn(),"aria-label":"Capturar ecrã inteiro",title:"Capturar ecrã inteiro",disabled:S==="planning"||S==="streaming"||S==="executing",children:[d.jsxs("svg",{viewBox:"0 0 24 24",width:"13",height:"13","aria-hidden":!0,children:[d.jsx("rect",{x:"3",y:"5",width:"18",height:"13",rx:"2",fill:"none",stroke:"currentColor",strokeWidth:"1.6"}),d.jsx("circle",{cx:"12",cy:"11.5",r:"2.4",fill:"none",stroke:"currentColor",strokeWidth:"1.6"})]}),d.jsx("span",{className:"gauntlet-capsule__attach-label",children:"ecrã"})]}),(cp()||s.capabilities.remoteVoice&&si())&&d.jsxs("button",{type:"button",className:`gauntlet-capsule__voice${en?" gauntlet-capsule__voice--active":""}`,onPointerDown:_=>{_.preventDefault(),il()},onPointerUp:()=>yr(),onPointerLeave:()=>{en&&yr()},"aria-label":en?"A ouvir — solta para enviar":"Premer e falar",title:"Premir e falar",disabled:S==="planning"||S==="streaming"||S==="executing",children:[d.jsxs("svg",{viewBox:"0 0 24 24",width:"13",height:"13","aria-hidden":!0,children:[d.jsx("path",{d:"M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3z",fill:"currentColor"}),d.jsx("path",{d:"M19 11a7 7 0 0 1-14 0M12 18v3",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",fill:"none"})]}),d.jsx("span",{className:"gauntlet-capsule__voice-label",children:en?"a ouvir":"voz"})]}),d.jsxs("button",{type:"submit",className:"gauntlet-capsule__compose",disabled:S==="planning"||S==="streaming"||S==="executing"||!z.trim(),children:[ve>0&&d.jsx("span",{className:"gauntlet-capsule__compose-ripple","aria-hidden":!0},ve),S==="planning"||S==="streaming"?d.jsxs(d.Fragment,{children:[d.jsx("span",{className:"gauntlet-capsule__compose-spinner","aria-hidden":!0}),d.jsx("span",{children:S==="planning"?"a pensar":"a escrever"})]}):"Enviar"]})]})]}),S==="streaming"&&ze&&d.jsxs("section",{className:"gauntlet-capsule__compose-result gauntlet-capsule__compose-result--streaming",children:[d.jsxs("header",{className:"gauntlet-capsule__compose-meta",children:[d.jsx("span",{className:"gauntlet-capsule__compose-tag",children:"resposta"}),d.jsxs("span",{className:"gauntlet-capsule__compose-meta-text",children:[d.jsxs("span",{className:"gauntlet-capsule__token-counter","aria-live":"polite",children:[vr," chunks"]}),d.jsx("span",{"aria-hidden":!0,children:"·"}),d.jsx("span",{children:"a escrever…"})]})]}),d.jsxs("div",{className:"gauntlet-capsule__compose-text gauntlet-capsule__compose-text--streaming",children:[ze,d.jsx("span",{className:"gauntlet-capsule__compose-caret","aria-hidden":!0,children:"▍"})]})]}),(S==="planning"||S==="streaming"&&!ze)&&d.jsxs("section",{className:"gauntlet-capsule__skeleton",role:"status","aria-live":"polite","aria-label":"A pensar...",children:[d.jsxs("header",{className:"gauntlet-capsule__skeleton-header",children:[d.jsx("span",{className:"gauntlet-capsule__skeleton-tag"}),d.jsx("span",{className:"gauntlet-capsule__skeleton-meta"})]}),d.jsx("div",{className:"gauntlet-capsule__skeleton-line gauntlet-capsule__skeleton-line--w90"}),d.jsx("div",{className:"gauntlet-capsule__skeleton-line gauntlet-capsule__skeleton-line--w75"}),d.jsx("div",{className:"gauntlet-capsule__skeleton-line gauntlet-capsule__skeleton-line--w55"})]}),(D==null?void 0:D.compose)&&S==="plan_ready"&&d.jsxs("section",{className:"gauntlet-capsule__compose-result",children:[d.jsxs("header",{className:"gauntlet-capsule__compose-meta",children:[d.jsx("span",{className:"gauntlet-capsule__compose-tag",children:"resposta"}),d.jsxs("span",{className:"gauntlet-capsule__compose-meta-text",children:[D.model_used," · ",D.latency_ms," ms"]})]}),d.jsx("div",{className:"gauntlet-capsule__compose-text",children:d.jsx(vp,{source:D.compose,onCopyBlock:()=>Nn("code copied")})}),d.jsxs("div",{className:"gauntlet-capsule__compose-actions",children:[d.jsx("button",{type:"button",className:"gauntlet-capsule__copy",onClick:()=>void kr(),children:Z?"copiado ✓":"Copy"}),d.jsx("button",{type:"button",className:"gauntlet-capsule__copy gauntlet-capsule__copy--ghost",onClick:()=>void Jn(),children:Kn==="saved"?"guardado ✓":"Save"})]})]}),D&&D.actions.length===0&&!D.compose&&S==="plan_ready"&&d.jsx("section",{className:"gauntlet-capsule__plan",children:d.jsx("p",{className:"gauntlet-capsule__plan-empty",children:D.reason??"Modelo não conseguiu planear."})}),D&&D.actions.length>0&&(S==="plan_ready"||S==="executing"||S==="executed")&&d.jsxs("section",{className:"gauntlet-capsule__plan",children:[d.jsxs("header",{className:"gauntlet-capsule__plan-header",children:[d.jsx("span",{className:"gauntlet-capsule__plan-title",children:"plano"}),d.jsxs("span",{className:"gauntlet-capsule__plan-meta",children:[D.actions.length," action",D.actions.length===1?"":"s"," · ",D.model_used," · ",D.latency_ms," ms"]})]}),d.jsx("ol",{className:"gauntlet-capsule__plan-list",children:D.actions.map((_,R)=>{const U=Te==null?void 0:Te[R],ee=U?U.ok?"ok":"fail":"pending",me=Ot[R];return d.jsxs("li",{className:`gauntlet-capsule__plan-item gauntlet-capsule__plan-item--${ee}${me!=null&&me.danger?" gauntlet-capsule__plan-item--danger":""}`,children:[d.jsx("span",{className:"gauntlet-capsule__plan-step",children:R+1}),d.jsx("span",{className:"gauntlet-capsule__plan-desc",children:af(_)}),(me==null?void 0:me.danger)&&d.jsx("span",{className:"gauntlet-capsule__plan-danger",title:me.reason,children:"sensível"}),U&&!U.ok&&d.jsx("span",{className:"gauntlet-capsule__plan-err",title:U.error,children:U.error})]},`${R}-${_.type}-${_.selector}`)})}),S!=="executed"&&Xe&&d.jsxs("div",{className:"gauntlet-capsule__danger-gate",role:"alert",children:[d.jsxs("header",{className:"gauntlet-capsule__danger-header",children:[d.jsx("span",{className:"gauntlet-capsule__danger-mark","aria-hidden":!0,children:"!"}),d.jsx("span",{className:"gauntlet-capsule__danger-title",children:"Acções sensíveis no plano"})]}),d.jsxs("ul",{className:"gauntlet-capsule__danger-list",children:[It.forced&&It.reason&&d.jsxs("li",{children:[d.jsx("strong",{children:"governança:"})," ",It.reason]},"danger-policy"),Ht.danger&&d.jsxs("li",{children:[d.jsx("strong",{children:"cadeia:"})," ",Ht.reason??"flagged"]},"danger-sequence"),Ot.map((_,R)=>_.danger?d.jsxs("li",{children:[d.jsxs("strong",{children:["step ",R+1,":"]})," ",_.reason??"flagged"]},`danger-${R}`):null)]}),d.jsxs("label",{className:"gauntlet-capsule__danger-confirm",children:[d.jsx("input",{type:"checkbox",checked:Y,onChange:_=>ce(_.target.checked),disabled:S==="executing"}),d.jsx("span",{children:"Confirmo, executar mesmo assim."})]})]}),S!=="executed"&&j&&d.jsx("div",{className:"gauntlet-capsule__plan-actions",children:d.jsx("button",{type:"button",className:`gauntlet-capsule__execute${Xe?" gauntlet-capsule__execute--danger":""}`,onClick:()=>void Sr(),disabled:S==="executing"||Xe&&!Y,children:S==="executing"?"executando…":Xe?"Executar com cuidado":"Executar"})}),S!=="executed"&&!j&&d.jsx("p",{className:"gauntlet-capsule__plan-empty",children:"esta superfície não tem acesso a uma página viva — abre o Gauntlet num separador para executar acções."})]}),S==="error"&&de&&d.jsxs("div",{className:"gauntlet-capsule__error",role:"alert",children:[d.jsx("span",{className:"gauntlet-capsule__error-icon","aria-hidden":!0,children:"!"}),d.jsx("span",{children:de})]})]})]}),Qn&&d.jsx(ef,{onClose:()=>it(!1),recentIds:ft,actions:(()=>{const _=q=>{Ae(ie=>[q,...ie.filter(ke=>ke!==q)].slice(0,8)),m.notePaletteUse(q)},R=q=>{P(ie=>{const he=ie.trimEnd(),ke=`usa a tool ${q} para `;return he.startsWith("usa a tool ")?ke:he?`${ke}${he}`:ke}),window.setTimeout(()=>{const ie=Lt.current;ie&&(ie.focus(),ie.setSelectionRange(ie.value.length,ie.value.length))},0)},U=[{id:"focus",label:"Focar input",shortcut:"↵",group:"action",run:()=>{_("focus"),it(!1),window.setTimeout(()=>{var q;return(q=Lt.current)==null?void 0:q.focus()},0)}},{id:"copy",label:"Copiar resposta",shortcut:"⌘C",group:"action",disabled:!(D!=null&&D.compose),run:()=>{_("copy"),it(!1),kr()}},{id:"save",label:"Guardar em memória",shortcut:"S",group:"action",disabled:!(D!=null&&D.compose)&&!E.text&&!z.trim(),run:()=>{_("save"),it(!1),Jn()}},{id:"reread",label:"Re-ler contexto",shortcut:"R",group:"action",run:()=>{_("reread"),it(!1),ol()}},{id:"clear",label:"Limpar input",shortcut:"X",group:"action",disabled:!z,run:()=>{var q;_("clear"),it(!1),P(""),(q=Lt.current)==null||q.focus()}},{id:"dismiss",label:"Fechar cápsula",shortcut:"Esc",group:"action",run:()=>{_("dismiss"),it(!1),tn()}}],me=Ye.filter(q=>{var he;const ie=(he=qe.tool_policies)==null?void 0:he[q.name];return!ie||ie.allowed!==!1}).map(q=>{var ie,he;return{id:`tool:${q.name}`,label:q.name,description:q.description,shortcut:"",group:"tool",mode:q.mode,risk:q.risk,requiresApproval:((he=(ie=qe.tool_policies)==null?void 0:ie[q.name])==null?void 0:he.require_approval)===!0,run:()=>{_(`tool:${q.name}`),it(!1),R(q.name)}}});return[...U,...me]})()}),Kn&&d.jsx("div",{className:"gauntlet-capsule__flash",role:"status","aria-live":"polite",children:Kn})]})}function Zp(s,u){if(!s)return 0;const i=s.toLowerCase(),x=u.toLowerCase();if(x.includes(i))return 1e3-x.indexOf(i);let g=0,m=0,j=-2;for(let E=0;E<x.length&&g<i.length;E++)x[E]===i[g]&&(E!==j+1&&m++,j=E,g++);return g<i.length?-1:500-m*10-(x.length-i.length)}function ef({actions:s,onClose:u,recentIds:i}){const[x,g]=M.useState(""),[m,j]=M.useState(0),E=M.useRef(null);M.useEffect(()=>{var P;(P=E.current)==null||P.focus()},[]);const k=M.useMemo(()=>{if(!x){const S=new Map(i.map((ne,Z)=>[ne,Z])),F=ne=>{const Z=S.get(ne.id);return Z===void 0?i.length:Z};return[...s].sort((ne,Z)=>{const re=F(ne),D=F(Z);if(re!==D)return re-D;const Me=Y=>Y==="tool"?1:0,Te=Me(ne.group),we=Me(Z.group);return Te!==we?Te-we:ne.label.localeCompare(Z.label)})}return s.map(S=>{const F=`${S.label} ${S.id} ${S.description??""}`;return{a:S,score:Zp(x,F)}}).filter(S=>S.score>=0).sort((S,F)=>F.score-S.score).map(S=>S.a)},[s,x,i]);M.useEffect(()=>{m>=k.length&&j(0)},[k.length,m]);const z=M.useCallback(P=>{if(P.key==="ArrowDown")P.preventDefault(),j(S=>Math.min(S+1,k.length-1));else if(P.key==="ArrowUp")P.preventDefault(),j(S=>Math.max(S-1,0));else if(P.key==="Enter"){P.preventDefault();const S=k[m];S&&!S.disabled&&S.run()}},[k,m]);return d.jsxs("div",{className:"gauntlet-capsule__palette",role:"dialog","aria-label":"Command palette",children:[d.jsx("div",{className:"gauntlet-capsule__palette-scrim",onClick:u}),d.jsxs("div",{className:"gauntlet-capsule__palette-panel",onKeyDown:z,children:[d.jsx("input",{ref:E,className:"gauntlet-capsule__palette-input",type:"text",placeholder:"comandos · tools…  (↑↓ para navegar, ↵ para correr, esc para fechar)",value:x,onChange:P=>g(P.target.value)}),d.jsx("ul",{className:"gauntlet-capsule__palette-list",role:"listbox",children:k.length===0?d.jsx("li",{className:"gauntlet-capsule__palette-empty",children:"sem resultados"}):k.map((P,S)=>d.jsxs("li",{role:"option","aria-selected":S===m,"aria-disabled":P.disabled,onMouseEnter:()=>j(S),onClick:()=>{P.disabled||P.run()},className:`gauntlet-capsule__palette-item${S===m?" gauntlet-capsule__palette-item--active":""}${P.disabled?" gauntlet-capsule__palette-item--disabled":""}${P.group==="tool"?" gauntlet-capsule__palette-item--tool":""}`,children:[d.jsxs("div",{className:"gauntlet-capsule__palette-main",children:[d.jsx("span",{className:"gauntlet-capsule__palette-label",children:P.label}),P.description&&d.jsx("span",{className:"gauntlet-capsule__palette-desc",children:P.description})]}),d.jsxs("div",{className:"gauntlet-capsule__palette-meta",children:[P.mode&&d.jsx("span",{className:`gauntlet-capsule__palette-badge gauntlet-capsule__palette-badge--mode-${P.mode}`,title:`mode: ${P.mode}`,children:P.mode}),P.risk&&P.risk!=="low"&&d.jsx("span",{className:`gauntlet-capsule__palette-badge gauntlet-capsule__palette-badge--risk-${P.risk}`,title:`risk: ${P.risk}`,children:P.risk}),P.requiresApproval&&d.jsx("span",{className:"gauntlet-capsule__palette-badge gauntlet-capsule__palette-badge--approval",title:"requires explicit approval before running",children:"approval"}),P.shortcut&&d.jsx("span",{className:"gauntlet-capsule__palette-shortcut",children:P.shortcut})]})]},P.id))})]})]})}function sc(s,u){return s.length<=u?s:s.slice(0,u)+"…"}function tf({snapshot:s,screenshotEnabled:u}){const i=(()=>{if(!s.domSkeleton)return 0;try{const g=JSON.parse(s.domSkeleton);if(Array.isArray(g))return g.length}catch{}return 0})(),x=!!s.pageText;return d.jsxs("ul",{className:"gauntlet-capsule__context-summary","aria-label":"context",children:[d.jsxs("li",{children:[d.jsx("span",{className:"gauntlet-capsule__context-key",children:"selection"}),d.jsx("span",{className:"gauntlet-capsule__context-val gauntlet-capsule__context-val--muted",children:"none"})]}),d.jsxs("li",{children:[d.jsx("span",{className:"gauntlet-capsule__context-key",children:"page captured"}),d.jsx("span",{className:"gauntlet-capsule__context-val",children:x?"yes":"no"})]}),d.jsxs("li",{children:[d.jsx("span",{className:"gauntlet-capsule__context-key",children:"DOM captured"}),d.jsx("span",{className:"gauntlet-capsule__context-val",children:i>0?`${i} elements`:"—"})]}),d.jsxs("li",{children:[d.jsx("span",{className:"gauntlet-capsule__context-key",children:"screenshot"}),d.jsx("span",{className:"gauntlet-capsule__context-val",children:u?"on":"off"})]})]})}function nf({onClose:s,showScreenshot:u,prefs:i,showDismissedDomains:x,theme:g,onChangeTheme:m,showPillMode:j}){const[E,k]=M.useState([]),[z,P]=M.useState(!0),[S,F]=M.useState(!1),[de,ne]=M.useState("corner"),[Z,re]=M.useState(!1);M.useEffect(()=>{let Y=!1;return x&&i.readDismissedDomains().then(ce=>{Y||k(ce)}),i.readScreenshotEnabled().then(ce=>{Y||(F(ce),P(!1))}),i.readPillMode().then(ce=>{Y||ne(ce)}),i.readTtsEnabled().then(ce=>{Y||re(ce)}),()=>{Y=!0}},[i,x]);const D=M.useCallback(async Y=>{ne(Y),await i.writePillMode(Y),window.dispatchEvent(new CustomEvent("gauntlet:pill-mode",{detail:{mode:Y}}))},[i]),Me=M.useCallback(async Y=>{var ce;if(re(Y),await i.writeTtsEnabled(Y),!Y)try{(ce=window.speechSynthesis)==null||ce.cancel()}catch{}window.dispatchEvent(new CustomEvent("gauntlet:tts",{detail:{enabled:Y}}))},[i]),Te=M.useCallback(async Y=>{await i.restoreDomain(Y),k(ce=>ce.filter(ze=>ze!==Y))},[i]),we=M.useCallback(async Y=>{F(Y),await i.writeScreenshotEnabled(Y)},[i]);return d.jsxs("section",{className:"gauntlet-capsule__settings",role:"region","aria-label":"Definições",children:[d.jsxs("header",{className:"gauntlet-capsule__settings-header",children:[d.jsx("span",{className:"gauntlet-capsule__settings-title",children:"definições"}),d.jsx("button",{type:"button",className:"gauntlet-capsule__settings-close",onClick:s,"aria-label":"Fechar definições",children:"×"})]}),d.jsxs("div",{className:"gauntlet-capsule__settings-section",children:[d.jsx("span",{className:"gauntlet-capsule__settings-subtitle",children:"aparência"}),d.jsxs("div",{className:"gauntlet-capsule__theme-switch",role:"radiogroup","aria-label":"tema",children:[d.jsxs("button",{type:"button",className:`gauntlet-capsule__theme-option${g==="light"?" gauntlet-capsule__theme-option--active":""}`,onClick:()=>m("light"),role:"radio","aria-checked":g==="light",children:[d.jsx("span",{className:"gauntlet-capsule__theme-swatch gauntlet-capsule__theme-swatch--light","aria-hidden":!0}),d.jsx("span",{children:"flagship light"})]}),d.jsxs("button",{type:"button",className:`gauntlet-capsule__theme-option${g==="dark"?" gauntlet-capsule__theme-option--active":""}`,onClick:()=>m("dark"),role:"radio","aria-checked":g==="dark",children:[d.jsx("span",{className:"gauntlet-capsule__theme-swatch gauntlet-capsule__theme-swatch--dark","aria-hidden":!0}),d.jsx("span",{children:"night premium"})]})]})]}),j&&d.jsxs("div",{className:"gauntlet-capsule__settings-section",children:[d.jsx("span",{className:"gauntlet-capsule__settings-subtitle",children:"pill"}),d.jsxs("div",{className:"gauntlet-capsule__theme-switch",role:"radiogroup","aria-label":"pill mode",children:[d.jsxs("button",{type:"button",className:`gauntlet-capsule__theme-option${de==="corner"?" gauntlet-capsule__theme-option--active":""}`,onClick:()=>void D("corner"),role:"radio","aria-checked":de==="corner",children:[d.jsx("span",{className:"gauntlet-capsule__theme-swatch gauntlet-capsule__pill-mode-swatch--corner","aria-hidden":!0}),d.jsx("span",{children:"resting corner"})]}),d.jsxs("button",{type:"button",className:`gauntlet-capsule__theme-option${de==="cursor"?" gauntlet-capsule__theme-option--active":""}`,onClick:()=>void D("cursor"),role:"radio","aria-checked":de==="cursor",children:[d.jsx("span",{className:"gauntlet-capsule__theme-swatch gauntlet-capsule__pill-mode-swatch--cursor","aria-hidden":!0}),d.jsx("span",{children:"cursor pill"})]})]})]}),u&&d.jsx("div",{className:"gauntlet-capsule__settings-section",children:d.jsxs("label",{className:"gauntlet-capsule__settings-toggle",children:[d.jsx("input",{type:"checkbox",checked:S,onChange:Y=>void we(Y.target.checked)}),d.jsxs("span",{className:"gauntlet-capsule__settings-toggle-label",children:[d.jsx("strong",{children:"incluir screenshot"}),d.jsx("small",{children:"o modelo vê a página visível. útil para layouts e imagens, exposição de senhas/DMs visíveis. opt-in."})]})]})}),d.jsx("div",{className:"gauntlet-capsule__settings-section",children:d.jsxs("label",{className:"gauntlet-capsule__settings-toggle",children:[d.jsx("input",{type:"checkbox",checked:Z,onChange:Y=>void Me(Y.target.checked)}),d.jsxs("span",{className:"gauntlet-capsule__settings-toggle-label",children:[d.jsx("strong",{children:"ler resposta em voz alta"}),d.jsx("small",{children:"quando o modelo termina, a cápsula fala a resposta via Web Speech. cancela ao submeter outro pedido ou fechar a cápsula."})]})]})}),d.jsxs("div",{className:"gauntlet-capsule__settings-section",children:[d.jsx("span",{className:"gauntlet-capsule__settings-subtitle",children:"domínios escondidos"}),z?d.jsx("p",{className:"gauntlet-capsule__settings-empty",children:"a carregar…"}):E.length===0?d.jsx("p",{className:"gauntlet-capsule__settings-empty",children:"nenhum — clica direito no pill em qualquer site para o esconder."}):d.jsx("ul",{className:"gauntlet-capsule__settings-list",children:E.map(Y=>d.jsxs("li",{className:"gauntlet-capsule__settings-row",children:[d.jsx("span",{className:"gauntlet-capsule__settings-host",children:Y}),d.jsx("button",{type:"button",className:"gauntlet-capsule__settings-restore",onClick:()=>void Te(Y),children:"restaurar"})]},Y))})]})]})}function rf(s){const u=s.match(/"compose"\s*:\s*"((?:[^"\\]|\\.)*)/);if(!u)return null;let i=u[1];return i.endsWith("\\")&&!i.endsWith("\\\\")&&(i=i.slice(0,-1)),i.replace(/\\n/g,`
`).replace(/\\r/g,"\r").replace(/\\t/g,"	").replace(/\\"/g,'"').replace(/\\\\/g,"\\")}function lf(s,u){const i={};return s.pageText&&(i.page_text=s.pageText),s.domSkeleton&&(i.dom_skeleton=s.domSkeleton),s.bbox&&(i.selection_bbox=s.bbox),u&&(i.screenshot_data_url=u),{source:"browser",url:s.url,page_title:s.pageTitle,selection:s.text||void 0,metadata:Object.keys(i).length>0?i:void 0}}function af(s){switch(s.type){case"fill":return`fill ${s.selector} ← "${sc(s.value,80)}"`;case"click":return`click ${s.selector}`;case"highlight":return`highlight ${s.selector}`;case"scroll_to":return`scroll to ${s.selector}`}}const _t=16,En=12;function va(s,u,i){return i<u||s<u?u:s>i?i:s}function of(s,u){if(s<=600)return{width:Math.max(0,s-24),height:Math.max(0,u-24)};const x=va(.72*s,560,820),g=va(.72*u,420,560);return{width:x,height:g}}function sf(s,u,i){if(!s)return{top:Math.max(_t,Math.floor((u.height-i.height)/2)),left:Math.max(_t,Math.floor((u.width-i.width)/2)),placement:"center"};const x=u.height-(s.y+s.height)-En-_t,g=s.y-En-_t,m=u.width-(s.x+s.width)-En-_t,j=s.x-En-_t,E=x>=i.height,k=g>=i.height,z=m>=i.width,P=j>=i.width;let S,F,de;E?(S="below",F=s.y+s.height+En,de=s.x):k?(S="above",F=s.y-En-i.height,de=s.x):z?(S="right",de=s.x+s.width+En,F=Math.floor(s.y+s.height/2-i.height/2)):P?(S="left",de=s.x-En-i.width,F=Math.floor(s.y+s.height/2-i.height/2)):(S="center",F=Math.floor((u.height-i.height)/2),de=Math.floor((u.width-i.width)/2));const ne=u.height-i.height-_t,Z=u.width-i.width-_t;return F=va(F,_t,Math.max(_t,ne)),de=va(de,_t,Math.max(_t,Z)),{top:F,left:de,placement:S}}const uf=`
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
`,cf=100,df=new Set(["script","style","meta","link","noscript","head","html","br","hr","wbr"]),pf="gauntlet-capsule-host";function ff(s){const u=s.tagName.toLowerCase(),i=s.getAttribute("id");if(i&&!i.startsWith("gauntlet-"))return`${u}#${CSS.escape(i)}`;const x=s.getAttribute("name");if(x)return`${u}[name="${x}"]`;const g=s.getAttribute("type");if(g)return`${u}[type="${g}"]`;const m=Array.from(s.classList).filter(j=>j.length>2&&!j.startsWith("is-")&&!j.startsWith("has-")).slice(0,2);return m.length>0?`${u}.${m.map(j=>CSS.escape(j)).join(".")}`:u}function gf(s){try{const u=window.getComputedStyle(s);if(u.display==="none"||u.visibility==="hidden"||u.opacity==="0")return!1;const i=s.getBoundingClientRect();return!(i.width===0&&i.height===0||i.bottom<0||i.top>window.innerHeight||i.right<0||i.left>window.innerWidth)}catch{return!1}}function mf(s){let u=0,i=s;for(;i&&i!==document.body;)u++,i=i.parentElement;return u}function hf(s){var i;let u=s;for(;u;){if(u.id===pf||(i=u.id)!=null&&i.startsWith("gauntlet-"))return!0;u=u.parentElement}return!1}function xf(s){var z;const u=s.tagName.toLowerCase();if(df.has(u)||hf(s))return null;const i=ff(s),x=gf(s),g=mf(s),m={selector:i,tag:u,visible:x,depth:g},j=s.getAttribute("type");j&&(m.type=j);const E=s.getAttribute("placeholder")||s.getAttribute("aria-label")||s.getAttribute("title")||"";E&&(m.placeholder=E.trim().slice(0,80));const k=((z=s.innerText)==null?void 0:z.trim())??"";return k&&k.length>0&&(m.text=k.slice(0,50)),m}const vf=["input","textarea","select",'[contenteditable="true"]',"button","a[href]","label",'[role="button"]','[role="link"]','[role="textbox"]','[role="combobox"]','[role="listbox"]','[role="menuitem"]','[role="tab"]','[role="checkbox"]','[role="radio"]','[role="switch"]',"nav","main","form"].join(", ");function yf(){try{const s=[],u=new Set,i=document.querySelectorAll(vf);for(const x of Array.from(i)){if(s.length>=cf)break;const g=xf(x);g&&(u.has(g.selector)||(u.add(g.selector),s.push(g)))}return{elements:s}}catch{return{elements:[]}}}const nc=5e3;function _f(){try{const s=document.body;if(!s)return"";const i=(s.innerText??"").replace(/\r\n/g,`
`).replace(/\r/g,`
`).replace(/\n{3,}/g,`

`).replace(/[ \t]{2,}/g," ").trim();return i.length<=nc?i:i.slice(0,nc)+"…"}catch{return""}}function uc(){return{text:Sf(),url:bf(),pageTitle:Ef(),pageText:_f(),domSkeleton:JSON.stringify(yf()),bbox:Cf()}}const wf=50;async function kf(){var j;const s=uc();if(s.text)return s;const u=`gauntlet-cid-${Math.random().toString(36).slice(2)}`,i=[],x=E=>{const k=E.data;!k||k.gauntlet!=="subframe-selection-response"||k.cid===u&&(typeof k.text!="string"||!k.text||i.push({text:k.text,url:typeof k.url=="string"?k.url:void 0,pageTitle:typeof k.pageTitle=="string"?k.pageTitle:void 0}))};window.addEventListener("message",x);let g=null;try{g=document.querySelectorAll("iframe")}catch{g=null}if(g)for(const E of Array.from(g))try{(j=E.contentWindow)==null||j.postMessage({gauntlet:"subframe-selection-request",cid:u},"*")}catch{}await new Promise(E=>window.setTimeout(E,wf)),window.removeEventListener("message",x);const m=i.sort((E,k)=>k.text.length-E.text.length)[0];return m?{...s,text:m.text,url:m.url||s.url,pageTitle:m.pageTitle||s.pageTitle,bbox:null}:s}function Sf(){try{const s=window.getSelection();return s?s.toString().trim():""}catch{return""}}function bf(){try{return window.location.href}catch{return""}}function Ef(){try{return document.title??""}catch{return""}}function Cf(){try{const s=window.getSelection();if(!s||s.rangeCount===0||s.isCollapsed)return null;const i=s.getRangeAt(0).getBoundingClientRect();return i.width===0&&i.height===0?null:{x:i.x,y:i.y,width:i.width,height:i.height}}catch{return null}}const Nf={domExecution:!0,pillSurface:!0,screenshot:!0,dismissDomain:!0,voice:typeof window<"u"&&("SpeechRecognition"in window||"webkitSpeechRecognition"in window),streaming:!0,refreshSelection:!0,filesystemRead:!1,screenCapture:!1,remoteVoice:!0};async function jf(s,u,i){const x=await chrome.runtime.sendMessage({type:"gauntlet:fetch",url:u,method:s,headers:{"content-type":"application/json"},body:i===void 0?void 0:JSON.stringify(i)});if(!x||!x.ok)throw new Error(`composer: background fetch failed — ${(x==null?void 0:x.error)??"unknown error"}`);let g=null;if(x.body!=null&&x.body!=="")try{g=JSON.parse(x.body)}catch{g=x.body}const m=x.status??0;if(m<200||m>=300)throw new Error(`composer: ${m} ${x.statusText??""}`.trim());return g}const Tf={async get(s){try{return(await chrome.storage.local.get(s))[s]??null}catch{return null}},async set(s,u){try{await chrome.storage.local.set({[s]:u})}catch{}},async remove(s){try{await chrome.storage.local.remove(s)}catch{}}};function zf(s,u,i){const x=chrome.runtime.connect({name:"gauntlet:stream"});let g=!1;function m(){if(!g){g=!0;try{x.disconnect()}catch{}}}return x.onMessage.addListener(j=>{if(!j||typeof j!="object")return;const E=j;if(E.type==="sse"&&typeof E.data=="string"){let k=null;try{k=JSON.parse(E.data)}catch{i.onError("malformed SSE payload"),m();return}if(E.event==="delta"){const z=k.text??"";i.onDelta(z)}else if(E.event==="done"){const z=k;i.onDone({plan_id:z.plan_id??"",context_id:z.context_id??"",actions:z.actions??[],compose:z.compose??null,reason:z.reason??null,model_used:z.model_used??"",latency_ms:z.latency_ms??0,raw_response:null}),m()}else if(E.event==="error"){const z=k.error??"model error";i.onError(z),m()}}else E.type==="error"?(i.onError(E.error??"transport error"),m()):E.type==="closed"&&(g||(i.onDone({plan_id:"",context_id:"",actions:[],compose:null,reason:"stream ended without result",model_used:"",latency_ms:0,raw_response:null}),g=!0))}),x.onDisconnect.addListener(()=>{var j;if(!g){const E=(j=chrome.runtime.lastError)==null?void 0:j.message;i.onError(E??"disconnected"),g=!0}}),x.postMessage({type:"start",url:s,body:u}),()=>{if(!g){try{x.postMessage({type:"abort"})}catch{}m()}}}function Pf(){return{shell:"browser",capabilities:Nf,transport:{fetchJson(s,u,i){return jf(s,u,i)},stream:zf},storage:Tf,selection:{read:()=>uc(),readAsync:()=>kf()},domActions:{execute:$p},screenshot:{async capture(){var s;if(typeof chrome>"u"||!((s=chrome.runtime)!=null&&s.sendMessage))return null;try{const u=await chrome.runtime.sendMessage({type:"gauntlet:capture_screenshot"});return!(u!=null&&u.ok)||!u.dataUrl?null:u.dataUrl}catch{return null}}},debug:{async lastSummon(){try{const s=await chrome.runtime.sendMessage({type:"gauntlet:debug"});return(s==null?void 0:s.lastSummon)??null}catch{return null}}}}}const Mf=`
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
`,cc=document.createElement("style");cc.textContent=uf+Mf;document.head.appendChild(cc);const rc=Pf(),dc={...rc,capabilities:{...rc.capabilities,domExecution:!1,screenshot:!1,dismissDomain:!1,refreshSelection:!1,pillSurface:!1},domActions:void 0,screenshot:void 0};dc.storage.get("gauntlet:theme").then(s=>{const u=s==="dark"||s==="light"?s:"light";document.documentElement.setAttribute("data-theme",u),document.body.setAttribute("data-theme",u)});const Lf=up.createRoot(document.getElementById("root"));Lf.render(d.jsx(M.StrictMode,{children:d.jsx(Xp,{ambient:dc,initialSnapshot:{text:"",url:"window://composer",pageTitle:"Composer",pageText:"",domSkeleton:"",bbox:null},onDismiss:()=>window.close()})}));
