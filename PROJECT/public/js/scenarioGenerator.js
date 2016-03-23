console.log("scenarioGenerator.js loaded");

//The 'worst' loan is the one that the user should pay down next
function getWorstLoanIndex(loans, scenario) {
	//console.log("getWorstLoanIndex()");
	var worstLoanIndex = 0;
	
	//avalanche. pay down the largest rate first
	if(scenario.payOffOrder == "avalanche") { 
		var worstLoanRate = 0;
		for(var i=0; i<loans.length; i++) {
			var principleRemaining = loans[i].month[loans[i].month.length-1].beginningPrincipleAmount;
			if( principleRemaining > 0.009) {
				if( loans[i].rate > worstLoanRate ) {
					worstLoanRate = loans[i].rate;
					worstLoanIndex = i;
					//alert("worstLoanIndex is now" + worstLoanIndex);
				}
			}
			//alert("principleRemaining=" + principleRemaining + " worstLoanRate=" + worstLoanRate + " i=" + i + " worstLoanIndex=" + worstLoanIndex);
		}
		console.log("avalanche. worst loan rate is " + worstLoanRate);
	}	
	
	//snowball. pay down the smallest remaining principle first
	else {
		var worstLoanAmount = 999999999;
		for(var i=0; i<loans.length; i++) {
			var principleRemaining = loans[i].month[loans[i].month.length-1].beginningPrincipleAmount;
			if( principleRemaining > 0.009) {
				var currentMonth = loans[i].month[loans[i].month.length-1];
				var currentPrinciple = (currentMonth.monthInterest + currentMonth.monthPrinciple);
				if( (currentPrinciple < worstLoanAmount) && (currentPrinciple > 0)) {
					worstLoanAmount = currentPrinciple;
					worstLoanIndex = i;
					//alert("worstLoanIndex is now" + worstLoanIndex);
				}
			}
			//alert("principleRemaining=" + principleRemaining + " worstLoanAmount=" + worstLoanAmount + " i=" + i + " worstLoanIndex=" + worstLoanIndex);
		}
		console.log("snowball. worst loan amount is " + worstLoanAmount);
	}
	console.log("getWorstLoanIndex() is returning worst loan# " + worstLoanIndex);
	return worstLoanIndex;
}

// Determine the minimum allowed amount under the user's plan
function getExpectedMinimumTotalPayment(plan, paymentsAt10PercentDiscretionaryIncome, paymentsAt15PercentDiscretionaryIncome) {
	
	//SEE THESE WEBSITES FOR INFORMATION ON EACH PLAN: 
	//http://www.finaid.org/loans/repayment.phtml
	//https://studentaid.ed.gov/sa/repay-loans/understand/plans/income-driven#monthly-payments
	
	var standardPayment = 0;
	for(var i; i<future.loans.length; i++) {
		var loan = future.loans[i];
		var ratePerMonthlyPeriod = (future.loans[i].rate / 100) / 12;
		standardPayment +=loanPayment.monthPrinciplePlusInterest = future.loans[i].startingAmount / ((1-(1/Math.pow((1+ratePerMonthlyPeriod), monthsRemaining)))/ratePerMonthlyPeriod);
	}
	standardPayment = Math.max(standardPayment, 50);
	console.log("The standard payment is " + standardPayment);
	
	if(plan === "standard") {
		return standardPayment;
	} else if(plan === "ibr") {
		return Math.min( paymentsAt15PercentDiscretionaryIncome, standardPayment);
	} else if(plan === "icr") {
		var twelveYearStandard = 0;
		for(var i; i<future.loans.length; i++) {
			var ratePerMonthlyPeriod = (future.loans[i].rate / 100) / 12;
			twelveYearStandard += future.loans[i].startingAmount / ((1-(1/Math.pow((1+ratePerMonthlyPeriod), 144)))/ratePerMonthlyPeriod);
		}
		return Math.min( (paymentsAt10PercentDiscretionaryIncome * 2), twelveYearStandard);
	} else if(plan === "paye") {
		return Math.min(paymentsAt10PercentDiscretionaryIncome, standardPayment);
	} else if(plan === "repaye") {
		return paymentsAt10PercentDiscretionaryIncome;
	} else {
		console.log("ERROR: The payment plan was not in the list. string is " + plan);
		return standardPayment;
	}
}

function getLoanPaymentInformation(currentPrincipleRemaining, interestRate, monthsRemaining, paymentPlan, defermentMonthsRemainingCountdown) {
	
	var loanPayment = {"beginningPrincipleAmount": currentPrincipleRemaining, "monthPrinciplePlusInterest": 0, "monthPrinciple": 0, "monthInterest": 0, 
			"monthMinimumPayment": 0, "monthExtraPayment": 0};
	
	//check if this loan is paid off
	if (currentPrincipleRemaining < 0.009 ) { //approximate zero for rounding errors
		loanPayment.currentPrincipleRemaining = 0;
		return loanPayment;
	}
	
	//Past expiration date for loan
	if (monthsRemaining <= 0) {
		if(currentPrincipleRemaining > 0) {
			console.log("ERROR?? This loan is past its expiration date, but there is still $" + currentPrincipleRemaining + " left!!");
		}
		console.log("This loan is past its expiration date. It is forgiven.");
		return loanPayment;
	}
	
	//Find total payment
	var ratePerMonthlyPeriod = (interestRate / 100) / 12; //We are assuming all months are exact same time length. //Reference: http://www.debtfreeadventure.com/how-student-loan-interest-is-calculated-and-why-it-varies-from-month-to-month/
	loanPayment.monthPrinciplePlusInterest = currentPrincipleRemaining / ((1-(1/Math.pow((1+ratePerMonthlyPeriod), monthsRemaining)))/ratePerMonthlyPeriod);
	
	//Find the interest this month
	//var irf = ratePerMonthlyPeriod / 365.25;
	loanPayment.monthInterest = currentPrincipleRemaining * ratePerMonthlyPeriod;
	
	//Find the principle expected payment this month
	loanPayment.monthPrinciple = loanPayment.monthPrinciplePlusInterest - loanPayment.monthInterest;
	console.log("principle=" + loanPayment.monthPrinciple);
	
	console.log("getLoanPaymentInformation() Based on the inputs: " + 
			"\ncurrentPrincipleRemaining=" + currentPrincipleRemaining + 
			"\n interestRate=" + interestRate + 
			"\n monthsRemaining=" + monthsRemaining + 
			"\n paymentPlan=" + paymentPlan + 
			"\n defermentMonthsRemainingCountdown=" + defermentMonthsRemainingCountdown + 
			"\n The monthly output is: \n" + JSON.stringify(loanPayment, null, 2));
	return loanPayment;
}