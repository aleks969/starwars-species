import { MAX_SPECIES, URL } from "../../config";
import EventEmitter from "eventemitter3";
import Species from "./Species";

export default class StarWarsUniverse extends EventEmitter {
  constructor() {
    super();
    this.species = [];
    this._maxSpecies = MAX_SPECIES;
    this.init();
  }

  static get events() {
    return {
      MAX_SPECIES_REACHED: "max_species_reached",
      SPECIES_CREATED: "species_created",
    };
  }

  get speciesCount() {
    return this.species.length;
  }

  async init() {
    this.createSpecies();
  }

  async createSpecies() {
    let isMaxSpeciesReached = false;
    let speciesCount = 1;

    while (isMaxSpeciesReached === false) {
      const species = new Species();

      species.on(StarWarsUniverse.events.SPECIES_CREATED, () =>
        this._onSpeciesCreated(species)
      );

      this.on(StarWarsUniverse.events.SPECIES_CREATED, (species) =>
        this._checkForMaxSpecies(species)
      );

      this.once(
        StarWarsUniverse.events.MAX_SPECIES_REACHED,
        () => (isMaxSpeciesReached = true)
      );

      await species.init(URL + speciesCount);
      speciesCount++;
    }
    // console.log(this.species);
  }

  _onSpeciesCreated(species) {
    this.species.push(species);
    this.emit(StarWarsUniverse.events.SPECIES_CREATED, {
      speciesCount: this.speciesCount,
    });
  }

  _checkForMaxSpecies(species) {
    if (species.speciesCount === this._maxSpecies)
      this.emit(StarWarsUniverse.events.MAX_SPECIES_REACHED);
  }
}
