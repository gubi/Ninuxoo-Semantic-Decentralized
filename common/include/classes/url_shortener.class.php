<?php
/**
* Ninuxoo 2.0
*
* PHP Version 5.3
*
* @copyright 2013 Alessandro Gubitosi / Gubi (http://iod.io)
* @license http://www.gnu.org/licenses/gpl-3.0.html GNU General Public License, version 3
* @link https://github.com/gubi/Ninuxoo-2.0
*/

/**
* A class for short url with Ninux Yourls API
*
* This class call Ninux Yourls service for short an url.<br>
* For more info about Yourls' API visit http://yourls.org/#API
*
* @package	Ninuxoo 2.0
* @author		Alessandro Gubitosi <gubi.ale@iod.io>
* @license 	http://www.gnu.org/licenses/gpl-3.0.html GNU General Public License, version 3
* @access		public
* @link		https://github.com/gubi/Ninuxoo-2.0/blob/master/common/include/classes/url_shortener.class.php
*/
class yourls {
	/**
	* Construct
	*
	* Initialize the class
	*
	* @global string $this->yourls_url Base Ninux url shortener url
	* @global object $this->obj->signature Decrypted token
	* @see yourls::dec()
	* @return void
	*/
	function __construct() {
		$this->yourls_url = "http://nnx.me/yourls-api.php";
		$yourls_token = "KcMk8hjh90y3U8fE3r2ZDl9lzYhRlp5YgnLgy0vVBFVKXrGeDAj1v8x0USay8vYsIMAojjwqrP1Xjx/dgKTAJw==";
		
		$this->obj = new stdClass();
		$this->obj->signature = $this->dec($yourls_token);
	}
	/**
	* Decrypt the given token
	*
	* @param string $yourls_token The given encrypted token
	* @access private
	* @return string $dec Token
	*/
	private function dec($yourls_token) {
		$t = base64_decode($yourls_token);
		$k = "shorten";
		$iv = substr($t, 0, mcrypt_get_iv_size(MCRYPT_RIJNDAEL_256, MCRYPT_MODE_CBC));
		$dec = rtrim(mcrypt_decrypt(MCRYPT_RIJNDAEL_256, hash("sha256", $k, true), substr($t, mcrypt_get_iv_size(MCRYPT_RIJNDAEL_256, MCRYPT_MODE_CBC)), MCRYPT_MODE_CBC, $iv), "\0");
		return $dec;
	}
	/**
	* Return a given error message and exit
	*
	* @param string $message The error message
	* @access private
	* @return void The given error message
	*/
	private function error($message = "Si e' verificato un errore") {
		print $message;
		exit();
	}
	
	/**
	* Set the "format" API variable
	*
	* @param string $format The format variable
	* @access public
	* @global object $this->obj->format The format variable
	*/
	public function format($format = "") {
		if(strlen(trim($format)) == 0) {
			$format = "simple"; // "jsonp", "json", "xml" or "simple"
		}
		$this->obj->format = $format;
	}
	/**
	* Set the "action" API variable
	*
	* @param string $action The action variable
	* @access public
	* @global object $this->obj->action The action variable
	*/
	public function action($action = "") {
		if(strlen(trim($action)) == 0) {
			$action = "shorturl"; // "expand", "url-stats", "stats", "db-stats" or "shorturl"
		}
		$this->obj->action = $action;
	}
	/**
	* Set the "keyword" API variable
	*
	* @param string $keyword The keyword variable
	* @access public
	* @global object $this->obj->keyword The keyword variable
	*/
	public function keyword($keyword = "") {
		if(strlen(trim($keyword)) == 0) {
			$keyword = "";
		}
		$this->obj->keyword = $keyword;
	}
	/**
	* Set the "title" API variable
	*
	* @param string $title The title variable
	* @access public
	* @global object $this->obj->title The title variable
	*/
	public function title($title = "") {
		if(strlen(trim($title)) == 0) {
			$title = "Ninuxoo page";
		}
		$this->obj->title = $title;
	}
	/**
	* Set the "url" API variable
	*
	* @param string $url The url variable
	* @access public
	* @global object $this->obj->url The url variable
	*/
	public function url($url) {
		if(strlen(trim($url)) > 0) {
			$this->obj->url = $url;
		} else {
			$this->error("Nessun URL da raccorciare");
		}
	}
	
	/**
	* Shorten a given url using Yourls API
	*
	* @param string $url The url variable
	* @see yourls::format() Format
	* @see yourls::action() Action
	* @see yourls::keyword() Keyword
	* @see yourls::title() Title
	* @see yourls::error() Error
	* @access public
	* @return string The url shertened
	*/
	public function shorten($url = "") {
		if(strlen(trim($this->obj->format)) == 0) {
			$this->format();
		}
		if(strlen(trim($this->obj->action)) == 0) {
			$this->action();
		}
		if(strlen(trim($this->obj->keyword)) == 0) {
			$this->keyword();
		}
		if(strlen(trim($this->obj->title)) == 0) {
			$this->title();
		}
		if(strlen(trim($url)) == 0) {
			$this->error("Nessun URL da raccorciare");
		} else {
			$this->obj->url = trim($url);
			$ch = curl_init();
			curl_setopt($ch, CURLOPT_URL, $this->yourls_url);
			curl_setopt($ch, CURLOPT_HEADER, 0); // No header in the result
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); // Return, do not echo result
			curl_setopt($ch, CURLOPT_POST, 1); // This is a POST request
			curl_setopt($ch, CURLOPT_POSTFIELDS, array(// Data to POST
				"url" => $this->obj->url,
				"keyword" => $this->obj->keyword,
				"title" => $this->obj->title,
				"format" => $this->obj->format,
				"action" => $this->obj->action,
				"signature" => $this->obj->signature
			));
			$shorted = curl_exec($ch);
			curl_close($ch);
			
			return $shorted;
		}
	}
}
?>