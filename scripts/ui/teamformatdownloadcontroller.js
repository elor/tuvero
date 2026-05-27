import Controller from '../core/controller.js'
import { saveAs } from 'file-saver'
import Toast from './toast.js'
import Strings from './strings.js'
import Presets from 'presets'
import State from './state.js'
const examplefiles = []
examplefiles[1] = 'Teilnehmer 1\n' + 'Teilnehmer 2\n' + 'Teilnehmer 3\n' + 'Teilnehmer 4\n' + '\n# Hinweis: Tete-a-tete -> ein Name pro Zeile\n'
examplefiles[2] = 'Erik E. Lorenz, Fabian "Fabe" Böttcher\n' + 'Spieler 3, Spieler 4\n' + 'Spieler 5, Spieler 6\n' + 'Spieler 7, Spieler 8\n' + '\n# Hinweis: Doublette -> Zwei Namen pro Zeile, mit Komma getrennt\n'
examplefiles[3] = 'Erik E. Lorenz, Fabian "Fabe" Böttcher, Spieler 3\n' + 'Spieler 4, Spieler 5, Spieler 6\n' + 'Spieler 7, Spieler 8, Spieler 9\n' + '\n# Hinweis: Triplette -> Drei Namen pro Zeile, mit Komma getrennt\n'

/**
 * Constructor
 *
 * @param view
 *          a View instance, which contains the button
 */
class TeamFormatDownloadController extends Controller {
  constructor (view) {
    super(view)
    this.view.$view.click(this.save.bind(this))
  }

  save () {
    let blob
    try {
      blob = new Blob([examplefiles[State.teamsize.get()] || examplefiles[2]])
      saveAs(blob, Presets.names.teamsfile)
    } catch (e) {
      console.error(e.stack)
      Toast.once(Strings.savefailed)
    }
  }
}

export default TeamFormatDownloadController
