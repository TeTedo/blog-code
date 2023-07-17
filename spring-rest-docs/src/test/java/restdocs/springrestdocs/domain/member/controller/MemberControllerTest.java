package restdocs.springrestdocs.domain.member.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.restdocs.RestDocumentationContextProvider;
import org.springframework.restdocs.RestDocumentationExtension;
import org.springframework.restdocs.mockmvc.MockMvcRestDocumentation;
import org.springframework.restdocs.payload.PayloadDocumentation;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

@WebMvcTest({ MemberController.class })
@ExtendWith(RestDocumentationExtension.class)
public class MemberControllerTest {

    private MockMvc mockMvc;

    @BeforeEach
    void setUp(
            WebApplicationContext webApplicationContext,
            RestDocumentationContextProvider restDocumentationContextProvider) {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext)
                .apply(MockMvcRestDocumentation.documentationConfiguration(restDocumentationContextProvider))
                .build();
    }

    @Test
    @DisplayName("REST Docs TEST")
    void writeDoc() throws Exception {
        ResultActions resultActions = mockMvc.perform(
                MockMvcRequestBuilders.get("/members"));

        resultActions.andExpect(MockMvcResultMatchers.status().isOk())
                // REST Docs 작성 시작
                .andDo(
                        MockMvcRestDocumentation.document(
                                // member 라는 폴더이름으로 adoc 생성된다.
                                "member",
                                PayloadDocumentation.responseFields(
                                        PayloadDocumentation.fieldWithPath("id").description("ID"),
                                        PayloadDocumentation.fieldWithPath("name").description("name"),
                                        PayloadDocumentation.fieldWithPath("email").description("email"))));
    }
}
