async function fetchData() {
    try {
        const response = await fetch("/latest");
        const data = await response.json();

        document.getElementById("temperature").innerText =
            data.temperature + " °C";

        document.getElementById("humidity").innerText =
            data.humidity + " %";

        document.getElementById("time").innerText =
            data.time;

    } catch (error) {
        console.log("Error fetching latest data");
    }
}

async function fetchHistory() {
    try {
        const response = await fetch("/history");
        const data = await response.json();

        const tableBody = document.querySelector("#historyTable tbody");
        tableBody.innerHTML = "";

        data.forEach(entry => {
            const row = `
                <tr>
                    <td>${new Date(entry.timestamp).toLocaleTimeString()}</td>
                    <td>${entry.temperature}</td>
                    <td>${entry.humidity}</td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });

    } catch (error) {
        console.log("Error fetching history");
    }
}

setInterval(() => {
    fetchData();
    fetchHistory();
}, 3000);

fetchData();
fetchHistory();