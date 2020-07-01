const isEmail = (email) => {
    const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(email.match(regEx)) return true;
    else return false;
}

const isEmpty = (string) => {
    if(string.trim() === '') return true;
    else return false;
}

exports.validateSignupData = (data) => {
    let errors = {};

    if(isEmpty(data.email)) {
        errors.email = 'Must not be empty'
    }
    else if(!isEmail(data.email)) {
        errors.email = 'Must be a valid email address'
    }

    if(isEmpty(data.password)) {
        errors.password = 'Must not be empty'
    }
    if(data.password !== data.confirmPassword) errors.confirmPassword = "Passwords do not match";
    if(isEmpty(data.handle)) {
        errors.handle = 'Must not be empty'
    }

    // Now have to check whether the errors Object is empty before we proceed.
        // if(Object.keys(errors).length > 0) return res.status(400).json(errors); 
    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    }
}

exports.validateLoginData = (data) => {
    let errors = {};

    if(isEmpty(data.email)) errors.email = 'Must not be empty';
    if(isEmpty(data.password)) errors.password = 'Must not be empty';

    // check if there are errors before proceeding.
    // if(Object.keys(errors).length > 0) return res.status(400).json(errors); 
    return {
        errors, 
        valid: Object.keys(errors).length === 0 ? true : false
    }
};

exports.reduceUserDetails = (data) => {
    let userDetails = {};

    // trim() - removes empty white space
    if(!isEmpty(data.bio.trim())) { 
        userDetails.bio = data.bio;
    }
    if(!isEmpty(data.website.trim())) {
        if(data.website.trim().substring(0,4) !== 'http') { // good convention for website,
            userDetails.website = `https://${data.website.trim()}`;
        } else {
            userDetails.website = data.website;
        }
    }
    if(!isEmpty(data.location.trim())) userDetails.location = data.location;

    return userDetails;
};