function runMortgageCalculator() {

    // Get Variables
    let mortgageVariables = getMortgageVariables()

    // Calculate the mortagge loan values from Variables
    let mortgageCalcObject = calculateMortgage(mortgageVariables);

    displayMortgageSummary(mortgageCalcObject.summary);

    displayAmortTable(mortgageCalcObject.amortizationArray);

    // Get calculations from local storage
    let mortgageCalcsArray = getCalculation();
    
    if (mortgageCalcsArray.length > 0) {
        displayHistory(mortgageCalcsArray);
    }

    // Update array with new mortgage calculation
    mortgageCalcsArray.push(mortgageCalcObject);

    // Save new updated array to local storage
    saveCalculation(mortgageCalcsArray);

}

// Calculates values to put on amortization table and returns it in array of objects
function calculateMortgage(mortgageVariables) {

    let loan = mortgageVariables.loan;
    let term = mortgageVariables.term;
    let rate = mortgageVariables.rate;

    // Calculate Monthly Payment
    let monthlyPayment = loan * (rate / 1200) / (1 - Math.pow((1 + rate/1200), -term));

    // Array to hold all the objects for each monthly calculation
    let amortizationArray = [];

    // Initialize monthly object 
    let monthlyMortgageCalculation = {
        month: 0,
        monthlyPayment: 0,
        monthlyPrincipal: 0,
        monthlyInterest: 0,
        totMonthlyPrincipal: 0,
        totMonthlyInterest: 0,
        monthlyBalance: loan
    };

    // Calculate values and put them into calculation object for that month and add to array
    for (let i=0; i <= term; i++) {

        if (i > 0 ) {

            // Set the month
            let month = i;
                    
            // Calculate the monthly interest Payment
            let remaingingBalance = amortizationArray[i-1].monthlyBalance
            let monthlyInterest = remaingingBalance * rate / 1200;

            // Calculate the monthly principal payment
            let monthlyPrincipal = monthlyPayment - monthlyInterest;

            // Calculate the total monthly principal up to that month
            let totMonthlyPrincipal = amortizationArray[i-1].totMonthlyPrincipal + monthlyPrincipal ;

            // Calculate the total monthly interest up to that month
            let totMonthlyInterest = amortizationArray[i-1].totMonthlyInterest + monthlyInterest;

            // Calculate the remaining balance
            remaingingBalance -= monthlyPrincipal;

            // Put all calculations for month into object
            monthlyMortgageCalculation = {
                month: month,
                monthlyPayment: monthlyPayment,
                monthlyPrincipal: monthlyPrincipal,
                monthlyInterest: monthlyInterest,
                totMonthlyPrincipal: totMonthlyPrincipal,
                totMonthlyInterest: totMonthlyInterest,
                monthlyBalance: remaingingBalance
            };

        }

        // Add calculation for month to array
        amortizationArray.push(monthlyMortgageCalculation);
    }

    // Get the last month in the amortization array
    let lastMonth = amortizationArray[term];

    // Put summary in object
    let summary = {
        monthlyPayment: lastMonth.monthlyPayment,
        totPrincipal: lastMonth.totMonthlyPrincipal,
        totInterest: lastMonth.totMonthlyInterest,
        totCost: lastMonth.totMonthlyPrincipal + lastMonth.totMonthlyInterest
    }

    // Make one object that holds summary object and amortization array
    let mortgageCalcObject = {
        mortgageVariables: mortgageVariables,
        summary: summary,
        amortizationArray: amortizationArray
    }

    return mortgageCalcObject;
}


// Grab the variables from the form and change to numbers to calculate the mortgage
function getMortgageVariables() {

    // Get HTML Mortgage Calculator Form Element
    let newMortgageCalcForm = document.getElementById('newMortgageCalcForm');
    let mortgageFormVariables = new FormData(newMortgageCalcForm);

    // Create a mortgage variable object from the Mortgage Calculator Form
    let newMortgageVariables = Object.fromEntries(mortgageFormVariables.entries());

    // Change values in object from string to numbers
    newMortgageVariables.loan = parseInt(newMortgageVariables.loan);
    newMortgageVariables.term = parseInt(newMortgageVariables.term);
    newMortgageVariables.rate = parseFloat(newMortgageVariables.rate);

    let loan = newMortgageVariables.loan;
    let term = newMortgageVariables.term;
    let rate = newMortgageVariables.rate;

    if (!isNaN(loan) 
        && !isNaN(term) 
        && !isNaN(rate)
        && loan > 0
        && term > 0
        && rate >= 0 ) {
            return newMortgageVariables;
    } else {

        // Uh oh!
        Swal.fire ({
            icon: 'error',
            backdrop: false,
            title: 'Oops!',
            text: 'Please enter valid integers. Check term and loan are greater than zero and rate is equal to or greater than zero.'
        });
    }
}

// Display value summary
function displayMortgageSummary(mortgageCalcSummary) {

    let summary = mortgageCalcSummary;
    
    // Could use toLocaleString instead
    let dollarUSLocal = Intl.NumberFormat('en-US', {
        style: "currency",
        currency: "USD"
    });

    let monthlyPayment = document.getElementById('monthlyPayment');
    monthlyPayment.textContent = dollarUSLocal.format(summary.monthlyPayment);

    let totPrincipal = document.getElementById('totPrincipal');
    totPrincipal.textContent = dollarUSLocal.format(summary.totPrincipal);

    let totInterest = document.getElementById('totInterest');
    totInterest.textContent = dollarUSLocal.format(summary.totInterest);

    let totCost = document.getElementById('totCost');
    totCost.textContent = dollarUSLocal.format(summary.totCost);

}

// Display values from array on the amortization table
function displayAmortTable(amortizationArray) {

    let dollarUSLocal = Intl.NumberFormat('en-US', {
        style: "currency",
        currency: "USD"
    });

    // Get the table body element to put the rows in
    const amortTable = document.getElementById('amortizationSchedule');

    // Rest table
    amortTable.innerHTML = '';

    // Get the amortization table row template
    const amortRowTemplate = document.getElementById('amortRowTemplate');

    // Make each row for the table and put the data in the table
    // can use forEach 
    // amortizationArray.forEach(payment => {})
    for(i = 1; i < amortizationArray.length; i++) {

        let monthlyMortgage = amortizationArray[i];

        let amortRow = amortRowTemplate.content.cloneNode(true);

        // Could use 'querySelectorAll' to get all the 'td' as an array and index them accordingly put content in
        let month = amortRow.querySelector('.month');
        month.textContent = monthlyMortgage.month;

        let monthlyPayment = amortRow.querySelector('.monthlyPayment');
        monthlyPayment.textContent = dollarUSLocal.format(monthlyMortgage.monthlyPayment);

        let monthlyPrincipal = amortRow.querySelector('.monthlyPrincipal');
        monthlyPrincipal.textContent = dollarUSLocal.format(monthlyMortgage.monthlyPrincipal);

        let monthlyInterest = amortRow.querySelector('.monthlyInterest');
        monthlyInterest.textContent = dollarUSLocal.format(monthlyMortgage.monthlyInterest);

        let totMonthlyInterest = amortRow.querySelector('.totMonthlyInterest');
        totMonthlyInterest.textContent = dollarUSLocal.format(monthlyMortgage.totMonthlyInterest);

        let monthlyBalance = amortRow.querySelector('.monthlyBalance');
        // Can use Math.abs in above monthlyBalance instead of if statement to make sure it only returns positive values
        if (monthlyMortgage.monthlyBalance < 0 ) {

            monthlyBalance.textContent = dollarUSLocal.format(0);
        }

        amortTable.appendChild(amortRow);
    }
}

// Get calculations that are stored in local storage
function getCalculation() {
    // Get calculations from local storage
    let mortgageCalcsJson = localStorage.getItem('rpc-mortgageCalcs');

    // Initialize calcs if it hasn't been created before
    let storedMortgageCalcs = [];

    if (mortgageCalcsJson != null) {
        storedMortgageCalcs = JSON.parse(mortgageCalcsJson);
    }

    return storedMortgageCalcs;
}

// Save calculation in local storage
function saveCalculation(mortgageCalcsArray) {

    // Turn mortgage object into string
    let mortgageCalcsJson = JSON.stringify(mortgageCalcsArray);

    localStorage.setItem('rpc-mortgageCalcs', mortgageCalcsJson);
}

// Display past calculations
function displayHistory(mortgageCalcsArray) {

    const historyCardTemplate = document.getElementById('historyCardTemplate');

    const historyCardDiv = document.getElementById('historyCardDiv');

    historyCardDiv.textContent = '';

    let dollarUSLocal = Intl.NumberFormat('en-US', {
        style: "currency",
        currency: "USD"
    });

    for (let i = mortgageCalcsArray.length - 1; i >= 0 ; i--) {

        let mortgageCalc = mortgageCalcsArray[i];

        // Grab values to add to card
        let monthlyPaymentHistValue = mortgageCalc.summary.monthlyPayment;
        monthlyPaymentHistValue = dollarUSLocal.format(monthlyPaymentHistValue);
        let loanHistValue = mortgageCalc.mortgageVariables.loan;
        loanHistValue = loanHistValue/1000;
        let termHistValue = mortgageCalc.mortgageVariables.term;
        termHistValue = termHistValue;
        let rateHistValue = mortgageCalc.mortgageVariables.rate;
        rateHistValue = rateHistValue;

        let historyCard = historyCardTemplate.content.cloneNode(true);

        let collapseCard = historyCard.querySelector('.collapse');
        collapseCard.setAttribute('id', `collapse-${i}`);
        
        let collapseBtn = historyCard.querySelector('.collapse .btn-close');
        collapseBtn.setAttribute('data-bs-target', `#collapse-${i}`);
        collapseBtn.setAttribute('aria-controls',`collapse-${i}`);
        collapseBtn.setAttribute('data-mortgageCalcsArray-id',`${i}`);

        let monthlyPaymentHist = historyCard.querySelector('.monthlyPaymentHist');
        monthlyPaymentHist.textContent = monthlyPaymentHistValue;

        let loanHist = historyCard.querySelector('.loanHist');
        loanHist.textContent = loanHistValue;
        
        let termHist = historyCard.querySelector('.termHist');
        termHist.textContent = termHistValue; 

        let rateHist = historyCard.querySelector('.rateHist');
        rateHist.textContent = rateHistValue; 

        historyCardDiv.appendChild(historyCard);
    }

}

// Delete the saved calculation if the close button is pressed on the history cards
function deleteCalculation(closeBtn) {

    // Get number that identifies history card
    let arrayNum = parseInt(closeBtn.getAttribute('data-mortgageCalcsArray-id'));

    // Get calculations from local storage
    let mortgageCalcsArray = getCalculation();
    
    // Decalare new array variable to move over the objects that are not deleted
    let newMortgageCalcsArray = [];

    for (let i = 0; i < mortgageCalcsArray.length; i++) {

        if (i != arrayNum) {
        // Move over saved calculation
        newMortgageCalcsArray.push(mortgageCalcsArray[i]);
        }
    }

    // Save new updated array to local storage
    saveCalculation(newMortgageCalcsArray);

}