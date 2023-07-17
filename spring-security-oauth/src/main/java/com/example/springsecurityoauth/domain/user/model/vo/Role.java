package com.example.springsecurityoauth.domain.user.model.vo;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public enum Role {
    GUEST("ROLE_GUEST", "게스트"),
    USER("ROLE_USER", "유저");

    private final String type;
    private final String role;
}
