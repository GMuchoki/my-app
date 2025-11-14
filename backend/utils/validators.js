export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#?!@$%^&*.\-_]).{8,}$/;

export const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;

export const nameRegex = /^[A-Za-z\s-]{2,50}$/;

export const emailRegex = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,10}$/;

export const isValidPassword = (password) => passwordRegex.test(password);

export const isValidUsername = (username) => usernameRegex.test(username);

export const isValidName = (name) => nameRegex.test(name);

export const isValidEmail = (email) => emailRegex.test(email);