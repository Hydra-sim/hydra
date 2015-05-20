<?php

class testCollection
{
	private $timing = array();
	private $tests = array();
	private $domain;

	public function __construct($domain) {
		$this->domain = $domain;
	}

	public function __destruct() {
		echo Color::set("Timing\n", "green+bold");
		foreach($this->timing as $key => $value) {
			echo Color::set($key . ": ", "bold") . $value . "s\n";
		}
	}

	public function runTest($name, $func) {
		$testclass = $this->getTestClass($name);

		$test = $func->bindTo($testclass);

		$testclass->begin();
			$output = $test($this->domain);
		$this->saveTime(
			$name,
			$testclass->end()
		);

		return $output;
	}

	private function getTestClass($name) {
		if(!isset($this->tests[$name])) {
			$this->newTest($name);
		}
		return $this->tests[$name];
	}

	private function newTest($name) {
		$this->tests[$name] = new Test($name);
	}

	private function saveTime($name, $time) {
		$this->timing[$name] = $time;
	}
}