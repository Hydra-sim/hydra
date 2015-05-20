<?php

class test
{
	private $name;
	private $currentTest;

	public function __construct($name) {
		$this->name = $name;
		$this->currentTest = 0;
	}

	public function begin() {
		echo Color::set("Beginning test " . $this->name . "\n", "green+bold");
		$this->currentTest = microtime();
	}

	public function end() {
		return microtime() - $this->currentTest;
	}

	public function curl_setup($url) {
		$ch = curl_init(); // create curl resource 
	    curl_setopt($ch, CURLOPT_URL, $url); // set url 
	    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); //return the transfer as a string 
	    return $ch;
	}

	public function curl_run($ch) {
		$output = curl_exec($ch); // $output contains the output string 
	    curl_close($ch); // close curl resource to free up system resources 

	    return $output;
	}
}