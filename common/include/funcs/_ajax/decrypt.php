<?php
// Note: this script is a comment stripped version.
// If you want to study, you can find a commented version in `common/js/jCryption/php/jcryption.php`
header("Content-type: text/plain");
session_start();

$descriptorspec = array(
	0 => array("pipe", "r"),
	1 => array("pipe", "w")
);

if(isset($_GET["getPublicKey"])) {
	$arrOutput = array(
		"publickey" => file_get_contents("../../conf/rsa_2048_pub.pem")
	);
	print json_encode($arrOutput);
} elseif (isset($_GET["handshake"])) {
	$cmd = sprintf("openssl rsautl -decrypt -inkey ../../conf/rsa_2048_priv.pem");
	$process = proc_open($cmd, $descriptorspec, $pipes);
	if (is_resource($process)) {
		 fwrite($pipes[0], base64_decode($_POST["key"]));
		 fclose($pipes[0]);

		 $key = stream_get_contents($pipes[1]);
		 fclose($pipes[1]);
		 proc_close($process);
	}
	$_SESSION["key"] = $key;
	
	$cmd = sprintf("openssl enc -aes-256-cbc -pass pass:" . $key . " -a -e");
	$process = proc_open($cmd, $descriptorspec, $pipes);
	if (is_resource($process)) {
		 fwrite($pipes[0], $key);
		 fclose($pipes[0]);

		 $challenge = trim(str_replace("\n", "", stream_get_contents($pipes[1])));
		 fclose($pipes[1]);
		 proc_close($process);
	}

	print json_encode(array("challenge" =>  $challenge));
} elseif (isset($_GET["decrypttest"])) {
	date_default_timezone_set("UTC");
	$toEncrypt = date("c");

	$key = $_SESSION["key"];

	$cmd = sprintf("openssl enc -aes-256-cbc -pass pass:" . $key . " -a -e");
	$process = proc_open($cmd, $descriptorspec, $pipes);
	if (is_resource($process)) {
		 fwrite($pipes[0], $toEncrypt);
		 fclose($pipes[0]);

		 $encrypted = stream_get_contents($pipes[1]);
		 fclose($pipes[1]);
		 proc_close($process);
	}

	print json_encode( 
		array(
			"encrypted" => $encrypted,
			"unencrypted" => $toEncrypt
		)
	);
} elseif (isset($_POST["jCryption"])) {
	$key = $_SESSION["key"];

	$cmd = sprintf("openssl enc -aes-256-cbc -pass pass:" . $key . " -d");
	$process = proc_open($cmd, $descriptorspec, $pipes);
	if (is_resource($process)) {
		 fwrite($pipes[0], base64_decode($_POST["jCryption"]));
		 fclose($pipes[0]);

		 $data = stream_get_contents($pipes[1]);
		 fclose($pipes[1]);
		 proc_close($process);
	}
	
	parse_str($data, $output);
	
	$type = (isset($_GET["type"]) && trim($_GET["type"]) !== "") ? $_GET["type"] : $_POST["type"];
	switch($type) {
		case "change_chat_status":
			require_once("chat.change_status.php");
			break;
		case "check_neighbor":
			require_once("linked_nas.check_neighbor.php");
			break;
		case "check_notify":
			require_once("notifications.detect.php");
			break;
		case "check_online_peoples":
			require_once("chat.detect.php");
			break;
		case "check_personal_page":
			require_once("personal_page.detect.php");
			break;
		case "create_dir":
			require_once("editor.create_dir.php");
			break;
		case "download_data":
			require_once("editor.download_data.php");
			break;
		case "get_dir_data":
			require_once("get_dir_data.php");
			break;
		case "get_page_url":
			require_once("get_permalink.php");
			break;
		case "get_personal_configs":
			require_once("editor.get_personal_configs.php");
			break;
		case "get_rating":
			require_once("get_file_rating.php");
			break;
		case "get_seen":
			require_once("get_seen.php");
			break;
		case "get_shares":
			require_once("get_shares.php");
			break;
		case "get_user_pages":
			require_once("get_user_pages.php");
			break;
		case "install":
			require_once("install.generate_smb_conf.php");
			break;
		case "local_search":
			require_once("local_search.php");
			break;
		case "local_search.semantic_data.audio":
			print file_get_contents("../../../js/include/local_search.semantic_data.audio.js");
			break;
		case "local_search.semantic_data.book":
			print file_get_contents("../../../js/include/local_search.semantic_data.book.js");
			break;
		case "local_search.semantic_data.image":
			print file_get_contents("../../../js/include/local_search.semantic_data.image.js");
			break;
		case "local_search.semantic_data.video":
			print file_get_contents("../../../js/include/local_search.semantic_data.video.js");
			break;
		case "login":
			require_once("login.php");
			break;
		case "register_user":
			require_once("register_user.php");
			break;
		case "remove_notify":
			require_once("notifications.remove.php");
			break;
		case "remove_config":
			require_once("editor.remove_config.php");
			break;
		case "remove_page":
			require_once("local_site.remove_page.php");
			break;
		case "remove_personal_page":
			require_once("personal_page.remove.php");
			break;
		case "remove_script":
			require_once("editor.remove_script.php");
			break;
		case "rename_dir":
			require_once("editor.rename_dir.php");
			break;
		case "reset_password.send_mail":
			require_once("reset_password.send_mail.php");
			break;
		case "reset_password":
			require_once("reset_password.php");
			break;
		case "save_chat_panel_size":
			require_once("save_chat_panel_size.php");
			break;
		case "save_chat_panel_status":
			require_once("save_chat_panel_status.php");
			break;
		case "save_chat_panel_window":
			require_once("save_chat_panel_window.php");
			break;
		case "save_editor_theme":
			require_once("save_editor_theme.php");
			break;
		case "save_menu":
			require_once("local_site.save_menu.php");
			break;
		case "save_meteo_settings":
			require_once("save_meteo_settings.php");
			break;
		case "save_page":
			require_once("local_site.save_page.php");
			break;
		case "save_personal_page":
			require_once("personal_page.save.php");
			break;
		case "save_personal_settings":
			require_once("save_personal_settings.php");
			break;
		case "save_script":
			require_once("editor.save_script.php");
			break;
		case "save_search_settings":
			require_once("save_search_settings.php");
			break;
		case "save_settings":
			require_once("save_settings.php");
			break;
		case "send_notify":
			require_once("notifications.send.php");
			break;
		case "set_seen":
			require_once("set_seen.php");
			break;
		case "set_socket":
			require_once("chat.set_socket.php");
			break;
		case "set_rating":
			require_once("set_file_rating.php");
			break;
		case "start_scan":
			require_once("local_scan.php");
			break;
		case "trust_nas":
			require_once("linked_nas.trust_nas.php");
			break;
		case "unmark_nas":
			require_once("linked_nas.unmark_nas.php");
			break;
		case "untrust_nas":
			require_once("linked_nas.untrust_nas.php");
			break;
	}
}
?>