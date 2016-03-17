console.log("scenarioGenerator.js loaded");

function createScenarioObject() {
	//TODO: Take in a bunch of scenario variables as arguments, possibly in enums. Create an object with these values.
}

function createScenarioExtraMonthly(scenario, extraMonthlyAmount) {
	//TODO: create a new scenario by paying an extra monthly amount, say $100 per month. The TOP and end date will need to be adjusted.
}



// --- EVALUATION WEIGHTS ---
// These methods return a weighted score, where 0 is good and 10+ is bad.

function evaluateScenarioTotalOfPayments(scenario) {
	//TODO: return a score based on the total of payments. Perhaps a logarithmic scale, base 7 or something.
}
function evaluateScenarioDateCompleted(scenario) {
	//TODO: return a score based on how long the loan will take to be paid off. 0 years = 0, 10 years = 8, 25 years = 10. Logarithmic.
}
function evaluateScenario(scenario) {
	//TODO: return a score based on how well the borrower will be able to manage if they lose their income.
	//This is a score from the monthly payment amounts multiplied by the score from the amount to be forgiven at the end.
}
function evaluateAll(scenario) {
	//TODO: return a combination of all 3 evaluations above. Either multiply or add them together. 
}


//calculateMonthlyMinimum needs to be deleted. It doesn't do what we want it to do. Copy some of the code to elsewhere.
/*function calculateMonthlyMinimum(loan, paymentPlan, totalMonthsRemaining) {
	console.log("calculateMonthlyMinimum()");
	var monthlyInterestPayment = 0;
	var monthlyPrinciplePayment = 0;
	var totalMinimumMonthlyPayment = 0;
	
	/*if(paymentPlan == "standard") {*//*
	//assume standard payment plan
	console.log(loan);
	monthlyPrinciplePayment = loan.startingAmount / 120;
	var rate = loan.rate / 100;
	var irf = rate / 365.25; //assume all months are exact same time length. //Reference: http://www.debtfreeadventure.com/how-student-loan-interest-is-calculated-and-why-it-varies-from-month-to-month/
	monthlyInterestPayment = 30.44 * loan.startingAmount * irf;
	/*} else if(paymentPlan == "ibr") {
		
	} else if(paymentPlan == "icr") {
		
	} else if(paymentPlan == "paye") {
		
	} else if(paymentPlan == "repaye") {
		
	}
	//TODO: Right now, we are just using the standard payment above*//*
	
	totalMinimumMonthlyPayment = monthlyInterestPayment + monthlyPrinciplePayment;
	loan.monthlyMinimumPrinciple = monthlyPrinciplePayment;
	loan.monthlyMinimumInterest = monthlyInterestPayment;
	loan.monthlyAmounts[0].principlePayment = monthlyPrinciplePayment;
	loan.monthlyAmounts[0].interestPayment = monthlyInterestPayment;
	
	console.log(loan);
	console.log("For this loan, the monthly principle payment is " + monthlyPrinciplePayment + " and the monthly interest payment is " + monthlyInterestPayment + 
			" Combined, this is a total monthly minimum payment of " + totalMinimumMonthlyPayment);
	return totalMinimumMonthlyPayment;
}*/

//The 'worst' loan is the one that the user should pay down next
function getWorstLoanIndex(loans, scenario) {
	//console.log("getWorstLoanIndex()");
	var worstLoanIndex = 0;
	
	if(scenario.payoffOrder == "avalanche") {
		//console.log("avalanche");
		var worstLoanRate = 0;
		for(var i=0; i<loans.length; i++) {
			var principleRemaining = loans[i].monthlyAmounts[loans[i].monthlyAmounts.length-1].principleRemaining;
			if( principleRemaining > 0) {
				if( loans[i].rate > worstLoanRate ) {
					worstLoanRate = loans[i].rate;
					worstLoanIndex = i;
				}
			}
		}
	} else { //snowball. find the smallest payment
		//console.log("snowball");
		var worstLoanAmount = 999999999;
		for(var i=0; i<loans.length; i++) {
			var principleRemaining = loans[i].monthlyAmounts[loans[i].monthlyAmounts.length-1].principleRemaining;
			if( principleRemaining > 0) {
				var currentMonth = loans[i].monthlyAmounts[loans[i].monthlyAmounts.length-1];
				var currentMonthlyPayment = (currentMonth.interestPayment + currentMonth.principlePayment);
				if( (currentMonthlyPayment < worstLoanAmount) && (currentMonthlyPayment != 0)) {
					worstLoanAmount = currentMonthlyPayment;
					worstLoanIndex = i;
				}
			}
		}
	}
	console.log("getWorstLoanIndex() is returning worst loan# " + worstLoanIndex);
	return worstLoanIndex;
}

//Find the interest and principle payments that are required this month
function getLoanInterestPayment(currentPrincipleRemaining, monthsRemaining) {
	console.log("getLoanInterestPayment is INCOMPLETE");
	return 50;
}
function getLoanPrinciplePayment(currentPrincipleRemaining, monthsRemaining) {
	console.log("getLoanPrinciplePayment is INCOMPLETE");
	return 100;
}