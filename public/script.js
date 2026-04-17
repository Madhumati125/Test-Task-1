let selectedZone = "";

// LOAD ZONES
async function loadZones() {
    let res = await fetch('/api/zones');
    let data = await res.json();

    let zoneDiv = document.getElementById('zones');
    let select = document.getElementById('zoneSelect');

    zoneDiv.innerHTML = "";
    select.innerHTML = "";

    data.forEach((z, index) => {

        if (!selectedZone && index === 0) {
            selectedZone = z.name;
        }

        zoneDiv.innerHTML += `
        <div class="${z.status} ${selectedZone === z.name ? 'selected' : ''}"
             onclick="selectZone('${z.name}')">
            <b>${z.name}</b><br>
            Status: ${z.status}<br>
            💧 ${z.water}%<br>
            🗑 ${z.waste}%
        </div>`;

        select.innerHTML += `<option ${selectedZone === z.name ? 'selected' : ''}>${z.name}</option>`;
    });
}

// SELECT ZONE
function selectZone(zone) {
    selectedZone = zone;
    document.getElementById('zoneSelect').value = zone;
    loadZones();
}

// ACTION FUNCTION (FIXED)
async function triggerAction(action) {
    let zone = document.getElementById('zoneSelect').value;

    let res = await fetch('/api/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ zone, action })
    });

    let data = await res.json();

    document.getElementById('output').innerHTML = `
        <b>Zone:</b> ${zone}<br>
        <b>Action:</b> ${action}<br>
        <b>Water:</b> ${data.before.water}% → ${data.after.water}%<br>
        <b>Waste:</b> ${data.before.waste}% → ${data.after.waste}%<br>
        <b>Status:</b> ${data.before.status} → ${data.after.status}
    `;

    loadZones();
    loadAlerts();
}

// LOAD ALERTS
async function loadAlerts() {
    let res = await fetch('/api/alerts');
    let data = await res.json();

    let alertDiv = document.getElementById('alerts');
    alertDiv.innerHTML = "";

    data.slice().reverse().forEach(a => {
        alertDiv.innerHTML += `
        <div>
            <b>${a.zone}</b> - ${a.message}<br>
            ${a.severity} | ${new Date(a.time).toLocaleTimeString()}
        </div>`;
    });
}

// INIT
loadZones();
loadAlerts();