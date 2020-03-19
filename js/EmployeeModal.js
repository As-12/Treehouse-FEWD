class EmployeeModal {
  onClick(event) {
    if (
      event.target === this.modelHandler ||
      event.target === this.modalHandler.querySelector('.close')
    ) {
      this.modalHandler.style.display = 'none';
    }
  }

  constructor(emp, modalId) {
    this.modalHandler = document.getElementById(modalId);
    this.employee = emp;

    this.modalHandler.addEventListener('click', this.onClick);
  }

  set employee(emp) {
    this.employee = emp;
  }
}

export { EmployeeModal as default };
