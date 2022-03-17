
let datelist = [];
export {datelist};

export default class Vaccinedate {

    constructor(id, date, time, name, place, adress, possibleRegistrations, registrations) {
        this.id = id;
        this.date = date;
        this.time = time;
        this.name = name;
        this.place = place;
        this.adress = adress;
        this.possibleRegistrations = possibleRegistrations;
        this.registrations = registrations;
    }
}


