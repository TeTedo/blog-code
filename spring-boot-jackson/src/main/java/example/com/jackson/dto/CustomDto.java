package example.com.jackson.dto;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import example.com.jackson.dto.deserializer.DtoDeserializer;
import lombok.Getter;

@Getter
@JsonDeserialize(using = DtoDeserializer.class)
public class CustomDto {
    private final String input1;
    private final String input2;

    public CustomDto(JsonNode node) {
        input1 = node.get("input1").asText();
        input2 = node.get("input2").asText();
    }
}
