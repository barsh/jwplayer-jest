webpackJsonpjwplayer([5],[
/* 0 */,
/* 1 */,
/* 2 */,
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
/* 9 */,
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
/* 68 */,
/* 69 */,
/* 70 */,
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
/* 72 */,
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
/* 78 */,
/* 79 */,
/* 80 */,
/* 81 */,
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
/* 90 */,
/* 91 */,
/* 92 */,
/* 93 */,
/* 94 */,
/* 95 */,
/* 96 */,
/* 97 */,
/* 98 */,
/* 99 */,
/* 100 */,
/* 101 */,
/* 102 */,
/* 103 */,
/* 104 */,
/* 105 */,
/* 106 */,
/* 107 */,
/* 108 */,
/* 109 */,
/* 110 */,
/* 111 */,
/* 112 */,
/* 113 */,
/* 114 */,
/* 115 */,
/* 116 */,
/* 117 */,
/* 118 */,
/* 119 */,
/* 120 */,
/* 121 */,
/* 122 */,
/* 123 */,
/* 124 */,
/* 125 */,
/* 126 */,
/* 127 */,
/* 128 */,
/* 129 */,
/* 130 */,
/* 131 */,
/* 132 */,
/* 133 */,
/* 134 */,
/* 135 */,
/* 136 */,
/* 137 */,
/* 138 */,
/* 139 */,
/* 140 */,
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

/***/ })
]);
//# sourceMappingURL=jwplayer.core.700ef7800064d1e909f1.map