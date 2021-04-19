class Employee {
    constructor(name, cnic, email, shift) {
        this.name = name;
        this.cnic = cnic;
        this.email = email;
        this.shift = shift;
    }
}

class UI {
    static displayEmployees() {
        const employees = Store.getEmployees();

        employees.forEach((employee) => UI.addEmpolyeeToList(employee));
    }

    static addEmpolyeeToList(employee) {
        const list = document.querySelector("#employee-list");

        const row = document.createElement("tr");

        row.innerHTML = `
        <td>${employee.name}</td>
        <td>${employee.cnic}</td>
        <td>${employee.email}</td>
        <td>${employee.shift}<label class="switch"><input type="checkbox"><span class="slider round"></span></label>
        </td>
        <td><a href="#" class="btn btn-danger btn-sm delete">x</a></td>
        `;

        list.appendChild(row);
    }

    static deleteEmployee(el) {
        if (el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }

    // Showing alert function with bootstrap alert
    // 
    static showAlert(message, className){
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector(".container");
        const form = document.querySelector("#employee-form");
        container.insertBefore(div, form);
        // Fade out after 3 seconds with setTimeout
        setTimeout(() => document.querySelector(".alert").remove(),1500);
    }

    static clearFields() {
        document.querySelector('#name').value = "";
        document.querySelector('#cnic').value = "";
        document.querySelector('#email').value = "";
        document.querySelector('#shift').value = "";
    }
}

// Store Class => (handles storing data) With javascript localStorage
class Store{
    static getEmployees() {
        let employees;
        if(localStorage.getItem("employees") === null){
            employees =[];
        }
        else {
            employees = JSON.parse(localStorage.getItem("employees"));
        }
        return employees;
    }

    static addEmployees(employee) {
        const employees = Store.getEmployees();
        employees.push(employee);
        localStorage.setItem("employees", JSON.stringify(employees));
    }

    static removeEmployees(cnic) {
        const employees = Store.getEmployees();

        employees.forEach((employee, index) => {
            if(employee.cnic === cnic){
                employees.splice(index, 1);
            }
        });

        localStorage.setItem("employees", JSON.stringify(employees));
    }
}

// displaynig employees when DOMcontent fully loaded
document.addEventListener('DOMContentLoaded', UI.displayEmployees);


//add employee
document.querySelector("#employee-form").addEventListener('submit', (e) => {
    //prevent actual submit (fast flash output in console)
    e.preventDefault();

    //getting form values
    const name = document.querySelector('#name').value;
    const cnic = document.querySelector('#cnic').value;
    const email = document.querySelector('#email').value;
    const shift = document.querySelector('#shift').value;

    // Validate all feilds
    if (name === "" || cnic === "" || email === "" || shift === "") {
        UI.showAlert("Please fill in all the feilds", "danger");
    }
    else {
        //Instatiate employee (object)
        const employee = new Employee(name, cnic, email, shift);
        // console.log(employee);

        //adding employee to UI
        UI.addEmpolyeeToList(employee);

        // add employee to store
        Store.addEmployees(employee);

        // show success alerrt with green background on adding a book
        UI.showAlert("Employee Added", "success");

        //clear feilds as soon its added 
        UI.clearFields();
    }


});


// Event : remove an employee
document.querySelector("#employee-list").addEventListener("click", (e) => {
    
    // remove employee from UI
    UI.deleteEmployee(e.target);

    // remove employee from Store
    Store.removeEmployees(e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.textContent);

    // Show alert on removing a employee
    UI.showAlert("Employee Removed", "secondary");
});
