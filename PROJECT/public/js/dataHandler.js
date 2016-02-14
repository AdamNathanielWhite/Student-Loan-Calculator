/* LOAN DATA STORAGE */
var listLoans = new Array();

//outputs the listLoans variable to the screen
function displayLoans() {
	//Need to clear out other rows that were made here before
	for( var loanIndex = 0; loanIndex < listLoans.length + 1; loanIndex++ ) {
		var element = document.getElementById("displayLoan" + loanIndex);
		if(element) {
			element.parentNode.removeChild(element);
		}
	}
	
	TODO: YOU NEED TO CONNECT THESE ELEMENTS TO THEIR CALLBACKS
	//insert a dom element to display the new loan
	for( var loanIndex = 0; loanIndex < listLoans.length; loanIndex++ ) { 
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
        		<button type="button" id="editLoanButton' + loanIndex + '" class="user-input-rectangle loan-edit-button">Edit</button> \
        	</div> \
			</div>';
		document.getElementById("newLoan").insertAdjacentHTML('beforebegin', displayLoanRow);
	}
}

//insert a new loan
function addLoan(amount, rate) {
	var newLoan = {'amount': amount, 'rate': rate};
	listLoans.push(newLoan);
	//alert("listLoans[0].amount=" + listLoans[0].amount + "  listLoans[0].rate=" + listLoans[0].rate);
	displayLoans();
}

//Remove a loan from the list. This is used when 'edit' is clicked on the loan.
function removeLoan(index) {
	//TODO:
		
	displayLoans();
}