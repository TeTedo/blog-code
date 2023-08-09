package webclient.example.springbootwebclient.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class testController {
    private final WebClient webClient;

    @GetMapping("test")
    public ResponseEntity<String> getDataFrom8080() {
        String data = webClient.post()
                .uri("test")
                .retrieve()
                .bodyToMono(String.class)
                .block();
        ;
        return ResponseEntity.ok().body(data);
    }
}
