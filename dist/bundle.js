/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@fortawesome/free-solid-svg-icons/faMusic.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@fortawesome/free-solid-svg-icons/faMusic.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var prefix = 'fas';
var iconName = 'music';
var width = 512;
var height = 512;
var aliases = [127925];
var unicode = 'f001';
var svgPathData = 'M511.1 367.1c0 44.18-42.98 80-95.1 80s-95.1-35.82-95.1-79.1c0-44.18 42.98-79.1 95.1-79.1c11.28 0 21.95 1.92 32.01 4.898V148.1L192 224l-.0023 208.1C191.1 476.2 149 512 95.1 512S0 476.2 0 432c0-44.18 42.98-79.1 95.1-79.1c11.28 0 21.95 1.92 32 4.898V126.5c0-12.97 10.06-26.63 22.41-30.52l319.1-94.49C472.1 .6615 477.3 0 480 0c17.66 0 31.97 14.34 32 31.99L511.1 367.1z';

exports.definition = {
  prefix: prefix,
  iconName: iconName,
  icon: [
    width,
    height,
    aliases,
    unicode,
    svgPathData
  ]};

exports.faMusic = exports.definition;
exports.prefix = prefix;
exports.iconName = iconName;
exports.width = width;
exports.height = height;
exports.ligatures = aliases;
exports.unicode = unicode;
exports.svgPathData = svgPathData;
exports.aliases = aliases;

/***/ }),

/***/ "./src/widget.ts":
/*!***********************!*\
  !*** ./src/widget.ts ***!
  \***********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StatefulMarqueeWidget = void 0;
const webviews_1 = __importDefault(__webpack_require__(/*! tangle/webviews */ "./node_modules/tangle/dist/cjs/webviews.js"));
const faMusic_1 = __webpack_require__(/*! @fortawesome/free-solid-svg-icons/faMusic */ "./node_modules/@fortawesome/free-solid-svg-icons/faMusic.js");
// const ch = new Channel<{ counter: 0; tracks: any[] }>("stateful.marquee");
const ch = new webviews_1.default("shyykoserhiy.vscode-spotify");
const client = ch.attach(window.vscode);
const template = document.createElement("template");
template.innerHTML = /*html*/ `
  <style>
  :host {
    margin: 10px;
    display: block;
  }
  </style>
  <div>
    Hello World
  </div>
`;
class StatefulMarqueeWidget extends HTMLElement {
    static get is() {
        return "stateful-marquee-widget-2";
    }
    // track = {
    //   name: "Track name",
    //   artist: "Artist name",
    // };
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        client.listen("track", (cnt) => {
            console.log(cnt);
            // this.shadowRoot!.querySelector("div")!.innerHTML =
            //   "Hello World" + [...new Array(cnt)].map(() => "!").join("");
        });
    }
    // constructor() {
    //   super();
    //   this.attachShadow({ mode: "open" });
    //   // const state = getState();
    //   // const { track } = state;
    //   // console.log("track", track);
    //   // var template = `
    //   // <span>track: ${this.track.name}</span>
    //   // `;
    //   // this.shadowRoot.innerHTML = template;
    //   client.on("counter", (cnt) => {
    //     this.shadowRoot!.querySelector("div")!.innerHTML =
    //       "Hello World" + [...new Array(cnt)].map(() => "hehe").join("");
    //   });
    //   // this.shadowRoot!.querySelector("div")!.innerHTML = this.track.artist;
    //   // client.on("track", (track) => {
    //   //   console.log(track);
    //   //   this.shadowRoot!.querySelector("div")!.innerHTML = track.name;
    //   // });
    // }
    connectedCallback() {
        var _a;
        // this.shadowRoot!.querySelector("div")!.innerHTML = this.track.artist;
        (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.appendChild(template.content.cloneNode(true));
    }
}
exports.StatefulMarqueeWidget = StatefulMarqueeWidget;
window.marqueeExtension.defineWidget({
    name: StatefulMarqueeWidget.is,
    icon: faMusic_1.faMusic,
    label: "Marquee Spotify",
    tags: ["productivity"],
    description: "Spotify widget",
}, StatefulMarqueeWidget);


/***/ }),

/***/ "./node_modules/tangle/dist/cjs/channel-69db5c3e.js":
/*!**********************************************************!*\
  !*** ./node_modules/tangle/dist/cjs/channel-69db5c3e.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var e=__webpack_require__(/*! ./tangle-df04bb9d.js */ "./node_modules/tangle/dist/cjs/tangle-df04bb9d.js");var t=function(e,t){return e.push(t),e};exports.BaseChannel=class{constructor(e,t){this._namespace=e,this._defaultValue=t}registerPromise(e){return new Promise((t=>this.register(e).subscribe(t)))}_initiateBus(t){return new e.Bus(this._namespace,t,this._defaultValue||{})}_initiateClient(t){return new e.Client(this._namespace,[t],this._defaultValue||{})}},exports.toArray=function(){return e.operate((function(r,n){(function(t,r){return e.operate(e.scanInternals(t,r,arguments.length>=2,!1,!0))})(t,[])(r).subscribe(n)}))};


/***/ }),

/***/ "./node_modules/tangle/dist/cjs/tangle-df04bb9d.js":
/*!*********************************************************!*\
  !*** ./node_modules/tangle/dist/cjs/tangle-df04bb9d.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, exports) => {

var t=function(n,e){return t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,n){t.__proto__=n}||function(t,n){for(var e in n)Object.prototype.hasOwnProperty.call(n,e)&&(t[e]=n[e])},t(n,e)};function n(n,e){if("function"!=typeof e&&null!==e)throw new TypeError("Class extends value "+String(e)+" is not a constructor or null");function r(){this.constructor=n}t(n,e),n.prototype=null===e?Object.create(e):(r.prototype=e.prototype,new r)}function e(t,n,e,r){return new(e||(e=Promise))((function(o,i){function u(t){try{c(r.next(t))}catch(t){i(t)}}function s(t){try{c(r.throw(t))}catch(t){i(t)}}function c(t){var n;t.done?o(t.value):(n=t.value,n instanceof e?n:new e((function(t){t(n)}))).then(u,s)}c((r=r.apply(t,n||[])).next())}))}function r(t,n){var e,r,o,i,u={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return i={next:s(0),throw:s(1),return:s(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function s(i){return function(s){return function(i){if(e)throw new TypeError("Generator is already executing.");for(;u;)try{if(e=1,r&&(o=2&i[0]?r.return:i[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,i[1])).done)return o;switch(r=0,o&&(i=[2&i[0],o.value]),i[0]){case 0:case 1:o=i;break;case 4:return u.label++,{value:i[1],done:!1};case 5:u.label++,r=i[1],i=[0];continue;case 7:i=u.ops.pop(),u.trys.pop();continue;default:if(!(o=u.trys,(o=o.length>0&&o[o.length-1])||6!==i[0]&&2!==i[0])){u=0;continue}if(3===i[0]&&(!o||i[1]>o[0]&&i[1]<o[3])){u.label=i[1];break}if(6===i[0]&&u.label<o[1]){u.label=o[1],o=i;break}if(o&&u.label<o[2]){u.label=o[2],u.ops.push(i);break}o[2]&&u.ops.pop(),u.trys.pop();continue}i=n.call(t,u)}catch(t){i=[6,t],r=0}finally{e=o=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,s])}}}function o(t){var n="function"==typeof Symbol&&Symbol.iterator,e=n&&t[n],r=0;if(e)return e.call(t);if(t&&"number"==typeof t.length)return{next:function(){return t&&r>=t.length&&(t=void 0),{value:t&&t[r++],done:!t}}};throw new TypeError(n?"Object is not iterable.":"Symbol.iterator is not defined.")}function i(t,n){var e="function"==typeof Symbol&&t[Symbol.iterator];if(!e)return t;var r,o,i=e.call(t),u=[];try{for(;(void 0===n||n-- >0)&&!(r=i.next()).done;)u.push(r.value)}catch(t){o={error:t}}finally{try{r&&!r.done&&(e=i.return)&&e.call(i)}finally{if(o)throw o.error}}return u}function u(t,n){for(var e=0,r=n.length,o=t.length;e<r;e++,o++)t[o]=n[e];return t}function s(t){return this instanceof s?(this.v=t,this):new s(t)}function c(t,n,e){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var r,o=e.apply(t,n||[]),i=[];return r={},u("next"),u("throw"),u("return"),r[Symbol.asyncIterator]=function(){return this},r;function u(t){o[t]&&(r[t]=function(n){return new Promise((function(e,r){i.push([t,n,e,r])>1||c(t,n)}))})}function c(t,n){try{(e=o[t](n)).value instanceof s?Promise.resolve(e.value.v).then(l,a):f(i[0][2],e)}catch(t){f(i[0][3],t)}var e}function l(t){c("next",t)}function a(t){c("throw",t)}function f(t,n){t(n),i.shift(),i.length&&c(i[0][0],i[0][1])}}function l(t){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var n,e=t[Symbol.asyncIterator];return e?e.call(t):(t=o(t),n={},r("next"),r("throw"),r("return"),n[Symbol.asyncIterator]=function(){return this},n);function r(e){n[e]=t[e]&&function(n){return new Promise((function(r,o){(function(t,n,e,r){Promise.resolve(r).then((function(n){t({value:n,done:e})}),n)})(r,o,(n=t[e](n)).done,n.value)}))}}}function a(t){return"function"==typeof t}function f(t){var n=t((function(t){Error.call(t),t.stack=(new Error).stack}));return n.prototype=Object.create(Error.prototype),n.prototype.constructor=n,n}var h=f((function(t){return function(n){t(this),this.message=n?n.length+" errors occurred during unsubscription:\n"+n.map((function(t,n){return n+1+") "+t.toString()})).join("\n  "):"",this.name="UnsubscriptionError",this.errors=n}}));function p(t,n){if(t){var e=t.indexOf(n);0<=e&&t.splice(e,1)}}var v=function(){function t(t){this.initialTeardown=t,this.closed=!1,this._parentage=null,this._teardowns=null}var n;return t.prototype.unsubscribe=function(){var t,n,e,r,s;if(!this.closed){this.closed=!0;var c=this._parentage;if(c)if(this._parentage=null,Array.isArray(c))try{for(var l=o(c),f=l.next();!f.done;f=l.next()){f.value.remove(this)}}catch(n){t={error:n}}finally{try{f&&!f.done&&(n=l.return)&&n.call(l)}finally{if(t)throw t.error}}else c.remove(this);var p=this.initialTeardown;if(a(p))try{p()}catch(t){s=t instanceof h?t.errors:[t]}var v=this._teardowns;if(v){this._teardowns=null;try{for(var d=o(v),b=d.next();!b.done;b=d.next()){var w=b.value;try{y(w)}catch(t){s=null!=s?s:[],t instanceof h?s=u(u([],i(s)),i(t.errors)):s.push(t)}}}catch(t){e={error:t}}finally{try{b&&!b.done&&(r=d.return)&&r.call(d)}finally{if(e)throw e.error}}}if(s)throw new h(s)}},t.prototype.add=function(n){var e;if(n&&n!==this)if(this.closed)y(n);else{if(n instanceof t){if(n.closed||n._hasParent(this))return;n._addParent(this)}(this._teardowns=null!==(e=this._teardowns)&&void 0!==e?e:[]).push(n)}},t.prototype._hasParent=function(t){var n=this._parentage;return n===t||Array.isArray(n)&&n.includes(t)},t.prototype._addParent=function(t){var n=this._parentage;this._parentage=Array.isArray(n)?(n.push(t),n):n?[n,t]:t},t.prototype._removeParent=function(t){var n=this._parentage;n===t?this._parentage=null:Array.isArray(n)&&p(n,t)},t.prototype.remove=function(n){var e=this._teardowns;e&&p(e,n),n instanceof t&&n._removeParent(this)},t.EMPTY=((n=new t).closed=!0,n),t}(),d=v.EMPTY;function b(t){return t instanceof v||t&&"closed"in t&&a(t.remove)&&a(t.add)&&a(t.unsubscribe)}function y(t){a(t)?t():t.unsubscribe()}var w={onUnhandledError:null,onStoppedNotification:null,Promise:void 0,useDeprecatedSynchronousErrorHandling:!1,useDeprecatedNextContext:!1},m={setTimeout:function(){for(var t=[],n=0;n<arguments.length;n++)t[n]=arguments[n];var e=m.delegate;return((null==e?void 0:e.setTimeout)||setTimeout).apply(void 0,u([],i(t)))},clearTimeout:function(t){var n=m.delegate;return((null==n?void 0:n.clearTimeout)||clearTimeout)(t)},delegate:void 0};function _(t){m.setTimeout((function(){var n=w.onUnhandledError;if(!n)throw t;n(t)}))}function g(){}var x=S("C",void 0,void 0);function S(t,n,e){return{kind:t,value:n,error:e}}var E=null;function I(t){if(w.useDeprecatedSynchronousErrorHandling){var n=!E;if(n&&(E={errorThrown:!1,error:null}),t(),n){var e=E,r=e.errorThrown,o=e.error;if(E=null,r)throw o}}else t()}function P(t){w.useDeprecatedSynchronousErrorHandling&&E&&(E.errorThrown=!0,E.error=t)}var T=function(t){function e(n){var e=t.call(this)||this;return e.isStopped=!1,n?(e.destination=n,b(n)&&n.add(e)):e.destination=j,e}return n(e,t),e.create=function(t,n,e){return new A(t,n,e)},e.prototype.next=function(t){this.isStopped?k(function(t){return S("N",t,void 0)}(t),this):this._next(t)},e.prototype.error=function(t){this.isStopped?k(S("E",void 0,t),this):(this.isStopped=!0,this._error(t))},e.prototype.complete=function(){this.isStopped?k(x,this):(this.isStopped=!0,this._complete())},e.prototype.unsubscribe=function(){this.closed||(this.isStopped=!0,t.prototype.unsubscribe.call(this),this.destination=null)},e.prototype._next=function(t){this.destination.next(t)},e.prototype._error=function(t){try{this.destination.error(t)}finally{this.unsubscribe()}},e.prototype._complete=function(){try{this.destination.complete()}finally{this.unsubscribe()}},e}(v),A=function(t){function e(n,e,r){var o,i=t.call(this)||this;if(a(n))o=n;else if(n){var u;o=n.next,e=n.error,r=n.complete,i&&w.useDeprecatedNextContext?(u=Object.create(n)).unsubscribe=function(){return i.unsubscribe()}:u=n,o=null==o?void 0:o.bind(u),e=null==e?void 0:e.bind(u),r=null==r?void 0:r.bind(u)}return i.destination={next:o?O(o):g,error:O(null!=e?e:C),complete:r?O(r):g},i}return n(e,t),e}(T);function O(t,n){return function(){for(var n=[],e=0;e<arguments.length;e++)n[e]=arguments[e];try{t.apply(void 0,u([],i(n)))}catch(t){w.useDeprecatedSynchronousErrorHandling?P(t):_(t)}}}function C(t){throw t}function k(t,n){var e=w.onStoppedNotification;e&&m.setTimeout((function(){return e(t,n)}))}var j={closed:!0,next:g,error:C,complete:g},M="function"==typeof Symbol&&Symbol.observable||"@@observable";function N(t){return t}function D(t){return 0===t.length?N:1===t.length?t[0]:function(n){return t.reduce((function(t,n){return n(t)}),n)}}var B=function(){function t(t){t&&(this._subscribe=t)}return t.prototype.lift=function(n){var e=new t;return e.source=this,e.operator=n,e},t.prototype.subscribe=function(t,n,e){var r,o=this,i=(r=t)&&r instanceof T||function(t){return t&&a(t.next)&&a(t.error)&&a(t.complete)}(r)&&b(r)?t:new A(t,n,e);return I((function(){var t=o,n=t.operator,e=t.source;i.add(n?n.call(i,e):e?o._subscribe(i):o._trySubscribe(i))})),i},t.prototype._trySubscribe=function(t){try{return this._subscribe(t)}catch(n){t.error(n)}},t.prototype.forEach=function(t,n){var e=this;return new(n=V(n))((function(n,r){var o;o=e.subscribe((function(n){try{t(n)}catch(t){r(t),null==o||o.unsubscribe()}}),r,n)}))},t.prototype._subscribe=function(t){var n;return null===(n=this.source)||void 0===n?void 0:n.subscribe(t)},t.prototype[M]=function(){return this},t.prototype.pipe=function(){for(var t=[],n=0;n<arguments.length;n++)t[n]=arguments[n];return D(t)(this)},t.prototype.toPromise=function(t){var n=this;return new(t=V(t))((function(t,e){var r;n.subscribe((function(t){return r=t}),(function(t){return e(t)}),(function(){return t(r)}))}))},t.create=function(n){return new t(n)},t}();function V(t){var n;return null!==(n=null!=t?t:w.Promise)&&void 0!==n?n:Promise}function L(t){return function(n){if(function(t){return a(null==t?void 0:t.lift)}(n))return n.lift((function(n){try{return t(n,this)}catch(t){this.error(t)}}));throw new TypeError("Unable to lift unknown Observable type")}}var U=function(t){function e(n,e,r,o,i){var u=t.call(this,n)||this;return u.onFinalize=i,u._next=e?function(t){try{e(t)}catch(t){n.error(t)}}:t.prototype._next,u._error=o?function(t){try{o(t)}catch(t){n.error(t)}finally{this.unsubscribe()}}:t.prototype._error,u._complete=r?function(){try{r()}catch(t){n.error(t)}finally{this.unsubscribe()}}:t.prototype._complete,u}return n(e,t),e.prototype.unsubscribe=function(){var n,e=this.closed;t.prototype.unsubscribe.call(this),!e&&(null===(n=this.onFinalize)||void 0===n||n.call(this))},e}(T),z=f((function(t){return function(){t(this),this.name="ObjectUnsubscribedError",this.message="object unsubscribed"}})),F=function(t){function e(){var n=t.call(this)||this;return n.closed=!1,n.observers=[],n.isStopped=!1,n.hasError=!1,n.thrownError=null,n}return n(e,t),e.prototype.lift=function(t){var n=new H(this,this);return n.operator=t,n},e.prototype._throwIfClosed=function(){if(this.closed)throw new z},e.prototype.next=function(t){var n=this;I((function(){var e,r;if(n._throwIfClosed(),!n.isStopped){var i=n.observers.slice();try{for(var u=o(i),s=u.next();!s.done;s=u.next()){s.value.next(t)}}catch(t){e={error:t}}finally{try{s&&!s.done&&(r=u.return)&&r.call(u)}finally{if(e)throw e.error}}}}))},e.prototype.error=function(t){var n=this;I((function(){if(n._throwIfClosed(),!n.isStopped){n.hasError=n.isStopped=!0,n.thrownError=t;for(var e=n.observers;e.length;)e.shift().error(t)}}))},e.prototype.complete=function(){var t=this;I((function(){if(t._throwIfClosed(),!t.isStopped){t.isStopped=!0;for(var n=t.observers;n.length;)n.shift().complete()}}))},e.prototype.unsubscribe=function(){this.isStopped=this.closed=!0,this.observers=null},Object.defineProperty(e.prototype,"observed",{get:function(){var t;return(null===(t=this.observers)||void 0===t?void 0:t.length)>0},enumerable:!1,configurable:!0}),e.prototype._trySubscribe=function(n){return this._throwIfClosed(),t.prototype._trySubscribe.call(this,n)},e.prototype._subscribe=function(t){return this._throwIfClosed(),this._checkFinalizedStatuses(t),this._innerSubscribe(t)},e.prototype._innerSubscribe=function(t){var n=this,e=n.hasError,r=n.isStopped,o=n.observers;return e||r?d:(o.push(t),new v((function(){return p(o,t)})))},e.prototype._checkFinalizedStatuses=function(t){var n=this,e=n.hasError,r=n.thrownError,o=n.isStopped;e?t.error(r):o&&t.complete()},e.prototype.asObservable=function(){var t=new B;return t.source=this,t},e.create=function(t,n){return new H(t,n)},e}(B),H=function(t){function e(n,e){var r=t.call(this)||this;return r.destination=n,r.source=e,r}return n(e,t),e.prototype.next=function(t){var n,e;null===(e=null===(n=this.destination)||void 0===n?void 0:n.next)||void 0===e||e.call(n,t)},e.prototype.error=function(t){var n,e;null===(e=null===(n=this.destination)||void 0===n?void 0:n.error)||void 0===e||e.call(n,t)},e.prototype.complete=function(){var t,n;null===(n=null===(t=this.destination)||void 0===t?void 0:t.complete)||void 0===n||n.call(t)},e.prototype._subscribe=function(t){var n,e;return null!==(e=null===(n=this.source)||void 0===n?void 0:n.subscribe(t))&&void 0!==e?e:d},e}(F),R=function(t){function e(n){var e=t.call(this)||this;return e._value=n,e}return n(e,t),Object.defineProperty(e.prototype,"value",{get:function(){return this.getValue()},enumerable:!1,configurable:!0}),e.prototype._subscribe=function(n){var e=t.prototype._subscribe.call(this,n);return!e.closed&&n.next(this._value),e},e.prototype.getValue=function(){var t=this,n=t.hasError,e=t.thrownError,r=t._value;if(n)throw e;return this._throwIfClosed(),r},e.prototype.next=function(n){t.prototype.next.call(this,this._value=n)},e}(F),Y={now:function(){return(Y.delegate||Date).now()},delegate:void 0},q=function(t){function e(n,e){return t.call(this)||this}return n(e,t),e.prototype.schedule=function(t,n){return this},e}(v),G={setInterval:function(){for(var t=[],n=0;n<arguments.length;n++)t[n]=arguments[n];var e=G.delegate;return((null==e?void 0:e.setInterval)||setInterval).apply(void 0,u([],i(t)))},clearInterval:function(t){var n=G.delegate;return((null==n?void 0:n.clearInterval)||clearInterval)(t)},delegate:void 0},Z=function(t){function e(n,e){var r=t.call(this,n,e)||this;return r.scheduler=n,r.work=e,r.pending=!1,r}return n(e,t),e.prototype.schedule=function(t,n){if(void 0===n&&(n=0),this.closed)return this;this.state=t;var e=this.id,r=this.scheduler;return null!=e&&(this.id=this.recycleAsyncId(r,e,n)),this.pending=!0,this.delay=n,this.id=this.id||this.requestAsyncId(r,this.id,n),this},e.prototype.requestAsyncId=function(t,n,e){return void 0===e&&(e=0),G.setInterval(t.flush.bind(t,this),e)},e.prototype.recycleAsyncId=function(t,n,e){if(void 0===e&&(e=0),null!=e&&this.delay===e&&!1===this.pending)return n;G.clearInterval(n)},e.prototype.execute=function(t,n){if(this.closed)return new Error("executing a cancelled action");this.pending=!1;var e=this._execute(t,n);if(e)return e;!1===this.pending&&null!=this.id&&(this.id=this.recycleAsyncId(this.scheduler,this.id,null))},e.prototype._execute=function(t,n){var e,r=!1;try{this.work(t)}catch(t){r=!0,e=t||new Error("Scheduled action threw falsy error")}if(r)return this.unsubscribe(),e},e.prototype.unsubscribe=function(){if(!this.closed){var n=this.id,e=this.scheduler,r=e.actions;this.work=this.state=this.scheduler=null,this.pending=!1,p(r,this),null!=n&&(this.id=this.recycleAsyncId(e,n,null)),this.delay=null,t.prototype.unsubscribe.call(this)}},e}(q),J=function(){function t(n,e){void 0===e&&(e=t.now),this.schedulerActionCtor=n,this.now=e}return t.prototype.schedule=function(t,n,e){return void 0===n&&(n=0),new this.schedulerActionCtor(this,t).schedule(e,n)},t.now=Y.now,t}(),K=new(function(t){function e(n,e){void 0===e&&(e=J.now);var r=t.call(this,n,e)||this;return r.actions=[],r._active=!1,r._scheduled=void 0,r}return n(e,t),e.prototype.flush=function(t){var n=this.actions;if(this._active)n.push(t);else{var e;this._active=!0;do{if(e=t.execute(t.state,t.delay))break}while(t=n.shift());if(this._active=!1,e){for(;t=n.shift();)t.unsubscribe();throw e}}},e}(J))(Z),Q=K,W=new B((function(t){return t.complete()}));function X(t){return t&&a(t.schedule)}function $(t){return t[t.length-1]}function tt(t){return a($(t))?t.pop():void 0}function nt(t){return X($(t))?t.pop():void 0}function et(t,n){return"number"==typeof $(t)?t.pop():n}var rt=function(t){return t&&"number"==typeof t.length&&"function"!=typeof t};function ot(t){return a(null==t?void 0:t.then)}function it(t){return a(t[M])}function ut(t){return Symbol.asyncIterator&&a(null==t?void 0:t[Symbol.asyncIterator])}function st(t){return new TypeError("You provided "+(null!==t&&"object"==typeof t?"an invalid object":"'"+t+"'")+" where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.")}var ct="function"==typeof Symbol&&Symbol.iterator?Symbol.iterator:"@@iterator";function lt(t){return a(null==t?void 0:t[ct])}function at(t){return c(this,arguments,(function(){var n,e,o;return r(this,(function(r){switch(r.label){case 0:n=t.getReader(),r.label=1;case 1:r.trys.push([1,,9,10]),r.label=2;case 2:return[4,s(n.read())];case 3:return e=r.sent(),o=e.value,e.done?[4,s(void 0)]:[3,5];case 4:return[2,r.sent()];case 5:return[4,s(o)];case 6:return[4,r.sent()];case 7:return r.sent(),[3,2];case 8:return[3,10];case 9:return n.releaseLock(),[7];case 10:return[2]}}))}))}function ft(t){return a(null==t?void 0:t.getReader)}function ht(t){if(t instanceof B)return t;if(null!=t){if(it(t))return i=t,new B((function(t){var n=i[M]();if(a(n.subscribe))return n.subscribe(t);throw new TypeError("Provided object does not correctly implement Symbol.observable")}));if(rt(t))return r=t,new B((function(t){for(var n=0;n<r.length&&!t.closed;n++)t.next(r[n]);t.complete()}));if(ot(t))return e=t,new B((function(t){e.then((function(n){t.closed||(t.next(n),t.complete())}),(function(n){return t.error(n)})).then(null,_)}));if(ut(t))return pt(t);if(lt(t))return n=t,new B((function(t){var e,r;try{for(var i=o(n),u=i.next();!u.done;u=i.next()){var s=u.value;if(t.next(s),t.closed)return}}catch(t){e={error:t}}finally{try{u&&!u.done&&(r=i.return)&&r.call(i)}finally{if(e)throw e.error}}t.complete()}));if(ft(t))return pt(at(t))}var n,e,r,i;throw st(t)}function pt(t){return new B((function(n){(function(t,n){var o,i,u,s;return e(this,void 0,void 0,(function(){var e,c;return r(this,(function(r){switch(r.label){case 0:r.trys.push([0,5,6,11]),o=l(t),r.label=1;case 1:return[4,o.next()];case 2:if((i=r.sent()).done)return[3,4];if(e=i.value,n.next(e),n.closed)return[2];r.label=3;case 3:return[3,1];case 4:return[3,11];case 5:return c=r.sent(),u={error:c},[3,11];case 6:return r.trys.push([6,,9,10]),i&&!i.done&&(s=o.return)?[4,s.call(o)]:[3,8];case 7:r.sent(),r.label=8;case 8:return[3,10];case 9:if(u)throw u.error;return[7];case 10:return[7];case 11:return n.complete(),[2]}}))}))})(t,n).catch((function(t){return n.error(t)}))}))}function vt(t,n,e,r,o){void 0===r&&(r=0),void 0===o&&(o=!1);var i=n.schedule((function(){e(),o?t.add(this.schedule(null,r)):this.unsubscribe()}),r);if(t.add(i),!o)return i}function dt(t,n){return void 0===n&&(n=0),L((function(e,r){e.subscribe(new U(r,(function(e){return vt(r,t,(function(){return r.next(e)}),n)}),(function(){return vt(r,t,(function(){return r.complete()}),n)}),(function(e){return vt(r,t,(function(){return r.error(e)}),n)})))}))}function bt(t,n){return void 0===n&&(n=0),L((function(e,r){r.add(t.schedule((function(){return e.subscribe(r)}),n))}))}function yt(t,n){if(!t)throw new Error("Iterable cannot be null");return new B((function(e){vt(e,n,(function(){var r=t[Symbol.asyncIterator]();vt(e,n,(function(){r.next().then((function(t){t.done?e.complete():e.next(t.value)}))}),0,!0)}))}))}function wt(t,n){if(null!=t){if(it(t))return function(t,n){return ht(t).pipe(bt(n),dt(n))}(t,n);if(rt(t))return function(t,n){return new B((function(e){var r=0;return n.schedule((function(){r===t.length?e.complete():(e.next(t[r++]),e.closed||this.schedule())}))}))}(t,n);if(ot(t))return function(t,n){return ht(t).pipe(bt(n),dt(n))}(t,n);if(ut(t))return yt(t,n);if(lt(t))return function(t,n){return new B((function(e){var r;return vt(e,n,(function(){r=t[ct](),vt(e,n,(function(){var t,n,o;try{n=(t=r.next()).value,o=t.done}catch(t){return void e.error(t)}o?e.complete():e.next(n)}),0,!0)})),function(){return a(null==r?void 0:r.return)&&r.return()}}))}(t,n);if(ft(t))return function(t,n){return yt(at(t),n)}(t,n)}throw st(t)}function mt(t,n){return n?wt(t,n):ht(t)}function _t(){for(var t=[],n=0;n<arguments.length;n++)t[n]=arguments[n];var e=nt(t);return mt(t,e)}var gt=f((function(t){return function(){t(this),this.name="EmptyError",this.message="no elements in sequence"}}));function xt(t,n){return L((function(e,r){var o=0;e.subscribe(new U(r,(function(e){r.next(t.call(n,e,o++))})))}))}function St(t,n,e){return void 0===e&&(e=1/0),a(n)?St((function(e,r){return xt((function(t,o){return n(e,t,r,o)}))(ht(t(e,r)))}),e):("number"==typeof n&&(e=n),L((function(n,r){return function(t,n,e,r,o,i,u,s){var c=[],l=0,a=0,f=!1,h=function(){!f||c.length||l||n.complete()},p=function(t){return l<r?v(t):c.push(t)},v=function(t){i&&n.next(t),l++;var s=!1;ht(e(t,a++)).subscribe(new U(n,(function(t){null==o||o(t),i?p(t):n.next(t)}),(function(){s=!0}),void 0,(function(){if(s)try{l--;for(var t=function(){var t=c.shift();u?vt(n,u,(function(){return v(t)})):v(t)};c.length&&l<r;)t();h()}catch(t){n.error(t)}})))};return t.subscribe(new U(n,p,(function(){f=!0,h()}))),function(){null==s||s()}}(n,r,t,e)})))}function Et(t){return void 0===t&&(t=1/0),St(N,t)}function It(t,n,e){void 0===t&&(t=0),void 0===e&&(e=Q);var r=-1;return null!=n&&(X(n)?e=n:r=n),new B((function(n){var o,i=(o=t)instanceof Date&&!isNaN(o)?+t-e.now():t;i<0&&(i=0);var u=0;return e.schedule((function(){n.closed||(n.next(u++),0<=r?this.schedule(void 0,r):n.complete())}),i)}))}function Pt(){for(var t=[],n=0;n<arguments.length;n++)t[n]=arguments[n];var e=nt(t),r=et(t,1/0),o=t;return o.length?1===o.length?ht(o[0]):Et(r)(mt(o,e)):W}function Tt(t,n){return L((function(e,r){var o=0;e.subscribe(new U(r,(function(e){return t.call(n,e,o++)&&r.next(e)})))}))}function At(t,n,e,r,o){return function(i,u){var s=e,c=n,l=0;i.subscribe(new U(u,(function(n){var e=l++;c=s?t(c,n,e):(s=!0,n),r&&u.next(c)}),o&&function(){s&&u.next(c),u.complete()}))}}function Ot(t){return L((function(n,e){var r=!1;n.subscribe(new U(e,(function(t){r=!0,e.next(t)}),(function(){r||e.next(t),e.complete()})))}))}function Ct(t){return t<=0?function(){return W}:L((function(n,e){var r=0;n.subscribe(new U(e,(function(n){++r<=t&&(e.next(n),t<=r&&e.complete())})))}))}function kt(t){return void 0===t&&(t=jt),L((function(n,e){var r=!1;n.subscribe(new U(e,(function(t){r=!0,e.next(t)}),(function(){return r?e.complete():e.error(t())})))}))}function jt(){return new gt}function Mt(){for(var t=[],n=0;n<arguments.length;n++)t[n]=arguments[n];var e=t.length;if(0===e)throw new Error("list of properties cannot be empty.");return xt((function(n){for(var r=n,o=0;o<e;o++){var i=null==r?void 0:r[t[o]];if(void 0===i)return;r=i}return r}))}function Nt(t){void 0===t&&(t={});var n=t.connector,e=void 0===n?function(){return new F}:n,r=t.resetOnError,o=void 0===r||r,i=t.resetOnComplete,u=void 0===i||i,s=t.resetOnRefCountZero,c=void 0===s||s;return function(t){var n=null,r=null,i=null,s=0,l=!1,a=!1,f=function(){null==r||r.unsubscribe(),r=null},h=function(){f(),n=i=null,l=a=!1},p=function(){var t=n;h(),null==t||t.unsubscribe()};return L((function(t,v){s++,a||l||f();var d=i=null!=i?i:e();v.add((function(){0!==--s||a||l||(r=Dt(p,c))})),d.subscribe(v),n||(n=new A({next:function(t){return d.next(t)},error:function(t){a=!0,f(),r=Dt(h,o,t),d.error(t)},complete:function(){l=!0,f(),r=Dt(h,u),d.complete()}}),mt(t).subscribe(n))}))(t)}}function Dt(t,n){for(var e=[],r=2;r<arguments.length;r++)e[r-2]=arguments[r];return!0===n?(t(),null):!1===n?null:n.apply(void 0,u([],i(e))).pipe(Ct(1)).subscribe((function(){return t()}))}var Bt={leading:!0,trailing:!1};function Vt(t,n,e){void 0===n&&(n=K),void 0===e&&(e=Bt);var r,o,i,u,s,c=It(t,n);return r=function(){return c},u=(i=void 0===(o=e)?Bt:o).leading,s=i.trailing,L((function(t,n){var e=!1,o=null,i=null,c=!1,l=function(){null==i||i.unsubscribe(),i=null,s&&(h(),c&&n.complete())},a=function(){i=null,c&&n.complete()},f=function(t){return i=ht(r(t)).subscribe(new U(n,l,a))},h=function(){if(e){e=!1;var t=o;o=null,n.next(t),!c&&f(t)}};t.subscribe(new U(n,(function(t){e=!0,o=t,(!i||i.closed)&&(u?h():f(t))}),(function(){c=!0,(!(s&&e&&i)||i.closed)&&n.complete()})))}))}class Lt{constructor(t,n,e,r=!1){this.namespace=t,this.providers=n,this.defaultValue=e,this._isBus=r,this._eventMap=new Map,this._outbound=new F,this._inbound=new R({transient:this.defaultValue}),this._events=new F,this._transient=this._register()}get events(){return this._events.asObservable().pipe(Nt())}get transient(){return this._transient}get state(){return this._inbound.value.transient}broadcast(t){this._outbound.next({transient:t})}listen(t,n){return this._isBus&&n(this.defaultValue[t]),this.events.pipe(Mt("transient"),Mt(t),Tt((t=>void 0!==t))).subscribe(n)}emit(t,n){this._outbound.next({event:{[t]:n}})}on(t,n){return this._registerEvent(t,n)}once(t,n){return this._registerEvent(t,n,!0)}off(t,n){return(this._eventMap.get(t)||[]).filter((({fn:t})=>t===n)).forEach((({obs:t})=>t.unsubscribe())),this}eventNames(){return[...this._eventMap.keys()]}listenerCount(t){return this.listeners(t).length}listeners(t){return(this._eventMap.get(t)||[]).map((({fn:t})=>t))}removeAllListeners(){const t=[...this._eventMap.values()];for(const n of t)n.forEach((({obs:t})=>t.unsubscribe()));return this}_registerEvent(t,n,e=!1){const r=this._eventMap.get(t)||[],o="string"==typeof t?t.toLocaleLowerCase():t.toString().toLowerCase(),i=this.events.pipe(Mt("event"),Tt(Boolean),St((t=>mt(Object.entries(t)))),Tt((([t])=>t.toLowerCase().indexOf(o)>=0)),xt((([,t])=>t)),(t=>e?t.pipe(function(t,n){var e=arguments.length>=2;return function(r){return r.pipe(t?Tt((function(n,e){return t(n,e,r)})):N,Ct(1),e?Ot(n):kt((function(){return new gt})))}}()):t)).subscribe(n);return r.push({fn:n,obs:i}),this._eventMap.set(t,r),i}_register(){const t=mt(this.providers),n=this._inbound,e=this._outbound,r=Pt(n.pipe(Mt("transient")),e.pipe(Mt("transient"))),s=Pt(t).pipe(this._fromProviders(),St((()=>r.pipe(function(t,n){return L(At(t,n,arguments.length>=2,!0))}(this._fold,this.defaultValue),Vt(20),St((t=>(({}[this.namespace]=t,_t(t)))))))),(c=this.providers.length,void 0===l&&(l=null),l=null!=l?l:c,L((function(t,n){var e=[],r=0;t.subscribe(new U(n,(function(t){var i,u,s,a,f=null;r++%l==0&&e.push([]);try{for(var h=o(e),v=h.next();!v.done;v=h.next())(y=v.value).push(t),c<=y.length&&(f=null!=f?f:[]).push(y)}catch(t){i={error:t}}finally{try{v&&!v.done&&(u=h.return)&&u.call(h)}finally{if(i)throw i.error}}if(f)try{for(var d=o(f),b=d.next();!b.done;b=d.next()){var y=b.value;p(e,y),n.next(y)}}catch(t){s={error:t}}finally{try{b&&!b.done&&(a=d.return)&&a.call(d)}finally{if(s)throw s.error}}}),(function(){var t,r;try{for(var i=o(e),u=i.next();!u.done;u=i.next()){var s=u.value;n.next(s)}}catch(n){t={error:n}}finally{try{u&&!u.done&&(r=i.return)&&r.call(i)}finally{if(t)throw t.error}}n.complete()}),void 0,(function(){e=null})))}))),xt((t=>t.reduce(this._fold,this.defaultValue))),Nt());var c,l;this._isBus||n.subscribe((t=>{t&&this._events.next(t)}));return(this._isBus?Pt(e,n):e).pipe(function(){for(var t=[],n=0;n<arguments.length;n++)t[n]=arguments[n];var e=tt(t);return L((function(n,r){for(var o=t.length,s=new Array(o),c=t.map((function(){return!1})),l=!1,a=function(n){ht(t[n]).subscribe(new U(r,(function(t){s[n]=t,l||c[n]||(c[n]=!0,(l=c.every(N))&&(c=null))}),g))},f=0;f<o;f++)a(f);n.subscribe(new U(r,(function(t){if(l){var n=u([t],i(s));r.next(e?e.apply(void 0,u([],i(n))):n)}})))}))}(s),xt((([t,n])=>{if(t.event)return{event:t.event};if(t.transient)return{transient:{...n,...t.transient}};throw new Error("Neither event nor state change was given")})),xt((t=>{this._isBus&&this._events.next({event:t.event,transient:t.transient||{}}),this.providers.forEach((n=>{n.postMessage({[this.namespace]:t})}))}))).subscribe(),s.subscribe(),s}_fromProviders(){return t=>t.pipe(xt((t=>(t.onMessage((t=>{const n=t[this.namespace];n&&this._inbound.next(n)})),t))))}_fold(t,n){return t&&n?{...t,...n}:t||n}}exports.Bus=class extends Lt{constructor(t,n,e){super(t,n,e,!0)}},exports.Client=Lt,exports.map=xt,exports.merge=Pt,exports.of=_t,exports.operate=L,exports.scanInternals=At,exports.take=Ct;


/***/ }),

/***/ "./node_modules/tangle/dist/cjs/webviews.js":
/*!**************************************************!*\
  !*** ./node_modules/tangle/dist/cjs/webviews.js ***!
  \**************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var e=__webpack_require__(/*! ./channel-69db5c3e.js */ "./node_modules/tangle/dist/cjs/channel-69db5c3e.js"),s=__webpack_require__(/*! ./tangle-df04bb9d.js */ "./node_modules/tangle/dist/cjs/tangle-df04bb9d.js");class t extends e.BaseChannel{constructor(){super(...arguments),this.providers=[]}register(t){const r=t.map((e=>{const t=e;return"string"==typeof t.html?s.of(t):e}));return this.providers.push(...r),s.merge(...r).pipe(s.take(t.length),e.toArray(),s.map((e=>e.map((e=>({onMessage:e.onDidReceiveMessage.bind(e),postMessage:e.postMessage.bind(e)}))))),s.map(this._initiateBus.bind(this)))}attach(e){return this._initiateClient({onMessage:e=>{window.addEventListener("message",(s=>e(s.data)))},postMessage:s=>(e.postMessage(s),Promise.resolve())})}}module.exports=t;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/widget.ts");
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=bundle.js.map