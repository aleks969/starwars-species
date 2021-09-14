import EventEmitter from "eventemitter3";

export default class Species extends EventEmitter {
  constructor() {
    super();
    this.name = null;
    this.classification = null;
  }

  static get events() {
    return {
      SPECIES_CREATED: "species_created",
    };
  }

  async init(URL) {
    const res = await fetch(URL);
    const speciesData = await res.json();
    // console.log(speciesData);
    this.name = speciesData.name;
    this.classification = speciesData.classification;

    this.emit(Species.events.SPECIES_CREATED);
  }
}
