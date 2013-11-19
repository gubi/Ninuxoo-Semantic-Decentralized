<?php
header("Content-type: text/plain");
if(isset($_GET["file"]) && trim($_GET["file"]) !== "") {
	require_once("../../classes/rsa.class.php");

	$rsa = new rsa();
	
	$rsa_encrypted = $rsa->simple_private_encrypt($_GET["file"]);
	$rsa_decrypted = $rsa->simple_private_decrypt($rsa_encrypted);
	print "rsa encrypted: " . rawurlencode($rsa_encrypted) . "\n\n";
	print "rsa decrypted: " . $rsa_decrypted . "\n\n";
	$hash =  rawurlencode($rsa_encrypted);
	
	print "http://192.168.36.210/download.php?h=" . $hash . "\n\n";
} else {
	print "E' necessario inserire una quey ?file=percorso/file.ext";
}
?>