console.log("dataHandler.js loaded");

var todaysDate = new Date();
var todaysMonth = todaysDate.getMonth()+1;
var todaysYear = todaysDate.getFullYear();

/* DATA STORAGE */
var listLoans = new Array();
var scenario = {};
var future = {};

/* outputs the listLoans variable to the screen */
function displayLoans() {
	//Need to clear out other rows that were made here before
	for( var loanIndex = 0; loanIndex < listLoans.length + 1; loanIndex++ ) {
		var element = document.getElementById("displayLoan" + loanIndex);
		if(element) {
			element.parentNode.removeChild(element);
		}
	}
	
	//insert a dom element to display the new loan
	for( var loanIndex = 0; loanIndex < listLoans.length; loanIndex++ ) { 
		//alert("for index " + loanIndex + " listLoans.length=" + listLoans.length);
		var displayLoanRow = '<div id="displayLoan' + loanIndex + '" class="single-loan-row single-loan-row-locked"> \
			<div class="horizontal-divs loan-amount"> \
		    	<output type="text" id="loanAmount' + loanIndex + '" class="display-loan-output"></output> \
		    	' + listLoans[loanIndex].amount + ' \
	       	</div> \
	       	<div class="horizontal-divs interest-rate-column"> \
        		<output type="text" id="interestRate' + loanIndex + '" class="display-loan-output"></output> \
        		' + listLoans[loanIndex].rate + ' \
        	</div> \
        	<div class="horizontal-divs add-edit-loan-button"> \
        		<button type="button" id="editLoanButton' + loanIndex + '" name="editLoanButton' + loanIndex + '" class="user-input-rectangle loan-edit-button">Edit</button> \
        	</div> \
			</div>';
		document.getElementById("newLoan").insertAdjacentHTML('beforebegin', displayLoanRow);
		
		// Edit button callback. This deletes the loan from the list.
		document.getElementById("editLoanButton" + loanIndex).addEventListener("click", function() {
			var deleteIndex = this.name.slice(-1);
			if(deleteIndex == 0) {
				listLoans.shift();
			} else {
				listLoans.splice(deleteIndex, deleteIndex);
			}
			displayLoans();
		}, false);
	}
}

/* ADD NEW USERDATA */
function addLoan(amount, rate) {
	var newLoan = {'amount': amount, 'rate': rate};
	console.log(newLoan);
	listLoans.push(newLoan);
	//console.log("listLoans[0].amount=" + listLoans[0].amount + "  listLoans[0].rate=" + listLoans[0].rate);
	displayLoans();
	playScenario();
}
function addScenario(inScenario) {
	//TODO: Reformat this json string in file javascript.js event listener for submitButton. Just pass a json object, like normal.
	//console.log("addScenario() incoming scenario (json string) is: " + inScenario);
	var json = JSON.parse(inScenario).scenario;
	//console.log(json);
	
	scenario = json; //save to global var
	playScenario();
}

/* SCENARIO HANDLER */
function playScenario() {
	console.log("------------------------- playScenario()---------------------");
	console.log("scenario is " + JSON.stringify(scenario, null, 2));
	
	future = {"information": {"beginningExtraPayment": Number(scenario.extraMonthlyPaymentAmount), "totalMonthsInPaymentPlan": Number(scenario.totalMonthsRemaining), 
		"extraMonthlyAmountToReachMinimums": 0, "totalInitialPrinciple": 0, "totalInitialMonthlyPayment": 0}, 
		"loans": []};
	
	//initialize all loans
	for(var i=0; i<listLoans.length; i++) {
		//interest rate on autopay
		var interestRate = listLoans[i].rate;
		console.log("Autopay is (string-bool) " + scenario.usingAutopay);
		if(scenario.usingAutopay === "true") {
			interestRate -= 0.25;
			console.log("Autopay has saved 0.25%, and the new interest rate is " + interestRate);
		}
	
		var newLoan = {"rate": interestRate, "startingAmount": listLoans[i].amount, "nextPrinciple": listLoans[i].amount, "month": []};
		console.log("New loan " + JSON.stringify(newLoan, null, 2));
		future.loans.push(newLoan);
		
		//find the initial payment
		var beginningExpectedPaymentLoan = getLoanPaymentInformation(newLoan.startingAmount, newLoan.rate, future.information.totalMonthsInPaymentPlan, 
				scenario.plan, scenario.discretionaryIncome, 0).monthPrinciplePlusInterest;
		future.information.totalInitialMonthlyPayment += beginningExpectedPaymentLoan;
		future.information.totalInitialPrinciple += newLoan.startingAmount;
	}
	
	//Enforce the minimum payment here.
	var expectedMinimumTotalPayment = getExpectedMinimumTotalPayment(scenario.plan); 
	if( future.information.totalInitialMonthlyPayment < expectedMinimumTotalPayment) {
		future.information.extraMonthlyAmountToReachMinimums = expectedMinimumTotalPayment - future.information.totalInitialMonthlyPayment;
		console.log("We need to add " + future.information.extraMonthlyAmountToReachMinimums + " in order to reach the minimum required payment of " + expectedMinimumTotalPayment);
	}
	console.log("The beginning total combined principle is " + future.information.totalInitialPrinciple + 
			" and the beginning monthly expected payment is " + (future.information.totalInitialMonthlyPayment + future.information.extraMonthlyAmountToReachMinimums) +
			" assuming no deferment.");
	
	//Deferment
	var defermentMonthsRemainingCountdown = 0;
	if( scenario.defermentBool === 'true' ) {
		defermentMonthsRemainingCountdown = (scenario.defermentMonth - todaysMonth) + ((scenario.defermentYear - todaysYear) * 12 ); 
	}
	console.log("Number of months from today that we are in deferment is " + defermentMonthsRemainingCountdown);
	console.log("Initialized future. future is " + JSON.stringify(future, null, 2));
	
	//IMPORTANT: Iterate through each month and calculate everything
	var allPaidOff = false;
	var monthNum = 0;
	while(!allPaidOff) {
		allPaidOff = true;
		var totalAmountSpentThisMonth = 0;
		console.log("Beginning computations for month " + monthNum);
		
		// Go through each loan and update it for this month
		for(var j=0; j<future.loans.length; j++) {
			var currentLoan = future.loans[j];
			var currentMonthLoan = getLoanPaymentInformation(currentLoan.nextPrinciple, currentLoan.rate, (future.information.totalMonthsInPaymentPlan - monthNum), 
					scenario.plan, scenario.discretionaryIncome, defermentMonthsRemainingCountdown);		

			
			console.log("Pushing new month-loan " + JSON.stringify(currentMonthLoan, null, 2));
			future.loans[j].month.push(currentMonthLoan);
			var nextPrinciple = currentMonthLoan.beginningPrincipleAmount - currentMonthLoan.monthPrinciple - currentMonthLoan.monthExtraPayment;
			console.log("paid down principle amount is " + nextPrinciple + " = " + currentMonthLoan.beginningPrincipleAmount + " - " + 
					currentMonthLoan.monthPrinciple + " - " + currentMonthLoan.monthExtraPayment);
			future.loans[j].nextPrinciple = nextPrinciple;
			totalAmountSpentThisMonth += currentMonthLoan.monthPrinciplePlusInterest + currentMonthLoan.monthExtraPayment; //extra spent should be zero right now
		}
		
		//Pay extra on loan
		var extraMoney = future.information.totalInitialMonthlyPayment + future.information.beginningExtraPayment + 
				future.information.extraMonthlyAmountToReachMinimums - totalAmountSpentThisMonth;
		console.log("extra money at end of month is " + extraMoney + " = " + future.information.totalInitialMonthlyPayment + " - " + 
				future.information.beginningExtraPayment + " + " + future.information.extraMonthlyAmountToReachMinimums + " - " + totalAmountSpentThisMonth);
		if( future.loans.length > 0 && extraMoney > 0 && defermentMonthsRemainingCountdown <= 0) { 
			var worstLoanIndex = getWorstLoanIndex(future.loans, scenario);
			var worstLoanMonth = future.loans[worstLoanIndex].month[monthNum];
			console.log("worst loan month is " + JSON.stringify(worstLoanMonth, null, 2));
			var principleRemaining = worstLoanMonth.beginningPrincipleAmount - worstLoanMonth.monthPrinciple;
			console.log("principleRemaining = " + principleRemaining + " = " + worstLoanMonth.beginningPrincipleAmount + " - " + worstLoanMonth.monthPrinciple);
			
			//check for rounding errors
			if (principleRemaining < 0.009 ) {
				principleRemaining = 0;
				console.log("In worst payment, rounded the principle remaining on this loan to zero.");
			}
			
			//Pay down the principle
			console.log("if (principle remaining = " + principleRemaining + " > " + extraMoney + " = extraMoney )");
			if( principleRemaining > extraMoney) {
				worstLoanMonth.monthExtraPayment = extraMoney; 
			} else { //only a small amount remaining
				worstLoanMonth.monthExtraPayment = principleRemaining; //math wrong?? worstLoanMonth.monthPrincipleAmount - worstLoanMonth.beginningPrinciple;
				console.log("There is only a small amount remaining, $" + worstLoanMonth.monthExtraPayment + " We're paying off the entirety now, even though we have " + extraMoney + " available to spend.");
			}
			console.log("The worst loan is loan# " + worstLoanIndex + " We paid $" + worstLoanMonth.monthExtraPayment + " to the loan, and the principle is now " + (principleRemaining - worstLoanMonth.monthExtraPayment));
		}
		
		//Set up the principle amount for the next month
		for(var j=0; j<future.loans.length; j++) {
			var currentMonthLoan = future.loans[j].month[monthNum];
			console.log("current month loan for finding next month principle is " + JSON.stringify(currentMonthLoan, null, 2));
			var nextMonthPrincipleRemaining = currentMonthLoan.beginningPrincipleAmount - currentMonthLoan.monthPrinciple - currentMonthLoan.monthExtraPayment;
			if(nextMonthPrincipleRemaining < 0.009) { nextMonthPrincipleRemaining = 0; }
			future.loans[j].nextPrinciple = nextMonthPrincipleRemaining;
			console.log("next month principle is " + nextMonthPrincipleRemaining + " = " + currentMonthLoan.beginningPrincipleAmount + " - " + currentMonthLoan.monthPrinciple + " - " + currentMonthLoan.monthExtraPayment);
			
			//Are all the loans paid off?
			if( nextMonthPrincipleRemaining > 0 ) {
				allPaidOff = false;
			}
		}
		
		console.log(future);
		console.log("Intermediate future after month " + monthNum + " is " + JSON.stringify(future, null, 2));
		monthNum += 1;
		defermentMonthsRemainingCountdown -= 1; //decrement deferment

		//debugging, only see first few months:
		//if(monthNum >= 2) {break;}
		//alert("month " + monthNum);
	}
			
	console.log("Complete future is " + JSON.stringify(future, null, 2));
	
	displayFuture(future);
}
/*function playScenarioOld() {
	console.log("------------------------- playScenario()---------------------");
	console.log("scenario is " + JSON.stringify(scenario, null, 2));
	
	future = {};
	future = {"information": {}, "loans": [], "totalMonthlyPayment": [], "totalMonthlyPaymentAboveMinimums": []};
	future.information.totalMonthsInPaymentPlan = scenario.totalMonthsRemaining;
	future.totalMonthlyPaymentAboveMinimums[0] = Number(scenario.extraMonthlyPaymentAmount);
	future.totalMonthlyPayment[0] = Number(future.totalMonthlyPaymentAboveMinimums[0]);
	
	
	//initialize all loans
	for(var i=0; i<listLoans.length; i++) {
		//interest rate on autopay
		var interestRate = listLoans[i].rate;
		console.log("Autopay is (string-bool) " + scenario.usingAutopay);
		if(scenario.usingAutopay === "true") {
			interestRate -= 0.25;
			console.log("Autopay has saved 0.25%, and the new interest rate is " + interestRate);
		}
		
		var newLoan = {"rate": interestRate, "startingAmount": listLoans[i].amount, 
				"monthlyAmounts": [{"principleRemaining": listLoans[i].amount, "principlePayment": 0, "interestPayment": 0}]};
		newLoan.monthlyAmounts[0].principlePayment = getLoanPrincipleMinimumPayment(newLoan.monthlyAmounts[0].principleRemaining, future.information.totalMonthsInPaymentPlan, scenario.plan, newLoan.rate);
		newLoan.monthlyAmounts[0].interestPayment = getLoanInterestMinimumPayment(newLoan.monthlyAmounts[0].principleRemaining, future.information.totalMonthsInPaymentPlan, scenario.plan, newLoan.rate);
		future.loans.push(newLoan);
		console.log("Inserting new loan " + JSON.stringify(newLoan, null, 2));
		
		//increment the total payment. This may not be the best place for this code, init scenario?
		future.totalMonthlyPayment[0] += Number(newLoan.monthlyAmounts[0].principlePayment) + Number(newLoan.monthlyAmounts[0].interestPayment);
	}
	console.log("Initialized loans. future is " + JSON.stringify(future, null, 2));
	
	//Deferment
	var defermentMonthsRemainingCountdown = 0;
	if( scenario.defermentBool === 'true' ) {
		defermentMonthsRemainingCountdown = (scenario.defermentMonth - todaysMonth) + ((scenario.defermentYear - todaysYear) * 12 ); 
	}
	console.log("Number of months from today that we are in deferment is " + defermentMonthsRemainingCountdown);
	
	//IMPORTANT: Iterate through each month and calculate everything
	var allPaidOff = false;
	var monthNum = 0;
	while(!allPaidOff) {
		monthNum += 1;
		allPaidOff = true;
		console.log("Beginning computations for month " + monthNum);
		
		var moneyRemainingThisMonth = future.totalMonthlyPayment[monthNum-1];
		future.totalMonthlyPayment.push(Number(moneyRemainingThisMonth)); //carry monthly payment into next month. TODO: allow payments to vary over time.
		
		// Go through each loan and update it for this month
		for(var j=0; j<future.loans.length; j++) {
			var currentMonthLoanInfo = future.loans[j].monthlyAmounts[future.loans[j].monthlyAmounts.length-1];
			var nextMonthLoanInfo = {"principleRemaining": 0, "principlePayment": 0, "interestPayment": 0};
			future.loans[j].monthlyAmounts.push(nextMonthLoanInfo);
			
			// Already paid off this loan
			if( currentMonthLoanInfo.principleRemaining === 0) {
				continue;
			}
			
			// Deferment
			if( defermentMonthsRemainingCountdown > 0 ) {
				console.log("Number of months remaining in deferment is " + defermentMonthsRemainingCountdown);
				//nextMonthLoanInfo.principleRemaining = Number(currentMonthLoanInfo.principleRemaining) + Number(currentMonthLoanInfo.interestPayment); //TODO: Capitalization event. Interest is stored separately, then added in a capitalization event.
				nextMonthLoanInfo.principleRemaining = currentMonthLoanInfo.principleRemaining; //See previous todo about capitalization. This assumes a subsidized loan. 
				defermentMonthsRemainingCountdown -= 1;
				console.log("Month " + monthNum + " is in deferment. current principle is " + currentMonthLoanInfo.principleRemaining + " and money remaining is " + moneyRemainingThisMonth);
			}
			
			// $50 minimum
			else if ( (currentMonthLoanInfo.principlePayment + currentMonthLoanInfo.interestPayment) < 50 ) {
				currentMonthLoanInfo.principlePayment = 50 - currentMonthLoanInfo.interestPayment;
				if( currentMonthLoanInfo.principlePayment > currentMonthLoanInfo.principleRemaining ) {
					currentMonthLoanInfo.principlePayment = currentMonthLoanInfo.principleRemaining;
				}
				
				// generate the next month's info
				nextMonthLoanInfo.principleRemaining = currentMonthLoanInfo.principleRemaining - currentMonthLoanInfo.principlePayment;
				
				console.log("The expected payment was less than the $50 minimum payment. Bumped the payment up to $50. Next month's principle remaining is " + nextMonthLoanInfo.principleRemaining);
			}
			
			// Pay the minimums here
			else if( (currentMonthLoanInfo.principleRemaining > currentMonthLoanInfo.principlePayment) && (defermentMonthsRemainingCountdown <= 0) ) {
				nextMonthLoanInfo.principleRemaining = currentMonthLoanInfo.principleRemaining - currentMonthLoanInfo.principlePayment;
				console.log("Paid the minimum. The principle remaining now is " + nextMonthLoanInfo.principleRemaining + " We did pay down the principle by " + currentMonthLoanInfo.principlePayment);
			} 
			
			//rounding errors
			if( nextMonthLoanInfo.principleRemaining > 0.0 && nextMonthLoanInfo.principleRemaining < 0.009) {
				console.log("We have a rounding error. This loan has nothing remaining.");
				nextMonthLoanInfo.principleRemaining = 0;
				nextMonthLoanInfo.principlePayment = 0;
				nextMonthLoanInfo.interestPayment = 0;
			}
			
			// Not finished paying off loans, reset bool
			if(nextMonthLoanInfo.principleRemaining > 0) {
				allPaidOff = false;
			}
			
			// How much do we owe next month?
			//console.log("arg 2 is " + (future.information.totalMonthsInPaymentPlan-monthNum));
			nextMonthLoanInfo.principlePayment = getLoanPrincipleMinimumPayment(nextMonthLoanInfo.principleRemaining, future.information.totalMonthsInPaymentPlan-monthNum, scenario.plan, future.loans[j].rate); //monthNum off by 1?
			nextMonthLoanInfo.interestPayment = getLoanInterestMinimumPayment(nextMonthLoanInfo.principleRemaining, future.information.totalMonthsInPaymentPlan-monthNum, scenario.plan, future.loans[j].rate); //monthNum off by 1?
			console.log("pushing next month loan " + JSON.stringify(nextMonthLoanInfo, null, 2) + "\n to future.loans.monthlyAmounts " + JSON.stringify(future.loans[j].monthlyAmounts, null, 2));
		}
		
		/* //apply leftover money to the worst loan
		if( (moneyRemainingThisMonth > 0) && (future.loans.length > 0)) {
			var worstLoanIndex = getWorstLoanIndex(future.loans, scenario);
			var worstLoan = future.loans[worstLoanIndex].monthlyAmounts[future.loans[worstLoanIndex].monthlyAmounts.length-1];
			if(worstLoan.principleRemaining > 1) { //necessary because the function getWorstLoanIndex can't return no result. 1 instead of 0, for rounding.
				worstLoan.principleRemaining -= moneyRemainingThisMonth;
				console.log("The worst loan is loan# " + worstLoanIndex + " We paid all the remaining money $" + moneyRemainingThisMonth + " to the loan, and the principle is now " + worstLoan.principleRemaining);
				moneyRemainingThisMonth -= moneyRemainingThisMonth;
			}
		}* /
		
		//error checking. leftover=$0
		console.log("leftover money this month is " + moneyRemainingThisMonth + " (should be $0)");
		if(moneyRemainingThisMonth < 0) {console.log("ERROR!! We are left with a negative amount of money this month!");}
		
		console.log("Intermediate future after month " + monthNum + " is " + JSON.stringify(future, null, 2));
	}
	
	console.log(future);
	console.log("Complete future is " + JSON.stringify(future, null, 2));
	
	displayFuture(future);
}*/