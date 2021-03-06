$(document).ready(function(){
	var saved = "";
	$(".left").click(function() {
		window.onbeforeunload = null;
		return false;
	});
	$("#save_page_btn, #remove_btn").click(function() {
		switch($(this).attr("id")) {
			case "save_page_btn":
				$("#page_loader").fadeIn(300);
				
				$.cryptAjax({
					url: "common/include/funcs/_ajax/decrypt.php",
					dataType: "json",
					type: "POST",
					data: {
						jCryption: $.jCryption.encrypt($("#editor_frm").serialize(), password),
						type: "save_page"
					},
					success: function(response) {
						if (response["data"] !== "ok") {
							var risp = response["data"].split("::");
							if(risp[0] == "error") {
								alert("Si &egrave; verificato un errore durante il salvataggio:\n" + risp[1], {icon: "error", title: "Ouch!"});
							}
						} else {
							$("#page_loader").fadeOut(300);
							$("#original_name").val($("#config_name").val());
							$("#remove_btn").attr("disabled", false);
							alert("Questa pagina &egrave; stata salvata con successo.", {icon: "success", title: "File aggiunto"});
						}
					}
				});
				break;
			case "remove_btn":
				$.cryptAjax({
					url: "common/include/funcs/_ajax/decrypt.php",
					dataType: "json",
					type: "POST",
					data: {
						jCryption: $.jCryption.encrypt($("#editor_frm").serialize(), password),
						type: "remove_page"
					},
					success: function(response) {
						if (response["data"] !== "ok") {
							var risp = response["data"].split("::");
							if(risp[0] == "error") {
								alert("Si &egrave; verificato un errore durante la rimozione:\n" + risp[1], {icon: "error", title: "Ouch!"});
							}
						} else {
							alert("Questa pagina &egrave; stata rimossa con successo.", {icon: "success", title: "File rimosso"});
							$("#remove_btn").attr("disabled", "disabled");
						}
					}
				});
				break;
			
		}
		return false;
	});
	$("#code_theme").bind("change", function(){
		$.cryptAjax({
			url: "common/include/funcs/_ajax/decrypt.php",
			dataType: "json",
			type: "POST",
			data: {
				jCryption: $.jCryption.encrypt("code_theme=" + $("#code_theme").chosen().val() + "&user_username=" + $("#user_username").val(), password),
				type: "save_editor_theme"
			},
			success: function(response) {
				if (response["data"] !== "ok") {
					var risp = response["data"].split("::");
					if(risp[0] == "error") {
						console.log("Si &egrave; verificato un errore durante il salvataggio:", risp[1]);
					}
				} else {
					$("#page_loader").fadeOut(300);
					$("#original_name").val($("#config_name").val());
				}
			}
		});
	});
});