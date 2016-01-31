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
	
	document.getElementById("refinanceCheckbox").addEventListener("click", function(){
		if(document.getElementById("refinanceCheckbox").checked) {
			document.getElementById("refinanceOptionDiv").hidden = false;
			//document.getElementById("debug").innerHTML = "hey!";
		} else {
			document.getElementById("refinanceOptionDiv").hidden = true;
		}
	}, false);
}());