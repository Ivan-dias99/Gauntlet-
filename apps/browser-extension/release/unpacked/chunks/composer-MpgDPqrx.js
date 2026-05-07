(function(){const u=document.createElement("link").relList;if(u&&u.supports&&u.supports("modulepreload"))return;for(const g of document.querySelectorAll('link[rel="modulepreload"]'))x(g);new MutationObserver(g=>{for(const m of g)if(m.type==="childList")for(const T of m.addedNodes)T.tagName==="LINK"&&T.rel==="modulepreload"&&x(T)}).observe(document,{childList:!0,subtree:!0});function i(g){const m={};return g.integrity&&(m.integrity=g.integrity),g.referrerPolicy&&(m.referrerPolicy=g.referrerPolicy),g.crossOrigin==="use-credentials"?m.credentials="include":g.crossOrigin==="anonymous"?m.credentials="omit":m.credentials="same-origin",m}function x(g){if(g.ep)return;g.ep=!0;const m=i(g);fetch(g.href,m)}})();try{}catch(s){console.error("[wxt] Failed to initialize plugins",s)}var li={exports:{}},il={},ai={exports:{}},te={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Fu;function tp(){if(Fu)return te;Fu=1;var s=Symbol.for("react.element"),u=Symbol.for("react.portal"),i=Symbol.for("react.fragment"),x=Symbol.for("react.strict_mode"),g=Symbol.for("react.profiler"),m=Symbol.for("react.provider"),T=Symbol.for("react.context"),b=Symbol.for("react.forward_ref"),k=Symbol.for("react.suspense"),z=Symbol.for("react.memo"),P=Symbol.for("react.lazy"),S=Symbol.iterator;function U(h){return h===null||typeof h!="object"?null:(h=S&&h[S]||h["@@iterator"],typeof h=="function"?h:null)}var de={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},ne=Object.assign,ee={};function re(h,E,q){this.props=h,this.context=E,this.refs=ee,this.updater=q||de}re.prototype.isReactComponent={},re.prototype.setState=function(h,E){if(typeof h!="object"&&typeof h!="function"&&h!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,h,E,"setState")},re.prototype.forceUpdate=function(h){this.updater.enqueueForceUpdate(this,h,"forceUpdate")};function D(){}D.prototype=re.prototype;function Me(h,E,q){this.props=h,this.context=E,this.refs=ee,this.updater=q||de}var je=Me.prototype=new D;je.constructor=Me,ne(je,re.prototype),je.isPureReactComponent=!0;var we=Array.isArray,Y=Object.prototype.hasOwnProperty,ce={current:null},ze={key:!0,ref:!0,__self:!0,__source:!0};function De(h,E,q){var Z,le={},ae=null,ge=null;if(E!=null)for(Z in E.ref!==void 0&&(ge=E.ref),E.key!==void 0&&(ae=""+E.key),E)Y.call(E,Z)&&!ze.hasOwnProperty(Z)&&(le[Z]=E[Z]);var oe=arguments.length-2;if(oe===1)le.children=q;else if(1<oe){for(var pe=Array(oe),Ve=0;Ve<oe;Ve++)pe[Ve]=arguments[Ve+2];le.children=pe}if(h&&h.defaultProps)for(Z in oe=h.defaultProps,oe)le[Z]===void 0&&(le[Z]=oe[Z]);return{$$typeof:s,type:h,key:ae,ref:ge,props:le,_owner:ce.current}}function St(h,E){return{$$typeof:s,type:h.type,key:E,ref:h.ref,props:h.props,_owner:h._owner}}function pt(h){return typeof h=="object"&&h!==null&&h.$$typeof===s}function Mt(h){var E={"=":"=0",":":"=2"};return"$"+h.replace(/[=:]/g,function(q){return E[q]})}var at=/\/+/g;function Ye(h,E){return typeof h=="object"&&h!==null&&h.key!=null?Mt(""+h.key):E.toString(36)}function ot(h,E,q,Z,le){var ae=typeof h;(ae==="undefined"||ae==="boolean")&&(h=null);var ge=!1;if(h===null)ge=!0;else switch(ae){case"string":case"number":ge=!0;break;case"object":switch(h.$$typeof){case s:case u:ge=!0}}if(ge)return ge=h,le=le(ge),h=Z===""?"."+Ye(ge,0):Z,we(le)?(q="",h!=null&&(q=h.replace(at,"$&/")+"/"),ot(le,E,q,"",function(Ve){return Ve})):le!=null&&(pt(le)&&(le=St(le,q+(!le.key||ge&&ge.key===le.key?"":(""+le.key).replace(at,"$&/")+"/")+h)),E.push(le)),1;if(ge=0,Z=Z===""?".":Z+":",we(h))for(var oe=0;oe<h.length;oe++){ae=h[oe];var pe=Z+Ye(ae,oe);ge+=ot(ae,E,q,pe,le)}else if(pe=U(h),typeof pe=="function")for(h=pe.call(h),oe=0;!(ae=h.next()).done;)ae=ae.value,pe=Z+Ye(ae,oe++),ge+=ot(ae,E,q,pe,le);else if(ae==="object")throw E=String(h),Error("Objects are not valid as a React child (found: "+(E==="[object Object]"?"object with keys {"+Object.keys(h).join(", ")+"}":E)+"). If you meant to render a collection of children, use an array instead.");return ge}function ft(h,E,q){if(h==null)return h;var Z=[],le=0;return ot(h,Z,"","",function(ae){return E.call(q,ae,le++)}),Z}function Fe(h){if(h._status===-1){var E=h._result;E=E(),E.then(function(q){(h._status===0||h._status===-1)&&(h._status=1,h._result=q)},function(q){(h._status===0||h._status===-1)&&(h._status=2,h._result=q)}),h._status===-1&&(h._status=0,h._result=E)}if(h._status===1)return h._result.default;throw h._result}var ve={current:null},O={transition:null},Q={ReactCurrentDispatcher:ve,ReactCurrentBatchConfig:O,ReactCurrentOwner:ce};function F(){throw Error("act(...) is not supported in production builds of React.")}return te.Children={map:ft,forEach:function(h,E,q){ft(h,function(){E.apply(this,arguments)},q)},count:function(h){var E=0;return ft(h,function(){E++}),E},toArray:function(h){return ft(h,function(E){return E})||[]},only:function(h){if(!pt(h))throw Error("React.Children.only expected to receive a single React element child.");return h}},te.Component=re,te.Fragment=i,te.Profiler=g,te.PureComponent=Me,te.StrictMode=x,te.Suspense=k,te.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Q,te.act=F,te.cloneElement=function(h,E,q){if(h==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+h+".");var Z=ne({},h.props),le=h.key,ae=h.ref,ge=h._owner;if(E!=null){if(E.ref!==void 0&&(ae=E.ref,ge=ce.current),E.key!==void 0&&(le=""+E.key),h.type&&h.type.defaultProps)var oe=h.type.defaultProps;for(pe in E)Y.call(E,pe)&&!ze.hasOwnProperty(pe)&&(Z[pe]=E[pe]===void 0&&oe!==void 0?oe[pe]:E[pe])}var pe=arguments.length-2;if(pe===1)Z.children=q;else if(1<pe){oe=Array(pe);for(var Ve=0;Ve<pe;Ve++)oe[Ve]=arguments[Ve+2];Z.children=oe}return{$$typeof:s,type:h.type,key:le,ref:ae,props:Z,_owner:ge}},te.createContext=function(h){return h={$$typeof:T,_currentValue:h,_currentValue2:h,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},h.Provider={$$typeof:m,_context:h},h.Consumer=h},te.createElement=De,te.createFactory=function(h){var E=De.bind(null,h);return E.type=h,E},te.createRef=function(){return{current:null}},te.forwardRef=function(h){return{$$typeof:b,render:h}},te.isValidElement=pt,te.lazy=function(h){return{$$typeof:P,_payload:{_status:-1,_result:h},_init:Fe}},te.memo=function(h,E){return{$$typeof:z,type:h,compare:E===void 0?null:E}},te.startTransition=function(h){var E=O.transition;O.transition={};try{h()}finally{O.transition=E}},te.unstable_act=F,te.useCallback=function(h,E){return ve.current.useCallback(h,E)},te.useContext=function(h){return ve.current.useContext(h)},te.useDebugValue=function(){},te.useDeferredValue=function(h){return ve.current.useDeferredValue(h)},te.useEffect=function(h,E){return ve.current.useEffect(h,E)},te.useId=function(){return ve.current.useId()},te.useImperativeHandle=function(h,E,q){return ve.current.useImperativeHandle(h,E,q)},te.useInsertionEffect=function(h,E){return ve.current.useInsertionEffect(h,E)},te.useLayoutEffect=function(h,E){return ve.current.useLayoutEffect(h,E)},te.useMemo=function(h,E){return ve.current.useMemo(h,E)},te.useReducer=function(h,E,q){return ve.current.useReducer(h,E,q)},te.useRef=function(h){return ve.current.useRef(h)},te.useState=function(h){return ve.current.useState(h)},te.useSyncExternalStore=function(h,E,q){return ve.current.useSyncExternalStore(h,E,q)},te.useTransition=function(){return ve.current.useTransition()},te.version="18.3.1",te}var Au;function fi(){return Au||(Au=1,ai.exports=tp()),ai.exports}/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Uu;function np(){if(Uu)return il;Uu=1;var s=fi(),u=Symbol.for("react.element"),i=Symbol.for("react.fragment"),x=Object.prototype.hasOwnProperty,g=s.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,m={key:!0,ref:!0,__self:!0,__source:!0};function T(b,k,z){var P,S={},U=null,de=null;z!==void 0&&(U=""+z),k.key!==void 0&&(U=""+k.key),k.ref!==void 0&&(de=k.ref);for(P in k)x.call(k,P)&&!m.hasOwnProperty(P)&&(S[P]=k[P]);if(b&&b.defaultProps)for(P in k=b.defaultProps,k)S[P]===void 0&&(S[P]=k[P]);return{$$typeof:u,type:b,key:U,ref:de,props:S,_owner:g.current}}return il.Fragment=i,il.jsx=T,il.jsxs=T,il}var Bu;function rp(){return Bu||(Bu=1,li.exports=np()),li.exports}var d=rp(),M=fi(),_a={},oi={exports:{}},lt={},ii={exports:{}},si={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Vu;function lp(){return Vu||(Vu=1,(function(s){function u(O,Q){var F=O.length;O.push(Q);e:for(;0<F;){var h=F-1>>>1,E=O[h];if(0<g(E,Q))O[h]=Q,O[F]=E,F=h;else break e}}function i(O){return O.length===0?null:O[0]}function x(O){if(O.length===0)return null;var Q=O[0],F=O.pop();if(F!==Q){O[0]=F;e:for(var h=0,E=O.length,q=E>>>1;h<q;){var Z=2*(h+1)-1,le=O[Z],ae=Z+1,ge=O[ae];if(0>g(le,F))ae<E&&0>g(ge,le)?(O[h]=ge,O[ae]=F,h=ae):(O[h]=le,O[Z]=F,h=Z);else if(ae<E&&0>g(ge,F))O[h]=ge,O[ae]=F,h=ae;else break e}}return Q}function g(O,Q){var F=O.sortIndex-Q.sortIndex;return F!==0?F:O.id-Q.id}if(typeof performance=="object"&&typeof performance.now=="function"){var m=performance;s.unstable_now=function(){return m.now()}}else{var T=Date,b=T.now();s.unstable_now=function(){return T.now()-b}}var k=[],z=[],P=1,S=null,U=3,de=!1,ne=!1,ee=!1,re=typeof setTimeout=="function"?setTimeout:null,D=typeof clearTimeout=="function"?clearTimeout:null,Me=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function je(O){for(var Q=i(z);Q!==null;){if(Q.callback===null)x(z);else if(Q.startTime<=O)x(z),Q.sortIndex=Q.expirationTime,u(k,Q);else break;Q=i(z)}}function we(O){if(ee=!1,je(O),!ne)if(i(k)!==null)ne=!0,Fe(Y);else{var Q=i(z);Q!==null&&ve(we,Q.startTime-O)}}function Y(O,Q){ne=!1,ee&&(ee=!1,D(De),De=-1),de=!0;var F=U;try{for(je(Q),S=i(k);S!==null&&(!(S.expirationTime>Q)||O&&!Mt());){var h=S.callback;if(typeof h=="function"){S.callback=null,U=S.priorityLevel;var E=h(S.expirationTime<=Q);Q=s.unstable_now(),typeof E=="function"?S.callback=E:S===i(k)&&x(k),je(Q)}else x(k);S=i(k)}if(S!==null)var q=!0;else{var Z=i(z);Z!==null&&ve(we,Z.startTime-Q),q=!1}return q}finally{S=null,U=F,de=!1}}var ce=!1,ze=null,De=-1,St=5,pt=-1;function Mt(){return!(s.unstable_now()-pt<St)}function at(){if(ze!==null){var O=s.unstable_now();pt=O;var Q=!0;try{Q=ze(!0,O)}finally{Q?Ye():(ce=!1,ze=null)}}else ce=!1}var Ye;if(typeof Me=="function")Ye=function(){Me(at)};else if(typeof MessageChannel<"u"){var ot=new MessageChannel,ft=ot.port2;ot.port1.onmessage=at,Ye=function(){ft.postMessage(null)}}else Ye=function(){re(at,0)};function Fe(O){ze=O,ce||(ce=!0,Ye())}function ve(O,Q){De=re(function(){O(s.unstable_now())},Q)}s.unstable_IdlePriority=5,s.unstable_ImmediatePriority=1,s.unstable_LowPriority=4,s.unstable_NormalPriority=3,s.unstable_Profiling=null,s.unstable_UserBlockingPriority=2,s.unstable_cancelCallback=function(O){O.callback=null},s.unstable_continueExecution=function(){ne||de||(ne=!0,Fe(Y))},s.unstable_forceFrameRate=function(O){0>O||125<O?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):St=0<O?Math.floor(1e3/O):5},s.unstable_getCurrentPriorityLevel=function(){return U},s.unstable_getFirstCallbackNode=function(){return i(k)},s.unstable_next=function(O){switch(U){case 1:case 2:case 3:var Q=3;break;default:Q=U}var F=U;U=Q;try{return O()}finally{U=F}},s.unstable_pauseExecution=function(){},s.unstable_requestPaint=function(){},s.unstable_runWithPriority=function(O,Q){switch(O){case 1:case 2:case 3:case 4:case 5:break;default:O=3}var F=U;U=O;try{return Q()}finally{U=F}},s.unstable_scheduleCallback=function(O,Q,F){var h=s.unstable_now();switch(typeof F=="object"&&F!==null?(F=F.delay,F=typeof F=="number"&&0<F?h+F:h):F=h,O){case 1:var E=-1;break;case 2:E=250;break;case 5:E=1073741823;break;case 4:E=1e4;break;default:E=5e3}return E=F+E,O={id:P++,callback:Q,priorityLevel:O,startTime:F,expirationTime:E,sortIndex:-1},F>h?(O.sortIndex=F,u(z,O),i(k)===null&&O===i(z)&&(ee?(D(De),De=-1):ee=!0,ve(we,F-h))):(O.sortIndex=E,u(k,O),ne||de||(ne=!0,Fe(Y))),O},s.unstable_shouldYield=Mt,s.unstable_wrapCallback=function(O){var Q=U;return function(){var F=U;U=Q;try{return O.apply(this,arguments)}finally{U=F}}}})(si)),si}var Hu;function ap(){return Hu||(Hu=1,ii.exports=lp()),ii.exports}/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Wu;function op(){if(Wu)return lt;Wu=1;var s=fi(),u=ap();function i(e){for(var t="https://reactjs.org/docs/error-decoder.html?invariant="+e,n=1;n<arguments.length;n++)t+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var x=new Set,g={};function m(e,t){T(e,t),T(e+"Capture",t)}function T(e,t){for(g[e]=t,e=0;e<t.length;e++)x.add(t[e])}var b=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),k=Object.prototype.hasOwnProperty,z=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,P={},S={};function U(e){return k.call(S,e)?!0:k.call(P,e)?!1:z.test(e)?S[e]=!0:(P[e]=!0,!1)}function de(e,t,n,r){if(n!==null&&n.type===0)return!1;switch(typeof t){case"function":case"symbol":return!0;case"boolean":return r?!1:n!==null?!n.acceptsBooleans:(e=e.toLowerCase().slice(0,5),e!=="data-"&&e!=="aria-");default:return!1}}function ne(e,t,n,r){if(t===null||typeof t>"u"||de(e,t,n,r))return!0;if(r)return!1;if(n!==null)switch(n.type){case 3:return!t;case 4:return t===!1;case 5:return isNaN(t);case 6:return isNaN(t)||1>t}return!1}function ee(e,t,n,r,l,a,o){this.acceptsBooleans=t===2||t===3||t===4,this.attributeName=r,this.attributeNamespace=l,this.mustUseProperty=n,this.propertyName=e,this.type=t,this.sanitizeURL=a,this.removeEmptyString=o}var re={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e){re[e]=new ee(e,0,!1,e,null,!1,!1)}),[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(e){var t=e[0];re[t]=new ee(t,1,!1,e[1],null,!1,!1)}),["contentEditable","draggable","spellCheck","value"].forEach(function(e){re[e]=new ee(e,2,!1,e.toLowerCase(),null,!1,!1)}),["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(e){re[e]=new ee(e,2,!1,e,null,!1,!1)}),"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e){re[e]=new ee(e,3,!1,e.toLowerCase(),null,!1,!1)}),["checked","multiple","muted","selected"].forEach(function(e){re[e]=new ee(e,3,!0,e,null,!1,!1)}),["capture","download"].forEach(function(e){re[e]=new ee(e,4,!1,e,null,!1,!1)}),["cols","rows","size","span"].forEach(function(e){re[e]=new ee(e,6,!1,e,null,!1,!1)}),["rowSpan","start"].forEach(function(e){re[e]=new ee(e,5,!1,e.toLowerCase(),null,!1,!1)});var D=/[\-:]([a-z])/g;function Me(e){return e[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e){var t=e.replace(D,Me);re[t]=new ee(t,1,!1,e,null,!1,!1)}),"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e){var t=e.replace(D,Me);re[t]=new ee(t,1,!1,e,"http://www.w3.org/1999/xlink",!1,!1)}),["xml:base","xml:lang","xml:space"].forEach(function(e){var t=e.replace(D,Me);re[t]=new ee(t,1,!1,e,"http://www.w3.org/XML/1998/namespace",!1,!1)}),["tabIndex","crossOrigin"].forEach(function(e){re[e]=new ee(e,1,!1,e.toLowerCase(),null,!1,!1)}),re.xlinkHref=new ee("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1),["src","href","action","formAction"].forEach(function(e){re[e]=new ee(e,1,!1,e.toLowerCase(),null,!0,!0)});function je(e,t,n,r){var l=re.hasOwnProperty(t)?re[t]:null;(l!==null?l.type!==0:r||!(2<t.length)||t[0]!=="o"&&t[0]!=="O"||t[1]!=="n"&&t[1]!=="N")&&(ne(t,n,l,r)&&(n=null),r||l===null?U(t)&&(n===null?e.removeAttribute(t):e.setAttribute(t,""+n)):l.mustUseProperty?e[l.propertyName]=n===null?l.type===3?!1:"":n:(t=l.attributeName,r=l.attributeNamespace,n===null?e.removeAttribute(t):(l=l.type,n=l===3||l===4&&n===!0?"":""+n,r?e.setAttributeNS(r,t,n):e.setAttribute(t,n))))}var we=s.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,Y=Symbol.for("react.element"),ce=Symbol.for("react.portal"),ze=Symbol.for("react.fragment"),De=Symbol.for("react.strict_mode"),St=Symbol.for("react.profiler"),pt=Symbol.for("react.provider"),Mt=Symbol.for("react.context"),at=Symbol.for("react.forward_ref"),Ye=Symbol.for("react.suspense"),ot=Symbol.for("react.suspense_list"),ft=Symbol.for("react.memo"),Fe=Symbol.for("react.lazy"),ve=Symbol.for("react.offscreen"),O=Symbol.iterator;function Q(e){return e===null||typeof e!="object"?null:(e=O&&e[O]||e["@@iterator"],typeof e=="function"?e:null)}var F=Object.assign,h;function E(e){if(h===void 0)try{throw Error()}catch(n){var t=n.stack.trim().match(/\n( *(at )?)/);h=t&&t[1]||""}return`
`+h+e}var q=!1;function Z(e,t){if(!e||q)return"";q=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(t)if(t=function(){throw Error()},Object.defineProperty(t.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(t,[])}catch(w){var r=w}Reflect.construct(e,[],t)}else{try{t.call()}catch(w){r=w}e.call(t.prototype)}else{try{throw Error()}catch(w){r=w}e()}}catch(w){if(w&&r&&typeof w.stack=="string"){for(var l=w.stack.split(`
`),a=r.stack.split(`
`),o=l.length-1,c=a.length-1;1<=o&&0<=c&&l[o]!==a[c];)c--;for(;1<=o&&0<=c;o--,c--)if(l[o]!==a[c]){if(o!==1||c!==1)do if(o--,c--,0>c||l[o]!==a[c]){var p=`
`+l[o].replace(" at new "," at ");return e.displayName&&p.includes("<anonymous>")&&(p=p.replace("<anonymous>",e.displayName)),p}while(1<=o&&0<=c);break}}}finally{q=!1,Error.prepareStackTrace=n}return(e=e?e.displayName||e.name:"")?E(e):""}function le(e){switch(e.tag){case 5:return E(e.type);case 16:return E("Lazy");case 13:return E("Suspense");case 19:return E("SuspenseList");case 0:case 2:case 15:return e=Z(e.type,!1),e;case 11:return e=Z(e.type.render,!1),e;case 1:return e=Z(e.type,!0),e;default:return""}}function ae(e){if(e==null)return null;if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case ze:return"Fragment";case ce:return"Portal";case St:return"Profiler";case De:return"StrictMode";case Ye:return"Suspense";case ot:return"SuspenseList"}if(typeof e=="object")switch(e.$$typeof){case Mt:return(e.displayName||"Context")+".Consumer";case pt:return(e._context.displayName||"Context")+".Provider";case at:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case ft:return t=e.displayName||null,t!==null?t:ae(e.type)||"Memo";case Fe:t=e._payload,e=e._init;try{return ae(e(t))}catch{}}return null}function ge(e){var t=e.type;switch(e.tag){case 24:return"Cache";case 9:return(t.displayName||"Context")+".Consumer";case 10:return(t._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return e=t.render,e=e.displayName||e.name||"",t.displayName||(e!==""?"ForwardRef("+e+")":"ForwardRef");case 7:return"Fragment";case 5:return t;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return ae(t);case 8:return t===De?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t}return null}function oe(e){switch(typeof e){case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function pe(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function Ve(e){var t=pe(e)?"checked":"value",n=Object.getOwnPropertyDescriptor(e.constructor.prototype,t),r=""+e[t];if(!e.hasOwnProperty(t)&&typeof n<"u"&&typeof n.get=="function"&&typeof n.set=="function"){var l=n.get,a=n.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return l.call(this)},set:function(o){r=""+o,a.call(this,o)}}),Object.defineProperty(e,t,{enumerable:n.enumerable}),{getValue:function(){return r},setValue:function(o){r=""+o},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function gt(e){e._valueTracker||(e._valueTracker=Ve(e))}function qe(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),r="";return e&&(r=pe(e)?e.checked?"true":"false":e.value),e=r,e!==n?(t.setValue(e),!0):!1}function Hn(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}function Lt(e,t){var n=t.checked;return F({},t,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:n??e._wrapperState.initialChecked})}function Wn(e,t){var n=t.defaultValue==null?"":t.defaultValue,r=t.checked!=null?t.checked:t.defaultChecked;n=oe(t.value!=null?t.value:n),e._wrapperState={initialChecked:r,initialValue:n,controlled:t.type==="checkbox"||t.type==="radio"?t.checked!=null:t.value!=null}}function Rt(e,t){t=t.checked,t!=null&&je(e,"checked",t,!1)}function Dt(e,t){Rt(e,t);var n=oe(t.value),r=t.type;if(n!=null)r==="number"?(n===0&&e.value===""||e.value!=n)&&(e.value=""+n):e.value!==""+n&&(e.value=""+n);else if(r==="submit"||r==="reset"){e.removeAttribute("value");return}t.hasOwnProperty("value")?_r(e,t.type,n):t.hasOwnProperty("defaultValue")&&_r(e,t.type,oe(t.defaultValue)),t.checked==null&&t.defaultChecked!=null&&(e.defaultChecked=!!t.defaultChecked)}function Nn(e,t,n){if(t.hasOwnProperty("value")||t.hasOwnProperty("defaultValue")){var r=t.type;if(!(r!=="submit"&&r!=="reset"||t.value!==void 0&&t.value!==null))return;t=""+e._wrapperState.initialValue,n||t===e.value||(e.value=t),e.defaultValue=t}n=e.name,n!==""&&(e.name=""),e.defaultChecked=!!e._wrapperState.initialChecked,n!==""&&(e.name=n)}function _r(e,t,n){(t!=="number"||Hn(e.ownerDocument)!==e)&&(n==null?e.defaultValue=""+e._wrapperState.initialValue:e.defaultValue!==""+n&&(e.defaultValue=""+n))}var en=Array.isArray;function Ae(e,t,n,r){if(e=e.options,t){t={};for(var l=0;l<n.length;l++)t["$"+n[l]]=!0;for(n=0;n<e.length;n++)l=t.hasOwnProperty("$"+e[n].value),e[n].selected!==l&&(e[n].selected=l),l&&r&&(e[n].defaultSelected=!0)}else{for(n=""+oe(n),t=null,l=0;l<e.length;l++){if(e[l].value===n){e[l].selected=!0,r&&(e[l].defaultSelected=!0);return}t!==null||e[l].disabled||(t=e[l])}t!==null&&(t.selected=!0)}}function tn(e,t){if(t.dangerouslySetInnerHTML!=null)throw Error(i(91));return F({},t,{value:void 0,defaultValue:void 0,children:""+e._wrapperState.initialValue})}function Ht(e,t){var n=t.value;if(n==null){if(n=t.children,t=t.defaultValue,n!=null){if(t!=null)throw Error(i(92));if(en(n)){if(1<n.length)throw Error(i(93));n=n[0]}t=n}t==null&&(t=""),n=t}e._wrapperState={initialValue:oe(n)}}function Kn(e,t){var n=oe(t.value),r=oe(t.defaultValue);n!=null&&(n=""+n,n!==e.value&&(e.value=n),t.defaultValue==null&&e.defaultValue!==n&&(e.defaultValue=n)),r!=null&&(e.defaultValue=""+r)}function it(e){var t=e.textContent;t===e._wrapperState.initialValue&&t!==""&&t!==null&&(e.value=t)}function Qn(e){switch(e){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function Yn(e,t){return e==null||e==="http://www.w3.org/1999/xhtml"?Qn(t):e==="http://www.w3.org/2000/svg"&&t==="foreignObject"?"http://www.w3.org/1999/xhtml":e}var Ot,Wt=(function(e){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(t,n,r,l){MSApp.execUnsafeLocalFunction(function(){return e(t,n,r,l)})}:e})(function(e,t){if(e.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in e)e.innerHTML=t;else{for(Ot=Ot||document.createElement("div"),Ot.innerHTML="<svg>"+t.valueOf().toString()+"</svg>",t=Ot.firstChild;e.firstChild;)e.removeChild(e.firstChild);for(;t.firstChild;)e.appendChild(t.firstChild)}});function $t(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&n.nodeType===3){n.nodeValue=t;return}}e.textContent=t}var Xe={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},ul=["Webkit","ms","Moz","O"];Object.keys(Xe).forEach(function(e){ul.forEach(function(t){t=t+e.charAt(0).toUpperCase()+e.substring(1),Xe[t]=Xe[e]})});function cl(e,t,n){return t==null||typeof t=="boolean"||t===""?"":n||typeof t!="number"||t===0||Xe.hasOwnProperty(e)&&Xe[e]?(""+t).trim():t+"px"}function wr(e,t){e=e.style;for(var n in t)if(t.hasOwnProperty(n)){var r=n.indexOf("--")===0,l=cl(n,t[n],r);n==="float"&&(n="cssFloat"),r?e.setProperty(n,l):e[n]=l}}var dl=F({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function Tn(e,t){if(t){if(dl[e]&&(t.children!=null||t.dangerouslySetInnerHTML!=null))throw Error(i(137,e));if(t.dangerouslySetInnerHTML!=null){if(t.children!=null)throw Error(i(60));if(typeof t.dangerouslySetInnerHTML!="object"||!("__html"in t.dangerouslySetInnerHTML))throw Error(i(61))}if(t.style!=null&&typeof t.style!="object")throw Error(i(62))}}function Jn(e,t){if(e.indexOf("-")===-1)return typeof t.is=="string";switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var bt=null;function nn(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var kr=null,rn=null,ln=null;function Sr(e){if(e=Kr(e)){if(typeof kr!="function")throw Error(i(280));var t=e.stateNode;t&&(t=Dl(t),kr(e.stateNode,e.type,t))}}function br(e){rn?ln?ln.push(e):ln=[e]:rn=e}function pl(){if(rn){var e=rn,t=ln;if(ln=rn=null,Sr(e),t)for(e=0;e<t.length;e++)Sr(t[e])}}function Er(e,t){return e(t)}function jn(){}var Cr=!1;function fl(e,t,n){if(Cr)return e(t,n);Cr=!0;try{return Er(e,t,n)}finally{Cr=!1,(rn!==null||ln!==null)&&(jn(),pl())}}function an(e,t){var n=e.stateNode;if(n===null)return null;var r=Dl(n);if(r===null)return null;n=r[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(r=!r.disabled)||(e=e.type,r=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!r;break e;default:e=!1}if(e)return null;if(n&&typeof n!="function")throw Error(i(231,t,typeof n));return n}var Nr=!1;if(b)try{var It={};Object.defineProperty(It,"passive",{get:function(){Nr=!0}}),window.addEventListener("test",It,It),window.removeEventListener("test",It,It)}catch{Nr=!1}function ka(e,t,n,r,l,a,o,c,p){var w=Array.prototype.slice.call(arguments,3);try{t.apply(n,w)}catch(N){this.onError(N)}}var zn=!1,Gn=null,Pn=!1,qn=null,gl={onError:function(e){zn=!0,Gn=e}};function _(e,t,n,r,l,a,o,c,p){zn=!1,Gn=null,ka.apply(gl,arguments)}function R(e,t,n,r,l,a,o,c,p){if(_.apply(this,arguments),zn){if(zn){var w=Gn;zn=!1,Gn=null}else throw Error(i(198));Pn||(Pn=!0,qn=w)}}function $(e){var t=e,n=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,(t.flags&4098)!==0&&(n=t.return),e=t.return;while(e)}return t.tag===3?n:null}function X(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function ie(e){if($(e)!==e)throw Error(i(188))}function G(e){var t=e.alternate;if(!t){if(t=$(e),t===null)throw Error(i(188));return t!==e?null:e}for(var n=e,r=t;;){var l=n.return;if(l===null)break;var a=l.alternate;if(a===null){if(r=l.return,r!==null){n=r;continue}break}if(l.child===a.child){for(a=l.child;a;){if(a===n)return ie(l),e;if(a===r)return ie(l),t;a=a.sibling}throw Error(i(188))}if(n.return!==r.return)n=l,r=a;else{for(var o=!1,c=l.child;c;){if(c===n){o=!0,n=l,r=a;break}if(c===r){o=!0,r=l,n=a;break}c=c.sibling}if(!o){for(c=a.child;c;){if(c===n){o=!0,n=a,r=l;break}if(c===r){o=!0,r=a,n=l;break}c=c.sibling}if(!o)throw Error(i(189))}}if(n.alternate!==r)throw Error(i(190))}if(n.tag!==3)throw Error(i(188));return n.stateNode.current===n?e:t}function me(e){return e=G(e),e!==null?he(e):null}function he(e){if(e.tag===5||e.tag===6)return e;for(e=e.child;e!==null;){var t=he(e);if(t!==null)return t;e=e.sibling}return null}var ke=u.unstable_scheduleCallback,mt=u.unstable_cancelCallback,pc=u.unstable_shouldYield,fc=u.unstable_requestPaint,Ne=u.unstable_now,gc=u.unstable_getCurrentPriorityLevel,Sa=u.unstable_ImmediatePriority,gi=u.unstable_UserBlockingPriority,ml=u.unstable_NormalPriority,mc=u.unstable_LowPriority,mi=u.unstable_IdlePriority,hl=null,Ft=null;function hc(e){if(Ft&&typeof Ft.onCommitFiberRoot=="function")try{Ft.onCommitFiberRoot(hl,e,void 0,(e.current.flags&128)===128)}catch{}}var Et=Math.clz32?Math.clz32:yc,xc=Math.log,vc=Math.LN2;function yc(e){return e>>>=0,e===0?32:31-(xc(e)/vc|0)|0}var xl=64,vl=4194304;function Tr(e){switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return e&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return e}}function yl(e,t){var n=e.pendingLanes;if(n===0)return 0;var r=0,l=e.suspendedLanes,a=e.pingedLanes,o=n&268435455;if(o!==0){var c=o&~l;c!==0?r=Tr(c):(a&=o,a!==0&&(r=Tr(a)))}else o=n&~l,o!==0?r=Tr(o):a!==0&&(r=Tr(a));if(r===0)return 0;if(t!==0&&t!==r&&(t&l)===0&&(l=r&-r,a=t&-t,l>=a||l===16&&(a&4194240)!==0))return t;if((r&4)!==0&&(r|=n&16),t=e.entangledLanes,t!==0)for(e=e.entanglements,t&=r;0<t;)n=31-Et(t),l=1<<n,r|=e[n],t&=~l;return r}function _c(e,t){switch(e){case 1:case 2:case 4:return t+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function wc(e,t){for(var n=e.suspendedLanes,r=e.pingedLanes,l=e.expirationTimes,a=e.pendingLanes;0<a;){var o=31-Et(a),c=1<<o,p=l[o];p===-1?((c&n)===0||(c&r)!==0)&&(l[o]=_c(c,t)):p<=t&&(e.expiredLanes|=c),a&=~c}}function ba(e){return e=e.pendingLanes&-1073741825,e!==0?e:e&1073741824?1073741824:0}function hi(){var e=xl;return xl<<=1,(xl&4194240)===0&&(xl=64),e}function Ea(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function jr(e,t,n){e.pendingLanes|=t,t!==536870912&&(e.suspendedLanes=0,e.pingedLanes=0),e=e.eventTimes,t=31-Et(t),e[t]=n}function kc(e,t){var n=e.pendingLanes&~t;e.pendingLanes=t,e.suspendedLanes=0,e.pingedLanes=0,e.expiredLanes&=t,e.mutableReadLanes&=t,e.entangledLanes&=t,t=e.entanglements;var r=e.eventTimes;for(e=e.expirationTimes;0<n;){var l=31-Et(n),a=1<<l;t[l]=0,r[l]=-1,e[l]=-1,n&=~a}}function Ca(e,t){var n=e.entangledLanes|=t;for(e=e.entanglements;n;){var r=31-Et(n),l=1<<r;l&t|e[r]&t&&(e[r]|=t),n&=~l}}var fe=0;function xi(e){return e&=-e,1<e?4<e?(e&268435455)!==0?16:536870912:4:1}var vi,Na,yi,_i,wi,Ta=!1,_l=[],on=null,sn=null,un=null,zr=new Map,Pr=new Map,cn=[],Sc="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function ki(e,t){switch(e){case"focusin":case"focusout":on=null;break;case"dragenter":case"dragleave":sn=null;break;case"mouseover":case"mouseout":un=null;break;case"pointerover":case"pointerout":zr.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":Pr.delete(t.pointerId)}}function Mr(e,t,n,r,l,a){return e===null||e.nativeEvent!==a?(e={blockedOn:t,domEventName:n,eventSystemFlags:r,nativeEvent:a,targetContainers:[l]},t!==null&&(t=Kr(t),t!==null&&Na(t)),e):(e.eventSystemFlags|=r,t=e.targetContainers,l!==null&&t.indexOf(l)===-1&&t.push(l),e)}function bc(e,t,n,r,l){switch(t){case"focusin":return on=Mr(on,e,t,n,r,l),!0;case"dragenter":return sn=Mr(sn,e,t,n,r,l),!0;case"mouseover":return un=Mr(un,e,t,n,r,l),!0;case"pointerover":var a=l.pointerId;return zr.set(a,Mr(zr.get(a)||null,e,t,n,r,l)),!0;case"gotpointercapture":return a=l.pointerId,Pr.set(a,Mr(Pr.get(a)||null,e,t,n,r,l)),!0}return!1}function Si(e){var t=Mn(e.target);if(t!==null){var n=$(t);if(n!==null){if(t=n.tag,t===13){if(t=X(n),t!==null){e.blockedOn=t,wi(e.priority,function(){yi(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}e.blockedOn=null}function wl(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var n=za(e.domEventName,e.eventSystemFlags,t[0],e.nativeEvent);if(n===null){n=e.nativeEvent;var r=new n.constructor(n.type,n);bt=r,n.target.dispatchEvent(r),bt=null}else return t=Kr(n),t!==null&&Na(t),e.blockedOn=n,!1;t.shift()}return!0}function bi(e,t,n){wl(e)&&n.delete(t)}function Ec(){Ta=!1,on!==null&&wl(on)&&(on=null),sn!==null&&wl(sn)&&(sn=null),un!==null&&wl(un)&&(un=null),zr.forEach(bi),Pr.forEach(bi)}function Lr(e,t){e.blockedOn===t&&(e.blockedOn=null,Ta||(Ta=!0,u.unstable_scheduleCallback(u.unstable_NormalPriority,Ec)))}function Rr(e){function t(l){return Lr(l,e)}if(0<_l.length){Lr(_l[0],e);for(var n=1;n<_l.length;n++){var r=_l[n];r.blockedOn===e&&(r.blockedOn=null)}}for(on!==null&&Lr(on,e),sn!==null&&Lr(sn,e),un!==null&&Lr(un,e),zr.forEach(t),Pr.forEach(t),n=0;n<cn.length;n++)r=cn[n],r.blockedOn===e&&(r.blockedOn=null);for(;0<cn.length&&(n=cn[0],n.blockedOn===null);)Si(n),n.blockedOn===null&&cn.shift()}var Xn=we.ReactCurrentBatchConfig,kl=!0;function Cc(e,t,n,r){var l=fe,a=Xn.transition;Xn.transition=null;try{fe=1,ja(e,t,n,r)}finally{fe=l,Xn.transition=a}}function Nc(e,t,n,r){var l=fe,a=Xn.transition;Xn.transition=null;try{fe=4,ja(e,t,n,r)}finally{fe=l,Xn.transition=a}}function ja(e,t,n,r){if(kl){var l=za(e,t,n,r);if(l===null)Qa(e,t,r,Sl,n),ki(e,r);else if(bc(l,e,t,n,r))r.stopPropagation();else if(ki(e,r),t&4&&-1<Sc.indexOf(e)){for(;l!==null;){var a=Kr(l);if(a!==null&&vi(a),a=za(e,t,n,r),a===null&&Qa(e,t,r,Sl,n),a===l)break;l=a}l!==null&&r.stopPropagation()}else Qa(e,t,r,null,n)}}var Sl=null;function za(e,t,n,r){if(Sl=null,e=nn(r),e=Mn(e),e!==null)if(t=$(e),t===null)e=null;else if(n=t.tag,n===13){if(e=X(t),e!==null)return e;e=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null);return Sl=e,null}function Ei(e){switch(e){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(gc()){case Sa:return 1;case gi:return 4;case ml:case mc:return 16;case mi:return 536870912;default:return 16}default:return 16}}var dn=null,Pa=null,bl=null;function Ci(){if(bl)return bl;var e,t=Pa,n=t.length,r,l="value"in dn?dn.value:dn.textContent,a=l.length;for(e=0;e<n&&t[e]===l[e];e++);var o=n-e;for(r=1;r<=o&&t[n-r]===l[a-r];r++);return bl=l.slice(e,1<r?1-r:void 0)}function El(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function Cl(){return!0}function Ni(){return!1}function st(e){function t(n,r,l,a,o){this._reactName=n,this._targetInst=l,this.type=r,this.nativeEvent=a,this.target=o,this.currentTarget=null;for(var c in e)e.hasOwnProperty(c)&&(n=e[c],this[c]=n?n(a):a[c]);return this.isDefaultPrevented=(a.defaultPrevented!=null?a.defaultPrevented:a.returnValue===!1)?Cl:Ni,this.isPropagationStopped=Ni,this}return F(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=Cl)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=Cl)},persist:function(){},isPersistent:Cl}),t}var Zn={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Ma=st(Zn),Dr=F({},Zn,{view:0,detail:0}),Tc=st(Dr),La,Ra,Or,Nl=F({},Dr,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Oa,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==Or&&(Or&&e.type==="mousemove"?(La=e.screenX-Or.screenX,Ra=e.screenY-Or.screenY):Ra=La=0,Or=e),La)},movementY:function(e){return"movementY"in e?e.movementY:Ra}}),Ti=st(Nl),jc=F({},Nl,{dataTransfer:0}),zc=st(jc),Pc=F({},Dr,{relatedTarget:0}),Da=st(Pc),Mc=F({},Zn,{animationName:0,elapsedTime:0,pseudoElement:0}),Lc=st(Mc),Rc=F({},Zn,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),Dc=st(Rc),Oc=F({},Zn,{data:0}),ji=st(Oc),$c={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Ic={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Fc={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Ac(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=Fc[e])?!!t[e]:!1}function Oa(){return Ac}var Uc=F({},Dr,{key:function(e){if(e.key){var t=$c[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=El(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?Ic[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Oa,charCode:function(e){return e.type==="keypress"?El(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?El(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),Bc=st(Uc),Vc=F({},Nl,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),zi=st(Vc),Hc=F({},Dr,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Oa}),Wc=st(Hc),Kc=F({},Zn,{propertyName:0,elapsedTime:0,pseudoElement:0}),Qc=st(Kc),Yc=F({},Nl,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),Jc=st(Yc),Gc=[9,13,27,32],$a=b&&"CompositionEvent"in window,$r=null;b&&"documentMode"in document&&($r=document.documentMode);var qc=b&&"TextEvent"in window&&!$r,Pi=b&&(!$a||$r&&8<$r&&11>=$r),Mi=" ",Li=!1;function Ri(e,t){switch(e){case"keyup":return Gc.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Di(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var er=!1;function Xc(e,t){switch(e){case"compositionend":return Di(t);case"keypress":return t.which!==32?null:(Li=!0,Mi);case"textInput":return e=t.data,e===Mi&&Li?null:e;default:return null}}function Zc(e,t){if(er)return e==="compositionend"||!$a&&Ri(e,t)?(e=Ci(),bl=Pa=dn=null,er=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return Pi&&t.locale!=="ko"?null:t.data;default:return null}}var ed={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Oi(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!ed[e.type]:t==="textarea"}function $i(e,t,n,r){br(r),t=Ml(t,"onChange"),0<t.length&&(n=new Ma("onChange","change",null,n,r),e.push({event:n,listeners:t}))}var Ir=null,Fr=null;function td(e){ts(e,0)}function Tl(e){var t=ar(e);if(qe(t))return e}function nd(e,t){if(e==="change")return t}var Ii=!1;if(b){var Ia;if(b){var Fa="oninput"in document;if(!Fa){var Fi=document.createElement("div");Fi.setAttribute("oninput","return;"),Fa=typeof Fi.oninput=="function"}Ia=Fa}else Ia=!1;Ii=Ia&&(!document.documentMode||9<document.documentMode)}function Ai(){Ir&&(Ir.detachEvent("onpropertychange",Ui),Fr=Ir=null)}function Ui(e){if(e.propertyName==="value"&&Tl(Fr)){var t=[];$i(t,Fr,e,nn(e)),fl(td,t)}}function rd(e,t,n){e==="focusin"?(Ai(),Ir=t,Fr=n,Ir.attachEvent("onpropertychange",Ui)):e==="focusout"&&Ai()}function ld(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return Tl(Fr)}function ad(e,t){if(e==="click")return Tl(t)}function od(e,t){if(e==="input"||e==="change")return Tl(t)}function id(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var Ct=typeof Object.is=="function"?Object.is:id;function Ar(e,t){if(Ct(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var n=Object.keys(e),r=Object.keys(t);if(n.length!==r.length)return!1;for(r=0;r<n.length;r++){var l=n[r];if(!k.call(t,l)||!Ct(e[l],t[l]))return!1}return!0}function Bi(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function Vi(e,t){var n=Bi(e);e=0;for(var r;n;){if(n.nodeType===3){if(r=e+n.textContent.length,e<=t&&r>=t)return{node:n,offset:t-e};e=r}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=Bi(n)}}function Hi(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?Hi(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function Wi(){for(var e=window,t=Hn();t instanceof e.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href=="string"}catch{n=!1}if(n)e=t.contentWindow;else break;t=Hn(e.document)}return t}function Aa(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}function sd(e){var t=Wi(),n=e.focusedElem,r=e.selectionRange;if(t!==n&&n&&n.ownerDocument&&Hi(n.ownerDocument.documentElement,n)){if(r!==null&&Aa(n)){if(t=r.start,e=r.end,e===void 0&&(e=t),"selectionStart"in n)n.selectionStart=t,n.selectionEnd=Math.min(e,n.value.length);else if(e=(t=n.ownerDocument||document)&&t.defaultView||window,e.getSelection){e=e.getSelection();var l=n.textContent.length,a=Math.min(r.start,l);r=r.end===void 0?a:Math.min(r.end,l),!e.extend&&a>r&&(l=r,r=a,a=l),l=Vi(n,a);var o=Vi(n,r);l&&o&&(e.rangeCount!==1||e.anchorNode!==l.node||e.anchorOffset!==l.offset||e.focusNode!==o.node||e.focusOffset!==o.offset)&&(t=t.createRange(),t.setStart(l.node,l.offset),e.removeAllRanges(),a>r?(e.addRange(t),e.extend(o.node,o.offset)):(t.setEnd(o.node,o.offset),e.addRange(t)))}}for(t=[],e=n;e=e.parentNode;)e.nodeType===1&&t.push({element:e,left:e.scrollLeft,top:e.scrollTop});for(typeof n.focus=="function"&&n.focus(),n=0;n<t.length;n++)e=t[n],e.element.scrollLeft=e.left,e.element.scrollTop=e.top}}var ud=b&&"documentMode"in document&&11>=document.documentMode,tr=null,Ua=null,Ur=null,Ba=!1;function Ki(e,t,n){var r=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;Ba||tr==null||tr!==Hn(r)||(r=tr,"selectionStart"in r&&Aa(r)?r={start:r.selectionStart,end:r.selectionEnd}:(r=(r.ownerDocument&&r.ownerDocument.defaultView||window).getSelection(),r={anchorNode:r.anchorNode,anchorOffset:r.anchorOffset,focusNode:r.focusNode,focusOffset:r.focusOffset}),Ur&&Ar(Ur,r)||(Ur=r,r=Ml(Ua,"onSelect"),0<r.length&&(t=new Ma("onSelect","select",null,t,n),e.push({event:t,listeners:r}),t.target=tr)))}function jl(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n["Webkit"+e]="webkit"+t,n["Moz"+e]="moz"+t,n}var nr={animationend:jl("Animation","AnimationEnd"),animationiteration:jl("Animation","AnimationIteration"),animationstart:jl("Animation","AnimationStart"),transitionend:jl("Transition","TransitionEnd")},Va={},Qi={};b&&(Qi=document.createElement("div").style,"AnimationEvent"in window||(delete nr.animationend.animation,delete nr.animationiteration.animation,delete nr.animationstart.animation),"TransitionEvent"in window||delete nr.transitionend.transition);function zl(e){if(Va[e])return Va[e];if(!nr[e])return e;var t=nr[e],n;for(n in t)if(t.hasOwnProperty(n)&&n in Qi)return Va[e]=t[n];return e}var Yi=zl("animationend"),Ji=zl("animationiteration"),Gi=zl("animationstart"),qi=zl("transitionend"),Xi=new Map,Zi="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function pn(e,t){Xi.set(e,t),m(t,[e])}for(var Ha=0;Ha<Zi.length;Ha++){var Wa=Zi[Ha],cd=Wa.toLowerCase(),dd=Wa[0].toUpperCase()+Wa.slice(1);pn(cd,"on"+dd)}pn(Yi,"onAnimationEnd"),pn(Ji,"onAnimationIteration"),pn(Gi,"onAnimationStart"),pn("dblclick","onDoubleClick"),pn("focusin","onFocus"),pn("focusout","onBlur"),pn(qi,"onTransitionEnd"),T("onMouseEnter",["mouseout","mouseover"]),T("onMouseLeave",["mouseout","mouseover"]),T("onPointerEnter",["pointerout","pointerover"]),T("onPointerLeave",["pointerout","pointerover"]),m("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),m("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),m("onBeforeInput",["compositionend","keypress","textInput","paste"]),m("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),m("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),m("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Br="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),pd=new Set("cancel close invalid load scroll toggle".split(" ").concat(Br));function es(e,t,n){var r=e.type||"unknown-event";e.currentTarget=n,R(r,t,void 0,e),e.currentTarget=null}function ts(e,t){t=(t&4)!==0;for(var n=0;n<e.length;n++){var r=e[n],l=r.event;r=r.listeners;e:{var a=void 0;if(t)for(var o=r.length-1;0<=o;o--){var c=r[o],p=c.instance,w=c.currentTarget;if(c=c.listener,p!==a&&l.isPropagationStopped())break e;es(l,c,w),a=p}else for(o=0;o<r.length;o++){if(c=r[o],p=c.instance,w=c.currentTarget,c=c.listener,p!==a&&l.isPropagationStopped())break e;es(l,c,w),a=p}}}if(Pn)throw e=qn,Pn=!1,qn=null,e}function ye(e,t){var n=t[Za];n===void 0&&(n=t[Za]=new Set);var r=e+"__bubble";n.has(r)||(ns(t,e,2,!1),n.add(r))}function Ka(e,t,n){var r=0;t&&(r|=4),ns(n,e,r,t)}var Pl="_reactListening"+Math.random().toString(36).slice(2);function Vr(e){if(!e[Pl]){e[Pl]=!0,x.forEach(function(n){n!=="selectionchange"&&(pd.has(n)||Ka(n,!1,e),Ka(n,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[Pl]||(t[Pl]=!0,Ka("selectionchange",!1,t))}}function ns(e,t,n,r){switch(Ei(t)){case 1:var l=Cc;break;case 4:l=Nc;break;default:l=ja}n=l.bind(null,t,n,e),l=void 0,!Nr||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(l=!0),r?l!==void 0?e.addEventListener(t,n,{capture:!0,passive:l}):e.addEventListener(t,n,!0):l!==void 0?e.addEventListener(t,n,{passive:l}):e.addEventListener(t,n,!1)}function Qa(e,t,n,r,l){var a=r;if((t&1)===0&&(t&2)===0&&r!==null)e:for(;;){if(r===null)return;var o=r.tag;if(o===3||o===4){var c=r.stateNode.containerInfo;if(c===l||c.nodeType===8&&c.parentNode===l)break;if(o===4)for(o=r.return;o!==null;){var p=o.tag;if((p===3||p===4)&&(p=o.stateNode.containerInfo,p===l||p.nodeType===8&&p.parentNode===l))return;o=o.return}for(;c!==null;){if(o=Mn(c),o===null)return;if(p=o.tag,p===5||p===6){r=a=o;continue e}c=c.parentNode}}r=r.return}fl(function(){var w=a,N=nn(n),j=[];e:{var C=Xi.get(e);if(C!==void 0){var I=Ma,B=e;switch(e){case"keypress":if(El(n)===0)break e;case"keydown":case"keyup":I=Bc;break;case"focusin":B="focus",I=Da;break;case"focusout":B="blur",I=Da;break;case"beforeblur":case"afterblur":I=Da;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":I=Ti;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":I=zc;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":I=Wc;break;case Yi:case Ji:case Gi:I=Lc;break;case qi:I=Qc;break;case"scroll":I=Tc;break;case"wheel":I=Jc;break;case"copy":case"cut":case"paste":I=Dc;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":I=zi}var V=(t&4)!==0,Te=!V&&e==="scroll",v=V?C!==null?C+"Capture":null:C;V=[];for(var f=w,y;f!==null;){y=f;var L=y.stateNode;if(y.tag===5&&L!==null&&(y=L,v!==null&&(L=an(f,v),L!=null&&V.push(Hr(f,L,y)))),Te)break;f=f.return}0<V.length&&(C=new I(C,B,null,n,N),j.push({event:C,listeners:V}))}}if((t&7)===0){e:{if(C=e==="mouseover"||e==="pointerover",I=e==="mouseout"||e==="pointerout",C&&n!==bt&&(B=n.relatedTarget||n.fromElement)&&(Mn(B)||B[Kt]))break e;if((I||C)&&(C=N.window===N?N:(C=N.ownerDocument)?C.defaultView||C.parentWindow:window,I?(B=n.relatedTarget||n.toElement,I=w,B=B?Mn(B):null,B!==null&&(Te=$(B),B!==Te||B.tag!==5&&B.tag!==6)&&(B=null)):(I=null,B=w),I!==B)){if(V=Ti,L="onMouseLeave",v="onMouseEnter",f="mouse",(e==="pointerout"||e==="pointerover")&&(V=zi,L="onPointerLeave",v="onPointerEnter",f="pointer"),Te=I==null?C:ar(I),y=B==null?C:ar(B),C=new V(L,f+"leave",I,n,N),C.target=Te,C.relatedTarget=y,L=null,Mn(N)===w&&(V=new V(v,f+"enter",B,n,N),V.target=y,V.relatedTarget=Te,L=V),Te=L,I&&B)t:{for(V=I,v=B,f=0,y=V;y;y=rr(y))f++;for(y=0,L=v;L;L=rr(L))y++;for(;0<f-y;)V=rr(V),f--;for(;0<y-f;)v=rr(v),y--;for(;f--;){if(V===v||v!==null&&V===v.alternate)break t;V=rr(V),v=rr(v)}V=null}else V=null;I!==null&&rs(j,C,I,V,!1),B!==null&&Te!==null&&rs(j,Te,B,V,!0)}}e:{if(C=w?ar(w):window,I=C.nodeName&&C.nodeName.toLowerCase(),I==="select"||I==="input"&&C.type==="file")var H=nd;else if(Oi(C))if(Ii)H=od;else{H=ld;var W=rd}else(I=C.nodeName)&&I.toLowerCase()==="input"&&(C.type==="checkbox"||C.type==="radio")&&(H=ad);if(H&&(H=H(e,w))){$i(j,H,n,N);break e}W&&W(e,C,w),e==="focusout"&&(W=C._wrapperState)&&W.controlled&&C.type==="number"&&_r(C,"number",C.value)}switch(W=w?ar(w):window,e){case"focusin":(Oi(W)||W.contentEditable==="true")&&(tr=W,Ua=w,Ur=null);break;case"focusout":Ur=Ua=tr=null;break;case"mousedown":Ba=!0;break;case"contextmenu":case"mouseup":case"dragend":Ba=!1,Ki(j,n,N);break;case"selectionchange":if(ud)break;case"keydown":case"keyup":Ki(j,n,N)}var K;if($a)e:{switch(e){case"compositionstart":var J="onCompositionStart";break e;case"compositionend":J="onCompositionEnd";break e;case"compositionupdate":J="onCompositionUpdate";break e}J=void 0}else er?Ri(e,n)&&(J="onCompositionEnd"):e==="keydown"&&n.keyCode===229&&(J="onCompositionStart");J&&(Pi&&n.locale!=="ko"&&(er||J!=="onCompositionStart"?J==="onCompositionEnd"&&er&&(K=Ci()):(dn=N,Pa="value"in dn?dn.value:dn.textContent,er=!0)),W=Ml(w,J),0<W.length&&(J=new ji(J,e,null,n,N),j.push({event:J,listeners:W}),K?J.data=K:(K=Di(n),K!==null&&(J.data=K)))),(K=qc?Xc(e,n):Zc(e,n))&&(w=Ml(w,"onBeforeInput"),0<w.length&&(N=new ji("onBeforeInput","beforeinput",null,n,N),j.push({event:N,listeners:w}),N.data=K))}ts(j,t)})}function Hr(e,t,n){return{instance:e,listener:t,currentTarget:n}}function Ml(e,t){for(var n=t+"Capture",r=[];e!==null;){var l=e,a=l.stateNode;l.tag===5&&a!==null&&(l=a,a=an(e,n),a!=null&&r.unshift(Hr(e,a,l)),a=an(e,t),a!=null&&r.push(Hr(e,a,l))),e=e.return}return r}function rr(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5);return e||null}function rs(e,t,n,r,l){for(var a=t._reactName,o=[];n!==null&&n!==r;){var c=n,p=c.alternate,w=c.stateNode;if(p!==null&&p===r)break;c.tag===5&&w!==null&&(c=w,l?(p=an(n,a),p!=null&&o.unshift(Hr(n,p,c))):l||(p=an(n,a),p!=null&&o.push(Hr(n,p,c)))),n=n.return}o.length!==0&&e.push({event:t,listeners:o})}var fd=/\r\n?/g,gd=/\u0000|\uFFFD/g;function ls(e){return(typeof e=="string"?e:""+e).replace(fd,`
`).replace(gd,"")}function Ll(e,t,n){if(t=ls(t),ls(e)!==t&&n)throw Error(i(425))}function Rl(){}var Ya=null,Ja=null;function Ga(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var qa=typeof setTimeout=="function"?setTimeout:void 0,md=typeof clearTimeout=="function"?clearTimeout:void 0,as=typeof Promise=="function"?Promise:void 0,hd=typeof queueMicrotask=="function"?queueMicrotask:typeof as<"u"?function(e){return as.resolve(null).then(e).catch(xd)}:qa;function xd(e){setTimeout(function(){throw e})}function Xa(e,t){var n=t,r=0;do{var l=n.nextSibling;if(e.removeChild(n),l&&l.nodeType===8)if(n=l.data,n==="/$"){if(r===0){e.removeChild(l),Rr(t);return}r--}else n!=="$"&&n!=="$?"&&n!=="$!"||r++;n=l}while(n);Rr(t)}function fn(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?")break;if(t==="/$")return null}}return e}function os(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="$"||n==="$!"||n==="$?"){if(t===0)return e;t--}else n==="/$"&&t++}e=e.previousSibling}return null}var lr=Math.random().toString(36).slice(2),At="__reactFiber$"+lr,Wr="__reactProps$"+lr,Kt="__reactContainer$"+lr,Za="__reactEvents$"+lr,vd="__reactListeners$"+lr,yd="__reactHandles$"+lr;function Mn(e){var t=e[At];if(t)return t;for(var n=e.parentNode;n;){if(t=n[Kt]||n[At]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(e=os(e);e!==null;){if(n=e[At])return n;e=os(e)}return t}e=n,n=e.parentNode}return null}function Kr(e){return e=e[At]||e[Kt],!e||e.tag!==5&&e.tag!==6&&e.tag!==13&&e.tag!==3?null:e}function ar(e){if(e.tag===5||e.tag===6)return e.stateNode;throw Error(i(33))}function Dl(e){return e[Wr]||null}var eo=[],or=-1;function gn(e){return{current:e}}function _e(e){0>or||(e.current=eo[or],eo[or]=null,or--)}function xe(e,t){or++,eo[or]=e.current,e.current=t}var mn={},He=gn(mn),Ze=gn(!1),Ln=mn;function ir(e,t){var n=e.type.contextTypes;if(!n)return mn;var r=e.stateNode;if(r&&r.__reactInternalMemoizedUnmaskedChildContext===t)return r.__reactInternalMemoizedMaskedChildContext;var l={},a;for(a in n)l[a]=t[a];return r&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=t,e.__reactInternalMemoizedMaskedChildContext=l),l}function et(e){return e=e.childContextTypes,e!=null}function Ol(){_e(Ze),_e(He)}function is(e,t,n){if(He.current!==mn)throw Error(i(168));xe(He,t),xe(Ze,n)}function ss(e,t,n){var r=e.stateNode;if(t=t.childContextTypes,typeof r.getChildContext!="function")return n;r=r.getChildContext();for(var l in r)if(!(l in t))throw Error(i(108,ge(e)||"Unknown",l));return F({},n,r)}function $l(e){return e=(e=e.stateNode)&&e.__reactInternalMemoizedMergedChildContext||mn,Ln=He.current,xe(He,e),xe(Ze,Ze.current),!0}function us(e,t,n){var r=e.stateNode;if(!r)throw Error(i(169));n?(e=ss(e,t,Ln),r.__reactInternalMemoizedMergedChildContext=e,_e(Ze),_e(He),xe(He,e)):_e(Ze),xe(Ze,n)}var Qt=null,Il=!1,to=!1;function cs(e){Qt===null?Qt=[e]:Qt.push(e)}function _d(e){Il=!0,cs(e)}function hn(){if(!to&&Qt!==null){to=!0;var e=0,t=fe;try{var n=Qt;for(fe=1;e<n.length;e++){var r=n[e];do r=r(!0);while(r!==null)}Qt=null,Il=!1}catch(l){throw Qt!==null&&(Qt=Qt.slice(e+1)),ke(Sa,hn),l}finally{fe=t,to=!1}}return null}var sr=[],ur=0,Fl=null,Al=0,ht=[],xt=0,Rn=null,Yt=1,Jt="";function Dn(e,t){sr[ur++]=Al,sr[ur++]=Fl,Fl=e,Al=t}function ds(e,t,n){ht[xt++]=Yt,ht[xt++]=Jt,ht[xt++]=Rn,Rn=e;var r=Yt;e=Jt;var l=32-Et(r)-1;r&=~(1<<l),n+=1;var a=32-Et(t)+l;if(30<a){var o=l-l%5;a=(r&(1<<o)-1).toString(32),r>>=o,l-=o,Yt=1<<32-Et(t)+l|n<<l|r,Jt=a+e}else Yt=1<<a|n<<l|r,Jt=e}function no(e){e.return!==null&&(Dn(e,1),ds(e,1,0))}function ro(e){for(;e===Fl;)Fl=sr[--ur],sr[ur]=null,Al=sr[--ur],sr[ur]=null;for(;e===Rn;)Rn=ht[--xt],ht[xt]=null,Jt=ht[--xt],ht[xt]=null,Yt=ht[--xt],ht[xt]=null}var ut=null,ct=null,Se=!1,Nt=null;function ps(e,t){var n=wt(5,null,null,0);n.elementType="DELETED",n.stateNode=t,n.return=e,t=e.deletions,t===null?(e.deletions=[n],e.flags|=16):t.push(n)}function fs(e,t){switch(e.tag){case 5:var n=e.type;return t=t.nodeType!==1||n.toLowerCase()!==t.nodeName.toLowerCase()?null:t,t!==null?(e.stateNode=t,ut=e,ct=fn(t.firstChild),!0):!1;case 6:return t=e.pendingProps===""||t.nodeType!==3?null:t,t!==null?(e.stateNode=t,ut=e,ct=null,!0):!1;case 13:return t=t.nodeType!==8?null:t,t!==null?(n=Rn!==null?{id:Yt,overflow:Jt}:null,e.memoizedState={dehydrated:t,treeContext:n,retryLane:1073741824},n=wt(18,null,null,0),n.stateNode=t,n.return=e,e.child=n,ut=e,ct=null,!0):!1;default:return!1}}function lo(e){return(e.mode&1)!==0&&(e.flags&128)===0}function ao(e){if(Se){var t=ct;if(t){var n=t;if(!fs(e,t)){if(lo(e))throw Error(i(418));t=fn(n.nextSibling);var r=ut;t&&fs(e,t)?ps(r,n):(e.flags=e.flags&-4097|2,Se=!1,ut=e)}}else{if(lo(e))throw Error(i(418));e.flags=e.flags&-4097|2,Se=!1,ut=e}}}function gs(e){for(e=e.return;e!==null&&e.tag!==5&&e.tag!==3&&e.tag!==13;)e=e.return;ut=e}function Ul(e){if(e!==ut)return!1;if(!Se)return gs(e),Se=!0,!1;var t;if((t=e.tag!==3)&&!(t=e.tag!==5)&&(t=e.type,t=t!=="head"&&t!=="body"&&!Ga(e.type,e.memoizedProps)),t&&(t=ct)){if(lo(e))throw ms(),Error(i(418));for(;t;)ps(e,t),t=fn(t.nextSibling)}if(gs(e),e.tag===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(i(317));e:{for(e=e.nextSibling,t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="/$"){if(t===0){ct=fn(e.nextSibling);break e}t--}else n!=="$"&&n!=="$!"&&n!=="$?"||t++}e=e.nextSibling}ct=null}}else ct=ut?fn(e.stateNode.nextSibling):null;return!0}function ms(){for(var e=ct;e;)e=fn(e.nextSibling)}function cr(){ct=ut=null,Se=!1}function oo(e){Nt===null?Nt=[e]:Nt.push(e)}var wd=we.ReactCurrentBatchConfig;function Qr(e,t,n){if(e=n.ref,e!==null&&typeof e!="function"&&typeof e!="object"){if(n._owner){if(n=n._owner,n){if(n.tag!==1)throw Error(i(309));var r=n.stateNode}if(!r)throw Error(i(147,e));var l=r,a=""+e;return t!==null&&t.ref!==null&&typeof t.ref=="function"&&t.ref._stringRef===a?t.ref:(t=function(o){var c=l.refs;o===null?delete c[a]:c[a]=o},t._stringRef=a,t)}if(typeof e!="string")throw Error(i(284));if(!n._owner)throw Error(i(290,e))}return e}function Bl(e,t){throw e=Object.prototype.toString.call(t),Error(i(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e))}function hs(e){var t=e._init;return t(e._payload)}function xs(e){function t(v,f){if(e){var y=v.deletions;y===null?(v.deletions=[f],v.flags|=16):y.push(f)}}function n(v,f){if(!e)return null;for(;f!==null;)t(v,f),f=f.sibling;return null}function r(v,f){for(v=new Map;f!==null;)f.key!==null?v.set(f.key,f):v.set(f.index,f),f=f.sibling;return v}function l(v,f){return v=bn(v,f),v.index=0,v.sibling=null,v}function a(v,f,y){return v.index=y,e?(y=v.alternate,y!==null?(y=y.index,y<f?(v.flags|=2,f):y):(v.flags|=2,f)):(v.flags|=1048576,f)}function o(v){return e&&v.alternate===null&&(v.flags|=2),v}function c(v,f,y,L){return f===null||f.tag!==6?(f=Xo(y,v.mode,L),f.return=v,f):(f=l(f,y),f.return=v,f)}function p(v,f,y,L){var H=y.type;return H===ze?N(v,f,y.props.children,L,y.key):f!==null&&(f.elementType===H||typeof H=="object"&&H!==null&&H.$$typeof===Fe&&hs(H)===f.type)?(L=l(f,y.props),L.ref=Qr(v,f,y),L.return=v,L):(L=pa(y.type,y.key,y.props,null,v.mode,L),L.ref=Qr(v,f,y),L.return=v,L)}function w(v,f,y,L){return f===null||f.tag!==4||f.stateNode.containerInfo!==y.containerInfo||f.stateNode.implementation!==y.implementation?(f=Zo(y,v.mode,L),f.return=v,f):(f=l(f,y.children||[]),f.return=v,f)}function N(v,f,y,L,H){return f===null||f.tag!==7?(f=Vn(y,v.mode,L,H),f.return=v,f):(f=l(f,y),f.return=v,f)}function j(v,f,y){if(typeof f=="string"&&f!==""||typeof f=="number")return f=Xo(""+f,v.mode,y),f.return=v,f;if(typeof f=="object"&&f!==null){switch(f.$$typeof){case Y:return y=pa(f.type,f.key,f.props,null,v.mode,y),y.ref=Qr(v,null,f),y.return=v,y;case ce:return f=Zo(f,v.mode,y),f.return=v,f;case Fe:var L=f._init;return j(v,L(f._payload),y)}if(en(f)||Q(f))return f=Vn(f,v.mode,y,null),f.return=v,f;Bl(v,f)}return null}function C(v,f,y,L){var H=f!==null?f.key:null;if(typeof y=="string"&&y!==""||typeof y=="number")return H!==null?null:c(v,f,""+y,L);if(typeof y=="object"&&y!==null){switch(y.$$typeof){case Y:return y.key===H?p(v,f,y,L):null;case ce:return y.key===H?w(v,f,y,L):null;case Fe:return H=y._init,C(v,f,H(y._payload),L)}if(en(y)||Q(y))return H!==null?null:N(v,f,y,L,null);Bl(v,y)}return null}function I(v,f,y,L,H){if(typeof L=="string"&&L!==""||typeof L=="number")return v=v.get(y)||null,c(f,v,""+L,H);if(typeof L=="object"&&L!==null){switch(L.$$typeof){case Y:return v=v.get(L.key===null?y:L.key)||null,p(f,v,L,H);case ce:return v=v.get(L.key===null?y:L.key)||null,w(f,v,L,H);case Fe:var W=L._init;return I(v,f,y,W(L._payload),H)}if(en(L)||Q(L))return v=v.get(y)||null,N(f,v,L,H,null);Bl(f,L)}return null}function B(v,f,y,L){for(var H=null,W=null,K=f,J=f=0,Ie=null;K!==null&&J<y.length;J++){K.index>J?(Ie=K,K=null):Ie=K.sibling;var ue=C(v,K,y[J],L);if(ue===null){K===null&&(K=Ie);break}e&&K&&ue.alternate===null&&t(v,K),f=a(ue,f,J),W===null?H=ue:W.sibling=ue,W=ue,K=Ie}if(J===y.length)return n(v,K),Se&&Dn(v,J),H;if(K===null){for(;J<y.length;J++)K=j(v,y[J],L),K!==null&&(f=a(K,f,J),W===null?H=K:W.sibling=K,W=K);return Se&&Dn(v,J),H}for(K=r(v,K);J<y.length;J++)Ie=I(K,v,J,y[J],L),Ie!==null&&(e&&Ie.alternate!==null&&K.delete(Ie.key===null?J:Ie.key),f=a(Ie,f,J),W===null?H=Ie:W.sibling=Ie,W=Ie);return e&&K.forEach(function(En){return t(v,En)}),Se&&Dn(v,J),H}function V(v,f,y,L){var H=Q(y);if(typeof H!="function")throw Error(i(150));if(y=H.call(y),y==null)throw Error(i(151));for(var W=H=null,K=f,J=f=0,Ie=null,ue=y.next();K!==null&&!ue.done;J++,ue=y.next()){K.index>J?(Ie=K,K=null):Ie=K.sibling;var En=C(v,K,ue.value,L);if(En===null){K===null&&(K=Ie);break}e&&K&&En.alternate===null&&t(v,K),f=a(En,f,J),W===null?H=En:W.sibling=En,W=En,K=Ie}if(ue.done)return n(v,K),Se&&Dn(v,J),H;if(K===null){for(;!ue.done;J++,ue=y.next())ue=j(v,ue.value,L),ue!==null&&(f=a(ue,f,J),W===null?H=ue:W.sibling=ue,W=ue);return Se&&Dn(v,J),H}for(K=r(v,K);!ue.done;J++,ue=y.next())ue=I(K,v,J,ue.value,L),ue!==null&&(e&&ue.alternate!==null&&K.delete(ue.key===null?J:ue.key),f=a(ue,f,J),W===null?H=ue:W.sibling=ue,W=ue);return e&&K.forEach(function(ep){return t(v,ep)}),Se&&Dn(v,J),H}function Te(v,f,y,L){if(typeof y=="object"&&y!==null&&y.type===ze&&y.key===null&&(y=y.props.children),typeof y=="object"&&y!==null){switch(y.$$typeof){case Y:e:{for(var H=y.key,W=f;W!==null;){if(W.key===H){if(H=y.type,H===ze){if(W.tag===7){n(v,W.sibling),f=l(W,y.props.children),f.return=v,v=f;break e}}else if(W.elementType===H||typeof H=="object"&&H!==null&&H.$$typeof===Fe&&hs(H)===W.type){n(v,W.sibling),f=l(W,y.props),f.ref=Qr(v,W,y),f.return=v,v=f;break e}n(v,W);break}else t(v,W);W=W.sibling}y.type===ze?(f=Vn(y.props.children,v.mode,L,y.key),f.return=v,v=f):(L=pa(y.type,y.key,y.props,null,v.mode,L),L.ref=Qr(v,f,y),L.return=v,v=L)}return o(v);case ce:e:{for(W=y.key;f!==null;){if(f.key===W)if(f.tag===4&&f.stateNode.containerInfo===y.containerInfo&&f.stateNode.implementation===y.implementation){n(v,f.sibling),f=l(f,y.children||[]),f.return=v,v=f;break e}else{n(v,f);break}else t(v,f);f=f.sibling}f=Zo(y,v.mode,L),f.return=v,v=f}return o(v);case Fe:return W=y._init,Te(v,f,W(y._payload),L)}if(en(y))return B(v,f,y,L);if(Q(y))return V(v,f,y,L);Bl(v,y)}return typeof y=="string"&&y!==""||typeof y=="number"?(y=""+y,f!==null&&f.tag===6?(n(v,f.sibling),f=l(f,y),f.return=v,v=f):(n(v,f),f=Xo(y,v.mode,L),f.return=v,v=f),o(v)):n(v,f)}return Te}var dr=xs(!0),vs=xs(!1),Vl=gn(null),Hl=null,pr=null,io=null;function so(){io=pr=Hl=null}function uo(e){var t=Vl.current;_e(Vl),e._currentValue=t}function co(e,t,n){for(;e!==null;){var r=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,r!==null&&(r.childLanes|=t)):r!==null&&(r.childLanes&t)!==t&&(r.childLanes|=t),e===n)break;e=e.return}}function fr(e,t){Hl=e,io=pr=null,e=e.dependencies,e!==null&&e.firstContext!==null&&((e.lanes&t)!==0&&(tt=!0),e.firstContext=null)}function vt(e){var t=e._currentValue;if(io!==e)if(e={context:e,memoizedValue:t,next:null},pr===null){if(Hl===null)throw Error(i(308));pr=e,Hl.dependencies={lanes:0,firstContext:e}}else pr=pr.next=e;return t}var On=null;function po(e){On===null?On=[e]:On.push(e)}function ys(e,t,n,r){var l=t.interleaved;return l===null?(n.next=n,po(t)):(n.next=l.next,l.next=n),t.interleaved=n,Gt(e,r)}function Gt(e,t){e.lanes|=t;var n=e.alternate;for(n!==null&&(n.lanes|=t),n=e,e=e.return;e!==null;)e.childLanes|=t,n=e.alternate,n!==null&&(n.childLanes|=t),n=e,e=e.return;return n.tag===3?n.stateNode:null}var xn=!1;function fo(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function _s(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,effects:e.effects})}function qt(e,t){return{eventTime:e,lane:t,tag:0,payload:null,callback:null,next:null}}function vn(e,t,n){var r=e.updateQueue;if(r===null)return null;if(r=r.shared,(se&2)!==0){var l=r.pending;return l===null?t.next=t:(t.next=l.next,l.next=t),r.pending=t,Gt(e,n)}return l=r.interleaved,l===null?(t.next=t,po(r)):(t.next=l.next,l.next=t),r.interleaved=t,Gt(e,n)}function Wl(e,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,(n&4194240)!==0)){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,Ca(e,n)}}function ws(e,t){var n=e.updateQueue,r=e.alternate;if(r!==null&&(r=r.updateQueue,n===r)){var l=null,a=null;if(n=n.firstBaseUpdate,n!==null){do{var o={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};a===null?l=a=o:a=a.next=o,n=n.next}while(n!==null);a===null?l=a=t:a=a.next=t}else l=a=t;n={baseState:r.baseState,firstBaseUpdate:l,lastBaseUpdate:a,shared:r.shared,effects:r.effects},e.updateQueue=n;return}e=n.lastBaseUpdate,e===null?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}function Kl(e,t,n,r){var l=e.updateQueue;xn=!1;var a=l.firstBaseUpdate,o=l.lastBaseUpdate,c=l.shared.pending;if(c!==null){l.shared.pending=null;var p=c,w=p.next;p.next=null,o===null?a=w:o.next=w,o=p;var N=e.alternate;N!==null&&(N=N.updateQueue,c=N.lastBaseUpdate,c!==o&&(c===null?N.firstBaseUpdate=w:c.next=w,N.lastBaseUpdate=p))}if(a!==null){var j=l.baseState;o=0,N=w=p=null,c=a;do{var C=c.lane,I=c.eventTime;if((r&C)===C){N!==null&&(N=N.next={eventTime:I,lane:0,tag:c.tag,payload:c.payload,callback:c.callback,next:null});e:{var B=e,V=c;switch(C=t,I=n,V.tag){case 1:if(B=V.payload,typeof B=="function"){j=B.call(I,j,C);break e}j=B;break e;case 3:B.flags=B.flags&-65537|128;case 0:if(B=V.payload,C=typeof B=="function"?B.call(I,j,C):B,C==null)break e;j=F({},j,C);break e;case 2:xn=!0}}c.callback!==null&&c.lane!==0&&(e.flags|=64,C=l.effects,C===null?l.effects=[c]:C.push(c))}else I={eventTime:I,lane:C,tag:c.tag,payload:c.payload,callback:c.callback,next:null},N===null?(w=N=I,p=j):N=N.next=I,o|=C;if(c=c.next,c===null){if(c=l.shared.pending,c===null)break;C=c,c=C.next,C.next=null,l.lastBaseUpdate=C,l.shared.pending=null}}while(!0);if(N===null&&(p=j),l.baseState=p,l.firstBaseUpdate=w,l.lastBaseUpdate=N,t=l.shared.interleaved,t!==null){l=t;do o|=l.lane,l=l.next;while(l!==t)}else a===null&&(l.shared.lanes=0);Fn|=o,e.lanes=o,e.memoizedState=j}}function ks(e,t,n){if(e=t.effects,t.effects=null,e!==null)for(t=0;t<e.length;t++){var r=e[t],l=r.callback;if(l!==null){if(r.callback=null,r=n,typeof l!="function")throw Error(i(191,l));l.call(r)}}}var Yr={},Ut=gn(Yr),Jr=gn(Yr),Gr=gn(Yr);function $n(e){if(e===Yr)throw Error(i(174));return e}function go(e,t){switch(xe(Gr,t),xe(Jr,e),xe(Ut,Yr),e=t.nodeType,e){case 9:case 11:t=(t=t.documentElement)?t.namespaceURI:Yn(null,"");break;default:e=e===8?t.parentNode:t,t=e.namespaceURI||null,e=e.tagName,t=Yn(t,e)}_e(Ut),xe(Ut,t)}function gr(){_e(Ut),_e(Jr),_e(Gr)}function Ss(e){$n(Gr.current);var t=$n(Ut.current),n=Yn(t,e.type);t!==n&&(xe(Jr,e),xe(Ut,n))}function mo(e){Jr.current===e&&(_e(Ut),_e(Jr))}var be=gn(0);function Ql(e){for(var t=e;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||n.data==="$?"||n.data==="$!"))return t}else if(t.tag===19&&t.memoizedProps.revealOrder!==void 0){if((t.flags&128)!==0)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var ho=[];function xo(){for(var e=0;e<ho.length;e++)ho[e]._workInProgressVersionPrimary=null;ho.length=0}var Yl=we.ReactCurrentDispatcher,vo=we.ReactCurrentBatchConfig,In=0,Ee=null,Le=null,Oe=null,Jl=!1,qr=!1,Xr=0,kd=0;function We(){throw Error(i(321))}function yo(e,t){if(t===null)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!Ct(e[n],t[n]))return!1;return!0}function _o(e,t,n,r,l,a){if(In=a,Ee=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,Yl.current=e===null||e.memoizedState===null?Cd:Nd,e=n(r,l),qr){a=0;do{if(qr=!1,Xr=0,25<=a)throw Error(i(301));a+=1,Oe=Le=null,t.updateQueue=null,Yl.current=Td,e=n(r,l)}while(qr)}if(Yl.current=Xl,t=Le!==null&&Le.next!==null,In=0,Oe=Le=Ee=null,Jl=!1,t)throw Error(i(300));return e}function wo(){var e=Xr!==0;return Xr=0,e}function Bt(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Oe===null?Ee.memoizedState=Oe=e:Oe=Oe.next=e,Oe}function yt(){if(Le===null){var e=Ee.alternate;e=e!==null?e.memoizedState:null}else e=Le.next;var t=Oe===null?Ee.memoizedState:Oe.next;if(t!==null)Oe=t,Le=e;else{if(e===null)throw Error(i(310));Le=e,e={memoizedState:Le.memoizedState,baseState:Le.baseState,baseQueue:Le.baseQueue,queue:Le.queue,next:null},Oe===null?Ee.memoizedState=Oe=e:Oe=Oe.next=e}return Oe}function Zr(e,t){return typeof t=="function"?t(e):t}function ko(e){var t=yt(),n=t.queue;if(n===null)throw Error(i(311));n.lastRenderedReducer=e;var r=Le,l=r.baseQueue,a=n.pending;if(a!==null){if(l!==null){var o=l.next;l.next=a.next,a.next=o}r.baseQueue=l=a,n.pending=null}if(l!==null){a=l.next,r=r.baseState;var c=o=null,p=null,w=a;do{var N=w.lane;if((In&N)===N)p!==null&&(p=p.next={lane:0,action:w.action,hasEagerState:w.hasEagerState,eagerState:w.eagerState,next:null}),r=w.hasEagerState?w.eagerState:e(r,w.action);else{var j={lane:N,action:w.action,hasEagerState:w.hasEagerState,eagerState:w.eagerState,next:null};p===null?(c=p=j,o=r):p=p.next=j,Ee.lanes|=N,Fn|=N}w=w.next}while(w!==null&&w!==a);p===null?o=r:p.next=c,Ct(r,t.memoizedState)||(tt=!0),t.memoizedState=r,t.baseState=o,t.baseQueue=p,n.lastRenderedState=r}if(e=n.interleaved,e!==null){l=e;do a=l.lane,Ee.lanes|=a,Fn|=a,l=l.next;while(l!==e)}else l===null&&(n.lanes=0);return[t.memoizedState,n.dispatch]}function So(e){var t=yt(),n=t.queue;if(n===null)throw Error(i(311));n.lastRenderedReducer=e;var r=n.dispatch,l=n.pending,a=t.memoizedState;if(l!==null){n.pending=null;var o=l=l.next;do a=e(a,o.action),o=o.next;while(o!==l);Ct(a,t.memoizedState)||(tt=!0),t.memoizedState=a,t.baseQueue===null&&(t.baseState=a),n.lastRenderedState=a}return[a,r]}function bs(){}function Es(e,t){var n=Ee,r=yt(),l=t(),a=!Ct(r.memoizedState,l);if(a&&(r.memoizedState=l,tt=!0),r=r.queue,bo(Ts.bind(null,n,r,e),[e]),r.getSnapshot!==t||a||Oe!==null&&Oe.memoizedState.tag&1){if(n.flags|=2048,el(9,Ns.bind(null,n,r,l,t),void 0,null),$e===null)throw Error(i(349));(In&30)!==0||Cs(n,t,l)}return l}function Cs(e,t,n){e.flags|=16384,e={getSnapshot:t,value:n},t=Ee.updateQueue,t===null?(t={lastEffect:null,stores:null},Ee.updateQueue=t,t.stores=[e]):(n=t.stores,n===null?t.stores=[e]:n.push(e))}function Ns(e,t,n,r){t.value=n,t.getSnapshot=r,js(t)&&zs(e)}function Ts(e,t,n){return n(function(){js(t)&&zs(e)})}function js(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!Ct(e,n)}catch{return!0}}function zs(e){var t=Gt(e,1);t!==null&&Pt(t,e,1,-1)}function Ps(e){var t=Bt();return typeof e=="function"&&(e=e()),t.memoizedState=t.baseState=e,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Zr,lastRenderedState:e},t.queue=e,e=e.dispatch=Ed.bind(null,Ee,e),[t.memoizedState,e]}function el(e,t,n,r){return e={tag:e,create:t,destroy:n,deps:r,next:null},t=Ee.updateQueue,t===null?(t={lastEffect:null,stores:null},Ee.updateQueue=t,t.lastEffect=e.next=e):(n=t.lastEffect,n===null?t.lastEffect=e.next=e:(r=n.next,n.next=e,e.next=r,t.lastEffect=e)),e}function Ms(){return yt().memoizedState}function Gl(e,t,n,r){var l=Bt();Ee.flags|=e,l.memoizedState=el(1|t,n,void 0,r===void 0?null:r)}function ql(e,t,n,r){var l=yt();r=r===void 0?null:r;var a=void 0;if(Le!==null){var o=Le.memoizedState;if(a=o.destroy,r!==null&&yo(r,o.deps)){l.memoizedState=el(t,n,a,r);return}}Ee.flags|=e,l.memoizedState=el(1|t,n,a,r)}function Ls(e,t){return Gl(8390656,8,e,t)}function bo(e,t){return ql(2048,8,e,t)}function Rs(e,t){return ql(4,2,e,t)}function Ds(e,t){return ql(4,4,e,t)}function Os(e,t){if(typeof t=="function")return e=e(),t(e),function(){t(null)};if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function $s(e,t,n){return n=n!=null?n.concat([e]):null,ql(4,4,Os.bind(null,t,e),n)}function Eo(){}function Is(e,t){var n=yt();t=t===void 0?null:t;var r=n.memoizedState;return r!==null&&t!==null&&yo(t,r[1])?r[0]:(n.memoizedState=[e,t],e)}function Fs(e,t){var n=yt();t=t===void 0?null:t;var r=n.memoizedState;return r!==null&&t!==null&&yo(t,r[1])?r[0]:(e=e(),n.memoizedState=[e,t],e)}function As(e,t,n){return(In&21)===0?(e.baseState&&(e.baseState=!1,tt=!0),e.memoizedState=n):(Ct(n,t)||(n=hi(),Ee.lanes|=n,Fn|=n,e.baseState=!0),t)}function Sd(e,t){var n=fe;fe=n!==0&&4>n?n:4,e(!0);var r=vo.transition;vo.transition={};try{e(!1),t()}finally{fe=n,vo.transition=r}}function Us(){return yt().memoizedState}function bd(e,t,n){var r=kn(e);if(n={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null},Bs(e))Vs(t,n);else if(n=ys(e,t,n,r),n!==null){var l=Ge();Pt(n,e,r,l),Hs(n,t,r)}}function Ed(e,t,n){var r=kn(e),l={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null};if(Bs(e))Vs(t,l);else{var a=e.alternate;if(e.lanes===0&&(a===null||a.lanes===0)&&(a=t.lastRenderedReducer,a!==null))try{var o=t.lastRenderedState,c=a(o,n);if(l.hasEagerState=!0,l.eagerState=c,Ct(c,o)){var p=t.interleaved;p===null?(l.next=l,po(t)):(l.next=p.next,p.next=l),t.interleaved=l;return}}catch{}finally{}n=ys(e,t,l,r),n!==null&&(l=Ge(),Pt(n,e,r,l),Hs(n,t,r))}}function Bs(e){var t=e.alternate;return e===Ee||t!==null&&t===Ee}function Vs(e,t){qr=Jl=!0;var n=e.pending;n===null?t.next=t:(t.next=n.next,n.next=t),e.pending=t}function Hs(e,t,n){if((n&4194240)!==0){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,Ca(e,n)}}var Xl={readContext:vt,useCallback:We,useContext:We,useEffect:We,useImperativeHandle:We,useInsertionEffect:We,useLayoutEffect:We,useMemo:We,useReducer:We,useRef:We,useState:We,useDebugValue:We,useDeferredValue:We,useTransition:We,useMutableSource:We,useSyncExternalStore:We,useId:We,unstable_isNewReconciler:!1},Cd={readContext:vt,useCallback:function(e,t){return Bt().memoizedState=[e,t===void 0?null:t],e},useContext:vt,useEffect:Ls,useImperativeHandle:function(e,t,n){return n=n!=null?n.concat([e]):null,Gl(4194308,4,Os.bind(null,t,e),n)},useLayoutEffect:function(e,t){return Gl(4194308,4,e,t)},useInsertionEffect:function(e,t){return Gl(4,2,e,t)},useMemo:function(e,t){var n=Bt();return t=t===void 0?null:t,e=e(),n.memoizedState=[e,t],e},useReducer:function(e,t,n){var r=Bt();return t=n!==void 0?n(t):t,r.memoizedState=r.baseState=t,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:t},r.queue=e,e=e.dispatch=bd.bind(null,Ee,e),[r.memoizedState,e]},useRef:function(e){var t=Bt();return e={current:e},t.memoizedState=e},useState:Ps,useDebugValue:Eo,useDeferredValue:function(e){return Bt().memoizedState=e},useTransition:function(){var e=Ps(!1),t=e[0];return e=Sd.bind(null,e[1]),Bt().memoizedState=e,[t,e]},useMutableSource:function(){},useSyncExternalStore:function(e,t,n){var r=Ee,l=Bt();if(Se){if(n===void 0)throw Error(i(407));n=n()}else{if(n=t(),$e===null)throw Error(i(349));(In&30)!==0||Cs(r,t,n)}l.memoizedState=n;var a={value:n,getSnapshot:t};return l.queue=a,Ls(Ts.bind(null,r,a,e),[e]),r.flags|=2048,el(9,Ns.bind(null,r,a,n,t),void 0,null),n},useId:function(){var e=Bt(),t=$e.identifierPrefix;if(Se){var n=Jt,r=Yt;n=(r&~(1<<32-Et(r)-1)).toString(32)+n,t=":"+t+"R"+n,n=Xr++,0<n&&(t+="H"+n.toString(32)),t+=":"}else n=kd++,t=":"+t+"r"+n.toString(32)+":";return e.memoizedState=t},unstable_isNewReconciler:!1},Nd={readContext:vt,useCallback:Is,useContext:vt,useEffect:bo,useImperativeHandle:$s,useInsertionEffect:Rs,useLayoutEffect:Ds,useMemo:Fs,useReducer:ko,useRef:Ms,useState:function(){return ko(Zr)},useDebugValue:Eo,useDeferredValue:function(e){var t=yt();return As(t,Le.memoizedState,e)},useTransition:function(){var e=ko(Zr)[0],t=yt().memoizedState;return[e,t]},useMutableSource:bs,useSyncExternalStore:Es,useId:Us,unstable_isNewReconciler:!1},Td={readContext:vt,useCallback:Is,useContext:vt,useEffect:bo,useImperativeHandle:$s,useInsertionEffect:Rs,useLayoutEffect:Ds,useMemo:Fs,useReducer:So,useRef:Ms,useState:function(){return So(Zr)},useDebugValue:Eo,useDeferredValue:function(e){var t=yt();return Le===null?t.memoizedState=e:As(t,Le.memoizedState,e)},useTransition:function(){var e=So(Zr)[0],t=yt().memoizedState;return[e,t]},useMutableSource:bs,useSyncExternalStore:Es,useId:Us,unstable_isNewReconciler:!1};function Tt(e,t){if(e&&e.defaultProps){t=F({},t),e=e.defaultProps;for(var n in e)t[n]===void 0&&(t[n]=e[n]);return t}return t}function Co(e,t,n,r){t=e.memoizedState,n=n(r,t),n=n==null?t:F({},t,n),e.memoizedState=n,e.lanes===0&&(e.updateQueue.baseState=n)}var Zl={isMounted:function(e){return(e=e._reactInternals)?$(e)===e:!1},enqueueSetState:function(e,t,n){e=e._reactInternals;var r=Ge(),l=kn(e),a=qt(r,l);a.payload=t,n!=null&&(a.callback=n),t=vn(e,a,l),t!==null&&(Pt(t,e,l,r),Wl(t,e,l))},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var r=Ge(),l=kn(e),a=qt(r,l);a.tag=1,a.payload=t,n!=null&&(a.callback=n),t=vn(e,a,l),t!==null&&(Pt(t,e,l,r),Wl(t,e,l))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=Ge(),r=kn(e),l=qt(n,r);l.tag=2,t!=null&&(l.callback=t),t=vn(e,l,r),t!==null&&(Pt(t,e,r,n),Wl(t,e,r))}};function Ws(e,t,n,r,l,a,o){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(r,a,o):t.prototype&&t.prototype.isPureReactComponent?!Ar(n,r)||!Ar(l,a):!0}function Ks(e,t,n){var r=!1,l=mn,a=t.contextType;return typeof a=="object"&&a!==null?a=vt(a):(l=et(t)?Ln:He.current,r=t.contextTypes,a=(r=r!=null)?ir(e,l):mn),t=new t(n,a),e.memoizedState=t.state!==null&&t.state!==void 0?t.state:null,t.updater=Zl,e.stateNode=t,t._reactInternals=e,r&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=l,e.__reactInternalMemoizedMaskedChildContext=a),t}function Qs(e,t,n,r){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(n,r),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(n,r),t.state!==e&&Zl.enqueueReplaceState(t,t.state,null)}function No(e,t,n,r){var l=e.stateNode;l.props=n,l.state=e.memoizedState,l.refs={},fo(e);var a=t.contextType;typeof a=="object"&&a!==null?l.context=vt(a):(a=et(t)?Ln:He.current,l.context=ir(e,a)),l.state=e.memoizedState,a=t.getDerivedStateFromProps,typeof a=="function"&&(Co(e,t,a,n),l.state=e.memoizedState),typeof t.getDerivedStateFromProps=="function"||typeof l.getSnapshotBeforeUpdate=="function"||typeof l.UNSAFE_componentWillMount!="function"&&typeof l.componentWillMount!="function"||(t=l.state,typeof l.componentWillMount=="function"&&l.componentWillMount(),typeof l.UNSAFE_componentWillMount=="function"&&l.UNSAFE_componentWillMount(),t!==l.state&&Zl.enqueueReplaceState(l,l.state,null),Kl(e,n,l,r),l.state=e.memoizedState),typeof l.componentDidMount=="function"&&(e.flags|=4194308)}function mr(e,t){try{var n="",r=t;do n+=le(r),r=r.return;while(r);var l=n}catch(a){l=`
Error generating stack: `+a.message+`
`+a.stack}return{value:e,source:t,stack:l,digest:null}}function To(e,t,n){return{value:e,source:null,stack:n??null,digest:t??null}}function jo(e,t){try{console.error(t.value)}catch(n){setTimeout(function(){throw n})}}var jd=typeof WeakMap=="function"?WeakMap:Map;function Ys(e,t,n){n=qt(-1,n),n.tag=3,n.payload={element:null};var r=t.value;return n.callback=function(){oa||(oa=!0,Ho=r),jo(e,t)},n}function Js(e,t,n){n=qt(-1,n),n.tag=3;var r=e.type.getDerivedStateFromError;if(typeof r=="function"){var l=t.value;n.payload=function(){return r(l)},n.callback=function(){jo(e,t)}}var a=e.stateNode;return a!==null&&typeof a.componentDidCatch=="function"&&(n.callback=function(){jo(e,t),typeof r!="function"&&(_n===null?_n=new Set([this]):_n.add(this));var o=t.stack;this.componentDidCatch(t.value,{componentStack:o!==null?o:""})}),n}function Gs(e,t,n){var r=e.pingCache;if(r===null){r=e.pingCache=new jd;var l=new Set;r.set(t,l)}else l=r.get(t),l===void 0&&(l=new Set,r.set(t,l));l.has(n)||(l.add(n),e=Vd.bind(null,e,t,n),t.then(e,e))}function qs(e){do{var t;if((t=e.tag===13)&&(t=e.memoizedState,t=t!==null?t.dehydrated!==null:!0),t)return e;e=e.return}while(e!==null);return null}function Xs(e,t,n,r,l){return(e.mode&1)===0?(e===t?e.flags|=65536:(e.flags|=128,n.flags|=131072,n.flags&=-52805,n.tag===1&&(n.alternate===null?n.tag=17:(t=qt(-1,1),t.tag=2,vn(n,t,1))),n.lanes|=1),e):(e.flags|=65536,e.lanes=l,e)}var zd=we.ReactCurrentOwner,tt=!1;function Je(e,t,n,r){t.child=e===null?vs(t,null,n,r):dr(t,e.child,n,r)}function Zs(e,t,n,r,l){n=n.render;var a=t.ref;return fr(t,l),r=_o(e,t,n,r,a,l),n=wo(),e!==null&&!tt?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~l,Xt(e,t,l)):(Se&&n&&no(t),t.flags|=1,Je(e,t,r,l),t.child)}function eu(e,t,n,r,l){if(e===null){var a=n.type;return typeof a=="function"&&!qo(a)&&a.defaultProps===void 0&&n.compare===null&&n.defaultProps===void 0?(t.tag=15,t.type=a,tu(e,t,a,r,l)):(e=pa(n.type,null,r,t,t.mode,l),e.ref=t.ref,e.return=t,t.child=e)}if(a=e.child,(e.lanes&l)===0){var o=a.memoizedProps;if(n=n.compare,n=n!==null?n:Ar,n(o,r)&&e.ref===t.ref)return Xt(e,t,l)}return t.flags|=1,e=bn(a,r),e.ref=t.ref,e.return=t,t.child=e}function tu(e,t,n,r,l){if(e!==null){var a=e.memoizedProps;if(Ar(a,r)&&e.ref===t.ref)if(tt=!1,t.pendingProps=r=a,(e.lanes&l)!==0)(e.flags&131072)!==0&&(tt=!0);else return t.lanes=e.lanes,Xt(e,t,l)}return zo(e,t,n,r,l)}function nu(e,t,n){var r=t.pendingProps,l=r.children,a=e!==null?e.memoizedState:null;if(r.mode==="hidden")if((t.mode&1)===0)t.memoizedState={baseLanes:0,cachePool:null,transitions:null},xe(xr,dt),dt|=n;else{if((n&1073741824)===0)return e=a!==null?a.baseLanes|n:n,t.lanes=t.childLanes=1073741824,t.memoizedState={baseLanes:e,cachePool:null,transitions:null},t.updateQueue=null,xe(xr,dt),dt|=e,null;t.memoizedState={baseLanes:0,cachePool:null,transitions:null},r=a!==null?a.baseLanes:n,xe(xr,dt),dt|=r}else a!==null?(r=a.baseLanes|n,t.memoizedState=null):r=n,xe(xr,dt),dt|=r;return Je(e,t,l,n),t.child}function ru(e,t){var n=t.ref;(e===null&&n!==null||e!==null&&e.ref!==n)&&(t.flags|=512,t.flags|=2097152)}function zo(e,t,n,r,l){var a=et(n)?Ln:He.current;return a=ir(t,a),fr(t,l),n=_o(e,t,n,r,a,l),r=wo(),e!==null&&!tt?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~l,Xt(e,t,l)):(Se&&r&&no(t),t.flags|=1,Je(e,t,n,l),t.child)}function lu(e,t,n,r,l){if(et(n)){var a=!0;$l(t)}else a=!1;if(fr(t,l),t.stateNode===null)ta(e,t),Ks(t,n,r),No(t,n,r,l),r=!0;else if(e===null){var o=t.stateNode,c=t.memoizedProps;o.props=c;var p=o.context,w=n.contextType;typeof w=="object"&&w!==null?w=vt(w):(w=et(n)?Ln:He.current,w=ir(t,w));var N=n.getDerivedStateFromProps,j=typeof N=="function"||typeof o.getSnapshotBeforeUpdate=="function";j||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(c!==r||p!==w)&&Qs(t,o,r,w),xn=!1;var C=t.memoizedState;o.state=C,Kl(t,r,o,l),p=t.memoizedState,c!==r||C!==p||Ze.current||xn?(typeof N=="function"&&(Co(t,n,N,r),p=t.memoizedState),(c=xn||Ws(t,n,c,r,C,p,w))?(j||typeof o.UNSAFE_componentWillMount!="function"&&typeof o.componentWillMount!="function"||(typeof o.componentWillMount=="function"&&o.componentWillMount(),typeof o.UNSAFE_componentWillMount=="function"&&o.UNSAFE_componentWillMount()),typeof o.componentDidMount=="function"&&(t.flags|=4194308)):(typeof o.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=r,t.memoizedState=p),o.props=r,o.state=p,o.context=w,r=c):(typeof o.componentDidMount=="function"&&(t.flags|=4194308),r=!1)}else{o=t.stateNode,_s(e,t),c=t.memoizedProps,w=t.type===t.elementType?c:Tt(t.type,c),o.props=w,j=t.pendingProps,C=o.context,p=n.contextType,typeof p=="object"&&p!==null?p=vt(p):(p=et(n)?Ln:He.current,p=ir(t,p));var I=n.getDerivedStateFromProps;(N=typeof I=="function"||typeof o.getSnapshotBeforeUpdate=="function")||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(c!==j||C!==p)&&Qs(t,o,r,p),xn=!1,C=t.memoizedState,o.state=C,Kl(t,r,o,l);var B=t.memoizedState;c!==j||C!==B||Ze.current||xn?(typeof I=="function"&&(Co(t,n,I,r),B=t.memoizedState),(w=xn||Ws(t,n,w,r,C,B,p)||!1)?(N||typeof o.UNSAFE_componentWillUpdate!="function"&&typeof o.componentWillUpdate!="function"||(typeof o.componentWillUpdate=="function"&&o.componentWillUpdate(r,B,p),typeof o.UNSAFE_componentWillUpdate=="function"&&o.UNSAFE_componentWillUpdate(r,B,p)),typeof o.componentDidUpdate=="function"&&(t.flags|=4),typeof o.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof o.componentDidUpdate!="function"||c===e.memoizedProps&&C===e.memoizedState||(t.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||c===e.memoizedProps&&C===e.memoizedState||(t.flags|=1024),t.memoizedProps=r,t.memoizedState=B),o.props=r,o.state=B,o.context=p,r=w):(typeof o.componentDidUpdate!="function"||c===e.memoizedProps&&C===e.memoizedState||(t.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||c===e.memoizedProps&&C===e.memoizedState||(t.flags|=1024),r=!1)}return Po(e,t,n,r,a,l)}function Po(e,t,n,r,l,a){ru(e,t);var o=(t.flags&128)!==0;if(!r&&!o)return l&&us(t,n,!1),Xt(e,t,a);r=t.stateNode,zd.current=t;var c=o&&typeof n.getDerivedStateFromError!="function"?null:r.render();return t.flags|=1,e!==null&&o?(t.child=dr(t,e.child,null,a),t.child=dr(t,null,c,a)):Je(e,t,c,a),t.memoizedState=r.state,l&&us(t,n,!0),t.child}function au(e){var t=e.stateNode;t.pendingContext?is(e,t.pendingContext,t.pendingContext!==t.context):t.context&&is(e,t.context,!1),go(e,t.containerInfo)}function ou(e,t,n,r,l){return cr(),oo(l),t.flags|=256,Je(e,t,n,r),t.child}var Mo={dehydrated:null,treeContext:null,retryLane:0};function Lo(e){return{baseLanes:e,cachePool:null,transitions:null}}function iu(e,t,n){var r=t.pendingProps,l=be.current,a=!1,o=(t.flags&128)!==0,c;if((c=o)||(c=e!==null&&e.memoizedState===null?!1:(l&2)!==0),c?(a=!0,t.flags&=-129):(e===null||e.memoizedState!==null)&&(l|=1),xe(be,l&1),e===null)return ao(t),e=t.memoizedState,e!==null&&(e=e.dehydrated,e!==null)?((t.mode&1)===0?t.lanes=1:e.data==="$!"?t.lanes=8:t.lanes=1073741824,null):(o=r.children,e=r.fallback,a?(r=t.mode,a=t.child,o={mode:"hidden",children:o},(r&1)===0&&a!==null?(a.childLanes=0,a.pendingProps=o):a=fa(o,r,0,null),e=Vn(e,r,n,null),a.return=t,e.return=t,a.sibling=e,t.child=a,t.child.memoizedState=Lo(n),t.memoizedState=Mo,e):Ro(t,o));if(l=e.memoizedState,l!==null&&(c=l.dehydrated,c!==null))return Pd(e,t,o,r,c,l,n);if(a){a=r.fallback,o=t.mode,l=e.child,c=l.sibling;var p={mode:"hidden",children:r.children};return(o&1)===0&&t.child!==l?(r=t.child,r.childLanes=0,r.pendingProps=p,t.deletions=null):(r=bn(l,p),r.subtreeFlags=l.subtreeFlags&14680064),c!==null?a=bn(c,a):(a=Vn(a,o,n,null),a.flags|=2),a.return=t,r.return=t,r.sibling=a,t.child=r,r=a,a=t.child,o=e.child.memoizedState,o=o===null?Lo(n):{baseLanes:o.baseLanes|n,cachePool:null,transitions:o.transitions},a.memoizedState=o,a.childLanes=e.childLanes&~n,t.memoizedState=Mo,r}return a=e.child,e=a.sibling,r=bn(a,{mode:"visible",children:r.children}),(t.mode&1)===0&&(r.lanes=n),r.return=t,r.sibling=null,e!==null&&(n=t.deletions,n===null?(t.deletions=[e],t.flags|=16):n.push(e)),t.child=r,t.memoizedState=null,r}function Ro(e,t){return t=fa({mode:"visible",children:t},e.mode,0,null),t.return=e,e.child=t}function ea(e,t,n,r){return r!==null&&oo(r),dr(t,e.child,null,n),e=Ro(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function Pd(e,t,n,r,l,a,o){if(n)return t.flags&256?(t.flags&=-257,r=To(Error(i(422))),ea(e,t,o,r)):t.memoizedState!==null?(t.child=e.child,t.flags|=128,null):(a=r.fallback,l=t.mode,r=fa({mode:"visible",children:r.children},l,0,null),a=Vn(a,l,o,null),a.flags|=2,r.return=t,a.return=t,r.sibling=a,t.child=r,(t.mode&1)!==0&&dr(t,e.child,null,o),t.child.memoizedState=Lo(o),t.memoizedState=Mo,a);if((t.mode&1)===0)return ea(e,t,o,null);if(l.data==="$!"){if(r=l.nextSibling&&l.nextSibling.dataset,r)var c=r.dgst;return r=c,a=Error(i(419)),r=To(a,r,void 0),ea(e,t,o,r)}if(c=(o&e.childLanes)!==0,tt||c){if(r=$e,r!==null){switch(o&-o){case 4:l=2;break;case 16:l=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:l=32;break;case 536870912:l=268435456;break;default:l=0}l=(l&(r.suspendedLanes|o))!==0?0:l,l!==0&&l!==a.retryLane&&(a.retryLane=l,Gt(e,l),Pt(r,e,l,-1))}return Go(),r=To(Error(i(421))),ea(e,t,o,r)}return l.data==="$?"?(t.flags|=128,t.child=e.child,t=Hd.bind(null,e),l._reactRetry=t,null):(e=a.treeContext,ct=fn(l.nextSibling),ut=t,Se=!0,Nt=null,e!==null&&(ht[xt++]=Yt,ht[xt++]=Jt,ht[xt++]=Rn,Yt=e.id,Jt=e.overflow,Rn=t),t=Ro(t,r.children),t.flags|=4096,t)}function su(e,t,n){e.lanes|=t;var r=e.alternate;r!==null&&(r.lanes|=t),co(e.return,t,n)}function Do(e,t,n,r,l){var a=e.memoizedState;a===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:r,tail:n,tailMode:l}:(a.isBackwards=t,a.rendering=null,a.renderingStartTime=0,a.last=r,a.tail=n,a.tailMode=l)}function uu(e,t,n){var r=t.pendingProps,l=r.revealOrder,a=r.tail;if(Je(e,t,r.children,n),r=be.current,(r&2)!==0)r=r&1|2,t.flags|=128;else{if(e!==null&&(e.flags&128)!==0)e:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&su(e,n,t);else if(e.tag===19)su(e,n,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}r&=1}if(xe(be,r),(t.mode&1)===0)t.memoizedState=null;else switch(l){case"forwards":for(n=t.child,l=null;n!==null;)e=n.alternate,e!==null&&Ql(e)===null&&(l=n),n=n.sibling;n=l,n===null?(l=t.child,t.child=null):(l=n.sibling,n.sibling=null),Do(t,!1,l,n,a);break;case"backwards":for(n=null,l=t.child,t.child=null;l!==null;){if(e=l.alternate,e!==null&&Ql(e)===null){t.child=l;break}e=l.sibling,l.sibling=n,n=l,l=e}Do(t,!0,n,null,a);break;case"together":Do(t,!1,null,null,void 0);break;default:t.memoizedState=null}return t.child}function ta(e,t){(t.mode&1)===0&&e!==null&&(e.alternate=null,t.alternate=null,t.flags|=2)}function Xt(e,t,n){if(e!==null&&(t.dependencies=e.dependencies),Fn|=t.lanes,(n&t.childLanes)===0)return null;if(e!==null&&t.child!==e.child)throw Error(i(153));if(t.child!==null){for(e=t.child,n=bn(e,e.pendingProps),t.child=n,n.return=t;e.sibling!==null;)e=e.sibling,n=n.sibling=bn(e,e.pendingProps),n.return=t;n.sibling=null}return t.child}function Md(e,t,n){switch(t.tag){case 3:au(t),cr();break;case 5:Ss(t);break;case 1:et(t.type)&&$l(t);break;case 4:go(t,t.stateNode.containerInfo);break;case 10:var r=t.type._context,l=t.memoizedProps.value;xe(Vl,r._currentValue),r._currentValue=l;break;case 13:if(r=t.memoizedState,r!==null)return r.dehydrated!==null?(xe(be,be.current&1),t.flags|=128,null):(n&t.child.childLanes)!==0?iu(e,t,n):(xe(be,be.current&1),e=Xt(e,t,n),e!==null?e.sibling:null);xe(be,be.current&1);break;case 19:if(r=(n&t.childLanes)!==0,(e.flags&128)!==0){if(r)return uu(e,t,n);t.flags|=128}if(l=t.memoizedState,l!==null&&(l.rendering=null,l.tail=null,l.lastEffect=null),xe(be,be.current),r)break;return null;case 22:case 23:return t.lanes=0,nu(e,t,n)}return Xt(e,t,n)}var cu,Oo,du,pu;cu=function(e,t){for(var n=t.child;n!==null;){if(n.tag===5||n.tag===6)e.appendChild(n.stateNode);else if(n.tag!==4&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===t)break;for(;n.sibling===null;){if(n.return===null||n.return===t)return;n=n.return}n.sibling.return=n.return,n=n.sibling}},Oo=function(){},du=function(e,t,n,r){var l=e.memoizedProps;if(l!==r){e=t.stateNode,$n(Ut.current);var a=null;switch(n){case"input":l=Lt(e,l),r=Lt(e,r),a=[];break;case"select":l=F({},l,{value:void 0}),r=F({},r,{value:void 0}),a=[];break;case"textarea":l=tn(e,l),r=tn(e,r),a=[];break;default:typeof l.onClick!="function"&&typeof r.onClick=="function"&&(e.onclick=Rl)}Tn(n,r);var o;n=null;for(w in l)if(!r.hasOwnProperty(w)&&l.hasOwnProperty(w)&&l[w]!=null)if(w==="style"){var c=l[w];for(o in c)c.hasOwnProperty(o)&&(n||(n={}),n[o]="")}else w!=="dangerouslySetInnerHTML"&&w!=="children"&&w!=="suppressContentEditableWarning"&&w!=="suppressHydrationWarning"&&w!=="autoFocus"&&(g.hasOwnProperty(w)?a||(a=[]):(a=a||[]).push(w,null));for(w in r){var p=r[w];if(c=l!=null?l[w]:void 0,r.hasOwnProperty(w)&&p!==c&&(p!=null||c!=null))if(w==="style")if(c){for(o in c)!c.hasOwnProperty(o)||p&&p.hasOwnProperty(o)||(n||(n={}),n[o]="");for(o in p)p.hasOwnProperty(o)&&c[o]!==p[o]&&(n||(n={}),n[o]=p[o])}else n||(a||(a=[]),a.push(w,n)),n=p;else w==="dangerouslySetInnerHTML"?(p=p?p.__html:void 0,c=c?c.__html:void 0,p!=null&&c!==p&&(a=a||[]).push(w,p)):w==="children"?typeof p!="string"&&typeof p!="number"||(a=a||[]).push(w,""+p):w!=="suppressContentEditableWarning"&&w!=="suppressHydrationWarning"&&(g.hasOwnProperty(w)?(p!=null&&w==="onScroll"&&ye("scroll",e),a||c===p||(a=[])):(a=a||[]).push(w,p))}n&&(a=a||[]).push("style",n);var w=a;(t.updateQueue=w)&&(t.flags|=4)}},pu=function(e,t,n,r){n!==r&&(t.flags|=4)};function tl(e,t){if(!Se)switch(e.tailMode){case"hidden":t=e.tail;for(var n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?e.tail=null:n.sibling=null;break;case"collapsed":n=e.tail;for(var r=null;n!==null;)n.alternate!==null&&(r=n),n=n.sibling;r===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:r.sibling=null}}function Ke(e){var t=e.alternate!==null&&e.alternate.child===e.child,n=0,r=0;if(t)for(var l=e.child;l!==null;)n|=l.lanes|l.childLanes,r|=l.subtreeFlags&14680064,r|=l.flags&14680064,l.return=e,l=l.sibling;else for(l=e.child;l!==null;)n|=l.lanes|l.childLanes,r|=l.subtreeFlags,r|=l.flags,l.return=e,l=l.sibling;return e.subtreeFlags|=r,e.childLanes=n,t}function Ld(e,t,n){var r=t.pendingProps;switch(ro(t),t.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Ke(t),null;case 1:return et(t.type)&&Ol(),Ke(t),null;case 3:return r=t.stateNode,gr(),_e(Ze),_e(He),xo(),r.pendingContext&&(r.context=r.pendingContext,r.pendingContext=null),(e===null||e.child===null)&&(Ul(t)?t.flags|=4:e===null||e.memoizedState.isDehydrated&&(t.flags&256)===0||(t.flags|=1024,Nt!==null&&(Qo(Nt),Nt=null))),Oo(e,t),Ke(t),null;case 5:mo(t);var l=$n(Gr.current);if(n=t.type,e!==null&&t.stateNode!=null)du(e,t,n,r,l),e.ref!==t.ref&&(t.flags|=512,t.flags|=2097152);else{if(!r){if(t.stateNode===null)throw Error(i(166));return Ke(t),null}if(e=$n(Ut.current),Ul(t)){r=t.stateNode,n=t.type;var a=t.memoizedProps;switch(r[At]=t,r[Wr]=a,e=(t.mode&1)!==0,n){case"dialog":ye("cancel",r),ye("close",r);break;case"iframe":case"object":case"embed":ye("load",r);break;case"video":case"audio":for(l=0;l<Br.length;l++)ye(Br[l],r);break;case"source":ye("error",r);break;case"img":case"image":case"link":ye("error",r),ye("load",r);break;case"details":ye("toggle",r);break;case"input":Wn(r,a),ye("invalid",r);break;case"select":r._wrapperState={wasMultiple:!!a.multiple},ye("invalid",r);break;case"textarea":Ht(r,a),ye("invalid",r)}Tn(n,a),l=null;for(var o in a)if(a.hasOwnProperty(o)){var c=a[o];o==="children"?typeof c=="string"?r.textContent!==c&&(a.suppressHydrationWarning!==!0&&Ll(r.textContent,c,e),l=["children",c]):typeof c=="number"&&r.textContent!==""+c&&(a.suppressHydrationWarning!==!0&&Ll(r.textContent,c,e),l=["children",""+c]):g.hasOwnProperty(o)&&c!=null&&o==="onScroll"&&ye("scroll",r)}switch(n){case"input":gt(r),Nn(r,a,!0);break;case"textarea":gt(r),it(r);break;case"select":case"option":break;default:typeof a.onClick=="function"&&(r.onclick=Rl)}r=l,t.updateQueue=r,r!==null&&(t.flags|=4)}else{o=l.nodeType===9?l:l.ownerDocument,e==="http://www.w3.org/1999/xhtml"&&(e=Qn(n)),e==="http://www.w3.org/1999/xhtml"?n==="script"?(e=o.createElement("div"),e.innerHTML="<script><\/script>",e=e.removeChild(e.firstChild)):typeof r.is=="string"?e=o.createElement(n,{is:r.is}):(e=o.createElement(n),n==="select"&&(o=e,r.multiple?o.multiple=!0:r.size&&(o.size=r.size))):e=o.createElementNS(e,n),e[At]=t,e[Wr]=r,cu(e,t,!1,!1),t.stateNode=e;e:{switch(o=Jn(n,r),n){case"dialog":ye("cancel",e),ye("close",e),l=r;break;case"iframe":case"object":case"embed":ye("load",e),l=r;break;case"video":case"audio":for(l=0;l<Br.length;l++)ye(Br[l],e);l=r;break;case"source":ye("error",e),l=r;break;case"img":case"image":case"link":ye("error",e),ye("load",e),l=r;break;case"details":ye("toggle",e),l=r;break;case"input":Wn(e,r),l=Lt(e,r),ye("invalid",e);break;case"option":l=r;break;case"select":e._wrapperState={wasMultiple:!!r.multiple},l=F({},r,{value:void 0}),ye("invalid",e);break;case"textarea":Ht(e,r),l=tn(e,r),ye("invalid",e);break;default:l=r}Tn(n,l),c=l;for(a in c)if(c.hasOwnProperty(a)){var p=c[a];a==="style"?wr(e,p):a==="dangerouslySetInnerHTML"?(p=p?p.__html:void 0,p!=null&&Wt(e,p)):a==="children"?typeof p=="string"?(n!=="textarea"||p!=="")&&$t(e,p):typeof p=="number"&&$t(e,""+p):a!=="suppressContentEditableWarning"&&a!=="suppressHydrationWarning"&&a!=="autoFocus"&&(g.hasOwnProperty(a)?p!=null&&a==="onScroll"&&ye("scroll",e):p!=null&&je(e,a,p,o))}switch(n){case"input":gt(e),Nn(e,r,!1);break;case"textarea":gt(e),it(e);break;case"option":r.value!=null&&e.setAttribute("value",""+oe(r.value));break;case"select":e.multiple=!!r.multiple,a=r.value,a!=null?Ae(e,!!r.multiple,a,!1):r.defaultValue!=null&&Ae(e,!!r.multiple,r.defaultValue,!0);break;default:typeof l.onClick=="function"&&(e.onclick=Rl)}switch(n){case"button":case"input":case"select":case"textarea":r=!!r.autoFocus;break e;case"img":r=!0;break e;default:r=!1}}r&&(t.flags|=4)}t.ref!==null&&(t.flags|=512,t.flags|=2097152)}return Ke(t),null;case 6:if(e&&t.stateNode!=null)pu(e,t,e.memoizedProps,r);else{if(typeof r!="string"&&t.stateNode===null)throw Error(i(166));if(n=$n(Gr.current),$n(Ut.current),Ul(t)){if(r=t.stateNode,n=t.memoizedProps,r[At]=t,(a=r.nodeValue!==n)&&(e=ut,e!==null))switch(e.tag){case 3:Ll(r.nodeValue,n,(e.mode&1)!==0);break;case 5:e.memoizedProps.suppressHydrationWarning!==!0&&Ll(r.nodeValue,n,(e.mode&1)!==0)}a&&(t.flags|=4)}else r=(n.nodeType===9?n:n.ownerDocument).createTextNode(r),r[At]=t,t.stateNode=r}return Ke(t),null;case 13:if(_e(be),r=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(Se&&ct!==null&&(t.mode&1)!==0&&(t.flags&128)===0)ms(),cr(),t.flags|=98560,a=!1;else if(a=Ul(t),r!==null&&r.dehydrated!==null){if(e===null){if(!a)throw Error(i(318));if(a=t.memoizedState,a=a!==null?a.dehydrated:null,!a)throw Error(i(317));a[At]=t}else cr(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;Ke(t),a=!1}else Nt!==null&&(Qo(Nt),Nt=null),a=!0;if(!a)return t.flags&65536?t:null}return(t.flags&128)!==0?(t.lanes=n,t):(r=r!==null,r!==(e!==null&&e.memoizedState!==null)&&r&&(t.child.flags|=8192,(t.mode&1)!==0&&(e===null||(be.current&1)!==0?Re===0&&(Re=3):Go())),t.updateQueue!==null&&(t.flags|=4),Ke(t),null);case 4:return gr(),Oo(e,t),e===null&&Vr(t.stateNode.containerInfo),Ke(t),null;case 10:return uo(t.type._context),Ke(t),null;case 17:return et(t.type)&&Ol(),Ke(t),null;case 19:if(_e(be),a=t.memoizedState,a===null)return Ke(t),null;if(r=(t.flags&128)!==0,o=a.rendering,o===null)if(r)tl(a,!1);else{if(Re!==0||e!==null&&(e.flags&128)!==0)for(e=t.child;e!==null;){if(o=Ql(e),o!==null){for(t.flags|=128,tl(a,!1),r=o.updateQueue,r!==null&&(t.updateQueue=r,t.flags|=4),t.subtreeFlags=0,r=n,n=t.child;n!==null;)a=n,e=r,a.flags&=14680066,o=a.alternate,o===null?(a.childLanes=0,a.lanes=e,a.child=null,a.subtreeFlags=0,a.memoizedProps=null,a.memoizedState=null,a.updateQueue=null,a.dependencies=null,a.stateNode=null):(a.childLanes=o.childLanes,a.lanes=o.lanes,a.child=o.child,a.subtreeFlags=0,a.deletions=null,a.memoizedProps=o.memoizedProps,a.memoizedState=o.memoizedState,a.updateQueue=o.updateQueue,a.type=o.type,e=o.dependencies,a.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext}),n=n.sibling;return xe(be,be.current&1|2),t.child}e=e.sibling}a.tail!==null&&Ne()>vr&&(t.flags|=128,r=!0,tl(a,!1),t.lanes=4194304)}else{if(!r)if(e=Ql(o),e!==null){if(t.flags|=128,r=!0,n=e.updateQueue,n!==null&&(t.updateQueue=n,t.flags|=4),tl(a,!0),a.tail===null&&a.tailMode==="hidden"&&!o.alternate&&!Se)return Ke(t),null}else 2*Ne()-a.renderingStartTime>vr&&n!==1073741824&&(t.flags|=128,r=!0,tl(a,!1),t.lanes=4194304);a.isBackwards?(o.sibling=t.child,t.child=o):(n=a.last,n!==null?n.sibling=o:t.child=o,a.last=o)}return a.tail!==null?(t=a.tail,a.rendering=t,a.tail=t.sibling,a.renderingStartTime=Ne(),t.sibling=null,n=be.current,xe(be,r?n&1|2:n&1),t):(Ke(t),null);case 22:case 23:return Jo(),r=t.memoizedState!==null,e!==null&&e.memoizedState!==null!==r&&(t.flags|=8192),r&&(t.mode&1)!==0?(dt&1073741824)!==0&&(Ke(t),t.subtreeFlags&6&&(t.flags|=8192)):Ke(t),null;case 24:return null;case 25:return null}throw Error(i(156,t.tag))}function Rd(e,t){switch(ro(t),t.tag){case 1:return et(t.type)&&Ol(),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return gr(),_e(Ze),_e(He),xo(),e=t.flags,(e&65536)!==0&&(e&128)===0?(t.flags=e&-65537|128,t):null;case 5:return mo(t),null;case 13:if(_e(be),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(i(340));cr()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return _e(be),null;case 4:return gr(),null;case 10:return uo(t.type._context),null;case 22:case 23:return Jo(),null;case 24:return null;default:return null}}var na=!1,Qe=!1,Dd=typeof WeakSet=="function"?WeakSet:Set,A=null;function hr(e,t){var n=e.ref;if(n!==null)if(typeof n=="function")try{n(null)}catch(r){Ce(e,t,r)}else n.current=null}function $o(e,t,n){try{n()}catch(r){Ce(e,t,r)}}var fu=!1;function Od(e,t){if(Ya=kl,e=Wi(),Aa(e)){if("selectionStart"in e)var n={start:e.selectionStart,end:e.selectionEnd};else e:{n=(n=e.ownerDocument)&&n.defaultView||window;var r=n.getSelection&&n.getSelection();if(r&&r.rangeCount!==0){n=r.anchorNode;var l=r.anchorOffset,a=r.focusNode;r=r.focusOffset;try{n.nodeType,a.nodeType}catch{n=null;break e}var o=0,c=-1,p=-1,w=0,N=0,j=e,C=null;t:for(;;){for(var I;j!==n||l!==0&&j.nodeType!==3||(c=o+l),j!==a||r!==0&&j.nodeType!==3||(p=o+r),j.nodeType===3&&(o+=j.nodeValue.length),(I=j.firstChild)!==null;)C=j,j=I;for(;;){if(j===e)break t;if(C===n&&++w===l&&(c=o),C===a&&++N===r&&(p=o),(I=j.nextSibling)!==null)break;j=C,C=j.parentNode}j=I}n=c===-1||p===-1?null:{start:c,end:p}}else n=null}n=n||{start:0,end:0}}else n=null;for(Ja={focusedElem:e,selectionRange:n},kl=!1,A=t;A!==null;)if(t=A,e=t.child,(t.subtreeFlags&1028)!==0&&e!==null)e.return=t,A=e;else for(;A!==null;){t=A;try{var B=t.alternate;if((t.flags&1024)!==0)switch(t.tag){case 0:case 11:case 15:break;case 1:if(B!==null){var V=B.memoizedProps,Te=B.memoizedState,v=t.stateNode,f=v.getSnapshotBeforeUpdate(t.elementType===t.type?V:Tt(t.type,V),Te);v.__reactInternalSnapshotBeforeUpdate=f}break;case 3:var y=t.stateNode.containerInfo;y.nodeType===1?y.textContent="":y.nodeType===9&&y.documentElement&&y.removeChild(y.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(i(163))}}catch(L){Ce(t,t.return,L)}if(e=t.sibling,e!==null){e.return=t.return,A=e;break}A=t.return}return B=fu,fu=!1,B}function nl(e,t,n){var r=t.updateQueue;if(r=r!==null?r.lastEffect:null,r!==null){var l=r=r.next;do{if((l.tag&e)===e){var a=l.destroy;l.destroy=void 0,a!==void 0&&$o(t,n,a)}l=l.next}while(l!==r)}}function ra(e,t){if(t=t.updateQueue,t=t!==null?t.lastEffect:null,t!==null){var n=t=t.next;do{if((n.tag&e)===e){var r=n.create;n.destroy=r()}n=n.next}while(n!==t)}}function Io(e){var t=e.ref;if(t!==null){var n=e.stateNode;switch(e.tag){case 5:e=n;break;default:e=n}typeof t=="function"?t(e):t.current=e}}function gu(e){var t=e.alternate;t!==null&&(e.alternate=null,gu(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&(delete t[At],delete t[Wr],delete t[Za],delete t[vd],delete t[yd])),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}function mu(e){return e.tag===5||e.tag===3||e.tag===4}function hu(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||mu(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function Fo(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?n.nodeType===8?n.parentNode.insertBefore(e,t):n.insertBefore(e,t):(n.nodeType===8?(t=n.parentNode,t.insertBefore(e,n)):(t=n,t.appendChild(e)),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=Rl));else if(r!==4&&(e=e.child,e!==null))for(Fo(e,t,n),e=e.sibling;e!==null;)Fo(e,t,n),e=e.sibling}function Ao(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?n.insertBefore(e,t):n.appendChild(e);else if(r!==4&&(e=e.child,e!==null))for(Ao(e,t,n),e=e.sibling;e!==null;)Ao(e,t,n),e=e.sibling}var Ue=null,jt=!1;function yn(e,t,n){for(n=n.child;n!==null;)xu(e,t,n),n=n.sibling}function xu(e,t,n){if(Ft&&typeof Ft.onCommitFiberUnmount=="function")try{Ft.onCommitFiberUnmount(hl,n)}catch{}switch(n.tag){case 5:Qe||hr(n,t);case 6:var r=Ue,l=jt;Ue=null,yn(e,t,n),Ue=r,jt=l,Ue!==null&&(jt?(e=Ue,n=n.stateNode,e.nodeType===8?e.parentNode.removeChild(n):e.removeChild(n)):Ue.removeChild(n.stateNode));break;case 18:Ue!==null&&(jt?(e=Ue,n=n.stateNode,e.nodeType===8?Xa(e.parentNode,n):e.nodeType===1&&Xa(e,n),Rr(e)):Xa(Ue,n.stateNode));break;case 4:r=Ue,l=jt,Ue=n.stateNode.containerInfo,jt=!0,yn(e,t,n),Ue=r,jt=l;break;case 0:case 11:case 14:case 15:if(!Qe&&(r=n.updateQueue,r!==null&&(r=r.lastEffect,r!==null))){l=r=r.next;do{var a=l,o=a.destroy;a=a.tag,o!==void 0&&((a&2)!==0||(a&4)!==0)&&$o(n,t,o),l=l.next}while(l!==r)}yn(e,t,n);break;case 1:if(!Qe&&(hr(n,t),r=n.stateNode,typeof r.componentWillUnmount=="function"))try{r.props=n.memoizedProps,r.state=n.memoizedState,r.componentWillUnmount()}catch(c){Ce(n,t,c)}yn(e,t,n);break;case 21:yn(e,t,n);break;case 22:n.mode&1?(Qe=(r=Qe)||n.memoizedState!==null,yn(e,t,n),Qe=r):yn(e,t,n);break;default:yn(e,t,n)}}function vu(e){var t=e.updateQueue;if(t!==null){e.updateQueue=null;var n=e.stateNode;n===null&&(n=e.stateNode=new Dd),t.forEach(function(r){var l=Wd.bind(null,e,r);n.has(r)||(n.add(r),r.then(l,l))})}}function zt(e,t){var n=t.deletions;if(n!==null)for(var r=0;r<n.length;r++){var l=n[r];try{var a=e,o=t,c=o;e:for(;c!==null;){switch(c.tag){case 5:Ue=c.stateNode,jt=!1;break e;case 3:Ue=c.stateNode.containerInfo,jt=!0;break e;case 4:Ue=c.stateNode.containerInfo,jt=!0;break e}c=c.return}if(Ue===null)throw Error(i(160));xu(a,o,l),Ue=null,jt=!1;var p=l.alternate;p!==null&&(p.return=null),l.return=null}catch(w){Ce(l,t,w)}}if(t.subtreeFlags&12854)for(t=t.child;t!==null;)yu(t,e),t=t.sibling}function yu(e,t){var n=e.alternate,r=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if(zt(t,e),Vt(e),r&4){try{nl(3,e,e.return),ra(3,e)}catch(V){Ce(e,e.return,V)}try{nl(5,e,e.return)}catch(V){Ce(e,e.return,V)}}break;case 1:zt(t,e),Vt(e),r&512&&n!==null&&hr(n,n.return);break;case 5:if(zt(t,e),Vt(e),r&512&&n!==null&&hr(n,n.return),e.flags&32){var l=e.stateNode;try{$t(l,"")}catch(V){Ce(e,e.return,V)}}if(r&4&&(l=e.stateNode,l!=null)){var a=e.memoizedProps,o=n!==null?n.memoizedProps:a,c=e.type,p=e.updateQueue;if(e.updateQueue=null,p!==null)try{c==="input"&&a.type==="radio"&&a.name!=null&&Rt(l,a),Jn(c,o);var w=Jn(c,a);for(o=0;o<p.length;o+=2){var N=p[o],j=p[o+1];N==="style"?wr(l,j):N==="dangerouslySetInnerHTML"?Wt(l,j):N==="children"?$t(l,j):je(l,N,j,w)}switch(c){case"input":Dt(l,a);break;case"textarea":Kn(l,a);break;case"select":var C=l._wrapperState.wasMultiple;l._wrapperState.wasMultiple=!!a.multiple;var I=a.value;I!=null?Ae(l,!!a.multiple,I,!1):C!==!!a.multiple&&(a.defaultValue!=null?Ae(l,!!a.multiple,a.defaultValue,!0):Ae(l,!!a.multiple,a.multiple?[]:"",!1))}l[Wr]=a}catch(V){Ce(e,e.return,V)}}break;case 6:if(zt(t,e),Vt(e),r&4){if(e.stateNode===null)throw Error(i(162));l=e.stateNode,a=e.memoizedProps;try{l.nodeValue=a}catch(V){Ce(e,e.return,V)}}break;case 3:if(zt(t,e),Vt(e),r&4&&n!==null&&n.memoizedState.isDehydrated)try{Rr(t.containerInfo)}catch(V){Ce(e,e.return,V)}break;case 4:zt(t,e),Vt(e);break;case 13:zt(t,e),Vt(e),l=e.child,l.flags&8192&&(a=l.memoizedState!==null,l.stateNode.isHidden=a,!a||l.alternate!==null&&l.alternate.memoizedState!==null||(Vo=Ne())),r&4&&vu(e);break;case 22:if(N=n!==null&&n.memoizedState!==null,e.mode&1?(Qe=(w=Qe)||N,zt(t,e),Qe=w):zt(t,e),Vt(e),r&8192){if(w=e.memoizedState!==null,(e.stateNode.isHidden=w)&&!N&&(e.mode&1)!==0)for(A=e,N=e.child;N!==null;){for(j=A=N;A!==null;){switch(C=A,I=C.child,C.tag){case 0:case 11:case 14:case 15:nl(4,C,C.return);break;case 1:hr(C,C.return);var B=C.stateNode;if(typeof B.componentWillUnmount=="function"){r=C,n=C.return;try{t=r,B.props=t.memoizedProps,B.state=t.memoizedState,B.componentWillUnmount()}catch(V){Ce(r,n,V)}}break;case 5:hr(C,C.return);break;case 22:if(C.memoizedState!==null){ku(j);continue}}I!==null?(I.return=C,A=I):ku(j)}N=N.sibling}e:for(N=null,j=e;;){if(j.tag===5){if(N===null){N=j;try{l=j.stateNode,w?(a=l.style,typeof a.setProperty=="function"?a.setProperty("display","none","important"):a.display="none"):(c=j.stateNode,p=j.memoizedProps.style,o=p!=null&&p.hasOwnProperty("display")?p.display:null,c.style.display=cl("display",o))}catch(V){Ce(e,e.return,V)}}}else if(j.tag===6){if(N===null)try{j.stateNode.nodeValue=w?"":j.memoizedProps}catch(V){Ce(e,e.return,V)}}else if((j.tag!==22&&j.tag!==23||j.memoizedState===null||j===e)&&j.child!==null){j.child.return=j,j=j.child;continue}if(j===e)break e;for(;j.sibling===null;){if(j.return===null||j.return===e)break e;N===j&&(N=null),j=j.return}N===j&&(N=null),j.sibling.return=j.return,j=j.sibling}}break;case 19:zt(t,e),Vt(e),r&4&&vu(e);break;case 21:break;default:zt(t,e),Vt(e)}}function Vt(e){var t=e.flags;if(t&2){try{e:{for(var n=e.return;n!==null;){if(mu(n)){var r=n;break e}n=n.return}throw Error(i(160))}switch(r.tag){case 5:var l=r.stateNode;r.flags&32&&($t(l,""),r.flags&=-33);var a=hu(e);Ao(e,a,l);break;case 3:case 4:var o=r.stateNode.containerInfo,c=hu(e);Fo(e,c,o);break;default:throw Error(i(161))}}catch(p){Ce(e,e.return,p)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function $d(e,t,n){A=e,_u(e)}function _u(e,t,n){for(var r=(e.mode&1)!==0;A!==null;){var l=A,a=l.child;if(l.tag===22&&r){var o=l.memoizedState!==null||na;if(!o){var c=l.alternate,p=c!==null&&c.memoizedState!==null||Qe;c=na;var w=Qe;if(na=o,(Qe=p)&&!w)for(A=l;A!==null;)o=A,p=o.child,o.tag===22&&o.memoizedState!==null?Su(l):p!==null?(p.return=o,A=p):Su(l);for(;a!==null;)A=a,_u(a),a=a.sibling;A=l,na=c,Qe=w}wu(e)}else(l.subtreeFlags&8772)!==0&&a!==null?(a.return=l,A=a):wu(e)}}function wu(e){for(;A!==null;){var t=A;if((t.flags&8772)!==0){var n=t.alternate;try{if((t.flags&8772)!==0)switch(t.tag){case 0:case 11:case 15:Qe||ra(5,t);break;case 1:var r=t.stateNode;if(t.flags&4&&!Qe)if(n===null)r.componentDidMount();else{var l=t.elementType===t.type?n.memoizedProps:Tt(t.type,n.memoizedProps);r.componentDidUpdate(l,n.memoizedState,r.__reactInternalSnapshotBeforeUpdate)}var a=t.updateQueue;a!==null&&ks(t,a,r);break;case 3:var o=t.updateQueue;if(o!==null){if(n=null,t.child!==null)switch(t.child.tag){case 5:n=t.child.stateNode;break;case 1:n=t.child.stateNode}ks(t,o,n)}break;case 5:var c=t.stateNode;if(n===null&&t.flags&4){n=c;var p=t.memoizedProps;switch(t.type){case"button":case"input":case"select":case"textarea":p.autoFocus&&n.focus();break;case"img":p.src&&(n.src=p.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(t.memoizedState===null){var w=t.alternate;if(w!==null){var N=w.memoizedState;if(N!==null){var j=N.dehydrated;j!==null&&Rr(j)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(i(163))}Qe||t.flags&512&&Io(t)}catch(C){Ce(t,t.return,C)}}if(t===e){A=null;break}if(n=t.sibling,n!==null){n.return=t.return,A=n;break}A=t.return}}function ku(e){for(;A!==null;){var t=A;if(t===e){A=null;break}var n=t.sibling;if(n!==null){n.return=t.return,A=n;break}A=t.return}}function Su(e){for(;A!==null;){var t=A;try{switch(t.tag){case 0:case 11:case 15:var n=t.return;try{ra(4,t)}catch(p){Ce(t,n,p)}break;case 1:var r=t.stateNode;if(typeof r.componentDidMount=="function"){var l=t.return;try{r.componentDidMount()}catch(p){Ce(t,l,p)}}var a=t.return;try{Io(t)}catch(p){Ce(t,a,p)}break;case 5:var o=t.return;try{Io(t)}catch(p){Ce(t,o,p)}}}catch(p){Ce(t,t.return,p)}if(t===e){A=null;break}var c=t.sibling;if(c!==null){c.return=t.return,A=c;break}A=t.return}}var Id=Math.ceil,la=we.ReactCurrentDispatcher,Uo=we.ReactCurrentOwner,_t=we.ReactCurrentBatchConfig,se=0,$e=null,Pe=null,Be=0,dt=0,xr=gn(0),Re=0,rl=null,Fn=0,aa=0,Bo=0,ll=null,nt=null,Vo=0,vr=1/0,Zt=null,oa=!1,Ho=null,_n=null,ia=!1,wn=null,sa=0,al=0,Wo=null,ua=-1,ca=0;function Ge(){return(se&6)!==0?Ne():ua!==-1?ua:ua=Ne()}function kn(e){return(e.mode&1)===0?1:(se&2)!==0&&Be!==0?Be&-Be:wd.transition!==null?(ca===0&&(ca=hi()),ca):(e=fe,e!==0||(e=window.event,e=e===void 0?16:Ei(e.type)),e)}function Pt(e,t,n,r){if(50<al)throw al=0,Wo=null,Error(i(185));jr(e,n,r),((se&2)===0||e!==$e)&&(e===$e&&((se&2)===0&&(aa|=n),Re===4&&Sn(e,Be)),rt(e,r),n===1&&se===0&&(t.mode&1)===0&&(vr=Ne()+500,Il&&hn()))}function rt(e,t){var n=e.callbackNode;wc(e,t);var r=yl(e,e===$e?Be:0);if(r===0)n!==null&&mt(n),e.callbackNode=null,e.callbackPriority=0;else if(t=r&-r,e.callbackPriority!==t){if(n!=null&&mt(n),t===1)e.tag===0?_d(Eu.bind(null,e)):cs(Eu.bind(null,e)),hd(function(){(se&6)===0&&hn()}),n=null;else{switch(xi(r)){case 1:n=Sa;break;case 4:n=gi;break;case 16:n=ml;break;case 536870912:n=mi;break;default:n=ml}n=Lu(n,bu.bind(null,e))}e.callbackPriority=t,e.callbackNode=n}}function bu(e,t){if(ua=-1,ca=0,(se&6)!==0)throw Error(i(327));var n=e.callbackNode;if(yr()&&e.callbackNode!==n)return null;var r=yl(e,e===$e?Be:0);if(r===0)return null;if((r&30)!==0||(r&e.expiredLanes)!==0||t)t=da(e,r);else{t=r;var l=se;se|=2;var a=Nu();($e!==e||Be!==t)&&(Zt=null,vr=Ne()+500,Un(e,t));do try{Ud();break}catch(c){Cu(e,c)}while(!0);so(),la.current=a,se=l,Pe!==null?t=0:($e=null,Be=0,t=Re)}if(t!==0){if(t===2&&(l=ba(e),l!==0&&(r=l,t=Ko(e,l))),t===1)throw n=rl,Un(e,0),Sn(e,r),rt(e,Ne()),n;if(t===6)Sn(e,r);else{if(l=e.current.alternate,(r&30)===0&&!Fd(l)&&(t=da(e,r),t===2&&(a=ba(e),a!==0&&(r=a,t=Ko(e,a))),t===1))throw n=rl,Un(e,0),Sn(e,r),rt(e,Ne()),n;switch(e.finishedWork=l,e.finishedLanes=r,t){case 0:case 1:throw Error(i(345));case 2:Bn(e,nt,Zt);break;case 3:if(Sn(e,r),(r&130023424)===r&&(t=Vo+500-Ne(),10<t)){if(yl(e,0)!==0)break;if(l=e.suspendedLanes,(l&r)!==r){Ge(),e.pingedLanes|=e.suspendedLanes&l;break}e.timeoutHandle=qa(Bn.bind(null,e,nt,Zt),t);break}Bn(e,nt,Zt);break;case 4:if(Sn(e,r),(r&4194240)===r)break;for(t=e.eventTimes,l=-1;0<r;){var o=31-Et(r);a=1<<o,o=t[o],o>l&&(l=o),r&=~a}if(r=l,r=Ne()-r,r=(120>r?120:480>r?480:1080>r?1080:1920>r?1920:3e3>r?3e3:4320>r?4320:1960*Id(r/1960))-r,10<r){e.timeoutHandle=qa(Bn.bind(null,e,nt,Zt),r);break}Bn(e,nt,Zt);break;case 5:Bn(e,nt,Zt);break;default:throw Error(i(329))}}}return rt(e,Ne()),e.callbackNode===n?bu.bind(null,e):null}function Ko(e,t){var n=ll;return e.current.memoizedState.isDehydrated&&(Un(e,t).flags|=256),e=da(e,t),e!==2&&(t=nt,nt=n,t!==null&&Qo(t)),e}function Qo(e){nt===null?nt=e:nt.push.apply(nt,e)}function Fd(e){for(var t=e;;){if(t.flags&16384){var n=t.updateQueue;if(n!==null&&(n=n.stores,n!==null))for(var r=0;r<n.length;r++){var l=n[r],a=l.getSnapshot;l=l.value;try{if(!Ct(a(),l))return!1}catch{return!1}}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function Sn(e,t){for(t&=~Bo,t&=~aa,e.suspendedLanes|=t,e.pingedLanes&=~t,e=e.expirationTimes;0<t;){var n=31-Et(t),r=1<<n;e[n]=-1,t&=~r}}function Eu(e){if((se&6)!==0)throw Error(i(327));yr();var t=yl(e,0);if((t&1)===0)return rt(e,Ne()),null;var n=da(e,t);if(e.tag!==0&&n===2){var r=ba(e);r!==0&&(t=r,n=Ko(e,r))}if(n===1)throw n=rl,Un(e,0),Sn(e,t),rt(e,Ne()),n;if(n===6)throw Error(i(345));return e.finishedWork=e.current.alternate,e.finishedLanes=t,Bn(e,nt,Zt),rt(e,Ne()),null}function Yo(e,t){var n=se;se|=1;try{return e(t)}finally{se=n,se===0&&(vr=Ne()+500,Il&&hn())}}function An(e){wn!==null&&wn.tag===0&&(se&6)===0&&yr();var t=se;se|=1;var n=_t.transition,r=fe;try{if(_t.transition=null,fe=1,e)return e()}finally{fe=r,_t.transition=n,se=t,(se&6)===0&&hn()}}function Jo(){dt=xr.current,_e(xr)}function Un(e,t){e.finishedWork=null,e.finishedLanes=0;var n=e.timeoutHandle;if(n!==-1&&(e.timeoutHandle=-1,md(n)),Pe!==null)for(n=Pe.return;n!==null;){var r=n;switch(ro(r),r.tag){case 1:r=r.type.childContextTypes,r!=null&&Ol();break;case 3:gr(),_e(Ze),_e(He),xo();break;case 5:mo(r);break;case 4:gr();break;case 13:_e(be);break;case 19:_e(be);break;case 10:uo(r.type._context);break;case 22:case 23:Jo()}n=n.return}if($e=e,Pe=e=bn(e.current,null),Be=dt=t,Re=0,rl=null,Bo=aa=Fn=0,nt=ll=null,On!==null){for(t=0;t<On.length;t++)if(n=On[t],r=n.interleaved,r!==null){n.interleaved=null;var l=r.next,a=n.pending;if(a!==null){var o=a.next;a.next=l,r.next=o}n.pending=r}On=null}return e}function Cu(e,t){do{var n=Pe;try{if(so(),Yl.current=Xl,Jl){for(var r=Ee.memoizedState;r!==null;){var l=r.queue;l!==null&&(l.pending=null),r=r.next}Jl=!1}if(In=0,Oe=Le=Ee=null,qr=!1,Xr=0,Uo.current=null,n===null||n.return===null){Re=1,rl=t,Pe=null;break}e:{var a=e,o=n.return,c=n,p=t;if(t=Be,c.flags|=32768,p!==null&&typeof p=="object"&&typeof p.then=="function"){var w=p,N=c,j=N.tag;if((N.mode&1)===0&&(j===0||j===11||j===15)){var C=N.alternate;C?(N.updateQueue=C.updateQueue,N.memoizedState=C.memoizedState,N.lanes=C.lanes):(N.updateQueue=null,N.memoizedState=null)}var I=qs(o);if(I!==null){I.flags&=-257,Xs(I,o,c,a,t),I.mode&1&&Gs(a,w,t),t=I,p=w;var B=t.updateQueue;if(B===null){var V=new Set;V.add(p),t.updateQueue=V}else B.add(p);break e}else{if((t&1)===0){Gs(a,w,t),Go();break e}p=Error(i(426))}}else if(Se&&c.mode&1){var Te=qs(o);if(Te!==null){(Te.flags&65536)===0&&(Te.flags|=256),Xs(Te,o,c,a,t),oo(mr(p,c));break e}}a=p=mr(p,c),Re!==4&&(Re=2),ll===null?ll=[a]:ll.push(a),a=o;do{switch(a.tag){case 3:a.flags|=65536,t&=-t,a.lanes|=t;var v=Ys(a,p,t);ws(a,v);break e;case 1:c=p;var f=a.type,y=a.stateNode;if((a.flags&128)===0&&(typeof f.getDerivedStateFromError=="function"||y!==null&&typeof y.componentDidCatch=="function"&&(_n===null||!_n.has(y)))){a.flags|=65536,t&=-t,a.lanes|=t;var L=Js(a,c,t);ws(a,L);break e}}a=a.return}while(a!==null)}ju(n)}catch(H){t=H,Pe===n&&n!==null&&(Pe=n=n.return);continue}break}while(!0)}function Nu(){var e=la.current;return la.current=Xl,e===null?Xl:e}function Go(){(Re===0||Re===3||Re===2)&&(Re=4),$e===null||(Fn&268435455)===0&&(aa&268435455)===0||Sn($e,Be)}function da(e,t){var n=se;se|=2;var r=Nu();($e!==e||Be!==t)&&(Zt=null,Un(e,t));do try{Ad();break}catch(l){Cu(e,l)}while(!0);if(so(),se=n,la.current=r,Pe!==null)throw Error(i(261));return $e=null,Be=0,Re}function Ad(){for(;Pe!==null;)Tu(Pe)}function Ud(){for(;Pe!==null&&!pc();)Tu(Pe)}function Tu(e){var t=Mu(e.alternate,e,dt);e.memoizedProps=e.pendingProps,t===null?ju(e):Pe=t,Uo.current=null}function ju(e){var t=e;do{var n=t.alternate;if(e=t.return,(t.flags&32768)===0){if(n=Ld(n,t,dt),n!==null){Pe=n;return}}else{if(n=Rd(n,t),n!==null){n.flags&=32767,Pe=n;return}if(e!==null)e.flags|=32768,e.subtreeFlags=0,e.deletions=null;else{Re=6,Pe=null;return}}if(t=t.sibling,t!==null){Pe=t;return}Pe=t=e}while(t!==null);Re===0&&(Re=5)}function Bn(e,t,n){var r=fe,l=_t.transition;try{_t.transition=null,fe=1,Bd(e,t,n,r)}finally{_t.transition=l,fe=r}return null}function Bd(e,t,n,r){do yr();while(wn!==null);if((se&6)!==0)throw Error(i(327));n=e.finishedWork;var l=e.finishedLanes;if(n===null)return null;if(e.finishedWork=null,e.finishedLanes=0,n===e.current)throw Error(i(177));e.callbackNode=null,e.callbackPriority=0;var a=n.lanes|n.childLanes;if(kc(e,a),e===$e&&(Pe=$e=null,Be=0),(n.subtreeFlags&2064)===0&&(n.flags&2064)===0||ia||(ia=!0,Lu(ml,function(){return yr(),null})),a=(n.flags&15990)!==0,(n.subtreeFlags&15990)!==0||a){a=_t.transition,_t.transition=null;var o=fe;fe=1;var c=se;se|=4,Uo.current=null,Od(e,n),yu(n,e),sd(Ja),kl=!!Ya,Ja=Ya=null,e.current=n,$d(n),fc(),se=c,fe=o,_t.transition=a}else e.current=n;if(ia&&(ia=!1,wn=e,sa=l),a=e.pendingLanes,a===0&&(_n=null),hc(n.stateNode),rt(e,Ne()),t!==null)for(r=e.onRecoverableError,n=0;n<t.length;n++)l=t[n],r(l.value,{componentStack:l.stack,digest:l.digest});if(oa)throw oa=!1,e=Ho,Ho=null,e;return(sa&1)!==0&&e.tag!==0&&yr(),a=e.pendingLanes,(a&1)!==0?e===Wo?al++:(al=0,Wo=e):al=0,hn(),null}function yr(){if(wn!==null){var e=xi(sa),t=_t.transition,n=fe;try{if(_t.transition=null,fe=16>e?16:e,wn===null)var r=!1;else{if(e=wn,wn=null,sa=0,(se&6)!==0)throw Error(i(331));var l=se;for(se|=4,A=e.current;A!==null;){var a=A,o=a.child;if((A.flags&16)!==0){var c=a.deletions;if(c!==null){for(var p=0;p<c.length;p++){var w=c[p];for(A=w;A!==null;){var N=A;switch(N.tag){case 0:case 11:case 15:nl(8,N,a)}var j=N.child;if(j!==null)j.return=N,A=j;else for(;A!==null;){N=A;var C=N.sibling,I=N.return;if(gu(N),N===w){A=null;break}if(C!==null){C.return=I,A=C;break}A=I}}}var B=a.alternate;if(B!==null){var V=B.child;if(V!==null){B.child=null;do{var Te=V.sibling;V.sibling=null,V=Te}while(V!==null)}}A=a}}if((a.subtreeFlags&2064)!==0&&o!==null)o.return=a,A=o;else e:for(;A!==null;){if(a=A,(a.flags&2048)!==0)switch(a.tag){case 0:case 11:case 15:nl(9,a,a.return)}var v=a.sibling;if(v!==null){v.return=a.return,A=v;break e}A=a.return}}var f=e.current;for(A=f;A!==null;){o=A;var y=o.child;if((o.subtreeFlags&2064)!==0&&y!==null)y.return=o,A=y;else e:for(o=f;A!==null;){if(c=A,(c.flags&2048)!==0)try{switch(c.tag){case 0:case 11:case 15:ra(9,c)}}catch(H){Ce(c,c.return,H)}if(c===o){A=null;break e}var L=c.sibling;if(L!==null){L.return=c.return,A=L;break e}A=c.return}}if(se=l,hn(),Ft&&typeof Ft.onPostCommitFiberRoot=="function")try{Ft.onPostCommitFiberRoot(hl,e)}catch{}r=!0}return r}finally{fe=n,_t.transition=t}}return!1}function zu(e,t,n){t=mr(n,t),t=Ys(e,t,1),e=vn(e,t,1),t=Ge(),e!==null&&(jr(e,1,t),rt(e,t))}function Ce(e,t,n){if(e.tag===3)zu(e,e,n);else for(;t!==null;){if(t.tag===3){zu(t,e,n);break}else if(t.tag===1){var r=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof r.componentDidCatch=="function"&&(_n===null||!_n.has(r))){e=mr(n,e),e=Js(t,e,1),t=vn(t,e,1),e=Ge(),t!==null&&(jr(t,1,e),rt(t,e));break}}t=t.return}}function Vd(e,t,n){var r=e.pingCache;r!==null&&r.delete(t),t=Ge(),e.pingedLanes|=e.suspendedLanes&n,$e===e&&(Be&n)===n&&(Re===4||Re===3&&(Be&130023424)===Be&&500>Ne()-Vo?Un(e,0):Bo|=n),rt(e,t)}function Pu(e,t){t===0&&((e.mode&1)===0?t=1:(t=vl,vl<<=1,(vl&130023424)===0&&(vl=4194304)));var n=Ge();e=Gt(e,t),e!==null&&(jr(e,t,n),rt(e,n))}function Hd(e){var t=e.memoizedState,n=0;t!==null&&(n=t.retryLane),Pu(e,n)}function Wd(e,t){var n=0;switch(e.tag){case 13:var r=e.stateNode,l=e.memoizedState;l!==null&&(n=l.retryLane);break;case 19:r=e.stateNode;break;default:throw Error(i(314))}r!==null&&r.delete(t),Pu(e,n)}var Mu;Mu=function(e,t,n){if(e!==null)if(e.memoizedProps!==t.pendingProps||Ze.current)tt=!0;else{if((e.lanes&n)===0&&(t.flags&128)===0)return tt=!1,Md(e,t,n);tt=(e.flags&131072)!==0}else tt=!1,Se&&(t.flags&1048576)!==0&&ds(t,Al,t.index);switch(t.lanes=0,t.tag){case 2:var r=t.type;ta(e,t),e=t.pendingProps;var l=ir(t,He.current);fr(t,n),l=_o(null,t,r,e,l,n);var a=wo();return t.flags|=1,typeof l=="object"&&l!==null&&typeof l.render=="function"&&l.$$typeof===void 0?(t.tag=1,t.memoizedState=null,t.updateQueue=null,et(r)?(a=!0,$l(t)):a=!1,t.memoizedState=l.state!==null&&l.state!==void 0?l.state:null,fo(t),l.updater=Zl,t.stateNode=l,l._reactInternals=t,No(t,r,e,n),t=Po(null,t,r,!0,a,n)):(t.tag=0,Se&&a&&no(t),Je(null,t,l,n),t=t.child),t;case 16:r=t.elementType;e:{switch(ta(e,t),e=t.pendingProps,l=r._init,r=l(r._payload),t.type=r,l=t.tag=Qd(r),e=Tt(r,e),l){case 0:t=zo(null,t,r,e,n);break e;case 1:t=lu(null,t,r,e,n);break e;case 11:t=Zs(null,t,r,e,n);break e;case 14:t=eu(null,t,r,Tt(r.type,e),n);break e}throw Error(i(306,r,""))}return t;case 0:return r=t.type,l=t.pendingProps,l=t.elementType===r?l:Tt(r,l),zo(e,t,r,l,n);case 1:return r=t.type,l=t.pendingProps,l=t.elementType===r?l:Tt(r,l),lu(e,t,r,l,n);case 3:e:{if(au(t),e===null)throw Error(i(387));r=t.pendingProps,a=t.memoizedState,l=a.element,_s(e,t),Kl(t,r,null,n);var o=t.memoizedState;if(r=o.element,a.isDehydrated)if(a={element:r,isDehydrated:!1,cache:o.cache,pendingSuspenseBoundaries:o.pendingSuspenseBoundaries,transitions:o.transitions},t.updateQueue.baseState=a,t.memoizedState=a,t.flags&256){l=mr(Error(i(423)),t),t=ou(e,t,r,n,l);break e}else if(r!==l){l=mr(Error(i(424)),t),t=ou(e,t,r,n,l);break e}else for(ct=fn(t.stateNode.containerInfo.firstChild),ut=t,Se=!0,Nt=null,n=vs(t,null,r,n),t.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(cr(),r===l){t=Xt(e,t,n);break e}Je(e,t,r,n)}t=t.child}return t;case 5:return Ss(t),e===null&&ao(t),r=t.type,l=t.pendingProps,a=e!==null?e.memoizedProps:null,o=l.children,Ga(r,l)?o=null:a!==null&&Ga(r,a)&&(t.flags|=32),ru(e,t),Je(e,t,o,n),t.child;case 6:return e===null&&ao(t),null;case 13:return iu(e,t,n);case 4:return go(t,t.stateNode.containerInfo),r=t.pendingProps,e===null?t.child=dr(t,null,r,n):Je(e,t,r,n),t.child;case 11:return r=t.type,l=t.pendingProps,l=t.elementType===r?l:Tt(r,l),Zs(e,t,r,l,n);case 7:return Je(e,t,t.pendingProps,n),t.child;case 8:return Je(e,t,t.pendingProps.children,n),t.child;case 12:return Je(e,t,t.pendingProps.children,n),t.child;case 10:e:{if(r=t.type._context,l=t.pendingProps,a=t.memoizedProps,o=l.value,xe(Vl,r._currentValue),r._currentValue=o,a!==null)if(Ct(a.value,o)){if(a.children===l.children&&!Ze.current){t=Xt(e,t,n);break e}}else for(a=t.child,a!==null&&(a.return=t);a!==null;){var c=a.dependencies;if(c!==null){o=a.child;for(var p=c.firstContext;p!==null;){if(p.context===r){if(a.tag===1){p=qt(-1,n&-n),p.tag=2;var w=a.updateQueue;if(w!==null){w=w.shared;var N=w.pending;N===null?p.next=p:(p.next=N.next,N.next=p),w.pending=p}}a.lanes|=n,p=a.alternate,p!==null&&(p.lanes|=n),co(a.return,n,t),c.lanes|=n;break}p=p.next}}else if(a.tag===10)o=a.type===t.type?null:a.child;else if(a.tag===18){if(o=a.return,o===null)throw Error(i(341));o.lanes|=n,c=o.alternate,c!==null&&(c.lanes|=n),co(o,n,t),o=a.sibling}else o=a.child;if(o!==null)o.return=a;else for(o=a;o!==null;){if(o===t){o=null;break}if(a=o.sibling,a!==null){a.return=o.return,o=a;break}o=o.return}a=o}Je(e,t,l.children,n),t=t.child}return t;case 9:return l=t.type,r=t.pendingProps.children,fr(t,n),l=vt(l),r=r(l),t.flags|=1,Je(e,t,r,n),t.child;case 14:return r=t.type,l=Tt(r,t.pendingProps),l=Tt(r.type,l),eu(e,t,r,l,n);case 15:return tu(e,t,t.type,t.pendingProps,n);case 17:return r=t.type,l=t.pendingProps,l=t.elementType===r?l:Tt(r,l),ta(e,t),t.tag=1,et(r)?(e=!0,$l(t)):e=!1,fr(t,n),Ks(t,r,l),No(t,r,l,n),Po(null,t,r,!0,e,n);case 19:return uu(e,t,n);case 22:return nu(e,t,n)}throw Error(i(156,t.tag))};function Lu(e,t){return ke(e,t)}function Kd(e,t,n,r){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=r,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function wt(e,t,n,r){return new Kd(e,t,n,r)}function qo(e){return e=e.prototype,!(!e||!e.isReactComponent)}function Qd(e){if(typeof e=="function")return qo(e)?1:0;if(e!=null){if(e=e.$$typeof,e===at)return 11;if(e===ft)return 14}return 2}function bn(e,t){var n=e.alternate;return n===null?(n=wt(e.tag,t,e.key,e.mode),n.elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=e.flags&14680064,n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n}function pa(e,t,n,r,l,a){var o=2;if(r=e,typeof e=="function")qo(e)&&(o=1);else if(typeof e=="string")o=5;else e:switch(e){case ze:return Vn(n.children,l,a,t);case De:o=8,l|=8;break;case St:return e=wt(12,n,t,l|2),e.elementType=St,e.lanes=a,e;case Ye:return e=wt(13,n,t,l),e.elementType=Ye,e.lanes=a,e;case ot:return e=wt(19,n,t,l),e.elementType=ot,e.lanes=a,e;case ve:return fa(n,l,a,t);default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case pt:o=10;break e;case Mt:o=9;break e;case at:o=11;break e;case ft:o=14;break e;case Fe:o=16,r=null;break e}throw Error(i(130,e==null?e:typeof e,""))}return t=wt(o,n,t,l),t.elementType=e,t.type=r,t.lanes=a,t}function Vn(e,t,n,r){return e=wt(7,e,r,t),e.lanes=n,e}function fa(e,t,n,r){return e=wt(22,e,r,t),e.elementType=ve,e.lanes=n,e.stateNode={isHidden:!1},e}function Xo(e,t,n){return e=wt(6,e,null,t),e.lanes=n,e}function Zo(e,t,n){return t=wt(4,e.children!==null?e.children:[],e.key,t),t.lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}function Yd(e,t,n,r,l){this.tag=t,this.containerInfo=e,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=Ea(0),this.expirationTimes=Ea(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Ea(0),this.identifierPrefix=r,this.onRecoverableError=l,this.mutableSourceEagerHydrationData=null}function ei(e,t,n,r,l,a,o,c,p){return e=new Yd(e,t,n,c,p),t===1?(t=1,a===!0&&(t|=8)):t=0,a=wt(3,null,null,t),e.current=a,a.stateNode=e,a.memoizedState={element:r,isDehydrated:n,cache:null,transitions:null,pendingSuspenseBoundaries:null},fo(a),e}function Jd(e,t,n){var r=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:ce,key:r==null?null:""+r,children:e,containerInfo:t,implementation:n}}function Ru(e){if(!e)return mn;e=e._reactInternals;e:{if($(e)!==e||e.tag!==1)throw Error(i(170));var t=e;do{switch(t.tag){case 3:t=t.stateNode.context;break e;case 1:if(et(t.type)){t=t.stateNode.__reactInternalMemoizedMergedChildContext;break e}}t=t.return}while(t!==null);throw Error(i(171))}if(e.tag===1){var n=e.type;if(et(n))return ss(e,n,t)}return t}function Du(e,t,n,r,l,a,o,c,p){return e=ei(n,r,!0,e,l,a,o,c,p),e.context=Ru(null),n=e.current,r=Ge(),l=kn(n),a=qt(r,l),a.callback=t??null,vn(n,a,l),e.current.lanes=l,jr(e,l,r),rt(e,r),e}function ga(e,t,n,r){var l=t.current,a=Ge(),o=kn(l);return n=Ru(n),t.context===null?t.context=n:t.pendingContext=n,t=qt(a,o),t.payload={element:e},r=r===void 0?null:r,r!==null&&(t.callback=r),e=vn(l,t,o),e!==null&&(Pt(e,l,o,a),Wl(e,l,o)),o}function ma(e){if(e=e.current,!e.child)return null;switch(e.child.tag){case 5:return e.child.stateNode;default:return e.child.stateNode}}function Ou(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var n=e.retryLane;e.retryLane=n!==0&&n<t?n:t}}function ti(e,t){Ou(e,t),(e=e.alternate)&&Ou(e,t)}function Gd(){return null}var $u=typeof reportError=="function"?reportError:function(e){console.error(e)};function ni(e){this._internalRoot=e}ha.prototype.render=ni.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(i(409));ga(e,t,null,null)},ha.prototype.unmount=ni.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;An(function(){ga(null,e,null,null)}),t[Kt]=null}};function ha(e){this._internalRoot=e}ha.prototype.unstable_scheduleHydration=function(e){if(e){var t=_i();e={blockedOn:null,target:e,priority:t};for(var n=0;n<cn.length&&t!==0&&t<cn[n].priority;n++);cn.splice(n,0,e),n===0&&Si(e)}};function ri(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function xa(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11&&(e.nodeType!==8||e.nodeValue!==" react-mount-point-unstable "))}function Iu(){}function qd(e,t,n,r,l){if(l){if(typeof r=="function"){var a=r;r=function(){var w=ma(o);a.call(w)}}var o=Du(t,r,e,0,null,!1,!1,"",Iu);return e._reactRootContainer=o,e[Kt]=o.current,Vr(e.nodeType===8?e.parentNode:e),An(),o}for(;l=e.lastChild;)e.removeChild(l);if(typeof r=="function"){var c=r;r=function(){var w=ma(p);c.call(w)}}var p=ei(e,0,!1,null,null,!1,!1,"",Iu);return e._reactRootContainer=p,e[Kt]=p.current,Vr(e.nodeType===8?e.parentNode:e),An(function(){ga(t,p,n,r)}),p}function va(e,t,n,r,l){var a=n._reactRootContainer;if(a){var o=a;if(typeof l=="function"){var c=l;l=function(){var p=ma(o);c.call(p)}}ga(t,o,e,l)}else o=qd(n,t,e,l,r);return ma(o)}vi=function(e){switch(e.tag){case 3:var t=e.stateNode;if(t.current.memoizedState.isDehydrated){var n=Tr(t.pendingLanes);n!==0&&(Ca(t,n|1),rt(t,Ne()),(se&6)===0&&(vr=Ne()+500,hn()))}break;case 13:An(function(){var r=Gt(e,1);if(r!==null){var l=Ge();Pt(r,e,1,l)}}),ti(e,1)}},Na=function(e){if(e.tag===13){var t=Gt(e,134217728);if(t!==null){var n=Ge();Pt(t,e,134217728,n)}ti(e,134217728)}},yi=function(e){if(e.tag===13){var t=kn(e),n=Gt(e,t);if(n!==null){var r=Ge();Pt(n,e,t,r)}ti(e,t)}},_i=function(){return fe},wi=function(e,t){var n=fe;try{return fe=e,t()}finally{fe=n}},kr=function(e,t,n){switch(t){case"input":if(Dt(e,n),t=n.name,n.type==="radio"&&t!=null){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+t)+'][type="radio"]'),t=0;t<n.length;t++){var r=n[t];if(r!==e&&r.form===e.form){var l=Dl(r);if(!l)throw Error(i(90));qe(r),Dt(r,l)}}}break;case"textarea":Kn(e,n);break;case"select":t=n.value,t!=null&&Ae(e,!!n.multiple,t,!1)}},Er=Yo,jn=An;var Xd={usingClientEntryPoint:!1,Events:[Kr,ar,Dl,br,pl,Yo]},ol={findFiberByHostInstance:Mn,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},Zd={bundleType:ol.bundleType,version:ol.version,rendererPackageName:ol.rendererPackageName,rendererConfig:ol.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:we.ReactCurrentDispatcher,findHostInstanceByFiber:function(e){return e=me(e),e===null?null:e.stateNode},findFiberByHostInstance:ol.findFiberByHostInstance||Gd,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var ya=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!ya.isDisabled&&ya.supportsFiber)try{hl=ya.inject(Zd),Ft=ya}catch{}}return lt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Xd,lt.createPortal=function(e,t){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!ri(t))throw Error(i(200));return Jd(e,t,null,n)},lt.createRoot=function(e,t){if(!ri(e))throw Error(i(299));var n=!1,r="",l=$u;return t!=null&&(t.unstable_strictMode===!0&&(n=!0),t.identifierPrefix!==void 0&&(r=t.identifierPrefix),t.onRecoverableError!==void 0&&(l=t.onRecoverableError)),t=ei(e,1,!1,null,null,n,!1,r,l),e[Kt]=t.current,Vr(e.nodeType===8?e.parentNode:e),new ni(t)},lt.findDOMNode=function(e){if(e==null)return null;if(e.nodeType===1)return e;var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(i(188)):(e=Object.keys(e).join(","),Error(i(268,e)));return e=me(t),e=e===null?null:e.stateNode,e},lt.flushSync=function(e){return An(e)},lt.hydrate=function(e,t,n){if(!xa(t))throw Error(i(200));return va(null,e,t,!0,n)},lt.hydrateRoot=function(e,t,n){if(!ri(e))throw Error(i(405));var r=n!=null&&n.hydratedSources||null,l=!1,a="",o=$u;if(n!=null&&(n.unstable_strictMode===!0&&(l=!0),n.identifierPrefix!==void 0&&(a=n.identifierPrefix),n.onRecoverableError!==void 0&&(o=n.onRecoverableError)),t=Du(t,null,e,1,n??null,l,!1,a,o),e[Kt]=t.current,Vr(e),r)for(e=0;e<r.length;e++)n=r[e],l=n._getVersion,l=l(n._source),t.mutableSourceEagerHydrationData==null?t.mutableSourceEagerHydrationData=[n,l]:t.mutableSourceEagerHydrationData.push(n,l);return new ha(t)},lt.render=function(e,t,n){if(!xa(t))throw Error(i(200));return va(null,e,t,!1,n)},lt.unmountComponentAtNode=function(e){if(!xa(e))throw Error(i(40));return e._reactRootContainer?(An(function(){va(null,null,e,!1,function(){e._reactRootContainer=null,e[Kt]=null})}),!0):!1},lt.unstable_batchedUpdates=Yo,lt.unstable_renderSubtreeIntoContainer=function(e,t,n,r){if(!xa(n))throw Error(i(200));if(e==null||e._reactInternals===void 0)throw Error(i(38));return va(e,t,n,!1,r)},lt.version="18.3.1-next-f1338f8080-20240426",lt}var Ku;function ip(){if(Ku)return oi.exports;Ku=1;function s(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(s)}catch(u){console.error(u)}}return s(),oi.exports=op(),oi.exports}var Qu;function sp(){if(Qu)return _a;Qu=1;var s=ip();return _a.createRoot=s.createRoot,_a.hydrateRoot=s.hydrateRoot,_a}var up=sp();function cp(){if(typeof window>"u")return!1;const s=window;return!!(s.SpeechRecognition||s.webkitSpeechRecognition)}function dp(){if(typeof window>"u")return null;const s=window;return s.SpeechRecognition??s.webkitSpeechRecognition??null}function pp(s){const u=dp();if(!u)return s.onError("Voice input is not supported in this browser."),null;let i=new u;i.continuous=!0,i.interimResults=!0;try{i.lang=navigator.language||"en-US"}catch{i.lang="en-US"}let x=!1,g="";i.onresult=m=>{var k;let T="",b="";for(let z=m.resultIndex;z<m.results.length;z++){const P=m.results[z],S=((k=P[0])==null?void 0:k.transcript)??"";P.isFinal?b+=S:T+=S}b&&(g=(g+" "+b).trim()),s.onPartial((g+" "+T).trim())},i.onerror=m=>{const T=m.error??"unknown";x||(T==="no-speech"?s.onError("Voice: silence detected. Hold the mic and speak."):T==="not-allowed"||T==="service-not-allowed"?s.onError("Voice: microphone permission denied."):T==="aborted"||s.onError(`Voice error: ${T}`))},i.onend=()=>{x||g&&s.onCommit(g)};try{i.start()}catch(m){return s.onError(m instanceof Error?m.message:"Voice failed to start."),null}return{stop:()=>{try{i==null||i.stop()}catch{}},abort:()=>{x=!0;try{i==null||i.abort()}catch{}i=null}}}function pi(){return typeof navigator>"u"||!navigator.mediaDevices?!1:typeof navigator.mediaDevices.getUserMedia=="function"&&typeof MediaRecorder<"u"}function fp(s,u,i={}){return(async()=>{if(!pi())return u.onError("Voice: this runtime does not expose MediaRecorder."),null;let x;try{x=await navigator.mediaDevices.getUserMedia({audio:!0})}catch(k){const z=k instanceof Error?k.message:"microphone unavailable";return u.onError(`Voice: microphone permission denied or device missing (${z}).`),null}let g=i.preferredMime??"audio/webm;codecs=opus";typeof MediaRecorder.isTypeSupported=="function"&&!MediaRecorder.isTypeSupported(g)&&(g=["audio/webm","audio/ogg;codecs=opus","audio/mp4"].find(P=>MediaRecorder.isTypeSupported(P))??"");const m=g?new MediaRecorder(x,{mimeType:g}):new MediaRecorder(x),T=[];let b=!1;m.addEventListener("dataavailable",k=>{k.data&&k.data.size>0&&T.push(k.data)}),m.addEventListener("stop",()=>{if(x.getTracks().forEach(z=>z.stop()),b||T.length===0)return;const k=new Blob(T,{type:g||"audio/webm"});k.arrayBuffer().then(z=>{const P=gp(z);return u.onPartial("a transcrever…"),s.transcribeAudio(P,k.type||"audio/webm",i.language)}).then(z=>{if(b)return;const P=((z==null?void 0:z.text)??"").trim();P?u.onCommit(P):u.onError("Voice: silence detected — nada para transcrever.")}).catch(z=>{if(b)return;const P=z instanceof Error?z.message:String(z);u.onError(`Voice: ${P}`)})});try{m.start()}catch(k){return x.getTracks().forEach(z=>z.stop()),u.onError(k instanceof Error?k.message:"recorder failed to start"),null}return{stop:()=>{if(m.state==="recording")try{m.stop()}catch{}},abort:()=>{if(b=!0,m.state==="recording")try{m.stop()}catch{}x.getTracks().forEach(k=>k.stop())}}})()}function gp(s){const u=new Uint8Array(s);let i="";const x=32768;for(let g=0;g<u.length;g+=x){const m=u.subarray(g,Math.min(g+x,u.length));i+=String.fromCharCode.apply(null,Array.from(m))}return btoa(i)}function mp(s){const u=[],i=s.split(`
`);let x=0,g=[];function m(){g.length!==0&&(u.push({kind:"prose",body:g.join(`
`)}),g=[])}for(;x<i.length;){const T=i[x],b=T.match(/^```(\w[\w+-]*)?\s*$/);if(b){m();const k=b[1]||null;x++;const z=x;for(;x<i.length&&!i[x].match(/^```\s*$/);)x++;const P=i.slice(z,x).join(`
`);u.push({kind:"code",lang:k,body:P}),x++;continue}g.push(T),x++}return m(),u}const hp=[[/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/,(s,u)=>d.jsx("a",{href:s[2],target:"_blank",rel:"noopener noreferrer",className:"gauntlet-md__link",children:s[1]},`a-${u}`)],[/`([^`]+)`/,(s,u)=>d.jsx("code",{className:"gauntlet-md__inline-code",children:s[1]},`c-${u}`)],[/\*\*([^*]+)\*\*/,(s,u)=>d.jsx("strong",{className:"gauntlet-md__strong",children:s[1]},`b-${u}`)],[/\*([^*]+)\*/,(s,u)=>d.jsx("em",{className:"gauntlet-md__em",children:s[1]},`i-${u}`)],[/_([^_]+)_/,(s,u)=>d.jsx("em",{className:"gauntlet-md__em",children:s[1]},`u-${u}`)]];function sl(s,u){const i=[];let x=0,g=0;for(;x<s.length;){let m=null;for(const[T,b]of hp){const z=s.slice(x).match(T);!z||z.index===void 0||(m===null||z.index<m.idx)&&(m={idx:z.index,match:z,render:b})}if(m===null){i.push(s.slice(x));break}m.idx>0&&i.push(s.slice(x,x+m.idx)),i.push(m.render(m.match,u*100+g)),g++,x+=m.idx+m.match[0].length}return i}function xp(s,u){const i=[],x=s.split(`
`);let g=0,m=u;for(;g<x.length;){const b=x[g].trim();if(!b){g++;continue}const k=b.match(/^(#{1,3})\s+(.*)$/);if(k){const P=k[1].length,U=`h${P}`;i.push(d.jsx(U,{className:`gauntlet-md__h gauntlet-md__h${P}`,children:sl(k[2],m++)},`h-${m++}`)),g++;continue}if(/^---+$/.test(b)||/^\*\*\*+$/.test(b)){i.push(d.jsx("hr",{className:"gauntlet-md__hr"},`hr-${m++}`)),g++;continue}if(b.startsWith(">")){const P=[];for(;g<x.length&&x[g].trim().startsWith(">");)P.push(x[g].replace(/^\s*>\s?/,"")),g++;i.push(d.jsx("blockquote",{className:"gauntlet-md__quote",children:sl(P.join(" "),m++)},`q-${m++}`));continue}if(/^[-*]\s+/.test(b)){const P=[];for(;g<x.length&&/^[-*]\s+/.test(x[g].trim());)P.push(x[g].trim().replace(/^[-*]\s+/,"")),g++;i.push(d.jsx("ul",{className:"gauntlet-md__list",children:P.map((S,U)=>d.jsx("li",{className:"gauntlet-md__li",children:sl(S,m++)},U))},`ul-${m++}`));continue}if(/^\d+\.\s+/.test(b)){const P=[];for(;g<x.length&&/^\d+\.\s+/.test(x[g].trim());)P.push(x[g].trim().replace(/^\d+\.\s+/,"")),g++;i.push(d.jsx("ol",{className:"gauntlet-md__list",children:P.map((S,U)=>d.jsx("li",{className:"gauntlet-md__li",children:sl(S,m++)},U))},`ol-${m++}`));continue}const z=[];for(;g<x.length;){const P=x[g],S=P.trim();if(!S||/^(#{1,3})\s+/.test(S)||/^---+$/.test(S)||/^\*\*\*+$/.test(S)||S.startsWith(">")||/^[-*]\s+/.test(S)||/^\d+\.\s+/.test(S))break;z.push(P),g++}i.push(d.jsx("p",{className:"gauntlet-md__p",children:sl(z.join(" "),m++)},`p-${m++}`))}return i}function vp({source:s,onCopyBlock:u}){const i=mp(s);return d.jsx("div",{className:"gauntlet-md",children:i.map((x,g)=>x.kind==="code"?d.jsx(Tp,{lang:x.lang,body:x.body,onCopy:u},`cb-${g}`):d.jsx("div",{className:"gauntlet-md__prose",children:xp(x.body,g*1e3)},`pb-${g}`))})}const yp=new Set(["def","class","if","elif","else","for","while","return","import","from","as","with","try","except","finally","raise","pass","break","continue","in","is","not","and","or","lambda","yield","async","await","global","nonlocal","True","False","None","self","cls","print"]),_p=new Set(["function","const","let","var","if","else","return","class","export","import","from","as","default","async","await","for","while","try","catch","finally","throw","new","this","super","extends","implements","interface","type","enum","public","private","protected","readonly","static","typeof","instanceof","in","of","null","undefined","true","false","void","switch","case","break","continue","do","yield"]),wp=new Set(["cd","ls","cat","rm","mv","cp","mkdir","touch","grep","sed","awk","export","source","if","then","else","elif","fi","for","while","do","done","case","esac","exit","npm","npx","git","python","node","tsc","make","vite","wxt","set","get","start-process","select-string"]);function lc(s,u){if(s[u]!=="#")return-1;const i=s.indexOf(`
`,u);return i===-1?s.length:i}function kp(s,u){if(s[u]!=="/")return-1;if(s[u+1]==="/"){const i=s.indexOf(`
`,u);return i===-1?s.length:i}if(s[u+1]==="*"){const i=s.indexOf("*/",u+2);return i===-1?s.length:i+2}return-1}const ac={keywords:yp,matchComment:lc},Sp={keywords:_p,matchComment:kp},bp={keywords:wp,matchComment:lc};function Ep(s){if(!s)return null;const u=s.toLowerCase();return u==="py"||u==="python"||u==="python3"||u==="ipython"||u==="pycon"?ac:u==="ts"||u==="tsx"||u==="typescript"||u==="js"||u==="jsx"||u==="javascript"||u==="mjs"||u==="json"||u==="json5"?Sp:u==="sh"||u==="bash"||u==="zsh"||u==="shell"||u==="powershell"||u==="ps"||u==="ps1"||u==="console"?bp:null}function oc(s){return s>="a"&&s<="z"||s>="A"&&s<="Z"||s==="_"||s==="$"}function Cp(s){return oc(s)||s>="0"&&s<="9"}function ui(s){return s>="0"&&s<="9"}function Np(s,u){const i=[];let x="";function g(){x&&(i.push({kind:"p",text:x}),x="")}let m=0;for(;m<s.length;){const T=s[m],b=u.matchComment(s,m);if(b!==-1){g(),i.push({kind:"c",text:s.slice(m,b)}),m=b;continue}if(u===ac&&(s.startsWith('"""',m)||s.startsWith("'''",m))){g();const k=s.slice(m,m+3);let z=s.indexOf(k,m+3);z=z===-1?s.length:z+3,i.push({kind:"s",text:s.slice(m,z)}),m=z;continue}if(T==='"'||T==="'"||T==="`"){g();let k=m+1;for(;k<s.length&&s[k]!==T;){if(s[k]==="\\"){k+=2;continue}if(s[k]===`
`&&T!=="`")break;k++}const z=k<s.length?k+1:k;i.push({kind:"s",text:s.slice(m,z)}),m=z;continue}if(ui(T)){g();let k=m;for(;k<s.length&&(ui(s[k])||s[k]==="."||s[k]==="_");)k++;if(k<s.length&&(s[k]==="e"||s[k]==="E"))for(k++,k<s.length&&(s[k]==="+"||s[k]==="-")&&k++;k<s.length&&ui(s[k]);)k++;i.push({kind:"n",text:s.slice(m,k)}),m=k;continue}if(oc(T)){g();let k=m+1;for(;k<s.length&&Cp(s[k]);)k++;const z=s.slice(m,k);let P=k;for(;P<s.length&&s[P]===" ";)P++;const S=s[P]==="(";let U="p";u.keywords.has(z)?U="k":S&&(U="f"),i.push({kind:U,text:z}),m=k;continue}x+=T,m++}return g(),i}function Tp({lang:s,body:u,onCopy:i}){const x=()=>{navigator.clipboard.writeText(u).catch(()=>{}),i==null||i(u)},g=Ep(s),m=g?Np(u,g):null;return d.jsxs("figure",{className:"gauntlet-md__code",children:[d.jsxs("header",{className:"gauntlet-md__code-meta",children:[d.jsx("span",{className:"gauntlet-md__code-lang",children:s??"code"}),d.jsx("button",{type:"button",className:"gauntlet-md__code-copy",onClick:x,"aria-label":"copy code",children:"copy"})]}),d.jsx("pre",{className:"gauntlet-md__code-body",children:m?d.jsx("code",{children:m.map((T,b)=>d.jsx("span",{className:`gauntlet-md__tok gauntlet-md__tok--${T.kind}`,children:T.text},b))}):d.jsx("code",{children:u})})]})}const jp={domains:{},actions:{},default_domain_policy:{allowed:!0,require_danger_ack:!1},default_action_policy:{allowed:!0,require_danger_ack:!1},tool_policies:{},max_page_text_chars:6e3,max_dom_skeleton_chars:4e3,screenshot_default:!1,execution_reporting_required:!1,updated_at:""},zp="2px solid #d07a5a",Pp="2px",Mp="#gauntlet-capsule-host",Lp=[/\bpassword\b/i,/\bdelete\b/i,/\bdestroy\b/i,/\bremove\b/i,/\bunsubscribe\b/i,/payment|checkout|billing/i,/credit[-_ ]?card|\bccnum\b|\bcvv\b|\bcvc\b/i],Rp=["delete","remove","destroy","drop","discard","apagar","eliminar","remover","destruir","pay","buy","purchase","order","checkout","pagar","comprar","encomendar","confirm","submit","send","publish","enviar","confirmar","publicar","transfer","withdraw","transferir","levantar","cancel subscription","cancelar subscrição","cancelar assinatura"],Dp=5e3;function Op(s){const u=s.filter(m=>m.type==="fill"),i=s.filter(m=>m.type==="click");if(u.length===0||i.length===0)return{danger:!1};const x=u.find(m=>{const T=m.selector.toLowerCase();return!!(/\bpassword\b/.test(T)||/\bcvv\b|\bcvc\b|\bccnum\b|credit[-_ ]?card/.test(T)||/payment|checkout|billing/.test(T)||/cc-(number|exp|csc|name)/.test(T))});if(!x)return{danger:!1};const g=i.find(m=>{const T=m.selector.toLowerCase();return!!(T.includes("submit")||/\b(pay|buy|purchase|confirm|send|order|checkout|pagar|comprar|enviar|confirmar)\b/.test(T))});return g?{danger:!0,reason:`cadeia destrutiva: fill em "${x.selector}" seguido de click em "${g.selector}"`}:{danger:!1}}function $p(s){var x;if(s.type==="highlight"||s.type==="scroll_to")return{danger:!1};const u=s.selector;for(const g of Lp)if(g.test(u))return{danger:!0,reason:`selector matches /${g.source}/`};let i=null;try{i=document.querySelector(u)}catch{}if(s.type==="fill")return i instanceof HTMLInputElement&&i.type==="password"?{danger:!0,reason:"password field"}:i instanceof HTMLInputElement&&(((x=i.autocomplete)==null?void 0:x.includes("cc-"))??!1)?{danger:!0,reason:"credit-card autocomplete"}:s.value.length>Dp?{danger:!0,reason:"unusually long value"}:{danger:!1};if(s.type==="click"){if(i instanceof HTMLButtonElement&&i.type==="submit")return{danger:!0,reason:"submit button"};if(i instanceof HTMLInputElement&&(i.type==="submit"||i.type==="reset"))return{danger:!0,reason:`${i.type} button`};if(i instanceof HTMLElement){const g=(i.innerText??"").trim().toLowerCase();if(g){for(const m of Rp)if(g===m||g.startsWith(m+" ")||g.endsWith(" "+m)||g.includes(" "+m+" "))return{danger:!0,reason:`action label: "${m}"`}}}return{danger:!1}}return{danger:!1}}async function Ip(s){const u=[];for(const i of s)try{Fp(i),await Ap(i),u.push({action:i,ok:!0})}catch(x){u.push({action:i,ok:!1,error:x instanceof Error?x.message:String(x)})}return u}function Fp(s){const u=s.selector;if(!u||typeof u!="string")throw new Error("selector missing or not a string");if(u.includes(Mp))throw new Error(`selector targets the Gauntlet capsule itself: ${u}`);try{document.querySelector(u)}catch{throw new Error(`selector is not valid CSS: ${u}`)}}async function Ap(s){if(s.type==="fill"){Up(s.selector,s.value);return}if(s.type==="click"){Bp(s.selector);return}if(s.type==="highlight"){Vp(s.selector,s.duration_ms??1500);return}if(s.type==="scroll_to"){Hp(s.selector);return}throw new Error(`unknown action type: ${s.type??"<missing>"}`)}function Up(s,u){var x,g;const i=document.querySelector(s);if(!i)throw new Error(`selector not found: ${s}`);if(i instanceof HTMLInputElement||i instanceof HTMLTextAreaElement){i.focus({preventScroll:!0});const m=i instanceof HTMLInputElement?HTMLInputElement.prototype:HTMLTextAreaElement.prototype,T=(x=Object.getOwnPropertyDescriptor(m,"value"))==null?void 0:x.set;T?T.call(i,u):i.value=u,i.dispatchEvent(new Event("input",{bubbles:!0})),i.dispatchEvent(new Event("change",{bubbles:!0})),i.dispatchEvent(new Event("blur",{bubbles:!0}));return}if(i instanceof HTMLSelectElement){i.focus({preventScroll:!0});const m=(g=Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,"value"))==null?void 0:g.set;m?m.call(i,u):i.value=u,i.dispatchEvent(new Event("input",{bubbles:!0})),i.dispatchEvent(new Event("change",{bubbles:!0})),i.dispatchEvent(new Event("blur",{bubbles:!0}));return}if(i instanceof HTMLElement&&i.isContentEditable){i.focus(),i.textContent=u,i.dispatchEvent(new InputEvent("input",{bubbles:!0}));return}throw new Error(`element at ${s} is not fillable`)}function Bp(s){const u=document.querySelector(s);if(!u)throw new Error(`selector not found: ${s}`);if(!(u instanceof HTMLElement))throw new Error(`element at ${s} is not clickable`);const i=u.getBoundingClientRect(),x=i.left+i.width/2,g=i.top+i.height/2,m={bubbles:!0,cancelable:!0,view:window,clientX:x,clientY:g,button:0,buttons:1},T={...m,pointerId:1,pointerType:"mouse",isPrimary:!0};u.dispatchEvent(new PointerEvent("pointerdown",T)),u.dispatchEvent(new MouseEvent("mousedown",m)),u.focus({preventScroll:!0}),u.dispatchEvent(new PointerEvent("pointerup",T)),u.dispatchEvent(new MouseEvent("mouseup",m)),u.click()}function Vp(s,u){const i=document.querySelectorAll(s);if(i.length===0)throw new Error(`selector not found: ${s}`);for(const x of Array.from(i)){if(!(x instanceof HTMLElement))continue;const g=x.style.outline,m=x.style.outlineOffset;x.style.outline=zp,x.style.outlineOffset=Pp,window.setTimeout(()=>{x.style.outline=g,x.style.outlineOffset=m},u)}}function Hp(s){const u=document.querySelector(s);if(!u)throw new Error(`selector not found: ${s}`);if(!(u instanceof HTMLElement))throw new Error(`element at ${s} cannot be scrolled to`);u.scrollIntoView({behavior:"smooth",block:"center"})}const ci={},Wp="https://ruberra-backend-jkpf-production.up.railway.app",Kp=typeof import.meta<"u"?ci==null?void 0:ci.VITE_BACKEND_URL:void 0,Qp=(Kp??Wp).replace(/\/+$/,"");class Yp{constructor(u,i={}){this.ambient=u,this.backendUrl=(i.backendUrl??Qp).replace(/\/+$/,"")}captureContext(u,i){return this.ambient.transport.fetchJson("POST",`${this.backendUrl}/composer/context`,u,i)}detectIntent(u,i,x){return this.ambient.transport.fetchJson("POST",`${this.backendUrl}/composer/intent`,{context_id:u,user_input:i},x)}generatePreview(u,i){return this.ambient.transport.fetchJson("POST",`${this.backendUrl}/composer/preview`,{intent_id:u},i)}applyPreview(u,i,x,g){return this.ambient.transport.fetchJson("POST",`${this.backendUrl}/composer/apply`,{preview_id:u,approved:i,approval_reason:x??null},g)}async getToolManifests(u){return(await this.ambient.transport.fetchJson("GET",`${this.backendUrl}/tools/manifests`,void 0,u)).tools??[]}getSettings(u){return this.ambient.transport.fetchJson("GET",`${this.backendUrl}/composer/settings`,void 0,u)}updateSettings(u,i){return this.ambient.transport.fetchJson("PUT",`${this.backendUrl}/composer/settings`,u,i)}reportExecution(u,i){return this.ambient.transport.fetchJson("POST",`${this.backendUrl}/composer/execution`,u,i)}transcribeAudio(u,i,x,g){return this.ambient.transport.fetchJson("POST",`${this.backendUrl}/voice/transcribe`,{audio_base64:u,mime:i,language:x},g)}synthesizeSpeech(u,i,x){return this.ambient.transport.fetchJson("POST",`${this.backendUrl}/voice/synthesize`,{text:u,voice:i},x)}requestDomPlan(u,i,x){return this.ambient.transport.fetchJson("POST",`${this.backendUrl}/composer/dom_plan`,{context_id:u,user_input:i},x)}requestDomPlanStream(u,i,x){return this.ambient.transport.stream?this.ambient.transport.stream(`${this.backendUrl}/composer/dom_plan_stream`,{context_id:u,user_input:i},x):(x.onError("streaming not supported by this ambient"),()=>{})}}const Yu="gauntlet:pill_position",di="gauntlet:dismissed_domains",Ju="gauntlet:screenshot_enabled",Gu="gauntlet:theme",qu="gauntlet:palette_recent",Xu="gauntlet:pill_mode",Zu="gauntlet:tts_enabled",ec=8,ic="light",Jp="corner",Gp={bottom:16,right:16};function tc(s){const u=typeof window<"u"?window.innerWidth:1280,i=typeof window<"u"?window.innerHeight:800,x=4,g=u-x,m=i-x;return{right:Math.max(-14,Math.min(g,s.right)),bottom:Math.max(-14,Math.min(m,s.bottom))}}function qp(s){return{async readPillPosition(){const u=await s.get(Yu);return u&&typeof u=="object"&&typeof u.bottom=="number"&&typeof u.right=="number"?tc(u):Gp},async writePillPosition(u){await s.set(Yu,tc(u))},async readDismissedDomains(){const u=await s.get(di);return Array.isArray(u)?u.filter(i=>typeof i=="string"):[]},async dismissDomain(u){if(!u)return;const i=await this.readDismissedDomains();i.includes(u)||await s.set(di,[...i,u])},async restoreDomain(u){if(!u)return;const i=await this.readDismissedDomains(),x=i.filter(g=>g!==u);x.length!==i.length&&await s.set(di,x)},async isDomainDismissed(u){return u?(await this.readDismissedDomains()).includes(u):!1},async readScreenshotEnabled(){return await s.get(Ju)===!0},async writeScreenshotEnabled(u){await s.set(Ju,!!u)},async readTheme(){const u=await s.get(Gu);return u==="dark"||u==="light"?u:ic},async writeTheme(u){await s.set(Gu,u)},async readPaletteRecent(){const u=await s.get(qu);return Array.isArray(u)?u.filter(i=>typeof i=="string").slice(0,ec):[]},async notePaletteUse(u){if(!u)return;const i=await this.readPaletteRecent(),x=[u,...i.filter(g=>g!==u)].slice(0,ec);await s.set(qu,x)},async readPillMode(){const u=await s.get(Xu);return u==="cursor"||u==="corner"?u:Jp},async writePillMode(u){await s.set(Xu,u)},async readTtsEnabled(){return await s.get(Zu)===!0},async writeTtsEnabled(u){await s.set(Zu,!!u)}}}function Xp({ambient:s,initialSnapshot:u,onDismiss:i,cursorAnchor:x}){var Pn,qn,gl;const g=M.useMemo(()=>new Yp(s),[s]),m=M.useMemo(()=>qp(s.storage),[s]),T=(Pn=s.domActions)==null?void 0:Pn.execute,[b,k]=M.useState(u),[z,P]=M.useState(""),[S,U]=M.useState("idle"),[de,ne]=M.useState(null),[ee,re]=M.useState(!1),[D,Me]=M.useState(null),[je,we]=M.useState(null),[Y,ce]=M.useState(!1),[ze,De]=M.useState(""),[St,pt]=M.useState(!1),[Mt,at]=M.useState(ic),[Ye,ot]=M.useState([]),[ft,Fe]=M.useState([]),[ve,O]=M.useState(0),[Q,F]=M.useState(!1),h=M.useRef(!1),E=M.useRef(null),[q,Z]=M.useState(!1),le=M.useRef(""),[ae,ge]=M.useState(null),[oe,pe]=M.useState([]),[Ve,gt]=M.useState(null),[qe,Hn]=M.useState(jp),Lt=M.useRef(null),Wn=M.useRef(null),Rt=M.useRef(null),Dt=M.useRef(""),Nn=M.useRef(!1),[_r,en]=M.useState(0),Ae=M.useRef(null),[tn,Ht]=M.useState(!1),[Kn,it]=M.useState(!1),[Qn,Yn]=M.useState(null),Ot=M.useMemo(()=>D?D.actions.map($p):[],[D]),Wt=M.useMemo(()=>D?Op(D.actions):{danger:!1},[D]),$t=M.useMemo(()=>{if(!D||D.actions.length===0)return{forced:!1,reason:null};let _="";try{_=new URL(b.url).hostname.toLowerCase()}catch{}if((qe.domains[_]??qe.default_domain_policy).require_danger_ack)return{forced:!0,reason:_?`policy: domain '${_}' requires explicit confirmation`:"policy: default domain policy requires explicit confirmation"};for(const $ of D.actions)if((qe.actions[$.type]??qe.default_action_policy).require_danger_ack)return{forced:!0,reason:`policy: action type '${$.type}' requires explicit confirmation`};return{forced:!1,reason:null}},[D,b.url,qe]),Xe=Ot.some(_=>_.danger)||Wt.danger||$t.forced;M.useEffect(()=>{var _;return(_=Lt.current)==null||_.focus(),()=>{var R,$;(R=Wn.current)==null||R.abort(),($=Rt.current)==null||$.call(Rt)}},[]),M.useEffect(()=>{k(u)},[u]),M.useEffect(()=>{let _=!1;return g.getToolManifests().then(R=>{_||ot(R)}).catch(()=>{}),m.readPaletteRecent().then(R=>{_||Fe(R)}),()=>{_=!0}},[g,m]),M.useEffect(()=>{const _=!!b.text;_&&!h.current&&(F(!0),E.current!==null&&window.clearTimeout(E.current),E.current=window.setTimeout(()=>{F(!1),E.current=null},700)),h.current=_},[b.text]),M.useEffect(()=>()=>{E.current!==null&&(window.clearTimeout(E.current),E.current=null)},[]),M.useEffect(()=>{let _=!1;m.readTtsEnabled().then($=>{_||Z($)});function R($){const X=$.detail;typeof(X==null?void 0:X.enabled)=="boolean"&&Z(X.enabled)}return window.addEventListener("gauntlet:tts",R),()=>{_=!0,window.removeEventListener("gauntlet:tts",R)}},[m]),M.useEffect(()=>{if(!q||S!=="plan_ready")return;const _=D==null?void 0:D.compose;if(_&&_!==le.current&&!(typeof window>"u"||!window.speechSynthesis))try{window.speechSynthesis.cancel();const R=new SpeechSynthesisUtterance(_);R.rate=1.05,R.pitch=1,window.speechSynthesis.speak(R),le.current=_}catch{}},[q,S,D==null?void 0:D.compose]),M.useEffect(()=>()=>{var _;try{(_=window.speechSynthesis)==null||_.cancel()}catch{}},[]),M.useEffect(()=>{let _=!1;return m.readTheme().then(R=>{_||at(R)}),()=>{_=!0}},[m]),M.useEffect(()=>{let _=!1;return g.getSettings().then(R=>{_||Hn(R)}).catch(()=>{}),()=>{_=!0}},[g]),M.useEffect(()=>{if(!s.capabilities.screenshot||!s.screenshot)return;let _=!1;return m.readScreenshotEnabled().then(R=>{const $=R||qe.screenshot_default;_||!$||s.screenshot.capture().then(X=>{_||!X||ge(X)}).catch(()=>{})}),()=>{_=!0}},[s,m,qe.screenshot_default]);const ul=M.useCallback(()=>{k(s.selection.read())},[s]),cl=M.useCallback(()=>{if(Ae.current)return;ne(null);const _=z,R={onPartial:X=>{P(_?`${_} ${X}`.trim():X)},onCommit:X=>{var ie;P(_?`${_} ${X}`.trim():X),Ht(!1),Ae.current=null,(ie=Lt.current)==null||ie.focus()},onError:X=>{ne(X),Ht(!1),Ae.current=null}};if(s.capabilities.remoteVoice&&pi()){Ht(!0),fp(g,R).then(X=>{X?Ae.current=X:Ht(!1)});return}const $=pp(R);$&&(Ae.current=$,Ht(!0))},[z,s,g]),wr=M.useCallback(()=>{var _;(_=Ae.current)==null||_.stop()},[]),dl=M.useCallback(()=>{var _;(_=Ae.current)==null||_.abort(),Ae.current=null,Ht(!1)},[]);M.useEffect(()=>()=>{var _;(_=Ae.current)==null||_.abort()},[]),M.useEffect(()=>{function _(R){(R.metaKey||R.ctrlKey)&&(R.key==="k"||R.key==="K")&&(R.preventDefault(),R.stopPropagation(),it(X=>!X))}return window.addEventListener("keydown",_,!0),()=>window.removeEventListener("keydown",_,!0)},[]);const Tn=M.useCallback(_=>{Yn(_),window.setTimeout(()=>Yn(null),1400)},[]),Jn=M.useCallback(async()=>{const _=(D==null?void 0:D.compose)||b.text||z.trim();if(!_){ne("Nada para guardar — escreve um pedido ou recebe uma resposta.");return}const R=(z.trim()||b.pageTitle||"cápsula note").slice(0,200);try{await s.transport.fetchJson("POST",`${g.backendUrl}/memory/records`,{topic:R,body:_,kind:"note",scope:"user"}),Tn("saved")}catch($){ne($ instanceof Error?`memória: ${$.message}`:"memória: falhou")}},[s,g,D,b,z,Tn]),bt=M.useCallback(async(_,R=[],$)=>{if(!D||D.actions.length===0)return;Nn.current=!0;const X=D.actions.map((G,me)=>{const he=R[me],ke=Ot[me];return{action:G,ok:he?he.ok:!1,error:(he==null?void 0:he.error)??null,danger:(ke==null?void 0:ke.danger)??!1,danger_reason:(ke==null?void 0:ke.reason)??null}}),ie={plan_id:D.plan_id||null,context_id:D.context_id||null,url:b.url||null,page_title:b.pageTitle||null,status:_,results:X,has_danger:Xe,sequence_danger_reason:Wt.danger?Wt.reason??null:null,danger_acknowledged:Y,error:$??null,model_used:D.model_used||null,plan_latency_ms:D.latency_ms||null,user_input:z.trim()||null};if(qe.execution_reporting_required)try{await g.reportExecution(ie)}catch(G){const me=G instanceof Error?G.message:String(G);ne(`policy: execution report rejected — ${me}`),U("error")}else g.reportExecution(ie).catch(()=>{})},[g,D,b,Ot,Xe,Wt,Y,z,qe.execution_reporting_required]),nn=M.useCallback(()=>{D&&D.actions.length>0&&!Nn.current&&bt("rejected"),i()},[D,i,bt]);M.useEffect(()=>{function _(R){if(R.key==="Escape"){if(R.preventDefault(),R.stopPropagation(),Kn){it(!1);return}if(Ae.current){dl();return}nn()}}return window.addEventListener("keydown",_,!0),()=>window.removeEventListener("keydown",_,!0)},[nn,Kn,dl]);const kr=M.useCallback(async()=>{const _=s.filesystem;if(_){gt(null);try{const R=await _.pickFile();if(!R)return;const $=R.name.toLowerCase();if(/\.(png|jpe?g|gif|webp|svg)$/.test($)){const{base64:ie,mime:G}=await _.readFileBase64(R.path),me=Math.ceil(ie.length*3/4);pe(he=>[...he,{id:`att-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,kind:"image",name:R.name,mime:G,bytes:me,base64:ie,path:R.path}])}else{const ie=await _.readTextFile(R.path);pe(G=>[...G,{id:`att-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,kind:"text",name:R.name,mime:"text/plain",bytes:new TextEncoder().encode(ie).length,text:ie,path:R.path}])}}catch(R){gt(R instanceof Error?R.message:String(R))}}},[s]),rn=M.useCallback(async()=>{var R;const _=(R=s.screenshot)==null?void 0:R.captureScreen;if(_){gt(null);try{const $=await _();if(!$){gt("Captura de ecrã indisponível neste sistema.");return}const X=Math.ceil($.base64.length*3/4);pe(ie=>[...ie,{id:`att-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,kind:"image",name:`ecrã-${new Date().toISOString().slice(11,19)}.png`,mime:"image/png",bytes:X,base64:$.base64,path:$.path}])}catch($){gt($ instanceof Error?$.message:String($))}}},[s]),ln=M.useCallback(_=>{pe(R=>R.filter($=>$.id!==_))},[]),[Sr,br]=M.useState(null),pl=M.useCallback(async()=>{const _=s.filesystem;if(!(_!=null&&_.pickSavePath)||!_.writeTextFile)return;const R=(D==null?void 0:D.compose)??"";if(R.trim()){gt(null);try{const X=`${(b.pageTitle||"gauntlet-compose").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,60)||"gauntlet-compose"}.md`,ie=await _.pickSavePath(X,["md","txt","json"]);if(!ie)return;const G=await _.writeTextFile(ie,R);br(`${ie.split(/[\\/]/).pop()??"ficheiro"} (${G<1024?`${G} B`:`${Math.round(G/1024)} KB`})`),window.setTimeout(()=>br(null),2500)}catch($){gt($ instanceof Error?$.message:String($))}}},[s,D,b.pageTitle]),Er=M.useCallback(_=>{if(oe.length===0)return _;const R=[];for(const $ of oe)if($.kind==="text"&&$.text!=null)R.push(`<file name="${$.name}" path="${$.path??""}">
${$.text}
</file>`);else if($.kind==="image"){const X=Math.max(1,Math.round($.bytes/1024));R.push(`<image name="${$.name}" bytes="${$.bytes}" mime="${$.mime}">[${X} KB image attached — describe in prompt; multimodal payload arrives in A2]</image>`)}return`${R.join(`

`)}

${_}`},[oe]),jn=M.useCallback(async()=>{var X,ie;if(!z.trim()||S==="planning"||S==="streaming"||S==="executing")return;D&&D.actions.length>0&&!Nn.current&&bt("rejected"),(X=Wn.current)==null||X.abort(),(ie=Rt.current)==null||ie.call(Rt);const _=new AbortController;Wn.current=_,U("planning"),ne(null),Me(null),we(null),ce(!1),re(!1),De(""),en(0),Dt.current="",Nn.current=!1;const R=await m.readScreenshotEnabled(),$=lf(b,R?ae:null);try{const G=await g.captureContext($,_.signal);if(_.signal.aborted)return;const me=Er(z.trim());Rt.current=g.requestDomPlanStream(G.context_id,me,{onDelta:he=>{if(_.signal.aborted)return;Dt.current+=he,en(mt=>mt+1);const ke=rf(Dt.current);ke!==null?(De(ke),U(mt=>mt==="planning"?"streaming":mt)):U(mt=>mt==="planning"?"streaming":mt)},onDone:he=>{_.signal.aborted||(Me(he),U("plan_ready"),De(""),Dt.current="")},onError:he=>{_.signal.aborted||(async()=>{try{const ke=await g.requestDomPlan(G.context_id,me,_.signal);if(_.signal.aborted)return;Me(ke),U("plan_ready"),De(""),Dt.current=""}catch(ke){if(_.signal.aborted)return;const mt=ke instanceof Error?ke.message:String(ke);ne(`stream: ${he} · fallback: ${mt}`),U("error"),De(""),Dt.current=""}})()}})}catch(G){if(_.signal.aborted)return;ne(G instanceof Error?G.message:String(G)),U("error")}},[g,b,ae,z,S,D,bt,Er,m]),Cr=M.useCallback(_=>{var R;_.preventDefault(),O($=>$+1);try{(R=window.speechSynthesis)==null||R.cancel()}catch{}le.current="",jn()},[jn]),fl=M.useCallback(_=>{_.key==="Enter"&&(_.shiftKey||(_.preventDefault(),jn()))},[jn]),an=M.useCallback(async()=>{if(D!=null&&D.compose)try{await navigator.clipboard.writeText(D.compose),re(!0),window.setTimeout(()=>re(!1),1500)}catch{ne("Clipboard write blocked. Select the text and copy manually.")}},[D]),Nr=M.useCallback(async()=>{if(!(!T||!D||D.actions.length===0)&&!(Xe&&!Y)){U("executing"),ne(null);try{const _=await T(D.actions);we(_),U("executed");const R=_.every($=>$.ok);window.dispatchEvent(new CustomEvent("gauntlet:execute-result",{detail:{ok:R}})),await bt("executed",_)}catch(_){const R=_ instanceof Error?_.message:String(_);ne(R),U("error"),window.dispatchEvent(new CustomEvent("gauntlet:execute-result",{detail:{ok:!1}})),await bt("failed",[],R)}}},[T,D,Xe,Y,bt]),It=M.useMemo(()=>b.bbox?b.bbox:x?{x:x.x,y:x.y,width:0,height:0}:null,[b.bbox,x]),ka=M.useMemo(()=>{if(!It)return;const _=typeof window<"u"?window.innerWidth:1280,R=typeof window<"u"?window.innerHeight:800,$=of(_,R),X=sf(It,{width:_,height:R},$);return{top:`${X.top}px`,left:`${X.left}px`}},[It]),zn=`gauntlet-capsule--phase-${S}`,Gn=["gauntlet-capsule","gauntlet-capsule--floating",It?"gauntlet-capsule--anchored":"gauntlet-capsule--centered",b.text?null:"gauntlet-capsule--no-selection",zn].filter(Boolean).join(" ");return M.useEffect(()=>{window.dispatchEvent(new CustomEvent("gauntlet:phase",{detail:{phase:S}}))},[S]),d.jsxs("div",{className:Gn,"data-theme":Mt,role:"dialog","aria-label":"Gauntlet",style:ka,children:[d.jsx("div",{className:"gauntlet-capsule__aurora","aria-hidden":!0}),d.jsxs("div",{className:"gauntlet-capsule__layout",children:[d.jsxs("div",{className:"gauntlet-capsule__panel gauntlet-capsule__panel--left",children:[d.jsxs("header",{className:"gauntlet-capsule__header",children:[d.jsxs("div",{className:"gauntlet-capsule__brand-block",children:[d.jsx("span",{className:"gauntlet-capsule__mark","aria-hidden":!0,children:d.jsx("span",{className:"gauntlet-capsule__mark-dot"})}),d.jsxs("div",{className:"gauntlet-capsule__brand-text",children:[d.jsx("span",{className:"gauntlet-capsule__brand",children:"GAUNTLET"}),d.jsx("span",{className:"gauntlet-capsule__tagline",children:"cursor · capsule"})]})]}),d.jsxs("div",{className:"gauntlet-capsule__header-actions",children:[d.jsx("button",{type:"button",className:"gauntlet-capsule__settings-btn",onClick:()=>pt(_=>!_),"aria-label":"Definições","aria-expanded":St,title:"Definições",children:d.jsx("span",{"aria-hidden":!0,children:"···"})}),d.jsx("button",{type:"button",className:"gauntlet-capsule__close",onClick:nn,"aria-label":"Dismiss capsule (Esc)",children:d.jsx("span",{"aria-hidden":!0,children:"esc"})})]})]}),St&&d.jsx(nf,{onClose:()=>pt(!1),showScreenshot:s.capabilities.screenshot,showDismissedDomains:s.capabilities.dismissDomain,showPillMode:s.capabilities.pillSurface,prefs:m,theme:Mt,onChangeTheme:_=>{at(_),m.writeTheme(_)}}),d.jsxs("section",{className:"gauntlet-capsule__context",children:[d.jsxs("div",{className:"gauntlet-capsule__context-meta",children:[d.jsx("span",{className:`gauntlet-capsule__source${Q?" gauntlet-capsule__source--popped":""}`,children:"browser"}),d.jsx("span",{className:"gauntlet-capsule__url",title:b.url,children:b.pageTitle||b.url}),d.jsx("button",{type:"button",className:"gauntlet-capsule__refresh",onClick:ul,title:"Re-read current selection",children:"re-read"})]}),b.text?d.jsx("pre",{className:"gauntlet-capsule__selection",children:sc(b.text,600)}):d.jsx(tf,{snapshot:b,screenshotEnabled:ae!==null})]})]}),d.jsxs("div",{className:"gauntlet-capsule__panel gauntlet-capsule__panel--right",children:[d.jsxs("form",{className:"gauntlet-capsule__form",onSubmit:Cr,children:[oe.length>0&&d.jsx("div",{className:"gauntlet-capsule__attachments","aria-label":"Anexos",children:oe.map(_=>d.jsxs("span",{className:`gauntlet-capsule__attachment gauntlet-capsule__attachment--${_.kind}`,title:_.path??_.name,children:[d.jsx("span",{className:"gauntlet-capsule__attachment-icon","aria-hidden":!0,children:_.kind==="image"?"◫":"⌥"}),d.jsx("span",{className:"gauntlet-capsule__attachment-name",children:_.name}),d.jsx("span",{className:"gauntlet-capsule__attachment-size",children:_.bytes<1024?`${_.bytes} B`:_.bytes<1024*1024?`${Math.round(_.bytes/1024)} KB`:`${(_.bytes/(1024*1024)).toFixed(1)} MB`}),d.jsx("button",{type:"button",className:"gauntlet-capsule__attachment-remove",onClick:()=>ln(_.id),"aria-label":`Remover ${_.name}`,children:"×"})]},_.id))}),Ve&&d.jsx("div",{className:"gauntlet-capsule__attach-error",role:"alert",children:Ve}),d.jsx("textarea",{ref:Lt,className:"gauntlet-capsule__input",placeholder:"O que queres? — Enter para enviar, Shift+Enter nova linha",value:z,onChange:_=>P(_.target.value),onKeyDown:fl,rows:2,disabled:S==="planning"||S==="streaming"||S==="executing"}),d.jsxs("div",{className:"gauntlet-capsule__actions",children:[d.jsxs("span",{className:"gauntlet-capsule__hint","aria-hidden":!0,children:[d.jsx("span",{className:"gauntlet-capsule__kbd",children:"↵"}),d.jsx("span",{className:"gauntlet-capsule__kbd-sep",children:"·"}),d.jsx("span",{className:"gauntlet-capsule__kbd",children:"⌘K"})]}),s.capabilities.filesystemRead&&s.filesystem&&d.jsxs("button",{type:"button",className:"gauntlet-capsule__attach-btn",onClick:()=>void kr(),"aria-label":"Anexar ficheiro local",title:"Anexar ficheiro do disco",disabled:S==="planning"||S==="streaming"||S==="executing",children:[d.jsx("svg",{viewBox:"0 0 24 24",width:"13",height:"13","aria-hidden":!0,children:d.jsx("path",{d:"M14 4l-2 0 0 8-3 0 4 5 4-5-3 0 0-8z",transform:"rotate(45 12 12)",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinejoin:"round"})}),d.jsx("span",{className:"gauntlet-capsule__attach-label",children:"anexar"})]}),s.capabilities.screenCapture&&((qn=s.screenshot)==null?void 0:qn.captureScreen)&&d.jsxs("button",{type:"button",className:"gauntlet-capsule__attach-btn",onClick:()=>void rn(),"aria-label":"Capturar ecrã inteiro",title:"Capturar ecrã inteiro",disabled:S==="planning"||S==="streaming"||S==="executing",children:[d.jsxs("svg",{viewBox:"0 0 24 24",width:"13",height:"13","aria-hidden":!0,children:[d.jsx("rect",{x:"3",y:"5",width:"18",height:"13",rx:"2",fill:"none",stroke:"currentColor",strokeWidth:"1.6"}),d.jsx("circle",{cx:"12",cy:"11.5",r:"2.4",fill:"none",stroke:"currentColor",strokeWidth:"1.6"})]}),d.jsx("span",{className:"gauntlet-capsule__attach-label",children:"ecrã"})]}),(cp()||s.capabilities.remoteVoice&&pi())&&d.jsxs("button",{type:"button",className:`gauntlet-capsule__voice${tn?" gauntlet-capsule__voice--active":""}`,onPointerDown:_=>{_.preventDefault(),cl()},onPointerUp:()=>wr(),onPointerLeave:()=>{tn&&wr()},"aria-label":tn?"A ouvir — solta para enviar":"Premer e falar",title:"Premir e falar",disabled:S==="planning"||S==="streaming"||S==="executing",children:[d.jsxs("svg",{viewBox:"0 0 24 24",width:"13",height:"13","aria-hidden":!0,children:[d.jsx("path",{d:"M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3z",fill:"currentColor"}),d.jsx("path",{d:"M19 11a7 7 0 0 1-14 0M12 18v3",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",fill:"none"})]}),d.jsx("span",{className:"gauntlet-capsule__voice-label",children:tn?"a ouvir":"voz"})]}),d.jsxs("button",{type:"submit",className:"gauntlet-capsule__compose",disabled:S==="planning"||S==="streaming"||S==="executing"||!z.trim(),children:[ve>0&&d.jsx("span",{className:"gauntlet-capsule__compose-ripple","aria-hidden":!0},ve),S==="planning"||S==="streaming"?d.jsxs(d.Fragment,{children:[d.jsx("span",{className:"gauntlet-capsule__compose-spinner","aria-hidden":!0}),d.jsx("span",{children:S==="planning"?"a pensar":"a escrever"})]}):"Enviar"]})]})]}),S==="streaming"&&ze&&d.jsxs("section",{className:"gauntlet-capsule__compose-result gauntlet-capsule__compose-result--streaming",children:[d.jsxs("header",{className:"gauntlet-capsule__compose-meta",children:[d.jsx("span",{className:"gauntlet-capsule__compose-tag",children:"resposta"}),d.jsxs("span",{className:"gauntlet-capsule__compose-meta-text",children:[d.jsxs("span",{className:"gauntlet-capsule__token-counter","aria-live":"polite",children:[_r," chunks"]}),d.jsx("span",{"aria-hidden":!0,children:"·"}),d.jsx("span",{children:"a escrever…"})]})]}),d.jsxs("div",{className:"gauntlet-capsule__compose-text gauntlet-capsule__compose-text--streaming",children:[ze,d.jsx("span",{className:"gauntlet-capsule__compose-caret","aria-hidden":!0,children:"▍"})]})]}),(S==="planning"||S==="streaming"&&!ze)&&d.jsxs("section",{className:"gauntlet-capsule__skeleton",role:"status","aria-live":"polite","aria-label":"A pensar...",children:[d.jsxs("header",{className:"gauntlet-capsule__skeleton-header",children:[d.jsx("span",{className:"gauntlet-capsule__skeleton-tag"}),d.jsx("span",{className:"gauntlet-capsule__skeleton-meta"})]}),d.jsx("div",{className:"gauntlet-capsule__skeleton-line gauntlet-capsule__skeleton-line--w90"}),d.jsx("div",{className:"gauntlet-capsule__skeleton-line gauntlet-capsule__skeleton-line--w75"}),d.jsx("div",{className:"gauntlet-capsule__skeleton-line gauntlet-capsule__skeleton-line--w55"})]}),(D==null?void 0:D.compose)&&S==="plan_ready"&&d.jsxs("section",{className:"gauntlet-capsule__compose-result",children:[d.jsxs("header",{className:"gauntlet-capsule__compose-meta",children:[d.jsx("span",{className:"gauntlet-capsule__compose-tag",children:"resposta"}),d.jsxs("span",{className:"gauntlet-capsule__compose-meta-text",children:[D.model_used," · ",D.latency_ms," ms"]})]}),d.jsx("div",{className:"gauntlet-capsule__compose-text",children:d.jsx(vp,{source:D.compose,onCopyBlock:()=>Tn("code copied")})}),d.jsxs("div",{className:"gauntlet-capsule__compose-actions",children:[d.jsx("button",{type:"button",className:"gauntlet-capsule__copy",onClick:()=>void an(),children:ee?"copiado ✓":"Copy"}),d.jsx("button",{type:"button",className:"gauntlet-capsule__copy gauntlet-capsule__copy--ghost",onClick:()=>void Jn(),children:Qn==="saved"?"guardado ✓":"Save"}),s.capabilities.filesystemWrite&&((gl=s.filesystem)==null?void 0:gl.writeTextFile)&&d.jsx("button",{type:"button",className:"gauntlet-capsule__copy gauntlet-capsule__copy--ghost",onClick:()=>void pl(),title:"Guardar resposta para um ficheiro",children:Sr?`→ ${Sr}`:"Guardar como"})]})]}),D&&D.actions.length===0&&!D.compose&&S==="plan_ready"&&d.jsx("section",{className:"gauntlet-capsule__plan",children:d.jsx("p",{className:"gauntlet-capsule__plan-empty",children:D.reason??"Modelo não conseguiu planear."})}),D&&D.actions.length>0&&(S==="plan_ready"||S==="executing"||S==="executed")&&d.jsxs("section",{className:"gauntlet-capsule__plan",children:[d.jsxs("header",{className:"gauntlet-capsule__plan-header",children:[d.jsx("span",{className:"gauntlet-capsule__plan-title",children:"plano"}),d.jsxs("span",{className:"gauntlet-capsule__plan-meta",children:[D.actions.length," action",D.actions.length===1?"":"s"," · ",D.model_used," · ",D.latency_ms," ms"]})]}),d.jsx("ol",{className:"gauntlet-capsule__plan-list",children:D.actions.map((_,R)=>{const $=je==null?void 0:je[R],X=$?$.ok?"ok":"fail":"pending",ie=Ot[R];return d.jsxs("li",{className:`gauntlet-capsule__plan-item gauntlet-capsule__plan-item--${X}${ie!=null&&ie.danger?" gauntlet-capsule__plan-item--danger":""}`,children:[d.jsx("span",{className:"gauntlet-capsule__plan-step",children:R+1}),d.jsx("span",{className:"gauntlet-capsule__plan-desc",children:af(_)}),(ie==null?void 0:ie.danger)&&d.jsx("span",{className:"gauntlet-capsule__plan-danger",title:ie.reason,children:"sensível"}),$&&!$.ok&&d.jsx("span",{className:"gauntlet-capsule__plan-err",title:$.error,children:$.error})]},`${R}-${_.type}-${_.selector}`)})}),S!=="executed"&&Xe&&d.jsxs("div",{className:"gauntlet-capsule__danger-gate",role:"alert",children:[d.jsxs("header",{className:"gauntlet-capsule__danger-header",children:[d.jsx("span",{className:"gauntlet-capsule__danger-mark","aria-hidden":!0,children:"!"}),d.jsx("span",{className:"gauntlet-capsule__danger-title",children:"Acções sensíveis no plano"})]}),d.jsxs("ul",{className:"gauntlet-capsule__danger-list",children:[$t.forced&&$t.reason&&d.jsxs("li",{children:[d.jsx("strong",{children:"governança:"})," ",$t.reason]},"danger-policy"),Wt.danger&&d.jsxs("li",{children:[d.jsx("strong",{children:"cadeia:"})," ",Wt.reason??"flagged"]},"danger-sequence"),Ot.map((_,R)=>_.danger?d.jsxs("li",{children:[d.jsxs("strong",{children:["step ",R+1,":"]})," ",_.reason??"flagged"]},`danger-${R}`):null)]}),d.jsxs("label",{className:"gauntlet-capsule__danger-confirm",children:[d.jsx("input",{type:"checkbox",checked:Y,onChange:_=>ce(_.target.checked),disabled:S==="executing"}),d.jsx("span",{children:"Confirmo, executar mesmo assim."})]})]}),S!=="executed"&&T&&d.jsx("div",{className:"gauntlet-capsule__plan-actions",children:d.jsx("button",{type:"button",className:`gauntlet-capsule__execute${Xe?" gauntlet-capsule__execute--danger":""}`,onClick:()=>void Nr(),disabled:S==="executing"||Xe&&!Y,children:S==="executing"?"executando…":Xe?"Executar com cuidado":"Executar"})}),S!=="executed"&&!T&&d.jsx("p",{className:"gauntlet-capsule__plan-empty",children:"esta superfície não tem acesso a uma página viva — abre o Gauntlet num separador para executar acções."})]}),S==="error"&&de&&d.jsxs("div",{className:"gauntlet-capsule__error",role:"alert",children:[d.jsx("span",{className:"gauntlet-capsule__error-icon","aria-hidden":!0,children:"!"}),d.jsx("span",{children:de})]})]})]}),Kn&&d.jsx(ef,{onClose:()=>it(!1),recentIds:ft,actions:(()=>{const _=G=>{Fe(me=>[G,...me.filter(ke=>ke!==G)].slice(0,8)),m.notePaletteUse(G)},R=G=>{P(me=>{const he=me.trimEnd(),ke=`usa a tool ${G} para `;return he.startsWith("usa a tool ")?ke:he?`${ke}${he}`:ke}),window.setTimeout(()=>{const me=Lt.current;me&&(me.focus(),me.setSelectionRange(me.value.length,me.value.length))},0)},$=[{id:"focus",label:"Focar input",shortcut:"↵",group:"action",run:()=>{_("focus"),it(!1),window.setTimeout(()=>{var G;return(G=Lt.current)==null?void 0:G.focus()},0)}},{id:"copy",label:"Copiar resposta",shortcut:"⌘C",group:"action",disabled:!(D!=null&&D.compose),run:()=>{_("copy"),it(!1),an()}},{id:"save",label:"Guardar em memória",shortcut:"S",group:"action",disabled:!(D!=null&&D.compose)&&!b.text&&!z.trim(),run:()=>{_("save"),it(!1),Jn()}},{id:"reread",label:"Re-ler contexto",shortcut:"R",group:"action",run:()=>{_("reread"),it(!1),ul()}},{id:"clear",label:"Limpar input",shortcut:"X",group:"action",disabled:!z,run:()=>{var G;_("clear"),it(!1),P(""),(G=Lt.current)==null||G.focus()}},{id:"dismiss",label:"Fechar cápsula",shortcut:"Esc",group:"action",run:()=>{_("dismiss"),it(!1),nn()}}],ie=Ye.filter(G=>{var he;const me=(he=qe.tool_policies)==null?void 0:he[G.name];return!me||me.allowed!==!1}).map(G=>{var me,he;return{id:`tool:${G.name}`,label:G.name,description:G.description,shortcut:"",group:"tool",mode:G.mode,risk:G.risk,requiresApproval:((he=(me=qe.tool_policies)==null?void 0:me[G.name])==null?void 0:he.require_approval)===!0,run:()=>{_(`tool:${G.name}`),it(!1),R(G.name)}}});return[...$,...ie]})()}),Qn&&d.jsx("div",{className:"gauntlet-capsule__flash",role:"status","aria-live":"polite",children:Qn})]})}function Zp(s,u){if(!s)return 0;const i=s.toLowerCase(),x=u.toLowerCase();if(x.includes(i))return 1e3-x.indexOf(i);let g=0,m=0,T=-2;for(let b=0;b<x.length&&g<i.length;b++)x[b]===i[g]&&(b!==T+1&&m++,T=b,g++);return g<i.length?-1:500-m*10-(x.length-i.length)}function ef({actions:s,onClose:u,recentIds:i}){const[x,g]=M.useState(""),[m,T]=M.useState(0),b=M.useRef(null);M.useEffect(()=>{var P;(P=b.current)==null||P.focus()},[]);const k=M.useMemo(()=>{if(!x){const S=new Map(i.map((ne,ee)=>[ne,ee])),U=ne=>{const ee=S.get(ne.id);return ee===void 0?i.length:ee};return[...s].sort((ne,ee)=>{const re=U(ne),D=U(ee);if(re!==D)return re-D;const Me=Y=>Y==="tool"?1:0,je=Me(ne.group),we=Me(ee.group);return je!==we?je-we:ne.label.localeCompare(ee.label)})}return s.map(S=>{const U=`${S.label} ${S.id} ${S.description??""}`;return{a:S,score:Zp(x,U)}}).filter(S=>S.score>=0).sort((S,U)=>U.score-S.score).map(S=>S.a)},[s,x,i]);M.useEffect(()=>{m>=k.length&&T(0)},[k.length,m]);const z=M.useCallback(P=>{if(P.key==="ArrowDown")P.preventDefault(),T(S=>Math.min(S+1,k.length-1));else if(P.key==="ArrowUp")P.preventDefault(),T(S=>Math.max(S-1,0));else if(P.key==="Enter"){P.preventDefault();const S=k[m];S&&!S.disabled&&S.run()}},[k,m]);return d.jsxs("div",{className:"gauntlet-capsule__palette",role:"dialog","aria-label":"Command palette",children:[d.jsx("div",{className:"gauntlet-capsule__palette-scrim",onClick:u}),d.jsxs("div",{className:"gauntlet-capsule__palette-panel",onKeyDown:z,children:[d.jsx("input",{ref:b,className:"gauntlet-capsule__palette-input",type:"text",placeholder:"comandos · tools…  (↑↓ para navegar, ↵ para correr, esc para fechar)",value:x,onChange:P=>g(P.target.value)}),d.jsx("ul",{className:"gauntlet-capsule__palette-list",role:"listbox",children:k.length===0?d.jsx("li",{className:"gauntlet-capsule__palette-empty",children:"sem resultados"}):k.map((P,S)=>d.jsxs("li",{role:"option","aria-selected":S===m,"aria-disabled":P.disabled,onMouseEnter:()=>T(S),onClick:()=>{P.disabled||P.run()},className:`gauntlet-capsule__palette-item${S===m?" gauntlet-capsule__palette-item--active":""}${P.disabled?" gauntlet-capsule__palette-item--disabled":""}${P.group==="tool"?" gauntlet-capsule__palette-item--tool":""}`,children:[d.jsxs("div",{className:"gauntlet-capsule__palette-main",children:[d.jsx("span",{className:"gauntlet-capsule__palette-label",children:P.label}),P.description&&d.jsx("span",{className:"gauntlet-capsule__palette-desc",children:P.description})]}),d.jsxs("div",{className:"gauntlet-capsule__palette-meta",children:[P.mode&&d.jsx("span",{className:`gauntlet-capsule__palette-badge gauntlet-capsule__palette-badge--mode-${P.mode}`,title:`mode: ${P.mode}`,children:P.mode}),P.risk&&P.risk!=="low"&&d.jsx("span",{className:`gauntlet-capsule__palette-badge gauntlet-capsule__palette-badge--risk-${P.risk}`,title:`risk: ${P.risk}`,children:P.risk}),P.requiresApproval&&d.jsx("span",{className:"gauntlet-capsule__palette-badge gauntlet-capsule__palette-badge--approval",title:"requires explicit approval before running",children:"approval"}),P.shortcut&&d.jsx("span",{className:"gauntlet-capsule__palette-shortcut",children:P.shortcut})]})]},P.id))})]})]})}function sc(s,u){return s.length<=u?s:s.slice(0,u)+"…"}function tf({snapshot:s,screenshotEnabled:u}){const i=(()=>{if(!s.domSkeleton)return 0;try{const g=JSON.parse(s.domSkeleton);if(Array.isArray(g))return g.length}catch{}return 0})(),x=!!s.pageText;return d.jsxs("ul",{className:"gauntlet-capsule__context-summary","aria-label":"context",children:[d.jsxs("li",{children:[d.jsx("span",{className:"gauntlet-capsule__context-key",children:"selection"}),d.jsx("span",{className:"gauntlet-capsule__context-val gauntlet-capsule__context-val--muted",children:"none"})]}),d.jsxs("li",{children:[d.jsx("span",{className:"gauntlet-capsule__context-key",children:"page captured"}),d.jsx("span",{className:"gauntlet-capsule__context-val",children:x?"yes":"no"})]}),d.jsxs("li",{children:[d.jsx("span",{className:"gauntlet-capsule__context-key",children:"DOM captured"}),d.jsx("span",{className:"gauntlet-capsule__context-val",children:i>0?`${i} elements`:"—"})]}),d.jsxs("li",{children:[d.jsx("span",{className:"gauntlet-capsule__context-key",children:"screenshot"}),d.jsx("span",{className:"gauntlet-capsule__context-val",children:u?"on":"off"})]})]})}function nf({onClose:s,showScreenshot:u,prefs:i,showDismissedDomains:x,theme:g,onChangeTheme:m,showPillMode:T}){const[b,k]=M.useState([]),[z,P]=M.useState(!0),[S,U]=M.useState(!1),[de,ne]=M.useState("corner"),[ee,re]=M.useState(!1);M.useEffect(()=>{let Y=!1;return x&&i.readDismissedDomains().then(ce=>{Y||k(ce)}),i.readScreenshotEnabled().then(ce=>{Y||(U(ce),P(!1))}),i.readPillMode().then(ce=>{Y||ne(ce)}),i.readTtsEnabled().then(ce=>{Y||re(ce)}),()=>{Y=!0}},[i,x]);const D=M.useCallback(async Y=>{ne(Y),await i.writePillMode(Y),window.dispatchEvent(new CustomEvent("gauntlet:pill-mode",{detail:{mode:Y}}))},[i]),Me=M.useCallback(async Y=>{var ce;if(re(Y),await i.writeTtsEnabled(Y),!Y)try{(ce=window.speechSynthesis)==null||ce.cancel()}catch{}window.dispatchEvent(new CustomEvent("gauntlet:tts",{detail:{enabled:Y}}))},[i]),je=M.useCallback(async Y=>{await i.restoreDomain(Y),k(ce=>ce.filter(ze=>ze!==Y))},[i]),we=M.useCallback(async Y=>{U(Y),await i.writeScreenshotEnabled(Y)},[i]);return d.jsxs("section",{className:"gauntlet-capsule__settings",role:"region","aria-label":"Definições",children:[d.jsxs("header",{className:"gauntlet-capsule__settings-header",children:[d.jsx("span",{className:"gauntlet-capsule__settings-title",children:"definições"}),d.jsx("button",{type:"button",className:"gauntlet-capsule__settings-close",onClick:s,"aria-label":"Fechar definições",children:"×"})]}),d.jsxs("div",{className:"gauntlet-capsule__settings-section",children:[d.jsx("span",{className:"gauntlet-capsule__settings-subtitle",children:"aparência"}),d.jsxs("div",{className:"gauntlet-capsule__theme-switch",role:"radiogroup","aria-label":"tema",children:[d.jsxs("button",{type:"button",className:`gauntlet-capsule__theme-option${g==="light"?" gauntlet-capsule__theme-option--active":""}`,onClick:()=>m("light"),role:"radio","aria-checked":g==="light",children:[d.jsx("span",{className:"gauntlet-capsule__theme-swatch gauntlet-capsule__theme-swatch--light","aria-hidden":!0}),d.jsx("span",{children:"flagship light"})]}),d.jsxs("button",{type:"button",className:`gauntlet-capsule__theme-option${g==="dark"?" gauntlet-capsule__theme-option--active":""}`,onClick:()=>m("dark"),role:"radio","aria-checked":g==="dark",children:[d.jsx("span",{className:"gauntlet-capsule__theme-swatch gauntlet-capsule__theme-swatch--dark","aria-hidden":!0}),d.jsx("span",{children:"night premium"})]})]})]}),T&&d.jsxs("div",{className:"gauntlet-capsule__settings-section",children:[d.jsx("span",{className:"gauntlet-capsule__settings-subtitle",children:"pill"}),d.jsxs("div",{className:"gauntlet-capsule__theme-switch",role:"radiogroup","aria-label":"pill mode",children:[d.jsxs("button",{type:"button",className:`gauntlet-capsule__theme-option${de==="corner"?" gauntlet-capsule__theme-option--active":""}`,onClick:()=>void D("corner"),role:"radio","aria-checked":de==="corner",children:[d.jsx("span",{className:"gauntlet-capsule__theme-swatch gauntlet-capsule__pill-mode-swatch--corner","aria-hidden":!0}),d.jsx("span",{children:"resting corner"})]}),d.jsxs("button",{type:"button",className:`gauntlet-capsule__theme-option${de==="cursor"?" gauntlet-capsule__theme-option--active":""}`,onClick:()=>void D("cursor"),role:"radio","aria-checked":de==="cursor",children:[d.jsx("span",{className:"gauntlet-capsule__theme-swatch gauntlet-capsule__pill-mode-swatch--cursor","aria-hidden":!0}),d.jsx("span",{children:"cursor pill"})]})]})]}),u&&d.jsx("div",{className:"gauntlet-capsule__settings-section",children:d.jsxs("label",{className:"gauntlet-capsule__settings-toggle",children:[d.jsx("input",{type:"checkbox",checked:S,onChange:Y=>void we(Y.target.checked)}),d.jsxs("span",{className:"gauntlet-capsule__settings-toggle-label",children:[d.jsx("strong",{children:"incluir screenshot"}),d.jsx("small",{children:"o modelo vê a página visível. útil para layouts e imagens, exposição de senhas/DMs visíveis. opt-in."})]})]})}),d.jsx("div",{className:"gauntlet-capsule__settings-section",children:d.jsxs("label",{className:"gauntlet-capsule__settings-toggle",children:[d.jsx("input",{type:"checkbox",checked:ee,onChange:Y=>void Me(Y.target.checked)}),d.jsxs("span",{className:"gauntlet-capsule__settings-toggle-label",children:[d.jsx("strong",{children:"ler resposta em voz alta"}),d.jsx("small",{children:"quando o modelo termina, a cápsula fala a resposta via Web Speech. cancela ao submeter outro pedido ou fechar a cápsula."})]})]})}),d.jsxs("div",{className:"gauntlet-capsule__settings-section",children:[d.jsx("span",{className:"gauntlet-capsule__settings-subtitle",children:"domínios escondidos"}),z?d.jsx("p",{className:"gauntlet-capsule__settings-empty",children:"a carregar…"}):b.length===0?d.jsx("p",{className:"gauntlet-capsule__settings-empty",children:"nenhum — clica direito no pill em qualquer site para o esconder."}):d.jsx("ul",{className:"gauntlet-capsule__settings-list",children:b.map(Y=>d.jsxs("li",{className:"gauntlet-capsule__settings-row",children:[d.jsx("span",{className:"gauntlet-capsule__settings-host",children:Y}),d.jsx("button",{type:"button",className:"gauntlet-capsule__settings-restore",onClick:()=>void je(Y),children:"restaurar"})]},Y))})]})]})}function rf(s){const u=s.match(/"compose"\s*:\s*"((?:[^"\\]|\\.)*)/);if(!u)return null;let i=u[1];return i.endsWith("\\")&&!i.endsWith("\\\\")&&(i=i.slice(0,-1)),i.replace(/\\n/g,`
`).replace(/\\r/g,"\r").replace(/\\t/g,"	").replace(/\\"/g,'"').replace(/\\\\/g,"\\")}function lf(s,u){const i={};return s.pageText&&(i.page_text=s.pageText),s.domSkeleton&&(i.dom_skeleton=s.domSkeleton),s.bbox&&(i.selection_bbox=s.bbox),u&&(i.screenshot_data_url=u),{source:"browser",url:s.url,page_title:s.pageTitle,selection:s.text||void 0,metadata:Object.keys(i).length>0?i:void 0}}function af(s){switch(s.type){case"fill":return`fill ${s.selector} ← "${sc(s.value,80)}"`;case"click":return`click ${s.selector}`;case"highlight":return`highlight ${s.selector}`;case"scroll_to":return`scroll to ${s.selector}`}}const kt=16,Cn=12;function wa(s,u,i){return i<u||s<u?u:s>i?i:s}function of(s,u){if(s<=600)return{width:Math.max(0,s-24),height:Math.max(0,u-24)};const x=wa(.72*s,560,820),g=wa(.72*u,420,560);return{width:x,height:g}}function sf(s,u,i){if(!s)return{top:Math.max(kt,Math.floor((u.height-i.height)/2)),left:Math.max(kt,Math.floor((u.width-i.width)/2)),placement:"center"};const x=u.height-(s.y+s.height)-Cn-kt,g=s.y-Cn-kt,m=u.width-(s.x+s.width)-Cn-kt,T=s.x-Cn-kt,b=x>=i.height,k=g>=i.height,z=m>=i.width,P=T>=i.width;let S,U,de;b?(S="below",U=s.y+s.height+Cn,de=s.x):k?(S="above",U=s.y-Cn-i.height,de=s.x):z?(S="right",de=s.x+s.width+Cn,U=Math.floor(s.y+s.height/2-i.height/2)):P?(S="left",de=s.x-Cn-i.width,U=Math.floor(s.y+s.height/2-i.height/2)):(S="center",U=Math.floor((u.height-i.height)/2),de=Math.floor((u.width-i.width)/2));const ne=u.height-i.height-kt,ee=u.width-i.width-kt;return U=wa(U,kt,Math.max(kt,ne)),de=wa(de,kt,Math.max(kt,ee)),{top:U,left:de,placement:S}}const uf=`
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
`,cf=100,df=new Set(["script","style","meta","link","noscript","head","html","br","hr","wbr"]),pf="gauntlet-capsule-host";function ff(s){const u=s.tagName.toLowerCase(),i=s.getAttribute("id");if(i&&!i.startsWith("gauntlet-"))return`${u}#${CSS.escape(i)}`;const x=s.getAttribute("name");if(x)return`${u}[name="${x}"]`;const g=s.getAttribute("type");if(g)return`${u}[type="${g}"]`;const m=Array.from(s.classList).filter(T=>T.length>2&&!T.startsWith("is-")&&!T.startsWith("has-")).slice(0,2);return m.length>0?`${u}.${m.map(T=>CSS.escape(T)).join(".")}`:u}function gf(s){try{const u=window.getComputedStyle(s);if(u.display==="none"||u.visibility==="hidden"||u.opacity==="0")return!1;const i=s.getBoundingClientRect();return!(i.width===0&&i.height===0||i.bottom<0||i.top>window.innerHeight||i.right<0||i.left>window.innerWidth)}catch{return!1}}function mf(s){let u=0,i=s;for(;i&&i!==document.body;)u++,i=i.parentElement;return u}function hf(s){var i;let u=s;for(;u;){if(u.id===pf||(i=u.id)!=null&&i.startsWith("gauntlet-"))return!0;u=u.parentElement}return!1}function xf(s){var z;const u=s.tagName.toLowerCase();if(df.has(u)||hf(s))return null;const i=ff(s),x=gf(s),g=mf(s),m={selector:i,tag:u,visible:x,depth:g},T=s.getAttribute("type");T&&(m.type=T);const b=s.getAttribute("placeholder")||s.getAttribute("aria-label")||s.getAttribute("title")||"";b&&(m.placeholder=b.trim().slice(0,80));const k=((z=s.innerText)==null?void 0:z.trim())??"";return k&&k.length>0&&(m.text=k.slice(0,50)),m}const vf=["input","textarea","select",'[contenteditable="true"]',"button","a[href]","label",'[role="button"]','[role="link"]','[role="textbox"]','[role="combobox"]','[role="listbox"]','[role="menuitem"]','[role="tab"]','[role="checkbox"]','[role="radio"]','[role="switch"]',"nav","main","form"].join(", ");function yf(){try{const s=[],u=new Set,i=document.querySelectorAll(vf);for(const x of Array.from(i)){if(s.length>=cf)break;const g=xf(x);g&&(u.has(g.selector)||(u.add(g.selector),s.push(g)))}return{elements:s}}catch{return{elements:[]}}}const nc=5e3;function _f(){try{const s=document.body;if(!s)return"";const i=(s.innerText??"").replace(/\r\n/g,`
`).replace(/\r/g,`
`).replace(/\n{3,}/g,`

`).replace(/[ \t]{2,}/g," ").trim();return i.length<=nc?i:i.slice(0,nc)+"…"}catch{return""}}function uc(){return{text:Sf(),url:bf(),pageTitle:Ef(),pageText:_f(),domSkeleton:JSON.stringify(yf()),bbox:Cf()}}const wf=50;async function kf(){var T;const s=uc();if(s.text)return s;const u=`gauntlet-cid-${Math.random().toString(36).slice(2)}`,i=[],x=b=>{const k=b.data;!k||k.gauntlet!=="subframe-selection-response"||k.cid===u&&(typeof k.text!="string"||!k.text||i.push({text:k.text,url:typeof k.url=="string"?k.url:void 0,pageTitle:typeof k.pageTitle=="string"?k.pageTitle:void 0}))};window.addEventListener("message",x);let g=null;try{g=document.querySelectorAll("iframe")}catch{g=null}if(g)for(const b of Array.from(g))try{(T=b.contentWindow)==null||T.postMessage({gauntlet:"subframe-selection-request",cid:u},"*")}catch{}await new Promise(b=>window.setTimeout(b,wf)),window.removeEventListener("message",x);const m=i.sort((b,k)=>k.text.length-b.text.length)[0];return m?{...s,text:m.text,url:m.url||s.url,pageTitle:m.pageTitle||s.pageTitle,bbox:null}:s}function Sf(){try{const s=window.getSelection();return s?s.toString().trim():""}catch{return""}}function bf(){try{return window.location.href}catch{return""}}function Ef(){try{return document.title??""}catch{return""}}function Cf(){try{const s=window.getSelection();if(!s||s.rangeCount===0||s.isCollapsed)return null;const i=s.getRangeAt(0).getBoundingClientRect();return i.width===0&&i.height===0?null:{x:i.x,y:i.y,width:i.width,height:i.height}}catch{return null}}const Nf={domExecution:!0,pillSurface:!0,screenshot:!0,dismissDomain:!0,voice:typeof window<"u"&&("SpeechRecognition"in window||"webkitSpeechRecognition"in window),streaming:!0,refreshSelection:!0,filesystemRead:!1,filesystemWrite:!1,screenCapture:!1,remoteVoice:!0};async function Tf(s,u,i){const x=await chrome.runtime.sendMessage({type:"gauntlet:fetch",url:u,method:s,headers:{"content-type":"application/json"},body:i===void 0?void 0:JSON.stringify(i)});if(!x||!x.ok)throw new Error(`composer: background fetch failed — ${(x==null?void 0:x.error)??"unknown error"}`);let g=null;if(x.body!=null&&x.body!=="")try{g=JSON.parse(x.body)}catch{g=x.body}const m=x.status??0;if(m<200||m>=300)throw new Error(`composer: ${m} ${x.statusText??""}`.trim());return g}const jf={async get(s){try{return(await chrome.storage.local.get(s))[s]??null}catch{return null}},async set(s,u){try{await chrome.storage.local.set({[s]:u})}catch{}},async remove(s){try{await chrome.storage.local.remove(s)}catch{}}};function zf(s,u,i){const x=chrome.runtime.connect({name:"gauntlet:stream"});let g=!1;function m(){if(!g){g=!0;try{x.disconnect()}catch{}}}return x.onMessage.addListener(T=>{if(!T||typeof T!="object")return;const b=T;if(b.type==="sse"&&typeof b.data=="string"){let k=null;try{k=JSON.parse(b.data)}catch{i.onError("malformed SSE payload"),m();return}if(b.event==="delta"){const z=k.text??"";i.onDelta(z)}else if(b.event==="done"){const z=k;i.onDone({plan_id:z.plan_id??"",context_id:z.context_id??"",actions:z.actions??[],compose:z.compose??null,reason:z.reason??null,model_used:z.model_used??"",latency_ms:z.latency_ms??0,raw_response:null}),m()}else if(b.event==="error"){const z=k.error??"model error";i.onError(z),m()}}else b.type==="error"?(i.onError(b.error??"transport error"),m()):b.type==="closed"&&(g||(i.onDone({plan_id:"",context_id:"",actions:[],compose:null,reason:"stream ended without result",model_used:"",latency_ms:0,raw_response:null}),g=!0))}),x.onDisconnect.addListener(()=>{var T;if(!g){const b=(T=chrome.runtime.lastError)==null?void 0:T.message;i.onError(b??"disconnected"),g=!0}}),x.postMessage({type:"start",url:s,body:u}),()=>{if(!g){try{x.postMessage({type:"abort"})}catch{}m()}}}function Pf(){return{shell:"browser",capabilities:Nf,transport:{fetchJson(s,u,i){return Tf(s,u,i)},stream:zf},storage:jf,selection:{read:()=>uc(),readAsync:()=>kf()},domActions:{execute:Ip},screenshot:{async capture(){var s;if(typeof chrome>"u"||!((s=chrome.runtime)!=null&&s.sendMessage))return null;try{const u=await chrome.runtime.sendMessage({type:"gauntlet:capture_screenshot"});return!(u!=null&&u.ok)||!u.dataUrl?null:u.dataUrl}catch{return null}}},debug:{async lastSummon(){try{const s=await chrome.runtime.sendMessage({type:"gauntlet:debug"});return(s==null?void 0:s.lastSummon)??null}catch{return null}}}}}const Mf=`
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
