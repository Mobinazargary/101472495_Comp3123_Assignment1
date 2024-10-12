const express = require("express");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const Employee = require("../models/Employee");

// Get All Employees
router.get("/employees", async (req, res) => {
    const employees = await Employee.find();
    res.status(200).json(employees);
});

// Create New Employee
router.post(
    "/employees",
    [
        check("first_name").not().isEmpty().withMessage("First name is required"),
        check("last_name").not().isEmpty().withMessage("Last name is required"),
        check("email").isEmail().withMessage("Valid email is required"),
        check("position").not().isEmpty().withMessage("Position is required"),
        check("salary").isNumeric().withMessage("Salary must be a number"),
        check("date_of_joining")
            .isDate()
            .withMessage("Date of joining must be a valid date"),
        check("department").not().isEmpty().withMessage("Department is required"),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            first_name,
            last_name,
            email,
            position,
            salary,
            date_of_joining,
            department,
        } = req.body;
        const employee = new Employee({
            first_name,
            last_name,
            email,
            position,
            salary,
            date_of_joining,
            department,
        });
        await employee.save();
        res.status(201).json({
            message: "Employee created successfully.",
            employee_id: employee._id,
        });
    }
);

// Get Employee by ID
router.get("/employees/:eid", async (req, res) => {
    const employee = await Employee.findById(req.params.eid);
    if (!employee) {
        return res.status(404).json({ message: "Employee not found." });
    }
    res.status(200).json(employee);
});

// Update Employee by ID
router.put(
    "/employees/:eid",
    [
        check("email").optional().isEmail().withMessage("Valid email is required"),
        check("salary").optional().isNumeric().withMessage("Salary must be a number"),
        check("date_of_joining")
            .optional()
            .isDate()
            .withMessage("Date of joining must be a valid date"),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const updatedEmployee = await Employee.findByIdAndUpdate(
            req.params.eid,
            req.body,
            { new: true }
        );

        if (!updatedEmployee) {
            return res.status(404).json({ message: "Employee not found." });
        }
        res.status(200).json({ message: "Employee details updated successfully." });
    }
);
// Delete Employee by ID
router.delete("/employees", async (req, res) => {
    try {
        const employee = await Employee.findByIdAndDelete(req.query.eid);
        if (!employee) {
            return res.status(404).json({ message: "Employee not found." });
        }
        res.status(200).json({ message: "Employee deleted successfully." });
    } catch (error) {
        console.error("Error deleting employee:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;

