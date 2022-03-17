import {getInstance as Model} from "./model.js";
import {getInstance as View} from "./view.js";
import Vaccinedate, {datelist} from "./vaccine.js";



let controller;
let init = Symbol();

let otherID = 0;
export {otherID};

class Controller {
    constructor() {
        //Model und View initialisieren
        let model = Model();
        let view = View();
        //Model Events registrieren
        model.subscribe("drawAccordion", view, view.drawAccordion);
        model.subscribe("appendNewVaccinedate", view, view.appendNewVaccinedate);

        //Event Handler registrieren
        this[init]();


        model.init();
        console.log("after init model");
    }

    addNewRegistrations(regname){
        console.log("Es geht in die Methode rein")
        Model().addRegistrations(regname);
    }


    [init](){
        let DOM = View().getDOM();
        console.log("dom", DOM);
        let vac = new Model();
        /*------------------ event handling ----------------------------------*/
        /* if the admin clicks on "Neuen Impftermin erstellen, he/she should be
              * able to create a new vaccine date and choose its metrics*/
        DOM.create.on("click", (e) => {
            console.log("create Vaccdate click geht");
            /* hide and show the necessary things*/
            $("#createVacdate").css("display", "none");
            $("#createNewVaccinedate").css("display", "block");
        });

        /* safes a new vaccine date + form input validation*/
        DOM.safe.on("click", (e) => {
            let id = "createdVax_" + otherID;
            let defaultdate = $("#fdate").val();
            //change format of date so that it suits austrian standards
            let splitedValues = defaultdate.split("-");
            let newDateFormat = splitedValues[2] + "-" + splitedValues[1] + "-" + splitedValues[0];
            let date = newDateFormat;
            let time = $("#ftime").val();
            let name = "-";
            let place = $("#flocation").val();
            let adress = $("#fadress").val();
            let possibleRegistrations = $("#fregistrations").val();
            let registrations = "-";

            let now = new Date(Date.now());
            now.setHours(0, 0, 1);
            let dateObj = new Date(defaultdate);

            if (date !== "" && place !== "" && adress !== "" && isNaN(possibleRegistrations) !== true &&
                time !== "" && possibleRegistrations !== "") {

                if(dateObj.getTime() > now.getTime()){

                    let v = new Vaccinedate(id, date, time, name, place, adress, possibleRegistrations, registrations);

                    vac.handleVaccinedate(v);
                    alert("Neuer Impftermin wurde zur Liste hinzugefügt!");
                    otherID++;

                    vac.addRegistrations(v.name);

                    /* hide and show the necessary things*/
                    $("#createVacdate").css("display", "block");
                    $("#createNewVaccinedate").css("display", "none");
                }
                else{
                    alert("Das Datum muss größer als das heutige sein!");
                }

            } else if (date !== "" && place !== "" && adress !== "" && isNaN(possibleRegistrations) !== true &&
                time !== "" && possibleRegistrations === "") {
                let v = new Vaccinedate(id, date, time, name, place, adress, possibleRegistrations, registrations);

                if (datelist.includes(date)) {
                    vac.handleVaccinedate(v);
                    alert("Neuer Impftermin wurde zur Liste hinzugefügt!");
                    otherID++;
                    vac.addRegistrations(v.name);
                    /* hide and show the necessary things*/
                    $("#createVacdate").css("display", "block");
                    $("#createNewVaccinedate").css("display", "none");

                } else {
                    alert("Sie erstellen einen neuen Impftag." +
                        " Geben Sie im Feld 'Mögliche Anmeldungen' eine Anzahl an max. möglichen Anmeldungen an!");
                }

            } else {
                if (date === "") {
                    alert("Bitte überprüfen Sie das Datum!")
                }
                if (place === "") {
                    alert("Bitte überprüfen Sie den Ort")
                }
                if (adress === "") {
                    alert("Bitte überprüfen Sie die Adresse!")
                }
                if (isNaN(possibleRegistrations) !== false) {
                    alert("Bitte überprüfen Sie die die Eingabe in 'Mögliche Anmeldungen'. Geben Sie nur Zahlen an!");
                }
                if (time === "") {
                    alert("Sie müssen eine Uhrzeit angeben. Jeder Impftag besteht aus mind. 1 Impftermin.")
                }
            }


        });

        /* cancels the creation of a new vaccine date */
        DOM.cancel.on("click", (e) => {
            if (confirm("Möchten Sie diesen Impftermin tatsächlich verwerfen?") === true) {
                /* hide and show the necessary things*/
                $("#createVacdate").css("display", "block");
                $("#createNewVaccinedate").css("display", "none");
            }
        });
    }
}

export function getInstance(){
    if(!controller){
        controller = new Controller();
    }
    return controller;
}