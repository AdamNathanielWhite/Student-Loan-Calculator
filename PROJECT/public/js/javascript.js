/* --- MANIPULATING HTML ELEMENTS ON THE PAGE. hide things, show data, etc --- */
document.getElementById("refinanceCheckbox").addEventListener("click", function(){
	if(document.getElementById("refinanceCheckbox").checked) {
		document.getElementById("refinanceOptionDiv").hidden = false;
	} else {
		document.getElementById("refinanceOptionDiv").hidden = true;
	}
}, false);
document.getElementById("forgivenessCheckbox").addEventListener("click", function(){
	if(document.getElementById("forgivenessCheckbox").checked) {
		document.getElementById("loanForgivenessHiddenInput").hidden = false;
		document.getElementById("loanForgivenessHiddenInputInverse").hidden = true;
	} else {
		document.getElementById("loanForgivenessHiddenInput").hidden = true;
		document.getElementById("loanForgivenessHiddenInputInverse").hidden = false;
	}
}, false);


/* --- LOAN INPUT --- */
document.getElementById("submitLoanButton").addEventListener("click", function(){
	//alert("submitLoanButton event");
	// Create loan object and add it to the data structure list of loans
	var newLoanAmount = document.getElementById("loanAmountInput").value;
	var newLoanRate = document.getElementById("interestRateInput").value;
	
	//TODO: sanitize inputs. not blank, no spaces, negative, rate is within normal bounds
	
	addLoan(newLoanAmount, newLoanRate); 
}, false);


/* --- UPDATING AND SUBMITTING INPUTS --- */
// submitButton sends all inputs to the dataHandler 
document.getElementById("submitButton").addEventListener("click", function() {
	//Pull input values from the html document 
	var plan = document.getElementById("planType").value;
	var completedMonth = document.getElementById("completedMonth").value;
	var completedYear = document.getElementById("completedYear").value;
	var defermentBool = document.getElementById("defermentCheck").value;
	var defermentMonth = document.getElementById("defermentMonth").value;
	var defermentYear = document.getElementById("defermentYear").value;
	var income = document.getElementById("income").value;
	var stateResidency = document.getElementById("stateResidency").value;
	var forgivenessCheckbox = document.getElementById("forgivenessCheckbox").value;
	var forgivenessYears = document.getElementById("forgivenessYears").value;
	var extraPaymentOption = document.querySelector('input[name="extraPaymentGroup"]:checked').value; //See http://stackoverflow.com/a/15839451/2312949
	var extraMonthlyPaymentAmount = document.getElementById("extraMonthlyPaymentAmount").value;
	var refinanceCheckbox = document.getElementById("refinanceCheckbox").value;
	var refinanceAmount = document.getElementById("refinanceAmount").value;
	var nYearsRefinance = document.getElementById("nYearsRefinance").value;
	var refinanceInterestRate = document.getElementById("refinanceInterestRate").value;
	var usingAutopay = document.getElementById("usingAutopay").value;
	var payOffOrder = document.getElementById("payOffOrder").value;
	var newRepaymentPlan = document.getElementById("newRepaymentPlan").value;
	
	//TODO: Check these inputs. no negative numbers, text in numbers, blank, etc.
	
	//Put these values into a scenario object
	//TODO: These values above need to be put into a scenario object and stored in the data handler. 
	//      I'm pausing this work here, because other unrelated things are due in senior design class soon.
}, false);