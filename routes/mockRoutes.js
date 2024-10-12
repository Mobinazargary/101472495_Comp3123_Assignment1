const express = require("express");
const router = express.Router();

// Mock Data
let employees = [
    { id: "1", first_name: "Alice", last_name: "Johnson", position: "Developer", salary: 80000 },
    { id: "2", first_name: "Bob", last_name: "Smith", position: "Designer", salary: 75000 },
];

// Mock User Signup
router.post("/user/signup", (req, res) => {
    res.status(201).json({ message: "User created successfully (mock response)." });
});

// Mock User Login
router.post("/user/login", (req, res) => {
    res.status(200).json({ message: "Login successful (mock response)." });
});

// Mock Get All Employees
router.get("/emp/employees", (req, res) => {
    res.status(200).json(employees);
});

// Mock Add New Employee
router.post("/emp/employees", (req, res) => {
    const newEmployee = { id: (employees.length + 1).toString(), ...req.body };
    employees.push(newEmployee);
    res.status(201).json({ message: "Employee added (mock response).", employee: newEmployee });
});

// Mock Get Employee by ID
router.get("/emp/employees/:eid", (req, res) => {
    const employee = employees.find(emp => emp.id === req.params.eid);
    if (!employee) {
        return res.status(404).json({ message: "Employee not found." });
    }
    res.status(200).json(employee);
});

// Mock Update Employee by ID
router.put("/emp/employees/:eid", (req, res) => {
    const employee = employees.find(emp => emp.id === req.params.eid);
    if (!employee) {
        return res.status(404).json({ message: "Employee not found." });
    }
    Object.assign(employee, req.body);
    res.status(200).json({ message: "Employee updated (mock response).", employee });
});

// Mock Delete Employee by ID
router.delete("/emp/employees", (req, res) => {
    const { eid } = req.query;
    employees = employees.filter(emp => emp.id !== eid);
    res.status(200).json({ message: "Employee deleted (mock response)." });
});

module.exports = router;
