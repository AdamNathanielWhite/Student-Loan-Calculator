/* LOAN DATA STORAGE */
var listLoans = new Array();

//outputs the listLoans variable to the screen
function displayLoans() {
	//TODO:
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