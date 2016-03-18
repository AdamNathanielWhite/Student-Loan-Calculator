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
function getLoanInterestMinimumPayment(currentPrincipleRemaining, monthsRemaining, paymentPlan, interestRate) {
	//TODO: delete the input monthsRemaining. it isn't used.
	console.log("getLoanInterestMinimumPayment() Inputs are: " + currentPrincipleRemaining + "  " + monthsRemaining + "  " + paymentPlan + "  " + interestRate);
	var interestPayment = 0;
	
	//check if this loan is paid off
	if (currentPrincipleRemaining === 0 ) {
		return 0;
	}
	
	//console.log("type of payment plan is " + typeof(paymentPlan) + " payment plan is " + paymentPlan);
	if(paymentPlan === "standard") {
		var rate = interestRate / 100;
		var irf = rate / 365.25; //We are assuming all months are exact same time length. //Reference: http://www.debtfreeadventure.com/how-student-loan-interest-is-calculated-and-why-it-varies-from-month-to-month/
		interestPayment = 30.44 * currentPrincipleRemaining * irf;
	} else if(paymentPlan === "ibr") {
		
	} else if(paymentPlan === "icr") {
		
	} else if(paymentPlan === "paye") {
		
	} else if(paymentPlan === "repaye") {
		
	}
	
	return interestPayment;
}
function getLoanPrincipleMinimumPayment(currentPrincipleRemaining, monthsRemaining, paymentPlan, interestRate) {
	console.log("getLoanPrincipleMinimumPayment()");
	console.log("getLoanPrincipleMinimumPayment() Inputs are: " + currentPrincipleRemaining + "  " + monthsRemaining + "  " + paymentPlan + "  " + interestRate);
	
	//check if this loan is paid off
	if (currentPrincipleRemaining === 0 ) {
		return 0;
	}
	
	var principlePayment = 0;
	var ratePerMonthlyPeriod = (interestRate / 100) / 12;
	//To calculate the current payment, use this formula:  PV  /  [(1- (1 / (1 + i)n )) / i]    //Source: https://answers.yahoo.com/question/index?qid=20080822070859AAY94ZT
	//                                                     ^^^^^^^ THIS IS IMPORTANT ^^^^^^^
	
	if(paymentPlan === "standard") {
		//wrong, but close approximation: //principlePayment = currentPrincipleRemaining / monthsRemaining
		var totalPayment = currentPrincipleRemaining / ((1-(1/Math.pow((1+ratePerMonthlyPeriod), monthsRemaining)))/ratePerMonthlyPeriod);
		principlePayment = totalPayment - getLoanInterestMinimumPayment(currentPrincipleRemaining, monthsRemaining, paymentPlan, interestRate);
		//TODO: major speed problem. We shouldn't have to call getLoanInterestMinimumPayment here. Parent function also calls this.
	} else if(paymentPlan === "ibr") {
		
	} else if(paymentPlan === "icr") {
		
	} else if(paymentPlan === "paye") {
		
	} else if(paymentPlan === "repaye") {
		
	}
	
	return principlePayment;
}