define("@ember/-internals/routing/lib/ext/controller", ["exports", "@ember/-internals/metal", "@ember/-internals/owner", "@ember/controller/lib/controller_mixin", "@ember/-internals/routing/lib/utils"], function(_exports, _metal, _owner, _controller_mixin, _utils) {
    "use strict";

    Object.defineProperty(_exports, "__esModule", {
        value: true
    });
    _exports.default = void 0;

    /**
    @module ember
    */
    _controller_mixin.default.reopen({
        concatenatedProperties: ['queryParams'],
        init: function init() {
            this._super.apply(this, arguments);

            var owner = (0, _owner.getOwner)(this);

            if (owner) {
                this.namespace = owner.lookup('application:main');
                this.target = owner.lookup('router:main');
            }
        },

        /**
          Defines which query parameters the controller accepts.
          If you give the names `['category','page']` it will bind
          the values of these query parameters to the variables
          `this.category` and `this.page`.
             By default, query parameters are parsed as strings. This
          may cause unexpected behavior if a query parameter is used with `toggleProperty`,
          because the initial value set for `param=false` will be the string `"false"`, which is truthy.
             To avoid this, you may specify that the query parameter should be parsed as a boolean
          by using the following verbose form with a `type` property:
          ```javascript
            queryParams: [{
              category: {
                type: 'boolean'
              }
            }]
          ```
          Available values for the `type` parameter are `'boolean'`, `'number'`, `'array'`, and `'string'`.
          If query param type is not specified, it will default to `'string'`.
             @for Ember.ControllerMixin
          @property queryParams
          @public
        */
        queryParams: null,

        /**
         This property is updated to various different callback functions depending on
         the current "state" of the backing route. It is used by
         `Controller.prototype._qpChanged`.
            The methods backing each state can be found in the `Route.prototype._qp` computed
         property return value (the `.states` property). The current values are listed here for
         the sanity of future travelers:
            * `inactive` - This state is used when this controller instance is not part of the active
           route hierarchy. Set in `Route.prototype._reset` (a `router.js` microlib hook) and
           `Route.prototype.actions.finalizeQueryParamChange`.
         * `active` - This state is used when this controller instance is part of the active
           route hierarchy. Set in `Route.prototype.actions.finalizeQueryParamChange`.
         * `allowOverrides` - This state is used in `Route.prototype.setup` (`route.js` microlib hook).
             @method _qpDelegate
          @private
        */
        _qpDelegate: null,

        /**
         During `Route#setup` observers are created to invoke this method
         when any of the query params declared in `Controller#queryParams` property
         are changed.
            When invoked this method uses the currently active query param update delegate
         (see `Controller.prototype._qpDelegate` for details) and invokes it with
         the QP key/value being changed.
             @method _qpChanged
          @private
        */
        _qpChanged: function _qpChanged(controller, _prop) {
            var dotIndex = _prop.indexOf('.[]');

            var prop = dotIndex === -1 ? _prop : _prop.slice(0, dotIndex);
            var delegate = controller._qpDelegate;
            var value = (0, _metal.get)(controller, prop);
            delegate(prop, value);
        },

        /**
          Transition the application into another route. The route may
          be either a single route or route path:
             ```javascript
          aController.transitionToRoute('blogPosts');
          aController.transitionToRoute('blogPosts.recentEntries');
          ```
             Optionally supply a model for the route in question. The model
          will be serialized into the URL using the `serialize` hook of
          the route:
             ```javascript
          aController.transitionToRoute('blogPost', aPost);
          ```
             If a literal is passed (such as a number or a string), it will
          be treated as an identifier instead. In this case, the `model`
          hook of the route will be triggered:
             ```javascript
          aController.transitionToRoute('blogPost', 1);
          ```
             Multiple models will be applied last to first recursively up the
          route tree.
             ```app/router.js
          Router.map(function() {
            this.route('blogPost', { path: ':blogPostId' }, function() {
              this.route('blogComment', { path: ':blogCommentId', resetNamespace: true });
            });
          });
          ```
             ```javascript
          aController.transitionToRoute('blogComment', aPost, aComment);
          aController.transitionToRoute('blogComment', 1, 13);
          ```
             It is also possible to pass a URL (a string that starts with a
          `/`).
             ```javascript
          aController.transitionToRoute('/');
          aController.transitionToRoute('/blog/post/1/comment/13');
          aController.transitionToRoute('/blog/posts?sort=title');
          ```
             An options hash with a `queryParams` property may be provided as
          the final argument to add query parameters to the destination URL.
             ```javascript
          aController.transitionToRoute('blogPost', 1, {
            queryParams: { showComments: 'true' }
          });
             // if you just want to transition the query parameters without changing the route
          aController.transitionToRoute({ queryParams: { sort: 'date' } });
          ```
             See also [replaceRoute](/ember/release/classes/Ember.ControllerMixin/methods/replaceRoute?anchor=replaceRoute).
             @param {String} name the name of the route or a URL
          @param {...Object} models the model(s) or identifier(s) to be used
            while transitioning to the route.
          @param {Object} [options] optional hash with a queryParams property
            containing a mapping of query parameters
          @for Ember.ControllerMixin
          @method transitionToRoute
          @return {Transition} the transition object associated with this
            attempted transition
          @deprecated Use transitionTo from the Router service instead.
          @public
        */
        transitionToRoute: function transitionToRoute() {
            (0, _utils.deprecateTransitionMethods)('controller', 'transitionToRoute'); // target may be either another controller or a router

            var target = (0, _metal.get)(this, 'target');
            var method = target.transitionToRoute || target.transitionTo;

            for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            return method.apply(target, (0, _utils.prefixRouteNameArg)(this, args));
        },

        /**
          Transition into another route while replacing the current URL, if possible.
          This will replace the current history entry instead of adding a new one.
          Beside that, it is identical to `transitionToRoute` in all other respects.
             ```javascript
          aController.replaceRoute('blogPosts');
          aController.replaceRoute('blogPosts.recentEntries');
          ```
             Optionally supply a model for the route in question. The model
          will be serialized into the URL using the `serialize` hook of
          the route:
             ```javascript
          aController.replaceRoute('blogPost', aPost);
          ```
             If a literal is passed (such as a number or a string), it will
          be treated as an identifier instead. In this case, the `model`
          hook of the route will be triggered:
             ```javascript
          aController.replaceRoute('blogPost', 1);
          ```
             Multiple models will be applied last to first recursively up the
          route tree.
             ```app/router.js
          Router.map(function() {
            this.route('blogPost', { path: ':blogPostId' }, function() {
              this.route('blogComment', { path: ':blogCommentId', resetNamespace: true });
            });
          });
          ```
             ```
          aController.replaceRoute('blogComment', aPost, aComment);
          aController.replaceRoute('blogComment', 1, 13);
          ```
             It is also possible to pass a URL (a string that starts with a
          `/`).
             ```javascript
          aController.replaceRoute('/');
          aController.replaceRoute('/blog/post/1/comment/13');
          ```
             @param {String} name the name of the route or a URL
          @param {...Object} models the model(s) or identifier(s) to be used
          while transitioning to the route.
          @for Ember.ControllerMixin
          @method replaceRoute
          @return {Transition} the transition object associated with this
            attempted transition
          @public
        */
        replaceRoute: function replaceRoute() {
            (0, _utils.deprecateTransitionMethods)('controller', 'replaceRoute'); // target may be either another controller or a router

            var target = (0, _metal.get)(this, 'target');
            var method = target.replaceRoute || target.replaceWith;

            for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                args[_key2] = arguments[_key2];
            }

            return method.apply(target, (0, _utils.prefixRouteNameArg)(this, args));
        }
    });

    var _default = _controller_mixin.default;
    _exports.default = _default;
});