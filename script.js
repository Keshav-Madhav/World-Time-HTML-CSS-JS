const nameP = document.getElementById('name');
const timeP = document.getElementById('time');
const paths = document.querySelectorAll('.allPaths');

var fetchedCountry = '';
var isLoading = false;
var countryTimeMap = {}; // Map to store country and time data

// Add event listeners to each country path
paths.forEach(countryPath => {
  countryPath.addEventListener('mouseenter', function() {
    const countryName = countryPath.getAttribute('id');
    nameP.textContent = countryName;
    nameP.style.display = 'block';

    // Check if time data for the country is available in the map
    if (countryTimeMap.hasOwnProperty(countryName)) {
      let countryTime = new Date(countryTimeMap[countryName].time);
      let fetchedLocalTime = new Date(countryTimeMap[countryName].localTime);
      let timeDifference = new Date().getTime() - fetchedLocalTime.getTime(); // Calculate time difference
      let adjustedTime = new Date(countryTime.getTime() + timeDifference);
      timeP.textContent = adjustedTime.toLocaleString(); // Display adjusted time
      timeP.style.display = 'block';
    } else {
      timeP.style.display = 'none';
    }
  });

  countryPath.addEventListener('mouseleave', function() {
    nameP.textContent = '';
    nameP.style.display = 'none';

    timeP.style.display = 'none';
  });

  countryPath.addEventListener('click', async function() {
    const countryName = countryPath.getAttribute('id');
    isLoading = true;
    timeP.textContent = 'Loading...';
    timeP.style.display = 'block';

    // Check if time data for the country is available in the map
    if (countryTimeMap.hasOwnProperty(countryName)) {
      let countryTime = new Date(countryTimeMap[countryName].time);
      let fetchedLocalTime = new Date(countryTimeMap[countryName].localTime);
      let timeDifference = new Date().getTime() - fetchedLocalTime.getTime(); // Calculate time difference
      let adjustedTime = new Date(countryTime.getTime() + timeDifference);
      timeP.textContent = adjustedTime.toLocaleString(); // Display adjusted time
      isLoading = false;
      return;
    }

    const timeRes = getData(countryName);

    timeRes.then(time => {
      let localTime = new Date(); // Store local time when data is fetched
      timeP.textContent = time;
      isLoading = false;
      // Store the fetched time and local time in the map
      countryTimeMap[countryName] = { time: time, localTime: localTime };
    }).catch(error => {
      timeP.textContent = 'Failed to load data';
      isLoading = false;
    });
  });
});

// Listen to mousemove event on the document
document.addEventListener('mousemove', function(event) {
  // Update the position of the name div to follow the mouse
  nameP.style.left = event.pageX + 20 + 'px';
  nameP.style.top = event.pageY - 20 + 'px';

  // Update the position of the time div to follow the mouse
  timeP.style.left = event.pageX + 20 + 'px';
  timeP.style.top = event.pageY + 20 + 'px';
});

async function getData(place) {
  fetchedCountry = place;

  const url = `https://timezone.abstractapi.com/v1/current_time/?api_key=d4c18bf2045641bea207db7f614a0409&location=${place}`;
  const response = await fetch(url);
  const data = await response.json();

  return data.datetime;
}
