/*!
 * Draggabilly PACKAGED v1.1.0
 * Make that shiz draggable
 * http://draggabilly.desandro.com
 * MIT license
 */

(function (t) {
    function e(t) {
        return RegExp("(^|\\s+)" + t + "(\\s+|$)")
    }

    function n(t, e) {
        var n = i(t, e) ? r : o;
        n(t, e)
    }

    var i, o, r;
    "classList"in document.documentElement ? (i = function (t, e) {
        return t.classList.contains(e)
    }, o = function (t, e) {
        t.classList.add(e)
    }, r = function (t, e) {
        t.classList.remove(e)
    }) : (i = function (t, n) {
        return e(n).test(t.className)
    }, o = function (t, e) {
        i(t, e) || (t.className = t.className + " " + e)
    }, r = function (t, n) {
        t.className = t.className.replace(e(n), " ")
    });
    var s = {hasClass: i, addClass: o, removeClass: r, toggleClass: n, has: i, add: o, remove: r, toggle: n};
    "function" == typeof define && define.amd ? define("classie/classie", s) : t.classie = s
})(window), function () {
    function t() {
    }

    function e(t, e) {
        for (var n = t.length; n--;)if (t[n].listener === e)return n;
        return-1
    }

    function n(t) {
        return function () {
            return this[t].apply(this, arguments)
        }
    }

    var i = t.prototype, o = this, r = o.EventEmitter;
    i.getListeners = function (t) {
        var e, n, i = this._getEvents();
        if (t instanceof RegExp) {
            e = {};
            for (n in i)i.hasOwnProperty(n) && t.test(n) && (e[n] = i[n])
        } else e = i[t] || (i[t] = []);
        return e
    }, i.flattenListeners = function (t) {
        var e, n = [];
        for (e = 0; t.length > e; e += 1)n.push(t[e].listener);
        return n
    }, i.getListenersAsObject = function (t) {
        var e, n = this.getListeners(t);
        return n instanceof Array && (e = {}, e[t] = n), e || n
    }, i.addListener = function (t, n) {
        var i, o = this.getListenersAsObject(t), r = "object" == typeof n;
        for (i in o)o.hasOwnProperty(i) && -1 === e(o[i], n) && o[i].push(r ? n : {listener: n, once: !1});
        return this
    }, i.on = n("addListener"), i.addOnceListener = function (t, e) {
        return this.addListener(t, {listener: e, once: !0})
    }, i.once = n("addOnceListener"), i.defineEvent = function (t) {
        return this.getListeners(t), this
    }, i.defineEvents = function (t) {
        for (var e = 0; t.length > e; e += 1)this.defineEvent(t[e]);
        return this
    }, i.removeListener = function (t, n) {
        var i, o, r = this.getListenersAsObject(t);
        for (o in r)r.hasOwnProperty(o) && (i = e(r[o], n), -1 !== i && r[o].splice(i, 1));
        return this
    }, i.off = n("removeListener"), i.addListeners = function (t, e) {
        return this.manipulateListeners(!1, t, e)
    }, i.removeListeners = function (t, e) {
        return this.manipulateListeners(!0, t, e)
    }, i.manipulateListeners = function (t, e, n) {
        var i, o, r = t ? this.removeListener : this.addListener, s = t ? this.removeListeners : this.addListeners;
        if ("object" != typeof e || e instanceof RegExp)for (i = n.length; i--;)r.call(this, e, n[i]); else for (i in e)e.hasOwnProperty(i) && (o = e[i]) && ("function" == typeof o ? r.call(this, i, o) : s.call(this, i, o));
        return this
    }, i.removeEvent = function (t) {
        var e, n = typeof t, i = this._getEvents();
        if ("string" === n)delete i[t]; else if (t instanceof RegExp)for (e in i)i.hasOwnProperty(e) && t.test(e) && delete i[e]; else delete this._events;
        return this
    }, i.removeAllListeners = n("removeEvent"), i.emitEvent = function (t, e) {
        var n, i, o, r, s = this.getListenersAsObject(t);
        for (o in s)if (s.hasOwnProperty(o))for (i = s[o].length; i--;)n = s[o][i], n.once === !0 && this.removeListener(t, n.listener), r = n.listener.apply(this, e || []), r === this._getOnceReturnValue() && this.removeListener(t, n.listener);
        return this
    }, i.trigger = n("emitEvent"), i.emit = function (t) {
        var e = Array.prototype.slice.call(arguments, 1);
        return this.emitEvent(t, e)
    }, i.setOnceReturnValue = function (t) {
        return this._onceReturnValue = t, this
    }, i._getOnceReturnValue = function () {
        return this.hasOwnProperty("_onceReturnValue") ? this._onceReturnValue : !0
    }, i._getEvents = function () {
        return this._events || (this._events = {})
    }, t.noConflict = function () {
        return o.EventEmitter = r, t
    }, "function" == typeof define && define.amd ? define("eventEmitter/EventEmitter", [], function () {
        return t
    }) : "object" == typeof module && module.exports ? module.exports = t : this.EventEmitter = t
}.call(this), function (t) {
    function e(e) {
        var n = t.event;
        return n.target = n.target || n.srcElement || e, n
    }

    var n = document.documentElement, i = function () {
    };
    n.addEventListener ? i = function (t, e, n) {
        t.addEventListener(e, n, !1)
    } : n.attachEvent && (i = function (t, n, i) {
        t[n + i] = i.handleEvent ? function () {
            var n = e(t);
            i.handleEvent.call(i, n)
        } : function () {
            var n = e(t);
            i.call(t, n)
        }, t.attachEvent("on" + n, t[n + i])
    });
    var o = function () {
    };
    n.removeEventListener ? o = function (t, e, n) {
        t.removeEventListener(e, n, !1)
    } : n.detachEvent && (o = function (t, e, n) {
        t.detachEvent("on" + e, t[e + n]);
        try {
            delete t[e + n]
        } catch (i) {
            t[e + n] = void 0
        }
    });
    var r = {bind: i, unbind: o};
    "function" == typeof define && define.amd ? define("eventie/eventie", r) : "object" == typeof exports ? module.exports = r : t.eventie = r
}(this), function (t) {
    function e(t) {
        if (t) {
            if ("string" == typeof i[t])return t;
            t = t.charAt(0).toUpperCase() + t.slice(1);
            for (var e, o = 0, r = n.length; r > o; o++)if (e = n[o] + t, "string" == typeof i[e])return e
        }
    }

    var n = "Webkit Moz ms Ms O".split(" "), i = document.documentElement.style;
    "function" == typeof define && define.amd ? define("get-style-property/get-style-property", [], function () {
        return e
    }) : "object" == typeof exports ? module.exports = e : t.getStyleProperty = e
}(window), function (t) {
    function e(t) {
        var e = parseFloat(t), n = -1 === t.indexOf("%") && !isNaN(e);
        return n && e
    }

    function n() {
        for (var t = {width: 0, height: 0, innerWidth: 0, innerHeight: 0, outerWidth: 0, outerHeight: 0}, e = 0, n = s.length; n > e; e++) {
            var i = s[e];
            t[i] = 0
        }
        return t
    }

    function i(t) {
        function i(t) {
            if ("string" == typeof t && (t = document.querySelector(t)), t && "object" == typeof t && t.nodeType) {
                var i = r(t);
                if ("none" === i.display)return n();
                var o = {};
                o.width = t.offsetWidth, o.height = t.offsetHeight;
                for (var d = o.isBorderBox = !(!u || !i[u] || "border-box" !== i[u]), p = 0, c = s.length; c > p; p++) {
                    var f = s[p], l = i[f];
                    l = a(t, l);
                    var g = parseFloat(l);
                    o[f] = isNaN(g) ? 0 : g
                }
                var v = o.paddingLeft + o.paddingRight, m = o.paddingTop + o.paddingBottom, y = o.marginLeft + o.marginRight, E = o.marginTop + o.marginBottom, x = o.borderLeftWidth + o.borderRightWidth, b = o.borderTopWidth + o.borderBottomWidth, L = d && h, P = e(i.width);
                P !== !1 && (o.width = P + (L ? 0 : v + x));
                var S = e(i.height);
                return S !== !1 && (o.height = S + (L ? 0 : m + b)), o.innerWidth = o.width - (v + x), o.innerHeight = o.height - (m + b), o.outerWidth = o.width + y, o.outerHeight = o.height + E, o
            }
        }

        function a(t, e) {
            if (o || -1 === e.indexOf("%"))return e;
            var n = t.style, i = n.left, r = t.runtimeStyle, s = r && r.left;
            return s && (r.left = t.currentStyle.left), n.left = e, e = n.pixelLeft, n.left = i, s && (r.left = s), e
        }

        var h, u = t("boxSizing");
        return function () {
            if (u) {
                var t = document.createElement("div");
                t.style.width = "200px", t.style.padding = "1px 2px 3px 4px", t.style.borderStyle = "solid", t.style.borderWidth = "1px 2px 3px 4px", t.style[u] = "border-box";
                var n = document.body || document.documentElement;
                n.appendChild(t);
                var i = r(t);
                h = 200 === e(i.width), n.removeChild(t)
            }
        }(), i
    }

    var o = t.getComputedStyle, r = o ? function (t) {
        return o(t, null)
    } : function (t) {
        return t.currentStyle
    }, s = ["paddingLeft", "paddingRight", "paddingTop", "paddingBottom", "marginLeft", "marginRight", "marginTop", "marginBottom", "borderLeftWidth", "borderRightWidth", "borderTopWidth", "borderBottomWidth"];
    "function" == typeof define && define.amd ? define("get-size/get-size", ["get-style-property/get-style-property"], i) : "object" == typeof exports ? module.exports = i(require("get-style-property")) : t.getSize = i(t.getStyleProperty)
}(window), function (t) {
    function e(t, e) {
        for (var n in e)t[n] = e[n];
        return t
    }

    function n() {
    }

    function i(i, o, s, u, d) {
        function c(t, n) {
            this.element = "string" == typeof t ? r.querySelector(t) : t, this.options = e({}, this.options), e(this.options, n), this._create()
        }

        function f() {
            return!1
        }

        function l(t, e) {
            t.x = void 0 !== e.pageX ? e.pageX : e.clientX, t.y = void 0 !== e.pageY ? e.pageY : e.clientY
        }

        function g(t, e, n) {
            return n = n || "round", e ? Math[n](t / e) * e : t
        }

        var v = u("transform"), m = !!u("perspective");
        e(c.prototype, o.prototype), c.prototype.options = {}, c.prototype._create = function () {
            this.position = {}, this._getPosition(), this.startPoint = {x: 0, y: 0}, this.dragPoint = {x: 0, y: 0}, this.startPosition = e({}, this.position);
            var t = a(this.element);
            "relative" !== t.position && "absolute" !== t.position && (this.element.style.position = "relative"), this.enable(), this.setHandles()
        }, c.prototype.setHandles = function () {
            this.handles = this.options.handle ? this.element.querySelectorAll(this.options.handle) : [this.element];
            for (var e = 0, n = this.handles.length; n > e; e++) {
                var i = this.handles[e];
                t.navigator.pointerEnabled ? (s.bind(i, "pointerdown", this), i.style.touchAction = "none") : t.navigator.msPointerEnabled ? (s.bind(i, "MSPointerDown", this), i.style.msTouchAction = "none") : (s.bind(i, "mousedown", this), s.bind(i, "touchstart", this), E(i))
            }
        };
        var y = "attachEvent"in r.documentElement, E = y ? function (t) {
            "IMG" === t.nodeName && (t.ondragstart = f);
            for (var e = t.querySelectorAll("img"), n = 0, i = e.length; i > n; n++) {
                var o = e[n];
                o.ondragstart = f
            }
        } : n;
        c.prototype._getPosition = function () {
            var t = a(this.element), e = parseInt(t.left, 10), n = parseInt(t.top, 10);
            this.position.x = isNaN(e) ? 0 : e, this.position.y = isNaN(n) ? 0 : n, this._addTransformPosition(t)
        }, c.prototype._addTransformPosition = function (t) {
            if (v) {
                var e = t[v];
                if (0 === e.indexOf("matrix")) {
                    var n = e.split(","), i = 0 === e.indexOf("matrix3d") ? 12 : 4, o = parseInt(n[i], 10), r = parseInt(n[i + 1], 10);
                    this.position.x += o, this.position.y += r
                }
            }
        }, c.prototype.handleEvent = function (t) {
            var e = "on" + t.type;
            this[e] && this[e](t)
        }, c.prototype.getTouch = function (t) {
            for (var e = 0, n = t.length; n > e; e++) {
                var i = t[e];
                if (i.identifier === this.pointerIdentifier)return i
            }
        }, c.prototype.onmousedown = function (t) {
            var e = t.button;
            e && 0 !== e && 1 !== e || this.dragStart(t, t)
        }, c.prototype.ontouchstart = function (t) {
            this.isDragging || this.dragStart(t, t.changedTouches[0])
        }, c.prototype.onMSPointerDown = c.prototype.onpointerdown = function (t) {
            this.isDragging || this.dragStart(t, t)
        };
        var x = {mousedown: ["mousemove", "mouseup"], touchstart: ["touchmove", "touchend", "touchcancel"], pointerdown: ["pointermove", "pointerup", "pointercancel"], MSPointerDown: ["MSPointerMove", "MSPointerUp", "MSPointerCancel"]};
        c.prototype.dragStart = function (e, n) {
            this.isEnabled && (e.preventDefault ? e.preventDefault() : e.returnValue = !1, this.pointerIdentifier = void 0 !== n.pointerId ? n.pointerId : n.identifier, this._getPosition(), this.measureContainment(), l(this.startPoint, n), this.startPosition.x = this.position.x, this.startPosition.y = this.position.y, this.setLeftTop(), this.dragPoint.x = 0, this.dragPoint.y = 0, this._bindEvents({events: x[e.type], node: e.preventDefault ? t : r}), i.add(this.element, "is-dragging"), this.isDragging = !0, this.emitEvent("dragStart", [this, e, n]), this.animate())
        }, c.prototype._bindEvents = function (t) {
            for (var e = 0, n = t.events.length; n > e; e++) {
                var i = t.events[e];
                s.bind(t.node, i, this)
            }
            this._boundEvents = t
        }, c.prototype._unbindEvents = function () {
            var t = this._boundEvents;
            if (t && t.events) {
                for (var e = 0, n = t.events.length; n > e; e++) {
                    var i = t.events[e];
                    s.unbind(t.node, i, this)
                }
                delete this._boundEvents
            }
        }, c.prototype.measureContainment = function () {
            var t = this.options.containment;
            if (t) {
                this.size = d(this.element);
                var e = this.element.getBoundingClientRect(), n = h(t) ? t : "string" == typeof t ? r.querySelector(t) : this.element.parentNode;
                this.containerSize = d(n);
                var i = n.getBoundingClientRect();
                this.relativeStartPosition = {x: e.left - i.left, y: e.top - i.top}
            }
        }, c.prototype.onmousemove = function (t) {
            this.dragMove(t, t)
        }, c.prototype.onMSPointerMove = c.prototype.onpointermove = function (t) {
            t.pointerId === this.pointerIdentifier && this.dragMove(t, t)
        }, c.prototype.ontouchmove = function (t) {
            var e = this.getTouch(t.changedTouches);
            e && this.dragMove(t, e)
        }, c.prototype.dragMove = function (t, e) {
            l(this.dragPoint, e);
            var n = this.dragPoint.x - this.startPoint.x, i = this.dragPoint.y - this.startPoint.y, o = this.options.grid, r = o && o[0], s = o && o[1];
            n = g(n, r), i = g(i, s), n = this.containDrag("x", n, r), i = this.containDrag("y", i, s), n = "y" === this.options.axis ? 0 : n, i = "x" === this.options.axis ? 0 : i, this.position.x = this.startPosition.x + n, this.position.y = this.startPosition.y + i, this.dragPoint.x = n, this.dragPoint.y = i, this.emitEvent("dragMove", [this, t, e])
        }, c.prototype.containDrag = function (t, e, n) {
            if (!this.options.containment)return e;
            var i = "x" === t ? "width" : "height", o = this.relativeStartPosition[t], r = g(-o, n, "ceil"), s = this.containerSize[i] - o - this.size[i];
            return s = g(s, n, "floor"), Math.min(s, Math.max(r, e))
        }, c.prototype.onmouseup = function (t) {
            this.dragEnd(t, t)
        }, c.prototype.onMSPointerUp = c.prototype.onpointerup = function (t) {
            t.pointerId === this.pointerIdentifier && this.dragEnd(t, t)
        }, c.prototype.ontouchend = function (t) {
            var e = this.getTouch(t.changedTouches);
            e && this.dragEnd(t, e)
        }, c.prototype.dragEnd = function (t, e) {
            this.isDragging = !1, delete this.pointerIdentifier, v && (this.element.style[v] = "", this.setLeftTop()), this._unbindEvents(), i.remove(this.element, "is-dragging"), this.emitEvent("dragEnd", [this, t, e])
        }, c.prototype.onMSPointerCancel = c.prototype.onpointercancel = function (t) {
            t.pointerId === this.pointerIdentifier && this.dragEnd(t, t)
        }, c.prototype.ontouchcancel = function (t) {
            var e = this.getTouch(t.changedTouches);
            this.dragEnd(t, e)
        }, c.prototype.animate = function () {
            if (this.isDragging) {
                this.positionDrag();
                var t = this;
                p(function () {
                    t.animate()
                })
            }
        };
        var b = m ? function (t, e) {
            return"translate3d( " + t + "px, " + e + "px, 0)"
        } : function (t, e) {
            return"translate( " + t + "px, " + e + "px)"
        };
        return c.prototype.setLeftTop = function () {
            this.element.style.left = this.position.x + "px", this.element.style.top = this.position.y + "px"
        }, c.prototype.positionDrag = v ? function () {
            this.element.style[v] = b(this.dragPoint.x, this.dragPoint.y)
        } : c.prototype.setLeftTop, c.prototype.enable = function () {
            this.isEnabled = !0
        }, c.prototype.disable = function () {
            this.isEnabled = !1, this.isDragging && this.dragEnd()
        }, c
    }

    for (var o, r = t.document, s = r.defaultView, a = s && s.getComputedStyle ? function (t) {
        return s.getComputedStyle(t, null)
    } : function (t) {
        return t.currentStyle
    }, h = "object" == typeof HTMLElement ? function (t) {
        return t instanceof HTMLElement
    } : function (t) {
        return t && "object" == typeof t && 1 === t.nodeType && "string" == typeof t.nodeName
    }, u = 0, d = "webkit moz ms o".split(" "), p = t.requestAnimationFrame, c = t.cancelAnimationFrame, f = 0; d.length > f && (!p || !c); f++)o = d[f], p = p || t[o + "RequestAnimationFrame"], c = c || t[o + "CancelAnimationFrame"] || t[o + "CancelRequestAnimationFrame"];
    p && c || (p = function (e) {
        var n = (new Date).getTime(), i = Math.max(0, 16 - (n - u)), o = t.setTimeout(function () {
            e(n + i)
        }, i);
        return u = n + i, o
    }, c = function (e) {
        t.clearTimeout(e)
    }), "function" == typeof define && define.amd ? define(["classie/classie", "eventEmitter/EventEmitter", "eventie/eventie", "get-style-property/get-style-property", "get-size/get-size"], i) : t.Draggabilly = i(t.classie, t.EventEmitter, t.eventie, t.getStyleProperty, t.getSize)
}(window);