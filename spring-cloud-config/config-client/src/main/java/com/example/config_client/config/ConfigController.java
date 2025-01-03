package com.example.config_client.config;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class ConfigController {

    private final MyConfig myConfig;

    @GetMapping("/config")
    public String getConfig() {
        return myConfig.getName() + " " + myConfig.getProfile();
    }
}
