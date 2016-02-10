

/* --- CHECKBOXES TOGGLE HIDDEN CONTENT --- */
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


/* --- INPUTTING NEW LOANS --- */
document.getElementById("submitLoanButton").addEventListener("click", function(){
	// Create loan object and add it to the data structure list of loans
	var newLoanAmount = document.getElementById("loanAmount").value;
	var newLoanRate = document.getElementById("interestRate").value;
	addLoan(newLoanAmount, newLoanRate); 
}, false);