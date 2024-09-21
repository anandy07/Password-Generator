const inputSlider = document.querySelector("[data-lenghtSlider]");
const lenghtDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numberCheck = document.querySelector("#numbers");
const symbolCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()[{]</;:>}\,.?';

let password = "";
let passwordLength = 10;
let checkbox = 0;
handleSlider();

// set strenght circle color to grey
setIndicator("#ccc");




// set passwordLength
function handleSlider() {
    inputSlider.value = passwordLength;
    lenghtDisplay.innerText = passwordLength;
}

function setIndicator(color){
    indicator.style.backgroundColor = color; 
}


function getRndInteger(min , max){
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber(){
    return getRndInteger(0,9);

}

function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}

function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91));
}


function generateSymbol(){
    const randNum = getRndInteger(0 , symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numberCheck.checked) hasNum = true;
    if(symbolCheck.checked) hasSym = true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength >=8){
        setIndicator("0f0");
    }else if(
        (hasLower ||  hasUpper ) && 
        (hasNum || hasSym) && 
        passwordLength >= 6
    ) {
        setIndicator("#ff0");
    }else {
        setIndicator("#f00");
    }

}

async function copyContent(){
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch(e) {
        copyMsg.innerText = "Failed";
    }

    //to make copy wala span visible
    copyMsg.classList.add("active");

    setTimeout( () => {
        copyMsg.classList.remove("active");
    },2000 );
}

function shufflePassword(array){
    // fisher yates method
    for (let i = array.length - 1; i > 0; i--) {
        //random j, find out using random function
        const j = Math.floor(Math.random() * (i + 1));
        // swap number at i index and j index
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;  
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
    
}

function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked)
            checkCount++;
    })


    // special condition 
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change' , handleCheckBoxChange);
})

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value)
        copyContent();
})

generateBtn.addEventListener('click', () => {
    // none of the checkbox are selected
    if(checkCount == 0) 
        return;

    if(passwordLength < checkCount) {
        passwordLength  = checkCount;
        handleSlider();
    }

    // let start the jouney mention by checkedboxes


    // remove old password

    password = "";

    //let's put the stuff mention by checkboxes;

    // if(uppercaseCheck.checked) {
    //     password += generateUpperCase();
    // }

    // if(lowercaseCheck.checked) {
    //     password += generateLowerCase();
    // }

    // if(numberCheck.checked) {
    //     password += generateRandomNumber();
    // }

    // if(symbolCheck.checked) {
    //     password += generateSymbol();
    // }

    let funcArr = [];

    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);
    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);
    if(numberCheck.checked)
        funcArr.push(generateRandomNumber);
    if(symbolCheck.checked)
        funcArr.push(generateSymbol);

    // compulsory addition
    for(let i = 0; i<funcArr.length; i++){
        password += funcArr[i]();
    }

    // remaining addition 
    for(let i=0; i<passwordLength-funcArr.length; i++){
        let randIndex = getRndInteger(0 , funcArr.length);
        password += funcArr[randIndex]();
    }

    // shuffle the password
    password = shufflePassword(Array.from(password));

    //  show in UI
    passwordDisplay.value = password;

    //calculate strenght
    calcStrength();

    

});