import Subject from "./subject.js";
import Vaccinedate, {datelist} from "./vaccine.js";


let vaccinemodel;

let loadFromJSON = Symbol();
let deleteVaccinedate = Symbol();
let removeFromList = Symbol();
let saveVaccAdminister = Symbol();
let appendNewVaccinedate = Symbol();
let countAllRegistrations = Symbol();

let countRegistrations = 0;
export {countRegistrations};

class Vaccinemodel extends Subject{

    #prevDate;

    constructor() {
        super();
        this.elements = new Map();
    }

    init() {
        console.log("in Model init");
        this[loadFromJSON]();
        this[deleteVaccinedate]();
        this[removeFromList]();
        this[saveVaccAdminister]();
        this[appendNewVaccinedate]();
        this[countAllRegistrations]();
    }

    [loadFromJSON](){
        /* hide form for creating new vaccine dates */
        $("#createNewVaccinedate").css("display", "none");

        fetch("json/metrics.json").then((response) => {
            return response.json();
        }).then(data => {
            for (let vacdate of data.vaccinedata) {
                let id = vacdate.id;
                let date = vacdate.date;
                let time = vacdate.time;
                let name = vacdate.name;
                let place = vacdate.place;
                let adress = vacdate.adress;
                let possibleRegistrations = vacdate.possibleRegistrations;
                let registrations = vacdate.registrations;

                //JSON Objekte in Vaccine Objekte umwandeln
                let v = new Vaccinedate(id, date, time, name, place, adress, possibleRegistrations, registrations);
                this.handleVaccinedate(v);
            }
        });
    }

    /*-------------------------------------------------------------------
    * if a user registers for a vaccine, its name will be added to
    the next free vaccine date - this method is only accessible threw
    the console*/
    addRegistrations(name){
        for (let vacdate of this.elements.values()) {
            if (vacdate.name === "-") {
                $("#registeredName_" + vacdate.id).text(name);
                vacdate.name = name;
                console.log("Herzlichen Glückwunsch! Sie wurden dem nächsten freien Termin zugeordnet." +
                    "Ihr Termin ist am " + vacdate.date + " um " + vacdate.time + " Uhr.")
                break;
            } else {
                console.log("Leider sind momentan keine Termine frei");
            }
        }
    }

    /* this function adds the vaccine dates from the json and contains
    * click handlers for the data */
    handleVaccinedate(v) {

        //add vaccinedate to the vaccinedate list
        this.addToList(v);

        //draw vaccinedate and/or accordion
        this.drawDate(v);

        /* --------------------------------------------------
        deletes a vaccine date (only if registrations = 0) */
        $("#deleteVacdate_" + v.id).on("click", (e) => {
            this[deleteVaccinedate](v);
        });

        /* --------------------------------------------------
        safes the giving of a vaccinedose */
        $("#safeVacDose_" + v.id).on("click", (e) => {
            this[saveVaccAdminister](v.id);
        });
    }

    /*-------------------------------------------------------------------
    * this adds a vaccinedate to the vaccinelist map*/
    addToList(v) {
        this.elements.set(v.id, v);
    }

    /*-------------------------------------------------------------------
    with this method, the vaccinedate is being added to the accordion with
    the same date. If there is no accordion with the same date, one is going
    to be created.
    "datelist" is an array which saves the dates of the vaccinedays. This array
    helps to check if a new vaccinedate can be added to a vaccineday or if a new
    vaccineday/accordion needs to be created*/
    drawDate(v) {
        if (this.#prevDate === undefined) {
            super.notify("drawAccordion", v);
            this[appendNewVaccinedate](v);
            datelist.push(v.date);
        } else if (this.#prevDate === v.date) {
            this[appendNewVaccinedate](v);
        } else {
            if (datelist.includes(v.date)) {
                this[appendNewVaccinedate](v);
            } else {
                super.notify("drawAccordion", v);
                if (v.time !== "") {
                    this[appendNewVaccinedate](v);
                    datelist.push(v.date);
                }
            }
        }
        this.#prevDate = v.date;
        console.log(this.#prevDate);
    }

    /*-------------------------------------------------------------------
    deleting a vaccine date without registration */
    [deleteVaccinedate](v) {
        console.log("in delete vacc");
        let count = $("#registeredName_" + v.id).html();
        if (count === '-') {
            countRegistrations = 0;
            $("#row_" + v.id).remove();
            this[removeFromList](v);
            this[countAllRegistrations](v.date);
            //if there are zero registrations, the whole vaccine day gets deleted
            if (countRegistrations === 0) {
                $("#item_" + v.date).remove();
                let index = datelist.indexOf(v.date);
                //date gets removed from datelist
                datelist.splice(index, 1);
                console.log(datelist);
            }
        } else {
            alert("Impftermine die Anmeldungen beinhalten können nicht gelöscht werden!")
        }
    }

    /*-------------------------------------------------------------------
    with this method, the admin is capable of saving the
    administration of a vaccine dose (the admin confirms that a person got
    it's vaccine*/
    [saveVaccAdminister](id) {
        if (confirm("Möchten Sie wirklich die Impfverabreichung speichern?") === true) {
            $("#dropdownMenuButton_" + id).toggleClass('btn-secondary btn-success');
            $("#buttonText_" + id).text("Impfung verabreicht");
            $("#safeVacDose_" + id).remove();
            $("#deleteVacdate_" + id).remove();
            $("#row_" + id).css("opacity", "50%");
        }
    }

    /*-------------------------------------------------------------------
    * removes a deleted vaccinedate from the vaccinelist map*/
    [removeFromList](v){
        this.elements.delete(v.id);
    }

    /*-------------------------------------------------------------------
    this method appends the new Vaccine date to the list*/
    [appendNewVaccinedate](v) {
        countRegistrations = 0;
        super.notify("appendNewVaccinedate", v);
        this[countAllRegistrations](v.date);
    }

    /*-------------------------------------------------------------------
    * helps to count all registrations of a vaccine day*/
    [countAllRegistrations](date){
        for(let value of this.elements.values()){
            if(value.date === date){
                countRegistrations++;
                $("#registrationsFor_"+date).text(countRegistrations);
            }
        }
    }
}

export function getInstance() {
    if (!vaccinemodel) {
        vaccinemodel= new Vaccinemodel();
    }
    return vaccinemodel;
}