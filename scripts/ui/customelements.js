/**
 * Tuvero custom elements.
 *
 * These are thin, behaviourless semantic wrappers around the existing jQuery
 * Views. ListView clones the element's markup and constructs the matching View
 * against the clone (see scripts/ui/listview.js), so the element itself does no
 * work yet. This establishes the registration + markup-co-location pattern that
 * later component work can build on (e.g. self-bootstrapping tabs).
 */

class TuveroKOMatch extends window.HTMLElement {}

if (!window.customElements.get('tuvero-komatch')) {
  window.customElements.define('tuvero-komatch', TuveroKOMatch)
}

export { TuveroKOMatch }
