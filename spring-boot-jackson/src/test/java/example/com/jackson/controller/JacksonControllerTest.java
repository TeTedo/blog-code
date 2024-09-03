package example.com.jackson.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(JacksonController.class)
class JacksonControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void testMapRequest() throws Exception {
        String requestBody = "{\"input1\":\"value1\",\"input2\":\"value2\"}";

        mockMvc.perform(MockMvcRequestBuilders.post("/mapRequest")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(content().string(containsString("value1")))
                .andExpect(content().string(containsString("value2")));
    }

    @Test
    void testDtoRequest() throws Exception {
        String requestBody = "{\"input1\":\"value1\",\"input2\":\"value2\"}";

        mockMvc.perform(MockMvcRequestBuilders.post("/dtoRequest")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(content().string(containsString("value1")))
                .andExpect(content().string(containsString("value2")));
    }

    @Test
    void testJsonFormatRequest() throws Exception {
        String input1 = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        String requestBody = String.format("{\"input1\":\"%s\",\"input2\":\"value2\"}", input1);

        mockMvc.perform(MockMvcRequestBuilders.post("/jsonFormatRequest")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(content().string(containsString("value2")))
                .andExpect(content().string(containsString(input1)));
    }

    @Test
    void testDeserializeDtoRequest() throws Exception {
        String input1 = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        String requestBody = String.format("{\"input1\":\"%s\",\"input2\":\"value2\"}", input1);

        mockMvc.perform(MockMvcRequestBuilders.post("/deserializeDtoRequest")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(content().string(containsString("value2")))
                .andExpect(content().string(containsString(input1)));
    }

    @Test
    void testDeserializeCustomDtoRequest() throws Exception {
        String requestBody = "{\"input1\":\"value1\",\"input2\":\"value2\"}";

        mockMvc.perform(MockMvcRequestBuilders.post("/deserializeCustomDtoRequest")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(content().string(containsString("value1")))
                .andExpect(content().string(containsString("value2")));
    }
}