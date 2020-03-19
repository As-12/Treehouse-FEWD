/* eslint-disable */

/* ----- Classs Definitions ------ */

class EmployeeModel {
  constructor(id, name, city, address, email, dob, tel, imageUrl) {
    this.id = id;
    this.name = name;
    this.address = address;
    this.tel = tel;
    this.email = email;
    this.dob = dob;
    this.city = city;
    this.imageUrl = imageUrl;
    this.searchString = id + name + address + tel + email + dob + city;
  }
}

class EmployeeDirectoryWidget {
  constructor(widgetId) {
    this.size = 0;
    this.employeeMap = {}; // Map of employee objects displayed on the widget
    this.employeeHandleMap = {}; // Map of handles for fast lookup for style changes
    this.widgetHandle = document.getElementById(widgetId);
  }
  filterEmployee(searchString) {
    for (let key in this.employeeMap) {
      if (
        this.employeeMap[key].searchString.toLowerCase().indexOf(searchString.toLowerCase()) >= 0
      ) {
        this.employeeHandleMap[key].classList.remove('hide');
      } else {
        this.employeeHandleMap[key].classList.add('hide');
      }
    }
  }

  addEmployeeToWidget(employee) {
    this.employeeMap[employee.id] = employee;
    const element = document.createElement('div');
    element.classList.add('employee-container');
    element.id = employee.id;
    element.innerHTML = `   
    <img src="${employee.imageUrl}" alt="picture of an employee" />
    <div>
      <h4>${employee.name}</h4>
      <a href="mailto:${employee.email}">${employee.email}</a>
      <p>${employee.city}</p>
    </div>`;

    this.employeeHandleMap[employee.id] = element;
    this.widgetHandle.appendChild(element);
    this.size += 1;
  }

  getNextEmployee(employee) {
    let employeeArray = [];
    let i = 0;
    let index = 0;
    for (let key in this.employeeMap) {
      if (!this.employeeHandleMap[key].classList.contains('hide')) {
        employeeArray.push(this.employeeMap[key]);
        if (employee.id === key) {
          index = i;
        }
        i += 1;
      }
    }
    //Getting next element
    index += 1;
    index %= employeeArray.length; // rotates around if exceed boundary
    return employeeArray[index];
  }
  getPrevEmployee(employee) {
    let employeeArray = [];
    let i = 0;
    let index = 0;
    for (let key in this.employeeMap) {
      if (!this.employeeHandleMap[key].classList.contains('hide')) {
        employeeArray.push(this.employeeMap[key]);
        if (employee.id === key) {
          index = i;
        }
        i += 1;
      }
    }
    // Getting previous element
    if (index === 0) {
      index = employeeArray.length; //Rotate around if exceed boundary
    }
    index -= 1;
    return employeeArray[index];
  }
}

class RandomUserApiEmployeeFactory {
  constructor() {
    this.count = 0;
    this.prefix = 'employee-';
  }
  createEmployee(randomUserApiObj) {
    const name = `${randomUserApiObj.name.first} ${randomUserApiObj.name.last}`;
    const city = randomUserApiObj.location.city;
    const address = `${randomUserApiObj.location.street.number} ${randomUserApiObj.location.street.name} ${randomUserApiObj.location.city}, ${randomUserApiObj.location.state} ${randomUserApiObj.location.postcode}, ${randomUserApiObj.location.country}`;
    const email = randomUserApiObj.email;
    const date = new Date(randomUserApiObj.dob.date);
    const dob = `${date.getMonth()}/${date.getDay()}/${date.getFullYear()}`;
    const tel = randomUserApiObj.cell;
    const url = randomUserApiObj.picture.large;
    this.count += 1;
    const id = `${this.prefix}${this.count}`;
    let myObj = new EmployeeModel(id, name, city, address, email, dob, tel, url);
    return myObj;
  }
}

class EmployeeModal {
  constructor(modalId) {
    this.id = modalId;
    this.selectedEmployee = '';
    this.modalHandler = document.querySelector(`#${modalId}`);
  }
  remove() {
    if (
      event.target === this.modalHandler ||
      event.target === this.modalHandler.querySelector('.close')
    ) {
      this.modalHandler.style.visibility = 'hidden';
      this.modalHandler.style.opacity = '0';
    }
  }
  create(employee) {
    this.selectedEmployee = employee;
    this.modalHandler.innerHTML = `
    <div class="modal-window">
      <span class="close">&times;</span>
      <div class="modal-content">
        <img src="${employee.imageUrl}" alt="picture of an employee" />
        <h4>${employee.name}</h4>
        <a href="mailto:${employee.email}"> ${employee.email}</a>
        <p>${employee.city}</p>
        <hr />
        <p>${employee.tel}</p>
        <p>${employee.address}</p>
        <p>Birthday: ${employee.dob}</p>
      </div>
    </div>
    <div class="scrollers">
          <span id="${this.id}-back" class="back fa fa-angle-left" ></span>
          <span id="${this.id}-next" class="next fa fa-angle-right"></span>
    </div> 
  </div>
  `;
    this.modalHandler.style.visibility = 'visible';
    this.modalHandler.style.opacity = '1';
  }
}

/* A Stub Employee Repository that get its data from random user API website */
class StubEmployeeRepository {
  constructor(numberOfEmployees) {
    this.employees = [];
    this.numEmployee = numberOfEmployees;
    this.fetchApi = 'https://randomuser.me/api/?nat=us,gb';
    this.onReadyCallback = () => {};

    if (!Number.isInteger(numberOfEmployees) || numberOfEmployees <= 0) {
      throw 'Number of Employees must be valid Integer and greater than 0';
    }
  }

  /*
  Async function that fetch data and assign them into repo
  Call back once it completes can be assigned to onReady
  */
  init() {
    let promises = [];
    for (let i = 0; i != this.numEmployee; i += 1) {
      promises.push(fetch(this.fetchApi));
    }
    // Resolve all promises,
    // then deserialize them into data JSON,
    // then convert them into this.employees,
    // then call OnReadyCallback passing caller object as context
    Promise.all(promises)
      .then(async resp => {
        for (let j = 0; j != resp.length; j += 1) {
          let obj = await resp[j].json();
          resp[j] = obj.results[0];
        }
        return resp;
      })
      .then(resp => {
        this.employees = resp;
        this.onReadyCallback(this);
      })
      .catch(err => {
        alert(`Error Loading Information ${err}`);
        throw `Error fetching ${err}`;
      });
  }

  // Assign the function to callback once the repo initialization is completed.
  onReady(callback) {
    this.onReadyCallback = callback;
  }

  // Get the list of employee
  get ListOfEmployees() {
    return this.employees;
  }
}

/* ----- Object Instantiations  ------ */

const modal = new EmployeeModal('myModal');
const repo = new StubEmployeeRepository(12); // get 12 employees
const factory = new RandomUserApiEmployeeFactory();
const widget = new EmployeeDirectoryWidget('employee-widget');
repo.onReady(e => {
  document.querySelector('#loader').style.display = 'none';
  e.employees.forEach(emp => {
    widget.addEmployeeToWidget(factory.createEmployee(emp));
  });
});
repo.init();

/* ---- Controller / Event Handlings -----*/

modal.modalHandler.addEventListener('click', () => {
  modal.remove();
});

document.querySelector('#employee-widget').addEventListener('click', () => {
  let node = event.target;
  /* Propagate up the DOM tree until one of the node id matches one in the widget */
  if (event.target.tagName !== 'A') {
    while (node) {
      if (widget.employeeMap[node.id] !== undefined) {
        modal.create(widget.employeeMap[node.id]);
        break;
      }
      node = node.parentNode;
    }
  }
});

document.querySelector('#search').addEventListener('keyup', event => {
  if (event.isComposing || event.keyCode === 229) {
    return;
  }
  widget.filterEmployee(event.target.value);
});

document.querySelector('#myModal').addEventListener('click', event => {
  if (event.target.id == 'myModal-next') {
    let emp = modal.selectedEmployee;
    emp = widget.getNextEmployee(emp);
    modal.create(emp);
  }
  if (event.target.id == 'myModal-back') {
    let emp = modal.selectedEmployee;
    emp = widget.getPrevEmployee(emp);
    modal.create(emp);
  }
});
