function updateScroll(){
    var element = document.getElementById("chat");
    element.scrollTop = element.scrollHeight;
}
setInterval("updateScroll",1000);

$(document).ready(function(){
	$("#xButton").click(function(){
	        $("#chatWrap").slideUp();
			$("#privateOption").slideUp();

	});
	$("#openButton").click(function(){
	        $("#chatWrap").slideDown();
			$("#privateOption").slideDown();
	});

});