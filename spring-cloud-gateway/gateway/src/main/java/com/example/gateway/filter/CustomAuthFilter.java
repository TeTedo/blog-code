package com.example.gateway.filter;

import com.example.gateway.filter.CustomAuthFilter.Config;
import java.util.List;
import lombok.Data;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
public class CustomAuthFilter extends AbstractGatewayFilterFactory<Config> {

    public CustomAuthFilter() {
        super(Config.class);
    }

    @Data
    public static class Config {
        private String headerName;
        private String headerValue;
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            ServerHttpRequest request = exchange.getRequest();

            // 인증 헤더 검사 로직
            if (!request.getHeaders().containsKey(config.getHeaderName())) {
                return handleUnauthorized(exchange);
            }

            List<String> headerValues = request.getHeaders().get(config.getHeaderName());
            if (headerValues == null || !headerValues.contains(config.getHeaderValue())) {
                return handleUnauthorized(exchange);
            }

            return chain.filter(exchange);
        };
    }

    private Mono<Void> handleUnauthorized(ServerWebExchange exchange) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(HttpStatus.UNAUTHORIZED);
        return response.setComplete();
    }
}