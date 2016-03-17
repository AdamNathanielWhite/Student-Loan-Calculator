console.log("test.js loaded");


/*//TEST LOAN MONTHLY PAYMENTS
var currentPrincipleRemaining = 100000;
var monthsRemaining = 120;
var paymentPlan = "standard";
var interestRate = 6;

function testGetLoanInterestMinimumPayment () {
	console.log("--Testbench for getLoanInterestMinimumPayment() --");
	console.log("Inputs to getLoanInterestMinimumPayment are: \n" +
			"principle is " + currentPrincipleRemaining + "\n" +
			"months remaining is " + monthsRemaining + "\n" +
			"payment plan is " + paymentPlan + "\n" +
			"interest rate is " + interestRate + "\n");
	
	var monthlyInterestPayment = getLoanInterestMinimumPayment(currentPrincipleRemaining, monthsRemaining, paymentPlan, interestRate);
	
	console.log("interest payment returned is " + monthlyInterestPayment);
}
function testGetLoanPrincipleMinimumPayment () {
	console.log("--Testbench for getLoanPrincipleMinimumPayment() --");
	console.log("Inputs to getLoanPrincipleMinimumPayment are: \n" +
			"principle is " + currentPrincipleRemaining + "\n" +
			"months remaining is " + monthsRemaining + "\n" +
			"payment plan is " + paymentPlan + "\n" +
			"interest rate is " + interestRate + "\n");
	
	var monthlyPrinciplePayment = getLoanPrincipleMinimumPayment(currentPrincipleRemaining, monthsRemaining, paymentPlan, interestRate);
	
	console.log("principle payment returned is " + monthlyPrinciplePayment);
}
function testCombinedMinimumPayment() {
	var principlePayment = getLoanPrincipleMinimumPayment(currentPrincipleRemaining, monthsRemaining, paymentPlan, interestRate);
	var interestPayment = getLoanInterestMinimumPayment(currentPrincipleRemaining, monthsRemaining, paymentPlan, interestRate);
	var combinedPayment = principlePayment + interestPayment;
	console.log("Combined minimum payment is $" + combinedPayment);
}

testGetLoanInterestMinimumPayment();
testGetLoanPrincipleMinimumPayment();
testCombinedMinimumPayment();
*/