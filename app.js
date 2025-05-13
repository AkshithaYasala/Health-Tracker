// Show Home Page
function showHome() {
    document.getElementById("home-container").style.display = "block";
    document.getElementById("register-container").style.display = "none";
    document.getElementById("login-container").style.display = "none";
    document.getElementById("dashboard-container").style.display = "none";
    document.getElementById("dashboard-link").style.display = "none";
}

// Show Register Form
function showRegister() {
    document.getElementById("home-container").style.display = "none";
    document.getElementById("register-container").style.display = "flex";
    document.getElementById("login-container").style.display = "none";
    document.getElementById("dashboard-container").style.display = "none";
    document.getElementById("dashboard-link").style.display = "none";
}

// Show Login Form
function showLogin() {
    document.getElementById("home-container").style.display = "none";
    document.getElementById("register-container").style.display = "none";
    document.getElementById("login-container").style.display = "flex";
    document.getElementById("dashboard-container").style.display = "none";
    document.getElementById("dashboard-link").style.display = "none";
}

// Show Dashboard
function showDashboard(user) {
    document.getElementById("home-container").style.display = "none";
    document.getElementById("register-container").style.display = "none";
    document.getElementById("login-container").style.display = "none";
    document.getElementById("dashboard-container").style.display = "block";
    document.getElementById("dashboard-link").style.display = "inline-flex";
    
    if (user) {
        document.getElementById("logged-in-user").textContent = user.email;
    } else {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (currentUser) {
            document.getElementById("logged-in-user").textContent = currentUser.email;
        }
    }
    
    updateHealthDataList();
    renderHealthChart();
}

// Handle User Registration
function registerUser() {
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;
    const confirmPassword = document.getElementById("register-confirm-password").value;

    // Validate Inputs
    if (!email || !password || !confirmPassword) {
        displayError("Please fill all fields.");
        return;
    }

    if (password !== confirmPassword) {
        displayError("Passwords do not match.");
        return;
    }

    // Check for a valid email format
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(email)) {
        displayError("Please enter a valid email.");
        return;
    }

    // Retrieve stored users from localStorage
    let users = JSON.parse(localStorage.getItem("users")) || [];

    // Check if the email already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        displayError("This email is already registered. Please log in.");
        return;
    }

    // Store new user data
    const user = { email, password };
    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));

    // Show Login Page After Registration
    showLogin();
}

// Handle User Login
function loginUser() {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    // Validate Inputs
    if (!email || !password) {
        displayError("Please fill all fields.");
        return;
    }

    // Retrieve stored users from localStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Find the user by email
    const storedUser = users.find(user => user.email === email);

    // Check if the user exists and the password matches
    if (storedUser && storedUser.password === password) {
        // Store the currently logged-in user in localStorage
        localStorage.setItem("currentUser", JSON.stringify(storedUser));

        showDashboard(storedUser);
    } else {
        displayError("Invalid credentials.");
    }
}

// Logout User
function logoutUser() {
    localStorage.removeItem("currentUser");
    showHome();
}

// Display error messages on the UI
function displayError(message) {
    alert(message); // Simple alert for now, can be replaced with a more elegant solution
}

// Save Health Data
function saveHealthData() {
    // Get input values
    const height = document.getElementById("height").value;
    const bp = document.getElementById("bp").value;
    const sugar = document.getElementById("sugar").value;
    const weight = document.getElementById("weight").value;

    // Validate inputs
    if (!height || !bp || !sugar || !weight) {
        displayError("Please fill in all the fields.");
        return;
    }

    // Create an object with the health data
    const healthData = {
        height: height,
        bloodPressure: bp,
        sugarLevel: sugar,
        weight: weight,
        date: new Date().toLocaleDateString(),
        id: new Date().getTime()
    };

    // Store the data
    let healthRecords = JSON.parse(localStorage.getItem("healthRecords")) || [];
    healthRecords.push(healthData);
    localStorage.setItem("healthRecords", JSON.stringify(healthRecords));

    // Clear the input fields
    document.getElementById("height").value = "";
    document.getElementById("bp").value = "";
    document.getElementById("sugar").value = "";
    document.getElementById("weight").value = "";

    // Update the health data list and chart
    updateHealthDataList();
    renderHealthChart();
}

// Update Health Data List
function updateHealthDataList() {
    const healthRecords = JSON.parse(localStorage.getItem("healthRecords")) || [];
    const healthDataList = document.getElementById("health-data-list");
    healthDataList.innerHTML = "";

    healthRecords.forEach(record => {
        const listItem = document.createElement("li");
        
        const detailsDiv = document.createElement("div");
        detailsDiv.className = "record-details";
        detailsDiv.innerHTML = `
            <span><strong>Date:</strong> ${record.date}</span>
            <span><strong>Height:</strong> ${record.height} cm</span>
            <span><strong>Weight:</strong> ${record.weight} kg</span>
            <span><strong>BP:</strong> ${record.bloodPressure}</span>
            <span><strong>Sugar:</strong> ${record.sugarLevel} mg/dL</span>
        `;
        
        const actionsDiv = document.createElement("div");
        actionsDiv.className = "record-actions";
        actionsDiv.innerHTML = `
            <button class="btn-update" onclick="updateHealthData(${record.id})">
                <i class="fas fa-edit"></i> Edit
            </button>
            <button class="btn-delete" onclick="deleteHealthData(${record.id})">
                <i class="fas fa-trash"></i> Delete
            </button>
        `;
        
        listItem.appendChild(detailsDiv);
        listItem.appendChild(actionsDiv);
        healthDataList.appendChild(listItem);
    });
}

// Update Health Data
function updateHealthData(id) {
    const healthRecords = JSON.parse(localStorage.getItem("healthRecords")) || [];
    const recordToUpdate = healthRecords.find(record => record.id === id);

    // Pre-fill the fields with the existing data
    document.getElementById("height").value = recordToUpdate.height;
    document.getElementById("bp").value = recordToUpdate.bloodPressure;
    document.getElementById("sugar").value = recordToUpdate.sugarLevel;
    document.getElementById("weight").value = recordToUpdate.weight;

    // Delete the existing record
    const updatedRecords = healthRecords.filter(record => record.id !== id);
    localStorage.setItem("healthRecords", JSON.stringify(updatedRecords));
}

// Delete Health Data
function deleteHealthData(id) {
    const healthRecords = JSON.parse(localStorage.getItem("healthRecords")) || [];
    const updatedRecords = healthRecords.filter(record => record.id !== id);
    localStorage.setItem("healthRecords", JSON.stringify(updatedRecords));

    updateHealthDataList();
    renderHealthChart();
}

// Search Health Data
function searchHealthData() {
    const searchQuery = document.getElementById("search").value.toLowerCase();
    const healthRecords = JSON.parse(localStorage.getItem("healthRecords")) || [];
    const filteredRecords = healthRecords.filter(record => 
        record.date.toLowerCase().includes(searchQuery)
    );

    const healthDataList = document.getElementById("health-data-list");
    healthDataList.innerHTML = "";

    filteredRecords.forEach(record => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
            <div class="record-details">
                <span><strong>Date:</strong> ${record.date}</span>
                <span><strong>Height:</strong> ${record.height} cm</span>
                <span><strong>Weight:</strong> ${record.weight} kg</span>
                <span><strong>BP:</strong> ${record.bloodPressure}</span>
                <span><strong>Sugar:</strong> ${record.sugarLevel} mg/dL</span>
            </div>
            <div class="record-actions">
                <button class="btn-update" onclick="updateHealthData(${record.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn-delete" onclick="deleteHealthData(${record.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        `;
        healthDataList.appendChild(listItem);
    });
}

// Render Health Chart
function renderHealthChart() {
    const healthRecords = JSON.parse(localStorage.getItem("healthRecords")) || [];
    const ctx = document.getElementById('health-chart').getContext('2d');
    
    // Destroy previous chart if it exists
    if (window.healthChart) {
        window.healthChart.destroy();
    }
    
    // Prepare data for chart
    const dates = healthRecords.map(record => record.date);
    const weights = healthRecords.map(record => record.weight);
    const sugarLevels = healthRecords.map(record => record.sugarLevel);
    
    window.healthChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [
                {
                    label: 'Weight (kg)',
                    data: weights,
                    borderColor: '#4361ee',
                    backgroundColor: 'rgba(67, 97, 238, 0.1)',
                    tension: 0.3,
                    fill: true
                },
                {
                    label: 'Blood Sugar (mg/dL)',
                    data: sugarLevels,
                    borderColor: '#f72585',
                    backgroundColor: 'rgba(247, 37, 133, 0.1)',
                    tension: 0.3,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                }
            },
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}

// Check if the user is logged in on page load
window.onload = function() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser) {
        showDashboard(currentUser);
    } else {
        showHome();
    }
};