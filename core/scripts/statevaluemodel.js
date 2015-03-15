/**
 * StateValueModel, which defines states and state transitions.
 *
 * @return StateValueModel
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', './selectionvaluemodel', './uniquelistmodel'],
    function(extend, SelectionValueModel, UniqueListModel) {

      /**
       * Constructor
       *
       * Transition object: { 'current': ['possible1', 'possible2']}
       *
       * @param initial
       *          initial value
       * @param transitions
       *          an object with transition arrays, as described above
       */
      function StateValueModel(initial, transitions) {
        StateValueModel.superconstructor.call(this, initial,
            new UniqueListModel());

        // push it for safety
        this.allowedValues.push(initial);

        /*
         * Design decision: Not cloning the transitions object, so the state
         * transitions can later be modified, although they're not immediate,
         * but require an update across one of the old transition paths.
         */
        this.transitions = transitions;
        this.updateStates();

        this.registerListener(this);
      }
      extend(StateValueModel, SelectionValueModel);

      /**
       * Write all possible next states, as specified by this.transitions, to
       * the list of allowed values.
       */
      StateValueModel.prototype.updateStates = function() {
        /*
         * Read all possible states, remove all currently inaccessible states
         * from allowedValues and add those that are accessible. This is not the
         * fastest way, but it avoids any assumptions about possible subclasses
         */
        Object.keys(this.transitions).forEach(function(state) {
          var transition;
          transition = this.transitions[this.get()];

          if (this.get() === state) {
            // retain the current state to avoid the default value
            this.allowedValues.push(state);
          } else if (transition.indexOf(state) !== -1) {
            // transition is possible. Allowed state
            this.allowedValues.push(state);
          } else {
            // transition is impossible. Invalid state
            this.allowedValues.erase(state);
          }
        }, this);
      };

      /**
       * Callback function to update the list of allowed states after a state
       * change
       */
      StateValueModel.prototype.onupdate = function() {
        this.updateStates();
      };

      return StateValueModel;
    });
