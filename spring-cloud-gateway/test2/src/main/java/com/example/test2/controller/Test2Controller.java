package com.example.test2.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1/test2")
public class Test2Controller {

    @GetMapping("/hello")
    public String hello() {
        return "Hello from Test2 Service";
    }
}
