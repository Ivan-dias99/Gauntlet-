(function(){const u=document.createElement("link").relList;if(u&&u.supports&&u.supports("modulepreload"))return;for(const g of document.querySelectorAll('link[rel="modulepreload"]'))x(g);new MutationObserver(g=>{for(const m of g)if(m.type==="childList")for(const j of m.addedNodes)j.tagName==="LINK"&&j.rel==="modulepreload"&&x(j)}).observe(document,{childList:!0,subtree:!0});function i(g){const m={};return g.integrity&&(m.integrity=g.integrity),g.referrerPolicy&&(m.referrerPolicy=g.referrerPolicy),g.crossOrigin==="use-credentials"?m.credentials="include":g.crossOrigin==="anonymous"?m.credentials="omit":m.credentials="same-origin",m}function x(g){if(g.ep)return;g.ep=!0;const m=i(g);fetch(g.href,m)}})();try{}catch(o){console.error("[wxt] Failed to initialize plugins",o)}var cs={exports:{}},dl={},ds={exports:{}},te={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Vu;function tp(){if(Vu)return te;Vu=1;var o=Symbol.for("react.element"),u=Symbol.for("react.portal"),i=Symbol.for("react.fragment"),x=Symbol.for("react.strict_mode"),g=Symbol.for("react.profiler"),m=Symbol.for("react.provider"),j=Symbol.for("react.context"),S=Symbol.for("react.forward_ref"),k=Symbol.for("react.suspense"),P=Symbol.for("react.memo"),M=Symbol.for("react.lazy"),b=Symbol.iterator;function U(h){return h===null||typeof h!="object"?null:(h=b&&h[b]||h["@@iterator"],typeof h=="function"?h:null)}var de={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},ne=Object.assign,ee={};function re(h,E,X){this.props=h,this.context=E,this.refs=ee,this.updater=X||de}re.prototype.isReactComponent={},re.prototype.setState=function(h,E){if(typeof h!="object"&&typeof h!="function"&&h!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,h,E,"setState")},re.prototype.forceUpdate=function(h){this.updater.enqueueForceUpdate(this,h,"forceUpdate")};function D(){}D.prototype=re.prototype;function Pe(h,E,X){this.props=h,this.context=E,this.refs=ee,this.updater=X||de}var je=Pe.prototype=new D;je.constructor=Pe,ne(je,re.prototype),je.isPureReactComponent=!0;var we=Array.isArray,G=Object.prototype.hasOwnProperty,ce={current:null},Te={key:!0,ref:!0,__self:!0,__source:!0};function Re(h,E,X){var Z,le={},ae=null,me=null;if(E!=null)for(Z in E.ref!==void 0&&(me=E.ref),E.key!==void 0&&(ae=""+E.key),E)G.call(E,Z)&&!Te.hasOwnProperty(Z)&&(le[Z]=E[Z]);var oe=arguments.length-2;if(oe===1)le.children=X;else if(1<oe){for(var pe=Array(oe),Be=0;Be<oe;Be++)pe[Be]=arguments[Be+2];le.children=pe}if(h&&h.defaultProps)for(Z in oe=h.defaultProps,oe)le[Z]===void 0&&(le[Z]=oe[Z]);return{$$typeof:o,type:h,key:ae,ref:me,props:le,_owner:ce.current}}function St(h,E){return{$$typeof:o,type:h.type,key:E,ref:h.ref,props:h.props,_owner:h._owner}}function dt(h){return typeof h=="object"&&h!==null&&h.$$typeof===o}function Lt(h){var E={"=":"=0",":":"=2"};return"$"+h.replace(/[=:]/g,function(X){return E[X]})}var lt=/\/+/g;function Qe(h,E){return typeof h=="object"&&h!==null&&h.key!=null?Lt(""+h.key):E.toString(36)}function at(h,E,X,Z,le){var ae=typeof h;(ae==="undefined"||ae==="boolean")&&(h=null);var me=!1;if(h===null)me=!0;else switch(ae){case"string":case"number":me=!0;break;case"object":switch(h.$$typeof){case o:case u:me=!0}}if(me)return me=h,le=le(me),h=Z===""?"."+Qe(me,0):Z,we(le)?(X="",h!=null&&(X=h.replace(lt,"$&/")+"/"),at(le,E,X,"",function(Be){return Be})):le!=null&&(dt(le)&&(le=St(le,X+(!le.key||me&&me.key===le.key?"":(""+le.key).replace(lt,"$&/")+"/")+h)),E.push(le)),1;if(me=0,Z=Z===""?".":Z+":",we(h))for(var oe=0;oe<h.length;oe++){ae=h[oe];var pe=Z+Qe(ae,oe);me+=at(ae,E,X,pe,le)}else if(pe=U(h),typeof pe=="function")for(h=pe.call(h),oe=0;!(ae=h.next()).done;)ae=ae.value,pe=Z+Qe(ae,oe++),me+=at(ae,E,X,pe,le);else if(ae==="object")throw E=String(h),Error("Objects are not valid as a React child (found: "+(E==="[object Object]"?"object with keys {"+Object.keys(h).join(", ")+"}":E)+"). If you meant to render a collection of children, use an array instead.");return me}function pt(h,E,X){if(h==null)return h;var Z=[],le=0;return at(h,Z,"","",function(ae){return E.call(X,ae,le++)}),Z}function Ie(h){if(h._status===-1){var E=h._result;E=E(),E.then(function(X){(h._status===0||h._status===-1)&&(h._status=1,h._result=X)},function(X){(h._status===0||h._status===-1)&&(h._status=2,h._result=X)}),h._status===-1&&(h._status=0,h._result=E)}if(h._status===1)return h._result.default;throw h._result}var ve={current:null},O={transition:null},J={ReactCurrentDispatcher:ve,ReactCurrentBatchConfig:O,ReactCurrentOwner:ce};function F(){throw Error("act(...) is not supported in production builds of React.")}return te.Children={map:pt,forEach:function(h,E,X){pt(h,function(){E.apply(this,arguments)},X)},count:function(h){var E=0;return pt(h,function(){E++}),E},toArray:function(h){return pt(h,function(E){return E})||[]},only:function(h){if(!dt(h))throw Error("React.Children.only expected to receive a single React element child.");return h}},te.Component=re,te.Fragment=i,te.Profiler=g,te.PureComponent=Pe,te.StrictMode=x,te.Suspense=k,te.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=J,te.act=F,te.cloneElement=function(h,E,X){if(h==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+h+".");var Z=ne({},h.props),le=h.key,ae=h.ref,me=h._owner;if(E!=null){if(E.ref!==void 0&&(ae=E.ref,me=ce.current),E.key!==void 0&&(le=""+E.key),h.type&&h.type.defaultProps)var oe=h.type.defaultProps;for(pe in E)G.call(E,pe)&&!Te.hasOwnProperty(pe)&&(Z[pe]=E[pe]===void 0&&oe!==void 0?oe[pe]:E[pe])}var pe=arguments.length-2;if(pe===1)Z.children=X;else if(1<pe){oe=Array(pe);for(var Be=0;Be<pe;Be++)oe[Be]=arguments[Be+2];Z.children=oe}return{$$typeof:o,type:h.type,key:le,ref:ae,props:Z,_owner:me}},te.createContext=function(h){return h={$$typeof:j,_currentValue:h,_currentValue2:h,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},h.Provider={$$typeof:m,_context:h},h.Consumer=h},te.createElement=Re,te.createFactory=function(h){var E=Re.bind(null,h);return E.type=h,E},te.createRef=function(){return{current:null}},te.forwardRef=function(h){return{$$typeof:S,render:h}},te.isValidElement=dt,te.lazy=function(h){return{$$typeof:M,_payload:{_status:-1,_result:h},_init:Ie}},te.memo=function(h,E){return{$$typeof:P,type:h,compare:E===void 0?null:E}},te.startTransition=function(h){var E=O.transition;O.transition={};try{h()}finally{O.transition=E}},te.unstable_act=F,te.useCallback=function(h,E){return ve.current.useCallback(h,E)},te.useContext=function(h){return ve.current.useContext(h)},te.useDebugValue=function(){},te.useDeferredValue=function(h){return ve.current.useDeferredValue(h)},te.useEffect=function(h,E){return ve.current.useEffect(h,E)},te.useId=function(){return ve.current.useId()},te.useImperativeHandle=function(h,E,X){return ve.current.useImperativeHandle(h,E,X)},te.useInsertionEffect=function(h,E){return ve.current.useInsertionEffect(h,E)},te.useLayoutEffect=function(h,E){return ve.current.useLayoutEffect(h,E)},te.useMemo=function(h,E){return ve.current.useMemo(h,E)},te.useReducer=function(h,E,X){return ve.current.useReducer(h,E,X)},te.useRef=function(h){return ve.current.useRef(h)},te.useState=function(h){return ve.current.useState(h)},te.useSyncExternalStore=function(h,E,X){return ve.current.useSyncExternalStore(h,E,X)},te.useTransition=function(){return ve.current.useTransition()},te.version="18.3.1",te}var Hu;function ys(){return Hu||(Hu=1,ds.exports=tp()),ds.exports}/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Wu;function np(){if(Wu)return dl;Wu=1;var o=ys(),u=Symbol.for("react.element"),i=Symbol.for("react.fragment"),x=Object.prototype.hasOwnProperty,g=o.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,m={key:!0,ref:!0,__self:!0,__source:!0};function j(S,k,P){var M,b={},U=null,de=null;P!==void 0&&(U=""+P),k.key!==void 0&&(U=""+k.key),k.ref!==void 0&&(de=k.ref);for(M in k)x.call(k,M)&&!m.hasOwnProperty(M)&&(b[M]=k[M]);if(S&&S.defaultProps)for(M in k=S.defaultProps,k)b[M]===void 0&&(b[M]=k[M]);return{$$typeof:u,type:S,key:U,ref:de,props:b,_owner:g.current}}return dl.Fragment=i,dl.jsx=j,dl.jsxs=j,dl}var Ku;function rp(){return Ku||(Ku=1,cs.exports=np()),cs.exports}var d=rp(),T=ys(),Ea={},ps={exports:{}},rt={},fs={exports:{}},gs={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Qu;function lp(){return Qu||(Qu=1,(function(o){function u(O,J){var F=O.length;O.push(J);e:for(;0<F;){var h=F-1>>>1,E=O[h];if(0<g(E,J))O[h]=J,O[F]=E,F=h;else break e}}function i(O){return O.length===0?null:O[0]}function x(O){if(O.length===0)return null;var J=O[0],F=O.pop();if(F!==J){O[0]=F;e:for(var h=0,E=O.length,X=E>>>1;h<X;){var Z=2*(h+1)-1,le=O[Z],ae=Z+1,me=O[ae];if(0>g(le,F))ae<E&&0>g(me,le)?(O[h]=me,O[ae]=F,h=ae):(O[h]=le,O[Z]=F,h=Z);else if(ae<E&&0>g(me,F))O[h]=me,O[ae]=F,h=ae;else break e}}return J}function g(O,J){var F=O.sortIndex-J.sortIndex;return F!==0?F:O.id-J.id}if(typeof performance=="object"&&typeof performance.now=="function"){var m=performance;o.unstable_now=function(){return m.now()}}else{var j=Date,S=j.now();o.unstable_now=function(){return j.now()-S}}var k=[],P=[],M=1,b=null,U=3,de=!1,ne=!1,ee=!1,re=typeof setTimeout=="function"?setTimeout:null,D=typeof clearTimeout=="function"?clearTimeout:null,Pe=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function je(O){for(var J=i(P);J!==null;){if(J.callback===null)x(P);else if(J.startTime<=O)x(P),J.sortIndex=J.expirationTime,u(k,J);else break;J=i(P)}}function we(O){if(ee=!1,je(O),!ne)if(i(k)!==null)ne=!0,Ie(G);else{var J=i(P);J!==null&&ve(we,J.startTime-O)}}function G(O,J){ne=!1,ee&&(ee=!1,D(Re),Re=-1),de=!0;var F=U;try{for(je(J),b=i(k);b!==null&&(!(b.expirationTime>J)||O&&!Lt());){var h=b.callback;if(typeof h=="function"){b.callback=null,U=b.priorityLevel;var E=h(b.expirationTime<=J);J=o.unstable_now(),typeof E=="function"?b.callback=E:b===i(k)&&x(k),je(J)}else x(k);b=i(k)}if(b!==null)var X=!0;else{var Z=i(P);Z!==null&&ve(we,Z.startTime-J),X=!1}return X}finally{b=null,U=F,de=!1}}var ce=!1,Te=null,Re=-1,St=5,dt=-1;function Lt(){return!(o.unstable_now()-dt<St)}function lt(){if(Te!==null){var O=o.unstable_now();dt=O;var J=!0;try{J=Te(!0,O)}finally{J?Qe():(ce=!1,Te=null)}}else ce=!1}var Qe;if(typeof Pe=="function")Qe=function(){Pe(lt)};else if(typeof MessageChannel<"u"){var at=new MessageChannel,pt=at.port2;at.port1.onmessage=lt,Qe=function(){pt.postMessage(null)}}else Qe=function(){re(lt,0)};function Ie(O){Te=O,ce||(ce=!0,Qe())}function ve(O,J){Re=re(function(){O(o.unstable_now())},J)}o.unstable_IdlePriority=5,o.unstable_ImmediatePriority=1,o.unstable_LowPriority=4,o.unstable_NormalPriority=3,o.unstable_Profiling=null,o.unstable_UserBlockingPriority=2,o.unstable_cancelCallback=function(O){O.callback=null},o.unstable_continueExecution=function(){ne||de||(ne=!0,Ie(G))},o.unstable_forceFrameRate=function(O){0>O||125<O?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):St=0<O?Math.floor(1e3/O):5},o.unstable_getCurrentPriorityLevel=function(){return U},o.unstable_getFirstCallbackNode=function(){return i(k)},o.unstable_next=function(O){switch(U){case 1:case 2:case 3:var J=3;break;default:J=U}var F=U;U=J;try{return O()}finally{U=F}},o.unstable_pauseExecution=function(){},o.unstable_requestPaint=function(){},o.unstable_runWithPriority=function(O,J){switch(O){case 1:case 2:case 3:case 4:case 5:break;default:O=3}var F=U;U=O;try{return J()}finally{U=F}},o.unstable_scheduleCallback=function(O,J,F){var h=o.unstable_now();switch(typeof F=="object"&&F!==null?(F=F.delay,F=typeof F=="number"&&0<F?h+F:h):F=h,O){case 1:var E=-1;break;case 2:E=250;break;case 5:E=1073741823;break;case 4:E=1e4;break;default:E=5e3}return E=F+E,O={id:M++,callback:J,priorityLevel:O,startTime:F,expirationTime:E,sortIndex:-1},F>h?(O.sortIndex=F,u(P,O),i(k)===null&&O===i(P)&&(ee?(D(Re),Re=-1):ee=!0,ve(we,F-h))):(O.sortIndex=E,u(k,O),ne||de||(ne=!0,Ie(G))),O},o.unstable_shouldYield=Lt,o.unstable_wrapCallback=function(O){var J=U;return function(){var F=U;U=J;try{return O.apply(this,arguments)}finally{U=F}}}})(gs)),gs}var Yu;function ap(){return Yu||(Yu=1,fs.exports=lp()),fs.exports}/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Ju;function op(){if(Ju)return rt;Ju=1;var o=ys(),u=ap();function i(e){for(var t="https://reactjs.org/docs/error-decoder.html?invariant="+e,n=1;n<arguments.length;n++)t+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var x=new Set,g={};function m(e,t){j(e,t),j(e+"Capture",t)}function j(e,t){for(g[e]=t,e=0;e<t.length;e++)x.add(t[e])}var S=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),k=Object.prototype.hasOwnProperty,P=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,M={},b={};function U(e){return k.call(b,e)?!0:k.call(M,e)?!1:P.test(e)?b[e]=!0:(M[e]=!0,!1)}function de(e,t,n,r){if(n!==null&&n.type===0)return!1;switch(typeof t){case"function":case"symbol":return!0;case"boolean":return r?!1:n!==null?!n.acceptsBooleans:(e=e.toLowerCase().slice(0,5),e!=="data-"&&e!=="aria-");default:return!1}}function ne(e,t,n,r){if(t===null||typeof t>"u"||de(e,t,n,r))return!0;if(r)return!1;if(n!==null)switch(n.type){case 3:return!t;case 4:return t===!1;case 5:return isNaN(t);case 6:return isNaN(t)||1>t}return!1}function ee(e,t,n,r,l,a,s){this.acceptsBooleans=t===2||t===3||t===4,this.attributeName=r,this.attributeNamespace=l,this.mustUseProperty=n,this.propertyName=e,this.type=t,this.sanitizeURL=a,this.removeEmptyString=s}var re={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e){re[e]=new ee(e,0,!1,e,null,!1,!1)}),[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(e){var t=e[0];re[t]=new ee(t,1,!1,e[1],null,!1,!1)}),["contentEditable","draggable","spellCheck","value"].forEach(function(e){re[e]=new ee(e,2,!1,e.toLowerCase(),null,!1,!1)}),["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(e){re[e]=new ee(e,2,!1,e,null,!1,!1)}),"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e){re[e]=new ee(e,3,!1,e.toLowerCase(),null,!1,!1)}),["checked","multiple","muted","selected"].forEach(function(e){re[e]=new ee(e,3,!0,e,null,!1,!1)}),["capture","download"].forEach(function(e){re[e]=new ee(e,4,!1,e,null,!1,!1)}),["cols","rows","size","span"].forEach(function(e){re[e]=new ee(e,6,!1,e,null,!1,!1)}),["rowSpan","start"].forEach(function(e){re[e]=new ee(e,5,!1,e.toLowerCase(),null,!1,!1)});var D=/[\-:]([a-z])/g;function Pe(e){return e[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e){var t=e.replace(D,Pe);re[t]=new ee(t,1,!1,e,null,!1,!1)}),"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e){var t=e.replace(D,Pe);re[t]=new ee(t,1,!1,e,"http://www.w3.org/1999/xlink",!1,!1)}),["xml:base","xml:lang","xml:space"].forEach(function(e){var t=e.replace(D,Pe);re[t]=new ee(t,1,!1,e,"http://www.w3.org/XML/1998/namespace",!1,!1)}),["tabIndex","crossOrigin"].forEach(function(e){re[e]=new ee(e,1,!1,e.toLowerCase(),null,!1,!1)}),re.xlinkHref=new ee("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1),["src","href","action","formAction"].forEach(function(e){re[e]=new ee(e,1,!1,e.toLowerCase(),null,!0,!0)});function je(e,t,n,r){var l=re.hasOwnProperty(t)?re[t]:null;(l!==null?l.type!==0:r||!(2<t.length)||t[0]!=="o"&&t[0]!=="O"||t[1]!=="n"&&t[1]!=="N")&&(ne(t,n,l,r)&&(n=null),r||l===null?U(t)&&(n===null?e.removeAttribute(t):e.setAttribute(t,""+n)):l.mustUseProperty?e[l.propertyName]=n===null?l.type===3?!1:"":n:(t=l.attributeName,r=l.attributeNamespace,n===null?e.removeAttribute(t):(l=l.type,n=l===3||l===4&&n===!0?"":""+n,r?e.setAttributeNS(r,t,n):e.setAttribute(t,n))))}var we=o.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,G=Symbol.for("react.element"),ce=Symbol.for("react.portal"),Te=Symbol.for("react.fragment"),Re=Symbol.for("react.strict_mode"),St=Symbol.for("react.profiler"),dt=Symbol.for("react.provider"),Lt=Symbol.for("react.context"),lt=Symbol.for("react.forward_ref"),Qe=Symbol.for("react.suspense"),at=Symbol.for("react.suspense_list"),pt=Symbol.for("react.memo"),Ie=Symbol.for("react.lazy"),ve=Symbol.for("react.offscreen"),O=Symbol.iterator;function J(e){return e===null||typeof e!="object"?null:(e=O&&e[O]||e["@@iterator"],typeof e=="function"?e:null)}var F=Object.assign,h;function E(e){if(h===void 0)try{throw Error()}catch(n){var t=n.stack.trim().match(/\n( *(at )?)/);h=t&&t[1]||""}return`
`+h+e}var X=!1;function Z(e,t){if(!e||X)return"";X=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(t)if(t=function(){throw Error()},Object.defineProperty(t.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(t,[])}catch(w){var r=w}Reflect.construct(e,[],t)}else{try{t.call()}catch(w){r=w}e.call(t.prototype)}else{try{throw Error()}catch(w){r=w}e()}}catch(w){if(w&&r&&typeof w.stack=="string"){for(var l=w.stack.split(`
`),a=r.stack.split(`
`),s=l.length-1,c=a.length-1;1<=s&&0<=c&&l[s]!==a[c];)c--;for(;1<=s&&0<=c;s--,c--)if(l[s]!==a[c]){if(s!==1||c!==1)do if(s--,c--,0>c||l[s]!==a[c]){var p=`
`+l[s].replace(" at new "," at ");return e.displayName&&p.includes("<anonymous>")&&(p=p.replace("<anonymous>",e.displayName)),p}while(1<=s&&0<=c);break}}}finally{X=!1,Error.prepareStackTrace=n}return(e=e?e.displayName||e.name:"")?E(e):""}function le(e){switch(e.tag){case 5:return E(e.type);case 16:return E("Lazy");case 13:return E("Suspense");case 19:return E("SuspenseList");case 0:case 2:case 15:return e=Z(e.type,!1),e;case 11:return e=Z(e.type.render,!1),e;case 1:return e=Z(e.type,!0),e;default:return""}}function ae(e){if(e==null)return null;if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case Te:return"Fragment";case ce:return"Portal";case St:return"Profiler";case Re:return"StrictMode";case Qe:return"Suspense";case at:return"SuspenseList"}if(typeof e=="object")switch(e.$$typeof){case Lt:return(e.displayName||"Context")+".Consumer";case dt:return(e._context.displayName||"Context")+".Provider";case lt:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case pt:return t=e.displayName||null,t!==null?t:ae(e.type)||"Memo";case Ie:t=e._payload,e=e._init;try{return ae(e(t))}catch{}}return null}function me(e){var t=e.type;switch(e.tag){case 24:return"Cache";case 9:return(t.displayName||"Context")+".Consumer";case 10:return(t._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return e=t.render,e=e.displayName||e.name||"",t.displayName||(e!==""?"ForwardRef("+e+")":"ForwardRef");case 7:return"Fragment";case 5:return t;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return ae(t);case 8:return t===Re?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t}return null}function oe(e){switch(typeof e){case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function pe(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function Be(e){var t=pe(e)?"checked":"value",n=Object.getOwnPropertyDescriptor(e.constructor.prototype,t),r=""+e[t];if(!e.hasOwnProperty(t)&&typeof n<"u"&&typeof n.get=="function"&&typeof n.set=="function"){var l=n.get,a=n.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return l.call(this)},set:function(s){r=""+s,a.call(this,s)}}),Object.defineProperty(e,t,{enumerable:n.enumerable}),{getValue:function(){return r},setValue:function(s){r=""+s},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function ft(e){e._valueTracker||(e._valueTracker=Be(e))}function Ge(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),r="";return e&&(r=pe(e)?e.checked?"true":"false":e.value),e=r,e!==n?(t.setValue(e),!0):!1}function Qn(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}function Rt(e,t){var n=t.checked;return F({},t,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:n??e._wrapperState.initialChecked})}function Yn(e,t){var n=t.defaultValue==null?"":t.defaultValue,r=t.checked!=null?t.checked:t.defaultChecked;n=oe(t.value!=null?t.value:n),e._wrapperState={initialChecked:r,initialValue:n,controlled:t.type==="checkbox"||t.type==="radio"?t.checked!=null:t.value!=null}}function Dt(e,t){t=t.checked,t!=null&&je(e,"checked",t,!1)}function Ot(e,t){Dt(e,t);var n=oe(t.value),r=t.type;if(n!=null)r==="number"?(n===0&&e.value===""||e.value!=n)&&(e.value=""+n):e.value!==""+n&&(e.value=""+n);else if(r==="submit"||r==="reset"){e.removeAttribute("value");return}t.hasOwnProperty("value")?kr(e,t.type,n):t.hasOwnProperty("defaultValue")&&kr(e,t.type,oe(t.defaultValue)),t.checked==null&&t.defaultChecked!=null&&(e.defaultChecked=!!t.defaultChecked)}function Tn(e,t,n){if(t.hasOwnProperty("value")||t.hasOwnProperty("defaultValue")){var r=t.type;if(!(r!=="submit"&&r!=="reset"||t.value!==void 0&&t.value!==null))return;t=""+e._wrapperState.initialValue,n||t===e.value||(e.value=t),e.defaultValue=t}n=e.name,n!==""&&(e.name=""),e.defaultChecked=!!e._wrapperState.initialChecked,n!==""&&(e.name=n)}function kr(e,t,n){(t!=="number"||Qn(e.ownerDocument)!==e)&&(n==null?e.defaultValue=""+e._wrapperState.initialValue:e.defaultValue!==""+n&&(e.defaultValue=""+n))}var nn=Array.isArray;function Fe(e,t,n,r){if(e=e.options,t){t={};for(var l=0;l<n.length;l++)t["$"+n[l]]=!0;for(n=0;n<e.length;n++)l=t.hasOwnProperty("$"+e[n].value),e[n].selected!==l&&(e[n].selected=l),l&&r&&(e[n].defaultSelected=!0)}else{for(n=""+oe(n),t=null,l=0;l<e.length;l++){if(e[l].value===n){e[l].selected=!0,r&&(e[l].defaultSelected=!0);return}t!==null||e[l].disabled||(t=e[l])}t!==null&&(t.selected=!0)}}function rn(e,t){if(t.dangerouslySetInnerHTML!=null)throw Error(i(91));return F({},t,{value:void 0,defaultValue:void 0,children:""+e._wrapperState.initialValue})}function Ht(e,t){var n=t.value;if(n==null){if(n=t.children,t=t.defaultValue,n!=null){if(t!=null)throw Error(i(92));if(nn(n)){if(1<n.length)throw Error(i(93));n=n[0]}t=n}t==null&&(t=""),n=t}e._wrapperState={initialValue:oe(n)}}function Jn(e,t){var n=oe(t.value),r=oe(t.defaultValue);n!=null&&(n=""+n,n!==e.value&&(e.value=n),t.defaultValue==null&&e.defaultValue!==n&&(e.defaultValue=n)),r!=null&&(e.defaultValue=""+r)}function ot(e){var t=e.textContent;t===e._wrapperState.initialValue&&t!==""&&t!==null&&(e.value=t)}function Gn(e){switch(e){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function qn(e,t){return e==null||e==="http://www.w3.org/1999/xhtml"?Gn(t):e==="http://www.w3.org/2000/svg"&&t==="foreignObject"?"http://www.w3.org/1999/xhtml":e}var $t,Wt=(function(e){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(t,n,r,l){MSApp.execUnsafeLocalFunction(function(){return e(t,n,r,l)})}:e})(function(e,t){if(e.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in e)e.innerHTML=t;else{for($t=$t||document.createElement("div"),$t.innerHTML="<svg>"+t.valueOf().toString()+"</svg>",t=$t.firstChild;e.firstChild;)e.removeChild(e.firstChild);for(;t.firstChild;)e.appendChild(t.firstChild)}});function It(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&n.nodeType===3){n.nodeValue=t;return}}e.textContent=t}var qe={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},fl=["Webkit","ms","Moz","O"];Object.keys(qe).forEach(function(e){fl.forEach(function(t){t=t+e.charAt(0).toUpperCase()+e.substring(1),qe[t]=qe[e]})});function gl(e,t,n){return t==null||typeof t=="boolean"||t===""?"":n||typeof t!="number"||t===0||qe.hasOwnProperty(e)&&qe[e]?(""+t).trim():t+"px"}function br(e,t){e=e.style;for(var n in t)if(t.hasOwnProperty(n)){var r=n.indexOf("--")===0,l=gl(n,t[n],r);n==="float"&&(n="cssFloat"),r?e.setProperty(n,l):e[n]=l}}var ml=F({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function zn(e,t){if(t){if(ml[e]&&(t.children!=null||t.dangerouslySetInnerHTML!=null))throw Error(i(137,e));if(t.dangerouslySetInnerHTML!=null){if(t.children!=null)throw Error(i(60));if(typeof t.dangerouslySetInnerHTML!="object"||!("__html"in t.dangerouslySetInnerHTML))throw Error(i(61))}if(t.style!=null&&typeof t.style!="object")throw Error(i(62))}}function Xn(e,t){if(e.indexOf("-")===-1)return typeof t.is=="string";switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Et=null;function ln(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var Sr=null,an=null,on=null;function Er(e){if(e=Gr(e)){if(typeof Sr!="function")throw Error(i(280));var t=e.stateNode;t&&(t=Al(t),Sr(e.stateNode,e.type,t))}}function Cr(e){an?on?on.push(e):on=[e]:an=e}function Zn(){if(an){var e=an,t=on;if(on=an=null,Er(e),t)for(e=0;e<t.length;e++)Er(t[e])}}function hl(e,t){return e(t)}function Pn(){}var Nr=!1;function gt(e,t,n){if(Nr)return e(t,n);Nr=!0;try{return hl(e,t,n)}finally{Nr=!1,(an!==null||on!==null)&&(Pn(),Zn())}}function Kt(e,t){var n=e.stateNode;if(n===null)return null;var r=Al(n);if(r===null)return null;n=r[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(r=!r.disabled)||(e=e.type,r=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!r;break e;default:e=!1}if(e)return null;if(n&&typeof n!="function")throw Error(i(231,t,typeof n));return n}var Mn=!1;if(S)try{var sn={};Object.defineProperty(sn,"passive",{get:function(){Mn=!0}}),window.addEventListener("test",sn,sn),window.removeEventListener("test",sn,sn)}catch{Mn=!1}function xl(e,t,n,r,l,a,s,c,p){var w=Array.prototype.slice.call(arguments,3);try{t.apply(n,w)}catch(N){this.onError(N)}}var Ln=!1,Rn=null,Qt=!1,jr=null,Na={onError:function(e){Ln=!0,Rn=e}};function vl(e,t,n,r,l,a,s,c,p){Ln=!1,Rn=null,xl.apply(Na,arguments)}function ja(e,t,n,r,l,a,s,c,p){if(vl.apply(this,arguments),Ln){if(Ln){var w=Rn;Ln=!1,Rn=null}else throw Error(i(198));Qt||(Qt=!0,jr=w)}}function mt(e){var t=e,n=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,(t.flags&4098)!==0&&(n=t.return),e=t.return;while(e)}return t.tag===3?n:null}function yl(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function _l(e){if(mt(e)!==e)throw Error(i(188))}function Ta(e){var t=e.alternate;if(!t){if(t=mt(e),t===null)throw Error(i(188));return t!==e?null:e}for(var n=e,r=t;;){var l=n.return;if(l===null)break;var a=l.alternate;if(a===null){if(r=l.return,r!==null){n=r;continue}break}if(l.child===a.child){for(a=l.child;a;){if(a===n)return _l(l),e;if(a===r)return _l(l),t;a=a.sibling}throw Error(i(188))}if(n.return!==r.return)n=l,r=a;else{for(var s=!1,c=l.child;c;){if(c===n){s=!0,n=l,r=a;break}if(c===r){s=!0,r=l,n=a;break}c=c.sibling}if(!s){for(c=a.child;c;){if(c===n){s=!0,n=a,r=l;break}if(c===r){s=!0,r=a,n=l;break}c=c.sibling}if(!s)throw Error(i(189))}}if(n.alternate!==r)throw Error(i(190))}if(n.tag!==3)throw Error(i(188));return n.stateNode.current===n?e:t}function Tr(e){return e=Ta(e),e!==null?zr(e):null}function zr(e){if(e.tag===5||e.tag===6)return e;for(e=e.child;e!==null;){var t=zr(e);if(t!==null)return t;e=e.sibling}return null}var Pr=u.unstable_scheduleCallback,v=u.unstable_cancelCallback,L=u.unstable_shouldYield,$=u.unstable_requestPaint,V=u.unstable_now,se=u.unstable_getCurrentPriorityLevel,K=u.unstable_ImmediatePriority,he=u.unstable_UserBlockingPriority,fe=u.unstable_NormalPriority,be=u.unstable_LowPriority,ht=u.unstable_IdlePriority,wl=null,Ft=null;function hc(e){if(Ft&&typeof Ft.onCommitFiberRoot=="function")try{Ft.onCommitFiberRoot(wl,e,void 0,(e.current.flags&128)===128)}catch{}}var Ct=Math.clz32?Math.clz32:yc,xc=Math.log,vc=Math.LN2;function yc(e){return e>>>=0,e===0?32:31-(xc(e)/vc|0)|0}var kl=64,bl=4194304;function Mr(e){switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return e&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return e}}function Sl(e,t){var n=e.pendingLanes;if(n===0)return 0;var r=0,l=e.suspendedLanes,a=e.pingedLanes,s=n&268435455;if(s!==0){var c=s&~l;c!==0?r=Mr(c):(a&=s,a!==0&&(r=Mr(a)))}else s=n&~l,s!==0?r=Mr(s):a!==0&&(r=Mr(a));if(r===0)return 0;if(t!==0&&t!==r&&(t&l)===0&&(l=r&-r,a=t&-t,l>=a||l===16&&(a&4194240)!==0))return t;if((r&4)!==0&&(r|=n&16),t=e.entangledLanes,t!==0)for(e=e.entanglements,t&=r;0<t;)n=31-Ct(t),l=1<<n,r|=e[n],t&=~l;return r}function _c(e,t){switch(e){case 1:case 2:case 4:return t+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function wc(e,t){for(var n=e.suspendedLanes,r=e.pingedLanes,l=e.expirationTimes,a=e.pendingLanes;0<a;){var s=31-Ct(a),c=1<<s,p=l[s];p===-1?((c&n)===0||(c&r)!==0)&&(l[s]=_c(c,t)):p<=t&&(e.expiredLanes|=c),a&=~c}}function za(e){return e=e.pendingLanes&-1073741825,e!==0?e:e&1073741824?1073741824:0}function _s(){var e=kl;return kl<<=1,(kl&4194240)===0&&(kl=64),e}function Pa(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function Lr(e,t,n){e.pendingLanes|=t,t!==536870912&&(e.suspendedLanes=0,e.pingedLanes=0),e=e.eventTimes,t=31-Ct(t),e[t]=n}function kc(e,t){var n=e.pendingLanes&~t;e.pendingLanes=t,e.suspendedLanes=0,e.pingedLanes=0,e.expiredLanes&=t,e.mutableReadLanes&=t,e.entangledLanes&=t,t=e.entanglements;var r=e.eventTimes;for(e=e.expirationTimes;0<n;){var l=31-Ct(n),a=1<<l;t[l]=0,r[l]=-1,e[l]=-1,n&=~a}}function Ma(e,t){var n=e.entangledLanes|=t;for(e=e.entanglements;n;){var r=31-Ct(n),l=1<<r;l&t|e[r]&t&&(e[r]|=t),n&=~l}}var ge=0;function ws(e){return e&=-e,1<e?4<e?(e&268435455)!==0?16:536870912:4:1}var ks,La,bs,Ss,Es,Ra=!1,El=[],un=null,cn=null,dn=null,Rr=new Map,Dr=new Map,pn=[],bc="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function Cs(e,t){switch(e){case"focusin":case"focusout":un=null;break;case"dragenter":case"dragleave":cn=null;break;case"mouseover":case"mouseout":dn=null;break;case"pointerover":case"pointerout":Rr.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":Dr.delete(t.pointerId)}}function Or(e,t,n,r,l,a){return e===null||e.nativeEvent!==a?(e={blockedOn:t,domEventName:n,eventSystemFlags:r,nativeEvent:a,targetContainers:[l]},t!==null&&(t=Gr(t),t!==null&&La(t)),e):(e.eventSystemFlags|=r,t=e.targetContainers,l!==null&&t.indexOf(l)===-1&&t.push(l),e)}function Sc(e,t,n,r,l){switch(t){case"focusin":return un=Or(un,e,t,n,r,l),!0;case"dragenter":return cn=Or(cn,e,t,n,r,l),!0;case"mouseover":return dn=Or(dn,e,t,n,r,l),!0;case"pointerover":var a=l.pointerId;return Rr.set(a,Or(Rr.get(a)||null,e,t,n,r,l)),!0;case"gotpointercapture":return a=l.pointerId,Dr.set(a,Or(Dr.get(a)||null,e,t,n,r,l)),!0}return!1}function Ns(e){var t=Dn(e.target);if(t!==null){var n=mt(t);if(n!==null){if(t=n.tag,t===13){if(t=yl(n),t!==null){e.blockedOn=t,Es(e.priority,function(){bs(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}e.blockedOn=null}function Cl(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var n=Oa(e.domEventName,e.eventSystemFlags,t[0],e.nativeEvent);if(n===null){n=e.nativeEvent;var r=new n.constructor(n.type,n);Et=r,n.target.dispatchEvent(r),Et=null}else return t=Gr(n),t!==null&&La(t),e.blockedOn=n,!1;t.shift()}return!0}function js(e,t,n){Cl(e)&&n.delete(t)}function Ec(){Ra=!1,un!==null&&Cl(un)&&(un=null),cn!==null&&Cl(cn)&&(cn=null),dn!==null&&Cl(dn)&&(dn=null),Rr.forEach(js),Dr.forEach(js)}function $r(e,t){e.blockedOn===t&&(e.blockedOn=null,Ra||(Ra=!0,u.unstable_scheduleCallback(u.unstable_NormalPriority,Ec)))}function Ir(e){function t(l){return $r(l,e)}if(0<El.length){$r(El[0],e);for(var n=1;n<El.length;n++){var r=El[n];r.blockedOn===e&&(r.blockedOn=null)}}for(un!==null&&$r(un,e),cn!==null&&$r(cn,e),dn!==null&&$r(dn,e),Rr.forEach(t),Dr.forEach(t),n=0;n<pn.length;n++)r=pn[n],r.blockedOn===e&&(r.blockedOn=null);for(;0<pn.length&&(n=pn[0],n.blockedOn===null);)Ns(n),n.blockedOn===null&&pn.shift()}var er=we.ReactCurrentBatchConfig,Nl=!0;function Cc(e,t,n,r){var l=ge,a=er.transition;er.transition=null;try{ge=1,Da(e,t,n,r)}finally{ge=l,er.transition=a}}function Nc(e,t,n,r){var l=ge,a=er.transition;er.transition=null;try{ge=4,Da(e,t,n,r)}finally{ge=l,er.transition=a}}function Da(e,t,n,r){if(Nl){var l=Oa(e,t,n,r);if(l===null)Za(e,t,r,jl,n),Cs(e,r);else if(Sc(l,e,t,n,r))r.stopPropagation();else if(Cs(e,r),t&4&&-1<bc.indexOf(e)){for(;l!==null;){var a=Gr(l);if(a!==null&&ks(a),a=Oa(e,t,n,r),a===null&&Za(e,t,r,jl,n),a===l)break;l=a}l!==null&&r.stopPropagation()}else Za(e,t,r,null,n)}}var jl=null;function Oa(e,t,n,r){if(jl=null,e=ln(r),e=Dn(e),e!==null)if(t=mt(e),t===null)e=null;else if(n=t.tag,n===13){if(e=yl(t),e!==null)return e;e=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null);return jl=e,null}function Ts(e){switch(e){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(se()){case K:return 1;case he:return 4;case fe:case be:return 16;case ht:return 536870912;default:return 16}default:return 16}}var fn=null,$a=null,Tl=null;function zs(){if(Tl)return Tl;var e,t=$a,n=t.length,r,l="value"in fn?fn.value:fn.textContent,a=l.length;for(e=0;e<n&&t[e]===l[e];e++);var s=n-e;for(r=1;r<=s&&t[n-r]===l[a-r];r++);return Tl=l.slice(e,1<r?1-r:void 0)}function zl(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function Pl(){return!0}function Ps(){return!1}function st(e){function t(n,r,l,a,s){this._reactName=n,this._targetInst=l,this.type=r,this.nativeEvent=a,this.target=s,this.currentTarget=null;for(var c in e)e.hasOwnProperty(c)&&(n=e[c],this[c]=n?n(a):a[c]);return this.isDefaultPrevented=(a.defaultPrevented!=null?a.defaultPrevented:a.returnValue===!1)?Pl:Ps,this.isPropagationStopped=Ps,this}return F(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=Pl)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=Pl)},persist:function(){},isPersistent:Pl}),t}var tr={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Ia=st(tr),Fr=F({},tr,{view:0,detail:0}),jc=st(Fr),Fa,Aa,Ar,Ml=F({},Fr,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Ba,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==Ar&&(Ar&&e.type==="mousemove"?(Fa=e.screenX-Ar.screenX,Aa=e.screenY-Ar.screenY):Aa=Fa=0,Ar=e),Fa)},movementY:function(e){return"movementY"in e?e.movementY:Aa}}),Ms=st(Ml),Tc=F({},Ml,{dataTransfer:0}),zc=st(Tc),Pc=F({},Fr,{relatedTarget:0}),Ua=st(Pc),Mc=F({},tr,{animationName:0,elapsedTime:0,pseudoElement:0}),Lc=st(Mc),Rc=F({},tr,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),Dc=st(Rc),Oc=F({},tr,{data:0}),Ls=st(Oc),$c={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Ic={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Fc={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Ac(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=Fc[e])?!!t[e]:!1}function Ba(){return Ac}var Uc=F({},Fr,{key:function(e){if(e.key){var t=$c[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=zl(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?Ic[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Ba,charCode:function(e){return e.type==="keypress"?zl(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?zl(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),Bc=st(Uc),Vc=F({},Ml,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Rs=st(Vc),Hc=F({},Fr,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Ba}),Wc=st(Hc),Kc=F({},tr,{propertyName:0,elapsedTime:0,pseudoElement:0}),Qc=st(Kc),Yc=F({},Ml,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),Jc=st(Yc),Gc=[9,13,27,32],Va=S&&"CompositionEvent"in window,Ur=null;S&&"documentMode"in document&&(Ur=document.documentMode);var qc=S&&"TextEvent"in window&&!Ur,Ds=S&&(!Va||Ur&&8<Ur&&11>=Ur),Os=" ",$s=!1;function Is(e,t){switch(e){case"keyup":return Gc.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Fs(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var nr=!1;function Xc(e,t){switch(e){case"compositionend":return Fs(t);case"keypress":return t.which!==32?null:($s=!0,Os);case"textInput":return e=t.data,e===Os&&$s?null:e;default:return null}}function Zc(e,t){if(nr)return e==="compositionend"||!Va&&Is(e,t)?(e=zs(),Tl=$a=fn=null,nr=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return Ds&&t.locale!=="ko"?null:t.data;default:return null}}var ed={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function As(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!ed[e.type]:t==="textarea"}function Us(e,t,n,r){Cr(r),t=$l(t,"onChange"),0<t.length&&(n=new Ia("onChange","change",null,n,r),e.push({event:n,listeners:t}))}var Br=null,Vr=null;function td(e){ai(e,0)}function Ll(e){var t=sr(e);if(Ge(t))return e}function nd(e,t){if(e==="change")return t}var Bs=!1;if(S){var Ha;if(S){var Wa="oninput"in document;if(!Wa){var Vs=document.createElement("div");Vs.setAttribute("oninput","return;"),Wa=typeof Vs.oninput=="function"}Ha=Wa}else Ha=!1;Bs=Ha&&(!document.documentMode||9<document.documentMode)}function Hs(){Br&&(Br.detachEvent("onpropertychange",Ws),Vr=Br=null)}function Ws(e){if(e.propertyName==="value"&&Ll(Vr)){var t=[];Us(t,Vr,e,ln(e)),gt(td,t)}}function rd(e,t,n){e==="focusin"?(Hs(),Br=t,Vr=n,Br.attachEvent("onpropertychange",Ws)):e==="focusout"&&Hs()}function ld(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return Ll(Vr)}function ad(e,t){if(e==="click")return Ll(t)}function od(e,t){if(e==="input"||e==="change")return Ll(t)}function sd(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var Nt=typeof Object.is=="function"?Object.is:sd;function Hr(e,t){if(Nt(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var n=Object.keys(e),r=Object.keys(t);if(n.length!==r.length)return!1;for(r=0;r<n.length;r++){var l=n[r];if(!k.call(t,l)||!Nt(e[l],t[l]))return!1}return!0}function Ks(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function Qs(e,t){var n=Ks(e);e=0;for(var r;n;){if(n.nodeType===3){if(r=e+n.textContent.length,e<=t&&r>=t)return{node:n,offset:t-e};e=r}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=Ks(n)}}function Ys(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?Ys(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function Js(){for(var e=window,t=Qn();t instanceof e.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href=="string"}catch{n=!1}if(n)e=t.contentWindow;else break;t=Qn(e.document)}return t}function Ka(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}function id(e){var t=Js(),n=e.focusedElem,r=e.selectionRange;if(t!==n&&n&&n.ownerDocument&&Ys(n.ownerDocument.documentElement,n)){if(r!==null&&Ka(n)){if(t=r.start,e=r.end,e===void 0&&(e=t),"selectionStart"in n)n.selectionStart=t,n.selectionEnd=Math.min(e,n.value.length);else if(e=(t=n.ownerDocument||document)&&t.defaultView||window,e.getSelection){e=e.getSelection();var l=n.textContent.length,a=Math.min(r.start,l);r=r.end===void 0?a:Math.min(r.end,l),!e.extend&&a>r&&(l=r,r=a,a=l),l=Qs(n,a);var s=Qs(n,r);l&&s&&(e.rangeCount!==1||e.anchorNode!==l.node||e.anchorOffset!==l.offset||e.focusNode!==s.node||e.focusOffset!==s.offset)&&(t=t.createRange(),t.setStart(l.node,l.offset),e.removeAllRanges(),a>r?(e.addRange(t),e.extend(s.node,s.offset)):(t.setEnd(s.node,s.offset),e.addRange(t)))}}for(t=[],e=n;e=e.parentNode;)e.nodeType===1&&t.push({element:e,left:e.scrollLeft,top:e.scrollTop});for(typeof n.focus=="function"&&n.focus(),n=0;n<t.length;n++)e=t[n],e.element.scrollLeft=e.left,e.element.scrollTop=e.top}}var ud=S&&"documentMode"in document&&11>=document.documentMode,rr=null,Qa=null,Wr=null,Ya=!1;function Gs(e,t,n){var r=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;Ya||rr==null||rr!==Qn(r)||(r=rr,"selectionStart"in r&&Ka(r)?r={start:r.selectionStart,end:r.selectionEnd}:(r=(r.ownerDocument&&r.ownerDocument.defaultView||window).getSelection(),r={anchorNode:r.anchorNode,anchorOffset:r.anchorOffset,focusNode:r.focusNode,focusOffset:r.focusOffset}),Wr&&Hr(Wr,r)||(Wr=r,r=$l(Qa,"onSelect"),0<r.length&&(t=new Ia("onSelect","select",null,t,n),e.push({event:t,listeners:r}),t.target=rr)))}function Rl(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n["Webkit"+e]="webkit"+t,n["Moz"+e]="moz"+t,n}var lr={animationend:Rl("Animation","AnimationEnd"),animationiteration:Rl("Animation","AnimationIteration"),animationstart:Rl("Animation","AnimationStart"),transitionend:Rl("Transition","TransitionEnd")},Ja={},qs={};S&&(qs=document.createElement("div").style,"AnimationEvent"in window||(delete lr.animationend.animation,delete lr.animationiteration.animation,delete lr.animationstart.animation),"TransitionEvent"in window||delete lr.transitionend.transition);function Dl(e){if(Ja[e])return Ja[e];if(!lr[e])return e;var t=lr[e],n;for(n in t)if(t.hasOwnProperty(n)&&n in qs)return Ja[e]=t[n];return e}var Xs=Dl("animationend"),Zs=Dl("animationiteration"),ei=Dl("animationstart"),ti=Dl("transitionend"),ni=new Map,ri="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function gn(e,t){ni.set(e,t),m(t,[e])}for(var Ga=0;Ga<ri.length;Ga++){var qa=ri[Ga],cd=qa.toLowerCase(),dd=qa[0].toUpperCase()+qa.slice(1);gn(cd,"on"+dd)}gn(Xs,"onAnimationEnd"),gn(Zs,"onAnimationIteration"),gn(ei,"onAnimationStart"),gn("dblclick","onDoubleClick"),gn("focusin","onFocus"),gn("focusout","onBlur"),gn(ti,"onTransitionEnd"),j("onMouseEnter",["mouseout","mouseover"]),j("onMouseLeave",["mouseout","mouseover"]),j("onPointerEnter",["pointerout","pointerover"]),j("onPointerLeave",["pointerout","pointerover"]),m("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),m("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),m("onBeforeInput",["compositionend","keypress","textInput","paste"]),m("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),m("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),m("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Kr="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),pd=new Set("cancel close invalid load scroll toggle".split(" ").concat(Kr));function li(e,t,n){var r=e.type||"unknown-event";e.currentTarget=n,ja(r,t,void 0,e),e.currentTarget=null}function ai(e,t){t=(t&4)!==0;for(var n=0;n<e.length;n++){var r=e[n],l=r.event;r=r.listeners;e:{var a=void 0;if(t)for(var s=r.length-1;0<=s;s--){var c=r[s],p=c.instance,w=c.currentTarget;if(c=c.listener,p!==a&&l.isPropagationStopped())break e;li(l,c,w),a=p}else for(s=0;s<r.length;s++){if(c=r[s],p=c.instance,w=c.currentTarget,c=c.listener,p!==a&&l.isPropagationStopped())break e;li(l,c,w),a=p}}}if(Qt)throw e=jr,Qt=!1,jr=null,e}function ye(e,t){var n=t[ao];n===void 0&&(n=t[ao]=new Set);var r=e+"__bubble";n.has(r)||(oi(t,e,2,!1),n.add(r))}function Xa(e,t,n){var r=0;t&&(r|=4),oi(n,e,r,t)}var Ol="_reactListening"+Math.random().toString(36).slice(2);function Qr(e){if(!e[Ol]){e[Ol]=!0,x.forEach(function(n){n!=="selectionchange"&&(pd.has(n)||Xa(n,!1,e),Xa(n,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[Ol]||(t[Ol]=!0,Xa("selectionchange",!1,t))}}function oi(e,t,n,r){switch(Ts(t)){case 1:var l=Cc;break;case 4:l=Nc;break;default:l=Da}n=l.bind(null,t,n,e),l=void 0,!Mn||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(l=!0),r?l!==void 0?e.addEventListener(t,n,{capture:!0,passive:l}):e.addEventListener(t,n,!0):l!==void 0?e.addEventListener(t,n,{passive:l}):e.addEventListener(t,n,!1)}function Za(e,t,n,r,l){var a=r;if((t&1)===0&&(t&2)===0&&r!==null)e:for(;;){if(r===null)return;var s=r.tag;if(s===3||s===4){var c=r.stateNode.containerInfo;if(c===l||c.nodeType===8&&c.parentNode===l)break;if(s===4)for(s=r.return;s!==null;){var p=s.tag;if((p===3||p===4)&&(p=s.stateNode.containerInfo,p===l||p.nodeType===8&&p.parentNode===l))return;s=s.return}for(;c!==null;){if(s=Dn(c),s===null)return;if(p=s.tag,p===5||p===6){r=a=s;continue e}c=c.parentNode}}r=r.return}gt(function(){var w=a,N=ln(n),z=[];e:{var C=ni.get(e);if(C!==void 0){var I=Ia,B=e;switch(e){case"keypress":if(zl(n)===0)break e;case"keydown":case"keyup":I=Bc;break;case"focusin":B="focus",I=Ua;break;case"focusout":B="blur",I=Ua;break;case"beforeblur":case"afterblur":I=Ua;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":I=Ms;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":I=zc;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":I=Wc;break;case Xs:case Zs:case ei:I=Lc;break;case ti:I=Qc;break;case"scroll":I=jc;break;case"wheel":I=Jc;break;case"copy":case"cut":case"paste":I=Dc;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":I=Rs}var H=(t&4)!==0,Ne=!H&&e==="scroll",y=H?C!==null?C+"Capture":null:C;H=[];for(var f=w,_;f!==null;){_=f;var R=_.stateNode;if(_.tag===5&&R!==null&&(_=R,y!==null&&(R=Kt(f,y),R!=null&&H.push(Yr(f,R,_)))),Ne)break;f=f.return}0<H.length&&(C=new I(C,B,null,n,N),z.push({event:C,listeners:H}))}}if((t&7)===0){e:{if(C=e==="mouseover"||e==="pointerover",I=e==="mouseout"||e==="pointerout",C&&n!==Et&&(B=n.relatedTarget||n.fromElement)&&(Dn(B)||B[Yt]))break e;if((I||C)&&(C=N.window===N?N:(C=N.ownerDocument)?C.defaultView||C.parentWindow:window,I?(B=n.relatedTarget||n.toElement,I=w,B=B?Dn(B):null,B!==null&&(Ne=mt(B),B!==Ne||B.tag!==5&&B.tag!==6)&&(B=null)):(I=null,B=w),I!==B)){if(H=Ms,R="onMouseLeave",y="onMouseEnter",f="mouse",(e==="pointerout"||e==="pointerover")&&(H=Rs,R="onPointerLeave",y="onPointerEnter",f="pointer"),Ne=I==null?C:sr(I),_=B==null?C:sr(B),C=new H(R,f+"leave",I,n,N),C.target=Ne,C.relatedTarget=_,R=null,Dn(N)===w&&(H=new H(y,f+"enter",B,n,N),H.target=_,H.relatedTarget=Ne,R=H),Ne=R,I&&B)t:{for(H=I,y=B,f=0,_=H;_;_=ar(_))f++;for(_=0,R=y;R;R=ar(R))_++;for(;0<f-_;)H=ar(H),f--;for(;0<_-f;)y=ar(y),_--;for(;f--;){if(H===y||y!==null&&H===y.alternate)break t;H=ar(H),y=ar(y)}H=null}else H=null;I!==null&&si(z,C,I,H,!1),B!==null&&Ne!==null&&si(z,Ne,B,H,!0)}}e:{if(C=w?sr(w):window,I=C.nodeName&&C.nodeName.toLowerCase(),I==="select"||I==="input"&&C.type==="file")var W=nd;else if(As(C))if(Bs)W=od;else{W=ld;var Q=rd}else(I=C.nodeName)&&I.toLowerCase()==="input"&&(C.type==="checkbox"||C.type==="radio")&&(W=ad);if(W&&(W=W(e,w))){Us(z,W,n,N);break e}Q&&Q(e,C,w),e==="focusout"&&(Q=C._wrapperState)&&Q.controlled&&C.type==="number"&&kr(C,"number",C.value)}switch(Q=w?sr(w):window,e){case"focusin":(As(Q)||Q.contentEditable==="true")&&(rr=Q,Qa=w,Wr=null);break;case"focusout":Wr=Qa=rr=null;break;case"mousedown":Ya=!0;break;case"contextmenu":case"mouseup":case"dragend":Ya=!1,Gs(z,n,N);break;case"selectionchange":if(ud)break;case"keydown":case"keyup":Gs(z,n,N)}var Y;if(Va)e:{switch(e){case"compositionstart":var q="onCompositionStart";break e;case"compositionend":q="onCompositionEnd";break e;case"compositionupdate":q="onCompositionUpdate";break e}q=void 0}else nr?Is(e,n)&&(q="onCompositionEnd"):e==="keydown"&&n.keyCode===229&&(q="onCompositionStart");q&&(Ds&&n.locale!=="ko"&&(nr||q!=="onCompositionStart"?q==="onCompositionEnd"&&nr&&(Y=zs()):(fn=N,$a="value"in fn?fn.value:fn.textContent,nr=!0)),Q=$l(w,q),0<Q.length&&(q=new Ls(q,e,null,n,N),z.push({event:q,listeners:Q}),Y?q.data=Y:(Y=Fs(n),Y!==null&&(q.data=Y)))),(Y=qc?Xc(e,n):Zc(e,n))&&(w=$l(w,"onBeforeInput"),0<w.length&&(N=new Ls("onBeforeInput","beforeinput",null,n,N),z.push({event:N,listeners:w}),N.data=Y))}ai(z,t)})}function Yr(e,t,n){return{instance:e,listener:t,currentTarget:n}}function $l(e,t){for(var n=t+"Capture",r=[];e!==null;){var l=e,a=l.stateNode;l.tag===5&&a!==null&&(l=a,a=Kt(e,n),a!=null&&r.unshift(Yr(e,a,l)),a=Kt(e,t),a!=null&&r.push(Yr(e,a,l))),e=e.return}return r}function ar(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5);return e||null}function si(e,t,n,r,l){for(var a=t._reactName,s=[];n!==null&&n!==r;){var c=n,p=c.alternate,w=c.stateNode;if(p!==null&&p===r)break;c.tag===5&&w!==null&&(c=w,l?(p=Kt(n,a),p!=null&&s.unshift(Yr(n,p,c))):l||(p=Kt(n,a),p!=null&&s.push(Yr(n,p,c)))),n=n.return}s.length!==0&&e.push({event:t,listeners:s})}var fd=/\r\n?/g,gd=/\u0000|\uFFFD/g;function ii(e){return(typeof e=="string"?e:""+e).replace(fd,`
`).replace(gd,"")}function Il(e,t,n){if(t=ii(t),ii(e)!==t&&n)throw Error(i(425))}function Fl(){}var eo=null,to=null;function no(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var ro=typeof setTimeout=="function"?setTimeout:void 0,md=typeof clearTimeout=="function"?clearTimeout:void 0,ui=typeof Promise=="function"?Promise:void 0,hd=typeof queueMicrotask=="function"?queueMicrotask:typeof ui<"u"?function(e){return ui.resolve(null).then(e).catch(xd)}:ro;function xd(e){setTimeout(function(){throw e})}function lo(e,t){var n=t,r=0;do{var l=n.nextSibling;if(e.removeChild(n),l&&l.nodeType===8)if(n=l.data,n==="/$"){if(r===0){e.removeChild(l),Ir(t);return}r--}else n!=="$"&&n!=="$?"&&n!=="$!"||r++;n=l}while(n);Ir(t)}function mn(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?")break;if(t==="/$")return null}}return e}function ci(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="$"||n==="$!"||n==="$?"){if(t===0)return e;t--}else n==="/$"&&t++}e=e.previousSibling}return null}var or=Math.random().toString(36).slice(2),At="__reactFiber$"+or,Jr="__reactProps$"+or,Yt="__reactContainer$"+or,ao="__reactEvents$"+or,vd="__reactListeners$"+or,yd="__reactHandles$"+or;function Dn(e){var t=e[At];if(t)return t;for(var n=e.parentNode;n;){if(t=n[Yt]||n[At]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(e=ci(e);e!==null;){if(n=e[At])return n;e=ci(e)}return t}e=n,n=e.parentNode}return null}function Gr(e){return e=e[At]||e[Yt],!e||e.tag!==5&&e.tag!==6&&e.tag!==13&&e.tag!==3?null:e}function sr(e){if(e.tag===5||e.tag===6)return e.stateNode;throw Error(i(33))}function Al(e){return e[Jr]||null}var oo=[],ir=-1;function hn(e){return{current:e}}function _e(e){0>ir||(e.current=oo[ir],oo[ir]=null,ir--)}function xe(e,t){ir++,oo[ir]=e.current,e.current=t}var xn={},Ve=hn(xn),Xe=hn(!1),On=xn;function ur(e,t){var n=e.type.contextTypes;if(!n)return xn;var r=e.stateNode;if(r&&r.__reactInternalMemoizedUnmaskedChildContext===t)return r.__reactInternalMemoizedMaskedChildContext;var l={},a;for(a in n)l[a]=t[a];return r&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=t,e.__reactInternalMemoizedMaskedChildContext=l),l}function Ze(e){return e=e.childContextTypes,e!=null}function Ul(){_e(Xe),_e(Ve)}function di(e,t,n){if(Ve.current!==xn)throw Error(i(168));xe(Ve,t),xe(Xe,n)}function pi(e,t,n){var r=e.stateNode;if(t=t.childContextTypes,typeof r.getChildContext!="function")return n;r=r.getChildContext();for(var l in r)if(!(l in t))throw Error(i(108,me(e)||"Unknown",l));return F({},n,r)}function Bl(e){return e=(e=e.stateNode)&&e.__reactInternalMemoizedMergedChildContext||xn,On=Ve.current,xe(Ve,e),xe(Xe,Xe.current),!0}function fi(e,t,n){var r=e.stateNode;if(!r)throw Error(i(169));n?(e=pi(e,t,On),r.__reactInternalMemoizedMergedChildContext=e,_e(Xe),_e(Ve),xe(Ve,e)):_e(Xe),xe(Xe,n)}var Jt=null,Vl=!1,so=!1;function gi(e){Jt===null?Jt=[e]:Jt.push(e)}function _d(e){Vl=!0,gi(e)}function vn(){if(!so&&Jt!==null){so=!0;var e=0,t=ge;try{var n=Jt;for(ge=1;e<n.length;e++){var r=n[e];do r=r(!0);while(r!==null)}Jt=null,Vl=!1}catch(l){throw Jt!==null&&(Jt=Jt.slice(e+1)),Pr(K,vn),l}finally{ge=t,so=!1}}return null}var cr=[],dr=0,Hl=null,Wl=0,xt=[],vt=0,$n=null,Gt=1,qt="";function In(e,t){cr[dr++]=Wl,cr[dr++]=Hl,Hl=e,Wl=t}function mi(e,t,n){xt[vt++]=Gt,xt[vt++]=qt,xt[vt++]=$n,$n=e;var r=Gt;e=qt;var l=32-Ct(r)-1;r&=~(1<<l),n+=1;var a=32-Ct(t)+l;if(30<a){var s=l-l%5;a=(r&(1<<s)-1).toString(32),r>>=s,l-=s,Gt=1<<32-Ct(t)+l|n<<l|r,qt=a+e}else Gt=1<<a|n<<l|r,qt=e}function io(e){e.return!==null&&(In(e,1),mi(e,1,0))}function uo(e){for(;e===Hl;)Hl=cr[--dr],cr[dr]=null,Wl=cr[--dr],cr[dr]=null;for(;e===$n;)$n=xt[--vt],xt[vt]=null,qt=xt[--vt],xt[vt]=null,Gt=xt[--vt],xt[vt]=null}var it=null,ut=null,ke=!1,jt=null;function hi(e,t){var n=kt(5,null,null,0);n.elementType="DELETED",n.stateNode=t,n.return=e,t=e.deletions,t===null?(e.deletions=[n],e.flags|=16):t.push(n)}function xi(e,t){switch(e.tag){case 5:var n=e.type;return t=t.nodeType!==1||n.toLowerCase()!==t.nodeName.toLowerCase()?null:t,t!==null?(e.stateNode=t,it=e,ut=mn(t.firstChild),!0):!1;case 6:return t=e.pendingProps===""||t.nodeType!==3?null:t,t!==null?(e.stateNode=t,it=e,ut=null,!0):!1;case 13:return t=t.nodeType!==8?null:t,t!==null?(n=$n!==null?{id:Gt,overflow:qt}:null,e.memoizedState={dehydrated:t,treeContext:n,retryLane:1073741824},n=kt(18,null,null,0),n.stateNode=t,n.return=e,e.child=n,it=e,ut=null,!0):!1;default:return!1}}function co(e){return(e.mode&1)!==0&&(e.flags&128)===0}function po(e){if(ke){var t=ut;if(t){var n=t;if(!xi(e,t)){if(co(e))throw Error(i(418));t=mn(n.nextSibling);var r=it;t&&xi(e,t)?hi(r,n):(e.flags=e.flags&-4097|2,ke=!1,it=e)}}else{if(co(e))throw Error(i(418));e.flags=e.flags&-4097|2,ke=!1,it=e}}}function vi(e){for(e=e.return;e!==null&&e.tag!==5&&e.tag!==3&&e.tag!==13;)e=e.return;it=e}function Kl(e){if(e!==it)return!1;if(!ke)return vi(e),ke=!0,!1;var t;if((t=e.tag!==3)&&!(t=e.tag!==5)&&(t=e.type,t=t!=="head"&&t!=="body"&&!no(e.type,e.memoizedProps)),t&&(t=ut)){if(co(e))throw yi(),Error(i(418));for(;t;)hi(e,t),t=mn(t.nextSibling)}if(vi(e),e.tag===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(i(317));e:{for(e=e.nextSibling,t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="/$"){if(t===0){ut=mn(e.nextSibling);break e}t--}else n!=="$"&&n!=="$!"&&n!=="$?"||t++}e=e.nextSibling}ut=null}}else ut=it?mn(e.stateNode.nextSibling):null;return!0}function yi(){for(var e=ut;e;)e=mn(e.nextSibling)}function pr(){ut=it=null,ke=!1}function fo(e){jt===null?jt=[e]:jt.push(e)}var wd=we.ReactCurrentBatchConfig;function qr(e,t,n){if(e=n.ref,e!==null&&typeof e!="function"&&typeof e!="object"){if(n._owner){if(n=n._owner,n){if(n.tag!==1)throw Error(i(309));var r=n.stateNode}if(!r)throw Error(i(147,e));var l=r,a=""+e;return t!==null&&t.ref!==null&&typeof t.ref=="function"&&t.ref._stringRef===a?t.ref:(t=function(s){var c=l.refs;s===null?delete c[a]:c[a]=s},t._stringRef=a,t)}if(typeof e!="string")throw Error(i(284));if(!n._owner)throw Error(i(290,e))}return e}function Ql(e,t){throw e=Object.prototype.toString.call(t),Error(i(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e))}function _i(e){var t=e._init;return t(e._payload)}function wi(e){function t(y,f){if(e){var _=y.deletions;_===null?(y.deletions=[f],y.flags|=16):_.push(f)}}function n(y,f){if(!e)return null;for(;f!==null;)t(y,f),f=f.sibling;return null}function r(y,f){for(y=new Map;f!==null;)f.key!==null?y.set(f.key,f):y.set(f.index,f),f=f.sibling;return y}function l(y,f){return y=Cn(y,f),y.index=0,y.sibling=null,y}function a(y,f,_){return y.index=_,e?(_=y.alternate,_!==null?(_=_.index,_<f?(y.flags|=2,f):_):(y.flags|=2,f)):(y.flags|=1048576,f)}function s(y){return e&&y.alternate===null&&(y.flags|=2),y}function c(y,f,_,R){return f===null||f.tag!==6?(f=ls(_,y.mode,R),f.return=y,f):(f=l(f,_),f.return=y,f)}function p(y,f,_,R){var W=_.type;return W===Te?N(y,f,_.props.children,R,_.key):f!==null&&(f.elementType===W||typeof W=="object"&&W!==null&&W.$$typeof===Ie&&_i(W)===f.type)?(R=l(f,_.props),R.ref=qr(y,f,_),R.return=y,R):(R=xa(_.type,_.key,_.props,null,y.mode,R),R.ref=qr(y,f,_),R.return=y,R)}function w(y,f,_,R){return f===null||f.tag!==4||f.stateNode.containerInfo!==_.containerInfo||f.stateNode.implementation!==_.implementation?(f=as(_,y.mode,R),f.return=y,f):(f=l(f,_.children||[]),f.return=y,f)}function N(y,f,_,R,W){return f===null||f.tag!==7?(f=Kn(_,y.mode,R,W),f.return=y,f):(f=l(f,_),f.return=y,f)}function z(y,f,_){if(typeof f=="string"&&f!==""||typeof f=="number")return f=ls(""+f,y.mode,_),f.return=y,f;if(typeof f=="object"&&f!==null){switch(f.$$typeof){case G:return _=xa(f.type,f.key,f.props,null,y.mode,_),_.ref=qr(y,null,f),_.return=y,_;case ce:return f=as(f,y.mode,_),f.return=y,f;case Ie:var R=f._init;return z(y,R(f._payload),_)}if(nn(f)||J(f))return f=Kn(f,y.mode,_,null),f.return=y,f;Ql(y,f)}return null}function C(y,f,_,R){var W=f!==null?f.key:null;if(typeof _=="string"&&_!==""||typeof _=="number")return W!==null?null:c(y,f,""+_,R);if(typeof _=="object"&&_!==null){switch(_.$$typeof){case G:return _.key===W?p(y,f,_,R):null;case ce:return _.key===W?w(y,f,_,R):null;case Ie:return W=_._init,C(y,f,W(_._payload),R)}if(nn(_)||J(_))return W!==null?null:N(y,f,_,R,null);Ql(y,_)}return null}function I(y,f,_,R,W){if(typeof R=="string"&&R!==""||typeof R=="number")return y=y.get(_)||null,c(f,y,""+R,W);if(typeof R=="object"&&R!==null){switch(R.$$typeof){case G:return y=y.get(R.key===null?_:R.key)||null,p(f,y,R,W);case ce:return y=y.get(R.key===null?_:R.key)||null,w(f,y,R,W);case Ie:var Q=R._init;return I(y,f,_,Q(R._payload),W)}if(nn(R)||J(R))return y=y.get(_)||null,N(f,y,R,W,null);Ql(f,R)}return null}function B(y,f,_,R){for(var W=null,Q=null,Y=f,q=f=0,$e=null;Y!==null&&q<_.length;q++){Y.index>q?($e=Y,Y=null):$e=Y.sibling;var ue=C(y,Y,_[q],R);if(ue===null){Y===null&&(Y=$e);break}e&&Y&&ue.alternate===null&&t(y,Y),f=a(ue,f,q),Q===null?W=ue:Q.sibling=ue,Q=ue,Y=$e}if(q===_.length)return n(y,Y),ke&&In(y,q),W;if(Y===null){for(;q<_.length;q++)Y=z(y,_[q],R),Y!==null&&(f=a(Y,f,q),Q===null?W=Y:Q.sibling=Y,Q=Y);return ke&&In(y,q),W}for(Y=r(y,Y);q<_.length;q++)$e=I(Y,y,q,_[q],R),$e!==null&&(e&&$e.alternate!==null&&Y.delete($e.key===null?q:$e.key),f=a($e,f,q),Q===null?W=$e:Q.sibling=$e,Q=$e);return e&&Y.forEach(function(Nn){return t(y,Nn)}),ke&&In(y,q),W}function H(y,f,_,R){var W=J(_);if(typeof W!="function")throw Error(i(150));if(_=W.call(_),_==null)throw Error(i(151));for(var Q=W=null,Y=f,q=f=0,$e=null,ue=_.next();Y!==null&&!ue.done;q++,ue=_.next()){Y.index>q?($e=Y,Y=null):$e=Y.sibling;var Nn=C(y,Y,ue.value,R);if(Nn===null){Y===null&&(Y=$e);break}e&&Y&&Nn.alternate===null&&t(y,Y),f=a(Nn,f,q),Q===null?W=Nn:Q.sibling=Nn,Q=Nn,Y=$e}if(ue.done)return n(y,Y),ke&&In(y,q),W;if(Y===null){for(;!ue.done;q++,ue=_.next())ue=z(y,ue.value,R),ue!==null&&(f=a(ue,f,q),Q===null?W=ue:Q.sibling=ue,Q=ue);return ke&&In(y,q),W}for(Y=r(y,Y);!ue.done;q++,ue=_.next())ue=I(Y,y,q,ue.value,R),ue!==null&&(e&&ue.alternate!==null&&Y.delete(ue.key===null?q:ue.key),f=a(ue,f,q),Q===null?W=ue:Q.sibling=ue,Q=ue);return e&&Y.forEach(function(ep){return t(y,ep)}),ke&&In(y,q),W}function Ne(y,f,_,R){if(typeof _=="object"&&_!==null&&_.type===Te&&_.key===null&&(_=_.props.children),typeof _=="object"&&_!==null){switch(_.$$typeof){case G:e:{for(var W=_.key,Q=f;Q!==null;){if(Q.key===W){if(W=_.type,W===Te){if(Q.tag===7){n(y,Q.sibling),f=l(Q,_.props.children),f.return=y,y=f;break e}}else if(Q.elementType===W||typeof W=="object"&&W!==null&&W.$$typeof===Ie&&_i(W)===Q.type){n(y,Q.sibling),f=l(Q,_.props),f.ref=qr(y,Q,_),f.return=y,y=f;break e}n(y,Q);break}else t(y,Q);Q=Q.sibling}_.type===Te?(f=Kn(_.props.children,y.mode,R,_.key),f.return=y,y=f):(R=xa(_.type,_.key,_.props,null,y.mode,R),R.ref=qr(y,f,_),R.return=y,y=R)}return s(y);case ce:e:{for(Q=_.key;f!==null;){if(f.key===Q)if(f.tag===4&&f.stateNode.containerInfo===_.containerInfo&&f.stateNode.implementation===_.implementation){n(y,f.sibling),f=l(f,_.children||[]),f.return=y,y=f;break e}else{n(y,f);break}else t(y,f);f=f.sibling}f=as(_,y.mode,R),f.return=y,y=f}return s(y);case Ie:return Q=_._init,Ne(y,f,Q(_._payload),R)}if(nn(_))return B(y,f,_,R);if(J(_))return H(y,f,_,R);Ql(y,_)}return typeof _=="string"&&_!==""||typeof _=="number"?(_=""+_,f!==null&&f.tag===6?(n(y,f.sibling),f=l(f,_),f.return=y,y=f):(n(y,f),f=ls(_,y.mode,R),f.return=y,y=f),s(y)):n(y,f)}return Ne}var fr=wi(!0),ki=wi(!1),Yl=hn(null),Jl=null,gr=null,go=null;function mo(){go=gr=Jl=null}function ho(e){var t=Yl.current;_e(Yl),e._currentValue=t}function xo(e,t,n){for(;e!==null;){var r=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,r!==null&&(r.childLanes|=t)):r!==null&&(r.childLanes&t)!==t&&(r.childLanes|=t),e===n)break;e=e.return}}function mr(e,t){Jl=e,go=gr=null,e=e.dependencies,e!==null&&e.firstContext!==null&&((e.lanes&t)!==0&&(et=!0),e.firstContext=null)}function yt(e){var t=e._currentValue;if(go!==e)if(e={context:e,memoizedValue:t,next:null},gr===null){if(Jl===null)throw Error(i(308));gr=e,Jl.dependencies={lanes:0,firstContext:e}}else gr=gr.next=e;return t}var Fn=null;function vo(e){Fn===null?Fn=[e]:Fn.push(e)}function bi(e,t,n,r){var l=t.interleaved;return l===null?(n.next=n,vo(t)):(n.next=l.next,l.next=n),t.interleaved=n,Xt(e,r)}function Xt(e,t){e.lanes|=t;var n=e.alternate;for(n!==null&&(n.lanes|=t),n=e,e=e.return;e!==null;)e.childLanes|=t,n=e.alternate,n!==null&&(n.childLanes|=t),n=e,e=e.return;return n.tag===3?n.stateNode:null}var yn=!1;function yo(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function Si(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,effects:e.effects})}function Zt(e,t){return{eventTime:e,lane:t,tag:0,payload:null,callback:null,next:null}}function _n(e,t,n){var r=e.updateQueue;if(r===null)return null;if(r=r.shared,(ie&2)!==0){var l=r.pending;return l===null?t.next=t:(t.next=l.next,l.next=t),r.pending=t,Xt(e,n)}return l=r.interleaved,l===null?(t.next=t,vo(r)):(t.next=l.next,l.next=t),r.interleaved=t,Xt(e,n)}function Gl(e,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,(n&4194240)!==0)){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,Ma(e,n)}}function Ei(e,t){var n=e.updateQueue,r=e.alternate;if(r!==null&&(r=r.updateQueue,n===r)){var l=null,a=null;if(n=n.firstBaseUpdate,n!==null){do{var s={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};a===null?l=a=s:a=a.next=s,n=n.next}while(n!==null);a===null?l=a=t:a=a.next=t}else l=a=t;n={baseState:r.baseState,firstBaseUpdate:l,lastBaseUpdate:a,shared:r.shared,effects:r.effects},e.updateQueue=n;return}e=n.lastBaseUpdate,e===null?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}function ql(e,t,n,r){var l=e.updateQueue;yn=!1;var a=l.firstBaseUpdate,s=l.lastBaseUpdate,c=l.shared.pending;if(c!==null){l.shared.pending=null;var p=c,w=p.next;p.next=null,s===null?a=w:s.next=w,s=p;var N=e.alternate;N!==null&&(N=N.updateQueue,c=N.lastBaseUpdate,c!==s&&(c===null?N.firstBaseUpdate=w:c.next=w,N.lastBaseUpdate=p))}if(a!==null){var z=l.baseState;s=0,N=w=p=null,c=a;do{var C=c.lane,I=c.eventTime;if((r&C)===C){N!==null&&(N=N.next={eventTime:I,lane:0,tag:c.tag,payload:c.payload,callback:c.callback,next:null});e:{var B=e,H=c;switch(C=t,I=n,H.tag){case 1:if(B=H.payload,typeof B=="function"){z=B.call(I,z,C);break e}z=B;break e;case 3:B.flags=B.flags&-65537|128;case 0:if(B=H.payload,C=typeof B=="function"?B.call(I,z,C):B,C==null)break e;z=F({},z,C);break e;case 2:yn=!0}}c.callback!==null&&c.lane!==0&&(e.flags|=64,C=l.effects,C===null?l.effects=[c]:C.push(c))}else I={eventTime:I,lane:C,tag:c.tag,payload:c.payload,callback:c.callback,next:null},N===null?(w=N=I,p=z):N=N.next=I,s|=C;if(c=c.next,c===null){if(c=l.shared.pending,c===null)break;C=c,c=C.next,C.next=null,l.lastBaseUpdate=C,l.shared.pending=null}}while(!0);if(N===null&&(p=z),l.baseState=p,l.firstBaseUpdate=w,l.lastBaseUpdate=N,t=l.shared.interleaved,t!==null){l=t;do s|=l.lane,l=l.next;while(l!==t)}else a===null&&(l.shared.lanes=0);Bn|=s,e.lanes=s,e.memoizedState=z}}function Ci(e,t,n){if(e=t.effects,t.effects=null,e!==null)for(t=0;t<e.length;t++){var r=e[t],l=r.callback;if(l!==null){if(r.callback=null,r=n,typeof l!="function")throw Error(i(191,l));l.call(r)}}}var Xr={},Ut=hn(Xr),Zr=hn(Xr),el=hn(Xr);function An(e){if(e===Xr)throw Error(i(174));return e}function _o(e,t){switch(xe(el,t),xe(Zr,e),xe(Ut,Xr),e=t.nodeType,e){case 9:case 11:t=(t=t.documentElement)?t.namespaceURI:qn(null,"");break;default:e=e===8?t.parentNode:t,t=e.namespaceURI||null,e=e.tagName,t=qn(t,e)}_e(Ut),xe(Ut,t)}function hr(){_e(Ut),_e(Zr),_e(el)}function Ni(e){An(el.current);var t=An(Ut.current),n=qn(t,e.type);t!==n&&(xe(Zr,e),xe(Ut,n))}function wo(e){Zr.current===e&&(_e(Ut),_e(Zr))}var Se=hn(0);function Xl(e){for(var t=e;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||n.data==="$?"||n.data==="$!"))return t}else if(t.tag===19&&t.memoizedProps.revealOrder!==void 0){if((t.flags&128)!==0)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var ko=[];function bo(){for(var e=0;e<ko.length;e++)ko[e]._workInProgressVersionPrimary=null;ko.length=0}var Zl=we.ReactCurrentDispatcher,So=we.ReactCurrentBatchConfig,Un=0,Ee=null,Me=null,De=null,ea=!1,tl=!1,nl=0,kd=0;function He(){throw Error(i(321))}function Eo(e,t){if(t===null)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!Nt(e[n],t[n]))return!1;return!0}function Co(e,t,n,r,l,a){if(Un=a,Ee=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,Zl.current=e===null||e.memoizedState===null?Cd:Nd,e=n(r,l),tl){a=0;do{if(tl=!1,nl=0,25<=a)throw Error(i(301));a+=1,De=Me=null,t.updateQueue=null,Zl.current=jd,e=n(r,l)}while(tl)}if(Zl.current=ra,t=Me!==null&&Me.next!==null,Un=0,De=Me=Ee=null,ea=!1,t)throw Error(i(300));return e}function No(){var e=nl!==0;return nl=0,e}function Bt(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return De===null?Ee.memoizedState=De=e:De=De.next=e,De}function _t(){if(Me===null){var e=Ee.alternate;e=e!==null?e.memoizedState:null}else e=Me.next;var t=De===null?Ee.memoizedState:De.next;if(t!==null)De=t,Me=e;else{if(e===null)throw Error(i(310));Me=e,e={memoizedState:Me.memoizedState,baseState:Me.baseState,baseQueue:Me.baseQueue,queue:Me.queue,next:null},De===null?Ee.memoizedState=De=e:De=De.next=e}return De}function rl(e,t){return typeof t=="function"?t(e):t}function jo(e){var t=_t(),n=t.queue;if(n===null)throw Error(i(311));n.lastRenderedReducer=e;var r=Me,l=r.baseQueue,a=n.pending;if(a!==null){if(l!==null){var s=l.next;l.next=a.next,a.next=s}r.baseQueue=l=a,n.pending=null}if(l!==null){a=l.next,r=r.baseState;var c=s=null,p=null,w=a;do{var N=w.lane;if((Un&N)===N)p!==null&&(p=p.next={lane:0,action:w.action,hasEagerState:w.hasEagerState,eagerState:w.eagerState,next:null}),r=w.hasEagerState?w.eagerState:e(r,w.action);else{var z={lane:N,action:w.action,hasEagerState:w.hasEagerState,eagerState:w.eagerState,next:null};p===null?(c=p=z,s=r):p=p.next=z,Ee.lanes|=N,Bn|=N}w=w.next}while(w!==null&&w!==a);p===null?s=r:p.next=c,Nt(r,t.memoizedState)||(et=!0),t.memoizedState=r,t.baseState=s,t.baseQueue=p,n.lastRenderedState=r}if(e=n.interleaved,e!==null){l=e;do a=l.lane,Ee.lanes|=a,Bn|=a,l=l.next;while(l!==e)}else l===null&&(n.lanes=0);return[t.memoizedState,n.dispatch]}function To(e){var t=_t(),n=t.queue;if(n===null)throw Error(i(311));n.lastRenderedReducer=e;var r=n.dispatch,l=n.pending,a=t.memoizedState;if(l!==null){n.pending=null;var s=l=l.next;do a=e(a,s.action),s=s.next;while(s!==l);Nt(a,t.memoizedState)||(et=!0),t.memoizedState=a,t.baseQueue===null&&(t.baseState=a),n.lastRenderedState=a}return[a,r]}function ji(){}function Ti(e,t){var n=Ee,r=_t(),l=t(),a=!Nt(r.memoizedState,l);if(a&&(r.memoizedState=l,et=!0),r=r.queue,zo(Mi.bind(null,n,r,e),[e]),r.getSnapshot!==t||a||De!==null&&De.memoizedState.tag&1){if(n.flags|=2048,ll(9,Pi.bind(null,n,r,l,t),void 0,null),Oe===null)throw Error(i(349));(Un&30)!==0||zi(n,t,l)}return l}function zi(e,t,n){e.flags|=16384,e={getSnapshot:t,value:n},t=Ee.updateQueue,t===null?(t={lastEffect:null,stores:null},Ee.updateQueue=t,t.stores=[e]):(n=t.stores,n===null?t.stores=[e]:n.push(e))}function Pi(e,t,n,r){t.value=n,t.getSnapshot=r,Li(t)&&Ri(e)}function Mi(e,t,n){return n(function(){Li(t)&&Ri(e)})}function Li(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!Nt(e,n)}catch{return!0}}function Ri(e){var t=Xt(e,1);t!==null&&Mt(t,e,1,-1)}function Di(e){var t=Bt();return typeof e=="function"&&(e=e()),t.memoizedState=t.baseState=e,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:rl,lastRenderedState:e},t.queue=e,e=e.dispatch=Ed.bind(null,Ee,e),[t.memoizedState,e]}function ll(e,t,n,r){return e={tag:e,create:t,destroy:n,deps:r,next:null},t=Ee.updateQueue,t===null?(t={lastEffect:null,stores:null},Ee.updateQueue=t,t.lastEffect=e.next=e):(n=t.lastEffect,n===null?t.lastEffect=e.next=e:(r=n.next,n.next=e,e.next=r,t.lastEffect=e)),e}function Oi(){return _t().memoizedState}function ta(e,t,n,r){var l=Bt();Ee.flags|=e,l.memoizedState=ll(1|t,n,void 0,r===void 0?null:r)}function na(e,t,n,r){var l=_t();r=r===void 0?null:r;var a=void 0;if(Me!==null){var s=Me.memoizedState;if(a=s.destroy,r!==null&&Eo(r,s.deps)){l.memoizedState=ll(t,n,a,r);return}}Ee.flags|=e,l.memoizedState=ll(1|t,n,a,r)}function $i(e,t){return ta(8390656,8,e,t)}function zo(e,t){return na(2048,8,e,t)}function Ii(e,t){return na(4,2,e,t)}function Fi(e,t){return na(4,4,e,t)}function Ai(e,t){if(typeof t=="function")return e=e(),t(e),function(){t(null)};if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function Ui(e,t,n){return n=n!=null?n.concat([e]):null,na(4,4,Ai.bind(null,t,e),n)}function Po(){}function Bi(e,t){var n=_t();t=t===void 0?null:t;var r=n.memoizedState;return r!==null&&t!==null&&Eo(t,r[1])?r[0]:(n.memoizedState=[e,t],e)}function Vi(e,t){var n=_t();t=t===void 0?null:t;var r=n.memoizedState;return r!==null&&t!==null&&Eo(t,r[1])?r[0]:(e=e(),n.memoizedState=[e,t],e)}function Hi(e,t,n){return(Un&21)===0?(e.baseState&&(e.baseState=!1,et=!0),e.memoizedState=n):(Nt(n,t)||(n=_s(),Ee.lanes|=n,Bn|=n,e.baseState=!0),t)}function bd(e,t){var n=ge;ge=n!==0&&4>n?n:4,e(!0);var r=So.transition;So.transition={};try{e(!1),t()}finally{ge=n,So.transition=r}}function Wi(){return _t().memoizedState}function Sd(e,t,n){var r=Sn(e);if(n={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null},Ki(e))Qi(t,n);else if(n=bi(e,t,n,r),n!==null){var l=Je();Mt(n,e,r,l),Yi(n,t,r)}}function Ed(e,t,n){var r=Sn(e),l={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null};if(Ki(e))Qi(t,l);else{var a=e.alternate;if(e.lanes===0&&(a===null||a.lanes===0)&&(a=t.lastRenderedReducer,a!==null))try{var s=t.lastRenderedState,c=a(s,n);if(l.hasEagerState=!0,l.eagerState=c,Nt(c,s)){var p=t.interleaved;p===null?(l.next=l,vo(t)):(l.next=p.next,p.next=l),t.interleaved=l;return}}catch{}finally{}n=bi(e,t,l,r),n!==null&&(l=Je(),Mt(n,e,r,l),Yi(n,t,r))}}function Ki(e){var t=e.alternate;return e===Ee||t!==null&&t===Ee}function Qi(e,t){tl=ea=!0;var n=e.pending;n===null?t.next=t:(t.next=n.next,n.next=t),e.pending=t}function Yi(e,t,n){if((n&4194240)!==0){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,Ma(e,n)}}var ra={readContext:yt,useCallback:He,useContext:He,useEffect:He,useImperativeHandle:He,useInsertionEffect:He,useLayoutEffect:He,useMemo:He,useReducer:He,useRef:He,useState:He,useDebugValue:He,useDeferredValue:He,useTransition:He,useMutableSource:He,useSyncExternalStore:He,useId:He,unstable_isNewReconciler:!1},Cd={readContext:yt,useCallback:function(e,t){return Bt().memoizedState=[e,t===void 0?null:t],e},useContext:yt,useEffect:$i,useImperativeHandle:function(e,t,n){return n=n!=null?n.concat([e]):null,ta(4194308,4,Ai.bind(null,t,e),n)},useLayoutEffect:function(e,t){return ta(4194308,4,e,t)},useInsertionEffect:function(e,t){return ta(4,2,e,t)},useMemo:function(e,t){var n=Bt();return t=t===void 0?null:t,e=e(),n.memoizedState=[e,t],e},useReducer:function(e,t,n){var r=Bt();return t=n!==void 0?n(t):t,r.memoizedState=r.baseState=t,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:t},r.queue=e,e=e.dispatch=Sd.bind(null,Ee,e),[r.memoizedState,e]},useRef:function(e){var t=Bt();return e={current:e},t.memoizedState=e},useState:Di,useDebugValue:Po,useDeferredValue:function(e){return Bt().memoizedState=e},useTransition:function(){var e=Di(!1),t=e[0];return e=bd.bind(null,e[1]),Bt().memoizedState=e,[t,e]},useMutableSource:function(){},useSyncExternalStore:function(e,t,n){var r=Ee,l=Bt();if(ke){if(n===void 0)throw Error(i(407));n=n()}else{if(n=t(),Oe===null)throw Error(i(349));(Un&30)!==0||zi(r,t,n)}l.memoizedState=n;var a={value:n,getSnapshot:t};return l.queue=a,$i(Mi.bind(null,r,a,e),[e]),r.flags|=2048,ll(9,Pi.bind(null,r,a,n,t),void 0,null),n},useId:function(){var e=Bt(),t=Oe.identifierPrefix;if(ke){var n=qt,r=Gt;n=(r&~(1<<32-Ct(r)-1)).toString(32)+n,t=":"+t+"R"+n,n=nl++,0<n&&(t+="H"+n.toString(32)),t+=":"}else n=kd++,t=":"+t+"r"+n.toString(32)+":";return e.memoizedState=t},unstable_isNewReconciler:!1},Nd={readContext:yt,useCallback:Bi,useContext:yt,useEffect:zo,useImperativeHandle:Ui,useInsertionEffect:Ii,useLayoutEffect:Fi,useMemo:Vi,useReducer:jo,useRef:Oi,useState:function(){return jo(rl)},useDebugValue:Po,useDeferredValue:function(e){var t=_t();return Hi(t,Me.memoizedState,e)},useTransition:function(){var e=jo(rl)[0],t=_t().memoizedState;return[e,t]},useMutableSource:ji,useSyncExternalStore:Ti,useId:Wi,unstable_isNewReconciler:!1},jd={readContext:yt,useCallback:Bi,useContext:yt,useEffect:zo,useImperativeHandle:Ui,useInsertionEffect:Ii,useLayoutEffect:Fi,useMemo:Vi,useReducer:To,useRef:Oi,useState:function(){return To(rl)},useDebugValue:Po,useDeferredValue:function(e){var t=_t();return Me===null?t.memoizedState=e:Hi(t,Me.memoizedState,e)},useTransition:function(){var e=To(rl)[0],t=_t().memoizedState;return[e,t]},useMutableSource:ji,useSyncExternalStore:Ti,useId:Wi,unstable_isNewReconciler:!1};function Tt(e,t){if(e&&e.defaultProps){t=F({},t),e=e.defaultProps;for(var n in e)t[n]===void 0&&(t[n]=e[n]);return t}return t}function Mo(e,t,n,r){t=e.memoizedState,n=n(r,t),n=n==null?t:F({},t,n),e.memoizedState=n,e.lanes===0&&(e.updateQueue.baseState=n)}var la={isMounted:function(e){return(e=e._reactInternals)?mt(e)===e:!1},enqueueSetState:function(e,t,n){e=e._reactInternals;var r=Je(),l=Sn(e),a=Zt(r,l);a.payload=t,n!=null&&(a.callback=n),t=_n(e,a,l),t!==null&&(Mt(t,e,l,r),Gl(t,e,l))},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var r=Je(),l=Sn(e),a=Zt(r,l);a.tag=1,a.payload=t,n!=null&&(a.callback=n),t=_n(e,a,l),t!==null&&(Mt(t,e,l,r),Gl(t,e,l))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=Je(),r=Sn(e),l=Zt(n,r);l.tag=2,t!=null&&(l.callback=t),t=_n(e,l,r),t!==null&&(Mt(t,e,r,n),Gl(t,e,r))}};function Ji(e,t,n,r,l,a,s){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(r,a,s):t.prototype&&t.prototype.isPureReactComponent?!Hr(n,r)||!Hr(l,a):!0}function Gi(e,t,n){var r=!1,l=xn,a=t.contextType;return typeof a=="object"&&a!==null?a=yt(a):(l=Ze(t)?On:Ve.current,r=t.contextTypes,a=(r=r!=null)?ur(e,l):xn),t=new t(n,a),e.memoizedState=t.state!==null&&t.state!==void 0?t.state:null,t.updater=la,e.stateNode=t,t._reactInternals=e,r&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=l,e.__reactInternalMemoizedMaskedChildContext=a),t}function qi(e,t,n,r){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(n,r),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(n,r),t.state!==e&&la.enqueueReplaceState(t,t.state,null)}function Lo(e,t,n,r){var l=e.stateNode;l.props=n,l.state=e.memoizedState,l.refs={},yo(e);var a=t.contextType;typeof a=="object"&&a!==null?l.context=yt(a):(a=Ze(t)?On:Ve.current,l.context=ur(e,a)),l.state=e.memoizedState,a=t.getDerivedStateFromProps,typeof a=="function"&&(Mo(e,t,a,n),l.state=e.memoizedState),typeof t.getDerivedStateFromProps=="function"||typeof l.getSnapshotBeforeUpdate=="function"||typeof l.UNSAFE_componentWillMount!="function"&&typeof l.componentWillMount!="function"||(t=l.state,typeof l.componentWillMount=="function"&&l.componentWillMount(),typeof l.UNSAFE_componentWillMount=="function"&&l.UNSAFE_componentWillMount(),t!==l.state&&la.enqueueReplaceState(l,l.state,null),ql(e,n,l,r),l.state=e.memoizedState),typeof l.componentDidMount=="function"&&(e.flags|=4194308)}function xr(e,t){try{var n="",r=t;do n+=le(r),r=r.return;while(r);var l=n}catch(a){l=`
Error generating stack: `+a.message+`
`+a.stack}return{value:e,source:t,stack:l,digest:null}}function Ro(e,t,n){return{value:e,source:null,stack:n??null,digest:t??null}}function Do(e,t){try{console.error(t.value)}catch(n){setTimeout(function(){throw n})}}var Td=typeof WeakMap=="function"?WeakMap:Map;function Xi(e,t,n){n=Zt(-1,n),n.tag=3,n.payload={element:null};var r=t.value;return n.callback=function(){da||(da=!0,Go=r),Do(e,t)},n}function Zi(e,t,n){n=Zt(-1,n),n.tag=3;var r=e.type.getDerivedStateFromError;if(typeof r=="function"){var l=t.value;n.payload=function(){return r(l)},n.callback=function(){Do(e,t)}}var a=e.stateNode;return a!==null&&typeof a.componentDidCatch=="function"&&(n.callback=function(){Do(e,t),typeof r!="function"&&(kn===null?kn=new Set([this]):kn.add(this));var s=t.stack;this.componentDidCatch(t.value,{componentStack:s!==null?s:""})}),n}function eu(e,t,n){var r=e.pingCache;if(r===null){r=e.pingCache=new Td;var l=new Set;r.set(t,l)}else l=r.get(t),l===void 0&&(l=new Set,r.set(t,l));l.has(n)||(l.add(n),e=Vd.bind(null,e,t,n),t.then(e,e))}function tu(e){do{var t;if((t=e.tag===13)&&(t=e.memoizedState,t=t!==null?t.dehydrated!==null:!0),t)return e;e=e.return}while(e!==null);return null}function nu(e,t,n,r,l){return(e.mode&1)===0?(e===t?e.flags|=65536:(e.flags|=128,n.flags|=131072,n.flags&=-52805,n.tag===1&&(n.alternate===null?n.tag=17:(t=Zt(-1,1),t.tag=2,_n(n,t,1))),n.lanes|=1),e):(e.flags|=65536,e.lanes=l,e)}var zd=we.ReactCurrentOwner,et=!1;function Ye(e,t,n,r){t.child=e===null?ki(t,null,n,r):fr(t,e.child,n,r)}function ru(e,t,n,r,l){n=n.render;var a=t.ref;return mr(t,l),r=Co(e,t,n,r,a,l),n=No(),e!==null&&!et?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~l,en(e,t,l)):(ke&&n&&io(t),t.flags|=1,Ye(e,t,r,l),t.child)}function lu(e,t,n,r,l){if(e===null){var a=n.type;return typeof a=="function"&&!rs(a)&&a.defaultProps===void 0&&n.compare===null&&n.defaultProps===void 0?(t.tag=15,t.type=a,au(e,t,a,r,l)):(e=xa(n.type,null,r,t,t.mode,l),e.ref=t.ref,e.return=t,t.child=e)}if(a=e.child,(e.lanes&l)===0){var s=a.memoizedProps;if(n=n.compare,n=n!==null?n:Hr,n(s,r)&&e.ref===t.ref)return en(e,t,l)}return t.flags|=1,e=Cn(a,r),e.ref=t.ref,e.return=t,t.child=e}function au(e,t,n,r,l){if(e!==null){var a=e.memoizedProps;if(Hr(a,r)&&e.ref===t.ref)if(et=!1,t.pendingProps=r=a,(e.lanes&l)!==0)(e.flags&131072)!==0&&(et=!0);else return t.lanes=e.lanes,en(e,t,l)}return Oo(e,t,n,r,l)}function ou(e,t,n){var r=t.pendingProps,l=r.children,a=e!==null?e.memoizedState:null;if(r.mode==="hidden")if((t.mode&1)===0)t.memoizedState={baseLanes:0,cachePool:null,transitions:null},xe(yr,ct),ct|=n;else{if((n&1073741824)===0)return e=a!==null?a.baseLanes|n:n,t.lanes=t.childLanes=1073741824,t.memoizedState={baseLanes:e,cachePool:null,transitions:null},t.updateQueue=null,xe(yr,ct),ct|=e,null;t.memoizedState={baseLanes:0,cachePool:null,transitions:null},r=a!==null?a.baseLanes:n,xe(yr,ct),ct|=r}else a!==null?(r=a.baseLanes|n,t.memoizedState=null):r=n,xe(yr,ct),ct|=r;return Ye(e,t,l,n),t.child}function su(e,t){var n=t.ref;(e===null&&n!==null||e!==null&&e.ref!==n)&&(t.flags|=512,t.flags|=2097152)}function Oo(e,t,n,r,l){var a=Ze(n)?On:Ve.current;return a=ur(t,a),mr(t,l),n=Co(e,t,n,r,a,l),r=No(),e!==null&&!et?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~l,en(e,t,l)):(ke&&r&&io(t),t.flags|=1,Ye(e,t,n,l),t.child)}function iu(e,t,n,r,l){if(Ze(n)){var a=!0;Bl(t)}else a=!1;if(mr(t,l),t.stateNode===null)oa(e,t),Gi(t,n,r),Lo(t,n,r,l),r=!0;else if(e===null){var s=t.stateNode,c=t.memoizedProps;s.props=c;var p=s.context,w=n.contextType;typeof w=="object"&&w!==null?w=yt(w):(w=Ze(n)?On:Ve.current,w=ur(t,w));var N=n.getDerivedStateFromProps,z=typeof N=="function"||typeof s.getSnapshotBeforeUpdate=="function";z||typeof s.UNSAFE_componentWillReceiveProps!="function"&&typeof s.componentWillReceiveProps!="function"||(c!==r||p!==w)&&qi(t,s,r,w),yn=!1;var C=t.memoizedState;s.state=C,ql(t,r,s,l),p=t.memoizedState,c!==r||C!==p||Xe.current||yn?(typeof N=="function"&&(Mo(t,n,N,r),p=t.memoizedState),(c=yn||Ji(t,n,c,r,C,p,w))?(z||typeof s.UNSAFE_componentWillMount!="function"&&typeof s.componentWillMount!="function"||(typeof s.componentWillMount=="function"&&s.componentWillMount(),typeof s.UNSAFE_componentWillMount=="function"&&s.UNSAFE_componentWillMount()),typeof s.componentDidMount=="function"&&(t.flags|=4194308)):(typeof s.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=r,t.memoizedState=p),s.props=r,s.state=p,s.context=w,r=c):(typeof s.componentDidMount=="function"&&(t.flags|=4194308),r=!1)}else{s=t.stateNode,Si(e,t),c=t.memoizedProps,w=t.type===t.elementType?c:Tt(t.type,c),s.props=w,z=t.pendingProps,C=s.context,p=n.contextType,typeof p=="object"&&p!==null?p=yt(p):(p=Ze(n)?On:Ve.current,p=ur(t,p));var I=n.getDerivedStateFromProps;(N=typeof I=="function"||typeof s.getSnapshotBeforeUpdate=="function")||typeof s.UNSAFE_componentWillReceiveProps!="function"&&typeof s.componentWillReceiveProps!="function"||(c!==z||C!==p)&&qi(t,s,r,p),yn=!1,C=t.memoizedState,s.state=C,ql(t,r,s,l);var B=t.memoizedState;c!==z||C!==B||Xe.current||yn?(typeof I=="function"&&(Mo(t,n,I,r),B=t.memoizedState),(w=yn||Ji(t,n,w,r,C,B,p)||!1)?(N||typeof s.UNSAFE_componentWillUpdate!="function"&&typeof s.componentWillUpdate!="function"||(typeof s.componentWillUpdate=="function"&&s.componentWillUpdate(r,B,p),typeof s.UNSAFE_componentWillUpdate=="function"&&s.UNSAFE_componentWillUpdate(r,B,p)),typeof s.componentDidUpdate=="function"&&(t.flags|=4),typeof s.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof s.componentDidUpdate!="function"||c===e.memoizedProps&&C===e.memoizedState||(t.flags|=4),typeof s.getSnapshotBeforeUpdate!="function"||c===e.memoizedProps&&C===e.memoizedState||(t.flags|=1024),t.memoizedProps=r,t.memoizedState=B),s.props=r,s.state=B,s.context=p,r=w):(typeof s.componentDidUpdate!="function"||c===e.memoizedProps&&C===e.memoizedState||(t.flags|=4),typeof s.getSnapshotBeforeUpdate!="function"||c===e.memoizedProps&&C===e.memoizedState||(t.flags|=1024),r=!1)}return $o(e,t,n,r,a,l)}function $o(e,t,n,r,l,a){su(e,t);var s=(t.flags&128)!==0;if(!r&&!s)return l&&fi(t,n,!1),en(e,t,a);r=t.stateNode,zd.current=t;var c=s&&typeof n.getDerivedStateFromError!="function"?null:r.render();return t.flags|=1,e!==null&&s?(t.child=fr(t,e.child,null,a),t.child=fr(t,null,c,a)):Ye(e,t,c,a),t.memoizedState=r.state,l&&fi(t,n,!0),t.child}function uu(e){var t=e.stateNode;t.pendingContext?di(e,t.pendingContext,t.pendingContext!==t.context):t.context&&di(e,t.context,!1),_o(e,t.containerInfo)}function cu(e,t,n,r,l){return pr(),fo(l),t.flags|=256,Ye(e,t,n,r),t.child}var Io={dehydrated:null,treeContext:null,retryLane:0};function Fo(e){return{baseLanes:e,cachePool:null,transitions:null}}function du(e,t,n){var r=t.pendingProps,l=Se.current,a=!1,s=(t.flags&128)!==0,c;if((c=s)||(c=e!==null&&e.memoizedState===null?!1:(l&2)!==0),c?(a=!0,t.flags&=-129):(e===null||e.memoizedState!==null)&&(l|=1),xe(Se,l&1),e===null)return po(t),e=t.memoizedState,e!==null&&(e=e.dehydrated,e!==null)?((t.mode&1)===0?t.lanes=1:e.data==="$!"?t.lanes=8:t.lanes=1073741824,null):(s=r.children,e=r.fallback,a?(r=t.mode,a=t.child,s={mode:"hidden",children:s},(r&1)===0&&a!==null?(a.childLanes=0,a.pendingProps=s):a=va(s,r,0,null),e=Kn(e,r,n,null),a.return=t,e.return=t,a.sibling=e,t.child=a,t.child.memoizedState=Fo(n),t.memoizedState=Io,e):Ao(t,s));if(l=e.memoizedState,l!==null&&(c=l.dehydrated,c!==null))return Pd(e,t,s,r,c,l,n);if(a){a=r.fallback,s=t.mode,l=e.child,c=l.sibling;var p={mode:"hidden",children:r.children};return(s&1)===0&&t.child!==l?(r=t.child,r.childLanes=0,r.pendingProps=p,t.deletions=null):(r=Cn(l,p),r.subtreeFlags=l.subtreeFlags&14680064),c!==null?a=Cn(c,a):(a=Kn(a,s,n,null),a.flags|=2),a.return=t,r.return=t,r.sibling=a,t.child=r,r=a,a=t.child,s=e.child.memoizedState,s=s===null?Fo(n):{baseLanes:s.baseLanes|n,cachePool:null,transitions:s.transitions},a.memoizedState=s,a.childLanes=e.childLanes&~n,t.memoizedState=Io,r}return a=e.child,e=a.sibling,r=Cn(a,{mode:"visible",children:r.children}),(t.mode&1)===0&&(r.lanes=n),r.return=t,r.sibling=null,e!==null&&(n=t.deletions,n===null?(t.deletions=[e],t.flags|=16):n.push(e)),t.child=r,t.memoizedState=null,r}function Ao(e,t){return t=va({mode:"visible",children:t},e.mode,0,null),t.return=e,e.child=t}function aa(e,t,n,r){return r!==null&&fo(r),fr(t,e.child,null,n),e=Ao(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function Pd(e,t,n,r,l,a,s){if(n)return t.flags&256?(t.flags&=-257,r=Ro(Error(i(422))),aa(e,t,s,r)):t.memoizedState!==null?(t.child=e.child,t.flags|=128,null):(a=r.fallback,l=t.mode,r=va({mode:"visible",children:r.children},l,0,null),a=Kn(a,l,s,null),a.flags|=2,r.return=t,a.return=t,r.sibling=a,t.child=r,(t.mode&1)!==0&&fr(t,e.child,null,s),t.child.memoizedState=Fo(s),t.memoizedState=Io,a);if((t.mode&1)===0)return aa(e,t,s,null);if(l.data==="$!"){if(r=l.nextSibling&&l.nextSibling.dataset,r)var c=r.dgst;return r=c,a=Error(i(419)),r=Ro(a,r,void 0),aa(e,t,s,r)}if(c=(s&e.childLanes)!==0,et||c){if(r=Oe,r!==null){switch(s&-s){case 4:l=2;break;case 16:l=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:l=32;break;case 536870912:l=268435456;break;default:l=0}l=(l&(r.suspendedLanes|s))!==0?0:l,l!==0&&l!==a.retryLane&&(a.retryLane=l,Xt(e,l),Mt(r,e,l,-1))}return ns(),r=Ro(Error(i(421))),aa(e,t,s,r)}return l.data==="$?"?(t.flags|=128,t.child=e.child,t=Hd.bind(null,e),l._reactRetry=t,null):(e=a.treeContext,ut=mn(l.nextSibling),it=t,ke=!0,jt=null,e!==null&&(xt[vt++]=Gt,xt[vt++]=qt,xt[vt++]=$n,Gt=e.id,qt=e.overflow,$n=t),t=Ao(t,r.children),t.flags|=4096,t)}function pu(e,t,n){e.lanes|=t;var r=e.alternate;r!==null&&(r.lanes|=t),xo(e.return,t,n)}function Uo(e,t,n,r,l){var a=e.memoizedState;a===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:r,tail:n,tailMode:l}:(a.isBackwards=t,a.rendering=null,a.renderingStartTime=0,a.last=r,a.tail=n,a.tailMode=l)}function fu(e,t,n){var r=t.pendingProps,l=r.revealOrder,a=r.tail;if(Ye(e,t,r.children,n),r=Se.current,(r&2)!==0)r=r&1|2,t.flags|=128;else{if(e!==null&&(e.flags&128)!==0)e:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&pu(e,n,t);else if(e.tag===19)pu(e,n,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}r&=1}if(xe(Se,r),(t.mode&1)===0)t.memoizedState=null;else switch(l){case"forwards":for(n=t.child,l=null;n!==null;)e=n.alternate,e!==null&&Xl(e)===null&&(l=n),n=n.sibling;n=l,n===null?(l=t.child,t.child=null):(l=n.sibling,n.sibling=null),Uo(t,!1,l,n,a);break;case"backwards":for(n=null,l=t.child,t.child=null;l!==null;){if(e=l.alternate,e!==null&&Xl(e)===null){t.child=l;break}e=l.sibling,l.sibling=n,n=l,l=e}Uo(t,!0,n,null,a);break;case"together":Uo(t,!1,null,null,void 0);break;default:t.memoizedState=null}return t.child}function oa(e,t){(t.mode&1)===0&&e!==null&&(e.alternate=null,t.alternate=null,t.flags|=2)}function en(e,t,n){if(e!==null&&(t.dependencies=e.dependencies),Bn|=t.lanes,(n&t.childLanes)===0)return null;if(e!==null&&t.child!==e.child)throw Error(i(153));if(t.child!==null){for(e=t.child,n=Cn(e,e.pendingProps),t.child=n,n.return=t;e.sibling!==null;)e=e.sibling,n=n.sibling=Cn(e,e.pendingProps),n.return=t;n.sibling=null}return t.child}function Md(e,t,n){switch(t.tag){case 3:uu(t),pr();break;case 5:Ni(t);break;case 1:Ze(t.type)&&Bl(t);break;case 4:_o(t,t.stateNode.containerInfo);break;case 10:var r=t.type._context,l=t.memoizedProps.value;xe(Yl,r._currentValue),r._currentValue=l;break;case 13:if(r=t.memoizedState,r!==null)return r.dehydrated!==null?(xe(Se,Se.current&1),t.flags|=128,null):(n&t.child.childLanes)!==0?du(e,t,n):(xe(Se,Se.current&1),e=en(e,t,n),e!==null?e.sibling:null);xe(Se,Se.current&1);break;case 19:if(r=(n&t.childLanes)!==0,(e.flags&128)!==0){if(r)return fu(e,t,n);t.flags|=128}if(l=t.memoizedState,l!==null&&(l.rendering=null,l.tail=null,l.lastEffect=null),xe(Se,Se.current),r)break;return null;case 22:case 23:return t.lanes=0,ou(e,t,n)}return en(e,t,n)}var gu,Bo,mu,hu;gu=function(e,t){for(var n=t.child;n!==null;){if(n.tag===5||n.tag===6)e.appendChild(n.stateNode);else if(n.tag!==4&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===t)break;for(;n.sibling===null;){if(n.return===null||n.return===t)return;n=n.return}n.sibling.return=n.return,n=n.sibling}},Bo=function(){},mu=function(e,t,n,r){var l=e.memoizedProps;if(l!==r){e=t.stateNode,An(Ut.current);var a=null;switch(n){case"input":l=Rt(e,l),r=Rt(e,r),a=[];break;case"select":l=F({},l,{value:void 0}),r=F({},r,{value:void 0}),a=[];break;case"textarea":l=rn(e,l),r=rn(e,r),a=[];break;default:typeof l.onClick!="function"&&typeof r.onClick=="function"&&(e.onclick=Fl)}zn(n,r);var s;n=null;for(w in l)if(!r.hasOwnProperty(w)&&l.hasOwnProperty(w)&&l[w]!=null)if(w==="style"){var c=l[w];for(s in c)c.hasOwnProperty(s)&&(n||(n={}),n[s]="")}else w!=="dangerouslySetInnerHTML"&&w!=="children"&&w!=="suppressContentEditableWarning"&&w!=="suppressHydrationWarning"&&w!=="autoFocus"&&(g.hasOwnProperty(w)?a||(a=[]):(a=a||[]).push(w,null));for(w in r){var p=r[w];if(c=l!=null?l[w]:void 0,r.hasOwnProperty(w)&&p!==c&&(p!=null||c!=null))if(w==="style")if(c){for(s in c)!c.hasOwnProperty(s)||p&&p.hasOwnProperty(s)||(n||(n={}),n[s]="");for(s in p)p.hasOwnProperty(s)&&c[s]!==p[s]&&(n||(n={}),n[s]=p[s])}else n||(a||(a=[]),a.push(w,n)),n=p;else w==="dangerouslySetInnerHTML"?(p=p?p.__html:void 0,c=c?c.__html:void 0,p!=null&&c!==p&&(a=a||[]).push(w,p)):w==="children"?typeof p!="string"&&typeof p!="number"||(a=a||[]).push(w,""+p):w!=="suppressContentEditableWarning"&&w!=="suppressHydrationWarning"&&(g.hasOwnProperty(w)?(p!=null&&w==="onScroll"&&ye("scroll",e),a||c===p||(a=[])):(a=a||[]).push(w,p))}n&&(a=a||[]).push("style",n);var w=a;(t.updateQueue=w)&&(t.flags|=4)}},hu=function(e,t,n,r){n!==r&&(t.flags|=4)};function al(e,t){if(!ke)switch(e.tailMode){case"hidden":t=e.tail;for(var n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?e.tail=null:n.sibling=null;break;case"collapsed":n=e.tail;for(var r=null;n!==null;)n.alternate!==null&&(r=n),n=n.sibling;r===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:r.sibling=null}}function We(e){var t=e.alternate!==null&&e.alternate.child===e.child,n=0,r=0;if(t)for(var l=e.child;l!==null;)n|=l.lanes|l.childLanes,r|=l.subtreeFlags&14680064,r|=l.flags&14680064,l.return=e,l=l.sibling;else for(l=e.child;l!==null;)n|=l.lanes|l.childLanes,r|=l.subtreeFlags,r|=l.flags,l.return=e,l=l.sibling;return e.subtreeFlags|=r,e.childLanes=n,t}function Ld(e,t,n){var r=t.pendingProps;switch(uo(t),t.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return We(t),null;case 1:return Ze(t.type)&&Ul(),We(t),null;case 3:return r=t.stateNode,hr(),_e(Xe),_e(Ve),bo(),r.pendingContext&&(r.context=r.pendingContext,r.pendingContext=null),(e===null||e.child===null)&&(Kl(t)?t.flags|=4:e===null||e.memoizedState.isDehydrated&&(t.flags&256)===0||(t.flags|=1024,jt!==null&&(Zo(jt),jt=null))),Bo(e,t),We(t),null;case 5:wo(t);var l=An(el.current);if(n=t.type,e!==null&&t.stateNode!=null)mu(e,t,n,r,l),e.ref!==t.ref&&(t.flags|=512,t.flags|=2097152);else{if(!r){if(t.stateNode===null)throw Error(i(166));return We(t),null}if(e=An(Ut.current),Kl(t)){r=t.stateNode,n=t.type;var a=t.memoizedProps;switch(r[At]=t,r[Jr]=a,e=(t.mode&1)!==0,n){case"dialog":ye("cancel",r),ye("close",r);break;case"iframe":case"object":case"embed":ye("load",r);break;case"video":case"audio":for(l=0;l<Kr.length;l++)ye(Kr[l],r);break;case"source":ye("error",r);break;case"img":case"image":case"link":ye("error",r),ye("load",r);break;case"details":ye("toggle",r);break;case"input":Yn(r,a),ye("invalid",r);break;case"select":r._wrapperState={wasMultiple:!!a.multiple},ye("invalid",r);break;case"textarea":Ht(r,a),ye("invalid",r)}zn(n,a),l=null;for(var s in a)if(a.hasOwnProperty(s)){var c=a[s];s==="children"?typeof c=="string"?r.textContent!==c&&(a.suppressHydrationWarning!==!0&&Il(r.textContent,c,e),l=["children",c]):typeof c=="number"&&r.textContent!==""+c&&(a.suppressHydrationWarning!==!0&&Il(r.textContent,c,e),l=["children",""+c]):g.hasOwnProperty(s)&&c!=null&&s==="onScroll"&&ye("scroll",r)}switch(n){case"input":ft(r),Tn(r,a,!0);break;case"textarea":ft(r),ot(r);break;case"select":case"option":break;default:typeof a.onClick=="function"&&(r.onclick=Fl)}r=l,t.updateQueue=r,r!==null&&(t.flags|=4)}else{s=l.nodeType===9?l:l.ownerDocument,e==="http://www.w3.org/1999/xhtml"&&(e=Gn(n)),e==="http://www.w3.org/1999/xhtml"?n==="script"?(e=s.createElement("div"),e.innerHTML="<script><\/script>",e=e.removeChild(e.firstChild)):typeof r.is=="string"?e=s.createElement(n,{is:r.is}):(e=s.createElement(n),n==="select"&&(s=e,r.multiple?s.multiple=!0:r.size&&(s.size=r.size))):e=s.createElementNS(e,n),e[At]=t,e[Jr]=r,gu(e,t,!1,!1),t.stateNode=e;e:{switch(s=Xn(n,r),n){case"dialog":ye("cancel",e),ye("close",e),l=r;break;case"iframe":case"object":case"embed":ye("load",e),l=r;break;case"video":case"audio":for(l=0;l<Kr.length;l++)ye(Kr[l],e);l=r;break;case"source":ye("error",e),l=r;break;case"img":case"image":case"link":ye("error",e),ye("load",e),l=r;break;case"details":ye("toggle",e),l=r;break;case"input":Yn(e,r),l=Rt(e,r),ye("invalid",e);break;case"option":l=r;break;case"select":e._wrapperState={wasMultiple:!!r.multiple},l=F({},r,{value:void 0}),ye("invalid",e);break;case"textarea":Ht(e,r),l=rn(e,r),ye("invalid",e);break;default:l=r}zn(n,l),c=l;for(a in c)if(c.hasOwnProperty(a)){var p=c[a];a==="style"?br(e,p):a==="dangerouslySetInnerHTML"?(p=p?p.__html:void 0,p!=null&&Wt(e,p)):a==="children"?typeof p=="string"?(n!=="textarea"||p!=="")&&It(e,p):typeof p=="number"&&It(e,""+p):a!=="suppressContentEditableWarning"&&a!=="suppressHydrationWarning"&&a!=="autoFocus"&&(g.hasOwnProperty(a)?p!=null&&a==="onScroll"&&ye("scroll",e):p!=null&&je(e,a,p,s))}switch(n){case"input":ft(e),Tn(e,r,!1);break;case"textarea":ft(e),ot(e);break;case"option":r.value!=null&&e.setAttribute("value",""+oe(r.value));break;case"select":e.multiple=!!r.multiple,a=r.value,a!=null?Fe(e,!!r.multiple,a,!1):r.defaultValue!=null&&Fe(e,!!r.multiple,r.defaultValue,!0);break;default:typeof l.onClick=="function"&&(e.onclick=Fl)}switch(n){case"button":case"input":case"select":case"textarea":r=!!r.autoFocus;break e;case"img":r=!0;break e;default:r=!1}}r&&(t.flags|=4)}t.ref!==null&&(t.flags|=512,t.flags|=2097152)}return We(t),null;case 6:if(e&&t.stateNode!=null)hu(e,t,e.memoizedProps,r);else{if(typeof r!="string"&&t.stateNode===null)throw Error(i(166));if(n=An(el.current),An(Ut.current),Kl(t)){if(r=t.stateNode,n=t.memoizedProps,r[At]=t,(a=r.nodeValue!==n)&&(e=it,e!==null))switch(e.tag){case 3:Il(r.nodeValue,n,(e.mode&1)!==0);break;case 5:e.memoizedProps.suppressHydrationWarning!==!0&&Il(r.nodeValue,n,(e.mode&1)!==0)}a&&(t.flags|=4)}else r=(n.nodeType===9?n:n.ownerDocument).createTextNode(r),r[At]=t,t.stateNode=r}return We(t),null;case 13:if(_e(Se),r=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(ke&&ut!==null&&(t.mode&1)!==0&&(t.flags&128)===0)yi(),pr(),t.flags|=98560,a=!1;else if(a=Kl(t),r!==null&&r.dehydrated!==null){if(e===null){if(!a)throw Error(i(318));if(a=t.memoizedState,a=a!==null?a.dehydrated:null,!a)throw Error(i(317));a[At]=t}else pr(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;We(t),a=!1}else jt!==null&&(Zo(jt),jt=null),a=!0;if(!a)return t.flags&65536?t:null}return(t.flags&128)!==0?(t.lanes=n,t):(r=r!==null,r!==(e!==null&&e.memoizedState!==null)&&r&&(t.child.flags|=8192,(t.mode&1)!==0&&(e===null||(Se.current&1)!==0?Le===0&&(Le=3):ns())),t.updateQueue!==null&&(t.flags|=4),We(t),null);case 4:return hr(),Bo(e,t),e===null&&Qr(t.stateNode.containerInfo),We(t),null;case 10:return ho(t.type._context),We(t),null;case 17:return Ze(t.type)&&Ul(),We(t),null;case 19:if(_e(Se),a=t.memoizedState,a===null)return We(t),null;if(r=(t.flags&128)!==0,s=a.rendering,s===null)if(r)al(a,!1);else{if(Le!==0||e!==null&&(e.flags&128)!==0)for(e=t.child;e!==null;){if(s=Xl(e),s!==null){for(t.flags|=128,al(a,!1),r=s.updateQueue,r!==null&&(t.updateQueue=r,t.flags|=4),t.subtreeFlags=0,r=n,n=t.child;n!==null;)a=n,e=r,a.flags&=14680066,s=a.alternate,s===null?(a.childLanes=0,a.lanes=e,a.child=null,a.subtreeFlags=0,a.memoizedProps=null,a.memoizedState=null,a.updateQueue=null,a.dependencies=null,a.stateNode=null):(a.childLanes=s.childLanes,a.lanes=s.lanes,a.child=s.child,a.subtreeFlags=0,a.deletions=null,a.memoizedProps=s.memoizedProps,a.memoizedState=s.memoizedState,a.updateQueue=s.updateQueue,a.type=s.type,e=s.dependencies,a.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext}),n=n.sibling;return xe(Se,Se.current&1|2),t.child}e=e.sibling}a.tail!==null&&V()>_r&&(t.flags|=128,r=!0,al(a,!1),t.lanes=4194304)}else{if(!r)if(e=Xl(s),e!==null){if(t.flags|=128,r=!0,n=e.updateQueue,n!==null&&(t.updateQueue=n,t.flags|=4),al(a,!0),a.tail===null&&a.tailMode==="hidden"&&!s.alternate&&!ke)return We(t),null}else 2*V()-a.renderingStartTime>_r&&n!==1073741824&&(t.flags|=128,r=!0,al(a,!1),t.lanes=4194304);a.isBackwards?(s.sibling=t.child,t.child=s):(n=a.last,n!==null?n.sibling=s:t.child=s,a.last=s)}return a.tail!==null?(t=a.tail,a.rendering=t,a.tail=t.sibling,a.renderingStartTime=V(),t.sibling=null,n=Se.current,xe(Se,r?n&1|2:n&1),t):(We(t),null);case 22:case 23:return ts(),r=t.memoizedState!==null,e!==null&&e.memoizedState!==null!==r&&(t.flags|=8192),r&&(t.mode&1)!==0?(ct&1073741824)!==0&&(We(t),t.subtreeFlags&6&&(t.flags|=8192)):We(t),null;case 24:return null;case 25:return null}throw Error(i(156,t.tag))}function Rd(e,t){switch(uo(t),t.tag){case 1:return Ze(t.type)&&Ul(),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return hr(),_e(Xe),_e(Ve),bo(),e=t.flags,(e&65536)!==0&&(e&128)===0?(t.flags=e&-65537|128,t):null;case 5:return wo(t),null;case 13:if(_e(Se),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(i(340));pr()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return _e(Se),null;case 4:return hr(),null;case 10:return ho(t.type._context),null;case 22:case 23:return ts(),null;case 24:return null;default:return null}}var sa=!1,Ke=!1,Dd=typeof WeakSet=="function"?WeakSet:Set,A=null;function vr(e,t){var n=e.ref;if(n!==null)if(typeof n=="function")try{n(null)}catch(r){Ce(e,t,r)}else n.current=null}function Vo(e,t,n){try{n()}catch(r){Ce(e,t,r)}}var xu=!1;function Od(e,t){if(eo=Nl,e=Js(),Ka(e)){if("selectionStart"in e)var n={start:e.selectionStart,end:e.selectionEnd};else e:{n=(n=e.ownerDocument)&&n.defaultView||window;var r=n.getSelection&&n.getSelection();if(r&&r.rangeCount!==0){n=r.anchorNode;var l=r.anchorOffset,a=r.focusNode;r=r.focusOffset;try{n.nodeType,a.nodeType}catch{n=null;break e}var s=0,c=-1,p=-1,w=0,N=0,z=e,C=null;t:for(;;){for(var I;z!==n||l!==0&&z.nodeType!==3||(c=s+l),z!==a||r!==0&&z.nodeType!==3||(p=s+r),z.nodeType===3&&(s+=z.nodeValue.length),(I=z.firstChild)!==null;)C=z,z=I;for(;;){if(z===e)break t;if(C===n&&++w===l&&(c=s),C===a&&++N===r&&(p=s),(I=z.nextSibling)!==null)break;z=C,C=z.parentNode}z=I}n=c===-1||p===-1?null:{start:c,end:p}}else n=null}n=n||{start:0,end:0}}else n=null;for(to={focusedElem:e,selectionRange:n},Nl=!1,A=t;A!==null;)if(t=A,e=t.child,(t.subtreeFlags&1028)!==0&&e!==null)e.return=t,A=e;else for(;A!==null;){t=A;try{var B=t.alternate;if((t.flags&1024)!==0)switch(t.tag){case 0:case 11:case 15:break;case 1:if(B!==null){var H=B.memoizedProps,Ne=B.memoizedState,y=t.stateNode,f=y.getSnapshotBeforeUpdate(t.elementType===t.type?H:Tt(t.type,H),Ne);y.__reactInternalSnapshotBeforeUpdate=f}break;case 3:var _=t.stateNode.containerInfo;_.nodeType===1?_.textContent="":_.nodeType===9&&_.documentElement&&_.removeChild(_.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(i(163))}}catch(R){Ce(t,t.return,R)}if(e=t.sibling,e!==null){e.return=t.return,A=e;break}A=t.return}return B=xu,xu=!1,B}function ol(e,t,n){var r=t.updateQueue;if(r=r!==null?r.lastEffect:null,r!==null){var l=r=r.next;do{if((l.tag&e)===e){var a=l.destroy;l.destroy=void 0,a!==void 0&&Vo(t,n,a)}l=l.next}while(l!==r)}}function ia(e,t){if(t=t.updateQueue,t=t!==null?t.lastEffect:null,t!==null){var n=t=t.next;do{if((n.tag&e)===e){var r=n.create;n.destroy=r()}n=n.next}while(n!==t)}}function Ho(e){var t=e.ref;if(t!==null){var n=e.stateNode;switch(e.tag){case 5:e=n;break;default:e=n}typeof t=="function"?t(e):t.current=e}}function vu(e){var t=e.alternate;t!==null&&(e.alternate=null,vu(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&(delete t[At],delete t[Jr],delete t[ao],delete t[vd],delete t[yd])),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}function yu(e){return e.tag===5||e.tag===3||e.tag===4}function _u(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||yu(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function Wo(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?n.nodeType===8?n.parentNode.insertBefore(e,t):n.insertBefore(e,t):(n.nodeType===8?(t=n.parentNode,t.insertBefore(e,n)):(t=n,t.appendChild(e)),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=Fl));else if(r!==4&&(e=e.child,e!==null))for(Wo(e,t,n),e=e.sibling;e!==null;)Wo(e,t,n),e=e.sibling}function Ko(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?n.insertBefore(e,t):n.appendChild(e);else if(r!==4&&(e=e.child,e!==null))for(Ko(e,t,n),e=e.sibling;e!==null;)Ko(e,t,n),e=e.sibling}var Ae=null,zt=!1;function wn(e,t,n){for(n=n.child;n!==null;)wu(e,t,n),n=n.sibling}function wu(e,t,n){if(Ft&&typeof Ft.onCommitFiberUnmount=="function")try{Ft.onCommitFiberUnmount(wl,n)}catch{}switch(n.tag){case 5:Ke||vr(n,t);case 6:var r=Ae,l=zt;Ae=null,wn(e,t,n),Ae=r,zt=l,Ae!==null&&(zt?(e=Ae,n=n.stateNode,e.nodeType===8?e.parentNode.removeChild(n):e.removeChild(n)):Ae.removeChild(n.stateNode));break;case 18:Ae!==null&&(zt?(e=Ae,n=n.stateNode,e.nodeType===8?lo(e.parentNode,n):e.nodeType===1&&lo(e,n),Ir(e)):lo(Ae,n.stateNode));break;case 4:r=Ae,l=zt,Ae=n.stateNode.containerInfo,zt=!0,wn(e,t,n),Ae=r,zt=l;break;case 0:case 11:case 14:case 15:if(!Ke&&(r=n.updateQueue,r!==null&&(r=r.lastEffect,r!==null))){l=r=r.next;do{var a=l,s=a.destroy;a=a.tag,s!==void 0&&((a&2)!==0||(a&4)!==0)&&Vo(n,t,s),l=l.next}while(l!==r)}wn(e,t,n);break;case 1:if(!Ke&&(vr(n,t),r=n.stateNode,typeof r.componentWillUnmount=="function"))try{r.props=n.memoizedProps,r.state=n.memoizedState,r.componentWillUnmount()}catch(c){Ce(n,t,c)}wn(e,t,n);break;case 21:wn(e,t,n);break;case 22:n.mode&1?(Ke=(r=Ke)||n.memoizedState!==null,wn(e,t,n),Ke=r):wn(e,t,n);break;default:wn(e,t,n)}}function ku(e){var t=e.updateQueue;if(t!==null){e.updateQueue=null;var n=e.stateNode;n===null&&(n=e.stateNode=new Dd),t.forEach(function(r){var l=Wd.bind(null,e,r);n.has(r)||(n.add(r),r.then(l,l))})}}function Pt(e,t){var n=t.deletions;if(n!==null)for(var r=0;r<n.length;r++){var l=n[r];try{var a=e,s=t,c=s;e:for(;c!==null;){switch(c.tag){case 5:Ae=c.stateNode,zt=!1;break e;case 3:Ae=c.stateNode.containerInfo,zt=!0;break e;case 4:Ae=c.stateNode.containerInfo,zt=!0;break e}c=c.return}if(Ae===null)throw Error(i(160));wu(a,s,l),Ae=null,zt=!1;var p=l.alternate;p!==null&&(p.return=null),l.return=null}catch(w){Ce(l,t,w)}}if(t.subtreeFlags&12854)for(t=t.child;t!==null;)bu(t,e),t=t.sibling}function bu(e,t){var n=e.alternate,r=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if(Pt(t,e),Vt(e),r&4){try{ol(3,e,e.return),ia(3,e)}catch(H){Ce(e,e.return,H)}try{ol(5,e,e.return)}catch(H){Ce(e,e.return,H)}}break;case 1:Pt(t,e),Vt(e),r&512&&n!==null&&vr(n,n.return);break;case 5:if(Pt(t,e),Vt(e),r&512&&n!==null&&vr(n,n.return),e.flags&32){var l=e.stateNode;try{It(l,"")}catch(H){Ce(e,e.return,H)}}if(r&4&&(l=e.stateNode,l!=null)){var a=e.memoizedProps,s=n!==null?n.memoizedProps:a,c=e.type,p=e.updateQueue;if(e.updateQueue=null,p!==null)try{c==="input"&&a.type==="radio"&&a.name!=null&&Dt(l,a),Xn(c,s);var w=Xn(c,a);for(s=0;s<p.length;s+=2){var N=p[s],z=p[s+1];N==="style"?br(l,z):N==="dangerouslySetInnerHTML"?Wt(l,z):N==="children"?It(l,z):je(l,N,z,w)}switch(c){case"input":Ot(l,a);break;case"textarea":Jn(l,a);break;case"select":var C=l._wrapperState.wasMultiple;l._wrapperState.wasMultiple=!!a.multiple;var I=a.value;I!=null?Fe(l,!!a.multiple,I,!1):C!==!!a.multiple&&(a.defaultValue!=null?Fe(l,!!a.multiple,a.defaultValue,!0):Fe(l,!!a.multiple,a.multiple?[]:"",!1))}l[Jr]=a}catch(H){Ce(e,e.return,H)}}break;case 6:if(Pt(t,e),Vt(e),r&4){if(e.stateNode===null)throw Error(i(162));l=e.stateNode,a=e.memoizedProps;try{l.nodeValue=a}catch(H){Ce(e,e.return,H)}}break;case 3:if(Pt(t,e),Vt(e),r&4&&n!==null&&n.memoizedState.isDehydrated)try{Ir(t.containerInfo)}catch(H){Ce(e,e.return,H)}break;case 4:Pt(t,e),Vt(e);break;case 13:Pt(t,e),Vt(e),l=e.child,l.flags&8192&&(a=l.memoizedState!==null,l.stateNode.isHidden=a,!a||l.alternate!==null&&l.alternate.memoizedState!==null||(Jo=V())),r&4&&ku(e);break;case 22:if(N=n!==null&&n.memoizedState!==null,e.mode&1?(Ke=(w=Ke)||N,Pt(t,e),Ke=w):Pt(t,e),Vt(e),r&8192){if(w=e.memoizedState!==null,(e.stateNode.isHidden=w)&&!N&&(e.mode&1)!==0)for(A=e,N=e.child;N!==null;){for(z=A=N;A!==null;){switch(C=A,I=C.child,C.tag){case 0:case 11:case 14:case 15:ol(4,C,C.return);break;case 1:vr(C,C.return);var B=C.stateNode;if(typeof B.componentWillUnmount=="function"){r=C,n=C.return;try{t=r,B.props=t.memoizedProps,B.state=t.memoizedState,B.componentWillUnmount()}catch(H){Ce(r,n,H)}}break;case 5:vr(C,C.return);break;case 22:if(C.memoizedState!==null){Cu(z);continue}}I!==null?(I.return=C,A=I):Cu(z)}N=N.sibling}e:for(N=null,z=e;;){if(z.tag===5){if(N===null){N=z;try{l=z.stateNode,w?(a=l.style,typeof a.setProperty=="function"?a.setProperty("display","none","important"):a.display="none"):(c=z.stateNode,p=z.memoizedProps.style,s=p!=null&&p.hasOwnProperty("display")?p.display:null,c.style.display=gl("display",s))}catch(H){Ce(e,e.return,H)}}}else if(z.tag===6){if(N===null)try{z.stateNode.nodeValue=w?"":z.memoizedProps}catch(H){Ce(e,e.return,H)}}else if((z.tag!==22&&z.tag!==23||z.memoizedState===null||z===e)&&z.child!==null){z.child.return=z,z=z.child;continue}if(z===e)break e;for(;z.sibling===null;){if(z.return===null||z.return===e)break e;N===z&&(N=null),z=z.return}N===z&&(N=null),z.sibling.return=z.return,z=z.sibling}}break;case 19:Pt(t,e),Vt(e),r&4&&ku(e);break;case 21:break;default:Pt(t,e),Vt(e)}}function Vt(e){var t=e.flags;if(t&2){try{e:{for(var n=e.return;n!==null;){if(yu(n)){var r=n;break e}n=n.return}throw Error(i(160))}switch(r.tag){case 5:var l=r.stateNode;r.flags&32&&(It(l,""),r.flags&=-33);var a=_u(e);Ko(e,a,l);break;case 3:case 4:var s=r.stateNode.containerInfo,c=_u(e);Wo(e,c,s);break;default:throw Error(i(161))}}catch(p){Ce(e,e.return,p)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function $d(e,t,n){A=e,Su(e)}function Su(e,t,n){for(var r=(e.mode&1)!==0;A!==null;){var l=A,a=l.child;if(l.tag===22&&r){var s=l.memoizedState!==null||sa;if(!s){var c=l.alternate,p=c!==null&&c.memoizedState!==null||Ke;c=sa;var w=Ke;if(sa=s,(Ke=p)&&!w)for(A=l;A!==null;)s=A,p=s.child,s.tag===22&&s.memoizedState!==null?Nu(l):p!==null?(p.return=s,A=p):Nu(l);for(;a!==null;)A=a,Su(a),a=a.sibling;A=l,sa=c,Ke=w}Eu(e)}else(l.subtreeFlags&8772)!==0&&a!==null?(a.return=l,A=a):Eu(e)}}function Eu(e){for(;A!==null;){var t=A;if((t.flags&8772)!==0){var n=t.alternate;try{if((t.flags&8772)!==0)switch(t.tag){case 0:case 11:case 15:Ke||ia(5,t);break;case 1:var r=t.stateNode;if(t.flags&4&&!Ke)if(n===null)r.componentDidMount();else{var l=t.elementType===t.type?n.memoizedProps:Tt(t.type,n.memoizedProps);r.componentDidUpdate(l,n.memoizedState,r.__reactInternalSnapshotBeforeUpdate)}var a=t.updateQueue;a!==null&&Ci(t,a,r);break;case 3:var s=t.updateQueue;if(s!==null){if(n=null,t.child!==null)switch(t.child.tag){case 5:n=t.child.stateNode;break;case 1:n=t.child.stateNode}Ci(t,s,n)}break;case 5:var c=t.stateNode;if(n===null&&t.flags&4){n=c;var p=t.memoizedProps;switch(t.type){case"button":case"input":case"select":case"textarea":p.autoFocus&&n.focus();break;case"img":p.src&&(n.src=p.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(t.memoizedState===null){var w=t.alternate;if(w!==null){var N=w.memoizedState;if(N!==null){var z=N.dehydrated;z!==null&&Ir(z)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(i(163))}Ke||t.flags&512&&Ho(t)}catch(C){Ce(t,t.return,C)}}if(t===e){A=null;break}if(n=t.sibling,n!==null){n.return=t.return,A=n;break}A=t.return}}function Cu(e){for(;A!==null;){var t=A;if(t===e){A=null;break}var n=t.sibling;if(n!==null){n.return=t.return,A=n;break}A=t.return}}function Nu(e){for(;A!==null;){var t=A;try{switch(t.tag){case 0:case 11:case 15:var n=t.return;try{ia(4,t)}catch(p){Ce(t,n,p)}break;case 1:var r=t.stateNode;if(typeof r.componentDidMount=="function"){var l=t.return;try{r.componentDidMount()}catch(p){Ce(t,l,p)}}var a=t.return;try{Ho(t)}catch(p){Ce(t,a,p)}break;case 5:var s=t.return;try{Ho(t)}catch(p){Ce(t,s,p)}}}catch(p){Ce(t,t.return,p)}if(t===e){A=null;break}var c=t.sibling;if(c!==null){c.return=t.return,A=c;break}A=t.return}}var Id=Math.ceil,ua=we.ReactCurrentDispatcher,Qo=we.ReactCurrentOwner,wt=we.ReactCurrentBatchConfig,ie=0,Oe=null,ze=null,Ue=0,ct=0,yr=hn(0),Le=0,sl=null,Bn=0,ca=0,Yo=0,il=null,tt=null,Jo=0,_r=1/0,tn=null,da=!1,Go=null,kn=null,pa=!1,bn=null,fa=0,ul=0,qo=null,ga=-1,ma=0;function Je(){return(ie&6)!==0?V():ga!==-1?ga:ga=V()}function Sn(e){return(e.mode&1)===0?1:(ie&2)!==0&&Ue!==0?Ue&-Ue:wd.transition!==null?(ma===0&&(ma=_s()),ma):(e=ge,e!==0||(e=window.event,e=e===void 0?16:Ts(e.type)),e)}function Mt(e,t,n,r){if(50<ul)throw ul=0,qo=null,Error(i(185));Lr(e,n,r),((ie&2)===0||e!==Oe)&&(e===Oe&&((ie&2)===0&&(ca|=n),Le===4&&En(e,Ue)),nt(e,r),n===1&&ie===0&&(t.mode&1)===0&&(_r=V()+500,Vl&&vn()))}function nt(e,t){var n=e.callbackNode;wc(e,t);var r=Sl(e,e===Oe?Ue:0);if(r===0)n!==null&&v(n),e.callbackNode=null,e.callbackPriority=0;else if(t=r&-r,e.callbackPriority!==t){if(n!=null&&v(n),t===1)e.tag===0?_d(Tu.bind(null,e)):gi(Tu.bind(null,e)),hd(function(){(ie&6)===0&&vn()}),n=null;else{switch(ws(r)){case 1:n=K;break;case 4:n=he;break;case 16:n=fe;break;case 536870912:n=ht;break;default:n=fe}n=$u(n,ju.bind(null,e))}e.callbackPriority=t,e.callbackNode=n}}function ju(e,t){if(ga=-1,ma=0,(ie&6)!==0)throw Error(i(327));var n=e.callbackNode;if(wr()&&e.callbackNode!==n)return null;var r=Sl(e,e===Oe?Ue:0);if(r===0)return null;if((r&30)!==0||(r&e.expiredLanes)!==0||t)t=ha(e,r);else{t=r;var l=ie;ie|=2;var a=Pu();(Oe!==e||Ue!==t)&&(tn=null,_r=V()+500,Hn(e,t));do try{Ud();break}catch(c){zu(e,c)}while(!0);mo(),ua.current=a,ie=l,ze!==null?t=0:(Oe=null,Ue=0,t=Le)}if(t!==0){if(t===2&&(l=za(e),l!==0&&(r=l,t=Xo(e,l))),t===1)throw n=sl,Hn(e,0),En(e,r),nt(e,V()),n;if(t===6)En(e,r);else{if(l=e.current.alternate,(r&30)===0&&!Fd(l)&&(t=ha(e,r),t===2&&(a=za(e),a!==0&&(r=a,t=Xo(e,a))),t===1))throw n=sl,Hn(e,0),En(e,r),nt(e,V()),n;switch(e.finishedWork=l,e.finishedLanes=r,t){case 0:case 1:throw Error(i(345));case 2:Wn(e,tt,tn);break;case 3:if(En(e,r),(r&130023424)===r&&(t=Jo+500-V(),10<t)){if(Sl(e,0)!==0)break;if(l=e.suspendedLanes,(l&r)!==r){Je(),e.pingedLanes|=e.suspendedLanes&l;break}e.timeoutHandle=ro(Wn.bind(null,e,tt,tn),t);break}Wn(e,tt,tn);break;case 4:if(En(e,r),(r&4194240)===r)break;for(t=e.eventTimes,l=-1;0<r;){var s=31-Ct(r);a=1<<s,s=t[s],s>l&&(l=s),r&=~a}if(r=l,r=V()-r,r=(120>r?120:480>r?480:1080>r?1080:1920>r?1920:3e3>r?3e3:4320>r?4320:1960*Id(r/1960))-r,10<r){e.timeoutHandle=ro(Wn.bind(null,e,tt,tn),r);break}Wn(e,tt,tn);break;case 5:Wn(e,tt,tn);break;default:throw Error(i(329))}}}return nt(e,V()),e.callbackNode===n?ju.bind(null,e):null}function Xo(e,t){var n=il;return e.current.memoizedState.isDehydrated&&(Hn(e,t).flags|=256),e=ha(e,t),e!==2&&(t=tt,tt=n,t!==null&&Zo(t)),e}function Zo(e){tt===null?tt=e:tt.push.apply(tt,e)}function Fd(e){for(var t=e;;){if(t.flags&16384){var n=t.updateQueue;if(n!==null&&(n=n.stores,n!==null))for(var r=0;r<n.length;r++){var l=n[r],a=l.getSnapshot;l=l.value;try{if(!Nt(a(),l))return!1}catch{return!1}}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function En(e,t){for(t&=~Yo,t&=~ca,e.suspendedLanes|=t,e.pingedLanes&=~t,e=e.expirationTimes;0<t;){var n=31-Ct(t),r=1<<n;e[n]=-1,t&=~r}}function Tu(e){if((ie&6)!==0)throw Error(i(327));wr();var t=Sl(e,0);if((t&1)===0)return nt(e,V()),null;var n=ha(e,t);if(e.tag!==0&&n===2){var r=za(e);r!==0&&(t=r,n=Xo(e,r))}if(n===1)throw n=sl,Hn(e,0),En(e,t),nt(e,V()),n;if(n===6)throw Error(i(345));return e.finishedWork=e.current.alternate,e.finishedLanes=t,Wn(e,tt,tn),nt(e,V()),null}function es(e,t){var n=ie;ie|=1;try{return e(t)}finally{ie=n,ie===0&&(_r=V()+500,Vl&&vn())}}function Vn(e){bn!==null&&bn.tag===0&&(ie&6)===0&&wr();var t=ie;ie|=1;var n=wt.transition,r=ge;try{if(wt.transition=null,ge=1,e)return e()}finally{ge=r,wt.transition=n,ie=t,(ie&6)===0&&vn()}}function ts(){ct=yr.current,_e(yr)}function Hn(e,t){e.finishedWork=null,e.finishedLanes=0;var n=e.timeoutHandle;if(n!==-1&&(e.timeoutHandle=-1,md(n)),ze!==null)for(n=ze.return;n!==null;){var r=n;switch(uo(r),r.tag){case 1:r=r.type.childContextTypes,r!=null&&Ul();break;case 3:hr(),_e(Xe),_e(Ve),bo();break;case 5:wo(r);break;case 4:hr();break;case 13:_e(Se);break;case 19:_e(Se);break;case 10:ho(r.type._context);break;case 22:case 23:ts()}n=n.return}if(Oe=e,ze=e=Cn(e.current,null),Ue=ct=t,Le=0,sl=null,Yo=ca=Bn=0,tt=il=null,Fn!==null){for(t=0;t<Fn.length;t++)if(n=Fn[t],r=n.interleaved,r!==null){n.interleaved=null;var l=r.next,a=n.pending;if(a!==null){var s=a.next;a.next=l,r.next=s}n.pending=r}Fn=null}return e}function zu(e,t){do{var n=ze;try{if(mo(),Zl.current=ra,ea){for(var r=Ee.memoizedState;r!==null;){var l=r.queue;l!==null&&(l.pending=null),r=r.next}ea=!1}if(Un=0,De=Me=Ee=null,tl=!1,nl=0,Qo.current=null,n===null||n.return===null){Le=1,sl=t,ze=null;break}e:{var a=e,s=n.return,c=n,p=t;if(t=Ue,c.flags|=32768,p!==null&&typeof p=="object"&&typeof p.then=="function"){var w=p,N=c,z=N.tag;if((N.mode&1)===0&&(z===0||z===11||z===15)){var C=N.alternate;C?(N.updateQueue=C.updateQueue,N.memoizedState=C.memoizedState,N.lanes=C.lanes):(N.updateQueue=null,N.memoizedState=null)}var I=tu(s);if(I!==null){I.flags&=-257,nu(I,s,c,a,t),I.mode&1&&eu(a,w,t),t=I,p=w;var B=t.updateQueue;if(B===null){var H=new Set;H.add(p),t.updateQueue=H}else B.add(p);break e}else{if((t&1)===0){eu(a,w,t),ns();break e}p=Error(i(426))}}else if(ke&&c.mode&1){var Ne=tu(s);if(Ne!==null){(Ne.flags&65536)===0&&(Ne.flags|=256),nu(Ne,s,c,a,t),fo(xr(p,c));break e}}a=p=xr(p,c),Le!==4&&(Le=2),il===null?il=[a]:il.push(a),a=s;do{switch(a.tag){case 3:a.flags|=65536,t&=-t,a.lanes|=t;var y=Xi(a,p,t);Ei(a,y);break e;case 1:c=p;var f=a.type,_=a.stateNode;if((a.flags&128)===0&&(typeof f.getDerivedStateFromError=="function"||_!==null&&typeof _.componentDidCatch=="function"&&(kn===null||!kn.has(_)))){a.flags|=65536,t&=-t,a.lanes|=t;var R=Zi(a,c,t);Ei(a,R);break e}}a=a.return}while(a!==null)}Lu(n)}catch(W){t=W,ze===n&&n!==null&&(ze=n=n.return);continue}break}while(!0)}function Pu(){var e=ua.current;return ua.current=ra,e===null?ra:e}function ns(){(Le===0||Le===3||Le===2)&&(Le=4),Oe===null||(Bn&268435455)===0&&(ca&268435455)===0||En(Oe,Ue)}function ha(e,t){var n=ie;ie|=2;var r=Pu();(Oe!==e||Ue!==t)&&(tn=null,Hn(e,t));do try{Ad();break}catch(l){zu(e,l)}while(!0);if(mo(),ie=n,ua.current=r,ze!==null)throw Error(i(261));return Oe=null,Ue=0,Le}function Ad(){for(;ze!==null;)Mu(ze)}function Ud(){for(;ze!==null&&!L();)Mu(ze)}function Mu(e){var t=Ou(e.alternate,e,ct);e.memoizedProps=e.pendingProps,t===null?Lu(e):ze=t,Qo.current=null}function Lu(e){var t=e;do{var n=t.alternate;if(e=t.return,(t.flags&32768)===0){if(n=Ld(n,t,ct),n!==null){ze=n;return}}else{if(n=Rd(n,t),n!==null){n.flags&=32767,ze=n;return}if(e!==null)e.flags|=32768,e.subtreeFlags=0,e.deletions=null;else{Le=6,ze=null;return}}if(t=t.sibling,t!==null){ze=t;return}ze=t=e}while(t!==null);Le===0&&(Le=5)}function Wn(e,t,n){var r=ge,l=wt.transition;try{wt.transition=null,ge=1,Bd(e,t,n,r)}finally{wt.transition=l,ge=r}return null}function Bd(e,t,n,r){do wr();while(bn!==null);if((ie&6)!==0)throw Error(i(327));n=e.finishedWork;var l=e.finishedLanes;if(n===null)return null;if(e.finishedWork=null,e.finishedLanes=0,n===e.current)throw Error(i(177));e.callbackNode=null,e.callbackPriority=0;var a=n.lanes|n.childLanes;if(kc(e,a),e===Oe&&(ze=Oe=null,Ue=0),(n.subtreeFlags&2064)===0&&(n.flags&2064)===0||pa||(pa=!0,$u(fe,function(){return wr(),null})),a=(n.flags&15990)!==0,(n.subtreeFlags&15990)!==0||a){a=wt.transition,wt.transition=null;var s=ge;ge=1;var c=ie;ie|=4,Qo.current=null,Od(e,n),bu(n,e),id(to),Nl=!!eo,to=eo=null,e.current=n,$d(n),$(),ie=c,ge=s,wt.transition=a}else e.current=n;if(pa&&(pa=!1,bn=e,fa=l),a=e.pendingLanes,a===0&&(kn=null),hc(n.stateNode),nt(e,V()),t!==null)for(r=e.onRecoverableError,n=0;n<t.length;n++)l=t[n],r(l.value,{componentStack:l.stack,digest:l.digest});if(da)throw da=!1,e=Go,Go=null,e;return(fa&1)!==0&&e.tag!==0&&wr(),a=e.pendingLanes,(a&1)!==0?e===qo?ul++:(ul=0,qo=e):ul=0,vn(),null}function wr(){if(bn!==null){var e=ws(fa),t=wt.transition,n=ge;try{if(wt.transition=null,ge=16>e?16:e,bn===null)var r=!1;else{if(e=bn,bn=null,fa=0,(ie&6)!==0)throw Error(i(331));var l=ie;for(ie|=4,A=e.current;A!==null;){var a=A,s=a.child;if((A.flags&16)!==0){var c=a.deletions;if(c!==null){for(var p=0;p<c.length;p++){var w=c[p];for(A=w;A!==null;){var N=A;switch(N.tag){case 0:case 11:case 15:ol(8,N,a)}var z=N.child;if(z!==null)z.return=N,A=z;else for(;A!==null;){N=A;var C=N.sibling,I=N.return;if(vu(N),N===w){A=null;break}if(C!==null){C.return=I,A=C;break}A=I}}}var B=a.alternate;if(B!==null){var H=B.child;if(H!==null){B.child=null;do{var Ne=H.sibling;H.sibling=null,H=Ne}while(H!==null)}}A=a}}if((a.subtreeFlags&2064)!==0&&s!==null)s.return=a,A=s;else e:for(;A!==null;){if(a=A,(a.flags&2048)!==0)switch(a.tag){case 0:case 11:case 15:ol(9,a,a.return)}var y=a.sibling;if(y!==null){y.return=a.return,A=y;break e}A=a.return}}var f=e.current;for(A=f;A!==null;){s=A;var _=s.child;if((s.subtreeFlags&2064)!==0&&_!==null)_.return=s,A=_;else e:for(s=f;A!==null;){if(c=A,(c.flags&2048)!==0)try{switch(c.tag){case 0:case 11:case 15:ia(9,c)}}catch(W){Ce(c,c.return,W)}if(c===s){A=null;break e}var R=c.sibling;if(R!==null){R.return=c.return,A=R;break e}A=c.return}}if(ie=l,vn(),Ft&&typeof Ft.onPostCommitFiberRoot=="function")try{Ft.onPostCommitFiberRoot(wl,e)}catch{}r=!0}return r}finally{ge=n,wt.transition=t}}return!1}function Ru(e,t,n){t=xr(n,t),t=Xi(e,t,1),e=_n(e,t,1),t=Je(),e!==null&&(Lr(e,1,t),nt(e,t))}function Ce(e,t,n){if(e.tag===3)Ru(e,e,n);else for(;t!==null;){if(t.tag===3){Ru(t,e,n);break}else if(t.tag===1){var r=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof r.componentDidCatch=="function"&&(kn===null||!kn.has(r))){e=xr(n,e),e=Zi(t,e,1),t=_n(t,e,1),e=Je(),t!==null&&(Lr(t,1,e),nt(t,e));break}}t=t.return}}function Vd(e,t,n){var r=e.pingCache;r!==null&&r.delete(t),t=Je(),e.pingedLanes|=e.suspendedLanes&n,Oe===e&&(Ue&n)===n&&(Le===4||Le===3&&(Ue&130023424)===Ue&&500>V()-Jo?Hn(e,0):Yo|=n),nt(e,t)}function Du(e,t){t===0&&((e.mode&1)===0?t=1:(t=bl,bl<<=1,(bl&130023424)===0&&(bl=4194304)));var n=Je();e=Xt(e,t),e!==null&&(Lr(e,t,n),nt(e,n))}function Hd(e){var t=e.memoizedState,n=0;t!==null&&(n=t.retryLane),Du(e,n)}function Wd(e,t){var n=0;switch(e.tag){case 13:var r=e.stateNode,l=e.memoizedState;l!==null&&(n=l.retryLane);break;case 19:r=e.stateNode;break;default:throw Error(i(314))}r!==null&&r.delete(t),Du(e,n)}var Ou;Ou=function(e,t,n){if(e!==null)if(e.memoizedProps!==t.pendingProps||Xe.current)et=!0;else{if((e.lanes&n)===0&&(t.flags&128)===0)return et=!1,Md(e,t,n);et=(e.flags&131072)!==0}else et=!1,ke&&(t.flags&1048576)!==0&&mi(t,Wl,t.index);switch(t.lanes=0,t.tag){case 2:var r=t.type;oa(e,t),e=t.pendingProps;var l=ur(t,Ve.current);mr(t,n),l=Co(null,t,r,e,l,n);var a=No();return t.flags|=1,typeof l=="object"&&l!==null&&typeof l.render=="function"&&l.$$typeof===void 0?(t.tag=1,t.memoizedState=null,t.updateQueue=null,Ze(r)?(a=!0,Bl(t)):a=!1,t.memoizedState=l.state!==null&&l.state!==void 0?l.state:null,yo(t),l.updater=la,t.stateNode=l,l._reactInternals=t,Lo(t,r,e,n),t=$o(null,t,r,!0,a,n)):(t.tag=0,ke&&a&&io(t),Ye(null,t,l,n),t=t.child),t;case 16:r=t.elementType;e:{switch(oa(e,t),e=t.pendingProps,l=r._init,r=l(r._payload),t.type=r,l=t.tag=Qd(r),e=Tt(r,e),l){case 0:t=Oo(null,t,r,e,n);break e;case 1:t=iu(null,t,r,e,n);break e;case 11:t=ru(null,t,r,e,n);break e;case 14:t=lu(null,t,r,Tt(r.type,e),n);break e}throw Error(i(306,r,""))}return t;case 0:return r=t.type,l=t.pendingProps,l=t.elementType===r?l:Tt(r,l),Oo(e,t,r,l,n);case 1:return r=t.type,l=t.pendingProps,l=t.elementType===r?l:Tt(r,l),iu(e,t,r,l,n);case 3:e:{if(uu(t),e===null)throw Error(i(387));r=t.pendingProps,a=t.memoizedState,l=a.element,Si(e,t),ql(t,r,null,n);var s=t.memoizedState;if(r=s.element,a.isDehydrated)if(a={element:r,isDehydrated:!1,cache:s.cache,pendingSuspenseBoundaries:s.pendingSuspenseBoundaries,transitions:s.transitions},t.updateQueue.baseState=a,t.memoizedState=a,t.flags&256){l=xr(Error(i(423)),t),t=cu(e,t,r,n,l);break e}else if(r!==l){l=xr(Error(i(424)),t),t=cu(e,t,r,n,l);break e}else for(ut=mn(t.stateNode.containerInfo.firstChild),it=t,ke=!0,jt=null,n=ki(t,null,r,n),t.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(pr(),r===l){t=en(e,t,n);break e}Ye(e,t,r,n)}t=t.child}return t;case 5:return Ni(t),e===null&&po(t),r=t.type,l=t.pendingProps,a=e!==null?e.memoizedProps:null,s=l.children,no(r,l)?s=null:a!==null&&no(r,a)&&(t.flags|=32),su(e,t),Ye(e,t,s,n),t.child;case 6:return e===null&&po(t),null;case 13:return du(e,t,n);case 4:return _o(t,t.stateNode.containerInfo),r=t.pendingProps,e===null?t.child=fr(t,null,r,n):Ye(e,t,r,n),t.child;case 11:return r=t.type,l=t.pendingProps,l=t.elementType===r?l:Tt(r,l),ru(e,t,r,l,n);case 7:return Ye(e,t,t.pendingProps,n),t.child;case 8:return Ye(e,t,t.pendingProps.children,n),t.child;case 12:return Ye(e,t,t.pendingProps.children,n),t.child;case 10:e:{if(r=t.type._context,l=t.pendingProps,a=t.memoizedProps,s=l.value,xe(Yl,r._currentValue),r._currentValue=s,a!==null)if(Nt(a.value,s)){if(a.children===l.children&&!Xe.current){t=en(e,t,n);break e}}else for(a=t.child,a!==null&&(a.return=t);a!==null;){var c=a.dependencies;if(c!==null){s=a.child;for(var p=c.firstContext;p!==null;){if(p.context===r){if(a.tag===1){p=Zt(-1,n&-n),p.tag=2;var w=a.updateQueue;if(w!==null){w=w.shared;var N=w.pending;N===null?p.next=p:(p.next=N.next,N.next=p),w.pending=p}}a.lanes|=n,p=a.alternate,p!==null&&(p.lanes|=n),xo(a.return,n,t),c.lanes|=n;break}p=p.next}}else if(a.tag===10)s=a.type===t.type?null:a.child;else if(a.tag===18){if(s=a.return,s===null)throw Error(i(341));s.lanes|=n,c=s.alternate,c!==null&&(c.lanes|=n),xo(s,n,t),s=a.sibling}else s=a.child;if(s!==null)s.return=a;else for(s=a;s!==null;){if(s===t){s=null;break}if(a=s.sibling,a!==null){a.return=s.return,s=a;break}s=s.return}a=s}Ye(e,t,l.children,n),t=t.child}return t;case 9:return l=t.type,r=t.pendingProps.children,mr(t,n),l=yt(l),r=r(l),t.flags|=1,Ye(e,t,r,n),t.child;case 14:return r=t.type,l=Tt(r,t.pendingProps),l=Tt(r.type,l),lu(e,t,r,l,n);case 15:return au(e,t,t.type,t.pendingProps,n);case 17:return r=t.type,l=t.pendingProps,l=t.elementType===r?l:Tt(r,l),oa(e,t),t.tag=1,Ze(r)?(e=!0,Bl(t)):e=!1,mr(t,n),Gi(t,r,l),Lo(t,r,l,n),$o(null,t,r,!0,e,n);case 19:return fu(e,t,n);case 22:return ou(e,t,n)}throw Error(i(156,t.tag))};function $u(e,t){return Pr(e,t)}function Kd(e,t,n,r){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=r,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function kt(e,t,n,r){return new Kd(e,t,n,r)}function rs(e){return e=e.prototype,!(!e||!e.isReactComponent)}function Qd(e){if(typeof e=="function")return rs(e)?1:0;if(e!=null){if(e=e.$$typeof,e===lt)return 11;if(e===pt)return 14}return 2}function Cn(e,t){var n=e.alternate;return n===null?(n=kt(e.tag,t,e.key,e.mode),n.elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=e.flags&14680064,n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n}function xa(e,t,n,r,l,a){var s=2;if(r=e,typeof e=="function")rs(e)&&(s=1);else if(typeof e=="string")s=5;else e:switch(e){case Te:return Kn(n.children,l,a,t);case Re:s=8,l|=8;break;case St:return e=kt(12,n,t,l|2),e.elementType=St,e.lanes=a,e;case Qe:return e=kt(13,n,t,l),e.elementType=Qe,e.lanes=a,e;case at:return e=kt(19,n,t,l),e.elementType=at,e.lanes=a,e;case ve:return va(n,l,a,t);default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case dt:s=10;break e;case Lt:s=9;break e;case lt:s=11;break e;case pt:s=14;break e;case Ie:s=16,r=null;break e}throw Error(i(130,e==null?e:typeof e,""))}return t=kt(s,n,t,l),t.elementType=e,t.type=r,t.lanes=a,t}function Kn(e,t,n,r){return e=kt(7,e,r,t),e.lanes=n,e}function va(e,t,n,r){return e=kt(22,e,r,t),e.elementType=ve,e.lanes=n,e.stateNode={isHidden:!1},e}function ls(e,t,n){return e=kt(6,e,null,t),e.lanes=n,e}function as(e,t,n){return t=kt(4,e.children!==null?e.children:[],e.key,t),t.lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}function Yd(e,t,n,r,l){this.tag=t,this.containerInfo=e,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=Pa(0),this.expirationTimes=Pa(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Pa(0),this.identifierPrefix=r,this.onRecoverableError=l,this.mutableSourceEagerHydrationData=null}function os(e,t,n,r,l,a,s,c,p){return e=new Yd(e,t,n,c,p),t===1?(t=1,a===!0&&(t|=8)):t=0,a=kt(3,null,null,t),e.current=a,a.stateNode=e,a.memoizedState={element:r,isDehydrated:n,cache:null,transitions:null,pendingSuspenseBoundaries:null},yo(a),e}function Jd(e,t,n){var r=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:ce,key:r==null?null:""+r,children:e,containerInfo:t,implementation:n}}function Iu(e){if(!e)return xn;e=e._reactInternals;e:{if(mt(e)!==e||e.tag!==1)throw Error(i(170));var t=e;do{switch(t.tag){case 3:t=t.stateNode.context;break e;case 1:if(Ze(t.type)){t=t.stateNode.__reactInternalMemoizedMergedChildContext;break e}}t=t.return}while(t!==null);throw Error(i(171))}if(e.tag===1){var n=e.type;if(Ze(n))return pi(e,n,t)}return t}function Fu(e,t,n,r,l,a,s,c,p){return e=os(n,r,!0,e,l,a,s,c,p),e.context=Iu(null),n=e.current,r=Je(),l=Sn(n),a=Zt(r,l),a.callback=t??null,_n(n,a,l),e.current.lanes=l,Lr(e,l,r),nt(e,r),e}function ya(e,t,n,r){var l=t.current,a=Je(),s=Sn(l);return n=Iu(n),t.context===null?t.context=n:t.pendingContext=n,t=Zt(a,s),t.payload={element:e},r=r===void 0?null:r,r!==null&&(t.callback=r),e=_n(l,t,s),e!==null&&(Mt(e,l,s,a),Gl(e,l,s)),s}function _a(e){if(e=e.current,!e.child)return null;switch(e.child.tag){case 5:return e.child.stateNode;default:return e.child.stateNode}}function Au(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var n=e.retryLane;e.retryLane=n!==0&&n<t?n:t}}function ss(e,t){Au(e,t),(e=e.alternate)&&Au(e,t)}function Gd(){return null}var Uu=typeof reportError=="function"?reportError:function(e){console.error(e)};function is(e){this._internalRoot=e}wa.prototype.render=is.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(i(409));ya(e,t,null,null)},wa.prototype.unmount=is.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;Vn(function(){ya(null,e,null,null)}),t[Yt]=null}};function wa(e){this._internalRoot=e}wa.prototype.unstable_scheduleHydration=function(e){if(e){var t=Ss();e={blockedOn:null,target:e,priority:t};for(var n=0;n<pn.length&&t!==0&&t<pn[n].priority;n++);pn.splice(n,0,e),n===0&&Ns(e)}};function us(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function ka(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11&&(e.nodeType!==8||e.nodeValue!==" react-mount-point-unstable "))}function Bu(){}function qd(e,t,n,r,l){if(l){if(typeof r=="function"){var a=r;r=function(){var w=_a(s);a.call(w)}}var s=Fu(t,r,e,0,null,!1,!1,"",Bu);return e._reactRootContainer=s,e[Yt]=s.current,Qr(e.nodeType===8?e.parentNode:e),Vn(),s}for(;l=e.lastChild;)e.removeChild(l);if(typeof r=="function"){var c=r;r=function(){var w=_a(p);c.call(w)}}var p=os(e,0,!1,null,null,!1,!1,"",Bu);return e._reactRootContainer=p,e[Yt]=p.current,Qr(e.nodeType===8?e.parentNode:e),Vn(function(){ya(t,p,n,r)}),p}function ba(e,t,n,r,l){var a=n._reactRootContainer;if(a){var s=a;if(typeof l=="function"){var c=l;l=function(){var p=_a(s);c.call(p)}}ya(t,s,e,l)}else s=qd(n,t,e,l,r);return _a(s)}ks=function(e){switch(e.tag){case 3:var t=e.stateNode;if(t.current.memoizedState.isDehydrated){var n=Mr(t.pendingLanes);n!==0&&(Ma(t,n|1),nt(t,V()),(ie&6)===0&&(_r=V()+500,vn()))}break;case 13:Vn(function(){var r=Xt(e,1);if(r!==null){var l=Je();Mt(r,e,1,l)}}),ss(e,1)}},La=function(e){if(e.tag===13){var t=Xt(e,134217728);if(t!==null){var n=Je();Mt(t,e,134217728,n)}ss(e,134217728)}},bs=function(e){if(e.tag===13){var t=Sn(e),n=Xt(e,t);if(n!==null){var r=Je();Mt(n,e,t,r)}ss(e,t)}},Ss=function(){return ge},Es=function(e,t){var n=ge;try{return ge=e,t()}finally{ge=n}},Sr=function(e,t,n){switch(t){case"input":if(Ot(e,n),t=n.name,n.type==="radio"&&t!=null){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+t)+'][type="radio"]'),t=0;t<n.length;t++){var r=n[t];if(r!==e&&r.form===e.form){var l=Al(r);if(!l)throw Error(i(90));Ge(r),Ot(r,l)}}}break;case"textarea":Jn(e,n);break;case"select":t=n.value,t!=null&&Fe(e,!!n.multiple,t,!1)}},hl=es,Pn=Vn;var Xd={usingClientEntryPoint:!1,Events:[Gr,sr,Al,Cr,Zn,es]},cl={findFiberByHostInstance:Dn,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},Zd={bundleType:cl.bundleType,version:cl.version,rendererPackageName:cl.rendererPackageName,rendererConfig:cl.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:we.ReactCurrentDispatcher,findHostInstanceByFiber:function(e){return e=Tr(e),e===null?null:e.stateNode},findFiberByHostInstance:cl.findFiberByHostInstance||Gd,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var Sa=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Sa.isDisabled&&Sa.supportsFiber)try{wl=Sa.inject(Zd),Ft=Sa}catch{}}return rt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Xd,rt.createPortal=function(e,t){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!us(t))throw Error(i(200));return Jd(e,t,null,n)},rt.createRoot=function(e,t){if(!us(e))throw Error(i(299));var n=!1,r="",l=Uu;return t!=null&&(t.unstable_strictMode===!0&&(n=!0),t.identifierPrefix!==void 0&&(r=t.identifierPrefix),t.onRecoverableError!==void 0&&(l=t.onRecoverableError)),t=os(e,1,!1,null,null,n,!1,r,l),e[Yt]=t.current,Qr(e.nodeType===8?e.parentNode:e),new is(t)},rt.findDOMNode=function(e){if(e==null)return null;if(e.nodeType===1)return e;var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(i(188)):(e=Object.keys(e).join(","),Error(i(268,e)));return e=Tr(t),e=e===null?null:e.stateNode,e},rt.flushSync=function(e){return Vn(e)},rt.hydrate=function(e,t,n){if(!ka(t))throw Error(i(200));return ba(null,e,t,!0,n)},rt.hydrateRoot=function(e,t,n){if(!us(e))throw Error(i(405));var r=n!=null&&n.hydratedSources||null,l=!1,a="",s=Uu;if(n!=null&&(n.unstable_strictMode===!0&&(l=!0),n.identifierPrefix!==void 0&&(a=n.identifierPrefix),n.onRecoverableError!==void 0&&(s=n.onRecoverableError)),t=Fu(t,null,e,1,n??null,l,!1,a,s),e[Yt]=t.current,Qr(e),r)for(e=0;e<r.length;e++)n=r[e],l=n._getVersion,l=l(n._source),t.mutableSourceEagerHydrationData==null?t.mutableSourceEagerHydrationData=[n,l]:t.mutableSourceEagerHydrationData.push(n,l);return new wa(t)},rt.render=function(e,t,n){if(!ka(t))throw Error(i(200));return ba(null,e,t,!1,n)},rt.unmountComponentAtNode=function(e){if(!ka(e))throw Error(i(40));return e._reactRootContainer?(Vn(function(){ba(null,null,e,!1,function(){e._reactRootContainer=null,e[Yt]=null})}),!0):!1},rt.unstable_batchedUpdates=es,rt.unstable_renderSubtreeIntoContainer=function(e,t,n,r){if(!ka(n))throw Error(i(200));if(e==null||e._reactInternals===void 0)throw Error(i(38));return ba(e,t,n,!1,r)},rt.version="18.3.1-next-f1338f8080-20240426",rt}var Gu;function sp(){if(Gu)return ps.exports;Gu=1;function o(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(o)}catch(u){console.error(u)}}return o(),ps.exports=op(),ps.exports}var qu;function ip(){if(qu)return Ea;qu=1;var o=sp();return Ea.createRoot=o.createRoot,Ea.hydrateRoot=o.hydrateRoot,Ea}var up=ip();function cp(){if(typeof window>"u")return!1;const o=window;return!!(o.SpeechRecognition||o.webkitSpeechRecognition)}function dp(){if(typeof window>"u")return null;const o=window;return o.SpeechRecognition??o.webkitSpeechRecognition??null}function pp(o){const u=dp();if(!u)return o.onError("Voice input is not supported in this browser."),null;let i=new u;i.continuous=!0,i.interimResults=!0;try{i.lang=navigator.language||"en-US"}catch{i.lang="en-US"}let x=!1,g="";i.onresult=m=>{var k;let j="",S="";for(let P=m.resultIndex;P<m.results.length;P++){const M=m.results[P],b=((k=M[0])==null?void 0:k.transcript)??"";M.isFinal?S+=b:j+=b}S&&(g=(g+" "+S).trim()),o.onPartial((g+" "+j).trim())},i.onerror=m=>{const j=m.error??"unknown";x||(j==="no-speech"?o.onError("Voice: silence detected. Hold the mic and speak."):j==="not-allowed"||j==="service-not-allowed"?o.onError("Voice: microphone permission denied."):j==="aborted"||o.onError(`Voice error: ${j}`))},i.onend=()=>{x||g&&o.onCommit(g)};try{i.start()}catch(m){return o.onError(m instanceof Error?m.message:"Voice failed to start."),null}return{stop:()=>{try{i==null||i.stop()}catch{}},abort:()=>{x=!0;try{i==null||i.abort()}catch{}i=null}}}function vs(){return typeof navigator>"u"||!navigator.mediaDevices?!1:typeof navigator.mediaDevices.getUserMedia=="function"&&typeof MediaRecorder<"u"}function fp(o,u,i={}){return(async()=>{if(!vs())return u.onError("Voice: this runtime does not expose MediaRecorder."),null;let x;try{x=await navigator.mediaDevices.getUserMedia({audio:!0})}catch(k){const P=k instanceof Error?k.message:"microphone unavailable";return u.onError(`Voice: microphone permission denied or device missing (${P}).`),null}let g=i.preferredMime??"audio/webm;codecs=opus";typeof MediaRecorder.isTypeSupported=="function"&&!MediaRecorder.isTypeSupported(g)&&(g=["audio/webm","audio/ogg;codecs=opus","audio/mp4"].find(M=>MediaRecorder.isTypeSupported(M))??"");const m=g?new MediaRecorder(x,{mimeType:g}):new MediaRecorder(x),j=[];let S=!1;m.addEventListener("dataavailable",k=>{k.data&&k.data.size>0&&j.push(k.data)}),m.addEventListener("stop",()=>{if(x.getTracks().forEach(P=>P.stop()),S||j.length===0)return;const k=new Blob(j,{type:g||"audio/webm"});k.arrayBuffer().then(P=>{const M=gp(P);return u.onPartial("a transcrever…"),o.transcribeAudio(M,k.type||"audio/webm",i.language)}).then(P=>{if(S)return;const M=((P==null?void 0:P.text)??"").trim();M?u.onCommit(M):u.onError("Voice: silence detected — nada para transcrever.")}).catch(P=>{if(S)return;const M=P instanceof Error?P.message:String(P);u.onError(`Voice: ${M}`)})});try{m.start()}catch(k){return x.getTracks().forEach(P=>P.stop()),u.onError(k instanceof Error?k.message:"recorder failed to start"),null}return{stop:()=>{if(m.state==="recording")try{m.stop()}catch{}},abort:()=>{if(S=!0,m.state==="recording")try{m.stop()}catch{}x.getTracks().forEach(k=>k.stop())}}})()}function gp(o){const u=new Uint8Array(o);let i="";const x=32768;for(let g=0;g<u.length;g+=x){const m=u.subarray(g,Math.min(g+x,u.length));i+=String.fromCharCode.apply(null,Array.from(m))}return btoa(i)}function mp(o){const u=[],i=o.split(`
`);let x=0,g=[];function m(){g.length!==0&&(u.push({kind:"prose",body:g.join(`
`)}),g=[])}for(;x<i.length;){const j=i[x],S=j.match(/^```(\w[\w+-]*)?\s*$/);if(S){m();const k=S[1]||null;x++;const P=x;for(;x<i.length&&!i[x].match(/^```\s*$/);)x++;const M=i.slice(P,x).join(`
`);u.push({kind:"code",lang:k,body:M}),x++;continue}g.push(j),x++}return m(),u}const hp=[[/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/,(o,u)=>d.jsx("a",{href:o[2],target:"_blank",rel:"noopener noreferrer",className:"gauntlet-md__link",children:o[1]},`a-${u}`)],[/`([^`]+)`/,(o,u)=>d.jsx("code",{className:"gauntlet-md__inline-code",children:o[1]},`c-${u}`)],[/\*\*([^*]+)\*\*/,(o,u)=>d.jsx("strong",{className:"gauntlet-md__strong",children:o[1]},`b-${u}`)],[/\*([^*]+)\*/,(o,u)=>d.jsx("em",{className:"gauntlet-md__em",children:o[1]},`i-${u}`)],[/_([^_]+)_/,(o,u)=>d.jsx("em",{className:"gauntlet-md__em",children:o[1]},`u-${u}`)]];function pl(o,u){const i=[];let x=0,g=0;for(;x<o.length;){let m=null;for(const[j,S]of hp){const P=o.slice(x).match(j);!P||P.index===void 0||(m===null||P.index<m.idx)&&(m={idx:P.index,match:P,render:S})}if(m===null){i.push(o.slice(x));break}m.idx>0&&i.push(o.slice(x,x+m.idx)),i.push(m.render(m.match,u*100+g)),g++,x+=m.idx+m.match[0].length}return i}function xp(o,u){const i=[],x=o.split(`
`);let g=0,m=u;for(;g<x.length;){const S=x[g].trim();if(!S){g++;continue}const k=S.match(/^(#{1,3})\s+(.*)$/);if(k){const M=k[1].length,U=`h${M}`;i.push(d.jsx(U,{className:`gauntlet-md__h gauntlet-md__h${M}`,children:pl(k[2],m++)},`h-${m++}`)),g++;continue}if(/^---+$/.test(S)||/^\*\*\*+$/.test(S)){i.push(d.jsx("hr",{className:"gauntlet-md__hr"},`hr-${m++}`)),g++;continue}if(S.startsWith(">")){const M=[];for(;g<x.length&&x[g].trim().startsWith(">");)M.push(x[g].replace(/^\s*>\s?/,"")),g++;i.push(d.jsx("blockquote",{className:"gauntlet-md__quote",children:pl(M.join(" "),m++)},`q-${m++}`));continue}if(/^[-*]\s+/.test(S)){const M=[];for(;g<x.length&&/^[-*]\s+/.test(x[g].trim());)M.push(x[g].trim().replace(/^[-*]\s+/,"")),g++;i.push(d.jsx("ul",{className:"gauntlet-md__list",children:M.map((b,U)=>d.jsx("li",{className:"gauntlet-md__li",children:pl(b,m++)},U))},`ul-${m++}`));continue}if(/^\d+\.\s+/.test(S)){const M=[];for(;g<x.length&&/^\d+\.\s+/.test(x[g].trim());)M.push(x[g].trim().replace(/^\d+\.\s+/,"")),g++;i.push(d.jsx("ol",{className:"gauntlet-md__list",children:M.map((b,U)=>d.jsx("li",{className:"gauntlet-md__li",children:pl(b,m++)},U))},`ol-${m++}`));continue}const P=[];for(;g<x.length;){const M=x[g],b=M.trim();if(!b||/^(#{1,3})\s+/.test(b)||/^---+$/.test(b)||/^\*\*\*+$/.test(b)||b.startsWith(">")||/^[-*]\s+/.test(b)||/^\d+\.\s+/.test(b))break;P.push(M),g++}i.push(d.jsx("p",{className:"gauntlet-md__p",children:pl(P.join(" "),m++)},`p-${m++}`))}return i}function vp({source:o,onCopyBlock:u}){const i=mp(o);return d.jsx("div",{className:"gauntlet-md",children:i.map((x,g)=>x.kind==="code"?d.jsx(jp,{lang:x.lang,body:x.body,onCopy:u},`cb-${g}`):d.jsx("div",{className:"gauntlet-md__prose",children:xp(x.body,g*1e3)},`pb-${g}`))})}const yp=new Set(["def","class","if","elif","else","for","while","return","import","from","as","with","try","except","finally","raise","pass","break","continue","in","is","not","and","or","lambda","yield","async","await","global","nonlocal","True","False","None","self","cls","print"]),_p=new Set(["function","const","let","var","if","else","return","class","export","import","from","as","default","async","await","for","while","try","catch","finally","throw","new","this","super","extends","implements","interface","type","enum","public","private","protected","readonly","static","typeof","instanceof","in","of","null","undefined","true","false","void","switch","case","break","continue","do","yield"]),wp=new Set(["cd","ls","cat","rm","mv","cp","mkdir","touch","grep","sed","awk","export","source","if","then","else","elif","fi","for","while","do","done","case","esac","exit","npm","npx","git","python","node","tsc","make","vite","wxt","set","get","start-process","select-string"]);function ic(o,u){if(o[u]!=="#")return-1;const i=o.indexOf(`
`,u);return i===-1?o.length:i}function kp(o,u){if(o[u]!=="/")return-1;if(o[u+1]==="/"){const i=o.indexOf(`
`,u);return i===-1?o.length:i}if(o[u+1]==="*"){const i=o.indexOf("*/",u+2);return i===-1?o.length:i+2}return-1}const uc={keywords:yp,matchComment:ic},bp={keywords:_p,matchComment:kp},Sp={keywords:wp,matchComment:ic};function Ep(o){if(!o)return null;const u=o.toLowerCase();return u==="py"||u==="python"||u==="python3"||u==="ipython"||u==="pycon"?uc:u==="ts"||u==="tsx"||u==="typescript"||u==="js"||u==="jsx"||u==="javascript"||u==="mjs"||u==="json"||u==="json5"?bp:u==="sh"||u==="bash"||u==="zsh"||u==="shell"||u==="powershell"||u==="ps"||u==="ps1"||u==="console"?Sp:null}function cc(o){return o>="a"&&o<="z"||o>="A"&&o<="Z"||o==="_"||o==="$"}function Cp(o){return cc(o)||o>="0"&&o<="9"}function ms(o){return o>="0"&&o<="9"}function Np(o,u){const i=[];let x="";function g(){x&&(i.push({kind:"p",text:x}),x="")}let m=0;for(;m<o.length;){const j=o[m],S=u.matchComment(o,m);if(S!==-1){g(),i.push({kind:"c",text:o.slice(m,S)}),m=S;continue}if(u===uc&&(o.startsWith('"""',m)||o.startsWith("'''",m))){g();const k=o.slice(m,m+3);let P=o.indexOf(k,m+3);P=P===-1?o.length:P+3,i.push({kind:"s",text:o.slice(m,P)}),m=P;continue}if(j==='"'||j==="'"||j==="`"){g();let k=m+1;for(;k<o.length&&o[k]!==j;){if(o[k]==="\\"){k+=2;continue}if(o[k]===`
`&&j!=="`")break;k++}const P=k<o.length?k+1:k;i.push({kind:"s",text:o.slice(m,P)}),m=P;continue}if(ms(j)){g();let k=m;for(;k<o.length&&(ms(o[k])||o[k]==="."||o[k]==="_");)k++;if(k<o.length&&(o[k]==="e"||o[k]==="E"))for(k++,k<o.length&&(o[k]==="+"||o[k]==="-")&&k++;k<o.length&&ms(o[k]);)k++;i.push({kind:"n",text:o.slice(m,k)}),m=k;continue}if(cc(j)){g();let k=m+1;for(;k<o.length&&Cp(o[k]);)k++;const P=o.slice(m,k);let M=k;for(;M<o.length&&o[M]===" ";)M++;const b=o[M]==="(";let U="p";u.keywords.has(P)?U="k":b&&(U="f"),i.push({kind:U,text:P}),m=k;continue}x+=j,m++}return g(),i}function jp({lang:o,body:u,onCopy:i}){const x=()=>{navigator.clipboard.writeText(u).catch(()=>{}),i==null||i(u)},g=Ep(o),m=g?Np(u,g):null;return d.jsxs("figure",{className:"gauntlet-md__code",children:[d.jsxs("header",{className:"gauntlet-md__code-meta",children:[d.jsx("span",{className:"gauntlet-md__code-lang",children:o??"code"}),d.jsx("button",{type:"button",className:"gauntlet-md__code-copy",onClick:x,"aria-label":"copy code",children:"copy"})]}),d.jsx("pre",{className:"gauntlet-md__code-body",children:m?d.jsx("code",{children:m.map((j,S)=>d.jsx("span",{className:`gauntlet-md__tok gauntlet-md__tok--${j.kind}`,children:j.text},S))}):d.jsx("code",{children:u})})]})}const Tp={domains:{},actions:{},default_domain_policy:{allowed:!0,require_danger_ack:!1},default_action_policy:{allowed:!0,require_danger_ack:!1},tool_policies:{},max_page_text_chars:6e3,max_dom_skeleton_chars:4e3,screenshot_default:!1,execution_reporting_required:!1,updated_at:""},zp="2px solid #d07a5a",Pp="2px",Mp="#gauntlet-capsule-host",Lp=[/\bpassword\b/i,/\bdelete\b/i,/\bdestroy\b/i,/\bremove\b/i,/\bunsubscribe\b/i,/payment|checkout|billing/i,/credit[-_ ]?card|\bccnum\b|\bcvv\b|\bcvc\b/i],Rp=["delete","remove","destroy","drop","discard","apagar","eliminar","remover","destruir","pay","buy","purchase","order","checkout","pagar","comprar","encomendar","confirm","submit","send","publish","enviar","confirmar","publicar","transfer","withdraw","transferir","levantar","cancel subscription","cancelar subscrição","cancelar assinatura"],Dp=5e3;function Op(o){const u=o.filter(m=>m.type==="fill"),i=o.filter(m=>m.type==="click");if(u.length===0||i.length===0)return{danger:!1};const x=u.find(m=>{const j=m.selector.toLowerCase();return!!(/\bpassword\b/.test(j)||/\bcvv\b|\bcvc\b|\bccnum\b|credit[-_ ]?card/.test(j)||/payment|checkout|billing/.test(j)||/cc-(number|exp|csc|name)/.test(j))});if(!x)return{danger:!1};const g=i.find(m=>{const j=m.selector.toLowerCase();return!!(j.includes("submit")||/\b(pay|buy|purchase|confirm|send|order|checkout|pagar|comprar|enviar|confirmar)\b/.test(j))});return g?{danger:!0,reason:`cadeia destrutiva: fill em "${x.selector}" seguido de click em "${g.selector}"`}:{danger:!1}}function $p(o){var x;if(o.type==="highlight"||o.type==="scroll_to")return{danger:!1};const u=o.selector;for(const g of Lp)if(g.test(u))return{danger:!0,reason:`selector matches /${g.source}/`};let i=null;try{i=document.querySelector(u)}catch{}if(o.type==="fill")return i instanceof HTMLInputElement&&i.type==="password"?{danger:!0,reason:"password field"}:i instanceof HTMLInputElement&&(((x=i.autocomplete)==null?void 0:x.includes("cc-"))??!1)?{danger:!0,reason:"credit-card autocomplete"}:o.value.length>Dp?{danger:!0,reason:"unusually long value"}:{danger:!1};if(o.type==="click"){if(i instanceof HTMLButtonElement&&i.type==="submit")return{danger:!0,reason:"submit button"};if(i instanceof HTMLInputElement&&(i.type==="submit"||i.type==="reset"))return{danger:!0,reason:`${i.type} button`};if(i instanceof HTMLElement){const g=(i.innerText??"").trim().toLowerCase();if(g){for(const m of Rp)if(g===m||g.startsWith(m+" ")||g.endsWith(" "+m)||g.includes(" "+m+" "))return{danger:!0,reason:`action label: "${m}"`}}}return{danger:!1}}return{danger:!1}}async function Ip(o){const u=[];for(const i of o)try{Fp(i),await Ap(i),u.push({action:i,ok:!0})}catch(x){u.push({action:i,ok:!1,error:x instanceof Error?x.message:String(x)})}return u}function Fp(o){const u=o.selector;if(!u||typeof u!="string")throw new Error("selector missing or not a string");if(u.includes(Mp))throw new Error(`selector targets the Gauntlet capsule itself: ${u}`);try{document.querySelector(u)}catch{throw new Error(`selector is not valid CSS: ${u}`)}}async function Ap(o){if(o.type==="fill"){Up(o.selector,o.value);return}if(o.type==="click"){Bp(o.selector);return}if(o.type==="highlight"){Vp(o.selector,o.duration_ms??1500);return}if(o.type==="scroll_to"){Hp(o.selector);return}throw new Error(`unknown action type: ${o.type??"<missing>"}`)}function Up(o,u){var x,g;const i=document.querySelector(o);if(!i)throw new Error(`selector not found: ${o}`);if(i instanceof HTMLInputElement||i instanceof HTMLTextAreaElement){i.focus({preventScroll:!0});const m=i instanceof HTMLInputElement?HTMLInputElement.prototype:HTMLTextAreaElement.prototype,j=(x=Object.getOwnPropertyDescriptor(m,"value"))==null?void 0:x.set;j?j.call(i,u):i.value=u,i.dispatchEvent(new Event("input",{bubbles:!0})),i.dispatchEvent(new Event("change",{bubbles:!0})),i.dispatchEvent(new Event("blur",{bubbles:!0}));return}if(i instanceof HTMLSelectElement){i.focus({preventScroll:!0});const m=(g=Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,"value"))==null?void 0:g.set;m?m.call(i,u):i.value=u,i.dispatchEvent(new Event("input",{bubbles:!0})),i.dispatchEvent(new Event("change",{bubbles:!0})),i.dispatchEvent(new Event("blur",{bubbles:!0}));return}if(i instanceof HTMLElement&&i.isContentEditable){i.focus(),i.textContent=u,i.dispatchEvent(new InputEvent("input",{bubbles:!0}));return}throw new Error(`element at ${o} is not fillable`)}function Bp(o){const u=document.querySelector(o);if(!u)throw new Error(`selector not found: ${o}`);if(!(u instanceof HTMLElement))throw new Error(`element at ${o} is not clickable`);const i=u.getBoundingClientRect(),x=i.left+i.width/2,g=i.top+i.height/2,m={bubbles:!0,cancelable:!0,view:window,clientX:x,clientY:g,button:0,buttons:1},j={...m,pointerId:1,pointerType:"mouse",isPrimary:!0};u.dispatchEvent(new PointerEvent("pointerdown",j)),u.dispatchEvent(new MouseEvent("mousedown",m)),u.focus({preventScroll:!0}),u.dispatchEvent(new PointerEvent("pointerup",j)),u.dispatchEvent(new MouseEvent("mouseup",m)),u.click()}function Vp(o,u){const i=document.querySelectorAll(o);if(i.length===0)throw new Error(`selector not found: ${o}`);for(const x of Array.from(i)){if(!(x instanceof HTMLElement))continue;const g=x.style.outline,m=x.style.outlineOffset;x.style.outline=zp,x.style.outlineOffset=Pp,window.setTimeout(()=>{x.style.outline=g,x.style.outlineOffset=m},u)}}function Hp(o){const u=document.querySelector(o);if(!u)throw new Error(`selector not found: ${o}`);if(!(u instanceof HTMLElement))throw new Error(`element at ${o} cannot be scrolled to`);u.scrollIntoView({behavior:"smooth",block:"center"})}const hs={},Wp="https://ruberra-backend-jkpf-production.up.railway.app",Kp=typeof import.meta<"u"?hs==null?void 0:hs.VITE_BACKEND_URL:void 0,Qp=(Kp??Wp).replace(/\/+$/,"");class Yp{constructor(u,i={}){this.ambient=u,this.backendUrl=(i.backendUrl??Qp).replace(/\/+$/,"")}captureContext(u,i){return this.ambient.transport.fetchJson("POST",`${this.backendUrl}/composer/context`,u,i)}detectIntent(u,i,x){return this.ambient.transport.fetchJson("POST",`${this.backendUrl}/composer/intent`,{context_id:u,user_input:i},x)}generatePreview(u,i){return this.ambient.transport.fetchJson("POST",`${this.backendUrl}/composer/preview`,{intent_id:u},i)}applyPreview(u,i,x,g){return this.ambient.transport.fetchJson("POST",`${this.backendUrl}/composer/apply`,{preview_id:u,approved:i,approval_reason:x??null},g)}async getToolManifests(u){return(await this.ambient.transport.fetchJson("GET",`${this.backendUrl}/tools/manifests`,void 0,u)).tools??[]}getSettings(u){return this.ambient.transport.fetchJson("GET",`${this.backendUrl}/composer/settings`,void 0,u)}updateSettings(u,i){return this.ambient.transport.fetchJson("PUT",`${this.backendUrl}/composer/settings`,u,i)}reportExecution(u,i){return this.ambient.transport.fetchJson("POST",`${this.backendUrl}/composer/execution`,u,i)}transcribeAudio(u,i,x,g){return this.ambient.transport.fetchJson("POST",`${this.backendUrl}/voice/transcribe`,{audio_base64:u,mime:i,language:x},g)}synthesizeSpeech(u,i,x){return this.ambient.transport.fetchJson("POST",`${this.backendUrl}/voice/synthesize`,{text:u,voice:i},x)}requestDomPlan(u,i,x){return this.ambient.transport.fetchJson("POST",`${this.backendUrl}/composer/dom_plan`,{context_id:u,user_input:i},x)}requestDomPlanStream(u,i,x){return this.ambient.transport.stream?this.ambient.transport.stream(`${this.backendUrl}/composer/dom_plan_stream`,{context_id:u,user_input:i},x):(x.onError("streaming not supported by this ambient"),()=>{})}}const Xu="gauntlet:pill_position",xs="gauntlet:dismissed_domains",Zu="gauntlet:screenshot_enabled",ec="gauntlet:theme",tc="gauntlet:palette_recent",nc="gauntlet:pill_mode",rc="gauntlet:tts_enabled",lc=8,dc="light",Jp="corner",Gp={bottom:16,right:16};function ac(o){const u=typeof window<"u"?window.innerWidth:1280,i=typeof window<"u"?window.innerHeight:800,x=4,g=u-x,m=i-x;return{right:Math.max(-14,Math.min(g,o.right)),bottom:Math.max(-14,Math.min(m,o.bottom))}}function qp(o){return{async readPillPosition(){const u=await o.get(Xu);return u&&typeof u=="object"&&typeof u.bottom=="number"&&typeof u.right=="number"?ac(u):Gp},async writePillPosition(u){await o.set(Xu,ac(u))},async readDismissedDomains(){const u=await o.get(xs);return Array.isArray(u)?u.filter(i=>typeof i=="string"):[]},async dismissDomain(u){if(!u)return;const i=await this.readDismissedDomains();i.includes(u)||await o.set(xs,[...i,u])},async restoreDomain(u){if(!u)return;const i=await this.readDismissedDomains(),x=i.filter(g=>g!==u);x.length!==i.length&&await o.set(xs,x)},async isDomainDismissed(u){return u?(await this.readDismissedDomains()).includes(u):!1},async readScreenshotEnabled(){return await o.get(Zu)===!0},async writeScreenshotEnabled(u){await o.set(Zu,!!u)},async readTheme(){const u=await o.get(ec);return u==="dark"||u==="light"?u:dc},async writeTheme(u){await o.set(ec,u)},async readPaletteRecent(){const u=await o.get(tc);return Array.isArray(u)?u.filter(i=>typeof i=="string").slice(0,lc):[]},async notePaletteUse(u){if(!u)return;const i=await this.readPaletteRecent(),x=[u,...i.filter(g=>g!==u)].slice(0,lc);await o.set(tc,x)},async readPillMode(){const u=await o.get(nc);return u==="cursor"||u==="corner"?u:Jp},async writePillMode(u){await o.set(nc,u)},async readTtsEnabled(){return await o.get(rc)===!0},async writeTtsEnabled(u){await o.set(rc,!!u)}}}function Xp({ambient:o,initialSnapshot:u,onDismiss:i,cursorAnchor:x}){var Tr,zr,Pr;const g=T.useMemo(()=>new Yp(o),[o]),m=T.useMemo(()=>qp(o.storage),[o]),j=(Tr=o.domActions)==null?void 0:Tr.execute,[S,k]=T.useState(u),[P,M]=T.useState(""),[b,U]=T.useState("idle"),[de,ne]=T.useState(null),[ee,re]=T.useState(!1),[D,Pe]=T.useState(null),[je,we]=T.useState(null),[G,ce]=T.useState(!1),[Te,Re]=T.useState(""),[St,dt]=T.useState(!1),[Lt,lt]=T.useState(dc),[Qe,at]=T.useState([]),[pt,Ie]=T.useState([]),[ve,O]=T.useState(0),[J,F]=T.useState(!1),h=T.useRef(!1),E=T.useRef(null),[X,Z]=T.useState(!1),le=T.useRef(""),[ae,me]=T.useState(null),[oe,pe]=T.useState([]),[Be,ft]=T.useState(null),[Ge,Qn]=T.useState(Tp),Rt=T.useRef(null),Yn=T.useRef(null),Dt=T.useRef(null),Ot=T.useRef(""),Tn=T.useRef(!1),[kr,nn]=T.useState(0),Fe=T.useRef(null),[rn,Ht]=T.useState(!1),[Jn,ot]=T.useState(!1),[Gn,qn]=T.useState(null),$t=T.useMemo(()=>D?D.actions.map($p):[],[D]),Wt=T.useMemo(()=>D?Op(D.actions):{danger:!1},[D]),It=T.useMemo(()=>{if(!D||D.actions.length===0)return{forced:!1,reason:null};let v="";try{v=new URL(S.url).hostname.toLowerCase()}catch{}if((Ge.domains[v]??Ge.default_domain_policy).require_danger_ack)return{forced:!0,reason:v?`policy: domain '${v}' requires explicit confirmation`:"policy: default domain policy requires explicit confirmation"};for(const $ of D.actions)if((Ge.actions[$.type]??Ge.default_action_policy).require_danger_ack)return{forced:!0,reason:`policy: action type '${$.type}' requires explicit confirmation`};return{forced:!1,reason:null}},[D,S.url,Ge]),qe=$t.some(v=>v.danger)||Wt.danger||It.forced;T.useEffect(()=>{var v;return(v=Rt.current)==null||v.focus(),()=>{var L,$;(L=Yn.current)==null||L.abort(),($=Dt.current)==null||$.call(Dt)}},[]),T.useEffect(()=>{k(u)},[u]),T.useEffect(()=>{let v=!1;return g.getToolManifests().then(L=>{v||at(L)}).catch(()=>{}),m.readPaletteRecent().then(L=>{v||Ie(L)}),()=>{v=!0}},[g,m]),T.useEffect(()=>{const v=!!S.text;v&&!h.current&&(F(!0),E.current!==null&&window.clearTimeout(E.current),E.current=window.setTimeout(()=>{F(!1),E.current=null},700)),h.current=v},[S.text]),T.useEffect(()=>()=>{E.current!==null&&(window.clearTimeout(E.current),E.current=null)},[]),T.useEffect(()=>{let v=!1;m.readTtsEnabled().then($=>{v||Z($)});function L($){const V=$.detail;typeof(V==null?void 0:V.enabled)=="boolean"&&Z(V.enabled)}return window.addEventListener("gauntlet:tts",L),()=>{v=!0,window.removeEventListener("gauntlet:tts",L)}},[m]),T.useEffect(()=>{if(!X||b!=="plan_ready")return;const v=D==null?void 0:D.compose;if(v&&v!==le.current&&!(typeof window>"u"||!window.speechSynthesis))try{window.speechSynthesis.cancel();const L=new SpeechSynthesisUtterance(v);L.rate=1.05,L.pitch=1,window.speechSynthesis.speak(L),le.current=v}catch{}},[X,b,D==null?void 0:D.compose]),T.useEffect(()=>()=>{var v;try{(v=window.speechSynthesis)==null||v.cancel()}catch{}},[]),T.useEffect(()=>{let v=!1;return m.readTheme().then(L=>{v||lt(L)}),()=>{v=!0}},[m]),T.useEffect(()=>{let v=!1;return g.getSettings().then(L=>{v||Qn(L)}).catch(()=>{}),()=>{v=!0}},[g]),T.useEffect(()=>{if(!o.capabilities.screenshot||!o.screenshot)return;let v=!1;return m.readScreenshotEnabled().then(L=>{const $=L||Ge.screenshot_default;v||!$||o.screenshot.capture().then(V=>{v||!V||me(V)}).catch(()=>{})}),()=>{v=!0}},[o,m,Ge.screenshot_default]);const fl=T.useCallback(()=>{k(o.selection.read())},[o]),gl=T.useCallback(()=>{if(Fe.current)return;ne(null);const v=P,L={onPartial:V=>{M(v?`${v} ${V}`.trim():V)},onCommit:V=>{var se;M(v?`${v} ${V}`.trim():V),Ht(!1),Fe.current=null,(se=Rt.current)==null||se.focus()},onError:V=>{ne(V),Ht(!1),Fe.current=null}};if(o.capabilities.remoteVoice&&vs()){Ht(!0),fp(g,L).then(V=>{V?Fe.current=V:Ht(!1)});return}const $=pp(L);$&&(Fe.current=$,Ht(!0))},[P,o,g]),br=T.useCallback(()=>{var v;(v=Fe.current)==null||v.stop()},[]),ml=T.useCallback(()=>{var v;(v=Fe.current)==null||v.abort(),Fe.current=null,Ht(!1)},[]);T.useEffect(()=>()=>{var v;(v=Fe.current)==null||v.abort()},[]),T.useEffect(()=>{function v(L){(L.metaKey||L.ctrlKey)&&(L.key==="k"||L.key==="K")&&(L.preventDefault(),L.stopPropagation(),ot(V=>!V))}return window.addEventListener("keydown",v,!0),()=>window.removeEventListener("keydown",v,!0)},[]);const zn=T.useCallback(v=>{qn(v),window.setTimeout(()=>qn(null),1400)},[]),Xn=T.useCallback(async()=>{const v=(D==null?void 0:D.compose)||S.text||P.trim();if(!v){ne("Nada para guardar — escreve um pedido ou recebe uma resposta.");return}const L=(P.trim()||S.pageTitle||"cápsula note").slice(0,200);try{await o.transport.fetchJson("POST",`${g.backendUrl}/memory/records`,{topic:L,body:v,kind:"note",scope:"user"}),zn("saved")}catch($){ne($ instanceof Error?`memória: ${$.message}`:"memória: falhou")}},[o,g,D,S,P,zn]),Et=T.useCallback(async(v,L=[],$)=>{if(!D||D.actions.length===0)return;Tn.current=!0;const V=D.actions.map((K,he)=>{const fe=L[he],be=$t[he];return{action:K,ok:fe?fe.ok:!1,error:(fe==null?void 0:fe.error)??null,danger:(be==null?void 0:be.danger)??!1,danger_reason:(be==null?void 0:be.reason)??null}}),se={plan_id:D.plan_id||null,context_id:D.context_id||null,url:S.url||null,page_title:S.pageTitle||null,status:v,results:V,has_danger:qe,sequence_danger_reason:Wt.danger?Wt.reason??null:null,danger_acknowledged:G,error:$??null,model_used:D.model_used||null,plan_latency_ms:D.latency_ms||null,user_input:P.trim()||null};if(Ge.execution_reporting_required)try{await g.reportExecution(se)}catch(K){const he=K instanceof Error?K.message:String(K);ne(`policy: execution report rejected — ${he}`),U("error")}else g.reportExecution(se).catch(()=>{})},[g,D,S,$t,qe,Wt,G,P,Ge.execution_reporting_required]),ln=T.useCallback(()=>{D&&D.actions.length>0&&!Tn.current&&Et("rejected"),i()},[D,i,Et]);T.useEffect(()=>{function v(L){if(L.key==="Escape"){if(L.preventDefault(),L.stopPropagation(),Jn){ot(!1);return}if(Fe.current){ml();return}ln()}}return window.addEventListener("keydown",v,!0),()=>window.removeEventListener("keydown",v,!0)},[ln,Jn,ml]);const Sr=T.useCallback(async()=>{const v=o.filesystem;if(v){ft(null);try{const L=await v.pickFile();if(!L)return;const $=L.name.toLowerCase();if(/\.(png|jpe?g|gif|webp|svg)$/.test($)){const{base64:se,mime:K}=await v.readFileBase64(L.path),he=Math.ceil(se.length*3/4);pe(fe=>[...fe,{id:`att-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,kind:"image",name:L.name,mime:K,bytes:he,base64:se,path:L.path}])}else{const se=await v.readTextFile(L.path);pe(K=>[...K,{id:`att-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,kind:"text",name:L.name,mime:"text/plain",bytes:new TextEncoder().encode(se).length,text:se,path:L.path}])}}catch(L){ft(L instanceof Error?L.message:String(L))}}},[o]),an=T.useCallback(async()=>{var L;const v=(L=o.screenshot)==null?void 0:L.captureScreen;if(v){ft(null);try{const $=await v();if(!$){ft("Captura de ecrã indisponível neste sistema.");return}const V=Math.ceil($.base64.length*3/4);pe(se=>[...se,{id:`att-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,kind:"image",name:`ecrã-${new Date().toISOString().slice(11,19)}.png`,mime:"image/png",bytes:V,base64:$.base64,path:$.path}])}catch($){ft($ instanceof Error?$.message:String($))}}},[o]),on=T.useCallback(v=>{pe(L=>L.filter($=>$.id!==v))},[]),[Er,Cr]=T.useState(null),[Zn,hl]=T.useState(!1),[Pn,Nr]=T.useState(""),[gt,Kt]=T.useState(null),[Mn,sn]=T.useState(!1),xl=T.useCallback(async()=>{const v=o.shellExec;if(!v)return;const L=Pn.trim();if(!L)return;const $=L.split(/\s+/),V=$[0],se=$.slice(1);sn(!0),Kt(null);try{const K=await v.run(V,se);Kt({cmd:L,stdout:K.stdout,stderr:K.stderr,exitCode:K.exitCode,durationMs:K.durationMs})}catch(K){Kt({cmd:L,stdout:"",stderr:K instanceof Error?K.message:String(K),exitCode:null,durationMs:0})}finally{sn(!1)}},[o,Pn]),Ln=T.useCallback(async()=>{const v=o.filesystem;if(!(v!=null&&v.pickSavePath)||!v.writeTextFile)return;const L=(D==null?void 0:D.compose)??"";if(L.trim()){ft(null);try{const V=`${(S.pageTitle||"gauntlet-compose").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,60)||"gauntlet-compose"}.md`,se=await v.pickSavePath(V,["md","txt","json"]);if(!se)return;const K=await v.writeTextFile(se,L);Cr(`${se.split(/[\\/]/).pop()??"ficheiro"} (${K<1024?`${K} B`:`${Math.round(K/1024)} KB`})`),window.setTimeout(()=>Cr(null),2500)}catch($){ft($ instanceof Error?$.message:String($))}}},[o,D,S.pageTitle]),Rn=T.useCallback(v=>{if(oe.length===0)return v;const L=[];for(const $ of oe)if($.kind==="text"&&$.text!=null)L.push(`<file name="${$.name}" path="${$.path??""}">
${$.text}
</file>`);else if($.kind==="image"){const V=Math.max(1,Math.round($.bytes/1024));L.push(`<image name="${$.name}" bytes="${$.bytes}" mime="${$.mime}">[${V} KB image attached — describe in prompt; multimodal payload arrives in A2]</image>`)}return`${L.join(`

`)}

${v}`},[oe]),Qt=T.useCallback(async()=>{var V,se;if(!P.trim()||b==="planning"||b==="streaming"||b==="executing")return;D&&D.actions.length>0&&!Tn.current&&Et("rejected"),(V=Yn.current)==null||V.abort(),(se=Dt.current)==null||se.call(Dt);const v=new AbortController;Yn.current=v,U("planning"),ne(null),Pe(null),we(null),ce(!1),re(!1),Re(""),nn(0),Ot.current="",Tn.current=!1;const L=await m.readScreenshotEnabled(),$=lf(S,L?ae:null);try{const K=await g.captureContext($,v.signal);if(v.signal.aborted)return;const he=Rn(P.trim());Dt.current=g.requestDomPlanStream(K.context_id,he,{onDelta:fe=>{if(v.signal.aborted)return;Ot.current+=fe,nn(ht=>ht+1);const be=rf(Ot.current);be!==null?(Re(be),U(ht=>ht==="planning"?"streaming":ht)):U(ht=>ht==="planning"?"streaming":ht)},onDone:fe=>{v.signal.aborted||(Pe(fe),U("plan_ready"),Re(""),Ot.current="")},onError:fe=>{v.signal.aborted||(async()=>{try{const be=await g.requestDomPlan(K.context_id,he,v.signal);if(v.signal.aborted)return;Pe(be),U("plan_ready"),Re(""),Ot.current=""}catch(be){if(v.signal.aborted)return;const ht=be instanceof Error?be.message:String(be);ne(`stream: ${fe} · fallback: ${ht}`),U("error"),Re(""),Ot.current=""}})()}})}catch(K){if(v.signal.aborted)return;ne(K instanceof Error?K.message:String(K)),U("error")}},[g,S,ae,P,b,D,Et,Rn,m]),jr=T.useCallback(v=>{var L;v.preventDefault(),O($=>$+1);try{(L=window.speechSynthesis)==null||L.cancel()}catch{}le.current="",Qt()},[Qt]),Na=T.useCallback(v=>{v.key==="Enter"&&(v.shiftKey||(v.preventDefault(),Qt()))},[Qt]),vl=T.useCallback(async()=>{if(D!=null&&D.compose)try{await navigator.clipboard.writeText(D.compose),re(!0),window.setTimeout(()=>re(!1),1500)}catch{ne("Clipboard write blocked. Select the text and copy manually.")}},[D]),ja=T.useCallback(async()=>{if(!(!j||!D||D.actions.length===0)&&!(qe&&!G)){U("executing"),ne(null);try{const v=await j(D.actions);we(v),U("executed");const L=v.every($=>$.ok);window.dispatchEvent(new CustomEvent("gauntlet:execute-result",{detail:{ok:L}})),await Et("executed",v)}catch(v){const L=v instanceof Error?v.message:String(v);ne(L),U("error"),window.dispatchEvent(new CustomEvent("gauntlet:execute-result",{detail:{ok:!1}})),await Et("failed",[],L)}}},[j,D,qe,G,Et]),mt=T.useMemo(()=>S.bbox?S.bbox:x?{x:x.x,y:x.y,width:0,height:0}:null,[S.bbox,x]),yl=T.useMemo(()=>{if(!mt)return;const v=typeof window<"u"?window.innerWidth:1280,L=typeof window<"u"?window.innerHeight:800,$=of(v,L),V=sf(mt,{width:v,height:L},$);return{top:`${V.top}px`,left:`${V.left}px`}},[mt]),_l=`gauntlet-capsule--phase-${b}`,Ta=["gauntlet-capsule","gauntlet-capsule--floating",mt?"gauntlet-capsule--anchored":"gauntlet-capsule--centered",S.text?null:"gauntlet-capsule--no-selection",_l].filter(Boolean).join(" ");return T.useEffect(()=>{window.dispatchEvent(new CustomEvent("gauntlet:phase",{detail:{phase:b}}))},[b]),d.jsxs("div",{className:Ta,"data-theme":Lt,role:"dialog","aria-label":"Gauntlet",style:yl,children:[d.jsx("div",{className:"gauntlet-capsule__aurora","aria-hidden":!0}),d.jsxs("div",{className:"gauntlet-capsule__layout",children:[d.jsxs("div",{className:"gauntlet-capsule__panel gauntlet-capsule__panel--left",children:[d.jsxs("header",{className:"gauntlet-capsule__header",children:[d.jsxs("div",{className:"gauntlet-capsule__brand-block",children:[d.jsx("span",{className:"gauntlet-capsule__mark","aria-hidden":!0,children:d.jsx("span",{className:"gauntlet-capsule__mark-dot"})}),d.jsxs("div",{className:"gauntlet-capsule__brand-text",children:[d.jsx("span",{className:"gauntlet-capsule__brand",children:"GAUNTLET"}),d.jsx("span",{className:"gauntlet-capsule__tagline",children:"cursor · capsule"})]})]}),d.jsxs("div",{className:"gauntlet-capsule__header-actions",children:[d.jsx("button",{type:"button",className:"gauntlet-capsule__settings-btn",onClick:()=>dt(v=>!v),"aria-label":"Definições","aria-expanded":St,title:"Definições",children:d.jsx("span",{"aria-hidden":!0,children:"···"})}),d.jsx("button",{type:"button",className:"gauntlet-capsule__close",onClick:ln,"aria-label":"Dismiss capsule (Esc)",children:d.jsx("span",{"aria-hidden":!0,children:"esc"})})]})]}),St&&d.jsx(nf,{onClose:()=>dt(!1),showScreenshot:o.capabilities.screenshot,showDismissedDomains:o.capabilities.dismissDomain,showPillMode:o.capabilities.pillSurface,prefs:m,theme:Lt,onChangeTheme:v=>{lt(v),m.writeTheme(v)}}),d.jsxs("section",{className:"gauntlet-capsule__context",children:[d.jsxs("div",{className:"gauntlet-capsule__context-meta",children:[d.jsx("span",{className:`gauntlet-capsule__source${J?" gauntlet-capsule__source--popped":""}`,children:"browser"}),d.jsx("span",{className:"gauntlet-capsule__url",title:S.url,children:S.pageTitle||S.url}),d.jsx("button",{type:"button",className:"gauntlet-capsule__refresh",onClick:fl,title:"Re-read current selection",children:"re-read"})]}),S.text?d.jsx("pre",{className:"gauntlet-capsule__selection",children:pc(S.text,600)}):d.jsx(tf,{snapshot:S,screenshotEnabled:ae!==null})]})]}),d.jsxs("div",{className:"gauntlet-capsule__panel gauntlet-capsule__panel--right",children:[d.jsxs("form",{className:"gauntlet-capsule__form",onSubmit:jr,children:[oe.length>0&&d.jsx("div",{className:"gauntlet-capsule__attachments","aria-label":"Anexos",children:oe.map(v=>d.jsxs("span",{className:`gauntlet-capsule__attachment gauntlet-capsule__attachment--${v.kind}`,title:v.path??v.name,children:[d.jsx("span",{className:"gauntlet-capsule__attachment-icon","aria-hidden":!0,children:v.kind==="image"?"◫":"⌥"}),d.jsx("span",{className:"gauntlet-capsule__attachment-name",children:v.name}),d.jsx("span",{className:"gauntlet-capsule__attachment-size",children:v.bytes<1024?`${v.bytes} B`:v.bytes<1024*1024?`${Math.round(v.bytes/1024)} KB`:`${(v.bytes/(1024*1024)).toFixed(1)} MB`}),d.jsx("button",{type:"button",className:"gauntlet-capsule__attachment-remove",onClick:()=>on(v.id),"aria-label":`Remover ${v.name}`,children:"×"})]},v.id))}),Be&&d.jsx("div",{className:"gauntlet-capsule__attach-error",role:"alert",children:Be}),Zn&&o.shellExec&&d.jsxs("div",{className:"gauntlet-capsule__shell-panel",children:[d.jsxs("div",{className:"gauntlet-capsule__shell-row",children:[d.jsx("span",{className:"gauntlet-capsule__shell-prompt","aria-hidden":!0,children:"$"}),d.jsx("input",{type:"text",className:"gauntlet-capsule__shell-input",placeholder:"git status — comandos da allowlist",value:Pn,onChange:v=>Nr(v.target.value),onKeyDown:v=>{v.key==="Enter"&&!v.shiftKey&&(v.preventDefault(),xl())},disabled:Mn,spellCheck:!1,autoComplete:"off"}),d.jsx("button",{type:"button",className:"gauntlet-capsule__shell-run",onClick:()=>void xl(),disabled:Mn||!Pn.trim(),children:Mn?"…":"Executar"})]}),gt&&d.jsxs("div",{className:"gauntlet-capsule__shell-output",children:[d.jsxs("div",{className:"gauntlet-capsule__shell-meta",children:[d.jsxs("span",{className:"gauntlet-capsule__shell-meta-cmd",children:["$ ",gt.cmd]}),d.jsxs("span",{className:"gauntlet-capsule__shell-meta-stat",children:[gt.exitCode===null?"erro":`exit ${gt.exitCode}`," · ",gt.durationMs," ms"]})]}),gt.stdout&&d.jsx("pre",{className:"gauntlet-capsule__shell-stdout",children:gt.stdout}),gt.stderr&&d.jsx("pre",{className:"gauntlet-capsule__shell-stderr",children:gt.stderr})]})]}),d.jsx("textarea",{ref:Rt,className:"gauntlet-capsule__input",placeholder:"O que queres? — Enter para enviar, Shift+Enter nova linha",value:P,onChange:v=>M(v.target.value),onKeyDown:Na,rows:2,disabled:b==="planning"||b==="streaming"||b==="executing"}),d.jsxs("div",{className:"gauntlet-capsule__actions",children:[d.jsxs("span",{className:"gauntlet-capsule__hint","aria-hidden":!0,children:[d.jsx("span",{className:"gauntlet-capsule__kbd",children:"↵"}),d.jsx("span",{className:"gauntlet-capsule__kbd-sep",children:"·"}),d.jsx("span",{className:"gauntlet-capsule__kbd",children:"⌘K"})]}),o.capabilities.filesystemRead&&o.filesystem&&d.jsxs("button",{type:"button",className:"gauntlet-capsule__attach-btn",onClick:()=>void Sr(),"aria-label":"Anexar ficheiro local",title:"Anexar ficheiro do disco",disabled:b==="planning"||b==="streaming"||b==="executing",children:[d.jsx("svg",{viewBox:"0 0 24 24",width:"13",height:"13","aria-hidden":!0,children:d.jsx("path",{d:"M14 4l-2 0 0 8-3 0 4 5 4-5-3 0 0-8z",transform:"rotate(45 12 12)",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinejoin:"round"})}),d.jsx("span",{className:"gauntlet-capsule__attach-label",children:"anexar"})]}),o.capabilities.screenCapture&&((zr=o.screenshot)==null?void 0:zr.captureScreen)&&d.jsxs("button",{type:"button",className:"gauntlet-capsule__attach-btn",onClick:()=>void an(),"aria-label":"Capturar ecrã inteiro",title:"Capturar ecrã inteiro",disabled:b==="planning"||b==="streaming"||b==="executing",children:[d.jsxs("svg",{viewBox:"0 0 24 24",width:"13",height:"13","aria-hidden":!0,children:[d.jsx("rect",{x:"3",y:"5",width:"18",height:"13",rx:"2",fill:"none",stroke:"currentColor",strokeWidth:"1.6"}),d.jsx("circle",{cx:"12",cy:"11.5",r:"2.4",fill:"none",stroke:"currentColor",strokeWidth:"1.6"})]}),d.jsx("span",{className:"gauntlet-capsule__attach-label",children:"ecrã"})]}),o.capabilities.shellExecute&&o.shellExec&&d.jsxs("button",{type:"button",className:`gauntlet-capsule__attach-btn${Zn?" gauntlet-capsule__attach-btn--active":""}`,onClick:()=>hl(v=>!v),"aria-label":"Shell rápida",title:"Shell rápida (allowlist + GAUNTLET_ALLOW_CODE_EXEC)","aria-expanded":Zn,children:[d.jsx("svg",{viewBox:"0 0 24 24",width:"13",height:"13","aria-hidden":!0,children:d.jsx("path",{d:"M5 7l4 4-4 4M11 16h7",stroke:"currentColor",strokeWidth:"1.7",fill:"none",strokeLinecap:"round",strokeLinejoin:"round"})}),d.jsx("span",{className:"gauntlet-capsule__attach-label",children:"shell"})]}),(cp()||o.capabilities.remoteVoice&&vs())&&d.jsxs("button",{type:"button",className:`gauntlet-capsule__voice${rn?" gauntlet-capsule__voice--active":""}`,onPointerDown:v=>{v.preventDefault(),gl()},onPointerUp:()=>br(),onPointerLeave:()=>{rn&&br()},"aria-label":rn?"A ouvir — solta para enviar":"Premer e falar",title:"Premir e falar",disabled:b==="planning"||b==="streaming"||b==="executing",children:[d.jsxs("svg",{viewBox:"0 0 24 24",width:"13",height:"13","aria-hidden":!0,children:[d.jsx("path",{d:"M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3z",fill:"currentColor"}),d.jsx("path",{d:"M19 11a7 7 0 0 1-14 0M12 18v3",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",fill:"none"})]}),d.jsx("span",{className:"gauntlet-capsule__voice-label",children:rn?"a ouvir":"voz"})]}),d.jsxs("button",{type:"submit",className:"gauntlet-capsule__compose",disabled:b==="planning"||b==="streaming"||b==="executing"||!P.trim(),children:[ve>0&&d.jsx("span",{className:"gauntlet-capsule__compose-ripple","aria-hidden":!0},ve),b==="planning"||b==="streaming"?d.jsxs(d.Fragment,{children:[d.jsx("span",{className:"gauntlet-capsule__compose-spinner","aria-hidden":!0}),d.jsx("span",{children:b==="planning"?"a pensar":"a escrever"})]}):"Enviar"]})]})]}),b==="streaming"&&Te&&d.jsxs("section",{className:"gauntlet-capsule__compose-result gauntlet-capsule__compose-result--streaming",children:[d.jsxs("header",{className:"gauntlet-capsule__compose-meta",children:[d.jsx("span",{className:"gauntlet-capsule__compose-tag",children:"resposta"}),d.jsxs("span",{className:"gauntlet-capsule__compose-meta-text",children:[d.jsxs("span",{className:"gauntlet-capsule__token-counter","aria-live":"polite",children:[kr," chunks"]}),d.jsx("span",{"aria-hidden":!0,children:"·"}),d.jsx("span",{children:"a escrever…"})]})]}),d.jsxs("div",{className:"gauntlet-capsule__compose-text gauntlet-capsule__compose-text--streaming",children:[Te,d.jsx("span",{className:"gauntlet-capsule__compose-caret","aria-hidden":!0,children:"▍"})]})]}),(b==="planning"||b==="streaming"&&!Te)&&d.jsxs("section",{className:"gauntlet-capsule__skeleton",role:"status","aria-live":"polite","aria-label":"A pensar...",children:[d.jsxs("header",{className:"gauntlet-capsule__skeleton-header",children:[d.jsx("span",{className:"gauntlet-capsule__skeleton-tag"}),d.jsx("span",{className:"gauntlet-capsule__skeleton-meta"})]}),d.jsx("div",{className:"gauntlet-capsule__skeleton-line gauntlet-capsule__skeleton-line--w90"}),d.jsx("div",{className:"gauntlet-capsule__skeleton-line gauntlet-capsule__skeleton-line--w75"}),d.jsx("div",{className:"gauntlet-capsule__skeleton-line gauntlet-capsule__skeleton-line--w55"})]}),(D==null?void 0:D.compose)&&b==="plan_ready"&&d.jsxs("section",{className:"gauntlet-capsule__compose-result",children:[d.jsxs("header",{className:"gauntlet-capsule__compose-meta",children:[d.jsx("span",{className:"gauntlet-capsule__compose-tag",children:"resposta"}),d.jsxs("span",{className:"gauntlet-capsule__compose-meta-text",children:[D.model_used," · ",D.latency_ms," ms"]})]}),d.jsx("div",{className:"gauntlet-capsule__compose-text",children:d.jsx(vp,{source:D.compose,onCopyBlock:()=>zn("code copied")})}),d.jsxs("div",{className:"gauntlet-capsule__compose-actions",children:[d.jsx("button",{type:"button",className:"gauntlet-capsule__copy",onClick:()=>void vl(),children:ee?"copiado ✓":"Copy"}),d.jsx("button",{type:"button",className:"gauntlet-capsule__copy gauntlet-capsule__copy--ghost",onClick:()=>void Xn(),children:Gn==="saved"?"guardado ✓":"Save"}),o.capabilities.filesystemWrite&&((Pr=o.filesystem)==null?void 0:Pr.writeTextFile)&&d.jsx("button",{type:"button",className:"gauntlet-capsule__copy gauntlet-capsule__copy--ghost",onClick:()=>void Ln(),title:"Guardar resposta para um ficheiro",children:Er?`→ ${Er}`:"Guardar como"})]})]}),D&&D.actions.length===0&&!D.compose&&b==="plan_ready"&&d.jsx("section",{className:"gauntlet-capsule__plan",children:d.jsx("p",{className:"gauntlet-capsule__plan-empty",children:D.reason??"Modelo não conseguiu planear."})}),D&&D.actions.length>0&&(b==="plan_ready"||b==="executing"||b==="executed")&&d.jsxs("section",{className:"gauntlet-capsule__plan",children:[d.jsxs("header",{className:"gauntlet-capsule__plan-header",children:[d.jsx("span",{className:"gauntlet-capsule__plan-title",children:"plano"}),d.jsxs("span",{className:"gauntlet-capsule__plan-meta",children:[D.actions.length," action",D.actions.length===1?"":"s"," · ",D.model_used," · ",D.latency_ms," ms"]})]}),d.jsx("ol",{className:"gauntlet-capsule__plan-list",children:D.actions.map((v,L)=>{const $=je==null?void 0:je[L],V=$?$.ok?"ok":"fail":"pending",se=$t[L];return d.jsxs("li",{className:`gauntlet-capsule__plan-item gauntlet-capsule__plan-item--${V}${se!=null&&se.danger?" gauntlet-capsule__plan-item--danger":""}`,children:[d.jsx("span",{className:"gauntlet-capsule__plan-step",children:L+1}),d.jsx("span",{className:"gauntlet-capsule__plan-desc",children:af(v)}),(se==null?void 0:se.danger)&&d.jsx("span",{className:"gauntlet-capsule__plan-danger",title:se.reason,children:"sensível"}),$&&!$.ok&&d.jsx("span",{className:"gauntlet-capsule__plan-err",title:$.error,children:$.error})]},`${L}-${v.type}-${v.selector}`)})}),b!=="executed"&&qe&&d.jsxs("div",{className:"gauntlet-capsule__danger-gate",role:"alert",children:[d.jsxs("header",{className:"gauntlet-capsule__danger-header",children:[d.jsx("span",{className:"gauntlet-capsule__danger-mark","aria-hidden":!0,children:"!"}),d.jsx("span",{className:"gauntlet-capsule__danger-title",children:"Acções sensíveis no plano"})]}),d.jsxs("ul",{className:"gauntlet-capsule__danger-list",children:[It.forced&&It.reason&&d.jsxs("li",{children:[d.jsx("strong",{children:"governança:"})," ",It.reason]},"danger-policy"),Wt.danger&&d.jsxs("li",{children:[d.jsx("strong",{children:"cadeia:"})," ",Wt.reason??"flagged"]},"danger-sequence"),$t.map((v,L)=>v.danger?d.jsxs("li",{children:[d.jsxs("strong",{children:["step ",L+1,":"]})," ",v.reason??"flagged"]},`danger-${L}`):null)]}),d.jsxs("label",{className:"gauntlet-capsule__danger-confirm",children:[d.jsx("input",{type:"checkbox",checked:G,onChange:v=>ce(v.target.checked),disabled:b==="executing"}),d.jsx("span",{children:"Confirmo, executar mesmo assim."})]})]}),b!=="executed"&&j&&d.jsx("div",{className:"gauntlet-capsule__plan-actions",children:d.jsx("button",{type:"button",className:`gauntlet-capsule__execute${qe?" gauntlet-capsule__execute--danger":""}`,onClick:()=>void ja(),disabled:b==="executing"||qe&&!G,children:b==="executing"?"executando…":qe?"Executar com cuidado":"Executar"})}),b!=="executed"&&!j&&d.jsx("p",{className:"gauntlet-capsule__plan-empty",children:"esta superfície não tem acesso a uma página viva — abre o Gauntlet num separador para executar acções."})]}),b==="error"&&de&&d.jsxs("div",{className:"gauntlet-capsule__error",role:"alert",children:[d.jsx("span",{className:"gauntlet-capsule__error-icon","aria-hidden":!0,children:"!"}),d.jsx("span",{children:de})]})]})]}),Jn&&d.jsx(ef,{onClose:()=>ot(!1),recentIds:pt,actions:(()=>{const v=K=>{Ie(he=>[K,...he.filter(be=>be!==K)].slice(0,8)),m.notePaletteUse(K)},L=K=>{M(he=>{const fe=he.trimEnd(),be=`usa a tool ${K} para `;return fe.startsWith("usa a tool ")?be:fe?`${be}${fe}`:be}),window.setTimeout(()=>{const he=Rt.current;he&&(he.focus(),he.setSelectionRange(he.value.length,he.value.length))},0)},$=[{id:"focus",label:"Focar input",shortcut:"↵",group:"action",run:()=>{v("focus"),ot(!1),window.setTimeout(()=>{var K;return(K=Rt.current)==null?void 0:K.focus()},0)}},{id:"copy",label:"Copiar resposta",shortcut:"⌘C",group:"action",disabled:!(D!=null&&D.compose),run:()=>{v("copy"),ot(!1),vl()}},{id:"save",label:"Guardar em memória",shortcut:"S",group:"action",disabled:!(D!=null&&D.compose)&&!S.text&&!P.trim(),run:()=>{v("save"),ot(!1),Xn()}},{id:"reread",label:"Re-ler contexto",shortcut:"R",group:"action",run:()=>{v("reread"),ot(!1),fl()}},{id:"clear",label:"Limpar input",shortcut:"X",group:"action",disabled:!P,run:()=>{var K;v("clear"),ot(!1),M(""),(K=Rt.current)==null||K.focus()}},{id:"dismiss",label:"Fechar cápsula",shortcut:"Esc",group:"action",run:()=>{v("dismiss"),ot(!1),ln()}}],se=Qe.filter(K=>{var fe;const he=(fe=Ge.tool_policies)==null?void 0:fe[K.name];return!he||he.allowed!==!1}).map(K=>{var he,fe;return{id:`tool:${K.name}`,label:K.name,description:K.description,shortcut:"",group:"tool",mode:K.mode,risk:K.risk,requiresApproval:((fe=(he=Ge.tool_policies)==null?void 0:he[K.name])==null?void 0:fe.require_approval)===!0,run:()=>{v(`tool:${K.name}`),ot(!1),L(K.name)}}});return[...$,...se]})()}),Gn&&d.jsx("div",{className:"gauntlet-capsule__flash",role:"status","aria-live":"polite",children:Gn})]})}function Zp(o,u){if(!o)return 0;const i=o.toLowerCase(),x=u.toLowerCase();if(x.includes(i))return 1e3-x.indexOf(i);let g=0,m=0,j=-2;for(let S=0;S<x.length&&g<i.length;S++)x[S]===i[g]&&(S!==j+1&&m++,j=S,g++);return g<i.length?-1:500-m*10-(x.length-i.length)}function ef({actions:o,onClose:u,recentIds:i}){const[x,g]=T.useState(""),[m,j]=T.useState(0),S=T.useRef(null);T.useEffect(()=>{var M;(M=S.current)==null||M.focus()},[]);const k=T.useMemo(()=>{if(!x){const b=new Map(i.map((ne,ee)=>[ne,ee])),U=ne=>{const ee=b.get(ne.id);return ee===void 0?i.length:ee};return[...o].sort((ne,ee)=>{const re=U(ne),D=U(ee);if(re!==D)return re-D;const Pe=G=>G==="tool"?1:0,je=Pe(ne.group),we=Pe(ee.group);return je!==we?je-we:ne.label.localeCompare(ee.label)})}return o.map(b=>{const U=`${b.label} ${b.id} ${b.description??""}`;return{a:b,score:Zp(x,U)}}).filter(b=>b.score>=0).sort((b,U)=>U.score-b.score).map(b=>b.a)},[o,x,i]);T.useEffect(()=>{m>=k.length&&j(0)},[k.length,m]);const P=T.useCallback(M=>{if(M.key==="ArrowDown")M.preventDefault(),j(b=>Math.min(b+1,k.length-1));else if(M.key==="ArrowUp")M.preventDefault(),j(b=>Math.max(b-1,0));else if(M.key==="Enter"){M.preventDefault();const b=k[m];b&&!b.disabled&&b.run()}},[k,m]);return d.jsxs("div",{className:"gauntlet-capsule__palette",role:"dialog","aria-label":"Command palette",children:[d.jsx("div",{className:"gauntlet-capsule__palette-scrim",onClick:u}),d.jsxs("div",{className:"gauntlet-capsule__palette-panel",onKeyDown:P,children:[d.jsx("input",{ref:S,className:"gauntlet-capsule__palette-input",type:"text",placeholder:"comandos · tools…  (↑↓ para navegar, ↵ para correr, esc para fechar)",value:x,onChange:M=>g(M.target.value)}),d.jsx("ul",{className:"gauntlet-capsule__palette-list",role:"listbox",children:k.length===0?d.jsx("li",{className:"gauntlet-capsule__palette-empty",children:"sem resultados"}):k.map((M,b)=>d.jsxs("li",{role:"option","aria-selected":b===m,"aria-disabled":M.disabled,onMouseEnter:()=>j(b),onClick:()=>{M.disabled||M.run()},className:`gauntlet-capsule__palette-item${b===m?" gauntlet-capsule__palette-item--active":""}${M.disabled?" gauntlet-capsule__palette-item--disabled":""}${M.group==="tool"?" gauntlet-capsule__palette-item--tool":""}`,children:[d.jsxs("div",{className:"gauntlet-capsule__palette-main",children:[d.jsx("span",{className:"gauntlet-capsule__palette-label",children:M.label}),M.description&&d.jsx("span",{className:"gauntlet-capsule__palette-desc",children:M.description})]}),d.jsxs("div",{className:"gauntlet-capsule__palette-meta",children:[M.mode&&d.jsx("span",{className:`gauntlet-capsule__palette-badge gauntlet-capsule__palette-badge--mode-${M.mode}`,title:`mode: ${M.mode}`,children:M.mode}),M.risk&&M.risk!=="low"&&d.jsx("span",{className:`gauntlet-capsule__palette-badge gauntlet-capsule__palette-badge--risk-${M.risk}`,title:`risk: ${M.risk}`,children:M.risk}),M.requiresApproval&&d.jsx("span",{className:"gauntlet-capsule__palette-badge gauntlet-capsule__palette-badge--approval",title:"requires explicit approval before running",children:"approval"}),M.shortcut&&d.jsx("span",{className:"gauntlet-capsule__palette-shortcut",children:M.shortcut})]})]},M.id))})]})]})}function pc(o,u){return o.length<=u?o:o.slice(0,u)+"…"}function tf({snapshot:o,screenshotEnabled:u}){const i=(()=>{if(!o.domSkeleton)return 0;try{const g=JSON.parse(o.domSkeleton);if(Array.isArray(g))return g.length}catch{}return 0})(),x=!!o.pageText;return d.jsxs("ul",{className:"gauntlet-capsule__context-summary","aria-label":"context",children:[d.jsxs("li",{children:[d.jsx("span",{className:"gauntlet-capsule__context-key",children:"selection"}),d.jsx("span",{className:"gauntlet-capsule__context-val gauntlet-capsule__context-val--muted",children:"none"})]}),d.jsxs("li",{children:[d.jsx("span",{className:"gauntlet-capsule__context-key",children:"page captured"}),d.jsx("span",{className:"gauntlet-capsule__context-val",children:x?"yes":"no"})]}),d.jsxs("li",{children:[d.jsx("span",{className:"gauntlet-capsule__context-key",children:"DOM captured"}),d.jsx("span",{className:"gauntlet-capsule__context-val",children:i>0?`${i} elements`:"—"})]}),d.jsxs("li",{children:[d.jsx("span",{className:"gauntlet-capsule__context-key",children:"screenshot"}),d.jsx("span",{className:"gauntlet-capsule__context-val",children:u?"on":"off"})]})]})}function nf({onClose:o,showScreenshot:u,prefs:i,showDismissedDomains:x,theme:g,onChangeTheme:m,showPillMode:j}){const[S,k]=T.useState([]),[P,M]=T.useState(!0),[b,U]=T.useState(!1),[de,ne]=T.useState("corner"),[ee,re]=T.useState(!1);T.useEffect(()=>{let G=!1;return x&&i.readDismissedDomains().then(ce=>{G||k(ce)}),i.readScreenshotEnabled().then(ce=>{G||(U(ce),M(!1))}),i.readPillMode().then(ce=>{G||ne(ce)}),i.readTtsEnabled().then(ce=>{G||re(ce)}),()=>{G=!0}},[i,x]);const D=T.useCallback(async G=>{ne(G),await i.writePillMode(G),window.dispatchEvent(new CustomEvent("gauntlet:pill-mode",{detail:{mode:G}}))},[i]),Pe=T.useCallback(async G=>{var ce;if(re(G),await i.writeTtsEnabled(G),!G)try{(ce=window.speechSynthesis)==null||ce.cancel()}catch{}window.dispatchEvent(new CustomEvent("gauntlet:tts",{detail:{enabled:G}}))},[i]),je=T.useCallback(async G=>{await i.restoreDomain(G),k(ce=>ce.filter(Te=>Te!==G))},[i]),we=T.useCallback(async G=>{U(G),await i.writeScreenshotEnabled(G)},[i]);return d.jsxs("section",{className:"gauntlet-capsule__settings",role:"region","aria-label":"Definições",children:[d.jsxs("header",{className:"gauntlet-capsule__settings-header",children:[d.jsx("span",{className:"gauntlet-capsule__settings-title",children:"definições"}),d.jsx("button",{type:"button",className:"gauntlet-capsule__settings-close",onClick:o,"aria-label":"Fechar definições",children:"×"})]}),d.jsxs("div",{className:"gauntlet-capsule__settings-section",children:[d.jsx("span",{className:"gauntlet-capsule__settings-subtitle",children:"aparência"}),d.jsxs("div",{className:"gauntlet-capsule__theme-switch",role:"radiogroup","aria-label":"tema",children:[d.jsxs("button",{type:"button",className:`gauntlet-capsule__theme-option${g==="light"?" gauntlet-capsule__theme-option--active":""}`,onClick:()=>m("light"),role:"radio","aria-checked":g==="light",children:[d.jsx("span",{className:"gauntlet-capsule__theme-swatch gauntlet-capsule__theme-swatch--light","aria-hidden":!0}),d.jsx("span",{children:"flagship light"})]}),d.jsxs("button",{type:"button",className:`gauntlet-capsule__theme-option${g==="dark"?" gauntlet-capsule__theme-option--active":""}`,onClick:()=>m("dark"),role:"radio","aria-checked":g==="dark",children:[d.jsx("span",{className:"gauntlet-capsule__theme-swatch gauntlet-capsule__theme-swatch--dark","aria-hidden":!0}),d.jsx("span",{children:"night premium"})]})]})]}),j&&d.jsxs("div",{className:"gauntlet-capsule__settings-section",children:[d.jsx("span",{className:"gauntlet-capsule__settings-subtitle",children:"pill"}),d.jsxs("div",{className:"gauntlet-capsule__theme-switch",role:"radiogroup","aria-label":"pill mode",children:[d.jsxs("button",{type:"button",className:`gauntlet-capsule__theme-option${de==="corner"?" gauntlet-capsule__theme-option--active":""}`,onClick:()=>void D("corner"),role:"radio","aria-checked":de==="corner",children:[d.jsx("span",{className:"gauntlet-capsule__theme-swatch gauntlet-capsule__pill-mode-swatch--corner","aria-hidden":!0}),d.jsx("span",{children:"resting corner"})]}),d.jsxs("button",{type:"button",className:`gauntlet-capsule__theme-option${de==="cursor"?" gauntlet-capsule__theme-option--active":""}`,onClick:()=>void D("cursor"),role:"radio","aria-checked":de==="cursor",children:[d.jsx("span",{className:"gauntlet-capsule__theme-swatch gauntlet-capsule__pill-mode-swatch--cursor","aria-hidden":!0}),d.jsx("span",{children:"cursor pill"})]})]})]}),u&&d.jsx("div",{className:"gauntlet-capsule__settings-section",children:d.jsxs("label",{className:"gauntlet-capsule__settings-toggle",children:[d.jsx("input",{type:"checkbox",checked:b,onChange:G=>void we(G.target.checked)}),d.jsxs("span",{className:"gauntlet-capsule__settings-toggle-label",children:[d.jsx("strong",{children:"incluir screenshot"}),d.jsx("small",{children:"o modelo vê a página visível. útil para layouts e imagens, exposição de senhas/DMs visíveis. opt-in."})]})]})}),d.jsx("div",{className:"gauntlet-capsule__settings-section",children:d.jsxs("label",{className:"gauntlet-capsule__settings-toggle",children:[d.jsx("input",{type:"checkbox",checked:ee,onChange:G=>void Pe(G.target.checked)}),d.jsxs("span",{className:"gauntlet-capsule__settings-toggle-label",children:[d.jsx("strong",{children:"ler resposta em voz alta"}),d.jsx("small",{children:"quando o modelo termina, a cápsula fala a resposta via Web Speech. cancela ao submeter outro pedido ou fechar a cápsula."})]})]})}),d.jsxs("div",{className:"gauntlet-capsule__settings-section",children:[d.jsx("span",{className:"gauntlet-capsule__settings-subtitle",children:"domínios escondidos"}),P?d.jsx("p",{className:"gauntlet-capsule__settings-empty",children:"a carregar…"}):S.length===0?d.jsx("p",{className:"gauntlet-capsule__settings-empty",children:"nenhum — clica direito no pill em qualquer site para o esconder."}):d.jsx("ul",{className:"gauntlet-capsule__settings-list",children:S.map(G=>d.jsxs("li",{className:"gauntlet-capsule__settings-row",children:[d.jsx("span",{className:"gauntlet-capsule__settings-host",children:G}),d.jsx("button",{type:"button",className:"gauntlet-capsule__settings-restore",onClick:()=>void je(G),children:"restaurar"})]},G))})]})]})}function rf(o){const u=o.match(/"compose"\s*:\s*"((?:[^"\\]|\\.)*)/);if(!u)return null;let i=u[1];return i.endsWith("\\")&&!i.endsWith("\\\\")&&(i=i.slice(0,-1)),i.replace(/\\n/g,`
`).replace(/\\r/g,"\r").replace(/\\t/g,"	").replace(/\\"/g,'"').replace(/\\\\/g,"\\")}function lf(o,u){const i={};return o.pageText&&(i.page_text=o.pageText),o.domSkeleton&&(i.dom_skeleton=o.domSkeleton),o.bbox&&(i.selection_bbox=o.bbox),u&&(i.screenshot_data_url=u),{source:"browser",url:o.url,page_title:o.pageTitle,selection:o.text||void 0,metadata:Object.keys(i).length>0?i:void 0}}function af(o){switch(o.type){case"fill":return`fill ${o.selector} ← "${pc(o.value,80)}"`;case"click":return`click ${o.selector}`;case"highlight":return`highlight ${o.selector}`;case"scroll_to":return`scroll to ${o.selector}`}}const bt=16,jn=12;function Ca(o,u,i){return i<u||o<u?u:o>i?i:o}function of(o,u){if(o<=600)return{width:Math.max(0,o-24),height:Math.max(0,u-24)};const x=Ca(.72*o,560,820),g=Ca(.72*u,420,560);return{width:x,height:g}}function sf(o,u,i){if(!o)return{top:Math.max(bt,Math.floor((u.height-i.height)/2)),left:Math.max(bt,Math.floor((u.width-i.width)/2)),placement:"center"};const x=u.height-(o.y+o.height)-jn-bt,g=o.y-jn-bt,m=u.width-(o.x+o.width)-jn-bt,j=o.x-jn-bt,S=x>=i.height,k=g>=i.height,P=m>=i.width,M=j>=i.width;let b,U,de;S?(b="below",U=o.y+o.height+jn,de=o.x):k?(b="above",U=o.y-jn-i.height,de=o.x):P?(b="right",de=o.x+o.width+jn,U=Math.floor(o.y+o.height/2-i.height/2)):M?(b="left",de=o.x-jn-i.width,U=Math.floor(o.y+o.height/2-i.height/2)):(b="center",U=Math.floor((u.height-i.height)/2),de=Math.floor((u.width-i.width)/2));const ne=u.height-i.height-bt,ee=u.width-i.width-bt;return U=Ca(U,bt,Math.max(bt,ne)),de=Ca(de,bt,Math.max(bt,ee)),{top:U,left:de,placement:b}}const uf=`
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
`,cf=100,df=new Set(["script","style","meta","link","noscript","head","html","br","hr","wbr"]),pf="gauntlet-capsule-host";function ff(o){const u=o.tagName.toLowerCase(),i=o.getAttribute("id");if(i&&!i.startsWith("gauntlet-"))return`${u}#${CSS.escape(i)}`;const x=o.getAttribute("name");if(x)return`${u}[name="${x}"]`;const g=o.getAttribute("type");if(g)return`${u}[type="${g}"]`;const m=Array.from(o.classList).filter(j=>j.length>2&&!j.startsWith("is-")&&!j.startsWith("has-")).slice(0,2);return m.length>0?`${u}.${m.map(j=>CSS.escape(j)).join(".")}`:u}function gf(o){try{const u=window.getComputedStyle(o);if(u.display==="none"||u.visibility==="hidden"||u.opacity==="0")return!1;const i=o.getBoundingClientRect();return!(i.width===0&&i.height===0||i.bottom<0||i.top>window.innerHeight||i.right<0||i.left>window.innerWidth)}catch{return!1}}function mf(o){let u=0,i=o;for(;i&&i!==document.body;)u++,i=i.parentElement;return u}function hf(o){var i;let u=o;for(;u;){if(u.id===pf||(i=u.id)!=null&&i.startsWith("gauntlet-"))return!0;u=u.parentElement}return!1}function xf(o){var P;const u=o.tagName.toLowerCase();if(df.has(u)||hf(o))return null;const i=ff(o),x=gf(o),g=mf(o),m={selector:i,tag:u,visible:x,depth:g},j=o.getAttribute("type");j&&(m.type=j);const S=o.getAttribute("placeholder")||o.getAttribute("aria-label")||o.getAttribute("title")||"";S&&(m.placeholder=S.trim().slice(0,80));const k=((P=o.innerText)==null?void 0:P.trim())??"";return k&&k.length>0&&(m.text=k.slice(0,50)),m}const vf=["input","textarea","select",'[contenteditable="true"]',"button","a[href]","label",'[role="button"]','[role="link"]','[role="textbox"]','[role="combobox"]','[role="listbox"]','[role="menuitem"]','[role="tab"]','[role="checkbox"]','[role="radio"]','[role="switch"]',"nav","main","form"].join(", ");function yf(){try{const o=[],u=new Set,i=document.querySelectorAll(vf);for(const x of Array.from(i)){if(o.length>=cf)break;const g=xf(x);g&&(u.has(g.selector)||(u.add(g.selector),o.push(g)))}return{elements:o}}catch{return{elements:[]}}}const oc=5e3;function _f(){try{const o=document.body;if(!o)return"";const i=(o.innerText??"").replace(/\r\n/g,`
`).replace(/\r/g,`
`).replace(/\n{3,}/g,`

`).replace(/[ \t]{2,}/g," ").trim();return i.length<=oc?i:i.slice(0,oc)+"…"}catch{return""}}function fc(){return{text:bf(),url:Sf(),pageTitle:Ef(),pageText:_f(),domSkeleton:JSON.stringify(yf()),bbox:Cf()}}const wf=50;async function kf(){var j;const o=fc();if(o.text)return o;const u=`gauntlet-cid-${Math.random().toString(36).slice(2)}`,i=[],x=S=>{const k=S.data;!k||k.gauntlet!=="subframe-selection-response"||k.cid===u&&(typeof k.text!="string"||!k.text||i.push({text:k.text,url:typeof k.url=="string"?k.url:void 0,pageTitle:typeof k.pageTitle=="string"?k.pageTitle:void 0}))};window.addEventListener("message",x);let g=null;try{g=document.querySelectorAll("iframe")}catch{g=null}if(g)for(const S of Array.from(g))try{(j=S.contentWindow)==null||j.postMessage({gauntlet:"subframe-selection-request",cid:u},"*")}catch{}await new Promise(S=>window.setTimeout(S,wf)),window.removeEventListener("message",x);const m=i.sort((S,k)=>k.text.length-S.text.length)[0];return m?{...o,text:m.text,url:m.url||o.url,pageTitle:m.pageTitle||o.pageTitle,bbox:null}:o}function bf(){try{const o=window.getSelection();return o?o.toString().trim():""}catch{return""}}function Sf(){try{return window.location.href}catch{return""}}function Ef(){try{return document.title??""}catch{return""}}function Cf(){try{const o=window.getSelection();if(!o||o.rangeCount===0||o.isCollapsed)return null;const i=o.getRangeAt(0).getBoundingClientRect();return i.width===0&&i.height===0?null:{x:i.x,y:i.y,width:i.width,height:i.height}}catch{return null}}const Nf={domExecution:!0,pillSurface:!0,screenshot:!0,dismissDomain:!0,voice:typeof window<"u"&&("SpeechRecognition"in window||"webkitSpeechRecognition"in window),streaming:!0,refreshSelection:!0,filesystemRead:!1,filesystemWrite:!1,screenCapture:!1,remoteVoice:!0,shellExecute:!1};async function jf(o,u,i){const x=await chrome.runtime.sendMessage({type:"gauntlet:fetch",url:u,method:o,headers:{"content-type":"application/json"},body:i===void 0?void 0:JSON.stringify(i)});if(!x||!x.ok)throw new Error(`composer: background fetch failed — ${(x==null?void 0:x.error)??"unknown error"}`);let g=null;if(x.body!=null&&x.body!=="")try{g=JSON.parse(x.body)}catch{g=x.body}const m=x.status??0;if(m<200||m>=300)throw new Error(`composer: ${m} ${x.statusText??""}`.trim());return g}const Tf={async get(o){try{return(await chrome.storage.local.get(o))[o]??null}catch{return null}},async set(o,u){try{await chrome.storage.local.set({[o]:u})}catch{}},async remove(o){try{await chrome.storage.local.remove(o)}catch{}}};function zf(o,u,i){const x=chrome.runtime.connect({name:"gauntlet:stream"});let g=!1;function m(){if(!g){g=!0;try{x.disconnect()}catch{}}}return x.onMessage.addListener(j=>{if(!j||typeof j!="object")return;const S=j;if(S.type==="sse"&&typeof S.data=="string"){let k=null;try{k=JSON.parse(S.data)}catch{i.onError("malformed SSE payload"),m();return}if(S.event==="delta"){const P=k.text??"";i.onDelta(P)}else if(S.event==="done"){const P=k;i.onDone({plan_id:P.plan_id??"",context_id:P.context_id??"",actions:P.actions??[],compose:P.compose??null,reason:P.reason??null,model_used:P.model_used??"",latency_ms:P.latency_ms??0,raw_response:null}),m()}else if(S.event==="error"){const P=k.error??"model error";i.onError(P),m()}}else S.type==="error"?(i.onError(S.error??"transport error"),m()):S.type==="closed"&&(g||(i.onDone({plan_id:"",context_id:"",actions:[],compose:null,reason:"stream ended without result",model_used:"",latency_ms:0,raw_response:null}),g=!0))}),x.onDisconnect.addListener(()=>{var j;if(!g){const S=(j=chrome.runtime.lastError)==null?void 0:j.message;i.onError(S??"disconnected"),g=!0}}),x.postMessage({type:"start",url:o,body:u}),()=>{if(!g){try{x.postMessage({type:"abort"})}catch{}m()}}}function Pf(){return{shell:"browser",capabilities:Nf,transport:{fetchJson(o,u,i){return jf(o,u,i)},stream:zf},storage:Tf,selection:{read:()=>fc(),readAsync:()=>kf()},domActions:{execute:Ip},screenshot:{async capture(){var o;if(typeof chrome>"u"||!((o=chrome.runtime)!=null&&o.sendMessage))return null;try{const u=await chrome.runtime.sendMessage({type:"gauntlet:capture_screenshot"});return!(u!=null&&u.ok)||!u.dataUrl?null:u.dataUrl}catch{return null}}},debug:{async lastSummon(){try{const o=await chrome.runtime.sendMessage({type:"gauntlet:debug"});return(o==null?void 0:o.lastSummon)??null}catch{return null}}}}}const Mf=`
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
`,gc=document.createElement("style");gc.textContent=uf+Mf;document.head.appendChild(gc);const sc=Pf(),mc={...sc,capabilities:{...sc.capabilities,domExecution:!1,screenshot:!1,dismissDomain:!1,refreshSelection:!1,pillSurface:!1},domActions:void 0,screenshot:void 0};mc.storage.get("gauntlet:theme").then(o=>{const u=o==="dark"||o==="light"?o:"light";document.documentElement.setAttribute("data-theme",u),document.body.setAttribute("data-theme",u)});const Lf=up.createRoot(document.getElementById("root"));Lf.render(d.jsx(T.StrictMode,{children:d.jsx(Xp,{ambient:mc,initialSnapshot:{text:"",url:"window://composer",pageTitle:"Composer",pageText:"",domSkeleton:"",bbox:null},onDismiss:()=>window.close()})}));
