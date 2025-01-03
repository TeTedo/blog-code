package com.example.config_client.config;


import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.context.annotation.Configuration;

@Getter
@Setter
@RefreshScope
@ConfigurationProperties(prefix = "")
@Configuration
public class MyConfig {
    private String name;
    private String profile;
}