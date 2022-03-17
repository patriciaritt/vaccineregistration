import {countRegistrations} from "./model.js";

let view;

class View{

    constructor() {
        this.DOM = {
            create: $("#createVacdate"),
            safe: $("#safeCreation"),
            cancel: $("#cancelCreation")
        }
    }

    getDOM() {
        return this.DOM;
    }

    /*-------------------------------------------------------------------
    * this method draws the accordion which shows the vaccinedate and the
    * number of possible registrations + true registrations*/
    drawAccordion(v) {
        let accordion = $(`<div class="accordion-item" id="item_${v.date}">
            <h2 class="accordion-header" id="panelsStayOpen-headingOne">
                <button class="accordion-button collapsed accordion collapsed" type="button" 
                data-bs-toggle="collapse" data-bs-target="#collapse_${v.date}" 
                aria-expanded="false" aria-controls="collapse_${v.date}">
                    Impftermin <pre> </pre><span id="accordionDate_${v.date}">${v.date}</span><pre> </pre> | 
                    Mögliche Anmeldungen: ${v.possibleRegistrations} | 
                    Anmeldungen gesamt:<pre> </pre><span id="registrationsFor_${v.date}">${countRegistrations}</span>
                </button>
            </h2>
            <div id="collapse_${v.date}" class="accordion-collapse collapse"
                 aria-labelledby="panelsStayOpen-headingOne">
                <div class="accordion-body">
                    <table class="table">
                    <thead>
                    <tr>
                        <th scope="col">Datum</th>
                        <th scope="col">Uhrzeit</th>
                        <th scope="col">Name</th>
                        <th scope="col">Ort</th>
                        <th scope="col">Adresse</th>
                        <th scope="col">Terminverwaltung</th>
                    </tr>
                    </thead>
                    <tbody class="accordion_${v.date}">

                    </tbody>
                    </table>
                </div>
            </div>
        </div>`);
        $("#emptyspace").append(accordion);
    }

    appendNewVaccinedate(v) {
        let vaccinedate = $(`
        <tr id="row_${v.id}">
            <th scope="row">${v.date}</th>
            <td>${v.time}</td>
            <td id="registeredName_${v.id}">${v.name}</td>
            <td>${v.place}</td>
            <td>${v.adress}</td>
            <td>
                <div class="dropdown">
                    <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton_${v.id}"
                            data-bs-toggle="dropdown" aria-expanded="false">
                        <span id="buttonText_${v.id}">Verwalten</span>
                    </button>
                    <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                        <li><a class="dropdown-item" id="safeVacDose_${v.id}">Verabreichung speichern</a></li>
                        <li><a class="dropdown-item" id="deleteVacdate_${v.id}">Löschen</a></li>
                    </ul>
                </div>
            </td>
        </tr>
        `);

        $(".accordion_" + v.date).append(vaccinedate);
    }
}

export function getInstance() {
    if (!view) {
        view = new View();
    }
    return view;
}






