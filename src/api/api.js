// const apiKey = 'bfcf142e6a9777c32405ae81e8b19a59';

// const getWeather = async (city) => {
//     return await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`)
//     .then((res) => res.json())
//     .then((json) => {
//         return json;
//     })
// }

// export default getWeather;

const getWeather = async (city, latitude = null, longitude = null) => {
    const apiKey = 'bfcf142e6a9777c32405ae81e8b19a59'; // Replace with your actual API key
    
    let endpoint;
    if (city) {
        endpoint = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    } else if (latitude !== null && longitude !== null) {
        endpoint = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
    } else {
        throw new Error("No city or location provided");
    }

    const response = await fetch(endpoint);
    if (!response.ok) {
        throw new Error("Weather data not available");
    }
    const data = await response.json();
    return data;
};

export default getWeather;

  