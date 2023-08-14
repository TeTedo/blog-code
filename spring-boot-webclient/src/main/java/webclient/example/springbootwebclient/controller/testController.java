package webclient.example.springbootwebclient.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;

@RestController
@RequiredArgsConstructor
public class testController {
    private final WebClient webClient;

    @GetMapping("test")
    public void getDataFrom8080() {
        Map<String, String> request = new HashMap<>();

        request.put("test", "testData");

        Mono<String> data = webClient.post()
                .uri("test")
                .bodyValue(request)
                .retrieve()
                .bodyToMono(String.class);

        // blocking
        String response1 = data.block();

        // non-blocking
        data.subscribe(string -> System.out.println(string));
    }

    @GetMapping("test2")
    public void errorRetrieve() throws Exception {
        Map<String, String> request = new HashMap<>();

        request.put("test", "testData");

        Mono<String> data = webClient.post()
                .uri("test")
                .bodyValue(request)
                .exchangeToMono(response -> {
                    if (response.statusCode().equals(HttpStatus.OK)) {
                        return response.bodyToMono(String.class);
                    } else {
                        return response.createException().flatMap(Mono::error);
                    }
                });
    }
}
