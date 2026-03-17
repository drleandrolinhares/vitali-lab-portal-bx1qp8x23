import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-E1jAkS4v.js";
import { t as CircleCheck } from "./circle-check-yMo7w1iO.js";
import { t as Clock } from "./clock-BPy4iyyd.js";
import { t as Funnel } from "./funnel-D1ZXcv5y.js";
import { t as LoaderCircle } from "./loader-circle-DJxRpB2j.js";
import { t as MessageCircle } from "./message-circle-BQwWK07r.js";
import { t as StatusBadge } from "./StatusBadge-C-UJiDAq.js";
import { t as Search } from "./search-DB0eZUhb.js";
import { It as require_react, Lt as __commonJSMin, Ot as Link, St as require_jsx_runtime, a as useAppStore, at as createLucideIcon, h as format, p as ptBR, st as clsx_default, t as Button, zt as __toESM } from "./index-BQqMl_rO.js";
import { a as CardHeader, n as CardContent, o as CardTitle, t as Card } from "./card-DorPhryw.js";
import { t as Input } from "./input-G5C5PVB0.js";
import { t as Label } from "./label-BsyUqq9S.js";
import "./es2015-CgSSirzl.js";
import "./badge-CWRDxGYf.js";
import { $ as require_isFunction, A as getValueByDataKey, B as require__baseIteratee, C as Label$1, D as polarToCartesian, E as getTickClassName, F as Text, G as adaptEventsOfChild, H as Layer, I as Cell, J as isNumber, K as getPercentValue, M as require__baseLt, N as require__baseGt, P as require__baseExtremum, Q as require_get, S as LabelList, T as getMaxRadius, U as filterProps, V as warn, W as findAllByType, X as uniqueId, Y as mathSign, Z as require_isNil, _ as Bar, a as ChartTooltipContent, b as es6_default, c as YAxis, i as ChartTooltip, j as require_isEqual, l as XAxis, o as BarChart, q as interpolateNumber, s as generateCategoricalChart, t as ChartContainer, v as Shape, w as formatAxisMap, x as Curve, y as Dot, z as Global } from "./chart-Bw2NuF3N.js";
import { t as CartesianGrid } from "./CartesianGrid-BjqkVt4p.js";
import { a as TableHead, n as TableBody, o as TableHeader, r as TableCell, s as TableRow, t as Table } from "./table-Es2JmDDa.js";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-YxPXtsFd.js";
import { t as Switch } from "./switch-BPzhFEFC.js";
var ListChecks = createLucideIcon("list-checks", [
	["path", {
		d: "M13 5h8",
		key: "a7qcls"
	}],
	["path", {
		d: "M13 12h8",
		key: "h98zly"
	}],
	["path", {
		d: "M13 19h8",
		key: "c3s6r1"
	}],
	["path", {
		d: "m3 17 2 2 4-4",
		key: "1jhpwq"
	}],
	["path", {
		d: "m3 7 2 2 4-4",
		key: "1obspn"
	}]
]);
var import_react = /* @__PURE__ */ __toESM(require_react());
var _excluded$1 = [
	"points",
	"className",
	"baseLinePoints",
	"connectNulls"
];
function _extends$3() {
	_extends$3 = Object.assign ? Object.assign.bind() : function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$3.apply(this, arguments);
}
function _objectWithoutProperties$1(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose$1(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose$1(source, excluded) {
	if (source == null) return {};
	var target = {};
	for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) {
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
function _toConsumableArray(arr) {
	return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}
function _nonIterableSpread() {
	throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray(o, minLen) {
	if (!o) return;
	if (typeof o === "string") return _arrayLikeToArray(o, minLen);
	var n = Object.prototype.toString.call(o).slice(8, -1);
	if (n === "Object" && o.constructor) n = o.constructor.name;
	if (n === "Map" || n === "Set") return Array.from(o);
	if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _iterableToArray(iter) {
	if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _arrayWithoutHoles(arr) {
	if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}
function _arrayLikeToArray(arr, len) {
	if (len == null || len > arr.length) len = arr.length;
	for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
	return arr2;
}
var isValidatePoint = function isValidatePoint$1(point) {
	return point && point.x === +point.x && point.y === +point.y;
};
var getParsedPoints = function getParsedPoints$1() {
	var points = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
	var segmentPoints = [[]];
	points.forEach(function(entry) {
		if (isValidatePoint(entry)) segmentPoints[segmentPoints.length - 1].push(entry);
		else if (segmentPoints[segmentPoints.length - 1].length > 0) segmentPoints.push([]);
	});
	if (isValidatePoint(points[0])) segmentPoints[segmentPoints.length - 1].push(points[0]);
	if (segmentPoints[segmentPoints.length - 1].length <= 0) segmentPoints = segmentPoints.slice(0, -1);
	return segmentPoints;
};
var getSinglePolygonPath = function getSinglePolygonPath$1(points, connectNulls) {
	var segmentPoints = getParsedPoints(points);
	if (connectNulls) segmentPoints = [segmentPoints.reduce(function(res, segPoints) {
		return [].concat(_toConsumableArray(res), _toConsumableArray(segPoints));
	}, [])];
	var polygonPath = segmentPoints.map(function(segPoints) {
		return segPoints.reduce(function(path, point, index) {
			return "".concat(path).concat(index === 0 ? "M" : "L").concat(point.x, ",").concat(point.y);
		}, "");
	}).join("");
	return segmentPoints.length === 1 ? "".concat(polygonPath, "Z") : polygonPath;
};
var getRanglePath = function getRanglePath$1(points, baseLinePoints, connectNulls) {
	var outerPath = getSinglePolygonPath(points, connectNulls);
	return "".concat(outerPath.slice(-1) === "Z" ? outerPath.slice(0, -1) : outerPath, "L").concat(getSinglePolygonPath(baseLinePoints.reverse(), connectNulls).slice(1));
};
var Polygon = function Polygon$1(props) {
	var points = props.points, className = props.className, baseLinePoints = props.baseLinePoints, connectNulls = props.connectNulls, others = _objectWithoutProperties$1(props, _excluded$1);
	if (!points || !points.length) return null;
	var layerClass = clsx_default("recharts-polygon", className);
	if (baseLinePoints && baseLinePoints.length) {
		var hasStroke = others.stroke && others.stroke !== "none";
		var rangePath = getRanglePath(points, baseLinePoints, connectNulls);
		return /* @__PURE__ */ import_react.createElement("g", { className: layerClass }, /* @__PURE__ */ import_react.createElement("path", _extends$3({}, filterProps(others, true), {
			fill: rangePath.slice(-1) === "Z" ? others.fill : "none",
			stroke: "none",
			d: rangePath
		})), hasStroke ? /* @__PURE__ */ import_react.createElement("path", _extends$3({}, filterProps(others, true), {
			fill: "none",
			d: getSinglePolygonPath(points, connectNulls)
		})) : null, hasStroke ? /* @__PURE__ */ import_react.createElement("path", _extends$3({}, filterProps(others, true), {
			fill: "none",
			d: getSinglePolygonPath(baseLinePoints, connectNulls)
		})) : null);
	}
	var singlePath = getSinglePolygonPath(points, connectNulls);
	return /* @__PURE__ */ import_react.createElement("path", _extends$3({}, filterProps(others, true), {
		fill: singlePath.slice(-1) === "Z" ? others.fill : "none",
		className: layerClass,
		d: singlePath
	}));
};
var require_maxBy = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var baseExtremum$1 = require__baseExtremum(), baseGt = require__baseGt(), baseIteratee$1 = require__baseIteratee();
	function maxBy$1(array, iteratee) {
		return array && array.length ? baseExtremum$1(array, baseIteratee$1(iteratee, 2), baseGt) : void 0;
	}
	module.exports = maxBy$1;
}));
var require_minBy = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var baseExtremum = require__baseExtremum(), baseIteratee = require__baseIteratee(), baseLt = require__baseLt();
	function minBy$1(array, iteratee) {
		return array && array.length ? baseExtremum(array, baseIteratee(iteratee, 2), baseLt) : void 0;
	}
	module.exports = minBy$1;
}));
var import_maxBy = /* @__PURE__ */ __toESM(require_maxBy());
var import_minBy = /* @__PURE__ */ __toESM(require_minBy());
var import_isFunction$2 = /* @__PURE__ */ __toESM(require_isFunction());
var _excluded = [
	"cx",
	"cy",
	"angle",
	"ticks",
	"axisLine"
], _excluded2 = [
	"ticks",
	"tick",
	"angle",
	"tickFormatter",
	"stroke"
];
function _typeof$2(o) {
	"@babel/helpers - typeof";
	return _typeof$2 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o$1) {
		return typeof o$1;
	} : function(o$1) {
		return o$1 && "function" == typeof Symbol && o$1.constructor === Symbol && o$1 !== Symbol.prototype ? "symbol" : typeof o$1;
	}, _typeof$2(o);
}
function _extends$2() {
	_extends$2 = Object.assign ? Object.assign.bind() : function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$2.apply(this, arguments);
}
function ownKeys$2(e, r) {
	var t = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var o = Object.getOwnPropertySymbols(e);
		r && (o = o.filter(function(r$1) {
			return Object.getOwnPropertyDescriptor(e, r$1).enumerable;
		})), t.push.apply(t, o);
	}
	return t;
}
function _objectSpread$2(e) {
	for (var r = 1; r < arguments.length; r++) {
		var t = null != arguments[r] ? arguments[r] : {};
		r % 2 ? ownKeys$2(Object(t), !0).forEach(function(r$1) {
			_defineProperty$2(e, r$1, t[r$1]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$2(Object(t)).forEach(function(r$1) {
			Object.defineProperty(e, r$1, Object.getOwnPropertyDescriptor(t, r$1));
		});
	}
	return e;
}
function _objectWithoutProperties(source, excluded) {
	if (source == null) return {};
	var target = _objectWithoutPropertiesLoose(source, excluded);
	var key, i;
	if (Object.getOwnPropertySymbols) {
		var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
		for (i = 0; i < sourceSymbolKeys.length; i++) {
			key = sourceSymbolKeys[i];
			if (excluded.indexOf(key) >= 0) continue;
			if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
			target[key] = source[key];
		}
	}
	return target;
}
function _objectWithoutPropertiesLoose(source, excluded) {
	if (source == null) return {};
	var target = {};
	for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) {
		if (excluded.indexOf(key) >= 0) continue;
		target[key] = source[key];
	}
	return target;
}
function _classCallCheck$2(instance, Constructor) {
	if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties$2(target, props) {
	for (var i = 0; i < props.length; i++) {
		var descriptor = props[i];
		descriptor.enumerable = descriptor.enumerable || false;
		descriptor.configurable = true;
		if ("value" in descriptor) descriptor.writable = true;
		Object.defineProperty(target, _toPropertyKey$2(descriptor.key), descriptor);
	}
}
function _createClass$2(Constructor, protoProps, staticProps) {
	if (protoProps) _defineProperties$2(Constructor.prototype, protoProps);
	if (staticProps) _defineProperties$2(Constructor, staticProps);
	Object.defineProperty(Constructor, "prototype", { writable: false });
	return Constructor;
}
function _callSuper$2(t, o, e) {
	return o = _getPrototypeOf$2(o), _possibleConstructorReturn$2(t, _isNativeReflectConstruct$2() ? Reflect.construct(o, e || [], _getPrototypeOf$2(t).constructor) : o.apply(t, e));
}
function _possibleConstructorReturn$2(self, call) {
	if (call && (_typeof$2(call) === "object" || typeof call === "function")) return call;
	else if (call !== void 0) throw new TypeError("Derived constructors may only return object or undefined");
	return _assertThisInitialized$2(self);
}
function _assertThisInitialized$2(self) {
	if (self === void 0) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	return self;
}
function _isNativeReflectConstruct$2() {
	try {
		var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
	} catch (t$1) {}
	return (_isNativeReflectConstruct$2 = function _isNativeReflectConstruct$3() {
		return !!t;
	})();
}
function _getPrototypeOf$2(o) {
	_getPrototypeOf$2 = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf$3(o$1) {
		return o$1.__proto__ || Object.getPrototypeOf(o$1);
	};
	return _getPrototypeOf$2(o);
}
function _inherits$2(subClass, superClass) {
	if (typeof superClass !== "function" && superClass !== null) throw new TypeError("Super expression must either be null or a function");
	subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: {
		value: subClass,
		writable: true,
		configurable: true
	} });
	Object.defineProperty(subClass, "prototype", { writable: false });
	if (superClass) _setPrototypeOf$2(subClass, superClass);
}
function _setPrototypeOf$2(o, p) {
	_setPrototypeOf$2 = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf$3(o$1, p$1) {
		o$1.__proto__ = p$1;
		return o$1;
	};
	return _setPrototypeOf$2(o, p);
}
function _defineProperty$2(obj, key, value) {
	key = _toPropertyKey$2(key);
	if (key in obj) Object.defineProperty(obj, key, {
		value,
		enumerable: true,
		configurable: true,
		writable: true
	});
	else obj[key] = value;
	return obj;
}
function _toPropertyKey$2(t) {
	var i = _toPrimitive$2(t, "string");
	return "symbol" == _typeof$2(i) ? i : i + "";
}
function _toPrimitive$2(t, r) {
	if ("object" != _typeof$2(t) || !t) return t;
	var e = t[Symbol.toPrimitive];
	if (void 0 !== e) {
		var i = e.call(t, r || "default");
		if ("object" != _typeof$2(i)) return i;
		throw new TypeError("@@toPrimitive must return a primitive value.");
	}
	return ("string" === r ? String : Number)(t);
}
var PolarRadiusAxis = /* @__PURE__ */ function(_PureComponent) {
	function PolarRadiusAxis$1() {
		_classCallCheck$2(this, PolarRadiusAxis$1);
		return _callSuper$2(this, PolarRadiusAxis$1, arguments);
	}
	_inherits$2(PolarRadiusAxis$1, _PureComponent);
	return _createClass$2(PolarRadiusAxis$1, [
		{
			key: "getTickValueCoord",
			value: function getTickValueCoord(_ref) {
				var coordinate = _ref.coordinate;
				var _this$props = this.props, angle = _this$props.angle, cx = _this$props.cx, cy = _this$props.cy;
				return polarToCartesian(cx, cy, coordinate, angle);
			}
		},
		{
			key: "getTickTextAnchor",
			value: function getTickTextAnchor() {
				var orientation = this.props.orientation;
				var textAnchor;
				switch (orientation) {
					case "left":
						textAnchor = "end";
						break;
					case "right":
						textAnchor = "start";
						break;
					default:
						textAnchor = "middle";
						break;
				}
				return textAnchor;
			}
		},
		{
			key: "getViewBox",
			value: function getViewBox() {
				var _this$props2 = this.props, cx = _this$props2.cx, cy = _this$props2.cy, angle = _this$props2.angle, ticks = _this$props2.ticks;
				var maxRadiusTick = (0, import_maxBy.default)(ticks, function(entry) {
					return entry.coordinate || 0;
				});
				return {
					cx,
					cy,
					startAngle: angle,
					endAngle: angle,
					innerRadius: (0, import_minBy.default)(ticks, function(entry) {
						return entry.coordinate || 0;
					}).coordinate || 0,
					outerRadius: maxRadiusTick.coordinate || 0
				};
			}
		},
		{
			key: "renderAxisLine",
			value: function renderAxisLine() {
				var _this$props3 = this.props, cx = _this$props3.cx, cy = _this$props3.cy, angle = _this$props3.angle, ticks = _this$props3.ticks, axisLine = _this$props3.axisLine, others = _objectWithoutProperties(_this$props3, _excluded);
				var extent = ticks.reduce(function(result, entry) {
					return [Math.min(result[0], entry.coordinate), Math.max(result[1], entry.coordinate)];
				}, [Infinity, -Infinity]);
				var point0 = polarToCartesian(cx, cy, extent[0], angle);
				var point1 = polarToCartesian(cx, cy, extent[1], angle);
				var props = _objectSpread$2(_objectSpread$2(_objectSpread$2({}, filterProps(others, false)), {}, { fill: "none" }, filterProps(axisLine, false)), {}, {
					x1: point0.x,
					y1: point0.y,
					x2: point1.x,
					y2: point1.y
				});
				return /* @__PURE__ */ import_react.createElement("line", _extends$2({ className: "recharts-polar-radius-axis-line" }, props));
			}
		},
		{
			key: "renderTicks",
			value: function renderTicks() {
				var _this = this;
				var _this$props4 = this.props, ticks = _this$props4.ticks, tick = _this$props4.tick, angle = _this$props4.angle, tickFormatter = _this$props4.tickFormatter, stroke = _this$props4.stroke, others = _objectWithoutProperties(_this$props4, _excluded2);
				var textAnchor = this.getTickTextAnchor();
				var axisProps = filterProps(others, false);
				var customTickProps = filterProps(tick, false);
				var items = ticks.map(function(entry, i) {
					var coord = _this.getTickValueCoord(entry);
					var tickProps = _objectSpread$2(_objectSpread$2(_objectSpread$2(_objectSpread$2({
						textAnchor,
						transform: "rotate(".concat(90 - angle, ", ").concat(coord.x, ", ").concat(coord.y, ")")
					}, axisProps), {}, {
						stroke: "none",
						fill: stroke
					}, customTickProps), {}, { index: i }, coord), {}, { payload: entry });
					return /* @__PURE__ */ import_react.createElement(Layer, _extends$2({
						className: clsx_default("recharts-polar-radius-axis-tick", getTickClassName(tick)),
						key: "tick-".concat(entry.coordinate)
					}, adaptEventsOfChild(_this.props, entry, i)), PolarRadiusAxis$1.renderTickItem(tick, tickProps, tickFormatter ? tickFormatter(entry.value, i) : entry.value));
				});
				return /* @__PURE__ */ import_react.createElement(Layer, { className: "recharts-polar-radius-axis-ticks" }, items);
			}
		},
		{
			key: "render",
			value: function render() {
				var _this$props5 = this.props, ticks = _this$props5.ticks, axisLine = _this$props5.axisLine, tick = _this$props5.tick;
				if (!ticks || !ticks.length) return null;
				return /* @__PURE__ */ import_react.createElement(Layer, { className: clsx_default("recharts-polar-radius-axis", this.props.className) }, axisLine && this.renderAxisLine(), tick && this.renderTicks(), Label$1.renderCallByParent(this.props, this.getViewBox()));
			}
		}
	], [{
		key: "renderTickItem",
		value: function renderTickItem(option, props, value) {
			var tickItem;
			if (/* @__PURE__ */ import_react.isValidElement(option)) tickItem = /* @__PURE__ */ import_react.cloneElement(option, props);
			else if ((0, import_isFunction$2.default)(option)) tickItem = option(props);
			else tickItem = /* @__PURE__ */ import_react.createElement(Text, _extends$2({}, props, { className: "recharts-polar-radius-axis-tick-value" }), value);
			return tickItem;
		}
	}]);
}(import_react.PureComponent);
_defineProperty$2(PolarRadiusAxis, "displayName", "PolarRadiusAxis");
_defineProperty$2(PolarRadiusAxis, "axisType", "radiusAxis");
_defineProperty$2(PolarRadiusAxis, "defaultProps", {
	type: "number",
	radiusAxisId: 0,
	cx: 0,
	cy: 0,
	angle: 0,
	orientation: "right",
	stroke: "#ccc",
	axisLine: true,
	tick: true,
	tickCount: 5,
	allowDataOverflow: false,
	scale: "auto",
	allowDuplicatedCategory: true
});
var import_isFunction$1 = /* @__PURE__ */ __toESM(require_isFunction());
function _typeof$1(o) {
	"@babel/helpers - typeof";
	return _typeof$1 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o$1) {
		return typeof o$1;
	} : function(o$1) {
		return o$1 && "function" == typeof Symbol && o$1.constructor === Symbol && o$1 !== Symbol.prototype ? "symbol" : typeof o$1;
	}, _typeof$1(o);
}
function _extends$1() {
	_extends$1 = Object.assign ? Object.assign.bind() : function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$1.apply(this, arguments);
}
function ownKeys$1(e, r) {
	var t = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var o = Object.getOwnPropertySymbols(e);
		r && (o = o.filter(function(r$1) {
			return Object.getOwnPropertyDescriptor(e, r$1).enumerable;
		})), t.push.apply(t, o);
	}
	return t;
}
function _objectSpread$1(e) {
	for (var r = 1; r < arguments.length; r++) {
		var t = null != arguments[r] ? arguments[r] : {};
		r % 2 ? ownKeys$1(Object(t), !0).forEach(function(r$1) {
			_defineProperty$1(e, r$1, t[r$1]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$1(Object(t)).forEach(function(r$1) {
			Object.defineProperty(e, r$1, Object.getOwnPropertyDescriptor(t, r$1));
		});
	}
	return e;
}
function _classCallCheck$1(instance, Constructor) {
	if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties$1(target, props) {
	for (var i = 0; i < props.length; i++) {
		var descriptor = props[i];
		descriptor.enumerable = descriptor.enumerable || false;
		descriptor.configurable = true;
		if ("value" in descriptor) descriptor.writable = true;
		Object.defineProperty(target, _toPropertyKey$1(descriptor.key), descriptor);
	}
}
function _createClass$1(Constructor, protoProps, staticProps) {
	if (protoProps) _defineProperties$1(Constructor.prototype, protoProps);
	if (staticProps) _defineProperties$1(Constructor, staticProps);
	Object.defineProperty(Constructor, "prototype", { writable: false });
	return Constructor;
}
function _callSuper$1(t, o, e) {
	return o = _getPrototypeOf$1(o), _possibleConstructorReturn$1(t, _isNativeReflectConstruct$1() ? Reflect.construct(o, e || [], _getPrototypeOf$1(t).constructor) : o.apply(t, e));
}
function _possibleConstructorReturn$1(self, call) {
	if (call && (_typeof$1(call) === "object" || typeof call === "function")) return call;
	else if (call !== void 0) throw new TypeError("Derived constructors may only return object or undefined");
	return _assertThisInitialized$1(self);
}
function _assertThisInitialized$1(self) {
	if (self === void 0) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	return self;
}
function _isNativeReflectConstruct$1() {
	try {
		var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
	} catch (t$1) {}
	return (_isNativeReflectConstruct$1 = function _isNativeReflectConstruct$3() {
		return !!t;
	})();
}
function _getPrototypeOf$1(o) {
	_getPrototypeOf$1 = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf$3(o$1) {
		return o$1.__proto__ || Object.getPrototypeOf(o$1);
	};
	return _getPrototypeOf$1(o);
}
function _inherits$1(subClass, superClass) {
	if (typeof superClass !== "function" && superClass !== null) throw new TypeError("Super expression must either be null or a function");
	subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: {
		value: subClass,
		writable: true,
		configurable: true
	} });
	Object.defineProperty(subClass, "prototype", { writable: false });
	if (superClass) _setPrototypeOf$1(subClass, superClass);
}
function _setPrototypeOf$1(o, p) {
	_setPrototypeOf$1 = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf$3(o$1, p$1) {
		o$1.__proto__ = p$1;
		return o$1;
	};
	return _setPrototypeOf$1(o, p);
}
function _defineProperty$1(obj, key, value) {
	key = _toPropertyKey$1(key);
	if (key in obj) Object.defineProperty(obj, key, {
		value,
		enumerable: true,
		configurable: true,
		writable: true
	});
	else obj[key] = value;
	return obj;
}
function _toPropertyKey$1(t) {
	var i = _toPrimitive$1(t, "string");
	return "symbol" == _typeof$1(i) ? i : i + "";
}
function _toPrimitive$1(t, r) {
	if ("object" != _typeof$1(t) || !t) return t;
	var e = t[Symbol.toPrimitive];
	if (void 0 !== e) {
		var i = e.call(t, r || "default");
		if ("object" != _typeof$1(i)) return i;
		throw new TypeError("@@toPrimitive must return a primitive value.");
	}
	return ("string" === r ? String : Number)(t);
}
var RADIAN = Math.PI / 180;
var eps = 1e-5;
var PolarAngleAxis = /* @__PURE__ */ function(_PureComponent) {
	function PolarAngleAxis$1() {
		_classCallCheck$1(this, PolarAngleAxis$1);
		return _callSuper$1(this, PolarAngleAxis$1, arguments);
	}
	_inherits$1(PolarAngleAxis$1, _PureComponent);
	return _createClass$1(PolarAngleAxis$1, [
		{
			key: "getTickLineCoord",
			value: function getTickLineCoord(data) {
				var _this$props = this.props, cx = _this$props.cx, cy = _this$props.cy, radius = _this$props.radius, orientation = _this$props.orientation;
				var tickLineSize = _this$props.tickSize || 8;
				var p1 = polarToCartesian(cx, cy, radius, data.coordinate);
				var p2 = polarToCartesian(cx, cy, radius + (orientation === "inner" ? -1 : 1) * tickLineSize, data.coordinate);
				return {
					x1: p1.x,
					y1: p1.y,
					x2: p2.x,
					y2: p2.y
				};
			}
		},
		{
			key: "getTickTextAnchor",
			value: function getTickTextAnchor(data) {
				var orientation = this.props.orientation;
				var cos = Math.cos(-data.coordinate * RADIAN);
				var textAnchor;
				if (cos > eps) textAnchor = orientation === "outer" ? "start" : "end";
				else if (cos < -eps) textAnchor = orientation === "outer" ? "end" : "start";
				else textAnchor = "middle";
				return textAnchor;
			}
		},
		{
			key: "renderAxisLine",
			value: function renderAxisLine() {
				var _this$props2 = this.props, cx = _this$props2.cx, cy = _this$props2.cy, radius = _this$props2.radius, axisLine = _this$props2.axisLine, axisLineType = _this$props2.axisLineType;
				var props = _objectSpread$1(_objectSpread$1({}, filterProps(this.props, false)), {}, { fill: "none" }, filterProps(axisLine, false));
				if (axisLineType === "circle") return /* @__PURE__ */ import_react.createElement(Dot, _extends$1({ className: "recharts-polar-angle-axis-line" }, props, {
					cx,
					cy,
					r: radius
				}));
				var points = this.props.ticks.map(function(entry) {
					return polarToCartesian(cx, cy, radius, entry.coordinate);
				});
				return /* @__PURE__ */ import_react.createElement(Polygon, _extends$1({ className: "recharts-polar-angle-axis-line" }, props, { points }));
			}
		},
		{
			key: "renderTicks",
			value: function renderTicks() {
				var _this = this;
				var _this$props3 = this.props, ticks = _this$props3.ticks, tick = _this$props3.tick, tickLine = _this$props3.tickLine, tickFormatter = _this$props3.tickFormatter, stroke = _this$props3.stroke;
				var axisProps = filterProps(this.props, false);
				var customTickProps = filterProps(tick, false);
				var tickLineProps = _objectSpread$1(_objectSpread$1({}, axisProps), {}, { fill: "none" }, filterProps(tickLine, false));
				var items = ticks.map(function(entry, i) {
					var lineCoord = _this.getTickLineCoord(entry);
					var tickProps = _objectSpread$1(_objectSpread$1(_objectSpread$1({ textAnchor: _this.getTickTextAnchor(entry) }, axisProps), {}, {
						stroke: "none",
						fill: stroke
					}, customTickProps), {}, {
						index: i,
						payload: entry,
						x: lineCoord.x2,
						y: lineCoord.y2
					});
					return /* @__PURE__ */ import_react.createElement(Layer, _extends$1({
						className: clsx_default("recharts-polar-angle-axis-tick", getTickClassName(tick)),
						key: "tick-".concat(entry.coordinate)
					}, adaptEventsOfChild(_this.props, entry, i)), tickLine && /* @__PURE__ */ import_react.createElement("line", _extends$1({ className: "recharts-polar-angle-axis-tick-line" }, tickLineProps, lineCoord)), tick && PolarAngleAxis$1.renderTickItem(tick, tickProps, tickFormatter ? tickFormatter(entry.value, i) : entry.value));
				});
				return /* @__PURE__ */ import_react.createElement(Layer, { className: "recharts-polar-angle-axis-ticks" }, items);
			}
		},
		{
			key: "render",
			value: function render() {
				var _this$props4 = this.props, ticks = _this$props4.ticks, radius = _this$props4.radius, axisLine = _this$props4.axisLine;
				if (radius <= 0 || !ticks || !ticks.length) return null;
				return /* @__PURE__ */ import_react.createElement(Layer, { className: clsx_default("recharts-polar-angle-axis", this.props.className) }, axisLine && this.renderAxisLine(), this.renderTicks());
			}
		}
	], [{
		key: "renderTickItem",
		value: function renderTickItem(option, props, value) {
			var tickItem;
			if (/* @__PURE__ */ import_react.isValidElement(option)) tickItem = /* @__PURE__ */ import_react.cloneElement(option, props);
			else if ((0, import_isFunction$1.default)(option)) tickItem = option(props);
			else tickItem = /* @__PURE__ */ import_react.createElement(Text, _extends$1({}, props, { className: "recharts-polar-angle-axis-tick-value" }), value);
			return tickItem;
		}
	}]);
}(import_react.PureComponent);
_defineProperty$1(PolarAngleAxis, "displayName", "PolarAngleAxis");
_defineProperty$1(PolarAngleAxis, "axisType", "angleAxis");
_defineProperty$1(PolarAngleAxis, "defaultProps", {
	type: "category",
	angleAxisId: 0,
	scale: "auto",
	cx: 0,
	cy: 0,
	orientation: "outer",
	axisLine: true,
	tickLine: true,
	tickSize: 8,
	tick: true,
	hide: false,
	allowDuplicatedCategory: true
});
var import_get = /* @__PURE__ */ __toESM(require_get());
var import_isEqual = /* @__PURE__ */ __toESM(require_isEqual());
var import_isNil = /* @__PURE__ */ __toESM(require_isNil());
var import_isFunction = /* @__PURE__ */ __toESM(require_isFunction());
var _Pie;
function _typeof(o) {
	"@babel/helpers - typeof";
	return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o$1) {
		return typeof o$1;
	} : function(o$1) {
		return o$1 && "function" == typeof Symbol && o$1.constructor === Symbol && o$1 !== Symbol.prototype ? "symbol" : typeof o$1;
	}, _typeof(o);
}
function _extends() {
	_extends = Object.assign ? Object.assign.bind() : function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends.apply(this, arguments);
}
function ownKeys(e, r) {
	var t = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var o = Object.getOwnPropertySymbols(e);
		r && (o = o.filter(function(r$1) {
			return Object.getOwnPropertyDescriptor(e, r$1).enumerable;
		})), t.push.apply(t, o);
	}
	return t;
}
function _objectSpread(e) {
	for (var r = 1; r < arguments.length; r++) {
		var t = null != arguments[r] ? arguments[r] : {};
		r % 2 ? ownKeys(Object(t), !0).forEach(function(r$1) {
			_defineProperty(e, r$1, t[r$1]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r$1) {
			Object.defineProperty(e, r$1, Object.getOwnPropertyDescriptor(t, r$1));
		});
	}
	return e;
}
function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(target, props) {
	for (var i = 0; i < props.length; i++) {
		var descriptor = props[i];
		descriptor.enumerable = descriptor.enumerable || false;
		descriptor.configurable = true;
		if ("value" in descriptor) descriptor.writable = true;
		Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
	}
}
function _createClass(Constructor, protoProps, staticProps) {
	if (protoProps) _defineProperties(Constructor.prototype, protoProps);
	if (staticProps) _defineProperties(Constructor, staticProps);
	Object.defineProperty(Constructor, "prototype", { writable: false });
	return Constructor;
}
function _callSuper(t, o, e) {
	return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e));
}
function _possibleConstructorReturn(self, call) {
	if (call && (_typeof(call) === "object" || typeof call === "function")) return call;
	else if (call !== void 0) throw new TypeError("Derived constructors may only return object or undefined");
	return _assertThisInitialized(self);
}
function _assertThisInitialized(self) {
	if (self === void 0) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	return self;
}
function _isNativeReflectConstruct() {
	try {
		var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
	} catch (t$1) {}
	return (_isNativeReflectConstruct = function _isNativeReflectConstruct$3() {
		return !!t;
	})();
}
function _getPrototypeOf(o) {
	_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf$3(o$1) {
		return o$1.__proto__ || Object.getPrototypeOf(o$1);
	};
	return _getPrototypeOf(o);
}
function _inherits(subClass, superClass) {
	if (typeof superClass !== "function" && superClass !== null) throw new TypeError("Super expression must either be null or a function");
	subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: {
		value: subClass,
		writable: true,
		configurable: true
	} });
	Object.defineProperty(subClass, "prototype", { writable: false });
	if (superClass) _setPrototypeOf(subClass, superClass);
}
function _setPrototypeOf(o, p) {
	_setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf$3(o$1, p$1) {
		o$1.__proto__ = p$1;
		return o$1;
	};
	return _setPrototypeOf(o, p);
}
function _defineProperty(obj, key, value) {
	key = _toPropertyKey(key);
	if (key in obj) Object.defineProperty(obj, key, {
		value,
		enumerable: true,
		configurable: true,
		writable: true
	});
	else obj[key] = value;
	return obj;
}
function _toPropertyKey(t) {
	var i = _toPrimitive(t, "string");
	return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
	if ("object" != _typeof(t) || !t) return t;
	var e = t[Symbol.toPrimitive];
	if (void 0 !== e) {
		var i = e.call(t, r || "default");
		if ("object" != _typeof(i)) return i;
		throw new TypeError("@@toPrimitive must return a primitive value.");
	}
	return ("string" === r ? String : Number)(t);
}
var Pie = /* @__PURE__ */ function(_PureComponent) {
	function Pie$1(props) {
		var _this;
		_classCallCheck(this, Pie$1);
		_this = _callSuper(this, Pie$1, [props]);
		_defineProperty(_this, "pieRef", null);
		_defineProperty(_this, "sectorRefs", []);
		_defineProperty(_this, "id", uniqueId("recharts-pie-"));
		_defineProperty(_this, "handleAnimationEnd", function() {
			var onAnimationEnd = _this.props.onAnimationEnd;
			_this.setState({ isAnimationFinished: true });
			if ((0, import_isFunction.default)(onAnimationEnd)) onAnimationEnd();
		});
		_defineProperty(_this, "handleAnimationStart", function() {
			var onAnimationStart = _this.props.onAnimationStart;
			_this.setState({ isAnimationFinished: false });
			if ((0, import_isFunction.default)(onAnimationStart)) onAnimationStart();
		});
		_this.state = {
			isAnimationFinished: !props.isAnimationActive,
			prevIsAnimationActive: props.isAnimationActive,
			prevAnimationId: props.animationId,
			sectorToFocus: 0
		};
		return _this;
	}
	_inherits(Pie$1, _PureComponent);
	return _createClass(Pie$1, [
		{
			key: "isActiveIndex",
			value: function isActiveIndex(i) {
				var activeIndex = this.props.activeIndex;
				if (Array.isArray(activeIndex)) return activeIndex.indexOf(i) !== -1;
				return i === activeIndex;
			}
		},
		{
			key: "hasActiveIndex",
			value: function hasActiveIndex() {
				var activeIndex = this.props.activeIndex;
				return Array.isArray(activeIndex) ? activeIndex.length !== 0 : activeIndex || activeIndex === 0;
			}
		},
		{
			key: "renderLabels",
			value: function renderLabels(sectors) {
				if (this.props.isAnimationActive && !this.state.isAnimationFinished) return null;
				var _this$props = this.props, label = _this$props.label, labelLine = _this$props.labelLine, dataKey = _this$props.dataKey, valueKey = _this$props.valueKey;
				var pieProps = filterProps(this.props, false);
				var customLabelProps = filterProps(label, false);
				var customLabelLineProps = filterProps(labelLine, false);
				var offsetRadius = label && label.offsetRadius || 20;
				var labels = sectors.map(function(entry, i) {
					var midAngle = (entry.startAngle + entry.endAngle) / 2;
					var endPoint = polarToCartesian(entry.cx, entry.cy, entry.outerRadius + offsetRadius, midAngle);
					var labelProps = _objectSpread(_objectSpread(_objectSpread(_objectSpread({}, pieProps), entry), {}, { stroke: "none" }, customLabelProps), {}, {
						index: i,
						textAnchor: Pie$1.getTextAnchor(endPoint.x, entry.cx)
					}, endPoint);
					var lineProps = _objectSpread(_objectSpread(_objectSpread(_objectSpread({}, pieProps), entry), {}, {
						fill: "none",
						stroke: entry.fill
					}, customLabelLineProps), {}, {
						index: i,
						points: [polarToCartesian(entry.cx, entry.cy, entry.outerRadius, midAngle), endPoint]
					});
					var realDataKey = dataKey;
					if ((0, import_isNil.default)(dataKey) && (0, import_isNil.default)(valueKey)) realDataKey = "value";
					else if ((0, import_isNil.default)(dataKey)) realDataKey = valueKey;
					return /* @__PURE__ */ import_react.createElement(Layer, { key: "label-".concat(entry.startAngle, "-").concat(entry.endAngle, "-").concat(entry.midAngle, "-").concat(i) }, labelLine && Pie$1.renderLabelLineItem(labelLine, lineProps, "line"), Pie$1.renderLabelItem(label, labelProps, getValueByDataKey(entry, realDataKey)));
				});
				return /* @__PURE__ */ import_react.createElement(Layer, { className: "recharts-pie-labels" }, labels);
			}
		},
		{
			key: "renderSectorsStatically",
			value: function renderSectorsStatically(sectors) {
				var _this2 = this;
				var _this$props2 = this.props, activeShape = _this$props2.activeShape, blendStroke = _this$props2.blendStroke, inactiveShapeProp = _this$props2.inactiveShape;
				return sectors.map(function(entry, i) {
					if ((entry === null || entry === void 0 ? void 0 : entry.startAngle) === 0 && (entry === null || entry === void 0 ? void 0 : entry.endAngle) === 0 && sectors.length !== 1) return null;
					var isActive = _this2.isActiveIndex(i);
					var inactiveShape = inactiveShapeProp && _this2.hasActiveIndex() ? inactiveShapeProp : null;
					var sectorOptions = isActive ? activeShape : inactiveShape;
					var sectorProps = _objectSpread(_objectSpread({}, entry), {}, {
						stroke: blendStroke ? entry.fill : entry.stroke,
						tabIndex: -1
					});
					return /* @__PURE__ */ import_react.createElement(Layer, _extends({
						ref: function ref(_ref) {
							if (_ref && !_this2.sectorRefs.includes(_ref)) _this2.sectorRefs.push(_ref);
						},
						tabIndex: -1,
						className: "recharts-pie-sector"
					}, adaptEventsOfChild(_this2.props, entry, i), { key: "sector-".concat(entry === null || entry === void 0 ? void 0 : entry.startAngle, "-").concat(entry === null || entry === void 0 ? void 0 : entry.endAngle, "-").concat(entry.midAngle, "-").concat(i) }), /* @__PURE__ */ import_react.createElement(Shape, _extends({
						option: sectorOptions,
						isActive,
						shapeType: "sector"
					}, sectorProps)));
				});
			}
		},
		{
			key: "renderSectorsWithAnimation",
			value: function renderSectorsWithAnimation() {
				var _this3 = this;
				var _this$props3 = this.props, sectors = _this$props3.sectors, isAnimationActive = _this$props3.isAnimationActive, animationBegin = _this$props3.animationBegin, animationDuration = _this$props3.animationDuration, animationEasing = _this$props3.animationEasing, animationId = _this$props3.animationId;
				var _this$state = this.state, prevSectors = _this$state.prevSectors, prevIsAnimationActive = _this$state.prevIsAnimationActive;
				return /* @__PURE__ */ import_react.createElement(es6_default, {
					begin: animationBegin,
					duration: animationDuration,
					isActive: isAnimationActive,
					easing: animationEasing,
					from: { t: 0 },
					to: { t: 1 },
					key: "pie-".concat(animationId, "-").concat(prevIsAnimationActive),
					onAnimationStart: this.handleAnimationStart,
					onAnimationEnd: this.handleAnimationEnd
				}, function(_ref2) {
					var t = _ref2.t;
					var stepData = [];
					var curAngle = (sectors && sectors[0]).startAngle;
					sectors.forEach(function(entry, index) {
						var prev = prevSectors && prevSectors[index];
						var paddingAngle = index > 0 ? (0, import_get.default)(entry, "paddingAngle", 0) : 0;
						if (prev) {
							var angleIp = interpolateNumber(prev.endAngle - prev.startAngle, entry.endAngle - entry.startAngle);
							var latest = _objectSpread(_objectSpread({}, entry), {}, {
								startAngle: curAngle + paddingAngle,
								endAngle: curAngle + angleIp(t) + paddingAngle
							});
							stepData.push(latest);
							curAngle = latest.endAngle;
						} else {
							var endAngle = entry.endAngle, startAngle = entry.startAngle;
							var deltaAngle = interpolateNumber(0, endAngle - startAngle)(t);
							var _latest = _objectSpread(_objectSpread({}, entry), {}, {
								startAngle: curAngle + paddingAngle,
								endAngle: curAngle + deltaAngle + paddingAngle
							});
							stepData.push(_latest);
							curAngle = _latest.endAngle;
						}
					});
					return /* @__PURE__ */ import_react.createElement(Layer, null, _this3.renderSectorsStatically(stepData));
				});
			}
		},
		{
			key: "attachKeyboardHandlers",
			value: function attachKeyboardHandlers(pieRef) {
				var _this4 = this;
				pieRef.onkeydown = function(e) {
					if (!e.altKey) switch (e.key) {
						case "ArrowLeft":
							var next = ++_this4.state.sectorToFocus % _this4.sectorRefs.length;
							_this4.sectorRefs[next].focus();
							_this4.setState({ sectorToFocus: next });
							break;
						case "ArrowRight":
							var _next = --_this4.state.sectorToFocus < 0 ? _this4.sectorRefs.length - 1 : _this4.state.sectorToFocus % _this4.sectorRefs.length;
							_this4.sectorRefs[_next].focus();
							_this4.setState({ sectorToFocus: _next });
							break;
						case "Escape":
							_this4.sectorRefs[_this4.state.sectorToFocus].blur();
							_this4.setState({ sectorToFocus: 0 });
							break;
						default:
					}
				};
			}
		},
		{
			key: "renderSectors",
			value: function renderSectors() {
				var _this$props4 = this.props, sectors = _this$props4.sectors, isAnimationActive = _this$props4.isAnimationActive;
				var prevSectors = this.state.prevSectors;
				if (isAnimationActive && sectors && sectors.length && (!prevSectors || !(0, import_isEqual.default)(prevSectors, sectors))) return this.renderSectorsWithAnimation();
				return this.renderSectorsStatically(sectors);
			}
		},
		{
			key: "componentDidMount",
			value: function componentDidMount() {
				if (this.pieRef) this.attachKeyboardHandlers(this.pieRef);
			}
		},
		{
			key: "render",
			value: function render() {
				var _this5 = this;
				var _this$props5 = this.props, hide = _this$props5.hide, sectors = _this$props5.sectors, className = _this$props5.className, label = _this$props5.label, cx = _this$props5.cx, cy = _this$props5.cy, innerRadius = _this$props5.innerRadius, outerRadius = _this$props5.outerRadius, isAnimationActive = _this$props5.isAnimationActive;
				var isAnimationFinished = this.state.isAnimationFinished;
				if (hide || !sectors || !sectors.length || !isNumber(cx) || !isNumber(cy) || !isNumber(innerRadius) || !isNumber(outerRadius)) return null;
				var layerClass = clsx_default("recharts-pie", className);
				return /* @__PURE__ */ import_react.createElement(Layer, {
					tabIndex: this.props.rootTabIndex,
					className: layerClass,
					ref: function ref(_ref3) {
						_this5.pieRef = _ref3;
					}
				}, this.renderSectors(), label && this.renderLabels(sectors), Label$1.renderCallByParent(this.props, null, false), (!isAnimationActive || isAnimationFinished) && LabelList.renderCallByParent(this.props, sectors, false));
			}
		}
	], [
		{
			key: "getDerivedStateFromProps",
			value: function getDerivedStateFromProps(nextProps, prevState) {
				if (prevState.prevIsAnimationActive !== nextProps.isAnimationActive) return {
					prevIsAnimationActive: nextProps.isAnimationActive,
					prevAnimationId: nextProps.animationId,
					curSectors: nextProps.sectors,
					prevSectors: [],
					isAnimationFinished: true
				};
				if (nextProps.isAnimationActive && nextProps.animationId !== prevState.prevAnimationId) return {
					prevAnimationId: nextProps.animationId,
					curSectors: nextProps.sectors,
					prevSectors: prevState.curSectors,
					isAnimationFinished: true
				};
				if (nextProps.sectors !== prevState.curSectors) return {
					curSectors: nextProps.sectors,
					isAnimationFinished: true
				};
				return null;
			}
		},
		{
			key: "getTextAnchor",
			value: function getTextAnchor(x, cx) {
				if (x > cx) return "start";
				if (x < cx) return "end";
				return "middle";
			}
		},
		{
			key: "renderLabelLineItem",
			value: function renderLabelLineItem(option, props, key) {
				if (/* @__PURE__ */ import_react.isValidElement(option)) return /* @__PURE__ */ import_react.cloneElement(option, props);
				if ((0, import_isFunction.default)(option)) return option(props);
				var className = clsx_default("recharts-pie-label-line", typeof option !== "boolean" ? option.className : "");
				return /* @__PURE__ */ import_react.createElement(Curve, _extends({}, props, {
					key,
					type: "linear",
					className
				}));
			}
		},
		{
			key: "renderLabelItem",
			value: function renderLabelItem(option, props, value) {
				if (/* @__PURE__ */ import_react.isValidElement(option)) return /* @__PURE__ */ import_react.cloneElement(option, props);
				var label = value;
				if ((0, import_isFunction.default)(option)) {
					label = option(props);
					if (/* @__PURE__ */ import_react.isValidElement(label)) return label;
				}
				var className = clsx_default("recharts-pie-label-text", typeof option !== "boolean" && !(0, import_isFunction.default)(option) ? option.className : "");
				return /* @__PURE__ */ import_react.createElement(Text, _extends({}, props, {
					alignmentBaseline: "middle",
					className
				}), label);
			}
		}
	]);
}(import_react.PureComponent);
_Pie = Pie;
_defineProperty(Pie, "displayName", "Pie");
_defineProperty(Pie, "defaultProps", {
	stroke: "#fff",
	fill: "#808080",
	legendType: "rect",
	cx: "50%",
	cy: "50%",
	startAngle: 0,
	endAngle: 360,
	innerRadius: 0,
	outerRadius: "80%",
	paddingAngle: 0,
	labelLine: true,
	hide: false,
	minAngle: 0,
	isAnimationActive: !Global.isSsr,
	animationBegin: 400,
	animationDuration: 1500,
	animationEasing: "ease",
	nameKey: "name",
	blendStroke: false,
	rootTabIndex: 0
});
_defineProperty(Pie, "parseDeltaAngle", function(startAngle, endAngle) {
	return mathSign(endAngle - startAngle) * Math.min(Math.abs(endAngle - startAngle), 360);
});
_defineProperty(Pie, "getRealPieData", function(itemProps) {
	var data = itemProps.data, children = itemProps.children;
	var presentationProps = filterProps(itemProps, false);
	var cells = findAllByType(children, Cell);
	if (data && data.length) return data.map(function(entry, index) {
		return _objectSpread(_objectSpread(_objectSpread({ payload: entry }, presentationProps), entry), cells && cells[index] && cells[index].props);
	});
	if (cells && cells.length) return cells.map(function(cell) {
		return _objectSpread(_objectSpread({}, presentationProps), cell.props);
	});
	return [];
});
_defineProperty(Pie, "parseCoordinateOfPie", function(itemProps, offset) {
	var top = offset.top, left = offset.left, width = offset.width, height = offset.height;
	var maxPieRadius = getMaxRadius(width, height);
	return {
		cx: left + getPercentValue(itemProps.cx, width, width / 2),
		cy: top + getPercentValue(itemProps.cy, height, height / 2),
		innerRadius: getPercentValue(itemProps.innerRadius, maxPieRadius, 0),
		outerRadius: getPercentValue(itemProps.outerRadius, maxPieRadius, maxPieRadius * .8),
		maxRadius: itemProps.maxRadius || Math.sqrt(width * width + height * height) / 2
	};
});
_defineProperty(Pie, "getComposedData", function(_ref4) {
	var item = _ref4.item, offset = _ref4.offset;
	var itemProps = item.type.defaultProps !== void 0 ? _objectSpread(_objectSpread({}, item.type.defaultProps), item.props) : item.props;
	var pieData = _Pie.getRealPieData(itemProps);
	if (!pieData || !pieData.length) return null;
	var cornerRadius = itemProps.cornerRadius, startAngle = itemProps.startAngle, endAngle = itemProps.endAngle, paddingAngle = itemProps.paddingAngle, dataKey = itemProps.dataKey, nameKey = itemProps.nameKey, valueKey = itemProps.valueKey, tooltipType = itemProps.tooltipType;
	var minAngle = Math.abs(itemProps.minAngle);
	var coordinate = _Pie.parseCoordinateOfPie(itemProps, offset);
	var deltaAngle = _Pie.parseDeltaAngle(startAngle, endAngle);
	var absDeltaAngle = Math.abs(deltaAngle);
	var realDataKey = dataKey;
	if ((0, import_isNil.default)(dataKey) && (0, import_isNil.default)(valueKey)) {
		warn(false, "Use \"dataKey\" to specify the value of pie,\n      the props \"valueKey\" will be deprecated in 1.1.0");
		realDataKey = "value";
	} else if ((0, import_isNil.default)(dataKey)) {
		warn(false, "Use \"dataKey\" to specify the value of pie,\n      the props \"valueKey\" will be deprecated in 1.1.0");
		realDataKey = valueKey;
	}
	var notZeroItemCount = pieData.filter(function(entry) {
		return getValueByDataKey(entry, realDataKey, 0) !== 0;
	}).length;
	var totalPadingAngle = (absDeltaAngle >= 360 ? notZeroItemCount : notZeroItemCount - 1) * paddingAngle;
	var realTotalAngle = absDeltaAngle - notZeroItemCount * minAngle - totalPadingAngle;
	var sum = pieData.reduce(function(result, entry) {
		var val = getValueByDataKey(entry, realDataKey, 0);
		return result + (isNumber(val) ? val : 0);
	}, 0);
	var sectors;
	if (sum > 0) {
		var prev;
		sectors = pieData.map(function(entry, i) {
			var val = getValueByDataKey(entry, realDataKey, 0);
			var name = getValueByDataKey(entry, nameKey, i);
			var percent = (isNumber(val) ? val : 0) / sum;
			var tempStartAngle;
			if (i) tempStartAngle = prev.endAngle + mathSign(deltaAngle) * paddingAngle * (val !== 0 ? 1 : 0);
			else tempStartAngle = startAngle;
			var tempEndAngle = tempStartAngle + mathSign(deltaAngle) * ((val !== 0 ? minAngle : 0) + percent * realTotalAngle);
			var midAngle = (tempStartAngle + tempEndAngle) / 2;
			var middleRadius = (coordinate.innerRadius + coordinate.outerRadius) / 2;
			prev = _objectSpread(_objectSpread(_objectSpread({
				percent,
				cornerRadius,
				name,
				tooltipPayload: [{
					name,
					value: val,
					payload: entry,
					dataKey: realDataKey,
					type: tooltipType
				}],
				midAngle,
				middleRadius,
				tooltipPosition: polarToCartesian(coordinate.cx, coordinate.cy, middleRadius, midAngle)
			}, entry), coordinate), {}, {
				value: getValueByDataKey(entry, realDataKey),
				startAngle: tempStartAngle,
				endAngle: tempEndAngle,
				payload: entry,
				paddingAngle: mathSign(deltaAngle) * paddingAngle
			});
			return prev;
		});
	}
	return _objectSpread(_objectSpread({}, coordinate), {}, {
		sectors,
		data: pieData
	});
});
var PieChart = generateCategoricalChart({
	chartName: "PieChart",
	GraphicalChild: Pie,
	validateTooltipEventTypes: ["item"],
	defaultTooltipEventType: "item",
	legendContent: "children",
	axisComponents: [{
		axisType: "angleAxis",
		AxisComp: PolarAngleAxis
	}, {
		axisType: "radiusAxis",
		AxisComp: PolarRadiusAxis
	}],
	formatAxisMap,
	defaultProps: {
		layout: "centric",
		startAngle: 0,
		endAngle: 360,
		cx: "50%",
		cy: "50%",
		innerRadius: 0,
		outerRadius: "80%"
	}
});
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime(), 1);
function HistoryPage() {
	const { orders, currentUser, checkPermission, effectiveRole } = useAppStore();
	const [search, setSearch] = (0, import_react.useState)("");
	const [showCompleted, setShowCompleted] = (0, import_react.useState)(false);
	const [dentistFilter, setDentistFilter] = (0, import_react.useState)("all");
	const [historySector, setHistorySector] = (0, import_react.useState)(() => sessionStorage.getItem("vitali_history_lab") || "ALL");
	(0, import_react.useEffect)(() => {
		sessionStorage.setItem("vitali_history_lab", historySector);
	}, [historySector]);
	const isCollaboratorOrAdmin = [
		"admin",
		"master",
		"receptionist",
		"technical_assistant",
		"financial",
		"relationship_manager"
	].includes(effectiveRole || "");
	const canSelectDentist = checkPermission("history", "select_dentist") || isCollaboratorOrAdmin;
	const canShowCompleted = checkPermission("history", "show_completed") || isCollaboratorOrAdmin;
	const canSearch = checkPermission("history", "search") || isCollaboratorOrAdmin;
	const availableDentists = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		orders.forEach((o) => {
			if (o.dentistId && o.dentistName && o.dentistRole !== "master") map.set(o.dentistId, o.dentistName);
		});
		return Array.from(map.entries()).map(([id, name]) => ({
			id,
			name
		})).sort((a, b) => a.name.localeCompare(b.name));
	}, [orders]);
	const sectorFilteredOrders = (0, import_react.useMemo)(() => {
		if (historySector === "ALL") return orders;
		return orders.filter((o) => o.sector && o.sector.toUpperCase().trim() === historySector);
	}, [orders, historySector]);
	const filtered = sectorFilteredOrders.filter((o) => {
		if (o.dentistRole === "master") return false;
		if (canSearch && search.trim()) {
			if (!(o.patientName.toLowerCase().includes(search.toLowerCase()) || o.friendlyId.toLowerCase().includes(search.toLowerCase()))) return false;
		}
		if (canSelectDentist && dentistFilter !== "all" && o.dentistId !== dentistFilter) return false;
		if ((o.status === "completed" || o.status === "delivered" || o.status === "cancelled") && !showCompleted && (!canSearch || !search.trim())) return false;
		return true;
	});
	const kpis = (0, import_react.useMemo)(() => {
		const validOrders = sectorFilteredOrders.filter((o) => o.dentistRole !== "master");
		return {
			total: validOrders.length,
			completed: validOrders.filter((o) => ["completed", "delivered"].includes(o.status)).length,
			pending: validOrders.filter((o) => ["pending", "in_production"].includes(o.status)).length
		};
	}, [sectorFilteredOrders]);
	const statusChartData = (0, import_react.useMemo)(() => {
		const validOrders = sectorFilteredOrders.filter((o) => o.dentistRole !== "master");
		const counts = {
			pending: 0,
			in_production: 0,
			completed: 0,
			delivered: 0
		};
		validOrders.forEach((o) => {
			if (counts[o.status] !== void 0) counts[o.status]++;
		});
		return [
			{
				status: "Pendente",
				count: counts.pending,
				fill: "hsl(var(--chart-1))"
			},
			{
				status: "Em Produção",
				count: counts.in_production,
				fill: "hsl(var(--chart-2))"
			},
			{
				status: "Finalizado",
				count: counts.completed,
				fill: "hsl(var(--chart-3))"
			},
			{
				status: "Entregue",
				count: counts.delivered,
				fill: "hsl(var(--chart-4))"
			}
		].filter((d) => d.count > 0);
	}, [sectorFilteredOrders]);
	const timeChartData = (0, import_react.useMemo)(() => {
		const validOrders = sectorFilteredOrders.filter((o) => o.dentistRole !== "master");
		const map = /* @__PURE__ */ new Map();
		validOrders.forEach((o) => {
			const d = new Date(o.createdAt);
			if (isNaN(d.getTime())) return;
			const monthYear = format(d, "MMM/yy", { locale: ptBR });
			map.set(monthYear, (map.get(monthYear) || 0) + 1);
		});
		const data = [];
		for (let i = 5; i >= 0; i--) {
			const d = /* @__PURE__ */ new Date();
			d.setMonth(d.getMonth() - i);
			const monthYear = format(d, "MMM/yy", { locale: ptBR });
			data.push({
				month: monthYear,
				pedidos: map.get(monthYear) || 0
			});
		}
		return data;
	}, [sectorFilteredOrders]);
	const statusChartConfig = {
		pending: {
			label: "Pendente",
			color: "hsl(var(--chart-1))"
		},
		in_production: {
			label: "Em Produção",
			color: "hsl(var(--chart-2))"
		},
		completed: {
			label: "Finalizado",
			color: "hsl(var(--chart-3))"
		},
		delivered: {
			label: "Entregue",
			color: "hsl(var(--chart-4))"
		}
	};
	const timeChartConfig = { pedidos: {
		label: "Pedidos",
		color: "hsl(var(--primary))"
	} };
	if (!currentUser) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex h-[50vh] items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-8 w-8 animate-spin text-muted-foreground" })
	});
	const showDentistCol = effectiveRole !== "dentist" && effectiveRole !== "laboratory";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 max-w-7xl mx-auto",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-2xl font-bold tracking-tight text-primary uppercase",
				children: isCollaboratorOrAdmin ? "Histórico Global" : "Meu Histórico"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted-foreground",
				children: "Consulte todos os casos e a evolução dos trabalhos."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
				value: historySector,
				onValueChange: setHistorySector,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectTrigger, {
					className: "w-full md:w-[280px] justify-start text-left font-normal shadow-sm h-10 bg-background border-border uppercase text-xs font-bold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "mr-2 h-4 w-4 opacity-50" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "SELECIONAR LABORATÓRIO" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: "ALL",
						className: "uppercase text-xs font-bold",
						children: "TODOS OS LABORATÓRIOS"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: "SOLUÇÕES CERÂMICAS",
						className: "uppercase text-xs font-bold",
						children: "SOLUÇÕES CERÂMICAS"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: "STÚDIO ACRÍLICO",
						className: "uppercase text-xs font-bold",
						children: "STÚDIO ACRÍLICO"
					})
				] })]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
			defaultValue: "history",
			className: "w-full space-y-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
					className: "bg-muted/50 border shadow-sm w-full justify-start h-auto flex-wrap p-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "history",
						className: "uppercase text-xs font-bold tracking-wider py-2",
						children: isCollaboratorOrAdmin ? "Histórico Global" : "Meu Histórico"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "evolution",
						className: "uppercase text-xs font-bold tracking-wider py-2",
						children: "Evolução dos Trabalhos"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
					value: "history",
					className: "space-y-4 outline-none",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col sm:flex-row justify-end items-start sm:items-center gap-4 w-full",
						children: [
							canSelectDentist && showDentistCol && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: dentistFilter,
								onValueChange: setDentistFilter,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "w-full sm:w-[220px] h-10 bg-background shadow-sm border-border",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "SELECIONAR CLIENTE" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "all",
									children: "TODOS OS CLIENTES"
								}), availableDentists.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: d.id,
									children: d.name
								}, d.id))] })]
							}),
							canShowCompleted && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center space-x-2 bg-background border px-3 py-2 rounded-md h-10 w-full sm:w-auto shadow-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
									id: "show-completed",
									checked: showCompleted,
									onCheckedChange: setShowCompleted
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "show-completed",
									className: "text-sm font-medium cursor-pointer whitespace-nowrap uppercase tracking-wider text-[10px]",
									children: "MOSTRAR CONCLUÍDOS"
								})]
							}),
							canSearch && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative w-full sm:w-72",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									placeholder: "BUSCA POR PACIENTE/ID...",
									className: "pl-9 h-10 shadow-sm",
									value: search,
									onChange: (e) => setSearch(e.target.value)
								})]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						className: "shadow-subtle",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
							className: "p-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
									className: "pl-6",
									children: "ID"
								}),
								showDentistCol && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Clínica/Dentista" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Paciente" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Trabalho" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Data" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
									className: "text-right pr-6",
									children: "Ações"
								})
							] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [filtered.map((order, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "pl-6 font-medium",
									children: order.friendlyId
								}),
								showDentistCol && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: order.dentistName }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: order.patientName }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: order.workType }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: format(new Date(order.createdAt), "dd/MM/yyyy") }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: order.status }) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "text-right pr-6",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-end gap-2",
										children: [order.dentistGroupLink && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "outline",
											size: "icon",
											className: "h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200 hover:border-green-300",
											asChild: true,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
												href: order.dentistGroupLink,
												target: "_blank",
												rel: "noopener noreferrer",
												title: "Contato via WhatsApp",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "h-4 w-4" })
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "ghost",
											size: "sm",
											asChild: true,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
												to: `/order/${order.id}`,
												children: "Detalhes"
											})
										})]
									})
								})
							] }, `${order.id}-${index}`)), filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								colSpan: showDentistCol ? 7 : 6,
								className: "h-24 text-center text-muted-foreground",
								children: "Nenhum pedido encontrado."
							}) })] })] })
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "evolution",
					className: "space-y-6 outline-none",
					children: sectorFilteredOrders.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-64 items-center justify-center rounded-lg border border-dashed bg-muted/30",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted-foreground",
							children: "Nenhum dado encontrado para o laboratório selecionado."
						})
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 md:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
								className: "shadow-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
									className: "flex flex-row items-center justify-between space-y-0 pb-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
										className: "text-sm font-medium",
										children: "Total de Pedidos"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListChecks, { className: "h-4 w-4 text-muted-foreground" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-2xl font-bold",
									children: kpis.total
								}) })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
								className: "shadow-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
									className: "flex flex-row items-center justify-between space-y-0 pb-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
										className: "text-sm font-medium",
										children: "Concluídos"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-emerald-500" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-2xl font-bold text-emerald-600",
									children: kpis.completed
								}) })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
								className: "shadow-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
									className: "flex flex-row items-center justify-between space-y-0 pb-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
										className: "text-sm font-medium",
										children: "Em Andamento"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-4 w-4 text-amber-500" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-2xl font-bold text-amber-600",
									children: kpis.pending
								}) })]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 md:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "shadow-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Pedidos por Status" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartContainer, {
								config: statusChartConfig,
								className: "h-[300px] w-full",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTooltipContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
									data: statusChartData,
									dataKey: "count",
									nameKey: "status",
									innerRadius: 60,
									paddingAngle: 2,
									children: statusChartData.map((entry, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: entry.fill }, `cell-${index}`))
								})] })
							}) })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "shadow-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Volume de Pedidos (Últimos 6 meses)" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartContainer, {
								config: timeChartConfig,
								className: "h-[300px] w-full",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
									data: timeChartData,
									margin: {
										top: 20,
										right: 0,
										left: -20,
										bottom: 0
									},
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
											vertical: false,
											strokeDasharray: "3 3"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
											dataKey: "month",
											tickLine: false,
											axisLine: false,
											tickMargin: 10
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
											tickLine: false,
											axisLine: false,
											tickMargin: 10
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTooltipContent, {}) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
											dataKey: "pedidos",
											fill: "var(--color-pedidos)",
											radius: [
												4,
												4,
												0,
												0
											]
										})
									]
								})
							}) })]
						})]
					})] })
				})
			]
		})]
	});
}
export { HistoryPage as default };

//# sourceMappingURL=History-BtAHkMdK.js.map