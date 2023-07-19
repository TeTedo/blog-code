package com.example.springsecurityoauth.global.config.security;

import com.example.springsecurityoauth.domain.user.model.vo.Role;
import com.example.springsecurityoauth.global.oauth.service.CustomOAuth2UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;


@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final CustomOAuth2UserService customOAuth2UserService;

    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // h2-console 화면을 사용하기 위해 해당 옵션들을 disable한다.
                .csrf().disable()
                .headers().frameOptions().disable()
                // URL별 권한 관리를 설정하는 옵션의 시작점
                .and().authorizeHttpRequests()
                // 권한 관리 대상을 지정한느 옵션
                // 지정된 URL들은 permitAll 옵션을 통해 권한을 줌
                // api/v1 주소를 가진 API는 USER 권한을 가진 사람만 가능
                .requestMatchers("/","/css/**","/images/**","/js/**","/h2-console/**").permitAll()
                .requestMatchers("/api/v1/**").hasRole(Role.USER.name())
                // 설정값 이외의 값들, authenticated를 추가하여 나머지는 모두 인증된 사용자에게만 허용(로그인한 사용자)
                .anyRequest().authenticated()
                .and().logout().logoutSuccessUrl("/")
                .and().oauth2Login()
                // OAuth 2 로그인 성공 이후 사용자 정보를 가져올때의 설정
                .userInfoEndpoint()
                // 소셜 로그인 성공 시 후속 조치를 진행할 UserService 인터페이스의 구현체를 등록
                .userService(customOAuth2UserService);


        return http.build();

    }
}
