(function(){const u=document.createElement("link").relList;if(u&&u.supports&&u.supports("modulepreload"))return;for(const m of document.querySelectorAll('link[rel="modulepreload"]'))y(m);new MutationObserver(m=>{for(const h of m)if(h.type==="childList")for(const T of h.addedNodes)T.tagName==="LINK"&&T.rel==="modulepreload"&&y(T)}).observe(document,{childList:!0,subtree:!0});function i(m){const h={};return m.integrity&&(h.integrity=m.integrity),m.referrerPolicy&&(h.referrerPolicy=m.referrerPolicy),m.crossOrigin==="use-credentials"?h.credentials="include":m.crossOrigin==="anonymous"?h.credentials="omit":h.credentials="same-origin",h}function y(m){if(m.ep)return;m.ep=!0;const h=i(m);fetch(m.href,h)}})();try{}catch(s){console.error("[wxt] Failed to initialize plugins",s)}var Ya={exports:{}},qr={},Ja={exports:{}},te={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Ru;function ep(){if(Ru)return te;Ru=1;var s=Symbol.for("react.element"),u=Symbol.for("react.portal"),i=Symbol.for("react.fragment"),y=Symbol.for("react.strict_mode"),m=Symbol.for("react.profiler"),h=Symbol.for("react.provider"),T=Symbol.for("react.context"),C=Symbol.for("react.forward_ref"),k=Symbol.for("react.suspense"),R=Symbol.for("react.memo"),z=Symbol.for("react.lazy"),S=Symbol.iterator;function F(g){return g===null||typeof g!="object"?null:(g=S&&g[S]||g["@@iterator"],typeof g=="function"?g:null)}var ce={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},ne=Object.assign,Z={};function re(g,b,G){this.props=g,this.context=b,this.refs=Z,this.updater=G||ce}re.prototype.isReactComponent={},re.prototype.setState=function(g,b){if(typeof g!="object"&&typeof g!="function"&&g!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,g,b,"setState")},re.prototype.forceUpdate=function(g){this.updater.enqueueForceUpdate(this,g,"forceUpdate")};function M(){}M.prototype=re.prototype;function Me(g,b,G){this.props=g,this.context=b,this.refs=Z,this.updater=G||ce}var je=Me.prototype=new M;je.constructor=Me,ne(je,re.prototype),je.isPureReactComponent=!0;var we=Array.isArray,K=Object.prototype.hasOwnProperty,ue={current:null},Pe={key:!0,ref:!0,__self:!0,__source:!0};function Oe(g,b,G){var X,le={},oe=null,pe=null;if(b!=null)for(X in b.ref!==void 0&&(pe=b.ref),b.key!==void 0&&(oe=""+b.key),b)K.call(b,X)&&!Pe.hasOwnProperty(X)&&(le[X]=b[X]);var q=arguments.length-2;if(q===1)le.children=G;else if(1<q){for(var he=Array(q),ze=0;ze<q;ze++)he[ze]=arguments[ze+2];le.children=he}if(g&&g.defaultProps)for(X in q=g.defaultProps,q)le[X]===void 0&&(le[X]=q[X]);return{$$typeof:s,type:g,key:oe,ref:pe,props:le,_owner:ue.current}}function _t(g,b){return{$$typeof:s,type:g.type,key:b,ref:g.ref,props:g.props,_owner:g._owner}}function ct(g){return typeof g=="object"&&g!==null&&g.$$typeof===s}function Pt(g){var b={"=":"=0",":":"=2"};return"$"+g.replace(/[=:]/g,function(G){return b[G]})}var rt=/\/+/g;function Ye(g,b){return typeof g=="object"&&g!==null&&g.key!=null?Pt(""+g.key):b.toString(36)}function lt(g,b,G,X,le){var oe=typeof g;(oe==="undefined"||oe==="boolean")&&(g=null);var pe=!1;if(g===null)pe=!0;else switch(oe){case"string":case"number":pe=!0;break;case"object":switch(g.$$typeof){case s:case u:pe=!0}}if(pe)return pe=g,le=le(pe),g=X===""?"."+Ye(pe,0):X,we(le)?(G="",g!=null&&(G=g.replace(rt,"$&/")+"/"),lt(le,b,G,"",function(ze){return ze})):le!=null&&(ct(le)&&(le=_t(le,G+(!le.key||pe&&pe.key===le.key?"":(""+le.key).replace(rt,"$&/")+"/")+g)),b.push(le)),1;if(pe=0,X=X===""?".":X+":",we(g))for(var q=0;q<g.length;q++){oe=g[q];var he=X+Ye(oe,q);pe+=lt(oe,b,G,he,le)}else if(he=F(g),typeof he=="function")for(g=he.call(g),q=0;!(oe=g.next()).done;)oe=oe.value,he=X+Ye(oe,q++),pe+=lt(oe,b,G,he,le);else if(oe==="object")throw b=String(g),Error("Objects are not valid as a React child (found: "+(b==="[object Object]"?"object with keys {"+Object.keys(g).join(", ")+"}":b)+"). If you meant to render a collection of children, use an array instead.");return pe}function dt(g,b,G){if(g==null)return g;var X=[],le=0;return lt(g,X,"","",function(oe){return b.call(G,oe,le++)}),X}function Ae(g){if(g._status===-1){var b=g._result;b=b(),b.then(function(G){(g._status===0||g._status===-1)&&(g._status=1,g._result=G)},function(G){(g._status===0||g._status===-1)&&(g._status=2,g._result=G)}),g._status===-1&&(g._status=0,g._result=b)}if(g._status===1)return g._result.default;throw g._result}var ve={current:null},D={transition:null},Q={ReactCurrentDispatcher:ve,ReactCurrentBatchConfig:D,ReactCurrentOwner:ue};function I(){throw Error("act(...) is not supported in production builds of React.")}return te.Children={map:dt,forEach:function(g,b,G){dt(g,function(){b.apply(this,arguments)},G)},count:function(g){var b=0;return dt(g,function(){b++}),b},toArray:function(g){return dt(g,function(b){return b})||[]},only:function(g){if(!ct(g))throw Error("React.Children.only expected to receive a single React element child.");return g}},te.Component=re,te.Fragment=i,te.Profiler=m,te.PureComponent=Me,te.StrictMode=y,te.Suspense=k,te.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Q,te.act=I,te.cloneElement=function(g,b,G){if(g==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+g+".");var X=ne({},g.props),le=g.key,oe=g.ref,pe=g._owner;if(b!=null){if(b.ref!==void 0&&(oe=b.ref,pe=ue.current),b.key!==void 0&&(le=""+b.key),g.type&&g.type.defaultProps)var q=g.type.defaultProps;for(he in b)K.call(b,he)&&!Pe.hasOwnProperty(he)&&(X[he]=b[he]===void 0&&q!==void 0?q[he]:b[he])}var he=arguments.length-2;if(he===1)X.children=G;else if(1<he){q=Array(he);for(var ze=0;ze<he;ze++)q[ze]=arguments[ze+2];X.children=q}return{$$typeof:s,type:g.type,key:le,ref:oe,props:X,_owner:pe}},te.createContext=function(g){return g={$$typeof:T,_currentValue:g,_currentValue2:g,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},g.Provider={$$typeof:h,_context:g},g.Consumer=g},te.createElement=Oe,te.createFactory=function(g){var b=Oe.bind(null,g);return b.type=g,b},te.createRef=function(){return{current:null}},te.forwardRef=function(g){return{$$typeof:C,render:g}},te.isValidElement=ct,te.lazy=function(g){return{$$typeof:z,_payload:{_status:-1,_result:g},_init:Ae}},te.memo=function(g,b){return{$$typeof:R,type:g,compare:b===void 0?null:b}},te.startTransition=function(g){var b=D.transition;D.transition={};try{g()}finally{D.transition=b}},te.unstable_act=I,te.useCallback=function(g,b){return ve.current.useCallback(g,b)},te.useContext=function(g){return ve.current.useContext(g)},te.useDebugValue=function(){},te.useDeferredValue=function(g){return ve.current.useDeferredValue(g)},te.useEffect=function(g,b){return ve.current.useEffect(g,b)},te.useId=function(){return ve.current.useId()},te.useImperativeHandle=function(g,b,G){return ve.current.useImperativeHandle(g,b,G)},te.useInsertionEffect=function(g,b){return ve.current.useInsertionEffect(g,b)},te.useLayoutEffect=function(g,b){return ve.current.useLayoutEffect(g,b)},te.useMemo=function(g,b){return ve.current.useMemo(g,b)},te.useReducer=function(g,b,G){return ve.current.useReducer(g,b,G)},te.useRef=function(g){return ve.current.useRef(g)},te.useState=function(g){return ve.current.useState(g)},te.useSyncExternalStore=function(g,b,G){return ve.current.useSyncExternalStore(g,b,G)},te.useTransition=function(){return ve.current.useTransition()},te.version="18.3.1",te}var Du;function ni(){return Du||(Du=1,Ja.exports=ep()),Ja.exports}/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Ou;function tp(){if(Ou)return qr;Ou=1;var s=ni(),u=Symbol.for("react.element"),i=Symbol.for("react.fragment"),y=Object.prototype.hasOwnProperty,m=s.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,h={key:!0,ref:!0,__self:!0,__source:!0};function T(C,k,R){var z,S={},F=null,ce=null;R!==void 0&&(F=""+R),k.key!==void 0&&(F=""+k.key),k.ref!==void 0&&(ce=k.ref);for(z in k)y.call(k,z)&&!h.hasOwnProperty(z)&&(S[z]=k[z]);if(C&&C.defaultProps)for(z in k=C.defaultProps,k)S[z]===void 0&&(S[z]=k[z]);return{$$typeof:u,type:C,key:F,ref:ce,props:S,_owner:m.current}}return qr.Fragment=i,qr.jsx=T,qr.jsxs=T,qr}var Iu;function np(){return Iu||(Iu=1,Ya.exports=tp()),Ya.exports}var p=np(),L=ni(),co={},Ga={exports:{}},nt={},qa={exports:{}},Xa={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var $u;function rp(){return $u||($u=1,(function(s){function u(D,Q){var I=D.length;D.push(Q);e:for(;0<I;){var g=I-1>>>1,b=D[g];if(0<m(b,Q))D[g]=Q,D[I]=b,I=g;else break e}}function i(D){return D.length===0?null:D[0]}function y(D){if(D.length===0)return null;var Q=D[0],I=D.pop();if(I!==Q){D[0]=I;e:for(var g=0,b=D.length,G=b>>>1;g<G;){var X=2*(g+1)-1,le=D[X],oe=X+1,pe=D[oe];if(0>m(le,I))oe<b&&0>m(pe,le)?(D[g]=pe,D[oe]=I,g=oe):(D[g]=le,D[X]=I,g=X);else if(oe<b&&0>m(pe,I))D[g]=pe,D[oe]=I,g=oe;else break e}}return Q}function m(D,Q){var I=D.sortIndex-Q.sortIndex;return I!==0?I:D.id-Q.id}if(typeof performance=="object"&&typeof performance.now=="function"){var h=performance;s.unstable_now=function(){return h.now()}}else{var T=Date,C=T.now();s.unstable_now=function(){return T.now()-C}}var k=[],R=[],z=1,S=null,F=3,ce=!1,ne=!1,Z=!1,re=typeof setTimeout=="function"?setTimeout:null,M=typeof clearTimeout=="function"?clearTimeout:null,Me=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function je(D){for(var Q=i(R);Q!==null;){if(Q.callback===null)y(R);else if(Q.startTime<=D)y(R),Q.sortIndex=Q.expirationTime,u(k,Q);else break;Q=i(R)}}function we(D){if(Z=!1,je(D),!ne)if(i(k)!==null)ne=!0,Ae(K);else{var Q=i(R);Q!==null&&ve(we,Q.startTime-D)}}function K(D,Q){ne=!1,Z&&(Z=!1,M(Oe),Oe=-1),ce=!0;var I=F;try{for(je(Q),S=i(k);S!==null&&(!(S.expirationTime>Q)||D&&!Pt());){var g=S.callback;if(typeof g=="function"){S.callback=null,F=S.priorityLevel;var b=g(S.expirationTime<=Q);Q=s.unstable_now(),typeof b=="function"?S.callback=b:S===i(k)&&y(k),je(Q)}else y(k);S=i(k)}if(S!==null)var G=!0;else{var X=i(R);X!==null&&ve(we,X.startTime-Q),G=!1}return G}finally{S=null,F=I,ce=!1}}var ue=!1,Pe=null,Oe=-1,_t=5,ct=-1;function Pt(){return!(s.unstable_now()-ct<_t)}function rt(){if(Pe!==null){var D=s.unstable_now();ct=D;var Q=!0;try{Q=Pe(!0,D)}finally{Q?Ye():(ue=!1,Pe=null)}}else ue=!1}var Ye;if(typeof Me=="function")Ye=function(){Me(rt)};else if(typeof MessageChannel<"u"){var lt=new MessageChannel,dt=lt.port2;lt.port1.onmessage=rt,Ye=function(){dt.postMessage(null)}}else Ye=function(){re(rt,0)};function Ae(D){Pe=D,ue||(ue=!0,Ye())}function ve(D,Q){Oe=re(function(){D(s.unstable_now())},Q)}s.unstable_IdlePriority=5,s.unstable_ImmediatePriority=1,s.unstable_LowPriority=4,s.unstable_NormalPriority=3,s.unstable_Profiling=null,s.unstable_UserBlockingPriority=2,s.unstable_cancelCallback=function(D){D.callback=null},s.unstable_continueExecution=function(){ne||ce||(ne=!0,Ae(K))},s.unstable_forceFrameRate=function(D){0>D||125<D?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):_t=0<D?Math.floor(1e3/D):5},s.unstable_getCurrentPriorityLevel=function(){return F},s.unstable_getFirstCallbackNode=function(){return i(k)},s.unstable_next=function(D){switch(F){case 1:case 2:case 3:var Q=3;break;default:Q=F}var I=F;F=Q;try{return D()}finally{F=I}},s.unstable_pauseExecution=function(){},s.unstable_requestPaint=function(){},s.unstable_runWithPriority=function(D,Q){switch(D){case 1:case 2:case 3:case 4:case 5:break;default:D=3}var I=F;F=D;try{return Q()}finally{F=I}},s.unstable_scheduleCallback=function(D,Q,I){var g=s.unstable_now();switch(typeof I=="object"&&I!==null?(I=I.delay,I=typeof I=="number"&&0<I?g+I:g):I=g,D){case 1:var b=-1;break;case 2:b=250;break;case 5:b=1073741823;break;case 4:b=1e4;break;default:b=5e3}return b=I+b,D={id:z++,callback:Q,priorityLevel:D,startTime:I,expirationTime:b,sortIndex:-1},I>g?(D.sortIndex=I,u(R,D),i(k)===null&&D===i(R)&&(Z?(M(Oe),Oe=-1):Z=!0,ve(we,I-g))):(D.sortIndex=b,u(k,D),ne||ce||(ne=!0,Ae(K))),D},s.unstable_shouldYield=Pt,s.unstable_wrapCallback=function(D){var Q=F;return function(){var I=F;F=Q;try{return D.apply(this,arguments)}finally{F=I}}}})(Xa)),Xa}var Fu;function lp(){return Fu||(Fu=1,qa.exports=rp()),qa.exports}/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Au;function op(){if(Au)return nt;Au=1;var s=ni(),u=lp();function i(e){for(var t="https://reactjs.org/docs/error-decoder.html?invariant="+e,n=1;n<arguments.length;n++)t+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var y=new Set,m={};function h(e,t){T(e,t),T(e+"Capture",t)}function T(e,t){for(m[e]=t,e=0;e<t.length;e++)y.add(t[e])}var C=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),k=Object.prototype.hasOwnProperty,R=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,z={},S={};function F(e){return k.call(S,e)?!0:k.call(z,e)?!1:R.test(e)?S[e]=!0:(z[e]=!0,!1)}function ce(e,t,n,r){if(n!==null&&n.type===0)return!1;switch(typeof t){case"function":case"symbol":return!0;case"boolean":return r?!1:n!==null?!n.acceptsBooleans:(e=e.toLowerCase().slice(0,5),e!=="data-"&&e!=="aria-");default:return!1}}function ne(e,t,n,r){if(t===null||typeof t>"u"||ce(e,t,n,r))return!0;if(r)return!1;if(n!==null)switch(n.type){case 3:return!t;case 4:return t===!1;case 5:return isNaN(t);case 6:return isNaN(t)||1>t}return!1}function Z(e,t,n,r,l,o,a){this.acceptsBooleans=t===2||t===3||t===4,this.attributeName=r,this.attributeNamespace=l,this.mustUseProperty=n,this.propertyName=e,this.type=t,this.sanitizeURL=o,this.removeEmptyString=a}var re={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e){re[e]=new Z(e,0,!1,e,null,!1,!1)}),[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(e){var t=e[0];re[t]=new Z(t,1,!1,e[1],null,!1,!1)}),["contentEditable","draggable","spellCheck","value"].forEach(function(e){re[e]=new Z(e,2,!1,e.toLowerCase(),null,!1,!1)}),["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(e){re[e]=new Z(e,2,!1,e,null,!1,!1)}),"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e){re[e]=new Z(e,3,!1,e.toLowerCase(),null,!1,!1)}),["checked","multiple","muted","selected"].forEach(function(e){re[e]=new Z(e,3,!0,e,null,!1,!1)}),["capture","download"].forEach(function(e){re[e]=new Z(e,4,!1,e,null,!1,!1)}),["cols","rows","size","span"].forEach(function(e){re[e]=new Z(e,6,!1,e,null,!1,!1)}),["rowSpan","start"].forEach(function(e){re[e]=new Z(e,5,!1,e.toLowerCase(),null,!1,!1)});var M=/[\-:]([a-z])/g;function Me(e){return e[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e){var t=e.replace(M,Me);re[t]=new Z(t,1,!1,e,null,!1,!1)}),"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e){var t=e.replace(M,Me);re[t]=new Z(t,1,!1,e,"http://www.w3.org/1999/xlink",!1,!1)}),["xml:base","xml:lang","xml:space"].forEach(function(e){var t=e.replace(M,Me);re[t]=new Z(t,1,!1,e,"http://www.w3.org/XML/1998/namespace",!1,!1)}),["tabIndex","crossOrigin"].forEach(function(e){re[e]=new Z(e,1,!1,e.toLowerCase(),null,!1,!1)}),re.xlinkHref=new Z("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1),["src","href","action","formAction"].forEach(function(e){re[e]=new Z(e,1,!1,e.toLowerCase(),null,!0,!0)});function je(e,t,n,r){var l=re.hasOwnProperty(t)?re[t]:null;(l!==null?l.type!==0:r||!(2<t.length)||t[0]!=="o"&&t[0]!=="O"||t[1]!=="n"&&t[1]!=="N")&&(ne(t,n,l,r)&&(n=null),r||l===null?F(t)&&(n===null?e.removeAttribute(t):e.setAttribute(t,""+n)):l.mustUseProperty?e[l.propertyName]=n===null?l.type===3?!1:"":n:(t=l.attributeName,r=l.attributeNamespace,n===null?e.removeAttribute(t):(l=l.type,n=l===3||l===4&&n===!0?"":""+n,r?e.setAttributeNS(r,t,n):e.setAttribute(t,n))))}var we=s.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,K=Symbol.for("react.element"),ue=Symbol.for("react.portal"),Pe=Symbol.for("react.fragment"),Oe=Symbol.for("react.strict_mode"),_t=Symbol.for("react.profiler"),ct=Symbol.for("react.provider"),Pt=Symbol.for("react.context"),rt=Symbol.for("react.forward_ref"),Ye=Symbol.for("react.suspense"),lt=Symbol.for("react.suspense_list"),dt=Symbol.for("react.memo"),Ae=Symbol.for("react.lazy"),ve=Symbol.for("react.offscreen"),D=Symbol.iterator;function Q(e){return e===null||typeof e!="object"?null:(e=D&&e[D]||e["@@iterator"],typeof e=="function"?e:null)}var I=Object.assign,g;function b(e){if(g===void 0)try{throw Error()}catch(n){var t=n.stack.trim().match(/\n( *(at )?)/);g=t&&t[1]||""}return`
`+g+e}var G=!1;function X(e,t){if(!e||G)return"";G=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(t)if(t=function(){throw Error()},Object.defineProperty(t.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(t,[])}catch(_){var r=_}Reflect.construct(e,[],t)}else{try{t.call()}catch(_){r=_}e.call(t.prototype)}else{try{throw Error()}catch(_){r=_}e()}}catch(_){if(_&&r&&typeof _.stack=="string"){for(var l=_.stack.split(`
`),o=r.stack.split(`
`),a=l.length-1,c=o.length-1;1<=a&&0<=c&&l[a]!==o[c];)c--;for(;1<=a&&0<=c;a--,c--)if(l[a]!==o[c]){if(a!==1||c!==1)do if(a--,c--,0>c||l[a]!==o[c]){var d=`
`+l[a].replace(" at new "," at ");return e.displayName&&d.includes("<anonymous>")&&(d=d.replace("<anonymous>",e.displayName)),d}while(1<=a&&0<=c);break}}}finally{G=!1,Error.prepareStackTrace=n}return(e=e?e.displayName||e.name:"")?b(e):""}function le(e){switch(e.tag){case 5:return b(e.type);case 16:return b("Lazy");case 13:return b("Suspense");case 19:return b("SuspenseList");case 0:case 2:case 15:return e=X(e.type,!1),e;case 11:return e=X(e.type.render,!1),e;case 1:return e=X(e.type,!0),e;default:return""}}function oe(e){if(e==null)return null;if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case Pe:return"Fragment";case ue:return"Portal";case _t:return"Profiler";case Oe:return"StrictMode";case Ye:return"Suspense";case lt:return"SuspenseList"}if(typeof e=="object")switch(e.$$typeof){case Pt:return(e.displayName||"Context")+".Consumer";case ct:return(e._context.displayName||"Context")+".Provider";case rt:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case dt:return t=e.displayName||null,t!==null?t:oe(e.type)||"Memo";case Ae:t=e._payload,e=e._init;try{return oe(e(t))}catch{}}return null}function pe(e){var t=e.type;switch(e.tag){case 24:return"Cache";case 9:return(t.displayName||"Context")+".Consumer";case 10:return(t._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return e=t.render,e=e.displayName||e.name||"",t.displayName||(e!==""?"ForwardRef("+e+")":"ForwardRef");case 7:return"Fragment";case 5:return t;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return oe(t);case 8:return t===Oe?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t}return null}function q(e){switch(typeof e){case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function he(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function ze(e){var t=he(e)?"checked":"value",n=Object.getOwnPropertyDescriptor(e.constructor.prototype,t),r=""+e[t];if(!e.hasOwnProperty(t)&&typeof n<"u"&&typeof n.get=="function"&&typeof n.set=="function"){var l=n.get,o=n.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return l.call(this)},set:function(a){r=""+a,o.call(this,a)}}),Object.defineProperty(e,t,{enumerable:n.enumerable}),{getValue:function(){return r},setValue:function(a){r=""+a},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function Yt(e){e._valueTracker||(e._valueTracker=ze(e))}function zt(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),r="";return e&&(r=he(e)?e.checked?"true":"false":e.value),e=r,e!==n?(t.setValue(e),!0):!1}function wt(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}function Jt(e,t){var n=t.checked;return I({},t,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:n??e._wrapperState.initialChecked})}function Zr(e,t){var n=t.defaultValue==null?"":t.defaultValue,r=t.checked!=null?t.checked:t.defaultChecked;n=q(t.value!=null?t.value:n),e._wrapperState={initialChecked:r,initialValue:n,controlled:t.type==="checkbox"||t.type==="radio"?t.checked!=null:t.value!=null}}function cr(e,t){t=t.checked,t!=null&&je(e,"checked",t,!1)}function ot(e,t){cr(e,t);var n=q(t.value),r=t.type;if(n!=null)r==="number"?(n===0&&e.value===""||e.value!=n)&&(e.value=""+n):e.value!==""+n&&(e.value=""+n);else if(r==="submit"||r==="reset"){e.removeAttribute("value");return}t.hasOwnProperty("value")?Gt(e,t.type,n):t.hasOwnProperty("defaultValue")&&Gt(e,t.type,q(t.defaultValue)),t.checked==null&&t.defaultChecked!=null&&(e.defaultChecked=!!t.defaultChecked)}function Sn(e,t,n){if(t.hasOwnProperty("value")||t.hasOwnProperty("defaultValue")){var r=t.type;if(!(r!=="submit"&&r!=="reset"||t.value!==void 0&&t.value!==null))return;t=""+e._wrapperState.initialValue,n||t===e.value||(e.value=t),e.defaultValue=t}n=e.name,n!==""&&(e.name=""),e.defaultChecked=!!e._wrapperState.initialChecked,n!==""&&(e.name=n)}function Gt(e,t,n){(t!=="number"||wt(e.ownerDocument)!==e)&&(n==null?e.defaultValue=""+e._wrapperState.initialValue:e.defaultValue!==""+n&&(e.defaultValue=""+n))}var $t=Array.isArray;function Ue(e,t,n,r){if(e=e.options,t){t={};for(var l=0;l<n.length;l++)t["$"+n[l]]=!0;for(n=0;n<e.length;n++)l=t.hasOwnProperty("$"+e[n].value),e[n].selected!==l&&(e[n].selected=l),l&&r&&(e[n].defaultSelected=!0)}else{for(n=""+q(n),t=null,l=0;l<e.length;l++){if(e[l].value===n){e[l].selected=!0,r&&(e[l].defaultSelected=!0);return}t!==null||e[l].disabled||(t=e[l])}t!==null&&(t.selected=!0)}}function bn(e,t){if(t.dangerouslySetInnerHTML!=null)throw Error(i(91));return I({},t,{value:void 0,defaultValue:void 0,children:""+e._wrapperState.initialValue})}function dr(e,t){var n=t.value;if(n==null){if(n=t.children,t=t.defaultValue,n!=null){if(t!=null)throw Error(i(92));if($t(n)){if(1<n.length)throw Error(i(93));n=n[0]}t=n}t==null&&(t=""),n=t}e._wrapperState={initialValue:q(n)}}function qt(e,t){var n=q(t.value),r=q(t.defaultValue);n!=null&&(n=""+n,n!==e.value&&(e.value=n),t.defaultValue==null&&e.defaultValue!==n&&(e.defaultValue=n)),r!=null&&(e.defaultValue=""+r)}function Ft(e){var t=e.textContent;t===e._wrapperState.initialValue&&t!==""&&t!==null&&(e.value=t)}function En(e){switch(e){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function pt(e,t){return e==null||e==="http://www.w3.org/1999/xhtml"?En(t):e==="http://www.w3.org/2000/svg"&&t==="foreignObject"?"http://www.w3.org/1999/xhtml":e}var Cn,el=(function(e){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(t,n,r,l){MSApp.execUnsafeLocalFunction(function(){return e(t,n,r,l)})}:e})(function(e,t){if(e.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in e)e.innerHTML=t;else{for(Cn=Cn||document.createElement("div"),Cn.innerHTML="<svg>"+t.valueOf().toString()+"</svg>",t=Cn.firstChild;e.firstChild;)e.removeChild(e.firstChild);for(;t.firstChild;)e.appendChild(t.firstChild)}});function Xt(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&n.nodeType===3){n.nodeValue=t;return}}e.textContent=t}var Zt={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},pr=["Webkit","ms","Moz","O"];Object.keys(Zt).forEach(function(e){pr.forEach(function(t){t=t+e.charAt(0).toUpperCase()+e.substring(1),Zt[t]=Zt[e]})});function fr(e,t,n){return t==null||typeof t=="boolean"||t===""?"":n||typeof t!="number"||t===0||Zt.hasOwnProperty(e)&&Zt[e]?(""+t).trim():t+"px"}function Lt(e,t){e=e.style;for(var n in t)if(t.hasOwnProperty(n)){var r=n.indexOf("--")===0,l=fr(n,t[n],r);n==="float"&&(n="cssFloat"),r?e.setProperty(n,l):e[n]=l}}var An=I({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function en(e,t){if(t){if(An[e]&&(t.children!=null||t.dangerouslySetInnerHTML!=null))throw Error(i(137,e));if(t.dangerouslySetInnerHTML!=null){if(t.children!=null)throw Error(i(60));if(typeof t.dangerouslySetInnerHTML!="object"||!("__html"in t.dangerouslySetInnerHTML))throw Error(i(61))}if(t.style!=null&&typeof t.style!="object")throw Error(i(62))}}function gr(e,t){if(e.indexOf("-")===-1)return typeof t.is=="string";switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var mr=null;function Un(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var hr=null,kt=null,tn=null;function tl(e){if(e=Or(e)){if(typeof hr!="function")throw Error(i(280));var t=e.stateNode;t&&(t=El(t),hr(e.stateNode,e.type,t))}}function nl(e){kt?tn?tn.push(e):tn=[e]:kt=e}function xr(){if(kt){var e=kt,t=tn;if(tn=kt=null,tl(e),t)for(e=0;e<t.length;e++)tl(t[e])}}function w(e,t){return e(t)}function A(){}var J=!1;function ge(e,t,n){if(J)return e(t,n);J=!0;try{return w(e,t,n)}finally{J=!1,(kt!==null||tn!==null)&&(A(),xr())}}function Ce(e,t){var n=e.stateNode;if(n===null)return null;var r=El(n);if(r===null)return null;n=r[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(r=!r.disabled)||(e=e.type,r=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!r;break e;default:e=!1}if(e)return null;if(n&&typeof n!="function")throw Error(i(231,t,typeof n));return n}var ee=!1;if(C)try{var ie={};Object.defineProperty(ie,"passive",{get:function(){ee=!0}}),window.addEventListener("test",ie,ie),window.removeEventListener("test",ie,ie)}catch{ee=!1}function me(e,t,n,r,l,o,a,c,d){var _=Array.prototype.slice.call(arguments,3);try{t.apply(n,_)}catch(N){this.onError(N)}}var fe=!1,rl=null,ll=!1,fo=null,ic={onError:function(e){fe=!0,rl=e}};function sc(e,t,n,r,l,o,a,c,d){fe=!1,rl=null,me.apply(ic,arguments)}function uc(e,t,n,r,l,o,a,c,d){if(sc.apply(this,arguments),fe){if(fe){var _=rl;fe=!1,rl=null}else throw Error(i(198));ll||(ll=!0,fo=_)}}function Nn(e){var t=e,n=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,(t.flags&4098)!==0&&(n=t.return),e=t.return;while(e)}return t.tag===3?n:null}function ri(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function li(e){if(Nn(e)!==e)throw Error(i(188))}function cc(e){var t=e.alternate;if(!t){if(t=Nn(e),t===null)throw Error(i(188));return t!==e?null:e}for(var n=e,r=t;;){var l=n.return;if(l===null)break;var o=l.alternate;if(o===null){if(r=l.return,r!==null){n=r;continue}break}if(l.child===o.child){for(o=l.child;o;){if(o===n)return li(l),e;if(o===r)return li(l),t;o=o.sibling}throw Error(i(188))}if(n.return!==r.return)n=l,r=o;else{for(var a=!1,c=l.child;c;){if(c===n){a=!0,n=l,r=o;break}if(c===r){a=!0,r=l,n=o;break}c=c.sibling}if(!a){for(c=o.child;c;){if(c===n){a=!0,n=o,r=l;break}if(c===r){a=!0,r=o,n=l;break}c=c.sibling}if(!a)throw Error(i(189))}}if(n.alternate!==r)throw Error(i(190))}if(n.tag!==3)throw Error(i(188));return n.stateNode.current===n?e:t}function oi(e){return e=cc(e),e!==null?ai(e):null}function ai(e){if(e.tag===5||e.tag===6)return e;for(e=e.child;e!==null;){var t=ai(e);if(t!==null)return t;e=e.sibling}return null}var ii=u.unstable_scheduleCallback,si=u.unstable_cancelCallback,dc=u.unstable_shouldYield,pc=u.unstable_requestPaint,Ne=u.unstable_now,fc=u.unstable_getCurrentPriorityLevel,go=u.unstable_ImmediatePriority,ui=u.unstable_UserBlockingPriority,ol=u.unstable_NormalPriority,gc=u.unstable_LowPriority,ci=u.unstable_IdlePriority,al=null,Mt=null;function mc(e){if(Mt&&typeof Mt.onCommitFiberRoot=="function")try{Mt.onCommitFiberRoot(al,e,void 0,(e.current.flags&128)===128)}catch{}}var St=Math.clz32?Math.clz32:vc,hc=Math.log,xc=Math.LN2;function vc(e){return e>>>=0,e===0?32:31-(hc(e)/xc|0)|0}var il=64,sl=4194304;function vr(e){switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return e&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return e}}function ul(e,t){var n=e.pendingLanes;if(n===0)return 0;var r=0,l=e.suspendedLanes,o=e.pingedLanes,a=n&268435455;if(a!==0){var c=a&~l;c!==0?r=vr(c):(o&=a,o!==0&&(r=vr(o)))}else a=n&~l,a!==0?r=vr(a):o!==0&&(r=vr(o));if(r===0)return 0;if(t!==0&&t!==r&&(t&l)===0&&(l=r&-r,o=t&-t,l>=o||l===16&&(o&4194240)!==0))return t;if((r&4)!==0&&(r|=n&16),t=e.entangledLanes,t!==0)for(e=e.entanglements,t&=r;0<t;)n=31-St(t),l=1<<n,r|=e[n],t&=~l;return r}function yc(e,t){switch(e){case 1:case 2:case 4:return t+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function _c(e,t){for(var n=e.suspendedLanes,r=e.pingedLanes,l=e.expirationTimes,o=e.pendingLanes;0<o;){var a=31-St(o),c=1<<a,d=l[a];d===-1?((c&n)===0||(c&r)!==0)&&(l[a]=yc(c,t)):d<=t&&(e.expiredLanes|=c),o&=~c}}function mo(e){return e=e.pendingLanes&-1073741825,e!==0?e:e&1073741824?1073741824:0}function di(){var e=il;return il<<=1,(il&4194240)===0&&(il=64),e}function ho(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function yr(e,t,n){e.pendingLanes|=t,t!==536870912&&(e.suspendedLanes=0,e.pingedLanes=0),e=e.eventTimes,t=31-St(t),e[t]=n}function wc(e,t){var n=e.pendingLanes&~t;e.pendingLanes=t,e.suspendedLanes=0,e.pingedLanes=0,e.expiredLanes&=t,e.mutableReadLanes&=t,e.entangledLanes&=t,t=e.entanglements;var r=e.eventTimes;for(e=e.expirationTimes;0<n;){var l=31-St(n),o=1<<l;t[l]=0,r[l]=-1,e[l]=-1,n&=~o}}function xo(e,t){var n=e.entangledLanes|=t;for(e=e.entanglements;n;){var r=31-St(n),l=1<<r;l&t|e[r]&t&&(e[r]|=t),n&=~l}}var de=0;function pi(e){return e&=-e,1<e?4<e?(e&268435455)!==0?16:536870912:4:1}var fi,vo,gi,mi,hi,yo=!1,cl=[],nn=null,rn=null,ln=null,_r=new Map,wr=new Map,on=[],kc="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function xi(e,t){switch(e){case"focusin":case"focusout":nn=null;break;case"dragenter":case"dragleave":rn=null;break;case"mouseover":case"mouseout":ln=null;break;case"pointerover":case"pointerout":_r.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":wr.delete(t.pointerId)}}function kr(e,t,n,r,l,o){return e===null||e.nativeEvent!==o?(e={blockedOn:t,domEventName:n,eventSystemFlags:r,nativeEvent:o,targetContainers:[l]},t!==null&&(t=Or(t),t!==null&&vo(t)),e):(e.eventSystemFlags|=r,t=e.targetContainers,l!==null&&t.indexOf(l)===-1&&t.push(l),e)}function Sc(e,t,n,r,l){switch(t){case"focusin":return nn=kr(nn,e,t,n,r,l),!0;case"dragenter":return rn=kr(rn,e,t,n,r,l),!0;case"mouseover":return ln=kr(ln,e,t,n,r,l),!0;case"pointerover":var o=l.pointerId;return _r.set(o,kr(_r.get(o)||null,e,t,n,r,l)),!0;case"gotpointercapture":return o=l.pointerId,wr.set(o,kr(wr.get(o)||null,e,t,n,r,l)),!0}return!1}function vi(e){var t=Tn(e.target);if(t!==null){var n=Nn(t);if(n!==null){if(t=n.tag,t===13){if(t=ri(n),t!==null){e.blockedOn=t,hi(e.priority,function(){gi(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}e.blockedOn=null}function dl(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var n=wo(e.domEventName,e.eventSystemFlags,t[0],e.nativeEvent);if(n===null){n=e.nativeEvent;var r=new n.constructor(n.type,n);mr=r,n.target.dispatchEvent(r),mr=null}else return t=Or(n),t!==null&&vo(t),e.blockedOn=n,!1;t.shift()}return!0}function yi(e,t,n){dl(e)&&n.delete(t)}function bc(){yo=!1,nn!==null&&dl(nn)&&(nn=null),rn!==null&&dl(rn)&&(rn=null),ln!==null&&dl(ln)&&(ln=null),_r.forEach(yi),wr.forEach(yi)}function Sr(e,t){e.blockedOn===t&&(e.blockedOn=null,yo||(yo=!0,u.unstable_scheduleCallback(u.unstable_NormalPriority,bc)))}function br(e){function t(l){return Sr(l,e)}if(0<cl.length){Sr(cl[0],e);for(var n=1;n<cl.length;n++){var r=cl[n];r.blockedOn===e&&(r.blockedOn=null)}}for(nn!==null&&Sr(nn,e),rn!==null&&Sr(rn,e),ln!==null&&Sr(ln,e),_r.forEach(t),wr.forEach(t),n=0;n<on.length;n++)r=on[n],r.blockedOn===e&&(r.blockedOn=null);for(;0<on.length&&(n=on[0],n.blockedOn===null);)vi(n),n.blockedOn===null&&on.shift()}var Bn=we.ReactCurrentBatchConfig,pl=!0;function Ec(e,t,n,r){var l=de,o=Bn.transition;Bn.transition=null;try{de=1,_o(e,t,n,r)}finally{de=l,Bn.transition=o}}function Cc(e,t,n,r){var l=de,o=Bn.transition;Bn.transition=null;try{de=4,_o(e,t,n,r)}finally{de=l,Bn.transition=o}}function _o(e,t,n,r){if(pl){var l=wo(e,t,n,r);if(l===null)$o(e,t,r,fl,n),xi(e,r);else if(Sc(l,e,t,n,r))r.stopPropagation();else if(xi(e,r),t&4&&-1<kc.indexOf(e)){for(;l!==null;){var o=Or(l);if(o!==null&&fi(o),o=wo(e,t,n,r),o===null&&$o(e,t,r,fl,n),o===l)break;l=o}l!==null&&r.stopPropagation()}else $o(e,t,r,null,n)}}var fl=null;function wo(e,t,n,r){if(fl=null,e=Un(r),e=Tn(e),e!==null)if(t=Nn(e),t===null)e=null;else if(n=t.tag,n===13){if(e=ri(t),e!==null)return e;e=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null);return fl=e,null}function _i(e){switch(e){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(fc()){case go:return 1;case ui:return 4;case ol:case gc:return 16;case ci:return 536870912;default:return 16}default:return 16}}var an=null,ko=null,gl=null;function wi(){if(gl)return gl;var e,t=ko,n=t.length,r,l="value"in an?an.value:an.textContent,o=l.length;for(e=0;e<n&&t[e]===l[e];e++);var a=n-e;for(r=1;r<=a&&t[n-r]===l[o-r];r++);return gl=l.slice(e,1<r?1-r:void 0)}function ml(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function hl(){return!0}function ki(){return!1}function at(e){function t(n,r,l,o,a){this._reactName=n,this._targetInst=l,this.type=r,this.nativeEvent=o,this.target=a,this.currentTarget=null;for(var c in e)e.hasOwnProperty(c)&&(n=e[c],this[c]=n?n(o):o[c]);return this.isDefaultPrevented=(o.defaultPrevented!=null?o.defaultPrevented:o.returnValue===!1)?hl:ki,this.isPropagationStopped=ki,this}return I(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=hl)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=hl)},persist:function(){},isPersistent:hl}),t}var Hn={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},So=at(Hn),Er=I({},Hn,{view:0,detail:0}),Nc=at(Er),bo,Eo,Cr,xl=I({},Er,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:No,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==Cr&&(Cr&&e.type==="mousemove"?(bo=e.screenX-Cr.screenX,Eo=e.screenY-Cr.screenY):Eo=bo=0,Cr=e),bo)},movementY:function(e){return"movementY"in e?e.movementY:Eo}}),Si=at(xl),Tc=I({},xl,{dataTransfer:0}),jc=at(Tc),Pc=I({},Er,{relatedTarget:0}),Co=at(Pc),zc=I({},Hn,{animationName:0,elapsedTime:0,pseudoElement:0}),Lc=at(zc),Mc=I({},Hn,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),Rc=at(Mc),Dc=I({},Hn,{data:0}),bi=at(Dc),Oc={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Ic={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},$c={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Fc(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=$c[e])?!!t[e]:!1}function No(){return Fc}var Ac=I({},Er,{key:function(e){if(e.key){var t=Oc[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=ml(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?Ic[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:No,charCode:function(e){return e.type==="keypress"?ml(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?ml(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),Uc=at(Ac),Bc=I({},xl,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Ei=at(Bc),Hc=I({},Er,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:No}),Vc=at(Hc),Wc=I({},Hn,{propertyName:0,elapsedTime:0,pseudoElement:0}),Qc=at(Wc),Kc=I({},xl,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),Yc=at(Kc),Jc=[9,13,27,32],To=C&&"CompositionEvent"in window,Nr=null;C&&"documentMode"in document&&(Nr=document.documentMode);var Gc=C&&"TextEvent"in window&&!Nr,Ci=C&&(!To||Nr&&8<Nr&&11>=Nr),Ni=" ",Ti=!1;function ji(e,t){switch(e){case"keyup":return Jc.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Pi(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var Vn=!1;function qc(e,t){switch(e){case"compositionend":return Pi(t);case"keypress":return t.which!==32?null:(Ti=!0,Ni);case"textInput":return e=t.data,e===Ni&&Ti?null:e;default:return null}}function Xc(e,t){if(Vn)return e==="compositionend"||!To&&ji(e,t)?(e=wi(),gl=ko=an=null,Vn=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return Ci&&t.locale!=="ko"?null:t.data;default:return null}}var Zc={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function zi(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!Zc[e.type]:t==="textarea"}function Li(e,t,n,r){nl(r),t=kl(t,"onChange"),0<t.length&&(n=new So("onChange","change",null,n,r),e.push({event:n,listeners:t}))}var Tr=null,jr=null;function ed(e){Gi(e,0)}function vl(e){var t=Jn(e);if(zt(t))return e}function td(e,t){if(e==="change")return t}var Mi=!1;if(C){var jo;if(C){var Po="oninput"in document;if(!Po){var Ri=document.createElement("div");Ri.setAttribute("oninput","return;"),Po=typeof Ri.oninput=="function"}jo=Po}else jo=!1;Mi=jo&&(!document.documentMode||9<document.documentMode)}function Di(){Tr&&(Tr.detachEvent("onpropertychange",Oi),jr=Tr=null)}function Oi(e){if(e.propertyName==="value"&&vl(jr)){var t=[];Li(t,jr,e,Un(e)),ge(ed,t)}}function nd(e,t,n){e==="focusin"?(Di(),Tr=t,jr=n,Tr.attachEvent("onpropertychange",Oi)):e==="focusout"&&Di()}function rd(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return vl(jr)}function ld(e,t){if(e==="click")return vl(t)}function od(e,t){if(e==="input"||e==="change")return vl(t)}function ad(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var bt=typeof Object.is=="function"?Object.is:ad;function Pr(e,t){if(bt(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var n=Object.keys(e),r=Object.keys(t);if(n.length!==r.length)return!1;for(r=0;r<n.length;r++){var l=n[r];if(!k.call(t,l)||!bt(e[l],t[l]))return!1}return!0}function Ii(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function $i(e,t){var n=Ii(e);e=0;for(var r;n;){if(n.nodeType===3){if(r=e+n.textContent.length,e<=t&&r>=t)return{node:n,offset:t-e};e=r}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=Ii(n)}}function Fi(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?Fi(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function Ai(){for(var e=window,t=wt();t instanceof e.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href=="string"}catch{n=!1}if(n)e=t.contentWindow;else break;t=wt(e.document)}return t}function zo(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}function id(e){var t=Ai(),n=e.focusedElem,r=e.selectionRange;if(t!==n&&n&&n.ownerDocument&&Fi(n.ownerDocument.documentElement,n)){if(r!==null&&zo(n)){if(t=r.start,e=r.end,e===void 0&&(e=t),"selectionStart"in n)n.selectionStart=t,n.selectionEnd=Math.min(e,n.value.length);else if(e=(t=n.ownerDocument||document)&&t.defaultView||window,e.getSelection){e=e.getSelection();var l=n.textContent.length,o=Math.min(r.start,l);r=r.end===void 0?o:Math.min(r.end,l),!e.extend&&o>r&&(l=r,r=o,o=l),l=$i(n,o);var a=$i(n,r);l&&a&&(e.rangeCount!==1||e.anchorNode!==l.node||e.anchorOffset!==l.offset||e.focusNode!==a.node||e.focusOffset!==a.offset)&&(t=t.createRange(),t.setStart(l.node,l.offset),e.removeAllRanges(),o>r?(e.addRange(t),e.extend(a.node,a.offset)):(t.setEnd(a.node,a.offset),e.addRange(t)))}}for(t=[],e=n;e=e.parentNode;)e.nodeType===1&&t.push({element:e,left:e.scrollLeft,top:e.scrollTop});for(typeof n.focus=="function"&&n.focus(),n=0;n<t.length;n++)e=t[n],e.element.scrollLeft=e.left,e.element.scrollTop=e.top}}var sd=C&&"documentMode"in document&&11>=document.documentMode,Wn=null,Lo=null,zr=null,Mo=!1;function Ui(e,t,n){var r=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;Mo||Wn==null||Wn!==wt(r)||(r=Wn,"selectionStart"in r&&zo(r)?r={start:r.selectionStart,end:r.selectionEnd}:(r=(r.ownerDocument&&r.ownerDocument.defaultView||window).getSelection(),r={anchorNode:r.anchorNode,anchorOffset:r.anchorOffset,focusNode:r.focusNode,focusOffset:r.focusOffset}),zr&&Pr(zr,r)||(zr=r,r=kl(Lo,"onSelect"),0<r.length&&(t=new So("onSelect","select",null,t,n),e.push({event:t,listeners:r}),t.target=Wn)))}function yl(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n["Webkit"+e]="webkit"+t,n["Moz"+e]="moz"+t,n}var Qn={animationend:yl("Animation","AnimationEnd"),animationiteration:yl("Animation","AnimationIteration"),animationstart:yl("Animation","AnimationStart"),transitionend:yl("Transition","TransitionEnd")},Ro={},Bi={};C&&(Bi=document.createElement("div").style,"AnimationEvent"in window||(delete Qn.animationend.animation,delete Qn.animationiteration.animation,delete Qn.animationstart.animation),"TransitionEvent"in window||delete Qn.transitionend.transition);function _l(e){if(Ro[e])return Ro[e];if(!Qn[e])return e;var t=Qn[e],n;for(n in t)if(t.hasOwnProperty(n)&&n in Bi)return Ro[e]=t[n];return e}var Hi=_l("animationend"),Vi=_l("animationiteration"),Wi=_l("animationstart"),Qi=_l("transitionend"),Ki=new Map,Yi="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function sn(e,t){Ki.set(e,t),h(t,[e])}for(var Do=0;Do<Yi.length;Do++){var Oo=Yi[Do],ud=Oo.toLowerCase(),cd=Oo[0].toUpperCase()+Oo.slice(1);sn(ud,"on"+cd)}sn(Hi,"onAnimationEnd"),sn(Vi,"onAnimationIteration"),sn(Wi,"onAnimationStart"),sn("dblclick","onDoubleClick"),sn("focusin","onFocus"),sn("focusout","onBlur"),sn(Qi,"onTransitionEnd"),T("onMouseEnter",["mouseout","mouseover"]),T("onMouseLeave",["mouseout","mouseover"]),T("onPointerEnter",["pointerout","pointerover"]),T("onPointerLeave",["pointerout","pointerover"]),h("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),h("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),h("onBeforeInput",["compositionend","keypress","textInput","paste"]),h("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),h("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),h("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Lr="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),dd=new Set("cancel close invalid load scroll toggle".split(" ").concat(Lr));function Ji(e,t,n){var r=e.type||"unknown-event";e.currentTarget=n,uc(r,t,void 0,e),e.currentTarget=null}function Gi(e,t){t=(t&4)!==0;for(var n=0;n<e.length;n++){var r=e[n],l=r.event;r=r.listeners;e:{var o=void 0;if(t)for(var a=r.length-1;0<=a;a--){var c=r[a],d=c.instance,_=c.currentTarget;if(c=c.listener,d!==o&&l.isPropagationStopped())break e;Ji(l,c,_),o=d}else for(a=0;a<r.length;a++){if(c=r[a],d=c.instance,_=c.currentTarget,c=c.listener,d!==o&&l.isPropagationStopped())break e;Ji(l,c,_),o=d}}}if(ll)throw e=fo,ll=!1,fo=null,e}function ye(e,t){var n=t[Vo];n===void 0&&(n=t[Vo]=new Set);var r=e+"__bubble";n.has(r)||(qi(t,e,2,!1),n.add(r))}function Io(e,t,n){var r=0;t&&(r|=4),qi(n,e,r,t)}var wl="_reactListening"+Math.random().toString(36).slice(2);function Mr(e){if(!e[wl]){e[wl]=!0,y.forEach(function(n){n!=="selectionchange"&&(dd.has(n)||Io(n,!1,e),Io(n,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[wl]||(t[wl]=!0,Io("selectionchange",!1,t))}}function qi(e,t,n,r){switch(_i(t)){case 1:var l=Ec;break;case 4:l=Cc;break;default:l=_o}n=l.bind(null,t,n,e),l=void 0,!ee||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(l=!0),r?l!==void 0?e.addEventListener(t,n,{capture:!0,passive:l}):e.addEventListener(t,n,!0):l!==void 0?e.addEventListener(t,n,{passive:l}):e.addEventListener(t,n,!1)}function $o(e,t,n,r,l){var o=r;if((t&1)===0&&(t&2)===0&&r!==null)e:for(;;){if(r===null)return;var a=r.tag;if(a===3||a===4){var c=r.stateNode.containerInfo;if(c===l||c.nodeType===8&&c.parentNode===l)break;if(a===4)for(a=r.return;a!==null;){var d=a.tag;if((d===3||d===4)&&(d=a.stateNode.containerInfo,d===l||d.nodeType===8&&d.parentNode===l))return;a=a.return}for(;c!==null;){if(a=Tn(c),a===null)return;if(d=a.tag,d===5||d===6){r=o=a;continue e}c=c.parentNode}}r=r.return}ge(function(){var _=o,N=Un(n),j=[];e:{var E=Ki.get(e);if(E!==void 0){var O=So,U=e;switch(e){case"keypress":if(ml(n)===0)break e;case"keydown":case"keyup":O=Uc;break;case"focusin":U="focus",O=Co;break;case"focusout":U="blur",O=Co;break;case"beforeblur":case"afterblur":O=Co;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":O=Si;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":O=jc;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":O=Vc;break;case Hi:case Vi:case Wi:O=Lc;break;case Qi:O=Qc;break;case"scroll":O=Nc;break;case"wheel":O=Yc;break;case"copy":case"cut":case"paste":O=Rc;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":O=Ei}var B=(t&4)!==0,Te=!B&&e==="scroll",x=B?E!==null?E+"Capture":null:E;B=[];for(var f=_,v;f!==null;){v=f;var P=v.stateNode;if(v.tag===5&&P!==null&&(v=P,x!==null&&(P=Ce(f,x),P!=null&&B.push(Rr(f,P,v)))),Te)break;f=f.return}0<B.length&&(E=new O(E,U,null,n,N),j.push({event:E,listeners:B}))}}if((t&7)===0){e:{if(E=e==="mouseover"||e==="pointerover",O=e==="mouseout"||e==="pointerout",E&&n!==mr&&(U=n.relatedTarget||n.fromElement)&&(Tn(U)||U[At]))break e;if((O||E)&&(E=N.window===N?N:(E=N.ownerDocument)?E.defaultView||E.parentWindow:window,O?(U=n.relatedTarget||n.toElement,O=_,U=U?Tn(U):null,U!==null&&(Te=Nn(U),U!==Te||U.tag!==5&&U.tag!==6)&&(U=null)):(O=null,U=_),O!==U)){if(B=Si,P="onMouseLeave",x="onMouseEnter",f="mouse",(e==="pointerout"||e==="pointerover")&&(B=Ei,P="onPointerLeave",x="onPointerEnter",f="pointer"),Te=O==null?E:Jn(O),v=U==null?E:Jn(U),E=new B(P,f+"leave",O,n,N),E.target=Te,E.relatedTarget=v,P=null,Tn(N)===_&&(B=new B(x,f+"enter",U,n,N),B.target=v,B.relatedTarget=Te,P=B),Te=P,O&&U)t:{for(B=O,x=U,f=0,v=B;v;v=Kn(v))f++;for(v=0,P=x;P;P=Kn(P))v++;for(;0<f-v;)B=Kn(B),f--;for(;0<v-f;)x=Kn(x),v--;for(;f--;){if(B===x||x!==null&&B===x.alternate)break t;B=Kn(B),x=Kn(x)}B=null}else B=null;O!==null&&Xi(j,E,O,B,!1),U!==null&&Te!==null&&Xi(j,Te,U,B,!0)}}e:{if(E=_?Jn(_):window,O=E.nodeName&&E.nodeName.toLowerCase(),O==="select"||O==="input"&&E.type==="file")var H=td;else if(zi(E))if(Mi)H=od;else{H=rd;var V=nd}else(O=E.nodeName)&&O.toLowerCase()==="input"&&(E.type==="checkbox"||E.type==="radio")&&(H=ld);if(H&&(H=H(e,_))){Li(j,H,n,N);break e}V&&V(e,E,_),e==="focusout"&&(V=E._wrapperState)&&V.controlled&&E.type==="number"&&Gt(E,"number",E.value)}switch(V=_?Jn(_):window,e){case"focusin":(zi(V)||V.contentEditable==="true")&&(Wn=V,Lo=_,zr=null);break;case"focusout":zr=Lo=Wn=null;break;case"mousedown":Mo=!0;break;case"contextmenu":case"mouseup":case"dragend":Mo=!1,Ui(j,n,N);break;case"selectionchange":if(sd)break;case"keydown":case"keyup":Ui(j,n,N)}var W;if(To)e:{switch(e){case"compositionstart":var Y="onCompositionStart";break e;case"compositionend":Y="onCompositionEnd";break e;case"compositionupdate":Y="onCompositionUpdate";break e}Y=void 0}else Vn?ji(e,n)&&(Y="onCompositionEnd"):e==="keydown"&&n.keyCode===229&&(Y="onCompositionStart");Y&&(Ci&&n.locale!=="ko"&&(Vn||Y!=="onCompositionStart"?Y==="onCompositionEnd"&&Vn&&(W=wi()):(an=N,ko="value"in an?an.value:an.textContent,Vn=!0)),V=kl(_,Y),0<V.length&&(Y=new bi(Y,e,null,n,N),j.push({event:Y,listeners:V}),W?Y.data=W:(W=Pi(n),W!==null&&(Y.data=W)))),(W=Gc?qc(e,n):Xc(e,n))&&(_=kl(_,"onBeforeInput"),0<_.length&&(N=new bi("onBeforeInput","beforeinput",null,n,N),j.push({event:N,listeners:_}),N.data=W))}Gi(j,t)})}function Rr(e,t,n){return{instance:e,listener:t,currentTarget:n}}function kl(e,t){for(var n=t+"Capture",r=[];e!==null;){var l=e,o=l.stateNode;l.tag===5&&o!==null&&(l=o,o=Ce(e,n),o!=null&&r.unshift(Rr(e,o,l)),o=Ce(e,t),o!=null&&r.push(Rr(e,o,l))),e=e.return}return r}function Kn(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5);return e||null}function Xi(e,t,n,r,l){for(var o=t._reactName,a=[];n!==null&&n!==r;){var c=n,d=c.alternate,_=c.stateNode;if(d!==null&&d===r)break;c.tag===5&&_!==null&&(c=_,l?(d=Ce(n,o),d!=null&&a.unshift(Rr(n,d,c))):l||(d=Ce(n,o),d!=null&&a.push(Rr(n,d,c)))),n=n.return}a.length!==0&&e.push({event:t,listeners:a})}var pd=/\r\n?/g,fd=/\u0000|\uFFFD/g;function Zi(e){return(typeof e=="string"?e:""+e).replace(pd,`
`).replace(fd,"")}function Sl(e,t,n){if(t=Zi(t),Zi(e)!==t&&n)throw Error(i(425))}function bl(){}var Fo=null,Ao=null;function Uo(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var Bo=typeof setTimeout=="function"?setTimeout:void 0,gd=typeof clearTimeout=="function"?clearTimeout:void 0,es=typeof Promise=="function"?Promise:void 0,md=typeof queueMicrotask=="function"?queueMicrotask:typeof es<"u"?function(e){return es.resolve(null).then(e).catch(hd)}:Bo;function hd(e){setTimeout(function(){throw e})}function Ho(e,t){var n=t,r=0;do{var l=n.nextSibling;if(e.removeChild(n),l&&l.nodeType===8)if(n=l.data,n==="/$"){if(r===0){e.removeChild(l),br(t);return}r--}else n!=="$"&&n!=="$?"&&n!=="$!"||r++;n=l}while(n);br(t)}function un(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?")break;if(t==="/$")return null}}return e}function ts(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="$"||n==="$!"||n==="$?"){if(t===0)return e;t--}else n==="/$"&&t++}e=e.previousSibling}return null}var Yn=Math.random().toString(36).slice(2),Rt="__reactFiber$"+Yn,Dr="__reactProps$"+Yn,At="__reactContainer$"+Yn,Vo="__reactEvents$"+Yn,xd="__reactListeners$"+Yn,vd="__reactHandles$"+Yn;function Tn(e){var t=e[Rt];if(t)return t;for(var n=e.parentNode;n;){if(t=n[At]||n[Rt]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(e=ts(e);e!==null;){if(n=e[Rt])return n;e=ts(e)}return t}e=n,n=e.parentNode}return null}function Or(e){return e=e[Rt]||e[At],!e||e.tag!==5&&e.tag!==6&&e.tag!==13&&e.tag!==3?null:e}function Jn(e){if(e.tag===5||e.tag===6)return e.stateNode;throw Error(i(33))}function El(e){return e[Dr]||null}var Wo=[],Gn=-1;function cn(e){return{current:e}}function _e(e){0>Gn||(e.current=Wo[Gn],Wo[Gn]=null,Gn--)}function xe(e,t){Gn++,Wo[Gn]=e.current,e.current=t}var dn={},Ve=cn(dn),qe=cn(!1),jn=dn;function qn(e,t){var n=e.type.contextTypes;if(!n)return dn;var r=e.stateNode;if(r&&r.__reactInternalMemoizedUnmaskedChildContext===t)return r.__reactInternalMemoizedMaskedChildContext;var l={},o;for(o in n)l[o]=t[o];return r&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=t,e.__reactInternalMemoizedMaskedChildContext=l),l}function Xe(e){return e=e.childContextTypes,e!=null}function Cl(){_e(qe),_e(Ve)}function ns(e,t,n){if(Ve.current!==dn)throw Error(i(168));xe(Ve,t),xe(qe,n)}function rs(e,t,n){var r=e.stateNode;if(t=t.childContextTypes,typeof r.getChildContext!="function")return n;r=r.getChildContext();for(var l in r)if(!(l in t))throw Error(i(108,pe(e)||"Unknown",l));return I({},n,r)}function Nl(e){return e=(e=e.stateNode)&&e.__reactInternalMemoizedMergedChildContext||dn,jn=Ve.current,xe(Ve,e),xe(qe,qe.current),!0}function ls(e,t,n){var r=e.stateNode;if(!r)throw Error(i(169));n?(e=rs(e,t,jn),r.__reactInternalMemoizedMergedChildContext=e,_e(qe),_e(Ve),xe(Ve,e)):_e(qe),xe(qe,n)}var Ut=null,Tl=!1,Qo=!1;function os(e){Ut===null?Ut=[e]:Ut.push(e)}function yd(e){Tl=!0,os(e)}function pn(){if(!Qo&&Ut!==null){Qo=!0;var e=0,t=de;try{var n=Ut;for(de=1;e<n.length;e++){var r=n[e];do r=r(!0);while(r!==null)}Ut=null,Tl=!1}catch(l){throw Ut!==null&&(Ut=Ut.slice(e+1)),ii(go,pn),l}finally{de=t,Qo=!1}}return null}var Xn=[],Zn=0,jl=null,Pl=0,ft=[],gt=0,Pn=null,Bt=1,Ht="";function zn(e,t){Xn[Zn++]=Pl,Xn[Zn++]=jl,jl=e,Pl=t}function as(e,t,n){ft[gt++]=Bt,ft[gt++]=Ht,ft[gt++]=Pn,Pn=e;var r=Bt;e=Ht;var l=32-St(r)-1;r&=~(1<<l),n+=1;var o=32-St(t)+l;if(30<o){var a=l-l%5;o=(r&(1<<a)-1).toString(32),r>>=a,l-=a,Bt=1<<32-St(t)+l|n<<l|r,Ht=o+e}else Bt=1<<o|n<<l|r,Ht=e}function Ko(e){e.return!==null&&(zn(e,1),as(e,1,0))}function Yo(e){for(;e===jl;)jl=Xn[--Zn],Xn[Zn]=null,Pl=Xn[--Zn],Xn[Zn]=null;for(;e===Pn;)Pn=ft[--gt],ft[gt]=null,Ht=ft[--gt],ft[gt]=null,Bt=ft[--gt],ft[gt]=null}var it=null,st=null,ke=!1,Et=null;function is(e,t){var n=vt(5,null,null,0);n.elementType="DELETED",n.stateNode=t,n.return=e,t=e.deletions,t===null?(e.deletions=[n],e.flags|=16):t.push(n)}function ss(e,t){switch(e.tag){case 5:var n=e.type;return t=t.nodeType!==1||n.toLowerCase()!==t.nodeName.toLowerCase()?null:t,t!==null?(e.stateNode=t,it=e,st=un(t.firstChild),!0):!1;case 6:return t=e.pendingProps===""||t.nodeType!==3?null:t,t!==null?(e.stateNode=t,it=e,st=null,!0):!1;case 13:return t=t.nodeType!==8?null:t,t!==null?(n=Pn!==null?{id:Bt,overflow:Ht}:null,e.memoizedState={dehydrated:t,treeContext:n,retryLane:1073741824},n=vt(18,null,null,0),n.stateNode=t,n.return=e,e.child=n,it=e,st=null,!0):!1;default:return!1}}function Jo(e){return(e.mode&1)!==0&&(e.flags&128)===0}function Go(e){if(ke){var t=st;if(t){var n=t;if(!ss(e,t)){if(Jo(e))throw Error(i(418));t=un(n.nextSibling);var r=it;t&&ss(e,t)?is(r,n):(e.flags=e.flags&-4097|2,ke=!1,it=e)}}else{if(Jo(e))throw Error(i(418));e.flags=e.flags&-4097|2,ke=!1,it=e}}}function us(e){for(e=e.return;e!==null&&e.tag!==5&&e.tag!==3&&e.tag!==13;)e=e.return;it=e}function zl(e){if(e!==it)return!1;if(!ke)return us(e),ke=!0,!1;var t;if((t=e.tag!==3)&&!(t=e.tag!==5)&&(t=e.type,t=t!=="head"&&t!=="body"&&!Uo(e.type,e.memoizedProps)),t&&(t=st)){if(Jo(e))throw cs(),Error(i(418));for(;t;)is(e,t),t=un(t.nextSibling)}if(us(e),e.tag===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(i(317));e:{for(e=e.nextSibling,t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="/$"){if(t===0){st=un(e.nextSibling);break e}t--}else n!=="$"&&n!=="$!"&&n!=="$?"||t++}e=e.nextSibling}st=null}}else st=it?un(e.stateNode.nextSibling):null;return!0}function cs(){for(var e=st;e;)e=un(e.nextSibling)}function er(){st=it=null,ke=!1}function qo(e){Et===null?Et=[e]:Et.push(e)}var _d=we.ReactCurrentBatchConfig;function Ir(e,t,n){if(e=n.ref,e!==null&&typeof e!="function"&&typeof e!="object"){if(n._owner){if(n=n._owner,n){if(n.tag!==1)throw Error(i(309));var r=n.stateNode}if(!r)throw Error(i(147,e));var l=r,o=""+e;return t!==null&&t.ref!==null&&typeof t.ref=="function"&&t.ref._stringRef===o?t.ref:(t=function(a){var c=l.refs;a===null?delete c[o]:c[o]=a},t._stringRef=o,t)}if(typeof e!="string")throw Error(i(284));if(!n._owner)throw Error(i(290,e))}return e}function Ll(e,t){throw e=Object.prototype.toString.call(t),Error(i(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e))}function ds(e){var t=e._init;return t(e._payload)}function ps(e){function t(x,f){if(e){var v=x.deletions;v===null?(x.deletions=[f],x.flags|=16):v.push(f)}}function n(x,f){if(!e)return null;for(;f!==null;)t(x,f),f=f.sibling;return null}function r(x,f){for(x=new Map;f!==null;)f.key!==null?x.set(f.key,f):x.set(f.index,f),f=f.sibling;return x}function l(x,f){return x=_n(x,f),x.index=0,x.sibling=null,x}function o(x,f,v){return x.index=v,e?(v=x.alternate,v!==null?(v=v.index,v<f?(x.flags|=2,f):v):(x.flags|=2,f)):(x.flags|=1048576,f)}function a(x){return e&&x.alternate===null&&(x.flags|=2),x}function c(x,f,v,P){return f===null||f.tag!==6?(f=Ba(v,x.mode,P),f.return=x,f):(f=l(f,v),f.return=x,f)}function d(x,f,v,P){var H=v.type;return H===Pe?N(x,f,v.props.children,P,v.key):f!==null&&(f.elementType===H||typeof H=="object"&&H!==null&&H.$$typeof===Ae&&ds(H)===f.type)?(P=l(f,v.props),P.ref=Ir(x,f,v),P.return=x,P):(P=no(v.type,v.key,v.props,null,x.mode,P),P.ref=Ir(x,f,v),P.return=x,P)}function _(x,f,v,P){return f===null||f.tag!==4||f.stateNode.containerInfo!==v.containerInfo||f.stateNode.implementation!==v.implementation?(f=Ha(v,x.mode,P),f.return=x,f):(f=l(f,v.children||[]),f.return=x,f)}function N(x,f,v,P,H){return f===null||f.tag!==7?(f=Fn(v,x.mode,P,H),f.return=x,f):(f=l(f,v),f.return=x,f)}function j(x,f,v){if(typeof f=="string"&&f!==""||typeof f=="number")return f=Ba(""+f,x.mode,v),f.return=x,f;if(typeof f=="object"&&f!==null){switch(f.$$typeof){case K:return v=no(f.type,f.key,f.props,null,x.mode,v),v.ref=Ir(x,null,f),v.return=x,v;case ue:return f=Ha(f,x.mode,v),f.return=x,f;case Ae:var P=f._init;return j(x,P(f._payload),v)}if($t(f)||Q(f))return f=Fn(f,x.mode,v,null),f.return=x,f;Ll(x,f)}return null}function E(x,f,v,P){var H=f!==null?f.key:null;if(typeof v=="string"&&v!==""||typeof v=="number")return H!==null?null:c(x,f,""+v,P);if(typeof v=="object"&&v!==null){switch(v.$$typeof){case K:return v.key===H?d(x,f,v,P):null;case ue:return v.key===H?_(x,f,v,P):null;case Ae:return H=v._init,E(x,f,H(v._payload),P)}if($t(v)||Q(v))return H!==null?null:N(x,f,v,P,null);Ll(x,v)}return null}function O(x,f,v,P,H){if(typeof P=="string"&&P!==""||typeof P=="number")return x=x.get(v)||null,c(f,x,""+P,H);if(typeof P=="object"&&P!==null){switch(P.$$typeof){case K:return x=x.get(P.key===null?v:P.key)||null,d(f,x,P,H);case ue:return x=x.get(P.key===null?v:P.key)||null,_(f,x,P,H);case Ae:var V=P._init;return O(x,f,v,V(P._payload),H)}if($t(P)||Q(P))return x=x.get(v)||null,N(f,x,P,H,null);Ll(f,P)}return null}function U(x,f,v,P){for(var H=null,V=null,W=f,Y=f=0,Fe=null;W!==null&&Y<v.length;Y++){W.index>Y?(Fe=W,W=null):Fe=W.sibling;var se=E(x,W,v[Y],P);if(se===null){W===null&&(W=Fe);break}e&&W&&se.alternate===null&&t(x,W),f=o(se,f,Y),V===null?H=se:V.sibling=se,V=se,W=Fe}if(Y===v.length)return n(x,W),ke&&zn(x,Y),H;if(W===null){for(;Y<v.length;Y++)W=j(x,v[Y],P),W!==null&&(f=o(W,f,Y),V===null?H=W:V.sibling=W,V=W);return ke&&zn(x,Y),H}for(W=r(x,W);Y<v.length;Y++)Fe=O(W,x,Y,v[Y],P),Fe!==null&&(e&&Fe.alternate!==null&&W.delete(Fe.key===null?Y:Fe.key),f=o(Fe,f,Y),V===null?H=Fe:V.sibling=Fe,V=Fe);return e&&W.forEach(function(wn){return t(x,wn)}),ke&&zn(x,Y),H}function B(x,f,v,P){var H=Q(v);if(typeof H!="function")throw Error(i(150));if(v=H.call(v),v==null)throw Error(i(151));for(var V=H=null,W=f,Y=f=0,Fe=null,se=v.next();W!==null&&!se.done;Y++,se=v.next()){W.index>Y?(Fe=W,W=null):Fe=W.sibling;var wn=E(x,W,se.value,P);if(wn===null){W===null&&(W=Fe);break}e&&W&&wn.alternate===null&&t(x,W),f=o(wn,f,Y),V===null?H=wn:V.sibling=wn,V=wn,W=Fe}if(se.done)return n(x,W),ke&&zn(x,Y),H;if(W===null){for(;!se.done;Y++,se=v.next())se=j(x,se.value,P),se!==null&&(f=o(se,f,Y),V===null?H=se:V.sibling=se,V=se);return ke&&zn(x,Y),H}for(W=r(x,W);!se.done;Y++,se=v.next())se=O(W,x,Y,se.value,P),se!==null&&(e&&se.alternate!==null&&W.delete(se.key===null?Y:se.key),f=o(se,f,Y),V===null?H=se:V.sibling=se,V=se);return e&&W.forEach(function(Zd){return t(x,Zd)}),ke&&zn(x,Y),H}function Te(x,f,v,P){if(typeof v=="object"&&v!==null&&v.type===Pe&&v.key===null&&(v=v.props.children),typeof v=="object"&&v!==null){switch(v.$$typeof){case K:e:{for(var H=v.key,V=f;V!==null;){if(V.key===H){if(H=v.type,H===Pe){if(V.tag===7){n(x,V.sibling),f=l(V,v.props.children),f.return=x,x=f;break e}}else if(V.elementType===H||typeof H=="object"&&H!==null&&H.$$typeof===Ae&&ds(H)===V.type){n(x,V.sibling),f=l(V,v.props),f.ref=Ir(x,V,v),f.return=x,x=f;break e}n(x,V);break}else t(x,V);V=V.sibling}v.type===Pe?(f=Fn(v.props.children,x.mode,P,v.key),f.return=x,x=f):(P=no(v.type,v.key,v.props,null,x.mode,P),P.ref=Ir(x,f,v),P.return=x,x=P)}return a(x);case ue:e:{for(V=v.key;f!==null;){if(f.key===V)if(f.tag===4&&f.stateNode.containerInfo===v.containerInfo&&f.stateNode.implementation===v.implementation){n(x,f.sibling),f=l(f,v.children||[]),f.return=x,x=f;break e}else{n(x,f);break}else t(x,f);f=f.sibling}f=Ha(v,x.mode,P),f.return=x,x=f}return a(x);case Ae:return V=v._init,Te(x,f,V(v._payload),P)}if($t(v))return U(x,f,v,P);if(Q(v))return B(x,f,v,P);Ll(x,v)}return typeof v=="string"&&v!==""||typeof v=="number"?(v=""+v,f!==null&&f.tag===6?(n(x,f.sibling),f=l(f,v),f.return=x,x=f):(n(x,f),f=Ba(v,x.mode,P),f.return=x,x=f),a(x)):n(x,f)}return Te}var tr=ps(!0),fs=ps(!1),Ml=cn(null),Rl=null,nr=null,Xo=null;function Zo(){Xo=nr=Rl=null}function ea(e){var t=Ml.current;_e(Ml),e._currentValue=t}function ta(e,t,n){for(;e!==null;){var r=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,r!==null&&(r.childLanes|=t)):r!==null&&(r.childLanes&t)!==t&&(r.childLanes|=t),e===n)break;e=e.return}}function rr(e,t){Rl=e,Xo=nr=null,e=e.dependencies,e!==null&&e.firstContext!==null&&((e.lanes&t)!==0&&(Ze=!0),e.firstContext=null)}function mt(e){var t=e._currentValue;if(Xo!==e)if(e={context:e,memoizedValue:t,next:null},nr===null){if(Rl===null)throw Error(i(308));nr=e,Rl.dependencies={lanes:0,firstContext:e}}else nr=nr.next=e;return t}var Ln=null;function na(e){Ln===null?Ln=[e]:Ln.push(e)}function gs(e,t,n,r){var l=t.interleaved;return l===null?(n.next=n,na(t)):(n.next=l.next,l.next=n),t.interleaved=n,Vt(e,r)}function Vt(e,t){e.lanes|=t;var n=e.alternate;for(n!==null&&(n.lanes|=t),n=e,e=e.return;e!==null;)e.childLanes|=t,n=e.alternate,n!==null&&(n.childLanes|=t),n=e,e=e.return;return n.tag===3?n.stateNode:null}var fn=!1;function ra(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function ms(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,effects:e.effects})}function Wt(e,t){return{eventTime:e,lane:t,tag:0,payload:null,callback:null,next:null}}function gn(e,t,n){var r=e.updateQueue;if(r===null)return null;if(r=r.shared,(ae&2)!==0){var l=r.pending;return l===null?t.next=t:(t.next=l.next,l.next=t),r.pending=t,Vt(e,n)}return l=r.interleaved,l===null?(t.next=t,na(r)):(t.next=l.next,l.next=t),r.interleaved=t,Vt(e,n)}function Dl(e,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,(n&4194240)!==0)){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,xo(e,n)}}function hs(e,t){var n=e.updateQueue,r=e.alternate;if(r!==null&&(r=r.updateQueue,n===r)){var l=null,o=null;if(n=n.firstBaseUpdate,n!==null){do{var a={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};o===null?l=o=a:o=o.next=a,n=n.next}while(n!==null);o===null?l=o=t:o=o.next=t}else l=o=t;n={baseState:r.baseState,firstBaseUpdate:l,lastBaseUpdate:o,shared:r.shared,effects:r.effects},e.updateQueue=n;return}e=n.lastBaseUpdate,e===null?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}function Ol(e,t,n,r){var l=e.updateQueue;fn=!1;var o=l.firstBaseUpdate,a=l.lastBaseUpdate,c=l.shared.pending;if(c!==null){l.shared.pending=null;var d=c,_=d.next;d.next=null,a===null?o=_:a.next=_,a=d;var N=e.alternate;N!==null&&(N=N.updateQueue,c=N.lastBaseUpdate,c!==a&&(c===null?N.firstBaseUpdate=_:c.next=_,N.lastBaseUpdate=d))}if(o!==null){var j=l.baseState;a=0,N=_=d=null,c=o;do{var E=c.lane,O=c.eventTime;if((r&E)===E){N!==null&&(N=N.next={eventTime:O,lane:0,tag:c.tag,payload:c.payload,callback:c.callback,next:null});e:{var U=e,B=c;switch(E=t,O=n,B.tag){case 1:if(U=B.payload,typeof U=="function"){j=U.call(O,j,E);break e}j=U;break e;case 3:U.flags=U.flags&-65537|128;case 0:if(U=B.payload,E=typeof U=="function"?U.call(O,j,E):U,E==null)break e;j=I({},j,E);break e;case 2:fn=!0}}c.callback!==null&&c.lane!==0&&(e.flags|=64,E=l.effects,E===null?l.effects=[c]:E.push(c))}else O={eventTime:O,lane:E,tag:c.tag,payload:c.payload,callback:c.callback,next:null},N===null?(_=N=O,d=j):N=N.next=O,a|=E;if(c=c.next,c===null){if(c=l.shared.pending,c===null)break;E=c,c=E.next,E.next=null,l.lastBaseUpdate=E,l.shared.pending=null}}while(!0);if(N===null&&(d=j),l.baseState=d,l.firstBaseUpdate=_,l.lastBaseUpdate=N,t=l.shared.interleaved,t!==null){l=t;do a|=l.lane,l=l.next;while(l!==t)}else o===null&&(l.shared.lanes=0);Dn|=a,e.lanes=a,e.memoizedState=j}}function xs(e,t,n){if(e=t.effects,t.effects=null,e!==null)for(t=0;t<e.length;t++){var r=e[t],l=r.callback;if(l!==null){if(r.callback=null,r=n,typeof l!="function")throw Error(i(191,l));l.call(r)}}}var $r={},Dt=cn($r),Fr=cn($r),Ar=cn($r);function Mn(e){if(e===$r)throw Error(i(174));return e}function la(e,t){switch(xe(Ar,t),xe(Fr,e),xe(Dt,$r),e=t.nodeType,e){case 9:case 11:t=(t=t.documentElement)?t.namespaceURI:pt(null,"");break;default:e=e===8?t.parentNode:t,t=e.namespaceURI||null,e=e.tagName,t=pt(t,e)}_e(Dt),xe(Dt,t)}function lr(){_e(Dt),_e(Fr),_e(Ar)}function vs(e){Mn(Ar.current);var t=Mn(Dt.current),n=pt(t,e.type);t!==n&&(xe(Fr,e),xe(Dt,n))}function oa(e){Fr.current===e&&(_e(Dt),_e(Fr))}var Se=cn(0);function Il(e){for(var t=e;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||n.data==="$?"||n.data==="$!"))return t}else if(t.tag===19&&t.memoizedProps.revealOrder!==void 0){if((t.flags&128)!==0)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var aa=[];function ia(){for(var e=0;e<aa.length;e++)aa[e]._workInProgressVersionPrimary=null;aa.length=0}var $l=we.ReactCurrentDispatcher,sa=we.ReactCurrentBatchConfig,Rn=0,be=null,Re=null,Ie=null,Fl=!1,Ur=!1,Br=0,wd=0;function We(){throw Error(i(321))}function ua(e,t){if(t===null)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!bt(e[n],t[n]))return!1;return!0}function ca(e,t,n,r,l,o){if(Rn=o,be=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,$l.current=e===null||e.memoizedState===null?Ed:Cd,e=n(r,l),Ur){o=0;do{if(Ur=!1,Br=0,25<=o)throw Error(i(301));o+=1,Ie=Re=null,t.updateQueue=null,$l.current=Nd,e=n(r,l)}while(Ur)}if($l.current=Bl,t=Re!==null&&Re.next!==null,Rn=0,Ie=Re=be=null,Fl=!1,t)throw Error(i(300));return e}function da(){var e=Br!==0;return Br=0,e}function Ot(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Ie===null?be.memoizedState=Ie=e:Ie=Ie.next=e,Ie}function ht(){if(Re===null){var e=be.alternate;e=e!==null?e.memoizedState:null}else e=Re.next;var t=Ie===null?be.memoizedState:Ie.next;if(t!==null)Ie=t,Re=e;else{if(e===null)throw Error(i(310));Re=e,e={memoizedState:Re.memoizedState,baseState:Re.baseState,baseQueue:Re.baseQueue,queue:Re.queue,next:null},Ie===null?be.memoizedState=Ie=e:Ie=Ie.next=e}return Ie}function Hr(e,t){return typeof t=="function"?t(e):t}function pa(e){var t=ht(),n=t.queue;if(n===null)throw Error(i(311));n.lastRenderedReducer=e;var r=Re,l=r.baseQueue,o=n.pending;if(o!==null){if(l!==null){var a=l.next;l.next=o.next,o.next=a}r.baseQueue=l=o,n.pending=null}if(l!==null){o=l.next,r=r.baseState;var c=a=null,d=null,_=o;do{var N=_.lane;if((Rn&N)===N)d!==null&&(d=d.next={lane:0,action:_.action,hasEagerState:_.hasEagerState,eagerState:_.eagerState,next:null}),r=_.hasEagerState?_.eagerState:e(r,_.action);else{var j={lane:N,action:_.action,hasEagerState:_.hasEagerState,eagerState:_.eagerState,next:null};d===null?(c=d=j,a=r):d=d.next=j,be.lanes|=N,Dn|=N}_=_.next}while(_!==null&&_!==o);d===null?a=r:d.next=c,bt(r,t.memoizedState)||(Ze=!0),t.memoizedState=r,t.baseState=a,t.baseQueue=d,n.lastRenderedState=r}if(e=n.interleaved,e!==null){l=e;do o=l.lane,be.lanes|=o,Dn|=o,l=l.next;while(l!==e)}else l===null&&(n.lanes=0);return[t.memoizedState,n.dispatch]}function fa(e){var t=ht(),n=t.queue;if(n===null)throw Error(i(311));n.lastRenderedReducer=e;var r=n.dispatch,l=n.pending,o=t.memoizedState;if(l!==null){n.pending=null;var a=l=l.next;do o=e(o,a.action),a=a.next;while(a!==l);bt(o,t.memoizedState)||(Ze=!0),t.memoizedState=o,t.baseQueue===null&&(t.baseState=o),n.lastRenderedState=o}return[o,r]}function ys(){}function _s(e,t){var n=be,r=ht(),l=t(),o=!bt(r.memoizedState,l);if(o&&(r.memoizedState=l,Ze=!0),r=r.queue,ga(Ss.bind(null,n,r,e),[e]),r.getSnapshot!==t||o||Ie!==null&&Ie.memoizedState.tag&1){if(n.flags|=2048,Vr(9,ks.bind(null,n,r,l,t),void 0,null),$e===null)throw Error(i(349));(Rn&30)!==0||ws(n,t,l)}return l}function ws(e,t,n){e.flags|=16384,e={getSnapshot:t,value:n},t=be.updateQueue,t===null?(t={lastEffect:null,stores:null},be.updateQueue=t,t.stores=[e]):(n=t.stores,n===null?t.stores=[e]:n.push(e))}function ks(e,t,n,r){t.value=n,t.getSnapshot=r,bs(t)&&Es(e)}function Ss(e,t,n){return n(function(){bs(t)&&Es(e)})}function bs(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!bt(e,n)}catch{return!0}}function Es(e){var t=Vt(e,1);t!==null&&jt(t,e,1,-1)}function Cs(e){var t=Ot();return typeof e=="function"&&(e=e()),t.memoizedState=t.baseState=e,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Hr,lastRenderedState:e},t.queue=e,e=e.dispatch=bd.bind(null,be,e),[t.memoizedState,e]}function Vr(e,t,n,r){return e={tag:e,create:t,destroy:n,deps:r,next:null},t=be.updateQueue,t===null?(t={lastEffect:null,stores:null},be.updateQueue=t,t.lastEffect=e.next=e):(n=t.lastEffect,n===null?t.lastEffect=e.next=e:(r=n.next,n.next=e,e.next=r,t.lastEffect=e)),e}function Ns(){return ht().memoizedState}function Al(e,t,n,r){var l=Ot();be.flags|=e,l.memoizedState=Vr(1|t,n,void 0,r===void 0?null:r)}function Ul(e,t,n,r){var l=ht();r=r===void 0?null:r;var o=void 0;if(Re!==null){var a=Re.memoizedState;if(o=a.destroy,r!==null&&ua(r,a.deps)){l.memoizedState=Vr(t,n,o,r);return}}be.flags|=e,l.memoizedState=Vr(1|t,n,o,r)}function Ts(e,t){return Al(8390656,8,e,t)}function ga(e,t){return Ul(2048,8,e,t)}function js(e,t){return Ul(4,2,e,t)}function Ps(e,t){return Ul(4,4,e,t)}function zs(e,t){if(typeof t=="function")return e=e(),t(e),function(){t(null)};if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function Ls(e,t,n){return n=n!=null?n.concat([e]):null,Ul(4,4,zs.bind(null,t,e),n)}function ma(){}function Ms(e,t){var n=ht();t=t===void 0?null:t;var r=n.memoizedState;return r!==null&&t!==null&&ua(t,r[1])?r[0]:(n.memoizedState=[e,t],e)}function Rs(e,t){var n=ht();t=t===void 0?null:t;var r=n.memoizedState;return r!==null&&t!==null&&ua(t,r[1])?r[0]:(e=e(),n.memoizedState=[e,t],e)}function Ds(e,t,n){return(Rn&21)===0?(e.baseState&&(e.baseState=!1,Ze=!0),e.memoizedState=n):(bt(n,t)||(n=di(),be.lanes|=n,Dn|=n,e.baseState=!0),t)}function kd(e,t){var n=de;de=n!==0&&4>n?n:4,e(!0);var r=sa.transition;sa.transition={};try{e(!1),t()}finally{de=n,sa.transition=r}}function Os(){return ht().memoizedState}function Sd(e,t,n){var r=vn(e);if(n={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null},Is(e))$s(t,n);else if(n=gs(e,t,n,r),n!==null){var l=Ge();jt(n,e,r,l),Fs(n,t,r)}}function bd(e,t,n){var r=vn(e),l={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null};if(Is(e))$s(t,l);else{var o=e.alternate;if(e.lanes===0&&(o===null||o.lanes===0)&&(o=t.lastRenderedReducer,o!==null))try{var a=t.lastRenderedState,c=o(a,n);if(l.hasEagerState=!0,l.eagerState=c,bt(c,a)){var d=t.interleaved;d===null?(l.next=l,na(t)):(l.next=d.next,d.next=l),t.interleaved=l;return}}catch{}finally{}n=gs(e,t,l,r),n!==null&&(l=Ge(),jt(n,e,r,l),Fs(n,t,r))}}function Is(e){var t=e.alternate;return e===be||t!==null&&t===be}function $s(e,t){Ur=Fl=!0;var n=e.pending;n===null?t.next=t:(t.next=n.next,n.next=t),e.pending=t}function Fs(e,t,n){if((n&4194240)!==0){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,xo(e,n)}}var Bl={readContext:mt,useCallback:We,useContext:We,useEffect:We,useImperativeHandle:We,useInsertionEffect:We,useLayoutEffect:We,useMemo:We,useReducer:We,useRef:We,useState:We,useDebugValue:We,useDeferredValue:We,useTransition:We,useMutableSource:We,useSyncExternalStore:We,useId:We,unstable_isNewReconciler:!1},Ed={readContext:mt,useCallback:function(e,t){return Ot().memoizedState=[e,t===void 0?null:t],e},useContext:mt,useEffect:Ts,useImperativeHandle:function(e,t,n){return n=n!=null?n.concat([e]):null,Al(4194308,4,zs.bind(null,t,e),n)},useLayoutEffect:function(e,t){return Al(4194308,4,e,t)},useInsertionEffect:function(e,t){return Al(4,2,e,t)},useMemo:function(e,t){var n=Ot();return t=t===void 0?null:t,e=e(),n.memoizedState=[e,t],e},useReducer:function(e,t,n){var r=Ot();return t=n!==void 0?n(t):t,r.memoizedState=r.baseState=t,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:t},r.queue=e,e=e.dispatch=Sd.bind(null,be,e),[r.memoizedState,e]},useRef:function(e){var t=Ot();return e={current:e},t.memoizedState=e},useState:Cs,useDebugValue:ma,useDeferredValue:function(e){return Ot().memoizedState=e},useTransition:function(){var e=Cs(!1),t=e[0];return e=kd.bind(null,e[1]),Ot().memoizedState=e,[t,e]},useMutableSource:function(){},useSyncExternalStore:function(e,t,n){var r=be,l=Ot();if(ke){if(n===void 0)throw Error(i(407));n=n()}else{if(n=t(),$e===null)throw Error(i(349));(Rn&30)!==0||ws(r,t,n)}l.memoizedState=n;var o={value:n,getSnapshot:t};return l.queue=o,Ts(Ss.bind(null,r,o,e),[e]),r.flags|=2048,Vr(9,ks.bind(null,r,o,n,t),void 0,null),n},useId:function(){var e=Ot(),t=$e.identifierPrefix;if(ke){var n=Ht,r=Bt;n=(r&~(1<<32-St(r)-1)).toString(32)+n,t=":"+t+"R"+n,n=Br++,0<n&&(t+="H"+n.toString(32)),t+=":"}else n=wd++,t=":"+t+"r"+n.toString(32)+":";return e.memoizedState=t},unstable_isNewReconciler:!1},Cd={readContext:mt,useCallback:Ms,useContext:mt,useEffect:ga,useImperativeHandle:Ls,useInsertionEffect:js,useLayoutEffect:Ps,useMemo:Rs,useReducer:pa,useRef:Ns,useState:function(){return pa(Hr)},useDebugValue:ma,useDeferredValue:function(e){var t=ht();return Ds(t,Re.memoizedState,e)},useTransition:function(){var e=pa(Hr)[0],t=ht().memoizedState;return[e,t]},useMutableSource:ys,useSyncExternalStore:_s,useId:Os,unstable_isNewReconciler:!1},Nd={readContext:mt,useCallback:Ms,useContext:mt,useEffect:ga,useImperativeHandle:Ls,useInsertionEffect:js,useLayoutEffect:Ps,useMemo:Rs,useReducer:fa,useRef:Ns,useState:function(){return fa(Hr)},useDebugValue:ma,useDeferredValue:function(e){var t=ht();return Re===null?t.memoizedState=e:Ds(t,Re.memoizedState,e)},useTransition:function(){var e=fa(Hr)[0],t=ht().memoizedState;return[e,t]},useMutableSource:ys,useSyncExternalStore:_s,useId:Os,unstable_isNewReconciler:!1};function Ct(e,t){if(e&&e.defaultProps){t=I({},t),e=e.defaultProps;for(var n in e)t[n]===void 0&&(t[n]=e[n]);return t}return t}function ha(e,t,n,r){t=e.memoizedState,n=n(r,t),n=n==null?t:I({},t,n),e.memoizedState=n,e.lanes===0&&(e.updateQueue.baseState=n)}var Hl={isMounted:function(e){return(e=e._reactInternals)?Nn(e)===e:!1},enqueueSetState:function(e,t,n){e=e._reactInternals;var r=Ge(),l=vn(e),o=Wt(r,l);o.payload=t,n!=null&&(o.callback=n),t=gn(e,o,l),t!==null&&(jt(t,e,l,r),Dl(t,e,l))},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var r=Ge(),l=vn(e),o=Wt(r,l);o.tag=1,o.payload=t,n!=null&&(o.callback=n),t=gn(e,o,l),t!==null&&(jt(t,e,l,r),Dl(t,e,l))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=Ge(),r=vn(e),l=Wt(n,r);l.tag=2,t!=null&&(l.callback=t),t=gn(e,l,r),t!==null&&(jt(t,e,r,n),Dl(t,e,r))}};function As(e,t,n,r,l,o,a){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(r,o,a):t.prototype&&t.prototype.isPureReactComponent?!Pr(n,r)||!Pr(l,o):!0}function Us(e,t,n){var r=!1,l=dn,o=t.contextType;return typeof o=="object"&&o!==null?o=mt(o):(l=Xe(t)?jn:Ve.current,r=t.contextTypes,o=(r=r!=null)?qn(e,l):dn),t=new t(n,o),e.memoizedState=t.state!==null&&t.state!==void 0?t.state:null,t.updater=Hl,e.stateNode=t,t._reactInternals=e,r&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=l,e.__reactInternalMemoizedMaskedChildContext=o),t}function Bs(e,t,n,r){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(n,r),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(n,r),t.state!==e&&Hl.enqueueReplaceState(t,t.state,null)}function xa(e,t,n,r){var l=e.stateNode;l.props=n,l.state=e.memoizedState,l.refs={},ra(e);var o=t.contextType;typeof o=="object"&&o!==null?l.context=mt(o):(o=Xe(t)?jn:Ve.current,l.context=qn(e,o)),l.state=e.memoizedState,o=t.getDerivedStateFromProps,typeof o=="function"&&(ha(e,t,o,n),l.state=e.memoizedState),typeof t.getDerivedStateFromProps=="function"||typeof l.getSnapshotBeforeUpdate=="function"||typeof l.UNSAFE_componentWillMount!="function"&&typeof l.componentWillMount!="function"||(t=l.state,typeof l.componentWillMount=="function"&&l.componentWillMount(),typeof l.UNSAFE_componentWillMount=="function"&&l.UNSAFE_componentWillMount(),t!==l.state&&Hl.enqueueReplaceState(l,l.state,null),Ol(e,n,l,r),l.state=e.memoizedState),typeof l.componentDidMount=="function"&&(e.flags|=4194308)}function or(e,t){try{var n="",r=t;do n+=le(r),r=r.return;while(r);var l=n}catch(o){l=`
Error generating stack: `+o.message+`
`+o.stack}return{value:e,source:t,stack:l,digest:null}}function va(e,t,n){return{value:e,source:null,stack:n??null,digest:t??null}}function ya(e,t){try{console.error(t.value)}catch(n){setTimeout(function(){throw n})}}var Td=typeof WeakMap=="function"?WeakMap:Map;function Hs(e,t,n){n=Wt(-1,n),n.tag=3,n.payload={element:null};var r=t.value;return n.callback=function(){Gl||(Gl=!0,Ra=r),ya(e,t)},n}function Vs(e,t,n){n=Wt(-1,n),n.tag=3;var r=e.type.getDerivedStateFromError;if(typeof r=="function"){var l=t.value;n.payload=function(){return r(l)},n.callback=function(){ya(e,t)}}var o=e.stateNode;return o!==null&&typeof o.componentDidCatch=="function"&&(n.callback=function(){ya(e,t),typeof r!="function"&&(hn===null?hn=new Set([this]):hn.add(this));var a=t.stack;this.componentDidCatch(t.value,{componentStack:a!==null?a:""})}),n}function Ws(e,t,n){var r=e.pingCache;if(r===null){r=e.pingCache=new Td;var l=new Set;r.set(t,l)}else l=r.get(t),l===void 0&&(l=new Set,r.set(t,l));l.has(n)||(l.add(n),e=Bd.bind(null,e,t,n),t.then(e,e))}function Qs(e){do{var t;if((t=e.tag===13)&&(t=e.memoizedState,t=t!==null?t.dehydrated!==null:!0),t)return e;e=e.return}while(e!==null);return null}function Ks(e,t,n,r,l){return(e.mode&1)===0?(e===t?e.flags|=65536:(e.flags|=128,n.flags|=131072,n.flags&=-52805,n.tag===1&&(n.alternate===null?n.tag=17:(t=Wt(-1,1),t.tag=2,gn(n,t,1))),n.lanes|=1),e):(e.flags|=65536,e.lanes=l,e)}var jd=we.ReactCurrentOwner,Ze=!1;function Je(e,t,n,r){t.child=e===null?fs(t,null,n,r):tr(t,e.child,n,r)}function Ys(e,t,n,r,l){n=n.render;var o=t.ref;return rr(t,l),r=ca(e,t,n,r,o,l),n=da(),e!==null&&!Ze?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~l,Qt(e,t,l)):(ke&&n&&Ko(t),t.flags|=1,Je(e,t,r,l),t.child)}function Js(e,t,n,r,l){if(e===null){var o=n.type;return typeof o=="function"&&!Ua(o)&&o.defaultProps===void 0&&n.compare===null&&n.defaultProps===void 0?(t.tag=15,t.type=o,Gs(e,t,o,r,l)):(e=no(n.type,null,r,t,t.mode,l),e.ref=t.ref,e.return=t,t.child=e)}if(o=e.child,(e.lanes&l)===0){var a=o.memoizedProps;if(n=n.compare,n=n!==null?n:Pr,n(a,r)&&e.ref===t.ref)return Qt(e,t,l)}return t.flags|=1,e=_n(o,r),e.ref=t.ref,e.return=t,t.child=e}function Gs(e,t,n,r,l){if(e!==null){var o=e.memoizedProps;if(Pr(o,r)&&e.ref===t.ref)if(Ze=!1,t.pendingProps=r=o,(e.lanes&l)!==0)(e.flags&131072)!==0&&(Ze=!0);else return t.lanes=e.lanes,Qt(e,t,l)}return _a(e,t,n,r,l)}function qs(e,t,n){var r=t.pendingProps,l=r.children,o=e!==null?e.memoizedState:null;if(r.mode==="hidden")if((t.mode&1)===0)t.memoizedState={baseLanes:0,cachePool:null,transitions:null},xe(ir,ut),ut|=n;else{if((n&1073741824)===0)return e=o!==null?o.baseLanes|n:n,t.lanes=t.childLanes=1073741824,t.memoizedState={baseLanes:e,cachePool:null,transitions:null},t.updateQueue=null,xe(ir,ut),ut|=e,null;t.memoizedState={baseLanes:0,cachePool:null,transitions:null},r=o!==null?o.baseLanes:n,xe(ir,ut),ut|=r}else o!==null?(r=o.baseLanes|n,t.memoizedState=null):r=n,xe(ir,ut),ut|=r;return Je(e,t,l,n),t.child}function Xs(e,t){var n=t.ref;(e===null&&n!==null||e!==null&&e.ref!==n)&&(t.flags|=512,t.flags|=2097152)}function _a(e,t,n,r,l){var o=Xe(n)?jn:Ve.current;return o=qn(t,o),rr(t,l),n=ca(e,t,n,r,o,l),r=da(),e!==null&&!Ze?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~l,Qt(e,t,l)):(ke&&r&&Ko(t),t.flags|=1,Je(e,t,n,l),t.child)}function Zs(e,t,n,r,l){if(Xe(n)){var o=!0;Nl(t)}else o=!1;if(rr(t,l),t.stateNode===null)Wl(e,t),Us(t,n,r),xa(t,n,r,l),r=!0;else if(e===null){var a=t.stateNode,c=t.memoizedProps;a.props=c;var d=a.context,_=n.contextType;typeof _=="object"&&_!==null?_=mt(_):(_=Xe(n)?jn:Ve.current,_=qn(t,_));var N=n.getDerivedStateFromProps,j=typeof N=="function"||typeof a.getSnapshotBeforeUpdate=="function";j||typeof a.UNSAFE_componentWillReceiveProps!="function"&&typeof a.componentWillReceiveProps!="function"||(c!==r||d!==_)&&Bs(t,a,r,_),fn=!1;var E=t.memoizedState;a.state=E,Ol(t,r,a,l),d=t.memoizedState,c!==r||E!==d||qe.current||fn?(typeof N=="function"&&(ha(t,n,N,r),d=t.memoizedState),(c=fn||As(t,n,c,r,E,d,_))?(j||typeof a.UNSAFE_componentWillMount!="function"&&typeof a.componentWillMount!="function"||(typeof a.componentWillMount=="function"&&a.componentWillMount(),typeof a.UNSAFE_componentWillMount=="function"&&a.UNSAFE_componentWillMount()),typeof a.componentDidMount=="function"&&(t.flags|=4194308)):(typeof a.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=r,t.memoizedState=d),a.props=r,a.state=d,a.context=_,r=c):(typeof a.componentDidMount=="function"&&(t.flags|=4194308),r=!1)}else{a=t.stateNode,ms(e,t),c=t.memoizedProps,_=t.type===t.elementType?c:Ct(t.type,c),a.props=_,j=t.pendingProps,E=a.context,d=n.contextType,typeof d=="object"&&d!==null?d=mt(d):(d=Xe(n)?jn:Ve.current,d=qn(t,d));var O=n.getDerivedStateFromProps;(N=typeof O=="function"||typeof a.getSnapshotBeforeUpdate=="function")||typeof a.UNSAFE_componentWillReceiveProps!="function"&&typeof a.componentWillReceiveProps!="function"||(c!==j||E!==d)&&Bs(t,a,r,d),fn=!1,E=t.memoizedState,a.state=E,Ol(t,r,a,l);var U=t.memoizedState;c!==j||E!==U||qe.current||fn?(typeof O=="function"&&(ha(t,n,O,r),U=t.memoizedState),(_=fn||As(t,n,_,r,E,U,d)||!1)?(N||typeof a.UNSAFE_componentWillUpdate!="function"&&typeof a.componentWillUpdate!="function"||(typeof a.componentWillUpdate=="function"&&a.componentWillUpdate(r,U,d),typeof a.UNSAFE_componentWillUpdate=="function"&&a.UNSAFE_componentWillUpdate(r,U,d)),typeof a.componentDidUpdate=="function"&&(t.flags|=4),typeof a.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof a.componentDidUpdate!="function"||c===e.memoizedProps&&E===e.memoizedState||(t.flags|=4),typeof a.getSnapshotBeforeUpdate!="function"||c===e.memoizedProps&&E===e.memoizedState||(t.flags|=1024),t.memoizedProps=r,t.memoizedState=U),a.props=r,a.state=U,a.context=d,r=_):(typeof a.componentDidUpdate!="function"||c===e.memoizedProps&&E===e.memoizedState||(t.flags|=4),typeof a.getSnapshotBeforeUpdate!="function"||c===e.memoizedProps&&E===e.memoizedState||(t.flags|=1024),r=!1)}return wa(e,t,n,r,o,l)}function wa(e,t,n,r,l,o){Xs(e,t);var a=(t.flags&128)!==0;if(!r&&!a)return l&&ls(t,n,!1),Qt(e,t,o);r=t.stateNode,jd.current=t;var c=a&&typeof n.getDerivedStateFromError!="function"?null:r.render();return t.flags|=1,e!==null&&a?(t.child=tr(t,e.child,null,o),t.child=tr(t,null,c,o)):Je(e,t,c,o),t.memoizedState=r.state,l&&ls(t,n,!0),t.child}function eu(e){var t=e.stateNode;t.pendingContext?ns(e,t.pendingContext,t.pendingContext!==t.context):t.context&&ns(e,t.context,!1),la(e,t.containerInfo)}function tu(e,t,n,r,l){return er(),qo(l),t.flags|=256,Je(e,t,n,r),t.child}var ka={dehydrated:null,treeContext:null,retryLane:0};function Sa(e){return{baseLanes:e,cachePool:null,transitions:null}}function nu(e,t,n){var r=t.pendingProps,l=Se.current,o=!1,a=(t.flags&128)!==0,c;if((c=a)||(c=e!==null&&e.memoizedState===null?!1:(l&2)!==0),c?(o=!0,t.flags&=-129):(e===null||e.memoizedState!==null)&&(l|=1),xe(Se,l&1),e===null)return Go(t),e=t.memoizedState,e!==null&&(e=e.dehydrated,e!==null)?((t.mode&1)===0?t.lanes=1:e.data==="$!"?t.lanes=8:t.lanes=1073741824,null):(a=r.children,e=r.fallback,o?(r=t.mode,o=t.child,a={mode:"hidden",children:a},(r&1)===0&&o!==null?(o.childLanes=0,o.pendingProps=a):o=ro(a,r,0,null),e=Fn(e,r,n,null),o.return=t,e.return=t,o.sibling=e,t.child=o,t.child.memoizedState=Sa(n),t.memoizedState=ka,e):ba(t,a));if(l=e.memoizedState,l!==null&&(c=l.dehydrated,c!==null))return Pd(e,t,a,r,c,l,n);if(o){o=r.fallback,a=t.mode,l=e.child,c=l.sibling;var d={mode:"hidden",children:r.children};return(a&1)===0&&t.child!==l?(r=t.child,r.childLanes=0,r.pendingProps=d,t.deletions=null):(r=_n(l,d),r.subtreeFlags=l.subtreeFlags&14680064),c!==null?o=_n(c,o):(o=Fn(o,a,n,null),o.flags|=2),o.return=t,r.return=t,r.sibling=o,t.child=r,r=o,o=t.child,a=e.child.memoizedState,a=a===null?Sa(n):{baseLanes:a.baseLanes|n,cachePool:null,transitions:a.transitions},o.memoizedState=a,o.childLanes=e.childLanes&~n,t.memoizedState=ka,r}return o=e.child,e=o.sibling,r=_n(o,{mode:"visible",children:r.children}),(t.mode&1)===0&&(r.lanes=n),r.return=t,r.sibling=null,e!==null&&(n=t.deletions,n===null?(t.deletions=[e],t.flags|=16):n.push(e)),t.child=r,t.memoizedState=null,r}function ba(e,t){return t=ro({mode:"visible",children:t},e.mode,0,null),t.return=e,e.child=t}function Vl(e,t,n,r){return r!==null&&qo(r),tr(t,e.child,null,n),e=ba(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function Pd(e,t,n,r,l,o,a){if(n)return t.flags&256?(t.flags&=-257,r=va(Error(i(422))),Vl(e,t,a,r)):t.memoizedState!==null?(t.child=e.child,t.flags|=128,null):(o=r.fallback,l=t.mode,r=ro({mode:"visible",children:r.children},l,0,null),o=Fn(o,l,a,null),o.flags|=2,r.return=t,o.return=t,r.sibling=o,t.child=r,(t.mode&1)!==0&&tr(t,e.child,null,a),t.child.memoizedState=Sa(a),t.memoizedState=ka,o);if((t.mode&1)===0)return Vl(e,t,a,null);if(l.data==="$!"){if(r=l.nextSibling&&l.nextSibling.dataset,r)var c=r.dgst;return r=c,o=Error(i(419)),r=va(o,r,void 0),Vl(e,t,a,r)}if(c=(a&e.childLanes)!==0,Ze||c){if(r=$e,r!==null){switch(a&-a){case 4:l=2;break;case 16:l=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:l=32;break;case 536870912:l=268435456;break;default:l=0}l=(l&(r.suspendedLanes|a))!==0?0:l,l!==0&&l!==o.retryLane&&(o.retryLane=l,Vt(e,l),jt(r,e,l,-1))}return Aa(),r=va(Error(i(421))),Vl(e,t,a,r)}return l.data==="$?"?(t.flags|=128,t.child=e.child,t=Hd.bind(null,e),l._reactRetry=t,null):(e=o.treeContext,st=un(l.nextSibling),it=t,ke=!0,Et=null,e!==null&&(ft[gt++]=Bt,ft[gt++]=Ht,ft[gt++]=Pn,Bt=e.id,Ht=e.overflow,Pn=t),t=ba(t,r.children),t.flags|=4096,t)}function ru(e,t,n){e.lanes|=t;var r=e.alternate;r!==null&&(r.lanes|=t),ta(e.return,t,n)}function Ea(e,t,n,r,l){var o=e.memoizedState;o===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:r,tail:n,tailMode:l}:(o.isBackwards=t,o.rendering=null,o.renderingStartTime=0,o.last=r,o.tail=n,o.tailMode=l)}function lu(e,t,n){var r=t.pendingProps,l=r.revealOrder,o=r.tail;if(Je(e,t,r.children,n),r=Se.current,(r&2)!==0)r=r&1|2,t.flags|=128;else{if(e!==null&&(e.flags&128)!==0)e:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&ru(e,n,t);else if(e.tag===19)ru(e,n,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}r&=1}if(xe(Se,r),(t.mode&1)===0)t.memoizedState=null;else switch(l){case"forwards":for(n=t.child,l=null;n!==null;)e=n.alternate,e!==null&&Il(e)===null&&(l=n),n=n.sibling;n=l,n===null?(l=t.child,t.child=null):(l=n.sibling,n.sibling=null),Ea(t,!1,l,n,o);break;case"backwards":for(n=null,l=t.child,t.child=null;l!==null;){if(e=l.alternate,e!==null&&Il(e)===null){t.child=l;break}e=l.sibling,l.sibling=n,n=l,l=e}Ea(t,!0,n,null,o);break;case"together":Ea(t,!1,null,null,void 0);break;default:t.memoizedState=null}return t.child}function Wl(e,t){(t.mode&1)===0&&e!==null&&(e.alternate=null,t.alternate=null,t.flags|=2)}function Qt(e,t,n){if(e!==null&&(t.dependencies=e.dependencies),Dn|=t.lanes,(n&t.childLanes)===0)return null;if(e!==null&&t.child!==e.child)throw Error(i(153));if(t.child!==null){for(e=t.child,n=_n(e,e.pendingProps),t.child=n,n.return=t;e.sibling!==null;)e=e.sibling,n=n.sibling=_n(e,e.pendingProps),n.return=t;n.sibling=null}return t.child}function zd(e,t,n){switch(t.tag){case 3:eu(t),er();break;case 5:vs(t);break;case 1:Xe(t.type)&&Nl(t);break;case 4:la(t,t.stateNode.containerInfo);break;case 10:var r=t.type._context,l=t.memoizedProps.value;xe(Ml,r._currentValue),r._currentValue=l;break;case 13:if(r=t.memoizedState,r!==null)return r.dehydrated!==null?(xe(Se,Se.current&1),t.flags|=128,null):(n&t.child.childLanes)!==0?nu(e,t,n):(xe(Se,Se.current&1),e=Qt(e,t,n),e!==null?e.sibling:null);xe(Se,Se.current&1);break;case 19:if(r=(n&t.childLanes)!==0,(e.flags&128)!==0){if(r)return lu(e,t,n);t.flags|=128}if(l=t.memoizedState,l!==null&&(l.rendering=null,l.tail=null,l.lastEffect=null),xe(Se,Se.current),r)break;return null;case 22:case 23:return t.lanes=0,qs(e,t,n)}return Qt(e,t,n)}var ou,Ca,au,iu;ou=function(e,t){for(var n=t.child;n!==null;){if(n.tag===5||n.tag===6)e.appendChild(n.stateNode);else if(n.tag!==4&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===t)break;for(;n.sibling===null;){if(n.return===null||n.return===t)return;n=n.return}n.sibling.return=n.return,n=n.sibling}},Ca=function(){},au=function(e,t,n,r){var l=e.memoizedProps;if(l!==r){e=t.stateNode,Mn(Dt.current);var o=null;switch(n){case"input":l=Jt(e,l),r=Jt(e,r),o=[];break;case"select":l=I({},l,{value:void 0}),r=I({},r,{value:void 0}),o=[];break;case"textarea":l=bn(e,l),r=bn(e,r),o=[];break;default:typeof l.onClick!="function"&&typeof r.onClick=="function"&&(e.onclick=bl)}en(n,r);var a;n=null;for(_ in l)if(!r.hasOwnProperty(_)&&l.hasOwnProperty(_)&&l[_]!=null)if(_==="style"){var c=l[_];for(a in c)c.hasOwnProperty(a)&&(n||(n={}),n[a]="")}else _!=="dangerouslySetInnerHTML"&&_!=="children"&&_!=="suppressContentEditableWarning"&&_!=="suppressHydrationWarning"&&_!=="autoFocus"&&(m.hasOwnProperty(_)?o||(o=[]):(o=o||[]).push(_,null));for(_ in r){var d=r[_];if(c=l!=null?l[_]:void 0,r.hasOwnProperty(_)&&d!==c&&(d!=null||c!=null))if(_==="style")if(c){for(a in c)!c.hasOwnProperty(a)||d&&d.hasOwnProperty(a)||(n||(n={}),n[a]="");for(a in d)d.hasOwnProperty(a)&&c[a]!==d[a]&&(n||(n={}),n[a]=d[a])}else n||(o||(o=[]),o.push(_,n)),n=d;else _==="dangerouslySetInnerHTML"?(d=d?d.__html:void 0,c=c?c.__html:void 0,d!=null&&c!==d&&(o=o||[]).push(_,d)):_==="children"?typeof d!="string"&&typeof d!="number"||(o=o||[]).push(_,""+d):_!=="suppressContentEditableWarning"&&_!=="suppressHydrationWarning"&&(m.hasOwnProperty(_)?(d!=null&&_==="onScroll"&&ye("scroll",e),o||c===d||(o=[])):(o=o||[]).push(_,d))}n&&(o=o||[]).push("style",n);var _=o;(t.updateQueue=_)&&(t.flags|=4)}},iu=function(e,t,n,r){n!==r&&(t.flags|=4)};function Wr(e,t){if(!ke)switch(e.tailMode){case"hidden":t=e.tail;for(var n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?e.tail=null:n.sibling=null;break;case"collapsed":n=e.tail;for(var r=null;n!==null;)n.alternate!==null&&(r=n),n=n.sibling;r===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:r.sibling=null}}function Qe(e){var t=e.alternate!==null&&e.alternate.child===e.child,n=0,r=0;if(t)for(var l=e.child;l!==null;)n|=l.lanes|l.childLanes,r|=l.subtreeFlags&14680064,r|=l.flags&14680064,l.return=e,l=l.sibling;else for(l=e.child;l!==null;)n|=l.lanes|l.childLanes,r|=l.subtreeFlags,r|=l.flags,l.return=e,l=l.sibling;return e.subtreeFlags|=r,e.childLanes=n,t}function Ld(e,t,n){var r=t.pendingProps;switch(Yo(t),t.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Qe(t),null;case 1:return Xe(t.type)&&Cl(),Qe(t),null;case 3:return r=t.stateNode,lr(),_e(qe),_e(Ve),ia(),r.pendingContext&&(r.context=r.pendingContext,r.pendingContext=null),(e===null||e.child===null)&&(zl(t)?t.flags|=4:e===null||e.memoizedState.isDehydrated&&(t.flags&256)===0||(t.flags|=1024,Et!==null&&(Ia(Et),Et=null))),Ca(e,t),Qe(t),null;case 5:oa(t);var l=Mn(Ar.current);if(n=t.type,e!==null&&t.stateNode!=null)au(e,t,n,r,l),e.ref!==t.ref&&(t.flags|=512,t.flags|=2097152);else{if(!r){if(t.stateNode===null)throw Error(i(166));return Qe(t),null}if(e=Mn(Dt.current),zl(t)){r=t.stateNode,n=t.type;var o=t.memoizedProps;switch(r[Rt]=t,r[Dr]=o,e=(t.mode&1)!==0,n){case"dialog":ye("cancel",r),ye("close",r);break;case"iframe":case"object":case"embed":ye("load",r);break;case"video":case"audio":for(l=0;l<Lr.length;l++)ye(Lr[l],r);break;case"source":ye("error",r);break;case"img":case"image":case"link":ye("error",r),ye("load",r);break;case"details":ye("toggle",r);break;case"input":Zr(r,o),ye("invalid",r);break;case"select":r._wrapperState={wasMultiple:!!o.multiple},ye("invalid",r);break;case"textarea":dr(r,o),ye("invalid",r)}en(n,o),l=null;for(var a in o)if(o.hasOwnProperty(a)){var c=o[a];a==="children"?typeof c=="string"?r.textContent!==c&&(o.suppressHydrationWarning!==!0&&Sl(r.textContent,c,e),l=["children",c]):typeof c=="number"&&r.textContent!==""+c&&(o.suppressHydrationWarning!==!0&&Sl(r.textContent,c,e),l=["children",""+c]):m.hasOwnProperty(a)&&c!=null&&a==="onScroll"&&ye("scroll",r)}switch(n){case"input":Yt(r),Sn(r,o,!0);break;case"textarea":Yt(r),Ft(r);break;case"select":case"option":break;default:typeof o.onClick=="function"&&(r.onclick=bl)}r=l,t.updateQueue=r,r!==null&&(t.flags|=4)}else{a=l.nodeType===9?l:l.ownerDocument,e==="http://www.w3.org/1999/xhtml"&&(e=En(n)),e==="http://www.w3.org/1999/xhtml"?n==="script"?(e=a.createElement("div"),e.innerHTML="<script><\/script>",e=e.removeChild(e.firstChild)):typeof r.is=="string"?e=a.createElement(n,{is:r.is}):(e=a.createElement(n),n==="select"&&(a=e,r.multiple?a.multiple=!0:r.size&&(a.size=r.size))):e=a.createElementNS(e,n),e[Rt]=t,e[Dr]=r,ou(e,t,!1,!1),t.stateNode=e;e:{switch(a=gr(n,r),n){case"dialog":ye("cancel",e),ye("close",e),l=r;break;case"iframe":case"object":case"embed":ye("load",e),l=r;break;case"video":case"audio":for(l=0;l<Lr.length;l++)ye(Lr[l],e);l=r;break;case"source":ye("error",e),l=r;break;case"img":case"image":case"link":ye("error",e),ye("load",e),l=r;break;case"details":ye("toggle",e),l=r;break;case"input":Zr(e,r),l=Jt(e,r),ye("invalid",e);break;case"option":l=r;break;case"select":e._wrapperState={wasMultiple:!!r.multiple},l=I({},r,{value:void 0}),ye("invalid",e);break;case"textarea":dr(e,r),l=bn(e,r),ye("invalid",e);break;default:l=r}en(n,l),c=l;for(o in c)if(c.hasOwnProperty(o)){var d=c[o];o==="style"?Lt(e,d):o==="dangerouslySetInnerHTML"?(d=d?d.__html:void 0,d!=null&&el(e,d)):o==="children"?typeof d=="string"?(n!=="textarea"||d!=="")&&Xt(e,d):typeof d=="number"&&Xt(e,""+d):o!=="suppressContentEditableWarning"&&o!=="suppressHydrationWarning"&&o!=="autoFocus"&&(m.hasOwnProperty(o)?d!=null&&o==="onScroll"&&ye("scroll",e):d!=null&&je(e,o,d,a))}switch(n){case"input":Yt(e),Sn(e,r,!1);break;case"textarea":Yt(e),Ft(e);break;case"option":r.value!=null&&e.setAttribute("value",""+q(r.value));break;case"select":e.multiple=!!r.multiple,o=r.value,o!=null?Ue(e,!!r.multiple,o,!1):r.defaultValue!=null&&Ue(e,!!r.multiple,r.defaultValue,!0);break;default:typeof l.onClick=="function"&&(e.onclick=bl)}switch(n){case"button":case"input":case"select":case"textarea":r=!!r.autoFocus;break e;case"img":r=!0;break e;default:r=!1}}r&&(t.flags|=4)}t.ref!==null&&(t.flags|=512,t.flags|=2097152)}return Qe(t),null;case 6:if(e&&t.stateNode!=null)iu(e,t,e.memoizedProps,r);else{if(typeof r!="string"&&t.stateNode===null)throw Error(i(166));if(n=Mn(Ar.current),Mn(Dt.current),zl(t)){if(r=t.stateNode,n=t.memoizedProps,r[Rt]=t,(o=r.nodeValue!==n)&&(e=it,e!==null))switch(e.tag){case 3:Sl(r.nodeValue,n,(e.mode&1)!==0);break;case 5:e.memoizedProps.suppressHydrationWarning!==!0&&Sl(r.nodeValue,n,(e.mode&1)!==0)}o&&(t.flags|=4)}else r=(n.nodeType===9?n:n.ownerDocument).createTextNode(r),r[Rt]=t,t.stateNode=r}return Qe(t),null;case 13:if(_e(Se),r=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(ke&&st!==null&&(t.mode&1)!==0&&(t.flags&128)===0)cs(),er(),t.flags|=98560,o=!1;else if(o=zl(t),r!==null&&r.dehydrated!==null){if(e===null){if(!o)throw Error(i(318));if(o=t.memoizedState,o=o!==null?o.dehydrated:null,!o)throw Error(i(317));o[Rt]=t}else er(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;Qe(t),o=!1}else Et!==null&&(Ia(Et),Et=null),o=!0;if(!o)return t.flags&65536?t:null}return(t.flags&128)!==0?(t.lanes=n,t):(r=r!==null,r!==(e!==null&&e.memoizedState!==null)&&r&&(t.child.flags|=8192,(t.mode&1)!==0&&(e===null||(Se.current&1)!==0?De===0&&(De=3):Aa())),t.updateQueue!==null&&(t.flags|=4),Qe(t),null);case 4:return lr(),Ca(e,t),e===null&&Mr(t.stateNode.containerInfo),Qe(t),null;case 10:return ea(t.type._context),Qe(t),null;case 17:return Xe(t.type)&&Cl(),Qe(t),null;case 19:if(_e(Se),o=t.memoizedState,o===null)return Qe(t),null;if(r=(t.flags&128)!==0,a=o.rendering,a===null)if(r)Wr(o,!1);else{if(De!==0||e!==null&&(e.flags&128)!==0)for(e=t.child;e!==null;){if(a=Il(e),a!==null){for(t.flags|=128,Wr(o,!1),r=a.updateQueue,r!==null&&(t.updateQueue=r,t.flags|=4),t.subtreeFlags=0,r=n,n=t.child;n!==null;)o=n,e=r,o.flags&=14680066,a=o.alternate,a===null?(o.childLanes=0,o.lanes=e,o.child=null,o.subtreeFlags=0,o.memoizedProps=null,o.memoizedState=null,o.updateQueue=null,o.dependencies=null,o.stateNode=null):(o.childLanes=a.childLanes,o.lanes=a.lanes,o.child=a.child,o.subtreeFlags=0,o.deletions=null,o.memoizedProps=a.memoizedProps,o.memoizedState=a.memoizedState,o.updateQueue=a.updateQueue,o.type=a.type,e=a.dependencies,o.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext}),n=n.sibling;return xe(Se,Se.current&1|2),t.child}e=e.sibling}o.tail!==null&&Ne()>sr&&(t.flags|=128,r=!0,Wr(o,!1),t.lanes=4194304)}else{if(!r)if(e=Il(a),e!==null){if(t.flags|=128,r=!0,n=e.updateQueue,n!==null&&(t.updateQueue=n,t.flags|=4),Wr(o,!0),o.tail===null&&o.tailMode==="hidden"&&!a.alternate&&!ke)return Qe(t),null}else 2*Ne()-o.renderingStartTime>sr&&n!==1073741824&&(t.flags|=128,r=!0,Wr(o,!1),t.lanes=4194304);o.isBackwards?(a.sibling=t.child,t.child=a):(n=o.last,n!==null?n.sibling=a:t.child=a,o.last=a)}return o.tail!==null?(t=o.tail,o.rendering=t,o.tail=t.sibling,o.renderingStartTime=Ne(),t.sibling=null,n=Se.current,xe(Se,r?n&1|2:n&1),t):(Qe(t),null);case 22:case 23:return Fa(),r=t.memoizedState!==null,e!==null&&e.memoizedState!==null!==r&&(t.flags|=8192),r&&(t.mode&1)!==0?(ut&1073741824)!==0&&(Qe(t),t.subtreeFlags&6&&(t.flags|=8192)):Qe(t),null;case 24:return null;case 25:return null}throw Error(i(156,t.tag))}function Md(e,t){switch(Yo(t),t.tag){case 1:return Xe(t.type)&&Cl(),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return lr(),_e(qe),_e(Ve),ia(),e=t.flags,(e&65536)!==0&&(e&128)===0?(t.flags=e&-65537|128,t):null;case 5:return oa(t),null;case 13:if(_e(Se),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(i(340));er()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return _e(Se),null;case 4:return lr(),null;case 10:return ea(t.type._context),null;case 22:case 23:return Fa(),null;case 24:return null;default:return null}}var Ql=!1,Ke=!1,Rd=typeof WeakSet=="function"?WeakSet:Set,$=null;function ar(e,t){var n=e.ref;if(n!==null)if(typeof n=="function")try{n(null)}catch(r){Ee(e,t,r)}else n.current=null}function Na(e,t,n){try{n()}catch(r){Ee(e,t,r)}}var su=!1;function Dd(e,t){if(Fo=pl,e=Ai(),zo(e)){if("selectionStart"in e)var n={start:e.selectionStart,end:e.selectionEnd};else e:{n=(n=e.ownerDocument)&&n.defaultView||window;var r=n.getSelection&&n.getSelection();if(r&&r.rangeCount!==0){n=r.anchorNode;var l=r.anchorOffset,o=r.focusNode;r=r.focusOffset;try{n.nodeType,o.nodeType}catch{n=null;break e}var a=0,c=-1,d=-1,_=0,N=0,j=e,E=null;t:for(;;){for(var O;j!==n||l!==0&&j.nodeType!==3||(c=a+l),j!==o||r!==0&&j.nodeType!==3||(d=a+r),j.nodeType===3&&(a+=j.nodeValue.length),(O=j.firstChild)!==null;)E=j,j=O;for(;;){if(j===e)break t;if(E===n&&++_===l&&(c=a),E===o&&++N===r&&(d=a),(O=j.nextSibling)!==null)break;j=E,E=j.parentNode}j=O}n=c===-1||d===-1?null:{start:c,end:d}}else n=null}n=n||{start:0,end:0}}else n=null;for(Ao={focusedElem:e,selectionRange:n},pl=!1,$=t;$!==null;)if(t=$,e=t.child,(t.subtreeFlags&1028)!==0&&e!==null)e.return=t,$=e;else for(;$!==null;){t=$;try{var U=t.alternate;if((t.flags&1024)!==0)switch(t.tag){case 0:case 11:case 15:break;case 1:if(U!==null){var B=U.memoizedProps,Te=U.memoizedState,x=t.stateNode,f=x.getSnapshotBeforeUpdate(t.elementType===t.type?B:Ct(t.type,B),Te);x.__reactInternalSnapshotBeforeUpdate=f}break;case 3:var v=t.stateNode.containerInfo;v.nodeType===1?v.textContent="":v.nodeType===9&&v.documentElement&&v.removeChild(v.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(i(163))}}catch(P){Ee(t,t.return,P)}if(e=t.sibling,e!==null){e.return=t.return,$=e;break}$=t.return}return U=su,su=!1,U}function Qr(e,t,n){var r=t.updateQueue;if(r=r!==null?r.lastEffect:null,r!==null){var l=r=r.next;do{if((l.tag&e)===e){var o=l.destroy;l.destroy=void 0,o!==void 0&&Na(t,n,o)}l=l.next}while(l!==r)}}function Kl(e,t){if(t=t.updateQueue,t=t!==null?t.lastEffect:null,t!==null){var n=t=t.next;do{if((n.tag&e)===e){var r=n.create;n.destroy=r()}n=n.next}while(n!==t)}}function Ta(e){var t=e.ref;if(t!==null){var n=e.stateNode;switch(e.tag){case 5:e=n;break;default:e=n}typeof t=="function"?t(e):t.current=e}}function uu(e){var t=e.alternate;t!==null&&(e.alternate=null,uu(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&(delete t[Rt],delete t[Dr],delete t[Vo],delete t[xd],delete t[vd])),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}function cu(e){return e.tag===5||e.tag===3||e.tag===4}function du(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||cu(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function ja(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?n.nodeType===8?n.parentNode.insertBefore(e,t):n.insertBefore(e,t):(n.nodeType===8?(t=n.parentNode,t.insertBefore(e,n)):(t=n,t.appendChild(e)),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=bl));else if(r!==4&&(e=e.child,e!==null))for(ja(e,t,n),e=e.sibling;e!==null;)ja(e,t,n),e=e.sibling}function Pa(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?n.insertBefore(e,t):n.appendChild(e);else if(r!==4&&(e=e.child,e!==null))for(Pa(e,t,n),e=e.sibling;e!==null;)Pa(e,t,n),e=e.sibling}var Be=null,Nt=!1;function mn(e,t,n){for(n=n.child;n!==null;)pu(e,t,n),n=n.sibling}function pu(e,t,n){if(Mt&&typeof Mt.onCommitFiberUnmount=="function")try{Mt.onCommitFiberUnmount(al,n)}catch{}switch(n.tag){case 5:Ke||ar(n,t);case 6:var r=Be,l=Nt;Be=null,mn(e,t,n),Be=r,Nt=l,Be!==null&&(Nt?(e=Be,n=n.stateNode,e.nodeType===8?e.parentNode.removeChild(n):e.removeChild(n)):Be.removeChild(n.stateNode));break;case 18:Be!==null&&(Nt?(e=Be,n=n.stateNode,e.nodeType===8?Ho(e.parentNode,n):e.nodeType===1&&Ho(e,n),br(e)):Ho(Be,n.stateNode));break;case 4:r=Be,l=Nt,Be=n.stateNode.containerInfo,Nt=!0,mn(e,t,n),Be=r,Nt=l;break;case 0:case 11:case 14:case 15:if(!Ke&&(r=n.updateQueue,r!==null&&(r=r.lastEffect,r!==null))){l=r=r.next;do{var o=l,a=o.destroy;o=o.tag,a!==void 0&&((o&2)!==0||(o&4)!==0)&&Na(n,t,a),l=l.next}while(l!==r)}mn(e,t,n);break;case 1:if(!Ke&&(ar(n,t),r=n.stateNode,typeof r.componentWillUnmount=="function"))try{r.props=n.memoizedProps,r.state=n.memoizedState,r.componentWillUnmount()}catch(c){Ee(n,t,c)}mn(e,t,n);break;case 21:mn(e,t,n);break;case 22:n.mode&1?(Ke=(r=Ke)||n.memoizedState!==null,mn(e,t,n),Ke=r):mn(e,t,n);break;default:mn(e,t,n)}}function fu(e){var t=e.updateQueue;if(t!==null){e.updateQueue=null;var n=e.stateNode;n===null&&(n=e.stateNode=new Rd),t.forEach(function(r){var l=Vd.bind(null,e,r);n.has(r)||(n.add(r),r.then(l,l))})}}function Tt(e,t){var n=t.deletions;if(n!==null)for(var r=0;r<n.length;r++){var l=n[r];try{var o=e,a=t,c=a;e:for(;c!==null;){switch(c.tag){case 5:Be=c.stateNode,Nt=!1;break e;case 3:Be=c.stateNode.containerInfo,Nt=!0;break e;case 4:Be=c.stateNode.containerInfo,Nt=!0;break e}c=c.return}if(Be===null)throw Error(i(160));pu(o,a,l),Be=null,Nt=!1;var d=l.alternate;d!==null&&(d.return=null),l.return=null}catch(_){Ee(l,t,_)}}if(t.subtreeFlags&12854)for(t=t.child;t!==null;)gu(t,e),t=t.sibling}function gu(e,t){var n=e.alternate,r=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if(Tt(t,e),It(e),r&4){try{Qr(3,e,e.return),Kl(3,e)}catch(B){Ee(e,e.return,B)}try{Qr(5,e,e.return)}catch(B){Ee(e,e.return,B)}}break;case 1:Tt(t,e),It(e),r&512&&n!==null&&ar(n,n.return);break;case 5:if(Tt(t,e),It(e),r&512&&n!==null&&ar(n,n.return),e.flags&32){var l=e.stateNode;try{Xt(l,"")}catch(B){Ee(e,e.return,B)}}if(r&4&&(l=e.stateNode,l!=null)){var o=e.memoizedProps,a=n!==null?n.memoizedProps:o,c=e.type,d=e.updateQueue;if(e.updateQueue=null,d!==null)try{c==="input"&&o.type==="radio"&&o.name!=null&&cr(l,o),gr(c,a);var _=gr(c,o);for(a=0;a<d.length;a+=2){var N=d[a],j=d[a+1];N==="style"?Lt(l,j):N==="dangerouslySetInnerHTML"?el(l,j):N==="children"?Xt(l,j):je(l,N,j,_)}switch(c){case"input":ot(l,o);break;case"textarea":qt(l,o);break;case"select":var E=l._wrapperState.wasMultiple;l._wrapperState.wasMultiple=!!o.multiple;var O=o.value;O!=null?Ue(l,!!o.multiple,O,!1):E!==!!o.multiple&&(o.defaultValue!=null?Ue(l,!!o.multiple,o.defaultValue,!0):Ue(l,!!o.multiple,o.multiple?[]:"",!1))}l[Dr]=o}catch(B){Ee(e,e.return,B)}}break;case 6:if(Tt(t,e),It(e),r&4){if(e.stateNode===null)throw Error(i(162));l=e.stateNode,o=e.memoizedProps;try{l.nodeValue=o}catch(B){Ee(e,e.return,B)}}break;case 3:if(Tt(t,e),It(e),r&4&&n!==null&&n.memoizedState.isDehydrated)try{br(t.containerInfo)}catch(B){Ee(e,e.return,B)}break;case 4:Tt(t,e),It(e);break;case 13:Tt(t,e),It(e),l=e.child,l.flags&8192&&(o=l.memoizedState!==null,l.stateNode.isHidden=o,!o||l.alternate!==null&&l.alternate.memoizedState!==null||(Ma=Ne())),r&4&&fu(e);break;case 22:if(N=n!==null&&n.memoizedState!==null,e.mode&1?(Ke=(_=Ke)||N,Tt(t,e),Ke=_):Tt(t,e),It(e),r&8192){if(_=e.memoizedState!==null,(e.stateNode.isHidden=_)&&!N&&(e.mode&1)!==0)for($=e,N=e.child;N!==null;){for(j=$=N;$!==null;){switch(E=$,O=E.child,E.tag){case 0:case 11:case 14:case 15:Qr(4,E,E.return);break;case 1:ar(E,E.return);var U=E.stateNode;if(typeof U.componentWillUnmount=="function"){r=E,n=E.return;try{t=r,U.props=t.memoizedProps,U.state=t.memoizedState,U.componentWillUnmount()}catch(B){Ee(r,n,B)}}break;case 5:ar(E,E.return);break;case 22:if(E.memoizedState!==null){xu(j);continue}}O!==null?(O.return=E,$=O):xu(j)}N=N.sibling}e:for(N=null,j=e;;){if(j.tag===5){if(N===null){N=j;try{l=j.stateNode,_?(o=l.style,typeof o.setProperty=="function"?o.setProperty("display","none","important"):o.display="none"):(c=j.stateNode,d=j.memoizedProps.style,a=d!=null&&d.hasOwnProperty("display")?d.display:null,c.style.display=fr("display",a))}catch(B){Ee(e,e.return,B)}}}else if(j.tag===6){if(N===null)try{j.stateNode.nodeValue=_?"":j.memoizedProps}catch(B){Ee(e,e.return,B)}}else if((j.tag!==22&&j.tag!==23||j.memoizedState===null||j===e)&&j.child!==null){j.child.return=j,j=j.child;continue}if(j===e)break e;for(;j.sibling===null;){if(j.return===null||j.return===e)break e;N===j&&(N=null),j=j.return}N===j&&(N=null),j.sibling.return=j.return,j=j.sibling}}break;case 19:Tt(t,e),It(e),r&4&&fu(e);break;case 21:break;default:Tt(t,e),It(e)}}function It(e){var t=e.flags;if(t&2){try{e:{for(var n=e.return;n!==null;){if(cu(n)){var r=n;break e}n=n.return}throw Error(i(160))}switch(r.tag){case 5:var l=r.stateNode;r.flags&32&&(Xt(l,""),r.flags&=-33);var o=du(e);Pa(e,o,l);break;case 3:case 4:var a=r.stateNode.containerInfo,c=du(e);ja(e,c,a);break;default:throw Error(i(161))}}catch(d){Ee(e,e.return,d)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function Od(e,t,n){$=e,mu(e)}function mu(e,t,n){for(var r=(e.mode&1)!==0;$!==null;){var l=$,o=l.child;if(l.tag===22&&r){var a=l.memoizedState!==null||Ql;if(!a){var c=l.alternate,d=c!==null&&c.memoizedState!==null||Ke;c=Ql;var _=Ke;if(Ql=a,(Ke=d)&&!_)for($=l;$!==null;)a=$,d=a.child,a.tag===22&&a.memoizedState!==null?vu(l):d!==null?(d.return=a,$=d):vu(l);for(;o!==null;)$=o,mu(o),o=o.sibling;$=l,Ql=c,Ke=_}hu(e)}else(l.subtreeFlags&8772)!==0&&o!==null?(o.return=l,$=o):hu(e)}}function hu(e){for(;$!==null;){var t=$;if((t.flags&8772)!==0){var n=t.alternate;try{if((t.flags&8772)!==0)switch(t.tag){case 0:case 11:case 15:Ke||Kl(5,t);break;case 1:var r=t.stateNode;if(t.flags&4&&!Ke)if(n===null)r.componentDidMount();else{var l=t.elementType===t.type?n.memoizedProps:Ct(t.type,n.memoizedProps);r.componentDidUpdate(l,n.memoizedState,r.__reactInternalSnapshotBeforeUpdate)}var o=t.updateQueue;o!==null&&xs(t,o,r);break;case 3:var a=t.updateQueue;if(a!==null){if(n=null,t.child!==null)switch(t.child.tag){case 5:n=t.child.stateNode;break;case 1:n=t.child.stateNode}xs(t,a,n)}break;case 5:var c=t.stateNode;if(n===null&&t.flags&4){n=c;var d=t.memoizedProps;switch(t.type){case"button":case"input":case"select":case"textarea":d.autoFocus&&n.focus();break;case"img":d.src&&(n.src=d.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(t.memoizedState===null){var _=t.alternate;if(_!==null){var N=_.memoizedState;if(N!==null){var j=N.dehydrated;j!==null&&br(j)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(i(163))}Ke||t.flags&512&&Ta(t)}catch(E){Ee(t,t.return,E)}}if(t===e){$=null;break}if(n=t.sibling,n!==null){n.return=t.return,$=n;break}$=t.return}}function xu(e){for(;$!==null;){var t=$;if(t===e){$=null;break}var n=t.sibling;if(n!==null){n.return=t.return,$=n;break}$=t.return}}function vu(e){for(;$!==null;){var t=$;try{switch(t.tag){case 0:case 11:case 15:var n=t.return;try{Kl(4,t)}catch(d){Ee(t,n,d)}break;case 1:var r=t.stateNode;if(typeof r.componentDidMount=="function"){var l=t.return;try{r.componentDidMount()}catch(d){Ee(t,l,d)}}var o=t.return;try{Ta(t)}catch(d){Ee(t,o,d)}break;case 5:var a=t.return;try{Ta(t)}catch(d){Ee(t,a,d)}}}catch(d){Ee(t,t.return,d)}if(t===e){$=null;break}var c=t.sibling;if(c!==null){c.return=t.return,$=c;break}$=t.return}}var Id=Math.ceil,Yl=we.ReactCurrentDispatcher,za=we.ReactCurrentOwner,xt=we.ReactCurrentBatchConfig,ae=0,$e=null,Le=null,He=0,ut=0,ir=cn(0),De=0,Kr=null,Dn=0,Jl=0,La=0,Yr=null,et=null,Ma=0,sr=1/0,Kt=null,Gl=!1,Ra=null,hn=null,ql=!1,xn=null,Xl=0,Jr=0,Da=null,Zl=-1,eo=0;function Ge(){return(ae&6)!==0?Ne():Zl!==-1?Zl:Zl=Ne()}function vn(e){return(e.mode&1)===0?1:(ae&2)!==0&&He!==0?He&-He:_d.transition!==null?(eo===0&&(eo=di()),eo):(e=de,e!==0||(e=window.event,e=e===void 0?16:_i(e.type)),e)}function jt(e,t,n,r){if(50<Jr)throw Jr=0,Da=null,Error(i(185));yr(e,n,r),((ae&2)===0||e!==$e)&&(e===$e&&((ae&2)===0&&(Jl|=n),De===4&&yn(e,He)),tt(e,r),n===1&&ae===0&&(t.mode&1)===0&&(sr=Ne()+500,Tl&&pn()))}function tt(e,t){var n=e.callbackNode;_c(e,t);var r=ul(e,e===$e?He:0);if(r===0)n!==null&&si(n),e.callbackNode=null,e.callbackPriority=0;else if(t=r&-r,e.callbackPriority!==t){if(n!=null&&si(n),t===1)e.tag===0?yd(_u.bind(null,e)):os(_u.bind(null,e)),md(function(){(ae&6)===0&&pn()}),n=null;else{switch(pi(r)){case 1:n=go;break;case 4:n=ui;break;case 16:n=ol;break;case 536870912:n=ci;break;default:n=ol}n=Tu(n,yu.bind(null,e))}e.callbackPriority=t,e.callbackNode=n}}function yu(e,t){if(Zl=-1,eo=0,(ae&6)!==0)throw Error(i(327));var n=e.callbackNode;if(ur()&&e.callbackNode!==n)return null;var r=ul(e,e===$e?He:0);if(r===0)return null;if((r&30)!==0||(r&e.expiredLanes)!==0||t)t=to(e,r);else{t=r;var l=ae;ae|=2;var o=ku();($e!==e||He!==t)&&(Kt=null,sr=Ne()+500,In(e,t));do try{Ad();break}catch(c){wu(e,c)}while(!0);Zo(),Yl.current=o,ae=l,Le!==null?t=0:($e=null,He=0,t=De)}if(t!==0){if(t===2&&(l=mo(e),l!==0&&(r=l,t=Oa(e,l))),t===1)throw n=Kr,In(e,0),yn(e,r),tt(e,Ne()),n;if(t===6)yn(e,r);else{if(l=e.current.alternate,(r&30)===0&&!$d(l)&&(t=to(e,r),t===2&&(o=mo(e),o!==0&&(r=o,t=Oa(e,o))),t===1))throw n=Kr,In(e,0),yn(e,r),tt(e,Ne()),n;switch(e.finishedWork=l,e.finishedLanes=r,t){case 0:case 1:throw Error(i(345));case 2:$n(e,et,Kt);break;case 3:if(yn(e,r),(r&130023424)===r&&(t=Ma+500-Ne(),10<t)){if(ul(e,0)!==0)break;if(l=e.suspendedLanes,(l&r)!==r){Ge(),e.pingedLanes|=e.suspendedLanes&l;break}e.timeoutHandle=Bo($n.bind(null,e,et,Kt),t);break}$n(e,et,Kt);break;case 4:if(yn(e,r),(r&4194240)===r)break;for(t=e.eventTimes,l=-1;0<r;){var a=31-St(r);o=1<<a,a=t[a],a>l&&(l=a),r&=~o}if(r=l,r=Ne()-r,r=(120>r?120:480>r?480:1080>r?1080:1920>r?1920:3e3>r?3e3:4320>r?4320:1960*Id(r/1960))-r,10<r){e.timeoutHandle=Bo($n.bind(null,e,et,Kt),r);break}$n(e,et,Kt);break;case 5:$n(e,et,Kt);break;default:throw Error(i(329))}}}return tt(e,Ne()),e.callbackNode===n?yu.bind(null,e):null}function Oa(e,t){var n=Yr;return e.current.memoizedState.isDehydrated&&(In(e,t).flags|=256),e=to(e,t),e!==2&&(t=et,et=n,t!==null&&Ia(t)),e}function Ia(e){et===null?et=e:et.push.apply(et,e)}function $d(e){for(var t=e;;){if(t.flags&16384){var n=t.updateQueue;if(n!==null&&(n=n.stores,n!==null))for(var r=0;r<n.length;r++){var l=n[r],o=l.getSnapshot;l=l.value;try{if(!bt(o(),l))return!1}catch{return!1}}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function yn(e,t){for(t&=~La,t&=~Jl,e.suspendedLanes|=t,e.pingedLanes&=~t,e=e.expirationTimes;0<t;){var n=31-St(t),r=1<<n;e[n]=-1,t&=~r}}function _u(e){if((ae&6)!==0)throw Error(i(327));ur();var t=ul(e,0);if((t&1)===0)return tt(e,Ne()),null;var n=to(e,t);if(e.tag!==0&&n===2){var r=mo(e);r!==0&&(t=r,n=Oa(e,r))}if(n===1)throw n=Kr,In(e,0),yn(e,t),tt(e,Ne()),n;if(n===6)throw Error(i(345));return e.finishedWork=e.current.alternate,e.finishedLanes=t,$n(e,et,Kt),tt(e,Ne()),null}function $a(e,t){var n=ae;ae|=1;try{return e(t)}finally{ae=n,ae===0&&(sr=Ne()+500,Tl&&pn())}}function On(e){xn!==null&&xn.tag===0&&(ae&6)===0&&ur();var t=ae;ae|=1;var n=xt.transition,r=de;try{if(xt.transition=null,de=1,e)return e()}finally{de=r,xt.transition=n,ae=t,(ae&6)===0&&pn()}}function Fa(){ut=ir.current,_e(ir)}function In(e,t){e.finishedWork=null,e.finishedLanes=0;var n=e.timeoutHandle;if(n!==-1&&(e.timeoutHandle=-1,gd(n)),Le!==null)for(n=Le.return;n!==null;){var r=n;switch(Yo(r),r.tag){case 1:r=r.type.childContextTypes,r!=null&&Cl();break;case 3:lr(),_e(qe),_e(Ve),ia();break;case 5:oa(r);break;case 4:lr();break;case 13:_e(Se);break;case 19:_e(Se);break;case 10:ea(r.type._context);break;case 22:case 23:Fa()}n=n.return}if($e=e,Le=e=_n(e.current,null),He=ut=t,De=0,Kr=null,La=Jl=Dn=0,et=Yr=null,Ln!==null){for(t=0;t<Ln.length;t++)if(n=Ln[t],r=n.interleaved,r!==null){n.interleaved=null;var l=r.next,o=n.pending;if(o!==null){var a=o.next;o.next=l,r.next=a}n.pending=r}Ln=null}return e}function wu(e,t){do{var n=Le;try{if(Zo(),$l.current=Bl,Fl){for(var r=be.memoizedState;r!==null;){var l=r.queue;l!==null&&(l.pending=null),r=r.next}Fl=!1}if(Rn=0,Ie=Re=be=null,Ur=!1,Br=0,za.current=null,n===null||n.return===null){De=1,Kr=t,Le=null;break}e:{var o=e,a=n.return,c=n,d=t;if(t=He,c.flags|=32768,d!==null&&typeof d=="object"&&typeof d.then=="function"){var _=d,N=c,j=N.tag;if((N.mode&1)===0&&(j===0||j===11||j===15)){var E=N.alternate;E?(N.updateQueue=E.updateQueue,N.memoizedState=E.memoizedState,N.lanes=E.lanes):(N.updateQueue=null,N.memoizedState=null)}var O=Qs(a);if(O!==null){O.flags&=-257,Ks(O,a,c,o,t),O.mode&1&&Ws(o,_,t),t=O,d=_;var U=t.updateQueue;if(U===null){var B=new Set;B.add(d),t.updateQueue=B}else U.add(d);break e}else{if((t&1)===0){Ws(o,_,t),Aa();break e}d=Error(i(426))}}else if(ke&&c.mode&1){var Te=Qs(a);if(Te!==null){(Te.flags&65536)===0&&(Te.flags|=256),Ks(Te,a,c,o,t),qo(or(d,c));break e}}o=d=or(d,c),De!==4&&(De=2),Yr===null?Yr=[o]:Yr.push(o),o=a;do{switch(o.tag){case 3:o.flags|=65536,t&=-t,o.lanes|=t;var x=Hs(o,d,t);hs(o,x);break e;case 1:c=d;var f=o.type,v=o.stateNode;if((o.flags&128)===0&&(typeof f.getDerivedStateFromError=="function"||v!==null&&typeof v.componentDidCatch=="function"&&(hn===null||!hn.has(v)))){o.flags|=65536,t&=-t,o.lanes|=t;var P=Vs(o,c,t);hs(o,P);break e}}o=o.return}while(o!==null)}bu(n)}catch(H){t=H,Le===n&&n!==null&&(Le=n=n.return);continue}break}while(!0)}function ku(){var e=Yl.current;return Yl.current=Bl,e===null?Bl:e}function Aa(){(De===0||De===3||De===2)&&(De=4),$e===null||(Dn&268435455)===0&&(Jl&268435455)===0||yn($e,He)}function to(e,t){var n=ae;ae|=2;var r=ku();($e!==e||He!==t)&&(Kt=null,In(e,t));do try{Fd();break}catch(l){wu(e,l)}while(!0);if(Zo(),ae=n,Yl.current=r,Le!==null)throw Error(i(261));return $e=null,He=0,De}function Fd(){for(;Le!==null;)Su(Le)}function Ad(){for(;Le!==null&&!dc();)Su(Le)}function Su(e){var t=Nu(e.alternate,e,ut);e.memoizedProps=e.pendingProps,t===null?bu(e):Le=t,za.current=null}function bu(e){var t=e;do{var n=t.alternate;if(e=t.return,(t.flags&32768)===0){if(n=Ld(n,t,ut),n!==null){Le=n;return}}else{if(n=Md(n,t),n!==null){n.flags&=32767,Le=n;return}if(e!==null)e.flags|=32768,e.subtreeFlags=0,e.deletions=null;else{De=6,Le=null;return}}if(t=t.sibling,t!==null){Le=t;return}Le=t=e}while(t!==null);De===0&&(De=5)}function $n(e,t,n){var r=de,l=xt.transition;try{xt.transition=null,de=1,Ud(e,t,n,r)}finally{xt.transition=l,de=r}return null}function Ud(e,t,n,r){do ur();while(xn!==null);if((ae&6)!==0)throw Error(i(327));n=e.finishedWork;var l=e.finishedLanes;if(n===null)return null;if(e.finishedWork=null,e.finishedLanes=0,n===e.current)throw Error(i(177));e.callbackNode=null,e.callbackPriority=0;var o=n.lanes|n.childLanes;if(wc(e,o),e===$e&&(Le=$e=null,He=0),(n.subtreeFlags&2064)===0&&(n.flags&2064)===0||ql||(ql=!0,Tu(ol,function(){return ur(),null})),o=(n.flags&15990)!==0,(n.subtreeFlags&15990)!==0||o){o=xt.transition,xt.transition=null;var a=de;de=1;var c=ae;ae|=4,za.current=null,Dd(e,n),gu(n,e),id(Ao),pl=!!Fo,Ao=Fo=null,e.current=n,Od(n),pc(),ae=c,de=a,xt.transition=o}else e.current=n;if(ql&&(ql=!1,xn=e,Xl=l),o=e.pendingLanes,o===0&&(hn=null),mc(n.stateNode),tt(e,Ne()),t!==null)for(r=e.onRecoverableError,n=0;n<t.length;n++)l=t[n],r(l.value,{componentStack:l.stack,digest:l.digest});if(Gl)throw Gl=!1,e=Ra,Ra=null,e;return(Xl&1)!==0&&e.tag!==0&&ur(),o=e.pendingLanes,(o&1)!==0?e===Da?Jr++:(Jr=0,Da=e):Jr=0,pn(),null}function ur(){if(xn!==null){var e=pi(Xl),t=xt.transition,n=de;try{if(xt.transition=null,de=16>e?16:e,xn===null)var r=!1;else{if(e=xn,xn=null,Xl=0,(ae&6)!==0)throw Error(i(331));var l=ae;for(ae|=4,$=e.current;$!==null;){var o=$,a=o.child;if(($.flags&16)!==0){var c=o.deletions;if(c!==null){for(var d=0;d<c.length;d++){var _=c[d];for($=_;$!==null;){var N=$;switch(N.tag){case 0:case 11:case 15:Qr(8,N,o)}var j=N.child;if(j!==null)j.return=N,$=j;else for(;$!==null;){N=$;var E=N.sibling,O=N.return;if(uu(N),N===_){$=null;break}if(E!==null){E.return=O,$=E;break}$=O}}}var U=o.alternate;if(U!==null){var B=U.child;if(B!==null){U.child=null;do{var Te=B.sibling;B.sibling=null,B=Te}while(B!==null)}}$=o}}if((o.subtreeFlags&2064)!==0&&a!==null)a.return=o,$=a;else e:for(;$!==null;){if(o=$,(o.flags&2048)!==0)switch(o.tag){case 0:case 11:case 15:Qr(9,o,o.return)}var x=o.sibling;if(x!==null){x.return=o.return,$=x;break e}$=o.return}}var f=e.current;for($=f;$!==null;){a=$;var v=a.child;if((a.subtreeFlags&2064)!==0&&v!==null)v.return=a,$=v;else e:for(a=f;$!==null;){if(c=$,(c.flags&2048)!==0)try{switch(c.tag){case 0:case 11:case 15:Kl(9,c)}}catch(H){Ee(c,c.return,H)}if(c===a){$=null;break e}var P=c.sibling;if(P!==null){P.return=c.return,$=P;break e}$=c.return}}if(ae=l,pn(),Mt&&typeof Mt.onPostCommitFiberRoot=="function")try{Mt.onPostCommitFiberRoot(al,e)}catch{}r=!0}return r}finally{de=n,xt.transition=t}}return!1}function Eu(e,t,n){t=or(n,t),t=Hs(e,t,1),e=gn(e,t,1),t=Ge(),e!==null&&(yr(e,1,t),tt(e,t))}function Ee(e,t,n){if(e.tag===3)Eu(e,e,n);else for(;t!==null;){if(t.tag===3){Eu(t,e,n);break}else if(t.tag===1){var r=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof r.componentDidCatch=="function"&&(hn===null||!hn.has(r))){e=or(n,e),e=Vs(t,e,1),t=gn(t,e,1),e=Ge(),t!==null&&(yr(t,1,e),tt(t,e));break}}t=t.return}}function Bd(e,t,n){var r=e.pingCache;r!==null&&r.delete(t),t=Ge(),e.pingedLanes|=e.suspendedLanes&n,$e===e&&(He&n)===n&&(De===4||De===3&&(He&130023424)===He&&500>Ne()-Ma?In(e,0):La|=n),tt(e,t)}function Cu(e,t){t===0&&((e.mode&1)===0?t=1:(t=sl,sl<<=1,(sl&130023424)===0&&(sl=4194304)));var n=Ge();e=Vt(e,t),e!==null&&(yr(e,t,n),tt(e,n))}function Hd(e){var t=e.memoizedState,n=0;t!==null&&(n=t.retryLane),Cu(e,n)}function Vd(e,t){var n=0;switch(e.tag){case 13:var r=e.stateNode,l=e.memoizedState;l!==null&&(n=l.retryLane);break;case 19:r=e.stateNode;break;default:throw Error(i(314))}r!==null&&r.delete(t),Cu(e,n)}var Nu;Nu=function(e,t,n){if(e!==null)if(e.memoizedProps!==t.pendingProps||qe.current)Ze=!0;else{if((e.lanes&n)===0&&(t.flags&128)===0)return Ze=!1,zd(e,t,n);Ze=(e.flags&131072)!==0}else Ze=!1,ke&&(t.flags&1048576)!==0&&as(t,Pl,t.index);switch(t.lanes=0,t.tag){case 2:var r=t.type;Wl(e,t),e=t.pendingProps;var l=qn(t,Ve.current);rr(t,n),l=ca(null,t,r,e,l,n);var o=da();return t.flags|=1,typeof l=="object"&&l!==null&&typeof l.render=="function"&&l.$$typeof===void 0?(t.tag=1,t.memoizedState=null,t.updateQueue=null,Xe(r)?(o=!0,Nl(t)):o=!1,t.memoizedState=l.state!==null&&l.state!==void 0?l.state:null,ra(t),l.updater=Hl,t.stateNode=l,l._reactInternals=t,xa(t,r,e,n),t=wa(null,t,r,!0,o,n)):(t.tag=0,ke&&o&&Ko(t),Je(null,t,l,n),t=t.child),t;case 16:r=t.elementType;e:{switch(Wl(e,t),e=t.pendingProps,l=r._init,r=l(r._payload),t.type=r,l=t.tag=Qd(r),e=Ct(r,e),l){case 0:t=_a(null,t,r,e,n);break e;case 1:t=Zs(null,t,r,e,n);break e;case 11:t=Ys(null,t,r,e,n);break e;case 14:t=Js(null,t,r,Ct(r.type,e),n);break e}throw Error(i(306,r,""))}return t;case 0:return r=t.type,l=t.pendingProps,l=t.elementType===r?l:Ct(r,l),_a(e,t,r,l,n);case 1:return r=t.type,l=t.pendingProps,l=t.elementType===r?l:Ct(r,l),Zs(e,t,r,l,n);case 3:e:{if(eu(t),e===null)throw Error(i(387));r=t.pendingProps,o=t.memoizedState,l=o.element,ms(e,t),Ol(t,r,null,n);var a=t.memoizedState;if(r=a.element,o.isDehydrated)if(o={element:r,isDehydrated:!1,cache:a.cache,pendingSuspenseBoundaries:a.pendingSuspenseBoundaries,transitions:a.transitions},t.updateQueue.baseState=o,t.memoizedState=o,t.flags&256){l=or(Error(i(423)),t),t=tu(e,t,r,n,l);break e}else if(r!==l){l=or(Error(i(424)),t),t=tu(e,t,r,n,l);break e}else for(st=un(t.stateNode.containerInfo.firstChild),it=t,ke=!0,Et=null,n=fs(t,null,r,n),t.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(er(),r===l){t=Qt(e,t,n);break e}Je(e,t,r,n)}t=t.child}return t;case 5:return vs(t),e===null&&Go(t),r=t.type,l=t.pendingProps,o=e!==null?e.memoizedProps:null,a=l.children,Uo(r,l)?a=null:o!==null&&Uo(r,o)&&(t.flags|=32),Xs(e,t),Je(e,t,a,n),t.child;case 6:return e===null&&Go(t),null;case 13:return nu(e,t,n);case 4:return la(t,t.stateNode.containerInfo),r=t.pendingProps,e===null?t.child=tr(t,null,r,n):Je(e,t,r,n),t.child;case 11:return r=t.type,l=t.pendingProps,l=t.elementType===r?l:Ct(r,l),Ys(e,t,r,l,n);case 7:return Je(e,t,t.pendingProps,n),t.child;case 8:return Je(e,t,t.pendingProps.children,n),t.child;case 12:return Je(e,t,t.pendingProps.children,n),t.child;case 10:e:{if(r=t.type._context,l=t.pendingProps,o=t.memoizedProps,a=l.value,xe(Ml,r._currentValue),r._currentValue=a,o!==null)if(bt(o.value,a)){if(o.children===l.children&&!qe.current){t=Qt(e,t,n);break e}}else for(o=t.child,o!==null&&(o.return=t);o!==null;){var c=o.dependencies;if(c!==null){a=o.child;for(var d=c.firstContext;d!==null;){if(d.context===r){if(o.tag===1){d=Wt(-1,n&-n),d.tag=2;var _=o.updateQueue;if(_!==null){_=_.shared;var N=_.pending;N===null?d.next=d:(d.next=N.next,N.next=d),_.pending=d}}o.lanes|=n,d=o.alternate,d!==null&&(d.lanes|=n),ta(o.return,n,t),c.lanes|=n;break}d=d.next}}else if(o.tag===10)a=o.type===t.type?null:o.child;else if(o.tag===18){if(a=o.return,a===null)throw Error(i(341));a.lanes|=n,c=a.alternate,c!==null&&(c.lanes|=n),ta(a,n,t),a=o.sibling}else a=o.child;if(a!==null)a.return=o;else for(a=o;a!==null;){if(a===t){a=null;break}if(o=a.sibling,o!==null){o.return=a.return,a=o;break}a=a.return}o=a}Je(e,t,l.children,n),t=t.child}return t;case 9:return l=t.type,r=t.pendingProps.children,rr(t,n),l=mt(l),r=r(l),t.flags|=1,Je(e,t,r,n),t.child;case 14:return r=t.type,l=Ct(r,t.pendingProps),l=Ct(r.type,l),Js(e,t,r,l,n);case 15:return Gs(e,t,t.type,t.pendingProps,n);case 17:return r=t.type,l=t.pendingProps,l=t.elementType===r?l:Ct(r,l),Wl(e,t),t.tag=1,Xe(r)?(e=!0,Nl(t)):e=!1,rr(t,n),Us(t,r,l),xa(t,r,l,n),wa(null,t,r,!0,e,n);case 19:return lu(e,t,n);case 22:return qs(e,t,n)}throw Error(i(156,t.tag))};function Tu(e,t){return ii(e,t)}function Wd(e,t,n,r){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=r,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function vt(e,t,n,r){return new Wd(e,t,n,r)}function Ua(e){return e=e.prototype,!(!e||!e.isReactComponent)}function Qd(e){if(typeof e=="function")return Ua(e)?1:0;if(e!=null){if(e=e.$$typeof,e===rt)return 11;if(e===dt)return 14}return 2}function _n(e,t){var n=e.alternate;return n===null?(n=vt(e.tag,t,e.key,e.mode),n.elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=e.flags&14680064,n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n}function no(e,t,n,r,l,o){var a=2;if(r=e,typeof e=="function")Ua(e)&&(a=1);else if(typeof e=="string")a=5;else e:switch(e){case Pe:return Fn(n.children,l,o,t);case Oe:a=8,l|=8;break;case _t:return e=vt(12,n,t,l|2),e.elementType=_t,e.lanes=o,e;case Ye:return e=vt(13,n,t,l),e.elementType=Ye,e.lanes=o,e;case lt:return e=vt(19,n,t,l),e.elementType=lt,e.lanes=o,e;case ve:return ro(n,l,o,t);default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case ct:a=10;break e;case Pt:a=9;break e;case rt:a=11;break e;case dt:a=14;break e;case Ae:a=16,r=null;break e}throw Error(i(130,e==null?e:typeof e,""))}return t=vt(a,n,t,l),t.elementType=e,t.type=r,t.lanes=o,t}function Fn(e,t,n,r){return e=vt(7,e,r,t),e.lanes=n,e}function ro(e,t,n,r){return e=vt(22,e,r,t),e.elementType=ve,e.lanes=n,e.stateNode={isHidden:!1},e}function Ba(e,t,n){return e=vt(6,e,null,t),e.lanes=n,e}function Ha(e,t,n){return t=vt(4,e.children!==null?e.children:[],e.key,t),t.lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}function Kd(e,t,n,r,l){this.tag=t,this.containerInfo=e,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=ho(0),this.expirationTimes=ho(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=ho(0),this.identifierPrefix=r,this.onRecoverableError=l,this.mutableSourceEagerHydrationData=null}function Va(e,t,n,r,l,o,a,c,d){return e=new Kd(e,t,n,c,d),t===1?(t=1,o===!0&&(t|=8)):t=0,o=vt(3,null,null,t),e.current=o,o.stateNode=e,o.memoizedState={element:r,isDehydrated:n,cache:null,transitions:null,pendingSuspenseBoundaries:null},ra(o),e}function Yd(e,t,n){var r=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:ue,key:r==null?null:""+r,children:e,containerInfo:t,implementation:n}}function ju(e){if(!e)return dn;e=e._reactInternals;e:{if(Nn(e)!==e||e.tag!==1)throw Error(i(170));var t=e;do{switch(t.tag){case 3:t=t.stateNode.context;break e;case 1:if(Xe(t.type)){t=t.stateNode.__reactInternalMemoizedMergedChildContext;break e}}t=t.return}while(t!==null);throw Error(i(171))}if(e.tag===1){var n=e.type;if(Xe(n))return rs(e,n,t)}return t}function Pu(e,t,n,r,l,o,a,c,d){return e=Va(n,r,!0,e,l,o,a,c,d),e.context=ju(null),n=e.current,r=Ge(),l=vn(n),o=Wt(r,l),o.callback=t??null,gn(n,o,l),e.current.lanes=l,yr(e,l,r),tt(e,r),e}function lo(e,t,n,r){var l=t.current,o=Ge(),a=vn(l);return n=ju(n),t.context===null?t.context=n:t.pendingContext=n,t=Wt(o,a),t.payload={element:e},r=r===void 0?null:r,r!==null&&(t.callback=r),e=gn(l,t,a),e!==null&&(jt(e,l,a,o),Dl(e,l,a)),a}function oo(e){if(e=e.current,!e.child)return null;switch(e.child.tag){case 5:return e.child.stateNode;default:return e.child.stateNode}}function zu(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var n=e.retryLane;e.retryLane=n!==0&&n<t?n:t}}function Wa(e,t){zu(e,t),(e=e.alternate)&&zu(e,t)}function Jd(){return null}var Lu=typeof reportError=="function"?reportError:function(e){console.error(e)};function Qa(e){this._internalRoot=e}ao.prototype.render=Qa.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(i(409));lo(e,t,null,null)},ao.prototype.unmount=Qa.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;On(function(){lo(null,e,null,null)}),t[At]=null}};function ao(e){this._internalRoot=e}ao.prototype.unstable_scheduleHydration=function(e){if(e){var t=mi();e={blockedOn:null,target:e,priority:t};for(var n=0;n<on.length&&t!==0&&t<on[n].priority;n++);on.splice(n,0,e),n===0&&vi(e)}};function Ka(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function io(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11&&(e.nodeType!==8||e.nodeValue!==" react-mount-point-unstable "))}function Mu(){}function Gd(e,t,n,r,l){if(l){if(typeof r=="function"){var o=r;r=function(){var _=oo(a);o.call(_)}}var a=Pu(t,r,e,0,null,!1,!1,"",Mu);return e._reactRootContainer=a,e[At]=a.current,Mr(e.nodeType===8?e.parentNode:e),On(),a}for(;l=e.lastChild;)e.removeChild(l);if(typeof r=="function"){var c=r;r=function(){var _=oo(d);c.call(_)}}var d=Va(e,0,!1,null,null,!1,!1,"",Mu);return e._reactRootContainer=d,e[At]=d.current,Mr(e.nodeType===8?e.parentNode:e),On(function(){lo(t,d,n,r)}),d}function so(e,t,n,r,l){var o=n._reactRootContainer;if(o){var a=o;if(typeof l=="function"){var c=l;l=function(){var d=oo(a);c.call(d)}}lo(t,a,e,l)}else a=Gd(n,t,e,l,r);return oo(a)}fi=function(e){switch(e.tag){case 3:var t=e.stateNode;if(t.current.memoizedState.isDehydrated){var n=vr(t.pendingLanes);n!==0&&(xo(t,n|1),tt(t,Ne()),(ae&6)===0&&(sr=Ne()+500,pn()))}break;case 13:On(function(){var r=Vt(e,1);if(r!==null){var l=Ge();jt(r,e,1,l)}}),Wa(e,1)}},vo=function(e){if(e.tag===13){var t=Vt(e,134217728);if(t!==null){var n=Ge();jt(t,e,134217728,n)}Wa(e,134217728)}},gi=function(e){if(e.tag===13){var t=vn(e),n=Vt(e,t);if(n!==null){var r=Ge();jt(n,e,t,r)}Wa(e,t)}},mi=function(){return de},hi=function(e,t){var n=de;try{return de=e,t()}finally{de=n}},hr=function(e,t,n){switch(t){case"input":if(ot(e,n),t=n.name,n.type==="radio"&&t!=null){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+t)+'][type="radio"]'),t=0;t<n.length;t++){var r=n[t];if(r!==e&&r.form===e.form){var l=El(r);if(!l)throw Error(i(90));zt(r),ot(r,l)}}}break;case"textarea":qt(e,n);break;case"select":t=n.value,t!=null&&Ue(e,!!n.multiple,t,!1)}},w=$a,A=On;var qd={usingClientEntryPoint:!1,Events:[Or,Jn,El,nl,xr,$a]},Gr={findFiberByHostInstance:Tn,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},Xd={bundleType:Gr.bundleType,version:Gr.version,rendererPackageName:Gr.rendererPackageName,rendererConfig:Gr.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:we.ReactCurrentDispatcher,findHostInstanceByFiber:function(e){return e=oi(e),e===null?null:e.stateNode},findFiberByHostInstance:Gr.findFiberByHostInstance||Jd,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var uo=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!uo.isDisabled&&uo.supportsFiber)try{al=uo.inject(Xd),Mt=uo}catch{}}return nt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=qd,nt.createPortal=function(e,t){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!Ka(t))throw Error(i(200));return Yd(e,t,null,n)},nt.createRoot=function(e,t){if(!Ka(e))throw Error(i(299));var n=!1,r="",l=Lu;return t!=null&&(t.unstable_strictMode===!0&&(n=!0),t.identifierPrefix!==void 0&&(r=t.identifierPrefix),t.onRecoverableError!==void 0&&(l=t.onRecoverableError)),t=Va(e,1,!1,null,null,n,!1,r,l),e[At]=t.current,Mr(e.nodeType===8?e.parentNode:e),new Qa(t)},nt.findDOMNode=function(e){if(e==null)return null;if(e.nodeType===1)return e;var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(i(188)):(e=Object.keys(e).join(","),Error(i(268,e)));return e=oi(t),e=e===null?null:e.stateNode,e},nt.flushSync=function(e){return On(e)},nt.hydrate=function(e,t,n){if(!io(t))throw Error(i(200));return so(null,e,t,!0,n)},nt.hydrateRoot=function(e,t,n){if(!Ka(e))throw Error(i(405));var r=n!=null&&n.hydratedSources||null,l=!1,o="",a=Lu;if(n!=null&&(n.unstable_strictMode===!0&&(l=!0),n.identifierPrefix!==void 0&&(o=n.identifierPrefix),n.onRecoverableError!==void 0&&(a=n.onRecoverableError)),t=Pu(t,null,e,1,n??null,l,!1,o,a),e[At]=t.current,Mr(e),r)for(e=0;e<r.length;e++)n=r[e],l=n._getVersion,l=l(n._source),t.mutableSourceEagerHydrationData==null?t.mutableSourceEagerHydrationData=[n,l]:t.mutableSourceEagerHydrationData.push(n,l);return new ao(t)},nt.render=function(e,t,n){if(!io(t))throw Error(i(200));return so(null,e,t,!1,n)},nt.unmountComponentAtNode=function(e){if(!io(e))throw Error(i(40));return e._reactRootContainer?(On(function(){so(null,null,e,!1,function(){e._reactRootContainer=null,e[At]=null})}),!0):!1},nt.unstable_batchedUpdates=$a,nt.unstable_renderSubtreeIntoContainer=function(e,t,n,r){if(!io(n))throw Error(i(200));if(e==null||e._reactInternals===void 0)throw Error(i(38));return so(e,t,n,!1,r)},nt.version="18.3.1-next-f1338f8080-20240426",nt}var Uu;function ap(){if(Uu)return Ga.exports;Uu=1;function s(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(s)}catch(u){console.error(u)}}return s(),Ga.exports=op(),Ga.exports}var Bu;function ip(){if(Bu)return co;Bu=1;var s=ap();return co.createRoot=s.createRoot,co.hydrateRoot=s.hydrateRoot,co}var sp=ip();function up(){if(typeof window>"u")return!1;const s=window;return!!(s.SpeechRecognition||s.webkitSpeechRecognition)}function cp(){if(typeof window>"u")return null;const s=window;return s.SpeechRecognition??s.webkitSpeechRecognition??null}function dp(s){const u=cp();if(!u)return s.onError("Voice input is not supported in this browser."),null;let i=new u;i.continuous=!0,i.interimResults=!0;try{i.lang=navigator.language||"en-US"}catch{i.lang="en-US"}let y=!1,m="";i.onresult=h=>{var k;let T="",C="";for(let R=h.resultIndex;R<h.results.length;R++){const z=h.results[R],S=((k=z[0])==null?void 0:k.transcript)??"";z.isFinal?C+=S:T+=S}C&&(m=(m+" "+C).trim()),s.onPartial((m+" "+T).trim())},i.onerror=h=>{const T=h.error??"unknown";y||(T==="no-speech"?s.onError("Voice: silence detected. Hold the mic and speak."):T==="not-allowed"||T==="service-not-allowed"?s.onError("Voice: microphone permission denied."):T==="aborted"||s.onError(`Voice error: ${T}`))},i.onend=()=>{y||m&&s.onCommit(m)};try{i.start()}catch(h){return s.onError(h instanceof Error?h.message:"Voice failed to start."),null}return{stop:()=>{try{i==null||i.stop()}catch{}},abort:()=>{y=!0;try{i==null||i.abort()}catch{}i=null}}}function pp(s){const u=[],i=s.split(`
`);let y=0,m=[];function h(){m.length!==0&&(u.push({kind:"prose",body:m.join(`
`)}),m=[])}for(;y<i.length;){const T=i[y],C=T.match(/^```(\w[\w+-]*)?\s*$/);if(C){h();const k=C[1]||null;y++;const R=y;for(;y<i.length&&!i[y].match(/^```\s*$/);)y++;const z=i.slice(R,y).join(`
`);u.push({kind:"code",lang:k,body:z}),y++;continue}m.push(T),y++}return h(),u}const fp=[[/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/,(s,u)=>p.jsx("a",{href:s[2],target:"_blank",rel:"noopener noreferrer",className:"gauntlet-md__link",children:s[1]},`a-${u}`)],[/`([^`]+)`/,(s,u)=>p.jsx("code",{className:"gauntlet-md__inline-code",children:s[1]},`c-${u}`)],[/\*\*([^*]+)\*\*/,(s,u)=>p.jsx("strong",{className:"gauntlet-md__strong",children:s[1]},`b-${u}`)],[/\*([^*]+)\*/,(s,u)=>p.jsx("em",{className:"gauntlet-md__em",children:s[1]},`i-${u}`)],[/_([^_]+)_/,(s,u)=>p.jsx("em",{className:"gauntlet-md__em",children:s[1]},`u-${u}`)]];function Xr(s,u){const i=[];let y=0,m=0;for(;y<s.length;){let h=null;for(const[T,C]of fp){const R=s.slice(y).match(T);!R||R.index===void 0||(h===null||R.index<h.idx)&&(h={idx:R.index,match:R,render:C})}if(h===null){i.push(s.slice(y));break}h.idx>0&&i.push(s.slice(y,y+h.idx)),i.push(h.render(h.match,u*100+m)),m++,y+=h.idx+h.match[0].length}return i}function gp(s,u){const i=[],y=s.split(`
`);let m=0,h=u;for(;m<y.length;){const C=y[m].trim();if(!C){m++;continue}const k=C.match(/^(#{1,3})\s+(.*)$/);if(k){const z=k[1].length,F=`h${z}`;i.push(p.jsx(F,{className:`gauntlet-md__h gauntlet-md__h${z}`,children:Xr(k[2],h++)},`h-${h++}`)),m++;continue}if(/^---+$/.test(C)||/^\*\*\*+$/.test(C)){i.push(p.jsx("hr",{className:"gauntlet-md__hr"},`hr-${h++}`)),m++;continue}if(C.startsWith(">")){const z=[];for(;m<y.length&&y[m].trim().startsWith(">");)z.push(y[m].replace(/^\s*>\s?/,"")),m++;i.push(p.jsx("blockquote",{className:"gauntlet-md__quote",children:Xr(z.join(" "),h++)},`q-${h++}`));continue}if(/^[-*]\s+/.test(C)){const z=[];for(;m<y.length&&/^[-*]\s+/.test(y[m].trim());)z.push(y[m].trim().replace(/^[-*]\s+/,"")),m++;i.push(p.jsx("ul",{className:"gauntlet-md__list",children:z.map((S,F)=>p.jsx("li",{className:"gauntlet-md__li",children:Xr(S,h++)},F))},`ul-${h++}`));continue}if(/^\d+\.\s+/.test(C)){const z=[];for(;m<y.length&&/^\d+\.\s+/.test(y[m].trim());)z.push(y[m].trim().replace(/^\d+\.\s+/,"")),m++;i.push(p.jsx("ol",{className:"gauntlet-md__list",children:z.map((S,F)=>p.jsx("li",{className:"gauntlet-md__li",children:Xr(S,h++)},F))},`ol-${h++}`));continue}const R=[];for(;m<y.length;){const z=y[m],S=z.trim();if(!S||/^(#{1,3})\s+/.test(S)||/^---+$/.test(S)||/^\*\*\*+$/.test(S)||S.startsWith(">")||/^[-*]\s+/.test(S)||/^\d+\.\s+/.test(S))break;R.push(z),m++}i.push(p.jsx("p",{className:"gauntlet-md__p",children:Xr(R.join(" "),h++)},`p-${h++}`))}return i}function mp({source:s,onCopyBlock:u}){const i=pp(s);return p.jsx("div",{className:"gauntlet-md",children:i.map((y,m)=>y.kind==="code"?p.jsx(Ep,{lang:y.lang,body:y.body,onCopy:u},`cb-${m}`):p.jsx("div",{className:"gauntlet-md__prose",children:gp(y.body,m*1e3)},`pb-${m}`))})}const hp=new Set(["def","class","if","elif","else","for","while","return","import","from","as","with","try","except","finally","raise","pass","break","continue","in","is","not","and","or","lambda","yield","async","await","global","nonlocal","True","False","None","self","cls","print"]),xp=new Set(["function","const","let","var","if","else","return","class","export","import","from","as","default","async","await","for","while","try","catch","finally","throw","new","this","super","extends","implements","interface","type","enum","public","private","protected","readonly","static","typeof","instanceof","in","of","null","undefined","true","false","void","switch","case","break","continue","do","yield"]),vp=new Set(["cd","ls","cat","rm","mv","cp","mkdir","touch","grep","sed","awk","export","source","if","then","else","elif","fi","for","while","do","done","case","esac","exit","npm","npx","git","python","node","tsc","make","vite","wxt","set","get","start-process","select-string"]);function Zu(s,u){if(s[u]!=="#")return-1;const i=s.indexOf(`
`,u);return i===-1?s.length:i}function yp(s,u){if(s[u]!=="/")return-1;if(s[u+1]==="/"){const i=s.indexOf(`
`,u);return i===-1?s.length:i}if(s[u+1]==="*"){const i=s.indexOf("*/",u+2);return i===-1?s.length:i+2}return-1}const ec={keywords:hp,matchComment:Zu},_p={keywords:xp,matchComment:yp},wp={keywords:vp,matchComment:Zu};function kp(s){if(!s)return null;const u=s.toLowerCase();return u==="py"||u==="python"||u==="python3"||u==="ipython"||u==="pycon"?ec:u==="ts"||u==="tsx"||u==="typescript"||u==="js"||u==="jsx"||u==="javascript"||u==="mjs"||u==="json"||u==="json5"?_p:u==="sh"||u==="bash"||u==="zsh"||u==="shell"||u==="powershell"||u==="ps"||u==="ps1"||u==="console"?wp:null}function tc(s){return s>="a"&&s<="z"||s>="A"&&s<="Z"||s==="_"||s==="$"}function Sp(s){return tc(s)||s>="0"&&s<="9"}function Za(s){return s>="0"&&s<="9"}function bp(s,u){const i=[];let y="";function m(){y&&(i.push({kind:"p",text:y}),y="")}let h=0;for(;h<s.length;){const T=s[h],C=u.matchComment(s,h);if(C!==-1){m(),i.push({kind:"c",text:s.slice(h,C)}),h=C;continue}if(u===ec&&(s.startsWith('"""',h)||s.startsWith("'''",h))){m();const k=s.slice(h,h+3);let R=s.indexOf(k,h+3);R=R===-1?s.length:R+3,i.push({kind:"s",text:s.slice(h,R)}),h=R;continue}if(T==='"'||T==="'"||T==="`"){m();let k=h+1;for(;k<s.length&&s[k]!==T;){if(s[k]==="\\"){k+=2;continue}if(s[k]===`
`&&T!=="`")break;k++}const R=k<s.length?k+1:k;i.push({kind:"s",text:s.slice(h,R)}),h=R;continue}if(Za(T)){m();let k=h;for(;k<s.length&&(Za(s[k])||s[k]==="."||s[k]==="_");)k++;if(k<s.length&&(s[k]==="e"||s[k]==="E"))for(k++,k<s.length&&(s[k]==="+"||s[k]==="-")&&k++;k<s.length&&Za(s[k]);)k++;i.push({kind:"n",text:s.slice(h,k)}),h=k;continue}if(tc(T)){m();let k=h+1;for(;k<s.length&&Sp(s[k]);)k++;const R=s.slice(h,k);let z=k;for(;z<s.length&&s[z]===" ";)z++;const S=s[z]==="(";let F="p";u.keywords.has(R)?F="k":S&&(F="f"),i.push({kind:F,text:R}),h=k;continue}y+=T,h++}return m(),i}function Ep({lang:s,body:u,onCopy:i}){const y=()=>{navigator.clipboard.writeText(u).catch(()=>{}),i==null||i(u)},m=kp(s),h=m?bp(u,m):null;return p.jsxs("figure",{className:"gauntlet-md__code",children:[p.jsxs("header",{className:"gauntlet-md__code-meta",children:[p.jsx("span",{className:"gauntlet-md__code-lang",children:s??"code"}),p.jsx("button",{type:"button",className:"gauntlet-md__code-copy",onClick:y,"aria-label":"copy code",children:"copy"})]}),p.jsx("pre",{className:"gauntlet-md__code-body",children:h?p.jsx("code",{children:h.map((T,C)=>p.jsx("span",{className:`gauntlet-md__tok gauntlet-md__tok--${T.kind}`,children:T.text},C))}):p.jsx("code",{children:u})})]})}const Cp={domains:{},actions:{},default_domain_policy:{allowed:!0,require_danger_ack:!1},default_action_policy:{allowed:!0,require_danger_ack:!1},tool_policies:{},max_page_text_chars:6e3,max_dom_skeleton_chars:4e3,screenshot_default:!1,execution_reporting_required:!1,updated_at:""},Np="2px solid #d07a5a",Tp="2px",jp="#gauntlet-capsule-host",Pp=[/\bpassword\b/i,/\bdelete\b/i,/\bdestroy\b/i,/\bremove\b/i,/\bunsubscribe\b/i,/payment|checkout|billing/i,/credit[-_ ]?card|\bccnum\b|\bcvv\b|\bcvc\b/i],zp=["delete","remove","destroy","drop","discard","apagar","eliminar","remover","destruir","pay","buy","purchase","order","checkout","pagar","comprar","encomendar","confirm","submit","send","publish","enviar","confirmar","publicar","transfer","withdraw","transferir","levantar","cancel subscription","cancelar subscrição","cancelar assinatura"],Lp=5e3;function Mp(s){const u=s.filter(h=>h.type==="fill"),i=s.filter(h=>h.type==="click");if(u.length===0||i.length===0)return{danger:!1};const y=u.find(h=>{const T=h.selector.toLowerCase();return!!(/\bpassword\b/.test(T)||/\bcvv\b|\bcvc\b|\bccnum\b|credit[-_ ]?card/.test(T)||/payment|checkout|billing/.test(T)||/cc-(number|exp|csc|name)/.test(T))});if(!y)return{danger:!1};const m=i.find(h=>{const T=h.selector.toLowerCase();return!!(T.includes("submit")||/\b(pay|buy|purchase|confirm|send|order|checkout|pagar|comprar|enviar|confirmar)\b/.test(T))});return m?{danger:!0,reason:`cadeia destrutiva: fill em "${y.selector}" seguido de click em "${m.selector}"`}:{danger:!1}}function Rp(s){var y;if(s.type==="highlight"||s.type==="scroll_to")return{danger:!1};const u=s.selector;for(const m of Pp)if(m.test(u))return{danger:!0,reason:`selector matches /${m.source}/`};let i=null;try{i=document.querySelector(u)}catch{}if(s.type==="fill")return i instanceof HTMLInputElement&&i.type==="password"?{danger:!0,reason:"password field"}:i instanceof HTMLInputElement&&(((y=i.autocomplete)==null?void 0:y.includes("cc-"))??!1)?{danger:!0,reason:"credit-card autocomplete"}:s.value.length>Lp?{danger:!0,reason:"unusually long value"}:{danger:!1};if(s.type==="click"){if(i instanceof HTMLButtonElement&&i.type==="submit")return{danger:!0,reason:"submit button"};if(i instanceof HTMLInputElement&&(i.type==="submit"||i.type==="reset"))return{danger:!0,reason:`${i.type} button`};if(i instanceof HTMLElement){const m=(i.innerText??"").trim().toLowerCase();if(m){for(const h of zp)if(m===h||m.startsWith(h+" ")||m.endsWith(" "+h)||m.includes(" "+h+" "))return{danger:!0,reason:`action label: "${h}"`}}}return{danger:!1}}return{danger:!1}}async function Dp(s){const u=[];for(const i of s)try{Op(i),await Ip(i),u.push({action:i,ok:!0})}catch(y){u.push({action:i,ok:!1,error:y instanceof Error?y.message:String(y)})}return u}function Op(s){const u=s.selector;if(!u||typeof u!="string")throw new Error("selector missing or not a string");if(u.includes(jp))throw new Error(`selector targets the Gauntlet capsule itself: ${u}`);try{document.querySelector(u)}catch{throw new Error(`selector is not valid CSS: ${u}`)}}async function Ip(s){if(s.type==="fill"){$p(s.selector,s.value);return}if(s.type==="click"){Fp(s.selector);return}if(s.type==="highlight"){Ap(s.selector,s.duration_ms??1500);return}if(s.type==="scroll_to"){Up(s.selector);return}throw new Error(`unknown action type: ${s.type??"<missing>"}`)}function $p(s,u){var y,m;const i=document.querySelector(s);if(!i)throw new Error(`selector not found: ${s}`);if(i instanceof HTMLInputElement||i instanceof HTMLTextAreaElement){i.focus({preventScroll:!0});const h=i instanceof HTMLInputElement?HTMLInputElement.prototype:HTMLTextAreaElement.prototype,T=(y=Object.getOwnPropertyDescriptor(h,"value"))==null?void 0:y.set;T?T.call(i,u):i.value=u,i.dispatchEvent(new Event("input",{bubbles:!0})),i.dispatchEvent(new Event("change",{bubbles:!0})),i.dispatchEvent(new Event("blur",{bubbles:!0}));return}if(i instanceof HTMLSelectElement){i.focus({preventScroll:!0});const h=(m=Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,"value"))==null?void 0:m.set;h?h.call(i,u):i.value=u,i.dispatchEvent(new Event("input",{bubbles:!0})),i.dispatchEvent(new Event("change",{bubbles:!0})),i.dispatchEvent(new Event("blur",{bubbles:!0}));return}if(i instanceof HTMLElement&&i.isContentEditable){i.focus(),i.textContent=u,i.dispatchEvent(new InputEvent("input",{bubbles:!0}));return}throw new Error(`element at ${s} is not fillable`)}function Fp(s){const u=document.querySelector(s);if(!u)throw new Error(`selector not found: ${s}`);if(!(u instanceof HTMLElement))throw new Error(`element at ${s} is not clickable`);const i=u.getBoundingClientRect(),y=i.left+i.width/2,m=i.top+i.height/2,h={bubbles:!0,cancelable:!0,view:window,clientX:y,clientY:m,button:0,buttons:1},T={...h,pointerId:1,pointerType:"mouse",isPrimary:!0};u.dispatchEvent(new PointerEvent("pointerdown",T)),u.dispatchEvent(new MouseEvent("mousedown",h)),u.focus({preventScroll:!0}),u.dispatchEvent(new PointerEvent("pointerup",T)),u.dispatchEvent(new MouseEvent("mouseup",h)),u.click()}function Ap(s,u){const i=document.querySelectorAll(s);if(i.length===0)throw new Error(`selector not found: ${s}`);for(const y of Array.from(i)){if(!(y instanceof HTMLElement))continue;const m=y.style.outline,h=y.style.outlineOffset;y.style.outline=Np,y.style.outlineOffset=Tp,window.setTimeout(()=>{y.style.outline=m,y.style.outlineOffset=h},u)}}function Up(s){const u=document.querySelector(s);if(!u)throw new Error(`selector not found: ${s}`);if(!(u instanceof HTMLElement))throw new Error(`element at ${s} cannot be scrolled to`);u.scrollIntoView({behavior:"smooth",block:"center"})}const ei={},Bp="https://ruberra-backend-jkpf-production.up.railway.app",Hp=typeof import.meta<"u"?ei==null?void 0:ei.VITE_BACKEND_URL:void 0,Vp=(Hp??Bp).replace(/\/+$/,"");class Wp{constructor(u,i={}){this.ambient=u,this.backendUrl=(i.backendUrl??Vp).replace(/\/+$/,"")}captureContext(u,i){return this.ambient.transport.fetchJson("POST",`${this.backendUrl}/composer/context`,u,i)}detectIntent(u,i,y){return this.ambient.transport.fetchJson("POST",`${this.backendUrl}/composer/intent`,{context_id:u,user_input:i},y)}generatePreview(u,i){return this.ambient.transport.fetchJson("POST",`${this.backendUrl}/composer/preview`,{intent_id:u},i)}applyPreview(u,i,y,m){return this.ambient.transport.fetchJson("POST",`${this.backendUrl}/composer/apply`,{preview_id:u,approved:i,approval_reason:y??null},m)}async getToolManifests(u){return(await this.ambient.transport.fetchJson("GET",`${this.backendUrl}/tools/manifests`,void 0,u)).tools??[]}getSettings(u){return this.ambient.transport.fetchJson("GET",`${this.backendUrl}/composer/settings`,void 0,u)}updateSettings(u,i){return this.ambient.transport.fetchJson("PUT",`${this.backendUrl}/composer/settings`,u,i)}reportExecution(u,i){return this.ambient.transport.fetchJson("POST",`${this.backendUrl}/composer/execution`,u,i)}requestDomPlan(u,i,y){return this.ambient.transport.fetchJson("POST",`${this.backendUrl}/composer/dom_plan`,{context_id:u,user_input:i},y)}requestDomPlanStream(u,i,y){return this.ambient.transport.stream?this.ambient.transport.stream(`${this.backendUrl}/composer/dom_plan_stream`,{context_id:u,user_input:i},y):(y.onError("streaming not supported by this ambient"),()=>{})}}const Hu="gauntlet:pill_position",ti="gauntlet:dismissed_domains",Vu="gauntlet:screenshot_enabled",Wu="gauntlet:theme",Qu="gauntlet:palette_recent",Ku="gauntlet:pill_mode",Yu="gauntlet:tts_enabled",Ju=8,nc="light",Qp="corner",Kp={bottom:16,right:16};function Gu(s){const u=typeof window<"u"?window.innerWidth:1280,i=typeof window<"u"?window.innerHeight:800,y=4,m=u-y,h=i-y;return{right:Math.max(-14,Math.min(m,s.right)),bottom:Math.max(-14,Math.min(h,s.bottom))}}function Yp(s){return{async readPillPosition(){const u=await s.get(Hu);return u&&typeof u=="object"&&typeof u.bottom=="number"&&typeof u.right=="number"?Gu(u):Kp},async writePillPosition(u){await s.set(Hu,Gu(u))},async readDismissedDomains(){const u=await s.get(ti);return Array.isArray(u)?u.filter(i=>typeof i=="string"):[]},async dismissDomain(u){if(!u)return;const i=await this.readDismissedDomains();i.includes(u)||await s.set(ti,[...i,u])},async restoreDomain(u){if(!u)return;const i=await this.readDismissedDomains(),y=i.filter(m=>m!==u);y.length!==i.length&&await s.set(ti,y)},async isDomainDismissed(u){return u?(await this.readDismissedDomains()).includes(u):!1},async readScreenshotEnabled(){return await s.get(Vu)===!0},async writeScreenshotEnabled(u){await s.set(Vu,!!u)},async readTheme(){const u=await s.get(Wu);return u==="dark"||u==="light"?u:nc},async writeTheme(u){await s.set(Wu,u)},async readPaletteRecent(){const u=await s.get(Qu);return Array.isArray(u)?u.filter(i=>typeof i=="string").slice(0,Ju):[]},async notePaletteUse(u){if(!u)return;const i=await this.readPaletteRecent(),y=[u,...i.filter(m=>m!==u)].slice(0,Ju);await s.set(Qu,y)},async readPillMode(){const u=await s.get(Ku);return u==="cursor"||u==="corner"?u:Qp},async writePillMode(u){await s.set(Ku,u)},async readTtsEnabled(){return await s.get(Yu)===!0},async writeTtsEnabled(u){await s.set(Yu,!!u)}}}function Jp({ambient:s,initialSnapshot:u,onDismiss:i,cursorAnchor:y}){var xr;const m=L.useMemo(()=>new Wp(s),[s]),h=L.useMemo(()=>Yp(s.storage),[s]),T=(xr=s.domActions)==null?void 0:xr.execute,[C,k]=L.useState(u),[R,z]=L.useState(""),[S,F]=L.useState("idle"),[ce,ne]=L.useState(null),[Z,re]=L.useState(!1),[M,Me]=L.useState(null),[je,we]=L.useState(null),[K,ue]=L.useState(!1),[Pe,Oe]=L.useState(""),[_t,ct]=L.useState(!1),[Pt,rt]=L.useState(nc),[Ye,lt]=L.useState([]),[dt,Ae]=L.useState([]),[ve,D]=L.useState(0),[Q,I]=L.useState(!1),g=L.useRef(!1),b=L.useRef(null),[G,X]=L.useState(!1),le=L.useRef(""),[oe,pe]=L.useState(null),[q,he]=L.useState(Cp),ze=L.useRef(null),Yt=L.useRef(null),zt=L.useRef(null),wt=L.useRef(""),Jt=L.useRef(!1),[Zr,cr]=L.useState(0),ot=L.useRef(null),[Sn,Gt]=L.useState(!1),[$t,Ue]=L.useState(!1),[bn,dr]=L.useState(null),qt=L.useMemo(()=>M?M.actions.map(Rp):[],[M]),Ft=L.useMemo(()=>M?Mp(M.actions):{danger:!1},[M]),En=L.useMemo(()=>{if(!M||M.actions.length===0)return{forced:!1,reason:null};let w="";try{w=new URL(C.url).hostname.toLowerCase()}catch{}if((q.domains[w]??q.default_domain_policy).require_danger_ack)return{forced:!0,reason:w?`policy: domain '${w}' requires explicit confirmation`:"policy: default domain policy requires explicit confirmation"};for(const J of M.actions)if((q.actions[J.type]??q.default_action_policy).require_danger_ack)return{forced:!0,reason:`policy: action type '${J.type}' requires explicit confirmation`};return{forced:!1,reason:null}},[M,C.url,q]),pt=qt.some(w=>w.danger)||Ft.danger||En.forced;L.useEffect(()=>{var w;return(w=ze.current)==null||w.focus(),()=>{var A,J;(A=Yt.current)==null||A.abort(),(J=zt.current)==null||J.call(zt)}},[]),L.useEffect(()=>{k(u)},[u]),L.useEffect(()=>{let w=!1;return m.getToolManifests().then(A=>{w||lt(A)}).catch(()=>{}),h.readPaletteRecent().then(A=>{w||Ae(A)}),()=>{w=!0}},[m,h]),L.useEffect(()=>{const w=!!C.text;w&&!g.current&&(I(!0),b.current!==null&&window.clearTimeout(b.current),b.current=window.setTimeout(()=>{I(!1),b.current=null},700)),g.current=w},[C.text]),L.useEffect(()=>()=>{b.current!==null&&(window.clearTimeout(b.current),b.current=null)},[]),L.useEffect(()=>{let w=!1;h.readTtsEnabled().then(J=>{w||X(J)});function A(J){const ge=J.detail;typeof(ge==null?void 0:ge.enabled)=="boolean"&&X(ge.enabled)}return window.addEventListener("gauntlet:tts",A),()=>{w=!0,window.removeEventListener("gauntlet:tts",A)}},[h]),L.useEffect(()=>{if(!G||S!=="plan_ready")return;const w=M==null?void 0:M.compose;if(w&&w!==le.current&&!(typeof window>"u"||!window.speechSynthesis))try{window.speechSynthesis.cancel();const A=new SpeechSynthesisUtterance(w);A.rate=1.05,A.pitch=1,window.speechSynthesis.speak(A),le.current=w}catch{}},[G,S,M==null?void 0:M.compose]),L.useEffect(()=>()=>{var w;try{(w=window.speechSynthesis)==null||w.cancel()}catch{}},[]),L.useEffect(()=>{let w=!1;return h.readTheme().then(A=>{w||rt(A)}),()=>{w=!0}},[h]),L.useEffect(()=>{let w=!1;return m.getSettings().then(A=>{w||he(A)}).catch(()=>{}),()=>{w=!0}},[m]),L.useEffect(()=>{if(!s.capabilities.screenshot||!s.screenshot)return;let w=!1;return h.readScreenshotEnabled().then(A=>{const J=A||q.screenshot_default;w||!J||s.screenshot.capture().then(ge=>{w||!ge||pe(ge)}).catch(()=>{})}),()=>{w=!0}},[s,h,q.screenshot_default]);const Cn=L.useCallback(()=>{k(s.selection.read())},[s]),el=L.useCallback(()=>{if(ot.current)return;ne(null);const w=R,A=dp({onPartial:J=>{z(w?`${w} ${J}`.trim():J)},onCommit:J=>{var ge;z(w?`${w} ${J}`.trim():J),Gt(!1),ot.current=null,(ge=ze.current)==null||ge.focus()},onError:J=>{ne(J),Gt(!1),ot.current=null}});A&&(ot.current=A,Gt(!0))},[R]),Xt=L.useCallback(()=>{var w;(w=ot.current)==null||w.stop()},[]),Zt=L.useCallback(()=>{var w;(w=ot.current)==null||w.abort(),ot.current=null,Gt(!1)},[]);L.useEffect(()=>()=>{var w;(w=ot.current)==null||w.abort()},[]),L.useEffect(()=>{function w(A){(A.metaKey||A.ctrlKey)&&(A.key==="k"||A.key==="K")&&(A.preventDefault(),A.stopPropagation(),Ue(ge=>!ge))}return window.addEventListener("keydown",w,!0),()=>window.removeEventListener("keydown",w,!0)},[]);const pr=L.useCallback(w=>{dr(w),window.setTimeout(()=>dr(null),1400)},[]),fr=L.useCallback(async()=>{const w=(M==null?void 0:M.compose)||C.text||R.trim();if(!w){ne("Nada para guardar — escreve um pedido ou recebe uma resposta.");return}const A=(R.trim()||C.pageTitle||"cápsula note").slice(0,200);try{await s.transport.fetchJson("POST",`${m.backendUrl}/memory/records`,{topic:A,body:w,kind:"note",scope:"user"}),pr("saved")}catch(J){ne(J instanceof Error?`memória: ${J.message}`:"memória: falhou")}},[s,m,M,C,R,pr]),Lt=L.useCallback(async(w,A=[],J)=>{if(!M||M.actions.length===0)return;Jt.current=!0;const ge=M.actions.map((ee,ie)=>{const me=A[ie],fe=qt[ie];return{action:ee,ok:me?me.ok:!1,error:(me==null?void 0:me.error)??null,danger:(fe==null?void 0:fe.danger)??!1,danger_reason:(fe==null?void 0:fe.reason)??null}}),Ce={plan_id:M.plan_id||null,context_id:M.context_id||null,url:C.url||null,page_title:C.pageTitle||null,status:w,results:ge,has_danger:pt,sequence_danger_reason:Ft.danger?Ft.reason??null:null,danger_acknowledged:K,error:J??null,model_used:M.model_used||null,plan_latency_ms:M.latency_ms||null,user_input:R.trim()||null};if(q.execution_reporting_required)try{await m.reportExecution(Ce)}catch(ee){const ie=ee instanceof Error?ee.message:String(ee);ne(`policy: execution report rejected — ${ie}`),F("error")}else m.reportExecution(Ce).catch(()=>{})},[m,M,C,qt,pt,Ft,K,R,q.execution_reporting_required]),An=L.useCallback(()=>{M&&M.actions.length>0&&!Jt.current&&Lt("rejected"),i()},[M,i,Lt]);L.useEffect(()=>{function w(A){if(A.key==="Escape"){if(A.preventDefault(),A.stopPropagation(),$t){Ue(!1);return}if(ot.current){Zt();return}An()}}return window.addEventListener("keydown",w,!0),()=>window.removeEventListener("keydown",w,!0)},[An,$t,Zt]);const en=L.useCallback(async()=>{var ge,Ce;if(!R.trim()||S==="planning"||S==="streaming"||S==="executing")return;M&&M.actions.length>0&&!Jt.current&&Lt("rejected"),(ge=Yt.current)==null||ge.abort(),(Ce=zt.current)==null||Ce.call(zt);const w=new AbortController;Yt.current=w,F("planning"),ne(null),Me(null),we(null),ue(!1),re(!1),Oe(""),cr(0),wt.current="",Jt.current=!1;const A=await h.readScreenshotEnabled(),J=tf(C,A?oe:null);try{const ee=await m.captureContext(J,w.signal);if(w.signal.aborted)return;zt.current=m.requestDomPlanStream(ee.context_id,R.trim(),{onDelta:ie=>{if(w.signal.aborted)return;wt.current+=ie,cr(fe=>fe+1);const me=ef(wt.current);me!==null?(Oe(me),F(fe=>fe==="planning"?"streaming":fe)):F(fe=>fe==="planning"?"streaming":fe)},onDone:ie=>{w.signal.aborted||(Me(ie),F("plan_ready"),Oe(""),wt.current="")},onError:ie=>{w.signal.aborted||(async()=>{try{const me=await m.requestDomPlan(ee.context_id,R.trim(),w.signal);if(w.signal.aborted)return;Me(me),F("plan_ready"),Oe(""),wt.current=""}catch(me){if(w.signal.aborted)return;const fe=me instanceof Error?me.message:String(me);ne(`stream: ${ie} · fallback: ${fe}`),F("error"),Oe(""),wt.current=""}})()}})}catch(ee){if(w.signal.aborted)return;ne(ee instanceof Error?ee.message:String(ee)),F("error")}},[m,C,oe,R,S,M,Lt]),gr=L.useCallback(w=>{var A;w.preventDefault(),D(J=>J+1);try{(A=window.speechSynthesis)==null||A.cancel()}catch{}le.current="",en()},[en]),mr=L.useCallback(w=>{w.key==="Enter"&&(w.shiftKey||(w.preventDefault(),en()))},[en]),Un=L.useCallback(async()=>{if(M!=null&&M.compose)try{await navigator.clipboard.writeText(M.compose),re(!0),window.setTimeout(()=>re(!1),1500)}catch{ne("Clipboard write blocked. Select the text and copy manually.")}},[M]),hr=L.useCallback(async()=>{if(!(!T||!M||M.actions.length===0)&&!(pt&&!K)){F("executing"),ne(null);try{const w=await T(M.actions);we(w),F("executed");const A=w.every(J=>J.ok);window.dispatchEvent(new CustomEvent("gauntlet:execute-result",{detail:{ok:A}})),await Lt("executed",w)}catch(w){const A=w instanceof Error?w.message:String(w);ne(A),F("error"),window.dispatchEvent(new CustomEvent("gauntlet:execute-result",{detail:{ok:!1}})),await Lt("failed",[],A)}}},[T,M,pt,K,Lt]),kt=L.useMemo(()=>C.bbox?C.bbox:y?{x:y.x,y:y.y,width:0,height:0}:null,[C.bbox,y]),tn=L.useMemo(()=>{if(!kt)return;const w=typeof window<"u"?window.innerWidth:1280,A=typeof window<"u"?window.innerHeight:800,J=rf(w,A),ge=lf(kt,{width:w,height:A},J);return{top:`${ge.top}px`,left:`${ge.left}px`}},[kt]),tl=`gauntlet-capsule--phase-${S}`,nl=["gauntlet-capsule","gauntlet-capsule--floating",kt?"gauntlet-capsule--anchored":"gauntlet-capsule--centered",C.text?null:"gauntlet-capsule--no-selection",tl].filter(Boolean).join(" ");return L.useEffect(()=>{window.dispatchEvent(new CustomEvent("gauntlet:phase",{detail:{phase:S}}))},[S]),p.jsxs("div",{className:nl,"data-theme":Pt,role:"dialog","aria-label":"Gauntlet",style:tn,children:[p.jsx("div",{className:"gauntlet-capsule__aurora","aria-hidden":!0}),p.jsxs("div",{className:"gauntlet-capsule__layout",children:[p.jsxs("div",{className:"gauntlet-capsule__panel gauntlet-capsule__panel--left",children:[p.jsxs("header",{className:"gauntlet-capsule__header",children:[p.jsxs("div",{className:"gauntlet-capsule__brand-block",children:[p.jsx("span",{className:"gauntlet-capsule__mark","aria-hidden":!0,children:p.jsx("span",{className:"gauntlet-capsule__mark-dot"})}),p.jsxs("div",{className:"gauntlet-capsule__brand-text",children:[p.jsx("span",{className:"gauntlet-capsule__brand",children:"GAUNTLET"}),p.jsx("span",{className:"gauntlet-capsule__tagline",children:"cursor · capsule"})]})]}),p.jsxs("div",{className:"gauntlet-capsule__header-actions",children:[p.jsx("button",{type:"button",className:"gauntlet-capsule__settings-btn",onClick:()=>ct(w=>!w),"aria-label":"Definições","aria-expanded":_t,title:"Definições",children:p.jsx("span",{"aria-hidden":!0,children:"···"})}),p.jsx("button",{type:"button",className:"gauntlet-capsule__close",onClick:An,"aria-label":"Dismiss capsule (Esc)",children:p.jsx("span",{"aria-hidden":!0,children:"esc"})})]})]}),_t&&p.jsx(Zp,{onClose:()=>ct(!1),showScreenshot:s.capabilities.screenshot,showDismissedDomains:s.capabilities.dismissDomain,showPillMode:s.capabilities.pillSurface,prefs:h,theme:Pt,onChangeTheme:w=>{rt(w),h.writeTheme(w)}}),p.jsxs("section",{className:"gauntlet-capsule__context",children:[p.jsxs("div",{className:"gauntlet-capsule__context-meta",children:[p.jsx("span",{className:`gauntlet-capsule__source${Q?" gauntlet-capsule__source--popped":""}`,children:"browser"}),p.jsx("span",{className:"gauntlet-capsule__url",title:C.url,children:C.pageTitle||C.url}),p.jsx("button",{type:"button",className:"gauntlet-capsule__refresh",onClick:Cn,title:"Re-read current selection",children:"re-read"})]}),C.text?p.jsx("pre",{className:"gauntlet-capsule__selection",children:rc(C.text,600)}):p.jsx(Xp,{snapshot:C,screenshotEnabled:oe!==null})]})]}),p.jsxs("div",{className:"gauntlet-capsule__panel gauntlet-capsule__panel--right",children:[p.jsxs("form",{className:"gauntlet-capsule__form",onSubmit:gr,children:[p.jsx("textarea",{ref:ze,className:"gauntlet-capsule__input",placeholder:"O que queres? — Enter para enviar, Shift+Enter nova linha",value:R,onChange:w=>z(w.target.value),onKeyDown:mr,rows:2,disabled:S==="planning"||S==="streaming"||S==="executing"}),p.jsxs("div",{className:"gauntlet-capsule__actions",children:[p.jsxs("span",{className:"gauntlet-capsule__hint","aria-hidden":!0,children:[p.jsx("span",{className:"gauntlet-capsule__kbd",children:"↵"}),p.jsx("span",{className:"gauntlet-capsule__kbd-sep",children:"·"}),p.jsx("span",{className:"gauntlet-capsule__kbd",children:"⌘K"})]}),up()&&p.jsxs("button",{type:"button",className:`gauntlet-capsule__voice${Sn?" gauntlet-capsule__voice--active":""}`,onPointerDown:w=>{w.preventDefault(),el()},onPointerUp:()=>Xt(),onPointerLeave:()=>{Sn&&Xt()},"aria-label":Sn?"A ouvir — solta para enviar":"Premer e falar",title:"Premir e falar",disabled:S==="planning"||S==="streaming"||S==="executing",children:[p.jsxs("svg",{viewBox:"0 0 24 24",width:"13",height:"13","aria-hidden":!0,children:[p.jsx("path",{d:"M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3z",fill:"currentColor"}),p.jsx("path",{d:"M19 11a7 7 0 0 1-14 0M12 18v3",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",fill:"none"})]}),p.jsx("span",{className:"gauntlet-capsule__voice-label",children:Sn?"a ouvir":"voz"})]}),p.jsxs("button",{type:"submit",className:"gauntlet-capsule__compose",disabled:S==="planning"||S==="streaming"||S==="executing"||!R.trim(),children:[ve>0&&p.jsx("span",{className:"gauntlet-capsule__compose-ripple","aria-hidden":!0},ve),S==="planning"||S==="streaming"?p.jsxs(p.Fragment,{children:[p.jsx("span",{className:"gauntlet-capsule__compose-spinner","aria-hidden":!0}),p.jsx("span",{children:S==="planning"?"a pensar":"a escrever"})]}):"Enviar"]})]})]}),S==="streaming"&&Pe&&p.jsxs("section",{className:"gauntlet-capsule__compose-result gauntlet-capsule__compose-result--streaming",children:[p.jsxs("header",{className:"gauntlet-capsule__compose-meta",children:[p.jsx("span",{className:"gauntlet-capsule__compose-tag",children:"resposta"}),p.jsxs("span",{className:"gauntlet-capsule__compose-meta-text",children:[p.jsxs("span",{className:"gauntlet-capsule__token-counter","aria-live":"polite",children:[Zr," chunks"]}),p.jsx("span",{"aria-hidden":!0,children:"·"}),p.jsx("span",{children:"a escrever…"})]})]}),p.jsxs("div",{className:"gauntlet-capsule__compose-text gauntlet-capsule__compose-text--streaming",children:[Pe,p.jsx("span",{className:"gauntlet-capsule__compose-caret","aria-hidden":!0,children:"▍"})]})]}),(S==="planning"||S==="streaming"&&!Pe)&&p.jsxs("section",{className:"gauntlet-capsule__skeleton",role:"status","aria-live":"polite","aria-label":"A pensar...",children:[p.jsxs("header",{className:"gauntlet-capsule__skeleton-header",children:[p.jsx("span",{className:"gauntlet-capsule__skeleton-tag"}),p.jsx("span",{className:"gauntlet-capsule__skeleton-meta"})]}),p.jsx("div",{className:"gauntlet-capsule__skeleton-line gauntlet-capsule__skeleton-line--w90"}),p.jsx("div",{className:"gauntlet-capsule__skeleton-line gauntlet-capsule__skeleton-line--w75"}),p.jsx("div",{className:"gauntlet-capsule__skeleton-line gauntlet-capsule__skeleton-line--w55"})]}),(M==null?void 0:M.compose)&&S==="plan_ready"&&p.jsxs("section",{className:"gauntlet-capsule__compose-result",children:[p.jsxs("header",{className:"gauntlet-capsule__compose-meta",children:[p.jsx("span",{className:"gauntlet-capsule__compose-tag",children:"resposta"}),p.jsxs("span",{className:"gauntlet-capsule__compose-meta-text",children:[M.model_used," · ",M.latency_ms," ms"]})]}),p.jsx("div",{className:"gauntlet-capsule__compose-text",children:p.jsx(mp,{source:M.compose,onCopyBlock:()=>pr("code copied")})}),p.jsxs("div",{className:"gauntlet-capsule__compose-actions",children:[p.jsx("button",{type:"button",className:"gauntlet-capsule__copy",onClick:()=>void Un(),children:Z?"copiado ✓":"Copy"}),p.jsx("button",{type:"button",className:"gauntlet-capsule__copy gauntlet-capsule__copy--ghost",onClick:()=>void fr(),children:bn==="saved"?"guardado ✓":"Save"})]})]}),M&&M.actions.length===0&&!M.compose&&S==="plan_ready"&&p.jsx("section",{className:"gauntlet-capsule__plan",children:p.jsx("p",{className:"gauntlet-capsule__plan-empty",children:M.reason??"Modelo não conseguiu planear."})}),M&&M.actions.length>0&&(S==="plan_ready"||S==="executing"||S==="executed")&&p.jsxs("section",{className:"gauntlet-capsule__plan",children:[p.jsxs("header",{className:"gauntlet-capsule__plan-header",children:[p.jsx("span",{className:"gauntlet-capsule__plan-title",children:"plano"}),p.jsxs("span",{className:"gauntlet-capsule__plan-meta",children:[M.actions.length," action",M.actions.length===1?"":"s"," · ",M.model_used," · ",M.latency_ms," ms"]})]}),p.jsx("ol",{className:"gauntlet-capsule__plan-list",children:M.actions.map((w,A)=>{const J=je==null?void 0:je[A],ge=J?J.ok?"ok":"fail":"pending",Ce=qt[A];return p.jsxs("li",{className:`gauntlet-capsule__plan-item gauntlet-capsule__plan-item--${ge}${Ce!=null&&Ce.danger?" gauntlet-capsule__plan-item--danger":""}`,children:[p.jsx("span",{className:"gauntlet-capsule__plan-step",children:A+1}),p.jsx("span",{className:"gauntlet-capsule__plan-desc",children:nf(w)}),(Ce==null?void 0:Ce.danger)&&p.jsx("span",{className:"gauntlet-capsule__plan-danger",title:Ce.reason,children:"sensível"}),J&&!J.ok&&p.jsx("span",{className:"gauntlet-capsule__plan-err",title:J.error,children:J.error})]},`${A}-${w.type}-${w.selector}`)})}),S!=="executed"&&pt&&p.jsxs("div",{className:"gauntlet-capsule__danger-gate",role:"alert",children:[p.jsxs("header",{className:"gauntlet-capsule__danger-header",children:[p.jsx("span",{className:"gauntlet-capsule__danger-mark","aria-hidden":!0,children:"!"}),p.jsx("span",{className:"gauntlet-capsule__danger-title",children:"Acções sensíveis no plano"})]}),p.jsxs("ul",{className:"gauntlet-capsule__danger-list",children:[En.forced&&En.reason&&p.jsxs("li",{children:[p.jsx("strong",{children:"governança:"})," ",En.reason]},"danger-policy"),Ft.danger&&p.jsxs("li",{children:[p.jsx("strong",{children:"cadeia:"})," ",Ft.reason??"flagged"]},"danger-sequence"),qt.map((w,A)=>w.danger?p.jsxs("li",{children:[p.jsxs("strong",{children:["step ",A+1,":"]})," ",w.reason??"flagged"]},`danger-${A}`):null)]}),p.jsxs("label",{className:"gauntlet-capsule__danger-confirm",children:[p.jsx("input",{type:"checkbox",checked:K,onChange:w=>ue(w.target.checked),disabled:S==="executing"}),p.jsx("span",{children:"Confirmo, executar mesmo assim."})]})]}),S!=="executed"&&T&&p.jsx("div",{className:"gauntlet-capsule__plan-actions",children:p.jsx("button",{type:"button",className:`gauntlet-capsule__execute${pt?" gauntlet-capsule__execute--danger":""}`,onClick:()=>void hr(),disabled:S==="executing"||pt&&!K,children:S==="executing"?"executando…":pt?"Executar com cuidado":"Executar"})}),S!=="executed"&&!T&&p.jsx("p",{className:"gauntlet-capsule__plan-empty",children:"esta superfície não tem acesso a uma página viva — abre o Gauntlet num separador para executar acções."})]}),S==="error"&&ce&&p.jsxs("div",{className:"gauntlet-capsule__error",role:"alert",children:[p.jsx("span",{className:"gauntlet-capsule__error-icon","aria-hidden":!0,children:"!"}),p.jsx("span",{children:ce})]})]})]}),$t&&p.jsx(qp,{onClose:()=>Ue(!1),recentIds:dt,actions:(()=>{const w=ee=>{Ae(ie=>[ee,...ie.filter(fe=>fe!==ee)].slice(0,8)),h.notePaletteUse(ee)},A=ee=>{z(ie=>{const me=ie.trimEnd(),fe=`usa a tool ${ee} para `;return me.startsWith("usa a tool ")?fe:me?`${fe}${me}`:fe}),window.setTimeout(()=>{const ie=ze.current;ie&&(ie.focus(),ie.setSelectionRange(ie.value.length,ie.value.length))},0)},J=[{id:"focus",label:"Focar input",shortcut:"↵",group:"action",run:()=>{w("focus"),Ue(!1),window.setTimeout(()=>{var ee;return(ee=ze.current)==null?void 0:ee.focus()},0)}},{id:"copy",label:"Copiar resposta",shortcut:"⌘C",group:"action",disabled:!(M!=null&&M.compose),run:()=>{w("copy"),Ue(!1),Un()}},{id:"save",label:"Guardar em memória",shortcut:"S",group:"action",disabled:!(M!=null&&M.compose)&&!C.text&&!R.trim(),run:()=>{w("save"),Ue(!1),fr()}},{id:"reread",label:"Re-ler contexto",shortcut:"R",group:"action",run:()=>{w("reread"),Ue(!1),Cn()}},{id:"clear",label:"Limpar input",shortcut:"X",group:"action",disabled:!R,run:()=>{var ee;w("clear"),Ue(!1),z(""),(ee=ze.current)==null||ee.focus()}},{id:"dismiss",label:"Fechar cápsula",shortcut:"Esc",group:"action",run:()=>{w("dismiss"),Ue(!1),An()}}],Ce=Ye.filter(ee=>{var me;const ie=(me=q.tool_policies)==null?void 0:me[ee.name];return!ie||ie.allowed!==!1}).map(ee=>{var ie,me;return{id:`tool:${ee.name}`,label:ee.name,description:ee.description,shortcut:"",group:"tool",mode:ee.mode,risk:ee.risk,requiresApproval:((me=(ie=q.tool_policies)==null?void 0:ie[ee.name])==null?void 0:me.require_approval)===!0,run:()=>{w(`tool:${ee.name}`),Ue(!1),A(ee.name)}}});return[...J,...Ce]})()}),bn&&p.jsx("div",{className:"gauntlet-capsule__flash",role:"status","aria-live":"polite",children:bn})]})}function Gp(s,u){if(!s)return 0;const i=s.toLowerCase(),y=u.toLowerCase();if(y.includes(i))return 1e3-y.indexOf(i);let m=0,h=0,T=-2;for(let C=0;C<y.length&&m<i.length;C++)y[C]===i[m]&&(C!==T+1&&h++,T=C,m++);return m<i.length?-1:500-h*10-(y.length-i.length)}function qp({actions:s,onClose:u,recentIds:i}){const[y,m]=L.useState(""),[h,T]=L.useState(0),C=L.useRef(null);L.useEffect(()=>{var z;(z=C.current)==null||z.focus()},[]);const k=L.useMemo(()=>{if(!y){const S=new Map(i.map((ne,Z)=>[ne,Z])),F=ne=>{const Z=S.get(ne.id);return Z===void 0?i.length:Z};return[...s].sort((ne,Z)=>{const re=F(ne),M=F(Z);if(re!==M)return re-M;const Me=K=>K==="tool"?1:0,je=Me(ne.group),we=Me(Z.group);return je!==we?je-we:ne.label.localeCompare(Z.label)})}return s.map(S=>{const F=`${S.label} ${S.id} ${S.description??""}`;return{a:S,score:Gp(y,F)}}).filter(S=>S.score>=0).sort((S,F)=>F.score-S.score).map(S=>S.a)},[s,y,i]);L.useEffect(()=>{h>=k.length&&T(0)},[k.length,h]);const R=L.useCallback(z=>{if(z.key==="ArrowDown")z.preventDefault(),T(S=>Math.min(S+1,k.length-1));else if(z.key==="ArrowUp")z.preventDefault(),T(S=>Math.max(S-1,0));else if(z.key==="Enter"){z.preventDefault();const S=k[h];S&&!S.disabled&&S.run()}},[k,h]);return p.jsxs("div",{className:"gauntlet-capsule__palette",role:"dialog","aria-label":"Command palette",children:[p.jsx("div",{className:"gauntlet-capsule__palette-scrim",onClick:u}),p.jsxs("div",{className:"gauntlet-capsule__palette-panel",onKeyDown:R,children:[p.jsx("input",{ref:C,className:"gauntlet-capsule__palette-input",type:"text",placeholder:"comandos · tools…  (↑↓ para navegar, ↵ para correr, esc para fechar)",value:y,onChange:z=>m(z.target.value)}),p.jsx("ul",{className:"gauntlet-capsule__palette-list",role:"listbox",children:k.length===0?p.jsx("li",{className:"gauntlet-capsule__palette-empty",children:"sem resultados"}):k.map((z,S)=>p.jsxs("li",{role:"option","aria-selected":S===h,"aria-disabled":z.disabled,onMouseEnter:()=>T(S),onClick:()=>{z.disabled||z.run()},className:`gauntlet-capsule__palette-item${S===h?" gauntlet-capsule__palette-item--active":""}${z.disabled?" gauntlet-capsule__palette-item--disabled":""}${z.group==="tool"?" gauntlet-capsule__palette-item--tool":""}`,children:[p.jsxs("div",{className:"gauntlet-capsule__palette-main",children:[p.jsx("span",{className:"gauntlet-capsule__palette-label",children:z.label}),z.description&&p.jsx("span",{className:"gauntlet-capsule__palette-desc",children:z.description})]}),p.jsxs("div",{className:"gauntlet-capsule__palette-meta",children:[z.mode&&p.jsx("span",{className:`gauntlet-capsule__palette-badge gauntlet-capsule__palette-badge--mode-${z.mode}`,title:`mode: ${z.mode}`,children:z.mode}),z.risk&&z.risk!=="low"&&p.jsx("span",{className:`gauntlet-capsule__palette-badge gauntlet-capsule__palette-badge--risk-${z.risk}`,title:`risk: ${z.risk}`,children:z.risk}),z.requiresApproval&&p.jsx("span",{className:"gauntlet-capsule__palette-badge gauntlet-capsule__palette-badge--approval",title:"requires explicit approval before running",children:"approval"}),z.shortcut&&p.jsx("span",{className:"gauntlet-capsule__palette-shortcut",children:z.shortcut})]})]},z.id))})]})]})}function rc(s,u){return s.length<=u?s:s.slice(0,u)+"…"}function Xp({snapshot:s,screenshotEnabled:u}){const i=(()=>{if(!s.domSkeleton)return 0;try{const m=JSON.parse(s.domSkeleton);if(Array.isArray(m))return m.length}catch{}return 0})(),y=!!s.pageText;return p.jsxs("ul",{className:"gauntlet-capsule__context-summary","aria-label":"context",children:[p.jsxs("li",{children:[p.jsx("span",{className:"gauntlet-capsule__context-key",children:"selection"}),p.jsx("span",{className:"gauntlet-capsule__context-val gauntlet-capsule__context-val--muted",children:"none"})]}),p.jsxs("li",{children:[p.jsx("span",{className:"gauntlet-capsule__context-key",children:"page captured"}),p.jsx("span",{className:"gauntlet-capsule__context-val",children:y?"yes":"no"})]}),p.jsxs("li",{children:[p.jsx("span",{className:"gauntlet-capsule__context-key",children:"DOM captured"}),p.jsx("span",{className:"gauntlet-capsule__context-val",children:i>0?`${i} elements`:"—"})]}),p.jsxs("li",{children:[p.jsx("span",{className:"gauntlet-capsule__context-key",children:"screenshot"}),p.jsx("span",{className:"gauntlet-capsule__context-val",children:u?"on":"off"})]})]})}function Zp({onClose:s,showScreenshot:u,prefs:i,showDismissedDomains:y,theme:m,onChangeTheme:h,showPillMode:T}){const[C,k]=L.useState([]),[R,z]=L.useState(!0),[S,F]=L.useState(!1),[ce,ne]=L.useState("corner"),[Z,re]=L.useState(!1);L.useEffect(()=>{let K=!1;return y&&i.readDismissedDomains().then(ue=>{K||k(ue)}),i.readScreenshotEnabled().then(ue=>{K||(F(ue),z(!1))}),i.readPillMode().then(ue=>{K||ne(ue)}),i.readTtsEnabled().then(ue=>{K||re(ue)}),()=>{K=!0}},[i,y]);const M=L.useCallback(async K=>{ne(K),await i.writePillMode(K),window.dispatchEvent(new CustomEvent("gauntlet:pill-mode",{detail:{mode:K}}))},[i]),Me=L.useCallback(async K=>{var ue;if(re(K),await i.writeTtsEnabled(K),!K)try{(ue=window.speechSynthesis)==null||ue.cancel()}catch{}window.dispatchEvent(new CustomEvent("gauntlet:tts",{detail:{enabled:K}}))},[i]),je=L.useCallback(async K=>{await i.restoreDomain(K),k(ue=>ue.filter(Pe=>Pe!==K))},[i]),we=L.useCallback(async K=>{F(K),await i.writeScreenshotEnabled(K)},[i]);return p.jsxs("section",{className:"gauntlet-capsule__settings",role:"region","aria-label":"Definições",children:[p.jsxs("header",{className:"gauntlet-capsule__settings-header",children:[p.jsx("span",{className:"gauntlet-capsule__settings-title",children:"definições"}),p.jsx("button",{type:"button",className:"gauntlet-capsule__settings-close",onClick:s,"aria-label":"Fechar definições",children:"×"})]}),p.jsxs("div",{className:"gauntlet-capsule__settings-section",children:[p.jsx("span",{className:"gauntlet-capsule__settings-subtitle",children:"aparência"}),p.jsxs("div",{className:"gauntlet-capsule__theme-switch",role:"radiogroup","aria-label":"tema",children:[p.jsxs("button",{type:"button",className:`gauntlet-capsule__theme-option${m==="light"?" gauntlet-capsule__theme-option--active":""}`,onClick:()=>h("light"),role:"radio","aria-checked":m==="light",children:[p.jsx("span",{className:"gauntlet-capsule__theme-swatch gauntlet-capsule__theme-swatch--light","aria-hidden":!0}),p.jsx("span",{children:"flagship light"})]}),p.jsxs("button",{type:"button",className:`gauntlet-capsule__theme-option${m==="dark"?" gauntlet-capsule__theme-option--active":""}`,onClick:()=>h("dark"),role:"radio","aria-checked":m==="dark",children:[p.jsx("span",{className:"gauntlet-capsule__theme-swatch gauntlet-capsule__theme-swatch--dark","aria-hidden":!0}),p.jsx("span",{children:"night premium"})]})]})]}),T&&p.jsxs("div",{className:"gauntlet-capsule__settings-section",children:[p.jsx("span",{className:"gauntlet-capsule__settings-subtitle",children:"pill"}),p.jsxs("div",{className:"gauntlet-capsule__theme-switch",role:"radiogroup","aria-label":"pill mode",children:[p.jsxs("button",{type:"button",className:`gauntlet-capsule__theme-option${ce==="corner"?" gauntlet-capsule__theme-option--active":""}`,onClick:()=>void M("corner"),role:"radio","aria-checked":ce==="corner",children:[p.jsx("span",{className:"gauntlet-capsule__theme-swatch gauntlet-capsule__pill-mode-swatch--corner","aria-hidden":!0}),p.jsx("span",{children:"resting corner"})]}),p.jsxs("button",{type:"button",className:`gauntlet-capsule__theme-option${ce==="cursor"?" gauntlet-capsule__theme-option--active":""}`,onClick:()=>void M("cursor"),role:"radio","aria-checked":ce==="cursor",children:[p.jsx("span",{className:"gauntlet-capsule__theme-swatch gauntlet-capsule__pill-mode-swatch--cursor","aria-hidden":!0}),p.jsx("span",{children:"cursor pill"})]})]})]}),u&&p.jsx("div",{className:"gauntlet-capsule__settings-section",children:p.jsxs("label",{className:"gauntlet-capsule__settings-toggle",children:[p.jsx("input",{type:"checkbox",checked:S,onChange:K=>void we(K.target.checked)}),p.jsxs("span",{className:"gauntlet-capsule__settings-toggle-label",children:[p.jsx("strong",{children:"incluir screenshot"}),p.jsx("small",{children:"o modelo vê a página visível. útil para layouts e imagens, exposição de senhas/DMs visíveis. opt-in."})]})]})}),p.jsx("div",{className:"gauntlet-capsule__settings-section",children:p.jsxs("label",{className:"gauntlet-capsule__settings-toggle",children:[p.jsx("input",{type:"checkbox",checked:Z,onChange:K=>void Me(K.target.checked)}),p.jsxs("span",{className:"gauntlet-capsule__settings-toggle-label",children:[p.jsx("strong",{children:"ler resposta em voz alta"}),p.jsx("small",{children:"quando o modelo termina, a cápsula fala a resposta via Web Speech. cancela ao submeter outro pedido ou fechar a cápsula."})]})]})}),p.jsxs("div",{className:"gauntlet-capsule__settings-section",children:[p.jsx("span",{className:"gauntlet-capsule__settings-subtitle",children:"domínios escondidos"}),R?p.jsx("p",{className:"gauntlet-capsule__settings-empty",children:"a carregar…"}):C.length===0?p.jsx("p",{className:"gauntlet-capsule__settings-empty",children:"nenhum — clica direito no pill em qualquer site para o esconder."}):p.jsx("ul",{className:"gauntlet-capsule__settings-list",children:C.map(K=>p.jsxs("li",{className:"gauntlet-capsule__settings-row",children:[p.jsx("span",{className:"gauntlet-capsule__settings-host",children:K}),p.jsx("button",{type:"button",className:"gauntlet-capsule__settings-restore",onClick:()=>void je(K),children:"restaurar"})]},K))})]})]})}function ef(s){const u=s.match(/"compose"\s*:\s*"((?:[^"\\]|\\.)*)/);if(!u)return null;let i=u[1];return i.endsWith("\\")&&!i.endsWith("\\\\")&&(i=i.slice(0,-1)),i.replace(/\\n/g,`
`).replace(/\\r/g,"\r").replace(/\\t/g,"	").replace(/\\"/g,'"').replace(/\\\\/g,"\\")}function tf(s,u){const i={};return s.pageText&&(i.page_text=s.pageText),s.domSkeleton&&(i.dom_skeleton=s.domSkeleton),s.bbox&&(i.selection_bbox=s.bbox),u&&(i.screenshot_data_url=u),{source:"browser",url:s.url,page_title:s.pageTitle,selection:s.text||void 0,metadata:Object.keys(i).length>0?i:void 0}}function nf(s){switch(s.type){case"fill":return`fill ${s.selector} ← "${rc(s.value,80)}"`;case"click":return`click ${s.selector}`;case"highlight":return`highlight ${s.selector}`;case"scroll_to":return`scroll to ${s.selector}`}}const yt=16,kn=12;function po(s,u,i){return i<u||s<u?u:s>i?i:s}function rf(s,u){if(s<=600)return{width:Math.max(0,s-24),height:Math.max(0,u-24)};const y=po(.72*s,560,820),m=po(.72*u,420,560);return{width:y,height:m}}function lf(s,u,i){if(!s)return{top:Math.max(yt,Math.floor((u.height-i.height)/2)),left:Math.max(yt,Math.floor((u.width-i.width)/2)),placement:"center"};const y=u.height-(s.y+s.height)-kn-yt,m=s.y-kn-yt,h=u.width-(s.x+s.width)-kn-yt,T=s.x-kn-yt,C=y>=i.height,k=m>=i.height,R=h>=i.width,z=T>=i.width;let S,F,ce;C?(S="below",F=s.y+s.height+kn,ce=s.x):k?(S="above",F=s.y-kn-i.height,ce=s.x):R?(S="right",ce=s.x+s.width+kn,F=Math.floor(s.y+s.height/2-i.height/2)):z?(S="left",ce=s.x-kn-i.width,F=Math.floor(s.y+s.height/2-i.height/2)):(S="center",F=Math.floor((u.height-i.height)/2),ce=Math.floor((u.width-i.width)/2));const ne=u.height-i.height-yt,Z=u.width-i.width-yt;return F=po(F,yt,Math.max(yt,ne)),ce=po(ce,yt,Math.max(yt,Z)),{top:F,left:ce,placement:S}}const of=`
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
`,af=100,sf=new Set(["script","style","meta","link","noscript","head","html","br","hr","wbr"]),uf="gauntlet-capsule-host";function cf(s){const u=s.tagName.toLowerCase(),i=s.getAttribute("id");if(i&&!i.startsWith("gauntlet-"))return`${u}#${CSS.escape(i)}`;const y=s.getAttribute("name");if(y)return`${u}[name="${y}"]`;const m=s.getAttribute("type");if(m)return`${u}[type="${m}"]`;const h=Array.from(s.classList).filter(T=>T.length>2&&!T.startsWith("is-")&&!T.startsWith("has-")).slice(0,2);return h.length>0?`${u}.${h.map(T=>CSS.escape(T)).join(".")}`:u}function df(s){try{const u=window.getComputedStyle(s);if(u.display==="none"||u.visibility==="hidden"||u.opacity==="0")return!1;const i=s.getBoundingClientRect();return!(i.width===0&&i.height===0||i.bottom<0||i.top>window.innerHeight||i.right<0||i.left>window.innerWidth)}catch{return!1}}function pf(s){let u=0,i=s;for(;i&&i!==document.body;)u++,i=i.parentElement;return u}function ff(s){var i;let u=s;for(;u;){if(u.id===uf||(i=u.id)!=null&&i.startsWith("gauntlet-"))return!0;u=u.parentElement}return!1}function gf(s){var R;const u=s.tagName.toLowerCase();if(sf.has(u)||ff(s))return null;const i=cf(s),y=df(s),m=pf(s),h={selector:i,tag:u,visible:y,depth:m},T=s.getAttribute("type");T&&(h.type=T);const C=s.getAttribute("placeholder")||s.getAttribute("aria-label")||s.getAttribute("title")||"";C&&(h.placeholder=C.trim().slice(0,80));const k=((R=s.innerText)==null?void 0:R.trim())??"";return k&&k.length>0&&(h.text=k.slice(0,50)),h}const mf=["input","textarea","select",'[contenteditable="true"]',"button","a[href]","label",'[role="button"]','[role="link"]','[role="textbox"]','[role="combobox"]','[role="listbox"]','[role="menuitem"]','[role="tab"]','[role="checkbox"]','[role="radio"]','[role="switch"]',"nav","main","form"].join(", ");function hf(){try{const s=[],u=new Set,i=document.querySelectorAll(mf);for(const y of Array.from(i)){if(s.length>=af)break;const m=gf(y);m&&(u.has(m.selector)||(u.add(m.selector),s.push(m)))}return{elements:s}}catch{return{elements:[]}}}const qu=5e3;function xf(){try{const s=document.body;if(!s)return"";const i=(s.innerText??"").replace(/\r\n/g,`
`).replace(/\r/g,`
`).replace(/\n{3,}/g,`

`).replace(/[ \t]{2,}/g," ").trim();return i.length<=qu?i:i.slice(0,qu)+"…"}catch{return""}}function lc(){return{text:_f(),url:wf(),pageTitle:kf(),pageText:xf(),domSkeleton:JSON.stringify(hf()),bbox:Sf()}}const vf=50;async function yf(){var T;const s=lc();if(s.text)return s;const u=`gauntlet-cid-${Math.random().toString(36).slice(2)}`,i=[],y=C=>{const k=C.data;!k||k.gauntlet!=="subframe-selection-response"||k.cid===u&&(typeof k.text!="string"||!k.text||i.push({text:k.text,url:typeof k.url=="string"?k.url:void 0,pageTitle:typeof k.pageTitle=="string"?k.pageTitle:void 0}))};window.addEventListener("message",y);let m=null;try{m=document.querySelectorAll("iframe")}catch{m=null}if(m)for(const C of Array.from(m))try{(T=C.contentWindow)==null||T.postMessage({gauntlet:"subframe-selection-request",cid:u},"*")}catch{}await new Promise(C=>window.setTimeout(C,vf)),window.removeEventListener("message",y);const h=i.sort((C,k)=>k.text.length-C.text.length)[0];return h?{...s,text:h.text,url:h.url||s.url,pageTitle:h.pageTitle||s.pageTitle,bbox:null}:s}function _f(){try{const s=window.getSelection();return s?s.toString().trim():""}catch{return""}}function wf(){try{return window.location.href}catch{return""}}function kf(){try{return document.title??""}catch{return""}}function Sf(){try{const s=window.getSelection();if(!s||s.rangeCount===0||s.isCollapsed)return null;const i=s.getRangeAt(0).getBoundingClientRect();return i.width===0&&i.height===0?null:{x:i.x,y:i.y,width:i.width,height:i.height}}catch{return null}}const bf={domExecution:!0,pillSurface:!0,screenshot:!0,dismissDomain:!0,voice:typeof window<"u"&&("SpeechRecognition"in window||"webkitSpeechRecognition"in window),streaming:!0,refreshSelection:!0};async function Ef(s,u,i){const y=await chrome.runtime.sendMessage({type:"gauntlet:fetch",url:u,method:s,headers:{"content-type":"application/json"},body:i===void 0?void 0:JSON.stringify(i)});if(!y||!y.ok)throw new Error(`composer: background fetch failed — ${(y==null?void 0:y.error)??"unknown error"}`);let m=null;if(y.body!=null&&y.body!=="")try{m=JSON.parse(y.body)}catch{m=y.body}const h=y.status??0;if(h<200||h>=300)throw new Error(`composer: ${h} ${y.statusText??""}`.trim());return m}const Cf={async get(s){try{return(await chrome.storage.local.get(s))[s]??null}catch{return null}},async set(s,u){try{await chrome.storage.local.set({[s]:u})}catch{}},async remove(s){try{await chrome.storage.local.remove(s)}catch{}}};function Nf(s,u,i){const y=chrome.runtime.connect({name:"gauntlet:stream"});let m=!1;function h(){if(!m){m=!0;try{y.disconnect()}catch{}}}return y.onMessage.addListener(T=>{if(!T||typeof T!="object")return;const C=T;if(C.type==="sse"&&typeof C.data=="string"){let k=null;try{k=JSON.parse(C.data)}catch{i.onError("malformed SSE payload"),h();return}if(C.event==="delta"){const R=k.text??"";i.onDelta(R)}else if(C.event==="done"){const R=k;i.onDone({plan_id:R.plan_id??"",context_id:R.context_id??"",actions:R.actions??[],compose:R.compose??null,reason:R.reason??null,model_used:R.model_used??"",latency_ms:R.latency_ms??0,raw_response:null}),h()}else if(C.event==="error"){const R=k.error??"model error";i.onError(R),h()}}else C.type==="error"?(i.onError(C.error??"transport error"),h()):C.type==="closed"&&(m||(i.onDone({plan_id:"",context_id:"",actions:[],compose:null,reason:"stream ended without result",model_used:"",latency_ms:0,raw_response:null}),m=!0))}),y.onDisconnect.addListener(()=>{var T;if(!m){const C=(T=chrome.runtime.lastError)==null?void 0:T.message;i.onError(C??"disconnected"),m=!0}}),y.postMessage({type:"start",url:s,body:u}),()=>{if(!m){try{y.postMessage({type:"abort"})}catch{}h()}}}function Tf(){return{shell:"browser",capabilities:bf,transport:{fetchJson(s,u,i){return Ef(s,u,i)},stream:Nf},storage:Cf,selection:{read:()=>lc(),readAsync:()=>yf()},domActions:{execute:Dp},screenshot:{async capture(){var s;if(typeof chrome>"u"||!((s=chrome.runtime)!=null&&s.sendMessage))return null;try{const u=await chrome.runtime.sendMessage({type:"gauntlet:capture_screenshot"});return!(u!=null&&u.ok)||!u.dataUrl?null:u.dataUrl}catch{return null}}},debug:{async lastSummon(){try{const s=await chrome.runtime.sendMessage({type:"gauntlet:debug"});return(s==null?void 0:s.lastSummon)??null}catch{return null}}}}}const jf=`
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
`,oc=document.createElement("style");oc.textContent=of+jf;document.head.appendChild(oc);const Xu=Tf(),ac={...Xu,capabilities:{...Xu.capabilities,domExecution:!1,screenshot:!1,dismissDomain:!1,refreshSelection:!1,pillSurface:!1},domActions:void 0,screenshot:void 0};ac.storage.get("gauntlet:theme").then(s=>{const u=s==="dark"||s==="light"?s:"light";document.documentElement.setAttribute("data-theme",u),document.body.setAttribute("data-theme",u)});const Pf=sp.createRoot(document.getElementById("root"));Pf.render(p.jsx(L.StrictMode,{children:p.jsx(Jp,{ambient:ac,initialSnapshot:{text:"",url:"window://composer",pageTitle:"Composer",pageText:"",domSkeleton:"",bbox:null},onDismiss:()=>window.close()})}));
