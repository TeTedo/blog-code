package com.example.test1.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1/test1")
public class Test1Controller {

    @GetMapping("/hello")
    public String hello() {
        return "Hello from Test1 Service";
    }
}
