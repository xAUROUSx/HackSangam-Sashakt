
        const searchInput = document.getElementById('searchInput');
        const suggestionsList = document.getElementById('suggestions');
        const cityDetailsContainer = document.getElementById('cityDetailsContainer');
        const healthAdviceContainer = document.getElementById('healthAdviceContainer');
        const healthAdviceElement = document.getElementById('healthAdvice');
        const cityNameElement = document.getElementById('cityName');
        const stateElement = document.getElementById('state');
        const temperatureElement = document.getElementById('temperature');
        const wqiElement = document.getElementById('wqi');
        const wqiImageElement = document.getElementById('wqiImage');
        const wqi = document.getElementById('wqi');
        

        let jsonData;
        let allCitiesWqiData = [];

        fetch('your_json_file.json')
            .then(response => response.json())
            .then(data => {
                jsonData = data;
                searchInput.addEventListener('input', updateSuggestions);
            })
            .catch(error => console.error('Error loading JSON:', error));

        function updateSuggestions() {
            const inputValue = searchInput.value.toLowerCase();
            const filteredCities = jsonData.filter(entry =>
                entry.City.toLowerCase().includes(inputValue)
            );

            displaySuggestions(filteredCities);
        }

        function displaySuggestions(suggestions) {
            suggestionsList.innerHTML = '';

            suggestions.forEach(entry => {
                const listItem = document.createElement('li');
                listItem.textContent = entry.City;
                listItem.addEventListener('click', () => handleSuggestionClick(entry));
                suggestionsList.appendChild(listItem);
            });
        }

        function handleSuggestionClick(selectedEntry) {
            console.log('Selected Entry:', selectedEntry);

            // Display details in the container
            cityNameElement.textContent = `${selectedEntry.City},${selectedEntry.State}`;
            wqiElement.textContent = `${selectedEntry.WQI}`;

            // Set image based on WQI range
            let wqiImageSrc = '';
            if (selectedEntry.WQI >= 0 && selectedEntry.WQI <= 50) {
                wqiImageSrc = '1.png';
                bg='green';
                message = "Excellent";
                document.getElementById("wqi").style.color = '#000';
                // Show health advice for WQI range 0-50
                displayHealthAdvice(' <li>Adequate water quality.</li><li> Safe for consumption and recreational activities.</li><li>Minimal health risks associated with this range.</li><li>Regular monitoring is still recommended to ensure long-term safety.</li><li>Encourage sustainable water usage practices.</li> ');
            } else if (selectedEntry.WQI > 50 && selectedEntry.WQI <= 100) {
                wqiImageSrc = '2.png';
                bg='yellow';
                message = "Good";
                document.getElementById("wqi").style.color = '#000';
                // Show health advice for WQI range 50-100
                displayHealthAdvice(' <li>Moderate water quality.</li><li>Generally safe for consumption and recreational use.</li><li>Slight potential health risks for sensitive individuals.</li><li> Implement basic water treatment processes if using for drinking. </li><li> Regular monitoring and periodic water testing advised.</li> ');
            } else if (selectedEntry.WQI > 100 && selectedEntry.WQI <= 200) {
                bg='orange';
                wqiImageSrc = '3.png';
                message = "Bad";
                document.getElementById("wqi").style.color = '#000';
                // Show health advice for WQI range 100-200
                displayHealthAdvice(' <li>Fair water quality.</li><li> Caution advised, especially for vulnerable populations.</li><li> Potential health risks may increase, and individuals with weakened immune systems should take precautions.</li><li> Enhanced water treatment recommended for drinking purposes. </li><li> Restrict swimming in untreated water sources within this range.</li> ');
            } else if (selectedEntry.WQI > 200 && selectedEntry.WQI <= 300) {
                bg='red';
                wqiImageSrc = '4.png';
                message = "Poor";
            document.getElementById("wqi").style.color = '#fff';

                // Show health advice for WQI range 200-300
                displayHealthAdvice(' <li>Poor water quality. </li><li> Not suitable for consumption without extensive treatment. </li><li> High health risks for all individuals; avoid direct contact with water. </li><li> Immediate action required to improve water treatment processes. </li><li> Restrict all recreational activities in water sources falling in this range.</li> ');
            } else {
                bg='maroon';
                wqiImageSrc = '5.png';
                message = "Hazaedous";
            document.getElementById("wqi").style.color = '#fff';

                // Show health advice for WQI range 300+
                displayHealthAdvice(' <li>Very poor water quality. </li><li> Extremely hazardous for human use. </li><li> Strictly prohibit any contact with water. </li><li> Emergency measures required to address pollution sources. </li><li> Evacuate affected areas and implement comprehensive water treatment strategies.</li> ');
            }
            document.getElementById("messw").textContent = message; 
            document.getElementById("wqi").style.backgroundColor = bg;
            updateChart(selectedEntry);



            wqiImageElement.src = wqiImageSrc;

            cityDetailsContainer.style.display = 'flex';
            document.getElementById('wqiFull').textContent = `WQI: ${selectedEntry.WQI}`;
            document.getElementById('temperatureFull').textContent = `Temperature: ${selectedEntry.Temperature}°C`;
            document.getElementById('pHFull').textContent = `pH: ${selectedEntry.pH}`;
            document.getElementById('conductivityFull').textContent = `Conductivity: ${selectedEntry.Conductivity}`;
            document.getElementById('bodFull').textContent = `BOD: ${selectedEntry.BOD}`;
            document.getElementById('nitrateFull').textContent = `Nitrate: ${selectedEntry.Nitrate}`;
            document.getElementById('fecalColiformFull').textContent = `Fecal Coliform: ${selectedEntry["Fecal Coliform"]}`;
            document.getElementById('coliformFull').textContent = `Coliform: ${selectedEntry.Coliform}`;
            document.getElementById('totalDissolvedSolidFull').textContent = `Total Dissolved Solid: ${selectedEntry["Total Dissolved Solid"]}`;
            document.getElementById('fluorideFull').textContent = `Fluoride: ${selectedEntry.Fluoride}`;
            document.getElementById('arsenicFull').textContent = `Arsenic: ${selectedEntry.Arsenic}`;

            // Show the new container
            document.getElementById('cityDetailsFullContainer').style.display = 'flex';

        }

        function displayHealthAdvice(advice) {
            // Display health advice in the health advice container
            healthAdviceElement.innerHTML = `<strong>Health Adviser</strong></li><li>${advice}`;
            healthAdviceContainer.style.display = 'flex';
        }
        fetch('your_json_file.json')
            .then(response => response.json())
            .then(data => {
                jsonData = data;

                // Populate the array with all WQI values and city details
                allCitiesWqiData = jsonData.map(entry => ({
                    wqi: entry.WQI,
                    city: entry.City
                }));

                // Sort the array by WQI values
                allCitiesWqiData.sort((a, b) => b.wqi - a.wqi);
                displayTopWqiStations(allCitiesWqiData);

                // Display the top and bottom 20 cities
            })
            .catch(handleFetchError);
            function displayTopWqiStations(data) {
                const highestWqiContainer = document.getElementById('highestWqiContainer');
                const lowestWqiContainer = document.getElementById('lowestWqiContainer');
        
                // Display top 10 highest WQI stations
                const topHighest = data.slice(0, 10);
                highestWqiContainer.innerHTML = "<h3>Top 10 Highest WQI Stations:</h3>";
                topHighest.forEach(entry => {
                    const p = document.createElement('p');
                    p.textContent = `${entry.city}: ${entry.wqi}`;
                    highestWqiContainer.appendChild(p);
                });
        
                // Display top 10 lowest WQI stations
                const topLowest = data.slice(-10).reverse(); // Reverse to get lowest
                lowestWqiContainer.innerHTML = "<h3>Top 10 Lowest WQI Stations:</h3>";
                topLowest.forEach(entry => {
                    const p = document.createElement('p');
                    p.textContent = `${entry.city}: ${entry.wqi}`;
                    lowestWqiContainer.appendChild(p);
                });
            }
        

        function updateChart(selectedEntry) {
            const ctx = document.getElementById('myChart').getContext('2d');
            const labels = ["pH", "BOD", "Coliform", "Total Dissolved Solid"];
            const data = [
                selectedEntry.pH,
                selectedEntry.BOD,
                selectedEntry.Coliform,
                selectedEntry["Total Dissolved Solid"]/100
            ];
        
            const myChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Values',
                        data: data,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
        