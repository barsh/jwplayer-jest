webpackJsonpjwplayer([1,3,4,5,6],[
/* 0 */,
/* 1 */,
/* 2 */
/*!******************************************!*\
  !*** ./src/js/view/controls/controls.js ***!
  \******************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _environment = __webpack_require__(/*! environment/environment */ 22);

var _constants = __webpack_require__(/*! view/constants */ 72);

var _events = __webpack_require__(/*! events/events */ 4);

var _backbone = __webpack_require__(/*! utils/backbone.events */ 7);

var _backbone2 = _interopRequireDefault(_backbone);

var _helpers = __webpack_require__(/*! utils/helpers */ 5);

var _helpers2 = _interopRequireDefault(_helpers);

var _button = __webpack_require__(/*! view/controls/components/button */ 69);

var _button2 = _interopRequireDefault(_button);

var _controlbar = __webpack_require__(/*! view/controls/controlbar */ 90);

var _controlbar2 = _interopRequireDefault(_controlbar);

var _displayContainer = __webpack_require__(/*! view/controls/display-container */ 121);

var _displayContainer2 = _interopRequireDefault(_displayContainer);

var _nextuptooltip = __webpack_require__(/*! view/controls/nextuptooltip */ 127);

var _nextuptooltip2 = _interopRequireDefault(_nextuptooltip);

var _rightclick = __webpack_require__(/*! view/controls/rightclick */ 129);

var _rightclick2 = _interopRequireDefault(_rightclick);

var _settingsMenu = __webpack_require__(/*! view/controls/settings-menu */ 131);

var _breakpoint = __webpack_require__(/*! view/utils/breakpoint */ 76);

var _icons = __webpack_require__(/*! view/controls/icons */ 68);

var _errorContainer = __webpack_require__(/*! view/error-container */ 34);

var _errorContainer2 = _interopRequireDefault(_errorContainer);

var _players = __webpack_require__(/*! api/players */ 24);

var _players2 = _interopRequireDefault(_players);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

__webpack_require__(/*! css/controls.less */ 139);

var ACTIVE_TIMEOUT = _environment.OS.mobile ? 4000 : 2000;

_errorContainer2.default.cloneIcon = _icons.cloneIcon;
_players2.default.forEach(function (api) {
    if (api.getState() === _events.STATE_ERROR) {
        var errorIconContainer = api.getContainer().querySelector('.jw-error-msg .jw-icon');
        if (errorIconContainer && !errorIconContainer.hasChildNodes()) {
            errorIconContainer.appendChild(_errorContainer2.default.cloneIcon('error'));
        }
    }
});

var reasonInteraction = function reasonInteraction() {
    return { reason: 'interaction' };
};

var Controls = function () {
    function Controls(context, playerContainer) {
        var _this = this;

        _classCallCheck(this, Controls);

        _extends(this, _backbone2.default);

        // Alphabetic order
        // Any property on the prototype should be initialized here first
        this.activeTimeout = -1;
        this.context = context;
        this.controlbar = null;
        this.displayContainer = null;
        this.backdrop = null;
        this.enabled = true;
        this.instreamState = null;
        this.keydownCallback = null;
        this.keyupCallback = null;
        this.blurCallback = null;
        this.mute = null;
        this.nextUpToolTip = null;
        this.playerContainer = playerContainer;
        this.rightClickMenu = null;
        this.settingsMenu = null;
        this.showing = false;
        this.unmuteCallback = null;
        this.div = null;
        this.right = null;
        this.activeListeners = {
            mousemove: function mousemove() {
                return clearTimeout(_this.activeTimeout);
            },
            mouseout: function mouseout() {
                return _this.userActive();
            }
        };
        this.dimensions = {};
    }

    _createClass(Controls, [{
        key: 'enable',
        value: function enable(api, model) {
            var _this2 = this;

            var element = this.context.createElement('div');
            element.className = 'jw-controls jw-reset';
            this.div = element;

            var backdrop = this.context.createElement('div');
            backdrop.className = 'jw-controls-backdrop jw-reset';
            this.backdrop = backdrop;

            var touchMode = model.get('touchMode');

            // Display Buttons
            if (!this.displayContainer) {
                var displayContainer = new _displayContainer2.default(model, api);

                displayContainer.buttons.display.on('click tap enter', function () {
                    _this2.trigger(_events.DISPLAY_CLICK);
                    _this2.userActive(1000);
                    api.playToggle(reasonInteraction());
                });

                this.div.appendChild(displayContainer.element());
                this.displayContainer = displayContainer;
            }

            // Touch UI mode when we're on mobile and we have a percentage height or we can fit the large UI in
            if (touchMode) {
                _helpers2.default.addClass(this.playerContainer, 'jw-flag-touch');
            } else {
                this.rightClickMenu = new _rightclick2.default();
                model.change('flashBlocked', function (modelChanged, isBlocked) {
                    if (isBlocked) {
                        _this2.rightClickMenu.destroy();
                    } else {
                        _this2.rightClickMenu.setup(modelChanged, _this2.playerContainer, _this2.playerContainer);
                    }
                }, this);
            }

            // Controlbar
            var controlbar = this.controlbar = new _controlbar2.default(api, model);
            controlbar.on(_events.USER_ACTION, function () {
                return _this2.userActive();
            });
            controlbar.on('nextShown', function (data) {
                this.trigger('nextShown', data);
            }, this);

            // Next Up Tooltip
            if (model.get('nextUpDisplay') && !controlbar.nextUpToolTip) {
                var nextUpToolTip = new _nextuptooltip2.default(model, api, this.playerContainer);
                nextUpToolTip.on('all', this.trigger, this);
                nextUpToolTip.setup(this.context);
                controlbar.nextUpToolTip = nextUpToolTip;

                // NextUp needs to be behind the controlbar to not block other tooltips
                this.div.appendChild(nextUpToolTip.element());
            }

            this.addActiveListeners(controlbar.element());
            this.div.appendChild(controlbar.element());

            // Settings Menu
            var lastState = null;
            var visibilityChangeHandler = function visibilityChangeHandler(visible, evt) {
                var state = model.get('state');
                var settingsInteraction = { reason: 'settingsInteraction' };
                var isKeyEvent = (evt && evt.sourceEvent || evt || {}).type === 'keydown';

                _helpers2.default.toggleClass(_this2.div, 'jw-settings-open', visible);
                if ((0, _breakpoint.getBreakpoint)(model.get('containerWidth')) < 2) {
                    if (visible && state === _events.STATE_PLAYING) {
                        // Pause playback on open if we're currently playing
                        api.pause(settingsInteraction);
                    } else if (!visible && state === _events.STATE_PAUSED && lastState === _events.STATE_PLAYING) {
                        // Resume playback on close if we are paused and were playing before
                        api.play(settingsInteraction);
                    }
                }

                // Trigger userActive so that a dismissive click outside the player can hide the controlbar
                _this2.userActive(null, visible || isKeyEvent);
                lastState = state;

                var settingsButton = _this2.controlbar.elements.settingsButton;
                if (!visible && isKeyEvent && settingsButton) {
                    settingsButton.element().focus();
                }
            };
            var settingsMenu = this.settingsMenu = (0, _settingsMenu.createSettingsMenu)(controlbar, visibilityChangeHandler);
            (0, _settingsMenu.setupSubmenuListeners)(settingsMenu, controlbar, model, api);

            if (_environment.OS.mobile) {
                this.div.appendChild(settingsMenu.element());
            } else {
                this.div.insertBefore(settingsMenu.element(), controlbar.element());
            }

            // Unmute Autoplay Button. Ignore iOS9. Muted autoplay is supported in iOS 10+
            if (model.get('autostartMuted')) {
                var unmuteCallback = function unmuteCallback() {
                    return _this2.unmuteAutoplay(api, model);
                };
                this.mute = (0, _button2.default)('jw-autostart-mute jw-off', unmuteCallback, model.get('localization').unmute, [(0, _icons.cloneIcon)('volume-0')]);
                this.mute.show();
                this.div.appendChild(this.mute.element());
                // Set mute state in the controlbar
                controlbar.renderVolume(true, model.get('volume'));
                // Hide the controlbar until the autostart flag is removed
                _helpers2.default.addClass(this.playerContainer, 'jw-flag-autostart');

                model.on('change:autostartFailed change:autostartMuted change:mute', unmuteCallback, this);
                this.unmuteCallback = unmuteCallback;
            }

            // Keyboard Commands
            function adjustSeek(amount) {
                var min = 0;
                var max = model.get('duration');
                var position = model.get('position');
                if (model.get('streamType') === 'DVR') {
                    min = max;
                    max = Math.max(position, _constants.dvrSeekLimit);
                }
                var newSeek = _helpers2.default.between(position + amount, min, max);
                api.seek(newSeek, reasonInteraction());
            }

            function adjustVolume(amount) {
                var newVol = _helpers2.default.between(model.get('volume') + amount, 0, 100);
                api.setVolume(newVol);
            }

            var handleKeydown = function handleKeydown(evt) {
                // If Meta keys return
                if (evt.ctrlKey || evt.metaKey) {
                    // Let event bubble upwards
                    return true;
                }

                switch (evt.keyCode) {
                    case 27:
                        // Esc
                        api.setFullscreen(false);
                        _this2.playerContainer.blur();
                        _this2.userInactive();
                        break;
                    case 13: // enter
                    case 32:
                        // space
                        api.playToggle(reasonInteraction());
                        break;
                    case 37:
                        // left-arrow, if not adMode
                        if (!_this2.instreamState) {
                            adjustSeek(-5);
                        }
                        break;
                    case 39:
                        // right-arrow, if not adMode
                        if (!_this2.instreamState) {
                            adjustSeek(5);
                        }
                        break;
                    case 38:
                        // up-arrow
                        adjustVolume(10);
                        break;
                    case 40:
                        // down-arrow
                        adjustVolume(-10);
                        break;
                    case 67:
                        // c-key
                        {
                            var captionsList = api.getCaptionsList();
                            var listLength = captionsList.length;
                            if (listLength) {
                                var nextIndex = (api.getCurrentCaptions() + 1) % listLength;
                                api.setCurrentCaptions(nextIndex);
                            }
                        }
                        break;
                    case 77:
                        // m-key
                        api.setMute();
                        break;
                    case 70:
                        // f-key
                        api.setFullscreen();
                        break;
                    default:
                        if (evt.keyCode >= 48 && evt.keyCode <= 59) {
                            // if 0-9 number key, move to n/10 of the percentage of the video
                            var number = evt.keyCode - 48;
                            var newSeek = number / 10 * model.get('duration');
                            api.seek(newSeek, reasonInteraction());
                        }
                }

                if (/13|32|37|38|39|40/.test(evt.keyCode)) {
                    // Prevent keypresses from scrolling the screen
                    evt.preventDefault();
                    return false;
                }
            };
            this.playerContainer.addEventListener('keydown', handleKeydown);
            this.keydownCallback = handleKeydown;

            // keep controls active when navigating inside the player
            var handleKeyup = function handleKeyup(evt) {
                if (!_this2.instreamState) {
                    var isTab = evt.keyCode === 9;
                    if (isTab) {
                        var insideContainer = _this2.playerContainer.contains(evt.target);
                        _this2.userActive(null, insideContainer);
                    }
                }
            };
            this.playerContainer.addEventListener('keyup', handleKeyup);
            this.keyupCallback = handleKeyup;

            // Hide controls when focus leaves the player
            var blurCallback = function blurCallback(evt) {
                var insideContainer = _this2.playerContainer.contains(evt.relatedTarget);
                if (!insideContainer) {
                    _this2.userInactive();
                }
            };
            this.playerContainer.addEventListener('blur', blurCallback, true);
            this.blurCallback = blurCallback;

            // Show controls when enabled
            this.userActive();

            this.playerContainer.appendChild(this.div);

            this.addBackdrop();
        }
    }, {
        key: 'disable',
        value: function disable(model) {
            this.off();

            if (model) {
                model.off(null, null, this);
                var mediaModel = model.get('mediaModel');
                if (mediaModel) {
                    mediaModel.off(null, null, this);
                }
            }

            clearTimeout(this.activeTimeout);

            if (this.div.parentNode) {
                _helpers2.default.removeClass(this.playerContainer, 'jw-flag-touch');
                this.playerContainer.removeChild(this.div);
            }
            if (this.controlbar) {
                this.removeActiveListeners(this.controlbar.element());
            }
            if (this.rightClickMenu) {
                this.rightClickMenu.destroy();
            }

            if (this.keydownCallback) {
                this.playerContainer.removeEventListener('keydown', this.keydownCallback);
            }

            if (this.keyupCallback) {
                this.playerContainer.removeEventListener('keyup', this.keyupCallback);
            }

            if (this.blurCallback) {
                this.playerContainer.removeEventListener('blur', this.blurCallback);
            }

            var nextUpToolTip = this.nextUpToolTip;
            if (nextUpToolTip) {
                nextUpToolTip.destroy();
            }

            var settingsMenu = this.settingsMenu;
            if (settingsMenu) {
                settingsMenu.destroy();
                this.div.removeChild(settingsMenu.element());
            }

            this.removeBackdrop();
        }
    }, {
        key: 'controlbarHeight',
        value: function controlbarHeight() {
            if (!this.dimensions.cbHeight) {
                this.dimensions.cbHeight = this.controlbar.element().clientHeight;
            }
            return this.dimensions.cbHeight;
        }
    }, {
        key: 'element',
        value: function element() {
            return this.div;
        }
    }, {
        key: 'logoContainer',
        value: function logoContainer() {
            return this.right;
        }
    }, {
        key: 'resize',
        value: function resize() {
            this.dimensions = {};
        }
    }, {
        key: 'unmuteAutoplay',
        value: function unmuteAutoplay(api, model) {
            var autostartSucceeded = !model.get('autostartFailed');
            var mute = model.get('mute');

            // If autostart succeeded, it means the user has chosen to unmute the video,
            // so we should update the model, setting mute to false
            if (autostartSucceeded) {
                mute = false;
            } else {
                // Don't try to play again when viewable since it will keep failing
                model.set('playOnViewable', false);
            }
            if (this.unmuteCallback) {
                model.off('change:autostartFailed change:autostartMuted change:mute', this.unmuteCallback);
                this.unmuteCallback = null;
            }
            model.set('autostartFailed', undefined);
            model.set('autostartMuted', undefined);
            api.setMute(mute);
            // the model's mute value may not have changed. ensure the controlbar's mute button is in the right state
            this.controlbar.renderVolume(mute, model.get('volume'));
            this.mute.hide();
            _helpers2.default.removeClass(this.playerContainer, 'jw-flag-autostart');
        }
    }, {
        key: 'addActiveListeners',
        value: function addActiveListeners(element) {
            if (element && !_environment.OS.mobile) {
                element.addEventListener('mousemove', this.activeListeners.mousemove);
                element.addEventListener('mouseout', this.activeListeners.mouseout);
            }
        }
    }, {
        key: 'removeActiveListeners',
        value: function removeActiveListeners(element) {
            if (element) {
                element.removeEventListener('mousemove', this.activeListeners.mousemove);
                element.removeEventListener('mouseout', this.activeListeners.mouseout);
            }
        }
    }, {
        key: 'userActive',
        value: function userActive(timeout, isKeyDown) {
            var _this3 = this;

            clearTimeout(this.activeTimeout);

            if (!isKeyDown) {
                this.activeTimeout = setTimeout(function () {
                    return _this3.userInactive();
                }, timeout || ACTIVE_TIMEOUT);
            }
            if (!this.showing) {
                _helpers2.default.removeClass(this.playerContainer, 'jw-flag-user-inactive');
                this.showing = true;
                this.trigger('userActive');
            }
        }
    }, {
        key: 'userInactive',
        value: function userInactive() {
            clearTimeout(this.activeTimeout);
            if (this.settingsMenu.visible) {
                return;
            }

            this.showing = false;
            _helpers2.default.addClass(this.playerContainer, 'jw-flag-user-inactive');
            this.trigger('userInactive');
        }
    }, {
        key: 'addBackdrop',
        value: function addBackdrop() {
            // Put the backdrop element on top of overlays during instream mode
            // otherwise keep it behind captions and on top of preview poster
            var element = this.instreamState ? this.div : this.playerContainer.querySelector('.jw-captions');
            this.playerContainer.insertBefore(this.backdrop, element);
        }
    }, {
        key: 'removeBackdrop',
        value: function removeBackdrop() {
            var parent = this.backdrop.parentNode;
            if (parent) {
                parent.removeChild(this.backdrop);
            }
        }
    }, {
        key: 'setupInstream',
        value: function setupInstream(instreamModel) {
            this.instreamState = instreamModel.get('state');
            // Call Controls.userActivity to display the UI temporarily for the start of the ad
            this.userActive();
            this.addBackdrop();
            this.controlbar.useInstreamTime(instreamModel);
            if (this.settingsMenu) {
                this.settingsMenu.close();
            }
            _helpers2.default.removeClass(this.playerContainer, 'jw-flag-autostart');
        }
    }, {
        key: 'destroyInstream',
        value: function destroyInstream(model) {
            this.instreamState = null;
            this.addBackdrop();
            this.controlbar.syncPlaybackTime(model);
            if (model.get('autostartMuted')) {
                _helpers2.default.addClass(this.playerContainer, 'jw-flag-autostart');
            }
        }
    }]);

    return Controls;
}();

exports.default = Controls;

/***/ }),
/* 3 */
/*!*****************************************!*\
  !*** ./src/js/controller/controller.js ***!
  \*****************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _players = __webpack_require__(/*! api/players */ 24);

var _players2 = _interopRequireDefault(_players);

var _coreShim = __webpack_require__(/*! api/core-shim */ 36);

var _setConfig = __webpack_require__(/*! api/set-config */ 141);

var _setConfig2 = _interopRequireDefault(_setConfig);

var _setPlaylist = __webpack_require__(/*! api/set-playlist */ 32);

var _setPlaylist2 = _interopRequireDefault(_setPlaylist);

var _apiQueue = __webpack_require__(/*! api/api-queue */ 37);

var _apiQueue2 = _interopRequireDefault(_apiQueue);

var _loader = __webpack_require__(/*! playlist/loader */ 39);

var _loader2 = _interopRequireDefault(_loader);

var _playlist = __webpack_require__(/*! playlist/playlist */ 26);

var _playlist2 = _interopRequireDefault(_playlist);

var _instreamAdapter = __webpack_require__(/*! controller/instream-adapter */ 142);

var _instreamAdapter2 = _interopRequireDefault(_instreamAdapter);

var _captions2 = __webpack_require__(/*! controller/captions */ 146);

var _captions3 = _interopRequireDefault(_captions2);

var _model2 = __webpack_require__(/*! controller/model */ 74);

var _model3 = _interopRequireDefault(_model2);

var _view2 = __webpack_require__(/*! view/view */ 147);

var _view3 = _interopRequireDefault(_view2);

var _changeStateEvent = __webpack_require__(/*! events/change-state-event */ 73);

var _changeStateEvent2 = _interopRequireDefault(_changeStateEvent);

var _eventsMiddleware = __webpack_require__(/*! controller/events-middleware */ 163);

var _eventsMiddleware2 = _interopRequireDefault(_eventsMiddleware);

var _backbone = __webpack_require__(/*! utils/backbone.events */ 7);

var _backbone2 = _interopRequireDefault(_backbone);

var _environment = __webpack_require__(/*! environment/environment */ 22);

var _streamType = __webpack_require__(/*! providers/utils/stream-type */ 164);

var _promise = __webpack_require__(/*! polyfills/promise */ 6);

var _promise2 = _interopRequireDefault(_promise);

var _cancelable = __webpack_require__(/*! utils/cancelable */ 82);

var _cancelable2 = _interopRequireDefault(_cancelable);

var _underscore = __webpack_require__(/*! utils/underscore */ 0);

var _underscore2 = _interopRequireDefault(_underscore);

var _events = __webpack_require__(/*! events/events */ 4);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// The model stores a different state than the provider
function normalizeState(newstate) {
    if (newstate === _events.STATE_LOADING || newstate === _events.STATE_STALLED) {
        return _events.STATE_BUFFERING;
    }
    return newstate;
}

var Controller = function Controller() {};

_extends(Controller.prototype, {
    setup: function setup(config, _api, originalContainer, eventListeners, commandQueue) {
        var _this = this;
        var _model = _this._model = new _model3.default();

        var _view = void 0;
        var _captions = void 0;
        var _preplay = false;
        var _actionOnAttach = void 0;
        var _stopPlaylist = false;
        var _interruptPlay = void 0;
        var checkAutoStartCancelable = (0, _cancelable2.default)(_checkAutoStart);
        var updatePlaylistCancelable = (0, _cancelable2.default)(function () {});

        _this.originalContainer = _this.currentContainer = originalContainer;
        _this._events = eventListeners;

        var _eventQueuedUntilReady = [];

        _model.setup(config);
        _view = this._view = new _view3.default(_api, _model);
        _view.on('all', _triggerAfterReady, _this);

        _model.mediaController.on('all', _triggerAfterReady, _this);
        _model.mediaController.on(_events.MEDIA_COMPLETE, function () {
            // Insert a small delay here so that other complete handlers can execute
            _promise.resolved.then(_completeHandler);
        });
        _model.mediaController.on(_events.MEDIA_ERROR, _this.triggerError, _this);
        _model.on(_events.ERROR, _this.triggerError, _this);

        // If we attempt to load flash, assume it is blocked if we don't hear back within a second
        _model.on('change:flashBlocked', function (model, isBlocked) {
            if (!isBlocked) {
                this._model.set('errorEvent', undefined);
                return;
            }
            // flashThrottle indicates whether this is a throttled event or plugin blocked event
            var throttled = !!model.get('flashThrottle');
            var errorEvent = {
                message: throttled ? 'Click to run Flash' : 'Flash plugin failed to load'
            };
            // Only dispatch an error for Flash blocked, not throttled events
            if (!throttled) {
                this.trigger(_events.ERROR, errorEvent);
            }
            this._model.set('errorEvent', errorEvent);
        }, this);

        _model.on('change:state', _changeStateEvent2.default, this);

        _model.on('change:duration', function (model, duration) {
            var minDvrWindow = model.get('minDvrWindow');
            var type = (0, _streamType.streamType)(duration, minDvrWindow);
            model.setStreamType(type);
        });

        _model.on('change:castState', function (model, evt) {
            _this.trigger(_events.CAST_SESSION, evt);
        });
        _model.on('change:fullscreen', function (model, bool) {
            _this.trigger(_events.FULLSCREEN, {
                fullscreen: bool
            });
            if (bool) {
                // Stop autoplay behavior when the player enters fullscreen
                model.set('playOnViewable', false);
            }
        });
        _model.on('change:volume', function (model, vol) {
            _this.trigger(_events.MEDIA_VOLUME, {
                volume: vol
            });
        });
        _model.on('change:mute', function (model, mute) {
            _this.trigger(_events.MEDIA_MUTE, {
                mute: mute
            });
        });

        _model.on('change:playbackRate', function (model, rate) {
            _this.trigger(_events.PLAYBACK_RATE_CHANGED, {
                playbackRate: rate,
                position: model.get('position')
            });
        });

        _model.on('change:scrubbing', function (model, state) {
            if (state) {
                _pause();
            } else {
                _play({ reason: 'interaction' });
            }
        });

        // For onCaptionsList and onCaptionsChange
        _model.on('change:captionsList', function (model, captionsList) {
            _this.triggerAfterReady(_events.CAPTIONS_LIST, {
                tracks: captionsList,
                track: _model.get('captionsIndex') || 0
            });
        });

        _model.on('change:mediaModel', function (model) {
            model.set('errorEvent', undefined);
            model.mediaModel.change(_events.PLAYER_STATE, function (mediaModel, state) {
                if (!model.get('errorEvent')) {
                    model.set(_events.PLAYER_STATE, normalizeState(state));
                }
            });
        });

        // Ensure captionsList event is raised after playlistItem
        _captions = new _captions3.default(_model);
        _captions.on('all', _triggerAfterReady);

        function _video() {
            return _model.getVideo();
        }

        function _triggerAfterReady(type, e) {
            _this.triggerAfterReady(type, e);
        }

        function triggerControls(model, enable) {
            _this.trigger(_events.CONTROLS, {
                controls: enable
            });
        }

        _model.on('change:viewSetup', function (model, viewSetup) {
            if (viewSetup) {
                (0, _coreShim.showView)(this, _view.element());
            }
        }, this);

        this.playerReady = function () {
            var related = _api.getPlugin('related');
            if (related) {
                related.on('nextUp', function (nextUp) {
                    _model.set('nextUp', nextUp);
                });
            }

            // Fire 'ready' once the view has resized so that player width and height are available
            // (requires the container to be in the DOM)
            _view.once(_events.RESIZE, _playerReadyNotify);

            _view.init();
        };

        function _playerReadyNotify() {
            _model.change('visibility', _updateViewable);
            _model.on('change:controls', triggerControls);

            // Tell the api that we are loaded
            _this.trigger(_events.READY, {
                // this will be updated by Api
                setupTime: 0
            });

            _model.change('playlist', function (model, playlist) {
                if (playlist.length) {
                    var eventData = {
                        playlist: playlist
                    };
                    var feedData = _model.get('feedData');
                    if (feedData) {
                        var eventFeedData = _extends({}, feedData);
                        delete eventFeedData.playlist;
                        eventData.feedData = eventFeedData;
                    }
                    _this.trigger(_events.PLAYLIST_LOADED, eventData);
                }
            });

            _model.change('playlistItem', function (model, playlistItem) {
                if (playlistItem) {
                    _this.trigger(_events.PLAYLIST_ITEM, {
                        index: _model.get('item'),
                        item: playlistItem
                    });
                }
            });

            // Stop queueing certain events
            _this.triggerAfterReady = _this.trigger;

            // Send queued events
            for (var i = 0; i < _eventQueuedUntilReady.length; i++) {
                var event = _eventQueuedUntilReady[i];
                _preplay = event.type === _events.MEDIA_BEFOREPLAY;
                _this.trigger(event.type, event.args);
                _preplay = false;
            }

            _model.change('viewable', viewableChange);
            _model.change('viewable', _checkPlayOnViewable);
            _model.once('change:autostartFailed change:autostartMuted change:mute', function (model) {
                model.off('change:viewable', _checkPlayOnViewable);
            });

            // Run _checkAutoStart() last
            // 'viewable' changes can result in preload() being called on the initial provider instance
            _checkAutoStart();
        }

        function _updateViewable(model, visibility) {
            if (!_underscore2.default.isUndefined(visibility)) {
                _model.set('viewable', Math.round(visibility));
            }
        }

        function _checkAutoStart() {
            if (!apiQueue) {
                // this player has been destroyed
                return;
            }
            if (!_environment.OS.mobile && _model.get('autostart') === true) {
                // Autostart immediately if we're not mobile and not waiting for the player to become viewable first
                _autoStart();
            }
            apiQueue.flush();
        }

        function viewableChange(model, viewable) {
            _this.trigger('viewable', {
                viewable: viewable
            });

            // Only attempt to preload if this is the first player on the page or viewable
            if (_players2.default[0] === _api || viewable === 1) {
                model.preloadVideo();
            }
        }

        function _checkPlayOnViewable(model, viewable) {
            if (model.get('playOnViewable')) {
                if (viewable) {
                    _autoStart();
                } else if (_environment.OS.mobile) {
                    _this.pause({ reason: 'autostart' });
                }
            }
        }

        this.triggerAfterReady = function (type, args) {
            _eventQueuedUntilReady.push({
                type: type,
                args: args
            });
        };

        function _load(item, feedData) {

            _this.trigger('destroyPlugin', {});
            _stop(true);

            checkAutoStartCancelable.cancel();
            checkAutoStartCancelable = (0, _cancelable2.default)(_checkAutoStart);
            updatePlaylistCancelable.cancel();

            _primeMediaElementForPlayback();

            var loadPromise = void 0;

            switch (typeof item === 'undefined' ? 'undefined' : _typeof(item)) {
                case 'string':
                    {
                        var loadPlaylistPromise = _loadPlaylist(item).catch(function (error) {
                            _this.triggerError({
                                message: 'Error loading playlist: ' + error.message
                            });
                        });
                        updatePlaylistCancelable = (0, _cancelable2.default)(function (data) {
                            if (data) {
                                return _updatePlaylist(data.playlist, data);
                            }
                        });
                        loadPromise = loadPlaylistPromise.then(updatePlaylistCancelable.async);
                        break;
                    }
                case 'object':
                    loadPromise = _updatePlaylist(item, feedData);
                    break;
                case 'number':
                    loadPromise = _setItem(item);
                    break;
                default:
                    return;
            }
            loadPromise.catch(function (error) {
                _this.triggerError({
                    message: 'Playlist error: ' + error.message
                });
            });

            loadPromise.then(checkAutoStartCancelable.async).catch(function () {});
        }

        function _updatePlaylist(data, feedData) {
            var playlist = (0, _playlist2.default)(data);
            try {
                (0, _setPlaylist2.default)(_model, playlist, feedData);
            } catch (error) {
                _model.set('item', 0);
                _model.set('playlistItem', null);
                return _promise2.default.reject(error);
            }
            return _setItem(0);
        }

        function _loadPlaylist(toLoad) {
            var _this2 = this;

            return new _promise2.default(function (resolve, reject) {
                var loader = new _loader2.default();
                loader.on(_events.PLAYLIST_LOADED, function (data) {
                    resolve(data);
                });
                loader.on(_events.ERROR, function (error) {
                    _model.set('feedData', {
                        error: error
                    });
                    reject(error);
                }, _this2);
                loader.load(toLoad);
            });
        }

        function _getAdState() {
            return _this._instreamAdapter && _this._instreamAdapter.getState();
        }

        function _getState() {
            var adState = _getAdState();
            if (_underscore2.default.isString(adState)) {
                return adState;
            }
            return _model.get('state');
        }

        function _play(meta) {
            checkAutoStartCancelable.cancel();

            if (_model.get('state') === _events.STATE_ERROR) {
                return _promise.resolved;
            }

            var playReason = _getReason(meta);
            _model.set('playReason', playReason);

            var adState = _getAdState();
            if (_underscore2.default.isString(adState)) {
                // this will resume the ad. _api.playAd would load a new ad
                _api.pauseAd(false);
                return _promise.resolved;
            }

            if (_model.get('state') === _events.STATE_COMPLETE) {
                _stop(true);
                _setItem(0);
            }

            if (!_preplay) {
                _preplay = true;
                _this.triggerAfterReady(_events.MEDIA_BEFOREPLAY, { playReason: playReason });
                _preplay = false;
                if (_interruptPlay) {
                    _interruptPlay = false;
                    _actionOnAttach = null;
                    _primeMediaElementForPlayback();
                    return _promise.resolved;
                }
            }

            return _model.playVideo(playReason);
        }

        function _getReason(meta) {
            if (meta && meta.reason) {
                return meta.reason;
            }
            if (_inInteraction(window.event)) {
                return 'interaction';
            }
            return 'external';
        }

        function _inInteraction(event) {
            return event && /^(?:mouse|pointer|touch|gesture|click|key)/.test(event.type);
        }

        function _primeMediaElementForPlayback() {
            // If we're in a user-gesture event call load() on video to allow async playback
            if (_inInteraction(window.event)) {
                var mediaElement = _model.get('mediaElement');
                if (!mediaElement.src) {
                    mediaElement.load();
                }
            }
        }

        function _autoStart() {
            var state = _model.get('state');
            if (state === _events.STATE_IDLE || state === _events.STATE_PAUSED) {
                _play({ reason: 'autostart' }).catch(function () {
                    if (!_this._instreamAdapter) {
                        _model.set('autostartFailed', true);
                    }
                    _actionOnAttach = null;
                });
            }
        }

        function _stop(internal) {
            checkAutoStartCancelable.cancel();
            apiQueue.empty();

            var adState = _getAdState();
            if (_underscore2.default.isString(adState)) {
                return;
            }

            var fromApi = !internal;

            _actionOnAttach = null;

            if (fromApi) {
                _stopPlaylist = true;
            }

            if (_preplay) {
                _interruptPlay = true;
            }

            _model.set('errorEvent', undefined);

            var provider = _model.getVideo();
            _model.stopVideo();
            if (!provider) {
                _model.set('state', _events.STATE_IDLE);
            }
        }

        function _pause(meta) {
            _actionOnAttach = null;
            checkAutoStartCancelable.cancel();

            var pauseReason = _getReason(meta);
            _model.set('pauseReason', pauseReason);
            // Stop autoplay behavior if the video is paused by the user or an api call
            if (pauseReason === 'interaction' || pauseReason === 'external') {
                _model.set('playOnViewable', false);
            }

            var adState = _getAdState();
            if (_underscore2.default.isString(adState)) {
                _api.pauseAd(true);
                return;
            }

            switch (_model.get('state')) {
                case _events.STATE_ERROR:
                    return;
                case _events.STATE_PLAYING:
                case _events.STATE_BUFFERING:
                    {

                        _video().pause();
                        break;
                    }
                default:
                    if (_preplay) {
                        _interruptPlay = true;
                    }
            }
        }

        function _isIdle() {
            var state = _model.get('state');
            return state === _events.STATE_IDLE || state === _events.STATE_COMPLETE || state === _events.STATE_ERROR;
        }

        function _seek(pos, meta) {
            if (_model.get('state') === _events.STATE_ERROR) {
                return;
            }
            if (!_model.get('scrubbing') && _model.get('state') !== _events.STATE_PLAYING) {
                _play(meta);
            }
            _video().seek(pos);
        }

        function _item(index, meta) {
            _stop(true);
            _setItem(index);
            _play(meta);
        }

        function _setItem(index) {
            return _model.setItemIndex(index);
        }

        function _prev(meta) {
            _item(_model.get('item') - 1, meta);
        }

        function _next(meta) {
            _item(_model.get('item') + 1, meta);
        }

        function _completeHandler() {
            if (!_isIdle()) {
                // Something has made an API call before the complete handler has fired.
                return;
            } else if (_stopPlaylist) {
                // Stop called in onComplete event listener
                _stopPlaylist = false;
                return;
            }

            _actionOnAttach = _completeHandler;

            var idx = _model.get('item');
            if (idx === _model.get('playlist').length - 1) {
                // If it's the last item in the playlist
                if (_model.get('repeat')) {
                    _next({ reason: 'repeat' });
                } else {
                    // Exit fullscreen on IOS so that our overlays show to the user
                    if (_environment.OS.iOS) {
                        _setFullscreen(false);
                    }
                    // Autoplay/pause no longer needed since there's no more media to play
                    // This prevents media from replaying when a completed video scrolls into view
                    _model.set('playOnViewable', false);
                    _model.set('state', _events.STATE_COMPLETE);
                    _this.trigger(_events.PLAYLIST_COMPLETE, {});
                }
                return;
            }

            // It wasn't the last item in the playlist,
            //  so go to the next one and trigger an autoadvance event
            var related = _api.getPlugin('related');
            triggerAdvanceEvent(related, 'nextAutoAdvance');
            _next({ reason: 'playlist' });
        }

        function _setCurrentQuality(index) {
            if (_video()) {
                index = parseInt(index, 10) || 0;
                _video().setCurrentQuality(index);
            }
        }

        function _getCurrentQuality() {
            if (_video()) {
                return _video().getCurrentQuality();
            }
            return -1;
        }

        function _getConfig() {
            return this._model ? this._model.getConfiguration() : undefined;
        }

        function _getVisualQuality() {
            if (this._model.mediaModel) {
                return this._model.mediaModel.get('visualQuality');
            }
            // if quality is not implemented in the provider,
            // return quality info based on current level
            var qualityLevels = _getQualityLevels();
            if (qualityLevels) {
                var levelIndex = _getCurrentQuality();
                var level = qualityLevels[levelIndex];
                if (level) {
                    return {
                        level: _extends({
                            index: levelIndex
                        }, level),
                        mode: '',
                        reason: ''
                    };
                }
            }
            return null;
        }

        function _getQualityLevels() {
            if (_video()) {
                return _video().getQualityLevels();
            }
            return null;
        }

        function _setCurrentAudioTrack(index) {
            if (_video()) {
                index = parseInt(index, 10) || 0;
                _video().setCurrentAudioTrack(index);
            }
        }

        function _getCurrentAudioTrack() {
            if (_video()) {
                return _video().getCurrentAudioTrack();
            }
            return -1;
        }

        function _getAudioTracks() {
            if (_video()) {
                return _video().getAudioTracks();
            }
            return null;
        }

        function _setCurrentCaptions(index) {
            index = parseInt(index, 10) || 0;

            // update provider subtitle track
            _model.persistVideoSubtitleTrack(index);

            _this.trigger(_events.CAPTIONS_CHANGED, {
                tracks: _getCaptionsList(),
                track: index
            });
        }

        function _getCurrentCaptions() {
            return _captions.getCurrentIndex();
        }

        function _getCaptionsList() {
            return _captions.getCaptionsList();
        }

        /** Used for the InStream API **/
        function _detachMedia() {
            if (_preplay) {
                _interruptPlay = true;
            }
            return _model.detachMedia();
        }

        function _attachMedia() {
            // Called after instream ends
            _model.attachMedia();

            if (typeof _actionOnAttach === 'function') {
                _actionOnAttach();
            }
        }

        function _setFullscreen(state) {
            if (!_underscore2.default.isBoolean(state)) {
                state = !_model.get('fullscreen');
            }

            _model.set('fullscreen', state);
            if (_this._instreamAdapter && _this._instreamAdapter._adModel) {
                _this._instreamAdapter._adModel.set('fullscreen', state);
            }
        }

        function _nextUp() {
            var related = _api.getPlugin('related');
            triggerAdvanceEvent(related, 'nextClick', function () {
                return related.next();
            });
        }

        function triggerAdvanceEvent(related, evt, cb) {
            if (!related) {
                return;
            }
            var nextUp = _model.get('nextUp');
            if (nextUp) {
                _this.trigger(evt, {
                    mode: nextUp.mode,
                    ui: 'nextup',
                    target: nextUp,
                    itemsShown: [nextUp],
                    feedData: nextUp.feedData
                });
            }
            if (typeof cb === 'function') {
                cb();
            }
        }

        /** Controller API / public methods **/
        this.load = _load;
        this.play = _play;
        this.pause = _pause;
        this.seek = _seek;
        this.stop = _stop;
        this.playlistItem = _item;
        this.playlistNext = _next;
        this.playlistPrev = _prev;
        this.setCurrentCaptions = _setCurrentCaptions;
        this.setCurrentQuality = _setCurrentQuality;
        this.setFullscreen = _setFullscreen;
        this.detachMedia = _detachMedia;
        this.attachMedia = _attachMedia;
        this.getCurrentQuality = _getCurrentQuality;
        this.getQualityLevels = _getQualityLevels;
        this.setCurrentAudioTrack = _setCurrentAudioTrack;
        this.getCurrentAudioTrack = _getCurrentAudioTrack;
        this.getAudioTracks = _getAudioTracks;
        this.getCurrentCaptions = _getCurrentCaptions;
        this.getCaptionsList = _getCaptionsList;
        this.getVisualQuality = _getVisualQuality;
        this.getConfig = _getConfig;
        this.getState = _getState;
        this.next = _nextUp;
        this.setConfig = function (newConfig) {
            return (0, _setConfig2.default)(_this, newConfig);
        };

        // Model passthroughs
        this.setVolume = _model.setVolume.bind(_model);
        this.setMute = _model.setMute.bind(_model);
        this.setPlaybackRate = _model.setPlaybackRate.bind(_model);
        this.getProvider = function () {
            return _model.get('provider');
        };
        this.getWidth = function () {
            return _model.get('containerWidth');
        };
        this.getHeight = function () {
            return _model.get('containerHeight');
        };
        this.getItemQoe = function () {
            return _model._qoeItem;
        };
        this.isBeforeComplete = function () {
            return _model.checkComplete();
        };
        this.addButton = function (img, tooltip, callback, id, btnClass) {
            var customButtons = _model.get('customButtons') || [];
            var added = false;
            var newButton = {
                img: img,
                tooltip: tooltip,
                callback: callback,
                id: id,
                btnClass: btnClass
            };

            customButtons = customButtons.reduce(function (buttons, button) {
                if (button.id === newButton.id) {
                    added = true;
                    buttons.push(newButton);
                } else {
                    buttons.push(button);
                }
                return buttons;
            }, []);

            if (!added) {
                customButtons.unshift(newButton);
            }

            _model.set('customButtons', customButtons);
        };
        this.removeButton = function (id) {
            var customButtons = _underscore2.default.filter(_model.get('customButtons'), function (button) {
                return button.id !== id;
            });

            _model.set('customButtons', customButtons);
        };
        // Delegate trigger so we can run a middleware function before any event is bubbled through the API
        this.trigger = function (type, args) {
            var data = (0, _eventsMiddleware2.default)(_model, type, args);
            return _backbone2.default.trigger.call(this, type, data);
        };

        // View passthroughs
        this.resize = _view.resize;
        this.getSafeRegion = _view.getSafeRegion;
        this.setCues = _view.addCues;
        this.setCaptions = _view.setCaptions;

        this.checkBeforePlay = function () {
            return _preplay;
        };

        this.setControls = function (mode) {
            if (!_underscore2.default.isBoolean(mode)) {
                mode = !_model.get('controls');
            }
            _model.set('controls', mode);

            var provider = _model.getVideo();
            if (provider) {
                provider.setControls(mode);
            }
        };

        this.playerDestroy = function () {
            this.trigger('destroyPlugin', {});
            this.off();
            this.stop();
            (0, _coreShim.showView)(this, this.originalContainer);
            if (_view) {
                _view.destroy();
            }
            if (_model) {
                _model.destroy();
            }
            if (apiQueue) {
                apiQueue.destroy();
            }
            if (_captions) {
                _captions.destroy();
                _captions = null;
            }
            this.instreamDestroy();
        };

        this.isBeforePlay = this.checkBeforePlay;

        this.createInstream = function () {
            this.instreamDestroy();
            this._instreamAdapter = new _instreamAdapter2.default(this, _model, _view);
            return this._instreamAdapter;
        };

        this.skipAd = function () {
            if (this._instreamAdapter) {
                this._instreamAdapter.skipAd();
            }
        };

        this.instreamDestroy = function () {
            if (_this._instreamAdapter) {
                _this._instreamAdapter.destroy();
                _this._instreamAdapter = null;
            }
        };

        // Setup ApiQueueDecorator after instance methods have been assigned
        var apiQueue = new _apiQueue2.default(this, ['play', 'pause', 'seek', 'setCurrentAudioTrack', 'setCurrentCaptions', 'setCurrentQuality', 'setFullscreen'], function () {
            return !_model.getVideo();
        });
        // Add commands from CoreLoader to queue
        apiQueue.queue.push.apply(apiQueue.queue, commandQueue);

        _view.setup();
    },
    get: function get(property) {
        return this._model.get(property);
    },
    getContainer: function getContainer() {
        return this.currentContainer || this.originalContainer;
    },
    getMute: function getMute() {
        return this._model.getMute();
    },
    triggerError: function triggerError(evt) {
        this._model.set('errorEvent', evt);
        this._model.set('state', _events.STATE_ERROR);
        this._model.once('change:state', function () {
            this._model.set('errorEvent', undefined);
        }, this);

        this.trigger(_events.ERROR, evt);
    }
});

exports.default = Controller;

/***/ }),
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */
/*!***********************************!*\
  !*** ./src/js/providers/html5.js ***!
  \***********************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _dataNormalizer = __webpack_require__(/*! providers/data-normalizer */ 166);

var _environment = __webpack_require__(/*! environment/environment */ 22);

var _html5AndroidHls = __webpack_require__(/*! providers/html5-android-hls */ 43);

var _events = __webpack_require__(/*! events/events */ 4);

var _videoListenerMixin = __webpack_require__(/*! providers/video-listener-mixin */ 167);

var _videoListenerMixin2 = _interopRequireDefault(_videoListenerMixin);

var _videoActionsMixin = __webpack_require__(/*! providers/video-actions-mixin */ 168);

var _videoActionsMixin2 = _interopRequireDefault(_videoActionsMixin);

var _videoAttachedMixin = __webpack_require__(/*! providers/video-attached-mixin */ 169);

var _videoAttachedMixin2 = _interopRequireDefault(_videoAttachedMixin);

var _css = __webpack_require__(/*! utils/css */ 23);

var _helpers = __webpack_require__(/*! utils/helpers */ 5);

var _helpers2 = _interopRequireDefault(_helpers);

var _dom = __webpack_require__(/*! utils/dom */ 21);

var _underscore = __webpack_require__(/*! utils/underscore */ 0);

var _underscore2 = _interopRequireDefault(_underscore);

var _default = __webpack_require__(/*! providers/default */ 44);

var _default2 = _interopRequireDefault(_default);

var _backbone = __webpack_require__(/*! utils/backbone.events */ 7);

var _backbone2 = _interopRequireDefault(_backbone);

var _tracksMixin = __webpack_require__(/*! providers/tracks-mixin */ 170);

var _tracksMixin2 = _interopRequireDefault(_tracksMixin);

var _timeRanges = __webpack_require__(/*! utils/time-ranges */ 165);

var _timeRanges2 = _interopRequireDefault(_timeRanges);

var _playPromise = __webpack_require__(/*! providers/utils/play-promise */ 172);

var _playPromise2 = _interopRequireDefault(_playPromise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var clearTimeout = window.clearTimeout;
var MIN_DVR_DURATION = 120;
var _name = 'html5';

function _setupListeners(eventsHash, videoTag) {
    Object.keys(eventsHash).forEach(function (eventName) {
        videoTag.removeEventListener(eventName, eventsHash[eventName]);
        videoTag.addEventListener(eventName, eventsHash[eventName]);
    });
}

function _removeListeners(eventsHash, videoTag) {
    Object.keys(eventsHash).forEach(function (eventName) {
        videoTag.removeEventListener(eventName, eventsHash[eventName]);
    });
}

function VideoProvider(_playerId, _playerConfig) {
    // Current media state
    this.state = _events.STATE_IDLE;

    // Are we buffering due to seek, or due to playback?
    this.seeking = false;

    // Always render natively in iOS and Safari, where HLS is supported.
    // Otherwise, use native rendering when set in the config for browsers that have adequate support.
    // FF, IE & Edge are excluded due to styling/positioning drawbacks.
    // The following issues need to be addressed before we enable native rendering in Edge:
    // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/8120475/
    // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/12079271/
    function renderNatively(configRenderNatively) {
        if (_environment.OS.iOS || _environment.Browser.safari) {
            return true;
        }
        return configRenderNatively && _environment.Browser.chrome;
    }

    var _this = this;

    var MediaEvents = {
        progress: function progress() {
            _videoListenerMixin2.default.progress.call(_this);
            checkStaleStream();
        },
        timeupdate: function timeupdate() {
            if (_positionBeforeSeek !== _videotag.currentTime) {
                _setPositionBeforeSeek(_videotag.currentTime);
                _videoListenerMixin2.default.timeupdate.call(_this);
            }
            checkStaleStream();
            if (_this.state === _events.STATE_PLAYING) {
                checkVisualQuality();
            }
        },
        ended: function ended() {
            _currentQuality = -1;
            clearTimeouts();
            _videoListenerMixin2.default.ended.call(_this);
        },
        loadedmetadata: function loadedmetadata() {
            var duration = _this.getDuration();
            if (_androidHls && duration === Infinity) {
                duration = 0;
            }
            var metadata = {
                duration: duration,
                height: _videotag.videoHeight,
                width: _videotag.videoWidth
            };
            _this.trigger(_events.MEDIA_META, metadata);
        },
        durationchange: function durationchange() {
            if (_androidHls) {
                return;
            }
            _videoListenerMixin2.default.progress.call(_this);
        },
        loadeddata: function loadeddata() {
            _videoListenerMixin2.default.loadeddata.call(_this);
            _setAudioTracks(_videotag.audioTracks);
            _checkDelayedSeek(_this.getDuration());
        },
        canplay: function canplay() {
            _canSeek = true;
            if (!_androidHls) {
                _setMediaType();
            }
            if (_environment.Browser.ie && _environment.Browser.version.major === 9) {
                // In IE9, set tracks here since they are not ready
                // on load
                _this.setTextTracks(_this._textTracks);
            }
            _videoListenerMixin2.default.canplay.call(_this);
        },
        seeking: function seeking() {
            var offset = _seekOffset !== null ? _seekOffset : _this.getCurrentTime();
            _seekOffset = null;
            _delayedSeek = 0;
            _this.seeking = true;
            _this.trigger(_events.MEDIA_SEEK, {
                position: _positionBeforeSeek,
                offset: offset
            });
            _setPositionBeforeSeek(offset);
            _videotag.removeEventListener('waiting', setLoadingState);
            _videotag.addEventListener('waiting', setLoadingState);
        },
        seeked: function seeked() {
            _videotag.removeEventListener('waiting', setLoadingState);
            _videoListenerMixin2.default.seeked.call(_this);
        },
        webkitbeginfullscreen: function webkitbeginfullscreen(e) {
            _fullscreenState = true;
            _sendFullscreen(e);
        },
        webkitendfullscreen: function webkitendfullscreen(e) {
            _fullscreenState = false;
            _sendFullscreen(e);
        }
    };
    Object.keys(_videoListenerMixin2.default).forEach(function (eventName) {
        if (!MediaEvents[eventName]) {
            var mixinEventHandler = _videoListenerMixin2.default[eventName];
            MediaEvents[eventName] = function (e) {
                mixinEventHandler.call(_this, e);
            };
        }
    });

    _extends(this, _backbone2.default, _videoActionsMixin2.default, _videoAttachedMixin2.default, _tracksMixin2.default, {
        renderNatively: renderNatively(_playerConfig.renderCaptionsNatively),
        eventsOn_: function eventsOn_() {
            _setupListeners(MediaEvents, _videotag);
        },
        eventsOff_: function eventsOff_() {
            _removeListeners(MediaEvents, _videotag);
        },
        detachMedia: function detachMedia() {
            _videoAttachedMixin2.default.detachMedia.call(_this);
            clearTimeouts();
            // Stop listening to track changes so disabling the current track doesn't update the model
            this.removeTracksListener(_videotag.textTracks, 'change', this.textTrackChangeHandler);
            // Prevent tracks from showing during ad playback
            this.disableTextTrack();
            return _videotag;
        },
        attachMedia: function attachMedia() {
            _videoAttachedMixin2.default.attachMedia.call(_this);
            _canSeek = false;
            // If we were mid-seek when detached, we want to allow it to resume
            this.seeking = false;
            // In case the video tag was modified while we shared it
            _videotag.loop = false;
            // If there was a showing track, re-enable it
            this.enableTextTrack();
            if (this.renderNatively) {
                this.setTextTracks(this.video.textTracks);
            }
            this.addTracksListener(_videotag.textTracks, 'change', this.textTrackChangeHandler);
        },
        stalledHandler: function stalledHandler(checkStartTime) {
            // Android HLS doesnt update its times correctly so it always falls in here.  Do not allow it to stall.
            if (_androidHls) {
                return;
            }
            _videoAttachedMixin2.default.stalledHandler.call(_this, checkStartTime);
        },
        isLive: function isLive() {
            return _videotag.duration === Infinity;
        }
    });

    var _videotag = _this.video = _playerConfig.mediaElement;
    var visualQuality = { level: {} };
    var _staleStreamDuration = 3 * 10 * 1000;

    var _canSeek = false; // true on valid time event
    var _delayedSeek = 0;
    var _seekOffset = null;
    var _positionBeforeSeek = null;
    var _levels = void 0;
    var _currentQuality = -1;
    var _fullscreenState = false;
    var _beforeResumeHandler = _helpers2.default.noop;
    var _audioTracks = null;
    var _currentAudioTrackIndex = -1;
    var _staleStreamTimeout = -1;
    var _stale = false;
    var _lastEndOfBuffer = null;
    var _androidHls = false;

    function _setAttribute(name, value) {
        _videotag.setAttribute(name, value || '');
    }

    _videotag.className = 'jw-video jw-reset';

    this.isSDK = !!_playerConfig.sdkplatform;
    this.video = _videotag;
    this.supportsPlaybackRate = true;

    _setupListeners(MediaEvents, _videotag);

    _setAttribute('disableRemotePlayback', '');
    _setAttribute('webkit-playsinline');
    _setAttribute('playsinline');

    function checkVisualQuality() {
        var level = visualQuality.level;
        if (level.width !== _videotag.videoWidth || level.height !== _videotag.videoHeight) {
            level.width = _videotag.videoWidth;
            level.height = _videotag.videoHeight;
            _setMediaType();
            if (!level.width || !level.height || _currentQuality === -1) {
                return;
            }
            visualQuality.reason = visualQuality.reason || 'auto';
            visualQuality.mode = _levels[_currentQuality].type === 'hls' ? 'auto' : 'manual';
            visualQuality.bitrate = 0;
            level.index = _currentQuality;
            level.label = _levels[_currentQuality].label;
            _this.trigger('visualQuality', visualQuality);
            visualQuality.reason = '';
        }
    }

    function setLoadingState() {
        _this.setState(_events.STATE_LOADING);
    }

    function _setPositionBeforeSeek(position) {
        _positionBeforeSeek = _convertTime(position);
    }

    _this.getCurrentTime = function () {
        return _convertTime(_videotag.currentTime);
    };

    function _convertTime(position) {
        if (_this.getDuration() < 0) {
            position -= _getSeekableEnd();
        }
        return position;
    }

    _this.getDuration = function () {
        var duration = _videotag.duration;
        // Don't sent time event on Android before real duration is known
        if (_androidHls && duration === Infinity && _videotag.currentTime === 0 || isNaN(duration)) {
            return 0;
        }
        var end = _getSeekableEnd();
        if (_this.isLive() && end) {
            var seekableDuration = end - _getSeekableStart();
            if (seekableDuration !== Infinity && seekableDuration > MIN_DVR_DURATION) {
                // Player interprets negative duration as DVR
                duration = -seekableDuration;
            }
        }
        return duration;
    };

    function _checkDelayedSeek(duration) {
        // Don't seek when _delayedSeek is set to -1 in _completeLoad
        if (_delayedSeek && _delayedSeek !== -1 && duration && duration !== Infinity) {
            _this.seek(_delayedSeek);
        }
    }

    function _getPublicLevels(levels) {
        var publicLevels;
        if (_helpers2.default.typeOf(levels) === 'array' && levels.length > 0) {
            publicLevels = _underscore2.default.map(levels, function (level, i) {
                return {
                    label: level.label || i
                };
            });
        }
        return publicLevels;
    }

    function _setLevels(levels) {
        _levels = levels;
        _currentQuality = _pickInitialQuality(levels);
    }

    function _pickInitialQuality(levels) {
        var currentQuality = Math.max(0, _currentQuality);
        var label = _playerConfig.qualityLabel;
        if (levels) {
            for (var i = 0; i < levels.length; i++) {
                if (levels[i].default) {
                    currentQuality = i;
                }
                if (label && levels[i].label === label) {
                    return i;
                }
            }
        }
        visualQuality.reason = 'initial choice';
        visualQuality.level = {};
        return currentQuality;
    }

    function _play() {
        return _videotag.play() || (0, _playPromise2.default)(_videotag);
    }

    function _completeLoad(startTime) {
        _delayedSeek = 0;
        clearTimeouts();

        var previousSource = _videotag.src;
        var sourceElement = document.createElement('source');
        sourceElement.src = _levels[_currentQuality].file;
        var sourceChanged = sourceElement.src !== previousSource;

        if (sourceChanged) {
            _setVideotagSource(_levels[_currentQuality]);
            // Do not call load if src was not set. load() will cancel any active play promise.
            if (previousSource) {
                _videotag.load();
            }
        } else if (startTime === 0 && _videotag.currentTime > 0) {
            // Load event is from the same video as before
            // restart video without dispatching seek event
            _delayedSeek = -1;
            _this.seek(startTime);
        }

        if (startTime > 0) {
            _this.seek(startTime);
        }

        var publicLevels = _getPublicLevels(_levels);
        if (publicLevels) {
            _this.trigger(_events.MEDIA_LEVELS, {
                levels: publicLevels,
                currentQuality: _currentQuality
            });
        }
        if (_levels.length && _levels[0].type !== 'hls') {
            _this.sendMediaType(_levels);
        }
    }

    function _setVideotagSource(source) {
        _audioTracks = null;
        _currentAudioTrackIndex = -1;
        if (!visualQuality.reason) {
            visualQuality.reason = 'initial choice';
            visualQuality.level = {};
        }
        _canSeek = false;

        var sourceElement = document.createElement('source');
        sourceElement.src = source.file;
        var sourceChanged = _videotag.src !== sourceElement.src;
        if (sourceChanged) {
            _videotag.src = source.file;
        }
    }

    function _clearVideotagSource() {
        if (_videotag) {
            _this.disableTextTrack();
            _videotag.removeAttribute('preload');
            _videotag.removeAttribute('src');
            (0, _dom.emptyElement)(_videotag);
            (0, _css.style)(_videotag, {
                objectFit: ''
            });
            _currentQuality = -1;
            // Don't call load in iE9/10 and check for load in PhantomJS
            if (!_environment.Browser.msie && 'load' in _videotag) {
                _videotag.load();
            }
        }
    }

    function _getSeekableStart() {
        var index = _videotag.seekable ? _videotag.seekable.length : 0;
        var start = Infinity;

        while (index--) {
            start = Math.min(start, _videotag.seekable.start(index));
        }
        return start;
    }

    function _getSeekableEnd() {
        var index = _videotag.seekable ? _videotag.seekable.length : 0;
        var end = 0;

        while (index--) {
            end = Math.max(end, _videotag.seekable.end(index));
        }
        return end;
    }

    this.stop = function () {
        clearTimeouts();
        _clearVideotagSource();
        this.clearTracks();
        // IE/Edge continue to play a video after changing video.src and calling video.load()
        // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/5383483/ (not fixed in Edge 14)
        if (_environment.Browser.ie) {
            _videotag.pause();
        }
        this.setState(_events.STATE_IDLE);
    };

    this.destroy = function () {
        _beforeResumeHandler = _helpers2.default.noop;
        _removeListeners(MediaEvents, _videotag);
        this.removeTracksListener(_videotag.audioTracks, 'change', _audioTrackChangeHandler);
        this.removeTracksListener(_videotag.textTracks, 'change', _this.textTrackChangeHandler);
        this.off();
    };

    this.init = function (item) {
        _setLevels(item.sources);
        var source = _levels[_currentQuality];
        _androidHls = (0, _html5AndroidHls.isAndroidHls)(source);
        if (_androidHls) {
            // Playback rate is broken on Android HLS
            _this.supportsPlaybackRate = false;
        }
        // the loadeddata event determines the mediaType for HLS sources
        if (_levels.length && _levels[0].type !== 'hls') {
            this.sendMediaType(_levels);
        }
        visualQuality.reason = '';
    };

    this.preload = function (item) {
        _setLevels(item.sources);
        var source = _levels[_currentQuality];
        var preload = source.preload || 'metadata';
        if (preload !== 'none') {
            _setAttribute('preload', preload);
            _setVideotagSource(source);
        }
    };

    this.load = function (item) {
        _setLevels(item.sources);
        _completeLoad(item.starttime || 0, item.duration || 0);
        this.setupSideloadedTracks(item.tracks);
    };

    this.play = function () {
        _beforeResumeHandler();
        return _play();
    };

    this.pause = function () {
        clearTimeouts();
        _beforeResumeHandler = function _beforeResumeHandler() {
            var unpausing = _videotag.paused && _videotag.currentTime;
            if (unpausing && _this.isLive()) {
                var end = _getSeekableEnd();
                var seekableDuration = end - _getSeekableStart();
                var isLiveNotDvr = seekableDuration < MIN_DVR_DURATION;
                var behindLiveEdge = end - _videotag.currentTime;
                if (isLiveNotDvr && end && (behindLiveEdge > 15 || behindLiveEdge < 0)) {
                    // resume playback at edge of live stream
                    _seekOffset = Math.max(end - 10, end - seekableDuration);
                    _setPositionBeforeSeek(_videotag.currentTime);
                    _videotag.currentTime = _seekOffset;
                }
            }
        };
        _videotag.pause();
    };

    this.seek = function (seekPos) {
        if (seekPos < 0) {
            seekPos += _getSeekableStart() + _getSeekableEnd();
        }
        if (!_canSeek) {
            _canSeek = !!_getSeekableEnd();
        }
        if (_canSeek) {
            _delayedSeek = 0;
            // setting currentTime can throw an invalid DOM state exception if the video is not ready
            try {
                _this.seeking = true;
                _seekOffset = seekPos;
                _setPositionBeforeSeek(_videotag.currentTime);
                _videotag.currentTime = seekPos;
            } catch (e) {
                _this.seeking = false;
                _delayedSeek = seekPos;
            }
        } else {
            _delayedSeek = seekPos;
            // Firefox isn't firing canplay event when in a paused state
            // https://bugzilla.mozilla.org/show_bug.cgi?id=1194624
            if (_environment.Browser.firefox && _videotag.paused) {
                _play();
            }
        }
    };

    function _audioTrackChangeHandler() {
        var _selectedAudioTrackIndex = -1;
        for (var i = 0; i < _videotag.audioTracks.length; i++) {
            if (_videotag.audioTracks[i].enabled) {
                _selectedAudioTrackIndex = i;
                break;
            }
        }
        _setCurrentAudioTrack(_selectedAudioTrackIndex);
    }

    function _sendFullscreen(e) {
        _this.trigger('fullscreenchange', {
            target: e.target,
            jwstate: _fullscreenState
        });
    }

    this.setVisibility = function (state) {
        state = !!state;
        if (state || _environment.OS.android) {
            // Changing visibility to hidden on Android < 4.2 causes
            // the pause event to be fired. This causes audio files to
            // become unplayable. Hence the video tag is always kept
            // visible on Android devices.
            (0, _css.style)(_this.container, {
                visibility: 'visible',
                opacity: 1
            });
        } else {
            (0, _css.style)(_this.container, {
                visibility: '',
                opacity: 0
            });
        }
    };

    this.resize = function (width, height, stretching) {
        if (!width || !height || !_videotag.videoWidth || !_videotag.videoHeight) {
            return false;
        }
        var styles = {
            objectFit: '',
            width: '',
            height: ''
        };
        if (stretching === 'uniform') {
            // snap video to edges when the difference in aspect ratio is less than 9%
            var playerAspectRatio = width / height;
            var videoAspectRatio = _videotag.videoWidth / _videotag.videoHeight;
            if (Math.abs(playerAspectRatio - videoAspectRatio) < 0.09) {
                styles.objectFit = 'fill';
                stretching = 'exactfit';
            }
        }
        // Prior to iOS 9, object-fit worked poorly
        // object-fit is not implemented in IE or Android Browser in 4.4 and lower
        // http://caniuse.com/#feat=object-fit
        // feature detection may work for IE but not for browsers where object-fit works for images only
        var fitVideoUsingTransforms = _environment.Browser.ie || _environment.OS.iOS && _environment.OS.version.major < 9 || _environment.Browser.androidNative;
        if (fitVideoUsingTransforms) {
            // Use transforms to center and scale video in container
            var x = -Math.floor(_videotag.videoWidth / 2 + 1);
            var y = -Math.floor(_videotag.videoHeight / 2 + 1);
            var scaleX = Math.ceil(width * 100 / _videotag.videoWidth) / 100;
            var scaleY = Math.ceil(height * 100 / _videotag.videoHeight) / 100;
            if (stretching === 'none') {
                scaleX = scaleY = 1;
            } else if (stretching === 'fill') {
                scaleX = scaleY = Math.max(scaleX, scaleY);
            } else if (stretching === 'uniform') {
                scaleX = scaleY = Math.min(scaleX, scaleY);
            }
            styles.width = _videotag.videoWidth;
            styles.height = _videotag.videoHeight;
            styles.top = styles.left = '50%';
            styles.margin = 0;
            (0, _css.transform)(_videotag, 'translate(' + x + 'px, ' + y + 'px) scale(' + scaleX.toFixed(2) + ', ' + scaleY.toFixed(2) + ')');
        }
        (0, _css.style)(_videotag, styles);
        return false;
    };

    this.setFullscreen = function (state) {
        state = !!state;

        // This implementation is for iOS and Android WebKit only
        // This won't get called if the player container can go fullscreen
        if (state) {
            var status = _helpers2.default.tryCatch(function () {
                var enterFullscreen = _videotag.webkitEnterFullscreen || _videotag.webkitEnterFullScreen;
                if (enterFullscreen) {
                    enterFullscreen.apply(_videotag);
                }
            });

            if (status instanceof _helpers2.default.Error) {
                // object can't go fullscreen
                return false;
            }
            return _this.getFullScreen();
        }

        var exitFullscreen = _videotag.webkitExitFullscreen || _videotag.webkitExitFullScreen;
        if (exitFullscreen) {
            exitFullscreen.apply(_videotag);
        }

        return state;
    };

    _this.getFullScreen = function () {
        return _fullscreenState || !!_videotag.webkitDisplayingFullscreen;
    };

    this.setCurrentQuality = function (quality) {
        if (_currentQuality === quality) {
            return;
        }
        if (quality >= 0) {
            if (_levels && _levels.length > quality) {
                _currentQuality = quality;
                visualQuality.reason = 'api';
                visualQuality.level = {};
                this.trigger(_events.MEDIA_LEVEL_CHANGED, {
                    currentQuality: quality,
                    levels: _getPublicLevels(_levels)
                });

                // The playerConfig is not updated automatically, because it is a clone
                // from when the provider was first initialized
                _playerConfig.qualityLabel = _levels[quality].label;

                var time = _videotag.currentTime || 0;
                var duration = _this.getDuration();
                _completeLoad(time, duration);
                _play();
            }
        }
    };

    this.setPlaybackRate = function (playbackRate) {
        // Set defaultPlaybackRate so that we do not send ratechange events when setting src
        _videotag.playbackRate = _videotag.defaultPlaybackRate = playbackRate;
    };

    this.getPlaybackRate = function () {
        return _videotag.playbackRate;
    };

    this.getCurrentQuality = function () {
        return _currentQuality;
    };

    this.getQualityLevels = function () {
        return _underscore2.default.map(_levels, function (level) {
            return (0, _dataNormalizer.qualityLevel)(level);
        });
    };

    this.getName = function () {
        return { name: _name };
    };
    this.setCurrentAudioTrack = _setCurrentAudioTrack;

    this.getAudioTracks = _getAudioTracks;

    this.getCurrentAudioTrack = _getCurrentAudioTrack;

    function _setAudioTracks(tracks) {
        _audioTracks = null;
        if (!tracks) {
            return;
        }
        if (tracks.length) {
            for (var i = 0; i < tracks.length; i++) {
                if (tracks[i].enabled) {
                    _currentAudioTrackIndex = i;
                    break;
                }
            }
            if (_currentAudioTrackIndex === -1) {
                _currentAudioTrackIndex = 0;
                tracks[_currentAudioTrackIndex].enabled = true;
            }
            _audioTracks = _underscore2.default.map(tracks, function (track) {
                var _track = {
                    name: track.label || track.language,
                    language: track.language
                };
                return _track;
            });
        }
        _this.addTracksListener(tracks, 'change', _audioTrackChangeHandler);
        if (_audioTracks) {
            _this.trigger('audioTracks', { currentTrack: _currentAudioTrackIndex, tracks: _audioTracks });
        }
    }

    function _setCurrentAudioTrack(index) {
        if (_videotag && _videotag.audioTracks && _audioTracks && index > -1 && index < _videotag.audioTracks.length && index !== _currentAudioTrackIndex) {
            _videotag.audioTracks[_currentAudioTrackIndex].enabled = false;
            _currentAudioTrackIndex = index;
            _videotag.audioTracks[_currentAudioTrackIndex].enabled = true;
            _this.trigger('audioTrackChanged', { currentTrack: _currentAudioTrackIndex,
                tracks: _audioTracks });
        }
    }

    function _getAudioTracks() {
        return _audioTracks || [];
    }

    function _getCurrentAudioTrack() {
        return _currentAudioTrackIndex;
    }

    function _setMediaType() {
        // Send mediaType when format is HLS. Other types are handled earlier by default.js.
        if (_levels[0].type === 'hls') {
            var mediaType = 'video';
            if (_videotag.videoHeight === 0) {
                mediaType = 'audio';
            }
            _this.trigger('mediaType', { mediaType: mediaType });
        }
    }

    // If we're live and the buffer end has remained the same for some time, mark the stream as stale and check if the stream is over
    function checkStaleStream() {
        var endOfBuffer = (0, _timeRanges2.default)(_videotag.buffered);
        var live = _this.isLive();

        // Don't end if we have noting buffered yet, or cannot get any information about the buffer
        if (live && endOfBuffer && _lastEndOfBuffer === endOfBuffer) {
            if (_staleStreamTimeout === -1) {
                _staleStreamTimeout = setTimeout(function () {
                    _stale = true;
                    checkStreamEnded();
                }, _staleStreamDuration);
            }
        } else {
            clearTimeouts();
            _stale = false;
        }

        _lastEndOfBuffer = endOfBuffer;
    }

    function checkStreamEnded() {
        if (_stale && _this.atEdgeOfLiveStream()) {
            _this.trigger(_events.MEDIA_ERROR, {
                message: 'The live stream is either down or has ended'
            });
            return true;
        }

        return false;
    }

    function clearTimeouts() {
        clearTimeout(_staleStreamTimeout);
        _staleStreamTimeout = -1;
    }
}

_extends(VideoProvider.prototype, _default2.default);

VideoProvider.getName = function () {
    return { name: 'html5' };
};

exports.default = VideoProvider;

/***/ }),
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */,
/* 23 */,
/* 24 */,
/* 25 */,
/* 26 */,
/* 27 */,
/* 28 */,
/* 29 */,
/* 30 */,
/* 31 */,
/* 32 */,
/* 33 */,
/* 34 */,
/* 35 */,
/* 36 */,
/* 37 */,
/* 38 */,
/* 39 */,
/* 40 */,
/* 41 */,
/* 42 */,
/* 43 */,
/* 44 */,
/* 45 */,
/* 46 */,
/* 47 */,
/* 48 */,
/* 49 */,
/* 50 */,
/* 51 */,
/* 52 */,
/* 53 */,
/* 54 */,
/* 55 */,
/* 56 */,
/* 57 */,
/* 58 */,
/* 59 */,
/* 60 */,
/* 61 */,
/* 62 */,
/* 63 */,
/* 64 */,
/* 65 */,
/* 66 */,
/* 67 */
/*!****************************!*\
  !*** ./src/js/utils/ui.js ***!
  \****************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getPointerType = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _environment = __webpack_require__(/*! environment/environment */ 22);

var _events = __webpack_require__(/*! events/events */ 4);

var _backbone = __webpack_require__(/*! utils/backbone.events */ 7);

var _backbone2 = _interopRequireDefault(_backbone);

var _date = __webpack_require__(/*! utils/date */ 35);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _supportsPointerEvents = 'PointerEvent' in window && !_environment.OS.android;
var _supportsTouchEvents = 'ontouchstart' in window;
var _useMouseEvents = !_supportsPointerEvents && !(_supportsTouchEvents && _environment.OS.mobile);
var _isOSXFirefox = _environment.Browser.firefox && _environment.OS.mac;

function getCoord(e, c) {
    return (/touch/.test(e.type) ? (e.originalEvent || e).changedTouches[0]['page' + c] : e['page' + c]
    );
}

function isRightClick(evt) {
    var e = evt || window.event;

    if (!(evt instanceof MouseEvent)) {
        return false;
    }

    if ('which' in e) {
        // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
        return e.which === 3;
    } else if ('button' in e) {
        // IE and Opera
        return e.button === 2;
    }

    return false;
}

function isEnterKey(evt) {
    var e = evt || window.event;

    if (e instanceof KeyboardEvent && e.keyCode === 13) {
        evt.stopPropagation();
        return true;
    }

    return false;
}

function normalizeUIEvent(type, srcEvent, target) {
    var source = void 0;

    if (srcEvent instanceof MouseEvent || !srcEvent.touches && !srcEvent.changedTouches) {
        source = srcEvent;
    } else if (srcEvent.touches && srcEvent.touches.length) {
        source = srcEvent.touches[0];
    } else {
        source = srcEvent.changedTouches[0];
    }

    return {
        type: type,
        sourceEvent: srcEvent,
        target: srcEvent.target,
        currentTarget: target,
        pageX: source.pageX,
        pageY: source.pageY
    };
}

// Preventdefault to prevent click events
function preventDefault(evt) {
    // Because sendEvent from utils.eventdispatcher clones evt objects instead of passing them
    //  we cannot call evt.preventDefault() on them
    if (!(evt instanceof MouseEvent) && !(evt instanceof window.TouchEvent)) {
        return;
    }
    if (evt.preventManipulation) {
        evt.preventManipulation();
    }
    // prevent scrolling
    if (evt.preventDefault) {
        evt.preventDefault();
    }
}

var UI = function UI(elem, options) {
    var _elem = elem;
    var _hasMoved = false;
    var _startX = 0;
    var _startY = 0;
    var _lastClickTime = 0;
    var _doubleClickDelay = 300;
    var _touchListenerTarget = void 0;
    var _pointerId = void 0;

    options = options || {};

    // If its not mobile, add mouse listener.  Add touch listeners so touch devices that aren't Android or iOS
    // (windows phones) still get listeners just in case they want to use them.
    if (_supportsPointerEvents) {
        elem.addEventListener('pointerdown', interactStartHandler);
        if (options.useHover) {
            elem.addEventListener('pointerover', overHandler);
            elem.addEventListener('pointerout', outHandler);
        }
        if (options.useMove) {
            elem.addEventListener('pointermove', moveHandler);
        }
    } else {
        if (_useMouseEvents) {
            elem.addEventListener('mousedown', interactStartHandler);
            if (options.useHover) {
                elem.addEventListener('mouseover', overHandler);
                elem.addEventListener('mouseout', outHandler);
            }
            if (options.useMove) {
                elem.addEventListener('mousemove', moveHandler);
            }
        }

        // Always add this, in case we don't properly identify the device as mobile
        elem.addEventListener('touchstart', interactStartHandler);
    }

    elem.addEventListener('keydown', keyHandler);
    if (options.useFocus) {
        elem.addEventListener('focus', overHandler);
        elem.addEventListener('blur', outHandler);
    }

    // overHandler and outHandler not assigned in touch situations
    function overHandler(evt) {
        if (evt.pointerType !== 'touch') {
            triggerEvent(_events.OVER, evt);
        }
    }

    function moveHandler(evt) {
        if (evt.pointerType !== 'touch') {
            triggerEvent(_events.MOVE, evt);
        }
    }

    function outHandler(evt) {
        // elementFromPoint to handle an issue where setPointerCapture is causing a pointerout event
        if (_useMouseEvents || _supportsPointerEvents && evt.pointerType !== 'touch' && !elem.contains(document.elementFromPoint(evt.x, evt.y))) {
            triggerEvent(_events.OUT, evt);
        }
    }

    function keyHandler(evt) {
        if (isEnterKey(evt)) {
            triggerEvent(_events.ENTER, evt);
        }
    }

    function setEventListener(element, eventName, callback) {
        element.removeEventListener(eventName, callback);
        element.addEventListener(eventName, callback);
    }

    function interactStartHandler(evt) {
        _touchListenerTarget = evt.target;
        _startX = getCoord(evt, 'X');
        _startY = getCoord(evt, 'Y');

        if (!isRightClick(evt)) {

            if (evt.type === 'pointerdown' && evt.isPrimary) {
                if (options.preventScrolling) {
                    _pointerId = evt.pointerId;
                    elem.setPointerCapture(_pointerId);
                }
                setEventListener(elem, 'pointermove', interactDragHandler);
                setEventListener(elem, 'pointercancel', interactEndHandler);

                // Listen for mouseup after mouse pointer down because pointerup doesn't fire on swf objects
                if (evt.pointerType === 'mouse' && _touchListenerTarget.nodeName === 'OBJECT') {
                    setEventListener(document, 'mouseup', interactEndHandler);
                } else {
                    setEventListener(elem, 'pointerup', interactEndHandler);
                }
            } else if (evt.type === 'mousedown') {
                setEventListener(document, 'mousemove', interactDragHandler);

                // Handle clicks in OSX Firefox over Flash 'object'
                if (_isOSXFirefox && evt.target.nodeName.toLowerCase() === 'object') {
                    setEventListener(elem, 'click', interactEndHandler);
                } else {
                    setEventListener(document, 'mouseup', interactEndHandler);
                }
            } else if (evt.type === 'touchstart') {
                setEventListener(_touchListenerTarget, 'touchmove', interactDragHandler);
                setEventListener(_touchListenerTarget, 'touchcancel', interactEndHandler);
                setEventListener(_touchListenerTarget, 'touchend', interactEndHandler);
            }

            // Prevent scrolling the screen dragging while dragging on mobile.
            if (options.preventScrolling) {
                preventDefault(evt);
            }
        }
    }

    function interactDragHandler(evt) {
        var movementThreshold = 6;

        if (_hasMoved) {
            triggerEvent(_events.DRAG, evt);
        } else {
            var endX = getCoord(evt, 'X');
            var endY = getCoord(evt, 'Y');
            var moveX = endX - _startX;
            var moveY = endY - _startY;
            if (moveX * moveX + moveY * moveY > movementThreshold * movementThreshold) {
                triggerEvent(_events.DRAG_START, evt);
                _hasMoved = true;
                triggerEvent(_events.DRAG, evt);
            }
        }

        // Prevent scrolling the screen dragging while dragging on mobile.
        if (options.preventScrolling) {
            preventDefault(evt);
        }
    }

    function interactEndHandler(evt) {
        var isPointerEvent = evt.type === 'pointerup' || evt.type === 'pointercancel';
        if (isPointerEvent && options.preventScrolling) {
            elem.releasePointerCapture(_pointerId);
        }
        elem.removeEventListener('pointermove', interactDragHandler);
        elem.removeEventListener('pointercancel', interactEndHandler);
        elem.removeEventListener('pointerup', interactEndHandler);
        document.removeEventListener('mousemove', interactDragHandler);
        document.removeEventListener('mouseup', interactEndHandler);
        if (_touchListenerTarget) {
            _touchListenerTarget.removeEventListener('touchmove', interactDragHandler);
            _touchListenerTarget.removeEventListener('touchcancel', interactEndHandler);
            _touchListenerTarget.removeEventListener('touchend', interactEndHandler);
        }

        if (_hasMoved) {
            triggerEvent(_events.DRAG_END, evt);
        } else if ((!options.directSelect || evt.target === elem) && evt.type.indexOf('cancel') === -1) {
            if (evt.type === 'mouseup' || evt.type === 'click' || isPointerEvent && evt.pointerType === 'mouse') {
                triggerEvent(_events.CLICK, evt);
            } else {
                triggerEvent(_events.TAP, evt);
                if (evt.type === 'touchend') {
                    // preventDefault to not dispatch the 300ms delayed click after a tap
                    preventDefault(evt);
                }
            }
        }

        _touchListenerTarget = null;
        _hasMoved = false;
    }

    var self = this;
    function triggerEvent(type, srcEvent) {
        var evt = void 0;
        if (options.enableDoubleTap && (type === _events.CLICK || type === _events.TAP)) {
            if ((0, _date.now)() - _lastClickTime < _doubleClickDelay) {
                var doubleType = type === _events.CLICK ? _events.DOUBLE_CLICK : _events.DOUBLE_TAP;
                evt = normalizeUIEvent(doubleType, srcEvent, _elem);
                self.trigger(doubleType, evt);
                _lastClickTime = 0;
            } else {
                _lastClickTime = (0, _date.now)();
            }
        }
        evt = normalizeUIEvent(type, srcEvent, _elem);
        self.trigger(type, evt);
    }

    this.triggerEvent = triggerEvent;

    this.destroy = function () {
        this.off();
        elem.removeEventListener('touchstart', interactStartHandler);
        elem.removeEventListener('mousedown', interactStartHandler);
        elem.removeEventListener('keydown', keyHandler);

        if (_touchListenerTarget) {
            _touchListenerTarget.removeEventListener('touchmove', interactDragHandler);
            _touchListenerTarget.removeEventListener('touchcancel', interactEndHandler);
            _touchListenerTarget.removeEventListener('touchend', interactEndHandler);
            _touchListenerTarget = null;
        }

        if (_supportsPointerEvents) {
            if (options.preventScrolling) {
                elem.releasePointerCapture(_pointerId);
            }
            elem.removeEventListener('pointerover', overHandler);
            elem.removeEventListener('pointerdown', interactStartHandler);
            elem.removeEventListener('pointermove', interactDragHandler);
            elem.removeEventListener('pointermove', moveHandler);
            elem.removeEventListener('pointercancel', interactEndHandler);
            elem.removeEventListener('pointerout', outHandler);
            elem.removeEventListener('pointerup', interactEndHandler);
        }

        elem.removeEventListener('click', interactEndHandler);
        elem.removeEventListener('mouseover', overHandler);
        elem.removeEventListener('mousemove', moveHandler);
        elem.removeEventListener('mouseout', outHandler);
        document.removeEventListener('mousemove', interactDragHandler);
        document.removeEventListener('mouseup', interactEndHandler);

        if (options.useFocus) {
            elem.removeEventListener('focus', overHandler);
            elem.removeEventListener('blur', outHandler);
        }
    };

    return this;
};

// Expose what the source of the event is so that we can ensure it's handled correctly.
// This returns only 'touch' or 'mouse'. 'pen' will be treated as a mouse.
UI.getPointerType = function (evt) {
    if (_supportsPointerEvents && evt instanceof window.PointerEvent) {
        return evt.pointerType === 'touch' ? 'touch' : 'mouse';
    } else if (_supportsTouchEvents && evt instanceof window.TouchEvent) {
        return 'touch';
    }

    return 'mouse';
};

_extends(UI.prototype, _backbone2.default);

var getPointerType = exports.getPointerType = UI.getPointerType;

exports.default = UI;

/***/ }),
/* 68 */
/*!***************************************!*\
  !*** ./src/js/view/controls/icons.js ***!
  \***************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.cloneIcon = cloneIcon;
exports.cloneIcons = cloneIcons;

var _buffer = __webpack_require__(/*! assets/SVG/buffer.svg */ 91);

var _buffer2 = _interopRequireDefault(_buffer);

var _replay = __webpack_require__(/*! assets/SVG/replay.svg */ 92);

var _replay2 = _interopRequireDefault(_replay);

var _playbackError = __webpack_require__(/*! assets/SVG/playback-error.svg */ 93);

var _playbackError2 = _interopRequireDefault(_playbackError);

var _play = __webpack_require__(/*! assets/SVG/play.svg */ 94);

var _play2 = _interopRequireDefault(_play);

var _pause = __webpack_require__(/*! assets/SVG/pause.svg */ 95);

var _pause2 = _interopRequireDefault(_pause);

var _rewind = __webpack_require__(/*! assets/SVG/rewind-10.svg */ 96);

var _rewind2 = _interopRequireDefault(_rewind);

var _next = __webpack_require__(/*! assets/SVG/next.svg */ 97);

var _next2 = _interopRequireDefault(_next);

var _volume = __webpack_require__(/*! assets/SVG/volume-0.svg */ 98);

var _volume2 = _interopRequireDefault(_volume);

var _volume3 = __webpack_require__(/*! assets/SVG/volume-50.svg */ 99);

var _volume4 = _interopRequireDefault(_volume3);

var _volume5 = __webpack_require__(/*! assets/SVG/volume-100.svg */ 100);

var _volume6 = _interopRequireDefault(_volume5);

var _captionsOn = __webpack_require__(/*! assets/SVG/captions-on.svg */ 101);

var _captionsOn2 = _interopRequireDefault(_captionsOn);

var _captionsOff = __webpack_require__(/*! assets/SVG/captions-off.svg */ 102);

var _captionsOff2 = _interopRequireDefault(_captionsOff);

var _airplayOn = __webpack_require__(/*! assets/SVG/airplay-on.svg */ 103);

var _airplayOn2 = _interopRequireDefault(_airplayOn);

var _airplayOff = __webpack_require__(/*! assets/SVG/airplay-off.svg */ 104);

var _airplayOff2 = _interopRequireDefault(_airplayOff);

var _dvr = __webpack_require__(/*! assets/SVG/dvr.svg */ 105);

var _dvr2 = _interopRequireDefault(_dvr);

var _live = __webpack_require__(/*! assets/SVG/live.svg */ 106);

var _live2 = _interopRequireDefault(_live);

var _playbackRate = __webpack_require__(/*! assets/SVG/playback-rate.svg */ 107);

var _playbackRate2 = _interopRequireDefault(_playbackRate);

var _settings = __webpack_require__(/*! assets/SVG/settings.svg */ 108);

var _settings2 = _interopRequireDefault(_settings);

var _audioTracks = __webpack_require__(/*! assets/SVG/audio-tracks.svg */ 109);

var _audioTracks2 = _interopRequireDefault(_audioTracks);

var _quality = __webpack_require__(/*! assets/SVG/quality-100.svg */ 110);

var _quality2 = _interopRequireDefault(_quality);

var _fullscreenNot = __webpack_require__(/*! assets/SVG/fullscreen-not.svg */ 111);

var _fullscreenNot2 = _interopRequireDefault(_fullscreenNot);

var _fullscreen = __webpack_require__(/*! assets/SVG/fullscreen.svg */ 112);

var _fullscreen2 = _interopRequireDefault(_fullscreen);

var _close = __webpack_require__(/*! assets/SVG/close.svg */ 113);

var _close2 = _interopRequireDefault(_close);

var _jwLogo = __webpack_require__(/*! assets/SVG/jw-logo.svg */ 114);

var _jwLogo2 = _interopRequireDefault(_jwLogo);

var _svgParser = __webpack_require__(/*! utils/svgParser */ 70);

var _svgParser2 = _interopRequireDefault(_svgParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import ARROW_ICON from 'assets/SVG/arror.svg';

// import QUALITY_ICON_25 from 'assets/SVG/quality-25.svg';
// import QUALITY_ICON_50 from 'assets/SVG/quality-50.svg';
// import QUALITY_ICON_75 from 'assets/SVG/quality-75.svg';

// import STOP_ICON from 'assets/SVG/stop.svg';
var collection = null;

function cloneIcon(name) {
    var icon = getCollection().querySelector(nameToClass(name));
    if (icon) {
        return clone(icon);
    }
    if (true) {
        throw new Error('Icon not found ' + name);
    }
    return null;
}

function cloneIcons(names) {
    var icons = getCollection().querySelectorAll(names.split(',').map(nameToClass).join(','));
    if (true && !icons.length) {
        throw new Error('Icons not found ' + names);
    }
    return Array.prototype.map.call(icons, function (icon) {
        return clone(icon);
    });
}

function nameToClass(name) {
    return '.jw-svg-icon-' + name;
}

function clone(icon) {
    return icon.cloneNode(true);
}

function getCollection() {
    if (!collection) {
        collection = parseCollection();
    }
    return collection;
}

function parseCollection() {
    return (0, _svgParser2.default)('<xml>' + _buffer2.default + _replay2.default + _playbackError2.default + _play2.default + _pause2.default + _rewind2.default + _next2.default + _volume2.default + _volume4.default + _volume6.default + _captionsOn2.default + _captionsOff2.default + _airplayOn2.default + _airplayOff2.default + _dvr2.default + _live2.default + _playbackRate2.default + _settings2.default + _audioTracks2.default + _quality2.default + _fullscreenNot2.default + _fullscreen2.default + _close2.default + _jwLogo2.default + '</xml>');
}

/***/ }),
/* 69 */
/*!***************************************************!*\
  !*** ./src/js/view/controls/components/button.js ***!
  \***************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (icon, apiAction, ariaText, svgIcons) {
    var _element = document.createElement('div');
    _element.className = 'jw-icon jw-icon-inline jw-button-color jw-reset ' + icon;
    _element.setAttribute('role', 'button');
    _element.setAttribute('tabindex', '0');

    if (ariaText) {
        _element.setAttribute('aria-label', ariaText);
    }

    _element.style.display = 'none';

    if (apiAction) {
        new _ui2.default(_element).on('click tap enter', function (event) {
            apiAction(event);
        });
    }

    // Prevent button from being focused on mousedown so that the tooltips don't remain visible until
    // the user interacts with another element on the page
    _element.addEventListener('mousedown', function (e) {
        e.preventDefault();
    });

    if (svgIcons) {
        Array.prototype.forEach.call(svgIcons, function (svgIcon) {
            if (typeof svgIcon === 'string') {
                _element.appendChild((0, _svgParser2.default)(svgIcon));
            } else {
                _element.appendChild(svgIcon);
            }
        });
    }

    return {
        element: function element() {
            return _element;
        },
        toggle: function toggle(m) {
            if (m) {
                this.show();
            } else {
                this.hide();
            }
        },
        show: function show() {
            _element.style.display = '';
        },
        hide: function hide() {
            _element.style.display = 'none';
        }
    };
};

var _ui = __webpack_require__(/*! utils/ui */ 67);

var _ui2 = _interopRequireDefault(_ui);

var _svgParser = __webpack_require__(/*! utils/svgParser */ 70);

var _svgParser2 = _interopRequireDefault(_svgParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 70 */
/*!***********************************!*\
  !*** ./src/js/utils/svgParser.js ***!
  \***********************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = svgParse;
var parser = void 0;

function svgParse(svgXml) {
    if (!parser) {
        parser = new DOMParser();
    }

    return parser.parseFromString(svgXml, 'image/svg+xml').documentElement;
}

/***/ }),
/* 71 */
/*!****************************************!*\
  !*** ./src/js/parsers/captions/srt.js ***!
  \****************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = Srt;

var _strings = __webpack_require__(/*! utils/strings */ 1);

// Component that loads and parses an SRT file

function Srt(data) {
    // Trim whitespace and split the list by returns.
    var _captions = [];
    data = (0, _strings.trim)(data);
    var list = data.split('\r\n\r\n');
    if (list.length === 1) {
        list = data.split('\n\n');
    }

    for (var i = 0; i < list.length; i++) {
        if (list[i] === 'WEBVTT') {
            continue;
        }
        // Parse each entry
        var entry = _entry(list[i]);
        if (entry.text) {
            _captions.push(entry);
        }
    }

    return _captions;
}

/** Parse a single captions entry. **/
function _entry(data) {
    var entry = {};
    var array = data.split('\r\n');
    if (array.length === 1) {
        array = data.split('\n');
    }
    var idx = 1;
    if (array[0].indexOf(' --> ') > 0) {
        idx = 0;
    }
    if (array.length > idx + 1 && array[idx + 1]) {
        // This line contains the start and end.
        var line = array[idx];
        var index = line.indexOf(' --> ');
        if (index > 0) {
            entry.begin = (0, _strings.seconds)(line.substr(0, index));
            entry.end = (0, _strings.seconds)(line.substr(index + 5));
            // Remaining lines contain the text
            entry.text = array.slice(idx + 1).join('\r\n');
        }
    }
    return entry;
}

/***/ }),
/* 72 */
/*!**********************************!*\
  !*** ./src/js/view/constants.js ***!
  \**********************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var dvrSeekLimit = exports.dvrSeekLimit = -25;

/***/ }),
/* 73 */
/*!*********************************************!*\
  !*** ./src/js/events/change-state-event.js ***!
  \*********************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = ChangeStateEvent;

var _events = __webpack_require__(/*! events/events */ 4);

// The api should dispatch an idle event when the model's state changes to complete
// This is to avoid conflicts with the complete event and to maintain legacy event flow
function normalizeApiState(newstate) {
    if (newstate === _events.STATE_COMPLETE || newstate === _events.STATE_ERROR) {
        return _events.STATE_IDLE;
    }
    return newstate;
}

function ChangeStateEvent(model, newstate, oldstate) {
    newstate = normalizeApiState(newstate);
    oldstate = normalizeApiState(oldstate);
    // do not dispatch idle a second time after complete
    if (newstate !== oldstate) {
        // buffering, playing and paused states become:
        // buffer, play and pause events
        var eventType = newstate.replace(/(?:ing|d)$/, '');
        var evt = {
            type: eventType,
            newstate: newstate,
            oldstate: oldstate,
            reason: model.mediaModel.get('state')
        };
        // add reason for play/pause events
        if (eventType === 'play') {
            evt.playReason = model.get('playReason');
        } else if (eventType === 'pause') {
            evt.pauseReason = model.get('pauseReason');
        }
        this.trigger(eventType, evt);
    }
}

/***/ }),
/* 74 */
/*!************************************!*\
  !*** ./src/js/controller/model.js ***!
  \************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _environment = __webpack_require__(/*! environment/environment */ 22);

var _simplemodel = __webpack_require__(/*! model/simplemodel */ 40);

var _simplemodel2 = _interopRequireDefault(_simplemodel);

var _playerModel = __webpack_require__(/*! model/player-model */ 41);

var _providers2 = __webpack_require__(/*! providers/providers */ 27);

var _providers3 = _interopRequireDefault(_providers2);

var _setPlaylist = __webpack_require__(/*! api/set-playlist */ 32);

var _getMediaElement = __webpack_require__(/*! api/get-media-element */ 42);

var _getMediaElement2 = _interopRequireDefault(_getMediaElement);

var _qoe = __webpack_require__(/*! controller/qoe */ 144);

var _qoe2 = _interopRequireDefault(_qoe);

var _events = __webpack_require__(/*! events/events */ 4);

var _strings = __webpack_require__(/*! utils/strings */ 1);

var _underscore = __webpack_require__(/*! utils/underscore */ 0);

var _underscore2 = _interopRequireDefault(_underscore);

var _backbone = __webpack_require__(/*! utils/backbone.events */ 7);

var _backbone2 = _interopRequireDefault(_backbone);

var _promise = __webpack_require__(/*! polyfills/promise */ 6);

var _cancelable = __webpack_require__(/*! utils/cancelable */ 82);

var _cancelable2 = _interopRequireDefault(_cancelable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Represents the state of the player
var Model = function Model() {
    var _this = this;
    var _providers = void 0;
    var _provider = void 0;
    var _beforecompleted = false;
    var _attached = true;
    var thenPlayPromise = (0, _cancelable2.default)(function () {});
    var providerPromise = _promise.resolved;

    this.mediaController = _extends({}, _backbone2.default);
    this.mediaModel = new MediaModel();

    (0, _qoe2.default)(this);

    this.set('mediaModel', this.mediaModel);

    this.setup = function (config) {

        _extends(this.attributes, config, _playerModel.INITIAL_PLAYER_STATE);

        this.updateProviders();
        this.setAutoStart();

        return this;
    };

    this.getConfiguration = function () {
        var config = this.clone();
        delete config.mediaModel;
        return config;
    };

    this.updateProviders = function () {
        _providers = new _providers3.default(this.getConfiguration());
    };

    function _videoEventHandler(type, data) {
        var event = _extends({}, data, {
            type: type
        });
        var mediaModel = this.mediaModel;
        switch (type) {
            case 'flashThrottle':
                {
                    var throttled = data.state !== 'resume';
                    this.set('flashThrottle', throttled);
                    this.set('flashBlocked', throttled);
                }
                break;
            case 'flashBlocked':
                this.set('flashBlocked', true);
                return;
            case 'flashUnblocked':
                this.set('flashBlocked', false);
                return;
            case _events.MEDIA_VOLUME:
                this.set(type, data[type]);
                return;
            case _events.MEDIA_MUTE:
                if (!this.get('autostartMuted')) {
                    // Don't persist mute state with muted autostart
                    this.set(type, data[type]);
                }
                return;
            case _events.MEDIA_RATE_CHANGE:
                {
                    var rate = data.playbackRate;
                    // Check if its a generally usable rate.  Shaka changes rate to 0 when pause or buffering.
                    if (rate > 0) {
                        this.set('playbackRate', rate);
                    }
                }
                return;
            case _events.MEDIA_TYPE:
                if (mediaModel.get('mediaType') !== data.mediaType) {
                    mediaModel.set('mediaType', data.mediaType);
                    this.mediaController.trigger(type, event);
                }
                return;
            case _events.PLAYER_STATE:
                {
                    if (data.newstate === _events.STATE_IDLE) {
                        thenPlayPromise.cancel();
                        mediaModel.srcReset();
                    }
                    // Always fire change:state to keep player model in sync
                    var previousState = mediaModel.attributes[_events.PLAYER_STATE];
                    mediaModel.attributes[_events.PLAYER_STATE] = data.newstate;
                    mediaModel.trigger('change:' + _events.PLAYER_STATE, mediaModel, data.newstate, previousState);
                }
                // This "return" is important because
                //  we are choosing to not propagate this event.
                //  Instead letting the master controller do so
                return;
            case _events.MEDIA_ERROR:
                thenPlayPromise.cancel();
                mediaModel.srcReset();
                break;
            case _events.MEDIA_BUFFER:
                this.set('buffer', data.bufferPercent);
            /* falls through */
            case _events.MEDIA_META:
                {
                    var duration = data.duration;
                    if (_underscore2.default.isNumber(duration) && !_underscore2.default.isNaN(duration)) {
                        mediaModel.set('duration', duration);
                        this.set('duration', duration);
                    }
                    _extends(this.get('itemMeta'), data.metadata);
                    break;
                }
            case _events.MEDIA_TIME:
                {
                    mediaModel.set('position', data.position);
                    this.set('position', data.position);
                    var _duration = data.duration;
                    if (_underscore2.default.isNumber(_duration) && !_underscore2.default.isNaN(_duration)) {
                        mediaModel.set('duration', _duration);
                        this.set('duration', _duration);
                    }
                    break;
                }
            case _events.PROVIDER_CHANGED:
                this.set('provider', _provider.getName());
                break;
            case _events.MEDIA_LEVELS:
                this.setQualityLevel(data.currentQuality, data.levels);
                mediaModel.set('levels', data.levels);
                break;
            case _events.MEDIA_LEVEL_CHANGED:
                this.setQualityLevel(data.currentQuality, data.levels);
                this.persistQualityLevel(data.currentQuality, data.levels);
                break;
            case _events.MEDIA_COMPLETE:
                _beforecompleted = true;
                this.mediaController.trigger(_events.MEDIA_BEFORECOMPLETE, event);
                if (_attached) {
                    this.playbackComplete();
                }
                return;
            case _events.AUDIO_TRACKS:
                this.setCurrentAudioTrack(data.currentTrack, data.tracks);
                mediaModel.set('audioTracks', data.tracks);
                break;
            case _events.AUDIO_TRACK_CHANGED:
                this.setCurrentAudioTrack(data.currentTrack, data.tracks);
                break;
            case 'subtitlesTrackChanged':
                this.persistVideoSubtitleTrack(data.currentTrack, data.tracks);
                break;
            case 'visualQuality':
                mediaModel.set('visualQuality', _extends({}, data));
                break;
            default:
                break;
        }

        this.mediaController.trigger(type, event);
    }

    this.setQualityLevel = function (quality, levels) {
        if (quality > -1 && levels.length > 1) {
            this.mediaModel.set('currentLevel', parseInt(quality));
        }
    };

    this.persistQualityLevel = function (quality, levels) {
        var currentLevel = levels[quality] || {};
        var label = currentLevel.label;
        this.set('qualityLabel', label);
    };

    this.setCurrentAudioTrack = function (currentTrack, tracks) {
        if (currentTrack > -1 && tracks.length > 0 && currentTrack < tracks.length) {
            this.mediaModel.set('currentAudioTrack', parseInt(currentTrack));
        }
    };

    this.onMediaContainer = function () {
        var container = this.get('mediaContainer');
        _provider.setContainer(container);
    };

    this.changeVideoProvider = function (Provider) {
        this.off('change:mediaContainer', this.onMediaContainer);

        if (_provider) {
            _provider.off(null, null, this);
            if (_provider.getContainer()) {
                _provider.remove();
            }
            delete _provider.instreamMode;
        }

        if (!Provider) {
            this.resetProvider();
            this.set('provider', undefined);
            return;
        }

        _provider = new Provider(_this.get('id'), _this.getConfiguration());

        var container = this.get('mediaContainer');
        if (container) {
            _provider.setContainer(container);
        } else {
            this.once('change:mediaContainer', this.onMediaContainer);
        }

        if (_provider.getName().name.indexOf('flash') === -1) {
            this.set('flashThrottle', undefined);
            this.set('flashBlocked', false);
        }

        _provider.volume(_this.get('volume'));

        // Mute the video if autostarting on mobile, except for Android SDK. Otherwise, honor the model's mute value
        var isAndroidSdk = _this.get('sdkplatform') === 1;
        _provider.mute(this.autoStartOnMobile() && !isAndroidSdk || _this.get('mute'));

        _provider.on('all', _videoEventHandler, this);

        // Attempt setting the playback rate to be the user selected value
        this.setPlaybackRate(this.get('defaultPlaybackRate'));

        // Set playbackRate because provider support for playbackRate may have changed and not sent an update
        this.set('playbackRate', _provider.getPlaybackRate());

        if (this.get('instreamMode') === true) {
            _provider.instreamMode = true;
        }

        this.set('renderCaptionsNatively', _provider.renderNatively);
    };

    this.checkComplete = function () {
        return _beforecompleted;
    };

    this.detachMedia = function () {
        thenPlayPromise.cancel();
        _attached = false;
        if (_provider) {
            _provider.off('all', _videoEventHandler, this);
            _provider.detachMedia();
        }
    };

    this.attachMedia = function () {
        _attached = true;
        if (_provider) {
            _provider.off('all', _videoEventHandler, this);
            _provider.on('all', _videoEventHandler, this);
        }
        if (_beforecompleted) {
            this.playbackComplete();
        }
        if (_provider) {
            _provider.attachMedia();
        }

        // Restore the playback rate to the provider in case it changed while detached and we reused a video tag.
        this.setPlaybackRate(this.get('defaultPlaybackRate'));
    };

    this.playbackComplete = function () {
        _beforecompleted = false;
        _provider.setState(_events.STATE_COMPLETE);
        this.mediaController.trigger(_events.MEDIA_COMPLETE, {});
    };

    this.destroy = function () {
        this.attributes._destroyed = true;
        this.off();
        if (_provider) {
            _provider.off(null, null, this);
            _provider.destroy();
        }
    };

    this.getVideo = function () {
        return _provider;
    };

    this.setFullscreen = function (state) {
        state = !!state;
        if (state !== _this.get('fullscreen')) {
            _this.set('fullscreen', state);
        }
    };

    // Give the option for a provider to be forced
    this.chooseProvider = function (source) {
        // if _providers.choose is null, something went wrong in filtering
        return _providers.choose(source).provider;
    };

    this.setItemIndex = function (index) {
        var playlist = this.get('playlist');
        var length = playlist.length;

        // If looping past the end, or before the beginning
        index = parseInt(index, 10) || 0;
        index = (index + length) % length;

        this.set('item', index);
        return this.setActiveItem(playlist[index]);
    };

    this.setActiveItem = function (item) {
        thenPlayPromise.cancel();
        // Item is actually changing
        this.mediaModel.off();
        this.mediaModel = new MediaModel();
        resetItem(this, item);
        this.set('minDvrWindow', item.minDvrWindow);
        this.set('mediaModel', this.mediaModel);
        this.attributes.playlistItem = null;
        this.set('playlistItem', item);
        providerPromise = this.setProvider(item);
        return providerPromise;
    };

    function resetItem(model, item) {
        var position = item ? (0, _strings.seconds)(item.starttime) : 0;
        var duration = item ? (0, _strings.seconds)(item.duration) : 0;
        var mediaModelState = model.mediaModel.attributes;
        model.mediaModel.srcReset();
        mediaModelState.position = position;
        mediaModelState.duration = duration;

        model.set('playRejected', false);
        model.set('itemMeta', {});
        model.set('position', position);
        model.set('duration', duration);
    }

    this.setProvider = function (item) {
        var _this2 = this;

        var source = item && item.sources && item.sources[0];
        if (source === undefined) {
            // source is undefined when resetting index with empty playlist
            throw new Error('No media');
        }

        var Provider = this.chooseProvider(source);
        // If we are changing video providers
        if (!Provider || !(_provider && _provider instanceof Provider)) {
            // Replace the video tag for the next provider
            if (_provider) {
                replaceMediaElement(this);
            }
            this.changeVideoProvider(Provider);
        }

        if (!_provider) {
            this.set(_events.PLAYER_STATE, _events.STATE_BUFFERING);
            var mediaModelContext = this.mediaModel;
            return (0, _setPlaylist.loadProvidersForPlaylist)(this).then(function () {
                if (mediaModelContext === _this2.mediaModel) {
                    syncPlayerWithMediaModel(mediaModelContext);
                    // Verify that we have a provider class for this source
                    if (_this2.chooseProvider(source)) {
                        return _this2.setProvider(item);
                    }
                }
            });
        }

        // this allows the providers to preload
        if (_provider.init) {
            _provider.init(item);
        }

        // Set the Provider after calling init because some Provider properties are only set afterwards
        this.set('provider', _provider.getName());

        // Listening for change:item won't suffice when loading the same index or file
        // We also can't listen for change:mediaModel because it triggers whether or not
        //  an item was actually loaded
        this.trigger('itemReady', item);
        return _promise.resolved;
    };

    function replaceMediaElement(model) {
        // Replace click-to-play media element, and call .load() to unblock user-gesture to play requirement
        var lastMediaElement = model.attributes.mediaElement;
        var mediaElement = model.attributes.mediaElement = (0, _getMediaElement2.default)();
        mediaElement.volume = lastMediaElement.volume;
        mediaElement.muted = lastMediaElement.muted;
        mediaElement.load();
    }

    this.getProviders = function () {
        return _providers;
    };

    this.resetProvider = function () {
        _provider = null;
    };

    this.setVolume = function (volume) {
        volume = Math.round(volume);
        this.set('volume', volume);
        if (_provider) {
            _provider.volume(volume);
        }
        var mute = volume === 0;
        if (mute !== this.getMute()) {
            this.setMute(mute);
        }
    };

    this.getMute = function () {
        return this.get('autostartMuted') || this.get('mute');
    };

    this.setMute = function (mute) {
        if (mute === undefined) {
            mute = !this.getMute();
        }
        this.set('mute', mute);
        if (_provider) {
            _provider.mute(mute);
        }
        if (!mute) {
            var volume = Math.max(10, this.get('volume'));
            this.set('autostartMuted', false);
            this.setVolume(volume);
        }
    };

    this.setStreamType = function (streamType) {
        this.set('streamType', streamType);
        if (streamType === 'LIVE') {
            this.setPlaybackRate(1);
        }
    };

    this.setPlaybackRate = function (playbackRate) {
        if (!_attached || !_underscore2.default.isNumber(playbackRate)) {
            return;
        }

        // Clamp the rate between 0.25x and 4x
        playbackRate = Math.max(Math.min(playbackRate, 4), 0.25);

        if (this.get('streamType') === 'LIVE') {
            playbackRate = 1;
        }

        this.set('defaultPlaybackRate', playbackRate);

        if (_provider && _provider.setPlaybackRate) {
            _provider.setPlaybackRate(playbackRate);
        }
    };

    function loadAndPlay(model, item) {
        thenPlayPromise.cancel();

        var mediaModelContext = model.mediaModel;

        mediaModelContext.set('setup', true);
        if (_provider) {
            return playWithProvider(item);
        }

        thenPlayPromise = (0, _cancelable2.default)(function () {
            if (mediaModelContext === model.mediaModel) {
                return playWithProvider(item);
            }
            throw new Error('Playback cancelled.');
        });
        return providerPromise.catch(function (error) {
            thenPlayPromise.cancel();
            // Required provider was not loaded
            model.trigger(_events.ERROR, {
                message: 'Could not play video: ' + error.message,
                error: error
            });
            // Fail the playPromise to trigger "playAttemptFailed"
            throw error;
        }).then(thenPlayPromise.async);
    }

    function playWithProvider(item) {
        // Calling load() on Shaka may return a player setup promise
        var providerSetupPromise = _provider.load(item);
        if (providerSetupPromise) {
            thenPlayPromise = (0, _cancelable2.default)(function () {
                return _provider.play() || _promise.resolved;
            });
            return providerSetupPromise.then(thenPlayPromise.async);
        }
        return _provider.play() || _promise.resolved;
    }

    function playAttempt(model, playPromise, playReason) {
        var mediaModelContext = model.mediaModel;
        var itemContext = model.get('playlistItem');

        model.mediaController.trigger(_events.MEDIA_PLAY_ATTEMPT, {
            item: itemContext,
            playReason: playReason
        });

        // Immediately set player state to buffering if these conditions are met
        var videoTagUnpaused = _provider && _provider.video && !_provider.video.paused;
        if (videoTagUnpaused) {
            model.set(_events.PLAYER_STATE, _events.STATE_BUFFERING);
        }

        playPromise.then(function () {
            if (!mediaModelContext.get('setup')) {
                // Exit if model state was reset
                return;
            }
            mediaModelContext.set('started', true);
            if (mediaModelContext === model.mediaModel) {
                syncPlayerWithMediaModel(mediaModelContext);
            }
        }).catch(function (error) {
            model.set('playRejected', true);
            var videoTagPaused = _provider && _provider.video && _provider.video.paused;
            if (videoTagPaused) {
                mediaModelContext.set(_events.PLAYER_STATE, _events.STATE_PAUSED);
            }
            model.mediaController.trigger(_events.MEDIA_PLAY_ATTEMPT_FAILED, {
                error: error,
                item: itemContext,
                playReason: playReason
            });
        });
    }

    function syncPlayerWithMediaModel(mediaModel) {
        // Sync player state with mediaModel state
        var mediaState = mediaModel.get('state');
        mediaModel.trigger('change:state', mediaModel, mediaState, mediaState);
    }

    this.stopVideo = function () {
        thenPlayPromise.cancel();
        var item = this.get('playlist')[this.get('item')];
        this.attributes.playlistItem = item;
        resetItem(this, item);
        if (_provider) {
            _provider.stop();
        }
    };

    this.preloadVideo = function () {
        var item = this.get('playlistItem');
        // Only attempt to preload if media is attached and hasn't been loaded
        if (this.get('state') === 'idle' && _attached && _provider && item.preload !== 'none' && this.get('autostart') === false && !this.mediaModel.get('setup') && !this.mediaModel.get('preloaded')) {
            this.mediaModel.set('preloaded', true);
            _provider.preload(item);
        }
    };

    this.playVideo = function (playReason) {
        var item = this.get('playlistItem');
        if (!item) {
            return;
        }

        if (!playReason) {
            playReason = this.get('playReason');
        }

        var playPromise = void 0;

        this.set('playRejected', false);
        if (!this.mediaModel.get('setup')) {
            playPromise = loadAndPlay(this, item);
            playAttempt(this, playPromise, playReason);
        } else {
            playPromise = _provider.play() || _promise.resolved;
            if (!this.mediaModel.get('started')) {
                playAttempt(this, playPromise, playReason);
            }
        }
        return playPromise;
    };

    this.persistCaptionsTrack = function () {
        var track = this.get('captionsTrack');

        if (track) {
            // update preference if an option was selected
            this.set('captionLabel', track.name);
        } else {
            this.set('captionLabel', 'Off');
        }
    };

    this.setVideoSubtitleTrack = function (trackIndex, tracks) {
        this.set('captionsIndex', trackIndex);
        /*
         * Tracks could have changed even if the index hasn't.
         * Need to ensure track has data for captionsrenderer.
         */
        if (trackIndex && tracks && trackIndex <= tracks.length && tracks[trackIndex - 1].data) {
            this.set('captionsTrack', tracks[trackIndex - 1]);
        }

        if (_provider && _provider.setSubtitlesTrack) {
            _provider.setSubtitlesTrack(trackIndex);
        }
    };

    this.persistVideoSubtitleTrack = function (trackIndex, tracks) {
        this.setVideoSubtitleTrack(trackIndex, tracks);
        this.persistCaptionsTrack();
    };

    function _autoStartSupportedIOS() {
        if (!_environment.OS.iOS) {
            return false;
        }
        // Autostart only supported in iOS 10 or higher - check if the version is 9 or less
        return _environment.OS.version.major >= 10;
    }

    function platformCanAutostart() {
        var autostartAdsIsEnabled = !_this.get('advertising') || _this.get('advertising').autoplayadsmuted;
        var iosBrowserIsSupported = _autoStartSupportedIOS() && (_environment.Browser.safari || _environment.Browser.chrome || _environment.Browser.facebook);
        var androidBrowserIsSupported = _environment.OS.android && _environment.Browser.chrome;
        var mobileBrowserIsSupported = iosBrowserIsSupported || androidBrowserIsSupported;
        var isAndroidSdk = _this.get('sdkplatform') === 1;
        return !_this.get('sdkplatform') && autostartAdsIsEnabled && mobileBrowserIsSupported || isAndroidSdk;
    }

    this.autoStartOnMobile = function () {
        return this.get('autostart') && platformCanAutostart();
    };

    // Mobile players always wait to become viewable.
    // Desktop players must have autostart set to viewable
    this.setAutoStart = function (autoStart) {
        if (autoStart !== undefined) {
            this.set('autostart', autoStart);
        }

        var autoStartOnMobile = this.autoStartOnMobile();
        var isAndroidSdk = _this.get('sdkplatform') === 1;
        if (autoStartOnMobile && !isAndroidSdk) {
            this.set('autostartMuted', true);
        }
        this.set('playOnViewable', autoStartOnMobile || this.get('autostart') === 'viewable');
    };
};

// Represents the state of the provider/media element
var MediaModel = Model.MediaModel = function () {
    this.attributes = {
        state: _events.STATE_IDLE
    };
};

_extends(MediaModel.prototype, _simplemodel2.default, {
    srcReset: function srcReset() {
        var attributes = this.attributes;
        attributes.setup = false;
        attributes.started = false;
        attributes.preloaded = false;
        attributes.visualQuality = null;
    }
});

_extends(Model.prototype, _simplemodel2.default);

exports.default = Model;

/***/ }),
/* 75 */
/*!*************************************************!*\
  !*** ./src/js/utils/request-animation-frame.js ***!
  \*************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var requestAnimationFrame = exports.requestAnimationFrame = window.requestAnimationFrame || function (callback) {
    return setTimeout(callback, 17);
};

var cancelAnimationFrame = exports.cancelAnimationFrame = window.cancelAnimationFrame || clearTimeout;

/***/ }),
/* 76 */
/*!*****************************************!*\
  !*** ./src/js/view/utils/breakpoint.js ***!
  \*****************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getBreakpoint = getBreakpoint;
exports.setBreakpoint = setBreakpoint;

var _dom = __webpack_require__(/*! utils/dom */ 21);

function getBreakpoint(width) {
    var breakpoint = 0;

    if (width >= 1280) {
        breakpoint = 7;
    } else if (width >= 960) {
        breakpoint = 6;
    } else if (width >= 800) {
        breakpoint = 5;
    } else if (width >= 640) {
        breakpoint = 4;
    } else if (width >= 540) {
        breakpoint = 3;
    } else if (width >= 420) {
        breakpoint = 2;
    } else if (width >= 320) {
        breakpoint = 1;
    }

    return breakpoint;
}

function setBreakpoint(playerElement, breakpointNumber) {
    var breakpointClass = 'jw-breakpoint-' + breakpointNumber;
    (0, _dom.replaceClass)(playerElement, /jw-breakpoint-\d+/, breakpointClass);
}

/***/ }),
/* 77 */
/*!*************************************************!*\
  !*** ./node_modules/css-loader/lib/css-base.js ***!
  \*************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 78 */
/*!******************************!*\
  !*** ./src/js/utils/aria.js ***!
  \******************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (element, ariaLabel) {
    if (!element || !ariaLabel) {
        return;
    }

    element.setAttribute('aria-label', ariaLabel);
    element.setAttribute('role', 'button');
    element.setAttribute('tabindex', '0');
};

/***/ }),
/* 79 */
/*!***************************************************!*\
  !*** ./src/js/view/controls/components/slider.js ***!
  \***************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _slider = __webpack_require__(/*! view/controls/templates/slider */ 117);

var _slider2 = _interopRequireDefault(_slider);

var _environment = __webpack_require__(/*! environment/environment */ 22);

var _backbone = __webpack_require__(/*! utils/backbone.events */ 7);

var _backbone2 = _interopRequireDefault(_backbone);

var _ui = __webpack_require__(/*! utils/ui */ 67);

var _ui2 = _interopRequireDefault(_ui);

var _helpers = __webpack_require__(/*! utils/helpers */ 5);

var _helpers2 = _interopRequireDefault(_helpers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var getRailBounds = function getRailBounds(elementRail) {
    var bounds = _helpers2.default.bounds(elementRail);
    // Partial workaround of Android 'inert-visual-viewport'
    // https://bugs.chromium.org/p/chromium/issues/detail?id=489206
    var pageXOffset = window.pageXOffset;
    if (pageXOffset && _environment.OS.android && document.body.parentElement.getBoundingClientRect().left >= 0) {
        bounds.left -= pageXOffset;
        bounds.right -= pageXOffset;
    }
    return bounds;
};

var Slider = function () {
    function Slider(className, orientation) {
        _classCallCheck(this, Slider);

        _extends(this, _backbone2.default);

        this.className = className + ' jw-background-color jw-reset';
        this.orientation = orientation;

        this.dragStartListener = this.dragStart.bind(this);
        this.dragMoveListener = this.dragMove.bind(this);
        this.dragEndListener = this.dragEnd.bind(this);

        this.tapListener = this.tap.bind(this);
    }

    _createClass(Slider, [{
        key: 'setup',
        value: function setup() {
            this.el = _helpers2.default.createElement((0, _slider2.default)(this.className, 'jw-slider-' + this.orientation));

            this.elementRail = this.el.getElementsByClassName('jw-slider-container')[0];
            this.elementBuffer = this.el.getElementsByClassName('jw-buffer')[0];
            this.elementProgress = this.el.getElementsByClassName('jw-progress')[0];
            this.elementThumb = this.el.getElementsByClassName('jw-knob')[0];

            this.userInteract = new _ui2.default(this.element(), { preventScrolling: true });

            this.userInteract.on('dragStart', this.dragStartListener);
            this.userInteract.on('drag', this.dragMoveListener);
            this.userInteract.on('dragEnd', this.dragEndListener);

            this.userInteract.on('tap click', this.tapListener);
        }
    }, {
        key: 'dragStart',
        value: function dragStart() {
            this.trigger('dragStart');
            this.railBounds = getRailBounds(this.elementRail);
        }
    }, {
        key: 'dragEnd',
        value: function dragEnd(evt) {
            this.dragMove(evt);
            this.trigger('dragEnd');
        }
    }, {
        key: 'dragMove',
        value: function dragMove(evt) {
            var bounds = this.railBounds = this.railBounds ? this.railBounds : getRailBounds(this.elementRail);
            var dimension = void 0;
            var percentage = void 0;

            if (this.orientation === 'horizontal') {
                dimension = evt.pageX;
                if (dimension < bounds.left) {
                    percentage = 0;
                } else if (dimension > bounds.right) {
                    percentage = 100;
                } else {
                    percentage = _helpers2.default.between((dimension - bounds.left) / bounds.width, 0, 1) * 100;
                }
            } else {
                dimension = evt.pageY;
                if (dimension >= bounds.bottom) {
                    percentage = 0;
                } else if (dimension <= bounds.top) {
                    percentage = 100;
                } else {
                    percentage = _helpers2.default.between((bounds.height - (dimension - bounds.top)) / bounds.height, 0, 1) * 100;
                }
            }

            var updatedPercent = this.limit(percentage);
            this.render(updatedPercent);
            this.update(updatedPercent);

            return false;
        }
    }, {
        key: 'tap',
        value: function tap(evt) {
            this.railBounds = getRailBounds(this.elementRail);
            this.dragMove(evt);
        }
    }, {
        key: 'limit',
        value: function limit(percentage) {
            // modules that extend Slider can set limits on the percentage (TimeSlider)
            return percentage;
        }
    }, {
        key: 'update',
        value: function update(percentage) {
            this.trigger('update', { percentage: percentage });
        }
    }, {
        key: 'render',
        value: function render(percentage) {
            percentage = Math.max(0, Math.min(percentage, 100));

            if (this.orientation === 'horizontal') {
                this.elementThumb.style.left = percentage + '%';
                this.elementProgress.style.width = percentage + '%';
            } else {
                this.elementThumb.style.bottom = percentage + '%';
                this.elementProgress.style.height = percentage + '%';
            }
        }
    }, {
        key: 'updateBuffer',
        value: function updateBuffer(percentage) {
            this.elementBuffer.style.width = percentage + '%';
        }
    }, {
        key: 'element',
        value: function element() {
            return this.el;
        }
    }]);

    return Slider;
}();

exports.default = Slider;

/***/ }),
/* 80 */
/*!****************************************************!*\
  !*** ./src/js/view/controls/components/tooltip.js ***!
  \****************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _backbone = __webpack_require__(/*! utils/backbone.events */ 7);

var _backbone2 = _interopRequireDefault(_backbone);

var _aria = __webpack_require__(/*! utils/aria */ 78);

var _aria2 = _interopRequireDefault(_aria);

var _dom = __webpack_require__(/*! utils/dom */ 21);

var _svgParser = __webpack_require__(/*! utils/svgParser */ 70);

var _svgParser2 = _interopRequireDefault(_svgParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Tooltip = function () {
    function Tooltip(name, ariaText, elementShown, svgIcons) {
        var _this = this;

        _classCallCheck(this, Tooltip);

        _extends(this, _backbone2.default);
        this.el = document.createElement('div');
        var className = 'jw-icon jw-icon-tooltip ' + name + ' jw-button-color jw-reset';
        if (!elementShown) {
            className += ' jw-hidden';
        }

        (0, _aria2.default)(this.el, ariaText);

        this.el.className = className;
        this.container = document.createElement('div');
        this.container.className = 'jw-overlay jw-reset';
        this.openClass = 'jw-open';
        this.componentType = 'tooltip';

        this.el.appendChild(this.container);
        if (svgIcons && svgIcons.length > 0) {
            Array.prototype.forEach.call(svgIcons, function (svgIcon) {
                if (typeof svgIcon === 'string') {
                    _this.el.appendChild((0, _svgParser2.default)(svgIcon));
                } else {
                    _this.el.appendChild(svgIcon);
                }
            });
        }
    }

    _createClass(Tooltip, [{
        key: 'addContent',
        value: function addContent(elem) {
            if (this.content) {
                this.removeContent();
            }

            this.content = elem;
            this.container.appendChild(elem);
        }
    }, {
        key: 'removeContent',
        value: function removeContent() {
            if (this.content) {
                this.container.removeChild(this.content);
                this.content = null;
            }
        }
    }, {
        key: 'hasContent',
        value: function hasContent() {
            return !!this.content;
        }
    }, {
        key: 'element',
        value: function element() {
            return this.el;
        }
    }, {
        key: 'openTooltip',
        value: function openTooltip(evt) {
            this.trigger('open-' + this.componentType, evt, { isOpen: true });
            this.isOpen = true;
            (0, _dom.toggleClass)(this.el, this.openClass, this.isOpen);
        }
    }, {
        key: 'closeTooltip',
        value: function closeTooltip(evt) {
            this.trigger('close-' + this.componentType, evt, { isOpen: false });
            this.isOpen = false;
            (0, _dom.toggleClass)(this.el, this.openClass, this.isOpen);
        }
    }, {
        key: 'toggleOpenState',
        value: function toggleOpenState(evt) {
            if (this.isOpen) {
                this.closeTooltip(evt);
            } else {
                this.openTooltip(evt);
            }
        }
    }]);

    return Tooltip;
}();

exports.default = Tooltip;

/***/ }),
/* 81 */
/*!***********************************************************!*\
  !*** ./src/js/view/controls/components/simple-tooltip.js ***!
  \***********************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SimpleTooltip = SimpleTooltip;

var _dom = __webpack_require__(/*! utils/dom */ 21);

var _ui = __webpack_require__(/*! utils/ui */ 67);

function SimpleTooltip(attachToElement, name, text, openCallback) {
    var tooltipElement = document.createElement('div');
    tooltipElement.className = 'jw-reset jw-tooltip jw-tooltip-' + name;

    var textElement = document.createElement('div');
    textElement.className = 'jw-text';
    textElement.textContent = text;

    tooltipElement.appendChild(textElement);
    attachToElement.appendChild(tooltipElement);

    var instance = {
        open: function open() {
            if (instance.touchEvent) {
                delete instance.pointerType;
                return;
            }

            tooltipElement.setAttribute('aria-expanded', 'true');
            (0, _dom.addClass)(tooltipElement, 'jw-open');

            if (openCallback) {
                openCallback();
            }
        },
        close: function close() {
            if (instance.touchEvent) {
                delete instance.pointerType;
                return;
            }

            tooltipElement.setAttribute('aria-expanded', 'false');
            (0, _dom.removeClass)(tooltipElement, 'jw-open');
        },
        setText: function setText(newText) {
            tooltipElement.querySelector('.jw-text').textContent = newText;
        }
    };

    attachToElement.addEventListener('mouseover', instance.open);
    attachToElement.addEventListener('mouseout', instance.close);
    attachToElement.addEventListener('touchstart', function (evt) {
        instance.touchEvent = (0, _ui.getPointerType)(evt) === 'touch';
    });

    return instance;
}

/***/ }),
/* 82 */
/*!************************************!*\
  !*** ./src/js/utils/cancelable.js ***!
  \************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = cancelable;

var _promise = __webpack_require__(/*! polyfills/promise */ 6);

function cancelable(callback) {
    var _cancelled = false;

    return {
        async: function async() {
            var _this = this;

            var args = arguments;
            return _promise.resolved.then(function () {
                if (_cancelled) {
                    return;
                }
                return callback.apply(_this, args);
            });
        },
        cancel: function cancel() {
            _cancelled = true;
        },
        cancelled: function cancelled() {
            return _cancelled;
        }
    };
}

/***/ }),
/* 83 */
/*!************************************!*\
  !*** ./src/js/utils/active-tab.js ***!
  \************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    if ('hidden' in document) {
        return function () {
            return !document.hidden;
        };
    }
    if ('webkitHidden' in document) {
        return function () {
            return !document.webkitHidden;
        };
    }
    // document.hidden not supported
    return function () {
        return true;
    };
}();

/***/ }),
/* 84 */
/*!********************************************!*\
  !*** ./src/js/controller/tracks-loader.js ***!
  \********************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.loadFile = loadFile;
exports.cancelXhr = cancelXhr;
exports.convertToVTTCues = convertToVTTCues;

var _vttcue = __webpack_require__(/*! parsers/captions/vttcue */ 86);

var _vttcue2 = _interopRequireDefault(_vttcue);

var _coreLoader = __webpack_require__(/*! ../api/core-loader */ 11);

var _helpers = __webpack_require__(/*! utils/helpers */ 5);

var _helpers2 = _interopRequireDefault(_helpers);

var _parsers = __webpack_require__(/*! parsers/parsers */ 12);

var _srt = __webpack_require__(/*! parsers/captions/srt */ 71);

var _srt2 = _interopRequireDefault(_srt);

var _dfxp = __webpack_require__(/*! parsers/captions/dfxp */ 88);

var _dfxp2 = _interopRequireDefault(_dfxp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function loadFile(track, successHandler, errorHandler) {
    track.xhr = _helpers2.default.ajax(track.file, function (xhr) {
        xhrSuccess(xhr, track, successHandler, errorHandler);
    }, errorHandler);
}

function cancelXhr(tracks) {
    if (tracks) {
        tracks.forEach(function (track) {
            var xhr = track.xhr;
            if (xhr) {
                xhr.onload = null;
                xhr.onreadystatechange = null;
                xhr.onerror = null;
                if ('abort' in xhr) {
                    xhr.abort();
                }
            }
            delete track.xhr;
        });
    }
}

function convertToVTTCues(cues) {
    // VTTCue is available natively or polyfilled where necessary
    return cues.map(function (cue) {
        return new _vttcue2.default(cue.begin, cue.end, cue.text);
    });
}

function xhrSuccess(xhr, track, successHandler, errorHandler) {
    var xmlRoot = xhr.responseXML ? xhr.responseXML.firstChild : null;
    var cues;
    var vttCues;

    // IE9 sets the firstChild element to the root <xml> tag
    if (xmlRoot) {
        if ((0, _parsers.localName)(xmlRoot) === 'xml') {
            xmlRoot = xmlRoot.nextSibling;
        }
        // Ignore all comments
        while (xmlRoot.nodeType === xmlRoot.COMMENT_NODE) {
            xmlRoot = xmlRoot.nextSibling;
        }
    }

    try {
        if (xmlRoot && (0, _parsers.localName)(xmlRoot) === 'tt') {
            // parse dfxp track
            cues = (0, _dfxp2.default)(xhr.responseXML);
            vttCues = convertToVTTCues(cues);
            delete track.xhr;
            successHandler(vttCues);
        } else {
            // parse VTT/SRT track
            var responseText = xhr.responseText;
            if (responseText.indexOf('WEBVTT') >= 0) {
                // make VTTCues from VTT track
                loadVttParser().then(function (VTTParser) {
                    var parser = new VTTParser(window);
                    vttCues = [];
                    parser.oncue = function (cue) {
                        vttCues.push(cue);
                    };

                    parser.onflush = function () {
                        delete track.xhr;
                        successHandler(vttCues);
                    };

                    // Parse calls onflush internally
                    parser.parse(responseText);
                }).catch(function (error) {
                    delete track.xhr;
                    errorHandler(error);
                });
            } else {
                // make VTTCues from SRT track
                cues = (0, _srt2.default)(responseText);
                vttCues = convertToVTTCues(cues);
                delete track.xhr;
                successHandler(vttCues);
            }
        }
    } catch (error) {
        delete track.xhr;
        errorHandler(error);
    }
}

function loadVttParser() {
    return __webpack_require__.e/* require.ensure */(8/*! vttparser */).then((function (require) {
        return __webpack_require__(/*! parsers/captions/vttparser */ 87).default;
    }).bind(null, __webpack_require__)).catch(_coreLoader.chunkLoadErrorHandler);
}

/***/ }),
/* 85 */
/*!********************************************!*\
  !*** ./src/js/controller/tracks-helper.js ***!
  \********************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createId = createId;
exports.createLabel = createLabel;
function createId(track, tracksCount) {
    var trackId;
    var prefix = track.kind || 'cc';
    if (track.default || track.defaulttrack) {
        trackId = 'default';
    } else {
        trackId = track._id || track.file || prefix + tracksCount;
    }
    return trackId;
}

function createLabel(track, unknownCount) {
    var label = track.label || track.name || track.language;
    if (!label) {
        label = 'Unknown CC';
        unknownCount += 1;
        if (unknownCount > 1) {
            label += ' [' + unknownCount + ']';
        }
    }
    return { label: label, unknownCount: unknownCount };
}

/***/ }),
/* 86 */
/*!*******************************************!*\
  !*** ./src/js/parsers/captions/vttcue.js ***!
  \*******************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Copyright 2013 vtt.js Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

var VTTCue = window.VTTCue;

function findDirectionSetting(value) {
    if (typeof value !== 'string') {
        return false;
    }
    var directionSetting = {
        '': true,
        lr: true,
        rl: true
    };
    var dir = directionSetting[value.toLowerCase()];
    return dir ? value.toLowerCase() : false;
}

function findAlignSetting(value) {
    if (typeof value !== 'string') {
        return false;
    }
    var alignSetting = {
        start: true,
        middle: true,
        end: true,
        left: true,
        right: true
    };
    var align = alignSetting[value.toLowerCase()];
    return align ? value.toLowerCase() : false;
}

if (!VTTCue) {
    var autoKeyword = 'auto';

    VTTCue = function VTTCue(startTime, endTime, text) {
        var cue = this;

        /**
         * Shim implementation specific properties. These properties are not in
         * the spec.
         */

        // Lets us know when the VTTCue's data has changed in such a way that we need
        // to recompute its display state. This lets us compute its display state
        // lazily.
        cue.hasBeenReset = false;

        /**
         * VTTCue and TextTrackCue properties
         * http://dev.w3.org/html5/webvtt/#vttcue-interface
         */

        var _id = '';
        var _pauseOnExit = false;
        var _startTime = startTime;
        var _endTime = endTime;
        var _text = text;
        var _region = null;
        var _vertical = '';
        var _snapToLines = true;
        var _line = autoKeyword;
        var _lineAlign = 'start';
        var _position = autoKeyword;
        var _size = 100;
        var _align = 'middle';

        Object.defineProperty(cue, 'id', {
            enumerable: true,
            get: function get() {
                return _id;
            },
            set: function set(value) {
                _id = '' + value;
            }
        });

        Object.defineProperty(cue, 'pauseOnExit', {
            enumerable: true,
            get: function get() {
                return _pauseOnExit;
            },
            set: function set(value) {
                _pauseOnExit = !!value;
            }
        });

        Object.defineProperty(cue, 'startTime', {
            enumerable: true,
            get: function get() {
                return _startTime;
            },
            set: function set(value) {
                if (typeof value !== 'number') {
                    throw new TypeError('Start time must be set to a number.');
                }
                _startTime = value;
                this.hasBeenReset = true;
            }
        });

        Object.defineProperty(cue, 'endTime', {
            enumerable: true,
            get: function get() {
                return _endTime;
            },
            set: function set(value) {
                if (typeof value !== 'number') {
                    throw new TypeError('End time must be set to a number.');
                }
                _endTime = value;
                this.hasBeenReset = true;
            }
        });

        Object.defineProperty(cue, 'text', {
            enumerable: true,
            get: function get() {
                return _text;
            },
            set: function set(value) {
                _text = '' + value;
                this.hasBeenReset = true;
            }
        });

        Object.defineProperty(cue, 'region', {
            enumerable: true,
            get: function get() {
                return _region;
            },
            set: function set(value) {
                _region = value;
                this.hasBeenReset = true;
            }
        });

        Object.defineProperty(cue, 'vertical', {
            enumerable: true,
            get: function get() {
                return _vertical;
            },
            set: function set(value) {
                var setting = findDirectionSetting(value);
                // Have to check for false because the setting an be an empty string.
                if (setting === false) {
                    throw new SyntaxError('An invalid or illegal string was specified.');
                }
                _vertical = setting;
                this.hasBeenReset = true;
            }
        });

        Object.defineProperty(cue, 'snapToLines', {
            enumerable: true,
            get: function get() {
                return _snapToLines;
            },
            set: function set(value) {
                _snapToLines = !!value;
                this.hasBeenReset = true;
            }
        });

        Object.defineProperty(cue, 'line', {
            enumerable: true,
            get: function get() {
                return _line;
            },
            set: function set(value) {
                if (typeof value !== 'number' && value !== autoKeyword) {
                    throw new SyntaxError('An invalid number or illegal string was specified.');
                }
                _line = value;
                this.hasBeenReset = true;
            }
        });

        Object.defineProperty(cue, 'lineAlign', {
            enumerable: true,
            get: function get() {
                return _lineAlign;
            },
            set: function set(value) {
                var setting = findAlignSetting(value);
                if (!setting) {
                    throw new SyntaxError('An invalid or illegal string was specified.');
                }
                _lineAlign = setting;
                this.hasBeenReset = true;
            }
        });

        Object.defineProperty(cue, 'position', {
            enumerable: true,
            get: function get() {
                return _position;
            },
            set: function set(value) {
                if (value < 0 || value > 100) {
                    throw new Error('Position must be between 0 and 100.');
                }
                _position = value;
                this.hasBeenReset = true;
            }
        });

        Object.defineProperty(cue, 'size', {
            enumerable: true,
            get: function get() {
                return _size;
            },
            set: function set(value) {
                if (value < 0 || value > 100) {
                    throw new Error('Size must be between 0 and 100.');
                }
                _size = value;
                this.hasBeenReset = true;
            }
        });

        Object.defineProperty(cue, 'align', {
            enumerable: true,
            get: function get() {
                return _align;
            },
            set: function set(value) {
                var setting = findAlignSetting(value);
                if (!setting) {
                    throw new SyntaxError('An invalid or illegal string was specified.');
                }
                _align = setting;
                this.hasBeenReset = true;
            }
        });

        /**
         * Other <track> spec defined properties
         */

        // http://www.whatwg.org/specs/web-apps/current-work/multipage/the-video-element.html#text-track-cue-display-state
        cue.displayState = undefined;
    };

    /**
     * VTTCue methods
     */

    VTTCue.prototype.getCueAsHTML = function () {
        // Assume WebVTT.convertCueToDOMTree is on the global.
        var WebVTT = window.WebVTT;
        return WebVTT.convertCueToDOMTree(window, this.text);
    };
}

exports.default = VTTCue;

/***/ }),
/* 87 */,
/* 88 */
/*!*****************************************!*\
  !*** ./src/js/parsers/captions/dfxp.js ***!
  \*****************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = Dfxp;

var _strings = __webpack_require__(/*! utils/strings */ 1);

// Component that loads and parses an DFXP file

function Dfxp(xmlDoc) {
    validate(xmlDoc);
    var _captions = [];
    var paragraphs = xmlDoc.getElementsByTagName('p');
    // Default frameRate is 30
    var frameRate = 30;
    var tt = xmlDoc.getElementsByTagName('tt');
    if (tt && tt[0]) {
        var parsedFrameRate = parseFloat(tt[0].getAttribute('ttp:frameRate'));
        if (!isNaN(parsedFrameRate)) {
            frameRate = parsedFrameRate;
        }
    }
    validate(paragraphs);
    if (!paragraphs.length) {
        paragraphs = xmlDoc.getElementsByTagName('tt:p');
        if (!paragraphs.length) {
            paragraphs = xmlDoc.getElementsByTagName('tts:p');
        }
    }

    for (var i = 0; i < paragraphs.length; i++) {
        var p = paragraphs[i];

        var breaks = p.getElementsByTagName('br');
        for (var j = 0; j < breaks.length; j++) {
            var b = breaks[j];
            b.parentNode.replaceChild(xmlDoc.createTextNode('\r\n'), b);
        }

        var rawText = p.innerHTML || p.textContent || p.text || '';
        var text = (0, _strings.trim)(rawText).replace(/>\s+</g, '><').replace(/(<\/?)tts?:/g, '$1').replace(/<br.*?\/>/g, '\r\n');
        if (text) {
            var begin = p.getAttribute('begin');
            var dur = p.getAttribute('dur');
            var end = p.getAttribute('end');

            var entry = {
                begin: (0, _strings.seconds)(begin, frameRate),
                text: text
            };
            if (end) {
                entry.end = (0, _strings.seconds)(end, frameRate);
            } else if (dur) {
                entry.end = entry.begin + (0, _strings.seconds)(dur, frameRate);
            }
            _captions.push(entry);
        }
    }
    if (!_captions.length) {
        parseError();
    }
    return _captions;
}

function validate(object) {
    if (!object) {
        parseError();
    }
}

function parseError() {
    throw new Error('Invalid DFXP file');
}

/***/ }),
/* 89 */,
/* 90 */
/*!********************************************!*\
  !*** ./src/js/view/controls/controlbar.js ***!
  \********************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _icons = __webpack_require__(/*! view/controls/icons */ 68);

var _environment = __webpack_require__(/*! environment/environment */ 22);

var _constants = __webpack_require__(/*! view/constants */ 72);

var _customButton = __webpack_require__(/*! view/controls/components/custom-button */ 115);

var _customButton2 = _interopRequireDefault(_customButton);

var _helpers = __webpack_require__(/*! utils/helpers */ 5);

var _helpers2 = _interopRequireDefault(_helpers);

var _underscore = __webpack_require__(/*! utils/underscore */ 0);

var _underscore2 = _interopRequireDefault(_underscore);

var _backbone = __webpack_require__(/*! utils/backbone.events */ 7);

var _backbone2 = _interopRequireDefault(_backbone);

var _ui = __webpack_require__(/*! utils/ui */ 67);

var _ui2 = _interopRequireDefault(_ui);

var _aria = __webpack_require__(/*! utils/aria */ 78);

var _aria2 = _interopRequireDefault(_aria);

var _timeslider = __webpack_require__(/*! view/controls/components/timeslider */ 116);

var _timeslider2 = _interopRequireDefault(_timeslider);

var _volumetooltip = __webpack_require__(/*! view/controls/components/volumetooltip */ 120);

var _volumetooltip2 = _interopRequireDefault(_volumetooltip);

var _button = __webpack_require__(/*! view/controls/components/button */ 69);

var _button2 = _interopRequireDefault(_button);

var _simpleTooltip = __webpack_require__(/*! view/controls/components/simple-tooltip */ 81);

var _dom = __webpack_require__(/*! utils/dom */ 21);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function text(name, role) {
    var element = document.createElement('span');
    element.className = 'jw-text jw-reset ' + name;
    if (role) {
        element.setAttribute('role', role);
    }
    return element;
}

function textIcon(name, role) {
    var element = document.createElement('div');
    element.className = 'jw-icon jw-icon-inline jw-text jw-reset ' + name;
    if (role) {
        element.setAttribute('role', role);
    }
    return element;
}

function div(classes) {
    var element = document.createElement('div');
    element.className = 'jw-reset ' + classes;
    return element;
}

function createCastButton(castToggle, localization) {

    if (_environment.Browser.safari) {
        var airplayButton = (0, _button2.default)('jw-icon-airplay jw-off', castToggle, localization.airplay, (0, _icons.cloneIcons)('airplay-off,airplay-on'));

        (0, _simpleTooltip.SimpleTooltip)(airplayButton.element(), 'airplay', localization.airplay);

        return airplayButton;
    }

    if (!_environment.Browser.chrome || _environment.OS.iOS) {
        return;
    }

    var castButton = document.createElement('button', 'google-cast-button');
    castButton.setAttribute('type', 'button');
    castButton.setAttribute('tabindex', '-1');

    var _element = document.createElement('div');
    _element.className = 'jw-reset jw-icon jw-icon-inline jw-icon-cast jw-button-color';
    _element.style.display = 'none';
    _element.style.cursor = 'pointer';
    _element.appendChild(castButton);
    (0, _aria2.default)(_element, localization.cast);

    (0, _simpleTooltip.SimpleTooltip)(_element, 'chromecast', localization.cast);

    return {
        element: function element() {
            return _element;
        },
        toggle: function toggle(m) {
            if (m) {
                this.show();
            } else {
                this.hide();
            }
        },
        show: function show() {
            _element.style.display = '';
        },
        hide: function hide() {
            _element.style.display = 'none';
        },
        button: castButton
    };
}

function reasonInteraction() {
    return { reason: 'interaction' };
}

function buttonsInFirstNotInSecond(buttonsA, buttonsB) {
    return buttonsA.filter(function (a) {
        return !buttonsB.some(function (b) {
            return b.id + b.btnClass === a.id + a.btnClass && a.callback === b.callback;
        });
    });
}

var appendChildren = function appendChildren(container, elements) {
    elements.forEach(function (e) {
        if (e.element) {
            e = e.element();
        }
        container.appendChild(e);
    });
};

var Controlbar = function () {
    function Controlbar(_api, _model) {
        var _this = this;

        _classCallCheck(this, Controlbar);

        _extends(this, _backbone2.default);
        this._api = _api;
        this._model = _model;
        this._isMobile = _environment.OS.mobile;
        var localization = _model.get('localization');
        var timeSlider = new _timeslider2.default(_model, _api);
        var volumeTooltip = void 0;
        var muteButton = void 0;

        var play = localization.play;
        var next = localization.next;
        var vol = localization.volume;
        var rewind = localization.rewind;

        // Do not show the volume toggle in the mobile SDKs or <iOS10
        if (!_model.get('sdkplatform') && !(_environment.OS.iOS && _environment.OS.version.major < 10)) {
            // Clone icons so that can be used in VolumeTooltip
            var svgIcons = (0, _icons.cloneIcons)('volume-0,volume-100');
            muteButton = (0, _button2.default)('jw-icon-volume', function () {
                _api.setMute();
            }, vol, svgIcons);
        }

        // Do not initialize volume slider or tooltip on mobile
        if (!this._isMobile) {
            volumeTooltip = new _volumetooltip2.default(_model, 'jw-icon-volume', vol, (0, _icons.cloneIcons)('volume-0,volume-50,volume-100'));
        }

        var nextButton = (0, _button2.default)('jw-icon-next', function () {
            _api.next();
        }, next, (0, _icons.cloneIcons)('next'));

        var settingsButton = (0, _button2.default)('jw-icon-settings jw-settings-submenu-button', function (event) {
            _this.trigger('settingsInteraction', 'quality', true, event);
        }, localization.settings, (0, _icons.cloneIcons)('settings'));
        settingsButton.element().setAttribute('aria-haspopup', 'true');

        var captionsButton = (0, _button2.default)('jw-icon-cc jw-settings-submenu-button', function (event) {
            _this.trigger('settingsInteraction', 'captions', false, event);
        }, localization.cc, (0, _icons.cloneIcons)('cc-off,cc-on'));
        captionsButton.element().setAttribute('aria-haspopup', 'true');

        var elements = this.elements = {
            alt: text('jw-text-alt', 'status'),
            play: (0, _button2.default)('jw-icon-playback', function () {
                _api.playToggle(reasonInteraction());
            }, play, (0, _icons.cloneIcons)('play,pause')),
            rewind: (0, _button2.default)('jw-icon-rewind', function () {
                _this.rewind();
            }, rewind, (0, _icons.cloneIcons)('rewind')),
            live: (0, _button2.default)('jw-icon-live', function () {
                _this.goToLiveEdge();
            }, localization.liveBroadcast, (0, _icons.cloneIcons)('live,dvr')),
            next: nextButton,
            elapsed: textIcon('jw-text-elapsed', 'timer'),
            countdown: textIcon('jw-text-countdown', 'timer'),
            time: timeSlider,
            duration: textIcon('jw-text-duration', 'timer'),
            mute: muteButton,
            volumetooltip: volumeTooltip,
            cast: createCastButton(function () {
                _api.castToggle();
            }, localization),
            fullscreen: (0, _button2.default)('jw-icon-fullscreen', function () {
                _api.setFullscreen();
            }, localization.fullscreen, (0, _icons.cloneIcons)('fullscreen-off,fullscreen-on')),
            spacer: div('jw-spacer'),
            buttonContainer: div('jw-button-container'),
            settingsButton: settingsButton,
            captionsButton: captionsButton
        };

        // Add text tooltips
        var captionsTip = (0, _simpleTooltip.SimpleTooltip)(captionsButton.element(), 'captions', localization.cc);
        var onCaptionsChanged = function onCaptionsChanged(model) {
            var currentCaptions = model.get('captionsList')[model.get('captionsIndex')];
            var newText = localization.cc;
            if (currentCaptions && currentCaptions.label !== 'Off') {
                newText = currentCaptions.label;
            }
            captionsTip.setText(newText);
        };

        var nextUpTip = (0, _simpleTooltip.SimpleTooltip)(elements.next.element(), 'next', localization.nextUp, function () {
            var nextUp = _model.get('nextUp');

            _this.trigger('nextShown', {
                mode: nextUp.mode,
                ui: 'nextup',
                itemsShown: [nextUp],
                feedData: nextUp.feedData,
                reason: 'hover'
            });
        });
        (0, _simpleTooltip.SimpleTooltip)(elements.rewind.element(), 'rewind', localization.rewind);
        (0, _simpleTooltip.SimpleTooltip)(elements.settingsButton.element(), 'settings', localization.settings);
        (0, _simpleTooltip.SimpleTooltip)(elements.fullscreen.element(), 'fullscreen', localization.fullscreen);

        // Filter out undefined elements
        var buttonLayout = [elements.play, elements.rewind, elements.next, elements.volumetooltip, elements.mute, elements.alt, elements.live, elements.elapsed, elements.countdown, elements.duration, elements.spacer, elements.cast, elements.captionsButton, elements.settingsButton, elements.fullscreen].filter(function (e) {
            return e;
        });

        var layout = [elements.time, elements.buttonContainer].filter(function (e) {
            return e;
        });

        var menus = this.menus = [elements.volumetooltip].filter(function (e) {
            return e;
        });

        this.el = document.createElement('div');
        this.el.className = 'jw-controlbar jw-reset';

        appendChildren(elements.buttonContainer, buttonLayout);
        appendChildren(this.el, layout);

        var logo = _model.get('logo');
        if (logo && logo.position === 'control-bar') {
            this.addLogo(logo);
        }

        // Initial State
        elements.play.show();
        elements.fullscreen.show();
        if (elements.mute) {
            elements.mute.show();
        }

        // Listen for model changes
        _model.change('volume', this.onVolume, this);
        _model.change('mute', this.onMute, this);
        _model.change('duration', this.onDuration, this);
        _model.change('position', this.onElapsed, this);
        _model.change('fullscreen', this.onFullscreen, this);
        _model.change('streamType', this.onStreamTypeChange, this);
        _model.change('cues', this.addCues, this);
        _model.change('altText', this.setAltText, this);
        _model.change('customButtons', this.updateButtons, this);
        _model.change('state', function () {
            // Check for change of position to counter race condition where state is updated before the current position
            _model.once('change:position', _this.checkDvrLiveEdge, _this);
        }, this);
        _model.on('change:captionsIndex', onCaptionsChanged, this);
        _model.on('change:captionsList', onCaptionsChanged, this);
        _model.change('nextUp', function (model, nextUp) {
            var tipText = localization.nextUp;
            if (nextUp && nextUp.title) {
                tipText += ': ' + nextUp.title;
            }
            nextUpTip.setText(tipText);
            elements.next.toggle(!!nextUp);
        });
        _model.on('change:audioMode', this.onAudioMode, this);
        if (elements.cast) {
            _model.change('castAvailable', this.onCastAvailable, this);
            _model.change('castActive', this.onCastActive, this);
        }

        // Event listeners
        // Volume sliders do not exist on mobile so don't assign listeners to them.
        if (elements.volume) {
            elements.volume.on('update', function (pct) {
                var val = pct.percentage;
                this._api.setVolume(val);
            }, this);
        }
        if (elements.volumetooltip) {
            elements.volumetooltip.on('update', function (pct) {
                var val = pct.percentage;
                this._api.setVolume(val);
            }, this);
            elements.volumetooltip.on('toggleValue', function () {
                this._api.setMute();
            }, this);
        }

        if (elements.cast && elements.cast.button) {
            new _ui2.default(elements.cast.element()).on('click tap enter', function (evt) {
                // controlbar cast button needs to manually trigger a click
                // on the native cast button for taps and enter key
                if (evt.type !== 'click') {
                    elements.cast.button.click();
                }
                this._model.set('castClicked', true);
            }, this);
        }

        this._model.mediaController.on('seeked', function () {
            _model.once('change:position', this.checkDvrLiveEdge, this);
        }, this);

        new _ui2.default(elements.duration).on('click tap enter', function () {
            if (this._model.get('streamType') === 'DVR') {
                // Seek to "Live" position within live buffer, but not before current position
                var currentPosition = this._model.get('position');
                this._api.seek(Math.max(_constants.dvrSeekLimit, currentPosition), reasonInteraction());
            }
        }, this);

        // When the control bar is interacted with, trigger a user action event
        new _ui2.default(this.el).on('click tap drag', function () {
            this.trigger('userAction');
        }, this);

        _underscore2.default.each(menus, function (ele) {
            ele.on('open-tooltip', this.closeMenus, this);
        }, this);

        if (_model.get('audioMode')) {
            this.onAudioMode(_model, true);
        }
    }

    _createClass(Controlbar, [{
        key: 'onVolume',
        value: function onVolume(model, pct) {
            this.renderVolume(model.get('mute'), pct);
        }
    }, {
        key: 'onMute',
        value: function onMute(model, muted) {
            this.renderVolume(muted, model.get('volume'));
        }
    }, {
        key: 'renderVolume',
        value: function renderVolume(muted, vol) {
            // mute, volume, and volumetooltip do not exist on mobile devices.
            if (this.elements.mute) {
                _helpers2.default.toggleClass(this.elements.mute.element(), 'jw-off', muted);
                _helpers2.default.toggleClass(this.elements.mute.element(), 'jw-full', !muted);
            }
            if (this.elements.volume) {
                this.elements.volume.render(muted ? 0 : vol);
            }
            if (this.elements.volumetooltip) {
                this.elements.volumetooltip.volumeSlider.render(muted ? 0 : vol);
                _helpers2.default.toggleClass(this.elements.volumetooltip.element(), 'jw-off', muted);
                _helpers2.default.toggleClass(this.elements.volumetooltip.element(), 'jw-full', vol >= 75 && !muted);
            }
        }
    }, {
        key: 'onCastAvailable',
        value: function onCastAvailable(model, val) {
            this.elements.cast.toggle(val);
        }
    }, {
        key: 'onCastActive',
        value: function onCastActive(model, val) {
            this.elements.fullscreen.toggle(!val);
            if (this.elements.cast.button) {
                _helpers2.default.toggleClass(this.elements.cast.button, 'jw-off', !val);
            }
        }
    }, {
        key: 'onElapsed',
        value: function onElapsed(model, val) {
            var elapsedTime = void 0;
            var countdownTime = void 0;
            var duration = model.get('duration');
            if (model.get('streamType') === 'DVR') {
                elapsedTime = countdownTime = Math.ceil(val) >= _constants.dvrSeekLimit ? '' : '-' + _helpers2.default.timeFormat(-val);
            } else {
                elapsedTime = _helpers2.default.timeFormat(val);
                countdownTime = _helpers2.default.timeFormat(duration - val);
            }
            this.elements.elapsed.textContent = elapsedTime;
            this.elements.countdown.textContent = countdownTime;
        }
    }, {
        key: 'onDuration',
        value: function onDuration(model, val) {
            this.elements.duration.textContent = _helpers2.default.timeFormat(Math.abs(val));
        }
    }, {
        key: 'onFullscreen',
        value: function onFullscreen(model, val) {
            _helpers2.default.toggleClass(this.elements.fullscreen.element(), 'jw-off', val);
            this.elements.play.element().focus();
        }
    }, {
        key: 'onAudioMode',
        value: function onAudioMode(model, val) {
            var timeSlider = this.elements.time.element();
            if (val) {
                this.elements.buttonContainer.insertBefore(timeSlider, this.elements.elapsed);
            } else {
                (0, _dom.prependChild)(this.el, timeSlider);
            }
        }
    }, {
        key: 'checkDvrLiveEdge',
        value: function checkDvrLiveEdge() {
            if (this._model.get('streamType') === 'DVR') {
                var currentPosition = Math.ceil(this._model.get('position'));
                // update live icon and displayed time when DVR stream enters or exits live edge
                _helpers2.default.toggleClass(this.elements.live.element(), 'jw-dvr-live', currentPosition >= _constants.dvrSeekLimit);
                this.onElapsed(this._model, currentPosition);
            }
        }
    }, {
        key: 'element',
        value: function element() {
            return this.el;
        }
    }, {
        key: 'setAltText',
        value: function setAltText(model, altText) {
            this.elements.alt.textContent = altText;
        }
    }, {
        key: 'addCues',
        value: function addCues(model, cues) {
            if (this.elements.time) {
                _underscore2.default.each(cues, function (ele) {
                    this.elements.time.addCue(ele);
                }, this);
                this.elements.time.drawCues();
            }
        }

        // Close menus if it has no event.  Otherwise close all but the event's target.

    }, {
        key: 'closeMenus',
        value: function closeMenus(evt) {
            _underscore2.default.each(this.menus, function (ele) {
                if (!evt || evt.target !== ele.el) {
                    ele.closeTooltip(evt);
                }
            });
        }
    }, {
        key: 'rewind',
        value: function rewind() {
            var currentPosition = this._model.get('position');
            var duration = this._model.get('duration');
            var rewindPosition = currentPosition - 10;
            var startPosition = 0;

            // duration is negative in DVR mode
            if (this._model.get('streamType') === 'DVR') {
                startPosition = duration;
            }
            // Seek 10s back. Seek value should be >= 0 in VOD mode and >= (negative) duration in DVR mode
            this._api.seek(Math.max(rewindPosition, startPosition), reasonInteraction());
        }
    }, {
        key: 'onStreamTypeChange',
        value: function onStreamTypeChange(model) {
            // Hide rewind button when in LIVE mode
            var streamType = model.get('streamType');
            this.elements.rewind.toggle(streamType !== 'LIVE');
            this.elements.live.toggle(streamType === 'LIVE' || streamType === 'DVR');
            this.elements.duration.style.display = streamType === 'DVR' ? 'none' : '';
            var duration = model.get('duration');
            this.onDuration(model, duration);
        }
    }, {
        key: 'addLogo',
        value: function addLogo(logo) {
            var buttonContainer = this.elements.buttonContainer;

            var logoButton = new _customButton2.default(logo.file, 'Logo', function () {
                if (logo.link) {
                    window.open(logo.link, '_blank');
                }
            }, 'logo', 'jw-logo-button');

            if (!logo.link) {
                logoButton.element().setAttribute('tabindex', '-1');
            }
            buttonContainer.insertBefore(logoButton.element(), buttonContainer.querySelector('.jw-spacer').nextSibling);
        }
    }, {
        key: 'goToLiveEdge',
        value: function goToLiveEdge() {
            if (this._model.get('streamType') === 'DVR') {
                // Seek to "Live" position within live buffer, but not before current position
                var currentPosition = this._model.get('position');
                this._api.seek(Math.max(_constants.dvrSeekLimit, currentPosition), reasonInteraction());
            }
        }
    }, {
        key: 'updateButtons',
        value: function updateButtons(model, newButtons, oldButtons) {
            // If buttons are undefined exit, buttons are only removed if newButtons is an array
            if (!newButtons) {
                return;
            }

            var buttonContainer = this.elements.buttonContainer;

            var addedButtons = void 0;
            var removedButtons = void 0;

            // On model.change these obects are the same and all buttons need to be added
            if (newButtons === oldButtons || !oldButtons) {
                addedButtons = newButtons;
            } else {
                addedButtons = buttonsInFirstNotInSecond(newButtons, oldButtons);
                removedButtons = buttonsInFirstNotInSecond(oldButtons, newButtons);

                this.removeButtons(buttonContainer, removedButtons);
            }

            for (var i = addedButtons.length - 1; i >= 0; i--) {
                var buttonProps = addedButtons[i];
                var newButton = new _customButton2.default(buttonProps.img, buttonProps.tooltip, buttonProps.callback, buttonProps.id, buttonProps.btnClass);

                if (buttonProps.tooltip) {
                    (0, _simpleTooltip.SimpleTooltip)(newButton.element(), buttonProps.id, buttonProps.tooltip);
                }

                var firstButton = void 0;
                if (newButton.id === 'related') {
                    firstButton = this.elements.settingsButton.element();
                } else if (newButton.id === 'share') {
                    firstButton = buttonContainer.querySelector('[button="related"]') || this.elements.settingsButton.element();
                } else {
                    firstButton = this.elements.spacer.nextSibling;
                    if (firstButton && firstButton.getAttribute('button') === 'logo') {
                        firstButton = firstButton.nextSibling;
                    }
                }
                buttonContainer.insertBefore(newButton.element(), firstButton);
            }
        }
    }, {
        key: 'removeButtons',
        value: function removeButtons(buttonContainer, buttonsToRemove) {
            for (var i = buttonsToRemove.length; i--;) {
                var buttonElement = buttonContainer.querySelector('[button="' + buttonsToRemove[i].id + '"]');
                if (buttonElement) {
                    buttonContainer.removeChild(buttonElement);
                }
            }
        }
    }, {
        key: 'useInstreamTime',
        value: function useInstreamTime(instreamModel) {
            // While in instream mode, the time slider needs to move according to instream time
            var timeSlider = this.elements.time;
            if (!timeSlider) {
                return;
            }

            instreamModel.change('position', timeSlider.onPosition, timeSlider).change('duration', timeSlider.onDuration, timeSlider).change('duration', function () {
                timeSlider.streamType = 'VOD';
            }, timeSlider);
        }
    }, {
        key: 'syncPlaybackTime',
        value: function syncPlaybackTime(model) {
            // When resuming playback mode, trigger a change so that the slider immediately resumes it's original position
            var timeSlider = this.elements.time;
            if (!timeSlider) {
                return;
            }

            timeSlider.onPosition(model, model.get('position'));
            timeSlider.onDuration(model, model.get('duration'));
            timeSlider.onStreamType(model, model.get('streamType'));
        }
    }, {
        key: 'toggleCaptionsButtonState',
        value: function toggleCaptionsButtonState(active) {
            var captionsButton = this.elements.captionsButton;
            if (!captionsButton) {
                return;
            }

            _helpers2.default.toggleClass(captionsButton.element(), 'jw-off', !active);
        }
    }]);

    return Controlbar;
}();

exports.default = Controlbar;

/***/ }),
/* 91 */
/*!***********************************!*\
  !*** ./src/assets/SVG/buffer.svg ***!
  \***********************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"jw-svg-icon jw-svg-icon-buffer\" viewBox=\"0 0 240 240\"><path d=\"M120,186.667a66.667,66.667,0,0,1,0-133.333V40a80,80,0,1,0,80,80H186.667A66.846,66.846,0,0,1,120,186.667Z\"></path></svg>"

/***/ }),
/* 92 */
/*!***********************************!*\
  !*** ./src/assets/SVG/replay.svg ***!
  \***********************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports) {

module.exports = "<svg class=\"jw-svg-icon jw-svg-icon-replay\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 240 240\"><path d=\"M120,41.9v-20c0-5-4-8-8-4l-44,28a5.865,5.865,0,0,0-3.3,7.6A5.943,5.943,0,0,0,68,56.8l43,29c5,4,9,1,9-4v-20a60,60,0,1,1-60,60H40a80,80,0,1,0,80-79.9Z\"></path></svg>"

/***/ }),
/* 93 */
/*!*******************************************!*\
  !*** ./src/assets/SVG/playback-error.svg ***!
  \*******************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"jw-svg-icon jw-svg-icon-error\" viewBox=\"0 0 36 36\" style=\"width:100%;height:100%;\"><path fill=\"#FFF\" d=\"M34.6 20.2L10 33.2 27.6 16l7 3.7a.4.4 0 0 1 .2.5.4.4 0 0 1-.2.2zM33.3 0L21 12.2 9 6c-.2-.3-.6 0-.6.5V25L0 33.6 2.5 36 36 2.7z\"></path></svg>"

/***/ }),
/* 94 */
/*!*********************************!*\
  !*** ./src/assets/SVG/play.svg ***!
  \*********************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"jw-svg-icon jw-svg-icon-play\" viewBox=\"0 0 240 240\"><path d=\"M62.8,199.5c-1,0.8-2.4,0.6-3.3-0.4c-0.4-0.5-0.6-1.1-0.5-1.8V42.6c-0.2-1.3,0.7-2.4,1.9-2.6c0.7-0.1,1.3,0.1,1.9,0.4l154.7,77.7c2.1,1.1,2.1,2.8,0,3.8L62.8,199.5z\"></path></svg>"

/***/ }),
/* 95 */
/*!**********************************!*\
  !*** ./src/assets/SVG/pause.svg ***!
  \**********************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"jw-svg-icon jw-svg-icon-pause\" viewBox=\"0 0 240 240\"><path d=\"M100,194.9c0.2,2.6-1.8,4.8-4.4,5c-0.2,0-0.4,0-0.6,0H65c-2.6,0.2-4.8-1.8-5-4.4c0-0.2,0-0.4,0-0.6V45c-0.2-2.6,1.8-4.8,4.4-5c0.2,0,0.4,0,0.6,0h30c2.6-0.2,4.8,1.8,5,4.4c0,0.2,0,0.4,0,0.6V194.9z M180,45.1c0.2-2.6-1.8-4.8-4.4-5c-0.2,0-0.4,0-0.6,0h-30c-2.6-0.2-4.8,1.8-5,4.4c0,0.2,0,0.4,0,0.6V195c-0.2,2.6,1.8,4.8,4.4,5c0.2,0,0.4,0,0.6,0h30c2.6,0.2,4.8-1.8,5-4.4c0-0.2,0-0.4,0-0.6V45.1z\"></path></svg>"

/***/ }),
/* 96 */
/*!**************************************!*\
  !*** ./src/assets/SVG/rewind-10.svg ***!
  \**************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports) {

module.exports = "<svg class=\"jw-svg-icon jw-svg-icon-rewind\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 240 240\"><path d=\"M113.2,131.078a21.589,21.589,0,0,0-17.7-10.6,21.589,21.589,0,0,0-17.7,10.6,44.769,44.769,0,0,0,0,46.3,21.589,21.589,0,0,0,17.7,10.6,21.589,21.589,0,0,0,17.7-10.6,44.769,44.769,0,0,0,0-46.3Zm-17.7,47.2c-7.8,0-14.4-11-14.4-24.1s6.6-24.1,14.4-24.1,14.4,11,14.4,24.1S103.4,178.278,95.5,178.278Zm-43.4,9.7v-51l-4.8,4.8-6.8-6.8,13-13a4.8,4.8,0,0,1,8.2,3.4v62.7l-9.6-.1Zm162-130.2v125.3a4.867,4.867,0,0,1-4.8,4.8H146.6v-19.3h48.2v-96.4H79.1v19.3c0,5.3-3.6,7.2-8,4.3l-41.8-27.9a6.013,6.013,0,0,1-2.7-8,5.887,5.887,0,0,1,2.7-2.7l41.8-27.9c4.4-2.9,8-1,8,4.3v19.3H209.2A4.974,4.974,0,0,1,214.1,57.778Z\"></path></svg>"

/***/ }),
/* 97 */
/*!*********************************!*\
  !*** ./src/assets/SVG/next.svg ***!
  \*********************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"jw-svg-icon jw-svg-icon-next\" viewBox=\"0 0 240 240\"><path d=\"M165,60v53.3L59.2,42.8C56.9,41.3,55,42.3,55,45v150c0,2.7,1.9,3.8,4.2,2.2L165,126.6v53.3h20v-120L165,60L165,60z\"></path></svg>"

/***/ }),
/* 98 */
/*!*************************************!*\
  !*** ./src/assets/SVG/volume-0.svg ***!
  \*************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports) {

module.exports = "<svg class=\"jw-svg-icon jw-svg-icon-volume-0\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 240 240\"><path d=\"M116.4,42.8v154.5c0,2.8-1.7,3.6-3.8,1.7l-54.1-48.1H28.9c-2.8,0-5.2-2.3-5.2-5.2V94.2c0-2.8,2.3-5.2,5.2-5.2h29.6l54.1-48.1C114.6,39.1,116.4,39.9,116.4,42.8z M212.3,96.4l-14.6-14.6l-23.6,23.6l-23.6-23.6l-14.6,14.6l23.6,23.6l-23.6,23.6l14.6,14.6l23.6-23.6l23.6,23.6l14.6-14.6L188.7,120L212.3,96.4z\"></path></svg>"

/***/ }),
/* 99 */
/*!**************************************!*\
  !*** ./src/assets/SVG/volume-50.svg ***!
  \**************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports) {

module.exports = "<svg class=\"jw-svg-icon jw-svg-icon-volume-50\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 240 240\"><path d=\"M116.4,42.8v154.5c0,2.8-1.7,3.6-3.8,1.7l-54.1-48.1H28.9c-2.8,0-5.2-2.3-5.2-5.2V94.2c0-2.8,2.3-5.2,5.2-5.2h29.6l54.1-48.1C114.7,39.1,116.4,39.9,116.4,42.8z M178.2,120c0-22.7-18.5-41.2-41.2-41.2v20.6c11.4,0,20.6,9.2,20.6,20.6c0,11.4-9.2,20.6-20.6,20.6v20.6C159.8,161.2,178.2,142.7,178.2,120z\"></path></svg>"

/***/ }),
/* 100 */
/*!***************************************!*\
  !*** ./src/assets/SVG/volume-100.svg ***!
  \***************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports) {

module.exports = "<svg class=\"jw-svg-icon jw-svg-icon-volume-100\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 240 240\"><path d=\"M116.5,42.8v154.4c0,2.8-1.7,3.6-3.8,1.7l-54.1-48H29c-2.8,0-5.2-2.3-5.2-5.2V94.3c0-2.8,2.3-5.2,5.2-5.2h29.6l54.1-48C114.8,39.2,116.5,39.9,116.5,42.8z\"></path><path d=\"M136.2,160v-20c11.1,0,20-8.9,20-20s-8.9-20-20-20V80c22.1,0,40,17.9,40,40S158.3,160,136.2,160z\"></path><path d=\"M216.2,120c0-44.2-35.8-80-80-80v20c33.1,0,60,26.9,60,60s-26.9,60-60,60v20C180.4,199.9,216.1,164.1,216.2,120z\"></path></svg>"

/***/ }),
/* 101 */
/*!****************************************!*\
  !*** ./src/assets/SVG/captions-on.svg ***!
  \****************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"jw-svg-icon jw-svg-icon-cc-on\" viewBox=\"0 0 240 240\"><path d=\"M215,40H25c-2.7,0-5,2.2-5,5v150c0,2.7,2.2,5,5,5h190c2.7,0,5-2.2,5-5V45C220,42.2,217.8,40,215,40z M108.1,137.7c0.7-0.7,1.5-1.5,2.4-2.3l6.6,7.8c-2.2,2.4-5,4.4-8,5.8c-8,3.5-17.3,2.4-24.3-2.9c-3.9-3.6-5.9-8.7-5.5-14v-25.6c0-2.7,0.5-5.3,1.5-7.8c0.9-2.2,2.4-4.3,4.2-5.9c5.7-4.5,13.2-6.2,20.3-4.6c3.3,0.5,6.3,2,8.7,4.3c1.3,1.3,2.5,2.6,3.5,4.2l-7.1,6.9c-2.4-3.7-6.5-5.9-10.9-5.9c-2.4-0.2-4.8,0.7-6.6,2.3c-1.7,1.7-2.5,4.1-2.4,6.5v25.6C90.4,141.7,102,143.5,108.1,137.7z M152.9,137.7c0.7-0.7,1.5-1.5,2.4-2.3l6.6,7.8c-2.2,2.4-5,4.4-8,5.8c-8,3.5-17.3,2.4-24.3-2.9c-3.9-3.6-5.9-8.7-5.5-14v-25.6c0-2.7,0.5-5.3,1.5-7.8c0.9-2.2,2.4-4.3,4.2-5.9c5.7-4.5,13.2-6.2,20.3-4.6c3.3,0.5,6.3,2,8.7,4.3c1.3,1.3,2.5,2.6,3.5,4.2l-7.1,6.9c-2.4-3.7-6.5-5.9-10.9-5.9c-2.4-0.2-4.8,0.7-6.6,2.3c-1.7,1.7-2.5,4.1-2.4,6.5v25.6C135.2,141.7,146.8,143.5,152.9,137.7z\"></path></svg>"

/***/ }),
/* 102 */
/*!*****************************************!*\
  !*** ./src/assets/SVG/captions-off.svg ***!
  \*****************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"jw-svg-icon jw-svg-icon-cc-off\" viewBox=\"0 0 240 240\"><path d=\"M99.4,97.8c-2.4-0.2-4.8,0.7-6.6,2.3c-1.7,1.7-2.5,4.1-2.4,6.5v25.6c0,9.6,11.6,11.4,17.7,5.5c0.7-0.7,1.5-1.5,2.4-2.3l6.6,7.8c-2.2,2.4-5,4.4-8,5.8c-8,3.5-17.3,2.4-24.3-2.9c-3.9-3.6-5.9-8.7-5.5-14v-25.6c0-2.7,0.5-5.3,1.5-7.8c0.9-2.2,2.4-4.3,4.2-5.9c5.7-4.5,13.2-6.2,20.3-4.6c3.3,0.5,6.3,2,8.7,4.3c1.3,1.3,2.5,2.6,3.5,4.2l-7.1,6.9C107.9,100,103.8,97.8,99.4,97.8z M144.1,97.8c-2.4-0.2-4.8,0.7-6.6,2.3c-1.7,1.7-2.5,4.1-2.4,6.5v25.6c0,9.6,11.6,11.4,17.7,5.5c0.7-0.7,1.5-1.5,2.4-2.3l6.6,7.8c-2.2,2.4-5,4.4-8,5.8c-8,3.5-17.3,2.4-24.3-2.9c-3.9-3.6-5.9-8.7-5.5-14v-25.6c0-2.7,0.5-5.3,1.5-7.8c0.9-2.2,2.4-4.3,4.2-5.9c5.7-4.5,13.2-6.2,20.3-4.6c3.3,0.5,6.3,2,8.7,4.3c1.3,1.3,2.5,2.6,3.5,4.2l-7.1,6.9C152.6,100,148.5,97.8,144.1,97.8L144.1,97.8z M200,60v120H40V60H200 M215,40H25c-2.7,0-5,2.2-5,5v150c0,2.7,2.2,5,5,5h190c2.7,0,5-2.2,5-5V45C220,42.2,217.8,40,215,40z\"></path></svg>"

/***/ }),
/* 103 */
/*!***************************************!*\
  !*** ./src/assets/SVG/airplay-on.svg ***!
  \***************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"jw-svg-icon jw-svg-icon-airplay-on\" viewBox=\"0 0 240 240\"><path d=\"M229.9,40v130c0.2,2.6-1.8,4.8-4.4,5c-0.2,0-0.4,0-0.6,0h-44l-17-20h46V55H30v100h47l-17,20h-45c-2.6,0.2-4.8-1.8-5-4.4c0-0.2,0-0.4,0-0.6V40c-0.2-2.6,1.8-4.8,4.4-5c0.2,0,0.4,0,0.6,0h209.8c2.6-0.2,4.8,1.8,5,4.4C229.9,39.7,229.9,39.9,229.9,40z M104.9,122l15-18l15,18l11,13h44V75H50v60h44L104.9,122z M179.9,205l-60-70l-60,70H179.9z\"></path></svg>"

/***/ }),
/* 104 */
/*!****************************************!*\
  !*** ./src/assets/SVG/airplay-off.svg ***!
  \****************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"jw-svg-icon jw-svg-icon-airplay-off\" viewBox=\"0 0 240 240\"><path d=\"M210,55v100h-50l20,20h45c2.6,0.2,4.8-1.8,5-4.4c0-0.2,0-0.4,0-0.6V40c0.2-2.6-1.8-4.8-4.4-5c-0.2,0-0.4,0-0.6,0H15c-2.6-0.2-4.8,1.8-5,4.4c0,0.2,0,0.4,0,0.6v130c-0.2,2.6,1.8,4.8,4.4,5c0.2,0,0.4,0,0.6,0h45l20-20H30V55H210 M60,205l60-70l60,70H60L60,205z\"></path></svg>"

/***/ }),
/* 105 */
/*!********************************!*\
  !*** ./src/assets/SVG/dvr.svg ***!
  \********************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"jw-svg-icon jw-svg-icon-dvr\" viewBox=\"60 0 359.9 240\"><path d=\"M399.9,60v120H80V60H399.9 M414.9,40H65c-2.7,0-5,2.2-5,5v149.9c0,2.7,2.2,5,5,5h349.9c2.7,0,5-2.2,5-5V45C419.9,42.2,417.7,40,414.9,40z M216.6,88.8v51.3h22.7v9.9h-33.5V88.8L216.6,88.8L216.6,88.8z M249.2,88.8h11.2V150h-11.2V88.8z M282.1,88.8l12,45.2l12.2-45.2h11.4L300.6,150h-13L271,88.8H282.1z M335.7,123.7v16.4h20.9v9.9H325V88.8h30.1v9.9h-19.4v15.6H352v9.4L335.7,123.7L335.7,123.7z M140,90c-16.6,0-30,13.4-30,30s13.4,30,30,30s30-13.4,30-30S156.6,90,140,90z M160,119.9c0,3.5-1,7.1-2.9,10.1l-27.2-27.2c9.4-5.6,21.6-2.6,27.2,6.8C159.1,112.7,160,116.3,160,119.9z M120,119.9c0-3.5,1-7.1,2.9-10.1l27.2,27.2c-9.4,5.6-21.6,2.6-27.2-6.8C121,127.1,120,123.6,120,119.9z\"></path></svg>"

/***/ }),
/* 106 */
/*!*********************************!*\
  !*** ./src/assets/SVG/live.svg ***!
  \*********************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"jw-svg-icon jw-svg-icon-live\" viewBox=\"0 0 360 240\"><path d=\"M354.777,40H5.048a5.013,5.013,0,0,0-5,5V194.9a5.013,5.013,0,0,0,5,5h349.73a5.013,5.013,0,0,0,5-5V45A4.95,4.95,0,0,0,354.777,40ZM80.011,139.9a20,20,0,1,1,19.99-20A19.99,19.99,0,0,1,80.011,139.9Zm99.352,10H145.879V88.7h10.795V140h22.689Zm20.99,0H189.158V88.7h11.195Zm40.081,0H227.439L210.847,88.7h11.195l11.994,45.2L246.23,88.7h11.394Zm56.073,0H264.821V88.7h30.085v9.9H275.516v15.6h16.292v9.4H275.516V140h20.89ZM355,40H5.051a5.016,5.016,0,0,0-5,5V195a5.016,5.016,0,0,0,5,5H355a5.016,5.016,0,0,0,5-5V45A4.953,4.953,0,0,0,355,40ZM80.061,139.962a20.013,20.013,0,1,1,20-20.013A20,20,0,0,1,80.061,139.962Zm99.414,10.006h-33.5V88.73h10.8v51.332h22.7Zm21,0h-11.2V88.73h11.2Zm40.106,0h-13l-16.6-61.238h11.2l12,45.228,12.2-45.228h11.4Zm56.108,0h-31.7V88.73h30.1v9.906h-19.4v15.61h16.3v9.406h-16.3v16.41h20.9ZM354.826,40H5a5.016,5.016,0,0,0-5,5V195a5.016,5.016,0,0,0,5,5H354.826a5.016,5.016,0,0,0,5-5V45A4.952,4.952,0,0,0,354.826,40ZM79.983,139.962a20.013,20.013,0,1,1,20-20.013A20,20,0,0,1,79.983,139.962Zm99.379,10.006H145.87V88.73h10.8v51.332h22.7Zm21,0h-11.2V88.73h11.2Zm40.092,0h-13l-16.6-61.238h11.2l12,45.228,12.2-45.228h11.4Zm56.088,0H264.845V88.73h30.094v9.906h-19.4v15.61h16.3v9.406h-16.3v16.41h20.9Z\"></path></svg>"

/***/ }),
/* 107 */
/*!******************************************!*\
  !*** ./src/assets/SVG/playback-rate.svg ***!
  \******************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"jw-svg-icon jw-svg-icon-playback-rate\" viewBox=\"0 0 240 240\"><path d=\"M158.83,48.83A71.17,71.17,0,1,0,230,120,71.163,71.163,0,0,0,158.83,48.83Zm45.293,77.632H152.34V74.708h12.952v38.83h38.83ZM35.878,74.708h38.83V87.66H35.878ZM10,113.538H61.755V126.49H10Zm25.878,38.83h38.83V165.32H35.878Z\"></path></svg>"

/***/ }),
/* 108 */
/*!*************************************!*\
  !*** ./src/assets/SVG/settings.svg ***!
  \*************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports) {

module.exports = "<svg class=\"jw-svg-icon jw-svg-icon-settings\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 240 240\"><path d=\"M204,145l-25-14c0.8-3.6,1.2-7.3,1-11c0.2-3.7-0.2-7.4-1-11l25-14c2.2-1.6,3.1-4.5,2-7l-16-26c-1.2-2.1-3.8-2.9-6-2l-25,14c-6-4.2-12.3-7.9-19-11V35c0.2-2.6-1.8-4.8-4.4-5c-0.2,0-0.4,0-0.6,0h-30c-2.6-0.2-4.8,1.8-5,4.4c0,0.2,0,0.4,0,0.6v28c-6.7,3.1-13,6.7-19,11L56,60c-2.2-0.9-4.8-0.1-6,2L35,88c-1.6,2.2-1.3,5.3,0.9,6.9c0,0,0.1,0,0.1,0.1l25,14c-0.8,3.6-1.2,7.3-1,11c-0.2,3.7,0.2,7.4,1,11l-25,14c-2.2,1.6-3.1,4.5-2,7l16,26c1.2,2.1,3.8,2.9,6,2l25-14c5.7,4.6,12.2,8.3,19,11v28c-0.2,2.6,1.8,4.8,4.4,5c0.2,0,0.4,0,0.6,0h30c2.6,0.2,4.8-1.8,5-4.4c0-0.2,0-0.4,0-0.6v-28c7-2.3,13.5-6,19-11l25,14c2.5,1.3,5.6,0.4,7-2l15-26C206.7,149.4,206,146.7,204,145z M120,149.9c-16.5,0-30-13.4-30-30s13.4-30,30-30s30,13.4,30,30c0.3,16.3-12.6,29.7-28.9,30C120.7,149.9,120.4,149.9,120,149.9z\"></path></svg>"

/***/ }),
/* 109 */
/*!*****************************************!*\
  !*** ./src/assets/SVG/audio-tracks.svg ***!
  \*****************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports) {

module.exports = "<svg class=\"jw-svg-icon jw-svg-icon-audio-tracks\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 240 240\"><path d=\"M35,34h160v20H35V34z M35,94h160V74H35V94z M35,134h60v-20H35V134z M160,114c-23.4-1.3-43.6,16.5-45,40v50h20c5.2,0.3,9.7-3.6,10-8.9c0-0.4,0-0.7,0-1.1v-20c0.3-5.2-3.6-9.7-8.9-10c-0.4,0-0.7,0-1.1,0h-10v-10c1.5-17.9,17.1-31.3,35-30c17.9-1.3,33.6,12.1,35,30v10H185c-5.2-0.3-9.7,3.6-10,8.9c0,0.4,0,0.7,0,1.1v20c-0.3,5.2,3.6,9.7,8.9,10c0.4,0,0.7,0,1.1,0h20v-50C203.5,130.6,183.4,112.7,160,114z\"></path></svg>"

/***/ }),
/* 110 */
/*!****************************************!*\
  !*** ./src/assets/SVG/quality-100.svg ***!
  \****************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports) {

module.exports = "<svg class=\"jw-svg-icon jw-svg-icon-quality-100\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 240 240\"><path d=\"M55,200H35c-3,0-5-2-5-4c0,0,0,0,0-1v-30c0-3,2-5,4-5c0,0,0,0,1,0h20c3,0,5,2,5,4c0,0,0,0,0,1v30C60,198,58,200,55,200L55,200z M110,195v-70c0-3-2-5-4-5c0,0,0,0-1,0H85c-3,0-5,2-5,4c0,0,0,0,0,1v70c0,3,2,5,4,5c0,0,0,0,1,0h20C108,200,110,198,110,195L110,195z M160,195V85c0-3-2-5-4-5c0,0,0,0-1,0h-20c-3,0-5,2-5,4c0,0,0,0,0,1v110c0,3,2,5,4,5c0,0,0,0,1,0h20C158,200,160,198,160,195L160,195z M210,195V45c0-3-2-5-4-5c0,0,0,0-1,0h-20c-3,0-5,2-5,4c0,0,0,0,0,1v150c0,3,2,5,4,5c0,0,0,0,1,0h20C208,200,210,198,210,195L210,195z\"></path></svg>"

/***/ }),
/* 111 */
/*!*******************************************!*\
  !*** ./src/assets/SVG/fullscreen-not.svg ***!
  \*******************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"jw-svg-icon jw-svg-icon-fullscreen-off\" viewBox=\"0 0 240 240\"><path d=\"M109.2,134.9l-8.4,50.1c-0.4,2.7-2.4,3.3-4.4,1.4L82,172l-27.9,27.9l-14.2-14.2l27.9-27.9l-14.4-14.4c-1.9-1.9-1.3-3.9,1.4-4.4l50.1-8.4c1.8-0.5,3.6,0.6,4.1,2.4C109.4,133.7,109.4,134.3,109.2,134.9L109.2,134.9z M172.1,82.1L200,54.2L185.8,40l-27.9,27.9l-14.4-14.4c-1.9-1.9-3.9-1.3-4.4,1.4l-8.4,50.1c-0.5,1.8,0.6,3.6,2.4,4.1c0.5,0.2,1.2,0.2,1.7,0l50.1-8.4c2.7-0.4,3.3-2.4,1.4-4.4L172.1,82.1z\"></path></svg>"

/***/ }),
/* 112 */
/*!***************************************!*\
  !*** ./src/assets/SVG/fullscreen.svg ***!
  \***************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"jw-svg-icon jw-svg-icon-fullscreen-on\" viewBox=\"0 0 240 240\"><path d=\"M96.3,186.1c1.9,1.9,1.3,4-1.4,4.4l-50.6,8.4c-1.8,0.5-3.7-0.6-4.2-2.4c-0.2-0.6-0.2-1.2,0-1.7l8.4-50.6c0.4-2.7,2.4-3.4,4.4-1.4l14.5,14.5l28.2-28.2l14.3,14.3l-28.2,28.2L96.3,186.1z M195.8,39.1l-50.6,8.4c-2.7,0.4-3.4,2.4-1.4,4.4l14.5,14.5l-28.2,28.2l14.3,14.3l28.2-28.2l14.5,14.5c1.9,1.9,4,1.3,4.4-1.4l8.4-50.6c0.5-1.8-0.6-3.6-2.4-4.2C197,39,196.4,39,195.8,39.1L195.8,39.1z\"></path></svg>"

/***/ }),
/* 113 */
/*!**********************************!*\
  !*** ./src/assets/SVG/close.svg ***!
  \**********************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"jw-svg-icon jw-svg-icon-close\" viewBox=\"0 0 240 240\"><path d=\"M134.8,120l48.6-48.6c2-1.9,2.1-5.2,0.2-7.2c0,0-0.1-0.1-0.2-0.2l-7.4-7.4c-1.9-2-5.2-2.1-7.2-0.2c0,0-0.1,0.1-0.2,0.2L120,105.2L71.4,56.6c-1.9-2-5.2-2.1-7.2-0.2c0,0-0.1,0.1-0.2,0.2L56.6,64c-2,1.9-2.1,5.2-0.2,7.2c0,0,0.1,0.1,0.2,0.2l48.6,48.7l-48.6,48.6c-2,1.9-2.1,5.2-0.2,7.2c0,0,0.1,0.1,0.2,0.2l7.4,7.4c1.9,2,5.2,2.1,7.2,0.2c0,0,0.1-0.1,0.2-0.2l48.7-48.6l48.6,48.6c1.9,2,5.2,2.1,7.2,0.2c0,0,0.1-0.1,0.2-0.2l7.4-7.4c2-1.9,2.1-5.2,0.2-7.2c0,0-0.1-0.1-0.2-0.2L134.8,120z\"></path></svg>"

/***/ }),
/* 114 */
/*!************************************!*\
  !*** ./src/assets/SVG/jw-logo.svg ***!
  \************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports) {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"jw-svg-icon jw-svg-icon-jwplayer-logo\" viewBox=\"0 0 992 1024\"><path d=\"M144 518.4c0 6.4-6.4 6.4-6.4 0l-3.2-12.8c0 0-6.4-19.2-12.8-38.4 0-6.4-6.4-12.8-9.6-22.4-6.4-6.4-16-9.6-28.8-6.4-9.6 3.2-16 12.8-16 22.4s0 16 0 25.6c3.2 25.6 22.4 121.6 32 140.8 9.6 22.4 35.2 32 54.4 22.4 22.4-9.6 28.8-35.2 38.4-54.4 9.6-25.6 60.8-166.4 60.8-166.4 6.4-12.8 9.6-12.8 9.6 0 0 0 0 140.8-3.2 204.8 0 25.6 0 67.2 9.6 89.6 6.4 16 12.8 28.8 25.6 38.4s28.8 12.8 44.8 12.8c6.4 0 16-3.2 22.4-6.4 9.6-6.4 16-12.8 25.6-22.4 16-19.2 28.8-44.8 38.4-64 25.6-51.2 89.6-201.6 89.6-201.6 6.4-12.8 9.6-12.8 9.6 0 0 0-9.6 256-9.6 355.2 0 25.6 6.4 48 12.8 70.4 9.6 22.4 22.4 38.4 44.8 48s48 9.6 70.4-3.2c16-9.6 28.8-25.6 38.4-38.4 12.8-22.4 25.6-48 32-70.4 19.2-51.2 35.2-102.4 51.2-153.6s153.6-540.8 163.2-582.4c0-6.4 0-9.6 0-12.8 0-9.6-6.4-19.2-16-22.4-16-6.4-32 0-38.4 12.8-6.4 16-195.2 470.4-195.2 470.4-6.4 12.8-9.6 12.8-9.6 0 0 0 0-156.8 0-288 0-70.4-35.2-108.8-83.2-118.4-22.4-3.2-44.8 0-67.2 12.8s-35.2 32-48 54.4c-16 28.8-105.6 297.6-105.6 297.6-6.4 12.8-9.6 12.8-9.6 0 0 0-3.2-115.2-6.4-144-3.2-41.6-12.8-108.8-67.2-115.2-51.2-3.2-73.6 57.6-86.4 99.2-9.6 25.6-51.2 163.2-51.2 163.2v3.2z\"></path></svg>"

/***/ }),
/* 115 */
/*!**********************************************************!*\
  !*** ./src/js/view/controls/components/custom-button.js ***!
  \**********************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _css = __webpack_require__(/*! utils/css */ 23);

var _ui = __webpack_require__(/*! utils/ui */ 67);

var _ui2 = _interopRequireDefault(_ui);

var _svgParser = __webpack_require__(/*! utils/svgParser */ 70);

var _svgParser2 = _interopRequireDefault(_svgParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CustomButton = function () {
    function CustomButton(img, ariaText, callback, id, btnClass) {
        _classCallCheck(this, CustomButton);

        var buttonElement = document.createElement('div');
        buttonElement.className = 'jw-icon jw-icon-inline jw-button-color jw-reset ' + btnClass;
        buttonElement.setAttribute('button', id);
        buttonElement.setAttribute('role', 'button');
        buttonElement.setAttribute('tabindex', '0');
        if (ariaText) {
            buttonElement.setAttribute('aria-label', ariaText);
        }

        var iconElement = void 0;
        if (img && img.substring(0, 4) === '<svg') {
            iconElement = (0, _svgParser2.default)(img);
        } else {
            iconElement = document.createElement('div');
            iconElement.className = 'jw-icon jw-button-image jw-button-color jw-reset';
            if (img) {
                (0, _css.style)(iconElement, {
                    backgroundImage: 'url(' + img + ')'
                });
            }
        }

        buttonElement.appendChild(iconElement);

        new _ui2.default(buttonElement).on('click tap enter', callback, this);

        // Prevent button from being focused on mousedown so that the tooltips don't remain visible until
        // the user interacts with another element on the page
        buttonElement.addEventListener('mousedown', function (e) {
            e.preventDefault();
        });

        this.id = id;
        this.buttonElement = buttonElement;
    }

    _createClass(CustomButton, [{
        key: 'element',
        value: function element() {
            return this.buttonElement;
        }
    }, {
        key: 'toggle',
        value: function toggle(show) {
            if (show) {
                this.show();
            } else {
                this.hide();
            }
        }
    }, {
        key: 'show',
        value: function show() {
            this.buttonElement.style.display = '';
        }
    }, {
        key: 'hide',
        value: function hide() {
            this.buttonElement.style.display = 'none';
        }
    }]);

    return CustomButton;
}();

exports.default = CustomButton;

/***/ }),
/* 116 */
/*!*******************************************************!*\
  !*** ./src/js/view/controls/components/timeslider.js ***!
  \*******************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _constants = __webpack_require__(/*! view/constants */ 72);

var _underscore = __webpack_require__(/*! utils/underscore */ 0);

var _underscore2 = _interopRequireDefault(_underscore);

var _helpers = __webpack_require__(/*! utils/helpers */ 5);

var _helpers2 = _interopRequireDefault(_helpers);

var _ui = __webpack_require__(/*! utils/ui */ 67);

var _ui2 = _interopRequireDefault(_ui);

var _slider = __webpack_require__(/*! view/controls/components/slider */ 79);

var _slider2 = _interopRequireDefault(_slider);

var _tooltip = __webpack_require__(/*! view/controls/components/tooltip */ 80);

var _tooltip2 = _interopRequireDefault(_tooltip);

var _chapters = __webpack_require__(/*! view/controls/components/chapters.mixin */ 118);

var _chapters2 = _interopRequireDefault(_chapters);

var _thumbnails = __webpack_require__(/*! view/controls/components/thumbnails.mixin */ 119);

var _thumbnails2 = _interopRequireDefault(_thumbnails);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TimeTip = function (_Tooltip) {
    _inherits(TimeTip, _Tooltip);

    function TimeTip() {
        _classCallCheck(this, TimeTip);

        return _possibleConstructorReturn(this, (TimeTip.__proto__ || Object.getPrototypeOf(TimeTip)).apply(this, arguments));
    }

    _createClass(TimeTip, [{
        key: 'setup',
        value: function setup() {
            this.text = document.createElement('span');
            this.text.className = 'jw-text jw-reset';
            this.img = document.createElement('div');
            this.img.className = 'jw-time-thumb jw-reset';
            this.containerWidth = 0;
            this.textLength = 0;
            this.dragJustReleased = false;

            var wrapper = document.createElement('div');
            wrapper.className = 'jw-time-tip jw-reset';
            wrapper.appendChild(this.img);
            wrapper.appendChild(this.text);

            this.addContent(wrapper);
        }
    }, {
        key: 'image',
        value: function image(style) {
            _helpers2.default.style(this.img, style);
        }
    }, {
        key: 'update',
        value: function update(txt) {
            this.text.textContent = txt;
        }
    }, {
        key: 'getWidth',
        value: function getWidth() {
            if (!this.containerWidth) {
                this.setWidth();
            }

            return this.containerWidth;
        }
    }, {
        key: 'setWidth',
        value: function setWidth(width) {
            var tolerance = 16; // add a little padding so the tooltip isn't flush against the edge

            if (width) {
                this.containerWidth = width + tolerance;
                return;
            }

            if (!this.container) {
                return;
            }

            this.containerWidth = _helpers2.default.bounds(this.container).width + tolerance;
        }
    }, {
        key: 'resetWidth',
        value: function resetWidth() {
            this.containerWidth = 0;
        }
    }]);

    return TimeTip;
}(_tooltip2.default);

function reasonInteraction() {
    return { reason: 'interaction' };
}

var TimeSlider = function (_Slider) {
    _inherits(TimeSlider, _Slider);

    function TimeSlider(_model, _api) {
        _classCallCheck(this, TimeSlider);

        var _this2 = _possibleConstructorReturn(this, (TimeSlider.__proto__ || Object.getPrototypeOf(TimeSlider)).call(this, 'jw-slider-time', 'horizontal'));

        _this2._model = _model;
        _this2._api = _api;

        _this2.timeTip = new TimeTip('jw-tooltip-time', null, true);
        _this2.timeTip.setup();

        _this2.cues = [];

        // Store the attempted seek, until the previous one completes
        _this2.seekThrottled = _underscore2.default.throttle(_this2.performSeek, 400);
        _this2.mobileHoverDistance = 5;

        _this2.setup();
        return _this2;
    }

    // These overwrite Slider methods


    _createClass(TimeSlider, [{
        key: 'setup',
        value: function setup() {
            _get(TimeSlider.prototype.__proto__ || Object.getPrototypeOf(TimeSlider.prototype), 'setup', this).apply(this, arguments);

            this._model.on('duration', this.onDuration, this).change('playlistItem', this.onPlaylistItem, this).change('position', this.onPosition, this).change('buffer', this.onBuffer, this).change('streamType', this.onStreamType, this);

            this.elementRail.appendChild(this.timeTip.element());

            // Show the tooltip on while dragging (touch) moving(mouse), or moving over(mouse)
            this.elementUI = new _ui2.default(this.el, { useHover: true, useMove: true }).on('drag move over', this.showTimeTooltip.bind(this), this).on('dragEnd out', this.hideTimeTooltip.bind(this), this);
        }
    }, {
        key: 'limit',
        value: function limit(percent) {
            if (this.activeCue && _underscore2.default.isNumber(this.activeCue.pct)) {
                return this.activeCue.pct;
            }
            var duration = this._model.get('duration');
            if (this.streamType === 'DVR') {
                var position = (1 - percent / 100) * duration;
                var currentPosition = this._model.get('position');
                var updatedPosition = Math.min(position, Math.max(_constants.dvrSeekLimit, currentPosition));
                var updatedPercent = updatedPosition * 100 / duration;
                return 100 - updatedPercent;
            }
            return percent;
        }
    }, {
        key: 'update',
        value: function update(percent) {
            this.seekTo = percent;
            this.seekThrottled();
            _get(TimeSlider.prototype.__proto__ || Object.getPrototypeOf(TimeSlider.prototype), 'update', this).apply(this, arguments);
        }
    }, {
        key: 'dragStart',
        value: function dragStart() {
            this._model.set('scrubbing', true);
            _get(TimeSlider.prototype.__proto__ || Object.getPrototypeOf(TimeSlider.prototype), 'dragStart', this).apply(this, arguments);
        }
    }, {
        key: 'dragEnd',
        value: function dragEnd() {
            _get(TimeSlider.prototype.__proto__ || Object.getPrototypeOf(TimeSlider.prototype), 'dragEnd', this).apply(this, arguments);
            this._model.set('scrubbing', false);
            this.dragJustReleased = true;
        }

        // Event Listeners

    }, {
        key: 'onSeeked',
        value: function onSeeked() {
            // When we are done scrubbing there will be a final seeked event
            if (this._model.get('scrubbing')) {
                this.performSeek();
            }
        }
    }, {
        key: 'onBuffer',
        value: function onBuffer(model, pct) {
            this.updateBuffer(pct);
        }
    }, {
        key: 'onPosition',
        value: function onPosition(model, position) {
            if (this.dragJustReleased) {
                // prevents firing an outdated position and causing the timeslider to jump back and forth
                this.dragJustReleased = false;
                return;
            }
            this.updateTime(position, model.get('duration'));
        }
    }, {
        key: 'onDuration',
        value: function onDuration(model, duration) {
            this.updateTime(model.get('position'), duration);
        }
    }, {
        key: 'onStreamType',
        value: function onStreamType(model, streamType) {
            this.streamType = streamType;
        }
    }, {
        key: 'updateTime',
        value: function updateTime(position, duration) {
            var pct = 0;
            if (duration) {
                if (this.streamType === 'DVR') {
                    pct = (duration - position) / duration * 100;
                } else if (this.streamType === 'VOD' || !this.streamType) {
                    // Default to VOD behavior if streamType isn't set
                    pct = position / duration * 100;
                }
            }
            this.render(pct);
        }
    }, {
        key: 'onPlaylistItem',
        value: function onPlaylistItem(model, playlistItem) {
            if (!playlistItem) {
                return;
            }
            this.reset();

            model.mediaModel.on('seeked', this.onSeeked, this);

            var tracks = playlistItem.tracks;
            _underscore2.default.each(tracks, function (track) {
                if (track && track.kind && track.kind.toLowerCase() === 'thumbnails') {
                    this.loadThumbnails(track.file);
                } else if (track && track.kind && track.kind.toLowerCase() === 'chapters') {
                    this.loadChapters(track.file);
                }
            }, this);
        }
    }, {
        key: 'performSeek',
        value: function performSeek() {
            var percent = this.seekTo;
            var duration = this._model.get('duration');
            var position;
            if (duration === 0) {
                this._api.play(reasonInteraction());
            } else if (this.streamType === 'DVR') {
                position = (100 - percent) / 100 * duration;
                this._api.seek(position, reasonInteraction());
            } else {
                position = percent / 100 * duration;
                this._api.seek(Math.min(position, duration - 0.25), reasonInteraction());
            }
        }
    }, {
        key: 'showTimeTooltip',
        value: function showTimeTooltip(evt) {
            var duration = this._model.get('duration');
            if (duration === 0) {
                return;
            }

            var playerWidth = this._model.get('containerWidth');
            var railBounds = _helpers2.default.bounds(this.elementRail);
            var position = evt.pageX ? evt.pageX - railBounds.left : evt.x;
            position = _helpers2.default.between(position, 0, railBounds.width);
            var pct = position / railBounds.width;
            var time = duration * pct;

            // For DVR we need to swap it around
            if (duration < 0) {
                time = duration - time;
            }

            var timetipText;

            // With touch events, we never will get the hover events on the cues that cause cues to be active.
            // Therefore use the info we about the scroll position to detect if there is a nearby cue to be active.
            if (_ui2.default.getPointerType(evt.sourceEvent) === 'touch') {
                this.activeCue = _underscore2.default.reduce(this.cues, function (closeCue, cue) {
                    if (Math.abs(position - parseInt(cue.pct) / 100 * railBounds.width) < this.mobileHoverDistance) {
                        return cue;
                    }
                    return closeCue;
                }.bind(this), undefined);
            }

            if (this.activeCue) {
                timetipText = this.activeCue.text;
            } else {
                var allowNegativeTime = true;
                timetipText = _helpers2.default.timeFormat(time, allowNegativeTime);

                // If DVR and within live buffer
                if (duration < 0 && time > _constants.dvrSeekLimit) {
                    timetipText = 'Live';
                }
            }
            var timeTip = this.timeTip;

            timeTip.update(timetipText);
            if (this.textLength !== timetipText.length) {
                // An activeCue may cause the width of the timeTip container to change
                this.textLength = timetipText.length;
                timeTip.resetWidth();
            }
            this.showThumbnail(time);

            _helpers2.default.addClass(timeTip.el, 'jw-open');

            var timeTipWidth = timeTip.getWidth();
            var widthPct = railBounds.width / 100;
            var tolerance = playerWidth - railBounds.width;
            var timeTipPct = 0;
            if (timeTipWidth > tolerance) {
                // timeTip may go outside the bounds of the player. Determine the % of tolerance needed
                timeTipPct = (timeTipWidth - tolerance) / (2 * 100 * widthPct);
            }
            var safePct = Math.min(1 - timeTipPct, Math.max(timeTipPct, pct)).toFixed(3) * 100;
            _helpers2.default.style(timeTip.el, { left: safePct + '%' });
        }
    }, {
        key: 'hideTimeTooltip',
        value: function hideTimeTooltip() {
            _helpers2.default.removeClass(this.timeTip.el, 'jw-open');
        }
    }, {
        key: 'reset',
        value: function reset() {
            this.resetChapters();
            this.resetThumbnails();
            this.timeTip.resetWidth();
            this.textLength = 0;
        }
    }]);

    return TimeSlider;
}(_slider2.default);

_extends(TimeSlider.prototype, _chapters2.default, _thumbnails2.default);

exports.default = TimeSlider;

/***/ }),
/* 117 */
/*!**************************************************!*\
  !*** ./src/js/view/controls/templates/slider.js ***!
  \**************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    var className = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var orientation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

    return '<div class="' + className + ' ' + orientation + ' jw-reset" aria-hidden="true">' + '<div class="jw-slider-container jw-reset">' + '<div class="jw-rail jw-reset"></div>' + '<div class="jw-buffer jw-reset"></div>' + '<div class="jw-progress jw-reset"></div>' + '<div class="jw-knob jw-reset"></div>' + '</div>' + '</div>';
};

/***/ }),
/* 118 */
/*!***********************************************************!*\
  !*** ./src/js/view/controls/components/chapters.mixin.js ***!
  \***********************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _underscore = __webpack_require__(/*! utils/underscore */ 0);

var _underscore2 = _interopRequireDefault(_underscore);

var _helpers = __webpack_require__(/*! utils/helpers */ 5);

var _helpers2 = _interopRequireDefault(_helpers);

var _srt = __webpack_require__(/*! parsers/captions/srt */ 71);

var _srt2 = _interopRequireDefault(_srt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Cue = function () {
    function Cue(time, text) {
        _classCallCheck(this, Cue);

        this.time = time;
        this.text = text;
        this.el = document.createElement('div');
        this.el.className = 'jw-cue jw-reset';
    }

    _createClass(Cue, [{
        key: 'align',
        value: function align(duration) {
            // If a percentage, use it, else calculate the percentage
            if (this.time.toString().slice(-1) === '%') {
                this.pct = this.time;
            } else {
                var percentage = this.time / duration * 100;
                this.pct = percentage + '%';
            }

            this.el.style.left = this.pct;
        }
    }]);

    return Cue;
}();

var ChaptersMixin = {

    loadChapters: function loadChapters(file) {
        _helpers2.default.ajax(file, this.chaptersLoaded.bind(this), this.chaptersFailed, {
            plainText: true
        });
    },

    chaptersLoaded: function chaptersLoaded(evt) {
        var data = (0, _srt2.default)(evt.responseText);
        if (_underscore2.default.isArray(data)) {
            _underscore2.default.each(data, this.addCue, this);
            this.drawCues();
        }
    },

    chaptersFailed: function chaptersFailed() {},

    addCue: function addCue(obj) {
        this.cues.push(new Cue(obj.begin, obj.text));
    },

    drawCues: function drawCues() {
        var _this = this;

        // We won't want to draw them until we have a duration
        var duration = this._model.get('duration');
        if (!duration || duration <= 0) {
            this._model.once('change:duration', this.drawCues, this);
            return;
        }

        _underscore2.default.each(this.cues, function (cue) {
            cue.align(duration);
            cue.el.addEventListener('mouseover', function () {
                _this.activeCue = cue;
            });
            cue.el.addEventListener('mouseout', function () {
                _this.activeCue = null;
            });
            _this.elementRail.appendChild(cue.el);
        });
    },

    resetChapters: function resetChapters() {
        _underscore2.default.each(this.cues, function (cue) {
            if (cue.el.parentNode) {
                cue.el.parentNode.removeChild(cue.el);
            }
        });
        this.cues = [];
    }
};

exports.default = ChaptersMixin;

/***/ }),
/* 119 */
/*!*************************************************************!*\
  !*** ./src/js/view/controls/components/thumbnails.mixin.js ***!
  \*************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _underscore = __webpack_require__(/*! utils/underscore */ 0);

var _underscore2 = _interopRequireDefault(_underscore);

var _helpers = __webpack_require__(/*! utils/helpers */ 5);

var _helpers2 = _interopRequireDefault(_helpers);

var _srt = __webpack_require__(/*! parsers/captions/srt */ 71);

var _srt2 = _interopRequireDefault(_srt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Thumbnail(obj) {
    this.begin = obj.begin;
    this.end = obj.end;
    this.img = obj.text;
}

var ThumbnailsMixin = {
    loadThumbnails: function loadThumbnails(file) {
        if (!file) {
            return;
        }
        this.vttPath = file.split('?')[0].split('/').slice(0, -1).join('/');
        // Only load the first individual image file so we can get its dimensions. All others are loaded when
        // they're set as background-images.
        this.individualImage = null;
        _helpers2.default.ajax(file, this.thumbnailsLoaded.bind(this), this.thumbnailsFailed.bind(this), {
            plainText: true
        });
    },

    thumbnailsLoaded: function thumbnailsLoaded(evt) {
        var data = (0, _srt2.default)(evt.responseText);
        if (_underscore2.default.isArray(data)) {
            _underscore2.default.each(data, function (obj) {
                this.thumbnails.push(new Thumbnail(obj));
            }, this);
            this.drawCues();
        }
    },

    thumbnailsFailed: function thumbnailsFailed() {},

    chooseThumbnail: function chooseThumbnail(seconds) {
        var idx = _underscore2.default.sortedIndex(this.thumbnails, { end: seconds }, _underscore2.default.property('end'));
        if (idx >= this.thumbnails.length) {
            idx = this.thumbnails.length - 1;
        }
        var url = this.thumbnails[idx].img;
        if (url.indexOf('://') < 0) {
            url = this.vttPath ? this.vttPath + '/' + url : url;
        }

        return url;
    },

    loadThumbnail: function loadThumbnail(seconds) {
        var url = this.chooseThumbnail(seconds);
        var style = {
            margin: '0 auto',
            backgroundPosition: '0 0'
        };

        var hashIndex = url.indexOf('#xywh');
        if (hashIndex > 0) {
            try {
                var matched = /(.+)#xywh=(\d+),(\d+),(\d+),(\d+)/.exec(url);
                url = matched[1];
                style.backgroundPosition = matched[2] * -1 + 'px ' + matched[3] * -1 + 'px';
                style.width = matched[4];
                this.timeTip.setWidth(+style.width);
                style.height = matched[5];
            } catch (e) {
                // this.vttFailed('Could not parse thumbnail');
                return;
            }
        } else if (!this.individualImage) {
            this.individualImage = new Image();
            this.individualImage.onload = _underscore2.default.bind(function () {
                this.individualImage.onload = null;
                this.timeTip.image({ width: this.individualImage.width, height: this.individualImage.height });
                this.timeTip.setWidth(this.individualImage.width);
            }, this);
            this.individualImage.src = url;
        }

        style.backgroundImage = 'url("' + url + '")';

        return style;
    },

    showThumbnail: function showThumbnail(seconds) {
        // Don't attempt to set thumbnail for small players or when a thumbnail doesn't exist
        if (this._model.get('containerWidth') <= 420 || this.thumbnails.length < 1) {
            return;
        }
        this.timeTip.image(this.loadThumbnail(seconds));
    },

    resetThumbnails: function resetThumbnails() {
        this.timeTip.image({
            backgroundImage: '',
            width: 0,
            height: 0
        });
        this.thumbnails = [];
    }
};

exports.default = ThumbnailsMixin;

/***/ }),
/* 120 */
/*!**********************************************************!*\
  !*** ./src/js/view/controls/components/volumetooltip.js ***!
  \**********************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _tooltip = __webpack_require__(/*! view/controls/components/tooltip */ 80);

var _tooltip2 = _interopRequireDefault(_tooltip);

var _slider = __webpack_require__(/*! view/controls/components/slider */ 79);

var _slider2 = _interopRequireDefault(_slider);

var _ui = __webpack_require__(/*! utils/ui */ 67);

var _ui2 = _interopRequireDefault(_ui);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var VolumeTooltip = function (_Tooltip) {
    _inherits(VolumeTooltip, _Tooltip);

    function VolumeTooltip(_model, name, ariaText, svgIcons) {
        _classCallCheck(this, VolumeTooltip);

        var _this = _possibleConstructorReturn(this, (VolumeTooltip.__proto__ || Object.getPrototypeOf(VolumeTooltip)).call(this, name, ariaText, true, svgIcons));

        _this._model = _model;
        _this.volumeSlider = new _slider2.default('jw-slider-volume jw-volume-tip', 'vertical');
        _this.volumeSlider.setup();
        _this.volumeSlider.element().classList.remove('jw-background-color');

        _this.addContent(_this.volumeSlider.element());

        _this.volumeSlider.on('update', function (evt) {
            this.trigger('update', evt);
        }, _this);

        new _ui2.default(_this.el, { useHover: true, directSelect: true, useFocus: true }).on('click enter', _this.toggleValue, _this).on('tap', _this.toggleOpenState, _this).on('over', _this.openTooltip, _this).on('out', _this.closeTooltip, _this);

        _this._model.on('change:volume', _this.onVolume, _this);
        return _this;
    }

    _createClass(VolumeTooltip, [{
        key: 'toggleValue',
        value: function toggleValue() {
            this.trigger('toggleValue');
        }
    }]);

    return VolumeTooltip;
}(_tooltip2.default);

exports.default = VolumeTooltip;

/***/ }),
/* 121 */
/*!***************************************************!*\
  !*** ./src/js/view/controls/display-container.js ***!
  \***************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _displayContainer = __webpack_require__(/*! view/controls/templates/display-container */ 122);

var _displayContainer2 = _interopRequireDefault(_displayContainer);

var _rewindDisplayIcon = __webpack_require__(/*! view/controls/rewind-display-icon */ 124);

var _rewindDisplayIcon2 = _interopRequireDefault(_rewindDisplayIcon);

var _playDisplayIcon = __webpack_require__(/*! view/controls/play-display-icon */ 125);

var _playDisplayIcon2 = _interopRequireDefault(_playDisplayIcon);

var _nextDisplayIcon = __webpack_require__(/*! view/controls/next-display-icon */ 126);

var _nextDisplayIcon2 = _interopRequireDefault(_nextDisplayIcon);

var _icons = __webpack_require__(/*! view/controls/icons */ 68);

var _helpers = __webpack_require__(/*! utils/helpers */ 5);

var _helpers2 = _interopRequireDefault(_helpers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DisplayContainer = function () {
    function DisplayContainer(model, api) {
        _classCallCheck(this, DisplayContainer);

        this.el = _helpers2.default.createElement((0, _displayContainer2.default)(model.get('localization')));

        var container = this.el.querySelector('.jw-display-controls');
        var buttons = {};

        addButton('rewind', (0, _icons.cloneIcons)('rewind'), _rewindDisplayIcon2.default, container, buttons, model, api);
        addButton('display', (0, _icons.cloneIcons)('play,pause,buffer,replay'), _playDisplayIcon2.default, container, buttons, model, api);
        addButton('next', (0, _icons.cloneIcons)('next'), _nextDisplayIcon2.default, container, buttons, model, api);

        this.container = container;
        this.buttons = buttons;
    }

    _createClass(DisplayContainer, [{
        key: 'element',
        value: function element() {
            return this.el;
        }
    }]);

    return DisplayContainer;
}();

exports.default = DisplayContainer;


function addButton(name, iconElements, ButtonClass, container, buttons, model, api) {
    var buttonElement = container.querySelector('.jw-display-icon-' + name);
    var iconContainer = container.querySelector('.jw-icon-' + name);
    iconElements.forEach(function (icon) {
        iconContainer.appendChild(icon);
    });
    buttons[name] = new ButtonClass(model, api, buttonElement);
}

/***/ }),
/* 122 */
/*!*************************************************************!*\
  !*** ./src/js/view/controls/templates/display-container.js ***!
  \*************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _displayIcon = __webpack_require__(/*! view/controls/templates/display-icon */ 123);

var _displayIcon2 = _interopRequireDefault(_displayIcon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (localization) {
    return '<div class="jw-display jw-reset">' + '<div class="jw-display-container jw-reset">' + '<div class="jw-display-controls jw-reset">' + (0, _displayIcon2.default)('rewind', localization.rewind) + (0, _displayIcon2.default)('display', localization.playback) + (0, _displayIcon2.default)('next', localization.next) + '</div>' + '</div>' + '</div>';
};

/***/ }),
/* 123 */
/*!********************************************************!*\
  !*** ./src/js/view/controls/templates/display-icon.js ***!
  \********************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    var iconName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var ariaLabel = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

    return '<div class="jw-display-icon-container jw-display-icon-' + iconName + ' jw-reset">' + ('<div class="jw-icon jw-icon-' + iconName + ' jw-button-color jw-reset" role="button" tabindex="0" aria-label="' + ariaLabel + '"></div>') + '</div>';
};

/***/ }),
/* 124 */
/*!*****************************************************!*\
  !*** ./src/js/view/controls/rewind-display-icon.js ***!
  \*****************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ui = __webpack_require__(/*! utils/ui */ 67);

var _ui2 = _interopRequireDefault(_ui);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RewindDisplayIcon = function () {
    function RewindDisplayIcon(model, api, element) {
        _classCallCheck(this, RewindDisplayIcon);

        this.el = element;

        new _ui2.default(this.el).on('click tap enter', function () {
            var currentPosition = model.get('position');
            var duration = model.get('duration');
            var rewindPosition = currentPosition - 10;
            var startPosition = 0;

            // duration is negative in DVR mode
            if (model.get('streamType') === 'DVR') {
                startPosition = duration;
            }
            // Seek 10s back. Seek value should be >= 0 in VOD mode and >= (negative) duration in DVR mode
            api.seek(Math.max(rewindPosition, startPosition));
        });
    }

    _createClass(RewindDisplayIcon, [{
        key: 'element',
        value: function element() {
            return this.el;
        }
    }]);

    return RewindDisplayIcon;
}();

exports.default = RewindDisplayIcon;

/***/ }),
/* 125 */
/*!***************************************************!*\
  !*** ./src/js/view/controls/play-display-icon.js ***!
  \***************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _backbone = __webpack_require__(/*! utils/backbone.events */ 7);

var _backbone2 = _interopRequireDefault(_backbone);

var _ui = __webpack_require__(/*! utils/ui */ 67);

var _ui2 = _interopRequireDefault(_ui);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PlayDisplayIcon = function () {
    function PlayDisplayIcon(_model, api, element) {
        var _this = this;

        _classCallCheck(this, PlayDisplayIcon);

        _extends(this, _backbone2.default);

        var localization = _model.get('localization');
        var iconDisplay = element.getElementsByClassName('jw-icon-display')[0];
        element.style.cursor = 'pointer';
        this.icon = iconDisplay;
        this.el = element;

        new _ui2.default(this.el).on('click tap enter', function (evt) {
            _this.trigger(evt.type);
        });

        _model.on('change:state', function (model, newstate) {
            var newstateLabel = void 0;
            switch (newstate) {
                case 'buffering':
                    newstateLabel = localization.buffer;
                    break;
                case 'playing':
                    newstateLabel = localization.pause;
                    break;
                case 'paused':
                    newstateLabel = localization.playback;
                    break;
                case 'complete':
                    newstateLabel = localization.replay;
                    break;
                default:
                    newstateLabel = '';
                    break;
            }
            if (newstateLabel === '') {
                iconDisplay.removeAttribute('aria-label');
            } else {
                iconDisplay.setAttribute('aria-label', newstateLabel);
            }
        });
    }

    _createClass(PlayDisplayIcon, [{
        key: 'element',
        value: function element() {
            return this.el;
        }
    }]);

    return PlayDisplayIcon;
}();

exports.default = PlayDisplayIcon;

/***/ }),
/* 126 */
/*!***************************************************!*\
  !*** ./src/js/view/controls/next-display-icon.js ***!
  \***************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ui = __webpack_require__(/*! utils/ui */ 67);

var _ui2 = _interopRequireDefault(_ui);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NextDisplayIcon = function () {
    function NextDisplayIcon(model, api, element) {
        _classCallCheck(this, NextDisplayIcon);

        new _ui2.default(element).on('click tap enter', function () {
            api.next();
        });

        model.change('nextUp', function (nextUpChangeModel, nextUp) {
            element.style.visibility = nextUp ? '' : 'hidden';
        });

        this.el = element;
    }

    _createClass(NextDisplayIcon, [{
        key: 'element',
        value: function element() {
            return this.el;
        }
    }]);

    return NextDisplayIcon;
}();

exports.default = NextDisplayIcon;

/***/ }),
/* 127 */
/*!***********************************************!*\
  !*** ./src/js/view/controls/nextuptooltip.js ***!
  \***********************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _nextup = __webpack_require__(/*! view/controls/templates/nextup */ 128);

var _nextup2 = _interopRequireDefault(_nextup);

var _dom = __webpack_require__(/*! utils/dom */ 21);

var _ui = __webpack_require__(/*! utils/ui */ 67);

var _ui2 = _interopRequireDefault(_ui);

var _backbone = __webpack_require__(/*! utils/backbone.events */ 7);

var _backbone2 = _interopRequireDefault(_backbone);

var _helpers = __webpack_require__(/*! utils/helpers */ 5);

var _helpers2 = _interopRequireDefault(_helpers);

var _icons = __webpack_require__(/*! view/controls/icons */ 68);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NextUpTooltip = function () {
    function NextUpTooltip(_model, _api, playerElement) {
        _classCallCheck(this, NextUpTooltip);

        _extends(this, _backbone2.default);
        this._model = _model;
        this._api = _api;
        this._playerElement = playerElement;
        this.nextUpText = _model.get('localization').nextUp;
        this.nextUpClose = _model.get('localization').nextUpClose;
        this.state = 'tooltip';
        this.enabled = false;
        this.shown = false;
        this.reset();
    }

    _createClass(NextUpTooltip, [{
        key: 'setup',
        value: function setup(context) {
            this.container = context.createElement('div');
            this.container.className = 'jw-nextup-container jw-reset';
            var element = _helpers2.default.createElement((0, _nextup2.default)());
            element.querySelector('.jw-nextup-close').appendChild((0, _icons.cloneIcon)('close'));
            this.addContent(element);

            this.closeButton = this.content.querySelector('.jw-nextup-close');
            this.closeButton.setAttribute('aria-label', this.nextUpClose);
            this.tooltip = this.content.querySelector('.jw-nextup-tooltip');

            var model = this._model;
            // Next Up is hidden until we get a valid NextUp item from the nextUp event
            this.enabled = false;

            // Events
            model.on('change:nextUp', this.onNextUp, this);

            // Listen for duration changes to determine the offset from the end for when next up should be shown
            model.change('duration', this.onDuration, this);
            // Listen for position changes so we can show the tooltip when the offset has been crossed
            model.change('position', this.onElapsed, this);

            model.change('streamType', this.onStreamType, this);
            model.change('mediaModel', this.onMediaModel, this);

            // Close button
            new _ui2.default(this.closeButton, { directSelect: true }).on('click tap enter', function () {
                this.nextUpSticky = false;
                this.toggle(false);
            }, this);
            // Tooltip
            new _ui2.default(this.tooltip).on('click tap', this.click, this);
        }
    }, {
        key: 'loadThumbnail',
        value: function loadThumbnail(url) {
            this.nextUpImage = new Image();
            this.nextUpImage.onload = function () {
                this.nextUpImage.onload = null;
            }.bind(this);
            this.nextUpImage.src = url;

            return {
                backgroundImage: 'url("' + url + '")'
            };
        }
    }, {
        key: 'click',
        value: function click() {
            this.reset();
            this._api.next();
        }
    }, {
        key: 'toggle',
        value: function toggle(show, reason) {
            if (!this.enabled) {
                return;
            }
            (0, _dom.toggleClass)(this.container, 'jw-nextup-sticky', !!this.nextUpSticky);
            if (this.shown !== show) {
                this.shown = show;
                (0, _dom.toggleClass)(this.container, 'jw-nextup-container-visible', show);
                (0, _dom.toggleClass)(this._playerElement, 'jw-flag-nextup', show);
                var nextUp = this._model.get('nextUp');
                if (show && nextUp) {
                    this.trigger('nextShown', {
                        mode: nextUp.mode,
                        ui: 'nextup',
                        itemsShown: [nextUp],
                        feedData: nextUp.feedData,
                        reason: reason
                    });
                }
            }
        }
    }, {
        key: 'setNextUpItem',
        value: function setNextUpItem(nextUpItem) {
            var _this = this;

            // Give the previous item time to complete its animation
            setTimeout(function () {
                // Set thumbnail
                _this.thumbnail = _this.content.querySelector('.jw-nextup-thumbnail');
                (0, _dom.toggleClass)(_this.content, 'jw-nextup-thumbnail-visible', !!nextUpItem.image);
                if (nextUpItem.image) {
                    var thumbnailStyle = _this.loadThumbnail(nextUpItem.image);
                    _helpers2.default.style(_this.thumbnail, thumbnailStyle);
                }

                // Set header
                _this.header = _this.content.querySelector('.jw-nextup-header');
                _this.header.innerText = _this.nextUpText;

                // Set title
                _this.title = _this.content.querySelector('.jw-nextup-title');
                var title = nextUpItem.title;
                _this.title.innerText = title ? _helpers2.default.createElement(title).textContent : '';

                // Set duration
                if (nextUpItem.duration) {
                    _this.duration = _this.content.querySelector('.jw-nextup-duration');
                    var duration = nextUpItem.duration;
                    _this.duration.innerText = duration ? _helpers2.default.createElement(duration).textContent : '';
                }
            }, 500);
        }
    }, {
        key: 'onNextUp',
        value: function onNextUp(model, nextUp) {
            this.reset();
            if (!nextUp) {
                return;
            }

            this.enabled = !!(nextUp.title || nextUp.image);

            if (this.enabled) {
                if (!nextUp.showNextUp) {
                    // The related plugin will countdown the nextUp item
                    this.nextUpSticky = false;
                    this.toggle(false);
                }
                this.setNextUpItem(nextUp);
            }
        }
    }, {
        key: 'onDuration',
        value: function onDuration(model, duration) {
            if (!duration) {
                return;
            }

            // Use nextupoffset if set or default to 10 seconds from the end of playback
            var offset = _helpers2.default.seconds(model.get('nextupoffset') || -10);
            if (offset < 0) {
                // Determine offset from the end. Duration may change.
                offset += duration;
            }

            this.offset = offset;
        }
    }, {
        key: 'onMediaModel',
        value: function onMediaModel(model, mediaModel) {
            mediaModel.change('state', function (stateChangeMediaModel, state) {
                if (state === 'complete') {
                    this.toggle(false);
                }
            }, this);
        }
    }, {
        key: 'onElapsed',
        value: function onElapsed(model, val) {
            var nextUpSticky = this.nextUpSticky;
            if (!this.enabled || nextUpSticky === false) {
                return;
            }
            // Show nextup during VOD streams if:
            // - in playlist mode but not playing an ad
            // - autoplaying in related mode and autoplaytimer is set to 0
            var showUntilEnd = val >= this.offset;
            if (showUntilEnd && nextUpSticky === undefined) {
                // show if nextUpSticky is unset
                this.nextUpSticky = showUntilEnd;
                this.toggle(showUntilEnd, 'time');
            } else if (!showUntilEnd && nextUpSticky) {
                // reset if there was a backward seek
                this.reset();
            }
        }
    }, {
        key: 'onStreamType',
        value: function onStreamType(model, streamType) {
            if (streamType !== 'VOD') {
                this.nextUpSticky = false;
                this.toggle(false);
            }
        }
    }, {
        key: 'element',
        value: function element() {
            return this.container;
        }
    }, {
        key: 'addContent',
        value: function addContent(elem) {
            if (this.content) {
                this.removeContent();
            }
            this.content = elem;
            this.container.appendChild(elem);
        }
    }, {
        key: 'removeContent',
        value: function removeContent() {
            if (this.content) {
                this.container.removeChild(this.content);
                this.content = null;
            }
        }
    }, {
        key: 'reset',
        value: function reset() {
            this.nextUpSticky = undefined;
            this.toggle(false);
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            this.off();
            this._model.off(null, null, this);
        }
    }]);

    return NextUpTooltip;
}();

exports.default = NextUpTooltip;

/***/ }),
/* 128 */
/*!**************************************************!*\
  !*** ./src/js/view/controls/templates/nextup.js ***!
  \**************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    var header = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var title = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    var duration = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
    var closeAriaLabel = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';

    return '<div class="jw-nextup jw-background-color jw-reset">' + '<div class="jw-nextup-tooltip jw-reset">' + '<div class="jw-nextup-thumbnail jw-reset"></div>' + '<div class="jw-nextup-body jw-reset">' + ('<div class="jw-nextup-header jw-reset">' + header + '</div>') + ('<div class="jw-nextup-title jw-reset">' + title + '</div>') + ('<div class="jw-nextup-duration jw-reset">' + duration + '</div>') + '</div>' + '</div>' + ('<button type="button" class="jw-icon jw-nextup-close jw-reset" aria-label="' + closeAriaLabel + '"></button>') + '</div>';
};

/***/ }),
/* 129 */
/*!********************************************!*\
  !*** ./src/js/view/controls/rightclick.js ***!
  \********************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _rightclick = __webpack_require__(/*! view/controls/templates/rightclick */ 130);

var _rightclick2 = _interopRequireDefault(_rightclick);

var _icons = __webpack_require__(/*! view/controls/icons */ 68);

var _version = __webpack_require__(/*! version */ 16);

var _browser = __webpack_require__(/*! utils/browser */ 25);

var _dom = __webpack_require__(/*! utils/dom */ 21);

var _ui = __webpack_require__(/*! utils/ui */ 67);

var _ui2 = _interopRequireDefault(_ui);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function createDomElement(html) {
    var element = (0, _dom.createElement)(html);
    var logoContainer = element.querySelector('.jw-rightclick-logo');
    if (logoContainer) {
        logoContainer.appendChild((0, _icons.cloneIcon)('jwplayer-logo'));
    }
    return element;
}

var RightClick = function () {
    function RightClick() {
        _classCallCheck(this, RightClick);
    }

    _createClass(RightClick, [{
        key: 'buildArray',
        value: function buildArray() {
            var semverParts = _version.version.split('+');
            var majorMinorPatchPre = semverParts[0];

            var menu = {
                items: [{
                    title: 'Powered by <span class="jw-reset">JW Player ' + majorMinorPatchPre + '</span>',
                    featured: true,
                    showLogo: true,
                    link: 'https://jwplayer.com/learn-more'
                }]
            };

            var provider = this.model.get('provider');
            if (provider && provider.name.indexOf('flash') >= 0) {
                var text = 'Flash Version ' + (0, _browser.flashVersion)();
                menu.items.push({
                    title: text,
                    link: 'http://www.adobe.com/software/flash/about/'
                });
            }

            return menu;
        }
    }, {
        key: 'rightClick',
        value: function rightClick(evt) {
            this.lazySetup();

            if (this.mouseOverContext) {
                // right click on menu item should execute it
                return false;
            }

            this.hideMenu();
            this.showMenu(evt);

            return false;
        }
    }, {
        key: 'getOffset',
        value: function getOffset(evt) {
            var playerBounds = (0, _dom.bounds)(this.playerElement);
            var x = evt.pageX - playerBounds.left;
            var y = evt.pageY - playerBounds.top;

            return { x: x, y: y };
        }
    }, {
        key: 'showMenu',
        value: function showMenu(evt) {
            var _this = this;

            // Offset relative to player element
            var off = this.getOffset(evt);

            this.el.style.left = off.x + 'px';
            this.el.style.top = off.y + 'px';

            (0, _dom.addClass)(this.playerElement, 'jw-flag-rightclick-open');
            (0, _dom.addClass)(this.el, 'jw-open');
            clearTimeout(this._menuTimeout);
            this._menuTimeout = setTimeout(function () {
                return _this.hideMenu();
            }, 3000);
            return false;
        }
    }, {
        key: 'hideMenu',
        value: function hideMenu() {
            this.elementUI.off('out', this.hideMenu, this);
            if (this.mouseOverContext) {
                // If mouse is over the menu, hide the menu when mouse moves out
                this.elementUI.on('out', this.hideMenu, this);
                return;
            }
            (0, _dom.removeClass)(this.playerElement, 'jw-flag-rightclick-open');
            (0, _dom.removeClass)(this.el, 'jw-open');
        }
    }, {
        key: 'lazySetup',
        value: function lazySetup() {
            var html = (0, _rightclick2.default)(this.buildArray());
            if (this.el) {
                if (this.html !== html) {
                    this.html = html;
                    var newEl = createDomElement(html);
                    (0, _dom.emptyElement)(this.el);
                    for (var i = newEl.childNodes.length; i--;) {
                        this.el.appendChild(newEl.firstChild);
                    }
                }
                return;
            }

            this.html = html;
            this.el = createDomElement(this.html);

            this.layer.appendChild(this.el);

            this.hideMenuHandler = this.hideMenu.bind(this);
            this.addOffListener(this.playerElement);
            this.addOffListener(document);

            // Track if the mouse is above the menu or not
            this.elementUI = new _ui2.default(this.el, { useHover: true }).on('over', function () {
                this.mouseOverContext = true;
            }, this).on('out', function () {
                this.mouseOverContext = false;
            }, this);
        }
    }, {
        key: 'setup',
        value: function setup(_model, _playerElement, layer) {
            this.playerElement = _playerElement;
            this.model = _model;
            this.mouseOverContext = false;
            this.layer = layer;

            // Defer the rest of setup until the first click
            _playerElement.oncontextmenu = this.rightClick.bind(this);
        }
    }, {
        key: 'addOffListener',
        value: function addOffListener(element) {
            element.addEventListener('mousedown', this.hideMenuHandler);
            element.addEventListener('touchstart', this.hideMenuHandler);
            element.addEventListener('pointerdown', this.hideMenuHandler);
        }
    }, {
        key: 'removeOffListener',
        value: function removeOffListener(element) {
            element.removeEventListener('mousedown', this.hideMenuHandler);
            element.removeEventListener('touchstart', this.hideMenuHandler);
            element.removeEventListener('pointerdown', this.hideMenuHandler);
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            clearTimeout(this._menuTimeout);
            if (this.el) {
                this.hideMenu();
                this.elementUI.off();
                this.removeOffListener(this.playerElement);
                this.removeOffListener(document);
                this.hideMenuHandler = null;
                this.el = null;
            }

            if (this.playerElement) {
                this.playerElement.oncontextmenu = null;
                this.playerElement = null;
            }

            if (this.model) {
                this.model = null;
            }
        }
    }]);

    return RightClick;
}();

exports.default = RightClick;

/***/ }),
/* 130 */
/*!******************************************************!*\
  !*** ./src/js/view/controls/templates/rightclick.js ***!
  \******************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (menu) {
    var _menu$items = menu.items,
        items = _menu$items === undefined ? [] : _menu$items;

    var itemsHtml = items.map(function (item) {
        return rightClickItem(item.link, item.title, item.featured, item.showLogo);
    }).join('');

    return '<div class="jw-rightclick jw-reset">' + ('<ul class="jw-rightclick-list jw-reset">' + itemsHtml + '</ul>') + '</div>';
};

var rightClickItem = function rightClickItem() {
    var link = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var title = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    var featured = arguments[2];
    var showLogo = arguments[3];

    var logo = showLogo ? '<span class="jw-rightclick-logo jw-reset"></span>' : '';
    return '<li class="jw-reset jw-rightclick-item ' + (featured ? 'jw-featured' : '') + '">' + ('<a href="' + link + '" class="jw-rightclick-link jw-reset" target="_blank">' + logo + title + '</a>') + '</li>';
};

/***/ }),
/* 131 */
/*!***********************************************!*\
  !*** ./src/js/view/controls/settings-menu.js ***!
  \***********************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createSettingsMenu = createSettingsMenu;
exports.setupSubmenuListeners = setupSubmenuListeners;

var _menu = __webpack_require__(/*! view/controls/components/settings/menu */ 132);

var _submenuFactory = __webpack_require__(/*! view/utils/submenu-factory */ 134);

function createSettingsMenu(controlbar, onVisibility) {
    var settingsButton = controlbar.elements.settingsButton;
    var onSubmenuAdded = function onSubmenuAdded() {
        settingsButton.show();
    };
    var onMenuEmpty = function onMenuEmpty() {
        settingsButton.hide();
    };

    var settingsMenu = (0, _menu.SettingsMenu)(onVisibility, onSubmenuAdded, onMenuEmpty);

    controlbar.on('settingsInteraction', function (submenuName, isDefault, event) {
        var submenu = settingsMenu.getSubmenu(submenuName);
        if (!submenu && !isDefault) {
            // Do nothing if activating an invalid submenu
            // An invalid submenu is one which does not exist
            // The default submenu may not exist, but this case has defined behavior
            return;
        }

        if (settingsMenu.visible) {
            if (isDefault || submenu.active) {
                // Close the submenu if clicking the default button (the gear) or if we're already at that submenu
                settingsMenu.close();
            } else {
                // Tab to the newly activated submenu
                settingsMenu.activateSubmenu(submenuName);
            }
        } else {
            if (submenu) {
                // Activate the selected submenu
                settingsMenu.activateSubmenu(submenuName);
            } else {
                // Activate the first submenu if clicking the default button
                settingsMenu.activateFirstSubmenu();
            }
            settingsMenu.open(isDefault, event);
        }
    });

    return settingsMenu;
}

function setupSubmenuListeners(settingsMenu, controlbar, model, api) {
    var _this = this;

    var activateSubmenuItem = function activateSubmenuItem(submenuName, itemIndex) {
        var submenu = settingsMenu.getSubmenu(submenuName);
        if (submenu) {
            submenu.activateItem(itemIndex);
        }
    };

    var onAudiotracksChanged = function onAudiotracksChanged(mediaModel, changedModel, audioTracks) {
        if (!audioTracks || audioTracks.length <= 1) {
            (0, _submenuFactory.removeAudioTracksSubmenu)(settingsMenu);
            return;
        }

        (0, _submenuFactory.addAudioTracksSubmenu)(settingsMenu, audioTracks, model.getVideo().setCurrentAudioTrack.bind(model.getVideo()), mediaModel.get('currentAudioTrack'), model.get('localization').audioTracks);
    };

    var onQualitiesChanged = function onQualitiesChanged(changedModel, levels) {
        if (!levels || levels.length <= 1) {
            (0, _submenuFactory.removeQualitiesSubmenu)(settingsMenu);
            return;
        }

        (0, _submenuFactory.addQualitiesSubmenu)(settingsMenu, levels, model.getVideo().setCurrentQuality.bind(model.getVideo()), changedModel.get('currentLevel'), model.get('localization').hd);
    };

    var onCaptionsChanged = function onCaptionsChanged(changedModel, captionsList) {
        var controlbarButton = controlbar.elements.captionsButton;
        if (!captionsList || captionsList.length <= 1) {
            (0, _submenuFactory.removeCaptionsSubmenu)(settingsMenu);
            controlbarButton.hide();
            return;
        }

        (0, _submenuFactory.addCaptionsSubmenu)(settingsMenu, captionsList, api.setCurrentCaptions.bind(_this), model.get('captionsIndex'), model.get('localization').cc);
        controlbar.toggleCaptionsButtonState(!!model.get('captionsIndex'));
        controlbarButton.show();
    };

    var setupPlaybackRatesMenu = function setupPlaybackRatesMenu(changedModel, playbackRates) {
        var provider = model.getVideo();
        var showPlaybackRateControls = provider && provider.supportsPlaybackRate && model.get('streamType') !== 'LIVE' && model.get('playbackRateControls') && playbackRates.length > 1;

        if (!showPlaybackRateControls) {
            (0, _submenuFactory.removePlaybackRatesSubmenu)(settingsMenu);
            return;
        }

        (0, _submenuFactory.addPlaybackRatesSubmenu)(settingsMenu, playbackRates, model.setPlaybackRate.bind(model), model.get('playbackRate'), model.get('localization').playbackRates);
    };

    model.change('mediaModel', function (newModel, mediaModel) {
        // Quality Levels
        mediaModel.change('levels', onQualitiesChanged, _this);
        mediaModel.on('change:currentLevel', function (changedModel, currentQuality) {
            activateSubmenuItem('quality', currentQuality);
        }, _this);

        // Audio Tracks
        mediaModel.change('audioTracks', onAudiotracksChanged.bind(_this, mediaModel), _this);
        mediaModel.on('change:currentAudioTrack', function (changedModel, currentAudioTrack) {
            activateSubmenuItem('audioTracks', currentAudioTrack);
        }, _this);
    }, this);

    // Captions
    model.change('captionsList', onCaptionsChanged, this);
    model.change('captionsIndex', function (changedModel, index) {
        var captionsSubmenu = settingsMenu.getSubmenu('captions');
        if (captionsSubmenu) {
            captionsSubmenu.activateItem(index);
            controlbar.toggleCaptionsButtonState(!!index);
        }
    }, this);

    // Playback Rates
    model.change('playbackRates', setupPlaybackRatesMenu, this);
    model.change('playbackRate', function (changedModel, playbackRate) {
        var rates = model.get('playbackRates');
        if (rates) {
            activateSubmenuItem('playbackRates', rates.indexOf(playbackRate));
        }
    }, this);

    // Remove the audio tracks, qualities, and playback rates submenus when casting
    model.on('change:castActive', function (changedModel, active, previousState) {
        if (active === previousState) {
            return;
        }

        if (active) {
            (0, _submenuFactory.removeAudioTracksSubmenu)(settingsMenu);
            (0, _submenuFactory.removeQualitiesSubmenu)(settingsMenu);
            (0, _submenuFactory.removePlaybackRatesSubmenu)(settingsMenu);
        } else {
            var mediaModel = model.get('mediaModel');
            onAudiotracksChanged(mediaModel, mediaModel, mediaModel.get('audioTracks'));
            onQualitiesChanged(model, mediaModel.get('levels'));
            setupPlaybackRatesMenu(model, model.get('playbackRates'));
        }
    });

    model.on('change:streamType', function () {
        setupPlaybackRatesMenu(model, model.get('playbackRates'));
    });
}

/***/ }),
/* 132 */
/*!**********************************************************!*\
  !*** ./src/js/view/controls/components/settings/menu.js ***!
  \**********************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SettingsMenu = SettingsMenu;

var _icons = __webpack_require__(/*! view/controls/icons */ 68);

var _button = __webpack_require__(/*! view/controls/components/button */ 69);

var _button2 = _interopRequireDefault(_button);

var _menu = __webpack_require__(/*! view/controls/templates/settings/menu */ 133);

var _menu2 = _interopRequireDefault(_menu);

var _dom = __webpack_require__(/*! utils/dom */ 21);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function SettingsMenu(onVisibility, onSubmenuAdded, onMenuEmpty) {
    var documentClickHandler = function documentClickHandler(e) {
        // Close if anything other than the settings menu has been clicked
        // Let the display (jw-video) handles closing itself (display clicks do not pause if the menu is open)
        // Don't close if the user has dismissed the nextup tooltip via it's close button (the tooltip overlays the menu)
        var targetClass = e.target.className;
        if (!targetClass.match(/jw-(settings|video|nextup-close|sharing-link)/)) {
            instance.close();
        }
    };

    var visible = void 0;
    var active = null;
    var submenus = {};

    var settingsMenuElement = (0, _dom.createElement)((0, _menu2.default)());

    var closeOnEnter = function closeOnEnter(evt) {
        if (evt && evt.keyCode === 27) {
            instance.close(evt);
            evt.stopPropagation();
        }
    };
    settingsMenuElement.addEventListener('keydown', closeOnEnter);

    var closeButton = (0, _button2.default)('jw-settings-close', function () {
        instance.close();
    }, 'Close Settings', [(0, _icons.cloneIcon)('close')]);

    var closeOnButton = function closeOnButton(evt) {
        // Close settings menu when enter is pressed on the close button
        // or when tab key is pressed since it is the last element in topbar
        if (evt.keyCode === 13 || evt.keyCode === 9 && !evt.shiftKey) {
            instance.close(evt);
        }
    };
    closeButton.show();
    closeButton.element().addEventListener('keydown', closeOnButton);

    var topbarElement = settingsMenuElement.querySelector('.jw-settings-topbar');
    topbarElement.appendChild(closeButton.element());

    var instance = {
        open: function open(isDefault, event) {
            visible = true;
            onVisibility(visible, event);
            settingsMenuElement.setAttribute('aria-expanded', 'true');
            addDocumentListeners(documentClickHandler);

            if (isDefault) {
                if (event && event.type === 'enter') {
                    active.categoryButtonElement.focus();
                }
            } else {
                active.element().firstChild.focus();
            }
        },
        close: function close(event) {
            visible = false;
            onVisibility(visible, event);

            active = null;
            deactivateAllSubmenus(submenus);

            settingsMenuElement.setAttribute('aria-expanded', 'false');
            removeDocumentListeners(documentClickHandler);
        },
        toggle: function toggle() {
            if (visible) {
                this.close();
            } else {
                this.open();
            }
        },
        addSubmenu: function addSubmenu(submenu) {
            if (!submenu) {
                return;
            }
            var name = submenu.name;
            submenus[name] = submenu;

            if (submenu.isDefault) {
                (0, _dom.prependChild)(topbarElement, submenu.categoryButtonElement);
                submenu.categoryButtonElement.addEventListener('keydown', function (evt) {
                    // close settings menu if you shift-tab on the first category button element
                    if (evt.keyCode === 9 && evt.shiftKey) {
                        instance.close(evt);
                    }
                });
            } else {
                // sharing should always be the last submenu
                var sharingButton = topbarElement.querySelector('.jw-submenu-sharing');
                topbarElement.insertBefore(submenu.categoryButtonElement, sharingButton || closeButton.element());
            }

            settingsMenuElement.appendChild(submenu.element());

            onSubmenuAdded();
        },
        getSubmenu: function getSubmenu(name) {
            return submenus[name];
        },
        removeSubmenu: function removeSubmenu(name) {
            var submenu = submenus[name];
            if (!submenu || submenu.element().parentNode !== settingsMenuElement) {
                return;
            }
            settingsMenuElement.removeChild(submenu.element());
            topbarElement.removeChild(submenu.categoryButtonElement);
            submenu.destroy();
            delete submenus[name];

            if (!Object.keys(submenus).length) {
                this.close();
                onMenuEmpty();
            }
        },
        activateSubmenu: function activateSubmenu(name) {
            var submenu = submenus[name];
            if (!submenu || submenu.active) {
                return;
            }

            deactivateAllSubmenus(submenus);
            submenu.activate();
            active = submenu;

            if (!submenu.isDefault) {
                active.element().firstChild.focus();
            }
        },
        activateFirstSubmenu: function activateFirstSubmenu() {
            var firstSubmenuName = Object.keys(submenus)[0];
            this.activateSubmenu(firstSubmenuName);
        },
        element: function element() {
            return settingsMenuElement;
        },
        destroy: function destroy() {
            this.close();
            settingsMenuElement.removeEventListener('keydown', closeOnEnter);
            closeButton.element().removeEventListener('keydown', closeOnButton);
            (0, _dom.emptyElement)(settingsMenuElement);
        }
    };

    Object.defineProperties(instance, {
        visible: {
            enumerable: true,
            get: function get() {
                return visible;
            }
        }
    });

    return instance;
}

var addDocumentListeners = function addDocumentListeners(handler) {
    document.addEventListener('mouseup', handler);
    document.addEventListener('pointerup', handler);
    document.addEventListener('touchstart', handler);
};

var removeDocumentListeners = function removeDocumentListeners(handler) {
    document.removeEventListener('mouseup', handler);
    document.removeEventListener('pointerup', handler);
    document.removeEventListener('touchstart', handler);
};

var deactivateAllSubmenus = function deactivateAllSubmenus(submenus) {
    Object.keys(submenus).forEach(function (name) {
        submenus[name].deactivate();
    });
};

/***/ }),
/* 133 */
/*!*********************************************************!*\
  !*** ./src/js/view/controls/templates/settings/menu.js ***!
  \*********************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    return "<div class=\"jw-reset jw-settings-menu\" role=\"menu\" aria-expanded=\"false\">" + "<div class=\"jw-reset jw-settings-topbar\" role=\"menubar\">" + "</div>" + "</div>";
};

/***/ }),
/* 134 */
/*!**********************************************!*\
  !*** ./src/js/view/utils/submenu-factory.js ***!
  \**********************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.makeSubmenu = undefined;
exports.addCaptionsSubmenu = addCaptionsSubmenu;
exports.removeCaptionsSubmenu = removeCaptionsSubmenu;
exports.addAudioTracksSubmenu = addAudioTracksSubmenu;
exports.removeAudioTracksSubmenu = removeAudioTracksSubmenu;
exports.addQualitiesSubmenu = addQualitiesSubmenu;
exports.removeQualitiesSubmenu = removeQualitiesSubmenu;
exports.addPlaybackRatesSubmenu = addPlaybackRatesSubmenu;
exports.removePlaybackRatesSubmenu = removePlaybackRatesSubmenu;

var _icons = __webpack_require__(/*! view/controls/icons */ 68);

var _submenu = __webpack_require__(/*! view/controls/components/settings/submenu */ 135);

var _submenu2 = _interopRequireDefault(_submenu);

var _contentItem = __webpack_require__(/*! view/controls/components/settings/content-item */ 137);

var _contentItem2 = _interopRequireDefault(_contentItem);

var _button = __webpack_require__(/*! view/controls/components/button */ 69);

var _button2 = _interopRequireDefault(_button);

var _simpleTooltip = __webpack_require__(/*! view/controls/components/simple-tooltip */ 81);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AUDIO_TRACKS_SUBMENU = 'audioTracks';
var CAPTIONS_SUBMENU = 'captions';
var QUALITIES_SUBMENU = 'quality';
var PLAYBACK_RATE_SUBMENU = 'playbackRates';
var DEFAULT_SUBMENU = QUALITIES_SUBMENU;

var makeSubmenu = exports.makeSubmenu = function makeSubmenu(settingsMenu, name, contentItems, icon, tooltipText) {
    var submenu = settingsMenu.getSubmenu(name);
    if (submenu) {
        submenu.replaceContent(contentItems);
    } else {
        var categoryButton = (0, _button2.default)('jw-settings-' + name, function () {
            settingsMenu.activateSubmenu(name);
            submenu.element().children[0].focus();
        }, name, [icon]);
        var categoryButtonElement = categoryButton.element();
        categoryButtonElement.setAttribute('role', 'menuitemradio');
        categoryButtonElement.setAttribute('aria-checked', 'false');

        // Qualities submenu is the default submenu
        submenu = (0, _submenu2.default)(name, categoryButton, name === DEFAULT_SUBMENU);
        submenu.addContent(contentItems);
        if (!('ontouchstart' in window)) {
            (0, _simpleTooltip.SimpleTooltip)(categoryButtonElement, name, tooltipText);
        }
        settingsMenu.addSubmenu(submenu);
    }

    return submenu;
};

function addCaptionsSubmenu(settingsMenu, captionsList, action, initialSelectionIndex, tooltipText) {
    var captionsContentItems = captionsList.map(function (track, index) {
        var contentItemElement = (0, _contentItem2.default)(track.id, track.label, function (evt) {
            action(index);
            settingsMenu.close(evt);
        });

        return contentItemElement;
    });

    var captionsSubmenu = makeSubmenu(settingsMenu, CAPTIONS_SUBMENU, captionsContentItems, (0, _icons.cloneIcon)('cc-off'), tooltipText);
    captionsSubmenu.activateItem(initialSelectionIndex);
}

function removeCaptionsSubmenu(settingsMenu) {
    settingsMenu.removeSubmenu(CAPTIONS_SUBMENU);
}

function addAudioTracksSubmenu(settingsMenu, audioTracksList, action, initialSelectionIndex, tooltipText) {
    var audioTracksItems = audioTracksList.map(function (track, index) {
        return (0, _contentItem2.default)(track.name, track.name, function (evt) {
            action(index);
            settingsMenu.close(evt);
        });
    });

    var audioTracksSubmenu = makeSubmenu(settingsMenu, AUDIO_TRACKS_SUBMENU, audioTracksItems, (0, _icons.cloneIcon)('audio-tracks'), tooltipText);
    audioTracksSubmenu.activateItem(initialSelectionIndex);
}

function removeAudioTracksSubmenu(settingsMenu) {
    settingsMenu.removeSubmenu(AUDIO_TRACKS_SUBMENU);
}

function addQualitiesSubmenu(settingsMenu, qualitiesList, action, initialSelectionIndex, tooltipText) {
    var qualitiesItems = qualitiesList.map(function (track, index) {
        return (0, _contentItem2.default)(track.label, track.label, function (evt) {
            action(index);
            settingsMenu.close(evt);
        });
    });

    var qualitiesSubmenu = makeSubmenu(settingsMenu, QUALITIES_SUBMENU, qualitiesItems, (0, _icons.cloneIcon)('quality-100'), tooltipText);
    qualitiesSubmenu.activateItem(initialSelectionIndex);
}

function removeQualitiesSubmenu(settingsMenu) {
    settingsMenu.removeSubmenu(QUALITIES_SUBMENU);
}

function addPlaybackRatesSubmenu(settingsMenu, rateList, action, initialSelectionIndex, tooltipText) {
    var rateItems = rateList.map(function (playbackRate) {
        return (0, _contentItem2.default)(playbackRate, playbackRate + 'x', function (evt) {
            action(playbackRate);
            settingsMenu.close(evt);
        });
    });

    var playbackRatesSubmenu = makeSubmenu(settingsMenu, PLAYBACK_RATE_SUBMENU, rateItems, (0, _icons.cloneIcon)('playback-rate'), tooltipText);
    playbackRatesSubmenu.activateItem(initialSelectionIndex);
}

function removePlaybackRatesSubmenu(settingsMenu) {
    settingsMenu.removeSubmenu(PLAYBACK_RATE_SUBMENU);
}

/***/ }),
/* 135 */
/*!*************************************************************!*\
  !*** ./src/js/view/controls/components/settings/submenu.js ***!
  \*************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = SettingsSubmenu;

var _submenu = __webpack_require__(/*! view/controls/templates/settings/submenu */ 136);

var _submenu2 = _interopRequireDefault(_submenu);

var _dom = __webpack_require__(/*! utils/dom */ 21);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function SettingsSubmenu(name, categoryButton, isDefault) {

    var active = void 0;
    var contentItems = [];
    var submenuElement = (0, _dom.createElement)((0, _submenu2.default)(name));
    var categoryButtonElement = categoryButton.element();

    categoryButtonElement.setAttribute('name', name);
    categoryButtonElement.className += ' jw-submenu-' + name;
    categoryButton.show();

    // return focus to topbar element when tabbing after the first or last item
    var onFocus = function onFocus(evt) {
        var focus = categoryButtonElement && evt.keyCode === 9 && (evt.srcElement === contentItems[0].element() && evt.shiftKey || evt.srcElement === contentItems[contentItems.length - 1].element() && !evt.shiftKey);

        if (focus) {
            categoryButtonElement.focus();
        }
    };

    var instance = {
        addContent: function addContent(items) {
            if (!items) {
                return;
            }
            items.forEach(function (item) {
                submenuElement.appendChild(item.element());
            });

            contentItems = items;

            contentItems[0].element().addEventListener('keydown', onFocus);
            contentItems[contentItems.length - 1].element().addEventListener('keydown', onFocus);
        },
        replaceContent: function replaceContent(items) {
            instance.removeContent();
            this.addContent(items);
        },
        removeContent: function removeContent() {
            contentItems[0].element().removeEventListener('keydown', onFocus);
            contentItems[contentItems.length - 1].element().removeEventListener('keydown', onFocus);

            (0, _dom.emptyElement)(submenuElement);
            contentItems = [];
        },
        activate: function activate() {
            (0, _dom.toggleClass)(submenuElement, 'jw-settings-submenu-active', true);
            submenuElement.setAttribute('aria-expanded', 'true');
            categoryButtonElement.setAttribute('aria-checked', 'true');
            active = true;
        },
        deactivate: function deactivate() {
            (0, _dom.toggleClass)(submenuElement, 'jw-settings-submenu-active', false);
            submenuElement.setAttribute('aria-expanded', 'false');
            categoryButtonElement.setAttribute('aria-checked', 'false');
            active = false;
        },
        activateItem: function activateItem() {
            var itemOrdinal = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

            var item = contentItems[itemOrdinal];
            if (!item || item.active) {
                return;
            }
            deactivateAllItems(contentItems);
            item.activate();
        },
        element: function element() {
            return submenuElement;
        },
        destroy: function destroy() {
            if (!contentItems) {
                return;
            }
            contentItems.forEach(function (item) {
                item.destroy();
            });
            this.removeContent();
        }
    };

    Object.defineProperties(instance, {
        name: {
            enumerable: true,
            get: function get() {
                return name;
            }
        },
        active: {
            enumerable: true,
            get: function get() {
                return active;
            }
        },
        categoryButtonElement: {
            enumerable: true,
            get: function get() {
                return categoryButtonElement;
            }
        },
        isDefault: {
            enumerable: true,
            get: function get() {
                return isDefault;
            }
        }
    });

    return instance;
}

var deactivateAllItems = function deactivateAllItems(items) {
    items.forEach(function (item) {
        item.deactivate();
    });
};

/***/ }),
/* 136 */
/*!************************************************************!*\
  !*** ./src/js/view/controls/templates/settings/submenu.js ***!
  \************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    return "<div class=\"jw-reset jw-settings-submenu\" role=\"menu\" aria-expanded=\"false\">" + "</div>";
};

/***/ }),
/* 137 */
/*!******************************************************************!*\
  !*** ./src/js/view/controls/components/settings/content-item.js ***!
  \******************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = SettingsContentItem;

var _contentItem = __webpack_require__(/*! view/controls/templates/settings/content-item */ 138);

var _contentItem2 = _interopRequireDefault(_contentItem);

var _dom = __webpack_require__(/*! utils/dom */ 21);

var _ui = __webpack_require__(/*! utils/ui */ 67);

var _ui2 = _interopRequireDefault(_ui);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function SettingsContentItem(name, content, action) {
    var active = void 0;
    var contentItemElement = (0, _dom.createElement)((0, _contentItem2.default)(content));
    var contentItemUI = new _ui2.default(contentItemElement);
    contentItemUI.on('click tap enter', function (evt) {
        action(evt);
    });

    var instance = {
        activate: function activate() {
            (0, _dom.toggleClass)(contentItemElement, 'jw-settings-item-active', true);
            contentItemElement.setAttribute('aria-checked', 'true');
            active = true;
        },
        deactivate: function deactivate() {
            (0, _dom.toggleClass)(contentItemElement, 'jw-settings-item-active', false);
            contentItemElement.setAttribute('aria-checked', 'false');
            active = false;
        },
        element: function element() {
            return contentItemElement;
        },
        uiElement: function uiElement() {
            return contentItemUI;
        },
        destroy: function destroy() {
            this.deactivate();
            contentItemUI.destroy();
        }
    };

    Object.defineProperty(instance, 'active', {
        enumerable: true,
        get: function get() {
            return active;
        }
    });

    return instance;
}

/***/ }),
/* 138 */
/*!*****************************************************************!*\
  !*** ./src/js/view/controls/templates/settings/content-item.js ***!
  \*****************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (content) {
    return "<button type=\"button\" class=\"jw-reset jw-settings-content-item\" role=\"menuitemradio\" aria-checked=\"false\">" + ("" + content) + "</button>";
};

/***/ }),
/* 139 */
/*!*******************************!*\
  !*** ./src/css/controls.less ***!
  \*******************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(/*! !../../node_modules/css-loader!../../node_modules/postcss-loader/lib!../../node_modules/less-loader/dist/cjs.js??ref--0-3!./controls.less */ 140);
if(typeof content === 'string') content = [['all-players', content, '']];
// add the styles to the DOM
__webpack_require__(/*! ../../node_modules/simple-style-loader/addStyles.js */ 33).style(content,'all-players');
if(content.locals) module.exports = content.locals;

/***/ }),
/* 140 */
/*!****************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader!./node_modules/postcss-loader/lib!./node_modules/less-loader/dist/cjs.js?{"compress":true,"strictMath":true,"noIeCompat":true}!./src/css/controls.less ***!
  \****************************************************************************************************************************************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../node_modules/css-loader/lib/css-base.js */ 77)(undefined);
// imports


// module
exports.push([module.i, ".jw-overlays,.jw-controls,.jw-controls-backdrop,.jw-settings-submenu{height:100%;width:100%}.jw-settings-menu .jw-icon::after,.jw-icon-settings::after,.jw-icon-volume::after,.jw-settings-menu .jw-icon.jw-button-color::after{position:absolute;right:0}.jw-overlays,.jw-controls,.jw-controls-backdrop{top:0;position:absolute;left:0}.jw-settings-menu .jw-icon::after,.jw-icon-settings::after,.jw-icon-volume::after,.jw-settings-menu .jw-icon.jw-button-color::after{position:absolute;bottom:0;left:0}.jw-nextup-close{position:absolute;top:0;right:0}.jw-overlays,.jw-controls{position:absolute;bottom:0;right:0}.jw-settings-menu .jw-icon::after,.jw-icon-settings::after,.jw-icon-volume::after,.jw-time-tip::after,.jw-settings-menu .jw-icon.jw-button-color::after,.jw-controlbar .jw-tooltip::after,.jw-settings-menu .jw-tooltip::after{content:\"\";display:block}.jw-svg-icon{height:24px;width:24px;fill:currentColor;pointer-events:none}.jw-icon{height:44px;width:44px;background-color:transparent}.jw-icon-airplay .jw-svg-icon-airplay-off{display:none}.jw-off.jw-icon-airplay .jw-svg-icon-airplay-off{display:block}.jw-icon-airplay .jw-svg-icon-airplay-on{display:block}.jw-off.jw-icon-airplay .jw-svg-icon-airplay-on{display:none}.jw-icon-cc .jw-svg-icon-cc-off{display:none}.jw-off.jw-icon-cc .jw-svg-icon-cc-off{display:block}.jw-icon-cc .jw-svg-icon-cc-on{display:block}.jw-off.jw-icon-cc .jw-svg-icon-cc-on{display:none}.jw-icon-fullscreen .jw-svg-icon-fullscreen-off{display:none}.jw-off.jw-icon-fullscreen .jw-svg-icon-fullscreen-off{display:block}.jw-icon-fullscreen .jw-svg-icon-fullscreen-on{display:block}.jw-off.jw-icon-fullscreen .jw-svg-icon-fullscreen-on{display:none}.jw-icon-volume .jw-svg-icon-volume-0{display:none}.jw-off.jw-icon-volume .jw-svg-icon-volume-0{display:block}.jw-icon-volume .jw-svg-icon-volume-100{display:none}.jw-full.jw-icon-volume .jw-svg-icon-volume-100{display:block}.jw-icon-volume .jw-svg-icon-volume-50{display:block}.jw-off.jw-icon-volume .jw-svg-icon-volume-50,.jw-full.jw-icon-volume .jw-svg-icon-volume-50{display:none}.jw-icon-live .jw-svg-icon-dvr,.jw-icon-live .jw-svg-icon-live{width:44px}.jw-icon-live.jw-dvr-live .jw-svg-icon-dvr{display:none}.jw-settings-menu .jw-icon::after,.jw-icon-settings::after,.jw-icon-volume::after{height:100%;width:24px;box-shadow:inset 0 -3px 0 -1px currentColor;margin:auto;opacity:0;transition:opacity 150ms cubic-bezier(0, -0.25, .25, 1)}.jw-settings-menu .jw-icon[aria-checked=\"true\"]::after,.jw-settings-open .jw-icon-settings::after,.jw-icon-volume.jw-open::after{opacity:1}.jw-overlays,.jw-controls{pointer-events:none}.jw-controls-backdrop{display:block;background:linear-gradient(to bottom, transparent, rgba(0,0,0,0.4) 77%, rgba(0,0,0,0.4) 100%) 100% 100% / 100% 240px no-repeat transparent;transition:opacity 250ms cubic-bezier(0, -0.25, .25, 1),background-size 250ms cubic-bezier(0, -0.25, .25, 1);pointer-events:none}.jw-overlays{cursor:auto}.jw-controls{overflow:hidden}.jw-flag-small-player .jw-controls{text-align:center}.jw-text{height:1em;font-family:Arial,Helvetica,sans-serif;font-size:.75em;font-style:normal;font-weight:normal;color:#fff;text-align:center;font-variant:normal;font-stretch:normal}.jw-controlbar,.jw-skip,.jw-display-icon-container,.jw-display-icon-container .jw-icon,.jw-nextup-container,.jw-autostart-mute,.jw-overlays .jw-plugin{pointer-events:all}.jwplayer .jw-display-icon-container,.jw-error .jw-display-icon-container{width:auto;height:auto;box-sizing:content-box}.jw-display{display:table;height:100%;padding:57px 0;position:relative;width:100%}.jw-flag-dragging .jw-display{display:none}.jw-state-idle:not(.jw-flag-cast-available) .jw-display{padding:0}.jw-display-container{display:table-cell;height:100%;text-align:center;vertical-align:middle}.jw-display-controls{display:inline-block}.jwplayer .jw-display-icon-container{float:left}.jw-display-icon-container{display:inline-block}.jw-display-icon-container .jw-icon{height:75px;width:75px;cursor:pointer;display:flex;justify-content:center;align-items:center}.jw-display-icon-container .jw-icon .jw-svg-icon{height:33px;width:33px;padding:0;position:relative}.jw-display-icon-container .jw-icon .jw-svg-icon-rewind{padding:.2em .05em}.jw-breakpoint-0 .jw-display-icon-next,.jw-breakpoint-0 .jw-display-icon-rewind{display:none}.jw-breakpoint-0 .jw-display .jw-icon,.jw-breakpoint-0 .jw-display .jw-svg-icon{width:44px;height:44px;line-height:44px}.jw-breakpoint-0 .jw-display .jw-icon:before,.jw-breakpoint-0 .jw-display .jw-svg-icon:before{width:22px;height:22px}.jw-breakpoint-1 .jw-display-icon-container{padding:5.5px;margin:0 22px}.jw-breakpoint-1 .jw-display .jw-icon,.jw-breakpoint-1 .jw-display .jw-svg-icon{width:44px;height:44px;line-height:44px}.jw-breakpoint-1 .jw-display .jw-icon:before,.jw-breakpoint-1 .jw-display .jw-svg-icon:before{width:22px;height:22px}.jw-breakpoint-1 .jw-display .jw-icon.jw-icon-rewind:before{width:33px;height:33px}.jw-breakpoint-2 .jw-display .jw-icon,.jw-breakpoint-3 .jw-display .jw-icon,.jw-breakpoint-2 .jw-display .jw-svg-icon,.jw-breakpoint-3 .jw-display .jw-svg-icon{width:77px;height:77px;line-height:77px}.jw-breakpoint-2 .jw-display .jw-icon:before,.jw-breakpoint-3 .jw-display .jw-icon:before,.jw-breakpoint-2 .jw-display .jw-svg-icon:before,.jw-breakpoint-3 .jw-display .jw-svg-icon:before{width:38.5px;height:38.5px}.jw-breakpoint-4 .jw-display .jw-icon,.jw-breakpoint-5 .jw-display .jw-icon,.jw-breakpoint-6 .jw-display .jw-icon,.jw-breakpoint-7 .jw-display .jw-icon,.jw-breakpoint-4 .jw-display .jw-svg-icon,.jw-breakpoint-5 .jw-display .jw-svg-icon,.jw-breakpoint-6 .jw-display .jw-svg-icon,.jw-breakpoint-7 .jw-display .jw-svg-icon{width:88px;height:88px;line-height:88px}.jw-breakpoint-4 .jw-display .jw-icon:before,.jw-breakpoint-5 .jw-display .jw-icon:before,.jw-breakpoint-6 .jw-display .jw-icon:before,.jw-breakpoint-7 .jw-display .jw-icon:before,.jw-breakpoint-4 .jw-display .jw-svg-icon:before,.jw-breakpoint-5 .jw-display .jw-svg-icon:before,.jw-breakpoint-6 .jw-display .jw-svg-icon:before,.jw-breakpoint-7 .jw-display .jw-svg-icon:before{width:44px;height:44px}.jw-controlbar{display:flex;flex-flow:row wrap;align-items:center;justify-content:center;position:absolute;left:0;bottom:0;width:100%;border:none;border-radius:0;background-size:auto;box-shadow:none;max-height:72px;transition:250ms cubic-bezier(0, -0.25, .25, 1);transition-property:opacity,visibility;transition-delay:0s}.jw-controlbar .jw-button-image{background:no-repeat 50% 50%;background-size:contain;max-height:24px}.jw-controlbar .jw-spacer{flex:1 1 auto;align-self:stretch}.jw-controlbar .jw-icon.jw-button-color:hover{color:#fff}.jw-button-container{display:flex;flex-flow:row nowrap;flex:1 1 auto;align-items:center;justify-content:center;width:100%;padding:0 12px}.jw-slider-horizontal{background-color:transparent}.jw-icon-inline{position:relative}.jw-icon-inline,.jw-icon-tooltip{height:44px;width:44px;align-items:center;display:flex;justify-content:center}.jw-icon-inline:not(.jw-text),.jw-icon-tooltip,.jw-slider-horizontal{cursor:pointer}.jw-text-elapsed,.jw-text-duration{justify-content:flex-start;width:-webkit-fit-content;width:-moz-fit-content;width:fit-content}.jw-icon-tooltip{position:relative}.jw-knob:hover,.jw-icon-inline:hover,.jw-icon-tooltip:hover,.jw-icon-display:hover,.jw-option:before:hover{color:#fff}.jw-time-tip,.jw-controlbar .jw-tooltip,.jw-settings-menu .jw-tooltip{pointer-events:none}.jw-icon-cast{display:none;margin:0;padding:0}.jw-icon-cast button{background-color:transparent;border:none;padding:0;width:24px;height:24px;cursor:pointer}.jw-icon-inline.jw-icon-volume{display:none}.jwplayer .jw-text-countdown{display:none}.jw-flag-small-player .jw-display{padding-top:44px;padding-bottom:66px}.jw-flag-small-player:not(.jw-flag-audio-player):not(.jw-flag-ads) .jw-controlbar .jw-button-container>.jw-icon-rewind,.jw-flag-small-player:not(.jw-flag-audio-player):not(.jw-flag-ads) .jw-controlbar .jw-button-container>.jw-icon-next,.jw-flag-small-player:not(.jw-flag-audio-player):not(.jw-flag-ads) .jw-controlbar .jw-button-container>.jw-icon-playback{display:none}.jw-flag-ads-vpaid:not(.jw-flag-media-audio):not(.jw-flag-audio-player):not(.jw-flag-ads-vpaid-controls):not(.jw-flag-casting) .jw-controlbar,.jw-flag-autostart:not(.jw-flag-media-audio):not(.jw-flag-audio-player):not(.jw-flag-ads-vpaid-controls):not(.jw-flag-casting) .jw-controlbar,.jw-flag-user-inactive.jw-state-playing:not(.jw-flag-media-audio):not(.jw-flag-audio-player):not(.jw-flag-ads-vpaid-controls):not(.jw-flag-casting) .jw-controlbar,.jw-flag-user-inactive.jw-state-buffering:not(.jw-flag-media-audio):not(.jw-flag-audio-player):not(.jw-flag-ads-vpaid-controls):not(.jw-flag-casting) .jw-controlbar{visibility:hidden;pointer-events:none;opacity:0;transition-delay:0s,250ms}.jw-flag-ads-vpaid:not(.jw-flag-media-audio):not(.jw-flag-audio-player):not(.jw-flag-ads-vpaid-controls):not(.jw-flag-casting) .jw-controls-backdrop,.jw-flag-autostart:not(.jw-flag-media-audio):not(.jw-flag-audio-player):not(.jw-flag-ads-vpaid-controls):not(.jw-flag-casting) .jw-controls-backdrop,.jw-flag-user-inactive.jw-state-playing:not(.jw-flag-media-audio):not(.jw-flag-audio-player):not(.jw-flag-ads-vpaid-controls):not(.jw-flag-casting) .jw-controls-backdrop,.jw-flag-user-inactive.jw-state-buffering:not(.jw-flag-media-audio):not(.jw-flag-audio-player):not(.jw-flag-ads-vpaid-controls):not(.jw-flag-casting) .jw-controls-backdrop{opacity:0}.jwplayer:not(.jw-flag-ads):not(.jw-flag-live).jw-breakpoint-0 .jw-text-countdown{display:flex}.jwplayer:not(.jw-flag-ads):not(.jw-flag-live).jw-breakpoint-0 .jw-text-elapsed,.jwplayer:not(.jw-flag-ads):not(.jw-flag-live).jw-breakpoint-0 .jw-text-duration{display:none}.jwplayer:not(.jw-flag-ads):not(.jw-flag-live) .jw-icon-live:not(.jw-dvr-live){margin-right:16px}.jwplayer:not(.jw-flag-ads):not(.jw-flag-live) .jw-icon-live:not(.jw-dvr-live) .jw-svg-icon-live{display:none}.jwplayer.jw-flag-live .jw-icon-live .jw-svg-icon-dvr{display:none}.jwplayer:not(.jw-breakpoint-0) .jw-text-duration:before{content:\"/\";padding-right:1ch;padding-left:1ch}.jwplayer:not(.jw-flag-user-inactive) .jw-controlbar{will-change:transform}.jwplayer:not(.jw-flag-user-inactive) .jw-controlbar .jw-text{-webkit-transform-style:preserve-3d;transform-style:preserve-3d}.jw-slider-container{display:flex;align-items:center;position:relative;touch-action:none}.jw-rail,.jw-buffer,.jw-progress{position:absolute;cursor:pointer}.jw-progress{background-color:#f2f2f2}.jw-rail{background-color:rgba(255,255,255,0.3)}.jw-buffer{background-color:rgba(255,255,255,0.3)}.jw-knob{height:13px;width:13px;background-color:#fff;border-radius:50%;box-shadow:0 0 10px rgba(0,0,0,0.4);opacity:1;pointer-events:none;position:absolute;-webkit-transform:translate(-50%, -50%) scale(0);transform:translate(-50%, -50%) scale(0);transition:150ms cubic-bezier(0, -0.25, .25, 1);transition-property:opacity,-webkit-transform;transition-property:opacity,transform;transition-property:opacity,transform,-webkit-transform}.jw-flag-dragging .jw-slider-time .jw-knob,.jw-icon-volume:active .jw-slider-volume .jw-knob{box-shadow:0 0 26px rgba(0,0,0,0.2),0 0 10px rgba(0,0,0,0.4),0 0 0 6px rgba(255,255,255,0.2)}.jw-slider-horizontal,.jw-slider-vertical{display:flex}.jw-slider-horizontal .jw-slider-container{height:5px;width:100%}.jw-slider-horizontal .jw-rail,.jw-slider-horizontal .jw-buffer,.jw-slider-horizontal .jw-progress,.jw-slider-horizontal .jw-cue,.jw-slider-horizontal .jw-knob{top:50%}.jw-slider-horizontal .jw-rail,.jw-slider-horizontal .jw-buffer,.jw-slider-horizontal .jw-progress,.jw-slider-horizontal .jw-cue{-webkit-transform:translate(0, -50%);transform:translate(0, -50%)}.jw-slider-horizontal .jw-rail,.jw-slider-horizontal .jw-buffer,.jw-slider-horizontal .jw-progress{height:5px}.jw-slider-horizontal .jw-rail{width:100%}.jw-slider-vertical{align-items:center;flex-direction:column}.jw-slider-vertical .jw-slider-container{height:88px;width:5px}.jw-slider-vertical .jw-rail,.jw-slider-vertical .jw-buffer,.jw-slider-vertical .jw-progress,.jw-slider-vertical .jw-knob{left:50%}.jw-slider-vertical .jw-rail,.jw-slider-vertical .jw-buffer,.jw-slider-vertical .jw-progress{height:100%;width:5px;-webkit-backface-visibility:hidden;backface-visibility:hidden;-webkit-transform:translate(-50%, 0);transform:translate(-50%, 0);transition:-webkit-transform 150ms ease-in-out;transition:transform 150ms ease-in-out;transition:transform 150ms ease-in-out, -webkit-transform 150ms ease-in-out;bottom:0}.jw-slider-vertical .jw-knob{-webkit-transform:translate(-50%, 50%);transform:translate(-50%, 50%)}.jw-slider-time{height:17px;width:100%;align-items:center;background:transparent none;padding:0 12px;z-index:1}.jw-slider-time .jw-rail,.jw-slider-time .jw-buffer,.jw-slider-time .jw-progress,.jw-slider-time .jw-cue{-webkit-backface-visibility:hidden;backface-visibility:hidden;height:100%;-webkit-transform:translate(0, -50%) scale(1, .6);transform:translate(0, -50%) scale(1, .6);transition:-webkit-transform 150ms ease-in-out;transition:transform 150ms ease-in-out;transition:transform 150ms ease-in-out, -webkit-transform 150ms ease-in-out}.jw-slider-time .jw-cue{background-color:rgba(33,33,33,0.8);cursor:pointer;position:relative;width:6px}.jw-slider-time:hover .jw-rail,.jw-flag-touch .jw-slider-time .jw-rail,.jw-slider-time:hover .jw-buffer,.jw-flag-touch .jw-slider-time .jw-buffer,.jw-slider-time:hover .jw-progress,.jw-flag-touch .jw-slider-time .jw-progress,.jw-slider-time:hover .jw-cue,.jw-flag-touch .jw-slider-time .jw-cue{-webkit-transform:translate(0, -50%) scale(1, 1);transform:translate(0, -50%) scale(1, 1)}.jw-slider-time .jw-rail{background-color:rgba(255,255,255,0.2)}.jw-slider-time .jw-buffer{background-color:rgba(255,255,255,0.4)}.jw-slider-time:hover .jw-knob,.jw-flag-dragging .jw-slider-time .jw-knob,.jw-flag-touch .jw-slider-time .jw-knob{-webkit-transform:translate(-50%, -50%) scale(1);transform:translate(-50%, -50%) scale(1)}.jw-flag-touch .jw-slider-time::before{height:44px;width:100%;content:\"\";position:absolute;display:block;bottom:calc(100% - 17px);left:0}.jwplayer .jw-rightclick{display:none;position:absolute;white-space:nowrap}.jwplayer .jw-rightclick.jw-open{display:block}.jwplayer .jw-rightclick .jw-rightclick-list{border-radius:1px;list-style:none;margin:0;padding:0}.jwplayer .jw-rightclick .jw-rightclick-list .jw-rightclick-item{background-color:rgba(0,0,0,0.8);border-bottom:1px solid #444;margin:0}.jwplayer .jw-rightclick .jw-rightclick-list .jw-rightclick-item .jw-rightclick-logo{color:#fff;display:inline-flex;padding:0 10px 0 0;vertical-align:middle}.jwplayer .jw-rightclick .jw-rightclick-list .jw-rightclick-item .jw-rightclick-logo .jw-svg-icon{height:20px;width:20px}.jwplayer .jw-rightclick .jw-rightclick-list .jw-rightclick-item .jw-rightclick-link{border:none;color:#fff;display:block;font-size:11px;line-height:1em;padding:15px 23px;text-decoration:none}.jwplayer .jw-rightclick .jw-rightclick-list .jw-rightclick-item:last-child{border-bottom:none}.jwplayer .jw-rightclick .jw-rightclick-list .jw-rightclick-item:hover{cursor:pointer}.jwplayer .jw-rightclick .jw-rightclick-list .jw-featured{vertical-align:middle}.jwplayer .jw-rightclick .jw-rightclick-list .jw-featured .jw-rightclick-link{color:#d2d2d2}.jwplayer .jw-rightclick .jw-rightclick-list .jw-featured .jw-rightclick-link span{color:#fff}.jw-icon-tooltip.jw-open .jw-overlay{opacity:1;transition-delay:0s;visibility:visible}.jw-slider-time .jw-overlay:before{height:1em;top:auto}.jw-volume-tip{padding:13px 0 26px}.jw-time-tip,.jw-controlbar .jw-tooltip,.jw-settings-menu .jw-tooltip{height:auto;width:100%;box-shadow:0 0 10px rgba(0,0,0,0.4);color:#fff;display:block;margin:0 0 14px;pointer-events:none;position:relative;z-index:0}.jw-time-tip::after,.jw-controlbar .jw-tooltip::after,.jw-settings-menu .jw-tooltip::after{top:100%;position:absolute;left:50%;height:14px;width:14px;border-radius:1px;background-color:currentColor;-webkit-transform-origin:75% 50%;transform-origin:75% 50%;-webkit-transform:translate(-50%, -50%) rotate(45deg);transform:translate(-50%, -50%) rotate(45deg);z-index:-1}.jw-time-tip .jw-text,.jw-controlbar .jw-tooltip .jw-text,.jw-settings-menu .jw-tooltip .jw-text{background-color:#fff;border-radius:1px;color:#000;font-size:10px;height:auto;line-height:1;padding:7px 10px;display:inline-block;min-width:100%;vertical-align:middle}.jw-controlbar .jw-overlay{position:absolute;bottom:100%;left:50%;margin:0;min-height:44px;min-width:44px;opacity:0;transition:150ms cubic-bezier(0, -0.25, .25, 1);transition-property:opacity,visibility;transition-delay:0s,150ms;-webkit-transform:translate(-50%, 0);transform:translate(-50%, 0);visibility:hidden;width:100%;z-index:1}.jw-controlbar .jw-overlay .jw-contents{position:relative}.jw-controlbar .jw-option{position:relative;white-space:nowrap;cursor:pointer;list-style:none;height:1.5em;font-family:inherit;line-height:1.5em;padding:0 .5em;font-size:.8em;margin:0}.jw-controlbar .jw-option::before{padding-right:.125em}.jw-controlbar .jw-tooltip,.jw-settings-menu .jw-tooltip{position:absolute;bottom:100%;left:50%;opacity:0;-webkit-transform:translate(-50%, 0);transform:translate(-50%, 0);transition:100ms 0s cubic-bezier(0, -0.25, .25, 1);transition-property:opacity,visibility,-webkit-transform;transition-property:opacity,transform,visibility;transition-property:opacity,transform,visibility,-webkit-transform;visibility:hidden;white-space:nowrap;width:auto;z-index:1}.jw-controlbar .jw-tooltip.jw-open,.jw-settings-menu .jw-tooltip.jw-open,.jw-controlbar .jw-icon:focus>.jw-tooltip,.jw-settings-menu .jw-icon:focus>.jw-tooltip{opacity:1;-webkit-transform:translate(-50%, -10px);transform:translate(-50%, -10px);transition-duration:150ms;transition-delay:500ms,0s,500ms;visibility:visible}.jw-tooltip-time{height:auto;width:0;bottom:100%;line-height:normal;padding:0;pointer-events:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.jw-tooltip-time .jw-overlay{bottom:0;min-height:0;width:auto}.jw-tooltip{bottom:57px;display:none;position:absolute}.jw-tooltip .jw-text{height:100%;white-space:nowrap;text-overflow:ellipsis;max-width:246px;overflow:hidden}.jw-flag-audio-player .jw-tooltip{display:none}.jw-flag-small-player .jw-time-thumb{display:none}.jw-skip{color:rgba(255,255,255,0.8);cursor:default;position:absolute;display:flex;right:.75em;bottom:56px;padding:.5em;border:1px solid #333;background-color:#000;align-items:center;height:2em}.jw-skip.jw-skippable{cursor:pointer;padding:.25em .75em}.jw-skip.jw-skippable:hover{cursor:pointer;color:#fff}.jw-skip.jw-skippable .jw-skip-icon{display:inline;height:24px;width:24px;margin:0}.jw-skip .jw-skip-icon{display:none;margin-left:-0.75em;padding:0 .5em}.jw-skip .jw-skip-icon .jw-svg-icon-next{display:block;padding:0}.jw-skip .jw-text,.jw-skip .jw-skip-icon{vertical-align:middle;font-size:.7em}.jw-skip .jw-text{font-weight:bold}.jw-cast{background-size:cover;display:none;height:100%;position:relative;width:100%}.jw-cast-container{background:linear-gradient(180deg, rgba(25,25,25,0.75), rgba(25,25,25,0.25), rgba(25,25,25,0));left:0;padding:20px 20px 80px;position:absolute;top:0;width:100%}.jw-cast-text{color:#fff;font-size:1.6em}.jw-breakpoint-0 .jw-cast-text{font-size:1.15em}.jw-breakpoint-1 .jw-cast-text,.jw-breakpoint-2 .jw-cast-text,.jw-breakpoint-3 .jw-cast-text{font-size:1.3em}.jw-nextup-container{position:absolute;bottom:66px;left:0;background-color:transparent;cursor:pointer;margin:0 auto;padding:12px;pointer-events:none;right:0;text-align:right;visibility:hidden;width:100%}.jw-flag-small-player .jw-nextup-container,.jw-settings-open .jw-nextup-container{display:none}.jw-nextup{background:#333;border-radius:0;box-shadow:0 0 10px rgba(0,0,0,0.5);color:rgba(255,255,255,0.8);display:inline-block;max-width:280px;overflow:hidden;opacity:0;position:relative;width:64%;pointer-events:all;-webkit-transform:translate(0, -5px);transform:translate(0, -5px);transition:150ms cubic-bezier(0, -0.25, .25, 1);transition-property:opacity,-webkit-transform;transition-property:opacity,transform;transition-property:opacity,transform,-webkit-transform;transition-delay:0s}.jw-nextup:hover .jw-nextup-tooltip{color:#fff}.jw-nextup.jw-nextup-thumbnail-visible{max-width:400px}.jw-nextup.jw-nextup-thumbnail-visible .jw-nextup-thumbnail{display:block}.jw-nextup-container-visible{visibility:visible}.jw-nextup-container-visible .jw-nextup{opacity:1;-webkit-transform:translate(0, 0);transform:translate(0, 0);transition-delay:0s,0s,150ms}.jw-nextup-tooltip{display:flex;height:80px}.jw-nextup-thumbnail{width:120px;background-position:center;background-size:cover;flex:0 0 auto;display:none}.jw-nextup-body{flex:1 1 auto;overflow:hidden;padding:.75em .875em;display:flex;flex-flow:column wrap;justify-content:space-between}.jw-nextup-header,.jw-nextup-title{font-size:14px;line-height:1.35}.jw-nextup-header{font-weight:bold}.jw-nextup-title{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;width:100%}.jw-nextup-duration{align-self:flex-end;text-align:right;font-size:12px}.jw-nextup-close{height:24px;width:24px;border:none;color:rgba(255,255,255,0.8);cursor:pointer;margin:6px;visibility:hidden}.jw-nextup-close:hover{color:#fff}.jw-nextup-sticky .jw-nextup-close{visibility:visible}.jw-autostart-mute{position:absolute;bottom:.5em;right:.5em;height:44px;width:44px;background-color:rgba(33,33,33,0.8);padding:5px 4px 5px 6px}.jwplayer.jw-flag-autostart:not(.jw-flag-media-audio):not(.jw-state-buffering):not(.jw-state-error):not(.jw-state-complete) .jw-display,.jwplayer.jw-flag-autostart:not(.jw-flag-media-audio) .jw-nextup{display:none}.jw-settings-menu{display:none;position:absolute;flex-flow:column nowrap;align-items:flex-start;right:12px;bottom:57px;max-width:284px;background-color:#333;pointer-events:auto}.jw-settings-open .jw-settings-menu{display:flex}.jw-breakpoint-7 .jw-settings-menu,.jw-breakpoint-6 .jw-settings-menu,.jw-breakpoint-5 .jw-settings-menu{height:232px;width:284px;max-height:232px}.jw-breakpoint-4 .jw-settings-menu,.jw-breakpoint-3 .jw-settings-menu{height:192px;width:284px;max-height:192px}.jw-breakpoint-2 .jw-settings-menu{height:179px;width:284px;max-height:179px}.jw-flag-small-player .jw-settings-menu{bottom:0;right:0;height:100%;width:100%;max-width:none}.jw-settings-menu .jw-icon.jw-button-color::after{height:100%;width:24px;box-shadow:inset 0 -3px 0 -1px currentColor;margin:auto;opacity:0;transition:opacity 150ms cubic-bezier(0, -0.25, .25, 1)}.jw-settings-menu .jw-icon.jw-button-color[aria-checked=\"true\"]::after{opacity:1}.jw-settings-topbar{display:flex;flex:0 0 auto;align-items:center;width:100%;background-color:rgba(0,0,0,0.4);padding:3px 5px 0}.jw-settings-topbar .jw-settings-close{margin-left:auto}.jw-settings-submenu{display:none;flex:1 1 auto;overflow-y:auto;padding:8px 20px 0 5px}.jw-settings-submenu.jw-settings-submenu-active{display:block}.jw-settings-submenu::-webkit-scrollbar{background-color:transparent;width:6px}.jw-settings-submenu::-webkit-scrollbar-thumb{background-color:#fff;border:1px solid #333;border-radius:6px}.jw-flag-touch .jw-settings-submenu{overflow-y:scroll;-webkit-overflow-scrolling:touch}.jw-settings-content-item{color:rgba(255,255,255,0.8);width:100%;font-size:12px;line-height:1;padding:7px 0 7px 15px;cursor:pointer}.jw-settings-content-item.jw-settings-item-active{color:#fff;font-weight:bold}.jw-settings-content-item:hover,.jw-settings-content-item:focus{color:#fff}.jw-settings-content-item:focus{outline:none}.jw-flag-small-player .jw-settings-content-item{line-height:1.75}.jw-breakpoint-2 .jw-settings-open .jw-display-container,.jw-flag-small-player .jw-settings-open .jw-display-container,.jw-flag-touch .jw-settings-open .jw-display-container{display:none}.jw-breakpoint-2 .jw-settings-open.jw-controls,.jw-flag-small-player .jw-settings-open.jw-controls,.jw-flag-touch .jw-settings-open.jw-controls{z-index:1}.jw-flag-small-player .jw-settings-open .jw-controlbar{display:none}.jw-settings-open .jw-icon-settings::after{opacity:1}.jw-settings-open .jw-tooltip-settings{display:none}.jw-sharing-link{cursor:pointer}.jw-state-idle:not(.jw-flag-cast-available) .jw-display{padding:0}.jw-state-idle .jw-controls{background:rgba(0,0,0,0.4)}.jw-state-idle.jw-flag-cast-available:not(.jw-flag-audio-player) .jw-controlbar .jw-slider-time,.jw-state-idle.jw-flag-cardboard-available .jw-controlbar .jw-slider-time,.jw-state-idle.jw-flag-cast-available:not(.jw-flag-audio-player) .jw-controlbar .jw-icon:not(.jw-icon-cardboard):not(.jw-icon-cast):not(.jw-icon-airplay),.jw-state-idle.jw-flag-cardboard-available .jw-controlbar .jw-icon:not(.jw-icon-cardboard):not(.jw-icon-cast):not(.jw-icon-airplay){display:none}.jwplayer.jw-state-buffering .jw-display-icon-display .jw-icon{-webkit-animation:spin 2s linear infinite;animation:spin 2s linear infinite}.jwplayer.jw-state-buffering .jw-display-icon-display .jw-icon .jw-svg-icon-buffer{display:block}@-webkit-keyframes spin{100%{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}@keyframes spin{100%{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}.jwplayer.jw-state-buffering .jw-icon-playback .jw-svg-icon-play{display:none}.jwplayer.jw-state-buffering .jw-icon-display .jw-svg-icon-pause{display:none}.jwplayer.jw-state-playing .jw-display .jw-icon-display .jw-svg-icon-play,.jwplayer.jw-state-playing .jw-icon-playback .jw-svg-icon-play{display:none}.jwplayer.jw-state-playing .jw-display .jw-icon-display .jw-svg-icon-pause,.jwplayer.jw-state-playing .jw-icon-playback .jw-svg-icon-pause{display:block}.jwplayer.jw-state-playing.jw-flag-user-inactive:not(.jw-flag-audio-player):not(.jw-flag-casting):not(.jw-flag-media-audio) .jw-controls-backdrop{opacity:0}.jwplayer.jw-state-playing.jw-flag-user-inactive:not(.jw-flag-audio-player):not(.jw-flag-casting):not(.jw-flag-media-audio) .jw-logo-bottom-left,.jwplayer.jw-state-playing.jw-flag-user-inactive:not(.jw-flag-audio-player):not(.jw-flag-casting):not(.jw-flag-media-audio):not(.jw-flag-autostart) .jw-logo-bottom-right{bottom:0}.jwplayer.jw-state-paused .jw-autostart-mute{display:none}.jwplayer.jw-state-paused .jw-svg-icon-pause,.jwplayer.jw-state-idle .jw-svg-icon-pause,.jwplayer.jw-state-error .jw-svg-icon-pause,.jwplayer.jw-state-complete .jw-svg-icon-pause{display:none}.jwplayer.jw-state-error .jw-icon-display .jw-svg-icon-play,.jwplayer.jw-state-complete .jw-icon-display .jw-svg-icon-play,.jwplayer.jw-state-buffering .jw-icon-display .jw-svg-icon-play{display:none}.jwplayer:not(.jw-state-buffering) .jw-svg-icon-buffer{display:none}.jwplayer:not(.jw-state-complete) .jw-svg-icon-replay{display:none}.jwplayer:not(.jw-state-error) .jw-svg-icon-error{display:none}.jwplayer.jw-state-complete .jw-display .jw-icon-display .jw-svg-icon-replay{display:block}.jwplayer.jw-state-complete .jw-display .jw-text{display:none}.jwplayer.jw-state-complete .jw-controls{background:rgba(0,0,0,0.4);height:100%}.jw-state-idle .jw-icon-display .jw-svg-icon-pause,.jwplayer.jw-state-paused .jw-icon-playback .jw-svg-icon-pause,.jwplayer.jw-state-paused .jw-icon-display .jw-svg-icon-pause,.jwplayer.jw-state-complete .jw-icon-playback .jw-svg-icon-pause{display:none}.jw-state-idle .jw-display-icon-rewind,.jwplayer.jw-state-buffering .jw-display-icon-rewind,.jwplayer.jw-state-complete .jw-display-icon-rewind,body .jw-error .jw-display-icon-rewind,body .jwplayer.jw-state-error .jw-display-icon-rewind,.jw-state-idle .jw-display-icon-next,.jwplayer.jw-state-buffering .jw-display-icon-next,.jwplayer.jw-state-complete .jw-display-icon-next,body .jw-error .jw-display-icon-next,body .jwplayer.jw-state-error .jw-display-icon-next{display:none}body .jw-error .jw-icon-display,body .jwplayer.jw-state-error .jw-icon-display{cursor:default}body .jw-error .jw-icon-display .jw-svg-icon-error,body .jwplayer.jw-state-error .jw-icon-display .jw-svg-icon-error{display:block}body .jw-error .jw-icon-container{position:absolute;width:100%;height:100%;top:0;left:0;bottom:0;right:0}body .jwplayer.jw-state-error.jw-flag-audio-player .jw-preview{display:none}body .jwplayer.jw-state-error.jw-flag-audio-player .jw-title{padding-top:4px}body .jwplayer.jw-state-error.jw-flag-audio-player .jw-title-primary{width:auto;display:inline-block;padding-right:.5ch}body .jwplayer.jw-state-error.jw-flag-audio-player .jw-title-secondary{width:auto;display:inline-block;padding-left:0}body .jwplayer.jw-state-error .jw-controlbar,.jwplayer.jw-state-idle:not(.jw-flag-audio-player):not(.jw-flag-cast-available):not(.jw-flag-cardboard-available) .jw-controlbar{display:none}body .jwplayer.jw-state-error .jw-settings-menu,.jwplayer.jw-state-idle:not(.jw-flag-audio-player):not(.jw-flag-cast-available):not(.jw-flag-cardboard-available) .jw-settings-menu{height:100%;top:0;bottom:0}body .jwplayer.jw-state-error .jw-display,.jwplayer.jw-state-idle:not(.jw-flag-audio-player):not(.jw-flag-cast-available):not(.jw-flag-cardboard-available) .jw-display{padding:0}body .jwplayer.jw-state-error .jw-logo-bottom-left,.jwplayer.jw-state-idle:not(.jw-flag-audio-player):not(.jw-flag-cast-available):not(.jw-flag-cardboard-available) .jw-logo-bottom-left,body .jwplayer.jw-state-error .jw-logo-bottom-right,.jwplayer.jw-state-idle:not(.jw-flag-audio-player):not(.jw-flag-cast-available):not(.jw-flag-cardboard-available) .jw-logo-bottom-right{bottom:0}.jwplayer.jw-state-playing.jw-flag-user-inactive .jw-display{visibility:hidden;pointer-events:none;opacity:0}.jwplayer.jw-state-playing:not(.jw-flag-touch):not(.jw-flag-small-player):not(.jw-flag-casting) .jw-display,.jwplayer.jw-state-paused:not(.jw-flag-touch):not(.jw-flag-small-player):not(.jw-flag-casting):not(.jw-flag-play-rejected) .jw-display{display:none}.jwplayer.jw-state-paused.jw-flag-play-rejected:not(.jw-flag-touch):not(.jw-flag-small-player):not(.jw-flag-casting) .jw-display-icon-rewind,.jwplayer.jw-state-paused.jw-flag-play-rejected:not(.jw-flag-touch):not(.jw-flag-small-player):not(.jw-flag-casting) .jw-display-icon-next{display:none}.jwplayer.jw-state-buffering .jw-display-icon-display .jw-text,.jwplayer.jw-state-complete .jw-display .jw-text{display:none}.jwplayer.jw-flag-casting:not(.jw-flag-audio-player) .jw-cast{display:block}.jwplayer.jw-flag-casting.jw-flag-airplay-casting .jw-display-icon-container{display:none}.jwplayer.jw-flag-casting .jw-icon-hd,.jwplayer.jw-flag-casting .jw-captions,.jwplayer.jw-flag-casting .jw-icon-fullscreen,.jwplayer.jw-flag-casting .jw-icon-audio-tracks{display:none}.jwplayer.jw-flag-casting.jw-flag-airplay-casting .jw-icon-volume{display:none}.jwplayer.jw-flag-casting.jw-flag-airplay-casting .jw-icon-airplay{color:#fff}.jw-state-playing.jw-flag-casting:not(.jw-flag-audio-player) .jw-display,.jw-state-paused.jw-flag-casting:not(.jw-flag-audio-player) .jw-display{display:table}.jwplayer.jw-flag-cast-available .jw-icon-cast,.jwplayer.jw-flag-cast-available .jw-icon-airplay{display:flex}.jwplayer.jw-flag-cardboard-available .jw-icon-cardboard{display:flex}.jwplayer.jw-flag-live .jw-display-icon-rewind{display:none}.jwplayer.jw-flag-live .jw-controlbar .jw-text-elapsed,.jwplayer.jw-flag-live .jw-controlbar .jw-text-duration,.jwplayer.jw-flag-live .jw-controlbar .jw-text-countdown,.jwplayer.jw-flag-live .jw-controlbar .jw-slider-time{display:none}.jwplayer.jw-flag-live .jw-controlbar .jw-text-alt{display:flex}.jwplayer.jw-flag-live .jw-controlbar .jw-overlay:after{display:none}.jwplayer.jw-flag-live .jw-controlbar .jw-icon-live .jw-svg-icon-dvr{display:none}.jwplayer.jw-flag-live .jw-nextup-container{bottom:44px}.jwplayer.jw-flag-live .jw-text-elapsed,.jwplayer.jw-flag-live .jw-text-duration{display:none}.jwplayer.jw-flag-controls-hidden .jw-logo.jw-hide{visibility:hidden;pointer-events:none;opacity:0}.jwplayer.jw-flag-controls-hidden:not(.jw-flag-casting) .jw-logo-top-right{top:0}.jwplayer.jw-flag-controls-hidden .jw-plugin{bottom:.5em}.jwplayer.jw-flag-controls-hidden .jw-nextup-container{bottom:0}.jw-flag-controls-hidden .jw-controlbar,.jw-flag-controls-hidden .jw-display{visibility:hidden;pointer-events:none;opacity:0;transition-delay:0s,250ms}.jw-flag-controls-hidden .jw-controls-backdrop{opacity:0}.jw-flag-controls-hidden .jw-logo{visibility:visible}.jwplayer.jw-flag-user-inactive:not(.jw-flag-media-audio).jw-state-playing .jw-logo.jw-hide{visibility:hidden;pointer-events:none;opacity:0}.jwplayer.jw-flag-user-inactive:not(.jw-flag-media-audio).jw-state-playing:not(.jw-flag-casting) .jw-logo-top-right{top:0}.jwplayer.jw-flag-user-inactive:not(.jw-flag-media-audio).jw-state-playing .jw-plugin{bottom:.5em}.jwplayer.jw-flag-user-inactive:not(.jw-flag-media-audio).jw-state-playing .jw-nextup-container{bottom:0}.jwplayer.jw-flag-user-inactive:not(.jw-flag-media-audio).jw-state-playing .jw-captions{max-height:none}.jwplayer.jw-flag-user-inactive:not(.jw-flag-media-audio).jw-state-playing video::-webkit-media-text-track-container{max-height:none}.jwplayer.jw-flag-user-inactive:not(.jw-flag-media-audio).jw-state-playing .jw-media{cursor:none;-webkit-cursor-visibility:auto-hide}.jwplayer.jw-flag-user-inactive:not(.jw-flag-media-audio).jw-state-playing.jw-flag-casting .jw-display{display:table}.jwplayer.jw-flag-user-inactive:not(.jw-flag-media-audio).jw-flag-casting .jw-nextup-container{bottom:66px}.jwplayer.jw-flag-user-inactive:not(.jw-flag-media-audio).jw-flag-casting.jw-state-idle .jw-nextup-container{display:none}.jwplayer.jw-flag-media-audio .jw-autostart-mute{display:none}.jw-flag-media-audio .jw-preview{display:block}.jwplayer.jw-flag-ads .jw-preview,.jwplayer.jw-flag-ads .jw-logo,.jwplayer.jw-flag-ads .jw-captions.jw-captions-enabled,.jwplayer.jw-flag-ads .jw-nextup-container,.jwplayer.jw-flag-ads .jw-autostart-mute,.jwplayer.jw-flag-ads .jw-text-duration,.jwplayer.jw-flag-ads .jw-text-elapsed{display:none}.jwplayer.jw-flag-ads video::-webkit-media-text-track-container{display:none}.jwplayer.jw-flag-ads.jw-flag-small-player .jw-display-icon-rewind,.jwplayer.jw-flag-ads.jw-flag-small-player .jw-display-icon-next,.jwplayer.jw-flag-ads.jw-flag-small-player .jw-display-icon-display{display:none}.jwplayer.jw-flag-ads.jw-flag-small-player.jw-state-buffering .jw-display-icon-display{display:inline-block}.jwplayer.jw-flag-ads .jw-controlbar{flex-wrap:wrap-reverse}.jwplayer.jw-flag-ads .jw-controlbar .jw-slider-time{height:auto;padding:0;pointer-events:none}.jwplayer.jw-flag-ads .jw-controlbar .jw-slider-time .jw-slider-container{height:5px}.jwplayer.jw-flag-ads .jw-controlbar .jw-slider-time .jw-rail,.jwplayer.jw-flag-ads .jw-controlbar .jw-slider-time .jw-knob,.jwplayer.jw-flag-ads .jw-controlbar .jw-slider-time .jw-buffer,.jwplayer.jw-flag-ads .jw-controlbar .jw-slider-time .jw-cue,.jwplayer.jw-flag-ads .jw-controlbar .jw-slider-time .jw-icon-settings{display:none}.jwplayer.jw-flag-ads .jw-controlbar .jw-slider-time .jw-progress{-webkit-transform:none;transform:none;top:auto}.jwplayer.jw-flag-ads .jw-controlbar .jw-tooltip,.jwplayer.jw-flag-ads .jw-controlbar .jw-icon-tooltip:not(.jw-icon-volume),.jwplayer.jw-flag-ads .jw-controlbar .jw-icon-inline:not(.jw-icon-playback):not(.jw-icon-fullscreen):not(.jw-icon-volume){display:none}.jwplayer.jw-flag-ads .jw-controlbar .jw-volume-tip{padding:13px 0}.jwplayer.jw-flag-ads .jw-controlbar .jw-text-alt{display:flex}.jwplayer.jw-flag-ads.jw-flag-ads.jw-state-playing.jw-flag-touch:not(.jw-flag-ads-vpaid) .jw-controls .jw-controlbar,.jwplayer.jw-flag-ads.jw-flag-ads.jw-state-playing.jw-flag-touch:not(.jw-flag-ads-vpaid).jw-flag-autostart .jw-controls .jw-controlbar{display:flex;pointer-events:all;visibility:visible;opacity:1}.jwplayer.jw-flag-ads.jw-flag-ads.jw-state-playing.jw-flag-touch:not(.jw-flag-ads-vpaid).jw-flag-user-inactive .jw-controls-backdrop,.jwplayer.jw-flag-ads.jw-flag-ads.jw-state-playing.jw-flag-touch:not(.jw-flag-ads-vpaid).jw-flag-autostart.jw-flag-user-inactive .jw-controls-backdrop{opacity:1;background-size:100% 60px}.jwplayer.jw-flag-ads .jw-nextup-container{bottom:44px}.jwplayer.jw-flag-ads .jw-icon,.jwplayer.jw-flag-ads .jw-slider-horizontal{pointer-events:all}.jwplayer.jw-flag-ads-googleima.jw-flag-touch .jw-controlbar{font-size:1em}.jwplayer.jw-flag-ads-googleima.jw-flag-touch .jw-display-icon-display,.jwplayer.jw-flag-ads-googleima.jw-flag-touch .jw-display-icon-display .jw-icon-display{pointer-events:none}.jwplayer.jw-flag-ads-googleima.jw-flag-small-player .jw-controlbar .jw-icon{height:30px}.jwplayer.jw-flag-ads-googleima.jw-flag-small-player .jw-icon-fullscreen{display:none}.jwplayer.jw-flag-ads-vpaid .jw-display-container,.jwplayer.jw-flag-touch.jw-flag-ads-vpaid .jw-display-container,.jwplayer.jw-flag-ads-vpaid .jw-skip,.jwplayer.jw-flag-touch.jw-flag-ads-vpaid .jw-skip{display:none}.jwplayer.jw-flag-ads-vpaid.jw-flag-small-player .jw-controls{background:none}.jwplayer.jw-flag-ads-vpaid.jw-flag-small-player .jw-controls::after{content:none}.jwplayer.jw-flag-ads-hide-controls .jw-controls-backdrop,.jwplayer.jw-flag-ads-hide-controls .jw-controls{display:none !important}.jw-flag-overlay-open-related .jw-controls,.jw-flag-overlay-open-related .jw-title,.jw-flag-overlay-open-related .jw-logo{display:none}.jwplayer.jw-flag-rightclick-open{overflow:visible}.jwplayer.jw-flag-rightclick-open .jw-rightclick{z-index:16777215}body .jwplayer.jw-flag-flash-blocked .jw-controls,body .jwplayer.jw-flag-flash-blocked .jw-overlays,body .jwplayer.jw-flag-flash-blocked .jw-controls-backdrop,body .jwplayer.jw-flag-flash-blocked .jw-preview{display:none}.jw-flag-touch.jw-breakpoint-7 .jw-captions,.jw-flag-touch.jw-breakpoint-6 .jw-captions,.jw-flag-touch.jw-breakpoint-5 .jw-captions,.jw-flag-touch.jw-breakpoint-4 .jw-captions,.jw-flag-touch.jw-breakpoint-7 .jw-nextup-container,.jw-flag-touch.jw-breakpoint-6 .jw-nextup-container,.jw-flag-touch.jw-breakpoint-5 .jw-nextup-container,.jw-flag-touch.jw-breakpoint-4 .jw-nextup-container{bottom:4.25em}.jw-flag-touch.jw-breakpoint-7 video::-webkit-media-text-track-container,.jw-flag-touch.jw-breakpoint-6 video::-webkit-media-text-track-container,.jw-flag-touch.jw-breakpoint-5 video::-webkit-media-text-track-container,.jw-flag-touch.jw-breakpoint-4 video::-webkit-media-text-track-container{max-height:calc(100% - 60px)}.jw-flag-touch .jw-controlbar .jw-icon-volume{display:flex}.jw-flag-touch .jw-display,.jw-flag-touch .jw-display-container,.jw-flag-touch .jw-display-controls{pointer-events:none}.jw-flag-touch.jw-state-paused:not(.jw-breakpoint-1) .jw-display-icon-next,.jw-flag-touch.jw-state-playing:not(.jw-breakpoint-1) .jw-display-icon-next,.jw-flag-touch.jw-state-paused:not(.jw-breakpoint-1) .jw-display-icon-rewind,.jw-flag-touch.jw-state-playing:not(.jw-breakpoint-1) .jw-display-icon-rewind{display:none}.jw-flag-touch.jw-state-paused.jw-flag-dragging .jw-display{display:none}.jw-flag-audio-player{background-color:#000}.jw-flag-audio-player:not(.jw-flag-flash-blocked) .jw-media{visibility:hidden}.jw-flag-audio-player .jw-title{background:none}.jw-flag-audio-player object{min-height:44px}.jw-flag-audio-player .jw-preview,.jw-flag-audio-player .jw-display,.jw-flag-audio-player .jw-title,.jw-flag-audio-player .jw-nextup-container{display:none}.jw-flag-audio-player .jw-controlbar{position:relative}.jw-flag-audio-player .jw-controlbar .jw-button-container{padding-right:3px;padding-left:0}.jw-flag-audio-player .jw-controlbar .jw-icon-tooltip,.jw-flag-audio-player .jw-controlbar .jw-icon-inline{display:none}.jw-flag-audio-player .jw-controlbar .jw-icon-volume:not(.jw-icon-tooltip),.jw-flag-audio-player .jw-controlbar .jw-icon-playback,.jw-flag-audio-player .jw-controlbar .jw-icon-next,.jw-flag-audio-player .jw-controlbar .jw-icon-rewind,.jw-flag-audio-player .jw-controlbar .jw-icon-cast,.jw-flag-audio-player .jw-controlbar .jw-icon-live,.jw-flag-audio-player .jw-controlbar .jw-icon-airplay,.jw-flag-audio-player .jw-controlbar .jw-logo-button,.jw-flag-audio-player .jw-controlbar .jw-text-elapsed,.jw-flag-audio-player .jw-controlbar .jw-text-duration{display:flex;flex:0 0 auto}.jw-flag-audio-player .jw-controlbar .jw-text-duration,.jw-flag-audio-player .jw-controlbar .jw-text-countdown{padding-right:10px}.jw-flag-audio-player .jw-controlbar .jw-slider-time{display:flex;flex:0 1 auto;align-items:center}.jw-flag-audio-player.jw-flag-small-player .jw-text-elapsed,.jw-flag-audio-player.jw-flag-small-player .jw-text-duration{display:none}.jw-flag-audio-player.jw-flag-ads .jw-slider-time{display:none}.jw-hidden{display:none}", ""]);

// exports


/***/ }),
/* 141 */
/*!**********************************!*\
  !*** ./src/js/api/set-config.js ***!
  \**********************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _underscore = __webpack_require__(/*! utils/underscore */ 0);

var _underscore2 = _interopRequireDefault(_underscore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var supportedFields = ['repeat', 'volume', 'mute', 'autostart'];

function setAutoStart(model, controller, autoStart) {
    model.setAutoStart(autoStart);

    if (model.get('state') === 'idle' && autoStart === true) {
        controller.play({ reason: 'autostart' });
    }
}

exports.default = function (controller, newConfig) {
    var model = controller._model;

    if (!_underscore2.default.size(newConfig)) {
        return;
    }

    supportedFields.forEach(function (field) {
        var newValue = newConfig[field];

        if (_underscore2.default.isUndefined(newValue)) {
            return;
        }

        switch (field) {
            case 'mute':
                controller.setMute(newValue);
                break;
            case 'volume':
                controller.setVolume(newValue);
                break;
            case 'autostart':
                setAutoStart(model, controller, newValue);
                break;
            default:
                model.set(field, newValue);
        }
    });
};

/***/ }),
/* 142 */
/*!***********************************************!*\
  !*** ./src/js/controller/instream-adapter.js ***!
  \***********************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _environment = __webpack_require__(/*! environment/environment */ 22);

var _events = __webpack_require__(/*! events/events */ 4);

var _instreamHtml = __webpack_require__(/*! controller/instream-html5 */ 143);

var _instreamHtml2 = _interopRequireDefault(_instreamHtml);

var _instreamFlash = __webpack_require__(/*! controller/instream-flash */ 145);

var _instreamFlash2 = _interopRequireDefault(_instreamFlash);

var _helpers = __webpack_require__(/*! utils/helpers */ 5);

var _helpers2 = _interopRequireDefault(_helpers);

var _backbone = __webpack_require__(/*! utils/backbone.events */ 7);

var _backbone2 = _interopRequireDefault(_backbone);

var _underscore = __webpack_require__(/*! utils/underscore */ 0);

var _underscore2 = _interopRequireDefault(_underscore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function chooseInstreamMethod(_model) {
    var providerName = '';
    var provider = _model.get('provider');
    if (provider) {
        providerName = provider.name;
    }
    if (providerName.indexOf('flash') >= 0) {
        return _instreamFlash2.default;
    }

    return _instreamHtml2.default;
}

var _defaultOptions = {
    skipoffset: null,
    tag: null
};

var InstreamAdapter = function InstreamAdapter(_controller, _model, _view) {
    var InstreamMethod = chooseInstreamMethod(_model);
    var _instream = new InstreamMethod(_controller, _model);

    var _array;
    var _arrayOptions;
    var _arrayIndex = 0;
    var _options = {};
    var _oldpos;
    var _olditem;
    var _this = this;
    var _skipAd = _instreamItemNext;

    var _clickHandler = _underscore2.default.bind(function (evt) {
        evt = evt || {};
        evt.hasControls = !!_model.get('controls');

        this.trigger(_events.INSTREAM_CLICK, evt);

        // toggle playback after click event
        if (!_instream || !_instream._adModel) {
            return;
        }
        if (_instream._adModel.get('state') === _events.STATE_PAUSED) {
            if (evt.hasControls) {
                _instream.instreamPlay();
            }
        } else {
            _instream.instreamPause();
        }
    }, this);

    var _doubleClickHandler = _underscore2.default.bind(function () {
        if (!_instream || !_instream._adModel) {
            return;
        }
        if (_instream._adModel.get('state') === _events.STATE_PAUSED) {
            if (_model.get('controls')) {
                _controller.setFullscreen();
                _controller.play();
            }
        }
    }, this);

    this.type = 'instream';

    this.init = function (sharedVideoTag) {
        // Keep track of the original player state
        var mediaElement = sharedVideoTag || _model.get('mediaElement');
        _oldpos = _model.get('position');
        _olditem = _model.get('playlist')[_model.get('item')];

        _instream.on('all', _instreamForward, this);
        _instream.on(_events.MEDIA_TIME, _instreamTime, this);
        _instream.on(_events.MEDIA_COMPLETE, _instreamItemComplete, this);
        _instream.init(mediaElement, _model.clone());

        // Make sure the original player's provider stops broadcasting events (pseudo-lock...)
        _controller.detachMedia();

        // Let the element finish loading for mobile before calling pause
        if (mediaElement) {
            if (!mediaElement.paused) {
                mediaElement.pause();
            }
            mediaElement.playbackRate = mediaElement.defaultPlaybackRate = 1;
        }

        if (_controller.checkBeforePlay() || _oldpos === 0 && !_model.checkComplete()) {
            // make sure video restarts after preroll
            _oldpos = 0;
        } else if (_model.checkComplete() || _model.get('state') === _events.STATE_COMPLETE) {
            _oldpos = null;
        }

        // Show instream state instead of normal player state
        _model.set('adModel', _instream._adModel);
        _view.setupInstream(_instream._adModel);
        _instream._adModel.set('state', _events.STATE_BUFFERING);

        // don't trigger api play/pause on display click
        if (_view.clickHandler()) {
            _view.clickHandler().setAlternateClickHandlers(_helpers2.default.noop, null);
        }

        this.setText(_model.get('localization').loadingAd);
        return this;
    };

    function _loadNextItem() {
        _arrayIndex++;
        var item = _array[_arrayIndex];
        var options;
        if (_arrayOptions) {
            options = _arrayOptions[_arrayIndex];
        }
        _this.loadItem(item, options);
    }

    function _instreamForward(type, data) {
        if (type === 'complete') {
            return;
        }
        data = data || {};

        if (_options.tag && !data.tag) {
            data.tag = _options.tag;
        }

        this.trigger(type, data);

        if (type === 'mediaError' || type === 'error') {
            if (_array && _arrayIndex + 1 < _array.length) {
                _loadNextItem();
            }
        }
    }

    function _instreamTime(evt) {
        _instream._adModel.set('duration', evt.duration);
        _instream._adModel.set('position', evt.position);
    }

    function _instreamItemComplete(e) {
        var data = {};
        if (_options.tag) {
            data.tag = _options.tag;
        }
        this.trigger(_events.MEDIA_COMPLETE, data);
        _instreamItemNext.call(this, e);
    }

    function _instreamItemNext(e) {
        if (_array && _arrayIndex + 1 < _array.length) {
            _loadNextItem();
        } else {
            // notify vast of breakEnd
            this.trigger('adBreakEnd', {});
            if (e.type === _events.MEDIA_COMPLETE) {
                // Dispatch playlist complete event for ad pods
                this.trigger(_events.PLAYLIST_COMPLETE, {});
            }
            this.destroy();
        }
    }

    this.loadItem = function (item, options) {
        if (!_instream) {
            return;
        }
        if (_environment.OS.android && _environment.OS.version.major === 2 && _environment.OS.version.minor === 3) {
            this.trigger({
                type: _events.ERROR,
                message: 'Error loading instream: Cannot play instream on Android 2.3'
            });
            return;
        }
        // Copy the playlist item passed in and make sure it's formatted as a proper playlist item
        var playlist = item;
        if (_underscore2.default.isArray(item)) {
            _array = item;
            _arrayOptions = options;
            item = _array[_arrayIndex];
            if (_arrayOptions) {
                options = _arrayOptions[_arrayIndex];
            }
        } else {
            playlist = [item];
        }

        var adModel = _instream._adModel;
        adModel.set('playlist', playlist);

        _model.set('hideAdsControls', false);

        // Dispatch playlist item event for ad pods
        _this.trigger(_events.PLAYLIST_ITEM, {
            index: _arrayIndex,
            item: item
        });

        _options = _extends({}, _defaultOptions, options);

        _this.addClickHandler();

        adModel.set('skipButton', false);

        var playPromise = _instream.load(item);

        var skipoffset = item.skipoffset || _options.skipoffset;
        if (skipoffset) {
            _this.setupSkipButton(skipoffset, _options);
        }

        return playPromise;
    };

    this.setupSkipButton = function (skipoffset, options, customNext) {
        var adModel = _instream._adModel;
        if (customNext) {
            _skipAd = customNext;
        } else {
            _skipAd = _instreamItemNext;
        }
        adModel.set('skipMessage', options.skipMessage);
        adModel.set('skipText', options.skipText);
        adModel.set('skipOffset', skipoffset);
        adModel.set('skipButton', false);
        adModel.set('skipButton', true);
    };

    this.applyProviderListeners = function (provider) {
        _instream.applyProviderListeners(provider);

        this.addClickHandler();
    };

    this.play = function () {
        _instream.instreamPlay();
    };

    this.pause = function () {
        _instream.instreamPause();
    };

    this.addClickHandler = function () {
        // start listening for ad click
        if (_view.clickHandler()) {
            _view.clickHandler().setAlternateClickHandlers(_clickHandler, _doubleClickHandler);
        }

        if (_instream) {
            _instream.on(_events.MEDIA_META, this.metaHandler, this);
        }
    };

    this.skipAd = function (evt) {
        var skipAdType = _events.AD_SKIPPED;
        this.trigger(skipAdType, evt);
        _skipAd.call(this, {
            type: skipAdType
        });
    };

    /** Handle the MEDIA_META event **/
    this.metaHandler = function (evt) {
        // If we're getting video dimension metadata from the provider, allow the view to resize the media
        if (evt.width && evt.height) {
            _view.resizeMedia();
        }
    };

    this.replacePlaylistItem = function (item) {
        _model.set('playlistItem', item);
    };

    this.destroy = function () {
        this.off();

        _model.set('adModel', null);

        if (_view.clickHandler()) {
            _view.clickHandler().revertAlternateClickHandlers();
        }

        if (_instream) {
            // Sync player state with ad for model "change:state" events to trigger
            if (_instream._adModel) {
                var adState = _instream._adModel.get('state');
                _model.attributes.state = adState;
            }

            _model.off(null, null, _instream);
            _instream.off(null, null, _this);
            _instream.instreamDestroy();

            // Must happen after instream.instreamDestroy()
            _view.destroyInstream();

            _instream = null;

            // Player was destroyed
            if (_model.attributes._destroyed) {
                return;
            }

            // Re-attach the controller
            _controller.attachMedia();

            if (_oldpos === null) {
                _model.stopVideo();
            } else {
                var mediaModelContext = _model.mediaModel;
                var item = _extends({}, _olditem);
                item.starttime = _oldpos;
                _model.attributes.playlistItem = item;
                _model.playVideo().catch(function (error) {
                    if (mediaModelContext === _model.mediaModel) {
                        _model.mediaController.trigger('error', {
                            message: error.message
                        });
                    }
                });
            }
        }
    };

    this.getState = function () {
        if (_instream && _instream._adModel) {
            return _instream._adModel.get('state');
        }
        // api expects false to know we aren't in instreamMode
        return false;
    };

    this.setText = function (text) {
        _view.setAltText(text ? text : '');
    };

    // This method is triggered by plugins which want to hide player controls
    this.hide = function () {
        _model.set('hideAdsControls', true);
    };
};

_extends(InstreamAdapter.prototype, _backbone2.default);

exports.default = InstreamAdapter;

/***/ }),
/* 143 */
/*!*********************************************!*\
  !*** ./src/js/controller/instream-html5.js ***!
  \*********************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _events = __webpack_require__(/*! events/events */ 4);

var _environment = __webpack_require__(/*! environment/environment */ 22);

var _backbone = __webpack_require__(/*! utils/backbone.events */ 7);

var _backbone2 = _interopRequireDefault(_backbone);

var _changeStateEvent = __webpack_require__(/*! events/change-state-event */ 73);

var _changeStateEvent2 = _interopRequireDefault(_changeStateEvent);

var _model2 = __webpack_require__(/*! controller/model */ 74);

var _model3 = _interopRequireDefault(_model2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var InstreamHtml5 = function InstreamHtml5(_controller, _model) {
    var _adModel;
    var _currentProvider;
    var _this = _extends(this, _backbone2.default);

    // Listen for player resize events
    _controller.on(_events.FULLSCREEN, function (data) {
        this.trigger(_events.FULLSCREEN, data);
    }, _this);

    /** ***************************************
     *****  Public instream API methods  *****
     *****************************************/

    this.init = function (mediaElement) {
        // Initialize the instream player's model copied from main player's model
        var playerAttributes = _model.attributes;
        var mediaModelContext = _model.mediaModel;
        _adModel = new _model3.default().setup({
            id: playerAttributes.id,
            volume: playerAttributes.volume,
            fullscreen: playerAttributes.fullscreen,
            instreamMode: true,
            edition: playerAttributes.edition,
            mediaContext: mediaModelContext,
            mediaElement: mediaElement,
            mediaSrc: mediaElement.src,
            mute: playerAttributes.mute || playerAttributes.autostartMuted,
            autostartMuted: playerAttributes.autostartMuted,
            autostart: playerAttributes.autostart,
            advertising: playerAttributes.advertising,
            sdkplatform: playerAttributes.sdkplatform,
            skipButton: false
        });
        if (!_environment.OS.mobile) {
            _adModel.set('mediaContainer', _model.get('mediaContainer'));
        }
        _adModel.on('fullscreenchange', _nativeFullscreenHandler);
        _adModel.on('change:state', _changeStateEvent2.default, _this);
        _adModel.on(_events.ERROR, function (data) {
            _this.trigger(_events.ERROR, data);
        }, _this);
        // Listen to media element for events that indicate src was reset or load() was called
        _this.srcReset = function () {
            mediaModelContext.srcReset();
        };
        mediaElement.addEventListener('abort', _this.srcReset);
        mediaElement.addEventListener('emptied', _this.srcReset);
        this._adModel = _adModel;
    };

    /** Load an instream item and initialize playback **/
    _this.load = function () {
        // Let the player media model know we're using it's video tag
        _this.srcReset();

        // Make sure it chooses a provider
        _adModel.stopVideo();
        _adModel.setItemIndex(0).then(function () {
            if (!_adModel) {
                return;
            }
            _checkProvider(_adModel.getVideo());
        });
        _checkProvider();

        // Load the instream item
        return _adModel.playVideo();
    };

    _this.applyProviderListeners = function (provider) {
        // check provider after item change
        _checkProvider(provider);

        if (!provider) {
            return;
        }

        // Match the main player's controls state
        provider.off(_events.ERROR);
        provider.on(_events.ERROR, function (data) {
            this.trigger(_events.ERROR, data);
        }, _this);
        _model.on('change:volume', function (data, value) {
            provider.volume(value);
        }, _this);
        _model.on('change:mute', function (data, value) {
            provider.mute(value);
        }, _this);
        _model.on('change:autostartMuted', function (data, value) {
            if (!value) {
                provider.mute(_model.get('mute'));
            }
        }, _this);
    };

    /** Stop the instream playback and revert the main player back to its original state **/
    this.instreamDestroy = function () {
        if (!_adModel) {
            return;
        }

        _adModel.off();
        if (_adModel.mediaModel) {
            _adModel.mediaModel.off();
        }

        // We don't want the instream provider to be attached to the video tag anymore
        this.off();
        if (_currentProvider) {
            _currentProvider.detachMedia();
            _currentProvider.off();
            if (_adModel.getVideo()) {
                _currentProvider.destroy();
            }
        }

        var mediaElement = _adModel.get('mediaElement');
        mediaElement.removeEventListener('abort', _this.srcReset);
        mediaElement.removeEventListener('emptied', _this.srcReset);

        // Reset the player media model if the src was changed externally
        var srcChanged = mediaElement.src !== _adModel.get('mediaSrc');
        if (srcChanged) {
            _model.mediaModel.srcReset();
        }

        // Return the view to its normal state
        _adModel = null;

        // Remove all callbacks for 'this' for all events
        _controller.off(null, null, this);
        _controller = null;
    };

    /** Start instream playback **/
    _this.instreamPlay = function () {
        if (!_adModel.getVideo()) {
            return;
        }
        _adModel.getVideo().play();
    };

    /** Pause instream playback **/
    _this.instreamPause = function () {
        if (!_adModel.getVideo()) {
            return;
        }
        _adModel.getVideo().pause();
    };

    /** ***************************
     ****** Private methods ******
     *****************************/

    function _checkProvider(pseudoProvider) {
        var provider = pseudoProvider || _adModel.getVideo();

        // Clear current provider when applyProviderListeners(null) is called
        _currentProvider = provider;

        if (!provider) {
            return;
        }

        var isVpaidProvider = provider.type === 'vpaid';

        provider.off();
        provider.on('all', function (type, data) {
            if (isVpaidProvider && type === _events.MEDIA_COMPLETE) {
                return;
            }
            this.trigger(type, _extends({}, data, { type: type }));
        }, _this);

        var adMediaModelContext = _adModel.mediaModel;
        provider.on(_events.PLAYER_STATE, function (event) {
            adMediaModelContext.set(_events.PLAYER_STATE, event.newstate);
        });
        adMediaModelContext.on('change:' + _events.PLAYER_STATE, function (changeAdModel, state) {
            stateHandler(state);
        });
        provider.attachMedia();
        provider.volume(_model.get('volume'));
        provider.mute(_model.get('mute') || _model.get('autostartMuted'));
        if (provider.setPlaybackRate) {
            provider.setPlaybackRate(1);
        }
    }

    function stateHandler(state) {
        switch (state) {
            case _events.STATE_PLAYING:
            case _events.STATE_PAUSED:
                _adModel.set(_events.PLAYER_STATE, state);
                break;
            default:
                break;
        }
    }

    function _nativeFullscreenHandler(evt) {
        _model.trigger(evt.type, evt);
        _this.trigger(_events.FULLSCREEN, {
            fullscreen: evt.jwstate
        });
    }

    return _this;
};

exports.default = InstreamHtml5;

/***/ }),
/* 144 */
/*!**********************************!*\
  !*** ./src/js/controller/qoe.js ***!
  \**********************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _events = __webpack_require__(/*! events/events */ 4);

var _timer = __webpack_require__(/*! api/timer */ 17);

var _timer2 = _interopRequireDefault(_timer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TAB_HIDDEN = 'tabHidden';
var TAB_VISIBLE = 'tabVisible';

// This is to provide a first frame event even when
//  a provider does not give us one.
var onTimeIncreasesGenerator = function onTimeIncreasesGenerator(callback) {
    var lastVal = 0;
    return function (evt) {
        var pos = evt.position;
        if (pos > lastVal) {
            callback();
        }
        // sometimes the number will wrap around (ie 100 down to 0)
        //  so always update
        lastVal = pos;
    };
};

function unbindFirstFrameEvents(model) {
    model.mediaController.off(_events.MEDIA_PLAY_ATTEMPT, model._onPlayAttempt);
    model.mediaController.off(_events.PROVIDER_FIRST_FRAME, model._triggerFirstFrame);
    model.mediaController.off(_events.MEDIA_TIME, model._onTime);
    model.off('change:activeTab', model._onTabVisible);
}

function trackFirstFrame(model) {
    if (model._onTabVisible) {
        unbindFirstFrameEvents(model);
    }

    // When it occurs, send the event, and unbind all listeners
    var once = false;
    model._triggerFirstFrame = function () {
        if (once) {
            return;
        }
        once = true;
        var qoeItem = model._qoeItem;
        qoeItem.tick(_events.MEDIA_FIRST_FRAME);

        var time = qoeItem.getFirstFrame();
        model.mediaController.trigger(_events.MEDIA_FIRST_FRAME, { loadTime: time });
        unbindFirstFrameEvents(model);
    };

    model._onTime = onTimeIncreasesGenerator(model._triggerFirstFrame);

    model._onPlayAttempt = function () {
        model._qoeItem.tick(_events.MEDIA_PLAY_ATTEMPT);
    };

    // track visibility change
    model._onTabVisible = function (modelChanged, activeTab) {
        if (activeTab) {
            model._qoeItem.tick(TAB_VISIBLE);
        } else {
            model._qoeItem.tick(TAB_HIDDEN);
        }
    };

    model.on('change:activeTab', model._onTabVisible);
    model.mediaController.on(_events.MEDIA_PLAY_ATTEMPT, model._onPlayAttempt);
    model.mediaController.once(_events.PROVIDER_FIRST_FRAME, model._triggerFirstFrame);
    model.mediaController.on(_events.MEDIA_TIME, model._onTime);
}

var initQoe = function initQoe(initialModel) {
    function onMediaModel(model, mediaModel, oldMediaModel) {
        // finish previous item
        if (model._qoeItem && oldMediaModel) {
            model._qoeItem.end(oldMediaModel.get('state'));
        }
        // reset item level qoe
        model._qoeItem = new _timer2.default();
        model._qoeItem.getFirstFrame = function () {
            var time = this.between(_events.MEDIA_PLAY_ATTEMPT, _events.MEDIA_FIRST_FRAME);
            // If time between the tab becoming visible and first frame is valid
            // and less than the time since play attempt, play was not attempted until the tab became visible
            var timeActive = this.between(TAB_VISIBLE, _events.MEDIA_FIRST_FRAME);
            if (timeActive > 0 && timeActive < time) {
                return timeActive;
            }
            return time;
        };
        model._qoeItem.tick(_events.PLAYLIST_ITEM);
        model._qoeItem.start(mediaModel.get('state'));

        trackFirstFrame(model);

        mediaModel.on('change:state', function (changeMediaModel, newstate, oldstate) {
            if (newstate !== oldstate) {
                model._qoeItem.end(oldstate);
                model._qoeItem.start(newstate);
            }
        });
    }

    initialModel.on('change:mediaModel', onMediaModel);
};

exports.default = initQoe;

/***/ }),
/* 145 */
/*!*********************************************!*\
  !*** ./src/js/controller/instream-flash.js ***!
  \*********************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _environment = __webpack_require__(/*! environment/environment */ 22);

var _events = __webpack_require__(/*! events/events */ 4);

var _backbone = __webpack_require__(/*! utils/backbone.events */ 7);

var _backbone2 = _interopRequireDefault(_backbone);

var _model2 = __webpack_require__(/*! controller/model */ 74);

var _model3 = _interopRequireDefault(_model2);

var _changeStateEvent = __webpack_require__(/*! events/change-state-event */ 73);

var _changeStateEvent2 = _interopRequireDefault(_changeStateEvent);

var _promise = __webpack_require__(/*! polyfills/promise */ 6);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var InstreamFlash = function InstreamFlash(_controller, _model) {
    this.model = _model;

    this._adModel = new _model3.default().setup({
        id: _model.get('id'),
        volume: _model.get('volume'),
        fullscreen: _model.get('fullscreen'),
        mute: _model.get('mute')
    });

    this._adModel.on('change:state', _changeStateEvent2.default, this);

    var container = _controller.getContainer();
    this.swf = container.querySelector('object');
};

_extends(InstreamFlash.prototype, {

    init: function init() {
        // Pause playback when throttled, and only resume is paused here
        if (_environment.Browser.chrome) {
            var _throttleTimeout = -1;
            var _throttlePaused = false;
            this.swf.on('throttle', function (e) {
                clearTimeout(_throttleTimeout);

                if (e.state === 'resume') {
                    if (_throttlePaused) {
                        _throttlePaused = false;
                        this.instreamPlay();
                    }
                } else {
                    var _this = this;
                    _throttleTimeout = setTimeout(function () {
                        if (_this._adModel.get('state') === _events.STATE_PLAYING) {
                            _throttlePaused = true;
                            _this.instreamPause();
                        }
                    }, 250);
                }
            }, this);
        }

        this.swf.on('instream:state', this.stateHandler, this).on('instream:time', function (evt) {
            this._adModel.set('position', evt.position);
            this._adModel.set('duration', evt.duration);
            this.trigger(_events.MEDIA_TIME, evt);
        }, this).on('instream:complete', function (evt) {
            this.trigger(_events.MEDIA_COMPLETE, evt);
        }, this).on('instream:error', function (evt) {
            this.trigger(_events.MEDIA_ERROR, evt);
        }, this);

        this.swf.triggerFlash('instream:init');

        this.applyProviderListeners = function (provider) {
            if (!provider) {
                return;
            }
            this.model.on('change:volume', function (data, value) {
                provider.volume(value);
            }, this);
            this.model.on('change:mute', function (data, value) {
                provider.mute(value);
            }, this);

            provider.volume(this.model.get('volume'));
            provider.mute(this.model.get('mute'));

            // update admodel state when set from googima
            provider.off();
            provider.on(_events.PLAYER_STATE, this.stateHandler, this);

            // trigger time evemt when sent from freewheel
            provider.on(_events.MEDIA_TIME, function (data) {
                this.trigger(_events.MEDIA_TIME, data);
            }, this);
        };
    },

    stateHandler: function stateHandler(evt) {
        switch (evt.newstate) {
            case _events.STATE_PLAYING:
            case _events.STATE_PAUSED:
                this._adModel.set('state', evt.newstate);
                break;
            default:
                break;
        }
    },

    instreamDestroy: function instreamDestroy() {
        if (!this._adModel) {
            return;
        }

        this.off();

        this.swf.off(null, null, this);
        this.swf.triggerFlash('instream:destroy');
        this.swf = null;

        this._adModel.off();
        this._adModel = null;

        this.model = null;
    },

    load: function load(item) {
        this._adModel.set('state', _events.STATE_BUFFERING);
        // Show the instream layer
        this.swf.triggerFlash('instream:load', item);
        return _promise.resolved;
    },

    instreamPlay: function instreamPlay() {
        this.swf.triggerFlash('instream:play');
    },

    instreamPause: function instreamPause() {
        this.swf.triggerFlash('instream:pause');
    }

}, _backbone2.default);

exports.default = InstreamFlash;

/***/ }),
/* 146 */
/*!***************************************!*\
  !*** ./src/js/controller/captions.js ***!
  \***************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _tracksLoader = __webpack_require__(/*! controller/tracks-loader */ 84);

var _tracksHelper = __webpack_require__(/*! controller/tracks-helper */ 85);

var _backbone = __webpack_require__(/*! utils/backbone.events */ 7);

var _backbone2 = _interopRequireDefault(_backbone);

var _events = __webpack_require__(/*! events/events */ 4);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** Displays closed captions or subtitles on top of the video. **/
var Captions = function Captions(_model) {

    // Reset and load external captions on playlist item
    _model.on('change:playlistItem', _itemHandler, this);

    // Listen for captions menu index changes from the view
    _model.on('change:captionsIndex', _captionsIndexHandler, this);

    // Listen for item ready to determine which provider is in use
    _model.on('itemReady', _itemReadyHandler, this);

    // Listen for provider subtitle tracks
    //   ignoring provider "subtitlesTrackChanged" since index should be managed here
    _model.mediaController.on('subtitlesTracks', _subtitlesTracksHandler, this);

    function _subtitlesTracksHandler(e) {
        if (!e.tracks.length) {
            return;
        }

        var tracks = e.tracks || [];
        for (var i = 0; i < tracks.length; i++) {
            _addTrack(tracks[i]);
        }

        // To avoid duplicate tracks in the menu when we reuse an _id, regenerate the tracks array
        _tracks = Object.keys(_tracksById).map(function (id) {
            return _tracksById[id];
        });

        var captionsMenu = _captionsMenu();
        _selectDefaultIndex();
        this.setCaptionsList(captionsMenu);
    }

    var _tracks = [];
    var _tracksById = {};
    var _unknownCount = 0;

    /** Listen to playlist item updates. **/
    function _itemHandler() {
        _tracks = [];
        _tracksById = {};
        _unknownCount = 0;
    }

    function _itemReadyHandler(item) {
        var _this = this;

        // Clean up in case we're replaying
        _itemHandler(_model, item);

        var tracks = item.tracks;
        var len = tracks && tracks.length;

        // Sideload tracks when not rendering natively
        if (!_model.get('renderCaptionsNatively') && len) {
            var _loop = function _loop(i) {
                /* eslint-disable no-loop-func */
                var track = tracks[i];
                if (_kindSupported(track.kind) && !_tracksById[track._id]) {
                    _addTrack(track);
                    (0, _tracksLoader.loadFile)(track, function (vttCues) {
                        _addVTTCuesToTrack(track, vttCues);
                    }, function (error) {
                        _this.trigger(_events.ERROR, {
                            message: 'Captions failed to load',
                            reason: error
                        });
                    });
                }
            };

            for (var i = 0; i < len; i++) {
                _loop(i);
            }
        }

        var captionsMenu = _captionsMenu();
        _selectDefaultIndex();
        this.setCaptionsList(captionsMenu);
    }

    function _kindSupported(kind) {
        return kind === 'subtitles' || kind === 'captions';
    }

    function _addVTTCuesToTrack(track, vttCues) {
        track.data = vttCues;
    }

    function _captionsIndexHandler(model, captionsMenuIndex) {
        var track = null;
        if (captionsMenuIndex !== 0) {
            track = _tracks[captionsMenuIndex - 1];
        }
        model.set('captionsTrack', track);
    }

    function _addTrack(track) {
        track.data = track.data || [];
        track.name = track.label || track.name || track.language;
        track._id = (0, _tracksHelper.createId)(track, _tracks.length);

        if (!track.name) {
            var labelInfo = (0, _tracksHelper.createLabel)(track, _unknownCount);
            track.name = labelInfo.label;
            _unknownCount = labelInfo.unknownCount;
        }

        // During the same playlist we may reu and readd tracks with the same _id; allow the new track to replace the old
        _tracksById[track._id] = track;
        _tracks.push(track);
    }

    function _captionsMenu() {
        var list = [{
            id: 'off',
            label: 'Off'
        }];
        for (var i = 0; i < _tracks.length; i++) {
            list.push({
                id: _tracks[i]._id,
                label: _tracks[i].name || 'Unknown CC'
            });
        }
        return list;
    }

    function _selectDefaultIndex() {
        var captionsMenuIndex = 0;
        var label = _model.get('captionLabel');

        // Because there is no explicit track for "Off"
        //  it is the implied zeroth track
        if (label === 'Off') {
            _model.set('captionsIndex', 0);
            return;
        }

        for (var i = 0; i < _tracks.length; i++) {
            var _track = _tracks[i];
            if (label && label === _track.name) {
                captionsMenuIndex = i + 1;
                break;
            } else if (_track.default || _track.defaulttrack || _track._id === 'default') {
                captionsMenuIndex = i + 1;
            } else if (_track.autoselect) {
                // TODO: auto select track by comparing track.language to system lang
            }
        }
        // set the index without the side effect of storing the Off label in _selectCaptions
        _setCurrentIndex(captionsMenuIndex);
    }

    function _setCurrentIndex(index) {
        if (_tracks.length) {
            _model.setVideoSubtitleTrack(index, _tracks);
        } else {
            _model.set('captionsIndex', index);
        }
    }

    this.getCurrentIndex = function () {
        return _model.get('captionsIndex');
    };

    this.getCaptionsList = function () {
        return _model.get('captionsList');
    };

    this.setCaptionsList = function (captionsMenu) {
        _model.set('captionsList', captionsMenu);
    };

    this.destroy = function () {
        this.off(null, null, this);
    };
};

_extends(Captions.prototype, _backbone2.default);

exports.default = Captions;

/***/ }),
/* 147 */
/*!*****************************!*\
  !*** ./src/js/view/view.js ***!
  \*****************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _player = __webpack_require__(/*! templates/player */ 148);

var _player2 = _interopRequireDefault(_player);

var _errorContainer = __webpack_require__(/*! view/error-container */ 34);

var _errorContainer2 = _interopRequireDefault(_errorContainer);

var _audioMode = __webpack_require__(/*! view/utils/audio-mode */ 149);

var _viewsManager = __webpack_require__(/*! view/utils/views-manager */ 150);

var _viewsManager2 = _interopRequireDefault(_viewsManager);

var _visibility = __webpack_require__(/*! view/utils/visibility */ 151);

var _visibility2 = _interopRequireDefault(_visibility);

var _activeTab = __webpack_require__(/*! utils/active-tab */ 83);

var _activeTab2 = _interopRequireDefault(_activeTab);

var _requestAnimationFrame = __webpack_require__(/*! utils/request-animation-frame */ 75);

var _breakpoint2 = __webpack_require__(/*! view/utils/breakpoint */ 76);

var _skin = __webpack_require__(/*! view/utils/skin */ 152);

var _environment = __webpack_require__(/*! environment/environment */ 22);

var _controlsLoader = __webpack_require__(/*! controller/controls-loader */ 38);

var ControlsLoader = _interopRequireWildcard(_controlsLoader);

var _events = __webpack_require__(/*! events/events */ 4);

var _backbone = __webpack_require__(/*! utils/backbone.events */ 7);

var _backbone2 = _interopRequireDefault(_backbone);

var _dom = __webpack_require__(/*! utils/dom */ 21);

var _css = __webpack_require__(/*! utils/css */ 23);

var _underscore = __webpack_require__(/*! utils/underscore */ 0);

var _underscore2 = _interopRequireDefault(_underscore);

var _requestFullscreenHelper = __webpack_require__(/*! view/utils/request-fullscreen-helper */ 153);

var _requestFullscreenHelper2 = _interopRequireDefault(_requestFullscreenHelper);

var _flagNoFocus = __webpack_require__(/*! view/utils/flag-no-focus */ 154);

var _flagNoFocus2 = _interopRequireDefault(_flagNoFocus);

var _clickhandler = __webpack_require__(/*! view/utils/clickhandler */ 155);

var _clickhandler2 = _interopRequireDefault(_clickhandler);

var _captionsrenderer = __webpack_require__(/*! view/captionsrenderer */ 156);

var _captionsrenderer2 = _interopRequireDefault(_captionsrenderer);

var _logo2 = __webpack_require__(/*! view/logo */ 157);

var _logo3 = _interopRequireDefault(_logo2);

var _preview2 = __webpack_require__(/*! view/preview */ 159);

var _preview3 = _interopRequireDefault(_preview2);

var _title2 = __webpack_require__(/*! view/title */ 160);

var _title3 = _interopRequireDefault(_title2);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

__webpack_require__(/*! css/jwplayer.less */ 161);

var ControlsModule = void 0;

var _isMobile = _environment.OS.mobile;
var _isIE = _environment.Browser.ie;

function View(_api, _model) {
    var _this = _extends(this, _backbone2.default, {
        isSetup: false,
        api: _api,
        model: _model
    });

    // init/reset view model properties
    _extends(_model.attributes, {
        containerWidth: undefined,
        containerHeight: undefined,
        mediaContainer: undefined,
        fullscreen: false,
        inDom: undefined,
        iFrame: undefined,
        activeTab: undefined,
        intersectionRatio: undefined,
        visibility: undefined,
        viewable: undefined,
        viewSetup: false,
        audioMode: undefined,
        touchMode: undefined,
        altText: '',
        cues: undefined,
        castClicked: false,
        scrubbing: false,
        logoWidth: 0
    });

    var _playerElement = (0, _dom.createElement)((0, _player2.default)(_model.get('id'), _model.get('localization').player));
    var _videoLayer = _playerElement.querySelector('.jw-media');

    var _preview = new _preview3.default(_model);
    var _title = new _title3.default(_model);

    var _captionsRenderer = new _captionsrenderer2.default(_model);
    _captionsRenderer.on('all', _this.trigger, _this);

    var _logo = void 0;

    var _playerState = void 0;

    var _lastWidth = void 0;
    var _lastHeight = void 0;

    var _instreamModel = void 0;

    var _resizeMediaTimeout = -1;
    var _resizeContainerRequestId = -1;
    var _stateClassRequestId = -1;

    var displayClickHandler = void 0;
    var fullscreenHelpers = void 0;
    var focusHelper = void 0;

    var _breakpoint = null;
    var _controls = void 0;

    function reasonInteraction() {
        return { reason: 'interaction' };
    }

    this.updateBounds = function () {
        (0, _requestAnimationFrame.cancelAnimationFrame)(_resizeContainerRequestId);
        var inDOM = document.body.contains(_playerElement);
        var rect = (0, _dom.bounds)(_playerElement);
        var containerWidth = Math.round(rect.width);
        var containerHeight = Math.round(rect.height);

        // If the container is the same size as before, return early
        if (containerWidth === _lastWidth && containerHeight === _lastHeight) {
            // Listen for player to be added to DOM
            if (!_lastWidth || !_lastHeight) {
                _responsiveListener();
            }
            _model.set('inDom', inDOM);
            return;
        }
        // If we have bad values for either dimension, return early
        if (!containerWidth || !containerHeight) {
            // If we haven't established player size, try again
            if (!_lastWidth || !_lastHeight) {
                _responsiveListener();
            }
        }

        // Don't update container dimensions to 0, 0 when not in DOM
        if (containerWidth || containerHeight || inDOM) {
            _model.set('containerWidth', containerWidth);
            _model.set('containerHeight', containerHeight);
        }
        _model.set('inDom', inDOM);

        if (inDOM) {
            _viewsManager2.default.observe(_playerElement);
        }
    };

    this.updateStyles = function () {
        var containerWidth = _model.get('containerWidth');
        var containerHeight = _model.get('containerHeight');

        if (_model.get('controls')) {
            updateContainerStyles(containerWidth, containerHeight);
        }

        if (_controls) {
            _controls.resize(containerWidth, containerHeight);
        }

        _resizeMedia(containerWidth, containerHeight);
        _captionsRenderer.resize();
    };

    this.checkResized = function () {
        var containerWidth = _model.get('containerWidth');
        var containerHeight = _model.get('containerHeight');
        if (containerWidth !== _lastWidth || containerHeight !== _lastHeight) {
            _lastWidth = containerWidth;
            _lastHeight = containerHeight;
            _this.trigger(_events.RESIZE, {
                width: containerWidth,
                height: containerHeight
            });
            var breakpoint = (0, _breakpoint2.getBreakpoint)(containerWidth);
            if (_breakpoint !== breakpoint) {
                _breakpoint = breakpoint;
                _this.trigger(_events.BREAKPOINT, {
                    breakpoint: _breakpoint
                });
            }
        }
    };

    function _responsiveListener() {
        (0, _requestAnimationFrame.cancelAnimationFrame)(_resizeContainerRequestId);
        _resizeContainerRequestId = (0, _requestAnimationFrame.requestAnimationFrame)(_responsiveUpdate);
    }

    function _responsiveUpdate() {
        if (!_this.isSetup) {
            return;
        }
        _this.updateBounds();
        _this.updateStyles();
        _this.checkResized();
    }

    function updateContainerStyles(width, height) {
        var audioMode = (0, _audioMode.isAudioMode)(_model);
        // Set timeslider flags
        if (_underscore2.default.isNumber(width) && _underscore2.default.isNumber(height)) {
            var breakpoint = (0, _breakpoint2.getBreakpoint)(width);
            (0, _breakpoint2.setBreakpoint)(_playerElement, breakpoint);

            var smallPlayer = breakpoint < 2;
            (0, _dom.toggleClass)(_playerElement, 'jw-flag-small-player', smallPlayer);
            (0, _dom.toggleClass)(_playerElement, 'jw-orientation-portrait', height > width);
        }
        (0, _dom.toggleClass)(_playerElement, 'jw-flag-audio-player', audioMode);
        _model.set('audioMode', audioMode);
    }

    this.setup = function () {
        var _this2 = this;

        _preview.setup(_playerElement.querySelector('.jw-preview'));
        _title.setup(_playerElement.querySelector('.jw-title'));

        _logo = new _logo3.default(_model);
        _logo.setup();
        _logo.setContainer(_playerElement);
        _logo.on(_events.LOGO_CLICK, _logoClickHandler);

        // captions rendering
        _captionsRenderer.setup(_playerElement.id, _model.get('captions'));

        // captions should be placed behind controls, and not hidden when controls are hidden
        _playerElement.insertBefore(_captionsRenderer.element(), _title.element());

        // Display Click and Double Click Handling
        displayClickHandler = clickHandlerHelper(_api, _model, _videoLayer);

        focusHelper = (0, _flagNoFocus2.default)(_playerElement);
        fullscreenHelpers = (0, _requestFullscreenHelper2.default)(_playerElement, document, _fullscreenChangeHandler);

        _model.on('change:errorEvent', _errorHandler);
        _model.on('change:hideAdsControls', function (model, val) {
            (0, _dom.toggleClass)(_playerElement, 'jw-flag-ads-hide-controls', val);
        });
        _model.on('change:scrubbing', function (model, val) {
            (0, _dom.toggleClass)(_playerElement, 'jw-flag-dragging', val);
        });
        _model.on('change:playRejected', function (model, val) {
            (0, _dom.toggleClass)(_playerElement, 'jw-flag-play-rejected', val);
        });

        // Native fullscreen (coming through from the provider)
        _model.mediaController.on('fullscreenchange', _fullscreenChangeHandler);

        _model.change('mediaModel', function (model, mediaModel) {
            mediaModel.change('mediaType', _onMediaTypeChange, _this2);
            mediaModel.on('change:visualQuality', function () {
                _resizeMedia();
            }, _this2);
        });
        _model.change('stretching', onStretchChange);
        _model.change('flashBlocked', onFlashBlockedChange);

        var width = _model.get('width');
        var height = _model.get('height');
        _resizePlayer(width, height);
        _model.change('aspectratio', onAspectRatioChange);
        if (_model.get('controls')) {
            updateContainerStyles(width, height);
        } else {
            (0, _dom.addClass)(_playerElement, 'jw-flag-controls-hidden');
        }

        if (_isIE) {
            (0, _dom.addClass)(_playerElement, 'jw-ie');
        }

        var skin = _model.get('skin') || {};

        if (skin.name) {
            (0, _dom.replaceClass)(_playerElement, /jw-skin-\S+/, 'jw-skin-' + skin.name);
        }

        var skinColors = (0, _skin.normalizeSkin)(skin);
        (0, _skin.handleColorOverrides)(_model.get('id'), skinColors);

        // adds video tag to video layer
        _model.set('mediaContainer', _videoLayer);
        _model.set('iFrame', _environment.Features.iframe);
        _model.set('activeTab', (0, _activeTab2.default)());
        _model.set('touchMode', _isMobile && (typeof height === 'string' || height >= _audioMode.CONTROLBAR_ONLY_HEIGHT));

        _viewsManager2.default.add(this);

        this.isSetup = true;
        _model.set('viewSetup', true);

        var inDOM = document.body.contains(_playerElement);
        if (inDOM) {
            _viewsManager2.default.observe(_playerElement);
        }
        _model.set('inDom', inDOM);
    };

    function updateVisibility() {
        _model.set('visibility', (0, _visibility2.default)(_model, _playerElement));
    }

    this.init = function () {
        this.updateBounds();

        _model.on('change:fullscreen', _fullscreen);
        _model.on('change:activeTab', updateVisibility);
        _model.on('change:fullscreen', updateVisibility);
        _model.on('change:intersectionRatio', updateVisibility);
        _model.on('change:visibility', redraw);

        updateVisibility();

        // Always draw first player for icons to load
        if (_viewsManager2.default.size() === 1 && !_model.get('visibility')) {
            redraw(_model, 1, 0);
        }

        _model.change('state', _stateHandler);
        _model.change('controls', changeControls);
        // Set the title attribute of the video tag to display background media information on mobile devices
        if (_isMobile) {
            setMediaTitleAttribute(_model.get('playlistItem'));
            _model.on('itemReady', setMediaTitleAttribute);
        }

        // Triggering 'resize' resulting in player 'ready'
        _lastWidth = _lastHeight = null;
        this.checkResized();
    };

    function changeControls(model, enable) {
        if (enable) {
            ControlsModule = ControlsLoader.module.controls;
            if (!ControlsModule) {
                ControlsLoader.load().then(function (Controls) {
                    ControlsModule = Controls;
                    addControls();
                }).catch(function (reason) {
                    _this.trigger(_events.ERROR, {
                        message: 'Controls failed to load',
                        reason: reason
                    });
                });
            } else {
                addControls();
            }
        } else {
            _this.removeControls();
        }
    }

    function addControls() {
        var controls = new ControlsModule(document, _this.element());
        _this.addControls(controls);
    }

    function setMediaTitleAttribute(item) {
        var videotag = _videoLayer.querySelector('video, audio');
        // chromecast and flash providers do no support video tags
        if (!videotag) {
            return;
        }

        // Writing a string to innerHTML completely decodes multiple-encoded strings
        var dummyDiv = document.createElement('div');
        dummyDiv.innerHTML = item.title || '';
        videotag.setAttribute('title', dummyDiv.textContent);
    }

    function redraw(model, visibility, lastVisibility) {
        if (visibility && !lastVisibility) {
            _stateHandler(_instreamModel || model);
            _this.updateStyles();
        }
    }

    function clickHandlerHelper(api, model, videoLayer) {
        var clickHandler = new _clickhandler2.default(model, videoLayer, { useHover: true });
        var controls = _model.get('controls');
        clickHandler.on({
            click: function click() {
                _this.trigger(_events.DISPLAY_CLICK);

                if (_controls) {
                    if (settingsMenuVisible()) {
                        _controls.settingsMenu.close();
                    } else {
                        api.playToggle(reasonInteraction());
                    }
                }
            },
            tap: function tap() {
                _this.trigger(_events.DISPLAY_CLICK);
                if (settingsMenuVisible()) {
                    _controls.settingsMenu.close();
                }
                var state = model.get('state');

                if (controls && (state === _events.STATE_IDLE || state === _events.STATE_COMPLETE || _instreamModel && _instreamModel.get('state') === _events.STATE_PAUSED)) {
                    api.playToggle(reasonInteraction());
                }

                if (controls && state === _events.STATE_PAUSED) {
                    // Toggle visibility of the controls when tapping the media
                    // Do not add mobile toggle "jw-flag-controls-hidden" in these cases
                    if (_instreamModel || model.get('castActive') || model.mediaModel && model.mediaModel.get('mediaType') === 'audio') {
                        return;
                    }
                    (0, _dom.toggleClass)(_playerElement, 'jw-flag-controls-hidden');
                    _captionsRenderer.renderCues(true);
                } else if (_controls) {
                    if (!_controls.showing) {
                        _controls.userActive();
                    } else {
                        _controls.userInactive();
                    }
                }
            },
            doubleClick: function doubleClick() {
                return _controls && api.setFullscreen();
            },
            move: function move() {
                return _controls && _controls.userActive();
            },
            over: function over() {
                return _controls && _controls.userActive();
            }
        });

        return clickHandler;
    }

    function onStretchChange(model, newVal) {
        (0, _dom.replaceClass)(_playerElement, /jw-stretch-\S+/, 'jw-stretch-' + newVal);
    }

    function onAspectRatioChange(model, aspectratio) {
        (0, _dom.toggleClass)(_playerElement, 'jw-flag-aspect-mode', !!aspectratio);
        var aspectRatioContainer = _playerElement.querySelector('.jw-aspect');
        (0, _css.style)(aspectRatioContainer, {
            paddingTop: aspectratio || null
        });
    }

    function onFlashBlockedChange(model, isBlocked) {
        (0, _dom.toggleClass)(_playerElement, 'jw-flag-flash-blocked', isBlocked);
    }

    function _logoClickHandler(evt) {
        if (!evt.link) {
            if (_model.get('controls')) {
                _api.playToggle(reasonInteraction());
            }
        } else {
            _api.pause(reasonInteraction());
            _api.setFullscreen(false);
            window.open(evt.link, evt.linktarget);
        }
    }

    var _onChangeControls = function _onChangeControls(model, bool) {
        if (bool) {
            // ignore model that triggered this event and use current state model
            _stateHandler(_instreamModel || _model);
        }
    };

    this.addControls = function (controls) {
        _controls = controls;

        (0, _dom.removeClass)(_playerElement, 'jw-flag-controls-hidden');

        _model.change('streamType', _setLiveMode, this);

        controls.enable(_api, _model);
        controls.addActiveListeners(_logo.element());

        var logoContainer = controls.logoContainer();
        if (logoContainer) {
            _logo.setContainer(logoContainer);
        }

        // refresh breakpoint and timeslider classes
        if (_lastHeight) {
            updateContainerStyles(_lastWidth, _lastHeight);
            controls.resize(_lastWidth, _lastHeight);
            _captionsRenderer.renderCues(true);
        }

        controls.on('userActive userInactive', function () {
            if (_playerState === _events.STATE_PLAYING || _playerState === _events.STATE_BUFFERING) {
                _captionsRenderer.renderCues(true);
            }
        });

        controls.on('all', _this.trigger, _this);

        if (_instreamModel) {
            _controls.setupInstream(_instreamModel);
        }

        var overlaysElement = _playerElement.querySelector('.jw-overlays');
        overlaysElement.addEventListener('mousemove', _userActivityCallback);
    };

    this.removeControls = function () {
        _logo.setContainer(_playerElement);

        if (_controls) {
            _controls.removeActiveListeners(_logo.element());
            _controls.disable(_model);
            _controls = null;
        }

        var overlay = document.querySelector('.jw-overlays');
        if (overlay) {
            overlay.removeEventListener('mousemove', _userActivityCallback);
        }

        (0, _dom.addClass)(_playerElement, 'jw-flag-controls-hidden');
    };

    // Perform the switch to fullscreen
    var _fullscreen = function _fullscreen(model, state) {

        // If it supports DOM fullscreen
        var provider = _model.getVideo();

        // Unmute the video so volume can be adjusted with native controls in fullscreen
        if (state && _controls && _model.get('autostartMuted')) {
            _controls.unmuteAutoplay(_api, _model);
        }

        if (fullscreenHelpers.supportsDomFullscreen()) {
            if (state) {
                fullscreenHelpers.requestFullscreen();
            } else {
                fullscreenHelpers.exitFullscreen();
            }
            _toggleDOMFullscreen(_playerElement, state);
        } else if (_isIE) {
            _toggleDOMFullscreen(_playerElement, state);
        } else {
            // else use native fullscreen
            if (_instreamModel && _instreamModel.getVideo()) {
                _instreamModel.getVideo().setFullscreen(state);
            }
            provider.setFullscreen(state);
        }
        // pass fullscreen state to Flash provider
        // provider.getName() is the same as _api.getProvider() or _model.get('provider')
        if (provider && provider.getName().name.indexOf('flash') === 0) {
            provider.setFullscreen(state);
        }
    };

    function _resizePlayer(playerWidth, playerHeight, resetAspectMode) {
        var widthSet = playerWidth !== undefined;
        var heightSet = playerHeight !== undefined;
        var playerStyle = {
            width: playerWidth
        };

        // when jwResize is called remove aspectMode and force layout
        if (heightSet && resetAspectMode) {
            _model.set('aspectratio', null);
        }
        if (!_model.get('aspectratio')) {
            // If the height is a pixel value (number) greater than 0, snap it to the minimum supported height
            // Allow zero to mean "hide the player"
            var height = playerHeight;
            if (_underscore2.default.isNumber(height) && height !== 0) {
                height = Math.max(height, _audioMode.CONTROLBAR_ONLY_HEIGHT);
            }
            playerStyle.height = height;
        }

        if (widthSet && heightSet) {
            _model.set('width', playerWidth);
            _model.set('height', playerHeight);
        }

        (0, _css.style)(_playerElement, playerStyle);
    }

    function _resizeMedia(containerWidth, containerHeight) {
        if (!containerWidth || isNaN(1 * containerWidth)) {
            containerWidth = _model.get('containerWidth');
            if (!containerWidth) {
                return;
            }
        }
        if (!containerHeight || isNaN(1 * containerHeight)) {
            containerHeight = _model.get('containerHeight');
            if (!containerHeight) {
                return;
            }
        }

        if (_preview) {
            _preview.resize(containerWidth, containerHeight, _model.get('stretching'));
        }

        var provider = _model.getVideo();
        if (!provider) {
            return;
        }
        var transformScale = provider.resize(containerWidth, containerHeight, _model.get('stretching'));

        // poll resizing if video is transformed
        if (transformScale) {
            clearTimeout(_resizeMediaTimeout);
            _resizeMediaTimeout = setTimeout(_resizeMedia, 250);
        }
    }

    this.resize = function (playerWidth, playerHeight) {
        var resetAspectMode = true;
        _resizePlayer(playerWidth, playerHeight, resetAspectMode);
        _responsiveUpdate();
    };
    this.resizeMedia = _resizeMedia;

    /**
     * Return whether or not we're in native fullscreen
     */
    function _isNativeFullscreen() {
        if (fullscreenHelpers.supportsDomFullscreen()) {
            var fsElement = fullscreenHelpers.fullscreenElement();
            return !!(fsElement && fsElement.id === _model.get('id'));
        }
        // if player element view fullscreen not available, return video fullscreen state
        return _instreamModel ? _instreamModel.getVideo().getFullScreen() : _model.getVideo().getFullScreen();
    }

    function _fullscreenChangeHandler(event) {
        var modelState = _model.get('fullscreen');
        var newState = event.jwstate !== undefined ? event.jwstate : _isNativeFullscreen();

        // If fullscreen was triggered by something other than the player
        //  then we want to sync up our internal state
        if (modelState !== newState) {
            _model.set('fullscreen', newState);
        }

        _responsiveListener();
        clearTimeout(_resizeMediaTimeout);
        _resizeMediaTimeout = setTimeout(_resizeMedia, 200);
    }

    function _toggleDOMFullscreen(playerElement, fullscreenState) {
        (0, _dom.toggleClass)(playerElement, 'jw-flag-fullscreen', fullscreenState);
        (0, _css.style)(document.body, { overflowY: fullscreenState ? 'hidden' : '' });

        if (fullscreenState && _controls) {
            // When going into fullscreen, we want the control bar to fade after a few seconds
            _controls.userActive();
        }

        _resizeMedia();
        _responsiveListener();
    }

    function _setLiveMode(model, streamType) {
        if (!_instreamModel) {
            var live = streamType === 'LIVE';
            (0, _dom.toggleClass)(_playerElement, 'jw-flag-live', live);
        }
    }

    function _userActivityCallback() /* event */{
        _controls.userActive();
    }

    function _onMediaTypeChange(model, val) {
        var isAudioFile = val === 'audio';
        var provider = _model.getVideo();
        var isFlash = provider && provider.getName().name.indexOf('flash') === 0;

        (0, _dom.toggleClass)(_playerElement, 'jw-flag-media-audio', isAudioFile);

        var element = isAudioFile && !isFlash ? _videoLayer : _videoLayer.nextSibling;
        // Put the preview element before the media element in order to display browser captions
        // otherwise keep it on top of the media element to display captions with the captions renderer
        _playerElement.insertBefore(_preview.el, element);
    }

    function _errorHandler(model, evt) {
        if (!evt) {
            _title.playlistItem(model, model.get('playlistItem'));
            return;
        }
        var errorContainer = (0, _errorContainer2.default)(_model, evt.message);
        if (_errorContainer2.default.cloneIcon) {
            errorContainer.querySelector('.jw-icon').appendChild(_errorContainer2.default.cloneIcon('error'));
        }
        _playerElement.appendChild(errorContainer.firstChild);
        (0, _dom.toggleClass)(_playerElement, 'jw-flag-audio-player', !!model.get('audioMode'));
    }

    function _stateHandler(model, newState, oldState) {
        if (!_model.get('viewSetup')) {
            return;
        }

        _playerState = model.get('state');

        instreamStateUpdate(_playerState);

        if (oldState === _events.STATE_ERROR) {
            var errorContainer = _playerElement.querySelector('.jw-error-msg');
            if (errorContainer) {
                errorContainer.parentNode.removeChild(errorContainer);
            }
        }

        (0, _requestAnimationFrame.cancelAnimationFrame)(_stateClassRequestId);
        if (_playerState === _events.STATE_PLAYING || _playerState === _events.STATE_IDLE && _model.get('autostart')) {
            _stateUpdate(_playerState);
        } else {
            _stateClassRequestId = (0, _requestAnimationFrame.requestAnimationFrame)(function () {
                return _stateUpdate(_playerState);
            });
        }
    }

    function instreamStateUpdate(state) {
        var instreamState = null;
        if (_instreamModel) {
            instreamState = state;
        }
        if (_controls) {
            _controls.instreamState = instreamState;
        }
    }

    function _stateUpdate(state) {
        if (_model.get('controls') && state !== _events.STATE_PAUSED && (0, _dom.hasClass)(_playerElement, 'jw-flag-controls-hidden')) {
            (0, _dom.removeClass)(_playerElement, 'jw-flag-controls-hidden');
        }
        (0, _dom.replaceClass)(_playerElement, /jw-state-\S+/, 'jw-state-' + state);

        _model.off('change:playlistItem', setPosterImage);
        switch (state) {
            case _events.STATE_IDLE:
            case _events.STATE_ERROR:
            case _events.STATE_COMPLETE:
                _model.change('playlistItem', setPosterImage);
                if (_captionsRenderer) {
                    _captionsRenderer.hide();
                }
                break;
            default:
                if (_captionsRenderer) {
                    _captionsRenderer.show();
                    if (state === _events.STATE_PAUSED && _controls && !_controls.showing) {
                        _captionsRenderer.renderCues(true);
                    }
                }
                break;
        }
    }

    function setPosterImage(model) {
        var playlistItem = model.get('playlistItem');
        _preview.setImage(playlistItem && playlistItem.image);
    }

    var settingsMenuVisible = function settingsMenuVisible() {
        var settingsMenu = _controls && _controls.settingsMenu;
        return !!(settingsMenu && settingsMenu.visible);
    };

    this.setupInstream = function (instreamModel) {
        this.instreamModel = _instreamModel = instreamModel;
        _instreamModel.on('change:controls', _onChangeControls, this);
        _instreamModel.on('change:state', _stateHandler, this);
        _instreamModel.on('change:playRejected', function (model, val) {
            (0, _dom.toggleClass)(_playerElement, 'jw-flag-play-rejected', val);
        }, this);

        (0, _dom.addClass)(_playerElement, 'jw-flag-ads');
        (0, _dom.removeClass)(_playerElement, 'jw-flag-live');

        if (_controls) {
            _controls.setupInstream(instreamModel);
        }
    };

    this.setAltText = function (text) {
        _model.set('altText', text);
    };

    this.destroyInstream = function () {
        if (_instreamModel) {
            _instreamModel.off(null, null, this);
            _instreamModel = null;
        }
        if (!displayClickHandler) {
            // view was destroyed
            return;
        }
        if (_controls) {
            _controls.destroyInstream(_model);
        }

        this.setAltText('');
        (0, _dom.removeClass)(_playerElement, ['jw-flag-ads', 'jw-flag-ads-hide-controls']);
        _model.set('hideAdsControls', false);
        var provider = _model.getVideo();
        if (provider) {
            provider.setContainer(_videoLayer);
        }
        _setLiveMode(_model, _model.get('streamType'));
        // reset display click handler
        displayClickHandler.revertAlternateClickHandlers();
    };

    this.addCues = function (cues) {
        _model.set('cues', cues);
    };

    this.clickHandler = function () {
        return displayClickHandler;
    };

    this.getContainer = this.element = function () {
        return _playerElement;
    };

    this.controlsContainer = function () {
        if (_controls) {
            return _controls.element();
        }
        return null;
    };

    this.getSafeRegion = function () {
        var excludeControlbar = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

        var safeRegion = {
            x: 0,
            y: 0,
            width: _lastWidth || 0,
            height: _lastHeight || 0
        };
        if (_controls) {
            // Subtract controlbar from the bottom when using one
            if (excludeControlbar) {
                safeRegion.height -= _controls.controlbarHeight();
            }
        }
        return safeRegion;
    };

    this.setCaptions = function (captionsStyle) {
        _captionsRenderer.clear();
        _captionsRenderer.setup(_model.get('id'), captionsStyle);
        _captionsRenderer.resize();
    };

    this.destroy = function () {
        _viewsManager2.default.unobserve(_playerElement);
        _viewsManager2.default.remove(this);
        this.isSetup = false;
        this.off();
        (0, _requestAnimationFrame.cancelAnimationFrame)(_resizeContainerRequestId);
        clearTimeout(_resizeMediaTimeout);
        if (focusHelper) {
            focusHelper.destroy();
            focusHelper = null;
        }
        if (fullscreenHelpers) {
            fullscreenHelpers.destroy();
            fullscreenHelpers = null;
        }
        if (_model.mediaController) {
            _model.mediaController.off('fullscreenchange', _fullscreenChangeHandler);
        }
        if (_controls) {
            _controls.disable(_model);
        }

        if (_instreamModel) {
            this.destroyInstream();
        }
        if (displayClickHandler) {
            displayClickHandler.destroy();
            displayClickHandler = null;
        }
        if (_captionsRenderer) {
            _captionsRenderer.destroy();
            _captionsRenderer = null;
        }
        if (_logo) {
            _logo.destroy();
            _logo = null;
        }
        (0, _css.clearCss)(_model.get('id'));
    };
}

exports.default = View;

/***/ }),
/* 148 */
/*!*********************************!*\
  !*** ./src/templates/player.js ***!
  \*********************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (id) {
    var ariaLabel = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

    return '<div id="' + id + '" class="jwplayer jw-reset jw-state-setup" tabindex="0" aria-label="' + ariaLabel + '">' + '<div class="jw-aspect jw-reset"></div>' + '<div class="jw-media jw-reset"></div>' + '<div class="jw-preview jw-reset"></div>' + '<div class="jw-title jw-reset">' + '<div class="jw-title-primary jw-reset"></div>' + '<div class="jw-title-secondary jw-reset"></div>' + '</div>' + '<div class="jw-overlays jw-reset"></div>' + '</div>';
};

/***/ }),
/* 149 */
/*!*****************************************!*\
  !*** ./src/js/view/utils/audio-mode.js ***!
  \*****************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var CONTROLBAR_ONLY_HEIGHT = exports.CONTROLBAR_ONLY_HEIGHT = 44;

var isAudioMode = exports.isAudioMode = function isAudioMode(model) {
    var playerHeight = model.get('height');
    if (model.get('aspectratio')) {
        return false;
    }
    if (typeof playerHeight === 'string' && playerHeight.indexOf('%') > -1) {
        return false;
    }

    // Coerce into Number (don't parse out CSS units)
    var verticalPixels = playerHeight * 1 || NaN;
    verticalPixels = !isNaN(verticalPixels) ? verticalPixels : model.get('containerHeight');
    if (!verticalPixels) {
        return false;
    }

    return verticalPixels && verticalPixels <= CONTROLBAR_ONLY_HEIGHT;
};

/***/ }),
/* 150 */
/*!********************************************!*\
  !*** ./src/js/view/utils/views-manager.js ***!
  \********************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _activeTab = __webpack_require__(/*! utils/active-tab */ 83);

var _activeTab2 = _interopRequireDefault(_activeTab);

var _requestAnimationFrame = __webpack_require__(/*! utils/request-animation-frame */ 75);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var views = [];
var observed = {};

var intersectionObserver = void 0;
var responsiveRepaintRequestId = -1;

function lazyInitIntersectionObserver() {
    var IntersectionObserver = window.IntersectionObserver;
    if (!intersectionObserver) {
        // Fire the callback every time 25% of the player comes in/out of view
        intersectionObserver = new IntersectionObserver(function (entries) {
            if (entries && entries.length) {
                for (var i = entries.length; i--;) {
                    var entry = entries[i];
                    for (var j = views.length; j--;) {
                        var view = views[j];
                        if (entry.target === view.getContainer()) {
                            view.model.set('intersectionRatio', entry.intersectionRatio);
                            break;
                        }
                    }
                }
            }
        }, { threshold: [0, 0.25, 0.5, 0.75, 1] });
    }
}

function scheduleResponsiveRedraw() {
    (0, _requestAnimationFrame.cancelAnimationFrame)(responsiveRepaintRequestId);
    responsiveRepaintRequestId = (0, _requestAnimationFrame.requestAnimationFrame)(function responsiveRepaint() {
        views.forEach(function (view) {
            view.updateBounds();
        });
        views.forEach(function (view) {
            if (view.model.get('visibility')) {
                view.updateStyles();
            }
        });
        views.forEach(function (view) {
            view.checkResized();
        });
    });
}

function onVisibilityChange() {
    views.forEach(function (view) {
        view.model.set('activeTab', (0, _activeTab2.default)());
    });
}

document.addEventListener('visibilitychange', onVisibilityChange);
document.addEventListener('webkitvisibilitychange', onVisibilityChange);
window.addEventListener('resize', scheduleResponsiveRedraw);
window.addEventListener('orientationchange', scheduleResponsiveRedraw);

window.addEventListener('beforeunload', function () {
    document.removeEventListener('visibilitychange', onVisibilityChange);
    document.removeEventListener('webkitvisibilitychange', onVisibilityChange);
    window.removeEventListener('resize', scheduleResponsiveRedraw);
    window.removeEventListener('orientationchange', scheduleResponsiveRedraw);
});

exports.default = {
    add: function add(view) {
        views.push(view);
    },
    remove: function remove(view) {
        var index = views.indexOf(view);
        if (index !== -1) {
            views.splice(index, 1);
        }
    },
    size: function size() {
        return views.length;
    },
    observe: function observe(container) {
        lazyInitIntersectionObserver();

        if (observed[container.id]) {
            return;
        }

        observed[container.id] = true;
        intersectionObserver.observe(container);
    },
    unobserve: function unobserve(container) {
        if (intersectionObserver && observed[container.id]) {
            delete observed[container.id];
            intersectionObserver.unobserve(container);
        }
    },
    getIntersectionObserver: function getIntersectionObserver() {
        return intersectionObserver;
    }
};

/***/ }),
/* 151 */
/*!*****************************************!*\
  !*** ./src/js/view/utils/visibility.js ***!
  \*****************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = getVisibility;
function getVisibility(model, element) {
    // Set visibility to 1 if we're in fullscreen
    if (model.get('fullscreen')) {
        return 1;
    }

    // Set visibility to 0 if we're not in the active tab
    if (!model.get('activeTab')) {
        return 0;
    }
    // Otherwise, set it to the intersection ratio reported from the intersection observer
    var intersectionRatio = model.get('intersectionRatio');

    if (intersectionRatio === undefined) {
        // Get intersectionRatio through brute force
        intersectionRatio = computeVisibility(element);
    }

    return intersectionRatio;
}

function computeVisibility(target) {
    var html = document.documentElement;
    var body = document.body;
    var rootRect = {
        top: 0,
        left: 0,
        right: html.clientWidth || body.clientWidth,
        width: html.clientWidth || body.clientWidth,
        bottom: html.clientHeight || body.clientHeight,
        height: html.clientHeight || body.clientHeight
    };

    if (!body.contains(target)) {
        return 0;
    }
    // If the element isn't displayed, an intersection can't happen.
    if (window.getComputedStyle(target).display === 'none') {
        return 0;
    }

    var targetRect = getBoundingClientRect(target);
    if (!targetRect) {
        return 0;
    }

    var intersectionRect = targetRect;
    var parent = target.parentNode;
    var atRoot = false;

    while (!atRoot) {
        var parentRect = null;
        if (parent === body || parent === html || parent.nodeType !== 1) {
            atRoot = true;
            parentRect = rootRect;
        } else if (window.getComputedStyle(parent).overflow !== 'visible') {
            parentRect = getBoundingClientRect(parent);
        }
        if (parentRect) {
            intersectionRect = computeRectIntersection(parentRect, intersectionRect);
            if (!intersectionRect) {
                return 0;
            }
        }
        parent = parent.parentNode;
    }
    var targetArea = targetRect.width * targetRect.height;
    var intersectionArea = intersectionRect.width * intersectionRect.height;
    return targetArea ? intersectionArea / targetArea : 0;
}

function getBoundingClientRect(el) {
    try {
        return el.getBoundingClientRect();
    } catch (e) {/* ignore Windows 7 IE11 "Unspecified error" */}
}

function computeRectIntersection(rect1, rect2) {
    var top = Math.max(rect1.top, rect2.top);
    var bottom = Math.min(rect1.bottom, rect2.bottom);
    var left = Math.max(rect1.left, rect2.left);
    var right = Math.min(rect1.right, rect2.right);
    var width = right - left;
    var height = bottom - top;
    return width >= 0 && height >= 0 && {
        top: top,
        bottom: bottom,
        left: left,
        right: right,
        width: width,
        height: height
    };
}

/***/ }),
/* 152 */
/*!***********************************!*\
  !*** ./src/js/view/utils/skin.js ***!
  \***********************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.normalizeSkin = normalizeSkin;
exports.handleColorOverrides = handleColorOverrides;

var _strings = __webpack_require__(/*! utils/strings */ 1);

var _css = __webpack_require__(/*! utils/css */ 23);

function normalizeSkin() {
    var skinConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};


    var active = skinConfig.active;
    var inactive = skinConfig.inactive;
    var background = skinConfig.background;

    var colors = {};

    colors.controlbar = getControlBar(skinConfig.controlbar);

    colors.timeslider = getTimeSlider(skinConfig.timeslider);

    colors.menus = getMenus(skinConfig.menus);

    colors.tooltips = getTooltips(skinConfig.tooltips);

    function getControlBar(controlBarConfig) {
        if (controlBarConfig || active || inactive || background) {
            var config = {};

            controlBarConfig = controlBarConfig || {};
            config.iconsActive = controlBarConfig.iconsActive || active;
            config.icons = controlBarConfig.icons || inactive;
            config.text = controlBarConfig.text || inactive;
            config.background = controlBarConfig.background || background;

            return config;
        }
    }

    function getTimeSlider(timesliderConfig) {
        if (timesliderConfig || active) {
            var config = {};

            timesliderConfig = timesliderConfig || {};
            config.progress = timesliderConfig.progress || active;
            config.rail = timesliderConfig.rail;

            return config;
        }
    }

    function getMenus(menusConfig) {
        if (menusConfig || active || inactive || background) {
            var config = {};

            menusConfig = menusConfig || {};
            config.text = menusConfig.text || inactive;
            config.textActive = menusConfig.textActive || active;
            config.background = menusConfig.background || background;

            return config;
        }
    }

    function getTooltips(tooltipsConfig) {
        if (tooltipsConfig || inactive || background) {
            var config = {};

            tooltipsConfig = tooltipsConfig || {};
            config.text = tooltipsConfig.text || inactive;
            config.background = tooltipsConfig.background || background;

            return config;
        }
    }

    return colors;
}

function handleColorOverrides(playerId, skin) {
    if (!skin) {
        return;
    }

    function addStyle(elements, attr, value, extendParent) {
        if (!value) {
            return;
        }
        /* if extendParent is true, bundle the first selector of
         element string to the player element instead of defining it as a
         child of the player element (default). i.e. #player.sel-1 .sel-2 vs. #player .sel-1 .sel-2 */
        elements = (0, _strings.prefix)(elements, '#' + playerId + (extendParent ? '' : ' '));

        var o = {};
        o[attr] = value;
        (0, _css.css)(elements.join(', '), o, playerId);
    }

    // These will use standard style names for CSS since they are added directly to a style sheet
    // Using background instead of background-color so we don't have to clear gradients with background-image

    if (skin.controlbar) {
        styleControlbar(skin.controlbar);
    }
    if (skin.timeslider) {
        styleTimeslider(skin.timeslider);
    }
    if (skin.menus) {
        styleMenus(skin.menus);
    }
    if (skin.tooltips) {
        styleTooltips(skin.tooltips);
    }

    insertGlobalColorClasses(skin.menus);

    function styleControlbar(config) {

        addStyle([
        // controlbar text colors
        '.jw-controlbar .jw-icon-inline.jw-text', '.jw-title-primary', '.jw-title-secondary'], 'color', config.text);

        if (config.icons) {
            addStyle([
            // controlbar button colors
            '.jw-button-color:not(.jw-icon-cast)', '.jw-button-color.jw-toggle.jw-off:not(.jw-icon-cast)'], 'color', config.icons);

            addStyle(['.jw-display-icon-container .jw-button-color'], 'color', config.icons);

            // Chromecast overrides
            // Can't use addStyle since it will camel case the style name
            (0, _css.css)('#' + playerId + ' .jw-icon-cast button.jw-off', '{--disconnected-color: ' + config.icons + '}', playerId);
        }
        if (config.iconsActive) {
            addStyle(['.jw-display-icon-container .jw-button-color:hover', '.jw-display-icon-container .jw-button-color:focus'], 'color', config.iconsActive);

            // Apply active color
            addStyle([
            // Toggle and menu button active colors
            '.jw-button-color.jw-toggle:not(.jw-icon-cast)', '.jw-button-color:hover:not(.jw-icon-cast)', '.jw-button-color:focus:not(.jw-icon-cast)', '.jw-button-color.jw-toggle.jw-off:hover:not(.jw-icon-cast)'], 'color', config.iconsActive);

            addStyle(['.jw-svg-icon-buffer'], 'fill', config.icons);

            // Chromecast overrides
            // Can't use addStyle since it will camel case the style name
            (0, _css.css)('#' + playerId + ' .jw-icon-cast:hover button.jw-off', '{--disconnected-color: ' + config.iconsActive + '}', playerId);
            (0, _css.css)('#' + playerId + ' .jw-icon-cast:focus button.jw-off', '{--disconnected-color: ' + config.iconsActive + '}', playerId);
            (0, _css.css)('#' + playerId + ' .jw-icon-cast button.jw-off:focus', '{--disconnected-color: ' + config.iconsActive + '}', playerId);

            (0, _css.css)('#' + playerId + ' .jw-icon-cast button', '{--connected-color: ' + config.iconsActive + '}', playerId);
            (0, _css.css)('#' + playerId + ' .jw-icon-cast button:focus', '{--connected-color: ' + config.iconsActive + '}', playerId);
            (0, _css.css)('#' + playerId + ' .jw-icon-cast:hover button', '{--connected-color: ' + config.iconsActive + '}', playerId);
            (0, _css.css)('#' + playerId + ' .jw-icon-cast:focus button', '{--connected-color: ' + config.iconsActive + '}', playerId);
        }

        // A space is purposefully left before '.jw-settings-topbar' since extendParent is set to true in order to append ':not(.jw-state-idle)'
        addStyle([' .jw-settings-topbar', ':not(.jw-state-idle) .jw-controlbar', '.jw-flag-audio-player .jw-controlbar'], 'background', config.background, true);
    }

    function styleTimeslider(config) {

        addStyle(['.jw-progress', '.jw-knob'], 'background-color', config.progress);

        addStyle(['.jw-buffer'], 'background-color', (0, _css.getRgba)(config.progress, 50));

        addStyle(['.jw-rail'], 'background-color', config.rail);

        addStyle(['.jw-background-color.jw-slider-time', '.jw-slider-time .jw-cue'], 'background-color', config.background);
    }

    function styleMenus(config) {

        addStyle(['.jw-option', '.jw-toggle.jw-off', '.jw-skip .jw-skip-icon', '.jw-nextup-tooltip', '.jw-nextup-close', '.jw-settings-content-item'], 'color', config.text);

        addStyle(['.jw-option.jw-active-option', '.jw-option:not(.jw-active-option):hover', '.jw-option:not(.jw-active-option):focus', '.jw-settings-item-active', '.jw-settings-content-item:hover', '.jw-settings-content-item:focus', '.jw-nextup-tooltip:hover', '.jw-nextup-tooltip:focus', '.jw-nextup-close:hover'], 'color', config.textActive);

        addStyle(['.jw-nextup', '.jw-settings-menu'], 'background', config.background);
    }

    function styleTooltips(config) {

        addStyle(['.jw-skip', '.jw-tooltip .jw-text', '.jw-time-tip .jw-text'], 'background-color', config.background);

        addStyle(['.jw-time-tip', '.jw-tooltip'], 'color', config.background);

        addStyle(['.jw-skip'], 'border', 'none');

        addStyle(['.jw-skip .jw-text', '.jw-skip .jw-icon', '.jw-time-tip .jw-text', '.jw-tooltip .jw-text'], 'color', config.text);
    }

    // Set global colors, used by related plugin
    // If a color is undefined simple-style-loader won't add their styles to the dom
    function insertGlobalColorClasses() {
        var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        if (config.textActive) {
            var activeColorSet = {
                color: config.textActive,
                borderColor: config.textActive,
                stroke: config.textActive
            };
            (0, _css.css)('#' + playerId + ' .jw-color-active', activeColorSet, playerId);
            (0, _css.css)('#' + playerId + ' .jw-color-active-hover:hover', activeColorSet, playerId);
        }
        if (config.text) {
            var inactiveColorSet = {
                color: config.text,
                borderColor: config.text,
                stroke: config.text
            };
            (0, _css.css)('#' + playerId + ' .jw-color-inactive', inactiveColorSet, playerId);
            (0, _css.css)('#' + playerId + ' .jw-color-inactive-hover:hover', inactiveColorSet, playerId);
        }
    }
}

/***/ }),
/* 153 */
/*!********************************************************!*\
  !*** ./src/js/view/utils/request-fullscreen-helper.js ***!
  \********************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (elementContext, documentContext, changeCallback) {
    var _requestFullscreen = elementContext.requestFullscreen || elementContext.webkitRequestFullscreen || elementContext.webkitRequestFullScreen || elementContext.mozRequestFullScreen || elementContext.msRequestFullscreen;

    var _exitFullscreen = documentContext.exitFullscreen || documentContext.webkitExitFullscreen || documentContext.webkitCancelFullScreen || documentContext.mozCancelFullScreen || documentContext.msExitFullscreen;

    var _supportsDomFullscreen = !!(_requestFullscreen && _exitFullscreen);

    for (var i = DOCUMENT_FULLSCREEN_EVENTS.length; i--;) {
        documentContext.addEventListener(DOCUMENT_FULLSCREEN_EVENTS[i], changeCallback);
    }

    return {
        events: DOCUMENT_FULLSCREEN_EVENTS,
        supportsDomFullscreen: function supportsDomFullscreen() {
            return _supportsDomFullscreen;
        },
        requestFullscreen: function requestFullscreen() {
            _requestFullscreen.apply(elementContext);
        },
        exitFullscreen: function exitFullscreen() {
            _exitFullscreen.apply(documentContext);
        },
        fullscreenElement: function fullscreenElement() {
            return documentContext.fullscreenElement || documentContext.webkitCurrentFullScreenElement || documentContext.mozFullScreenElement || documentContext.msFullscreenElement;
        },
        destroy: function destroy() {
            for (var _i = DOCUMENT_FULLSCREEN_EVENTS.length; _i--;) {
                documentContext.removeEventListener(DOCUMENT_FULLSCREEN_EVENTS[_i], changeCallback);
            }
        }
    };
};

var DOCUMENT_FULLSCREEN_EVENTS = ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange'];

/***/ }),
/* 154 */
/*!********************************************!*\
  !*** ./src/js/view/utils/flag-no-focus.js ***!
  \********************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (elementContext) {
    var _focusFromClick = false;

    var onBlur = function onBlur() {
        _focusFromClick = false;
        (0, _dom.removeClass)(elementContext, 'jw-no-focus');
    };

    var onMouseDown = function onMouseDown() {
        _focusFromClick = true;
        (0, _dom.addClass)(elementContext, 'jw-no-focus');
    };

    var onFocus = function onFocus() {
        if (!_focusFromClick) {
            onBlur();
        }
    };

    elementContext.addEventListener('focus', onFocus);
    elementContext.addEventListener('blur', onBlur);
    elementContext.addEventListener('mousedown', onMouseDown);

    return {
        destroy: function destroy() {
            elementContext.removeEventListener('focus', onFocus);
            elementContext.removeEventListener('blur', onBlur);
            elementContext.removeEventListener('mousedown', onMouseDown);
        }
    };
};

var _dom = __webpack_require__(/*! utils/dom */ 21);

/***/ }),
/* 155 */
/*!*******************************************!*\
  !*** ./src/js/view/utils/clickhandler.js ***!
  \*******************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = __webpack_require__(/*! events/events */ 4);

var _ui = __webpack_require__(/*! utils/ui */ 67);

var _ui2 = _interopRequireDefault(_ui);

var _backbone = __webpack_require__(/*! utils/backbone.events */ 7);

var _backbone2 = _interopRequireDefault(_backbone);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ClickHandler = function () {
    function ClickHandler(model, element, options) {
        _classCallCheck(this, ClickHandler);

        _extends(this, _backbone2.default);

        this.revertAlternateClickHandlers();
        this.domElement = element;
        this.model = model;

        var defaultOptions = { enableDoubleTap: true, useMove: true };
        this.ui = new _ui2.default(element, _extends(defaultOptions, options)).on({
            'click tap': this.clickHandler,
            'doubleClick doubleTap': function doubleClickDoubleTap() {
                if (this.alternateDoubleClickHandler) {
                    this.alternateDoubleClickHandler();
                    return;
                }
                this.trigger('doubleClick');
            },
            move: function move() {
                this.trigger('move');
            },
            over: function over() {
                this.trigger('over');
            },
            out: function out() {
                this.trigger('out');
            }
        }, this);
    }

    _createClass(ClickHandler, [{
        key: 'destroy',
        value: function destroy() {
            if (this.ui) {
                this.ui.destroy();
                this.ui = this.domElement = this.model = null;
                this.revertAlternateClickHandlers();
            }
        }
    }, {
        key: 'clickHandler',
        value: function clickHandler(evt) {
            if (this.model.get('flashBlocked')) {
                return;
            }
            if (this.alternateClickHandler) {
                this.alternateClickHandler(evt);
                return;
            }
            this.trigger(evt.type === _events.CLICK ? 'click' : 'tap');
        }
    }, {
        key: 'element',
        value: function element() {
            return this.domElement;
        }
    }, {
        key: 'setAlternateClickHandlers',
        value: function setAlternateClickHandlers(clickHandler, doubleClickHandler) {
            this.alternateClickHandler = clickHandler;
            this.alternateDoubleClickHandler = doubleClickHandler || null;
        }
    }, {
        key: 'revertAlternateClickHandlers',
        value: function revertAlternateClickHandlers() {
            this.alternateClickHandler = null;
            this.alternateDoubleClickHandler = null;
        }
    }]);

    return ClickHandler;
}();

exports.default = ClickHandler;

/***/ }),
/* 156 */
/*!*****************************************!*\
  !*** ./src/js/view/captionsrenderer.js ***!
  \*****************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _environment = __webpack_require__(/*! environment/environment */ 22);

var _coreLoader = __webpack_require__(/*! ../api/core-loader */ 11);

var _backbone = __webpack_require__(/*! utils/backbone.events */ 7);

var _backbone2 = _interopRequireDefault(_backbone);

var _events = __webpack_require__(/*! events/events */ 4);

var _css = __webpack_require__(/*! utils/css */ 23);

var _dom = __webpack_require__(/*! utils/dom */ 21);

var _underscore = __webpack_require__(/*! utils/underscore */ 0);

var _underscore2 = _interopRequireDefault(_underscore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** Component that renders the actual captions on screen. **/

var _WebVTT = void 0;

var _defaults = {
    back: true,
    backgroundOpacity: 50,
    edgeStyle: null,
    fontSize: 14,
    fontOpacity: 100,
    fontScale: 0.05, // Default captions font size = 1/20th of the video's height
    preprocessor: _underscore2.default.identity,
    windowOpacity: 0
};

var CaptionsRenderer = function CaptionsRenderer(_model) {

    var _options = void 0;
    var _captionsTrack = void 0;
    var _currentCues = void 0;
    var _timeEvent = void 0;
    var _display = void 0;
    var _captionsWindow = void 0;
    var _textContainer = void 0;
    var _fontScale = void 0;
    var _windowStyle = void 0;

    _display = document.createElement('div');
    _display.className = 'jw-captions jw-reset';

    this.show = function () {
        (0, _dom.addClass)(_display, 'jw-captions-enabled');
    };

    this.hide = function () {
        (0, _dom.removeClass)(_display, 'jw-captions-enabled');
    };

    // Assign list of captions to the renderer
    this.populate = function (captions) {
        if (_model.get('renderCaptionsNatively')) {
            return;
        }

        _currentCues = [];
        _captionsTrack = captions;
        if (!captions) {
            _currentCues = [];
            this.renderCues();
            return;
        }
        this.selectCues(captions, _timeEvent);
    };

    this.resize = function () {
        _setFontSize();
        this.renderCues(true);
    };

    this.renderCues = function (updateBoxPosition) {
        updateBoxPosition = !!updateBoxPosition;
        if (_WebVTT) {
            _WebVTT.processCues(window, _currentCues, _display, updateBoxPosition);
        }
    };

    this.selectCues = function (track, timeEvent) {
        if (!track || !track.data || !timeEvent) {
            return;
        }

        var pos = this.getAlignmentPosition(track, timeEvent);
        if (pos === false) {
            return;
        }

        var cues = this.getCurrentCues(track.data, pos);

        this.updateCurrentCues(cues);
        this.renderCues(true);
    };

    this.getCurrentCues = function (allCues, pos) {
        return _underscore2.default.filter(allCues, function (cue) {
            return pos >= cue.startTime && (!cue.endTime || pos <= cue.endTime);
        });
    };

    this.updateCurrentCues = function (cues) {
        // Render with vtt.js if there are cues, clear if there are none
        if (!cues.length) {
            _currentCues = [];
        } else if (_underscore2.default.difference(cues, _currentCues).length) {
            (0, _dom.addClass)(_captionsWindow, 'jw-captions-window-active');
            _currentCues = cues;
        }

        return _currentCues;
    };

    this.getAlignmentPosition = function (track, timeEvent) {
        var source = track.source;
        var metadata = timeEvent.metadata;

        // subtitles with "source" time must be synced with "metadata[source]"
        if (source) {
            if (metadata && _underscore2.default.isNumber(metadata[source])) {
                return metadata[source];
            }
            return;
        } else if (timeEvent.duration < 0) {
            // When the duration is negative (DVR mode), need to make alignmentPosition positive for captions to work
            return timeEvent.position - timeEvent.duration;
        }

        // Default to syncing with current position
        return timeEvent.position;
    };

    this.clear = function () {
        (0, _dom.empty)(_display);
    };

    /** Constructor for the renderer. **/
    this.setup = function (playerElementId, options) {
        _captionsWindow = document.createElement('div');
        _textContainer = document.createElement('span');
        _captionsWindow.className = 'jw-captions-window jw-reset';
        _textContainer.className = 'jw-captions-text jw-reset';

        _options = _extends({}, _defaults, options);

        _fontScale = _defaults.fontScale;
        _setFontScale(_options.fontSize);

        var windowColor = _options.windowColor;
        var windowOpacity = _options.windowOpacity;
        var edgeStyle = _options.edgeStyle;
        _windowStyle = {};
        var textStyle = {};

        _addTextStyle(textStyle, _options);

        if (windowColor || windowOpacity !== _defaults.windowOpacity) {
            _windowStyle.backgroundColor = (0, _css.getRgba)(windowColor || '#000000', windowOpacity);
        }

        _addEdgeStyle(edgeStyle, textStyle, _options.fontOpacity);

        if (!_options.back && edgeStyle === null) {
            _addEdgeStyle('uniform', textStyle);
        }

        (0, _css.style)(_captionsWindow, _windowStyle);
        (0, _css.style)(_textContainer, textStyle);
        _setupCaptionStyles(playerElementId, textStyle);

        _captionsWindow.appendChild(_textContainer);
        _display.appendChild(_captionsWindow);

        this.populate(_model.get('captionsTrack'));
        _model.set('captions', _options);
    };

    this.element = function () {
        return _display;
    };

    this.destroy = function () {
        this.off();
        _model.off(null, null, this);
    };

    function _setFontScale() {
        if (!_underscore2.default.isFinite(_options.fontSize)) {
            return;
        }

        var height = _model.get('containerHeight');

        if (!height) {
            _model.once('change:containerHeight', _setFontScale, this);
            return;
        }

        // Adjust scale based on font size relative to the default
        _fontScale = _defaults.fontScale * _options.fontSize / _defaults.fontSize;
    }

    function _setFontSize() {
        var height = _model.get('containerHeight');

        if (!height) {
            return;
        }

        var fontSize = Math.round(height * _fontScale);

        if (_model.get('renderCaptionsNatively')) {
            _setShadowDOMFontSize(_model.get('id'), fontSize);
        } else {
            (0, _css.style)(_display, {
                fontSize: fontSize + 'px'
            });
        }
    }

    function _setupCaptionStyles(playerId, textStyle) {
        _setFontSize();
        _styleNativeCaptions(playerId, textStyle);
        _stylePlayerCaptions(playerId, textStyle);
    }

    function _stylePlayerCaptions(playerId, textStyle) {
        // VTT.js DOM window and text styles
        (0, _css.css)('#' + playerId + ' .jw-text-track-display', _windowStyle, playerId);
        (0, _css.css)('#' + playerId + ' .jw-text-track-cue', textStyle, playerId);
    }

    function _styleNativeCaptions(playerId, textStyle) {
        if (_environment.Browser.safari) {
            // Only Safari uses a separate element for styling text background
            (0, _css.css)('#' + playerId + ' .jw-video::-webkit-media-text-track-display-backdrop', {
                backgroundColor: textStyle.backgroundColor
            }, playerId, true);
        }

        (0, _css.css)('#' + playerId + ' .jw-video::-webkit-media-text-track-display', _windowStyle, playerId, true);
        (0, _css.css)('#' + playerId + ' .jw-video::cue', textStyle, playerId, true);
    }

    function _setShadowDOMFontSize(playerId, fontSize) {
        // Set Shadow DOM font size (needs to be important to override browser's in line style)
        _windowStyle.fontSize = fontSize + 'px';
        (0, _css.css)('#' + playerId + ' .jw-video::-webkit-media-text-track-display', _windowStyle, playerId, true);
    }

    function _addTextStyle(textStyle, options) {
        var color = options.color;
        var fontOpacity = options.fontOpacity;
        if (color || fontOpacity !== _defaults.fontOpacity) {
            textStyle.color = (0, _css.getRgba)(color || '#ffffff', fontOpacity);
        }

        if (options.back) {
            var bgColor = options.backgroundColor;
            var bgOpacity = options.backgroundOpacity;
            if (bgColor !== _defaults.backgroundColor || bgOpacity !== _defaults.backgroundOpacity) {
                textStyle.backgroundColor = (0, _css.getRgba)(bgColor, bgOpacity);
            }
        } else {
            textStyle.background = 'transparent';
        }

        if (options.fontFamily) {
            textStyle.fontFamily = options.fontFamily;
        }

        if (options.fontStyle) {
            textStyle.fontStyle = options.fontStyle;
        }

        if (options.fontWeight) {
            textStyle.fontWeight = options.fontWeight;
        }

        if (options.textDecoration) {
            textStyle.textDecoration = options.textDecoration;
        }
    }

    function _addEdgeStyle(option, styles, fontOpacity) {
        var color = (0, _css.getRgba)('#000000', fontOpacity);
        if (option === 'dropshadow') {
            // small drop shadow
            styles.textShadow = '0 2px 1px ' + color;
        } else if (option === 'raised') {
            // larger drop shadow
            styles.textShadow = '0 0 5px ' + color + ', 0 1px 5px ' + color + ', 0 2px 5px ' + color;
        } else if (option === 'depressed') {
            // top down shadow
            styles.textShadow = '0 -2px 1px ' + color;
        } else if (option === 'uniform') {
            // outline
            styles.textShadow = '-2px 0 1px ' + color + ',2px 0 1px ' + color + ',0 -2px 1px ' + color + ',0 2px 1px ' + color + ',-1px 1px 1px ' + color + ',1px 1px 1px ' + color + ',1px -1px 1px ' + color + ',1px 1px 1px ' + color;
        }
    }

    function _timeChange(e) {
        if (_model.get('renderCaptionsNatively')) {
            return;
        }

        _timeEvent = e;
        this.selectCues(_captionsTrack, _timeEvent);
    }

    function _captionsListHandler(model, captionsList) {
        var _this = this;

        if (captionsList.length === 1) {
            // captionsList only contains 'off'
            return;
        }

        // don't load the polyfill or do unnecessary work if rendering natively
        if (!model.get('renderCaptionsNatively') && !_WebVTT) {
            loadWebVttPolyfill().catch(function (error) {
                _this.trigger(_events.ERROR, {
                    message: 'Captions renderer failed to load',
                    reason: error
                });
            });
            model.off('change:captionsList', _captionsListHandler, this);
        }
    }

    function loadWebVttPolyfill() {
        return __webpack_require__.e/* require.ensure */(9/*! polyfills.webvtt */).then((function (require) {
            _WebVTT = __webpack_require__(/*! polyfills/webvtt */ 89).default;
        }).bind(null, __webpack_require__)).catch(_coreLoader.chunkLoadErrorHandler);
    }

    _model.on('change:playlistItem', function () {
        _timeEvent = null;
        _currentCues = [];
    }, this);

    _model.on('change:captionsTrack', function (model, captionsTrack) {
        this.populate(captionsTrack);
    }, this);

    _model.mediaController.on('seek', function () {
        _currentCues = [];
    }, this);

    _model.mediaController.on('time seek', _timeChange, this);

    _model.mediaController.on('subtitlesTrackData', function () {
        // update captions after a provider's subtitle track changes
        this.selectCues(_captionsTrack, _timeEvent);
    }, this);

    _model.on('change:captionsList', _captionsListHandler, this);
};

_extends(CaptionsRenderer.prototype, _backbone2.default);

exports.default = CaptionsRenderer;

/***/ }),
/* 157 */
/*!*****************************!*\
  !*** ./src/js/view/logo.js ***!
  \*****************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = Logo;

var _logo2 = __webpack_require__(/*! templates/logo */ 158);

var _logo3 = _interopRequireDefault(_logo2);

var _events = __webpack_require__(/*! events/events */ 4);

var _ui = __webpack_require__(/*! utils/ui */ 67);

var _ui2 = _interopRequireDefault(_ui);

var _css = __webpack_require__(/*! utils/css */ 23);

var _dom = __webpack_require__(/*! utils/dom */ 21);

var _backbone = __webpack_require__(/*! utils/backbone.events */ 7);

var _backbone2 = _interopRequireDefault(_backbone);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LogoDefaults = {
    linktarget: '_blank',
    margin: 8,
    hide: false,
    position: 'top-right'
};

function Logo(_model) {
    _extends(this, _backbone2.default);

    var _logo;
    var _settings;
    var _img = new Image();

    this.setup = function () {
        _settings = _extends({}, LogoDefaults, _model.get('logo'));
        _settings.position = _settings.position || LogoDefaults.position;
        _settings.hide = _settings.hide.toString() === 'true';

        // We should only create a logo in the display container when
        // it is not supposed to be in the control bar, as it will
        // handle the creation in that case
        if (!_settings.file || _settings.position === 'control-bar') {
            return;
        }

        if (!_logo) {
            _logo = (0, _dom.createElement)((0, _logo3.default)(_settings.position, _settings.hide));
        }

        _model.set('logo', _settings);

        // apply styles onload when image width and height are known
        _img.onload = function () {
            // update logo style
            var height = this.height;
            var width = this.width;
            var styles = {
                backgroundImage: 'url("' + this.src + '")'
            };
            if (_settings.margin !== LogoDefaults.margin) {
                var positions = /(\w+)-(\w+)/.exec(_settings.position);
                if (positions.length === 3) {
                    styles['margin-' + positions[1]] = _settings.margin;
                    styles['margin-' + positions[2]] = _settings.margin;
                }
            }

            // Constraint logo size to 15% of their respective player dimension
            var maxHeight = _model.get('containerHeight') * 0.15;
            var maxWidth = _model.get('containerWidth') * 0.15;

            if (height > maxHeight || width > maxWidth) {
                var logoAR = width / height;
                var videoAR = maxWidth / maxHeight;

                if (videoAR > logoAR) {
                    // height = max dimension
                    height = maxHeight;
                    width = maxHeight * logoAR;
                } else {
                    // width = max dimension
                    width = maxWidth;
                    height = maxWidth / logoAR;
                }
            }

            styles.width = Math.round(width);
            styles.height = Math.round(height);

            (0, _css.style)(_logo, styles);

            // update title
            _model.set('logoWidth', styles.width);
        };

        _img.src = _settings.file;

        var logoInteractHandler = new _ui2.default(_logo);

        if (_settings.link) {
            _logo.setAttribute('tabindex', '0');
            _logo.setAttribute('aria-label', 'Logo');
        }

        logoInteractHandler.on('click tap enter', function (evt) {
            if (evt && evt.stopPropagation) {
                evt.stopPropagation();
            }

            this.trigger(_events.LOGO_CLICK, {
                link: _settings.link,
                linktarget: _settings.linktarget
            });
        }, this);
    };

    this.setContainer = function (container) {
        if (_logo) {
            container.appendChild(_logo);
        }
    };

    this.element = function () {
        return _logo;
    };

    this.position = function () {
        return _settings.position;
    };

    this.destroy = function () {
        _img.onload = null;
    };
}

/***/ }),
/* 158 */
/*!*******************************!*\
  !*** ./src/templates/logo.js ***!
  \*******************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (position, hide) {
    var jwhide = hide ? ' jw-hide' : '';
    return '<div class="jw-logo jw-logo-' + position + jwhide + ' jw-reset"></div>';
};

/***/ }),
/* 159 */
/*!********************************!*\
  !*** ./src/js/view/preview.js ***!
  \********************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _css = __webpack_require__(/*! utils/css */ 23);

var Preview = function Preview(_model) {
    this.model = _model;
    this.image = null;
};

function validState(state) {
    return state === 'complete' || state === 'idle' || state === 'error';
}

_extends(Preview.prototype, {
    setup: function setup(element) {
        this.el = element;
    },
    setImage: function setImage(img) {
        // Remove onload function from previous image
        var image = this.image;
        if (image) {
            image.onload = null;
        }
        this.image = null;
        if (!validState(this.model.get('state'))) {
            return;
        }
        this.model.off('change:state', null, this);
        var backgroundImage = '';
        if (typeof img === 'string') {
            backgroundImage = 'url("' + img + '")';
            image = this.image = new Image();
            image.src = img;
        }
        (0, _css.style)(this.el, {
            backgroundImage: backgroundImage
        });
    },
    resize: function resize(width, height, stretching) {
        if (stretching === 'uniform') {
            if (width) {
                this.playerAspectRatio = width / height;
            }
            if (!this.playerAspectRatio || !this.image || !validState(this.model.get('state'))) {
                return;
            }
            // snap image to edges when the difference in aspect ratio is less than 9%
            var image = this.image;
            var backgroundSize = null;
            if (image) {
                if (image.width === 0) {
                    var _this = this;
                    image.onload = function () {
                        _this.resize(width, height, stretching);
                    };
                    return;
                }
                var imageAspectRatio = image.width / image.height;
                if (Math.abs(this.playerAspectRatio - imageAspectRatio) < 0.09) {
                    backgroundSize = 'cover';
                }
            }
            (0, _css.style)(this.el, {
                backgroundSize: backgroundSize
            });
        }
    },
    element: function element() {
        return this.el;
    }
});

exports.default = Preview;

/***/ }),
/* 160 */
/*!******************************!*\
  !*** ./src/js/view/title.js ***!
  \******************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _css = __webpack_require__(/*! utils/css */ 23);

var Title = function Title(_model) {
    this.model = _model;
};

_extends(Title.prototype, {
    // This is normally shown/hidden by states
    //   these are only used for when no title exists
    hide: function hide() {
        (0, _css.style)(this.el, { display: 'none' });
    },
    show: function show() {
        (0, _css.style)(this.el, { display: '' });
    },

    setup: function setup(titleEl) {
        this.el = titleEl;

        // Perform the DOM search only once
        var arr = this.el.getElementsByTagName('div');
        this.title = arr[0];
        this.description = arr[1];

        this.model.on('change:logoWidth', this.update, this);
        this.model.change('playlistItem', this.playlistItem, this);
    },

    update: function update(model) {
        var titleStyle = {};
        var logo = model.get('logo');
        if (logo) {
            // Only use Numeric or pixel ("Npx") margin values
            var margin = 1 * ('' + logo.margin).replace('px', '');
            var padding = model.get('logoWidth') + (isNaN(margin) ? 0 : margin + 10);
            if (logo.position === 'top-left') {
                titleStyle.paddingLeft = padding;
            } else if (logo.position === 'top-right') {
                titleStyle.paddingRight = padding;
            }
        }
        (0, _css.style)(this.el, titleStyle);
    },

    playlistItem: function playlistItem(model, item) {
        if (!item) {
            return;
        }
        if (model.get('displaytitle') || model.get('displaydescription')) {
            var title = '';
            var description = '';

            if (item.title && model.get('displaytitle')) {
                title = item.title;
            }
            if (item.description && model.get('displaydescription')) {
                description = item.description;
            }

            this.updateText(title, description);
        } else {
            this.hide();
        }
    },

    updateText: function updateText(title, description) {
        this.title.innerHTML = title;
        this.description.innerHTML = description;

        if (this.title.firstChild || this.description.firstChild) {
            this.show();
        } else {
            this.hide();
        }
    },

    element: function element() {
        return this.el;
    }
});

exports.default = Title;

/***/ }),
/* 161 */
/*!*******************************!*\
  !*** ./src/css/jwplayer.less ***!
  \*******************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(/*! !../../node_modules/css-loader!../../node_modules/postcss-loader/lib!../../node_modules/less-loader/dist/cjs.js??ref--0-3!./jwplayer.less */ 162);
if(typeof content === 'string') content = [['all-players', content, '']];
// add the styles to the DOM
__webpack_require__(/*! ../../node_modules/simple-style-loader/addStyles.js */ 33).style(content,'all-players');
if(content.locals) module.exports = content.locals;

/***/ }),
/* 162 */
/*!****************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader!./node_modules/postcss-loader/lib!./node_modules/less-loader/dist/cjs.js?{"compress":true,"strictMath":true,"noIeCompat":true}!./src/css/jwplayer.less ***!
  \****************************************************************************************************************************************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../node_modules/css-loader/lib/css-base.js */ 77)(undefined);
// imports


// module
exports.push([module.i, ".jw-reset{color:inherit;background-color:transparent;padding:0;margin:0;float:none;font-family:Arial,Helvetica,sans-serif;font-size:1em;line-height:1em;list-style:none;text-align:left;text-transform:none;vertical-align:baseline;border:0;direction:ltr;font-variant:inherit;font-stretch:inherit;-webkit-tap-highlight-color:rgba(255,255,255,0)}body .jw-error,body .jwplayer.jw-state-error{height:100%;width:100%}.jw-title{position:absolute;top:0}.jw-background-color{background:rgba(0,0,0,0.4)}.jw-text{color:rgba(255,255,255,0.8)}.jw-knob{color:rgba(255,255,255,0.8);background-color:#fff}.jw-button-color{color:rgba(255,255,255,0.8)}:not(.jw-flag-touch) .jw-button-color:not(.jw-logo-button):focus,:not(.jw-flag-touch) .jw-button-color:not(.jw-logo-button):hover{outline:none;color:#fff}.jw-toggle{color:#fff}.jw-toggle.jw-off{color:rgba(255,255,255,0.8)}.jw-toggle.jw-off:focus{color:#fff}.jw-toggle:focus{outline:none}:not(.jw-flag-touch) .jw-toggle.jw-off:hover{color:#fff}.jw-rail{background:rgba(255,255,255,0.3)}.jw-buffer{background:rgba(255,255,255,0.3)}.jw-progress{background:#f2f2f2}.jw-time-tip,.jw-volume-tip{border:0}.jw-slider-volume.jw-volume-tip.jw-background-color.jw-slider-vertical{background:none}.jw-skip{padding:.5em;outline:none}.jw-skip .jw-skiptext,.jw-skip .jw-skip-icon{color:rgba(255,255,255,0.8)}.jw-skip.jw-skippable:hover .jw-skip-icon,.jw-skip.jw-skippable:focus .jw-skip-icon{color:#fff}.jw-icon-cast button{--connected-color:#fff;--disconnected-color:rgba(255,255,255,0.8)}.jw-icon-cast button:focus{outline:none}.jw-icon-cast button.jw-off{--connected-color:rgba(255,255,255,0.8)}.jw-icon-cast:focus button{--connected-color:#fff;--disconnected-color:#fff}.jw-icon-cast:hover button{--connected-color:#fff;--disconnected-color:#fff}.jw-nextup-container{bottom:2.5em;padding:5px .5em}.jw-nextup{border-radius:0}.jw-color-active{color:#fff;stroke:#fff;border-color:#fff}:not(.jw-flag-touch) .jw-color-active-hover:hover{color:#fff;stroke:#fff;border-color:#fff}.jw-color-inactive{color:rgba(255,255,255,0.8);stroke:rgba(255,255,255,0.8);border-color:rgba(255,255,255,0.8)}:not(.jw-flag-touch) .jw-color-inactive-hover:hover{color:rgba(255,255,255,0.8);stroke:rgba(255,255,255,0.8);border-color:rgba(255,255,255,0.8)}.jw-option{color:rgba(255,255,255,0.8)}.jw-option.jw-active-option{color:#fff;background-color:rgba(255,255,255,0.1)}:not(.jw-flag-touch) .jw-option:hover{color:#fff}.jwplayer{width:100%;font-size:16px;position:relative;display:block;min-height:0;overflow:hidden;box-sizing:border-box;font-family:Arial,Helvetica,sans-serif;background-color:#000;-webkit-touch-callout:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.jwplayer *{box-sizing:inherit}.jwplayer.jw-flag-aspect-mode{height:auto !important}.jwplayer.jw-flag-aspect-mode .jw-aspect{display:block}.jwplayer .jw-aspect{display:none}.jwplayer.jw-no-focus:focus,.jwplayer .jw-swf{outline:none}.jwplayer.jw-ie:focus{outline:#585858 dotted 1px}.jw-media,.jw-preview{position:absolute;width:100%;height:100%;top:0;left:0;bottom:0;right:0}.jw-media{overflow:hidden;cursor:pointer}.jw-plugin{position:absolute;bottom:66px}.jw-plugin .jw-banner{max-width:100%;opacity:0;cursor:pointer;position:absolute;margin:auto auto 0;left:0;right:0;bottom:0;display:block}.jw-preview,.jw-captions,.jw-title{pointer-events:none}.jw-media,.jw-logo{pointer-events:all}.jwplayer video{position:absolute;top:0;right:0;bottom:0;left:0;width:100%;height:100%;margin:auto;background:transparent}.jwplayer video::-webkit-media-controls-start-playback-button{display:none}.jwplayer.jw-stretch-uniform video{object-fit:contain}.jwplayer.jw-stretch-none video{object-fit:none}.jwplayer.jw-stretch-fill video{object-fit:cover}.jwplayer.jw-stretch-exactfit video{object-fit:fill}.jw-preview{position:absolute;display:none;opacity:1;visibility:visible;width:100%;height:100%;background:#000 no-repeat 50% 50%}.jwplayer .jw-preview,.jw-error .jw-preview{background-size:contain}.jw-stretch-none .jw-preview{background-size:auto auto}.jw-stretch-fill .jw-preview{background-size:cover}.jw-stretch-exactfit .jw-preview{background-size:100% 100%}.jw-title{display:none;padding-top:20px;width:100%;z-index:1}.jw-title-primary,.jw-title-secondary{color:#fff;padding-left:20px;padding-right:20px;padding-bottom:.5em;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;width:100%}.jw-title-primary{font-size:1.625em}.jw-breakpoint-2 .jw-title-primary,.jw-breakpoint-3 .jw-title-primary{font-size:1.5em}.jw-flag-small-player .jw-title-primary{font-size:1.25em}.jw-flag-small-player .jw-title-secondary,.jw-title-secondary:empty{display:none}.jw-captions{position:absolute;width:100%;height:100%;text-align:center;display:none;max-height:calc(100% - 60px);letter-spacing:normal;word-spacing:normal;text-transform:none;text-indent:0;text-decoration:none;pointer-events:none;overflow:hidden;top:0}.jw-captions.jw-captions-enabled{display:block}.jw-captions-window{display:none;padding:.25em;border-radius:.25em}.jw-captions-window.jw-captions-window-active{display:inline-block}.jw-captions-text{display:inline-block;color:#fff;background-color:#000;word-wrap:normal;word-break:normal;white-space:pre-line;font-style:normal;font-weight:normal;text-align:center;text-decoration:none}.jw-text-track-display{font-size:inherit;line-height:1.5}.jw-text-track-cue{background-color:rgba(0,0,0,0.5);color:#fff;padding:.1em .3em}.jwplayer video::-webkit-media-controls{display:none;justify-content:flex-start}.jwplayer video::-webkit-media-text-track-container{max-height:calc(100% - 60px);line-height:normal}.jwplayer video::-webkit-media-text-track-display{min-width:-webkit-min-content}.jwplayer video::cue{background-color:rgba(0,0,0,0.5)}.jwplayer video::-webkit-media-controls-panel-container{display:none}.jw-logo{position:absolute;margin:20px;cursor:pointer;pointer-events:all;background-repeat:no-repeat;background-size:contain;top:auto;right:auto;left:auto;bottom:auto}.jw-flag-audio-player .jw-logo{display:none}.jw-logo-top-right{top:0;right:0}.jw-logo-top-left{top:0;left:0}.jw-logo-bottom-left{left:0}.jw-logo-bottom-right{right:0}.jw-logo-bottom-left,.jw-logo-bottom-right{bottom:44px;transition:bottom 150ms cubic-bezier(0, -0.25, .25, 1)}.jw-state-idle .jw-logo{z-index:1}.jw-state-setup{background-color:transparent}.jw-state-setup .jw-logo,.jw-state-setup .jw-controls,.jw-state-setup .jw-controls-backdrop{visibility:hidden}body .jw-error,body .jwplayer.jw-state-error{background-color:#333;color:#fff;font-size:16px;display:table;opacity:1;overflow:hidden;position:relative}body .jw-error .jw-display,body .jwplayer.jw-state-error .jw-display{display:none}body .jw-error .jw-media,body .jwplayer.jw-state-error .jw-media{cursor:default}body .jw-error .jw-preview,body .jwplayer.jw-state-error .jw-preview{background-color:#333}body .jw-error .jw-error-msg,body .jwplayer.jw-state-error .jw-error-msg{top:50%;position:absolute;left:50%;align-items:center;background-color:#000;border-radius:2px;display:flex;padding:20px;-webkit-transform:translate(-50%, -50%);transform:translate(-50%, -50%)}body .jw-error .jw-error-msg .jw-icon,body .jwplayer.jw-state-error .jw-error-msg .jw-icon{height:30px;width:30px;margin-right:20px;flex:0 0 auto}body .jw-error .jw-error-msg .jw-icon:empty,body .jwplayer.jw-state-error .jw-error-msg .jw-icon:empty{display:none}body .jw-error .jw-error-msg .jw-title,body .jwplayer.jw-state-error .jw-error-msg .jw-title{display:block;position:static}body .jw-error .jw-error-msg .jw-title,body .jwplayer.jw-state-error .jw-error-msg .jw-title,body .jw-error .jw-error-msg .jw-title-primary,body .jwplayer.jw-state-error .jw-error-msg .jw-title-primary,body .jw-error .jw-error-msg .jw-title-secondary,body .jwplayer.jw-state-error .jw-error-msg .jw-title-secondary{font-size:14px;line-height:1.35;padding:0}body .jw-error .jw-error-msg .jw-title-primary,body .jwplayer.jw-state-error .jw-error-msg .jw-title-primary{font-weight:600;white-space:normal}.jwplayer.jw-state-error.jw-flag-audio-player .jw-error-msg{height:100%;width:100%;top:0;position:absolute;left:0;background:#000;-webkit-transform:none;transform:none;padding:0 16px;z-index:1}body .jwplayer.jw-state-error .jw-title,body .jw-error .jw-title,.jw-state-idle .jw-title,.jwplayer.jw-state-complete:not(.jw-flag-casting):not(.jw-flag-audio-player):not(.jw-flag-overlay-open-related) .jw-title{display:block}body .jwplayer.jw-state-error .jw-preview,body .jw-error .jw-preview,.jw-state-idle .jw-preview,.jwplayer.jw-state-complete:not(.jw-flag-casting):not(.jw-flag-audio-player):not(.jw-flag-overlay-open-related) .jw-preview{display:block}.jw-state-idle .jw-captions,.jwplayer.jw-state-complete .jw-captions,body .jwplayer.jw-state-error .jw-captions{display:none}.jw-state-idle video::-webkit-media-text-track-container,.jwplayer.jw-state-complete video::-webkit-media-text-track-container,body .jwplayer.jw-state-error video::-webkit-media-text-track-container{display:none}.jwplayer.jw-flag-fullscreen{width:100% !important;height:100% !important;top:0;right:0;bottom:0;left:0;z-index:1000;margin:0;position:fixed}body .jwplayer.jw-flag-flash-blocked .jw-title{display:block}.jwplayer.jw-flag-controls-hidden .jw-captions{max-height:none}.jwplayer.jw-flag-controls-hidden video::-webkit-media-text-track-container{max-height:none}.jwplayer.jw-flag-controls-hidden .jw-media{cursor:default}.jw-flag-audio-player:not(.jw-flag-flash-blocked) .jw-media{visibility:hidden}.jw-flag-audio-player .jw-title{background:none}.jw-flag-audio-player object{min-height:45px}", ""]);

// exports


/***/ }),
/* 163 */
/*!************************************************!*\
  !*** ./src/js/controller/events-middleware.js ***!
  \************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = middleware;
function middleware(model, type, currentState) {
    var newState = currentState;

    switch (type) {
        case 'time':
        case 'beforePlay':
        case 'pause':
        case 'play':
        case 'ready':
            {
                var viewable = model.get('viewable');
                // Don't add viewable to events if we don't know we're viewable
                if (viewable !== undefined) {
                    // Emit viewable as 0 or 1
                    newState = _extends({}, currentState, { viewable: viewable });
                }
                break;
            }
        default:
            {
                break;
            }
    }

    return newState;
}

/***/ }),
/* 164 */
/*!***********************************************!*\
  !*** ./src/js/providers/utils/stream-type.js ***!
  \***********************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.isDvr = isDvr;
exports.streamType = streamType;

// It's DVR if the duration is above the minDvrWindow, Live otherwise
function isDvr(duration, minDvrWindow) {
    return Math.abs(duration) >= Math.max(minDvrWindow, 0);
}

// Determine the adaptive type - Live, DVR, or VOD
// Duration can be positive or negative, but minDvrWindow should always be positive
function streamType(duration, minDvrWindow) {
    var _minDvrWindow = minDvrWindow === undefined ? 120 : minDvrWindow;
    var type = 'VOD';

    if (duration === Infinity) {
        // Live streams are always Infinity duration
        type = 'LIVE';
    } else if (duration < 0) {
        type = isDvr(duration, _minDvrWindow) ? 'DVR' : 'LIVE';
    }

    // Default option is VOD (i.e. positive or non-infinite)
    return type;
}

/***/ }),
/* 165 */
/*!*************************************!*\
  !*** ./src/js/utils/time-ranges.js ***!
  \*************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = endOfRange;
function endOfRange(timeRanges) {
    if (!timeRanges || !timeRanges.length) {
        return 0;
    }

    return timeRanges.end(timeRanges.length - 1);
}

/***/ }),
/* 166 */
/*!*********************************************!*\
  !*** ./src/js/providers/data-normalizer.js ***!
  \*********************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.qualityLevel = qualityLevel;
function qualityLevel(level) {
    return {
        bitrate: level.bitrate,
        label: level.label,
        width: level.width,
        height: level.height
    };
}

/***/ }),
/* 167 */
/*!**************************************************!*\
  !*** ./src/js/providers/video-listener-mixin.js ***!
  \**************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _events = __webpack_require__(/*! events/events */ 4);

var _helpers = __webpack_require__(/*! utils/helpers */ 5);

var _helpers2 = _interopRequireDefault(_helpers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// This will trigger the events required by jwplayer model to
//  properly follow the state of the video tag
//
// Assumptions
//  1. All functions are bound to the "this" of the provider
//  2. The provider has an attribute "video" which is the video tag

var VideoListenerMixin = {
    canplay: function canplay() {
        this.trigger(_events.MEDIA_BUFFER_FULL);
    },
    play: function play() {
        if (!this.video.paused && this.state !== _events.STATE_PLAYING) {
            this.setState(_events.STATE_LOADING);
        }
    },
    loadedmetadata: function loadedmetadata() {
        var metadata = {
            duration: this.getDuration(),
            height: this.video.videoHeight,
            width: this.video.videoWidth
        };
        var drmUsed = this.drmUsed;
        if (drmUsed) {
            metadata.drm = drmUsed;
        }
        this.trigger(_events.MEDIA_META, metadata);
    },
    timeupdate: function timeupdate() {
        this.stopStallCheck();
        var height = this.video.videoHeight;
        if (height !== this._helperLastVideoHeight) {
            if (this.adaptation) {
                this.adaptation({
                    size: {
                        width: this.video.videoWidth,
                        height: height
                    }
                });
            }
        }
        this._helperLastVideoHeight = height;

        var position = this.getCurrentTime();
        var duration = this.getDuration();
        if (isNaN(duration)) {
            return;
        }

        if (!this.seeking && !this.video.paused && (this.state === _events.STATE_STALLED || this.state === _events.STATE_LOADING)) {
            this.startStallCheck();
            this.setState(_events.STATE_PLAYING);
        }

        var timeEventObject = {
            position: position,
            duration: duration
        };
        if (this.getPtsOffset) {
            var ptsOffset = this.getPtsOffset();
            if (ptsOffset >= 0) {
                timeEventObject.metadata = {
                    mpegts: ptsOffset + position
                };
            }
        }

        // only emit time events when playing or seeking
        if (this.state === _events.STATE_PLAYING || this.seeking) {
            this.trigger(_events.MEDIA_TIME, timeEventObject);
        }
    },
    click: function click(evt) {
        this.trigger(_events.CLICK, evt);
    },
    volumechange: function volumechange() {
        var video = this.video;

        this.trigger(_events.MEDIA_VOLUME, {
            volume: Math.round(video.volume * 100)
        });

        this.trigger(_events.MEDIA_MUTE, {
            mute: video.muted
        });
    },
    seeked: function seeked() {
        if (!this.seeking) {
            return;
        }
        this.seeking = false;
        this.trigger(_events.MEDIA_SEEKED);
    },
    playing: function playing() {
        if (!this.seeking) {
            this.setState(_events.STATE_PLAYING);
        }
        this.trigger(_events.PROVIDER_FIRST_FRAME);
    },
    pause: function pause() {
        // Sometimes the browser will fire "complete" and then a "pause" event
        if (this.state === _events.STATE_COMPLETE) {
            return;
        }
        if (this.video.ended) {
            return;
        }
        if (this.video.error) {
            return;
        }
        // If "pause" fires before "complete", we still don't want to propagate it
        if (this.video.currentTime === this.video.duration) {
            return;
        }
        this.setState(_events.STATE_PAUSED);
    },
    progress: function progress() {
        var dur = this.getDuration();
        if (dur <= 0 || dur === Infinity) {
            return;
        }
        var buf = this.video.buffered;
        if (!buf || buf.length === 0) {
            return;
        }

        var buffered = _helpers2.default.between(buf.end(buf.length - 1) / dur, 0, 1);
        this.trigger(_events.MEDIA_BUFFER, {
            bufferPercent: buffered * 100,
            position: this.getCurrentTime(),
            duration: dur
        });
    },
    ratechange: function ratechange() {
        this.trigger(_events.MEDIA_RATE_CHANGE, { playbackRate: this.video.playbackRate });
    },
    ended: function ended() {
        this.stopStallCheck();
        this._helperLastVideoHeight = 0;
        if (this.state !== _events.STATE_IDLE && this.state !== _events.STATE_COMPLETE) {
            this.trigger(_events.MEDIA_COMPLETE);
        }
    },
    loadeddata: function loadeddata() {
        // If we're not rendering natively text tracks will be provided from another source - don't duplicate them here
        if (this.renderNatively) {
            this.setTextTracks(this.video.textTracks);
        }
    },
    error: function error() {
        var code = this.video.error && this.video.error.code || -1;
        var message = {
            1: 'Unknown operation aborted',
            2: 'Unknown network error',
            3: 'Unknown decode error',
            4: 'File could not be played'
        }[code] || 'Unknown';
        this.trigger(_events.MEDIA_ERROR, {
            code: code,
            message: 'Error loading media: ' + message
        });
    }
};

exports.default = VideoListenerMixin;

/***/ }),
/* 168 */
/*!*************************************************!*\
  !*** ./src/js/providers/video-actions-mixin.js ***!
  \*************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _css = __webpack_require__(/*! utils/css */ 23);

var VideoActionsMixin = {
    container: null,

    volume: function volume(vol) {
        vol = Math.max(Math.min(vol / 100, 1), 0);
        this.video.volume = vol;
    },

    mute: function mute(state) {
        this.video.muted = !!state;
        if (!this.video.muted) {
            // Remove muted attribute once user unmutes so the video element doesn't get
            // muted by the browser when the src changes or on replay
            this.video.removeAttribute('muted');
        }
    },

    resize: function resize(width, height, stretching) {
        if (!width || !height || !this.video.videoWidth || !this.video.videoHeight) {
            return false;
        }
        if (stretching === 'uniform') {
            // snap video to edges when the difference in aspect ratio is less than 9%
            var playerAspectRatio = width / height;
            var videoAspectRatio = this.video.videoWidth / this.video.videoHeight;
            var objectFit = null;
            if (Math.abs(playerAspectRatio - videoAspectRatio) < 0.09) {
                objectFit = 'fill';
            }
            (0, _css.style)(this.video, {
                objectFit: objectFit,
                width: null,
                height: null
            });
        }
        return false;
    },

    getContainer: function getContainer() {
        return this.container;
    },

    setContainer: function setContainer(element) {
        this.container = element;
        if (this.video !== element.firstChild) {
            element.insertBefore(this.video, element.firstChild);
        }
    },

    remove: function remove() {
        this.stop();
        this.destroy();
        if (this.container === this.video.parentNode) {
            this.container.removeChild(this.video);
        }
    }
};

exports.default = VideoActionsMixin;

/***/ }),
/* 169 */
/*!**************************************************!*\
  !*** ./src/js/providers/video-attached-mixin.js ***!
  \**************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _events = __webpack_require__(/*! events/events */ 4);

var _timeRanges = __webpack_require__(/*! utils/time-ranges */ 165);

var _timeRanges2 = _interopRequireDefault(_timeRanges);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var STALL_DELAY = 256;

var VideoAttachedMixin = {
    stallCheckTimeout_: -1,
    lastStalledTime_: NaN,

    attachMedia: function attachMedia() {
        this.eventsOn_();
    },

    detachMedia: function detachMedia() {
        this.stopStallCheck();
        this.eventsOff_();

        return this.video;
    },

    stopStallCheck: function stopStallCheck() {
        clearTimeout(this.stallCheckTimeout_);
    },

    startStallCheck: function startStallCheck() {
        this.stopStallCheck();
        this.stallCheckTimeout_ = setTimeout(this.stalledHandler.bind(this, this.video.currentTime), STALL_DELAY);
    },

    stalledHandler: function stalledHandler(checkStartTime) {
        if (checkStartTime !== this.video.currentTime) {
            return;
        }

        if (this.video.paused || this.video.ended) {
            return;
        }

        // A stall after loading/error, should just stay loading/error
        if (this.state === _events.STATE_LOADING || this.state === _events.STATE_ERROR) {
            return;
        }

        // During seek we stay in paused state
        if (this.seeking) {
            return;
        }

        if (this.atEdgeOfLiveStream()) {
            this.setPlaybackRate(1);
        }
        this.setState(_events.STATE_STALLED);
    },

    atEdgeOfLiveStream: function atEdgeOfLiveStream() {
        if (!this.isLive()) {
            return false;
        }

        // currentTime doesn't always get to the end of the buffered range
        var timeFudge = 2;
        return (0, _timeRanges2.default)(this.video.buffered) - this.video.currentTime <= timeFudge;
    },

    setAutoplayAttributes: function setAutoplayAttributes() {
        this.video.setAttribute('autoplay', '');
        this.video.setAttribute('muted', '');
    },

    removeAutoplayAttributes: function removeAutoplayAttributes() {
        this.video.removeAttribute('autoplay');
        this.video.removeAttribute('muted');
    }
};

exports.default = VideoAttachedMixin;

/***/ }),
/* 170 */
/*!******************************************!*\
  !*** ./src/js/providers/tracks-mixin.js ***!
  \******************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _tracksLoader = __webpack_require__(/*! controller/tracks-loader */ 84);

var _tracksHelper = __webpack_require__(/*! controller/tracks-helper */ 85);

var _id3Parser = __webpack_require__(/*! providers/utils/id3Parser */ 171);

var _environment = __webpack_require__(/*! environment/environment */ 22);

var _events = __webpack_require__(/*! events/events */ 4);

var _underscore = __webpack_require__(/*! utils/underscore */ 0);

var _underscore2 = _interopRequireDefault(_underscore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Used across all providers for loading tracks and handling browser track-related events
 */
var Tracks = {
    _itemTracks: null,
    _textTracks: null,
    _tracksById: null,
    _cuesByTrackId: null,
    _cachedVTTCues: null,
    _metaCuesByTextTime: null,
    _currentTextTrackIndex: -1,
    _unknownCount: 0,
    _activeCuePosition: null,
    _initTextTracks: _initTextTracks,
    addTracksListener: addTracksListener,
    clearTracks: clearTracks,
    clearCueData: clearCueData,
    disableTextTrack: disableTextTrack,
    enableTextTrack: enableTextTrack,
    getSubtitlesTrack: getSubtitlesTrack,
    removeTracksListener: removeTracksListener,
    addTextTracks: addTextTracks,
    setTextTracks: setTextTracks,
    setupSideloadedTracks: setupSideloadedTracks,
    setSubtitlesTrack: setSubtitlesTrack,
    textTrackChangeHandler: null,
    addTrackHandler: null,
    addCuesToTrack: addCuesToTrack,
    addCaptionsCue: addCaptionsCue,
    addVTTCue: addVTTCue,
    addVTTCuesToTrack: addVTTCuesToTrack,
    renderNatively: false
};

function setTextTracks(tracks) {
    this._currentTextTrackIndex = -1;
    if (!tracks) {
        return;
    }

    if (!this._textTracks) {
        this._initTextTracks();
    } else {
        // Remove the 608 captions track that was mutated by the browser
        this._unknownCount = 0;
        this._textTracks = _underscore2.default.reject(this._textTracks, function (track) {
            var trackId = track._id;
            if (this.renderNatively && trackId && trackId.indexOf('nativecaptions') === 0) {
                delete this._tracksById[trackId];
                return true;
            } else if (track.name.indexOf('Unknown') === 0) {
                this._unknownCount++;
            }
        }, this);

        // Remove the ID3 track from the cache
        delete this._tracksById.nativemetadata;
    }

    // filter for 'subtitles' or 'captions' tracks
    if (tracks.length) {
        var i = 0;
        var len = tracks.length;

        for (i; i < len; i++) {
            var track = tracks[i];
            if (!track._id) {
                if (track.kind === 'captions' || track.kind === 'metadata') {
                    track._id = 'native' + track.kind + i;
                    if (!track.label && track.kind === 'captions') {
                        // track label is read only in Safari
                        // 'captions' tracks without a label need a name in order for the cc menu to work
                        var labelInfo = (0, _tracksHelper.createLabel)(track, this._unknownCount);
                        track.name = labelInfo.label;
                        this._unknownCount = labelInfo.unknownCount;
                    }
                } else {
                    track._id = (0, _tracksHelper.createId)(track, this._textTracks.length);
                }
                if (this._tracksById[track._id]) {
                    // tracks without unique ids must not be marked as "inuse"
                    continue;
                }
                track.inuse = true;
            }
            if (!track.inuse || this._tracksById[track._id]) {
                continue;
            }
            // setup TextTrack
            if (track.kind === 'metadata') {
                // track mode needs to be "hidden", not "showing", so that cues don't display as captions in Firefox
                track.mode = 'hidden';
                track.oncuechange = _cueChangeHandler.bind(this);
                this._tracksById[track._id] = track;
            } else if (_kindSupported(track.kind)) {
                var mode = track.mode;
                var cue;

                // By setting the track mode to 'hidden', we can determine if the track has cues
                track.mode = 'hidden';

                if (!track.cues.length && track.embedded) {
                    // There's no method to remove tracks added via: video.addTextTrack.
                    // This ensures the 608 captions track isn't added to the CC menu until it has cues
                    continue;
                }

                track.mode = mode;

                // Parsed cues may not have been added to this track yet
                if (this._cuesByTrackId[track._id] && !this._cuesByTrackId[track._id].loaded) {
                    var cues = this._cuesByTrackId[track._id].cues;
                    while (cue = cues.shift()) {
                        _addCueToTrack(this.renderNatively, track, cue);
                    }
                    track.mode = mode;
                    this._cuesByTrackId[track._id].loaded = true;
                }

                _addTrackToList.call(this, track);
            }
        }
    }

    if (this.renderNatively) {
        // Only bind and set this.textTrackChangeHandler once so that removeEventListener works
        this.textTrackChangeHandler = this.textTrackChangeHandler || textTrackChangeHandler.bind(this);
        this.addTracksListener(this.video.textTracks, 'change', this.textTrackChangeHandler);

        if (_environment.Browser.edge || _environment.Browser.firefox || _environment.Browser.safari) {
            // Listen for TextTracks added to the videotag after the onloadeddata event in Edge and Firefox
            this.addTrackHandler = this.addTrackHandler || addTrackHandler.bind(this);
            this.addTracksListener(this.video.textTracks, 'addtrack', this.addTrackHandler);
        }
    }

    if (this._textTracks.length) {
        this.trigger('subtitlesTracks', { tracks: this._textTracks });
    }
}

function setupSideloadedTracks(itemTracks) {
    // Add tracks if we're starting playback or resuming after a midroll

    if (!this.renderNatively) {
        return;
    }
    // Determine if the tracks are the same and the embedded + sideloaded count = # of tracks in the controlbar
    var alreadyLoaded = itemTracks === this._itemTracks;
    if (!alreadyLoaded) {
        (0, _tracksLoader.cancelXhr)(this._itemTracks);
    }
    this._itemTracks = itemTracks;
    if (!itemTracks) {
        return;
    }

    if (!alreadyLoaded) {
        this.disableTextTrack();
        _clearSideloadedTextTracks.call(this);
        this.addTextTracks(itemTracks);
    }
}

function getSubtitlesTrack() {
    return this._currentTextTrackIndex;
}

function setSubtitlesTrack(menuIndex) {
    if (!this.renderNatively) {
        if (this.setCurrentSubtitleTrack) {
            this.setCurrentSubtitleTrack(menuIndex - 1);
        }
        return;
    }

    if (!this._textTracks) {
        return;
    }

    // 0 = 'Off'
    if (menuIndex === 0) {
        _underscore2.default.each(this._textTracks, function (track) {
            track.mode = track.embedded ? 'hidden' : 'disabled';
        });
    }

    // Track index is 1 less than controlbar index to account for 'Off' = 0.
    // Prevent unnecessary track change events
    if (this._currentTextTrackIndex === menuIndex - 1) {
        return;
    }

    // Turn off current track
    this.disableTextTrack();

    // Set the provider's index to the model's index, then show the selected track if it exists
    this._currentTextTrackIndex = menuIndex - 1;

    if (this._textTracks[this._currentTextTrackIndex]) {
        this._textTracks[this._currentTextTrackIndex].mode = 'showing';
    }

    // Update the model index since the track change may have come from a browser event
    this.trigger('subtitlesTrackChanged', {
        currentTrack: this._currentTextTrackIndex + 1,
        tracks: this._textTracks
    });
}

function addCaptionsCue(cueData) {
    if (!cueData.text || !cueData.begin || !cueData.end) {
        return;
    }
    var trackId = cueData.trackid.toString();
    var track = this._tracksById && this._tracksById[trackId];
    if (!track) {
        track = {
            kind: 'captions',
            _id: trackId,
            data: []
        };
        this.addTextTracks([track]);
        this.trigger('subtitlesTracks', { tracks: this._textTracks });
    }

    var cueId;

    if (cueData.useDTS) {
        // There may not be any 608 captions when the track is first created
        // Need to set the source so position is determined from metadata
        if (!track.source) {
            track.source = cueData.source || 'mpegts';
        }
    }
    cueId = cueData.begin + '_' + cueData.text;

    var cue = this._metaCuesByTextTime[cueId];
    if (!cue) {
        cue = {
            begin: cueData.begin,
            end: cueData.end,
            text: cueData.text
        };
        this._metaCuesByTextTime[cueId] = cue;
        var vttCue = (0, _tracksLoader.convertToVTTCues)([cue])[0];
        track.data.push(vttCue);
    }
}

function addVTTCue(cueData) {
    if (!this._tracksById) {
        this._initTextTracks();
    }

    var trackId = cueData.track ? cueData.track : 'native' + cueData.type;
    var track = this._tracksById[trackId];
    var label = cueData.type === 'captions' ? 'Unknown CC' : 'ID3 Metadata';
    var vttCue = cueData.cue;

    if (!track) {
        var itemTrack = {
            kind: cueData.type,
            _id: trackId,
            label: label,
            embedded: true
        };

        track = _createTrack.call(this, itemTrack);

        if (this.renderNatively || track.kind === 'metadata') {
            this.setTextTracks(this.video.textTracks);
        } else {
            addTextTracks.call(this, [track]);
        }
    }
    if (_cacheVTTCue.call(this, track, vttCue)) {
        if (this.renderNatively || track.kind === 'metadata') {
            _addCueToTrack(this.renderNatively, track, vttCue);
        } else {
            track.data.push(vttCue);
        }
    }
}

function addCuesToTrack(cueData) {
    // convert cues coming from the flash provider into VTTCues, then append them to track
    var track = this._tracksById[cueData.name];
    if (!track) {
        return;
    }

    track.source = cueData.source;
    var cues = cueData.captions || [];
    var cuesToConvert = [];
    var sort = false;

    for (var i = 0; i < cues.length; i++) {
        var cue = cues[i];
        var cueId = cueData.name + '_' + cue.begin + '_' + cue.end;
        if (!this._metaCuesByTextTime[cueId]) {
            this._metaCuesByTextTime[cueId] = cue;
            cuesToConvert.push(cue);
            sort = true;
        }
    }
    if (sort) {
        cuesToConvert.sort(function (a, b) {
            return a.begin - b.begin;
        });
    }
    var vttCues = (0, _tracksLoader.convertToVTTCues)(cuesToConvert);
    Array.prototype.push.apply(track.data, vttCues);
}

function addTracksListener(tracks, eventType, handler) {
    if (!tracks) {
        return;
    }
    // Always remove existing listener
    removeTracksListener(tracks, eventType, handler);

    if (this.instreamMode) {
        return;
    }

    if (tracks.addEventListener) {
        tracks.addEventListener(eventType, handler);
    } else {
        tracks['on' + eventType] = handler;
    }
}

function removeTracksListener(tracks, eventType, handler) {
    if (!tracks) {
        return;
    }
    if (tracks.removeEventListener) {
        tracks.removeEventListener(eventType, handler);
    } else {
        tracks['on' + eventType] = null;
    }
}

function clearTracks() {
    (0, _tracksLoader.cancelXhr)(this._itemTracks);
    var metadataTrack = this._tracksById && this._tracksById.nativemetadata;
    if (this.renderNatively || metadataTrack) {
        _removeCues(this.renderNatively, this.video.textTracks);
        if (metadataTrack) {
            metadataTrack.oncuechange = null;
        }
    }

    this._itemTracks = null;
    this._textTracks = null;
    this._tracksById = null;
    this._cuesByTrackId = null;
    this._metaCuesByTextTime = null;
    this._unknownCount = 0;
    this._activeCuePosition = null;
    if (this.renderNatively) {
        // Removing listener first to ensure that removing cues does not trigger it unnecessarily
        this.removeTracksListener(this.video.textTracks, 'change', this.textTrackChangeHandler);
        _removeCues(this.renderNatively, this.video.textTracks);
    }
}

// Clear track cues to prevent duplicates
function clearCueData(trackId) {
    if (this._cachedVTTCues[trackId]) {
        this._cachedVTTCues[trackId] = {};
        if (this._tracksById) {
            this._tracksById[trackId].data = [];
        }
    }
}

function disableTextTrack() {
    if (this._textTracks) {
        var track = this._textTracks[this._currentTextTrackIndex];
        if (track) {
            // FF does not remove the active cue from the dom when the track is hidden, so we must disable it
            track.mode = 'disabled';
            var trackId = track._id;
            if (trackId && trackId.indexOf('nativecaptions') === 0) {
                track.mode = 'hidden';
            }
        }
    }
}

function enableTextTrack() {
    if (this._textTracks) {
        var track = this._textTracks[this._currentTextTrackIndex];
        if (track) {
            track.mode = 'showing';
        }
    }
}

function textTrackChangeHandler() {
    var textTracks = this.video.textTracks;
    var inUseTracks = _underscore2.default.filter(textTracks, function (track) {
        return (track.inuse || !track._id) && _kindSupported(track.kind);
    });
    if (!this._textTracks || _tracksModified.call(this, inUseTracks)) {
        this.setTextTracks(textTracks);
        return;
    }
    // If a caption/subtitle track is showing, find its index
    var selectedTextTrackIndex = -1;
    for (var i = 0; i < this._textTracks.length; i++) {
        if (this._textTracks[i].mode === 'showing') {
            selectedTextTrackIndex = i;
            break;
        }
    }

    // Notifying the model when the index changes keeps the current index in sync in iOS Fullscreen mode
    if (selectedTextTrackIndex !== this._currentTextTrackIndex) {
        this.setSubtitlesTrack(selectedTextTrackIndex + 1);
    }
}

// Used in MS Edge to get tracks from the videotag as they're added
function addTrackHandler() {
    this.setTextTracks(this.video.textTracks);
}

function addTextTracks(tracksArray) {
    var _this = this;

    if (!tracksArray) {
        return;
    }

    if (!this._textTracks) {
        this._initTextTracks();
    }

    tracksArray.forEach(function (itemTrack) {
        // only add valid and supported kinds https://developer.mozilla.org/en-US/docs/Web/HTML/Element/track
        if (itemTrack.kind && !_kindSupported(itemTrack.kind)) {
            return;
        }
        var textTrackAny = _createTrack.call(_this, itemTrack);
        _addTrackToList.call(_this, textTrackAny);
        if (itemTrack.file) {
            itemTrack.data = [];
            (0, _tracksLoader.loadFile)(itemTrack, function (vttCues) {
                _this.addVTTCuesToTrack(textTrackAny, vttCues);
            }, function (error) {
                _this.trigger(_events.ERROR, {
                    message: 'Captions failed to load',
                    reason: error
                });
            });
        }
    });

    if (this._textTracks && this._textTracks.length) {
        this.trigger('subtitlesTracks', { tracks: this._textTracks });
    }
}

function addVTTCuesToTrack(track, vttCues) {
    if (!this.renderNatively) {
        return;
    }

    var textTrack = this._tracksById[track._id];
    // the track may not be on the video tag yet
    if (!textTrack) {

        if (!this._cuesByTrackId) {
            this._cuesByTrackId = {};
        }
        this._cuesByTrackId[track._id] = { cues: vttCues, loaded: false };
        return;
    }
    // Cues already added
    if (this._cuesByTrackId[track._id] && this._cuesByTrackId[track._id].loaded) {
        return;
    }

    var cue;
    this._cuesByTrackId[track._id] = { cues: vttCues, loaded: true };

    while (cue = vttCues.shift()) {
        _addCueToTrack(this.renderNatively, textTrack, cue);
    }
}

// ////////////////////
// //// PRIVATE METHODS
// ////////////////////

function _addCueToTrack(renderNatively, track, vttCue) {
    if (!(_environment.Browser.ie && renderNatively) || !window.TextTrackCue) {
        track.addCue(vttCue);
        return;
    }
    // There's no support for the VTTCue interface in IE/Edge.
    // We need to convert VTTCue to TextTrackCue before adding them to the TextTrack
    // This unfortunately removes positioning properties from the cues
    var textTrackCue = new window.TextTrackCue(vttCue.startTime, vttCue.endTime, vttCue.text);
    track.addCue(textTrackCue);
}

function _removeCues(renderNatively, tracks) {
    if (tracks && tracks.length) {
        _underscore2.default.each(tracks, function (track) {
            // Let IE & Edge handle cleanup of non-sideloaded text tracks for native rendering
            if (_environment.Browser.ie && renderNatively && /^(native|subtitle|cc)/.test(track._id)) {
                return;
            }

            // Cues are inaccessible if the track is disabled. While hidden,
            // we can remove cues while the track is in a non-visible state
            // Set to disabled before hidden to ensure active cues disappear
            track.mode = 'disabled';
            track.mode = 'hidden';
            for (var i = track.cues.length; i--;) {
                track.removeCue(track.cues[i]);
            }
            if (!track.embedded) {
                track.mode = 'disabled';
            }
            track.inuse = false;
        });
    }
}

function _kindSupported(kind) {
    return kind === 'subtitles' || kind === 'captions';
}

function _initTextTracks() {
    this._textTracks = [];
    this._tracksById = {};
    this._metaCuesByTextTime = {};
    this._cuesByTrackId = {};
    this._cachedVTTCues = {};
    this._unknownCount = 0;
}

function _createTrack(itemTrack) {
    var track;
    var labelInfo = (0, _tracksHelper.createLabel)(itemTrack, this._unknownCount);
    var label = labelInfo.label;
    this._unknownCount = labelInfo.unknownCount;

    if (this.renderNatively || itemTrack.kind === 'metadata') {
        var tracks = this.video.textTracks;
        // TextTrack label is read only, so we'll need to create a new track if we don't
        // already have one with the same label
        track = _underscore2.default.findWhere(tracks, { label: label });

        if (!track) {
            track = this.video.addTextTrack(itemTrack.kind, label, itemTrack.language || '');
        }

        track.default = itemTrack.default;
        track.mode = 'disabled';
        track.inuse = true;
    } else {
        track = itemTrack;
        track.data = track.data || [];
    }

    if (!track._id) {
        track._id = (0, _tracksHelper.createId)(itemTrack, this._textTracks.length);
    }

    return track;
}

function _addTrackToList(track) {
    this._textTracks.push(track);
    this._tracksById[track._id] = track;
}

function _clearSideloadedTextTracks() {
    // Clear VTT textTracks
    if (!this._textTracks) {
        return;
    }
    var nonSideloadedTracks = _underscore2.default.filter(this._textTracks, function (track) {
        return track.embedded || track.groupid === 'subs';
    });
    this._initTextTracks();
    _underscore2.default.each(nonSideloadedTracks, function (track) {
        this._tracksById[track._id] = track;
    });
    this._textTracks = nonSideloadedTracks;
}

function _cueChangeHandler(e) {
    var activeCues = e.currentTarget.activeCues;
    if (!activeCues || !activeCues.length) {
        return;
    }

    // Get the most recent start time. Cues are sorted by start time in ascending order by the browser
    var startTime = activeCues[activeCues.length - 1].startTime;
    // Prevent duplicate meta events for the same list of cues since the cue change handler fires once
    // for each activeCue in Safari
    if (this._activeCuePosition === startTime) {
        return;
    }
    var dataCues = [];

    _underscore2.default.each(activeCues, function (cue) {
        if (cue.startTime < startTime) {
            return;
        }
        if (cue.data || cue.value) {
            dataCues.push(cue);
        } else if (cue.text) {
            this.trigger('meta', {
                metadataTime: startTime,
                metadata: JSON.parse(cue.text)
            });
        }
    }, this);

    if (dataCues.length) {
        var id3Data = (0, _id3Parser.parseID3)(dataCues);
        this.trigger('meta', {
            metadataTime: startTime,
            metadata: id3Data
        });
    }
    this._activeCuePosition = startTime;
}

function _cacheVTTCue(track, vttCue) {
    var trackKind = track.kind;
    if (!this._cachedVTTCues[track._id]) {
        this._cachedVTTCues[track._id] = {};
    }
    var cachedCues = this._cachedVTTCues[track._id];
    var cacheKeyTime;

    switch (trackKind) {
        case 'captions':
        case 'subtitles':
            // VTTCues should have unique start and end times, even in cases where there are multiple
            // active cues. This is safer than ensuring text is unique, which may be violated on seek.
            // Captions within .05s of each other are treated as unique to account for
            // quality switches where start/end times are slightly different.
            cacheKeyTime = Math.floor(vttCue.startTime * 20);
            var cacheLine = '_' + vttCue.line;
            var cacheValue = Math.floor(vttCue.endTime * 20);
            var cueExists = cachedCues[cacheKeyTime + cacheLine] || cachedCues[cacheKeyTime + 1 + cacheLine] || cachedCues[cacheKeyTime - 1 + cacheLine];

            if (cueExists && Math.abs(cueExists - cacheValue) <= 1) {
                return false;
            }

            cachedCues[cacheKeyTime + cacheLine] = cacheValue;
            return true;
        case 'metadata':
            var text = vttCue.data ? new Uint8Array(vttCue.data).join('') : vttCue.text;
            cacheKeyTime = vttCue.startTime + text;
            if (cachedCues[cacheKeyTime]) {
                return false;
            }

            cachedCues[cacheKeyTime] = vttCue.endTime;
            return true;
        default:
            return false;
    }
}

function _tracksModified(inUseTracks) {
    // Need to add new textTracks coming from the video tag
    if (inUseTracks.length > this._textTracks.length) {
        return true;
    }

    // Tracks may have changed in Safari after an ad
    for (var i = 0; i < inUseTracks.length; i++) {
        var track = inUseTracks[i];
        if (!track._id || !this._tracksById[track._id]) {
            return true;
        }
    }

    return false;
}

exports.default = Tracks;

/***/ }),
/* 171 */
/*!*********************************************!*\
  !*** ./src/js/providers/utils/id3Parser.js ***!
  \*********************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.utf8ArrayToStr = utf8ArrayToStr;
exports.syncSafeInt = syncSafeInt;
exports.parseID3 = parseID3;

var friendlyNames = {
    TIT2: 'title',
    TT2: 'title',
    WXXX: 'url',
    TPE1: 'artist',
    TP1: 'artist',
    TALB: 'album',
    TAL: 'album'
};

function utf8ArrayToStr(array, startingIndex) {
    // Based on code by Masanao Izumo <iz@onicos.co.jp>
    // posted at http://www.onicos.com/staff/iz/amuse/javascript/expert/utf.txt

    var len = array.length;
    var c = void 0;
    var char2 = void 0;
    var char3 = void 0;
    var out = '';
    var i = startingIndex || 0;
    while (i < len) {
        c = array[i++];
        // If the character is 3 (END_OF_TEXT) or 0 (NULL) then skip it
        if (c === 0x00 || c === 0x03) {
            continue;
        }
        switch (c >> 4) {
            case 0:case 1:case 2:case 3:case 4:case 5:case 6:case 7:
                // 0xxxxxxx
                out += String.fromCharCode(c);
                break;
            case 12:case 13:
                // 110x xxxx   10xx xxxx
                char2 = array[i++];
                out += String.fromCharCode((c & 0x1F) << 6 | char2 & 0x3F);
                break;
            case 14:
                // 1110 xxxx  10xx xxxx  10xx xxxx
                char2 = array[i++];
                char3 = array[i++];
                out += String.fromCharCode((c & 0x0F) << 12 | (char2 & 0x3F) << 6 | (char3 & 0x3F) << 0);
                break;
            default:
        }
    }
    return out;
}

function utf16BigEndianArrayToStr(array, startingIndex) {
    var lastDoubleByte = array.length - 1;
    var out = '';
    var i = startingIndex || 0;
    while (i < lastDoubleByte) {
        if (array[i] === 254 && array[i + 1] === 255) {
            // Byte order mark
        } else {
            out += String.fromCharCode((array[i] << 8) + array[i + 1]);
        }
        i += 2;
    }
    return out;
}

function syncSafeInt(sizeArray) {
    var size = arrayToInt(sizeArray);
    return size & 0x0000007F | (size & 0x00007F00) >> 1 | (size & 0x007F0000) >> 2 | (size & 0x7F000000) >> 3;
}

function arrayToInt(array) {
    var sizeString = '0x';
    for (var i = 0; i < array.length; i++) {
        if (array[i] < 16) {
            sizeString += '0';
        }
        sizeString += array[i].toString(16);
    }
    return parseInt(sizeString);
}

function parseID3() {
    var activeCues = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    return activeCues.reduce(function (data, cue) {
        if (!('value' in cue)) {
            // Cue is not in Safari's key/data format
            if ('data' in cue && cue.data instanceof ArrayBuffer) {
                // EdgeHTML 13.10586 cue point format - contains raw data in an ArrayBuffer.

                var oldCue = cue;
                var array = new Uint8Array(oldCue.data);
                var arrayLength = array.length;

                cue = { value: { key: '', data: '' } };

                var i = 10;
                while (i < 14 && i < array.length) {
                    if (array[i] === 0) {
                        break;
                    }
                    cue.value.key += String.fromCharCode(array[i]);
                    i++;
                }

                // If the first byte is 3 (END_OF_TEXT) or 0 (NULL) then skip it
                var startPos = 19;
                var firstByte = array[startPos];
                if (firstByte === 0x03 || firstByte === 0x00) {
                    firstByte = array[++startPos];
                    arrayLength--;
                }

                var infoDelimiterPosition = 0;
                // Find info/value pair delimiter if present.
                // If first byte shows theres utf 16 encoding, there is no info since info cannot be utf 16 encoded
                if (firstByte !== 0x01 && firstByte !== 0x02) {
                    for (var j = startPos + 1; j < arrayLength; j++) {
                        if (array[j] === 0x00) {
                            infoDelimiterPosition = j - startPos;
                            break;
                        }
                    }
                }

                if (infoDelimiterPosition > 0) {
                    var info = utf8ArrayToStr(array.subarray(startPos, startPos += infoDelimiterPosition), 0);
                    if (cue.value.key === 'PRIV') {
                        if (info === 'com.apple.streaming.transportStreamTimestamp') {
                            var ptsIs33Bit = syncSafeInt(array.subarray(startPos, startPos += 4)) & 0x00000001;
                            var transportStreamTimestamp = syncSafeInt(array.subarray(startPos, startPos += 4)) + (ptsIs33Bit ? 0x100000000 : 0);
                            cue.value.data = transportStreamTimestamp;
                        } else {
                            cue.value.data = utf8ArrayToStr(array, startPos + 1);
                        }
                        cue.value.info = info;
                    } else {
                        cue.value.info = info;
                        cue.value.data = utf8ArrayToStr(array, startPos + 1);
                    }
                } else {
                    var encoding = array[startPos];
                    if (encoding === 1 || encoding === 2) {
                        cue.value.data = utf16BigEndianArrayToStr(array, startPos + 1);
                    } else {
                        cue.value.data = utf8ArrayToStr(array, startPos + 1);
                    }
                }
            }
        }

        // These friendly names mapping provides compatibility with our implementation prior to 7.3
        if (friendlyNames.hasOwnProperty(cue.value.key)) {
            data[friendlyNames[cue.value.key]] = cue.value.data;
        }
        /* The meta event includes a metadata object with flattened cue key/data pairs
         * If a cue also includes an info field, then create a collection of info/data pairs for the cue key
         *   TLEN: 03:50                                        // key: "TLEN", data: "03:50"
         *   WXXX: {"artworkURL":"http://domain.com/cover.jpg"} // key: "WXXX", info: "artworkURL" ...
         */
        if (cue.value.info) {
            var collection = data[cue.value.key];
            if (collection !== Object(collection)) {
                collection = {};
                data[cue.value.key] = collection;
            }
            collection[cue.value.info] = cue.value.data;
        } else {
            data[cue.value.key] = cue.value.data;
        }
        return data;
    }, {});
}

/***/ }),
/* 172 */
/*!************************************************!*\
  !*** ./src/js/providers/utils/play-promise.js ***!
  \************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = createPlayPromise;

var _promise = __webpack_require__(/*! polyfills/promise */ 6);

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createPlayPromise(video) {
    return new _promise2.default(function (resolve, reject) {
        if (video.paused) {
            return reject(new Error('Play refused.'));
        }
        var removeEventListeners = function removeEventListeners() {
            video.removeEventListener('playing', listener);
            video.removeEventListener('pause', listener);
            video.removeEventListener('abort', listener);
            video.removeEventListener('error', listener);
        };
        var listener = function listener(e) {
            removeEventListeners();
            if (e.type === 'playing') {
                resolve();
            } else {
                reject(new Error('The play() request was interrupted by a "' + e.type + '" event.'));
            }
        };

        video.addEventListener('playing', listener);
        video.addEventListener('abort', listener);
        video.addEventListener('error', listener);
        video.addEventListener('pause', listener);
    });
}

/***/ })
]);
//# sourceMappingURL=jwplayer.core.controls.html5.700ef7800064d1e909f1.map