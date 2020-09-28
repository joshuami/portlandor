

const APP_VERSION = "v0.9.1";



var DEV_MODE = document.location.hostname.toLowerCase() != "www.pdxreporter.org" && document.location.hostname.toLowerCase() != "pdxreporter.org";

var MOCK_MODE = document.location.href.indexOf("http://localhost:3000/") > -1 || getUrlVar("mock");

const COOKIE_VERIFY_SAVE_NAME = "VERIFY_SAVE";
const POG_USER_COOKIE_NAME =    'pogUser-20171205';

const LOGIN_FAILED_MESSAGE = "Login failed. Please try again or reset your password.";
const AUTO_LOGIN_FAILED_MESSAGE = "Automatic login failed. Please log in using your username and password.";

const S1 = "btsphoneapp";
const S2 = "@";
const S3 = "portlandoregon.gov";
const I1 = "cityinfo";
const I2 = "@";
const I3 = "portlandoregon.gov";


var reporter = angular.module('reporter', ['ngCookies', 'ngSanitize', 'ngFileUpload', 'ngRoute']);
reporter.config( ['$provide', function ($provide){
        $provide.decorator('$browser', ['$delegate', function ($delegate) {
            $delegate.onUrlChange = function () {};
            $delegate.url = function () { return ""};
            return $delegate;
        }]);
    }]);




$(".uploadPreview, .btnSelectPhoto").click(function() {
	$("#UploadFile").click();
});







const API_PASSTHRU_URL = "api.php";
const API_BOUNDARY_URL = "https://www.portlandmaps.com/arcgis/rest/services/Public/Boundaries/MapServer/0/query";
const API_PARKS_BOUNDARY_URL = "https://www.portlandmaps.com/arcgis/rest/services/Public/Parks_Misc/MapServer/2/query";
const TRACKIT_API_KEY = "0C88CF3C76FCCBCABCF3A97501C2D433";
const TRACKIT_API_URL_REPORT = "https://www.portlandmaps.com/api/report/";
const TRACKIT_API_URL_AUTH = "https://www.portlandmaps.com/api/auth/";
const MOCK_ERROR = { "status": "error", "message": "ERROR 001: A general server error has occurred." };


function processCategoryText(categories) {
	if (!categories || !categories.categories || categories.categories.length < 1) return;

    var regex1 = new RegExp("\r\n-", 'g');
    var regex2 = new RegExp("\r\n", 'g');

    for (var i = 0; i < categories.categories.length; i++) {
        var message = categories.categories[i].message;
        message = message.replace(regex1, '<br />&bull;');
        message = message.replace(regex2, '<br />');
        categories.categories[i].message = message;
    }
}

if (MOCK_MODE) {

    reporter.factory('dataService', function($http) {
        return {

            test: function(message) {
              if (!message) message = "Data Service is plugged in!";
              alert(message);
            },

            login: function(user_name, password, verify_save) {
                return {
					address: "123 Fake St",
					city: "Portland",
					contact_id: 591874,
					created_date: "February, 19 2016 10:54:08",
					email: "test.user@portlandoregon.gov",
					fax_num: "",
					first_name: "Tom",
					last_name: "Tester",
					loginvalid: true,
					middle_initial: "T",
					mobile_num: "",
					phone_num: "503-555-1111",
					state: "OR",
					status: "success",
					updated_date: "December, 05 2016 09:40:51",
					user_name: user_name,
					verify_save: "01234567890",
					zipcode: 97204
				};
            },

            logoff: function() {
            	return {"logoffvalid":true,"status":"success"};
            },

            categories: function() {
                return {"status":"success","categories":[{"category_id":73,"message":"THIS APP IS BEING REPLACED ON 10/31/2017. Please go to www.pdxreporter.org.\r\n\r\nTo report a vehicle appearing to be abandoned on the public right-of-way, please provide:\r\n\r\n- Your name and daytime phone number\r\n- Address where the vehicle is parked\r\n- Make, color and body style\r\n- License plate number and state, if available\r\n- Description of vehicle, i.e. missing wheels or parts\r\n\r\nThe Inspector will route the report as received.","contact_required":1.0,"text_input_id":"input73_3","binary_input_id":"input73_8","contact_type_id":369.0,"input_alias":"Abandoned Auto","binary_input_required":0,"address_input_required":1,"text_input_required":1,"status_input_id":"input73_5","address_input_id":"input73_4"},{"category_id":1790,"message":"THIS APP IS BEING REPLACED ON 10/31/2017. Please go to www.pdxreporter.org.\r\n\r\nCampsite reports enable us to better understand where services are most needed. Reporting criteria: Repeated instances of overly aggressive behavior from campers (call 9-1-1 for emergencies); obstructing public right-of-way; misuse of public space; permanent structures; excessive trash or biohazards; damage to environment; public intoxication or conspicuous drug use.\r\n","contact_required":0.0,"text_input_id":"input1790_24","binary_input_id":"input1790_23","contact_type_id":374.0,"input_alias":"Campsite Reporting","binary_input_required":0,"address_input_required":1,"text_input_required":0,"status_input_id":null,"address_input_id":"input1790_3"},{"category_id":66,"message":"THIS APP IS BEING REPLACED ON 10/31/2017. Please go to www.pdxreporter.org.\r\n\r\nDebris in roadway includes glass, gravel, rock, tree limbs or other hazards in the travel lanes, including bike lanes. Please include street intersections or address location and direction headings (for example, NE corner of SW Main and SW 4th Avenue). Be as specific as possible with debris type (example: smashed beer bottle or a garbage bag size amount of gravel).","contact_required":0.0,"text_input_id":"input66_1","binary_input_id":"input66_7","contact_type_id":369.0,"input_alias":"Debris in Roadway","binary_input_required":0,"address_input_required":1,"text_input_required":0,"status_input_id":null,"address_input_id":"input66_2"},{"category_id":77,"message":"THIS APP IS BEING REPLACED ON 10/31/2017. Please go to www.pdxreporter.org.\r\n\r\nIn order to respond, we must receive a clear and close-up photo, your contact information, and a physical address of the graffiti (if it is on a building).\r\n\r\n-Please tell us if you are the property owner or tenant, and whether the graffiti has been removed.\r\n\r\n-To request removal assistance, please include your telephone number.\r\n\r\nQuestions? Call 503-823-4824","contact_required":0.0,"text_input_id":"input77_17","binary_input_id":"input77_23","contact_type_id":319.0,"input_alias":"Graffiti","binary_input_required":1,"address_input_required":1,"text_input_required":1,"status_input_id":"input77_4","address_input_id":"input77_2"},{"category_id":1324,"message":"THIS APP IS BEING REPLACED ON 10/31/2017. Please go to www.pdxreporter.org.\r\n\r\nReports may be submitted 8am-5pm Monday to Friday.\r\n\r\nAFTER HOURS & HOLIDAYS call 503-823-5195 and follow the prompts.\r\n\r\nTo report vehicles illegally parked on a public street, provide the following information:\r\n\r\n- Your name and daytime phone number\r\n- How the vehicle is illegally parked\r\n- Address of vehicle\r\n- Vehicle description\r\n- License plate number and state","contact_required":0.0,"text_input_id":"input1324_3","binary_input_id":"input1324_2","contact_type_id":370.0,"input_alias":"Illegal Parking","binary_input_required":0,"address_input_required":1,"text_input_required":1,"status_input_id":"input1324_4","address_input_id":"input1324_1"},{"category_id":1459,"message":"THIS APP IS BEING REPLACED ON 10/31/2017. Please go to www.pdxreporter.org.\r\n\r\nThis report type should be used for issues not listed elsewhere in the app. \r\n\r\nPlease include your name and contact information or we may not be able to obtain more information if needed and may not be able to act on your request.","contact_required":1.0,"text_input_id":"input1459_3","binary_input_id":"input1459_4","contact_type_id":375.0,"input_alias":"Other","binary_input_required":0,"address_input_required":1,"text_input_required":0,"status_input_id":"input1459_2","address_input_id":"input1459_1"},{"category_id":1206,"message":"Thank you for using PDX Reporter! \r\n\r\nPortland Parks & Recreation uses ParkScan Portland, www.parkscanpdx.org, to view and respond to many park maintenance concerns and comments. Your report may be entered into ParkScan Portland. If so, you will receive a ParkScan tracking number. \r\n\r\nPlease be sure to enter your contact information in Settings so Parks staff can update you on the status of your report. ","contact_required":0.0,"text_input_id":"input1206_4","binary_input_id":"input1206_1","contact_type_id":376.0,"input_alias":"Park Maintenance","binary_input_required":0,"address_input_required":1,"text_input_required":0,"status_input_id":"input1206_3","address_input_id":"input1206_2"},{"category_id":1261,"message":"THIS APP IS BEING REPLACED ON 10/31/2017. Please go to www.pdxreporter.org.\r\n\r\nThank you for using PDX Reporter!\r\n\r\nTHIS CATEGORY IS FOR PLUGGED STORM DRAINS AND INLETS ONLY.\r\n\r\nIf this is not related to a plugged storm drain, please call 503-823-1700 and a live operator will take a report of your problem and refer it to the appropriate work group.","contact_required":0.0,"text_input_id":"input1261_3","binary_input_id":"input1261_7","contact_type_id":369.0,"input_alias":"Plugged Storm Drain/Inlet","binary_input_required":0,"address_input_required":1,"text_input_required":1,"status_input_id":null,"address_input_id":"input1261_4"},{"category_id":1489,"message":"THIS APP IS BEING REPLACED ON 10/31/2017. Please go to www.pdxreporter.org.\r\n\r\nThank you for using PDX Reporter!\r\n\r\nThis category is for potholes only.\r\nIf you wish to report something other than a pothole, please call 503-823-1700 for assistance.\r\n\r\nResponse is limited to business hours, 7am-2:30pm. Reports received after hours will be routed on the next business day. You can also call potholes into 823-BUMP (2687).","contact_required":0.0,"text_input_id":"input1489_1","binary_input_id":"input1489_8","contact_type_id":369.0,"input_alias":"Potholes","binary_input_required":0,"address_input_required":1,"text_input_required":1,"status_input_id":null,"address_input_id":"input1489_2"},{"category_id":1530,"message":"THIS APP IS BEING REPLACED ON 10/31/2017. Please go to www.pdxreporter.org.\r\n\r\nTo report a sidewalk cafÃƒÂ© in violation of Chapter 17.25 of the Portland City Code, such as insufficient pedestrian clearance or low-hanging umbrellas, please provide the following information:\r\n- Your name and daytime phone number\r\n- Name and address of the business in violation\r\n- A photograph of the violation\r\n- A description of the violation","contact_required":0.0,"text_input_id":"input1530_2","binary_input_id":"input1530_3","contact_type_id":369.0,"input_alias":"Sidewalk CafÃƒÂ© Violations","binary_input_required":0,"address_input_required":1,"text_input_required":1,"status_input_id":null,"address_input_id":"input1530_1"},{"category_id":176,"message":"THIS APP IS BEING REPLACED ON 10/31/2017. Please go to www.pdxreporter.org.\r\n\r\nTo report a sidewalk trip hazard, include your name, daytime phone number and the location of the problem (address or business name). If insufficient details are provided, the Sidewalk Maintenance office will not investigate. Please call 503-823-1711 if you are unable to use this app to make a report. Report vegetation issues using the Sidewalk Vegetation category.","contact_required":0.0,"text_input_id":"input176_1","binary_input_id":"input176_6","contact_type_id":369.0,"input_alias":"Sidewalk Trip Hazard","binary_input_required":0,"address_input_required":1,"text_input_required":0,"status_input_id":"input176_3","address_input_id":"input176_2"},{"category_id":314,"message":"THIS APP IS BEING REPLACED ON 10/31/2017. Please go to www.pdxreporter.org.\r\n\r\nTo report vegetation impeding a sidewalk, please provide:\r\n\r\n- Your name, address and phone number\r\n- Specific address where vegetation is located\r\n- Description of vegetation\r\n- If the vegetation is from a tree in the public right of way, please contact Urban Forestry at 503-823-4489\r\n\r\nYour information is confidential. We are unable to act on anonymous reports.","contact_required":1.0,"text_input_id":"input314_11","binary_input_id":"input314_12","contact_type_id":372.0,"input_alias":"Sidewalk Vegetation","binary_input_required":0,"address_input_required":1,"text_input_required":1,"status_input_id":null,"address_input_id":"input314_4"},{"category_id":596,"message":"THIS APP IS BEING REPLACED ON 10/31/2017. Please go to www.pdxreporter.org.\r\n\r\nThis category is for reporting Street Light problems only. If this is a Traffic Signal problem, please call 503-823-1700. Thank you.","contact_required":0.0,"text_input_id":"input596_7","binary_input_id":"input596_11","contact_type_id":370.0,"input_alias":"Street Lighting","binary_input_required":0,"address_input_required":1,"text_input_required":0,"status_input_id":"input596_12","address_input_id":"input596_2"},{"category_id":1878,"message":"THIS APP IS BEING REPLACED ON 10/31/2017. Please go to www.pdxreporter.org.\r\n\r\nTo report concerns with construction in the street or sidewalk, please provide:\r\n- time of day\r\n- description\r\n- location (for example, NE corner of 4th & Main)\r\n- contractor (if known)\r\n\r\nFor any other general safety concerns, contact 823-SAFE.","contact_required":0.0,"text_input_id":"input1878_3","binary_input_id":"input1878_4","contact_type_id":370.0,"input_alias":"Work Zone Concerns","binary_input_required":0,"address_input_required":1,"text_input_required":1,"status_input_id":null,"address_input_id":"input1878_2"}]};
            },

            reports: function() {
                return {
                	"items": [
                        {"status_input_value":null,"files":[{"file_name":"image.jpg","mime_type":"image/jpeg","id":106832}],"date_updated":"11/10/09 9:53AM","address_input_value_wmx":-1.3643677800600724E7,"address_input_value_wmy":5702204.606355531,"status":"Open","address_input_value":null,"address_input_value_lon":-122.56324299881847,"address_input_value_lat":45.51021100061395,"category":"CGIS Testing Category","id":100010,"date_created":"11/10/16 9:53AM","address_input_value_y":678863.237,"text_input_value":"This is a test, please disregard.","address_input_value_x":7673234.033},
                		{"status_input_value":null,"files":[{"file_name":"image.jpg","mime_type":"image/jpeg","id":286832}],"date_updated":"11/10/16 9:53AM","address_input_value_wmx":-1.3643677800600724E7,"address_input_value_wmy":5702204.606355531,"status":"Open","address_input_value":null,"address_input_value_lon":-122.56324299881847,"address_input_value_lat":45.51021100061395,"category":"CGIS Testing Category","id":100002,"date_created":"11/10/16 9:53AM","address_input_value_y":678863.237,"text_input_value":"This is a test, please disregard.","address_input_value_x":7673234.033},
                		{"status_input_value":null,"files":[{"file_name":"image.jpg","mime_type":"image/jpeg","id":286832}],"date_updated":"11/10/16 9:53AM","address_input_value_wmx":-1.3643677800600724E7,"address_input_value_wmy":5702204.606355531,"status":"Open","address_input_value":null,"address_input_value_lon":-122.56324299881847,"address_input_value_lat":45.51021100061395,"category":"CGIS Testing Category","id":100003,"date_created":"11/10/16 9:53AM","address_input_value_y":678863.237,"text_input_value":"This is a test, please disregard.","address_input_value_x":7673234.033},
                		{"status_input_value":null,"files":[{"file_name":"image.jpg","mime_type":"image/jpeg","id":286832}],"date_updated":"12/13/16 9:53AM","address_input_value_wmx":-1.3643677800600724E7,"address_input_value_wmy":5702204.606355531,"status":"Open","address_input_value":null,"address_input_value_lon":-122.56324299881847,"address_input_value_lat":45.51021100061395,"category":"CGIS Testing Category","id":100004,"date_created":"11/10/16 9:53AM","address_input_value_y":678863.237,"text_input_value":"This is a test, please disregard.","address_input_value_x":7673234.033},
                        {"status_input_value":null,"files":[{"file_name":"image.jpg","mime_type":"image/jpeg","id":286832}],"date_updated":"5/10/16 9:53AM","address_input_value_wmx":-1.3643677800600724E7,"address_input_value_wmy":5702204.606355531,"status":"Open","address_input_value":null,"address_input_value_lon":-122.56324299881847,"address_input_value_lat":45.51021100061395,"category":"CGIS Testing Category","id":100001,"date_created":"11/10/16 9:53AM","address_input_value_y":678863.237,"text_input_value":"This is a test, please disregard.","address_input_value_x":7673234.033},
                        {"status_input_value":null,"files":[{"file_name":"image.jpg","mime_type":"image/jpeg","id":286832}],"date_updated":"12/13/16 9:53AM","address_input_value_wmx":-1.3643677800600724E7,"address_input_value_wmy":5702204.606355531,"status":"Open","address_input_value":null,"address_input_value_lon":-122.56324299881847,"address_input_value_lat":45.51021100061395,"category":"CGIS Testing Category","id":100014,"date_created":"11/10/16 9:53AM","address_input_value_y":678863.237,"text_input_value":"This is a test, please disregard.","address_input_value_x":7673234.033},
                		{"status_input_value":null,"files":[{"file_name":"image.jpg","mime_type":"image/jpeg","id":186832}],"date_updated":"11/10/16 9:53AM","address_input_value_wmx":-1.3643677800600724E7,"address_input_value_wmy":5702204.606355531,"status":"Open","address_input_value":null,"address_input_value_lon":-122.56324299881847,"address_input_value_lat":45.51021100061395,"category":"CGIS Testing Category","id":100006,"date_created":"11/10/16 9:53AM","address_input_value_y":678863.237,"text_input_value":"This is a test, please disregard.","address_input_value_x":7673234.033},
                        {"status_input_value":null,"files":[{"file_name":"image.jpg","mime_type":"image/jpeg","id":286832}],"date_updated":"11/10/16 9:53AM","address_input_value_wmx":-1.3643677800600724E7,"address_input_value_wmy":5702204.606355531,"status":"Open","address_input_value":null,"address_input_value_lon":-122.56324299881847,"address_input_value_lat":45.51021100061395,"category":"CGIS Testing Category","id":100012,"date_created":"11/10/16 9:53AM","address_input_value_y":678863.237,"text_input_value":"This is a test, please disregard.","address_input_value_x":7673234.033},
                        {"status_input_value":null,"files":[{"file_name":"image.jpg","mime_type":"image/jpeg","id":286832}],"date_updated":"11/10/12 9:53AM","address_input_value_wmx":-1.3643677800600724E7,"address_input_value_wmy":5702204.606355531,"status":"Open","address_input_value":null,"address_input_value_lon":-122.56324299881847,"address_input_value_lat":45.51021100061395,"category":"CGIS Testing Category","id":100005,"date_created":"11/10/16 9:53AM","address_input_value_y":678863.237,"text_input_value":"This is a test, please disregard.","address_input_value_x":7673234.033},
                		{"status_input_value":null,"files":[{"file_name":"image.jpg","mime_type":"image/jpeg","id":206832}],"date_updated":"11/10/15 9:53AM","address_input_value_wmx":-1.3643677800600724E7,"address_input_value_wmy":5702204.606355531,"status":"Open","address_input_value":null,"address_input_value_lon":-122.56324299881847,"address_input_value_lat":45.51021100061395,"category":"CGIS Testing Category","id":100007,"date_created":"11/10/16 9:53AM","address_input_value_y":78863.237,"text_input_value":"This is a test, please disregard.","address_input_value_x":7673234.033},
                		{"status_input_value":null,"files":[{"file_name":"image.jpg","mime_type":"image/jpeg","id":286832}],"date_updated":"11/10/16 9:53AM","address_input_value_wmx":-1.3643677800600724E7,"address_input_value_wmy":5702204.606355531,"status":"Open","address_input_value":null,"address_input_value_lon":-122.56324299881847,"address_input_value_lat":45.51021100061395,"category":"CGIS Testing Category","id":100008,"date_created":"11/10/16 9:53AM","address_input_value_y":678863.237,"text_input_value":"This is a test, please disregard.","address_input_value_x":7673234.033},
                		{"status_input_value":null,"files":[{"file_name":"image.jpg","mime_type":"image/jpeg","id":286832}],"date_updated":"11/10/16 9:53AM","address_input_value_wmx":-1.3643677800600724E7,"address_input_value_wmy":5702204.606355531,"status":"Open","address_input_value":null,"address_input_value_lon":-122.56324299881847,"address_input_value_lat":45.51021100061395,"category":"CGIS Testing Category","id":100009,"date_created":"11/10/16 9:53AM","address_input_value_y":678863.237,"text_input_value":"This is a test, please disregard.","address_input_value_x":7673234.033},
                        {"status_input_value":null,"files":[{"file_name":"image.jpg","mime_type":"image/jpeg","id":286832}],"date_updated":"5/10/16 9:53AM","address_input_value_wmx":-1.3643677800600724E7,"address_input_value_wmy":5702204.606355531,"status":"Open","address_input_value":null,"address_input_value_lon":-122.56324299881847,"address_input_value_lat":45.51021100061395,"category":"CGIS Testing Category","id":100011,"date_created":"11/10/16 9:53AM","address_input_value_y":678863.237,"text_input_value":"This is a test, please disregard.","address_input_value_x":7673234.033},
                        {"status_input_value":null,"files":[{"file_name":"image.jpg","mime_type":"image/jpeg","id":286832}],"date_updated":"11/10/16 9:53AM","address_input_value_wmx":-1.3643677800600724E7,"address_input_value_wmy":5702204.606355531,"status":"Open","address_input_value":null,"address_input_value_lon":-122.56324299881847,"address_input_value_lat":45.51021100061395,"category":"CGIS Testing Category","id":100013,"date_created":"11/10/16 9:53AM","address_input_value_y":678863.237,"text_input_value":"This is a test, please disregard.","address_input_value_x":7673234.033},
                        {"status_input_value":null,"files":[{"file_name":"image.jpg","mime_type":"image/jpeg","id":286832}],"date_updated":"11/10/12 9:53AM","address_input_value_wmx":-1.3643677800600724E7,"address_input_value_wmy":5702204.606355531,"status":"Open","address_input_value":null,"address_input_value_lon":-122.56324299881847,"address_input_value_lat":45.51021100061395,"category":"CGIS Testing Category","id":100015,"date_created":"11/10/16 9:53AM","address_input_value_y":678863.237,"text_input_value":"This is a test, please disregard.","address_input_value_x":7673234.033}
					],
                	"status": "success"
                };
            },

          	newReport: function(postData, mockerror) {
          		if (mockerror) {
          			return MOCK_ERROR;
          		}
                return {
                	"item_id": 1106959,
                	"status": "success"
                };
            },

          	isPortland: function(x, y) {
		    	    return true;
          	},

          	isParks: function(x, y) {
		    	    return true;
          	}
        };

    });

} else {

    reporter.factory('dataService', function($http, Upload) {

        function doPostRequest(postData) {
        	postData["version"] = APP_VERSION;

        	var config = {
                method:   "POST",
                url:      API_PASSTHRU_URL,
                data:     postData
        	};

        	return Upload.upload(config);
        }

        return {

          	test: function(message) {
            	if (!message) message = "Data Service is plugged in!";
        		alert(message);
        	},

          login: function(userName, password) {
                    return doPostRequest({
                        action:         "validateUser",
                        api_url: 		TRACKIT_API_URL_AUTH,
                        contact_full:   1,
                        user_name:      userName,
                        password:       password
                    });
          },

          logoff: function() {
            return doPostRequest({
              action: 		"logoff"
            })
          },

          reports: function(userName) {
            return doPostRequest({
              action: 		"items",
                  api_url: 		TRACKIT_API_URL_REPORT,
              user_name: 		userName
            });
        	},

          categories: function(userName) {
            return doPostRequest({
              action: 		"categories",
                  api_url: 		TRACKIT_API_URL_REPORT,
                  user_name: 		userName
            });
          },

          newReport: function(postData) {


            postData.action = "input";
            postData.api_url = TRACKIT_API_URL_REPORT;
            return doPostRequest(postData);
          },

          isPortland: function(x, y) {
            var strGeometry = "%7B%22x%22%3A" + x + "%2C%22y%22%3A" + y + "%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D";
            var url = API_BOUNDARY_URL + "?" +
              "geometry=" + strGeometry +
              "&geometryType=esriGeometryPoint&spacialRel=esriSpatialRelIntersects" +
              "&returnGeometry=false&returnTrueCurves=false&returnIdsOnly=false&returnCountOnly=false&returnDistinctValues=false&f=pjson";

            var returnVal = $http.get(url);
            return returnVal;
          },

          isParks: function(x, y) {
            var strGeometry = "%7B%22x%22%3A" + x + "%2C%22y%22%3A" + y + "%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D";
            var url = API_PARKS_BOUNDARY_URL + "?" +
              "geometry=" + strGeometry +
              "&geometryType=esriGeometryPoint&spacialRel=esriSpatialRelIntersects" +
              "&returnGeometry=false&returnTrueCurves=false&returnIdsOnly=false&returnCountOnly=false&returnDistinctValues=false&f=pjson";

            var returnVal = $http.get(url);
            return returnVal;
          }
        };
    });

}


const DEFAULT_LATITUDE = 45.51;
const DEFAULT_LONGITUDE = -122.65;
const DEFAULT_ZOOM = 11;
const HELP_EXPIRE_DAYS = 90; 
const LOGIN_EXPIRE_MINUTES = 30;
const LOGOFF_WARN_MINUTES = 5;
const IMG_MAX_WIDTH = 1024;
const IMG_MAX_HEIGHT = 768;
const REPORTS_TOP_LIMIT = 10;
const TRACKIT_DEV_CATEGORY = { "address_input_id": "input270_1", "text_input_id" : "input270_9", "binary_input_id" : "input270_6" };
const TRACKIT_DEV_CATEGORY_ID = 270;
const VERIFY_QSTR_NAME = 'verify';
const ZOOM_POSITION = 'topright';

const HOME_HELP_NAME = "SplashHelp";
const MAP_HELP_NAME = "MapHelp";
const REPORT_HELP_NAME = "ReportHelp";

const CATEGORY_SORTING = {
	1459: 999
};

const ERROR_MESSAGES = {
	CategoriesFailed: '<b>An error has occurred.</b> Please refresh the page and try again. If the error persists, our <a href="#Help" ng-click="ActiveSection=\'Help\'">Help page</a> includes alternate contact methods for the relevant city bureaus.',
	ReportsFailed: "<b>An error has occurred. Your past reports could not be retrieved.</b> Please refresh the page and try again.",
	ReportsListParsingFailed: "A minor error occurred while sorting your past reports. It should not impact the core functionality of this app.",
	LocationFailed: "<b>Cannot detect your location.</b> Please verify that location services are enabled in your browser or mobile device and refresh this page.",
	ReportSubmissionFailed: '<b>An error has occurred. Please try again later.</b> If you continue to have problems, our <a href="#Help" ng-click="ActiveSection=\'Help\'">Help page</a> includes alternate contact methods for the relevant city bureaus.',
	OutOfBounds: 'The selected location is outside the Portland city limits and cannot be used to report an issue. If you believe this message is in error, please visit our <a href="#Help" ng-click="ActiveSection=\'Help\'">Help page</a> for alternate contact methods for the relevant city bureaus.',
	InvalidFileType: 'The selected file is not an image. Plesae select an image file and try again. If you continue to have problems, our <a href="#Help" ng-click="ActiveSection=\'Help\'">Help page</a> includes alternate contact methods for the relevant city bureaus.',
	LoginFailed: 'Login failed. Please try again or reset your password.',
	LoginServerError: 'Login failed. A server error occurred.',
	ServerError: 'A server error occurred.'
};


reporter.controller('mainController', ['$scope','$http','$sce','$cookies','$timeout','dataService','utilityService','Upload', function ($scope, $http, $sce, $cookies, $timeout, dataService, utilityService, Upload) {

    $scope.DismissHelp = {};
    $scope.DismissHelp[HOME_HELP_NAME] = $cookies.getObject(HOME_HELP_NAME);
    $scope.DismissHelp[MAP_HELP_NAME] = $cookies.getObject(MAP_HELP_NAME);
    $scope.DismissHelp[REPORT_HELP_NAME] = $cookies.getObject(REPORT_HELP_NAME);
    $scope.ShowSessionExpireAlert = false;

    $scope.CurrentUrl = utilityService.getCurrentUrl();

    $scope.ActiveSection;
    $scope.TopReports;
    $scope.MoreReports;
    $scope.Categories;
    $scope.UploadedFile;
    $scope.Map;
    $scope.ReportMarker;
    $scope.NewReport;

    $scope.SupportEmail = S1 + S2 + S3;
    $scope.InfoEmail = I1 + I2 + I3;

    var hasError = false;
    var locationErrorShown = false;

    $scope.AppVersion = APP_VERSION;
    var d = new Date();
    $scope.CopyrightYear = d.getFullYear();

    $scope.DevMode = DEV_MODE;
    $scope.MockMode = MOCK_MODE;


    var LocateControl = L.Control.extend({
        options: {
            position: "topright"
        },
        onAdd: function (map) {
            $scope.LocateControlContaier = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');

            $scope.LocateControlContaier.style.backgroundImage = "url(img/icon_locate.png)";
            $scope.LocateControlContaier.title = 'Locate me';

            $scope.LocateControlContaier.onclick = function(e){
                cancelEventBubble(e);
                locationErrorShown = false;
                $scope.Locate();
            };

            return $scope.LocateControlContaier;
        }
    });

    var ToggleAerialControl = L.Control.extend({
        options: {
            position: "topright"
        },
        onAdd: function (map) {
            $scope.AerialControlContaier = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');

            $scope.AerialControlContaier.style.backgroundImage = "url(img/icon_aerial.png)";
            $scope.AerialControlContaier.title = 'Toggle aerial view';

            $scope.AerialControlContaier.onclick = function(e){
                cancelEventBubble(e);
                locationErrorShown = false;
                $scope.ToggleAerialViewControl();
            };

            return $scope.AerialControlContaier;
        }
    });


    var cookie = $cookies.get(POG_USER_COOKIE_NAME);
    if (cookie) {
    	$scope.PogUser = JSON.parse(cookie);
    }
    $scope.IsLoggedIn = checkLogin();

    if ($scope.IsLoggedIn) {
        initApp();
    } else {
		document.location.hash = "#Login";
		$scope.ActiveSection = "SplashPanel";
		$scope.InitComplete = true;
    }

    function doLogin() {

        if (!MOCK_MODE) {
    		var userName = $scope.PogUser ? $scope.PogUser.user_name : $scope.Username;

            var promise = dataService.login(userName, $scope.Password);
            promise.then(function successCallback(result) {
                $scope.LoginMessage = "";
                if (result.data.user_name && result.data.user_name.length > 0) {



                	if (!$scope.PogUser || $scope.PogUser.user_name != result.data.user_name) {

                        $scope.PogUser = result.data;
			            $scope.IsLoggedIn = true;
				        $cookies.putObject(POG_USER_COOKIE_NAME, result.data, { 'expires': cookieExpirationDate(LOGIN_EXPIRE_MINUTES) });
				        $scope.LogoffTimer = window.setTimeout(warnLogoff, (LOGIN_EXPIRE_MINUTES-LOGOFF_WARN_MINUTES) * 60 * 1000);
                	}

		            addToHomescreen({
                         lifespan: 30,
                         maxDisplayCount: 2,
                         icon: false,
                         startDelay: 8
                    });

                	initApp();
                } else {
                	$scope.LoginMessage = ERROR_MESSAGES['LoginFailed'];
                    $scope.InitFailed = true;
                    $cookies.remove(POG_USER_COOKIE_NAME);
                    document.location = '#Login';
                }
            }, function failureCallback(result) {
                $scope.LoginMessage = ERROR_MESSAGES['LoginServerError'];
                $scope.InitFailed = true;
                document.location = '#Login';
            });

        } else {
            var user = dataService.login($scope.Username, $scope.Password);
    		$scope.PogUser = user;
	        $cookies.putObject(POG_USER_COOKIE_NAME, user, { 'expires': cookieExpirationDate(LOGIN_EXPIRE_MINUTES) });
	        $scope.LogoffTimer = window.setTimeout(warnLogoff, (LOGIN_EXPIRE_MINUTES-LOGOFF_WARN_MINUTES) * 60 * 1000);
            $scope.LoginMessage = "";
            $scope.IsLoggedIn = true;
            addToHomescreen({
                 lifespan: 30,
                 maxDisplayCount: 2,
                 icon: false,
                 startDelay: 8
            });

        	initApp();
        }
    }

    function initApp() {

        loadCategories();
        loadReports();

        $scope.Map = initBaseMap();
        $scope.PreviewMap = initReviewMap();

        switch (location.hash) {
            case "#MyReports":
                $scope.ActiveSection = "MyReports";
                break;
            case "#Help":
                $scope.ActiveSection = "Help";
                break;
            case "#NewReport":
            default:
                $scope.ActiveSection = "NewReport";
                $scope.NewReportActiveSection = "SelectCategory";
                break;
        }
        $scope.InitComplete = true;
    }

    $scope.Login = function() {
        $scope.LoginMessage = "Logging in...";
        doLogin();
    };

    function loadReports() {
        var reportsPromise = dataService.reports($scope.PogUser.user_name);
        if (!MOCK_MODE) {
            reportsPromise.then(function successCallback(response) {
            	if (response.data.status && response.data.status == "error") {
            		displayErrorMessage(ERROR_MESSAGES.ReportsFailed, response.data.error.message);
            		$scope.$apply();
            	} else {
	                var allReports = response.data;
	                parseReports(allReports.items);
	                $scope.ReportsLoaded = true;
	                resetLogoff();
            	}
            }, function failureCallback(result) {
                displayErrorMessage(ERROR_MESSAGES.ReportsFailed, result.statusText + " (" + result.status + ")");
            	$scope.$apply();
            });
        } else {
            parseReports(reportsPromise.items);
            $scope.ReportsLoaded = true;
        }
    }

    function loadCategories() {
        var catsPromise = dataService.categories($scope.PogUser.user_name);
        if (!MOCK_MODE) {
            catsPromise.then(function  successCallback(response) {
            	if (response.data.status && response.data.status == "error") {
            		displayErrorMessage(ERROR_MESSAGES.CategoryRetrievalFailed, response.data.error.message);
                	$scope.$apply();
            	}
                $scope.Categories = response.data;
                processCategoryText($scope.Categories);
                $scope.CategoriesLoaded = true;
                sortCategories();
            }, function failureCallback(result) {
                displayErrorMessage(ERROR_MESSAGES.CategoriesFailed, result.statusText + " (" + result.status + ")");
            	$scope.$apply();
            });
        } else {
            $scope.Categories = catsPromise;
            processCategoryText($scope.Categories);
            $scope.CategoriesLoaded = true;
            sortCategories();
        }
    }

    function compareReports(a, b) {
        if (a.id < b.id)
            return 1;
        if (a.id > b.id)
            return -1;
        return 0;
    }

    function parseReports(allReports) {
    	try {

            if (!allReports || allReports.length < 1) return;

	        allReports.sort(compareReports);
	        if (allReports.length <= REPORTS_TOP_LIMIT) {
	            $scope.TopReports = allReports;
	        } else {
	            $scope.TopReports = allReports.splice(0, REPORTS_TOP_LIMIT);
	            $scope.MoreReports = allReports;
	        }

    	} catch (err) {
    		$scope.TopReports = allReports;
    		displayErrorMessage(ERROR_MESSAGES.ReportsListParsingFailed, err);
    	} finally {

    	}
	}

    window.onhashchange = navigate;

    function navigate() {
        (location.hash === "#NewReport") && navigateNewReport();
        (location.hash === "#MyReports") && navigateMyReports();
        (location.hash === "#Help") && navigateHelp();
    }

    function navigateNewReport() {
        $scope.ActiveSection = 'NewReport';
        $scope.NewReportActiveSection = 'SelectCategory';
        $scope.$apply();
    }

    function navigateMyReports() {
        $scope.ActiveSection = 'MyReports';
        $scope.NewReportActiveSection = 'SelectCategory'; 
        $scope.$apply();
    }

    function navigateHelp() {
        $scope.ActiveSection = 'Help';
        $scope.NewReportActiveSection = 'SelectCategory'; 
        $scope.$apply();
    }


    $scope.Register = function() {
        var returnUrl = encodeURI($scope.CurrentUrl);
        var loginUrl = encodeURIComponent("https://www.portlandoregon.gov/apps/external/redir2.cfm?sendTo=" + returnUrl + "&secure=no&https=no");
        var registerUrl = "https://www.portlandoregon.gov/index.cfm?&new=1&login=1&employeepick=no&referer=" + returnUrl + "%3Flogin%3Dtrue";
        document.location = registerUrl;
    };

    $scope.ForgotPassword = function() {
        var returnUrl = encodeURI($scope.CurrentUrl);
        var forgotUrl = "https://www.portlandoregon.gov/index.cfm?&login=1&forgot=1&referer=%2F" + returnUrl;
        document.location = forgotUrl;
    };

    $scope.LogOut = function() {
        logOut();
    };

    $scope.UpdateMyInfo = function() {
        window.open("https://www.portlandoregon.gov/myaccount.cfm");
    };

    $scope.selectCategory = function(category) {
        selectCategory(category);
    };

    $scope.showMap = function() {
        if (!$scope.LocateControl) {
            $scope.LocateControl = new LocateControl();
            $scope.Map.addControl($scope.LocateControl);
        }
        setTimeout(function () { $scope.Map.invalidateSize(); }, 0);

        if (!$scope.NewReport.location.value) {
        	geoLocate();
        }
    };

    $scope.selectPhoto = function() {
        selectPhoto();
    };

    $scope.clearPhoto = function() {
        clearPhoto();
    };

    $scope.previewUpload = function(input) {
        previewUpload(input);
    };

    $scope.submitReport = function() {
        submitReport();
    };

    $scope.clearForm = function() {
        clearForm(true);
    };

    $scope.DismissAlert = function() {
        if ($scope.LoginMessage) {
            $scope.LoginMessage = '';
        }
    };

    $scope.DismissModal = function(modalName, notShowAgain) {
        if (notShowAgain) {
            $cookies.putObject(modalName, 1, { 'expires': cookieExpirationDate(HELP_EXPIRE_DAYS * 24 * 60) });
        }
        $scope.DismissHelp[modalName] = 1;
    };

    $scope.Locate = function() {
        geoLocate();
    };

    $scope.ToggleAerialViewControl = function () {
    	if ($scope.CurrentView != "aerial") {
	    	$scope.Map.removeLayer($scope.baseLayer);
	    	$scope.Map.addLayer($scope.aerialLayer);
   			$scope.CurrentView = "aerial";
   			$scope.AerialControlContaier.style.backgroundImage = 'url("img/icon_aerial_active.png")';
    	} else {
	    	$scope.Map.removeLayer($scope.aerialLayer);
	    	$scope.Map.addLayer($scope.baseLayer);
   			$scope.CurrentView = "base";
   			$scope.AerialControlContaier.style.backgroundImage = 'url("img/icon_aerial.png")';
    	}
    }

    $scope.DoShowAllReports = function() {
        $scope.ShowAllReports = true;
    };

    $scope.ResetMaps = function() {

    };

    $scope.SaveLocation = function () {
        $scope.NewReportActiveSection = "Details";


    };


    function checkLogin() {
	    if (!$scope.PogUser || !$scope.PogUser.user_name) {
	        return false;
	    }

	    return true;
    }

    function warnLogoff() {
    	$scope.ShowSessionExpireAlert = true;
    }

    function finalLogoff() {
    	logOut();
    }

    $scope.refreshSession = function() {
    	$scope.ShowSessionExpireAlert = false;
    	loadReports();
    }

    function resetLogoff() {
    	$cookies.remove(POG_USER_COOKIE_NAME);
        $cookies.putObject(POG_USER_COOKIE_NAME, $scope.PogUser, { 'expires': cookieExpirationDate(LOGIN_EXPIRE_MINUTES) });
        if ($scope.LogoffTimer) window.clearTimeout($scope.LogoffTimer);
        if ($scope.LogoffTimerFinal) window.clearTimeout($scope.LogoffTimerFinal);
        var milliseconds = (LOGIN_EXPIRE_MINUTES-LOGOFF_WARN_MINUTES) * 60 * 1000;
        $scope.LogoffTimer = window.setTimeout(warnLogoff, milliseconds);
        $scope.LogoffTimerFinal = window.setTimeout(finalLogoff, LOGIN_EXPIRE_MINUTES * 60 * 1000);
    }

	function geoLocate() {
        var t = setTimeout(function() {
            $scope.Map.locate({ watch: false, setView: true, maximumAge: 20000, enableHighAccuracy: true });
        }, 500);
    }

    function sortCategories() {

        if (!$scope.Categories || !$scope.Categories.categories || $scope.Categories.categories.length < 1) return;

        for (var i = 0; i < $scope.Categories.categories.length; i++) {
            var cat = $scope.Categories.categories[i];
            if (CATEGORY_SORTING.hasOwnProperty(cat.category_id)) {
                cat.sort = CATEGORY_SORTING[cat.category_id];
            } else {
                cat.sort = 500; 
            }
        }

        $scope.Categories.categories.sort(compareCategories);

    }

    function compareCategories(a, b) {
        if (a.sort < b.sort)
            return -1;
        if (a.sort > b.sort)
            return 1;

        if (a.input_alias < b.input_alias)
            return -1;
        if (a.input_alias > b.input_alias)
            return 1;
        return 0;
    }

    function cookieExpirationDate(minutes) {
        return new Date(Date.now() + (minutes * 60 * 1000));
    }

    function selectCategory(category) {

    	var fileName = "html/" + category.category_id + ".html?cb=" + CACHE_BUSTER;
    	$scope.CategoryMessageUrl = fileName;


        if (!$scope.NewReport) {
            $scope.NewReport = {
                category:   { key: "category_id", required: 1, contact_type_id: category.contact_type_id },
                location:   { key: category.address_input_id, required: category.address_input_required },
                file:       { key: category.binary_input_id, required: category.binary_input_required },
                comments:   { key: category.text_input_id, required: category.text_input_required },

                isReportValid: function() {
                    return isFieldValid(this.category) &&
                        isFieldValid(this.location) &&
                        isFieldValid(this.file) &&
                        isFieldValid(this.comments);
                }
            };
        }


        $scope.NewReport.category.value = category;
        $scope.NewReport.category.isValid = true;
        $scope.NewReportActiveSection = "Details";

        setTimeout(function () {
            $scope.Map.invalidateSize();
        }, 0);
    }

    function isFieldValid(field) {
        if (!field.required || field.value) {
            field.isValid = true;
        } else {
            field.isValid = false;
        }

        return field.isValid;
    }

    // function isLocationValid(field) {
    // 	var loc = $scope.NewReport.location.value;
    // 	return dataService.isPortland(loc.x, loc.y);
    // }

    function clearPhoto() {
        var input = $("#UploadFile");
        input.val("");
        $scope.NewReport.file.value = null;
        previewUpload(input);
    }

    function previewUpload(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onloadend = function (e) {
            	if (!$scope.NewReport.file.value.files[0].type.match(/image.*/)) {
            		displayErrorMessage(ERROR_MESSAGES.InvalidFileType);
            		clearPhoto();
            		$scope.$apply();
            		return false;
            	}
                if (e.target.result) {
                    $(".uploadReview").attr("src", e.target.result).show();
                    $("label.photo, div.report-item.photo").show();
                    $("#btnPhotoNext").removeAttr("disabled");
                    $("#btnClearPhoto").removeAttr("disabled");
                }
            };
            reader.readAsDataURL(input.files[0]);
        } else {
            $(".uploadPreview").attr("src", "img/icon_upload.png");
            if ($scope.NewReport.category.value.binary_input_required) {
                $("#btnPhotoNext").attr("disabled", "disabled");
                $("#btnClearPhoto").attr("disabled", "disabled");
            }
        }
    }

    function submitReport() {

    	$scope.ShowSubmitStatus = true;


        if (DEV_MODE) {
            $scope.NewReport.category.value = TRACKIT_DEV_CATEGORY;
        }

        $address_input_id_lat = $scope.NewReport.category.value.address_input_id + '_lat';
        $address_input_id_long = $scope.NewReport.category.value.address_input_id + '_long';
        $text_input_id = $scope.NewReport.category.value.text_input_id;
        $binary_input_id = $scope.NewReport.category.value.binary_input_id;

        var postData = { category_id: DEV_MODE ? TRACKIT_DEV_CATEGORY_ID : $scope.NewReport.category.value.category_id };
        postData[$address_input_id_lat]     = $scope.ReportMarker.feature.geometry.coordinates[0];
        postData[$address_input_id_long]    = $scope.ReportMarker.feature.geometry.coordinates[1];
        postData[$text_input_id]            = $scope.NewReport.comments.value ? $scope.NewReport.comments.value : "";

        postData["user_name"]               = $scope.PogUser.user_name;

        postData["contact_type_id"]         = $scope.NewReport.category.contact_type_id;

        if ($scope.NewReport.file.value && $scope.NewReport.file.value.files[0].type.match(/image.*/)) {
            var file = $scope.NewReport.file.value.files[0];

            if (isCanvasSupported()) {
	            var reader = new FileReader();
	            var img = new Image();

	            img.onload = function() {

	                var newWidth = img.width;
	                var newHeight = img.height;
	                if (newWidth > newHeight) {
	                    if (newWidth > IMG_MAX_WIDTH) {
	                       newHeight *= IMG_MAX_WIDTH / newWidth;
	                       newWidth = IMG_MAX_WIDTH;
	                    }
	                } else {
	                    if (newHeight > IMG_MAX_HEIGHT) {
	                       newWidth *= IMG_MAX_HEIGHT / newHeight;
	                       newHeight = IMG_MAX_HEIGHT;
	                    }
	                }

	                try {
		                var canvas = document.createElement('canvas');
		                canvas.width = newWidth;
		                canvas.height = newHeight;
		                var ctx = canvas.getContext("2d");
		                ctx.drawImage(this, 0, 0, newWidth, newHeight);
		                var dataURL = canvas.toDataURL("image/jpeg");

		            	var blob = dataURItoBlob(dataURL);
		            	var testBlob = new Blob([blob], { type: "image/jpeg" });
		            	testBlob.name = file.name;
		            	testBlob.size = file.size;
		            	testBlob.lastModifiedDate = new Date();
		            	postData[$binary_input_id] = testBlob;
		            	processSubmit(postData);

	                } catch (err) {
	                	displayErrorMessage("", "Browser may not support FileAPI.");
	                	$scope.ShowSubmitStatus = false;
	                	$scope.$apply();
	                } finally {
	                }
	            };

	            reader.onload = function() {
	            	img.src = reader.result;
	            };

	            reader.readAsDataURL(file);

            } else {
            	postData[$binary_input_id] = file;
            	processSubmit(postData);
            }

        } else {
	        processSubmit(postData);
        }
    }

	function isCanvasSupported(){
		var elem = document.createElement('canvas');
		return !!(elem.getContext && elem.getContext('2d'));
	}

	function dataURItoBlob(dataURI) {
	    var byteString = atob(dataURI.split(',')[1]);
	    var ab = new ArrayBuffer(byteString.length);
	    var ia = new Uint8Array(ab);
	    for (var i = 0; i < byteString.length; i++) {
	        ia[i] = byteString.charCodeAt(i);
	    }
	    return new Blob([ab], { type: 'image/jpeg' });
	}

    function processSubmit(postData) {
        var showError = utilityService.getUrlVar("error");

        var promise = dataService.newReport(postData, showError);

		var myDiv = document.getElementById('Details');
		myDiv.scrollTop = 0;

        if (!MOCK_MODE) {
            promise.then(function successCallback(result) {
		    	$scope.ShowSubmitStatus = false;
                if (result.data.hasOwnProperty("status") && result.data.status == "success") {
                    $scope.NewReportId = result.data.item_id;
                    $scope.NewReportStatus = result.data.status;
                    $scope.NewReportActiveSection = 'Confirmation';
                    clearForm(); 
                    loadReports();
                } else {
                    displayErrorMessage(ERROR_MESSAGES.ReportSubmissionFailed,
                    	result.data.error && result.data.error.message ? result.data.error.message : ERROR_MESSAGES['ServerError']);
                }
            }, function failureCallback(result) {
		    	$scope.ShowSubmitStatus = false;
                displayErrorMessage(ERROR_MESSAGES.ReportSubmissionFailed, result.statusText + " (" + result.status + ")");
            });
        } else {
        	setTimeout(function() {
			    $scope.ShowSubmitStatus = false;
	            if (promise.hasOwnProperty("status") && promise.status == "success"){
	                $scope.NewReportId = promise.item_id;
	                $scope.NewReportStatus = promise.status;
	                $scope.NewReportActiveSection = 'Confirmation';
	                clearForm();
	            } else {
	                displayErrorMessage(ERROR_MESSAGES.ReportSubmissionFailed);
	                clearForm();
	            }
	            $scope.$apply();
        	}, 3000);
        }
    }

    function displayErrorMessage(mainMessage, serverMessage) {
    	if (mainMessage) {
    		$scope.AlertMessage = mainMessage;
    	} else {
    		$scope.AlertMessage = 'An error has occurred. Please refresh the page and try again. If you are still unable to submit your report, our <a href="#Help" ng-click="ActiveSection=\'Help\'">Help page</a> includes alternate contact methods for the relevant city bureaus.';
    	}
    	if (serverMessage) {
    		$scope.AlertMessage += "<br><i>Technical details: " + serverMessage + "</i>";
    	}
    }

    function logOut() {
        $cookies.remove(POG_USER_COOKIE_NAME);
        $scope.VerifySave = "";
        $scope.PogUser = null;

        var promise = dataService.logoff();
        if (!MOCK_MODE) {
            promise.then(function successCallback(result) {
                var logoffSuccessful = result.data.logoffvalid;
                console.log("User successfully logged off.");
            });
        } else {
            if (promise.hasOwnProperty("logoffvalid") && promise.logoffvalid == true) {
                console.log("User successfully logged off.");
            }
        }
        document.location = utilityService.getCurrentOrigin();
    }

    function clearForm(returnHome) {
        if ($scope.ReportMarker) {
            $scope.Map.removeLayer($scope.ReportMarker);
        }
        $scope.ReportMarker = null;
        $scope.UploadedFile = null;
        $scope.NewReport = null;
        $("#btnPhotoNext").attr("disabled", "disabled");
        $("#btnClearPhoto").attr("disabled", "disabled");
        $("#btnLocationNext").attr("disabled", "disabled");
    }


    function initBaseMap() {

        var zoomcontrols = new L.control.zoom({ position: ZOOM_POSITION });
        var map = new L.Map("LeafletMap", {
            center: new L.LatLng(DEFAULT_LATITUDE, DEFAULT_LONGITUDE),
            zoomControl: false,
            zoom: DEFAULT_ZOOM
        });

        $scope.baseLayer = L.tileLayer('https://www.portlandmaps.com/arcgis/rest/services/Public/Basemap_Color_Complete/MapServer/tile/{z}/{y}/{x}', {
            attribution: "PortlandMaps ESRI"
        });
        $scope.aerialLayer = L.tileLayer('https://www.portlandmaps.com/arcgis/rest/services/Public/Basemap_Color_Complete_Aerial/MapServer/tile/{z}/{y}/{x}', {
            attribution: "PortlandMaps ESRI"
        });
        map.addLayer($scope.baseLayer);

        map.addControl(zoomcontrols);

        if (!$scope.LocateControl) {
            $scope.LocateControl = new LocateControl();
            map.addControl($scope.LocateControl);
        }

        if (!$scope.AerialViewControl) {
        	$scope.AerialViewControl = new ToggleAerialControl();
        	map.addControl($scope.AerialViewControl);
        }

        map.on('click', selectLocation);
        map.on('locationfound', onLocationFound);
        map.on('locationerror', onLocationError);

        return map;
    }

    function initReviewMap() {
        var zoomcontrols = new L.control.zoom({ position: ZOOM_POSITION });
        var map = new L.Map("ReviewMap", {
            center: new L.LatLng(DEFAULT_LATITUDE, DEFAULT_LONGITUDE),
            zoomControl: false,
            zoom: 18,
            dragging: false,
            touchZoom: false,
            scrollWheelZoom: false,
            doubleClickZoom: false,
            boxZoom: false
        });

        var baseLayer = L.tileLayer('https://www.portlandmaps.com/arcgis/rest/services/Public/Basemap_Color_Complete/MapServer/tile/{z}/{y}/{x}', {
            attribution: "PortlandMaps ESRI"
        });
        map.addLayer(baseLayer);

        map.scrollWheelZoom.disable();
        map.addControl(zoomcontrols);

        return map;
    }

    function selectLocation(e) {

    	$scope.AlertMessage = '';

    	setTimeout(function () {
    		if (!MOCK_MODE) {
          // there are some areas outside the city boundary that are serviced by PP&R.
          // if the isPortland check fails, we need to run the isParks query. alternately,
          // we could only run the isParks query if the Park Maintenance category is
          // selected, but first we would need to check with the bureaus to see if any
          // other categories might be applicable to the extra-city locations.
          // if ($scope.NewReport.category.value.category_id == 1206) // use isPortland function
	    		var promise = dataService.isPortland(e.latlng.lng, e.latlng.lat);
		    	promise.success(function (data) {
		    		if (!data.features || data.features.length < 1 || data.features[0].attributes.CITYNAME.toLowerCase() != "portland") {
                // not in city boundary; try parks boundary search before displaying out of bounds message
                var parkspromise = dataService.isParks(e.latlng.lng, e.latlng.lat);
                parkspromise.success(function (data) {
                  if (!data.features || data.features.length < 1) {
                    // not in parks boundary either, display error message
                    displayErrorMessage(ERROR_MESSAGES.OutOfBounds);
                    return;
                  } else if (true) {
                    selectLocationHandler(e);
                  }
                });
		    		} else if (data.features[0].attributes.CITYNAME.toLowerCase() == "portland") {
		    			selectLocationHandler(e);
		    		}
		    	})
		    	.error(function () {
		    		selectLocationHandler(e);
		    	});

    		} else {
    			selectLocationHandler(e);
    			$scope.$apply();
    		}
	    }, 250);
    }

    function selectLocationHandler(e) {

        if ($scope.ReportMarker) {
            $scope.Map.removeLayer($scope.ReportMarker);
        }
        if ($scope.ReportPreviewMarker) {
            $scope.PreviewMap.removeLayer($scope.ReportPreviewMarker);
        }

        var geojsonFeature = {
            "type": "Feature",
            "properties": {},
            "geometry": {
                    "type": "Point",
                    "coordinates": [e.latlng.lat, e.latlng.lng]
            }
        };

        L.geoJson(geojsonFeature, {
            pointToLayer: function(feature, latlng){
                $scope.ReportMarker = L.marker(e.latlng, {
                    icon: issueIcon,
                    title: "Report Location",
                    alt: "Report Location",
                    riseOnHover: true,
                    draggable: true,
                }).bindPopup("<p><b>Location:</b><br>Latitude: " + e.latlng.lat + "<br>Longitude: " + e.latlng.lng);
                $scope.ReportMarker.on("popupopen", onPopupOpen);
                return $scope.ReportMarker;
            }
        }).addTo($scope.Map);

        L.geoJson(geojsonFeature, {
            pointToLayer: function(feature, latlng){
                $scope.ReportPreviewMarker = L.marker(e.latlng, {
                    icon: issueIcon,
                    title: "Report Location",
                    alt: "Report Location",
                    riseOnHover: true,
                    draggable: false,
                });
                return $scope.ReportPreviewMarker;
            }
        }).addTo($scope.PreviewMap);

		$scope.NewReport.location.value = $scope.ReportMarker.feature.geometry;
        $scope.NewReport.location.isValid = true;

        $scope.PreviewMap.panTo(new L.LatLng($scope.ReportMarker.feature.geometry.coordinates[0], $scope.ReportMarker.feature.geometry.coordinates[1]));
        setTimeout(function () { $scope.PreviewMap.invalidateSize(); }, 0);
    }

    function onPopupOpen() {
        var tempMarker = this;
        $(".marker-delete-button:visible").click(function () {
            $scope.Map.removeLayer(tempMarker);
        });
    }

    function onLocationFound(e) {
        if (!$scope.LocateControl) {
            $scope.LocateControl = new locateControl();
            $scope.Map.addControl($scope.LocateControl);
        }

        if ($scope.locMarker && $scope.locCircle) {
            $scope.Map.removeLayer($scope.locMarker).removeLayer($scope.locCircle);
        }
        var radius = e.accuracy;
        $scope.locMarker = L.marker(e.latlng, { icon: hereIcon }).addTo($scope.Map);
        $scope.locCircle = L.circle(e.latlng, radius, { weight: 2, fillOpacity: 0.1 }).addTo($scope.Map);

        var circleBounds = $scope.locCircle.getBounds();

		$scope.LocateControlContaier.style.backgroundImage = 'url("img/icon_locate_blue.png")';


    }

    function onLocationError(e) {
        if ($scope.locMarker && $scope.locCircle) {
            $scope.Map.removeLayer($scope.locMarker).removeLayer($scope.locCircle);
        }

        $scope.Map.setView(new L.LatLng(DEFAULT_LATITUDE, DEFAULT_LONGITUDE), DEFAULT_ZOOM);

        if (!locationErrorShown) {
        	displayErrorMessage(ERROR_MESSAGES.LocationFailed);
	        locationErrorShown = true;
        }

		$scope.LocateControlContaier.style.backgroundImage = 'url("img/icon_locate.png")';
        $scope.$apply();
    }

    var hereIcon = L.icon({
        iconUrl:    "img/marker_here.png",
        iconSize:   [25, 41],
        iconAnchor: [13, 41],
        className:  "hereIcon"
    });

    var issueIcon = L.icon({
        iconUrl:    "img/marker_issue.png",
        iconSize:   [25, 41],
        iconAnchor: [13, 41],
        className:  "issueIcon"
    });



}]);


function selectPhoto(e) {
    $scope = angular.element(e).scope();
    $scope.previewUpload(e);
    $scope.NewReport.file.value = e;
    $scope.NewReportActiveSection='Details';
    $scope.$apply();
}




function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function getUrlVar(key) {
	var vars = getUrlVars();
	if (vars && vars[key]) {
		return vars[key];
	}
	return "";
}

function cancelEventBubble(e) {
    var evt = e ? e:window.event;
    if (evt.stopPropagation) evt.stopPropagation();
    if (evt.cancelBubble != null) evt.cancelBubble = true;
}



reporter.factory('utilityService', function($http, $cookies) {


    return {

        getUrlVars: function() {
            return getUrlVars();
        },

        getUrlVar: function(key) {
        	var vars = getUrlVars();
        	if (vars && vars[key]) {
        		return vars[key];
        	}
        	return "";
        },

        getCurrentUrl: function() {
            return document.location.href;
        },

        getCurrentOrigin: function() {
        	return document.location.origin;
        },

        cancelEventBubble: function(e) {
            cancelEventBubble(e);
        }

    }
});