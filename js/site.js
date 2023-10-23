function runMortgageCalculator() {

    // Get Variables
    let mortgageVariables = getMortgageVariables()

    // Calculate the mortagge loan values from Variables
    let amortizationArray = calculateMortgage(mortgageVariables);

    displayMortgageSummary(amortizationArray, mortgageVariables.term);

    displayAmortTable(amortizationArray);
}

// Calculates values to put on amortization table and returns it in array of objects
function calculateMortgage(mortgageVariables) {

    let loan = mortgageVariables.loan;
    let term = mortgageVariables.term;
    let rate = mortgageVariables.rate;

    // Calculate Monthly Payment
    let monthlyPayment = loan * (rate / 1200) / (1 - Math.pow((1 + rate/1200), -term));

    // Array to hold all the objects for each monthly calculation
    let termMortgageCalculation = [];

    // Initialize object 
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
    for (let i=0; i <= mortgageVariables.term; i++) {

        if (i > 0 ) {

            // Set the month
            let month = i;
                    
            // Calculate the monthly interest Payment
            let remaingingBalance = termMortgageCalculation[i-1].monthlyBalance
            let monthlyInterest = remaingingBalance * rate / 1200;

            // Calculate the monthly principal payment
            let monthlyPrincipal = monthlyPayment - monthlyInterest;

            // Calculate the total monthly principal up to that month
            let totMonthlyPrincipal = termMortgageCalculation[i-1].totMonthlyPrincipal + monthlyPrincipal ;

            // Calculate the total monthly interest up to that month
            let totMonthlyInterest = termMortgageCalculation[i-1].totMonthlyInterest + monthlyInterest;

            // Calculate the remaining balance
            remaingingBalance -= monthlyPrincipal;

            // Put all calculations for month into array
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
        termMortgageCalculation.push(monthlyMortgageCalculation);
    }
    return termMortgageCalculation;
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
    newMortgageVariables.rate = parseInt(newMortgageVariables.rate);

    return newMortgageVariables;
}

// Display value summary
function displayMortgageSummary(amortizationArray, term) {

    let lastMonth = amortizationArray[term];

    let dollarUSLocal = Intl.NumberFormat('en-US', {
        style: "currency",
        currency: "USD"
    });

    let monthlyPayment = document.getElementById('monthlyPayment');
    monthlyPayment.textContent = dollarUSLocal.format(lastMonth.monthlyPayment);

    let totPrincipal = document.getElementById('totPrincipal');
    totPrincipal.textContent = dollarUSLocal.format(lastMonth.totMonthlyPrincipal);

    let totInterest = document.getElementById('totInterest');
    totInterest.textContent = dollarUSLocal.format(lastMonth.totMonthlyInterest);

    let totCost = document.getElementById('totCost');
    totCost.textContent = dollarUSLocal.format(lastMonth.totMonthlyPrincipal + lastMonth.totMonthlyInterest);

}

// Display values on the amortization table
function displayAmortTable(amortizationArray) {

    let dollarUSLocal = Intl.NumberFormat('en-US', {
        style: "currency",
        currency: "USD"
    });

    const amortTable = document.getElementById('amortizationSchedule');

    amortTable.innerHTML = '';

    const amortRowTemplate = document.getElementById('amortRowTemplate');

    for(i = 1; i < amortizationArray.length; i++) {

        let monthlyMortgage = amortizationArray[i];

        let amortRow = amortRowTemplate.content.cloneNode(true);

        let month = amortRow.getElementById('month');
        month.textContent = monthlyMortgage.month;

        let monthlyPayment = amortRow.getElementById('monthlyPayment');
        monthlyPayment.textContent = dollarUSLocal.format(monthlyMortgage.monthlyPayment);

        let monthlyPrincipal = amortRow.getElementById('monthlyPrincipal');
        monthlyPrincipal.textContent = dollarUSLocal.format(monthlyMortgage.monthlyPrincipal);

        let monthlyInterest = amortRow.getElementById('monthlyInterest');
        monthlyInterest.textContent = dollarUSLocal.format(monthlyMortgage.monthlyInterest);

        let totMonthlyInterest = amortRow.getElementById('totMonthlyInterest');
        totMonthlyInterest.textContent = dollarUSLocal.format(monthlyMortgage.totMonthlyInterest);

        let monthlyBalance = amortRow.getElementById('monthlyBalance');
        monthlyBalance.textContent = dollarUSLocal.format(monthlyMortgage.monthlyBalance);

        amortTable.appendChild(amortRow);
    }

}