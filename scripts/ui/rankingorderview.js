/**
 * RankingOrderView
 *
 * @return RankingOrderView
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */
import $ from 'jquery';
import TemplateView from './templateview.js';
import RankingComponentView from './rankingcomponentview.js';
import ListView from './listview.js';
import RankingOrderController from './rankingordercontroller.js';
import ListModel from '../list/listmodel.js';
import Listener from '../core/listener.js';
import Presets from 'presets';

class RankingOrderView extends TemplateView {
  constructor(tournament, $view, allComponents) {
    super(tournament, $view, $view.find('.template'));
    this.selectedComponents = new ListModel(this.model.ranking.componentnames);
    this.allComponents = new ListModel(allComponents.asArray());
    if (Presets.systems[tournament.SYSTEM] && Presets.systems[tournament.SYSTEM].ranking) {
      Presets.systems[tournament.SYSTEM].ranking.forEach(function (component) {
        if (this.allComponents.indexOf(component) === -1) {
          this.allComponents.push(component);
        }
      }, this);
    }
    this.$availableList = this.$view.find('.available');
    this.$selectedList = this.$view.find('.selected');
    this.selectedListView = new ListView(this.selectedComponents, this.$selectedList, this.$template, RankingComponentView);
    this.availableListView = new ListView(this.allComponents, this.$availableList, this.$template, RankingComponentView);
    this.controller = new RankingOrderController(this);
    Listener.bind(tournament.getState(), 'update', this.updateFromScratch, this);
    this.update();
  }

  /**
   * automatically show/hide already selected values from the list of available
   * items
   */
  update() {
    const selected = this.selectedComponents;
    this.$availableList.find('.component').each(function (index) {
      const $option = $(this);
      if (selected.indexOf($option.val()) === -1) {
        $option.removeClass('hidden');
      } else {
        $option.addClass('hidden');
      }
    });
  }

  updateFromScratch() {
    this.selectedComponents.restore(this.model.ranking.componentnames);
    this.update();
  }

  /**
   * an item has been inserted into the left list. Update the right list.
   */
  oninsert() {
    this.update();
  }

  /**
   * an item has been removed from the left list. Update the right list.
   */
  onremove() {
    this.update();
  }
}

export default RankingOrderView;