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
	console.log("scenario is " + JSON.stringify(scenario));
	
	future = {"information": {}, "loans": []};
	for(var i=0; i<listLoans.length; i++) {
		var newLoan = {"rate": listLoans[i].rate, "startingAmount": listLoans[i].amount, "monthlyMinimumPrinciple": 0, "monthlyMinimumInterest": 0,
				"monthlyAmounts": [{"principleRemaining": listLoans[i].amount, "principlePayment": 0, "interestPayment": 0}]};
		calculateMonthlyMinimum(newLoan, scenario.plan, scenario.totalMonthsRemaining);
		future.loans.push(newLoan);
		console.log("Inserting new loan " + JSON.stringify(newLoan, null, 2));
	}
	
	//Deferment
	var defermentMonthsRemainingCountdown = 0;
	if( scenario.defermentBool == true) {
		defermentMonthsRemainingCountdown = (scenario.defermentMonth - todaysMonth) + ((scenario.defermentYear - todaysYear) * 12 ); 
	}
	
	//IMPORTANT: Iterate through each month and calculate everything
	var allPaidOff = false;
	var monthNum = 1;
	console.log("before while loop. future is " + JSON.stringify(future, null, 2));
	/*while(!allPaidOff) {
		//TODO: Iterate through a month here
		for each loan in future.loans[]
	}*/
	
	console.log(future);
}
