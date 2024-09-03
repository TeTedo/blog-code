package example.com.jackson.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import example.com.jackson.dto.deserializer.LocalDateTimeDeserializer;
import example.com.jackson.dto.serializer.LocalDateTimeSerializer;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class DeserializeDtoRequest {
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    private LocalDateTime input1;
    private String input2;
}
