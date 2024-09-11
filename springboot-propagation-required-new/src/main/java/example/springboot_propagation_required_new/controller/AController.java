package example.springboot_propagation_required_new.controller;

import example.springboot_propagation_required_new.service.AService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class AController {

    private final AService aService;

    @GetMapping("/test")
    public void aTest() {
        aService.main();
    }

    @GetMapping("/test2")
    public void aTest2() {
        aService.main2();
    }
}
