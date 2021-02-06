//Symbol *C &#8451

class App {
  #htmlMainElements = {
    main: document.querySelector("[data-mainInfo]"),
    city: document.querySelector("[data-city]"),
    icon: document.querySelector("[data-img]"),
    tempMax: document.querySelector("[data-tempMax]"),
    tempFell: document.querySelector("[data-tempFell]"),
    skyInfo: document.querySelector("[data-sky]"),
    buttonMore: document.querySelector("[data-moreInfo]"),
  };

  #htmlExtraElements = {
    window: document.querySelector("[data-otherInfo]"),
    country: document.querySelector("[data-country]"),
    sunrise: document.querySelector("[data-sunrise]"),
    sunset: document.querySelector("[data-sunset]"),
    pressure: document.querySelector("[data-pressure]"),
    humidity: document.querySelector("[data-humidity]"),
    buttonClose: document.querySelector("[data-btnClose]"),
  };

  //Icos Unicode
  #icons = {
    cloud: "f0c2",
    rain: "f740",
    sun: "f185",
    snow: "f2dc",
    night: "f186",
  };

  #bacgroundImages = {
    base: "base",
    night: "night",
  };

  #apiKey = "a47ba9bc61672dd3a015888eb0980e7b";
  constructor(input, button) {
    this.input = input;
    this.button = button;
  }

  init() {
    this.button.addEventListener("click", (e) => {
      e.preventDefault();
      if (this.input.value) {
        this.apiRequest(this.input.value);
      }
    });
  }

  apiRequest(value) {
    console.log("api request");
    fetch(
      `http://api.openweathermap.org/data/2.5/weather?q=${value}&appid=${
        this.#apiKey
      }&units=metric`
    )
      .then((response) => {
        if (!response.ok) {
          throw Error("Something wrong");
        }
        return response.json();
      })
      .then((data) => {
        this.#printData({
          cityName: data.name,
          maxTemp: data.main.temp_max,
          fellTemp: data.main.feels_like,
          skyInfo: data.weather[0].main,
          country: data.sys.country,
          sunrise: data.sys.sunrise,
          sunset: data.sys.sunset,
          pressure: data.main.pressure,
          humidity: data.main.humidity,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  #printData({
    name,
    maxTemp,
    fellTemp,
    skyInfo,
    country,
    sunrise,
    sunset,
    pressure,
    humidity,
  }) {
    console.log(skyInfo);
    if (name == undefined) {
      this.#htmlMainElements.city.innerHTML = this.input.value;
    } else {
      this.#htmlMainElements.city.innerHTML = name;
    }
    this.input.value = "";
    this.#htmlMainElements.tempMax.innerHTML = `Current:${Math.round(
      maxTemp
    )}&#8451`;
    this.#htmlMainElements.tempFell.innerHTML = `Perceived: ${Math.round(
      fellTemp
    )}&#8451`;
    if (skyInfo === "Clouds") {
      this.#htmlMainElements.icon.innerHTML = `&#x${this.#icons.cloud}`;
    } else if (skyInfo === "Clear") {
      this.#htmlMainElements.icon.innerHTML = `&#x${this.#icons.sun}`;
    } else if (skyInfo === "Snow") {
      this.#htmlMainElements.icon.innerHTML = `&#x${this.#icons.snow}`;
    } else if (skyInfo === "Rain") {
      this.#htmlMainElements.icon.innerHTML = `&#x${this.#icons.rain}`;
    } else {
      this.#htmlMainElements.icon.innerHTML = `&#x${this.#icons.cloud}`;
    }
    this.#htmlMainElements.skyInfo.textContent = skyInfo;
    this.#htmlMainElements.buttonMore.style.display = "block";
    this.#htmlMainElements.buttonMore.addEventListener("click", () => {
      this.#printMoreInfo({ country, sunrise, sunset, pressure, humidity });
      this.#htmlExtraElements.window.style.display = "block";
    });
  }

  #printMoreInfo({ country, sunrise, sunset, pressure, humidity }) {
    //Zmiana Display w Okienkach, wyswietlenie danych,
    this.#htmlExtraElements.buttonClose.addEventListener("click", () => {
      this.#htmlExtraElements.window.style.display = "none";
    });

    this.#htmlExtraElements.country.textContent = `${country}`;
    this.#htmlExtraElements.sunrise.textContent = `${this.#countTime(sunrise)}`;
    this.#htmlExtraElements.sunset.textContent = `${this.#countTime(sunset)}`;
    this.#htmlExtraElements.pressure.textContent = `${pressure} hPa`;
    this.#htmlExtraElements.humidity.textContent = `${humidity} %`;
  }

  #countTime(time) {
    const a = new Date(time * 1000);
    let hours = a.getHours();
    let minutes = a.getMinutes();
    let seconds = a.getSeconds();

    let currentTime = `${hours < 9 ? `0${hours}` : hours}:
    ${minutes < 9 ? `0${minutes}` : minutes}:
    ${seconds < 9 ? `0${seconds}` : seconds}`;
    return currentTime;
  }
}

window.onload = () => {
  const app = new App(
    document.querySelector("[data-input]"),
    document.querySelector("[data-button]")
  );
  app.init();
};
