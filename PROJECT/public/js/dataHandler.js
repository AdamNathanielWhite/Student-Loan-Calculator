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
	
	future = {"information": {}, "loans": [], "totalMonthlyPayment": [], "totalMonthlyPaymentAboveMinimums": []};
	future.information.totalMonthsInPaymentPlan = scenario.totalMonthsRemaining;
	future.totalMonthlyPaymentAboveMinimums[0] = Number(scenario.extraMonthlyPaymentAmount);
	future.totalMonthlyPayment[0] = Number(future.totalMonthlyPaymentAboveMinimums[0]);
	
	
	//initialize all loans
	for(var i=0; i<listLoans.length; i++) {
		var newLoan = {"rate": listLoans[i].rate, "startingAmount": listLoans[i].amount, 
				"monthlyAmounts": [{"principleRemaining": listLoans[i].amount, "principlePayment": 0, "interestPayment": 0}]};
		newLoan.monthlyAmounts[0].principlePayment = getLoanPrinciplePayment(newLoan.monthlyAmounts[0].principleRemaining, future.information.totalMonthsInPaymentPlan);
		newLoan.monthlyAmounts[0].interestPayment = getLoanInterestPayment(newLoan.monthlyAmounts[0].principleRemaining, future.information.totalMonthsInPaymentPlan);
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
			
			// Deferment
			if( defermentMonthsRemainingCountdown > 0 ) {
				console.log("Number of months remaining in deferment is " + defermentMonthsRemainingCountdown);
				nextMonthLoanInfo.principleRemaining = Number(currentMonthLoanInfo.principleRemaining) + Number(currentMonthLoanInfo.interestPayment); //TODO: Capitalization event. Interest is stored separately, then added in a capitalization event. 
				defermentMonthsRemainingCountdown -= 1;
				console.log("Month " + monthNum + " is in deferment. current principle is " + currentMonthLoanInfo.principleRemaining + " and money remaining is " + moneyRemainingThisMonth);
			}
			
			// Pay the minimums here
			else if( (currentMonthLoanInfo.principleRemaining > currentMonthLoanInfo.principlePayment) && (defermentMonthsRemainingCountdown <= 0) ) {
				moneyRemainingThisMonth -= Number(currentMonthLoanInfo.principlePayment);
				moneyRemainingThisMonth -= Number(currentMonthLoanInfo.interestPayment);
				
				// generate the next month's info
				nextMonthLoanInfo.principleRemaining = currentMonthLoanInfo.principleRemaining - currentMonthLoanInfo.principlePayment;
				console.log("Paid the minimum. The principle remaining now is " + nextMonthLoanInfo.principleRemaining + " We did pay down the principle by " + currentMonthLoanInfo.principlePayment);
			} 
			
			// Small amount of money remaining on this loan. This is the final payment before the loan is completely paid off
			else if ( (currentMonthLoanInfo.principleRemaining > 0) && (defermentMonthsRemainingCountdown <= 0) )  { 
				moneyRemainingThisMonth -= Number(currentMonthLoanInfo.principlePayment);
				moneyRemainingThisMonth -= Number(currentMonthLoanInfo.interestPayment);
				
				// generate the next month's info
				nextMonthLoanInfo.principleRemaining = currentMonthLoanInfo.principleRemaining - currentMonthLoanInfo.principlePayment; //now $0. //TODO: problems with floats?? 0!=0
				console.log("Paid the minimum, which was the final payment. We did pay down the principle by " + currentMonthLoanInfo.principlePayment);
			}
			
			// Not finished paying off loans, reset bool
			if(nextMonthLoanInfo.principleRemaining > 0) {
				allPaidOff = false;
			}
			
			// How much do we owe next month?
			nextMonthLoanInfo.principlePayment = getLoanPrinciplePayment(currentMonthLoanInfo.principleRemaining, future.information.totalMonthsInPaymentPlan-monthNum); //monthNum off by 1?
			nextMonthLoanInfo.interestPayment = getLoanInterestPayment(currentMonthLoanInfo.principleRemaining, future.information.totalMonthsInPaymentPlan-monthNum); //monthNum off by 1?
			future.loans[j].monthlyAmounts.push(nextMonthLoanInfo);
			console.log("pushing next month loan " + JSON.stringify(nextMonthLoanInfo, null, 2) + "\n to future.loans.monthlyAmounts " + JSON.stringify(future.loans[j].monthlyAmounts, null, 2));
		}
		
		//apply leftover money to the worst loan
		if( (moneyRemainingThisMonth > 0) && (future.loans.length > 0)) {
			var worstLoanIndex = getWorstLoanIndex(future.loans, scenario);
			var worstLoan = future.loans[worstLoanIndex].monthlyAmounts[future.loans[worstLoanIndex].monthlyAmounts.length-1];
			if(worstLoan.principleRemaining > 0) { //necessary because the function getWorstLoanIndex can't return no result.
				worstLoan.principleRemaining -= moneyRemainingThisMonth;
				console.log("The worst loan is loan# " + worstLoanIndex + " We paid all the remaining money $" + moneyRemainingThisMonth + " to the loan, and the principle is now " + worstLoan.principleRemaining);
				moneyRemainingThisMonth -= moneyRemainingThisMonth;
			}
		}
		
		//error checking. leftover=$0
		console.log("leftover money this month is " + moneyRemainingThisMonth + " (should be $0)");
		if(moneyRemainingThisMonth < 0) {console.log("ERROR!! We are left with a negative amount of money this month!");}
		
		console.log("Intermediate future after month " + monthNum + " is " + JSON.stringify(future, null, 2));
	}
	
	console.log(future);
	console.log("Complete future is " + JSON.stringify(future, null, 2));
	
	displayFuture(future);
}