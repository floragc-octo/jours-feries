import dayjs from 'dayjs'

const DATE_FORMAT = 'YYYY-MM-DD'

const getAnneeCourante = () => dayjs().year()
const getAujourdhui = () => dayjs().format(DATE_FORMAT)

const getProchainJourFerie = (joursFeries, jourCourant = getAujourdhui()) => {
    for (const [date, description] of Object.entries(joursFeries)) {
        const dateFormate = dayjs(date).format(DATE_FORMAT)
        if (dayjs(jourCourant).isBefore(dateFormate) || dayjs(jourCourant).isSame(dateFormate, 'day')) {
            return ({ jourFerie: dateFormate, description })
        }
    }
}

const getJoursFeriesEnFrance = async() => {
    const reponse = await fetch(`https://calendrier.api.gouv.fr/jours-feries/metropole/${getAnneeCourante()}.json`)
    const reponseJson = await reponse.json()
    return reponseJson
}

const afficheAujourdhui = (description) => {
    const descriptionJour = document.createElement('p');
    descriptionJour.innerHTML = "Aujourd'hui est un jour férié en France 🥳"
    const intituleJour = document.createElement('span');
    intituleJour.innerHTML = description
    document.querySelector('main').innerHTML = ''
    document.querySelector('main').appendChild(descriptionJour)
    document.querySelector('main').appendChild(intituleJour)
}

const afficheProchainJourFerie = (description) => {
    document.getElementById('fetch-jour').innerHTML = description
}

const getDelai = (jourAComparer) => dayjs(jourAComparer).diff(getAujourdhui(), 'day')
const afficheDelai = (date) => {
    document.getElementById('compute-delai').innerHTML = getDelai(date)
}

const descriptionDesJours = {
    0: "dimanche 😭",
    1: "lundi 😎",
    2: "mardi 😁",
    3: "mercredi 😄",
    4: "jeudi 😁",
    5: "vendredi 😎",
    6: "samedi 😭",
}
const afficheJourDeLaSemaine = (jourFerie) => {
    document.getElementById('compute-detail').innerHTML = descriptionDesJours[dayjs(jourFerie).day()]
}

getJoursFeriesEnFrance()
    .then(data => {
        const { jourFerie, description } = getProchainJourFerie(data)
        if (dayjs(jourFerie).format(DATE_FORMAT) === getAujourdhui()) {
            afficheAujourdhui(description)
        } else {
            afficheProchainJourFerie(description)
            afficheDelai(jourFerie)
            afficheJourDeLaSemaine(jourFerie)
        }
    })
    .catch(error => console.log(error.message))