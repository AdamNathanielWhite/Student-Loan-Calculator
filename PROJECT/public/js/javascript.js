console.log("javascript.js loaded");

/* --- MANIPULATING HTML ELEMENTS ON THE PAGE. hide things, show data, etc --- */
/*document.getElementById("refinanceCheckbox").addEventListener("click", function(){
	if(document.getElementById("refinanceCheckbox").checked) {
		document.getElementById("refinanceOptionDiv").hidden = false;
	} else {
		document.getElementById("refinanceOptionDiv").hidden = true;
	}
}, false);*/

document.getElementById("planType").addEventListener("change", submitUpdate);
document.getElementById("completedMonth").addEventListener("change", submitUpdate);
document.getElementById("completedYear").addEventListener("change", submitUpdate);
document.getElementById("defermentCheck").addEventListener("change", submitUpdate);
document.getElementById("defermentMonth").addEventListener("change", submitUpdate);
document.getElementById("defermentYear").addEventListener("change", submitUpdate);
document.getElementById("income").addEventListener("change", submitUpdate);
document.getElementById("stateResidency").addEventListener("change", submitUpdate);
document.getElementById("householdSize").addEventListener("change", submitUpdate);
document.getElementById("forgivenessCheckbox").addEventListener("change", function(){
	if(document.getElementById("forgivenessCheckbox").checked) {
		document.getElementById("loanForgivenessHiddenInput").hidden = false;
		document.getElementById("loanForgivenessHiddenInputInverse").hidden = true;
	} else {
		document.getElementById("loanForgivenessHiddenInput").hidden = true;
		document.getElementById("loanForgivenessHiddenInputInverse").hidden = false;
	}
	//alert(document.getElementById("forgivenessCheckbox").checked);
	
	submitUpdate();
}, false);
document.getElementById("forgivenessYears").addEventListener("change", submitUpdate);
document.getElementById("extraPaymentNone").addEventListener("change", submitUpdate);
document.getElementById("extraPayment").addEventListener("change", submitUpdate);
document.getElementById("usingAutopay").addEventListener("change", submitUpdate);
document.getElementById("payOffOrder").addEventListener("change", submitUpdate);
//document.getElementById("submitButton").addEventListener("click", submitUpdate, false);

function submitUpdate() {
	//Pull input values from the html document 
	var plan = document.getElementById("planType").value;
	var completedMonth = Number(document.getElementById("completedMonth").value);
	var completedYear = Number(document.getElementById("completedYear").value);
	var defermentBool = document.getElementById("defermentCheck").checked;
	var defermentMonth = Number(document.getElementById("defermentMonth").value);
	var defermentYear = Number(document.getElementById("defermentYear").value);
	var income = Number(document.getElementById("income").value);
	var stateResidency = document.getElementById("stateResidency").value;
	var householdSize = document.getElementById("householdSize").value;
	var forgivenessCheckbox = document.getElementById("forgivenessCheckbox").checked;
	var forgivenessYears = Number(document.getElementById("forgivenessYears").value);
	var extraPaymentOption = document.querySelector('input[name="extraPaymentGroup"]:checked').value; //See http://stackoverflow.com/a/15839451/2312949
	var extraMonthlyPaymentAmount = Number(document.getElementById("extraMonthlyPaymentAmount").value);
	var refinanceCheckbox = "false"; //document.getElementById("refinanceCheckbox").checked;
	var refinanceAmount = 0; //Number(document.getElementById("refinanceAmount").value);
	var nYearsRefinance = 0; //Number(document.getElementById("nYearsRefinance").value);
	var refinanceInterestRate = 0; //Number(document.getElementById("refinanceInterestRate").value);
	var usingAutopay = document.getElementById("usingAutopay").checked;
	var payOffOrder = document.getElementById("payOffOrder").value;
	var newRepaymentPlan = "standard"; //document.getElementById("newRepaymentPlan").value;

	//TODO: Check these inputs. no negative numbers, text in numbers, blank, etc.
	
	//Payments based on discretionary income
	var paymentsAt10PercentDiscretionaryIncome = getPaymentsBasedOnDiscretionaryIncome(income, stateResidency, householdSize, 10);
	var paymentsAt15PercentDiscretionaryIncome = getPaymentsBasedOnDiscretionaryIncome(income, stateResidency, householdSize, 15);
	
	//Forgiveness years
	if ( forgivenessYears == 0 ) {
		forgivenessYears = 10;
	}
	
	// Extra payment
	if(extraPaymentOption == "extraPaymentNone") {
		extraMonthlyPaymentAmount = 0;
	}
	//else if(extraPaymentOption == "extraPaymentCustom") {
		//TODO: Vary the payments based on graph input. This block of code shouldn't live here. (where should it go?)
	//}
	
	//TODO: This is incorrect - http://clubmate.fi/javascript-adding-and-removing-class-names-from-elements/
	//if( document.getElementById("forgivenessYears").hasClass(" missing-required-input ") ) { 
	//	//document.getElementById("forgivenessYears").removeClass(" missing-required-input "); 
	//}
	//if ( forgivenessCheckbox === true && (forgivenessYears == "" || typeof(Number(forgivenessYears)) !== "number" || forgivenessYears < 0)) {
	//	alert("if");
	//	document.getElementById("forgivenessYears").classList.add(" missing-required-input ");
	//	alert("added");
	//}
	
	//Find the total number of months remaining on the plan
	var differenceMonths = completedMonth - todaysMonth;
	var differenceYears = completedYear - todaysYear;
	var totalMonthsRemaining = (differenceYears * 12) + differenceMonths;
	console.log("The number of months remaining until payoff is " + totalMonthsRemaining);
	
	//Put these values into a scenario object json
	//BUG: We don't need 'scenario' at the beginning. It must also be taken out in addScenario() method. This also doesn't need to be a string json, just a json object
	var inputScenario = '{"scenario": { \
		"plan": "' + plan + '", \
		"completedMonth": "' + completedMonth + '", \
		"completedYear": "' + completedYear + '", \
		"totalMonthsRemaining": "' + totalMonthsRemaining + '", \
		"defermentBool": "' + defermentBool + '", \
		"defermentMonth": "' + defermentMonth +'", \
		"defermentYear": "' + defermentYear + '", \
		"income": "' + income + '", \
		"paymentsAt10PercentDiscretionaryIncome": "' + paymentsAt10PercentDiscretionaryIncome + '", \
		"paymentsAt15PercentDiscretionaryIncome": "' + paymentsAt15PercentDiscretionaryIncome + '", \
		"stateResidency": "' + stateResidency + '", \
		"forgivenessCheckbox": "' + forgivenessCheckbox + '", \
		"forgivenessYears": "' + forgivenessYears + '", \
		"extraPaymentOption": "' + extraPaymentOption + '", \
		"extraMonthlyPaymentAmount": "' + extraMonthlyPaymentAmount + '", \
		"refinanceCheckbox": "' + refinanceCheckbox + '", \
		"refinanceAmount": "' + refinanceAmount + '", \
		"nYearsRefinance": "' + nYearsRefinance + '", \
		"refinanceInterestRate": "' + refinanceInterestRate + '", \
		"usingAutopay": "' + usingAutopay + '", \
		"payOffOrder": "' + payOffOrder + '", \
		"newRepaymentPlan": "' + newRepaymentPlan + '" }}';
	console.log("Input scenario JSON is: " + inputScenario);
	var jsonInputScenario = JSON.parse(JSON.stringify(inputScenario));
	
	//pass the json object into the data handler
	addScenario(jsonInputScenario);
}


/* --- LOAN INPUT --- */
document.getElementById("submitLoanButton").addEventListener("click", function(){
	//alert("submitLoanButton event");
	// Create loan object and add it to the data structure list of loans
	var newLoanAmount = Number(document.getElementById("loanAmountInput").value);
	var newLoanRate = Number(document.getElementById("interestRateInput").value);
	var subsidizedBool = document.getElementById("subsidizedCheck").checked;
	
	//Sanitize inputs
	console.log("typeof newLoanAmount is " + typeof(newLoanAmount));
	if(typeof(newLoanAmount) !== "number" || newLoanAmount < 0 || isNaN(newLoanAmount)) {
		console.log("Bad input newLoanAmount to new loan");
		newLoanAmount = 0;
	}
	if(typeof(newLoanRate) !== "number" || newLoanRate < 0 || isNaN(newLoanRate)) {
		console.log("Bad input newLoanRate to new loan");
		newLoanRate = 0;
	}
	
	
	addLoan(newLoanAmount, newLoanRate, subsidizedBool); 
	submitUpdate();
}, false);


/* --- UPDATING AND SUBMITTING INPUTS --- */
// submitButton sends all inputs to the dataHandler 
var povertyThresholds150Percent = {
		"Lower48": [0, 16755, 22695, 28635, 34575, 40515, 46455, 52395, 38335], 
		"Alaska": [0, 13970, 18920, 23870, 28820, 33770, 38720, 43670, 48620], 
		"Hawaii": [0, 12860, 17410, 21960, 26510, 31060, 35610, 40160, 44710]};
function getPaymentsBasedOnDiscretionaryIncome(income, state, householdSize, percentageOfDiscretionaryIncome) {
	if (income === "" || typeof(Number(income)) !== "number" || income < 0 ) {
		//Non-essential input, don't require it. Set to maximum instead.
		income = 100000;
	}
	income = Number(income);
	
	//See: http://www.lendkey.com/studentloans/2013/11/05/how-do-i-calculate-my-ibr-payment/
	var personalPovertyThreshold150Percent = 100000;
	if(state == "Hawaii") {
		personalPovertyThreshold150Percent = povertyThresholds150Percent.Hawaii[householdSize];
		console.log("Hawaii selected for poverty level data");
	} else if ( state == "Alaska" ) {
		personalPovertyThreshold150Percent = povertyThresholds150Percent.Alaska[householdSize];
		console.log("Alaska selected for poverty level data");
	} else { //lower 48
		personalPovertyThreshold150Percent = povertyThresholds150Percent.Lower48[householdSize];
		console.log("Lower 48 selected for poverty level data");
	}
	
	//See: http://www.lendkey.com/studentloans/2013/11/05/how-do-i-calculate-my-ibr-payment/
	var monthlyPoverty150 = personalPovertyThreshold150Percent / 12;
	var monthlyIncome = income / 12;
	var monthlyDiscretionaryIncome = monthlyIncome - monthlyPoverty150;
	var monthlyPayment = monthlyDiscretionaryIncome * ( percentageOfDiscretionaryIncome / 100);
	return monthlyPayment;
}

function displayFuture(future) {
	//iterate through each loan and sum up all the payments
	var totalSumOfPayments = 0;
	var finalPayoffMonthNum = 0;
	for(var loanNum=0; loanNum<future.loans.length; loanNum++ ) {
		var monthlyPayment
		for(var monthNum=0; monthNum<future.loans[loanNum].month.length; monthNum++ ) {
			totalSumOfPayments += future.loans[loanNum].month[monthNum].monthPrinciplePlusInterest;
			totalSumOfPayments += future.loans[loanNum].month[monthNum].monthExtraPayment;
			
			//find the last month
			if(finalPayoffMonthNum < monthNum ) {
				finalPayoffMonthNum = monthNum;
			}
		}
	}
	finalPayoffMonthNum += 1; //correct an off-by-one error
	console.log("The last month of payments is month number " + finalPayoffMonthNum);
	console.log("The total sum of payments is " + totalSumOfPayments);
	
	//convert number of months of payoff to an actual date
	var payoffMonth = Math.trunc(todaysMonth + finalPayoffMonthNum % 12);
	var payoffYear = Math.trunc(todaysYear + finalPayoffMonthNum / 12);
	while ( payoffMonth > 12 ) {
		payoffMonth -= 12;
		payoffYear += 1;
	}
	var payoffDateString = payoffMonth + "/" + payoffYear;
	console.log("Payoff MM/YYYY is " + payoffDateString);
	
	// Output the payment
	var totalMonthlyPayment = future.information.totalInitialMonthlyPayment + future.information.beginningExtraPayment + future.information.extraMonthlyAmountToReachMinimums;
	var stringPayments = "Your monthly payments are $" + totalMonthlyPayment.toFixed(2);
	//TODO: Allow the payment to vary over time
	/*// Find the max and min payment amounts
	var highestPayment = 50;
	var lowestPayment = 999999;
	for(var t = 0; t<future.totalMonthlyPayment.length; t++) {
		if( future.totalMonthlyPayment[t] > highestPayment ) {
			highestPayment = future.totalMonthlyPayment[t]; 
		}
		if( future.totalMonthlyPayment[t] < lowestPayment ) {
			lowestPayment = future.totalMonthlyPayment[t]; 
		}
	}
	var stringPayments = "";
	if ( lowestPayment === highestPayment ) {
		stringPayments = "Your monthly payments are $" + highestPayment.toFixed(2);
	} else {
		stringPayments = "The highest monthly payment is $" + highestPayment.toFixed(2) + " and the lowest monthly payment is $" + lowestPayment.toFixed(2);
	}*/
	console.log(stringPayments);
	
	
	//don't let the user see null data
	if(totalSumOfPayments === 0 || totalMonthlyPayment === 0 ||
			isNaN(totalSumOfPayments) || isNaN(totalMonthlyPayment) ) {
		document.getElementById("futureResults").setAttribute("hidden", true);
		return;
	}
	
	//output data to the user
	document.getElementById("loanPayoffDateOutput").value = payoffDateString;
	document.getElementById("totalOfPaymentsOutput").value = "$" + totalSumOfPayments.toFixed(2); 
	document.getElementById("highestLowestMonthlyPayments").value = stringPayments;
	document.getElementById("futureResults").removeAttribute("hidden");
}