<?php
header('Content-Type: application/json');
error_reporting(0);
session_start();
require_once("twitteroauth/twitteroauth/twitteroauth.php"); //Path to twitteroauth library
 
$twitteruser = "@phivolcs_dost";
$notweets = 10;
$consumerkey = "rDSv1jgtQPMkKQKqY0ePAGkZv";
$consumersecret = "l6PWJRevDlOxLXM91lNhnqrXndJbwCfXd8Cddo8sPygRzh8Fls";
$accesstoken = "1214070856432807937-mU8pfQqofyUgqlEmuUcQ7lqpgh8jgn";
$accesstokensecret = "1UdPOCh0qbqZ0WKiHxExZpi0mCMqJmw6YDpBabmFWgv3y";
 
function getConnectionWithAccessToken($cons_key, $cons_secret, $oauth_token, $oauth_token_secret) {
  $connection = new TwitterOAuth($cons_key, $cons_secret, $oauth_token, $oauth_token_secret);
  return $connection;
}
 
$connection = getConnectionWithAccessToken($consumerkey, $consumersecret, $accesstoken, $accesstokensecret);
 
$tweets = $connection->get("https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=".$twitteruser."&count=".$notweets."&trim_user&tweet_mode=extended");
$equake = array();
foreach ($tweets as $tweetkey	 => $tweetvalue) {
	//print_r($tweetvalue);
	if (strpos($tweetvalue->full_text, 'Earthquake Information No.'))
		{
			$data = explode('Earthquake Information No.', $tweetvalue->full_text);
			//$strs = explode($data[0], "'\n");

			
				$dateAndTime =  str_man($data[1], "Time:", "Magnitude");
				$magnitude =str_man($data[1], "Magnitude", "Depth");
				$depth =  str_man($data[1], "Depth", "Location");
				$location =str_man($data[1], "Location", "https");

				$timebefore = explode("-", $dateAndTime)[1];
				
				
				$year = date("Y",time());	
				$month = date("F", time());
				$day = date("d", time());
				$month_num = date("m", time());
                $timeafter = date('H:i', strtotime('-8 hours', strtotime($timebefore)) );
                $timeafter = str_replace(":", "", $timeafter);
				
                if(strtotime($timeafter) > strtotime("15:59") && strtotime($timebefore) < strtotime("09:00") )
                       {
                         
                        if($day == 1){
                            $day = date("d", strtotime('-1 day',time()));
                            $month = date("F", strtotime('-1 month',time()));
                        }else if($month == 1){
                             $year = date("Y",strtotime('-1 year',time())); 
                              $month = date("F", strtotime('-1 month',time()));
                              $day = date("d", strtotime('-1 day',time()));
                        }else{
                            $day = date("d", strtotime('-1 day',time()));
                        }
                        
                       } 

               
				$link = "https://earthquake.phivolcs.dost.gov.ph/".$year."_Earthquake_Information/".$month."/".$year."_".$month_num.$day."_".$timeafter;

                $suffix = ["_B1.jpg","_B2.jpg","_B1F.jpg","_B2F.jpg"];
                
                 foreach($suffix as $suf){
                    //echo $suf."<br>";
                    //echo 
                     $link_cpy = filter_var($link.$suf, FILTER_VALIDATE_URL);
                     //echo $link_cpy."<br>";
                    if($link_cpy != false){
                         $link = $link.$suf;
                        break;
                    }//else
                        //echo "counter $x++";
                }
				
				$lat = explode(",", $location)[0];
				$lng = str_man( explode(",", $location)[1], "", "-");

				$lat = convertDMSToDecimal( str_replace(" ", "", $lat));
				$lng = convertDMSToDecimal( str_replace(" ", "", $lng));

				$equake_items = array(
					"DateAndTime" => $dateAndTime,
					"Magnitude" => str_replace(" ", "", $magnitude),
					"Depth" => $depth,
					"Location" => $location,
					"Latitude" => $lat,
					"LongiTude" => $lng,
                    "link" => $link,
				);

				$equake[] = $equake_items;	

		}
	}	

 echo json_encode($equake, JSON_PRETTY_PRINT);
 
 

 function str_man($str, $string_start, $string_end){
 			$sub = substr($str, strpos($str,$string_start)+strlen($string_start),strlen($str));
			$sub = substr($sub,0,strpos($sub,$string_end));
			//print_r($data);	
			$sub = str_replace("=", "", $sub);
			$sub = str_replace("\n", "", $sub);
			return $sub;
 }

 function convertDMSToDecimal($latlng) {
    $valid = false;
    $decimal_degrees = 0;
    $degrees = 0; $minutes = 0; $seconds = 0; $direction = 1;

    // Determine if there are extra periods in the input string
    $num_periods = substr_count($latlng, '.');
    if ($num_periods > 1) {
        $temp = preg_replace('/\./', ' ', $latlng, $num_periods - 1); // replace all but last period with delimiter
        $temp = trim(preg_replace('/[a-zA-Z]/','',$temp)); // when counting chunks we only want numbers
        $chunk_count = count(explode(" ",$temp));
        if ($chunk_count > 2) {
            $latlng = preg_replace('/\./', ' ', $latlng, $num_periods - 1); // remove last period
        } else {
            $latlng = str_replace("."," ",$latlng); // remove all periods, not enough chunks left by keeping last one
        }
    }
    
    // Remove unneeded characters
    $latlng = trim($latlng);
    $latlng = str_replace("º"," ",$latlng);
    $latlng = str_replace("°"," ",$latlng);
    $latlng = str_replace("'"," ",$latlng);
    $latlng = str_replace("\""," ",$latlng);
    $latlng = str_replace("  "," ",$latlng);
    $latlng = substr($latlng,0,1) . str_replace('-', ' ', substr($latlng,1)); // remove all but first dash

    if ($latlng != "") {
    	// DMS with the direction at the start of the string
        if (preg_match("/^([nsewoNSEWO]?)\s*(\d{1,3})\s+(\d{1,3})\s*(\d*\.?\d*)$/",$latlng,$matches)) {
            $valid = true;
            $degrees = intval($matches[2]);
            $minutes = intval($matches[3]);
            $seconds = floatval($matches[4]);
            if (strtoupper($matches[1]) == "S" || strtoupper($matches[1]) == "W")
                $direction = -1;
        }
        // DMS with the direction at the end of the string
        elseif (preg_match("/^(-?\d{1,3})\s+(\d{1,3})\s*(\d*(?:\.\d*)?)\s*([nsewoNSEWO]?)$/",$latlng,$matches)) {
            $valid = true;
            $degrees = intval($matches[1]);
            $minutes = intval($matches[2]);
            $seconds = floatval($matches[3]);
            if (strtoupper($matches[4]) == "S" || strtoupper($matches[4]) == "W" || $degrees < 0) {
                $direction = -1;
                $degrees = abs($degrees);
            }
        }
        if ($valid) {
            // A match was found, do the calculation
            $decimal_degrees = ($degrees + ($minutes / 60) + ($seconds / 3600)) * $direction;
        } else {
            // Decimal degrees with a direction at the start of the string
            if (preg_match("/^([nsewNSEW]?)\s*(\d+(?:\.\d+)?)$/",$latlng,$matches)) {
                $valid = true;
                if (strtoupper($matches[1]) == "S" || strtoupper($matches[1]) == "W")
                    $direction = -1;
                $decimal_degrees = $matches[2] * $direction;
            }
            // Decimal degrees with a direction at the end of the string
            elseif (preg_match("/^(-?\d+(?:\.\d+)?)\s*([nsewNSEW]?)$/",$latlng,$matches)) {
                $valid = true;
                if (strtoupper($matches[2]) == "S" || strtoupper($matches[2]) == "W" || $degrees < 0) {
                    $direction = -1;
                    $degrees = abs($degrees);
                }
                $decimal_degrees = $matches[1] * $direction;
            }
        }
    }
    if ($valid) {
        return $decimal_degrees;
    } else {
        return false;
    }
}




?>
