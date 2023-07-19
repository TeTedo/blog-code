package com.example.springsecurityoauth.global.oauth.dto;

import com.example.springsecurityoauth.domain.user.model.User;
import lombok.Getter;

import java.io.Serializable;

@Getter
public class SessionUser implements Serializable {
    private String name;
    private String email;

    public SessionUser(User user) {
        name = user.getName();
        email = user.getEmail();
    }
}
