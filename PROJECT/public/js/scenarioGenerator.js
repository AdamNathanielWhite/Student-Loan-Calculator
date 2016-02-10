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