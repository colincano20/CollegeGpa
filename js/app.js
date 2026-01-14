let semesters = [];
let activeSemesterIndex = null;
const gradePoints = {
    "A+": 4.33,
    "A": 4.0,
    "A-": 3.67,
    "B+": 3.33,
    "B": 3.0,
    "B-": 2.67,
    "C+": 2.33,
    "C": 2.0,
    "C-": 1.67,
    "D+": 1.33,
    "D": 1.0,
    "D-": 0.67,
    "F": 0.0
};


// Load saved data on startup
function loadData() {
    const saved = localStorage.getItem("semesters");
    if (saved) {
        semesters = JSON.parse(saved);
    }
}

function saveData() {
    localStorage.setItem("semesters", JSON.stringify(semesters));
}
function renderSemesters() {
    const container = document.getElementById("semesters-container");
    container.innerHTML = "";

    semesters.forEach((semester, index) => {
        const div = document.createElement("div");
        div.classList.add("semester-box");

        div.innerHTML = `<h3>${semester.name}</h3>`;

        // 👇 THIS IS NEW
        div.addEventListener("click", function () {
            openSemester(index);
        });

        container.appendChild(div);
    });
    document.getElementById("overall-gpa").textContent = calculateOverallGPA();
}
function openSemester(index) {
    activeSemesterIndex = index;

    document.getElementById("home-screen").style.display = "none";
    document.getElementById("semester-screen").style.display = "block";

    document.getElementById("semester-title").textContent =
        semesters[index].name;

    renderClasses(); // 👈 NEW
}

function renderClasses() {
    const classList = document.getElementById("class-list");
    classList.innerHTML = "";

    const classes = semesters[activeSemesterIndex].classes;

    if (classes.length === 0) {
        classList.innerHTML = "<p>No classes yet.</p>";
        return;
    }

    classes.forEach((cls, index) => {
        const row = document.createElement("div");
        row.classList.add("class-row"); 

        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = "Class name";
        input.value = cls.name;
        
        input.addEventListener("input", function () {
            cls.name = input.value;
            
            saveData();
        });
        const creditsInput = document.createElement("input");
        creditsInput.type = "number";
        creditsInput.min = "0";
        creditsInput.placeholder = "Credits";
        creditsInput.value = cls.credits;

        creditsInput.addEventListener("input", function () {
            cls.credits = Number(creditsInput.value);
            saveData();
        });
        const gradeSelect = document.createElement("select");

        const grades = [
            "A+", "A", "A-",
            "B+", "B", "B-",
            "C+", "C", "C-",
            "D+", "D", "D-",
            "F"
        ];

        grades.forEach(grade => {
            const option = document.createElement("option");
            option.value = grade;
            option.textContent = grade;
            gradeSelect.appendChild(option);
        });

        gradeSelect.value = cls.grade;

        gradeSelect.addEventListener("change", function () {
            cls.grade = gradeSelect.value;
            document.getElementById("term-gpa").textContent = calculateTermGPA();
            document.getElementById("overall-gpa").textContent = calculateOverallGPA();
            saveData();
        });



        row.appendChild(input);
        row.appendChild(creditsInput);
        row.appendChild(gradeSelect);   
        classList.appendChild(row);
    });
    document.getElementById("term-gpa").textContent = calculateTermGPA();
    document.getElementById("overall-gpa").textContent = calculateOverallGPA();
}



loadData();
console.log("Loaded Semesters:", semesters);

// Button
const addSemesterBtn = document.querySelector("#add-semester");

addSemesterBtn.addEventListener("click", function () {
    console.log("Add Semester button clicked!");

    semesters.push({
        name: "Semester " + (semesters.length + 1),
        classes: []
    });

    console.log(semesters);

    // SAVE IT
    saveData();
    renderSemesters();
});
const deleteSemesterBtn = document.querySelector("#delete-semester");
deleteSemesterBtn.addEventListener("click", function () {
    if (semesters.length > 0) {
        semesters.pop();
        saveData();
        renderSemesters();
    } else {
        alert("No semesters to delete.");
    }
});
const backBtn = document.getElementById("back-btn");

backBtn.addEventListener("click", function () {
    activeSemesterIndex = null;

    document.getElementById("semester-screen").style.display = "none";
    document.getElementById("home-screen").style.display = "block";
});

const addClassBtn = document.getElementById("add-class");

addClassBtn.addEventListener("click", function () {
    if (activeSemesterIndex === null) return;

    semesters[activeSemesterIndex].classes.push({
        name: "New Class",
        credits: 0,
        grade: ""
    });

    saveData();
    renderClasses();
});
deleteClassBtn = document.getElementById("delete-class");
deleteClassBtn.addEventListener("click", function () {
    if (activeSemesterIndex === null) return;

    const classes = semesters[activeSemesterIndex].classes;
    if (classes.length > 0) {
        classes.pop();
        saveData();
        renderClasses();
    }
    else {
        alert("No classes to delete.");
    }
});

function calculateTermGPA() {
    const classes = semesters[activeSemesterIndex].classes;

    let totalPoints = 0;
    let totalCredits = 0;

    classes.forEach(cls => {
        if (!cls.grade || cls.credits <= 0) return;

        const points = gradePoints[cls.grade];
        totalPoints += points * cls.credits;
        totalCredits += cls.credits;
    });

    if (totalCredits === 0) return "0.00";
    
    return (totalPoints / totalCredits).toFixed(2);
    
}
function calculateOverallGPA() {
    let totalPoints = 0;
    let totalCredits = 0;

    semesters.forEach(semester => {
        semester.classes.forEach(cls => {
            if (!cls.grade || cls.credits <= 0) return;

            const points = gradePoints[cls.grade];
            totalPoints += points * cls.credits;
            totalCredits += cls.credits;
        });
    });

    if (totalCredits === 0) return "0.00";  
    return (totalPoints / totalCredits).toFixed(2);
}




// Render semesters on page load
renderSemesters();
