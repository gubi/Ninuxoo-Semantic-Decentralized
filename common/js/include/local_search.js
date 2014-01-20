function rawurlencode(str) {
	str = (str+'').toString();        
	return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\*/g, '%2A');
}
function ucfirst(str) {
	var firstLetter = str.substr(0, 1);
	return firstLetter.toUpperCase() + str.substr(1);
}
$.ultrie = function(resourcetrie) {
	var a = {};
	
	$.each(resourcetrie.children, function(index, child) {
		a[index] = {
			rank: child.rank,
			label: child.label,
			hash: child.hash,
			resources: child.resources,
			child: $.ultrie(child),
		};
	});
	return a;
};
$.explode_ultrie = function(resourcetrie) {
	var li = "",
	path_link = "";
	$.each(resourcetrie, function(rank, obj) {
		li += '<li><span class="fa fa-folder-o">&nbsp;&nbsp;' + $.explode_a_ultrie(obj);
	});
	return li;
};
$.explode_a_ultrie = function(resourcetrie) {
	var path_link = "",
	icon = "";
	if(resourcetrie.resources.length == 0) {
		if(Object.keys(resourcetrie.child).length > 1) {
			path_link += '<a href="./Esplora:?' + resourcetrie.hash + '">' + resourcetrie.label + '</a><tt> / </tt></span><ul>';
			$.each(resourcetrie.resources, function(r, res) {
				path_link += '<li><span class="' + res.icon + '">&nbsp;<a href="./Scheda:?' + res.hash + '">' + res.filename + '</a></span></li>';
			});
			$.each(resourcetrie.child, function(rank, obj) {
				path_link += '<li><span class="fa fa-folder-o">&nbsp;&nbsp;' + $.explode_a_ultrie(obj);
			});
			path_link += '</ul></li>';
		} else {
			path_link += '<a href="./Esplora:?' + resourcetrie.hash + '"> ' + resourcetrie.label + '</a><tt> / </tt>';
			$.each(resourcetrie.child, function(rank, obj) {
				path_link += $.explode_a_ultrie(obj);
			});
		}
	} else {
		if(Object.keys(resourcetrie.child).length > 1) {
			path_link += '<a href="./Esplora:?' + resourcetrie.hash + '">' + resourcetrie.label + '</a><tt> / </tt></span><ul>';
			$.each(resourcetrie.resources, function(r, res) {
				path_link += '<li><span class="' + res.icon + '">&nbsp;<a href="./Scheda:?' + res.hash + '">' + res.filename + '</a></span></li>';
			});
			$.each(resourcetrie.child, function(rank, obj) {
				path_link += '<li><span class="fa fa-folder-o">&nbsp;&nbsp;' + $.explode_a_ultrie(obj);
			});
			path_link += '</ul></li>';
		} else {
			path_link += '<a href="./Esplora:?' + resourcetrie.hash + '">' + resourcetrie.label + '</a><tt> / </tt></span>';
			path_link += '<ul>';
			$.each(resourcetrie.resources, function(r, res) {
				path_link += '<li><span class="' + res.icon + '">&nbsp;<a href="./Scheda:?' + res.hash + '">' + res.filename + '</a></span></li>';
			});
			path_link += "</ul></li>";
		}
	}
	return path_link;
};
$.get_semantic_data = function(params, callback) {
	$.get("common/include/funcs/_ajax/get_semantic_data.php", params, function(semantic_data) {
		if (callback) {
			callback(semantic_data);
		}
	}, "json");
}

$(document).ready(function() {
	var s = "",
	password = makeid();
	switch($("#result_type").text()) {
		case "Search":
			$("#breadcrumb").hide();
			break;
		default:
			var result_filetype = $("#result_filetype").text(),
			info = {};
			switch(result_filetype) {
				case "ebook":
					info = {
						title: (($("#ebook_title").length > 0) ? $("#ebook_title").text() : ""),
						author: (($("#ebook_author").length > 0) ? $("#ebook_author").text() : ""),
						isbn: (($("#ebook_isbn").length > 0) ? $("#ebook_isbn").text() : ""),
						tags: (($("#ebook_subject").length > 0) ? $("#ebook_subject").text() : ""),
						publisher: (($("#ebook_publisher").length > 0) ? $("#ebook_publisher").text() : ""),
						creation_date: (($("#ebook_creation_date").length > 0) ? $("#ebook_creation_date").text() : ""),
						pages: (($("#ebook_pages").length > 0) ? $("#ebook_pages").text() : ""),
						size: (($("#ebook_size").length > 0) ? $("#ebook_size").text() : ""),
						encrypted: (($("#ebook_encrypted").length > 0) ? $("#ebook_encrypted").text() : ""),
						program: (($("#ebook_program").length > 0) ? $("#ebook_program").text() : ""),
						web_optimized: (($("#ebook_optimized").length > 0) ? $("#ebook_optimized").text() : "")
					};
					// Get title data
					$.get("common/include/funcs/_ajax/get_semantic_data.php", {title: info.title, type: "book"}, function(semantic_data) {
						if(semantic_data !== null) {
						}
					}, "json");
					break;
				case "image":
					info = {
						title: (($("#media_title").length > 0) ? $("#media_title").text() : ""),
						artist: (($("#media_artist").length > 0) ? $("#media_artist").text() : "")
					};
					break;
				case "audio":
					info = {
						title: (($("#media_title").length > 0) ? $("#media_title").text() : ""),
						artist: (($("#media_artist").length > 0) ? $("#media_artist").text() : ""),
						album: (($("#media_album").length > 0) ? $("#media_album").text() : ""),
						year: (($("#media_year").length > 0) ? $("#media_year").text() : ""),
						length: (($("#media_length").length > 0) ? $("#media_length").text() : ""),
						track: (($("#media_track").length > 0) ? $("#media_track").text() : ""),
						genre: (($("#media_genre").length > 0) ? $("#media_genre").text() : ""),
						comments: (($("#media_comments").length > 0) ? $("#media_comments").text() : "")
					};
					$("#audio_spectrum").prev(".well.text-muted").fadeIn(300);
					$.get("http://192.168.36.210/common/include/lib/php-waveform-svg.php", {file: $("#hash").text()}, function(waveform) {
						if(waveform !== "no file") {
							$("#audio_spectrum").prev(".well.text-muted").fadeOut(300, function() {
								$("#audio_spectrum").html('<div style="width: 100%; height: 5em; padding: 0 10px; border: #ddd 1px solid;">' + waveform + '</iframe>').fadeIn(600);
							});
						}
					}, "text");
					if(info.album.length > 0) {
						info.type = "album";
						$("#semantic_album").prev(".well.text-muted").fadeIn(300);
						$.get_semantic_data(info, function(semantic_data) {
							if(semantic_data !== null) {
								var album_data = "",
								obj_size = $.map(semantic_data, function(n, i) { return i; }).length,
								i = 0;
								$("#album_name").text(semantic_data.label);
								$.each(semantic_data, function(key, val) {
									if(key != "label" && key != "abstract"  && key != "commento" && key != "immagine") {
										i++;
										if(i == Math.round((obj_size-3)/2)) {
											album_data += '</dl></div><div class="col-lg-6"><dl class="dl-horizontal">';
										}
										album_data += "<dt>" + ucfirst(key.replace(/_/g, " ")) + "</dt><dd>" + val + "</dd>";
									}
								});
								$("#semantic_album").append('<div class="panel panel-body">' + ((semantic_data.commento != undefined) ? semantic_data.commento : semantic_data.abstract) + '</div>');
								if(semantic_data.immagine.length > 0) {
									$("#semantic_album .panel-body").prepend('<img src="' + semantic_data.immagine + '" style="max-width: 150px; vertical-align: top; border: #ccc 1px solid;" class="left" />');
								}
								$("#semantic_album").append('<div class="panel panel-footer"><div class="col-lg-6"><dl class="dl-horizontal">' + album_data + '</dl></div></div>');
								$("#semantic_album").prev(".well.text-muted").fadeOut(300, function() {
									$("#semantic_artist").after("<hr />");
									$("#semantic_album").slideDown(300);
								});
							} else {
								$("#semantic_album").prev(".well.text-muted").fadeOut(300);
							}
						});
						
						info.type = "person";
						$("#semantic_artist").prev(".well.text-muted").fadeIn(300);
						$.get_semantic_data(info, function(semantic_data) {
							if(semantic_data !== null) {
								var artist_data = "",
								obj_size = $.map(semantic_data, function(n, i) { return i; }).length,
								i = 0;
								$("#artist_name").text(semantic_data.label);
								$.each(semantic_data, function(key, val) {
									if(key != "label" && key != "abstract"  && key != "commento" && key != "immagine") {
										i++;
										if(i == Math.round((obj_size-3)/2)) {
											artist_data += '</dl></div><div class="col-lg-6"><dl class="dl-horizontal">';
										}
										artist_data += "<dt>" + ucfirst(key.replace(/_/g, " ")) + "</dt><dd>" + val + "</dd>";
									}
								});
								$("#semantic_artist").append('<div class="panel panel-body">' + ((semantic_data.commento != undefined && semantic_data.commento.length > 0) ? semantic_data.commento : (semantic_data.abstract.length > 1) ? semantic_data.abstract : '<span class="text-muted">Non sono presenti cenni riguardo all\'autore</span>') + '</div>');
								if(semantic_data.immagine != undefined) {
									$("#semantic_artist .panel-body").prepend('<img src="' + semantic_data.immagine + '" class="left" style="max-width: 200px;" />');
								}
								$("#semantic_artist").append('<div class="panel panel-footer"><div class="col-lg-6"><dl class="dl-horizontal">' + artist_data + '</dl></div></div>');
								$("#semantic_artist").prev(".well.text-muted").fadeOut(300, function() {
									$("#semantic_artist").slideDown(300);
								});
							} else {
								$("#semantic_artist").prev(".well.text-muted").fadeOut(300);
							}
						});
					}
					break;
				case "video":
					info = {
						title: (($("#media_title").length > 0) ? $("#media_title").text() : ""),
						artist: (($("#media_artist").length > 0) ? $("#media_artist").text() : ""),
						album: (($("#media_album").length > 0) ? $("#media_album").text() : ""),
						year: (($("#media_year").length > 0) ? $("#media_year").text() : ""),
						length: (($("#media_length").length > 0) ? $("#media_length").text() : ""),
						track: (($("#media_track").length > 0) ? $("#media_track").text() : ""),
						genre: (($("#media_genre").length > 0) ? $("#media_genre").text() : ""),
						comments: (($("#media_comments").length > 0) ? $("#media_comments").text() : "")
					};
					info.type = "film";
					if(info.album.length > 0) {
						$.get_semantic_data(info, function(semantic_data) {
							console.log(semantic_data);
						});
					}
					break;
				default:
					break;
			}
			$("#semantic_info").prev(".well.text-muted").fadeIn(300);
			$.get_semantic_data({title: $("#result_semantic").text(), type: $("#result_owl").text()}, function(semantic_data) {
				$("#file_info").html('<dl class="dl-horizontal"></dl>');
				$.each(semantic_data, function(item, value) {
					if(item != "label" && item != "abstract"  && item != "commento" && item != "immagine") {
						$("#file_info dl").append('<dt>' + ucfirst(item.replace(/_/g, " ")) + ':</dt><dd>' + value + '</dd>');
					}
				});
				$("#s_label").text(semantic_data.label);
				$("#semantic_results").html(((semantic_data.commento.length > 0) ? semantic_data.commento : semantic_data.abstract));
				if(semantic_data.immagine.length > 0) {
					$("#semantic_results").prepend('<img src="' + semantic_data.immagine + '" style="width: 100px; vertical-align: top; border: #ccc 1px solid;" class="left" />');
				}
				if(semantic_data.abstract != undefined) {
					$("#semantic_results").append((semantic_data.commento.length > 0) ? '<br /><br /><br /><div class="panel"><div class="panel-heading"><a data-toggle="collapse" data-parent="#accordion" href="#collapseOne">Approfondimenti <span class="caret"></span></a></div><div id="collapseOne" class="panel-collapse collapse"><div class="panel-body">' + semantic_data.abstract + '</div></div></div>' : "");
				}
				$("#semantic_info").prev(".well.text-muted").fadeOut(300, function() {
					$("#semantic_info").slideDown(300);
				});
			});
			
			$("#breadcrumb").show();
			
			$("html, body").animate({ scrollTop: $("#container").offset().top }, 300);
			break;
	}
	$.jCryption.authenticate(password, "common/include/funcs/_ajax/decrypt.php?getPublicKey=true", "common/include/funcs/_ajax/decrypt.php?handshake=true", function(AESKey) {
		var encryptedString = $.jCryption.encrypt("q=" + $("#search_term").text() + "&op=" + $("#search_type").text() + "&nresults=" + $("#search_num_results").text() + "&path=" + $("#search_path").text() + "&filetype=" + $("#search_filetype").text(), password);
		
		$.ajax({
			url: "common/include/funcs/_ajax/decrypt.php",
			dataType: "json",
			type: "POST",
			data: {
				jCryption: encryptedString,
				type: "local_search"
			},
			success: function(data) {
				if(data.nresults > 0){
					$("#nlabels").text(data.nlabels);
					$("#nresults").text(($("#result_type").text() == "View" ? (data.nresults - 1) : data.nresults));
					$("#searchtime").text(Math.round(data.searchtime*1000)/1000 + " secondi");
					
					index_count = 0;
					$.each(data.results, function(index, value) {
						index_count++;
						
						if(index == 0) {
							if($("#result_type").text() == "Search" || ($("#result_type").text() == "View" && (data.nresults - 1) > 0)) {
								$("#search_results").html('<div class="search_results"><ul id="treeview_' + index + '" class="exactresults filetree treeview"></ul><div id="otherresults"></div></div>');
							} else {
								$("#search_results").html('<p class="alert alert-success text-centered"><span class="fa fa-check"></span>&nbsp;&nbsp;Non sono stati trovati duplicati per questo file</p>');
							}
							var start_collapsed = false;
							
							$(".filetree a[title]").tooltip();
							$(".treecontrol a[title]").tooltip();
						} else {
							$("#otherresults").append('<ul id="treeview_' + index + '" class="otherresults filetree treeview"></ul>')
							var start_collapsed = true;
						}
						s = $.ultrie(value.resourcetrie);
						var li = "";
						li += $.explode_ultrie(s);
						var ul = '<ul>' + li + '</ul>';
						$(".filetree").append(ul);
						
						$(".filetree").treeview({
							control: "",
							animated: "fast",
							collapsed: true
						});
						$("#search_content li > span").click();
					});
					$("#search_loader").fadeOut(600);
					$("#breadcrumb").fadeIn(600);
					$("#search_content").fadeIn(600);
					$("#search_results").removeHighlight().highlight($("#search_term").text()).find("#right_menu").removeHighlight();
				} else {
					// No results
					$.ajax({
						url: "common/tpl/content.tpl",
						dataType: "text",
						type: "GET",
						success: function(content) {
							if($("#result_type").text() == "Search") {
								var search_term = $("#search_term").text();
								$("#breadcrumb").remove();
								$("#content").html(content);
								$("#top_menu_right > form").remove();
								$("#search_input").val(search_term);
								$("#resstats").addClass("text-danger").text('Nessun risultato trovato con la ricerca per \"' + search_term + '\"');
							}
						}
					});
				}
			}
		});
	}, function() {
		$("#page_loader").fadeOut(300);
		alert("Si &egrave; verificato un errore durante la ricerca :(", {icon: "error", title: "Ouch!"});
	});
});