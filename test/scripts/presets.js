/**
 * Variant-neutral presets for the unit tests: boule's presets (the
 * ranking/tournament expectations are written against 13-point
 * scoring) under a target no real variant uses, so the timemachine
 * key tests can assert cross-target keys are rejected.
 */
import BoulePresets from '../../boule/scripts/presets.js'

export default { ...BoulePresets, target: 'test' }
