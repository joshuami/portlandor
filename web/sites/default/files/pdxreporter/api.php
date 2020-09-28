<?php

// fail immediately if critical values not passed in form post
$api_url = array_key_exists('api_url', $_POST) ? $_POST['api_url'] : '';
$action = array_key_exists('action', $_POST) ? $_POST['action'] : '';
$user_name = array_key_exists('user_name', $_POST) ? $_POST['user_name'] : '';

if (!$api_url || !$action || !$user_name) {
	throwCustomError($user_name, $action, '', 'ERROR: Required post values not provided (action: ' . $action . ', user_name: ' . $user_name . ', api_url: ' . $api_url . ')');
}

// http_response_code(500);
// exit();

try {
	/* ----------- CONFIG -------------- */
	$debug_logging = true;
	$debug_log_filename = '../logs/debuglog.txt';
	$default_version = '0.9.1';
	define("API_KEY", "0C88CF3C76FCCBCABCF3A97501C2D433");
	$max_img_dimension = 1024;
	$max_img_filesize = 6000000;
	$progress = "1"; // used to indicate progress through app for debugging purposes
	/* ---------- END CONFIG ----------- */

	/* ----------- GLOBALS ------------ */
	// config-related values from form post
	$api_url = $_POST['api_url'] . '?cb=' . time();
	$action = $_POST['action'];
	$pdxr_version = array_key_exists('version', $_POST) ? $_POST['version'] : $default_version;
	$user_agent = $_SERVER['HTTP_USER_AGENT'];
	$user_name = strtolower($_POST['user_name']); 	// make sure to always pass user_name, stored in cookie on client or in login post, and
													// make username lowercase, so it's used consistently in server cookie file names and API.
													// the API is case-agnostic on usernames.
	$result;
	$result_status = 'void';
	$debugging_info = '';
	$progress = "2";
	/* ----------- END GLOBALS ------------ */

	// break testing
	//if ($action == 'categories') throw new Exception("Mock error for break testing. Null exception error or some such.");

} catch (Exception $e) {
	echo throwCustomError($user_name, $action, $result_status, $e->getMessage()); // $user_name, $action, $result_status, $message
	exit();

} finally {

}


//throwCustomError($user_name, $action, $result_status, 'Break testing error');

/* ----------- FILE VALIDATION -------------- */
// if there are files, this function validates them. it throws errors and exits if invalid.
// if processing gets past this point, files are valid or were not provided.
//validateFiles();
/* ----------- END FILE VALIDATION -------------- */

try {

	/* ----------- PROCESS POST DATA -------------- */
	// create array of post data (CURL can accept querystring or array)
	$postdata = array (
		'api_key' => API_KEY,
		'action'  => $action
	);
	// spin through $_POST array and add additional fields to $postdata
	foreach ($_POST as $key => $value) {
		if ($key != 'api_url' && $key != 'action') {
			$postdata[$key] = $value;
		}
	}
	// we always want full contact info returned from API, must be set prior to calling getVerifyUserName
	$postdata['contact_full'] = "1";
	$progress = "3";
	/* ----------- END PROCESS POST DATA -------------- */

} catch (Exception $e) {
	echo throwCustomError($user_name, $action, $result_status, $e->getMessage()); // $user_name, $action, $result_status, $message
	exit();

} finally {

}


try {

	/* ------------- GENERATE SERVER COOKIE NAME ------------- */
	// NOTE: windows php needs the full path to the cookie file, base it from the calling script (this);
	// while linux allows relative.
	$dirname = dirname(__FILE__);
	$cookie_file = $dirname . "/../tmp/{$user_name}.txt";
	$progress = "4";
	/* ------------- END GENERATE SERVER COOKIE NAME ------------- */

} catch (Exception $e) {
	echo throwCustomError($user_name, $action, $result_status, $e->getMessage()); // $user_name, $action, $result_status, $message
	exit();

} finally {

}


/* ----------- SUBMIT TO API -------------- */
try {

	// $debug_message = 'Action: ' . $action;
	// if ($action == 'validateUser') {
	// 	$debug_message = $debug_message . '; Cookie File: ' . $cookie_file . '; User-Agent: ' . $user_agent;
	// }
	// logDebug($debug_message);

	// if file provided, add CURLFile to array
	if ($action == 'input' && count($_FILES) > 0) {
		// NOTE: there should only be 1 file; currently doesn't support multiples
		foreach($_FILES as $key => $file) {
			$cfile = new CURLFile($_FILES[$key]['tmp_name'], $_FILES[$key]['type'], $_FILES[$key]['name']);
			$postdata[$key] = $cfile;
		}
	}
	$progress = "5";

	// init curl
	$ch = curl_init($api_url);

	// all headers get set together right before executing the call.
	$httpheaders = array('User-Agent:PdxReporterWeb/'. $pdxr_version . ' (' . $user_agent . ')');

	// if login scenario, create new cookie session
	if ($action == "validateUser") {
		curl_setopt($ch, CURLOPT_COOKIESESSION, true);
	}

	curl_setopt($ch, CURLOPT_COOKIEFILE, $cookie_file);
	curl_setopt($ch, CURLOPT_COOKIEJAR, $cookie_file);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_POST, true);
	curl_setopt($ch, CURLOPT_POSTFIELDS, $postdata);
	curl_setopt($ch, CURLOPT_HEADER, 1);

	// set pdx reporter user agent header
	curl_setopt($ch, CURLOPT_HTTPHEADER, $httpheaders);

	$result = curl_exec($ch);
	$progress = "6";

} catch (Exception $e) {
	echo throwCustomError($user_name, $action, $result_status, $e->getMessage()); // $user_name, $action, $result_status, $message
	exit();

} finally {
	curl_close($ch);
}


/* ----------- END SUBMIT TO API -------------- */

try {

	/* ----------- PARSE API RESPONSE -------------- */
	// split headers from body and return body.
	// we are grabbing headers in case we need the verify_save cookie set by the API.
	$arr = preg_split('/\r\n\r\n/', $result);

	// TESTING: If less than 3 parts to response, dump response to screen for debugging
	if (count($arr) < 3) {
		echo $result;
		exit();
	}

	$header1 = $arr[0];
	$header2 = $arr[1];
	$result = $arr[2];
	$progress = "7";
	/* ----------- END PARSE API RESPONSE -------------- */

} catch (Exception $e) {
	echo throwCustomError($user_name, $action, $result_status, $e->getMessage()); // $user_name, $action, $result_status, $message
	exit();

} finally {

}

// parse $result json to see if it's success or failure. if failure, we want to
// record additional details to the debug log.
$json_result = json_decode($result);
$result_status = $json_result->status;

// if login is successful, set username as what user entered. in cases where user logged in using email address,
// we want the email address to be returned to the user as the username, since this value
// will be automatically used in subsequent requests and needs to match the cookie name.
if ($action == 'validateUser' && $json_result->loginvalid) {
	$json_result->user_name = $user_name;
	$result = json_encode($json_result);
}

if ($result_status != 'success') {
	// headers?
	$debugging_info = $json_result->error->message;
} else {

	// successful response, but user validation fails...
	if ($action == 'validateUser' && !$json_result->loginvalid) {
		$debugging_info = 'Login failed for user. Username as entered: ' . $_POST['user_name'] . '. Cookiefile: ' . $cookie_file;
	}

}

// do debug logging of request
logDebug($user_name, $action, $result_status, $debugging_info);


echo $result;
exit();

/* --------------------- HELPER FUNCTIONS ----------------- */

function logDebug($user_name, $action, $result_status, $debugging_info) {
	global $debug_logging;
	if ($debug_logging) {
		global $debug_log_filename;
		$date = date('Y/m/d H:i:s');
		$log_message = $date . ' | ' . $user_name . ' | ' . $action . ' | ' . $result_status;
		if ($debugging_info) {
			$log_message .= ' | ' . $debugging_info;
		}
		file_put_contents($debug_log_filename, $log_message . PHP_EOL, FILE_APPEND | LOCK_EX);
	}
}

function throwCustomError($user_name, $action, $result_status, $message) {
	global $progress;
	echo '{"status":"error", "error":{"message":"'. $message .'"}}';
	logDebug($user_name, $action, $result_status, 'ERROR: ' . $message . ' -- progress: ' . $progress);
	exit();
}

?>