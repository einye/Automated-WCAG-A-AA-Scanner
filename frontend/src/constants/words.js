// Base URL to Backend
const API_BASE_URL = 'http://localhost:3000';

export const API_ENDPOINTS = {
    SCAN_URL: `${API_BASE_URL}/api/scan-url`,
    SCAN_FILE: `${API_BASE_URL}/api/scan-html`,
    GET_REPORT: `${API_BASE_URL}/api/download-pdf`
}

// Navbar
export const navlist = [
    {name: 'Home', path: '/'}, 
    {name: 'Blog', path:'/blog'},
    {name: 'Contact Us', path: '/contact-us'}];

// TabsBar
export const tabslist = [
    {name: 'Score', pathAppendage: 'score'},
    {name: 'Analysis', pathAppendage: 'analysis'},
    {name: 'Recommendations', pathAppendage: 'recommendations'},
]

// HERO TEXT
export const bigText = "Free Accessibility checker for website owners and developers";
export const smallText = "An accessibility solution for quick website accessibility assessment and improvement!";

// ------------------------------------
// BUTTONS TEXT
export const urlSubmit = "Evaluate!";
export const learnTopbar = "Learn!";
export const aboutWCAG = "About WCAG";


// OUTPUT PAGE
// Text
export const ratingText = "Some sample text just for show"

// Sample Description
export const sampleDescription = "Your website is very accessible for deaf people, good enough for visually impaired people and good for people with cognitive challenges!"