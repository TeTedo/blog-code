package com.example.gateway.filter;

import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
@Slf4j
public class CustomGlobalFilter implements GlobalFilter, Ordered {

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        log.info("Custom Global Filter executed");

        // 요청 정보 로깅
        ServerHttpRequest request = exchange.getRequest();
        log.info("Request URI: {}", request.getURI());
        log.info("Request Method: {}", request.getMethod());

        // 응답 정보 로깅을 위한 후처리
        return chain.filter(exchange)
                .then(Mono.fromRunnable(() -> {
                    ServerHttpResponse response = exchange.getResponse();
                    log.info("Response Status Code: {}", response.getStatusCode());
                }));
    }

    @Override
    public int getOrder() {
        return -1; // 필터 체인에서 가장 먼저 실행되도록 설정
    }
}