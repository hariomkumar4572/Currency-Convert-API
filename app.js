// 1. New active API URL
const BASE_URL = "https://jsdelivr.net";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");
const amountInput = document.querySelector(".amount input");

// 2. Populate dropdowns with currency codes
for (let select of dropdowns) {
  for (let currCode in countryList) { 
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }

  // Update rates immediately on dropdown change
  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
    updateExchangeRate(); 
  });
}

// 3. Dynamically update exchange rate as you type digits
amountInput.addEventListener("input", () => {
  updateExchangeRate();
});

// 4. Main function to calculate exchange rates
const updateExchangeRate = async () => {
  let amtVal = amountInput.value;
  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
  }

  const URL = `${BASE_URL}/${fromCurr.value.toLowerCase()}.json`;
  
  try {
    let response = await fetch(URL);
    let data = await response.json();
    
    let rate = data[fromCurr.value.toLowerCase()][toCurr.value.toLowerCase()];
    let finalAmount = (amtVal * rate).toFixed(2); 
    
    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
  } catch (error) {
    msg.innerText = "Error loading rates.";
    console.error("Fetch error:", error);
  }
};

// 5. Update country flag
const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com{countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  if (img) {
    img.src = newSrc;
  }
};

// Button click fallback handler
btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

// Run conversion loop on page load
window.addEventListener("load", () => {
  updateExchangeRate();
});
