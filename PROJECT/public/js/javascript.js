(function(){
	document.getElementById("button").addEventListener("click", function(){
		first = parseInt(document.getElementById("first").value);
		second = parseInt(document.getElementById("second").value);
		
		sum = first + second;
		
		document.getElementById("result").innerHTML = sum;
	});
}());