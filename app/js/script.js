const API_BASE = '/odata/v4/repair';

// Fetch Helper
async function getData(entity) {
    try {
        const response = await fetch(`${API_BASE}/${entity}`);
        const data = await response.json();
        return data.value;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

// Post Helper
async function postData(entity, payload) {
    try {
        const response = await fetch(`${API_BASE}/${entity}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error('Error posting data:', error);
        alert('Operation failed. Please try again.');
        return null;
    }
}

// Patch Helper (for updates)
async function patchData(entity, id, payload) {
    try {
        const response = await fetch(`${API_BASE}/${entity}(${id})`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error('Update failed');
        return true;
    } catch (error) {
        console.error('Error updating data:', error);
        alert('Update failed.');
        return false;
    }
}

// Render Status Badge
function getStatusBadge(status) {
    // Basic mapping for classes
    let cls = 'status-Pending';
    if (status === 'Available' || status === 'Fixed') cls = 'status-Fixed';
    if (status === 'Under Repair' || status === 'In Progress') cls = 'status-Progress';
    if (status === 'Unrepairable' || status === 'Disposed') cls = 'status-Unrepairable';
    
    return `<span class="status-badge ${cls}">${status}</span>`;
}

// Render Date
function formatDate(dateStr) {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString();
}
