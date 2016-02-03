(function(){
	/*
	//delete this below
	document.getElementById("button").addEventListener("click", function(){
		first = parseInt(document.getElementById("first").value);
		second = parseInt(document.getElementById("second").value);
		
		sum = first + second;
		
		document.getElementById("result").innerHTML = sum;
	});*/
	
	//document.getElementById("debug").innerHTML = "hey!";
	
	
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
}());