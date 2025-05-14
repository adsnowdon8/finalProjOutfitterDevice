export const locationThenWeather = async (
  setLocation: (location: string) => void
) => {
  const res = await fetch("https://ipinfo.io/json?token=4baf14703426ff").then(
    (response) =>
      response
        .json()
        .then((data) => {
          const { loc } = data; // loc is a string in 'latitude,longitude' format
          const [latitude, longitude]: [string, string] = loc.split(",");
          setLocation(
            data["city"] + ", " + data["region"] + ", " + data["country"]
          );
          const weatherApiKey = "AIzaSyDCJS2urx3-4O7hz5iwjyyNZlldydBd_4U";

          const key = "83c8773cdf537954463c18e83113c811";
          const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&appid${key}`;
          // console.log("url", url);
          // const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${weatherApiKey}&units=metric`;
          const weatherUrl = `https://weather.googleapis.com/v1/forecast/hours:lookup?key=${weatherApiKey}&location.latitude=${latitude}&location.longitude=${longitude}`;
          // console.log("weatherUrl", weatherUrl);

          const weather = `https://api.weather.gov/points/${latitude},${longitude}`;
          return fetch(weather);
        })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network was not ok");
          }
          const res = response.json();
          return res;
        })
        .then((weatherData) => {
          return weatherData.properties;
        })
        .then((properties) => {
          const hourlyForecostUrl = properties.forecastHourly;
          return fetch(hourlyForecostUrl).then((response) => {
            return response.json();
          });
        })
        .then((hourlyForecast) => {
          return hourlyForecast.properties;
        })
        .then((properties) => {
          const periods = properties.periods;
          const tenPeriods = periods.slice(0, 10);
          // convert periods to srings
          const tenPeriodsStrings = tenPeriods.map((period: any) => {
            const time = new Date(period.startTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });
            return `${period.isDaytime ? "Today" : "Tonight"} at ${time}: ${
              period.shortForecast
            }, ${period.temperature}°${period.temperatureUnit}. Winds ${
              period.windDirection
            } at ${period.windSpeed}. Chance of rain: ${
              period.probabilityOfPrecipitation.value
            }%. Relative Humidity: ${
              period.relativeHumidity.value
            }%. Dew point:${period.dewpoint.value.toFixed(1)}°C.`;
          });

          return tenPeriodsStrings.join(" ");
        })
        .catch((error) => {
          console.error("Error:", error);
        })
  );
  return res;
};
