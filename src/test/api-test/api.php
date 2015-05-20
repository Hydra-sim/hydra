#!/usr/local/bin/php
<?php

require_once 'color.class.php';
require_once 'test.class.php';
require_once 'testcollection.class.php';

$testcollection = new testCollection('http://localhost:8082/');

$testcollection->runTest('timetables', function($domain) {
	$url = $domain . 'api/timetable';

	echo 'calling ' . $url . "\n";
	$ch = $this->curl_setup($url);
	$this->curl_run($ch);
});


$testcollection->runTest('OSLPreset', function($domain) {
	$url = $domain . 'api/simulation';
	$data_json = file_get_contents('testdata/OSLPreset.json');

	echo 'calling ' . $url . "\n";
	$ch = $this->curl_setup($url);
	curl_setopt($ch, CURLOPT_POST, true);
	curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json','Content-Length: ' . strlen($data_json)));
	curl_setopt($ch, CURLOPT_POSTFIELDS,$data_json);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	echo $this->curl_run($ch);
});