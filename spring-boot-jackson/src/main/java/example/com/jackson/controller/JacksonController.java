package example.com.jackson.controller;

import example.com.jackson.dto.CustomDto;
import example.com.jackson.dto.DeserializeDtoRequest;
import example.com.jackson.dto.DtoRequest;
import example.com.jackson.dto.JsonFormatRequest;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
public class JacksonController {
    @PostMapping("/mapRequest")
    public Map<String, String> mapRequest(@RequestBody Map<String, String> mapRequest) {
        String input1 = mapRequest.get("input1");
        String input2 = mapRequest.get("input2");

        return mapRequest;
    }

    @PostMapping("/dtoRequest")
    public DtoRequest dtoRequest(@RequestBody DtoRequest dtoRequest) {
        String input1 = dtoRequest.getInput1();
        String input2 = dtoRequest.getInput2();

        return dtoRequest;
    }

    @PostMapping("/jsonFormatRequest")
    public JsonFormatRequest jsonFormatRequest(@RequestBody JsonFormatRequest jsonFormatRequest) {
        LocalDateTime input1 = jsonFormatRequest.getInput1();
        String input2 = jsonFormatRequest.getInput2();

        return jsonFormatRequest;
    }

    @PostMapping("/deserializeDtoRequest")
    public DeserializeDtoRequest deserializeDtoRequest(@RequestBody DeserializeDtoRequest deserializeDtoRequest) {
        LocalDateTime input1 = deserializeDtoRequest.getInput1();
        String input2 = deserializeDtoRequest.getInput2();

        return deserializeDtoRequest;
    }

    @PostMapping("/deserializeCustomDtoRequest")
    public CustomDto deserializeCustomDtoRequest(@RequestBody CustomDto customDto) {
        String input1 = customDto.getInput1();
        String input2 = customDto.getInput2();

        return customDto;
    }
}
