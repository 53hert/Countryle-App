import { main } from "./country.js";

import 'bootstrap';

import {
    getFirestore,
    collection,
    query,
    orderBy,
    serverTimestamp,
    getDocs,
    onSnapshot,
    addDoc,
    doc,

} from 'firebase/firestore'

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
    apiKey: "AIzaSyCBdUr1iMLziuEHRuskXnr6pSVNyn09SoI",
    authDomain: "countrygame-a9692.firebaseapp.com",
    projectId: "countrygame-a9692",
    storageBucket: "countrygame-a9692.appspot.com",
    messagingSenderId: "598507736419",
    appId: "1:598507736419:web:6a540284f7a3f95de81756",
    measurementId: "G-SBLFFRTGMS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// init services
const db = getFirestore();


//collection ref
const colRef = collection(db, 'countries');


//queries
const q = query(colRef);


// Get all category elements
const categories = document.querySelectorAll('.category');
const toBeat = document.querySelector('.toBeat');
const carouselFlags = document.querySelectorAll('.carousel-flag');
const carouselCaptions = document.querySelectorAll('.carousel-caption');
let country = null;

let gameEnded = false;

let canGenerateCountry = true;

// Call main function to get random country
main()
    .then(randomCountry => {
        // Access the random country object here
        // console.log('First country in index.js:', randomCountry);


        // Update random country UI
        imgChange(randomCountry);
        nameChange(randomCountry);
        country = randomCountry;

        firstCountry(randomCountry);

        //Update the toBeat country
        toBeat.innerText = `To Beat: ${country.name}`;


    }).catch(error => {
        console.error('Error getting random country:', error);
    });

const imgChange = (country) => {
    //change image
    const flag = document.querySelector('.flag');
    const code = country.code;
    flag.src = `./assets/4x3/${code}.svg`;
};

const nameChange = (country) => {
    //change name
    // console.log('Country in index.js:', country);
    const countryName = document.querySelector('.countryName');
    const name = country.name;
    countryName.textContent = `${country.name}`;
};

const firstCountry = async () => {
    // Lock all the <li> elements initially
    const listItems = document.querySelectorAll('.list-group-item');
    listItems.forEach(item => {
        item.classList.add('locked');
    });

    // Delay execution by 3 seconds using setTimeout
    setTimeout(async () => {
        try {
            let randomCountry;
            do {
                randomCountry = await main();
            } while (randomCountry.name === country.name); // Ensure new country is different

            // Update UI with the new random country
            imgChange(randomCountry);
            nameChange(randomCountry);
            country = randomCountry; // Update the global country variable

            // Unlock all the <li> elements after main() is called
            listItems.forEach(item => {
                item.classList.remove('locked');
            });

            // Lock the toBeat element
            toBeat.classList.add('locked');

            // Check if all list items are locked
            const allLocked = Array.from(listItems).every(item => item.classList.contains('locked'));
            if (allLocked) {
                // Show popup indicating game end
                startEndGame();
                gameEnded = true; // Set gameEnded to true to prevent further country generation
            }
        } catch (error) {
            console.error('Error getting random country:', error);
        }
    }, 3000); // Delay for 3 seconds (3000 milliseconds)
};

let  i = 0;
    // Assigning country to tab
    categories.forEach(category => {
        category.addEventListener('click', async e => {
            // // Get the text content of the clicked category
            if (e.target.classList.contains('category') && (!gameEnded || !e.target.classList.contains('locked'))) {
                if (!e.target.classList.contains('locked')) {
                    e.target.innerText = `${e.target.innerText}   ${country.name}`
                    e.target.classList.add("locked");

                    const countryCode = country.code;

                // Generate the path to the SVG file based on the country code
                const flagPath = `./assets/4x3/${countryCode}.svg`;

                // Assign the flag to each carousel item
                carouselCaptions[i].innerText = `${country.name}, ${country.continent}`
                carouselFlags[i].src= flagPath
                i++
                    // Check if all list items are locked
                    const listItems = document.querySelectorAll('.list-group-item');
                    const allLocked = Array.from(listItems).every(item => item.classList.contains('locked'));
                    if (allLocked) {
                        // Show popup indicating game end
                        canGenerateCountry = false; // Prevents new country
                        startEndGame();
                        gameEnded = true; // Set gameEnded to true to prevent further country generation
                    }
                    if (canGenerateCountry) {
                        // Call main function to get a new random country
                        try {
                            const randomCountry = await main();
                            // Update UI with the new random country
                            imgChange(randomCountry);
                            nameChange(randomCountry);
                            country = randomCountry; // Update the global country variable


                        } catch (error) {
                            console.error('Error getting random country:', error);
                        }
                    }
                }
            }
        })
    })

    const saveToDb = () => {
        const listItems = document.querySelectorAll('.locked');
        const data = {}; // Initialize an object to accumulate data

        listItems.forEach(item => {
            const [category, country] = item.textContent.split(':').map(str => str.trim());
            data[category] = country; // Assign the country to the category key in the data object
            console.log(data[country])
        });

        // Add the accumulated data object to Firestore
        addDoc(colRef, data)
            .catch((error) => {
                console.error("Error adding document: ", error);
            })

    }


    // Function to display the game end popup
    const startEndGame = () => {
        // Replace this with your code to display the popup
        if (!gameEnded) {
            // alert('Game has ended. All categories have been assigned, restarting game...');
            saveToDb();
            togglePopup()
            gameEnded = true; // Set gameEnded to true to prevent further country generation

        }
    };

    // function to toggle the endgame popup
    function togglePopup() {

        document.getElementById('popup-1').classList.toggle('active');
    }

    const restart = document.querySelector('.restart');

    restart.addEventListener('click', e => {
        console.log('restarting');
        location.reload();
    });



