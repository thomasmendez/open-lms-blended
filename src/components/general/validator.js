export function validateUsername(username) {

    // must start with character a-Z or digit followed by a-Z or digit or undrscore 
    let startWith = /^[a-zA-Z0-9]/;
    // and ends with 3 or more 
    let user_regex = /^[a-zA-Z0-9][a-zA-Z0-9_]{3,15}$/;

    if (!(startWith.test(username))) {
        let infoText = "Username does not start with letter or digit";
        let result = {
            isValid: false,
            infoText: infoText
        }
        return result;

    } else if (!(user_regex.test(username))) {
        let infoText = "Username needs to be 4 characters or longer (max 15) and can only contain letters, digit, or underscore";
        let result = {
            isValid: false,
            infoText: infoText
        }
        return result;

    } else {
        let result = {
            isValid: true,
            infoText: ""
        }
        return result;

    }

}

export function validateEmail(email) {

    let email_regex = /[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/;

    if (!(email_regex.test(email))) {
        let infoText = "Email is invalid";
        let result = {
            isValid: false,
            infoText: infoText
        }
        return result;
    } else {
        let result = {
            isValid: true,
            infoText: ""
        }
        return result;
    }
}

export function validatePassword(password) {

    let pass_regex = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{6,50})/;

    if (!(pass_regex.test(password))) {
        let infoText = "Password invalid. Must contain 1 lower, 1 upper, 1 digit, 1 special character and must be at least 6 characters long";
        let result = {
            isValid: false,
            infoText: infoText
        }
        return result;

    } else {

        let result = {
            isValid: true,
            infoText: ""
        }
        return result;

    }
}

export function validateConfirmedPassword(password, confirmedPassword) {

    // check to see if the password is the same as the confirmed password 
    if (password !== confirmedPassword) {
        let infoText = "Password and confirmed password does not match";
        let result = {
            isValid: false,
            infoText: infoText
        }
        return result;
        
    } else {
        let result = {
            isValid: true,
            infoText: ""
        }
        return result;

    }

}

export function validateFirstName(firstName) {

    let first_regex = /^[a-z | A-Z | \. | -]+$/;

    if (!(first_regex.test(firstName))) {
        let infoText = "Please only use letters and dashes for first name"
        let result = {
            isValid: false,
            infoText: infoText
        }
        return result;

    } else {
        let result = {
            isValid: true,
            infoText: ""
        }
        return result;
    }

}

export function validateLastName(lastName) {

    let last_regex = /^[a-z | A-Z | \. | -]+$/;

    if (!(last_regex.test(lastName))) {
        let infoText = "Please only use letters and dashes for last name"
        let result = {
            isValid: false,
            infoText: infoText
        }
        return result;

    } else {
        let result = {
            isValid: true,
            infoText: ""
        }
        return result;

    }

}

export function validateSemester(semester) {

    if (semester === "Fall" || semester === "Spring" || semester === "Summer" || semester === "Full-Year") {
        let result = {
            isValid: true,
            infoText: ""
        }
        return result;

    } else {
        let result = {
            isValid: false,
            infoText: "Semester must be 'Fall', 'Spring', 'Summer', or 'Full-Year'"
        }
        return result;
    }
}

export function validateYear(year) {

    let currentYear = new Date().getFullYear();
    let nextYear = currentYear + 1;

    if (year == currentYear || year == nextYear) {
        let result = {
            isValid: true,
            infoText: ""
        }
        return result;
    } else {
        let result = {
            isValid: false,
            infoText: "Year must be " + currentYear + " or " + nextYear + "."
        }
        return result;
    }
}
