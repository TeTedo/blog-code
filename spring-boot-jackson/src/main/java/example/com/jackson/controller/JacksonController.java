package example.com.jackson.controller;

import example.com.jackson.dto.DtoRequest;
import example.com.jackson.dto.JsonFormatRequest;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Locale;
import java.util.Map;

@RestController
public class JacksonController {
    @PostMapping("/mapRequest")
    public void mapRequest(@RequestBody Map<String, String> mapRequest) {
        String input1 = mapRequest.get("input1");
        String input2 = mapRequest.get("input2");
    }

    @PostMapping("/dtoRequest")
    public void dtoRequest(@RequestBody DtoRequest dtoRequest) {
        String input1 = dtoRequest.getInput1();
        String input2 = dtoRequest.getInput2();
    }

    @PostMapping("/jsonFormatRequest")
    public void jsonFormatRequest(@RequestBody JsonFormatRequest jsonFormatRequest) {
        LocalDateTime input1 = jsonFormatRequest.getInput1();
        String input2 = jsonFormatRequest.getInput2();
    }
}
