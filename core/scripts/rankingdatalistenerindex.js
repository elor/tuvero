/**
 * RankingDataListenerIndex: An object which indexes the constructors of all
 * RankingDataListeners. RankingDataListenerIndex.registerDataListeners()
 * creates an array of listeners from the RankingComponentIndex-provided
 * dependencies.
 *
 * Helper functions resolve the dependencies to provide a correctly ordered
 * array of DataListener instances, so the recalc events will be fired in the
 * correct order.
 *
 * @return RankingDataListenerIndex
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define([//
'./rankinglostpointslistener', //
'./rankingpointslistener',//
'./rankingsaldolistener', //
'./rankingupvoteslistener', //
'./rankingdownvoteslistener', //
'./rankingvoteslistener', //
'./rankingbyelistener', //
'./rankingwinslistener', //
'./rankinggamematrixlistener', //
'./rankingbuchholzlistener', //
'./rankingfinebuchholzlistener', //
'./rankingwinsmatrixlistener', //
'./rankingtaclistener', //
'./rankingsonnebornlistener', //
'./rankingheadtoheadmatrixlistener', //
'./rankingnumgameslistener', //
'./rankingkolistener'], //
function() {
  var RankingDataListenerIndex;

  /**
   * build the index from the RankingXXXListener.NAME fields
   *
   * @param DataListeners
   *          the arguments object of the outer function. NOT an array!
   * @return a RankingDataListenerIndex object (no class)
   */
  RankingDataListenerIndex = (function(DataListeners) {
    var RDLI, index, DataListener;

    RDLI = {};
    for (index = 0; index < DataListeners.length; index += 1) {
      DataListener = DataListeners[index];
      RDLI[DataListener.NAME.toLowerCase()] = DataListener;
    }

    return RDLI;
  })(arguments);

  /**
   * return the DataListener as referenced by its name
   *
   * @param name
   *          the registered name of the DataListener
   * @return a DataListener subclass (constructor)
   */
  function getDataListener(name) {
    return RankingDataListenerIndex[name];
  }

  /**
   * return the dependencies array of the DataListener with the given name
   *
   * @param name
   *          the registered name of the DataListener
   * @return an array of dependency names, or undefined if there are no
   *         dependencies
   */
  function getDataDependencies(name) {
    var DataListener = getDataListener(name);
    if (!DataListener) {
      console.warn('DataListener is undefined: ' + name);
      return undefined;
    }
    return getDataListener(name).DEPENDENCIES;
  }

  /**
   * Check whether all dependencies are fulfilled, i.e. the required
   * dependencies are part of the provided dependency
   *
   * @param required
   *          an array of required dependencies
   * @param provided
   *          an array of the provided dependencies
   *
   * @return true when the dependencies are fulfilled, false otherwise
   */
  function dependenciesFulfilled(required, provided) {
    if (!required) {
      return true;
    }
    if (!provided) {
      return false;
    }

    return required.every(function(dependency) {
      return provided.indexOf(dependency) !== -1;
    });
  }

  /**
   * Missing dependencies are read from RankingXListener.DEPENDENCIES and
   * appended as needed. There's no additional dependency order resolution
   *
   * @param dependencies
   *          Where new dependencies are added to and the dependencies are read
   *          from
   */
  function addMissingDependencies(dependencies) {
    var index, dataDependencies;

    for (index = 0; index < dependencies.length; index += 1) {
      dataDependencies = getDataDependencies(dependencies[index]);
      if (dataDependencies) {
        dataDependencies.forEach(function(DEP) {
          if (dependencies.indexOf(DEP) === -1) {
            dependencies.push(DEP);
          }
        });
      }
    }
  }

  /**
   * removes multiple entries in dependencies
   *
   * @param dependencies
   *          an array of dependency names
   *
   * @return dependencies an array of all dependencies, in any order
   */
  function removeMultipleDependencies(dependencies) {
    var index;

    for (index = dependencies.length - 1; index >= 0; index -= 1) {
      if (dependencies.indexOf(dependencies[index]) < index) {
        dependencies.splice(index, 1);
      }
    }
  }

  /**
   * perform a single dependency ordering run.
   *
   * @param input
   *          an input array with names which are not yet part of output
   * @param output
   *          an output array which to push the names to, if their dependencies
   *          are in
   * @return true of an element has been moved, false otherwise
   */
  function orderDependenciesOnce(input, output) {
    var added;

    added = []; // array of indices

    // transfer every name whose dependencies have been fulfilled
    input.forEach(function(name, index) {
      if (dependenciesFulfilled(getDataDependencies(name), output)) {

        added.push(index);
        output.push(name);
      }
    });

    // remove the items beginning with the last one to not corrupt the array
    added.reverse();
    added.forEach(function(inputIndex) {
      input.splice(inputIndex, 1);
    });

    return added.length > 0;
  }

  /**
   * order the names by their dependencies inplace, i.e. without creating a new
   * array for output
   *
   * @param names
   *          the input array, which contains the names. Also works as the
   *          output array.
   * @return false on failure, true on success
   */
  function orderDependencies(names) {
    var input;

    input = names.splice(0);

    addMissingDependencies(input);
    removeMultipleDependencies(input);

    // keep adding names until there's none left
    while (orderDependenciesOnce(input, names)) {
    }

    // check for unresolvable dependencies
    if (input.length > 0) {
      console.error('dependencies could not be resolved: [' + input.join(',')
          + ']');
      names.splice(0);
      return false;
    }

    return true;
  }

  /**
   * remove all defined names and leave only the undefined names in the array
   *
   * @param names
   *          an array of dependency names
   */
  function extractUndefinedNames(names) {
    var index;

    for (index = names.length - 1; index >= 0; index -= 1) {
      if (getDataListener(names[index]) !== undefined) {
        names.splice(index, 1);
      }
    }
  }

  /**
   * order the names by their dependencies and register every DataListener, if
   * available. Aborts otherwise
   *
   * @param names
   *          an array of DataListener names (see RankingDataListener.NAME).
   *          Will contain the names, which correspond to the returned
   *          listeners. On error, undefined names are written here.
   * @param ranking
   *          the RankingModel instance to register the listeners to
   * @return A ordered array of DataListener instances on success, undefined
   *         otherwise
   */
  RankingDataListenerIndex.registerDataListeners = function(ranking, names) {
    var DataListeners;

    if (!names) {
      return undefined;
    }

    if (!orderDependencies(names)) {
      return undefined;
    }

    DataListeners = names.map(function(name) {
      return getDataListener(name);
    });

    if (DataListeners.indexOf(undefined) >= 0) {
      extractUndefinedNames(names);
      console.error('data listener is undefined: ' + names.join(', '));
      return undefined;
    }

    return DataListeners.map(function(DataListener) {
      return new DataListener(ranking);
    });
  };

  return RankingDataListenerIndex;
});
