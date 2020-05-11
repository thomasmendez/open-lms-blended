import chai from "chai";
import React from "react";
import { configure, shallow } from "enzyme";
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });

import { 
    validateUsername,
    validateEmail,
    validatePassword,
    validateConfirmedPassword,
    validateFirstName,
    validateLastName,
    validateSemester,
    validateYear
 } from '../../../src/components/general/validator'

let expect = chai.expect;

describe("Testing Validator - Username", () => {

    it("Username is valid", function(done) {

        let username = "Smith1"

        let result = validateUsername(username)

        if (result.isValid) {
            done()
        } else {
            throw new Error("username should be valid");
        }

    })

    it("Username should not start with letter or digit", function(done) {

        let username = "smi"

        let result = validateUsername(username)

        if (!result.isValid) {
            done()
        } else {
            throw new Error("username should be 4 characters or longer");
        }

    })

    it("Username should be 4 characters or longer", function(done) {

        let username = "smi"

        let result = validateUsername(username)

        if (!result.isValid) {
            done()
        } else {
            throw new Error("username should not be under 4");
        }

    })
    
})

describe("Testing Validator - Email", () => {

    it("Email is valid", function(done) {

        let email = "sample@email.com"

        let result = validateEmail(email)

        if (result.isValid) {
            done()
        } else {
            throw new Error("Email should be valid");
        }

    })

    it("Email is invalid - missing @", function(done) {

        let email = "sampleemail.com"

        let result = validateEmail(email)

        if (!result.isValid) {
            done()
        } else {
            throw new Error("Email should be invalid");
        }

    })

    it("Email is invalid - missing .", function(done) {

        let email = "sample@email"

        let result = validateEmail(email)

        if (!result.isValid) {
            done()
        } else {
            throw new Error("Email should be invalid");
        }

    })
})

describe("Testing Validator - Password", () => {
    
    it("Password is valid", function(done) {

        let password = "#Smith1"

        let result = validatePassword(password)

        if (result.isValid) {
            done()
        } else {
            throw new Error("Password invalid. Must contain 1 lower, 1 upper, 1 digit, 1 special character and must be at least 6 characters long");
        }

    })

    it("Password is invalid - missing 1 lower", function(done) {

        let password = "#SMITH1"

        let result = validatePassword(password)

        if (!result.isValid) {
            done()
        } else {
            throw new Error("Password invalid. Must contain 1 lower, 1 upper, 1 digit, 1 special character and must be at least 6 characters long");
        }

    })

    it("Password is invalid - missing 1 upper", function(done) {

        let password = "#smith1"

        let result = validatePassword(password)

        if (!result.isValid) {
            done()
        } else {
            throw new Error("Password invalid. Must contain 1 lower, 1 upper, 1 digit, 1 special character and must be at least 6 characters long");
        }

    })

    it("Password is invalid - missing 1 digit", function(done) {

        let password = "#smith1"

        let result = validatePassword(password)

        if (!result.isValid) {
            done()
        } else {
            throw new Error("Password invalid. Must contain 1 lower, 1 upper, 1 digit, 1 special character and must be at least 6 characters long");
        }

    })

    it("Password is invalid - missing 1 special", function(done) {

        let password = "Smith1"

        let result = validatePassword(password)

        if (!result.isValid) {
            done()
        } else {
            throw new Error("Password invalid. Must contain 1 lower, 1 upper, 1 digit, 1 special character and must be at least 6 characters long");
        }

    })

    it("Password is not the same as confirmed password", function(done) {

        let password = "#Smith1"
        let confirmedPassword = "Smith1"

        let result = validateConfirmedPassword(password, confirmedPassword)

        if (!result.isValid) {
            done()
        } else {
            throw new Error("Password and confirmed password should not match");
        }
    })

    it("Password and confirmed password matches", function(done) {

        let password = "#Smith1"
        let confirmedPassword = "#Smith1"

        let result = validateConfirmedPassword(password, confirmedPassword)

        if (result.isValid) {
            done()
        } else {
            throw new Error("Password and confirmed password should match");
        }
    })

})

describe("Testing Validator - First Name", () => {
    
    it("First name is valid", function(done) {

        let firstName = "Smith"

        let result = validateFirstName(firstName)

        if (result.isValid) {
            done()
        } else {
            throw new Error("First name should be valid");
        }

    })

    it("First name is invalid - uses something other than letters or dashes", function(done) {

        let firstName = "Smith%@!"

        let result = validateFirstName(firstName)

        if (!result.isValid) {
            done()
        } else {
            throw new Error("First name should not be valid");
        }

    })
})

describe("Testing Validator - Last Name", () => {
    
    it("Last name is valid", function(done) {

        let lastName = "Jones"

        let result = validateLastName(lastName)

        if (result.isValid) {
            done()
        } else {
            throw new Error("Last name should be valid");
        }

    })

    it("Last name is invalid - uses something other than letters or dashes", function(done) {

        let firstName = "Jones%@!"

        let result = validateLastName(firstName)

        if (!result.isValid) {
            done()
        } else {
            throw new Error("Last name should not be valid");
        }

    })

})

describe("Testing Validator - Semester", () => {

    it("'Fall' is valid", function(done) {

        let semester = "Fall"

        let result = validateSemester(semester)

        if (result.isValid) {
            done()
        } else {
            throw new Error("Semester name should be valid");
        }

    })
    
    it("'Spring' is valid", function(done) {

        let semester = "Spring"

        let result = validateSemester(semester)

        if (result.isValid) {
            done()
        } else {
            throw new Error("Semester name should be valid");
        }

    })

    it("'Summer' is valid", function(done) {

        let semester = "Summer"

        let result = validateSemester(semester)

        if (result.isValid) {
            done()
        } else {
            throw new Error("Semester name should be valid");
        }

    })

    it("'Full-Year' is valid", function(done) {

        let semester = "Full-Year"

        let result = validateSemester(semester)

        if (result.isValid) {
            done()
        } else {
            throw new Error("Semester name should be valid");
        }

    })

    it("'Other' is invalid", function(done) {

        let semester = "Other"

        let result = validateSemester(semester)

        if (!result.isValid) {
            done()
        } else {
            throw new Error("Semester name should be invalid");
        }

    })

})

describe("Testing Validator - Year", () => {
    
    it("Current year is valid", function(done) {

        let year = new Date().getFullYear();

        let result = validateYear(year)

        if (result.isValid) {
            done()
        } else {
            throw new Error("Year should be valid");
        }

    })

    it("Next year is valid", function(done) {

        let year = new Date().getFullYear() + 1;

        let result = validateYear(year)

        if (result.isValid) {
            done()
        } else {
            throw new Error("Year should be valid");
        }

    })

    it("2 yrs or more is invalid", function(done) {

        let year = new Date().getFullYear() + 2;

        let result = validateYear(year)

        if (!result.isValid) {
            done()
        } else {
            throw new Error("Year should not be valid ");
        }

    })

    it("Previous year is invalid", function(done) {

        let year = new Date().getFullYear() - 1;

        let result = validateLastName(year)

        if (!result.isValid) {
            done()
        } else {
            throw new Error("Year not should be valid");
        }

    })

})