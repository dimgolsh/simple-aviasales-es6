"use strict";

let formSearch = document.querySelector(".form-search"),
  inputCitiesFrom = document.querySelector(".input__cities-from"),
  inputCitiesTo = document.querySelector(".input__cities-to"),
  dropdownCitiesFrom = document.querySelector(".dropdown__cities-from"),
  dropdownCitiesTo = document.querySelector(".dropdown__cities-to"),
  inputDateDepart = document.querySelector(".input__date-depart"),
  cheapestTicket = document.getElementById("cheapest-ticket"),
  otherCheapTickets = document.getElementById("other-cheap-tickets");

//города

//let citiesApi = 'http://api.travelpayouts.com/data/ru/cities.json';
let citiesApi = "dataBase/cities.json";
let proxy = "https://cors-anywhere.herokuapp.com/";
let API_KEY = "7f084d8c89ba7edfe2f7a43d0eb58c71";
let calendar = "http://min-prices.aviasales.ru/calendar_preload";
let calendar_params =
  "?origin=MOW&destination=LED&depart_date=2020-05-05&one_way=true";
const MAX_COUNT = 10;
let city = [];

let getData = (url, callback) => {
  let request = new XMLHttpRequest();

  request.open("GET", url);

  request.addEventListener("readystatechange", () => {
    if (request.readyState !== 4) return;

    if (request.status === 200) {
      callback(request.response);
    } else {
      console.error(request.status);
    }
  });

  request.send();
};

let showCity = function(input, list) {
  list.textContent = "";

  if (input.value !== "") {
    let filterCity = city.filter(item => {
      let fixItem = item.name.toLocaleLowerCase();
      return fixItem.startsWith(input.value.toLocaleLowerCase());
    });

    filterCity.forEach(item => {
      let li = document.createElement("li");
      li.classList.add("dropdown__city");
      li.textContent = item.name;
      list.append(li);
    });
  }
};

let selectCity = (e, input, list) => {
  let target = event.target;
  if (target.tagName.toLowerCase() === "li") {
    input.value = target.textContent;
    list.textContent = "";
  }
};

let getNameCity = code => {
  let objCity = city.find(item => item.code === code);
  console.log(objCity);
  return objCity.name;
};

let getDate = date => {
  return new Date(date).toLocaleString("ru", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
};

let getChanges = num => {
  if (num) {
    return num === 1 ? "c 1 peresa" : "C двумя";
  } else {
    return "Без пересадок";
  }
};

let getLinkAviasales = data => {
  let link = "https://www.aviasales.ru/search/";

  link += data.origin;
  let date = new Date(data.depart_date);

  let day = date.getDate();
  link += day < 10 ? "0" + day : day;
  let month = date.getMonth();

  link += month < 10 ? "0" + month : month;

  link += data.destination;
  console.log(link);

  return link + 1;
};

let createCard = data => {
  let ticket = document.createElement("article");
  ticket.classList.add("ticket");

  let deep = "";

  if (data) {
    deep = `
          <h3 class="agent">${data.gate}</h3>
      <div class="ticket__wrapper">
        <div class="left-side">
          <a href="${getLinkAviasales(data)}" class="button button__buy">Купить
            за ${data.value}₽</a>
        </div>
        <div class="right-side">
          <div class="block-left">
            <div class="city__from">Вылет из города
              <span class="city__name">${getNameCity(data.origin)}</span>
            </div>
            <div class="date">${getDate(data.depart_date)}</div>
          </div>

          <div class="block-right">
            <div class="changes">${getChanges(data.number_of_changes)}</div>
            <div class="city__to">Город назначения:
              <span class="city__name">${getNameCity(data.destination)}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  } else {
    deep = "<h3>К сожалению не нашлось</h3>";
  }
  ticket.insertAdjacentHTML("afterbegin", deep);

  return ticket;
};

let renderCheapDay = cheapTicket => {
  let ticket = createCard(cheapTicket[0]);

  cheapestTicket.append(ticket);
};

let renderCheapYear = cheapTickets => {
  otherCheapTickets.style.display = "block";

  otherCheapTickets.innerHTML = "<h2>Самые дешевые билеты на другие даты</h2>";

  cheapTickets.sort((a, b) => a.value - b.value);

  for (let i = 0; i < cheapTickets.length && i < MAX_COUNT; i++){
    let ticket = createCard(cheapTickets[i]);
    otherCheapTickets.append(ticket);

  }
 
};

let renderCheap = (response, date) => {
  cheapestTicket.style.display = "block";
  cheapestTicket.innerHTML = "<h2>Самый дешевый билет на выбранную дату</h2>";

  let cheapTicket = JSON.parse(response).best_prices;

  let cheapTicketDay = cheapTicket.filter(item => item.depart_date == date);

  renderCheapDay(cheapTicketDay);
  renderCheapYear(cheapTicket);

  console.log(cheapTicketDay);
};

inputCitiesTo.addEventListener("input", () => {
  showCity(inputCitiesTo, dropdownCitiesTo);
});

inputCitiesFrom.addEventListener("input", () => {
  showCity(inputCitiesFrom, dropdownCitiesFrom);
});

dropdownCitiesFrom.addEventListener("click", event => {
  selectCity(event, inputCitiesFrom, dropdownCitiesFrom);
});

dropdownCitiesTo.addEventListener("click", event => {
  selectCity(event, inputCitiesTo, dropdownCitiesTo);
});

formSearch.addEventListener("submit", e => {
  e.preventDefault();

  console.log(e);

  let formData = {
    from: city.find(item => {
      return inputCitiesFrom.value === item.name;
    }),
    to: city.find(item => {
      return inputCitiesTo.value === item.name;
    }),
    date: inputDateDepart.value
  };

  let requestData2 =
    "?origin=" +
    formData.from +
    "&destination=" +
    formData.to +
    "&depart_date=" +
    formData.date +
    "&one_way=true";

  if (formData.from && formData.to) {
    let requestData = `?origin=${formData.from.code}&destination=${formData.to.code}&depart_date=${formData.date}&one_way=true`;

    console.log(formData);

    getData(calendar + requestData, response => {
      renderCheap(response, formData.date);
      console.log(response);
    });
  } else {
    alert("ff");
  }
});

getData(citiesApi, data => {
  console.log(JSON.parse(data));
  city = JSON.parse(data).filter(item => item.name);

  city.sort(function(a, b) {
    if (a.name > b.name) {
      return 1;
    }
    if (a.name < b.name) {
      return -1;
    }
    // a должно быть равным b
    return 0;
  });
});

/*getData(calendar + calendar_params + '&token=' + API_KEY,
 data => {
  let ticket =  JSON.parse(data).best_prices.filter(item => item.depart_name === '2020-05-05');
  console.log('ffff');
  console.log(ticket);
});*/
